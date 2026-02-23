# Page Object Model (POM) Implementation Guide

## Overview
This project implements the **Page Object Model** pattern, a best practice for Playwright test automation that improves maintainability, readability, and reusability.

## Project Structure

```
tests/
├── pages/
│   ├── BasePage.ts          # Base class for all pages
│   ├── LoginPage.ts         # Login page object
│   ├── UserDetailsPage.ts   # User details page object
│   └── index.ts             # Export barrel
├── fixtures/
│   └── pages.fixture.ts     # Playwright fixtures for page objects
└── user-details.spec.ts     # Example test file using POM
```

## Key Benefits of POM

1. **Maintainability**: Centralize selectors and element interactions
2. **Reusability**: Shared page methods across multiple tests
3. **Readability**: Tests read like business logic, not technical details
4. **Scalability**: Easy to add new pages or modify existing ones
5. **Reduced Duplication**: Eliminate repeated selector definitions

## Page Classes

### BasePage
The foundation class for all page objects, providing common functionality:

```typescript
- navigateTo(path)          // Navigate to a relative path
- waitForNavigation(action) // Wait for page navigation
- isElementVisible(locator) // Check element visibility
```

### LoginPage
Handles login functionality:

```typescript
- goto()                    // Navigate to login page
- enterEmail(email)         // Enter email address
- enterPassword(password)   // Enter password
- clickLogin()              // Click login button
- login(email, password)    // Complete login flow
```

### UserDetailsPage
Manages user search, details view, and tab navigation:

```typescript
- searchUserById(id)                   // Search user by ID
- researchUserId(id)                   // Clear and search new ID
- viewUserDetails(username)            // View user details
- navigateToTab(tabName)               // Navigate to specific tab
- resetSmsAttempts()                   // Reset SMS attempts
- closeUserDetails()                   // Close user details
- searchAndViewUserDetails(id, name)   // Combined search flow
- viewAllUserTabs()                    // Navigate all tabs
```

## Using Page Objects in Tests

### Option 1: Direct Instantiation
```typescript
import { LoginPage } from './pages/LoginPage';
import { test, expect } from '@playwright/test';

test('login test', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.login('user@example.com', 'password');
});
```

### Option 2: Using Fixtures (Recommended)
```typescript
import { test, expect } from './fixtures/pages.fixture';

test('login test', async ({ loginPage }) => {
  await loginPage.login('user@example.com', 'password');
});
```

## Best Practices Used

### 1. **Locator Management**
- Locators are defined as private properties in the constructor
- Uses semantic locators (`getByRole`, `getByText`) over CSS/XPath when possible
- Selectors are reusable and centralized

```typescript
private emailInput: Locator;

constructor(page: Page) {
  this.emailInput = page.getByRole('textbox', { name: 'Email' });
}
```

### 2. **Wait Strategies**
- Implements intelligent waits using `waitForLoadState()`
- Avoids hard-coded delays
- Uses proper synchronization techniques

```typescript
await this.page.waitForLoadState('networkidle');
await this.page.waitForNavigation({ waitUntil: 'networkidle' });
```

### 3. **Method Naming**
- Clear, descriptive method names that indicate action
- Methods return meaningful results when applicable
- Logical grouping of related actions

```typescript
async searchAndViewUserDetails(userId, username)  // Compound action
async isNoDataMessageVisible()                     // Query method
```

### 4. **Error Handling**
- Graceful error handling in utility methods
- Proper retry logic for flaky operations
- Meaningful error messages

```typescript
async isElementVisible(locator, timeout = 5000): Promise<boolean> {
  try {
    await this.page.locator(locator).waitFor({ state: 'visible', timeout });
    return true;
  } catch {
    return false;
  }
}
```

### 5. **Type Safety**
- Full TypeScript support with proper typing
- Generics for flexible locators
- Clear method signatures

```typescript
async searchUserById(userId: string | number): Promise<void>
async navigateToTab(tabName: 'Payment Trans.' | 'Game Trans.' | 'Player Activity' | 'Login History')
```

## Running Tests

```bash
# Run all tests
npx playwright test

# Run specific test file
npx playwright test user-details.spec.ts

# Run with UI mode
npx playwright test --ui

# Run with specific browser
npx playwright test --project=chromium
```

## Adding New Pages

1. Create a new class extending `BasePage`
2. Define locators in the constructor
3. Create reusable methods for actions
4. Export in `pages/index.ts`
5. Add to fixtures in `fixtures/pages.fixture.ts`

Example:

```typescript
import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class DashboardPage extends BasePage {
  private welcomeMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.welcomeMessage = page.getByRole('heading', { name: /Welcome/ });
  }

  async isWelcomeVisible(): Promise<boolean> {
    return await this.isElementVisible(this.welcomeMessage.toString());
  }
}
```

## Best Practices Checklist

- [x] Semantic locators (getByRole, getByText, getByLabel)
- [x] No hard-coded delays
- [x] Proper wait strategies
- [x] TypeScript for type safety
- [x] Clear method naming
- [x] DRY (Don't Repeat Yourself)
- [x] Single Responsibility Principle
- [x] Comprehensive documentation
- [x] Fixture-based page object injection
- [x] Error handling and assertions

## Resources

- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Page Object Model Pattern](https://playwright.dev/docs/pom)
- [Playwright Fixtures](https://playwright.dev/docs/test-fixtures)
- [Locator Strategies](https://playwright.dev/docs/locators)

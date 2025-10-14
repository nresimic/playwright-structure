# 22vault Web Testing

A comprehensive end-to-end testing framework for the 22vault web application, built with Playwright and TypeScript following industry best practices.

## 🎯 Overview

This project provides automated testing capabilities for the 22vault platform using the Page Object Model (POM) pattern, ensuring maintainable, scalable, and reliable test suites.

## ✨ Features

- **Page Object Model (POM)** - Clean separation of concerns with reusable page classes
- **TypeScript Support** - Full type safety and IntelliSense support
- **Centralized Test Data** - Maintainable test data management
- **Multiple Browser Support** - Test across Chrome, Firefox, Safari, and mobile viewports
- **Comprehensive Reporting** - HTML, JSON, and JUnit reports
- **Best Practices** - Following official Playwright and testing recommendations

## 📁 Project Structure

```
22vault-web-testing/
├── pages/                      # Page Object Model classes
│   └── LoginPage.ts           # Login page implementation
├── test-data/                 # Test data and credentials
│   └── credentials.ts         # User credentials for testing
├── tests/                     # Test specifications
│   └── login.spec.ts          # Login functionality tests
├── tests-examples/            # Example tests from Playwright
│   └── demo-todo-app.spec.ts  # Demo todo app examples
├── playwright.config.ts       # Playwright configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Project dependencies and scripts
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd 22vault-web-testing
```

2. Install dependencies:
```bash
npm install
```

3. Install Playwright browsers:
```bash
npx playwright install
```

## 🧪 Running Tests

```bash
# Run all tests
npm test

# Run tests in headed mode (see browser interactions)
npm run test:headed

# Run tests with interactive UI
npm run test:ui

# View the last test report
npm run report

# Run specific test file
npx playwright test tests/login.spec.ts

# Run tests in debug mode
npx playwright test --debug
```

## ⚙️ Configuration

### Playwright Configuration (`playwright.config.ts`)

- **Base URL**: `http://localhost:8080`
- **Headed Mode**: Enabled by default for development
- **Reporters**: HTML, JSON, and JUnit formats
- **Test Browsers**: 
  - Desktop Chrome
  - Desktop Firefox  
  - Desktop Safari (WebKit)
  - Mobile Chrome
  - Mobile Safari

### TypeScript Configuration

The project uses strict TypeScript settings for enhanced code quality and type safety.

## 📝 Writing Tests

### Using Page Object Model

```typescript
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test('user can login', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('user@example.com', 'password123');
  await expect(page).toHaveURL('/dashboard');
});
```

### Test Data Management

Credentials and other test data are centralized in the `test-data/` directory for easy maintenance and reusability.

## 📊 Test Reports

After running tests, view the HTML report:

```bash
npm run report
```

This opens an interactive report showing:
- Test execution results
- Screenshots and videos of failures
- Execution timeline
- Browser console logs

## 🔧 Development

### Adding New Tests

1. Create a new test file in the `tests/` directory
2. Import necessary page objects from `pages/`
3. Write test cases following the existing patterns
4. Use centralized test data from `test-data/`

### Creating New Page Objects

1. Create a new file in the `pages/` directory
2. Export a class with methods for page interactions
3. Follow the existing patterns in `LoginPage.ts`

## 🐛 Debugging

```bash
# Run in debug mode with Playwright Inspector
npx playwright test --debug

# Run with browser developer tools
npx playwright test --headed --debug

# Generate and update screenshots
npx playwright test --update-snapshots
```

## 📚 Resources

- [Playwright Documentation](https://playwright.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Page Object Model Pattern](https://playwright.dev/docs/pom)

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Ensure all tests pass
4. Submit a pull request

## 👥 Authors

- Brane Resimić
- Nenad Resimić

## 📄 License

ISC

---

**Built with ❤️ using Playwright and TypeScript**
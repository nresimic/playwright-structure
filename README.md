# 22vault Web Testing

E2E testing framework for 22vault web application using Playwright and TypeScript.

## Authors
- **Brane**
- **Nenad Resimić**

## Features

- Page Object Model (POM) pattern
- TypeScript support with full type safety
- Multiple browser testing (Chrome, Firefox, Safari)
- HTML reporting with screenshots
- Centralized test data management

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

## Quick Start

```bash
npm install
npx playwright install
npm test
```

## Running Tests

```bash
npm test              # Run all tests
npm run test:headed   # Run with browser UI
npm run report        # View test results
```

## Configuration

- Base URL: `http://localhost:8080`
- Browsers: Chrome, Firefox, Safari
- Reports: HTML with screenshots and videos
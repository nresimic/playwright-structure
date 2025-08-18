# Playwright Testing Framework

A well-structured Playwright testing framework following best practices with Page Object Model (POM) pattern.

## Features

- **Page Object Model (POM)** - Clean separation of page logic and test logic
- **TypeScript Support** - Full TypeScript configuration with type safety
- **Centralized Test Data** - Reusable test data separated from test logic
- **Best Practices** - Following official Playwright recommendations

## Project Structure

```
├── pages/           # Page Object Model classes
├── test-data/       # Centralized test data
├── tests/           # Test specifications
├── playwright.config.ts  # Playwright configuration
└── tsconfig.json    # TypeScript configuration
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Install Playwright browsers:
```bash
npx playwright install
```

## Running Tests

```bash
# Run all tests
npm test

# Run tests in headed mode (show browser)
npm run test:headed

# Run tests with UI
npm run test:ui

# View HTML report
npm run report
```

## Configuration

- **Base URL**: Set to `http://localhost:8080`
- **Headed Mode**: Enabled by default for development
- **Reporters**: HTML, JSON, and JUnit reports
- **Multiple Browsers**: Chrome, Firefox, Safari, Mobile viewports
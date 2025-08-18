import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { invalidCredentials, invalidEmails } from '../test-data/credentials';

test.describe('Login Tests', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });


  test('should validate empty fields', async ({ page }) => {
    await loginPage.clickLetsGo();
    await loginPage.clickSignIn();
    
    await loginPage.expectToBeOnLoginPage();
  });

  test('should validate email format - no at symbol', async ({ page }) => {
    await loginPage.clickLetsGo();
    await loginPage.fillCredentials(invalidEmails.noAtSymbol.email, invalidEmails.noAtSymbol.password);
    await loginPage.clickSignIn();
    await loginPage.expectToBeOnLoginPage();
  });


  test('should validate email format - no local part', async ({ page }) => {
    await loginPage.clickLetsGo();
    await loginPage.fillCredentials(invalidEmails.noLocalPart.email, invalidEmails.noLocalPart.password);
    await loginPage.clickSignIn();
    await loginPage.expectToBeOnLoginPage();
  });

  test('should validate email format - with spaces', async ({ page }) => {
    await loginPage.clickLetsGo();
    await loginPage.fillCredentials(invalidEmails.withSpaces.email, invalidEmails.withSpaces.password);
    await loginPage.clickSignIn();
    await loginPage.expectToBeOnLoginPage();
  });
});
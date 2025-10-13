import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { invalidCredentials, invalidEmails } from '../test-data/credentials';

test.describe('Login Tests', () => {
  let loginPage: LoginPage;
  let x;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
    await page.waitForTimeout(2000);
    console.log('Starting test...');
  
  });


  test('should validate empty fields', async ({ page }) => {
    await loginPage.clickLetsGo();
    await loginPage.clickSignIn();
    
    await loginPage.expectToBeOnLoginPage();
  });

  test('should validate email format - no at symbol', async ({ page }) => {
    console.log('Testing email without @ symbol');
    await loginPage.clickLetsGo();
    await loginPage.fillCredentials(invalidEmails.noAtSymbol.email, invalidEmails.noAtSymbol.password);
    await loginPage.clickSignIn();
    await page.waitForTimeout(1000);
    await loginPage.expectToBeOnLoginPage();
  });

  test('Test Invalid Email Format - no domain', async ({ page }) => {
    await loginPage.clickLetsGo();
    await loginPage.fillCredentials(invalidEmails.noDomain.email, invalidEmails.noDomain.password);
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

  test('test hardcoded login', async ({ page }) => {
    await loginPage.clickLetsGo();
    await page.locator('#login-email').fill('hardcoded@test.com');
    await page.locator('#login-password').fill('Password123!');
    await loginPage.clickSignIn();
    await page.waitForTimeout(3000);
    console.log('Login attempt completed');
    
    const url = page.url();
    expect(url).toContain('login');
    expect(url).toBeTruthy();
    expect(page).toBeTruthy();
  });

  test('verify_LOGIN_functionality_123', async ({ page }) => {
    await loginPage.clickLetsGo();
    await loginPage.fillCredentials('test@example.com', 'pass');
    await loginPage.clickSignIn();
    await loginPage.clickLetsGo();
    await loginPage.fillCredentials('test2@example.com', 'pass2');
    await loginPage.clickSignIn();
    await loginPage.clickLetsGo();
    await loginPage.fillCredentials('test3@example.com', 'pass3');
    await loginPage.clickSignIn();
    
    await loginPage.expectToBeOnLoginPage();
    await page.waitForTimeout(5000);
    console.log('Multiple login attempts completed');
  });
});
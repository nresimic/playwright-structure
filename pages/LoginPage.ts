import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly letsGoButton: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.letsGoButton = page.getByTestId('lets-go-button');
    this.emailInput = page.locator('#login-email');
    this.passwordInput = page.locator('#login-password');
    this.signInButton = page.getByRole('button', { name: 'Sign in' });
  }

  async goto() {
    await this.page.goto('/login');
  }

  async clickLetsGo() {
    await this.letsGoButton.click();
  }

  async fillCredentials(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
  }

  async clickSignIn() {
    await this.signInButton.click();
  }

  async login(email: string, password: string) {
    await this.clickLetsGo();
    await this.fillCredentials(email, password);
    await this.clickSignIn();
  }

  async expectToBeOnLoginPage() {
    await expect(this.page).toHaveURL(/.*login/);
  }

  async expectToBeOnAccountsPage() {
    await expect(this.page).toHaveURL(/.*accounts/);
  }

  async getPasswordValue() {
    return await this.passwordInput.inputValue();
  }

  async isPasswordCleared() {
    const value = await this.getPasswordValue();
    return value === '';
  }
}
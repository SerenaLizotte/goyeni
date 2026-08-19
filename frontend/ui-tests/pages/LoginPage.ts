import { Page } from "@playwright/test";
import { findResilient } from "../helpers/selfHealingLocator";

export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto("/");
  }

  async loginOrRegister(email: string, firstName?: string, lastName?: string) {
    const emailInput = await findResilient(this.page, [
      { name: "data-testid", locate: (p) => p.getByTestId("login-email-input") },
      { name: "label text", locate: (p) => p.getByLabel("Email") },
      { name: "input type=email", locate: (p) => p.locator('input[type="email"]') },
    ]);
    await emailInput.locator.fill(email);

    if (firstName) {
      const firstNameInput = await findResilient(this.page, [
        { name: "data-testid", locate: (p) => p.getByTestId("login-firstname-input") },
        { name: "label text", locate: (p) => p.getByLabel("First Name (if new)") },
      ]);
      await firstNameInput.locator.fill(firstName);
    }

    if (lastName) {
      const lastNameInput = await findResilient(this.page, [
        { name: "data-testid", locate: (p) => p.getByTestId("login-lastname-input") },
        { name: "label text", locate: (p) => p.getByLabel("Last Name (if new)") },
      ]);
      await lastNameInput.locator.fill(lastName);
    }

    const loginButton = await findResilient(this.page, [
      { name: "data-testid", locate: (p) => p.getByTestId("login-button") },
      { name: "role+name", locate: (p) => p.getByRole("button", { name: "Log In" }) },
    ]);
    await loginButton.locator.click();
  }
}

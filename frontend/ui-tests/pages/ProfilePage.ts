import { Page } from "@playwright/test";
import { findResilient } from "../helpers/selfHealingLocator";

export class ProfilePage {
  constructor(private page: Page) {}

  async getWelcomeText(): Promise<string> {
    const welcome = await findResilient(this.page, [
      { name: "data-testid", locate: (p) => p.getByTestId("welcome-message") },
      { name: "text content", locate: (p) => p.getByText("Logged in as") },
    ]);
    return (await welcome.locator.textContent()) ?? "";
  }

  async editHeadline(headline: string) {
    const headlineInput = await findResilient(this.page, [
      { name: "data-testid", locate: (p) => p.getByTestId("profile-headline-input") },
      { name: "label text", locate: (p) => p.getByLabel("Headline") },
    ]);
    await headlineInput.locator.fill(headline);
  }

  async editFirstName(firstName: string) {
    const firstNameInput = await findResilient(this.page, [
      { name: "data-testid", locate: (p) => p.getByTestId("profile-firstname-input") },
      { name: "label text", locate: (p) => p.getByLabel("First Name") },
    ]);
    await firstNameInput.locator.fill(firstName);
  }

  async save() {
    const saveButton = await findResilient(this.page, [
      { name: "data-testid", locate: (p) => p.getByTestId("save-profile-button") },
      { name: "role+name", locate: (p) => p.getByRole("button", { name: "Save Profile" }) },
    ]);
    await saveButton.locator.click();
  }

  async getSaveMessage(): Promise<string> {
    const saveMessage = await findResilient(this.page, [
      { name: "data-testid", locate: (p) => p.getByTestId("save-message") },
      { name: "text content", locate: (p) => p.getByText("Profile saved") },
    ]);
    return (await saveMessage.locator.textContent()) ?? "";
  }

  async getFirstNameValue(): Promise<string> {
    const firstNameInput = await findResilient(this.page, [
      { name: "data-testid", locate: (p) => p.getByTestId("profile-firstname-input") },
      { name: "label text", locate: (p) => p.getByLabel("First Name") },
    ]);
    return await firstNameInput.locator.inputValue();
  }
}

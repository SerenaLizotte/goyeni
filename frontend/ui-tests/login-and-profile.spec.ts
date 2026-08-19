import { test, expect } from "@playwright/test";
import { LoginPage } from "./pages/LoginPage";
import { ProfilePage } from "./pages/ProfilePage";

test.describe("Candidate login and profile", () => {
  test("a new candidate can log in and edit their profile", async ({ page }) => {
    const loginPage = new LoginPage(page);
    const profilePage = new ProfilePage(page);

    const testEmail = `pw-ui-${Date.now()}@example.com`;

    await loginPage.goto();
    await loginPage.loginOrRegister(testEmail, "Playwright", "UITest");

    const welcomeText = await profilePage.getWelcomeText();
    expect(welcomeText).toContain(testEmail);

    await profilePage.editHeadline("Senior QA Automation Engineer");
    await profilePage.save();

    const saveMessage = await profilePage.getSaveMessage();
    expect(saveMessage).toContain("Profile saved");
  });
});

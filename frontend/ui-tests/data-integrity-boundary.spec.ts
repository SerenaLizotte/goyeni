import { test, expect } from "@playwright/test";
import { LoginPage } from "./pages/LoginPage";
import { ProfilePage } from "./pages/ProfilePage";

/**
 * This test exists to prove a boundary: self-healing selectors only
 * affect HOW an element is located, never WHAT is asserted about it.
 *
 * If the actual saved data is wrong - a real product/backend regression -
 * this test MUST fail, even though every selector resolves perfectly
 * and no healing is needed at all. Self-healing does not, and should
 * never, mask an incorrect result.
 */
test.describe("Data integrity boundary (self-healing must not hide this)", () => {
  test("saved first name must exactly match what was submitted", async ({ page }) => {
    const loginPage = new LoginPage(page);
    const profilePage = new ProfilePage(page);

    const testEmail = `pw-integrity-${Date.now()}@example.com`;
    const submittedFirstName = "Genuine";

    await loginPage.goto();
    await loginPage.loginOrRegister(testEmail, submittedFirstName, "Candidate");

    await profilePage.editFirstName(submittedFirstName);
    await profilePage.save();

    await page.reload();
    await loginPage.loginOrRegister(testEmail);

    const persistedFirstName = await profilePage.getFirstNameValue();

    expect(persistedFirstName).toBe(submittedFirstName);
  });
});

import { Page, Locator } from "@playwright/test";

export interface SelectorStrategy {
  name: string;
  locate: (page: Page) => Locator;
}

export interface HealingResult {
  locator: Locator;
  strategyUsed: string;
  healed: boolean;
}

/**
 * Tries a list of selector strategies in priority order until one
 * finds a visible element. Logs which strategy succeeded.
 *
 * "healed: true" means the primary (first) strategy did NOT work,
 * and a fallback strategy had to be used instead - this is the
 * signal that the UI changed but the test still recovered.
 */
export async function findResilient(
  page: Page,
  strategies: SelectorStrategy[],
  timeoutMs = 3000
): Promise<HealingResult> {
  for (let i = 0; i < strategies.length; i++) {
    const strategy = strategies[i];
    const locator = strategy.locate(page);

    try {
      await locator.first().waitFor({ state: "visible", timeout: timeoutMs });
      const healed = i > 0;

      if (healed) {
        console.warn(
          `[SELF-HEALING] Primary selector failed. Healed using fallback strategy #${i + 1}: "${strategy.name}"`
        );
      }

      return { locator: locator.first(), strategyUsed: strategy.name, healed };
    } catch {
      // this strategy didn't find anything in time - try the next one
      continue;
    }
  }

  throw new Error(
    `[SELF-HEALING] All ${strategies.length} selector strategies failed. Element could not be found by any method: ${strategies.map((s) => s.name).join(", ")}`
  );
}

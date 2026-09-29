import { expect, test } from "@playwright/test";

const IDS = ["inicio", "salas", "curadoria", "perguntas", "trilhas", "artigos", "comunidade", "faq"];

test("the whole page renders with no console errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(/A porta\s*está aberta/);
  for (const id of IDS) {
    await page.locator(`#${id}`).scrollIntoViewIfNeeded();
    await expect(page.locator(`#${id}`)).toBeAttached();
  }
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(800);
  await expect(page.getByRole("contentinfo")).toContainText("A Sala dos Buscadores");
  expect(errors).toEqual([]);
});

test("no horizontal scroll", async ({ page }) => {
  await page.goto("/");
  for (let y = 0; y < 30; y++) {
    await page.mouse.wheel(0, 1200);
    await page.waitForTimeout(60);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  }
});

test("reduced motion: scenes are not pinned", async ({ page }, info) => {
  test.skip(info.project.name !== "reduced");
  await page.goto("/");
  for (const id of ["inicio", "salas", "curadoria", "perguntas", "trilhas"]) {
    await expect(page.locator(`#${id}`)).toHaveAttribute("data-reduced", "true");
  }
  await expect(page.getByTestId("frame-sequence")).toHaveCount(0);
});

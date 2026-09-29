import { expect, test, type Locator } from "@playwright/test";

/** Effective visibility of an element: opacity of it and every ancestor, clip-path, and viewport overlap. */
async function visibility(locator: Locator) {
  return locator.evaluate((el) => {
    let opacity = 1;
    let clipped = false;
    for (let n: Element | null = el; n; n = n.parentElement) {
      const cs = getComputedStyle(n);
      opacity *= Number(cs.opacity);
      if (cs.clipPath.startsWith("inset(50%")) clipped = true;
    }
    const r = el.getBoundingClientRect();
    const inViewport = r.bottom > 0 && r.right > 0 && r.top < innerHeight && r.left < innerWidth;
    return { opacity, clipped, inViewport };
  });
}

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
  await expect(page.getByTestId("hero-arch")).not.toHaveAttribute("style", /scale/);
});

test("keyboard: tabbing from the Salas cards into Curadoria lands on a visible control", async ({ page }, info) => {
  test.skip(info.project.name !== "desktop");
  await page.goto("/");
  const cards = page.locator("#salas a");
  await expect(cards).toHaveCount(5);
  await cards.last().focus();
  await page.keyboard.press("Tab");
  const focused = page.locator("#curadoria :focus");
  await expect(focused).toHaveCount(1);
  await expect.poll(() => visibility(focused)).toEqual({ opacity: expect.any(Number), clipped: false, inViewport: true });
  await expect.poll(async () => (await visibility(focused)).opacity).toBeGreaterThan(0.5);
});

test("nav anchors land pinned scenes on their revealed frame", async ({ page }, info) => {
  test.skip(info.project.name !== "desktop");
  await page.goto("/");
  await page.getByRole("navigation", { name: "Principal" }).getByRole("link", { name: "A Sala", exact: true }).click();
  await expect(page).toHaveURL(/#curadoria$/);
  const cta = page.locator("#curadoria").getByRole("link", { name: "Entrar no acervo" });
  await expect.poll(() => visibility(cta), { timeout: 10_000 }).toEqual({ opacity: 1, clipped: false, inViewport: true });
});

test("the Hero CTA leaves the tab order once it has faded", async ({ page }, info) => {
  test.skip(info.project.name !== "desktop");
  await page.goto("/");
  const cta = page.locator("#inicio").getByRole("link", { name: "Entrar no acervo" });
  await expect(cta.locator("xpath=ancestor::*[@inert]")).toHaveCount(0);
  await page.evaluate(() => window.scrollTo(0, innerHeight * 1.5));
  await expect(cta.locator("xpath=ancestor::*[@inert]")).toHaveCount(1);
});

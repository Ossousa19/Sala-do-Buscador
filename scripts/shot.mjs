import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";

const [, , id = "inicio", progress = "0", width = "1440"] = process.argv;
const w = Number(width);
mkdirSync("shots", { recursive: true });
const out = `shots/${id}-${progress}-${w}.png`;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: w, height: w < 768 ? 812 : 900 } });
const base = process.env.BASE_URL ?? "http://localhost:3111";
await page.goto(base);
await page.waitForLoadState("networkidle");
const title = await page.title();
if (!title.includes("A Sala dos Buscadores")) throw new Error(`${base} is not this app (title: "${title}")`);
await page.evaluate(([sectionId, p]) => {
  const el = document.getElementById(sectionId);
  if (!el) throw new Error(`section #${sectionId} not found`);
  const top = el.getBoundingClientRect().top + window.scrollY;
  const range = Math.max(0, el.offsetHeight - window.innerHeight);
  window.scrollTo(0, top + range * p);
}, [id, Number(progress)]);
await page.waitForTimeout(900);
await page.screenshot({ path: out });
await browser.close();
console.log(out);

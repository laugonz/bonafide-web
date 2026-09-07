import fs from "node:fs";
import path from "node:path";
import { guides } from "../src/data.mjs";
const dist = path.resolve(import.meta.dirname, "../dist");
const assert = (condition, message) => { if (!condition) throw new Error(message); };
const legalPages = ["privacy/index.html", "terms/index.html", "es/privacy/index.html", "es/terms/index.html", "support/index.html"];
const pages = ["index.html", "guides/index.html", ...guides.map(g=>`guides/${g.slug}/index.html`), ...legalPages];
for (const page of pages) {
  const html = fs.readFileSync(path.join(dist,page),"utf8");
  assert((html.match(/<h1[ >]/g)||[]).length===1, `${page}: expected one H1`);
  assert(html.includes('rel="canonical"'), `${page}: missing canonical`);
  assert(html.includes('src="/_vercel/insights/script.js"'), `${page}: missing Vercel Web Analytics`);
  for (const item of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) JSON.parse(item[1]);
}
const sitemap = fs.readFileSync(path.join(dist,"sitemap.xml"),"utf8");
for (const guide of guides) assert(sitemap.includes(`/guides/${guide.slug}/`), `sitemap missing ${guide.slug}`);
const home = fs.readFileSync(path.join(dist,"index.html"),"utf8");
assert(home.includes("FAQPage"), "homepage FAQ schema missing");
assert(home.includes('href="https://bonafidesie.com/download/web/"'), "homepage App Store CTA missing");
assert(home.includes('app-id=6792458131'), "homepage Smart App Banner missing");
assert(!home.includes("App Store soon"), "homepage still says the app is coming soon");
assert(!home.includes("www.emdrflow.app/bonafide"), "homepage still links to old legal domain");
for (const page of legalPages) {
  const html = fs.readFileSync(path.join(dist, page), "utf8");
  assert(html.includes('mailto:hello@emdrflow.app'), `${page}: support contact missing`);
  assert(sitemap.includes(`/${page.replace('index.html', '')}`), `${page}: missing from sitemap`);
  assert(!html.includes("RevenueCat"), `${page}: outdated subscription provider`);
  if (page.startsWith("es/")) assert(html.includes('<html lang="es">'), `${page}: wrong language`);
  if (page.includes("privacy/")) {
    assert(html.includes("Superwall") && html.includes("Vercel Web Analytics"), `${page}: missing provider disclosures`);
    assert((html.match(/<section>/g) || []).length === 8, `${page}: policy sections lost`);
  }
  if (page.includes("terms/")) assert((html.match(/<section>/g) || []).length === 8, `${page}: terms sections lost`);
}
assert(fs.readFileSync(path.join(dist,"robots.txt"),"utf8").includes("OAI-SearchBot"), "LLM crawler allowance missing");
assert(fs.existsSync(path.join(dist,"llms.txt")), "llms.txt missing");
console.log(`Verified ${pages.length} static pages, schema, sitemap, crawler rules and llms.txt.`);

import fs from "node:fs";
import path from "node:path";
import { guides } from "../src/data.mjs";
const dist = path.resolve(import.meta.dirname, "../dist");
const assert = (condition, message) => { if (!condition) throw new Error(message); };
const pages = ["index.html", "guides/index.html", ...guides.map(g=>`guides/${g.slug}/index.html`)];
for (const page of pages) {
  const html = fs.readFileSync(path.join(dist,page),"utf8");
  assert((html.match(/<h1[ >]/g)||[]).length===1, `${page}: expected one H1`);
  assert(html.includes('rel="canonical"'), `${page}: missing canonical`);
  for (const item of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) JSON.parse(item[1]);
}
const sitemap = fs.readFileSync(path.join(dist,"sitemap.xml"),"utf8");
for (const guide of guides) assert(sitemap.includes(`/guides/${guide.slug}/`), `sitemap missing ${guide.slug}`);
const home = fs.readFileSync(path.join(dist,"index.html"),"utf8");
assert(home.includes("FAQPage"), "homepage FAQ schema missing");
assert(fs.readFileSync(path.join(dist,"robots.txt"),"utf8").includes("OAI-SearchBot"), "LLM crawler allowance missing");
assert(fs.existsSync(path.join(dist,"llms.txt")), "llms.txt missing");
console.log(`Verified ${pages.length} static pages, schema, sitemap, crawler rules and llms.txt.`);

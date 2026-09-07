import fs from "node:fs";
import path from "node:path";
import { site } from "../site.config.mjs";
import { faqs, guides } from "../src/data.mjs";

const root = path.resolve(import.meta.dirname, "..");
const dist = path.join(root, "dist");
const appUrl = site.appStoreUrl || "#app-store";
const official = "https://www.finra.org/registration-exams-ce/qualification-exams/securities-industry-essentials-exam-sie";
const esc = (value) => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
const absolute = (p) => `${site.url}${p}`;
const pagePath = (p) => path.join(dist, p.replace(/^\//, ""), "index.html");

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });
fs.cpSync(path.join(root, "public"), dist, { recursive: true });

function schema(extra = []) {
  return JSON.stringify({ "@context": "https://schema.org", "@graph": [
    { "@type": "Organization", "@id": `${site.url}/#organization`, name: site.name, url: `${site.url}/`, email: "hello@emdrflow.app" },
    { "@type": "WebSite", "@id": `${site.url}/#website`, name: site.name, url: `${site.url}/`, inLanguage: "en-US" },
    { "@type": ["SoftwareApplication", "MobileApplication"], "@id": `${site.url}/#app`, name: "Bona Fide: SIE Exam Prep", applicationCategory: "EducationalApplication", operatingSystem: "iOS", description: "SIE exam practice questions, readiness score, timed mock exam and contextual tutor.", isAccessibleForFree: true, featureList: ["1,600+ SIE practice questions", "Readiness score across four FINRA domains", "75-question, 105-minute mock exam", "Tutor explanations for missed questions"], offers: { "@type": "Offer", price: "0", priceCurrency: "USD", availability: "https://schema.org/InStock" }, publisher: { "@id": `${site.url}/#organization` } },
    ...extra,
  ] });
}

function shell({ title, description, canonical, jsonld, body, image = "/assets/app-icon.png" }) {
  const smartBanner = site.appStoreId ? `<meta name="apple-itunes-app" content="app-id=${site.appStoreId}">` : "";
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title><meta name="description" content="${esc(description)}"><link rel="canonical" href="${canonical}"><meta property="og:type" content="website"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${canonical}"><meta property="og:image" content="${absolute(image)}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(description)}"><meta name="twitter:image" content="${absolute(image)}">${smartBanner}<link rel="stylesheet" href="/style.css"><link rel="alternate" type="text/plain" href="/llms.txt" title="LLM product facts"><script type="application/ld+json">${jsonld}</script><script>window.va=window.va||function(){(window.vaq=window.vaq||[]).push(arguments);};</script><script defer src="/_vercel/insights/script.js"></script></head><body>${body}</body></html>`;
}

const nav = `<header class="nav"><a class="brand" href="/"><img src="/assets/app-icon.png" width="42" height="42" alt="">Bona Fide <span>SIE Exam Prep</span></a><nav><a href="/guides/">Study guides</a><a href="${site.legalBase}/privacy">Privacy</a></nav></header>`;
const footer = `<footer><p>© 2026 Bona Fide. Independent SIE exam preparation.</p><p><a href="${official}">FINRA SIE exam information</a> · <a href="${site.legalBase}/privacy">Privacy</a> · <a href="${site.legalBase}/terms">Terms</a></p></footer>`;
const storeCta = `<a class="button" href="${appUrl}"${site.appStoreUrl ? "" : ' aria-disabled="true"'}>Download on the App Store</a>`;
const faqHtml = faqs.map(([q,a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)} <a href="/guides/">Read the study guides.</a></p></details>`).join("");

const home = `<main class="page">${nav}<section class="hero"><div><p class="eyebrow">SIE EXAM PREP FOR IPHONE & IPAD</p><h1>SIE exam prep that tells you what to study next</h1><p class="lead">Practice against the current FINRA outline, see your weakest domain, then build toward exam day one question at a time.</p>${storeCta}<p class="availability" id="app-store">Available now on the App Store.</p></div><img class="hero-phone" src="/assets/screenshots/home.jpg" width="638" height="1386" alt="Bona Fide SIE exam home screen with daily practice and readiness score" fetchpriority="high"></section><section><p class="eyebrow">BUILT AROUND THE REAL SIE</p><h2>Study the format you will face</h2><div class="facts"><article><strong>1,600+</strong><p>Practice questions written to the 2026 FINRA outline and updated as rules change.</p></article><article><strong>75 / 105</strong><p>A full mock exam with 75 questions and a 105-minute clock.</p></article><article><strong>4 domains</strong><p>A readiness view that shows where the most points are sitting.</p></article></div></section><section class="split"><img src="/assets/screenshots/tutor.jpg" width="638" height="1386" loading="lazy" alt="Bona Fide tutor explains why a selected SIE answer is wrong"><div><p class="eyebrow">ANSWER FEEDBACK WITH CONTEXT</p><h2>Miss one? Ask about the exact question.</h2><p>After a wrong answer, Bona Fide explains the choice you selected and lets you ask a follow-up. It is study support, not financial or regulatory advice.</p><a class="text-link" href="/guides/sie-practice-questions/">How to learn from SIE practice questions →</a></div></section><section><p class="eyebrow">SIE STUDY GUIDES</p><h2>Start with the question you have today</h2><div class="cards">${guides.map(g => `<a href="/guides/${g.slug}/"><h3>${esc(g.title)}</h3><p>${esc(g.description)}</p><span>Read guide →</span></a>`).join("")}</div></section><section class="faq"><p class="eyebrow">COMMON SIE QUESTIONS</p><h2>Before you begin</h2>${faqHtml}</section><section class="final"><h2>Make the next study session count.</h2><p>Set your exam date, answer a short set, and let the next topic come from your actual results.</p>${storeCta}</section>${footer}</main>`;

const homeFaq = { "@type": "FAQPage", "@id": `${site.url}/#faq`, mainEntity: faqs.map(([q,a]) => ({ "@type": "Question", name:q, acceptedAnswer:{ "@type":"Answer", text:a } })) };
fs.writeFileSync(path.join(dist, "index.html"), shell({ title:"Bona Fide — SIE Exam Prep for iPhone & iPad", description:"SIE exam prep with current-outline practice questions, a readiness score, timed mock exams and answer explanations.", canonical:`${site.url}/`, jsonld:schema([homeFaq]), body:home }));

const guideCards = guides.map(g => `<a href="/guides/${g.slug}/"><img src="/assets/guides/${g.featureImage}" width="1536" height="1024" loading="lazy" alt="${esc(g.featureAlt)}"><h2>${esc(g.title)}</h2><p>${esc(g.description)}</p></a>`).join("");
fs.mkdirSync(path.join(dist,"guides"),{recursive:true});
fs.writeFileSync(path.join(dist,"guides/index.html"), shell({ title:"SIE Exam Study Guides | Bona Fide", description:"Clear SIE exam study guides for practice questions, timed mocks, study plans and the FINRA content outline.", canonical:`${site.url}/guides/`, jsonld:schema([{ "@type":"CollectionPage", name:"SIE Exam Study Guides", url:`${site.url}/guides/` }]), body:`<main class="page">${nav}<article class="article"><p class="eyebrow">BONA FIDE GUIDES</p><h1>SIE exam study guides</h1><p class="lead">Plain-English guides for planning, practice questions, mock exams and the official SIE outline.</p><div class="cards guides">${guideCards}</div></article>${footer}</main>` }));

for (const g of guides) {
  const canonical = `${site.url}/guides/${g.slug}/`;
  const guideFaq = g.faq || g.sections.slice(0, 2).map(([h, p]) => [`${h}?`, p]);
  const guideFaqHtml = guideFaq.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join("");
  const body = `<main class="page">${nav}<article class="article"><figure class="feature"><img src="/assets/guides/${g.featureImage}" width="1536" height="1024" loading="eager" alt="${esc(g.featureAlt)}"><figcaption>${esc(g.featureAlt)}</figcaption></figure><p class="eyebrow">SIE EXAM STUDY GUIDE</p><h1>${esc(g.h1)}</h1><p class="lead">${esc(g.intro)}</p><p class="meta">Reviewed ${site.reviewed}. Based on FINRA's published SIE format and content outline.</p><figure><img src="/assets/screenshots/${g.screenshot}" width="638" height="1386" loading="lazy" alt="${esc(g.screenshotAlt)}"><figcaption>Bona Fide: ${esc(g.screenshotAlt)}</figcaption></figure>${g.sections.map(([h,p], index) => `<section><h2>${esc(h)}</h2><p>${esc(p)}</p>${index===1 ? `<aside><strong>Put this into practice</strong><p>Bona Fide turns a study date and recent answers into a visible next set. Download it on the App Store.</p>${storeCta}</aside>` : ""}</section>`).join("")}<section><h2>Keep the official outline nearby</h2><p>FINRA's content outline is the authoritative source for what can be tested. Use this guide to organize your study, then check the original whenever you need the exact wording or current exam information.</p><p><a class="text-link" href="${official}">Read FINRA's SIE exam information →</a></p></section><section class="faq"><h2>Questions about this SIE guide</h2>${guideFaqHtml}</section><section class="related"><h2>Related SIE study guides</h2>${guides.filter(x=>x.slug!==g.slug).slice(0,3).map(x=>`<a href="/guides/${x.slug}/">${esc(x.title)}</a>`).join("")}</section></article>${footer}</main>`;
  const article = { "@type":"Article", headline:g.title, description:g.description, mainEntityOfPage:canonical, dateModified:site.reviewed, author:{"@type":"Organization",name:"Bona Fide"}, about:{"@id":`${site.url}/#app`}, image:absolute(`/assets/guides/${g.featureImage}`) };
  const breadcrumb = { "@type":"BreadcrumbList", itemListElement:[{"@type":"ListItem",position:1,name:"Bona Fide",item:`${site.url}/`},{"@type":"ListItem",position:2,name:"SIE study guides",item:`${site.url}/guides/`},{"@type":"ListItem",position:3,name:g.title,item:canonical}] };
  const output = pagePath(`/guides/${g.slug}/`);
  fs.mkdirSync(path.dirname(output), { recursive: true });
  const faqSchema = { "@type":"FAQPage", "@id":`${canonical}#faq`, mainEntity: guideFaq.map(([q,a]) => ({ "@type":"Question", name:q, acceptedAnswer:{ "@type":"Answer", text:a } })) };
  fs.writeFileSync(output, shell({ title:`${g.title} | Bona Fide`, description:g.description, canonical, jsonld:schema([article,breadcrumb,faqSchema]), body, image:`/assets/guides/${g.featureImage}` }));
}

const urls = ["/", "/guides/", ...guides.map(g=>`/guides/${g.slug}/`)];
fs.writeFileSync(path.join(dist,"sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(u=>`<url><loc>${site.url}${u}</loc><lastmod>${site.reviewed}</lastmod></url>`).join("")}</urlset>`);
fs.writeFileSync(path.join(dist,"robots.txt"), `User-agent: *\nAllow: /\n\nUser-agent: OAI-SearchBot\nAllow: /\n\nUser-agent: PerplexityBot\nAllow: /\n\nSitemap: ${site.url}/sitemap.xml\n`);

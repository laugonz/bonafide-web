# Bona Fide web content contract

## Product identity

| Field | Value |
| --- | --- |
| Product | Bona Fide: SIE Exam Prep |
| Audience | Adults preparing for the FINRA Securities Industry Essentials (SIE) exam |
| Platform | iPhone and iPad |
| Store status | In App Review on 2026-09-04; App Store URL pending |
| Official exam source | https://www.finra.org/registration-exams-ce/qualification-exams/securities-industry-essentials-exam-sie |
| Legal pages | https://www.emdrflow.app/bonafide/privacy and `/terms` |

## Store-description facts used on the website

- 1,600+ practice questions written against the 2026 FINRA outline and updated when rules change.
- Answer feedback includes a rationale for the selected wrong answer.
- The tutor receives the question and selected option as context; it is study support, not authoritative guidance.
- Readiness is shown across FINRA's four domains and used to direct subsequent practice.
- Mock format: 75 questions in 105 minutes, with the published SIE domain weighting.
- The app has no login or advertising tracking; study progress stays on the device.
- Pro unlocks unlimited questions, mocks and tutor access. The site does not publish pricing until the store page is public.

## Screenshot manifest

| Asset | Visible fact it supports |
| --- | --- |
| `home.jpg` | exam countdown, daily practice, readiness and weakest-domain prompt |
| `quiz.jpg` | multiple-choice SIE question practice |
| `tutor.jpg` | rationale plus contextual follow-up tutor |
| `readiness.jpg` | score and domain-by-domain breakdown |
| `mock.jpg` | timed 75-question mock experience |

## Search-intent map

### Primary terms

- `SIE exam prep` — homepage title, H1 and meta description.
- `SIE practice questions` — homepage feature section and guide.
- `SIE practice exam` — homepage feature section and guide.
- `SIE study plan` — guide and internal links.
- `SIE exam outline` — guide and official FINRA source link.

### Long-tail pages

| Query intent | URL | Bona Fide feature |
| --- | --- | --- |
| how to study for the SIE exam | `/guides/sie-exam-study-plan/` | date-led daily practice and weak-domain focus |
| SIE practice questions | `/guides/sie-practice-questions/` | selected-answer rationale and tutor follow-up |
| SIE practice exam 75 questions | `/guides/sie-practice-exam/` | 75-question, 105-minute mock |
| SIE exam readiness score | `/guides/sie-exam-readiness-score/` | domain-level readiness view |
| SIE exam outline 2026 | `/guides/sie-exam-outline/` | FINRA weighting and current-outline bank |
| how to study Products and Risks SIE | `/guides/products-and-risks-sie/` | targeted practice for the 44% domain |

## SEO and LLM rules

- Do not imply affiliation with FINRA, official status, financial advice, or a guaranteed pass.
- State that FINRA's current exam information and outline are authoritative.
- Keep all product facts in `public/llms.txt` and in visible homepage content.
- Update `site.config.mjs` with the real App Store URL before deployment. That activates the download links and Smart App Banner.
- Six editorial guide images were generated directly in Codex and saved under `public/assets/guides/`. They are 1536×1024, distinct compositions, and contain no text or logos. Do not replace them with stock images or a made-up product UI.

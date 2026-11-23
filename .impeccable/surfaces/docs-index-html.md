---
version: 1
slug: "docs-index-html"
primary_target: "docs/index.html"
related_targets: ["docs/need.html","docs/results.html","docs/services.html"]
---

# 香港社福導航 · 網站（首頁、需要問答、結果、服務詳情）

Scope: `docs/` static site (index, need, results, services). Visitor mode: Operate (find a service and the next contact).
Audience: family carers, frontline social workers, older people; mostly on phones.
Task: plain-language need -> possibly relevant SWD elderly services -> what to confirm -> who to call.
Proof/content: SWD pages read 2026-11-23 (facts in `docs/data.js`, each with source URL and check date). No invented facts, numbers or testimonials.
Constraints: static HTML/CSS + small vanilla JS, GitHub Pages from `/docs`; WCAG 2.2 AA; 320 px; tap-to-call.
Memorable moment: every result card ends with a named person/unit and a phone number you can tap.
Unresolved: unit-level directory by district, self-pay home care providers (not in SWD data), user testing.

## Direction contract

THESIS: Need first, contact last. Refuses the category default of a service-name directory or icon-tile grid as the front door; the front door is "你需要邊方面幫手？".
OWN-WORLD: Category standard played straight (GOV.UK / NHS / 社署長者資訊網 craft bar). White ground, deep green header band, black text, blue underlined links, yellow focus with black underline, green primary button, full-border tinted panels for emergency and "要核實". System CJK sans, two weights.
STORY: Visitor sees emergency numbers, picks needs in everyday words, gets cards saying why a service may fit, what to confirm, and who to call; can read every service in one page.
FIRST VIEWPORT: Header with name; H1 "幫屋企長者搵服務"; one-line promise; green start button "由需要開始" at full width on phone; below it a bordered panel "急事" with 999 and 182 183 as tap-to-call; then "直接睇所有服務" link.
FORM: Canon (category standard), chosen by the user in a safer-register round; not on my ordered list. seed:3c716b04d5fa4e93
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

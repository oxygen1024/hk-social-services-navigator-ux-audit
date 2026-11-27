# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

React 19 + Astryx design system (@astryxdesign/core 0.7.17, user's choice 2026-11-24), built with Vite from `web/` into `docs/` and published with GitHub Pages from `main` `/docs`. Custom theme `hkcare` (based on Neutral, deep green accent, 18px base text on desktop). Service facts live in `web/src/data.js`.

## Users

Three groups, all served by the same pages. Copy must be short and clear enough for all three.

- **Family members / carers** (primary situation): someone says "屋企長者沖涼同着衫要人幫，我想比較資助同自費，有邊個可以聯絡？" They know the daily-life need but not service names such as 家居支援、社區券.
- **Frontline social workers**: use it with families, or to prepare a referral conversation.
- **Older people themselves**: may read on a phone, may have low vision or little patience for long text.

## Product Purpose

Help people go from a plain-language daily-life need to the right Hong Kong elderly service and the next person to contact. Success: a user can name one possibly relevant service, one condition still to confirm, and the unit or hotline to call next.

## Positioning

Starts from the need, not the service name. Joins the three parts other sites each do alone (per the six-site audit): explain the need in everyday words, show what service might fit and what is still unconfirmed, and hand over to a real contact.

## Operating Context

- Mostly used on phones, often while worried or under time pressure.
- Real contact routes in Hong Kong: 長者地區中心／長者鄰舍中心, 綜合家庭服務中心, 醫務社工, service teams, SWD hotlines.
- Many subsidised services need the 安老服務統一評估機制 via a social worker referral; the site explains this, it never performs it.

## Capabilities and Constraints

- Scope: four SWD fields at the level of service types, not individual units: elderly services (16), rehabilitation (10), youth welfare (9) and social security (5), added 2026-11-24. The needs questionnaire asks the field first.
- Since 2026-11-27 also six non-SWD-only fields (115 services in total): 家庭、兒童及危機支援, 教育及學生資助 (WFSFAA, EDB), 醫療及健康 (HA, DH), 房屋 (HA, HB), 就業及培訓 (WFAO, ERB, LD) and 其他支援. Each service may carry `org` (the source department); pages name it instead of 社署.
- Never states "你符合資格". Results say why a service may fit, what still needs confirming, and the next step.
- Every service fact links to an official source and shows a "last checked" date. Unknown fees or waiting times are shown as "向機構查詢", never blank or $0.
- Keep old service names searchable (SWD renamed some home care services).
- Undecided: individual unit directory, map, accounts, AI assistant (all deferred per the audit's P2).

## Brand Commitments

Name: 社福懶人包 (renamed from 香港社福導航 on 2026-11-24). Language: Hong Kong Traditional Chinese. Service facts in standard written Chinese; button and prompt copy may use plain spoken Cantonese ("搵"、"有冇").

Visual standard: since 2026-11-24 the Astryx design system with the custom `hkcare` theme (Neutral base). Earlier (2026-11-23) the category standard played straight (GOV.UK / NHS / 社署長者資訊網 craft bar). Plain, familiar and trustworthy over distinctive. It must not copy any government's branding or crest. All copy in formal written Chinese.

## Evidence on Hand

- `香港社福導航_六站UX實測報告.html` and `香港社福導航_Claude交接報告.md`: six-site UX audit and design handoff (2026-11-23).
- No user testing yet, no testimonials, no usage data. Do not fabricate any.
- The concept document 《香港社福資訊網站：構思書.md》 has not been provided.

## Product Principles

1. Need first: people describe life problems, the site names the service.
2. Honest uncertainty: show what is unconfirmed instead of guessing eligibility.
3. Always a next human: every path ends with someone to call, including "未清楚".
4. Official source or nothing: no fact without a link and a check date.
5. Short words, one task per screen.

## Accessibility & Inclusion

Older users and carers on phones: large readable text, single column, works at 320 CSS px and 200% zoom, keyboard and screen-reader usable, primary actions at least 44×44 CSS px, never rely on colour alone, tap-to-call phone numbers. Target WCAG 2.2 AA.

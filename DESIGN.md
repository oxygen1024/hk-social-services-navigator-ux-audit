---
name: 香港社福導航
description: Need first, contact last. A plain public-service counter for Hong Kong elderly services, built to the GOV.UK / NHS / 社署長者資訊網 craft bar.
colors:
  brand: "#0b4a3f"
  brand-edge: "#0f7a66"
  tag-route: "#dcefe8"
  selection: "#cde5dc"
  go: "#00703c"
  go-dark: "#005a30"
  go-edge: "#002d18"
  link: "#1458a8"
  link-visited: "#4c2c92"
  focus: "#ffdd00"
  alert: "#b3261e"
  alert-bg: "#fdf0ee"
  calls-rule: "#e0c9c5"
  info: "#1458a8"
  info-bg: "#eef4fb"
  threshold-bg: "#f1f8f5"
  chart-elder: "#0b8a62"
  chart-government: "#5b8fd6"
  ink: "#0b0c0c"
  muted: "#484f53"
  paper: "#ffffff"
  panel: "#f3f2f1"
  rule: "#b1b4b6"
  tag-neutral: "#e7e9ea"
typography:
  headline-lg:
    fontFamily: "system-ui, -apple-system, 'PingFang HK', 'Noto Sans HK', 'Microsoft JhengHei', sans-serif"
    fontSize: "2rem"
    fontWeight: 700
    lineHeight: 1.3
  headline-md:
    fontFamily: "system-ui, -apple-system, 'PingFang HK', 'Noto Sans HK', 'Microsoft JhengHei', sans-serif"
    fontSize: "1.75rem"
    fontWeight: 700
    lineHeight: 1.3
  headline-sm:
    fontFamily: "system-ui, -apple-system, 'PingFang HK', 'Noto Sans HK', 'Microsoft JhengHei', sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.3
  title-lg:
    fontFamily: "system-ui, -apple-system, 'PingFang HK', 'Noto Sans HK', 'Microsoft JhengHei', sans-serif"
    fontSize: "1.375rem"
    fontWeight: 700
    lineHeight: 1.3
  title-md:
    fontFamily: "system-ui, -apple-system, 'PingFang HK', 'Noto Sans HK', 'Microsoft JhengHei', sans-serif"
    fontSize: "1.3125rem"
    fontWeight: 700
    lineHeight: 1.3
  title-sm:
    fontFamily: "system-ui, -apple-system, 'PingFang HK', 'Noto Sans HK', 'Microsoft JhengHei', sans-serif"
    fontSize: "1.1875rem"
    fontWeight: 700
    lineHeight: 1.3
  nav:
    fontFamily: "system-ui, -apple-system, 'PingFang HK', 'Noto Sans HK', 'Microsoft JhengHei', sans-serif"
    fontSize: "1.1875rem"
    fontWeight: 700
    lineHeight: 1.6
  wordmark:
    fontFamily: "system-ui, -apple-system, 'PingFang HK', 'Noto Sans HK', 'Microsoft JhengHei', sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.6
  lead:
    fontFamily: "system-ui, -apple-system, 'PingFang HK', 'Noto Sans HK', 'Microsoft JhengHei', sans-serif"
    fontSize: "1.3125rem"
    fontWeight: 400
    lineHeight: 1.6
  body:
    fontFamily: "system-ui, -apple-system, 'PingFang HK', 'Noto Sans HK', 'Microsoft JhengHei', sans-serif"
    fontSize: "1.1875rem"
    fontWeight: 400
    lineHeight: 1.6
  button:
    fontFamily: "system-ui, -apple-system, 'PingFang HK', 'Noto Sans HK', 'Microsoft JhengHei', sans-serif"
    fontSize: "1.1875rem"
    fontWeight: 700
    lineHeight: 1.4
  phone:
    fontFamily: "system-ui, -apple-system, 'PingFang HK', 'Noto Sans HK', 'Microsoft JhengHei', sans-serif"
    fontSize: "1.3125rem"
    fontWeight: 700
    lineHeight: 1.6
    fontFeature: "tnum"
  label:
    fontFamily: "system-ui, -apple-system, 'PingFang HK', 'Noto Sans HK', 'Microsoft JhengHei', sans-serif"
    fontSize: "1rem"
    fontWeight: 700
    lineHeight: 1.6
  small:
    fontFamily: "system-ui, -apple-system, 'PingFang HK', 'Noto Sans HK', 'Microsoft JhengHei', sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  data:
    fontFamily: "system-ui, -apple-system, 'PingFang HK', 'Noto Sans HK', 'Microsoft JhengHei', sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
    fontFeature: "tnum"
rounded:
  none: "0px"
  step-marker: "50%"
  chart-swatch: "2px"
  chart-bar-end: "4px"
spacing:
  xxs: ".25rem"
  xs: ".5rem"
  sm: ".75rem"
  md: "1rem"
  ml: "1.25rem"
  lg: "1.5rem"
  xl: "2rem"
  xxl: "2.5rem"
  xxxl: "3rem"
components:
  header-band:
    backgroundColor: "{colors.brand}"
    textColor: "{colors.paper}"
    typography: "{typography.wordmark}"
    height: "3.75rem"
    padding: "0 1rem"
  topnav:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.link}"
    typography: "{typography.nav}"
  topnav-link:
    textColor: "{colors.link}"
    typography: "{typography.nav}"
    height: "2.75rem"
  topnav-link-current:
    textColor: "{colors.ink}"
    typography: "{typography.nav}"
  crumbs:
    textColor: "{colors.ink}"
    typography: "{typography.small}"
  phase-banner:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.small}"
    padding: ".6rem 1rem"
  phase-tag:
    backgroundColor: "{colors.brand}"
    textColor: "{colors.paper}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0 .4rem"
  button-primary:
    backgroundColor: "{colors.go}"
    textColor: "{colors.paper}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    padding: ".55rem 1.25rem"
    height: "2.875rem"
  button-primary-hover:
    backgroundColor: "{colors.go-dark}"
    textColor: "{colors.paper}"
  button-primary-focus:
    backgroundColor: "{colors.focus}"
    textColor: "{colors.ink}"
  link:
    textColor: "{colors.link}"
  link-visited:
    textColor: "{colors.link-visited}"
  link-focus:
    backgroundColor: "{colors.focus}"
    textColor: "{colors.ink}"
  panel-alert:
    backgroundColor: "{colors.alert-bg}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "1rem 1.25rem"
  panel-info:
    backgroundColor: "{colors.info-bg}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "1rem 1.25rem"
  panel-threshold:
    backgroundColor: "{colors.threshold-bg}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "1rem 1.25rem"
  check-item:
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    padding: ".6rem 0 .6rem 2.25rem"
  key-fact:
    textColor: "{colors.ink}"
    typography: "{typography.title-sm}"
  flow-step:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: ".75rem 1rem .75rem 3.5rem"
  flow-step-marker:
    backgroundColor: "{colors.brand}"
    textColor: "{colors.paper}"
    typography: "{typography.label}"
    rounded: "{rounded.step-marker}"
    size: "2rem"
  table-data-cell:
    textColor: "{colors.ink}"
    typography: "{typography.data}"
    padding: ".6rem .75rem .6rem 0"
  table-data-head:
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    padding: ".6rem .75rem .6rem 0"
  chart-swatch-elder:
    backgroundColor: "{colors.chart-elder}"
    rounded: "{rounded.chart-swatch}"
    size: ".875rem"
  chart-swatch-government:
    backgroundColor: "{colors.chart-government}"
    rounded: "{rounded.chart-swatch}"
    size: ".875rem"
  chart-bar-elder:
    backgroundColor: "{colors.chart-elder}"
    rounded: "{rounded.none}"
    height: "1.25rem"
  chart-bar-government:
    backgroundColor: "{colors.chart-government}"
    rounded: "{rounded.chart-bar-end}"
    height: "1.25rem"
  svc-list-item:
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    padding: "1rem 0"
  calls-item:
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    padding: ".5rem 0"
  phone-link:
    textColor: "{colors.link}"
    typography: "{typography.phone}"
    height: "2.75rem"
  choice-control:
    size: "2.25rem"
  choice-hint:
    textColor: "{colors.muted}"
    typography: "{typography.small}"
  tag-fund:
    backgroundColor: "{colors.tag-neutral}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: ".1rem .5rem"
  tag-route:
    backgroundColor: "{colors.tag-route}"
    textColor: "{colors.brand}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: ".1rem .5rem"
  result-section:
    padding: "1rem 0 0"
  source-line:
    textColor: "{colors.muted}"
    typography: "{typography.small}"
  footer:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.muted}"
    typography: "{typography.small}"
    padding: "1.5rem 1rem 2rem"
---

# Design System: 香港社福導航

## Overview

**Creative North Star: "The Plain Service Counter"**

This is the category standard played straight: a public-service website at the craft level of GOV.UK, the NHS website and 社署長者資訊網, written in Hong Kong Traditional Chinese for worried family carers, frontline social workers and older people reading on phones. The visitor walks up to a counter, says the need in everyday words, and leaves with a service that may fit, what still has to be confirmed, and a number to call. Nothing on the page competes with that handover.

The world is white paper and black ink, one deep civic green band across the top with a plain text menu under it, blue underlined links, a single green start button, and yellow keyboard focus. Containers are square, flat and bordered; urgency, notices and eligibility are told by full-border tinted panels, never by shadow or ornament. Where a number matters, it is said as a table or a plain bar chart, never as an infographic. Type is the reader's own system CJK sans in two weights, with a large 19px body. Density is low: one column, one task per screen, more space above a heading than below it.

Familiar beats distinctive here, on purpose: the familiarity is the trust signal. The system borrows the canon's grammar (phase banner, yellow-and-black focus, the button's pressable base edge, bordered panels) but never any government's crest, wordmark or header colour. The deep green band is this site's own.

**Key Characteristics:**
- White ground, black text, one deep green header band closed by a lighter jade stripe, then a white text menu whose current page is ink with a green underbar.
- One primary action per screen: a square green button with a 2px base edge, full width on phones.
- Links are always blue and underlined; visited links turn violet.
- Every keyboard focus is a yellow fill with a black underline or ring.
- Full-border tinted panels: red for 急事, blue for what must be confirmed or assessed, green for who qualifies.
- Key facts are bold with a green underline, so they never read as blue links.
- Phone numbers are large, bold, tabular and always tappable.
- System CJK sans, weights 400 and 700 only, 19px body.
- Flat and square: no radius on any container or control, no depth shadows, no transitions. The only curves are native radios, the numbered step marker, and the chart's data marks.

## Colors

A restrained public-service palette: paper and ink carry almost everything, one deep green names the site, a separate green means "start" (and underlines a key fact), blue means "go somewhere", yellow means "you are here", and red means "act now". Two chart-only hues exist for data and nowhere else.

### Primary
- **Deep Civic Green** (#0b4a3f): the site's identity. Ground of the header band and the 測試版 phase tag, the 3px rule that opens each result and each services category, the 4px underbar of the current menu item, the threshold panel's border and tick, the application flow's step borders, numbered markers and arrows, route-tag text, the accent of checkboxes and radios, and the text caret. White on it reads at 10.2:1.
- **Jade Band Edge** (#0f7a66): the 8px stripe under the header band, and nowhere else.
- **Route Mint** (#dcefe8): ground of the route tag (可直接查詢, 要先做統一評估), always with Deep Civic Green text (8.5:1).
- **Selection Mint** (#cde5dc): selected text, with ink text on it.

### Secondary
- **Start Green** (#00703c): the primary button's ground, and the .15em underline of a key fact. White on it reads at 6.2:1; as an underline on paper it reads at 6.2:1.
- **Pressed Start Green** (#005a30): the primary button on hover.
- **Key-Edge Green** (#002d18): the primary button's 2px base edge.

### Tertiary
- **Public Link Blue** (#1458a8): every link, including tap-to-call numbers. 7.0:1 on paper, 6.3:1 on either panel wash.
- **Visited Violet** (#4c2c92): visited links.

### Status
- **Focus Yellow** (#ffdd00): keyboard focus. Ink on it reads at 14.6:1.
- **Urgent Brick Red** (#b3261e): the 3px border of the urgent panel (急事點算, 有即時危險, 懷疑長者被虐待).
- **Urgent Wash** (#fdf0ee): the urgent panel's ground.
- **Urgent Hairline** (#e0c9c5): the divider between rows of a calls list.
- **Notice Blue** (#1458a8): the 3px border of the notice panel (安老服務統一評估, 好多資助服務要先做評估). It shares Public Link Blue's value but is a separate role.
- **Notice Wash** (#eef4fb): the notice panel's ground.
- **Threshold Wash** (#f1f8f5): the threshold panel's ground (門檻：邊個可以用？), always with a 3px Deep Civic Green border. Ink reads at 18.2:1, Public Link Blue at 6.5:1, Slate Secondary at 7.7:1. A data table inside it sits on Paper White.

### Chart
Chart-only tokens. They encode data series and appear nowhere outside a chart figure and its legend. The pair passed the dataviz palette validator.
- **Elder Share Green** (#0b8a62): the share the older person pays, in the 社區券 co-payment chart's bars and legend swatch. 4.4:1 on paper.
- **Government Share Blue** (#5b8fd6): the share the government pays. 3.3:1 on paper, above the 3:1 floor for graphical marks.
- The two series sit next to each other at only 1.3:1, so a 2px Paper White gap always separates them, and every bar's values are also printed as numbers in its row.

### Neutral
- **Print Black** (#0b0c0c): all body text and headings, and the black half of every focus state. 19.6:1 on paper.
- **Slate Secondary** (#484f53): hints, breadcrumb separators, chart column heads, source lines, footer text. 8.3:1 on paper, 7.5:1 on Counter Grey.
- **Paper White** (#ffffff): the page ground.
- **Counter Grey** (#f3f2f1): the footer ground.
- **Rule Grey** (#b1b4b6): 1px hairlines under the top menu and phase banner, between table rows, checklist conditions and services-list entries, and above the footer. Decorative dividers only; never the sole boundary of a control.
- **Tag Grey** (#e7e9ea): ground of the funding tag (資助, 自費), with ink text.

### Named Rules
**The Yellow Means Focus Rule.** Focus Yellow appears only where the keyboard has put the visitor. It is never decoration, a highlighter mark or a brand accent.

**The Two Greens Rule.** Deep Civic Green names the site; Start Green means "press this". Start Green fills the primary button and nothing else; its one other use is the underline of a key fact, never a fill.

**The Chart-Only Rule.** Elder Share Green and Government Share Blue live inside chart figures only. They never fill a panel, a tag, a button or text, and the chart's 2px and 4px radii never leave the chart either.

**The Colour Never Alone Rule.** Every coloured signal also carries words or form: the urgent panel has a heading, tags are text, links are underlined, focus adds a black underline or ring to the yellow.

## Typography

**Display Font:** none; headings are the body face in bold.
**Body Font:** system-ui (with -apple-system, PingFang HK, Noto Sans HK, Microsoft JhengHei, sans-serif)
**Label/Mono Font:** none distinct; phone numbers use the body face's tabular figures.

**Character:** The reader's own CJK sans, as the canon sites use for Chinese: no font download on a phone under time pressure, and characters the device already renders well. Hierarchy comes from size and the single step from 400 to 700.

### Hierarchy
- **Headline Large** (700, 2rem / 32px, 1.3): the page H1, one per page (幫屋企長者搵服務, 長者需要咩幫手？). On the need page it sits inside the first fieldset's legend.
- **Headline Medium** (700, 1.75rem / 28px, 1.3): category headings on the all-services page, each under a 3px Deep Civic Green rule.
- **Headline Small** (700, 1.5rem / 24px, 1.3): section H2s and the service name that heads each result.
- **Title Large** (700, 1.375rem / 22px, 1.3): service names on the all-services page.
- **Title Medium** (700, 1.3125rem / 21px, 1.3): panel headings and form legends.
- **Title Small** (700, 1.1875rem / 19px, 1.3): H3s inside a result (仲要核實, 下一步); body size, bold.
- **Wordmark** (700, 1.25rem / 20px): 香港社福導航 in the header band.
- **Lead** (400, 1.3125rem / 21px, 1.6): the one-line promise under the H1 and the 你揀咗 summary on results.
- **Body** (400, 1.1875rem / 19px, 1.6): everything else. The 46rem column holds about 37 CJK characters per line, the comfortable CJK measure.
- **Button** (700, 1.1875rem / 19px, 1.4): primary button text.
- **Phone** (700, 1.3125rem / 21px, tabular figures): tap-to-call numbers.
- **Nav** (700, 1.1875rem / 19px, 1.6): top menu items; 1rem / 16px at 40rem and below.
- **Label** (700, 1rem / 16px): tags, the phase tag, table column heads, flow step numerals, the chart's column heads (in Slate Secondary).
- **Small** (400, 1rem / 16px, 1.6): choice hints, the phase banner sentence, breadcrumbs, source lines, the footer.
- **Data** (400, 1rem / 16px, tabular figures): data-table cells and the chart's rows, so amounts line up in columns.
- **Key fact** (700, inherits its line's size): an amount, age or condition the reader must not miss, underlined in Start Green at .15em thickness and .22em offset with skip-ink off.

Headings balance their line breaks, so a two-line H1 never leaves one orphan character.

### Named Rules
**The Two Weights Rule.** 400 and 700 only. Emphasis is weight or size, or the key-fact underline; never text colour or letter-spacing.

**The Key Not Link Rule.** A key fact is bold ink with a green underline; a link is blue with a blue underline. Never colour a key fact blue, and never leave a link un-underlined, so the two can never be confused.

**The Sixteen-Pixel Floor Rule.** Body is 19px, and nothing on any page is set below 16px, including hints, source lines and the footer.

**The Readable Number Rule.** Phone numbers are grouped with a space (2343 2255, 182 183), bold, 21px, tabular, and never wrap mid-number.

## Layout

One centred column, 46rem (736px) wide at most, with 1rem (16px) side gutters at every width; the header band, top menu, phase banner and footer run full bleed with their content held to the same column. Main content starts 2rem (32px) under the phase banner and ends 3rem (48px) above the footer.

Vertical rhythm: paragraphs and lists leave 1rem below; H2s take 2.5rem above and 1rem below (services category H2s 3rem above); H3s take 1.25rem above and .25rem below; panels take 1.5rem above and below; results sit 2rem apart; fieldsets sit 2rem apart; flow steps sit 2rem apart, the gap carrying the arrow; tables and charts leave 1.5rem below. List items are .35rem apart.

At 40rem and below, the primary button goes full width, calls-list rows stack, and the expanded top menu becomes one column. The services table of contents flows into two columns of at least 14rem and falls back to one. Data tables and the chart stay full column width. Everything holds at 320px and 200% zoom.

In print, the header band, top menu, phase banner, footer, buttons and skip link drop out and links print in ink.

### Named Rules
**The One Column Rule.** Every page is a single column at every width. No sidebars, no card grids, no multi-column content beyond the services table of contents, the narrow-screen menu grid, and data tables whose columns are the data.

**The One Start Rule.** A page carries at most one green button, and it is that screen's single forward action (由需要開始, 睇結果). Every other route is a text link.

## Elevation & Depth

Flat. Depth is not modelled; grouping is told by borders (1px hairlines, 3px structural rules and panel borders) and tinted grounds. There is exactly one shadow at rest, and it is a press affordance rather than elevation: the primary button's 2px base edge, which vanishes as the button drops 2px when pressed. Focus states use box-shadow as a drawing tool for the yellow block and black underline, not as depth. Diagram connectors and ticks are flat inline SVG in Deep Civic Green. Nothing animates; state changes are instant.

### Shadow Vocabulary
- **Button base edge** (`box-shadow: 0 2px 0 #002d18`): primary button at rest and on hover; removed on press, with `transform: translateY(2px)`.
- **Button focus edge** (`box-shadow: 0 2px 0 #0b0c0c`): the base edge turns black while the button has keyboard focus.
- **Focus underline** (`box-shadow: 0 -2px #ffdd00, 0 4px #0b0c0c`): links and a focused choice's label; extends the yellow fill upward and draws a 4px black underline.
- **Choice focus ring** (`outline: 3px solid #0b0c0c; outline-offset: 2px; box-shadow: 0 0 0 6px #ffdd00`): a focused checkbox or radio.

### Named Rules
**The Flat Counter Rule.** Surfaces are flat at rest. No element other than the primary button takes a zero-blur shadow, and nothing takes a soft drop shadow at all.

## Shapes

Square throughout: the system radius is 0 for every container and control, and the button sets it explicitly. The form language is rectangles and rules. Panels carry a 3px border on all four sides; application flow steps carry a 2px Deep Civic Green border on all four sides. Tables are ruled, never boxed: a 2px ink rule under the head row and 1px Rule Grey under every row. A full-width 3px Deep Civic Green rule opens each result and each services category; it is a section divider, not a panel edge. 1px Rule Grey hairlines separate rows. An 8px Jade Band Edge closes the header band. Checkboxes and radios are the browser's native controls enlarged to 36px and tinted Deep Civic Green, so the radio keeps its circle. Three other curves exist, each scoped: the flow's numbered step marker is a 2rem circle; in the chart, legend swatches take a 2px radius and each bar's data end (the government share) takes a 4px radius on its outer corners only, with the elder share square against the baseline. Breadcrumb separators are a border-drawn chevron (two 2px Slate sides of a .4em square, turned 45 degrees), and checklist ticks are a stroked SVG check.

### Named Rules
**The Full Border Rule.** A panel signals by its whole border plus a tint. A panel never carries a one-sided stripe.

**The Scoped Curve Rule.** Rounding belongs to data marks and markers, never to containers: a panel, button, tag, table or flow step is always square.

## Components

### Header Band
A quiet name plate.
- **Style:** Deep Civic Green ground, at least 3.75rem tall, closed by the 8px Jade Band Edge.
- **Content:** the wordmark 香港社福導航 in white Wordmark type, linked home. No logo, no crest; the menu sits in the top menu bar below, never inside the band.
- **Hover / Focus:** underline appears on hover at .2em offset; focus takes the yellow fill and black underline.

### Top Menu
The bar below the green wordmark keeps 選單, 搜尋服務 and a direct 急事求助 link visible. Menu and search expand below the bar, one at a time. Escape closes the panel and returns focus to its button. When scripting is disabled the directory links remain visible.
- **Menu:** group site destinations and the six existing service categories. Keep current-page styling and the skip link.
- **Search:** match the catalogue's Chinese and English names, former names and category names. Show a count, direct detail links and a route to all services.
- **Mobile:** minimum 44px controls and a single-column expanded menu. Use normal page flow so the panel does not cover content.

### Breadcrumbs
- **Style:** a Small-type row above the H1 on service pages (首頁 › 所有服務 › category), ink-coloured underlined links, 1.25rem below. Separators are the border-drawn Slate chevron, never a typed glyph.

### Phase Banner
An honest status line.
- **Style:** full-bleed strip under the header, .6rem vertical padding, 1px Rule Grey underline, Small type.
- **Content:** a square 測試版 tag (white Label type on Deep Civic Green, .4rem side padding, .5rem gap after it) followed by the data-check date and 未做用家測試.

### Buttons
Solid, square and pressable.
- **Shape:** square corners (0).
- **Primary:** Start Green ground, white Button type, .55rem by 1.25rem padding, at least 2.875rem (46px) tall, with the Key-Edge Green base edge. Full width with centred text at 40rem and below. Sits 1.5rem above what follows it in a form.
- **Hover:** Pressed Start Green.
- **Active:** drops 2px and loses its base edge.
- **Focus:** Focus Yellow ground, ink text, black base edge, 3px yellow outline.
- **Secondary / Ghost:** none exist. Secondary routes are text links (或者直接睇所有長者服務, 返回首頁, 改答案).

### Links
- **Style:** Public Link Blue, underlined at .2em offset with a hairline thickness (at least 1px).
- **Hover:** the underline thickens to 3px.
- **Visited:** Visited Violet.
- **Focus:** Focus Yellow fill, ink text, underline replaced by the 4px black focus underline.
- **Skip link:** off-screen until focused, then top-left with .5rem by 1rem padding and the yellow focus fill.

### Panels (Urgent, Notice and Threshold)
- **Corner Style:** square (0).
- **Border:** 3px on all four sides; Urgent Brick Red for danger and abuse, Notice Blue for assessment and what must be confirmed, Deep Civic Green for who qualifies.
- **Background:** Urgent Wash, Notice Wash or Threshold Wash.
- **Shadow Strategy:** none (see Elevation & Depth).
- **Internal Padding:** 1rem by 1.25rem; 1.5rem outer margin. The heading is Title Medium with no top margin; the last child has no bottom margin.
- **Placement:** the urgent panel sits directly under the start button on the home page and closes the results page.

### Threshold Panel
Eligibility first, stated as a checklist.
- **Style:** the green panel; its heading is Headline Small (24px), not Title Medium, because it is the first section of a service page, directly after the lead.
- **Checklist:** an unmarked list; each condition is indented 2.25rem, with a 24px Deep Civic Green stroked tick (3px stroke, round caps) at its left, .6rem above and below, 1px Rule Grey between conditions.
- **Close:** a Small line saying the conditions are SWD's and that a social worker or unit confirms them. A comparison table inside the panel sits on Paper White.

### Key Fact
- **Style:** inline bold ink with the Start Green underline (see Typography). Used for the amount, age, limit or condition in a sentence; one or two per paragraph, never a whole sentence.

### Benefit Section
- **Style:** unboxed; under the 點樣幫到你？ H2, two Title Small H3s, 對長者 and 對家人／照顧者, each with one paragraph. It carries no styling of its own and must not become a pair of cards.

### Application Flow
Numbered boxes joined by arrows.
- **Step:** a square box with a 2px Deep Civic Green border on Paper White, .75rem by 1rem padding with 3.5rem on the left for the marker; the step title bold on its own line, the detail below.
- **Marker:** a 2rem Deep Civic Green circle with a white Label-type numeral, .75rem from the box's top-left.
- **Connector:** between steps, a 1rem by 2rem SVG arrow (2px stem, filled head) in Deep Civic Green, aligned under the marker and filling the 2rem gap. The last step has none.

### Data Table
- **Style:** full width, Data type, left aligned and top aligned; .6rem vertical cell padding with .75rem on the right; a 2px ink rule under the head row; 1px Rule Grey under every row; row headers in weight 400. No zebra striping, no cell borders, no fill.

### Co-payment Chart
A bar chart that is a real table.
- **Structure:** a figure with a bold caption, a 16px legend (Chart swatches .875rem square with the 2px radius, .4rem to their word, 1.25rem between entries; hidden from screen readers), then a table with one row per level: the elder percentage as the row header, the bar, and the government percentage right aligned. The first and last columns are 4rem; column heads are Label type in Slate Secondary.
- **Bars:** 1.25rem tall, the elder share in Elder Share Green and the government share in Government Share Blue, split by a 2px gap, each segment at least 2px wide. The government segment's outer end takes the 4px radius; the baseline end stays square.
- **Accessibility:** the numbers are always printed in the row; the bar is decorative to assistive technology.

### Services List
- **Style:** each category opens with a Headline Medium H2 under the 3px Deep Civic Green rule; its services form an unmarked list, each entry 1rem above and below with a 1px Rule Grey under it: a Title Large linked service name, its tags, then one paragraph of what the service does. Each name links to the service's own page.

### Calls List
The signature component: every result and every urgent panel ends with a named person or unit and a number you can tap.
- **Style:** an unmarked list; each row puts who to call (and hours, in Small Slate text) on the left and the number on the right, .5rem vertical padding, 1px Urgent Hairline between rows.
- **Phone link:** Phone type in Public Link Blue, underlined, never wrapping, a tel: link with a 2.75rem (44px) minimum target height.
- **Mobile:** at 40rem and below the number drops under its label, left aligned.

### Choice Controls
Large, native and labelled in everyday words.
- **Style:** native checkbox or radio at 36 by 36px, accent Deep Civic Green, .75rem gap to its label, .35rem row padding. The label is body type; a hint line in Small Slate sits under it (沖涼、着衫、如廁). The whole label is clickable.
- **Grouping:** each question is a fieldset with a Title Medium legend (the page H1 inside the legend on the need page), 2rem between groups; a group hint is tied to its fieldset for screen readers.
- **Focus:** the control takes the choice focus ring; its label takes the yellow fill and black underline.

### Tags
- **Style:** a row of square text labels directly under a service heading, .4rem apart, .75rem above the text that follows. Label type, .1rem by .5rem padding.
- **Variants:** funding (資助, 自費) on Tag Grey with ink text; route (可直接查詢, 要先做統一評估) on Route Mint with Deep Civic Green text.
- **Never** a coloured dot or icon in place of the words.

### Result Section
An unboxed answer, not a card.
- **Style:** opened by a full-width 3px Deep Civic Green rule, 1rem padding above the heading, 2rem between results.
- **Order (fixed):** service name (Headline Small), tags, a bold 點解可能啱 line followed by what the service does, 仲要核實 list, 下一步, a link to the full details, then the calls list.
- **Notice:** the assessment notice panel, when relevant, follows the first result.

### Source Line
- **Style:** each service page closes its facts with a Small line in Slate Secondary linking the official page and stating its check date.

### Footer
- **Style:** full bleed, Counter Grey ground, 1px Rule Grey top border, 1.5rem top and 2rem bottom padding, Small type in Slate Secondary.
- **Content:** source attribution, check date, and the statement that the site is not SWD and does not judge eligibility.

## Do's and Don'ts

### Do:
- **Do** keep every page a single 46rem column with 16px gutters, checked at 320px and 200% zoom.
- **Do** set body copy at 19px (1.1875rem) on a 1.6 line height, and keep every piece of text at 16px or above.
- **Do** give every focusable element the Focus Yellow fill with a black underline or ring; never remove a focus style.
- **Do** end every result and every urgent panel with a calls list whose numbers are tel: links at least 44px tall.
- **Do** show urgency and notices as full-border tinted panels: 3px Urgent Brick Red on Urgent Wash, 3px Notice Blue on Notice Wash.
- **Do** keep links Public Link Blue and underlined, Visited Violet once visited.
- **Do** close every service fact with a Small Slate source line naming the official page and its check date.
- **Do** use at most one Start Green button per screen, full width at 40rem and below.
- **Do** mark the current page in the top menu with `aria-current="page"`, ink text and the 4px Deep Civic Green underbar.
- **Do** mark a key fact with bold and the Start Green underline, keeping it visibly different from a blue link.
- **Do** state eligibility in the green threshold panel as a ticked checklist, first on every service page.
- **Do** print every charted value as a number in the chart's own table, and keep the 2px gap between series.

### Don't:
- **Don't** round corners on any container or control; the system radius is 0. The 2px swatch and 4px bar-end radii belong to the chart, and the circle to the flow's step marker.
- **Don't** add soft drop shadows, glows or raised cards; the 2px base edge belongs to the primary button alone.
- **Don't** use Focus Yellow or Start Green as decoration, or the chart colours outside a chart.
- **Don't** mark a panel with a one-sided stripe; its border goes all the way round.
- **Don't** add a third font weight or a second typeface.
- **Don't** lay services out as an icon-tile or card grid; they read as one column of headed entries, each linking to its own page.
- **Don't** put a kicker or eyebrow label above a heading; tags sit below the heading they describe.
- **Don't** signal with colour alone; every coloured state also carries words, an underline or a ring.
- **Don't** copy any government's crest, wordmark or header colour; borrow the canon's patterns, never its identity.

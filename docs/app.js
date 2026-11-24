// 由 data.js 產生結果頁、服務目錄及各服務頁；需要問答頁用以保留上次的答案。
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
// 每頁首次出現的名詞加上英文；seen 於每次產生頁面前清空
let seen = new Set();
const enTag = (en) => ` <span class="en" lang="en">(${en})</span>`;
function annotate(html) {
  const re = new RegExp(TERMS.map(([zh]) => zh).join("|"), "g");
  const map = Object.fromEntries(TERMS);
  return html.replace(re, (zh) => (seen.has(map[zh]) ? zh : (seen.add(map[zh]), zh + enTag(map[zh]))));
}
// 名稱內已有的名詞視作已出現，不再重複
const markSeen = (name) => TERMS.forEach(([zh, en]) => name.includes(zh) && seen.add(en));
const enName = (s) => `<p class="en-name" lang="en">${esc(s.en)}</p>`;
// **文字** → 粗體加底線（重要資料）
const fmt = (s) =>
  annotate(esc(s).replace(/\*\*(.+?)\*\*/g, '<strong class="key">$1</strong>'))
    .replace(/(<span class="en" lang="en">\([^)]*\)<\/span>)<\/strong>/g, "</strong>$1"); // 英文不加底線
const telText = (n) => (n.length === 6 ? `${n.slice(0, 3)} ${n.slice(3)}` : n.length === 8 ? `${n.slice(0, 4)} ${n.slice(4)}` : n);
const telLink = (n) => `<a class="tel" href="tel:${n}">${telText(n)}</a>`;
const byId = Object.fromEntries(SERVICES.map((s) => [s.id, s]));
const pageOf = (id) => `service.html?id=${id}`;
const catTitle = Object.fromEntries(CATEGORIES);
// 沒有專屬電話的服務，以 182 183 作最後一步（社署頁面：提供資訊、諮詢及轉介）
const FALLBACK = [["不知道應聯絡誰？照顧者支援專線，24 小時由社工接聽", "182183", ""]];

const listHtml = (items) => `<ul>${items.map((w) => `<li>${fmt(w)}</li>`).join("")}</ul>`;
const callsHtml = (contacts) =>
  `<ul class="calls">${contacts
    .map(([who, n, hours]) => `<li><span>${esc(who)}${hours ? `<br><span class="small muted">${esc(hours)}</span>` : ""}</span>${telLink(n)}</li>`)
    .join("")}</ul>`;
const tagsHtml = (s) => `<ul class="tags"><li>${esc(s.fund)}</li><li class="route">${esc(ROUTES[s.route])}</li></ul>`;
const tableHtml = ([head, ...rows]) => `<table class="data">
  <thead><tr>${head.map((h) => `<th scope="col">${esc(h)}</th>`).join("")}</tr></thead>
  <tbody>${rows.map(([first, ...rest]) => `<tr><th scope="row">${fmt(first)}</th>${rest.map((c) => `<td>${fmt(c)}</td>`).join("")}</tr>`).join("")}</tbody>
</table>`;

// 社區券共同付款：六級（社署頁面列明 5%、8%、12%、16%、25%、40%）
function copayChart() {
  const levels = [5, 8, 12, 16, 25, 40];
  return `<figure class="chart">
    <figcaption>社區券六個共同付款級別：長者及政府分別支付的比例</figcaption>
    <ul class="legend" aria-hidden="true"><li><span class="sw me"></span>長者付</li><li><span class="sw gov"></span>政府付</li></ul>
    <table class="bars">
      <thead><tr><th scope="col">長者付</th><th scope="col"><span class="vh">比例</span></th><th scope="col">政府付</th></tr></thead>
      <tbody>${levels.map((p) => `<tr>
        <th scope="row">${p}%</th>
        <td><div class="bar" aria-hidden="true"><span class="me" style="flex:${p}" title="長者付 ${p}%"></span><span class="gov" style="flex:${100 - p}" title="政府付 ${100 - p}%"></span></div></td>
        <td>${100 - p}%</td></tr>`).join("")}
      </tbody>
    </table>
  </figure>`;
}

function answers() {
  const q = new URLSearchParams(location.search);
  const needs = q.getAll("need").filter((n) => NEEDS[n]);
  return { needs: needs.length ? needs : ["unsure"], fund: q.get("fund") || "both" };
}

function prefillNeed() {
  const { needs, fund } = answers();
  if (!location.search) return;
  document.querySelectorAll('input[name="need"]').forEach((i) => (i.checked = needs.includes(i.value)));
  const r = document.querySelector(`input[name="fund"][value="${CSS.escape(fund)}"]`);
  if (r) r.checked = true;
}

function renderResults(el) {
  seen = new Set();
  const { needs, fund } = answers();
  const hits = SERVICES.map((s) => ({ s, why: s.needs.filter((n) => needs.includes(n)) }))
    .filter((h) => h.why.length)
    .sort((a, b) => (fund === "self" ? (b.s.fund === "自費") - (a.s.fund === "自費") : 0) || b.why.length - a.why.length);
  // 必定保留真人聯絡途徑：長者中心社工
  if (!hits.some((h) => h.s.id === "centres")) hits.push({ s: byId.centres, why: [] });

  const fundText = { both: "資助和自費都想查看", sub: "資助", self: "自費", unsure: "未清楚" }[fund] || "";
  const needsAssess = hits.some((h) => ["assess", "light", "invite"].includes(h.s.route));
  // 服務頁記住來自哪一個搜尋結果
  const detail = (id) => `${pageOf(id)}&from=${encodeURIComponent(location.search)}`;
  const back = document.getElementById("back");
  if (back) back.href = "need.html" + location.search;

  const notes = needsAssess ? `<div class="panel info"><h2>不少資助服務須先進行評估</h2>
      <p>資助長期護理服務須先接受「安老服務統一評估」。如未曾接受評估，請先聯絡長者中心或綜合家庭服務中心社工協助申請。</p>
      <p><a href="${pageOf("assessment")}">了解評估程序</a></p></div>` : "";

  el.innerHTML = `
    <p class="lead">你選擇了：${needs.map((n) => NEEDS[n].label).join("、")}${fundText ? `；${fundText}` : ""}。
      <a href="need.html${location.search}">修改答案</a></p>
    <p>以下是<strong>可能相關</strong>的服務，並非資格判斷，須由社工或服務單位核實。</p>
    <p>按服務名稱或「了解這項服務」，即可查看門檻、適合人士、服務內容、申請步驟及收費。</p>
    ${fund === "self" ? `<p>本網站暫未收錄自費上門照顧機構。如欲比較自費上門照顧，可先向長者中心社工查詢。</p>` : ""}
    ${hits.map(({ s, why }, i) => `
      <section class="result" aria-labelledby="r-${s.id}">
        <h2 id="r-${s.id}"><a href="${detail(s.id)}">${esc(s.name)}</a></h2>
        ${enName(s)}
        ${tagsHtml(s)}
        <p>${fmt(s.what)}</p>
        <h3>門檻（須核實）</h3>
        ${listHtml(s.who)}
        <h3>下一步</h3>
        <p>${fmt(s.how)}</p>
        <p><a class="button secondary" href="${detail(s.id)}">了解這項服務<span class="vh">：${esc(s.name)}</span></a></p>
        ${s.id === "centres" ? `<p><a href="${CENTRE_LIST}">就近中心電話（PDF）</a></p>` : ""}
        ${callsHtml(s.contacts.length ? s.contacts : FALLBACK)}
      </section>${i === 0 ? notes : ""}`).join("")}
    <div class="panel alert">
      <h2>有即時危險？</h2>
      <ul class="calls">
        <li><span>報警或召喚救護車</span>${telLink("999")}</li>
      </ul>
    </div>`;
}

function renderServices(el) {
  seen = new Set();
  el.innerHTML = CATEGORIES.map(([cat, title]) => `
    <h2 id="cat-${cat}">${esc(title)}</h2>
    <ul class="svc-list">${SERVICES.filter((s) => s.cat === cat).map((s) => `
      <li>
        <h3><a href="${pageOf(s.id)}">${esc(s.name)}</a></h3>
        ${enName(s)}
        ${tagsHtml(s)}
        <p>${fmt(s.what)}</p>
      </li>`).join("")}
    </ul>`).join("");
}

function renderService(el) {
  const s = byId[new URLSearchParams(location.search).get("id")];
  const nav = document.querySelector(s?.id === "assessment" ? '.topnav a[href*="assessment"]' : '.topnav a[href="services.html"]');
  nav?.setAttribute("aria-current", "page");
  if (!s) {
    el.innerHTML = `<h1>找不到這項服務</h1><p>連結可能有誤，請<a href="services.html">查看所有長者服務</a>。</p>`;
    return;
  }
  document.title = `${s.name}｜香港社福導航`;
  const rawFrom = new URLSearchParams(location.search).get("from");
  const from = rawFrom === null || rawFrom === "" || rawFrom.startsWith("?") ? rawFrom : "";
  seen = new Set();
  markSeen(s.name);
  const costHead = s.cat === "money" ? "津貼金額" : "收費";
  const hasCost = s.cost || s.costTable || s.chart;
  const others = SERVICES.filter((o) => o.cat === s.cat && o.id !== s.id);

  el.innerHTML = `
    ${from !== null ? `<p><a class="back" href="results.html${esc(from)}">返回你的搜尋結果</a></p>` : ""}
    <nav class="crumbs" aria-label="目前位置"><ol>
      <li><a href="index.html">首頁</a></li>
      <li><a href="services.html">所有服務</a></li>
      <li><a href="services.html#cat-${s.cat}">${esc(catTitle[s.cat])}</a></li>
    </ol></nav>
    <h1>${esc(s.name)}</h1>
    ${enName(s)}
    ${tagsHtml(s)}
    <p class="lead">${fmt(s.what)}</p>

    <section class="panel threshold" aria-labelledby="h-who">
      <h2 id="h-who">門檻：誰可以使用？</h2>
      <p>${esc(s.rule)}</p>
      ${s.compareTable ? `${tableHtml(s.compareTable)}<p>兩種津貼均須符合：</p>` : ""}
      <ul class="checks">${(s.whoBoth || s.who).map((w) => `<li>${fmt(w)}</li>`).join("")}</ul>
      ${s.free ? `<h3>須留意</h3>${listHtml(s.free)}` : ""}
      <p class="small">以上是社署列明的條件，最終由社工或服務單位核實。</p>
    </section>

    <h2>這項服務適合哪些人士？</h2>
    <p>例如以下情況（僅供參考，並非資格判斷）：</p>
    ${listHtml(s.forWhom)}

    <h2>服務如何提供幫助？</h2>
    <div class="benefit">
      <h3>對長者</h3><p>${fmt(s.elder)}</p>
      <h3>對家人／照顧者</h3><p>${fmt(s.carer)}</p>
    </div>
    <h3>具體服務內容</h3>
    ${listHtml(s.helps)}

    <h2>如何申請</h2>
    <ol class="flow">${s.steps.map(([t, d]) => `<li><strong>${fmt(t)}</strong><span>${fmt(d)}</span></li>`).join("")}</ol>

    ${hasCost ? `<h2>${costHead}</h2>
      ${s.cost ? `<p>${fmt(s.cost)}</p>` : ""}
      ${s.chart === "copay" ? copayChart() : ""}
      ${s.example ? `<p class="small">${esc(s.example)}</p>` : ""}
      ${s.costTable ? tableHtml(s.costTable) : ""}
      ${s.limitTable ? tableHtml(s.limitTable) : ""}` : ""}
    ${s.hoursTable ? `<h2>服務時間</h2>${tableHtml(s.hoursTable)}` : ""}

    <h2>聯絡</h2>
    ${callsHtml(s.contacts.length ? s.contacts : FALLBACK)}
    ${s.links.length ? `<ul class="links">${s.links.map(([t, u]) => `<li><a href="${u}">${esc(t)}</a></li>`).join("")}</ul>` : ""}

    ${s.ask ? `<h2>致電時可查詢的問題</h2>${listHtml(s.ask)}<p class="small muted">以上為建議問題，可按實際情況修改。</p>` : ""}

    ${s.note || s.alias ? `<h2>其他資料</h2>
      ${s.note ? `<p>${esc(s.note)}</p>` : ""}
      ${s.alias ? `<p>其他名稱：${s.alias.map(esc).join("、")}</p>` : ""}` : ""}

    <p class="source">來源：<a href="${s.source}">社署網頁</a>${s.source2 ? `；<a href="${s.source2[0]}">${esc(s.source2[1])}</a>` : ""}，核實日期 ${s.checked || CHECKED}</p>

    ${others.length ? `<h2>同類服務</h2>
      <ul class="links">${others.map((o) => `<li><a href="${pageOf(o.id)}">${esc(o.name)}</a></li>`).join("")}</ul>` : ""}
    <p>${from !== null ? `<a href="results.html${esc(from)}">返回你的搜尋結果</a>｜` : ""}<a href="services.html">返回所有長者服務</a></p>`;
}

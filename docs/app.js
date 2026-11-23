// 由 data.js 畫出結果頁同服務頁；需要問答頁用嚟保留上次嘅答案。
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
const telText = (n) => (n.length === 6 ? `${n.slice(0, 3)} ${n.slice(3)}` : `${n.slice(0, 4)} ${n.slice(4)}`);
const telLink = (n) => `<a class="tel" href="tel:${n}">${telText(n)}</a>`;
const byId = Object.fromEntries(SERVICES.map((s) => [s.id, s]));

function contactsHtml(s) {
  if (!s.contacts.length) return "";
  return `<ul class="calls">${s.contacts
    .map(([who, n, hours]) => `<li><span>${esc(who)}${hours ? `<br><span class="small muted">${esc(hours)}</span>` : ""}</span>${telLink(n)}</li>`)
    .join("")}</ul>`;
}
const linksHtml = (s) => s.links.map(([t, u]) => `<a href="${u}">${esc(t)}</a>`).join("<br>");
const tagsHtml = (s) => `<ul class="tags"><li>${esc(s.fund)}</li><li class="route">${esc(ROUTES[s.route])}</li></ul>`;

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
  const { needs, fund } = answers();
  const hits = SERVICES.map((s) => ({ s, why: s.needs.filter((n) => needs.includes(n)) }))
    .filter((h) => h.why.length)
    .sort((a, b) => (fund === "self" ? (b.s.fund === "自費") - (a.s.fund === "自費") : 0) || b.why.length - a.why.length);
  // 永遠留一條人手出路：長者中心社工
  if (!hits.some((h) => h.s.id === "centres")) hits.push({ s: byId.centres, why: [] });

  const fundText = { both: "資助同自費都想睇", sub: "資助", self: "自費", unsure: "未清楚" }[fund] || "";
  const needsAssess = hits.some((h) => ["assess", "light", "invite"].includes(h.s.route));
  const back = document.getElementById("back");
  if (back) back.href = "need.html" + location.search;

  // 冇專屬電話嘅服務，用 182 183 做最後一步（社署頁面：提供資訊、諮詢同轉介）
  const fallback = { contacts: [["唔知打俾邊個？照顧者支援專線，24 小時社工接聽", "182183", ""]] };
  const notes = `
    ${needsAssess ? `<div class="panel info"><h2>好多資助服務要先做評估</h2>
      <p>資助長期護理服務要先做「安老服務統一評估」。未做過唔緊要，先搵長者中心或綜合家庭服務中心社工幫你申請。</p>
      <p><a href="services.html#assessment">評估點樣做</a></p></div>` : ""}`;

  el.innerHTML = `
    <p class="lead">你揀咗：${needs.map((n) => NEEDS[n].label).join("、")}${fundText ? `；${fundText}` : ""}。
      <a href="need.html${location.search}">改答案</a></p>
    <p>以下係<strong>可能相關</strong>嘅服務，唔係資格判斷，要由社工或服務單位核實。</p>
    ${fund === "self" ? `<p>本網站暫時未收錄自費上門照顧機構。想比較自費上門照顧，可以先問長者中心社工。</p>` : ""}
    ${hits.map(({ s, why }, i) => `
      <section class="result" aria-labelledby="r-${s.id}">
        <h2 id="r-${s.id}">${esc(s.name)}</h2>
        ${tagsHtml(s)}
        <p><span class="why">${why.length ? `點解可能啱：你揀咗「${why.map((n) => NEEDS[n].label).join("」「")}」。` : "唔肯定揀邊樣？先問社工。"}</span>
          ${esc(s.what)}</p>
        <h3>仲要核實</h3>
        <ul>${s.who.map((w) => `<li>${esc(w)}</li>`).join("")}</ul>
        <h3>下一步</h3>
        <p>${esc(s.how)}</p>
        <p>${s.id === "centres" ? `<a href="${CENTRE_LIST}">搵就近中心電話（PDF）</a><br>` : ""}<a href="services.html#${s.id}">睇${esc(s.name)}詳細資料</a></p>
        ${contactsHtml(s.contacts.length ? s : fallback)}
      </section>${i === 0 ? notes : ""}`).join("")}
    <div class="panel alert">
      <h2>有即時危險？</h2>
      <ul class="calls">
        <li><span>報警或召救護車</span>${telLink("999")}</li>
      </ul>
    </div>`;
}

function renderServices(el) {
  el.innerHTML = CATEGORIES.map(([cat, title]) => `
    <h2 id="cat-${cat}">${esc(title)}</h2>
    ${SERVICES.filter((s) => s.cat === cat).map((s) => `
      <article class="service" id="${s.id}" aria-labelledby="h-${s.id}">
        <h3 id="h-${s.id}">${esc(s.name)}</h3>
        ${tagsHtml(s)}
        <dl class="facts">
          <dt>可以幫咩</dt><dd>${esc(s.what)}</dd>
          <dt>適合邊個</dt><dd><ul>${s.who.map((w) => `<li>${esc(w)}</li>`).join("")}</ul></dd>
          <dt>點樣申請</dt><dd>${esc(s.how)}</dd>
          <dt>收費</dt><dd>${esc(s.cost)}</dd>
          ${s.contacts.length ? `<dt>電話</dt><dd>${contactsHtml(s)}</dd>` : ""}
          ${s.links.length ? `<dt>相關連結</dt><dd>${linksHtml(s)}</dd>` : ""}
          ${s.alias ? `<dt>其他叫法</dt><dd>${s.alias.map(esc).join("、")}</dd>` : ""}
        </dl>
        ${s.note ? `<p class="small">${esc(s.note)}</p>` : ""}
        <p class="source">來源：<a href="${s.source}">社署網頁</a>，核實日期 ${CHECKED}</p>
      </article>`).join("")}
    <p class="top"><a href="#main">返回頁頂</a></p>`).join("");
  if (location.hash) document.getElementById(location.hash.slice(1))?.scrollIntoView();
}

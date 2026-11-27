// 用法：cd web && npx vite build，然後 python3 -m http.server 8765 --directory docs，再 node tests/site-check.js [截圖目錄]
const { chromium } = require("playwright");
const assert = require("assert");
const base = "http://localhost:8765/";
const shots = process.argv[2];

(async () => {
  const b = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || undefined });
  const p = await b.newPage({ viewport: { width: 320, height: 700 } });
  const errors = [];
  p.on("pageerror", (e) => errors.push(e.message));
  const open = async (u) => { await p.goto(base + u); await p.waitForSelector("[role=main] h1"); await p.waitForTimeout(250); };
  // 首頁應直接進入相應範疇，而非完整目錄。
  await open('index.html');
  const fieldLinks = await p.locator('.field-grid a').evaluateAll(links =>
    links.map(link => [link.getAttribute('href'), link.querySelector('strong').textContent]));
  assert.ok(fieldLinks.length >= 10);
  for (const [href, label] of fieldLinks) {
    await p.locator(`.field-grid a[href="${href}"]`).click();
    assert.strictEqual(await p.locator('h1').innerText(), label);
    assert.ok(await p.locator('[role=main] a[href^="service.html?id="]').count());
    assert.equal(await p.getByRole('combobox', {name: '中心類型'}).count(), 0);
    await p.goBack();
  }
  await p.getByRole('link', {name: '按地區尋找綜合家庭服務中心及其他服務中心'}).click();
  assert.equal(await p.locator('h1').innerText(), '尋找就近服務中心');
  assert.ok(await p.getByRole('combobox', {name: '中心類型'}).isVisible());
  const h2s = () => p.$$eval("[role=main] h2", (h) => h.map((x) => x.textContent.trim()));
  const noOverflow = async (name) =>
    assert.ok((await p.evaluate(() => document.documentElement.scrollWidth)) <= 320, `${name} 320px 橫向溢出`);

  for (const page of ["index.html", "need.html", "services.html"]) {
    await open(page);
    await noOverflow(page);
    if (shots) await p.screenshot({ path: `${shots}/320-${page}.png`, fullPage: true });
  }
  await open("index.html");
  assert.ok(await p.locator('a[href="tel:999"]').count(), "首頁要有 999");
  assert.ok(await p.locator("#urgent").count(), "急事求助錨點");

  const nav = p.getByRole('navigation', { name: '主選單' });
  const size = p.locator('.care-size summary');
  for (const width of [320, 390, 1440]) {
    await p.setViewportSize({width, height: 700});
    await open('index.html');
    const menu = width === 1440 ? p.locator('.care-group summary').first() : p.locator('.care-menu summary');
    assert.ok(await nav.getByRole('link', {name:'所有服務', exact:true}).isHidden());
    await menu.focus(); await p.keyboard.press('Enter');
    assert.ok(await nav.getByRole('link', {name:'所有服務', exact:true}).isVisible());
    await p.keyboard.press('Escape'); assert.ok(await nav.getByRole('link', {name:'所有服務', exact:true}).isHidden());
    // Safari 按連結時焦點不轉移（relatedTarget 為 null），選單不可因此收起
    await menu.click(); await menu.evaluate(el => el.blur());
    assert.ok(await nav.getByRole('link', {name:'所有服務', exact:true}).isVisible(), 'Safari 式失焦後選單應保持開啟');
    // 鍵盤把焦點移到選單外時仍要收起
    await menu.focus(); await p.locator('.care-name').focus();
    assert.ok(await nav.getByRole('link', {name:'所有服務', exact:true}).isHidden(), '焦點離開選單後應收起');
    const original = await p.locator('h1').evaluate(el => parseFloat(getComputedStyle(el).fontSize));
    await size.click();
    await p.getByRole('button', {name:'特大', exact:true}).click();
    assert.ok(await p.locator('h1').evaluate(el => parseFloat(getComputedStyle(el).fontSize)) > original);
    await menu.click(); await nav.getByRole('link', {name:'所有服務'}).click();
    await p.waitForSelector('h1');
    assert.ok(await size.getAttribute('aria-label') === '更改字級，目前特大');
    await p.evaluate(() => window.scrollTo(0, 600));
    await p.waitForTimeout(220);
    assert.ok(await p.locator('.care-header').evaluate(el => el.getBoundingClientRect().bottom < 0));
    await p.evaluate(() => window.scrollBy(0, -80));
    await p.waitForTimeout(220);
    assert.ok(await p.locator('.care-header').evaluate(el => Math.abs(el.getBoundingClientRect().top) < 1));
    assert.ok(await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await size.click(); await p.getByRole('button', {name:'標準', exact:true}).click();
  }
  await p.setViewportSize({width:320,height:700});
  // 服務目錄及搜尋
  await open("services.html");
  const ids = await p.$$eval('[role=main] a[href^="service.html?id="]', (as) => [...new Set(as.map((a) => new URL(a.href).searchParams.get("id")))]);
  assert.ok(ids.length >= 16, "服務目錄應列出全部 16 項");
  await p.getByLabel("搜尋服務").fill("社區券");
  assert.ok(await p.locator('[role=main] a[href="service.html?id=ccsv"]').first().isVisible(), "搜尋社區券");
  assert.strictEqual(await p.locator('[role=main] a[href="service.html?id=ssa"]').count(), 0, "搜尋結果只顯示相關服務");

  // 每項服務一頁：門檻先行、簡介、流程、電話
  for (const id of ids) {
    await open(`service.html?id=${id}`);
    const h = await h2s();
    assert.strictEqual(h[0], "門檻：誰可以使用？", `${id} 第一段不是門檻`);
    assert.deepStrictEqual(h.slice(1, 3), ["這項服務適合哪些人士？", "服務如何提供幫助？"], `${id} 沒有服務簡介`);
    assert.ok(h.includes("如何申請"), `${id} 沒有申請步驟`);
    assert.ok((await p.locator('[role=main] a[href^="tel:"]').count()) >= 1, `${id} 沒有電話`);
    assert.ok(!(await p.textContent("[role=main]")).includes("undefined"), `${id} 有 undefined`);
    await noOverflow(id);
    if (shots && ["home-support", "ccsv", "ssa"].includes(id)) await p.screenshot({ path: `${shots}/320-service-${id}.png`, fullPage: true });
  }
  await open("service.html?id=home-support");
  assert.ok((await p.$$eval("[role=main] .key", (k) => k.map((x) => x.textContent.trim()))).includes("60 歲或以上"), "年齡要粗體加底線");
  assert.ok((await p.textContent("[role=main]")).includes("Home Support Services (HSS)"), "服務要有英文名");
  await open("service.html?id=frail-home");
  const body = await p.textContent("[role=main]");
  assert.ok(body.includes("長者鄰舍中心 (NEC)") && body.includes("綜合家庭服務中心 (Integrated Family Service Centre)"), "名詞首次出現要有英文");
  assert.strictEqual(body.split("(NEC)").length - 1, 1, "同一名詞英文只出一次");
  await open("service.html?id=ccsv");
  assert.ok(await p.getByText("社區券六個共同付款級別").isVisible(), "社區券共同付款圖");
  await open("service.html?id=nope");
  assert.ok(await p.getByText("找不到這項服務").first().isVisible());

  // 問答 → 結果 → 服務頁 → 返回結果 → 修改答案
  await open("need.html");
  await p.getByRole("button", { name: "查看結果" }).click();
  assert.ok(await p.getByText("請先選擇服務對象").first().isVisible(), "未選範疇要提示");
  await p.getByRole("radio", { name: "長者服務" }).check();
  await p.getByRole("checkbox", { name: "個人照顧" }).check();
  await p.getByRole("radio", { name: "自費" }).check();
  await p.getByRole("button", { name: "查看結果" }).click();
  await p.waitForSelector("[role=main] h2");
  const titles = await h2s();
  assert.ok(titles.includes("家居支援服務") && titles.includes("體弱長者家居照顧服務"), titles.join());
  assert.ok(titles.includes("長者地區中心／長者鄰舍中心"), "必定有長者中心社工");
  assert.ok(await p.getByText("暫未收錄自費上門照顧").isVisible());
  assert.ok(!(await p.textContent("[role=main]")).includes("為何可能合適"), "結果卡不顯示配對原因");
  await noOverflow("results.html");
  if (shots) await p.screenshot({ path: `${shots}/320-results.png`, fullPage: true });
  await p.getByRole("link", { name: "了解這項服務" }).first().click();
  await p.waitForSelector("[role=main] h1");
  assert.strictEqual((await p.textContent("[role=main] h1")).trim(), "家居支援服務");
  await p.getByRole("link", { name: "返回你的搜尋結果" }).first().click();
  await p.waitForSelector("[role=main] h2");
  assert.deepStrictEqual(await h2s(), titles, "返回結果要同之前一樣");
  await p.getByRole("link", { name: "修改答案" }).click();
  await p.waitForSelector("[role=main] h1");
  assert.ok(await p.getByRole("checkbox", { name: "個人照顧" }).isChecked(), "修改答案要保留選擇");

  // 其他範疇：揀康復服務只顯示康復服務，並有真人聯絡途徑
  await open("need.html");
  await p.getByRole("radio", { name: "康復服務" }).check();
  await p.getByRole("checkbox", { name: "未清楚" }).check();
  await p.getByRole("button", { name: "查看結果" }).click();
  await p.waitForSelector("[role=main] h2");
  const rehab = await h2s();
  assert.ok(rehab.includes("康復服務中央轉介系統") && !rehab.includes("家居支援服務"), rehab.join());
  await open("results.html?field=socsec&need=socsec-living");
  assert.ok((await h2s()).includes("高齡津貼／長者生活津貼"), "社會保障結果包括高齡津貼");

  // 舊連結沒有 field 參數：由需要推斷範疇
  await open("results.html?need=residential");
  assert.ok((await h2s()).includes("資助安老宿位"), "由需要推斷長者範疇");
  // 綜合家庭服務中心：深水埗區
  await open("services.html");
  await p.getByRole("combobox", { name: "中心類型" }).click();
  await p.getByRole("option", { name: "綜合家庭服務中心／綜合服務中心" }).click();
  await p.getByRole("combobox", { name: /地區/ }).click();
  await p.getByRole("option", { name: "深水埗區" }).click();
  assert.ok(await p.getByText(/深水埗區：\d+ 間中心/).isVisible(), "綜合家庭服務中心名單");
  // 地區篩選：選深水埗區只顯示該區中心
  await open("services.html");
  await p.getByRole("combobox", { name: /地區/ }).click();
  await p.getByRole("option", { name: "深水埗區" }).click();
  assert.ok(await p.getByText(/深水埗區：\d+ 間中心/).isVisible(), "地區中心名單");
  assert.ok((await p.locator('[role=main] a[href^="tel:2"]').count()) >= 10, "中心電話可撳");
  // 篩選：自費只顯示自費服務
  await p.getByRole("radio", { name: "自費" }).click();
  const selfIds = await p.$$eval('[role=main] a[href^="service.html?id="]', (as) => [...new Set(as.map((a) => new URL(a.href).searchParams.get("id")))]);
  assert.ok(selfIds.includes("private-rc") && !selfIds.includes("ccsv"), selfIds.join());
  // 我的清單：收藏兩項 → 計數 → 比較
  await open("services.html");
  await p.evaluate(() => localStorage.removeItem("hkcare-my-list"));
  await open("services.html");
  const saves = p.getByRole("button", { name: /收藏至我的清單/ });
  await saves.nth(0).click(); await saves.nth(1).click();
  assert.ok((await p.locator('.care-header a[href="list.html"]').first().textContent()).includes("(2)"), "清單計數");
  await open("list.html");
  await p.getByRole("checkbox").nth(0).check(); await p.getByRole("checkbox").nth(1).check();
  await p.getByRole("link", { name: "比較所選服務" }).click();
  await p.waitForSelector("table");
  assert.strictEqual((await p.$$eval("thead th", (t) => t.length)), 3, "比較表兩項服務");
  await open("list.html");
  p.once("dialog", (d) => d.accept());
  await p.getByRole("button", { name: "清除全部" }).click();
  assert.ok(await p.getByText("清單暫時沒有服務").isVisible(), "清除全部");
  await p.getByRole('button', {name: '提供網站意見'}).click();
  assert.ok(await p.getByRole('button', {name: '提交意見'}).isDisabled());
  await p.keyboard.press('Escape');

  assert.deepStrictEqual(errors, []);
  await b.close();
  console.log("site-check: all passed");
})().catch((e) => { console.error(e); process.exit(1); });

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
  const open = async (u) => { await p.goto(base + u); await p.waitForSelector("[role=main] h1"); };
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

  // 手機選單
  await p.getByRole("button", { name: "開啟導覽" }).click();
  assert.ok(await p.getByRole("link", { name: "所有服務" }).first().isVisible(), "手機選單要有所有服務");
  await p.keyboard.press("Escape");

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

  assert.deepStrictEqual(errors, []);
  await b.close();
  console.log("site-check: all passed");
})().catch((e) => { console.error(e); process.exit(1); });

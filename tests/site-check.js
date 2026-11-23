// 用法：先喺 docs/ 開伺服器（python3 -m http.server 8765 --directory docs），再 node tests/site-check.js [輸出截圖目錄]
const { chromium } = require("playwright");
const assert = require("assert");
const base = "http://localhost:8765/";
const shots = process.argv[2];

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 320, height: 700 } });
  const errors = [];
  p.on("pageerror", (e) => errors.push(e.message));
  const titles = async () => p.$$eval(".result h2", (h) => h.map((x) => x.textContent));
  const noOverflow = async (name) =>
    assert.ok((await p.evaluate(() => document.documentElement.scrollWidth)) <= 320, `${name} 320px 橫向溢出`);

  for (const page of ["index.html", "need.html", "services.html"]) {
    await p.goto(base + page);
    await noOverflow(page);
    if (shots) await p.screenshot({ path: `${shots}/320-${page}.png`, fullPage: true });
  }
  assert.strictEqual(await p.locator("article.service").count(), 15, "服務頁應列出全部 15 項");

  // 揀「個人照顧」+ 自費 → 家居服務會出現，最尾一定有長者中心社工
  await p.goto(base + "need.html");
  await p.check("#n-personal");
  await p.check("#f-self");
  await p.click("button[type=submit]");
  let t = await titles();
  assert.ok(t.includes("家居支援服務") && t.includes("體弱長者家居照顧服務"), t.join());
  assert.strictEqual(t.at(-1), "長者地區中心／長者鄰舍中心");
  assert.ok(await p.getByText("暫時未收錄自費上門照顧").isVisible());
  await noOverflow("results.html");
  if (shots) await p.screenshot({ path: `${shots}/320-results.png`, fullPage: true });

  // 每張結果卡最尾都有可以撳嘅電話
  const lastIsTel = await p.$$eval(".result", (rs) => rs.map((r) => !!r.lastElementChild.querySelector('a[href^="tel:"]')));
  assert.ok(lastIsTel.every(Boolean), "有結果卡最尾冇電話");

  // 返回問題同改答案都要保留之前揀過嘅嘢
  await p.click("#back");
  assert.ok(await p.isChecked("#n-personal"));
  await p.goBack();
  await p.click("text=改答案");
  assert.ok(await p.isChecked("#n-personal"));
  assert.ok(await p.isChecked("#f-self"));

  // 乜都唔揀 → 當「未清楚」處理，唔會空白
  await p.goto(base + "results.html");
  t = await titles();
  assert.ok(t.includes("照顧者支援專線 182 183") && t.includes("長者地區中心／長者鄰舍中心"), t.join());

  // 住院舍 → 有資助宿位同院舍券；電話可以撳
  await p.goto(base + "results.html?need=residential");
  t = await titles();
  assert.ok(t.includes("資助安老宿位") && t.includes("長者院舍照顧服務券（院舍券）"), t.join());
  assert.ok((await p.locator('a[href="tel:182183"]').count()) >= 1);

  // 唔認得嘅參數唔會令頁面壞
  await p.goto(base + "results.html?need=%3Cscript%3E&fund=%22x");
  assert.ok((await titles()).length >= 1);

  assert.deepStrictEqual(errors, []);
  await b.close();
  console.log("site-check: all passed");
})().catch((e) => { console.error(e); process.exit(1); });

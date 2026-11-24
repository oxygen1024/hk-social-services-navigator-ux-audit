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
  const ids = await p.$$eval(".svc-list a", (as) => as.map((a) => new URL(a.href).searchParams.get("id")));
  assert.strictEqual(ids.length, 16, "服務目錄應列出全部 16 項");

  // 每項服務一頁：門檻係第一個段落、有重點標示同流程圖、手機唔溢出
  for (const id of ids) {
    await p.goto(`${base}service.html?id=${id}`);
    const h2 = await p.$$eval("#service h2", (h) => h.map((x) => x.textContent));
    assert.strictEqual(h2[0], "門檻：邊個可以用？", `${id} 第一段唔係門檻`);
    assert.ok((await p.locator(".threshold .checks li").count()) >= 1, `${id} 冇門檻`);
    assert.deepStrictEqual(h2.slice(1, 3), ["呢個服務適合邊啲人？", "點樣幫到你？"], `${id} 冇服務簡介`);
    assert.ok(!(await p.textContent("#service")).includes("undefined"), `${id} 有 undefined`);
    assert.ok((await p.locator("ol.flow li").count()) >= 2, `${id} 冇申請流程`);
    assert.ok((await p.locator('#service a[href^="tel:"]').count()) >= 1, `${id} 冇電話`);
    assert.strictEqual(await p.getAttribute(".topnav [aria-current=page]", "href"), id === "assessment" ? "service.html?id=assessment" : "services.html");
    await noOverflow(id);
    if (shots && ["home-support", "ccsv", "ssa", "rcsv", "carer-allowance"].includes(id)) await p.screenshot({ path: `${shots}/320-service-${id}.png`, fullPage: true });
  }
  await p.goto(`${base}service.html?id=home-support`);
  assert.strictEqual(await p.textContent(".threshold .key"), "60 歲或以上", "年齡要粗體加底線");
  assert.ok((await p.textContent(".en-name")).includes("Home Support Services (HSS)"), "服務要有英文名");
  await p.goto(`${base}service.html?id=frail-home`);
  const body = await p.textContent("#service");
  assert.ok(body.includes("長者鄰舍中心 (NEC)") && body.includes("中央輪候冊 (CWL)"), "名詞第一次出現要有英文");
  assert.strictEqual(body.split("(NEC)").length - 1, 1, "同一名詞英文只出一次");
  await p.goto(`${base}service.html?id=ccsv`);
  assert.strictEqual(await p.locator("table.bars tbody tr").count(), 6, "社區券應有六級共同付款圖");
  await p.goto(`${base}service.html?id=nope`);
  assert.ok(await p.getByText("搵唔到呢項服務").isVisible());

  // 揀「個人照顧」+ 自費 → 家居服務會出現，最尾一定有長者中心社工
  await p.goto(base + "need.html");
  await p.check("#n-personal");
  await p.check("#f-self");
  await p.click("button[type=submit]");
  let t = await titles();
  assert.ok(t.includes("家居支援服務") && t.includes("體弱長者家居照顧服務"), t.join());
  assert.strictEqual(t.at(-1), "長者地區中心／長者鄰舍中心");
  assert.ok(await p.getByText("暫時未收錄自費上門照顧").isVisible());
  assert.ok(await p.evaluate(() => document.querySelector("#results > p:nth-of-type(3)")?.textContent.includes("自費")), "自費提示要喺第一張卡之前");
  assert.strictEqual(await p.locator('.panel.alert a[href="tel:182183"]').count(), 0, "結尾急事框唔應該再重複 182 183");
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

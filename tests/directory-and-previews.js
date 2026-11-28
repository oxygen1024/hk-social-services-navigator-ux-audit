// Use SITE_BASE for a local or deployed build. Feedback is intercepted in this test.
const {chromium} = require('playwright');
const assert = require('node:assert/strict');

(async () => {
  const base = process.env.SITE_BASE || 'http://localhost:8765/';
  const {UNITS, DISTRICTS, UNIT_LISTS} = await import('../web/src/units.js');
  const {SERVICES, FIELDS} = await import('../web/src/catalog.js');
  const browser = await chromium.launch({channel:process.env.PLAYWRIGHT_CHANNEL || undefined});
  try {
    const context = await browser.newContext({viewport:{width:390,height:844}, reducedMotion:'reduce',
      permissions:['geolocation'], geolocation:{latitude:22.424, longitude:114.231}});
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    const open = async path => {
      await page.goto(base + path, {waitUntil:'domcontentloaded'});
      await page.locator('[role=main] h1').waitFor();
    };
    const choose = async (name, value) => {
      await page.getByRole('combobox', {name,exact:true}).click();
      await page.getByRole('option', {name:value,exact:true}).click();
    };
    const pages = ['index','need','services','service','results','compare','list','centres', ...FIELDS.map(f => 'field-' + f.id), ...SERVICES.map(s => 'service-' + s.id)];
    const titles = new Set();
    for (let start=0;start<pages.length;start+=8) {
      await Promise.all(pages.slice(start,start+8).map(async path => {
        const res = await context.request.get(base + path + '.html');
        assert.equal(res.status(),200,path);
        const html = await res.text();
        const title = html.match(/<title>(.*?)<\/title>/)[1];
        assert.ok(!titles.has(title), title);
        titles.add(title);
        assert.ok(html.includes('property="og:title" content="'+title+'"'), path);
        const desc = html.match(/name="description" content="([^"]+)"/)[1];
        assert.ok(html.includes('property="og:description" content="'+desc+'"'),path);
        assert.ok(!desc.includes('下一位可聯絡的人士'),path);
      }));
    }
    await open('service.html?id=rehab-carer-hotline');
    assert.ok(page.url().includes('service-carer-line.html'));
    await open('results.html?field=elderly');
    assert.ok((await page.locator('[role=main]').innerText()).includes('你只選了範疇'));
    assert.equal(await page.getByRole('link',{name:'了解這項服務'}).count(), SERVICES.filter(s=>s.field==='elderly').length);
    assert.equal(await page.locator('[role=main] a[href="tel:182183"]').count(),1);
    await open('results.html?field=elderly&need=personal');
    assert.equal(await page.locator('[role=main] a[href="tel:182183"]').count(),1);
    await open('services.html');
    assert.equal(await page.getByRole('button',{name:/收藏至我的清單/}).count(),SERVICES.length);
    await open('centres.html');
    for (const list of UNIT_LISTS) {
      await choose('中心類型',list.kind);
      for (const district of DISTRICTS) {
        await choose('地區（18 區）',district);
        const units = UNITS.filter(u=>u.siteDistrict===district && u.kind===list.kind);
        await page.getByText(district+'：'+units.length+' 間中心',{exact:true}).waitFor();
        const hrefs = await page.locator('.centre-results a[href^="tel:"]').evaluateAll(links=>links.map(a=>a.getAttribute('href').slice(4)).sort());
        assert.deepEqual(hrefs,units.map(u=>u.tel).sort(),list.kind + district);
      }
    }
    await choose('中心類型','所有類型'); await choose('地區（18 區）','沙田區');
    await page.getByLabel('沙田區內地點').selectOption('mos');
    const cards = page.locator('.centre-results > li');
    assert.ok(await cards.count() > 0);
    await page.getByRole('button',{name:'用我的位置按距離排列'}).click();
    await page.getByText('已按直線距離排列。',{exact:false}).waitFor();
    const distances = await cards.locator('header strong').allTextContents();
    assert.equal(distances.length,await cards.count());
    const km = distances.map(d=>Number(d.match(/[\d.]+/)[0]));
    assert.deepEqual(km,[...km].sort((a,b)=>a-b));
    await page.getByRole('button',{name:'顯示地圖'}).click();
    await page.locator('.centre-pin').first().waitFor();
    assert.equal(await page.locator('.centre-pin').count(),await cards.count());
    await page.locator('.centre-pin').first().focus(); await page.keyboard.press('Enter');
    await page.locator('.leaflet-popup a[href^="#unit-"]').click();
    assert.ok(decodeURIComponent(new URL(page.url()).hash).startsWith('#unit-'));
    const first = cards.first();
    const name = await first.locator('h3').innerText();
    await first.getByRole('button',{name:'資料有誤回報'}).click();
    assert.ok((await page.getByRole('dialog').innerText()).includes(name));
    let payload;
    await page.route('**/rest/v1/website_feedback',route=>{payload=route.request().postDataJSON();return route.fulfill({status:201,headers:{'access-control-allow-origin':'*'}});});
    await page.getByRole('dialog').locator('textarea').fill('開放時間需要更新');
    await page.getByRole('button',{name:'提交意見'}).click();
    await page.getByText('已收到你的意見，多謝你！').waitFor();
    assert.ok(payload.message.includes(name) && payload.message.includes('開放時間需要更新'));
    await page.keyboard.press('Escape');
    await open('service-ccsv.html');
    assert.equal(await page.getByRole('columnheader',{name:'級別',exact:true}).count(),1);
    assert.equal(await page.getByRole('progressbar').count(),0);
    assert.deepEqual(await page.locator('tbody tr').first().locator('td').allInnerTexts(),['1','5%','95%']);
    await page.setViewportSize({width:1920,height:1080});
    const width = (await page.locator('[role=main] h1').boundingBox()).width;
    assert.ok(width > 1000 && width < 1300, 'desktop width '+width);
    await page.getByRole('button',{name:/返回頂部/}).click();
    assert.equal(await page.evaluate(()=>window.scrollY),0);
    assert.ok(await page.locator('.care-name').evaluate(el=>el===document.activeElement));
    await open('service-crisis-suicide.html');
    assert.ok(await page.locator('#service-contacts a[target="_blank"]').first().isVisible());
    assert.ok((await page.locator('footer time').textContent()).match(/^\d{4}-\d{2}-\d{2}$/));
    assert.deepEqual(errors,[]);
    console.log(pages.length+' static previews, 108 filters, map and location, centre report, wizard, desktop width '+width+', footer and crisis links passed.');
  } finally { await browser.close(); }
})().catch(e=>{console.error(e);process.exitCode=1;});

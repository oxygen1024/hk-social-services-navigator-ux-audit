import {lazy, Suspense, useMemo, useState} from 'react';
import {UNITS, UNIT_LISTS} from './units.js';
import {centreChecked} from './reviews.js';

const CentreMap = lazy(() => import('./CentreMap'));
const rad = Math.PI / 180;
function distance([lat, lon]: number[], [otherLat, otherLon]: number[]) {
  const a = Math.sin((otherLat-lat)*rad/2)**2 + Math.cos(lat*rad)*Math.cos(otherLat*rad)*Math.sin((otherLon-lon)*rad/2)**2;
  return 12742 * Math.asin(Math.sqrt(Math.min(1,a)));
}
const metaByKind = new Map(UNIT_LISTS.map(m => [m.kind, m]));
const kindOrder = (k: string) => k.startsWith('綜合家庭') ? -1 : UNIT_LISTS.findIndex(m => m.kind === k);
const isMaOnShan = (u: any) => u.address[0].includes('馬鞍山');
const normalize = (s: string) => s.normalize('NFKC').replace(/\s/g, '').toLowerCase();
const generalHours = '星期一至六 09:00–17:00（同類中心一般時間，個別中心或有不同）';

export function UnitList({district, kinds}: {district: string | null; kinds?: string[]}) {
  const [query, setQuery] = useState('');
  const [area, setArea] = useState('all');
  const [showMap, setShowMap] = useState(false);
  const [origin, setOrigin] = useState<number[] | null>(null);
  const [locationStatus, setLocationStatus] = useState('');
  const kindFilter = kinds?.join('|');
  const units = useMemo(() => {
    const search = normalize(query);
    if (!district && !origin && !search) return [];
    return UNITS.filter(u => (!district || u.siteDistrict === district) &&
      (!kindFilter || kindFilter.split('|').includes(u.kind)) &&
      (district !== '沙田區' || area === 'all' || (area === 'mos') === isMaOnShan(u)) &&
      (!search || normalize([u.name, u.agency, ...u.address].join(' ')).includes(search)))
      .sort((a,b) => (origin ? distance(origin, a.point) - distance(origin, b.point) : 0) ||
        kindOrder(a.kind)-kindOrder(b.kind) || a.name.localeCompare(b.name, 'zh-HK'));
  }, [district, kindFilter, area, query, origin]);
  function locate() {
    if (!navigator.geolocation) { setLocationStatus('此瀏覽器未能提供位置，請按地區或屋邨搜尋。'); return; }
    setLocationStatus('正在取得位置…');
    navigator.geolocation.getCurrentPosition(({coords}) => {
      setOrigin([coords.latitude, coords.longitude]);
      setLocationStatus('已按直線距離排列。實際步行路程視乎道路及中心入口。');
    }, () => setLocationStatus('未能取得位置。你仍可選地區或輸入屋邨、街道搜尋。'), {timeout:10000, maximumAge:60000});
  }
  const started = district || origin || query.trim();
  const lists = UNIT_LISTS.filter(list => units.some(u => u.kind === list.kind));
  return <section className="centre-directory" aria-label="中心搜尋結果">
    <label>搜尋中心、屋邨或街道<input type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="例如：馬鞍山、禾輋、恆安邨" /></label>
    {district === '沙田區' && <label>沙田區內地點<select value={area} onChange={e=>setArea(e.target.value)}>
      <option value="all">沙田全區（包括馬鞍山）</option><option value="mos">馬鞍山</option><option value="other">沙田其他地點</option>
    </select></label>}
    <section className="centre-tools" aria-label="位置及地圖">
      <button type="button" disabled={locationStatus === '正在取得位置…'} onClick={locate}>用我的位置按距離排列</button>
      {origin && <button type="button" onClick={()=>{setOrigin(null);setLocationStatus('已取消距離排序。');}}>取消定位</button>}
      {units.length > 0 && <button type="button" aria-expanded={showMap} onClick={()=>setShowMap(!showMap)}>{showMap ? '收起地圖' : '顯示地圖'}</button>}
    </section>
    <p role="status">{locationStatus || '可選擇地區或直接輸入關鍵字。只有按下定位後，才會要求使用你的位置。'}</p>
    {started && <>
      <p role="status"><strong>{district || '全港'}：{units.length} 間中心</strong></p>
      {units.length === 0 && <p>未有符合條件的中心。可清除關鍵字、改選地點或中心類型。</p>}
      {showMap && units.length > 0 && <Suspense fallback={<p>地圖載入中…</p>}><CentreMap units={units} /></Suspense>}
      {units.some(u => u.districts) && <p>此處按中心地址列出。綜合家庭服務中心按住址街段分工，可<a href="https://www.swd.gov.hk/tc/pubsvc/family/cat_family/ifs/" target="_blank" rel="noopener noreferrer">查閱社署服務範圍（另開分頁）</a>。</p>}
      <ul className="centre-results">{units.map(u => {
        const meta = metaByKind.get(u.kind)!;
        const checked = centreChecked(u);
        const phoneChecked = checked && checked > meta.phoneChecked ? checked : meta.phoneChecked;
        const route = new URL('https://www.google.com/maps/dir/');
        route.search = new URLSearchParams({api:'1', destination:u.point.join(',')}).toString();
        return <li id={'unit-'+u.kind+'-'+u.tel} key={u.kind+u.tel} tabIndex={-1}>
          <header><h3>{u.name}</h3>{origin && <strong>直線約 {distance(origin, u.point).toFixed(1)} 公里</strong>}</header>
          <p>{u.kind} · {u.siteDistrict}{u.meal ? ' · 提供膳食服務' : ''}</p>
          {u.agency && <p>{u.agency}</p>}
          {u.address.map(a=><p key={a}>{a}</p>)}
          <p><strong>開放時間　</strong>{u.hours?.length ? u.hours.join('；') : u.kind.startsWith('長者') ? generalHours : '官方名單未列個別時間，可致電中心查詢。'}</p>
          {checked && <p>中心資料核實日期　<time dateTime={checked}>{checked}</time></p>}
          <p>資料核實日期（主要電話）　<time dateTime={phoneChecked}>{phoneChecked}</time></p>
          <section className="centre-tools" aria-label={u.name+'聯絡及回報'}>
            <a href={'tel:'+u.tel}>{u.tel.slice(0,4)} {u.tel.slice(4)}</a>
            <a href={route.href} target="_blank" rel="noopener noreferrer">前往首個地址（外部地圖）</a>
            <button type="button" onClick={()=>window.dispatchEvent(new CustomEvent('report-centre',{detail:u}))}>資料有誤回報</button>
          </section>
        </li>;
      })}</ul>
      {lists.length > 0 && <details><summary>官方名單、地圖資料及來源日期</summary><ul>{lists.map(l=><li key={l.kind}>
        <a href={l.source} target="_blank" rel="noopener noreferrer">社署{l.kind}名單</a>（{l.asOf}） · <a href={l.geoSource} target="_blank" rel="noopener noreferrer">中心位置及開放時間</a>
      </li>)}</ul><p>地圖標示首個地址。部分大廈座標來自<a href="https://www.als.gov.hk/" target="_blank" rel="noopener noreferrer">政府地址查詢服務</a>。地區按<a href="https://data.gov.hk/tc-data/dataset/hk-had-json1-hong-kong-administrative-boundaries" target="_blank" rel="noopener noreferrer">民政事務總署行政區界</a>劃分。</p></details>}
    </>}
  </section>;
}

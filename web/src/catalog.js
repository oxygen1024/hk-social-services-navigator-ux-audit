// 合併各服務範疇：長者服務（data.js）及其他範疇（fields/*.js）。頁面一律由此讀取資料。
import * as elderlyData from './data.js';
import * as rehab from './fields/rehab.js';
import * as youth from './fields/youth.js';
import * as socsec from './fields/socsec.js';
import * as moreRehab from './fields/more-rehab.js';
import * as moreYouth from './fields/more-youth.js';
import * as moreSocsec from './fields/more-socsec.js';
import * as edu from './fields/edu.js';
import * as family from './fields/family.js';
import * as housing from './fields/housing.js';
import * as health from './fields/health.js';
import * as work from './fields/work.js';
import * as support from './fields/support.js';

// 補充服務：併入相應範疇
const extend = (base, more) => ({
  FIELD: base.FIELD,
  CATEGORIES: [...base.CATEGORIES, ...(more.NEW_CATEGORIES || [])],
  NEEDS: {...base.NEEDS, ...(more.NEW_NEEDS || {})},
  SERVICES: [...base.SERVICES, ...more.MORE],
});

export {CHECKED, CENTRE_LIST, ROUTES} from './data.js';

const elderly = {
  FIELD: {id: 'elderly', label: '長者服務', intro: '為長者提供的社區支援、居家及日間照顧、院舍照顧及照顧者支援。'},
  CATEGORIES: elderlyData.CATEGORIES,
  NEEDS: elderlyData.NEEDS,
  SERVICES: elderlyData.SERVICES,
};
const parts = [elderly, extend(rehab, moreRehab), extend(youth, moreYouth), extend(socsec, moreSocsec), family, edu, health, housing, work, support].filter(p => p.SERVICES.length);

// 服務頁「服務如何提供幫助？」的對象名稱
const USER_LABEL = {elderly: '對長者', rehab: '對殘疾人士／精神復元人士', youth: '對兒童及青少年', socsec: '對申請人', edu: '對學生', family: '對求助者', housing: '對申請住戶', health: '對病人', work: '對求職者及在職人士', support: '對求助者'};

export const FIELDS = parts.map(p => ({...p.FIELD, userLabel: USER_LABEL[p.FIELD.id] || '對服務使用者'}));
export const fieldUrl = id => `services.html?field=${encodeURIComponent(id)}`;
export const FIELD_BY_ID = Object.fromEntries(FIELDS.map(f => [f.id, f]));
export const CATEGORIES = parts.flatMap(p => p.CATEGORIES.map(([id, label]) => [id, label, p.FIELD.id]));
export const NEEDS_BY_FIELD = Object.fromEntries(parts.map(p => [p.FIELD.id, p.NEEDS]));
export const NEEDS = Object.assign({}, ...parts.map(p => p.NEEDS));
// extraCats：同一服務亦列於其他類別（例如高齡津貼亦屬社會保障）
export const SERVICES = parts.flatMap(p => p.SERVICES.map(s => ({...s, field: p.FIELD.id})));
const isUnsure = n => n === 'unsure' || n.endsWith('-unsure');
// 每個範疇必定保留的真人聯絡途徑：標有「未清楚」需要的第一項服務
export const ENTRY = Object.fromEntries(FIELDS.map(f => [f.id, SERVICES.find(s => s.field === f.id && s.needs.some(isUnsure))?.id]));

// 名詞英文：長者範疇原有詞彙 + 其他範疇服務的英文名稱縮寫（如有）
const extraTerms = SERVICES.filter(s => s.field !== 'elderly' && s.en).flatMap(s => {
  const abbr = s.en.match(/\(([A-Z][A-Za-z/ ]{1,15})\)\s*$/);
  return abbr ? [[s.name.replace(/（.*?）/g, ''), abbr[1]]] : [];
});
export const TERMS = [...elderlyData.TERMS, ...extraTerms].sort((a, b) => b[0].length - a[0].length);

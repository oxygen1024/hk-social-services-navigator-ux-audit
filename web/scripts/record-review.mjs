// Run after checking the named source records, including a check with no content changes.
import {readFileSync, writeFileSync, renameSync} from 'node:fs';
import {SERVICES} from '../src/catalog.js';
import {canonicalId} from '../src/paths.js';
import {UNITS, UNIT_LISTS} from '../src/units.js';

const file = new URL('../src/review-dates.json', import.meta.url);
const records = JSON.parse(readFileSync(file, 'utf8'));
const valid = {
  service: new Set(SERVICES.map(s => s.id)),
  centre: new Set(UNITS.map(u => u.kind + '/' + u.tel)),
  directory: new Set(UNIT_LISTS.map(list => list.kind)),
};
const group = {service: 'services', centre: 'centres', directory: 'directories'};
const date = new Intl.DateTimeFormat('en-CA', {timeZone: 'Asia/Hong_Kong', year: 'numeric', month: '2-digit', day: '2-digit'}).format(new Date());
const entries = process.argv.slice(2);
if (!entries.length) throw Error('請指定已核實的項目，例如 service:ccsv 或 centre:28051250。');
for (const entry of entries) {
  const [type, key] = entry.split(':');
  let id = type === 'service' ? canonicalId(key) : key;
  if (type === 'centre' && /^\d{8}$/.test(key)) {
    const matches = UNITS.filter(u => u.tel === key);
    if (matches.length > 1) throw Error('多間中心共用此電話。請用 centre:中心類型/電話 指定。');
    if (matches.length === 1) id = matches[0].kind + '/' + key;
  }
  if (!Object.hasOwn(valid, type) || !valid[type].has(id)) throw Error('找不到項目：' + entry);
  records[group[type]][id] = date;
}
const pending = new URL('./review-dates.' + process.pid + '.tmp', file);
writeFileSync(pending, JSON.stringify(records, null, 2) + '\n');
renameSync(pending, file);
console.log('已記錄核實日期', date, entries.join('、'));

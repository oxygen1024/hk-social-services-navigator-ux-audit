import dates from './review-dates.json';
import {CHECKED, SERVICES} from './catalog.js';
import {UNIT_LISTS} from './units.js';

const latest = values => values.filter(Boolean).sort().at(-1);
export const serviceChecked = s => latest([s.checked || CHECKED, dates.services[s.id]]);
export const centreChecked = unit => latest([dates.centres[unit.kind + '/' + unit.tel], dates.directories[unit.kind]]);
export const latestReview = latest([
  ...SERVICES.map(serviceChecked), ...Object.values(dates.centres), ...Object.values(dates.directories),
  ...UNIT_LISTS.map(s => s.phoneChecked),
]);

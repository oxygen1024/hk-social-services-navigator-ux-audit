// Social preview crawlers read the HTML without running React.
import {readFileSync, writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {SERVICES, FIELDS} from '../src/catalog.js';
import {fieldUrl, serviceUrl, centreUrl} from '../src/paths.js';

const escape = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const origin = 'https://socialservicelazypack.com/';

export function buildPreviews(out, write = (file, html) => writeFileSync(join(out, file), html)) {
  function page(template, file, data, label, summary, links) {
    const title = escape(label + '｜社福懶人包');
    const description = escape(summary.replaceAll('**', ''));
    const url = origin + file;
    const html = readFileSync(join(out, template), 'utf8')
      .replace(/<title>.*?<\/title>/, () => '<title>' + title + '</title>')
      .replace(/(<meta property="og:title" content=")[^"]*/, (_, start) => start + title)
      .replace(/(<meta (?:name="description"|property="og:description") content=")[^"]*/g, (_, start) => start + description)
      .replace(/(<link rel="canonical" href="|<meta property="og:url" content=")[^"]*/g, (_, start) => start + url)
      .replace('<body ', '<body ' + data + ' ')
      .replace(/<noscript>.*?<\/noscript>/s, () => '<noscript><h1>' + escape(label) + '</h1><p>' + description + '</p>' + links + '</noscript>');
    write(file, html);
  }
  const link = (url, label) => '<p><a href="' + escape(url) + '">' + escape(label) + '</a></p>';
  for (const s of SERVICES) page('service.html', serviceUrl(s.id), 'data-service="' + s.id + '"', s.name, s.what,
    link(s.source, '查閱官方服務資料') + link(fieldUrl(s.field), '返回服務範疇'));
  for (const f of FIELDS) page('services.html', fieldUrl(f.id), 'data-field="' + f.id + '"', f.label, f.intro,
    SERVICES.filter(s => s.field === f.id).map(s => link(serviceUrl(s.id), s.name)).join(''));
  page('services.html', centreUrl, 'data-view="centres"', '尋找就近服務中心', '按地區、中心類型或屋邨篩選香港社福中心，查看地圖、開放時間、電話及資料核實日期。', link('services.html','瀏覽所有服務'));
  const urls = ['index.html','need.html','services.html',centreUrl,...FIELDS.map(f=>fieldUrl(f.id)),...SERVICES.map(s=>serviceUrl(s.id))];
  write('sitemap.xml', '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + urls.map(path => '  <url><loc>' + origin + (path === 'index.html' ? '' : path) + '</loc></url>').join('\n') + '\n</urlset>\n');
}

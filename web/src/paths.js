// Flat addresses keep relative links working on the custom domain and GitHub Pages.
export const canonicalId = id => id === 'rehab-carer-hotline' ? 'carer-line' : id;
export const serviceUrl = id => 'service-' + encodeURIComponent(canonicalId(id)) + '.html';
export const fieldUrl = id => 'field-' + encodeURIComponent(id) + '.html';
export const centreUrl = 'centres.html';

export function contentLink(url) {
  const legacy = /^service\.html\?id=([\w-]+)$/.exec(url);
  return legacy ? serviceUrl(legacy[1]) : url;
}

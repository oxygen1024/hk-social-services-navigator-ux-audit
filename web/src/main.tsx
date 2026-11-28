import {StrictMode, Component, type ReactNode} from 'react';
import {createRoot} from 'react-dom/client';
import '@astryxdesign/core/reset.css';
import '@astryxdesign/core/astryx.css';
import './site.css';
import {Theme} from '@astryxdesign/core/theme';
import {InternationalizationProvider} from '@astryxdesign/core/i18n';
import zhTW from '@astryxdesign/core/locales/zh-TW.generated.js';
import {themes, defaultThemeSlug} from '../astryx-themes.js';
import Home from './pages/Home';
import Need from './pages/Need';
import Results from './pages/Results';
import Services from './pages/Services';
import Service from './pages/Service';
import MyList from './pages/MyList';
import Compare from './pages/Compare';

import {canonicalId, serviceUrl, centreUrl, fieldUrl} from './paths.js';
import {SERVICES, FIELD_BY_ID} from './catalog.js';

// Old bookmarks open the same service. Sharing the address then uses its static preview.
const incoming = new URL(location.href);
const legacyId = canonicalId(incoming.searchParams.get('id'));
const legacyField = incoming.searchParams.get('field');
let destination;
if (incoming.pathname.endsWith('/service.html') && SERVICES.some(s => s.id === legacyId)) {
  destination = serviceUrl(legacyId);
  incoming.searchParams.delete('id');
} else if (incoming.pathname.endsWith('/services.html') && incoming.searchParams.get('view') === 'centres') {
  destination = centreUrl;
  incoming.searchParams.delete('view');
} else if (incoming.pathname.endsWith('/services.html') && FIELD_BY_ID[legacyField]) {
  destination = fieldUrl(legacyField);
  incoming.searchParams.delete('field');
}
if (destination) location.replace(destination + incoming.search + incoming.hash);

class Fallback extends Component<{children: ReactNode}, {failed: boolean}> {
  state = {failed: false};
  static getDerivedStateFromError() { return {failed: true}; }
  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <p style={{padding: '1rem', fontSize: '1.125rem', lineHeight: 1.6}}>
        頁面暫時未能顯示。你可重新載入，或瀏覽
        <a href="https://www.gov.hk/tc/residents/">香港政府一站通</a>查找公共服務。<a href="index.html">返回首頁</a>
      </p>
    );
  }
}

const PAGES: Record<string, () => JSX.Element> = {home: Home, need: Need, results: Results, services: Services, service: Service, list: MyList, compare: Compare};
const Current = PAGES[document.body.dataset.page || 'home'];

if (!destination) createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Fallback>
      <InternationalizationProvider locale="zh-TW" messages={{'zh-TW': zhTW}}>
        <Theme theme={themes[defaultThemeSlug]}>
          <Current />
        </Theme>
      </InternationalizationProvider>
    </Fallback>
  </StrictMode>,
);

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

class Fallback extends Component<{children: ReactNode}, {failed: boolean}> {
  state = {failed: false};
  static getDerivedStateFromError() { return {failed: true}; }
  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <p style={{padding: '1rem', fontSize: '1.125rem', lineHeight: 1.6}}>
        頁面暫時未能顯示。如需協助，請致電照顧者支援專線 <a href="tel:182183">182 183</a>（24 小時），或瀏覽
        <a href="https://www.swd.gov.hk/tc/pubsvc/elderly/">社署安老服務網頁</a>。<a href="index.html">返回首頁</a>
      </p>
    );
  }
}

const PAGES: Record<string, () => JSX.Element> = {home: Home, need: Need, results: Results, services: Services, service: Service};
const Current = PAGES[document.body.dataset.page || 'home'];

createRoot(document.getElementById('root')!).render(
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

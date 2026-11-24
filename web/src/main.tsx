import {StrictMode} from 'react';
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

const PAGES: Record<string, () => JSX.Element> = {home: Home, need: Need, results: Results, services: Services, service: Service};
const Current = PAGES[document.body.dataset.page || 'home'];

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <InternationalizationProvider locale="zh-TW" messages={{'zh-TW': zhTW}}>
      <Theme theme={themes[defaultThemeSlug]}>
        <Current />
      </Theme>
    </InternationalizationProvider>
  </StrictMode>,
);

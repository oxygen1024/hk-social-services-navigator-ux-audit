// The hkcare theme. `astryx experimental theme editor` wrote this file once and never changes it again.
// The checked settings live in hkcare.settings.json and the generated hkcare.settings.ts;
// change them with `astryx experimental theme editor set hkcare ...`. Add your own changes below: they win over the settings.
import {defineTheme} from '@astryxdesign/core/theme';
import {hkcareSettings} from './hkcare.settings';

export const hkcareTheme = defineTheme({
  extends: hkcareSettings,
  name: 'hkcare',
});

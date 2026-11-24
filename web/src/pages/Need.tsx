import {useState} from 'react';
import {VStack} from '@astryxdesign/core/Layout';
import {Text, Heading} from '@astryxdesign/core/Text';
import {Button} from '@astryxdesign/core/Button';
import {Link} from '@astryxdesign/core/Link';
import {CheckboxList, CheckboxListItem} from '@astryxdesign/core/CheckboxList';
import {RadioList, RadioListItem} from '@astryxdesign/core/RadioList';
import {Page} from '../ui';
import {FIELDS, FIELD_BY_ID, NEEDS_BY_FIELD} from '../catalog.js';

const FUNDS = [['both', '兩者都想查看'], ['sub', '資助'], ['self', '自費'], ['unsure', '未清楚']];

export default function Need() {
  const q = new URLSearchParams(location.search);
  const [field, setField] = useState(FIELD_BY_ID[q.get('field') || ''] ? q.get('field')! : 'elderly');
  const needsHere = NEEDS_BY_FIELD[field] || {};
  const [needs, setNeeds] = useState<string[]>(q.getAll('need'));
  const [fund, setFund] = useState(q.get('fund') || 'both');
  const chosen = needs.filter(n => needsHere[n]);
  const go = () => {
    const p = new URLSearchParams({field});
    chosen.forEach(n => p.append('need', n));
    p.set('fund', fund);
    location.href = `results.html?${p}`;
  };
  return (
    <Page current="need.html" title="需要哪方面的協助？">
      <Link href="index.html">返回首頁</Link>
      <Heading level={1}>需要哪方面的協助？</Heading>
      <VStack gap={6}>
        <RadioList label="為誰尋找服務？" value={field} onChange={setField}>
          {FIELDS.map((f: any) => <RadioListItem key={f.id} value={f.id} label={f.label} description={f.intro} />)}
        </RadioList>
        <CheckboxList label="需要的協助" description="可選擇多於一項。" value={chosen} onChange={setNeeds} hasDividers>
          {Object.entries(needsHere).map(([k, v]: any) => <CheckboxListItem key={k} value={k} label={v.label} description={v.eg} />)}
        </CheckboxList>
        <RadioList label="想查看資助還是自費服務？" value={fund} onChange={setFund}>
          {FUNDS.map(([v, l]) => <RadioListItem key={v} value={v} label={l} />)}
        </RadioList>
        <Button label="查看結果" variant="primary" size="lg" onClick={go} />
        <Text type="supporting" color="secondary">毋須填寫姓名、身份證或病歷。答案只用作篩選顯示的服務。</Text>
      </VStack>
    </Page>
  );
}

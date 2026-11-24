import {useState} from 'react';
import {VStack, HStack} from '@astryxdesign/core/Layout';
import {Text, Heading} from '@astryxdesign/core/Text';
import {Link} from '@astryxdesign/core/Link';
import {TextInput} from '@astryxdesign/core/TextInput';
import {Selector} from '@astryxdesign/core/Selector';
import {SegmentedControl, SegmentedControlItem} from '@astryxdesign/core/SegmentedControl';
import {List, ListItem} from '@astryxdesign/core/List';
import {Banner} from '@astryxdesign/core/Banner';
import {Page, Calls, Tags} from '../ui';
import {SaveButton, useDistrict, DistrictSelector, UnitList} from '../features';
import {CATEGORIES, SERVICES, FIELDS, ROUTES} from '../catalog.js';

const norm = (v: string) => v.normalize('NFKC').trim().toLowerCase();
const isSubsidised = (s: any) => s.fund.startsWith('資助') || s.fund === '免費' || s.fund === '毋須供款';
const isSelfPay = (s: any) => s.fund.startsWith('自費');

function ServiceRow({s}: {s: any}) {
  return (
    <ListItem align="start" href={`service.html?id=${s.id}`}
      label={<Text weight="bold" size="lg">{s.name}</Text>}
      description={<VStack gap={1}><Text color="secondary" lang="en">{s.en}</Text><Tags s={s} /><Text>{s.what.replace(/\*\*/g, '')}</Text></VStack>}
      endContent={<SaveButton id={s.id} name={s.name} />} />
  );
}

export default function Services() {
  const [query, setQuery] = useState(() => new URLSearchParams(location.search).get('q') || '');
  const [fund, setFund] = useState('all');
  const [route, setRoute] = useState<string | null>(null);
  const [sort, setSort] = useState('category');
  const [district, setDistrict] = useDistrict();
  const q = norm(query);
  const cats = Object.fromEntries(CATEGORIES);
  const shown = SERVICES.filter((s: any) =>
    (!q || [s.name, s.en, ...(s.alias || []), cats[s.cat]].some((v: string) => norm(v || '').includes(q))) &&
    (fund === 'all' || (fund === 'sub' ? isSubsidised(s) : isSelfPay(s))) &&
    (!route || s.route === route));
  const filtered = q || fund !== 'all' || route;

  return (
    <Page current="services.html" title="所有服務">
      <VStack gap={2}>
        <Heading level={1}>所有服務</Heading>
        <Text type="large">按服務範疇及類別列出社署服務。按服務名稱即可查看門檻、申請步驟、收費及聯絡方法。</Text>
        {!q && <List listStyle="disc">
          {FIELDS.map((f: any) => <ListItem key={f.id} label={<Link href={`#field-${f.id}`} hasUnderline>{f.label}</Link>} />)}
        </List>}
      </VStack>

      <VStack gap={3}>
        <Heading level={2}>尋找就近長者中心</Heading>
        <DistrictSelector value={district} onChange={setDistrict} />
        <UnitList district={district} />
      </VStack>

      <VStack gap={3}>
        <Heading level={2}>篩選服務</Heading>
        <TextInput type="search" label="搜尋服務" description="可輸入中文或英文名稱、舊名或類別，例如：社區券、經濟援助" value={query} onChange={setQuery} startIcon="search" hasClear width="100%" />
        <VStack gap={1}>
          <Text weight="bold">資助或自費</Text>
          <SegmentedControl label="資助或自費" value={fund} onChange={setFund}>
            <SegmentedControlItem value="all" label="全部" />
            <SegmentedControlItem value="sub" label="資助／免費" />
            <SegmentedControlItem value="self" label="自費" />
          </SegmentedControl>
        </VStack>
        <Selector label="申請途徑" placeholder="全部途徑" value={route} onChange={setRoute} hasClear
          options={Object.entries(ROUTES).map(([v, l]) => ({value: v, label: l as string}))} />
        <VStack gap={1}>
          <Text weight="bold">排列方式</Text>
          <SegmentedControl label="排列方式" value={sort} onChange={setSort}>
            <SegmentedControlItem value="category" label="按範疇及類別" />
            <SegmentedControlItem value="name" label="按名稱" />
          </SegmentedControl>
        </VStack>
        {filtered && <Text role="status">{shown.length ? `找到 ${shown.length} 項服務` : '未找到相關服務。請試用較短的名稱，或清除搜尋及篩選以瀏覽所有服務。'}</Text>}
      </VStack>

      {sort === 'name' ? (
        <List hasDividers edge="flush">
          {[...shown].sort((a: any, b: any) => a.name.localeCompare(b.name, 'zh-HK')).map((s: any) => <ServiceRow key={s.id} s={s} />)}
        </List>
      ) : FIELDS.map((f: any) => {
        const fieldCats = CATEGORIES.filter(([, , fid]: string[]) => fid === f.id);
        const inCat = (cat: string) => shown.filter((s: any) => s.cat === cat || (s.extraCats || []).includes(cat));
        if (!fieldCats.some(([cat]: string[]) => inCat(cat).length)) return null;
        return (
          <VStack key={f.id} gap={4}>
            <VStack gap={1}>
              <Heading level={2} id={`field-${f.id}`}>{f.label}</Heading>
              <Text color="secondary">{f.intro}</Text>
              {f.id === 'elderly' && <Text>不少資助長者服務均須先接受<Link href="service.html?id=assessment" hasUnderline>安老服務統一評估</Link> (SCNAMES)。</Text>}
            </VStack>
            {fieldCats.map(([cat, title]: string[]) => {
              const items = inCat(cat);
              if (!items.length) return null;
              return (
                <VStack key={cat} gap={2}>
                  <Heading level={3} id={`cat-${cat}`}>{title}</Heading>
                  <List hasDividers edge="flush">{items.map((s: any) => <ServiceRow key={s.id} s={s} />)}</List>
                </VStack>
              );
            })}
          </VStack>
        );
      })}

      <Banner status="warning" title="懷疑長者受虐" description="可聯絡長者地區中心或綜合家庭服務中心，或致電以下熱線：" collapsible={false}>
        <VStack gap={1}>
          <Calls items={[['社署 (SWD) 熱線', '23432255', ''], ['向晴熱線', '18288', ''], ['芷若園危機熱線', '18281', '']]} />
          <Text type="supporting" color="secondary">來源：<Link href="https://www.swd.gov.hk/tc/pubsvc/elderly/cat_commsupp/serabuseelder/" hasUnderline>社署：預防及協助受虐待長者</Link>，核實日期 2026-11-23</Text>
        </VStack>
      </Banner>
    </Page>
  );
}

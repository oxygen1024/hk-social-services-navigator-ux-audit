import {useState} from 'react';
import {VStack} from '@astryxdesign/core/Layout';
import {Text, Heading} from '@astryxdesign/core/Text';
import {Link} from '@astryxdesign/core/Link';
import {TextInput} from '@astryxdesign/core/TextInput';
import {List, ListItem} from '@astryxdesign/core/List';
import {Banner} from '@astryxdesign/core/Banner';
import {Page, Calls, Tags} from '../ui';
import {CATEGORIES, SERVICES} from '../data.js';

const norm = (v: string) => v.normalize('NFKC').trim().toLowerCase();

export default function Services() {
  const [query, setQuery] = useState('');
  const q = norm(query);
  const cats = Object.fromEntries(CATEGORIES);
  const match = (s: any) => !q || [s.name, s.en, ...(s.alias || []), cats[s.cat]].some((v: string) => norm(v || '').includes(q));
  const shown = SERVICES.filter(match);
  return (
    <Page current="services.html" title="所有長者服務">
      <VStack gap={2}>
        <Heading level={1}>所有長者服務</Heading>
        <Text type="large">按類別列出社署長者服務。按服務名稱即可查看門檻、申請步驟、收費及聯絡方法。</Text>
        <Text>不少資助服務均須先接受<Link href="service.html?id=assessment" hasUnderline>安老服務統一評估</Link> (SCNAMES)。</Text>
      </VStack>
      <TextInput type="search" label="搜尋服務" description="可輸入中文或英文名稱、舊名或類別，例如：社區券、經濟援助" value={query} onChange={setQuery} startIcon="search" hasClear width="100%" />
      {q && <Text role="status">{shown.length ? `找到 ${shown.length} 項服務` : '未找到相關服務。請試用較短的名稱，或瀏覽以下類別。'}</Text>}
      {CATEGORIES.map(([cat, title]: string[]) => {
        const items = shown.filter((s: any) => s.cat === cat);
        if (!items.length) return null;
        return (
          <VStack key={cat} gap={2}>
            <VStack gap={2}>
              <Heading level={2} id={`cat-${cat}`}>{title}</Heading>
              <List hasDividers edge="flush">
                {items.map((s: any) => (
                  <ListItem key={s.id} align="start" href={`service.html?id=${s.id}`}
                    label={<Text weight="bold" size="lg">{s.name}</Text>}
                    description={<VStack gap={1}><Text color="secondary" lang="en">{s.en}</Text><Tags s={s} /><Text>{s.what.replace(/\*\*/g, '')}</Text></VStack>} />
                ))}
              </List>
            </VStack>
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

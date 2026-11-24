import {VStack, Card, HStack} from '@astryxdesign/core/Layout';
import {Text, Heading} from '@astryxdesign/core/Text';
import {Button} from '@astryxdesign/core/Button';
import {Link} from '@astryxdesign/core/Link';
import {Banner} from '@astryxdesign/core/Banner';
import {List, ListItem} from '@astryxdesign/core/List';
import {Page, Calls, Tags, useTerms} from '../ui';
import {CATEGORIES, NEEDS, NEEDS_BY_FIELD, SERVICES, CENTRE_LIST, ENTRY, FIELD_BY_ID} from '../catalog.js';

// 沒有專屬電話的服務，以 182 183 作最後一步（社署頁面：提供資訊、諮詢及轉介）
const FALLBACK = [['不知道應聯絡誰？照顧者支援專線，24 小時由社工接聽', '182183', '']];
const FUND = {both: '資助和自費都想查看', sub: '資助', self: '自費', unsure: '未清楚'} as Record<string, string>;

export default function Results() {
  const q = new URLSearchParams(location.search);
  const field = FIELD_BY_ID[q.get('field') || ''] ? q.get('field')! : 'elderly';
  const entry = ENTRY[field];
  const fieldCats = CATEGORIES.filter((c: string[]) => c[2] === field).map((c: string[]) => c[0]);
  const inField = SERVICES.filter((s: any) => s.field === field || (s.extraCats || []).some((c: string) => fieldCats.includes(c)));
  const picked = q.getAll('need').filter(n => NEEDS_BY_FIELD[field]?.[n]);
  const unsure = field === 'elderly' ? 'unsure' : `${field}-unsure`;
  const needs = picked.length ? picked : [unsure];
  const fund = q.get('fund') || 'both';
  const hits = inField.map((s: any) => ({s, n: s.needs.filter((x: string) => needs.includes(x)).length}))
    .filter(h => h.n)
    .sort((a, b) => (fund === 'self' ? +(b.s.fund === '自費') - +(a.s.fund === '自費') : 0) || b.n - a.n)
    .map(h => h.s);
  // 必定保留真人聯絡途徑：長者中心社工
  if (entry && !hits.some((s: any) => s.id === entry)) hits.push(SERVICES.find((s: any) => s.id === entry));
  const needsAssess = field === 'elderly' && hits.some((s: any) => ['assess', 'light', 'invite'].includes(s.route));
  const detail = (id: string) => `service.html?id=${id}&from=${encodeURIComponent(location.search)}`;
  const rich = useTerms();

  return (
    <Page current="need.html" title="可能相關的服務">
      <Link href={`need.html${location.search}`}>返回問題</Link>
      <VStack gap={2}>
        <Heading level={1}>可能相關的服務</Heading>
        <Text type="large">你選擇了：{FIELD_BY_ID[field].label}；{needs.map(n => NEEDS[n]?.label || '未清楚').join('、')}；{FUND[fund] || ''}。<Link href={`need.html${location.search}`} hasUnderline>修改答案</Link></Text>
        <Text>按服務名稱或「了解這項服務」，即可查看門檻、適合人士、服務內容、申請步驟及收費。</Text>
        <Text type="supporting" color="secondary">以下是可能相關的服務，並非資格判斷，須由社工或服務單位核實。</Text>
        {field === 'elderly' && fund === 'self' && <Text>本網站暫未收錄自費上門照顧機構。如欲比較自費上門照顧，可先向長者中心社工查詢。</Text>}
      </VStack>

      {hits.map((s: any, i: number) => (
        <VStack gap={4} key={s.id}>
          <Card padding={5} elevation="low">
            <VStack gap={3}>
              <VStack gap={1}>
                <Heading level={2}><Link href={detail(s.id)} hasUnderline type="inherit">{s.name}</Link></Heading>
                <Text color="secondary" lang="en">{s.en}</Text>
              </VStack>
              <Tags s={s} />
              <Text>{rich(s.what)}</Text>
              <Heading level={3}>門檻（須核實）</Heading>
              <List listStyle="disc">{s.who.map((w: string) => <ListItem key={w} label={<Text>{rich(w)}</Text>} />)}</List>
              <Heading level={3}>下一步</Heading>
              <Text>{rich(s.how)}</Text>
              <HStack gap={2}>
                <Button label="了解這項服務" variant="secondary" href={detail(s.id)} />
                {s.id === 'centres' && <Button label="就近中心電話（PDF）" variant="ghost" href={CENTRE_LIST} />}
              </HStack>
              <Calls items={s.contacts.length ? s.contacts : FALLBACK} />
            </VStack>
          </Card>
          {i === 0 && needsAssess && (
            <Banner status="info" title="不少資助服務須先進行評估" description="資助長期護理服務須先接受「安老服務統一評估」。如未曾接受評估，請先聯絡長者中心或綜合家庭服務中心社工協助申請。" endContent={<Link href="service.html?id=assessment">了解評估程序</Link>} collapsible={false} />
          )}
        </VStack>
      ))}

      <Banner status="error" title="有即時危險？" collapsible={false}>
        <Calls items={[['報警或召喚救護車', '999', '']]} />
      </Banner>
    </Page>
  );
}

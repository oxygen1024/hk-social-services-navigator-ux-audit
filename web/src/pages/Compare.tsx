import {VStack, HStack} from '@astryxdesign/core/Layout';
import {Text, Heading} from '@astryxdesign/core/Text';
import {Link} from '@astryxdesign/core/Link';
import {Button} from '@astryxdesign/core/Button';
import {Table} from '@astryxdesign/core/Table';
import {Page, telText} from '../ui';
import {List, ListItem} from '@astryxdesign/core/List';
import {SERVICES, ROUTES, FIELD_BY_ID} from '../catalog.js';

// 2 至 3 項服務並排比較：門檻、收費、服務內容、申請途徑、聯絡
export default function Compare() {
  const ids = (new URLSearchParams(location.search).get('ids') || '').split(',').filter(Boolean).slice(0, 3);
  const list: any[] = ids.map(id => SERVICES.find((s: any) => s.id === id)).filter(Boolean);
  const plain = (t = '') => t.replace(/\*\*/g, '');
  const bullets = (items: string[] = []) => <List listStyle="disc" density="compact">{items.map(t => <ListItem key={t} label={<Text>{plain(t)}</Text>} />)}</List>;
  const cost = (s: any) => s.costTable
    ? <VStack gap={1}>{s.cost && <Text>{plain(s.cost)}</Text>}{s.costTable.slice(1).map((r: string[]) => <Text key={r.join()}>{plain(r[0])}：{plain(r.slice(1).join('／'))}</Text>)}</VStack>
    : <Text>{plain(s.cost) || '頁面未列明，請向服務單位查詢'}</Text>;
  const rows = [
    ['範疇', (s: any) => <Text>{FIELD_BY_ID[s.field].label}</Text>],
    ['門檻', (s: any) => bullets(s.whoBoth || s.who)],
    ['申請途徑', (s: any) => <VStack gap={1}><Text weight="bold">{ROUTES[s.route]}</Text><Text>{plain(s.how)}</Text></VStack>],
    ['收費', cost],
    ['服務內容', (s: any) => bullets(s.helps)],
    ['聯絡', (s: any) => s.contacts.length ? <VStack gap={1}>{s.contacts.map(([w, n]: string[]) => <Text key={w + n}>{w}：<Link href={`tel:${n}`} hasUnderline>{telText(n)}</Link></Text>)}</VStack> : <Text>請參閱服務頁的單位名單</Text>],
  ] as const;
  return (
    <Page current="list.html" title="比較服務">
      <Link href="list.html">返回我的清單</Link>
      <Heading level={1}>比較服務</Heading>
      {list.length < 2 ? (
        <Text>請在<Link href="list.html" hasUnderline>我的清單</Link>選擇 2 至 3 項服務作比較。</Text>
      ) : (
        <VStack gap={3}>
          <Table density="compact" verticalAlign="top" idKey="id"
            data={rows.map(([label, cell], id) => ({id, label, cell}))}
            columns={[
              {key: 'label', header: '項目', width: 90, renderCell: (r: any) => <Text weight="bold">{r.label}</Text>},
              ...list.map(s => ({key: s.id, header: s.name, renderCell: (r: any) => r.cell(s)})),
            ]} />
          <Text type="supporting" color="secondary">比較表只列出摘要，詳細條件請按服務名稱查看各服務頁；最終以社署及服務單位為準。</Text>
          <HStack gap={2}>
            {list.map(s => <Link key={s.id} href={`service.html?id=${s.id}`} hasUnderline>{s.name}</Link>)}
          </HStack>
          <Button label="列印比較表" onClick={() => window.print()} />
        </VStack>
      )}
    </Page>
  );
}

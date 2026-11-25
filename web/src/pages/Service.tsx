import {VStack, HStack, Card} from '@astryxdesign/core/Layout';
import {Text, Heading} from '@astryxdesign/core/Text';
import {Link} from '@astryxdesign/core/Link';
import {List, ListItem} from '@astryxdesign/core/List';
import {Breadcrumbs, BreadcrumbItem} from '@astryxdesign/core/Breadcrumbs';
import {Stepper, Step} from '@astryxdesign/core/Stepper';
import {Table} from '@astryxdesign/core/Table';
import {ProgressBar} from '@astryxdesign/core/ProgressBar';
import {Icon} from '@astryxdesign/core/Icon';
import {CheckIcon} from '@heroicons/react/24/outline';
import {Page, Calls, Tags, DataTable, useTerms, termsIn} from '../ui';
import {SaveButton, useDistrict, DistrictSelector, UnitList} from '../features';
import {CATEGORIES, SERVICES, CHECKED, FIELD_BY_ID} from '../catalog.js';

const FALLBACK = [['不知道應聯絡誰？照顧者支援專線，24 小時由社工接聽', '182183', '']];

// 社區券共同付款：六級（社署頁面列明 5%、8%、12%、16%、25%、40%）
function CopayChart() {
  const rows = [5, 8, 12, 16, 25, 40].map(p => ({id: p, p}));
  return (
    <VStack gap={1}>
      <Text weight="bold">社區券六個共同付款級別：長者及政府分別支付的比例</Text>
      <Table data={rows} idKey="id" density="compact" columns={[
        {key: 'me', header: '長者支付', width: 90, renderCell: (r: any) => <Text hasTabularNumbers>{r.p}%</Text>},
        {key: 'bar', header: '比例', renderCell: (r: any) => <ProgressBar label={`長者支付 ${r.p}%`} isLabelHidden value={r.p} />},
        {key: 'gov', header: '政府支付', width: 90, align: 'end', renderCell: (r: any) => <Text hasTabularNumbers>{100 - r.p}%</Text>},
      ]} />
    </VStack>
  );
}

// 有地區單位名單的服務：按區顯示中心
const UNIT_KINDS: Record<string, string[]> = {centres: ['長者地區中心', '長者鄰舍中心'], ste: ['長者地區中心'], assessment: ['長者地區中心', '長者鄰舍中心']};
function NearbyUnits({kinds}: {kinds: string[]}) {
  const [district, setDistrict] = useDistrict();
  return (
    <VStack gap={2}>
      <Heading level={2}>尋找就近中心</Heading>
      <DistrictSelector value={district} onChange={setDistrict} />
      <UnitList district={district} kinds={kinds} />
    </VStack>
  );
}

const Block = ({title, children}: any) => (
  <VStack gap={2}><Heading level={2}>{title}</Heading>{children}</VStack>
);

export default function Service() {
  const q = new URLSearchParams(location.search);
  const s: any = SERVICES.find((x: any) => x.id === q.get('id'));
  const current = s?.id === 'assessment' ? 'service.html?id=assessment' : 'services.html';
  if (!s) {
    return (
      <Page current={current} title="找不到這項服務">
        <Heading level={1}>找不到這項服務</Heading>
        <Text>連結可能有誤，請<Link href="services.html" hasUnderline>查看所有服務</Link>。</Text>
      </Page>
    );
  }
  const rawFrom = q.get('from');
  const from = rawFrom === null ? null : rawFrom.startsWith('?') ? rawFrom : '';
  const rich = useTerms(termsIn(s.name));
  const cat = Object.fromEntries(CATEGORIES)[s.cat];
  const others = SERVICES.filter((o: any) => o.cat === s.cat && o.id !== s.id);
  const bullets = (items: string[]) => <List listStyle="disc">{items.map(t => <ListItem key={t} label={<Text>{rich(t)}</Text>} />)}</List>;

  return (
    <Page current={current} title={s.name}>
      <VStack gap={2}>
        {from !== null && <Link href={`results.html${from}`}>返回你的搜尋結果</Link>}
        <Breadcrumbs variant="supporting" label="目前位置">
          <BreadcrumbItem href="index.html">首頁</BreadcrumbItem>
          <BreadcrumbItem href="services.html">所有服務</BreadcrumbItem>
          <BreadcrumbItem href={`services.html#field-${s.field}`}>{FIELD_BY_ID[s.field].label}</BreadcrumbItem>
          <BreadcrumbItem href={`services.html#cat-${s.cat}`}>{cat}</BreadcrumbItem>
        </Breadcrumbs>
        <Heading level={1}>{s.name}</Heading>
        <Text color="secondary" lang="en">{s.en}</Text>
        <Tags s={s} />
        <Text type="large">{rich(s.what)}</Text>
        <HStack gap={2}><SaveButton id={s.id} name={s.name} /></HStack>
        {s.youtube && (
          // YouTube 私隱加強模式：未按播放前不設追蹤 cookie
          <Card padding={3} maxWidth={380}>
            <VStack gap={2}>
              <Text weight="bold">短片：了解這項服務</Text>
              <iframe src={`https://www.youtube-nocookie.com/embed/${s.youtube}`} title={`${s.name}介紹短片`} loading="lazy"
                allow="encrypted-media; picture-in-picture; fullscreen" allowFullScreen referrerPolicy="strict-origin-when-cross-origin"
                style={{width: '100%', aspectRatio: '9 / 16', border: 0}} />
              <Text type="supporting" color="secondary">影片由 YouTube 播放，播放時會連接 YouTube。內容以下方文字及社署資料為準。</Text>
            </VStack>
          </Card>
        )}
      </VStack>

      <Card padding={5} variant="green">
        <VStack gap={3}>
          <Heading level={2}>門檻：誰可以使用？</Heading>
          <Text>{s.rule}</Text>
          {s.compareTable && <><DataTable rows={s.compareTable} rich={rich} /><Text>兩種津貼均須符合：</Text></>}
          <List hasDividers edge="flush">
            {(s.whoBoth || s.who).map((w: string) => <ListItem key={w} startContent={<Icon icon={CheckIcon} color="success" />} label={<Text>{rich(w)}</Text>} />)}
          </List>
          {s.free && <><Heading level={3}>須留意</Heading>{bullets(s.free)}</>}
          <Text type="supporting" color="secondary">以上是社署列明的條件，最終由社工或服務單位核實。</Text>
        </VStack>
      </Card>

      <Block title="這項服務適合哪些人士？">
        <Text>例如以下情況：</Text>
        <Text type="supporting" color="secondary">（僅供參考，並非資格判斷）</Text>
        {bullets(s.forWhom)}
      </Block>

      <Block title="服務如何提供幫助？">
        <Heading level={3}>{FIELD_BY_ID[s.field].userLabel}</Heading>
        <Text>{rich(s.elder)}</Text>
        <Heading level={3}>對家人／照顧者</Heading>
        <Text>{rich(s.carer)}</Text>
        <Heading level={3}>具體服務內容</Heading>
        {bullets(s.helps)}
      </Block>

      <Block title="如何申請">
        <Stepper activeStep={-1} orientation="vertical" label="申請步驟">
          {s.steps.map(([t, d]: string[], i: number) => <Step key={i} step={i} label={t} indicator="number"><Text>{rich(d)}</Text></Step>)}
        </Stepper>
      </Block>

      {(s.cost || s.costTable || s.chart) && (
        <Block title={s.cat === 'money' ? '津貼金額' : '收費'}>
          {s.cost && <Text>{rich(s.cost)}</Text>}
          {s.chart === 'copay' && <CopayChart />}
          {s.example && <Text type="supporting" color="secondary">{s.example}</Text>}
          {s.costTable && <DataTable rows={s.costTable} rich={rich} />}
          {s.limitTable && <DataTable rows={s.limitTable} rich={rich} />}
        </Block>
      )}
      {s.hoursTable && <Block title="服務時間"><DataTable rows={s.hoursTable} rich={rich} /></Block>}

      {UNIT_KINDS[s.id] && <NearbyUnits kinds={UNIT_KINDS[s.id]} />}

      <Block title="聯絡">
        <Calls items={s.contacts.length ? s.contacts : FALLBACK} />
        {s.links.length > 0 && <List listStyle="disc">{s.links.map(([t, u]: string[]) => <ListItem key={u} label={<Link href={u} hasUnderline>{t}</Link>} />)}</List>}
      </Block>

      {s.ask && <Block title="致電時可查詢的問題">{bullets(s.ask)}<Text type="supporting" color="secondary">以上為建議問題，可按實際情況修改。</Text></Block>}

      {(s.note || s.alias) && (
        <Block title="其他資料">
          {s.note && <Text>{s.note}</Text>}
          {s.alias && <Text>其他名稱：{s.alias.join('、')}</Text>}
        </Block>
      )}

      <Text type="supporting" color="secondary">
        來源：<Link href={s.source} hasUnderline>社署網頁</Link>
        {s.source2 && <>；<Link href={s.source2[0]} hasUnderline>{s.source2[1]}</Link></>}，核實日期 {s.checked || CHECKED}
      </Text>

      {others.length > 0 && (
        <Block title="同類服務">
          <List listStyle="disc">{others.map((o: any) => <ListItem key={o.id} label={<Link href={`service.html?id=${o.id}`} hasUnderline>{o.name}</Link>} />)}</List>
        </Block>
      )}
      <HStack gap={2}>
        {from !== null && <Link href={`results.html${from}`} hasUnderline>返回你的搜尋結果</Link>}
        <Link href="services.html" hasUnderline>返回所有服務</Link>
      </HStack>
    </Page>
  );
}

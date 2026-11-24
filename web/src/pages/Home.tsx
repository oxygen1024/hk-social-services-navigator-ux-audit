import {VStack} from '@astryxdesign/core/Layout';
import {Text, Heading} from '@astryxdesign/core/Text';
import {Button} from '@astryxdesign/core/Button';
import {Link} from '@astryxdesign/core/Link';
import {Banner} from '@astryxdesign/core/Banner';
import {List, ListItem} from '@astryxdesign/core/List';
import {Page, Calls} from '../ui';
import {CENTRE_LIST, FIELDS, SERVICES} from '../catalog.js';

export default function Home() {
  return (
    <Page current="index.html" title="尋找社會福利服務">
      <VStack gap={3}>
        <Heading level={1}>尋找社會福利服務</Heading>
        <Text type="large">從 {FIELDS.length} 個範疇、{SERVICES.length} 項服務中，查找服務對象、申請方法、收費及聯絡資料。</Text>
        <form role="search" action="services.html" className="home-search">
          <label htmlFor="home-query">按名稱或關鍵字搜尋</label>
          <input id="home-query" name="q" type="search" placeholder="例如：社區券、綜援" />
          <button type="submit">搜尋</button>
        </form>
      </VStack>

      <VStack gap={2}>
        <Heading level={2}>未清楚服務名稱？</Heading>
        <Text>選擇服務對象、所需協助及資助偏好，查看可能適合的服務。</Text>
        <Button label="按需要找服務" variant="primary" size="lg" href="need.html" />
      </VStack>

      <VStack gap={2}>
        <Heading level={2}>按服務範疇瀏覽</Heading>
        <List hasDividers edge="flush">
          {FIELDS.map((f: any) => <ListItem key={f.id} href={`services.html#field-${f.id}`} label={<Text weight="bold">{f.label}</Text>} description={<Text color="secondary">{f.intro}</Text>} />)}
        </List>
      </VStack>

      <VStack gap={2}>
        <VStack gap={2}>
          <Heading level={2}>不知從何開始？</Heading>
          <Text>長者服務：請致電就近的長者地區中心 (DECC) 或長者鄰舍中心 (NEC)，向社工說明長者的居住地區及所需協助。不少資助服務均由中心社工協助申請。</Text>
          <Link href={CENTRE_LIST} hasUnderline>全港長者中心名單及電話（PDF）</Link>
          <Text>護老者、殘疾人士及精神復元人士的照顧者，可致電照顧者支援專線 182 183（24 小時）；其他查詢可致電社署熱線 2343 2255。</Text>
        </VStack>
      </VStack>

      <Text type="supporting" color="secondary">毋須提供個人資料。正式資格由相關服務機構核實。</Text>

      <Banner status="error" title={<Text id="urgent" weight="bold">緊急求助</Text>} collapsible={false}>
        <Calls items={[['有即時危險', '999', ''], ['照顧者難以支撐（24 小時社工接聽）', '182183', ''], ['懷疑長者受虐：社署 (SWD) 熱線', '23432255', '']]} />
      </Banner>
    </Page>
  );
}

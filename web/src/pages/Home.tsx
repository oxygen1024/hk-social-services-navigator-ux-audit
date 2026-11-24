import {VStack} from '@astryxdesign/core/Layout';
import {Text, Heading} from '@astryxdesign/core/Text';
import {Button} from '@astryxdesign/core/Button';
import {Link} from '@astryxdesign/core/Link';
import {Banner} from '@astryxdesign/core/Banner';
import {List, ListItem} from '@astryxdesign/core/List';
import {Page, Calls} from '../ui';
import {CENTRE_LIST, FIELDS} from '../catalog.js';

export default function Home() {
  return (
    <Page current="index.html" title="尋找社會福利服務">
      <VStack gap={3}>
        <Heading level={1}>尋找社會福利服務</Heading>
        <Text type="large">選擇服務對象及所需協助，即可了解哪些社署服務可能適合，以及下一步應聯絡誰。</Text>
        <Button label="由需要開始" variant="primary" size="lg" href="need.html" />
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

      <VStack gap={2}>
        <VStack gap={2}>
          <Heading level={2}>本網站的用途</Heading>
          <List listStyle="disc">
            <ListItem label="以日常用語協助你尋找可能相關的社署長者服務。" />
            <ListItem label="每項服務均列明須核實的條件及可聯絡的單位。" />
            <ListItem label="不會判斷你是否符合資格，亦不會收集你的個人資料。" />
          </List>
        </VStack>
      </VStack>

      <Banner status="error" title={<Text id="urgent" weight="bold">緊急求助</Text>} collapsible={false}>
        <Calls items={[['有即時危險', '999', ''], ['照顧者難以支撐（24 小時社工接聽）', '182183', ''], ['懷疑長者受虐：社署 (SWD) 熱線', '23432255', '']]} />
      </Banner>
    </Page>
  );
}

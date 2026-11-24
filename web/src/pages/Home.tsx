import {VStack} from '@astryxdesign/core/Layout';
import {Text, Heading} from '@astryxdesign/core/Text';
import {Button} from '@astryxdesign/core/Button';
import {Link} from '@astryxdesign/core/Link';
import {Banner} from '@astryxdesign/core/Banner';
import {List, ListItem} from '@astryxdesign/core/List';
import {Page, Calls} from '../ui';
import {CENTRE_LIST} from '../data.js';

export default function Home() {
  return (
    <Page current="index.html" title="為家中長者尋找服務">
      <VStack gap={3}>
        <Heading level={1}>為家中長者尋找服務</Heading>
        <Text type="large">選擇長者所需的協助，再選擇資助或自費，即可了解哪些服務可能適合，以及下一步應聯絡誰。</Text>
        <Button label="由需要開始" variant="primary" size="lg" href="need.html" />
      </VStack>

      <Banner status="error" title={<Text id="urgent" weight="bold">緊急求助</Text>} collapsible={false}>
        <Calls items={[['有即時危險', '999', ''], ['照顧者難以支撐（24 小時社工接聽）', '182183', ''], ['懷疑長者受虐：社署 (SWD) 熱線', '23432255', '']]} />
      </Banner>

      <Text>亦可<Link href="services.html" hasUnderline>直接查看所有長者服務</Link>。</Text>

      <VStack gap={2}>
        <VStack gap={2}>
          <Heading level={2}>不知從何開始？</Heading>
          <Text>請致電就近的長者地區中心 (DECC) 或長者鄰舍中心 (NEC)，向社工說明長者的居住地區及所需協助。不少資助服務均由中心社工協助申請。</Text>
          <Link href={CENTRE_LIST} hasUnderline>全港長者中心名單及電話（PDF）</Link>
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
    </Page>
  );
}

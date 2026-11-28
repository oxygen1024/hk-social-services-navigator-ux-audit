import {VStack} from '@astryxdesign/core/Layout';
import {Text, Heading} from '@astryxdesign/core/Text';
import {Button} from '@astryxdesign/core/Button';
import {Link} from '@astryxdesign/core/Link';
import {Banner} from '@astryxdesign/core/Banner';
import {HomeModernIcon, HeartIcon, UserGroupIcon, WalletIcon, ArrowRightIcon, AcademicCapIcon, ShieldCheckIcon, BuildingOffice2Icon, BriefcaseIcon, PlusCircleIcon, LifebuoyIcon} from '@heroicons/react/24/outline';
import {Page, Calls, VideoCard} from '../ui';
import {FIELDS, fieldUrl} from '../catalog.js';
import {VIDEOS} from '../videos.js';

const fieldIcons = {elderly: HomeModernIcon, rehab: HeartIcon, youth: UserGroupIcon, socsec: WalletIcon, edu: AcademicCapIcon, family: ShieldCheckIcon, housing: BuildingOffice2Icon, health: PlusCircleIcon, work: BriefcaseIcon, support: LifebuoyIcon};

export default function Home() {
  return (
    <Page current="index.html" title="尋找社會福利服務">
      <section className="directory-intro">
        <Heading level={1}>尋找社會福利服務</Heading>
        <Text type="large">社福懶人包是香港社會福利服務指南，方便你為自己或家人尋找支援。社署和機構網站提供官方服務詳情。在這裏，你可以按生活需要搜尋，把不同服務的資格和收費並排比較，再到原網站核實申請方法。</Text>
        <form role="search" action="services.html" className="home-search">
          <label htmlFor="home-query">按名稱或關鍵字搜尋</label>
          <input id="home-query" name="q" type="search" placeholder="例如：社區券、綜援" />
          <button type="submit">搜尋</button>
        </form>
      </section>

      <VideoCard id={VIDEOS.home} heading="短片：一分鐘認識社福懶人包" title="社福懶人包介紹短片" note="服務資料以網站文字及官方網頁為準。" />

      <VStack gap={2}>
        <Heading level={2}>未清楚服務名稱？</Heading>
        <Text>選擇服務對象、所需協助及資助偏好，查看可能適合的服務。</Text>
        <Button label="按需要找服務" variant="primary" size="lg" href="need.html" />
      </VStack>

      <VStack gap={2}>
        <Heading level={2}>按服務範疇瀏覽</Heading>
        <ul className="field-grid">
          {FIELDS.map(field => {
            const Icon = fieldIcons[field.id as keyof typeof fieldIcons] || UserGroupIcon;
            return <li key={field.id}><a href={fieldUrl(field.id)}>
              <Icon aria-hidden="true" className="field-symbol" />
              <strong>{field.label}</strong><p>{field.intro}</p>
              <ArrowRightIcon aria-hidden="true" className="field-arrow" />
            </a></li>;
          })}
        </ul>
      </VStack>

      <VStack gap={2}>
        <VStack gap={2}>
          <Heading level={2}>不知從何開始？</Heading>
          <Text>任何個人或家庭，均可向居住地區的綜合家庭服務中心查詢或尋求協助，社工會按需要提供輔導或轉介服務。</Text>
          <Link href="centres.html" hasUnderline>按地區尋找綜合家庭服務中心及其他服務中心</Link>
          <Text>長者亦可聯絡就近的長者地區中心 (DECC) 或長者鄰舍中心 (NEC)；兒童及青少年可聯絡綜合青少年服務中心；殘疾人士可聯絡殘疾人士地區支援中心。</Text>
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

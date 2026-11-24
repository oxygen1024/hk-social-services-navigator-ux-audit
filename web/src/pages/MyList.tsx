import {useState} from 'react';
import {VStack, HStack} from '@astryxdesign/core/Layout';
import {Text, Heading} from '@astryxdesign/core/Text';
import {Button} from '@astryxdesign/core/Button';
import {Link} from '@astryxdesign/core/Link';
import {CheckboxList, CheckboxListItem} from '@astryxdesign/core/CheckboxList';
import {Banner} from '@astryxdesign/core/Banner';
import {Page, Tags} from '../ui';
import {useMyList} from '../features';
import {SERVICES, FIELD_BY_ID} from '../catalog.js';

export default function MyList() {
  const {list, remove, clear} = useMyList();
  const saved = list.map(id => SERVICES.find((s: any) => s.id === id)).filter(Boolean);
  const [picked, setPicked] = useState<string[]>([]);
  const chosen = picked.filter(id => list.includes(id));
  return (
    <Page current="list.html" title="我的清單">
      <VStack gap={2}>
        <Heading level={1}>我的清單</Heading>
        <Text>在服務頁按「收藏」即可加入清單，方便比較或列印給家人參考。</Text>
        <Text type="supporting" color="secondary">清單只儲存在你這部裝置的瀏覽器內，不會傳送到任何伺服器；清除瀏覽器資料或使用私隱模式時會消失。</Text>
      </VStack>
      {!saved.length ? (
        <Banner status="info" title="清單暫時沒有服務" description="可先瀏覽所有服務，再按「收藏」。" endContent={<Link href="services.html">瀏覽所有服務</Link>} collapsible={false} />
      ) : (
        <VStack gap={4}>
          {saved.map((s: any) => (
            <VStack key={s.id} gap={1}>
              <Heading level={2}><Link href={`service.html?id=${s.id}`} hasUnderline type="inherit">{s.name}</Link></Heading>
              <Text color="secondary">{FIELD_BY_ID[s.field].label}</Text>
              <Tags s={s} />
              <Text>{s.what.replace(/\*\*/g, '')}</Text>
              <HStack gap={2}><Button label={`移除：${s.name}`} size="sm" variant="ghost" onClick={() => remove(s.id)}>移除</Button></HStack>
            </VStack>
          ))}
          <CheckboxList label="選擇 2 至 3 項服務作比較" value={chosen} onChange={v => setPicked(v.slice(0, 3))}>
            {saved.map((s: any) => <CheckboxListItem key={s.id} value={s.id} label={s.name} isDisabled={chosen.length >= 3 && !chosen.includes(s.id)} />)}
          </CheckboxList>
          <HStack gap={2}>
            <Button label="比較所選服務" variant="primary" isDisabled={chosen.length < 2} href={chosen.length >= 2 ? `compare.html?ids=${chosen.join(',')}` : undefined} />
            <Button label="列印清單" onClick={() => window.print()} />
            <Button label="清除全部" variant="destructive" onClick={() => { if (window.confirm('確定清除我的清單內所有服務？')) clear(); }} />
          </HStack>
        </VStack>
      )}
    </Page>
  );
}

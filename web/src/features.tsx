// 我的清單（localStorage）、地區單位、意見回饋。
import {Fragment, useEffect, useState} from 'react';
import {VStack, HStack} from '@astryxdesign/core/Layout';
import {Text} from '@astryxdesign/core/Text';
import {Link} from '@astryxdesign/core/Link';
import {Badge} from '@astryxdesign/core/Badge';
import {Button} from '@astryxdesign/core/Button';
import {ToggleButton} from '@astryxdesign/core/ToggleButton';
import {Selector} from '@astryxdesign/core/Selector';
import {List, ListItem} from '@astryxdesign/core/List';
import {Icon} from '@astryxdesign/core/Icon';
import {HeartIcon} from '@heroicons/react/24/outline';
import {HeartIcon as HeartSolid} from '@heroicons/react/24/solid';
import {UNITS, DISTRICTS, UNIT_LISTS} from './units.js';

// 綜合家庭服務中心排先（任何人可求助），其後按名單次序
const KIND_ORDER = (k: string) => { const i = UNIT_LISTS.findIndex((l: any) => l.kind === k); return k.startsWith('綜合家庭') ? -1 : i; };

// ── 儲存：只存在使用者自己的瀏覽器，私隱瀏覽或已清除資料時會是空的 ──
const LIST_KEY = 'hkcare-my-list';
const DISTRICT_KEY = 'hkcare-district';
const read = (k: string) => { try { return localStorage.getItem(k); } catch { return null; } };
const write = (k: string, v: string | null) => {
  try { v === null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch { /* 只在本頁有效 */ }
  window.dispatchEvent(new Event('hkcare-store'));
};
const readList = (): string[] => { try { return JSON.parse(read(LIST_KEY) || '[]'); } catch { return []; } };

export function useMyList() {
  const [list, setList] = useState<string[]>(readList);
  useEffect(() => {
    const sync = () => setList(readList());
    window.addEventListener('hkcare-store', sync);
    window.addEventListener('storage', sync);
    return () => { window.removeEventListener('hkcare-store', sync); window.removeEventListener('storage', sync); };
  }, []);
  const save = (ids: string[]) => write(LIST_KEY, JSON.stringify(ids));
  return {
    list,
    has: (id: string) => list.includes(id),
    toggle: (id: string) => save(list.includes(id) ? list.filter(x => x !== id) : [...list, id]),
    remove: (id: string) => save(list.filter(x => x !== id)),
    clear: () => write(LIST_KEY, null),
  };
}

export function SaveButton({id, name}: {id: string; name: string}) {
  const {has, toggle} = useMyList();
  const saved = has(id);
  return (
    <ToggleButton label={saved ? `從我的清單移除：${name}` : `收藏至我的清單：${name}`} isPressed={saved} onPressedChange={() => toggle(id)}
      icon={<Icon icon={saved ? HeartSolid : HeartIcon} color={saved ? 'error' : 'inherit'} />}>
      {saved ? '已收藏' : '收藏'}
    </ToggleButton>
  );
}

// 頂部「我的清單」連結及數目
export function ListCount() {
  const {list} = useMyList();
  return <>我的清單{list.length > 0 && <> ({list.length})</>}</>;
}

// ── 地區單位：長者地區中心／長者鄰舍中心（社署名單） ──
export function useDistrict() {
  const [district, setDistrict] = useState<string | null>(() => read(DISTRICT_KEY));
  return [district, (d: string | null) => { setDistrict(d); write(DISTRICT_KEY, d); }] as const;
}

export function DistrictSelector({value, onChange}: {value: string | null; onChange: (d: string | null) => void}) {
  return (
    <Selector label="地區（18 區）" description="選擇居住地區，查看該區的服務中心。" placeholder="選擇地區"
      options={DISTRICTS.map((d: string) => ({value: d, label: d}))} value={value} onChange={onChange} hasClear />
  );
}

// 中心類型選擇
export function KindSelector({value, onChange}: {value: string; onChange: (k: string) => void}) {
  return (
    <Selector label="中心類型" value={value} onChange={v => onChange(v || 'all')}
      options={[{value: 'all', label: '所有類型'}, ...UNIT_LISTS.filter((l: any, i: number, a: any[]) => a.findIndex((x: any) => x.kind === l.kind) === i)
        .map((l: any) => ({value: l.kind, label: l.kind}))]} />
  );
}

export function UnitList({district, kinds}: {district: string | null; kinds?: string[]}) {
  if (!district) return null;
  const units = UNITS.filter((u: any) => (u.district === district || (u.districts || []).includes(district)) && (!kinds || kinds.includes(u.kind)))
    .sort((a: any, b: any) => KIND_ORDER(a.kind) - KIND_ORDER(b.kind) || a.name.localeCompare(b.name, 'zh-HK'));
  const lists = UNIT_LISTS.filter((l: any, i: number, a: any[]) => units.some((u: any) => u.kind === l.kind) && a.findIndex((x: any) => x.source === l.source) === i);
  return (
    <VStack gap={2}>
      <Text weight="bold">{district}：{units.length} 間中心</Text>
      {units.some((u: any) => u.districts) && <Text type="supporting" color="secondary">綜合家庭服務中心名單按社署行政區劃分，以下列出涵蓋{district}的社署行政區內所有中心，請致電確認服務範圍。</Text>}
      <List hasDividers edge="flush">
        {units.map((u: any) => (
          <ListItem key={u.kind + u.name + u.tel} align="start"
            label={<Text weight="bold">{u.name}</Text>}
            description={
              <VStack gap={1}>
                <HStack gap={1}><Badge label={u.kind} variant="green" />{u.meal && <Badge label="提供膳食服務" variant="neutral" />}</HStack>
                <Text color="secondary">{u.agency}</Text>
                {u.address.map((a: string) => <Text key={a}>{a}</Text>)}
                {u.hours?.length > 0 && <Text type="supporting" color="secondary">開放時間：{u.hours.join('；')}</Text>}
              </VStack>
            }
            endContent={u.tel && <Link href={`tel:${u.tel}`} hasUnderline type="large"><Text weight="bold" hasTabularNumbers>{u.tel.slice(0, 4)} {u.tel.slice(4)}</Text></Link>}
          />
        ))}
      </List>
      <Text type="supporting" color="secondary">
        來源：{lists.map((l: any, i: number) => <Fragment key={l.source}>{i > 0 && '；'}<Link href={l.source} hasUnderline>社署{l.kind}名單</Link>{l.asOf && `（${l.asOf}）`}</Fragment>)}。開放時間或有不同，請先致電查詢。
      </Text>
    </VStack>
  );
}

// ── 意見回饋：公開的 GitHub Issue，不經本網站收集任何資料 ──
const ISSUES = 'https://github.com/oxygen1024/hk-social-services-navigator-ux-audit/issues/new';
export function Feedback() {
  const page = `${location.pathname.split('/').pop() || 'index.html'}${location.search}`;
  const link = (verdict: string) => `${ISSUES}?${new URLSearchParams({
    title: `[意見] ${verdict}：${document.title}`,
    body: `頁面：${page}\n評價：${verdict}\n\n意見（請勿填寫姓名、電話、身份證號碼或病歷等個人資料）：\n`,
  })}`;
  return (
    <VStack gap={2}>
      <Text weight="bold">這頁對你有幫助嗎？</Text>
      <HStack gap={2}>
        <Button label="有幫助" size="sm" href={link('有幫助')} target="_blank" rel="noopener" />
        <Button label="沒有幫助／資料有誤" size="sm" href={link('沒有幫助')} target="_blank" rel="noopener" />
      </HStack>
      <Text type="supporting" color="secondary">意見會以公開形式提交至 GitHub（需要 GitHub 帳戶），本網站不會收集任何個人資料。請勿填寫個人資料。</Text>
    </VStack>
  );
}

// 我的清單（localStorage）、地區單位、意見回饋。
import {useEffect, useRef, useState} from 'react';
import {VStack, HStack} from '@astryxdesign/core/Layout';
import {Text} from '@astryxdesign/core/Text';
import {Link} from '@astryxdesign/core/Link';
import {Badge} from '@astryxdesign/core/Badge';
import {ToggleButton} from '@astryxdesign/core/ToggleButton';
import {Selector} from '@astryxdesign/core/Selector';
import {List, ListItem} from '@astryxdesign/core/List';
import {Icon} from '@astryxdesign/core/Icon';
import {ChatBubbleLeftEllipsisIcon, HeartIcon} from '@heroicons/react/24/outline';
import {HeartIcon as HeartSolid} from '@heroicons/react/24/solid';
import {UNITS, DISTRICTS, UNITS_SOURCE, UNITS_AS_OF} from './units.js';

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
    <Selector label="地區（18 區）" description="選擇長者居住地區，查看該區的長者中心。" placeholder="選擇地區"
      options={DISTRICTS.map((d: string) => ({value: d, label: d}))} value={value} onChange={onChange} hasClear />
  );
}

export function UnitList({district, kinds}: {district: string | null; kinds?: string[]}) {
  if (!district) return null;
  const units = UNITS.filter((u: any) => u.district === district && (!kinds || kinds.includes(u.kind)))
    // 長者地區中心排先，再按名稱排序
    .sort((a: any, b: any) => a.kind.localeCompare(b.kind, 'zh-HK') || a.name.localeCompare(b.name, 'zh-HK'));
  return (
    <VStack gap={2}>
      <Text weight="bold">{district}：{units.length} 間中心</Text>
      <List hasDividers edge="flush">
        {units.map((u: any) => (
          <ListItem key={u.name + u.tel} align="start"
            label={<Text weight="bold">{u.name}</Text>}
            description={
              <VStack gap={1}>
                <HStack gap={1}><Badge label={u.kind} variant={u.kind === '長者地區中心' ? 'green' : 'neutral'} />{u.meal && <Badge label="提供膳食服務" variant="neutral" />}</HStack>
                <Text color="secondary">{u.agency}</Text>
                {u.address.map((a: string) => <Text key={a}>{a}</Text>)}
              </VStack>
            }
            endContent={u.tel && <Link href={`tel:${u.tel}`} hasUnderline type="large"><Text weight="bold" hasTabularNumbers>{u.tel.slice(0, 4)} {u.tel.slice(4)}</Text></Link>}
          />
        ))}
      </List>
      <Text type="supporting" color="secondary">
        來源：<Link href={UNITS_SOURCE} hasUnderline>社署長者地區中心及長者鄰舍中心名單</Link>（截至 {UNITS_AS_OF}）。長者支援服務隊設於長者地區中心。開放時間一般為星期一至六 9:00–17:00，個別中心或略有不同。
      </Text>
    </VStack>
  );
}

const FEEDBACK_URL = 'https://tasqqzeyemgqqunmuiyd.supabase.co/rest/v1/website_feedback';
const FEEDBACK_KEY = 'sb_publishable_nxyZjArz2WI5K--RV8bL8A_k1Sg-zJQ';

export function SuggestionButton() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const requestId = useRef('');
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!message.trim() || status === 'sending' || status === 'sent') return;
    setStatus('sending');
    try {
      requestId.current ||= crypto.randomUUID();
      const response = await fetch(FEEDBACK_URL, {
        method: 'POST',
        headers: {apikey: FEEDBACK_KEY, 'Content-Type': 'application/json', Prefer: 'return=minimal'},
        body: JSON.stringify({id: requestId.current, page: document.body.dataset.page, message: message.trim()}),
        signal: AbortSignal.timeout(15000),
      });
      if (!response.ok && !(response.status === 409 && (await response.json()).code === '23505')) throw Error();
      setMessage('');
      requestId.current = '';
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  }
  return (
    <>
      <button type="button" className="suggestion-ball" aria-haspopup="dialog"
        aria-label="提供網站意見" onClick={() => {
          if (status === 'sent') setStatus('idle');
          dialog.current?.showModal();
        }}>
        <ChatBubbleLeftEllipsisIcon aria-hidden="true" width="22" height="22" />
        意見
      </button>
      <dialog ref={dialog} className="suggestion-dialog" aria-labelledby="suggestion-title">
        <form onSubmit={submit}>
          <header>
            <h2 id="suggestion-title">提供網站意見</h2>
            <button type="button" onClick={() => dialog.current?.close()}>關閉</button>
          </header>
          {status !== 'sent' && <>
            <label htmlFor="suggestion-body">你希望這個網站怎樣改善？</label>
            <textarea id="suggestion-body" rows={4} required maxLength={1000} value={message}
              readOnly={status === 'sending'} aria-describedby="suggestion-note" onChange={event => {
                setMessage(event.target.value);
                requestId.current = '';
                setStatus('idle');
              }} />
            <p id="suggestion-note">意見只供網站團隊查看。請勿填寫姓名、電話或個案資料。</p>
            <button type="submit" disabled={!message.trim() || status === 'sending'}>
              {status === 'sending' ? '提交中…' : '提交意見'}
            </button>
          </>}
          <p role="status">{status === 'sent' ? '已收到你的意見，多謝你！' :
            status === 'error' ? '暫時未能確認收件。你的文字已保留，請再試一次。' : ''}</p>
        </form>
      </dialog>
    </>
  );
}

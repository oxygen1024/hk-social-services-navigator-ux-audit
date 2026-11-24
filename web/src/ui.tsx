// 共用：頁面框架（頂部導航、頁尾）、重點文字、電話列表、表格。
import {useEffect, useLayoutEffect, useRef, useState, type ReactNode} from 'react';
import {AppShell} from '@astryxdesign/core/AppShell';
import {Layout, LayoutContent, VStack, HStack, Section} from '@astryxdesign/core/Layout';
import {Text, Heading} from '@astryxdesign/core/Text';
import {Link} from '@astryxdesign/core/Link';
import {Badge} from '@astryxdesign/core/Badge';
import {Button} from '@astryxdesign/core/Button';
import {List, ListItem} from '@astryxdesign/core/List';
import {Table} from '@astryxdesign/core/Table';
import {CATEGORIES, ROUTES, TERMS} from './catalog.js';
import {ListCount, SuggestionButton} from './features';

const GROUPS = [
  {label: '尋找服務', links: [['need.html','按需要尋找'], ['services.html','所有服務']]},
  {label: '服務範疇', links: [['services.html#field-elderly','長者服務'], ['services.html#field-rehab','康復服務'], ['services.html#field-youth','青少年福利服務'], ['services.html#field-socsec','社會保障']]},
  {label: '評估及支援', links: [['service.html?id=assessment','統一評估'], ['service.html?id=centres','聯絡長者中心'], ['service.html?id=carer-line','照顧者支援專線']]},
];

// 每頁首次出現的名詞於中文後加上英文；**文字** 為重點（粗體加底線）
export function useTerms(initial: string[] = []) {
  const seen = new Set<string>(initial);
  const map = Object.fromEntries(TERMS);
  const re = new RegExp(TERMS.map(([zh]: string[]) => zh).join('|'), 'g');
  // 英文放在重點底線之外
  function annotate(text: string, key: string, isKey: boolean): ReactNode[] {
    const out: ReactNode[] = [];
    const push = (t: string, k: string) => t && out.push(isKey ? <Text key={k} weight="bold" className="key">{t}</Text> : t);
    let last = 0;
    for (const m of text.matchAll(re)) {
      const en = map[m[0]];
      if (seen.has(en)) continue;
      seen.add(en);
      const end = m.index! + m[0].length;
      push(text.slice(last, end), `${key}-${end}k`);
      out.push(<Text key={`${key}-${end}`} color="secondary" lang="en"> ({en})</Text>);
      last = end;
    }
    push(text.slice(last), `${key}-end`);
    return out;
  }
  return function rich(text = ''): ReactNode {
    return text.split(/\*\*(.+?)\*\*/g).flatMap((part, i) => annotate(part, `p${i}`, i % 2 === 1));
  };
}
// 名稱內已有的名詞視作已出現
export const termsIn = (name: string) => TERMS.filter(([zh]: string[]) => name.includes(zh)).map(([, en]: string[]) => en);

export const telText = (n: string) => (n.length === 6 ? `${n.slice(0, 3)} ${n.slice(3)}` : n.length === 8 ? `${n.slice(0, 4)} ${n.slice(4)}` : n);

export function Calls({items}: {items: string[][]}) {
  return (
    <List hasDividers edge="flush">
      {items.map(([who, n, hours]) => (
        <ListItem
          key={who + n}
          label={<Text>{who}</Text>}
          description={hours ? <Text color="secondary">{hours}</Text> : undefined}
          endContent={<Link href={`tel:${n}`} hasUnderline type="large"><Text weight="bold" hasTabularNumbers>{telText(n)}</Text></Link>}
        />
      ))}
    </List>
  );
}

export function Tags({s}: {s: any}) {
  return (
    <HStack gap={1}>
      <Badge label={s.fund} variant="neutral" />
      <Badge label={ROUTES[s.route]} variant="green" />
    </HStack>
  );
}

export function DataTable({rows, rich}: {rows: string[][]; rich: (t: string) => ReactNode}) {
  const [head, ...body] = rows;
  const columns = head.map((h, i) => ({key: String(i), header: h || ' ', renderCell: (r: any) => rich(r[i])}));
  return <Table data={body.map((r, id) => ({...r, id}))} columns={columns} idKey="id" density="compact" />;
}

const sizes = [['標準', '100%'], ['大', '115%'], ['特大', '130%']] as const;
const sizeKey = 'hkcare-text-size';
function SiteNav() {
  const [size, setSize] = useState(() => {
    try { return sizes.findIndex(([, value]) => value === localStorage.getItem(sizeKey)); }
    catch { return 0; }
  });
  const index = Math.max(0, size);
  const header = useRef<HTMLElement>(null);
  const settings = useRef<HTMLDetailsElement>(null);
  useLayoutEffect(() => {
    const bar = header.current!;
    const root = document.documentElement;
    const measure = () => root.style.setProperty('--care-header-height', bar.offsetHeight + 'px');
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(bar);
    let last = Math.max(window.scrollY, 0);
    const scroll = () => {
      const y = Math.max(window.scrollY, 0);
      if (y > bar.offsetHeight && Math.abs(y - last) < 8) return;
      bar.toggleAttribute('data-away', y > bar.offsetHeight && y > last);
      last = y;
    };
    window.addEventListener('scroll', scroll, {passive: true});
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', scroll);
      root.style.removeProperty('--care-header-height');
    };
  }, []);
  useLayoutEffect(() => {
    document.documentElement.style.fontSize = sizes[index][1];
  }, [index]);
  useEffect(() => {
    const dismiss = (e: PointerEvent) => {
      header.current?.querySelectorAll<HTMLDetailsElement>('details[open]').forEach(panel => {
        if (!panel.contains(e.target as Node)) panel.open = false;
      });
    };
    document.addEventListener('pointerdown', dismiss);
    return () => {document.removeEventListener('pointerdown', dismiss);};
  }, []);
  function choose(i: number) {
    setSize(i);
    try { localStorage.setItem(sizeKey, sizes[i][1]); } catch { /* available for this page */ }
    settings.current!.open = false;
    settings.current!.querySelector('summary')!.focus();
  }
  const here = location.pathname.split('/').pop() || 'index.html';
  const active = here === 'service.html' ? 'service.html?id=' + new URLSearchParams(location.search).get('id') : here;
  function destinations(links: string[][]) {
    return <ul>{links.map(([href,label]) => <li key={href}><a href={href}
      aria-current={href === active ? 'page' : undefined}>{label}</a></li>)}</ul>;
  }
  return <header ref={header} className="care-header" onKeyDown={e => {
    const open = (e.target as HTMLElement).closest<HTMLDetailsElement>('details[open]');
    if (open && e.key === 'Escape') {open.open = false; open.querySelector('summary')?.focus();}
  }} onBlur={e => {
    // 只在鍵盤把焦點移到選單外時收起。Safari 按連結時不會轉移焦點（relatedTarget 為 null），
    // 如在此收起選單，連結便會在按下前消失；按選單外的地方由 pointerdown 處理。
    const open = e.target.closest('details[open]');
    if (open && e.relatedTarget && !open.contains(e.relatedTarget as Node)) open.removeAttribute('open');
  }}>
    <section className="care-tools" aria-label="網站工具">
      <a href="index.html" className="care-name">社福懶人包</a>
      <nav className="wide-nav" aria-label="主選單">
        {GROUPS.map(group => <details key={group.label} name="header-options" className="care-group">
          <summary>{group.label}</summary>
          <section className="drop-list">{destinations(group.links)}</section>
        </details>)}
      </nav>
      <details className="care-menu" name="header-options">
        <summary>選單</summary>
        <nav className="care-links" aria-label="主選單">
          {GROUPS.map(group => <section key={group.label}><strong>{group.label}</strong>{destinations(group.links)}</section>)}
        </nav>
      </details>
      <details name="header-options" ref={settings} className="care-size" onKeyDown={e => {
        if (e.key === 'Escape') { e.currentTarget.open = false; e.currentTarget.querySelector('summary')!.focus(); }
      }}>
        <summary aria-label={'更改字級，目前' + sizes[index][0]}>字級 ▾</summary>
        <section aria-label="選擇字級">{sizes.map(([label], i) =>
          <button key={label} type="button" aria-pressed={i === index} onClick={() => choose(i)}>{label}</button>
        )}</section>
      </details>
      <a className="care-list" href="list.html" aria-current={active === 'list.html' ? 'page' : undefined}><ListCount /></a>
      <a className="care-help" href="index.html#urgent">急事求助</a>
    </section>

  </header>;
}

export function Page({current, title, children}: {current: string; title?: string; children: ReactNode}) {
  if (title) document.title = `${title}｜社福懶人包`;
  return (
    <>
    <SiteNav />
    <AppShell height="auto">
      <Layout height="auto" contentWidth={760}>
        <LayoutContent padding={4}>
          <VStack gap={6}>
            {children}
            <Section variant="muted" padding={4} dividers={['top']}>
              <VStack gap={2}>
                <Text type="supporting" color="secondary"><Text type="supporting" weight="bold">測試版</Text>：資料於 2026 年 11 月 23 至 24 日核實，尚未進行用家測試。</Text>
                <Text type="supporting" color="secondary">
                  服務資料來自<Link href="https://www.swd.gov.hk/tc/pubsvc/elderly/" hasUnderline>社會福利署 (Social Welfare Department, SWD) 網頁</Link>，核實日期見各服務頁。本網站不屬於社署，亦不會判斷資格；最終以社署及服務單位為準。
                </Text>
              </VStack>
            </Section>
          </VStack>
        </LayoutContent>
      </Layout>
    </AppShell>
    <SuggestionButton />
    </>
  );
}

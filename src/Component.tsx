import { useState } from 'react'

const BASE = import.meta.env.BASE_URL

/* ── palette ─────────────────────────────── */
const NAV      = '#000'
const LIGHT_BG = '#f7f6f3'
const WHITE    = '#fff'
const DARK     = '#111'
const GRAY     = '#999'
const ORANGE   = '#ff9500'
const PURPLE   = '#7c3aed'
const RED      = '#ff3b30'
const GREEN    = '#16a34a'

/* ── StatusBar ───────────────────────────── */
function StatusBar() {
  return (
    <div style={{ background: NAV, padding: '14px 20px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ color: WHITE, fontSize: 15, fontWeight: 600 }}>9:41</span>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <svg width="18" height="12"><rect x="0" y="7" width="3" height="5" rx="1" fill="white"/><rect x="5" y="5" width="3" height="7" rx="1" fill="white"/><rect x="10" y="3" width="3" height="9" rx="1" fill="white"/><rect x="15" y="1" width="3" height="11" rx="1" fill="white" opacity="0.3"/></svg>
        <svg width="16" height="12" viewBox="0 0 16 12"><circle cx="8" cy="10.5" r="1.5" fill="white"/><path d="M4.5 7.5a4.9 4.9 0 017 0" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round"/><path d="M1.5 4.5a9.5 9.5 0 0113 0" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ width: 22, height: 11, border: '1.5px solid rgba(255,255,255,0.5)', borderRadius: 3, padding: '1.5px' }}>
            <div style={{ width: '80%', height: '100%', background: WHITE, borderRadius: 1.5 }}/>
          </div>
          <div style={{ width: 2, height: 4, background: 'rgba(255,255,255,0.35)', borderRadius: '0 1px 1px 0' }}/>
        </div>
      </div>
    </div>
  )
}

/* ── NavBar ──────────────────────────────── */
function NavBar() {
  return (
    <div style={{ background: NAV, padding: '0 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 46 }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <span style={{ color: WHITE, fontSize: 19, fontWeight: 900, letterSpacing: -0.5 }}>NOVEL</span>
        <span style={{ color: '#555', fontSize: 19, fontWeight: 700 }}>COMIX</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {/* 무료쿠키 pill */}
        <div style={{ background: ORANGE, borderRadius: 14, padding: '5px 10px' }}>
          <span style={{ color: WHITE, fontSize: 12, fontWeight: 800 }}>무료쿠키!</span>
        </div>
        {/* cookie icon */}
        <div style={{ width: 30, height: 30, borderRadius: 15, overflow: 'hidden', flexShrink: 0 }}>
          <img src={`${BASE}figma/cookie_nav.png`} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
        </div>
        {/* bell */}
        <button style={{ background: 'none', border: 'none', padding: 4, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>
        </button>
        {/* person */}
        <button style={{ background: 'none', border: 'none', padding: 4, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm0 2c-3.33 0-10 1.67-10 5v2h20v-2c0-3.33-6.67-5-10-5z"/></svg>
        </button>
      </div>
    </div>
  )
}

/* ── TabBar ──────────────────────────────── */
const TABS = ['추천', '🚀급상승랭킹', '베스트랭킹', '신작', '연령별랭킹', '단독연재']

function TabBar({ active, setActive }: { active: number; setActive: (i: number) => void }) {
  return (
    <div style={{ background: NAV, display: 'flex', overflowX: 'auto', scrollbarWidth: 'none', borderBottom: '1px solid #222' }}>
      {TABS.map((tab, i) => (
        <button key={tab} onClick={() => setActive(i)} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          padding: '10px 14px', whiteSpace: 'nowrap', flexShrink: 0,
          color: i === active ? WHITE : GRAY,
          fontSize: 13, fontWeight: i === active ? 700 : 400,
          borderBottom: i === active ? '2px solid white' : '2px solid transparent',
        }}>{tab}</button>
      ))}
    </div>
  )
}

/* ── BenefitBanner ───────────────────────── */
function BenefitBanner() {
  return (
    <div style={{ position: 'relative' }}>
      {/* 실제 Figma 이미지 */}
      <img
        src={`${BASE}figma/cookie2.png`}
        style={{ display: 'block', width: '100%' }}
        alt="웰컴 쿠키 선물"
      />
      {/* NEW 뱃지 */}
      <span style={{
        position: 'absolute', top: 12, left: 12,
        background: DARK, color: WHITE,
        fontSize: 11, fontWeight: 800, padding: '3px 8px', borderRadius: 4,
      }}>NEW</span>
      {/* 참여하기 뱃지 */}
      <span style={{
        position: 'absolute', top: 12, right: 12,
        background: '#ff2d78', color: WHITE,
        fontSize: 11, fontWeight: 800, padding: '3px 12px', borderRadius: 20,
      }}>참여하기</span>
      {/* 페이지 인디케이터 */}
      <span style={{
        position: 'absolute', bottom: 10, right: 12,
        background: 'rgba(80,40,130,0.45)', color: WHITE,
        fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 10,
      }}>2/14 ›</span>
    </div>
  )
}

/* ── BookCard ────────────────────────────── */
function BookCard({ promoText, badge }: { promoText: string; badge?: string }) {
  return (
    <div style={{ width: 106, flexShrink: 0 }}>
      {/* cover */}
      <div style={{ width: 106, height: 148, borderRadius: 8, overflow: 'hidden', position: 'relative', marginBottom: 8 }}>
        {/* 실제 책 표지 */}
        <img src={`${BASE}figma/book_cover.jpg`} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
        {/* 타이머 아이콘 */}
        <div style={{ position: 'absolute', top: 6, left: 6, width: 22, height: 22, borderRadius: 11, border: '1.5px solid rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.3)' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm.5 5v5.25l4.5 2.67-.75 1.23L11 13V7h1.5z"/></svg>
        </div>
        {/* 트로피 아이콘 */}
        <div style={{ position: 'absolute', top: 4, right: 4 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#22c55e"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/></svg>
        </div>
        {/* SERIES EDITION 뱃지 */}
        <img src={`${BASE}figma/badge_c.png`} style={{ position: 'absolute', bottom: 18, right: 0, width: 36, height: 36 }}/>
        {/* 특가세트 스트립 */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.75)', padding: '4px 6px' }}>
          <span style={{ color: WHITE, fontSize: 10, fontWeight: 700 }}>특가 세트</span>
        </div>
      </div>
      {/* meta */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
        <span style={{ background: GREEN, color: WHITE, fontSize: 9, fontWeight: 800, padding: '2px 5px', borderRadius: 3 }}>NEW</span>
        {badge && <span style={{ color: GRAY, fontSize: 9 }}>{badge}</span>}
      </div>
      <div style={{ color: DARK, fontSize: 12, fontWeight: 700, lineHeight: 1.4, marginBottom: 3 }}>작품 타이틀<br/>두줄인 경우입니...</div>
      <div style={{ color: DARK, fontSize: 11, marginBottom: 2 }}>★9.8 · 9,999만</div>
      <div style={{ color: GREEN, fontSize: 11, fontWeight: 600 }}>{promoText}</div>
    </div>
  )
}

/* ── BookSection ─────────────────────────── */
function BookSection() {
  return (
    <div style={{ background: LIGHT_BG, paddingTop: 18, paddingBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 16px', marginBottom: 14 }}>
        <span style={{ color: DARK, fontSize: 15 }}>
          <b>닉네임</b> 님이 좋아할 만한 작품
        </span>
        <span style={{ color: GRAY, fontSize: 13 }}>더보기 ›</span>
      </div>
      <div style={{ display: 'flex', gap: 10, padding: '0 16px', overflowX: 'auto', scrollbarWidth: 'none' }}>
        <BookCard promoText="베스트 로판 2위" badge="베스트 론칭 2위"/>
        <BookCard promoText="예상 선호도 90%"/>
        <BookCard promoText="예상 선호도 90%"/>
        <BookCard promoText="9,999만"/>
        <BookCard promoText="예상 선호도 90%"/>
      </div>
    </div>
  )
}

/* ── ShortcutRow ─────────────────────────── */
const SHORTCUTS = ['숏컷명', '숏컷명', '숏컷명', '숏컷명', '숏컷명']

function ShortcutRow() {
  return (
    <div style={{ background: LIGHT_BG, padding: '10px 12px', display: 'flex', gap: 8 }}>
      {SHORTCUTS.map((s, i) => (
        <button key={i} style={{
          flex: 1, background: WHITE, border: 'none', borderRadius: 8,
          padding: '10px 0', color: DARK, fontSize: 12, fontWeight: 600,
          cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        }}>{s}</button>
      ))}
    </div>
  )
}

/* ── BottomNav ───────────────────────────── */
function BottomNav() {
  const items = [
    {
      label: '홈', active: true,
      icon: <div style={{ width: 28, height: 28, background: DARK, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: WHITE, fontSize: 15, fontWeight: 900 }}>S</span>
      </div>,
    },
    {
      label: '무료박스', active: false,
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill={GRAY}><path d="M20 6h-2.18c.07-.44.18-.86.18-1.3C18 2.13 15.87 0 13.3 0a3.5 3.5 0 00-2.76 1.34L9 3l-1.54-1.66A3.5 3.5 0 004.7 0C2.13 0 0 2.13 0 4.7c0 .44.11.86.18 1.3H0v2h20V6zm0 3H0v12h20V9z" transform="translate(2 2) scale(.83)"/></svg>,
    },
    {
      label: '이벤트', active: false, dot: true,
      icon: <div style={{ position: 'relative' }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill={GRAY}><path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-2 .9-2 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"/></svg>
        <div style={{ position: 'absolute', top: -4, right: -4, background: RED, borderRadius: 10, padding: '1px 5px' }}>
          <span style={{ color: WHITE, fontSize: 9, fontWeight: 800 }}>참여</span>
        </div>
      </div>,
    },
    {
      label: '검색', active: false,
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill={GRAY}><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>,
    },
    {
      label: '보관함', active: false,
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill={GRAY}><path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/></svg>,
    },
  ]

  return (
    <div style={{ position: 'sticky', bottom: 0, background: WHITE, borderTop: '1px solid #e5e5e5', display: 'flex', padding: '10px 0 24px', zIndex: 10 }}>
      {items.map((item, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
          {item.icon}
          <span style={{ color: item.active ? DARK : GRAY, fontSize: 10, fontWeight: item.active ? 700 : 400 }}>{item.label}</span>
        </div>
      ))}
    </div>
  )
}

/* ── Main ────────────────────────────────── */
export default function Component() {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <div style={{
      maxWidth: 375, margin: '0 auto',
      background: LIGHT_BG, minHeight: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }}>
      <StatusBar />
      <NavBar />
      <TabBar active={activeTab} setActive={setActiveTab} />
      <BenefitBanner />
      <BookSection />
      <ShortcutRow />
      <BottomNav />
    </div>
  )
}

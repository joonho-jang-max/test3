import { useState, useRef } from 'react'

const BASE = import.meta.env.BASE_URL

/* ── palette ──────────────────────────── */
const NAV      = '#000'
const LIGHT_BG = '#f7f6f3'
const WHITE    = '#fff'
const DARK     = '#111'
const GRAY     = '#999'
const RED      = '#ff3b30'
const GREEN    = '#16a34a'

/* ── GNB ──────────────────────────────── */
function GNB() {
  return (
    <div style={{ background: NAV, padding: '0 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 46 }}>
      {/* NOVEL / COMIX  —  18px w700 */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <span style={{ color: WHITE, fontSize: 18, fontWeight: 700, letterSpacing: -0.3 }}>NOVEL</span>
        <span style={{ color: '#555', fontSize: 18, fontWeight: 700 }}>COMIX</span>
      </div>
      {/* 액션 아이콘 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {/* 무료쿠키! 말풍선 + 쿠키 아이콘 (Figma 추출 이미지) */}
        <img src={`${BASE}figma/gnb_tooltip.png`} style={{ height: 28, width: 'auto' }} alt="무료쿠키"/>
        {/* 알림 벨 */}
        <button style={{ background: 'none', border: 'none', padding: '4px 5px', cursor: 'pointer', display: 'flex' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
            <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
          </svg>
        </button>
        {/* 마이 */}
        <button style={{ background: 'none', border: 'none', padding: '4px 5px', cursor: 'pointer', display: 'flex' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
            <path d="M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm0 2c-3.33 0-10 1.67-10 5v2h20v-2c0-3.33-6.67-5-10-5z"/>
          </svg>
        </button>
      </div>
    </div>
  )
}

/* ── TabBar  —  15px ──────────────────── */
const TABS = ['추천', '🚀급상승랭킹', '베스트랭킹', '신작', '연령별랭킹', '단행본']

function TabBar({ active, setActive }: { active: number; setActive: (i: number) => void }) {
  return (
    <div style={{ background: NAV, display: 'flex', overflowX: 'auto', scrollbarWidth: 'none', borderBottom: '1px solid #222' }}>
      {TABS.map((tab, i) => (
        <button key={tab} onClick={() => setActive(i)} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          padding: '10px 14px', whiteSpace: 'nowrap', flexShrink: 0,
          color: i === active ? WHITE : GRAY,
          fontSize: 15, fontWeight: i === active ? 700 : 400,
          borderBottom: i === active ? '2px solid white' : '2px solid transparent',
        }}>{tab}</button>
      ))}
    </div>
  )
}

/* ── BenefitBanner  —  플리킹 캐러셀, r=4 */
const SLIDES = [
  { src: 'cookie2.png', showBadges: true },
  { src: 'cookie3.png', showBadges: false },
]

function BenefitBanner() {
  const [cur, setCur] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  function onScroll() {
    const el = ref.current
    if (!el) return
    const idx = Math.round(el.scrollLeft / (el.clientWidth - 16))
    setCur(idx)
  }

  return (
    <div style={{ background: NAV, paddingBottom: 8 }}>
      {/* 스크롤 컨테이너 */}
      <div
        ref={ref}
        onScroll={onScroll}
        style={{
          display: 'flex',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none',
          gap: 8,
          paddingLeft: 16,
          paddingRight: 16,
        }}
      >
        {SLIDES.map((slide, i) => (
          <div key={i} style={{
            position: 'relative',
            flexShrink: 0,
            width: 'calc(100% - 32px)',  /* 342/375 ≈ 16px 양쪽 마진 */
            borderRadius: 4,
            overflow: 'hidden',
            scrollSnapAlign: 'start',
          }}>
            <img src={`${BASE}figma/${slide.src}`} style={{ display: 'block', width: '100%' }} alt=""/>
            {slide.showBadges && <>
              <span style={{
                position: 'absolute', top: 10, left: 10,
                background: DARK, color: WHITE, fontSize: 9, fontWeight: 700, padding: '3px 7px', borderRadius: 4,
              }}>NEW</span>
              <span style={{
                position: 'absolute', top: 10, right: 10,
                background: '#ff2d78', color: WHITE, fontSize: 12, fontWeight: 700, padding: '3px 10px', borderRadius: 20,
              }}>참여하기</span>
            </>}
            {/* 페이지 인디케이터 */}
            <span style={{
              position: 'absolute', bottom: 8, right: 10,
              background: 'rgba(60,30,100,0.4)', color: WHITE,
              fontSize: 11, fontWeight: 600, padding: '2px 7px', borderRadius: 10,
            }}>{i + 1}/{SLIDES.length} ›</span>
          </div>
        ))}
      </div>

      {/* dot indicator */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 4, paddingTop: 6 }}>
        {SLIDES.map((_, i) => (
          <div key={i} style={{
            width: i === cur ? 14 : 6, height: 4, borderRadius: 2,
            background: i === cur ? WHITE : 'rgba(255,255,255,0.3)',
            transition: 'width 0.2s',
          }}/>
        ))}
      </div>
    </div>
  )
}

/* ── BookCard  —  r=4, 폰트 Figma 기준 ── */
function BookCard({ promoText, badge }: { promoText: string; badge?: string }) {
  return (
    <div style={{ width: 109, flexShrink: 0 }}>
      {/* 표지  109×158, r=4 */}
      <div style={{ width: 109, height: 158, borderRadius: 4, overflow: 'hidden', position: 'relative', marginBottom: 6 }}>
        <img src={`${BASE}figma/book_cover.jpg`} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
        {/* 타임딜 (좌상단) */}
        <img src={`${BASE}figma/badge_timedeal.png`}
          style={{ position: 'absolute', top: 4, left: 0, width: 20, height: 20, borderRadius: '0 4px 4px 0' }}/>
        {/* 트로피 (우상단) */}
        <img src={`${BASE}figma/badge_cup.png`}
          style={{ position: 'absolute', top: 2, right: 2, width: 20, height: 26 }}/>
        {/* 시리즈에디션 (우하단) */}
        <img src={`${BASE}figma/badge_series.png`}
          style={{ position: 'absolute', bottom: 22, right: 0, width: 32, height: 32 }}/>
        {/* 특가세트 (하단 바, 좌하단 r=4) */}
        <img src={`${BASE}figma/badge_specialprice.png`}
          style={{ position: 'absolute', bottom: 0, left: 0, height: 22, width: 'auto', borderRadius: '0 4px 0 0' }}/>
      </div>

      {/* NEW + 타이틀  — 14px w700 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 3 }}>
        <img src={`${BASE}figma/badge_new.png`} style={{ height: 12, width: 'auto' }}/>
        {badge && <span style={{ color: GRAY, fontSize: 9 }}>{badge}</span>}
      </div>
      <div style={{ color: DARK, fontSize: 14, fontWeight: 700, lineHeight: 1.35, marginBottom: 3 }}>
        작품 타이틀<br/>두줄인 경우입니...
      </div>
      {/* 별점  — 12px */}
      <div style={{ color: DARK, fontSize: 12, marginBottom: 2 }}>★9.8 · 서브텍스트1</div>
      {/* 프로모  — 12px */}
      <div style={{ color: GREEN, fontSize: 12 }}>{promoText}</div>
    </div>
  )
}

/* ── BookSection  — 헤더 17px ─────────── */
function BookSection() {
  return (
    <div style={{ background: LIGHT_BG, paddingTop: 18, paddingBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 16px', marginBottom: 12 }}>
        <span style={{ color: DARK, fontSize: 17 }}>
          <b>닉네임</b> 님이 좋아할 만한 작품
        </span>
        <span style={{ color: GRAY, fontSize: 13 }}>더보기 ›</span>
      </div>
      <div style={{ display: 'flex', gap: 8, padding: '0 16px', overflowX: 'auto', scrollbarWidth: 'none' }}>
        <BookCard promoText="베스트 로판 2위" badge="베스트 론칭 2위"/>
        <BookCard promoText="예상 선호도 90%"/>
        <BookCard promoText="예상 선호도 90%"/>
        <BookCard promoText="9,999만"/>
        <BookCard promoText="예상 선호도 90%"/>
      </div>
    </div>
  )
}

/* ── ShortcutRow  — 숏컷명 14px w700 ─── */
function ShortcutRow() {
  return (
    <div style={{ background: LIGHT_BG, padding: '10px 12px', display: 'flex', gap: 8 }}>
      {['숏컷명', '숏컷명', '숏컷명', '숏컷명', '숏컷명'].map((s, i) => (
        <button key={i} style={{
          flex: 1, background: WHITE, border: 'none', borderRadius: 8,
          padding: '10px 0', color: DARK, fontSize: 14, fontWeight: 700,
          cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', minWidth: 0,
        }}>{s}</button>
      ))}
    </div>
  )
}

/* ── BottomNav  — 라벨 10px ───────────── */
function BottomNav() {
  const items = [
    { label: '홈', active: true,
      icon: <div style={{ width: 28, height: 28, background: DARK, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ color: WHITE, fontSize: 15, fontWeight: 900 }}>S</span></div> },
    { label: '무료박스',
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill={GRAY}><path d="M20 6h-2.18c.07-.44.18-.86.18-1.3C18 2.13 15.87 0 13.3 0a3.5 3.5 0 00-2.76 1.34L9 3l-1.54-1.66A3.5 3.5 0 004.7 0C2.13 0 0 2.13 0 4.7c0 .44.11.86.18 1.3H0v2h20V6zm0 3H0v12h20V9z" transform="translate(2 2) scale(.83)"/></svg> },
    { label: '이벤트', dot: true,
      icon: <div style={{ position: 'relative' }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill={GRAY}><path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-2 .9-2 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"/></svg>
        <div style={{ position: 'absolute', top: -4, right: -4, background: RED, borderRadius: 10, padding: '1px 5px' }}>
          <span style={{ color: WHITE, fontSize: 8, fontWeight: 700 }}>참여</span>
        </div>
      </div> },
    { label: '검색',
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill={GRAY}><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg> },
    { label: '보관함',
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill={GRAY}><path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/></svg> },
  ]
  return (
    <div style={{ position: 'sticky', bottom: 0, background: WHITE, borderTop: '1px solid #e5e5e5', display: 'flex', padding: '10px 0 24px', zIndex: 10 }}>
      {items.map((item, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, cursor: 'pointer' }}>
          {item.icon}
          <span style={{ color: (item as any).active ? DARK : GRAY, fontSize: 10, fontWeight: (item as any).active ? 700 : 400 }}>{item.label}</span>
        </div>
      ))}
    </div>
  )
}

/* ── Root ─────────────────────────────── */
export default function Component() {
  const [activeTab, setActiveTab] = useState(0)
  return (
    <div style={{ background: '#1a1a1a', minHeight: '100vh', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: 375, background: LIGHT_BG, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
        <GNB />
        <TabBar active={activeTab} setActive={setActiveTab} />
        <BenefitBanner />
        <BookSection />
        <ShortcutRow />
        <BottomNav />
      </div>
    </div>
  )
}

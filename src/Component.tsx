import { useState, useRef } from 'react'

const BASE = import.meta.env.BASE_URL

/* ── palette ──────────────────────────── */
const NAV      = '#000'
const LIGHT_BG = '#f7f6f3'
const WHITE    = '#fff'
const DARK     = '#111'
const GRAY     = '#999'
const GREEN    = '#16a34a'

/* ── GNB ──────────────────────────────── */
function GNB() {
  return (
    <div style={{ background: NAV, padding: '0 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 44 }}>
      {/* NOVEL / COMIX  —  18px w700 */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <span style={{ color: WHITE, fontSize: 18, fontWeight: 700, letterSpacing: -0.3 }}>NOVEL</span>
        <span style={{ color: '#555', fontSize: 18, fontWeight: 700 }}>COMIX</span>
      </div>
      {/* 액션 아이콘 — Figma 추출 이미지 */}
      <img src={`${BASE}figma/gnb_actions.png`} style={{ height: 28, width: 'auto' }} alt="gnb actions"/>
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
  const ref = useRef<HTMLDivElement>(null)

  return (
    /* Benefit 전체: 264px, paddingTop 8 */
    <div style={{ background: LIGHT_BG, paddingTop: 8, height: 264, overflow: 'hidden' }}>
      <div
        ref={ref}
        style={{
          display: 'flex',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none',
          gap: 8,
          paddingLeft: 16,
          height: 256,
        }}
      >
        {SLIDES.map((slide, i) => (
          <div key={i} style={{
            position: 'relative',
            flexShrink: 0,
            width: 342,
            height: 256,
            borderRadius: 4,
            overflow: 'hidden',
            scrollSnapAlign: 'start',
          }}>
            <img src={`${BASE}figma/${slide.src}`} style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }} alt=""/>
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

/* ── ShortcutRow  — 36px, r=4, gap=4 ─── */
function ShortcutRow() {
  return (
    <div style={{ background: LIGHT_BG, height: 36, display: 'flex', alignItems: 'center', paddingLeft: 16, paddingRight: 16, gap: 4 }}>
      {['숏컷명', '숏컷명', '숏컷명', '숏컷명', '숏컷명'].map((s, i) => (
        <button key={i} style={{
          flex: 1, background: WHITE, border: 'none', borderRadius: 4,
          height: 36, color: DARK, fontSize: 14, fontWeight: 700,
          cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', minWidth: 0,
        }}>{s}</button>
      ))}
    </div>
  )
}

/* ── BottomNav  — Figma 추출 이미지 ───── */
const TOOLBAR_ITEMS = ['home', 'freebox', 'event', 'search', 'library']

function BottomNav() {
  return (
    <div style={{ position: 'sticky', bottom: 0, background: WHITE, borderTop: '1px solid #e5e5e5', display: 'flex', height: 44, alignItems: 'center', zIndex: 10 }}>
      {TOOLBAR_ITEMS.map((name) => (
        <div key={name} style={{ flex: 1, cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <img src={`${BASE}figma/toolbar_${name}.png`} style={{ width: 75, height: 38, display: 'block' }} alt={name}/>
        </div>
      ))}
    </div>
  )
}

/* ── Root ─────────────────────────────── */
export default function Component() {
  const [activeTab, setActiveTab] = useState(0)
  return (
    <div style={{ background: LIGHT_BG, minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      <GNB />
      <TabBar active={activeTab} setActive={setActiveTab} />
      <BenefitBanner />
      <BookSection />
      <ShortcutRow />
      <BottomNav />
    </div>
  )
}

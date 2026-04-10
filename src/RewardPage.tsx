import { useEffect, useState } from 'react'

const BASE = import.meta.env.BASE_URL
const TARGET = 1221

/* 자릿수별 시간차 플립 */
function FlipDigit({ digit, delay }: { digit: string; delay: number }) {
  const [show, setShow] = useState(false)
  const [flipping, setFlipping] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => {
      setFlipping(true)
      setTimeout(() => {
        setShow(true)
        setFlipping(false)
      }, 150)
    }, delay)
    return () => clearTimeout(t)
  }, [delay])

  return (
    <span style={{
      display: 'inline-block',
      fontSize: 42,
      fontWeight: 700,
      color: '#121212',
      fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
      transform: flipping ? 'rotateX(90deg)' : 'rotateX(0deg)',
      transition: 'transform 0.15s ease',
      transformOrigin: 'center center',
      perspective: 400,
      minWidth: digit === ',' ? 'auto' : 28,
      textAlign: 'center',
    }}>
      {show ? digit : '0'}
    </span>
  )
}

function FlipNumber() {
  const digits = TARGET.toLocaleString().split('')
  return (
    <span style={{ display: 'inline-flex', alignItems: 'baseline' }}>
      {digits.map((d, i) => (
        <FlipDigit key={i} digit={d} delay={i * 120}/>
      ))}
    </span>
  )
}

export default function RewardPage({ onBack }: { onBack: () => void }) {
  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      background: '#fff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }}>
      {/* Nav */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        height: 44,
        padding: '0 16px',
        borderBottom: '1px solid #f0f0f0',
      }}>
        <button onClick={onBack} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          padding: '0 8px 0 0', display: 'flex', alignItems: 'center',
        }}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d="M18 6L10 14L18 22" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <span style={{ fontSize: 16, fontWeight: 600 }}>리워드</span>
        <span style={{ marginLeft: 'auto', fontSize: 15, fontWeight: 500, color: '#555' }}>내역보기</span>
      </div>

      {/* 쿠키 개수 */}
      <div style={{ padding: '24px 20px 0' }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: '#000', marginBottom: 8 }}>현재 쿠키조각</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
          <FlipNumber />
          <span style={{ fontSize: 14, fontWeight: 700, color: '#000' }}>/100개</span>
        </div>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#000', marginTop: 8 }}>쿠키 30개 수령 완료!</div>
      </div>

      {/* 배경 이미지 */}
      <div style={{ marginTop: 16 }}>
        <img src={`${BASE}figma/fin_page.png`} style={{ width: '100%', display: 'block' }} alt="reward"/>
      </div>
    </div>
  )
}

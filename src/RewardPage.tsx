import { useEffect, useRef, useState } from 'react'

const BASE = import.meta.env.BASE_URL
const TARGET = 1221
const DIGIT_H = 42

/* 슬롯머신: 목표 숫자 위아래 2개만 롤링 */
function SlotDigit({ target, delay }: { target: number; delay: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), delay)
    return () => clearTimeout(t)
  }, [delay])

  useEffect(() => {
    if (!started || !ref.current) return
    const ROLL = 2  // target 앞에 표시할 숫자 개수
    ref.current.style.transition = `transform 1.4s cubic-bezier(0.17, 0.67, 0.35, 1.0)`
    ref.current.style.transform = `translateY(${-ROLL * DIGIT_H}px)`
  }, [started])

  // target 앞으로 2개 → target 까지 총 3개 항목
  const ROLL = 2
  const items: number[] = []
  for (let i = ROLL; i >= 0; i--) {
    items.push(((target - i) % 10 + 10) % 10)
  }

  return (
    <div style={{ width: 24, height: DIGIT_H, overflow: 'hidden', display: 'inline-block' }}>
      <div ref={ref} style={{ transform: 'translateY(0)', willChange: 'transform' }}>
        {items.map((n, i) => (
          <div key={i} style={{
            height: DIGIT_H,
            lineHeight: `${DIGIT_H}px`,
            fontSize: 42,
            fontWeight: 700,
            color: '#121212',
            fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
            textAlign: 'center',
          }}>
            {n}
          </div>
        ))}
      </div>
    </div>
  )
}

function SlotNumber({ value }: { value: number }) {
  const digits = String(value).split('').map(Number)
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center' }}>
      {digits.map((d, i) => (
        <SlotDigit key={i} target={d} delay={i * 120} />
      ))}
    </div>
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
      <div style={{ position: 'relative' }}>
        <img
          src={`${BASE}figma/fin_page.png`}
          style={{ width: '100%', display: 'block' }}
          alt="reward"
        />
        {/* 뒤로가기: 이미지 내 Nav 위치에 투명 터치 영역 */}
        <div
          onClick={onBack}
          style={{
            position: 'absolute',
            top: `${(50 / 468) * 100}%`,
            left: 0,
            width: `${(44 / 375) * 100}%`,
            height: `${(44 / 468) * 100}%`,
            cursor: 'pointer',
          }}
        />
        {/* 현재 쿠키조각 레이블 */}
        <div style={{
          position: 'absolute',
          top: `${(290 / 468) * 100}%`,
          left: `${(16 / 375) * 100}%`,
          fontSize: 15,
          fontWeight: 600,
          color: '#000',
          letterSpacing: -0.15,
          lineHeight: '18px',
        }}>
          현재 쿠키조각
        </div>
        {/* 1221 슬롯 숫자 + /100개 */}
        <div style={{
          position: 'absolute',
          top: `${(308 / 468) * 100}%`,
          left: `${(16 / 375) * 100}%`,
          display: 'flex',
          alignItems: 'baseline',
          gap: 4,
        }}>
          <SlotNumber value={TARGET} />
          <span style={{
            fontSize: 14,
            fontWeight: 700,
            color: '#000',
            lineHeight: `${DIGIT_H}px`,
          }}>/100개</span>
        </div>
      </div>
    </div>
  )
}

import { useEffect, useRef, useState } from 'react'

const BASE = import.meta.env.BASE_URL
const TARGET = 1221
const DIGIT_H = 42
const FPS = 24

// 프레임 기준 (statusbar 50px 제거 후)
const FW = 375
const FH = 418  // 468 - 50

const IDLE_FRAMES = Array.from({ length: 17 }, (_, i) => i + 1)
const ACTION_FRAMES = Array.from({ length: 32 }, (_, i) => i + 18)  // 18~49

function SlotDigit({ target, delay }: { target: number; delay: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), delay)
    return () => clearTimeout(t)
  }, [delay])

  useEffect(() => {
    if (!started || !ref.current) return
    const ROLL = 4
    ref.current.style.transition = `transform 1.4s cubic-bezier(0.17, 0.67, 0.35, 1.0)`
    ref.current.style.transform = `translateY(${-ROLL * DIGIT_H}px)`
  }, [started])

  const ROLL = 4
  const items: number[] = []
  for (let i = ROLL; i >= 0; i--) {
    items.push(((target - i) % 10 + 10) % 10)
  }

  return (
    <div style={{ width: 32, height: DIGIT_H, overflow: 'hidden', display: 'inline-block', margin: '0 -4px' }}>
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
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const modeRef = useRef<'idle' | 'action'>('idle')
  const frameIdxRef = useRef(0)
  const rafRef = useRef(0)
  const imagesRef = useRef<Record<number, HTMLImageElement>>({})
  const loadedRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current!
    const dpr = window.devicePixelRatio || 2
    const displayW = canvas.offsetWidth
    const displayH = displayW * (960 / 540)
    canvas.width = displayW * dpr
    canvas.height = displayH * dpr
    canvas.style.height = `${displayH}px`
    const ctx = canvas.getContext('2d')!

    const allFrameNums = [...IDLE_FRAMES, ...ACTION_FRAMES]
    allFrameNums.forEach(n => {
      const img = new Image()
      img.src = `${BASE}catwalk/cat_${n}.png`
      img.onload = () => {
        imagesRef.current[n] = img
        loadedRef.current++
        if (loadedRef.current === allFrameNums.length) startLoop()
      }
    })

    let last = 0
    const interval = 1000 / FPS
    function startLoop() {
      function tick(ts: number) {
        if (ts - last >= interval) {
          const frames = modeRef.current === 'idle' ? IDLE_FRAMES : ACTION_FRAMES
          ctx.clearRect(0, 0, canvas.width, canvas.height)
          const img = imagesRef.current[frames[frameIdxRef.current]]
          if (img) ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
          frameIdxRef.current++
          if (frameIdxRef.current >= frames.length) {
            if (modeRef.current === 'action') modeRef.current = 'idle'
            frameIdxRef.current = 0
          }
          last = ts
        }
        rafRef.current = requestAnimationFrame(tick)
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  const handleButtonClick = () => {
    if (modeRef.current !== 'action') {
      modeRef.current = 'action'
      frameIdxRef.current = 0
    }
  }

  // statusbar 제거 후 y좌표 = 원래y - 50
  // 고양이(A_high-end): x=111, y=61-50=11, w=153, h=238
  // uinon badge: x=123, y=221.6-50=171.6, w=134, h=37.4
  // mi: x=273, y=286-50=236, w=86, h=71
  // 현재쿠키조각 frame: x=16, y=290-50=240, w=135, h=60
  // Button_R: x=16, y=371-50=321, w=343, h=48

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      background: '#fff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      overflow: 'hidden',
    }}>
      {/* 전체를 비율 컨테이너로 감싸기 */}
      <div style={{ position: 'relative', width: '100%' }}>

        {/* 배경이미지: cinema_4d, 원래 frame보다 넓어서 overflow - 양쪽 삐져나옴 */}
        <img
          src={`${BASE}figma/reward_bg.png`}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            display: 'block',
            pointerEvents: 'none',
          }}
          alt=""
        />

        {/* 높이 확보용 spacer: FH/FW 비율 */}
        <div style={{ paddingTop: `${(FH / FW) * 100}%` }} />

        {/* Nav: y=0 (원래 50, statusbar 제거) */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: `${(44 / FH) * 100}%`,
          display: 'flex',
          alignItems: 'center',
          padding: '0 16px',
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

        {/* 고양이 캔버스: 가운데 정렬, nav~쿠키조각 사이 공간에 맞춤 */}
        <canvas ref={canvasRef} style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          top: `${(44 / FH) * 100}%`,
          width: `${(200 / FW) * 100}%`,
          display: 'block',
        }} />

        {/* uinon badge (쿠키 30개 수령 완료!): x=123, y=171.6, w=134, h=37.4 */}
        <img
          src={`${BASE}figma/reward_badge.png`}
          style={{
            position: 'absolute',
            left: `${(123 / FW) * 100}%`,
            top: `${(171.6 / FH) * 100}%`,
            width: `${(134 / FW) * 100}%`,
            display: 'block',
            pointerEvents: 'none',
          }}
          alt=""
        />

        {/* mi (시작해볼까): x=273, y=236, w=86, h=71 */}
        <img
          src={`${BASE}figma/reward_mi.png`}
          style={{
            position: 'absolute',
            left: `${(273 / FW) * 100}%`,
            top: `${(236 / FH) * 100}%`,
            width: `${(86 / FW) * 100}%`,
            display: 'block',
            pointerEvents: 'none',
          }}
          alt=""
        />

        {/* 현재 쿠키조각 레이블 + 슬롯 숫자: x=16, y=240 */}
        <div style={{
          position: 'absolute',
          left: `${(16 / FW) * 100}%`,
          top: `${(240 / FH) * 100}%`,
        }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: '#000', letterSpacing: -0.15, lineHeight: '18px', marginBottom: 4 }}>
            현재 쿠키조각
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
            <SlotNumber value={TARGET} />
            <span style={{ fontSize: 14, fontWeight: 700, color: '#000', lineHeight: `${DIGIT_H}px` }}>/100개</span>
          </div>
        </div>

        {/* Button_R: x=16, y=321, w=343, h=48 */}
        <div
          onClick={handleButtonClick}
          style={{
            position: 'absolute',
            left: `${(16 / FW) * 100}%`,
            top: `${(321 / FH) * 100}%`,
            width: `${(343 / FW) * 100}%`,
            cursor: 'pointer',
          }}
        >
          <img
            src={`${BASE}figma/reward_button.png`}
            style={{ width: '100%', display: 'block' }}
            alt="쿠키로 교환하기"
          />
        </div>

      </div>
    </div>
  )
}

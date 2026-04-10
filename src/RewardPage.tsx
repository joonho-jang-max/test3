import { useEffect, useRef, useState } from 'react'

const BASE = import.meta.env.BASE_URL
const TARGET = 1221
const DIGIT_H = 42
const FPS = 24

// 아이들: 1~17 루프 / 액션: 18~20, 22~49 (21번 없음)
const IDLE_FRAMES = Array.from({ length: 17 }, (_, i) => i + 1)
const ACTION_FRAMES = [
  ...Array.from({ length: 3 }, (_, i) => i + 18),   // 18,19,20
  ...Array.from({ length: 28 }, (_, i) => i + 22),   // 22~49
]

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
    const displayH = canvas.offsetHeight
    canvas.width = displayW * dpr
    canvas.height = displayH * dpr
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

        {/* 뒤로가기 투명 터치 영역 */}
        <div onClick={onBack} style={{
          position: 'absolute',
          top: `${(50 / 468) * 100}%`,
          left: 0,
          width: `${(44 / 375) * 100}%`,
          height: `${(44 / 468) * 100}%`,
          cursor: 'pointer',
        }} />

        {/* 고양이 워크 캔버스: 배경 고양이 위치(x=85,y=0,212×310) */}
        <canvas ref={canvasRef} style={{
          position: 'absolute',
          left: `${(85 / 375) * 100}%`,
          top: 0,
          width: `${(212 / 375) * 100}%`,
          height: `${(310 / 468) * 100}%`,
          display: 'block',
        }} />

        {/* 쿠키로교환하기 버튼 투명 오버레이 */}
        <div onClick={handleButtonClick} style={{
          position: 'absolute',
          top: `${(371 / 468) * 100}%`,
          left: `${(16 / 375) * 100}%`,
          width: `${(343 / 375) * 100}%`,
          height: `${(48 / 468) * 100}%`,
          cursor: 'pointer',
        }} />

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

        {/* 1221 슬롯 숫자 */}
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

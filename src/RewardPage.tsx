import { useEffect, useRef, useState } from 'react'

const BASE = import.meta.env.BASE_URL
const TARGET = 1221
const DIGIT_H = 42
const FPS = 24

const IDLE_FRAMES = Array.from({ length: 17 }, (_, i) => i + 1)
const ACTION_FRAMES = Array.from({ length: 32 }, (_, i) => i + 18)

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
  for (let i = ROLL; i >= 0; i--) items.push(((target - i) % 10 + 10) % 10)

  return (
    <div style={{ width: 32, height: DIGIT_H, overflow: 'hidden', display: 'inline-block', margin: '0 -4px' }}>
      <div ref={ref} style={{ transform: 'translateY(0)', willChange: 'transform' }}>
        {items.map((n, i) => (
          <div key={i} style={{ height: DIGIT_H, lineHeight: `${DIGIT_H}px`, fontSize: 42, fontWeight: 700, color: '#121212', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif', textAlign: 'center' }}>{n}</div>
        ))}
      </div>
    </div>
  )
}

function SlotNumber({ value }: { value: number }) {
  const digits = String(value).split('').map(Number)
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center' }}>
      {digits.map((d, i) => <SlotDigit key={i} target={d} delay={i * 120} />)}
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

  return (
    <div style={{ width: '100%', minHeight: '100vh', background: '#fff', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif', overflow: 'hidden' }}>

      {/* ── Hero 블록: 배경 + nav + 고양이 + 뱃지 ── */}
      <div style={{ position: 'relative' }}>
        {/* 배경 */}
        <img src={`${BASE}figma/reward_bg.png`}
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', display: 'block', pointerEvents: 'none' }}
          alt="" />

        {/* Nav */}
        <div style={{ position: 'relative', height: 44, display: 'flex', alignItems: 'center', padding: '0 16px' }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0 8px 0 0', display: 'flex', alignItems: 'center' }}>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path d="M18 6L10 14L18 22" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <span style={{ fontSize: 16, fontWeight: 600 }}>리워드</span>
          <span style={{ marginLeft: 'auto', fontSize: 15, fontWeight: 500, color: '#555' }}>내역보기</span>
        </div>

        {/* 고양이 캔버스 (flow → hero 높이 결정) + 뱃지 overlay */}
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
          <canvas ref={canvasRef} style={{ width: 200, display: 'block' }} />
          {/* 쿠키 30개 수령 완료! 뱃지: 고양이 하단 오버레이 */}
          <img src={`${BASE}figma/reward_badge.png`}
            style={{ position: 'absolute', bottom: '22%', left: '50%', transform: 'translateX(-50%)', width: 134, display: 'block', pointerEvents: 'none' }}
            alt="" />
        </div>
      </div>

      {/* ── 하단 섹션 ── */}
      <div style={{ padding: '8px 16px 0', position: 'relative' }}>
        {/* 현재 쿠키조각 레이블 */}
        <div style={{ fontSize: 15, fontWeight: 600, color: '#000', letterSpacing: -0.15, lineHeight: '18px', marginBottom: 2 }}>
          현재 쿠키조각
        </div>
        {/* 1221 + /100개 + mi 같은 줄 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
            <SlotNumber value={TARGET} />
            <span style={{ fontSize: 14, fontWeight: 700, color: '#000', lineHeight: `${DIGIT_H}px` }}>/100개</span>
          </div>
          <img src={`${BASE}figma/reward_mi.png`} style={{ width: 86, display: 'block', flexShrink: 0 }} alt="" />
        </div>

        {/* Button_R */}
        <div onClick={handleButtonClick} style={{ cursor: 'pointer' }}>
          <img src={`${BASE}figma/reward_button.png`} style={{ width: '100%', display: 'block' }} alt="쿠키로 교환하기" />
        </div>
      </div>

    </div>
  )
}

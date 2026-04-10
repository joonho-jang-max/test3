import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'

const TOTAL_FRAMES = 156
const FPS = 24
const BASE = import.meta.env.BASE_URL
const SIZE = 64
const SHRUNK_WIDTH = 74

export default function FloatingCat({ onClick }: { onClick?: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef(0)
  const imagesRef = useRef<HTMLImageElement[]>([])
  const loadedRef = useRef(0)
  const rafRef = useRef<number>(0)
  const [shrunk, setShrunk] = useState(false)
  const shrunkRef = useRef(false)

  // 너비 측정 및 transition 활성화
  const pillRef = useRef<HTMLDivElement>(null)
  const [initWidth, setInitWidth] = useState<number | null>(null)
  const [canTransition, setCanTransition] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    const dpr = window.devicePixelRatio || 2
    const W = SIZE * dpr
    const H = SIZE * dpr
    canvas.width = W
    canvas.height = H

    const frames: HTMLImageElement[] = []
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image()
      img.src = `${BASE}cat_intro_fin/a_${String(i).padStart(5, '0')}.png`
      img.onload = () => {
        loadedRef.current++
        if (loadedRef.current === TOTAL_FRAMES) startLoop()
      }
      frames.push(img)
    }
    imagesRef.current = frames

    let last = 0
    const interval = 1000 / FPS
    function startLoop() {
      function tick(ts: number) {
        if (ts - last >= interval) {
          ctx.clearRect(0, 0, W, H)
          ctx.drawImage(imagesRef.current[frameRef.current], 0, 0, W, H)
          frameRef.current = (frameRef.current + 1) % TOTAL_FRAMES
          last = ts
        }
        rafRef.current = requestAnimationFrame(tick)
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  /* 1) 자연 너비 측정 → 2) px로 고정 → 3) transition 활성화 */
  useLayoutEffect(() => {
    if (!pillRef.current) return
    const w = pillRef.current.offsetWidth
    setInitWidth(w)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setCanTransition(true))
    })
  }, [])

  /* 스크롤 시 한번만 줄어듦 */
  useEffect(() => {
    function onScroll() {
      if (!shrunkRef.current && window.scrollY >= 10) {
        shrunkRef.current = true
        setShrunk(true)
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const pillWidth = shrunk ? SHRUNK_WIDTH : (initWidth ?? undefined)

  return (
    <div style={{
      position: 'fixed',
      bottom: 66,
      right: 16,
      zIndex: 999,
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
    }} onClick={onClick}>

      {/* 말풍선 + 꼬리 + 레드닷 감싸는 wrapper */}
      <div style={{ position: 'relative', marginBottom: 6 }}>

        {/* 알약 pill (overflow:hidden으로 텍스트 클리핑) */}
        <div ref={pillRef} style={{
          position: 'relative',
          background: '#111',
          color: '#fff',
          fontSize: 12,
          fontWeight: 700,
          fontFamily: '"Pretendard", -apple-system, BlinkMacSystemFont, sans-serif',
          height: 28,
          borderRadius: 20,
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          /* 측정 전: max-content로 자연 너비, 측정 후: px로 고정/애니메이션 */
          width: initWidth === null ? 'max-content' : pillWidth,
          padding: '0 12px',
          lineHeight: '28px',
          transition: canTransition ? 'width 0.45s ease-in-out' : 'none',
          boxSizing: 'border-box',
        }}>
          {/* 원본 텍스트 */}
          <span style={{
            position: 'absolute',
            top: 0,
            left: 12,
            lineHeight: '28px',
            whiteSpace: 'nowrap',
            opacity: shrunk ? 0 : 1,
            transition: 'opacity 0.25s ease-in-out',
          }}>
            쿠키 모아서 선물받자!
          </span>
          {/* 리워드 미션 텍스트 (shrunk 후 페이드인, 가운데 정렬) */}
          <span style={{
            position: 'absolute',
            top: 1,
            left: 0,
            right: 0,
            lineHeight: '26px',
            paddingBottom: 2,
            whiteSpace: 'nowrap',
            textAlign: 'center',
            opacity: shrunk ? 1 : 0,
            transition: shrunk ? 'opacity 0.25s ease-in-out 0.5s' : 'none',
          }}>
            리워드 미션
          </span>
          {/* 인라인 스페이서: 컨테이너 너비를 텍스트 기준으로 잡아줌 */}
          {/* 초기 너비 확보용 스페이서 */}
          <span style={{ visibility: 'hidden', pointerEvents: 'none' }}>
            쿠키 모아서 선물받자!
          </span>

        </div>

        {/* 레드닷: pill overflow 밖 wrapper에 배치 */}
        <div style={{
          position: 'absolute',
          top: 1.5,
          right: 1.5,
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: '#FF2F5D',
          boxShadow: '0 0 0 1.5px #fff',
          pointerEvents: 'none',
        }}/>

        {/* 꼬리 */}
        <div style={{
          position: 'absolute',
          bottom: -5,
          right: 28,
          width: 10,
          height: 7,
          overflow: 'hidden',
        }}>
          <svg width="10" height="14" viewBox="0 0 10 14"
            style={{ position: 'absolute', top: -7, left: 0, display: 'block' }}>
            <path
              d="M5 1 Q5.8 0 10 7 Q5.8 14 5 13 Q4.2 14 0 7 Q4.2 0 5 1 Z"
              fill="#111"
            />
          </svg>
        </div>
      </div>

      {/* 고양이 캔버스 */}
      <div style={{ width: SIZE, height: SIZE }}>
        <canvas ref={canvasRef} style={{ width: SIZE, height: SIZE, display: 'block' }} />
      </div>
    </div>
  )
}

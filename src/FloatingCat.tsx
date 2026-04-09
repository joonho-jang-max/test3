import { useEffect, useRef } from 'react'

const TOTAL_FRAMES = 156
const FPS = 24
const BASE = import.meta.env.BASE_URL
const SIZE = 62

export default function FloatingCat() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef(0)
  const imagesRef = useRef<HTMLImageElement[]>([])
  const loadedRef = useRef(0)
  const rafRef = useRef<number>(0)

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

  return (
    <div style={{
      position: 'fixed',
      bottom: 76,
      right: 16,
      zIndex: 999,
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      {/* 말풍선 */}
      <div style={{
        position: 'relative',
        background: '#111',
        color: '#fff',
        fontSize: 12,
        fontWeight: 600,
        fontFamily: '"Pretendard", -apple-system, BlinkMacSystemFont, sans-serif',
        padding: '6px 10px',
        borderRadius: 20,
        whiteSpace: 'nowrap',
        marginBottom: 3,
      }}>
        일이삼사오육칠팔구십
        {/* 꼬리 */}
        <div style={{
          position: 'absolute',
          bottom: -5,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 0,
          height: 0,
          borderLeft: '5px solid transparent',
          borderRight: '5px solid transparent',
          borderTop: '6px solid #111',
        }}/>
      </div>
      <canvas
        ref={canvasRef}
        style={{ width: SIZE, height: SIZE, display: 'block' }}
      />
    </div>
  )
}

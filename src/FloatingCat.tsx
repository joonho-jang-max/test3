import { useEffect, useRef } from 'react'

const TOTAL_FRAMES = 208
const FPS = 24
const BASE = import.meta.env.BASE_URL

// 200x200 프레임 기준 하단 투명 7% → 캔버스 100px 기준 7px
// 고양이 바닥을 원 바닥에 맞추려면 캔버스를 7px 올려야 함
const BOTTOM_OFFSET = 7

export default function FloatingCat() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef(0)
  const imagesRef = useRef<HTMLImageElement[]>([])
  const loadedRef = useRef(0)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    const frames: HTMLImageElement[] = []

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image()
      const num = String(i).padStart(5, '0')
      img.src = `${BASE}entry/a 2_${num}.png`
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
          ctx.clearRect(0, 0, canvas.width, canvas.height)
          ctx.drawImage(imagesRef.current[frameRef.current], 0, 0, canvas.width, canvas.height)
          frameRef.current = (frameRef.current + 1) % TOTAL_FRAMES
          last = ts
        }
        rafRef.current = requestAnimationFrame(tick)
      }
      rafRef.current = requestAnimationFrame(tick)
    }

    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  const CANVAS_SIZE = 100

  return (
    <div style={{
      position: 'fixed',
      bottom: 94,
      right: 20,
      width: 63,
      height: 58 + (CANVAS_SIZE - 58) / 2,
      zIndex: 100,
      cursor: 'pointer',
    }}>
      {/* 초록 원 배경 */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 58,
        height: 58,
        borderRadius: '50%',
        background: '#00dc64',
        border: '1px solid rgba(0,0,0,0.05)',
        boxShadow: '0 4px 12px rgba(0,220,100,0.4)',
      }} />
      {/* 고양이 캔버스: 바닥 투명 패딩만큼 내려서 원 bottom에 정렬 */}
      <canvas
        ref={canvasRef}
        width={CANVAS_SIZE * 2}
        height={CANVAS_SIZE * 2}
        style={{
          position: 'absolute',
          bottom: -BOTTOM_OFFSET,
          left: '50%',
          transform: 'translateX(-50%)',
          width: CANVAS_SIZE,
          height: CANVAS_SIZE,
        }}
      />
    </div>
  )
}

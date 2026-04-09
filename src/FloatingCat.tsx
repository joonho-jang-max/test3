import { useEffect, useRef } from 'react'

const TOTAL_FRAMES = 208
const FPS = 24
const BASE = import.meta.env.BASE_URL

// 200x200 기준: 상단 투명 15.5%, 하단 투명 7%, 머리-몸통 경계 42.5%
// 원: 58x58
// 캔버스 크기 계산:
//   (1 - 0.07 - 0.425) * CANVAS = 58 → CANVAS = 58 / 0.505 ≈ 115px
// 결과: 머리-몸통 경계가 원 상단과 정확히 일치, 머리는 위로 ~31px 돌출
const CANVAS_SIZE = 115
const BOTTOM_OFFSET = Math.round(CANVAS_SIZE * 0.07) // 8px
const CIRCLE_R = 29   // 58px diameter
// canvas y좌표(px): 원 중심 = 원상단 + R = (CANVAS_SIZE-BOTTOM_OFFSET-58) + R
const CIRCLE_CY = (CANVAS_SIZE - BOTTOM_OFFSET - 58) + CIRCLE_R  // ≈ 78
const HEAD_END_Y = CANVAS_SIZE * 0.425  // ≈ 49 (= 원상단과 일치)

export default function FloatingCat() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef(0)
  const imagesRef = useRef<HTMLImageElement[]>([])
  const loadedRef = useRef(0)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    const W = CANVAS_SIZE * 2  // 2x retina
    const H = CANVAS_SIZE * 2
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

    function draw(img: HTMLImageElement) {
      ctx.clearRect(0, 0, W, H)
      ctx.save()

      // 클리핑: 머리 영역(직사각형) + 원 영역 = UNION
      ctx.beginPath()
      // 머리 부분: canvas 상단부터 원 상단까지 (full width)
      ctx.rect(0, 0, W, HEAD_END_Y * 2)
      // 몸통/쿠키: 원형 클리핑
      ctx.arc(W / 2, CIRCLE_CY * 2, CIRCLE_R * 2, 0, Math.PI * 2)
      ctx.clip()

      ctx.drawImage(img, 0, 0, W, H)
      ctx.restore()
    }

    function startLoop() {
      function tick(ts: number) {
        if (ts - last >= interval) {
          draw(imagesRef.current[frameRef.current])
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
      bottom: 94,
      right: 20,
      width: 63,
      height: CANVAS_SIZE - BOTTOM_OFFSET,
      zIndex: 100,
      cursor: 'pointer',
    }}>
      {/* 초록 원 배경 (shadow 없음) */}
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
      }} />
      {/* 고양이 캔버스: 머리=원 위 돌출, 몸통/쿠키=원형 클리핑 */}
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

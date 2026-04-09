import { useEffect, useRef } from 'react'

const TOTAL_FRAMES = 156
const FPS = 24
const BASE = import.meta.env.BASE_URL
const SIZE = 58  // display size on screen

export default function FloatingCat() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef(0)
  const imagesRef = useRef<HTMLImageElement[]>([])
  const loadedRef = useRef(0)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    const W = SIZE * 2
    const H = SIZE * 2
    const frames: HTMLImageElement[] = []

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image()
      const num = String(i).padStart(5, '0')
      img.src = `${BASE}cat_intro/intro_${num}.png`
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
      bottom: 70,
      right: 16,
      width: SIZE,
      height: SIZE,
      zIndex: 100,
      cursor: 'pointer',
    }}>
      <canvas
        ref={canvasRef}
        width={SIZE * 2}
        height={SIZE * 2}
        style={{ width: SIZE, height: SIZE }}
      />
    </div>
  )
}

import React, { useEffect, useRef, useState } from 'react'

const TOTAL_FRAMES = 156
const FPS = 24
const BASE = import.meta.env.BASE_URL
const SIZE = 64

export default function FloatingCat() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef(0)
  const imagesRef = useRef<HTMLImageElement[]>([])
  const loadedRef = useRef(0)
  const rafRef = useRef<number>(0)
  const [bubbleVisible, setBubbleVisible] = useState(true)
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

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

  useEffect(() => {
    function onScroll() {
      setBubbleVisible(false)
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

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
    }}>
      <div style={{
        position: 'relative',
        background: '#111',
        color: '#fff',
        fontSize: 12,
        fontWeight: 600,
        fontFamily: '"Pretendard", -apple-system, BlinkMacSystemFont, sans-serif',
        padding: '6px 12px',
        borderRadius: 20,
        whiteSpace: 'nowrap',
        marginBottom: 6,   /* 꼬리 절반 6px 노출 */
        boxShadow: 'none',
        opacity: bubbleVisible ? 1 : 0,
        transition: 'opacity 0.3s ease',
        pointerEvents: bubbleVisible ? 'auto' : 'none',
      }}>
        일이삼사오육칠팔구십
        {/* 꼬리: 컨테이너로 위 절반 숨기고 아래 절반만 노출 */}
        <div style={{
          position: 'absolute',
          bottom: -6,
          right: 29,
          width: 7,
          height: 6,
          overflow: 'hidden',
        }}>
          <svg
            width="7" height="12"
            viewBox="0 0 7 12"
            style={{ position: 'absolute', top: -6, left: 0, display: 'block' }}
          >
            <path
              d="M3.5 0.8 Q4.3 0 7 6 Q4.3 12 3.5 11.2 Q2.7 12 0 6 Q2.7 0 3.5 0.8 Z"
              fill="#111"
            />
          </svg>
        </div>
      </div>
      <canvas
        ref={canvasRef}
        style={{ width: SIZE, height: SIZE, display: 'block' }}
      />
    </div>
  )
}

'use client'

import { useEffect, useRef } from 'react'

interface Star {
  baseX: number; baseY: number; x: number; y: number
  r: number; alpha: number; speed: number; color: string; layer: number
}

interface ShootingStar {
  x: number; y: number; vx: number; vy: number
  alpha: number; trail: number; life: number; maxLife: number
}

interface Nebula {
  x: number; y: number; r: number; alpha: number
  vx: number; vy: number; color: string
}

const COLORS = ['rgba(212,175,55,', 'rgba(253,246,220,', 'rgba(255,255,255,']
const PARALLAX = [0.006, 0.016, 0.028]

export default function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let W = window.innerWidth
    let H = window.innerHeight

    const resize = () => {
      W = canvas.width = window.innerWidth
      H = canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize, { passive: true })

    const onMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX / W - 0.5, y: e.clientY / H - 0.5 }
    }
    window.addEventListener('mousemove', onMouse, { passive: true })

    // Stars in 3 parallax layers
    const stars: Star[] = Array.from({ length: 340 }, (_, i) => {
      const layer = i < 210 ? 0 : i < 300 ? 1 : 2
      const bx = Math.random() * W
      const by = Math.random() * H
      return {
        baseX: bx, baseY: by, x: bx, y: by,
        r: layer === 0 ? Math.random() * 0.7 + 0.2
          : layer === 1 ? Math.random() * 1.1 + 0.4
          : Math.random() * 2.2 + 1,
        alpha: Math.random(),
        speed: (Math.random() * 0.004 + 0.001) * (layer + 1) * 0.6,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        layer,
      }
    })

    // Soft nebula patches
    const nebulas: Nebula[] = Array.from({ length: 5 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 220 + 120,
      alpha: Math.random() * 0.035 + 0.008,
      vx: (Math.random() - 0.5) * 0.04,
      vy: (Math.random() - 0.5) * 0.04,
      color: Math.random() > 0.5 ? '212,175,55' : '140,100,30',
    }))

    const shooters: ShootingStar[] = []

    const spawnShooter = () => {
      const angle = Math.PI * 0.18 + (Math.random() - 0.5) * 0.3
      const spd = Math.random() * 9 + 6
      shooters.push({
        x: Math.random() * W * 0.6 + W * 0.05,
        y: Math.random() * H * 0.35,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd,
        alpha: 0, trail: Math.random() * 90 + 50,
        life: 0, maxLife: Math.random() * 55 + 35,
      })
    }

    let frame = 0
    let raf: number

    const tick = () => {
      ctx.clearRect(0, 0, W, H)
      const mx = mouseRef.current.x
      const my = mouseRef.current.y

      // Nebulas
      nebulas.forEach(n => {
        n.x += n.vx; n.y += n.vy
        if (n.x < -n.r) n.x = W + n.r
        if (n.x > W + n.r) n.x = -n.r
        if (n.y < -n.r) n.y = H + n.r
        if (n.y > H + n.r) n.y = -n.r
        const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r)
        g.addColorStop(0, `rgba(${n.color},${n.alpha})`)
        g.addColorStop(1, `rgba(${n.color},0)`)
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
        ctx.fillStyle = g; ctx.fill()
      })

      // Stars with parallax
      stars.forEach(s => {
        s.alpha += s.speed
        if (s.alpha >= 1 || s.alpha <= 0) s.speed *= -1
        s.x = s.baseX + mx * W * PARALLAX[s.layer]
        s.y = s.baseY + my * H * PARALLAX[s.layer]

        if (s.layer < 2) {
          ctx.beginPath()
          ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
          ctx.fillStyle = `${s.color}${s.alpha})`
          ctx.fill()
        } else {
          // Feature star: glow halo
          const halo = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 5)
          halo.addColorStop(0, `${s.color}${s.alpha * 0.7})`)
          halo.addColorStop(0.4, `${s.color}${s.alpha * 0.25})`)
          halo.addColorStop(1, `${s.color}0)`)
          ctx.beginPath()
          ctx.arc(s.x, s.y, s.r * 5, 0, Math.PI * 2)
          ctx.fillStyle = halo; ctx.fill()

          // White core
          ctx.beginPath()
          ctx.arc(s.x, s.y, s.r * 0.7, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255,255,255,${Math.min(s.alpha * 1.3, 1)})`
          ctx.fill()

          // 4-point cross flare
          if (s.r > 1.8) {
            ctx.save()
            ctx.globalAlpha = s.alpha * 0.25
            const fl = s.r * 9
            const gH = ctx.createLinearGradient(s.x - fl, s.y, s.x + fl, s.y)
            gH.addColorStop(0, 'transparent')
            gH.addColorStop(0.5, '#EDD37A')
            gH.addColorStop(1, 'transparent')
            ctx.fillStyle = gH
            ctx.fillRect(s.x - fl, s.y - 0.6, fl * 2, 1.2)
            const gV = ctx.createLinearGradient(s.x, s.y - fl, s.x, s.y + fl)
            gV.addColorStop(0, 'transparent')
            gV.addColorStop(0.5, '#EDD37A')
            gV.addColorStop(1, 'transparent')
            ctx.fillStyle = gV
            ctx.fillRect(s.x - 0.6, s.y - fl, 1.2, fl * 2)
            ctx.restore()
          }
        }
      })

      // Shooting stars
      frame++
      if (frame % 200 === 0 && Math.random() > 0.35) spawnShooter()

      for (let i = shooters.length - 1; i >= 0; i--) {
        const s = shooters[i]
        s.life++
        s.x += s.vx; s.y += s.vy
        const t = s.life / s.maxLife
        s.alpha = t < 0.15 ? t / 0.15 : t > 0.65 ? (1 - t) / 0.35 : 1

        const trailLen = s.trail * 0.12

        const trailGrad = ctx.createLinearGradient(
          s.x - s.vx * trailLen, s.y - s.vy * trailLen, s.x, s.y
        )
        trailGrad.addColorStop(0, `rgba(212,175,55,0)`)
        trailGrad.addColorStop(0.6, `rgba(235,205,100,${s.alpha * 0.35})`)
        trailGrad.addColorStop(1, `rgba(255,255,255,${s.alpha * 0.9})`)
        ctx.beginPath()
        ctx.moveTo(s.x - s.vx * trailLen, s.y - s.vy * trailLen)
        ctx.lineTo(s.x, s.y)
        ctx.strokeStyle = trailGrad
        ctx.lineWidth = 1.5; ctx.stroke()

        // Head glow
        const headGlow = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, 5)
        headGlow.addColorStop(0, `rgba(255,255,255,${s.alpha})`)
        headGlow.addColorStop(1, 'rgba(255,255,255,0)')
        ctx.beginPath()
        ctx.arc(s.x, s.y, 5, 0, Math.PI * 2)
        ctx.fillStyle = headGlow; ctx.fill()

        if (s.life >= s.maxLife) shooters.splice(i, 1)
      }

      raf = requestAnimationFrame(tick)
    }
    tick()

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouse)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ mixBlendMode: 'screen' }}
    />
  )
}

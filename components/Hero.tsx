'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import StarField from './StarField'

const PARTICLES = [
  { top: '12%', left: '7%',   size: 2.5, delay: 0,   dur: 10, shape: 'diamond' },
  { top: '22%', right: '11%', size: 1.5, delay: 1.8, dur: 12, shape: 'dot' },
  { top: '60%', left: '5%',   size: 3,   delay: 0.6, dur: 9,  shape: 'cross' },
  { top: '72%', right: '7%',  size: 2,   delay: 2.2, dur: 11, shape: 'dot' },
  { top: '38%', left: '2%',   size: 1.5, delay: 3.1, dur: 13, shape: 'diamond' },
  { top: '50%', right: '3%',  size: 2,   delay: 1,   dur: 9,  shape: 'cross' },
  { top: '82%', left: '14%',  size: 1.5, delay: 4,   dur: 14, shape: 'dot' },
  { top: '18%', left: '20%',  size: 1,   delay: 2.5, dur: 11, shape: 'dot' },
]

function ParticleShape({ shape, size }: { shape: string; size: number }) {
  if (shape === 'diamond') {
    return (
      <svg width={size * 5} height={size * 5} viewBox="0 0 10 10">
        <path d="M5 1L9 5L5 9L1 5Z" fill="none" stroke="rgba(212,175,55,0.7)" strokeWidth="0.8" />
      </svg>
    )
  }
  if (shape === 'cross') {
    return (
      <svg width={size * 6} height={size * 6} viewBox="0 0 12 12">
        <line x1="6" y1="0" x2="6" y2="12" stroke="rgba(212,175,55,0.5)" strokeWidth="0.8" />
        <line x1="0" y1="6" x2="12" y2="6" stroke="rgba(212,175,55,0.5)" strokeWidth="0.8" />
      </svg>
    )
  }
  return (
    <div
      className="rounded-full"
      style={{
        width: size * 2,
        height: size * 2,
        background: 'radial-gradient(circle, rgba(212,175,55,0.8) 0%, rgba(212,175,55,0) 100%)',
      }}
    />
  )
}

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null)
  const [mouse, setMouse] = useState({ x: 50, y: 50 })
  const [mounted, setMounted] = useState(false)

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const yContent = useTransform(scrollYProgress, [0, 1], ['0%', '22%'])
  const yBg     = useTransform(scrollYProgress, [0, 1], ['0%', '14%'])
  const opacity = useTransform(scrollYProgress, [0, 0.65], [1, 0])

  useEffect(() => { setMounted(true) }, [])

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = heroRef.current?.getBoundingClientRect()
    if (!rect) return
    setMouse({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    })
  }, [])

  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.13, delayChildren: 0.55 } },
  }
  const item = {
    hidden: { opacity: 0, y: 38, filter: 'blur(8px)' },
    visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } },
  }

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black"
      onMouseMove={onMouseMove}
    >
      {/* Canvas starfield */}
      <StarField />

      {/* Parallax background layers */}
      <motion.div className="absolute inset-0 pointer-events-none" style={{ y: yBg }}>
        {/* Central aurora */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 110% 80% at 50% 50%, rgba(212,175,55,0.055) 0%, rgba(180,130,30,0.02) 40%, transparent 70%)',
          }}
        />
        {/* Off-center accent glows */}
        <div
          className="absolute w-[700px] h-[400px] rounded-full"
          style={{
            top: '15%', left: '10%',
            background: 'radial-gradient(ellipse, rgba(180,120,20,0.08) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
        <div
          className="absolute w-[500px] h-[300px] rounded-full"
          style={{
            bottom: '20%', right: '8%',
            background: 'radial-gradient(ellipse, rgba(212,175,55,0.07) 0%, transparent 70%)',
            filter: 'blur(100px)',
          }}
        />
      </motion.div>

      {/* God rays — conic gradient rotating slowly */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 140, repeat: Infinity, ease: 'linear' }}
        style={{
          background: `conic-gradient(
            from 0deg at 50% 48%,
            transparent 0deg, rgba(212,175,55,0.025) 8deg, transparent 18deg,
            transparent 78deg, rgba(212,175,55,0.018) 88deg, transparent 98deg,
            transparent 155deg, rgba(212,175,55,0.022) 165deg, transparent 175deg,
            transparent 235deg, rgba(212,175,55,0.015) 245deg, transparent 255deg,
            transparent 310deg, rgba(212,175,55,0.02) 320deg, transparent 330deg,
            transparent 360deg
          )`,
          filter: 'blur(12px)',
          transformOrigin: '50% 48%',
        }}
      />

      {/* Mouse-tracking spotlight */}
      {mounted && (
        <div
          className="absolute inset-0 pointer-events-none transition-none"
          style={{
            background: `radial-gradient(circle 600px at ${mouse.x}% ${mouse.y}%, rgba(212,175,55,0.055) 0%, rgba(212,175,55,0.015) 40%, transparent 70%)`,
            transition: 'background 0.12s ease-out',
          }}
        />
      )}

      {/* Floating decorative particles */}
      {PARTICLES.map((p, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none flex items-center justify-center"
          style={{
            top: p.top,
            left: 'left' in p ? p.left : undefined,
            right: 'right' in p ? (p as { right: string }).right : undefined,
          }}
          animate={{
            y: [0, -28, 4, -14, 0],
            opacity: [0.3, 0.85, 0.55, 0.85, 0.3],
            rotate: p.shape === 'diamond' ? [0, 180, 360] : [0, 0, 0],
          }}
          transition={{
            duration: p.dur,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <ParticleShape shape={p.shape} size={p.size} />
        </motion.div>
      ))}

      {/* Thin horizontal scan line */}
      <motion.div
        className="absolute left-0 right-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.18) 40%, rgba(245,216,100,0.35) 50%, rgba(212,175,55,0.18) 60%, transparent 100%)' }}
        animate={{ top: ['15%', '85%', '15%'] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
      />

      {/* Main content */}
      <motion.div
        className="relative z-10 text-center px-5 sm:px-6 max-w-5xl mx-auto w-full pb-20 sm:pb-0"
        style={{ y: yContent, opacity }}
        variants={container}
        initial="hidden"
        animate="visible"
      >
        {/* Eyebrow label */}
        <motion.div variants={item} className="flex items-center justify-center gap-3 mb-8 sm:mb-10">
          <div className="h-px w-8 sm:w-16 bg-gradient-to-r from-transparent via-gold-500/40 to-gold-500/70 flex-shrink-0" />
          <div className="flex items-center gap-2 px-3 sm:px-4 py-1.5 border border-gold-500/20" style={{ background: 'rgba(212,175,55,0.04)' }}>
            <div className="w-1 h-1 rounded-full bg-gold-500 animate-pulse flex-shrink-0" />
            <span className="text-gold-400/75 text-[0.52rem] sm:text-[0.58rem] tracking-[0.2em] sm:tracking-[0.38em] font-display uppercase text-center">
              Est. 2031 · Luxury Temporal Travel
            </span>
          </div>
          <div className="h-px w-8 sm:w-16 bg-gradient-to-l from-transparent via-gold-500/40 to-gold-500/70 flex-shrink-0" />
        </motion.div>

        {/* Headline — each word on its own line with distinct weight */}
        <motion.h1
          variants={item}
          className="font-display font-black leading-[0.9] tracking-tight mb-0"
          style={{ fontSize: 'clamp(3.2rem, 8.5vw, 8rem)' }}
        >
          <span
            className="block text-white/90 mb-1"
            style={{ textShadow: '0 0 80px rgba(212,175,55,0.08)' }}
          >
            JOURNEY
          </span>
          <span
            className="block gold-text"
            style={{
              filter: 'drop-shadow(0 0 40px rgba(212,175,55,0.35)) drop-shadow(0 0 80px rgba(212,175,55,0.15))',
            }}
          >
            THROUGH
          </span>
          <span
            className="block text-white/90 mt-1"
            style={{ textShadow: '0 0 80px rgba(212,175,55,0.08)' }}
          >
            TIME
          </span>
        </motion.h1>

        {/* Ornament divider */}
        <motion.div variants={item} className="flex items-center justify-center gap-5 my-8">
          <div className="h-px flex-1 max-w-[100px] bg-gradient-to-r from-transparent to-gold-500/35" />
          <div className="flex items-center gap-2">
            <div className="w-px h-3 bg-gold-500/30" />
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" className="text-gold-500/70">
              <path d="M10 2L11.5 7.5L17 10L11.5 12.5L10 18L8.5 12.5L3 10L8.5 7.5L10 2Z"
                stroke="currentColor" strokeWidth="0.8" fill="rgba(212,175,55,0.1)" />
            </svg>
            <div className="w-px h-3 bg-gold-500/30" />
          </div>
          <div className="h-px flex-1 max-w-[100px] bg-gradient-to-l from-transparent to-gold-500/35" />
        </motion.div>

        {/* Subheadline */}
        <motion.p
          variants={item}
          className="text-white/40 text-[0.9rem] md:text-[1.05rem] font-body font-light leading-[1.85] tracking-[0.03em] max-w-lg mx-auto mb-10 sm:mb-12 px-2 sm:px-0"
        >
          The world's only ultra-luxury temporal travel agency.
          <br className="hidden sm:block" />
          {' '}Bespoke journeys to history's most magnificent moments.
        </motion.p>

        {/* CTA buttons */}
        <motion.div variants={item} className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-12 sm:mb-16 w-full sm:w-auto">
          {/* Primary — gold filled with glow */}
          <motion.a
            href="#destinations"
            className="relative w-full sm:w-auto px-10 py-4 text-[0.72rem] tracking-[0.22em] font-display font-bold text-black overflow-hidden text-center"
            style={{
              background: 'linear-gradient(135deg, #D4AF37 0%, #F5D864 50%, #D4AF37 100%)',
              minHeight: '52px',
              touchAction: 'manipulation',
            }}
            whileHover={{
              scale: 1.03,
              boxShadow: '0 0 35px rgba(212,175,55,0.55), 0 0 70px rgba(212,175,55,0.25), 0 0 120px rgba(212,175,55,0.1)',
            }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 380, damping: 25 }}
          >
            <span className="relative z-10">EXPLORE DESTINATIONS</span>
            <motion.div
              className="absolute inset-0 skew-x-12 pointer-events-none"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)' }}
              initial={{ x: '-150%' }}
              animate={{ x: '250%' }}
              transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3, ease: 'easeInOut' }}
            />
          </motion.a>

          {/* Secondary — outlined */}
          <motion.a
            href="#testimonials"
            className="relative w-full sm:w-auto px-10 py-4 text-[0.72rem] tracking-[0.22em] font-display font-semibold text-gold-400 overflow-hidden text-center group"
            style={{
              border: '1px solid rgba(212,175,55,0.3)',
              minHeight: '52px',
              touchAction: 'manipulation',
            }}
            whileHover={{
              scale: 1.03,
              boxShadow: '0 0 25px rgba(212,175,55,0.2), inset 0 0 25px rgba(212,175,55,0.04)',
              borderColor: 'rgba(212,175,55,0.65)',
            }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 380, damping: 25 }}
          >
            <span className="relative z-10">CLIENT TESTIMONIALS</span>
            <div className="absolute inset-0 bg-gold-500/0 group-hover:bg-gold-500/[0.06] transition-colors duration-400" />
          </motion.a>
        </motion.div>

        {/* Stats row */}
        <motion.div
          variants={item}
          className="flex items-center justify-center gap-5 sm:gap-10 md:gap-16"
        >
          {[
            { value: '847+', label: 'Journeys' },
            { value: '99.9%', label: 'Safe Return' },
            { value: '12', label: 'Eras' },
          ].map((stat, i) => (
            <div key={stat.label} className="text-center relative">
              {i > 0 && (
                <div className="absolute -left-2.5 sm:-left-5 md:-left-8 top-1/2 -translate-y-1/2 w-px h-5 sm:h-6 bg-gold-500/15" />
              )}
              <div
                className="font-display text-xl sm:text-2xl md:text-3xl font-black gold-text leading-none"
                style={{ filter: 'drop-shadow(0 0 12px rgba(212,175,55,0.3))' }}
              >
                {stat.value}
              </div>
              <div className="text-white/25 text-[0.52rem] sm:text-[0.58rem] tracking-[0.1em] sm:tracking-[0.14em] uppercase mt-1.5 font-body">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 cursor-pointer z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 1 }}
        onClick={() => document.getElementById('destinations')?.scrollIntoView({ behavior: 'smooth' })}
      >
        <span className="text-white/20 text-[0.55rem] tracking-[0.3em] font-display uppercase">
          Scroll
        </span>
        <div className="relative w-5 h-8 border border-gold-500/25 rounded-full flex items-start justify-center pt-1.5">
          <motion.div
            className="w-1 h-1.5 rounded-full bg-gold-400"
            animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>

      {/* Bottom vignette */}
      <div
        className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none"
        style={{ background: 'linear-gradient(to top, #000 0%, rgba(0,0,0,0.5) 60%, transparent 100%)' }}
      />
      {/* Side vignettes */}
      <div className="absolute inset-y-0 left-0 w-24 pointer-events-none" style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.4), transparent)' }} />
      <div className="absolute inset-y-0 right-0 w-24 pointer-events-none" style={{ background: 'linear-gradient(to left, rgba(0,0,0,0.4), transparent)' }} />
    </section>
  )
}

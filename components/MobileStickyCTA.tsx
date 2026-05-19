'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function MobileStickyCTA() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const check = () => setVisible(window.scrollY > window.innerHeight * 0.6)
    window.addEventListener('scroll', check, { passive: true })
    check()
    return () => window.removeEventListener('scroll', check)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="md:hidden fixed bottom-0 left-0 right-0 z-40"
          initial={{ y: 72, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 72, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 32 }}
        >
          {/* Gradient fade above bar */}
          <div
            className="h-10 pointer-events-none"
            style={{ background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.92))' }}
          />
          <div
            className="px-4 pt-2"
            style={{
              background: 'rgba(0,0,0,0.96)',
              backdropFilter: 'blur(20px)',
              borderTop: '1px solid rgba(212,175,55,0.12)',
              paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 12px)',
            }}
          >
            <button
              className="relative w-full py-4 text-[0.72rem] tracking-[0.22em] font-display font-bold text-black overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #C9A840, #D4AF37, #F5D864, #D4AF37)',
                minHeight: '52px',
                touchAction: 'manipulation',
              }}
              aria-label="Book a temporal journey"
            >
              <span className="relative z-10">BOOK A JOURNEY</span>
              {/* Shimmer sweep */}
              <motion.div
                className="absolute inset-0 skew-x-12 pointer-events-none"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent)' }}
                initial={{ x: '-150%' }}
                animate={{ x: '250%' }}
                transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 4, ease: 'easeInOut' }}
              />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

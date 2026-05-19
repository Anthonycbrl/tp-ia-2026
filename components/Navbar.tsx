'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

const navLinks = [
  { label: 'Destinations', href: '#destinations' },
  { label: 'Experiences', href: '#experiences' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'py-3 bg-black/80 backdrop-blur-2xl'
          : 'py-7 bg-transparent'
      }`}
    >
      {/* Scroll-in bottom border */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.25), transparent)' }}
        animate={{ opacity: scrolled ? 1 : 0 }}
        transition={{ duration: 0.4 }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <motion.div
            className="relative w-9 h-9 flex-shrink-0"
            whileHover={{ filter: 'drop-shadow(0 0 10px rgba(212,175,55,0.6))' }}
            transition={{ duration: 0.3 }}
          >
            <svg viewBox="0 0 36 36" fill="none" className="w-9 h-9">
              <circle cx="18" cy="18" r="14" stroke="#D4AF37" strokeWidth="0.75" strokeDasharray="2.5 2.5" className="animate-spin-slow" />
              <circle cx="18" cy="18" r="9"  stroke="#D4AF37" strokeWidth="0.75" strokeDasharray="1.5 4" className="animate-spin-reverse" />
              <circle cx="18" cy="18" r="5"  stroke="#D4AF37" strokeWidth="1" />
              <line x1="18" y1="13" x2="18" y2="18" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="18" y1="18" x2="22" y2="21" stroke="#D4AF37" strokeWidth="1.25" strokeLinecap="round" />
              <circle cx="18" cy="18" r="1.2" fill="#D4AF37" />
            </svg>
          </motion.div>
          <div className="flex flex-col">
            <span className="font-display text-[0.68rem] font-bold tracking-[0.28em] text-gold-400 leading-tight group-hover:text-gold-300 transition-colors duration-300">
              TIMETRAVEL
            </span>
            <span className="font-display text-[0.56rem] tracking-[0.22em] text-white/28 leading-tight">
              AGENCY
            </span>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-9 lg:gap-11">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative text-white/48 hover:text-gold-300 text-[0.68rem] tracking-[0.14em] font-body font-medium uppercase transition-colors duration-300 group"
            >
              {link.label}
              <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-gradient-to-r from-gold-500/70 to-gold-300/50 group-hover:w-full transition-all duration-350" />
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:block">
          <motion.button
            className="relative px-6 py-2.5 text-[0.63rem] tracking-[0.2em] font-display font-semibold text-gold-400 border border-gold-500/28 overflow-hidden group"
            whileHover={{
              borderColor: 'rgba(212,175,55,0.65)',
              boxShadow: '0 0 20px rgba(212,175,55,0.2), inset 0 0 15px rgba(212,175,55,0.05)',
              color: '#F5D864',
            }}
            transition={{ duration: 0.3 }}
          >
            <span className="relative z-10">BOOK A JOURNEY</span>
            <motion.div
              className="absolute inset-0 -skew-x-12"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.06), transparent)' }}
              initial={{ x: '-120%' }}
              whileHover={{ x: '220%' }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </motion.button>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={`block w-5 h-px bg-gold-500 transition-all duration-300 origin-center ${
                menuOpen && i === 0 ? 'rotate-45 translate-y-[7px]' :
                menuOpen && i === 1 ? 'opacity-0 scale-x-0' :
                menuOpen && i === 2 ? '-rotate-45 -translate-y-[7px]' : ''
              }`}
            />
          ))}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden overflow-hidden bg-black/92 backdrop-blur-2xl border-t border-gold-500/10"
          >
            <div className="px-6 py-6 flex flex-col gap-5">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    href={link.href}
                    className="text-white/55 hover:text-gold-400 text-xs tracking-[0.16em] uppercase font-body transition-colors duration-300"
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.28 }}
                className="mt-2 px-6 py-4 text-[0.63rem] tracking-[0.2em] font-display font-semibold text-gold-400 border border-gold-500/28 w-full hover:border-gold-400/55 transition-colors duration-300"
              style={{ minHeight: '52px', touchAction: 'manipulation' }}
              >
                BOOK A JOURNEY
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

const links = {
  Destinations: ['Paris 1889', 'Cretaceous Period', 'Florence 1504', 'All Eras'],
  Company: ['Our Story', 'Safety & Ethics', 'Quantum Technology', 'Press'],
  Services: ['Private Consultation', 'Group Journeys', 'Corporate Events', 'Gift Journeys'],
  Support: ['FAQ', 'Traveller Portal', 'Contact Us', 'Emergency Protocol'],
}

const socials = [
  {
    name: 'X',
    href: '#',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    name: 'Instagram',
    href: '#',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4.5" />
        <circle cx="17.5" cy="6.5" r="0.75" fill="currentColor" strokeWidth="0" />
      </svg>
    ),
  },
  {
    name: 'LinkedIn',
    href: '#',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
]

export default function Footer() {
  return (
    <footer id="contact" className="relative bg-black border-t border-gold-500/10 overflow-hidden">
      {/* Top gold shimmer line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.4), transparent)' }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Main footer content */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 lg:gap-8">
          {/* Brand column */}
          <div className="lg:col-span-2">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 mb-6 w-fit">
              <div className="relative w-8 h-8 flex-shrink-0">
                <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
                  <circle cx="18" cy="18" r="14" stroke="#D4AF37" strokeWidth="0.75" strokeDasharray="2.5 2.5" className="animate-spin-slow" />
                  <circle cx="18" cy="18" r="5" stroke="#D4AF37" strokeWidth="1" />
                  <line x1="18" y1="13" x2="18" y2="18" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="18" y1="18" x2="22" y2="21" stroke="#D4AF37" strokeWidth="1.25" strokeLinecap="round" />
                  <circle cx="18" cy="18" r="1.2" fill="#D4AF37" />
                </svg>
              </div>
              <div>
                <span className="font-display text-xs font-bold tracking-[0.25em] text-gold-400 block leading-tight">TIMETRAVEL</span>
                <span className="font-display text-[0.55rem] tracking-[0.2em] text-white/30 block leading-tight">AGENCY</span>
              </div>
            </Link>

            <p className="text-white/35 text-sm font-body font-light leading-relaxed max-w-xs mb-6">
              The world's only ultra-luxury temporal travel agency. Crafting
              bespoke journeys through history since 2031.
            </p>

            {/* Social links */}
            <div className="flex items-center gap-3">
              {socials.map((s) => (
                <motion.a
                  key={s.name}
                  href={s.href}
                  aria-label={s.name}
                  className="w-8 h-8 border border-gold-500/20 hover:border-gold-400/50 flex items-center justify-center text-white/40 hover:text-gold-400 transition-all duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {s.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([category, items], i) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.07 }}
              className="lg:col-span-1"
            >
              <h4 className="text-[0.6rem] tracking-[0.25em] font-display text-gold-500/60 uppercase mb-4">
                {category}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {items.map((item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="text-white/35 hover:text-gold-400/80 text-xs font-body transition-colors duration-300 tracking-wide"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gold-500/8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/20 text-[0.58rem] tracking-[0.12em] font-body">
            © 2031–2026 TimeTravel Agency. All temporal rights reserved.
          </p>
          <div className="flex items-center gap-5">
            {['Privacy Policy', 'Terms of Travel', 'Temporal Ethics'].map((item) => (
              <Link
                key={item}
                href="#"
                className="text-white/20 hover:text-white/40 text-[0.55rem] tracking-[0.1em] font-body transition-colors duration-300"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

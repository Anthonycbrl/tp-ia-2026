'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

const linkGroups = [
  {
    category: 'Destinations',
    items: ['Paris 1889', 'Cretaceous Period', 'Florence 1504', 'All Eras'],
  },
  {
    category: 'Company',
    items: ['Our Story', 'Safety & Ethics', 'Quantum Technology', 'Press'],
  },
  {
    category: 'Services',
    items: ['Private Consultation', 'Group Journeys', 'Corporate Events', 'Gift Journeys'],
  },
  {
    category: 'Support',
    items: ['FAQ', 'Traveller Portal', 'Contact Us', 'Emergency Protocol'],
  },
]

const socials = [
  {
    name: 'X / Twitter',
    href: '#',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    name: 'Instagram',
    href: '#',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
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
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
]

export default function Footer() {
  return (
    <footer id="contact" className="relative bg-black overflow-hidden" style={{ borderTop: '1px solid rgba(212,175,55,0.1)' }}>
      {/* Top shimmer rule */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.4), transparent)' }}
      />

      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10">
        {/* ─── Main grid ─── */}
        <div className="pt-12 sm:pt-16 pb-8">
          {/* Top row: Brand + link columns */}
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-8 mb-10">
            {/* Brand block */}
            <div className="lg:w-[280px] flex-shrink-0">
              <Link href="/" className="flex items-center gap-3 mb-5 w-fit group">
                <motion.div
                  className="relative w-8 h-8 flex-shrink-0"
                  whileHover={{ filter: 'drop-shadow(0 0 8px rgba(212,175,55,0.5))' }}
                >
                  <svg viewBox="0 0 36 36" fill="none" className="w-8 h-8">
                    <circle cx="18" cy="18" r="14" stroke="#D4AF37" strokeWidth="0.75" strokeDasharray="2.5 2.5" className="animate-spin-slow" />
                    <circle cx="18" cy="18" r="5" stroke="#D4AF37" strokeWidth="1" />
                    <line x1="18" y1="13" x2="18" y2="18" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="18" y1="18" x2="22" y2="21" stroke="#D4AF37" strokeWidth="1.25" strokeLinecap="round" />
                    <circle cx="18" cy="18" r="1.2" fill="#D4AF37" />
                  </svg>
                </motion.div>
                <div>
                  <span className="font-display text-[0.68rem] font-bold tracking-[0.25em] text-gold-400 block leading-tight group-hover:text-gold-300 transition-colors duration-300">TIMETRAVEL</span>
                  <span className="font-display text-[0.52rem] tracking-[0.2em] text-white/28 block leading-tight">AGENCY</span>
                </div>
              </Link>

              <p className="text-white/32 text-[0.82rem] sm:text-sm font-body font-light leading-relaxed max-w-xs mb-6">
                The world's only ultra-luxury temporal travel agency. Crafting bespoke journeys through history since 2031.
              </p>

              {/* Social links */}
              <div className="flex items-center gap-2.5" role="list" aria-label="Social media links">
                {socials.map((s) => (
                  <motion.a
                    key={s.name}
                    href={s.href}
                    aria-label={s.name}
                    role="listitem"
                    className="w-9 h-9 border border-gold-500/20 hover:border-gold-400/50 flex items-center justify-center text-white/40 hover:text-gold-400 transition-all duration-300"
                    style={{ minWidth: '36px', minHeight: '36px', touchAction: 'manipulation' }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {s.icon}
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Link columns — 2-col on mobile/sm, 4-col on md+ */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 flex-1">
              {linkGroups.map(({ category, items }, i) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: i * 0.06 }}
                >
                  <h4 className="text-[0.58rem] tracking-[0.25em] font-display text-gold-500/55 uppercase mb-4">
                    {category}
                  </h4>
                  <ul className="flex flex-col gap-2.5" role="list">
                    {items.map((item) => (
                      <li key={item}>
                        <Link
                          href="#"
                          className="text-white/32 hover:text-gold-400/80 text-[0.78rem] sm:text-xs font-body transition-colors duration-300 tracking-wide"
                          style={{ touchAction: 'manipulation' }}
                        >
                          {item}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* ─── Bottom bar ─── */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-3 py-5 sm:py-6"
          style={{
            borderTop: '1px solid rgba(212,175,55,0.07)',
            // Safe area + sticky CTA clearance on mobile
            paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 20px)',
          }}
        >
          <p className="text-white/20 text-[0.56rem] tracking-[0.12em] font-body text-center sm:text-left">
            © 2031–2026 TimeTravel Agency. All temporal rights reserved.
          </p>
          <nav aria-label="Legal links" className="flex flex-wrap items-center justify-center gap-4 sm:gap-5">
            {['Privacy Policy', 'Terms of Travel', 'Temporal Ethics'].map((item) => (
              <Link
                key={item}
                href="#"
                className="text-white/20 hover:text-white/45 text-[0.53rem] tracking-[0.1em] font-body transition-colors duration-300"
                style={{ touchAction: 'manipulation' }}
              >
                {item}
              </Link>
            ))}
          </nav>
        </div>

        {/* Extra bottom spacing for mobile sticky CTA */}
        <div className="md:hidden h-20" aria-hidden="true" />
      </div>
    </footer>
  )
}

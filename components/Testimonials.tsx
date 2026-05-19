'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

const testimonials = [
  {
    id: 1,
    quote: 'Standing at the base of the Eiffel Tower on the night of its inauguration, champagne in hand, surrounded by the luminaries of the Belle Époque — there are no words. TimeTravel Agency did not simply meet expectations; they redefined what is possible.',
    author: 'Victoria Ashworth',
    title: 'Countess of Marlborough',
    journey: 'Paris 1889',
    year: '2024',
    rating: 5,
    initials: 'VA',
    accentColor: 'rgba(212,175,55,',
  },
  {
    id: 2,
    quote: 'I have climbed Everest and dived the Mariana Trench. Nothing — nothing — compares to watching a Tyrannosaur move across the late afternoon mist from inside the observation pod. The quantum shield held perfectly. I have never felt more alive.',
    author: 'Dr. Sebastian Crane',
    title: 'Palaeontologist & Venture Partner',
    journey: 'Cretaceous Period',
    year: '2023',
    rating: 5,
    initials: 'SC',
    accentColor: 'rgba(180,140,60,',
  },
  {
    id: 3,
    quote: "Michelangelo himself walked past us — close enough to touch. The light in that Florentine studio, the smell of marble dust and linseed oil. I returned a changed person. The team's attention to historical authenticity was beyond extraordinary.",
    author: 'Isabella Montague',
    title: 'Art Collector & Philanthropist',
    journey: 'Florence 1504',
    year: '2024',
    rating: 5,
    initials: 'IM',
    accentColor: 'rgba(200,160,45,',
  },
]

function Stars({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: count }).map((_, i) => (
        <motion.svg
          key={i}
          width="11" height="11" viewBox="0 0 12 12" fill="none"
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.06 + 0.3, type: 'spring', stiffness: 300 }}
        >
          <path d="M6 1L7.34 4.38L11 4.85L8.5 7.28L9.18 11L6 9.27L2.82 11L3.5 7.28L1 4.85L4.66 4.38L6 1Z" fill="#D4AF37" />
        </motion.svg>
      ))}
    </div>
  )
}

function TestimonialCard({ t, i }: { t: typeof testimonials[0]; i: number }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 45 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.8, delay: i * 0.14, ease: [0.22, 1, 0.36, 1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="glass relative p-7 lg:p-8 flex flex-col cursor-default"
      style={{
        boxShadow: hovered
          ? `0 20px 70px rgba(0,0,0,0.6), 0 0 40px ${t.accentColor}0.1), 0 0 0 1px ${t.accentColor}0.22)`
          : '0 8px 30px rgba(0,0,0,0.4), 0 0 0 1px rgba(212,175,55,0.07)',
        transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
        transition: 'box-shadow 0.45s ease, transform 0.45s ease',
      }}
    >
      {/* Top shimmer rule */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${t.accentColor}0.55), transparent)` }}
        animate={{ opacity: hovered ? 1 : 0.5 }}
        transition={{ duration: 0.3 }}
      />

      {/* Inner glow on hover */}
      <motion.div
        className="absolute inset-0 pointer-events-none rounded-none"
        style={{ background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${t.accentColor}0.06) 0%, transparent 70%)` }}
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.4 }}
      />

      {/* Decorative quote mark */}
      <div
        className="absolute top-5 right-7 font-black text-[5rem] leading-none pointer-events-none select-none"
        style={{
          fontFamily: 'Georgia, serif',
          color: `${t.accentColor}0.06)`,
          filter: hovered ? `drop-shadow(0 0 20px ${t.accentColor}0.15))` : 'none',
          transition: 'filter 0.4s ease',
        }}
      >
        &rdquo;
      </div>

      {/* Stars */}
      <Stars count={t.rating} />

      {/* Quote text */}
      <p className="text-white/50 text-[0.82rem] font-body font-light leading-[1.9] mt-5 mb-6 flex-1 relative z-10">
        &ldquo;{t.quote}&rdquo;
      </p>

      {/* Divider */}
      <motion.div
        className="h-px mb-5"
        style={{ background: `linear-gradient(to right, ${t.accentColor}0.3), transparent)` }}
        animate={{ width: hovered ? '48px' : '28px' }}
        transition={{ duration: 0.4 }}
      />

      {/* Author row */}
      <div className="flex items-center gap-3 relative z-10">
        <motion.div
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-display text-[0.68rem] font-bold border"
          style={{
            background: `linear-gradient(135deg, ${t.accentColor}0.15), ${t.accentColor}0.05))`,
            borderColor: `${t.accentColor}0.3)`,
            color: '#D4AF37',
          }}
          animate={{
            boxShadow: hovered ? `0 0 16px ${t.accentColor}0.2)` : '0 0 0 transparent',
          }}
        >
          {t.initials}
        </motion.div>

        <div className="flex-1 min-w-0">
          <div className="text-white/78 text-[0.82rem] font-body font-medium leading-tight truncate">{t.author}</div>
          <div className="text-white/28 text-[0.58rem] tracking-[0.08em] font-body truncate mt-0.5">{t.title}</div>
        </div>

        <div className="flex-shrink-0 text-right">
          <div
            className="text-[0.55rem] tracking-[0.1em] font-display uppercase leading-tight"
            style={{ color: `${t.accentColor}0.6)` }}
          >
            {t.journey}
          </div>
          <div className="text-white/18 text-[0.5rem] font-body mt-0.5">{t.year}</div>
        </div>
      </div>
    </motion.div>
  )
}

export default function Testimonials() {
  return (
    <section id="testimonials" className="relative py-28 overflow-hidden" style={{ background: '#020202' }}>
      {/* Grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 88px, rgba(212,175,55,0.012) 88px, rgba(212,175,55,0.012) 89px),' +
            'repeating-linear-gradient(90deg, transparent, transparent 88px, rgba(212,175,55,0.012) 88px, rgba(212,175,55,0.012) 89px)',
        }}
      />
      {/* Center glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 75% 50% at 50% 50%, rgba(212,175,55,0.04) 0%, transparent 70%)' }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-20"
        >
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-gold-500/50" />
            <span className="text-gold-400/55 text-[0.58rem] tracking-[0.38em] font-display uppercase">Verified Travellers</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-gold-500/50" />
          </div>

          <h2
            className="font-display font-black tracking-tight leading-none"
            style={{ fontSize: 'clamp(2.6rem, 5.5vw, 5.5rem)' }}
          >
            <span className="block text-white/88">VOICES FROM</span>
            <span
              className="block gold-text mt-1"
              style={{ filter: 'drop-shadow(0 0 30px rgba(212,175,55,0.25))' }}
            >
              ACROSS TIME
            </span>
          </h2>

          <div className="section-divider mt-10 max-w-[200px] mx-auto" />
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
          {testimonials.map((t, i) => (
            <TestimonialCard key={t.id} t={t} i={i} />
          ))}
        </div>

        {/* Rating footer */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="mt-14 flex items-center justify-center gap-3"
        >
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <svg key={i} width="9" height="9" viewBox="0 0 12 12" fill="#D4AF37">
                <path d="M6 1L7.34 4.38L11 4.85L8.5 7.28L9.18 11L6 9.27L2.82 11L3.5 7.28L1 4.85L4.66 4.38L6 1Z" />
              </svg>
            ))}
          </div>
          <span className="text-white/22 text-[0.58rem] tracking-[0.16em] font-body">4.98 / 5.00 · 847 verified journeys</span>
        </motion.div>
      </div>
    </section>
  )
}

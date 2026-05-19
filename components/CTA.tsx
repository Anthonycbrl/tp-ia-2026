'use client'

import { motion } from 'framer-motion'

export default function CTA() {
  return (
    <section
      id="experiences"
      className="relative py-36 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #020202 0%, #000 35%, #040200 100%)' }}
    >
      {/* Deep radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 100% 70% at 50% 50%, rgba(212,175,55,0.09) 0%, rgba(180,130,30,0.03) 45%, transparent 75%)',
        }}
      />

      {/* Secondary off-center glows */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '10%', left: '15%',
          width: '400px', height: '400px',
          background: 'radial-gradient(circle, rgba(212,175,55,0.04) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: '10%', right: '12%',
          width: '350px', height: '350px',
          background: 'radial-gradient(circle, rgba(180,130,20,0.05) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />

      {/* Animated ring system */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        {[
          { size: 680, dur: 80, dir: 1,  border: 'rgba(212,175,55,0.05)' },
          { size: 520, dur: 55, dir: -1, border: 'rgba(212,175,55,0.07)' },
          { size: 380, dur: 38, dir: 1,  border: 'rgba(212,175,55,0.09)' },
          { size: 240, dur: 25, dir: -1, border: 'rgba(212,175,55,0.12)' },
        ].map(({ size, dur, dir, border }, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: size, height: size,
              top: '50%', left: '50%',
              marginTop: -size / 2, marginLeft: -size / 2,
              border: `1px solid ${border}`,
            }}
            animate={{ rotate: dir * 360 }}
            transition={{ duration: dur, repeat: Infinity, ease: 'linear' }}
          />
        ))}

        {/* Pulsing center dot */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 6, height: 6,
            top: '50%', left: '50%',
            marginTop: -3, marginLeft: -3,
            background: '#D4AF37',
          }}
          animate={{
            boxShadow: [
              '0 0 0 0 rgba(212,175,55,0.6)',
              '0 0 0 18px rgba(212,175,55,0)',
            ],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut' }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 44 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Eyebrow */}
          <div className="flex items-center justify-center gap-3 mb-7">
            <div className="h-px w-14 bg-gradient-to-r from-transparent to-gold-500/45" />
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
              <path d="M10 2L11.5 7.5L17 10L11.5 12.5L10 18L8.5 12.5L3 10L8.5 7.5L10 2Z"
                stroke="#D4AF37" strokeWidth="0.9" fill="rgba(212,175,55,0.1)" />
            </svg>
            <div className="h-px w-14 bg-gradient-to-l from-transparent to-gold-500/45" />
          </div>

          {/* Headline */}
          <h2
            className="font-display font-black leading-none tracking-tight mb-7"
            style={{ fontSize: 'clamp(2.8rem, 6.5vw, 6rem)' }}
          >
            <span
              className="block text-white/88"
              style={{ textShadow: '0 0 60px rgba(212,175,55,0.08)' }}
            >
              YOUR HISTORY
            </span>
            <span
              className="block gold-text mt-1"
              style={{ filter: 'drop-shadow(0 0 35px rgba(212,175,55,0.3)) drop-shadow(0 0 70px rgba(212,175,55,0.12))' }}
            >
              AWAITS
            </span>
          </h2>

          <p className="text-white/38 font-body font-light text-[0.95rem] md:text-[1.05rem] leading-[1.9] max-w-lg mx-auto mb-14 tracking-[0.03em]">
            Fewer than 40 temporal journeys depart each year.
            <br />
            Reserve your consultation with a Senior Temporal Curator.
          </p>

          {/* CTAs */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-14"
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.75, delay: 0.18 }}
          >
            <motion.button
              className="relative px-12 py-4 text-[0.72rem] tracking-[0.24em] font-display font-bold text-black overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #C9A840, #D4AF37, #F5D864, #D4AF37)' }}
              whileHover={{
                scale: 1.03,
                boxShadow: '0 0 40px rgba(212,175,55,0.6), 0 0 80px rgba(212,175,55,0.25), 0 0 140px rgba(212,175,55,0.08)',
              }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 350, damping: 22 }}
            >
              <span className="relative z-10">REQUEST PRIVATE CONSULTATION</span>
              {/* Shimmer sweep */}
              <motion.div
                className="absolute inset-0 skew-x-12"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.28), transparent)' }}
                initial={{ x: '-150%' }}
                animate={{ x: '250%' }}
                transition={{ duration: 2.8, repeat: Infinity, repeatDelay: 3.5, ease: 'easeInOut' }}
              />
            </motion.button>

            <motion.button
              className="text-gold-400/50 hover:text-gold-300 text-[0.68rem] tracking-[0.22em] font-display uppercase transition-colors duration-350 border-b border-gold-500/15 hover:border-gold-400/45 pb-0.5"
              whileHover={{ scale: 1.02 }}
            >
              Download Brochure →
            </motion.button>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.32 }}
            className="flex flex-wrap items-center justify-center gap-7 md:gap-12"
          >
            {[
              { label: 'Quantum-Certified Safe' },
              { label: 'Full Privacy Protocol' },
              { label: 'White Glove Concierge' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2.5">
                <div className="w-px h-3 bg-gold-500/25" />
                <span className="text-white/25 text-[0.58rem] tracking-[0.14em] font-body uppercase">{item.label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

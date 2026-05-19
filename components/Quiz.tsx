'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { EASE } from '@/lib/animations'

// ─── Data ─────────────────────────────────────────────────────────────────────

type Scores = { paris: number; cretaceous: number; florence: number }

interface Option {
  label: string
  sub: string
  trait: string
  scores: Scores
}

interface Question {
  category: string
  prompt: string
  options: Option[]
}

const QUESTIONS: Question[] = [
  {
    category: 'Personality',
    prompt: 'How would those closest to you describe your spirit?',
    options: [
      { label: 'The Adventurer',    sub: 'Drawn to the unprecedented — risk excites, comfort bores you',           trait: 'adventurous',  scores: { paris: 0, florence: 0, cretaceous: 3 } },
      { label: 'The Connoisseur',   sub: 'Refined tastes, depth over breadth — beauty lives in the detail',        trait: 'refined',      scores: { paris: 1, florence: 3, cretaceous: 0 } },
      { label: 'The Romantic',      sub: 'Moved by human stories, beauty, and the sweep of history',               trait: 'romantic',     scores: { paris: 2, florence: 2, cretaceous: 0 } },
      { label: 'The Naturalist',    sub: 'Scientific wonder and deep reverence for the living world',               trait: 'naturalist',   scores: { paris: 0, florence: 1, cretaceous: 3 } },
    ],
  },
  {
    category: 'Interests',
    prompt: 'What calls to your soul most deeply?',
    options: [
      { label: 'Art & Renaissance Mastery', sub: 'The birth of ideas — marble, canvas, and genius in one room',    trait: 'artistic',     scores: { paris: 0, florence: 3, cretaceous: 0 } },
      { label: 'Grand Human Spectacle',     sub: 'Ambition made real — monuments, exhibitions, social theatre',    trait: 'spectacle',    scores: { paris: 3, florence: 1, cretaceous: 0 } },
      { label: 'Primordial Wilderness',     sub: 'Life in its rawest form, untouched and absolute',                trait: 'wild',         scores: { paris: 0, florence: 0, cretaceous: 3 } },
      { label: 'Intellectual Society',      sub: 'Salons, discourse, the finest minds of an era gathered',         trait: 'intellectual', scores: { paris: 2, florence: 2, cretaceous: 0 } },
    ],
  },
  {
    category: 'Travel Style',
    prompt: 'Your ideal journey unfolds as…',
    options: [
      { label: 'Observer from Sanctuary',   sub: 'Watch the world from a place of absolute, private safety',       trait: 'observer',     scores: { paris: 0, florence: 0, cretaceous: 3 } },
      { label: 'Immersed in the Era',       sub: 'Living as the locals did — wardrobes, language, customs',        trait: 'immersive',    scores: { paris: 3, florence: 2, cretaceous: 0 } },
      { label: 'Exclusive Private Access',  sub: 'Behind closed doors where no visitor has ever stood',            trait: 'exclusive',    scores: { paris: 1, florence: 3, cretaceous: 1 } },
      { label: 'Witnessing the Impossible', sub: 'Moments no living person has experienced — the truly unique',    trait: 'impossible',   scores: { paris: 2, florence: 0, cretaceous: 3 } },
    ],
  },
  {
    category: 'Atmosphere',
    prompt: 'The setting that moves you most profoundly…',
    options: [
      { label: 'Gaslit Streets & Iron Towers',   sub: 'The electric hum of a civilisation on the verge of modernity',  trait: 'modern',       scores: { paris: 3, florence: 0, cretaceous: 0 } },
      { label: 'Ancient Beyond Imagination',     sub: 'Sounds and sights that predate all human record',               trait: 'ancient',      scores: { paris: 0, florence: 0, cretaceous: 3 } },
      { label: 'Renaissance Marble & Gold',      sub: 'Candlelit palaces, perfect form, and the air of genius',         trait: 'renaissance',  scores: { paris: 0, florence: 3, cretaceous: 0 } },
      { label: 'Intellectual Electricity',       sub: 'When ideas were dangerous and possibility filled every room',    trait: 'electric',     scores: { paris: 2, florence: 2, cretaceous: 0 } },
    ],
  },
]

type DestKey = 'paris' | 'cretaceous' | 'florence'

const DESTINATIONS: Record<DestKey, {
  title: string; subtitle: string; era: string; price: string
  image: string; tagline: string; accentColor: string
  features: string[]; traitLabels: string[]
}> = {
  paris: {
    title: 'Paris 1889',
    subtitle: 'The World Exhibition',
    era: 'Belle Époque France',
    price: '$2.4M',
    image: '/images/paris.png',
    accentColor: 'rgba(212,175,55,',
    tagline: 'A soul drawn to the heights of human ambition belongs precisely here — at the very moment civilisation declared itself magnificent.',
    features: ['Eiffel Tower Inauguration', 'Belle Époque Wardrobe', 'Private Dinner at Café Anglais'],
    traitLabels: ['Grand Vision', 'Cultural Splendour', 'Human Ambition'],
  },
  cretaceous: {
    title: 'Cretaceous Period',
    subtitle: '65 Million Years BC',
    era: 'Late Cretaceous',
    price: '$8.7M',
    image: '/images/cretace.png',
    accentColor: 'rgba(100,170,60,',
    tagline: 'The wildest spirit belongs not in any human era — but in the age before time itself was counted, where giants still ruled the Earth.',
    features: ['Quantum-Shielded Safari Pod', 'Tyrannosaur Encounter', 'Expert Palaeontologist Guide'],
    traitLabels: ['Untamed Spirit', 'Primordial Wonder', 'The Unprecedented'],
  },
  florence: {
    title: 'Florence 1504',
    subtitle: 'The Renaissance at Its Zenith',
    era: 'Italian Renaissance',
    price: '$3.9M',
    image: '/images/florence.png',
    accentColor: 'rgba(180,140,55,',
    tagline: 'The eye of the connoisseur and the heart of the romantic find their perfect convergence in the studio where the Renaissance breathed its finest hour.',
    features: ["Da Vinci's Studio Access", "Michelangelo's David", 'Medici Court Banquet'],
    traitLabels: ['Artistic Mastery', 'Intellectual Depth', 'Beauty Eternal'],
  },
}

// ─── Scoring ──────────────────────────────────────────────────────────────────

function calculateResult(answers: number[]) {
  const scores: Scores = { paris: 0, cretaceous: 0, florence: 0 }
  answers.forEach((ai, qi) => {
    const s = QUESTIONS[qi].options[ai].scores
    scores.paris      += s.paris
    scores.cretaceous += s.cretaceous
    scores.florence   += s.florence
  })

  const winner = (Object.entries(scores).sort(([, a], [, b]) => b - a)[0][0]) as DestKey
  const total = scores.paris + scores.cretaceous + scores.florence
  const pct = total > 0 ? Math.round(85 + (scores[winner] / total) * 14) : 91

  return { winner, scores, pct }
}

// ─── Transition variants ──────────────────────────────────────────────────────

const slideVariants = {
  enter: (dir: number) => ({ opacity: 0, x: dir * 56, filter: 'blur(6px)' }),
  center: { opacity: 1, x: 0, filter: 'blur(0px)', transition: { duration: 0.52, ease: EASE } },
  exit: (dir: number) => ({ opacity: 0, x: dir * -56, filter: 'blur(6px)', transition: { duration: 0.32, ease: EASE } }),
}

const fadeVariants = {
  hidden: { opacity: 0, y: 24, filter: 'blur(8px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.65, ease: EASE } },
  exit:   { opacity: 0, y: -16, filter: 'blur(6px)', transition: { duration: 0.35, ease: EASE } },
}

// ─── ProgressBar ─────────────────────────────────────────────────────────────

function ProgressBar({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1.5">
        {Array.from({ length: total }).map((_, i) => (
          <motion.div
            key={i}
            className="rounded-full"
            animate={{
              width: i === current ? '24px' : '6px',
              height: '6px',
              background: i < current
                ? 'linear-gradient(90deg, #D4AF37, #F5D864)'
                : i === current
                  ? 'linear-gradient(90deg, #D4AF37, #F5D864)'
                  : 'rgba(255,255,255,0.1)',
            }}
            transition={{ duration: 0.4, ease: EASE }}
          />
        ))}
      </div>
      <span className="text-white/30 text-[0.58rem] tracking-[0.15em] font-body">
        {current + 1} of {total}
      </span>
    </div>
  )
}

// ─── Intro screen ─────────────────────────────────────────────────────────────

function Intro({ onStart }: { onStart: () => void }) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center text-center px-6 py-12 max-w-lg mx-auto"
      variants={fadeVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {/* Animated clock logo */}
      <motion.div
        className="relative w-20 h-20 mb-8 flex-shrink-0"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 240, damping: 18, delay: 0.1 }}
      >
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ border: '1px solid rgba(212,175,55,0.3)' }}
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeOut', delay: 0.8 }}
        />
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, rgba(212,175,55,0.15), rgba(212,175,55,0.04))',
            border: '1px solid rgba(212,175,55,0.3)',
          }}
        >
          <svg viewBox="0 0 40 40" className="w-10 h-10" fill="none">
            <circle cx="20" cy="20" r="14" stroke="#D4AF37" strokeWidth="0.75" strokeDasharray="2.5 2.5" className="animate-spin-slow" />
            <circle cx="20" cy="20" r="8" stroke="#D4AF37" strokeWidth="0.75" strokeDasharray="1.5 4" className="animate-spin-reverse" />
            <circle cx="20" cy="20" r="4" stroke="#D4AF37" strokeWidth="1" />
            <line x1="20" y1="16" x2="20" y2="20" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="20" y1="20" x2="23.5" y2="22.5" stroke="#D4AF37" strokeWidth="1.25" strokeLinecap="round" />
            <circle cx="20" cy="20" r="1" fill="#D4AF37" />
          </svg>
        </div>
      </motion.div>

      {/* Pre-label */}
      <motion.div
        className="flex items-center gap-3 mb-5"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5, ease: EASE }}
      >
        <div className="h-px w-8 bg-gradient-to-r from-transparent to-gold-500/50" />
        <span className="text-gold-400/55 text-[0.55rem] tracking-[0.35em] font-display uppercase">Temporal Destiny</span>
        <div className="h-px w-8 bg-gradient-to-l from-transparent to-gold-500/50" />
      </motion.div>

      {/* Title */}
      <motion.h2
        className="font-display font-black text-3xl sm:text-4xl tracking-tight leading-tight mb-4 gold-text"
        style={{ filter: 'drop-shadow(0 0 30px rgba(212,175,55,0.25))' }}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.65, ease: EASE }}
      >
        Discover Your Perfect Era
      </motion.h2>

      {/* Subtitle */}
      <motion.p
        className="text-white/45 text-sm font-body font-light leading-relaxed mb-10 max-w-sm"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.52, duration: 0.6, ease: EASE }}
      >
        Four questions stand between you and the journey of a lifetime.
        Your answers will reveal which era was made for a soul like yours.
      </motion.p>

      {/* CTA */}
      <motion.button
        onClick={onStart}
        className="relative px-10 py-4 text-[0.72rem] tracking-[0.22em] font-display font-bold text-black overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #D4AF37, #F5D864, #D4AF37)' }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.68, duration: 0.55, ease: EASE }}
        whileHover={{ scale: 1.03, boxShadow: '0 0 40px rgba(212,175,55,0.5), 0 0 80px rgba(212,175,55,0.2)' }}
        whileTap={{ scale: 0.97 }}
      >
        BEGIN THE JOURNEY
        {/* Shimmer */}
        <motion.div
          className="absolute inset-0 skew-x-12 pointer-events-none"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)' }}
          initial={{ x: '-150%' }}
          animate={{ x: '250%' }}
          transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 2.5, ease: 'easeInOut' }}
        />
      </motion.button>

      {/* Duration hint */}
      <motion.p
        className="text-white/20 text-[0.58rem] tracking-[0.12em] font-body mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
      >
        Takes less than 60 seconds
      </motion.p>
    </motion.div>
  )
}

// ─── Question screen ──────────────────────────────────────────────────────────

function QuestionStep({
  question,
  index,
  selected,
  direction,
  onSelect,
}: {
  question: Question
  index: number
  selected: number | null
  direction: number
  onSelect: (i: number) => void
}) {
  const LETTERS = ['A', 'B', 'C', 'D']

  return (
    <motion.div
      key={index}
      custom={direction}
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      className="w-full max-w-2xl mx-auto px-2 sm:px-0"
    >
      {/* Category */}
      <div className="text-gold-400/55 text-[0.58rem] tracking-[0.35em] font-display uppercase mb-4">
        {question.category}
      </div>

      {/* Question */}
      <h3 className="font-display font-bold text-xl sm:text-2xl lg:text-3xl text-white/92 leading-tight tracking-tight mb-8 sm:mb-10">
        {question.prompt}
      </h3>

      {/* Options grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {question.options.map((opt, i) => {
          const isSelected = selected === i
          return (
            <motion.button
              key={i}
              onClick={() => onSelect(i)}
              className="relative text-left p-4 sm:p-5 transition-none group"
              style={{
                background: isSelected
                  ? 'linear-gradient(135deg, rgba(212,175,55,0.12), rgba(212,175,55,0.06))'
                  : 'rgba(255,255,255,0.025)',
                border: isSelected
                  ? '1px solid rgba(212,175,55,0.55)'
                  : '1px solid rgba(255,255,255,0.07)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                touchAction: 'manipulation',
                minHeight: '80px',
              }}
              whileHover={{ scale: 1.015, borderColor: 'rgba(212,175,55,0.35)' }}
              whileTap={{ scale: 0.98 }}
              animate={{
                boxShadow: isSelected
                  ? '0 0 30px rgba(212,175,55,0.12), inset 0 0 20px rgba(212,175,55,0.04)'
                  : '0 0 0 rgba(212,175,55,0)',
              }}
              transition={{ duration: 0.25, ease: EASE }}
            >
              {/* Selected top rule */}
              {isSelected && (
                <motion.div
                  className="absolute top-0 left-0 right-0 h-[1px]"
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.7), transparent)' }}
                  layoutId={`rule-${i}`}
                />
              )}

              <div className="flex items-start gap-3">
                {/* Letter badge */}
                <div
                  className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-[0.6rem] font-display font-bold mt-0.5"
                  style={{
                    background: isSelected
                      ? 'linear-gradient(135deg, #D4AF37, #F5D864)'
                      : 'rgba(212,175,55,0.1)',
                    color: isSelected ? '#000' : 'rgba(212,175,55,0.7)',
                    border: isSelected ? 'none' : '1px solid rgba(212,175,55,0.2)',
                  }}
                >
                  {LETTERS[i]}
                </div>

                <div className="flex-1 min-w-0">
                  <div
                    className="text-sm font-display font-semibold tracking-wide leading-snug mb-1"
                    style={{ color: isSelected ? 'rgba(212,175,55,0.95)' : 'rgba(255,255,255,0.82)' }}
                  >
                    {opt.label}
                  </div>
                  <div className="text-[0.7rem] font-body font-light leading-relaxed text-white/38">
                    {opt.sub}
                  </div>
                </div>
              </div>
            </motion.button>
          )
        })}
      </div>
    </motion.div>
  )
}

// ─── Result screen ────────────────────────────────────────────────────────────

function ResultScreen({
  winner,
  pct,
  onRetake,
  onClose,
}: {
  winner: DestKey
  pct: number
  onRetake: () => void
  onClose: () => void
}) {
  const dest = DESTINATIONS[winner]
  const [displayPct, setDisplayPct] = useState(0)

  // Animate counter up
  useEffect(() => {
    let v = 0
    const target = pct
    const step = () => {
      v = Math.min(v + 2, target)
      setDisplayPct(v)
      if (v < target) requestAnimationFrame(step)
    }
    const t = setTimeout(() => requestAnimationFrame(step), 600)
    return () => clearTimeout(t)
  }, [pct])

  return (
    <motion.div
      className="w-full max-w-3xl mx-auto px-2 sm:px-0"
      variants={fadeVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {/* Destination image card */}
      <motion.div
        className="relative overflow-hidden mb-6 sm:mb-8"
        style={{ aspectRatio: '16/7', minHeight: '200px' }}
        initial={{ scale: 1.04, opacity: 0, filter: 'blur(16px)' }}
        animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
        transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}
      >
        <Image
          src={dest.image}
          alt={dest.title}
          fill
          className="object-cover object-center"
          sizes="(max-width: 768px) 100vw, 768px"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/15" />
        <div className="absolute inset-0 bg-black/25" />

        {/* Destination title overlay */}
        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
          <motion.div
            className="text-gold-400/60 text-[0.55rem] tracking-[0.28em] font-display uppercase mb-1"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5, ease: EASE }}
          >
            {dest.era}
          </motion.div>
          <motion.h2
            className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight leading-none"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6, ease: EASE }}
          >
            {dest.title}
          </motion.h2>
        </div>

        {/* Corner brackets */}
        {[
          'top-4 left-4 border-t border-l',
          'top-4 right-4 border-t border-r',
          'bottom-4 left-4 border-b border-l',
          'bottom-4 right-4 border-b border-r',
        ].map(cls => (
          <div key={cls} className={`absolute w-5 h-5 ${cls}`} style={{ borderColor: 'rgba(212,175,55,0.45)' }} />
        ))}
      </motion.div>

      {/* Match badge + tagline row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mb-6">
        {/* Percentage */}
        <motion.div
          className="flex-shrink-0 flex flex-col items-center justify-center w-20 h-20 rounded-full"
          style={{
            background: `linear-gradient(135deg, ${dest.accentColor}0.18), ${dest.accentColor}0.06))`,
            border: `1px solid ${dest.accentColor}0.35)`,
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 280, damping: 18, delay: 0.55 }}
        >
          <span
            className="font-display font-black text-xl leading-none"
            style={{ color: `${dest.accentColor}0.9)` }}
          >
            {displayPct}%
          </span>
          <span className="text-white/30 text-[0.48rem] tracking-[0.1em] font-body uppercase mt-0.5">match</span>
        </motion.div>

        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7, duration: 0.6, ease: EASE }}
        >
          <div className="text-white/28 text-[0.58rem] tracking-[0.2em] font-display uppercase mb-1.5">
            Your Era Has Been Revealed
          </div>
          <p className="text-white/65 text-sm font-body font-light leading-relaxed max-w-sm">
            {dest.tagline}
          </p>
        </motion.div>
      </div>

      {/* Traits */}
      <motion.div
        className="flex flex-wrap gap-2 mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5, ease: EASE }}
      >
        {dest.traitLabels.map(trait => (
          <div
            key={trait}
            className="px-3 py-1 text-[0.6rem] tracking-[0.1em] font-display uppercase"
            style={{
              background: `${dest.accentColor}0.08)`,
              border: `1px solid ${dest.accentColor}0.25)`,
              color: `${dest.accentColor}0.8)`,
            }}
          >
            {trait}
          </div>
        ))}
      </motion.div>

      {/* Features + Price */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.88, duration: 0.55, ease: EASE }}
      >
        {/* Features */}
        <div
          className="p-4 sm:p-5"
          style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <div className="text-white/28 text-[0.55rem] tracking-[0.2em] font-display uppercase mb-3">
            Included
          </div>
          <div className="flex flex-col gap-2">
            {dest.features.map(f => (
              <div key={f} className="flex items-center gap-2">
                <div
                  className="w-1 h-1 rounded-full flex-shrink-0"
                  style={{ background: `${dest.accentColor}0.7)` }}
                />
                <span className="text-white/55 text-[0.72rem] font-body">{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Price */}
        <div
          className="p-4 sm:p-5 flex flex-col justify-between"
          style={{
            background: `${dest.accentColor}0.05)`,
            border: `1px solid ${dest.accentColor}0.18)`,
            backdropFilter: 'blur(12px)',
          }}
        >
          <div>
            <div className="text-white/28 text-[0.55rem] tracking-[0.2em] font-display uppercase mb-2">
              Starting From
            </div>
            <div
              className="font-display font-black text-3xl leading-none mb-1"
              style={{ color: `${dest.accentColor}0.9)`, filter: `drop-shadow(0 0 12px ${dest.accentColor}0.3))` }}
            >
              {dest.price}
            </div>
            <div className="text-white/28 text-[0.6rem] font-body">per temporal journey</div>
          </div>
          <div className="text-white/22 text-[0.58rem] font-body mt-4 leading-relaxed">
            Includes equipment, period attire, guides, and a five-star pre-departure retreat.
          </div>
        </div>
      </motion.div>

      {/* CTA buttons */}
      <motion.div
        className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0, duration: 0.5, ease: EASE }}
      >
        <motion.button
          onClick={onClose}
          className="relative flex-1 sm:flex-none px-8 sm:px-10 py-4 text-[0.7rem] tracking-[0.22em] font-display font-bold text-black overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #D4AF37, #F5D864, #D4AF37)', minHeight: '52px' }}
          whileHover={{ scale: 1.02, boxShadow: '0 0 35px rgba(212,175,55,0.5), 0 0 70px rgba(212,175,55,0.2)' }}
          whileTap={{ scale: 0.97 }}
        >
          BEGIN THIS JOURNEY
          <motion.div
            className="absolute inset-0 skew-x-12 pointer-events-none"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)' }}
            initial={{ x: '-150%' }}
            animate={{ x: '250%' }}
            transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 3, ease: 'easeInOut' }}
          />
        </motion.button>

        <motion.button
          onClick={onRetake}
          className="px-8 py-4 text-[0.68rem] tracking-[0.2em] font-display text-gold-400/55 border border-gold-500/18 hover:border-gold-400/40 hover:text-gold-400/80 transition-colors duration-300"
          style={{ minHeight: '52px', touchAction: 'manipulation' }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
        >
          Retake Quiz
        </motion.button>
      </motion.div>
    </motion.div>
  )
}

// ─── Main Quiz modal ──────────────────────────────────────────────────────────

function QuizModal({ onClose }: { onClose: () => void }) {
  type Stage = 'intro' | 'questions' | 'result'
  const [stage, setStage]       = useState<Stage>('intro')
  const [current, setCurrent]   = useState(0)
  const [answers, setAnswers]   = useState<(number | null)[]>(Array(QUESTIONS.length).fill(null))
  const [direction, setDirection] = useState(1)
  const [result, setResult]     = useState<{ winner: DestKey; pct: number } | null>(null)

  const handleStart = () => setStage('questions')

  const handleSelect = useCallback((optionIndex: number) => {
    const next = [...answers]
    next[current] = optionIndex
    setAnswers(next)

    const delay = 420 // brief pause so selection is visible before advancing

    if (current < QUESTIONS.length - 1) {
      setTimeout(() => {
        setDirection(1)
        setCurrent(c => c + 1)
      }, delay)
    } else {
      setTimeout(() => {
        const finalAnswers = next.map((a, i) => (a !== null ? a : 0))
        const { winner, pct } = calculateResult(finalAnswers)
        setResult({ winner, pct })
        setStage('result')
      }, delay)
    }
  }, [answers, current])

  const handleRetake = () => {
    setAnswers(Array(QUESTIONS.length).fill(null))
    setCurrent(0)
    setDirection(-1)
    setResult(null)
    setStage('intro')
  }

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: EASE }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 cursor-pointer"
        style={{ background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      />

      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(212,175,55,0.05) 0%, transparent 70%)' }}
      />

      {/* Modal panel */}
      <motion.div
        className="relative z-10 flex flex-col w-full max-w-3xl mx-auto my-auto px-4 sm:px-8 py-6 sm:py-10"
        style={{ maxHeight: '100dvh', overflowY: 'auto' }}
        initial={{ y: 30, opacity: 0, scale: 0.97 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, ease: EASE, delay: 0.08 }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header bar */}
        <div className="flex items-center justify-between mb-8 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-px h-4 bg-gold-500/35" />
            <span className="text-gold-400/50 text-[0.55rem] tracking-[0.3em] font-display uppercase">
              TimeTravel Agency
            </span>
          </div>

          <div className="flex items-center gap-4">
            {stage === 'questions' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <ProgressBar current={current} total={QUESTIONS.length} />
              </motion.div>
            )}

            <motion.button
              onClick={onClose}
              aria-label="Close quiz"
              className="text-white/28 hover:text-white/65 transition-colors"
              style={{ padding: '8px', margin: '-8px', touchAction: 'manipulation' }}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg width="14" height="14" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                <line x1="1" y1="1" x2="11" y2="11" />
                <line x1="11" y1="1" x2="1" y2="11" />
              </svg>
            </motion.button>
          </div>
        </div>

        {/* Stage content */}
        <div className="flex-1 flex items-center justify-center min-h-0">
          <AnimatePresence mode="wait" custom={direction}>
            {stage === 'intro' && (
              <motion.div key="intro" className="w-full">
                <Intro onStart={handleStart} />
              </motion.div>
            )}

            {stage === 'questions' && (
              <QuestionStep
                key={`q-${current}`}
                question={QUESTIONS[current]}
                index={current}
                selected={answers[current] ?? null}
                direction={direction}
                onSelect={handleSelect}
              />
            )}

            {stage === 'result' && result && (
              <motion.div key="result" className="w-full" variants={fadeVariants} initial="hidden" animate="visible" exit="exit">
                <ResultScreen
                  winner={result.winner}
                  pct={result.pct}
                  onRetake={handleRetake}
                  onClose={onClose}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Trigger section (rendered inline on the page) ────────────────────────────

export default function Quiz() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* ── In-page trigger section ── */}
      <section className="relative py-16 sm:py-20 overflow-hidden" style={{ background: '#010101' }}>
        {/* Subtle center glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 80% at 50% 50%, rgba(212,175,55,0.04) 0%, transparent 70%)' }}
        />

        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            {/* Eyebrow */}
            <div className="flex items-center justify-center gap-3 mb-5">
              <div className="h-px w-10 bg-gradient-to-r from-transparent to-gold-500/45" />
              <span className="text-gold-400/50 text-[0.55rem] tracking-[0.38em] font-display uppercase">
                Discover Your Era
              </span>
              <div className="h-px w-10 bg-gradient-to-l from-transparent to-gold-500/45" />
            </div>

            <h2
              className="font-display font-black tracking-tight leading-none mb-4"
              style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}
            >
              <span className="block text-white/85">Which Era</span>
              <span
                className="block gold-text"
                style={{ filter: 'drop-shadow(0 0 20px rgba(212,175,55,0.2))' }}
              >
                Was Made for You?
              </span>
            </h2>

            <p className="text-white/35 font-body font-light text-sm leading-relaxed max-w-sm mx-auto mb-8">
              Four questions. One personalised revelation.
              Your perfect era has been waiting since before you were born.
            </p>

            <motion.button
              onClick={() => setOpen(true)}
              className="relative inline-flex items-center gap-3 px-8 py-3.5 text-[0.68rem] tracking-[0.2em] font-display font-semibold text-gold-400 border border-gold-500/30 overflow-hidden group"
              style={{ touchAction: 'manipulation' }}
              whileHover={{
                scale: 1.03,
                borderColor: 'rgba(212,175,55,0.6)',
                boxShadow: '0 0 25px rgba(212,175,55,0.18), inset 0 0 20px rgba(212,175,55,0.04)',
              }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 380, damping: 25 }}
            >
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none" className="text-gold-500/70">
                <path d="M10 2L11.5 7.5L17 10L11.5 12.5L10 18L8.5 12.5L3 10L8.5 7.5L10 2Z"
                  stroke="currentColor" strokeWidth="0.9" fill="rgba(212,175,55,0.1)" />
              </svg>
              FIND MY DESTINATION
              <div className="absolute inset-0 bg-gold-500/0 group-hover:bg-gold-500/[0.05] transition-colors duration-400" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* ── Quiz modal overlay ── */}
      <AnimatePresence>
        {open && <QuizModal key="quiz-modal" onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </>
  )
}

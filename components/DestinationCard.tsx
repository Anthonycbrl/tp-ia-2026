'use client'

import { useRef, useState } from 'react'
import { motion, AnimatePresence, useSpring, useMotionValue } from 'framer-motion'
import Image from 'next/image'

interface Destination {
  id: number; title: string; subtitle: string; era: string; year: string
  description: string; price: string; priceNote: string; image: string
  features: string[]; coordinates: string
}

export default function DestinationCard({ destination, index }: { destination: Destination; index: number }) {
  const cardRef = useRef<HTMLElement>(null)
  const [hovered, setHovered] = useState(false)
  const [shine, setShine] = useState({ x: 50, y: 50 })

  // Spring-driven 3D tilt
  const rotX = useSpring(0, { stiffness: 180, damping: 22 })
  const rotY = useSpring(0, { stiffness: 180, damping: 22 })

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    rotX.set((0.5 - y) * 14)
    rotY.set((x - 0.5) * 14)
    setShine({ x: x * 100, y: y * 100 })
  }

  const handleMouseLeave = () => {
    rotX.set(0)
    rotY.set(0)
    setHovered(false)
  }

  return (
    // Outer wrapper gives the perspective context
    <div style={{ perspective: '1100px' }}>
      <motion.article
        ref={cardRef}
        initial={{ opacity: 0, y: 55 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.85, delay: index * 0.14, ease: [0.22, 1, 0.36, 1] }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleMouseLeave}
        className="relative overflow-hidden cursor-pointer will-change-transform"
        style={{
          aspectRatio: '3/4',
          rotateX: rotX,
          rotateY: rotY,
          boxShadow: hovered
            ? '0 30px 90px rgba(0,0,0,0.85), 0 0 50px rgba(212,175,55,0.14), 0 0 0 1px rgba(212,175,55,0.2)'
            : '0 10px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(212,175,55,0.06)',
          transition: 'box-shadow 0.5s ease',
        }}
      >
        {/* ─── Image layer ─── */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute inset-0"
            animate={{ scale: hovered ? 1.07 : 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src={destination.image}
              alt={destination.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </motion.div>

          {/* Static tonal overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-black/20" />
          <div className="absolute inset-0 bg-black/25" />

          {/* Hover darkness deepens */}
          <motion.div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 55%, rgba(10,8,2,0.05) 100%)' }}
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />

          {/* Specular mouse-position highlight */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(circle at ${shine.x}% ${shine.y}%, rgba(212,175,55,0.09) 0%, transparent 55%)`,
              opacity: hovered ? 1 : 0,
              transition: 'opacity 0.3s ease',
            }}
          />

          {/* Light sweep on enter */}
          <AnimatePresence>
            {hovered && (
              <motion.div
                key="sweep"
                className="absolute inset-0 pointer-events-none"
                style={{ background: 'linear-gradient(115deg, transparent 20%, rgba(212,175,55,0.07) 50%, transparent 80%)' }}
                initial={{ x: '-100%', skewX: -15 }}
                animate={{ x: '200%' }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
              />
            )}
          </AnimatePresence>
        </div>

        {/* ─── Top gold rule ─── */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-[2px] z-20 origin-center"
          style={{ background: 'linear-gradient(90deg, transparent, #D4AF37, #F5D864, #D4AF37, transparent)' }}
          animate={{ scaleX: hovered ? 1 : 0, opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        />

        {/* ─── Corner brackets ─── */}
        {[
          { pos: 'top-4 left-4', borders: 'border-t border-l' },
          { pos: 'top-4 right-4', borders: 'border-t border-r' },
          { pos: 'bottom-4 left-4', borders: 'border-b border-l' },
          { pos: 'bottom-4 right-4', borders: 'border-b border-r' },
        ].map(({ pos, borders }) => (
          <motion.div
            key={pos}
            className={`absolute w-5 h-5 z-10 ${pos} ${borders}`}
            animate={{ borderColor: hovered ? 'rgba(212,175,55,0.75)' : 'rgba(212,175,55,0.35)' }}
            transition={{ duration: 0.3 }}
          />
        ))}

        {/* ─── Era badge ─── */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 z-20">
          <motion.div
            className="px-3.5 py-1.5 text-[0.52rem] tracking-[0.28em] font-display text-gold-400/75 border border-gold-500/18 backdrop-blur-md uppercase whitespace-nowrap"
            style={{ background: 'rgba(0,0,0,0.45)' }}
            animate={{ borderColor: hovered ? 'rgba(212,175,55,0.4)' : 'rgba(212,175,55,0.18)' }}
          >
            {destination.era}
          </motion.div>
        </div>

        {/* ─── Bottom content ─── */}
        <div className="absolute inset-x-0 bottom-0 z-20 p-6 lg:p-7">
          {/* Year */}
          <motion.div
            className="text-[0.58rem] tracking-[0.22em] font-display mb-1.5"
            animate={{ color: hovered ? 'rgba(212,175,55,0.8)' : 'rgba(212,175,55,0.5)' }}
          >
            {destination.year}
          </motion.div>

          {/* Title */}
          <h3 className="font-display text-xl lg:text-[1.35rem] font-bold text-white mb-0.5 tracking-wide leading-tight">
            {destination.title}
          </h3>
          <p className="text-white/38 text-[0.7rem] tracking-[0.1em] font-body mb-3">{destination.subtitle}</p>

          {/* Animated separator */}
          <motion.div
            className="h-px mb-4 bg-gradient-to-r from-gold-500/50 to-transparent"
            animate={{ width: hovered ? '48px' : '28px' }}
            transition={{ duration: 0.4 }}
          />

          {/* Description + features — expand on hover */}
          <AnimatePresence initial={false}>
            {hovered && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="text-white/58 text-[0.8rem] font-body font-light leading-relaxed mb-4">
                  {destination.description}
                </p>
                <div className="flex flex-col gap-1.5 mb-5">
                  {destination.features.map((f, fi) => (
                    <motion.div
                      key={f}
                      className="flex items-center gap-2.5"
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: fi * 0.06 + 0.1 }}
                    >
                      <div className="w-[3px] h-[3px] rounded-full bg-gold-400 flex-shrink-0" />
                      <span className="text-white/48 text-[0.67rem] tracking-[0.08em] font-body">{f}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Price + CTA */}
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="text-white/25 text-[0.52rem] tracking-[0.15em] font-body uppercase mb-0.5">From</div>
              <motion.div
                className="font-display text-xl font-black leading-none"
                style={{ background: 'linear-gradient(135deg, #D4AF37, #F5D864)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
                animate={{ filter: hovered ? 'drop-shadow(0 0 8px rgba(212,175,55,0.4))' : 'none' }}
              >
                {destination.price}
              </motion.div>
              <div className="text-white/20 text-[0.52rem] tracking-[0.08em] font-body mt-0.5">{destination.priceNote}</div>
            </div>

            <motion.button
              className="relative flex-shrink-0 px-4 py-2.5 text-[0.6rem] tracking-[0.16em] font-display font-semibold overflow-hidden"
              animate={{
                background: hovered ? 'linear-gradient(135deg, #D4AF37, #F5D864)' : 'transparent',
                color: hovered ? '#000' : 'rgba(212,175,55,0.75)',
                borderColor: hovered ? 'rgba(212,175,55,0.8)' : 'rgba(212,175,55,0.38)',
                boxShadow: hovered ? '0 0 20px rgba(212,175,55,0.3)' : '0 0 0 rgba(212,175,55,0)',
              }}
              style={{ border: '1px solid rgba(212,175,55,0.38)' }}
              whileTap={{ scale: 0.96 }}
              transition={{ duration: 0.25 }}
            >
              EXPLORE TIMELINE
            </motion.button>
          </div>

          {/* Coordinates */}
          <div className="mt-3.5 text-white/18 text-[0.52rem] tracking-[0.1em] font-body">
            {destination.coordinates}
          </div>
        </div>
      </motion.article>
    </div>
  )
}

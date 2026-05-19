'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import DestinationCard from './DestinationCard'

const destinations = [
  {
    id: 1,
    title: 'Paris 1889',
    subtitle: 'The World Exhibition',
    era: 'Belle Époque France',
    year: '1889 A.D.',
    description:
      'Witness Gustave Eiffel unveil his towering iron masterpiece. Dine with intellectuals at Café Procope, stroll along Haussmann boulevards, and attend the inaugural Universal Exhibition — all at the zenith of civilisation.',
    price: '$2.4M',
    priceNote: 'per temporal journey',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=900&q=85',
    features: ['Eiffel Tower VIP Unveiling', 'Belle Époque Wardrobe', 'Language Immersion'],
    coordinates: '48.8584° N, 2.2945° E · Paris, France',
  },
  {
    id: 2,
    title: 'Cretaceous Period',
    subtitle: '65 Million Years BC',
    era: 'Late Cretaceous',
    year: '−65,000,000 B.C.',
    description:
      'Walk alongside the last great titans of Earth in an untouched prehistoric paradise. Our quantum-shielded observation pods guarantee absolute safety as you witness the most majestic creatures to ever roam this planet.',
    price: '$8.7M',
    priceNote: 'per temporal journey',
    image: 'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=900&q=85',
    features: ['Armoured Quantum-Shield Pod', 'Expert Paleontologist Guide', 'Full Sensory Immersion'],
    coordinates: 'Laurasia Supercontinent · Tethys Sea Region',
  },
  {
    id: 3,
    title: 'Florence 1504',
    subtitle: 'The Renaissance at Its Peak',
    era: 'Italian Renaissance',
    year: '1504 A.D.',
    description:
      'Stand in Leonardo da Vinci\'s studio as he finishes his final masterworks. Observe Michelangelo complete the David. Attend a Medici banquet and experience the birth of the modern world in magnificent Florentine splendour.',
    price: '$3.9M',
    priceNote: 'per temporal journey',
    image: 'https://images.unsplash.com/photo-1534214526114-0ea4d47b04f2?w=900&q=85',
    features: ['Da Vinci Studio Private Access', 'Renaissance Banquet', 'Medici Court Audience'],
    coordinates: '43.7696° N, 11.2558° E · Florence, Italy',
  },
]

export default function Destinations() {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] })
  const yHeader = useTransform(scrollYProgress, [0, 1], ['-6%', '6%'])

  return (
    <section ref={sectionRef} id="destinations" className="relative py-28 bg-black overflow-hidden">
      {/* Background elements */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% 50%, rgba(212,175,55,0.04) 0%, transparent 70%)',
        }}
      />
      {/* Side depth glows */}
      <div className="absolute inset-y-0 left-0 w-64 pointer-events-none" style={{ background: 'linear-gradient(to right, rgba(212,175,55,0.025), transparent)' }} />
      <div className="absolute inset-y-0 right-0 w-64 pointer-events-none" style={{ background: 'linear-gradient(to left, rgba(212,175,55,0.025), transparent)' }} />

      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Section header with subtle parallax */}
        <motion.div
          style={{ y: yHeader }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center justify-center gap-3 mb-5">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-gold-500/50" />
              <span className="text-gold-400/55 text-[0.58rem] tracking-[0.38em] font-display uppercase">Curated Journeys</span>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-gold-500/50" />
            </div>

            <h2
              className="font-display font-black tracking-tight leading-none mb-6"
              style={{ fontSize: 'clamp(2.8rem, 6vw, 6rem)' }}
            >
              <span className="block text-white/88">PREMIER</span>
              <span
                className="block gold-text mt-1"
                style={{ filter: 'drop-shadow(0 0 30px rgba(212,175,55,0.22))' }}
              >
                DESTINATIONS
              </span>
            </h2>

            <p className="text-white/38 font-body font-light text-[0.9rem] max-w-sm mx-auto leading-[1.85] tracking-[0.03em]">
              Each journey is a bespoke, once-in-existence experience meticulously orchestrated by our temporal curators.
            </p>

            <div className="section-divider mt-10 max-w-[180px] mx-auto" />
          </motion.div>
        </motion.div>

        {/* Destination cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
          {destinations.map((dest, i) => (
            <DestinationCard key={dest.id} destination={dest} index={i} />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mt-14 text-center"
        >
          <p className="text-white/25 text-[0.68rem] tracking-[0.15em] font-body mb-4">
            12 additional eras available upon private consultation
          </p>
          <button className="text-gold-400/60 hover:text-gold-400 text-[0.68rem] tracking-[0.2em] font-display uppercase border-b border-gold-500/20 hover:border-gold-400/50 transition-all duration-300 pb-0.5">
            View All Destinations →
          </button>
        </motion.div>
      </div>
    </section>
  )
}

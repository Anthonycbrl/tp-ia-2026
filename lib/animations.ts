import type { Variants } from 'framer-motion'

// ── Easing curve shared across all cinematic animations ──────────────────────
export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

// ── Fade up with defocus blur — standard content reveal ──────────────────────
export const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 28, filter: 'blur(5px)' },
  visible: {
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { duration: 0.7, ease: EASE },
  },
}

// ── Pure fade — for ambient background elements ──────────────────────────────
export const fadeIn: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.85, ease: EASE } },
}

// ── Text word reveal — requires parent with overflow:hidden ──────────────────
export const wordSlideUp: Variants = {
  hidden:  { y: '112%' },
  visible: { y: '0%', transition: { duration: 0.7, ease: EASE } },
}

// ── Decorative separator line — grows from one end ──────────────────────────
// Set style={{ transformOrigin: 'left' | 'right' }} on the element
export const lineExpand: Variants = {
  hidden:  { scaleX: 0, opacity: 0 },
  visible: { scaleX: 1, opacity: 1, transition: { duration: 0.55, ease: EASE } },
}

// ── Card entrance — offset + scale for depth ─────────────────────────────────
export const cardSlideUp: Variants = {
  hidden:  { opacity: 0, y: 52, scale: 0.975 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.72, ease: EASE },
  },
}

// ── Badge / tag reveal — gentle float up ─────────────────────────────────────
export const badgeReveal: Variants = {
  hidden:  { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
}

// ── Stagger container factory ─────────────────────────────────────────────────
export function staggerChildren(stagger = 0.12, delayChildren = 0.1): Variants {
  return {
    hidden:  {},
    visible: { transition: { staggerChildren: stagger, delayChildren } },
  }
}

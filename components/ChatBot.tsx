'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Message {
  id: number
  role: 'user' | 'assistant'
  text: string
}

const BOT: Record<string, string> = {
  default: 'Welcome to TimeTravel Agency. I am your AI temporal concierge. How may I assist you today? You may ask about our destinations, pricing, safety protocols, or booking process.',
  paris: "Paris 1889 is one of our most coveted journeys. You'll witness the Eiffel Tower's inauguration at the World Exhibition. Includes period-accurate wardrobe, language immersion, and a private dinner at Café Anglais. Pricing starts at $2.4M.",
  cretaceous: "Our Cretaceous expedition is for the truly adventurous. You'll explore in a quantum-shielded observation pod with a dedicated palaeontologist. Triceratops, Pterosaurs, Tyrannosaurus Rex — all in their natural habitat. From $8.7M.",
  florence: "Florence 1504 is the Renaissance at its zenith. We arrange private access to Da Vinci's studio, the chance to observe Michelangelo completing the David, and a Medici court banquet. From $3.9M.",
  safe: "Safety is paramount. Every journey uses quantum chronological shielding, certified by the Temporal Ethics Board. Our safe-return rate is 99.9% across 847 completed journeys.",
  book: "To begin, we require a private consultation with a Senior Temporal Curator. Complimentary and confidential — we typically have availability within 2–3 weeks. Shall I arrange one?",
  price: "Journeys begin at $2.4M (Paris 1889) and reach $8.7M (Cretaceous Period). Each price includes all temporal equipment, period attire, expert guides, and a 5-star pre-departure retreat.",
}

const QUICK = ['Paris 1889', 'Cretaceous', 'Florence 1504', 'Is it safe?', 'How to book?', 'Pricing']

function getReply(text: string): string {
  const t = text.toLowerCase()
  if (t.includes('paris') || t.includes('1889') || t.includes('eiffel')) return BOT.paris
  if (t.includes('cretaceous') || t.includes('dinosaur') || t.includes('prehistoric')) return BOT.cretaceous
  if (t.includes('florence') || t.includes('1504') || t.includes('renaissance') || t.includes('vinci')) return BOT.florence
  if (t.includes('safe') || t.includes('danger') || t.includes('risk')) return BOT.safe
  if (t.includes('book') || t.includes('reserv') || t.includes('consult')) return BOT.book
  if (t.includes('price') || t.includes('cost') || t.includes('how much') || t.includes('pricing')) return BOT.price
  return BOT.default
}

export default function ChatBot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([{ id: 0, role: 'assistant', text: BOT.default }])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const idRef = useRef(1)

  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
      // Short delay to let animation finish before focusing
      setTimeout(() => inputRef.current?.focus(), 350)
    }
  }, [messages, open])

  const send = async (text: string) => {
    if (!text.trim()) return
    setMessages(prev => [...prev, { id: idRef.current++, role: 'user', text: text.trim() }])
    setInput('')
    setTyping(true)
    await new Promise(r => setTimeout(r, 1100 + Math.random() * 600))
    setTyping(false)
    setMessages(prev => [...prev, { id: idRef.current++, role: 'assistant', text: getReply(text) }])
  }

  const onSubmit = (e: React.FormEvent) => { e.preventDefault(); send(input) }

  return (
    <>
      {/* ─── Chat window ─── */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="chatwindow"
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            role="dialog"
            aria-label="Temporal concierge chat"
            aria-modal="true"
            className={[
              'fixed z-50 flex flex-col glass-dark overflow-hidden',
              // Mobile: full-width, above sticky CTA + FAB
              'inset-x-3 bottom-[160px]',
              // sm+: right-anchored, fixed width, above FAB only
              'sm:left-auto sm:right-5 sm:w-80',
              // md+: wider
              'md:w-96',
            ].join(' ')}
            style={{
              maxHeight: 'min(500px, calc(100dvh - 200px))',
              border: '1px solid rgba(212,175,55,0.18)',
              boxShadow: '0 24px 80px rgba(0,0,0,0.75), 0 0 40px rgba(212,175,55,0.06)',
            }}
          >
            {/* Header */}
            <div
              className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
              style={{ borderBottom: '1px solid rgba(212,175,55,0.12)', background: 'rgba(0,0,0,0.45)' }}
            >
              <div className="relative w-8 h-8 flex-shrink-0">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.2), rgba(212,175,55,0.05))', border: '1px solid rgba(212,175,55,0.3)' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.5" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-black" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white/85 text-xs font-display font-semibold tracking-[0.08em]">Temporal Concierge</div>
                <div className="text-white/30 text-[0.55rem] font-body tracking-[0.1em]">AI · Online</div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-white/30 hover:text-white/70 transition-colors p-2 -mr-1"
                aria-label="Close chat"
                style={{ minWidth: '36px', minHeight: '36px', touchAction: 'manipulation' }}
              >
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <line x1="1" y1="1" x2="11" y2="11" /><line x1="11" y1="1" x2="1" y2="11" />
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-0">
              {messages.map(msg => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.28 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[88%] px-3.5 py-2.5 text-[0.78rem] sm:text-xs font-body font-light leading-relaxed ${
                      msg.role === 'user' ? 'text-black' : 'text-white/68'
                    }`}
                    style={
                      msg.role === 'user'
                        ? { background: 'linear-gradient(135deg, #D4AF37, #F5D864)' }
                        : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(212,175,55,0.1)' }
                    }
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              <AnimatePresence>
                {typing && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="flex justify-start"
                  >
                    <div
                      className="px-4 py-3 flex items-center gap-1.5"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(212,175,55,0.1)' }}
                    >
                      {[0, 1, 2].map(i => (
                        <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-gold-500/60"
                          animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
                          transition={{ duration: 0.8, delay: i * 0.18, repeat: Infinity }}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            {/* Quick replies */}
            <div
              className="flex flex-wrap gap-1.5 px-3 py-2.5 flex-shrink-0"
              style={{ borderTop: '1px solid rgba(212,175,55,0.08)' }}
            >
              {QUICK.map(qr => (
                <button
                  key={qr}
                  onClick={() => send(qr)}
                  className="text-[0.58rem] tracking-[0.06em] px-2.5 py-1.5 text-gold-400/58 hover:text-gold-400 active:text-gold-300 font-body transition-colors duration-200 border border-gold-500/14 hover:border-gold-400/35"
                  style={{ minHeight: '28px', touchAction: 'manipulation' }}
                >
                  {qr}
                </button>
              ))}
            </div>

            {/* Input */}
            <form
              onSubmit={onSubmit}
              className="flex items-center gap-2 px-4 py-2.5 flex-shrink-0"
              style={{ borderTop: '1px solid rgba(212,175,55,0.12)', background: 'rgba(0,0,0,0.35)' }}
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask about our journeys…"
                aria-label="Chat message"
                className="flex-1 bg-transparent text-white/70 text-[0.78rem] sm:text-xs font-body placeholder:text-white/20 outline-none tracking-wide"
                style={{ minHeight: '36px' }}
              />
              <motion.button
                type="submit"
                disabled={!input.trim() || typing}
                aria-label="Send message"
                className="w-8 h-8 flex items-center justify-center flex-shrink-0 transition-all duration-200 disabled:opacity-30"
                style={{
                  background: input.trim() ? 'linear-gradient(135deg, #D4AF37, #F5D864)' : 'rgba(212,175,55,0.1)',
                  border: '1px solid rgba(212,175,55,0.3)',
                  minWidth: '32px',
                  minHeight: '32px',
                  touchAction: 'manipulation',
                }}
                whileHover={input.trim() ? { scale: 1.08 } : {}}
                whileTap={input.trim() ? { scale: 0.95 } : {}}
              >
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke={input.trim() ? '#000' : '#D4AF37'} strokeWidth="2" strokeLinecap="round">
                  <line x1="1" y1="11" x2="11" y2="1" /><polyline points="4 1 11 1 11 8" />
                </svg>
              </motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Toggle FAB ─── */}
      {/* Mobile: above sticky CTA. Desktop: near bottom-right. */}
      <motion.button
        onClick={() => setOpen(!open)}
        aria-label={open ? 'Close concierge chat' : 'Open concierge chat'}
        aria-expanded={open}
        className="fixed right-4 z-50 w-14 h-14 flex items-center justify-center shadow-2xl bottom-[88px] md:bottom-5"
        style={{
          background: open ? 'rgba(0,0,0,0.88)' : 'linear-gradient(135deg, #D4AF37, #F5D864)',
          border: '1px solid rgba(212,175,55,0.5)',
          boxShadow: open
            ? '0 8px 32px rgba(0,0,0,0.6)'
            : '0 8px 32px rgba(212,175,55,0.28), 0 0 0 1px rgba(212,175,55,0.15)',
          touchAction: 'manipulation',
        }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        transition={{ type: 'spring', stiffness: 400 }}
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.svg key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.18 }} width="14" height="14" viewBox="0 0 12 12" fill="none" stroke="#D4AF37" strokeWidth="1.5">
              <line x1="1" y1="1" x2="11" y2="11" /><line x1="11" y1="1" x2="1" y2="11" />
            </motion.svg>
          ) : (
            <motion.svg key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.18 }} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="1.8">
              <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
            </motion.svg>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Notification dot */}
      <AnimatePresence>
        {!open && (
          <motion.div
            initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
            className="fixed right-4 z-50 w-2 h-2 rounded-full bg-gold-400 pointer-events-none bottom-[148px] md:bottom-[62px]"
            style={{ boxShadow: '0 0 8px rgba(212,175,55,0.7)' }}
          />
        )}
      </AnimatePresence>
    </>
  )
}

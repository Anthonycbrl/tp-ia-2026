'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Message {
  id: number
  role: 'user' | 'assistant'
  text: string
}

const BOT_RESPONSES: Record<string, string> = {
  default:
    'Welcome to TimeTravel Agency. I am your AI temporal concierge. How may I assist you today? You may ask about our destinations, pricing, safety protocols, or booking process.',
  paris:
    'Paris 1889 is one of our most coveted journeys. You will witness the Eiffel Tower\'s inauguration at the World Exhibition. Journeys depart from our Geneva Temporal Suite and include period-accurate wardrobe, language immersion, and a private dinner at Café Anglais. Pricing starts at $2.4M per traveller.',
  cretaceous:
    'Our Cretaceous expedition is for the truly adventurous. You\'ll be enclosed in a quantum-shielded observation pod with a dedicated palaeontologist. The ecosystem is breathtaking — Triceratops, Pterosaurs, and the Tyrannosaurus Rex in their natural habitat. Pricing from $8.7M. Safety record: perfect.',
  florence:
    'Florence 1504 is the Renaissance at its absolute zenith. We arrange private access to Leonardo da Vinci\'s studio, the chance to observe Michelangelo\'s David in its final stages, and attendance at a Medici court banquet. This journey starts at $3.9M.',
  safe:
    'Safety is our paramount concern. Every journey employs quantum chronological shielding, certified by the Temporal Ethics Board. Our safe-return rate is 99.9% across 847 completed journeys. Each traveller receives a full briefing and is accompanied by a trained temporal guide.',
  book:
    'To begin your booking, we require a private consultation with one of our Senior Temporal Curators. Consultations are complimentary and strictly confidential. Shall I arrange one for you? We typically have availability within 2–3 weeks.',
  price:
    'Our journeys begin at $2.4M (Paris 1889) and reach $8.7M (Cretaceous Period). Each price includes all temporal equipment, period attire, expert guides, and a 5-star pre-departure retreat at our Geneva estate. Payment plans are available for qualifying clients.',
}

const QUICK_REPLIES = [
  'Paris 1889',
  'Cretaceous Period',
  'Florence 1504',
  'Is it safe?',
  'How to book?',
  'Pricing',
]

function getBotReply(text: string): string {
  const lower = text.toLowerCase()
  if (lower.includes('paris') || lower.includes('1889') || lower.includes('eiffel')) return BOT_RESPONSES.paris
  if (lower.includes('cretaceous') || lower.includes('dinosaur') || lower.includes('prehistoric')) return BOT_RESPONSES.cretaceous
  if (lower.includes('florence') || lower.includes('1504') || lower.includes('renaissance') || lower.includes('vinci')) return BOT_RESPONSES.florence
  if (lower.includes('safe') || lower.includes('danger') || lower.includes('risk')) return BOT_RESPONSES.safe
  if (lower.includes('book') || lower.includes('reserv') || lower.includes('consult')) return BOT_RESPONSES.book
  if (lower.includes('price') || lower.includes('cost') || lower.includes('how much') || lower.includes('pricing')) return BOT_RESPONSES.price
  return BOT_RESPONSES.default
}

export default function ChatBot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, role: 'assistant', text: BOT_RESPONSES.default },
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const idRef = useRef(1)

  useEffect(() => {
    if (open) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, open])

  const sendMessage = async (text: string) => {
    if (!text.trim()) return
    const userMsg: Message = { id: idRef.current++, role: 'user', text: text.trim() }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setTyping(true)

    await new Promise((r) => setTimeout(r, 1200 + Math.random() * 600))

    const reply = getBotReply(text)
    setTyping(false)
    setMessages((prev) => [...prev, { id: idRef.current++, role: 'assistant', text: reply }])
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  return (
    <>
      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="chatwindow"
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-24 right-5 z-50 w-80 sm:w-96 flex flex-col rounded-none overflow-hidden glass-dark shadow-2xl"
            style={{
              border: '1px solid rgba(212,175,55,0.18)',
              boxShadow: '0 24px 80px rgba(0,0,0,0.7), 0 0 40px rgba(212,175,55,0.05)',
              maxHeight: '520px',
            }}
          >
            {/* Header */}
            <div
              className="flex items-center gap-3 px-4 py-3.5 flex-shrink-0"
              style={{ borderBottom: '1px solid rgba(212,175,55,0.12)', background: 'rgba(0,0,0,0.4)' }}
            >
              <div className="relative w-8 h-8 flex-shrink-0">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.2), rgba(212,175,55,0.05))', border: '1px solid rgba(212,175,55,0.3)' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
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
                className="text-white/30 hover:text-white/60 transition-colors p-1"
                aria-label="Close chat"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <line x1="1" y1="1" x2="11" y2="11" />
                  <line x1="11" y1="1" x2="1" y2="11" />
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 min-h-0" style={{ maxHeight: '300px' }}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] px-3.5 py-2.5 text-xs font-body font-light leading-relaxed ${
                      msg.role === 'user'
                        ? 'text-black'
                        : 'text-white/70'
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

              {/* Typing indicator */}
              <AnimatePresence>
                {typing && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex justify-start"
                  >
                    <div
                      className="px-4 py-3 flex items-center gap-1.5"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(212,175,55,0.1)' }}
                    >
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-1.5 h-1.5 rounded-full bg-gold-500/60"
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
              className="flex flex-wrap gap-1.5 px-4 py-2 flex-shrink-0"
              style={{ borderTop: '1px solid rgba(212,175,55,0.08)' }}
            >
              {QUICK_REPLIES.map((qr) => (
                <button
                  key={qr}
                  onClick={() => sendMessage(qr)}
                  className="text-[0.6rem] tracking-[0.08em] px-2.5 py-1 text-gold-400/60 hover:text-gold-400 font-body transition-colors duration-200 border border-gold-500/15 hover:border-gold-400/35"
                >
                  {qr}
                </button>
              ))}
            </div>

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2 px-4 py-3 flex-shrink-0"
              style={{ borderTop: '1px solid rgba(212,175,55,0.12)', background: 'rgba(0,0,0,0.3)' }}
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about our journeys..."
                className="flex-1 bg-transparent text-white/70 text-xs font-body placeholder:text-white/20 outline-none tracking-wide"
              />
              <motion.button
                type="submit"
                disabled={!input.trim() || typing}
                className="w-7 h-7 flex items-center justify-center flex-shrink-0 transition-all duration-200 disabled:opacity-30"
                style={{ background: input.trim() ? 'linear-gradient(135deg, #D4AF37, #F5D864)' : 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)' }}
                whileHover={input.trim() ? { scale: 1.08 } : {}}
                whileTap={input.trim() ? { scale: 0.95 } : {}}
              >
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke={input.trim() ? '#000' : '#D4AF37'} strokeWidth="2" strokeLinecap="round">
                  <line x1="1" y1="11" x2="11" y2="1" />
                  <polyline points="4 1 11 1 11 8" />
                </svg>
              </motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle button */}
      <motion.button
        onClick={() => setOpen(!open)}
        className="fixed bottom-5 right-5 z-50 w-14 h-14 flex items-center justify-center shadow-2xl"
        style={{
          background: open
            ? 'rgba(0,0,0,0.8)'
            : 'linear-gradient(135deg, #D4AF37, #F5D864)',
          border: '1px solid rgba(212,175,55,0.5)',
          boxShadow: open
            ? '0 8px 32px rgba(0,0,0,0.6)'
            : '0 8px 32px rgba(212,175,55,0.25), 0 0 0 1px rgba(212,175,55,0.15)',
        }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400 }}
        aria-label="Open AI concierge chat"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.svg
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              width="16" height="16" viewBox="0 0 12 12" fill="none" stroke="#D4AF37" strokeWidth="1.5"
            >
              <line x1="1" y1="1" x2="11" y2="11" />
              <line x1="11" y1="1" x2="1" y2="11" />
            </motion.svg>
          ) : (
            <motion.svg
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="1.8"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </motion.svg>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Notification dot */}
      <AnimatePresence>
        {!open && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="fixed bottom-16 right-5 z-50 w-2 h-2 rounded-full bg-gold-400"
            style={{ boxShadow: '0 0 8px rgba(212,175,55,0.6)' }}
          />
        )}
      </AnimatePresence>
    </>
  )
}

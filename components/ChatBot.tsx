'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { EASE } from '@/lib/animations'

// ─── Types ───────────────────────────────────────────────────────────────────

interface Message {
  id: number
  role: 'user' | 'assistant'
  text: string
  error?: boolean
}

// ─── Constants ───────────────────────────────────────────────────────────────

const WELCOME = "Welcome to TimeTravel Agency. I'm your AI temporal concierge — here to guide you through the finest journeys in human history. How may I assist you today?"

const QUICK_REPLIES = [
  'Paris 1889',
  'Cretaceous Period',
  'Florence 1504',
  'Is it safe?',
  'How to book?',
  'Pricing',
]

// ─── Local fallback responses (used when API is rate-limited or offline) ─────
// Rich, on-brand copy that mirrors the LLM quality.

const LOCAL: Record<string, string> = {
  paris:
    'Paris 1889 is one of our most coveted journeys. You will witness the Eiffel Tower\'s inauguration at the World Exhibition, dine at Café Anglais with the luminaries of the Belle Époque, and receive a complete period wardrobe for the occasion. Priced from $2.4M per traveller.',
  cretaceous:
    'The Cretaceous expedition is reserved for the truly courageous. Your quantum-shielded observation pod ensures absolute safety as a dedicated palaeontologist guides you through encounters with Triceratops, Pterosaurs, and the Tyrannosaurus Rex in their pristine Laurasian habitat. From $8.7M.',
  florence:
    'Florence 1504 places you at the very summit of the Italian Renaissance. We arrange private access to Leonardo da Vinci\'s studio, the chance to watch Michelangelo complete the David, and a Medici court banquet — an evening that shaped the modern world. From $3.9M.',
  safe:
    'Your safety is our highest obligation. Every journey employs quantum chronological shielding certified by the Temporal Ethics Board, and our safe-return rate stands at 99.9% across 847 completed journeys. Each traveller receives a full briefing and is accompanied by a trained temporal guide.',
  book:
    'To begin your journey, we invite you to a private consultation with one of our Senior Temporal Curators — complimentary and strictly confidential. We typically accommodate new clients within 2–3 weeks. Shall I arrange one for you?',
  price:
    'Our journeys begin at $2.4M for Paris 1889 and reach $8.7M for the Cretaceous expedition. Every price encompasses temporal equipment, period-appropriate attire, expert guidance, and a five-star pre-departure retreat at our Geneva estate.',
  default:
    'It would be my pleasure to assist you. I can tell you about our three premiere destinations — Paris 1889, the Cretaceous Period, and Florence 1504 — or guide you through pricing, safety protocols, and the booking process. What would you like to know?',
}

function getLocalReply(text: string): string {
  const t = text.toLowerCase()
  if (t.includes('paris') || t.includes('1889') || t.includes('eiffel') || t.includes('belle époque'))
    return LOCAL.paris
  if (t.includes('cretaceous') || t.includes('dinosaur') || t.includes('prehistoric') || t.includes('tyrannosaur') || t.includes('tricer'))
    return LOCAL.cretaceous
  if (t.includes('florence') || t.includes('1504') || t.includes('renaissance') || t.includes('vinci') || t.includes('michelangelo') || t.includes('medici'))
    return LOCAL.florence
  if (t.includes('safe') || t.includes('danger') || t.includes('risk') || t.includes('return rate'))
    return LOCAL.safe
  if (t.includes('book') || t.includes('reserv') || t.includes('consult') || t.includes('appoint'))
    return LOCAL.book
  if (t.includes('price') || t.includes('cost') || t.includes('how much') || t.includes('million') || t.includes('pricing') || t.includes('$'))
    return LOCAL.price
  return LOCAL.default
}

// ─── Sub-components ──────────────────────────────────────────────────────────

/** AI chip icon with circuit board aesthetics */
function ChipIcon({ size = 22, color = '#D4AF37' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <rect x="8" y="8" width="16" height="16" rx="3" stroke={color} strokeWidth="1.2" />
      {/* side connectors */}
      <line x1="8" y1="13" x2="4" y2="13" stroke={color} strokeWidth="1" strokeLinecap="round" />
      <line x1="8" y1="19" x2="4" y2="19" stroke={color} strokeWidth="1" strokeLinecap="round" />
      <line x1="24" y1="13" x2="28" y2="13" stroke={color} strokeWidth="1" strokeLinecap="round" />
      <line x1="24" y1="19" x2="28" y2="19" stroke={color} strokeWidth="1" strokeLinecap="round" />
      <line x1="13" y1="8" x2="13" y2="4" stroke={color} strokeWidth="1" strokeLinecap="round" />
      <line x1="19" y1="8" x2="19" y2="4" stroke={color} strokeWidth="1" strokeLinecap="round" />
      <line x1="13" y1="24" x2="13" y2="28" stroke={color} strokeWidth="1" strokeLinecap="round" />
      <line x1="19" y1="24" x2="19" y2="28" stroke={color} strokeWidth="1" strokeLinecap="round" />
      {/* core */}
      <circle cx="16" cy="16" r="2.5" stroke={color} strokeWidth="1" fill={`${color}25`} />
      {/* inner circuit pads */}
      <path d="M11 13h2M11 16h2M11 19h2" stroke={color} strokeWidth="0.8" strokeLinecap="round" />
      <path d="M19 13h2M19 16h2M19 19h2" stroke={color} strokeWidth="0.8" strokeLinecap="round" />
    </svg>
  )
}

/** Three-dot typing animation */
function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: 'rgba(212,175,55,0.65)' }}
          animate={{ scale: [0.6, 1.2, 0.6], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.9, delay: i * 0.15, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}

/** Individual message bubble */
function MessageBubble({
  msg,
  isStreaming,
}: {
  msg: Message
  isStreaming: boolean
}) {
  const isUser = msg.role === 'user'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.28, ease: EASE }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      {/* AI avatar dot */}
      {!isUser && (
        <div
          className="w-5 h-5 rounded-full flex-shrink-0 mr-2 mt-1 flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, rgba(212,175,55,0.2), rgba(212,175,55,0.06))',
            border: '1px solid rgba(212,175,55,0.25)',
          }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-gold-500/80" />
        </div>
      )}

      <div
        className="relative max-w-[84%] px-3.5 py-2.5 text-[0.78rem] leading-relaxed"
        style={
          isUser
            ? {
                background: 'linear-gradient(135deg, #B8962E 0%, #D4AF37 45%, #EDD37A 100%)',
                color: '#000',
                fontFamily: 'var(--font-raleway)',
                fontWeight: 500,
                borderRadius: '10px 10px 2px 10px',
              }
            : {
                background: msg.error
                  ? 'rgba(255,60,60,0.08)'
                  : 'rgba(212,175,55,0.05)',
                border: msg.error
                  ? '1px solid rgba(255,60,60,0.2)'
                  : '1px solid rgba(212,175,55,0.1)',
                color: msg.error ? 'rgba(255,150,150,0.85)' : 'rgba(255,255,255,0.72)',
                fontFamily: 'var(--font-raleway)',
                fontWeight: 300,
                borderRadius: '10px 10px 10px 2px',
              }
        }
      >
        {/* Message text */}
        <span>{msg.text}</span>

        {/* Blinking cursor while streaming */}
        {isStreaming && (
          <motion.span
            className="inline-block w-[2px] h-[0.85em] ml-[2px] align-middle"
            style={{ background: 'rgba(212,175,55,0.8)' }}
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.55, repeat: Infinity, ease: 'linear' }}
          />
        )}
      </div>
    </motion.div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ChatBot() {
  const [open, setOpen]               = useState(false)
  const [messages, setMessages]       = useState<Message[]>([{ id: 0, role: 'assistant', text: WELCOME }])
  const [input, setInput]             = useState('')
  const [loading, setLoading]         = useState(false)
  const [streamingId, setStreamingId] = useState<number | null>(null)
  const [inputFocused, setInputFocused] = useState(false)
  const [showQuick, setShowQuick]     = useState(true)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef       = useRef<HTMLInputElement>(null)
  const abortRef       = useRef<AbortController | null>(null)
  const idRef          = useRef(1)

  // Scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  // Focus input on open
  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 360)
      return () => clearTimeout(t)
    }
  }, [open])

  const send = useCallback(async (text: string) => {
    if (!text.trim() || loading) return

    // Cancel any previous in-flight request
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    const userMsg: Message = { id: idRef.current++, role: 'user', text: text.trim() }
    const aId = idRef.current++

    setMessages(prev => [...prev, userMsg, { id: aId, role: 'assistant', text: '' }])
    setInput('')
    setLoading(true)
    setStreamingId(aId)
    setShowQuick(false)

    // Helper: resolve the assistant slot with a given text (no error state)
    const resolve = (reply: string, isError = false) =>
      setMessages(prev =>
        prev.map(m => m.id === aId ? { ...m, text: reply, error: isError } : m),
      )

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          messages: [...messages, userMsg].map(m => ({
            role: m.role,
            content: m.text,
          })),
        }),
      })

      // ── Non-OK responses: use local fallback silently ────────────────────
      if (!res.ok) {
        resolve(getLocalReply(text.trim()))
        return
      }

      const ct = res.headers.get('content-type') ?? ''

      if (ct.includes('text/event-stream')) {
        // ── SSE streaming ────────────────────────────────────────────────────
        const reader = res.body!.getReader()
        const decoder = new TextDecoder()
        let buf = ''
        let receivedAny = false

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buf += decoder.decode(value, { stream: true })
          const lines = buf.split('\n')
          buf = lines.pop() ?? ''

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue
            const data = line.slice(6).trim()
            if (data === '[DONE]') break

            try {
              const parsed = JSON.parse(data)
              if (parsed.error) throw new Error(parsed.error)
              if (parsed.text) {
                receivedAny = true
                setMessages(prev =>
                  prev.map(m => m.id === aId ? { ...m, text: m.text + parsed.text } : m),
                )
              }
            } catch {
              // Malformed or error chunk — skip individual bad chunks
            }
          }
        }

        // If stream produced nothing (model returned empty), use local fallback
        if (!receivedAny) resolve(getLocalReply(text.trim()))
      } else {
        // ── JSON response (non-streaming fallback) ───────────────────────────
        const data = await res.json()
        resolve(data.response ?? getLocalReply(text.trim()))
      }
    } catch (err: unknown) {
      // User intentionally cancelled — silently discard the empty slot
      if ((err as Error).name === 'AbortError') {
        setMessages(prev => prev.filter(m => m.id !== aId))
        return
      }
      // Any network / parsing error → local fallback (never show a broken state)
      resolve(getLocalReply(text.trim()))
    } finally {
      setLoading(false)
      setStreamingId(null)
    }
  }, [loading, messages])

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    send(input)
  }

  const toggleOpen = () => {
    if (open) {
      abortRef.current?.abort()
      setLoading(false)
      setStreamingId(null)
    }
    setOpen(v => !v)
  }

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <>
      {/* ════════════════════════════════════════════
          CHAT WINDOW
      ════════════════════════════════════════════ */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="chatwindow"
            role="dialog"
            aria-label="AI temporal concierge chat"
            aria-modal="true"
            className={[
              'fixed z-50 flex flex-col overflow-hidden',
              // Mobile: near full-width, above sticky CTA + FAB
              'inset-x-3 bottom-[160px]',
              // sm+: fixed-width column, above FAB only
              'sm:left-auto sm:right-5 sm:w-[380px] sm:bottom-24',
              // md+: slightly above sticky nav
              'md:bottom-[88px]',
            ].join(' ')}
            style={{
              background: 'rgba(4, 3, 8, 0.95)',
              backdropFilter: 'blur(40px) saturate(180%)',
              WebkitBackdropFilter: 'blur(40px) saturate(180%)',
              border: '1px solid rgba(212,175,55,0.14)',
              boxShadow: '0 0 0 1px rgba(212,175,55,0.04), 0 48px 120px rgba(0,0,0,0.9), 0 0 80px rgba(212,175,55,0.05)',
              maxHeight: 'min(540px, calc(100dvh - 210px))',
            }}
            initial={{ opacity: 0, y: 20, scale: 0.93 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.93 }}
            transition={{ duration: 0.38, ease: EASE }}
          >
            {/* ── TOP ACCENT LINE ── */}
            <div
              className="absolute top-0 left-0 right-0 h-[1px] z-10"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.55), rgba(245,216,100,0.8), rgba(212,175,55,0.55), transparent)' }}
            />
            {/* Loading scan bar */}
            <AnimatePresence>
              {loading && (
                <motion.div
                  className="absolute top-[1px] left-0 h-[1px] z-20 pointer-events-none"
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.9), transparent)' }}
                  initial={{ x: '-100%', width: '60%' }}
                  animate={{ x: '200%' }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                />
              )}
            </AnimatePresence>

            {/* ── HEADER ── */}
            <div
              className="flex items-center gap-3 px-4 py-3 flex-shrink-0 relative"
              style={{ borderBottom: '1px solid rgba(212,175,55,0.1)', background: 'rgba(0,0,0,0.5)' }}
            >
              {/* AI icon with pulse ring */}
              <div className="relative flex-shrink-0">
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{ border: '1px solid rgba(212,175,55,0.3)' }}
                  animate={{ scale: [1, 1.55, 1], opacity: [0.6, 0, 0.6] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut' }}
                />
                <div
                  className="relative w-9 h-9 rounded-full flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, rgba(212,175,55,0.18), rgba(212,175,55,0.06))',
                    border: '1px solid rgba(212,175,55,0.28)',
                  }}
                >
                  <ChipIcon size={18} />
                </div>
                {/* Online dot */}
                <motion.div
                  className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2"
                  style={{ background: '#10b981', borderColor: 'rgba(4,3,8,1)' }}
                  animate={{ boxShadow: ['0 0 0 0 rgba(16,185,129,0.5)', '0 0 0 4px rgba(16,185,129,0)'] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>

              {/* Labels */}
              <div className="flex-1 min-w-0">
                <div className="text-white/90 text-[0.72rem] font-display font-semibold tracking-[0.12em] leading-tight">
                  CHRONO AI
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="w-1 h-1 rounded-full bg-emerald-400" />
                  <span className="text-white/35 text-[0.52rem] tracking-[0.1em] font-body uppercase">
                    Temporal Concierge · Online
                  </span>
                </div>
              </div>

              {/* Close button */}
              <motion.button
                onClick={toggleOpen}
                aria-label="Close chat"
                className="flex-shrink-0 text-white/28 hover:text-white/70 transition-colors"
                style={{ padding: '8px', margin: '-8px -4px -8px 0', touchAction: 'manipulation' }}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <line x1="1" y1="1" x2="11" y2="11" />
                  <line x1="11" y1="1" x2="1" y2="11" />
                </svg>
              </motion.button>
            </div>

            {/* ── MESSAGES ── */}
            <div
              className="flex-1 overflow-y-auto min-h-0 px-4 py-4 space-y-3"
              style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(212,175,55,0.2) transparent' }}
            >
              {messages.map(msg => (
                <MessageBubble
                  key={msg.id}
                  msg={msg}
                  isStreaming={streamingId === msg.id && msg.role === 'assistant'}
                />
              ))}

              {/* Typing dots — shown before streaming starts */}
              <AnimatePresence>
                {loading && streamingId !== null && messages.find(m => m.id === streamingId)?.text === '' && (
                  <motion.div
                    key="typing"
                    className="flex justify-start"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="w-5 h-5 mr-2" />
                    <div
                      className="rounded-[10px_10px_10px_2px]"
                      style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.1)' }}
                    >
                      <TypingDots />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={messagesEndRef} />
            </div>

            {/* ── QUICK REPLIES ── */}
            <AnimatePresence initial={false}>
              {showQuick && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  className="flex-shrink-0 overflow-hidden"
                  style={{ borderTop: '1px solid rgba(212,175,55,0.08)' }}
                >
                  <div className="flex flex-wrap gap-1.5 px-3 py-2.5">
                    {QUICK_REPLIES.map((qr, i) => (
                      <motion.button
                        key={qr}
                        onClick={() => send(qr)}
                        className="text-[0.57rem] tracking-[0.08em] font-body text-gold-400/55 border border-gold-500/14 px-2.5 py-1.5 transition-all duration-200"
                        style={{ minHeight: '26px', touchAction: 'manipulation', borderRadius: '2px' }}
                        whileHover={{ borderColor: 'rgba(212,175,55,0.45)', color: 'rgba(212,175,55,0.9)' }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04, duration: 0.25 }}
                      >
                        {qr}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── INPUT ── */}
            <form
              onSubmit={onSubmit}
              className="flex items-center gap-2 px-4 flex-shrink-0"
              style={{
                borderTop: '1px solid rgba(212,175,55,0.12)',
                background: 'rgba(0,0,0,0.4)',
                paddingTop: '10px',
                paddingBottom: '12px',
              }}
            >
              {/* Input field with focus glow */}
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                  placeholder="Ask about our journeys…"
                  aria-label="Message"
                  disabled={loading}
                  className="w-full bg-transparent text-white/75 text-[0.78rem] sm:text-[0.8rem] font-body placeholder:text-white/18 outline-none tracking-wide disabled:opacity-40"
                  style={{ minHeight: '36px', caretColor: '#D4AF37' }}
                />
                {/* Bottom border with focus animation */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-px"
                  animate={{
                    background: inputFocused
                      ? 'linear-gradient(90deg, transparent, rgba(212,175,55,0.7), rgba(245,216,100,0.9), rgba(212,175,55,0.7), transparent)'
                      : 'linear-gradient(90deg, transparent, rgba(212,175,55,0.18), transparent)',
                    boxShadow: inputFocused ? '0 0 8px rgba(212,175,55,0.3)' : 'none',
                  }}
                  transition={{ duration: 0.35 }}
                />
              </div>

              {/* Send button */}
              <motion.button
                type="submit"
                disabled={!input.trim() || loading}
                aria-label="Send message"
                className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-opacity disabled:opacity-25"
                style={{
                  background: input.trim() && !loading
                    ? 'linear-gradient(135deg, #C9A840, #D4AF37, #F5D864)'
                    : 'rgba(212,175,55,0.08)',
                  border: '1px solid rgba(212,175,55,0.35)',
                  touchAction: 'manipulation',
                }}
                whileHover={input.trim() && !loading ? { scale: 1.12 } : {}}
                whileTap={input.trim() && !loading ? { scale: 0.92 } : {}}
              >
                <svg
                  width="10" height="10" viewBox="0 0 12 12" fill="none"
                  stroke={input.trim() && !loading ? '#000' : 'rgba(212,175,55,0.6)'}
                  strokeWidth="2" strokeLinecap="round"
                >
                  <line x1="1" y1="11" x2="11" y2="1" />
                  <polyline points="4 1 11 1 11 8" />
                </svg>
              </motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ════════════════════════════════════════════
          CIRCULAR FAB — orbital ring design
      ════════════════════════════════════════════ */}
      <div className="fixed right-5 z-50 bottom-[88px] md:bottom-5">
        {/* Orbital SVG ring — rotates when closed, stops when open */}
        <motion.div
          className="absolute -inset-3 pointer-events-none"
          animate={{ rotate: open ? 0 : 360 }}
          transition={{ duration: open ? 0 : 8, repeat: open ? 0 : Infinity, ease: 'linear' }}
        >
          <svg viewBox="0 0 80 80" className="w-full h-full">
            <circle
              cx="40" cy="40" r="34"
              fill="none"
              stroke="rgba(212,175,55,0.35)"
              strokeWidth="1"
              strokeDasharray="6 10"
            />
          </svg>
        </motion.div>

        {/* Outer glow pulse — idle only */}
        {!open && (
          <motion.div
            className="absolute inset-0 rounded-full pointer-events-none"
            animate={{
              boxShadow: [
                '0 0 0 0 rgba(212,175,55,0)',
                '0 0 0 10px rgba(212,175,55,0.12)',
                '0 0 0 0 rgba(212,175,55,0)',
              ],
            }}
            transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}

        {/* Main circular button */}
        <motion.button
          onClick={toggleOpen}
          aria-label={open ? 'Close concierge chat' : 'Open AI concierge chat'}
          aria-expanded={open}
          className="relative w-14 h-14 rounded-full flex items-center justify-center overflow-hidden"
          style={{
            background: open
              ? 'rgba(8, 6, 16, 0.92)'
              : 'linear-gradient(135deg, #0e0b1a 0%, #1a1428 100%)',
            border: open
              ? '1px solid rgba(212,175,55,0.35)'
              : '1px solid rgba(212,175,55,0.45)',
            boxShadow: open
              ? '0 4px 20px rgba(0,0,0,0.6), inset 0 1px 0 rgba(212,175,55,0.1)'
              : '0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(212,175,55,0.1), inset 0 1px 0 rgba(212,175,55,0.15)',
            touchAction: 'manipulation',
          }}
          whileHover={{ scale: 1.07 }}
          whileTap={{ scale: 0.92 }}
          transition={{ type: 'spring', stiffness: 420, damping: 22 }}
        >
          {/* Inner gold shimmer ring */}
          <div
            className="absolute inset-1 rounded-full pointer-events-none"
            style={{ border: '1px solid rgba(212,175,55,0.12)' }}
          />

          {/* Icon — animated swap */}
          <AnimatePresence mode="wait">
            {open ? (
              <motion.svg
                key="close"
                initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.22, ease: EASE }}
                width="14" height="14" viewBox="0 0 12 12"
                fill="none" stroke="rgba(212,175,55,0.8)" strokeWidth="1.6"
              >
                <line x1="1" y1="1" x2="11" y2="11" />
                <line x1="11" y1="1" x2="1" y2="11" />
              </motion.svg>
            ) : (
              <motion.div
                key="chip"
                initial={{ rotate: 90, opacity: 0, scale: 0.6 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: -90, opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.22, ease: EASE }}
              >
                <ChipIcon size={22} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* ── Notification dot — shown when closed and messages exist ── */}
      <AnimatePresence>
        {!open && messages.length > 1 && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 380, damping: 22 }}
            className="fixed right-5 z-50 bottom-[136px] md:bottom-[53px] pointer-events-none"
          >
            <div
              className="w-2.5 h-2.5 rounded-full bg-gold-400"
              style={{ boxShadow: '0 0 8px rgba(212,175,55,0.75), 0 0 16px rgba(212,175,55,0.3)' }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

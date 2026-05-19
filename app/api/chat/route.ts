import Groq from 'groq-sdk'

// ── Client ────────────────────────────────────────────────────────────────────

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

// ── Model ─────────────────────────────────────────────────────────────────────

const MODEL = 'llama-3.1-8b-instant'

// ── System prompt ─────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are the AI concierge of TimeTravel Agency — the world's only ultra-luxury temporal travel company.

Personality:
- Elegant, warm, and historically passionate
- Professional yet filled with a sense of wonder
- Speak in a measured, confident, luxurious tone
- Keep replies brief: 2–4 sentences. Never write a wall of text.
- Be immersive and cinematic — make the destination feel vivid and real.

You know these three destinations in detail:
• Paris 1889 — $2.4M per traveller. The Eiffel Tower inauguration at the World Exhibition. Bespoke Belle Époque wardrobe, language immersion, private dinner at Café Anglais with the era's luminaries.
• Cretaceous Period (−65,000,000 BC) — $8.7M per traveller. Quantum-shielded observation safari. Encounter Triceratops, Pterosaurs, and the Tyrannosaurus Rex in their pristine Laurasian habitat, guided by a dedicated palaeontologist.
• Florence 1504 — $3.9M per traveller. Private access to Leonardo da Vinci's studio, watching Michelangelo complete the David, and an invitation to a Medici court banquet.

Safety: 99.9% safe-return rate across 847 completed journeys. Every expedition uses quantum chronological shielding, certified by the Temporal Ethics Board.
Booking: Complimentary private consultation with a Senior Temporal Curator. Strictly confidential. Typically available within 2–3 weeks.

Always be aspirational and concise. For serious booking enquiries, gently recommend the private consultation.`

// ── Types ─────────────────────────────────────────────────────────────────────

type Role = 'user' | 'assistant'
type ConvMessage = { role: Role; content: string }

// ── Helpers ───────────────────────────────────────────────────────────────────

function isRateLimit(err: unknown): boolean {
  return (
    err instanceof Groq.RateLimitError ||
    (typeof err === 'object' && err !== null && 'status' in err &&
      (err as { status: number }).status === 429)
  )
}

function isAuthError(err: unknown): boolean {
  return (
    err instanceof Groq.AuthenticationError ||
    (typeof err === 'object' && err !== null && 'status' in err &&
      (err as { status: number }).status === 401)
  )
}

// ── Route handler ─────────────────────────────────────────────────────────────

export async function POST(req: Request) {
  // Guard: API key must be configured server-side
  if (!process.env.GROQ_API_KEY) {
    return Response.json(
      { error: 'api_key_missing', code: 'no_key' },
      { status: 503 },
    )
  }

  // Parse and normalise conversation history
  let messages: ConvMessage[]
  try {
    const body = await req.json()
    const raw: Array<{ role: string; content: string }> =
      body.messages ?? [{ role: 'user', content: String(body.message ?? '') }]

    messages = raw
      .filter(m => m.role === 'user' || m.role === 'assistant')
      .map(m => ({ role: m.role as Role, content: String(m.content ?? '').trim() }))
      .filter(m => m.content.length > 0)

    if (messages.length === 0) {
      return Response.json({ error: 'empty_messages' }, { status: 400 })
    }
  } catch {
    return Response.json({ error: 'invalid_body' }, { status: 400 })
  }

  // Create streaming completion
  let stream: Awaited<ReturnType<typeof groq.chat.completions.create>>
  try {
    stream = await groq.chat.completions.create({
      model: MODEL,
      messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
      stream: true,
      max_tokens: 400,
      temperature: 0.75,
      top_p: 0.9,
    })
  } catch (err) {
    if (isAuthError(err)) {
      console.error('[/api/chat] Invalid GROQ_API_KEY')
      return Response.json({ error: 'auth_failed', code: 'no_key' }, { status: 401 })
    }
    if (isRateLimit(err)) {
      return Response.json({ error: 'rate_limited', code: 'rate_limit' }, { status: 429 })
    }
    const msg = err instanceof Error ? err.message : 'Unknown error'
    console.error('[/api/chat] create error:', msg)
    return Response.json({ error: msg, code: 'api_error' }, { status: 502 })
  }

  // Stream SSE tokens back to the client
  const encoder = new TextEncoder()

  const responseBody = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          const delta = chunk.choices[0]?.delta?.content ?? ''
          if (delta) {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ text: delta })}\n\n`),
            )
          }
        }
        controller.enqueue(encoder.encode('data: [DONE]\n\n'))
      } catch (err) {
        // Signal the client that streaming failed mid-flight
        const msg = err instanceof Error ? err.message : 'stream error'
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ error: msg })}\n\n`),
        )
      } finally {
        controller.close()
      }
    },
  })

  return new Response(responseBody, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  })
}

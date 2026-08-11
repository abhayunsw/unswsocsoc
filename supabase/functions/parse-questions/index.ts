// Supabase Edge Function — parses a discussion handout's raw text into the
// structured shape DiscussionViewer.jsx renders.
//
// The Anthropic API key lives here as a Supabase secret, never in the browser
// bundle. Deploy with:
//   supabase functions deploy parse-questions
//   supabase secrets set ANTHROPIC_API_KEY=sk-ant-...

import Anthropic from 'npm:@anthropic-ai/sdk@0.69.0'

const MODEL = 'claude-opus-5'

// Only the admin origin(s) may call this — it spends API credit.
const ALLOWED_ORIGINS = [
  'https://socsoc-website.vercel.app',
  'http://localhost:5173',
  'http://localhost:5174',
]

function corsHeaders(origin: string | null) {
  const allowed = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0]
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Headers': 'authorization, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Vary': 'Origin',
  }
}

// Mirrors the question_json column shape. Nullable fields are expressed as
// ["string","null"] so the model must emit an explicit null rather than
// omitting the key.
const SCHEMA = {
  type: 'object',
  properties: {
    topic: { type: 'string' },
    thinkers: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name:        { type: 'string' },
          thinkerName: { type: 'string' },
          premise:     { type: 'string' },
          quote:       { type: ['string', 'null'] },
          source:      { type: ['string', 'null'] },
          questions:   { type: 'array', items: { type: 'string' } },
        },
        required: ['name', 'thinkerName', 'premise', 'quote', 'source', 'questions'],
        additionalProperties: false,
      },
    },
    finalQuestion: { type: ['string', 'null'] },
  },
  required: ['topic', 'thinkers', 'finalQuestion'],
  additionalProperties: false,
}

const SYSTEM = `You are parsing a philosophy discussion document into structured JSON.

Field meanings:
- topic: the overall discussion title/question for the handout.
- thinkers[].name: the section heading as it appears in the document.
- thinkers[].thinkerName: the philosopher's name for that section.
- thinkers[].premise: the explanatory paragraph introducing the thinker's position.
- thinkers[].quote: the quoted passage, without surrounding quotation marks. null if the section has no quote.
- thinkers[].source: the attribution for the quote (work, translator, page). null if absent.
- thinkers[].questions: every discussion question in that section, in document order, one string each.
- finalQuestion: the single closing question that ends the handout, if there is one. null otherwise.

Preserve the document's original wording — do not paraphrase, summarise, or invent content. If a field is genuinely absent, use null rather than guessing.`

Deno.serve(async (req: Request) => {
  const origin = req.headers.get('origin')
  const cors = corsHeaders(origin)

  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405, headers: { ...cors, 'Content-Type': 'application/json' },
    })
  }

  try {
    // Require a signed-in Supabase user — the anon key alone isn't enough.
    const authHeader = req.headers.get('Authorization') ?? ''
    const jwt = authHeader.replace('Bearer ', '')
    const userRes = await fetch(`${Deno.env.get('SUPABASE_URL')}/auth/v1/user`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
        apikey: Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      },
    })
    if (!userRes.ok) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...cors, 'Content-Type': 'application/json' },
      })
    }

    const { text } = await req.json()
    if (typeof text !== 'string' || text.trim().length < 20) {
      return new Response(JSON.stringify({ error: 'No document text supplied' }), {
        status: 400, headers: { ...cors, 'Content-Type': 'application/json' },
      })
    }

    const client = new Anthropic({ apiKey: Deno.env.get('ANTHROPIC_API_KEY') })

    const message = await client.messages.create({
      model: MODEL,
      max_tokens: 16000,
      thinking: { type: 'adaptive' },
      system: SYSTEM,
      output_config: { format: { type: 'json_schema', schema: SCHEMA } },
      messages: [{ role: 'user', content: text.slice(0, 200_000) }],
    })

    if (message.stop_reason === 'refusal') {
      return new Response(JSON.stringify({ error: 'The model declined to parse this document.' }), {
        status: 422, headers: { ...cors, 'Content-Type': 'application/json' },
      })
    }

    const block = message.content.find(b => b.type === 'text')
    if (!block || block.type !== 'text') {
      return new Response(JSON.stringify({ error: 'No parsed output returned.' }), {
        status: 502, headers: { ...cors, 'Content-Type': 'application/json' },
      })
    }

    // Schema-constrained, so this parses — but surface a clean error if not.
    let parsed
    try {
      parsed = JSON.parse(block.text)
    } catch {
      return new Response(JSON.stringify({ error: 'Model returned malformed JSON.' }), {
        status: 502, headers: { ...cors, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...cors, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('parse-questions failed:', err)
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500, headers: { ...cors, 'Content-Type': 'application/json' },
    })
  }
})

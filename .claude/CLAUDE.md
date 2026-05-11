# Elige Bien — Project CLAUDE.md

## What This Is

**Elige Bien** is a free 5-minute career-discovery experience for Mexican high school students. Two gamified quizzes reveal how you think (Test 1: Mente) and what kind of architect you'd be (Test 2: Arquitecto). Made by **Isthmus Arquitectura** in Chihuahua.

**Positioning:** standalone product, not a school ad. Isthmus is credited in the footer and fine print — NOT in the headline. The test is the bait; the school is the fisherman. Kids share the test because it feels like a personality quiz, not a recruitment funnel. The brand can be used for 3+ years of lead gen across multiple enrollment cycles.

## Current State (2026-04-15)

- **Status:** 🚀 **LIVE IN PRODUCTION**
- **Domain:** [eligebien.co](https://eligebien.co) — GoDaddy DNS → Vercel → Let's Encrypt SSL
- **Git:** https://github.com/caamanoluismiguel/elige-bien (public)
- **Vercel project:** `luis-caamano-s-projects/elige-bien`
- **Internal project name:** `isthmus-norte` (directory name only — not user-facing)

## Tech Stack

- **Next.js 16** (App Router, TurboPack) + **React 19** + **TypeScript 5.8**
- **Tailwind CSS v4** + **Framer Motion 12**
- **Supabase** (Postgres + RLS) — `elige-bien-MX` project, PII-safe deny-all policies
- **Server Actions** for all lead writes (never client → DB direct)
- **Vitest** (94 tests passing) + **Playwright** (e2e)
- No auth, no client-side Supabase access, no Google Sheets

## Architecture

```
src/
├── app/
│   ├── page.tsx                  # Landing — Elige Bien hook + manifesto + social proof
│   ├── mente/page.tsx            # Test 1 entry
│   ├── arquitecto/page.tsx       # Test 2 entry
│   ├── r/[id]/                   # Shareable result pages
│   │   ├── page.tsx              # Server component (OG metadata)
│   │   ├── shared-result-client.tsx
│   │   └── opengraph-image.tsx   # Dynamic OG image (Edge runtime)
│   └── feria/page.tsx            # TV booth display for school fairs
├── components/
│   ├── attribution-capture.tsx   # Client component dropped into entry routes
│   ├── test-1/                   # "Descubre Tu Mente" (6 questions, 5 cognitive axes)
│   ├── test-2/                   # "Qué Tipo de Arquitecto Serías" (8 questions, 4 types)
│   ├── feria/                    # Booth slideshow components
│   └── ui/                       # lead-form, cta-button, answer-card, progress-bar
├── lib/
│   ├── experience-config.ts      # SINGLE SOURCE OF TRUTH for all copy, manifesto, CTAs
│   ├── supabase.ts               # Server-only client (Proxy, lazy env validation)
│   ├── actions/save-lead.ts      # createLead + updateLeadResults server actions
│   ├── email-verify.ts           # Format + disposable blocklist + MX DNS check
│   ├── attribution.ts            # URL params → sessionStorage (source, UTMs, referrer)
│   ├── lead-session.ts           # sessionStorage helper for the Supabase lead UUID
│   ├── leads.ts                  # localStorage cache for form data (not the DB)
│   ├── campus-config.ts          # SITE_CONFIG + CAMPUSES registry
│   ├── profiles.ts               # Cognitive + architect profiles, bridge hooks
│   ├── quiz-engine.ts            # Score calculation + normalization
│   ├── result-encoder.ts         # Compact hex encoding for shareable URLs
│   ├── questions-test1.ts        # 6 questions × 5 axes
│   └── questions-test2.ts        # 8 questions × 4 types
├── hooks/
│   ├── use-tracking.ts           # Legacy: marks test completion in localStorage
│   ├── use-share-url.ts          # Web Share API + clipboard fallback
│   └── use-idle-reset.ts         # Auto-reset (feria mode only, ?feria=1)
└── types/
    └── quiz.ts                   # CognitiveProfile, ArchitectProfile, QuizState, etc.
```

## Key Design Decisions

### Lead capture is UPFRONT — everything before the test

```
Landing → LeadForm (name + email + phone + grade + consent)
        → createLead() [Supabase insert, returns leadId]
        → setLeadId() [sessionStorage]
        → Test 1 → updateLeadResults({leadId, test1})
        → Bridge → Test 2 → updateLeadResults({leadId, test2})
        → Share
```

**Why upfront:** if the kid bails at question 4 of Test 1, we still have a complete lead row. Mid-test capture loses 40-60% of late-bailers. Captured early = captured always.

### One lead row, two result updates

- `createLead()` writes the row once with all lead data + attribution.
- `updateLeadResults()` is called after Test 1 AND Test 2 — fire-and-forget, best-effort.
- If `leadId` is missing from sessionStorage (shouldn't happen), test results are silently dropped. The lead row is still valid.

### Lead form fields (5 required)

1. **Name** — min 2 chars
2. **Email** — format regex + disposable domain blocklist + MX DNS lookup
3. **WhatsApp** — normalized to E.164 Mexican format (+52)
4. **Grade** — dropdown: `sec_1_2 | sec_3 | prepa_1_2 | prepa_3 | otro`
5. **Consent checkbox** — LFPDPPP-compliant, explicit opt-in

### Email verification — zero friction, no OTP

`src/lib/email-verify.ts` runs 3 cheap checks server-side:

1. Strict format regex
2. `disposable-email-domains` npm blocklist (Mailinator, tempmail, etc.)
3. MX DNS lookup (rejects domains with no mail servers)

No SMTP probe (gets flagged as spam), no magic link (kills completion rate). Catches ~95% of fake emails. Before the first WhatsApp/email send, re-verify high-value leads via ZeroBounce or similar.

### Attribution capture

`src/lib/attribution.ts` reads `?src=`, `?utm_source/medium/campaign=`, `referrer` from the URL on first entry and persists to **sessionStorage** (per-tab, not global). Every distribution surface gets a unique `?src=...`:

- `fair-{slug}` — ed fair QR codes
- `nfc-{batch-id}` — NFC stickers
- `sticker-{location}` — printed cards
- `print-{campaign}` — flyers
- `social-{platform}` — bio links

### Supabase schema — `leads` table

Server-only writes via service_role key. RLS deny-all for anon/authenticated. Key fields:

```
id, name, email, email_verified_method, phone, grade (enum), school,
test1_result (jsonb), test2_result (jsonb),
test1_completed_at, test2_completed_at,
source, utm_source, utm_medium, utm_campaign, referrer,
consent_marketing, consent_timestamp,
hot_flag, notes, nurture_stage, last_contacted_at,
created_at, updated_at
```

### Shareable result URLs (legacy, still works)

- Scores encoded as 2-hex-chars per axis: `/r/1-643221430f` (Test 1), `/r/2-3c641e2d` (Test 2)
- Dynamic OG images via `opengraph-image.tsx` (Edge runtime, `ImageResponse`)
- Viral loop: share URL → friend sees result + "Descubre el tuyo →" → takes test → shares

### Feria mode (/feria) — TV booth slideshow

4-slide autoplay loop (Hero → Profiles → Social Proof → Architect) for school fair TVs. Idle reset on `?feria=1`. Not the primary distribution surface — `eligebien.co` is the product, the TV is one optional speaker.

## Environment Variables

### `.env.local` (gitignored)

```
NEXT_PUBLIC_SUPABASE_URL=https://jhzvlrjahalgqlmbuohu.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
SUPABASE_SECRET_KEY=sb_secret_...
```

### Vercel (production)

Same 3 vars, already set via `vercel env add ... production`.

### NOT used anymore

- `NEXT_PUBLIC_SHEETS_URL` — old Google Sheets path, fully removed.

## Commands

```bash
npx tsc --noEmit          # Type check (2 pre-existing errors in questions.test.ts — ignore)
npx vitest run            # 94 tests pass (1 skipped)
npm run dev               # Dev server (default port 3000, prefer 3939 to avoid clashes)
npm run build             # Production build — verifies Vercel deploy won't fail
vercel --prod --yes       # Deploy to production (prefer git push via GitHub integration)

node --env-file=.env.local scripts/supabase-smoke-test.mjs  # Verify Supabase wiring
node scripts/email-verify-test.mjs                           # Smoke test email verification
```

## Deploy workflow

1. Commit locally (`feat:` / `fix:` / `refactor:` conventional commits)
2. `git push origin main`
3. Vercel auto-deploys from GitHub (or `vercel --prod --yes` as fallback)
4. Verify with `curl -sI https://eligebien.co/` + Supabase dashboard

**Never deploy with uncommitted changes** — `vercel --prod` uploads local files, but Git-integration redeploys clone from GitHub. If they drift, CLI succeeds while Git fails (confusing error/ready pairs).

## Pre-existing Issues (not bugs, just known)

- `questions.test.ts` has 2 pre-existing TS errors (string vs union type) — cosmetic, tests pass
- `disposable-email-domains` npm blocklist misses a few services (tempmail.org) — acceptable for pilot
- Image assets for Test 2 (`/images/t2/*.jpg`) don't exist yet
- No automated email/WhatsApp nurture yet — WhatsApp Business API deferred until Mexican SIM is solved; in the meantime leads are just stored

## Tone & Copy Rules

- **Register:** "Profesor joven" — 28-year-old teacher, chill but competent
- **Language:** LATAM neutral tuteo. NO vos / tenés / sabés. NO slang.
- **Never say:** "carrera", "superpoder", "potencial oculto", "crack", "genio"
- **Share button:** "Envía tu perfil" (not "Compartir mi resultado")
- **Bridge hooks:** Curiosity + exclusivity framing, not facts
- **Test 1:** NEVER mentions architecture or Isthmus (except tiny footer credit)
- **Día Isthmus:** REMOVED from the result screen (2026-04-15). Not defined yet, will be introduced via future WhatsApp/email nurture once WA Business is solved.

## Test 2 Question 6 (rewrite note)

The old Q6 name-checked famous architects (Tadao Ando, Norman Foster, Aravena, Neri Oxman) — Mexican teens don't recognize them, making the test feel like a pop quiz. **Rewritten 2026-04-15** to use quoted legacy/reputation framing:

> **"¿Qué quieres que la gente diga de lo que haces?"**
>
> - _forma:_ "Es lo más bonito que he visto"
> - _sistemas:_ "¿Cómo puede ser tan eficiente?"
> - _impacto:_ "Me cambió la vida"
> - _innovacion:_ "Nadie había hecho algo así"

## /explora — Gesture-Controlled Street View Tour

### What It Is

Hidden route `/explora` — hand-gesture-controlled Google Street View tour of 4 architecture landmarks. Kids navigate panoramas using webcam/phone camera gestures. Keyboard fallback (WASD + arrows + Tab + Esc).

### Status (2026-04-15): 🟡 IN PROGRESS — GESTURE ACCURACY TUNING

- Route deployed at `eligebien.co/explora`, loads Street View ✅
- **Blocker: Google Cloud billing** — `isthmusxp@gmail.com` Cloud project (`eligebien-explora`) billing not linking (OR-CBAT-23 card rejection). Street View renders with "For development purposes only" watermark until billing is resolved. Call bank to authorize international charge or try a different card.
- **Active issue: gesture tracking accuracy** — debug overlay deployed (top-center bar showing live classifier output). Fist/open-palm work. Peace, wave, thumbs-up accuracy need user testing + tuning based on debug overlay feedback.
- **Negative colors (Dark Reader)** — user's browser extension inverts Street View colors. Incognito or disabling the extension fixes it. Not a code bug.

### Tech Stack (explora-specific)

- **Google Maps JavaScript API** — `@googlemaps/js-api-loader` v2 (functional API: `setOptions` + `importLibrary`)
- **MediaPipe Hands** — `@mediapipe/tasks-vision` (lazy-loaded, ~12MB WASM+model from CDN, GPU delegate)
- **1€ Filter** — smooths hand landmark jitter (Casiez et al.)

### Architecture

```
src/app/explora/
├── layout.tsx            # Metadata (noindex) — server component
├── page.tsx              # Client page — direct import, no SSR
src/components/explora/
├── explora-client.tsx    # Shell: camera PiP, HUD, venue strip, gesture loop, keyboard fallback, debug overlay
├── street-view-canvas.tsx # Google SV via imperative handle (rotate, zoom, step, loadLandmark)
src/hooks/
├── use-hand-tracker.ts   # MediaPipe lazy init, per-frame classify + 1€ filter
src/lib/explora/
├── landmarks.ts          # 4 landmarks: Sagrada, Sydney Opera, Fallingwater, Vasconcelos
├── gestures.ts           # Classifier (fist/peace/open/pinch/thumbs-up) + GestureAggregator
├── one-euro-filter.ts    # 1€ signal smoother
```

### Gesture Vocabulary

| Gesture                | Action                                               |
| ---------------------- | ---------------------------------------------------- |
| ✋ Open palm drift     | Turn heading + pitch (velocity-based, dead zone 12%) |
| ✊ Fist held           | Step forward (every 700ms)                           |
| ✌️ Peace held          | Step back (every 700ms)                              |
| 👌👌 Two-hand pinch    | Zoom in/out                                          |
| 👍 Thumbs-up 600ms     | Next landmark                                        |
| 👋 Wave 4 oscillations | Exit to landing                                      |

### Landmarks (config-driven, easy to add more)

| ID                     | Name                   | Architect          | Indoor? |
| ---------------------- | ---------------------- | ------------------ | ------- |
| sagrada-familia        | Sagrada Família        | Antoni Gaudí       | ✅      |
| sydney-opera           | Sydney Opera House     | Jørn Utzon         | ✅      |
| fallingwater           | Fallingwater           | Frank Lloyd Wright | ✅      |
| biblioteca-vasconcelos | Biblioteca Vasconcelos | Alberto Kalach     | ✅      |

### Environment Variables

```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY  # Google Maps JS API key (eligebien-explora project)
```

Set in `.env.local` (dev) AND Vercel dashboard (prod). Key must have:

- HTTP referrer restriction: `https://eligebien.co/*`, `http://localhost:3000/*`
- API restriction: Maps JavaScript API only

### Key Decisions

- **No SSR** — `/explora/page.tsx` is `"use client"` to avoid hydration mismatches with Google Maps DOM
- **Lazy MediaPipe** — only loaded when user clicks "Activar cámara", not on page load
- **Mirror-flip X** — selfie camera mirrored so left-hand-on-screen = left-look
- **History stack** — `stepBack()` pops from internal history (not Google's `getLinks()` reverse)
- **Debug overlay** — live classifier output at top-center for accuracy tuning. Remove before shipping to kids.

### Google Cloud Setup

- **Google account:** `isthmusxp@gmail.com`
- **Project:** `eligebien-explora` (project ID: `project-7952a4b0-dc27-4ff9-bf3`)
- **Billing:** ⚠️ NOT LINKED — OR-CBAT-23 card rejection. Needs resolution.
- **API key:** `[REDACTED-MAPS-KEY]` (restricted to eligebien.co)

## Conferencia derivada — "Cuando la máquina siempre te da la razón" (2026-04-27)

Keynote pública de 30-40 min derivada de los `docs/` del curso de IA. Reformulada del Día 7 ("El Juicio del Diseño") como crítica ética/cultural de la sycophancy. **Audiencia: público general en Chihuahua** (no arquitectos). Subtítulo: _"La Inteligencia Artificial y la muerte del criterio"_.

### Estructura final — 12 slides

| #   | Slide                                                               | Fuente en `docs/`                                                 |
| --- | ------------------------------------------------------------------- | ----------------------------------------------------------------- |
| 1   | Title                                                               | —                                                                 |
| 2   | Panamá 2012 (callback autobiográfico) → Netflix/Spotify/TikTok      | callback personal del orador, no del curso                        |
| 3   | La IA no piensa, predice la siguiente palabra                       | `research/AI-GLOSSARY.md`                                         |
| 4   | Burrito sin tortilla (sycophancy demo)                              | reformulación del Día 7 demo de sesgo                             |
| 5   | "No me dijo la verdad. Me dio comodidad." (frase central)           | `research/HUMAN-AI-COLLAB-RESEARCH.md:160-169`                    |
| 6   | 2012 vs 2026 (filtraba vs inventa)                                  | extrapolación del Western/luxury bias                             |
| 7   | "A cada quien le da SU verdad" (sesgos)                             | `INSTRUCTOR-GUIDE.md:329` + `HUMAN-AI-COLLAB-RESEARCH.md:279-293` |
| 8   | Las buenas ideas nacen de la fricción                               | derivada de PAIR framework + abogado del diablo Día 7             |
| 9   | Adulador profesional + 3 preguntas (tatuaje / cafetería / ex audio) | Slide 181 Día 7 (self-automator)                                  |
| 10  | La IA es un amplificador / sin IN no sirve                          | `SLIDES-CONTENT.md:~400`                                          |
| 11  | Criterio + Comunicar (qué es Inteligencia Natural)                  | nuevo — síntesis pedagógica                                       |
| 12  | "¿Vas a tener el criterio para saber cuándo te está mintiendo?"     | cierre original                                                   |

### Deliverables

- **PDF (12 slides):** `~/Downloads/conferencia-IA-v2.pdf` — 12 páginas, 1280x720, mismo estilo que el deck original (negro + blanco + acento `#FF3D2E`, Inter Bold)
- **Notas del orador (Word):** `~/Downloads/conferencia-IA-notas.docx` — pantalla + guión por slide + frases textuales + ejemplos relatables (mecánico, pizza, fiebre del niño)
- **Source HTML:** `/tmp/conferencia-v2.html` (efímero — regenerar si se necesita editar)
- **Generación:** Playwright screenshots por slide → ImageMagick combina en PDF (Chrome `--print-to-pdf` cortaba a 8 pp por bug con flex+page-break)

### Frases que siempre deben salir intactas

1. _"No me dijo la verdad. Me dio comodidad."_ (slide 5)
2. _"Sin Inteligencia Natural, la IA no sirve de nada."_ (slide 10)
3. _"La IA amplifica lo que tú traes."_ (slide 10)

### Reglas de tono específicas (distintas de Elige Bien)

- Registro retórico de keynote, no de curso técnico
- LATAM neutral tuteo (igual que Elige Bien)
- Las preguntas-trampa del slide 9 NO deben disparar safety guardrails de ChatGPT — son ambiguas, no peligrosas (tatuaje a los 3 meses, renunciar para abrir cafetería sin experiencia, audio de 10 min al ex). Originalmente tenía "cerveza a niño de 12" — descartado porque LLM lo bloquea, rompe el chiste.

## What's Next

### Immediate (explora)

1. **Resolve Google Cloud billing** — call bank to whitelist Google Ireland, or use personal account (`caamano.luismiguel@gmail.com`) as workaround
2. **Tune gesture accuracy** — use debug overlay on phone to identify misclassifications, adjust classifier thresholds
3. **Remove debug overlay** once gesture tracking is reliable
4. **Wire easter egg trigger** on landing page — hidden tap on manifesto section to navigate to `/explora`
5. **Add more landmarks** — Chichén Itzá, Teotihuacán, Taj Mahal, Pantheon, Versailles, Colosseum, Casa Batlló, Guggenheim Bilbao

### Near-term

6. Curate `/feria` slide copy to point at `eligebien.co` + readable short URL
7. Print business-card-sized handouts with QR + short URL for fair distribution
8. Pre-program NFC stickers with unique `?src=nfc-batch-N` params

### Medium-term

9. WhatsApp Business API integration (when Mexican SIM is solved)
10. Email nurture sequence via Resend (Day 0, 3, 7, 14) — currently deferred
11. Admin dashboard at `/admin/leads` for Diego (per-fair filtering, hot-flag marking)
12. Pre-verify high-value leads before first send (ZeroBounce or similar)

### Long-term

13. Multi-campus expansion (the `CAMPUSES` registry is ready)
14. Spin `eligebien.co` out as a standalone SaaS for other LATAM architecture schools

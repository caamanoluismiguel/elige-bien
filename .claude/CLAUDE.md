# Isthmus XP — Project CLAUDE.md

## What This Is

Recruitment funnel for **Isthmus arquitectura** (Chihuahua, Mexico). Two gamified personality/aptitude tests that capture leads (name + WhatsApp) from high school students. Built as a multi-campus platform under the **isthmusxp.com** brand.

## Current State (2026-04-07)

- **Status:** Pilot-ready, not yet deployed
- **Domain:** `isthmusxp.com` (not yet purchased — needs Mexican team)
- **Branch:** local only, no remote configured
- **Env:** `NEXT_PUBLIC_SHEETS_URL` — Google Apps Script webhook (not yet deployed)

## Tech Stack

- Next.js 16 (App Router, TurboPack), React 19, TypeScript 5.8+
- Tailwind CSS v4, Framer Motion 12
- No database — localStorage + Google Sheets via Apps Script
- No auth — public site, lead capture only

## Architecture

```
src/
├── app/
│   ├── page.tsx                 # Home — ISTHMUS XP hub
│   ├── mente/page.tsx           # Test 1 entry
│   ├── arquitecto/page.tsx      # Test 2 entry
│   ├── r/[id]/                  # Shareable result pages
│   │   ├── page.tsx             # Server component (OG metadata)
│   │   ├── shared-result-client.tsx  # Client component (chart + CTA)
│   │   └── opengraph-image.tsx  # Dynamic OG image (Edge runtime)
│   └── feria/page.tsx           # TV booth display for school fairs
├── components/
│   ├── test-1/                  # "Descubre Tu Mente" (6 questions, 5 cognitive axes)
│   ├── test-2/                  # "Que Tipo de Arquitecto Serias?" (8 questions, 4 architect types)
│   ├── feria/                   # Booth slideshow components
│   └── ui/                     # Shared: lead-form, cta-button, answer-card, progress-bar
├── lib/
│   ├── campus-config.ts         # SITE_CONFIG (domain, brand) + CAMPUSES registry
│   ├── result-encoder.ts        # Compact hex encoding for shareable URLs
│   ├── leads.ts                 # localStorage + Google Sheets submission with tracking
│   ├── profiles.ts              # Cognitive + architect profiles, bridge hooks
│   ├── quiz-engine.ts           # Score calculation + normalization
│   ├── questions-test1.ts       # 6 questions × 5 axes
│   └── questions-test2.ts       # 8 questions × 4 types
├── hooks/
│   ├── use-tracking.ts          # Source attribution (UTM, referrer, shared link detection)
│   ├── use-share-url.ts         # Web Share API + clipboard fallback
│   └── use-idle-reset.ts        # Auto-reset timer (feria mode only, ?feria=1)
└── types/
    └── quiz.ts                  # CognitiveProfile, ArchitectProfile, QuizState, etc.
```

## Key Design Decisions

### Funnel is one-directional

```
Test 1 (universal, no Isthmus mention)
  → Personalized bridge (curiosity + exclusivity hook)
    → Test 2 (architecture-specific, Isthmus pitch)
      → Conversion: Dia Isthmus / WhatsApp to school
```

- Test 1 result → pushes to Test 2 via personalized bridge
- Test 2 result → conversion CTAs only. Does NOT link back to Test 1.
- Each screen has max 2 primary actions. No decision paralysis.

### Shareable result URLs

- Scores encoded as 2-hex-chars per axis: `/r/1-643221430f` (Test 1), `/r/2-3c641e2d` (Test 2)
- No backend needed — all data in the URL
- Dynamic OG images via `opengraph-image.tsx` (Edge runtime, `ImageResponse`)
- Viral loop: share URL → friend sees result + "Descubre el tuyo →" → takes test → shares

### Multi-campus architecture

- `SITE_CONFIG` in `campus-config.ts` = single source of truth for domain + brand
- `CAMPUSES` registry: add new campus = add one config object
- Currently: `norte` (Chihuahua). Extensible to other cities.

### Pilot tracking (no external analytics)

Every test completion logs to Google Sheets with:

- Lead info (name, whatsapp)
- Quiz data (test, result, scores, resultId)
- Attribution (source, referrerResultId, UTM params, campus, timestamp, testsCompleted)

### Idle reset = feria mode only

- Auto-reset timer only fires when `?feria=1` is in the URL
- Normal users keep their result on screen indefinitely

## Commands

```bash
npx tsc --noEmit          # Type check (2 pre-existing errors in questions.test.ts — ignore)
npx vitest run            # 106 tests pass
npm run dev               # Dev server (port 3000 default)
```

## Pre-existing Issues (not bugs, just known)

- `questions.test.ts` has 2 TS errors (string vs union type) — cosmetic, tests still pass
- Social proof counters removed — will wire up real numbers when Google Sheet has data
- WhatsApp Business API integration deferred — team needs Mexican SIM first
- Image assets for Test 2 (`/images/t2/*.jpg`) don't exist yet

## Tone & Copy Rules

- **Register:** "Profesor joven" — 28-year-old teacher, chill but competent
- **Language:** Clean informal Spanish, NO slang, NO career anxiety words
- **Never say:** "carrera", "superpoder", "potencial oculto", "crack", "genio"
- **Share button:** "Envia tu perfil" (not "Compartir mi resultado")
- **Bridge hooks:** Curiosity + exclusivity framing, not facts
- **Test 1:** NEVER mentions architecture or Isthmus (except tiny footer credit)

## What's Next

1. Deploy Google Apps Script + set `NEXT_PUBLIC_SHEETS_URL`
2. Purchase `isthmusxp.com` domain
3. Deploy to Vercel
4. WhatsApp Business API (when team has SIM)
5. GA4 + Meta Pixel (when ready for paid ads)

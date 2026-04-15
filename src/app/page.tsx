import Link from "next/link";
import type { Metadata } from "next";
import { EXPERIENCE } from "@/lib/experience-config";
import { AttributionCapture } from "@/components/attribution-capture";

export const metadata: Metadata = {
  title: `${EXPERIENCE.brand.name} — ${EXPERIENCE.brand.tagline}`,
  description: EXPERIENCE.manifesto.full,
  openGraph: {
    title: `${EXPERIENCE.brand.name} — ${EXPERIENCE.brand.tagline}`,
    description: EXPERIENCE.manifesto.short,
    type: "website",
  },
};

/**
 * ELIGE BIEN — primary landing page.
 *
 * Standalone career-discovery product. Isthmus Arquitectura is the author,
 * credited in the footer, not in the headline.
 *
 * Four progressive layers:
 *  1. Hook (above fold) — single CTA, short promise
 *  2. Trust strip — who, where, how long
 *  3. What you'll get — 3 value cards
 *  4. Social proof — count + count label
 *
 * Sticky mobile CTA persists through all layers so the kid can start
 * the experience from any scroll position.
 */
export default function LandingPage() {
  const { landing, manifesto, footer } = EXPERIENCE;
  const startHref = "/mente";

  return (
    <div className="min-h-dvh bg-[#0A0A0A] text-[#F5F5F5]">
      <AttributionCapture />
      {/* ─── Persistent background ──────────────────────────── */}
      <BackgroundGrid />

      {/* ─── LAYER 1 — Hook ─────────────────────────────────── */}
      <section className="relative min-h-dvh flex flex-col items-center justify-center px-6 text-center">
        <span className="font-[family-name:var(--font-space-grotesk)] text-sm sm:text-base tracking-[0.3em] text-[#00FF66] font-semibold mb-6">
          {landing.hook.eyebrow}
        </span>

        <h1
          className="font-[family-name:var(--font-space-grotesk)] font-bold leading-[1.05] tracking-[-0.02em] max-w-3xl"
          style={{ fontSize: "clamp(40px, 7vw, 72px)" }}
        >
          {landing.hook.headline}
        </h1>

        <p
          className="mt-6 font-[family-name:var(--font-inter)] text-[#A0A0A0] max-w-xl"
          style={{ fontSize: "clamp(18px, 2.5vw, 24px)" }}
        >
          {landing.hook.subheadline}
        </p>

        <Link
          href={startHref}
          className="mt-10 inline-flex items-center justify-center gap-2 min-h-11 px-8 py-4 rounded-full bg-[#00FF66] text-[#0A0A0A] font-[family-name:var(--font-space-grotesk)] text-lg font-semibold tracking-tight shadow-[0_0_40px_rgba(0,255,102,0.3)] hover:bg-[#00CC52] active:scale-[0.97] transition-all outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#00FF66]"
        >
          {landing.hook.primaryCta}
          <span aria-hidden="true">→</span>
        </Link>

        {/* Scroll cue */}
        <div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[#A0A0A0] text-xs tracking-[0.2em] font-[family-name:var(--font-inter)] flex flex-col items-center gap-2 motion-safe:animate-bounce"
          aria-hidden="true"
        >
          <span>MÁS INFO</span>
          <span>↓</span>
        </div>
      </section>

      {/* ─── LAYER 2 — Trust strip ──────────────────────────── */}
      <section className="relative px-6 py-16 border-y border-white/5">
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          {landing.trust.map((item) => (
            <div key={item.label} className="flex flex-col gap-1">
              <span className="font-[family-name:var(--font-inter)] text-xs tracking-[0.25em] text-[#A0A0A0] uppercase">
                {item.label}
              </span>
              <span className="font-[family-name:var(--font-space-grotesk)] text-lg font-semibold text-[#F5F5F5]">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ─── LAYER 3 — What you'll get ──────────────────────── */}
      <section className="relative px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <h2
            className="font-[family-name:var(--font-space-grotesk)] font-bold tracking-[-0.02em] text-center mb-12"
            style={{ fontSize: "clamp(32px, 5vw, 52px)" }}
          >
            {landing.whatYouGet.title}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {landing.whatYouGet.items.map((item, i) => {
              const accent =
                i === 0 ? "#00FF66" : i === 1 ? "#FF6B35" : "#F5F5F5";
              return (
                <article
                  key={item.title}
                  className="rounded-2xl p-8 flex flex-col gap-3"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                  }}
                >
                  <span
                    className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold"
                    style={{ color: accent }}
                    aria-hidden="true"
                  >
                    0{i + 1}
                  </span>
                  <h3 className="font-[family-name:var(--font-space-grotesk)] text-xl font-semibold text-[#F5F5F5]">
                    {item.title}
                  </h3>
                  <p className="font-[family-name:var(--font-inter)] text-[#A0A0A0] leading-relaxed">
                    {item.body}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── LAYER 4 — Social proof ─────────────────────────── */}
      <section className="relative px-6 py-20 text-center">
        <p className="font-[family-name:var(--font-inter)] text-[#A0A0A0] text-sm tracking-[0.25em] uppercase mb-4">
          {landing.socialProof.headline}
        </p>
        <p
          className="font-[family-name:var(--font-space-grotesk)] font-bold tabular-nums text-[#00FF66]"
          style={{
            fontSize: "clamp(80px, 14vw, 180px)",
            textShadow: "0 0 60px rgba(0,255,102,0.4)",
            lineHeight: 0.9,
          }}
        >
          {landing.socialProof.countFallback.toLocaleString("es-MX")}
        </p>
        <p
          className="mt-4 font-[family-name:var(--font-space-grotesk)] font-bold tracking-wide text-[#F5F5F5]"
          style={{ fontSize: "clamp(24px, 3vw, 36px)" }}
        >
          {landing.socialProof.countLabel.toUpperCase()}
        </p>
      </section>

      {/* ─── Final CTA ──────────────────────────────────────── */}
      <section className="relative px-6 py-20 text-center">
        <p
          className="font-[family-name:var(--font-space-grotesk)] font-bold leading-tight max-w-2xl mx-auto"
          style={{ fontSize: "clamp(28px, 4vw, 44px)" }}
        >
          {manifesto.short}
        </p>
        <Link
          href={startHref}
          className="mt-10 inline-flex items-center justify-center gap-2 min-h-11 px-10 py-4 rounded-full bg-[#00FF66] text-[#0A0A0A] font-[family-name:var(--font-space-grotesk)] text-lg font-semibold tracking-tight shadow-[0_0_40px_rgba(0,255,102,0.3)] hover:bg-[#00CC52] active:scale-[0.97] transition-all outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#00FF66]"
        >
          {landing.hook.primaryCta}
          <span aria-hidden="true">→</span>
        </Link>
        <div className="mt-6">
          <Link
            href="/arquitecto"
            className="font-[family-name:var(--font-inter)] text-sm text-[#A0A0A0] underline underline-offset-4 hover:text-[#FF6B35] transition-colors"
          >
            Saltar directo a la prueba de arquitectura
          </Link>
        </div>
      </section>

      {/* ─── Footer ─────────────────────────────────────────── */}
      <footer className="relative px-6 py-10 border-t border-white/5 text-center">
        <p className="font-[family-name:var(--font-inter)] text-sm text-[#A0A0A0]">
          {footer.authorLine}
        </p>
        <p className="mt-2 font-[family-name:var(--font-inter)] text-xs text-[#666]">
          {footer.copyright}
        </p>
      </footer>
    </div>
  );
}

/**
 * Full-page neon grid — server component, zero JS.
 * Dual green/terracotta accent lines + dual radial glows.
 */
function BackgroundGrid() {
  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      <svg
        className="absolute inset-0 w-full h-full motion-safe:animate-[grid-drift_16s_ease-in-out_infinite]"
        viewBox="0 0 375 812"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        <line
          x1="60"
          y1="0"
          x2="60"
          y2="812"
          stroke="#00FF66"
          strokeOpacity="0.025"
          strokeWidth="0.5"
        />
        <line
          x1="120"
          y1="0"
          x2="120"
          y2="812"
          stroke="#00FF66"
          strokeOpacity="0.02"
          strokeWidth="0.5"
        />
        <line
          x1="187"
          y1="0"
          x2="187"
          y2="812"
          stroke="#FFFFFF"
          strokeOpacity="0.02"
          strokeWidth="0.5"
        />
        <line
          x1="255"
          y1="0"
          x2="255"
          y2="812"
          stroke="#FF6B35"
          strokeOpacity="0.02"
          strokeWidth="0.5"
        />
        <line
          x1="315"
          y1="0"
          x2="315"
          y2="812"
          stroke="#FF6B35"
          strokeOpacity="0.025"
          strokeWidth="0.5"
        />
        <line
          x1="0"
          y1="300"
          x2="375"
          y2="300"
          stroke="#FFFFFF"
          strokeOpacity="0.015"
          strokeWidth="0.5"
        />
        <line
          x1="0"
          y1="500"
          x2="375"
          y2="500"
          stroke="#FFFFFF"
          strokeOpacity="0.015"
          strokeWidth="0.5"
        />
      </svg>
      <div
        className="absolute top-[10%] left-[10%] w-[400px] h-[400px] motion-safe:animate-[radial-pulse_8s_ease-in-out_infinite]"
        style={{
          background:
            "radial-gradient(circle, rgba(0, 255, 102, 0.05) 0%, transparent 60%)",
        }}
      />
      <div
        className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] motion-safe:animate-[radial-pulse_8s_ease-in-out_infinite_2s]"
        style={{
          background:
            "radial-gradient(circle, rgba(255, 107, 53, 0.05) 0%, transparent 60%)",
        }}
      />
    </div>
  );
}

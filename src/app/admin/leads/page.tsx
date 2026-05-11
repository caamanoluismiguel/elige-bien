import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { supabase } from "@/lib/supabase";
import { logoutAction } from "../actions";
import { LeadsTable, type LeadRow } from "./leads-table";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface SupabaseLeadRow {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  grade: string | null;
  school: string | null;
  source: string | null;
  utm_source: string | null;
  referrer: string | null;
  hot_flag: boolean | null;
  consent_marketing: boolean | null;
  notes: string | null;
  test1_completed_at: string | null;
  test2_completed_at: string | null;
  test1_result: { profile?: { label?: string } } | null;
  test2_result: { profile?: { label?: string } } | null;
  created_at: string;
}

interface Stats {
  total: number;
  today: number;
  week: number;
  bothTests: number;
  test1Only: number;
  hot: number;
}

function computeStats(rows: LeadRow[]): Stats {
  const now = Date.now();
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayStartMs = todayStart.getTime();
  const weekAgoMs = now - 7 * 24 * 60 * 60 * 1000;

  let today = 0;
  let week = 0;
  let bothTests = 0;
  let test1Only = 0;
  let hot = 0;

  for (const r of rows) {
    const t = new Date(r.createdAt).getTime();
    if (t >= todayStartMs) today++;
    if (t >= weekAgoMs) week++;
    if (r.test1CompletedAt && r.test2CompletedAt) bothTests++;
    else if (r.test1CompletedAt) test1Only++;
    if (r.hotFlag) hot++;
  }

  return { total: rows.length, today, week, bothTests, test1Only, hot };
}

function StatCard({
  label,
  value,
  hint,
  accent,
}: {
  label: string;
  value: string | number;
  hint?: string;
  accent?: string;
}) {
  return (
    <div className="flex flex-col gap-1 px-4 py-3 rounded-xl bg-[#0F0F0F] border border-[#1A1A1A] min-w-[110px]">
      <span className="font-[family-name:var(--font-inter)] text-[11px] uppercase tracking-wider text-[#A0A0A0]">
        {label}
      </span>
      <span
        className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold leading-none"
        style={{ color: accent ?? "#F5F5F5" }}
      >
        {value}
      </span>
      {hint && (
        <span className="font-[family-name:var(--font-inter)] text-[11px] text-[#666]">
          {hint}
        </span>
      )}
    </div>
  );
}

export default async function AdminLeadsPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const { data, error } = await supabase
    .from("leads")
    .select(
      "id, name, email, phone, grade, school, source, utm_source, referrer, hot_flag, consent_marketing, notes, test1_completed_at, test2_completed_at, test1_result, test2_result, created_at",
    )
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <main className="px-6 py-10">
        <p className="text-[#FF6B6B]">Error: {error.message}</p>
      </main>
    );
  }

  const rows: LeadRow[] = ((data ?? []) as SupabaseLeadRow[]).map((r) => ({
    id: r.id,
    name: r.name,
    email: r.email,
    phone: r.phone,
    grade: r.grade,
    school: r.school,
    source: r.source,
    utmSource: r.utm_source,
    referrer: r.referrer,
    hotFlag: !!r.hot_flag,
    consentMarketing: !!r.consent_marketing,
    notes: r.notes,
    test1CompletedAt: r.test1_completed_at,
    test2CompletedAt: r.test2_completed_at,
    test1Profile: r.test1_result?.profile?.label ?? null,
    test2Profile: r.test2_result?.profile?.label ?? null,
    createdAt: r.created_at,
  }));

  const stats = computeStats(rows);
  const completionPct =
    stats.total > 0 ? Math.round((stats.bothTests / stats.total) * 100) : 0;

  return (
    <main className="px-4 sm:px-6 py-6">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-[family-name:var(--font-space-grotesk)] text-2xl sm:text-3xl font-bold">
            Leads
          </h1>
          <p className="font-[family-name:var(--font-inter)] text-sm text-[#A0A0A0]">
            {rows.length} {rows.length === 1 ? "registro" : "registros"} · Elige
            Bien
          </p>
        </div>
        <form action={logoutAction}>
          <button
            type="submit"
            className="font-[family-name:var(--font-inter)] text-sm text-[#A0A0A0] hover:text-[#FF6B35] transition-colors"
          >
            Salir
          </button>
        </form>
      </header>

      <div className="flex flex-wrap gap-3 mb-6">
        <StatCard label="Total" value={stats.total} />
        <StatCard label="Hoy" value={stats.today} accent="#00FF66" />
        <StatCard
          label="7 días"
          value={stats.week}
          hint={
            stats.total > 0
              ? `${Math.round((stats.week / stats.total) * 100)}% del total`
              : undefined
          }
        />
        <StatCard
          label="Completaron"
          value={stats.bothTests}
          hint={`${completionPct}% terminó los 2`}
        />
        <StatCard
          label="Solo Test 1"
          value={stats.test1Only}
          hint="bailaron entre tests"
        />
        <StatCard
          label="🔥 Calientes"
          value={stats.hot}
          accent={stats.hot > 0 ? "#FF6B35" : undefined}
        />
      </div>

      <LeadsTable rows={rows} />
    </main>
  );
}

"use client";

import { useMemo, useState, useTransition } from "react";
import { toggleHotFlag, updateLeadNotes } from "../actions";

export interface LeadRow {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  grade: string | null;
  school: string | null;
  source: string | null;
  utmSource: string | null;
  referrer: string | null;
  hotFlag: boolean;
  consentMarketing: boolean;
  notes: string | null;
  test1CompletedAt: string | null;
  test2CompletedAt: string | null;
  test1Profile: string | null;
  test2Profile: string | null;
  createdAt: string;
}

type Completion = "all" | "both" | "test1_only" | "none";

const GRADE_LABELS: Record<string, string> = {
  sec_1_2: "Sec 1-2",
  sec_3: "Sec 3",
  prepa_1_2: "Prepa 1-2",
  prepa_3: "Prepa 3",
  otro: "Otro",
};

function fmtDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("es-MX", {
    year: "2-digit",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function csvEscape(v: string | null | undefined): string {
  const s = v == null ? "" : String(v);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function toCsv(rows: LeadRow[]): string {
  const headers = [
    "created_at",
    "name",
    "email",
    "phone",
    "school",
    "grade",
    "test1_profile",
    "test1_completed_at",
    "test2_profile",
    "test2_completed_at",
    "hot_flag",
    "notes",
    "source",
    "utm_source",
    "referrer",
    "consent_marketing",
    "id",
  ];
  const lines = [headers.join(",")];
  for (const r of rows) {
    lines.push(
      [
        r.createdAt,
        r.name,
        r.email,
        r.phone,
        r.school,
        r.grade,
        r.test1Profile,
        r.test1CompletedAt,
        r.test2Profile,
        r.test2CompletedAt,
        r.hotFlag ? "true" : "false",
        r.notes,
        r.source,
        r.utmSource,
        r.referrer,
        r.consentMarketing ? "true" : "false",
        r.id,
      ]
        .map(csvEscape)
        .join(","),
    );
  }
  return lines.join("\n");
}

export function LeadsTable({ rows }: { rows: LeadRow[] }) {
  const [query, setQuery] = useState("");
  const [completion, setCompletion] = useState<Completion>("all");
  const [schoolFilter, setSchoolFilter] = useState<string>("all");
  const [hotOnly, setHotOnly] = useState(false);

  const schools = useMemo(() => {
    const set = new Set<string>();
    for (const r of rows) if (r.school) set.add(r.school);
    return Array.from(set).sort();
  }, [rows]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      if (hotOnly && !r.hotFlag) return false;
      if (schoolFilter !== "all" && r.school !== schoolFilter) return false;
      if (completion === "both" && !(r.test1CompletedAt && r.test2CompletedAt))
        return false;
      if (
        completion === "test1_only" &&
        !(r.test1CompletedAt && !r.test2CompletedAt)
      )
        return false;
      if (completion === "none" && (r.test1CompletedAt || r.test2CompletedAt))
        return false;
      if (!q) return true;
      const hay =
        `${r.name ?? ""} ${r.email ?? ""} ${r.phone ?? ""} ${r.school ?? ""} ${r.source ?? ""} ${r.notes ?? ""}`.toLowerCase();
      return hay.includes(q);
    });
  }, [rows, query, completion, schoolFilter, hotOnly]);

  function downloadCsv() {
    const csv = toCsv(filtered);
    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const stamp = new Date().toISOString().slice(0, 10);
    a.download = `elige-bien-leads-${stamp}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className="flex flex-wrap gap-3 items-end mb-4">
        <label className="flex flex-col gap-1 flex-1 min-w-[180px]">
          <span className="text-[12px] text-[#A0A0A0] font-[family-name:var(--font-inter)]">
            Buscar
          </span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Nombre, correo, WhatsApp, escuela…"
            className="h-11 px-3 rounded-lg bg-[#00FF6608] border border-[#1A1A1A] text-[#F5F5F5] text-[14px] outline-none focus-visible:border-[#00FF6666]"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-[12px] text-[#A0A0A0] font-[family-name:var(--font-inter)]">
            Escuela
          </span>
          <select
            value={schoolFilter}
            onChange={(e) => setSchoolFilter(e.target.value)}
            className="h-11 px-3 rounded-lg bg-[#00FF6608] border border-[#1A1A1A] text-[#F5F5F5] text-[14px] outline-none"
          >
            <option value="all">Todas</option>
            {schools.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-[12px] text-[#A0A0A0] font-[family-name:var(--font-inter)]">
            Estado
          </span>
          <select
            value={completion}
            onChange={(e) => setCompletion(e.target.value as Completion)}
            className="h-11 px-3 rounded-lg bg-[#00FF6608] border border-[#1A1A1A] text-[#F5F5F5] text-[14px] outline-none"
          >
            <option value="all">Todos</option>
            <option value="both">Completaron los 2</option>
            <option value="test1_only">Solo Test 1</option>
            <option value="none">Sin resultados</option>
          </select>
        </label>
        <label className="flex items-center gap-2 h-11 px-3 rounded-lg border border-[#1A1A1A] bg-[#00FF6608] cursor-pointer">
          <input
            type="checkbox"
            checked={hotOnly}
            onChange={(e) => setHotOnly(e.target.checked)}
            className="w-4 h-4 accent-[#FF6B35]"
          />
          <span className="text-[13px] text-[#F5F5F5] font-[family-name:var(--font-inter)]">
            🔥 Calientes
          </span>
        </label>
        <button
          type="button"
          onClick={downloadCsv}
          className="h-11 px-4 rounded-lg bg-[#00FF66] text-[#0A0A0A] font-[family-name:var(--font-space-grotesk)] text-[14px] font-semibold hover:bg-[#00CC52] transition-colors"
        >
          Descargar CSV ({filtered.length})
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-[#1A1A1A]">
        <table className="w-full text-[13px] font-[family-name:var(--font-inter)]">
          <thead className="bg-[#111] text-[#A0A0A0] text-left uppercase tracking-wider text-[11px]">
            <tr>
              <th className="px-3 py-2.5 font-medium">🔥</th>
              <th className="px-3 py-2.5 font-medium">Creado</th>
              <th className="px-3 py-2.5 font-medium">Nombre</th>
              <th className="px-3 py-2.5 font-medium">Contacto</th>
              <th className="px-3 py-2.5 font-medium">Escuela</th>
              <th className="px-3 py-2.5 font-medium">Grado</th>
              <th className="px-3 py-2.5 font-medium">Test 1</th>
              <th className="px-3 py-2.5 font-medium">Test 2</th>
              <th className="px-3 py-2.5 font-medium">Fuente</th>
              <th className="px-3 py-2.5 font-medium">Notas</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={10}
                  className="px-3 py-8 text-center text-[#A0A0A0]"
                >
                  No hay leads que coincidan con los filtros.
                </td>
              </tr>
            )}
            {filtered.map((r) => (
              <LeadRowView key={r.id} row={r} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function LeadRowView({ row }: { row: LeadRow }) {
  const [hot, setHot] = useState(row.hotFlag);
  const [pending, startTransition] = useTransition();

  const toggleHot = () => {
    const next = !hot;
    setHot(next); // optimistic
    startTransition(async () => {
      const res = await toggleHotFlag(row.id, next);
      if (!res.success) setHot(!next); // rollback
    });
  };

  const waHref = row.phone
    ? `https://wa.me/${row.phone.replace(/\D/g, "")}`
    : null;
  const mailHref = row.email ? `mailto:${row.email}` : null;

  return (
    <tr className="border-t border-[#1A1A1A] hover:bg-[#0F0F0F]">
      <td className="px-3 py-2.5">
        <button
          type="button"
          onClick={toggleHot}
          disabled={pending}
          aria-pressed={hot}
          aria-label={hot ? "Marcar como frío" : "Marcar como caliente"}
          className="text-base min-h-8 min-w-8 leading-none transition-transform hover:scale-110"
          title={hot ? "Caliente" : "Marcar caliente"}
        >
          <span style={{ opacity: hot ? 1 : 0.2 }}>🔥</span>
        </button>
      </td>
      <td className="px-3 py-2.5 text-[#A0A0A0] whitespace-nowrap">
        {fmtDate(row.createdAt)}
      </td>
      <td className="px-3 py-2.5 text-[#F5F5F5] whitespace-nowrap">
        {row.name ?? "—"}
      </td>
      <td className="px-3 py-2.5 whitespace-nowrap">
        <div className="flex flex-col gap-0.5">
          {mailHref ? (
            <a
              href={mailHref}
              className="text-[#F5F5F5] hover:text-[#00FF66] truncate max-w-[220px]"
            >
              {row.email}
            </a>
          ) : (
            <span className="text-[#A0A0A0]">—</span>
          )}
          {waHref ? (
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#A0A0A0] hover:text-[#25D366] text-[12px]"
            >
              {row.phone}
            </a>
          ) : null}
        </div>
      </td>
      <td className="px-3 py-2.5 text-[#F5F5F5] whitespace-nowrap">
        {row.school ?? "—"}
      </td>
      <td className="px-3 py-2.5 text-[#A0A0A0] whitespace-nowrap">
        {row.grade ? (GRADE_LABELS[row.grade] ?? row.grade) : "—"}
      </td>
      <td className="px-3 py-2.5 whitespace-nowrap">
        {row.test1Profile ? (
          <span className="text-[#00FF66]">{row.test1Profile}</span>
        ) : (
          <span className="text-[#666]">—</span>
        )}
      </td>
      <td className="px-3 py-2.5 whitespace-nowrap">
        {row.test2Profile ? (
          <span className="text-[#FF6B35]">{row.test2Profile}</span>
        ) : (
          <span className="text-[#666]">—</span>
        )}
      </td>
      <td className="px-3 py-2.5 text-[#A0A0A0] whitespace-nowrap">
        {row.source ?? row.utmSource ?? (row.referrer ? "referrer" : "directo")}
      </td>
      <td className="px-3 py-2.5 align-top">
        <NotesCell leadId={row.id} initialNotes={row.notes} />
      </td>
    </tr>
  );
}

function NotesCell({
  leadId,
  initialNotes,
}: {
  leadId: string;
  initialNotes: string | null;
}) {
  const [notes, setNotes] = useState(initialNotes ?? "");
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(notes);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const startEdit = () => {
    setDraft(notes);
    setError(null);
    setEditing(true);
  };

  const cancel = () => {
    setDraft(notes);
    setError(null);
    setEditing(false);
  };

  const save = () => {
    const next = draft.trim();
    if (next === notes) {
      setEditing(false);
      return;
    }
    startTransition(async () => {
      const res = await updateLeadNotes(leadId, next);
      if (res.success) {
        setNotes(next);
        setEditing(false);
        setError(null);
      } else {
        setError(res.error ?? "No se pudo guardar.");
      }
    });
  };

  if (editing) {
    return (
      <div className="flex flex-col gap-2 w-[240px]">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              e.preventDefault();
              cancel();
            } else if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
              e.preventDefault();
              save();
            }
          }}
          rows={3}
          maxLength={2000}
          autoFocus
          aria-label="Notas del lead"
          placeholder="Conversación, follow-up, contexto…"
          className="w-full px-2 py-1.5 rounded bg-[#0A0A0A] border border-[#1A1A1A] text-[#F5F5F5] text-[12px] outline-none focus-visible:border-[#00FF6666] resize-y font-[family-name:var(--font-inter)]"
        />
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={save}
            disabled={pending}
            className="px-2.5 py-1 rounded bg-[#00FF66] text-[#0A0A0A] text-[11px] font-semibold hover:bg-[#00CC52] disabled:opacity-50"
          >
            {pending ? "Guardando…" : "Guardar"}
          </button>
          <button
            type="button"
            onClick={cancel}
            disabled={pending}
            className="px-2.5 py-1 rounded text-[#A0A0A0] text-[11px] hover:text-[#F5F5F5]"
          >
            Cancelar
          </button>
          <span className="ml-auto text-[10px] text-[#666]">
            {draft.length}/2000
          </span>
        </div>
        {error && (
          <p role="alert" className="text-[11px] text-[#FF6B6B]">
            {error}
          </p>
        )}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={startEdit}
      className="text-left max-w-[200px] group min-h-8"
      aria-label={notes ? "Editar nota" : "Agregar nota"}
    >
      {notes ? (
        <span className="block text-[#F5F5F5] text-[12px] leading-snug line-clamp-3 whitespace-pre-wrap group-hover:text-[#00FF66] transition-colors">
          {notes}
        </span>
      ) : (
        <span className="text-[#666] text-[12px] group-hover:text-[#00FF66] transition-colors">
          + nota
        </span>
      )}
    </button>
  );
}

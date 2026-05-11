"use client";

import { useActionState } from "react";
import { loginAction } from "../actions";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, {});
  return (
    <form action={formAction} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1.5">
        <span className="font-[family-name:var(--font-inter)] text-[13px] text-[#A0A0A0]">
          Contraseña
        </span>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          autoFocus
          required
          className="h-[52px] px-4 rounded-xl bg-[#00FF6608] border border-[#1A1A1A] text-[#F5F5F5] text-[16px] outline-none focus-visible:border-[#00FF6666] transition-colors"
          aria-invalid={state.error ? "true" : undefined}
          aria-describedby={state.error ? "login-error" : undefined}
        />
      </label>
      {state.error && (
        <p
          id="login-error"
          role="alert"
          className="text-[13px] font-[family-name:var(--font-inter)] text-[#FF6B6B]"
        >
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="h-[52px] mt-2 rounded-xl bg-[#00FF66] text-[#0A0A0A] font-[family-name:var(--font-space-grotesk)] text-[16px] font-semibold tracking-tight shadow-[0_0_40px_rgba(0,255,102,0.2)] hover:bg-[#00CC52] active:scale-[0.97] transition-all disabled:opacity-50"
      >
        {pending ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}

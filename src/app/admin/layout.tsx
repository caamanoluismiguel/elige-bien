import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Admin — Elige Bien",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-[#0A0A0A] text-[#F5F5F5]">{children}</div>
  );
}

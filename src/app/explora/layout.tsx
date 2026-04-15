import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explora — Elige Bien",
  robots: { index: false, follow: false },
};

export default function ExploraLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

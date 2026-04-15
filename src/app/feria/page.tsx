import type { Metadata } from "next";
import { FeriaDisplay } from "@/components/feria/feria-display";

export const metadata: Metadata = {
  title: "Feria Mode",
  robots: "noindex",
};

export default function FeriaPage() {
  return <FeriaDisplay />;
}

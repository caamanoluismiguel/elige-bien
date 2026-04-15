"use client";

import { ExploraClient } from "@/components/explora/explora-client";

export default function ExploraPage() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black p-8 text-center text-white">
        <p className="max-w-md text-sm">
          Falta configurar Google Maps. Define{" "}
          <code className="rounded bg-white/10 px-1.5 py-0.5">
            NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
          </code>{" "}
          en .env.local
        </p>
      </div>
    );
  }
  return <ExploraClient apiKey={apiKey} />;
}

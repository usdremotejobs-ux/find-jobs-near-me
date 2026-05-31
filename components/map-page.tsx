"use client";

import dynamic from "next/dynamic";

const CompanyMap = dynamic(() => import("@/components/company-map"), {
  ssr: false,
  loading: () => (
    <main className="grid min-h-dvh place-items-center bg-[#08090d] text-sm text-zinc-400">
      Loading map...
    </main>
  ),
});

export default function MapPage() {
  return <CompanyMap />;
}

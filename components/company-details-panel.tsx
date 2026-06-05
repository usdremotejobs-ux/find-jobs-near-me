"use client";

import { useEffect, useState } from "react";
import type { Company } from "@/data/companies";
import type { Job } from "@/data/jobs";

type CompanyWithJobs = Company & {
  jobs: Job[];
  jobsCount: number;
};

type CompanyDetailsPanelProps = {
  company: CompanyWithJobs | null;
  onClose: () => void;
};

export default function CompanyDetailsPanel({
  company,
  onClose,
}: CompanyDetailsPanelProps) {
  const isOpen = Boolean(company);
  const [visibleCompany, setVisibleCompany] = useState<CompanyWithJobs | null>(company);

  useEffect(() => {
    if (company) {
      setVisibleCompany(company);
      return;
    }

    const timeoutId = window.setTimeout(() => setVisibleCompany(null), 300);
    return () => window.clearTimeout(timeoutId);
  }, [company]);

  return (
    <aside
      aria-hidden={!isOpen}
      className={[
        "pointer-events-none fixed inset-x-0 bottom-0 z-[500] p-3 transition-all duration-300 ease-out md:inset-y-0 md:left-auto md:right-0 md:w-[392px] md:p-4",
        isOpen
          ? "translate-y-0 opacity-100 md:translate-x-0"
          : "translate-y-full opacity-0 md:translate-x-full md:translate-y-0",
      ].join(" ")}
    >
      {visibleCompany ? (
        <div className="pointer-events-auto flex max-h-[46dvh] flex-col overflow-hidden rounded-[28px] border border-white/[0.12] bg-[#10131b]/92 shadow-[0_30px_100px_rgba(0,0,0,0.58)] backdrop-blur-2xl md:h-full md:max-h-none md:rounded-[30px]">
          <div className="mx-auto mt-3 h-1.5 w-11 rounded-full bg-white/[0.18] md:hidden" />

          <div className="flex flex-col border-b border-white/[0.08] px-5 pb-5 pt-4 md:px-6 md:pb-6 md:pt-6">
            {/* Top row: Logo, Name, and Close Button */}
            <div className="flex items-center gap-4">
              <img
                src={visibleCompany.logoUrl}
                alt={`${visibleCompany.name} logo`}
                className="h-16 w-16 rounded-[20px] bg-white p-2 shadow-[0_18px_36px_rgba(0,0,0,0.34)]"
              />

              <div className="min-w-0 flex-1 pt-0.5">
                <div className="mb-1.5 inline-flex rounded-full border border-white/[0.10] bg-white/[0.075] px-2.5 py-1 text-[11px] font-semibold leading-none text-zinc-300">
                  {visibleCompany.category}
                </div>
                <h2 className="truncate text-[25px] font-semibold leading-[1.08] text-white md:text-[27px]">
                  {visibleCompany.name}
                </h2>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/[0.10] bg-white/[0.075] text-sm font-semibold leading-none text-zinc-300 transition hover:bg-white/[0.14] hover:text-white"
                aria-label="Close company details"
              >
                X
              </button>
            </div>

            {/* Bottom details block: jobs, description, and address aligned left */}
            <div className="mt-4">
              <p className="text-sm font-medium leading-5 text-zinc-400">
                {visibleCompany.jobsCount} open {visibleCompany.jobsCount === 1 ? "job" : "jobs"}
              </p>
              <p className="mt-2 text-[13px] font-medium leading-5 text-zinc-300">
                {visibleCompany.oneLiner}
              </p>
              <p className="mt-1 text-[12px] font-medium leading-4 text-zinc-500">
                {visibleCompany.address}
              </p>
            </div>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4 md:px-5">
            {/* USD Remote Jobs Glowing Strip */}
            <a
              href="https://usdremotejobs.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-3 rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 px-4 py-3 text-xs font-semibold text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.06)] backdrop-blur-md transition-all duration-300 hover:border-emerald-500/40 hover:bg-gradient-to-r hover:from-emerald-500/15 hover:to-teal-500/15 hover:text-emerald-300 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] hover:scale-[1.01]"
            >
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>Get a Remote Job with USD Salary</span>
              </div>
              <span className="text-emerald-500 transition hover:translate-x-0.5">→</span>
            </a>

            {visibleCompany.jobs.length === 0 ? (
              <div className="rounded-[20px] border border-white/[0.09] bg-white/[0.052] p-4 text-[13px] font-medium leading-5 text-zinc-400">
                No matching jobs for the current search or filter.
              </div>
            ) : null}

            {visibleCompany.jobs.map((job) => (
              <article
                key={job.id}
                className="rounded-[20px] border border-white/[0.09] bg-white/[0.052] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.035)] transition hover:border-white/[0.15] hover:bg-white/[0.072]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-[14px] font-semibold leading-5 text-white">{job.title}</h3>
                    <p className="mt-1.5 text-[12px] font-medium leading-4 text-zinc-400">
                      {job.team} / {job.experienceLevel}
                    </p>
                    <p className="mt-2 line-clamp-2 text-[12px] leading-4 text-zinc-500">
                      {job.shortDescription}
                    </p>
                  </div>

                  <a
                    href={job.applyUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="shrink-0 rounded-full bg-white px-3.5 py-2 text-[12px] font-semibold leading-none text-[#10131b] shadow-[0_10px_24px_rgba(0,0,0,0.25)] transition hover:-translate-y-0.5 hover:bg-zinc-200"
                  >
                    Apply
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      ) : null}
    </aside>
  );
}

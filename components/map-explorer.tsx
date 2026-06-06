"use client";

export const filterOptions = [
  "Engineering",
  "Design",
  "Marketing",
  "Sales",
  "Product",
  "Operations",
] as const;

export type FilterOption = (typeof filterOptions)[number];

type MapExplorerProps = {
  searchQuery: string;
  activeFilter: FilterOption | null;
  visibleCompaniesCount: number;
  visibleJobsCount: number;
  onSearchChange: (value: string) => void;
  onFilterChange: (filter: FilterOption | null) => void;
};

export default function MapExplorer({
  searchQuery,
  activeFilter,
  visibleCompaniesCount,
  visibleJobsCount,
  onSearchChange,
  onFilterChange,
}: MapExplorerProps) {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-3 z-[450] flex flex-col items-center gap-2 px-3 sm:top-5">
      <div className="pointer-events-auto w-full max-w-[560px]">
        <label className="relative block">
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Company or address"
            className="h-12 w-full rounded-full border border-white/[0.11] bg-[#10131b]/88 px-5 text-[14px] font-medium text-white shadow-[0_18px_55px_rgba(0,0,0,0.34)] outline-none backdrop-blur-2xl transition placeholder:text-zinc-500 focus:border-white/[0.20] focus:bg-[#121621]/94 focus:shadow-[0_22px_68px_rgba(0,0,0,0.42)]"
          />
        </label>
      </div>

      <div className="pointer-events-auto w-full overflow-x-auto px-1 [scrollbar-width:none] sm:flex sm:justify-center">
        <div className="flex min-w-max gap-2 pb-1">
          {filterOptions.map((filter) => {
            const isActive = activeFilter === filter;

            return (
              <button
                key={filter}
                type="button"
                onClick={() => onFilterChange(isActive ? null : filter)}
                className={[
                  "rounded-full border px-3.5 py-2 text-[12px] font-semibold leading-none shadow-[0_12px_28px_rgba(0,0,0,0.22)] backdrop-blur-xl transition duration-200 hover:-translate-y-0.5",
                  isActive
                    ? "border-white/70 bg-white text-[#10131b]"
                    : "border-white/[0.10] bg-[#10131b]/76 text-zinc-300 hover:border-white/[0.18] hover:bg-[#151925]/88 hover:text-white",
                ].join(" ")}
              >
                {filter}
              </button>
            );
          })}
        </div>
      </div>

      <div className="pointer-events-none rounded-full border border-white/[0.10] bg-[#10131b]/78 px-3.5 py-2 text-[12px] font-semibold leading-none text-zinc-300 shadow-[0_14px_34px_rgba(0,0,0,0.28)] backdrop-blur-xl">
        {visibleCompaniesCount} companies / {visibleJobsCount} open jobs
      </div>
    </div>
  );
}

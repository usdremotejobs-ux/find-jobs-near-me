"use client";

import L from "leaflet";
import { useEffect, useMemo, useState } from "react";
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from "react-leaflet";
import CompanyDetailsPanel from "@/components/company-details-panel";
import MapExplorer, { type FilterOption } from "@/components/map-explorer";
import { companies, type Company } from "@/data/companies";
import { jobs, type Job } from "@/data/jobs";

const bangaloreCenter: [number, number] = [12.9716, 77.5946];

type CompanyWithJobs = Company & {
  jobs: Job[];
  jobsCount: number;
};

type PositionedCompany = CompanyWithJobs & {
  displayLatitude: number;
  displayLongitude: number;
};

function createCompanyIcon(logoUrl: string, name: string, isSelected: boolean) {
  const initials = name
    .split(/[\s.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return L.divIcon({
    className: "",
    html: `
      <div class="company-marker${isSelected ? " company-marker-selected" : ""}">
        <span>${initials}</span>
        <img src="${logoUrl}" alt="${name} logo" onerror="this.style.display='none'" />
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18],
  });
}

function MapCloseHandler({ onClose }: { onClose: () => void }) {
  useMapEvents({
    click: onClose,
  });

  return null;
}

function MapFocusHandler({ company }: { company: PositionedCompany | null }) {
  const map = useMap();

  useEffect(() => {
    if (!company) {
      return;
    }

    const currentZoom = map.getZoom();
    const targetZoom = Math.min(Math.max(currentZoom + 0.55, 13.35), 14.2);

    map.flyTo([company.displayLatitude, company.displayLongitude], targetZoom, {
      animate: true,
      duration: 1.05,
      easeLinearity: 0.22,
    });
  }, [company, map]);

  return null;
}

export default function CompanyMap() {
  const [selectedCompany, setSelectedCompany] = useState<PositionedCompany | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterOption | null>(null);

  const visibleCompanies = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return companies.flatMap((company) => {
      if (!company.hiring) {
        return [];
      }

      const companyJobs = jobs.filter((job) => job.companyId === company.id);
      const companyMatchesSearch =
        normalizedQuery.length === 0 ||
        company.name.toLowerCase().includes(normalizedQuery) ||
        company.address.toLowerCase().includes(normalizedQuery) ||
        company.category.toLowerCase().includes(normalizedQuery);

      const matchingJobs = companyJobs.filter((job) => {
        const jobMatchesSearch =
          normalizedQuery.length === 0 ||
          companyMatchesSearch ||
          job.title.toLowerCase().includes(normalizedQuery) ||
          job.team.toLowerCase().includes(normalizedQuery) ||
          job.category.toLowerCase().includes(normalizedQuery) ||
          job.experienceLevel.toLowerCase().includes(normalizedQuery) ||
          job.skills.some((skill) => skill.toLowerCase().includes(normalizedQuery));

        const jobMatchesFilter =
          activeFilter === null ||
          job.category === activeFilter ||
          job.team.toLowerCase().includes(activeFilter.toLowerCase()) ||
          job.experienceLevel.toLowerCase() === activeFilter.toLowerCase() ||
          job.skills.some((skill) => skill.toLowerCase() === activeFilter.toLowerCase());

        return jobMatchesSearch && jobMatchesFilter;
      });

      const shouldShowCompanyWithoutMatchingJobs =
        activeFilter === null && (normalizedQuery.length === 0 || companyMatchesSearch);

      if (matchingJobs.length === 0 && !shouldShowCompanyWithoutMatchingJobs) {
        return [];
      }

      return [{ ...company, jobs: matchingJobs, jobsCount: matchingJobs.length }];
    });
  }, [activeFilter, searchQuery]);

  const visibleJobsCount = useMemo(
    () => visibleCompanies.reduce((total, company) => total + company.jobs.length, 0),
    [visibleCompanies],
  );

  // Distribute overlapping or very close markers slightly adjacent to each other
  const positionedCompanies = useMemo<PositionedCompany[]>(() => {
    const threshold = 0.00045; // threshold distance in degrees (approx 50 meters)
    const offsetRadius = 0.00028; // offset radius in degrees (approx 30 meters)

    const result: PositionedCompany[] = visibleCompanies.map((c) => ({
      ...c,
      displayLatitude: c.latitude,
      displayLongitude: c.longitude,
    }));

    const clusters: PositionedCompany[][] = [];
    const visited = new Set<string>();

    for (let i = 0; i < result.length; i++) {
      const c1 = result[i];
      if (visited.has(c1.id)) continue;

      const cluster: PositionedCompany[] = [c1];
      visited.add(c1.id);

      for (let j = i + 1; j < result.length; j++) {
        const c2 = result[j];
        if (visited.has(c2.id)) continue;

        const latDiff = c1.latitude - c2.latitude;
        const lngDiff = c1.longitude - c2.longitude;
        const dist = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);

        if (dist < threshold) {
          cluster.push(c2);
          visited.add(c2.id);
        }
      }

      if (cluster.length > 1) {
        clusters.push(cluster);
      }
    }

    for (const cluster of clusters) {
      const n = cluster.length;
      const centerLat = cluster.reduce((sum, c) => sum + c.latitude, 0) / n;
      const centerLng = cluster.reduce((sum, c) => sum + c.longitude, 0) / n;

      for (let i = 0; i < n; i++) {
        const angle = (i * 2 * Math.PI) / n;
        cluster[i].displayLatitude = centerLat + offsetRadius * Math.cos(angle);
        cluster[i].displayLongitude = centerLng + offsetRadius * Math.sin(angle);
      }
    }

    return result;
  }, [visibleCompanies]);

  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSelectedCompany(null);
      }
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  useEffect(() => {
    if (!selectedCompany) {
      return;
    }

    const updatedSelectedCompany = positionedCompanies.find(
      (company) => company.id === selectedCompany.id,
    );

    if (!updatedSelectedCompany) {
      setSelectedCompany(null);
      return;
    }

    if (
      updatedSelectedCompany.id !== selectedCompany.id ||
      updatedSelectedCompany.displayLatitude !== selectedCompany.displayLatitude ||
      updatedSelectedCompany.displayLongitude !== selectedCompany.displayLongitude
    ) {
      setSelectedCompany(updatedSelectedCompany);
    }
  }, [selectedCompany, positionedCompanies]);

  return (
    <main className="relative h-dvh w-screen overflow-hidden bg-[#08090d]">
      <MapContainer
        center={bangaloreCenter}
        zoom={12}
        minZoom={11}
        maxZoom={18}
        zoomControl={false}
        scrollWheelZoom
        className="h-full w-full"
      >
        <MapCloseHandler onClose={() => setSelectedCompany(null)} />
        <MapFocusHandler company={selectedCompany} />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {positionedCompanies.map((company) => {
          const isSelected = selectedCompany?.id === company.id;

          return (
            <Marker
              key={company.id}
              position={[company.displayLatitude, company.displayLongitude]}
              icon={createCompanyIcon(company.logoUrl, company.name, isSelected)}
              eventHandlers={{
                click: () => setSelectedCompany(company),
              }}
            />
          );
        })}
      </MapContainer>

      <CompanyDetailsPanel
        company={selectedCompany}
        onClose={() => setSelectedCompany(null)}
      />

      <MapExplorer
        searchQuery={searchQuery}
        activeFilter={activeFilter}
        visibleCompaniesCount={visibleCompanies.length}
        visibleJobsCount={visibleJobsCount}
        onSearchChange={setSearchQuery}
        onFilterChange={setActiveFilter}
      />

      {/* USD Remote Jobs Floating Bubble */}
      <a
        href="https://usdremotejobs.com"
        target="_blank"
        rel="noopener noreferrer"
        className={[
          "fixed bottom-4 right-3 md:bottom-5 md:right-5 z-[480]",
          "pointer-events-auto flex items-center gap-3 rounded-2xl border border-white/[0.09] bg-[#10131b]/88 px-4 py-3 shadow-[0_20px_50px_rgba(0,0,0,0.45)] backdrop-blur-2xl transition-all duration-300 ease-out hover:border-white/[0.18] hover:bg-[#121621]/94 hover:shadow-[0_22px_55px_rgba(59,130,246,0.12)]",
          selectedCompany
            ? "translate-y-[-48dvh] md:translate-y-0 md:-translate-x-[392px]"
            : "translate-x-0 translate-y-0",
        ].join(" ")}
      >
        {/* Left Icon (Dollar / Globe badge) */}
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-[0_4px_12px_rgba(16,185,129,0.3)]">
          <span className="text-[16px] font-bold">$</span>
        </div>

        {/* Text Area */}
        <div className="min-w-0 flex-1">
          <h4 className="text-[13.5px] font-semibold leading-tight text-white flex items-center gap-1.5">
            USD Paying Remote Jobs
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </span>
          </h4>
          <p className="mt-0.5 text-[11px] font-medium leading-tight text-zinc-400">
            Remote Jobs with 3x more salary
          </p>
        </div>

        {/* Right Arrow */}
        <div className="text-zinc-400 transition hover:text-white pl-1">
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </a>
    </main>
  );
}

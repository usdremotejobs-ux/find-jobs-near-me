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
        <img src="${logoUrl}" alt="${name} logo" loading="lazy" onerror="this.style.display='none'" />
      </div>
    `,
    iconSize: [58, 58],
    iconAnchor: [29, 29],
    popupAnchor: [0, -29],
  });
}

function MapCloseHandler({ onClose }: { onClose: () => void }) {
  useMapEvents({
    click: onClose,
  });

  return null;
}

function MapFocusHandler({ company }: { company: CompanyWithJobs | null }) {
  const map = useMap();

  useEffect(() => {
    if (!company) {
      return;
    }

    const currentZoom = map.getZoom();
    const targetZoom = Math.min(Math.max(currentZoom + 0.55, 13.35), 14.2);

    map.flyTo([company.latitude, company.longitude], targetZoom, {
      animate: true,
      duration: 1.05,
      easeLinearity: 0.22,
    });
  }, [company, map]);

  return null;
}

export default function CompanyMap() {
  const [selectedCompany, setSelectedCompany] = useState<CompanyWithJobs | null>(null);
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

      if (matchingJobs.length === 0) {
        return [];
      }

      return [{ ...company, jobs: matchingJobs, jobsCount: matchingJobs.length }];
    });
  }, [activeFilter, searchQuery]);

  const visibleJobsCount = useMemo(
    () => visibleCompanies.reduce((total, company) => total + company.jobs.length, 0),
    [visibleCompanies],
  );

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

    const updatedSelectedCompany = visibleCompanies.find(
      (company) => company.id === selectedCompany.id,
    );

    if (!updatedSelectedCompany) {
      setSelectedCompany(null);
      return;
    }

    if (updatedSelectedCompany !== selectedCompany) {
      setSelectedCompany(updatedSelectedCompany);
    }
  }, [selectedCompany, visibleCompanies]);

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

        {visibleCompanies.map((company) => {
          const isSelected = selectedCompany?.id === company.id;

          return (
            <Marker
              key={company.id}
              position={[company.latitude, company.longitude]}
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
    </main>
  );
}

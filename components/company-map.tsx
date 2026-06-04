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
    </main>
  );
}

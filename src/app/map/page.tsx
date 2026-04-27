"use client";

import { useMemo, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  GoogleMap,
  InfoWindow,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import { useQuery } from "@tanstack/react-query";

const MAP_ENDPOINT =
  "https://asia-south1-ngo-dashboard-ade99.cloudfunctions.net/getMapData";

const defaultCenter = { lat: 19.2183, lng: 72.9781 };

type MapLayer = "reports" | "assignments" | "volunteers";

export default function MapPage() {
  return (
    <DashboardLayout>
      <MapContent />
    </DashboardLayout>
  );
}

function MapContent() {
  const [activeLayer, setActiveLayer] = useState<MapLayer>("reports");
  const [selected, setSelected] = useState<any>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["map-data"],
    queryFn: async () => {
      const res = await fetch(MAP_ENDPOINT);
      if (!res.ok) throw new Error("Failed to fetch map data");
      return res.json();
    },
  });

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const reports = data?.reports ?? [];
  const assignments = data?.assignments ?? [];
  const volunteers = data?.volunteers ?? [];
  const summary = data?.summary ?? {};

  const activeMarkers =
    activeLayer === "reports"
      ? reports
      : activeLayer === "assignments"
      ? assignments
      : volunteers;

  const renderMarkers = useMemo(
    () => spreadDuplicateMarkers(activeMarkers),
    [activeMarkers]
  );

  const visibleLocations = getUniqueLocationCount(activeMarkers);

  const center = useMemo(() => {
    const first = activeMarkers.find((m: any) => m.latitude && m.longitude);

    if (first) {
      return {
        lat: Number(first.latitude),
        lng: Number(first.longitude),
      };
    }

    return defaultCenter;
  }, [activeMarkers]);

  if (isLoading) return <div className="p-6">Loading map intelligence...</div>;

  if (error) {
    return (
      <div className="p-6 text-red-600">
        Failed to load map data from backend.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 p-6 max-w-screen-2xl mx-auto animate-page-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Live Operations Map
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Switch between incident reports, AI assignments, and volunteer execution layers.
        </p>
      </div>

      <LayerTabs
        activeLayer={activeLayer}
        setActiveLayer={(layer) => {
          setActiveLayer(layer);
          setSelected(null);
        }}
      />

      <LayerKpis
        activeLayer={activeLayer}
        reports={reports}
        assignments={assignments}
        volunteers={volunteers}
        summary={summary}
      />

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_350px] gap-5 items-start">
        <div className="card overflow-hidden h-[560px] relative">
          <div className="absolute left-4 top-4 z-10">
            <LayerBadge
              activeLayer={activeLayer}
              count={activeMarkers.length}
              locations={visibleLocations}
            />
          </div>

          <div className="absolute right-4 top-4 z-10 rounded-2xl bg-white/95 border border-gray-100 shadow-sm p-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">
              {getLayerTitle(activeLayer)} Legend
            </p>
            <MapLegend activeLayer={activeLayer} />
          </div>

          {!isLoaded ? (
            <div className="h-full flex items-center justify-center text-gray-500">
              Loading Google Map...
            </div>
          ) : (
            <GoogleMap
              mapContainerStyle={{ width: "100%", height: "100%" }}
              center={center}
              zoom={12}
              options={{
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: true,
              }}
            >
              {renderMarkers.map((marker: any, index: number) => (
                <Marker
                  key={`${activeLayer}-${marker.id || index}`}
                  position={{
                    lat: marker.__lat,
                    lng: marker.__lng,
                  }}
                  icon={markerIcon(
                    marker.marker_color || getFallbackColor(activeLayer)
                  )}
                  onClick={() =>
                    setSelected({
                      type: activeLayer,
                      ...marker,
                    })
                  }
                />
              ))}

              {selected && (
                <InfoWindow
                  position={{
                    lat: selected.__lat ?? Number(selected.latitude),
                    lng: selected.__lng ?? Number(selected.longitude),
                  }}
                  onCloseClick={() => setSelected(null)}
                >
                  <div className="min-w-[230px]">
                    <p className="text-xs font-bold text-[#4d7c56] uppercase">
                      {getLayerTitle(activeLayer)}
                    </p>
                    <h3 className="text-sm font-bold text-gray-900 mt-1">
                      {getMarkerTitle(selected, activeLayer)}
                    </h3>
                    <p className="text-xs text-gray-600 mt-1">
                      {getMarkerSubtitle(selected, activeLayer)}
                    </p>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          )}
        </div>

        <MapSidePanel
          activeLayer={activeLayer}
          selected={selected}
          reports={reports}
          assignments={assignments}
          volunteers={volunteers}
          summary={summary}
          visibleLocations={visibleLocations}
        />
      </div>
    </div>
  );
}

function LayerTabs({
  activeLayer,
  setActiveLayer,
}: {
  activeLayer: MapLayer;
  setActiveLayer: (layer: MapLayer) => void;
}) {
  const tabs: { id: MapLayer; label: string; icon: string; desc: string }[] = [
    {
      id: "reports",
      label: "Reports Map",
      icon: "🚨",
      desc: "Raw field incidents",
    },
    {
      id: "assignments",
      label: "Assignments Map",
      icon: "⚡",
      desc: "AI decisions",
    },
    {
      id: "volunteers",
      label: "Volunteers Map",
      icon: "👥",
      desc: "Execution layer",
    },
  ];

  return (
    <div className="rounded-2xl bg-white border border-gray-100 p-2 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        {tabs.map((tab) => {
          const active = activeLayer === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveLayer(tab.id)}
              className={`relative rounded-xl p-4 text-left transition-all ${
                active
                  ? "bg-[#2e5233] text-white shadow-md"
                  : "bg-gray-50 text-gray-700 hover:bg-[#f2f7f3]"
              }`}
            >
              {active && (
                <span className="absolute right-3 top-3 rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold">
                  ACTIVE
                </span>
              )}

              <div className="flex items-center gap-3">
                <div
                  className={`h-10 w-10 rounded-xl flex items-center justify-center text-lg ${
                    active ? "bg-white/15" : "bg-white"
                  }`}
                >
                  {tab.icon}
                </div>

                <div>
                  <p className="text-sm font-bold">{tab.label}</p>
                  <p
                    className={`text-xs mt-0.5 ${
                      active ? "text-white/70" : "text-gray-500"
                    }`}
                  >
                    {tab.desc}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function LayerKpis({
  activeLayer,
  reports,
  assignments,
  volunteers,
  summary,
}: {
  activeLayer: MapLayer;
  reports: any[];
  assignments: any[];
  volunteers: any[];
  summary: any;
}) {
  if (activeLayer === "reports") {
    const medical = reports.filter(
      (r: any) => normalize(r.category) === "medical"
    ).length;
    const food = reports.filter((r: any) => normalize(r.category) === "food")
      .length;

    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Kpi title="Mapped Reports" value={reports.length} />
        <Kpi title="Medical Reports" value={medical} />
        <Kpi title="Food Reports" value={food} />
        <Kpi
          title="Hotspot Zone"
          value={summary.hotspot_zone || "N/A"}
          sub={`${summary.hotspot_zone_case_count ?? 0} cases`}
        />
      </div>
    );
  }

  if (activeLayer === "assignments") {
    const p1 = assignments.filter(
      (a: any) => Number(a.priority_rank) === 1
    ).length;
    const pending = assignments.filter(
      (a: any) => normalize(a.assignment_status) === "pending"
    ).length;

    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Kpi title="Mapped Assignments" value={assignments.length} />
        <Kpi title="Priority 1" value={p1} />
        <Kpi title="Pending" value={pending} />
        <Kpi title="Decision Layer" value="Active" />
      </div>
    );
  }

  const available = volunteers.filter((v: any) => {
    const status = normalize(v.availability_status || v.status);
    return status === "available" || v.marker_color === "green";
  }).length;

  const busy = Math.max(volunteers.length - available, 0);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <Kpi title="Mapped Volunteers" value={volunteers.length} />
      <Kpi title="Available" value={available} />
      <Kpi title="Busy" value={busy} />
      <Kpi title="Execution Layer" value="Live" />
    </div>
  );
}

function Kpi({ title, value, sub }: { title: string; value: any; sub?: string }) {
  return (
    <div className="card px-5 py-4">
      <p className="text-[12px] font-semibold text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      {sub && <p className="text-[11px] text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

function LayerBadge({
  activeLayer,
  count,
  locations,
}: {
  activeLayer: MapLayer;
  count: number;
  locations: number;
}) {
  return (
    <div className="rounded-full bg-[#2e5233] text-white px-4 py-2 text-xs font-bold shadow-lg">
      {getLayerTitle(activeLayer)} • {count} records • {locations} locations
    </div>
  );
}

function MapLegend({ activeLayer }: { activeLayer: MapLayer }) {
  if (activeLayer === "reports") {
    return (
      <>
        <LegendItem color="bg-red-500" label="Medical report" />
        <LegendItem color="bg-orange-400" label="Food report" />
        <LegendItem color="bg-purple-500" label="Shelter report" />
        <LegendItem color="bg-gray-400" label="General report" />
      </>
    );
  }

  if (activeLayer === "assignments") {
    return (
      <>
        <LegendItem color="bg-red-500" label="Priority 1" />
        <LegendItem color="bg-yellow-400" label="Priority 2" />
        <LegendItem color="bg-blue-500" label="Priority 3" />
      </>
    );
  }

  return (
    <>
      <LegendItem color="bg-green-500" label="Available volunteer" />
      <LegendItem color="bg-blue-500" label="Busy volunteer" />
    </>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
      <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
      {label}
    </div>
  );
}

function MapSidePanel({
  activeLayer,
  selected,
  reports,
  assignments,
  volunteers,
  summary,
  visibleLocations,
}: {
  activeLayer: MapLayer;
  selected: any;
  reports: any[];
  assignments: any[];
  volunteers: any[];
  summary: any;
  visibleLocations: number;
}) {
  return (
    <div className="h-[560px] overflow-y-auto pr-1 flex flex-col gap-4">
      <div className="card p-5">
        <p className="section-label mb-4">Selected Marker Details</p>

        {!selected ? (
          <p className="text-sm text-gray-500">
            Click any {getLayerTitle(activeLayer).toLowerCase()} marker to view
            details.
          </p>
        ) : (
          <SelectedDetails selected={selected} activeLayer={activeLayer} />
        )}
      </div>

      <div className="card p-5 bg-gradient-to-r from-[#f2f7f3] to-white border border-[#e0ede2]">
        <p className="section-label mb-4">Layer Explanation</p>
        <p className="text-sm text-gray-700 leading-relaxed">
          {getLayerExplanation(activeLayer)}
        </p>
      </div>

      <div className="card p-5">
        <p className="section-label mb-4">Map Counts</p>
        <div className="space-y-3">
          <Info label="Reports" value={reports.length} />
          <Info label="Assignments" value={assignments.length} />
          <Info label="Volunteers" value={volunteers.length} />
          <Info label="Visible Locations" value={visibleLocations} />
          <Info label="Hotspot" value={summary.hotspot_zone || "N/A"} />
        </div>
      </div>
    </div>
  );
}

function SelectedDetails({
  selected,
  activeLayer,
}: {
  selected: any;
  activeLayer: MapLayer;
}) {
  if (activeLayer === "reports") {
    return (
      <div className="space-y-3">
        <TitleBlock
          title={getMarkerTitle(selected, activeLayer)}
          type="Raw Incident"
        />
        <Info label="Category" value={selected.category || "N/A"} />
        <Info label="Zone" value={selected.zone_label || "N/A"} />
        <Info label="Location" value={selected.location_name || "N/A"} />
        <Info label="Color" value={selected.marker_color || "N/A"} />
      </div>
    );
  }

  if (activeLayer === "assignments") {
    return (
      <div className="space-y-3">
        <TitleBlock
          title={getMarkerTitle(selected, activeLayer)}
          type="AI Decision"
        />
        <Info
          label="Priority"
          value={selected.priority_rank ? `P${selected.priority_rank}` : "N/A"}
        />
        <Info label="Status" value={selected.assignment_status || "N/A"} />
        <Info label="Resource" value={selected.recommended_resource || "N/A"} />
        <Info label="Zone" value={selected.zone_label || "N/A"} />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <TitleBlock
        title={getMarkerTitle(selected, activeLayer)}
        type="Volunteer"
      />
      <Info label="Skill" value={selected.skill_type || "N/A"} />
      <Info
        label="Availability"
        value={selected.availability_status || selected.status || "N/A"}
      />
      <Info label="Assigned Zone" value={selected.assigned_zone || "N/A"} />
      <Info label="Color" value={selected.marker_color || "N/A"} />
    </div>
  );
}

function TitleBlock({ title, type }: { title: string; type: string }) {
  return (
    <div>
      <p className="text-xs text-gray-400 font-bold uppercase">{type}</p>
      <h3 className="text-lg font-bold text-gray-900 mt-1">{title}</h3>
    </div>
  );
}

function Info({ label, value }: { label: string; value: any }) {
  return (
    <div className="rounded-xl bg-white border border-gray-100 p-3">
      <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">
        {label}
      </p>
      <p className="text-sm font-bold text-[#2e5233] mt-1">
        {formatLabel(String(value))}
      </p>
    </div>
  );
}

function spreadDuplicateMarkers(markers: any[]) {
  const groups: Record<string, any[]> = {};

  markers.forEach((marker) => {
    const lat = Number(marker.latitude);
    const lng = Number(marker.longitude);

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

    const key = `${lat.toFixed(5)},${lng.toFixed(5)}`;

    if (!groups[key]) groups[key] = [];
    groups[key].push(marker);
  });

  const result: any[] = [];

  Object.values(groups).forEach((group) => {
    group.forEach((marker, index) => {
      const lat = Number(marker.latitude);
      const lng = Number(marker.longitude);

      const angle = (index / Math.max(group.length, 1)) * Math.PI * 2;
      const offset = group.length > 1 ? 0.0012 : 0;

      result.push({
        ...marker,
        __lat: lat + Math.cos(angle) * offset,
        __lng: lng + Math.sin(angle) * offset,
      });
    });
  });

  return result;
}

function getUniqueLocationCount(markers: any[]) {
  const locations = new Set<string>();

  markers.forEach((marker: any) => {
    const lat = Number(marker.latitude);
    const lng = Number(marker.longitude);

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

    locations.add(`${lat.toFixed(5)},${lng.toFixed(5)}`);
  });

  return locations.size;
}

function getLayerTitle(layer: MapLayer) {
  if (layer === "reports") return "Reports";
  if (layer === "assignments") return "Assignments";
  return "Volunteers";
}

function getLayerExplanation(layer: MapLayer) {
  if (layer === "reports") {
    return "Reports show raw incidents coming from the field before or during AI processing. Multiple reports may share the same location, so overlapping markers are slightly spread for visibility.";
  }

  if (layer === "assignments") {
    return "Assignments show AI decisions generated after processing reports. This layer answers what actions the AI created and where they apply.";
  }

  return "Volunteers show the execution layer of the response system. This layer answers who is available or busy on the ground.";
}

function getMarkerTitle(marker: any, layer: MapLayer) {
  if (layer === "reports") {
    return marker.title || marker.category || marker.location_name || "Report";
  }

  if (layer === "assignments") {
    return (
      marker.location_name ||
      marker.category ||
      marker.assigned_team ||
      "Assignment"
    );
  }

  return marker.name || marker.volunteer_name || "Volunteer";
}

function getMarkerSubtitle(marker: any, layer: MapLayer) {
  if (layer === "reports") {
    return `${formatLabel(marker.category || "incident")} report`;
  }

  if (layer === "assignments") {
    return `Priority ${marker.priority_rank || "N/A"} • ${
      marker.assignment_status || "pending"
    }`;
  }

  return `${formatLabel(
    marker.availability_status || marker.status || "unknown"
  )} volunteer`;
}

function getFallbackColor(layer: MapLayer) {
  if (layer === "reports") return "gray";
  if (layer === "assignments") return "yellow";
  return "green";
}

function markerIcon(color: string) {
  const normalized = String(color || "gray").toLowerCase();

  const colorMap: Record<string, string> = {
    red: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
    orange: "http://maps.google.com/mapfiles/ms/icons/orange-dot.png",
    yellow: "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
    green: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
    blue: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
    purple: "http://maps.google.com/mapfiles/ms/icons/purple-dot.png",
    gray: "http://maps.google.com/mapfiles/ms/icons/ltblue-dot.png",
  };

  return {
    url: colorMap[normalized] || colorMap.gray,
  };
}

function normalize(value: any) {
  return String(value || "").toLowerCase().trim();
}

function formatLabel(value: string) {
  return String(value || "N/A")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
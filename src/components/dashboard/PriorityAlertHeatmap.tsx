"use client";

import { useMemo, useState } from "react";
import {
  GoogleMap,
  InfoWindow,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import { useQuery } from "@tanstack/react-query";

const MAP_ENDPOINT =
  "https://asia-south1-ngo-dashboard-ade99.cloudfunctions.net/getMapData";

const defaultCenter = {
  lat: 19.2183,
  lng: 72.9781,
};

export function PriorityAlertHeatmap({
  summary,
  latestReport,
  latestDecision,
  latestAssignment,
}: {
  summary: any;
  latestReport: any;
  latestDecision: any;
  latestAssignment: any;
}) {
  const [selected, setSelected] = useState<any>(null);

  const { data } = useQuery({
    queryKey: ["dashboard-map-data"],
    queryFn: async () => {
      const res = await fetch(MAP_ENDPOINT);
      if (!res.ok) throw new Error("Failed to fetch dashboard map data");
      return res.json();
    },
  });

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const reports = data?.reports ?? [];
  const assignments = data?.assignments ?? [];
  const volunteers = data?.volunteers ?? [];
  const mapSummary = data?.summary ?? {};

  const category = latestDecision?.category || latestReport?.category || "case";

  const urgency =
    latestDecision?.urgency_score ??
    latestDecision?.urgency ??
    summary?.average_urgency ??
    summary?.urgent_dispatch_pending ??
    0;

  const title = latestReport?.title || `High Priority ${category}`;

  const location =
    latestReport?.location_name ||
    latestReport?.location ||
    latestDecision?.location_name ||
    latestDecision?.location ||
    latestAssignment?.location_name ||
    latestAssignment?.location ||
    mapSummary?.hotspot_zone ||
    "Current Zone";

  const reasoning =
    latestDecision?.reasoning ||
    latestDecision?.explanation ||
    "AI has flagged this case based on urgency and severity signals.";

  const recommendation =
    latestAssignment?.coordination_explanation ||
    "Review and approve response deployment.";

  const urgencyColor =
    urgency > 80
      ? "text-red-600"
      : urgency > 50
      ? "text-amber-500"
      : "text-green-500";

  const dashboardMarkers = useMemo(() => {
    const reportMarkers = reports.slice(0, 6).map((r: any) => ({
      ...r,
      markerType: "Report",
      title: r.title || r.category || r.location_name || "Incident Report",
      description: `${formatLabel(r.category || "incident")} report in ${
        r.zone_label || r.location_name || "mapped area"
      }`,
      color: r.marker_color || "red",
    }));

    const assignmentMarkers = assignments.slice(0, 4).map((a: any) => ({
      ...a,
      markerType: "Assignment",
      title: a.location_name || a.category || "AI Assignment",
      description: `Priority ${a.priority_rank || "N/A"} assignment using ${
        a.recommended_resource || "recommended resource"
      }`,
      color: a.marker_color || "yellow",
    }));

    const volunteerMarkers = volunteers.slice(0, 4).map((v: any) => ({
      ...v,
      markerType: "Volunteer",
      title: v.name || v.volunteer_name || "Volunteer",
      description: `${formatLabel(
        v.availability_status || v.status || "unknown"
      )} volunteer${v.skill_type ? ` • ${formatLabel(v.skill_type)}` : ""}`,
      color: v.marker_color || "green",
    }));

    return spreadDuplicateMarkers([
      ...reportMarkers,
      ...assignmentMarkers,
      ...volunteerMarkers,
    ]);
  }, [reports, assignments, volunteers]);

  const center = useMemo(() => {
    const first = dashboardMarkers.find((m: any) => m.latitude && m.longitude);

    if (first) {
      return {
        lat: Number(first.latitude),
        lng: Number(first.longitude),
      };
    }

    return defaultCenter;
  }, [dashboardMarkers]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.15fr] gap-4">
      {/* LEFT ALERT */}
      <div className="card p-5 flex flex-col gap-4">
        <p className="section-label">AI Priority Alert</p>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-xl">
            🚨
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
            <p className="text-[12px] text-gray-500 mt-1">{location}</p>
          </div>
        </div>

        <p className="text-[13px] text-gray-600 leading-relaxed">
          {reasoning.length > 145 ? reasoning: reasoning}
        </p>

        <div className="bg-[#f2f7f3] rounded-xl p-4 border border-[#e0ede2]">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#4d7c56] mb-2">
            AI Recommendation
          </p>

          <p className="text-[13px] font-semibold text-gray-800">
            {recommendation}
          </p>

          <div className="flex items-center gap-4 mt-3 text-[12px] text-gray-600">
            <span>
              Urgency: <span className={urgencyColor}>{urgency}</span>
            </span>
            <span>Category: {formatLabel(category)}</span>
          </div>
        </div>

        {/* <button className="w-full py-3 rounded-xl bg-[#2e5233] text-white font-semibold text-[13px] hover:bg-[#3a6142] transition-colors">
          Review &amp; Approve →
        </button> */}
      </div>

      {/* RIGHT REAL MAP */}
      <div className="card overflow-hidden min-h-[350px] relative">
        <div className="absolute left-4 top-4 z-10 rounded-full bg-[#2e5233] text-white px-4 py-2 text-xs font-bold shadow-lg">
          Intelligence Map • {dashboardMarkers.length} markers
        </div>

        <div className="absolute right-4 top-4 z-10 rounded-2xl bg-white/95 border border-gray-100 shadow-sm p-3">
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">
            Live Layers
          </p>
          <LegendItem color="bg-red-500" label="Reports" />
          <LegendItem color="bg-yellow-400" label="Assignments" />
          <LegendItem color="bg-green-500" label="Volunteers" />
        </div>

        {!isLoaded ? (
          <div className="h-[350px] flex items-center justify-center text-gray-500">
            Loading intelligence map...
          </div>
        ) : (
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "350px" }}
            center={center}
            zoom={12}
            options={{
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: true,
            }}
          >
            {dashboardMarkers.map((marker: any, index: number) => (
              <Marker
                key={`${marker.markerType}-${marker.id || index}`}
                position={{
                  lat: marker.__lat,
                  lng: marker.__lng,
                }}
                icon={markerIcon(marker.color)}
                onClick={() => setSelected(marker)}
              />
            ))}

            {selected && (
              <InfoWindow
                position={{
                  lat: selected.__lat,
                  lng: selected.__lng,
                }}
                onCloseClick={() => setSelected(null)}
              >
                <div className="min-w-[220px]">
                  <p className="text-xs font-bold text-[#4d7c56] uppercase">
                    {selected.markerType}
                  </p>
                  <h3 className="text-sm font-bold text-gray-900 mt-1">
                    {selected.title || "Selected Marker"}
                  </h3>
                  <p className="text-xs text-gray-600 mt-1">
                    {selected.description || "No description available."}
                  </p>

                  <div className="mt-2 text-[11px] text-gray-500">
                    {selected.zone_label && <p>Zone: {selected.zone_label}</p>}
                    {selected.priority_rank && (
                      <p>Priority: P{selected.priority_rank}</p>
                    )}
                    {selected.assignment_status && (
                      <p>Status: {formatLabel(selected.assignment_status)}</p>
                    )}
                  </div>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        )}

        <div className="absolute left-4 bottom-4 right-4 z-10 rounded-xl bg-white/95 border border-gray-100 shadow-sm px-4 py-3">
          <p className="text-[12px] text-gray-700">
            Hotspot:{" "}
            <span className="font-bold text-[#2e5233]">
              {mapSummary.hotspot_zone || summary?.busiest_zone || "N/A"}
            </span>{" "}
            • Reports:{" "}
            <span className="font-bold">
              {mapSummary.total_reports_on_map ?? reports.length}
            </span>{" "}
            • Assignments:{" "}
            <span className="font-bold">
              {mapSummary.total_assignments_on_map ?? assignments.length}
            </span>{" "}
            • Volunteers:{" "}
            <span className="font-bold">
              {mapSummary.total_volunteers_on_map ?? volunteers.length}
            </span>
          </p>
        </div>
      </div>
    </div>
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

function formatLabel(value: string) {
  return String(value || "N/A")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useDashboard } from "@/hooks/useDashboard";
import { useAssignments } from "@/hooks/useAssignments";
import { useResources } from "@/hooks/useResources";

export default function ResourcesPage() {
  return (
    <DashboardLayout>
      <ResourcesContent />
    </DashboardLayout>
  );
}

function ResourcesContent() {
  const { data: dashboardData } = useDashboard();
  const { data: assignments = [] } = useAssignments();
  const { data: resources = [], isLoading } = useResources();

  const summary = dashboardData?.[0];

  if (isLoading) return <div className="p-6">Loading resources...</div>;

  const normalizedResources = resources.map((r: any) => {
    const quantity =
      r.quantity_available ??
      r.quantity ??
      r.stock ??
      r.available_quantity ??
      r.current_stock ??
      0;

    return {
      ...r,
      quantity,
      cleanName: r.resource_name || r.name || formatLabel(r.id),
      cleanCategory:
        r.resource_type || r.priority_category || r.category || "General",
      cleanZone: r.storage_location || r.zone || r.location || "N/A",
      status: getResourceStatus(quantity),
    };
  });

  const maxStock = Math.max(
    ...normalizedResources.map((r: any) => r.quantity),
    1
  );

  const totalResources = normalizedResources.length;
  const outOfStock = normalizedResources.filter(
    (r: any) => r.status === "out_of_stock"
  ).length;
  const lowStock = normalizedResources.filter(
    (r: any) => r.status === "low_stock"
  ).length;
  const available = normalizedResources.filter(
    (r: any) => r.status === "available"
  ).length;

  const demandMap = getDemandMap(assignments);
  const topDemand = Object.entries(demandMap).sort((a, b) => b[1] - a[1])[0];

  return (
    <div className="flex flex-col gap-5 p-6 max-w-screen-xl mx-auto animate-page-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Resource Management
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Monitor inventory, shortages, AI demand, and predicted relief needs.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Kpi title="Total Resources" value={totalResources} />
        <Kpi title="Available" value={available} />
        <Kpi title="Low Stock" value={lowStock} tone="warning" />
        <Kpi title="Out of Stock" value={outOfStock} tone="danger" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-4">
        <PredictiveAlert
          resources={normalizedResources}
          topDemand={topDemand}
        />

        <DemandSummary assignments={assignments} demandMap={demandMap} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-4">
        <ShortageForecast
          summary={summary}
          resources={normalizedResources}
          demandMap={demandMap}
        />

        <ResourceAllocationPlan
          resources={normalizedResources}
          assignments={assignments}
        />
      </div>

      <ResourceTable
        resources={normalizedResources}
        demandMap={demandMap}
        maxStock={maxStock}
      />
    </div>
  );
}

function Kpi({
  title,
  value,
  tone = "default",
}: {
  title: string;
  value: any;
  tone?: "default" | "warning" | "danger";
}) {
  const toneClass =
    tone === "danger"
      ? "border-red-100 bg-red-50"
      : tone === "warning"
      ? "border-amber-100 bg-amber-50"
      : "";

  return (
    <div className={`card px-5 py-4 ${toneClass}`}>
      <p className="text-[12px] font-semibold text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
    </div>
  );
}

function PredictiveAlert({
  resources,
  topDemand,
}: {
  resources: any[];
  topDemand?: [string, number];
}) {
  if (!topDemand) {
    return (
      <div className="card p-5">
        <p className="section-label mb-4">AI Predictive Alert</p>
        <p className="text-sm text-gray-500">
          No assignment-based demand detected yet.
        </p>
      </div>
    );
  }

  const [resourceKey, demandCount] = topDemand;

  const matchedResource = resources.find((r: any) => {
    const nameKey = normalizeKey(r.cleanName || r.id);
    return nameKey === resourceKey || nameKey.includes(resourceKey);
  });

  const stock = matchedResource?.quantity ?? 0;
  const shortage = Math.max(demandCount - stock, 0);

  const alertState =
    demandCount > stock
      ? "critical"
      : demandCount >= stock * 0.7
      ? "pressure"
      : "stable";

  const alertTitle =
    alertState === "critical"
      ? "Critical shortage predicted"
      : alertState === "pressure"
      ? "High pressure on inventory"
      : "Demand stable";

  const alertStyle =
    alertState === "critical"
      ? "from-red-50 to-white border-red-100"
      : alertState === "pressure"
      ? "from-amber-50 to-white border-amber-100"
      : "from-[#f2f7f3] to-white border-[#e0ede2]";

  const actionText =
    alertState === "critical"
      ? `Restock at least ${shortage} unit(s) of ${formatLabel(
          resourceKey
        )} before approving more dispatches.`
      : alertState === "pressure"
      ? `Prepare reserve stock for ${formatLabel(
          resourceKey
        )}. Demand is approaching available inventory.`
      : `Current stock is sufficient. Keep ${formatLabel(
          resourceKey
        )} prioritized for high-risk zones.`;

 return (
  <div className={`card p-5 bg-gradient-to-r border ${alertStyle}`}>
    <div className="flex items-center justify-between mb-4">
      <p className="section-label">AI Predictive Alert</p>

      <span
        className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
          alertState === "critical"
            ? "bg-red-100 text-red-700"
            : alertState === "pressure"
            ? "bg-amber-100 text-amber-700"
            : "bg-green-100 text-green-700"
        }`}
      >
        {alertState.toUpperCase()}
      </span>
    </div>

    <h3 className="text-lg font-bold text-gray-900">{alertTitle}</h3>

    <p className="text-sm text-gray-600 mt-2">
      {formatLabel(resourceKey)} is required in {demandCount} assignment(s).
      Current stock appears to be {stock}.
    </p>

    <div className="mt-4 rounded-xl bg-white border border-gray-100 p-4">
      <p
        className={`text-[11px] font-bold uppercase tracking-wider ${
          alertState === "critical"
            ? "text-red-600"
            : alertState === "pressure"
            ? "text-amber-700"
            : "text-[#4d7c56]"
        }`}
      >
        Recommended Action
      </p>

      <p className="text-sm text-gray-700 mt-1">{actionText}</p>
    </div>

    <div className="mt-4 flex flex-wrap gap-3 text-xs">
      <span className="rounded-full bg-white px-3 py-1 font-semibold text-gray-600">
        Demand: {demandCount}
      </span>
      <span className="rounded-full bg-white px-3 py-1 font-semibold text-gray-600">
        Stock: {stock}
      </span>
      <span
        className={`rounded-full px-3 py-1 font-semibold ${
          alertState === "critical"
            ? "bg-red-100 text-red-700"
            : alertState === "pressure"
            ? "bg-amber-100 text-amber-700"
            : "bg-green-100 text-green-700"
        }`}
      >
        Gap: {shortage}
      </span>
    </div>

    <button
      type="button"
      onClick={() => {
        alert(
          `Allocation request created for ${formatLabel(resourceKey)}.\nDemand: ${demandCount}\nStock: ${stock}\nGap: ${shortage}`
        );
      }}
      className={`mt-5 w-full rounded-xl px-4 py-3 text-sm font-bold transition ${
        alertState === "critical"
          ? "bg-red-600 text-white hover:bg-red-700"
          : alertState === "pressure"
          ? "bg-amber-500 text-white hover:bg-amber-600"
          : "bg-[#2e5233] text-white hover:bg-[#3a6142]"
      }`}
    >
      Allocate {formatLabel(resourceKey)}
    </button>
  </div>
);
}

function DemandSummary({
  assignments,
  demandMap,
}: {
  assignments: any[];
  demandMap: Record<string, number>;
}) {
  const items = Object.entries(demandMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="section-label">Resource Demand</p>
        <span className="text-xs font-semibold text-[#4d7c56]">
          {assignments.length} assignments
        </span>
      </div>

      <div className="space-y-3">
        {items.length === 0 ? (
          <p className="text-sm text-gray-400">No demand data available.</p>
        ) : (
          items.map(([resource, count]) => {
            const percent =
              assignments.length > 0
                ? Math.round((count / assignments.length) * 100)
                : 0;

            return (
              <div key={resource}>
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>{formatLabel(resource)}</span>
                  <span>
                    {count} · {percent}%
                  </span>
                </div>

                <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#4d7c56]"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function ShortageForecast({
  summary,
  resources,
  demandMap,
}: {
  summary: any;
  resources: any[];
  demandMap: Record<string, number>;
}) {
  const medicalCases = summary?.medical_cases ?? 0;
  const foodCases = summary?.food_cases ?? 0;
  const shelterCases = summary?.shelter_cases ?? 0;

  const riskScore = Math.min(
    100,
    medicalCases * 5 + foodCases * 3 + shelterCases * 3
  );

  const criticalItems = resources.filter(
    (r: any) => r.status === "out_of_stock" || r.quantity <= 10
  );

  const topDemandResource = Object.entries(demandMap).sort(
    (a, b) => b[1] - a[1]
  )[0]?.[0];

  return (
    <div className="card p-5">
      <p className="section-label mb-4">AI Shortage Forecast</p>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">Risk Score</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{riskScore}%</p>
          <p className="text-xs text-gray-400 mt-1">
            Based on medical, food, and shelter demand.
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Critical Inventory</p>
          <p className="text-3xl font-bold text-red-600 mt-1">
            {criticalItems.length}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Resources need attention.
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-xl bg-[#f2f7f3] border border-[#e0ede2] p-3 text-sm text-gray-700">
        AI predicts highest pressure on{" "}
        <strong>{formatLabel(topDemandResource || "medical supplies")}</strong>{" "}
        based on current assignment requirements.
      </div>
    </div>
  );
}

function ResourceAllocationPlan({
  resources,
  assignments,
}: {
  resources: any[];
  assignments: any[];
}) {
  const urgentAssignments = assignments.filter(
    (a: any) =>
      a.deployment_status === "urgent_dispatch_pending" ||
      a.priority_rank === 1
  );

  const usableResources = resources.filter((r: any) => r.quantity > 0);

  const recommendedPriority =
    urgentAssignments[0]?.recommended_resource ||
    Object.entries(getDemandMap(assignments)).sort((a, b) => b[1] - a[1])[0]?.[0];

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="section-label">AI Allocation Plan</p>
        <span className="text-xs font-semibold text-[#4d7c56]">
          {urgentAssignments.length} urgent
        </span>
      </div>

      <div className="space-y-3">
        <PlanRow
          label="Urgent Dispatches"
          value={urgentAssignments.length}
          icon="🚑"
        />
        <PlanRow
          label="Usable Resource Types"
          value={usableResources.length}
          icon="📦"
        />
        <PlanRow
          label="Recommended Priority"
          value={
            recommendedPriority
              ? formatLabel(recommendedPriority)
              : "No urgent demand"
          }
          icon="⚡"
        />
      </div>
    </div>
  );
}

function PlanRow({
  label,
  value,
  icon,
}: {
  label: string;
  value: any;
  icon: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-white p-3">
      <div className="flex items-center gap-3">
        <span className="text-lg">{icon}</span>
        <span className="text-sm font-semibold text-gray-700">{label}</span>
      </div>
      <span className="text-sm font-bold text-[#2e5233]">{value}</span>
    </div>
  );
}

function ResourceTable({
  resources,
  demandMap,
  maxStock,
}: {
  resources: any[];
  demandMap: Record<string, number>;
  maxStock: number;
}) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="section-label">Resource Inventory</p>
        <span className="text-xs font-semibold text-[#4d7c56]">
          {resources.length} records
        </span>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-100">
        <table className="w-full text-sm">
          <thead className="bg-[#f2f7f3] text-left text-[11px] uppercase tracking-wider text-gray-500">
            <tr>
              <th className="px-4 py-3">Resource</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Demand</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Zone</th>
              <th className="px-4 py-3">Last Updated</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 bg-white">
            {resources.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                  No resources found.
                </td>
              </tr>
            ) : (
              resources.map((r: any) => {
                const demand =
                  demandMap[normalizeKey(r.cleanName)] ||
                  demandMap[normalizeKey(r.id)] ||
                  0;

                const barWidth = Math.min((r.quantity / maxStock) * 100, 100);

                return (
                  <tr
                    key={r.id}
                    className={`hover:bg-gray-50 ${
                      r.status === "out_of_stock"
                        ? "bg-red-50/40"
                        : r.status === "low_stock"
                        ? "bg-amber-50/30"
                        : ""
                    }`}
                  >
                    <td className="px-4 py-4 font-semibold text-gray-900">
                      {r.cleanName}
                    </td>

                    <td className="px-4 py-4 text-gray-600">
                      {r.cleanCategory}
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="font-semibold text-gray-700">
                          {r.quantity}
                        </span>
                        <div className="h-1.5 w-24 rounded-full bg-gray-100 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              r.status === "out_of_stock"
                                ? "bg-red-400"
                                : r.status === "low_stock"
                                ? "bg-amber-400"
                                : "bg-green-500"
                            }`}
                            style={{ width: `${barWidth}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4 text-gray-600">{demand}</td>

                    <td className="px-4 py-4">
                      <ResourceStatusBadge status={r.status} />
                    </td>

                    <td className="px-4 py-4 text-gray-600">{r.cleanZone}</td>

                    <td className="px-4 py-4 text-gray-600">
                      {formatTime(r.last_updated || r.updated_at)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ResourceStatusBadge({ status }: { status: string }) {
  const cls =
    status === "out_of_stock"
      ? "bg-red-100 text-red-700"
      : status === "low_stock"
      ? "bg-amber-100 text-amber-700"
      : "bg-green-100 text-green-700";

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[11px] font-bold capitalize ${cls}`}
    >
      {status.replaceAll("_", " ")}
    </span>
  );
}

function getDemandMap(assignments: any[]) {
  return assignments.reduce((acc: Record<string, number>, a: any) => {
    const resource = normalizeKey(a.recommended_resource || "unknown");
    acc[resource] = (acc[resource] || 0) + 1;
    return acc;
  }, {});
}

function getResourceStatus(quantity: number) {
  if (quantity === 0) return "out_of_stock";
  if (quantity <= 10) return "low_stock";
  return "available";
}

function normalizeKey(value: string) {
  return String(value || "unknown").toLowerCase().replaceAll(" ", "_");
}

function formatLabel(value: string) {
  return String(value || "Unknown")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatTime(value: any) {
  if (!value) return "N/A";

  if (value?.toDate) {
    return value.toDate().toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }

  return new Date(value).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}
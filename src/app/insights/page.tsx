"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useInsights } from "@/hooks/useInsights";

export default function InsightsPage() {
  return (
    <DashboardLayout>
      <InsightsContent />
    </DashboardLayout>
  );
}

function InsightsContent() {
  const { data = [], isLoading } = useInsights();
  const insights = data?.[0];

  if (isLoading) return <div className="p-6">Loading insights...</div>;
  if (!insights) return <div className="p-6">No insights data found.</div>;

  const totalCases =
    (insights.medical_case_count ?? 0) +
    (insights.food_case_count ?? 0) +
    (insights.shelter_case_count ?? 0) +
    (insights.general_case_count ?? 0);

  const totalPriority =
    (insights.priority_1_count ?? 0) +
    (insights.priority_2_count ?? 0) +
    (insights.priority_3_count ?? 0);

  const riskScore = calculateRiskScore(insights);
  const aiSummary = generateAISummary(insights, riskScore);
  const signals = generateSignals(insights);

  return (
    <div className="flex flex-col gap-5 p-6 max-w-screen-xl mx-auto animate-page-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">AI Insights</h1>
        <p className="text-sm text-gray-500 mt-1">
          Analyze crisis patterns, risk signals, and operational health.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Kpi
          title="Risk Score"
          value={`${riskScore}%`}
          sub="Urgency, priority and resource pressure"
          tone={riskScore >= 75 ? "danger" : "warning"}
        />
        <Kpi
          title="Avg Urgency"
          value={insights.average_urgency ?? 0}
          sub="Average urgency across active cases"
          tone="danger"
        />
        <Kpi
          title="Priority 1 Cases"
          value={insights.priority_1_count ?? 0}
          sub="Critical cases needing response"
          tone="warning"
        />
        <Kpi
          title="Urgent Assignments"
          value={insights.urgent_assignments ?? 0}
          sub="Tasks marked urgent for dispatch"
          tone="danger"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-4">
        <CaseIntelligence insights={insights} totalCases={totalCases} />
        <PriorityBreakdown insights={insights} totalPriority={totalPriority} />
      </div>

      <CommandIntelligence insights={insights} riskScore={riskScore} signals={signals} />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-4">
        <OperationsHealth insights={insights} />
        <AISummary summary={aiSummary} insights={insights} riskScore={riskScore} />
      </div>
    </div>
  );
}

function Kpi({
  title,
  value,
  sub,
  tone = "default",
}: {
  title: string;
  value: any;
  sub?: string;
  tone?: "default" | "warning" | "danger";
}) {
  const toneClass =
    tone === "danger"
      ? "border-red-100 bg-red-50/60"
      : tone === "warning"
      ? "border-amber-100 bg-amber-50/60"
      : "";

  return (
    <div className={`card px-5 py-4 ${toneClass}`}>
      <p className="text-[12px] font-semibold text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      {sub && <p className="text-[11px] text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

function CaseIntelligence({ insights, totalCases }: { insights: any; totalCases: number }) {
  const cases = [
    { label: "Medical", value: insights.medical_case_count ?? 0 },
    { label: "Food", value: insights.food_case_count ?? 0 },
    { label: "Shelter", value: insights.shelter_case_count ?? 0 },
    { label: "General", value: insights.general_case_count ?? 0 },
  ];

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="section-label">Case Intelligence</p>
        <span className="text-xs font-semibold text-[#4d7c56]">
          Top: {formatLabel(insights.top_category || "N/A")}
        </span>
      </div>

      <div className="space-y-4">
        {cases.map((item) => {
          const percent = totalCases > 0 ? Math.round((item.value / totalCases) * 100) : 0;
          const color = getSeverityColor(percent);

          return (
            <div key={item.label}>
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>{item.label}</span>
                <span>{item.value} · {percent}%</span>
              </div>
              <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                <div className={`h-full rounded-full ${color}`} style={{ width: `${percent}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PriorityBreakdown({ insights, totalPriority }: { insights: any; totalPriority: number }) {
  const priorities = [
    { label: "Priority 1", value: insights.priority_1_count ?? 0, color: "bg-red-500" },
    { label: "Priority 2", value: insights.priority_2_count ?? 0, color: "bg-amber-400" },
    { label: "Priority 3", value: insights.priority_3_count ?? 0, color: "bg-green-400" },
  ];

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="section-label">Priority Breakdown</p>
        <span className="text-xs font-semibold text-[#4d7c56]">{totalPriority} cases</span>
      </div>

      <div className="space-y-4">
        {priorities.map((item) => {
          const percent = totalPriority > 0 ? Math.round((item.value / totalPriority) * 100) : 0;

          return (
            <div key={item.label}>
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>{item.label}</span>
                <span>{item.value} · {percent}%</span>
              </div>
              <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                <div className={`h-full rounded-full ${item.color}`} style={{ width: `${percent}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CommandIntelligence({
  insights,
  riskScore,
  signals,
}: {
  insights: any;
  riskScore: number;
  signals: string[];
}) {
  const urgency = insights.average_urgency ?? 0;
  const priority = insights.priority_1_count ?? 0;
  const urgent = insights.urgent_assignments ?? 0;

  const trendPoints = [
    Math.max(25, urgency - 25),
    Math.max(30, urgency - 18),
    Math.max(35, urgency - 10),
    Math.max(40, urgency - 4),
    urgency,
  ];

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-5">
        <p className="section-label">Command Intelligence</p>
        <span
          className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
            riskScore >= 75
              ? "bg-red-100 text-red-700"
              : riskScore >= 50
              ? "bg-amber-100 text-amber-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {riskScore >= 75 ? "Escalating" : riskScore >= 50 ? "Watch" : "Stable"}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-5">
        <div>
          <div className="grid grid-cols-3 gap-3 mb-5">
            <Mini label="Urgency" value={urgency} />
            <Mini label="P1 Cases" value={priority} />
            <Mini label="Urgent Tasks" value={urgent} />
          </div>

          <div className="h-40 rounded-2xl bg-[#f2f7f3] border border-[#e0ede2] p-4">
            <div className="flex items-end gap-3 h-28">
              {trendPoints.map((point, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <div
                    className={`w-full rounded-t-xl ${
                      point >= 80 ? "bg-red-400" : point >= 55 ? "bg-amber-400" : "bg-[#4d7c56]"
                    }`}
                    style={{ height: `${Math.max(point, 18)}%` }}
                  />
                  <span className="text-[10px] text-gray-400">
                    {i === 4 ? "Now" : `${4 - i}h`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold text-gray-900">AI Signals</p>
            <span className="text-xs font-semibold text-[#4d7c56]">
              {signals.length} active
            </span>
          </div>

          <div className="space-y-2">
            {signals.length === 0 ? (
              <div className="rounded-xl bg-green-50 border border-green-100 p-3">
                <p className="text-sm font-semibold text-green-700">
                  No major anomaly detected
                </p>
              </div>
            ) : (
              signals.map((signal, index) => (
                <div
                  key={index}
                  className="rounded-xl bg-white border border-gray-100 p-3 flex items-start gap-3"
                >
                  <span className="mt-1 h-2 w-2 rounded-full bg-amber-400 flex-shrink-0" />
                  <p className="text-sm font-medium text-gray-700">{signal}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function OperationsHealth({ insights }: { insights: any }) {
  const availableVolunteers = insights.available_volunteer_count ?? 0;
  const busyVolunteers = insights.busy_volunteer_count ?? 0;
  const totalVolunteers = availableVolunteers + busyVolunteers;
  const utilization = totalVolunteers > 0 ? Math.round((busyVolunteers / totalVolunteers) * 100) : 0;

  const totalResources =
    (insights.available_resource_count ?? 0) +
    (insights.low_stock_resource_count ?? 0) +
    (insights.out_of_stock_resource_count ?? 0);

  return (
    <div className="card p-5">
      <p className="section-label mb-4">Operations Health</p>

      <div className="grid grid-cols-2 gap-4">
        <MiniStat label="Volunteer Utilization" value={`${utilization}%`} sub={`${availableVolunteers} available`} icon="👥" />
        <MiniStat label="Busy Volunteers" value={busyVolunteers} sub="Currently assigned" icon="🚑" />
        <MiniStat label="Available Resources" value={insights.available_resource_count ?? 0} sub={`${totalResources} total resource types`} icon="📦" />
        <MiniStat label="Low Stock" value={insights.low_stock_resource_count ?? 0} sub={`${insights.out_of_stock_resource_count ?? 0} out of stock`} icon="⚠️" />
      </div>
    </div>
  );
}

function AISummary({
  summary,
  insights,
  riskScore,
}: {
  summary: string;
  insights: any;
  riskScore: number;
}) {
  const riskTone =
    riskScore >= 75
      ? "bg-red-100 text-red-700"
      : riskScore >= 50
      ? "bg-amber-100 text-amber-700"
      : "bg-green-100 text-green-700";

  return (
    <div className="card p-5 bg-gradient-to-r from-[#f2f7f3] to-white border border-[#e0ede2]">
      <div className="flex items-center justify-between mb-4">
        <p className="section-label">AI Situation Summary</p>
        <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${riskTone}`}>
          {riskScore >= 75 ? "High Risk" : riskScore >= 50 ? "Moderate Risk" : "Stable"}
        </span>
      </div>

      <p className="text-sm text-gray-700 leading-relaxed">{summary}</p>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <Info label="Busiest Zone" value={insights.busiest_zone || "N/A"} />
        <Info label="Top Category" value={formatLabel(insights.top_category || "N/A")} />
        <Info label="Pending" value={insights.pending_assignments ?? 0} />
        <Info label="Updated" value={formatTime(insights.last_updated)} />
      </div>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: any }) {
  return (
    <div className="rounded-xl bg-[#f2f7f3] border border-[#e0ede2] p-3">
      <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">{label}</p>
      <p className="text-sm font-bold text-[#2e5233] mt-1">{value}</p>
    </div>
  );
}

function MiniStat({ label, value, sub, icon }: { label: string; value: any; sub: string; icon: string }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4">
      <div className="flex items-center justify-between">
        <span className="text-xl">{icon}</span>
        <span className="text-xl font-bold text-gray-900">{value}</span>
      </div>
      <p className="text-xs font-semibold text-gray-700 mt-3">{label}</p>
      <p className="text-[11px] text-gray-400 mt-1">{sub}</p>
    </div>
  );
}

function Info({ label, value }: { label: string; value: any }) {
  return (
    <div className="rounded-xl bg-white border border-gray-100 p-3">
      <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">{label}</p>
      <p className="text-sm font-bold text-[#2e5233] mt-1">{value}</p>
    </div>
  );
}

function calculateRiskScore(insights: any) {
  const urgency = insights.average_urgency ?? 0; // already 0–100

  const priority = insights.priority_1_count ?? 0;
  const urgent = insights.urgent_assignments ?? 0;
  const lowStock = insights.low_stock_resource_count ?? 0;

  // Normalize counts (tune these max values based on your system)
  const priorityNorm = Math.min(priority / 20, 1);   // max 20 cases
  const urgentNorm = Math.min(urgent / 15, 1);       // max 15 assignments
  const stockNorm = Math.min(lowStock / 5, 1);       // max 5 shortages

  // Normalize urgency to 0–1
  const urgencyNorm = urgency / 100;

  const score =
    urgencyNorm * 0.4 +
    priorityNorm * 0.2 +
    urgentNorm * 0.2 +
    stockNorm * 0.2;

  return Math.round(score * 100);
}

function generateAISummary(insights: any, riskScore: number) {
  const category = formatLabel(insights.top_category || "general");
  const zone = insights.busiest_zone || "the active response zone";
  const urgency = insights.average_urgency ?? 0;
  const urgent = insights.urgent_assignments ?? 0;
  const lowStock = insights.low_stock_resource_count ?? 0;
  const busy = insights.busy_volunteer_count ?? 0;

  if (riskScore >= 80) {
    return `AI detects a high-risk operational state. ${category} incidents dominate activity around ${zone}, with average urgency at ${urgency}. There are ${urgent} urgent assignments requiring attention, while ${lowStock} resources are under stock pressure. Immediate coordination is recommended.`;
  }

  if (busy === 0 && urgent > 0) {
    return `AI detects a response gap: urgent assignments exist, but no volunteers are currently marked busy. ${category} remains the top incident category in ${zone}. Dispatch confirmation should be reviewed.`;
  }

  if (lowStock > 0) {
    return `AI detects moderate resource pressure. ${category} cases are leading demand in ${zone}, with ${lowStock} low-stock resource type(s). Current urgency is ${urgency}, so inventory should be monitored closely.`;
  }

  return `AI detects a stable operating state. ${category} is the top incident category around ${zone}, with average urgency at ${urgency}. Current resources and volunteer availability appear manageable.`;
}

function generateSignals(insights: any) {
  const signals: string[] = [];

  if ((insights.average_urgency ?? 0) >= 85) {
    signals.push("Average urgency is unusually high and may indicate escalation.");
  }

  if ((insights.priority_1_count ?? 0) > (insights.priority_3_count ?? 0) * 2) {
    signals.push("Priority 1 cases heavily outweigh lower priority cases.");
  }

  if ((insights.urgent_assignments ?? 0) > 0 && (insights.busy_volunteer_count ?? 0) === 0) {
    signals.push("Urgent assignments exist but no volunteers are marked busy.");
  }

  if ((insights.low_stock_resource_count ?? 0) > 0) {
    signals.push("Low-stock resources may affect response continuity.");
  }

  return signals;
}

function getSeverityColor(percent: number) {
  if (percent >= 50) return "bg-red-400";
  if (percent >= 25) return "bg-amber-400";
  return "bg-green-400";
}

function formatLabel(value: string) {
  return String(value || "N/A")
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
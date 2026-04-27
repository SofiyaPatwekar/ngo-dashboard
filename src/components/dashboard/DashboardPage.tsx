"use client";

import { useState } from "react";

import { KPICards } from "./KPICards";
import { PriorityAlertHeatmap } from "./PriorityAlertHeatmap";
import { AIInsightsImpact } from "./AIInsightsImpact";
import { RecentActivity } from "./RecentActivity";
import { DeploymentBanner } from "./DeploymentBanner";

import { useDashboard } from "@/hooks/useDashboard";
import { useRealtimeReports } from "@/hooks/useRealtimeReports";
import { useOperationalData } from "@/hooks/useOperationalData";
import { useRealtimeStore } from "@/store/useRealtimeStore";

export function DashboardPage() {
  const [briefingOpen, setBriefingOpen] = useState(false);

  const { data, isLoading, error } = useDashboard();
  const { latestReport, latestDecision, latestAssignment } =
    useOperationalData();

  useRealtimeReports();

  const reports = useRealtimeStore((s) => s.reports);
  const summary = data?.[0];

  if (isLoading) return <div className="p-6">Loading dashboard...</div>;
  if (error) return <div className="p-6 text-red-600">Error loading dashboard</div>;
  if (!summary) return <div className="p-6">No dashboard data found</div>;

  return (
    <div className="flex flex-col gap-5 p-6 max-w-screen-xl mx-auto animate-page-in">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 leading-tight">
            Welcome, <span className="text-[#4d7c56]">Admin!</span>
          </h1>
        </div>

        <button
          onClick={() => setBriefingOpen(true)}
          className="btn-sage shadow-sage"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <polygon points="10,1 12.9,7 20,8.1 15,12.9 16.2,20 10,16.8 3.8,20 5,12.9 0,8.1 7.1,7" />
          </svg>
          AI Briefing
        </button>
      </div>

      <div>
        <p className="section-label mb-3">AI Crisis Overview</p>
        <KPICards summary={summary} latestDecision={latestDecision} />
      </div>

      <PriorityAlertHeatmap
        summary={summary}
        latestReport={latestReport}
        latestDecision={latestDecision}
        latestAssignment={latestAssignment}
      />

      <AIInsightsImpact summary={summary} />

      <RecentActivity reports={reports} />

      {/* <DeploymentBanner latestAssignment={latestAssignment} /> */}

      {briefingOpen && (
        <AIBriefingModal
          summary={summary}
          onClose={() => setBriefingOpen(false)}
        />
      )}

      <div className="h-4" />
    </div>
  );
}

function AIBriefingModal({
  summary,
  onClose,
}: {
  summary: any;
  onClose: () => void;
}) {
  const briefingItems = [
    ["Total Reports", summary?.total_reports],
    ["Processed Reports", summary?.total_processed_reports],
    ["Critical Cases", summary?.priority_1_cases],
    ["Urgent Dispatch Pending", summary?.urgent_dispatch_pending],
    ["Total Assignments", summary?.total_assignments],
    ["Total Decisions", summary?.total_decisions],
    ["Total Volunteers", summary?.total_volunteers],
    ["Available Volunteers", summary?.available_volunteers],
    ["Busy Volunteers", summary?.busy_volunteers],
    ["Total Resources", summary?.total_resources],
    ["Available Resources", summary?.available_resources],
    ["Low Stock Resources", summary?.low_stock_resources],
    ["Medical Cases", summary?.medical_cases],
    ["Food Cases", summary?.food_cases],
    ["Shelter Cases", summary?.shelter_cases],
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-2xl max-h-[85vh] rounded-3xl bg-white shadow-2xl border border-gray-100 overflow-hidden">
        <div className="flex items-start justify-between border-b border-gray-100 px-5 py-4 bg-[#f2f7f3]">
          <div>
            <p className="section-label mb-1">AI System Briefing</p>
            <h2 className="text-lg font-bold text-gray-900">
              Current Operational Overview
            </h2>
          </div>

          <button
            onClick={onClose}
className="h-8 w-8 rounded-xl bg-white text-gray-500 hover:text-gray-900 hover:bg-gray-50 mb-4"
          >
            ✕
          </button>
        </div>

        <div className="p-5 max-h-[62vh] overflow-y-auto">
          <div className="rounded-2xl border border-[#e0ede2] bg-[#f2f7f3] p-4 mb-4">
            <p className="text-sm text-gray-700 leading-relaxed">
              The system has received{" "}
              <strong>{summary?.total_reports ?? 0}</strong> reports, with{" "}
              <strong>{summary?.priority_1_cases ?? 0}</strong> critical cases
              and{" "}
              <strong>{summary?.urgent_dispatch_pending ?? 0}</strong> urgent
              dispatches pending. There are{" "}
              <strong>{summary?.available_volunteers ?? 0}</strong> volunteers
              available and{" "}
              <strong>{summary?.low_stock_resources ?? 0}</strong> resources
              running low.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {briefingItems.map(([label, value]) => (
              <div
                key={label}
                className="rounded-2xl border border-gray-100 bg-white p-3"
              >
                <p className="text-[9px] uppercase tracking-wider text-gray-400 font-bold">
                  {label}
                </p>
                <p className="text-lg font-bold text-[#2e5233] mt-1">
                  {value ?? 0}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-gray-100 px-5 py-3">
          <button onClick={onClose} className="btn-outline-sage">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
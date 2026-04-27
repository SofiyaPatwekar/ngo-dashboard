"use client";

import { useRealtimeStore } from "@/store/useRealtimeStore";

export const ActivityFeed = () => {
  const reports = useRealtimeStore((s) => s.reports);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5">
        <h3 className="text-xl font-semibold text-slate-900">Live Activity</h3>
        <p className="mt-1 text-sm text-slate-500">
          Latest incoming reports from the field
        </p>
      </div>

      <div className="max-h-[320px] space-y-3 overflow-y-auto pr-2">
        {reports.length === 0 ? (
          <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
            No live activity yet.
          </div>
        ) : (
          reports.map((report: any) => (
            <div
              key={report.id}
              className="rounded-xl border border-slate-100 bg-slate-50 p-4 transition hover:bg-emerald-50"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    🚨 {report.title || report.category || "New Report"}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {report.location || "Unknown location"}
                  </p>
                  {(report.category || report.severity || report.urgency) && (
                    <p className="mt-1 text-xs text-slate-400">
                      {report.category ? `Category: ${report.category}` : ""}
                      {report.category && report.severity ? " • " : ""}
                      {report.severity ? `Severity: ${report.severity}` : ""}
                      {(report.category || report.severity) && report.urgency ? " • " : ""}
                      {report.urgency ? `Urgency: ${report.urgency}` : ""}
                    </p>
                  )}
                </div>

                <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-medium text-emerald-700">
                  Live
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
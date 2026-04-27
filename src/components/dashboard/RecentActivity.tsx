"use client";

import { useState } from "react";

function getDotColor(priority?: string) {
  if (priority === "critical") return "bg-red-500";
  if (priority === "high") return "bg-orange-400";
  if (priority === "medium") return "bg-amber-400";
  return "bg-[#4d7c56]";
}

function getTime(value: any) {
  if (!value) return "--:--";

  if (value?.toDate) {
    return value.toDate().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }

  return new Date(value).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function getFullDate(value: any) {
  if (!value) return "N/A";

  const date = value?.toDate ? value.toDate() : new Date(value);

  return date.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function RecentActivity({ reports }: { reports: any[] }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="#4d7c56"
              strokeWidth="2.5"
              className="w-4 h-4"
            >
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            <p className="section-label">Recent Activity</p>
          </div>

          <button
            onClick={() => setOpen(true)}
            className="text-[12px] font-semibold text-[#4d7c56] hover:text-[#2e5233] transition-colors"
          >
            View All
          </button>
        </div>

        <ActivityList reports={reports.slice(0, 5)} emptyText="No recent activity found." />
      </div>

      {open && (
        <ActivityModal reports={reports} onClose={() => setOpen(false)} />
      )}
    </>
  );
}

function ActivityList({
  reports,
  emptyText,
}: {
  reports: any[];
  emptyText: string;
}) {
  return (
    <div className="flex flex-col divide-y divide-gray-50">
      {reports.length === 0 ? (
        <div className="py-6 text-sm text-gray-400">{emptyText}</div>
      ) : (
        reports.map((report: any) => {
          const priority =
            report.priority ||
            report.priority_level ||
            report.severity ||
            "medium";

          return (
            <div
              key={report.id}
              className="flex items-start gap-3 py-3 hover:bg-gray-50 -mx-2 px-2 rounded-xl transition-colors"
            >
              <span className="text-[10px] text-gray-400 font-mono w-[52px] flex-shrink-0 mt-1 tabular-nums">
                {getTime(report.created_at)}
              </span>

              <span
                className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${getDotColor(
                  String(priority).toLowerCase()
                )}`}
              />

              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm flex-shrink-0 bg-blue-100">
                📥
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-semibold text-gray-800 leading-snug">
                  <span className="text-gray-900">New report received:</span>{" "}
                  <span className="font-normal text-gray-600">
                    {report.title || report.category || "New incident"}
                    {report.location || report.location_name
                      ? ` — ${report.location || report.location_name}`
                      : ""}
                  </span>
                </p>

                <div className="flex items-center gap-1 mt-1">
                  <svg viewBox="0 0 16 16" fill="#22c55e" className="w-3 h-3">
                    <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm3.5 5.5l-4 4a.75.75 0 01-1.06 0l-2-2a.75.75 0 011.06-1.06L7 8.94l3.47-3.47a.75.75 0 011.06 1.06z" />
                  </svg>
                  <span className="text-[10px] text-green-600 font-semibold">
                    Confirmed
                  </span>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

function ActivityModal({
  reports,
  onClose,
}: {
  reports: any[];
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-3xl max-h-[82vh] overflow-hidden rounded-3xl bg-white shadow-2xl border border-gray-100">
        <div className="flex items-start justify-between border-b border-gray-100 px-5 py-4 bg-[#f2f7f3]">
          <div>
            <p className="section-label mb-1">All Recent Activity</p>
            <h2 className="text-lg font-bold text-gray-900">
              Report Activity Log
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Showing {reports.length} report activities.
            </p>
          </div>

          <button
            onClick={onClose}
            className="h-8 w-8 rounded-xl bg-white text-gray-500 hover:text-gray-900 hover:bg-gray-50"
          >
            ✕
          </button>
        </div>

        <div className="p-5 max-h-[65vh] overflow-y-auto">
          {reports.length === 0 ? (
            <div className="py-8 text-center text-sm text-gray-400">
              No activity found.
            </div>
          ) : (
            <div className="space-y-3">
              {reports.map((report: any) => {
                const priority =
                  report.priority ||
                  report.priority_level ||
                  report.severity ||
                  "medium";

                return (
                  <div
                    key={report.id}
                    className="rounded-2xl border border-gray-100 bg-white p-4 hover:bg-gray-50"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <span
                          className={`w-2.5 h-2.5 rounded-full mt-1.5 ${getDotColor(
                            String(priority).toLowerCase()
                          )}`}
                        />

                        <div>
                          <p className="text-sm font-bold text-gray-900">
                            {report.title || report.category || "New incident"}
                          </p>

                          <p className="text-xs text-gray-500 mt-1">
                            {report.location ||
                              report.location_name ||
                              "Location not available"}
                          </p>

                          <p className="text-xs text-gray-600 mt-2 line-clamp-2">
                            {report.text ||
                              report.description ||
                              report.summary ||
                              "No report description available."}
                          </p>
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <span className="rounded-full bg-[#f2f7f3] px-2.5 py-1 text-[11px] font-bold text-[#4d7c56]">
                          {String(priority).toUpperCase()}
                        </span>
                        <p className="text-[11px] text-gray-400 mt-2">
                          {getFullDate(report.created_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex justify-end border-t border-gray-100 px-5 py-3">
          {/* <button onClick={onClose} className="btn-outline-sage">
            Close
          </button> */}
        </div>
      </div>
    </div>
  );
}
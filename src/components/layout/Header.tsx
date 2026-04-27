"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { useDashboard } from "@/hooks/useDashboard";
import { useVolunteerRequests } from "@/hooks/useVolunteerRequests";
import { useVolunteers } from "@/hooks/useVolunteers";

/* ---------------- CLOCK ---------------- */
function formatClock(d: Date) {
  let h = d.getHours();
  const m = d.getMinutes();
  const s = d.getSeconds();
  const ampm = h >= 12 ? "PM" : "AM";

  h = h % 12 || 12;

  return `${String(h).padStart(2, "0")}:${String(m).padStart(
    2,
    "0"
  )}:${String(s).padStart(2, "0")} ${ampm}`;
}

/* ---------------- HEADER ---------------- */
export function Header() {
  const [time, setTime] = useState(new Date());
  const [open, setOpen] = useState(false);

  const { data } = useDashboard();
  const { data: volunteerUsers = [] } = useVolunteerRequests();
  const { data: volunteers = [] } = useVolunteers();

  const summary = data?.[0];

  /* ---------------- PENDING LOGIC ---------------- */


const pendingVolunteerRequests = volunteerUsers.length;

  const urgentDispatchPending = summary?.urgent_dispatch_pending ?? 0;
  const lowStockResources = summary?.low_stock_resources ?? 0;

  const notificationCount =
    pendingVolunteerRequests +
    urgentDispatchPending +
    lowStockResources;

  /* ---------------- CLOCK EFFECT ---------------- */

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="h-14 bg-white border-b border-gray-100 px-6 flex items-center justify-between flex-shrink-0">
      {/* LEFT */}
      <div>
        <p className="text-[13px] font-bold text-gray-900 leading-none tracking-tight">
          AI NGO COMMAND CENTER
        </p>
        <p className="text-[11px] text-gray-400 mt-0.5 leading-none">
          Smart Decisions, Faster Relief!
        </p>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">
        {/* LIVE + TIME */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            <span className="text-[12px] font-semibold text-green-600">
              LIVE
            </span>
          </div>

          <span className="text-[13px] font-semibold text-gray-700 tabular-nums font-mono">
            {formatClock(time)}
          </span>
        </div>

        {/* NOTIFICATION */}
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="relative w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-4 h-4"
            >
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 01-3.46 0" />
            </svg>

            {notificationCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 bg-red-500 rounded-full text-white text-[9px] font-bold flex items-center justify-center">
                {notificationCount}
              </span>
            )}
          </button>

          {/* DROPDOWN */}
          {open && (
            <div className="absolute right-0 top-10 z-50 w-80 rounded-2xl border border-gray-100 bg-white shadow-xl overflow-hidden">
              {/* HEADER */}
              <div className="px-4 py-3 bg-[#f2f7f3] border-b border-[#e0ede2]">
                <p className="text-sm font-bold text-gray-900">
                  Notifications
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Live operational alerts
                </p>
              </div>

              {/* ITEMS */}
              <div className="p-3 space-y-2">
                <NotificationRow
                  icon="👥"
                  title="Volunteer approval requests"
                  value={pendingVolunteerRequests}
                  tone="blue"
                  href="/volunteer-requests"
                />

                <NotificationRow
                  icon="🚨"
                  title="Urgent dispatches pending"
                  value={urgentDispatchPending}
                  tone="red"
                  href="/dashboard"
                />

                <NotificationRow
                  icon="📦"
                  title="Low stock resources"
                  value={lowStockResources}
                  tone="amber"
                  href="/resources"
                />
              </div>
            </div>
          )}
        </div>

        {/* USER */}
        <div className="w-8 h-8 rounded-full bg-[#4d7c56] flex items-center justify-center text-white text-xs font-bold cursor-pointer border-2 border-[#93bb99] hover:border-[#4d7c56] transition-colors">
          A
        </div>
      </div>
    </header>
  );
}

/* ---------------- NOTIFICATION ROW ---------------- */
function NotificationRow({
  icon,
  title,
  value,
  tone,
  href,
}: {
  icon: string;
  title: string;
  value: number;
  tone: "red" | "amber" | "blue";
  href: string;
}) {
  const toneClass =
    tone === "red"
      ? "bg-red-50 text-red-700 border-red-100"
      : tone === "amber"
      ? "bg-amber-50 text-amber-700 border-amber-100"
      : "bg-blue-50 text-blue-700 border-blue-100";

  return (
    <Link
      href={href}
      className={`flex items-center justify-between rounded-xl border p-3 hover:opacity-90 transition ${toneClass}`}
    >
      <div className="flex items-center gap-3">
        <span className="text-lg">{icon}</span>
        <div>
          <p className="text-sm font-bold">{title}</p>
          <p className="text-xs opacity-70">
            Requires admin attention
          </p>
        </div>
      </div>

      <span className="text-lg font-bold">{value}</span>
    </Link>
  );
}
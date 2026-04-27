"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function SupportPage() {
  return (
    <DashboardLayout>
      <SupportContent />
    </DashboardLayout>
  );
}

function SupportContent() {
  const queryClient = useQueryClient();

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ["support-requests"],
    queryFn: getSupportRequests,
  });

  const [form, setForm] = useState({
    title: "",
    issue_type: "general_help",
    related_page: "dashboard",
    priority_level: "low",
    description: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const openRequests = requests.filter((r: any) => r.status === "open").length;
  const highPriority = requests.filter(
    (r: any) => r.priority_level === "high" || r.priority_level === "urgent"
  ).length;
  const resolved = requests.filter((r: any) => r.status === "resolved").length;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.title.trim() || !form.description.trim()) {
      alert("Please fill title and description.");
      return;
    }

    setIsSubmitting(true);

    await addDoc(collection(db, "support_requests"), {
      ...form,
      status: "open",
      created_by: "NGO Staff",
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    });

    setForm({
      title: "",
      issue_type: "general_help",
      related_page: "dashboard",
      priority_level: "low",
      description: "",
    });

    await queryClient.invalidateQueries({ queryKey: ["support-requests"] });

    setIsSubmitting(false);
  }

  if (isLoading) return <div className="p-6">Loading support requests...</div>;

  return (
    <div className="flex flex-col gap-5 p-6 max-w-screen-xl mx-auto animate-page-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Help & Support</h1>
        <p className="text-sm text-gray-500 mt-1">
          Raise issues, track support requests, and follow quick response SOPs.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Kpi title="Open Requests" value={openRequests} tone="warning" />
        <Kpi title="High Priority" value={highPriority} tone="danger" />
        <Kpi title="Resolved" value={resolved} />
        <Kpi title="Total Requests" value={requests.length} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.9fr] gap-4">
        <SupportForm
          form={form}
          setForm={setForm}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
        <QuickSOP />
      </div>

      <SupportTable requests={requests} />
    </div>
  );
}

async function getSupportRequests() {
  const q = query(
    collection(db, "support_requests"),
    orderBy("created_at", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Record<string, any>),
  }));
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
      ? "border-red-100 bg-red-50/70"
      : tone === "warning"
      ? "border-amber-100 bg-amber-50/70"
      : "";

  return (
    <div className={`card px-5 py-4 ${toneClass}`}>
      <p className="text-[12px] font-semibold text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
    </div>
  );
}

function SupportForm({
  form,
  setForm,
  onSubmit,
  isSubmitting,
}: {
  form: any;
  setForm: any;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
}) {
  return (
    <form onSubmit={onSubmit} className="card p-5">
      <p className="section-label mb-4">Create Support Request</p>

      <div className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-gray-600">Title</label>
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Example: Volunteer assignment not updating"
            className="mt-1 w-full rounded-xl border border-gray-100 px-4 py-3 text-sm outline-none focus:border-[#4d7c56]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <SelectField
            label="Issue Type"
            value={form.issue_type}
            onChange={(value: string) => setForm({ ...form, issue_type: value })}
            options={[
              "general_help",
              "technical_issue",
              "volunteer_assignment",
              "resource_shortage",
              "data_mismatch",
            ]}
          />

          <SelectField
            label="Related Page"
            value={form.related_page}
            onChange={(value: string) =>
              setForm({ ...form, related_page: value })
            }
            options={["dashboard", "volunteers", "resources", "insights", "map"]}
          />

          <SelectField
            label="Priority"
            value={form.priority_level}
            onChange={(value: string) =>
              setForm({ ...form, priority_level: value })
            }
            options={["low", "medium", "high", "urgent"]}
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-600">
            Description
          </label>
          <textarea
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            placeholder="Explain the issue clearly..."
            rows={4}
            className="mt-1 w-full resize-none rounded-xl border border-gray-100 px-4 py-3 text-sm outline-none focus:border-[#4d7c56]"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-sage w-full justify-center"
        >
          {isSubmitting ? "Submitting..." : "Submit Request"}
        </button>
      </div>
    </form>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: any;
  options: string[];
}) {
  return (
    <div>
      <label className="text-xs font-semibold text-gray-600">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-xl border border-gray-100 px-3 py-3 text-sm outline-none focus:border-[#4d7c56]"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {formatLabel(option)}
          </option>
        ))}
      </select>
    </div>
  );
}

function QuickSOP() {
  const items = [
    {
      title: "Dashboard issues",
      text: "Check dashboard_summary, reports, decisions and assignments collections.",
      icon: "📊",
    },
    {
      title: "Volunteer assignment issues",
      text: "Verify assigned_volunteer_id, assignment_status and volunteer availability.",
      icon: "👥",
    },
    {
      title: "Resource shortage issues",
      text: "Review quantity_available, recommended_resource and low stock alerts.",
      icon: "📦",
    },
    {
      title: "Insights explanation issues",
      text: "Check insights collection values like urgency, scores and top category.",
      icon: "🧠",
    },
  ];

  return (
    <div className="card p-5">
      <p className="section-label mb-4">Quick SOP Help</p>

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border border-gray-100 bg-white p-4 flex gap-3"
          >
            <div className="h-10 w-10 rounded-xl bg-[#f2f7f3] flex items-center justify-center text-lg">
              {item.icon}
            </div>

            <div>
              <p className="text-sm font-bold text-gray-900">{item.title}</p>
              <p className="text-xs text-gray-500 mt-1">{item.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SupportTable({ requests }: { requests: any[] }) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="section-label">Support Requests</p>
        <span className="text-xs font-semibold text-[#4d7c56]">
          {requests.length} records
        </span>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-100">
        <table className="w-full text-sm">
          <thead className="bg-[#f2f7f3] text-left text-[11px] uppercase tracking-wider text-gray-500">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Issue Type</th>
              <th className="px-4 py-3">Related Page</th>
              <th className="px-4 py-3">Priority</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Created By</th>
              <th className="px-4 py-3 w-[130px]">Created Time</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 bg-white">
            {requests.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                  No support requests found.
                </td>
              </tr>
            ) : (
              requests.map((request: any) => (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <p className="font-semibold text-gray-900">
                      {request.title || "Untitled request"}
                    </p>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-1">
                      {request.description || "No description"}
                    </p>
                  </td>

                  <td className="px-4 py-4 text-gray-600">
                    {formatLabel(request.issue_type || "general_help")}
                  </td>

                  <td className="px-4 py-4 text-gray-600">
                    {formatLabel(request.related_page || "N/A")}
                  </td>

                  <td className="px-4 py-4">
                    <PriorityBadge priority={request.priority_level} />
                  </td>

                  <td className="px-4 py-4">
                    <StatusBadge status={request.status} />
                  </td>

                  <td className="px-4 py-4 text-gray-600">
                    {request.created_by || "NGO Staff"}
                  </td>

                  <td className="px-4 py-4 text-gray-600">
                    {formatTime(request.created_at)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PriorityBadge({ priority }: { priority?: string }) {
  const p = priority || "low";

  const cls =
    p === "urgent"
      ? "bg-red-100 text-red-700"
      : p === "high"
      ? "bg-orange-100 text-orange-700"
      : p === "medium"
      ? "bg-amber-100 text-amber-700"
      : "bg-green-100 text-green-700";

  return (
<span className={`whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-bold capitalize ${cls}`}>
    {p}
    </span>
  );
}

function StatusBadge({ status }: { status?: string }) {
  const s = status || "open";

  const cls =
    s === "resolved"
      ? "bg-green-100 text-green-700"
      : s === "in_progress"
      ? "bg-blue-100 text-blue-700"
      : "bg-amber-100 text-amber-700";

  return (
    <span className={`whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-bold capitalize ${cls}`}>
      {s.replaceAll("_", " ")}
    </span>
  );
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
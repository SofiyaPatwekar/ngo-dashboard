"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useVolunteers } from "@/hooks/useVolunteers";
import { useDashboard } from "@/hooks/useDashboard";
import { useAssignments } from "@/hooks/useAssignments";

export default function VolunteersPage() {
  return (
    <DashboardLayout>
      <VolunteersContent />
    </DashboardLayout>
  );
}

function VolunteersContent() {
  const { data: volunteers = [], isLoading } = useVolunteers();
  const { data: dashboardData } = useDashboard();
  const { data: assignments = [] } = useAssignments();

  const summary = dashboardData?.[0];

  if (isLoading) return <div className="p-6">Loading volunteers...</div>;

  const activeAssignments = assignments.filter(
    (a: any) => a.assignment_status !== "completed"
  );

  const busyCount = new Set(
    activeAssignments.map((a: any) => a.assigned_volunteer_id)
  ).size;

  const bestAssignment =
    assignments.length > 0
      ? [...assignments].sort(
          (a: any, b: any) => (b.final_score ?? 0) - (a.final_score ?? 0)
        )[0]
      : null;

  const matchedVolunteer = volunteers.find(
    (v: any) => v.id === bestAssignment?.assigned_volunteer_id
  );

  return (
    <div className="flex flex-col gap-5 p-6 max-w-screen-xl mx-auto animate-page-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Volunteer Operations
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Track responder readiness, AI assignments, and field deployment flow.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Kpi
          title="Total Volunteers"
          value={summary?.total_volunteers ?? volunteers.length}
        />
        <Kpi title="Available" value={summary?.available_volunteers ?? 0} />
        <Kpi title="Busy" value={busyCount} />
        <Kpi
          title="Assignments"
          value={summary?.total_assignments ?? assignments.length}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-4">
        <BestMatch assignment={bestAssignment} volunteer={matchedVolunteer} />
        <AssignmentTimeline assignments={assignments} volunteers={volunteers} />
      </div>

      <VolunteerTable volunteers={volunteers} assignments={assignments} />
    </div>
  );
}

function Kpi({ title, value }: { title: string; value: any }) {
  return (
    <div className="card px-5 py-4">
      <p className="text-[12px] font-semibold text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
    </div>
  );
}

function BestMatch({
  assignment,
  volunteer,
}: {
  assignment: any;
  volunteer: any;
}) {
  return (
    <div className="card p-5">
      <p className="section-label mb-4">AI Best Match</p>

      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-[#f2f7f3] flex items-center justify-center text-xl">
          👥
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900">
            {volunteer?.name ||
              assignment?.assigned_volunteer_id ||
              "No volunteer assigned"}
          </h3>

          <p className="text-sm text-gray-500 mt-1">
            {volunteer?.skill_type || "General Support"} •{" "}
            {assignment?.zone_label ||
              volunteer?.assigned_zone ||
              "Zone pending"}
          </p>

          <div className="mt-4 rounded-xl bg-[#f2f7f3] border border-[#e0ede2] p-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#4d7c56] mb-2">
              AI Reasoning
            </p>
            <p className="text-sm text-gray-700">
              {assignment?.coordination_explanation ||
                "AI assignment reasoning will appear once a volunteer is matched."}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <Mini label="Score" value={assignment?.final_score ?? "N/A"} />
            <Mini
              label="Priority"
              value={
                assignment?.priority_rank ? `P${assignment.priority_rank}` : "N/A"
              }
            />
            <Mini
              label="Resource"
              value={assignment?.recommended_resource || "N/A"}
            />
            <Mini
              label="Timeline"
              value={assignment?.response_timeline || "N/A"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: any }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-3">
      <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">
        {label}
      </p>
      <p className="text-sm font-bold text-[#2e5233] mt-1">{value}</p>
    </div>
  );
}

function AssignmentTimeline({
  assignments,
  volunteers,
}: {
  assignments: any[];
  volunteers: any[];
}) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="section-label">Recent Assignment Timeline</p>
        <span className="text-xs font-semibold text-[#4d7c56]">
          {assignments.length} total
        </span>
      </div>

      <div className="space-y-3 max-h-[310px] overflow-y-auto pr-1">
        {assignments.length === 0 ? (
          <p className="text-sm text-gray-400">No assignments found.</p>
        ) : (
          assignments.slice(0, 5).map((a: any) => {
            const volunteer = volunteers.find(
              (v: any) => v.id === a.assigned_volunteer_id
            );

            return (
              <div
                key={a.id}
                className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-gray-900">
                      {(a.category || "Response").toUpperCase()} response →{" "}
                      {volunteer?.name || a.assigned_volunteer_id}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {a.location_name || a.zone_label || "Location pending"} •{" "}
                      {a.recommended_resource || "No resource"}
                    </p>
                  </div>

                  <StatusBadge status={a.assignment_status} />
                </div>

                <div className="mt-3 grid grid-cols-3 gap-2 text-[11px]">
                  <TimeBox label="Created" value={a.created_at} />
                  <TimeBox label="Accepted" value={a.accepted_at} />
                  <TimeBox label="Completed" value={a.completed_at} />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status?: string }) {
  const s = status || "pending";

  const normalized = s.toLowerCase();

  const cls =
    normalized === "completed" || normalized === "ready" || normalized === "available"
      ? "bg-green-100 text-green-700"
      : normalized === "accepted" || normalized === "busy"
      ? "bg-blue-100 text-blue-700"
      : normalized === "unknown"
      ? "bg-gray-100 text-gray-500"
      : "bg-amber-100 text-amber-700";

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[11px] font-bold capitalize ${cls}`}
    >
      {s}
    </span>
  );
}

function TimeBox({ label, value }: { label: string; value: any }) {
  return (
    <div className="rounded-xl bg-gray-50 p-2">
      <p className="text-[10px] text-gray-400 font-bold uppercase">{label}</p>
      <p className="text-[11px] text-gray-700 mt-1">{formatTime(value)}</p>
    </div>
  );
}

function formatTime(value: any) {
  if (!value) return "Not yet";

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

function VolunteerTable({
  volunteers,
  assignments,
}: {
  volunteers: any[];
  assignments: any[];
}) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="section-label">Volunteer Directory</p>
        <span className="text-xs font-semibold text-[#4d7c56]">
          {volunteers.length} responders
        </span>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-100">
        <table className="w-full text-sm">
          <thead className="bg-[#f2f7f3] text-left text-[11px] uppercase tracking-wider text-gray-500">
            <tr>
              <th className="px-4 py-3">Volunteer</th>
              <th className="px-4 py-3">Skill</th>
              <th className="px-4 py-3">Zone</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Availability</th>
              <th className="px-4 py-3">Utilization</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 bg-white">
            {volunteers.map((v: any) => {
              const hasActiveAssignment = assignments.some(
                (a: any) =>
                  a.assigned_volunteer_id === v.id &&
                  a.assignment_status !== "completed"
              );

              const activeAssignment = assignments.find(
                (a: any) =>
                  a.assigned_volunteer_id === v.id &&
                  a.assignment_status !== "completed"
              );

              return (
                <tr key={v.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 font-semibold text-gray-900">
                    {v.name || v.id}
                    {activeAssignment && (
                      <span className="ml-2 rounded-full bg-red-100 px-2 py-0.5 text-[10px] text-red-700 font-bold">
                        Active
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-4 text-gray-600">
                    {v.skill_type || "General"}
                  </td>

                  <td className="px-4 py-4 text-gray-600">
                    {v.assigned_zone || "N/A"}
                  </td>

                  <td className="px-4 py-4 text-gray-600">
                    {v.contact || "N/A"}
                  </td>

                  <td className="px-4 py-4">
                    <StatusBadge
                      status={v.availability_status || "unknown"}
                    />
                  </td>

                  <td className="px-4 py-4">
                    <StatusBadge
                      status={
                        hasActiveAssignment
                          ? "busy"
                          : v.utilization_status || "ready"
                      }
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
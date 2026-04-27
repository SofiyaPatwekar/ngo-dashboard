"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useVolunteerRequests } from "@/hooks/useVolunteerRequests";
import { db } from "@/lib/firebase";
import { useQueryClient } from "@tanstack/react-query";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

const REQUEST_COLLECTION = "volunteer_users";
// If your working collection is misspelled, change it to:
// const REQUEST_COLLECTION = "voluteer_users";

export default function VolunteerRequestsPage() {
  return (
    <DashboardLayout>
      <VolunteerRequestsContent />
    </DashboardLayout>
  );
}

function VolunteerRequestsContent() {
  const queryClient = useQueryClient();
  const { data: volunteerUsers = [], isLoading } = useVolunteerRequests();

  const pendingRequests = volunteerUsers;

  async function handleApprove(user: any) {
    const confirmApprove = confirm(
      `Approve volunteer request for ${getVolunteerName(user)}?`
    );

    if (!confirmApprove) return;

    await addDoc(collection(db, "volunteers"), {
      volunteer_id: user.volunteer_id || user.id,
      name: user.name || user.display_name || getNameFromEmail(user.email),
      email: user.email || null,
      role: "volunteer",

      contact: user.contact || null,
      skill_type: user.skill_type || "general_support",
      assigned_zone: user.assigned_zone || "unassigned",
      availability_status: "available",
      utilization_status: "ready",

      approved_at: serverTimestamp(),
      created_at: serverTimestamp(),
      source_request_id: user.id,
    });

    await deleteDoc(doc(db, REQUEST_COLLECTION, user.id));

    await queryClient.invalidateQueries({ queryKey: ["volunteer-requests"] });
    await queryClient.invalidateQueries({ queryKey: ["volunteers"] });
  }

  async function handleReject(user: any) {
    const confirmReject = confirm(
      `Reject volunteer request for ${getVolunteerName(user)}?`
    );

    if (!confirmReject) return;

    await deleteDoc(doc(db, REQUEST_COLLECTION, user.id));

    await queryClient.invalidateQueries({ queryKey: ["volunteer-requests"] });
  }

  if (isLoading) {
    return <div className="p-6">Loading volunteer requests...</div>;
  }

  return (
    <div className="flex flex-col gap-5 p-6 max-w-screen-xl mx-auto animate-page-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Volunteer Approval Requests
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Review newly registered volunteers before adding them to the active volunteer pool.
        </p>
      </div>

      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="section-label">Incoming Requests</p>
            <p className="text-xs text-gray-500 mt-1">
              Approved users will be moved into the volunteers collection.
            </p>
          </div>

          <span className="text-xs font-semibold text-[#4d7c56]">
            {pendingRequests.length} pending
          </span>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-100">
          <table className="w-full text-sm">
            <thead className="bg-[#f2f7f3] text-left text-[11px] uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-4 py-3">Volunteer</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Account Status</th>
                <th className="px-4 py-3">Registered</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 bg-white">
              {pendingRequests.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-10 text-center text-gray-400"
                  >
                    No pending volunteer approval requests.
                  </td>
                </tr>
              ) : (
                pendingRequests.map((user: any) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-[#4d7c56] text-white flex items-center justify-center text-xs font-bold">
                          {getInitials(user)}
                        </div>

                        <div>
                          <p className="font-semibold text-gray-900">
                            {getVolunteerName(user)}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            ID: {user.volunteer_id || user.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4 text-gray-600">
                      {user.email || "N/A"}
                    </td>

                    <td className="px-4 py-4">
                      <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-700">
                        {formatLabel(user.role || "volunteer")}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-700">
                        {formatLabel(user.account_status || "registered")}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-gray-600">
                      {formatTime(user.created_at)}
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleReject(user)}
                          className="rounded-lg border border-red-100 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-700 hover:bg-red-100"
                        >
                          Reject
                        </button>

                        <button
                          onClick={() => handleApprove(user)}
                          className="rounded-lg bg-[#2e5233] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#3a6142]"
                        >
                          Approve
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function getVolunteerName(user: any) {
  return (
    user.name ||
    user.display_name ||
    user.full_name ||
    getNameFromEmail(user.email) ||
    "Unnamed Volunteer"
  );
}

function getNameFromEmail(email?: string) {
  if (!email) return "";

  const namePart = email.split("@")[0];

  return namePart
    .replace(/[0-9]/g, "")
    .replace(/[._-]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

function getInitials(user: any) {
  const name = getVolunteerName(user);

  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
.map((word: string) => word[0]?.toUpperCase())
    .join("");
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
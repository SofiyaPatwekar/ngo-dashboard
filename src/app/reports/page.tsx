"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useJsApiLoader } from "@react-google-maps/api";
import { useSurveys } from "@/hooks/useSurveys";

const PROCESS_API =
  "https://volunteer-ai-api-420564015250.asia-south1.run.app/process/";

const DEFAULT_ADMIN_VOLUNTEER_ID = "dashboard_admin";

type ReportForm = {
  resident_name: string;
  resident_contact: string;
  location_name: string;
  latitude: string;
  longitude: string;
  zone_label: string;
  report_source: string;
  report_status: string;
  submitted_by_volunteer_id: string;
  text: string;
};

const emptyForm: ReportForm = {
  resident_name: "",
  resident_contact: "",
  location_name: "",
  latitude: "",
  longitude: "",
  zone_label: "",
  report_source: "dashboard",
  report_status: "new",
  submitted_by_volunteer_id: DEFAULT_ADMIN_VOLUNTEER_ID,
  text: "",
};

export default function ReportsPage() {
  return (
    <DashboardLayout>
      <ReportGenerator />
    </DashboardLayout>
  );
}

function ReportGenerator() {
  const [form, setForm] = useState<ReportForm>(emptyForm);
  const [file, setFile] = useState<File | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [message, setMessage] = useState("");

  const { data: surveys = [] } = useSurveys();

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  async function geocodeLocation(location: string) {
    if (!isLoaded || !window.google || !location.trim()) return null;

    const geocoder = new window.google.maps.Geocoder();

    return new Promise<{ lat: number; lng: number } | null>((resolve) => {
      geocoder.geocode({ address: location }, (results, status) => {
        if (status === "OK" && results?.[0]) {
          const loc = results[0].geometry.location;
          resolve({
            lat: loc.lat(),
            lng: loc.lng(),
          });
        } else {
          resolve(null);
        }
      });
    });
  }

  async function handleAutoCoordinates() {
    setMessage("");

    if (!form.location_name.trim()) {
      setMessage("Please enter location name first.");
      return;
    }

    const coords = await geocodeLocation(form.location_name);

    if (!coords) {
      setMessage("Could not calculate coordinates for this location.");
      return;
    }

    setForm((prev) => ({
      ...prev,
      latitude: String(coords.lat),
      longitude: String(coords.lng),
    }));

    setMessage("Coordinates calculated from location name.");
  }

  async function handleExtractFromFile() {
    setMessage("");

    if (!file) {
      setMessage("Please upload an image or PDF first.");
      return;
    }

    setIsExtracting(true);

    try {
      const body = new FormData();
      body.append("file", file);
      body.append("volunteer_id", DEFAULT_ADMIN_VOLUNTEER_ID);

      const res = await fetch(PROCESS_API, {
        method: "POST",
        body,
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error("API ERROR:", errText);
        throw new Error("Processing API failed");
      }

      const apiResponse = await res.json();

      console.log("FULL API RESPONSE:", apiResponse);

      const extracted =
        apiResponse.data ||
        apiResponse.result ||
        apiResponse.extracted_data ||
        apiResponse.extractedData ||
        apiResponse.report ||
        apiResponse.output ||
        apiResponse.structured_data ||
        apiResponse.structuredData ||
        apiResponse;

      console.log("NORMALIZED EXTRACTED DATA:", extracted);

      const locationName =
        extracted.location_name ??
        extracted.location ??
        extracted.address ??
        extracted.locationName ??
        "";

      let lat =
        extracted.latitude ??
        extracted.lat ??
        extracted.location_latitude ??
        extracted.locationLatitude ??
        "";

      let lng =
        extracted.longitude ??
        extracted.lng ??
        extracted.lon ??
        extracted.location_longitude ??
        extracted.locationLongitude ??
        "";

      if ((!lat || !lng) && locationName) {
        const coords = await geocodeLocation(locationName);
        if (coords) {
          lat = coords.lat;
          lng = coords.lng;
        }
      }

      setForm((prev) => ({
        ...prev,

        resident_name:
          extracted.resident_name ??
          extracted.name ??
          extracted.residentName ??
          extracted.resident ??
          prev.resident_name,

        resident_contact:
          extracted.resident_contact ??
          extracted.contact ??
          extracted.phone ??
          extracted.mobile ??
          extracted.residentContact ??
          extracted.phone_number ??
          prev.resident_contact,

        location_name: locationName || prev.location_name,

        latitude: lat ? String(lat) : prev.latitude,
        longitude: lng ? String(lng) : prev.longitude,

        zone_label:
          extracted.zone_label ??
          extracted.zone ??
          extracted.zoneLabel ??
          prev.zone_label,

        report_source:
          extracted.report_source ??
          extracted.source ??
          "dashboard_upload",

        report_status:
          extracted.report_status ??
          extracted.status ??
          "new",

        submitted_by_volunteer_id:
          extracted.submitted_by_volunteer_id ??
          extracted.volunteer_id ??
          extracted.submittedByVolunteerId ??
          DEFAULT_ADMIN_VOLUNTEER_ID,

        text:
          extracted.text ??
          extracted.description ??
          extracted.report_text ??
          extracted.incident_description ??
          extracted.incidentDescription ??
          extracted.summary ??
          extracted.details ??
          prev.text,
      }));

      setMessage("Document processed and form auto-filled.");
    } catch (error) {
      console.error(error);
      setMessage("Failed to process document. Please try again.");
    } finally {
      setIsExtracting(false);
    }
  }

  async function handleGenerateReport(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    if (!form.location_name.trim() || !form.text.trim()) {
      setMessage("Location name and report text are required.");
      return;
    }

    let finalLat = form.latitude;
    let finalLng = form.longitude;

    if (!finalLat || !finalLng) {
      const coords = await geocodeLocation(form.location_name);

      if (coords) {
        finalLat = String(coords.lat);
        finalLng = String(coords.lng);
      }
    }

    if (!finalLat || !finalLng) {
      setMessage("Could not calculate latitude and longitude.");
      return;
    }

    setIsGenerating(true);

    try {
      await addDoc(collection(db, "reports"), {
        resident_name: form.resident_name || null,
        resident_contact: form.resident_contact || null,
        location_name: form.location_name,
        latitude: Number(finalLat),
        longitude: Number(finalLng),
        zone_label: form.zone_label || null,
        report_source: form.report_source || "dashboard",
        report_status: form.report_status || "new",
        submitted_by_volunteer_id:
          form.submitted_by_volunteer_id || DEFAULT_ADMIN_VOLUNTEER_ID,
        text: form.text,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      });

      setForm(emptyForm);
      setFile(null);
      setMessage("Report generated successfully.");
    } catch (error) {
      console.error(error);
      setMessage("Failed to generate report.");
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="flex flex-col gap-5 p-6 max-w-screen-xl mx-auto animate-page-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Data Collection Center
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Generate manual reports, extract data from documents, and review
          volunteer survey submissions.
        </p>
      </div>

      {message && (
        <div className="rounded-2xl border border-[#e0ede2] bg-[#f2f7f3] px-4 py-3 text-sm text-[#2e5233] font-semibold">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.2fr] gap-5">
        <div className="card p-5">
          <p className="section-label mb-4">Upload Document</p>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-600">
                Upload Image / PDF
              </label>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="mt-1 w-full rounded-xl border border-gray-100 px-4 py-3 text-sm"
              />
            </div>

            <button
              type="button"
              onClick={handleExtractFromFile}
              disabled={isExtracting}
              className="btn-sage w-full justify-center"
            >
              {isExtracting ? "Processing Document..." : "Extract & Auto-fill"}
            </button>

            <div className="rounded-2xl bg-[#f2f7f3] border border-[#e0ede2] p-4 text-sm text-gray-600">
              Uploaded documents are processed through OCR and AI structuring.
              The system automatically uses the dashboard admin as the submitter.
            </div>
          </div>
        </div>

        <form onSubmit={handleGenerateReport} className="card p-5">
          <p className="section-label mb-4">Manual Report Form</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Resident Name"
              value={form.resident_name}
              onChange={(v: string) => setForm({ ...form, resident_name: v })}
            />

            <Input
              label="Resident Contact"
              value={form.resident_contact}
              onChange={(v: string) =>
                setForm({ ...form, resident_contact: v })
              }
            />

            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-gray-600">
                Location Name
              </label>
              <div className="mt-1 flex gap-2">
                <input
                  value={form.location_name}
                  onChange={(e) =>
                    setForm({ ...form, location_name: e.target.value })
                  }
                  placeholder="Example: Thane West"
                  className="w-full rounded-xl border border-gray-100 px-4 py-3 text-sm outline-none focus:border-[#4d7c56]"
                />
                <button
                  type="button"
                  onClick={handleAutoCoordinates}
                  className="rounded-xl border border-[#6B9E73] px-4 text-sm font-semibold text-[#4d7c56] hover:bg-[#f2f7f3]"
                >
                  Locate
                </button>
              </div>
            </div>

            <Input
              label="Latitude"
              value={form.latitude}
              readOnly
              onChange={(v: string) => setForm({ ...form, latitude: v })}
            />

            <Input
              label="Longitude"
              value={form.longitude}
              readOnly
              onChange={(v: string) => setForm({ ...form, longitude: v })}
            />

            <Input
              label="Zone Label"
              value={form.zone_label}
              onChange={(v: string) => setForm({ ...form, zone_label: v })}
            />

            <Select
              label="Report Status"
              value={form.report_status}
              options={["new", "processing", "resolved"]}
              onChange={(v: string) => setForm({ ...form, report_status: v })}
            />

            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-gray-600">
                Report Text
              </label>
              <textarea
                value={form.text}
                onChange={(e) => setForm({ ...form, text: e.target.value })}
                placeholder="Write report details here..."
                rows={5}
                className="mt-1 w-full resize-none rounded-xl border border-gray-100 px-4 py-3 text-sm outline-none focus:border-[#4d7c56]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isGenerating}
            className="btn-sage w-full justify-center mt-5"
          >
            {isGenerating ? "Generating Report..." : "Generate Report"}
          </button>
        </form>
      </div>

      <SurveyTable surveys={surveys} />
    </div>
  );
}

function SurveyTable({ surveys }: { surveys: any[] }) {
  const [selectedSurvey, setSelectedSurvey] = useState<any>(null);

  return (
    <>
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="section-label">Volunteer Survey Submissions</p>
            <p className="text-xs text-gray-500 mt-1">
              Household-level data collected by field volunteers.
            </p>
          </div>

          <span className="text-xs font-semibold text-[#4d7c56]">
            {surveys.length} records
          </span>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-100">
          <table className="w-full text-sm">
            <thead className="bg-[#f2f7f3] text-left text-[11px] uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-4 py-3">Resident</th>
                <th className="px-4 py-3">Zone</th>
                <th className="px-4 py-3">Members</th>
                <th className="px-4 py-3">Water</th>
                <th className="px-4 py-3">Toilet</th>
                <th className="px-4 py-3">Submitted</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 bg-white">
              {surveys.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-8 text-center text-gray-400"
                  >
                    No survey submissions found.
                  </td>
                </tr>
              ) : (
                surveys.map((survey: any) => (
                  <tr key={survey.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <p className="font-semibold text-gray-900">
                        {survey.resident_name || "Unknown resident"}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {survey.resident_contact || "No contact"}
                      </p>
                    </td>

                    <td className="px-4 py-4 text-gray-600">
                      {formatLabel(survey.zone_label || "N/A")}
                    </td>

                    <td className="px-4 py-4 text-gray-600">
                      {survey.total_members || "N/A"}
                    </td>

                    <td className="px-4 py-4 text-gray-600">
                      {survey.water_source || "N/A"}
                    </td>

                    <td className="px-4 py-4 text-gray-600">
                      {survey.toilet_access || "N/A"}
                    </td>

                    <td className="px-4 py-4 text-gray-600">
                      {formatTime(survey.created_at)}
                    </td>

                    <td className="px-4 py-4 text-right">
                      <button
                        onClick={() => setSelectedSurvey(survey)}
                        className="rounded-lg border border-[#6B9E73] px-3 py-1.5 text-xs font-semibold text-[#4d7c56] hover:bg-[#f2f7f3]"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedSurvey && (
        <SurveyDetailsModal
          survey={selectedSurvey}
          onClose={() => setSelectedSurvey(null)}
        />
      )}
    </>
  );
}

function SurveyDetailsModal({
  survey,
  onClose,
}: {
  survey: any;
  onClose: () => void;
}) {
  const details = [
    ["Resident Name", survey.resident_name],
    ["Resident Contact", survey.resident_contact],
    ["Zone", survey.zone_label],
    ["Volunteer ID", survey.submitted_by_volunteer_id],
    ["Total Members", survey.total_members],
    ["Children Count", survey.children_count],
    ["House Type", survey.house_type],
    ["Water Source", survey.water_source],
    ["Toilet Access", survey.toilet_access],
    ["Social Group", survey.social_group],
    ["Has Disability", survey.has_disability ? "Yes" : "No"],
    ["Immunized", survey.is_immunized ? "Yes" : "No"],
    ["Created At", formatTime(survey.created_at)],
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-2xl max-h-[82vh] overflow-hidden rounded-3xl bg-white shadow-2xl border border-gray-100">
        <div className="flex items-start justify-between border-b border-gray-100 px-5 py-4 bg-[#f2f7f3]">
          <div>
            <p className="section-label mb-1">Survey Details</p>
            <h2 className="text-lg font-bold text-gray-900">
              {survey.resident_name || "Household Survey"}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="h-8 w-8 rounded-xl bg-white text-gray-500 hover:text-gray-900 hover:bg-gray-50"
          >
            ✕
          </button>
        </div>

        <div className="p-5 max-h-[62vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-3">
            {details.map(([label, value]) => (
              <div
                key={label}
                className="rounded-2xl border border-gray-100 bg-white p-3"
              >
                <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">
                  {label}
                </p>
                <p className="text-sm font-bold text-[#2e5233] mt-1 break-words">
                  {String(value ?? "N/A")}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end border-t border-gray-100 px-5 py-3">
          <button onClick={onClose} className="btn-outline-sage">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  readOnly = false,
}: {
  label: string;
  value: string;
  onChange: any;
  readOnly?: boolean;
}) {
  return (
    <div>
      <label className="text-xs font-semibold text-gray-600">{label}</label>
      <input
        value={value}
        readOnly={readOnly}
        onChange={(e) => onChange(e.target.value)}
        className={`mt-1 w-full rounded-xl border border-gray-100 px-4 py-3 text-sm outline-none focus:border-[#4d7c56] ${
          readOnly ? "bg-gray-50 text-gray-500" : ""
        }`}
      />
    </div>
  );
}

function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: any;
}) {
  return (
    <div>
      <label className="text-xs font-semibold text-gray-600">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-xl border border-gray-100 px-4 py-3 text-sm outline-none focus:border-[#4d7c56]"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option.replaceAll("_", " ")}
          </option>
        ))}
      </select>
    </div>
  );
}

function formatLabel(value: string) {
  return String(value || "N/A")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatTime(timestamp: any) {
  if (!timestamp) return "N/A";

  try {
    const date =
      typeof timestamp.toDate === "function"
        ? timestamp.toDate()
        : new Date(timestamp);

    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "N/A";
  }
}
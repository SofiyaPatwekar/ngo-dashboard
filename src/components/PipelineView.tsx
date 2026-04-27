"use client";

import { useRealtimeStore } from "@/store/useRealtimeStore";
import { usePipeline } from "@/hooks/usePipeline";

export default function PipelineView() {
  const reports = useRealtimeStore((s) => s.reports);
  const { decision, assignment, isLoading } = usePipeline();

  const latestReport = reports[0];

  if (!latestReport) return null;

  return (
   <div className="bg-white p-6 rounded-2xl shadow mt-6">
  <h2 className="text-lg font-semibold mb-6 text-gray-700">
    Live AI Pipeline
  </h2>

  <div className="flex items-center justify-between">

    <Box title="Report" value={latestReport.title} />
    <Arrow />
    <Box title="Decision" value={decision?.priority || "Processing"} />
    <Arrow />
    <Box title="Assignment" value={assignment?.assigned_volunteer_id || "Pending"} />

  </div>
</div>
  );
}

function Box({ title, value, sub }: any) {
  return (
    <div className="flex flex-col items-center bg-gray-50 p-4 rounded-lg w-44">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="font-semibold text-center">{value}</p>
      <p className="text-xs text-gray-400">{sub}</p>
    </div>
  );
}

function Arrow() {
  return <div className="text-xl">→</div>;
}
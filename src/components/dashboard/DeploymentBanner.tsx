"use client";

export function DeploymentBanner({
  latestAssignment,
}: {
  latestAssignment: any;
}) {
  const title = latestAssignment
    ? "Deployment Plan Ready"
    : "Awaiting Deployment Plan";

  const description =
    latestAssignment?.coordination_explanation ||
    "AI will generate a coordinated deployment plan once assignment is created.";

  const status = latestAssignment?.assignment_status || "pending";

  return (
    <div className="card p-5 flex items-center gap-5 bg-gradient-to-r from-[#f2f7f3] to-white border border-[#e0ede2]">
      
      {/* Icon */}
      <div className="w-12 h-12 rounded-2xl bg-[#2e5233] flex items-center justify-center text-2xl flex-shrink-0 shadow-sage-sm">
        🛡️
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <h4 className="text-[14px] font-bold text-gray-900 leading-tight">
          {title}
        </h4>

        <p className="text-[12px] text-gray-500 mt-0.5 leading-snug">
          {description}
        </p>

        {/* Status */}
        <p className="text-[11px] mt-1 font-semibold text-[#4d7c56]">
          Status: {status}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <button className="btn-outline-sage">
          Request Changes
        </button>

        <button className="btn-sage shadow-sage-sm">
          {latestAssignment ? "Approve & Deploy" : "Waiting..."}
        </button>
      </div>
    </div>
  );
}
"use client";

export function AIInsightsImpact({ summary }: { summary: any }) {
  const totalReports = summary?.total_reports ?? 0;
  const medicalCases = summary?.medical_cases ?? 0;
  const foodCases = summary?.food_cases ?? 0;
  const shelterCases = summary?.shelter_cases ?? 0;
  const totalAssignments = summary?.total_assignments ?? 0;
  const totalVolunteers = summary?.total_volunteers ?? 0;
  const availableResources = summary?.available_resources ?? 0;
  const lowStockResources = summary?.low_stock_resources ?? 0;
  const urgentPending = summary?.urgent_dispatch_pending ?? 0;

  // 📊 Derived metrics
  const responseEfficiency =
    totalReports > 0 ? Math.round((totalAssignments / totalReports) * 100) : 0;

  const medicalShare =
    totalReports > 0 ? Math.round((medicalCases / totalReports) * 100) : 0;

  // 🎨 Dynamic colors
  const efficiencyColor =
    responseEfficiency > 75
      ? "#4d7c56"
      : responseEfficiency > 40
      ? "#f59e0b"
      : "#ef4444";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* ===== AI INSIGHTS ===== */}
    <div className="card p-4 flex flex-col h-full">
  <p className="section-label mb-3">AI Insights</p>

  <div className="flex flex-col justify-between flex-1">
    
    {/* TOP: Case Distribution */}
    <div className="space-y-2">
      <p className="text-[11px] font-semibold text-gray-600">
        Case Distribution
      </p>

      {[
        { label: "Medical", value: medicalCases, color: "bg-red-400" },
        { label: "Food", value: foodCases, color: "bg-amber-400" },
        { label: "Shelter", value: shelterCases, color: "bg-green-400" },
      ].map((item) => {
        const percent =
          totalReports > 0
            ? Math.round((item.value / totalReports) * 100)
            : 0;

        return (
          <div key={item.label}>
            <div className="flex justify-between text-[10px] text-gray-500">
              <span>{item.label}</span>
              <span>{item.value}</span>
            </div>

            <div className="h-1.5 rounded-full bg-gray-100 mt-1">
              <div
                className={`h-full rounded-full ${item.color}`}
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>

    {/* BOTTOM: Summary */}
    <div className="flex items-end justify-between mt-4">
      <div>
        <p className="text-[11px] text-gray-500">Medical Load</p>
        <p className="text-xl font-bold text-gray-900">
          {medicalShare}%
        </p>
      </div>

      <div className="text-right">
      <p className="text-[11px] text-gray-500">Urgent Pending</p>
        <p className="text-xl font-bold text-gray-900">
          {urgentPending}
        </p>
      </div>

      {urgentPending > 0 && (
        <span className="ml-2 px-2 py-0.5 text-[10px] rounded-md bg-red-500 text-white font-semibold">
          ALERT
        </span>
      )}
    </div>
  </div>
</div>

      {/* ===== IMPACT ===== */}
      <div className="card p-5 flex flex-col gap-4">
        <p className="section-label">Impact at a Glance</p>

        <div className="flex items-center gap-6">
          {/* Donut */}
          <div className="relative w-24 h-24 flex-shrink-0">
            <svg viewBox="0 0 100 100" className="w-24 h-24 -rotate-90">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#e0ede2"
                strokeWidth="11"
              />

              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke={efficiencyColor}
                strokeWidth="11"
                strokeDasharray={`${Math.min(responseEfficiency, 100) * 2.39} 239`}
                strokeLinecap="round"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-bold text-gray-900">
                {Math.min(responseEfficiency, 100)}%
              </span>
              <span className="text-[9px] text-gray-500 text-center">
                Response<br />Efficiency
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-col gap-4 flex-1">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#f2f7f3] flex items-center justify-center">
                👥
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">
                  {totalVolunteers}
                </p>
                <p className="text-[11px] text-gray-500">
                  Volunteers Registered
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#f2f7f3] flex items-center justify-center">
                ✅
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">
                  {totalAssignments}
                </p>
                <p className="text-[11px] text-gray-500">
                  Tasks Generated
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Resources */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#f2f7f3] border border-[#e0ede2]">
          <span className="text-[#4d7c56] font-bold text-sm">+</span>
          <span className="text-[12px] font-semibold text-[#3a6142]">
            Resources Available
          </span>

          <span className="ml-auto text-[11px] font-bold text-[#2e5233] bg-[#e0ede2] px-2 py-0.5 rounded-lg">
            {availableResources}
          </span>
        </div>

        {lowStockResources > 0 && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-50 border border-amber-100">
            <span className="text-amber-600 font-bold text-sm">!</span>
            <span className="text-[12px] font-semibold text-amber-700">
              Low Stock Resources
            </span>

            <span className="ml-auto text-[11px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-lg">
              {lowStockResources}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
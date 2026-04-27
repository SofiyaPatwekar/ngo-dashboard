"use client";

export function KPICards({
  summary,
  latestDecision,
}: {
  summary: any;
  latestDecision?: any; // ✅ optional → fixes error
}) {
  const cards = [
    {
      label: "Total Reports",
      value: summary?.total_reports ?? 0,
      sub: "All incidents",
      color: "bg-gray-100 text-gray-700",
    },
    {
      label: "Critical Cases",
      value: summary?.priority_1_cases ?? 0,
      sub: "Priority 1",
      color: "bg-red-100 text-red-600",
    },
    {
      label: "Urgent Dispatch",
      value: summary?.urgent_dispatch_pending ?? 0,
      sub: "Pending action",
      color: "bg-amber-100 text-amber-600",
    },
    {
      label: "Available Volunteers",
      value: summary?.available_volunteers ?? 0,
      sub: "Ready to deploy",
      color: "bg-green-100 text-green-600",
    },
    {
      label: "Busy Volunteers",
      value: summary?.busy_volunteers ?? 0,
      sub: "Currently assigned",
      color: "bg-blue-100 text-blue-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
      {cards.map((card, i) => (
        <div
          key={i}
          className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-gray-400">
                {card.label}
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-1">
                {card.value}
              </h2>

              <p className="text-[11px] text-gray-500 mt-1">
                {card.sub}
              </p>
            </div>

            <div
              className={`h-10 w-10 flex items-center justify-center rounded-xl ${card.color}`}
            >
              {getIcon(card.label)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------------- ICONS ---------------- */

function getIcon(label: string) {
  switch (label) {
    case "Critical Cases":
      return "⚠️";
    case "Urgent Dispatch":
      return "⚡";
    case "Available Volunteers":
      return "🟢";
    case "Busy Volunteers":
      return "🔵";
    default:
      return "📊";
  }
}
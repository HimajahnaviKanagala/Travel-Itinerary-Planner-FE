import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";

const PALETTE = {
  flights: "#e8922a",
  accommodation: "#8b5cf6",
  food: "#f59e0b",
  activities: "#10b981",
  transport: "#3b82f6",
  shopping: "#ec4899",
  other: "#9a8b77",
};
const EMOJI = {
  flights: "✈️",
  accommodation: "🏨",
  food: "🍜",
  activities: "🎭",
  transport: "🚌",
  shopping: "🛍️",
  other: "💰",
};

export default function ExpenseChart({ summary = {} }) {
  const data = Object.entries(summary)
    .map(([cat, total]) => ({
      cat,
      total: parseFloat(total),
      name: cat.charAt(0).toUpperCase() + cat.slice(1),
      color: PALETTE[cat] || PALETTE.other,
    }))
    .filter((d) => d.total > 0)
    .sort((a, b) => b.total - a.total);

  if (!data.length)
    return (
      <div className="card p-10 text-center">
        <div className="text-4xl mb-2">📊</div>
        <p className="text-surface-400 text-sm">No expense data yet</p>
      </div>
    );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="card p-5">
        <h3 className="font-semibold text-dark-900 text-sm mb-4">
          By Category
        </h3>
        <div className="flex items-center gap-4">
          <ResponsiveContainer width={120} height={120}>
            <PieChart>
              <Pie
                data={data}
                dataKey="total"
                cx="50%"
                cy="50%"
                outerRadius={56}
                innerRadius={32}
              >
                {data.map((d) => (
                  <Cell key={d.cat} fill={d.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(v) => [`$${v.toFixed(2)}`]}
                contentStyle={{
                  background: "#fff",
                  border: "1px solid #e4ddd2",
                  borderRadius: "12px",
                  fontSize: "12px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-col gap-2 flex-1">
            {data.map((d) => (
              <div key={d.cat} className="flex items-center gap-2 text-xs">
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: d.color }}
                />
                <span className="text-surface-500 flex-1">
                  {EMOJI[d.cat]} {d.name}
                </span>
                <span className="font-semibold text-dark-900">
                  ${d.total.toFixed(0)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card p-5">
        <h3 className="font-semibold text-dark-900 text-sm mb-4">Breakdown</h3>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ left: 0, right: 8 }}
          >
            <XAxis type="number" tick={{ fill: "#9a8b77", fontSize: 10 }} />
            <YAxis
              dataKey="name"
              type="category"
              tick={{ fill: "#7e7160", fontSize: 10 }}
              width={90}
            />
            <Tooltip
              formatter={(v) => [`$${v.toFixed(2)}`]}
              contentStyle={{
                background: "#fff",
                border: "1px solid #e4ddd2",
                borderRadius: "12px",
                fontSize: "12px",
              }}
            />
            <Bar dataKey="total" radius={[0, 6, 6, 0]}>
              {data.map((d) => (
                <Cell key={d.cat} fill={d.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

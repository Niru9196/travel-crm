import React from "react";

export default function Pill({ icon: Icon, label, value, tone }) {
  const toneClass = tone === "green" ? "text-emerald-600" : tone === "red" ? "text-rose-600" : "text-gray-900";

  return (
    <div className="flex items-center gap-2 text-sm text-gray-500">
      <Icon size={15} className="text-gray-400" />
      <span>{label}</span>
      <span className={`font-semibold ${toneClass}`}>{value}</span>
    </div>
  );
}

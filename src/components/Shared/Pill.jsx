import React from "react";

export default function Pill({ icon: Icon, label, value, tone }) {
  const toneClass = tone === "green" ? "text-emerald-600" : tone === "red" ? "text-rose-600" : "text-gray-900";

  return (
    <div className="flex items-center gap-2 text-sm text-gray-500 bg-white h-12 px-4 rounded-2xl">
      <Icon size={15} className="text-grey-light" />
      <span className="italic">{label}</span>
      <span className={`font-semibold ${toneClass}`}>{value}</span>
    </div>
  );
}

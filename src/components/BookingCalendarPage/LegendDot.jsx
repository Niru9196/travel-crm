import React from "react";

export default function LegendDot({ color, label }) {
  return (
    <div className="flex items-center gap-1.5 text-xs text-gray-500">
      <span className={`w-2 h-2 rounded-full ${color}`} />
      {label}
    </div>
  );
}

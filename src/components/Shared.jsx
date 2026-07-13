import React from "react";
import { Plane, Building2, Bus } from "lucide-react";
import { OWNER_COLORS, STATUS_STYLES } from "../data/mockData";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const SERVICE_ICON = {
  Flight: Plane,
  Accomodation: Building2,
  Transportation: Bus,
};

export function StatusPill({ status }) {
  return (
    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${STATUS_STYLES[status] || "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  );
}

export function OwnerAvatars({ owners }) {
  return (
    <div className="flex -space-x-2">
      {owners.map((o, i) => {
        const c = OWNER_COLORS[o] || { text: "text-gray-600", ring: "ring-gray-200", bg: "bg-gray-50" };
        return (
          <div
            key={o + i}
            className={`w-7 h-7 rounded-full ${c.bg} ${c.text} ring-2 ${c.ring} border-2 border-white flex items-center justify-center text-[10px] font-bold`}
            title={o}
          >
            {o}
          </div>
        );
      })}
    </div>
  );
}

export function ServiceCell({ service, sub }) {
  const Icon = SERVICE_ICON[service];
  return (
    <div className="flex flex-col items-start gap-1">
      {Icon ? (
        <>
          <Icon size={16} className="text-violet-600" strokeWidth={2} />
          <span className="text-sm text-gray-800">{service}</span>
        </>
      ) : (
        <span className="text-sm text-gray-800">{service}</span>
      )}
      {sub && (
        <span className="text-xs bg-violet-50 text-violet-600 px-2 py-0.5 rounded-full font-medium">
          {sub}
        </span>
      )}
    </div>
  );
}

export function currency(n) {
  return `₹ ${n.toLocaleString("en-IN")}`;
}

export function Toggle({ checked, onChange, label }) {
  return (
    <Label className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer select-none">
      <Switch checked={checked} onCheckedChange={onChange} />
      {label}
    </Label>
  );
}

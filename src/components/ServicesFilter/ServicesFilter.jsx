import React, { useState } from "react";
import { X, RefreshCw, Check, Plane, Building2, Bus, Ticket, PersonStanding, Contact, ShieldCheck, LayoutGrid } from "lucide-react";
import { SERVICE_TYPES } from "@/data/mockData";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

const ICONS = {
  flight: Plane,
  accomodation: Building2,
  transport_land_1: Bus,
  transport_land_2: Bus,
  ticket: Ticket,
  activity: PersonStanding,
  visa: Contact,
  insurance: ShieldCheck,
  others: LayoutGrid,
};

export default function ServicesFilter({ onApply, onClose }) {
  const [selected, setSelected] = useState(SERVICE_TYPES.map((s) => s.key));
  const [limitless, setLimitless] = useState(true);

  const allOn = selected.length === SERVICE_TYPES.length;

  function toggleOne(key) {
    setSelected((s) => (s.includes(key) ? s.filter((k) => k !== key) : [...s, key]));
  }
  function toggleAll() {
    setSelected(allOn ? [] : SERVICE_TYPES.map((s) => s.key));
  }
  function reset() {
    setSelected(SERVICE_TYPES.map((s) => s.key));
    setLimitless(true);
  }

  return (
    <div className="absolute z-40 mt-2 w-[340px] bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <Label className="flex items-center gap-2.5 text-xs font-bold text-gray-700 tracking-wide cursor-pointer">
          <Checkbox checked={allOn} onCheckedChange={toggleAll} className="data-[state=checked]:bg-violet-600 data-[state=checked]:border-violet-600 border-gray-300 w-[18px] h-[18px] rounded" />
          OTHER SERVICES
        </Label>
        <Button variant="ghost" onClick={onClose} className="text-gray-400 hover:text-gray-600 p-0 h-auto">
          <X size={16} />
        </Button>
      </div>

      <div className="py-1 max-h-72 overflow-y-auto">
        {SERVICE_TYPES.map((s) => {
          const Icon = ICONS[s.key];
          return (
            <Label key={s.key} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">
              <Checkbox checked={selected.includes(s.key)} onCheckedChange={() => toggleOne(s.key)} className="data-[state=checked]:bg-violet-600 data-[state=checked]:border-violet-600 border-gray-300 w-[18px] h-[18px] rounded" />
              <Icon size={15} className="text-gray-500" />
              {s.label}
            </Label>
          );
        })}
      </div>

      <div className="px-4 py-3 border-t border-gray-100">
        <Label className="flex items-center gap-2.5 text-sm text-gray-700 cursor-pointer">
          <Checkbox checked={limitless} onCheckedChange={() => setLimitless((v) => !v)} className="data-[state=checked]:bg-violet-600 data-[state=checked]:border-violet-600 border-gray-300 w-[18px] h-[18px] rounded" />
          LIMITLESS
        </Label>
      </div>

      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50">
        <Button variant="ghost" onClick={toggleAll} className="text-xs font-semibold text-gray-600 border border-gray-200 rounded-lg px-3 py-2 bg-white hover:bg-gray-50 h-auto">
          {allOn ? "Deselect All" : "Select All"}
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={reset} className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 bg-white hover:bg-gray-100 p-0">
            <RefreshCw size={14} />
          </Button>
          <Button
            variant="ghost"
            onClick={() => { onApply?.({ selected, limitless }); onClose?.(); }}
            className="px-5 py-2 rounded-lg bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 h-auto"
          >
            Apply
          </Button>
        </div>
      </div>
    </div>
  );
}

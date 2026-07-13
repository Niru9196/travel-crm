import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, X, RefreshCw, Check } from "lucide-react";
import { ALL_OWNERS } from "@/data/mockData";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

function OwnerSearchDropdown({ options, selected, onToggle, open, setOpen }) {
  const ref = useRef(null);
  useEffect(() => {
    function onClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [setOpen]);

  return (
    <div className="relative" ref={ref}>
      <Button
        variant="ghost"
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-400 bg-white h-auto"
      >
        Search / Select Owners
        <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </Button>
      {open && (
        <div className="absolute z-30 mt-1 w-full bg-white border border-gray-100 rounded-xl shadow-lg py-1 max-h-56 overflow-y-auto">
          {options.map((o) => (
            <Label key={o} className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">
              <Checkbox
                checked={selected.includes(o)}
                onCheckedChange={() => onToggle(o)}
                className="data-[state=checked]:bg-violet-600 data-[state=checked]:border-violet-600 border-gray-300 w-4 h-4 rounded"
              />
              {o}
            </Label>
          ))}
        </div>
      )}
    </div>
  );
}

function Chips({ items, onRemove }) {
  if (!items.length) return null;
  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {items.map((o) => (
        <span key={o} className="flex items-center gap-1.5 border border-gray-200 rounded-full pl-3 pr-2 py-1 text-xs text-gray-600 bg-white">
          {o}
          <Button variant="ghost" onClick={() => onRemove(o)} className="text-gray-400 hover:text-gray-600 p-0 h-auto">
            <X size={12} />
          </Button>
        </span>
      ))}
    </div>
  );
}

export default function OwnerMultiSelect({ onApply, onClose }) {
  const [advanceSearch, setAdvanceSearch] = useState(false);
  const [simple, setSimple] = useState([]);
  const [primary, setPrimary] = useState([]);
  const [secondary, setSecondary] = useState([]);
  const [openSimple, setOpenSimple] = useState(false);
  const [openPrimary, setOpenPrimary] = useState(false);
  const [openSecondary, setOpenSecondary] = useState(false);

  function toggle(list, setList, name) {
    setList(list.includes(name) ? list.filter((x) => x !== name) : [...list, name]);
  }

  function reset() {
    setSimple([]);
    setPrimary([]);
    setSecondary([]);
  }

  function apply() {
    onApply?.(advanceSearch ? { primary, secondary } : { owners: simple });
    onClose?.();
  }

  return (
    <div className="absolute z-40 mt-2 w-[520px] bg-white border border-gray-100 rounded-2xl shadow-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-semibold text-gray-900">Select Booking Owners</span>
        <div className="flex items-center gap-3">
          <Label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
            <Checkbox
              checked={advanceSearch}
              onCheckedChange={() => setAdvanceSearch((v) => !v)}
              className="data-[state=checked]:bg-violet-600 data-[state=checked]:border-violet-600 border-gray-300 w-4 h-4 rounded"
            />
            Advance Search
          </Label>
          <Button variant="ghost" onClick={onClose} className="text-gray-400 hover:text-gray-600 p-0 h-auto">
            <X size={16} />
          </Button>
        </div>
      </div>

      {!advanceSearch ? (
        <div>
          <div className="text-xs text-gray-500 mb-2">{simple.length} Owner(s) Selected</div>
          <OwnerSearchDropdown
            options={ALL_OWNERS}
            selected={simple}
            onToggle={(o) => toggle(simple, setSimple, o)}
            open={openSimple}
            setOpen={setOpenSimple}
          />
          <Chips items={simple} onRemove={(o) => toggle(simple, setSimple, o)} />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-5">
          <div>
            <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
              <span className="font-semibold text-gray-700">Primary Owner(s)</span>
              <span>{primary.length} Owner(s) Selected</span>
            </div>
            <OwnerSearchDropdown
              options={ALL_OWNERS}
              selected={primary}
              onToggle={(o) => toggle(primary, setPrimary, o)}
              open={openPrimary}
              setOpen={setOpenPrimary}
            />
            <Chips items={primary} onRemove={(o) => toggle(primary, setPrimary, o)} />
          </div>
          <div>
            <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
              <span className="font-semibold text-gray-700">Secondary Owner(s)</span>
              <span>{secondary.length} Owner(s) Selected</span>
            </div>
            <OwnerSearchDropdown
              options={ALL_OWNERS}
              selected={secondary}
              onToggle={(o) => toggle(secondary, setSecondary, o)}
              open={openSecondary}
              setOpen={setOpenSecondary}
            />
            <Chips items={secondary} onRemove={(o) => toggle(secondary, setSecondary, o)} />
          </div>
        </div>
      )}

      <div className="flex items-center justify-end gap-2 mt-5">
        <Button variant="ghost" onClick={reset} className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 p-0">
          <RefreshCw size={14} />
        </Button>
        <Button variant="ghost" onClick={apply} className="px-5 py-2 rounded-lg bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 h-auto">
          Apply
        </Button>
      </div>
    </div>
  );
}

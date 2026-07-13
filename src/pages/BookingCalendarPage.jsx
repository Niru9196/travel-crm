import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calculator, ArrowUpRight, ArrowDownLeft, CalendarDays, Filter,
  ChevronLeft, ChevronRight, MoreVertical, Plane, MapPin, Bus, Search,
  ArrowDownLeft as GotIcon, ArrowUpRight as GaveIcon, Clock, RefreshCcw, Pencil, Trash2,
} from "lucide-react";
import Topbar from "../components/Topbar";
import { currency } from "../components/Shared";
import { CALENDAR_DAYS, TIME_SLOTS } from "../data/mockData";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function Pill({ icon: Icon, label, value, tone }) {
  const toneClass = tone === "green" ? "text-emerald-600" : tone === "red" ? "text-rose-600" : "text-gray-900";
  return (
    <div className="flex items-center gap-2 text-sm text-gray-500">
      <Icon size={15} className="text-gray-400" />
      <span>{label}</span>
      <span className={`font-semibold ${toneClass}`}>{value}</span>
    </div>
  );
}

const TYPE_ICON = { Flight: Plane, UAE: MapPin, Transport: Bus };
const TYPE_DOT = { Flight: "bg-emerald-500", UAE: "bg-amber-500", Transport: "bg-sky-500" };

const SLOT_HEIGHT = 56; // px per hour row, must match the h-14 grid rows below
const CARD_HEIGHT = 84; // rendered card height incl. margin, keeps cards from touching
const DAY_START_HOUR = 9;

function timeToMinutes(time) {
  const [h, m] = time.split(":").map(Number);
  return (h - DAY_START_HOUR) * 60 + m;
}

// Lays events out top-to-bottom by time, pushing any event down just enough
// to clear the card above it so nothing overlaps, regardless of how close
// two bookings are in time.
function layoutEvents(events) {
  const sorted = [...events].sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time));
  let lastBottom = -Infinity;
  return sorted.map((ev) => {
    const rawTop = (timeToMinutes(ev.time) / 60) * SLOT_HEIGHT;
    const top = Math.max(rawTop, lastBottom + 8);
    lastBottom = top + CARD_HEIGHT;
    return { ...ev, top };
  });
}

function EventCard({ ev, onMenu }) {
  const Icon = TYPE_ICON[ev.type] || Plane;
  return (
    <div
      className="absolute left-1 right-1 bg-white border border-gray-200 rounded-xl shadow-xs px-3 py-2 hover:shadow-md transition-shadow cursor-pointer"
      style={{ top: ev.top, height: CARD_HEIGHT - 8 }}
    >
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${TYPE_DOT[ev.type] || "bg-gray-400"}`} />
          <span className="text-xs font-semibold text-gray-900 underline">{ev.id}</span>
        </div>
        <Button variant="ghost" onClick={(e) => { e.stopPropagation(); onMenu(ev, e); }} className="text-gray-400 hover:text-gray-600 p-0 h-auto">
          <MoreVertical size={13} />
        </Button>
      </div>
      <div className="flex items-center gap-1.5 text-xs text-violet-600 mb-1">
        <Icon size={12} />
        {ev.type}
      </div>
      <div className="flex items-center gap-1 text-[11px] text-gray-400">
        <Clock size={10} />
        {ev.time}
        <span className="ml-1 text-gray-500 truncate">{ev.label}</span>
      </div>
    </div>
  );
}

function ContextMenu({ pos, onClose }) {
  if (!pos) return null;
  const items = [
    { label: "You Got", icon: GotIcon, tone: "text-emerald-600" },
    { label: "You Gave", icon: GaveIcon, tone: "text-rose-600" },
    { label: "Reschedule", icon: RefreshCcw, tone: "text-gray-700" },
    { label: "Change Status", icon: Clock, tone: "text-gray-700" },
    { label: "Edit", icon: Pencil, tone: "text-gray-700" },
    { label: "Delete", icon: Trash2, tone: "text-rose-600" },
  ];
  return (
    <>
      <div className="fixed inset-0 z-30" onClick={onClose} />
      <div
        className="fixed z-40 w-48 bg-white border border-gray-100 rounded-xl shadow-xl py-1"
        style={{ top: pos.y, left: pos.x }}
      >
        {items.map((it, i) => (
          <Button
            key={it.label}
            variant="ghost"
            onClick={onClose}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm hover:bg-gray-50 text-left justify-start rounded-none ${it.tone} ${i === 3 ? "border-t border-gray-100" : ""}`}
          >
            <it.icon size={14} />
            {it.label}
          </Button>
        ))}
      </div>
    </>
  );
}

export default function BookingCalendarPage() {
  const navigate = useNavigate();
  const [menuPos, setMenuPos] = useState(null);

  function openMenu(ev, e) {
    setMenuPos({ x: e?.clientX ?? 400, y: e?.clientY ?? 300 });
  }

  const totalCompleted = 14, totalOnTrip = 3, totalUpcoming = 0, totalCancelled = 1;

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-6">
      <Topbar crumbs={["Finance", "Bookings", "Booking Calendar"]} />

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-6">
          <Pill icon={Calculator} label="Net" value={currency(4870)} tone="green" />
          <Pill icon={ArrowUpRight} label="You Give" value={currency(70580)} tone="red" />
          <Pill icon={ArrowDownLeft} label="You Get" value={currency(75450)} tone="green" />
        </div>
        <Button variant="ghost" onClick={() => navigate("/finance/bookings")} className="w-9 h-9 rounded-xl border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50 p-0 h-auto">
          <CalendarDays size={16} className="text-violet-600" />
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-4">
        <div className="grid grid-cols-4 gap-6">
          <div>
            <div className="text-xs font-semibold text-gray-700 mb-2">Booking Date</div>
            <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-400">
              <span>Start Date</span>
              <ChevronRight size={12} className="text-gray-300" />
              <span>End Date</span>
              <CalendarDays size={14} className="ml-auto text-gray-300" />
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-700 mb-2">Travel Date</div>
            <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-400">
              <span>Start Date</span>
              <ChevronRight size={12} className="text-gray-300" />
              <span>End Date</span>
              <CalendarDays size={14} className="ml-auto text-gray-300" />
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-700 mb-2">Booking Owner</div>
            <div className="flex items-center justify-between border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-400">
              Search / Select Owners
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-700 mb-2">Booking ID</div>
            <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-400">
              <Search size={13} className="text-gray-300" />
              <Input placeholder="Type here" className="outline-hidden text-sm w-full bg-transparent placeholder:text-gray-300" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-gray-900">Bookings Timeline</h2>
          <Button variant="ghost" className="flex items-center gap-2 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 h-auto">
            <Filter size={12} /> Filter
          </Button>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <Button variant="ghost" className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50 p-0 h-auto">
            <ChevronLeft size={14} />
          </Button>
          <span className="text-sm font-medium text-gray-700">05 Mar '25 - 14 Mar '25</span>
          <Button variant="ghost" className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50 p-0 h-auto">
            <ChevronRight size={14} />
          </Button>
          <span className="text-xs font-semibold bg-amber-50 text-amber-600 px-2.5 py-1 rounded-full">Total 18</span>
          <div className="flex-1" />
          <LegendDot color="bg-emerald-500" label={`Completed ${totalCompleted}`} />
          <LegendDot color="bg-amber-500" label={`On Trip ${totalOnTrip}`} />
          <LegendDot color="bg-sky-500" label={`Upcoming ${totalUpcoming}`} />
          <LegendDot color="bg-rose-500" label={`Cancelled ${totalCancelled}`} />
        </div>

        {/* Timeline grid */}
        <div className="border border-gray-100 rounded-xl overflow-hidden">
          <div className="grid" style={{ gridTemplateColumns: `70px repeat(${CALENDAR_DAYS.length}, 1fr)` }}>
            <div className="border-b border-r border-gray-100 bg-gray-50" />
            {CALENDAR_DAYS.map((d) => (
              <div key={d.date} className="border-b border-r border-gray-100 bg-gray-50 px-3 py-2 last:border-r-0">
                <div className="text-xs font-semibold text-gray-700">{d.date}</div>
                <div className="flex items-center gap-2 text-[10px] text-gray-400 mt-0.5">
                  <span>OS {d.os}</span>
                  <span>Limitless {d.limitless}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="relative grid" style={{ gridTemplateColumns: `70px repeat(${CALENDAR_DAYS.length}, 1fr)` }}>
            {/* time column */}
            <div className="border-r border-gray-100">
              {TIME_SLOTS.map((t) => (
                <div key={t} className="h-14 flex items-start justify-end pr-2 pt-1 text-[10px] text-gray-400 border-b border-gray-50">
                  {t}
                </div>
              ))}
            </div>
            {CALENDAR_DAYS.map((d) => {
              const laidOut = layoutEvents(d.events);
              const neededHeight = laidOut.length
                ? Math.max(...laidOut.map((e) => e.top + CARD_HEIGHT))
                : TIME_SLOTS.length * SLOT_HEIGHT;
              return (
                <div
                  key={d.date}
                  className="relative border-r border-gray-100 last:border-r-0"
                  style={{ minHeight: Math.max(neededHeight, TIME_SLOTS.length * SLOT_HEIGHT) }}
                >
                  {TIME_SLOTS.map((t) => (
                    <div key={t} className="h-14 border-b border-gray-50" />
                  ))}
                  {laidOut.map((ev) => (
                    <EventCard key={ev.id + ev.time} ev={ev} onMenu={(ev2, e) => openMenu(ev2, e)} />
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <ContextMenu pos={menuPos} onClose={() => setMenuPos(null)} />
    </div>
  );
}

function LegendDot({ color, label }) {
  return (
    <div className="flex items-center gap-1.5 text-xs text-gray-500">
      <span className={`w-2 h-2 rounded-full ${color}`} />
      {label}
    </div>
  );
}

import React, { useState } from "react";
import {
  X, Check, MessageCircle, Mail, Link2, Copy, Download, ChevronDown,
  ArrowLeft, Share2, CalendarDays,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";


export function ShareLedgerModal({ onClose }) {
  const [pendingOnly, setPendingOnly] = useState(false);
  const [customRange, setCustomRange] = useState(false);
  const [copied, setCopied] = useState(false);
  const link = "https://ciergo.app/ledger/share/CUST-1042-8f2a";

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl w-[420px] p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-semibold text-gray-900">Ledger Settings</h3>
          <Button variant="ghost" onClick={onClose} className="text-gray-400 hover:text-gray-600 p-0 h-auto"><X size={18} /></Button>
        </div>

        <div className="space-y-4 mb-5">
          <Label className="flex items-start gap-3 cursor-pointer">
            <Checkbox checked={pendingOnly} onCheckedChange={() => setPendingOnly((v) => !v)} className="data-[state=checked]:bg-violet-600 data-[state=checked]:border-violet-600 border-gray-300 w-[18px] h-[18px] rounded" />
            <div>
              <div className="text-sm font-medium text-gray-800">Share Pending Invoices only</div>
              <div className="text-xs text-gray-400">Display only pending invoices those are not settled yet</div>
            </div>
          </Label>
          <Label className="flex items-start gap-3 cursor-pointer">
            <Checkbox checked={customRange} onCheckedChange={() => setCustomRange((v) => !v)} className="data-[state=checked]:bg-violet-600 data-[state=checked]:border-violet-600 border-gray-300 w-[18px] h-[18px] rounded" />
            <div>
              <div className="text-sm font-medium text-gray-800">Share in a custom Date Range</div>
              <div className="text-xs text-gray-400">Only data of selected date range would be shown</div>
            </div>
          </Label>
          {customRange && (
            <div className="ml-8 flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-500">
              <CalendarDays size={13} />
              <span>Start Date</span> → <span>End Date</span>
            </div>
          )}
        </div>

        <div className="space-y-2.5">
          <Button variant="ghost" className="w-full flex items-center justify-center gap-2 border border-emerald-200 bg-emerald-50 text-emerald-700 rounded-xl py-2.5 text-sm font-semibold hover:bg-emerald-100 h-auto">
            <MessageCircle size={15} /> Share on WhatsApp
          </Button>
          <Button variant="ghost" className="w-full flex items-center justify-center gap-2 border border-gray-200 bg-white text-gray-700 rounded-xl py-2.5 text-sm font-semibold hover:bg-gray-50 h-auto">
            <Mail size={15} /> Share on Email
          </Button>
          <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2.5">
            <Link2 size={14} className="text-gray-400 shrink-0" />
            <span className="text-xs text-gray-600 truncate flex-1">{link}</span>
            <Button
              variant="ghost"
              onClick={() => { navigator.clipboard?.writeText(link); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
              className="text-violet-600 hover:text-violet-700 p-0 h-auto"
            >
              <Copy size={14} />
            </Button>
          </div>
          {copied && <div className="text-xs text-violet-600 text-right">Copied!</div>}
          {!customRange && (
            <div className="text-[11px] text-gray-400 pl-1">Note: This link contains full ledger data</div>
          )}
        </div>
      </div>
    </div>
  );
}

export function DownloadLedgerModal({ onClose }) {
  const [fileName, setFileName] = useState("Anand-Mishra-Ledger");
  const [format, setFormat] = useState("PDF");

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl w-[400px] p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-semibold text-gray-900">Download Ledger</h3>
          <Button variant="ghost" onClick={onClose} className="text-gray-400 hover:text-gray-600 p-0 h-auto"><X size={18} /></Button>
        </div>

        <div className="mb-4">
          <div className="text-xs font-semibold text-gray-700 mb-1.5">File name</div>
          <Input
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-violet-200"
          />
        </div>
        <div className="mb-6">
          <div className="text-xs font-semibold text-gray-700 mb-1.5">Format</div>
          <div className="grid grid-cols-3 gap-2">
            {["PDF", "XLSX", "CSV"].map((f) => (
              <Button
                variant="ghost"
                key={f}
                onClick={() => setFormat(f)}
                className={`py-2 rounded-lg text-sm font-medium border h-auto ${
                  format === f ? "bg-violet-600 text-white border-violet-600" : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {f}
              </Button>
            ))}
          </div>
        </div>
        <div className="text-[11px] text-gray-400 mb-4">Data reflects the custom date range selected on the ledger page.</div>
        <Button variant="ghost" onClick={onClose} className="w-full flex items-center justify-center gap-2 bg-violet-600 text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-violet-700 h-auto">
          <Download size={15} /> Download {format}
        </Button>
      </div>
    </div>
  );
}

export function PdfViewOverlay({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={onClose} className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 p-0">
            <ArrowLeft size={16} />
          </Button>
          <h2 className="text-base font-semibold text-gray-900">{title}</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 h-auto">
            <Share2 size={14} /> Share
          </Button>
          <Button variant="ghost" className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-violet-600 rounded-xl hover:bg-violet-700 h-auto">
            <Download size={14} /> Download
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-6 py-6 bg-gray-50">{children}</div>
    </div>
  );
}

export function PdfDropdown({ onView, onDownload, onShare }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white">
        <Button variant="ghost" onClick={onView} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 h-auto rounded-none">
          View PDF
        </Button>
        <Button variant="ghost" onClick={() => setOpen((v) => !v)} className="px-2.5 py-2 border-l border-gray-200 text-gray-400 hover:bg-gray-50 h-auto rounded-none">
          <ChevronDown size={14} />
        </Button>
      </div>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-1 w-40 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-20">
            <Button variant="ghost" onClick={() => { setOpen(false); onView(); }} className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 h-auto justify-start rounded-none">View PDF</Button>
            <Button variant="ghost" onClick={() => { setOpen(false); onDownload(); }} className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 h-auto justify-start rounded-none">Download</Button>
            <Button variant="ghost" onClick={() => { setOpen(false); onShare(); }} className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 h-auto justify-start rounded-none">Share</Button>
          </div>
        </>
      )}
    </div>
  );
}

export function PaymentSideSheet({ kind, onClose }) {
  // kind: "got" | "gave"
  const isGot = kind === "got";
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex justify-end">
      <div className="w-[420px] bg-white h-full shadow-xl flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className={`text-base font-semibold ${isGot ? "text-emerald-600" : "text-rose-600"}`}>
            {isGot ? "You Got" : "You Gave"}
          </h3>
          <Button variant="ghost" onClick={onClose} className="text-gray-400 hover:text-gray-600 p-0 h-auto"><X size={18} /></Button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          <div>
            <div className="text-xs font-semibold text-gray-700 mb-1.5">Amount</div>
            <Input
              type="number"
              placeholder="0.00"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-violet-200"
            />
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-700 mb-1.5">Payment Date</div>
            <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-400">
              <CalendarDays size={14} /> Select date
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-700 mb-1.5">Mode</div>
            <div className="flex items-center justify-between border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-400">
              Select mode <ChevronDown size={14} />
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-700 mb-1.5">Account</div>
            <div className="flex items-center justify-between border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-400">
              Select account <ChevronDown size={14} />
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-700 mb-1.5">Notes</div>
            <Textarea rows={3} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-violet-200 min-h-0" />
          </div>
        </div>
        <div className="px-6 py-4 border-t border-gray-100">
          <Button
            onClick={onClose}
            className={`w-full rounded-xl py-2.5 text-sm font-semibold text-white h-auto ${isGot ? "bg-emerald-600 hover:bg-emerald-700" : "bg-rose-600 hover:bg-rose-700"}`}
          >
            Record {isGot ? "Receipt" : "Payment"}
          </Button>
        </div>
      </div>
    </div>
  );
}

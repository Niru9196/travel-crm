import React from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { TableCell, TableRow } from "@/components/ui/table";
import { StatusPill, OwnerAvatars, ServiceCell } from "@/components/Shared/Shared";
import { ActionMenu, MORE_ACTIONS_APPROVED, MORE_ACTIONS_PENDING, MORE_ACTIONS_REJECTED, MORE_ACTIONS_DELETED } from "@/components/Shared/ActionMenu";
import { FileText, ClipboardList, Wallet, Check, X, ChevronDown, IndianRupee } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BookingRow({
  r,
  i,
  isSelected,
  selectMode,
  toggleSelectRow,
  getDisplayStatus,
  showVoucherTasks,
  currency,
  navigate,
  tab,
}) {
  const approvalBorder = tab === "waiting"
    ? r.approval === "approved" ? "border-l-4 border-l-emerald-400"
    : r.approval === "rejected" ? "border-l-4 border-l-rose-400"
    : r.approval === "pending" ? "border-l-4 border-l-amber-400"
    : ""
    : "";

  return (
    <TableRow
      key={r.id}
      className={cn(
        "bg-white border-b border-slate-100 transition-colors hover:bg-slate-50",
        isSelected && "bg-violet-50/60",
        approvalBorder
      )}
    >
      {selectMode && (
        <TableCell className="px-5 py-4">
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => toggleSelectRow(r.id)}
            className="data-[state=checked]:bg-violet-600 data-[state=checked]:border-violet-600 border-gray-300 w-[18px] h-[18px] rounded"
          />
        </TableCell>
      )}
      <TableCell className="px-5 py-4 font-semibold text-gray-900 whitespace-nowrap">{r.id}</TableCell>
      <TableCell className="px-5 py-4 text-gray-700 whitespace-nowrap">
        <Button
          variant="ghost"
          onClick={() => navigate("/finance/ledger/CUST-1042")}
          className="hover:text-violet-600 hover:underline text-left p-0 h-auto text-sm leading-5 font-medium text-darkest-grey"
        >
          {r.pax}
        </Button>
      </TableCell>
      <TableCell className="px-5 py-4 text-darkest-grey whitespace-nowrap text-sm leading-5 font-medium">{r.travelDate}</TableCell>
      <TableCell className="px-5 py-4 text-darkest-grey text-sm leading-5 font-medium"><ServiceCell service={r.service} sub={r.sub} /></TableCell>
      <TableCell className="px-5 py-4">
        <StatusPill status={getDisplayStatus(r)} />
      </TableCell>
      <TableCell className="px-5 py-4 font-medium text-gray-900 whitespace-nowrap">{currency(r.amount)}</TableCell>
      <TableCell className="px-5 py-4"><OwnerAvatars owners={r.owners} /></TableCell>

      {showVoucherTasks && (
        <>
          <TableCell className="px-5 py-4">
            {tab === "waiting" && r.approval === "rejected" ? (
              <span className="text-gray-300">--</span>
            ) : r.voucher ? (
              <div className="inline-flex items-center rounded-lg border border-gray-200 bg-white overflow-hidden">
                <Button
                  variant="ghost"
                  className="w-8 h-8 flex items-center justify-center text-violet-600 hover:bg-gray-50 p-0 rounded-none"
                >
                  <FileText size={14} />
                </Button>
                <div className="w-px h-5 bg-gray-200" />
                <Button
                  variant="ghost"
                  className="w-6 h-8 flex items-center justify-center text-gray-400 hover:bg-gray-50 p-0 rounded-none"
                >
                  <ChevronDown size={14} />
                </Button>
              </div>
            ) : (
              <Button
                variant="ghost"
                className="w-8 h-8 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-400 hover:bg-gray-50 p-0"
              >
                +
              </Button>
            )}
          </TableCell>
          <TableCell className="px-5 py-4">
            {tab === "waiting" && r.approval === "rejected" ? (
              <span className="text-gray-300">--</span>
            ) : r.tasks > 0 ? (
              <div className="relative inline-flex w-8 h-8 rounded-lg border border-gray-200 bg-white items-center justify-center">
                <ClipboardList size={16} className="text-amber-500" />
                <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center w-3.5 h-3.5 rounded-full border border-gray-200 bg-white text-[9px] font-bold text-violet-600 leading-none">
                  {r.tasks}
                </span>
              </div>
            ) : (
              <Button
                variant="ghost"
                className="w-8 h-8 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-400 hover:bg-gray-50 p-0"
              >
                +
              </Button>
            )}
          </TableCell>
        </>
      )}

      <TableCell className="px-5 py-4">
        <div className="flex items-center gap-2">
          {tab === "waiting" && r.approval === "pending" && (
            <>
              <Button variant="ghost" className="w-8 h-8 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-100 p-0">
                <Check size={14} />
              </Button>
              <Button variant="ghost" className="w-8 h-8 rounded-lg border border-rose-200 bg-rose-50 text-rose-600 flex items-center justify-center hover:bg-rose-100 p-0">
                <X size={14} />
              </Button>
            </>
          )}
          {tab !== "deleted" && !(tab === "waiting" && r.approval === "rejected") && !(tab === "waiting" && r.approval === "pending") && (
            <Button variant="ghost" className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 p-0">
              <IndianRupee size={14} />
            </Button>
          )}
          <ActionMenu
            items={
              tab === "deleted"
                ? MORE_ACTIONS_DELETED
                : tab === "waiting"
                ? r.approval === "rejected"
                  ? MORE_ACTIONS_REJECTED
                  : r.approval === "pending"
                  ? MORE_ACTIONS_PENDING
                  : MORE_ACTIONS_APPROVED
                : MORE_ACTIONS_APPROVED
            }
          />
        </div>
      </TableCell>
    </TableRow>
  );
}

import React, { useState, useMemo } from "react";
import { ArrowUp, ArrowDown, Filter, X, Search, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * ColumnHeader with sort/filter dropdown
 * @param {object} props
 * @param {string} props.label - Column header text
 * @param {"sort"|"filter"|"both"} props.type - Type of interaction
 * @param {string|null} props.sortDir - Current sort direction: "asc" | "desc" | null
 * @param {function} props.onSort - Called with "asc" | "desc" | null
 * @param {string[]} props.filterOptions - List of available filter values
 * @param {string[]} props.activeFilters - Currently selected filter values
 * @param {function} props.onFilter - Called with updated filter array
 */
export default function ColumnHeader({
  label,
  type = "sort",
  sortDir = null,
  onSort,
  filterOptions = [],
  activeFilters = [],
  onFilter,
}) {
  const [search, setSearch] = useState("");

  const hasSort = type === "sort" || type === "both";
  const hasFilter = type === "filter" || type === "both";
  const isActive = sortDir !== null || activeFilters.length > 0;

  const filteredOptions = useMemo(() => {
    if (!search) return filterOptions;
    return filterOptions.filter((opt) =>
      opt.toLowerCase().includes(search.toLowerCase())
    );
  }, [filterOptions, search]);

  function handleToggleFilter(value) {
    if (activeFilters.includes(value)) {
      onFilter?.(activeFilters.filter((v) => v !== value));
    } else {
      onFilter?.([...activeFilters, value]);
    }
  }

  function clearAll() {
    onSort?.(null);
    onFilter?.([]);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "flex items-center gap-1.5 text-xs uppercase tracking-wide font-semibold whitespace-nowrap group focus:outline-hidden p-0 h-auto rounded-none bg-transparent",
            isActive ? "text-violet-600" : "text-gray-400 hover:text-gray-600"
          )}
        >
          {label}
          {sortDir === "asc" && <ArrowUp size={12} className="text-violet-600" />}
          {sortDir === "desc" && <ArrowDown size={12} className="text-violet-600" />}
          {!sortDir && hasFilter && activeFilters.length > 0 && (
            <span className="w-4 h-4 rounded-full bg-violet-100 text-violet-600 text-[9px] font-bold flex items-center justify-center">
              {activeFilters.length}
            </span>
          )}
          {!sortDir && activeFilters.length === 0 && (
            <Filter size={11} className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-52">
        {/* Sort options */}
        {hasSort && (
          <>
            <DropdownMenuItem
              onClick={() => onSort?.(sortDir === "asc" ? null : "asc")}
              className={cn(sortDir === "asc" && "text-violet-600 bg-violet-50")}
            >
              <ArrowUp size={14} className="mr-2" />
              Sort Ascending
              {sortDir === "asc" && <Check size={14} className="ml-auto" />}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onSort?.(sortDir === "desc" ? null : "desc")}
              className={cn(sortDir === "desc" && "text-violet-600 bg-violet-50")}
            >
              <ArrowDown size={14} className="mr-2" />
              Sort Descending
              {sortDir === "desc" && <Check size={14} className="ml-auto" />}
            </DropdownMenuItem>
          </>
        )}

        {/* Filter options */}
        {hasFilter && hasSort && <DropdownMenuSeparator />}
        {hasFilter && (
          <>
            {filterOptions.length > 5 && (
              <div className="px-2 py-1.5">
                <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-2 py-1.5 text-sm">
                  <Search size={12} className="text-gray-400" />
                  <Input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search..."
                    className="flex-1 outline-hidden bg-transparent text-sm"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
            )}
            <div className="max-h-[200px] overflow-y-auto">
              {filteredOptions.map((opt) => (
                <DropdownMenuCheckboxItem
                  key={opt}
                  checked={activeFilters.includes(opt)}
                  onCheckedChange={() => handleToggleFilter(opt)}
                  onSelect={(e) => e.preventDefault()}
                >
                  {opt}
                </DropdownMenuCheckboxItem>
              ))}
            </div>
          </>
        )}

        {/* Clear */}
        {isActive && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={clearAll} className="text-gray-500">
              <X size={14} className="mr-2" />
              Clear
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

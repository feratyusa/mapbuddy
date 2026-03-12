"use client";

import { useState, useEffect } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  ColumnDef,
  SortingState,
  ColumnFiltersState,
} from "@tanstack/react-table";
import { ChevronDown, ChevronUp, Search, MapPin, Image as ImageIcon, SlidersVertical, X } from "lucide-react";
import ConditionChip from "./ConditionChip";
import TypeChip from "./TypeChip";

type DataItem = {
  id: number;
  latitude: number | null;
  longitude: number | null;
  city: string;
  road_section: string;
  total: number;
  unit: string;
  side: string;
  type: string;
  description: string;
  condition: string;
};

const getColumns = (
  onLocationSelect: (id: number) => void,
  onViewImage: (id: number) => void
): ColumnDef<DataItem>[] => [
    {
      accessorKey: "id",
      header: "No",
    },
    {
      accessorKey: "type",
      header: "Tipe",
      cell: ({ getValue }) => <TypeChip type={getValue() as string} />,
      filterFn: (row, columnId, filterValue) => {
        if (!filterValue || filterValue.length === 0) return true;
        return filterValue.includes(row.getValue(columnId));
      },
    },
    {
      accessorKey: "city",
      header: "Kota",
      filterFn: (row, columnId, filterValue) => {
        if (!filterValue || filterValue.length === 0) return true;
        return filterValue.includes(row.getValue(columnId));
      },
    },
    {
      accessorKey: "road_section",
      header: "Ruas Jalan",
    },
    {
      accessorKey: "condition",
      header: "Kondisi",
      cell: ({ getValue }) => <ConditionChip condition={getValue() as string} />,
      filterFn: (row, columnId, filterValue) => {
        if (!filterValue || filterValue.length === 0) return true;
        return filterValue.includes(row.getValue(columnId));
      },
    },
    {
      id: "action",
      enableSorting: false,
      cell: ({ row }) => {
        const data = row.original;
        const hasLocation = data.latitude != null && data.longitude != null;

        return (
          <div className="flex items-center gap-2">
            {hasLocation ? (
              <button
                onClick={() => onLocationSelect(data.id)}
                className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors text-xs font-semibold"
                title="View on Map"
              >
                <MapPin className="w-3 h-3" />
                Map
              </button>
            ) : (
              <span className="text-xs text-gray-400 px-2 py-1">No Map</span>
            )}

            <button
              onClick={() => onViewImage(data.id)}
              className="flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-600 rounded hover:bg-emerald-100 transition-colors text-xs font-semibold"
              title="View Image"
            >
              <ImageIcon className="w-3 h-3" />
              Image
            </button>
          </div>
        );
      },
    },
  ];

interface DataTableProps {
  onLocationSelect: (id: number) => void;
  onViewImage: (id: number) => void;
}

export default function DataTable({ onLocationSelect, onViewImage }: DataTableProps) {
  const [data, setData] = useState<DataItem[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  useEffect(() => {
    // Fetch data from public directory
    fetch("/data/data.json")
      .then((res) => res.json())
      .then((jsonData) => {
        setData(jsonData);
      })
      .catch((err) => console.error("Error fetching data.json:", err));
  }, []);

  const columns = getColumns(onLocationSelect, onViewImage);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      globalFilter,
      columnFilters,
    },
  });

  return (
    <div className="flex flex-col h-full bg-white text-gray-900 p-4 w-full">
      {/* Search and Filter Toggle */}
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search all columns..."
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-9 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
          />
        </div>
        <button
          onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          className={`px-3 py-2 border rounded-lg flex items-center gap-2 transition-all text-sm font-medium ${isFiltersOpen || columnFilters.length > 0
            ? "bg-blue-50 border-blue-200 text-blue-600 shadow-sm"
            : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
        >
          <SlidersVertical className="w-4 h-4" />
          <span>Filters</span>
          {columnFilters.length > 0 && (
            <span className="bg-blue-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
              {columnFilters.length}
            </span>
          )}
        </button>
      </div>

      {/* Collapsible Column Filters */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isFiltersOpen ? "max-h-[800px] mb-4 opacity-100" : "max-h-0 opacity-0"
          }`}
      >
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Helper functions defined inline for clarity in this large component */}
          {(() => {
            const handleFilterChange = (columnId: string, value: string) => {
              if (!value) return;
              const currentFilters = (table.getColumn(columnId)?.getFilterValue() as string[]) || [];
              if (!currentFilters.includes(value)) {
                table.getColumn(columnId)?.setFilterValue([...currentFilters, value]);
              }
            };

            const removeFilter = (columnId: string, value: string) => {
              const currentFilters = (table.getColumn(columnId)?.getFilterValue() as string[]) || [];
              table.getColumn(columnId)?.setFilterValue(currentFilters.filter(v => v !== value));
            };

            const renderFilterGroup = (columnId: string, label: string, placeholder: string) => {
              const selectedValues = (table.getColumn(columnId)?.getFilterValue() as string[]) || [];
              const uniqueValues = Array.from(new Set(data.map((item: any) => item[columnId]))).sort();

              return (
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">{label}</label>
                  <select
                    value=""
                    onChange={(e) => handleFilterChange(columnId, e.target.value)}
                    className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  >
                    <option value="" disabled>{placeholder}</option>
                    {uniqueValues.map((val) => (
                      <option key={val} value={val}>{val}</option>
                    ))}
                  </select>

                  {/* Selected Tags Bank */}
                  <div className="flex flex-wrap gap-1.5 min-h-[24px]">
                    {selectedValues.map(v => (
                      <span
                        key={v}
                        className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-md border border-blue-100 animate-in fade-in zoom-in-95 duration-200"
                      >
                        {v}
                        <X
                          className="w-3 h-3 cursor-pointer hover:bg-blue-100 rounded-sm"
                          onClick={() => removeFilter(columnId, v)}
                        />
                      </span>
                    ))}
                  </div>
                </div>
              );
            };

            return (
              <>
                {renderFilterGroup("type", "Tipe Rambu", "Tambah Tipe...")}
                {renderFilterGroup("city", "Kota / Wilayah", "Tambah Kota...")}
                {renderFilterGroup("condition", "Kondisi", "Tambah Kondisi...")}
              </>
            );
          })()}

          <div className="md:col-span-3 flex justify-end border-t pt-2">
            <button
              onClick={() => table.resetColumnFilters()}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold p-1"
            >
              Reset All Filters
            </button>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="flex-1 overflow-auto border border-gray-200 rounded-md">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0 z-10 shadow-sm">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <th
                      key={header.id}
                      className="px-4 py-3 cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className="flex items-center gap-1">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: <ChevronUp className="h-4 w-4" />,
                          desc: <ChevronDown className="h-4 w-4" />,
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="bg-white border-b hover:bg-gray-50 cursor-pointer"
                  onClick={(e) => {
                    // Prevent double-firing if the 'View' button itself was clicked
                    if ((e.target as HTMLElement).closest('button')) return;

                    const item = row.original as DataItem;
                    if (item.latitude != null && item.longitude != null) {
                      onLocationSelect(item.id);
                    }
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-8 text-center text-gray-500"
                >
                  No results found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

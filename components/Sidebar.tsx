"use client";

import { X } from "lucide-react";
import DataTable from "./DataTable";
import { useState, useEffect } from "react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationSelect: (id: number) => void;
  onViewImage: (id: number) => void;
}

export default function Sidebar({ isOpen, onClose, onLocationSelect, onViewImage }: SidebarProps) {
  const [totalData, setTotalData] = useState(0);
  const [lastUpdated, setLastUpdated] = useState("");

  const dateConfig: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }

  useEffect(() => {
    // Fetch data just to get the length. In a real app we might pass this down or use a global state.
    fetch("/data/data.json")
      .then((res) => res.json())
      .then((jsonData) => {
        setTotalData(jsonData.length);
        // We know the file was last updated around '2026-03-11T15:19:46.534Z' (we'll fetch HEAD headers to be more precise)
        fetch("/data/data.json", { method: "HEAD" })
          .then(res => {
            const lastModified = res.headers.get("last-modified");
            if (lastModified) {
              const date = new Date(lastModified);
              setLastUpdated(date.toLocaleString("id-ID", dateConfig));
            } else {
              setLastUpdated(new Date("1984-12-30T00:00:00.000Z").toLocaleString("id-ID", dateConfig));
            }
          })
      })
      .catch((err) => console.error("Error fetching data stat:", err));
  }, []);

  return (
    <div
      className={`
        bg-white shadow-lg overflow-hidden transition-all duration-300 ease-in-out shrink-0
        ${isOpen ? "w-full md:w-1/2" : "w-0"}
      `}
    >
      <div className="flex flex-col h-screen w-full relative border-r">
        <div className="flex items-center justify-between p-4 border-b bg-gray-50/50">
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-800">Total Rambu Terdata: {totalData}</span>
            {lastUpdated && <span className="text-xs text-gray-500">Terakhir diperbarui: {lastUpdated}</span>}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors bg-white shadow-sm border"
            aria-label="Close Sidebar"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="flex-1 overflow-hidden relative">
          {/* Prevent tiny slivers or weird overflow when transitioning */}
          <div className="absolute inset-0 w-full min-w-[320px]">
            <DataTable
              onLocationSelect={onLocationSelect}
              onViewImage={onViewImage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

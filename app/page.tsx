"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import WelcomeModal from "../components/WelcomeModal";
import { X } from "lucide-react";

const Map = dynamic(() => import("../components/Map"), {
  ssr: false,
  loading: () => (
    <div className="flex w-full h-full items-center justify-center bg-gray-100 text-gray-800">
      Loading Map...
    </div>
  ),
});

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // Store the ID of the selected location to uniquely identify the marker to pop up
  const [selectedLocationId, setSelectedLocationId] = useState<number | null>(null);

  // Store the ID for the full-screen image viewer modal
  const [selectedImageId, setSelectedImageId] = useState<number | null>(null);

  const handleLocationSelect = (id: number) => {
    setSelectedLocationId(id);
    // Auto-close sidebar on mobile devices (width < 768px for standard md breakpoint)
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <main className="flex h-screen w-screen m-0 p-0 overflow-hidden bg-white">
      <WelcomeModal />
      {/* Sidebar Drawer */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onLocationSelect={handleLocationSelect}
        onViewImage={setSelectedImageId}
      />

      {/* Map Content */}
      <div className="flex-1 relative h-full">
        {/* Toggle Button */}
        {!isSidebarOpen && (
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="absolute top-1/2 left-0 -translate-y-1/2 z-[1000] py-6 px-3 bg-white rounded-r-md shadow-md hover:bg-gray-50 transition-colors border border-gray-200 border-l-0 flex flex-col items-center justify-center"
            aria-label="Open Data Explorer"
          >
            <div className="flex flex-col items-center text-sm font-bold tracking-widest text-gray-700 gap-1">
              <span>D</span>
              <span>A</span>
              <span>T</span>
              <span>A</span>
            </div>
          </button>
        )}
        <Map selectedLocationId={selectedLocationId} onViewImage={setSelectedImageId} />
      </div>

      {/* Global Image Viewer Modal */}
      {selectedImageId && (
        <div 
          className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/60 p-4 transition-opacity cursor-pointer"
          onClick={() => setSelectedImageId(null)}
        >
          <div 
            className="relative bg-white rounded-lg shadow-2xl max-w-3xl w-full flex flex-col overflow-hidden cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 border-b">
              <h3
                className="font-semibold text-gray-800 truncate pr-4"
                title={`Gambar Rambu No. ${selectedImageId}`}
              >
                Gambar Rambu No. {selectedImageId}
              </h3>
              <button
                onClick={() => setSelectedImageId(null)}
                className="p-1.5 rounded-full hover:bg-gray-100 transition-colors text-gray-600 shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 bg-gray-50 min-h-[300px] overflow-auto">
              <img
                src={`/images/RAMBU_${selectedImageId}.png`}
                alt={`Rambu ${selectedImageId}`}
                className="max-h-[70vh] min-w-[300px] md:min-w-[500px] w-auto object-contain rounded mx-auto block"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/image_not_found.png';
                }}
              />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

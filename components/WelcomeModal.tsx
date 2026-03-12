"use client";

import { useState, useEffect } from "react";
import { X, MapPin, List, Eye } from "lucide-react";

export default function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasVisited = localStorage.getItem("visited");
    if (!hasVisited) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem("visited", "true");
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-100 transform animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="px-6 pt-8 pb-4 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Welcome</h2>
          <p className="text-gray-500 text-sm">Jelajahi rambu lalu lintas jalan.</p>
        </div>

        {/* Content */}
        <div className="px-8 py-6 space-y-6">
          <div className="flex items-start gap-4">
            <div className="bg-blue-50 p-2.5 rounded-xl text-blue-600 shrink-0">
              <List className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 text-sm">Data Explorer</h3>
              <p className="text-xs text-gray-500 leading-relaxed">Klik tab <strong>DATA</strong> di sisi kiri untuk melihat data rambu-rambu jalan.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-emerald-50 p-2.5 rounded-xl text-emerald-600 shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 text-sm">Map Markers</h3>
              <p className="text-xs text-gray-500 leading-relaxed">Klik marka rambu jalan untuk meninjau detail lebih lanjut.</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 border-t border-gray-100">
          <button
            onClick={handleClose}
            className="w-full py-3.5 bg-gray-900 hover:bg-black text-white rounded-xl font-bold shadow-lg shadow-gray-200 transition-all active:scale-[0.98]"
          >
            Mulai
          </button>
        </div>

        {/* Close button icon for accessibility */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

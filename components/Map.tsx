"use client";

import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import ConditionChip from "./ConditionChip";
import TypeChip from "./TypeChip";
import { getTypeColor } from "@/utils/typeStyles";

const defaultPosition: L.LatLngExpression = [-7.631010760058522, 111.52982868982029]

const createMarkerIcon = (color: string) => L.divIcon({
  html: `<svg width="30" height="42" viewBox="0 0 30 42" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 0C6.71573 0 0 6.71573 0 15C0 26.25 15 42 15 42C15 42 30 26.25 30 15C30 6.71573 23.2843 0 15 0ZM15 20.25C12.1005 20.25 9.75 17.8995 9.75 15C9.75 12.1005 12.1005 9.75 15 9.75C17.8995 9.75 20.25 12.1005 20.25 15C20.25 17.8995 17.8995 20.25 15 20.25Z" fill="${color}" stroke="white" stroke-width="2"/>
  </svg>`,
  className: "custom-marker-icon",
  iconSize: [30, 42],
  iconAnchor: [15, 42],
  popupAnchor: [0, -40],
});

// Cache for icons to avoid re-creation
const iconCache: Record<string, L.DivIcon> = {};
const getDynamicIcon = (type: string) => {
  const color = getTypeColor(type);
  if (!iconCache[color]) {
    iconCache[color] = createMarkerIcon(color);
  }
  return iconCache[color];
};

// Component to handle map resizing
function ResizeMapHandler() {
  const map = useMap();
  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    resizeObserver.observe(map.getContainer());
    return () => {
      resizeObserver.disconnect();
    };
  }, [map]);
  return null;
}

// Component to handle flying to selected marker
function MapSyncHandler({
  selectedLocationId,
  data,
  markerRefs
}: {
  selectedLocationId: number | null;
  data: any[];
  markerRefs: React.RefObject<Record<number, L.Marker | null>>;
}) {
  const map = useMap();

  useEffect(() => {
    if (selectedLocationId !== null) {
      const location = data.find((d) => d.id === selectedLocationId);
      if (location && location.latitude != null && location.longitude != null) {
        // Fly to the coordinates
        map.flyTo([location.latitude, location.longitude], 18, {
          duration: 1.5,
        });

        // Wait a bit fully before opening the popup so it doesn't get glitchy during flyTo
        setTimeout(() => {
          const marker = markerRefs.current[selectedLocationId];
          if (marker) {
            marker.openPopup();
          }
        }, 1500);
      }
    }
  }, [selectedLocationId, data, map, markerRefs]);

  return null;
}

interface MapProps {
  selectedLocationId?: number | null;
  onViewImage?: (id: number) => void;
}

export default function Map({ selectedLocationId = null, onViewImage }: MapProps) {
  const [data, setData] = useState<any[]>([]);
  const [initialCenter, setInitialCenter] = useState<L.LatLngExpression | null>(null);
  const markerRefs = useRef<Record<number, L.Marker | null>>({});

  useEffect(() => {
    fetch("/data/data.json")
      .then((res) => res.json())
      .then((jsonData) => {
        setData(jsonData);

        // Pick a random location as the starting point
        if (jsonData.length > 0) {
          const validData = jsonData.filter((item: any) => item.latitude != null && item.longitude != null);
          if (validData.length > 0) {
            const randomItem = validData[Math.floor(Math.random() * validData.length)];
            setInitialCenter([randomItem.latitude, randomItem.longitude]);
          } else {
            // Fallback if no valid coordinates
            setInitialCenter(defaultPosition);
          }
        }
      })
      .catch((err) => {
        console.error("Map fetch error:", err);
        setInitialCenter(defaultPosition);
      });
  }, []);

  if (!initialCenter) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-gray-500 font-medium tracking-wide">Mempersiapkan Peta...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full relative z-[1]">
      <MapContainer
        center={initialCenter}
        zoom={14}
        style={{ height: "100%", width: "100%", position: "absolute", inset: 0 }}
        scrollWheelZoom={true}
      >
        <ResizeMapHandler />
        <MapSyncHandler
          selectedLocationId={selectedLocationId}
          data={data}
          markerRefs={markerRefs}
        />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {data.map((item) => {
          if (item.latitude == null || item.longitude == null) return null;

          const icon = getDynamicIcon(item.type);

          return (
            <Marker
              key={item.id}
              position={[item.latitude, item.longitude]}
              icon={icon}
              ref={(ref) => {
                if (ref) {
                  markerRefs.current[item.id] = ref;
                }
              }}
              eventHandlers={{
                click: (e) => {
                  // If we click the marker itself, it becomes the pinned selection
                  if (typeof window !== "undefined") {
                    // Dispatch a custom event to update the parent Home component
                    // or we could accept an `onSelect` prop down to Map.
                    // For simplicity, we just keep it open native leaflet behavior on click,
                    // but the problem is selectedLocationId won't be synced. 
                    // Let's at least keep this marker forcibly open by treating it as clicked in Leaflet.
                    e.target.openPopup();
                  }
                }
              }}
            >
              <Popup>
                <div className="text-sm max-w-xs">
                  <div className="font-bold mb-2 border-b pb-1">Lokasi No. {item.id}</div>
                  <img
                    src={`/images/RAMBU_${item.id}.png`}
                    alt={`Rambu ${item.id}`}
                    className="w-full h-auto mb-2 rounded shadow-sm object-cover max-h-32 cursor-pointer hover:opacity-90 transition-opacity relative z-10"
                    onClick={(e) => {
                      // Stop event from propagating to the map below
                      e.stopPropagation();
                      if (onViewImage) onViewImage(item.id);
                    }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/image_not_found.png';
                    }}
                  />
                  <div className="space-y-1 mt-2">
                    <div><strong>Kota:</strong> {item.city}</div>
                    <div><strong>Ruas Jalan:</strong> {item.road_section}</div>
                    <div className="flex items-center gap-1">
                      <strong>Tipe:</strong>
                      <TypeChip type={item.type} />
                    </div>
                    <div><strong>Keterangan:</strong> {item.description}</div>
                    <div className="flex items-center gap-1">
                      <strong>Kondisi:</strong>
                      <ConditionChip condition={item.condition} />
                    </div>
                    <div><strong>Jumlah:</strong> {item.total} {item.unit}</div>
                    <div className="text-[10px] text-gray-400 mt-1 pt-1 border-t">
                      {item.latitude}, {item.longitude}
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}

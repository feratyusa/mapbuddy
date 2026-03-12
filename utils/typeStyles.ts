export const SIGN_TYPES = {
  PERINTAH: { color: "#3b82f6", label: "PERINTAH" }, // blue-500
  PETUNJUK: { color: "#6366f1", label: "PETUNJUK" }, // indigo-500
  PERINGATAN: { color: "#f97316", label: "PERINGATAN" }, // orange-500
  "TRAFFIC LIGHT": { color: "#8b5cf6", label: "TRAFFIC LIGHT" }, // violet-500
  "WARNING LIGHT": { color: "#ec4899", label: "WARNING LIGHT" }, // pink-500
  "PELICAN CROSSING": { color: "#64748b", label: "PELICAN CROSSING" }, // slate-500
};

export const getTypeColor = (type: string): string => {
  const t = type.toUpperCase();
  return SIGN_TYPES[t as keyof typeof SIGN_TYPES]?.color || "#6b7280"; // gray-500 default
};

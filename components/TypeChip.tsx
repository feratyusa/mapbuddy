"use client";

import React from "react";
import {
  Shield,
  Info,
  AlertTriangle,
  TrafficCone,
  Zap,
  User,
  HelpCircle
} from "lucide-react";

interface TypeChipProps {
  type: string;
}

export default function TypeChip({ type }: TypeChipProps) {
  const t = type.toUpperCase();

  const iconConfig: Record<string, React.ReactNode> = {
    "PERINTAH": <Shield className="w-3 h-3" />,
    "PETUNJUK": <Info className="w-3 h-3" />,
    "PERINGATAN": <AlertTriangle className="w-3 h-3" />,
    "TRAFFIC LIGHT": <TrafficCone className="w-3 h-3" />,
    "WARNING LIGHT": <Zap className="w-3 h-3" />,
    "PELICAN CROSSING": <User className="w-3 h-3" />
  };

  const styleConfig: Record<string, string> = {
    "PERINTAH": "bg-blue-100 text-blue-700 border-blue-200",
    "PETUNJUK": "bg-indigo-100 text-indigo-700 border-indigo-200",
    "PERINGATAN": "bg-orange-100 text-orange-700 border-orange-200",
    "TRAFFIC LIGHT": "bg-violet-100 text-violet-700 border-violet-200",
    "WARNING LIGHT": "bg-pink-100 text-pink-700 border-pink-200",
    "PELICAN CROSSING": "bg-slate-100 text-slate-700 border-slate-200"
  };

  const icon = iconConfig[t] || <HelpCircle className="w-3 h-3" />;
  const style = styleConfig[t] || "bg-gray-100 text-gray-700 border-gray-200";

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold border ${style} whitespace-nowrap uppercase tracking-wider`}>
      {icon}
      {type}
    </span>
  );
}

"use client";

import { useState, useRef } from "react";
import { parseExcelToJson, DataItem } from "../../utils/excelParser";
import { Upload, Download, FileJson, ArrowLeft, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function ConvertPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<DataItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      setError("File is too large. Maximum size is 10MB.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setFileName(file.name);
    setIsProcessing(true);
    setError(null);
    setResult(null);

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const buffer = event.target?.result as ArrayBuffer;
          const json = await parseExcelToJson(buffer);
          setResult(json);
          setIsProcessing(false);
        } catch {
          console.error("Parsing error");
          setError("Failed to parse Excel file. Ensure it follows the required format.");
          setIsProcessing(false);
        }
      };
      reader.onerror = () => {
        setError("Error reading file.");
        setIsProcessing(false);
      };
      reader.readAsArrayBuffer(file);
    } catch {
      setError("An unexpected error occurred.");
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName ? fileName.replace(/\.[^/.]+$/, "") + ".json" : "data.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setResult(null);
    setFileName(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-6 md:p-12 flex flex-col items-center">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link 
            href="/"
            className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Link>
          <div className="text-right">
            <h1 className="text-xl font-bold text-gray-900">
              Data Converter
            </h1>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
          {!result && !isProcessing ? (
            <div 
              className={`
                border-2 border-dashed border-gray-200 rounded-lg p-10 flex flex-col items-center justify-center
                hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer group
              `}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-12 h-12 text-gray-300 group-hover:text-blue-500 mb-4 transition-colors" />
              <h2 className="text-lg font-medium mb-1 text-gray-700">
                Upload Excel
              </h2>
              <p className="text-xs text-gray-400 text-center mb-4">
                Click or drag .xlsx files (Max 10MB)
              </p>
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".xlsx, .xls"
                className="hidden"
              />
              <div className="px-5 py-1.5 bg-gray-100 rounded-md text-xs text-gray-600 font-medium group-hover:bg-blue-500 group-hover:text-white transition-all">
                Select File
              </div>
            </div>
          ) : isProcessing ? (
            <div className="flex flex-col items-center justify-center py-10">
              <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
              <h2 className="text-lg font-medium text-gray-700">Processing...</h2>
            </div>
          ) : result ? (
            <div className="flex flex-col items-center py-4">
              <div className="bg-emerald-100 text-emerald-600 p-3 rounded-full mb-4">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-xl font-bold mb-1 text-gray-900">Finished</h2>
              <p className="text-sm text-gray-500 mb-6 text-center">
                Processed <span className="text-emerald-600 font-semibold">{result.length}</span> rows from <span className="text-gray-900 font-medium">{fileName}</span>
              </p>
              
              <div className="flex flex-row gap-3 w-full justify-center">
                <button 
                  onClick={handleDownload}
                  className="flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-sm shadow-sm transition-all"
                >
                  <Download className="w-4 h-4" />
                  Download JSON
                </button>
                <button 
                  onClick={reset}
                  className="flex items-center justify-center gap-2 px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold text-sm transition-all"
                >
                  Reset
                </button>
              </div>

              {/* Preview Box */}
              <div className="mt-8 w-full border-t pt-8">
                <div className="flex items-center gap-2 text-gray-400 mb-3 ml-1">
                  <FileJson className="w-3.5 h-3.5" />
                  <span className="text-[10px] uppercase tracking-wider font-bold">Preview</span>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 overflow-hidden">
                  <pre className="text-gray-700 font-mono text-[11px] overflow-auto max-h-[200px]">
                    {JSON.stringify(result.slice(0, 2), null, 2)}
                    {"\n  ..."}
                  </pre>
                </div>
              </div>
            </div>
          ) : null}

          {error && (
            <div className="mt-4 flex items-center gap-3 p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <p>{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

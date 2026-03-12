import ExcelJS from "exceljs";

export interface DataItem {
  id: number;
  latitude: number | null;
  longitude: number | null;
  city: string;
  road_section: string;
  total: number;
  unit: string;
  side: string | null;
  type: string;
  description: string;
  condition: string;
}

function parseCoordinates(coordText: string | number | null | undefined) {
  if (!coordText) return { lat: null, lon: null };

  const text = String(coordText).replace(/,/g, ".");

  const latMatch = text.match(/([0-9.]+)\s*([NS])/i);
  const lonMatch = text.match(/([0-9.]+)\s*([EW])/i);

  let lat = null;
  let lon = null;

  if (latMatch) {
    lat = parseFloat(latMatch[1]);
    if (latMatch[2].toUpperCase() === "S") lat = -lat;
  }

  if (lonMatch) {
    lon = parseFloat(lonMatch[1]);
    if (lonMatch[2].toUpperCase() === "W") lon = -lon;
  }

  return { lat, lon };
}

function parseSide(rowData: Record<string, unknown>) {
  if (rowData["KIRI"] != null && rowData["KIRI"] !== "") return "LEFT";
  if (rowData["KANAN"] != null && rowData["KANAN"] !== "") return "RIGHT";
  return null;
}

export async function parseExcelToJson(fileBuffer: ArrayBuffer): Promise<DataItem[]> {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(fileBuffer);

  const worksheet = workbook.worksheets[0];

  if (!worksheet) {
    return [];
  }

  const data: DataItem[] = [];

  // Get headers from first row
  const headers: string[] = [];
  worksheet.getRow(1).eachCell((cell, colNumber) => {
    headers[colNumber] = cell.text.trim();
  });

  // Process rows from 2nd row onwards
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return; // Skip headers

    const rowData: Record<string, unknown> = {};
    row.eachCell((cell, colNumber) => {
      const header = headers[colNumber];
      if (header) {
        // ExcelJS cells can have values or results of formulas
        const cellValue = cell.value;
        if (cellValue && typeof cellValue === 'object' && 'result' in cellValue) {
          rowData[header] = cellValue.result;
        } else {
          rowData[header] = cellValue;
        }
      }
    });

    const { lat, lon } = parseCoordinates(rowData["KOORDINAT"] as string | number | null | undefined);
    const side = parseSide(rowData);

    data.push({
      id: rowData["NO."] as number,
      latitude: lat,
      longitude: lon,
      city: String(rowData["KOTA"] || ""),
      road_section: String(rowData["RUAS JALAN"] || ""),
      total: rowData["JUMLAH"] as number,
      unit: String(rowData["SATUAN"] || ""),
      side: side,
      type: String(rowData["JENIS RAMBU"] || ""),
      description: String(rowData["KETERANGAN"] || ""),
      condition: String(rowData["KONDISI RAMBU"] || ""),
    });
  });

  return data;
}

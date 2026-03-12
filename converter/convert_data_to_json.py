import pandas as pd
import json
import re

file_path = "data.xlsx"
df = pd.read_excel(file_path)
df.columns = df.columns.str.strip()

print("Columns detected:")
for col in df.columns:
    print(f"'{col}'")

def parse_coordinates(coord_text):
    if pd.isna(coord_text):
        return None, None

    text = str(coord_text).replace(",", ".")

    lat_match = re.search(r'([0-9.]+)\s*([NS])', text)
    lon_match = re.search(r'([0-9.]+)\s*([EW])', text)

    lat, lon = None, None

    if lat_match:
        lat = float(lat_match.group(1))
        if lat_match.group(2) == "S":
            lat = -lat

    if lon_match:
        lon = float(lon_match.group(1))
        if lon_match.group(2) == "W":
            lon = -lon

    return lat, lon


def parse_side(row):
    if pd.notna(row.get("KIRI")):
        return "LEFT"
    if pd.notna(row.get("KANAN")):
        return "RIGHT"
    return None


data = []

for _, row in df.iterrows():
    lat, lon = parse_coordinates(row["KOORDINAT"])
    side = parse_side(row)

    item = {
        "id": row["NO."],
        "latitude": lat,
        "longitude": lon,
        "city": row['KOTA'],
        "road_section": row['RUAS JALAN'],
        "total": row["JUMLAH"],
        "unit": row["SATUAN"],
        "side": side,
        "type": row["JENIS RAMBU"],
        "description": row["KETERANGAN"],
        "condition": row["KONDISI RAMBU"]
    }

    data.append(item)

with open("output.json", "w", encoding="utf-8") as f:
    json.dump(data, f, indent=4, ensure_ascii=False)

print("JSON file created: output.json")
/**
 * Google Sheet Live Synchronizer
 * Sheet ID: 1If65m8-kv10fLlu9DSgvDJCJEpPBdGrieZ7tJ9aXgmo
 * Tab GID: 1607620651 (Quản lý camera)
 */

import { RawCheckRow, CameraStatus } from '../types/camera';

export const GOOGLE_SHEET_ID = '1If65m8-kv10fLlu9DSgvDJCJEpPBdGrieZ7tJ9aXgmo';
export const GOOGLE_SHEET_GID = '1607620651';
export const GOOGLE_SHEET_CSV_URL = `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/export?format=csv&gid=${GOOGLE_SHEET_GID}`;

// Local storage cache keys
const CACHE_KEY_DATA = 'cvsg_camera_sheet_cache_v1';
const CACHE_KEY_TIME = 'cvsg_camera_sheet_cache_time';
const CACHE_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes fresh cache

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  result.push(current);
  return result;
}

export function parseGoogleSheetCSV(csvText: string): RawCheckRow[] {
  const lines = csvText.split(/\r?\n/);
  const rows: RawCheckRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const parts = parseCSVLine(line);
    const dateRaw = parts[0] ? parts[0].trim() : '';

    // match dd/mm/yyyy
    const m = dateRaw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (!m) continue;

    const day = m[1].padStart(2, '0');
    const month = m[2].padStart(2, '0');
    const year = m[3];
    const dateIso = `${year}-${month}-${day}`;

    const site = parts[1] ? parts[1].trim() : '';
    const camera = parts[2] ? parts[2].trim() : '';
    const status = (parts[3] ? parts[3].trim() : 'Chưa xác định') as CameraStatus;
    let owner = parts[5] ? parts[5].trim() : '';
    if (owner === '#N/A' || !owner) owner = 'Chưa phân công';

    const fixed = parts[9] ? parts[9].trim().toUpperCase() === 'TRUE' : false;
    const linkViTri = parts[7] ? parts[7].trim() : '';
    const evidence = linkViTri.length > 0 && !linkViTri.includes('#N/A');

    if (camera && site) {
      rows.push({
        date: dateIso,
        site,
        camera,
        status,
        owner,
        fixed,
        evidence
      });
    }
  }

  return rows;
}

export interface SyncStatus {
  isLoading: boolean;
  isOnline: boolean;
  lastSyncTime: string | null;
  totalRecords: number;
  latestDate: string;
  error: string | null;
}

export async function fetchGoogleSheetData(forceRefresh = false): Promise<{
  records: RawCheckRow[];
  fromCache: boolean;
  lastSync: string;
}> {
  const now = Date.now();

  // Try cached data first if not forced
  if (!forceRefresh) {
    try {
      const cached = localStorage.getItem(CACHE_KEY_DATA);
      const timeStr = localStorage.getItem(CACHE_KEY_TIME);
      if (cached && timeStr) {
        const cachedTime = parseInt(timeStr, 10);
        if (now - cachedTime < CACHE_EXPIRY_MS) {
          const records: RawCheckRow[] = JSON.parse(cached);
          if (records && records.length > 0) {
            return {
              records,
              fromCache: true,
              lastSync: new Date(cachedTime).toLocaleTimeString('vi-VN')
            };
          }
        }
      }
    } catch {
      // fallback to network fetch
    }
  }

  // Fetch live from Google Sheets
  // Add timestamp query parameter to bypass browser caching
  const fetchUrl = `${GOOGLE_SHEET_CSV_URL}&_t=${now}`;
  const response = await fetch(fetchUrl);

  if (!response.ok) {
    throw new Error(`Không thể kết nối Google Sheets (HTTP ${response.status})`);
  }

  const csvText = await response.text();
  const records = parseGoogleSheetCSV(csvText);

  if (!records || records.length === 0) {
    throw new Error('Dữ liệu tải về từ Google Sheets trống hoặc định dạng không đúng');
  }

  // Save to localStorage for instant startup next time
  try {
    localStorage.setItem(CACHE_KEY_DATA, JSON.stringify(records));
    localStorage.setItem(CACHE_KEY_TIME, now.toString());
  } catch {
    // If local storage is full, just continue
  }

  return {
    records,
    fromCache: false,
    lastSync: new Date(now).toLocaleTimeString('vi-VN')
  };
}

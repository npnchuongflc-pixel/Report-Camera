export type CameraStatus = 'Hoạt động' | 'Chập chờn' | 'Mất kết nối' | 'Chậm lag' | string;

export interface RawCheckRow {
  date: string;       // YYYY-MM-DD
  site: string;       // Cơ sở
  camera: string;     // Mã camera
  status: CameraStatus; // Tình trạng
  owner: string;      // Người phụ trách
  fixed: boolean;     // Đã xác nhận khắc phục
  evidence: boolean;  // Có hình ảnh minh chứng
}

export type PriorityLevel = 'P1' | 'P2';

export interface CameraAggregate {
  camera: string;
  site: string;
  owner: string;
  count: number;       // Tổng số lần bất ổn
  lost: number;        // Số lần mất kết nối
  unstable: number;    // Số lần chập chờn
  other: number;       // Số lần bất ổn khác
  last: string;        // Ngày gần nhất ghi nhận
  status: CameraStatus;// Tình trạng gần nhất
  evidence: boolean;   // Có minh chứng
  priority: PriorityLevel;
  totalChecks: number; // Tổng số lượt kiểm tra của camera này
  records: RawCheckRow[]; // Toàn bộ lịch sử kiểm tra
}

export interface KPIData {
  totalChecks: number;
  recordedCameras: number;
  totalIssues: number;
  issueRate: number;
  affectedCameras: number;
  fixedCount: number;
  fixedRate: number;
  evidenceCount: number;
  evidenceRate: number;
  unstableTotal: number;
  lostTotal: number;
  otherTotal: number;
}

export interface SiteStats {
  site: string;
  count: number;
  percentage: number;
  color: string;
}

export interface DailyTrendPoint {
  date: string;
  dayLabel: string;
  totalIssues: number;
  unstable: number;
  lost: number;
  other: number;
}

export interface FilterOptions {
  periodMonth: string; // '09/2026' | 'all' | 'custom' | etc.
  dateFrom: string;    // 'YYYY-MM-DD'
  dateTo: string;      // 'YYYY-MM-DD'
  site: string;        // 'all' or site name
  owner: string;       // 'all' or owner name
  status: string;      // 'all' or status
  searchQuery: string;
  evidenceOnly: boolean;
}

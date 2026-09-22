import React from 'react';
import { Camera, RefreshCw, Download, CheckCircle2, ShieldCheck, Printer } from 'lucide-react';
import { formatDateVN } from '../data/cameraDataService';

interface HeaderProps {
  dateFrom: string;
  dateTo: string;
  onReset: () => void;
  onExportCSV: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  dateFrom,
  dateTo,
  onReset,
  onExportCSV
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <header className="bg-[#0b1838] text-white shadow-md sticky top-0 z-30 transition-all border-b border-[#1c2c54]">
      <div className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 h-[74px] flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3d7cff] to-[#22c3a6] flex items-center justify-center font-black text-white text-base shadow-sm ring-2 ring-white/10">
            CV
          </div>
          <div>
            <div className="flex items-center gap-2">
              <strong className="text-[15px] font-bold tracking-tight text-white">
                Trung tâm Cờ Vua Sài Gòn
              </strong>
              <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#2f6bff]/20 text-[#71a0ff] border border-[#2f6bff]/30">
                CVSG
              </span>
            </div>
            <span className="text-[#aebbd3] text-xs font-medium block mt-0.5">
              Hệ thống quản lý chất lượng camera cơ sở
            </span>
          </div>
        </div>

        {/* Top Meta & Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden md:flex items-center gap-1.5 text-xs text-[#cbd4e7] bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
            <span className="text-[#8e9ebc]">Thời gian:</span>
            <span className="font-semibold text-white">
              {formatDateVN(dateFrom)} – {formatDateVN(dateTo)}
            </span>
          </div>

          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs px-2.5 py-1.5 rounded-lg">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-medium hidden sm:inline">Dữ liệu đã đồng bộ</span>
          </div>

          <div className="flex items-center gap-1.5 border-l border-white/10 pl-3">
            <button
              onClick={onExportCSV}
              title="Xuất dữ liệu CSV"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Xuất CSV</span>
            </button>
            <button
              onClick={handlePrint}
              title="In báo cáo"
              className="p-1.5 text-[#cbd4e7] hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer hidden md:flex items-center justify-center"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onReset}
              title="Đặt lại chế độ xem"
              className="p-1.5 text-[#cbd4e7] hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer flex items-center justify-center"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

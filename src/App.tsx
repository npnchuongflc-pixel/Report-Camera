import React, { useState, useMemo } from 'react';
import { FilterOptions, CameraAggregate } from './types/camera';
import {
  computeDashboardData,
  exportCameraDataToCSV,
  formatDateVN,
  AVAILABLE_MONTHS
} from './data/cameraDataService';
import { Header } from './components/Header';
import { FiltersBar } from './components/FiltersBar';
import { KpiCards } from './components/KpiCards';
import { InsightBanner } from './components/InsightBanner';
import { ChartsSection } from './components/ChartsSection';
import { CameraTable } from './components/CameraTable';
import { CameraDetailModal } from './components/CameraDetailModal';
import { Footer } from './components/Footer';

const INITIAL_FILTERS: FilterOptions = {
  periodMonth: '09/2026',
  dateFrom: '2026-09-01',
  dateTo: '2026-09-21',
  site: 'all',
  owner: 'all',
  status: 'all',
  searchQuery: '',
  evidenceOnly: false
};

export default function App() {
  const [filters, setFilters] = useState<FilterOptions>(INITIAL_FILTERS);
  const [selectedCamera, setSelectedCamera] = useState<CameraAggregate | null>(null);

  // Computed dashboard data based on filters
  const dashboardData = useMemo(() => {
    return computeDashboardData(filters);
  }, [filters]);

  const { kpis, cameraList, siteStatsList, dailyTrends, insight, filterOptions } = dashboardData;

  const handleFilterChange = (updated: Partial<FilterOptions>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
  };

  const handleCurrentMonth = () => {
    const current = AVAILABLE_MONTHS[0]; // '09/2026'
    setFilters({
      periodMonth: current.value,
      dateFrom: current.from,
      dateTo: current.to,
      site: 'all',
      owner: 'all',
      status: 'all',
      searchQuery: '',
      evidenceOnly: false
    });
  };

  const handleReset = () => {
    setFilters(INITIAL_FILTERS);
  };

  const handleSelectSiteFromChart = (siteName: string) => {
    setFilters((prev) => ({
      ...prev,
      site: prev.site === siteName ? 'all' : siteName
    }));
  };

  const handleExportCSV = () => {
    const csvContent = exportCameraDataToCSV(cameraList);
    // Add UTF-8 BOM so Vietnamese characters display properly in Excel
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const periodSlug = filters.periodMonth !== 'custom'
      ? filters.periodMonth.replace('/', '-')
      : `${filters.dateFrom}_den_${filters.dateTo}`;
    link.setAttribute('href', url);
    link.setAttribute('download', `CVSG_Camera_BaoCao_${periodSlug}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const periodLabel = filters.periodMonth !== 'custom'
    ? `Tháng ${filters.periodMonth} (${formatDateVN(filters.dateFrom)} – ${formatDateVN(filters.dateTo)})`
    : `Khoảng ngày tùy chọn (${formatDateVN(filters.dateFrom)} – ${formatDateVN(filters.dateTo)})`;

  return (
    <div className="min-h-screen bg-[#f4f7fc] text-[#14213d] flex flex-col font-sans antialiased selection:bg-[#2f6bff] selection:text-white">
      {/* Top Header */}
      <Header
        dateFrom={filters.dateFrom}
        dateTo={filters.dateTo}
        onReset={handleReset}
        onExportCSV={handleExportCSV}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-[1480px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Filter Controls Bar */}
        <FiltersBar
          filters={filters}
          availableSites={filterOptions.availableSites}
          availableOwners={filterOptions.availableOwners}
          availableStatuses={filterOptions.availableStatuses}
          onChange={handleFilterChange}
          onCurrentMonth={handleCurrentMonth}
          onReset={handleReset}
        />

        {/* 5 KPI Metric Cards */}
        <KpiCards kpis={kpis} />

        {/* Bottleneck Recommendation Banner */}
        <InsightBanner
          title={insight.title}
          text={insight.text}
          tag={insight.tag}
        />

        {/* Charts Section: Donut breakdown, Bar breakdown, Line Trend & Stacked Bars */}
        <ChartsSection
          siteStatsList={siteStatsList}
          dailyTrends={dailyTrends}
          kpis={kpis}
          periodLabel={periodLabel}
          onSelectSite={handleSelectSiteFromChart}
        />

        {/* Action Priority Cameras Table */}
        <CameraTable
          cameras={cameraList}
          onSelectCamera={setSelectedCamera}
        />
      </main>

      {/* Camera Inspection Log & Action Modal */}
      <CameraDetailModal
        camera={selectedCamera}
        onClose={() => setSelectedCamera(null)}
      />

      {/* Application Footer */}
      <Footer />
    </div>
  );
}

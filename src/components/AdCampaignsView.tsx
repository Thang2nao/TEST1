import React from 'react';
import { AdCampaign, FacebookPage } from '../types';
import {
  Megaphone,
  TrendingUp,
  DollarSign,
  MousePointerClick,
  Eye,
  ToggleLeft,
  ToggleRight,
  PlusCircle,
  HelpCircle,
} from 'lucide-react';

interface AdCampaignsViewProps {
  activePage: FacebookPage;
  campaigns: AdCampaign[];
  onToggleCampaign: (id: string) => void;
}

export const AdCampaignsView: React.FC<AdCampaignsViewProps> = ({
  activePage,
  campaigns,
  onToggleCampaign,
}) => {
  const pageCampaigns = campaigns.filter((c) => c.pageId === activePage.id);

  const totalSpent = pageCampaigns.reduce((acc, c) => acc + c.spent, 0);
  const totalLeads = pageCampaigns.reduce((acc, c) => acc + c.leadsCount, 0);
  const activeCount = pageCampaigns.filter((c) => c.status === 'active').length;

  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300">
              <Megaphone className="h-4 w-4" />
            </span>
            <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
              Quản Lý Chiến Dịch Quảng Cáo Facebook Ads
            </h1>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Theo dõi chi phí theo thời gian thực, số lượng Lead và hiệu suất hoàn vốn (ROAS)
          </p>
        </div>

        <button
          type="button"
          onClick={() => alert('Chiến dịch mới sẽ được đồng bộ trực tiếp từ Trình quản lý quảng cáo Meta Ads Manager')}
          className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-blue-700 active:scale-95"
        >
          <PlusCircle className="h-4 w-4" />
          Tạo Chiến Dịch Mới
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-850">
          <span className="text-xs font-medium text-slate-500">Chi phí Ads đã chi</span>
          <div className="mt-1.5 text-2xl font-black text-slate-900 dark:text-white">
            {totalSpent.toLocaleString('vi-VN')} đ
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Đồng bộ từ tài khoản BM</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-850">
          <span className="text-xs font-medium text-slate-500">Số lượng tin nhắn & Lead</span>
          <div className="mt-1.5 text-2xl font-black text-emerald-600">
            {totalLeads} khách hàng
          </div>
          <p className="mt-1 text-[11px] text-emerald-600 font-semibold">Tỷ lệ chuyển đổi tốt</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-850">
          <span className="text-xs font-medium text-slate-500">Chiến dịch đang phân phối</span>
          <div className="mt-1.5 text-2xl font-black text-blue-600">
            {activeCount} / {pageCampaigns.length}
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Tối ưu chi phí mỗi click CPC</p>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden dark:border-slate-800 dark:bg-slate-850">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
            <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-800">
              <tr>
                <th className="py-3 px-4">Tên Chiến Dịch</th>
                <th className="py-3 px-4">Trạng Thái</th>
                <th className="py-3 px-4">Ngân Sách Ngày</th>
                <th className="py-3 px-4">Lượt Tiếp Cận</th>
                <th className="py-3 px-4">Clicks (CPC)</th>
                <th className="py-3 px-4">ROAS</th>
                <th className="py-3 px-4">Số Lead</th>
                <th className="py-3 px-4">Bật/Tắt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {pageCampaigns.map((camp) => (
                <tr key={camp.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white max-w-xs">
                    {camp.name}
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        camp.status === 'active'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}
                    >
                      {camp.status === 'active' ? 'Đang chạy' : 'Đã tạm dừng'}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200">
                    {camp.budgetDaily.toLocaleString('vi-VN')} đ/ngày
                  </td>

                  <td className="py-3.5 px-4">
                    {camp.impressions.toLocaleString('vi-VN')}
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-semibold">{camp.clicks.toLocaleString('vi-VN')} clicks</span>
                    <div className="text-[10px] text-slate-400">
                      CPC: {camp.cpc.toLocaleString('vi-VN')} đ
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-bold text-emerald-600 dark:text-emerald-400">
                    {camp.roas}x
                  </td>

                  <td className="py-3.5 px-4 font-bold text-blue-600 dark:text-blue-400">
                    {camp.leadsCount} lead
                  </td>

                  <td className="py-3.5 px-4">
                    <button
                      type="button"
                      onClick={() => onToggleCampaign(camp.id)}
                      className="text-slate-400 hover:text-blue-600 transition"
                      aria-label="Chuyển trạng thái chiến dịch"
                    >
                      {camp.status === 'active' ? (
                        <ToggleRight className="h-7 w-7 text-emerald-600" />
                      ) : (
                        <ToggleLeft className="h-7 w-7 text-slate-400" />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

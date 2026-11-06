import React, { useState } from 'react';
import { formatFacebookFont, checkFacebookAdsPolicy } from '../utils/fbLogic';
import {
  Wrench,
  Type,
  AlertTriangle,
  CheckCircle2,
  Copy,
  Check,
  Calculator,
  Hash,
  Sparkles,
  TrendingUp,
} from 'lucide-react';

export const FacebookToolsView: React.FC = () => {
  // Font styler state
  const [inputText, setInputText] = useState('SIEU SALE HOM NAY GIAM 50% CHO 100 KHACH HANG');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Policy checker state
  const [adContent, setAdContent] = useState(
    'Sản phẩm kem trị nám đặc trị dứt điểm sau 7 ngày, cam kết 100% hiệu quả không tái phát!'
  );
  const policyResult = checkFacebookAdsPolicy(adContent);

  // ROAS Calculator state
  const [adSpend, setAdSpend] = useState(2000000);
  const [revenue, setRevenue] = useState(9000000);
  const [ordersCount, setOrdersCount] = useState(15);

  const roas = adSpend > 0 ? Number((revenue / adSpend).toFixed(2)) : 0;
  const cpa = ordersCount > 0 ? Math.round(adSpend / ordersCount) : 0;
  const aov = ordersCount > 0 ? Math.round(revenue / ordersCount) : 0;

  const fontOptions = [
    { label: 'In đậm không chân (Bold)', style: 'bold' as const },
    { label: 'In nghiêng thanh lịch (Italic)', style: 'italic' as const },
    { label: 'Máy đánh chữ (Monospace)', style: 'monospace' as const },
    { label: 'Khung viền giật tít', style: 'bracket' as const },
  ];

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const hashtagCategories = [
    {
      category: 'Gia Dụng & Đời Sống',
      tags: ['#GiaDungThongMinh', '#NhaDep', '#TienIchGiaDinh', '#NoiChienKhongDau', '#BepXinh'],
    },
    {
      category: 'Thời Trang & Phụ Kiện',
      tags: ['#ThoiTrangNu', '#SneakerVN', '#StreetwearStyle', '#OOTD', '#SaleKhung'],
    },
    {
      category: 'Mỹ Phẩm & Chăm Sóc Sắc Đẹp',
      tags: ['#SkincareVN', '#DuongDaMoTham', '#MyPhamChinhHang', '#ReviewMyPham', '#BeautyTips'],
    },
    {
      category: 'Ẩm Thực & Ăn Uống (F&B)',
      tags: ['#MonNgonMoiNgay', '#AmThucHaNoi', '#FoodReview', '#AnVatSaiGon', '#GiaoHangTanNoi'],
    },
  ];

  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300">
            <Wrench className="h-4 w-4" />
          </span>
          <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
            Bộ Tiện Ích Facebook Bán Hàng & Marketing
          </h1>
        </div>
        <p className="mt-1 text-xs text-slate-500">
          Công cụ tạo font chữ độc lạ, quét từ khóa vi phạm chính sách Ads và tính toán ROAS quảng cáo
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Tool 1: Font Chữ Facebook Độc Lạ */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-850 space-y-4">
          <div className="flex items-center gap-2">
            <Type className="h-4 w-4 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Đổi Font Chữ Facebook Độc Lạ (Tạo Điểm Nhấn)
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            Giúp tiêu đề bài viết và dòng khuyến mãi nổi bật gấp 3 lần trên bảng tin
          </p>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Nhập chữ cần đổi font..."
            className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />

          <div className="space-y-2.5">
            {fontOptions.map((opt, i) => {
              const formatted = formatFacebookFont(inputText, opt.style);
              const isCopied = copiedIndex === i;
              return (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-800/60"
                >
                  <div className="space-y-0.5 flex-1 pr-3">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase">
                      {opt.label}
                    </span>
                    <div className="text-xs font-medium text-slate-900 dark:text-white break-all">
                      {formatted}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(formatted, i)}
                    className="flex items-center gap-1 shrink-0 rounded-lg bg-white border border-slate-200 px-3 py-1.5 text-xs font-semibold text-blue-600 shadow-2xs hover:bg-blue-50 dark:border-slate-700 dark:bg-slate-700 dark:text-blue-300"
                  >
                    {isCopied ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-600" /> Đã sao chép!
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" /> Sao chép
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tool 2: Facebook Ads Policy Checker */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-850 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Kiểm Tra Từ Khóa Vi Phạm Facebook Ads
              </h2>
            </div>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-extrabold ${
                policyResult.score >= 80
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                  : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
              }`}
            >
              Điểm an toàn: {policyResult.score}/100
            </span>
          </div>

          <p className="text-xs text-slate-500">
            Dán nội dung quảng cáo để quét từ khóa bị cấm (tránh khóa page và tài khoản BM):
          </p>

          <textarea
            rows={4}
            value={adContent}
            onChange={(e) => setAdContent(e.target.value)}
            className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />

          <div className="space-y-2">
            {policyResult.isClean ? (
              <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-xs text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/40">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Nội dung an toàn! Không phát hiện từ khóa cấm nào.</span>
              </div>
            ) : (
              <div className="space-y-2">
                {policyResult.violations.map((v, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-rose-100 bg-rose-50/80 p-3 text-xs text-rose-900 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-200"
                  >
                    <div className="font-bold flex items-center gap-1.5">
                      <span>⚠️ Từ khóa nguy hiểm:</span>
                      <span className="rounded bg-rose-200 px-1.5 py-0.5 text-rose-900 dark:bg-rose-900 dark:text-rose-100">
                        "{v.keyword}"
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-300">
                      {v.reason}
                    </p>
                    <div className="mt-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
                      💡 Gợi ý sửa: {v.tip}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Tool 3: ROAS & Ad Budget Calculator */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-850 space-y-4">
          <div className="flex items-center gap-2">
            <Calculator className="h-4 w-4 text-emerald-600" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Bảng Tính ROAS & Hiệu Suất Chiến Dịch
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            Đo lường độ hiệu quả ngân sách quảng cáo và chi phí cho mỗi đơn hàng (CPA)
          </p>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                Ngân sách chạy (VNĐ)
              </label>
              <input
                type="number"
                step={100000}
                value={adSpend}
                onChange={(e) => setAdSpend(Number(e.target.value) || 0)}
                className="w-full rounded-lg border border-slate-200 p-2 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                Doanh thu mang lại (VNĐ)
              </label>
              <input
                type="number"
                step={100000}
                value={revenue}
                onChange={(e) => setRevenue(Number(e.target.value) || 0)}
                className="w-full rounded-lg border border-slate-200 p-2 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                Số đơn chốt được
              </label>
              <input
                type="number"
                min={1}
                value={ordersCount}
                onChange={(e) => setOrdersCount(Number(e.target.value) || 1)}
                className="w-full rounded-lg border border-slate-200 p-2 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          {/* Results grid */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="rounded-xl bg-blue-50 p-3 text-center dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Chỉ số ROAS</span>
              <div className="mt-1 text-xl font-black text-blue-700 dark:text-blue-300">
                {roas}x
              </div>
              <span className="text-[10px] text-emerald-600 font-semibold">
                {roas >= 3 ? '✅ Rất có lãi' : '⚠️ Cần tối ưu'}
              </span>
            </div>

            <div className="rounded-xl bg-emerald-50 p-3 text-center dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/40">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Chi phí / Đơn (CPA)</span>
              <div className="mt-1 text-base font-black text-emerald-700 dark:text-emerald-300">
                {cpa.toLocaleString('vi-VN')} đ
              </div>
            </div>

            <div className="rounded-xl bg-purple-50 p-3 text-center dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/40">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Giá trị đơn TB (AOV)</span>
              <div className="mt-1 text-base font-black text-purple-700 dark:text-purple-300">
                {aov.toLocaleString('vi-VN')} đ
              </div>
            </div>
          </div>
        </div>

        {/* Tool 4: Trending Hashtags */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-850 space-y-4">
          <div className="flex items-center gap-2">
            <Hash className="h-4 w-4 text-purple-600" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Kho Hashtag Thịnh Hành Theo Ngành Hàng
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            Nhấp vào để sao chép nhanh các thẻ hashtag giúp bài viết lên xu hướng
          </p>

          <div className="space-y-3">
            {hashtagCategories.map((cat, i) => (
              <div key={i} className="space-y-1.5">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {cat.category}:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {cat.tags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleCopy(tag, 100 + i)}
                      className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 transition dark:bg-slate-800 dark:text-blue-400"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { FacebookPage } from '../types';
import {
  Bell,
  CheckCircle2,
  ChevronDown,
  PlusCircle,
  Search,
  SlidersHorizontal,
  Sparkles,
  Users,
} from 'lucide-react';

interface NavbarProps {
  pages: FacebookPage[];
  activePage: FacebookPage;
  onSelectPage: (page: FacebookPage) => void;
  onOpenCreatePost: () => void;
  unreadCountTotal: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  pages,
  activePage,
  onSelectPage,
  onOpenCreatePost,
  unreadCountTotal,
}) => {
  const [showPageDropdown, setShowPageDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95 sm:px-6">
      {/* Left: Brand & Page Switcher */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/25">
            <span className="text-xl font-black tracking-tight">fb</span>
          </div>
          <div className="hidden sm:block">
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                FBMaster
              </span>
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-semibold text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                PRO 2026
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Quản lý Fanpage & Bán Hàng Đa Kênh
            </p>
          </div>
        </div>

        {/* Page Selector Dropdown */}
        <div className="relative ml-2 sm:ml-4">
          <button
            type="button"
            onClick={() => setShowPageDropdown(!showPageDropdown)}
            className="flex items-center gap-2.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-left text-sm font-medium transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-750"
            aria-label="Chọn Fanpage đang quản lý"
            aria-expanded={showPageDropdown}
          >
            <img
              src={activePage.avatar}
              alt={activePage.name}
              className="h-6 w-6 rounded-full object-cover ring-1 ring-blue-500"
            />
            <div className="hidden max-w-[150px] truncate sm:block md:max-w-[190px]">
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                {activePage.name}
              </span>
            </div>
            {activePage.verified && (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-blue-500 fill-blue-500/20" />
            )}
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </button>

          {showPageDropdown && (
            <div className="absolute left-0 mt-2 w-72 rounded-xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-700 dark:bg-slate-800 z-50">
              <div className="px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Chuyển đổi Fanpage
              </div>
              <div className="space-y-1">
                {pages.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      onSelectPage(p);
                      setShowPageDropdown(false);
                    }}
                    className={`flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left text-sm transition ${
                      p.id === activePage.id
                        ? 'bg-blue-50 text-blue-900 font-medium dark:bg-blue-950/60 dark:text-blue-200'
                        : 'text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-700/50'
                    }`}
                  >
                    <img
                      src={p.avatar}
                      alt={p.name}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                    <div className="flex-1 truncate">
                      <div className="flex items-center gap-1">
                        <span className="truncate text-xs font-semibold">{p.name}</span>
                        {p.verified && (
                          <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-blue-500" />
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        {p.followers.toLocaleString('vi-VN')} người theo dõi
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Middle: Search Box */}
      <div className="hidden md:flex flex-1 max-w-md mx-6">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm tin nhắn, bài viết, số điện thoại khách hàng..."
            className="w-full rounded-full border border-slate-200 bg-slate-50/80 py-1.5 pl-9 pr-4 text-xs text-slate-900 transition focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-100"
          />
        </div>
      </div>

      {/* Right: Actions & Notifications */}
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={onOpenCreatePost}
          className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-95"
          aria-label="Tạo bài viết mới"
        >
          <PlusCircle className="h-4 w-4" />
          <span className="hidden sm:inline">Lên bài mới</span>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            aria-label="Thông báo hệ thống"
          >
            <Bell className="h-4 w-4" />
            {unreadCountTotal > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-900">
                {unreadCountTotal}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-200 bg-white p-3 shadow-xl dark:border-slate-700 dark:bg-slate-800 z-50">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2 dark:border-slate-700">
                <span className="text-xs font-bold text-slate-800 dark:text-white">
                  Thông báo mới ({unreadCountTotal})
                </span>
                <span className="text-[11px] text-blue-600 cursor-pointer hover:underline">
                  Đánh dấu đã đọc
                </span>
              </div>
              <div className="mt-2 space-y-2 text-xs">
                <div className="rounded-lg bg-blue-50/60 p-2 text-slate-700 dark:bg-slate-700/50 dark:text-slate-200">
                  <div className="font-semibold text-blue-900 dark:text-blue-300">
                    🛡️ Tự động ẩn SĐT khách hàng
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Bình luận của Nguyễn Thu Trang chứa SĐT đã được ẩn tự động để chống cướp đơn.
                  </div>
                </div>
                <div className="rounded-lg bg-slate-50 p-2 text-slate-700 dark:bg-slate-750 dark:text-slate-300">
                  <div className="font-semibold text-slate-800 dark:text-slate-100">
                    🛒 Đơn hàng mới #FB-9842
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Đơn hàng trị giá 1.250.000đ vừa được tạo từ cuộc trò chuyện.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

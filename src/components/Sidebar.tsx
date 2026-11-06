import React from 'react';
import {
  BarChart3,
  CalendarCheck2,
  MessageSquareText,
  Bot,
  ShoppingBag,
  Wrench,
  Megaphone,
  Settings,
  HelpCircle,
  ShieldCheck,
} from 'lucide-react';

export type ActiveTab = 'dashboard' | 'posts' | 'inbox' | 'automation' | 'orders' | 'ads' | 'tools';

interface SidebarProps {
  activeTab: ActiveTab;
  onChangeTab: (tab: ActiveTab) => void;
  unreadInboxCount: number;
  pendingOrdersCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onChangeTab,
  unreadInboxCount,
  pendingOrdersCount,
}) => {
  const menuItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: number; badgeColor?: string }[] = [
    {
      id: 'dashboard',
      label: 'Tổng Quan & Báo Cáo',
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      id: 'posts',
      label: 'Lên Lịch & Soạn Bài',
      icon: <CalendarCheck2 className="h-5 w-5" />,
    },
    {
      id: 'inbox',
      label: 'Hộp Thư & Bình Luận',
      icon: <MessageSquareText className="h-5 w-5" />,
      badge: unreadInboxCount,
      badgeColor: 'bg-red-500 text-white',
    },
    {
      id: 'automation',
      label: 'Tự Động Hóa & Chống Cướp',
      icon: <Bot className="h-5 w-5" />,
    },
    {
      id: 'orders',
      label: 'Đơn Hàng & Khách Hàng',
      icon: <ShoppingBag className="h-5 w-5" />,
      badge: pendingOrdersCount,
      badgeColor: 'bg-amber-500 text-white',
    },
    {
      id: 'ads',
      label: 'Chiến Dịch Quảng Cáo',
      icon: <Megaphone className="h-5 w-5" />,
    },
    {
      id: 'tools',
      label: 'Tiện Ích & Tool Facebook',
      icon: <Wrench className="h-5 w-5" />,
    },
  ];

  return (
    <aside className="w-64 shrink-0 border-r border-slate-200 bg-slate-50/70 p-3 flex flex-col justify-between dark:border-slate-800 dark:bg-slate-900/50">
      <div className="space-y-1">
        <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Chức năng chính
        </div>
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChangeTab(item.id)}
              className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold transition ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                  : 'text-slate-600 hover:bg-slate-200/60 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span
                  className={`flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-bold ${
                    isActive ? 'bg-white text-blue-600' : item.badgeColor
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom info card */}
      <div className="rounded-xl border border-blue-100 bg-blue-50/70 p-3 dark:border-blue-900/40 dark:bg-blue-950/30">
        <div className="flex items-center gap-2 text-xs font-bold text-blue-900 dark:text-blue-300">
          <ShieldCheck className="h-4 w-4 text-blue-600" />
          <span>Bảo Vệ Đơn Hàng</span>
        </div>
        <p className="mt-1 text-[11px] text-blue-700/80 dark:text-blue-300/80">
          Chế độ tự động ẩn bình luận chứa SĐT đang được kích hoạt an toàn.
        </p>
      </div>
    </aside>
  );
};

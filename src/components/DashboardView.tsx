import React, { useState } from 'react';
import { FacebookPage, FacebookPost, Conversation, FacebookOrder, AdCampaign } from '../types';
import {
  TrendingUp,
  Users,
  MessageCircle,
  ShoppingBag,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Sparkles,
  ShieldCheck,
  Calendar,
  ThumbsUp,
  Share2,
  PhoneCall,
  Flame,
} from 'lucide-react';

interface DashboardViewProps {
  activePage: FacebookPage;
  posts: FacebookPost[];
  conversations: Conversation[];
  orders: FacebookOrder[];
  campaigns: AdCampaign[];
  onNavigateTab: (tab: any) => void;
  onOpenCreatePost: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  activePage,
  posts,
  conversations,
  orders,
  campaigns,
  onNavigateTab,
  onOpenCreatePost,
}) => {
  const [timeRange, setTimeRange] = useState<'7d' | '14d' | '30d'>('7d');

  // Filter for active page
  const pagePosts = posts.filter((p) => p.pageId === activePage.id);
  const pageOrders = orders.filter((o) => o.pageId === activePage.id);
  const pageConversations = conversations.filter((c) => c.pageId === activePage.id);

  const totalReach = pagePosts.reduce((acc, p) => acc + p.reach, 0);
  const totalComments = pagePosts.reduce((acc, p) => acc + p.commentsCount, 0);
  const totalReactions = pagePosts.reduce(
    (acc, p) => acc + p.reactions.like + p.reactions.love + p.reactions.haha + p.reactions.wow,
    0
  );
  const totalRevenue = pageOrders.reduce((acc, o) => acc + o.totalAmount, 0);
  const hotLeads = pageConversations.filter((c) => c.tags.includes('Có SĐT') || c.customerPhone);

  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 p-6 text-white shadow-lg shadow-blue-500/15">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-white/20 px-2 py-0.5 text-xs font-semibold backdrop-blur-sm">
              Trang đang quản lý
            </span>
            <span className="text-xs text-blue-100 flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-300" /> Hệ thống bảo vệ hoạt động
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-black tracking-tight">{activePage.name}</h1>
          <p className="mt-1 text-xs text-blue-100 max-w-xl">
            {activePage.category} • {activePage.followers.toLocaleString('vi-VN')} người theo dõi • Đánh giá {activePage.rating} ⭐
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={onOpenCreatePost}
            className="flex items-center gap-1.5 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-blue-700 shadow-md transition hover:bg-blue-50 active:scale-95"
          >
            <Sparkles className="h-4 w-4 text-blue-600" />
            Lên Bài Viết AI
          </button>
          <button
            type="button"
            onClick={() => onNavigateTab('inbox')}
            className="flex items-center gap-1.5 rounded-xl bg-blue-500/40 border border-white/20 px-4 py-2.5 text-xs font-semibold text-white backdrop-blur-sm transition hover:bg-blue-500/60 active:scale-95"
          >
            <MessageCircle className="h-4 w-4" />
            Trực Chat ({pageConversations.filter((c) => c.unread).length} Chưa đọc)
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Reach */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-850">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-medium">Lượt tiếp cận (Reach)</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {totalReach.toLocaleString('vi-VN')}
            </span>
            <span className="flex items-center text-xs font-semibold text-emerald-600">
              <ArrowUpRight className="h-3.5 w-3.5" /> +18.4%
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">So với chu kỳ 7 ngày trước</p>
        </div>

        {/* Card 2: Engagement */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-850">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-medium">Tương tác bài viết</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <ThumbsUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {(totalReactions + totalComments).toLocaleString('vi-VN')}
            </span>
            <span className="flex items-center text-xs font-semibold text-emerald-600">
              <ArrowUpRight className="h-3.5 w-3.5" /> +24.1%
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Bình luận & cảm xúc tích cực</p>
        </div>

        {/* Card 3: Hot Leads & Inbox */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-850">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-medium">Lead nóng (Có SĐT)</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
              <PhoneCall className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {hotLeads.length} Lead
            </span>
            <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-800 dark:bg-amber-900/50 dark:text-amber-300">
              Ưu tiên gọi ngay
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Khách để lại số điện thoại mua hàng</p>
        </div>

        {/* Card 4: Revenue */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-850">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-medium">Doanh thu chốt Fanpage</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {totalRevenue.toLocaleString('vi-VN')} đ
            </span>
            <span className="flex items-center text-xs font-semibold text-emerald-600">
              <ArrowUpRight className="h-3.5 w-3.5" /> +32%
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">{pageOrders.length} đơn hàng thành công</p>
        </div>
      </div>

      {/* Main Grid: Chart & Hot Leads */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left 2 Cols: Trend Analytics */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-850">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Biểu Đồ Tăng Trưởng Lượt Tiếp Cận & Tương Tác
              </h2>
              <p className="text-xs text-slate-500">Hiệu quả tự nhiên và chiến dịch quảng cáo</p>
            </div>
            <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
              {(['7d', '14d', '30d'] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setTimeRange(r)}
                  className={`rounded-md px-2.5 py-1 text-[11px] font-semibold transition ${
                    timeRange === r
                      ? 'bg-white text-blue-600 shadow-xs dark:bg-slate-700 dark:text-white'
                      : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                  }`}
                >
                  {r === '7d' ? '7 Ngày' : r === '14d' ? '14 Ngày' : '30 Ngày'}
                </button>
              ))}
            </div>
          </div>

          {/* Bar Chart Mockup with high aesthetics */}
          <div className="h-56 w-full flex items-end gap-3 pt-6 pb-2 px-2 border-b border-slate-100 dark:border-slate-800">
            {[
              { day: 'T2', reach: 60, eng: 35 },
              { day: 'T3', reach: 80, eng: 50 },
              { day: 'T4', reach: 45, eng: 30 },
              { day: 'T5', reach: 90, eng: 65 },
              { day: 'T6', reach: 75, eng: 55 },
              { day: 'T7', reach: 100, eng: 85 },
              { day: 'CN', reach: 95, eng: 80 },
            ].map((bar, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                <div className="w-full flex items-end justify-center gap-1 h-full">
                  <div
                    style={{ height: `${bar.reach}%` }}
                    className="w-full max-w-[20px] rounded-t-md bg-blue-500/80 group-hover:bg-blue-600 transition-all relative"
                  >
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 hidden group-hover:block rounded bg-slate-800 text-[10px] text-white px-1.5 py-0.5 whitespace-nowrap z-20">
                      Reach: {bar.reach * 250}
                    </div>
                  </div>
                  <div
                    style={{ height: `${bar.eng}%` }}
                    className="w-full max-w-[20px] rounded-t-md bg-emerald-500/80 group-hover:bg-emerald-600 transition-all relative"
                  >
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 hidden group-hover:block rounded bg-slate-800 text-[10px] text-white px-1.5 py-0.5 whitespace-nowrap z-20">
                      Tương tác: {bar.eng * 80}
                    </div>
                  </div>
                </div>
                <span className="text-[11px] font-medium text-slate-400">{bar.day}</span>
              </div>
            ))}
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm bg-blue-500" /> Lượt tiếp cận (Reach)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm bg-emerald-500" /> Tương tác (Likes & Comments)
              </span>
            </div>
            <span className="text-[11px] font-medium text-blue-600 cursor-pointer hover:underline">
              Xuất báo cáo PDF
            </span>
          </div>
        </div>

        {/* Right 1 Col: Urgent Hot Leads (Chống cướp đơn) */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-850 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Flame className="h-4 w-4 text-amber-500 fill-amber-500" />
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  Lead Khách Hàng Nóng
                </h2>
              </div>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300">
                Đã bảo vệ SĐT
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              Khách hàng để lại số điện thoại trên bình luận hoặc tin nhắn cần gọi chốt đơn ngay:
            </p>

            <div className="space-y-3">
              {hotLeads.slice(0, 3).map((lead) => (
                <div
                  key={lead.id}
                  onClick={() => onNavigateTab('inbox')}
                  className="rounded-xl border border-slate-100 bg-slate-50/80 p-3 transition hover:border-blue-300 hover:bg-blue-50/50 dark:border-slate-800 dark:bg-slate-800/60 cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={lead.customerAvatar}
                        alt={lead.customerName}
                        className="h-7 w-7 rounded-full object-cover"
                      />
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                        {lead.customerName}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400">{lead.lastMessageTime}</span>
                  </div>
                  <div className="mt-2 text-xs font-semibold text-blue-600 dark:text-blue-400">
                    📞 {lead.customerPhone ? lead.customerPhone.slice(0, 3) + '****' + lead.customerPhone.slice(-3) : 'Có SĐT'}
                  </div>
                  <p className="mt-1 text-[11px] text-slate-600 line-clamp-1 dark:text-slate-300">
                    "{lead.lastMessage}"
                  </p>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigateTab('inbox')}
            className="mt-4 w-full rounded-xl bg-blue-50 py-2.5 text-xs font-bold text-blue-600 transition hover:bg-blue-100 dark:bg-blue-950/60 dark:text-blue-300"
          >
            Mở Hộp Thư Xử Lý Lead &rarr;
          </button>
        </div>
      </div>

      {/* Recent Posts Section */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-850">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Bài Viết Hoạt Động Gần Đây
            </h2>
            <p className="text-xs text-slate-500">Hiệu suất và lượt tương tác từng bài đăng</p>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab('posts')}
            className="text-xs font-semibold text-blue-600 hover:underline"
          >
            Xem tất cả bài viết &rarr;
          </button>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {pagePosts.slice(0, 3).map((post) => (
            <div key={post.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                {post.images[0] && (
                  <img
                    src={post.images[0]}
                    alt="Post media"
                    className="h-14 w-14 shrink-0 rounded-lg object-cover ring-1 ring-slate-200"
                  />
                )}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        post.status === 'published'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300'
                      }`}
                    >
                      {post.status === 'published' ? 'Đã xuất bản' : 'Đã lên lịch'}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {post.status === 'published' ? 'Đăng lúc 07:30' : 'Dự kiến 20:00 mai'}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-slate-800 line-clamp-1 dark:text-slate-200 max-w-xl">
                    {post.content}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6 text-xs text-slate-600 dark:text-slate-300 shrink-0">
                <div className="text-center">
                  <div className="font-bold text-slate-900 dark:text-white">
                    {post.reach.toLocaleString('vi-VN')}
                  </div>
                  <div className="text-[10px] text-slate-400">Reach</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-slate-900 dark:text-white">
                    {(post.reactions.like + post.reactions.love).toLocaleString('vi-VN')}
                  </div>
                  <div className="text-[10px] text-slate-400">Thích/Tim</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-slate-900 dark:text-white">
                    {post.commentsCount}
                  </div>
                  <div className="text-[10px] text-slate-400">Bình luận</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

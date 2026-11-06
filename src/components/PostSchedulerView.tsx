import React, { useState } from 'react';
import { FacebookPage, FacebookPost, PostStatus } from '../types';
import {
  Calendar,
  Clock,
  PlusCircle,
  Sparkles,
  ThumbsUp,
  MessageCircle,
  Share2,
  Trash2,
  CheckCircle2,
  Send,
  Eye,
  Filter,
} from 'lucide-react';

interface PostSchedulerViewProps {
  activePage: FacebookPage;
  posts: FacebookPost[];
  onOpenCreatePost: () => void;
  onPublishNow: (postId: string) => void;
  onDeletePost: (postId: string) => void;
}

export const PostSchedulerView: React.FC<PostSchedulerViewProps> = ({
  activePage,
  posts,
  onOpenCreatePost,
  onPublishNow,
  onDeletePost,
}) => {
  const [filterStatus, setFilterStatus] = useState<PostStatus | 'all'>('all');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  const pagePosts = posts.filter((p) => p.pageId === activePage.id);
  const filteredPosts = filterStatus === 'all' ? pagePosts : pagePosts.filter((p) => p.status === filterStatus);

  const scheduledCount = pagePosts.filter((p) => p.status === 'scheduled').length;
  const publishedCount = pagePosts.filter((p) => p.status === 'published').length;

  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Top Header & Quick Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
            Lên Lịch & Quản Lý Bài Đăng Fanpage
          </h1>
          <p className="text-xs text-slate-500">
            Kế hoạch phát sóng đa kênh, xem trước News Feed và tối ưu giờ vàng tiếp cận
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onOpenCreatePost}
            className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-blue-700 active:scale-95"
          >
            <PlusCircle className="h-4 w-4" />
            Tạo Bài Viết Mới
          </button>
        </div>
      </div>

      {/* Golden Hours & Stats Highlight */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-blue-100 bg-blue-50/70 p-4 dark:border-blue-900/40 dark:bg-blue-950/30">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-900 dark:text-blue-300">
            <Clock className="h-4 w-4 text-blue-600" />
            <span>Khung Giờ Vàng Đăng Bài (Tương Tác X3)</span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span className="rounded-md bg-white px-2 py-1 text-xs font-extrabold text-blue-700 shadow-xs dark:bg-slate-800 dark:text-blue-300">
              11:30 - 13:00 (Nghỉ trưa)
            </span>
            <span className="rounded-md bg-white px-2 py-1 text-xs font-extrabold text-blue-700 shadow-xs dark:bg-slate-800 dark:text-blue-300">
              20:00 - 22:00 (Buổi tối)
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-850 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500">Bài đã xuất bản</span>
            <div className="mt-1 text-2xl font-black text-slate-900 dark:text-white">
              {publishedCount}
            </div>
          </div>
          <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
            Đang hiển thị
          </span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-850 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500">Bài đang chờ đến giờ phát</span>
            <div className="mt-1 text-2xl font-black text-blue-600 dark:text-blue-400">
              {scheduledCount}
            </div>
          </div>
          <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-bold text-blue-800 dark:bg-blue-950/60 dark:text-blue-300">
            Hẹn giờ tự động
          </span>
        </div>
      </div>

      {/* Tabs & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3 dark:border-slate-800">
        <div className="flex items-center gap-1.5">
          {[
            { id: 'all', label: `Tất cả (${pagePosts.length})` },
            { id: 'published', label: `Đã xuất bản (${publishedCount})` },
            { id: 'scheduled', label: `Chờ phát sóng (${scheduledCount})` },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterStatus(tab.id as any)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                filterStatus === tab.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={`rounded-md px-3 py-1 text-xs font-semibold transition ${
              viewMode === 'list'
                ? 'bg-white text-blue-600 shadow-xs dark:bg-slate-700 dark:text-white'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            Danh Sách
          </button>
          <button
            type="button"
            onClick={() => setViewMode('calendar')}
            className={`rounded-md px-3 py-1 text-xs font-semibold transition ${
              viewMode === 'calendar'
                ? 'bg-white text-blue-600 shadow-xs dark:bg-slate-700 dark:text-white'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            Lịch Tháng
          </button>
        </div>
      </div>

      {/* Posts List View */}
      {viewMode === 'list' ? (
        <div className="space-y-4">
          {filteredPosts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center dark:border-slate-700">
              <Calendar className="mx-auto h-8 w-8 text-slate-400" />
              <h3 className="mt-2 text-sm font-bold text-slate-800 dark:text-white">
                Chưa có bài viết nào trong mục này
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Hãy tạo bài viết mới hoặc dùng AI để lên lịch bài đăng đầu tiên cho Page!
              </p>
              <button
                type="button"
                onClick={onOpenCreatePost}
                className="mt-4 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700"
              >
                + Soạn bài đăng ngay
              </button>
            </div>
          ) : (
            filteredPosts.map((post) => (
              <div
                key={post.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 dark:border-slate-800 dark:bg-slate-850"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    {post.images[0] ? (
                      <img
                        src={post.images[0]}
                        alt="Post media"
                        className="h-24 w-24 shrink-0 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                      />
                    ) : (
                      <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-400 dark:bg-slate-800">
                        Bài chữ
                      </div>
                    )}

                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                            post.status === 'published'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                              : 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                          }`}
                        >
                          {post.status === 'published' ? 'Đã xuất bản' : 'Đã lên lịch'}
                        </span>
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {post.status === 'published'
                            ? `Đăng lúc ${new Date(post.publishedAt || '').toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`
                            : `Lên lịch phát: ${post.scheduledAt || '20:00 tối mai'}`}
                        </span>
                        <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                          {post.type}
                        </span>
                      </div>

                      <p className="text-xs leading-relaxed text-slate-800 whitespace-pre-line line-clamp-3 dark:text-slate-200">
                        {post.content}
                      </p>

                      <div className="flex flex-wrap gap-1">
                        {post.tags.map((tag, i) => (
                          <span
                            key={i}
                            className="text-[11px] font-medium text-blue-600 hover:underline dark:text-blue-400"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right: Metrics & Actions */}
                  <div className="flex flex-row md:flex-col items-end justify-between gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-4 text-xs">
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
                        <div className="text-[10px] text-slate-400">Thích</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-slate-900 dark:text-white">
                          {post.commentsCount}
                        </div>
                        <div className="text-[10px] text-slate-400">Bình luận</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {post.status === 'scheduled' && (
                        <button
                          type="button"
                          onClick={() => onPublishNow(post.id)}
                          className="flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300"
                        >
                          <Send className="h-3.5 w-3.5" /> Đăng ngay
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => onDeletePost(post.id)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40"
                        title="Xóa bài viết"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        /* Calendar View */
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-850">
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-500 mb-2">
            <span>Thứ 2</span>
            <span>Thứ 3</span>
            <span>Thứ 4</span>
            <span>Thứ 5</span>
            <span>Thứ 6</span>
            <span>Thứ 7</span>
            <span>Chủ Nhật</span>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 14 }).map((_, i) => {
              const dayNum = i + 1;
              const hasPost = i === 5 || i === 6;
              return (
                <div
                  key={i}
                  className={`min-h-[90px] rounded-xl border p-2 text-left transition ${
                    hasPost
                      ? 'border-blue-300 bg-blue-50/50 dark:border-blue-900/60 dark:bg-blue-950/30'
                      : 'border-slate-100 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/40'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                    <span>{dayNum} Tháng 11</span>
                  </div>
                  {hasPost && (
                    <div className="mt-1 rounded-md bg-blue-600 p-1 text-[10px] font-semibold text-white truncate shadow-2xs">
                      🔥 Livestream Robot 20:00
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { FacebookPage, FacebookPost, PostType } from '../types';
import { generateFacebookPostAI } from '../utils/geminiHelper';
import { checkFacebookAdsPolicy } from '../utils/fbLogic';
import {
  X,
  Sparkles,
  Image as ImageIcon,
  Calendar,
  Send,
  Smartphone,
  Monitor,
  CheckCircle2,
  AlertTriangle,
  Globe,
  ThumbsUp,
  MessageCircle,
  Share2,
  Smile,
  Hash,
} from 'lucide-react';

interface CreatePostModalProps {
  activePage: FacebookPage;
  onClose: () => void;
  onSubmit: (post: Omit<FacebookPost, 'id' | 'reach' | 'reactions' | 'commentsCount' | 'sharesCount'>) => void;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  activePage,
  onClose,
  onSubmit,
}) => {
  const [content, setContent] = useState('');
  const [postType, setPostType] = useState<PostType>('post');
  const [scheduleMode, setScheduleMode] = useState<'now' | 'schedule'>('now');
  const [scheduleTime, setScheduleTime] = useState('2026-11-07T20:00');
  const [previewDevice, setPreviewDevice] = useState<'mobile' | 'desktop'>('desktop');
  const [selectedImage, setSelectedImage] = useState<string>(
    'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800&auto=format&fit=crop&q=80'
  );

  // AI Generator state
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiProduct, setAiProduct] = useState('');
  const [aiTone, setAiTone] = useState<'selling' | 'promotion' | 'humorous' | 'storytelling' | 'educational'>('selling');
  const [showAiPanel, setShowAiPanel] = useState(false);

  // Policy check
  const policyCheck = checkFacebookAdsPolicy(content);

  const sampleImages = [
    'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=800&auto=format&fit=crop&q=80',
  ];

  const handleGenerateAI = async () => {
    if (!aiProduct.trim()) return;
    setIsAiLoading(true);
    try {
      const generated = await generateFacebookPostAI({
        productOrTopic: aiProduct,
        tone: aiTone,
        includeDiscount: true,
      });
      setContent(generated);
      setShowAiPanel(false);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleAddHashtags = (tag: string) => {
    setContent((prev) => (prev ? `${prev} ${tag}` : tag));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    // extract hashtags
    const matchedTags = content.match(/#[a-zA-Z0-9_\p{L}]+/gu) || [];

    onSubmit({
      pageId: activePage.id,
      authorName: activePage.name,
      authorAvatar: activePage.avatar,
      content,
      images: selectedImage ? [selectedImage] : [],
      type: postType,
      status: scheduleMode === 'now' ? 'published' : 'scheduled',
      scheduledAt: scheduleMode === 'schedule' ? scheduleTime : undefined,
      publishedAt: scheduleMode === 'now' ? new Date().toISOString() : undefined,
      tags: matchedTags.length > 0 ? matchedTags : ['#FBMaster', '#BanHang'],
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-5xl rounded-2xl bg-white shadow-2xl dark:bg-slate-900 overflow-hidden my-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300">
              <Calendar className="h-4 w-4" />
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Soạn Thảo & Lên Lịch Đăng Bài Facebook
              </h2>
              <p className="text-xs text-slate-500">
                Xem trước giao diện News Feed thời gian thực
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
            aria-label="Đóng"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content: 2-column layout */}
        <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-12 max-h-[80vh] overflow-y-auto">
          {/* Left Form: 7 cols */}
          <div className="space-y-4 lg:col-span-7">
            {/* Post Format & AI Button */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
                {(['post', 'reel', 'story'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setPostType(t)}
                    className={`rounded-md px-3 py-1 text-xs font-semibold capitalize transition ${
                      postType === t
                        ? 'bg-white text-blue-600 shadow-xs dark:bg-slate-700 dark:text-white'
                        : 'text-slate-600 hover:text-slate-900 dark:text-slate-300'
                    }`}
                  >
                    {t === 'post' ? 'Bài viết (Feed)' : t === 'reel' ? 'Reels Video' : 'Story 24h'}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setShowAiPanel(!showAiPanel)}
                className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition hover:from-purple-700 hover:to-indigo-700"
              >
                <Sparkles className="h-3.5 w-3.5" />
                AI Viết Bài Viral
              </button>
            </div>

            {/* AI Generator Drawer */}
            {showAiPanel && (
              <div className="rounded-xl border border-purple-200 bg-purple-50/60 p-3.5 space-y-3 dark:border-purple-900/50 dark:bg-purple-950/20">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-900 dark:text-purple-300 flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5 text-purple-600" /> Trợ Lý AI Gemini Viết Bài
                  </span>
                  <span className="text-[10px] text-purple-700 dark:text-purple-400">
                    Tối ưu văn phong chốt đơn Việt Nam
                  </span>
                </div>

                <div className="space-y-2">
                  <input
                    type="text"
                    value={aiProduct}
                    onChange={(e) => setAiProduct(e.target.value)}
                    placeholder="Nhập tên sản phẩm hoặc chủ đề (VD: Nồi chiên không dầu 8.5L sale 50%)..."
                    className="w-full rounded-lg border border-purple-200 bg-white px-3 py-2 text-xs focus:border-purple-500 focus:outline-none dark:border-purple-800 dark:bg-slate-800 dark:text-white"
                  />

                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] text-slate-500 font-medium">Phong cách:</span>
                    {[
                      { id: 'selling', label: 'Bán hàng chốt đơn' },
                      { id: 'promotion', label: 'Flash Sale khủng' },
                      { id: 'storytelling', label: 'Kể chuyện cảm xúc' },
                      { id: 'humorous', label: 'Hài hước hóm hỉnh' },
                      { id: 'educational', label: 'Chia sẻ mẹo hay' },
                    ].map((tone) => (
                      <button
                        key={tone.id}
                        type="button"
                        onClick={() => setAiTone(tone.id as any)}
                        className={`rounded-md px-2 py-0.5 text-[11px] font-medium border ${
                          aiTone === tone.id
                            ? 'border-purple-600 bg-purple-600 text-white'
                            : 'border-purple-200 bg-white text-purple-800 dark:border-purple-800 dark:bg-slate-800 dark:text-purple-300'
                        }`}
                      >
                        {tone.label}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    disabled={isAiLoading || !aiProduct.trim()}
                    onClick={handleGenerateAI}
                    className="w-full flex items-center justify-center gap-2 rounded-lg bg-purple-600 py-2 text-xs font-bold text-white transition hover:bg-purple-700 disabled:opacity-50"
                  >
                    {isAiLoading ? (
                      <span>Đang sáng tạo nội dung...</span>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" /> Tạo nội dung ngay
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Post Content Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                  Nội dung bài viết
                </label>
                <span className="text-[11px] text-slate-400">
                  {content.length} ký tự
                </span>
              </div>
              <textarea
                rows={6}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Viết nội dung bài đăng của bạn ở đây... (hỗ trợ icon emoji, hashtag, thông tin ưu đãi)"
                className="w-full rounded-xl border border-slate-200 p-3 text-xs leading-relaxed text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            {/* Quick Hashtag & Emojis */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                <Hash className="h-3 w-3" /> Gợi ý thẻ:
              </span>
              {['#GiaDungThongMinh', '#FlashSale', '#Freeship', '#HangChinhHang', '#BaoHanh24T'].map(
                (tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleAddHashtags(tag)}
                    className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] text-blue-600 font-medium hover:bg-blue-50 transition dark:bg-slate-800 dark:text-blue-400"
                  >
                    {tag}
                  </button>
                )
              )}
            </div>

            {/* Image Selector */}
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-200 block mb-2">
                Hình ảnh đính kèm
              </label>
              <div className="grid grid-cols-4 gap-2">
                {sampleImages.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelectedImage(img)}
                    className={`relative aspect-square overflow-hidden rounded-lg border-2 transition ${
                      selectedImage === img
                        ? 'border-blue-600 ring-2 ring-blue-500/30'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumbnail" className="h-full w-full object-cover" />
                    {selectedImage === img && (
                      <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-white text-[10px]">
                        ✓
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Ads Policy Auditor Feedback */}
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-xs dark:border-slate-800 dark:bg-slate-800/50">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                  {policyCheck.isClean ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                  )}
                  Kiểm tra chính sách quảng cáo Facebook (Ads Policy)
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    policyCheck.score >= 80
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                  }`}
                >
                  Điểm an toàn: {policyCheck.score}/100
                </span>
              </div>
              {policyCheck.violations.length > 0 ? (
                <div className="mt-2 space-y-1 text-[11px] text-amber-700 dark:text-amber-300">
                  {policyCheck.violations.map((v, i) => (
                    <div key={i} className="flex items-start gap-1">
                      <span>⚠️ Chứa từ ngữ cảnh báo: "{v.keyword}"</span>
                      <span className="text-slate-500 dark:text-slate-400">({v.tip})</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-1 text-[11px] text-slate-500">
                  Nội dung chuẩn an toàn, không chứa từ khóa cấm hoặc cam kết quá mức.
                </p>
              )}
            </div>

            {/* Schedule / Publish Options */}
            <div className="rounded-xl border border-slate-200 p-3.5 space-y-3 dark:border-slate-800">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                  <input
                    type="radio"
                    name="schedule"
                    checked={scheduleMode === 'now'}
                    onChange={() => setScheduleMode('now')}
                    className="accent-blue-600"
                  />
                  <span>Đăng ngay bây giờ</span>
                </label>
                <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                  <input
                    type="radio"
                    name="schedule"
                    checked={scheduleMode === 'schedule'}
                    onChange={() => setScheduleMode('schedule')}
                    className="accent-blue-600"
                  />
                  <span>Lên lịch phát bài</span>
                </label>
              </div>

              {scheduleMode === 'schedule' && (
                <div className="flex items-center gap-3 pt-1">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  <input
                    type="datetime-local"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                  <span className="text-[11px] text-slate-500">Giờ vàng Facebook khuyên dùng: 20:00</span>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!content.trim()}
                className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow-md transition hover:bg-blue-700 disabled:opacity-50"
              >
                <Send className="h-3.5 w-3.5" />
                {scheduleMode === 'now' ? 'Xuất Bản Lên Fanpage' : 'Lưu Lịch Đăng'}
              </button>
            </div>
          </div>

          {/* Right Live Preview: 5 cols */}
          <div className="space-y-3 lg:col-span-5 bg-slate-100 p-4 rounded-2xl dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800">
            {/* Switch Desktop / Mobile preview */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Mô phỏng News Feed Facebook
              </span>
              <div className="flex items-center gap-1 rounded-md bg-white p-1 shadow-2xs dark:bg-slate-800">
                <button
                  type="button"
                  onClick={() => setPreviewDevice('desktop')}
                  className={`rounded p-1 text-slate-500 ${
                    previewDevice === 'desktop' ? 'bg-blue-50 text-blue-600 dark:bg-slate-700 dark:text-white' : ''
                  }`}
                  aria-label="Xem bản máy tính"
                >
                  <Monitor className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice('mobile')}
                  className={`rounded p-1 text-slate-500 ${
                    previewDevice === 'mobile' ? 'bg-blue-50 text-blue-600 dark:bg-slate-700 dark:text-white' : ''
                  }`}
                  aria-label="Xem bản di động"
                >
                  <Smartphone className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Facebook Card Frame */}
            <div
              className={`mx-auto rounded-xl bg-white shadow-sm border border-slate-200 dark:bg-slate-900 dark:border-slate-800 overflow-hidden ${
                previewDevice === 'mobile' ? 'max-w-[340px]' : 'w-full'
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-3">
                <div className="flex items-center gap-2.5">
                  <img
                    src={activePage.avatar}
                    alt={activePage.name}
                    className="h-10 w-10 rounded-full object-cover ring-1 ring-slate-200"
                  />
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {activePage.name}
                      </span>
                      {activePage.verified && (
                        <CheckCircle2 className="h-3.5 w-3.5 text-blue-500 fill-blue-500/20" />
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-slate-400">
                      <span>{scheduleMode === 'now' ? 'Vừa xong' : 'Đã lên lịch'}</span>
                      <span>•</span>
                      <Globe className="h-3 w-3" />
                    </div>
                  </div>
                </div>
                <button className="text-slate-400 hover:text-slate-600">•••</button>
              </div>

              {/* Post Body Content */}
              <div className="px-3 pb-2 text-xs leading-relaxed text-slate-800 dark:text-slate-200 whitespace-pre-wrap">
                {content || (
                  <span className="text-slate-400 italic">
                    Nội dung bài viết sẽ hiển thị trực tiếp tại đây khi bạn nhập...
                  </span>
                )}
              </div>

              {/* Post Image */}
              {selectedImage && (
                <div className="relative aspect-video w-full bg-slate-100 dark:bg-slate-800">
                  <img
                    src={selectedImage}
                    alt="Preview media"
                    className="h-full w-full object-cover"
                  />
                </div>
              )}

              {/* Likes & Comments Counter */}
              <div className="flex items-center justify-between px-3 py-2 text-[11px] text-slate-500 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-1">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[9px] text-white">
                    👍
                  </span>
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] text-white">
                    ❤️
                  </span>
                  <span>142</span>
                </div>
                <div className="flex items-center gap-3">
                  <span>18 bình luận</span>
                  <span>5 lượt chia sẻ</span>
                </div>
              </div>

              {/* Action Bar (Like, Comment, Share) */}
              <div className="grid grid-cols-3 divide-x divide-slate-100 px-1 py-1.5 text-center text-xs font-semibold text-slate-600 dark:divide-slate-800 dark:text-slate-300">
                <button className="flex items-center justify-center gap-1.5 py-1 hover:bg-slate-50 rounded dark:hover:bg-slate-800">
                  <ThumbsUp className="h-3.5 w-3.5" /> Thích
                </button>
                <button className="flex items-center justify-center gap-1.5 py-1 hover:bg-slate-50 rounded dark:hover:bg-slate-800">
                  <MessageCircle className="h-3.5 w-3.5" /> Bình luận
                </button>
                <button className="flex items-center justify-center gap-1.5 py-1 hover:bg-slate-50 rounded dark:hover:bg-slate-800">
                  <Share2 className="h-3.5 w-3.5" /> Chia sẻ
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { FacebookPage, Conversation, FacebookOrder, ChatMessage } from '../types';
import { QuickOrderModal } from './QuickOrderModal';
import { QUICK_REPLIES } from '../data/initialData';
import { generateSmartReplyAI } from '../utils/geminiHelper';
import { maskSensitiveCustomerData } from '../utils/fbLogic';
import {
  MessageSquare,
  MessageCircle,
  Phone,
  ShieldCheck,
  Search,
  Sparkles,
  Send,
  ShoppingBag,
  Star,
  CheckCircle2,
  Tag,
  Clock,
  User,
  MapPin,
  ExternalLink,
  Bot,
  Flame,
  Lock,
} from 'lucide-react';

interface InboxCommentsViewProps {
  activePage: FacebookPage;
  conversations: Conversation[];
  onSendMessage: (conversationId: string, text: string, isAutomated?: boolean) => void;
  onCreateOrder: (order: Omit<FacebookOrder, 'id' | 'code' | 'createdAt'>) => void;
  onToggleStar: (conversationId: string) => void;
  autoHidePhoneEnabled: boolean;
  onToggleAutoHidePhone: () => void;
}

export const InboxCommentsView: React.FC<InboxCommentsViewProps> = ({
  activePage,
  conversations,
  onSendMessage,
  onCreateOrder,
  onToggleStar,
  autoHidePhoneEnabled,
  onToggleAutoHidePhone,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'message' | 'comment' | 'phone' | 'unread'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeConvId, setActiveConvId] = useState<string>(conversations[0]?.id || '');
  const [inputText, setInputText] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  const [sendPrivateMessageAlso, setSendPrivateMessageAlso] = useState(true);

  // Filter conversations for active page
  const pageConversations = conversations.filter((c) => c.pageId === activePage.id);

  const filteredConversations = pageConversations.filter((c) => {
    if (filterType === 'message' && c.type !== 'message') return false;
    if (filterType === 'comment' && c.type !== 'comment') return false;
    if (filterType === 'phone' && !c.tags.includes('Có SĐT') && !c.customerPhone) return false;
    if (filterType === 'unread' && !c.unread) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.customerName.toLowerCase().includes(q) ||
        (c.customerPhone && c.customerPhone.includes(q)) ||
        c.lastMessage.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const activeConv = pageConversations.find((c) => c.id === activeConvId) || filteredConversations[0];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConv) return;
    onSendMessage(activeConv.id, inputText);
    setInputText('');
  };

  const handleAiSmartReply = async () => {
    if (!activeConv) return;
    setIsAiGenerating(true);
    try {
      const lastCustMsg = [...activeConv.messages].reverse().find((m) => m.sender === 'customer')?.text || activeConv.lastMessage;
      const reply = await generateSmartReplyAI(lastCustMsg, activeConv.postContext?.postTitle);
      setInputText(reply);
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handleInsertQuickReply = (text: string) => {
    setInputText(text);
    setShowQuickReplies(false);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] w-full overflow-hidden bg-slate-50 dark:bg-slate-900">
      {/* Column 1: Conversations List (Width: 320px) */}
      <div className="w-80 shrink-0 border-r border-slate-200 bg-white flex flex-col dark:border-slate-800 dark:bg-slate-850">
        {/* Search & Anti-Theft toggle */}
        <div className="p-3 border-b border-slate-100 dark:border-slate-800 space-y-2.5">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm khách hàng, số điện thoại..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-8 pr-3 text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          {/* Anti-Theft Toggle Notice */}
          <div className="flex items-center justify-between rounded-lg bg-emerald-50/80 px-2.5 py-1.5 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/40">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-900 dark:text-emerald-300">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span>Chống cướp đơn (Ẩn SĐT)</span>
            </div>
            <button
              type="button"
              onClick={onToggleAutoHidePhone}
              className={`relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                autoHidePhoneEnabled ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
              role="switch"
              aria-checked={autoHidePhoneEnabled}
            >
              <span
                className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  autoHidePhoneEnabled ? 'translate-x-3' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-1">
            {[
              { id: 'all', label: 'Tất cả' },
              { id: 'phone', label: '🔥 Có SĐT' },
              { id: 'message', label: 'Messenger' },
              { id: 'comment', label: 'Bình luận' },
              { id: 'unread', label: 'Chưa đọc' },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilterType(f.id as any)}
                className={`rounded-md px-2 py-1 text-[11px] font-semibold transition ${
                  filterType === f.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Conversations Scroll list */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
          {filteredConversations.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              Không tìm thấy hội thoại phù hợp
            </div>
          ) : (
            filteredConversations.map((conv) => {
              const isActive = activeConv?.id === conv.id;
              const hasPhone = conv.tags.includes('Có SĐT') || conv.customerPhone;
              return (
                <div
                  key={conv.id}
                  onClick={() => setActiveConvId(conv.id)}
                  className={`flex items-start gap-3 p-3 transition cursor-pointer relative ${
                    isActive
                      ? 'bg-blue-50/80 dark:bg-slate-800'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  {/* Unread blue dot */}
                  {conv.unread && (
                    <span className="absolute left-1 top-4 h-2 w-2 rounded-full bg-blue-600 ring-2 ring-white" />
                  )}

                  <div className="relative shrink-0">
                    <img
                      src={conv.customerAvatar}
                      alt={conv.customerName}
                      className="h-10 w-10 rounded-full object-cover ring-1 ring-slate-200"
                    />
                    <span
                      className={`absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full text-[9px] text-white ${
                        conv.type === 'message' ? 'bg-blue-600' : 'bg-emerald-600'
                      }`}
                      title={conv.type === 'message' ? 'Tin nhắn Messenger' : 'Bình luận bài viết'}
                    >
                      {conv.type === 'message' ? (
                        <MessageSquare className="h-2.5 w-2.5" />
                      ) : (
                        <MessageCircle className="h-2.5 w-2.5" />
                      )}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="truncate text-xs font-bold text-slate-900 dark:text-white">
                        {conv.customerName}
                      </span>
                      <span className="text-[10px] text-slate-400 shrink-0">
                        {conv.lastMessageTime}
                      </span>
                    </div>

                    {hasPhone && (
                      <div className="mt-0.5 flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400">
                        <Phone className="h-3 w-3" />
                        <span>
                          {conv.customerPhone
                            ? conv.customerPhone.slice(0, 3) + '****' + conv.customerPhone.slice(-3)
                            : 'Có SĐT'}
                        </span>
                      </div>
                    )}

                    <p className="mt-1 text-[11px] text-slate-500 truncate dark:text-slate-400">
                      {conv.lastMessage}
                    </p>

                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {conv.tags.map((tag, i) => (
                        <span
                          key={i}
                          className={`rounded px-1.5 py-0.2 text-[9px] font-bold ${
                            tag === 'Có SĐT' || tag === 'Lead nóng'
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                              : tag === 'VIP'
                              ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300'
                              : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Column 2: Active Chat Window (Flex 1) */}
      <div className="flex-1 flex flex-col bg-white border-r border-slate-200 dark:border-slate-800 dark:bg-slate-900 min-w-0">
        {activeConv ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <img
                  src={activeConv.customerAvatar}
                  alt={activeConv.customerName}
                  className="h-9 w-9 rounded-full object-cover ring-1 ring-slate-200"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {activeConv.customerName}
                    </span>
                    <button
                      type="button"
                      onClick={() => onToggleStar(activeConv.id)}
                      className={`p-0.5 ${
                        activeConv.isStarred
                          ? 'text-amber-500 fill-amber-500'
                          : 'text-slate-300 hover:text-amber-500'
                      }`}
                    >
                      <Star className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <span className="text-[11px] text-slate-500">
                    {activeConv.type === 'comment'
                      ? 'Bình luận trên bài đăng Facebook'
                      : 'Hộp thư Messenger trực tiếp'}
                  </span>
                </div>
              </div>

              {/* Action buttons on header */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowOrderModal(true)}
                  className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700 active:scale-95"
                >
                  <ShoppingBag className="h-4 w-4" />
                  <span>Tạo Đơn Hàng Nhanh</span>
                </button>
              </div>
            </div>

            {/* Post Context Bar if comment */}
            {activeConv.postContext && (
              <div className="flex items-center justify-between bg-blue-50/70 px-4 py-2 text-xs border-b border-blue-100 dark:bg-blue-950/30 dark:border-blue-900/40">
                <div className="flex items-center gap-2 truncate">
                  <span className="font-semibold text-blue-900 dark:text-blue-300">Bài viết:</span>
                  <span className="truncate text-slate-700 dark:text-slate-300">
                    {activeConv.postContext.postTitle}
                  </span>
                </div>
                <span className="text-[11px] text-blue-600 shrink-0 font-medium">
                  ID: {activeConv.postContext.postId}
                </span>
              </div>
            )}

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {activeConv.messages.map((msg) => {
                const isPage = msg.sender === 'page';
                const maskResult = msg.hasPhone ? maskSensitiveCustomerData(msg.text) : null;
                const displayText = msg.hasPhone && autoHidePhoneEnabled && maskResult ? maskResult.maskedText : msg.text;

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isPage ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed shadow-2xs ${
                        isPage
                          ? 'bg-blue-600 text-white rounded-br-xs'
                          : 'bg-slate-100 text-slate-900 rounded-bl-xs dark:bg-slate-800 dark:text-slate-100'
                      }`}
                    >
                      {/* Bot badge */}
                      {msg.isAutomated && (
                        <div className="mb-1 flex items-center gap-1 text-[10px] font-bold text-blue-200">
                          <Bot className="h-3 w-3" /> FBMaster Tự Động Trả Lời
                        </div>
                      )}

                      {/* Anti-Theft Mask Banner */}
                      {msg.hasPhone && (
                        <div className="mb-1.5 flex items-center gap-1 rounded bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-900 dark:text-amber-200">
                          <Lock className="h-3 w-3" /> Đã kích hoạt bảo mật ẩn SĐT trên Facebook
                        </div>
                      )}

                      <div className="whitespace-pre-wrap">{displayText}</div>
                    </div>
                    <span className="mt-1 text-[10px] text-slate-400 px-1">
                      {msg.timestamp}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Quick replies & AI Suggestions bar */}
            <div className="border-t border-slate-100 px-4 py-2 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-850 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 overflow-x-auto py-0.5">
                <button
                  type="button"
                  onClick={handleAiSmartReply}
                  disabled={isAiGenerating}
                  className="flex items-center gap-1 shrink-0 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 px-2.5 py-1 text-[11px] font-bold text-white shadow-2xs transition hover:opacity-90 disabled:opacity-50"
                >
                  <Sparkles className="h-3 w-3" />
                  {isAiGenerating ? 'Đang viết...' : 'AI Soạn Câu Trả Lời'}
                </button>

                {QUICK_REPLIES.map((qr) => (
                  <button
                    key={qr.id}
                    type="button"
                    onClick={() => handleInsertQuickReply(qr.text)}
                    className="shrink-0 rounded-lg bg-white border border-slate-200 px-2 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  >
                    {qr.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Input Box */}
            <form onSubmit={handleSend} className="p-3 border-t border-slate-200 dark:border-slate-800">
              {activeConv.type === 'comment' && (
                <div className="mb-2 flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-400">
                  <input
                    type="checkbox"
                    id="privateMsgCheckbox"
                    checked={sendPrivateMessageAlso}
                    onChange={(e) => setSendPrivateMessageAlso(e.target.checked)}
                    className="accent-blue-600 rounded"
                  />
                  <label htmlFor="privateMsgCheckbox" className="cursor-pointer">
                    Đồng thời gửi tin nhắn Messenger riêng cho khách hàng này
                  </label>
                </div>
              )}

              <div className="flex items-center gap-2">
                <textarea
                  rows={2}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend(e);
                    }
                  }}
                  placeholder="Nhập câu trả lời... (nhấn Enter để gửi)"
                  className="flex-1 rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md transition hover:bg-blue-700 disabled:opacity-40"
                  aria-label="Gửi tin nhắn"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center text-xs text-slate-400">
            Chọn một cuộc hội thoại từ danh sách bên trái
          </div>
        )}
      </div>

      {/* Column 3: Customer Profile & Mini CRM (Width: 280px) */}
      {activeConv && (
        <div className="hidden xl:flex w-72 shrink-0 flex-col bg-slate-50 border-l border-slate-200 p-4 dark:border-slate-800 dark:bg-slate-850 overflow-y-auto space-y-4">
          <div className="text-center">
            <img
              src={activeConv.customerAvatar}
              alt={activeConv.customerName}
              className="mx-auto h-16 w-16 rounded-full object-cover ring-2 ring-blue-500 shadow-sm"
            />
            <h3 className="mt-2 text-sm font-bold text-slate-900 dark:text-white">
              {activeConv.customerName}
            </h3>
            <p className="text-[11px] text-slate-400">Khách hàng Facebook</p>
          </div>

          {/* Quick info list */}
          <div className="rounded-xl border border-slate-200 bg-white p-3 space-y-2.5 dark:border-slate-700/60 dark:bg-slate-800 text-xs">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
              <Phone className="h-3.5 w-3.5 text-blue-600" />
              <span className="font-semibold">
                {activeConv.customerPhone || 'Chưa cập nhật SĐT'}
              </span>
            </div>

            <div className="flex items-start gap-2 text-slate-700 dark:text-slate-200">
              <MapPin className="h-3.5 w-3.5 text-blue-600 shrink-0 mt-0.5" />
              <span className="text-[11px]">
                {activeConv.customerAddress || 'Chưa có địa chỉ'}
              </span>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">Tổng chi tiêu:</span>
              <span className="font-bold text-emerald-600">
                {(activeConv.totalOrdersValue || 0).toLocaleString('vi-VN')} đ
              </span>
            </div>
          </div>

          {/* Quick order trigger button */}
          <button
            type="button"
            onClick={() => setShowOrderModal(true)}
            className="w-full rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-emerald-700"
          >
            + Chốt Đơn Hàng Ngay
          </button>
        </div>
      )}

      {/* Modal Quick Order */}
      {showOrderModal && activeConv && (
        <QuickOrderModal
          conversation={activeConv}
          onClose={() => setShowOrderModal(false)}
          onSubmitOrder={onCreateOrder}
        />
      )}
    </div>
  );
};

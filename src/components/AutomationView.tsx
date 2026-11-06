import React, { useState } from 'react';
import { AutoRule, matchAutoReply, maskSensitiveCustomerData } from '../utils/fbLogic';
import {
  Bot,
  ShieldCheck,
  PlusCircle,
  Play,
  CheckCircle2,
  Lock,
  MessageSquare,
  MessageCircle,
  ThumbsUp,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Trash2,
} from 'lucide-react';

interface AutomationViewProps {
  rules: AutoRule[];
  onToggleRule: (ruleId: string) => void;
  onAddRule: (rule: AutoRule) => void;
  onDeleteRule: (ruleId: string) => void;
}

export const AutomationView: React.FC<AutomationViewProps> = ({
  rules,
  onToggleRule,
  onAddRule,
  onDeleteRule,
}) => {
  // Test bot simulator state
  const [testComment, setTestComment] = useState('Shop ơi áo này giá bao nhiêu vậy, gọi em số 0987654321 nhé');
  const [testResult, setTestResult] = useState<any>(null);

  // New rule modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRuleName, setNewRuleName] = useState('');
  const [newKeywords, setNewKeywords] = useState('');
  const [newReplyComment, setNewReplyComment] = useState('');
  const [newInboxMessage, setNewInboxMessage] = useState('');
  const [autoLike, setAutoLike] = useState(true);
  const [autoHide, setAutoHide] = useState(false);
  const [sendInbox, setSendInbox] = useState(true);

  const handleRunSimulator = () => {
    if (!testComment.trim()) return;

    // Check phone masking
    const maskInfo = maskSensitiveCustomerData(testComment);
    // Check rule matching
    const matchInfo = matchAutoReply(testComment, rules);

    setTestResult({
      comment: testComment,
      maskInfo,
      matchInfo,
    });
  };

  const handleCreateRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleName.trim() || !newKeywords.trim()) return;

    const keywordsArray = newKeywords.split(',').map((k) => k.trim()).filter(Boolean);

    const newRule: AutoRule = {
      id: `rule-${Date.now()}`,
      name: newRuleName,
      triggerKeywords: keywordsArray,
      replyCommentTemplate: newReplyComment || 'Dạ em chào anh/chị, shop đã phản hồi qua tin nhắn Messenger rồi ạ!',
      sendInboxMessage: sendInbox,
      inboxTemplate: newInboxMessage || 'Chào bạn! Cảm ơn bạn đã nhắn tin cho shop. Shop có thể hỗ trợ gì cho bạn ạ?',
      autoLike,
      autoHideComment: autoHide,
      isActive: true,
    };

    onAddRule(newRule);
    setShowAddModal(false);
    setNewRuleName('');
    setNewKeywords('');
    setNewReplyComment('');
    setNewInboxMessage('');
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300">
              <Bot className="h-4 w-4" />
            </span>
            <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
              Tự Động Hóa & Chống Cướp Khách Fanpage
            </h1>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Kịch bản tự động like, trả lời bình luận, gửi tin nhắn inbox và ẩn số điện thoại khách hàng tức thì
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-blue-700 active:scale-95"
        >
          <PlusCircle className="h-4 w-4" />
          Thêm Kịch Bản Mới
        </button>
      </div>

      {/* Highlights Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4 dark:border-emerald-900/50 dark:bg-emerald-950/20">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 dark:text-emerald-300">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>Chống Cướp Đơn Tự Động</span>
          </div>
          <p className="mt-1 text-xs text-emerald-800/90 dark:text-emerald-300/80">
            Bình luận chứa số điện thoại sẽ được che mờ và ẩn ngay lập tức đối với đối thủ cạnh tranh.
          </p>
        </div>

        <div className="rounded-2xl border border-blue-200 bg-blue-50/60 p-4 dark:border-blue-900/50 dark:bg-blue-950/20">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-900 dark:text-blue-300">
            <MessageSquare className="h-4 w-4 text-blue-600" />
            <span>Phản Hồi Thần Tốc &lt; 3 Giây</span>
          </div>
          <p className="mt-1 text-xs text-blue-800/90 dark:text-blue-300/80">
            Giữ chân khách hàng ngay khi họ có nhu cầu nóng nhất với voucher và bảng giá chi tiết.
          </p>
        </div>

        <div className="rounded-2xl border border-purple-200 bg-purple-50/60 p-4 dark:border-purple-900/50 dark:bg-purple-950/20">
          <div className="flex items-center gap-2 text-xs font-bold text-purple-900 dark:text-purple-300">
            <Sparkles className="h-4 w-4 text-purple-600" />
            <span>Chuyển Đổi Bình Luận Sang Inbox</span>
          </div>
          <p className="mt-1 text-xs text-purple-800/90 dark:text-purple-300/80">
            Tự động mở luồng chat Messenger để đội ngũ sales tiếp tục tư vấn chốt đơn dễ dàng.
          </p>
        </div>
      </div>

      {/* Rules List & Interactive Bot Simulator (2 Cols) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left: Active Rules (7 Cols) */}
        <div className="space-y-4 lg:col-span-7">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Danh Sách Kịch Bản ({rules.length})
            </h2>
            <span className="text-xs text-slate-500">Bật/tắt theo nhu cầu chiến dịch</span>
          </div>

          <div className="space-y-3">
            {rules.map((rule) => (
              <div
                key={rule.id}
                className={`rounded-2xl border p-4 shadow-sm transition ${
                  rule.isActive
                    ? 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-850'
                    : 'border-slate-200/60 bg-slate-100/60 opacity-60 dark:border-slate-800/40 dark:bg-slate-900/40'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {rule.name}
                      </span>
                      {rule.autoHideComment && (
                        <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                          🛡️ Ẩn bình luận
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-1">
                      <span className="text-[11px] font-medium text-slate-400">Từ khóa:</span>
                      {rule.triggerKeywords.map((kw, i) => (
                        <span
                          key={i}
                          className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-blue-600 dark:bg-slate-800 dark:text-blue-400"
                        >
                          "{kw}"
                        </span>
                      ))}
                    </div>

                    <div className="rounded-lg bg-slate-50 p-2.5 text-xs text-slate-700 dark:bg-slate-800/80 dark:text-slate-300 space-y-1">
                      <div className="flex items-start gap-1.5">
                        <MessageCircle className="h-3.5 w-3.5 text-blue-500 shrink-0 mt-0.5" />
                        <span className="line-clamp-2">
                          <strong className="text-slate-800 dark:text-white">Trả lời cmt:</strong> {rule.replyCommentTemplate}
                        </span>
                      </div>
                      {rule.sendInboxMessage && (
                        <div className="flex items-start gap-1.5">
                          <MessageSquare className="h-3.5 w-3.5 text-purple-500 shrink-0 mt-0.5" />
                          <span className="line-clamp-2">
                            <strong className="text-slate-800 dark:text-white">Gửi inbox:</strong> {rule.inboxTemplate}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions: Toggle switch & Delete */}
                  <div className="flex flex-col items-end gap-2">
                    <button
                      type="button"
                      onClick={() => onToggleRule(rule.id)}
                      className={`text-2xl transition ${
                        rule.isActive ? 'text-blue-600' : 'text-slate-300 dark:text-slate-600'
                      }`}
                      aria-label="Bật tắt kịch bản"
                    >
                      {rule.isActive ? (
                        <ToggleRight className="h-7 w-7" />
                      ) : (
                        <ToggleLeft className="h-7 w-7" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteRule(rule.id)}
                      className="text-slate-400 hover:text-red-500 p-1"
                      title="Xóa kịch bản"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Interactive Bot Simulator (5 Cols) */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-850 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-300">
                <Play className="h-3.5 w-3.5" />
              </span>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Trình Giả Lập & Kiểm Tra Bot Trực Tiếp
              </h2>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              Gõ nội dung khách bình luận thử nghiệm để xem phản ứng thực tế của FBMaster:
            </p>

            <div className="space-y-2">
              <textarea
                rows={3}
                value={testComment}
                onChange={(e) => setTestComment(e.target.value)}
                placeholder="Nhập thử bình luận của khách hàng..."
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />

              <button
                type="button"
                onClick={handleRunSimulator}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-purple-600 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-purple-700"
              >
                <Play className="h-3.5 w-3.5" /> Chạy Thử Nghiệm Bot
              </button>
            </div>

            {/* Simulator Output */}
            {testResult && (
              <div className="mt-4 rounded-xl border border-purple-100 bg-purple-50/50 p-3.5 text-xs space-y-3 dark:border-purple-900/40 dark:bg-purple-950/20">
                <div className="font-bold text-purple-950 dark:text-purple-200 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-purple-600" /> Kết quả xử lý thời gian thực:
                </div>

                {/* Mask check */}
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                    1. Trạng thái bảo mật SĐT (Chống cướp đơn):
                  </span>
                  {testResult.maskInfo.hasPhone ? (
                    <div className="rounded-lg bg-emerald-100/70 p-2 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300">
                      🛡️ <strong>Phát hiện SĐT ({testResult.maskInfo.phones.join(', ')}):</strong> Đã kích hoạt cơ chế ẩn bình luận tự động. Trên Facebook, khách hàng khác sẽ thấy:
                      <div className="mt-1 font-mono text-[11px] text-slate-700 dark:text-slate-200">
                        "{testResult.maskInfo.maskedText}"
                      </div>
                    </div>
                  ) : (
                    <div className="text-[11px] text-slate-500">
                      Bình luận không chứa số điện thoại. Hiển thị công khai bình thường.
                    </div>
                  )}
                </div>

                {/* Rule match check */}
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                    2. Kịch bản phản hồi tương ứng:
                  </span>
                  {testResult.matchInfo.matched ? (
                    <div className="space-y-2 rounded-lg bg-white p-2.5 border border-purple-200 dark:bg-slate-800 dark:border-purple-900/50">
                      <div className="text-[11px] font-bold text-blue-600">
                        Khớp kịch bản: "{testResult.matchInfo.rule.name}"
                      </div>
                      <div className="text-[11px] text-slate-700 dark:text-slate-300">
                        <strong>Bình luận công khai:</strong> {testResult.matchInfo.commentReply}
                      </div>
                      {testResult.matchInfo.inboxMessage && (
                        <div className="text-[11px] text-slate-700 dark:text-slate-300">
                          <strong>Tin nhắn inbox riêng:</strong> {testResult.matchInfo.inboxMessage}
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-[10px] font-semibold text-emerald-600">
                        <ThumbsUp className="h-3 w-3" /> Tự động Like bình luận của khách
                      </div>
                    </div>
                  ) : (
                    <div className="text-[11px] text-amber-700 dark:text-amber-400">
                      Không có kịch bản nào khớp từ khóa trong nội dung này.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Add Rule */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900 overflow-hidden">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Tạo Kịch Bản Tự Động Hóa Mới
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Cấu hình từ khóa và nội dung phản hồi khách hàng
            </p>

            <form onSubmit={handleCreateRule} className="space-y-3.5">
              <div>
                <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-200 block mb-1">
                  Tên kịch bản *
                </label>
                <input
                  type="text"
                  required
                  value={newRuleName}
                  onChange={(e) => setNewRuleName(e.target.value)}
                  placeholder="VD: Tự động trả lời comment xin size áo..."
                  className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-200 block mb-1">
                  Từ khóa kích hoạt (ngăn cách bằng dấu phẩy) *
                </label>
                <input
                  type="text"
                  required
                  value={newKeywords}
                  onChange={(e) => setNewKeywords(e.target.value)}
                  placeholder="VD: size, còn hàng, bao nhiêu kg, tư vấn size"
                  className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-200 block mb-1">
                  Mẫu trả lời bình luận công khai
                </label>
                <textarea
                  rows={2}
                  value={newReplyComment}
                  onChange={(e) => setNewReplyComment(e.target.value)}
                  placeholder="Dạ shop đã gửi bảng chọn size chi tiết vào inbox cho bạn rồi nhé!"
                  className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-200 block mb-1">
                  Mẫu gửi tin nhắn Messenger riêng
                </label>
                <textarea
                  rows={2}
                  value={newInboxMessage}
                  onChange={(e) => setNewInboxMessage(e.target.value)}
                  placeholder="Chào bạn, bạn cao và nặng bao nhiêu để shop tư vấn size chuẩn nhất nhé..."
                  className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-2 text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoLike}
                    onChange={(e) => setAutoLike(e.target.checked)}
                    className="accent-blue-600 rounded"
                  />
                  <span>Tự động Like bình luận</span>
                </label>
                <label className="flex items-center gap-2 text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoHide}
                    onChange={(e) => setAutoHide(e.target.checked)}
                    className="accent-blue-600 rounded"
                  />
                  <span>Tự động ẩn bình luận</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:text-slate-300"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-blue-700"
                >
                  Lưu Kịch Bản
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

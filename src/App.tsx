import React, { useState } from 'react';
import {
  INITIAL_PAGES,
  INITIAL_POSTS,
  INITIAL_CONVERSATIONS,
  INITIAL_ORDERS,
  INITIAL_RULES,
  INITIAL_CAMPAIGNS,
} from './data/initialData';
import { FacebookPage, FacebookPost, Conversation, FacebookOrder, OrderStatus } from './types';
import { AutoRule, matchAutoReply, maskSensitiveCustomerData } from './utils/fbLogic';
import { Navbar } from './components/Navbar';
import { Sidebar, ActiveTab } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { PostSchedulerView } from './components/PostSchedulerView';
import { InboxCommentsView } from './components/InboxCommentsView';
import { AutomationView } from './components/AutomationView';
import { OrdersCrmView } from './components/OrdersCrmView';
import { FacebookToolsView } from './components/FacebookToolsView';
import { AdCampaignsView } from './components/AdCampaignsView';
import { CreatePostModal } from './components/CreatePostModal';
import { CheckCircle2, ShieldCheck, X } from 'lucide-react';

export default function App() {
  const [pages] = useState<FacebookPage[]>(INITIAL_PAGES);
  const [activePage, setActivePage] = useState<FacebookPage>(INITIAL_PAGES[0]);
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  const [posts, setPosts] = useState<FacebookPost[]>(INITIAL_POSTS);
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [orders, setOrders] = useState<FacebookOrder[]>(INITIAL_ORDERS);
  const [rules, setRules] = useState<AutoRule[]>(INITIAL_RULES);
  const [campaigns, setCampaigns] = useState(INITIAL_CAMPAIGNS);

  const [autoHidePhoneEnabled, setAutoHidePhoneEnabled] = useState(true);
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3500);
  };

  // Create post handler
  const handleAddPost = (newPostData: Omit<FacebookPost, 'id' | 'reach' | 'reactions' | 'commentsCount' | 'sharesCount'>) => {
    const newPost: FacebookPost = {
      ...newPostData,
      id: `post-${Date.now()}`,
      reach: newPostData.status === 'published' ? 120 : 0,
      reactions: { like: 1, love: 0, haha: 0, wow: 0 },
      commentsCount: 0,
      sharesCount: 0,
    };
    setPosts([newPost, ...posts]);
    setShowCreatePostModal(false);
    showToast(
      newPost.status === 'published'
        ? '🎉 Bài viết đã được xuất bản trực tiếp lên Fanpage!'
        : '⏰ Bài viết đã được lên lịch phát sóng thành công!'
    );
  };

  const handlePublishNow = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, status: 'published', publishedAt: new Date().toISOString(), reach: 150 }
          : p
      )
    );
    showToast('🚀 Bài viết hẹn giờ đã được phát sóng ngay lập tức!');
  };

  const handleDeletePost = (postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
    showToast('Đã xóa bài viết khỏi danh sách quản lý.');
  };

  // Send message or reply comment
  const handleSendMessage = (conversationId: string, text: string, isAutomated = false) => {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === conversationId) {
          const newMsg = {
            id: `msg-${Date.now()}`,
            sender: 'page' as const,
            text,
            timestamp: 'Vừa xong',
            isAutomated,
          };
          return {
            ...c,
            lastMessage: text,
            lastMessageTime: 'Vừa xong',
            unread: false,
            messages: [...c.messages, newMsg],
          };
        }
        return c;
      })
    );
    showToast('Đã gửi phản hồi tới khách hàng thành công!');
  };

  // Create order handler
  const handleCreateOrder = (orderData: Omit<FacebookOrder, 'id' | 'code' | 'createdAt'>) => {
    const newOrder: FacebookOrder = {
      ...orderData,
      id: `ord-${Date.now()}`,
      code: `FB-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
    };
    setOrders([newOrder, ...orders]);
    showToast(`🛒 Tạo thành công đơn hàng #${newOrder.code} trị giá ${newOrder.totalAmount.toLocaleString('vi-VN')} đ!`);
  };

  // Update order status
  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    showToast('Đã cập nhật trạng thái đơn hàng.');
  };

  // Toggle star
  const handleToggleStar = (conversationId: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === conversationId ? { ...c, isStarred: !c.isStarred } : c))
    );
  };

  // Toggle rule
  const handleToggleRule = (ruleId: string) => {
    setRules((prev) =>
      prev.map((r) => (r.id === ruleId ? { ...r, isActive: !r.isActive } : r))
    );
    showToast('Đã cập nhật trạng thái kịch bản tự động.');
  };

  const handleAddRule = (newRule: AutoRule) => {
    setRules([...rules, newRule]);
    showToast('Đã tạo kịch bản tự động hóa mới thành công!');
  };

  const handleDeleteRule = (ruleId: string) => {
    setRules((prev) => prev.filter((r) => r.id !== ruleId));
    showToast('Đã xóa kịch bản.');
  };

  // Toggle Campaign
  const handleToggleCampaign = (id: string) => {
    setCampaigns((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, status: c.status === 'active' ? 'paused' : 'active' } : c
      )
    );
    showToast('Đã chuyển đổi trạng thái chiến dịch Facebook Ads.');
  };

  const unreadInboxCount = conversations.filter((c) => c.pageId === activePage.id && c.unread).length;
  const pendingOrdersCount = orders.filter((o) => o.pageId === activePage.id && o.status === 'pending').length;

  return (
    <div className="flex h-screen w-full flex-col bg-slate-100 text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-100">
      {/* Top Navbar */}
      <Navbar
        pages={pages}
        activePage={activePage}
        onSelectPage={setActivePage}
        onOpenCreatePost={() => setShowCreatePostModal(true)}
        unreadCountTotal={unreadInboxCount}
      />

      {/* Main Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onChangeTab={setActiveTab}
          unreadInboxCount={unreadInboxCount}
          pendingOrdersCount={pendingOrdersCount}
        />

        {/* Viewport Content */}
        <main className="flex-1 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              activePage={activePage}
              posts={posts}
              conversations={conversations}
              orders={orders}
              campaigns={campaigns}
              onNavigateTab={setActiveTab}
              onOpenCreatePost={() => setShowCreatePostModal(true)}
            />
          )}

          {activeTab === 'posts' && (
            <PostSchedulerView
              activePage={activePage}
              posts={posts}
              onOpenCreatePost={() => setShowCreatePostModal(true)}
              onPublishNow={handlePublishNow}
              onDeletePost={handleDeletePost}
            />
          )}

          {activeTab === 'inbox' && (
            <InboxCommentsView
              activePage={activePage}
              conversations={conversations}
              onSendMessage={handleSendMessage}
              onCreateOrder={handleCreateOrder}
              onToggleStar={handleToggleStar}
              autoHidePhoneEnabled={autoHidePhoneEnabled}
              onToggleAutoHidePhone={() => setAutoHidePhoneEnabled(!autoHidePhoneEnabled)}
            />
          )}

          {activeTab === 'automation' && (
            <AutomationView
              rules={rules}
              onToggleRule={handleToggleRule}
              onAddRule={handleAddRule}
              onDeleteRule={handleDeleteRule}
            />
          )}

          {activeTab === 'orders' && (
            <OrdersCrmView
              activePage={activePage}
              orders={orders}
              onUpdateOrderStatus={handleUpdateOrderStatus}
            />
          )}

          {activeTab === 'ads' && (
            <AdCampaignsView
              activePage={activePage}
              campaigns={campaigns}
              onToggleCampaign={handleToggleCampaign}
            />
          )}

          {activeTab === 'tools' && <FacebookToolsView />}
        </main>
      </div>

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-2xl bg-slate-900 px-4 py-3 text-xs font-semibold text-white shadow-2xl dark:bg-white dark:text-slate-900 animate-in fade-in slide-in-from-bottom-3">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 dark:text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="ml-2 text-slate-400 hover:text-white"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Create Post Modal */}
      {showCreatePostModal && (
        <CreatePostModal
          activePage={activePage}
          onClose={() => setShowCreatePostModal(false)}
          onSubmit={handleAddPost}
        />
      )}
    </div>
  );
}

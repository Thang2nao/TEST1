export interface FacebookPage {
  id: string;
  name: string;
  avatar: string;
  cover: string;
  category: string;
  followers: number;
  likes: number;
  verified: boolean;
  unreadCount: number;
  rating: number;
}

export type PostType = 'post' | 'reel' | 'story';
export type PostStatus = 'published' | 'scheduled' | 'draft';

export interface FacebookPost {
  id: string;
  pageId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  images: string[];
  type: PostType;
  status: PostStatus;
  scheduledAt?: string;
  publishedAt?: string;
  reach: number;
  reactions: {
    like: number;
    love: number;
    haha: number;
    wow: number;
  };
  commentsCount: number;
  sharesCount: number;
  tags: string[];
}

export type ConversationType = 'message' | 'comment';

export interface ChatMessage {
  id: string;
  sender: 'customer' | 'page';
  text: string;
  timestamp: string;
  isAutomated?: boolean;
  hasPhone?: boolean;
  isHidden?: boolean;
}

export interface Conversation {
  id: string;
  pageId: string;
  type: ConversationType;
  customerName: string;
  customerAvatar: string;
  customerPhone?: string;
  customerAddress?: string;
  lastMessage: string;
  lastMessageTime: string;
  unread: boolean;
  isStarred: boolean;
  tags: string[]; // e.g. 'VIP', 'Chờ chốt đơn', 'Đã mua', 'Lead nóng'
  postContext?: {
    postId: string;
    postTitle: string;
    postImage: string;
  };
  messages: ChatMessage[];
  totalOrdersValue?: number;
}

export type OrderStatus = 'pending' | 'confirmed' | 'shipping' | 'completed' | 'cancelled';

export interface FacebookOrder {
  id: string;
  code: string;
  pageId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  conversationId: string;
  productName: string;
  quantity: number;
  price: number;
  totalAmount: number;
  shippingFee: number;
  status: OrderStatus;
  paymentMethod: 'COD' | 'Chuyển khoản';
  notes?: string;
  createdAt: string;
}

export interface AdCampaign {
  id: string;
  name: string;
  pageId: string;
  status: 'active' | 'paused';
  budgetDaily: number;
  spent: number;
  impressions: number;
  clicks: number;
  cpc: number;
  roas: number;
  leadsCount: number;
}

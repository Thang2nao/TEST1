/**
 * FBMaster Core Business Logic & Algorithms
 * Pure functions decoupled for reliability, testing, and performance.
 */

export interface SensitiveMaskResult {
  maskedText: string;
  hasPhone: boolean;
  phones: string[];
  hiddenForProtection: boolean;
}

// Regex to detect Vietnamese phone numbers formatted in various styles
// e.g. 0912345678, 0912 345 678, 0912.345.678, +84912345678, 84912345678
const VN_PHONE_REGEX = /(?:(?:\+84|84|0)(?:3[2-9]|5[2689]|7[06-9]|8[1-9]|9[0-9]))[\s.-]?\d{3}[\s.-]?\d{3,4}/g;

/**
 * Masks phone numbers to prevent phone/order stealing ("chống cướp đơn")
 */
export function maskSensitiveCustomerData(text: string, maskMiddle = true): SensitiveMaskResult {
  const matches = text.match(VN_PHONE_REGEX) || [];
  const phones = [...new Set(matches)];

  if (phones.length === 0) {
    return {
      maskedText: text,
      hasPhone: false,
      phones: [],
      hiddenForProtection: false,
    };
  }

  let maskedText = text;
  phones.forEach((phone) => {
    const cleanDigits = phone.replace(/\D/g, '');
    let maskedPhone = phone;
    if (maskMiddle && cleanDigits.length >= 7) {
      const start = cleanDigits.slice(0, 3);
      const end = cleanDigits.slice(-3);
      maskedPhone = `${start}****${end} [Đã ẩn bảo vệ]`;
    } else {
      maskedPhone = `[Số điện thoại đã ẩn]`;
    }
    // Replace all occurrences of this phone pattern safely
    maskedText = maskedText.split(phone).join(maskedPhone);
  });

  return {
    maskedText,
    hasPhone: true,
    phones,
    hiddenForProtection: true,
  };
}

/**
 * Facebook Ads Policy / Forbidden Keywords Auditor
 * Detects common Vietnamese prohibited / restricted keywords in Facebook Advertising
 */
export interface PolicyViolation {
  keyword: string;
  category: 'health_medical' | 'over_promising' | 'finance_scam' | 'trademark' | 'sensationalism';
  reason: string;
  tip: string;
}

const POLICY_RULES: { keywords: string[]; category: PolicyViolation['category']; reason: string; tip: string }[] = [
  {
    keywords: ['trị dứt điểm', 'đặc trị', 'chữa khỏi 100%', 'khỏi hẳn', 'vĩnh viễn không tái phát', 'thuốc thần kỳ'],
    category: 'health_medical',
    reason: 'Cam kết y tế/dược phẩm tuyệt đối không thể kiểm chứng, dễ bị Facebook quét và khóa tài khoản Ads.',
    tip: 'Thay bằng: "hỗ trợ cải thiện", "giải pháp chăm sóc chuyên sâu", "được nhiều khách hàng tin dùng".',
  },
  {
    keywords: ['cam kết 100%', 'hiệu quả tức thì', 'đổi đời trong 7 ngày', 'giảm 10kg trong 1 tuần', 'tăng 5cm'],
    category: 'over_promising',
    reason: 'Cam kết quá mức phi thực tế vi phạm tiêu chuẩn cộng đồng về nội dung gây hiểu lầm.',
    tip: 'Nên ghi: "hỗ trợ lộ trình khoa học", "kết quả tùy theo cơ địa từng người".',
  },
  {
    keywords: ['cho vay nặng lãi', 'vay tiền không thế chấp lãi 0%', 'làm giàu không khó', 'kiếm 100 triệu mỗi ngày'],
    category: 'finance_scam',
    reason: 'Dịch vụ tài chính rủi ro cao hoặc quảng bá mô hình đa cấp/lừa đảo tài chính.',
    tip: 'Tránh quảng cáo cam kết thu nhập cố định hoặc cho vay không phép.',
  },
  {
    keywords: ['hàng fake', 'hàng replica 1:1', 'hàng tuồn auth', 'giày nike tuồn', 'túi gucci f1'],
    category: 'trademark',
    reason: 'Xâm phạm quyền sở hữu trí tuệ và thương hiệu đã đăng ký bản quyền quốc tế.',
    tip: 'Không sử dụng logo hoặc tên thương hiệu lớn khi chưa có giấy phép đại lý chính hãng.',
  },
  {
    keywords: ['giật gân', 'kinh hoàng', 'lộ clip nóng', 'sốc tận óc', 'ảnh nóng'],
    category: 'sensationalism',
    reason: 'Nội dung mồi chài click, phản cảm hoặc nhạy cảm trái thuần phong mỹ tục.',
    tip: 'Sử dụng tiêu đề trung thực, mang tính xây dựng và cung cấp giá trị.',
  },
];

export function checkFacebookAdsPolicy(text: string): {
  isClean: boolean;
  score: number;
  violations: PolicyViolation[];
} {
  const lower = text.toLowerCase();
  const violations: PolicyViolation[] = [];

  for (const rule of POLICY_RULES) {
    for (const kw of rule.keywords) {
      if (lower.includes(kw.toLowerCase())) {
        violations.push({
          keyword: kw,
          category: rule.category,
          reason: rule.reason,
          tip: rule.tip,
        });
      }
    }
  }

  const score = Math.max(0, 100 - violations.length * 25);
  return {
    isClean: violations.length === 0,
    score,
    violations,
  };
}

/**
 * Unicode mathematical alphanumeric symbols for Facebook post styler
 */
const BOLD_MAP: Record<string, string> = {
  a: '𝗮', b: '𝗯', c: '𝗰', d: '𝗱', e: '𝗲', f: '𝗳', g: '𝗴', h: '𝗵', i: '𝗶', j: '𝗷',
  k: '𝗸', l: '𝗹', m: '𝗺', n: '𝗻', o: '𝗼', p: '𝗽', q: '𝗾', r: '𝗿', s: '𝘀', t: '𝘁',
  u: '𝘂', v: '𝘃', w: '𝘄', x: '𝘅', y: '𝘆', z: '𝘇',
  A: '𝗔', B: '𝗕', C: '𝗖', D: '𝗗', E: '𝗘', F: '𝗙', G: '𝗚', H: '𝗛', I: '𝗜', J: '𝗝',
  K: '𝗞', L: '𝗟', M: '𝗠', N: '𝗡', O: '𝗢', P: '𝗣', Q: '𝗤', R: '𝗥', S: '𝗦', T: '𝗧',
  U: '𝗨', V: '𝗩', W: '𝗪', X: '𝗫', Y: '𝗬', Z: '𝗭',
  '0': '𝟬', '1': '𝟭', '2': '𝟮', '3': '𝟯', '4': '𝟰', '5': '𝟱', '6': '𝟲', '7': '𝟳', '8': '𝟴', '9': '𝟵',
};

const ITALIC_MAP: Record<string, string> = {
  a: '𝘢', b: '𝘣', c: '𝘤', d: '𝘥', e: '𝘦', f: '𝘧', g: '𝘨', h: '𝘩', i: '𝘪', j: '𝘫',
  k: '𝘬', l: '𝘭', m: '𝘮', n: '𝘯', o: '𝘰', p: '𝘱', q: '𝘲', r: '𝘳', s: '𝘴', t: '𝘵',
  u: '𝘶', v: '𝘷', w: '𝘸', x: '𝘹', y: '𝘺', z: '𝘻',
  A: '𝘈', B: '𝘉', C: '𝘊', D: '𝘋', E: '𝘌', F: '𝘍', G: '𝘎', H: '𝘏', I: '𝘐', J: '𝘑',
  K: '𝘒', L: '𝘓', M: '𝘔', N: '𝘕', O: '𝘖', P: '𝘗', Q: '𝘘', R: '𝘙', S: '𝘚', T: '𝘛',
  U: '𝘜', V: '𝘝', W: '𝘞', X: '𝘟', Y: '𝘠', Z: '𝘡',
};

const MONOSPACE_MAP: Record<string, string> = {
  a: '𝚊', b: '𝚋', c: '𝚌', d: '𝚍', e: '𝚎', f: '𝚏', g: '𝚐', h: '𝚑', i: '𝚒', j: '𝚓',
  k: '𝚔', l: '𝚕', m: '𝚖', n: '𝚗', o: '𝚘', p: '𝚙', q: '𝚚', r: '𝚛', s: '𝚜', t: '𝚝',
  u: '𝚞', v: '𝚟', w: '𝚠', x: '𝚡', y: '𝚢', z: '𝚣',
  A: '𝙰', B: '𝙱', C: '𝙲', D: '𝙳', E: '𝙴', F: '𝙵', G: '𝙶', H: '𝙷', I: '𝙸', J: '𝙹',
  K: '𝙺', L: '𝙻', M: '𝙼', N: '𝙽', O: '𝙾', P: '𝙿', Q: '𝚀', R: '𝚁', S: '𝚂', T: '𝚃',
  U: '𝚄', V: '𝚅', W: '𝚆', X: '𝚇', Y: '𝚈', Z: '𝚉',
};

export type FacebookFontStyle = 'bold' | 'italic' | 'monospace' | 'underline' | 'bracket';

export function formatFacebookFont(text: string, style: FacebookFontStyle): string {
  if (style === 'bold') {
    return text.split('').map((char) => BOLD_MAP[char] || char).join('');
  }
  if (style === 'italic') {
    return text.split('').map((char) => ITALIC_MAP[char] || char).join('');
  }
  if (style === 'monospace') {
    return text.split('').map((char) => MONOSPACE_MAP[char] || char).join('');
  }
  if (style === 'underline') {
    // Unicode combining low line
    return text.split('').map((char) => char + '\u0332').join('');
  }
  if (style === 'bracket') {
    return `【 ${text.toUpperCase()} 】`;
  }
  return text;
}

/**
 * Auto-reply rules matcher for comments & messages
 */
export interface AutoRule {
  id: string;
  name: string;
  triggerKeywords: string[];
  replyCommentTemplate: string;
  sendInboxMessage: boolean;
  inboxTemplate: string;
  autoLike: boolean;
  autoHideComment: boolean;
  isActive: boolean;
}

export function matchAutoReply(
  commentText: string,
  rules: AutoRule[]
): {
  matched: boolean;
  rule?: AutoRule;
  commentReply?: string;
  inboxMessage?: string;
  shouldHide: boolean;
  shouldLike: boolean;
} {
  const lower = commentText.toLowerCase();

  for (const rule of rules) {
    if (!rule.isActive) continue;
    const isHit = rule.triggerKeywords.some((kw) => lower.includes(kw.toLowerCase().trim()));
    if (isHit) {
      return {
        matched: true,
        rule,
        commentReply: rule.replyCommentTemplate,
        inboxMessage: rule.sendInboxMessage ? rule.inboxTemplate : undefined,
        shouldHide: rule.autoHideComment,
        shouldLike: rule.autoLike,
      };
    }
  }

  return {
    matched: false,
    shouldHide: false,
    shouldLike: false,
  };
}

/**
 * Calculates conversion rates, average order value, and page metrics
 */
export function calculateSocialAnalytics(
  posts: { reach: number; engagement: number; shares: number; comments: number }[],
  orders: { totalAmount: number; status: string }[]
) {
  const totalReach = posts.reduce((acc, p) => acc + p.reach, 0);
  const totalEngagement = posts.reduce((acc, p) => acc + p.engagement, 0);
  const totalComments = posts.reduce((acc, p) => acc + p.comments, 0);

  const engagementRate = totalReach > 0 ? Number(((totalEngagement / totalReach) * 100).toFixed(2)) : 0;

  const validOrders = orders.filter((o) => o.status !== 'cancelled');
  const revenue = validOrders.reduce((acc, o) => acc + o.totalAmount, 0);
  const averageOrderValue = validOrders.length > 0 ? Math.round(revenue / validOrders.length) : 0;

  return {
    totalReach,
    totalEngagement,
    totalComments,
    engagementRate,
    totalOrders: validOrders.length,
    revenue,
    averageOrderValue,
  };
}

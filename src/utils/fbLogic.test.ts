import test from 'node:test';
import assert from 'node:assert/strict';
import {
  maskSensitiveCustomerData,
  checkFacebookAdsPolicy,
  formatFacebookFont,
  matchAutoReply,
  calculateSocialAnalytics,
  type AutoRule,
} from './fbLogic';

test('maskSensitiveCustomerData detects and masks Vietnamese phone numbers', () => {
  const comment = 'Tư vấn cho mình áo size L với nhé, SĐT của mình là 0987654321';
  const result = maskSensitiveCustomerData(comment);

  assert.equal(result.hasPhone, true);
  assert.equal(result.phones.length, 1);
  assert.equal(result.phones[0], '0987654321');
  assert.ok(result.maskedText.includes('098****321'));
  assert.ok(result.maskedText.includes('[Đã ẩn bảo vệ]'));
});

test('maskSensitiveCustomerData handles text with no phone numbers', () => {
  const comment = 'Sản phẩm này còn màu trắng không shop ơi?';
  const result = maskSensitiveCustomerData(comment);

  assert.equal(result.hasPhone, false);
  assert.equal(result.phones.length, 0);
  assert.equal(result.maskedText, comment);
});

test('checkFacebookAdsPolicy flags prohibited medical and financial scam keywords', () => {
  const badAd = 'Sản phẩm thuốc đặc trị dứt điểm nám chỉ sau 3 ngày, cam kết 100% hiệu quả!';
  const audit = checkFacebookAdsPolicy(badAd);

  assert.equal(audit.isClean, false);
  assert.ok(audit.violations.length >= 2);
  const keywords = audit.violations.map((v) => v.keyword);
  assert.ok(keywords.includes('trị dứt điểm') || keywords.includes('đặc trị'));
  assert.ok(keywords.includes('cam kết 100%'));
  assert.ok(audit.score < 100);
});

test('checkFacebookAdsPolicy passes safe clean copy', () => {
  const goodAd = 'Bộ sưu tập áo thun mùa hè thoáng mát, thiết kế thanh lịch cho bạn trẻ năng động.';
  const audit = checkFacebookAdsPolicy(goodAd);

  assert.equal(audit.isClean, true);
  assert.equal(audit.violations.length, 0);
  assert.equal(audit.score, 100);
});

test('formatFacebookFont transforms text to bold and monospace styles', () => {
  const original = 'Sale 50%';
  const boldText = formatFacebookFont(original, 'bold');
  const bracketText = formatFacebookFont('khuyen mai', 'bracket');

  assert.notEqual(boldText, original);
  assert.equal(bracketText, '【 KHUYEN MAI 】');
});

test('matchAutoReply matches trigger keyword and returns configured responses', () => {
  const sampleRules: AutoRule[] = [
    {
      id: 'rule-1',
      name: 'Tự động báo giá',
      triggerKeywords: ['giá', 'bao nhiêu', 'inbox giá'],
      replyCommentTemplate: 'Dạ shop đã gửi chi tiết bảng giá kèm voucher 10% qua tin nhắn Messenger cho bạn rồi ạ!',
      sendInboxMessage: true,
      inboxTemplate: 'Chào bạn, mẫu này hiện đang có giá ưu đãi 299k...',
      autoLike: true,
      autoHideComment: false,
      isActive: true,
    },
  ];

  const comment = 'Shop ơi cho mình hỏi áo này giá bao nhiêu vậy?';
  const matchResult = matchAutoReply(comment, sampleRules);

  assert.equal(matchResult.matched, true);
  assert.equal(matchResult.shouldLike, true);
  assert.ok(matchResult.commentReply?.includes('bảng giá kèm voucher'));
  assert.ok(matchResult.inboxMessage?.includes('299k'));
});

test('calculateSocialAnalytics aggregates reach and order values correctly', () => {
  const posts = [
    { reach: 1000, engagement: 100, shares: 10, comments: 20 },
    { reach: 2000, engagement: 200, shares: 30, comments: 40 },
  ];
  const orders = [
    { totalAmount: 500000, status: 'completed' },
    { totalAmount: 300000, status: 'shipping' },
    { totalAmount: 200000, status: 'cancelled' },
  ];

  const analytics = calculateSocialAnalytics(posts, orders);

  assert.equal(analytics.totalReach, 3000);
  assert.equal(analytics.totalEngagement, 300);
  assert.equal(analytics.engagementRate, 10);
  assert.equal(analytics.totalOrders, 2);
  assert.equal(analytics.revenue, 800000);
  assert.equal(analytics.averageOrderValue, 400000);
});

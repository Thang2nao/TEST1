import { GoogleGenAI } from '@google/genai';

export interface GeneratePostOptions {
  productOrTopic: string;
  tone: 'selling' | 'humorous' | 'storytelling' | 'promotion' | 'educational';
  targetAudience?: string;
  includeDiscount?: boolean;
}

const FALLBACK_TEMPLATES: Record<string, string[]> = {
  selling: [
    `🔥 [SIÊU PHẨM MỚI] {TOPIC} - ĐỈNH CAO CHẤT LƯỢNG CHO GIA ĐÌNH BẠN!\n\n✨ Bạn đang tìm kiếm một giải pháp tiện ích, bền đẹp và hiện đại? Đừng bỏ qua cơ hội sở hữu ngay hôm nay:\n\n✔️ Thiết kế thông minh, tối ưu công năng sử dụng\n✔️ Tiết kiệm thời gian, nâng tầm không gian sống\n✔️ Bảo hành chính hãng 24 tháng, lỗi 1 đổi 1\n\n🎁 ƯU ĐÃI ĐẶC BIỆT: Giảm ngay 15% cho 50 khách hàng đầu tiên để lại bình luận [SĐT] bên dưới!\n\n👉 Nhắn tin cho shop ngay để được tư vấn kích thước và nhận quà tặng giới hạn!`,
    `💎 ĐỪNG BỎ LỠ: {TOPIC} - CƠ HỘI SẮM ĐỒ XỊN GIÁ HỜI!\n\nChiếc sản phẩm quốc dân được hàng nghìn khách hàng tin tưởng bình chọn 5 sao đã chính thức restock đầy kho!\n\n🌟 Chất liệu cao cấp, độ hoàn thiện xuất sắc\n🌟 Giao hàng hỏa tốc toàn quốc, kiểm tra hàng thoải mái trước khi thanh toán\n\n📌 Để lại bình luận hoặc nhắn tin shop gửi bảng giá chi tiết kèm ưu đãi trong hôm nay!`,
  ],
  promotion: [
    `⚡ FLASH SALE KHỦNG DUY NHẤT HÔM NAY - GIẢM TỚI 40% CHO {TOPIC}!\n\n⏰ Chỉ áp dụng cho khách hàng tương tác với bài viết này:\n\n🎁 Tặng ngay voucher 100k cho đơn từ 500k\n🚚 Miễn phí vận chuyển toàn quốc\n🔄 Đổi trả linh hoạt trong 7 ngày\n\n👇 Nhanh tay comment '.' hoặc inbox shop nhận mã giảm giá trước khi hết suất!`,
  ],
  storytelling: [
    `📖 CÂU CHUYỆN ĐẰNG SAU CHIẾC {TOPIC} MÀ SHOP TÂM ĐẮC NHẤT...\n\nCó những ngày đi làm về mệt nhoài, điều chúng ta cần chỉ là một góc nhỏ thật gọn gàng, một bữa cơm ấm cúng và sự tiện nghi giản đơn.\n\nĐó là lý do đội ngũ chúng mình dành trọn tâm huyết tuyển chọn dòng {TOPIC} này. Không chỉ đơn thuần là một món đồ, nó là người bạn đồng hành chăm sóc sức khỏe và hạnh phúc gia đình bạn mỗi ngày.\n\n❤️ Bạn đã thử trải nghiệm chưa? Chia sẻ với shop cảm nhận của bạn bên dưới nhé!`,
  ],
  educational: [
    `💡 3 MẸO SỬ DỤNG {TOPIC} BỀN ĐẸP GẤP ĐÔI MÀ 90% NGƯỜI DÙNG CHƯA BIẾT!\n\n1️⃣ Vệ sinh đúng cách định kỳ bằng khăn mềm để tránh trầy xước bề mặt.\n2️⃣ Đặt ở nơi khô ráo, thoáng khí, tránh ánh nắng trực tiếp.\n3️⃣ Sử dụng đúng công suất và hướng dẫn tiêu chuẩn từ nhà sản xuất.\n\n👉 Lưu ngay bài viết này và share cho bạn bè cùng biết nhé! Cần hỗ trợ thêm hãy inbox shop 24/7!`,
  ],
  humorous: [
    `😂 Ai bảo có tiền là mua được hạnh phúc? Nhưng chắc chắn có tiền mua {TOPIC} ở shop thì sướng cả ngày nha quý zị!\n\n👉 Vợ khen chu đáo, chồng khen đảm đang, người yêu thì mê tít!\n\n🔥 Giá hôm nay lại còn đang êm như nệm Kim Đan nữa chứ. Không mua đợt này là tiếc hùi hụi luôn á!\n\nIb shop liền tay, cơ hội có 1-0-2!`,
  ],
};

export async function generateFacebookPostAI(options: GeneratePostOptions): Promise<string> {
  const apiKey = (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) || '';

  const prompt = `Bạn là chuyên gia sáng tạo nội dung mạng xã hội và Copywriter Facebook chuyên nghiệp tại Việt Nam với hơn 8 năm kinh nghiệm chạy quảng cáo và bán hàng Fanpage.
Hãy viết một bài đăng Facebook cực kỳ thu hút, giữ chân người đọc, chuẩn văn phong bán hàng/viral Việt Nam cho chủ đề hoặc sản phẩm sau:
- Sản phẩm/Chủ đề: "${options.productOrTopic}"
- Phong cách viết (Tone): ${options.tone} (selling: bán hàng chốt đơn, humorous: hài hước dí dỏm, storytelling: kể chuyện chạm cảm xúc, promotion: bùng nổ khuyến mãi flash sale, educational: chia sẻ mẹo giá trị)
- Khách hàng mục tiêu: ${options.targetAudience || 'Khách hàng Việt Nam quan tâm chất lượng và giá trị'}
- Kèm khuyến mãi: ${options.includeDiscount ? 'Có kèm ưu đãi giảm giá và quà tặng hấp dẫn' : 'Nhấn mạnh giá trị và sự khác biệt'}

Yêu cầu định dạng bài viết Facebook:
1. Tiêu đề giật tít thu hút (dùng emoji sinh động, in hoa hoặc ký tự nhấn mạnh).
2. Thân bài ngắn gọn, chia ý bằng gạch đầu dòng rõ ràng, dễ đọc trên di động.
3. Kêu gọi hành động (Call To Action) rõ ràng: comment SĐT hoặc inbox để nhận ưu đãi.
4. Kèm 3 - 5 hashtag thịnh hành liên quan ở cuối bài.
Không dùng các từ bị cấm Facebook Ads (như cam kết 100%, trị dứt điểm). Trả về trực tiếp nội dung bài đăng tiếng Việt, không kèm lời giải thích rườm rà.`;

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      if (response && response.text) {
        return response.text.trim();
      }
    } catch {
      // In case of quota or network issue, fallback cleanly
    }
  }

  // Graceful deterministic fallback template
  const list = FALLBACK_TEMPLATES[options.tone] || FALLBACK_TEMPLATES.selling;
  const raw = list[Math.floor(Math.random() * list.length)];
  return raw.replace(/{TOPIC}/g, options.productOrTopic);
}

export async function generateSmartReplyAI(customerMessage: string, context?: string): Promise<string> {
  const apiKey = (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) || '';

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `Bạn là nhân viên chăm sóc khách hàng Fanpage Facebook chuyên nghiệp, lịch sự, thân thiện tại Việt Nam.
Khách hàng vừa nhắn: "${customerMessage}"
${context ? `Ngữ cảnh sản phẩm: ${context}` : ''}
Hãy soạn một câu trả lời ngắn gọn (2-3 câu), xưng hô lịch sự "Dạ em chào anh/chị", giải đáp tận tình, và chốt câu hỏi tiếp theo để hướng tới tư vấn hoặc đặt hàng. Trả về đúng nội dung trả lời.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      if (response && response.text) {
        return response.text.trim();
      }
    } catch {
      // Fallback
    }
  }

  // Smart fallback based on customer question intent
  const lower = customerMessage.toLowerCase();
  if (lower.includes('giá') || lower.includes('bao nhiêu') || lower.includes('bn')) {
    return 'Dạ em chào anh/chị ạ! Sản phẩm bên em hiện đang có giá ưu đãi đặc biệt hôm nay và được miễn phí ship toàn quốc. Anh/chị đang quan tâm đến màu sắc hay kích thước nào để em tư vấn chi tiết hơn ạ?';
  }
  if (lower.includes('ship') || lower.includes('giao')) {
    return 'Dạ shop giao hàng toàn quốc hỏa tốc từ 1-3 ngày. Anh/chị được kiểm tra hàng cẩn thận trước khi thanh toán tiền cho shipper ạ!';
  }
  if (lower.includes('bảo hành') || lower.includes('lỗi')) {
    return 'Dạ toàn bộ sản phẩm bên em đều được bảo hành chính hãng 24 tháng và hỗ trợ 1 đổi 1 trong 30 ngày đầu nếu phát sinh lỗi từ nhà sản xuất chị yên tâm nhé!';
  }
  return 'Dạ em chào anh/chị ạ! Cảm ơn anh/chị đã quan tâm đến sản phẩm của shop. Em có thể hỗ trợ giải đáp thắc mắc hoặc tư vấn mẫu phù hợp nhất cho anh/chị ngay bây giờ ạ!';
}

import React, { useState } from 'react';
import { Conversation, FacebookOrder } from '../types';
import confetti from 'canvas-confetti';
import {
  X,
  ShoppingBag,
  DollarSign,
  Truck,
  CheckCircle2,
  User,
  Phone,
  MapPin,
  FileText,
} from 'lucide-react';

interface QuickOrderModalProps {
  conversation: Conversation;
  onClose: () => void;
  onSubmitOrder: (order: Omit<FacebookOrder, 'id' | 'code' | 'createdAt'>) => void;
}

export const QuickOrderModal: React.FC<QuickOrderModalProps> = ({
  conversation,
  onClose,
  onSubmitOrder,
}) => {
  const [customerName, setCustomerName] = useState(conversation.customerName);
  const [customerPhone, setCustomerPhone] = useState(conversation.customerPhone || '');
  const [customerAddress, setCustomerAddress] = useState(conversation.customerAddress || '');
  const [productName, setProductName] = useState('Nồi chiên không dầu điện tử 8.5L (Đen)');
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(1250000);
  const [shippingFee, setShippingFee] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'Chuyển khoản'>('COD');
  const [notes, setNotes] = useState('Khách đặt qua chat Fanpage FBMaster');

  const totalAmount = price * quantity + shippingFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone) return;

    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch {
      // Non-blocking
    }

    onSubmitOrder({
      pageId: conversation.pageId,
      customerName,
      customerPhone,
      customerAddress,
      conversationId: conversation.id,
      productName,
      quantity,
      price,
      shippingFee,
      totalAmount,
      status: 'pending',
      paymentMethod,
      notes,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl dark:bg-slate-900 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-300">
              <ShoppingBag className="h-4 w-4" />
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Chốt Đơn Nhanh Từ Hội Thoại
              </h2>
              <p className="text-xs text-slate-500">
                Tự động điền dữ liệu khách hàng từ tin nhắn chat
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Customer info */}
          <div className="space-y-3 rounded-xl bg-slate-50 p-3.5 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Thông tin người nhận
            </div>
            <div>
              <label className="text-[11px] font-medium text-slate-500 block mb-1">
                Tên khách hàng *
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-medium text-slate-500 block mb-1">
                  Số điện thoại *
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="09..."
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-500 block mb-1">
                  Hình thức thanh toán
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  <option value="COD">Thu tiền khi nhận (COD)</option>
                  <option value="Chuyển khoản">Đã chuyển khoản</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-medium text-slate-500 block mb-1">
                Địa chỉ giao hàng
              </label>
              <input
                type="text"
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                placeholder="Số nhà, ngõ, phường/xã, quận/huyện, tỉnh/thành..."
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          {/* Product details */}
          <div className="space-y-3 rounded-xl bg-slate-50 p-3.5 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Chi tiết sản phẩm đặt mua
            </div>
            <div>
              <label className="text-[11px] font-medium text-slate-500 block mb-1">
                Tên sản phẩm
              </label>
              <input
                type="text"
                required
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[11px] font-medium text-slate-500 block mb-1">
                  Số lượng
                </label>
                <input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value) || 1)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-slate-500 block mb-1">
                  Đơn giá (VNĐ)
                </label>
                <input
                  type="number"
                  step={10000}
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value) || 0)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-slate-500 block mb-1">
                  Phí ship (VNĐ)
                </label>
                <input
                  type="number"
                  step={5000}
                  value={shippingFee}
                  onChange={(e) => setShippingFee(Number(e.target.value) || 0)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-medium text-slate-500 block mb-1">
                Ghi chú đóng gói / giao hàng
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Giao giờ hành chính, gọi trước khi giao..."
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          {/* Total summary */}
          <div className="flex items-center justify-between rounded-xl bg-emerald-50 p-4 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50">
            <div>
              <span className="text-xs font-semibold text-emerald-900 dark:text-emerald-300">
                Tổng tiền thanh toán (COD):
              </span>
              <p className="text-[11px] text-emerald-700/80 dark:text-emerald-400">
                Đã tính tiền hàng + phí vận chuyển
              </p>
            </div>
            <div className="text-xl font-black text-emerald-700 dark:text-emerald-300">
              {totalAmount.toLocaleString('vi-VN')} đ
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white shadow-md transition hover:bg-emerald-700 active:scale-95"
            >
              <CheckCircle2 className="h-4 w-4" />
              Xác Nhận Tạo Đơn Hàng
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { FacebookOrder, FacebookPage, OrderStatus } from '../types';
import {
  ShoppingBag,
  Search,
  Filter,
  Download,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  Phone,
  User,
  ArrowUpDown,
} from 'lucide-react';

interface OrdersCrmViewProps {
  activePage: FacebookPage;
  orders: FacebookOrder[];
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
}

export const OrdersCrmView: React.FC<OrdersCrmViewProps> = ({
  activePage,
  orders,
  onUpdateOrderStatus,
}) => {
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const pageOrders = orders.filter((o) => o.pageId === activePage.id);

  const filteredOrders = pageOrders.filter((o) => {
    if (statusFilter !== 'all' && o.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        o.code.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerPhone.includes(q) ||
        o.productName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalRevenue = pageOrders
    .filter((o) => o.status !== 'cancelled')
    .reduce((acc, o) => acc + o.totalAmount, 0);

  const pendingCount = pageOrders.filter((o) => o.status === 'pending').length;
  const shippingCount = pageOrders.filter((o) => o.status === 'shipping').length;
  const completedCount = pageOrders.filter((o) => o.status === 'completed').length;

  const handleExportCSV = () => {
    const headers = ['Mã đơn', 'Tên khách hàng', 'Số điện thoại', 'Địa chỉ', 'Sản phẩm', 'Số lượng', 'Tổng tiền (COD)', 'Trạng thái', 'Ngày tạo'];
    const rows = filteredOrders.map((o) => [
      o.code,
      `"${o.customerName}"`,
      `"${o.customerPhone}"`,
      `"${o.customerAddress}"`,
      `"${o.productName}"`,
      o.quantity,
      o.totalAmount,
      o.status,
      new Date(o.createdAt).toLocaleDateString('vi-VN'),
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `FBMaster_DonHang_${activePage.name.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return (
          <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-bold text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
            <Clock className="h-3 w-3" /> Chờ xác nhận
          </span>
        );
      case 'confirmed':
        return (
          <span className="flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-[11px] font-bold text-blue-800 dark:bg-blue-950/60 dark:text-blue-300">
            <CheckCircle2 className="h-3 w-3" /> Đã xác nhận
          </span>
        );
      case 'shipping':
        return (
          <span className="flex items-center gap-1 rounded-full bg-indigo-100 px-2.5 py-0.5 text-[11px] font-bold text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300">
            <Truck className="h-3 w-3" /> Đang giao hàng
          </span>
        );
      case 'completed':
        return (
          <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
            <CheckCircle2 className="h-3 w-3" /> Hoàn thành
          </span>
        );
      case 'cancelled':
        return (
          <span className="flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-0.5 text-[11px] font-bold text-rose-800 dark:bg-rose-950/60 dark:text-rose-300">
            <XCircle className="h-3 w-3" /> Đã hủy
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-300">
              <ShoppingBag className="h-4 w-4" />
            </span>
            <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
              Quản Lý Đơn Hàng & Khách Hàng (Social CRM)
            </h1>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Theo dõi toàn bộ đơn hàng chốt từ tin nhắn, bình luận và livestream trên Fanpage
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportCSV}
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
        >
          <Download className="h-4 w-4" />
          Xuất Danh Sách Excel (CSV)
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-850">
          <span className="text-xs font-medium text-slate-500">Doanh thu chốt đơn</span>
          <div className="mt-1.5 text-2xl font-black text-slate-900 dark:text-white">
            {totalRevenue.toLocaleString('vi-VN')} đ
          </div>
          <p className="mt-1 text-[11px] text-emerald-600 font-semibold">Tăng 35% qua chat</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-850">
          <span className="text-xs font-medium text-slate-500">Chờ xác nhận</span>
          <div className="mt-1.5 text-2xl font-black text-amber-600">
            {pendingCount}
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Cần nhân viên gọi chốt</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-850">
          <span className="text-xs font-medium text-slate-500">Đang vận chuyển</span>
          <div className="mt-1.5 text-2xl font-black text-indigo-600">
            {shippingCount}
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Đang bàn giao shipper</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-850">
          <span className="text-xs font-medium text-slate-500">Đã giao thành công</span>
          <div className="mt-1.5 text-2xl font-black text-emerald-600">
            {completedCount}
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Tỷ lệ phát đạt 96%</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-3 dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'all', label: `Tất cả (${pageOrders.length})` },
            { id: 'pending', label: 'Chờ xác nhận' },
            { id: 'confirmed', label: 'Đã xác nhận' },
            { id: 'shipping', label: 'Đang giao' },
            { id: 'completed', label: 'Hoàn thành' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id as any)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                statusFilter === tab.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm mã đơn, tên, SĐT..."
            className="w-full rounded-lg border border-slate-200 bg-white py-1.5 pl-8 pr-3 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden dark:border-slate-800 dark:bg-slate-850">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
            <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-800">
              <tr>
                <th className="py-3 px-4">Mã Đơn</th>
                <th className="py-3 px-4">Khách Hàng</th>
                <th className="py-3 px-4">Sản Phẩm</th>
                <th className="py-3 px-4">Tổng Tiền COD</th>
                <th className="py-3 px-4">Trạng Thái</th>
                <th className="py-3 px-4">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Không có đơn hàng nào
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="py-3 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                      #{order.code}
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 dark:text-white">
                        {order.customerName}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Phone className="h-3 w-3" /> {order.customerPhone}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate max-w-xs">
                        {order.customerAddress}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800 dark:text-slate-200">
                        {order.productName}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        SL: {order.quantity} x {order.price.toLocaleString('vi-VN')} đ
                      </div>
                    </td>

                    <td className="py-3 px-4 font-bold text-emerald-600 dark:text-emerald-400">
                      {order.totalAmount.toLocaleString('vi-VN')} đ
                      <div className="text-[10px] text-slate-400 font-normal">
                        ({order.paymentMethod})
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      {getStatusBadge(order.status)}
                    </td>

                    <td className="py-3 px-4">
                      <select
                        value={order.status}
                        onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as OrderStatus)}
                        className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-800 font-medium focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                      >
                        <option value="pending">Chờ xác nhận</option>
                        <option value="confirmed">Đã xác nhận</option>
                        <option value="shipping">Đang giao hàng</option>
                        <option value="completed">Hoàn thành</option>
                        <option value="cancelled">Hủy đơn</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

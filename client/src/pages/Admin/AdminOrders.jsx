import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  Truck, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Edit3, 
  X, 
  MapPin,
  ChevronLeft,
  ChevronRight,
  Eye
} from 'lucide-react';
import api from '../../services/api.js';
import toast from 'react-hot-toast';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });

  // Update Status Modal State
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [statusNotes, setStatusNotes] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // View Details Modal
  const [viewOrderDetails, setViewOrderDetails] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.set('status', statusFilter);
      if (search.trim()) params.set('search', search.trim());
      params.set('page', page.toString());
      params.set('limit', '15');

      const res = await api.get(`/admin/orders?${params.toString()}`);
      if (res.success) {
        setOrders(res.orders || []);
        setPagination({ total: res.pagination.total, totalPages: res.pagination.totalPages });
      }
    } catch (err) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, search, page]);

  const handleOpenStatusModal = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setStatusNotes('');
    setIsModalOpen(true);
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedOrder) return;

    try {
      setSubmitting(true);
      const res = await api.patch(`/admin/orders/${selectedOrder.id}/status`, {
        status: newStatus,
        notes: statusNotes || undefined,
      });

      if (res.success) {
        toast.success(res.message);
        setIsModalOpen(false);
        fetchOrders();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update status');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusPill = (st) => {
    switch (st) {
      case 'Placed':
        return <span className="bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold px-2.5 py-1 rounded-xl">Placed</span>;
      case 'Confirmed':
        return <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-bold px-2.5 py-1 rounded-xl">Confirmed</span>;
      case 'Packed':
        return <span className="bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold px-2.5 py-1 rounded-xl">Packed</span>;
      case 'Out for Delivery':
        return <span className="bg-purple-50 text-purple-700 border border-purple-200 text-xs font-bold px-2.5 py-1 rounded-xl flex items-center gap-1"><Truck className="w-3.5 h-3.5" /> Out for Delivery</span>;
      case 'Delivered':
        return <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-2.5 py-1 rounded-xl flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Delivered</span>;
      case 'Cancelled':
        return <span className="bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold px-2.5 py-1 rounded-xl">Cancelled</span>;
      default:
        return <span className="bg-slate-100 text-slate-700 text-xs font-bold px-2.5 py-1 rounded-xl">{st}</span>;
    }
  };

  const statusOptions = ['Placed', 'Confirmed', 'Packed', 'Out for Delivery', 'Delivered', 'Cancelled'];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Order Fulfilment & Delivery Dispatch
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Control order pipeline status transitions (drives customer live tracking)
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2 overflow-x-auto scrollbar-none">
        {['all', 'Placed', 'Confirmed', 'Packed', 'Out for Delivery', 'Delivered', 'Cancelled'].map((st) => (
          <button
            key={st}
            onClick={() => {
              setStatusFilter(st);
              setPage(1);
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap capitalize ${
              statusFilter === st
                ? 'bg-slate-900 text-white shadow'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {st === 'all' ? 'All Orders' : st}
          </button>
        ))}
      </div>

      {/* Search Input */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by Order ID, customer name, or email..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs pl-8 focus:outline-none focus:border-emerald-500"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-xs text-slate-400">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-500">No orders found matching the filter.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-400 font-bold uppercase border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Customer Details</th>
                  <th className="py-3 px-4">Delivery Slot</th>
                  <th className="py-3 px-4">Items</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Current Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4 font-black text-slate-900">
                      #{o.id}
                      <p className="text-[10px] text-slate-400 font-mono">
                        {new Date(o.createdAt).toLocaleDateString()}
                      </p>
                    </td>

                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-900">{o.customerName}</p>
                      <p className="text-[11px] text-slate-500">{o.customerEmail}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{o.customerPhone || 'No phone'}</p>
                    </td>

                    <td className="py-3 px-4 text-slate-700">
                      <p className="font-bold">{o.slot?.date}</p>
                      <p className="text-[11px] text-slate-500">{o.slot?.window || o.slot?.startTime}</p>
                    </td>

                    <td className="py-3 px-4 font-semibold text-slate-700">
                      {o.itemCount} items
                    </td>

                    <td className="py-3 px-4 font-black text-slate-900 font-mono">
                      ${Number(o.total).toFixed(2)}
                    </td>

                    <td className="py-3 px-4">
                      <span className="uppercase text-[10px] font-bold text-slate-600 block">
                        {o.paymentMethod}
                      </span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md ${
                        o.paymentStatus === 'paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {o.paymentStatus}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      {getStatusPill(o.status)}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewOrderDetails(o)}
                          className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
                          title="View order snapshot"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenStatusModal(o)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-xl transition text-[11px] flex items-center gap-1"
                        >
                          <Edit3 className="w-3 h-3" /> Update Status
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Showing Page {page} of {pagination.totalPages}</span>
            <div className="flex gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="p-1.5 border border-slate-200 rounded-lg disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={page >= pagination.totalPages}
                className="p-1.5 border border-slate-200 rounded-lg disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Status Update Modal */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  Update Status: Order #{selectedOrder.id}
                </h3>
                <p className="text-xs text-slate-400">Customer: {selectedOrder.customerName}</p>
              </div>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleUpdateStatus} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Select New Order Status
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {statusOptions.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setNewStatus(opt)}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition text-left ${
                        newStatus === opt
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/20 shadow-sm'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Status Timeline Note (Visible to Customer)
                </label>
                <input
                  type="text"
                  value={statusNotes}
                  onChange={(e) => setStatusNotes(e.target.value)}
                  placeholder="e.g. Order packed in cold bags by warehouse staff / Driver assigned"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {newStatus === 'Cancelled' && (
                <p className="text-xs text-rose-600 font-bold bg-rose-50 p-2.5 rounded-xl border border-rose-200">
                  ⚠️ Note: Marking this order as Cancelled will automatically restore product stock into inventory and release the booked slot.
                </p>
              )}

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2 rounded-xl shadow-md shadow-emerald-600/20"
                >
                  {submitting ? 'Updating...' : 'Save & Publish Status'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Order Details Snapshot Modal */}
      {viewOrderDetails && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900">
                Order #{viewOrderDetails.id} Details Snapshot
              </h3>
              <button onClick={() => setViewOrderDetails(null)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1">
                <p className="font-bold text-slate-900">Customer: {viewOrderDetails.customerName}</p>
                <p className="text-slate-500">Address: {viewOrderDetails.address?.line1}, {viewOrderDetails.address?.city} {viewOrderDetails.address?.pincode}</p>
                <p className="text-slate-500">Slot: {viewOrderDetails.slot?.date} ({viewOrderDetails.slot?.window || viewOrderDetails.slot?.startTime})</p>
              </div>

              <div>
                <p className="font-bold text-slate-700 mb-2 uppercase tracking-wider">Ordered Items</p>
                <div className="max-h-48 overflow-y-auto divide-y divide-slate-100 border border-slate-100 rounded-xl p-2">
                  {viewOrderDetails.items?.map((it) => (
                    <div key={it.id} className="py-2 flex items-center justify-between">
                      <span>{it.quantity}x {it.name_snapshot} ({it.unit_snapshot})</span>
                      <span className="font-bold font-mono">${(it.price_snapshot * it.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-2 font-bold text-sm">
                <span>Total Amount:</span>
                <span className="text-emerald-700 font-black">${Number(viewOrderDetails.total).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

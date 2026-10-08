import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Clock, 
  MapPin, 
  Calendar, 
  XCircle, 
  RefreshCw, 
  Receipt, 
  CheckCircle2, 
  AlertCircle, 
  Truck,
  CreditCard,
  Banknote,
  ShieldCheck
} from 'lucide-react';
import { getOrderById, cancelOrder } from '../services/dataService.js';
import { useCart } from '../context/CartContext.jsx';
import OrderStatusTimeline from '../components/OrderStatusTimeline.jsx';
import RescheduleModal from '../components/RescheduleModal.jsx';
import toast from 'react-hot-toast';

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, refreshCart, setIsCartOpen } = useCart();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const data = await getOrderById(id);
      if (data) {
        setOrder(data);
      }
    } catch (err) {
      toast.error(err.message || 'Order not found');
      navigate('/orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order? Warehouse stock will be restored.')) return;

    try {
      await cancelOrder(id);
      toast.success('Order cancelled successfully');
      fetchOrder();
    } catch (err) {
      toast.error(err.message || 'Failed to cancel order');
    }
  };

  const handleReorder = async () => {
    try {
      if (order && order.items) {
        for (const item of order.items) {
          addToCart({
            id: item.product_id || item.id,
            name: item.name_snapshot || item.name,
            price: item.price_snapshot || item.price,
            unit: item.unit_snapshot || item.unit,
            image_url: item.image_snapshot || item.image_url,
            stock: 50
          }, item.quantity || 1);
        }
        toast.success('Items added to cart!', { icon: '🛒' });
        setIsCartOpen(true);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to reorder');
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm animate-pulse space-y-6">
          <div className="h-6 w-48 bg-slate-200 rounded"></div>
          <div className="h-24 bg-slate-100 rounded-2xl"></div>
          <div className="h-48 bg-slate-100 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/orders"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-emerald-600 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to My Orders
        </Link>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2">
          {order.isReschedulable && order.status !== 'Cancelled' && (
            <button
              onClick={() => setIsRescheduleOpen(true)}
              className="bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold px-3.5 py-2 rounded-xl border border-slate-300 shadow-sm transition flex items-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5 text-emerald-600" /> Reschedule Slot
            </button>
          )}

          {order.isCancellable && (
            <button
              onClick={handleCancelOrder}
              className="bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold px-3.5 py-2 rounded-xl border border-rose-200 transition flex items-center gap-1.5"
            >
              <XCircle className="w-3.5 h-3.5" /> Cancel Order
            </button>
          )}

          <button
            onClick={handleReorder}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md shadow-emerald-600/20 transition flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reorder All Items
          </button>
        </div>
      </div>

      {/* Main Order Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-8">
        {/* Order Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Order #{order.id}
              </h1>
              <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold px-3 py-0.5 rounded-full">
                {order.status}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              Placed on {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400 block">Total Amount</span>
            <span className="text-2xl font-black text-emerald-700">
              ${Number(order.total).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Live Delivery Tracking Timeline */}
        <div className="bg-slate-50/80 border border-slate-200/80 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Truck className="w-4 h-4 text-emerald-600" /> Live Delivery Tracking
            </h3>
            {order.slot?.window && (
              <span className="text-xs font-semibold text-slate-600 bg-white border border-slate-200 px-2.5 py-1 rounded-lg">
                Slot: {order.slot.date} ({order.slot.window})
              </span>
            )}
          </div>

          <OrderStatusTimeline status={order.status} history={order.history || []} />
        </div>

        {/* Delivery & Schedule Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs uppercase tracking-wider text-emerald-800">
              <MapPin className="w-4 h-4 text-emerald-600" /> Delivery Address
            </div>
            <div className="text-slate-700 space-y-0.5 leading-relaxed">
              <p className="font-bold text-slate-900 text-sm">{order.address?.label} Delivery</p>
              <p>{order.address?.line1}</p>
              {order.address?.line2 && <p>{order.address?.line2}</p>}
              <p>{order.address?.city}, {order.address?.state} - {order.address?.pincode}</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs uppercase tracking-wider text-emerald-800">
              <Clock className="w-4 h-4 text-emerald-600" /> Slot & Payment
            </div>
            <div className="text-slate-700 space-y-1 leading-relaxed">
              <p>
                <strong>Delivery Date:</strong> {order.slot?.date}
              </p>
              <p>
                <strong>Time Window:</strong> {order.slot?.window || order.slot?.startTime}
              </p>
              <p className="pt-1 border-t border-slate-100 flex items-center gap-2">
                <strong>Payment:</strong>
                <span className="capitalize font-bold text-slate-900">
                  {order.paymentMethod === 'online' ? 'Prepaid Online' : 'Cash on Delivery'}
                </span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.2 rounded-full uppercase">
                  {order.paymentStatus}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Itemized Invoice Table */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-base text-slate-900">Itemized Invoice</h3>
          </div>

          <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100">
            {order.items?.map((item) => (
              <div key={item.id} className="p-4 flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={item.image_snapshot || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=100&auto=format&fit=crop&q=80'}
                    alt={item.name_snapshot}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-100 bg-slate-50"
                  />
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{item.name_snapshot}</h4>
                    <p className="text-slate-400">{item.unit_snapshot || '1 unit'}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-bold text-slate-500">
                    {item.quantity} x ${Number(item.price_snapshot).toFixed(2)}
                  </span>
                  <p className="font-black text-slate-900 text-sm">
                    ${(Number(item.price_snapshot) * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Receipt Breakdown */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-2 text-xs text-slate-600 max-w-sm ml-auto">
            <div className="flex justify-between">
              <span>Items Subtotal</span>
              <span className="font-bold text-slate-900">${Number(order.subtotal).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              {order.deliveryFee === 0 ? (
                <span className="font-bold text-emerald-600">FREE</span>
              ) : (
                <span className="font-bold text-slate-900">${Number(order.deliveryFee).toFixed(2)}</span>
              )}
            </div>
            <div className="flex justify-between">
              <span>Taxes (5%)</span>
              <span className="font-bold text-slate-900">${Number(order.tax).toFixed(2)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-200 text-base font-black text-slate-900">
              <span>Total Paid / Payable</span>
              <span className="text-emerald-700">${Number(order.total).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reschedule Modal */}
      <RescheduleModal
        isOpen={isRescheduleOpen}
        onClose={() => setIsRescheduleOpen(false)}
        orderId={order.id}
        currentSlot={order.slot}
        onSuccess={fetchOrder}
      />
    </div>
  );
}

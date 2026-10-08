import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Package, 
  Clock, 
  ChevronRight, 
  RefreshCw, 
  XCircle, 
  MapPin, 
  CheckCircle2, 
  Truck, 
  ShoppingBag
} from 'lucide-react';
import { getOrders, cancelOrder } from '../services/dataService.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import EmptyState from '../components/EmptyState.jsx';
import toast from 'react-hot-toast';

export default function MyOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterTab, setFilterTab] = useState('all'); // 'all' | 'active' | 'completed' | 'cancelled'
  const { addToCart, refreshCart, setIsCartOpen } = useCart();
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getOrders(user?.id);
      setOrders(data || []);
    } catch (err) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const handleReorder = async (orderId) => {
    try {
      const order = orders.find(o => String(o.id) === String(orderId));
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
        toast.success('Items added to your cart!', { icon: '🛒' });
        setIsCartOpen(true);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to reorder');
    }
  };

  const handleCancel = async (orderId) => {
    if (!window.confirm(`Are you sure you want to cancel Order #${orderId}?`)) return;

    try {
      await cancelOrder(orderId);
      toast.success('Order cancelled successfully');
      fetchOrders();
    } catch (err) {
      toast.error(err.message || 'Failed to cancel order');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
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
        return <span className="bg-slate-100 text-slate-700 text-xs font-bold px-2.5 py-1 rounded-xl">{status}</span>;
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (filterTab === 'active') {
      return ['Placed', 'Confirmed', 'Packed', 'Out for Delivery'].includes(order.status);
    }
    if (filterTab === 'completed') {
      return order.status === 'Delivered';
    }
    if (filterTab === 'cancelled') {
      return order.status === 'Cancelled';
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Title */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            My Orders & Delivery History
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Track live deliveries, review past grocery orders, reschedule slots or reorder
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2 overflow-x-auto scrollbar-none">
        {[
          { key: 'all', label: `All Orders (${orders.length})` },
          { key: 'active', label: `Active Deliveries (${orders.filter((o) => ['Placed', 'Confirmed', 'Packed', 'Out for Delivery'].includes(o.status)).length})` },
          { key: 'completed', label: `Completed (${orders.filter((o) => o.status === 'Delivered').length})` },
          { key: 'cancelled', label: `Cancelled (${orders.filter((o) => o.status === 'Cancelled').length})` },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilterTab(tab.key)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              filterTab === tab.key
                ? 'bg-slate-900 text-white shadow'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Order Cards List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm animate-pulse h-40"></div>
          ))}
        </div>
      ) : filteredOrders.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No Orders Found"
          description={
            filterTab === 'active'
              ? 'You currently have no active deliveries.'
              : 'You have not placed any orders yet.'
          }
          actionText="Shop Groceries Now"
          actionLink="/products"
        />
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const isCancellable = ['Placed', 'Confirmed'].includes(order.status);

            return (
              <div
                key={order.id}
                className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-md transition space-y-4"
              >
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="font-black text-slate-900 text-sm">
                      Order #{order.id}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-500">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {getStatusBadge(order.status)}
                  </div>
                </div>

                {/* Body Content */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  {/* Item preview thumbnails */}
                  <div className="md:col-span-6 space-y-2">
                    <div className="flex items-center gap-2 overflow-x-auto pb-1">
                      {order.previewItems?.map((it, idx) => (
                        <div key={idx} className="relative flex-shrink-0" title={it.name_snapshot}>
                          <img
                            src={it.image_snapshot || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=100&auto=format&fit=crop&q=80'}
                            alt={it.name_snapshot}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-100 bg-slate-50"
                          />
                          <span className="absolute -bottom-1 -right-1 bg-slate-900 text-white text-[9px] font-bold px-1 rounded-md">
                            x{it.quantity}
                          </span>
                        </div>
                      ))}
                      {order.itemCount > 4 && (
                        <span className="text-xs font-bold text-slate-400 bg-slate-100 w-10 h-10 rounded-xl flex items-center justify-center">
                          +{order.itemCount - 4}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 font-medium truncate">
                      {order.previewItems?.map((it) => `${it.quantity}x ${it.name_snapshot}`).join(', ')}
                    </p>
                  </div>

                  {/* Slot & Address details */}
                  <div className="md:col-span-3 text-xs space-y-1 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-1.5 font-bold text-slate-900">
                      <Clock className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{order.slot?.date || 'Today'}</span>
                    </div>
                    <p className="text-slate-500 font-medium">
                      {order.slot?.window || order.slot?.startTime || '2-Hour Slot'}
                    </p>
                  </div>

                  {/* Price & Action CTA */}
                  <div className="md:col-span-3 text-right flex flex-col md:items-end justify-between gap-3">
                    <div>
                      <span className="text-xs text-slate-400">Total Amount</span>
                      <p className="text-lg font-black text-slate-900 leading-tight font-display">
                        ₹{Number(order.total).toFixed(2)}
                      </p>
                      <span className="text-[10px] font-bold uppercase text-slate-500">
                        {order.paymentMethod === 'online' ? 'Prepaid Online' : 'Cash on Delivery'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    {isCancellable && (
                      <button
                        type="button"
                        onClick={() => handleCancel(order.id)}
                        className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200 font-bold transition flex items-center gap-1"
                      >
                        <XCircle className="w-3.5 h-3.5" /> Cancel Order
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleReorder(order.id)}
                      className="text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 px-3 py-1.5 rounded-xl border border-slate-200 font-bold transition flex items-center gap-1"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> Reorder All
                    </button>
                  </div>

                  <Link
                    to={`/orders/${order.id}`}
                    className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold px-4 py-2 rounded-xl shadow-sm transition flex items-center gap-1"
                  >
                    Track Status & Details <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

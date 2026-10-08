import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  DollarSign, 
  ShoppingBag, 
  Package, 
  AlertTriangle, 
  TrendingUp, 
  Users, 
  ChevronRight, 
  Plus, 
  CheckCircle2, 
  Clock,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import api from '../../services/api.js';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/stats');
      if (res.success) {
        setStats(res.stats);
      }
    } catch (err) {
      toast.error('Failed to load admin metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleQuickRestock = async (productId, currentStock) => {
    try {
      const res = await api.patch(`/products/${productId}/stock`, {
        stock: currentStock + 20
      });
      if (res.success) {
        toast.success(`Restocked +20 units for ${res.product.name}!`);
        loadStats();
      }
    } catch (err) {
      toast.error('Failed to restock product');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-64 bg-slate-200 rounded"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-white rounded-3xl p-5 border border-slate-200"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const statusColors = {
    Placed: '#3b82f6',
    Confirmed: '#6366f1',
    Packed: '#f59e0b',
    'Out for Delivery': '#8b5cf6',
    Delivered: '#10b981',
    Cancelled: '#f43f5e',
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Store Performance & Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Real-time grocery revenue, order fulfilment metrics, and warehouse inventory
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/orders"
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md shadow-emerald-600/20 transition flex items-center gap-1.5"
          >
            <ShoppingBag className="w-4 h-4" /> Manage Orders
          </Link>
          <Link
            to="/admin/products"
            className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-1.5"
          >
            <Package className="w-4 h-4" /> Add Product
          </Link>
        </div>
      </div>

      {/* 1. Key Metrics Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Revenue</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900">
            ${stats.totalRevenue.toFixed(2)}
          </p>
          <p className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +${stats.todayRevenue.toFixed(2)} today
          </p>
        </div>

        {/* Total Orders */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Orders</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900">
            {stats.totalOrders}
          </p>
          <p className="text-[11px] text-slate-500 font-semibold">
            {stats.todayOrders} orders placed today
          </p>
        </div>

        {/* Active Catalog Items */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Products</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900">
            {stats.totalProducts}
          </p>
          <p className="text-[11px] text-slate-500 font-semibold">
            Across {stats.totalCategories} categories
          </p>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Low Stock Alerts</span>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold ${
              stats.lowStockCount > 0 ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'
            }`}>
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-amber-600">
            {stats.lowStockCount}
          </p>
          <p className="text-[11px] text-slate-500 font-semibold">
            Items under 10 units threshold
          </p>
        </div>
      </div>

      {/* 2. Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 7-Day Revenue Trend Area Chart */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-900">7-Day Revenue Growth</h3>
              <p className="text-xs text-slate-400">Daily gross revenue across all delivery slots</p>
            </div>
            <span className="bg-emerald-50 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-xl">
              USD ($)
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.last7Days} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} />
                <Tooltip 
                  formatter={(val) => [`$${Number(val).toFixed(2)}`, 'Revenue']}
                  contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '12px', border: 'none', fontSize: '12px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#10b981" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#revenueGrad)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Orders by Status Bar Chart */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
          <div>
            <h3 className="font-bold text-base text-slate-900">Orders by Status</h3>
            <p className="text-xs text-slate-400">Current active pipeline</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.ordersByStatus} layout="vertical" margin={{ top: 0, right: 15, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis type="category" dataKey="status" tick={{ fontSize: 10, fill: '#334155' }} tickLine={false} width={85} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '12px', fontSize: '12px' }} />
                <Bar dataKey="count" radius={[0, 8, 8, 0]}>
                  {stats.ordersByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={statusColors[entry.status] || '#10b981'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 3. Low Stock Alerts & Quick Restock Table */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-base text-slate-900">Low Stock Inventory Alerts</h3>
          </div>
          <Link
            to="/admin/products"
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700"
          >
            View All Products
          </Link>
        </div>

        {stats.lowStockProducts.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <p className="font-bold">All products have healthy inventory levels (&gt; 10 units)!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-400 font-bold uppercase border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4">Product Name</th>
                  <th className="py-2.5 px-4">Category</th>
                  <th className="py-2.5 px-4">Unit Price</th>
                  <th className="py-2.5 px-4">Current Stock</th>
                  <th className="py-2.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stats.lowStockProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4 font-bold text-slate-900">{p.name}</td>
                    <td className="py-3 px-4 text-slate-500">{p.category_name}</td>
                    <td className="py-3 px-4 font-mono font-bold">${p.price.toFixed(2)}</td>
                    <td className="py-3 px-4">
                      <span className="bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-md font-bold">
                        {p.stock} units left
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleQuickRestock(p.id, p.stock)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg transition text-[11px]"
                      >
                        + Restock 20
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 4. Recent Orders Table */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-base text-slate-900">Recent Customer Orders</h3>
          </div>
          <Link
            to="/admin/orders"
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
          >
            All Orders <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-400 font-bold uppercase border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-4">Order ID</th>
                <th className="py-2.5 px-4">Customer</th>
                <th className="py-2.5 px-4">Delivery Slot</th>
                <th className="py-2.5 px-4">Total</th>
                <th className="py-2.5 px-4">Payment</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {stats.recentOrders.map((o) => (
                <tr key={o.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-4 font-black text-slate-900">#{o.id}</td>
                  <td className="py-3 px-4">
                    <p className="font-bold text-slate-800">{o.customer_name}</p>
                    <p className="text-[11px] text-slate-400">{o.customer_email}</p>
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {o.slot?.date} ({o.slot?.window || o.slot?.startTime})
                  </td>
                  <td className="py-3 px-4 font-black text-slate-900 font-mono">
                    ${Number(o.total).toFixed(2)}
                  </td>
                  <td className="py-3 px-4 uppercase text-[10px] font-bold text-slate-600">
                    {o.payment_method} ({o.payment_status})
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-slate-100 text-slate-800">
                      {o.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Link
                      to="/admin/orders"
                      className="text-emerald-600 font-bold hover:underline"
                    >
                      Update Status
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Layers, 
  ShoppingBag, 
  Clock, 
  Store, 
  LogOut, 
  ShieldCheck, 
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Overview & Stats', path: '/admin', icon: LayoutDashboard },
    { label: 'Order Management', path: '/admin/orders', icon: ShoppingBag },
    { label: 'Product Catalog', path: '/admin/products', icon: Package },
    { label: 'Categories', path: '/admin/categories', icon: Layers },
    { label: 'Delivery Slots', path: '/admin/slots', icon: Clock },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-white flex-shrink-0 flex flex-col justify-between border-r border-slate-800">
        <div>
          {/* Brand */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold">
                <Store className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-black text-white">
                  Fresh<span className="text-emerald-400">Cart</span>
                </span>
                <span className="text-[10px] text-emerald-400 font-bold block -mt-1 tracking-wider uppercase">
                  Admin Portal
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Profile & Exit to Store */}
        <div className="p-4 border-t border-slate-800 space-y-3">
          <Link
            to="/"
            className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 hover:text-emerald-300 py-2.5 px-3 rounded-xl text-xs font-bold transition border border-slate-700"
          >
            <Store className="w-3.5 h-3.5" /> Return to Customer Store
          </Link>

          <div className="flex items-center justify-between px-2 pt-2 text-xs">
            <div className="truncate">
              <p className="font-bold text-white truncate">{user?.name}</p>
              <p className="text-[11px] text-slate-500">Administrator</p>
            </div>
            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="text-slate-400 hover:text-rose-400 p-1 rounded-lg"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto max-w-7xl">
        <Outlet />
      </main>
    </div>
  );
}

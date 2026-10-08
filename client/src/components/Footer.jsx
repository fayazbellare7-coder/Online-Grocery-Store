import React from 'react';
import { Link } from 'react-router-dom';
import { Store, ShieldCheck, Truck, RefreshCw, Headphones, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Value Prop Highlights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 border-b border-slate-800">
          <div className="flex items-start gap-3">
            <div className="p-3 bg-emerald-950/60 border border-emerald-800/50 rounded-2xl text-emerald-400">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Scheduled Delivery</h4>
              <p className="text-xs text-slate-400 mt-0.5">Pick exact 2-hr convenient time slots</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-3 bg-emerald-950/60 border border-emerald-800/50 rounded-2xl text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">100% Farm Fresh</h4>
              <p className="text-xs text-slate-400 mt-0.5">Handpicked organic produce daily</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-3 bg-emerald-950/60 border border-emerald-800/50 rounded-2xl text-emerald-400">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Easy Rescheduling</h4>
              <p className="text-xs text-slate-400 mt-0.5">Cancel or reschedule anytime before delivery</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-3 bg-emerald-950/60 border border-emerald-800/50 rounded-2xl text-emerald-400">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Instant Support</h4>
              <p className="text-xs text-slate-400 mt-0.5">Dedicated customer care assistance</p>
            </div>
          </div>
        </div>

        {/* Links & Info */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 py-12 border-b border-slate-800 text-sm">
          <div className="col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-emerald-400 flex items-center justify-center text-slate-950 font-bold">
                <Store className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                Fresh<span className="text-emerald-400">Cart</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              FreshCart is your neighborhood digital grocery store offering farm-fresh organic produce, dairy, bakery, snacks, and daily household essentials delivered in guaranteed time slots.
            </p>
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 rounded-full text-emerald-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Service Active in Springfield, OR
              </span>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-4">Categories</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><Link to="/products?category=fruits-vegetables" className="hover:text-emerald-400 transition">Fruits & Vegetables</Link></li>
              <li><Link to="/products?category=dairy-eggs" className="hover:text-emerald-400 transition">Dairy & Eggs</Link></li>
              <li><Link to="/products?category=bakery-bread" className="hover:text-emerald-400 transition">Bakery & Bread</Link></li>
              <li><Link to="/products?category=snacks-munchies" className="hover:text-emerald-400 transition">Snacks & Munchies</Link></li>
              <li><Link to="/products?category=beverages" className="hover:text-emerald-400 transition">Beverages</Link></li>
              <li><Link to="/products?category=staples-grains" className="hover:text-emerald-400 transition">Staples & Grains</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-4">Customer Care</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><Link to="/orders" className="hover:text-emerald-400 transition">Track Your Order</Link></li>
              <li><Link to="/profile" className="hover:text-emerald-400 transition">Saved Addresses</Link></li>
              <li><Link to="/wishlist" className="hover:text-emerald-400 transition">Wishlist</Link></li>
              <li><Link to="/cart" className="hover:text-emerald-400 transition">Shopping Cart</Link></li>
              <li><span className="text-slate-500">FAQ & Returns</span></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-4">Demo Credentials</h4>
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 text-[11px] space-y-2">
              <div>
                <p className="text-slate-400">Admin Account:</p>
                <p className="font-mono text-emerald-400">admin@freshcart.com</p>
                <p className="font-mono text-slate-300">Admin@123</p>
              </div>
              <div className="border-t border-slate-700/60 pt-1.5">
                <p className="text-slate-400">Customer Account:</p>
                <p className="font-mono text-emerald-400">user@freshcart.com</p>
                <p className="font-mono text-slate-300">User@123</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} FreshCart Inc. All rights reserved. Demo Ready Grocery Web App.</p>
          <p className="flex items-center gap-1 text-slate-400">
            Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for Hackathon Demo
          </p>
        </div>
      </div>
    </footer>
  );
}

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Store, ShieldCheck, Truck, RefreshCw, Headphones, Heart, ArrowRight, Check, Sparkles } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 3000);
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#041a14] text-slate-300 pt-16 pb-12 border-t border-emerald-900/60 relative overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Value Prop Highlights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-14 border-b border-emerald-900/50">
          <div className="flex items-start gap-3.5">
            <div className="p-3.5 bg-emerald-900/40 border border-emerald-700/50 rounded-2xl text-emerald-400 flex-shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-display font-bold text-white text-sm">2-Hour Scheduled Slots</h4>
              <p className="text-xs text-slate-400 mt-1 leading-snug">Pick your exact window for guaranteed delivery</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-3.5 bg-emerald-900/40 border border-emerald-700/50 rounded-2xl text-emerald-400 flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-display font-bold text-white text-sm">100% Farm Fresh</h4>
              <p className="text-xs text-slate-400 mt-1 leading-snug">Inspected organic produce packed daily</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-3.5 bg-emerald-900/40 border border-emerald-700/50 rounded-2xl text-emerald-400 flex-shrink-0">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-display font-bold text-white text-sm">Easy Rescheduling</h4>
              <p className="text-xs text-slate-400 mt-1 leading-snug">Change delivery slot with 1-click anytime</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-3.5 bg-emerald-900/40 border border-emerald-700/50 rounded-2xl text-emerald-400 flex-shrink-0">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-display font-bold text-white text-sm">Concierge Support</h4>
              <p className="text-xs text-slate-400 mt-1 leading-snug">Real humans ready to assist with orders</p>
            </div>
          </div>
        </div>

        {/* Links & Newsletter */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 py-14 border-b border-emerald-900/50 text-sm">
          
          {/* Brand and Newsletter (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-emerald-500/20">
                <Store className="w-5 h-5 text-slate-950" />
              </div>
              <span className="text-2xl font-display font-black tracking-tight text-white">
                Fresh<span className="text-emerald-400">Cart</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Your neighborhood digital organic grocery store. Farm-fresh vegetables, organic milk, bakery sourdough, and artisan pantry essentials delivered in temperature-controlled vans.
            </p>

            {/* Newsletter form */}
            <div className="pt-2">
              <p className="text-xs font-bold text-slate-200 mb-2">Subscribe for weekly farm harvest alerts:</p>
              <form onSubmit={handleSubscribe} className="flex max-w-sm">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email..."
                  required
                  className="bg-emerald-950/70 border border-emerald-800/80 rounded-l-2xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 flex-1"
                />
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2.5 rounded-r-2xl transition flex items-center gap-1 shadow-md"
                >
                  {subscribed ? <Check className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </button>
              </form>
            </div>
          </div>

          {/* Categories (2 cols) */}
          <div className="md:col-span-2">
            <h4 className="font-display font-bold text-white text-xs uppercase tracking-wider mb-4">Aisles</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><Link to="/products?category=fruits-vegetables" className="hover:text-emerald-400 transition">🍎 Fruits & Veggies</Link></li>
              <li><Link to="/products?category=dairy-eggs" className="hover:text-emerald-400 transition">🥛 Dairy & Farm Eggs</Link></li>
              <li><Link to="/products?category=bakery-bread" className="hover:text-emerald-400 transition">🍞 Bakery & Sourdough</Link></li>
              <li><Link to="/products?category=snacks-munchies" className="hover:text-emerald-400 transition">🥨 Organic Snacks</Link></li>
              <li><Link to="/products?category=beverages" className="hover:text-emerald-400 transition">🧃 Cold-Pressed Juices</Link></li>
              <li><Link to="/products?category=staples-grains" className="hover:text-emerald-400 transition">🌾 Grains & Pantry</Link></li>
            </ul>
          </div>

          {/* Customer links (2 cols) */}
          <div className="md:col-span-2">
            <h4 className="font-display font-bold text-white text-xs uppercase tracking-wider mb-4">Account</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><Link to="/orders" className="hover:text-emerald-400 transition">📦 Track Your Order</Link></li>
              <li><Link to="/profile" className="hover:text-emerald-400 transition">📍 Delivery Addresses</Link></li>
              <li><Link to="/wishlist" className="hover:text-emerald-400 transition">❤️ Saved Wishlist</Link></li>
              <li><Link to="/cart" className="hover:text-emerald-400 transition">🛒 Shopping Cart</Link></li>
              <li><Link to="/products?deals=true" className="hover:text-emerald-400 transition">🔥 Flash Deals %</Link></li>
            </ul>
          </div>

          {/* Quick Demo (3 cols) */}
          <div className="md:col-span-3">
            <h4 className="font-display font-bold text-white text-xs uppercase tracking-wider mb-4">Demo Credentials</h4>
            <div className="bg-emerald-950/60 p-3.5 rounded-2xl border border-emerald-800/60 text-[11px] space-y-2.5 shadow-sm">
              <div>
                <p className="text-emerald-300 font-bold">Admin Account:</p>
                <p className="font-mono text-white">admin@freshcart.com</p>
                <p className="font-mono text-slate-400">Admin@123</p>
              </div>
              <div className="border-t border-emerald-800/60 pt-2">
                <p className="text-emerald-300 font-bold">Customer Account:</p>
                <p className="font-mono text-white">user@freshcart.com</p>
                <p className="font-mono text-slate-400">User@123</p>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} FreshCart Organic Market. Built for High-Converting E-Commerce.</p>
          <p className="flex items-center gap-1.5 text-slate-400 font-medium">
            Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> & Organic Passion
          </p>
        </div>
      </div>
    </footer>
  );
}


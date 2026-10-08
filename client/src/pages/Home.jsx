import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  Truck, 
  Clock, 
  ShieldCheck, 
  Leaf, 
  Award, 
  ChevronRight, 
  CheckCircle2, 
  ShoppingBag,
  Percent
} from 'lucide-react';
import api from '../services/api.js';
import ProductCard from '../components/ProductCard.jsx';
import ProductGridSkeleton from '../components/ProductGridSkeleton.jsx';

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [dealProducts, setDealProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHomeData() {
      try {
        setLoading(true);
        const [catsRes, dealsRes, featRes] = await Promise.all([
          api.get('/categories'),
          api.get('/products?deals=true&limit=8'),
          api.get('/products?sort=popular&limit=8')
        ]);

        if (catsRes.success) setCategories(catsRes.categories || []);
        if (dealsRes.success) setDealProducts(dealsRes.products || []);
        if (featRes.success) setFeaturedProducts(featRes.products || []);
      } catch (err) {
        console.error('Failed to load home data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadHomeData();
  }, []);

  return (
    <div className="space-y-12 pb-16">
      {/* 1. Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-950 text-white rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-4 shadow-xl border border-emerald-700/40">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-12 md:py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/30 px-3.5 py-1.5 rounded-full text-xs font-semibold text-emerald-200">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>100% Organic & Farm Fresh Guaranteed</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
              Fresh Groceries <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-amber-200">
                Delivered in Time Slots
              </span>
            </h1>

            <p className="text-emerald-100/90 text-sm sm:text-base max-w-xl leading-relaxed">
              Order farm-fresh vegetables, organic milk, bakery bread, pantry staples, and daily essentials. Choose your exact delivery window for guaranteed freshness.
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-3 text-xs text-emerald-100 font-medium pt-2">
              <span className="flex items-center gap-1.5 bg-emerald-800/80 px-3 py-1.5 rounded-xl border border-emerald-700/50">
                <Clock className="w-3.5 h-3.5 text-emerald-400" /> 2-Hour Delivery Slots
              </span>
              <span className="flex items-center gap-1.5 bg-emerald-800/80 px-3 py-1.5 rounded-xl border border-emerald-700/50">
                <Truck className="w-3.5 h-3.5 text-emerald-400" /> Free Shipping above $35
              </span>
              <span className="flex items-center gap-1.5 bg-emerald-800/80 px-3 py-1.5 rounded-xl border border-emerald-700/50">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Doorstep Handover
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3.5 pt-4">
              <Link
                to="/products"
                className="bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-black text-sm px-7 py-3.5 rounded-2xl shadow-lg shadow-emerald-500/25 transition-smooth flex items-center gap-2"
              >
                Shop All Groceries <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/products?deals=true"
                className="bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-600/40 text-emerald-100 font-bold text-sm px-6 py-3.5 rounded-2xl transition-smooth flex items-center gap-2"
              >
                <Percent className="w-4 h-4 text-amber-400" /> Explore Daily Deals
              </Link>
            </div>
          </div>

          {/* Hero Side Card */}
          <div className="lg:col-span-5 hidden lg:block">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-3xl shadow-2xl text-white space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-400 text-slate-900 flex items-center justify-center font-black text-xs">
                    ⚡
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">Today's Delivery Slot</h3>
                    <p className="text-[11px] text-emerald-200">Springfield, OR (97477)</p>
                  </div>
                </div>
                <span className="bg-emerald-400/20 text-emerald-200 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-400/30">
                  Open Now
                </span>
              </div>

              {/* Sample Slot Items */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-emerald-950/50 p-2.5 rounded-xl border border-emerald-800/60">
                  <span className="text-[10px] text-emerald-300 uppercase block font-semibold">Morning</span>
                  <span className="font-bold">08:00 - 10:00 AM</span>
                </div>
                <div className="bg-emerald-950/50 p-2.5 rounded-xl border border-emerald-800/60">
                  <span className="text-[10px] text-emerald-300 uppercase block font-semibold">Midday</span>
                  <span className="font-bold">10:00 - 12:00 PM</span>
                </div>
                <div className="bg-emerald-500 text-slate-950 p-2.5 rounded-xl font-bold shadow">
                  <span className="text-[10px] uppercase block font-black opacity-80">Next Fast Slot</span>
                  <span>04:00 - 06:00 PM</span>
                </div>
                <div className="bg-emerald-950/50 p-2.5 rounded-xl border border-emerald-800/60">
                  <span className="text-[10px] text-emerald-300 uppercase block font-semibold">Night</span>
                  <span className="font-bold">06:00 - 08:00 PM</span>
                </div>
              </div>

              <div className="bg-white/5 p-3 rounded-2xl border border-white/10 flex items-center gap-3">
                <Leaf className="w-8 h-8 text-emerald-300 flex-shrink-0" />
                <p className="text-xs text-emerald-100">
                  Organic farm produce harvested at <strong>5:00 AM</strong>, delivered directly to your doorstep today.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Category Showcase Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Explore by Category
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Browse through our fresh farm collections and daily pantry goods
            </p>
          </div>
          <Link
            to="/products"
            className="text-xs sm:text-sm font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition"
          >
            All Categories <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3 sm:gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/products?category=${cat.slug}`}
              className="group bg-white border border-slate-200/80 hover:border-emerald-500 rounded-2xl p-3 text-center transition-smooth hover:shadow-lg hover:shadow-emerald-600/5 flex flex-col items-center justify-between"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden mb-2.5 bg-slate-50 border border-slate-100">
                <img
                  src={cat.image || 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=300&auto=format&fit=crop&q=80'}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-smooth"
                />
              </div>
              <div>
                <h3 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-emerald-600 transition leading-tight">
                  {cat.name}
                </h3>
                <span className="text-[11px] text-slate-400 mt-0.5 block">
                  {cat.product_count ? `${cat.product_count} items` : 'Fresh stock'}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Daily Deals Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-teal-500/10 p-5 sm:p-7 rounded-3xl border border-amber-200/60 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-md shadow-amber-500/30">
                <Percent className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  Deals of the Day <span className="bg-amber-100 text-amber-900 text-xs font-bold px-2 py-0.5 rounded-lg">Up to 20% OFF</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  Save on fresh seasonal essentials and pantry bestsellers
                </p>
              </div>
            </div>

            <Link
              to="/products?deals=true"
              className="text-xs sm:text-sm font-bold bg-white text-slate-900 hover:text-emerald-600 border border-slate-200 px-4 py-2 rounded-xl shadow-sm hover:border-emerald-500 transition"
            >
              View All Deals ({dealProducts.length})
            </Link>
          </div>

          {loading ? (
            <ProductGridSkeleton count={4} />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {dealProducts.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. Popular & Farm Fresh Picks */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              Popular Groceries <Sparkles className="w-5 h-5 text-emerald-500" />
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Most loved essentials by families in your neighborhood
            </p>
          </div>
          <Link
            to="/products"
            className="text-xs sm:text-sm font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition"
          >
            Explore Catalog <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <ProductGridSkeleton count={8} />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* 5. Why Choose FreshCart Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-800">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-emerald-400 font-bold text-xs uppercase tracking-widest">
              The FreshCart Promise
            </span>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight mt-1">
              Why Customers Love FreshCart
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              We redesigned the modern online grocery experience from farm sourcing to scheduled home delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-800/80 border border-slate-700/70 p-6 rounded-2xl space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-white">Guaranteed 2-Hour Delivery Slots</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Choose morning, midday, evening, or night slots up to 7 days ahead. No waiting around all day for couriers.
              </p>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/70 p-6 rounded-2xl space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <Leaf className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-white">Direct-from-Farm Organic Sourcing</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Hand-harvested vegetables, cage-free dairy, and stone-ground grains. Inspected for 100% freshness before packing.
              </p>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/70 p-6 rounded-2xl space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-white">No-Questions-Asked Rescheduling</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Plans changed? Easily reschedule your delivery slot or cancel with automatic instant refunds before dispatch.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

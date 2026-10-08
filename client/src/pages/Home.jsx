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
  Percent,
  Flame,
  Star,
  Check,
  Plus,
  Copy,
  UtensilsCrossed,
  HeartHandshake,
  Zap
} from 'lucide-react';
import { getCategories, getProducts } from '../services/dataService.js';
import ProductCard from '../components/ProductCard.jsx';
import ProductGridSkeleton from '../components/ProductGridSkeleton.jsx';
import { useCart } from '../context/CartContext.jsx';

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [dealProducts, setDealProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState('slot-2');
  const [copiedCoupon, setCopiedCoupon] = useState(false);
  const [bundleAdded, setBundleAdded] = useState(false);

  const { addToCart } = useCart();

  // Countdown timer for Flash Deals
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 28, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 5, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    async function loadHomeData() {
      try {
        setLoading(true);
        const [cats, dealsRes, featRes] = await Promise.all([
          getCategories(),
          getProducts({ onSale: true, limit: 8 }),
          getProducts({ sort: 'featured', limit: 8 })
        ]);

        setCategories(cats || []);
        setDealProducts(dealsRes.products || []);
        setFeaturedProducts(featRes.products || []);
      } catch (err) {
        console.error('Failed to load home data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadHomeData();
  }, []);

  const handleCopyCoupon = () => {
    navigator.clipboard?.writeText('FRESH20');
    setCopiedCoupon(true);
    setTimeout(() => setCopiedCoupon(false), 2500);
  };

  const handleAddRecipeBundle = () => {
    // Add 3 staple breakfast items if available
    const avocados = featuredProducts.find(p => p.name.toLowerCase().includes('avocado')) || {
      id: 1, name: 'Organic Hass Avocados (Pack of 3)', price: 3.99, unit: '3 pcs', image_url: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=600&auto=format&fit=crop&q=80', stock: 25
    };
    const sourdough = featuredProducts.find(p => p.name.toLowerCase().includes('bread') || p.name.toLowerCase().includes('sourdough')) || {
      id: 4, name: 'Artisan Sourdough Bread Loaf', price: 4.50, unit: '500g', image_url: 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?w=600&auto=format&fit=crop&q=80', stock: 15
    };
    const eggs = featuredProducts.find(p => p.name.toLowerCase().includes('egg')) || {
      id: 3, name: 'Pasture-Raised Organic Eggs (Dozen)', price: 5.99, unit: '12 pcs', image_url: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=600&auto=format&fit=crop&q=80', stock: 30
    };

    addToCart(avocados, 1);
    addToCart(sourdough, 1);
    addToCart(eggs, 1);

    setBundleAdded(true);
    setTimeout(() => setBundleAdded(false), 3000);
  };

  return (
    <div className="space-y-16 pb-20">
      
      {/* 1. Flagship Hero Bento Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 sm:mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          
          {/* Main Hero Banner (7 cols) */}
          <div className="lg:col-span-7 relative overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 text-white rounded-[32px] p-7 sm:p-10 lg:p-12 shadow-2xl border border-emerald-700/50 flex flex-col justify-between">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/4 -mb-20 w-80 h-80 bg-teal-400/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-6">
              <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/40 px-4 py-1.5 rounded-full text-xs font-bold text-emerald-200 backdrop-blur-md shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>100% Certified Organic & Farm Direct</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-display font-black tracking-tight leading-[1.08]">
                Farm-Fresh Groceries <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-amber-200">
                  Delivered in Exact Slots
                </span>
              </h1>

              <p className="text-emerald-100/90 text-sm sm:text-base max-w-lg leading-relaxed font-medium">
                Hand-harvested vegetables, pasture-raised dairy, stone-ground bakery goods, and pantry staples. Select your guaranteed 2-hour delivery window.
              </p>

              {/* Value Props */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 text-xs pt-1">
                <div className="bg-emerald-900/60 border border-emerald-700/60 p-2.5 rounded-2xl">
                  <p className="font-extrabold text-amber-300 text-sm sm:text-base font-display">⚡ 2 Hours</p>
                  <p className="text-emerald-200 text-[11px] font-medium leading-tight">Express delivery</p>
                </div>
                <div className="bg-emerald-900/60 border border-emerald-700/60 p-2.5 rounded-2xl">
                  <p className="font-extrabold text-emerald-300 text-sm sm:text-base font-display">🌱 100%</p>
                  <p className="text-emerald-200 text-[11px] font-medium leading-tight">Organic certified</p>
                </div>
                <div className="bg-emerald-900/60 border border-emerald-700/60 p-2.5 rounded-2xl">
                  <p className="font-extrabold text-teal-300 text-sm sm:text-base font-display">❄️ Cold-Chain</p>
                  <p className="text-emerald-200 text-[11px] font-medium leading-tight">Chilled vans</p>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="relative z-10 flex flex-wrap items-center gap-3.5 pt-8 mt-auto">
              <Link
                to="/products"
                className="bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-black text-sm px-7 py-4 rounded-2xl shadow-xl shadow-emerald-500/30 transition-all duration-200 flex items-center gap-2 group"
              >
                Shop All Groceries 
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/products?deals=true"
                className="bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-600/50 text-emerald-100 font-bold text-sm px-6 py-4 rounded-2xl transition-all duration-200 flex items-center gap-2"
              >
                <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
                Explore Daily Deals
              </Link>
            </div>
          </div>

          {/* Right Hero Bento Cards (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            
            {/* Bento Card 1: Interactive Live Delivery Slot Selector */}
            <div className="bg-white border border-slate-200/90 rounded-[32px] p-6 shadow-card hover:border-emerald-400 transition-all duration-300 flex-1">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">Today's Delivery Windows</h3>
                    <p className="text-xs text-slate-500 font-medium">Springfield, OR • Next driver ready</p>
                  </div>
                </div>
                <span className="badge-organic">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Live
                </span>
              </div>

              {/* Slot Cards */}
              <div className="grid grid-cols-2 gap-2.5 mt-4">
                {[
                  { id: 'slot-1', label: 'Morning Slot', time: '08:00 – 10:00 AM', status: 'Booked' },
                  { id: 'slot-2', label: 'Express Afternoon', time: '02:00 – 04:00 PM', status: 'Fastest' },
                  { id: 'slot-3', label: 'Prime Evening', time: '04:00 – 06:00 PM', status: 'Filling Fast' },
                  { id: 'slot-4', label: 'Night Delivery', time: '06:00 – 08:00 PM', status: 'Open' }
                ].map((slot) => (
                  <button
                    key={slot.id}
                    onClick={() => setSelectedSlot(slot.id)}
                    disabled={slot.status === 'Booked'}
                    className={`p-3 rounded-2xl border text-left transition-all duration-200 ${
                      slot.status === 'Booked'
                        ? 'bg-slate-50 border-slate-200 opacity-60 cursor-not-allowed'
                        : selectedSlot === slot.id
                        ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20 shadow-sm'
                        : 'bg-white border-slate-200 hover:border-emerald-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        {slot.label}
                      </span>
                      {slot.status === 'Fastest' && (
                        <span className="bg-amber-100 text-amber-800 text-[9px] font-black px-1.5 py-0.5 rounded">
                          ⚡ 2h
                        </span>
                      )}
                    </div>
                    <p className="font-extrabold text-xs text-slate-900">{slot.time}</p>
                  </button>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1.5 font-medium">
                  <Truck className="w-4 h-4 text-emerald-600" /> Free with orders &gt; $35
                </span>
                <span className="font-bold text-emerald-700">100% On-Time Guarantee</span>
              </div>
            </div>

            {/* Bento Card 2: 1-Click Breakfast Recipe Bundle Spotlight */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50/70 border border-amber-200/80 rounded-[32px] p-6 shadow-card hover:border-amber-400 transition-all duration-300">
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-amber-900 bg-amber-200/80 px-2.5 py-1 rounded-full">
                  <UtensilsCrossed className="w-3.5 h-3.5" /> Chef's Breakfast Bundle
                </span>
                <span className="text-xs font-bold text-amber-800 line-through">$14.48</span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div>
                  <h4 className="font-display font-black text-slate-900 text-base">
                    Avocado & Sourdough Kit
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5 font-medium">
                    Organic Avocados + Artisan Sourdough + Farm Eggs
                  </p>
                  <p className="text-lg font-black text-emerald-700 font-display mt-1">
                    $12.49 <span className="text-xs text-slate-500 font-normal">for all 3 items</span>
                  </p>
                </div>

                <button
                  onClick={handleAddRecipeBundle}
                  className={`px-4 py-2.5 rounded-2xl font-extrabold text-xs flex items-center gap-1.5 transition-all duration-200 shadow-md ${
                    bundleAdded 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-amber-500 hover:bg-amber-600 text-slate-950 active:scale-95 shadow-amber-500/20'
                  }`}
                >
                  {bundleAdded ? (
                    <>
                      <Check className="w-4 h-4" /> Added!
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 stroke-[3]" /> 1-Click Add
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 2. Interactive Flash Deals Banner with Live Countdown */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 text-white rounded-[32px] p-6 sm:p-8 shadow-xl border border-emerald-700/60 relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 relative z-10">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-amber-400/20">
                <Flame className="w-6 h-6 fill-slate-950" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-display font-black tracking-tight text-white">
                    Flash Deals of the Day
                  </h2>
                  <span className="bg-amber-400 text-slate-950 font-extrabold text-xs px-2.5 py-0.5 rounded-full shadow-xs">
                    Up to 25% OFF
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-emerald-200 font-medium">
                  Fresh seasonal picks on discount while stocks last
                </p>
              </div>
            </div>

            {/* Countdown Box */}
            <div className="flex items-center gap-2 bg-emerald-950/90 border border-emerald-700/80 px-4 py-2 rounded-2xl">
              <span className="text-xs text-emerald-300 font-semibold uppercase tracking-wider">Ends in:</span>
              <div className="flex items-center gap-1 font-mono font-black text-amber-300 text-sm sm:text-base">
                <span className="bg-emerald-900 px-2 py-1 rounded-lg border border-emerald-700">
                  {String(timeLeft.hours).padStart(2, '0')}h
                </span>
                <span>:</span>
                <span className="bg-emerald-900 px-2 py-1 rounded-lg border border-emerald-700">
                  {String(timeLeft.minutes).padStart(2, '0')}m
                </span>
                <span>:</span>
                <span className="bg-emerald-900 px-2 py-1 rounded-lg border border-emerald-700">
                  {String(timeLeft.seconds).padStart(2, '0')}s
                </span>
              </div>
            </div>
          </div>

          {/* Deals Cards */}
          {loading ? (
            <ProductGridSkeleton count={4} />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 relative z-10">
              {dealProducts.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 3. Category Showcase Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-emerald-600 font-extrabold text-xs uppercase tracking-widest block">
              Curated Aisles
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-black text-slate-900 tracking-tight">
              Shop by Category
            </h2>
          </div>
          <Link
            to="/products"
            className="text-xs sm:text-sm font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 transition group"
          >
            All Categories <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3.5 sm:gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/products?category=${cat.slug}`}
              className="group bg-white border border-slate-200/80 hover:border-emerald-500/60 rounded-3xl p-3.5 text-center transition-all duration-300 hover:shadow-card-hover flex flex-col items-center justify-between"
            >
              <div className="w-20 h-20 rounded-2xl overflow-hidden mb-3 bg-slate-50 border border-slate-100 relative">
                <img
                  src={cat.image || 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=300&auto=format&fit=crop&q=80'}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                />
              </div>
              <div>
                <h3 className="font-display font-bold text-xs sm:text-sm text-slate-900 group-hover:text-emerald-600 transition leading-tight">
                  {cat.name}
                </h3>
                <span className="text-[11px] font-semibold text-slate-400 mt-1 block">
                  {cat.product_count ? `${cat.product_count} products` : 'Fresh In Stock'}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Popular & Farm Fresh Picks */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-emerald-600 font-extrabold text-xs uppercase tracking-widest block">
              Bestsellers
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-black text-slate-900 tracking-tight flex items-center gap-2">
              Popular in Your Neighborhood <Sparkles className="w-5 h-5 text-amber-400" />
            </h2>
          </div>
          <Link
            to="/products"
            className="text-xs sm:text-sm font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 transition group"
          >
            Explore Full Catalog <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <ProductGridSkeleton count={8} />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* 5. "Why FreshCart" Bento Trust Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-[36px] p-8 sm:p-12 lg:p-14 shadow-2xl border border-slate-800 relative overflow-hidden">
          {/* Ambient Glows */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-emerald-400 font-extrabold text-xs uppercase tracking-widest">
              The FreshCart Difference
            </span>
            <h2 className="text-2xl sm:text-4xl font-display font-black tracking-tight mt-1 text-white">
              Sustainably Farmed. Exactly Delivered.
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 font-medium">
              We redesigned the modern online grocery experience from soil harvest to scheduled doorstep handover.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-800/80 border border-slate-700/80 p-7 rounded-3xl space-y-4 hover:border-emerald-500/50 transition-colors">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <Clock className="w-7 h-7" />
              </div>
              <h3 className="font-display font-black text-lg text-white">Guaranteed 2-Hour Slots</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-medium">
                Choose your exact 2-hour delivery window up to 7 days in advance. No waiting around all day for couriers.
              </p>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 p-7 rounded-3xl space-y-4 hover:border-emerald-500/50 transition-colors">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <Leaf className="w-7 h-7" />
              </div>
              <h3 className="font-display font-black text-lg text-white">100% Farm-Direct Sourcing</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-medium">
                Produce harvested fresh every morning from local organic family farms with cold-chain temperature control.
              </p>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 p-7 rounded-3xl space-y-4 hover:border-emerald-500/50 transition-colors">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <Award className="w-7 h-7" />
              </div>
              <h3 className="font-display font-black text-lg text-white">1-Click Slot Reschedule</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-medium">
                Plans changed? Easily reschedule your delivery slot or cancel with zero hassle and instant automated refunds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Verified Community Reviews */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-emerald-600 font-extrabold text-xs uppercase tracking-widest">
            Loved By Families
          </span>
          <h2 className="text-2xl sm:text-3xl font-display font-black text-slate-900 tracking-tight mt-1">
            What Our Shoppers Say
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: 'Sarah Jenkins',
              role: 'Verified Organic Buyer',
              text: 'The 2-hour delivery slot is a game changer! Strawberries and avocados arrived in pristine shape, perfectly ripe.',
              rating: 5,
              date: '2 days ago'
            },
            {
              name: 'David Chen',
              role: 'Weekly Subscriber',
              text: 'Best bakery sourdough and pasture-raised eggs in town. Rescheduling when I was stuck in traffic took just one tap.',
              rating: 5,
              date: 'Yesterday'
            },
            {
              name: 'Elena Rostova',
              role: 'Family Chef',
              text: 'Everything is packed cold in insulated eco-boxes. I love that I can track the delivery driver right to my porch.',
              rating: 5,
              date: '3 days ago'
            }
          ].map((rev, idx) => (
            <div 
              key={idx}
              className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                  "{rev.text}"
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100 text-xs">
                <div>
                  <p className="font-bold text-slate-900">{rev.name}</p>
                  <p className="text-emerald-700 font-semibold text-[11px]">{rev.role}</p>
                </div>
                <span className="text-slate-400 text-[11px]">{rev.date}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Interactive VIP Promo Code Voucher */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 text-white rounded-[32px] p-8 sm:p-10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="bg-emerald-900/60 border border-emerald-400/40 text-emerald-200 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Exclusive Welcome Offer
            </span>
            <h3 className="text-2xl sm:text-3xl font-display font-black tracking-tight text-white">
              Get 20% OFF Your First Organic Order
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm max-w-md font-medium">
              Use code at checkout for orders over $35. Includes complimentary chilled cold-chain delivery.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white text-slate-900 p-2 rounded-2xl shadow-lg">
            <span className="font-mono font-black text-lg px-4 tracking-wider text-emerald-800">
              FRESH20
            </span>
            <button
              onClick={handleCopyCoupon}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors ${
                copiedCoupon 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800'
              }`}
            >
              {copiedCoupon ? (
                <>
                  <Check className="w-3.5 h-3.5" /> Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> Copy Code
                </>
              )}
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}


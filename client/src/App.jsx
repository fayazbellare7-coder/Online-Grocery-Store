import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, 
  Search, 
  MapPin, 
  Clock, 
  Store, 
  Tag, 
  Flame, 
  Plus, 
  Minus, 
  Trash2, 
  X, 
  CheckCircle2, 
  Truck, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Phone, 
  User, 
  Package, 
  CreditCard,
  Copy,
  Check,
  Star
} from 'lucide-react';
import { categories, deliverySlots, defaultProducts } from './data.js';
import { getProducts, placeOrder, getSavedOrders } from './supabase.js';

export default function App() {
  // Products & Filter state
  const [products, setProducts] = useState(defaultProducts);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [dealsOnly, setDealsOnly] = useState(false);

  // Cart state
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('freshcart_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [copiedCoupon, setCopiedCoupon] = useState(false);

  // Checkout & Orders state
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [pastOrders, setPastOrders] = useState([]);
  const [placedOrder, setPlacedOrder] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(deliverySlots[0].id);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    pincode: ''
  });
  const [submittingOrder, setSubmittingOrder] = useState(false);

  // Load products from Supabase on mount
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
      setLoading(false);
      setPastOrders(getSavedOrders());
    }
    loadData();
  }, []);

  // Sync cart with localStorage
  useEffect(() => {
    localStorage.setItem('freshcart_cart', JSON.stringify(cart));
  }, [cart]);

  // Cart helper functions
  const getItemQty = (productId) => {
    const item = cart.find(i => i.id === productId);
    return item ? item.quantity : 0;
  };

  const addToCart = (product) => {
    const finalPrice = product.discount_percent > 0 
      ? Math.round(product.price * (1 - product.discount_percent / 100) * 100) / 100 
      : product.price;

    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...product, finalPrice, quantity: 1 }];
    });
  };

  const updateQuantity = (productId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(i => i.id === productId ? { ...i, quantity: newQty } : i));
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(i => i.id !== productId));
  };

  // Cart Calculations
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + (item.finalPrice * item.quantity), 0);
  const deliveryFee = subtotal >= 299 || subtotal === 0 ? 0 : 40;
  const discountAmount = appliedCoupon ? Math.round(subtotal * 0.20 * 100) / 100 : 0;
  const grandTotal = Math.max(0, subtotal - discountAmount + deliveryFee);

  const handleApplyCoupon = (e) => {
    e?.preventDefault();
    if (couponCode.trim().toUpperCase() === 'FRESH20') {
      setAppliedCoupon('FRESH20');
      setCouponCode('');
    } else {
      alert('Invalid code. Use FRESH20 for 20% OFF!');
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard?.writeText('FRESH20');
    setCopiedCoupon(true);
    setTimeout(() => setCopiedCoupon(false), 2000);
  };

  // Filter & Sort Products
  const filteredProducts = products.filter(p => {
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDeals = !dealsOnly || (p.discount_percent && p.discount_percent > 0);
    return matchesCat && matchesSearch && matchesDeals;
  }).sort((a, b) => {
    if (sortBy === 'price_asc') return a.price - b.price;
    if (sortBy === 'price_desc') return b.price - a.price;
    if (sortBy === 'discount') return (b.discount_percent || 0) - (a.discount_percent || 0);
    return a.id - b.id;
  });

  // Handle Order Placement
  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address) {
      alert('Please fill all required delivery details.');
      return;
    }

    setSubmittingOrder(true);
    const chosenSlot = deliverySlots.find(s => s.id === selectedSlot) || deliverySlots[0];
    
    const orderPayload = {
      customer_name: formData.name,
      customer_phone: formData.phone,
      customer_address: `${formData.address}, Pincode: ${formData.pincode || '574220'}`,
      delivery_slot: chosenSlot.label,
      payment_method: paymentMethod.toUpperCase(),
      items: cart,
      item_count: cartItemCount,
      subtotal,
      delivery_fee: deliveryFee,
      discount: discountAmount,
      total: grandTotal
    };

    const createdOrder = await placeOrder(orderPayload);
    setSubmittingOrder(false);
    setPlacedOrder(createdOrder);
    setPastOrders(getSavedOrders());
    setCart([]);
    setIsCheckoutOpen(false);
    setIsCartOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      
      {/* 1. Top Announcement Bar */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 text-white text-xs py-2 px-4 shadow-sm border-b border-emerald-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-500/40 text-[10px] uppercase flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              ⚡ 2-Hour Express
            </span>
            <span className="text-emerald-100">
              Free delivery on orders over <strong className="text-white">₹299</strong> | Use coupon <strong className="text-amber-300 font-mono">FRESH20</strong> for 20% OFF
            </span>
          </div>
          <button
            onClick={() => {
              setPastOrders(getSavedOrders());
              setIsOrdersOpen(true);
            }}
            className="flex items-center gap-1.5 bg-emerald-800/80 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-1 rounded-xl transition border border-emerald-600/50"
          >
            <Package className="w-3.5 h-3.5 text-emerald-300" />
            <span>My Orders ({pastOrders.length})</span>
          </button>
        </div>
      </div>

      {/* 2. Main Navbar */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4">
            
            {/* Brand Logo */}
            <div className="flex items-center gap-6">
              <div 
                onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
                className="flex items-center gap-2.5 cursor-pointer group"
              >
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
                  <Store className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-2xl font-black tracking-tight text-slate-900 leading-none">
                    Fresh<span className="text-emerald-600">Cart</span>
                  </span>
                  <span className="text-[10px] text-emerald-700 font-bold tracking-widest uppercase block mt-0.5">
                    Online Grocery Store
                  </span>
                </div>
              </div>

              {/* Delivery Location Indicator */}
              <div className="hidden lg:flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-3 py-1.5 text-xs text-left">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 leading-tight">Deliver to Springfield</p>
                  <p className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" /> Slot: Today 4–6 PM
                  </p>
                </div>
              </div>
            </div>

            {/* Live Search Bar */}
            <div className="flex-1 max-w-md relative hidden md:block">
              <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20">
                <Search className="w-4 h-4 text-slate-400 ml-3.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search fresh bananas, milk, bread, rice..."
                  className="w-full bg-transparent px-3 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="p-1.5 text-slate-400 hover:text-slate-600 mr-2">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Header Right: Cart Button */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsCartOpen(true)}
                className="flex items-center gap-3 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white px-4 py-2.5 rounded-2xl shadow-lg shadow-emerald-600/20 transition-all font-bold text-sm"
              >
                <div className="relative">
                  <ShoppingCart className="w-5 h-5" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-2.5 -right-2.5 bg-amber-400 text-slate-950 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                      {cartItemCount}
                    </span>
                  )}
                </div>
                <div className="text-left text-xs leading-tight hidden sm:block">
                  <p className="text-emerald-100 text-[10px] uppercase font-semibold">Cart Total</p>
                  <p className="font-extrabold text-white text-sm">
                    ₹{grandTotal.toFixed(2)}
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 3. Hero Promo Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 sm:mt-6 w-full">
        <div className="relative overflow-hidden bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-emerald-800">
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/40 px-3 py-1 rounded-full text-xs font-bold text-emerald-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>100% Farm Fresh & Organic Groceries</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Fresh Daily Groceries <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-amber-200">
                Delivered at Market Prices (₹)
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed font-medium">
              Crisp seasonal vegetables, dairy, farm eggs, artisanal breads, and pantry staples. Guaranteed 2-hour doorstep delivery.
            </p>

            {/* Coupon Code Pill */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="flex items-center gap-2 bg-emerald-900/90 border border-emerald-600/70 px-3.5 py-2 rounded-xl text-xs font-semibold">
                <span className="text-emerald-300">20% Flat Discount:</span>
                <span className="font-mono font-black text-amber-300 text-sm bg-black/30 px-2 py-0.5 rounded">FRESH20</span>
                <button
                  onClick={handleCopyCode}
                  className="hover:text-amber-300 text-emerald-200 transition p-1"
                  title="Copy code"
                >
                  {copiedCoupon ? <Check className="w-3.5 h-3.5 text-amber-300" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div className="flex items-center gap-4 text-xs text-emerald-200 font-bold">
                <span>⚡ 2-Hr Delivery</span>
                <span>🌱 100% Pure</span>
                <span>❄️ Cold-Chain Fresh</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Category Filter Buttons */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 w-full">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-2">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition whitespace-nowrap ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 scale-102'
                    : 'bg-white text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 border border-slate-200'
                }`}
              >
                <span className="text-base">{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 5. Search & Filter Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 w-full">
        <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-sm flex flex-wrap items-center justify-between gap-3">
          
          {/* Mobile Search */}
          <div className="w-full md:hidden relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search groceries..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs pl-8 focus:outline-none focus:border-emerald-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
            <span>Showing {filteredProducts.length} items</span>
            {selectedCategory !== 'all' && (
              <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-lg border border-emerald-200">
                {categories.find(c => c.id === selectedCategory)?.name}
              </span>
            )}
          </div>

          {/* Sort & Deal Toggles */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setDealsOnly(!dealsOnly)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                dealsOnly
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              Hot Deals %
            </button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="featured">Sort: Featured</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="discount">Biggest Discount</option>
            </select>
          </div>
        </div>
      </section>

      {/* 6. Product Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1">
        {loading ? (
          <div className="py-20 text-center text-slate-400 text-sm font-semibold">
            Loading fresh products...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center max-w-md mx-auto space-y-3">
            <Store className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-800 text-base">No products found</h3>
            <p className="text-xs text-slate-500">Try clearing your search query or selecting a different category.</p>
            <button
              onClick={() => { setSelectedCategory('all'); setSearchQuery(''); setDealsOnly(false); }}
              className="bg-emerald-600 text-white font-bold text-xs px-4 py-2 rounded-xl"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product) => {
              const qty = getItemQty(product.id);
              const finalPrice = product.discount_percent > 0 
                ? Math.round(product.price * (1 - product.discount_percent / 100) * 100) / 100 
                : product.price;

              return (
                <div 
                  key={product.id}
                  className="bg-white border border-slate-200/90 rounded-3xl p-3.5 sm:p-4 shadow-sm hover:shadow-md hover:border-emerald-400 transition-all flex flex-col justify-between"
                >
                  {/* Image & Discount Badge */}
                  <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-50 mb-3">
                    <img 
                      src={product.image_url} 
                      alt={product.name} 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" 
                      loading="lazy"
                    />
                    {product.discount_percent > 0 && (
                      <span className="absolute top-2 left-2 bg-amber-500 text-white font-black text-[10px] px-2 py-0.5 rounded-full shadow-xs">
                        {product.discount_percent}% OFF
                      </span>
                    )}
                  </div>

                  {/* Details */}
                  <div className="space-y-1 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-slate-500 mb-0.5">
                        <span className="text-emerald-700 font-bold uppercase tracking-wider text-[10px]">
                          {product.category_name}
                        </span>
                        <div className="flex items-center gap-0.5 font-bold text-slate-700">
                          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                          <span>{product.rating || '4.8'}</span>
                        </div>
                      </div>

                      <h3 className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-2 leading-snug">
                        {product.name}
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-0.5">{product.unit}</p>
                    </div>

                    {/* Price & Quantity Stepper */}
                    <div className="pt-3 mt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-base sm:text-lg font-black text-slate-900">
                            ₹{finalPrice.toFixed(2)}
                          </span>
                          {product.discount_percent > 0 && (
                            <span className="text-[11px] text-slate-400 line-through">
                              ₹{product.price.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>

                      {qty === 0 ? (
                        <button
                          onClick={() => addToCart(product)}
                          className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl transition flex items-center gap-1 shadow-sm"
                        >
                          <Plus className="w-3.5 h-3.5 stroke-[3]" /> Add
                        </button>
                      ) : (
                        <div className="flex items-center bg-emerald-600 text-white rounded-xl overflow-hidden font-bold text-xs shadow-sm">
                          <button
                            onClick={() => updateQuantity(product.id, qty - 1)}
                            className="px-2 py-1.5 hover:bg-emerald-700 transition"
                          >
                            <Minus className="w-3 h-3 stroke-[3]" />
                          </button>
                          <span className="px-2">{qty}</span>
                          <button
                            onClick={() => updateQuantity(product.id, qty + 1)}
                            className="px-2 py-1.5 hover:bg-emerald-700 transition"
                          >
                            <Plus className="w-3 h-3 stroke-[3]" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* 7. Slide-over Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-sm flex justify-end animate-in fade-in">
          <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between border-l border-slate-200">
            
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-emerald-600" />
                <h2 className="font-black text-slate-900 text-base">Your Grocery Cart ({cartItemCount})</h2>
              </div>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
              {cart.length === 0 ? (
                <div className="py-20 text-center space-y-3">
                  <ShoppingCart className="w-12 h-12 text-slate-300 mx-auto" />
                  <p className="font-bold text-slate-700 text-sm">Your cart is empty</p>
                  <p className="text-xs text-slate-400">Add fresh fruits, veggies, and groceries to proceed.</p>
                </div>
              ) : (
                <>
                  {/* Free delivery progress bar */}
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 text-xs">
                    {subtotal >= 299 ? (
                      <p className="font-bold text-emerald-800 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        You've unlocked <strong>FREE 2-Hour Delivery!</strong>
                      </p>
                    ) : (
                      <p className="text-emerald-900 font-medium">
                        Add <strong>₹{(299 - subtotal).toFixed(2)}</strong> more for <strong>FREE Delivery</strong>
                      </p>
                    )}
                  </div>

                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
                      <img src={item.image_url} alt={item.name} className="w-12 h-12 rounded-xl object-cover bg-white border" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-xs text-slate-900 truncate">{item.name}</h4>
                        <p className="text-[11px] text-slate-500 font-semibold">₹{item.finalPrice.toFixed(2)} / {item.unit}</p>
                      </div>

                      {/* Quantity Stepper */}
                      <div className="flex items-center bg-white border border-slate-200 rounded-xl overflow-hidden font-bold text-xs">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-1 text-slate-600 hover:bg-slate-100"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-slate-900">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-1 text-slate-600 hover:bg-slate-100"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-slate-400 hover:text-rose-500 p-1"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </>
              )}
            </div>

            {/* Footer Summary & Checkout Button */}
            {cart.length > 0 && (
              <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 space-y-3">
                {/* Coupon Box */}
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Coupon code (e.g. FRESH20)"
                    className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs uppercase font-mono focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="submit"
                    className="bg-slate-900 text-white text-xs font-bold px-3.5 py-2 rounded-xl hover:bg-slate-800"
                  >
                    Apply
                  </button>
                </form>

                {appliedCoupon && (
                  <div className="flex items-center justify-between text-xs bg-amber-50 text-amber-900 px-3 py-1.5 rounded-xl border border-amber-200 font-semibold">
                    <span>Coupon '{appliedCoupon}' Applied (20% OFF)</span>
                    <button onClick={() => setAppliedCoupon(null)} className="text-amber-800 font-bold hover:underline">Remove</button>
                  </div>
                )}

                {/* Price Breakdown */}
                <div className="space-y-1.5 text-xs text-slate-600 pt-1">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-slate-900">₹{subtotal.toFixed(2)}</span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex justify-between text-emerald-700 font-bold">
                      <span>Discount (20%)</span>
                      <span>-₹{discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span className="font-semibold text-slate-900">
                      {deliveryFee === 0 ? <strong className="text-emerald-600">FREE</strong> : `₹${deliveryFee.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-200">
                    <span>Total Amount</span>
                    <span className="text-emerald-700">₹{grandTotal.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setIsCheckoutOpen(true);
                  }}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white py-3 rounded-2xl font-bold text-sm shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-2"
                >
                  Proceed to Checkout <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 8. Checkout Modal */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-emerald-600" />
                <h3 className="font-black text-slate-900 text-base">Delivery Details & Checkout</h3>
              </div>
              <button onClick={() => setIsCheckoutOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCheckoutSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Pincode</label>
                  <input
                    type="text"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    placeholder="e.g. 574220"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Delivery Address *</label>
                <textarea
                  required
                  rows={2}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="House/Flat No., Apartment, Street, Landmark"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              {/* Delivery Slot Selector */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Choose Delivery Slot *</label>
                <div className="space-y-1.5">
                  {deliverySlots.map((slot) => (
                    <label 
                      key={slot.id} 
                      className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition ${
                        selectedSlot === slot.id 
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold' 
                          : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="slot"
                          checked={selectedSlot === slot.id}
                          onChange={() => setSelectedSlot(slot.id)}
                          className="accent-emerald-600"
                        />
                        <span>{slot.label}</span>
                      </div>
                      <span className="text-[10px] bg-white px-2 py-0.5 rounded border border-slate-200">Guaranteed</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Payment Method</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'cod', label: '💵 Cash on Delivery' },
                    { id: 'upi', label: '📱 Instant UPI' },
                    { id: 'card', label: '💳 Card Payment' }
                  ].map((pm) => (
                    <button
                      type="button"
                      key={pm.id}
                      onClick={() => setPaymentMethod(pm.id)}
                      className={`p-2.5 rounded-xl text-center text-xs font-bold border transition ${
                        paymentMethod === pm.id 
                          ? 'bg-slate-900 text-white border-slate-900' 
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {pm.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="bg-slate-100 p-3 rounded-xl flex items-center justify-between text-xs font-bold text-slate-900">
                <span>Total Amount Payable:</span>
                <span className="text-emerald-700 text-sm font-black">₹{grandTotal.toFixed(2)}</span>
              </div>

              <button
                type="submit"
                disabled={submittingOrder}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-xs shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submittingOrder ? 'Placing Order...' : `Confirm & Place Order (₹${grandTotal.toFixed(2)})`}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 9. Order Confirmation Modal */}
      {placedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 text-center space-y-4 border border-slate-100">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-black text-slate-900">Order Confirmed!</h3>
              <p className="text-xs text-slate-500">
                Thank you, <strong>{placedOrder.customer_name}</strong>. Your groceries will be delivered in your chosen slot.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left text-xs space-y-2">
              <div className="flex justify-between border-b border-slate-200/80 pb-2 font-bold">
                <span className="text-slate-500">Order ID:</span>
                <span className="text-slate-900 font-mono">{placedOrder.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Delivery Slot:</span>
                <span className="font-semibold text-slate-900">{placedOrder.delivery_slot}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total Items:</span>
                <span className="font-semibold text-slate-900">{placedOrder.item_count} items</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment Mode:</span>
                <span className="font-semibold text-slate-900">{placedOrder.payment_method}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 font-black text-sm">
                <span>Amount Paid:</span>
                <span className="text-emerald-700">₹{placedOrder.total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => setPlacedOrder(null)}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-md transition"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}

      {/* 10. Orders History Drawer */}
      {isOrdersOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-sm flex justify-end animate-in fade-in">
          <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between border-l border-slate-200">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-emerald-600" />
                <h2 className="font-black text-slate-900 text-base">Your Placed Orders</h2>
              </div>
              <button onClick={() => setIsOrdersOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {pastOrders.length === 0 ? (
                <div className="py-20 text-center space-y-2">
                  <Package className="w-12 h-12 text-slate-300 mx-auto" />
                  <p className="font-bold text-slate-700 text-sm">No orders yet</p>
                  <p className="text-xs text-slate-400">Your placed orders will show here for instant tracking.</p>
                </div>
              ) : (
                pastOrders.map((ord) => (
                  <div key={ord.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-slate-900">{ord.id}</span>
                      <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full text-[10px]">
                        {ord.status || 'Placed'}
                      </span>
                    </div>
                    <p className="text-slate-600 font-medium">Slot: {ord.delivery_slot}</p>
                    <p className="text-[11px] text-slate-500 truncate">Deliver to: {ord.customer_address}</p>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-200/80 font-bold">
                      <span className="text-slate-500">{ord.item_count || ord.items?.length || 1} items</span>
                      <span className="text-emerald-700 text-sm font-black">₹{Number(ord.total).toFixed(2)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50">
              <button
                onClick={() => setIsOrdersOpen(false)}
                className="w-full bg-slate-900 text-white font-bold py-2.5 rounded-xl text-xs"
              >
                Close Orders
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 11. Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-8 border-t border-slate-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-950 font-bold">
              <Store className="w-4 h-4 text-white" />
            </div>
            <span className="font-black text-white text-base">FreshCart</span>
            <span className="text-slate-500">| 100% Organic & Fresh Grocery Market</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400 font-semibold">
            <span>⚡ 2-Hour Delivery</span>
            <span>🛡️ Quality Assured</span>
            <span>🔒 Safe UPI/Cash Payments</span>
          </div>

          <p className="text-slate-500">© 2026 FreshCart Store. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

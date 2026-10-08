import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Minus, 
  Heart, 
  ShoppingCart, 
  Truck, 
  ShieldCheck, 
  Sparkles, 
  RotateCcw, 
  CheckCircle2, 
  ChevronRight,
  Leaf,
  Clock,
  Package
} from 'lucide-react';
import { getProductById, getProducts } from '../services/dataService.js';
import { useCart } from '../context/CartContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import ProductCard from '../components/ProductCard.jsx';
import toast from 'react-hot-toast';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, updateQuantity, getItemQuantity, items, setIsCartOpen } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        const prod = await getProductById(id);
        if (prod) {
          setProduct(prod);
          // fetch related products in same category
          const relRes = await getProducts({ category: prod.category_id || prod.category_slug, limit: 5 });
          setRelatedProducts((relRes.products || []).filter(p => String(p.id) !== String(id)).slice(0, 4));
          setQuantity(1);
        }
      } catch (err) {
        toast.error('Product not found');
        navigate('/products');
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-pulse">
          <div className="aspect-square bg-slate-200 rounded-3xl"></div>
          <div className="space-y-4">
            <div className="h-6 w-32 bg-slate-200 rounded"></div>
            <div className="h-8 w-3/4 bg-slate-200 rounded"></div>
            <div className="h-10 w-40 bg-slate-200 rounded"></div>
            <div className="h-24 w-full bg-slate-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const currentCartQty = getItemQuantity(product.id);
  const cartItem = items.find((i) => i.productId === product.id);
  const isWishlisted = isInWishlist(product.id);

  const finalPrice = product.final_price !== undefined 
    ? product.final_price 
    : Math.round(product.price * (1 - (product.discount_percent || 0) / 100) * 100) / 100;

  const savingsAmount = Math.round((product.price - finalPrice) * 100) / 100;

  const handleAddToCart = () => {
    if (product.stock <= 0) return;
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    if (product.stock <= 0) return;
    addToCart(product, quantity);
    setIsCartOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <Link to="/" className="hover:text-emerald-600 transition">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/products" className="hover:text-emerald-600 transition">Groceries</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to={`/products?category=${product.category_slug}`} className="hover:text-emerald-600 transition">
          {product.category_name}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-900 truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm">
        {/* Left: Product Image & Badges */}
        <div className="lg:col-span-6 relative flex flex-col items-center">
          <div className="w-full aspect-square bg-slate-50 rounded-3xl overflow-hidden border border-slate-100 relative shadow-inner">
            <img
              src={product.image_url || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80'}
              alt={product.name}
              className="w-full h-full object-cover"
            />

            {/* Discount Badge */}
            {product.discount_percent > 0 && (
              <div className="absolute top-4 left-4 bg-amber-500 text-slate-950 font-black text-xs px-3 py-1 rounded-xl shadow-md flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                {Math.round(product.discount_percent)}% OFF
              </div>
            )}

            {/* Wishlist Button */}
            <button
              onClick={() => toggleWishlist(product)}
              className={`absolute top-4 right-4 p-3 rounded-2xl transition-smooth ${
                isWishlisted
                  ? 'bg-rose-50 text-rose-500 shadow-md ring-2 ring-rose-200'
                  : 'bg-white/90 backdrop-blur-md text-slate-400 hover:text-rose-500 hover:bg-rose-50 shadow-md'
              }`}
              title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-500' : ''}`} />
            </button>
          </div>
        </div>

        {/* Right: Product Details & Purchase Actions */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Category and unit badge */}
            <div className="flex items-center gap-2">
              <span className="bg-emerald-50 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-lg border border-emerald-200/60 uppercase tracking-wide">
                {product.category_name}
              </span>
              <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-2.5 py-1 rounded-lg">
                Unit: {product.unit}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
              {product.name}
            </h1>

            {/* Price & Savings */}
            <div className="bg-slate-50 border border-slate-200/70 p-4 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block font-medium">Special Price</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-slate-900">
                    ${Number(finalPrice).toFixed(2)}
                  </span>
                  {product.discount_percent > 0 && (
                    <span className="text-base text-slate-400 line-through">
                      ${Number(product.price).toFixed(2)}
                    </span>
                  )}
                </div>
              </div>

              {product.discount_percent > 0 && (
                <div className="text-right">
                  <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-lg">
                    Save ${savingsAmount.toFixed(2)}
                  </span>
                </div>
              )}
            </div>

            {/* Stock Status Pill */}
            <div className="flex items-center gap-2">
              {product.stock > 10 ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  In Stock ({product.stock} units available)
                </span>
              ) : product.stock > 0 ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  Hurry, only {product.stock} units left!
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-3 py-1 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  Currently Out of Stock
                </span>
              )}
            </div>

            {/* Description */}
            <div className="text-slate-600 text-xs sm:text-sm leading-relaxed space-y-2">
              <p>{product.description}</p>
            </div>
          </div>

          {/* Delivery Callout */}
          <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 flex items-start gap-3">
            <Truck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs">
              <p className="font-bold text-emerald-950">Guaranteed Scheduled Delivery</p>
              <p className="text-emerald-800/80 mt-0.5">
                Pick your preferred 2-hour window during checkout. Free delivery above $35.
              </p>
            </div>
          </div>

          {/* Quantity Stepper & Add to Cart Actions */}
          <div className="space-y-3 pt-2">
            <div className="flex flex-wrap items-center gap-3">
              {/* Quantity Selector */}
              <div className="flex items-center bg-slate-100 border border-slate-200 rounded-2xl overflow-hidden p-1">
                <button
                  type="button"
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  disabled={quantity <= 1 || product.stock <= 0}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-700 hover:bg-white transition disabled:opacity-30"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-black text-slate-900 text-sm">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((prev) => Math.min(product.stock, prev + 1))}
                  disabled={quantity >= product.stock || product.stock <= 0}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-700 hover:bg-white transition disabled:opacity-30"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add to Basket Button */}
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white py-3 px-6 rounded-2xl font-bold text-sm shadow-lg shadow-emerald-600/25 transition flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-4 h-4" />
                {currentCartQty > 0 ? `Add More (${currentCartQty} in cart)` : 'Add to Basket'}
              </button>

              {/* Buy Now / Quick Checkout */}
              <button
                type="button"
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
                className="bg-slate-900 hover:bg-slate-800 text-white py-3 px-5 rounded-2xl font-bold text-sm transition active:scale-95 disabled:opacity-40"
              >
                View Basket
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Carousel */}
      {relatedProducts.length > 0 && (
        <section className="space-y-4 pt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              You Might Also Like in {product.category_name}
            </h2>
            <Link
              to={`/products?category=${product.category_slug}`}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700"
            >
              View All
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

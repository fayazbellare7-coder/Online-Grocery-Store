import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Filter, 
  X, 
  Search, 
  Sparkles, 
  SlidersHorizontal, 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  RotateCcw,
  ShoppingBag
} from 'lucide-react';
import api from '../services/api.js';
import ProductCard from '../components/ProductCard.jsx';
import ProductGridSkeleton from '../components/ProductGridSkeleton.jsx';
import EmptyState from '../components/EmptyState.jsx';
import CategoryBar from '../components/CategoryBar.jsx';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();

  // State from URL Params
  const querySearch = searchParams.get('search') || '';
  const queryCategory = searchParams.get('category') || '';
  const queryDeals = searchParams.get('deals') === 'true';
  const queryInStock = searchParams.get('inStock') === 'true';
  const queryMinPrice = searchParams.get('minPrice') || '';
  const queryMaxPrice = searchParams.get('maxPrice') || '';
  const querySort = searchParams.get('sort') || 'newest';
  const queryPage = parseInt(searchParams.get('page') || '1', 10);

  // Local state
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 12, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Form Filter State
  const [searchInput, setSearchInput] = useState(querySearch);
  const [selectedCat, setSelectedCat] = useState(queryCategory);
  const [dealsOnly, setDealsOnly] = useState(queryDeals);
  const [inStockOnly, setInStockOnly] = useState(queryInStock);
  const [minPrice, setMinPrice] = useState(queryMinPrice);
  const [maxPrice, setMaxPrice] = useState(queryMaxPrice);
  const [sortBy, setSortBy] = useState(querySort);

  // Sync state with URL
  useEffect(() => {
    setSearchInput(querySearch);
    setSelectedCat(queryCategory);
    setDealsOnly(queryDeals);
    setInStockOnly(queryInStock);
    setMinPrice(queryMinPrice);
    setMaxPrice(queryMaxPrice);
    setSortBy(querySort);
  }, [querySearch, queryCategory, queryDeals, queryInStock, queryMinPrice, queryMaxPrice, querySort]);

  // Fetch categories once
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await api.get('/categories');
        if (res.success) {
          setCategories(res.categories || []);
        }
      } catch (err) {
        console.error('Error loading categories:', err);
      }
    }
    loadCategories();
  }, []);

  // Fetch products when query params change
  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (querySearch) params.set('search', querySearch);
        if (queryCategory) params.set('category', queryCategory);
        if (queryDeals) params.set('deals', 'true');
        if (queryInStock) params.set('inStock', 'true');
        if (queryMinPrice) params.set('minPrice', queryMinPrice);
        if (queryMaxPrice) params.set('maxPrice', queryMaxPrice);
        if (querySort) params.set('sort', querySort);
        params.set('page', queryPage.toString());
        params.set('limit', '12');

        const res = await api.get(`/products?${params.toString()}`);
        if (res.success) {
          setProducts(res.products || []);
          setPagination(res.pagination || { total: 0, page: 1, limit: 12, totalPages: 1 });
        }
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [querySearch, queryCategory, queryDeals, queryInStock, queryMinPrice, queryMaxPrice, querySort, queryPage]);

  // Apply filters to URL
  const applyFilters = (overrides = {}) => {
    const next = {
      search: searchInput,
      category: selectedCat,
      deals: dealsOnly ? 'true' : '',
      inStock: inStockOnly ? 'true' : '',
      minPrice: minPrice,
      maxPrice: maxPrice,
      sort: sortBy,
      page: '1',
      ...overrides,
    };

    const params = new URLSearchParams();
    Object.entries(next).forEach(([key, val]) => {
      if (val !== undefined && val !== '' && val !== null) {
        params.set(key, val.toString());
      }
    });

    setSearchParams(params);
    setIsMobileFilterOpen(false);
  };

  const handleResetFilters = () => {
    setSearchInput('');
    setSelectedCat('');
    setDealsOnly(false);
    setInStockOnly(false);
    setMinPrice('');
    setMaxPrice('');
    setSortBy('newest');
    setSearchParams(new URLSearchParams());
    setIsMobileFilterOpen(false);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      const params = new URLSearchParams(searchParams);
      params.set('page', newPage.toString());
      setSearchParams(params);
    }
  };

  const activeCategoryObj = categories.find((c) => c.slug === queryCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Breadcrumb & Title */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {activeCategoryObj ? activeCategoryObj.name : querySearch ? `Search Results for "${querySearch}"` : queryDeals ? 'Today’s Hot Grocery Deals' : 'All Grocery Items'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Showing {pagination.total} organic items available for delivery
          </p>
        </div>

        {/* Sort and Filter Toggle for Mobile */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-1.5 bg-white border border-slate-300 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-bold shadow-sm"
          >
            <Filter className="w-4 h-4 text-emerald-600" /> Filters
          </button>

          <div className="flex items-center gap-2 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 shadow-sm">
            <span className="text-slate-400 font-normal">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                applyFilters({ sort: e.target.value });
              }}
              className="bg-transparent focus:outline-none cursor-pointer font-bold text-slate-900"
            >
              <option value="newest">Featured & Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="name_asc">Name: A to Z</option>
              <option value="discount_desc">Biggest Discount %</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
        </div>
      </div>

      {/* Horizontal Category Bar */}
      <CategoryBar
        activeSlug={queryCategory}
        onSelect={(slug) => {
          setSelectedCat(slug);
          applyFilters({ category: slug, page: '1' });
        }}
      />

      {/* Active Filter Chips */}
      {(querySearch || queryCategory || queryDeals || queryInStock || queryMinPrice || queryMaxPrice) && (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-bold text-slate-400">Active Filters:</span>
          {querySearch && (
            <span className="inline-flex items-center gap-1 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-2.5 py-1 rounded-lg">
              Search: "{querySearch}"
              <button onClick={() => applyFilters({ search: '' })}><X className="w-3 h-3" /></button>
            </span>
          )}
          {queryCategory && activeCategoryObj && (
            <span className="inline-flex items-center gap-1 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-2.5 py-1 rounded-lg">
              Category: {activeCategoryObj.name}
              <button onClick={() => applyFilters({ category: '' })}><X className="w-3 h-3" /></button>
            </span>
          )}
          {queryDeals && (
            <span className="inline-flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-900 text-xs px-2.5 py-1 rounded-lg">
              Deals Only
              <button onClick={() => applyFilters({ deals: '' })}><X className="w-3 h-3" /></button>
            </span>
          )}
          {queryInStock && (
            <span className="inline-flex items-center gap-1 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-2.5 py-1 rounded-lg">
              In-Stock Only
              <button onClick={() => applyFilters({ inStock: '' })}><X className="w-3 h-3" /></button>
            </span>
          )}
          {(queryMinPrice || queryMaxPrice) && (
            <span className="inline-flex items-center gap-1 bg-slate-100 border border-slate-200 text-slate-800 text-xs px-2.5 py-1 rounded-lg">
              Price: ${queryMinPrice || '0'} - ${queryMaxPrice || 'Max'}
              <button onClick={() => applyFilters({ minPrice: '', maxPrice: '' })}><X className="w-3 h-3" /></button>
            </span>
          )}
          <button
            onClick={handleResetFilters}
            className="text-xs text-rose-600 hover:underline font-bold ml-1 flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" /> Clear All
          </button>
        </div>
      )}

      {/* Main Layout: Sidebar Filters + Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-6 sticky top-28">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-emerald-600" /> Filter Groceries
            </h3>
            <button
              onClick={handleResetFilters}
              className="text-[11px] text-slate-400 hover:text-rose-600 font-semibold transition"
            >
              Reset
            </button>
          </div>

          {/* Search input in sidebar */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Search Keywords
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                placeholder="e.g. Milk, Apples, Bread"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs pl-8 focus:outline-none focus:border-emerald-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

          {/* Categories List */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Category
            </label>
            <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
              <button
                onClick={() => {
                  setSelectedCat('');
                  applyFilters({ category: '' });
                }}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between transition ${
                  selectedCat === '' ? 'bg-emerald-50 text-emerald-800' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>All Categories</span>
                {selectedCat === '' && <Check className="w-3.5 h-3.5 text-emerald-600" />}
              </button>
              {categories.map((cat) => {
                const isSelected = selectedCat === cat.slug;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCat(cat.slug);
                      applyFilters({ category: cat.slug });
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between transition ${
                      isSelected ? 'bg-emerald-50 text-emerald-800' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="truncate">{cat.name}</span>
                    <span className="text-[10px] text-slate-400 font-normal">({cat.product_count || 0})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Price Range ($)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                min="0"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="Min ($)"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs focus:outline-none focus:border-emerald-500"
              />
              <input
                type="number"
                min="0"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="Max ($)"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Quick Toggles */}
          <div className="space-y-2.5 pt-2 border-t border-slate-100">
            <label className="flex items-center justify-between cursor-pointer text-xs font-semibold text-slate-700">
              <span>In-Stock Only</span>
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => {
                  setInStockOnly(e.target.checked);
                  applyFilters({ inStock: e.target.checked ? 'true' : '' });
                }}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer text-xs font-semibold text-slate-700">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Discounted Deals
              </span>
              <input
                type="checkbox"
                checked={dealsOnly}
                onChange={(e) => {
                  setDealsOnly(e.target.checked);
                  applyFilters({ deals: e.target.checked ? 'true' : '' });
                }}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
              />
            </label>
          </div>

          {/* Apply button */}
          <button
            onClick={() => applyFilters()}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 rounded-xl shadow-md shadow-emerald-600/20 transition active:scale-95"
          >
            Apply Filters
          </button>
        </aside>

        {/* Product Grid & Results */}
        <main className="lg:col-span-3 space-y-6">
          {loading ? (
            <ProductGridSkeleton count={8} />
          ) : products.length === 0 ? (
            <EmptyState
              icon={ShoppingBag}
              title="No Groceries Found"
              description="We couldn't find any products matching your selected filters. Try broadening your search or resetting filters."
              actionText="Reset All Filters"
              onAction={handleResetFilters}
            />
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination Controls */}
              {pagination.totalPages > 1 && (
                <div className="pt-8 border-t border-slate-200 flex items-center justify-between">
                  <p className="text-xs text-slate-500">
                    Showing Page <strong>{pagination.page}</strong> of <strong>{pagination.totalPages}</strong>
                  </p>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page <= 1}
                      className="p-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => handlePageChange(p)}
                        className={`w-8 h-8 rounded-xl text-xs font-bold transition ${
                          p === pagination.page
                            ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                            : 'border border-slate-200 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        {p}
                      </button>
                    ))}

                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page >= pagination.totalPages}
                      className="p-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Mobile Filters Modal */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden bg-slate-900/50 backdrop-blur-sm flex justify-end animate-in fade-in">
          <div className="w-full max-w-xs bg-white h-full p-5 overflow-y-auto flex flex-col justify-between">
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-bold text-sm text-slate-900">Filters</h3>
                <button onClick={() => setIsMobileFilterOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Category</label>
                <select
                  value={selectedCat}
                  onChange={(e) => setSelectedCat(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                >
                  <option value="">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.slug} value={c.slug}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Price */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Price Range ($)</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="Min"
                    className="bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs"
                  />
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="Max"
                    className="bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                <label className="flex items-center justify-between">
                  <span>In-Stock Only</span>
                  <input type="checkbox" checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)} />
                </label>
                <label className="flex items-center justify-between">
                  <span>Deals Only</span>
                  <input type="checkbox" checked={dealsOnly} onChange={(e) => setDealsOnly(e.target.checked)} />
                </label>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex gap-2">
              <button
                onClick={handleResetFilters}
                className="flex-1 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-600"
              >
                Reset
              </button>
              <button
                onClick={() => applyFilters()}
                className="flex-1 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

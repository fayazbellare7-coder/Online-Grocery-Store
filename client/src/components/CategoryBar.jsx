import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';

const CATEGORIES = [
  { name: 'All Products', slug: '', icon: '🛒' },
  { name: 'Fruits & Vegetables', slug: 'fruits-vegetables', icon: '🍎' },
  { name: 'Dairy & Eggs', slug: 'dairy-eggs', icon: '🥛' },
  { name: 'Bakery & Bread', slug: 'bakery-bread', icon: '🍞' },
  { name: 'Snacks & Munchies', slug: 'snacks-munchies', icon: '🥨' },
  { name: 'Beverages', slug: 'beverages', icon: '🧃' },
  { name: 'Staples & Grains', slug: 'staples-grains', icon: '🌾' },
  { name: 'Household & Cleaning', slug: 'household-cleaning', icon: '🧼' },
];

export default function CategoryBar({ activeSlug, onSelect }) {
  const [searchParams] = useSearchParams();
  const currentCategory = activeSlug !== undefined ? activeSlug : (searchParams.get('category') || '');

  return (
    <div className="w-full overflow-x-auto scrollbar-none py-2">
      <div className="flex items-center gap-2 min-w-max">
        {CATEGORIES.map((cat) => {
          const isActive = currentCategory === cat.slug;
          return (
            <button
              key={cat.slug}
              onClick={() => onSelect ? onSelect(cat.slug) : null}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-smooth whitespace-nowrap ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'bg-white text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 border border-slate-200'
              }`}
            >
              <span className="text-sm">{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

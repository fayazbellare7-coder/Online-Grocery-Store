import React from 'react';
import { Link } from 'react-router-dom';
import { Store, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center text-emerald-600 mb-4">
        <Store className="w-10 h-10" />
      </div>
      <h1 className="text-4xl font-black text-slate-900">404 - Page Not Found</h1>
      <p className="text-sm text-slate-500 mt-2 max-w-sm">
        Oops! The page or grocery item you are looking for does not exist or has been moved.
      </p>
      <Link
        to="/"
        className="mt-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md shadow-emerald-600/20 transition flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" /> Back to FreshCart Home
      </Link>
    </div>
  );
}

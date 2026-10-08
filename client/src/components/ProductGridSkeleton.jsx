import React from 'react';

export default function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="bg-white border border-slate-100 rounded-2xl p-3.5 shadow-sm animate-pulse flex flex-col justify-between"
        >
          <div>
            <div className="w-full aspect-square bg-slate-200 rounded-xl mb-3"></div>
            <div className="flex justify-between items-center mb-2">
              <div className="h-3 w-16 bg-slate-200 rounded"></div>
              <div className="h-3 w-10 bg-slate-200 rounded"></div>
            </div>
            <div className="h-4 w-3/4 bg-slate-200 rounded mb-1.5"></div>
            <div className="h-4 w-1/2 bg-slate-200 rounded"></div>
          </div>
          <div className="pt-3 mt-3 border-t border-slate-100 flex justify-between items-center">
            <div className="h-5 w-14 bg-slate-200 rounded"></div>
            <div className="h-7 w-16 bg-slate-200 rounded-xl"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

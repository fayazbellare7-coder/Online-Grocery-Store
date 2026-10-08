import React from 'react';
import { Link } from 'react-router-dom';

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionText,
  actionLink,
  onAction,
}) {
  return (
    <div className="text-center py-16 px-4 max-w-md mx-auto flex flex-col items-center">
      {Icon && (
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 shadow-sm">
          <Icon className="w-8 h-8" />
        </div>
      )}
      <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 mb-6 leading-relaxed">{description}</p>

      {actionText && actionLink && (
        <Link
          to={actionLink}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-6 py-2.5 rounded-xl shadow-md shadow-emerald-600/20 transition-smooth active:scale-95"
        >
          {actionText}
        </Link>
      )}

      {actionText && onAction && !actionLink && (
        <button
          onClick={onAction}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-6 py-2.5 rounded-xl shadow-md shadow-emerald-600/20 transition-smooth active:scale-95"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}

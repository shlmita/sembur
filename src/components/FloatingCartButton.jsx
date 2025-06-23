import React from 'react';
import { ShoppingCart } from 'lucide-react';

export default function FloatingCartButton({ onClick, count = 0 }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-50 bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-lg flex items-center justify-center transition-all"
    >
      <div className="relative">
        <ShoppingCart size={24} />
        {count > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-xs text-white rounded-full px-1.5">
            {count}
          </span>
        )}
      </div>
    </button>
  );
}

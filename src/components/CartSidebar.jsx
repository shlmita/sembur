import React from 'react';
import { X, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CartSidebar({ isOpen, onClose, cartItems = [], onRemove }) {
  const navigate = useNavigate();

  const totalHarga = cartItems.reduce((total, item) => {
    return total + (item.jenis === 'sewa'
      ? item.harga_sewa * (item.hari || 1)
      : item.harga_beli);
  }, 0);

  return (
    <div className={`fixed top-0 right-0 z-[999] h-screen w-full sm:w-[400px] bg-white shadow-xl transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b">
        <div className="flex items-center gap-2 font-bold text-lg text-gray-800">
          <ShoppingCart className="w-5 h-5 text-green-600" />
          Keranjang
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-red-500">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* List Items */}
      <div className="flex-1 overflow-y-auto px-4 py-3 scrollbar-thin scrollbar-thumb-gray-300">
        {cartItems.length === 0 ? (
          <p className="text-center text-gray-400 mt-10">Keranjang kamu kosong 😕</p>
        ) : (
          cartItems.map((item, index) => (
            <div key={index} className="border rounded-md p-3 mb-4 shadow-sm">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{item.nama}</h3>
                  <p className="text-sm text-gray-500">Jenis: {item.jenis}</p>
                  <p className="text-sm text-gray-500">
                    Harga: Rp{(item.jenis === 'sewa' ? item.harga_sewa : item.harga_beli).toLocaleString()}
                  </p>
                  {item.jenis === 'sewa' && (
                    <p className="text-sm text-gray-500">Durasi: {item.hari || 1} hari</p>
                  )}
                </div>
                <button
                  onClick={() => onRemove(index)}
                  className="text-xs text-red-500 hover:underline ml-2"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer Checkout */}
      <div className="border-t px-5 py-4 bg-white">
        <div className="flex justify-between font-semibold text-gray-800 mb-2">
          <span>Total</span>
          <span>Rp{totalHarga.toLocaleString()}</span>
        </div>
        <button
          onClick={() => {
            if (cartItems.length > 0) {
              navigate('/checkout', { state: { items: cartItems } });
              onClose();
            }
          }}
          disabled={cartItems.length === 0}
          className="w-full bg-green-600 text-white font-semibold py-2 rounded-md shadow-md hover:bg-green-700 transition disabled:opacity-50"
        >
          Checkout Sekarang
        </button>
      </div>
    </div>
  );
}

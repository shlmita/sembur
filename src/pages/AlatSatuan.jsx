import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { ShoppingCart, Eye, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CartSidebar from '../components/CartSidebar';
import FloatingCartButton from '../components/FloatingCartButton';

export default function AlatSatuanPage() {
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('kategori', 'satuan')
        .order('created_at', { ascending: false });

      if (!error) setProducts(data);
      setLoading(false);
    };

    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    fetchProducts();
    fetchUser();
  }, []);

  const handleAddToCart = (product, type) => {
    if (!user) {
      alert('Silakan login terlebih dahulu untuk menambahkan ke keranjang.');
      navigate('/login');
      return;
    }

    if (product.stok <= 0) {
      alert('Stok produk ini habis.');
      return;
    }

    setCartItems((prev) => [...prev, { ...product, jenis: type }]);
    setCartOpen(true);
  };

  return (
    <div className="px-4 py-6 max-w-7xl mx-auto">
      <h1 className="text-center pt-20 pb-5 text-3xl font-bold mb-4 text-green-700">ALAT SATUAN</h1>

      {loading ? (
        <p className="text-center text-gray-500 py-10">Memuat produk...</p>
      ) : products.length === 0 ? (
        <p className="text-center text-gray-500 py-10">Tidak ada produk tersedia.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pb-10">
          {products.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
            >
              <div className="relative">
                <img
                  src={item.gambar_url || '/placeholder.jpg'}
                  alt={item.nama}
                  className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              <div className="p-4 flex flex-col gap-2">
                <h3 className="text-lg font-semibold text-gray-800 truncate capitalize">{item.nama}</h3>

                <div className="text-sm text-gray-600 space-y-1 leading-tight">
                  <p className="text-sm">
                    <span className="text-green-600 font-semibold inline-flex items-center gap-1">
                      Beli <ArrowRight size={16} className="inline" />
                      <span>Rp {item.harga_beli?.toLocaleString('id-ID')}</span>
                    </span>
                    <span className="text-xs text-gray-400 ml-1">/pcs</span>
                  </p>

                  <p className="text-sm">
                    <span className="text-blue-600 font-semibold inlen-flex items-center gap-1">
                      Sewa <ArrowRight size={16} className="inline" />
                      <span>Rp {item.harga_sewa?.toLocaleString('id-ID')}</span>
                    </span>
                    <span className="text-xs text-gray-400 ml-1">/hari</span>
                  </p>

                  <p className="text-xs text-gray-400">Terjual: {item.terjual}</p>
                </div>

                <div className="flex items-center justify-between gap-2 pt-2">
                  <button
                    onClick={() => handleAddToCart(item, 'beli')}
                    disabled={item.stok <= 0}
                    className={`flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 rounded-full text-sm font-medium transition ${
                      item.stok <= 0
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    <ShoppingCart size={16} /> Beli
                  </button>

                  <button
                    onClick={() => handleAddToCart(item, 'sewa')}
                    disabled={item.stok <= 0}
                    className={`flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 rounded-full text-sm font-medium transition ${
                      item.stok <= 0
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    <ShoppingCart size={16} /> Sewa
                  </button>

                  <button
                    onClick={() => navigate(`/produk/${item.id}`)}
                    className="text-gray-500 hover:text-green-600 transition"
                    title="Lihat Detail"
                  >
                    <Eye size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <CartSidebar
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cartItems}
        onRemove={(index) =>
          setCartItems((prev) => prev.filter((_, i) => i !== index))
        }
      />

      <FloatingCartButton onClick={() => setCartOpen(true)} count={cartItems.length} />
    </div>
  );
}

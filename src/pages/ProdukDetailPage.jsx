import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import CartSidebar from '../components/CartSidebar';
import FloatingCartButton from '../components/FloatingCartButton';

export default function ProdukDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [isZooming, setIsZooming] = useState(false);
  const imageRef = useRef(null);

  const [cartItems, setCartItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (!error) setProduct(data);
    };

    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };

    fetchProduct();
    fetchUser();
  }, [id]);

  const handleMouseMove = (e) => {
    const rect = imageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setZoomPosition({ x, y });
    setIsZooming(true);
  };

  const handleMouseLeave = () => {
    setIsZooming(false);
  };

  const handleAddToCart = (type) => {
    if (!user) {
      alert("Silakan login terlebih dahulu.");
      navigate('/login');
      return;
    }

    if (product.stok <= 0) {
      alert("Stok habis, tidak bisa ditambahkan ke keranjang.");
      return;
    }

    setCartItems((prev) => [...prev, { ...product, jenis: type }]);
    setCartOpen(true);
  };

  if (!product) {
    return <div className="text-center py-20 text-gray-500 text-lg">Memuat detail produk...</div>;
  }

  return (
    <div className="pt-20 max-w-6xl mx-auto px-4 py-12">
      <div className="mb-3">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-4 py-3 bg-green-700 text-white hover:bg-gray-100 hover:text-gray-700 rounded-full text-sm transition"
        >
          <ArrowLeft size={18} /> Kembali
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 bg-white shadow-xl rounded-3xl p-6 lg:p-10">
        <div className="flex-1">
          <div
            className="relative w-full h-[350px] sm:h-[400px] border rounded-2xl overflow-hidden shadow-sm group"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            ref={imageRef}
          >
            <img
              src={product.gambar_url || '/placeholder.jpg'}
              alt={product.nama}
              className="w-full h-full object-cover"
            />

            {isZooming && (
              <div
                className="absolute w-32 h-32 rounded-full border-4 border-white shadow-xl pointer-events-none"
                style={{
                  top: zoomPosition.y - 64,
                  left: zoomPosition.x - 64,
                  backgroundImage: `url(${product.gambar_url || '/placeholder.jpg'})`,
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '200%',
                  backgroundPosition: `${(zoomPosition.x / imageRef.current.offsetWidth) * 100}% ${(zoomPosition.y / imageRef.current.offsetHeight) * 100}%`,
                  transition: 'opacity 0.1s ease',
                  zIndex: 10,
                }}
              />
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-between">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-green-700 capitalize">{product.nama}</h1>

            <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-gray-700">
              <p>
                <span className="font-medium">Harga Beli:</span>{' '}
                <span className="text-green-600 font-semibold">Rp {product.harga_beli.toLocaleString('id-ID')}</span>
              </p>
              <p>
                <span className="font-medium">Harga Sewa:</span>{' '}
                <span className="text-blue-600 font-semibold">Rp {product.harga_sewa.toLocaleString('id-ID')}</span>
                <span className="text-xs text-gray-400 ml-1"> /hari</span>
              </p>

              <p><span className="font-medium">Terjual:</span> {product.terjual}</p>
            </div>

            <div className="mt-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Deskripsi Produk</h2>
              <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl text-gray-700 whitespace-pre-line text-sm leading-relaxed">
                {product.deskripsi || 'Tidak ada deskripsi tersedia.'}
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <button
              className="flex-1 bg-green-600 hover:bg-green-700 transition text-white py-3 rounded-full text-base font-medium flex items-center justify-center gap-2"
              onClick={() => handleAddToCart('beli')}
            >
              <ShoppingCart size={18} /> Beli Sekarang
            </button>
            <button
              className="flex-1 bg-blue-600 hover:bg-blue-700 transition text-white py-3 rounded-full text-base font-medium flex items-center justify-center gap-2"
              onClick={() => handleAddToCart('sewa')}
            >
              <ShoppingCart size={18} /> Sewa Alat
            </button>
          </div>
        </div>
      </div>

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

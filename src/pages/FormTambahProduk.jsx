import { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function FormTambahProduk() {
  const [nama, setNama] = useState('');
  const [kategori, setKategori] = useState('satuan');
  const [stok, setStok] = useState(0);
  const [hargaBeli, setHargaBeli] = useState(0);
  const [hargaSewa, setHargaSewa] = useState(5000);
  const [deskripsi, setDeskripsi] = useState('');
  const [gambar, setGambar] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    let gambarUrl = null;
    if (gambar) {
      const fileExt = gambar.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;

      const { error } = await supabase.storage
        .from('produk')
        .upload(`images/${fileName}`, gambar);

      if (error) {
        console.error(error);
        alert('Gagal upload gambar.');
        return;
      }

      const { data: urlData } = supabase.storage
        .from('produk')
        .getPublicUrl(`images/${fileName}`);

      gambarUrl = urlData.publicUrl;
    }

    const { error: insertError } = await supabase.from('products').insert([{
      nama,
      kategori,
      stok: Number(stok),
      harga_beli: Number(hargaBeli),
      harga_sewa: Number(hargaSewa),
      deskripsi,
      gambar_url: gambarUrl
    }]);

    if (insertError) {
      console.error(insertError);
      alert('Gagal menambahkan produk.');
    } else {
      alert('Produk berhasil ditambahkan.');
      navigate('/');
    }
  };

  return (
    <div className="max-w-2xl pt-28 mx-auto py-20 px-6">
      <h2 className="text-3xl font-bold text-green-700 mb-8 text-center">Tambah Produk</h2>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-2xl shadow-md border border-gray-200">
        {/* Nama Produk */}
        <div>
          <label className="block text-sm font-medium mb-1">Nama Produk</label>
          <input
            type="text"
            placeholder="Contoh: Traktor Mini"
            className="w-full border border-gray-300 p-2 rounded-md focus:ring focus:ring-green-200"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            required
          />
        </div>

        {/* Kategori */}
        <div>
          <label className="block text-sm font-medium mb-1">Kategori</label>
          <select
            value={kategori}
            onChange={(e) => setKategori(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded-md focus:ring focus:ring-green-200"
            required
          >
            <option value="satuan">Satuan</option>
            <option value="paket">Paket</option>
          </select>
        </div>

        {/* Stok */}
        <div>
          <label className="block text-sm font-medium mb-1">Stok Tersedia</label>
          <input
            type="number"
            placeholder="Contoh: 10"
            className="w-full border border-gray-300 p-2 rounded-md focus:ring focus:ring-green-200"
            value={stok}
            onChange={(e) => setStok(e.target.value)}
            required
          />
        </div>

        {/* Harga Beli */}
        <div>
          <label className="block text-sm font-medium mb-1">Harga Beli (Rp)</label>
          <input
            type="number"
            placeholder="Contoh: 150000"
            className="w-full border border-gray-300 p-2 rounded-md focus:ring focus:ring-green-200"
            value={hargaBeli}
            onChange={(e) => setHargaBeli(e.target.value)}
            required
          />
        </div>

        {/* Harga Sewa */}
        <div>
          <label className="block text-sm font-medium mb-1">Harga Sewa per Hari (Rp)</label>
          <input
            type="number"
            placeholder="Contoh: 5000"
            className="w-full border border-gray-300 p-2 rounded-md focus:ring focus:ring-green-200"
            value={hargaSewa}
            onChange={(e) => setHargaSewa(e.target.value)}
          />
        </div>

        {/* Deskripsi */}
        <div>
          <label className="block text-sm font-medium mb-1">Deskripsi Produk</label>
          <textarea
            placeholder="Tuliskan detail atau fitur produk"
            className="w-full border border-gray-300 p-2 rounded-md focus:ring focus:ring-green-200"
            value={deskripsi}
            onChange={(e) => setDeskripsi(e.target.value)}
            rows={4}
          />
        </div>

        {/* Gambar */}
        <div>
          <label className="block text-sm font-medium mb-1">Gambar Produk</label>
          <input
            type="file"
            accept="image/*"
            className="w-full"
            onChange={(e) => setGambar(e.target.files[0])}
          />
        </div>

        {/* Tombol Submit */}
        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-md transition duration-200"
          >
            Simpan Produk
          </button>
        </div>
      </form>
    </div>
  );
}

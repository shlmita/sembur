import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabaseClient';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

const AlatKelompokPage = () => {
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    nama: '',
    kategori: 'satuan',
    stok: 0,
    hargaBeli: 0,
    hargaSewa: 5000,
    deskripsi: '',
    gambar: null,
  });
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('kategori', 'satuan')
      .order('created_at', { ascending: false });

    if (!error) setProducts(data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setForm((prev) => ({ ...prev, gambar: file }));
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let gambarUrl = null;

    if (form.gambar) {
      const ext = form.gambar.name.split('.').pop();
      const filename = `${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from('produk')
        .upload(`images/${filename}`, form.gambar);

      if (uploadError) {
        alert('Gagal upload gambar');
        return;
      }

      const { data } = supabase.storage
        .from('produk')
        .getPublicUrl(`images/${filename}`);
      gambarUrl = data.publicUrl;
    }

    const payload = {
      nama: form.nama,
      kategori: form.kategori,
      stok: Number(form.stok),
      harga_beli: Number(form.hargaBeli),
      harga_sewa: Number(form.hargaSewa),
      deskripsi: form.deskripsi,
      ...(gambarUrl && { gambar_url: gambarUrl }),
    };

    if (editingId) {
      await supabase.from('products').update(payload).eq('id', editingId);
    } else {
      await supabase.from('products').insert(payload);
    }

    setForm({
      nama: '',
      kategori: 'satuan',
      stok: 0,
      hargaBeli: 0,
      hargaSewa: 5000,
      deskripsi: '',
      gambar: null,
    });
    setEditingId(null);
    setPreviewUrl(null);
    fetchProducts();
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setForm({
      nama: product.nama,
      kategori: product.kategori,
      stok: product.stok,
      hargaBeli: product.harga_beli,
      hargaSewa: product.harga_sewa,
      deskripsi: product.deskripsi,
      gambar: null,
    });
    setPreviewUrl(product.gambar_url);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus produk ini?')) {
      await supabase.from('products').delete().eq('id', id);
      fetchProducts();
    }
  };

  const formatCurrency = (val) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6 sm:px-6 md:px-10 lg:px-16 xl:px-24">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-8 text-center">
        Manajemen Alat Satuan
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-md p-4 sm:p-6 lg:p-8 mb-10 space-y-4"
      >
        <h2 className="text-lg sm:text-xl font-semibold text-gray-700">
          {editingId ? 'Edit Produk' : 'Tambah Produk Satuan'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Produk
            </label>
            <input
              type="text"
              name="nama"
              value={form.nama}
              onChange={handleChange}
              placeholder="Contoh: Sensor Suhu"
              required
              className="border border-gray-300 p-2 rounded w-full"
            />
            <p className="text-sm text-gray-500 mt-1">Masukkan nama alat satuan.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stok</label>
            <input
              type="number"
              name="stok"
              value={form.stok}
              onChange={handleChange}
              placeholder="Contoh: 10"
              required
              className="border border-gray-300 p-2 rounded w-full"
            />
            <p className="text-sm text-gray-500 mt-1">Jumlah alat yang tersedia saat ini.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Harga Beli</label>
            <input
              type="number"
              name="hargaBeli"
              value={form.hargaBeli}
              onChange={handleChange}
              placeholder="Contoh: 250000"
              required
              className="border border-gray-300 p-2 rounded w-full"
            />
            <p className="text-sm text-gray-500 mt-1">Harga beli per unit alat.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Harga Sewa</label>
            <input
              type="number"
              name="hargaSewa"
              value={form.hargaSewa}
              onChange={handleChange}
              placeholder="Contoh: 5000"
              className="border border-gray-300 p-2 rounded w-full"
            />
            <p className="text-sm text-gray-500 mt-1">Harga sewa per hari.</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
          <textarea
            name="deskripsi"
            value={form.deskripsi}
            onChange={handleChange}
            placeholder="Tulis deskripsi produk"
            rows={4}
            className="border border-gray-300 p-2 rounded w-full"
          />
          <p className="text-sm text-gray-500 mt-1">Deskripsi singkat tentang alat.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Unggah Gambar</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full"
          />
        </div>

        {previewUrl && (
          <div className="mt-4">
            <p className="text-sm text-gray-500 mb-2">Pratinjau Gambar:</p>
            <img
              src={previewUrl}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-md shadow-md"
            />
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4">
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm({
                  nama: '',
                  kategori: 'satuan',
                  stok: 0,
                  hargaBeli: 0,
                  hargaSewa: 5000,
                  deskripsi: '',
                  gambar: null,
                });
                setPreviewUrl(null);
              }}
              className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded"
            >
              Batal
            </button>
          )}
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
          >
            {editingId ? 'Update Produk' : 'Simpan Produk'}
          </button>
        </div>
      </form>

      {/* Tabel Desktop */}
      <div className="hidden md:block bg-white rounded-xl shadow-md p-4 sm:p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Daftar Produk</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-700 font-medium">
              <tr>
                <th className="px-4 py-2">No</th>
                <th className="px-4 py-2">Nama</th>
                <th className="px-4 py-2">Gambar</th>
                <th className="px-4 py-2">Stok</th>
                <th className="px-4 py-2">Harga Beli</th>
                <th className="px-4 py-2">Harga Sewa</th>
                <th className="px-4 py-2">Deskripsi</th>
                <th className="px-4 py-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p, i) => (
                <tr key={p.id} className="border-t">
                  <td className="px-4 py-2">{i + 1}</td>
                  <td className="px-4 py-2">{p.nama}</td>
                  <td className="px-4 py-2">
                    {p.gambar_url ? (
                      <img src={p.gambar_url} alt="gambar" className="w-16 h-16 object-cover rounded" />
                    ) : (
                      <span className="text-gray-400 italic">Tidak ada</span>
                    )}
                  </td>
                  <td className="px-4 py-2">{p.stok}</td>
                  <td className="px-4 py-2">{formatCurrency(p.harga_beli)}</td>
                  <td className="px-4 py-2">{formatCurrency(p.harga_sewa)}</td>
                  <td className="px-4 py-2 max-w-[200px] truncate">{p.deskripsi}</td>
                  <td className="px-4 py-2">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <button
                        onClick={() => handleEdit(p)}
                        className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded flex items-center text-xs"
                      >
                        <PencilIcon className="h-4 w-4 mr-1" /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded flex items-center text-xs"
                      >
                        <TrashIcon className="h-4 w-4 mr-1" /> Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Kartu Mobile */}
      <div className="md:hidden space-y-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Daftar Produk</h2>
        {products.map((p, i) => (
          <div key={p.id} className="bg-white rounded-xl shadow p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-base font-semibold">{p.nama}</h3>
                <p className="text-xs text-gray-500">Stok: {p.stok}</p>
              </div>
              {p.gambar_url && (
                <img
                  src={p.gambar_url}
                  alt="gambar"
                  className="w-16 h-16 object-cover rounded shadow"
                />
              )}
            </div>
            <div className="text-sm text-gray-700">
              <p>Harga Beli: {formatCurrency(p.harga_beli)}</p>
              <p>Harga Sewa: {formatCurrency(p.harga_sewa)}</p>
              <p className="mt-1 text-gray-600 text-xs">
                {p.deskripsi?.length > 100 ? p.deskripsi.slice(0, 100) + '...' : p.deskripsi}
              </p>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => handleEdit(p)}
                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
              >
                <PencilIcon className="h-4 w-4 inline mr-1" /> Edit
              </button>
              <button
                onClick={() => handleDelete(p.id)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
              >
                <TrashIcon className="h-4 w-4 inline mr-1" /> Hapus
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlatKelompokPage;

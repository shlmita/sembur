import React, { useEffect, useState } from 'react';
import { supabase } from '../../services/supabaseClient';
import { TrashIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

const PaymentPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('orders')
      .select('id, nama_penerima, bukti_bayar_url, nota_url, status, metode_pembayaran, created_at');

    if (error) {
      setErrorMessage('Gagal mengambil data');
    } else {
      setOrders(data);
    }
    setLoading(false);
  };

  const handleUpdateStatus = async (id, status) => {
    const { error } = await supabase.from('orders').update({ status }).eq('id', id);
    if (error) {
      setErrorMessage('Gagal memperbarui status');
    } else {
      fetchOrders();
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Yakin ingin menghapus pesanan ini?');
    if (!confirmed) return;
    const { error } = await supabase.from('orders').delete().eq('id', id);
    if (error) {
      setErrorMessage('Gagal menghapus pesanan');
    } else {
      fetchOrders();
    }
  };

  const formatShortDate = (isoString) => {
    if (!isoString) return '-';
    const date = new Date(isoString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} pukul ${hour}:${minute}`;
  };

  return (
    <div className="w-full px-2 sm:px-6 md:px-8 py-4">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">
        Manajemen Pembayaran
      </h1>

      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-2 py-3 rounded mb-4 text-sm sm:text-base">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {errorMessage}</span>
        </div>
      )}

      {/* TABEL UNTUK DESKTOP */}
      <div className="hidden md:block bg-white p-2 sm:p-6 rounded-lg shadow-md w-full overflow-x-auto">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">
          Daftar Transaksi (Desktop)
        </h2>
        {loading ? (
          <p className="text-center text-gray-600">Memuat data...</p>
        ) : (
          <table className="w-full min-w-[900px] border border-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-100 text-gray-700 uppercase text-xs">
                <th className="px-3 py-2 border">No</th>
                <th className="px-3 py-2 border">Nama</th>
                <th className="px-3 py-2 border">Tanggal</th>
                <th className="px-3 py-2 border">Metode</th>
                <th className="px-3 py-2 border">Bukti</th>
                <th className="px-3 py-2 border">Nota</th>
                <th className="px-3 py-2 border">Status</th>
                <th className="px-3 py-2 border">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={order.id} className="hover:bg-gray-50 text-xs">
                  <td className="px-3 py-2 border text-center">{index + 1}</td>
                  <td className="px-3 py-2 border">{order.nama_penerima}</td>
                  <td className="px-3 py-2 border whitespace-nowrap">{formatShortDate(order.created_at)}</td>
                  <td className="px-3 py-2 border text-center">{order.metode_pembayaran}</td>
                  <td className="px-3 py-2 border">
                    {order.bukti_bayar_url ? (
                      <a href={order.bukti_bayar_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        Lihat
                      </a>
                    ) : (
                      <span className="text-gray-400 italic">Belum Upload</span>
                    )}
                  </td>
                  <td className="px-3 py-2 border">
                    {order.nota_url ? (
                      <a href={order.nota_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        Lihat Nota
                      </a>
                    ) : (
                      <span className="text-gray-400 italic">Belum Ada</span>
                    )}
                  </td>
                  <td className="px-3 py-2 border">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      order.status === 'selesai' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {order.status || 'menunggu_pembayaran'}
                    </span>
                  </td>
                  <td className="px-3 py-2 border">
                    <div className="flex flex-col gap-1">
                      <button onClick={() => handleUpdateStatus(order.id, 'selesai')} className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs">
                        <CheckCircleIcon className="w-4 h-4 inline mr-1" /> Selesai
                      </button>
                      <button onClick={() => handleUpdateStatus(order.id, 'menunggu_pembayaran')} className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded text-xs">
                        <XCircleIcon className="w-4 h-4 inline mr-1" /> Belum
                      </button>
                      <button onClick={() => handleDelete(order.id)} className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs">
                        <TrashIcon className="w-4 h-4 inline mr-1" /> Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* KARTU UNTUK MOBILE */}
      <div className="block md:hidden space-y-4">
        {orders.map((order, index) => (
          <div key={order.id} className="bg-white shadow-md hover:shadow-lg transition border border-gray-200 rounded-xl p-4 text-sm">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-gray-700">#{index + 1} - {order.nama_penerima}</span>
              <span className="text-xs text-gray-500">{formatShortDate(order.created_at)}</span>
            </div>
            <div className="text-gray-600 mb-2 space-y-1">
              <p className="flex items-center gap-2">
                <strong>Metode:</strong>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                  order.metode_pembayaran === 'QRIS'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-orange-100 text-orange-700'
                }`}>
                  {order.metode_pembayaran}
                </span>
              </p>
              <p className="flex items-center gap-2">
                <strong>Status:</strong>
                <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                  order.status === 'selesai'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {order.status || 'menunggu_pembayaran'}
                </span>
              </p>
              <p>
                <strong>Bukti:</strong> {order.bukti_bayar_url ? (
                  <a href={order.bukti_bayar_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Lihat</a>
                ) : (
                  <span className="italic text-gray-400">Belum Upload</span>
                )}
              </p>
              <p>
                <strong>Nota:</strong> {order.nota_url ? (
                  <a href={order.nota_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Lihat Nota</a>
                ) : (
                  <span className="italic text-gray-400">Belum Ada</span>
                )}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              <button onClick={() => handleUpdateStatus(order.id, 'selesai')} className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs">
                <CheckCircleIcon className="w-4 h-4 inline mr-1" /> Selesai
              </button>
              <button onClick={() => handleUpdateStatus(order.id, 'menunggu_pembayaran')} className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-xs">
                <XCircleIcon className="w-4 h-4 inline mr-1" /> Belum
              </button>
              <button onClick={() => handleDelete(order.id)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs">
                <TrashIcon className="w-4 h-4 inline mr-1" /> Hapus
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentPage;
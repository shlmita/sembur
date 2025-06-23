// ...[IMPORT & ICON SETUP Tetap Sama]
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import html2pdf from 'html2pdf.js';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function LocationMarker({ setLatLng }) {
  useMapEvents({
    click(e) {
      setLatLng(e.latlng);
    },
  });
  return null;
}

function ReverseGeocodeUpdater({ lokasi, setAlamat }) {
  useEffect(() => {
    if (!lokasi.lat || !lokasi.lng) return;
    const fetchAlamat = async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lokasi.lat}&lon=${lokasi.lng}&format=json`
        );
        const data = await res.json();
        setAlamat(data.display_name || '');
      } catch (err) {
        console.error('Gagal ambil alamat:', err);
      }
    };
    fetchAlamat();
  }, [lokasi]);
  return null;
}

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;
  const items = state?.items || [];

  const [user, setUser] = useState(null);
  const [nama, setNama] = useState('');
  const [nomor, setNomor] = useState('');
  const [alamat, setAlamat] = useState('');
  const [metode, setMetode] = useState('COD');
  const [bukti, setBukti] = useState(null);
  const [lokasi, setLokasi] = useState({ lat: -6.2, lng: 106.8 });
  const [loading, setLoading] = useState(false);
  const [tanggalSewa, setTanggalSewa] = useState(null); // [startDate, endDate]
  const [jenisKirim, setJenisKirim] = useState('instant');
  const [jarakKm, setJarakKm] = useState(0);
  const [ongkir, setOngkir] = useState(0);

  const lokasiToko = { lat: -6.980994, lng: 110.409068 };

  const hitungHargaOngkir = (jarak, jenis) => {
    let base = 0;
    if (jarak <= 5) base = 10000;
    else if (jarak <= 10) base = 20000;
    else base = 30000 + Math.ceil(jarak - 10) * 2000;
    if (jenis === 'instant') return base + 5000;
    if (jenis === 'J&T') return base + 3000;
    return base;
  };

  useEffect(() => {
    const jarak = getDistanceFromLatLonInKm(
      lokasi.lat, lokasi.lng, lokasiToko.lat, lokasiToko.lng
    );
    setJarakKm(jarak);
    setOngkir(hitungHargaOngkir(jarak, jenisKirim));
  }, [lokasi, jenisKirim]);

  const hargaBarang = items.reduce((total, item) => {
    if (item.jenis === 'sewa') {
      const hari = tanggalSewa ? (Math.ceil((tanggalSewa[1] - tanggalSewa[0]) / (1000 * 60 * 60 * 24)) + 1) : 1;
      return total + item.harga_sewa * hari;
    } else {
      return total + item.harga_beli;
    }
  }, 0);

  const totalHarga = hargaBarang + ongkir;

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);

      navigator.geolocation.getCurrentPosition((pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setLokasi({ lat, lng });
        fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
          .then((res) => res.json())
          .then((data) => setAlamat(data.display_name || ''));
      });
    })();
  }, []);

  // 🧾 Fungsi generate dan download invoice
  const generateAndDownloadInvoice = async ({ nama, nomor, alamat, totalHarga, orderId, items, ongkir = 0, tanggalSewa }) => {
    const tanggalTransaksi = new Date().toLocaleDateString('id-ID', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    const subTotal = totalHarga - ongkir;

    const rows = items.map(item => {
      const namaBarang = item.nama || item.nama_barang || 'Barang';
      const harga = item.jenis === 'sewa' ? item.harga_sewa : item.harga_beli;
      const jumlah = 1;
      const total = harga * jumlah;
      return `
        <tr>
          <td>${namaBarang}</td>
          <td>Rp ${harga.toLocaleString('id-ID')}</td>
          <td>${jumlah}</td>
          <td>Rp ${total.toLocaleString('id-ID')}</td>
        </tr>
      `;
    }).join('');

    let rentDatesHtml = '';
    if (items.some(item => item.jenis === 'sewa') && tanggalSewa && tanggalSewa[0] && tanggalSewa[1]) {
      const tanggalAwalSewa = tanggalSewa[0].toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
      const tanggalPengembalian = tanggalSewa[1].toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
      rentDatesHtml = `
        <p><strong>Tanggal Awal Sewa:</strong> ${tanggalAwalSewa}</p>
        <p><strong>Tanggal Pengembalian:</strong> ${tanggalPengembalian}</p>
      `;
    }

    const invoiceHTML = `
      <div style="font-family: Arial, sans-serif; padding: 40px; width: 595px; box-sizing: border-box;">
        <h1 style="margin-bottom: 0;">INVOICE</h1>
        <table style="width: 100%; margin-top: 10px; font-size: 12px;">
          <tr>
            <td style="vertical-align: top;">
              <strong>KEPADA:</strong><br>
              ${nama}<br>
              ${nomor}<br>
              ${alamat || ""}
            </td>
            <td style="text-align: right; vertical-align: top;">
              <strong>TANGGAL TRANSAKSI:</strong> ${tanggalTransaksi}<br>
              <strong>NO INVOICE:</strong> #${orderId}
              ${rentDatesHtml}
            </td>
          </tr>
        </table>

        <table border="1" cellspacing="0" cellpadding="6" style="width: 100%; border-collapse: collapse; text-align: left; margin-top: 20px;">
          <thead style="background-color: #eee;">
            <tr>
              <th>KETERANGAN</th>
              <th>HARGA</th>
              <th>JML</th>
              <th>TOTAL</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>

        <table style="width: 100%; margin-top: 20px; font-size: 13px;">
          <tr>
            <td style="vertical-align: top;">
              <strong>PEMBAYARAN:</strong><br>
              Nama: SEMBUR<br>
              No Rek: 0677-0101-1858-504
            </td>
            <td style="text-align: right;">
              <p><strong>SUB TOTAL:</strong> Rp ${subTotal.toLocaleString('id-ID')}</p>
              <p><strong>ONGKIR:</strong> Rp ${ongkir.toLocaleString('id-ID')}</p>
              <p><strong>TOTAL:</strong> <span style="font-size: 16px;">Rp ${totalHarga.toLocaleString('id-ID')}</span></p>
            </td>
          </tr>
        </table>

        <p style="margin-top: 40px;"><strong>TERIMAKASIH ATAS PEMBELIAN ANDA</strong></p>

        <div style="margin-top: 60px; text-align: right;">
          <p style="margin: 0;">______________________</p>
          <p style="margin: 0;">Admin Sembur</p>
        </div>
      </div>
    `;

    const opt = {
      margin: 0,
      filename: `invoice-${orderId}.pdf`,
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'px', format: [595, 842], orientation: 'portrait' }
    };

    // Mengembalikan promise dari html2pdf().from().set().outputPdf()
    // untuk bisa mendapatkan blob dan menguploadnya.
    return new Promise((resolve, reject) => {
      html2pdf().from(invoiceHTML).set(opt).outputPdf('blob').then(async (pdfBlob) => {
        try {
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('invoices') // Ganti dengan nama bucket storage Anda untuk invoice
            .upload(`public/${orderId}.pdf`, pdfBlob, {
              cacheControl: '3600',
              upsert: false,
              contentType: 'application/pdf',
            });

          if (uploadError) {
            console.error('Error uploading invoice:', uploadError);
            reject(uploadError);
            return;
          }

          const { data: fileData } = supabase.storage
            .from('invoices')
            .getPublicUrl(`public/${orderId}.pdf`);

          // Resolve dengan public URL dari invoice
          resolve(fileData.publicUrl);

        } catch (uploadErr) {
          console.error('Error during invoice upload:', uploadErr);
          reject(uploadErr);
        }
      }).catch(err => {
        console.error('Error generating PDF:', err);
        reject(err);
      });
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!nama || !nomor || !alamat || !metode) {
        alert('Mohon lengkapi semua data.');
        setLoading(false);
        return;
      }

      let buktiUrl = null;
      if (metode === 'QRIS') {
        if (!bukti) {
          alert('Silakan upload bukti pembayaran.');
          setLoading(false);
          return;
        }

        const fileExt = bukti.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('bukti-pembayaran')
          .upload(`qris/${fileName}`, bukti);

        if (uploadError) {
          alert('Gagal mengupload bukti pembayaran.');
          setLoading(false);
          return;
        }

        const { data: fileData } = supabase.storage
          .from('bukti-pembayaran')
          .getPublicUrl(`qris/${fileName}`);
        buktiUrl = fileData.publicUrl;
      }

      const { data: userData } = await supabase.auth.getUser();
      const { data: insertedOrders, error: insertError } = await supabase
        .from('orders')
        .insert([{
          user_id: userData.user?.id,
          nama_penerima: nama,
          nomor_wa: nomor,
          alamat,
          metode_pembayaran: metode,
          total_harga: totalHarga,
          bukti_bayar_url: buktiUrl,
          lokasi_lat: lokasi.lat,
          lokasi_lng: lokasi.lng,
          jenis_pengiriman: jenisKirim,
          ongkir: ongkir
        }])
        .select();

      if (insertError || !insertedOrders?.[0]) {
        alert('Gagal membuat pesanan.');
        setLoading(false);
        return;
      }

      const orderId = insertedOrders[0].id;

      // ✅ Update stok dan terjual untuk setiap produk
      for (const item of items) {
        const { id, stok, terjual } = item;
        const jumlah = 1; // Jika ada fitur quantity, ubah sesuai kebutuhan

        const updateData = {};
        if (stok !== undefined && stok !== null) updateData.stok = stok - jumlah;
        if (terjual !== undefined && terjual !== null) updateData.terjual = (terjual || 0) + jumlah;

        await supabase
          .from('products')
          .update(updateData)
          .eq('id', id);
      }

      // ✅ Buat dan upload invoice, lalu dapatkan URL-nya
      const invoiceUrl = await generateAndDownloadInvoice({
        nama,
        nomor,
        alamat,
        totalHarga,
        orderId,
        items,
        ongkir,
        tanggalSewa // Teruskan tanggalSewa ke fungsi generate invoice
      });

      // ✅ Simpan URL invoice ke database
      const { error: updateInvoiceUrlError } = await supabase
        .from('orders')
        .update({ nota_url: invoiceUrl })
        .eq('id', orderId);

if (updateInvoiceUrlError) {
  console.error('Error updating nota_url:', updateInvoiceUrlError);
  alert('Pesanan berhasil dibuat, namun gagal menyimpan link invoice.');
} else {
try {
  // Fetch file as blob dari public URL
  const response = await fetch(invoiceUrl);
  const blob = await response.blob();

  // Buat URL lokal dari blob
  const blobUrl = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = `invoice-${orderId}.pdf`; // nama file saat diunduh
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(blobUrl); // bersihkan blob dari memori

  // Redirect setelah 1 detik
  setTimeout(() => {
    navigate('/');
  }, 1000);
} catch (err) {
  console.error('Gagal mendownload invoice:', err);
  alert('Pesanan berhasil, namun gagal mendownload invoice.');
  navigate('/');
}

}

    } catch (err) {
      console.error('Checkout error:', err);
      alert('Terjadi kesalahan saat memproses pesanan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pt-24 pb-10">
      <h2 className="text-2xl font-bold mb-6 text-green-700">Checkout</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium">Nama Penerima</label>
          <input type="text" className="w-full border rounded p-2" value={nama} onChange={(e) => setNama(e.target.value)} />

          <label className="block text-sm font-medium mt-4">Nomor WhatsApp</label>
          <input type="text" className="w-full border rounded p-2" value={nomor} onChange={(e) => setNomor(e.target.value)} />

          <label className="block text-sm font-medium mt-4">Alamat Lengkap</label>
          <textarea className="w-full border rounded p-2" rows={3} value={alamat} onChange={(e) => setAlamat(e.target.value)} />

          <label className="block text-sm font-medium mt-4">Jenis Pengiriman</label>
          <select className="w-full border rounded p-2" value={jenisKirim} onChange={(e) => setJenisKirim(e.target.value)}>
            <option value="instant">Instant (Hanya untuk wilayah Semarang)</option>
            <option value="J&T">J&T</option>
          </select>

          <label className="block text-sm font-medium mt-4">Metode Pembayaran</label>
          <select className="w-full border rounded p-2" value={metode} onChange={(e) => setMetode(e.target.value)}>
            <option value="COD">COD</option>
            <option value="QRIS">QRIS</option>
          </select>

          {metode === 'QRIS' && (
            <div className="mt-4">
              <p className="text-sm mb-2">Silakan scan QRIS berikut dan upload bukti pembayaran</p>
              <img src="/qris.jpg" alt="QRIS" className="w-48" />
              <input type="file" className="mt-2" accept="image/*" onChange={(e) => setBukti(e.target.files[0])} />
            </div>
          )}

          {items.some((item) => item.jenis === 'sewa') && (
            <div className="mt-4">
              <label className="block text-sm font-medium">Pilih Durasi Sewa</label>
              <DatePicker
                selectsRange
                startDate={tanggalSewa?.[0]}
                endDate={tanggalSewa?.[1]}
                onChange={(update) => setTanggalSewa(update)}
                withPortal
                className="w-full border rounded p-2"
              />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Tentukan Lokasi Anda</label>
          <MapContainer center={[lokasi.lat, lokasi.lng]} zoom={15} style={{ height: 300 }}>
            <TileLayer
              attribution="OpenStreetMap"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker
              draggable
              position={[lokasi.lat, lokasi.lng]}
              eventHandlers={{
                dragend: (e) => {
                  const { lat, lng } = e.target.getLatLng();
                  setLokasi({ lat, lng });
                },
              }}
            />
            <LocationMarker setLatLng={setLokasi} />
          </MapContainer>
          <ReverseGeocodeUpdater lokasi={lokasi} setAlamat={setAlamat} />
        </div>
      </div>

      {/* Ringkasan Pesanan */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-2 text-green-700">Ringkasan Pesanan</h3>
        <ul className="divide-y border rounded">
          {items.map((item, index) => (
            <li key={index} className="p-4 flex justify-between items-start">
              <div>
                <p className="font-medium">{item.nama}</p>
                <p className="text-sm text-gray-500">
                  {item.jenis === 'sewa' ? 'Disewa' : 'Dibeli'} - Rp {item.jenis === 'sewa'
                    ? `${item.harga_sewa.toLocaleString('id-ID')} / hari`
                    : item.harga_beli.toLocaleString('id-ID')}
                </p>
              </div>
              {item.gambar && (
                <img
                  src={item.gambar}
                  alt={item.nama}
                  className="w-16 h-16 object-cover rounded ml-4"
                />
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 space-y-1">
        <p className="text-gray-600">Jarak dari toko: {jarakKm.toFixed(2)} km</p>
        <p className="text-gray-600">Ongkir: Rp {ongkir.toLocaleString('id-ID')}</p>
        <h3 className="text-xl font-semibold">
          Total: Rp {totalHarga.toLocaleString('id-ID')}
        </h3>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-green-700 text-white px-6 py-2 rounded hover:bg-green-800 mt-2"
        >
          {loading ? 'Memproses...' : 'Checkout'}
        </button>
      </div>
    </div>
  );
}
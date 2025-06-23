import React from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { motion } from "framer-motion";
import 'swiper/css';
import 'swiper/css/pagination';
import {
  Tractor,
  Package,
  Settings,
  MessageCircle
} from 'lucide-react';

const Home = () => {
  return (
    <main className="font-sans bg-white">
      {/* HERO */}
      <section className="pt-28 pb-20 bg-white text-[#2e5339] flex flex-col md:flex-row items-center justify-between px-6 md:px-20 gap-6 md:gap-10">
        {/* LEFT: Text Content */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">
            Revolusi Pertanian Cerdas <br /> Bersama <span className="text-[#31944f]">SEMBUR</span>
          </h1>
          <p className="text-lg md:text-lg mb-6 text-[#2e5339]">
            Solusi sewa & beli alat IoT pertanian untuk petani modern. Praktis, hemat, dan efisien.
          </p>
          <button className="px-3 py-3 bg-[#2d3b2f] text-white font-semibold rounded-full hover:bg-[#456149] transition">
            Jelajahi Produk
          </button>
        </div>

        {/* RIGHT: Gambar ilustrasi */}
<div className="flex-1 flex justify-center mt-4 md:mt-0">
  <img
    src="/hero.png"
    alt="Ilustrasi IoT Pertanian"
    className="w-72 md:w-96 object-contain"
  />
</div>

      </section>

      {/* STATISTIK */}
      <section className="bg-[#2e5339] py-16 px-6 md:px-24">
        <h2 className="text-3xl font-bold text-center mb-10 text-white">Statistik SEMBUR</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { label: 'Petani Terdaftar', value: '11.830' },
            { label: 'Alat Tersedia', value: '1.230+' },
            { label: 'Transaksi Berhasil', value: '6.430' },
            { label: 'Konsultasi Selesai', value: '940+' },
          ].map((item, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow p-6 border border-[#e0e0e0]">
              <h3 className="text-4xl font-bold text-[#5a3d1f] mb-2">{item.value}</h3>
              <p className="text-[#2e5339]/80 font-medium">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* KATEGORI PRODUK */}
      <section className="bg-white py-16 px-6 md:px-20">
        <h2 className="text-3xl md:text-4xl font-bold text-[#2d3b2f] text-center mb-12">
          Kategori Produk
        </h2>
              
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Alat Satuan */}
          <Link to="/satuan" className="group">
          <div className="bg-[#f5f3f0] shadow-md rounded-xl p-6 hover:scale-105 transition text-center">
            <Tractor size={48} className="mx-auto text-[#3a4b3c]" />
            <h3 className="text-xl font-semibold text-[#3a4b3c] mt-4">Alat Satuan</h3>
            <p className="text-sm text-[#4e5c50] mt-2">
              Sewa atau beli alat pertanian per unit sesuai kebutuhan tanamanmu.
            </p>
          </div>
          </Link>
              
          {/* Alat Paket */}
          <Link to="/paket" className="group">
          <div className="bg-[#f5f3f0] shadow-md rounded-xl p-6 hover:scale-105 transition text-center">
            <Package size={48} className="mx-auto text-[#3a4b3c]" />
            <h3 className="text-xl font-semibold text-[#3a4b3c] mt-4">Alat Paket</h3>
            <p className="text-sm text-[#4e5c50] mt-2">
              Paket alat lengkap untuk pengelolaan pertanian secara menyeluruh.
            </p>
          </div>
        </Link>
              
          {/* Kustom */}
          <div className="bg-[#f5f3f0] shadow-md rounded-xl p-6 hover:scale-105 transition text-center">
            <Settings size={48} className="mx-auto text-[#3a4b3c]" />
            <h3 className="text-xl font-semibold text-[#3a4b3c] mt-4">Kustom</h3>
            <p className="text-sm text-[#4e5c50] mt-2">
              Rancang alat IoT sesuai kebutuhan lahan atau bisnis kamu.
            </p>
          </div>
              
          {/* Konsultasi */}
          <Link to="https://wa.me/6281234567890" className="group">
          <div className="bg-[#f5f3f0] shadow-md rounded-xl p-6 hover:scale-105 transition text-center">
            <MessageCircle size={48} className="mx-auto text-[#3a4b3c]" />
            <h3 className="text-xl font-semibold text-[#3a4b3c] mt-4">Konsultasi</h3>
            <p className="text-sm text-[#4e5c50] mt-2">
              Konsultasi gratis tentang alat dan pengelolaan pertanian modern.
            </p>
          </div>
          </Link>
        </div>
      </section>

      {/* TESTIMONI */}
      <section className="py-20 px-6 md:px-24 bg-[#2e5339] text-white">
        <h2 className="text-4xl font-bold text-center mb-14">
          Kenapa Memilih <span className="text-[#2cad50]">SEMBUR</span>?
        </h2>

        <div className="grid md:grid-cols-3 gap-10 text-center">
          {/* Card 1 */}
          <motion.div 
            whileHover={{ y: -5 }} 
            transition={{ type: "spring", stiffness: 200 }} 
            className="bg-white p-8 rounded-3xl shadow-md hover:shadow-lg flex flex-col items-center"
          >
            <div className="w-14 h-14 mb-5 flex items-center justify-center rounded-full bg-[#4a6351]/10 text-3xl">⚙️</div>
            <h3 className="text-xl font-semibold mb-3 text-[#2e5339]">Efisiensi Tinggi</h3>
            <p className="text-sm leading-relaxed text-[#444]">
              Pantau dan kendalikan alat pertanian berbasis IoT langsung dari dashboard. Hemat waktu & tenaga.
            </p>
          </motion.div>

          {/* Card 2 */}
          <motion.div 
            whileHover={{ y: -5 }} 
            transition={{ type: "spring", stiffness: 200, delay: 0.1 }} 
            className="bg-white p-8 rounded-3xl shadow-md hover:shadow-lg flex flex-col items-center"
          >
            <div className="w-14 h-14 mb-5 flex items-center justify-center rounded-full bg-[#4a6351]/10 text-3xl">📦</div>
            <h3 className="text-xl font-semibold mb-3 text-[#2e5339]">Sewa atau Beli</h3>
            <p className="text-sm leading-relaxed text-[#444]">
              Pilih menyewa untuk jangka pendek atau beli untuk investasi jangka panjang. SEMBUR fleksibel!
            </p>
          </motion.div>

          {/* Card 3 */}
          <Link to="https://wa.me/6281234567890" className="group">
          <motion.div 
            whileHover={{ y: -5 }} 
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }} 
            className="bg-white p-8 rounded-3xl shadow-md hover:shadow-lg flex flex-col items-center"
          >
            <div className="w-14 h-14 mb-5 flex items-center justify-center rounded-full bg-[#4a6351]/10 text-3xl">💬</div>
            <h3 className="text-xl font-semibold mb-3 text-[#2e5339]">Konsultasi Gratis</h3>
            <p className="text-sm leading-relaxed text-[#444]">
              Diskusi langsung dengan tim ahli kami mengenai alat terbaik untuk lahan dan kebutuhanmu.
            </p>
          </motion.div>
          </Link>
        </div>
      </section>

      {/* CTA JOIN */}
<section className="py-24 px-6 md:px-24 bg-white text-center text-[#2e5339]">
  <div className="max-w-2xl mx-auto">
    <h2 className="text-3xl md:text-4xl font-bold mb-6">
      Gabung Bersama <span className="text-[#2cad50]">Petani Modern</span> Lainnya!
    </h2>
    <p className="text-md md:text-lg mb-8 text-[#3c4b3f]">
      Dapatkan kemudahan, efisiensi, dan dukungan teknologi canggih dalam setiap langkah pertanianmu. Ayo jadi bagian dari revolusi pertanian digital!
    </p>
    <Link 
      to="/register" 
      className="inline-block px-8 py-4 bg-[#2e5339] hover:bg-[#42945b] text-white rounded-full text-lg font-bold transition duration-300 shadow-md hover:shadow-lg"
    >
      Daftar Sekarang
    </Link>
  </div>
</section>

    </main>
  );
};

export default Home;

import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#0d1b12] text-white pt-20">
      <div className="max-w-7xl mx-auto px-6 md:px-10 grid grid-cols-1 md:grid-cols-4 gap-12">
        
        {/* Brand Info */}
        <div>
          <h2 className="text-3xl font-bold text-green-400 mb-4">SEMBUR</h2>
          <p className="text-gray-300 leading-relaxed text-sm">
            Solusi digital pertanian: sewa & beli alat IoT modern.
            Bantu petani lebih efisien, cerdas, dan produktif.
          </p>
        </div>

        {/* Menu */}
        <div>
          <h3 className="text-lg font-semibold mb-5 text-green-300">Menu</h3>
          <ul className="space-y-3 text-gray-300 text-sm">
            <li><Link to="/" className="hover:text-green-400 transition">Beranda</Link></li>
            <li><Link to="/satuan" className="hover:text-green-400 transition">Alat Satuan</Link></li>
            <li><Link to="/paket" className="hover:text-green-400 transition">Alat Paket</Link></li>
          </ul>
        </div>

        {/* Kontak */}
        <div>
          <h3 className="text-lg font-semibold mb-5 text-green-300">Kontak</h3>
          <ul className="space-y-3 text-sm text-gray-300">
            <li><span className="font-medium">Email:</span> sembur@iot.id</li>
            <li><span className="font-medium">Telp:</span> +62 812-3456-7890</li>
            <li><span className="font-medium">Alamat:</span> Semarang, Indonesia</li>
          </ul>
        </div>

        {/* Sosial Media */}
        <div>
          <h3 className="text-lg font-semibold mb-5 text-green-300">Ikuti Kami</h3>
          <div className="flex items-center space-x-5 text-white text-xl">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="hover:text-green-400 transition"
            >
              <FaFacebookF size={20} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="hover:text-green-400 transition"
            >
              <FaInstagram size={20} />
            </a>
            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="hover:text-green-400 transition"
            >
              <FaWhatsapp size={20} />
            </a>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="mt-16 border-t border-green-900 pt-6 pb-10 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} <span className="text-green-400 font-semibold">SEMBUR</span> — Agritech by Indonesians.
      </div>
    </footer>
  );
}

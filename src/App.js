import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './components/common/Navbar';     // sesuaikan jika beda folder
import Footer from './components/common/Footer';     // sesuaikan jika beda folder
import GantiPassword from './pages/GantiPassword';
import AlatSatuan from './pages/AlatSatuan';
import AlatPaketan from './pages/AlatPaketan';
import CheckoutPage from './pages/CheckoutPage';
import './index.css';
import ProdukDetailPage from './pages/ProdukDetailPage';
import FormTambahProduk from './pages/FormTambahProduk';


function App() {
  return (
    <Router>
      <div className="relative bg-pattern min-h-screen flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/ganti-password" element={<GantiPassword />} />
            <Route path="/satuan" element={<AlatSatuan />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/produk/:id" element={<ProdukDetailPage />} />
            <Route path="/paket" element={<AlatPaketan />} />
            <Route path="/tambah" element={<FormTambahProduk />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
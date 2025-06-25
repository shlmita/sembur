import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import GantiPassword from './pages/GantiPassword';
import AlatSatuan from './pages/AlatSatuan';
import AlatPaketan from './pages/AlatPaketan';
import CheckoutPage from './pages/CheckoutPage';
import ProdukDetailPage from './pages/ProdukDetailPage';
import FormTambahProduk from './pages/FormTambahProduk';
import DashboardAdmin from './pages/admin/Dashboard';
import AdminLayout from './pages/admin/AdminLayout';
import AdminPaketan from './pages/admin/AlatKelompok';
import AdminSatuan from './pages/admin/AlatSatuan';
import Pembayaran from './pages/admin/Payment';
import AdminLogin from './pages/admin/Login'; // Tambah
import ProtectedRoute from './pages/admin/ProtectedRoute';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* === ADMIN ROUTE (tanpa Navbar/Footer user) === */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route index element={<DashboardAdmin />} />
          <Route path="paketan" element={<AdminPaketan />} />
          <Route path="satuan" element={<AdminSatuan />} />
          <Route path="pembayaran" element={<Pembayaran />} />
        </Route>

        {/* === USER ROUTES === */}
        <Route
          path="*"
          element={
            <div className="relative bg-pattern min-h-screen flex flex-col">
              <Navbar />

              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/ganti-password" element={<GantiPassword />} />
                  <Route path="/satuan" element={<AlatSatuan />} />
                  <Route path="/paket" element={<AlatPaketan />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/produk/:id" element={<ProdukDetailPage />} />
                  <Route path="/tambah" element={<FormTambahProduk />} />
                </Routes>
              </main>

              <Footer />
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

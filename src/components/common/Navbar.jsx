import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User2 } from 'lucide-react';
import { supabase } from '../../services/supabaseClient';

const navItems = [
  { name: 'Beranda', path: '/' },
  { name: 'Alat Satuan', path: '/satuan' },
  { name: 'Alat Paket', path: '/paket' },
];

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const isHome = location.pathname === '/';

  // Scroll effect (optional)
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    if (isHome) window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHome]);

  // Get user on load + session listener
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        setUser(null);
        setProfile(null);
        return;
      }

      setUser(user);

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError.message);
        setProfile(null);
      } else {
        setProfile(profile);
      }
    };

    getUser(); // panggil saat mount

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      getUser(); // panggil ulang kalau auth berubah
    });

    return () => {
      listener.subscription.unsubscribe(); // bersihkan listener
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut(); // logout dari Supabase
    localStorage.removeItem('user_id'); // opsional
    setUser(null);
    setProfile(null);
    navigate('/login');
  };

  const navbarStyle = () => {
    if (!isHome) return 'bg-white shadow-md';
    return scrolled ? 'bg-white shadow-md' : 'bg-transparent';
  };

  const userDisplayName =
    profile?.full_name ||
    user?.user_metadata?.full_name ||
    user?.email?.split('@')[0] ||
    'Pengguna';

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition duration-300 ease-in-out ${navbarStyle()}`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-extrabold text-green-700 tracking-wider">
          SEMBUR
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex space-x-6 items-center">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`text-sm font-medium ${
                location.pathname === item.path
                  ? 'text-green-700 border-b-2 border-green-700'
                  : 'text-gray-700'
              } hover:text-green-700 transition`}
            >
              {item.name}
            </Link>
          ))}
          {user ? (
            <div className="relative group">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 text-sm text-gray-700 hover:text-green-700"
              >
                <User2 className="w-5 h-5 text-green-700" />
                {userDisplayName}
                <svg
                  className={`w-4 h-4 transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-md py-2 z-50 animate-slide-down">
                  <Link
                    to="/ganti-password"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Ganti Password
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="ml-4 px-4 py-2 bg-green-700 text-white rounded-full hover:bg-green-800 transition"
            >
              Masuk
            </Link>
          )}
        </nav>

        {/* Mobile Toggle */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-green-700">
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-md animate-slide-down">
          <div className="flex flex-col px-6 py-4 space-y-3">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`py-2 border-b font-medium ${
                  location.pathname === item.path ? 'text-green-700' : 'text-gray-700'
                } hover:text-green-700`}
                onClick={() => setMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            {user ? (
              <div className="pt-2 border-t border-gray-200 mt-2">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="w-full flex justify-between items-center px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition"
                >
                  <div className="flex items-center gap-2">
                    <User2 className="w-5 h-5 text-green-700" />
                    <span>{userDisplayName}</span>
                  </div>
                  <svg
                    className={`w-4 h-4 transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {userDropdownOpen && (
                  <div className="ml-6 mt-1 space-y-1 animate-slide-down">
                    <Link
                      to="/ganti-password"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        setMenuOpen(false);
                      }}
                      className="block text-sm text-gray-700 hover:bg-gray-100 rounded-md px-2 py-1"
                    >
                      Ganti Password
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setUserDropdownOpen(false);
                        setMenuOpen(false);
                      }}
                      className="block w-full text-left text-sm text-red-500 hover:bg-gray-100 rounded-md px-2 py-1"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-green-700 text-white text-center py-2 rounded-full hover:bg-green-800 transition"
                onClick={() => setMenuOpen(false)}
              >
                Masuk
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

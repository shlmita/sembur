import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  HomeIcon,
  CubeIcon,
  CreditCardIcon,
  XMarkIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  ArrowRightOnRectangleIcon // <- Tambah ikon logout
} from '@heroicons/react/24/outline';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isProductSubMenuOpen, setIsProductSubMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;
  const isProductActive = location.pathname.startsWith('/admin/satuan') || location.pathname.startsWith('/admin/paketan');

  useEffect(() => {
    setIsProductSubMenuOpen(isProductActive);
  }, [isProductActive]);

  const toggleProductSubMenu = () => {
    setIsProductSubMenuOpen(!isProductSubMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdminLoggedIn');
    navigate('/admin/login');
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      <div
        className={`
          flex flex-col h-screen bg-gray-800 text-white w-64 p-4
          fixed inset-y-0 left-0 z-40 shadow-lg
          transform transition-transform duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        <div className="flex justify-end lg:hidden">
          <button onClick={toggleSidebar} className="p-2 text-gray-400 hover:text-white">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="flex items-center justify-center h-16 border-b border-gray-700">
          <h1 className="text-2xl font-semibold">Admin Panel</h1>
        </div>

        <nav className="flex-1 mt-6">
          <ul>
            <li className="mb-2">
              <Link
                to="/admin"
                onClick={toggleSidebar}
                className={`flex items-center p-2 rounded-md transition duration-200 ${
                  isActive('/admin') ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <HomeIcon className="h-5 w-5 mr-3" />
                Dashboard
              </Link>
            </li>

            <li className="mb-2">
              <div
                className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition duration-200 ${
                  isProductActive ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
                onClick={toggleProductSubMenu}
              >
                <div className="flex items-center flex-grow">
                  <CubeIcon className="h-5 w-5 mr-3" />
                  Product
                </div>
                {isProductSubMenuOpen ? (
                  <ChevronUpIcon className="h-5 w-5 ml-2" />
                ) : (
                  <ChevronDownIcon className="h-5 w-5 ml-2" />
                )}
              </div>
              {isProductSubMenuOpen && (
                <ul className="ml-8 mt-2 space-y-1">
                  <li>
                    <Link
                      to="/admin/satuan"
                      onClick={toggleSidebar}
                      className={`block p-2 rounded-md text-sm transition duration-200 ${
                        isActive('/admin/satuan') ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                      }`}
                    >
                      Alat Satuan
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/paketan"
                      onClick={toggleSidebar}
                      className={`block p-2 rounded-md text-sm transition duration-200 ${
                        isActive('/admin/paketan') ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                      }`}
                    >
                      Alat Kelompok
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            <li className="mb-2">
              <Link
                to="/admin/pembayaran"
                onClick={toggleSidebar}
                className={`flex items-center p-2 rounded-md transition duration-200 ${
                  isActive('/admin/pembayaran') ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <CreditCardIcon className="h-5 w-5 mr-3" />
                Pembayaran
              </Link>
            </li>
          </ul>
        </nav>

        {/* Tombol Logout */}
        <div className="mt-auto pt-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center w-full p-2 rounded-md text-red-400 hover:bg-red-600 hover:text-white transition duration-200"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3" />
            Logout
          </button>
          <p className="mt-4 text-sm text-gray-500 text-center">&copy; 2025 Your Company</p>
        </div>
      </div>
    </>
  );
};

export default Sidebar;

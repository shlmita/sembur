import Sidebar from './SidebarAdmin';
import { Outlet } from 'react-router-dom';
import { useState } from 'react';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Konten utama */}
      <div
        className={`
          flex-1 min-h-screen bg-gray-100 transition-all duration-300
          ${isSidebarOpen ? 'pl-64' : 'lg:pl-64'}
        `}
      >
        {/* Tombol Sidebar untuk mobile */}
        <div className="lg:hidden p-2">
          <button onClick={toggleSidebar} className="text-gray-600 text-xl">
            ☰
          </button>
        </div>

        <div className="p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;

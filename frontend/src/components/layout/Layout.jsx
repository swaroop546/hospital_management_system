import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopNavbar } from './TopNavbar';
import { useAuth } from '../../context/useAuth';

export const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  useAuth();

  return (
    <div className="app-shell min-h-screen bg-slate-50 text-slate-800 flex flex-col antialiased">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main container offset by sidebar on large screens */}
      <div className="lg:pl-[17rem] flex flex-col flex-1 min-h-screen">
        <TopNavbar onOpenSidebar={() => setSidebarOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-9 max-w-[1500px] w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

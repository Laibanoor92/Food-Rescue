import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
// Replace Heroicon Bars3Icon with MUI Menu icon
import MenuIcon from '@mui/icons-material/Menu';

const VolunteerDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="lg:pl-72"> {/* Adjust padding to match sidebar width */}
        {/* Sticky Header for Mobile */}
        <div className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:hidden">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <MenuIcon className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="flex-1 text-sm font-semibold leading-6 text-gray-900">
            Volunteer Dashboard
          </div>
          {/* Optional: Add Avatar/Profile icon here for mobile header */}
        </div>

        {/* Main Content Area */}
        <main className="py-6 lg:py-8">
          <div className="px-4 sm:px-6 lg:px-8">
            {/* Outlet renders the matched child route component */}
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default VolunteerDashboard;
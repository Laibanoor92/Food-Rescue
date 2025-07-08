import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useLocation } from 'react-router-dom';

const DonorLayout = () => {
  const location = useLocation();
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 ml-64 p-8 overflow-auto" key={location.pathname}>
        <Outlet />
      </div>
    </div>
  );
};

export default DonorLayout;
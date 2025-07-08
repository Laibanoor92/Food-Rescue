// import React from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import { 
//   HomeIcon, 
//   PlusCircleIcon, 
//   ClockIcon, 
//   TruckIcon, 
//   UserIcon, 
//   LogoutIcon 
// } from '@heroicons/react/outline';

// const Sidebar = () => {
//   const location = useLocation();
  
//   const menuItems = [
//     {
//       path: '/donor/dashboard',
//       name: 'Dashboard',
//       icon: <HomeIcon className="w-6 h-6" />
//     },
//     {
//       path: '/donor/create-donation',
//       name: 'Create Donation',
//       icon: <PlusCircleIcon className="w-6 h-6" />
//     },
//     {
//       path: '/donor/donation-history',
//       name: 'Donation History',
//       icon: <ClockIcon className="w-6 h-6" />
//     },
//     // {
//     //   path: '/donor/track-donation',
//     //   name: 'Track Donation',
//     //   icon: <TruckIcon className="w-6 h-6" />
//     // },
//     {
//       path: '/donor/profile',
//       name: 'Profile',
//       icon: <UserIcon className="w-6 h-6" />
//     }
//   ];

//   const handleLogout = () => {
//     // Clear auth tokens and redirect to login page
//     localStorage.removeItem('token');
//     window.location.href = '/login';
//   };

//   return (
//     <div className="bg-white h-screen w-64 shadow-lg fixed left-0 top-0">
//       <div className="flex items-center justify-center h-16 border-b">
//         <h2 className="text-xl font-bold text-green-600">Food Rescue</h2>
//       </div>
      
//       <div className="px-4 py-6">
//         <p className="text-xs uppercase text-gray-500 mb-4 tracking-wider">Menu</p>
//         <ul>
//           {menuItems.map((item, index) => (
//             <li key={index} className="mb-2">
//               <Link 
//                 to={item.path} 
//                 className={`flex items-center px-4 py-3 rounded-lg hover:bg-green-50 transition-colors ${
//                   location.pathname === item.path ? 'bg-green-100 text-green-600' : 'text-gray-600'
//                 }`}
//               >
//                 <span className="mr-3">{item.icon}</span>
//                 <span>{item.name}</span>
//               </Link>
//             </li>
//           ))}
//         </ul>
        
//         <div className="mt-auto pt-8">
//           <button 
//             onClick={handleLogout}
//             className="flex items-center px-4 py-3 text-red-500 hover:bg-red-50 rounded-lg w-full"
//           >
//             <LogoutIcon className="w-6 h-6 mr-3" />
//             <span>Logout</span>
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;

import React from 'react';
import { NavLink, useLocation,Link } from 'react-router-dom';
import { 
  HomeIcon, 
  PlusCircleIcon, 
  ClockIcon, 
  UserIcon, 
  LogoutIcon 
} from '@heroicons/react/outline';

const Sidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    {
      path: '/donor/dashboard',
      name: 'Dashboard',
      icon: <HomeIcon className="w-6 h-6" />
    },
    {
      path: '/donor/create-donation',
      name: 'Create Donation',
      icon: <PlusCircleIcon className="w-6 h-6" />
    },
    {
      path: '/donor/donation-history',
      name: 'Donation History',
      icon: <ClockIcon className="w-6 h-6" />
    },
    {
      path: '/donor/profile',
      name: 'Profile',
      icon: <UserIcon className="w-6 h-6" />
    }
  ];

  const handleLogout = () => {
    // Clear auth tokens and redirect to login page
    localStorage.removeItem('token');
    window.location.href = '/signin'; // Make sure this matches your login route
  };

  return (
    <div className="bg-white h-screen w-64 shadow-lg fixed left-0 top-0 z-10">
      <div className="flex items-center justify-center h-16 border-b">
       <Link to="/">
      <h2 className="text-xl font-bold text-green-600 cursor-pointer">Food Rescue</h2>
       </Link>
     </div>
      
      <div className="px-4 py-6 flex flex-col h-[calc(100%-4rem)]">
        <p className="text-xs uppercase text-gray-500 mb-4 tracking-wider">Menu</p>
        <ul className="flex-grow">
          {menuItems.map((item, index) => (
            <li key={index} className="mb-2">
              <NavLink 
                to={item.path} 
                className={({ isActive }) => `flex items-center px-4 py-3 rounded-lg hover:bg-green-50 transition-colors ${
                  isActive ? 'bg-green-100 text-green-600' : 'text-gray-600'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
        
        <div className="mt-auto">
          <button 
            onClick={handleLogout}
            className="flex items-center px-4 py-3 text-red-500 hover:bg-red-50 rounded-lg w-full"
          >
            <LogoutIcon className="w-6 h-6 mr-3" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
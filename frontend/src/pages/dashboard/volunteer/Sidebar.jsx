// import React from 'react';
// import { NavLink, useNavigate } from 'react-router-dom';
// import {
//   HomeOutlined as HomeIcon,
//   ListAltOutlined as ListBulletIcon,
//   AccessTimeOutlined as ClockIcon,
//   MapOutlined as MapIcon,
//   StarsOutlined as SparklesIcon,
//   PersonOutline as UserCircleIcon,
//   HelpOutline as QuestionMarkCircleIcon,
//   LogoutOutlined as ArrowLeftOnRectangleIcon,
//   CloseOutlined as XMarkIcon
// } from '@mui/icons-material';

// const navigation = [
//   { name: 'Dashboard', href: '/volunteer/dashboard', icon: HomeIcon },
//   { name: 'Upcoming Tasks', href: '/volunteer/upcoming', icon: ListBulletIcon },
//   { name: 'Available Tasks', href: '/volunteer/available', icon: SparklesIcon },
//   { name: 'Task History', href: '/volunteer/history', icon: ClockIcon },
//   { name: 'Map View', href: '/volunteer/map', icon: MapIcon },
//   { name: 'My Profile', href: '/volunteer/profile', icon: UserCircleIcon },
//   { name: 'Help & Support', href: '/volunteer/help', icon: QuestionMarkCircleIcon },
// ];

// function classNames(...classes) {
//   return classes.filter(Boolean).join(' ');
// }

// const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     console.log('Logout initiated');
//     // Add actual logout logic here (clear tokens, call API, etc.)
//     navigate('/login'); // Redirect after logout
//   };

//   return (
//     <>
//       {/* Overlay for mobile */}
//       <div
//         className={`fixed inset-0 z-30 bg-gray-900/50 transition-opacity duration-300 lg:hidden ${
//           sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
//         }`}
//         onClick={() => setSidebarOpen(false)}
//         aria-hidden="true"
//       ></div>

//       {/* Sidebar */}
//       <div
//         className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col bg-white shadow-lg transition-transform duration-300 lg:translate-x-0 lg:shadow-none lg:border-r lg:border-gray-200 ${
//           sidebarOpen ? 'translate-x-0' : '-translate-x-full'
//         }`}
//       >
//         {/* Logo and Close Button */}
//         <div className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 px-6">
//           <span className="text-xl font-bold text-primary">Food Rescue</span>
//           <button
//             type="button"
//             className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
//             onClick={() => setSidebarOpen(false)}
//           >
//             <span className="sr-only">Close sidebar</span>
//             <XMarkIcon className="h-6 w-6" aria-hidden="true" />
//           </button>
//         </div>

//         {/* Navigation */}
//         <nav className="flex flex-1 flex-col overflow-y-auto px-4 py-4">
//           <ul role="list" className="flex flex-1 flex-col gap-y-7">
//             <li>
//               <ul role="list" className="-mx-2 space-y-1">
//                 {navigation.map((item) => (
//                   <li key={item.name}>
//                     <NavLink
//                       to={item.href}
//                       end={item.href === '/volunteer/dashboard'}
//                       className={({ isActive }) =>
//                         classNames(
//                           isActive
//                             ? 'bg-primary-50 text-primary'
//                             : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900',
//                           'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-medium transition-colors duration-150'
//                         )
//                       }
//                       onClick={() => setSidebarOpen(false)}
//                     >
//                       <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
//                       {item.name}
//                     </NavLink>
//                   </li>
//                 ))}
//               </ul>
//             </li>

//             {/* Logout Button */}
//             <li className="mt-auto -mx-2">
//               <button
//                 onClick={handleLogout}
//                 className="group flex w-full gap-x-3 rounded-md p-2 text-sm leading-6 font-medium text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors duration-150"
//               >
//                 <ArrowLeftOnRectangleIcon className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-red-600" aria-hidden="true" />
//                 Logout
//               </button>
//             </li>
//           </ul>
//         </nav>
//       </div>
//     </>
//   );
// };

// export default Sidebar;


import React, { useContext } from 'react'; // Import useContext
import { NavLink, useNavigate } from 'react-router-dom';
import {
  HomeOutlined as HomeIcon,
  ListAltOutlined as ListBulletIcon,
  AccessTimeOutlined as ClockIcon,
  MapOutlined as MapIcon,
  StarsOutlined as SparklesIcon,
  PersonOutline as UserCircleIcon,
  HelpOutline as QuestionMarkCircleIcon,
  LogoutOutlined as ArrowLeftOnRectangleIcon,
  CloseOutlined as XMarkIcon
} from '@mui/icons-material';
import { AuthContext } from '../../../contexts/AuthContext'; // Adjust path to your AuthContext

const navigation = [
  { name: 'Dashboard', href: './', icon: HomeIcon }, // Use relative paths
  { name: 'Upcoming Tasks', href: 'upcoming', icon: ListBulletIcon },
  { name: 'Available Tasks', href: 'available', icon: SparklesIcon },
  { name: 'Task History', href: 'history', icon: ClockIcon },
  { name: 'Map View', href: 'map', icon: MapIcon },
  { name: 'My Profile', href: 'profile', icon: UserCircleIcon },
  { name: 'Help & Support', href: 'help', icon: QuestionMarkCircleIcon },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext); // Get logout function from context

  const handleLogout = async () => {
    console.log('Logout initiated');
    try {
      // Call the logout function from your AuthContext
      // This function should handle clearing tokens, context state, and potentially calling a backend logout endpoint
      await logout();
      // Navigate to login page after successful logout
      navigate('/signin', { replace: true }); // Use replace to prevent going back to dashboard
    } catch (error) {
      console.error('Logout failed:', error);
      // Optionally show an error message to the user
    }
  };

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 z-30 bg-gray-900/50 transition-opacity duration-300 lg:hidden ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      ></div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col bg-white shadow-lg transition-transform duration-300 lg:translate-x-0 lg:shadow-none lg:border-r lg:border-gray-200 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo and Close Button */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 px-6">
          {/* Consider making the logo a link to the dashboard */}
          <NavLink to="./" className="text-xl font-bold text-primary" onClick={() => setSidebarOpen(false)}>
             Food Rescue
          </NavLink>
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <span className="sr-only">Close sidebar</span>
            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col overflow-y-auto px-4 py-4">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <NavLink
                      to={item.href}
                      // end // 'end' prop might be needed depending on your routing setup for the base dashboard path
                      className={({ isActive }) =>
                        classNames(
                          isActive
                            ? 'bg-primary-50 text-primary' // Use your theme colors
                            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900',
                          'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-medium transition-colors duration-150'
                        )
                      }
                      // Close sidebar on mobile after navigation
                      onClick={() => { if (window.innerWidth < 1024) setSidebarOpen(false); }}
                    >
                      <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                      {item.name}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </li>

            {/* Logout Button */}
            <li className="mt-auto -mx-2">
              <button
                onClick={handleLogout}
                className="group flex w-full gap-x-3 rounded-md p-2 text-sm leading-6 font-medium text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors duration-150"
              >
                <ArrowLeftOnRectangleIcon className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-red-600" aria-hidden="true" />
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;

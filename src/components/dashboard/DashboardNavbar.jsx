import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';

const DashboardNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      // Redirect or show a message after logout if needed
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Check if the current route is within the dashboard path
  const isDashboardRoute = location.pathname.startsWith('/dashboard');

  // Only render this navbar if it's a dashboard route and the user is logged in
  if (!isDashboardRoute || !currentUser) {
    return null; // Or render a minimal placeholder/loading state if preferred
  }

  return (
    <nav className='bg-green-50 shadow-sm'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between h-16 items-center'>
          {/* Logo */}
          <div className='flex-shrink-0'>
            <Link to='/dashboard' className='flex items-center'>
              {/* You might want a different logo for the dashboard */}
              <div className='h-8 w-8 rounded-full bg-green-500 mr-2'></div>
              <span className='text-xl font-bold text-gray-800'>TruCare</span>
            </Link>
          </div>

          {/* Navigation Links (Desktop) */}
          <div className='hidden md:flex md:items-center md:space-x-6'>
            <Link to='/dashboard' className='text-gray-600 hover:text-gray-800 text-sm font-medium'>Home</Link>
            <Link to='/dashboard/tests' className='text-gray-600 hover:text-gray-800 text-sm font-medium'>Tests</Link>
            <Link to='/dashboard/profile' className='text-gray-600 hover:text-gray-800 text-sm font-medium'>Profile</Link>
            <Link to='/dashboard/contact' className='text-gray-600 hover:text-gray-800 text-sm font-medium'>Contact</Link>
          </div>

          {/* Auth Buttons */}
          <div className='flex items-center space-x-4'>
            <div className='hidden md:flex md:items-center md:space-x-4'>
              {/* Logout button - assuming user is always logged in when this navbar is shown */}
                <button
                  onClick={handleLogout}
                  className='inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50'>
                  Logout
                </button>
            </div>

            {/* Hamburger Menu (Mobile) */}
            <div className='-mr-2 flex md:hidden'>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                type='button'
                className='inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none'
                aria-controls='mobile-menu'
                aria-expanded={menuOpen}
              >
                <span className='sr-only'>Open main menu</span>
                {menuOpen ? (
                  <svg className='h-6 w-6' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M6 18L18 6M6 6l12 12' />
                  </svg>
                ) : (
                  <svg className='h-6 w-6' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M4 6h16M4 12h16M4 18h16' />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
  <div
    id="mobile-menu"
    className="md:hidden bg-white shadow-md px-4 pt-4 pb-6 space-y-3 transition-all duration-300 ease-in-out animate-slideDown"
  >
    <Link
      to="/dashboard"
      className="block text-gray-800 px-4 py-2 rounded-lg text-base font-semibold hover:bg-green-100 transition duration-200"
    >
      Home
    </Link>
    <Link
      to="/dashboard/tests"
      className="block text-gray-800 px-4 py-2 rounded-lg text-base font-semibold hover:bg-green-100 transition duration-200"
    >
      Tests
    </Link>
     <Link
      to="/dashboard/profile"
      className="block text-gray-800 px-4 py-2 rounded-lg text-base font-semibold hover:bg-green-100 transition duration-200"
    >
      Profile
    </Link>
     <Link
      to="/dashboard/contact"
      className="block text-gray-800 px-4 py-2 rounded-lg text-base font-semibold hover:bg-green-100 transition duration-200"
    >
      Contact
    </Link>
    <div className="space-y-2">
         <button className="w-full text-left px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition duration-200" onClick={handleLogout}>
           Logout
         </button>
    </div>
  </div>
)}

    </nav>
  );
};

export default DashboardNavbar; 
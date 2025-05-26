import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      // Redirect or show a message after logout if needed
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className='bg-green-50 shadow-sm'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between h-16 items-center'>
          {/* Logo */}
          <div className='flex-shrink-0'>
            <Link to='/' className='flex items-center'>
              <div className='h-8 w-8 rounded-full bg-green-500 mr-2'></div>
              <span className='text-xl font-bold text-gray-800'>TruCare</span>
            </Link>
          </div>

          {/* Navigation Links (Desktop) */}
          <div className='hidden md:flex md:items-center md:space-x-6'>
            <Link to='/' className='text-gray-600 hover:text-gray-800 text-sm font-medium'>Home</Link>
            <Link to='/about' className='text-gray-600 hover:text-gray-800 text-sm font-medium'>About</Link>
            <Link to='/services' className='text-gray-600 hover:text-gray-800 text-sm font-medium'>Services</Link>
            <Link to='/contact' className='text-gray-600 hover:text-gray-800 text-sm font-medium'>Contact</Link>
          </div>

          {/* Auth Buttons */}
          <div className='flex items-center space-x-4'>
            <div className='hidden md:flex md:items-center md:space-x-4'>
              {currentUser ? (
                <button
                  onClick={handleLogout}
                  className='inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50'
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link to="/login" className='inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50'>
                    Login
                  </Link>
                  <Link to="/signup" className='inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700'>
                    Sign Up
                  </Link>
                </>
              )}
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
      to="/"
      className="block text-gray-800 px-4 py-2 rounded-lg text-base font-semibold hover:bg-green-100 transition duration-200"
    >
      Home
    </Link>
    <Link
      to="/about"
      className="block text-gray-800 px-4 py-2 rounded-lg text-base font-semibold hover:bg-green-100 transition duration-200"
    >
      About
    </Link>
    <Link
      to="/services"
      className="block text-gray-800 px-4 py-2 rounded-lg text-base font-semibold hover:bg-green-100 transition duration-200"
    >
      Services
    </Link>
    <Link
      to="/contact"
      className="block text-gray-800 px-4 py-2 rounded-lg text-base font-semibold hover:bg-green-100 transition duration-200"
    >
      Contact
    </Link>
    <div className="space-y-2">
      {currentUser ? (
         <button className="w-full text-left px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition duration-200" onClick={handleLogout}>
           Logout
         </button>
      ) : (
        <>
          <Link to="/login" className="w-full text-left px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition duration-200">
            Login
          </Link>
          <Link to="/signup" className="w-full text-left px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition duration-200">
            Sign Up
          </Link>
        </>
      )}
    </div>
  </div>
)}

    </nav>
  );
};

export default Navbar;

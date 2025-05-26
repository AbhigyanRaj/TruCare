import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import DashboardNavbar from '../dashboard/DashboardNavbar';
import Footer from './Footer';

const Layout = ({ children }) => {
  const location = useLocation();

  const isDashboardRoute = location.pathname.startsWith('/dashboard');

  return (
    <div className="min-h-screen flex flex-col">
      <header>
        {isDashboardRoute ? <DashboardNavbar /> : <Navbar />}
      </header>
      <main className="flex-grow">
        {children}
      </main>
      {/* Add a basic footer here later if needed */}
      <Footer />
    </div>
  );
};

export default Layout; 
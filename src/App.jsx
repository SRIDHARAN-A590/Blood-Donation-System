import React, { useState, useEffect } from 'react';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

import { LandingPage } from './pages/LandingPage';
import { DonorsPage } from './pages/DonorsPage';
import { RequestBloodPage } from './pages/RequestBloodPage';
import { BloodBanksPage } from './pages/BloodBanksPage';
import { DashboardPage } from './pages/DashboardPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ContactPage } from './pages/ContactPage';

export function App() {
  const [activePage, setActivePage] = useState('landing');

  // Handle browser back button or hash navigation if user navigates with hash
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (['landing', 'donors', 'requests', 'bloodbanks', 'dashboard', 'login', 'register', 'contact'].includes(hash)) {
        setActivePage(hash);
      }
    };

    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const navigateTo = (page) => {
    setActivePage(page);
    window.location.hash = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderCurrentPage = () => {
    switch (activePage) {
      case 'landing':
        return <LandingPage setActivePage={navigateTo} />;
      case 'donors':
        return <DonorsPage setActivePage={navigateTo} />;
      case 'requests':
        return <RequestBloodPage setActivePage={navigateTo} />;
      case 'bloodbanks':
        return <BloodBanksPage setActivePage={navigateTo} />;
      case 'dashboard':
        return <DashboardPage setActivePage={navigateTo} />;
      case 'login':
        return <LoginPage setActivePage={navigateTo} />;
      case 'register':
        return <RegisterPage setActivePage={navigateTo} />;
      case 'contact':
        return <ContactPage setActivePage={navigateTo} />;
      default:
        return <LandingPage setActivePage={navigateTo} />;
    }
  };

  return (
    <ToastProvider>
      <AuthProvider>
        <DataProvider>
          <div className="app-layout">
            <Navbar activePage={activePage} setActivePage={navigateTo} />
            <main className="main-content">
              {renderCurrentPage()}
            </main>
            <Footer setActivePage={navigateTo} />
          </div>
        </DataProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;

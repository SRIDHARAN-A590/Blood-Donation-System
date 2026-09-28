import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import Navbar from './components/Navbar';
import AnnouncementBanner from './components/AnnouncementBanner';
import HomeTab from './components/HomeTab';
import AboutTab from './components/AboutTab';
import DashboardTab from './components/DashboardTab';
import CreateRequestTab from './components/CreateRequestTab';
import MapTab from './components/MapTab';
import AuthModal from './components/AuthModal';
import OnboardingModal from './components/OnboardingModal';
import Toast from './components/Toast';
import Footer from './components/Footer';
import { api } from './services/api';
import { INITIAL_HOSPITALS } from './data/initialData';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  // Active user session (User Account from MongoDB Atlas)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = sessionStorage.getItem('neoblood_session_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  // Data stored exclusively in MongoDB Atlas database
  const [donors, setDonors] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [dbError, setDbError] = useState(false);

  // In-memory notifications and toasts
  const [notifications, setNotifications] = useState([]);
  const [toasts, setToasts] = useState([]);

  // Modals state: Distinct AuthModal vs DonorModal
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' or 'register'
  const [isDonorModalOpen, setIsDonorModalOpen] = useState(false);

  // Toast Helper
  const addToast = (title, message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const handleDismissToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Load data directly from MongoDB Atlas (bloodDonors & requests)
  const loadDatabaseData = async (isBackgroundSync = false) => {
    if (!isBackgroundSync) setLoadingData(true);
    try {
      const [fetchedDonors, fetchedRequests] = await Promise.all([
        api.getDonors(),
        api.getRequests()
      ]);
      setDonors(fetchedDonors);
      setRequests(fetchedRequests);
      setDbError(false);
    } catch (err) {
      console.error("Failed to fetch from MongoDB:", err);
      setDbError(true);
      if (!isBackgroundSync) {
        addToast("Database Alert", "Unable to connect to MongoDB server. Ensure backend is running.", "error");
      }
    } finally {
      if (!isBackgroundSync) setLoadingData(false);
    }
  };

  // Check existing session via token on mount
  useEffect(() => {
    api.getMe().then(user => {
      if (user) {
        setCurrentUser(user);
      }
    }).catch(() => {});
  }, []);

  // Initial data load
  useEffect(() => {
    loadDatabaseData();
  }, []);

  // Background polling sync every 20 seconds for real-time updates across multiple clients
  useEffect(() => {
    const interval = setInterval(() => {
      loadDatabaseData(true);
    }, 20000);
    return () => clearInterval(interval);
  }, []);

  // Sync user session to sessionStorage
  useEffect(() => {
    if (currentUser) {
      sessionStorage.setItem('neoblood_session_user', JSON.stringify(currentUser));
    } else {
      sessionStorage.removeItem('neoblood_session_user');
    }
  }, [currentUser]);

  // Auth Open Handlers
  const handleOpenSignIn = () => {
    setAuthModalMode('login');
    setIsAuthModalOpen(true);
  };

  const handleOpenRegister = () => {
    setAuthModalMode('register');
    setIsAuthModalOpen(true);
  };

  const handleAuthSuccess = (user, message) => {
    setCurrentUser(user);
    addToast('Authentication Success', message, 'success');
    try {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    } catch (e) {}
  };

  const handleLogoutClick = () => {
    api.logout();
    setCurrentUser(null);
    setActiveTab('home');
    addToast('Logged Out', 'You have been successfully logged out.', 'info');
  };

  // Open "Become a Blood Donor" form (separate from User Account)
  const handleOpenBecomeDonor = () => {
    if (!currentUser) {
      setAuthModalMode('register');
      setIsAuthModalOpen(true);
      addToast('Account Required', 'Please register or sign in first to create a donor profile.', 'info');
      return;
    }
    setIsDonorModalOpen(true);
  };

  // Save Donor Profile in MongoDB Atlas 'bloodDonors' collection
  const handleSaveDonorProfile = async (donorData) => {
    const tempId = 'temp-' + Date.now();
    const optimisticDonor = {
      _id: tempId,
      uid: tempId,
      userId: currentUser?.id || currentUser?._id,
      ...donorData
    };

    // Optimistic UI updates
    setDonors(prev => [optimisticDonor, ...prev]);
    setIsDonorModalOpen(false);

    try {
      const savedDonor = await api.createDonor({
        ...donorData,
        userId: currentUser?.id || currentUser?._id
      });

      setCurrentUser(prev => ({
        ...prev,
        role: 'donor',
        donorProfile: savedDonor
      }));

      addToast('Donor Profile Created', `Congratulations ${savedDonor.name}! Saved in MongoDB Atlas bloodDonors.`, 'success');
      try {
        confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
      } catch (e) {}

      await loadDatabaseData(true);
    } catch (err) {
      setDonors(prev => prev.filter(d => d._id !== tempId));
      addToast('Donor Registration Error', err.message || 'Could not save donor to MongoDB Atlas.', 'error');
    }
  };

  // Toggle Donor Availability with Optimistic Update & Rollback
  const handleToggleAvailability = async (newStatus) => {
    if (!currentUser) return;
    const donorProfile = currentUser.donorProfile || donors.find(d =>
      d.userId === currentUser.id || d.userId === currentUser._id || d.email === currentUser.email
    );
    if (!donorProfile) {
      handleOpenBecomeDonor();
      return;
    }

    const donorId = donorProfile._id || donorProfile.uid;
    const previousStatus = donorProfile.availability ?? donorProfile.isAvailable;

    // Optimistic Update
    setDonors(prev => prev.map(d =>
      (d._id === donorId || d.uid === donorId) ? { ...d, availability: newStatus, isAvailable: newStatus } : d
    ));
    if (currentUser.donorProfile) {
      setCurrentUser(prev => ({
        ...prev,
        donorProfile: { ...prev.donorProfile, availability: newStatus, isAvailable: newStatus }
      }));
    }

    try {
      await api.updateDonor(donorId, { availability: newStatus, isAvailable: newStatus });
      addToast(
        'Status Synchronized',
        newStatus ? 'Marked AVAILABLE in MongoDB Atlas.' : 'Marked UNAVAILABLE in MongoDB Atlas.',
        'info'
      );
    } catch (err) {
      // Rollback on failure
      setDonors(prev => prev.map(d =>
        (d._id === donorId || d.uid === donorId) ? { ...d, availability: previousStatus, isAvailable: previousStatus } : d
      ));
      addToast('Update Failed', 'Failed to update MongoDB status. Rolled back.', 'error');
    }
  };

  // Pledge Donation with Optimistic Update & Rollback
  const handleAcceptRequest = async (requestId) => {
    if (!currentUser) {
      handleOpenSignIn();
      return;
    }

    const originalRequests = [...requests];
    setRequests(prev => prev.map(r => {
      const isMatch = r._id === requestId || r.requestId === requestId;
      if (isMatch) {
        return {
          ...r,
          acceptedDonorId: currentUser.id || currentUser.uid,
          acceptedDonorName: currentUser.name,
          status: 'PLEDGED'
        };
      }
      return r;
    }));

    try {
      confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
    } catch (e) {}
    addToast('Pledge Submitted', 'Your pledge has been saved to MongoDB Atlas!', 'success');

    try {
      await api.pledgeRequest(requestId, currentUser.id || currentUser.uid, currentUser.name);
      await loadDatabaseData(true);
    } catch (err) {
      setRequests(originalRequests);
      addToast('Pledge Failed', 'Could not record pledge in MongoDB. Rolled back.', 'error');
    }
  };

  // Create Blood Request
  const handleCreateRequest = async (newReqData) => {
    const tempId = 'temp-req-' + Date.now();
    const optimisticReq = {
      _id: tempId,
      requestId: tempId,
      createdAt: new Date().toISOString(),
      status: 'OPEN',
      acceptedDonorId: null,
      acceptedDonorName: null,
      ...newReqData
    };

    setRequests(prev => [optimisticReq, ...prev]);
    setActiveTab('home');

    try {
      const created = await api.createRequest({
        ...newReqData,
        requestId: 'req-' + Date.now(),
        email: currentUser?.email || newReqData.email || null
      });

      addToast('Request Broadcasted', 'Emergency request saved live in MongoDB Atlas!', 'success');
      await loadDatabaseData(true);
    } catch (err) {
      setRequests(prev => prev.filter(r => r._id !== tempId));
      addToast('Broadcast Failed', 'Could not save request to MongoDB: ' + err.message, 'error');
    }
  };

  return (
    <div className="app-container">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          loadDatabaseData(true);
        }}
        currentUser={currentUser}
        onSignInClick={handleOpenSignIn}
        onRegisterClick={handleOpenRegister}
        onBecomeDonorClick={handleOpenBecomeDonor}
        onLogoutClick={handleLogoutClick}
        notifications={notifications}
      />

      {/* Red Announcement Banner */}
      <AnnouncementBanner />

      {/* Main Content Area */}
      <main className="main-content">
        {activeTab === 'home' && (
          <HomeTab
            currentUser={currentUser}
            donors={donors}
            requests={requests}
            loadingData={loadingData}
            dbError={dbError}
            onRetryConnection={() => loadDatabaseData(false)}
            onAcceptRequest={handleAcceptRequest}
            onOpenCreateRequest={() => setActiveTab('create-request')}
            onSignInClick={handleOpenSignIn}
            onRegisterClick={handleOpenRegister}
            onBecomeDonorClick={handleOpenBecomeDonor}
            onLoginClick={handleOpenSignIn}
          />
        )}

        {activeTab === 'about' && (
          <AboutTab />
        )}

        {activeTab === 'dashboard' && (
          <DashboardTab
            currentUser={currentUser}
            donors={donors}
            requests={requests}
            onToggleAvailability={handleToggleAvailability}
            onBecomeDonor={handleOpenBecomeDonor}
            onOpenCreateRequest={() => setActiveTab('create-request')}
            onSignInClick={handleOpenSignIn}
            onRegisterClick={handleOpenRegister}
          />
        )}

        {activeTab === 'create-request' && (
          <CreateRequestTab
            currentUser={currentUser}
            donors={donors}
            onSubmitRequest={handleCreateRequest}
            onCancel={() => setActiveTab('home')}
          />
        )}

        {activeTab === 'map' && (
          <MapTab
            donors={donors}
            requests={requests}
            hospitals={INITIAL_HOSPITALS}
          />
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Authentication Modal (Sign In vs Register with Google & Email/Password) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        initialMode={authModalMode}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      {/* Become a Blood Donor Modal (Collection: bloodDonors) */}
      <OnboardingModal
        isOpen={isDonorModalOpen}
        onClose={() => setIsDonorModalOpen(false)}
        onSave={handleSaveDonorProfile}
        currentUser={currentUser}
      />

      {/* Toast Notifications */}
      <Toast
        toasts={toasts}
        onDismiss={handleDismissToast}
      />
    </div>
  );
}

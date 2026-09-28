import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import Navbar from './components/Navbar';
import AnnouncementBanner from './components/AnnouncementBanner';
import HomeTab from './components/HomeTab';
import AboutTab from './components/AboutTab';
import DashboardTab from './components/DashboardTab';
import CreateRequestTab from './components/CreateRequestTab';
import MapTab from './components/MapTab';
import OnboardingModal from './components/OnboardingModal';
import Toast from './components/Toast';
import Footer from './components/Footer';
import { api } from './services/api';
import { INITIAL_HOSPITALS } from './data/initialData';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  // Active user session
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
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

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

  // Load data directly from MongoDB Atlas
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

  // Initial load
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

  // Auth Handlers
  const handleLoginClick = () => {
    setIsOnboardingOpen(true);
  };

  const handleLogoutClick = () => {
    setCurrentUser(null);
    setActiveTab('home');
    addToast('Logged Out', 'You have been successfully logged out.', 'info');
  };

  // Register donor / profile with Optimistic Update
  const handleSaveProfile = async (profileData) => {
    const tempId = 'temp-' + Date.now();
    const optimisticUser = {
      _id: tempId,
      uid: tempId,
      ...profileData
    };

    // Optimistic UI update
    setCurrentUser(optimisticUser);
    if (profileData.role === 'donor') {
      setDonors(prev => [optimisticUser, ...prev]);
    }
    setIsOnboardingOpen(false);

    try {
      let savedUser;
      if (profileData.role === 'donor') {
        savedUser = await api.createDonor({
          ...profileData,
          uid: 'donor-' + Date.now()
        });
      } else {
        savedUser = {
          uid: 'user-' + Date.now(),
          ...profileData
        };
      }

      setCurrentUser(savedUser);
      addToast('Profile Saved', `Welcome to NeoBlood, ${savedUser.name}! Saved in MongoDB.`, 'success');

      try {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      } catch (e) {}

      await loadDatabaseData(true);
    } catch (err) {
      // Rollback on failure
      setCurrentUser(null);
      setDonors(prev => prev.filter(d => d._id !== tempId));
      addToast('Registration Failed', err.message || 'Could not save to MongoDB. Please try again.', 'error');
    }
  };

  // Toggle Donor Availability with Optimistic Update & Rollback
  const handleToggleAvailability = async (newStatus) => {
    if (!currentUser) return;
    const previousStatus = currentUser.isAvailable;
    const donorId = currentUser._id || currentUser.uid;

    // 1. Optimistic Update (zero lag UI flip)
    setCurrentUser(prev => ({ ...prev, isAvailable: newStatus }));
    setDonors(prev => prev.map(d => (d._id === donorId || d.uid === donorId) ? { ...d, isAvailable: newStatus } : d));

    try {
      await api.updateDonor(donorId, { isAvailable: newStatus });
      addToast(
        'Status Synchronized',
        newStatus ? 'Marked AVAILABLE in MongoDB Atlas.' : 'Marked UNAVAILABLE in MongoDB Atlas.',
        'info'
      );
    } catch (err) {
      // 2. Rollback on network/DB failure
      setCurrentUser(prev => ({ ...prev, isAvailable: previousStatus }));
      setDonors(prev => prev.map(d => (d._id === donorId || d.uid === donorId) ? { ...d, isAvailable: previousStatus } : d));
      addToast('Update Failed', 'Failed to update MongoDB status. Rolled back.', 'error');
    }
  };

  // Enroll as Donor with Optimistic Update
  const handleBecomeDonor = async () => {
    if (!currentUser) {
      setIsOnboardingOpen(true);
      return;
    }
    const donorData = {
      ...currentUser,
      role: 'donor',
      isAvailable: true
    };

    try {
      const created = await api.createDonor(donorData);
      setCurrentUser(created);
      setDonors(prev => [created, ...prev.filter(d => d.uid !== created.uid && d._id !== created._id)]);
      addToast('Enrolled as Donor', 'Your profile is now saved live in MongoDB Atlas!', 'success');
      try {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      } catch (e) {}
    } catch (err) {
      addToast('Error', 'Failed to enroll: ' + err.message, 'error');
    }
  };

  // Pledge Donation with Optimistic Update & Rollback
  const handleAcceptRequest = async (requestId) => {
    if (!currentUser) {
      setIsOnboardingOpen(true);
      return;
    }

    // 1. Optimistic Update
    const originalRequests = [...requests];
    setRequests(prev => prev.map(r => {
      const isMatch = r._id === requestId || r.requestId === requestId;
      if (isMatch) {
        return {
          ...r,
          acceptedDonorId: currentUser.uid || currentUser._id,
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
      await api.pledgeRequest(requestId, currentUser.uid || currentUser._id, currentUser.name);
      await loadDatabaseData(true);
    } catch (err) {
      // 2. Rollback on failure
      setRequests(originalRequests);
      addToast('Pledge Failed', 'Could not record pledge in MongoDB. Rolled back.', 'error');
    }
  };

  // Create Blood Request with Optimistic Update & Rollback
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

    // Optimistic UI insertion
    setRequests(prev => [optimisticReq, ...prev]);
    setActiveTab('home');

    try {
      const created = await api.createRequest({
        ...newReqData,
        requestId: 'req-' + Date.now()
      });

      addToast('Request Broadcasted', 'Emergency request saved live in MongoDB Atlas!', 'success');
      await loadDatabaseData(true);
    } catch (err) {
      // Rollback on failure
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
        onLoginClick={handleLoginClick}
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
            onLoginClick={handleLoginClick}
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
            onBecomeDonor={handleBecomeDonor}
            onOpenCreateRequest={() => setActiveTab('create-request')}
            onLoginClick={handleLoginClick}
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

      {/* Onboarding Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onSave={handleSaveProfile}
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

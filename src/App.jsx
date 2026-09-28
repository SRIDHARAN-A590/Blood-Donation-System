import React, { useState, useEffect } from 'react';
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

  // Data stored ONLY in MongoDB database
  const [donors, setDonors] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  // In-memory notifications and toasts
  const [notifications, setNotifications] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  // Load all data directly from MongoDB Atlas on mount and tab switch
  const loadDatabaseData = async () => {
    setLoadingData(true);
    try {
      const [fetchedDonors, fetchedRequests] = await Promise.all([
        api.getDonors(),
        api.getRequests()
      ]);
      setDonors(fetchedDonors);
      setRequests(fetchedRequests);
    } catch (err) {
      console.error("Failed to fetch from MongoDB:", err);
      addToast("Database Connection", "Loading records from MongoDB Atlas...", "info");
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    loadDatabaseData();
  }, []);

  // Sync active user session to sessionStorage (for login persistence across page refresh)
  useEffect(() => {
    if (currentUser) {
      sessionStorage.setItem('neoblood_session_user', JSON.stringify(currentUser));
    } else {
      sessionStorage.removeItem('neoblood_session_user');
    }
  }, [currentUser]);

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

  // Auth Handlers
  const handleLoginClick = () => {
    setIsOnboardingOpen(true);
  };

  const handleLogoutClick = () => {
    setCurrentUser(null);
    setActiveTab('home');
    addToast('Logged Out', 'You have been successfully logged out.', 'info');
  };

  // Save profile / Register directly into MongoDB database
  const handleSaveProfile = async (profileData) => {
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
      setIsOnboardingOpen(false);
      addToast('Saved to Database', `Profile for ${savedUser.name} registered directly in MongoDB!`, 'success');

      // Refresh data from MongoDB
      await loadDatabaseData();

      try {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      } catch (e) {}
    } catch (err) {
      addToast('Error', 'Failed to save to database: ' + err.message, 'error');
    }
  };

  // Update donor availability directly in MongoDB
  const handleToggleAvailability = async (newStatus) => {
    if (!currentUser) return;
    try {
      const idToUpdate = currentUser._id || currentUser.uid;
      const updated = await api.updateDonor(idToUpdate, { isAvailable: newStatus });
      setCurrentUser(prev => ({ ...prev, isAvailable: newStatus }));

      addToast(
        'Database Updated',
        newStatus ? 'Status updated to AVAILABLE in MongoDB.' : 'Status updated to UNAVAILABLE in MongoDB.',
        'info'
      );

      // Refresh live records from MongoDB
      await loadDatabaseData();
    } catch (err) {
      addToast('Error', 'Failed to update database: ' + err.message, 'error');
    }
  };

  // Enroll as Donor directly in MongoDB
  const handleBecomeDonor = async () => {
    if (!currentUser) {
      setIsOnboardingOpen(true);
      return;
    }
    try {
      const donorData = {
        ...currentUser,
        role: 'donor',
        isAvailable: true
      };
      const created = await api.createDonor(donorData);
      setCurrentUser(created);
      addToast('Database Enrolled', 'Enrolled as an active blood donor in MongoDB Atlas!', 'success');
      await loadDatabaseData();
    } catch (err) {
      addToast('Error', 'Database enrollment error: ' + err.message, 'error');
    }
  };

  // Pledge Donation directly in MongoDB
  const handleAcceptRequest = async (requestId) => {
    if (!currentUser) {
      setIsOnboardingOpen(true);
      return;
    }

    try {
      await api.pledgeRequest(requestId, currentUser.uid || currentUser._id, currentUser.name);

      try {
        confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
      } catch (e) {}

      addToast('Pledge Stored in DB', 'Your pledge has been saved directly to MongoDB Atlas!', 'success');

      // Refresh live records from MongoDB
      await loadDatabaseData();
    } catch (err) {
      addToast('Error', 'Failed to save pledge to database: ' + err.message, 'error');
    }
  };

  // Create Blood Request directly into MongoDB
  const handleCreateRequest = async (newReqData) => {
    try {
      const created = await api.createRequest({
        ...newReqData,
        requestId: 'req-' + Date.now()
      });

      setActiveTab('home');
      addToast('Broadcasted to DB', 'Your emergency request is now saved live in MongoDB Atlas!', 'success');

      // Refresh records from MongoDB
      await loadDatabaseData();
    } catch (err) {
      addToast('Error', 'Failed to insert request into MongoDB: ' + err.message, 'error');
    }
  };

  return (
    <div className="app-container">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          loadDatabaseData();
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
        {loadingData && donors.length === 0 && requests.length === 0 && (
          <div style={{ textAlign: 'center', padding: '20px', color: '#c1121f', fontWeight: 600 }}>
            <i className="fas fa-spinner fa-spin"></i> Connecting to MongoDB Atlas...
          </div>
        )}

        {activeTab === 'home' && (
          <HomeTab
            currentUser={currentUser}
            donors={donors}
            requests={requests}
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

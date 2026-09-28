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
import { INITIAL_DONORS, INITIAL_REQUESTS, INITIAL_HOSPITALS } from './data/initialData';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  // Local state initialized from localStorage
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('neoblood_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [donors, setDonors] = useState(() => {
    try {
      const saved = localStorage.getItem('neoblood_donors');
      return saved ? JSON.parse(saved) : INITIAL_DONORS;
    } catch (e) {
      return INITIAL_DONORS;
    }
  });

  const [requests, setRequests] = useState(() => {
    try {
      const saved = localStorage.getItem('neoblood_requests');
      return saved ? JSON.parse(saved) : INITIAL_REQUESTS;
    } catch (e) {
      return INITIAL_REQUESTS;
    }
  });

  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem('neoblood_notifs');
      return saved ? JSON.parse(saved) : [
        {
          id: 'n-1',
          title: '🚨 Urgent Request in Madurai',
          message: 'Meenakshi Sundaram urgently needs 2 units of O+ blood at GRH Hospital.',
          read: false,
          timestamp: new Date().toISOString()
        }
      ];
    } catch (e) {
      return [];
    }
  });

  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Sync to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('neoblood_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('neoblood_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('neoblood_donors', JSON.stringify(donors));
  }, [donors]);

  useEffect(() => {
    localStorage.setItem('neoblood_requests', JSON.stringify(requests));
  }, [requests]);

  useEffect(() => {
    localStorage.setItem('neoblood_notifs', JSON.stringify(notifications));
  }, [notifications]);

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

  const handleSaveProfile = (profileData) => {
    const userObj = {
      uid: currentUser?.uid || 'user-' + Date.now(),
      ...profileData
    };
    setCurrentUser(userObj);

    // If registered as donor, add to donors list
    if (userObj.role === 'donor') {
      setDonors(prev => {
        const existing = prev.findIndex(d => d.uid === userObj.uid);
        if (existing >= 0) {
          const updated = [...prev];
          updated[existing] = { ...updated[existing], ...userObj };
          return updated;
        }
        return [userObj, ...prev];
      });
    }

    setIsOnboardingOpen(false);
    addToast('Profile Saved', `Welcome to NeoBlood, ${userObj.name}!`, 'success');
    try {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    } catch (e) {}
  };

  // Donor Handlers
  const handleToggleAvailability = (newStatus) => {
    if (!currentUser) return;
    const updated = { ...currentUser, isAvailable: newStatus };
    setCurrentUser(updated);
    setDonors(prev => prev.map(d => d.uid === currentUser.uid ? { ...d, isAvailable: newStatus } : d));
    addToast(
      'Status Updated',
      newStatus ? 'You are now marked as AVAILABLE for donations.' : 'You are now marked as UNAVAILABLE.',
      'info'
    );
  };

  const handleBecomeDonor = () => {
    if (!currentUser) {
      setIsOnboardingOpen(true);
      return;
    }
    const updated = { ...currentUser, role: 'donor', isAvailable: true };
    setCurrentUser(updated);
    setDonors(prev => {
      if (!prev.find(d => d.uid === currentUser.uid)) {
        return [updated, ...prev];
      }
      return prev.map(d => d.uid === currentUser.uid ? updated : d);
    });
    addToast('Enrolled as Donor', 'You are now registered as an active blood donor!', 'success');
  };

  // Request Handlers
  const handleAcceptRequest = (requestId) => {
    if (!currentUser) {
      setIsOnboardingOpen(true);
      return;
    }

    setRequests(prev => prev.map(r => {
      if (r.requestId === requestId) {
        return {
          ...r,
          acceptedDonorId: currentUser.uid,
          acceptedDonorName: currentUser.name
        };
      }
      return r;
    }));

    // Trigger celebration
    try {
      confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
    } catch (e) {}

    addToast('Pledge Confirmed', 'Thank you for stepping up to save a life!', 'success');

    // Add notification
    const newNotif = {
      id: 'notif-' + Date.now(),
      title: 'Pledge Confirmed',
      message: `You pledged to donate for request #${requestId.slice(-4)}. Hospital coordination instructions sent.`,
      read: false,
      timestamp: new Date().toISOString()
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const handleCreateRequest = (newReqData) => {
    const newReq = {
      requestId: 'req-' + Date.now(),
      createdAt: new Date().toISOString(),
      status: 'OPEN',
      acceptedDonorId: null,
      acceptedDonorName: null,
      ...newReqData
    };

    setRequests(prev => [newReq, ...prev]);
    setActiveTab('home');

    addToast('Request Broadcasted', 'Your emergency blood request is now live across the network!', 'success');

    // Notify matching donors
    const newNotif = {
      id: 'notif-' + Date.now(),
      title: `🚨 Blood Needed: ${newReq.bloodGroup}`,
      message: `${newReq.patientName} needs ${newReq.unitsRequired} unit(s) at ${newReq.hospitalName}, ${newReq.city}.`,
      read: false,
      timestamp: new Date().toISOString()
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  return (
    <div className="app-container">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
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

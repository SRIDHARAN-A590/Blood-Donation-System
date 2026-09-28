import React, { createContext, useContext, useState, useEffect } from 'react';

const USERS_STORAGE_KEY = 'lifeflow_users_v1';
const CURRENT_USER_KEY = 'lifeflow_current_user_v1';

const DEFAULT_USERS = [
  {
    id: 'u-1',
    name: 'John Doe',
    email: 'john.doe@gmail.com',
    password: 'Password123!',
    role: 'donor',
    bloodGroup: 'O+',
    phone: '555-0199',
    age: 28,
    weight: 72,
    gender: 'Male',
    city: 'New York',
    isAvailable: true,
    totalDonations: 4,
    lastDonationDate: '2026-06-15',
    badges: ['Lifesaver', 'Repeat Donor', 'Hero'],
    messages: [
      {
        id: 'msg-1',
        fromName: 'Sarah Connor',
        fromBloodGroup: 'O+',
        fromEmail: 'sarah.c@gmail.com',
        message: 'Urgent: Family member undergoing bypass surgery at Metro Memorial Hospital. Need 2 units O+ blood.',
        date: new Date(Date.now() - 3600000 * 5).toISOString(),
        read: false,
        isUrgent: true
      }
    ]
  },
  {
    id: 'u-2',
    name: 'Alice Smith',
    email: 'alice.smith@gmail.com',
    password: 'Password123!',
    role: 'donor',
    bloodGroup: 'A+',
    phone: '555-0210',
    age: 26,
    weight: 60,
    gender: 'Female',
    city: 'New York',
    isAvailable: true,
    totalDonations: 2,
    lastDonationDate: '2026-07-20',
    badges: ['Community Star'],
    messages: []
  },
  {
    id: 'u-3',
    name: 'Bob Johnson',
    email: 'bob.johnson@gmail.com',
    password: 'Password123!',
    role: 'donor',
    bloodGroup: 'B+',
    phone: '555-0342',
    age: 34,
    weight: 78,
    gender: 'Male',
    city: 'Los Angeles',
    isAvailable: true,
    totalDonations: 6,
    lastDonationDate: '2026-05-10',
    badges: ['Champion Donor', 'Gold Star'],
    messages: []
  },
  {
    id: 'u-4',
    name: 'Diana Prince',
    email: 'diana.prince@gmail.com',
    password: 'Password123!',
    role: 'donor',
    bloodGroup: 'O-',
    phone: '555-0455',
    age: 29,
    weight: 58,
    gender: 'Female',
    city: 'Chicago',
    isAvailable: true,
    totalDonations: 5,
    lastDonationDate: '2026-08-01',
    badges: ['Universal Donor Star', 'Emergency Responder'],
    messages: []
  },
  {
    id: 'u-5',
    name: 'Ethan Hunt',
    email: 'ethan.hunt@gmail.com',
    password: 'Password123!',
    role: 'donor',
    bloodGroup: 'AB+',
    phone: '555-0567',
    age: 39,
    weight: 81,
    gender: 'Male',
    city: 'Houston',
    isAvailable: true,
    totalDonations: 3,
    lastDonationDate: '2026-06-25',
    badges: ['Lifesaver'],
    messages: []
  },
  {
    id: 'u-6',
    name: 'Marcus Vance',
    email: 'marcus.v@gmail.com',
    password: 'Password123!',
    role: 'donor',
    bloodGroup: 'A-',
    phone: '555-0678',
    age: 31,
    weight: 74,
    gender: 'Male',
    city: 'Phoenix',
    isAvailable: true,
    totalDonations: 1,
    lastDonationDate: '2026-07-11',
    badges: ['First Step Hero'],
    messages: []
  },
  {
    id: 'u-7',
    name: 'Maya Lin',
    email: 'maya.lin@gmail.com',
    password: 'Password123!',
    role: 'donor',
    bloodGroup: 'B-',
    phone: '555-0789',
    age: 25,
    weight: 56,
    gender: 'Female',
    city: 'Philadelphia',
    isAvailable: false,
    totalDonations: 2,
    lastDonationDate: '2026-08-20',
    badges: ['Kind Soul'],
    messages: []
  },
  {
    id: 'u-8',
    name: 'Noah Walker',
    email: 'noah.w@gmail.com',
    password: 'Password123!',
    role: 'donor',
    bloodGroup: 'AB-',
    phone: '555-0890',
    age: 36,
    weight: 79,
    gender: 'Male',
    city: 'San Antonio',
    isAvailable: true,
    totalDonations: 4,
    lastDonationDate: '2026-04-12',
    badges: ['Rare Type Guardian'],
    messages: []
  }
];

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem(USERS_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing users', e);
      }
    }
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(DEFAULT_USERS));
    return DEFAULT_USERS;
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem(CURRENT_USER_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing current user', e);
      }
    }
    return null;
  });

  useEffect(() => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  }, [currentUser]);

  const login = (email, password) => {
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim());
    if (found) {
      if (password && found.password && found.password !== password) {
        return false;
      }
      setCurrentUser(found);
      return true;
    }
    return false;
  };

  const register = (userData) => {
    const existing = users.find((u) => u.email.toLowerCase() === userData.email.toLowerCase().trim());
    if (existing) {
      return false;
    }

    const newUser = {
      ...userData,
      id: 'u-' + Math.random().toString(36).substring(2, 9),
      isAvailable: userData.isAvailable ?? true,
      totalDonations: 0,
      badges: ['New Lifesaver'],
      messages: []
    };

    const updated = [newUser, ...users];
    setUsers(updated);
    setCurrentUser(newUser);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const toggleAvailability = () => {
    if (!currentUser) return;
    const newStatus = !currentUser.isAvailable;
    const updated = { ...currentUser, isAvailable: newStatus };
    setCurrentUser(updated);
    setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updated : u)));
  };

  const updateUser = (updatedFields) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updatedFields };
    setCurrentUser(updated);
    setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updated : u)));
  };

  const sendMessageToDonor = (donorEmail, messageText, isUrgent = false) => {
    if (!currentUser) return false;

    const newMessage = {
      id: 'msg-' + Math.random().toString(36).substring(2, 9),
      fromName: currentUser.name,
      fromBloodGroup: currentUser.bloodGroup,
      fromEmail: currentUser.email,
      message: messageText,
      date: new Date().toISOString(),
      read: false,
      isUrgent
    };

    const isSendingToSelf = currentUser.email.toLowerCase() === donorEmail.toLowerCase();

    setUsers((prev) =>
      prev.map((u) => {
        if (u.email.toLowerCase() === donorEmail.toLowerCase()) {
          const updatedMessages = [newMessage, ...(u.messages || [])];
          return { ...u, messages: updatedMessages };
        }
        return u;
      })
    );

    // Update currentUser separately to avoid stale closure inside setUsers callback
    if (isSendingToSelf) {
      setCurrentUser((prev) => {
        if (!prev) return prev;
        return { ...prev, messages: [newMessage, ...(prev.messages || [])] };
      });
    }

    return true;
  };

  const markMessagesRead = () => {
    if (!currentUser) return;
    const updatedMessages = (currentUser.messages || []).map((m) => ({ ...m, read: true }));
    const updatedUser = { ...currentUser, messages: updatedMessages };
    setCurrentUser(updatedUser);
    setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updatedUser : u)));
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        users,
        isLoggedIn: !!currentUser,
        login,
        register,
        logout,
        toggleAvailability,
        sendMessageToDonor,
        markMessagesRead,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

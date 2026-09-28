const API_BASE = '/api';

function getAuthHeader() {
  const token = localStorage.getItem('neoblood_jwt_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

export const api = {
  // Authentication
  async register({ name, email, phone, password }) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone, password })
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || 'Registration failed');
    }
    if (json.token) {
      localStorage.setItem('neoblood_jwt_token', json.token);
    }
    return json;
  },

  async login({ email, password }) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || 'Login failed');
    }
    if (json.token) {
      localStorage.setItem('neoblood_jwt_token', json.token);
    }
    return json;
  },

  async googleAuth({ email, name, googleId, photoURL }) {
    const res = await fetch(`${API_BASE}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name, googleId, photoURL })
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || 'Google authentication failed');
    }
    if (json.token) {
      localStorage.setItem('neoblood_jwt_token', json.token);
    }
    return json;
  },

  async getMe() {
    const token = localStorage.getItem('neoblood_jwt_token');
    if (!token) return null;
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { ...getAuthHeader() }
    });
    if (!res.ok) {
      localStorage.removeItem('neoblood_jwt_token');
      return null;
    }
    const json = await res.json();
    return json.user;
  },

  logout() {
    localStorage.removeItem('neoblood_jwt_token');
  },

  // Donors CRUD (Collection: bloodDonors)
  async getDonors(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/donors${query ? '?' + query : ''}`);
    const json = await res.json();
    return json.data || [];
  },

  async createDonor(donorData) {
    const res = await fetch(`${API_BASE}/donors`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(donorData)
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || json.errors?.join(', ') || 'Failed to create donor');
    }
    return json.data;
  },

  async updateDonor(id, updateData) {
    const res = await fetch(`${API_BASE}/donors/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(updateData)
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || 'Failed to update donor');
    }
    return json.data;
  },

  async deleteDonor(id) {
    const res = await fetch(`${API_BASE}/donors/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() }
    });
    return await res.json();
  },

  // Requests CRUD (Collection: requests)
  async getRequests(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/requests${query ? '?' + query : ''}`);
    const json = await res.json();
    return json.data || [];
  },

  async createRequest(reqData) {
    const res = await fetch(`${API_BASE}/requests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(reqData)
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || json.errors?.join(', ') || 'Failed to create request');
    }
    return json.data;
  },

  async pledgeRequest(id, donorId, donorName) {
    const res = await fetch(`${API_BASE}/requests/${id}/pledge`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({ donorId, donorName })
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || 'Failed to pledge request');
    }
    return json.data;
  },

  async deleteRequest(id) {
    const res = await fetch(`${API_BASE}/requests/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() }
    });
    return await res.json();
  }
};

const API_BASE = '/api';

export const api = {
  // Donors CRUD
  async getDonors(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/donors${query ? '?' + query : ''}`);
    const json = await res.json();
    return json.data || [];
  },

  async createDonor(donorData) {
    const res = await fetch(`${API_BASE}/donors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(donorData)
    });
    const json = await res.json();
    return json.data;
  },

  async updateDonor(id, updateData) {
    const res = await fetch(`${API_BASE}/donors/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData)
    });
    const json = await res.json();
    return json.data;
  },

  async deleteDonor(id) {
    const res = await fetch(`${API_BASE}/donors/${id}`, {
      method: 'DELETE'
    });
    return await res.json();
  },

  // Requests CRUD
  async getRequests(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/requests${query ? '?' + query : ''}`);
    const json = await res.json();
    return json.data || [];
  },

  async createRequest(reqData) {
    const res = await fetch(`${API_BASE}/requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reqData)
    });
    const json = await res.json();
    return json.data;
  },

  async pledgeRequest(id, donorId, donorName) {
    const res = await fetch(`${API_BASE}/requests/${id}/pledge`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ donorId, donorName })
    });
    const json = await res.json();
    return json.data;
  },

  async deleteRequest(id) {
    const res = await fetch(`${API_BASE}/requests/${id}`, {
      method: 'DELETE'
    });
    return await res.json();
  }
};

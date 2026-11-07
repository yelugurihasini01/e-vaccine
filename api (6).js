/**
 * API Client for eVaccine Reminder System
 */

const API_BASE = '/api';

export const api = {
  // Stats
  async getStats() {
    const res = await fetch(`${API_BASE}/settings/stats`);
    return res.json();
  },

  // Beneficiaries
  async getBeneficiaries() {
    const res = await fetch(`${API_BASE}/beneficiaries`);
    return res.json();
  },

  async getBeneficiary(id) {
    const res = await fetch(`${API_BASE}/beneficiaries/${id}`);
    return res.json();
  },

  async createBeneficiary(data) {
    const res = await fetch(`${API_BASE}/beneficiaries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async updateBeneficiary(id, data) {
    const res = await fetch(`${API_BASE}/beneficiaries/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async deleteBeneficiary(id) {
    const res = await fetch(`${API_BASE}/beneficiaries/${id}`, {
      method: 'DELETE'
    });
    return res.json();
  },

  // Schedules
  async getUpcomingSchedules(days = 7) {
    const res = await fetch(`${API_BASE}/schedules/upcoming?days=${days}`);
    return res.json();
  },

  async getOverdueSchedules() {
    const res = await fetch(`${API_BASE}/schedules/overdue`);
    return res.json();
  },

  async administerSchedule(id, data) {
    const res = await fetch(`${API_BASE}/schedules/${id}/administer`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async rescheduleSchedule(id, data) {
    const res = await fetch(`${API_BASE}/schedules/${id}/reschedule`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async sendScheduleReminder(id, channel = 'all') {
    const res = await fetch(`${API_BASE}/schedules/${id}/remind`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ channel })
    });
    return res.json();
  },

  // Vaccines Master
  async getVaccines() {
    const res = await fetch(`${API_BASE}/vaccines`);
    return res.json();
  },

  async createVaccine(data) {
    const res = await fetch(`${API_BASE}/vaccines`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Notifications
  async getNotifications(channel = '') {
    const url = channel ? `${API_BASE}/notifications?channel=${channel}` : `${API_BASE}/notifications`;
    const res = await fetch(url);
    return res.json();
  },

  async runCronNow() {
    const res = await fetch(`${API_BASE}/notifications/run-cron-now`, {
      method: 'POST'
    });
    return res.json();
  },

  async testDirectNotification(data) {
    const res = await fetch(`${API_BASE}/notifications/test-direct`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Settings
  async getSettings() {
    const res = await fetch(`${API_BASE}/settings`);
    return res.json();
  },

  async updateSettings(data) {
    const res = await fetch(`${API_BASE}/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  }
};

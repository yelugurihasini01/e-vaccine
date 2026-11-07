const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function getAuthHeaders() {
  const token = localStorage.getItem('evaccine_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = getAuthHeaders();

  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...options.headers
      }
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || `Request failed with status ${res.status}`);
    }
    return data;
  } catch (err) {
    console.error(`API Error on [${options.method || 'GET'} ${endpoint}]:`, err.message);
    throw err;
  }
}

export const api = {
  // Auth
  sendOtp: (mobileNumber, purpose = 'registration') =>
    request('/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify({ mobileNumber, purpose })
    }),

  register: (userData) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    }),

  loginWithPassword: (loginId, password) =>
    request('/auth/login-password', {
      method: 'POST',
      body: JSON.stringify({ loginId, password })
    }),

  loginWithOtp: (mobileNumber, otp) =>
    request('/auth/login-otp', {
      method: 'POST',
      body: JSON.stringify({ mobileNumber, otp })
    }),

  forgotPassword: (loginId) =>
    request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ loginId })
    }),

  resetPassword: (loginId, otp, newPassword, confirmNewPassword) =>
    request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ loginId, otp, newPassword, confirmNewPassword })
    }),

  getMe: () => request('/auth/me'),

  updatePreferences: (preferences) =>
    request('/auth/preferences', {
      method: 'PUT',
      body: JSON.stringify(preferences)
    }),

  logout: () => {
    localStorage.removeItem('evaccine_token');
    localStorage.removeItem('evaccine_user');
  },

  // Family Members
  getFamilyMembers: () => request('/family'),

  getFamilyMember: (id) => request(`/family/${id}`),

  createFamilyMember: (data) =>
    request('/family', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  updateFamilyMember: (id, data) =>
    request(`/family/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),

  deleteFamilyMember: (id) =>
    request(`/family/${id}`, {
      method: 'DELETE'
    }),

  // Schedules
  getSchedules: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/schedules${query ? `?${query}` : ''}`);
  },

  updateScheduleStatus: (id, statusData) =>
    request(`/schedules/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify(statusData)
    }),

  testRemindSchedule: (id, payload = {}) =>
    request(`/schedules/${id}/test-remind`, {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  // Vaccines
  getVaccines: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/vaccines${query ? `?${query}` : ''}`);
  },

  // Notifications
  getNotifications: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/notifications${query ? `?${query}` : ''}`);
  },

  triggerCronNow: () =>
    request('/notifications/trigger-cron', {
      method: 'POST'
    }),

  quickTestNotification: (payload) =>
    request('/notifications/quick-test', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  clearNotifications: () =>
    request('/notifications/clear', {
      method: 'DELETE'
    }),

  // Admin
  getAdminMetrics: () => request('/admin/metrics'),
  getAdminUsers: () => request('/admin/users'),

  // Health
  checkHealth: () => request('/health')
};

export default api;

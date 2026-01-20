 /**
  * API service module for the Social Media Dashboard frontend.
  * Uses REACT_APP_API_BASE_URL to connect to the backend.
  * Provides helper functions for GET/POST/PUT/DELETE and resource-specific calls.
  */

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

/**
 * Build full URL for endpoint, ensuring single slash between base and path.
 * @param {string} path - endpoint path starting with or without leading slash
 * @returns {string} full URL
 */
function buildUrl(path) {
  const base = (API_BASE_URL || '').replace(/\/+$/g, '');
  const normalizedPath = String(path || '').replace(/^\/+/g, '');
  return `${base}/${normalizedPath}`;
}

/**
 * Internal helper to handle fetch requests with JSON and error handling.
 * @param {string} url
 * @param {RequestInit} options
 * @returns {Promise<any>}
 */
async function request(url, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const resp = await fetch(url, { ...options, headers });
  const contentType = resp.headers.get('content-type') || '';
  let data = null;
  if (contentType.includes('application/json')) {
    data = await resp.json();
  } else {
    data = await resp.text();
  }
  if (!resp.ok) {
    const message = typeof data === 'string' ? data : (data?.detail || 'Request failed');
    const error = new Error(message);
    error.status = resp.status;
    error.data = data;
    throw error;
  }
  return data;
}

// PUBLIC_INTERFACE
export const api = {
  /** Get list of users */
  async getUsers() {
    return request(buildUrl('/users'), { method: 'GET' });
  },
  /** Get analytics overview */
  async getAnalytics() {
    return request(buildUrl('/analytics'), { method: 'GET' });
  },
  /** Get current or specified profile */
  async getProfile(userId) {
    const path = userId ? `/profiles/${encodeURIComponent(userId)}` : '/profiles/me';
    return request(buildUrl(path), { method: 'GET' });
  },
  /** Update profile for current or specified user */
  async updateProfile(payload, userId) {
    const path = userId ? `/profiles/${encodeURIComponent(userId)}` : '/profiles/me';
    return request(buildUrl(path), { method: 'PUT', body: JSON.stringify(payload) });
  },
  /** Admin: get platform/admin info */
  async getAdminOverview() {
    return request(buildUrl('/admin'), { method: 'GET' });
  },
  /** Admin: update user role or status */
  async updateUser(userId, payload) {
    return request(buildUrl(`/admin/users/${encodeURIComponent(userId)}`), {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },
  /** Example auth: create a simple session (placeholder) */
  async login(username) {
    // If backend has /users/login implement here; placeholder for demo.
    // Returning mock shape for session context.
    return Promise.resolve({ username, token: `demo-token-${username}` });
  },
  async logout() {
    return Promise.resolve({ success: true });
  },
};

export default api;

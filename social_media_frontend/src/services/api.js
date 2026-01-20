const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

async function http(method, path, body) {
  const resp = await fetch(`${baseURL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`HTTP ${resp.status}: ${text}`);
  }
  return resp.status === 204 ? null : resp.json();
}

// PUBLIC_INTERFACE
export function getHealth() {
  /** Get backend health info. */
  return http('GET', '/');
}

// PUBLIC_INTERFACE
export function listUsers({ page = 1, page_size = 10, q } = {}) {
  /** List users with pagination */
  const qs = new URLSearchParams();
  qs.set('page', String(page));
  qs.set('page_size', String(page_size));
  if (q) qs.set('q', q);
  return http('GET', `/users/?${qs.toString()}`);
}

// PUBLIC_INTERFACE
export function createUser(data) {
  /** Create a user */
  return http('POST', '/users/', data);
}

// PUBLIC_INTERFACE
export function createProfile(data) {
  /** Create a profile for a user */
  return http('POST', '/profiles/', data);
}

// PUBLIC_INTERFACE
export function getAnalytics() {
  /** Get analytics summary */
  return http('GET', '/analytics/');
}

// PUBLIC_INTERFACE
export function adminSummary() {
  /** Get admin summary */
  return http('GET', '/admin/summary');
}

// PUBLIC_INTERFACE
export function grantAdmin(userId) {
  /** Grant admin privileges to user */
  return http('POST', `/admin/grant-admin/${userId}`);
}

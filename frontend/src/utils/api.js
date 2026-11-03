import { selectToken } from '../features/auth/authSlice';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

let getToken = () => null;
export const setTokenGetter = (fn) => { getToken = fn; };

const headers = (extra = {}) => {
  const token = getToken ? getToken() : null;
  const h = { 'Content-Type': 'application/json' };
  if (token) h.Authorization = `Bearer ${token}`;
  return { ...h, ...extra };
};

export const api = {
  get: async (path, opts = {}) => {
    const res = await fetch(`${BASE_URL}${path}`, {
      ...opts,
      method: 'GET',
      headers: headers(opts.headers),
      signal: opts.signal,
    });
    return handleResponse(res);
  },
  post: async (path, body, opts = {}) => {
    const res = await fetch(`${BASE_URL}${path}`, {
      ...opts,
      method: 'POST',
      headers: headers({ 'Content-Type': 'application/json', ...(opts.headers || {}) }),
      body: JSON.stringify(body),
    });
    return handleResponse(res);
  },
  patch: async (path, body, opts = {}) => {
    const res = await fetch(`${BASE_URL}${path}`, {
      ...opts,
      method: 'PATCH',
      headers: headers({ 'Content-Type': 'application/json', ...(opts.headers || {}) }),
      body: JSON.stringify(body),
    });
    return handleResponse(res);
  },
  delete: async (path, opts = {}) => {
    const res = await fetch(`${BASE_URL}${path}`, {
      ...opts,
      method: 'DELETE',
      headers: headers(opts.headers),
    });
    return handleResponse(res);
  },
};

async function handleResponse(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.message || 'Request failed');
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

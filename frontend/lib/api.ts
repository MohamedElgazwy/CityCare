const API_URL = 'http://localhost:3000';

type ApiOptions = RequestInit & { headers?: Record<string, string> };

export const api = async (endpoint: string, options: ApiOptions = {}) => {
  const token = localStorage.getItem('token');

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
      ...options.headers,
    },
  });

  const text = await res.text();

  try {
    return JSON.parse(text) as unknown;
  } catch {
    throw new Error(text);
  }
};

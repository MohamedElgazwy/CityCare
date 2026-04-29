const API_URL = 'http://localhost:3000';

export const api = async (endpoint: string, options: any = {}) => {
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
  console.log(res);

try {
  return JSON.parse(text);
} catch {
  throw new Error(text); // 👈 يعرض الخطأ الحقيقي
}

};
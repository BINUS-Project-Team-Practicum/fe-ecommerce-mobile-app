const API_URL = process.env.EXPO_PUBLIC_API_URL;

function getUrl(path) {
  if (!API_URL) {
    throw new Error(
      'EXPO_PUBLIC_API_URL belum diatur. Salin .env.example ke .env lalu isi URL backend.',
    );
  }
  return `${API_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
}

export async function request(path, options = {}) {
  const response = await fetch(getUrl(path), {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.message || payload.error || 'Permintaan ke server gagal.');
  }
  return payload;
}

export function getProducts() {
  return request('/products');
}

export function login(credentials) {
  return request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) });
}

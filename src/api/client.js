import { Platform } from 'react-native';

const REQUEST_TIMEOUT_MS = 15_000;

function resolveApiUrl() {
  const configuredUrl = process.env.EXPO_PUBLIC_API_URL;

  // Android Emulator reaches the development computer through 10.0.2.2.
  // Web and iOS Simulator can use localhost directly.
  if (Platform.OS === 'android' && configuredUrl?.includes('://localhost')) {
    return configuredUrl.replace('://localhost', '://10.0.2.2');
  }

  // Supports existing Android Emulator development configurations too.
  if (Platform.OS === 'ios' && configuredUrl?.includes('://10.0.2.2')) {
    return configuredUrl.replace('://10.0.2.2', '://localhost');
  }

  return configuredUrl;
}

const API_URL = resolveApiUrl();

function getUrl(path) {
  if (!API_URL) {
    throw new Error(
      'EXPO_PUBLIC_API_URL belum diatur. Salin .env.example ke .env lalu isi URL backend.',
    );
  }
  return `${API_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
}

export async function request(path, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response;
  try {
    response = await fetch(getUrl(path), {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options,
      signal: controller.signal,
    });
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Server tidak merespons. Periksa koneksi backend lalu coba lagi.');
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.message || payload.error || 'Permintaan ke server gagal.');
  }
  return payload;
}

function queryString(params = {}) {
  const pairs = Object.entries(params).filter(([, value]) => value !== undefined && value !== '');
  if (!pairs.length) return '';
  return `?${pairs.map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join('&')}`;
}

export function getProducts(params) {
  return request(`/products${queryString(params)}`).then(({ data = [] }) => data.map(normalizeProduct));
}

export function getCategories() {
  return request('/products/categories').then(({ data = [] }) => data);
}

export function getProduct(id) {
  return request(`/products/${id}`).then(({ data }) => normalizeProduct(data));
}

export function createProduct(product) {
  return request('/products', { method: 'POST', body: JSON.stringify(product) }).then(({ data }) =>
    normalizeProduct(data),
  );
}

export function updateProduct(id, product) {
  return request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(product) }).then(({ data }) =>
    normalizeProduct(data),
  );
}

export function updateProductStock(id, stock) {
  return request(`/products/${id}/stock`, {
    method: 'PATCH',
    body: JSON.stringify({ stock }),
  }).then(({ data }) => normalizeProduct(data));
}

export function deleteProduct(id) {
  return request(`/products/${id}`, { method: 'DELETE' });
}

export function login({ identifier, password }) {
  return request('/users/login', {
    method: 'POST',
    body: JSON.stringify({ identifier, password }),
  });
}

export function register(account) {
  return request('/users/register', { method: 'POST', body: JSON.stringify(account) });
}

export function getCurrentUser(token) {
  return request('/users/me', { headers: { Authorization: `Bearer ${token}` } });
}

export function normalizeProduct(product) {
  return {
    id: product._id,
    name: product.name,
    category: product.category,
    price: product.price,
    oldPrice: product.price,
    rating: product.rating || 0,
    sold: product.sold ? String(product.sold) : 'New',
    discount: product.discount || 0,
    image: product.images?.[0],
    images: product.images || [],
    store: product.storeName,
    location: product.location || 'Indonesia',
    badge: product.badge || 'Store',
    description: product.description,
    stock: product.stock,
  };
}

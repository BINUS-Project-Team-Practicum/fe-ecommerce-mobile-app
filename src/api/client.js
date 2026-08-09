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
  return request('/products').then(({ data = [] }) => data.map(normalizeProduct));
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

function normalizeProduct(product) {
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

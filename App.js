import './global.css';
import { useEffect, useState } from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import {
  AuthScreen,
  OnboardingScreen,
  SplashScreen,
} from './src/screens/auth/MarketplaceAuthViews';
import { AppShell } from './src/screens/shared/MarketplaceViews';
import {
  createProduct,
  deleteProduct,
  getCategories,
  getCurrentUser,
  getProducts,
  updateProduct,
  updateProductStock,
} from './src/api/client';

const STORAGE_KEY = 'binus-marketplace-state';
const BASE64_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

function isActiveToken(token) {
  try {
    const payload = token.split('.')[1]?.replace(/-/g, '+').replace(/_/g, '/');
    if (!payload) return false;

    let bits = 0;
    let buffer = 0;
    let decoded = '';
    for (const character of payload) {
      if (character === '=') break;
      const value = BASE64_ALPHABET.indexOf(character);
      if (value < 0) return false;
      buffer = (buffer << 6) | value;
      bits += 6;
      if (bits >= 8) {
        bits -= 8;
        decoded += String.fromCharCode((buffer >> bits) & 0xff);
      }
    }

    const { exp } = JSON.parse(decoded);
    return Number.isFinite(exp) && exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

function restoreCart(savedCart = [], products = []) {
  return savedCart.reduce((items, savedItem) => {
    const product = products.find(({ id }) => id === savedItem.id);
    return product ? [...items, { ...product, quantity: savedItem.quantity }] : items;
  }, []);
}

function serializeState({ user, cart, wishlist, orders }) {
  return JSON.stringify({
    user,
    wishlist,
    orders,
    cart: cart.map(({ id, quantity }) => ({ id, quantity })),
  });
}

export default function App() {
  const [stage, setStage] = useState('splash');
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [catalogStatus, setCatalogStatus] = useState('loading');
  const [catalogError, setCatalogError] = useState('');
  const [pendingCart, setPendingCart] = useState(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [hasSavedState, setHasSavedState] = useState(false);

  useEffect(() => {
    let active = true;
    Promise.all([getProducts(), getCategories()])
      .then(([productData, categoryData]) => {
        if (!active) return;
        setProducts(productData);
        setCategories(categoryData);
        setCatalogStatus('ready');
      })
      .catch((error) => {
        if (!active) return;
        setProducts([]);
        setCategories([]);
        setCatalogStatus('error');
        setCatalogError(error.message || 'Produk tidak dapat dimuat.');
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (pendingCart === null || catalogStatus !== 'ready') return;
    setCart(restoreCart(pendingCart, products));
    setPendingCart(null);
  }, [catalogStatus, pendingCart, products]);

  useEffect(() => {
    if (!isHydrated) return undefined;
    const timer = setTimeout(
      () =>
        setStage((current) =>
          current === 'splash' ? (user ? 'app' : hasSavedState ? 'auth' : 'onboarding') : current,
        ),
      900,
    );
    return () => clearTimeout(timer);
  }, [hasSavedState, isHydrated, user]);

  useEffect(() => {
    let isMounted = true;
    const hydrateState = async () => {
      try {
        const savedState = await SecureStore.getItemAsync(STORAGE_KEY);
        if (!savedState || !isMounted) return;
        setHasSavedState(true);
        const {
          user: savedUser,
          cart: savedCart,
          wishlist: savedWishlist,
          orders: savedOrders,
        } = JSON.parse(savedState);
        if (!isActiveToken(savedUser?.token)) {
          if (savedUser?.token) await SecureStore.deleteItemAsync(STORAGE_KEY);
          return;
        }

        const profile = await getCurrentUser(savedUser.token);
        if (!isMounted) return;
        const profileData = profile.data;
        setUser({
          ...savedUser,
          name:
            [profileData.firstName, profileData.lastName].filter(Boolean).join(' ') || savedUser.name,
          email: profileData.email || savedUser.email,
        });
        setPendingCart(savedCart || []);
        setWishlist(savedWishlist || []);
        setOrders(savedOrders || []);
      } catch {
        // Continue with a fresh session if local storage is unavailable or invalid.
      } finally {
        if (isMounted) setIsHydrated(true);
      }
    };
    hydrateState();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    SecureStore.setItemAsync(STORAGE_KEY, serializeState({ user, cart, wishlist, orders })).catch(
      () => {},
    );
  }, [cart, isHydrated, orders, user, wishlist]);
  const addToCart = (product) =>
    setCart((items) => {
      const found = items.find((item) => item.id === product.id);
      return found
        ? items.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
          )
        : [...items, { ...product, quantity: 1 }];
    });
  const updateQuantity = (id, quantity) =>
    setCart((items) =>
      quantity < 1
        ? items.filter((item) => item.id !== id)
        : items.map((item) => (item.id === id ? { ...item, quantity } : item)),
    );
  const createCatalogProduct = async (payload) => {
    const product = await createProduct(payload);
    setProducts((items) => [product, ...items]);
    setCategories((items) => (items.includes(product.category) ? items : [...items, product.category]));
    return product;
  };
  const updateCatalogProduct = async (id, payload) => {
    const product = await updateProduct(id, payload);
    setProducts((items) => items.map((item) => (item.id === id ? product : item)));
    return product;
  };
  const deleteCatalogProduct = async (id) => {
    await deleteProduct(id);
    setProducts((items) => items.filter((item) => item.id !== id));
  };
  const completeOrder = async () => {
    if (!cart.length) return false;
    await Promise.all(
      cart.map((item) => updateProductStock(item.id, Math.max(0, Number(item.stock || 0) - item.quantity))),
    );
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setOrders((items) => [
      {
        id: `MRA-${Date.now().toString().slice(-6)}`,
        items: cart.map(({ id, quantity }) => ({ id, quantity })),
        total,
        status: 'Diproses',
      },
      ...items,
    ]);
    setCart([]);
    setProducts((items) =>
      items.map((product) => {
        const ordered = cart.find((item) => item.id === product.id);
        return ordered
          ? { ...product, stock: Math.max(0, Number(product.stock || 0) - ordered.quantity) }
          : product;
      }),
    );
    return true;
  };
  const continueFromOnboarding = () => setStage(user ? 'app' : 'auth');
  const logout = async () => {
    setUser(null);
    setCart([]);
    setWishlist([]);
    setOrders([]);
    setStage('auth');
    await SecureStore.deleteItemAsync(STORAGE_KEY).catch(() => {});
  };

  // Tidak ada lagi gerbang tunggu font di sini. Ikon sekarang berupa SVG yang
  // ikut di dalam bundle JavaScript, jadi sudah siap begitu komponennya render.

  return (
    <SafeAreaView className="flex-1 bg-canvas" style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
      <StatusBar barStyle="dark-content" />
      {stage === 'splash' && <SplashScreen />}
      {stage === 'onboarding' && (
        <OnboardingScreen onDone={continueFromOnboarding} onSkip={continueFromOnboarding} />
      )}
      {stage === 'auth' && (
        <AuthScreen
          onBack={() => setStage('onboarding')}
          onSuccess={(account) => {
            setUser(account);
            setStage('app');
          }}
        />
      )}
      {stage === 'app' && (
        <AppShell
          user={user}
          products={products}
          categories={categories}
          catalogStatus={catalogStatus}
          catalogError={catalogError}
          cart={cart}
          orders={orders}
          wishlist={wishlist}
          onLogin={() => setStage('auth')}
          onLogout={logout}
          onAddToCart={addToCart}
          onUpdateQuantity={updateQuantity}
          onCompleteOrder={completeOrder}
          onCreateProduct={createCatalogProduct}
          onUpdateProduct={updateCatalogProduct}
          onDeleteProduct={deleteCatalogProduct}
          onUpdateProductStock={async (id, stock) => {
            const product = await updateProductStock(id, stock);
            setProducts((items) => items.map((item) => (item.id === id ? product : item)));
            return product;
          }}
          onToggleWishlist={(id) =>
            setWishlist((items) =>
              items.includes(id) ? items.filter((item) => item !== id) : [...items, id],
            )
          }
        />
      )}
    </SafeAreaView>
  );
}

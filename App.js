import './global.css';
import { useEffect, useState } from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import { useFonts } from 'expo-font';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as SecureStore from 'expo-secure-store';
import {
  AuthScreen,
  OnboardingScreen,
  SplashScreen,
} from './src/screens/auth/MarketplaceAuthViews';
import { AppShell } from './src/screens/shared/MarketplaceViews';
import { demoProducts } from './src/data/mockData';
import { getProducts } from './src/api/client';

const STORAGE_KEY = 'mora-marketplace-state';

function restoreCart(savedCart = []) {
  return savedCart.reduce((items, savedItem) => {
    const product = demoProducts.find(({ id }) => id === savedItem.id);
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
  const [iconsLoaded, iconLoadError] = useFonts(Ionicons.font);
  const [fontLoadTimedOut, setFontLoadTimedOut] = useState(false);
  const [stage, setStage] = useState('splash');
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState(demoProducts);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setFontLoadTimedOut(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    getProducts()
      .then((data) => data.length && setProducts(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const timer = setTimeout(
      () => setStage((current) => (current === 'splash' ? 'onboarding' : current)),
      900,
    );
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let isMounted = true;
    const hydrateState = async () => {
      try {
        const savedState = await SecureStore.getItemAsync(STORAGE_KEY);
        if (!savedState || !isMounted) return;
        const {
          user: savedUser,
          cart: savedCart,
          wishlist: savedWishlist,
          orders: savedOrders,
        } = JSON.parse(savedState);
        setUser(savedUser || null);
        setCart(restoreCart(savedCart));
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
  const completeOrder = () => {
    if (!cart.length) return;
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

  if (!iconsLoaded && !iconLoadError && !fontLoadTimedOut) return <SplashScreen />;

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
          cart={cart}
          orders={orders}
          wishlist={wishlist}
          onLogin={() => setStage('auth')}
          onLogout={logout}
          onAddToCart={addToCart}
          onUpdateQuantity={updateQuantity}
          onCompleteOrder={completeOrder}
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

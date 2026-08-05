import { useEffect, useState } from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import { AppShell, AuthScreen, OnboardingScreen, SplashScreen } from './src/screens/AppScreens';
import { demoProducts } from './src/data/mockData';

export default function App() {
  const [stage, setStage] = useState('splash');
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => { const timer = setTimeout(() => setStage('onboarding'), 900); return () => clearTimeout(timer); }, []);
  const addToCart = (product) => setCart((items) => {
    const found = items.find((item) => item.id === product.id);
    return found ? items.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item) : [...items, { ...product, quantity: 1 }];
  });
  const updateQuantity = (id, quantity) => setCart((items) => quantity < 1 ? items.filter((item) => item.id !== id) : items.map((item) => item.id === id ? { ...item, quantity } : item));
  const completeOrder = () => {
    if (!cart.length) return;
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setOrders((items) => [{ id: `MRA-${Date.now().toString().slice(-6)}`, items: cart, total, status: 'Diproses' }, ...items]);
    setCart([]);
  };

  return <SafeAreaView style={{ flex: 1, backgroundColor: '#F8FAFC' }}><StatusBar barStyle="dark-content" />
    {stage === 'splash' && <SplashScreen />}
    {stage === 'onboarding' && <OnboardingScreen onDone={() => setStage('auth')} onSkip={() => setStage('app')} />}
    {stage === 'auth' && <AuthScreen onBack={() => setStage('onboarding')} onSuccess={(account) => { setUser(account); setStage('app'); }} />}
    {stage === 'app' && <AppShell user={user} products={demoProducts} cart={cart} orders={orders} wishlist={wishlist} onLogin={() => setStage('auth')} onAddToCart={addToCart} onUpdateQuantity={updateQuantity} onCompleteOrder={completeOrder} onToggleWishlist={(id) => setWishlist((items) => items.includes(id) ? items.filter((item) => item !== id) : [...items, id])} />}
  </SafeAreaView>;
}

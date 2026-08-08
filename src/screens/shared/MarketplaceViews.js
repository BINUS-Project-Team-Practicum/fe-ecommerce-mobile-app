import { useEffect, useRef, useState } from 'react';
import { Animated, View } from 'react-native';
import { colors } from '../../components/ui';
import {
  BottomNav,
  CategoriesScreen,
  HomeScreen,
  SearchScreen,
} from '../home/MarketplaceHomeViews';
import CartScreen from '../shopping/CartScreen';
import CheckoutScreen from '../shopping/CheckoutScreen';
import OrderSuccessScreen from '../shopping/OrderSuccessScreen';
import ProductDetailScreen from '../shopping/ProductDetailScreen';
import { AccountUtilityScreen } from '../account/MarketplaceAccountViews';

export function AppShell(props) {
  const [page, setPage] = useState('home');
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState('');
  const opacity = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    opacity.setValue(0);
    translateY.setValue(10);
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 180, useNativeDriver: true }),
    ]).start();
  }, [opacity, page, translateY]);
  const navigate = (to, product) => {
    if (product) setSelected(product);
    setPage(to);
  };
  const screenProps = { ...props, navigate, selected, query, setQuery };
  const content = renderPage(page, screenProps);
  const showBottomNav = ['home', 'explore', 'wishlist', 'profile'].includes(page);
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Animated.View style={{ flex: 1, opacity, transform: [{ translateY }] }}>
        {content}
      </Animated.View>
      {showBottomNav ? <BottomNav page={page} setPage={setPage} /> : null}
    </View>
  );
}

function renderPage(page, screenProps) {
  const screenByPage = {
    home: HomeScreen,
    search: SearchScreen,
    explore: SearchScreen,
    detail: ProductDetailScreen,
    cart: CartScreen,
    checkout: CheckoutScreen,
    success: OrderSuccessScreen,
    categories: CategoriesScreen,
  };
  const Screen = screenByPage[page];
  return Screen ? (
    <Screen {...screenProps} />
  ) : (
    <AccountUtilityScreen page={page} {...screenProps} />
  );
}

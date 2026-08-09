import { useCallback, useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, BackHandler, Linking, Platform, View } from 'react-native';
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

const supportsNativeDriver = Platform.OS !== 'web';

export function AppShell(props) {
  const { products } = props;
  const [page, setPage] = useState('home');
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState('');
  const [backStack, setBackStack] = useState([]);
  const [reducedMotion, setReducedMotion] = useState(false);
  const hasHandledInitialLink = useRef(false);
  const opacity = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled()
      .then(setReducedMotion)
      .catch(() => {});
    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      setReducedMotion,
    );
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    opacity.setValue(0);
    translateY.setValue(reducedMotion ? 0 : 10);
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: reducedMotion ? 100 : 200,
        useNativeDriver: supportsNativeDriver,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: reducedMotion ? 100 : 200,
        useNativeDriver: supportsNativeDriver,
      }),
    ]).start();
  }, [opacity, page, reducedMotion, translateY]);
  const navigate = useCallback(
    (to, product, nextQuery = query) => {
      setBackStack((stack) => [...stack, { page, selected, query }]);
      setPage(to);
      setSelected(product || null);
      setQuery(nextQuery);
    },
    [page, query, selected],
  );

  const goBack = useCallback(() => {
    const previous = backStack.at(-1);
    if (!previous) return false;

    setBackStack((stack) => stack.slice(0, -1));
    setPage(previous.page);
    setSelected(previous.selected);
    setQuery(previous.query);
    return true;
  }, [backStack]);

  const navigateTab = useCallback((to) => {
    setBackStack([]);
    setPage(to);
    setSelected(null);
    setQuery('');
  }, []);

  const handleDeepLink = useCallback(
    (url) => {
      const [path, queryString = ''] = url.split('://').at(-1).split('?');
      const [route, productId] = path.split('/').filter(Boolean);
      const queryValue = new URLSearchParams(queryString).get('query') || '';

      if (route === 'product' && productId) {
        const product = products.find((item) => item.id === productId);
        if (product) navigate('detail', product);
        return;
      }
      if (route === 'search') return navigate('search', null, queryValue);
      if (['home', 'cart', 'wishlist', 'profile'].includes(route)) return navigateTab(route);
    },
    [navigate, navigateTab, products],
  );

  useEffect(() => {
    const subscription = Linking.addEventListener('url', ({ url }) => handleDeepLink(url));
    if (!hasHandledInitialLink.current) {
      hasHandledInitialLink.current = true;
      Linking.getInitialURL().then((url) => url && handleDeepLink(url));
    }
    return () => subscription.remove();
  }, [handleDeepLink]);

  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', goBack);
    return () => subscription.remove();
  }, [goBack]);

  const screenProps = { ...props, navigate, goBack, selected, query, setQuery };
  const content = renderPage(page, screenProps);
  const showBottomNav = ['home', 'explore', 'wishlist', 'profile'].includes(page);
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Animated.View style={{ flex: 1, opacity, transform: [{ translateY }] }}>
        {content}
      </Animated.View>
      {showBottomNav ? <BottomNav page={page} onNavigate={navigateTab} /> : null}
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

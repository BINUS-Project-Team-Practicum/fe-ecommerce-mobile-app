import { useState } from "react";
import { View } from "react-native";
import { colors } from "../../components/ui";
import { SplashScreen, OnboardingScreen, AuthScreen } from "../auth/MarketplaceAuthViews";
import { BottomNav, CategoriesScreen, HomeScreen, SearchScreen } from "../home/MarketplaceHomeViews";
import { CartScreen, CheckoutScreen, OrderSuccessScreen, ProductDetailScreen } from "../shopping/MarketplaceShoppingViews";
import { AccountUtilityScreen } from "../account/MarketplaceAccountViews";

export { SplashScreen, OnboardingScreen, AuthScreen, CategoriesScreen, HomeScreen, SearchScreen, CartScreen, CheckoutScreen, OrderSuccessScreen, ProductDetailScreen, AccountUtilityScreen };

export function AppShell(props) {
  const [page, setPage] = useState("home");
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState("");
  const navigate = (to, product) => {
    if (product) setSelected(product);
    setPage(to);
  };
  const screenProps = { ...props, navigate, selected, query, setQuery };
  const content = renderPage(page, screenProps);
  const showBottomNav = ["home", "explore", "wishlist", "profile"].includes(page);
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {content}
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
  return Screen ? <Screen {...screenProps} /> : <AccountUtilityScreen page={page} {...screenProps} />;
}

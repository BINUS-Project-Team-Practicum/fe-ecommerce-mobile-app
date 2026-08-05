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
  const navigate = (to, product) => { if (product) setSelected(product); setPage(to); };
  const screenProps = { ...props, navigate, selected, query, setQuery };
  const content = page === "home" ? <HomeScreen {...screenProps} /> : (page === "search" || page === "explore") ? <SearchScreen {...screenProps} /> : page === "detail" ? <ProductDetailScreen {...screenProps} /> : page === "cart" ? <CartScreen {...screenProps} /> : page === "checkout" ? <CheckoutScreen {...screenProps} /> : page === "success" ? <OrderSuccessScreen {...screenProps} /> : page === "categories" ? <CategoriesScreen {...screenProps} /> : <AccountUtilityScreen page={page} {...screenProps} />;
  const showBottomNav = ["home", "explore", "wishlist", "profile"].includes(page);
  return <View style={{ flex: 1, backgroundColor: colors.background }}>{content}{showBottomNav && <BottomNav page={page} setPage={setPage} />}</View>;
}

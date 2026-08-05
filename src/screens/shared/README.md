# Shared marketplace views

`MarketplaceViews.js` only owns the app-shell route renderer and re-exports public screen APIs.

- `auth/MarketplaceAuthViews.js` contains splash, onboarding, and authentication.
- `home/MarketplaceHomeViews.js` contains bottom navigation, home, search, and categories.
- `shopping/MarketplaceShoppingViews.js` contains product detail, cart, checkout, and order success.
- `account/MarketplaceAccountViews.js` contains account, wishlist, notifications, store, and other utility menus.
- `MarketplaceComponents.js` and `marketplaceStyles.js` contain reusable screen helpers and shared styles.

New screen work should be added in the matching menu folder; reusable visual primitives belong in `src/components`.

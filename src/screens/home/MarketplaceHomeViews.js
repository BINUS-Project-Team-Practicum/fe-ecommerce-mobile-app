import { Image, ImageBackground, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { categories } from "../../data/mockData";
import { Button, Chip, IconButton, SectionTitle, colors } from "../../components/ui";
import { Header } from "../shared/MarketplaceComponents";
import { sans, styles } from "../shared/marketplaceStyles";

export function BottomNav({ page, setPage }) {
  const nav = [
    ["home", "⌂", "Beranda"],
    ["categories", "▦", "Kategori"],
    ["wishlist", "♡", "Favorit"],
    ["notifications", "♧", "Notifikasi"],
    ["profile", "◉", "Akun"],
  ];
  return (
    <View style={styles.bottomNav}>
      {nav.map(([id, icon, label]) => (
        <Pressable key={id} onPress={() => setPage(id)} style={styles.navItem}>
          <Text style={[styles.navIcon, page === id && styles.navActive]}>
            {icon}
          </Text>
          <Text style={[styles.navLabel, page === id && styles.navActive]}>
            {label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

export function HomeScreen({
  products,
  cart,
  wishlist,
  onToggleWishlist,
  onLogin,
  navigate,
}) {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.homeScroll}
    >
      <View style={styles.homeHeader}>
        <View style={styles.delivery}>
          <Text style={styles.pin}>⌖</Text>
          <Text style={styles.deliveryText}>
            Deliver to{" "}
            <Text style={styles.deliveryStrong}>San Francisco, CA</Text>⌄
          </Text>
        </View>
        <View style={styles.headerIcons}>
          <IconButton icon="♧" onPress={() => navigate("notifications")} />
          <IconButton
            icon="🛒"
            badge={cart.length || null}
            onPress={() => navigate("cart")}
          />
        </View>
      </View>
      <Pressable
        onPress={() => navigate("search")}
        style={styles.referenceSearch}
      >
        <Text style={styles.referenceSearchIcon}>⌕</Text>
        <Text style={styles.referenceSearchText}>
          Search products, stores...
        </Text>
        <View style={styles.aiChip}>
          <Text style={styles.aiText}>AI</Text>
        </View>
      </Pressable>
      <ImageBackground
        imageStyle={styles.heroImage}
        source={{
          uri: "https://images.unsplash.com/photo-1612902456551-333ac5afa26e?auto=format&fit=crop&w=900&q=80",
        }}
        style={styles.referenceHero}
      >
        <View style={styles.heroOverlay}>
          <Text style={styles.referenceHeroTitle}>
            Summer Sale Up to 70% OFF
          </Text>
          <Text style={styles.referenceHeroCopy}>
            Limited time offer on thousands of products
          </Text>
          <Button
            label="Shop Now  →"
            variant="outline"
            small
            onPress={() => navigate("search")}
          />
        </View>
      </ImageBackground>
      <View style={styles.carouselDots}>
        <View style={styles.carouselActive} />
        <View style={styles.carouselDot} />
        <View style={styles.carouselDot} />
      </View>
      <View style={styles.referenceSectionLine}>
        <View style={styles.referenceSectionTitle}>
          <Text style={styles.flashSymbol}>ϟ</Text>
          <Text style={styles.referenceHeading}>Flash Sale</Text>
          <View style={styles.timer}>
            <Text>01:</Text>
          </View>
          <View style={styles.timer}>
            <Text>23:</Text>
          </View>
          <View style={styles.timer}>
            <Text>45</Text>
          </View>
        </View>
        <Text style={styles.seeAll}>See all ›</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalProducts}
      >
        {products.slice(0, 4).map((p) => (
          <ReferenceProduct
            key={p.id}
            product={p}
            onPress={() => navigate("detail", p)}
            wishlisted={wishlist.includes(p.id)}
            onWish={() => onToggleWishlist(p.id)}
          />
        ))}
      </ScrollView>
      <View style={styles.referenceSectionLine}>
        <Text style={styles.referenceHeading}>Categories</Text>
        <Text style={styles.seeAll}>All ›</Text>
      </View>
      <View style={styles.categoryGrid}>
        {categories.slice(1, 5).map(([icon, label]) => (
          <Pressable
            key={label}
            onPress={() => navigate("search")}
            style={styles.referenceCategory}
          >
            <View style={styles.referenceCategoryIcon}>
              <Text style={styles.referenceCategoryEmoji}>{icon}</Text>
            </View>
            <Text numberOfLines={1} style={styles.referenceCategoryText}>
              {label}
            </Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.referenceSectionLine}>
        <View style={styles.referenceSectionTitle}>
          <Text style={{ color: "#3B82F6" }}>↗</Text>
          <Text style={styles.referenceHeading}>Best Sellers</Text>
        </View>
        <Text style={styles.seeAll}>See all ›</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalProducts}
      >
        {products
          .slice(4)
          .concat(products.slice(0, 2))
          .map((p) => (
            <ReferenceProduct
              key={`best-${p.id}`}
              product={p}
              onPress={() => navigate("detail", p)}
              wishlisted={wishlist.includes(p.id)}
              onWish={() => onToggleWishlist(p.id)}
            />
          ))}
      </ScrollView>
      <View style={styles.referenceSectionLine}>
        <View style={styles.referenceSectionTitle}>
          <Text style={{ color: "#F59E0B" }}>♧</Text>
          <Text style={styles.referenceHeading}>Official Stores</Text>
        </View>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.storeScroller}
      >
        {["NikeOfficial", "SoundHub", "TechWorld", "StyleCo"].map(
          (store, i) => (
            <Pressable
              key={store}
              onPress={() => navigate("store")}
              style={styles.officialCard}
            >
              <View style={styles.officialIcon}>
                <Text style={{ fontSize: 28 }}>
                  {["👟", "🎧", "💻", "👜"][i]}
                </Text>
              </View>
              <Text style={styles.officialName}>{store}</Text>
              <Text style={styles.officialBadge}>✓ Official</Text>
            </Pressable>
          ),
        )}
      </ScrollView>
      <View style={styles.infoBanner}>
        <Text style={styles.infoBannerTitle}>Shop smarter with an account</Text>
        <Text style={styles.infoBannerText}>
          Get personalized product recommendations.
        </Text>
        <Button label="Sign In" small onPress={onLogin} />
      </View>
    </ScrollView>
  );
}
function ReferenceProduct({ product, onPress, wishlisted, onWish }) {
  return (
    <Pressable onPress={onPress} style={styles.referenceProduct}>
      <View>
        <Image
          source={{ uri: product.image }}
          style={styles.referenceProductImage}
        />
        <View style={styles.referenceDiscount}>
          <Text style={styles.referenceDiscountText}>-{product.discount}%</Text>
        </View>
        <Pressable
          onPress={(e) => {
            e.stopPropagation();
            onWish();
          }}
          style={styles.referenceHeart}
        >
          <Text style={{ color: "#94A3B8", fontSize: 21 }}>
            {wishlisted ? "♥" : "♡"}
          </Text>
        </Pressable>
      </View>
      <Text numberOfLines={1} style={styles.referenceStore}>
        {product.store}
      </Text>
      <Text numberOfLines={2} style={styles.referenceProductName}>
        {product.name}
      </Text>
      <View style={styles.referenceRating}>
        <Text>★★★★</Text>
        <Text style={{ color: "#D0D5DD" }}>★</Text>
        <Text style={styles.referenceRatingText}>{product.rating}</Text>
      </View>
      <View style={styles.referencePriceLine}>
        <Text style={styles.referencePrice}>{money(product.price)}</Text>
        <Text style={styles.referenceSold}>{product.sold} sold</Text>
      </View>
    </Pressable>
  );
}
function MiniProduct({ product, onPress }) {
  return (
    <Pressable onPress={onPress} style={styles.miniProduct}>
      <Image source={{ uri: product.image }} style={styles.miniImage} />
      <Text numberOfLines={1} style={styles.miniName}>
        {product.name}
      </Text>
      <Text style={styles.miniPrice}>{money(product.price)}</Text>
    </Pressable>
  );
}
function ProductGrid({ products, wishlist, onWishlist, onPress }) {
  return (
    <View style={styles.grid}>
      {products.map((p) => (
        <ProductCard
          key={p.id}
          product={p}
          onPress={() => onPress(p)}
          wishlisted={wishlist.includes(p.id)}
          onWishlist={() => onWishlist(p.id)}
        />
      ))}
    </View>
  );
}

export function SearchScreen({
  products,
  wishlist,
  onToggleWishlist,
  navigate,
  query,
  setQuery,
}) {
  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.store.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <View style={styles.page}>
      <View style={styles.toolbar}>
        <Pressable onPress={() => navigate("home")}>
          <Text style={styles.back}>‹</Text>
        </Pressable>
        <View style={styles.searchInput}>
          <Text>⌕</Text>
          <TextInputProxy value={query} onChange={setQuery} />
        </View>
        <Pressable onPress={() => {}}>
          <Text style={styles.filter}>☷</Text>
        </Pressable>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chips}
      >
        <Chip label="Semua" active />
        <Chip label="Gratis ongkir" />
        <Chip label="Official Store" />
        <Chip label="Rating 4.5+" />
      </ScrollView>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.resultCount}>
          {query
            ? `${filtered.length} hasil untuk “${query}”`
            : "Produk terpopuler"}
        </Text>
        <ProductGrid
          products={filtered}
          wishlist={wishlist}
          onWishlist={onToggleWishlist}
          onPress={(p) => navigate("detail", p)}
        />
      </ScrollView>
    </View>
  );
}
function TextInputProxy({ value, onChange }) {
  const { TextInput } = require("react-native");
  return (
    <TextInput
      autoFocus
      value={value}
      onChangeText={onChange}
      placeholder="Cari di mora"
      placeholderTextColor="#9CA3AF"
      style={{ flex: 1, color: colors.text }}
    />
  );
}

export function CategoriesScreen({ navigate }) {
  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <Header title="Kategori" onBack={() => navigate("home")} />
      <Text style={styles.resultCount}>
        Pilih kategori yang ingin kamu jelajahi
      </Text>
      <View style={styles.fullCategoryGrid}>
        {categories
          .concat(categories.slice(1, 5))
          .map(([icon, label], index) => (
            <Pressable
              key={`${label}${index}`}
              onPress={() => navigate("search")}
              style={styles.fullCategory}
            >
              <View style={styles.fullCategoryIcon}>
                <Text style={{ fontSize: 25 }}>{icon}</Text>
              </View>
              <Text style={styles.fullCategoryText}>{label}</Text>
            </Pressable>
          ))}
      </View>
      <SectionTitle title="Toko resmi pilihan" />
      <View style={styles.storeRow}>
        <Text style={styles.storeAvatar}>A</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.storeName}>Aster Official Store</Text>
          <Text style={styles.storeInfo}>★ 4.9 · Online 5 menit lalu</Text>
        </View>
        <Button
          label="Kunjungi"
          small
          variant="outline"
          onPress={() => navigate("store")}
        />
      </View>
    </ScrollView>
  );
}

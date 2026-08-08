import { ImageBackground, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { categories } from '../../data/mockData';
import {
  Button,
  Badge,
  Chip,
  IconButton,
  ProductCard,
  SectionTitle,
  colors,
} from '../../components/ui';
import { Icon } from '../../components/Icon';
import { Header, ProductGrid, ReferenceProduct } from '../shared/MarketplaceComponents';
import { sans } from '../shared/sharedStyles';
import { styles } from './homeStyles';

export function BottomNav({ page, setPage }) {
  const nav = [
    ['home', 'home-outline', 'Beranda'],
    ['explore', 'compass-outline', 'Explore'],
    ['wishlist', 'heart-outline', 'Favorit'],
    ['profile', 'person-outline', 'Akun'],
  ];
  return (
    <View style={styles.bottomNav}>
      {nav.map(([id, icon, label]) => (
        <Pressable key={id} onPress={() => setPage(id)} style={styles.navItem}>
          <Icon
            name={page === id ? icon.replace('-outline', '') : icon}
            size={21}
            color={page === id ? colors.primary : '#94A3B8'}
          />
          <Text style={[styles.navLabel, page === id && styles.navActive]}>{label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

export function HomeScreen({
  products,
  cart,
  wishlist,
  user,
  onToggleWishlist,
  onLogin,
  navigate,
  setQuery,
}) {
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const openCategory = (category) => {
    setQuery(category);
    navigate('search');
  };
  const openAllProducts = () => {
    setQuery('');
    navigate('search');
  };
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.homeScroll}>
      <View style={styles.homeHeader}>
        <View style={styles.delivery}>
          <Icon name="location-outline" size={18} color={colors.primary} />
          <Text style={styles.deliveryText}>
            Deliver to <Text style={styles.deliveryStrong}>South Jakarta</Text>
          </Text>
        </View>
        <View style={styles.headerIcons}>
          <IconButton icon="notifications-outline" onPress={() => navigate('notifications')} />
          <IconButton
            icon="bag-handle-outline"
            badge={cartItemCount || null}
            onPress={() => navigate('cart')}
          />
        </View>
      </View>
      <Pressable onPress={() => navigate('search')} style={styles.referenceSearch}>
        <Icon name="search-outline" size={20} color="#98A2B3" />
        <Text style={styles.referenceSearchText}>Search products, brands, or stores</Text>
      </Pressable>
      <ImageBackground
        imageStyle={styles.heroImage}
        source={{
          uri: 'https://images.unsplash.com/photo-1612902456551-333ac5afa26e?auto=format&fit=crop&w=900&q=80',
        }}
        style={styles.referenceHero}
      >
        <View style={styles.heroOverlay}>
          <Text style={styles.referenceHeroTitle}>Save up to 70% today</Text>
          <Text style={styles.referenceHeroCopy}>Curated picks from stores you can trust</Text>
          <Button label="Shop now" variant="outline" small onPress={openAllProducts} />
        </View>
      </ImageBackground>
      <View style={styles.referenceSectionLine}>
        <View style={styles.referenceSectionTitle}>
          <Icon name="flash-outline" size={20} color="#FF7A00" />
          <Text style={styles.referenceHeading}>Flash Sale</Text>
          <Badge label="Limited" tone="neutral" />
        </View>
        <Pressable onPress={openAllProducts}>
          <Text style={styles.seeAll}>View all</Text>
        </Pressable>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalProducts}
      >
        {products.slice(0, 2).map((p) => (
          <ReferenceProduct
            key={p.id}
            product={p}
            onPress={() => navigate('detail', p)}
            wishlisted={wishlist.includes(p.id)}
            onWish={() => onToggleWishlist(p.id)}
          />
        ))}
      </ScrollView>
      <View style={styles.referenceSectionLine}>
        <Text style={styles.referenceHeading}>Categories</Text>
        <Pressable onPress={() => navigate('categories')}>
          <Text style={styles.seeAll}>View all</Text>
        </Pressable>
      </View>
      <View style={styles.categoryGrid}>
        {categories.slice(1, 5).map(([icon, label]) => (
          <Pressable
            key={label}
            onPress={() => openCategory(label)}
            style={styles.referenceCategory}
          >
            <View style={styles.referenceCategoryIcon}>
              <Icon name={icon} size={26} color={colors.primary} />
            </View>
            <Text numberOfLines={1} style={styles.referenceCategoryText}>
              {label}
            </Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.referenceSectionLine}>
        <View style={styles.referenceSectionTitle}>
          <Icon name="trending-up-outline" size={18} color="#3B82F6" />
          <Text style={styles.referenceHeading}>Best Sellers</Text>
        </View>
        <Pressable onPress={openAllProducts}>
          <Text style={styles.seeAll}>View all</Text>
        </Pressable>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalProducts}
      >
        {products.slice(2, 4).map((p) => (
          <ReferenceProduct
            key={`best-${p.id}`}
            product={p}
            onPress={() => navigate('detail', p)}
            wishlisted={wishlist.includes(p.id)}
            onWish={() => onToggleWishlist(p.id)}
          />
        ))}
      </ScrollView>
      <View style={styles.referenceSectionLine}>
        <View style={styles.referenceSectionTitle}>
          <Icon name="shield-checkmark-outline" size={18} color="#F59E0B" />
          <Text style={styles.referenceHeading}>Official Stores</Text>
        </View>
        <Pressable onPress={() => navigate('store')}>
          <Text style={styles.seeAll}>View all</Text>
        </Pressable>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.storeScroller}
      >
        {['Tech Haven', 'Move Society', 'Aster Beauty', 'Atelier Home'].map((store, i) => (
          <Pressable key={store} onPress={() => navigate('store')} style={styles.officialCard}>
            <View style={styles.officialIcon}>
              <Icon
                name={
                  ['footsteps-outline', 'headset-outline', 'laptop-outline', 'bag-handle-outline'][
                    i
                  ]
                }
                size={27}
                color={colors.primary}
              />
            </View>
            <Text style={styles.officialName}>{store}</Text>
            <Text style={styles.officialBadge}>Verified seller</Text>
          </Pressable>
        ))}
      </ScrollView>
      <View style={styles.personalizedHeader}>
        <View>
          <Text style={styles.personalizedEyebrow}>PICKED FOR YOU</Text>
          <Text style={styles.personalizedTitle}>Discover your next favorite</Text>
        </View>
        <Badge label="For you" tone="info" />
      </View>
      <View style={styles.recommendGrid}>
        {products.slice(4, 6).map((p) => (
          <ProductCard
            key={`for-you-${p.id}`}
            product={p}
            onPress={() => navigate('detail', p)}
            wishlisted={wishlist.includes(p.id)}
            onWishlist={() => onToggleWishlist(p.id)}
            style={styles.recommendCard}
            imageStyle={styles.recommendImage}
          />
        ))}
      </View>
      <View style={styles.trustStrip}>
        <Icon name="checkmark" size={16} color="#fff" style={styles.trustIcon} />
        <View style={{ flex: 1 }}>
          <Text style={styles.trustTitle}>Shop with confidence at mora.</Text>
          <Text style={styles.trustCopy}>
            Secure checkout · Curated products · Support when you need it
          </Text>
        </View>
      </View>
      {!user ? (
        <View style={styles.infoBanner}>
          <Text style={styles.infoBannerTitle}>Make shopping more personal</Text>
          <Text style={styles.infoBannerText}>
            Get tailored recommendations, vouchers, and order updates.
          </Text>
          <Button label="Sign in" small onPress={onLogin} />
        </View>
      ) : null}
    </ScrollView>
  );
}

export function SearchScreen({ products, wishlist, onToggleWishlist, navigate, query, setQuery }) {
  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.store.toLowerCase().includes(query.toLowerCase()) ||
      p.category?.toLowerCase() === query.toLowerCase(),
  );
  const recentSearches = ['wireless headphones', 'running shoes', 'minimal watch', 'coffee maker'];
  const trending = ['Air Max', 'Smart Watch', 'Noise Cancelling', 'Leather Bag'];
  return (
    <View style={styles.page}>
      <View style={styles.searchToolbar}>
        <Pressable onPress={() => navigate('home')} style={styles.searchRoundButton}>
          <Icon name="chevron-back" size={25} color="#344054" />
        </Pressable>
        <View style={styles.referenceSearchInput}>
          <Icon name="search-outline" size={20} color={colors.primary} />
          <TextInputProxy value={query} onChange={setQuery} />
        </View>
        <Pressable onPress={() => {}} style={styles.searchRoundButton}>
          <Icon name="options-outline" size={21} color={colors.text} />
        </Pressable>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.searchCategoriesContainer}
        contentContainerStyle={styles.searchCategories}
      >
        <Chip label="All" active />
        <Chip label="Electronics" />
        <Chip label="Fashion" />
        <Chip label="Home" />
        <Chip label="Sports" />
      </ScrollView>
      <ScrollView contentContainerStyle={styles.scroll}>
        {!query && (
          <>
            <Text style={styles.searchGroupTitle}>RECENT SEARCHES</Text>
            <View style={styles.recentSearches}>
              {recentSearches.map((item) => (
                <Pressable key={item} onPress={() => setQuery(item)} style={styles.recentChip}>
                  <Icon name="time-outline" size={16} color="#64748B" />
                  <Text style={styles.recentText}>{item}</Text>
                </Pressable>
              ))}
            </View>
            <Text style={styles.searchGroupTitle}>TRENDING</Text>
            <View style={styles.trendingSearches}>
              {trending.map((item) => (
                <Pressable key={item} onPress={() => setQuery(item)} style={styles.trendingChip}>
                  <Icon name="trending-up-outline" size={16} color={colors.primary} />
                  <Text style={styles.trendingText}>{item}</Text>
                </Pressable>
              ))}
            </View>
          </>
        )}
        {query ? (
          <Text style={styles.resultCount}>
            {filtered.length} results for “{query}”
          </Text>
        ) : null}
        <ProductGrid
          products={filtered}
          wishlist={wishlist}
          onWishlist={onToggleWishlist}
          onPress={(p) => navigate('detail', p)}
        />
      </ScrollView>
    </View>
  );
}
function TextInputProxy({ value, onChange }) {
  return (
    <TextInput
      autoFocus
      value={value}
      onChangeText={onChange}
      placeholder="Search products..."
      placeholderTextColor="#9CA3AF"
      style={{
        flex: 1,
        color: colors.text,
        fontFamily: sans,
        fontSize: 14,
        fontWeight: '500',
      }}
    />
  );
}

export function CategoriesScreen({ navigate }) {
  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <Header title="Kategori" onBack={() => navigate('home')} />
      <Text style={styles.resultCount}>Pilih kategori yang ingin kamu jelajahi</Text>
      <View style={styles.fullCategoryGrid}>
        {categories.concat(categories.slice(1, 5)).map(([icon, label], index) => (
          <Pressable
            key={`${label}${index}`}
            onPress={() => navigate('search')}
            style={styles.fullCategory}
          >
            <View style={styles.fullCategoryIcon}>
              <Icon name={icon} size={25} color={colors.primary} />
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
          <Text style={styles.storeInfo}>Rating 4.9 · Online 5 menit lalu</Text>
        </View>
        <Button label="Kunjungi" small variant="outline" onPress={() => navigate('store')} />
      </View>
    </ScrollView>
  );
}

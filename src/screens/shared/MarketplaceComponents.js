import { Image, Pressable, Text, useWindowDimensions, View } from 'react-native';
import { money } from '../../data/mockData';
import { ProductCard } from '../../components/ui';
import { Icon } from '../../components/Icon';
import { styles } from './marketplaceComponentStyles';

export function ReferenceProduct({ product, onPress, wishlisted, onWish }) {
  return (
    <Pressable onPress={onPress} style={styles.referenceProduct}>
      <View>
        <Image source={{ uri: product.image }} style={styles.referenceProductImage} />
        {Number(product.discount) > 0 ? (
          <View style={styles.referenceDiscount}>
            <Text style={styles.referenceDiscountText}>-{product.discount}%</Text>
          </View>
        ) : null}
        <Pressable
          onPress={(e) => {
            e.stopPropagation();
            onWish();
          }}
          style={styles.referenceHeart}
        >
          <Icon
            name={wishlisted ? 'heart' : 'heart-outline'}
            size={20}
            color={wishlisted ? '#EF4444' : '#94A3B8'}
          />
        </Pressable>
      </View>
      <Text numberOfLines={1} style={styles.referenceStore}>
        {product.store}
      </Text>
      <Text numberOfLines={2} style={styles.referenceProductName}>
        {product.name}
      </Text>
      <View style={styles.referenceRating}>
        <Icon name="star" size={13} color="#F59E0B" />
        <Text style={styles.referenceRatingText}>{product.rating}</Text>
      </View>
      <View style={styles.referencePriceLine}>
        <Text style={styles.referencePrice}>{money(product.price)}</Text>
        <Text style={styles.referenceSold}>{product.sold} sold</Text>
      </View>
    </Pressable>
  );
}
export function MiniProduct({ product, onPress }) {
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
export function ProductGrid({ products, wishlist, onWishlist, onPress }) {
  const { width } = useWindowDimensions();
  const columnCount = width >= 768 ? 3 : 2;
  const gap = 10;
  const cardWidth = (width - 32 - gap * (columnCount - 1)) / columnCount;
  return (
    <View style={styles.grid}>
      {products.map((p) => (
        <ProductCard
          key={p.id}
          product={p}
          onPress={() => onPress(p)}
          wishlisted={wishlist.includes(p.id)}
          onWishlist={() => onWishlist(p.id)}
          style={{ width: cardWidth, flexGrow: 0, flexShrink: 0 }}
          imageStyle={{ height: cardWidth * 1.05 }}
        />
      ))}
    </View>
  );
}

export function InfoRow({ icon, title, body }) {
  return (
    <View style={styles.infoRow}>
      <Icon name={icon} size={20} color="#10B981" />
      <View style={{ flex: 1 }}>
        <Text style={styles.infoTitle}>{title}</Text>
        <Text style={styles.infoBody}>{body}</Text>
      </View>
      <Icon name="chevron-forward" size={18} color="#6B7280" />
    </View>
  );
}

export function Header({ title, onBack }) {
  return (
    <View style={styles.header}>
      <Pressable onPress={onBack}>
        <Icon name="chevron-back" size={28} color="#111827" />
      </Pressable>
      <Text style={styles.headerTitle}>{title}</Text>
      <View style={{ width: 28 }} />
    </View>
  );
}

export function MenuGroup({ title, entries, navigate }) {
  return (
    <View style={styles.menuGroup}>
      <Text style={styles.menuTitle}>{title}</Text>
      {entries.map(({ id, icon, label }) => (
        <Pressable key={id} onPress={() => navigate(id)} style={styles.menu}>
          <Icon name={icon} size={19} color="#10B981" />
          <Text style={styles.menuLabel}>{label}</Text>
          <Icon name="chevron-forward" size={18} color="#6B7280" />
        </Pressable>
      ))}
    </View>
  );
}

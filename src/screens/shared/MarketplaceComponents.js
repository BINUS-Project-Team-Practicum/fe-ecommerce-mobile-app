import { Image, Pressable, Text, useWindowDimensions, View } from "react-native";
import { money } from "../../data/mockData";
import { Button, ProductCard, colors } from "../../components/ui";
import { styles } from "./marketplaceStyles";

export function ReferenceProduct({ product, onPress, wishlisted, onWish }) {
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
      <Text style={styles.infoIcon}>{icon}</Text>
      <View style={{ flex: 1 }}>
        <Text style={styles.infoTitle}>{title}</Text>
        <Text style={styles.infoBody}>{body}</Text>
      </View>
      <Text style={styles.chevron}>›</Text>
    </View>
  );
}


export function Header({ title, onBack }) {
  return (
    <View style={styles.header}>
      <Pressable onPress={onBack}>
        <Text style={styles.back}>‹</Text>
      </Pressable>
      <Text style={styles.headerTitle}>{title}</Text>
      <View style={{ width: 28 }} />
    </View>
  );
}
function MenuGroup({ title, entries, navigate }) {
  return (
    <View style={styles.menuGroup}>
      <Text style={styles.menuTitle}>{title}</Text>
      {entries.map((entry) => {
        const [id, icon, label] = entry.split("|");
        return (
          <Pressable onPress={() => navigate(id)} key={id} style={styles.menu}>
            <Text style={styles.menuIcon}>{icon}</Text>
            <Text style={{ flex: 1, color: colors.text, fontWeight: "600" }}>
              {label}
            </Text>
            <Text style={styles.chevron}>›</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

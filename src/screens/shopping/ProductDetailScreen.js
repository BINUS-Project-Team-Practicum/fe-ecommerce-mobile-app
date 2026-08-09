import { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { money } from '../../data/mockData';
import { Button, EmptyState, IconButton, Rating, Toast } from '../../components/ui';
import { Icon } from '../../components/Icon';
import { styles } from './shoppingStyles';

const VARIANTS = [
  ['Midnight Black', '#151515'],
  ['Pearl White', '#F4F4F5'],
  ['Navy Blue', '#1E3A5F'],
];
const TABS = [
  ['description', 'Description'],
  ['specs', 'Specs'],
  ['reviews', 'Reviews'],
];

export default function ProductDetailScreen({
  selected: product,
  cart,
  wishlist,
  onToggleWishlist,
  onAddToCart,
  navigate,
}) {
  const [variant, setVariant] = useState(VARIANTS[0][0]);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [showCartFeedback, setShowCartFeedback] = useState(false);

  useEffect(() => {
    if (!showCartFeedback) return undefined;
    const timeout = setTimeout(() => setShowCartFeedback(false), 2200);
    return () => clearTimeout(timeout);
  }, [showCartFeedback]);

  if (!product)
    return (
      <EmptyState
        title="Product not found"
        body="Return to Home and choose another product."
        action="Go to Home"
        onAction={() => navigate('home')}
      />
    );

  const addToCart = () => Array.from({ length: quantity }).forEach(() => onAddToCart(product));
  const isWishlisted = wishlist.includes(product.id);

  return (
    <View style={styles.page}>
      <ScrollView contentContainerStyle={{ paddingBottom: 106 }}>
        <DetailHeader
          isWishlisted={isWishlisted}
          onBack={() => navigate('home')}
          onWishlist={() => onToggleWishlist(product.id)}
        />
        <ProductGallery product={product} />
        <View style={styles.detailBody}>
          <ProductOverview product={product} />
          <VariantSelector value={variant} onChange={setVariant} />
          <QuantityControl quantity={quantity} onChange={setQuantity} />
          <ProductBenefits />
          <ProductTabs activeTab={activeTab} onChange={setActiveTab} product={product} />
        </View>
      </ScrollView>
      <View style={styles.stickyCta}>
        <IconButton
          icon="bag-handle-outline"
          badge={cart?.reduce((total, item) => total + item.quantity, 0) || null}
          accessibilityLabel="Open cart"
          onPress={() => navigate('cart')}
        />
        <View style={styles.ctaButton}>
          <Button
            label="Add to cart"
            variant="outline"
            onPress={() => {
              addToCart();
              setShowCartFeedback(true);
            }}
          />
        </View>
        <View style={styles.ctaButton}>
          <Button
            label="Buy now"
            onPress={() => {
              addToCart();
              navigate('checkout');
            }}
          />
        </View>
      </View>
      <Toast visible={showCartFeedback} message="Added to cart" />
    </View>
  );
}

function DetailHeader({ isWishlisted, onBack, onWishlist }) {
  return (
    <View style={styles.detailTop}>
      <Pressable accessibilityLabel="Go back" onPress={onBack} style={styles.floatingBack}>
        <Icon name="chevron-back" size={28} color="#111827" />
      </Pressable>
      <View style={styles.detailTopActions}>
        <Pressable accessibilityLabel="Share product" style={styles.floatingAction}>
          <Icon name="share-social-outline" size={20} />
        </Pressable>
        <Pressable
          accessibilityLabel="Save to wishlist"
          onPress={onWishlist}
          style={styles.floatingAction}
        >
          <Icon
            name={isWishlisted ? 'heart' : 'heart-outline'}
            size={20}
            color={isWishlisted ? '#EF4444' : '#111827'}
          />
        </Pressable>
      </View>
    </View>
  );
}

function ProductGallery({ product }) {
  return (
    <View style={styles.detailGallery}>
      <Image source={{ uri: product.image }} style={styles.detailImage} />
      <View style={styles.detailThumbnails}>
        {[0, 1, 2].map((index) => (
          <View
            key={index}
            style={[styles.detailThumbnail, index === 0 && styles.detailThumbnailActive]}
          >
            <Image source={{ uri: product.image }} style={styles.thumbnailImage} />
          </View>
        ))}
      </View>
      <View style={styles.galleryCount}>
        <Text style={styles.galleryCountText}>1/3</Text>
      </View>
    </View>
  );
}

function ProductOverview({ product }) {
  const discount = Number(product.discount) || 0;
  const hasDiscount = discount > 0 && Number(product.oldPrice) > Number(product.price);
  return (
    <>
      <Text style={styles.detailStore}>
        {product.store || 'Marketplace store'}
        {product.badge ? <Text style={styles.detailOfficial}> · {product.badge}</Text> : null}
      </Text>
      <Text style={styles.detailName}>{product.name}</Text>
      <View style={styles.detailPriceRow}>
        <Text style={styles.detailPrice}>{money(product.price)}</Text>
        {hasDiscount ? <Text style={styles.detailOldPrice}>{money(product.oldPrice)}</Text> : null}
        {hasDiscount ? <Text style={styles.detailDiscount}>-{discount}%</Text> : null}
      </View>
      <View style={styles.detailMeta}>
        <Icon name="star" size={14} color="#F59E0B" />
        <Text style={styles.detailRating}>
          {product.rating} ({product.sold})
        </Text>
        <Text style={styles.detailSold}>{product.sold} sold</Text>
      </View>
    </>
  );
}

function VariantSelector({ value, onChange }) {
  return (
    <View style={styles.detailSection}>
      <Text style={styles.variantLabel}>
        Color: <Text style={styles.variantValue}>{value}</Text>
      </Text>
      <View style={styles.variantRow}>
        {VARIANTS.map(([name, color]) => (
          <Pressable
            key={name}
            accessibilityLabel={name}
            onPress={() => onChange(name)}
            style={[
              styles.colorSwatch,
              { backgroundColor: color },
              value === name && styles.colorSwatchActive,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

function QuantityControl({ quantity, onChange }) {
  return (
    <View style={styles.quantityRow}>
      <Text style={styles.quantityLabel}>Quantity</Text>
      <View style={styles.detailQuantityControl}>
        <Pressable
          accessibilityLabel="Decrease quantity"
          onPress={() => onChange(Math.max(1, quantity - 1))}
          style={styles.detailQuantityButton}
        >
          <Icon name="remove" size={16} />
        </Pressable>
        <Text style={styles.detailQuantityValue}>{quantity}</Text>
        <Pressable
          accessibilityLabel="Increase quantity"
          onPress={() => onChange(quantity + 1)}
          style={[styles.detailQuantityButton, styles.detailQuantityAdd]}
        >
          <Icon name="add" size={16} color="#fff" />
        </Pressable>
      </View>
    </View>
  );
}

function ProductBenefits() {
  return (
    <>
      <View style={styles.benefitPanel}>
        <View style={styles.benefitPrimary}>
          <Icon name="car-outline" size={19} color="#10B981" />
          <Text style={styles.benefitTitle}>Free Shipping</Text>
          <Text style={styles.benefitCopy}>Est. delivery 2–4 days</Text>
        </View>
        <View style={styles.benefitSecondary}>
          <Text>Buyer Protection</Text>
          <Text>Free Returns</Text>
        </View>
      </View>
      <Pressable style={styles.couponRow}>
        <Icon name="ticket-outline" size={20} color="#10B981" />
        <Text style={styles.couponText}>Save an extra 25% with a coupon</Text>
        <Text style={styles.couponClaim}>Claim</Text>
      </Pressable>
    </>
  );
}

function ProductTabs({ activeTab, onChange, product }) {
  return (
    <>
      <View style={styles.detailTabs}>
        {TABS.map(([id, label]) => (
          <Pressable key={id} onPress={() => onChange(id)} style={styles.detailTab}>
            <Text style={[styles.detailTabText, activeTab === id && styles.detailTabTextActive]}>
              {label}
            </Text>
            {activeTab === id ? <View style={styles.detailTabIndicator} /> : null}
          </Pressable>
        ))}
      </View>
      <TabContent activeTab={activeTab} product={product} />
    </>
  );
}

function TabContent({ activeTab, product }) {
  if (activeTab === 'description')
    return <Text style={styles.detailDescription}>{product.description}</Text>;
  if (activeTab === 'specs')
    return (
      <View style={styles.detailSpecs}>
        <Text style={styles.specKey}>Condition</Text>
        <Text style={styles.specValue}>New</Text>
        <Text style={styles.specKey}>Ships from</Text>
        <Text style={styles.specValue}>{product.location}</Text>
      </View>
    );
  return (
    <View style={styles.detailReview}>
      <Rating value={product.rating} />
      <Text style={styles.detailDescription}>Great quality and exactly as pictured.</Text>
    </View>
  );
}

import {
  Animated,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useEffect, useRef } from 'react';
import { money } from '../data/mockData';
import { Icon } from './Icon';

export const colors = {
  primary: '#10B981',
  secondary: '#14B8A6',
  accent: '#3B82F6',
  background: '#F8FAFC',
  surface: '#FFFFFF',
  text: '#111827',
  muted: '#6B7280',
  line: '#E5E7EB',
  soft: '#ECFDF5',
  danger: '#EF4444',
};

const sans = Platform.select({
  ios: 'System',
  android: 'sans-serif',
  web: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
});

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function usePressScale() {
  const scale = useRef(new Animated.Value(1)).current;
  const animate = (value) =>
    Animated.spring(scale, {
      toValue: value,
      useNativeDriver: true,
      speed: 30,
      bounciness: 3,
    }).start();
  return {
    animationStyle: { transform: [{ scale }] },
    handlers: { onPressIn: () => animate(0.97), onPressOut: () => animate(1) },
  };
}

export function Button({ label, onPress, variant = 'primary', small, disabled }) {
  const pressAnimation = usePressScale();
  const buttonClass = [
    'min-h-12 items-center justify-center rounded-2xl px-[18px]',
    variant === 'primary' && 'bg-brand',
    variant === 'secondary' && 'bg-accent',
    variant === 'outline' && 'border border-brand bg-white',
    small && 'min-h-9 px-3',
    disabled && 'opacity-55',
  ]
    .filter(Boolean)
    .join(' ');
  return (
    <AnimatedPressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      className={buttonClass}
      style={pressAnimation.animationStyle}
      {...pressAnimation.handlers}
    >
      <Text
        className={`text-[15px] font-bold ${variant === 'outline' ? 'text-brand' : 'text-white'}`}
      >
        {label}
      </Text>
    </AnimatedPressable>
  );
}

export function IconButton({ icon, onPress, badge, accessibilityLabel }) {
  const pressAnimation = usePressScale();
  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      className="relative h-[42px] w-[42px] items-center justify-center rounded-full bg-white"
      style={pressAnimation.animationStyle}
      {...pressAnimation.handlers}
    >
      <Icon name={icon} size={21} color={colors.text} />
      {badge ? (
        <View className="absolute right-0.5 top-0.5 h-4 min-w-4 items-center justify-center rounded-full bg-red-500">
          <Text className="text-[9px] font-extrabold text-white">{badge}</Text>
        </View>
      ) : null}
    </AnimatedPressable>
  );
}

export function SearchBar({ onPress, value = '' }) {
  return (
    <Pressable
      accessibilityRole="search"
      onPress={onPress}
      className="h-[46px] flex-1 flex-row items-center gap-2 rounded-[14px] bg-gray-100 px-3.5"
    >
      <Icon name="search-outline" size={21} color={colors.muted} />
      <Text className={`text-sm ${value ? 'text-ink' : 'text-gray-400'}`}>
        {value || 'Search products, brands, or stores'}
      </Text>
    </Pressable>
  );
}

export function Chip({ label, active, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      className={`mr-2 rounded-full px-3.5 py-[9px] ${active ? 'bg-emerald-100' : 'bg-gray-100'}`}
    >
      <Text
        className={`text-[13px] font-semibold ${active ? 'text-emerald-700' : 'text-gray-500'}`}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export function Rating({ value }) {
  return (
    <View style={styles.ratingRow}>
      <Icon name="star" size={12} color="#D97706" />
      <Text style={styles.rating}>{value}</Text>
    </View>
  );
}

export function QuantitySelector({ quantity, onChange }) {
  return (
    <View className="flex-row items-center gap-3 rounded-[10px] bg-gray-100 p-1">
      <Pressable
        accessibilityLabel="Decrease quantity"
        onPress={() => onChange(quantity - 1)}
        className="h-7 w-7 items-center justify-center rounded-lg bg-white"
      >
        <Icon name="remove" size={16} />
      </Pressable>
      <Text className="min-w-4 text-center font-bold text-ink">{quantity}</Text>
      <Pressable
        accessibilityLabel="Increase quantity"
        onPress={() => onChange(quantity + 1)}
        className="h-7 w-7 items-center justify-center rounded-lg bg-white"
      >
        <Icon name="add" size={16} />
      </Pressable>
    </View>
  );
}

export function ProductCard({ product, onPress, wishlisted, onWishlist, style, imageStyle }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      className="mb-2.5 overflow-hidden rounded-2xl bg-white p-[9px] shadow-sm"
      style={style}
    >
      <View>
        <Image
          source={{ uri: product.image }}
          className="h-[146px] w-full rounded-[11px] bg-slate-200"
          style={imageStyle}
        />
        <View className="absolute left-[7px] top-[7px] rounded-md bg-red-50 px-1.5 py-[3px]">
          <Text className="text-[10px] font-extrabold text-red-600">-{product.discount}%</Text>
        </View>
        <FavoriteButton active={wishlisted} onPress={onWishlist} />
      </View>
      <Text numberOfLines={2} className="mt-2 text-[13px] font-semibold leading-[18px] text-ink">
        {product.name}
      </Text>
      <Text className="mt-[5px] text-[15px] font-extrabold text-ink">{money(product.price)}</Text>
      <View className="mt-[5px] flex-row">
        <Rating value={product.rating} />
        <Text className="text-[11px] text-gray-500"> {product.sold}</Text>
      </View>
      <Text className="mt-1 text-[11px] text-gray-500">{product.location}</Text>
    </Pressable>
  );
}

function FavoriteButton({ active, onPress }) {
  const scale = useRef(new Animated.Value(1)).current;
  const handlePress = (event) => {
    event.stopPropagation();
    Animated.sequence([
      Animated.spring(scale, { toValue: 1.28, useNativeDriver: true, speed: 30, bounciness: 8 }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 24, bounciness: 5 }),
    ]).start();
    onPress?.();
  };
  return (
    <Pressable accessibilityLabel="Simpan ke favorit" onPress={handlePress} style={styles.heart}>
      <Animated.View style={{ transform: [{ scale }] }}>
        <Icon
          name={active ? 'heart' : 'heart-outline'}
          size={17}
          color={active ? colors.danger : colors.text}
        />
      </Animated.View>
    </Pressable>
  );
}

export function SectionTitle({ title, action, onAction }) {
  return (
    <View style={styles.sectionTitle}>
      <Text style={styles.sectionHeading}>{title}</Text>
      {action ? (
        <Pressable onPress={onAction}>
          <Text style={styles.action}>{action}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export function Input({ label, ...props }) {
  return (
    <View className="gap-[7px]">
      <Text className="text-[13px] font-bold text-ink">{label}</Text>
      <TextInput
        placeholderTextColor="#9CA3AF"
        className="h-[50px] rounded-[14px] border border-gray-200 bg-white px-3.5 text-[15px] text-ink"
        {...props}
      />
    </View>
  );
}

export function EmptyState({ icon = 'information-circle-outline', title, body, action, onAction }) {
  return (
    <View className="flex-1 items-center justify-center gap-2 p-8">
      <Icon name={icon} size={48} color={colors.primary} />
      <Text className="text-center text-[19px] font-extrabold text-ink">{title}</Text>
      <Text className="mb-3 text-center leading-5 text-gray-500">{body}</Text>
      {action ? <Button label={action} onPress={onAction} /> : null}
    </View>
  );
}

export function Badge({ label, tone = 'success' }) {
  const isInfo = tone === 'info';
  const isNeutral = tone === 'neutral';
  const backgroundClass = isInfo ? 'bg-blue-100' : isNeutral ? 'bg-slate-100' : 'bg-green-100';
  const textClass = isInfo ? 'text-blue-700' : isNeutral ? 'text-slate-600' : 'text-emerald-700';
  return (
    <View className={`self-start rounded-lg px-2 py-1 ${backgroundClass}`}>
      <Text className={`text-[11px] font-extrabold ${textClass}`}>{label}</Text>
    </View>
  );
}

export function Tabs({ tabs, active, onChange }) {
  return (
    <View className="flex-row gap-1 rounded-xl bg-slate-100 p-1">
      {tabs.map((tab) => (
        <Pressable
          key={tab}
          accessibilityRole="tab"
          accessibilityState={{ selected: active === tab }}
          onPress={() => onChange?.(tab)}
          className={`min-h-9 flex-1 items-center justify-center rounded-[9px] px-3 ${active === tab ? 'bg-white' : ''}`}
        >
          <Text className={`text-xs font-bold ${active === tab ? 'text-ink' : 'text-gray-500'}`}>
            {tab}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

export function Skeleton({ width = '100%', height = 16, style }) {
  return <View accessibilityLabel="Memuat" style={[styles.skeleton, { width, height }, style]} />;
}

export function Toast({ message, visible }) {
  const translateY = useRef(new Animated.Value(24)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!visible) return;
    translateY.setValue(24);
    opacity.setValue(0);
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: true }),
      Animated.spring(translateY, { toValue: 0, useNativeDriver: true, speed: 20, bounciness: 4 }),
    ]).start();
  }, [opacity, translateY, visible]);
  if (!visible) return null;
  return (
    <Animated.View
      accessibilityLiveRegion="polite"
      style={[styles.toast, { opacity, transform: [{ translateY }] }]}
    >
      <Icon name="checkmark-circle" size={18} color="#6EE7B7" />
      <Text style={styles.toastText}>{message}</Text>
    </Animated.View>
  );
}

export function BottomSheet({ title, children, visible, onClose }) {
  if (!visible) return null;
  return (
    <View style={styles.sheetBackdrop}>
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      <View accessibilityViewIsModal style={styles.sheet}>
        <View style={styles.sheetHandle} />
        <Text style={styles.sheetTitle}>{title}</Text>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  primary: { backgroundColor: colors.primary },
  secondary: { backgroundColor: colors.accent },
  outline: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.primary },
  buttonText: { fontFamily: sans, color: '#fff', fontWeight: '700', fontSize: 15 },
  outlineText: { color: colors.primary },
  buttonSmall: { minHeight: 36, paddingHorizontal: 12 },
  disabled: { opacity: 0.55 },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    position: 'relative',
  },
  icon: { fontSize: 21, color: colors.text },
  badge: {
    position: 'absolute',
    right: 2,
    top: 1,
    backgroundColor: colors.danger,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { color: '#fff', fontSize: 9, fontWeight: '800' },
  search: {
    flex: 1,
    height: 46,
    backgroundColor: '#F3F4F6',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 9,
  },
  searchIcon: { fontSize: 24, color: colors.muted },
  searchText: { fontFamily: sans, color: '#9CA3AF', fontSize: 14 },
  searchTextFilled: { color: colors.text },
  chip: {
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
  },
  chipActive: { backgroundColor: '#D1FAE5' },
  chipText: { fontFamily: sans, color: colors.muted, fontWeight: '600', fontSize: 13 },
  chipTextActive: { color: '#047857' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    padding: 9,
    marginBottom: 10,
    shadowColor: '#111827',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  productImage: { width: '100%', height: 146, borderRadius: 11, backgroundColor: '#E5E7EB' },
  discount: {
    position: 'absolute',
    left: 7,
    top: 7,
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  discountText: { fontFamily: sans, color: '#DC2626', fontSize: 10, fontWeight: '800' },
  heart: {
    position: 'absolute',
    right: 7,
    top: 7,
    backgroundColor: '#fff',
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productName: {
    fontFamily: sans,
    color: colors.text,
    fontWeight: '600',
    fontSize: 13,
    lineHeight: 18,
    marginTop: 9,
  },
  price: { fontFamily: sans, color: colors.text, fontSize: 15, fontWeight: '800', marginTop: 5 },
  productMeta: { flexDirection: 'row', marginTop: 5 },
  rating: { fontFamily: sans, color: '#D97706', fontWeight: '700', fontSize: 11 },
  muted: { fontFamily: sans, color: colors.muted, fontSize: 11 },
  store: { fontFamily: sans, color: colors.muted, fontSize: 11, marginTop: 4 },
  sectionTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionHeading: { fontFamily: sans, color: colors.text, fontSize: 19, fontWeight: '800' },
  action: { fontFamily: sans, color: colors.primary, fontSize: 13, fontWeight: '700' },
  inputGroup: { gap: 7 },
  inputLabel: { color: colors.text, fontWeight: '700', fontSize: 13 },
  input: {
    height: 50,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 14,
    paddingHorizontal: 14,
    color: colors.text,
    fontSize: 15,
  },
  quantity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    padding: 4,
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: { fontWeight: '700', minWidth: 16, textAlign: 'center' },
  empty: { flex: 1, padding: 32, alignItems: 'center', justifyContent: 'center', gap: 10 },
  emptyIcon: { fontSize: 48, color: colors.primary },
  emptyTitle: { fontSize: 19, fontWeight: '800', color: colors.text, textAlign: 'center' },
  emptyBody: { color: colors.muted, textAlign: 'center', lineHeight: 20, marginBottom: 12 },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeSuccess: { backgroundColor: '#DCFCE7' },
  badgeInfo: { backgroundColor: '#DBEAFE' },
  badgeNeutral: { backgroundColor: '#F1F5F9' },
  statusBadgeText: { color: '#047857', fontSize: 11, fontWeight: '800' },
  statusBadgeNeutral: { color: '#475569' },
  tabs: { flexDirection: 'row', backgroundColor: '#F1F5F9', borderRadius: 12, padding: 4, gap: 4 },
  tab: {
    minHeight: 36,
    flex: 1,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9,
  },
  tabActive: {
    backgroundColor: '#fff',
    shadowColor: '#111827',
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 1,
  },
  tabText: { color: colors.muted, fontSize: 12, fontWeight: '700' },
  tabTextActive: { color: colors.text },
  skeleton: { borderRadius: 8, backgroundColor: '#E2E8F0' },
  toast: {
    position: 'absolute',
    zIndex: 50,
    bottom: 28,
    alignSelf: 'center',
    maxWidth: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: '#111827',
    shadowColor: '#111827',
    shadowOpacity: 0.2,
    shadowRadius: 14,
    elevation: 6,
  },
  toastIcon: { color: '#6EE7B7', fontWeight: '900' },
  toastText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  sheetBackdrop: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 40,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(15, 23, 42, .36)',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 32,
    minHeight: 180,
  },
  sheetHandle: {
    width: 38,
    height: 4,
    borderRadius: 3,
    backgroundColor: '#CBD5E1',
    alignSelf: 'center',
    marginBottom: 16,
  },
  sheetTitle: { color: colors.text, fontWeight: '800', fontSize: 18, marginBottom: 16 },
});

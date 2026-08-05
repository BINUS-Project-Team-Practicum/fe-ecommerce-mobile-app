import {
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { money } from '../data/mockData';
import { Icon } from './Icon';

export const colors = {
  primary: '#10B981', secondary: '#14B8A6', accent: '#3B82F6',
  background: '#F8FAFC', surface: '#FFFFFF', text: '#111827',
  muted: '#6B7280', line: '#E5E7EB', soft: '#ECFDF5', danger: '#EF4444',
};

const sans = Platform.select({
  ios: 'System', android: 'sans-serif',
  web: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
});

export function Button({ label, onPress, variant = 'primary', small, disabled }) {
  return <Pressable accessibilityRole="button" disabled={disabled} onPress={onPress} style={[styles.button, styles[variant], small && styles.buttonSmall, disabled && styles.disabled]}>
    <Text style={[styles.buttonText, variant === 'outline' && styles.outlineText]}>{label}</Text>
  </Pressable>;
}

export function IconButton({ icon, onPress, badge }) {
  return <Pressable accessibilityRole="button" onPress={onPress} style={styles.iconButton}>
    <Icon name={icon} size={21} color={colors.text} />
    {badge ? <View style={styles.badge}><Text style={styles.badgeText}>{badge}</Text></View> : null}
  </Pressable>;
}

export function SearchBar({ onPress, value = '' }) {
  return <Pressable accessibilityRole="search" onPress={onPress} style={styles.search}>
    <Icon name="search-outline" size={21} color={colors.muted} />
    <Text style={[styles.searchText, value && styles.searchTextFilled]}>{value || 'Cari produk, merek, atau toko'}</Text>
  </Pressable>;
}

export function Chip({ label, active, onPress }) {
  return <Pressable onPress={onPress} style={[styles.chip, active && styles.chipActive]}>
    <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
  </Pressable>;
}

export function Rating({ value }) { return <View style={styles.ratingRow}><Icon name="star" size={12} color="#D97706" /><Text style={styles.rating}>{value}</Text></View>; }

export function QuantitySelector({ quantity, onChange }) {
  return <View style={styles.quantity}>
    <Pressable accessibilityLabel="Kurangi jumlah" onPress={() => onChange(quantity - 1)} style={styles.quantityButton}><Icon name="remove" size={16} /></Pressable>
    <Text style={styles.quantityText}>{quantity}</Text>
    <Pressable accessibilityLabel="Tambah jumlah" onPress={() => onChange(quantity + 1)} style={styles.quantityButton}><Icon name="add" size={16} /></Pressable>
  </View>;
}

export function ProductCard({ product, onPress, wishlisted, onWishlist, style, imageStyle }) {
  return <Pressable accessibilityRole="button" onPress={onPress} style={[styles.card, style]}>
    <View>
      <Image source={{ uri: product.image }} style={[styles.productImage, imageStyle]} />
      <View style={styles.discount}><Text style={styles.discountText}>-{product.discount}%</Text></View>
      <Pressable accessibilityLabel="Simpan ke favorit" onPress={(event) => { event.stopPropagation(); onWishlist?.(); }} style={styles.heart}>
        <Icon name={wishlisted ? 'heart' : 'heart-outline'} size={17} color={wishlisted ? colors.danger : colors.text} />
      </Pressable>
    </View>
    <Text numberOfLines={2} style={styles.productName}>{product.name}</Text>
    <Text style={styles.price}>{money(product.price)}</Text>
    <View style={styles.productMeta}><Rating value={product.rating} /><Text style={styles.muted}> {product.sold}</Text></View>
    <Text style={styles.store}>{product.location}</Text>
  </Pressable>;
}

export function SectionTitle({ title, action, onAction }) {
  return <View style={styles.sectionTitle}>
    <Text style={styles.sectionHeading}>{title}</Text>
    {action ? <Pressable onPress={onAction}><Text style={styles.action}>{action}</Text></Pressable> : null}
  </View>;
}

export function Input({ label, ...props }) {
  return <View style={styles.inputGroup}>
    <Text style={styles.inputLabel}>{label}</Text>
    <TextInput placeholderTextColor="#9CA3AF" style={styles.input} {...props} />
  </View>;
}

export function EmptyState({ icon = 'information-circle-outline', title, body, action, onAction }) {
  return <View style={styles.empty}>
    <Icon name={icon} size={48} color={colors.primary} /><Text style={styles.emptyTitle}>{title}</Text><Text style={styles.emptyBody}>{body}</Text>
    {action ? <Button label={action} onPress={onAction} /> : null}
  </View>;
}

export function Badge({ label, tone = 'success' }) {
  const toneName = `badge${tone[0].toUpperCase()}${tone.slice(1)}`;
  return <View style={[styles.statusBadge, styles[toneName]]}><Text style={[styles.statusBadgeText, tone === 'neutral' && styles.statusBadgeNeutral]}>{label}</Text></View>;
}

export function Tabs({ tabs, active, onChange }) {
  return <View style={styles.tabs}>{tabs.map((tab) => <Pressable key={tab} accessibilityRole="tab" accessibilityState={{ selected: active === tab }} onPress={() => onChange?.(tab)} style={[styles.tab, active === tab && styles.tabActive]}><Text style={[styles.tabText, active === tab && styles.tabTextActive]}>{tab}</Text></Pressable>)}</View>;
}

export function Skeleton({ width = '100%', height = 16, style }) { return <View accessibilityLabel="Memuat" style={[styles.skeleton, { width, height }, style]} />; }

export function Toast({ message, visible }) { return visible ? <View accessibilityLiveRegion="polite" style={styles.toast}><Icon name="checkmark-circle" size={18} color="#6EE7B7" /><Text style={styles.toastText}>{message}</Text></View> : null; }

export function BottomSheet({ title, children, visible, onClose }) {
  if (!visible) return null;
  return <View style={styles.sheetBackdrop}>
    <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
    <View accessibilityViewIsModal style={styles.sheet}><View style={styles.sheetHandle} /><Text style={styles.sheetTitle}>{title}</Text>{children}</View>
  </View>;
}

const styles = StyleSheet.create({
  button: { minHeight: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 18 }, primary: { backgroundColor: colors.primary }, secondary: { backgroundColor: colors.accent }, outline: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.primary }, buttonText: { fontFamily: sans, color: '#fff', fontWeight: '700', fontSize: 15 }, outlineText: { color: colors.primary }, buttonSmall: { minHeight: 36, paddingHorizontal: 12 }, disabled: { opacity: .55 },
  iconButton: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', position: 'relative' }, icon: { fontSize: 21, color: colors.text }, badge: { position: 'absolute', right: 2, top: 1, backgroundColor: colors.danger, minWidth: 16, height: 16, borderRadius: 8, alignItems: 'center', justifyContent: 'center' }, badgeText: { color: '#fff', fontSize: 9, fontWeight: '800' },
  search: { flex: 1, height: 46, backgroundColor: '#F3F4F6', borderRadius: 14, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, gap: 9 }, searchIcon: { fontSize: 24, color: colors.muted }, searchText: { fontFamily: sans, color: '#9CA3AF', fontSize: 14 }, searchTextFilled: { color: colors.text },
  chip: { paddingVertical: 9, paddingHorizontal: 14, borderRadius: 20, backgroundColor: '#F3F4F6', marginRight: 8 }, chipActive: { backgroundColor: '#D1FAE5' }, chipText: { fontFamily: sans, color: colors.muted, fontWeight: '600', fontSize: 13 }, chipTextActive: { color: '#047857' }, ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  card: { backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden', padding: 9, marginBottom: 10, shadowColor: '#111827', shadowOpacity: .06, shadowRadius: 12, elevation: 2 }, productImage: { width: '100%', height: 146, borderRadius: 11, backgroundColor: '#E5E7EB' }, discount: { position: 'absolute', left: 7, top: 7, backgroundColor: '#FEF2F2', paddingHorizontal: 6, paddingVertical: 3, borderRadius: 6 }, discountText: { fontFamily: sans, color: '#DC2626', fontSize: 10, fontWeight: '800' }, heart: { position: 'absolute', right: 7, top: 7, backgroundColor: '#fff', width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' }, productName: { fontFamily: sans, color: colors.text, fontWeight: '600', fontSize: 13, lineHeight: 18, marginTop: 9 }, price: { fontFamily: sans, color: colors.text, fontSize: 15, fontWeight: '800', marginTop: 5 }, productMeta: { flexDirection: 'row', marginTop: 5 }, rating: { fontFamily: sans, color: '#D97706', fontWeight: '700', fontSize: 11 }, muted: { fontFamily: sans, color: colors.muted, fontSize: 11 }, store: { fontFamily: sans, color: colors.muted, fontSize: 11, marginTop: 4 },
  sectionTitle: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }, sectionHeading: { fontFamily: sans, color: colors.text, fontSize: 19, fontWeight: '800' }, action: { fontFamily: sans, color: colors.primary, fontSize: 13, fontWeight: '700' }, inputGroup: { gap: 7 }, inputLabel: { color: colors.text, fontWeight: '700', fontSize: 13 }, input: { height: 50, backgroundColor: '#fff', borderWidth: 1, borderColor: colors.line, borderRadius: 14, paddingHorizontal: 14, color: colors.text, fontSize: 15 },
  quantity: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#F3F4F6', borderRadius: 10, padding: 4 }, quantityButton: { width: 28, height: 28, borderRadius: 8, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }, quantityText: { fontWeight: '700', minWidth: 16, textAlign: 'center' }, empty: { flex: 1, padding: 32, alignItems: 'center', justifyContent: 'center', gap: 10 }, emptyIcon: { fontSize: 48, color: colors.primary }, emptyTitle: { fontSize: 19, fontWeight: '800', color: colors.text, textAlign: 'center' }, emptyBody: { color: colors.muted, textAlign: 'center', lineHeight: 20, marginBottom: 12 },
  statusBadge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 }, badgeSuccess: { backgroundColor: '#DCFCE7' }, badgeInfo: { backgroundColor: '#DBEAFE' }, badgeNeutral: { backgroundColor: '#F1F5F9' }, statusBadgeText: { color: '#047857', fontSize: 11, fontWeight: '800' }, statusBadgeNeutral: { color: '#475569' }, tabs: { flexDirection: 'row', backgroundColor: '#F1F5F9', borderRadius: 12, padding: 4, gap: 4 }, tab: { minHeight: 36, flex: 1, paddingHorizontal: 12, alignItems: 'center', justifyContent: 'center', borderRadius: 9 }, tabActive: { backgroundColor: '#fff', shadowColor: '#111827', shadowOpacity: .08, shadowRadius: 5, elevation: 1 }, tabText: { color: colors.muted, fontSize: 12, fontWeight: '700' }, tabTextActive: { color: colors.text }, skeleton: { borderRadius: 8, backgroundColor: '#E2E8F0' }, toast: { position: 'absolute', zIndex: 50, bottom: 28, alignSelf: 'center', maxWidth: '90%', flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 12, paddingHorizontal: 16, borderRadius: 14, backgroundColor: '#111827', shadowColor: '#111827', shadowOpacity: .2, shadowRadius: 14, elevation: 6 }, toastIcon: { color: '#6EE7B7', fontWeight: '900' }, toastText: { color: '#fff', fontWeight: '700', fontSize: 13 }, sheetBackdrop: { ...StyleSheet.absoluteFillObject, zIndex: 40, justifyContent: 'flex-end', backgroundColor: 'rgba(15, 23, 42, .36)' }, sheet: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingBottom: 32, minHeight: 180 }, sheetHandle: { width: 38, height: 4, borderRadius: 3, backgroundColor: '#CBD5E1', alignSelf: 'center', marginBottom: 16 }, sheetTitle: { color: colors.text, fontWeight: '800', fontSize: 18, marginBottom: 16 },
});

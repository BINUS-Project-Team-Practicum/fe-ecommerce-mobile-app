import { useState } from 'react';
import { Alert, Pressable, ScrollView, Switch, Text, TextInput, View } from 'react-native';
import { EmptyState, Button, SectionTitle } from '../../components/ui';
import { Icon } from '../../components/Icon';
import { Header, MenuGroup, ProductGrid } from '../shared/MarketplaceComponents';
import { styles } from './accountStyles';

const pageTitles = {
  categories: 'Kategori',
  wishlist: 'Wishlist',
  notifications: 'Notifikasi',
  profile: 'Akun Saya',
  orders: 'Pesanan Saya',
  coupons: 'Kupon Saya',
  wallet: 'Dompet',
  settings: 'Pengaturan',
  chat: 'Pesan',
  store: 'Toko',
  tracking: 'Lacak Pesanan',
  payment: 'Pembayaran',
};

export function AccountUtilityScreen({
  page,
  user,
  products,
  orders,
  wishlist,
  onToggleWishlist,
  onCompleteOrder,
  goBack,
  navigate,
  onLogin,
  onLogout,
  onCreateProduct,
  onUpdateProduct,
  onDeleteProduct,
  onUpdateProductStock,
}) {
  if (page === 'wishlist') {
    const list = products.filter((p) => wishlist.includes(p.id));
    return (
      <View style={styles.page}>
        <Header title="Wishlist" />
        {list.length ? (
          <ScrollView contentContainerStyle={styles.scroll}>
            <ProductGrid
              products={list}
              wishlist={wishlist}
              onWishlist={onToggleWishlist}
              onPress={(p) => navigate('detail', p)}
            />
          </ScrollView>
        ) : (
          <EmptyState
            icon="heart-outline"
            title="Belum ada favorit"
            body="Simpan produk yang kamu suka agar mudah ditemukan kembali."
            action="Jelajahi produk"
            onAction={() => navigate('home')}
          />
        )}
      </View>
    );
  }
  if (page === 'profile')
    return (
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.profileHero}>
          <View style={styles.avatar}>
            <Text>{user?.name?.[0]?.toUpperCase() || 'G'}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.profileName}>{user?.name || 'Guest shopper'}</Text>
            <Text style={styles.profileEmail}>
              {user?.email || 'Masuk untuk menikmati semua fitur'}
            </Text>
          </View>
          <Pressable
            onPress={() => {
              if (!user) return onLogin?.();
              Alert.alert(
                'Keluar dari akun?',
                'Anda perlu login kembali untuk mengakses akun ini.',
                [
                  { text: 'Batal', style: 'cancel' },
                  { text: 'Keluar', style: 'destructive', onPress: onLogout },
                ],
              );
            }}
          >
            <Text style={styles.action}>{user ? 'Keluar' : 'Masuk'}</Text>
          </Pressable>
        </View>
        <MenuGroup
          title="Aktivitas saya"
          entries={[
            { id: 'orders', icon: 'receipt-outline', label: 'Pesanan Saya' },
            { id: 'coupons', icon: 'ticket-outline', label: 'Kupon Saya' },
            { id: 'wallet', icon: 'wallet-outline', label: 'Binus Wallet' },
          ]}
          navigate={navigate}
        />
        <MenuGroup
          title="Akun & bantuan"
          entries={[
            { id: 'chat', icon: 'chatbubble-outline', label: 'Pesan' },
            { id: 'settings', icon: 'settings-outline', label: 'Pengaturan' },
          ]}
          navigate={navigate}
        />
      </ScrollView>
    );
  if (page === 'notifications')
    return (
      <View style={styles.page}>
        <Header title="Notifikasi" onBack={goBack} />
        {['Voucher spesial untukmu', 'Pesanan telah dikirim', 'Flash sale dimulai sekarang'].map(
          (x, i) => (
            <View key={x} style={styles.notification}>
              <View style={styles.notificationIcon}>
                <Icon
                  name={i === 1 ? 'car-outline' : i === 2 ? 'flash-outline' : 'ticket-outline'}
                  size={19}
                  color="#10B981"
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.notificationTitle}>{x}</Text>
                <Text style={styles.notificationBody}>
                  {i === 0
                    ? 'Hemat hingga Rp50.000 untuk pilihan produk favoritmu.'
                    : 'Ada kabar terbaru yang perlu kamu lihat.'}
                </Text>
                <Text style={styles.storeInfo}>{i + 1} jam lalu</Text>
              </View>
            </View>
          ),
        )}
      </View>
    );
  if (page === 'tracking')
    return (
      <ScrollView contentContainerStyle={styles.scroll}>
        <Header title="Lacak Pesanan" onBack={goBack} />
        <View style={styles.trackingCard}>
          <View className="flex-row items-center gap-3">
            <View className="h-11 w-11 items-center justify-center rounded-2xl bg-emerald-600">
              <Icon name="car-outline" size={24} color="#FFFFFF" />
            </View>
            <View className="flex-1">
              <Text style={styles.label}>Pesanan {orders?.[0]?.id || '#MRA-240821'}</Text>
              <Text style={styles.trackingStatus}>Dalam perjalanan</Text>
            </View>
          </View>
          <Text style={styles.description}>Paket sedang diantar menuju alamat Anda.</Text>
        </View>
        {[
          ['checkmark-circle-outline', 'Pesanan dikonfirmasi'],
          ['cube-outline', 'Paket diserahkan ke kurir'],
          ['car-outline', 'Dalam perjalanan'],
        ].map(([icon, x], i) => (
          <View key={x} style={styles.track}>
            <View style={[styles.trackDot, i === 2 && styles.trackDotActive]}>
              <Icon name={icon} size={13} color={i === 2 ? '#FFFFFF' : '#6B7280'} />
            </View>
            <View>
              <Text style={styles.infoTitle}>{x}</Text>
              <Text style={styles.storeInfo}>{i === 2 ? 'Hari ini, 09:42' : 'Kemarin, 16:20'}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    );
  if (page === 'payment')
    return (
      <ScrollView contentContainerStyle={styles.scroll}>
        <Header title="Pilih Pembayaran" onBack={goBack} />
        {[
          'Binus Wallet  ·  Saldo Rp250.000',
          'Virtual Account BCA',
          'Kartu Kredit / Debit',
          'Bayar di tempat (COD)',
        ].map((x, i) => (
          <Pressable
            key={x}
            onPress={async () => {
              try {
                const completed = await onCompleteOrder?.();
                if (completed) navigate('success');
              } catch (error) {
                Alert.alert('Pesanan belum diproses', error.message || 'Stok produk tidak dapat diperbarui.');
              }
            }}
            style={styles.payment}
          >
            <Icon
              name={['wallet-outline', 'business-outline', 'card-outline', 'cash-outline'][i]}
              size={22}
              color="#10B981"
            />
            <Text style={styles.infoTitle}>{x}</Text>
            <Icon name="chevron-forward" size={18} color="#6B7280" />
          </Pressable>
        ))}
      </ScrollView>
    );
  const title = pageTitles[page] || 'binus.';
  return (
    <View style={styles.page}>
      <Header title={title} onBack={goBack} />
      {page === 'orders' ? (
        orders?.length ? (
          <OrderHistory orders={orders} navigate={navigate} />
        ) : (
          <EmptyState
            icon="receipt-outline"
            title="Belum ada pesanan"
            body="Pesananmu akan muncul di sini."
            action="Belanja sekarang"
            onAction={() => navigate('home')}
          />
        )
      ) : page === 'chat' ? (
        <EmptyState
          icon="chatbubble-outline"
          title="Belum ada percakapan"
          body="Mulai chat dengan penjual dari halaman produk."
        />
      ) : page === 'store' ? (
        <Store products={products} navigate={navigate} />
      ) : page === 'manageProducts' ? (
        <ProductManager
          products={products}
          goBack={goBack}
          onCreateProduct={onCreateProduct}
          onUpdateProduct={onUpdateProduct}
          onDeleteProduct={onDeleteProduct}
          onUpdateProductStock={onUpdateProductStock}
        />
      ) : page === 'settings' ? (
        <SettingsScreen navigate={navigate} />
      ) : (
        <EmptyState
          icon={
            page === 'coupons'
              ? 'ticket-outline'
              : page === 'wallet'
                ? 'wallet-outline'
                : 'settings-outline'
          }
          title={
            page === 'coupons'
              ? 'Belum ada kupon'
              : page === 'wallet'
                ? 'Binus Wallet'
                : 'Pengaturan akun'
          }
          body={
            page === 'wallet'
              ? 'Saldo Anda Rp0. Aktifkan wallet untuk pembayaran lebih cepat.'
              : 'Halaman ini siap dihubungkan dengan data akun Anda.'
          }
          action={page === 'wallet' ? 'Aktifkan wallet' : undefined}
        />
      )}
    </View>
  );
}

function OrderHistory({ orders, navigate }) {
  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      {orders.map((order) => (
        <Pressable key={order.id} onPress={() => navigate('tracking')} style={styles.checkoutCard}>
          <View style={styles.summary}>
            <View className="flex-row items-center gap-2">
              <Icon name="receipt-outline" size={18} color="#10B981" />
              <Text style={styles.label}>{order.id}</Text>
            </View>
            <Text style={styles.action}>{order.status}</Text>
          </View>
          <Text style={styles.description}>
            {order.items.length} produk · Total {order.total.toLocaleString('id-ID')}
          </Text>
          <Text style={styles.action}>Lacak pesanan</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}
function Store({ products, navigate }) {
  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <View style={styles.storeHero}>
        <View style={styles.storeAvatar}>
          <Icon name="storefront-outline" size={24} color="#047857" />
        </View>
        <Text style={styles.profileName}>Aster Official Store</Text>
        <Text style={styles.storeInfo}>Rating 4.9 · 12,3 rb pengikut · Online</Text>
        <Button
          label="Ikuti"
          small
          variant="outline"
          onPress={() => Alert.alert('Berhasil', 'Toko telah diikuti.')}
        />
        <Button label="Kelola produk" small onPress={() => navigate('manageProducts')} />
      </View>
      <SectionTitle title="Produk toko" />
      <ProductGrid
        products={products.slice(0, 4)}
        wishlist={[]}
        onWishlist={() => {}}
        onPress={(p) => navigate('detail', p)}
      />
    </ScrollView>
  );
}

const EMPTY_PRODUCT = {
  name: '',
  storeName: 'Binus Official Store',
  description: '',
  price: '',
  category: '',
  stock: '',
  images: '',
};

function ProductManager({
  products,
  goBack,
  onCreateProduct,
  onUpdateProduct,
  onDeleteProduct,
  onUpdateProductStock,
}) {
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_PRODUCT);
  const [saving, setSaving] = useState(false);
  const edit = (product) => {
    setEditing(product);
    setForm({
      name: product.name,
      storeName: product.store,
      description: product.description,
      price: String(product.price),
      category: product.category,
      stock: String(product.stock),
      images: product.images?.join(', ') || product.image || '',
    });
  };
  const save = async () => {
    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      images: form.images.split(',').map((image) => image.trim()).filter(Boolean),
    };
    try {
      setSaving(true);
      if (editing) await onUpdateProduct(editing.id, payload);
      else await onCreateProduct(payload);
      setEditing(null);
      setForm(EMPTY_PRODUCT);
      Alert.alert('Berhasil', editing ? 'Produk diperbarui.' : 'Produk ditambahkan.');
    } catch (error) {
      Alert.alert('Gagal menyimpan', error.message || 'Periksa data produk.');
    } finally {
      setSaving(false);
    }
  };
  const remove = (product) =>
    Alert.alert('Hapus produk?', product.name, [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: () => onDeleteProduct(product.id).catch((error) => Alert.alert('Gagal', error.message)),
      },
    ]);

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <Header title="Kelola Produk" onBack={goBack} />
      <Text style={styles.description}>Alat pengelolaan katalog (development).</Text>
      {Object.entries(form).map(([key, value]) => (
        <TextInput
          key={key}
          value={value}
          onChangeText={(next) => setForm((current) => ({ ...current, [key]: next }))}
          placeholder={key === 'images' ? 'Image URL' : key}
          multiline={key === 'description'}
          style={[styles.payment, { paddingHorizontal: 14, color: '#111827' }]}
        />
      ))}
      <Button label={saving ? 'Menyimpan…' : editing ? 'Simpan perubahan' : 'Tambah produk'} onPress={save} disabled={saving} />
      <Button label="Batal edit" variant="outline" small onPress={() => { setEditing(null); setForm(EMPTY_PRODUCT); }} />
      <SectionTitle title="Produk backend" />
      {products.map((product) => (
        <View key={product.id} style={styles.checkoutCard}>
          <Text style={styles.infoTitle}>{product.name}</Text>
          <Text style={styles.storeInfo}>Stok: {product.stock}</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Button label="Ubah" small variant="outline" onPress={() => edit(product)} />
            <Button label="Stok +1" small variant="outline" onPress={() => onUpdateProductStock(product.id, Number(product.stock) + 1).catch((error) => Alert.alert('Gagal', error.message))} />
            <Button label="Hapus" small variant="outline" onPress={() => remove(product)} />
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const SETTINGS_GROUPS = [
  {
    title: 'ACCOUNT',
    rows: [
      ['person-outline', 'Personal Information'],
      ['lock-closed-outline', 'Security & Privacy'],
      ['phone-portrait-outline', 'Linked Devices'],
    ],
  },
  {
    title: 'SUPPORT',
    rows: [
      ['help-circle-outline', 'Help Center'],
      ['document-text-outline', 'Terms & Privacy'],
      ['flag-outline', 'Report a Problem'],
    ],
  },
];

function SettingsScreen() {
  const [preferences, setPreferences] = useState({ push: true, dark: false, biometric: true });
  const preferenceRows = [
    ['push', 'notifications-outline', 'Push Notifications'],
    ['dark', 'moon-outline', 'Dark Mode'],
    ['biometric', 'finger-print-outline', 'Biometric Login'],
  ];
  const togglePreference = (key) =>
    setPreferences((current) => ({ ...current, [key]: !current[key] }));

  return (
    <ScrollView contentContainerStyle={styles.settingsScroll}>
      <SettingsGroup
        title="PREFERENCES"
        rows={preferenceRows}
        values={preferences}
        onToggle={togglePreference}
      />
      {SETTINGS_GROUPS.map((group) => (
        <SettingsGroup key={group.title} {...group} />
      ))}
    </ScrollView>
  );
}

function SettingsGroup({ title, rows, values, onToggle }) {
  return (
    <View style={styles.settingsGroup}>
      <Text style={styles.settingsGroupTitle}>{title}</Text>
      <View style={styles.settingsCard}>
        {rows.map((row, index) => {
          const [keyOrIcon, iconOrLabel, optionalLabel] = row;
          const isToggle = Boolean(optionalLabel);
          const icon = isToggle ? iconOrLabel : keyOrIcon;
          const label = isToggle ? optionalLabel : iconOrLabel;
          return (
            <View key={label}>
              {index ? <View style={styles.settingsDivider} /> : null}
              <SettingsRow
                icon={icon}
                label={label}
                value={isToggle ? values[keyOrIcon] : undefined}
                onToggle={isToggle ? () => onToggle(keyOrIcon) : undefined}
              />
            </View>
          );
        })}
      </View>
    </View>
  );
}

function SettingsRow({ icon, label, value, onToggle }) {
  const content = (
    <>
      <View style={styles.settingsIconCircle}>
        <Icon name={icon} size={18} color="#10B981" />
      </View>
      <Text style={styles.settingsRowText}>{label}</Text>
      {onToggle ? (
        <Switch
          value={value}
          onValueChange={onToggle}
          trackColor={{ false: '#E5E7EB', true: '#10B981' }}
          thumbColor="#FFFFFF"
        />
      ) : (
        <Icon name="chevron-forward" size={18} color="#6B7280" />
      )}
    </>
  );
  return onToggle ? (
    <View style={styles.settingsRow}>{content}</View>
  ) : (
    <Pressable accessibilityRole="button" style={styles.settingsRow}>
      {content}
    </Pressable>
  );
}

import { useState } from "react";
import { Alert, Pressable, ScrollView, Switch, Text, View } from "react-native";
import { EmptyState, Button, SectionTitle, colors } from "../../components/ui";
import { ProductGrid } from "../shared/MarketplaceComponents";
import { styles } from "../shared/marketplaceStyles";

const pageTitles = {
  categories: "Kategori", wishlist: "Wishlist", notifications: "Notifikasi", profile: "Akun Saya", orders: "Pesanan Saya", coupons: "Kupon Saya", wallet: "Dompet", settings: "Pengaturan", chat: "Pesan", store: "Toko", tracking: "Lacak Pesanan", payment: "Pembayaran",
};

export function AccountUtilityScreen({
  page,
  user,
  products,
  wishlist,
  onToggleWishlist,
  navigate,
  onLogin,
}) {
  if (page === "wishlist") {
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
              onPress={(p) => navigate("detail", p)}
            />
          </ScrollView>
        ) : (
          <EmptyState
            icon="♡"
            title="Belum ada favorit"
            body="Simpan produk yang kamu suka agar mudah ditemukan kembali."
            action="Jelajahi produk"
            onAction={() => navigate("home")}
          />
        )}
      </View>
    );
  }
  if (page === "profile")
    return (
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.profileHero}>
          <View style={styles.avatar}>
            <Text>{user?.name?.[0]?.toUpperCase() || "G"}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.profileName}>
              {user?.name || "Guest shopper"}
            </Text>
            <Text style={styles.profileEmail}>
              {user?.email || "Masuk untuk menikmati semua fitur"}
            </Text>
          </View>
          <Pressable onPress={onLogin}>
            <Text style={styles.action}>{user ? "Edit" : "Masuk"}</Text>
          </Pressable>
        </View>
        <MenuGroup
          title="Aktivitas saya"
          entries={[
            "orders|▣|Pesanan Saya",
            "coupons|✦|Kupon Saya",
            "wallet|◉|Mora Wallet",
          ]}
          navigate={navigate}
        />
        <MenuGroup
          title="Akun & bantuan"
          entries={["chat|♧|Pesan", "settings|⚙|Pengaturan"]}
          navigate={navigate}
        />
      </ScrollView>
    );
  if (page === "notifications")
    return (
      <View style={styles.page}>
        <Header title="Notifikasi" />
        {[
          "Voucher spesial untukmu",
          "Pesanan telah dikirim",
          "Flash sale dimulai sekarang",
        ].map((x, i) => (
          <View key={x} style={styles.notification}>
            <View style={styles.notificationIcon}>
              <Text>{i === 1 ? "▣" : "✦"}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.notificationTitle}>{x}</Text>
              <Text style={styles.notificationBody}>
                {i === 0
                  ? "Hemat hingga Rp50.000 untuk pilihan produk favoritmu."
                  : "Ada kabar terbaru yang perlu kamu lihat."}
              </Text>
              <Text style={styles.storeInfo}>{i + 1} jam lalu</Text>
            </View>
          </View>
        ))}
      </View>
    );
  if (page === "tracking")
    return (
      <ScrollView contentContainerStyle={styles.scroll}>
        <Header title="Lacak Pesanan" onBack={() => navigate("home")} />
        <View style={styles.trackingCard}>
          <Text style={styles.label}>Pesanan #MRA-240821</Text>
          <Text style={styles.trackingStatus}>Dalam perjalanan</Text>
          <Text style={styles.description}>
            Paket sedang diantar menuju alamat Anda.
          </Text>
        </View>
        {[
          "Pesanan dikonfirmasi",
          "Paket diserahkan ke kurir",
          "Dalam perjalanan",
        ].map((x, i) => (
          <View key={x} style={styles.track}>
            <View style={[styles.trackDot, i === 2 && styles.trackDotActive]} />
            <View>
              <Text style={styles.infoTitle}>{x}</Text>
              <Text style={styles.storeInfo}>
                {i === 2 ? "Hari ini, 09:42" : "Kemarin, 16:20"}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    );
  if (page === "payment")
    return (
      <ScrollView contentContainerStyle={styles.scroll}>
        <Header title="Pilih Pembayaran" onBack={() => navigate("checkout")} />
        {[
          "Mora Wallet  ·  Saldo Rp250.000",
          "Virtual Account BCA",
          "Kartu Kredit / Debit",
          "Bayar di tempat (COD)",
        ].map((x, i) => (
          <Pressable
            key={x}
            onPress={() =>
              i === 0 ? navigate("success") : Alert.alert("Metode dipilih", x)
            }
            style={styles.payment}
          >
            <Text style={styles.paymentIcon}>{["◉", "B", "▣", "¤"][i]}</Text>
            <Text style={styles.infoTitle}>{x}</Text>
            <Text style={styles.chevron}>›</Text>
          </Pressable>
        ))}
      </ScrollView>
    );
  const title = pageTitles[page] || "mora.";
  return (
    <View style={styles.page}>
      <Header title={title} onBack={() => navigate("profile")} />
      {page === "orders" ? (
        <EmptyState
          icon="▣"
          title="Belum ada pesanan"
          body="Pesananmu akan muncul di sini."
          action="Belanja sekarang"
          onAction={() => navigate("home")}
        />
      ) : page === "chat" ? (
        <EmptyState
          icon="♧"
          title="Belum ada percakapan"
          body="Mulai chat dengan penjual dari halaman produk."
        />
      ) : page === "store" ? (
        <Store products={products} navigate={navigate} />
      ) : page === "settings" ? (
        <SettingsScreen navigate={navigate} />
      ) : (
        <EmptyState
          icon={page === "coupons" ? "✦" : page === "wallet" ? "◉" : "⚙"}
          title={
            page === "coupons"
              ? "Belum ada kupon"
              : page === "wallet"
                ? "Mora Wallet"
                : "Pengaturan akun"
          }
          body={
            page === "wallet"
              ? "Saldo Anda Rp0. Aktifkan wallet untuk pembayaran lebih cepat."
              : "Halaman ini siap dihubungkan dengan data akun Anda."
          }
          action={page === "wallet" ? "Aktifkan wallet" : undefined}
        />
      )}
    </View>
  );
}
function Header({ title, onBack }) {
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
function Store({ products, navigate }) {
  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <View style={styles.storeHero}>
        <View style={styles.storeAvatar}>
          <Text>A</Text>
        </View>
        <Text style={styles.profileName}>Aster Official Store</Text>
        <Text style={styles.storeInfo}>★ 4.9 · 12,3 rb pengikut · Online</Text>
        <Button
          label="Ikuti"
          small
          variant="outline"
          onPress={() => Alert.alert("Berhasil", "Toko telah diikuti.")}
        />
      </View>
      <SectionTitle title="Produk toko" />
      <ProductGrid
        products={products.slice(0, 4)}
        wishlist={[]}
        onWishlist={() => {}}
        onPress={(p) => navigate("detail", p)}
      />
    </ScrollView>
  );
}

function SettingsScreen({ navigate }) {
  const [pushNotifications, setPushNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [biometricLogin, setBiometricLogin] = useState(true);

  return (
    <ScrollView contentContainerStyle={styles.settingsScroll}>
      {/* ACCOUNT SECTION */}
      <View style={styles.settingsGroup}>
        <Text style={styles.settingsGroupTitle}>ACCOUNT</Text>
        <View style={styles.settingsCard}>
          <Pressable style={styles.settingsRow} onPress={() => {}}>
            <View style={styles.settingsIconCircle}>
              <Text style={styles.settingsIconText}>👤</Text>
            </View>
            <Text style={styles.settingsRowText}>Personal Information</Text>
            <Text style={styles.settingsChevron}>›</Text>
          </Pressable>

          <View style={styles.settingsDivider} />

          <Pressable style={styles.settingsRow} onPress={() => {}}>
            <View style={styles.settingsIconCircle}>
              <Text style={styles.settingsIconText}>🔒</Text>
            </View>
            <Text style={styles.settingsRowText}>Security & Privacy</Text>
            <Text style={styles.settingsChevron}>›</Text>
          </Pressable>

          <View style={styles.settingsDivider} />

          <Pressable style={styles.settingsRow} onPress={() => {}}>
            <View style={styles.settingsIconCircle}>
              <Text style={styles.settingsIconText}>📱</Text>
            </View>
            <Text style={styles.settingsRowText}>Linked Devices</Text>
            <Text style={styles.settingsChevron}>›</Text>
          </Pressable>
        </View>
      </View>

      {/* PREFERENCES SECTION */}
      <View style={styles.settingsGroup}>
        <Text style={styles.settingsGroupTitle}>PREFERENCES</Text>
        <View style={styles.settingsCard}>
          <View style={styles.settingsRow}>
            <View style={styles.settingsIconCircle}>
              <Text style={styles.settingsIconText}>🔔</Text>
            </View>
            <Text style={styles.settingsRowText}>Push Notifications</Text>
            <Switch
              value={pushNotifications}
              onValueChange={setPushNotifications}
              trackColor={{ false: "#E5E7EB", true: "#10B981" }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.settingsDivider} />

          <View style={styles.settingsRow}>
            <View style={styles.settingsIconCircle}>
              <Text style={styles.settingsIconText}>👁</Text>
            </View>
            <Text style={styles.settingsRowText}>Dark Mode</Text>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: "#E5E7EB", true: "#10B981" }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.settingsDivider} />

          <View style={styles.settingsRow}>
            <View style={styles.settingsIconCircle}>
              <Text style={styles.settingsIconText}>🛡</Text>
            </View>
            <Text style={styles.settingsRowText}>Biometric Login</Text>
            <Switch
              value={biometricLogin}
              onValueChange={setBiometricLogin}
              trackColor={{ false: "#E5E7EB", true: "#10B981" }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>
      </View>

      {/* SUPPORT SECTION */}
      <View style={styles.settingsGroup}>
        <Text style={styles.settingsGroupTitle}>SUPPORT</Text>
        <View style={styles.settingsCard}>
          <Pressable style={styles.settingsRow} onPress={() => {}}>
            <View style={styles.settingsIconCircle}>
              <Text style={styles.settingsIconText}>❓</Text>
            </View>
            <Text style={styles.settingsRowText}>Help Center</Text>
            <Text style={styles.settingsChevron}>›</Text>
          </Pressable>

          <View style={styles.settingsDivider} />

          <Pressable style={styles.settingsRow} onPress={() => {}}>
            <View style={styles.settingsIconCircle}>
              <Text style={styles.settingsIconText}>📄</Text>
            </View>
            <Text style={styles.settingsRowText}>Terms & Privacy</Text>
            <Text style={styles.settingsChevron}>›</Text>
          </Pressable>

          <View style={styles.settingsDivider} />

          <Pressable style={styles.settingsRow} onPress={() => {}}>
            <View style={styles.settingsIconCircle}>
              <Text style={styles.settingsIconText}>⚠️</Text>
            </View>
            <Text style={styles.settingsRowText}>Report a Problem</Text>
            <Text style={styles.settingsChevron}>›</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

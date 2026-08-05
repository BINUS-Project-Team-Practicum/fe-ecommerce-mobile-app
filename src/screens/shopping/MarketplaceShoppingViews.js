import { useState } from "react";
import { Alert, Image, Pressable, ScrollView, Text, View } from "react-native";
import { money } from "../../data/mockData";
import { Button, Chip, EmptyState, IconButton, QuantitySelector, Rating, SectionTitle } from "../../components/ui";
import { Header } from "../shared/MarketplaceComponents";
import { styles } from "../shared/marketplaceStyles";

export function ProductDetailScreen({
  selected: p,
  wishlist,
  onToggleWishlist,
  onAddToCart,
  navigate,
}) {
  if (!p)
    return (
      <EmptyState
        title="Produk tidak ditemukan"
        body="Kembali dan pilih produk lain."
        action="Ke beranda"
        onAction={() => navigate("home")}
      />
    );
  const [variant, setVariant] = useState("Hitam");
  return (
    <View style={styles.page}>
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: 105 }]}
      >
        <View style={styles.detailTop}>
          <Pressable
            onPress={() => navigate("home")}
            style={styles.floatingBack}
          >
            <Text style={styles.back}>‹</Text>
          </Pressable>
          <Pressable
            onPress={() => onToggleWishlist(p.id)}
            style={styles.floatingHeart}
          >
            <Text>{wishlist.includes(p.id) ? "♥" : "♡"}</Text>
          </Pressable>
        </View>
        <Image source={{ uri: p.image }} style={styles.detailImage} />
        <View style={styles.detailBody}>
          <Text style={styles.detailPrice}>{money(p.price)}</Text>
          <Text style={styles.detailName}>{p.name}</Text>
          <View style={styles.detailMeta}>
            <Rating value={p.rating} />
            <Text style={styles.metaSep}> · {p.sold} terjual</Text>
          </View>
          <View style={styles.detailLine} />
          <Text style={styles.label}>Pilih warna</Text>
          <View style={styles.variantRow}>
            {["Hitam", "Putih", "Hijau"].map((v) => (
              <Chip
                key={v}
                label={v}
                active={variant === v}
                onPress={() => setVariant(v)}
              />
            ))}
          </View>
          <InfoRow
            icon="▣"
            title="Pengiriman"
            body={`Dari ${p.location} · Estimasi 2–4 hari`}
          />
          <InfoRow
            icon="⌑"
            title="Voucher toko"
            body="Hemat Rp15.000 min. pembelian Rp150.000"
          />
          <View style={styles.storeRow}>
            <Text style={styles.storeAvatar}>{p.store[0]}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.storeName}>{p.store}</Text>
              <Text style={styles.storeInfo}>{p.badge} · Online</Text>
            </View>
            <Button
              label="Kunjungi"
              small
              variant="outline"
              onPress={() => navigate("store")}
            />
          </View>
          <SectionTitle title="Deskripsi produk" />
          <Text style={styles.description}>{p.description}</Text>
          <SectionTitle title="Spesifikasi" />
          <View style={styles.spec}>
            <Text style={styles.specKey}>Kondisi</Text>
            <Text style={styles.specValue}>Baru</Text>
          </View>
          <View style={styles.spec}>
            <Text style={styles.specKey}>Stok</Text>
            <Text style={styles.specValue}>Tersedia</Text>
          </View>
          <SectionTitle title="Ulasan pembeli" action="Lihat semua" />
          <View style={styles.review}>
            <Rating value="4.9" />
            <Text style={styles.description}>
              Produk sesuai foto dan kualitasnya sangat baik. Pengiriman juga
              cepat!
            </Text>
            <Text style={styles.storeInfo}>Rani · 2 hari lalu</Text>
          </View>
        </View>
      </ScrollView>
      <View style={styles.stickyCta}>
        <IconButton icon="♧" onPress={() => navigate("chat")} />
        <Button
          label="+ Keranjang"
          variant="outline"
          onPress={() => {
            onAddToCart(p);
            Alert.alert("Ditambahkan", "Produk masuk ke keranjang Anda.");
          }}
        />
        <Button
          label="Beli sekarang"
          onPress={() => {
            onAddToCart(p);
            navigate("checkout");
          }}
        />
      </View>
    </View>
  );
}
function InfoRow({ icon, title, body }) {
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

export function CartScreen({ cart, onUpdateQuantity, navigate }) {
  const total = cart.reduce((sum, x) => sum + x.price * x.quantity, 0);
  return (
    <View style={styles.page}>
      <Header title="Keranjang" onBack={() => navigate("home")} />
      {!cart.length ? (
        <EmptyState
          icon="🛒"
          title="Keranjangmu masih kosong"
          body="Yuk, temukan produk yang kamu suka."
          action="Mulai belanja"
          onAction={() => navigate("home")}
        />
      ) : (
        <>
          <ScrollView
            contentContainerStyle={[styles.scroll, { paddingBottom: 100 }]}
          >
            {cart.map((item) => (
              <View key={item.id} style={styles.cartItem}>
                <Image source={{ uri: item.image }} style={styles.cartImage} />
                <View style={{ flex: 1 }}>
                  <Text numberOfLines={2} style={styles.cartName}>
                    {item.name}
                  </Text>
                  <Text style={styles.price}>{money(item.price)}</Text>
                  <View style={styles.cartFoot}>
                    <Text style={styles.storeInfo}>{item.store}</Text>
                    <QuantitySelector
                      quantity={item.quantity}
                      onChange={(q) => onUpdateQuantity(item.id, q)}
                    />
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
          <View style={styles.checkoutBar}>
            <View>
              <Text style={styles.storeInfo}>Total belanja</Text>
              <Text style={styles.total}>{money(total)}</Text>
            </View>
            <Button label="Checkout" onPress={() => navigate("checkout")} />
          </View>
        </>
      )}
    </View>
  );
}
export function CheckoutScreen({ cart, navigate }) {
  const total = cart.reduce((sum, x) => sum + x.price * x.quantity, 0);
  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <Header title="Checkout" onBack={() => navigate("cart")} />
      <View style={styles.checkoutCard}>
        <Text style={styles.label}>Alamat pengiriman</Text>
        <Text style={styles.addressName}>Nadia Putri · 0812-3456-7890</Text>
        <Text style={styles.description}>
          Jl. Kemang Raya No. 12, Jakarta Selatan, DKI Jakarta 12730
        </Text>
        <Text style={styles.action}>Ubah alamat</Text>
      </View>
      <View style={styles.checkoutCard}>
        <Text style={styles.label}>Pengiriman</Text>
        <InfoRow
          icon="▣"
          title="Regular"
          body="Estimasi tiba 2–4 hari · Rp15.000"
        />
      </View>
      <View style={styles.checkoutCard}>
        <Text style={styles.label}>Voucher</Text>
        <InfoRow icon="✦" title="Hemat Rp15.000" body="Gunakan voucher toko" />
      </View>
      <View style={styles.checkoutCard}>
        <Text style={styles.label}>Ringkasan pembayaran</Text>
        <Summary label="Subtotal" value={money(total)} />
        <Summary label="Ongkir" value="Rp15.000" />
        <Summary label="Diskon" value="− Rp15.000" />
        <View style={styles.detailLine} />
        <Summary label="Total" value={money(total)} bold />
      </View>
      <Button label="Pilih pembayaran" onPress={() => navigate("payment")} />
    </ScrollView>
  );
}
function Summary({ label, value, bold }) {
  return (
    <View style={styles.summary}>
      <Text style={[styles.summaryText, bold && styles.summaryBold]}>
        {label}
      </Text>
      <Text style={[styles.summaryText, bold && styles.summaryBold]}>
        {value}
      </Text>
    </View>
  );
}
export function OrderSuccessScreen({ navigate }) {
  return (
    <View style={styles.success}>
      <View style={styles.successIcon}>
        <Text style={{ fontSize: 38 }}>✓</Text>
      </View>
      <Text style={styles.successTitle}>Pesanan berhasil dibuat!</Text>
      <Text style={styles.successCopy}>
        Kami akan memberi tahu Anda saat pesanan mulai dikirim.
      </Text>
      <View style={{ width: "100%", gap: 10 }}>
        <Button label="Lacak pesanan" onPress={() => navigate("tracking")} />
        <Button
          label="Kembali berbelanja"
          variant="outline"
          onPress={() => navigate("home")}
        />
      </View>
    </View>
  );
}

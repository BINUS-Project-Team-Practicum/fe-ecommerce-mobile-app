import { useState } from "react";
import { Alert, Image, Pressable, ScrollView, Text, View } from "react-native";
import { money } from "../../data/mockData";
import { Button, EmptyState, QuantitySelector, Rating } from "../../components/ui";
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
  const [variant, setVariant] = useState("Midnight Black");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const addSelectedProduct = () => {
    Array.from({ length: quantity }).forEach(() => onAddToCart(p));
  };
  return (
    <View style={styles.page}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 106 }}
      >
        <View style={styles.detailTop}>
          <Pressable
            onPress={() => navigate("home")}
            style={styles.floatingBack}
          >
            <Text style={styles.back}>‹</Text>
          </Pressable>
          <View style={styles.detailTopActions}>
            <Pressable style={styles.floatingAction}>
              <Text style={styles.detailActionIcon}>♧</Text>
            </Pressable>
            <Pressable
              onPress={() => onToggleWishlist(p.id)}
              style={styles.floatingAction}
            >
              <Text style={styles.detailActionIcon}>
                {wishlist.includes(p.id) ? "♥" : "♡"}
              </Text>
            </Pressable>
          </View>
        </View>
        <View style={styles.detailGallery}>
          <Image source={{ uri: p.image }} style={styles.detailImage} />
          <View style={styles.detailThumbnails}>
            {[0, 1, 2].map((item) => (
              <View
                key={item}
                style={[
                  styles.detailThumbnail,
                  item === 0 && styles.detailThumbnailActive,
                ]}
              >
                <Image source={{ uri: p.image }} style={styles.thumbnailImage} />
              </View>
            ))}
          </View>
          <View style={styles.galleryCount}>
            <Text style={styles.galleryCountText}>1/3</Text>
          </View>
        </View>
        <View style={styles.detailBody}>
          <Text style={styles.detailStore}>
            {p.store} <Text style={styles.detailOfficial}>· {p.badge}</Text>
          </Text>
          <Text style={styles.detailName}>{p.name}</Text>
          <View style={styles.detailPriceRow}>
            <Text style={styles.detailPrice}>{money(p.price)}</Text>
            <Text style={styles.detailOldPrice}>{money(p.oldPrice)}</Text>
            <Text style={styles.detailDiscount}>-{p.discount}%</Text>
          </View>
          <View style={styles.detailMeta}>
            <Text style={styles.detailStars}>★★★★<Text style={styles.detailStarMuted}>★</Text></Text>
            <Text style={styles.detailRating}>{p.rating} ({p.sold})</Text>
            <Text style={styles.detailSold}>{p.sold} sold</Text>
          </View>
          <View style={styles.detailSection}>
            <Text style={styles.variantLabel}>Color: <Text style={styles.variantValue}>{variant}</Text></Text>
            <View style={styles.variantRow}>
              {[
                ["Midnight Black", "#151515"],
                ["Pearl White", "#F4F4F5"],
                ["Navy Blue", "#1E3A5F"],
              ].map(([name, color]) => (
                <Pressable
                key={name}
                  onPress={() => setVariant(name)}
                  style={[
                    styles.colorSwatch,
                    { backgroundColor: color },
                    variant === name && styles.colorSwatchActive,
                  ]}
                />
              ))}
            </View>
          </View>
          <View style={styles.quantityRow}>
            <Text style={styles.quantityLabel}>Quantity</Text>
            <View style={styles.detailQuantityControl}>
              <Pressable onPress={() => setQuantity(Math.max(1, quantity - 1))} style={styles.detailQuantityButton}>
                <Text style={styles.detailQuantitySign}>−</Text>
              </Pressable>
              <Text style={styles.detailQuantityValue}>{quantity}</Text>
              <Pressable onPress={() => setQuantity(quantity + 1)} style={[styles.detailQuantityButton, styles.detailQuantityAdd]}>
                <Text style={styles.detailQuantityAddText}>+</Text>
              </Pressable>
            </View>
          </View>
          <View style={styles.benefitPanel}>
            <View style={styles.benefitPrimary}>
              <Text style={styles.benefitIcon}>▱</Text>
              <Text style={styles.benefitTitle}>Free Shipping</Text>
              <Text style={styles.benefitCopy}>Est. delivery 2–4 days</Text>
            </View>
            <View style={styles.benefitSecondary}>
              <Text>♢  Buyer Protection</Text>
              <Text>↻  Free Returns</Text>
            </View>
          </View>
          <Pressable style={styles.couponRow}>
            <Text style={styles.couponIcon}>♧</Text>
            <Text style={styles.couponText}>Hemat ekstra 25% dengan kupon</Text>
            <Text style={styles.couponClaim}>Claim</Text>
          </Pressable>
          <View style={styles.detailTabs}>
            {[
              ["description", "Description"],
              ["specs", "Specs"],
              ["reviews", "Reviews"],
            ].map(([id, label]) => (
              <Pressable key={id} onPress={() => setActiveTab(id)} style={styles.detailTab}>
                <Text style={[styles.detailTabText, activeTab === id && styles.detailTabTextActive]}>{label}</Text>
                {activeTab === id && <View style={styles.detailTabIndicator} />}
              </Pressable>
            ))}
          </View>
          {activeTab === "description" && <Text style={styles.detailDescription}>{p.description}</Text>}
          {activeTab === "specs" && <View style={styles.detailSpecs}><Text style={styles.specKey}>Kondisi</Text><Text style={styles.specValue}>Baru</Text><Text style={styles.specKey}>Asal pengiriman</Text><Text style={styles.specValue}>{p.location}</Text></View>}
          {activeTab === "reviews" && <View style={styles.detailReview}><Rating value={p.rating} /><Text style={styles.detailDescription}>Produk sesuai foto dan kualitasnya sangat baik.</Text></View>}
        </View>
      </ScrollView>
      <View style={styles.stickyCta}>
        <Button
          label="+ Keranjang"
          variant="outline"
          onPress={() => {
            addSelectedProduct();
            Alert.alert("Ditambahkan", "Produk masuk ke keranjang Anda.");
          }}
        />
        <Button
          label="Beli sekarang"
          onPress={() => {
            addSelectedProduct();
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

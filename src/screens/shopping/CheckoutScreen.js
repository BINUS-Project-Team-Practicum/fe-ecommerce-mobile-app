import { ScrollView, Text, View } from 'react-native';
import { money } from '../../utils/format';
import { Button } from '../../components/ui';
import { Header, InfoRow } from '../shared/MarketplaceComponents';
import { styles } from './shoppingStyles';

const SHIPPING_FEE = 15000;
const VOUCHER_DISCOUNT = 15000;

export default function CheckoutScreen({ cart, goBack, navigate }) {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal + SHIPPING_FEE - VOUCHER_DISCOUNT;
  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <Header title="Checkout" onBack={goBack} />
      <DeliveryAddress />
      <DeliveryMethod />
      <Voucher />
      <PaymentSummary subtotal={subtotal} total={total} />
      <Button label="Choose payment" onPress={() => navigate('payment')} />
    </ScrollView>
  );
}

function DeliveryAddress() {
  return (
    <View style={styles.checkoutCard}>
      <Text style={styles.label}>Delivery address</Text>
      <Text style={styles.addressName}>Nadia Putri · 0812-3456-7890</Text>
      <Text style={styles.description}>
        Jl. Kemang Raya No. 12, Jakarta Selatan, DKI Jakarta 12730
      </Text>
      <Text style={styles.action}>Change address</Text>
    </View>
  );
}

function DeliveryMethod() {
  return (
    <View style={styles.checkoutCard}>
      <Text style={styles.label}>Delivery</Text>
      <InfoRow icon="car-outline" title="Regular delivery" body="Arrives in 2–4 days · Rp15.000" />
    </View>
  );
}

function Voucher() {
  return (
    <View style={styles.checkoutCard}>
      <Text style={styles.label}>Voucher</Text>
      <InfoRow icon="ticket-outline" title="Save Rp15.000" body="Store voucher applied" />
    </View>
  );
}

function PaymentSummary({ subtotal, total }) {
  return (
    <View style={styles.checkoutCard}>
      <Text style={styles.label}>Payment summary</Text>
      <SummaryRow label="Subtotal" value={money(subtotal)} />
      <SummaryRow label="Shipping" value={money(SHIPPING_FEE)} />
      <SummaryRow label="Discount" value={`− ${money(VOUCHER_DISCOUNT)}`} />
      <View style={styles.detailLine} />
      <SummaryRow label="Total" value={money(total)} bold />
    </View>
  );
}

function SummaryRow({ label, value, bold }) {
  return (
    <View style={styles.summary}>
      <Text style={[styles.summaryText, bold && styles.summaryBold]}>{label}</Text>
      <Text style={[styles.summaryText, bold && styles.summaryBold]}>{value}</Text>
    </View>
  );
}

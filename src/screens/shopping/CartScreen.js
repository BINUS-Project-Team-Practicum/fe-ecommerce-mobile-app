import { Image, ScrollView, Text, View } from 'react-native';
import { money } from '../../utils/format';
import { Button, EmptyState, QuantitySelector } from '../../components/ui';
import { Header } from '../shared/MarketplaceComponents';
import { styles } from './shoppingStyles';

export default function CartScreen({ cart, goBack, onUpdateQuantity, navigate }) {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return (
    <View style={styles.page}>
      <Header title="Cart" onBack={goBack} />
      {!cart.length ? (
        <EmptyCart navigate={navigate} />
      ) : (
        <>
          <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: 100 }]}>
            {cart.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onQuantityChange={(quantity) => onUpdateQuantity(item.id, quantity)}
              />
            ))}
          </ScrollView>
          <View style={styles.checkoutBar}>
            <View>
              <Text style={styles.storeInfo}>Order total</Text>
              <Text style={styles.total}>{money(total)}</Text>
            </View>
            <Button label="Checkout" onPress={() => navigate('checkout')} />
          </View>
        </>
      )}
    </View>
  );
}

function EmptyCart({ navigate }) {
  return (
    <EmptyState
      icon="bag-handle-outline"
      title="Your cart is empty"
      body="Find products you will love and add them here."
      action="Start shopping"
      onAction={() => navigate('home')}
    />
  );
}

function CartItem({ item, onQuantityChange }) {
  return (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.image }} style={styles.cartImage} />
      <View style={{ flex: 1 }}>
        <Text numberOfLines={2} style={styles.cartName}>
          {item.name}
        </Text>
        <Text style={styles.price}>{money(item.price)}</Text>
        <View style={styles.cartFoot}>
          <Text style={styles.storeInfo}>{item.store}</Text>
          <QuantitySelector quantity={item.quantity} onChange={onQuantityChange} />
        </View>
      </View>
    </View>
  );
}

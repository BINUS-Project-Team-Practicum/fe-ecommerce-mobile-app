import { Text, View } from "react-native";
import { Button } from "../../components/ui";
import { Icon } from "../../components/Icon";
import { styles } from "./shoppingStyles";

export default function OrderSuccessScreen({ navigate }) {
  return <View style={styles.success}>
    <View style={styles.successIcon}><Icon name="checkmark" size={38} color="#047857" /></View>
    <Text style={styles.successTitle}>Order placed successfully!</Text>
    <Text style={styles.successCopy}>We will notify you when your order is on its way.</Text>
    <View style={{ width: "100%", gap: 10 }}>
      <Button label="Track order" onPress={() => navigate("tracking")} />
      <Button label="Continue shopping" variant="outline" onPress={() => navigate("home")} />
    </View>
  </View>;
}

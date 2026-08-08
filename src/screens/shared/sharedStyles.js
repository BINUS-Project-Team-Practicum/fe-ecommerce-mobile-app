import { Platform, StyleSheet } from "react-native";
import { colors } from "../../components/ui";

export const sans = Platform.select({
  ios: "System",
  android: "sans-serif",
  web: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
});

export const sharedStyles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: 16, paddingBottom: 28 },
  header: {
    height: 61,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: "#F1F5F9",
  },
  headerTitle: { color: colors.text, fontSize: 17, fontWeight: "800" },
  price: { color: colors.primary, fontWeight: "800" },
  action: { color: colors.primary, fontWeight: "800" },
  label: { color: colors.text, fontWeight: "800", marginBottom: 9 },
  addressName: { color: colors.text, fontWeight: "700", marginBottom: 4 },
  description: { color: "#4B5563", lineHeight: 21, fontSize: 13 },
  detailLine: { height: 1, backgroundColor: colors.line, marginVertical: 18 },
  specKey: { color: colors.muted, width: "45%" },
  specValue: { color: colors.text, fontWeight: "600" },
  infoRow: {
    flexDirection: "row",
    gap: 12,
    paddingVertical: 13,
    alignItems: "center",
  },
  infoTitle: { color: colors.text, fontWeight: "700", fontSize: 14 },
  infoBody: { color: colors.muted, fontSize: 12, lineHeight: 18, marginTop: 3 },
  storeInfo: { color: colors.muted, fontSize: 11, marginTop: 3 },
  checkoutCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  summary: { backgroundColor: "#fff", borderRadius: 16, padding: 16, gap: 10 },
  summaryText: { color: colors.muted, fontSize: 13 },
  summaryBold: { color: colors.text, fontWeight: "900", fontSize: 15 },
});

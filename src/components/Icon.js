import { Ionicons } from '@expo/vector-icons';

export function Icon({ name, size = 20, color = '#111827', style }) {
  return <Ionicons name={name} size={size} color={color} style={style} />;
}

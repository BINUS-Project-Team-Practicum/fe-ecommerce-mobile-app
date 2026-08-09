import { View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { iconSvgs } from './iconSvgs';

// Ikon digambar dari teks SVG, bukan dari font. Tidak ada berkas font yang perlu
// dimuat saat start, sehingga tidak ada lagi jeda yang bisa membuat ikon hilang,
// dan tidak ada nama font family yang bisa tidak cocok dengan hasil build.
//
// Prop color bekerja karena setiap SVG memakai currentColor: yang outline sudah
// begitu dari sumbernya, yang solid disuntik saat berkas iconSvgs.js dihasilkan.
export function Icon({ name, size = 20, color = '#111827', style }) {
  const xml = iconSvgs[name];

  if (!xml) {
    if (__DEV__) {
      console.warn(`Icon "${name}" tidak ada di iconSvgs. Jalankan ulang script pembuat ikon.`);
    }
    // Ruang kosong seukuran ikon supaya tata letak tidak bergeser saat nama salah.
    return <View style={[{ width: size, height: size }, style]} />;
  }

  return <SvgXml xml={xml} width={size} height={size} color={color} style={style} />;
}

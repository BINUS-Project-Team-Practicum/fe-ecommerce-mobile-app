// Menghasilkan src/components/iconSvgs.js dari paket ionicons.
// Hanya ikon yang benar-benar dipakai yang ikut, bukan seluruh 1356 berkas.
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.argv[2];
if (!ROOT) throw new Error('usage: node gen-icon-svgs.mjs <projectRoot>');

const SVG_DIR = path.join(ROOT, 'node_modules/ionicons/dist/svg');
const OUT = path.join(ROOT, 'src/components/iconSvgs.js');

// Nama yang sah menurut glyphmap @expo/vector-icons, dipakai sebagai penyaring
// supaya kata biasa seperti "home" pada string lain tidak ikut terbawa keliru.
const glyphs = JSON.parse(
  fs.readFileSync(
    path.join(ROOT, 'node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/glyphmaps/Ionicons.json'),
    'utf8',
  ),
);
const valid = new Set(Object.keys(glyphs));

// Kumpulkan setiap string berkutip di source yang cocok dengan nama ikon.
const files = ['App.js'];
(function walk(dir) {
  for (const entry of fs.readdirSync(path.join(ROOT, dir))) {
    const rel = path.join(dir, entry);
    const stat = fs.statSync(path.join(ROOT, rel));
    if (stat.isDirectory()) walk(rel);
    else if (/\.(js|jsx)$/.test(entry)) files.push(rel);
  }
})('src');

const used = new Set();
for (const rel of files) {
  const src = fs.readFileSync(path.join(ROOT, rel), 'utf8');
  for (const m of src.matchAll(/['"]([a-z][a-z0-9-]{2,})['"]/g)) {
    if (valid.has(m[1])) used.add(m[1]);
  }
}

// BottomNav membentuk varian solid saat runtime lewat icon.replace('-outline', ''),
// jadi pasangan solid dari setiap ikon outline harus ikut disediakan.
for (const name of [...used]) {
  if (name.endsWith('-outline')) {
    const solid = name.replace(/-outline$/, '');
    if (valid.has(solid)) used.add(solid);
  }
}

// Ionicons memberi warna lewat dua cara. Ikon outline sudah memakai
// stroke="currentColor". Ikon solid tidak punya atribut fill sama sekali,
// sehingga akan tergambar hitam. Elemen tanpa fill diberi currentColor supaya
// prop color pada SvgXml bisa mewarnai keduanya.
function colorize(svg) {
  return svg.replace(/<(path|circle|rect|ellipse)\b([^>]*)>/g, (whole, tag, attrs) => {
    if (/\bfill\s*=/.test(attrs)) return whole;
    return `<${tag}${attrs} fill="currentColor">`;
  });
}

const entries = [];
const missing = [];
for (const name of [...used].sort()) {
  const file = path.join(SVG_DIR, `${name}.svg`);
  if (!fs.existsSync(file)) {
    missing.push(name);
    continue;
  }
  const raw = fs.readFileSync(file, 'utf8').trim().replace(/\s+/g, ' ');
  entries.push([name, colorize(raw)]);
}

const header = `// BERKAS INI DIHASILKAN OTOMATIS. Jangan diedit manual.
// Sumber: paket npm "ionicons" (lisensi MIT), hanya ikon yang dipakai yang disertakan.
// Untuk menambah ikon: pakai namanya di komponen, lalu jalankan ulang script pembuatnya.
//
// Ikon disimpan sebagai teks SVG, bukan sebagai font. Dengan begitu tidak ada
// lagi berkas font yang harus dimuat saat aplikasi start, dan tidak ada nama
// font family yang bisa tidak cocok antara hasil build dan yang diminta kode.

export const iconSvgs = {
`;

const body = entries.map(([name, svg]) => `  ${JSON.stringify(name)}: ${JSON.stringify(svg)},`).join('\n');
const footer = `
};

export const iconNames = Object.keys(iconSvgs);
`;

fs.writeFileSync(OUT, header + body + footer, 'utf8');

console.log(`ikon ditulis : ${entries.length}`);
console.log(`ukuran berkas: ${(fs.statSync(OUT).size / 1024).toFixed(1)} KB`);
if (missing.length) console.log(`tidak ketemu : ${missing.join(', ')}`);
console.log(entries.map(([n]) => n).join(', '));

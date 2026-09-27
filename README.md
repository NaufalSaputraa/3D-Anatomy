# 3D Anatomy — Penampil Anatomi Tubuh Manusia Interaktif

Jelajahi rangka manusia 201 tulang dan 14 sistem organ dalam 3D langsung dari browser:
putar, zoom hingga ke pembuluh terkecil, klik struktur apa pun untuk mengenalinya,
dan belajar per bab — dalam Bahasa Indonesia atau Inggris.

## Fitur

- **Viewer 3D interaktif** — orbit, pan, zoom-to-cursor hingga detail mikro; klik tulang
  atau organ untuk highlight + panel penjelasan (nama Latin, region, fungsi, ID part).
- **14 lapisan organ (lazy-load)** — jantung, pernapasan, pencernaan, saraf, otot, arteri,
  vena, indera, kemih, limfatik, endokrin, reproduksi, permukaan tubuh, jaringan ikat.
  Geometri 2234 part BodyParts3D diunduh per sistem hanya saat diaktifkan.
- **Mode belajar per bab** — 14 bab berisi materi + 3 fakta kunci per sistem tubuh.
- **Search 2234 organ** — ketik ≥2 huruf, klik hasil organ: lapisan aktif otomatis
  dan kamera terbang ke part tersebut.
- **Mode isolate & visibility** — fokus satu sistem, eye-toggle per sistem, panel kiri
  collapsible, layout responsif mobile.
- **ID/EN penuh** — seluruh UI, materi, dan deskripsi tulang bilingual.

## Mulai cepat

```bash
npm install
npm run dev      # http://localhost:5173
```

Perintah lain:

| Perintah                | Fungsi                                      |
| ----------------------- | ------------------------------------------- |
| `npm run build`         | Type-check + build produksi ke `dist/`      |
| `npm run preview`       | Coba hasil build secara lokal               |
| `npm run validate-manifest` | Validasi `src/data/manifest.json`       |
| `npm run lint`          | Lint dengan Oxlint                          |

> Butuh internet saat pertama memakai lapisan organ atau search organ (fetch atlas +
> chunk geometri dari upstream, lalu ter-cache). Kerangka dan UI jalan penuh
> tanpa memuat apa pun lagi setelah build.

## Cara pakai (60 detik)

1. Aktifkan **Lapisan Organ** → Jantung — tunggu status *Siap*.
2. Klik jantung di kanvas — baca panel penjelasannya, tekan **Fokus sistem ini**.
3. Buka **Belajar** → pilih bab → baca materi dan fakta kuncinya.
4. Ketik `aorta` di search → klik hasilnya → kamera terbang ke aortanya.

## Arsitektur singkat

```
src/
  data/     # murni data: manifest, skema Zod, parser nama tulang, transform
  viewer/   # 3D: scene store (Zustand), loader atlas, ModelGroup, OrganSystem
  ui/       # presentasi: Sidebar, InfoPanel, StudyPanel, ChapterModal, i18n
  app/      # entry: App, providers
```

Prinsip: state 3D dan state UI terpisah; lapisan organ lazy per chunk dengan
cache; 1 draw call per sistem (geometri ter-merge) + picking per part.

<details>
<summary><strong>Dari mana datanya?</strong></summary>

- Kerangka: `skeleton.glb` — MIT, JohanBellander/BodyExplorer.
- Organ: atlas human-atlas (ashemag, MIT) berbasis BodyParts3D 4.0
  © DBCLS Jepang, lisensi **CC BY 4.0** — dipakai saat runtime dengan atribusi.
- Detail lengkap: [`public/ATTRIBUTION.md`](public/ATTRIBUTION.md).

</details>

<details>
<summary><strong>Deploy (Cloudflare Pages)</strong></summary>

Build command `npm run build`, output directory `dist`. SPA statis tanpa fungsi
server; tidak ada secret apa pun di repo ini.

</details>

## Peta jalan

- [x] Skeleton + picking per tulang + deskripsi spesifik
- [x] 14 lapisan organ + isolate + search + fokus kamera
- [x] Belajar per bab + ID/EN
- [ ] Cache chunk IndexedDB (offline penuh)
- [ ] Search seluruh 3432 konsep + navigasi hierarki FMA
- [ ] Optimasi bundle three.js

## Lisensi

Kode aplikasi mengikuti lisensi repo ini; data anatomi mengikuti lisensinya
masing-masing — lihat [`public/ATTRIBUTION.md`](public/ATTRIBUTION.md).

# 3DAnatomy

Web penampil anatomi tubuh manusia 3D interaktif: kerangka + 14 sistem organ,
mode belajar per bab, dan kuis — dwibahasa Indonesia/Inggris.

## Language

**Sistem**:
Satu dari 14 sistem anatomi tubuh (jantung, saraf, otot, …) yang bisa dimuat sebagai lapisan 3D, dipelajari sebagai bab, dan diisolasi.
_Avoid_: Lapisan, Lapisan Organ, Layer

**Struktur**:
Satu dari 16 entri manifest kurasi tangan (nama + deskripsi ID/EN) yang tampil di daftar sidebar.
_Avoid_: Part, Item

**Part**:
Satu dari 2234 mesh anatomi BodyParts3D (mis. FJ2564) dengan nama, sistem, dan ID konsep FMA.
_Avoid_: Mesh (untuk atlas), Struktur (untuk atlas)

**Mesh**:
Satu dari 201 tulang pada model kerangka GLB (mis. `left_hip_bone`).
_Avoid_: Part (untuk kerangka)

**Bab**:
Mode belajar untuk satu Sistem: materi + fakta kunci + kuis khusus bab tersebut.
_Avoid_: Chapter (di UI Indonesia), Modul

**Fokus**:
Aksi mengisolasi satu Sistem (atau kerangka) sehingga sistem lain disembunyikan.
_Avoid_: Isolasi, Isolate (di UI; kode boleh memakai `isolatedSystem`)

**Kuis**:
Kuis campuran dari bank soal manifest dan organ. Kuis khusus satu bab disebut Kuis Bab.
_Avoid_: Quiz (di UI Indonesia), Tes

**Reset**:
Mengembalikan seleksi, kamera, Fokus, dan mode Belajar ke keadaan awal sekaligus.
_Avoid_: memakai Reset untuk arti yang lebih sempit

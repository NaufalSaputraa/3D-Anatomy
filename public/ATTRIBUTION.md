# Atribusi Model 3D

- Skeleton `public/models/skeleton.glb` — MIT, dari JohanBellander/BodyExplorer
  (https://github.com/JohanBellander/BodyExplorer).
- Data anatomi teks (nama/deskripsi Indonesia) — ditulis sendiri untuk MVP,
  nanti diganti BodyParts3D (CC BY 4.0, DBCLS Japan) saat memakai mesh tersegmentasi.
- Lapisan organ (jantung, paru, pencernaan, saraf) — geometri + metadata dari
  human-atlas oleh ashemag (https://github.com/ashemag/human-atlas, lisensi MIT),
  berbasis data BodyParts3D 4.0 © The Database Center for Life Science (DBCLS),
  Jepang, lisensi CC BY 4.0. Di-fetch saat runtime dari upstream agar repo tetap
  ringan. Palet warna sistem diadopsi dari human-atlas (MIT).

import "dotenv/config";
import { db as prisma } from '../lib/db';

async function main() {
  console.log('Clearing database tables...');
  // Clear in reverse order of dependencies
  await prisma.riwayatKonsultasi.deleteMany({});
  await prisma.ruleRotasi.deleteMany({});
  await prisma.validasiPakar.deleteMany({});
  await prisma.ruleKriteria.deleteMany({});
  await prisma.constraintRotasi.deleteMany({});
  await prisma.jedaRotasi.deleteMany({});
  await prisma.tanaman.deleteMany({});
  await prisma.kriteria.deleteMany({});
  
  console.log('Seeding criteria (Kriteria)...');
  const criteriaData = [
    { kode_kriteria: 'K001', deskripsi: 'Suhu 15–20°C', bobot_cf: 0.5 },
    { kode_kriteria: 'K002', deskripsi: 'Suhu 21–25°C', bobot_cf: 0.5 },
    { kode_kriteria: 'K003', deskripsi: 'Suhu 26–32°C', bobot_cf: 0.6 },
    { kode_kriteria: 'K004', deskripsi: 'Ketersediaan air 50–200 mm', bobot_cf: 0.8 },
    { kode_kriteria: 'K005', deskripsi: 'Ketersediaan air 200–500 mm', bobot_cf: 0.7 },
    { kode_kriteria: 'K006', deskripsi: 'Ketersediaan air 500–800 mm', bobot_cf: 0.6 },
    { kode_kriteria: 'K007', deskripsi: 'Ketersediaan air 800–1300 mm', bobot_cf: 0.6 },
    { kode_kriteria: 'K008', deskripsi: 'Kedalaman tanah > 50 cm', bobot_cf: 0.2 },
    { kode_kriteria: 'K009', deskripsi: 'Kedalaman tanah > 75 cm', bobot_cf: 0.2 },
    { kode_kriteria: 'K010', deskripsi: 'Kejenuhan basa > 35%', bobot_cf: 0.2 },
    { kode_kriteria: 'K011', deskripsi: 'Kejenuhan basa > 50%', bobot_cf: 0.3 },
    { kode_kriteria: 'K012', deskripsi: 'pH 6.0–6.5', bobot_cf: 0.6 },
    { kode_kriteria: 'K013', deskripsi: 'pH 6.6–7.0', bobot_cf: 0.4 },
    { kode_kriteria: 'K014', deskripsi: 'pH 5.0–5.9', bobot_cf: 0.7 },
    { kode_kriteria: 'K015', deskripsi: 'pH 7.1–7.9', bobot_cf: 0.7 },
  ];

  for (const c of criteriaData) {
    await prisma.kriteria.create({ data: c });
  }

  console.log('Seeding crops (Tanaman)...');
  const cropsData = [
    { kode_tanaman: 'T001', nama_tanaman: 'Bawang Merah, Bawang Putih', famili_botani: 'Amaryllidaceae', kategori: 'Sayuran umbi', status_validasi: 'literatur', cf_akhir: 96.64 },
    { kode_tanaman: 'T002', nama_tanaman: 'Brokoli', famili_botani: 'Brassicaceae', kategori: 'Sayuran daun', status_validasi: 'literatur', cf_akhir: 96.64 },
    { kode_tanaman: 'T003', nama_tanaman: 'Gandum', famili_botani: 'Poaceae', kategori: 'Serealia', status_validasi: 'literatur', cf_akhir: 96.64 },
    { kode_tanaman: 'T004', nama_tanaman: 'Bit, Wortel', famili_botani: 'Amaranthaceae / Apiaceae', kategori: 'Sayuran umbi', status_validasi: 'literatur', cf_akhir: 97.48 },
    { kode_tanaman: 'T005', nama_tanaman: 'Blewah, Tomat Buah, Tomat Sayur', famili_botani: 'Cucurbitaceae / Solanaceae', kategori: 'Buah & sayuran buah', status_validasi: 'literatur', cf_akhir: 93.28 },
    { kode_tanaman: 'T006', nama_tanaman: 'Cabai Merah, Kedelai', famili_botani: 'Solanaceae / Fabaceae', kategori: 'Sayuran buah & legum', status_validasi: 'tervalidasi_pakar', cf_akhir: 96.64 },
    { kode_tanaman: 'T007', nama_tanaman: 'Jagung, Ubi Jalar', famili_botani: 'Poaceae / Convolvulaceae', kategori: 'Serealia & umbi', status_validasi: 'tervalidasi_pakar', cf_akhir: 86.56 },
    { kode_tanaman: 'T008', nama_tanaman: 'Kacang Arab (Chickpea)', famili_botani: 'Fabaceae', kategori: 'Legum', status_validasi: 'literatur', cf_akhir: 97.48 },
    { kode_tanaman: 'T009', nama_tanaman: 'Kacang Panjang, Kacang Hijau', famili_botani: 'Fabaceae', kategori: 'Legum', status_validasi: 'tervalidasi_pakar', cf_akhir: 94.96 },
    { kode_tanaman: 'T010', nama_tanaman: 'Kacang Tanah, Paprika', famili_botani: 'Fabaceae / Solanaceae', kategori: 'Legum & sayuran buah', status_validasi: 'tervalidasi_pakar', cf_akhir: 98.08 },
    { kode_tanaman: 'T011', nama_tanaman: 'Kentang', famili_botani: 'Solanaceae', kategori: 'Umbi', status_validasi: 'literatur', cf_akhir: 97.44 },
    { kode_tanaman: 'T012', nama_tanaman: 'Lobak, Sawi', famili_botani: 'Brassicaceae', kategori: 'Sayuran umbi/daun', status_validasi: 'tervalidasi_pakar', cf_akhir: 96.16 },
    { kode_tanaman: 'T013', nama_tanaman: 'Melon, Mentimun', famili_botani: 'Cucurbitaceae', kategori: 'Buah & sayuran buah', status_validasi: 'tervalidasi_pakar', cf_akhir: 84.64 },
    { kode_tanaman: 'T014', nama_tanaman: 'Nanas', famili_botani: 'Bromeliaceae', kategori: 'Buah', status_validasi: 'literatur', cf_akhir: 94.88 },
    { kode_tanaman: 'T015', nama_tanaman: 'Padi Gogo', famili_botani: 'Poaceae', kategori: 'Serealia (lahan kering)', status_validasi: 'literatur', cf_akhir: 96.93 },
    { kode_tanaman: 'T016', nama_tanaman: 'Padi Tadah Hujan, Padi Sawah', famili_botani: 'Poaceae', kategori: 'Serealia', status_validasi: 'tervalidasi_pakar', cf_akhir: 89.25 },
    { kode_tanaman: 'T017', nama_tanaman: 'Pare', famili_botani: 'Cucurbitaceae', kategori: 'Sayuran buah', status_validasi: 'literatur', cf_akhir: 96.16 },
    { kode_tanaman: 'T018', nama_tanaman: 'Semangka', famili_botani: 'Cucurbitaceae', kategori: 'Buah', status_validasi: 'literatur', cf_akhir: 93.86 },
    { kode_tanaman: 'T019', nama_tanaman: 'Sorgum', famili_botani: 'Poaceae', kategori: 'Serealia', status_validasi: 'literatur', cf_akhir: 94.62 },
    { kode_tanaman: 'T020', nama_tanaman: 'Talas', famili_botani: 'Araceae', kategori: 'Umbi', status_validasi: 'literatur', cf_akhir: 98.21 },
    { kode_tanaman: 'T021', nama_tanaman: 'Terong', famili_botani: 'Solanaceae', kategori: 'Sayuran buah', status_validasi: 'tervalidasi_pakar', cf_akhir: 84.64 },
    { kode_tanaman: 'T022', nama_tanaman: 'Singkong', famili_botani: 'Euphorbiaceae', kategori: 'Umbi', status_validasi: 'tervalidasi_pakar', cf_akhir: 96.16 },
  ] as const;

  for (const crop of cropsData) {
    await prisma.tanaman.create({ data: crop });
  }

  console.log('Seeding relation rules (RuleKriteria)...');
  const ruleKriteriaData = [
    { T001: ['K011', 'K008', 'K001', 'K006', 'K015'] },
    { T002: ['K011', 'K008', 'K001', 'K006', 'K015'] },
    { T003: ['K011', 'K008', 'K001', 'K006', 'K015'] },
    { T004: ['K011', 'K008', 'K001', 'K005', 'K014'] },
    { T005: ['K011', 'K008', 'K002', 'K006', 'K013'] },
    { T006: ['K010', 'K009', 'K002', 'K007', 'K015'] },
    { T007: ['K011', 'K009', 'K002', 'K007', 'K013'] },
    { T008: ['K011', 'K009', 'K001', 'K005', 'K015'] },
    { T009: ['K011', 'K009', 'K001', 'K005', 'K013'] },
    { T010: ['K010', 'K009', 'K003', 'K004', 'K014'] },
    { T011: ['K010', 'K009', 'K001', 'K004', 'K012'] },
    { T012: ['K010', 'K009', 'K001', 'K005', 'K012'] },
    { T013: ['K010', 'K008', 'K002', 'K006', 'K013'] },
    { T014: ['K010', 'K008', 'K002', 'K007', 'K012'] },
    { T015: ['K010', 'K008', 'K003', 'K005', 'K012'] },
    { T016: ['K011', 'K009', 'K003', 'K006', 'K013'] },
    { T017: ['K010', 'K008', 'K002', 'K007', 'K014'] },
    { T018: ['K010', 'K008', 'K003', 'K006', 'K013'] },
    { T019: ['K011', 'K008', 'K003', 'K006', 'K013'] },
    { T020: ['K011', 'K009', 'K003', 'K004', 'K012'] },
    { T021: ['K010', 'K008', 'K001', 'K006', 'K013'] },
    { T022: ['K010', 'K009', 'K002', 'K007', 'K012'] },
  ];

  for (const entry of ruleKriteriaData) {
    const [kode_tanaman, kriteriaList] = Object.entries(entry)[0];
    for (const kode_kriteria of kriteriaList) {
      await prisma.ruleKriteria.create({
        data: {
          kode_tanaman,
          kode_kriteria,
        },
      });
    }
  }

  console.log('Seeding expert validations (ValidasiPakar)...');
  const validationsData = [
    {
      kode_tanaman: 'T007',
      nama_pakar: 'Pakar 1',
      status_kesesuaian: 'sesuai' as const,
      urutan_prioritas_pakar: 'Kesuburan/pH → Suhu → Air → Kedalaman tanah',
      catatan_revisi: 'Tidak ada revisi',
    },
    {
      kode_tanaman: 'T016',
      nama_pakar: 'Pakar 1',
      status_kesesuaian: 'sebagian_sesuai' as const,
      urutan_prioritas_pakar: 'Air → Suhu → pH',
      catatan_revisi: 'pH lebih toleran, bisa 5,5–6,5',
    },
    {
      kode_tanaman: 'T013',
      nama_pakar: 'Pakar 1',
      status_kesesuaian: 'sebagian_sesuai' as const,
      urutan_prioritas_pakar: 'Air → pH → Suhu → Kedalaman',
      catatan_revisi: 'Urutan prioritas berbeda dari sistem',
    },
    {
      kode_tanaman: 'T013',
      nama_pakar: 'Pakar 2',
      status_kesesuaian: 'sebagian_sesuai' as const,
      urutan_prioritas_pakar: 'Suhu → Air → pH → Kedalaman',
      catatan_revisi: 'Urutan prioritas berbeda dari sistem',
    },
    {
      kode_tanaman: 'T012',
      nama_pakar: 'Pakar 1',
      status_kesesuaian: 'sebagian_sesuai' as const,
      urutan_prioritas_pakar: 'Air → pH/ppm → Suhu → Kedalaman',
      catatan_revisi: null,
    },
    {
      kode_tanaman: 'T010',
      nama_pakar: 'Pakar 1',
      status_kesesuaian: 'tidak_sesuai' as const,
      urutan_prioritas_pakar: 'pH/Kesuburan → Air → Suhu → Kedalaman',
      catatan_revisi: 'Perlu revisi: pH harus jadi prioritas utama, bukan suhu/air',
    },
    {
      kode_tanaman: 'T009',
      nama_pakar: 'Pakar 2',
      status_kesesuaian: 'sebagian_sesuai' as const,
      urutan_prioritas_pakar: 'Air → pH → Suhu → Kedalaman',
      catatan_revisi: null,
    },
    {
      kode_tanaman: 'T013', // Validasi mentimun dari Pakar 2
      nama_pakar: 'Pakar 2 (Mentimun)',
      status_kesesuaian: 'sebagian_sesuai' as const,
      urutan_prioritas_pakar: 'Air → Suhu → pH → Kedalaman',
      catatan_revisi: null,
    },
    {
      kode_tanaman: 'T006',
      nama_pakar: 'Pakar 2',
      status_kesesuaian: 'sebagian_sesuai' as const,
      urutan_prioritas_pakar: 'Air → Suhu → pH → Kedalaman',
      catatan_revisi: null,
    },
    {
      kode_tanaman: 'T021',
      nama_pakar: 'Pakar 2',
      status_kesesuaian: 'sebagian_sesuai' as const,
      urutan_prioritas_pakar: 'Air → pH → Suhu → Kedalaman',
      catatan_revisi: null,
    },
    {
      kode_tanaman: 'T022',
      nama_pakar: 'Pakar 2',
      status_kesesuaian: 'sebagian_sesuai' as const,
      urutan_prioritas_pakar: 'Air → Suhu → Kedalaman → pH',
      catatan_revisi: null,
    },
  ];

  for (const v of validationsData) {
    await prisma.validasiPakar.create({ data: v });
  }

  console.log('Seeding crop rotation rules (RuleRotasi)...');
  const rotationRulesData = [
    // Empirical Rules (Pakar)
    { kode_tanaman_sebelum: 'T007', famili_target: 'Fabaceae', alasan_agronomis: 'Mengisi ulang unsur N tanah via fiksasi nitrogen rhizobium', sumber: 'pakar' as const },
    { kode_tanaman_sebelum: 'T016', famili_target: 'Fabaceae', alasan_agronomis: 'Memperbaiki aerasi tanah setelah masa tergenang', sumber: 'pakar' as const },
    { kode_tanaman_sebelum: 'T013', famili_target: 'Fabaceae', alasan_agronomis: 'Memutus siklus hama famili Cucurbitaceae + isi ulang N', sumber: 'pakar' as const },
    { kode_tanaman_sebelum: 'T012', famili_target: 'non-Brassicaceae', alasan_agronomis: 'Variasi famili, putus siklus hama', sumber: 'pakar' as const },
    { kode_tanaman_sebelum: 'T010', kode_tanaman_sesudah: 'T007', alasan_agronomis: 'Manfaatkan unsur N sisa dari legum sebelumnya', sumber: 'pakar' as const },
    { kode_tanaman_sebelum: 'T010', famili_target: 'Poaceae', alasan_agronomis: 'Manfaatkan unsur N sisa dari legum sebelumnya', sumber: 'pakar' as const },
    { kode_tanaman_sebelum: 'T009', kode_tanaman_sesudah: 'T012', alasan_agronomis: 'Variasi famili setelah legum', sumber: 'pakar' as const },
    { kode_tanaman_sebelum: 'T009', kode_tanaman_sesudah: 'T006', alasan_agronomis: 'Variasi famili setelah legum', sumber: 'pakar' as const },
    { kode_tanaman_sebelum: 'T009', kode_tanaman_sesudah: 'T021', alasan_agronomis: 'Variasi famili setelah legum', sumber: 'pakar' as const },
    { kode_tanaman_sebelum: 'T009', kode_tanaman_sesudah: 'T005', alasan_agronomis: 'Variasi famili setelah legum', sumber: 'pakar' as const },
    { kode_tanaman_sebelum: 'T006', kode_tanaman_sesudah: 'T009', alasan_agronomis: 'Isi ulang unsur N', sumber: 'pakar' as const },
    { kode_tanaman_sebelum: 'T021', famili_target: 'Fabaceae', alasan_agronomis: 'Sama seperti Cabai (famili Solanaceae sama)', sumber: 'pakar' as const },
    { kode_tanaman_sebelum: 'T022', kode_tanaman_sesudah: 'T010', alasan_agronomis: 'Singkong menguras hara berat → perlu pemulihan N atau rotasi non-umbi untuk cegah penumpukan penyakit', sumber: 'pakar' as const },
    { kode_tanaman_sebelum: 'T022', kode_tanaman_sesudah: 'T007', alasan_agronomis: 'Singkong menguras hara berat → perlu pemulihan N atau rotasi non-umbi untuk cegah penumpukan penyakit', sumber: 'pakar' as const },

    // Generalizations
    { kode_tanaman_sebelum: 'T001', famili_target: 'Fabaceae', alasan_agronomis: 'Inferensi famili: Bawang Merah/Putih dirotasikan dengan Legum untuk memulihkan kesuburan tanah', sumber: 'generalisasi_famili' as const },
    { kode_tanaman_sebelum: 'T001', famili_target: 'Solanaceae', alasan_agronomis: 'Inferensi famili: Bawang Merah/Putih dirotasikan dengan Solanaceae untuk memutus siklus patogen', sumber: 'generalisasi_famili' as const },
    { kode_tanaman_sebelum: 'T002', famili_target: 'Fabaceae', alasan_agronomis: 'Inferensi famili: Brokoli (Brassicaceae) dirotasikan ke Legum (T007/T008) untuk memutus siklus hama', sumber: 'generalisasi_famili' as const },
    { kode_tanaman_sebelum: 'T003', famili_target: 'Fabaceae', alasan_agronomis: 'Inferensi famili: Gandum (Poaceae) dirotasikan ke Legum untuk pengisian unsur nitrogen tanah', sumber: 'generalisasi_famili' as const },
    { kode_tanaman_sebelum: 'T004', famili_target: 'Fabaceae', alasan_agronomis: 'Inferensi famili: Tanaman umbi dirotasikan ke Legum untuk memulihkan tanah', sumber: 'generalisasi_famili' as const },
    { kode_tanaman_sebelum: 'T005', famili_target: 'Fabaceae', alasan_agronomis: 'Inferensi famili: Blewah/Tomat dirotasikan ke Legum untuk memutus siklus hama dan mengisi nitrogen', sumber: 'generalisasi_famili' as const },
    { kode_tanaman_sebelum: 'T008', famili_target: 'Poaceae', alasan_agronomis: 'Inferensi famili: Legum (Kacang Arab) dirotasikan ke Poaceae untuk memanfaatkan nitrogen sisa', sumber: 'generalisasi_famili' as const },
    { kode_tanaman_sebelum: 'T008', famili_target: 'Solanaceae', alasan_agronomis: 'Inferensi famili: Legum (Kacang Arab) dirotasikan ke Solanaceae untuk memanfaatkan nitrogen sisa', sumber: 'generalisasi_famili' as const },
    { kode_tanaman_sebelum: 'T011', famili_target: 'Fabaceae', alasan_agronomis: 'Inferensi famili: Kentang (Solanaceae) dirotasikan ke Legum untuk memutus siklus hama', sumber: 'generalisasi_famili' as const },
    { kode_tanaman_sebelum: 'T014', famili_target: 'Fabaceae', alasan_agronomis: 'Inferensi famili: Nanas dirotasikan ke Legum (umum berlaku secara agronomis)', sumber: 'generalisasi_famili' as const },
    { kode_tanaman_sebelum: 'T015', famili_target: 'Fabaceae', alasan_agronomis: 'Inferensi famili: Padi Gogo (Poaceae) dirotasikan ke Legum untuk memulihkan aerasi dan nitrogen', sumber: 'generalisasi_famili' as const },
    { kode_tanaman_sebelum: 'T017', famili_target: 'Fabaceae', alasan_agronomis: 'Inferensi famili: Pare (Cucurbitaceae) dirotasikan ke Legum untuk memutus siklus patogen', sumber: 'generalisasi_famili' as const },
    { kode_tanaman_sebelum: 'T018', famili_target: 'Fabaceae', alasan_agronomis: 'Inferensi famili: Semangka (Cucurbitaceae) dirotasikan ke Legum untuk memutus siklus patogen', sumber: 'generalisasi_famili' as const },
    { kode_tanaman_sebelum: 'T019', famili_target: 'Fabaceae', alasan_agronomis: 'Inferensi famili: Sorgum (Poaceae) dirotasikan ke Legum untuk mengembalikan nitrogen', sumber: 'generalisasi_famili' as const },
    { kode_tanaman_sebelum: 'T020', famili_target: 'Fabaceae', alasan_agronomis: 'Inferensi famili: Talas dirotasikan ke Legum untuk memulihkan hara', sumber: 'generalisasi_famili' as const },
  ];

  for (const r of rotationRulesData) {
    await prisma.ruleRotasi.create({ data: r });
  }

  console.log('Seeding hazard constraints (ConstraintRotasi)...');
  const constraintsData = [
    {
      famili_a: 'any',
      famili_b: 'any',
      jenis_larangan: 'famili_sama',
      alasan: 'Penumpukan hama/penyakit spesifik famili (cth. lalat buah, layu fusarium pada Cucurbitaceae)',
    },
    {
      famili_a: 'Fabaceae',
      famili_b: 'Fabaceae',
      jenis_larangan: 'sesama_legum',
      alasan: 'Bukan soal hama saja, tapi tidak ada manfaat tambahan isi ulang nitrogen; potensi penumpukan patogen akar',
    },
    {
      famili_a: 'Poaceae',
      famili_b: 'Poaceae',
      jenis_larangan: 'sesama_serealia',
      alasan: 'Hara makro (terutama N) terkuras dua kali tanpa pemulihan; risiko hama serealia menumpuk',
    },
  ];

  for (const con of constraintsData) {
    await prisma.constraintRotasi.create({ data: con });
  }

  console.log('Seeding rest interval parameters (JedaRotasi)...');
  const intervalData = [
    {
      kategori_tanaman: 'Sayuran daun/buah',
      jeda_minimum_hari: 7,
      jeda_maksimum_hari: 21,
      catatan_aktivitas: 'membersihkan sisa akar, membalik tanah, memberi pupuk dasar (kompos/kandang) agar hara pulih sebelum tanam ulang.',
    },
    {
      kategori_tanaman: 'Serealia',
      jeda_minimum_hari: 14,
      jeda_maksimum_hari: 30,
      catatan_aktivitas: 'membersihkan sisa akar, membalik tanah, memberi pupuk dasar (kompos/kandang) agar hara pulih sebelum tanam ulang.',
    },
    {
      kategori_tanaman: 'Default',
      jeda_minimum_hari: 14,
      jeda_maksimum_hari: 14,
      catatan_aktivitas: 'membersihkan sisa akar, membalik tanah, memberi pupuk dasar (kompos/kandang) agar hara pulih sebelum tanam ulang.',
    },
  ];

  for (const interval of intervalData) {
    await prisma.jedaRotasi.create({ data: interval });
  }

  console.log('Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

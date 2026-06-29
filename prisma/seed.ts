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
    { kode_tanaman: 'T001', nama_tanaman: 'Bawang Merah', famili_botani: 'Amaryllidaceae', kategori: 'Sayuran umbi', status_validasi: 'literatur', cf_akhir: 96.64 },
    { kode_tanaman: 'T002', nama_tanaman: 'Bawang Putih', famili_botani: 'Amaryllidaceae', kategori: 'Sayuran umbi', status_validasi: 'literatur', cf_akhir: 96.64 },
    { kode_tanaman: 'T003', nama_tanaman: 'Brokoli', famili_botani: 'Brassicaceae', kategori: 'Sayuran daun', status_validasi: 'literatur', cf_akhir: 96.64 },
    { kode_tanaman: 'T004', nama_tanaman: 'Gandum', famili_botani: 'Poaceae', kategori: 'Serealia', status_validasi: 'literatur', cf_akhir: 96.64 },
    { kode_tanaman: 'T005', nama_tanaman: 'Bit', famili_botani: 'Amaranthaceae', kategori: 'Sayuran umbi', status_validasi: 'literatur', cf_akhir: 97.48 },
    { kode_tanaman: 'T006', nama_tanaman: 'Wortel', famili_botani: 'Apiaceae', kategori: 'Sayuran umbi', status_validasi: 'literatur', cf_akhir: 97.48 },
    { kode_tanaman: 'T007', nama_tanaman: 'Blewah', famili_botani: 'Cucurbitaceae', kategori: 'Buah', status_validasi: 'literatur', cf_akhir: 93.28 },
    { kode_tanaman: 'T008', nama_tanaman: 'Tomat', famili_botani: 'Solanaceae', kategori: 'Sayuran buah', status_validasi: 'literatur', cf_akhir: 93.28 },
    { kode_tanaman: 'T009', nama_tanaman: 'Cabai Merah', famili_botani: 'Solanaceae', kategori: 'Sayuran buah', status_validasi: 'tervalidasi_pakar', cf_akhir: 96.64 },
    { kode_tanaman: 'T010', nama_tanaman: 'Kedelai', famili_botani: 'Fabaceae', kategori: 'Legum', status_validasi: 'tervalidasi_pakar', cf_akhir: 96.64 },
    { kode_tanaman: 'T011', nama_tanaman: 'Jagung', famili_botani: 'Poaceae', kategori: 'Serealia', status_validasi: 'tervalidasi_pakar', cf_akhir: 86.56 },
    { kode_tanaman: 'T012', nama_tanaman: 'Ubi Jalar', famili_botani: 'Convolvulaceae', kategori: 'Umbi', status_validasi: 'tervalidasi_pakar', cf_akhir: 86.56 },
    { kode_tanaman: 'T013', nama_tanaman: 'Kacang Arab (Chickpea)', famili_botani: 'Fabaceae', kategori: 'Legum', status_validasi: 'literatur', cf_akhir: 97.48 },
    { kode_tanaman: 'T014', nama_tanaman: 'Kacang Panjang', famili_botani: 'Fabaceae', kategori: 'Legum', status_validasi: 'tervalidasi_pakar', cf_akhir: 94.96 },
    { kode_tanaman: 'T015', nama_tanaman: 'Kacang Hijau', famili_botani: 'Fabaceae', kategori: 'Legum', status_validasi: 'tervalidasi_pakar', cf_akhir: 94.96 },
    { kode_tanaman: 'T016', nama_tanaman: 'Kacang Tanah', famili_botani: 'Fabaceae', kategori: 'Legum', status_validasi: 'tervalidasi_pakar', cf_akhir: 98.08 },
    { kode_tanaman: 'T017', nama_tanaman: 'Paprika', famili_botani: 'Solanaceae', kategori: 'Sayuran buah', status_validasi: 'tervalidasi_pakar', cf_akhir: 98.08 },
    { kode_tanaman: 'T018', nama_tanaman: 'Kentang', famili_botani: 'Solanaceae', kategori: 'Umbi', status_validasi: 'literatur', cf_akhir: 97.44 },
    { kode_tanaman: 'T019', nama_tanaman: 'Lobak', famili_botani: 'Brassicaceae', kategori: 'Sayuran umbi', status_validasi: 'tervalidasi_pakar', cf_akhir: 96.16 },
    { kode_tanaman: 'T020', nama_tanaman: 'Sawi', famili_botani: 'Brassicaceae', kategori: 'Sayuran daun', status_validasi: 'tervalidasi_pakar', cf_akhir: 96.16 },
    { kode_tanaman: 'T021', nama_tanaman: 'Melon', famili_botani: 'Cucurbitaceae', kategori: 'Buah', status_validasi: 'tervalidasi_pakar', cf_akhir: 84.64 },
    { kode_tanaman: 'T022', nama_tanaman: 'Mentimun', famili_botani: 'Cucurbitaceae', kategori: 'Sayuran buah', status_validasi: 'tervalidasi_pakar', cf_akhir: 84.64 },
    { kode_tanaman: 'T023', nama_tanaman: 'Nanas', famili_botani: 'Bromeliaceae', kategori: 'Buah', status_validasi: 'literatur', cf_akhir: 94.88 },
    { kode_tanaman: 'T024', nama_tanaman: 'Padi Gogo', famili_botani: 'Poaceae', kategori: 'Serealia', status_validasi: 'literatur', cf_akhir: 96.93 },
    { kode_tanaman: 'T025', nama_tanaman: 'Padi Tadah Hujan', famili_botani: 'Poaceae', kategori: 'Serealia', status_validasi: 'tervalidasi_pakar', cf_akhir: 89.25 },
    { kode_tanaman: 'T026', nama_tanaman: 'Padi Sawah', famili_botani: 'Poaceae', kategori: 'Serealia', status_validasi: 'tervalidasi_pakar', cf_akhir: 89.25 },
    { kode_tanaman: 'T027', nama_tanaman: 'Pare', famili_botani: 'Cucurbitaceae', kategori: 'Sayuran buah', status_validasi: 'literatur', cf_akhir: 96.16 },
    { kode_tanaman: 'T028', nama_tanaman: 'Semangka', famili_botani: 'Cucurbitaceae', kategori: 'Buah', status_validasi: 'literatur', cf_akhir: 93.86 },
    { kode_tanaman: 'T029', nama_tanaman: 'Sorgum', famili_botani: 'Poaceae', kategori: 'Serealia', status_validasi: 'literatur', cf_akhir: 94.62 },
    { kode_tanaman: 'T030', nama_tanaman: 'Talas', famili_botani: 'Araceae', kategori: 'Umbi', status_validasi: 'literatur', cf_akhir: 98.21 },
    { kode_tanaman: 'T031', nama_tanaman: 'Terong', famili_botani: 'Solanaceae', kategori: 'Sayuran buah', status_validasi: 'tervalidasi_pakar', cf_akhir: 84.64 },
    { kode_tanaman: 'T032', nama_tanaman: 'Singkong', famili_botani: 'Euphorbiaceae', kategori: 'Umbi', status_validasi: 'tervalidasi_pakar', cf_akhir: 96.16 },
  ] as const;

  for (const crop of cropsData) {
    await prisma.tanaman.create({ data: crop });
  }

  console.log('Seeding relation rules (RuleKriteria)...');
  const ruleKriteriaData = [
    { T001: ['K011', 'K008', 'K001', 'K006', 'K015'] }, // Bawang Merah
    { T002: ['K011', 'K008', 'K001', 'K006', 'K015'] }, // Bawang Putih
    { T003: ['K011', 'K008', 'K001', 'K006', 'K015'] }, // Brokoli
    { T004: ['K011', 'K008', 'K001', 'K006', 'K015'] }, // Gandum
    { T005: ['K011', 'K008', 'K001', 'K005', 'K014'] }, // Bit
    { T006: ['K011', 'K008', 'K001', 'K005', 'K014'] }, // Wortel
    { T007: ['K011', 'K008', 'K002', 'K006', 'K013'] }, // Blewah
    { T008: ['K011', 'K008', 'K002', 'K006', 'K013'] }, // Tomat
    { T009: ['K010', 'K009', 'K002', 'K007', 'K015'] }, // Cabai Merah
    { T010: ['K010', 'K009', 'K002', 'K007', 'K015'] }, // Kedelai
    { T011: ['K011', 'K009', 'K002', 'K007', 'K013'] }, // Jagung
    { T012: ['K011', 'K009', 'K002', 'K007', 'K013'] }, // Ubi Jalar
    { T013: ['K011', 'K009', 'K001', 'K005', 'K015'] }, // Kacang Arab
    { T014: ['K011', 'K009', 'K001', 'K005', 'K013'] }, // Kacang Panjang
    { T015: ['K011', 'K009', 'K001', 'K005', 'K013'] }, // Kacang Hijau
    { T016: ['K010', 'K009', 'K003', 'K004', 'K014'] }, // Kacang Tanah
    { T017: ['K010', 'K009', 'K003', 'K004', 'K014'] }, // Paprika
    { T018: ['K010', 'K009', 'K001', 'K004', 'K012'] }, // Kentang
    { T019: ['K010', 'K009', 'K001', 'K005', 'K012'] }, // Lobak
    { T020: ['K010', 'K009', 'K001', 'K005', 'K012'] }, // Sawi
    { T021: ['K010', 'K008', 'K002', 'K006', 'K013'] }, // Melon
    { T022: ['K010', 'K008', 'K002', 'K006', 'K013'] }, // Mentimun
    { T023: ['K010', 'K008', 'K002', 'K007', 'K012'] }, // Nanas
    { T024: ['K010', 'K008', 'K003', 'K005', 'K012'] }, // Padi Gogo
    { T025: ['K011', 'K009', 'K003', 'K006', 'K013'] }, // Padi Tadah Hujan
    { T026: ['K011', 'K009', 'K003', 'K006', 'K013'] }, // Padi Sawah
    { T027: ['K010', 'K008', 'K002', 'K007', 'K014'] }, // Pare
    { T028: ['K010', 'K008', 'K003', 'K006', 'K013'] }, // Semangka
    { T029: ['K011', 'K008', 'K003', 'K006', 'K013'] }, // Sorgum
    { T030: ['K011', 'K009', 'K003', 'K004', 'K012'] }, // Talas
    { T031: ['K010', 'K008', 'K001', 'K006', 'K013'] }, // Terong
    { T032: ['K010', 'K009', 'K002', 'K007', 'K012'] }, // Singkong
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
    { kode_tanaman: 'T011', nama_pakar: 'Pakar 1', status_kesesuaian: 'sesuai' as const, urutan_prioritas_pakar: 'Kesuburan/pH → Suhu → Air → Kedalaman tanah', catatan_revisi: 'Tidak ada revisi' }, // Jagung
    { kode_tanaman: 'T025', nama_pakar: 'Pakar 1', status_kesesuaian: 'sebagian_sesuai' as const, urutan_prioritas_pakar: 'Air → Suhu → pH', catatan_revisi: 'pH lebih toleran, bisa 5,5–6,5' }, // Padi Tadah Hujan
    { kode_tanaman: 'T026', nama_pakar: 'Pakar 1', status_kesesuaian: 'sebagian_sesuai' as const, urutan_prioritas_pakar: 'Air → Suhu → pH', catatan_revisi: 'pH lebih toleran, bisa 5,5–6,5' }, // Padi Sawah
    { kode_tanaman: 'T021', nama_pakar: 'Pakar 1', status_kesesuaian: 'sebagian_sesuai' as const, urutan_prioritas_pakar: 'Air → pH → Suhu → Kedalaman', catatan_revisi: 'Urutan prioritas berbeda dari sistem' }, // Melon
    { kode_tanaman: 'T022', nama_pakar: 'Pakar 1', status_kesesuaian: 'sebagian_sesuai' as const, urutan_prioritas_pakar: 'Air → pH → Suhu → Kedalaman', catatan_revisi: 'Urutan prioritas berbeda dari sistem' }, // Mentimun
    { kode_tanaman: 'T021', nama_pakar: 'Pakar 2', status_kesesuaian: 'sebagian_sesuai' as const, urutan_prioritas_pakar: 'Suhu → Air → pH → Kedalaman', catatan_revisi: 'Urutan prioritas berbeda dari sistem' }, // Melon
    { kode_tanaman: 'T022', nama_pakar: 'Pakar 2', status_kesesuaian: 'sebagian_sesuai' as const, urutan_prioritas_pakar: 'Suhu → Air → pH → Kedalaman', catatan_revisi: 'Urutan prioritas berbeda dari sistem' }, // Mentimun
    { kode_tanaman: 'T019', nama_pakar: 'Pakar 1', status_kesesuaian: 'sebagian_sesuai' as const, urutan_prioritas_pakar: 'Air → pH/ppm → Suhu → Kedalaman', catatan_revisi: null }, // Lobak
    { kode_tanaman: 'T020', nama_pakar: 'Pakar 1', status_kesesuaian: 'sebagian_sesuai' as const, urutan_prioritas_pakar: 'Air → pH/ppm → Suhu → Kedalaman', catatan_revisi: null }, // Sawi
    { kode_tanaman: 'T016', nama_pakar: 'Pakar 1', status_kesesuaian: 'tidak_sesuai' as const, urutan_prioritas_pakar: 'pH/Kesuburan → Air → Suhu → Kedalaman', catatan_revisi: 'Perlu revisi: pH harus jadi prioritas utama, bukan suhu/air' }, // Kacang Tanah
    { kode_tanaman: 'T017', nama_pakar: 'Pakar 1', status_kesesuaian: 'tidak_sesuai' as const, urutan_prioritas_pakar: 'pH/Kesuburan → Air → Suhu → Kedalaman', catatan_revisi: 'Perlu revisi: pH harus jadi prioritas utama, bukan suhu/air' }, // Paprika
    { kode_tanaman: 'T014', nama_pakar: 'Pakar 2', status_kesesuaian: 'sebagian_sesuai' as const, urutan_prioritas_pakar: 'Air → pH → Suhu → Kedalaman', catatan_revisi: null }, // Kacang Panjang
    { kode_tanaman: 'T015', nama_pakar: 'Pakar 2', status_kesesuaian: 'sebagian_sesuai' as const, urutan_prioritas_pakar: 'Air → pH → Suhu → Kedalaman', catatan_revisi: null }, // Kacang Hijau
    { kode_tanaman: 'T009', nama_pakar: 'Pakar 2', status_kesesuaian: 'sebagian_sesuai' as const, urutan_prioritas_pakar: 'Air → Suhu → pH → Kedalaman', catatan_revisi: null }, // Cabai Merah
    { kode_tanaman: 'T010', nama_pakar: 'Pakar 2', status_kesesuaian: 'sebagian_sesuai' as const, urutan_prioritas_pakar: 'Air → Suhu → pH → Kedalaman', catatan_revisi: null }, // Kedelai
    { kode_tanaman: 'T031', nama_pakar: 'Pakar 2', status_kesesuaian: 'sebagian_sesuai' as const, urutan_prioritas_pakar: 'Air → pH → Suhu → Kedalaman', catatan_revisi: null }, // Terong
    { kode_tanaman: 'T032', nama_pakar: 'Pakar 2', status_kesesuaian: 'sebagian_sesuai' as const, urutan_prioritas_pakar: 'Air → Suhu → Kedalaman → pH', catatan_revisi: null }, // Singkong
  ];

  for (const v of validationsData) {
    await prisma.validasiPakar.create({ data: v });
  }

  console.log('Seeding crop rotation rules (RuleRotasi)...');
  const rotationRulesData = [
    // Empirical Rules (Pakar)
    { kode_tanaman_sebelum: 'T011', famili_target: 'Fabaceae', alasan_agronomis: 'Mengisi ulang unsur N tanah via fiksasi nitrogen rhizobium', sumber: 'pakar' as const }, // Jagung
    { kode_tanaman_sebelum: 'T025', famili_target: 'Fabaceae', alasan_agronomis: 'Memperbaiki aerasi tanah setelah masa tergenang', sumber: 'pakar' as const }, // Padi Tadah Hujan
    { kode_tanaman_sebelum: 'T026', famili_target: 'Fabaceae', alasan_agronomis: 'Memperbaiki aerasi tanah setelah masa tergenang', sumber: 'pakar' as const }, // Padi Sawah
    { kode_tanaman_sebelum: 'T021', famili_target: 'Fabaceae', alasan_agronomis: 'Memutus siklus hama famili Cucurbitaceae + isi ulang N', sumber: 'pakar' as const }, // Melon
    { kode_tanaman_sebelum: 'T022', famili_target: 'Fabaceae', alasan_agronomis: 'Memutus siklus hama famili Cucurbitaceae + isi ulang N', sumber: 'pakar' as const }, // Mentimun
    { kode_tanaman_sebelum: 'T019', famili_target: 'non-Brassicaceae', alasan_agronomis: 'Variasi famili, putus siklus hama', sumber: 'pakar' as const }, // Lobak
    { kode_tanaman_sebelum: 'T020', famili_target: 'non-Brassicaceae', alasan_agronomis: 'Variasi famili, putus siklus hama', sumber: 'pakar' as const }, // Sawi
    { kode_tanaman_sebelum: 'T016', kode_tanaman_sesudah: 'T011', alasan_agronomis: 'Manfaatkan unsur N sisa dari legum sebelumnya', sumber: 'pakar' as const }, // Kacang Tanah -> Jagung
    { kode_tanaman_sebelum: 'T016', famili_target: 'Poaceae', alasan_agronomis: 'Manfaatkan unsur N sisa dari legum sebelumnya', sumber: 'pakar' as const },
    { kode_tanaman_sebelum: 'T014', kode_tanaman_sesudah: 'T019', alasan_agronomis: 'Variasi famili setelah legum', sumber: 'pakar' as const }, // Kacang Panjang -> Lobak
    { kode_tanaman_sebelum: 'T014', kode_tanaman_sesudah: 'T020', alasan_agronomis: 'Variasi famili setelah legum', sumber: 'pakar' as const }, // Kacang Panjang -> Sawi
    { kode_tanaman_sebelum: 'T014', kode_tanaman_sesudah: 'T009', alasan_agronomis: 'Variasi famili setelah legum', sumber: 'pakar' as const }, // Kacang Panjang -> Cabai
    { kode_tanaman_sebelum: 'T014', kode_tanaman_sesudah: 'T031', alasan_agronomis: 'Variasi famili setelah legum', sumber: 'pakar' as const }, // Kacang Panjang -> Terong
    { kode_tanaman_sebelum: 'T014', kode_tanaman_sesudah: 'T008', alasan_agronomis: 'Variasi famili setelah legum', sumber: 'pakar' as const }, // Kacang Panjang -> Tomat
    { kode_tanaman_sebelum: 'T009', kode_tanaman_sesudah: 'T014', alasan_agronomis: 'Isi ulang unsur N', sumber: 'pakar' as const }, // Cabai -> Kacang Panjang
    { kode_tanaman_sebelum: 'T009', kode_tanaman_sesudah: 'T015', alasan_agronomis: 'Isi ulang unsur N', sumber: 'pakar' as const }, // Cabai -> Kacang Hijau
    { kode_tanaman_sebelum: 'T009', kode_tanaman_sesudah: 'T016', alasan_agronomis: 'Isi ulang unsur N', sumber: 'pakar' as const }, // Cabai -> Kacang Tanah
    { kode_tanaman_sebelum: 'T031', famili_target: 'Fabaceae', alasan_agronomis: 'Sama seperti Cabai (famili Solanaceae sama)', sumber: 'pakar' as const }, // Terong -> Legum
    { kode_tanaman_sebelum: 'T032', kode_tanaman_sesudah: 'T016', alasan_agronomis: 'Singkong menguras hara berat → perlu pemulihan N or rotasi non-umbi', sumber: 'pakar' as const }, // Singkong -> Kacang Tanah
    { kode_tanaman_sebelum: 'T032', kode_tanaman_sesudah: 'T011', alasan_agronomis: 'Singkong menguras hara berat → perlu pemulihan N or rotasi non-umbi', sumber: 'pakar' as const }, // Singkong -> Jagung

    // Generalizations
    { kode_tanaman_sebelum: 'T001', famili_target: 'Fabaceae', alasan_agronomis: 'Bawang Merah dirotasikan dengan Legum untuk memulihkan kesuburan tanah', sumber: 'generalisasi_famili' as const },
    { kode_tanaman_sebelum: 'T001', famili_target: 'Solanaceae', alasan_agronomis: 'Bawang Merah dirotasikan dengan Solanaceae untuk memutus siklus patogen', sumber: 'generalisasi_famili' as const },
    { kode_tanaman_sebelum: 'T002', famili_target: 'Fabaceae', alasan_agronomis: 'Bawang Putih dirotasikan dengan Legum untuk memulihkan kesuburan tanah', sumber: 'generalisasi_famili' as const },
    { kode_tanaman_sebelum: 'T002', famili_target: 'Solanaceae', alasan_agronomis: 'Bawang Putih dirotasikan dengan Solanaceae untuk memutus siklus patogen', sumber: 'generalisasi_famili' as const },
    { kode_tanaman_sebelum: 'T003', famili_target: 'Fabaceae', alasan_agronomis: 'Brokoli (Brassicaceae) dirotasikan ke Legum untuk memutus siklus hama', sumber: 'generalisasi_famili' as const },
    { kode_tanaman_sebelum: 'T004', famili_target: 'Fabaceae', alasan_agronomis: 'Gandum (Poaceae) dirotasikan ke Legum untuk pengisian unsur nitrogen tanah', sumber: 'generalisasi_famili' as const },
    { kode_tanaman_sebelum: 'T005', famili_target: 'Fabaceae', alasan_agronomis: 'Tanaman umbi dirotasikan ke Legum untuk memulihkan tanah', sumber: 'generalisasi_famili' as const },
    { kode_tanaman_sebelum: 'T006', famili_target: 'Fabaceae', alasan_agronomis: 'Tanaman umbi dirotasikan ke Legum untuk memulihkan tanah', sumber: 'generalisasi_famili' as const },
    { kode_tanaman_sebelum: 'T007', famili_target: 'Fabaceae', alasan_agronomis: 'Blewah dirotasikan ke Legum untuk memutus siklus hama dan mengisi nitrogen', sumber: 'generalisasi_famili' as const },
    { kode_tanaman_sebelum: 'T008', famili_target: 'Fabaceae', alasan_agronomis: 'Tomat dirotasikan ke Legum untuk memutus siklus hama dan mengisi nitrogen', sumber: 'generalisasi_famili' as const },
    { kode_tanaman_sebelum: 'T013', famili_target: 'Poaceae', alasan_agronomis: 'Legum (Kacang Arab) dirotasikan ke Poaceae untuk memanfaatkan nitrogen sisa', sumber: 'generalisasi_famili' as const },
    { kode_tanaman_sebelum: 'T013', famili_target: 'Solanaceae', alasan_agronomis: 'Legum (Kacang Arab) dirotasikan ke Solanaceae untuk memanfaatkan nitrogen sisa', sumber: 'generalisasi_famili' as const },
    { kode_tanaman_sebelum: 'T018', famili_target: 'Fabaceae', alasan_agronomis: 'Kentang (Solanaceae) dirotasikan ke Legum untuk memutus siklus hama', sumber: 'generalisasi_famili' as const },
    { kode_tanaman_sebelum: 'T023', famili_target: 'Fabaceae', alasan_agronomis: 'Nanas dirotasikan ke Legum (umum berlaku secara agronomis)', sumber: 'generalisasi_famili' as const },
    { kode_tanaman_sebelum: 'T024', famili_target: 'Fabaceae', alasan_agronomis: 'Padi Gogo (Poaceae) dirotasikan ke Legum untuk memulihkan aerasi dan nitrogen', sumber: 'generalisasi_famili' as const },
    { kode_tanaman_sebelum: 'T027', famili_target: 'Fabaceae', alasan_agronomis: 'Pare (Cucurbitaceae) dirotasikan ke Legum untuk memutus siklus patogen', sumber: 'generalisasi_famili' as const },
    { kode_tanaman_sebelum: 'T028', famili_target: 'Fabaceae', alasan_agronomis: 'Semangka (Cucurbitaceae) dirotasikan ke Legum untuk memutus siklus patogen', sumber: 'generalisasi_famili' as const },
    { kode_tanaman_sebelum: 'T029', famili_target: 'Fabaceae', alasan_agronomis: 'Sorgum (Poaceae) dirotasikan ke Legum untuk mengembalikan nitrogen', sumber: 'generalisasi_famili' as const },
    { kode_tanaman_sebelum: 'T030', famili_target: 'Fabaceae', alasan_agronomis: 'Talas dirotasikan ke Legum untuk memulihkan hara', sumber: 'generalisasi_famili' as const },
  ];

  for (const r of rotationRulesData) {
    await prisma.ruleRotasi.create({ data: r });
  }

  console.log('Seeding hazard constraints (ConstraintRotasi)...');
  const constraintsData = [
    { famili_a: 'any', famili_b: 'any', jenis_larangan: 'famili_sama', alasan: 'Penumpukan hama/penyakit spesifik famili (cth. layu fusarium se-famili)' },
    { famili_a: 'Fabaceae', famili_b: 'Fabaceae', jenis_larangan: 'sesama_legum', alasan: 'Bukan soal hama saja, tapi tidak ada manfaat tambahan isi ulang nitrogen; potensi penumpukan patogen akar' },
    { famili_a: 'Poaceae', famili_b: 'Poaceae', jenis_larangan: 'sesama_serealia', alasan: 'Hara makro (terutama N) terkuras dua kali tanpa pemulihan; risiko hama serealia menumpuk' },
  ];

  for (const con of constraintsData) {
    await prisma.constraintRotasi.create({ data: con });
  }

  console.log('Seeding rest interval parameters (JedaRotasi)...');
  const intervalData = [
    { kategori_tanaman: 'Sayuran daun/buah', jeda_minimum_hari: 7, jeda_maksimum_hari: 21, catatan_aktivitas: 'membersihkan sisa akar, membalik tanah, memberi pupuk dasar (kompos/kandang) agar hara pulih sebelum tanam ulang.' },
    { kategori_tanaman: 'Serealia', jeda_minimum_hari: 14, jeda_maksimum_hari: 30, catatan_aktivitas: 'membersihkan sisa akar, membalik tanah, memberi pupuk dasar (kompos/kandang) agar hara pulih sebelum tanam ulang.' },
    { kategori_tanaman: 'Default', jeda_minimum_hari: 14, jeda_maksimum_hari: 14, catatan_aktivitas: 'membersihkan sisa akar, membalik tanah, memberi pupuk dasar (kompos/kandang) agar hara pulih sebelum tanam ulang.' },
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

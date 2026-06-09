# Seedule 🌱

Sistem Pakar Penjadwalan Rotasi Tanam Berdasarkan Bibit dan Kondisi Lahan Berbasis Web.

## 📖 Deskripsi Proyek
Seedule adalah aplikasi sistem pakar berbasis web yang dirancang untuk membantu petani mengoptimalkan pengelolaan lahan melalui rotasi tanaman yang tepat. Sistem ini menentukan urutan tanam berdasarkan ketersediaan bibit dari petani serta kondisi lahan awal (seperti pH tanah, tekstur, ketinggian, dan drainase).

## ✨ Fitur Utama
* **Filter Cerdas (*Forward Chaining*):** Mesin inferensi menelusuri aturan fakta kondisi lahan untuk menyaring bibit yang kompatibel dan mengeluarkan kandidat yang tidak cocok secara otomatis.
* **Tingkat Keyakinan (*Certainty Factor*):** Mengkalkulasi dan menampilkan nilai kepastian (skala 0 hingga 1) untuk setiap rekomendasi tanaman yang diberikan kepada pengguna.
* **Pembaruan Lahan Dinamis:** Memperbarui estimasi kondisi tanah (seperti perubahan N-total dan pH) secara otomatis setelah satu siklus tanam ditetapkan, sebagai acuan untuk rekomendasi siklus berikutnya.
* **Output Jadwal Komprehensif:** Menghasilkan jadwal rotasi lengkap yang mencakup urutan tanam, nilai kepastian, alasan rekomendasi, dan estimasi kondisi tanah pada setiap fase yang dapat diekspor ke PDF.
* **Tanpa Instalasi:** Antarmuka responsif dan ramah pengguna yang dapat diakses langsung melalui peramban web dari berbagai perangkat.

## 🛠️ Tech Stack
* **Backend & Mesin Inferensi:** PHP (Laravel).
* **Frontend:** React TS (Vite).
* **Database:** PostgreSQL (menyimpan basis pengetahuan, aturan CF, dan riwayat konsultasi).

## ⚙️ Alur Kerja Sistem
1. **Input:** Pengguna memasukkan parameter kondisi lahan awal dan memilih minimal 2 daftar bibit yang tersedia.
2. **Penyaringan:** Sistem menggunakan *Forward Chaining* untuk memfilter bibit yang sesuai dengan lahan awal.
3. **Kalkulasi:** Menghitung nilai *Certainty Factor* untuk bibit yang berhasil lolos filter.
4. **Penetapan & Pembaruan:** Merekomendasikan tanaman dengan nilai CF tertinggi sebagai tanaman pertama, kemudian meng-*update* kondisi tanah berdasarkan efek rotasi tanaman tersebut.
5. **Perulangan:** Mengulang proses inferensi dan kalkulasi untuk sisa bibit menggunakan estimasi kondisi tanah yang baru diperbarui.
6. **Hasil Akhir:** Menampilkan visualisasi jadwal rotasi secara lengkap.

---
**Dikembangkan oleh:** Kelompok 12
| NIM | Nama |
| :--- | :--- |
| L0124080 | Velengio Deriksen Charles |
| L0124084 | Ahmad Aditya Nugraha |
| L0124087 | Andika Bahari Suryanegara |

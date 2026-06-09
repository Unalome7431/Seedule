# Seedule 🌱

Sistem Pakar Penjadwalan Rotasi Tanam Berdasarkan Bibit dan Kondisi Lahan Berbasis Web[cite: 1]. Proyek ini dikembangkan berdasarkan dokumen rancangan sistem pada "Projek AI.pdf"[cite: 1].

## 📖 Deskripsi Proyek
Seedule adalah aplikasi sistem pakar berbasis web yang dirancang untuk membantu petani mengoptimalkan pengelolaan lahan melalui rotasi tanaman yang tepat[cite: 1]. Sistem ini menentukan urutan tanam berdasarkan ketersediaan bibit dari petani serta kondisi lahan awal (seperti pH tanah, tekstur, ketinggian, dan drainase)[cite: 1]. 

## ✨ Fitur Utama
* **Filter Cerdas (*Forward Chaining*):** Mesin inferensi menelusuri aturan fakta kondisi lahan untuk menyaring bibit yang kompatibel dan mengeluarkan kandidat yang tidak cocok secara otomatis[cite: 1].
* **Tingkat Keyakinan (*Certainty Factor*):** Mengkalkulasi dan menampilkan nilai kepastian (skala 0 hingga 1) untuk setiap rekomendasi tanaman yang diberikan kepada pengguna[cite: 1].
* **Pembaruan Lahan Dinamis:** Memperbarui estimasi kondisi tanah (seperti perubahan N-total dan pH) secara otomatis setelah satu siklus tanam ditetapkan, sebagai acuan untuk rekomendasi siklus berikutnya[cite: 1].
* **Output Jadwal Komprehensif:** Menghasilkan jadwal rotasi lengkap yang mencakup urutan tanam, nilai kepastian, alasan rekomendasi, dan estimasi kondisi tanah pada setiap fase yang dapat diekspor ke PDF[cite: 1].
* **Tanpa Instalasi:** Antarmuka responsif dan ramah pengguna yang dapat diakses langsung melalui peramban web dari berbagai perangkat[cite: 1].

## 🛠️ Tech Stack
* **Backend & Mesin Inferensi:** PHP (Laravel)[cite: 1].
* **Frontend:** HTML, CSS, dan Bootstrap[cite: 1].
* **Database:** MySQL (menyimpan basis pengetahuan, aturan CF, dan riwayat konsultasi)[cite: 1].

## ⚙️ Alur Kerja Sistem
1. **Input:** Pengguna memasukkan parameter kondisi lahan awal dan memilih minimal 2 daftar bibit yang tersedia[cite: 1].
2. **Penyaringan:** Sistem menggunakan *Forward Chaining* untuk memfilter bibit yang sesuai dengan lahan awal[cite: 1].
3. **Kalkulasi:** Menghitung nilai *Certainty Factor* untuk bibit yang berhasil lolos filter[cite: 1].
4. **Penetapan & Pembaruan:** Merekomendasikan tanaman dengan nilai CF tertinggi sebagai tanaman pertama, kemudian meng-*update* kondisi tanah berdasarkan efek rotasi tanaman tersebut[cite: 1].
5. **Perulangan:** Mengulang proses inferensi dan kalkulasi untuk sisa bibit menggunakan estimasi kondisi tanah yang baru diperbarui[cite: 1].
6. **Hasil Akhir:** Menampilkan visualisasi jadwal rotasi secara lengkap[cite: 1].

---
**Dikembangkan oleh:** Kelompok 12
|NIM|NAMA|
|L0124080|Velengio Deriksen Charles|
|L0124084|Ahmad Aditya Nugraha|
|L0124087|Andika Bahari Suryanegara|

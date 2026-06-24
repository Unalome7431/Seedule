/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "StatusValidasiTanaman" AS ENUM ('tervalidasi_pakar', 'estimasi_famili', 'literatur');

-- CreateEnum
CREATE TYPE "StatusKesesuaianPakar" AS ENUM ('sesuai', 'sebagian_sesuai', 'tidak_sesuai');

-- CreateEnum
CREATE TYPE "SumberRuleRotasi" AS ENUM ('pakar', 'generalisasi_famili', 'literatur');

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kriteria" (
    "kode_kriteria" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "bobot_cf" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "kriteria_pkey" PRIMARY KEY ("kode_kriteria")
);

-- CreateTable
CREATE TABLE "tanaman" (
    "kode_tanaman" TEXT NOT NULL,
    "nama_tanaman" TEXT NOT NULL,
    "famili_botani" TEXT NOT NULL,
    "kategori" TEXT NOT NULL,
    "status_validasi" "StatusValidasiTanaman" NOT NULL,
    "cf_akhir" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "tanaman_pkey" PRIMARY KEY ("kode_tanaman")
);

-- CreateTable
CREATE TABLE "rule_kriteria" (
    "id" SERIAL NOT NULL,
    "kode_tanaman" TEXT NOT NULL,
    "kode_kriteria" TEXT NOT NULL,

    CONSTRAINT "rule_kriteria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "validasi_pakar" (
    "id" SERIAL NOT NULL,
    "kode_tanaman" TEXT NOT NULL,
    "nama_pakar" TEXT NOT NULL,
    "status_kesesuaian" "StatusKesesuaianPakar" NOT NULL,
    "urutan_prioritas_pakar" TEXT NOT NULL,
    "catatan_revisi" TEXT,

    CONSTRAINT "validasi_pakar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rule_rotasi" (
    "id" SERIAL NOT NULL,
    "kode_tanaman_sebelum" TEXT NOT NULL,
    "kode_tanaman_sesudah" TEXT,
    "famili_target" TEXT,
    "alasan_agronomis" TEXT NOT NULL,
    "sumber" "SumberRuleRotasi" NOT NULL,

    CONSTRAINT "rule_rotasi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "constraint_rotasi" (
    "id" SERIAL NOT NULL,
    "famili_a" TEXT NOT NULL,
    "famili_b" TEXT NOT NULL,
    "jenis_larangan" TEXT NOT NULL,
    "alasan" TEXT NOT NULL,

    CONSTRAINT "constraint_rotasi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jeda_rotasi" (
    "id" SERIAL NOT NULL,
    "kategori_tanaman" TEXT NOT NULL,
    "jeda_minimum_hari" INTEGER NOT NULL,
    "jeda_maksimum_hari" INTEGER NOT NULL,
    "catatan_aktivitas" TEXT,

    CONSTRAINT "jeda_rotasi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "riwayat_konsultasi" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "input_kondisi_lahan" JSONB NOT NULL,
    "tanaman_sebelumnya" TEXT,
    "hasil_rekomendasi" JSONB NOT NULL,

    CONSTRAINT "riwayat_konsultasi_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "rule_kriteria_kode_tanaman_kode_kriteria_key" ON "rule_kriteria"("kode_tanaman", "kode_kriteria");

-- AddForeignKey
ALTER TABLE "rule_kriteria" ADD CONSTRAINT "rule_kriteria_kode_tanaman_fkey" FOREIGN KEY ("kode_tanaman") REFERENCES "tanaman"("kode_tanaman") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rule_kriteria" ADD CONSTRAINT "rule_kriteria_kode_kriteria_fkey" FOREIGN KEY ("kode_kriteria") REFERENCES "kriteria"("kode_kriteria") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "validasi_pakar" ADD CONSTRAINT "validasi_pakar_kode_tanaman_fkey" FOREIGN KEY ("kode_tanaman") REFERENCES "tanaman"("kode_tanaman") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rule_rotasi" ADD CONSTRAINT "rule_rotasi_kode_tanaman_sebelum_fkey" FOREIGN KEY ("kode_tanaman_sebelum") REFERENCES "tanaman"("kode_tanaman") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rule_rotasi" ADD CONSTRAINT "rule_rotasi_kode_tanaman_sesudah_fkey" FOREIGN KEY ("kode_tanaman_sesudah") REFERENCES "tanaman"("kode_tanaman") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "riwayat_konsultasi" ADD CONSTRAINT "riwayat_konsultasi_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

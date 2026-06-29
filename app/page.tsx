import React from "react";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import DashboardClient from "@/components/DashboardClient";
import { HistoryItem } from "@/components/HistoryList";
import { CatalogCrop } from "@/components/Mode3Catalog";

export default async function Page() {
  const session = await auth();

  let historyItems: HistoryItem[] = [];
  let catalogCrops: CatalogCrop[] = [];

  // Query all crops and their relationships for the catalog and recommendation list
  try {
    const crops = await db.tanaman.findMany({
      include: {
        ruleKriteria: {
          include: {
            kriteria: true,
          },
        },
        rulesSebelum: true,
        validasiPakar: true,
      },
      orderBy: {
        kode_tanaman: "asc",
      },
    });

    catalogCrops = crops.map((crop) => {
      const kriteriaList = crop.ruleKriteria.map(
        (rk) => `${rk.kriteria.deskripsi} (${rk.kode_kriteria})`
      );

      const rekomendasiRotasi = crop.rulesSebelum.map((rule) => {
        if (rule.kode_tanaman_sesudah) {
          return `${rule.kode_tanaman_sesudah} (${rule.alasan_agronomis})`;
        }
        return `${rule.famili_target} (${rule.alasan_agronomis})`;
      });

      const revisiCatatan = crop.validasiPakar[0]?.catatan_revisi || null;

      return {
        kode_tanaman: crop.kode_tanaman,
        nama_tanaman: crop.nama_tanaman,
        famili_botani: crop.famili_botani,
        kategori: crop.kategori,
        status_validasi: crop.status_validasi,
        cf_akhir: crop.cf_akhir,
        kriteriaList,
        rekomendasiRotasi,
        revisiCatatan,
      };
    });
  } catch (error) {
    console.error("Failed to fetch crops database catalog:", error);
  }

  // If user is logged in, query history logs from PostgreSQL via Prisma
  if (session?.user?.email) {
    try {
      const dbUser = await db.user.findUnique({
        where: { email: session.user.email }
      });
      if (dbUser) {
        const dbHistory = await db.riwayatKonsultasi.findMany({
          where: { user_id: dbUser.id },
          orderBy: { timestamp: "desc" },
          take: 15, // Limit to 15 items in sidebar for performance
        });

        historyItems = dbHistory.map((item) => {
          const isRotasi = !!item.tanaman_sebelumnya;
          const inputLahan = item.input_kondisi_lahan as any;
          const title = inputLahan?.namaKonsultasi || (isRotasi ? `Rotasi ${item.tanaman_sebelumnya}` : "Analisis Kesesuaian");
          
          // Parse input conditions for description summary
          let summary = "Evaluasi kesesuaian lahan";
          if (isRotasi) {
            summary = `Rencana rotasi pasca ${item.tanaman_sebelumnya}`;
          }

          return {
            id: String(item.id),
            type: isRotasi ? "rotasi" : "lahan",
            title,
            timestamp: item.timestamp,
            summary,
          };
        });
      }
    } catch (error) {
      console.error("Failed to fetch user history from database:", error);
    }
  }

  return (
    <DashboardClient
      session={session}
      initialHistoryItems={historyItems}
      crops={catalogCrops}
    />
  );
}


import React from "react";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import DashboardClient from "@/components/DashboardClient";
import { HistoryItem } from "@/components/HistoryList";

export default async function Page() {
  const session = await auth();

  let historyItems: HistoryItem[] = [];

  // If user is logged in, query history logs from PostgreSQL via Prisma
  if (session?.user?.id) {
    try {
      const dbHistory = await db.riwayatKonsultasi.findMany({
        where: { user_id: session.user.id },
        orderBy: { timestamp: "desc" },
        take: 15, // Limit to 15 items in sidebar for performance
      });

      historyItems = dbHistory.map((item) => {
        const isRotasi = !!item.tanaman_sebelumnya;
        
        // Parse input conditions for description summary
        let summary = "Evaluasi kesesuaian lahan";
        if (isRotasi) {
          summary = `Rencana rotasi pasca ${item.tanaman_sebelumnya}`;
        }

        return {
          id: String(item.id),
          type: isRotasi ? "rotasi" : "lahan",
          title: isRotasi ? `Rotasi ${item.tanaman_sebelumnya}` : "Analisis Kesesuaian",
          timestamp: item.timestamp,
          summary,
        };
      });
    } catch (error) {
      console.error("Failed to fetch user history from database:", error);
    }
  }

  return (
    <DashboardClient
      session={session}
      initialHistoryItems={historyItems}
    />
  );
}

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { recommendRotasi } from "@/lib/engine";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const body = await req.json();
    const { namaKonsultasi, tanamanSebelumList, cycles, lahan, historyId } = body;

    if (!tanamanSebelumList || !Array.isArray(tanamanSebelumList) || tanamanSebelumList.length === 0) {
      return NextResponse.json(
        { success: false, error: "Missing or invalid previous crop list" },
        { status: 400 }
      );
    }

    const cyclesCount = cycles ? parseInt(cycles) : 1;
    const result = await recommendRotasi(tanamanSebelumList, lahan || null, cyclesCount);

    if (result.error) {
      return NextResponse.json({
        success: false,
        error: result.error,
        rejectedCrops: result.rejectedCrops
      }, { status: 400 });
    }

    // Save to database riwayat_konsultasi if the user is authenticated
    if (session?.user?.email) {
      const dbUser = await db.user.findUnique({
        where: { email: session.user.email }
      });
      if (dbUser) {
        const lastCrop = tanamanSebelumList[tanamanSebelumList.length - 1];
        const inputLahanData = lahan ? { ...lahan, namaKonsultasi } : { namaKonsultasi };
        const hasilRekomendasi = {
          warnings: result.warnings,
          recommendations: result.recommendations,
          rejectedCrops: result.rejectedCrops || [],
          tanamanSebelumList,
          cycles: cyclesCount,
        };
        const idNum = historyId && typeof historyId === "string" && !historyId.startsWith("hist-") ? parseInt(historyId) : NaN;

        if (!isNaN(idNum)) {
          const existing = await db.riwayatKonsultasi.findUnique({ where: { id: idNum } });
          if (existing && existing.user_id === dbUser.id) {
            await db.riwayatKonsultasi.update({
              where: { id: idNum },
              data: {
                input_kondisi_lahan: inputLahanData,
                tanaman_sebelumnya: lastCrop,
                hasil_rekomendasi: hasilRekomendasi,
              }
            });
          } else {
            await db.riwayatKonsultasi.create({
              data: {
                user_id: dbUser.id,
                input_kondisi_lahan: inputLahanData,
                tanaman_sebelumnya: lastCrop,
                hasil_rekomendasi: hasilRekomendasi,
              },
            });
          }
        } else {
          await db.riwayatKonsultasi.create({
            data: {
              user_id: dbUser.id,
              input_kondisi_lahan: inputLahanData,
              tanaman_sebelumnya: lastCrop,
              hasil_rekomendasi: hasilRekomendasi,
            },
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      warnings: result.warnings,
      recommendations: result.recommendations,
      rejectedCrops: result.rejectedCrops || [],
    });
  } catch (error: any) {
    console.error("API Rotasi Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

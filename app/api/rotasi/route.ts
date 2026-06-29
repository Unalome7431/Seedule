import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { recommendRotasi } from "@/lib/engine";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const body = await req.json();
    const { namaKonsultasi, tanamanSebelumList, cycles, lahan } = body;

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

        await db.riwayatKonsultasi.create({
          data: {
            user_id: dbUser.id,
            input_kondisi_lahan: lahan ? { ...lahan, namaKonsultasi } : { namaKonsultasi },
            tanaman_sebelumnya: lastCrop,
            hasil_rekomendasi: {
              warnings: result.warnings,
              recommendations: result.recommendations,
              rejectedCrops: result.rejectedCrops || [],
              tanamanSebelumList,
              cycles: cyclesCount,
            },
          },
        });
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

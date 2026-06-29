import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { evaluateLahanKesesuaian } from "@/lib/engine";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const body = await req.json();
    const { namaKonsultasi, suhu, air, kedalaman, kejenuhan, ph } = body;

    if (!suhu || !air || !kedalaman || !kejenuhan || !ph) {
      return NextResponse.json(
        { success: false, error: "Missing required land criteria parameters" },
        { status: 400 }
      );
    }

    const crops = await evaluateLahanKesesuaian({ suhu, air, kedalaman, kejenuhan, ph });

    // Save to database riwayat_konsultasi if the user is authenticated
    if (session?.user?.email) {
      const dbUser = await db.user.findUnique({
        where: { email: session.user.email }
      });
      if (dbUser) {
        await db.riwayatKonsultasi.create({
          data: {
            user_id: dbUser.id,
            input_kondisi_lahan: { suhu, air, kedalaman, kejenuhan, ph, namaKonsultasi },
            tanaman_sebelumnya: null,
            hasil_rekomendasi: crops,
          },
        });
      }
    }

    return NextResponse.json({ success: true, crops });
  } catch (error: any) {
    console.error("API Lahan Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

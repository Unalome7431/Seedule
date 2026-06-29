import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const idNum = parseInt(id);
    if (isNaN(idNum)) {
      return NextResponse.json(
        { success: false, error: "Invalid history ID" },
        { status: 400 }
      );
    }

    const riwayat = await db.riwayatKonsultasi.findUnique({
      where: { id: idNum },
    });

    if (!riwayat) {
      return NextResponse.json(
        { success: false, error: "History record not found" },
        { status: 404 }
      );
    }

    // Ensure the authenticated user owns this history record
    let dbUserId: string | null = null;
    if (session?.user?.email) {
      const dbUser = await db.user.findUnique({
        where: { email: session.user.email }
      });
      if (dbUser) {
        dbUserId = dbUser.id;
      }
    }

    if (!dbUserId || riwayat.user_id !== dbUserId) {
      return NextResponse.json(
        { success: false, error: "Forbidden access" },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true, data: riwayat });
  } catch (error: any) {
    console.error("API Riwayat GET Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

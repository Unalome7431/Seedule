"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import Sidebar from "@/components/Sidebar";
import Drawer from "@/components/Drawer";
import FloatingMenuButton from "@/components/FloatingMenuButton";
import Mode1Form from "@/components/Mode1Form";
import Mode2Form from "@/components/Mode2Form";
import Mode3Catalog, { CatalogCrop } from "@/components/Mode3Catalog";
import { HistoryItem } from "@/components/HistoryList";

// Static database of the 22 crops from knowledge_base.md
const MOCK_CROPS: CatalogCrop[] = [
  { kode_tanaman: "T001", nama_tanaman: "Bawang Merah, Bawang Putih", famili_botani: "Amaryllidaceae", kategori: "Sayuran umbi", status_validasi: "literatur", cf_akhir: 96.64 },
  { kode_tanaman: "T002", nama_tanaman: "Brokoli", famili_botani: "Brassicaceae", kategori: "Sayuran daun", status_validasi: "literatur", cf_akhir: 96.64 },
  { kode_tanaman: "T003", nama_tanaman: "Gandum", famili_botani: "Poaceae", kategori: "Serealia", status_validasi: "literatur", cf_akhir: 96.64 },
  { kode_tanaman: "T004", nama_tanaman: "Bit, Wortel", famili_botani: "Amaranthaceae / Apiaceae", kategori: "Sayuran umbi", status_validasi: "literatur", cf_akhir: 97.48 },
  { kode_tanaman: "T005", nama_tanaman: "Blewah, Tomat Buah, Tomat Sayur", famili_botani: "Cucurbitaceae / Solanaceae", kategori: "Buah & sayuran buah", status_validasi: "literatur", cf_akhir: 93.28 },
  { kode_tanaman: "T006", nama_tanaman: "Cabai Merah, Kedelai", famili_botani: "Solanaceae / Fabaceae", kategori: "Sayuran buah & legum", status_validasi: "tervalidasi_pakar", cf_akhir: 96.64 },
  { kode_tanaman: "T007", nama_tanaman: "Jagung, Ubi Jalar", famili_botani: "Poaceae / Convolvulaceae", kategori: "Serealia & umbi", status_validasi: "tervalidasi_pakar", cf_akhir: 86.56 },
  { kode_tanaman: "T008", nama_tanaman: "Kacang Arab (Chickpea)", famili_botani: "Fabaceae", kategori: "Legum", status_validasi: "literatur", cf_akhir: 97.48 },
  { kode_tanaman: "T009", nama_tanaman: "Kacang Panjang, Kacang Hijau", famili_botani: "Fabaceae", kategori: "Legum", status_validasi: "tervalidasi_pakar", cf_akhir: 94.96 },
  { kode_tanaman: "T010", nama_tanaman: "Kacang Tanah, Paprika", famili_botani: "Fabaceae / Solanaceae", kategori: "Legum & sayuran buah", status_validasi: "tervalidasi_pakar", cf_akhir: 98.08, revisiCatatan: "Perlu revisi: pH harus jadi prioritas utama, bukan suhu/air" },
  { kode_tanaman: "T011", nama_tanaman: "Kentang", famili_botani: "Solanaceae", kategori: "Umbi", status_validasi: "literatur", cf_akhir: 97.44 },
  { kode_tanaman: "T012", nama_tanaman: "Lobak, Sawi", famili_botani: "Brassicaceae", kategori: "Sayuran umbi/daun", status_validasi: "tervalidasi_pakar", cf_akhir: 96.16 },
  { kode_tanaman: "T013", nama_tanaman: "Melon, Mentimun", famili_botani: "Cucurbitaceae", kategori: "Buah & sayuran buah", status_validasi: "tervalidasi_pakar", cf_akhir: 84.64 },
  { kode_tanaman: "T014", nama_tanaman: "Nanas", famili_botani: "Bromeliaceae", kategori: "Buah", status_validasi: "literatur", cf_akhir: 94.88 },
  { kode_tanaman: "T015", nama_tanaman: "Padi Gogo", famili_botani: "Poaceae", kategori: "Serealia (lahan kering)", status_validasi: "literatur", cf_akhir: 96.93 },
  { kode_tanaman: "T016", nama_tanaman: "Padi Tadah Hujan, Padi Sawah", famili_botani: "Poaceae", kategori: "Serealia", status_validasi: "tervalidasi_pakar", cf_akhir: 89.25 },
  { kode_tanaman: "T017", nama_tanaman: "Pare", famili_botani: "Cucurbitaceae", kategori: "Sayuran buah", status_validasi: "literatur", cf_akhir: 96.16 },
  { kode_tanaman: "T018", nama_tanaman: "Semangka", famili_botani: "Cucurbitaceae", kategori: "Buah", status_validasi: "literatur", cf_akhir: 93.86 },
  { kode_tanaman: "T019", nama_tanaman: "Sorgum", famili_botani: "Poaceae", kategori: "Serealia", status_validasi: "literatur", cf_akhir: 94.62 },
  { kode_tanaman: "T020", nama_tanaman: "Talas", famili_botani: "Araceae", kategori: "Umbi", status_validasi: "literatur", cf_akhir: 98.21 },
  { kode_tanaman: "T021", nama_tanaman: "Terong", famili_botani: "Solanaceae", kategori: "Sayuran buah", status_validasi: "tervalidasi_pakar", cf_akhir: 84.64 },
  { kode_tanaman: "T022", nama_tanaman: "Singkong", famili_botani: "Euphorbiaceae", kategori: "Umbi", status_validasi: "tervalidasi_pakar", cf_akhir: 96.16 },
];

interface DashboardClientProps {
  session: { user?: { name?: string | null; email?: string | null; id?: string } } | null;
  initialHistoryItems: HistoryItem[];
  crops: CatalogCrop[];
}

export const DashboardClient: React.FC<DashboardClientProps> = ({
  session,
  initialHistoryItems = [],
  crops = [],
}) => {
  const router = useRouter();

  // Navigation & layout states
  const [view, setView] = useState<"lahan" | "rotasi" | "katalog">("lahan");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // History state initialized with database logs
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>(initialHistoryItems);
  const [activeHistoryId, setActiveHistoryId] = useState<string | undefined>(undefined);
  const [activeHistoryData, setActiveHistoryData] = useState<any>(null);

  React.useEffect(() => {
    setHistoryItems(initialHistoryItems);
  }, [initialHistoryItems]);

  // API response and loading states
  const [lahanResult, setLahanResult] = useState<any>(null);
  const [lahanLoading, setLahanLoading] = useState(false);

  const [rotasiResult, setRotasiResult] = useState<any>(null);
  const [rotasiLoading, setRotasiLoading] = useState(false);

  // Handle submissions via REST API endpoints
  const handleLahanSubmit = async (data: any) => {
    setLahanLoading(true);
    setLahanResult(null);
    const historyId = activeHistoryId;
    if (!historyId) {
      setActiveHistoryId(undefined);
      setActiveHistoryData(null);
    }
    try {
      const res = await fetch("/api/lahan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, historyId }),
      });
      const resData = await res.json();
      if (resData.success) {
        setLahanResult(resData);
        // Refresh server component to fetch latest DB history
        if (session?.user?.email) {
          router.refresh();
          if (historyId) {
            setActiveHistoryData({
              id: historyId,
              input_kondisi_lahan: data,
              hasil_rekomendasi: resData.crops,
            });
          }
        } else {
          // If not authenticated, store result directly in client state history
          const newItem: HistoryItem = {
            id: `hist-local-${Date.now()}`,
            type: "lahan",
            title: data.namaKonsultasi || "Analisis Lahan",
            timestamp: new Date(),
            summary: `Evaluasi kesesuaian: ${resData.crops?.length || 0} tanaman cocok`,
            resultData: {
              input_kondisi_lahan: data,
              hasil_rekomendasi: resData.crops,
            },
          };
          setHistoryItems([newItem, ...historyItems]);
          setActiveHistoryId(newItem.id);
          setActiveHistoryData(newItem.resultData);
        }
      } else {
        alert("Gagal memproses data: " + resData.error);
      }
    } catch (error: any) {
      console.error(error);
      alert("Terjadi kesalahan sistem: " + error.message);
    } finally {
      setLahanLoading(false);
    }
  };

  const handleRotasiSubmit = async (data: any) => {
    setRotasiLoading(true);
    setRotasiResult(null);
    const historyId = activeHistoryId;
    if (!historyId) {
      setActiveHistoryId(undefined);
      setActiveHistoryData(null);
    }
    try {
      const res = await fetch("/api/rotasi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, historyId }),
      });
      const resData = await res.json();
      if (resData.success) {
        setRotasiResult(resData);
        // Refresh server component to fetch latest DB history
        if (session?.user?.email) {
          router.refresh();
          if (historyId) {
            setActiveHistoryData({
              id: historyId,
              input_kondisi_lahan: data.lahan ? { ...data.lahan, namaKonsultasi: data.namaKonsultasi } : { namaKonsultasi: data.namaKonsultasi },
              tanaman_sebelumnya: data.tanamanSebelumList[data.tanamanSebelumList.length - 1],
              hasil_rekomendasi: {
                warnings: resData.warnings,
                recommendations: resData.recommendations,
                rejectedCrops: resData.rejectedCrops || [],
                tanamanSebelumList: data.tanamanSebelumList,
                cycles: data.tanamanSebelumList.length,
              },
            });
          }
        } else {
          // If not authenticated, store result directly in client state history
          const list = data.tanamanSebelumList || [];
          const summary = `Rencana ${list.length} siklus (${list.join(" → ")})`;

          const newItem: HistoryItem = {
            id: `hist-local-${Date.now()}`,
            type: "rotasi",
            title: data.namaKonsultasi || "Rencana Rotasi",
            timestamp: new Date(),
            summary,
            resultData: {
              input_kondisi_lahan: data.lahan ? { ...data.lahan, namaKonsultasi: data.namaKonsultasi } : { namaKonsultasi: data.namaKonsultasi },
              tanaman_sebelumnya: list[list.length - 1],
              hasil_rekomendasi: {
                warnings: resData.warnings,
                recommendations: resData.recommendations,
                rejectedCrops: resData.rejectedCrops || [],
                tanamanSebelumList: list,
                cycles: list.length,
              },
            },
          };
          setHistoryItems([newItem, ...historyItems]);
          setActiveHistoryId(newItem.id);
          setActiveHistoryData(newItem.resultData);
        }
      } else {
        alert("Gagal memproses data: " + resData.error);
      }
    } catch (error: any) {
      console.error(error);
      alert("Terjadi kesalahan sistem: " + error.message);
    } finally {
      setRotasiLoading(false);
    }
  };

  const handleSelectHistory = async (item: HistoryItem) => {
    setActiveHistoryId(item.id);
    setView(item.type);
    setIsDrawerOpen(false);

    // Reset current UI results
    setLahanResult(null);
    setRotasiResult(null);

    // If local/simulated history item
    if (item.id.startsWith("hist-local-") || item.id.startsWith("hist-sim-")) {
      setActiveHistoryData(item.resultData);
      if (item.type === "lahan") {
        setLahanResult({ crops: item.resultData.hasil_rekomendasi });
      } else {
        setRotasiResult(item.resultData.hasil_rekomendasi);
      }
    } else {
      // Database query for historic item
      try {
        if (item.type === "lahan") {
          setLahanLoading(true);
        } else {
          setRotasiLoading(true);
        }
        const res = await fetch(`/api/riwayat/${item.id}`);
        const resData = await res.json();
        if (resData.success) {
          setActiveHistoryData(resData.data);
          if (item.type === "lahan") {
            setLahanResult({ crops: resData.data.hasil_rekomendasi });
          } else {
            const hasil = resData.data.hasil_rekomendasi;
            setRotasiResult({
              warnings: hasil.warnings,
              recommendations: hasil.recommendations,
              rejectedCrops: hasil.rejectedCrops || [],
            });
          }
        }
      } catch (error) {
        console.error("Failed to load history logs details:", error);
      } finally {
        setLahanLoading(false);
        setRotasiLoading(false);
      }
    }
  };

  const handleLoginClick = () => {
    router.push("/login");
  };

  const handleLogoutClick = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      {/* Floating Menu Button for Mobile */}
      <FloatingMenuButton onClick={() => setIsDrawerOpen(true)} />

      {/* Sidebar: Desktop */}
      <Sidebar
        currentView={view}
        onViewChange={setView}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        historyItems={historyItems}
        activeHistoryId={activeHistoryId}
        onSelectHistory={handleSelectHistory}
        userSession={session?.user || null}
        onLoginClick={handleLoginClick}
        onLogoutClick={handleLogoutClick}
      />

      {/* Drawer: Mobile / Tablet */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        currentView={view}
        onViewChange={setView}
        historyItems={historyItems}
        activeHistoryId={activeHistoryId}
        onSelectHistory={handleSelectHistory}
        userSession={session?.user || null}
        onLoginClick={handleLoginClick}
        onLogoutClick={handleLogoutClick}
      />

      {/* Main Workspace Frame */}
      <div className="flex flex-1 flex-col h-full overflow-hidden">
        {/* Content Panel */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-sage-50/20 pt-16 md:pt-6">
          {view === "lahan" && (
            <Mode1Form
              onSubmit={handleLahanSubmit}
              isLoading={lahanLoading}
              result={lahanResult}
              initialInputs={activeHistoryId && activeHistoryData && !activeHistoryData.tanaman_sebelumnya ? activeHistoryData.input_kondisi_lahan : null}
            />
          )}

          {view === "rotasi" && (
            <Mode2Form
              onSubmit={handleRotasiSubmit}
              cropsList={crops}
              isLoading={rotasiLoading}
              result={rotasiResult}
              initialInputs={activeHistoryId && activeHistoryData && activeHistoryData.tanaman_sebelumnya ? { lahan: activeHistoryData.input_kondisi_lahan, tanamanSebelumList: activeHistoryData.hasil_rekomendasi?.tanamanSebelumList || [] } : null}
            />
          )}

          {view === "katalog" && (
            <Mode3Catalog crops={crops} />
          )}
        </main>
      </div>
    </div>
  );
};
export default DashboardClient;

"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Drawer from "@/components/Drawer";
import Mode1Form from "@/components/Mode1Form";
import Mode2Form from "@/components/Mode2Form";
import Mode3Catalog, { CatalogCrop } from "@/components/Mode3Catalog";
import { HistoryItem } from "@/components/HistoryList";

// Static mock database of the 22 crops from knowledge_base.md
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

export default function Home() {
  // Navigation & layout states
  const [view, setView] = useState<"lahan" | "rotasi" | "katalog">("lahan");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Mock Session
  const [session, setSession] = useState<{ name: string; email: string } | null>({
    name: "Pak Tani Makmur",
    email: "tani.makmur@seedule.id",
  });

  // Mock History data
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([
    {
      id: "hist-1",
      type: "lahan",
      title: "Konsultasi Lahan Poaceae",
      timestamp: new Date(2026, 5, 23, 10, 30),
      summary: "Kecocokan Kacang Tanah (T010) - CF 98.08%",
    },
    {
      id: "hist-2",
      type: "rotasi",
      title: "Rotasi Jagung (T007)",
      timestamp: new Date(2026, 5, 22, 14, 15),
      summary: "Rotasi ke Fabaceae (Legum) - Jeda 14 hari",
    },
  ]);
  const [activeHistoryId, setActiveHistoryId] = useState<string | undefined>(undefined);

  // Form submission placeholders
  const handleLahanSubmit = (data: any) => {
    console.log("Mode 1 submitted data:", data);
    // Add to history list dynamically for interactive mockup feel
    const newItem: HistoryItem = {
      id: `hist-${Date.now()}`,
      type: "lahan",
      title: `Lahan pH ${data.ph === "K014" ? "Masam" : "Normal"}`,
      timestamp: new Date(),
      summary: "Hasil evaluasi kondisi kriteria kecocokan",
    };
    setHistoryItems([newItem, ...historyItems]);
    setActiveHistoryId(newItem.id);
  };

  const handleRotasiSubmit = (data: any) => {
    console.log("Mode 2 submitted data:", data);
    const selectedCropName = MOCK_CROPS.find(c => c.kode_tanaman === data.tanamanSebelum)?.nama_tanaman || "Tanaman";
    const newItem: HistoryItem = {
      id: `hist-${Date.now()}`,
      type: "rotasi",
      title: `Rotasi ${selectedCropName.split(",")[0]}`,
      timestamp: new Date(),
      summary: `Rencana ${data.cycles} siklus rotasi tanam`,
    };
    setHistoryItems([newItem, ...historyItems]);
    setActiveHistoryId(newItem.id);
  };

  const handleSelectHistory = (item: HistoryItem) => {
    setActiveHistoryId(item.id);
    setView(item.type);
    setIsDrawerOpen(false);
  };

  const handleLogin = () => {
    setSession({
      name: "Pak Tani Makmur",
      email: "tani.makmur@seedule.id",
    });
  };

  const handleLogout = () => {
    setSession(null);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      {/* Sidebar: Desktop */}
      <Sidebar
        currentView={view}
        onViewChange={setView}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        historyItems={historyItems}
        activeHistoryId={activeHistoryId}
        onSelectHistory={handleSelectHistory}
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
      />

      {/* Main Workspace Frame */}
      <div className="flex flex-1 flex-col h-full overflow-hidden">
        {/* Header */}
        <Header
          currentView={view}
          userSession={session}
          onMenuClick={() => setIsDrawerOpen(true)}
          onLoginClick={handleLogin}
          onLogoutClick={handleLogout}
        />

        {/* Content Panel */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-sage-50/20">
          {view === "lahan" && (
            <Mode1Form onSubmit={handleLahanSubmit} />
          )}

          {view === "rotasi" && (
            <Mode2Form
              onSubmit={handleRotasiSubmit}
              cropsList={MOCK_CROPS}
            />
          )}

          {view === "katalog" && (
            <Mode3Catalog crops={MOCK_CROPS} />
          )}
        </main>
      </div>
    </div>
  );
}

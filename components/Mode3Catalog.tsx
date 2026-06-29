import React, { useState } from "react";
import { Search, Sprout, BookOpen, ShieldCheck, X, Check, ArrowRight, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CatalogCrop {
  kode_tanaman: string;
  nama_tanaman: string;
  famili_botani: string;
  kategori: string;
  status_validasi: "tervalidasi_pakar" | "estimasi_famili" | "literatur";
  cf_akhir: number;
  // Optional relations populated from database
  kriteriaList?: string[];
  rekomendasiRotasi?: string[];
  revisiCatatan?: string | null;
}

interface Mode3CatalogProps {
  crops: CatalogCrop[];
  isLoading?: boolean;
}

export const Mode3Catalog: React.FC<Mode3CatalogProps> = ({
  crops = [],
  isLoading = false,
}) => {
  const [search, setSearch] = useState("");
  const [selectedCrop, setSelectedCrop] = useState<CatalogCrop | null>(null);

  // Filter crops by search query
  const filteredCrops = crops.filter(
    (crop) =>
      crop.nama_tanaman.toLowerCase().includes(search.toLowerCase()) ||
      crop.kode_tanaman.toLowerCase().includes(search.toLowerCase()) ||
      crop.famili_botani.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Search Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-5 rounded-2xl border border-sage-200 shadow-sm">
        <div>
          <h2 className="text-base font-bold text-sage-950 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary-600" />
            Katalog Referensi Komoditas
          </h2>
          <p className="text-xs text-sage-500 mt-1 font-sans">
            Cari data botanikal, kriteria lahan optimal, dan hasil wawancara pakar untuk 32 komoditas pertanian.
          </p>
        </div>

        {/* Search Input bar */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-sage-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari tanaman, kode, famili..."
            className="w-full text-sm rounded-xl border border-sage-200 bg-sage-50/20 pl-10 pr-4 py-2.5 text-sage-800 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 transition-all duration-200"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="bg-white p-16 rounded-2xl border border-sage-200 shadow-sm flex flex-col items-center justify-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="text-sm text-sage-500">Memuat data referensi tanaman...</p>
        </div>
      ) : filteredCrops.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-dashed border-sage-200 text-center">
          <p className="text-sm text-sage-500">Tidak ada komoditas tanaman yang cocok dengan pencarian.</p>
        </div>
      ) : (
        /* Crops Grid list */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCrops.map((crop) => {
            const isPakar = crop.status_validasi === "tervalidasi_pakar";
            const isEstimasi = crop.status_validasi === "estimasi_famili";

            return (
              <button
                key={crop.kode_tanaman}
                onClick={() => setSelectedCrop(crop)}
                className="bg-white p-5 rounded-2xl border border-sage-200 hover:border-primary-300 hover:shadow-md transition-all duration-300 text-left flex flex-col justify-between group cursor-pointer"
              >
                <div className="space-y-3 w-full">
                  {/* Top: Code */}
                  <div className="flex justify-between items-center w-full">
                    <span className="text-[10px] font-bold bg-sage-100 text-sage-600 px-2.5 py-1 rounded-lg uppercase tracking-wider">
                      {crop.kode_tanaman}
                    </span>
                  </div>

                  {/* Name and botanical details */}
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-sage-900 leading-tight group-hover:text-primary-700 transition-colors line-clamp-1">
                      {crop.nama_tanaman}
                    </h3>
                    <span className="text-[11px] text-sage-500 font-semibold block italic">
                      {crop.famili_botani}
                    </span>
                  </div>

                  {/* Badges */}
                  <div className="flex gap-1.5 items-center flex-wrap">

                    <span className="text-[9px] bg-sage-50 text-sage-500 px-2 py-0.5 rounded-full font-medium">
                      {crop.kategori}
                    </span>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-sage-100 flex items-center justify-between w-full text-xs font-semibold text-primary-600 group-hover:text-primary-700 transition-colors">
                  <span>Lihat Detail Lahan & Rotasi</span>
                  <ArrowRight className="w-4 h-4 translate-x-0 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Modal Detail Crops */}
      {selectedCrop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl border border-sage-200 shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-slideUp"
          >
            {/* Modal Header */}
            <div className="flex h-16 items-center justify-between px-6 border-b border-sage-200 bg-sage-50/50">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold bg-primary-100 text-primary-700 px-2 py-0.5 rounded-md">
                  {selectedCrop.kode_tanaman}
                </span>
                <h3 className="text-base font-bold text-sage-900 truncate">
                  {selectedCrop.nama_tanaman}
                </h3>
              </div>
              <button
                onClick={() => setSelectedCrop(null)}
                className="p-1.5 rounded-full text-sage-500 hover:bg-sage-100 hover:text-sage-900 transition-colors focus:outline-none"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Botanical Grid card */}
              <div className="grid grid-cols-2 gap-4 bg-sage-50 p-4 rounded-xl border border-sage-100/80">
                <div>
                  <span className="text-[10px] text-sage-500 font-bold uppercase tracking-wider block">Famili Botani</span>
                  <span className="text-sm font-semibold text-sage-800 italic block mt-0.5">{selectedCrop.famili_botani}</span>
                </div>
                <div>
                  <span className="text-[10px] text-sage-500 font-bold uppercase tracking-wider block">Kategori</span>
                  <span className="text-sm font-semibold text-sage-800 block mt-0.5">{selectedCrop.kategori}</span>
                </div>
              </div>

              {/* Ideal Growth Criteria */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-sage-700 uppercase tracking-wider">Kriteria Lahan Paling Optimal (Sistem)</h4>
                <div className="bg-white border border-sage-200 rounded-xl divide-y divide-sage-100">
                  {selectedCrop.kriteriaList ? (
                    selectedCrop.kriteriaList.map((crit, idx) => (
                      <div key={idx} className="p-3 flex items-center gap-2.5 text-xs text-sage-700">
                        <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span>{crit}</span>
                      </div>
                    ))
                  ) : (
                    // Fallback visual mock criteria
                    ["Suhu 15–20°C (K001)", "Ketersediaan air 500–800 mm (K006)", "Kedalaman tanah > 50 cm (K008)", "Kejenuhan basa > 50% (K011)", "pH 7.1–7.9 (K015)"].map((crit, idx) => (
                      <div key={idx} className="p-3 flex items-center gap-2.5 text-xs text-sage-700">
                        <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span>{crit}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>



              {/* Rotation Recommendations */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-sage-700 uppercase tracking-wider">Saran Pasca-Panen (Rotasi)</h4>
                <div className="p-4 rounded-xl border border-sage-200 bg-slate-50/30">
                  <div className="flex gap-2">
                    <Info className="w-4.5 h-4.5 text-sage-500 flex-shrink-0 mt-0.5" />
                    <div className="text-xs text-sage-700 leading-relaxed space-y-1 font-sans">
                      <p>
                        <strong>Rotasi yang Direkomendasikan:</strong>
                      </p>
                      <p className="mt-1 text-sage-600">
                        {selectedCrop.rekomendasiRotasi ? (
                          selectedCrop.rekomendasiRotasi.join(", ")
                        ) : (
                          "Disarankan dirotasi dengan tanaman dari famili Legum (Fabaceae seperti Kacang Tanah, Kacang Panjang) untuk memulihkan kadar Nitrogen tanah."
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-sage-200 bg-sage-50/50 flex justify-end">
              <button
                onClick={() => setSelectedCrop(null)}
                className="rounded-xl border border-sage-300 bg-white px-4 py-2 text-xs font-bold text-sage-700 hover:bg-sage-50 transition-colors focus:outline-none cursor-pointer"
              >
                Tutup Referensi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Mode3Catalog;

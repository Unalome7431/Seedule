import React, { useState } from "react";
import { RefreshCw, ArrowRight, AlertTriangle, Info, Calendar, Sprout, ShieldAlert, CheckCircle, Plus, Trash2, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface Mode2FormProps {
  onSubmit: (data: any) => void;
  cropsList: Array<{ kode_tanaman: string; nama_tanaman: string; famili_botani: string }>;
  isLoading?: boolean;
  result?: any;
}

export const Mode2Form: React.FC<Mode2FormProps> = ({
  onSubmit,
  cropsList = [],
  isLoading = false,
  result,
}) => {
  const [namaKonsultasi, setNamaKonsultasi] = useState("");
  const [selectedCrops, setSelectedCrops] = useState<string[]>([]);
  const [currentCrop, setCurrentCrop] = useState("");
  const [cycles, setCycles] = useState("1");
  const [showLahan, setShowLahan] = useState(false);

  // Optional land states
  const [suhu, setSuhu] = useState("");
  const [air, setAir] = useState("");
  const [kedalaman, setKedalaman] = useState("");
  const [kejenuhan, setKejenuhan] = useState("");
  const [ph, setPh] = useState("");

  const handleAddCrop = () => {
    if (!currentCrop) return;
    if (selectedCrops.includes(currentCrop)) {
      alert("Tanaman ini sudah ditambahkan ke urutan rotasi!");
      return;
    }
    setSelectedCrops([...selectedCrops, currentCrop]);
    setCurrentCrop("");
  };

  const handleRemoveCrop = (kode: string) => {
    setSelectedCrops(selectedCrops.filter((c) => c !== kode));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaKonsultasi.trim()) {
      alert("Harap isi nama konsultasi!");
      return;
    }
    if (selectedCrops.length === 0) {
      alert("Harap tambahkan minimal satu tanaman sebelum!");
      return;
    }
    onSubmit({
      namaKonsultasi: namaKonsultasi.trim(),
      tanamanSebelumList: selectedCrops,
      cycles: parseInt(cycles),
      lahan: showLahan ? { suhu, air, kedalaman, kejenuhan, ph } : null,
    });
  };

  // Mock outputs for layout preview
  const mockRotations = [
    {
      sumber: "pakar",
      rekomendasi: "Poaceae (Kacang Tanah, Kacang Panjang, dst.)",
      nama_tanaman: "Kacang Tanah, Paprika (T010)",
      alasan: "Mengisi ulang unsur Nitrogen (N) tanah secara alami melalui fiksasi bakteri Rhizobium setelah penanaman Jagung.",
      jeda: "14 - 30 Hari",
      jedaCatatan: "Bersihkan sisa akar jagung, balik tanah untuk aerasi, tambahkan pupuk kandang/dasar.",
      tingkatKepercayaan: "Tervalidasi Pakar"
    }
  ];

  const mockWarnings = [
    {
      jenis: "famili_sama",
      title: "Risiko Tinggi: Rotasi Sefamili",
      desc: "Menanam tanaman dari famili Poaceae (seperti Jagung -> Padi) secara berurutan berisiko tinggi menguras unsur Nitrogen tanah secara drastis serta memicu penumpukan hama penggerek batang spesifik.",
      mitigasi: "Disarankan memberikan jeda istirahat minimal 1 bulan penuh, melakukan pembajakan tanah yang dalam, dan memberikan pupuk dasar dengan kadar Nitrogen tinggi."
    }
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Introduction Banner */}
      <div className="bg-gradient-to-br from-sage-100 to-primary-50 p-6 rounded-2xl border border-sage-200 shadow-sm">
        <h2 className="text-lg font-bold text-sage-950 flex items-center gap-2">
          <RefreshCw className="w-5 h-5 text-primary-600 animate-spin-slow" />
          Rencana Rotasi Tanam & Mitigasi Penyakit
        </h2>
        <p className="text-sm text-sage-600 mt-2 leading-relaxed font-sans">
          Tambahkan komoditas tanaman yang baru saja dipanen atau dalam urutan rotasi lahan Anda. Sistem akan mendeteksi kecocokan dan risiko tanaman secara berurutan.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Form Input Card */}
        <form onSubmit={handleSubmit} className="lg:col-span-5 bg-white p-6 rounded-2xl border border-sage-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-sage-800 uppercase tracking-wider mb-2">Parameter Rotasi</h3>

          {/* Conversation Name Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-sage-700 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-sage-400" />
              Nama Rencana Rotasi
            </label>
            <input
              type="text"
              value={namaKonsultasi}
              onChange={(e) => setNamaKonsultasi(e.target.value)}
              placeholder="cth. Rotasi Kebun Sayur Barat"
              className="w-full text-sm rounded-xl border border-sage-200 bg-sage-50/30 p-3 text-sage-800 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 transition-all duration-200"
              required
            />
          </div>

          {/* Plant Before selection */}
          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-sage-700">
                Tanaman Sebelumnya / Histori Tanam (Berurutan)
              </label>
              <div className="flex gap-2 min-w-0">
                <select
                  value={currentCrop}
                  onChange={(e) => setCurrentCrop(e.target.value)}
                  className="flex-1 min-w-0 text-sm rounded-xl border border-sage-200 bg-sage-50/30 p-3 text-sage-800 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 transition-all duration-200"
                >
                  <option value="">Pilih Tanaman...</option>
                  {cropsList.map((crop) => (
                    <option key={crop.kode_tanaman} value={crop.kode_tanaman}>
                      {crop.kode_tanaman} - {crop.nama_tanaman.split(",")[0]} ({crop.famili_botani.split("/")[0].trim()})
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleAddCrop}
                  className="h-11 w-11 flex-shrink-0 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold flex items-center justify-center cursor-pointer transition-colors shadow-sm focus:outline-none"
                  title="Tambah Tanaman"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Selected Plants Tags List */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-sage-400 uppercase tracking-wider block">Daftar Kode Tanaman Terpilih:</span>
              {selectedCrops.length === 0 ? (
                <div className="p-3 text-center border border-dashed border-sage-200 rounded-xl bg-sage-50/20 text-xs text-sage-400">
                  Belum ada tanaman terpilih. Tambahkan tanaman di atas.
                </div>
              ) : (
                <div className="flex flex-wrap gap-2 pt-1">
                  {selectedCrops.map((kode) => {
                    const cropObj = cropsList.find((c) => c.kode_tanaman === kode);
                    const displayName = cropObj ? `${kode} - ${cropObj.nama_tanaman.split(",")[0]}` : kode;
                    return (
                      <div
                        key={kode}
                        className="flex items-center gap-1.5 pl-3 pr-1.5 py-1.5 bg-primary-50 rounded-xl border border-primary-100 text-xs"
                      >
                        <span className="font-bold text-primary-750">
                          {displayName}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveCrop(kode)}
                          className="text-primary-400 hover:text-red-650 p-0.5 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Cycle Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-sage-700">
              Rencana Jumlah Siklus ke Depan
            </label>
            <div className="grid grid-cols-3 gap-2">
              {["1", "2", "3"].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setCycles(num)}
                  className={cn(
                    "p-2.5 text-sm font-bold rounded-xl border transition-all duration-200 cursor-pointer",
                    cycles === num
                      ? "bg-primary-600 text-white border-primary-600 shadow-sm shadow-primary-600/10"
                      : "bg-sage-50/30 border-sage-200 text-sage-600 hover:bg-sage-100/50"
                  )}
                >
                  {num} Siklus
                </button>
              ))}
            </div>
          </div>

          {/* Optional Land Conditions Toggle */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setShowLahan(!showLahan)}
              className="text-xs font-bold text-primary-600 hover:text-primary-700 transition-colors flex items-center gap-1 cursor-pointer focus:outline-none"
            >
              {showLahan ? "Sembunyikan Kondisi Lahan (Opsional)" : "Sesuaikan Kondisi Lahan Saat Ini (Opsional)"}
            </button>
          </div>

          {showLahan && (
            <div className="space-y-3 pt-2 border-t border-sage-100 animate-fadeIn">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-sage-500">Suhu Rata-Rata</label>
                <select
                  value={suhu}
                  onChange={(e) => setSuhu(e.target.value)}
                  className="w-full text-xs rounded-lg border border-sage-200 bg-sage-50/30 p-2 text-sage-700 focus:outline-none"
                >
                  <option value="">Default pasca-panen...</option>
                  <option value="K001">15–20°C</option>
                  <option value="K002">21–25°C</option>
                  <option value="K003">26–32°C</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-sage-500">Ketersediaan Air</label>
                <select
                  value={air}
                  onChange={(e) => setAir(e.target.value)}
                  className="w-full text-xs rounded-lg border border-sage-200 bg-sage-50/30 p-2 text-sage-700 focus:outline-none"
                >
                  <option value="">Default pasca-panen...</option>
                  <option value="K004">50–200 mm</option>
                  <option value="K005">200–500 mm</option>
                  <option value="K006">500–800 mm</option>
                  <option value="K007">800–1300 mm</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-sage-500">pH Tanah</label>
                <select
                  value={ph}
                  onChange={(e) => setPh(e.target.value)}
                  className="w-full text-xs rounded-lg border border-sage-200 bg-sage-50/30 p-2 text-sage-700 focus:outline-none"
                >
                  <option value="">Default pasca-panen...</option>
                  <option value="K014">5.0–5.9</option>
                  <option value="K012">6.0–6.5</option>
                  <option value="K013">6.6–7.0</option>
                  <option value="K015">7.1–7.9</option>
                </select>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-primary-600 p-3 text-sm font-semibold text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-primary-600/10 disabled:opacity-50"
          >
            {isLoading ? "Menghitung..." : "Rancang Rotasi Tanam"}
          </button>
        </form>

        {/* Output Panel Skeletons */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-sm font-bold text-sage-800 uppercase tracking-wider px-1">Rekomendasi Rotasi & Risiko</h3>

          {isLoading ? (
            <div className="bg-white p-12 rounded-2xl border border-sage-200 shadow-sm flex flex-col items-center justify-center space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <p className="text-sm text-sage-500">Mengevaluasi aturan rotasi & jeda waktu...</p>
            </div>
          ) : result ? (
            // Full UI output here in Phase 4
            <div className="bg-white p-5 rounded-2xl border border-sage-200">
              {/* Actual results */}
            </div>
          ) : (
            // Render Skeleton / Mock data to showcase the design
            <div className="space-y-4">
              <div className="bg-sage-100/40 p-4 rounded-xl border border-dashed border-sage-300 text-center">
                <p className="text-xs text-sage-500">
                  Berikut contoh rancangan rekomendasi dan deteksi risiko sistem:
                </p>
              </div>

              {/* Warnings / Hazards Box */}
              {mockWarnings.map((warn, i) => (
                <div
                  key={i}
                  className="bg-amber-50/50 p-5 rounded-2xl border border-amber-200 shadow-sm space-y-2 relative overflow-hidden"
                >
                  {/* Subtle Accent line */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500" />
                  
                  <h4 className="text-sm font-bold text-amber-900 flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-amber-600" />
                    {warn.title}
                  </h4>
                  <p className="text-xs text-amber-700 leading-relaxed font-sans">
                    {warn.desc}
                  </p>
                  <div className="pt-2 border-t border-amber-200/50 mt-2">
                    <span className="text-[10px] font-bold text-amber-800 uppercase block tracking-wider">Mitigasi Lahan:</span>
                    <p className="text-xs text-amber-600 mt-1 font-sans">
                      {warn.mitigasi}
                    </p>
                  </div>
                </div>
              ))}

              {/* Recommendation Card */}
              {mockRotations.map((rot, index) => (
                <div key={index} className="bg-white p-5 rounded-2xl border border-sage-200 shadow-sm space-y-4">
                  {/* Title and Trust Tag */}
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <span className="text-[10px] font-bold text-sage-400 uppercase tracking-wider block">Rekomendasi Utama</span>
                      <h4 className="text-base font-bold text-sage-900 mt-0.5">{rot.nama_tanaman}</h4>
                      <span className="text-xs text-sage-500 font-semibold">{rot.rekomendasi}</span>
                    </div>
                  </div>

                  {/* Agronomic Alasan */}
                  <div className="bg-sage-50 p-4 rounded-xl border border-sage-100/80">
                    <div className="flex gap-2">
                      <Info className="w-4 h-4 text-sage-500 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-sage-700 leading-relaxed font-sans">
                        <strong className="text-sage-800">Alasan Agronomis:</strong> {rot.alasan}
                      </p>
                    </div>
                  </div>

                  {/* Rest Interval Parameters */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2">
                    <div className="sm:col-span-4 bg-primary-50/40 border border-primary-100 p-3 rounded-xl flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-primary-600" />
                      <div>
                        <span className="text-[10px] text-sage-500 font-medium block leading-none">Jeda Istirahat</span>
                        <span className="text-sm font-extrabold text-primary-700 block mt-1">{rot.jeda}</span>
                      </div>
                    </div>

                    <div className="sm:col-span-8 bg-sage-50/40 border border-sage-200/60 p-3 rounded-xl">
                      <span className="text-[10px] text-sage-500 font-bold block">Aktivitas Lahan Disarankan:</span>
                      <p className="text-xs text-sage-600 mt-1 font-sans line-clamp-2">
                        {rot.jedaCatatan}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Mode2Form;

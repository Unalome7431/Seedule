import React, { useState } from "react";
import { Thermometer, Droplet, Layers, Compass, Percent, Sprout, ShieldCheck, FileText, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Mode1FormProps {
  onSubmit: (data: any) => void;
  isLoading?: boolean;
  result?: any;
}

export const Mode1Form: React.FC<Mode1FormProps> = ({
  onSubmit,
  isLoading = false,
  result,
}) => {
  // Input states
  const [namaKonsultasi, setNamaKonsultasi] = useState("");
  const [suhu, setSuhu] = useState("");
  const [air, setAir] = useState("");
  const [kedalaman, setKedalaman] = useState("");
  const [kejenuhan, setKejenuhan] = useState("");
  const [ph, setPh] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaKonsultasi.trim()) {
      alert("Harap isi nama konsultasi!");
      return;
    }
    if (!suhu || !air || !kedalaman || !kejenuhan || !ph) {
      alert("Harap isi semua kriteria lahan!");
      return;
    }
    onSubmit({ namaKonsultasi: namaKonsultasi.trim(), suhu, air, kedalaman, kejenuhan, ph });
  };

  // Mock result for UI skeleton if none provided
  const mockCrops = [
    {
      kode: "T010",
      nama: "Kacang Tanah, Paprika",
      famili: "Poaceae / Convolvulaceae",
      kategori: "Legum & sayuran buah",
      cf: 98.08,
      status: "tervalidasi_pakar",
      pakar: "Pakar 1",
      alasan: "Sangat optimal pada kondisi pH asam sedang dan curah air rendah."
    },
    {
      kode: "T004",
      nama: "Bit, Wortel",
      famili: "Amaranthaceae / Apiaceae",
      kategori: "Sayuran umbi",
      cf: 97.48,
      status: "literatur",
      pakar: null,
      alasan: "Kesesuaian tinggi berdasarkan literatur Ritung et al., 2011."
    },
    {
      kode: "T009",
      nama: "Kacang Panjang, Kacang Hijau",
      famili: "Fabaceae",
      kategori: "Legum",
      cf: 94.96,
      status: "estimasi_famili",
      pakar: "Pakar 2",
      alasan: "Estimasi didasarkan pada kesamaan sifat legum sefamili."
    }
  ];

  const displayResult = result || (isLoading ? null : null); // We can trigger displaying mock items when requested or on first load as a skeleton example

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Introduction Card */}
      <div className="bg-gradient-to-br from-primary-50 to-sage-100/50 p-6 rounded-2xl border border-primary-100/80 shadow-sm">
        <h2 className="text-lg font-bold text-sage-950 flex items-center gap-2">
          <Sprout className="w-5 h-5 text-primary-600" />
          Kesesuaian Lahan Hortikultura
        </h2>
        <p className="text-sm text-sage-600 mt-2 leading-relaxed font-sans">
          Masukkan karakteristik lahan Anda di bawah ini. Sistem pakar akan menggunakan penarikan kesimpulan **Forward Chaining** untuk menghitung kecocokan tanaman.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Form Panel */}
        <form onSubmit={handleSubmit} className="lg:col-span-5 bg-white p-6 rounded-2xl border border-sage-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-sage-800 uppercase tracking-wider mb-2">Kriteria Lahan</h3>

          {/* Conversation Name Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-sage-700 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-sage-400" />
              Nama Konsultasi
            </label>
            <input
              type="text"
              value={namaKonsultasi}
              onChange={(e) => setNamaKonsultasi(e.target.value)}
              placeholder="cth. Lahan Utara Sektor A"
              className="w-full text-sm rounded-xl border border-sage-200 bg-sage-50/30 p-3 text-sage-800 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 transition-all duration-200"
              required
            />
          </div>

          {/* Temperature Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-sage-700 flex items-center gap-1.5">
              <Thermometer className="w-3.5 h-3.5 text-sage-400" />
              Suhu Rata-Rata Lahan
            </label>
            <select
              value={suhu}
              onChange={(e) => setSuhu(e.target.value)}
              className="w-full text-sm rounded-xl border border-sage-200 bg-sage-50/30 p-3 text-sage-800 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 transition-all duration-200"
              required
            >
              <option value="">Pilih Suhu Lahan...</option>
              <option value="K001">Suhu Dingin (15–20°C)</option>
              <option value="K002">Suhu Sedang (21–25°C)</option>
              <option value="K003">Suhu Panas (26–32°C)</option>
            </select>
          </div>

          {/* Water Availability Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-sage-700 flex items-center gap-1.5">
              <Droplet className="w-3.5 h-3.5 text-sage-400" />
              Ketersediaan Air Tahunan
            </label>
            <select
              value={air}
              onChange={(e) => setAir(e.target.value)}
              className="w-full text-sm rounded-xl border border-sage-200 bg-sage-50/30 p-3 text-sage-800 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 transition-all duration-200"
              required
            >
              <option value="">Pilih Ketersediaan Air...</option>
              <option value="K004">Air Sangat Rendah (50–200 mm)</option>
              <option value="K005">Air Rendah (200–500 mm)</option>
              <option value="K006">Air Sedang (500–800 mm)</option>
              <option value="K007">Air Tinggi (800–1300 mm)</option>
            </select>
          </div>

          {/* Soil Depth Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-sage-700 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-sage-400" />
              Kedalaman Solum Tanah
            </label>
            <select
              value={kedalaman}
              onChange={(e) => setKedalaman(e.target.value)}
              className="w-full text-sm rounded-xl border border-sage-200 bg-sage-50/30 p-3 text-sage-800 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 transition-all duration-200"
              required
            >
              <option value="">Pilih Kedalaman Tanah...</option>
              <option value="K008">Dangkal (&gt; 50 cm)</option>
              <option value="K009">Dalam (&gt; 75 cm)</option>
            </select>
          </div>

          {/* Base Saturation Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-sage-700 flex items-center gap-1.5">
              <Percent className="w-3.5 h-3.5 text-sage-400" />
              Kejenuhan Basa Tanah
            </label>
            <select
              value={kejenuhan}
              onChange={(e) => setKejenuhan(e.target.value)}
              className="w-full text-sm rounded-xl border border-sage-200 bg-sage-50/30 p-3 text-sage-800 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 transition-all duration-200"
              required
            >
              <option value="">Pilih Kejenuhan Basa...</option>
              <option value="K010">Sedang (&gt; 35%)</option>
              <option value="K011">Tinggi (&gt; 50%)</option>
            </select>
          </div>

          {/* pH Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-sage-700 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-sage-400" />
              Kemasaman Tanah (pH)
            </label>
            <select
              value={ph}
              onChange={(e) => setPh(e.target.value)}
              className="w-full text-sm rounded-xl border border-sage-200 bg-sage-50/30 p-3 text-sage-800 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 transition-all duration-200"
              required
            >
              <option value="">Pilih Keasaman pH...</option>
              <option value="K014">Masam (5.0–5.9)</option>
              <option value="K012">Agak Masam (6.0–6.5)</option>
              <option value="K013">Netral (6.6–7.0)</option>
              <option value="K015">Agak Alkalis (7.1–7.9)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-primary-600 p-3 text-sm font-semibold text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-primary-600/10 disabled:opacity-50"
          >
            {isLoading ? "Memproses..." : "Analisis Kesesuaian Lahan"}
          </button>
        </form>

        {/* Results Panel */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-sm font-bold text-sage-800 uppercase tracking-wider px-1">Rekomendasi Tanaman</h3>

          {isLoading ? (
            <div className="bg-white p-12 rounded-2xl border border-sage-200 shadow-sm flex flex-col items-center justify-center space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <p className="text-sm text-sage-500">Menghitung Certainty Factor tanaman...</p>
            </div>
          ) : result ? (
            // Active results list (will be populated during Phase 3 & 4)
            <div className="space-y-3">
              {result.crops?.map((crop: any, index: number) => (
                <div key={crop.kode} className="bg-white p-4 rounded-xl border border-sage-200 shadow-sm flex gap-4">
                  {/* Visual list structure */}
                </div>
              ))}
            </div>
          ) : (
            // Placeholder/Mock display
            <div className="space-y-3">
              <div className="bg-sage-100/40 p-4 rounded-xl border border-dashed border-sage-300 text-center mb-2">
                <p className="text-xs text-sage-500">
                  Berikut adalah contoh output rekomendasi saat form diisi:
                </p>
              </div>

              {mockCrops.map((crop, index) => {
                const isPakar = crop.status === "tervalidasi_pakar";
                const isEstimasi = crop.status === "estimasi_famili";

                return (
                  <div
                    key={crop.kode}
                    className={cn(
                      "bg-white p-5 rounded-2xl border transition-all duration-300 shadow-sm relative overflow-hidden group hover:shadow-md",
                      index === 0 ? "border-primary-200 ring-1 ring-primary-100" : "border-sage-200"
                    )}
                  >
                    {/* Rank Badge */}
                    <div className="absolute top-0 right-0 bg-sage-100 group-hover:bg-sage-200 text-sage-700 text-[10px] font-bold px-3 py-1 rounded-bl-xl transition-colors">
                      Peringkat #{index + 1}
                    </div>

                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div
                        className={cn(
                          "p-3 rounded-xl flex-shrink-0 flex items-center justify-center",
                          index === 0
                            ? "bg-primary-100 text-primary-600"
                            : "bg-sage-100 text-sage-600"
                        )}
                      >
                        <Sprout className="w-6 h-6" />
                      </div>

                      {/* Details */}
                      <div className="flex-1 space-y-2 min-w-0 pr-8">
                        <div>
                          <h4 className="text-base font-bold text-sage-900 truncate">
                            {crop.nama}
                          </h4>
                          <span className="text-xs text-sage-500 font-medium block">
                            Famili: {crop.famili}
                          </span>
                        </div>

                        {/* Badges */}
                        <div className="flex flex-wrap gap-1.5 items-center">
                          <span className="text-[10px] bg-sage-100 text-sage-600 px-2 py-0.5 rounded-full font-medium">
                            {crop.kategori}
                          </span>
                        </div>

                        <p className="text-xs text-sage-600 leading-relaxed font-sans">
                          {crop.alasan}
                        </p>
                      </div>


                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Mode1Form;

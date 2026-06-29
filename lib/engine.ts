import { db } from "@/lib/db";

export interface LahanInput {
  suhu: string;
  air: string;
  kedalaman: string;
  kejenuhan: string;
  ph: string;
}

export interface ConstraintResult {
  riskLevel: "Tinggi" | "Sedang" | "Aman";
  jenisLarangan: string | null;
  alasan: string | null;
  jedaTambahan: string | null;
  mitigasi: string | null;
}

// 1. Helper to split families: e.g. "Poaceae / Convolvulaceae" -> ["Poaceae", "Convolvulaceae"]
export function parseFamilies(familyStr: string): string[] {
  if (!familyStr) return [];
  return familyStr.split("/").map((f) => f.trim());
}

// 2. CF combination formula: CF_combine = CF_1 + CF_2 * (1 - CF_1) iteratively
export function calculateCombinedCF(weights: number[]): number {
  if (weights.length === 0) return 0;
  let cfCombine = weights[0];
  for (let i = 1; i < weights.length; i++) {
    cfCombine = cfCombine + weights[i] * (1 - cfCombine);
  }
  // Format to 2 decimal places (as percentage, e.g. 0.9664 -> 96.64)
  return parseFloat((cfCombine * 100).toFixed(2));
}

// 3. Evaluate constraint between two crops based on their botanical families
export async function getConstraintEvaluation(
  cropA: { kode_tanaman: string; nama_tanaman: string; famili_botani: string },
  cropB: { kode_tanaman: string; nama_tanaman: string; famili_botani: string }
): Promise<ConstraintResult> {
  const familiesA = parseFamilies(cropA.famili_botani);
  const familiesB = parseFamilies(cropB.famili_botani);

  const commonFamily = familiesA.find((f) => familiesB.includes(f));

  if (!commonFamily) {
    return {
      riskLevel: "Aman",
      jenisLarangan: null,
      alasan: null,
      jedaTambahan: null,
      mitigasi: null,
    };
  }

  // Load constraints from database
  const dbConstraints = await db.constraintRotasi.findMany();

  // Find matching constraint rules
  let match = dbConstraints.find(
    (c) =>
      (c.famili_a === commonFamily && c.famili_b === commonFamily) ||
      (c.famili_a === "any" && c.famili_b === "any" && c.jenis_larangan === "famili_sama")
  );

  // If common family is Fabaceae/Poaceae, prioritize those specific rules
  const specificMatch = dbConstraints.find(
    (c) => c.famili_a === commonFamily && c.famili_b === commonFamily
  );
  if (specificMatch) {
    match = specificMatch;
  }

  if (match) {
    const isFabaceae = commonFamily === "Fabaceae";
    const isPoaceae = commonFamily === "Poaceae";

    return {
      riskLevel: isFabaceae ? "Sedang" : "Tinggi",
      jenisLarangan: match.jenis_larangan,
      alasan: match.alasan.replace("Cucurbitaceae", commonFamily), // dynamically specify family if generic
      jedaTambahan: isFabaceae
        ? "Jeda normal (1–3 minggu) cukup, tidak perlu diperpanjang"
        : isPoaceae
        ? "Minimal 1 bulan, idealnya 1 musim penuh"
        : "Minimal 1 bulan (2x lipat dari jeda normal 2 minggu–1 bulan)",
      mitigasi: isFabaceae
        ? "Tidak perlu perlakuan khusus tambahan, tapi tetap disarankan ganti famili pada siklus berikutnya"
        : isPoaceae
        ? "Olah tanah + pupuk dasar N tinggi, pertimbangkan tanaman sela legum bila memungkinkan"
        : "Bersihkan total sisa akar & gulma, olah tanah dalam, beri pupuk organik dosis tinggi, idealnya selingi 1 siklus tanaman famili lain meski singkat (tanaman sela)",
    };
  }

  return {
    riskLevel: "Aman",
    jenisLarangan: null,
    alasan: null,
    jedaTambahan: null,
    mitigasi: null,
  };
}

// 4. Resolve rest interval from database
export async function getJedaRotasi(kategori: string) {
  const allJeda = await db.jedaRotasi.findMany();

  // Classify kategori
  let categoryName = "Default";
  const lowerKategori = kategori.toLowerCase();
  if (lowerKategori.includes("serealia")) {
    categoryName = "Serealia";
  } else if (
    lowerKategori.includes("sayuran") ||
    lowerKategori.includes("legum") ||
    lowerKategori.includes("buah")
  ) {
    categoryName = "Sayuran daun/buah";
  }

  const match =
    allJeda.find((j) => j.kategori_tanaman === categoryName) ||
    allJeda.find((j) => j.kategori_tanaman === "Default") ||
    {
      jeda_minimum_hari: 14,
      jeda_maksimum_hari: 14,
      catatan_aktivitas:
        "membersihkan sisa akar, membalik tanah, memberi pupuk dasar (kompos/kandang) agar hara pulih sebelum tanam ulang.",
    };

  return {
    jeda: `${match.jeda_minimum_hari} - ${match.jeda_maksimum_hari} Hari`,
    jedaCatatan: match.catatan_aktivitas,
  };
}

// 5. Forward Chaining based Land Suitability Evaluator
export async function evaluateLahanKesesuaian(lahan: LahanInput) {
  const userCriteriaCodes = [
    lahan.suhu,
    lahan.air,
    lahan.kedalaman,
    lahan.kejenuhan,
    lahan.ph,
  ].filter(Boolean);

  // Bug Implikasi (Kedalaman Tanah): K009 (> 75 cm) implies K008 (> 50 cm)
  if (lahan.kedalaman === "K009") {
    if (!userCriteriaCodes.includes("K008")) {
      userCriteriaCodes.push("K008");
    }
  }

  // Fetch all tanaman, criteria weights, and rules
  const allCrops = await db.tanaman.findMany({
    include: {
      ruleKriteria: {
        include: {
          kriteria: true,
        },
      },
      validasiPakar: true,
    },
  });

  const results = allCrops.map((crop) => {
    // Find matched criteria
    const matchedRules = crop.ruleKriteria.filter((rk) =>
      userCriteriaCodes.includes(rk.kode_kriteria)
    );
    const matchedCriteria = matchedRules.map((mr) => ({
      kode_kriteria: mr.kode_kriteria,
      deskripsi: mr.kriteria.deskripsi,
      bobot_cf: mr.kriteria.bobot_cf,
    }));

    const weights = matchedCriteria.map((c) => c.bobot_cf);
    const cfCalculated = calculateCombinedCF(weights);

    // Get primary expert validation (or the first validation in array)
    const validation = crop.validasiPakar[0] || null;

    return {
      kode_tanaman: crop.kode_tanaman,
      nama_tanaman: crop.nama_tanaman,
      famili_botani: crop.famili_botani,
      kategori: crop.kategori,
      status_validasi: crop.status_validasi,
      cf_akhir_db: crop.cf_akhir, // default cf_akhir in database
      cf_lahan: cfCalculated, // calculated based on user input
      matchedCriteria,
      validation: validation
        ? {
            nama_pakar: validation.nama_pakar,
            status_kesesuaian: validation.status_kesesuaian,
            urutan_prioritas_pakar: validation.urutan_prioritas_pakar,
            catatan_revisi: validation.catatan_revisi,
          }
        : null,
    };
  });

  // Sort by calculated CF descending, only keep CF >= 40 (FAO Standard)
  return results
    .filter((r) => r.cf_lahan >= 40)
    .sort((a, b) => b.cf_lahan - a.cf_lahan);
}

// 6. Optimal Scheduling System using pure Forward Chaining rules & Certainty Factors
export async function recommendRotasi(
  tanamanSebelumList: string[],
  userLahan: LahanInput | null,
  cyclesCount: number = 1
) {
  if (tanamanSebelumList.length === 0) {
    return { warnings: [], recommendations: [], rejectedCrops: [] };
  }

  // Fetch all crops and criteria
  const allCrops = await db.tanaman.findMany({
    include: {
      validasiPakar: true,
      ruleKriteria: {
        include: { kriteria: true }
      }
    }
  });
  const cropsMap = new Map(allCrops.map((c) => [c.kode_tanaman, c]));

  // Calculate CF for all chosen seeds
  const userCodes = userLahan
    ? [userLahan.suhu, userLahan.air, userLahan.kedalaman, userLahan.kejenuhan, userLahan.ph].filter(Boolean)
    : [];

  // Implication logic: depth > 75cm (K009) implies depth > 50cm (K008) is met
  if (userLahan && userLahan.kedalaman === "K009") {
    if (!userCodes.includes("K008")) {
      userCodes.push("K008");
    }
  }

  const eligibleCrops: any[] = [];
  const rejectedCrops: any[] = [];

  for (const code of tanamanSebelumList) {
    const crop = cropsMap.get(code);
    if (!crop) continue;

    let cfVal = crop.cf_akhir;
    if (userLahan && userCodes.length > 0) {
      const matches = crop.ruleKriteria.filter((rc) => userCodes.includes(rc.kode_kriteria));
      const weights = matches.map((m) => m.kriteria.bobot_cf);
      cfVal = calculateCombinedCF(weights);
    }

    if (cfVal < 40) {
      rejectedCrops.push({
        kode_tanaman: crop.kode_tanaman,
        nama_tanaman: crop.nama_tanaman,
        cf_lahan: cfVal
      });
    } else {
      eligibleCrops.push({
        ...crop,
        cf_lahan: cfVal
      });
    }
  }

  // If ALL selected seeds have CF < 40%, return an error/abort response
  if (eligibleCrops.length === 0 && rejectedCrops.length > 0) {
    return {
      error: "Semua bibit terpilih ditolak karena kecocokan lahan < 40%. Silakan pilih bibit lain.",
      rejectedCrops,
      recommendations: [],
      warnings: []
    };
  }

  // Greedy Scheduling Algorithm using Forward Chaining & CF
  const schedule: any[] = [];
  const warnings: any[] = [];
  const remaining = [...eligibleCrops];

  // Siklus 1: Highest CF Lahan
  remaining.sort((a, b) => b.cf_lahan - a.cf_lahan);
  const cycle1 = remaining.shift();
  schedule.push({
    kode_tanaman: cycle1.kode_tanaman,
    nama_tanaman: cycle1.nama_tanaman,
    famili_botani: cycle1.famili_botani,
    kategori: cycle1.kategori,
    status_validasi: cycle1.status_validasi,
    cf_akhir_db: cycle1.cf_akhir,
    cf_lahan: cycle1.cf_lahan,
    jeda: "Tanpa Jeda (Tahap Awal)",
    jedaCatatan: "Persiapkan lahan dengan membongkar tanah dan memberikan pupuk dasar organik sebelum penanaman pertama.",
    ruleSource: "literatur",
    alasan_agronomis: "Urutan penanaman awal untuk siklus rotasi (CF tertinggi).",
    constraint: null
  });

  // Siklus 2, 3, etc.
  while (remaining.length > 0) {
    const prevCrop = schedule[schedule.length - 1];
    const isLastCycle = remaining.length === 1;

    // A. Check for same-family constraint matching and risk mitigation
    // "IF Famili(Kandidat) == Famili(Tanaman Siklus Sebelumnya) THEN: Coba cari kandidat sisa yang familinya BERBEDA."
    const diffFamilyCandidates = remaining.filter(c => c.famili_botani !== prevCrop.famili_botani);
    const pool = diffFamilyCandidates.length > 0 ? diffFamilyCandidates : remaining;
    const isForcedSameFamily = diffFamilyCandidates.length === 0;

    // B. Check which candidates in pool match rotation rules from prevCrop
    const rotationRules = await db.ruleRotasi.findMany({
      where: { kode_tanaman_sebelum: prevCrop.kode_tanaman }
    });

    const ruleMatchedCandidates: any[] = [];
    const unmatchedCandidates: any[] = [];

    for (const crop of pool) {
      let isRecommended = false;
      let matchedRule = null;

      for (const rule of rotationRules) {
        if (rule.kode_tanaman_sesudah === crop.kode_tanaman) {
          isRecommended = true;
          matchedRule = rule;
          break;
        } else if (rule.famili_target) {
          const target = rule.famili_target;
          const isNegated = target.startsWith("non-");
          const targetFamily = isNegated ? target.substring(4) : target;
          const hasFamily = crop.famili_botani === targetFamily;
          const match = isNegated ? !hasFamily : hasFamily;
          if (match) {
            isRecommended = true;
            matchedRule = rule;
            break;
          }
        }
      }

      if (isRecommended) {
        ruleMatchedCandidates.push({ crop, rule: matchedRule });
      } else {
        unmatchedCandidates.push({ crop, rule: null });
      }
    }

    // C. Apply Rule Prioritas (Fabaceae after nutrient-depleting crop)
    // Depleting: Poaceae, Cucurbitaceae, Solanaceae
    const isPrevDepleting = ["Poaceae", "Cucurbitaceae", "Solanaceae"].includes(prevCrop.famili_botani);
    
    // Sort helper: sorts candidates by CF Lahan descending
    const sortByCF = (list: any[]) => list.sort((a, b) => b.crop.cf_lahan - a.crop.cf_lahan);

    let nextChoice: any = null;

    // If prev was depleting and we have Fabaceae in ruleMatched, prioritize Fabaceae
    const getPriorityCandidate = (list: any[]) => {
      // Find Fabaceae
      const fabaceae = list.filter(item => item.crop.famili_botani === "Fabaceae");
      // "JANGAN letakkan Fabaceae di siklus paling akhir jika masih ada tanaman lain"
      if (fabaceae.length > 0) {
        if (!isLastCycle || remaining.length === 1) {
          return sortByCF(fabaceae)[0];
        }
      }
      return null;
    };

    // Attempt 1: Rule Matched + priority Fabaceae (if prev was depleting)
    if (isPrevDepleting) {
      nextChoice = getPriorityCandidate(ruleMatchedCandidates);
    }

    // Attempt 2: Rule Matched (CF highest)
    if (!nextChoice && ruleMatchedCandidates.length > 0) {
      // Avoid Fabaceae at the end if other non-Fabaceae exist
      const nonFabaceae = ruleMatchedCandidates.filter(item => item.crop.famili_botani !== "Fabaceae");
      if (isLastCycle && nonFabaceae.length > 0) {
        nextChoice = sortByCF(nonFabaceae)[0];
      } else {
        nextChoice = sortByCF(ruleMatchedCandidates)[0];
      }
    }

    // Attempt 3: Unmatched Candidates + priority Fabaceae (if prev was depleting)
    if (!nextChoice && isPrevDepleting) {
      nextChoice = getPriorityCandidate(unmatchedCandidates);
    }

    // Attempt 4: Unmatched Candidates (CF highest)
    if (!nextChoice && unmatchedCandidates.length > 0) {
      const nonFabaceae = unmatchedCandidates.filter(item => item.crop.famili_botani !== "Fabaceae");
      if (isLastCycle && nonFabaceae.length > 0) {
        nextChoice = sortByCF(nonFabaceae)[0];
      } else {
        nextChoice = sortByCF(unmatchedCandidates)[0];
      }
    }

    // Remove selected crop from remaining list
    const selectedIndex = remaining.findIndex(c => c.kode_tanaman === nextChoice.crop.kode_tanaman);
    const chosenCrop = remaining.splice(selectedIndex, 1)[0];

    // D. Resolve Jeda, JedaCatatan, and Constraint Warnings
    const jedaInfo = await getJedaRotasi(chosenCrop.kategori);
    let jeda = jedaInfo.jeda;
    let jedaCatatan = jedaInfo.jedaCatatan;
    let constraint: any = null;

    if (isForcedSameFamily) {
      const isFabaceae = chosenCrop.famili_botani === "Fabaceae";
      if (isFabaceae) {
        jeda = jedaInfo.jeda;
        constraint = {
          riskLevel: "Sedang",
          jenisLarangan: "sesama_legum",
          alasan: "Kurang Optimal (Tidak ada manfaat isi ulang N tambahan)",
          mitigasi: "Pertimbangkan menyelingi dengan tanaman non-legum pada rotasi berikutnya untuk memaksimalkan isi ulang unsur hara."
        };
      } else {
        jeda = "30 Hari";
        constraint = {
          riskLevel: "Tinggi",
          jenisLarangan: "famili_sama",
          alasan: "Risiko Tinggi Penumpukan Patogen",
          mitigasi: "Lakukan sanitasi lahan secara menyeluruh, olah tanah dalam, dan aplikasikan agen hayati (seperti Trichoderma) untuk mencegah penyakit tular tanah."
        };
      }

      warnings.push({
        jenis: constraint.jenisLarangan,
        title: `Risiko ${constraint.riskLevel}: Rotasi Sefamili (${prevCrop.kode_tanaman} → ${chosenCrop.kode_tanaman})`,
        desc: constraint.alasan,
        mitigasi: constraint.mitigasi,
        jeda: jeda
      });
    }

    schedule.push({
      kode_tanaman: chosenCrop.kode_tanaman,
      nama_tanaman: chosenCrop.nama_tanaman,
      famili_botani: chosenCrop.famili_botani,
      kategori: chosenCrop.kategori,
      status_validasi: chosenCrop.status_validasi,
      cf_akhir_db: chosenCrop.cf_akhir,
      cf_lahan: chosenCrop.cf_lahan,
      jeda,
      jedaCatatan,
      ruleSource: nextChoice.rule ? nextChoice.rule.sumber : "literatur",
      alasan_agronomis: nextChoice.rule ? nextChoice.rule.alasan_agronomis : "Rotasi netral berdasarkan literatur umum.",
      constraint
    });
  }

  return { warnings, recommendations: schedule, rejectedCrops };
}

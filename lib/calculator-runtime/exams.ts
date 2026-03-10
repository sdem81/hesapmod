import type { CalculatorRuntimeMap } from "@/lib/calculator-types";

export const formulas: CalculatorRuntimeMap = {
    "okula-baslama-yasi-hesaplama": (v) => {
            const birthDate = new Date(v.birthDate);
            const referenceDate = new Date(v.referenceDate);

            if (isNaN(birthDate.getTime()) || isNaN(referenceDate.getTime()) || referenceDate < birthDate) {
                return {
                    ageMonths: 0,
                    ageText: { tr: "Geçerli tarih girin", en: "Enter valid dates" } as any,
                    status: { tr: "Tarih bilgisi hatalı", en: "Date information is invalid" } as any,
                };
            }

            let months = (referenceDate.getFullYear() - birthDate.getFullYear()) * 12 + (referenceDate.getMonth() - birthDate.getMonth());
            if (referenceDate.getDate() < birthDate.getDate()) months -= 1;

            const years = Math.floor(months / 12);
            const remainingMonths = months % 12;

            let statusTr = "Okul öncesi değerlendirme gerekir";
            let statusEn = "Preschool evaluation recommended";

            if (months >= 69) {
                statusTr = "Zorunlu ilkokul kaydı için yaş uygun görünüyor";
                statusEn = "Age looks suitable for compulsory primary school registration";
            } else if (months >= 66) {
                statusTr = "Veli talebiyle kayıt değerlendirilebilir";
                statusEn = "Enrollment may be considered upon parent request";
            }

            return {
                ageMonths: months,
                ageText: { tr: `${years} yıl ${remainingMonths} ay`, en: `${years} years ${remainingMonths} months` } as any,
                status: { tr: statusTr, en: statusEn } as any,
            };
        },
    "universite-not-ortalamasi-hesaplama": (v) => {
            const points: Record<string, number> = { AA: 4, BA: 3.5, BB: 3, CB: 2.5, CC: 2, DC: 1.5, DD: 1, FD: 0.5, FF: 0 };
            let totalCredits = 0;
            let weightedPoints = 0;

            for (let i = 1; i <= 6; i++) {
                const credit = parseFloat(v[`credit${i}`]);
                const grade = String(v[`grade${i}`] ?? "");
                if (!isNaN(credit) && credit > 0 && grade in points) {
                    totalCredits += credit;
                    weightedPoints += credit * points[grade];
                }
            }

            if (totalCredits === 0) {
                return {
                    totalCredits: 0,
                    gpa4: 0,
                    approx100: 0,
                    status: { tr: "Kredi girin", en: "Enter credits" } as any,
                };
            }

            const gpa4 = weightedPoints / totalCredits;
            return {
                totalCredits,
                gpa4,
                approx100: gpa4 * 25,
                status: gpa4 >= 2
                    ? ({ tr: "Genel durum yeterli", en: "Overall status is sufficient" } as any)
                    : ({ tr: "Ortalama düşük, dikkat edilmeli", en: "GPA is low, attention needed" } as any),
            };
        },
    "vize-final-ortalama-hesaplama": (v) => {
            const midterm = parseFloat(v.midterm) || 0;
            const final = parseFloat(v.final) || 0;
            const makeup = parseFloat(v.makeup) || 0;
            const midtermWeight = parseFloat(v.midtermWeight) || 0;
            const finalWeight = parseFloat(v.finalWeight) || 0;
            const passGrade = parseFloat(v.passGrade) || 50;

            const usedFinalScore = makeup > 0 ? makeup : final;
            const average = (midterm * midtermWeight + usedFinalScore * finalWeight) / 100;
            const requiredFinal = finalWeight > 0
                ? Math.max(0, Math.min(100, (passGrade - (midterm * midtermWeight / 100)) / (finalWeight / 100)))
                : 0;

            return {
                average,
                usedFinal: makeup > 0
                    ? ({ tr: "Bütünleme notu kullanıldı", en: "Makeup exam grade used" } as any)
                    : ({ tr: "Final notu kullanıldı", en: "Final exam grade used" } as any),
                requiredFinal,
                status: average >= passGrade
                    ? ({ tr: "Ders geçiliyor", en: "Course is passed" } as any)
                    : ({ tr: "Geçmek için not artırılmalı", en: "Score must improve to pass" } as any),
            };
        },
    "lise-ders-puani-hesaplama": (v) => {
            const values = [v.written1, v.written2, v.written3, v.oral, v.project]
                .map((value) => parseFloat(value))
                .filter((value) => !isNaN(value) && value > 0);

            if (values.length === 0) {
                return {
                    score: 0,
                    status: { tr: "Veri girin", en: "Enter data" } as any,
                    summary: { tr: "Önce not bilgisi ekleyin", en: "Add grade data first" } as any,
                };
            }

            const score = values.reduce((sum, value) => sum + value, 0) / values.length;

            return {
                score,
                status: score >= 50
                    ? ({ tr: "Geçer", en: "Pass" } as any)
                    : ({ tr: "Kalırsınız", en: "Fail" } as any),
                summary: score >= 85
                    ? ({ tr: "Ders performansı çok güçlü", en: "Course performance is very strong" } as any)
                    : score >= 70
                        ? ({ tr: "Ders performansı iyi", en: "Course performance is good" } as any)
                        : score >= 50
                            ? ({ tr: "Ders geçiliyor, ama geliştirme payı var", en: "You are passing, but there is room for improvement" } as any)
                            : ({ tr: "Ders bazında destek gerekebilir", en: "You may need support in this course" } as any),
            };
        },
    "lise-mezuniyet-puani-hesaplama": (v) => {
            const grades = [v.grade9, v.grade10, v.grade11, v.grade12]
                .map((value) => parseFloat(value))
                .filter((value) => !isNaN(value));

            if (grades.length === 0) {
                return { graduationScore: 0, diplomaGrade: 0, obpEstimate: 0 };
            }

            const graduationScore = grades.reduce((sum, value) => sum + value, 0) / grades.length;
            return {
                graduationScore,
                diplomaGrade: graduationScore,
                obpEstimate: graduationScore * 5,
            };
        },
    "lise-sinif-gecme-hesaplama": (v) => {
            const average = parseFloat(v.yearAverage) || 0;
            const weakCourses = parseFloat(v.weakCourses) || 0;
            const absenceDays = parseFloat(v.absenceDays) || 0;

            if (absenceDays > 10) {
                return {
                    status: { tr: "Devamsızlıktan başarısız", en: "Failed due to absence" } as any,
                    riskLevel: { tr: "Yüksek", en: "High" } as any,
                    summary: { tr: "Devamsızlık sınırı aşıldığı için sınıf tekrarı riski oluşur.", en: "The absence limit is exceeded, creating a repeat-year risk." } as any,
                };
            }

            if (average >= 50 && weakCourses <= 3) {
                return {
                    status: { tr: "Doğrudan geçer", en: "Direct pass" } as any,
                    riskLevel: { tr: "Düşük", en: "Low" } as any,
                    summary: { tr: "Ortalama ve zayıf ders sayısı mevcut bilgilere göre yeterli görünüyor.", en: "Average and failing-course count look sufficient based on the entered data." } as any,
                };
            }

            if (weakCourses <= 3) {
                return {
                    status: { tr: "Sorumlu geçme ihtimali", en: "Conditional pass possibility" } as any,
                    riskLevel: { tr: "Orta", en: "Medium" } as any,
                    summary: { tr: "Ortalama düşük olsa da zayıf ders sayısı sınırlı. Okulun resmi değerlendirmesi belirleyicidir.", en: "Even with a lower average, the number of failing courses is limited. The school's official evaluation remains decisive." } as any,
                };
            }

            return {
                status: { tr: "Sınıf tekrarı riski", en: "Repeat-year risk" } as any,
                riskLevel: { tr: "Yüksek", en: "High" } as any,
                summary: { tr: "Zayıf ders sayısı veya ortalama nedeniyle risk artıyor.", en: "Risk increases due to the number of failing courses or low average." } as any,
            };
        },
    "lise-ybp-hesaplama": (v) => {
            const term1 = parseFloat(v.term1) || 0;
            const term2 = parseFloat(v.term2) || 0;
            const ybp = (term1 + term2) / 2;

            return {
                ybp,
                obpEffect: ybp * 5,
                status: ybp >= 85
                    ? ({ tr: "Çok güçlü", en: "Very strong" } as any)
                    : ybp >= 70
                        ? ({ tr: "İyi", en: "Good" } as any)
                        : ybp >= 50
                            ? ({ tr: "Geçer düzey", en: "Pass level" } as any)
                            : ({ tr: "Düşük", en: "Low" } as any),
            };
        },
    "kpss-puan-hesaplama": (v) => {
            const gyNet = Math.max(0, (parseFloat(v.gyDogru) || 0) - (parseFloat(v.gyYanlis) || 0) / 4);
            const gkNet = Math.max(0, (parseFloat(v.gkDogru) || 0) - (parseFloat(v.gkYanlis) || 0) / 4);

            // ÖSYM resmi formülü: GY standart puanı %50 GY net + 50 baz, GK benzer şekilde
            // P1: GY (Ağırlık %70) + GK (Ağırlık %30) kombinasyonu
            // Net → Standart Puan dönüşümü yaklaşık: SP = 50 + (net - ortalama) / standart_sapma * 10
            // Pratik yaklaşım: KPSS-P1 = (GY_net / 60) * 70 * (100/60) + (GK_net / 60) * 30 * (100/60) * ... basit yaklaşım:
            // Basit simülatör: P1 ≈ GY_net * 1.17 + GK_net * 0.50 + 40 (tarihsel verilere dayalı yaklaşım)
            const p1 = Math.min(200, Math.max(0, (gyNet * 1.17) + (gkNet * 0.50) + 40));
            // P2 = GY+GK+Alan; alan testi olmadığından GY ağırlığını arttırarak yaklaşık tahmin
            const p2 = Math.min(200, p1 * 0.60); // P2 alan testi gerektirir, bu tahmini değerdir
            return {
                gyNet,
                gkNet,
                p1,
                p2,
                not: {
                    tr: "⚠️ P2 ve P3 puanları için Eğitim Bilimleri / Alan testleri ayrıca girmeniz gerekmektedir. Bu araç yalnızca GY+GK üzerinden P1 ve tahmini P2 hesaplar. Kesin sonuç için resmi ÖSYM sonuç belgesini kullanın.",
                    en: "⚠️ P2 and P3 scores require Education Sciences and Field test inputs. This tool calculates P1 and estimated P2 from GY+GK only. For exact results, use your official ÖSYM result document."
                }
            };
        },
    "ozel-guvenlik-sinav-hesaplama": (v) => {
            const b1 = parseFloat(v.bolum1) || 0;
            const b2 = parseFloat(v.bolum2) || 0;
            const b3 = parseFloat(v.bolum3) || 0;
            const b4 = parseFloat(v.bolum4) || 0;
            const toplam = b1 + b2 + b3 + b4;
            const puan = toplam; // 100 soru, her doğru 1 puan
            const gecti = puan >= 70 ? 1 : 0;
            return { toplam, puan, gecti };
        },
    "lgs-puan-hesaplama": (v) => {
            const getNet = (d: any, y: any, max: number) => {
                const correct = Math.min(parseFloat(d) || 0, max);
                let wrong = parseFloat(y) || 0;
                if (correct + wrong > max) wrong = max - correct;
                return Math.max(0, correct - (wrong / 3));
            };

            const t_net = getNet(v.turk_d, v.turk_y, 20);
            const m_net = getNet(v.mat_d, v.mat_y, 20);
            const f_net = getNet(v.fen_d, v.fen_y, 20);
            const i_net = getNet(v.ink_d, v.ink_y, 10);
            const din_net = v.din_muaf ? 0 : getNet(v.din_d, v.din_y, 10);
            const dil_net = v.dil_muaf ? 0 : getNet(v.dil_d, v.dil_y, 10);

            // Technical Requirements: TR:4, MAT:4, FEN:4, others:1
            const t_coef = 4.0;
            const m_coef = 4.0;
            const f_coef = 4.0;
            const i_coef = 1.0;
            const din_coef = 1.0;
            const dil_coef = 1.0;
            const base_point = 194.707;

            let c_din = v.din_muaf ? 0 : din_coef;
            let c_dil = v.dil_muaf ? 0 : dil_coef;

            // Normalization for exemptions: Scales the score up to maintain the 500 max range
            const max_possible_weighted = 270; // (20*4)*3 + (10*1)*3
            const current_max_possible = (20 * 4) * 3 + (10 * 1) + (v.din_muaf ? 0 : 10) + (v.dil_muaf ? 0 : 10);
            const multiplier = max_possible_weighted / current_max_possible;

            const weighted_score = (
                (t_net * t_coef) +
                (m_net * m_coef) +
                (f_net * f_coef) +
                (i_net * i_coef) +
                (din_net * c_din) +
                (dil_net * c_dil)
            ) * multiplier;

            // Conversion to 500 scale
            // (500 - 194.707) / 270 = 1.1307148
            const scaling_factor = 1.1307148;
            let total_puan = base_point + (weighted_score * scaling_factor);

            const total_net = t_net + m_net + f_net + i_net + din_net + dil_net;
            if (total_net === 0) total_puan = 0;

            return { toplam_net: total_net, puan: Math.min(500, Math.max(0, total_puan)) };
        },
    "takdir-tesekkur-hesaplama": (v) => {
            let totalWeightedPoints = 0;
            let totalHours = 0;
            let hasFailingGrade = false;

            for (let i = 1; i <= 6; i++) {
                const rawGrade = v[`grade${i}`];
                const rawHour = v[`hours${i}`];

                // Only process filled inputs
                if (rawGrade !== undefined && rawHour !== undefined && rawHour !== "") {
                    const grade = parseFloat(rawGrade) || 0;
                    const hours = parseFloat(rawHour) || 0;

                    if (hours > 0) {
                        if (grade < 50) {
                            hasFailingGrade = true;
                        }
                        totalWeightedPoints += (grade * hours);
                        totalHours += hours;
                    }
                }
            }

            if (totalHours === 0) return { average: 0, resultType: { tr: "Ders bilgisi girilmedi.", en: "No class data entered." } as any };

            const average = totalWeightedPoints / totalHours;

            // e-Okul MEB regulations for secondary/high schools
            let statusTr = "";
            let statusEn = "";
            let colorCls = "bg-green-500";

            if (hasFailingGrade) {
                statusTr = "Belge Alamaz (Zayıf var)";
                statusEn = "No Certificate (Failing Grade)";
                colorCls = "bg-red-500";
            } else if (average >= 85) {
                statusTr = "Takdir Belgesi Almaya Hak Kazandınız 🏆";
                statusEn = "Certificate of Excellence 🏆";
                colorCls = "bg-[#22c55e]";
            } else if (average >= 70) {
                statusTr = "Teşekkür Belgesi Almaya Hak Kazandınız ⭐";
                statusEn = "Certificate of Merit ⭐";
                colorCls = "bg-blue-500";
            } else {
                statusTr = "Belge Alamaz (Ortalama Yetersiz)";
                statusEn = "No Certificate (Insufficient Average)";
                colorCls = "bg-orange-500";
            }

            return {
                average: average,
                resultType: { tr: statusTr, en: statusEn } as any
            };
        },
    "dgs-puan-hesaplama": (v) => {
            const getNet = (d: any, y: any, max: number) => {
                const correct = Math.min(parseFloat(d) || 0, max);
                let wrong = parseFloat(y) || 0;
                if (correct + wrong > max) wrong = max - correct;
                return Math.max(0, correct - (wrong / 4)); // 4 yanlış 1 doğruyu götürür
            };

            const sayisal_net = getNet(v.sayisal_d, v.sayisal_y, 50);
            const sozel_net = getNet(v.sozel_d, v.sozel_y, 50);

            // ÖSYM güncel denklik formülü (yaklaşık)
            let sayisal_std = (sayisal_net * 3.1) + (sozel_net * 0.5) + 105;
            let sozel_std = (sayisal_net * 0.5) + (sozel_net * 3.1) + 105;
            let ea_std = (sayisal_net * 1.8) + (sozel_net * 1.8) + 105;

            let obp = parseFloat(v.obp) || 0;
            if (obp > 80) obp = 80;
            if (obp > 0 && obp < 40) obp = 40;

            const isPlacedBefore = v.onceki_yerlestirme === "evet";
            const obpMultiplier = isPlacedBefore ? 0.45 : 0.6;
            const obpContribution = obp * obpMultiplier;

            return {
                sayisal_net,
                sozel_net,
                sayisal_puan: sayisal_std + obpContribution,
                sozel_puan: sozel_std + obpContribution,
                ea_puan: ea_std + obpContribution
            };
        },
    "tyt-puan-hesaplama": (v) => {
            const getNet = (d: any, y: any, max: number) => {
                const correct = Math.min(parseFloat(d) || 0, max);
                let wrong = parseFloat(y) || 0;
                if (correct + wrong > max) wrong = max - correct;
                return Math.max(0, correct - (wrong / 4));
            };

            const turk_net = getNet(v.turk_d, v.turk_y, 40);
            const sos_net = getNet(v.sos_d, v.sos_y, 20);
            const mat_net = getNet(v.mat_d, v.mat_y, 40);
            const fen_net = getNet(v.fen_d, v.fen_y, 20);
            const toplam_net = turk_net + sos_net + mat_net + fen_net;

            // ÖSYM gerçek TYT katsayıları (yıla göre)
            const tytKat: Record<string, { turk: number; sos: number; mat: number; fen: number }> = {
                "2025": { turk: 2.91, sos: 2.94, mat: 2.93, fen: 2.53 },
                "2024": { turk: 2.91, sos: 2.94, mat: 2.93, fen: 2.53 },
                "2023": { turk: 3.30, sos: 3.40, mat: 3.30, fen: 3.40 },
            };
            const yil = String(v.sinav_yili || "2025");
            const k = tytKat[yil] || tytKat["2025"];

            // Türkçe veya Matematik'ten 0.5+ net zorunlu
            let ham_puan = 0;
            if (turk_net >= 0.5 || mat_net >= 0.5) {
                ham_puan = 100 + (turk_net * k.turk) + (sos_net * k.sos) + (mat_net * k.mat) + (fen_net * k.fen);
                if (ham_puan > 500) ham_puan = 500;
            }

            // OBP İşlemleri
            let obp_value = parseFloat(v.obp_input) || 0;
            if (obp_value > 0 && obp_value <= 100) {
                // Diploma notu girilmiş, OBP'ye çevir (x5)
                obp_value = obp_value * 5;
            } else if (obp_value > 500) {
                obp_value = 500;
            }
            if (obp_value < 250 && obp_value > 0) obp_value = 250; // min OBP is 250

            // Normal OBP katsayısı = 0.12 (max 60 puan)
            // Eğer geçen sene yerleştiyse yarıya düşer = 0.06 (max 30 puan)
            const isPlacedBefore = !!v.obp_kesinti;
            const obpMultiplier = isPlacedBefore ? 0.06 : 0.12;
            let obp_katkisi = obp_value * obpMultiplier;
            if (obp_katkisi < 0) obp_katkisi = 0;

            const isVocational = !!v.obp_ek_puan;
            // Meslek lisesi ek puanı: OBP * 0.06 (Sadece kendi alanını tercih ederse)
            // Eğer geçen sene kendi alanında yerleştiyse bu da yarıya düşer: 0.03
            const ekMultiplier = isPlacedBefore ? 0.03 : 0.06;
            let ek_katki = isVocational ? (obp_value * ekMultiplier) : 0;

            let yerlestirme_puan = 0;
            let ek_puanli_yerlestirme = 0;

            if (ham_puan > 100) {
                yerlestirme_puan = ham_puan + obp_katkisi;
                ek_puanli_yerlestirme = yerlestirme_puan + ek_katki;
            }

            return {
                toplam_net,
                ham_puan,
                yerlestirme_puan: yerlestirme_puan > 0 ? yerlestirme_puan : 0,
                ek_puanli_yerlestirme: ek_puanli_yerlestirme > 0 ? ek_puanli_yerlestirme : 0
            };
        },
    "ags-puan-hesaplama": (v) => {
            const getNet = (d: any, y: any, max: number) => {
                const correct = Math.min(parseFloat(d) || 0, max);
                let wrong = parseFloat(y) || 0;
                if (correct + wrong > max) wrong = max - correct;
                return Math.max(0, correct - (wrong / 4));
            };

            // Calculate AGS Nets
            const sozelNet = getNet(v.sozel_d, v.sozel_y, 15);
            const sayisalNet = getNet(v.sayisal_d, v.sayisal_y, 15);
            const tarihNet = getNet(v.tr_tarih_d, v.tr_tarih_y, 10);
            const cografyaNet = getNet(v.tr_cog_d, v.tr_cog_y, 8);
            const egitimNet = getNet(v.meb_sistemi_d, v.meb_sistemi_y, 24);
            const mevzuatNet = getNet(v.mevzuat_d, v.mevzuat_y, 8);
            const agsTotalNet = sozelNet + sayisalNet + tarihNet + cografyaNet + egitimNet + mevzuatNet;

            if (agsTotalNet < 1) {
                return { ags_toplam_net: 0, p1_puani: 0, p2_puani: 0, p2_16_puani: 0, p2_17_puani: 0, p3_puani: 0 };
            }

            // Standart Puan Simülasyonu: 50 + (Net * (10 / max)*BirKatsayı)  yaklaşımı yerine oran bazlı ağırlıklı hesaplama yapıyoruz
            // Ağırlıklar: P1 -> (SöZ:%20, SaY:%20, Tar:%15, Coğ:%10, Eğt:%25, Mev:%10)
            const p1Weights = [0.20, 0.20, 0.15, 0.10, 0.25, 0.10];
            const p1Maxes = [15, 15, 10, 8, 24, 8];
            const p1Base = 40; // Simüle edilmiş taban puan
            const computeBaseAgP1 = () => {
                let wScore = 0;
                wScore += (sozelNet / p1Maxes[0]) * p1Weights[0];
                wScore += (sayisalNet / p1Maxes[1]) * p1Weights[1];
                wScore += (tarihNet / p1Maxes[2]) * p1Weights[2];
                wScore += (cografyaNet / p1Maxes[3]) * p1Weights[3];
                wScore += (egitimNet / p1Maxes[4]) * p1Weights[4];
                wScore += (mevzuatNet / p1Maxes[5]) * p1Weights[5];
                return p1Base + (wScore * 60); // maks puan 100 limitine çekme
            };
            const p1Puani = computeBaseAgP1();

            // P2/P3 Base AGS parts ( AGS takes 50% )
            const p2Weights = [0.10, 0.10, 0.075, 0.05, 0.125, 0.05];
            const computeBaseAgP2 = () => {
                let wScore = 0;
                wScore += (sozelNet / p1Maxes[0]) * p2Weights[0];
                wScore += (sayisalNet / p1Maxes[1]) * p2Weights[1];
                wScore += (tarihNet / p1Maxes[2]) * p2Weights[2];
                wScore += (cografyaNet / p1Maxes[3]) * p2Weights[3];
                wScore += (egitimNet / p1Maxes[4]) * p2Weights[4];
                wScore += (mevzuatNet / p1Maxes[5]) * p2Weights[5];
                return wScore * 100; // max 50 points directly
            };
            const p2BasePart = computeBaseAgP2(); // This represents up to 50 points of the 100 final

            let p2Puani = 0;
            let p2_16 = 0;
            let p2_17 = 0;
            let p3Puani = 0;

            const alani = String(v.oabt_alani);

            // Eğer ÖABT girilmişse
            if (alani !== "Yok" && alani !== "YDS" && alani !== "Din Kültürü" && alani !== "İHL Meslek Dersleri") {
                const oabtNet = getNet(v.oabt_d, v.oabt_y, 50);
                if (oabtNet >= 1) {
                    // OABT %50
                    const oabtPart = (oabtNet / 50) * 50;
                    p2Puani = p1Base * 0.5 + p2BasePart + oabtPart * 0.8; // Simüle edilmiş scaling
                }
            }

            // İHL (P2-16) veya DİN KÜLTÜRÜ (P2-17)
            if (alani === "Din Kültürü" || alani === "İHL Meslek Dersleri") {
                const o_n = getNet(v.ortak_alan_d, v.ortak_alan_y, 15);
                const t_i_n = getNet(v.temel_islam_d, v.temel_islam_y, 20); // ÖABT tablolarına göre netleştirildi
                let i_t_n = 0;

                if (alani === "İHL Meslek Dersleri") {
                    i_t_n = getNet(v.islam_tarihi_d, v.islam_tarihi_y, 20); // Toplamını 50 ye tamamlayacak şekilde İHL Tablo Ağırlık maxlar
                } else {
                    i_t_n = getNet(v.islam_tarihi_d, v.islam_tarihi_y, 15); // Din Kül. Tablo Ağırlık maxlar
                }

                if (o_n + t_i_n + i_t_n >= 1) {
                    const oPart16 = (o_n / 15) * 15;
                    const tPart16 = (t_i_n / 15) * 15;
                    const iPart16 = (i_t_n / 20) * 20;

                    const oPart17 = (o_n / 15) * 15;
                    const tPart17 = (t_i_n / 20) * 20;
                    const iPart17 = (i_t_n / 15) * 15;

                    p2_16 = p1Base * 0.5 + p2BasePart + (oPart16 + tPart16 + iPart16) * 0.8;
                    p2_17 = p1Base * 0.5 + p2BasePart + (oPart17 + tPart17 + iPart17) * 0.8;
                }
            }

            // YDS (P3)
            if (alani === "YDS") {
                const ydsNet = getNet(v.yds_d, v.yds_y, 80);
                if (ydsNet >= 1) {
                    // YDS %50
                    const ydsPart = (ydsNet / 80) * 50;
                    p3Puani = p1Base * 0.5 + p2BasePart + ydsPart * 0.8;
                }
            }

            return {
                ags_toplam_net: agsTotalNet,
                p1_puani: p1Puani,
                p2_puani: p2Puani > 0 ? p2Puani : 0,
                p2_16_puani: p2_16 > 0 ? p2_16 : 0,
                p2_17_puani: p2_17 > 0 ? p2_17 : 0,
                p3_puani: p3Puani > 0 ? p3Puani : 0
            };
        },
    "aks-puan-hesaplama": (v) => {
            const d = parseFloat(v.dogru) || 0, y = parseFloat(v.yanlis) || 0;
            const net = d - y / 4;
            const puan = (net / 120) * 100;
            return { net, puan };
        },
    "ales-puan-hesaplama": (v) => {
            const sd = parseFloat(v.say_d) || 0, sy = parseFloat(v.say_y) || 0;
            const vd = parseFloat(v.soz_d) || 0, vy = parseFloat(v.soz_y) || 0;
            const say_net = Math.max(0, sd - sy / 4);
            const soz_net = Math.max(0, vd - vy / 4);

            // ÖSYM dönem katsayıları — her sınav dönemi için farklı standart sapma katsayıları kullanılır
            const donemKatsayilari: Record<string, { saySabit: number; sayKatSay: number; sayKatSoz: number; sozSabit: number; sozKatSay: number; sozKatSoz: number; eaSabit: number; eaKatSay: number; eaKatSoz: number }> = {
                "2025/3": { saySabit: 47.48692, sayKatSay: 0.76542, sayKatSoz: 0.31649, sozSabit: 44.29160, sozKatSay: 0.25121, sozKatSoz: 0.93482, eaSabit: 46.78565, eaKatSay: 0.50146, eaKatSoz: 0.62202 },
                "2025/2": { saySabit: 47.43286, sayKatSay: 0.77475, sayKatSoz: 0.32541, sozSabit: 40.91022, sozKatSay: 0.26999, sozKatSoz: 0.77475, eaSabit: 45.40759, eaKatSay: 0.51770, eaKatSoz: 0.65232 },
                "2025/1": { saySabit: 47.43286, sayKatSay: 0.77475, sayKatSoz: 0.32541, sozSabit: 40.91022, sozKatSay: 0.26999, sozKatSoz: 0.77475, eaSabit: 45.40759, eaKatSay: 0.51770, eaKatSoz: 0.65232 },
                "2024/2": { saySabit: 47.43286, sayKatSay: 0.77475, sayKatSoz: 0.32541, sozSabit: 40.91022, sozKatSay: 0.26999, sozKatSoz: 0.77475, eaSabit: 45.40759, eaKatSay: 0.51770, eaKatSoz: 0.65232 },
                "2024/1": { saySabit: 47.43286, sayKatSay: 0.77475, sayKatSoz: 0.32541, sozSabit: 40.91022, sozKatSay: 0.26999, sozKatSoz: 0.77475, eaSabit: 45.40759, eaKatSay: 0.51770, eaKatSoz: 0.65232 },
            };

            const donem = String(v.sinav_donemi || "2025/3");
            const k = donemKatsayilari[donem] || donemKatsayilari["2025/3"];

            // Her iki testten de en az 1 net şartı
            if (say_net < 1 || soz_net < 1) {
                return { say_net, soz_net, ales_say: 0, ales_soz: 0, ales_ea: 0 };
            }

            const ales_say = k.saySabit + (say_net * k.sayKatSay) + (soz_net * k.sayKatSoz);
            const ales_soz = k.sozSabit + (say_net * k.sozKatSay) + (soz_net * k.sozKatSoz);
            const ales_ea = k.eaSabit + (say_net * k.eaKatSay) + (soz_net * k.eaKatSoz);
            return { say_net, soz_net, ales_say, ales_soz, ales_ea };
        },
    "msu-puan-hesaplama": (v) => {
            const td = parseFloat(v.turk_d) || 0, ty = parseFloat(v.turk_y) || 0;
            const md = parseFloat(v.mat_d) || 0, my = parseFloat(v.mat_y) || 0;
            const fd = parseFloat(v.fen_d) || 0, fy = parseFloat(v.fen_y) || 0;
            const sd = parseFloat(v.sos_d) || 0, sy = parseFloat(v.sos_y) || 0;
            const turkNet = td - ty / 4, matNet = md - my / 4;
            const fenNet = fd - fy / 4, sosNet = sd - sy / 4;
            const toplamNet = turkNet + matNet + fenNet + sosNet;
            const puan = (toplamNet / 100) * 500;
            return { toplamNet, puan };
        },
    "obp-puan-hesaplama": (v) => {
            const nota = parseFloat(v.diplomaNote) || 0;
            // OBP = Diploma Notu × 5 (100 → 500'lük sisteme dönüşüm)
            const obp = nota * 5;
            // YKS'de OBP'nin ağırlığı: yerleştirme puanına %12 katkı (× 0.12)
            const yerlestirmeEtkisi = obp * 0.12;
            return { obp, yerlestirmeEtkisi };
        },
    "yds-puan-hesaplama": (v) => {
            const d = parseFloat(v.dogru) || 0, y = parseFloat(v.yanlis) || 0;
            const net = d - y / 4;
            const puan = (net / 80) * 100;
            let cefr = { tr: "A1 (Başlangıç)", en: "A1 (Beginner)" };
            if (puan >= 90) cefr = { tr: "C2 (Ustalık)", en: "C2 (Mastery)" };
            else if (puan >= 80) cefr = { tr: "C1 (Etkin Kullanım)", en: "C1 (Effective)" };
            else if (puan >= 70) cefr = { tr: "B2 (Bağımsız Üst)", en: "B2 (Upper Independent)" };
            else if (puan >= 60) cefr = { tr: "B1 (Bağımsız Alt)", en: "B1 (Lower Independent)" };
            else if (puan >= 50) cefr = { tr: "A2 (Temel Üst)", en: "A2 (Upper Basic)" };
            return { net, puan, cefr };
        },
    "universite-taban-puanlari": (v) => {
            const tabloSAY = {
                ust: { tr: "Tıp (Hacettepe, İstanbul), Elektrik-Elektronik (ODTÜ, Boğaziçi), Bilgisayar Müh. (Boğaziçi, ODTÜ)", en: "Medicine (Hacettepe, Istanbul), EE Eng. (METU, Bosphorus), CS Eng. (Bosphorus, METU)" },
                orta: { tr: "Mühendislik (Gazi, İTÜ), Eczacılık, Diş Hekimliği (devlet), Bilgisayar Müh. (devlet-orta)", en: "Engineering (Gazi, ITU), Pharmacy, Dentistry (public, mid), CS Eng. (public, mid)" },
                alt: { tr: "Hemşirelik, Sağlık Yönetimi, Tarih (devlet), İlahiyat (devlet), İşletme (taşra)", en: "Nursing, Health Management, History (public), Theology (public), Business (regional)" },
            };
            const tabloSOZ = {
                ust: { tr: "Hukuk (Ankara, İstanbul, Galatasaray), Psikoloji (Boğaziçi, Hacettepe), Siyaset Bilimi (SBF)", en: "Law (Ankara, Istanbul, GS Uni), Psychology (Bosphorus, Hacettepe), Political Science (SBF)" },
                orta: { tr: "Türkçe Öğretmenliği, Sosyoloji (devlet), Felsefe (devlet), Tarih Öğretmenliği (devlet)", en: "Turkish Teaching, Sociology (public), Philosophy (public), History Teaching (public)" },
                alt: { tr: "Psikolojik Danışmanlık (taşra), Türk Dili ve Edebiyatı (taşra), İlköğretim Bölümleri", en: "Psych. Counseling (regional), Turkish Lang. & Lit. (regional), Primary Education" },
            };
            const tabloEA = {
                ust: { tr: "İşletme (Boğaziçi, ODTÜ), İktisat (Boğaziçi, ODTÜ), Uluslararası İlişkiler (Boğaziçi)", en: "Business (Bosphorus, METU), Economics (Bosphorus, METU), Intl Relations (Bosphorus)" },
                orta: { tr: "İşletme (Orta düzey devlet), İktisat (Gazi, İstanbul), Öğretmenlik (EA alan)", en: "Business (mid public), Economics (Gazi, Istanbul), Teaching (EA fields)" },
                alt: { tr: "İşletme (taşra devlet), Muhasebe, Ekonomi (taşra)", en: "Business (regional public), Accounting, Economics (regional)" },
            };
            const tabloDIL = {
                ust: { tr: "Tercüme ve Yorumculuk (Boğaziçi, Hacettepe, DTCF), Mütercim-Tercümanlık", en: "Translation (Bosphorus, Hacettepe, DTCF), Interpreting" },
                orta: { tr: "İngiliz Dili ve Edebiyatı (devlet), Yabancı Dil Öğretmenliği (devlet)", en: "English Language & Literature (public), Foreign Language Teaching (public)" },
                alt: { tr: "Yabancı Dil Öğretmenliği (taşra), Dil Bölümleri (taşra devlet)", en: "Foreign Language Teaching (regional), Language Departments (regional public)" },
            };
            const tablo = v.puanTuru === "say" ? tabloSAY : v.puanTuru === "soz" ? tabloSOZ : v.puanTuru === "ea" ? tabloEA : tabloDIL;
            return {
                ust: tablo.ust,
                orta: tablo.orta,
                alt: tablo.alt,
                not: { tr: "⚠️ Bu tablo genel referans amaçlıdır. Kesin taban puanlar için ÖSYM/YÖKATLASplatformunu kullanın.", en: "⚠️ This is a general reference. Use ÖSYM/YÖKATLAS for exact threshold scores." },
            };
        },
    "dgs-taban-puanlari": (v) => {
            const tabloSAY = {
                ust: { tr: "Bilgisayar Müh. (köklü devlet), Elektrik-Elektronik Müh., Endüstri Müh.", en: "CS Engineering (established public), EE Engineering, Industrial Engineering" },
                orta: { tr: "Makine Müh., Inşaat Müh. (taşra devlet), Yazılım Müh.", en: "Mechanical Eng., Civil Eng. (regional public), Software Eng." },
                alt: { tr: "Tarım, Orman, Gıda Müh., Harita Müh. (taşra)", en: "Agriculture, Forestry, Food Eng., Cartography Eng. (regional)" },
            };
            const tabloSOZ = {
                ust: { tr: "Hukuk (bazı programlar), Sosyoloji, Psikoloji (devlet)", en: "Law (some programs), Sociology, Psychology (public)" },
                orta: { tr: "Tarih, Türk Dili, İlahiyat, Coğrafya (devlet)", en: "History, Turkish Language, Theology, Geography (public)" },
                alt: { tr: "Sosyal Hizmet, Çalışma Ekonomisi, Kamu Yönetimi (taşra)", en: "Social Work, Labor Economics, Public Administration (regional)" },
            };
            const tabloEA = {
                ust: { tr: "İşletme (köklü devlet), İktisat, Muhasebe ve Denetim (devlet)", en: "Business (established public), Economics, Accounting (public)" },
                orta: { tr: "Yönetim Bilişim Sistemleri, Pazarlama, Lojistik", en: "Management Information Systems, Marketing, Logistics" },
                alt: { tr: "İşletme (taşra devlet), Turizm İşletmeciliği, Gayrimenkul", en: "Business (regional public), Tourism, Real Estate" },
            };
            const tablo = v.puanTuru === "say" ? tabloSAY : v.puanTuru === "soz" ? tabloSOZ : tabloEA;
            return {
                ust: tablo.ust,
                orta: tablo.orta,
                alt: tablo.alt,
                not: { tr: "⚠️ Kesin taban puanlar için ÖSYM DGS kılavuzunu ve yökatlas.yok.gov.tr'yi kullanın.", en: "⚠️ For exact threshold scores use ÖSYM DGS guide and yökatlas.yok.gov.tr." },
            };
        },
    "ekpss-puan-hesaplama": (v) => {
            const d = parseFloat(v.dogru) || 0;
            const y = parseFloat(v.yanlis) || 0;
            const net = d - y / 4;
            const puan = (Math.max(0, net) / 60) * 100;
            return { net, puan };
        },
    "hakim-savci-yrd-puan-hesaplama": (v) => {
            const d = parseFloat(v.dogru) || 0, y = parseFloat(v.yanlis) || 0;
            const net = d - y / 4;
            const puan = (net / 100) * 100;
            return { net, puan };
        },
    "hmgs-puan-hesaplama": (v) => {
            const d = parseFloat(v.dogru) || 0, y = parseFloat(v.yanlis) || 0;
            const net = d - y / 4;
            const puan = (Math.max(0, net) / 80) * 100;
            return { net, puan };
        },
    "oyp-puan-hesaplama": (v) => {
            const ales = parseFloat(v.ales) || 0;
            const yds = parseFloat(v.yds) || 0;
            const gpa = parseFloat(v.lisanNot) || 0;
            const gpa100 = (gpa / 4) * 100;
            const alesAgirliki = ales * 0.50;
            const ydsAgirliki = yds * 0.20;
            const notAgirliki = gpa100 * 0.30;
            const toplamPuan = alesAgirliki + ydsAgirliki + notAgirliki;
            return { alesAgirliki, ydsAgirliki, notAgirliki, toplamPuan };
        },
    "dib-mbsts-puan-hesaplama": (v) => {
            const net = (parseFloat(v.dogru) || 0) - (parseFloat(v.yanlis) || 0) / 4;
            return { net, puan: net };
        },
    "dus-puan-hesaplama": (v) => {
            const net = (parseFloat(v.dogru) || 0) - (parseFloat(v.yanlis) || 0) / 4;
            return { net, puan: (net / 200) * 100 };
        },
    "eus-puan-hesaplama": (v) => {
            const net = (parseFloat(v.dogru) || 0) - (parseFloat(v.yanlis) || 0) / 4;
            return { net, puan: (net / 120) * 100 };
        },
    "isg-puan-hesaplama": (v) => {
            const net = (parseFloat(v.dogru) || 0) - (parseFloat(v.yanlis) || 0) / 4;
            return { net, puan: net };
        },
    "tus-puan-hesaplama": (v) => {
            const temelNet = (parseFloat(v.temel_d) || 0) - (parseFloat(v.temel_y) || 0) / 4;
            const klinikNet = (parseFloat(v.klinik_d) || 0) - (parseFloat(v.klinik_y) || 0) / 4;
            return { temelNet, klinikNet, puan: ((temelNet + klinikNet) / 200) * 100 };
        },
    "ehliyet-sinav-puan-hesaplama": (v) => {
            const d = parseFloat(v.dogru) || 0;
            const puan = d * 2;
            const durum = puan >= 70
                ? { tr: "✅ GEÇTİ (70 ve üzeri)", en: "✅ PASSED (70 or above)" }
                : { tr: "❌ KALDI (70 altı)", en: "❌ FAILED (below 70)" };
            return { puan, durum };
        },
    "iyos-puan-hesaplama": (v) => {
            const net = (parseFloat(v.dogru) || 0) - (parseFloat(v.yanlis) || 0) / 4;
            return { net, puan: (Math.max(0, net) / 80) * 100 };
        },
    "lise-taban-puanlari": (v) => {
            const p = parseFloat(v.lgsPuan) || 0;
            let tur = { tr: "📙 Yerel yerleştirme ile mesleki ve teknik, imam hatip veya çok programlı lise seçenekleri", en: "📙 Local placement options such as vocational, imam hatip, or multi-program high schools" };
            if (p >= 490) tur = { tr: "🏅 Fen liseleri, sosyal bilimler liseleri ve en seçici proje okulları", en: "🏅 Science high schools, social sciences high schools, and the most selective project schools" };
            else if (p >= 460) tur = { tr: "✅ Güçlü Anadolu liseleri ve bazı proje okulları", en: "✅ Strong Anatolian high schools and some project schools" };
            else if (p >= 410) tur = { tr: "📘 Anadolu liseleri ile seçici mesleki-teknik lise grupları", en: "📘 Anatolian high schools and selective vocational-technical groups" };
            else if (p >= 350) tur = { tr: "📗 Yerel yerleştirme ağırlıklı Anadolu, imam hatip ve mesleki-teknik lise seçenekleri", en: "📗 Local-placement Anatolian, imam hatip, and vocational-technical high school options" };
            return {
                tur,
                not: { tr: "⚠️ Bu araç 2025 yerleştirme eğilimlerine göre ön izleme sunar. Kesin tercih için 2026 MEB kılavuzu ve e-Okul verileri esas alınmalıdır.", en: "⚠️ This tool previews ranges using 2025 placement trends. Use the 2026 MoNE guide and e-School data for final preferences." },
            };
        },
    "pmyo-puan-hesaplama": (v) => {
            const yksPuan = parseFloat(v.yksPuan) || 0;
            const fizikiPuan = parseFloat(v.fizikiPuan) || 0;
            const mulakatPuan = parseFloat(v.mulakatPuan) || 0;
            const girisPuani = (yksPuan * 0.25) + (fizikiPuan * 0.25) + (mulakatPuan * 0.5);
            const fizikiDurum = fizikiPuan >= 60
                ? { tr: "Barajı geçti", en: "Passed threshold" }
                : { tr: "Baraj altı", en: "Below threshold" };
            const mulakatDurum = mulakatPuan >= 70
                ? { tr: "Barajı geçti", en: "Passed threshold" }
                : { tr: "Baraj altı", en: "Below threshold" };
            const durum = fizikiPuan < 60
                ? { tr: "Fiziki yeterlilik barajı altında", en: "Below physical threshold" }
                : mulakatPuan < 70
                    ? { tr: "Mülakat barajı altında", en: "Below interview threshold" }
                    : { tr: "Başarı sıralamasına girebilir", en: "Can enter ranking evaluation" };
            return { girisPuani, fizikiDurum: fizikiDurum as any, mulakatDurum: mulakatDurum as any, durum: durum as any };
        },
    "pomem-puan-hesaplama": (v) => {
            const kpssPuan = parseFloat(v.kpssPuan) || 0;
            const fizikiPuan = parseFloat(v.fizikiPuan) || 0;
            const mulakatPuan = parseFloat(v.mulakatPuan) || 0;
            const girisPuani = (kpssPuan * 0.25) + (fizikiPuan * 0.25) + (mulakatPuan * 0.5);
            const fizikiDurum = fizikiPuan >= 60
                ? { tr: "Barajı geçti", en: "Passed threshold" }
                : { tr: "Baraj altı", en: "Below threshold" };
            const mulakatDurum = mulakatPuan >= 70
                ? { tr: "Barajı geçti", en: "Passed threshold" }
                : { tr: "Baraj altı", en: "Below threshold" };
            const durum = fizikiPuan < 60
                ? { tr: "Fiziki yeterlilik barajı altında", en: "Below physical threshold" }
                : mulakatPuan < 70
                    ? { tr: "Mülakat barajı altında", en: "Below interview threshold" }
                    : { tr: "Başarı sıralamasına girebilir", en: "Can enter ranking evaluation" };
            return { girisPuani, fizikiDurum: fizikiDurum as any, mulakatDurum: mulakatDurum as any, durum: durum as any };
        },
    "pybs-puan-hesaplama": (v) => {
            const net = (parseFloat(v.dogru) || 0) - (parseFloat(v.yanlis) || 0) / 3;
            const puan = 100 + ((Math.max(0, net) / 80) * 400);
            return { net, puan };
        },
    "ders-notu-hesaplama": (v) => {
            const scores = [v.exam1, v.exam2, v.exam3, v.oral, v.performance]
                .map((value) => parseFloat(value))
                .filter((value) => !isNaN(value) && value > 0);

            if (scores.length === 0) {
                return {
                    average: 0,
                    letterGrade: { tr: "Not girin", en: "Enter scores" } as any,
                    status: { tr: "Hesaplama için veri girin", en: "Enter data to calculate" } as any,
                };
            }

            const average = scores.reduce((sum, value) => sum + value, 0) / scores.length;
            const letterGrade = average >= 85
                ? { tr: "Pekiyi", en: "Excellent" }
                : average >= 70
                    ? { tr: "İyi", en: "Good" }
                    : average >= 60
                        ? { tr: "Orta", en: "Average" }
                        : average >= 50
                            ? { tr: "Geçer", en: "Pass" }
                            : { tr: "Zayıf", en: "Fail" };

            return {
                average,
                letterGrade: letterGrade as any,
                status: average >= 50
                    ? ({ tr: "Dersi geçiyorsunuz", en: "You are passing the course" } as any)
                    : ({ tr: "Ders tekrar riski var", en: "There is a retake risk" } as any),
            };
        },
    "e-okul-not-hesaplama": (v) => {
            let weighted = 0;
            let totalHours = 0;
            let weakCount = 0;

            for (let i = 1; i <= 6; i++) {
                const grade = parseFloat(v[`grade${i}`]);
                const hours = parseFloat(v[`hours${i}`]);

                if (!isNaN(grade) && !isNaN(hours) && hours > 0 && grade > 0) {
                    weighted += grade * hours;
                    totalHours += hours;
                    if (grade < 50) weakCount += 1;
                }
            }

            if (totalHours === 0) {
                return {
                    weightedAverage: 0,
                    totalHours: 0,
                    weakCount: 0,
                    status: { tr: "Ders bilgisi girin", en: "Enter course data" } as any,
                };
            }

            const weightedAverage = weighted / totalHours;

            return {
                weightedAverage,
                totalHours,
                weakCount,
                status: weakCount > 0
                    ? ({ tr: "Zayıf ders var, dikkat edilmeli", en: "There is at least one failing course" } as any)
                    : weightedAverage >= 50
                        ? ({ tr: "Ortalama yeterli görünüyor", en: "Average looks sufficient" } as any)
                        : ({ tr: "Ortalama düşük, risk var", en: "Average is low, there is risk" } as any),
            };
        },
    "lise-ortalama-hesaplama": (v) => {
            let totalWeighted = 0;
            let totalHours = 0;

            for (let i = 1; i <= 8; i++) {
                const grade = parseFloat(v[`grade${i}`]);
                const hours = parseFloat(v[`hours${i}`]);
                if (!isNaN(grade) && !isNaN(hours) && grade > 0 && hours > 0) {
                    totalWeighted += grade * hours;
                    totalHours += hours;
                }
            }

            if (totalHours === 0) {
                return {
                    average: 0,
                    totalHours: 0,
                    strongestBand: { tr: "Ders bilgisi girin", en: "Enter course data" } as any,
                };
            }

            const average = totalWeighted / totalHours;

            return {
                average,
                totalHours,
                strongestBand: average >= 85
                    ? ({ tr: "Ortalama çok güçlü", en: "Average is very strong" } as any)
                    : average >= 70
                        ? ({ tr: "Ortalama iyi seviyede", en: "Average is at a good level" } as any)
                        : average >= 50
                            ? ({ tr: "Ortalama geçer düzeyde", en: "Average is at pass level" } as any)
                            : ({ tr: "Ortalama riskli bölgede", en: "Average is in the risk zone" } as any),
            };
        },
    "ogg-sinav-puan-hesaplama": (v) => {
            const temelDogru = Math.min(Math.max(Math.round(parseFloat(v.temelEgitimDogru) || 0), 0), 100);
            const silahDogru = Math.min(Math.max(Math.round(parseFloat(v.silahBilgisiDogru) || 0), 0), 25);
            const atisSayisi = Math.min(Math.max(Math.round(parseFloat(v.atisSayisi) || 0), 0), 5);

            const temelPuan = temelDogru * 1;
            const silahPuan = silahDogru * 2;
            const atisPuan = atisSayisi * 10;
            const silahliAveraj = (temelPuan + silahPuan + atisPuan) / 2;
            const silahArtiAtis = silahPuan + atisPuan;

            let durumuTr = "";
            let durumuEn = "";

            const silahsizGecti = temelPuan >= 60;
            const silahliGecti = (silahliAveraj >= 60) && (temelPuan >= 50) && (silahArtiAtis >= 50);

            if (silahliGecti) {
                durumuTr = `SİLAHLI BAŞARILI ✓ — Ortalamanız ${silahliAveraj.toFixed(1)} ve tüm barajları aştınız. Silahlı ÖGG kartı alabilirsiniz.`;
                durumuEn = `PASSED (Armed) ✓ — Average ${silahliAveraj.toFixed(1)}.`;
            } else if (silahsizGecti) {
                durumuTr = `SİLAHSIZ BAŞARILI ⚠️ — Silahlı genel averajı veya barajı sağlayamadınız, ANCAK Temel Eğitimden ${temelPuan} aldığınız için SİLAHSIZ geçerli sayılırsınız.`;
                durumuEn = `PASSED (Unarmed) ⚠️ — Qualified for Unarmed.`;
            } else {
                durumuTr = `BAŞARISIZ ✗ — Silahlı ortalamanız ${silahliAveraj.toFixed(1)}. Silahsız için de gerekli 60 barajını (${temelPuan}) aşamadınız. Yeniden sınava girmeniz gereklidir.`;
                durumuEn = `FAILED ✗ — Score: ${silahliAveraj.toFixed(1)}.`;
            }

            return {
                temelPuan,
                silahPuan,
                atisPuan,
                silahliPuan: silahliAveraj,
                durumu: { tr: durumuTr, en: durumuEn } as unknown as number,
            };
        },
};

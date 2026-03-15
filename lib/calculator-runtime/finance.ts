import type { CalculatorRuntimeMap } from "@/lib/calculator-types";
import { getInflationIndex, getTurkishInflationIndex } from "@/lib/data/inflationData";
import { calculateBmi, calculateLoanPayment, calculateVatBreakdown, normalizeLoanType } from "@/mobile/src/sharedCalculations";

export const formulas: CalculatorRuntimeMap = {
    "eurobond-hesaplama": (v) => {
            const face = parseFloat(v.nominal) || 0;
            const pricePercent = (parseFloat(v.pricePercent) || 0) / 100;
            const couponRate = (parseFloat(v.couponRate) || 0) / 100;
            const years = parseFloat(v.years) || 0;
            const rate = parseFloat(v.usdRate) || 1;
            const couponFrequency = parseFloat(v.couponFrequency) === 1 ? 1 : 2;
            const couponTax = (parseFloat(v.couponTax) || 0) / 100;
            const purchaseCostUSD = face * pricePercent;
            const grossAnnualCouponUSD = face * couponRate;
            const annualCouponUSD = grossAnnualCouponUSD * (1 - couponTax);
            const couponPerPaymentUSD = annualCouponUSD / couponFrequency;
            const periods = Math.max(1, Math.round(years * couponFrequency));
            const totalCouponUSD = couponPerPaymentUSD * periods;
            const capitalGainUSD = face - purchaseCostUSD;
            const totalReturnUSD = face + totalCouponUSD;
            const totalReturnTRY = totalReturnUSD * rate;
            const currentYield = purchaseCostUSD > 0 ? (annualCouponUSD / purchaseCostUSD) * 100 : 0;

            let low = 0;
            let high = 1;
            let mid = 0;
            const periodCashFlow = face * couponRate / couponFrequency;
            for (let i = 0; i < 80; i++) {
                mid = (low + high) / 2;
                let presentValue = 0;
                for (let period = 1; period <= periods; period++) {
                    const cashFlow = period === periods ? periodCashFlow + face : periodCashFlow;
                    presentValue += cashFlow / Math.pow(1 + mid, period);
                }
                if (presentValue > purchaseCostUSD) {
                    low = mid;
                } else {
                    high = mid;
                }
            }
            const estimatedYTM = ((Math.pow(1 + mid, couponFrequency) - 1) * 100);

            return {
                purchaseCostUSD,
                couponPerPaymentUSD,
                annualCouponUSD,
                currentYield,
                estimatedYTM,
                capitalGainUSD,
                totalCouponUSD,
                totalReturnUSD,
                totalReturnTRY,
                summary: {
                    tr: `Tahvil ${pricePercent * 100}% fiyatla alındığında yaklaşık cari getiri %${currentYield.toFixed(2)} ve tahmini YTM %${estimatedYTM.toFixed(2)} oluyor.`,
                    en: `At a purchase price of ${(pricePercent * 100).toFixed(2)}% of par, the current yield is about ${currentYield.toFixed(2)}% and estimated YTM is ${estimatedYTM.toFixed(2)}%.`,
                },
            };
        },
    "gecmis-altin-fiyatlari": (v) => {
            // Yıllık ortalama veriler: [gramTRY, gramUSD, ounceUSD, usdtry]
            const data: Record<string, [number, number, number, number]> = {
                "2025": [4200, 95.5, 2971, 43.98],
                "2024": [2527, 76.8, 2389, 32.90],
                "2023": [1652, 62.4, 1941, 26.49],
                "2022": [959, 57.9, 1800, 16.56],
                "2021": [515, 57.8, 1799, 8.90],
                "2020": [399, 56.9, 1769, 7.01],
                "2019": [254, 44.8, 1393, 5.68],
                "2018": [197, 40.8, 1268, 4.82],
                "2017": [148, 40.4, 1257, 3.65],
                "2016": [121, 40.1, 1248, 3.02],
                "2015": [93, 34.1, 1061, 2.72],
                "2014": [90, 40.7, 1266, 2.19],
                "2013": [91, 45.3, 1411, 2.00],
                "2012": [97, 53.6, 1668, 1.80],
                "2011": [84, 50.5, 1572, 1.67],
                "2010": [59, 39.4, 1225, 1.50],
            };
            const prevYear = (parseInt(v.year) - 1).toString();
            const cur = data[v.year] ?? data["2024"];
            const prev = data[prevYear];
            const yoyChangePct = prev ? ((cur[0] - prev[0]) / prev[0]) * 100 : 0;
            return { gramTRY: cur[0], gramUSD: cur[1], ounceUSD: cur[2], usdtry: cur[3], yoyChangePct };
        },
    "gecmis-doviz-kurlari": (v) => {
            // [usdtry, eurtry, gbptry]
            const data: Record<string, [number, number, number]> = {
                "2026": [43.98, 46.50, 54.50],
                "2025": [36.50, 38.50, 45.50],
                "2024": [32.90, 35.60, 41.80],
                "2023": [23.75, 25.90, 30.10],
                "2022": [16.55, 17.40, 20.50],
                "2021": [8.85, 9.95, 11.80],
                "2020": [7.01, 8.00, 9.05],
                "2019": [5.68, 6.35, 7.30],
                "2018": [4.82, 5.70, 6.50],
                "2017": [3.65, 4.12, 4.80],
                "2016": [3.02, 3.34, 4.06],
                "2015": [2.72, 3.02, 4.18],
                "2014": [2.19, 2.91, 3.58],
                "2013": [1.90, 2.53, 3.01],
                "2012": [1.80, 2.31, 2.86],
                "2011": [1.67, 2.34, 2.68],
                "2010": [1.50, 2.00, 2.35],
            };
            const prevYear = (parseInt(v.year) - 1).toString();
            const cur = data[v.year] || data["2025"];
            const prev = data[prevYear];
            const usdYoY = prev ? ((cur[0] - prev[0]) / prev[0]) * 100 : 0;
            const eurYoY = prev ? ((cur[1] - prev[1]) / prev[1]) * 100 : 0;
            return {
                usdtry: cur[0],
                eurtry: cur[1],
                gbptry: cur[2],
                usdYoY,
                eurYoY,
            };
        },
    "tahvil-hesaplama": (v) => {
            const F = parseFloat(v.faceValue) || 100, C = (parseFloat(v.couponRate) || 0) / 100 * F;
            const r = (parseFloat(v.ytm) || 0) / 100, t = parseFloat(v.years) || 1;
            let price = 0;
            if (r === 0) price = (C * t) + F;
            else price = C * (1 - Math.pow(1 + r, -t)) / r + F / Math.pow(1 + r, t);
            return { bondPrice: price, annualIncome: C };
        },
    "vadeli-islem-fiyat-hesaplama": (v) => {
            const S = parseFloat(v.spot) || 0, r = (parseFloat(v.rate) || 0) / 100;
            const d = (parseFloat(v.dividend) || 0) / 100, T = (parseFloat(v.days) || 0) / 365;
            const fPrice = S * (1 + (r - d) * T);
            return { futuresPrice: fPrice, basis: fPrice - S };
        },
    "net-bugunku-deger-hesaplama": (v) => {
            const r = (parseFloat(v.rate) || 0) / 100, inv = parseFloat(v.inv) || 0;
            const flows = [parseFloat(v.c1) || 0, parseFloat(v.c2) || 0, parseFloat(v.c3) || 0];
            let npv = -inv;
            flows.forEach((f, i) => { npv += f / Math.pow(1 + r, i + 1); });
            return { npv, status: npv > 0 ? "Karlı / Kabul Edilebilir" : "Zararlı / Red" };
        },
    "ortalama-vade-hesaplama": (v) => {
            const p1 = parseFloat(v.p1) || 0, d1 = parseFloat(v.d1) || 0;
            const p2 = parseFloat(v.p2) || 0, d2 = parseFloat(v.d2) || 0;
            const total = p1 + p2;
            const avg = total > 0 ? (p1 * d1 + p2 * d2) / total : 0;
            return { avgDays: avg, totalAmount: total };
        },
    "parasal-deger-zaman-hesaplama": (v) => {
            const pv = parseFloat(v.pv) || 0, r = (parseFloat(v.rate) || 0) / 100, t = parseFloat(v.years) || 1;
            const fv = pv * Math.pow(1 + r, t);
            return { fv, diff: fv - pv };
        },
    "repo-hesaplama": (v) => {
            const P = parseFloat(v.amount) || 0, r = (parseFloat(v.rate) || 0) / 100;
            const t = parseFloat(v.days) || 1, tax = (parseFloat(v.tax) || 0) / 100;
            const basis = parseFloat(v.dayBasis) === 360 ? 360 : 365;
            const mode = v.mode === "rollover" ? "rollover" : "single";
            const rolloverCount = mode === "rollover" ? Math.max(1, Math.round(parseFloat(v.rolloverCount) || 1)) : 1;
            const grossReturn = (P * r * t) / basis;
            const netReturn = grossReturn * (1 - tax);
            const annualizedNetRate = P > 0 ? (netReturn / P) * (basis / t) * 100 : 0;

            let runningTotal = P;
            let totalGross = 0;
            let totalTaxAmount = 0;
            let totalNet = 0;
            const growthSchedule = [];

            for (let period = 1; period <= rolloverCount; period++) {
                const periodGross = (runningTotal * r * t) / basis;
                const periodTax = periodGross * tax;
                const periodNet = periodGross - periodTax;
                const end = runningTotal + periodNet;

                growthSchedule.push({
                    period,
                    start: runningTotal,
                    interest: periodNet,
                    end,
                });

                totalGross += periodGross;
                totalTaxAmount += periodTax;
                totalNet += periodNet;
                runningTotal = end;
            }

            return {
                gross: mode === "rollover" ? totalGross : grossReturn,
                net: mode === "rollover" ? totalNet : netReturn,
                total: P + netReturn,
                taxAmount: mode === "rollover" ? totalTaxAmount : grossReturn * tax,
                annualizedNetRate,
                finalTotal: runningTotal,
                growthSchedule,
                summary: mode === "rollover"
                    ? {
                        tr: `${rolloverCount} repo çevriminde toplam net kazanç ${totalNet.toLocaleString("tr-TR", { maximumFractionDigits: 2 })} TL oldu.`,
                        en: `Across ${rolloverCount} repo rolls, total net profit is ${totalNet.toLocaleString("en-US", { maximumFractionDigits: 2 })} TL.`,
                    }
                    : {
                        tr: `${t} günlük repo işleminin net getirisi ${netReturn.toLocaleString("tr-TR", { maximumFractionDigits: 2 })} TL olarak hesaplandı.`,
                        en: `The net profit of the ${t}-day repo is ${netReturn.toLocaleString("en-US", { maximumFractionDigits: 2 })} TL.`,
                    },
            };
        },
    "bilesik-buyume-hesaplama": (v) => {
            const start = parseFloat(v.startValue) || 1, end = parseFloat(v.endValue) || 0, t = parseFloat(v.years) || 1;
            const cagr = (Math.pow(end / start, 1 / t) - 1) * 100;
            const total = ((end - start) / start) * 100;
            return { cagr, totalGrowth: total };
        },
    "bono-hesaplama": (v) => {
            const face = parseFloat(v.nominal) || 0, price = parseFloat(v.price) || 1, days = parseFloat(v.days) || 1;
            const profit = face - price;
            const simple = (profit / price) * 100;
            const annual = (simple * 365) / days;
            return { simpleYield: simple, annualYield: annual, totalProfit: profit };
        },
    "iskonto-hesaplama": (v) => {
            const S = parseFloat(v.val) || 0, r = (parseFloat(v.rate) || 0) / 100, t = parseFloat(v.days) || 0;
            const external = (S * r * t) / 360;
            const internal = (S * r * t) / (360 + (r * t));
            return { internal, external };
        },
    "ic-verim-orani-hesaplama": (v) => {
            const flows = [parseFloat(v.inv) || 0, parseFloat(v.c1) || 0, parseFloat(v.c2) || 0, parseFloat(v.c3) || 0];
            let irr = 0.1;
            for (let i = 0; i < 20; i++) {
                let npv = 0, dNpv = 0;
                for (let t = 0; t < flows.length; t++) {
                    npv += flows[t] / Math.pow(1 + irr, t);
                    dNpv -= t * flows[t] / Math.pow(1 + irr, t + 1);
                }
                const newIrr = irr - npv / dNpv;
                if (Math.abs(newIrr - irr) < 0.0001) { irr = newIrr; break; }
                irr = newIrr;
            }
            return { irr: irr * 100 };
        },
    "altin-hesaplama": (v) => {
            const amount = parseFloat(v.amount) || 0;
            const customPrice = parseFloat(v.customPrice);
            const basePrice = parseFloat(v.goldType) || 3000;
            let unitPrice = basePrice;
            if (customPrice > 0) {
                if (v.goldType === "3000") unitPrice = customPrice;
                else {
                    const gramRatio = basePrice / 3000;
                    unitPrice = customPrice * gramRatio;
                }
            }
            return { total: amount * unitPrice, unitPrice };
        },
    "doviz-hesaplama": (v) => {
            const amount = parseFloat(v.amount) || 0;
            const rates: Record<string, number> = { "USD": 32.50, "EUR": 35.20, "GBP": 41.10, "TRY": 1 };
            let rate = v.customRate ? parseFloat(v.customRate) : (rates[v.from] / rates[v.to]);
            return { result: amount * rate, rateUsed: rate };
        },
    "birikim-hesaplama": (v) => {
            const mode = v.mode || "future-value";
            const frequency = v.frequency || "monthly";
            const currentSavings = parseFloat(v.currentSavings) || 0;
            const periodicContribution = parseFloat(v.periodicContribution) || 0;
            const duration = Math.max(0, Math.round(parseFloat(v.duration) || 0));
            const targetAmount = parseFloat(v.targetAmount) || 0;
            const annualRealReturn = (parseFloat(v.annualRealReturn) || 0) / 100;
            const periodsPerYear = frequency === "weekly" ? 52 : frequency === "yearly" ? 1 : 12;
            const ratePerPeriod = annualRealReturn / periodsPerYear;
            const frequencyLabel = frequency === "weekly"
                ? { tr: "hafta", en: "week" }
                : frequency === "yearly"
                    ? { tr: "yıl", en: "year" }
                    : { tr: "ay", en: "month" };

            const getFutureValue = (principal: number, contribution: number, periods: number) => {
                if (periods <= 0) return principal;
                if (ratePerPeriod === 0) return principal + contribution * periods;
                const futurePrincipal = principal * Math.pow(1 + ratePerPeriod, periods);
                const futureContributions = contribution * ((Math.pow(1 + ratePerPeriod, periods) - 1) / ratePerPeriod);
                return futurePrincipal + futureContributions;
            };

            if (mode === "future-value") {
                const futureValue = getFutureValue(currentSavings, periodicContribution, duration);
                const totalInvested = currentSavings + periodicContribution * duration;
                const totalGain = futureValue - totalInvested;

                return {
                    futureValue,
                    totalInvested,
                    totalGain,
                    summary: {
                        tr: `${duration} ${frequencyLabel.tr} boyunca düzenli birikimle ulaşılacak toplam tutar hesaplandı.`,
                        en: `The total amount after ${duration} ${frequencyLabel.en}${duration === 1 ? "" : "s"} of regular saving was calculated.`,
                    },
                };
            }

            if (mode === "time-to-goal") {
                if (targetAmount <= 0) {
                    return {
                        summary: {
                            tr: "Hedefe ulaşma süresini hesaplamak için geçerli bir hedef tutar girin.",
                            en: "Enter a valid target amount to calculate the time to goal.",
                        },
                    };
                }

                if (currentSavings >= targetAmount) {
                    return {
                        requiredPeriods: { tr: `0 ${frequencyLabel.tr}`, en: `0 ${frequencyLabel.en}` },
                        futureValue: currentSavings,
                        totalInvested: currentSavings,
                        totalGain: 0,
                        summary: {
                            tr: "Mevcut birikiminiz hedef tutara zaten ulaşmış durumda.",
                            en: "Your current savings have already reached the target amount.",
                        },
                    };
                }

                if (periodicContribution <= 0 && ratePerPeriod <= 0) {
                    return {
                        summary: {
                            tr: "Düzenli birikim veya pozitif reel getiri olmadan hedefe ulaşma süresi hesaplanamaz.",
                            en: "The time to goal cannot be calculated without regular contributions or a positive real return.",
                        },
                    };
                }

                let periods = 0;
                let futureValue = currentSavings;
                const maxPeriods = periodsPerYear * 200;

                while (futureValue < targetAmount && periods < maxPeriods) {
                    periods += 1;
                    futureValue = getFutureValue(currentSavings, periodicContribution, periods);
                }

                if (futureValue < targetAmount) {
                    return {
                        summary: {
                            tr: "Verilen katkı ve getiri varsayımıyla makul sürede hedefe ulaşılamıyor.",
                            en: "With the given contribution and return assumptions, the target is not reached in a reasonable timeframe.",
                        },
                    };
                }

                const totalInvested = currentSavings + periodicContribution * periods;
                const totalGain = futureValue - totalInvested;

                return {
                    requiredPeriods: {
                        tr: `${periods} ${frequencyLabel.tr}`,
                        en: `${periods} ${frequencyLabel.en}${periods === 1 ? "" : "s"}`,
                    },
                    futureValue,
                    totalInvested,
                    totalGain,
                    summary: {
                        tr: `Bu katkı planıyla hedef tutara yaklaşık ${periods} ${frequencyLabel.tr} içinde ulaşabilirsiniz.`,
                        en: `With this contribution plan, you can reach the target in about ${periods} ${frequencyLabel.en}${periods === 1 ? "" : "s"}.`,
                    },
                };
            }

            if (targetAmount <= 0 || duration <= 0) {
                return {
                    summary: {
                        tr: "Gerekli birikim tutarını hesaplamak için hedef tutar ve süre sıfırdan büyük olmalıdır.",
                        en: "To calculate the required contribution, both target amount and duration must be greater than zero.",
                    },
                };
            }

            let requiredContribution = 0;
            if (ratePerPeriod === 0) {
                requiredContribution = Math.max(0, (targetAmount - currentSavings) / duration);
            } else {
                const discountingBase = Math.pow(1 + ratePerPeriod, duration);
                const futurePrincipal = currentSavings * discountingBase;
                const annuityFactor = (discountingBase - 1) / ratePerPeriod;
                requiredContribution = annuityFactor === 0 ? 0 : Math.max(0, (targetAmount - futurePrincipal) / annuityFactor);
            }

            const futureValue = getFutureValue(currentSavings, requiredContribution, duration);
            const totalInvested = currentSavings + requiredContribution * duration;
            const totalGain = futureValue - totalInvested;

            return {
                futureValue,
                totalInvested,
                totalGain,
                requiredContribution,
                summary: {
                    tr: `${targetAmount.toLocaleString("tr-TR", { maximumFractionDigits: 0 })} TL hedefine ${duration} ${frequencyLabel.tr} içinde ulaşmak için gereken düzenli birikim hesaplandı.`,
                    en: `The regular contribution needed to reach ${targetAmount.toLocaleString("en-US", { maximumFractionDigits: 0 })} TL in ${duration} ${frequencyLabel.en}${duration === 1 ? "" : "s"} was calculated.`,
                },
            };
        },
    "iban-dogrulama": (v) => {
            const raw = v.iban.replace(/\s/g, "").toUpperCase();
            if (raw.length < 5) return { valid: "Hayır", message: "Girdiğiniz numara çok kısa." };
            const rearranged = raw.slice(4) + raw.slice(0, 4);
            let numeric = "";
            for (let i = 0; i < rearranged.length; i++) {
                const c = rearranged[i], code = c.charCodeAt(0);
                numeric += (code >= 65 && code <= 90) ? (code - 55).toString() : c;
            }
            let rem = 0;
            for (let i = 0; i < numeric.length; i += 7) {
                const chunk = rem.toString() + numeric.substring(i, i + 7);
                rem = parseInt(chunk) % 97;
            }
            const ok = rem === 1;
            return { valid: ok ? "Evet ✅" : "Hayır ❌", message: ok ? "IBAN matematiksel format olarak doğru." : "IBAN algoritması hatalı, lütfen tekrar kontrol edin." };
        },
    "ticari-arac-kredisi-hesaplama": (v) => {
            const p = parseFloat(v.amount) || 0;
            // Ticari Kredilerde KKDF %0'dır. Sadece BSMV %5 uygulanır. (taxFactor = 1.05)
            const nominalRate = (parseFloat(v.rate) || 0) / 100;
            const r = nominalRate * 1.05;
            const n = parseFloat(v.months) || 12;

            if (r === 0) return { monthly: p / n, totalInterest: 0, total: p };

            const monthly = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
            const total = monthly * n;
            const totalInterest = total - p;

            return { monthly, totalInterest, total };
        },
    "ticari-kredi-hesaplama": (v) => {
            const p = parseFloat(v.amount) || 0;
            // Ticari Kredi -> BSMV %5, KKDF %0
            const nominalRate = (parseFloat(v.rate) || 0) / 100;
            const r = nominalRate * 1.05;
            const n = parseFloat(v.months) || 12;

            if (r === 0) return { monthly: p / n, totalInterest: 0, total: p };

            const monthly = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
            const total = monthly * n;
            const totalInterest = total - p;

            return { monthly, totalInterest, total };
        },
    "ticari-ihtiyac-kredisi-hesaplama": (v) => {
            const p = parseFloat(v.amount) || 0;
            // Ticari Kredi -> BSMV %5, KKDF %0
            const nominalRate = (parseFloat(v.rate) || 0) / 100;
            const r = nominalRate * 1.05;
            const n = parseFloat(v.months) || 12;

            if (r === 0) return { monthly: p / n, totalInterest: 0, total: p };

            const monthly = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
            const total = monthly * n;
            const totalInterest = total - p;

            return { monthly, totalInterest, total };
        },
    "ihtiyac-kredisi-hesaplama": (v) => {
            const p = parseFloat(v.amount) || 0;
            const baseRate = (parseFloat(v.rate) || 0) / 100;
            const taxFactor = 1.30;
            const r = baseRate * taxFactor;
            const n = parseFloat(v.months) || 1;
            const fees = parseFloat(v.insurance) || 0;

            if (r === 0) {
                return {
                    monthly: p / n, totalPayment: p + fees, totalInterest: 0,
                    chart: { segments: [{ label: { tr: "Anapara", en: "Principal" }, value: p, colorClass: "bg-white", colorHex: "#ffffff" }] },
                    bankRatesList: [
                        { bank: "Ziraat Bankası", rate: "4.54" }, { bank: "Garanti BBVA", rate: "4.99" },
                        { bank: "İş Bankası", rate: "4.92" }, { bank: "Akbank", rate: "5.02" }
                    ]
                };
            }

            const monthly = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
            const totalPayment = (monthly * n) + fees;
            const totalInterest = (monthly * n) - p;

            return {
                monthly, totalPayment, totalInterest,
                bankRatesList: [
                    { bank: "Ziraat Bankası", rate: "4.54" }, { bank: "Garanti BBVA", rate: "4.99" },
                    { bank: "İş Bankası", rate: "4.92" }, { bank: "Akbank", rate: "5.02" }
                ],
                chart: {
                    segments: [
                        { label: { tr: "Anapara", en: "Principal" }, value: p, colorClass: "bg-white", colorHex: "#ffffff" },
                        { label: { tr: "Toplam Faiz & Vergi", en: "Interest & Tax" }, value: totalInterest, colorClass: "bg-destructive", colorHex: "hsl(var(--destructive))" },
                        ...(fees > 0 ? [{ label: { tr: "Masraflar", en: "Fees" }, value: fees, colorClass: "bg-muted", colorHex: "#94a3b8" }] : [])
                    ]
                }
            };
        },
    "konut-kredisi-hesaplama": (v) => {
            const p = parseFloat(v.amount) || 0;
            const r = (parseFloat(v.rate) || 0) / 100;
            const n = parseFloat(v.months) || 1;
            const fees = parseFloat(v.insurance) || 0;

            if (r === 0) {
                return {
                    monthly: p / n, totalPayment: p + fees, totalInterest: 0,
                    chart: { segments: [{ label: { tr: "Anapara", en: "Principal" }, value: p, colorClass: "bg-white", colorHex: "#ffffff" }] },
                    bankRatesList: [
                        { bank: "Ziraat Bankası", rate: "2.79" }, { bank: "VakıfBank", rate: "2.79" },
                        { bank: "Garanti BBVA", rate: "3.20" }, { bank: "Akbank", rate: "3.10" }
                    ]
                };
            }

            const monthly = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
            const totalPayment = (monthly * n) + fees;
            const totalInterest = (monthly * n) - p;

            return {
                monthly, totalPayment, totalInterest,
                bankRatesList: [
                    { bank: "Ziraat Bankası", rate: "2.79" }, { bank: "VakıfBank", rate: "2.79" },
                    { bank: "Garanti BBVA", rate: "3.20" }, { bank: "Akbank", rate: "3.10" }
                ],
                chart: {
                    segments: [
                        { label: { tr: "Anapara", en: "Principal" }, value: p, colorClass: "bg-white", colorHex: "#ffffff" },
                        { label: { tr: "Toplam Faiz", en: "Total Interest" }, value: totalInterest, colorClass: "bg-destructive", colorHex: "hsl(var(--destructive))" },
                        ...(fees > 0 ? [{ label: { tr: "Masraflar", en: "Fees" }, value: fees, colorClass: "bg-muted", colorHex: "#94a3b8" }] : [])
                    ]
                }
            };
        },
    "tasit-kredisi-hesaplama": (v) => {
            const p = parseFloat(v.amount) || 0;
            const taxFactor = 1.30;
            const baseRate = parseFloat(v.rate) / 100;
            const r = baseRate * taxFactor;
            const n = parseFloat(v.months) || 1;

            if (r === 0) {
                return {
                    monthly: p / n, totalPayment: p, totalInterest: 0,
                    chart: { segments: [{ label: { tr: "Anapara", en: "Principal" }, value: p, colorClass: "bg-white", colorHex: "#ffffff" }] },
                    bankRatesList: [
                        { bank: "Ziraat Bankası", rate: "3.99" }, { bank: "Garanti BBVA", rate: "4.69" },
                        { bank: "VakıfBank", rate: "4.30" }, { bank: "Akbank", rate: "4.49" }
                    ]
                };
            }

            const monthly = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
            const totalPayment = monthly * n;
            const totalInterest = totalPayment - p;

            return {
                monthly, totalPayment, totalInterest,
                bankRatesList: [
                    { bank: "Ziraat Bankası", rate: "3.99" }, { bank: "Garanti BBVA", rate: "4.69" },
                    { bank: "VakıfBank", rate: "4.30" }, { bank: "Akbank", rate: "4.49" }
                ],
                chart: {
                    segments: [
                        { label: { tr: "Anapara", en: "Principal" }, value: p, colorClass: "bg-white", colorHex: "#ffffff" },
                        { label: { tr: "Toplam Vergi & Faiz", en: "Tax & Interest" }, value: totalInterest, colorClass: "bg-destructive", colorHex: "hsl(var(--destructive))" },
                    ]
                }
            };
        },
    "kredi-karti-ek-taksit-hesaplama": (v) => {
            const amount = Math.max(0, parseFloat(v.amount) || 0);
            const nominalRate = Math.max(0, parseFloat(v.rate) || 0) / 100;
            const months = Math.max(0, Math.round(parseFloat(v.months) || 0));
            const processingFee = Math.max(0, parseFloat(v.processingFee) || 0);
            const taxMode = v.taxMode === "campaign" ? "campaign" : v.taxMode === "custom" ? "custom" : "standard";
            const customTaxRate = Math.max(0, parseFloat(v.customTaxRate) || 0) / 100;
            const taxRate = taxMode === "campaign" ? 0 : taxMode === "custom" ? customTaxRate : 0.30;
            const effectiveRate = nominalRate * (1 + taxRate);

            let monthly = 0;

            if (amount > 0 && effectiveRate > 0 && months > 0) {
                const powered = Math.pow(1 + effectiveRate, months);
                monthly = amount * effectiveRate * powered / (powered - 1);
            } else if (months > 0) {
                monthly = amount / months;
            }

            const totalInstallmentAmount = monthly * months;
            const interest = Math.max(0, totalInstallmentAmount - amount);
            const totalExtraCost = interest + processingFee;
            const extraCostRate = amount > 0 ? (totalExtraCost / amount) * 100 : 0;
            const total = totalInstallmentAmount + processingFee;
            const effectiveMonthlyRate = effectiveRate * 100;
            const effectiveYearlyRate = (Math.pow(1 + effectiveRate, 12) - 1) * 100;

            const schedule = [];
            let remaining = amount;
            for (let month = 1; month <= months; month++) {
                const monthInterest = effectiveRate > 0 ? remaining * effectiveRate : 0;
                let principal = monthly - monthInterest;

                if (effectiveRate === 0) {
                    principal = months > 0 ? amount / months : 0;
                }

                if (month === months) {
                    principal = remaining;
                }

                remaining = Math.max(0, remaining - principal);
                schedule.push({
                    month,
                    payment: monthly,
                    principal,
                    interest: monthInterest,
                    remaining,
                });
            }

            const taxLabel = taxMode === "campaign"
                ? { tr: "kampanya/vergisiz", en: "campaign/tax-free" }
                : taxMode === "custom"
                    ? { tr: `özel vergi yükü %${(taxRate * 100).toFixed(1)}`, en: `custom tax load ${(taxRate * 100).toFixed(1)}%` }
                    : { tr: "standart %30 vergi etkisi", en: "standard 30% tax effect" };

            const summary = {
                tr: `${amount.toLocaleString("tr-TR", { maximumFractionDigits: 2 })} TL ek taksit işleminde ${months} ay sonunda karttan toplam ${total.toLocaleString("tr-TR", { maximumFractionDigits: 2 })} TL çıkar. ${taxLabel.tr} ve ${processingFee.toLocaleString("tr-TR", { maximumFractionDigits: 2 })} TL işlem ücretiyle ek maliyet ${totalExtraCost.toLocaleString("tr-TR", { maximumFractionDigits: 2 })} TL olur.`,
                en: `On a ${amount.toLocaleString("en-US", { maximumFractionDigits: 2 })} TL extra-installment plan, a total of ${total.toLocaleString("en-US", { maximumFractionDigits: 2 })} TL is charged over ${months} months. With ${taxLabel.en} and a ${processingFee.toLocaleString("en-US", { maximumFractionDigits: 2 })} TL processing fee, the added cost becomes ${totalExtraCost.toLocaleString("en-US", { maximumFractionDigits: 2 })} TL.`
            };

            return {
                monthly,
                interest,
                processingFeeAmount: processingFee,
                totalExtraCost,
                extraCostRate,
                effectiveMonthlyRate,
                effectiveYearlyRate,
                total,
                schedule,
                summary,
                chart: {
                    segments: [
                        { label: { tr: "Anapara", en: "Principal" }, value: amount, colorClass: "bg-white", colorHex: "#ffffff" },
                        { label: { tr: "Faiz & Vergi", en: "Interest & Tax" }, value: interest, colorClass: "bg-destructive", colorHex: "hsl(var(--destructive))" },
                        { label: { tr: "İşlem Ücreti", en: "Processing Fee" }, value: processingFee, colorClass: "bg-muted", colorHex: "#94a3b8" }
                    ].filter((segment) => segment.value > 0)
                }
            };
        },
    "kredi-erken-kapama-hesaplama": (v) => {
            const P = parseFloat(v.loanAmount) || 0;
            const r = (parseFloat(v.interestRate) || 0) / 100;
            const N = parseFloat(v.totalMonths) || 1;
            const paid = parseFloat(v.paidMonths) || 0;

            if (r === 0 || N <= 0 || paid >= N) return { payoffAmount: 0, interestSaved: 0, standardRemaining: 0 };

            // Standard EMT (Aylık Taksit) calculation
            const emt = P * (r * Math.pow(1 + r, N)) / (Math.pow(1 + r, N) - 1);

            // Calculate remaining principal (Kalan Anapara)
            const remainingPrincipal = P * (Math.pow(1 + r, N) - Math.pow(1 + r, paid)) / (Math.pow(1 + r, N) - 1);

            const totalRemainingWithInterest = emt * (N - paid);
            const interestSaved = totalRemainingWithInterest - remainingPrincipal;

            return {
                payoffAmount: remainingPrincipal,
                interestSaved: interestSaved > 0 ? interestSaved : 0,
                standardRemaining: totalRemainingWithInterest
            };
        },
    "kredi-erken-kapatma-cezasi-hesaplama": (v) => {
            const remainingPrincipal = Math.max(0, parseFloat(v.remainingPrincipal) || 0);
            const remainingMonths = Math.max(0, parseFloat(v.remainingMonths) || 0);
            const loanType = v.loanType || "housing-fixed";

            let feeRate = 0;
            let legalNote = {
                tr: "Bu araç sabit faizli konut kredileri için yaygın kullanılan erken ödeme tazminatı kuralını esas alır.",
                en: "This tool applies the common early repayment compensation rule used for fixed-rate mortgages.",
            };

            if (loanType === "housing-fixed") {
                feeRate = remainingMonths > 36 ? 0.02 : 0.01;
                legalNote = remainingMonths > 36
                    ? {
                        tr: "Sabit faizli konut kredilerinde kalan vade 36 ayı aşıyorsa araç %2 tazminat üst sınırını uygular.",
                        en: "For fixed-rate mortgages with more than 36 months remaining, the tool applies the 2% upper-limit compensation rule.",
                    }
                    : {
                        tr: "Sabit faizli konut kredilerinde kalan vade 36 ay veya altındaysa araç %1 tazminat üst sınırını uygular.",
                        en: "For fixed-rate mortgages with 36 months or less remaining, the tool applies the 1% upper-limit compensation rule.",
                    };
            } else if (loanType === "housing-variable") {
                legalNote = {
                    tr: "Değişken faizli konut kredilerinde erken ödeme tazminatı uygulanmaması beklenir; bankanızın sözleşmesini yine de kontrol edin.",
                    en: "Variable-rate mortgages are generally expected not to charge early repayment compensation; still verify your contract with the bank.",
                };
            } else {
                legalNote = {
                    tr: "İhtiyaç, taşıt ve ticari kredilerde erken ödeme maliyeti ürün şartlarına göre değişebilir; bu araç konut kredisi üst sınırını referans alan hızlı bir ön kontroldür.",
                    en: "For personal, auto, and commercial loans, early payment costs may vary by product terms; this tool is a quick mortgage-based reference check.",
                };
            }

            const feeAmount = remainingPrincipal * feeRate;

            return {
                feeRatePercent: feeRate * 100,
                feeAmount,
                totalPayoff: remainingPrincipal + feeAmount,
                legalNote,
            };
        },
    "kdv-hesaplama": (v) => {
            const { baseAmount, vatAmount, totalAmount } = calculateVatBreakdown({
                amount: v.amount,
                ratePercent: v.rate,
                type: v.type,
            });
            if (v.type === "excluded") {
                return {
                    baseAmount,
                    vatAmount,
                    totalAmount,
                    chart: {
                        segments: [
                            { label: { tr: "Matrah", en: "Base Amount" }, value: baseAmount, colorClass: "bg-white", colorHex: "#ffffff" },
                            { label: { tr: "KDV Tutarı", en: "VAT Amount" }, value: vatAmount, colorClass: "bg-destructive", colorHex: "hsl(var(--destructive))" }
                        ]
                    }
                };
            } else {
                return {
                    baseAmount,
                    vatAmount,
                    totalAmount,
                    chart: {
                        segments: [
                            { label: { tr: "Matrah", en: "Base Amount" }, value: baseAmount, colorClass: "bg-white", colorHex: "#ffffff" },
                            { label: { tr: "KDV Tutarı", en: "VAT Amount" }, value: vatAmount, colorClass: "bg-destructive", colorHex: "hsl(var(--destructive))" }
                        ]
                    }
                };
            }
        },
    "basit-faiz-hesaplama": (v) => {
            const p = parseFloat(v.principal) || 0;
            const r = parseFloat(v.rate) / 100;
            const sure = parseFloat(v.sure) || 0;
            const periyot = v.periyot ?? "aylik";
            // Süreyi yıla çevir
            const tYil = periyot === "gunluk" ? sure / 365
                : periyot === "yillik" ? sure
                    : sure / 12; // aylik
            const interest = p * r * tYil;
            const dailyInterest = p * r / 365;
            return { interest, total: p + interest, dailyInterest };
        },
    "kredi-taksit-hesaplama": (v) => {
            const type = normalizeLoanType(v.loanType);
            const { monthlyPayment, totalPayment, totalInterest, amortizationSchedule } = calculateLoanPayment({
                principal: v.amount,
                monthlyRatePercent: v.rate,
                termMonths: v.months,
            });
            const principalAmount = Math.max(0, Number.parseFloat(String(v.amount ?? 0).replace(",", ".")) || 0);

            // Generate dummy but realistic rates based on loan type
            let bankRatesList: any[] = [];
            if (type === "tuketici") {
                bankRatesList = [
                    { bank: "Ziraat Bankası", rate: "4.54" },
                    { bank: "Garanti BBVA", rate: "4.99" },
                    { bank: "İş Bankası", rate: "4.92" },
                    { bank: "Akbank", rate: "5.02" }
                ];
            } else if (type === "tasit") {
                bankRatesList = [
                    { bank: "Ziraat Bankası", rate: "3.99" },
                    { bank: "Garanti BBVA", rate: "4.69" },
                    { bank: "VakıfBank", rate: "4.30" },
                    { bank: "Akbank", rate: "4.49" }
                ];
            } else if (type === "konut") {
                bankRatesList = [
                    { bank: "Ziraat Bankası", rate: "2.79" },
                    { bank: "VakıfBank", rate: "2.79" },
                    { bank: "Garanti BBVA", rate: "3.20" },
                    { bank: "Akbank", rate: "3.10" }
                ];
            }

            return {
                monthly: monthlyPayment,
                totalPayment,
                totalInterest,
                bankRatesList,
                amortizationSchedule,
                chart: {
                    segments: [
                        { label: { tr: "Anapara", en: "Principal" }, value: principalAmount, colorClass: "bg-white", colorHex: "#ffffff" },
                        { label: { tr: "Toplam Faiz", en: "Total Interest" }, value: totalInterest, colorClass: "bg-destructive", colorHex: "hsl(var(--destructive))" }
                    ]
                }
            };
        },
    "bilesik-faiz-hesaplama": (v) => {
            const p = parseFloat(v.principal) || 0;
            const r = parseFloat(v.rate) / 100;
            const t = parseFloat(v.years) || 0;
            const n = parseFloat(v.frequency) || 12;
            const total = p * Math.pow(1 + r / n, n * t);
            const totalInterest = total - p;

            const schedule = [];
            let currentBalance = p;

            for (let year = 1; year <= t; year++) {
                const yearEndBalance = p * Math.pow(1 + r / n, n * year);
                const yearInterest = yearEndBalance - currentBalance;
                schedule.push({
                    period: year,
                    start: currentBalance,
                    interest: yearInterest,
                    end: yearEndBalance
                });
                currentBalance = yearEndBalance;
            }

            return {
                total,
                interest: totalInterest,
                chart: {
                    segments: [
                        { label: { tr: "Anapara", en: "Principal" }, value: p, colorClass: "bg-white", colorHex: "#ffffff" },
                        { label: { tr: "Kazanılan", en: "Earned" }, value: totalInterest, colorClass: "bg-[#22c55e]", colorHex: "#22c55e" }
                    ]
                },
                growthSchedule: schedule
            };
        },
    "kira-artis-hesaplama": (v) => {
            const rent = parseFloat(v.currentRent) || 0;
            const rate = parseFloat(v.inflationRate) / 100;
            const increaseAmount = rent * rate;
            return { increaseAmount, newRent: rent + increaseAmount };
        },
    "kar-zarar-marji": (v) => {
            const turId = v.hesaplamaTuru || "kârOranı";
            let cost = parseFloat(v.cost) || 0;
            let price = parseFloat(v.price) || 0;
            let marginRate = parseFloat(v.marginRate) || 0;

            // Scenario 2: Calculate Price from Cost + Markup
            if (turId === "satışFiyatı") {
                price = cost * (1 + (marginRate / 100));
            }
            // Scenario 3: Calculate Cost from Price + Markup
            else if (turId === "alışFiyatı") {
                cost = price / (1 + (marginRate / 100));
            }

            // In all scenarios, compute standard metrics now that cost and price are resolved
            const profit = price - cost;
            const margin = price !== 0 ? (profit / price) * 100 : 0;
            const markup = cost !== 0 ? (profit / cost) * 100 : 0;

            // Logic to conditionally hide irrelevant inputs dynamically (via UI checks, or omitting results)
            let rawResults: Record<string, any> = {
                profit, chart: {
                    segments: [
                        { label: { tr: "Maliyet", en: "Cost" }, value: cost, colorClass: "bg-white", colorHex: "#ffffff" },
                        { label: { tr: profit >= 0 ? "Kâr" : "Zarar", en: profit >= 0 ? "Profit" : "Loss" }, value: Math.abs(profit), colorClass: profit >= 0 ? "bg-[#22c55e]" : "bg-destructive", colorHex: profit >= 0 ? "#22c55e" : "hsl(var(--destructive))" }
                    ]
                }
            };

            if (turId === "kârOranı") {
                rawResults.margin = margin;
                rawResults.markup = markup;
            } else if (turId === "satışFiyatı") {
                rawResults.priceParsed = price;
                rawResults.markup = markup;
                rawResults.margin = margin;
            } else if (turId === "alışFiyatı") {
                rawResults.costParsed = cost;
                rawResults.markup = markup;
                rawResults.margin = margin;
            }

            return rawResults;
        },
    "ne-kadar-kredi-alabilirim-hesaplama": (v) => {
            const income = parseFloat(v.income) || 0;
            const debts = parseFloat(v.otherDebts) || 0;
            const limitPercentage = parseFloat(v.loanType) / 100;
            const term = parseFloat(v.term) || 0;
            const interest = parseFloat(v.interestRate) || 0;
            const kkdf = parseFloat(v.kkdf) / 100 || 0;
            const bsmv = parseFloat(v.bsmv) / 100 || 0;

            let maxInstallment = (income * limitPercentage) - debts;
            if (maxInstallment <= 0) {
                return { maxInstallment: 0, maxLoan: 0, totalRepayment: 0 };
            }

            let effectiveRate = (interest / 100) * (1 + kkdf + bsmv);
            let maxLoan = 0;

            if (effectiveRate > 0 && term > 0) {
                const powered = Math.pow(1 + effectiveRate, term);
                maxLoan = maxInstallment * (powered - 1) / (effectiveRate * powered);
            } else if (term > 0) {
                maxLoan = maxInstallment * term;
            }

            const totalRepayment = maxInstallment * term;

            return { maxInstallment, maxLoan, totalRepayment };
        },
    "kredi-dosya-masrafi-hesaplama": (v) => {
            const amount = parseFloat(v.loanAmount) || 0;
            const bsmvRate = parseFloat(v.bsmv) / 100 || 0;

            const pureFee = amount * 0.005;
            const bsmvTax = pureFee * bsmvRate;
            const totalFee = pureFee + bsmvTax;

            return { pureFee, bsmvTax, totalFee };
        },
    "kredi-gecikme-faizi-hesaplama": (v) => {
            const amount = parseFloat(v.lateAmount) || 0;
            const days = parseFloat(v.daysLate) || 0;
            const akdi = parseFloat(v.contractRate) || 0;
            const kkdfAndBsmv = (parseFloat(v.kkdf) || 0) + (parseFloat(v.bsmv) || 0);

            const rawPenaltyRate = akdi * 1.30;
            const pureInterest = amount * (rawPenaltyRate / 30) * days / 100;
            const taxes = pureInterest * (kkdfAndBsmv / 100);
            const totalPenalty = pureInterest + taxes;

            return { penaltyRate: rawPenaltyRate, pureInterest, taxes, totalPenalty };
        },
    "kredi-karti-asgari-odeme-tutari-hesaplama": (v) => {
            const balance = parseFloat(v.statementBalance) || 0;
            const limit = parseFloat(v.cardLimit) || 0;
            const isNew = v.isNewCard === "1";

            let ratio = 20;
            const LIMIT_THRESHOLD = 50000;

            if (isNew) {
                ratio = 40;
            } else {
                if (limit > LIMIT_THRESHOLD) {
                    ratio = 40;
                } else {
                    ratio = 20;
                }
            }

            const minAmount = balance * (ratio / 100);
            const remainingBalance = balance - minAmount;

            return { ratio, minAmount, remainingBalance };
        },
    "is-yeri-ve-ticari-kredi-hesaplama": (v) => {
            const amount = parseFloat(v.loanAmount) || 0;
            const term = parseFloat(v.term) || 0;
            const interest = parseFloat(v.interestRate) || 0;
            const kkdf = parseFloat(v.kkdf) / 100 || 0;
            const bsmv = parseFloat(v.bsmv) / 100 || 0;

            let installment = 0;
            let totalRepayment = 0;
            let totalInterest = 0;

            let effectiveRate = (interest / 100) * (1 + kkdf + bsmv);

            if (effectiveRate > 0 && term > 0) {
                const powered = Math.pow(1 + effectiveRate, term);
                installment = amount * effectiveRate * powered / (powered - 1);
            } else if (term > 0) {
                installment = amount / term;
            }

            totalRepayment = installment * term;
            totalInterest = totalRepayment - amount;

            return { installment, totalInterest, totalRepayment };
        },
    "kredi-karti-taksitli-nakit-avans-hesaplama": (v) => {
            const amount = Math.max(0, parseFloat(v.advanceAmount) || 0);
            const term = Math.max(0, Math.round(parseFloat(v.term) || 0));
            const interest = Math.max(0, parseFloat(v.interestRate) || 0);
            const hasFee = v.hasFee === "yes";
            const extraFixedFee = Math.max(0, parseFloat(v.extraFixedFee) || 0);
            const taxMode = v.taxMode === "campaign" ? "campaign" : v.taxMode === "custom" ? "custom" : "standard";
            const customTaxRate = Math.max(0, parseFloat(v.customTaxRate) || 0) / 100;

            const taxRate = taxMode === "campaign" ? 0 : taxMode === "custom" ? customTaxRate : 0.30;
            const effectiveRate = (interest / 100) * (1 + taxRate);

            let installment = 0;
            let upfrontFee = 0;

            if (amount > 0 && effectiveRate > 0 && term > 0) {
                const powered = Math.pow(1 + effectiveRate, term);
                installment = amount * effectiveRate * powered / (powered - 1);
            } else if (term > 0) {
                installment = amount / term;
            }

            if (hasFee) {
                upfrontFee = amount * 0.01;
            }

            upfrontFee += extraFixedFee;

            const installmentTotal = installment * term;
            const totalInterest = installmentTotal - amount;
            const totalRepayment = installmentTotal + upfrontFee;
            const netCashReceived = Math.max(amount - upfrontFee, 0);
            const totalFinanceCost = totalRepayment - netCashReceived;
            const effectiveMonthlyRate = effectiveRate * 100;
            const effectiveYearlyRate = (Math.pow(1 + effectiveRate, 12) - 1) * 100;

            const amortizationSchedule = [];
            let remaining = amount;

            for (let month = 1; month <= term; month++) {
                const monthInterest = effectiveRate > 0 ? remaining * effectiveRate : 0;
                let principal = installment - monthInterest;

                if (effectiveRate === 0) {
                    principal = term > 0 ? amount / term : 0;
                }

                if (month === term) {
                    principal = remaining;
                }

                remaining = Math.max(0, remaining - principal);
                amortizationSchedule.push({
                    month,
                    payment: installment,
                    principal,
                    interest: monthInterest,
                    remaining,
                });
            }

            const taxLabel = taxMode === "campaign"
                ? { tr: "ek maliyet yok/kampanya", en: "campaign/no extra cost" }
                : taxMode === "custom"
                    ? { tr: `özel ek maliyet %${(taxRate * 100).toFixed(1)}`, en: `custom extra cost ${(taxRate * 100).toFixed(1)}%` }
                    : { tr: "varsayılan %30 maliyet etkisi", en: "default 30% cost effect" };

            const summary = {
                tr: `${amount.toLocaleString("tr-TR", { maximumFractionDigits: 2 })} TL nakit avans çekiminde peşin kesinti sonrası elinize net ${netCashReceived.toLocaleString("tr-TR", { maximumFractionDigits: 2 })} TL geçer. ${taxLabel.tr} ile aylık taksit ${installment.toLocaleString("tr-TR", { maximumFractionDigits: 2 })} TL olur ve toplam finansman maliyeti ${totalFinanceCost.toLocaleString("tr-TR", { maximumFractionDigits: 2 })} TL seviyesine çıkar.`,
                en: `On a ${amount.toLocaleString("en-US", { maximumFractionDigits: 2 })} TL cash advance, you effectively receive ${netCashReceived.toLocaleString("en-US", { maximumFractionDigits: 2 })} TL after upfront deductions. With ${taxLabel.en} applied, the monthly installment becomes ${installment.toLocaleString("en-US", { maximumFractionDigits: 2 })} TL and the total financing cost rises to ${totalFinanceCost.toLocaleString("en-US", { maximumFractionDigits: 2 })} TL.`
            };

            return {
                installment,
                netCashReceived,
                upfrontFee,
                totalInterest,
                totalFinanceCost,
                effectiveMonthlyRate,
                effectiveYearlyRate,
                totalRepayment,
                amortizationSchedule,
                summary,
            };
        },
    "kredi-karti-gecikme-faizi-hesaplama": (v) => {
            const statement = Math.max(0, parseFloat(v.statementAmount) || 0);
            let paid = Math.max(0, parseFloat(v.paidAmount) || 0);
            const minAllowed = Math.max(0, parseFloat(v.minRequired) || 0);
            const newSpending = Math.max(0, parseFloat(v.newSpending) || 0);
            const akdi = Math.max(0, parseFloat(v.akdiFaiz) || 0) / 100;
            const gecikme = Math.max(0, parseFloat(v.gecikmeFaiz) || 0) / 100;

            if (paid > statement) paid = statement;

            const unpaidAmount = statement - paid;
            const paymentCoverageRate = statement > 0 ? (paid / statement) * 100 : 0;

            let missingMin = minAllowed - paid;
            if (missingMin < 0) missingMin = 0;

            let akdiBaze = unpaidAmount - missingMin;
            if (akdiBaze < 0) akdiBaze = 0;

            const akdiIsleyenMatrah = akdiBaze * akdi;
            const gecikmeIsleyenMatrah = missingMin * gecikme;

            const pureInterestTotal = akdiIsleyenMatrah + gecikmeIsleyenMatrah;

            const taxes = pureInterestTotal * 0.30;
            const totalReturn = pureInterestTotal + taxes;
            const nextCycleDebt = unpaidAmount + totalReturn + newSpending;
            const gracePeriodStatus = paid >= statement
                ? { tr: "Faizsiz dönem korunur. Yeni harcamalarınız anında faizlenmez.", en: "Grace period is preserved. New purchases do not start accruing interest immediately." }
                : paid >= minAllowed
                    ? { tr: "Asgari ödendi ancak faizsiz dönem bozulur. Devreden borca akdi faiz, yeni dönemdeki harcamalara da fiilen finansman yükü yansır.", en: "Minimum is covered but the grace period is lost. Rolled-over debt accrues contractual interest and new-cycle purchases effectively carry financing cost." }
                    : { tr: "Asgari eksik kaldı. Hem gecikme faizi hem akdi faiz çalışır; faizsiz dönem de kaybolur.", en: "Minimum is underpaid. Both penalty and contractual interest apply, and the grace period is lost." };
            const summary = paid >= statement
                ? {
                    tr: `Ekstrenin tamamı kapatıldığı için ${statement.toLocaleString("tr-TR", { maximumFractionDigits: 2 })} TL borç sıfırlanır. Yeni dönemde yalnızca ${newSpending.toLocaleString("tr-TR", { maximumFractionDigits: 2 })} TL yeni harcama taşınır ve faiz cezası oluşmaz.`,
                    en: `Because the full ${statement.toLocaleString("en-US", { maximumFractionDigits: 2 })} TL statement is paid, the balance resets to zero. Only the new ${newSpending.toLocaleString("en-US", { maximumFractionDigits: 2 })} TL spending carries into the next cycle with no interest penalty.`
                }
                : {
                    tr: `${paid.toLocaleString("tr-TR", { maximumFractionDigits: 2 })} TL ödeme sonrası ${unpaidAmount.toLocaleString("tr-TR", { maximumFractionDigits: 2 })} TL borç devreder. Bunun ${missingMin.toLocaleString("tr-TR", { maximumFractionDigits: 2 })} TL'lik kısmı gecikme faizi, kalan bölümü akdi faiz görür; vergilerle birlikte tahmini ek yük ${totalReturn.toLocaleString("tr-TR", { maximumFractionDigits: 2 })} TL olur.`,
                    en: `After paying ${paid.toLocaleString("en-US", { maximumFractionDigits: 2 })} TL, ${unpaidAmount.toLocaleString("en-US", { maximumFractionDigits: 2 })} TL rolls over. ${missingMin.toLocaleString("en-US", { maximumFractionDigits: 2 })} TL of that shortfall is charged penalty interest and the rest accrues contractual interest; with taxes, the added burden is about ${totalReturn.toLocaleString("en-US", { maximumFractionDigits: 2 })} TL.`
                };

            return {
                paymentCoverageRate,
                unpaidAmount,
                minimumShortfall: missingMin,
                akdiTutar: akdiIsleyenMatrah,
                gecikmeTutar: gecikmeIsleyenMatrah,
                taxes: taxes,
                totalInterestBilled: totalReturn,
                nextCycleDebt,
                gracePeriodStatus,
                summary
            };
        },
    "kredi-yapilandirma-hesaplama": (v) => {
            const principal = parseFloat(v.remainingPrincipal) || 0;
            const oldInst = parseFloat(v.oldInstallment) || 0;
            const oldTerm = parseFloat(v.oldRemainingTerm) || 0;
            const nInt = parseFloat(v.newInterest) / 100 || 0;
            const nTerm = parseFloat(v.newTerm) || 0;
            const penaltyPercent = parseFloat(v.earlyFeePercent) / 100 || 0;

            const oldTotalPay = oldInst * oldTerm;
            const earlyPenaltyFee = principal * penaltyPercent;

            // Dosya masrafi yasal olarak anaparanın maksimum binde 5 i kadardir 
            const dosyaMasrafi = principal * 0.005 * 1.15; // + BSMV 15
            const newRequiredLoan = principal + earlyPenaltyFee + dosyaMasrafi;

            const newEffectiveRate = nInt * 1.30;
            let newInstallment = 0;

            if (newEffectiveRate > 0 && nTerm > 0) {
                const powered = Math.pow(1 + newEffectiveRate, nTerm);
                newInstallment = newRequiredLoan * newEffectiveRate * powered / (powered - 1);
            } else if (nTerm > 0) {
                newInstallment = newRequiredLoan / nTerm;
            }

            const newTotalPay = newInstallment * nTerm;

            let diff = oldTotalPay - newTotalPay;
            let statusTr = "";
            let statusEn = "";

            if (diff > 0) {
                statusTr = `👍 Mantıklı İşlem. Cebinizde kalacak net tutar: ${diff.toLocaleString("tr-TR", { maximumFractionDigits: 2 })} TL`;
                statusEn = `Beneficial to restructure. Net Saving: ${diff.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
            } else {
                statusTr = `🛑 ZARAR! Matematiksel olarak mantıksız. Net Kaybınız: ${Math.abs(diff).toLocaleString("tr-TR", { maximumFractionDigits: 2 })} TL olur.`;
                statusEn = `Bad Idea! You lose money. Net Loss is: ${Math.abs(diff).toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
            }

            return {
                oldTotalPay,
                newRequiredLoan,
                newInstallment,
                newTotalPay,
                profitStatus: { tr: statusTr, en: statusEn } as any
            };
        },
    "kredi-yillik-maliyet-orani-hesaplama": (v) => {
            const amount = Math.max(0, parseFloat(v.loanAmount) || 0);
            const term = Math.max(0, parseFloat(v.term) || 0);
            const rate = Math.max(0, parseFloat(v.monthlyRate) || 0) / 100;
            const feeAll = Math.max(0, parseFloat(v.allocationFee) || 0);
            const feeIns = Math.max(0, parseFloat(v.insuranceFee) || 0);
            const loanType = v.loanType === "mortgage" ? "mortgage" : v.loanType === "custom" ? "custom" : "consumer";
            const customTaxRate = Math.max(0, parseFloat(v.customTaxRate) || 0) / 100;

            const taxRate = loanType === "mortgage" ? 0 : loanType === "custom" ? customTaxRate : 0.30;
            const effectiveMonthlyBankRate = rate * (1 + taxRate);
            const totalFees = feeAll + feeIns;
            const netCashReceived = Math.max(amount - totalFees, 0);

            let installment = 0;
            if (effectiveMonthlyBankRate > 0 && term > 0) {
                const powered = Math.pow(1 + effectiveMonthlyBankRate, term);
                installment = amount * effectiveMonthlyBankRate * powered / (powered - 1);
            } else if (term > 0) {
                installment = amount / term;
            }

            const totalRepaymentPaid = installment * term;
            const totalCost = totalRepaymentPaid + totalFees;
            const totalFinanceCharge = totalCost - netCashReceived;
            const feeBurdenRate = netCashReceived > 0 ? (totalFees / netCashReceived) * 100 : 0;

            let guess = effectiveMonthlyBankRate > 0 ? effectiveMonthlyBankRate : 0;

            if (term > 0 && installment > 0 && netCashReceived > 0) {
                let lowRate = 0;
                let highRate = Math.max(1, effectiveMonthlyBankRate + 0.5);

                for (let steps = 0; steps < 70; steps++) {
                    guess = (lowRate + highRate) / 2;

                    let presentValue = 0;
                    if (guess === 0) {
                        presentValue = installment * term;
                    } else {
                        presentValue = installment * (1 - Math.pow(1 + guess, -term)) / guess;
                    }

                    if (Math.abs(presentValue - netCashReceived) < 0.01) {
                        break;
                    }

                    if (presentValue > netCashReceived) {
                        lowRate = guess;
                    } else {
                        highRate = guess;
                    }
                }
            }

            const monthlyAPR = guess * 100;
            const yearlyAPR = (Math.pow(1 + guess, 12) - 1) * 100;
            const taxLabel = loanType === "mortgage"
                ? { tr: "Konut tipi vergi etkisi", en: "Mortgage tax profile" }
                : loanType === "custom"
                    ? { tr: `Özel vergi yükü %${(taxRate * 100).toFixed(1)}`, en: `Custom tax load ${(taxRate * 100).toFixed(1)}%` }
                    : { tr: "İhtiyaç/taşıt tipi %30 vergi etkisi", en: "Consumer-style 30% tax effect" };

            const summary = {
                tr: `${amount.toLocaleString("tr-TR", { maximumFractionDigits: 0 })} TL brüt kredide cebinize net ${netCashReceived.toLocaleString("tr-TR", { maximumFractionDigits: 2 })} TL geçiyor. ${taxLabel.tr} ve ${totalFees.toLocaleString("tr-TR", { maximumFractionDigits: 2 })} TL peşin kesinti ile kredinin gerçek yıllık maliyeti yaklaşık %${yearlyAPR.toFixed(2)} seviyesine çıkıyor.`,
                en: `On a gross ${amount.toLocaleString("en-US", { maximumFractionDigits: 0 })} TL loan, you effectively receive ${netCashReceived.toLocaleString("en-US", { maximumFractionDigits: 2 })} TL in cash. With ${taxLabel.en.toLowerCase()} and ${totalFees.toLocaleString("en-US", { maximumFractionDigits: 2 })} TL of upfront deductions, the true annual borrowing cost rises to roughly ${yearlyAPR.toFixed(2)}%.`
            };

            return {
                installment,
                netCashReceived,
                totalFees,
                totalFinanceCharge,
                feeBurdenRate,
                totalCost,
                monthlyAPR,
                yearlyAPR,
                summary
            };
        },
    "kredi-karti-islem-taksitlendirme-hesaplama": (v) => {
            const amount = parseFloat(v.purchaseAmount) || 0;
            const term = parseFloat(v.term) || 0;
            const interest = parseFloat(v.interestRate) || 0;

            const effectiveRate = (interest / 100) * 1.30;
            let installment = 0;

            if (amount > 0 && effectiveRate > 0 && term > 0) {
                const powered = Math.pow(1 + effectiveRate, term);
                installment = amount * effectiveRate * powered / (powered - 1);
            } else if (term > 0) {
                installment = amount / term;
            }

            const totalRepayment = installment * term;
            const interestFee = totalRepayment - amount;

            return { monthlyInstallment: installment, interestFee, totalRepayment };
        },
    "enflasyon-hesaplama": (v) => {
            const amount = Math.max(0, parseFloat(v.amount) || 0);
            const currency = v.currency === "USD" ? "USD" : "TL";
            const indexType = v.indexType === "yi-ufe" || v.indexType === "average" ? v.indexType : "tufe";
            const startDate = new Date(v.startDate || "2021-03-01");
            const endDate = new Date(v.endDate || "2026-03-01");

            const startYear = startDate.getFullYear() || 2021;
            const startMonth = (startDate.getMonth() || 0) + 1;

            const endYear = endDate.getFullYear() || 2026;
            const endMonth = (endDate.getMonth() || 0) + 1;

            const resolveIndex = (year: number, month: number) => {
                if (currency === "TL") {
                    return getTurkishInflationIndex(indexType, year, month);
                }

                return getInflationIndex("USD", year, month);
            };

            const startIndex = resolveIndex(startYear, startMonth);
            const endIndex = resolveIndex(endYear, endMonth);

            const inflationFactor = startIndex > 0 ? endIndex / startIndex : 0;
            const endValue = amount * inflationFactor;
            const difference = endValue - amount;
            const inflationRate = (inflationFactor - 1) * 100;
            const monthSpan = Math.max(0, Math.abs((endYear - startYear) * 12 + (endMonth - startMonth)));
            const annualizedInflation = monthSpan > 0 && inflationFactor > 0
                ? (Math.pow(inflationFactor, 12 / monthSpan) - 1) * 100
                : 0;
            const purchasingPowerRatio = inflationFactor > 0 ? (1 / inflationFactor) * 100 : 0;
            const coveredMonths = {
                tr: monthSpan === 0 ? "Aynı ay" : `${monthSpan} ay`,
                en: monthSpan === 0 ? "Same month" : `${monthSpan} months`
            };
            const indexLabel = currency === "USD"
                ? { tr: "ABD CPI", en: "US CPI" }
                : indexType === "yi-ufe"
                    ? { tr: "Yİ-ÜFE", en: "PPI" }
                    : indexType === "average"
                        ? { tr: "TÜFE-Yİ-ÜFE ortalaması", en: "CPI-PPI average" }
                        : { tr: "TÜFE", en: "CPI" };
            const directionText = inflationRate >= 0
                ? {
                    tr: `${amount.toLocaleString("tr-TR", { maximumFractionDigits: 2 })} ${currency} tutarındaki sepetin ${indexLabel.tr} bazında aynı alım gücünü koruması için ${endValue.toLocaleString("tr-TR", { maximumFractionDigits: 2 })} ${currency} seviyesine çıkması gerekir.`,
                    en: `A ${amount.toLocaleString("en-US", { maximumFractionDigits: 2 })} ${currency} basket must rise to ${endValue.toLocaleString("en-US", { maximumFractionDigits: 2 })} ${currency} to preserve the same purchasing power under ${indexLabel.en}.`
                }
                : {
                    tr: `${amount.toLocaleString("tr-TR", { maximumFractionDigits: 2 })} ${currency} tutarındaki sepetin ${indexLabel.tr} bazında endeks gerilemesi nedeniyle eşdeğer değeri ${endValue.toLocaleString("tr-TR", { maximumFractionDigits: 2 })} ${currency} seviyesine düşer.`,
                    en: `Under ${indexLabel.en}, the equivalent value of a ${amount.toLocaleString("en-US", { maximumFractionDigits: 2 })} ${currency} basket falls to ${endValue.toLocaleString("en-US", { maximumFractionDigits: 2 })} ${currency} because the index level is lower at the end date.`
                };

            return {
                startValue: amount,
                startIndex,
                endIndex,
                coveredMonths,
                endValue,
                difference,
                inflationRate,
                annualizedInflation,
                purchasingPowerRatio,
                inflationFactor,
                summary: directionText
            };
        },
    "mevduat-faiz-hesaplama": (v) => {
            const principal = parseFloat(v.principal) || 0;
            const annualRate = (parseFloat(v.rate) || 0) / 100;
            const days = parseFloat(v.days) || 1;
            const taxRate = (parseFloat(v.taxRate) || 0) / 100;
            const mode = v.mode === "rollover" ? "rollover" : "single";
            const rolloverCount = mode === "rollover" ? Math.max(1, Math.round(parseFloat(v.rolloverCount) || 1)) : 1;

            const grossInterest = principal * annualRate * (days / 365);
            const withholding = grossInterest * taxRate;
            const netInterest = grossInterest - withholding;
            const netTotal = principal + netInterest;
            const effectiveRate = (netInterest / principal) * (365 / days) * 100;

            let runningTotal = principal;
            let totalNetInterest = 0;
            let totalWithholding = 0;
            const growthSchedule = [];

            for (let period = 1; period <= rolloverCount; period++) {
                const periodGross = runningTotal * annualRate * (days / 365);
                const periodTax = periodGross * taxRate;
                const periodNet = periodGross - periodTax;
                const end = runningTotal + periodNet;

                growthSchedule.push({
                    period,
                    start: runningTotal,
                    interest: periodNet,
                    end,
                });

                totalNetInterest += periodNet;
                totalWithholding += periodTax;
                runningTotal = end;
            }

            return {
                grossInterest,
                withholding: mode === "rollover" ? totalWithholding : withholding,
                netInterest,
                netTotal,
                effectiveRate,
                finalTotal: runningTotal,
                totalNetInterest,
                growthSchedule,
                summary: mode === "rollover"
                    ? {
                        tr: `${rolloverCount} vadelik yenileme planında toplam net faiz ${totalNetInterest.toLocaleString("tr-TR", { maximumFractionDigits: 2 })} TL oldu.`,
                        en: `Across ${rolloverCount} rolled terms, total net interest reaches ${totalNetInterest.toLocaleString("en-US", { maximumFractionDigits: 2 })} TL.`,
                    }
                    : {
                        tr: `Tek vade sonunda net kazanç ${netInterest.toLocaleString("tr-TR", { maximumFractionDigits: 2 })} TL olarak hesaplandı.`,
                        en: `At single-term maturity, the net gain is ${netInterest.toLocaleString("en-US", { maximumFractionDigits: 2 })} TL.`,
                    },
            };
        },
    "kredi-karti-asgari-odeme": (v) => {
            const balance = Math.max(0, parseFloat(v.balance) || 0);
            const cardLimit = Math.max(0, parseFloat(v.cardLimit) || 0);
            const monthlyRate = Math.max(0, parseFloat(v.rate) || 0) / 100;
            const taxLoad = Math.max(0, parseFloat(v.taxLoad) || 0) / 100;
            const manualPayment = Math.max(0, parseFloat(v.manualPayment) || 0);
            const isNewCard = v.isNewCard === "yes";

            const appliedRatio = isNewCard ? 40 : cardLimit > 50000 ? 40 : 20;
            const minPayment = balance * (appliedRatio / 100);
            const effectiveMonthlyRate = monthlyRate * (1 + taxLoad);
            const monthlyInterest = balance * effectiveMonthlyRate;
            const remainingAfterMin = Math.max(0, balance + monthlyInterest - minPayment);
            const recommendedPayment = Math.max(minPayment, manualPayment);

            let bal = balance;
            let months = 0;
            let totalInterest = 0;
            const schedule = [];

            while (bal > 0.01 && months < 600) {
                months += 1;
                const interest = bal * effectiveMonthlyRate;
                let payment = recommendedPayment;

                if (payment <= 0) {
                    payment = Math.max(bal * (appliedRatio / 100), 50);
                }

                payment = Math.min(payment, bal + interest);
                const principal = Math.max(0, payment - interest);
                totalInterest += interest;
                bal = Math.max(0, bal + interest - payment);

                if (months <= 12) {
                    schedule.push({
                        month: months,
                        payment,
                        principal,
                        interest,
                        remaining: bal,
                    });
                }

                if (payment <= interest && bal > balance) {
                    months = 600;
                    break;
                }
            }

            const totalPaid = balance + totalInterest;
            const summary = months >= 600
                ? {
                    tr: `Seçtiğiniz ödeme tutarı (${recommendedPayment.toLocaleString("tr-TR", { maximumFractionDigits: 2 })} TL) faiz yükünü yeterince azaltmadığı için borç makul sürede kapanmıyor. Yasal asgari ödeme ${minPayment.toLocaleString("tr-TR", { maximumFractionDigits: 2 })} TL olsa da daha yüksek ödeme gerekir.`,
                    en: `Your chosen payment (${recommendedPayment.toLocaleString("en-US", { maximumFractionDigits: 2 })} TL) is not high enough to reduce the balance within a reasonable time. Even if the legal minimum is ${minPayment.toLocaleString("en-US", { maximumFractionDigits: 2 })} TL, a higher payment is needed.`
                }
                : {
                    tr: `${balance.toLocaleString("tr-TR", { maximumFractionDigits: 2 })} TL borçta yasal asgari oran %${appliedRatio} ve minimum ödeme ${minPayment.toLocaleString("tr-TR", { maximumFractionDigits: 2 })} TL olur. Ayda ${recommendedPayment.toLocaleString("tr-TR", { maximumFractionDigits: 2 })} TL ödeme ile borç yaklaşık ${months} ayda kapanır; toplam faiz ve vergi yükü ${totalInterest.toLocaleString("tr-TR", { maximumFractionDigits: 2 })} TL seviyesindedir.`,
                    en: `On a ${balance.toLocaleString("en-US", { maximumFractionDigits: 2 })} TL balance, the legal minimum ratio is ${appliedRatio}% and the minimum due becomes ${minPayment.toLocaleString("en-US", { maximumFractionDigits: 2 })} TL. Paying ${recommendedPayment.toLocaleString("en-US", { maximumFractionDigits: 2 })} TL per month closes the balance in about ${months} months, with total interest and tax cost around ${totalInterest.toLocaleString("en-US", { maximumFractionDigits: 2 })} TL.`
                };

            return { appliedRatio, minPayment, recommendedPayment, monthlyInterest, remainingAfterMin, totalMonths: months, totalInterest, totalPaid, summary, schedule };
        },
    "eurobond-getiri-hesaplama": (v) => {
            const fv = parseFloat(v.faceValue) || 0;
            const couponRate = (parseFloat(v.couponRate) || 0) / 100;
            const pricePct = (parseFloat(v.price) || 0) / 100;
            const years = parseFloat(v.years) || 1;
            const purchasePrice = fv * pricePct;
            const annualCoupon = fv * couponRate;
            const totalCoupon = annualCoupon * years;
            const capitalGain = fv - purchasePrice;
            const totalReturn = totalCoupon + capitalGain;
            // Basitleştirilmiş YTM
            const ytm = ((annualCoupon + capitalGain / years) / ((fv + purchasePrice) / 2)) * 100;
            return { purchasePrice, annualCoupon, totalCoupon, capitalGain, totalReturn, ytm };
        },
    "reel-getiri-hesaplama": (v) => {
            const nominal = (parseFloat(v.nominal) || 0) / 100;
            const inflation = (parseFloat(v.inflation) || 0) / 100;
            const amount = parseFloat(v.amount) || 0;
            const realReturn = ((1 + nominal) / (1 + inflation) - 1) * 100;
            const nominalGain = amount * nominal;
            const inflationLoss = amount * inflation;
            const realGain = amount * ((1 + nominal) / (1 + inflation) - 1);
            const verdict = realReturn >= 0 ? 1 : 0; // 1=kâr, 0=zarar
            return { realReturn, nominalGain, realGain, inflationLoss, verdict: verdict as unknown as number };
        },
};

import type { CalculatorRuntimeMap } from "@/lib/calculator-types";

export const formulas: CalculatorRuntimeMap = {
    "maas-hesaplama": (v) => {
            // ─── 2026 SABİTLERİ ────────────────────────────────────────
            const MIN_WAGE_GROSS = 33030;   // Asgari ücret brüt (2026)
            const SGK_RATE = 0.14;    // %14 SGK işçi payı
            const UNEMP_RATE = 0.01;    // %1 işsizlik sigortası
            const STAMP_RATE = 0.00759; // %0,759 damga vergisi

            // 2026 gelir vergisi dilimleri
            const TAX_BRACKETS = [
                { limit: 190000, rate: 0.15 },
                { limit: 400000, rate: 0.20 },
                { limit: 1500000, rate: 0.27 },
                { limit: 5300000, rate: 0.35 },
                { limit: Infinity, rate: 0.40 },
            ];

            // Yıllık kümülatif gelir vergisi hesabı
            function calcAnnualTax(annualBase: number): number {
                let tax = 0, prev = 0;
                for (const b of TAX_BRACKETS) {
                    if (annualBase <= prev) break;
                    tax += (Math.min(annualBase, b.limit) - prev) * b.rate;
                    prev = b.limit;
                }
                return tax;
            }

            // ─── BRÜTTEN NETE ─────────────────────────────────────────
            function grossToNet(gross: number) {
                const sgkWorker = gross * SGK_RATE;
                const unemployment = gross * UNEMP_RATE;
                const taxBase = gross - sgkWorker - unemployment;

                // Asgari ücret gelir vergisi istisnası
                const minWageTaxBase = MIN_WAGE_GROSS * (1 - SGK_RATE - UNEMP_RATE);
                const annualTax = calcAnnualTax(taxBase * 12);
                const minWageTax = calcAnnualTax(minWageTaxBase * 12);
                const monthlyIncomeTax = Math.max(0, (annualTax - minWageTax) / 12);

                // Damga vergisi: asgari ücrete kadar muaf
                const stampTax = gross <= MIN_WAGE_GROSS
                    ? 0
                    : Math.max(0, gross - MIN_WAGE_GROSS) * STAMP_RATE;

                const totalDeduction = sgkWorker + unemployment + monthlyIncomeTax + stampTax;
                const netSalary = gross - totalDeduction;

                return {
                    grossSalary: gross,
                    sgkWorker,
                    unemployment,
                    incomeTax: monthlyIncomeTax,
                    stampTax,
                    totalDeduction,
                    netSalary,
                    chart: {
                        segments: [
                            { label: { tr: "Net Maaş", en: "Net Salary" }, value: netSalary, colorClass: "bg-[#22c55e]", colorHex: "#22c55e" },
                            { label: { tr: "Kesintiler (SGK & Vergi)", en: "Deductions (Tax & SGK)" }, value: totalDeduction, colorClass: "bg-destructive", colorHex: "hsl(var(--destructive))" }
                        ]
                    }
                };
            }

            // ─── NETTEN BRÜTE (binary search) ─────────────────────────
            function netToGross(targetNet: number) {
                let lo = targetNet, hi = targetNet * 2.5;
                for (let i = 0; i < 60; i++) {
                    const mid = (lo + hi) / 2;
                    if (grossToNet(mid).netSalary < targetNet) lo = mid; else hi = mid;
                }
                return grossToNet((lo + hi) / 2);
            }

            const amount = parseFloat(v.salary) || 0;
            return v.calcType === "netToGross" ? netToGross(amount) : grossToNet(amount);
        },
    "kidem-tazminati-hesaplama": (v) => {
            // 2026 kıdem tazminatı tavanı (Ocak 2026) — brüt asgari ücretin yaklaşık 2 katı
            const CEILING_2026 = 55923.66; // Ocak 2026 kıdem tazminatı tavanı
            const STAMP_RATE = 0.00759;
            const gross = parseFloat(v.grossSalary) || 0;
            const years = parseFloat(v.years) || 0;
            const months = parseFloat(v.months) || 0;
            const totalMonths = years * 12 + months;
            const baseSalary = Math.min(gross, CEILING_2026);
            const grossAmount = baseSalary * (totalMonths / 12);
            const stampTax = grossAmount * STAMP_RATE;
            const netAmount = grossAmount - stampTax;
            return { baseSalary, totalMonths, grossAmount, stampTax, netAmount };
        },
    "ihbar-tazminati-hesaplama": (v) => {
            const monthly = parseFloat(v.grossSalary) || 0;
            const years = parseFloat(v.years) || 0;
            // İş Kanunu 17. madde ihbar süreleri
            let noticeDays = 0;
            if (years < 0.5) noticeDays = 0;
            else if (years < 1.5) noticeDays = 14;
            else if (years < 3) noticeDays = 28;
            else if (years < 5) noticeDays = 42;
            else noticeDays = 56;
            const dailySalary = monthly / 30;
            const grossAmount = dailySalary * noticeDays;
            const sgk = grossAmount * 0.155; // işveren SGK payı
            const incomeTax = grossAmount * 0.15;  // min dilim
            const stampTax = grossAmount * 0.00759;
            const netAmount = grossAmount - incomeTax - stampTax;
            return { noticeDays, dailySalary, grossAmount, sgk, incomeTax, stampTax, netAmount };
        },
    "asgari-ucret-hesaplama": (v) => {
            const DATA: Record<string, { gross: number; net: number }> = {
                jan2026: { gross: 33030.00, net: 28075.50 },
                jul2026: { gross: 36000.00, net: 30600.00 }, // tahmini
            };
            const d = DATA[v.period] ?? DATA.jan2026;
            const sgkEmployee = d.gross * 0.14;
            const unemploy = d.gross * 0.01;
            const sgkEmployer = d.gross * 0.155;
            const totalCost = d.gross + sgkEmployer;
            return { gross: d.gross, sgkEmployee, unemploy, net: d.net, sgkEmployer, totalCost };
        },
    "harcirah-yolluk-hesaplama": (v) => {
            const dr = parseFloat(v.dailyRate) || 0;
            const d = parseFloat(v.days) || 0;
            const dist = parseFloat(v.distance) || 0;
            const t = parseFloat(v.transport) || 0;
            const totalDaily = dr * d;
            const kmAllowance = dist * dr * 0.05; // Klasik memur yolluk formülü: mesafe * yevmiye * 0.05
            const totalAllowance = totalDaily + kmAllowance + t;
            return { totalDaily, kmAllowance, totalAllowance };
        },
    "damga-vergisi-hesaplama": (v) => {
            const rates: Record<string, number> = { kira: 1.89, hizmet: 9.48, taahhut: 9.48, ihale: 5.69, sozlesme: 9.48 };
            const rate = rates[v.docType] || 9.48;
            const amount = parseFloat(v.amount) || 0;
            return { rate, stampDuty: amount * (rate / 1000) };
        },
    "kdv-tevkifati-hesaplama": (v) => {
            const net = parseFloat(v.netAmount) || 0;
            const kdvRate = parseFloat(v.kdvRate) / 100;
            const [num, den] = v.withholdingRate.split("/").map(Number);
            const ratio = num / den;
            const totalKdv = net * kdvRate;
            const buyerKdv = totalKdv * ratio;
            const sellerKdv = totalKdv - buyerKdv;
            return { totalKdv, buyerKdv, sellerKdv, grandTotal: net + totalKdv };
        },
    "kurumlar-vergisi-hesaplama": (v) => {
            const profit = parseFloat(v.profit) || 0;
            const corporateTax = profit * 0.25;
            const provisionalTax = (profit / 4) * 0.25;
            return { corporateTax, provisionalTax, netProfit: profit - corporateTax };
        },
    "gelir-vergisi-hesaplama": (v) => {
            const income = parseFloat(v.income) || 0;
            const brackets = [{ limit: 190000, rate: 0.15 }, { limit: 400000, rate: 0.20 }, { limit: 1500000, rate: 0.27 }, { limit: 5300000, rate: 0.35 }, { limit: Infinity, rate: 0.40 }];
            let tax = 0, prev = 0;
            for (const b of brackets) { if (income <= prev) break; tax += (Math.min(income, b.limit) - prev) * b.rate; prev = b.limit; }
            const effectiveRate = income > 0 ? (tax / income) * 100 : 0;
            return { totalTax: tax, effectiveRate, netIncome: income - tax };
        },
    "kira-vergisi-hesaplama": (v) => {
            const rent = parseFloat(v.annualRent) || 0;
            const EXEMPTION = 47000;
            const expenseAfterExemption = v.expenseMethod === "goturu"
                ? (rent - EXEMPTION) * 0.25
                : parseFloat(v.actualExpense) || 0;
            const taxBase = Math.max(0, rent - EXEMPTION - expenseAfterExemption);
            const brackets = [{ limit: 190000, rate: 0.15 }, { limit: 400000, rate: 0.20 }, { limit: 1500000, rate: 0.27 }, { limit: Infinity, rate: 0.35 }];
            let tax = 0, prev = 0;
            for (const b of brackets) { if (taxBase <= prev) break; tax += (Math.min(taxBase, b.limit) - prev) * b.rate; prev = b.limit; }
            return { exemption: EXEMPTION, taxBase, incomeTax: tax };
        },
    "kira-stopaj-hesaplama": (v) => {
            const rent = parseFloat(v.monthlyRent) || 0;
            const withholdingTax = rent * 0.20;
            return { withholdingTax, netPayment: rent - withholdingTax, annualWithholding: withholdingTax * 12 };
        },
    "emlak-vergisi-hesaplama": (v) => {
            const rates: Record<string, number> = { konut_metro: 0.002, konut_diger: 0.001, isyeri_metro: 0.004, isyeri_diger: 0.002, arsa_metro: 0.006, arsa_diger: 0.003 };
            const rate = rates[v.propertyType] || 0.002;
            const value = parseFloat(v.value) || 0;
            const annualTax = value * rate;
            return { annualTax, installment: annualTax / 2 };
        },
    "konaklama-vergisi-hesaplama": (v) => {
            const price = parseFloat(v.price) || 0;
            const nights = parseFloat(v.nights) || 1;
            const baseTotal = price * nights;
            const accomTax = baseTotal * 0.02;
            const kdv = baseTotal * 0.10;
            return { baseTotal, accomTax, kdv, grandTotal: baseTotal + accomTax + kdv };
        },
    "kambiyo-vergisi-hesaplama": (v) => {
            const amount = parseFloat(v.amount) || 0;
            const rates: Record<string, number> = { doviz: 2, altin: 2, hisse: 1 };
            const rate = rates[v.transType] || 2;
            const taxAmount = amount * (rate / 1000);
            return { taxAmount, totalCost: amount + taxAmount };
        },
    "gumruk-vergisi-hesaplama": (v) => {
            const rates: Record<string, number> = { elektronik: 20, giyim: 12, kozmetik: 20, kitap: 0, gida: 25 };
            const dutyRate = rates[v.category] || 20;
            const value = parseFloat(v.value) || 0;
            const duty = value * (dutyRate / 100);
            const kdv = (value + duty) * 0.20;
            return { duty, kdv, total: value + duty + kdv };
        },
    "deger-artis-kazanci-vergisi": (v) => {
            const buy = parseFloat(v.buyPrice) || 0;
            const sell = parseFloat(v.sellPrice) || 0;
            const years = parseFloat(v.holdYears) || 0;
            const inf = parseFloat(v.inflation) / 100;
            if (years >= 5) return { adjustedCost: buy * Math.pow(1 + inf, years), gain: 0, tax: 0 };
            const adjustedCost = buy * Math.pow(1 + inf, years);
            const rawGain = Math.max(0, sell - adjustedCost);
            const EXEMPTION = 87000;
            const taxableGain = Math.max(0, rawGain - EXEMPTION);
            const brackets = [{ limit: 190000, rate: 0.15 }, { limit: 400000, rate: 0.20 }, { limit: 1500000, rate: 0.27 }, { limit: Infinity, rate: 0.35 }];
            let tax = 0, prev = 0;
            for (const b of brackets) { if (taxableGain <= prev) break; tax += (Math.min(taxableGain, b.limit) - prev) * b.rate; prev = b.limit; }
            return { adjustedCost, gain: rawGain, tax };
        },
    "degerli-konut-vergisi-hesaplama": (v) => {
            const val = parseFloat(v.value) || 0;
            const T1 = 9967000, T2 = 14951000, T3 = 19934000;
            if (val <= T1) return { taxBase: 0, annualTax: 0 };
            let tax = 0;
            if (val <= T2) { tax = (val - T1) * 0.003; }
            else if (val <= T3) { tax = (T2 - T1) * 0.003 + (val - T2) * 0.006; }
            else { tax = (T2 - T1) * 0.003 + (T3 - T2) * 0.006 + (val - T3) * 0.010; }
            return { taxBase: val - T1, annualTax: tax };
        },
    "veraset-intikal-vergisi-hesaplama": (v) => {
            const val = parseFloat(v.assetValue) || 0;
            const isMiras = v.transferType === "miras";
            const EXEMPTION = isMiras ? 1289716 : 27239;
            const taxBase = Math.max(0, val - EXEMPTION);
            const mirasBn = [{ l: 1100000, r: 0.01 }, { l: 2700000, r: 0.03 }, { l: 6000000, r: 0.05 }, { l: Infinity, r: 0.10 }];
            const bagisBn = [{ l: 1100000, r: 0.10 }, { l: 2700000, r: 0.15 }, { l: 6000000, r: 0.20 }, { l: Infinity, r: 0.30 }];
            const brackets = isMiras ? mirasBn : bagisBn;
            let tax = 0, prev = 0;
            for (const b of brackets) { if (taxBase <= prev) break; tax += (Math.min(taxBase, b.l) - prev) * b.r; prev = b.l; }
            return { exemption: EXEMPTION, taxBase, tax };
        },
    "vergi-gecikme-faizi-hesaplama": (v) => {
            const debt = parseFloat(v.taxDebt) || 0;
            const days = parseFloat(v.delayDays) || 0;
            const monthlyRates: Record<string, number> = { gecikme_zammi: 0.045, tecil_faizi: 0.025 };
            const daily = (monthlyRates[v.chargeType] || 0.045) / 30;
            const interestAmount = debt * daily * days;
            return { interestAmount, totalPayable: debt + interestAmount };
        },
};

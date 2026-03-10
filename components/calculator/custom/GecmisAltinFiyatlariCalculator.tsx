"use client";

import React, { useState, useMemo, useEffect } from "react";
import type { LanguageCode } from "@/lib/calculator-types";

interface Props {
    lang: LanguageCode;
}

interface YearData {
    gramTRY: number;
    gramUSD: number;
    ounceUSD: number;
    usdtry: number;
}

// Kaynak: TCMB, World Gold Council — yıllık ortalama piyasa verileri
const HISTORICAL: Record<string, YearData> = {
    "2010": { gramTRY:    59, gramUSD:  39.4, ounceUSD: 1225, usdtry:  1.50 },
    "2011": { gramTRY:    84, gramUSD:  50.5, ounceUSD: 1572, usdtry:  1.67 },
    "2012": { gramTRY:    97, gramUSD:  53.6, ounceUSD: 1668, usdtry:  1.80 },
    "2013": { gramTRY:    91, gramUSD:  45.3, ounceUSD: 1411, usdtry:  2.00 },
    "2014": { gramTRY:    90, gramUSD:  40.7, ounceUSD: 1266, usdtry:  2.19 },
    "2015": { gramTRY:    93, gramUSD:  34.1, ounceUSD: 1061, usdtry:  2.72 },
    "2016": { gramTRY:   121, gramUSD:  40.1, ounceUSD: 1248, usdtry:  3.02 },
    "2017": { gramTRY:   148, gramUSD:  40.4, ounceUSD: 1257, usdtry:  3.65 },
    "2018": { gramTRY:   197, gramUSD:  40.8, ounceUSD: 1268, usdtry:  4.82 },
    "2019": { gramTRY:   254, gramUSD:  44.8, ounceUSD: 1393, usdtry:  5.68 },
    "2020": { gramTRY:   399, gramUSD:  56.9, ounceUSD: 1769, usdtry:  7.01 },
    "2021": { gramTRY:   515, gramUSD:  57.8, ounceUSD: 1799, usdtry:  8.90 },
    "2022": { gramTRY:   959, gramUSD:  57.9, ounceUSD: 1800, usdtry: 16.56 },
    "2023": { gramTRY:  1652, gramUSD:  62.4, ounceUSD: 1941, usdtry: 26.49 },
    "2024": { gramTRY:  2527, gramUSD:  76.8, ounceUSD: 2389, usdtry: 32.90 },
    "2025": { gramTRY:  4200, gramUSD:  95.5, ounceUSD: 2971, usdtry: 43.98 },
};

// TÜFE birikimli çarpan (2010 baz → 2026 bugün)
const INF_MULTIPLIER: Record<string, number> = {
    "2010": 9.2, "2011": 8.1, "2012": 7.4, "2013": 6.8, "2014": 6.1,
    "2015": 5.6, "2016": 5.0, "2017": 4.3, "2018": 3.5, "2019": 2.9,
    "2020": 2.4, "2021": 1.9, "2022": 1.35, "2023": 1.15, "2024": 1.05, "2025": 1.02,
};

const YEARS = Object.keys(HISTORICAL).sort();
const CURRENT_YEAR_LABEL = "2026";
const FALLBACK_GRAM_TRY = 7350;

function fmt(n: number, dec = 0): string {
    return n.toLocaleString("tr-TR", {
        minimumFractionDigits: dec,
        maximumFractionDigits: dec,
    });
}

function pctClass(pct: number): string {
    if (pct >= 50) return "text-emerald-700 font-bold";
    if (pct >= 20) return "text-green-700 font-semibold";
    if (pct >= 0)  return "text-slate-600";
    return "text-red-600 font-semibold";
}

function pctBadge(pct: number): string {
    if (pct >= 50) return "bg-emerald-100 text-emerald-800";
    if (pct >= 20) return "bg-green-100 text-green-800";
    if (pct >= 0)  return "bg-slate-100 text-slate-600";
    return "bg-red-100 text-red-700";
}

export default function GecmisAltinFiyatlariCalculator({ lang: _lang }: Props) {
    const [livePrice,     setLivePrice]     = useState<number | null>(null);
    const [pricesLoading, setPricesLoading] = useState(true);
    const [investAmount,  setInvestAmount]  = useState("10000");
    const [investYear,    setInvestYear]    = useState("2015");
    const [investMode,    setInvestMode]    = useState<"try" | "gram">("try");

    useEffect(() => {
        let cancelled = false;
        async function load() {
            const [s, c] = await Promise.allSettled([
                fetch("/api/altin-fiyat").then((r) => r.ok ? r.json() : null),
                fetch("https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/xau.json")
                    .then((r) => r.ok ? r.json() : null),
            ]);
            if (cancelled) return;
            const sd = s.status === "fulfilled" ? s.value : null;
            if (sd?.gramPrice24k > 0) {
                setLivePrice(sd.gramPrice24k);
            } else {
                const cd = c.status === "fulfilled" ? c.value : null;
                const tryPerOz = cd?.xau?.try;
                if (tryPerOz > 0) setLivePrice(Math.round(tryPerOz / 31.1034768));
            }
            setPricesLoading(false);
        }
        void load();
        return () => { cancelled = true; };
    }, []);

    const currentGramTRY = livePrice ?? FALLBACK_GRAM_TRY;

    // Yatırım simülatörü
    const investResult = useMemo(() => {
        const amount = parseFloat(investAmount) || 0;
        const yearData = HISTORICAL[investYear];
        if (!yearData || amount <= 0) return null;

        const gramsBought = investMode === "try" ? amount / yearData.gramTRY : amount;
        const costTRY     = investMode === "try" ? amount : amount * yearData.gramTRY;
        const currentValue = gramsBought * currentGramTRY;
        const gainTRY      = currentValue - costTRY;
        const gainPct      = (gainTRY / costTRY) * 100;
        const multiplier   = currentValue / costTRY;
        const infValue     = costTRY * (INF_MULTIPLIER[investYear] ?? 1);
        const realGain     = currentValue - infValue;

        return { gramsBought, costTRY, currentValue, gainTRY, gainPct, multiplier, infValue, realGain };
    }, [investAmount, investYear, investMode, currentGramTRY]);

    // Tablo (yeniden eskiye)
    const tableRows = useMemo(() =>
        YEARS.map((year, i) => {
            const data = HISTORICAL[year];
            const prev = i > 0 ? HISTORICAL[YEARS[i - 1]] : null;
            const yoy  = prev ? ((data.gramTRY - prev.gramTRY) / prev.gramTRY) * 100 : null;
            return { year, ...data, yoy };
        }).reverse(),
    []);

    // SVG sparkline (tüm yıllar + canlı fiyat)
    const chart = useMemo(() => {
        const vals = [...YEARS.map((y) => HISTORICAL[y].gramTRY), currentGramTRY];
        const max  = Math.max(...vals);
        const min  = Math.min(...vals);
        const rng  = max - min || 1;
        const W = 400, H = 88;
        const pts = vals.map((v, i) => {
            const x = (i / (vals.length - 1)) * W;
            const y = H - ((v - min) / rng) * (H - 14) - 7;
            return `${x.toFixed(1)},${y.toFixed(1)}`;
        });
        return { pts: pts.join(" "), lastX: W, lastY: 7, W, H };
    }, [currentGramTRY]);

    // 2026 YoY vs 2025
    const yoy2026 = ((currentGramTRY - HISTORICAL["2025"].gramTRY) / HISTORICAL["2025"].gramTRY) * 100;
    // USD/TRY implication from live price
    const usdtry2026 = currentGramTRY / (HISTORICAL["2026" as keyof typeof HISTORICAL]?.gramUSD ?? 96.7);

    const inputClass = "w-full rounded-xl border border-slate-300 bg-white py-2.5 px-4 text-sm text-slate-900 shadow-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200 transition";

    return (
        <div className="space-y-6">

            {/* ── Canlı Fiyat Bandı ──────────────────────────── */}
            <div className="rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50 px-5 py-3.5 flex flex-wrap items-center gap-x-6 gap-y-2 shadow-sm min-h-[52px]">
                {pricesLoading && (
                    <div className="flex gap-3 animate-pulse">
                        <div className="w-2 h-2 rounded-full bg-amber-300 mt-1" />
                        <div className="h-3 w-48 rounded bg-amber-200" />
                    </div>
                )}
                {!pricesLoading && (
                    <>
                        <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${livePrice ? "bg-green-500 animate-pulse" : "bg-amber-400"}`} />
                            <span className="text-xs font-bold text-amber-800 uppercase tracking-wide">
                                {livePrice ? "Canlı Fiyat" : "Tahmini"}
                            </span>
                        </div>
                        <span className="text-base font-extrabold text-amber-900">
                            Güncel Gram Altın: {fmt(currentGramTRY)} ₺
                        </span>
                        <span className="text-sm text-amber-700">
                            2010'dan bu yana <strong>{(currentGramTRY / HISTORICAL["2010"].gramTRY).toFixed(0)}×</strong> artış
                        </span>
                        <span className="text-sm text-amber-700 hidden sm:inline">
                            2025'e göre <span className={pctClass(yoy2026)}>+{yoy2026.toFixed(0)}%</span>
                        </span>
                    </>
                )}
            </div>

            {/* ── Grafik ─────────────────────────────────────── */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-base font-bold text-slate-900">Gram Altın TL Fiyatı — 2010–{CURRENT_YEAR_LABEL}</h2>
                    <span className="text-xs text-slate-400 hidden sm:inline">Yıllık ortalama · {CURRENT_YEAR_LABEL} canlı</span>
                </div>
                <div className="overflow-x-auto">
                    <svg
                        viewBox={`0 0 ${chart.W} ${chart.H}`}
                        style={{ width: "100%", minWidth: 280, height: 88 }}
                        aria-label="Gram altın TRY fiyat grafiği 2010–2026"
                    >
                        <defs>
                            <linearGradient id="gag" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%"   stopColor="#f59e0b" stopOpacity="0.28" />
                                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.02" />
                            </linearGradient>
                        </defs>
                        <polyline
                            points={`0,${chart.H} ${chart.pts} ${chart.W},${chart.H}`}
                            fill="url(#gag)" stroke="none"
                        />
                        <polyline
                            points={chart.pts}
                            fill="none" stroke="#d97706" strokeWidth="2.2"
                            strokeLinecap="round" strokeLinejoin="round"
                        />
                        <circle cx={chart.lastX} cy={chart.lastY} r="5" fill="#d97706" />
                        <circle cx={chart.lastX} cy={chart.lastY} r="8" fill="#d97706" fillOpacity="0.2" />
                    </svg>
                </div>
                <div className="flex justify-between text-xs text-slate-400 mt-1 px-0.5">
                    {["2010", "2012", "2014", "2016", "2018", "2020", "2022", "2024", "2026"].map((y) => (
                        <span key={y}>{y}</span>
                    ))}
                </div>
            </div>

            {/* ── Yatırım Simülatörü ─────────────────────────── */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4">
                    <h2 className="text-base font-bold text-slate-900">Yatırım Simülatörü</h2>
                    <p className="text-sm text-slate-500 mt-0.5">Geçmişte yaptığınız altın alımının bugünkü değerini hesaplayın.</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-3 mb-4">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Yatırım Türü</label>
                        <div className="flex rounded-xl border border-slate-300 overflow-hidden text-sm shadow-sm">
                            {(["try", "gram"] as const).map((mode) => (
                                <button
                                    key={mode}
                                    type="button"
                                    onClick={() => setInvestMode(mode)}
                                    className={`flex-1 py-2.5 transition-colors ${
                                        investMode === mode
                                            ? "bg-amber-500 text-white font-semibold"
                                            : "bg-white text-slate-600 hover:bg-slate-50"
                                    }`}
                                >
                                    {mode === "try" ? "TL ile" : "Gram ile"}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">
                            {investMode === "try" ? "Yatırdığınız TL" : "Aldığınız Gram"}
                        </label>
                        <div className="relative">
                            <input
                                type="number" min="0" step="any"
                                value={investAmount}
                                onChange={(e) => setInvestAmount(e.target.value)}
                                placeholder={investMode === "try" ? "10000" : "10"}
                                className={inputClass + " pr-10"}
                            />
                            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                                {investMode === "try" ? "₺" : "g"}
                            </span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Alım Yılı</label>
                        <div className="relative">
                            <select
                                value={investYear}
                                onChange={(e) => setInvestYear(e.target.value)}
                                className={inputClass + " appearance-none pr-8"}
                            >
                                {YEARS.slice().reverse().map((y) => (
                                    <option key={y} value={y}>
                                        {y} — {fmt(HISTORICAL[y].gramTRY)} ₺/g
                                    </option>
                                ))}
                            </select>
                            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">▼</span>
                        </div>
                    </div>
                </div>

                {investResult && (
                    <div className="space-y-3">
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                            <div className="rounded-xl bg-slate-50 border border-slate-100 px-4 py-3.5">
                                <p className="text-xs text-slate-500 mb-1">Satın Alınan</p>
                                <p className="text-xl font-bold text-slate-800">
                                    {investResult.gramsBought.toLocaleString("tr-TR", { minimumFractionDigits: 3, maximumFractionDigits: 3 })} g
                                </p>
                                <p className="text-xs text-slate-400 mt-0.5">{investYear} ortalaması {fmt(HISTORICAL[investYear].gramTRY)} ₺/g</p>
                            </div>
                            <div className="rounded-xl bg-slate-50 border border-slate-100 px-4 py-3.5">
                                <p className="text-xs text-slate-500 mb-1">Maliyet ({investYear})</p>
                                <p className="text-xl font-bold text-slate-800">{fmt(investResult.costTRY)} ₺</p>
                                <p className="text-xs text-slate-400 mt-0.5">{investYear} TL değeri ile</p>
                            </div>
                            <div className="rounded-xl bg-green-50 border border-green-200 px-4 py-3.5">
                                <p className="text-xs text-slate-500 mb-1">Bugünkü Değer</p>
                                <p className="text-xl font-bold text-green-700">{fmt(investResult.currentValue)} ₺</p>
                                <p className="text-xs text-slate-400 mt-0.5">Güncel {fmt(currentGramTRY)} ₺/g ile</p>
                            </div>
                            <div className="rounded-xl bg-green-100 border-2 border-green-300 px-4 py-3.5">
                                <p className="text-xs text-slate-600 mb-1">Toplam Getiri</p>
                                <p className={`text-2xl font-extrabold ${investResult.gainTRY >= 0 ? "text-green-700" : "text-red-700"}`}>
                                    {investResult.gainTRY >= 0 ? "+" : ""}{fmt(investResult.gainPct, 0)}%
                                </p>
                                <p className="text-sm font-bold text-green-700 mt-0.5">
                                    {investResult.multiplier.toFixed(1)}× artış
                                </p>
                            </div>
                        </div>

                        <div className="rounded-xl bg-blue-50 border border-blue-100 px-4 py-3 text-sm">
                            <span className="text-slate-600">
                                📊 Aynı {fmt(investResult.costTRY)} ₺&apos;yi {investYear}&apos;dan bu yana enflasyon karşısında korusaydınız, yaklaşık{" "}
                                <strong className="text-slate-800">{fmt(investResult.infValue)} ₺</strong> değerinde olurdu.{" "}
                            </span>
                            <span className={`font-semibold ${investResult.realGain >= 0 ? "text-green-700" : "text-red-700"}`}>
                                Altın: enflasyona göre {investResult.realGain >= 0 ? "+" : ""}{fmt(investResult.realGain)} ₺ reel kazanç.
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* ── Tarihi Fiyat Tablosu ───────────────────────── */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100">
                    <h2 className="text-base font-bold text-slate-900">Yıllık Gram Altın Fiyat Tablosu (2010–{CURRENT_YEAR_LABEL})</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Yıllık ortalama piyasa değerleri. {CURRENT_YEAR_LABEL} satırı güncel canlı fiyata göre hesaplanmıştır.</p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                <th className="text-left px-5 py-3">Yıl</th>
                                <th className="text-right px-4 py-3">Gram ₺</th>
                                <th className="text-right px-4 py-3 hidden sm:table-cell">Gram $</th>
                                <th className="text-right px-4 py-3 hidden md:table-cell">Ons $</th>
                                <th className="text-right px-4 py-3 hidden md:table-cell">USD/TL</th>
                                <th className="text-right px-5 py-3">YoY</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {/* 2026 canlı satır */}
                            <tr className="bg-amber-50">
                                <td className="px-5 py-3">
                                    <span className="font-bold text-amber-800">{CURRENT_YEAR_LABEL}</span>
                                    <span className="ml-2 rounded-full bg-amber-200 px-1.5 py-0.5 text-xs font-semibold text-amber-900">canlı</span>
                                </td>
                                <td className="px-4 py-3 text-right font-extrabold text-amber-800">
                                    {pricesLoading ? <span className="text-slate-300 animate-pulse">...</span> : fmt(currentGramTRY)}
                                </td>
                                <td className="px-4 py-3 text-right text-slate-500 hidden sm:table-cell">
                                    {fmt(currentGramTRY / (usdtry2026 || 76), 1)}
                                </td>
                                <td className="px-4 py-3 text-right text-slate-500 hidden md:table-cell">~3.007</td>
                                <td className="px-4 py-3 text-right text-slate-500 hidden md:table-cell">
                                    {fmt(usdtry2026 || 76, 1)}
                                </td>
                                <td className="px-5 py-3 text-right">
                                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${pctBadge(yoy2026)}`}>
                                        +{yoy2026.toFixed(0)}%
                                    </span>
                                </td>
                            </tr>

                            {tableRows.map((row) => (
                                <tr key={row.year} className="hover:bg-slate-50/80 transition-colors">
                                    <td className="px-5 py-3 font-semibold text-slate-800">{row.year}</td>
                                    <td className="px-4 py-3 text-right font-bold text-slate-800">{fmt(row.gramTRY)}</td>
                                    <td className="px-4 py-3 text-right text-slate-500 hidden sm:table-cell">
                                        {row.gramUSD.toFixed(1)}
                                    </td>
                                    <td className="px-4 py-3 text-right text-slate-500 hidden md:table-cell">
                                        {fmt(row.ounceUSD)}
                                    </td>
                                    <td className="px-4 py-3 text-right text-slate-500 hidden md:table-cell">
                                        {row.usdtry.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </td>
                                    <td className="px-5 py-3 text-right">
                                        {row.yoy !== null ? (
                                            <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${pctBadge(row.yoy)}`}>
                                                {row.yoy >= 0 ? "+" : ""}{row.yoy.toFixed(0)}%
                                            </span>
                                        ) : (
                                            <span className="text-slate-300">—</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="px-5 py-3 bg-slate-50 border-t border-slate-100">
                    <p className="text-xs text-slate-400">
                        Kaynak: TCMB, World Gold Council — Veriler yıllık ortalama piyasa fiyatlarını yansıtmaktadır.
                        2025 tahmini, 2026 değeri güncel alış fiyatıdır.
                    </p>
                </div>
            </div>

            {/* ── Temel İstatistikler ─────────────────────────── */}
            <div className="grid gap-3 sm:grid-cols-3">
                {[
                    {
                        label: "En Yüksek Yıllık Artış",
                        value: "2022",
                        detail: "+86% (TL bazında)",
                        sub: "USD/TL kur şoku (+244%)",
                        color: "border-emerald-200 bg-emerald-50",
                        textColor: "text-emerald-800",
                    },
                    {
                        label: "En Düşük Yıllık Artış",
                        value: "2014",
                        detail: "-1% (gram TL)",
                        sub: "Ons bazında -14% düşüş",
                        color: "border-red-200 bg-red-50",
                        textColor: "text-red-800",
                    },
                    {
                        label: "15 Yıllık Toplam Artış",
                        value: `${((currentGramTRY / HISTORICAL["2010"].gramTRY - 1) * 100).toFixed(0)}%`,
                        detail: `59 ₺ → ${fmt(currentGramTRY)} ₺`,
                        sub: "2010–2026 gram TL",
                        color: "border-amber-200 bg-amber-50",
                        textColor: "text-amber-800",
                    },
                ].map((stat) => (
                    <div key={stat.label} className={`rounded-2xl border p-4 ${stat.color}`}>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">{stat.label}</p>
                        <p className={`text-2xl font-extrabold ${stat.textColor}`}>{stat.value}</p>
                        <p className="text-sm font-semibold text-slate-700 mt-0.5">{stat.detail}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{stat.sub}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

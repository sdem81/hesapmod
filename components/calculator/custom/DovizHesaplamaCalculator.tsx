"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import type { LanguageCode } from "@/lib/calculator-types";

interface Props {
    lang: LanguageCode;
}

interface RatesData {
    date: string;
    rates: Record<string, number>; // relative to USD (usd=1)
    source?: string;
}

const CURRENCIES: { code: string; name: string; flag: string; symbol: string }[] = [
    { code: "TRY", name: "Türk Lirası",         flag: "🇹🇷", symbol: "₺"   },
    { code: "USD", name: "Amerikan Doları",      flag: "🇺🇸", symbol: "$"   },
    { code: "EUR", name: "Euro",                 flag: "🇪🇺", symbol: "€"   },
    { code: "GBP", name: "İngiliz Sterlini",     flag: "🇬🇧", symbol: "£"   },
    { code: "CHF", name: "İsviçre Frangı",       flag: "🇨🇭", symbol: "Fr"  },
    { code: "JPY", name: "Japon Yeni",           flag: "🇯🇵", symbol: "¥"   },
    { code: "CAD", name: "Kanada Doları",        flag: "🇨🇦", symbol: "C$"  },
    { code: "AUD", name: "Avustralya Doları",    flag: "🇦🇺", symbol: "A$"  },
    { code: "CNY", name: "Çin Yuanı (Renminbi)", flag: "🇨🇳", symbol: "¥"   },
    { code: "SAR", name: "Suudi Riyali",         flag: "🇸🇦", symbol: "﷼"   },
    { code: "AED", name: "BAE Dirhemi",          flag: "🇦🇪", symbol: "د.إ" },
    { code: "KWD", name: "Kuveyt Dinarı",        flag: "🇰🇼", symbol: "د.ك" },
    { code: "QAR", name: "Katar Riyali",         flag: "🇶🇦", symbol: "ر.ق" },
    { code: "BHD", name: "Bahreyn Dinarı",       flag: "🇧🇭", symbol: ".د.ب"},
    { code: "EGP", name: "Mısır Poundu",         flag: "🇪🇬", symbol: "E£"  },
    { code: "RUB", name: "Rus Rublesi",          flag: "🇷🇺", symbol: "₽"   },
    { code: "SEK", name: "İsveç Kronu",          flag: "🇸🇪", symbol: "kr"  },
    { code: "NOK", name: "Norveç Kronu",         flag: "🇳🇴", symbol: "kr"  },
    { code: "DKK", name: "Danimarka Kronu",      flag: "🇩🇰", symbol: "kr"  },
    { code: "INR", name: "Hindistan Rupisi",     flag: "🇮🇳", symbol: "₹"   },
    { code: "MXN", name: "Meksika Pesosu",       flag: "🇲🇽", symbol: "$"   },
    { code: "BRL", name: "Brezilya Reali",       flag: "🇧🇷", symbol: "R$"  },
    { code: "PLN", name: "Polonya Zlotisi",      flag: "🇵🇱", symbol: "zł"  },
    { code: "HUF", name: "Macar Forinti",        flag: "🇭🇺", symbol: "Ft"  },
    { code: "CZK", name: "Çek Korunası",         flag: "🇨🇿", symbol: "Kč"  },
    { code: "RON", name: "Rumen Leyi",           flag: "🇷🇴", symbol: "lei" },
    { code: "NZD", name: "Yeni Zelanda Doları",  flag: "🇳🇿", symbol: "NZ$" },
];

// TRY'ye karşı gösterilecek popüler kurlar
const POPULAR_PAIRS = ["USD", "EUR", "GBP", "CHF", "JPY", "SAR", "AED", "KWD"];

function convert(amount: number, from: string, to: string, rates: Record<string, number>): number {
    if (from === to) return amount;
    const fromRate = rates[from.toLowerCase()];
    const toRate   = rates[to.toLowerCase()];
    if (!fromRate || !toRate) return 0;
    // Her iki kur USD bazlı; A→B = amount × (B_rate / A_rate)
    return amount * (toRate / fromRate);
}

function fmt(n: number, dec = 4): string {
    if (n === 0) return "—";
    return n.toLocaleString("tr-TR", {
        minimumFractionDigits: dec,
        maximumFractionDigits: dec,
    });
}

function fmtResult(n: number): string {
    if (n === 0) return "—";
    if (n >= 1) {
        return n.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 4 });
    }
    return n.toLocaleString("tr-TR", { minimumFractionDigits: 4, maximumFractionDigits: 6 });
}

function getCurrencyInfo(code: string) {
    return CURRENCIES.find((c) => c.code === code) ?? { code, name: code, flag: "🌐", symbol: code };
}

export default function DovizHesaplamaCalculator({ lang: _lang }: Props) {
    const [ratesData,    setRatesData]    = useState<RatesData | null>(null);
    const [loading,      setLoading]      = useState(true);
    const [amount,       setAmount]       = useState("1000");
    const [from,         setFrom]         = useState("USD");
    const [to,           setTo]           = useState("TRY");

    // Döviz kurlarını yükle — sunucu+CDN fallback
    useEffect(() => {
        let cancelled = false;

        async function loadRates() {
            const [serverRes, cdnRes] = await Promise.allSettled([
                fetch("/api/doviz-kur").then((r) => r.ok ? r.json() as Promise<RatesData> : null),
                fetch("https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json")
                    .then((r) => r.ok ? r.json() as Promise<{ date: string; usd: Record<string, number> }> : null),
            ]);

            if (cancelled) return;

            let data: RatesData | null = null;

            const serverData = serverRes.status === "fulfilled" ? serverRes.value : null;
            if (serverData?.rates?.try) {
                data = serverData;
            }

            if (!data) {
                const cdnData = cdnRes.status === "fulfilled" ? cdnRes.value : null;
                if (cdnData?.usd?.try) {
                    data = {
                        date: cdnData.date,
                        rates: { usd: 1, ...cdnData.usd },
                        source: "currency-api (CDN)",
                    };
                }
            }

            if (!cancelled) {
                setRatesData(data);
                setLoading(false);
            }
        }

        void loadRates();
        return () => { cancelled = true; };
    }, []);

    const swap = useCallback(() => {
        setFrom(to);
        setTo(from);
    }, [from, to]);

    const parsedAmount = parseFloat(amount) || 0;

    const converted = useMemo(() => {
        if (!ratesData) return null;
        return convert(parsedAmount, from, to, ratesData.rates);
    }, [parsedAmount, from, to, ratesData]);

    const rate = useMemo(() => {
        if (!ratesData) return null;
        return convert(1, from, to, ratesData.rates);
    }, [from, to, ratesData]);

    const inverseRate = useMemo(() => {
        if (!ratesData) return null;
        return convert(1, to, from, ratesData.rates);
    }, [from, to, ratesData]);

    const popularRates = useMemo(() => {
        if (!ratesData) return [];
        return POPULAR_PAIRS.filter((c) => c !== "TRY" && ratesData.rates[c.toLowerCase()]).map((pairCode) => ({
            ...getCurrencyInfo(pairCode),
            tryRate: convert(1, pairCode, "TRY", ratesData.rates),
        }));
    }, [ratesData]);

    const fromInfo = getCurrencyInfo(from);
    const toInfo   = getCurrencyInfo(to);

    const inputClass = "w-full rounded-xl border border-slate-300 bg-white py-2.5 px-4 text-sm text-slate-900 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition";
    const selectClass = "w-full rounded-xl border border-slate-300 bg-white py-2.5 px-4 text-sm text-slate-900 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition appearance-none";

    return (
        <div className="space-y-5">

            {/* ── Canlı Kur Bandı ──────────────────────────── */}
            <div className="rounded-2xl border border-slate-200 bg-white px-5 py-3.5 shadow-sm min-h-[52px]">
                {loading && (
                    <div className="flex items-center gap-3 animate-pulse">
                        <div className="w-2 h-2 rounded-full bg-slate-300" />
                        <div className="h-3 w-32 rounded bg-slate-200" />
                        {[1,2,3].map((i) => <div key={i} className="h-3 w-24 rounded bg-slate-100" />)}
                    </div>
                )}
                {!loading && !ratesData && (
                    <p className="text-xs text-slate-400">Canlı kur verisi alınamadı — işlem yapmaya devam edebilirsiniz.</p>
                )}
                {!loading && ratesData && (
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse flex-shrink-0" />
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Canlı Kurlar</span>
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 flex-1">
                            {popularRates.map(({ code, flag, tryRate }) => (
                                <span key={code} className="text-sm text-slate-600">
                                    {flag} <strong className="text-slate-800">{code}/TRY</strong>{" "}
                                    <strong className="text-blue-700">{fmt(tryRate, 2)}</strong>
                                </span>
                            ))}
                        </div>
                        <span className="text-xs text-slate-400 flex-shrink-0">
                            {ratesData.date} · {ratesData.source ?? "currency-api"}
                        </span>
                    </div>
                )}
            </div>

            {/* ── Çevirici ──────────────────────────────────── */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-base font-bold text-slate-900 mb-4">Döviz Çevirici</h2>

                <div className="grid gap-4 sm:grid-cols-[1fr_auto_1fr] items-end">

                    {/* Nereden */}
                    <div className="space-y-3">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Miktar</label>
                            <div className="relative">
                                <input
                                    type="number" min="0" step="any"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className={inputClass + " pr-14"}
                                    placeholder="1000"
                                />
                                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                                    {fromInfo.symbol}
                                </span>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Kaynak Para Birimi</label>
                            <div className="relative">
                                <select
                                    value={from}
                                    onChange={(e) => setFrom(e.target.value)}
                                    className={selectClass}
                                >
                                    {CURRENCIES.map((c) => (
                                        <option key={c.code} value={c.code}>
                                            {c.flag} {c.code} — {c.name}
                                        </option>
                                    ))}
                                </select>
                                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">▼</span>
                            </div>
                        </div>
                    </div>

                    {/* Swap butonu */}
                    <div className="flex justify-center pb-1">
                        <button
                            type="button"
                            onClick={swap}
                            title="Çevir"
                            className="w-11 h-11 flex items-center justify-center rounded-full border-2 border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:border-blue-400 transition-all text-lg font-bold shadow-sm"
                        >
                            ⇄
                        </button>
                    </div>

                    {/* Nereye */}
                    <div className="space-y-3">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Sonuç</label>
                            <div className="relative">
                                <div className={`${inputClass} pr-14 bg-slate-50 font-bold text-slate-900 min-h-[42px] flex items-center`}>
                                    {loading ? (
                                        <div className="h-4 w-24 rounded bg-slate-200 animate-pulse" />
                                    ) : converted !== null ? (
                                        <span className="text-blue-700">{fmtResult(converted)}</span>
                                    ) : (
                                        <span className="text-slate-400">—</span>
                                    )}
                                </div>
                                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                                    {toInfo.symbol}
                                </span>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Hedef Para Birimi</label>
                            <div className="relative">
                                <select
                                    value={to}
                                    onChange={(e) => setTo(e.target.value)}
                                    className={selectClass}
                                >
                                    {CURRENCIES.map((c) => (
                                        <option key={c.code} value={c.code}>
                                            {c.flag} {c.code} — {c.name}
                                        </option>
                                    ))}
                                </select>
                                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">▼</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Kur bilgisi */}
                {!loading && rate !== null && from !== to && (
                    <div className="mt-4 rounded-xl bg-blue-50 border border-blue-100 px-4 py-3 flex flex-wrap gap-x-6 gap-y-1">
                        <p className="text-sm text-slate-700">
                            <span className="font-semibold">1 {fromInfo.flag} {from}</span>
                            {" = "}
                            <strong className="text-blue-700">{fmtResult(rate)} {toInfo.flag} {to}</strong>
                        </p>
                        <p className="text-sm text-slate-500">
                            1 {toInfo.flag} {to}
                            {" = "}
                            <span className="font-medium text-slate-700">{inverseRate !== null ? fmtResult(inverseRate) : "—"} {fromInfo.flag} {from}</span>
                        </p>
                    </div>
                )}

                {/* Sonuç özeti */}
                {!loading && converted !== null && parsedAmount > 0 && from !== to && (
                    <div className="mt-3 rounded-xl border-2 border-blue-200 bg-white px-5 py-4 flex flex-wrap items-baseline justify-between gap-3">
                        <div>
                            <p className="text-sm text-slate-500 mb-0.5">Çevirme Sonucu</p>
                            <p className="text-2xl font-extrabold text-blue-700">
                                {fmtResult(converted)}{" "}
                                <span className="text-base font-semibold text-slate-500">{toInfo.code}</span>
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-slate-400">Kaynak miktar</p>
                            <p className="text-lg font-bold text-slate-700">
                                {parsedAmount.toLocaleString("tr-TR")}{" "}
                                <span className="text-sm text-slate-400">{fromInfo.code}</span>
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* ── Popüler Kurlar (TRY karşısında) ──────────── */}
            {!loading && ratesData && (
                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-100">
                        <h2 className="text-base font-bold text-slate-900">Popüler Kurlar — TRY Karşısında</h2>
                        <p className="mt-0.5 text-xs text-slate-500">1 birim yabancı para karşılığında Türk Lirası</p>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 divide-x divide-y divide-slate-100">
                        {popularRates.map(({ code, name, flag, tryRate }) => {
                            const isSelected = from === code || to === code;
                            return (
                                <button
                                    key={code}
                                    type="button"
                                    onClick={() => {
                                        if (to === "TRY") setFrom(code);
                                        else if (from === "TRY") setTo(code);
                                        else setFrom(code);
                                    }}
                                    className={`px-4 py-3.5 text-left transition-colors hover:bg-blue-50 ${isSelected ? "bg-blue-50/60" : ""}`}
                                >
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xl">{flag}</span>
                                        <span className="text-xs font-bold text-slate-500 uppercase">{code}</span>
                                        {isSelected && <span className="text-xs font-semibold text-blue-600">●</span>}
                                    </div>
                                    <p className="text-base font-bold text-slate-900">
                                        {fmt(tryRate, code === "JPY" ? 4 : 2)}{" "}
                                        <span className="text-xs font-normal text-slate-400">₺</span>
                                    </p>
                                    <p className="text-xs text-slate-400 truncate">{name}</p>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* ── Tüm Desteklenen Kurlar ────────────────────── */}
            {!loading && ratesData && (
                <details className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden group">
                    <summary className="px-5 py-4 cursor-pointer flex items-center justify-between select-none hover:bg-slate-50 transition-colors">
                        <div>
                            <h2 className="text-base font-bold text-slate-900">Tüm Desteklenen Para Birimleri</h2>
                            <p className="text-xs text-slate-500 mt-0.5">{CURRENCIES.length} para birimi — tıklayıp çevirici seçimine ekleyebilirsiniz</p>
                        </div>
                        <span className="text-slate-400 group-open:rotate-180 transition-transform text-sm">▼</span>
                    </summary>
                    <div className="border-t border-slate-100">
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 divide-x divide-y divide-slate-100">
                            {CURRENCIES.filter((c) => ratesData.rates[c.code.toLowerCase()]).map((c) => {
                                const tryValue = convert(1, c.code, "TRY", ratesData.rates);
                                const isSelected = from === c.code || to === c.code;
                                return (
                                    <button
                                        key={c.code}
                                        type="button"
                                        onClick={() => {
                                            if (to === "TRY") setFrom(c.code);
                                            else if (from === "TRY") setTo(c.code);
                                            else setFrom(c.code);
                                        }}
                                        className={`px-4 py-3.5 text-left transition-colors hover:bg-blue-50 ${isSelected ? "bg-blue-50/60" : ""}`}
                                    >
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-lg">{c.flag}</span>
                                            <span className="text-xs font-bold text-slate-600">{c.code}</span>
                                            {isSelected && <span className="text-xs text-blue-600">●</span>}
                                        </div>
                                        <p className="text-sm font-bold text-slate-800">
                                            {c.code === "TRY" ? "1,00" : fmt(tryValue, tryValue >= 1 ? 2 : 4)}{" "}
                                            <span className="text-xs font-normal text-slate-400">₺</span>
                                        </p>
                                        <p className="text-xs text-slate-400 truncate">{c.name}</p>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </details>
            )}
        </div>
    );
}

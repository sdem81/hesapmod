"use client";

import React, { useState, useMemo, useEffect } from "react";
import type { LanguageCode } from "@/lib/calculator-types";

interface LivePrices {
    gramPrice24k: number;
    hasAltinAlis?: number;
    hasAltinSatis?: number;
    ceyrekAlis?: number | null;
    ceyrekSatis?: number | null;
    ons?: number | null;
    tryPerOz: number;
    updatedAt: string;
    source?: string;
}

interface Props {
    lang: LanguageCode;
}

interface GoldType {
    id: string;
    name: string;
    ayar: number;
    totalWeight: number; // gram (alaşım dahil)
    pureGold: number;    // has altın gram (24K eşdeğeri)
    isCoin: boolean;
}

// Kaynak: Türkiye Cumhuriyet Merkez Bankası & IAB standart ağırlıkları
const GOLD_TYPES: GoldType[] = [
    { id: "gram24",  name: "Gram Altın (24 Ayar)",    ayar: 24, totalWeight: 1.0,      pureGold: 1.0,      isCoin: false },
    { id: "gram22",  name: "Gram Altın (22 Ayar)",    ayar: 22, totalWeight: 1.0,      pureGold: 22 / 24,  isCoin: false },
    { id: "gram18",  name: "Gram Altın (18 Ayar)",    ayar: 18, totalWeight: 1.0,      pureGold: 18 / 24,  isCoin: false },
    { id: "gram14",  name: "Gram Altın (14 Ayar)",    ayar: 14, totalWeight: 1.0,      pureGold: 14 / 24,  isCoin: false },
    { id: "ceyrek",  name: "Çeyrek Altın",            ayar: 22, totalWeight: 1.754,    pureGold: 1.604,    isCoin: true  },
    { id: "yarim",   name: "Yarım Altın",             ayar: 22, totalWeight: 3.508,    pureGold: 3.208,    isCoin: true  },
    { id: "tam",     name: "Tam / Ziynet Altın",      ayar: 22, totalWeight: 7.016,    pureGold: 6.416,    isCoin: true  },
    { id: "ata",     name: "Ata Cumhuriyet Altını",   ayar: 22, totalWeight: 7.200,    pureGold: 6.600,    isCoin: true  },
    { id: "resat",   name: "Reşat / Hamit Altın",     ayar: 22, totalWeight: 7.216,    pureGold: 6.614,    isCoin: true  },
    { id: "gremse",  name: "Gremse (2,5'luk)",        ayar: 22, totalWeight: 17.540,   pureGold: 16.038,   isCoin: true  },
    { id: "ons",     name: "1 Ons Altın",             ayar: 24, totalWeight: 31.1035,  pureGold: 31.1035,  isCoin: false },
];

function fmt(n: number, dec = 2): string {
    return n.toLocaleString("tr-TR", {
        minimumFractionDigits: dec,
        maximumFractionDigits: dec,
    });
}

function fmtW(n: number): string {
    return n.toLocaleString("tr-TR", {
        minimumFractionDigits: 3,
        maximumFractionDigits: 3,
    });
}

export default function AltinHesaplamaCalculator({ lang: _lang }: Props) {
    const [gramPrice,     setGramPrice]     = useState("");
    const [coinPremium,   setCoinPremium]   = useState("3");
    const [makas,         setMakas]         = useState("0.5");
    const [txType,        setTxType]        = useState<"buy" | "sell">("buy");
    const [quantities,    setQuantities]    = useState<Record<string, string>>(

        () => Object.fromEntries(GOLD_TYPES.map((g) => [g.id, "0"]))
    );
    const [livePrices,    setLivePrices]    = useState<LivePrices | null>(null);
    const [pricesLoading, setPricesLoading] = useState(true);

    // Canlı fiyat — asenkron, sayfa yüklemesini bloklamamak için useEffect
    useEffect(() => {
        let cancelled = false;

        async function loadPrices() {
            // Server route (altinkaynak.com) + fawazahmed0 currency API (XAU destekler, CORS açık)
            const [serverResult, fawazResult] = await Promise.allSettled([
                fetch("/api/altin-fiyat").then((r) => r.ok ? r.json() as Promise<LivePrices> : null),
                fetch("https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/xau.json")
                    .then((r) => r.ok ? r.json() as Promise<{ date?: string; xau?: { try?: number } }> : null),
            ]);

            if (cancelled) return;

            let data: LivePrices | null = null;

            // Server route başarılıysa kullan (altinkaynak.com)
            const serverData = serverResult.status === "fulfilled" ? serverResult.value : null;
            if (serverData?.gramPrice24k) {
                data = {
                    gramPrice24k: serverData.gramPrice24k,
                    hasAltinAlis: serverData.hasAltinAlis ?? serverData.gramPrice24k,
                    hasAltinSatis: serverData.hasAltinSatis ?? serverData.gramPrice24k,
                    ceyrekAlis: serverData.ceyrekAlis ?? null,
                    ceyrekSatis: serverData.ceyrekSatis ?? null,
                    ons: serverData.ons ?? null,
                    tryPerOz: serverData.tryPerOz ?? Math.round(serverData.gramPrice24k * 31.1034768),
                    updatedAt: serverData.updatedAt,
                    source: serverData.source ?? "altinkaynak.com",
                };
            }

            // Yoksa fawazahmed0/currency-api'dan hesapla (XAU→TRY, tarayıcıdan doğrudan)
            if (!data) {
                const fx = fawazResult.status === "fulfilled" ? fawazResult.value : null;
                const tryPerOz = fx?.xau?.try;
                if (tryPerOz && tryPerOz > 0) {
                    const gramPrice = Math.round(tryPerOz / 31.1034768);
                    data = {
                        gramPrice24k: gramPrice,
                        hasAltinAlis: gramPrice,
                        hasAltinSatis: gramPrice,
                        tryPerOz: Math.round(tryPerOz),
                        updatedAt: fx?.date ? `${fx.date}T12:00:00.000Z` : new Date().toISOString(),
                        source: "currency-api (ECB/XAU)",
                    };
                }
            }

            if (data) {
                setLivePrices(data);
                setGramPrice((prev) => (prev === "" ? String(data!.gramPrice24k) : prev));
            }
            setPricesLoading(false);
        }

        void loadPrices();
        return () => { cancelled = true; };
    }, []);

    const parsedGram    = Math.max(0, parseFloat(gramPrice)   || 0);
    const parsedPremium = Math.max(0, parseFloat(coinPremium) || 0);
    const parsedMakas   = Math.max(0, parseFloat(makas)       || 0);

    const rows = useMemo(() =>
        GOLD_TYPES.map((g) => {
            const coinFactor  = g.isCoin ? (1 + parsedPremium / 100) : 1;
            const spotUnit    = g.pureGold * parsedGram * coinFactor;
            const makasFactor = parsedMakas / 100;
            const unitPrice   = txType === "buy"
                ? spotUnit * (1 + makasFactor)
                : spotUnit * (1 - makasFactor);
            const qty   = parseFloat(quantities[g.id]) || 0;
            const total = unitPrice * qty;
            return { ...g, unitPrice, spotUnit, qty, total };
        }),
        [parsedGram, parsedPremium, parsedMakas, txType, quantities]
    );

    const totals = useMemo(() => ({
        hasGold : rows.reduce((s, r) => s + r.pureGold   * r.qty, 0),
        weight  : rows.reduce((s, r) => s + r.totalWeight * r.qty, 0),
        value   : rows.reduce((s, r) => s + r.total,                0),
    }), [rows]);

    const hasAnyQty = rows.some((r) => r.qty > 0);

    const setQty = (id: string, val: string) =>
        setQuantities((prev) => ({ ...prev, [id]: val }));

    const resetAll = () =>
        setQuantities(Object.fromEntries(GOLD_TYPES.map((g) => [g.id, "0"])));

    const inputClass =
        "w-full rounded-xl border border-slate-300 bg-white py-2.5 px-4 text-sm text-slate-900 shadow-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200 transition";

    return (
        <div className="space-y-6">

            {/* ── Canlı Piyasa Bandı ───────────────────────── */}
            <div className="rounded-2xl border border-slate-200 bg-white px-5 py-3.5 flex flex-wrap items-center gap-x-6 gap-y-2 shadow-sm min-h-[52px]">
                {pricesLoading && (
                    <div className="flex items-center gap-2 animate-pulse">
                        <div className="w-2 h-2 rounded-full bg-slate-300" />
                        <div className="h-3 w-28 rounded bg-slate-200" />
                        <div className="h-3 w-20 rounded bg-slate-100" />
                        <div className="h-3 w-20 rounded bg-slate-100" />
                    </div>
                )}
                {!pricesLoading && !livePrices && (
                    <p className="text-xs text-slate-400">Canlı fiyat verisi alınamadı — gram fiyatını manuel girin.</p>
                )}
                {!pricesLoading && livePrices && (
                    <>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse flex-shrink-0" />
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Canlı Piyasa</span>
                        </div>
                        <div className="flex flex-wrap gap-x-5 gap-y-1.5 flex-1">
                            <span className="text-sm text-slate-600">
                                Has Altın&nbsp;
                                <strong className="text-green-700">{(livePrices.hasAltinAlis ?? livePrices.gramPrice24k).toLocaleString("tr-TR")} ₺</strong>
                                {livePrices.hasAltinSatis && livePrices.hasAltinSatis !== livePrices.hasAltinAlis && (
                                    <> / <strong className="text-red-600">{livePrices.hasAltinSatis.toLocaleString("tr-TR")} ₺</strong></>
                                )}
                                <span className="text-xs text-slate-400 ml-1">(alış/satış)</span>
                            </span>
                            {livePrices.ceyrekAlis && livePrices.ceyrekSatis && (
                                <span className="text-sm text-slate-600">
                                    Çeyrek&nbsp;
                                    <strong className="text-green-700">{livePrices.ceyrekAlis.toLocaleString("tr-TR")} ₺</strong>
                                    {" / "}
                                    <strong className="text-red-600">{livePrices.ceyrekSatis.toLocaleString("tr-TR")} ₺</strong>
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                            <span className="text-xs text-slate-400">
                                {livePrices.source ?? "altinkaynak.com"} ·{" "}
                                {new Date(livePrices.updatedAt).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}
                            </span>
                            <button
                                type="button"
                                onClick={() => {
                                    const price = txType === "buy"
                                        ? (livePrices.hasAltinSatis ?? livePrices.gramPrice24k)
                                        : (livePrices.hasAltinAlis ?? livePrices.gramPrice24k);
                                    setGramPrice(String(price));
                                    setMakas("0");
                                }}
                                className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800 hover:bg-amber-100 transition-colors"
                            >
                                Uygula
                            </button>
                        </div>
                    </>
                )}
            </div>

            {/* ── Parametreler ─────────────────────────────── */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-base font-bold text-slate-900 mb-4">Hesaplama Parametreleri</h2>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Gram fiyat */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">
                            Gram Altın Fiyatı (24 Ayar)&nbsp;<span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type="number" min="0" step="1"
                                value={gramPrice}
                                onChange={(e) => setGramPrice(e.target.value)}
                                placeholder={livePrices ? String(livePrices.gramPrice24k) : "3000"}
                                className={inputClass + " pr-10"}
                            />
                            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">₺</span>
                        </div>
                        <p className="mt-1 text-xs text-slate-500">Bankanızın veya kuyumcunuzun güncel 24 ayar gram fiyatı.</p>
                    </div>

                    {/* Sikke primi */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Sikke Primi</label>
                        <div className="relative">
                            <input
                                type="number" min="0" step="0.5"
                                value={coinPremium}
                                onChange={(e) => setCoinPremium(e.target.value)}
                                placeholder="3"
                                className={inputClass + " pr-10"}
                            />
                            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">%</span>
                        </div>
                        <p className="mt-1 text-xs text-slate-500">Çeyrek, yarım, tam gibi madeni sikkelerin has altın üstündeki işçilik / prim farkı.</p>
                    </div>

                    {/* Alış/Satış makası */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Alış–Satış Makası</label>
                        <div className="relative">
                            <input
                                type="number" min="0" step="0.1"
                                value={makas}
                                onChange={(e) => setMakas(e.target.value)}
                                placeholder="0.5"
                                className={inputClass + " pr-10"}
                            />
                            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">%</span>
                        </div>
                        <p className="mt-1 text-xs text-slate-500">Alış ve satış fiyatı arasındaki spread oranı. Genellikle %0,25–%1.</p>
                    </div>

                    {/* İşlem türü */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">İşlem Türü</label>
                        <div className="flex rounded-xl border border-slate-300 overflow-hidden shadow-sm text-sm font-semibold">
                            <button
                                type="button"
                                onClick={() => setTxType("buy")}
                                className={`flex-1 py-2.5 transition-colors ${txType === "buy" ? "bg-amber-500 text-white" : "bg-white text-slate-600 hover:bg-slate-50"}`}
                            >
                                Alıyorum
                            </button>
                            <button
                                type="button"
                                onClick={() => setTxType("sell")}
                                className={`flex-1 py-2.5 transition-colors ${txType === "sell" ? "bg-amber-500 text-white" : "bg-white text-slate-600 hover:bg-slate-50"}`}
                            >
                                Satıyorum
                            </button>
                        </div>
                        <p className="mt-1 text-xs text-slate-500">
                            {txType === "buy" ? "Kuyumcu/bankadan satın alıyorsunuz → makas fiyata eklenir." : "Kuyumcu/bankaya satıyorsunuz → makas fiyattan düşülür."}
                        </p>
                    </div>
                </div>
            </div>

            {/* ── Tablo ────────────────────────────────────── */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                    <div>
                        <h2 className="text-base font-bold text-slate-900">Altın Türleri ve Fiyatlar</h2>
                        <p className="mt-0.5 text-xs text-slate-500">Her türe kaç adet / gram hesaplayacağınızı girin.</p>
                    </div>
                    {hasAnyQty && (
                        <button
                            type="button"
                            onClick={resetAll}
                            className="text-xs font-semibold text-slate-500 hover:text-red-600 transition-colors"
                        >
                            Sıfırla
                        </button>
                    )}
                </div>

                {/* Desktop header */}
                <div className="hidden md:grid grid-cols-[2fr_60px_90px_90px_110px_130px] gap-3 px-5 py-2.5 bg-slate-50 border-b border-slate-100 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <span>Altın Türü</span>
                    <span className="text-center">Ayar</span>
                    <span className="text-right">Ağırlık</span>
                    <span className="text-right">Has Altın</span>
                    <span className="text-right">Birim Fiyat</span>
                    <span className="text-center">Adet / Toplam</span>
                </div>

                <div className="divide-y divide-slate-100">
                    {rows.map((row) => {
                        const active = row.qty > 0 && parsedGram > 0;
                        return (
                            <div key={row.id} className={`px-5 py-3.5 transition-colors ${active ? "bg-amber-50/40" : ""}`}>

                                {/* Mobile */}
                                <div className="md:hidden space-y-2">
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <p className="text-sm font-semibold text-slate-900">{row.name}</p>
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">{row.ayar} Ayar</span>
                                                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">{fmtW(row.pureGold)}g has</span>
                                                {row.isCoin && <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700">Sikke</span>}
                                            </div>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <p className="text-sm font-bold text-slate-800">{parsedGram > 0 ? fmt(row.unitPrice) + " ₺" : "—"}</p>
                                            <p className="text-xs text-slate-500">birim</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="number" min="0" step="any"
                                            value={quantities[row.id]}
                                            onChange={(e) => setQty(row.id, e.target.value)}
                                            className="w-28 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-center text-sm text-slate-900 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200"
                                            placeholder="0"
                                        />
                                        {active && (
                                            <span className="text-base font-bold text-amber-700">{fmt(row.total)} ₺</span>
                                        )}
                                    </div>
                                </div>

                                {/* Desktop */}
                                <div className="hidden md:grid grid-cols-[2fr_60px_90px_90px_110px_130px] gap-3 items-center">
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">{row.name}</p>
                                        {row.isCoin && (
                                            <p className="text-xs text-slate-500 mt-0.5">{fmtW(row.totalWeight)}g toplam ağırlık</p>
                                        )}
                                    </div>
                                    <div className="text-center">
                                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800">{row.ayar}K</span>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-slate-600">{fmtW(row.totalWeight)} g</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-slate-700">{fmtW(row.pureGold)} g</p>
                                    </div>
                                    <div className="text-right">
                                        {parsedGram > 0 ? (
                                            <p className="text-sm font-bold text-slate-800">{fmt(row.unitPrice)} ₺</p>
                                        ) : (
                                            <p className="text-sm text-slate-400">—</p>
                                        )}
                                    </div>
                                    <div className="flex flex-col items-center gap-1">
                                        <input
                                            type="number" min="0" step="any"
                                            value={quantities[row.id]}
                                            onChange={(e) => setQty(row.id, e.target.value)}
                                            className="w-full rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-center text-sm text-slate-900 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200"
                                            placeholder="0"
                                        />
                                        {active && (
                                            <span className="text-xs font-bold text-amber-700">{fmt(row.total)} ₺</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ── Sonuç ─────────────────────────────────── */}
            {parsedGram <= 0 && (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-center">
                    <p className="text-sm font-medium text-amber-800">Hesaplamaya başlamak için güncel 24 ayar gram altın fiyatını girin.</p>
                </div>
            )}

            {parsedGram > 0 && !hasAnyQty && (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-center">
                    <p className="text-sm text-slate-500">Toplam değeri görmek için en az bir altın türüne miktar / adet girin.</p>
                </div>
            )}

            {parsedGram > 0 && hasAnyQty && (
                <div className="rounded-2xl border-2 border-amber-300 bg-amber-50 p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base font-bold text-amber-900">Portföy Özeti</h3>
                        <span className="rounded-full px-3 py-1 text-xs font-semibold bg-amber-200 text-amber-900">
                            {txType === "buy" ? "Alış Fiyatıyla" : "Satış Fiyatıyla"}
                        </span>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-3">
                        <div className="rounded-xl bg-white border border-amber-100 p-4">
                            <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">Toplam Değer</p>
                            <p className="mt-2 text-2xl font-extrabold text-amber-800 tabular-nums">{fmt(totals.value)} ₺</p>
                        </div>
                        <div className="rounded-xl bg-white border border-amber-100 p-4">
                            <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">Toplam Has Altın</p>
                            <p className="mt-2 text-2xl font-extrabold text-amber-800 tabular-nums">{fmtW(totals.hasGold)} g</p>
                            <p className="mt-1 text-xs text-amber-600">Saf 24K altın eşdeğeri</p>
                        </div>
                        <div className="rounded-xl bg-white border border-amber-100 p-4">
                            <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">Toplam Ağırlık</p>
                            <p className="mt-2 text-2xl font-extrabold text-amber-800 tabular-nums">{fmtW(totals.weight)} g</p>
                            <p className="mt-1 text-xs text-amber-600">Alaşım dahil fiziki ağırlık</p>
                        </div>
                    </div>

                    {/* Aktif satırlar özet */}
                    <div className="mt-4 divide-y divide-amber-100 border border-amber-100 rounded-xl bg-white overflow-hidden">
                        {rows.filter((r) => r.qty > 0).map((r) => (
                            <div key={r.id} className="flex items-center justify-between px-4 py-2.5 text-sm">
                                <span className="font-medium text-slate-700">{r.name} ×{fmt(r.qty, 3).replace(/,?0+$/, "") || r.qty}</span>
                                <span className="font-bold text-amber-800 tabular-nums">{fmt(r.total)} ₺</span>
                            </div>
                        ))}
                    </div>

                    <p className="mt-4 text-xs text-amber-700/80 bg-amber-100/60 rounded-lg px-4 py-2.5 leading-relaxed">
                        ⚠️ Hesaplamalar, standart has altın içerikleri ve girdiğiniz parametreler esas alınarak yapılmıştır. Gerçek alım-satım fiyatları kuyumcu, banka ve borsa arasında farklılık gösterebilir.
                    </p>
                </div>
            )}
        </div>
    );
}

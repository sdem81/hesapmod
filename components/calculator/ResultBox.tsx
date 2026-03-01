"use client";

// ✅ H-3 FIX: "use client" direktifi eklendi (navigator.clipboard için gerekli)
import React from "react";
import { CalculatorResult } from "@/lib/calculators";
import { Copy, Share2, MessageCircle } from "lucide-react";

interface Props {
    results: Record<string, any>;
    config: CalculatorResult[];
    lang: "tr" | "en";
}

export default function ResultBox({ results, config, lang }: Props) {
    // ✅ H-3 FIX: clipboard guard — SSR-safe + hata yakalama
    const handleCopy = async () => {
        if (typeof navigator === "undefined" || !navigator.clipboard) return;
        const text = config
            .map((c) => {
                let val = results[c.id];
                if (typeof val === "object" && val !== null && !Array.isArray(val) && "tr" in val) {
                    val = val[lang] || val.tr;
                } else if (typeof val === "number") {
                    val = val.toLocaleString(lang === "tr" ? "tr-TR" : "en-US", {
                        minimumFractionDigits: c.decimalPlaces ?? 0,
                        maximumFractionDigits: c.decimalPlaces ?? 2,
                    });
                }
                return `${c.label[lang]}: ${val ?? ""} ${c.suffix || ""}`;
            })
            .join("\n");
        try {
            await navigator.clipboard.writeText(text);
        } catch {
            // Clipboard erişimi reddedilirse sessizce geç
        }
    };

    const handleShare = async () => {
        if (typeof navigator === "undefined") return;
        if (navigator.share) {
            try {
                await navigator.share({
                    title: "HesapMod Sonucu",
                    url: window.location.href,
                });
            } catch {
                // Paylaşım iptal edildi
            }
        } else if (navigator.clipboard) {
            await navigator.clipboard.writeText(window.location.href).catch(() => { });
        }
    };

    const handleWhatsAppShare = () => {
        if (typeof window === "undefined") return;
        const text = lang === "tr"
            ? `HesapMod'da faydalı bir hesaplama aracı buldum. Hemen incele:\n\n${window.location.href}`
            : `I found a useful calculator tool on HesapMod. Check it out:\n\n${window.location.href}`;
        const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
        window.open(url, "_blank");
    };

    return (
        <div className="bg-gradient-to-br from-primary to-primary/80 dark:from-slate-800/90 dark:to-slate-950/90 dark:border dark:border-slate-800 text-primary-foreground dark:text-slate-50 p-8 rounded-2xl shadow-2xl shadow-primary/20 dark:shadow-none space-y-8 animate-scale-in relative overflow-hidden">
            {/* Dekoratif arka plan çemberi */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
                <h3 className="text-lg font-medium opacity-80 mb-6 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    {lang === "tr" ? "Sonuçlar" : "Results"}
                </h3>

                <div className="space-y-6">
                    {config.map((res, idx) => (
                        <div
                            key={res.id}
                            className="border-b border-white/10 pb-4 last:border-0"
                        >
                            <p className="text-sm opacity-80 mb-1 font-medium">
                                {res.label[lang]}
                            </p>
                            {res.type === "bankRates" ? (
                                <div className="mt-3 space-y-2">
                                    {Array.isArray(results[res.id]) && results[res.id].length > 0 ? (
                                        results[res.id].map((bankRate: any, i: number) => (
                                            <div key={i} className="flex items-center justify-between text-base md:text-lg bg-white/10 px-4 py-2 rounded-lg border border-white/5">
                                                <span className="font-semibold tracking-tight">{bankRate.bank}</span>
                                                <span className="font-bold text-white bg-white/20 px-2 py-0.5 rounded-md">
                                                    %{bankRate.rate}
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="opacity-70 text-sm">{lang === "tr" ? "Mevcut oran bulunamadı." : "No rates found."}</p>
                                    )}
                                </div>
                            ) : res.type === "pieChart" ? (
                                (() => {
                                    const raw = results[res.id] || { segments: [] };
                                    const segments: any[] = raw.segments || [];
                                    const total = segments.reduce((acc, seg) => acc + seg.value, 0);

                                    if (total === 0 || segments.length === 0) return null;

                                    let currentPct = 0;
                                    const gradientParts = segments.map(seg => {
                                        const pct = (seg.value / total) * 100;
                                        const endPct = currentPct + pct;
                                        const part = `${seg.colorHex} ${currentPct}% ${endPct}%`;
                                        currentPct = endPct;
                                        return part;
                                    });

                                    return (
                                        <div className="mt-4 flex flex-col md:flex-row items-center gap-6 bg-white/5 p-6 rounded-2xl border border-white/10">
                                            {/* Native CSS Pie Chart */}
                                            <div
                                                className="w-32 h-32 rounded-full shadow-inner flex-shrink-0"
                                                style={{
                                                    background: `conic-gradient(from 0deg, ${gradientParts.join(', ')})`
                                                }}
                                            />
                                            <div className="flex-1 space-y-3 w-full">
                                                {segments.map((seg, idx) => {
                                                    const pct = (seg.value / total) * 100;
                                                    return (
                                                        <div key={idx} className="flex justify-between items-center text-sm md:text-base">
                                                            <div className="flex items-center gap-2">
                                                                <span className={`w-3 h-3 rounded-full shadow-sm ${seg.colorClass}`} style={!seg.colorClass ? { backgroundColor: seg.colorHex } : undefined} />
                                                                <span className="font-medium opacity-90">{seg.label[lang] || seg.label}</span>
                                                            </div>
                                                            <div className="flex items-center gap-3">
                                                                <span className="opacity-60 text-xs hidden sm:inline-block">
                                                                    {seg.value.toLocaleString("tr-TR", { minimumFractionDigits: 0, maximumFractionDigits: 0 })} ₺
                                                                </span>
                                                                <span className="font-bold">%{pct.toFixed(1)}</span>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })()
                            ) : res.type === "schedule" ? (
                                (() => {
                                    const rawSched: any[] = results[res.id] || [];
                                    if (rawSched.length === 0) return null;

                                    return (
                                        <div className="mt-4 overflow-x-auto rounded-xl border border-white/10 bg-white/5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                                            <table className="w-full text-[11px] sm:text-sm text-left">
                                                <thead className="bg-white/10 font-semibold sticky top-0 leading-tight">
                                                    <tr>
                                                        <th className="px-1.5 sm:px-4 py-2 sm:py-3 text-center">{lang === "tr" ? "Ay" : "Mo"}</th>
                                                        <th className="px-1.5 sm:px-4 py-2 sm:py-3 text-right">{lang === "tr" ? "Taksit (₺)" : "Pay"}</th>
                                                        <th className="px-1.5 sm:px-4 py-2 sm:py-3 text-right">{lang === "tr" ? "Anapara" : "Prin."}</th>
                                                        <th className="px-1.5 sm:px-4 py-2 sm:py-3 text-right">{lang === "tr" ? "Faiz" : "Int."}</th>
                                                        <th className="px-1.5 sm:px-4 py-2 sm:py-3 text-right">{lang === "tr" ? "Kalan" : "Bal."}</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-white/5">
                                                    {rawSched.map((row) => (
                                                        <tr key={row.month} className="hover:bg-white/5 transition-colors">
                                                            <td className="px-1.5 sm:px-4 py-2 text-center opacity-80">{row.month}</td>
                                                            <td className="px-1.5 sm:px-4 py-2 font-medium text-right tracking-tighter sm:tracking-normal">{Math.round(row.payment).toLocaleString("tr-TR")}</td>
                                                            <td className="px-1.5 sm:px-4 py-2 opacity-80 text-right tracking-tighter sm:tracking-normal">{Math.round(row.principal).toLocaleString("tr-TR")}</td>
                                                            <td className="px-1.5 sm:px-4 py-2 opacity-80 text-right text-destructive drop-shadow-[0_0_2px_rgba(0,0,0,0.5)] tracking-tighter sm:tracking-normal">{Math.round(row.interest).toLocaleString("tr-TR")}</td>
                                                            <td className="px-1.5 sm:px-4 py-2 opacity-90 text-right font-medium tracking-tighter sm:tracking-normal">{Math.round(row.remaining).toLocaleString("tr-TR")}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    );
                                })()
                            ) : res.type === "growthSchedule" ? (
                                (() => {
                                    const rawSched: any[] = results[res.id] || [];
                                    if (rawSched.length === 0) return null;

                                    return (
                                        <div className="mt-4 overflow-x-auto rounded-xl border border-white/10 bg-white/5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                                            <table className="w-full text-[11px] sm:text-sm text-left">
                                                <thead className="bg-white/10 font-semibold sticky top-0 leading-tight">
                                                    <tr>
                                                        <th className="px-1.5 sm:px-4 py-2 sm:py-3 text-center">{lang === "tr" ? "Dönem" : "Period"}</th>
                                                        <th className="px-1.5 sm:px-4 py-2 sm:py-3 text-right">{lang === "tr" ? "Başlangıç" : "Starts"}</th>
                                                        <th className="px-1.5 sm:px-4 py-2 sm:py-3 text-right">{lang === "tr" ? "Kazanılan" : "Earned"}</th>
                                                        <th className="px-1.5 sm:px-4 py-2 sm:py-3 text-right">{lang === "tr" ? "Toplam" : "Total"}</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-white/5">
                                                    {rawSched.map((row) => (
                                                        <tr key={row.period} className="hover:bg-white/5 transition-colors">
                                                            <td className="px-1.5 sm:px-4 py-2 text-center opacity-80">{row.period}</td>
                                                            <td className="px-1.5 sm:px-4 py-2 opacity-80 text-right tracking-tighter sm:tracking-normal">{Math.round(row.start).toLocaleString("tr-TR")} ₺</td>
                                                            <td className="px-1.5 sm:px-4 py-2 opacity-80 text-right text-[#22c55e] drop-shadow-[0_0_2px_rgba(0,0,0,0.5)] tracking-tighter sm:tracking-normal">+{Math.round(row.interest).toLocaleString("tr-TR")} ₺</td>
                                                            <td className="px-1.5 sm:px-4 py-2 font-medium text-right tracking-tighter sm:tracking-normal">{Math.round(row.end).toLocaleString("tr-TR")} ₺</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    );
                                })()
                            ) : res.type === "progress-bar" ? (
                                (() => {
                                    const progressData = results[res.id] || { percentage: 50, colorClass: "bg-white", text: "" };
                                    const constrainedPct = Math.min(100, Math.max(0, progressData.percentage));
                                    const displayText = typeof progressData.text === "object" ? progressData.text[lang] : progressData.text;

                                    return (
                                        <div className="mt-4 bg-white/5 p-5 rounded-2xl border border-white/10">
                                            <p className="text-center font-medium mb-3">{displayText}</p>
                                            <div className="w-full bg-black/20 rounded-full h-4 overflow-hidden border border-white/10 relative">
                                                <div
                                                    className={`h-full transition-all duration-1000 ease-out ${progressData.colorClass}`}
                                                    style={{ width: `${constrainedPct}%` }}
                                                />
                                                <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] bg-[length:200%_100%] animate-[shimmer_2s_infinite]" />
                                            </div>
                                        </div>
                                    );
                                })()
                            ) : (
                                <p className="text-4xl font-extrabold tracking-tight drop-shadow-sm">
                                    {res.prefix}
                                    {typeof results[res.id] === "number"
                                        ? results[res.id].toLocaleString(lang === "tr" ? "tr-TR" : "en-US", {
                                            minimumFractionDigits: res.decimalPlaces ?? 0,
                                            maximumFractionDigits: res.decimalPlaces ?? 2,
                                        })
                                        : (typeof results[res.id] === "object" && results[res.id] !== null && !Array.isArray(results[res.id])
                                            ? (results[res.id][lang] || results[res.id].tr)
                                            : (results[res.id] ?? "—"))}
                                    <span className="text-lg ml-2 font-medium opacity-80">
                                        {res.suffix}
                                    </span>
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex gap-2 sm:gap-3 relative z-10 pt-4 flex-wrap sm:flex-nowrap">
                <button
                    onClick={handleCopy}
                    aria-label="Sonuçları kopyala"
                    className="flex-1 min-w-[100px] h-12 rounded-xl bg-white/10 hover:bg-white/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 font-medium border border-white/10 backdrop-blur-sm text-sm sm:text-base"
                >
                    <Copy size={18} />
                    {lang === "tr" ? "Kopyala" : "Copy"}
                </button>
                <button
                    onClick={handleShare}
                    aria-label="Sayfayı paylaş"
                    className="flex-1 min-w-[100px] h-12 rounded-xl bg-white/10 hover:bg-white/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 font-medium border border-white/10 backdrop-blur-sm text-sm sm:text-base"
                >
                    <Share2 size={18} />
                    {lang === "tr" ? "Paylaş" : "Share"}
                </button>
                <button
                    onClick={handleWhatsAppShare}
                    aria-label="WhatsApp'ta paylaş"
                    className="flex-[2] sm:flex-1 min-w-[140px] h-12 rounded-xl bg-[#25D366]/20 hover:bg-[#25D366]/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 font-medium border border-[#25D366]/40 text-white backdrop-blur-sm shadow-[0_0_15px_rgba(37,211,102,0.2)] text-sm sm:text-base"
                >
                    <MessageCircle size={18} />
                    WhatsApp
                </button>
            </div>
        </div>
    );
}

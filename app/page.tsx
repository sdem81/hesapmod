import { CategoryIcon } from "@/components/category/CategoryIcon";
import { mainCategories, getCategoryName } from "@/lib/categories";
import { calculatorCount, calculatorSearchIndex, calculators } from "@/lib/calculators";
import { Metadata } from "next";
import GlobalSearch from "@/components/search/GlobalSearch";
import Link from "next/link";
import Script from "next/script";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import HomeSEOContent from "@/components/home/HomeSEOContent";
import { getCalculatorLastModified } from "@/lib/content-last-modified";
import { ArrowRight, ShieldCheck, Zap, BarChart3, ChevronRight } from "lucide-react";

export const metadata: Metadata = {
    title: "HesapMod | Ücretsiz Online Hesaplama Araçları",
    description: `Finans, sağlık, matematik ve günlük yaşam için ${calculatorCount} adet ücretsiz, hızlı ve güvenilir hesaplama aracı. KDV, kredi, VKİ ve daha fazlası.`,
    alternates: { canonical: "/" },
};

/* Popüler araçlar — emoji + kısa ad */
const popularTools = [
    { href: "/maas-ve-vergi/maas-hesaplama",                     emoji: "💰", name: "Net Maaş",      desc: "Brüt → Net hesapla"   },
    { href: "/finansal-hesaplamalar/kredi-taksit-hesaplama",      emoji: "🏦", name: "Kredi Taksit",  desc: "Ödeme planı çıkar"     },
    { href: "/sinav-hesaplamalari/yks-puan-hesaplama",            emoji: "📚", name: "YKS Puan",      desc: "TYT + AYT → ham puan"  },
    { href: "/yasam-hesaplama/vucut-kitle-indeksi-hesaplama",     emoji: "⚖️", name: "BMI / VKİ",     desc: "İdeal kilo hesapla"    },
    { href: "/finansal-hesaplamalar/kdv-hesaplama",               emoji: "🧾", name: "KDV",            desc: "Dahil / hariç bul"    },
    { href: "/maas-ve-vergi/kidem-tazminati-hesaplama",           emoji: "📋", name: "Kıdem Tazminat", desc: "Toplu alacak hesapla"  },
    { href: "/zaman-hesaplama/yas-hesaplama",                     emoji: "🗓️", name: "Yaş Hesapla",   desc: "Gün bazında yaş bul"   },
    { href: "/tasit-ve-vergi/mtv-hesaplama",                      emoji: "🚗", name: "MTV",            desc: "Taşıt vergisi bul"     },
];

/* Quick pill linkleri */
const quickPills = [
    { href: "/maas-ve-vergi/maas-hesaplama",                  label: "💰 Net Maaş" },
    { href: "/finansal-hesaplamalar/kredi-taksit-hesaplama",   label: "🏦 Kredi"   },
    { href: "/sinav-hesaplamalari/yks-puan-hesaplama",         label: "📚 YKS"     },
    { href: "/yasam-hesaplama/vucut-kitle-indeksi-hesaplama",  label: "⚖️ BMI"    },
    { href: "/tasit-ve-vergi/mtv-hesaplama",                   label: "🚗 MTV"     },
    { href: "/finansal-hesaplamalar/kdv-hesaplama",            label: "🧾 KDV"     },
];

function formatDateLabel(date: Date) {
    return date.toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "numeric" });
}

export default function Home() {
    const categoryCounts = calculatorSearchIndex.reduce<Record<string, number>>(
        (counts, entry) => {
            counts[entry.category] = (counts[entry.category] ?? 0) + 1;
            return counts;
        },
        {}
    );

    const recentlyUpdatedCalcs = calculators
        .map((c) => ({ ...c, lastModified: getCalculatorLastModified(c.slug) }))
        .sort((a, b) => b.lastModified.getTime() - a.lastModified.getTime())
        .slice(0, 9);

    const homepageStructuredData = [
        {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "url": SITE_URL,
            "name": SITE_NAME,
            "inLanguage": "tr-TR",
            "description": `Finans, sağlık, eğitim ve matematik kategorilerinde ${calculatorCount} adet ücretsiz online hesaplama araçları platformu.`,
            "publisher": { "@type": "Organization", "name": SITE_NAME, "url": SITE_URL },
        },
        {
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "Popüler Hesaplama Araçları",
            "itemListElement": popularTools.map((tool, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "name": tool.name,
                "url": `${SITE_URL}${tool.href}`,
            })),
        },
    ];

    return (
        <main className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-500/30">

            {/* ══ HERO — Koyu Mavi (Mobil Thumb Zone Optimized) ══ */}
            <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-800 to-blue-900 px-4 pt-8 pb-6">
                {/* arka plan süs daireleri */}
                <div className="pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full bg-white/5" />
                <div className="pointer-events-none absolute -bottom-10 -left-10 h-36 w-36 rounded-full bg-white/4" />

                {/* Badge */}
                <div className="relative z-10 mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-3 py-1.5 text-[11px] font-bold text-white/90">
                    🔥 {calculatorCount} ücretsiz araç · 2026 güncel
                </div>

                {/* H1 */}
                <h1 className="relative z-10 mb-2 text-3xl font-extrabold leading-tight tracking-tight text-white md:text-5xl">
                    İhtiyacın olan<br />
                    <span className="text-blue-200">hesaplama burada.</span>
                </h1>
                <p className="relative z-10 mb-5 text-sm text-white/70 leading-relaxed max-w-lg">
                    Maaş, kredi, sınav, sağlık — saniyeler içinde, ücretsiz ve gizli.
                </p>

                {/* Arama */}
                <div className="relative z-10 mb-4 w-full rounded-xl bg-white shadow-lg shadow-black/20">
                    <GlobalSearch entries={calculatorSearchIndex} />
                </div>

                {/* Quick Pills */}
                <div className="relative z-10 -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {quickPills.map((pill) => (
                        <Link
                            key={pill.href}
                            href={pill.href}
                            className="flex-shrink-0 rounded-full border border-white/25 bg-white/15 px-3 py-1.5 text-[11px] font-semibold text-white/90 whitespace-nowrap transition hover:bg-white/25"
                        >
                            {pill.label}
                        </Link>
                    ))}
                </div>
            </section>

            {/* ══ STATS BAR ══ */}
            <section className="border-y border-slate-200 bg-white">
                <div className="grid grid-cols-3 divide-x divide-slate-200">
                    {[
                        { num: calculatorCount.toString(), label: "Ücretsiz Araç" },
                        { num: mainCategories.length.toString(), label: "Kategori" },
                        { num: "%100", label: "Gizlilik" },
                    ].map(({ num, label }) => (
                        <div key={label} className="flex flex-col items-center py-3">
                            <span className="font-extrabold text-blue-600 text-lg leading-tight font-sora">{num}</span>
                            <span className="text-[10px] text-slate-400 font-medium mt-0.5">{label}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* ══ EN ÇOK KULLANILAN — 2×2 Grid ══ */}
            <section className="px-4 pt-5 pb-4">
                <div className="mb-3 flex items-center justify-between">
                    <h2 className="text-[15px] font-bold text-slate-900">⚡ En Çok Kullanılan</h2>
                    <Link href="/tum-araclar" className="flex items-center gap-0.5 text-[12px] font-semibold text-blue-600">
                        Tümü <ChevronRight size={13} />
                    </Link>
                </div>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                    {popularTools.map((tool) => (
                        <Link
                            key={tool.href}
                            href={tool.href}
                            className="flex min-h-[72px] flex-col rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm transition hover:border-blue-200 hover:shadow-md active:scale-[0.98]"
                        >
                            <span className="mb-2 text-2xl leading-none">{tool.emoji}</span>
                            <span className="text-[12px] font-bold text-slate-900 leading-tight">{tool.name}</span>
                            <span className="mt-0.5 text-[10px] text-slate-400 leading-tight">{tool.desc}</span>
                        </Link>
                    ))}
                </div>
            </section>

            {/* ══ KATEGORİLER — Yatay Scroll (Mobil) / Grid (Masaüstü) ══ */}
            <section className="px-4 pt-2 pb-5">
                <div className="mb-3 flex items-center justify-between">
                    <h2 className="text-[15px] font-bold text-slate-900">📂 Kategoriler</h2>
                    <Link href="/tum-araclar" className="flex items-center gap-0.5 text-[12px] font-semibold text-blue-600">
                        Tümü <ChevronRight size={13} />
                    </Link>
                </div>

                {/* Mobil: yatay scroll */}
                <div className="md:hidden -mx-4 flex gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {mainCategories.map((cat) => (
                        <Link
                            key={cat.id}
                            href={`/kategori/${cat.slug}`}
                            className="flex flex-shrink-0 flex-col items-center rounded-xl border border-slate-200 bg-white p-3 min-w-[90px] text-center shadow-sm transition hover:border-blue-200"
                        >
                            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                                <CategoryIcon icon={cat.icon} size={20} />
                            </div>
                            <span className="text-[11px] font-bold text-slate-800 leading-tight">{cat.name.tr}</span>
                            <span className="mt-0.5 text-[10px] text-slate-400">{categoryCounts[cat.slug] ?? 0} araç</span>
                        </Link>
                    ))}
                </div>

                {/* Masaüstü: kompakt grid */}
                <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {mainCategories.map((cat) => (
                        <Link
                            key={cat.id}
                            href={`/kategori/${cat.slug}`}
                            className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-blue-200 hover:shadow-md group"
                        >
                            <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-slate-100 text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                <CategoryIcon icon={cat.icon} size={20} />
                            </div>
                            <div className="min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                    <span className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">{cat.name.tr}</span>
                                    <span className="text-xs text-slate-400 whitespace-nowrap">{categoryCounts[cat.slug] ?? 0} araç</span>
                                </div>
                                <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{cat.description.tr}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* ══ TRUST STRIP ══ */}
            <section className="bg-blue-700 px-4 py-3">
                <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 justify-center md:justify-start">
                    {[
                        "✅ Veri kaydedilmez",
                        "✅ 2026 güncel",
                        "✅ Tamamen ücretsiz",
                    ].map((item) => (
                        <span key={item} className="text-[11px] font-medium text-white/85">{item}</span>
                    ))}
                </div>
            </section>

            {/* ══ SON GÜNCELLENEN ══ */}
            <section className="px-4 py-6 max-w-7xl mx-auto">
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <h2 className="text-[15px] font-bold text-slate-900 md:text-2xl">Son Güncellenen Araçlar</h2>
                        <p className="mt-0.5 text-[12px] text-slate-500 md:text-sm">Yeni eklenen veya güncellenen hesaplayıcılar.</p>
                    </div>
                    <Link href="/tum-araclar" className="flex-shrink-0 flex items-center gap-0.5 text-[12px] font-semibold text-blue-600">
                        Tümü <ChevronRight size={13} />
                    </Link>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {recentlyUpdatedCalcs.map((calculator) => (
                        <Link
                            key={calculator.slug}
                            href={`/${calculator.category}/${calculator.slug}`}
                            className="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-blue-200 hover:shadow-md active:scale-[0.99]"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                                        {getCategoryName(calculator.category, "tr")}
                                    </p>
                                    <h3 className="mt-1 text-[13px] font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">
                                        {calculator.name.tr}
                                    </h3>
                                    <p className="mt-1.5 text-[11px] leading-relaxed text-slate-500 line-clamp-2">
                                        {(calculator.shortDescription ?? calculator.description).tr}
                                    </p>
                                </div>
                                <span className="flex-shrink-0 rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold text-blue-700">
                                    Güncel
                                </span>
                            </div>
                            <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100 pt-2">
                                <span>{formatDateLabel(calculator.lastModified)}</span>
                                <span className="font-semibold text-blue-600 group-hover:text-blue-700 flex items-center gap-0.5">
                                    Aracı aç <ArrowRight size={12} />
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* ══ NEDEN HESAPMod ══ */}
            <section className="border-t border-slate-200 bg-white px-4 py-8 md:py-16">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-8 md:mb-12">
                        <h2 className="text-xl font-bold text-slate-900 md:text-3xl">Neden HesapMod?</h2>
                        <p className="text-slate-500 mt-2 text-sm md:text-lg max-w-2xl mx-auto">Güvenli, hızlı ve güncel altyapı ile hesap yapmanın modern yolu.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {[
                            { icon: <Zap size={24} />, title: "Anında Sonuç", desc: "Tuşa bastığınız an kesin sonuçlar ekranda türer.", color: "bg-blue-50 text-blue-600" },
                            { icon: <ShieldCheck size={24} />, title: "%100 Gizlilik", desc: "Girdiğiniz veriler hiçbir sunucuya aktarılmaz.", color: "bg-emerald-50 text-emerald-600" },
                            { icon: <BarChart3 size={24} />, title: "Güncel Mevzuat", desc: "Değişen KDV, SGK ve YKS oranları düzenli güncellenir.", color: "bg-indigo-50 text-indigo-600" },
                        ].map(({ icon, title, desc, color }) => (
                            <div key={title} className="flex gap-4 rounded-xl border border-slate-200 bg-white p-5 md:flex-col md:text-center md:items-center md:gap-3">
                                <div className={`w-12 h-12 flex-shrink-0 rounded-xl flex items-center justify-center ${color}`}>{icon}</div>
                                <div>
                                    <h3 className="font-bold text-slate-900 text-[14px] md:text-lg">{title}</h3>
                                    <p className="text-slate-500 text-[12px] md:text-sm mt-0.5 leading-relaxed">{desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══ SEO CONTENT ══ */}
            <HomeSEOContent />

            {/* ══ JSON-LD ══ */}
            <Script id="homepage-schema" type="application/ld+json" strategy="afterInteractive" dangerouslySetInnerHTML={{
                __html: JSON.stringify(homepageStructuredData)
            }} />
        </main>
    );
}

import { CategoryIcon } from "@/components/category/CategoryIcon";
import { getCategoryName, mainCategories } from "@/lib/categories";
import { calculatorCount, calculatorSearchIndex, calculators } from "@/lib/calculators";
import { Metadata } from "next";
import GlobalSearch from "@/components/search/GlobalSearch";
import Link from "next/link";
import Script from "next/script";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import HomeSEOContent from "@/components/home/HomeSEOContent";
import { getCalculatorLastModified } from "@/lib/content-last-modified";
import { ArrowRight, BadgeDollarSign, HeartPulse, GraduationCap, Calculator, Clock, Banknote, ShieldCheck, Zap, BarChart3 } from "lucide-react";

export const metadata: Metadata = {
    title: "HesapMod | Ücretsiz Online Hesaplama Araçları",
    description: `Finans, sağlık, matematik ve günlük yaşam için ${calculatorCount} adet ücretsiz, hızlı ve güvenilir hesaplama aracı. KDV, kredi, VKİ ve daha fazlası.`,
    alternates: { canonical: "/" },
};

function formatDateLabel(date: Date) {
    return date.toLocaleDateString("tr-TR", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

export default function Home() {
    const categoryCounts = calculatorSearchIndex.reduce<Record<string, number>>(
        (counts, entry) => {
            counts[entry.category] = (counts[entry.category] ?? 0) + 1;
            return counts;
        },
        {}
    );

    const popularTools = [
        { href: "/maas-ve-vergi/maas-hesaplama", name: "Net Maaş Hesaplama", desc: "Brüt maaşınızdan yasal kesintileri (SGK, Vergi) anında hesaplayın.", icon: <Banknote className="text-emerald-500 mb-4" size={28} /> },
        { href: "/finansal-hesaplamalar/kredi-taksit-hesaplama", name: "Kredi Faiz Hesaplama", desc: "Aylık taksit tutarı ve toplam geri ödeme planı oluşturun.", icon: <BadgeDollarSign className="text-blue-500 mb-4" size={28} /> },
        { href: "/yasam-hesaplama/vucut-kitle-indeksi-hesaplama", name: "Vücut Kitle İndeksi (VKİ)", desc: "Boy ve kilonuza göre sağlık ve ideal kilo durumunuzu kontrol edin.", icon: <HeartPulse className="text-rose-500 mb-4" size={28} /> },
        { href: "/finansal-hesaplamalar/kdv-hesaplama", name: "KDV Hesaplama", desc: "Fiyatlarınıza KDV ekleyin veya KDV hariç tutarı saniyeler içinde bulun.", icon: <Calculator className="text-indigo-500 mb-4" size={28} /> },
        { href: "/sinav-hesaplamalari/yks-puan-hesaplama", name: "YKS Puan Hesaplama", desc: "TYT ve AYT netlerinizle tahmini YKS sınav puanınızı öğrenin.", icon: <GraduationCap className="text-amber-500 mb-4" size={28} /> },
        { href: "/zaman-hesaplama/yas-hesaplama", name: "Detaylı Yaş Hesaplama", desc: "Doğum tarihinizi girerek tam yaşınızı ve geçen süreyi hesaplayın.", icon: <Clock className="text-purple-500 mb-4" size={28} /> }
    ];
    const recentlyUpdatedCalcs = calculators
        .map((calculator) => ({
            ...calculator,
            lastModified: getCalculatorLastModified(calculator.slug),
        }))
        .sort((a, b) => b.lastModified.getTime() - a.lastModified.getTime())
        .slice(0, 12);

    const homepageStructuredData = [
        {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "url": SITE_URL,
            "name": SITE_NAME,
            "inLanguage": "tr-TR",
            "description": `Finans, sağlık, eğitim ve matematik kategorilerinde ${calculatorCount} adet ücretsiz online hesaplama araçları platformu.`,
            "publisher": {
                "@type": "Organization",
                "name": SITE_NAME,
                "url": SITE_URL,
            },
            "about": mainCategories.map((category) => ({
                "@type": "Thing",
                "name": category.name.tr,
            })),
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
        {
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "Son Güncellenen Hesaplama Araçları",
            "itemListElement": recentlyUpdatedCalcs.map((calculator, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "name": calculator.name.tr,
                "url": `${SITE_URL}/${calculator.category}/${calculator.slug}`,
            })),
        },
    ];

    return (
        <main className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-500/30">

            {/* ── HERO SECTION ── */}
            <section className="relative overflow-visible pt-32 pb-20 px-5 flex flex-col items-center justify-center text-center border-b border-slate-200">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100/50 via-slate-50 to-slate-50 pointer-events-none"></div>

                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold tracking-wide uppercase mb-8 border border-blue-200">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                    {calculatorCount} Profesyonel Araç
                </div>

                {/* TEK H1 ETİKETİ - SEO KURALI */}
                <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 max-w-4xl leading-tight mb-6 relative z-10 transition-colors" aria-label="Ücretsiz Online Hesaplama Araçları">
                    <span className="sr-only">Ücretsiz Online Hesaplama Araçları</span>
                    <span aria-hidden="true" className="block">Ücretsiz Online</span>
                    <span aria-hidden="true" className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Hesaplama Araçları</span>
                </h1>

                <p className="text-lg md:text-xl text-slate-600 max-w-2xl mb-10 leading-relaxed relative z-10">
                    Finans, Eğitim, Sağlık ve Günlük Yaşam kategorilerinde ihtiyacınız olan tüm hesaplamaları saniyeler içinde, ücretsiz ve güvenle yapın.
                </p>

                <div className="w-full max-w-2xl mx-auto relative z-20">
                    <GlobalSearch entries={calculatorSearchIndex} />
                </div>
            </section>

            {/* ── POPULAR TOOLS SECTION ── */}
            <section className="py-24 px-5 max-w-7xl mx-auto border-b border-slate-200">
                <div className="mb-12 text-center md:text-left">
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Popüler Hesaplama Araçları</h2>
                    <p className="text-slate-600 mt-3 text-lg">Kullanıcılarımızın en çok tercih ettiği finans ve sağlık araçları.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {popularTools.map((tool, idx) => (
                        <Link key={idx} href={tool.href} className="flex flex-col p-6 rounded-2xl bg-white border border-slate-200 hover:border-blue-200 shadow-sm hover:shadow-md transition-all duration-300 group">
                            {tool.icon}
                            {/* H1 içinde değil, Semantik olarak standart bir div veya H3 */}
                            <h3 className="text-xl font-semibold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">{tool.name}</h3>
                            <p className="text-slate-600 text-sm leading-relaxed flex-1">{tool.desc}</p>
                            <div className="mt-6 flex items-center text-sm font-medium text-slate-500 group-hover:text-blue-600 transition-colors">
                                Hemen Hesapla <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            <section className="py-24 px-5 max-w-7xl mx-auto border-b border-slate-200">
                <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Son Güncellenen Hesaplamalar</h2>
                        <p className="text-slate-600 mt-3 text-lg">
                            Yeni eklenen veya içerik olarak güncellenen araçlara doğrudan buradan ulaşın.
                        </p>
                    </div>
                    <Link
                        href="/tum-araclar"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700"
                    >
                        Tüm araçları gör <ArrowRight size={14} />
                    </Link>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {recentlyUpdatedCalcs.map((calculator) => (
                        <Link
                            key={calculator.slug}
                            href={`/${calculator.category}/${calculator.slug}`}
                            className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="min-w-0">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        {getCategoryName(calculator.category, "tr")}
                                    </p>
                                    <h3 className="mt-2 text-lg font-bold text-slate-900 transition-colors group-hover:text-blue-600">
                                        {calculator.name.tr}
                                    </h3>
                                    <p className="mt-2 text-sm leading-6 text-slate-600 line-clamp-2">
                                        {(calculator.shortDescription ?? calculator.description).tr}
                                    </p>
                                </div>
                                <span className="shrink-0 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                                    Güncel
                                </span>
                            </div>
                            <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                                <span>{formatDateLabel(calculator.lastModified)}</span>
                                <span className="font-semibold text-blue-600 transition-colors group-hover:text-blue-700">
                                    Aracı aç
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* ── CATEGORIES SECTION ── */}
            <section className="py-24 px-5 max-w-7xl mx-auto border-b border-slate-200">
                <div className="mb-12 text-center md:text-left">
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Kategorilere Göre Hesaplama Araçları</h2>
                    <p className="text-slate-600 mt-3 text-lg">Sade ve anlaşılır bir yapı ile ihtiyacınız olan araca hızla ulaşın.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {mainCategories.map((cat) => (
                        <Link key={cat.id} href={`/kategori/${cat.slug}`} className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-200 shadow-sm hover:shadow-md transition-all duration-300 group">
                            <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-xl bg-slate-100 text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                <CategoryIcon icon={cat.icon} size={24} />
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between gap-3">
                                    <h3 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">{cat.name.tr}</h3>
                                    <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">
                                        {categoryCounts[cat.slug] ?? 0} araç
                                    </span>
                                </div>
                                <p className="text-xs text-slate-500 mt-1 line-clamp-1">{cat.description.tr}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* ── WHY US SECTION ── */}
            <section className="py-24 px-5 max-w-7xl mx-auto border-b border-slate-200">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Neden HesapMod?</h2>
                    <p className="text-slate-600 mt-4 max-w-2xl mx-auto text-lg">Güvenli, hızlı ve güncel altyapı ile hesap yapmanın modern yolu.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="text-center px-4">
                        <div className="w-16 h-16 mx-auto bg-blue-50 rounded-2xl flex items-center justify-center mb-6 text-blue-600">
                            <Zap size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">Sıfır Bekleme, Anında Sonuç</h3>
                        <p className="text-slate-600 leading-relaxed text-sm">Gelişmiş mimari sayesinde veri yüklenmeden ve sayfa yenilenmeden, tuşa bastığınız an kesin sonuçlar ekranda türer.</p>
                    </div>
                    <div className="text-center px-4">
                        <div className="w-16 h-16 mx-auto bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 text-emerald-600">
                            <ShieldCheck size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">%100 Kullanıcı Gizliliği</h3>
                        <p className="text-slate-600 leading-relaxed text-sm">Girdiğiniz veriler hiçbir sunucuya aktarılmaz veya kaydedilmez. Hesaplamaların tümü sadece kendi bilgisayarınızda yapılır.</p>
                    </div>
                    <div className="text-center px-4">
                        <div className="w-16 h-16 mx-auto bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 text-indigo-600">
                            <BarChart3 size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">En Güncel Yasal Mevzuat</h3>
                        <p className="text-slate-600 leading-relaxed text-sm">Değişen KDV dilimleri, güncel SGK oranları veya YKS sınav katsayıları düzenli periyotlarda sistemimize aktarılır.</p>
                    </div>
                </div>
            </section>

            {/* ── SEO CONTENT & FAQs ── */}
            <HomeSEOContent />

            {/* ── STRUCTURED DATA / JSON-LD ── */}
            <Script id="homepage-schema" type="application/ld+json" strategy="afterInteractive" dangerouslySetInnerHTML={{
                __html: JSON.stringify(homepageStructuredData)
            }} />
        </main>
    );
}

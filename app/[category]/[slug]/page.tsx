import { getRelatedArticlesForCalculator } from "@/lib/articles";
import {
    calculators,
    findCalculatorByRoute,
    normalizeCalculatorSlug,
} from "@/lib/calculators";
import { getCategoryName, getCategoryPath, isHealthCategory, normalizeCategorySlug } from "@/lib/categories";
import { generateCalculatorMetadata } from "@/lib/seo";
import { getCalculatorTrustInfo } from "@/lib/calculator-trust";
import { renderRichText } from "@/lib/rich-text";
import dynamic from "next/dynamic";
const CalculatorEngine = dynamic(() => import("@/components/calculator/CalculatorEngine"));
import MedicalDisclaimer from "@/components/health/MedicalDisclaimer";
import SchemaScripts from "@/components/SchemaScripts";
import { notFound, permanentRedirect } from "next/navigation";
import Link from "next/link";

// ─────────────────────────────────────────────────────────────
// ISR: her 24 saatte bir yeniden doğrula
// ─────────────────────────────────────────────────────────────
export const revalidate = 86400;

// ─────────────────────────────────────────────────────────────
// Static params
// ─────────────────────────────────────────────────────────────
export async function generateStaticParams() {
    return calculators.map((calc) => ({
        category: calc.category,
        slug: calc.slug,
    }));
}

// ─────────────────────────────────────────────────────────────
// Metadata
// ─────────────────────────────────────────────────────────────
export async function generateMetadata({
    params,
}: {
    params: { slug: string; category: string };
}) {
    // Burç ve kritik SEO sayfaları için özel metadata/canonical
    const normalizedCategory = normalizeCategorySlug(params.category);
    const normalizedSlug = normalizeCalculatorSlug(params.slug);

    if (
        normalizedCategory === "finansal-hesaplamalar"
        && normalizedSlug === "altin-hesaplama"
    ) {
        return {
            title: "Altın Hesaplama 2026 — Gram Altın, Çeyrek Altın, Cumhuriyet ve Ons Altın Çevirici",
            description:
                "Altın hesaplama aracı ile 24 ayar ve 22 ayar gram altın, çeyrek, yarım, cumhuriyet ve ons altın değerini hesaplayın. Canlı altın hesaplama, altın çevirici ve altın alım satım makas aralığı mantığını tek sayfada görün.",
            alternates: {
                canonical: "https://www.hesapmod.com/finansal-hesaplamalar/altin-hesaplama",
            },
            openGraph: {
                title: "Altın Hesaplama | HesapMod",
                description:
                    "Gram altın, çeyrek altın, cumhuriyet altını ve ons altın için profesyonel hesaplama ve karşılaştırma aracı.",
                url: "https://www.hesapmod.com/finansal-hesaplamalar/altin-hesaplama",
                type: "website",
            },
        };
    }

    if (normalizedCategory === "astroloji" && normalizedSlug === "burc-hesaplama") {
        return {
            title: "Burç Hesaplama — Doğum Tarihine Göre Burç Bul | HesapMod",
            description: "Doğum tarihinizi girin, Batı burcunuzu ve Çin burcunuzu anında öğrenin. Koç'tan Balık'a tüm burçlar, tarihleri, elementleri ve gezegenleriyle. 2026 güncel burç tarihleriyle doğum tarihine göre burç hesaplama.",
            alternates: {
                canonical: "https://www.hesapmod.com/astroloji/burc-hesaplama"
            },
            openGraph: {
                title: "Burç Hesaplama | HesapMod",
                description: "Doğum tarihine göre burç hesaplama aracı.",
                url: "https://www.hesapmod.com/astroloji/burc-hesaplama",
            },
        };
    }
    return generateCalculatorMetadata(normalizedSlug, "tr", normalizedCategory);
}

export default function CalculatorPage({
        params,
}: {
        params: { slug: string; category: string };
}) {
        const normalizedCategory = normalizeCategorySlug(params.category);
        const normalizedSlug = normalizeCalculatorSlug(params.slug);

    if (normalizedCategory !== params.category || normalizedSlug !== params.slug) {
        permanentRedirect(`/${normalizedCategory}/${normalizedSlug}`);
    }

    const calc = findCalculatorByRoute(normalizedSlug, normalizedCategory);
    if (!calc) notFound();

    const isHealth = isHealthCategory(calc.category);
    const trustInfo = getCalculatorTrustInfo(calc.slug, calc.category);

    // Kategori adını mainCategories'den dinamik al — yeni kategori ekleyince burayı değiştirmene gerek yok
    const categoryName = getCategoryName(calc.category);

    // Related calculators (slug'dan tam config'e çözümleme)
    const relatedCalculatorSlugs = new Set(calc.relatedCalculators ?? []);
    const explicitRelatedCalcs = (calc.relatedCalculators ?? [])
        .map((slug) => calculators.find((c) => c.slug === slug))
        .filter(Boolean);
    const supplementalRelatedCalcs = calculators.filter(
        (candidate) =>
            candidate.slug !== calc.slug
            && candidate.category === calc.category
            && !relatedCalculatorSlugs.has(candidate.slug)
    );
    const relatedCalcs = [...explicitRelatedCalcs, ...supplementalRelatedCalcs].slice(0, 4);
    const relatedArticles = getRelatedArticlesForCalculator(calc.slug, calc.category).slice(0, 3);

    // ─────────────────────────────────────────────────────────
    // Ortak bölüm yardımcıları (section badge numaralaması)
    // ─────────────────────────────────────────────────────────
    const sectionBadge = (n: number) => (
        <span className="inline-flex w-8 h-8 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary text-sm font-bold">
            {n}
        </span>
    );

        return (
                <div className="container mx-auto px-4 py-12 max-w-5xl">
                        <SchemaScripts calculator={calc} />

            {/* ── 1. BREADCRUMB + H1 ───────────────────────── */}
            <div className="mb-6">
                <nav
                    aria-label="Gezinti izi"
                    className="text-sm text-muted-foreground mb-6 flex items-center gap-2 flex-wrap"
                >
                    <Link href="/" className="hover:text-primary transition-colors">
                        Ana Sayfa
                    </Link>
                    <span aria-hidden="true">›</span>
                    <Link
                        href={getCategoryPath(calc.category)}
                        className="hover:text-primary transition-colors"
                    >
                        {categoryName}
                    </Link>
                    <span aria-hidden="true">›</span>
                    <span className="text-slate-900">{calc.name.tr}</span>
                </nav>

                {/* YMYL badge — yalnızca sağlık */}
                {isHealth && (
                    <div className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 rounded-full px-3 py-1 mb-4">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                        >
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                            <polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                        Bilgilendirme amaçlı · Tahmini sonuç
                    </div>
                )}

                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-slate-900">
                    {calc.h1?.tr ?? calc.name.tr}
                </h1>
                <p className="text-xl text-slate-600 max-w-3xl">
                    {calc.shortDescription?.tr ?? calc.description.tr}
                </p>

            </div>

            {calc.slug === "enflasyon-hesaplama" && (
                <section
                    aria-labelledby="inflation-current-data-heading"
                    className="mb-8 rounded-3xl border border-orange-200 bg-gradient-to-br from-orange-50 to-white p-6 shadow-sm"
                >
                    {/* TODO: Her ayın 3'ünde TÜİK verisiyle güncelle */}
                    <div className="flex items-start gap-3">
                        {sectionBadge(1)}
                        <div className="min-w-0 flex-1">
                            <h2
                                id="inflation-current-data-heading"
                                className="text-2xl font-bold text-slate-900"
                            >
                                2026 Güncel Enflasyon Verileri
                            </h2>
                            <div className="mt-5 overflow-x-auto">
                                <table className="min-w-full border-collapse text-sm">
                                    <thead>
                                        <tr className="border-b border-slate-200 text-left text-slate-700">
                                            <th className="py-3 pr-4 font-semibold">Dönem</th>
                                            <th className="py-3 pr-4 font-semibold">TÜFE (Yıllık)</th>
                                            <th className="py-3 pr-4 font-semibold">Yİ-ÜFE (Yıllık)</th>
                                            <th className="py-3 font-semibold">12 Aylık Ort.</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-slate-600">
                                        <tr className="border-b border-slate-100">
                                            <td className="py-3 pr-4 font-medium text-slate-900">Şubat 2026</td>
                                            <td className="py-3 pr-4">%31,53</td>
                                            <td className="py-3 pr-4">%27,56</td>
                                            <td className="py-3 font-semibold text-slate-900">%33,39</td>
                                        </tr>
                                        <tr>
                                            <td className="py-3 pr-4 font-medium text-slate-900">Ocak 2026</td>
                                            <td className="py-3 pr-4">%30,65</td>
                                            <td className="py-3 pr-4">—</td>
                                            <td className="py-3">—</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <p className="mt-5 text-sm leading-6 text-slate-700">
                                <strong>Kira artış tavanı (Mart 2026):</strong> TÜFE 12 aylık ortalama %33,39
                                {" "}— hem konut hem işyeri kiraları için yasal üst sınır.
                            </p>
                            <p className="mt-3 text-xs text-slate-500">
                                Kaynak:{" "}
                                <a
                                    href="https://data.tuik.gov.tr/Bulten/Index?p=Tuketici-Fiyat-Endeksi-Subat-2026-53620"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-medium text-slate-700 hover:text-primary transition-colors"
                                >
                                    TÜİK, 3 Mart 2026
                                </a>
                            </p>
                        </div>
                    </div>
                </section>
            )}

            {/* ── 2. HESAP MAKİNESİ ────────────────────────── */}
            <CalculatorEngine
                calculator={{
                    slug: calc.slug,
                    category: calc.category,
                    name: calc.name,
                    inputs: calc.inputs,
                    results: calc.results,
                }}
                lang="tr"
            />

            {/* ── 3. TIBBİ UYARI (yalnızca sağlık, hesap sonrası) ── */}
            {isHealth && (
                <div className="mt-6">
                    <MedicalDisclaimer />
                </div>
            )}

            {(relatedArticles.length > 0 || relatedCalcs.length > 0) && (
                <section
                    aria-labelledby="related-content-heading"
                    className="mt-10 rounded-3xl border border-slate-200 bg-slate-50 p-6 md:p-8"
                >
                    <div className="mb-8">
                        <h2
                            id="related-content-heading"
                            className="text-2xl font-bold text-slate-900"
                        >
                            İlgili Rehberler ve Hesaplamalar
                        </h2>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                            Sonucu farklı senaryolarla karşılaştırmak veya konuyu daha iyi yorumlamak için bu bağlantıları kullanın.
                        </p>
                    </div>

                    <div className="grid gap-8 lg:grid-cols-2">
                        {relatedCalcs.length > 0 && (
                            <div>
                                <div className="mb-4 flex items-center justify-between gap-4">
                                    <h3 className="text-lg font-bold text-slate-900">
                                        İlgili Hesap Makineleri
                                    </h3>
                                    <Link
                                        href={getCategoryPath(calc.category)}
                                        className="text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700"
                                    >
                                        Kategoriye git
                                    </Link>
                                </div>
                                <div className="grid gap-3 sm:grid-cols-2">
                                    {relatedCalcs.map((related) => (
                                        <Link
                                            key={related!.slug}
                                            href={`/${related!.category}/${related!.slug}`}
                                            className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:border-blue-200 hover:shadow-md"
                                        >
                                            <p className="text-sm font-bold text-slate-900 transition-colors group-hover:text-blue-600">
                                                {related!.name.tr}
                                            </p>
                                            <p className="mt-2 text-xs leading-5 text-slate-600 line-clamp-2">
                                                {related!.shortDescription?.tr ?? related!.description.tr}
                                            </p>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {relatedArticles.length > 0 && (
                            <div>
                                <div className="mb-4 flex items-center justify-between gap-4">
                                    <h3 className="text-lg font-bold text-slate-900">
                                        İlgili Rehberler
                                    </h3>
                                    <Link
                                        href="/rehber"
                                        className="text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700"
                                    >
                                        Tüm rehberler
                                    </Link>
                                </div>
                                <div className="grid gap-3">
                                    {relatedArticles.map((article) => (
                                        <Link
                                            key={article.slug}
                                            href={`/rehber/${article.slug}`}
                                            className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:border-blue-200 hover:shadow-md"
                                        >
                                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                                Rehber
                                            </p>
                                            <h3 className="mt-2 text-base font-bold text-slate-900 transition-colors group-hover:text-blue-600">
                                                {article.title}
                                            </h3>
                                            <p className="mt-2 text-sm leading-6 text-slate-600 line-clamp-2">
                                                {article.description}
                                            </p>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* ── (Reklam Slot — in-article, CLS-safe) ────── */}
            <div
                aria-hidden="true"
                className="mt-12 w-full min-h-[90px] rounded-2xl bg-muted/40 border border-dashed border-muted-foreground/20 flex items-center justify-center text-xs text-muted-foreground/40 select-none"
                style={{ contain: "layout" }}
            >
                {/* AdSense buraya */}
            </div>

            {/* ── 4. RICH CONTENT (howItWorks, formül, örnek, rehber) ── */}
            {calc.seo.richContent && (
                <div className="mt-20 space-y-16">
                    {/* Nasıl Çalışır & Formül */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <section aria-labelledby="how-it-works-heading">
                            <h2
                                id="how-it-works-heading"
                                className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900"
                            >
                                {sectionBadge(1)}
                                Nasıl Çalışır?
                            </h2>
                            <p className="text-slate-600 leading-relaxed">
                                {calc.seo.richContent.howItWorks.tr}
                            </p>
                        </section>

                        <section aria-labelledby="formula-heading">
                            <h2
                                id="formula-heading"
                                className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900"
                            >
                                {sectionBadge(2)}
                                Formül
                            </h2>
                            <div className="bg-slate-100 p-6 rounded-2xl border border-slate-200">
                                <code className="text-blue-600 font-mono text-sm block mb-3">
                                    {calc.seo.richContent.formulaText.tr.split(
                                        "."
                                    )[0]}
                                </code>
                                <p className="text-sm text-slate-600">
                                    {calc.seo.richContent.formulaText.tr
                                        .split(".")
                                        .slice(1)
                                        .join(".")}
                                </p>
                            </div>
                        </section>
                    </div>

                    {/* Örnek Hesaplama */}
                    <section
                        aria-labelledby="example-heading"
                        className="bg-blue-50/50 rounded-3xl p-8 border border-blue-100"
                    >
                        <h2
                            id="example-heading"
                            className="text-2xl font-bold mb-6 flex items-center gap-2 text-slate-900"
                        >
                            {sectionBadge(3)}
                            Örnek Hesaplama
                        </h2>
                        <div className="prose prose-slate max-w-none text-slate-600">
                            {calc.seo.richContent.exampleCalculation.tr}
                        </div>
                    </section>

                    {/* Mini Rehber */}
                    <section aria-labelledby="guide-heading">
                        <h2
                            id="guide-heading"
                            className="text-2xl font-bold mb-6 flex items-center gap-2 text-slate-900"
                        >
                            {sectionBadge(4)}
                            {isHealth
                                ? "Sağlık Rehberi ve Önemli Notlar"
                                : "Kullanım Rehberi ve İpuçları"}
                        </h2>
                        <div
                            className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm leading-relaxed text-slate-600 space-y-4"
                            dangerouslySetInnerHTML={{
                                __html: calc.seo.richContent.miniGuide.tr,
                            }}
                        />
                    </section>
                </div>
            )}

            {/* ── 5. SEO İÇERİK + SSS ─────────────────────── */}
            <section
                aria-labelledby="seo-content-heading"
                className="mt-20 prose prose-slate max-w-none border-t border-slate-200 pt-12"
            >
                <h2
                    id="seo-content-heading"
                    className="text-3xl font-bold mb-6 text-slate-900"
                >
                    {`${calc.name.tr} Nedir? ${isHealth ? "Nasıl Yorumlanır?" : "Nasıl Hesaplanır?"}`}
                </h2>
                <div
                    className="text-lg leading-relaxed text-slate-600"
                    dangerouslySetInnerHTML={{
                        __html: renderRichText(calc.seo.content.tr),
                    }}
                />

                {/* SSS */}
                {calc.seo.faq.length > 0 && (
                    <div className="mt-16 bg-slate-50 rounded-2xl p-8 not-prose border border-slate-100">
                        <h3 className="text-2xl font-bold mb-8 text-slate-900">
                            Sıkça Sorulan Sorular
                        </h3>
                        <div className="space-y-6">
                            {calc.seo.faq.map((item, idx) => (
                                <div
                                    key={idx}
                                    className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm"
                                >
                                    <h4 className="font-bold text-lg mb-2 text-slate-900">
                                        {item.q.tr}
                                    </h4>
                                    <p className="text-slate-600">
                                        {item.a.tr}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </section>

            <section
                aria-labelledby="editorial-notes-heading"
                className="mt-16 border-t border-slate-200 pt-12"
            >
                <h2
                    id="editorial-notes-heading"
                    className="text-2xl font-bold text-slate-900"
                >
                    Editoryal Not ve Referanslar
                </h2>
                <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
                    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-900">
                            Bu sayfayı nasıl gözden geçiriyoruz?
                        </h3>
                        <p className="mt-4 text-sm leading-7 text-slate-600">
                            {trustInfo.methodology}
                        </p>
                        <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                            Bu sayfa{" "}
                            <time dateTime={trustInfo.reviewedAt.toISOString()} className="font-semibold text-slate-900">
                                {trustInfo.reviewedLabel}
                            </time>{" "}
                            tarihinde{" "}
                            <Link href={trustInfo.editorHref} className="font-semibold text-slate-900 hover:text-primary transition-colors">
                                {trustInfo.editorName}
                            </Link>{" "}
                            tarafından gözden geçirildi. Hata veya eski veri fark ederseniz{" "}
                            <Link href={trustInfo.feedbackHref} className="font-medium text-primary hover:underline">
                                bize bildirebilirsiniz
                            </Link>
                            .
                        </div>
                        {trustInfo.note && (
                            <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-7 text-amber-900">
                                {trustInfo.note}
                            </div>
                        )}
                    </div>

                    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-900">
                            Başvurduğumuz kaynak grupları
                        </h3>
                        <ul className="mt-5 space-y-4">
                            {trustInfo.sources.map((source) => (
                                <li key={`${source.label}-${source.note}`} className="rounded-2xl bg-slate-50 p-4">
                                    <p className="text-sm font-semibold text-slate-900">
                                        {source.href ? (
                                            <a
                                                href={source.href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="hover:text-primary transition-colors"
                                            >
                                                {source.label}
                                            </a>
                                        ) : (
                                            source.label
                                        )}
                                    </p>
                                    <p className="mt-1 text-sm leading-6 text-slate-600">
                                        {source.note}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* ── 6. Sağlık sayfalarında 2. Disclaimer (footer öncesi) ── */}
            {isHealth && (
                <div className="mt-12">
                    <MedicalDisclaimer />
                </div>
            )}

            {/* ── 7. İLGİLİ HESAP MAKİNELERİ ─────────────── */}
        </div>
    );
}

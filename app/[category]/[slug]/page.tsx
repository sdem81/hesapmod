import { calculators } from "@/lib/calculators";
import { mainCategories } from "@/lib/categories";
import {
    generateCalculatorMetadata,
    generateCalculatorSchema,
    generateHealthSchema,
} from "@/lib/seo";
import CalculatorEngine from "@/components/calculator/CalculatorEngine";
import MedicalDisclaimer from "@/components/health/MedicalDisclaimer";
import { notFound } from "next/navigation";
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
    params: { slug: string };
}) {
    return generateCalculatorMetadata(params.slug, "tr");
}

// ─────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────
export default function CalculatorPage({
    params,
}: {
    params: { slug: string; category: string };
}) {
    const calc = calculators.find((c) => c.slug === params.slug);
    if (!calc) notFound();

    const isHealth = calc.category === "saglik";

    // Kategori adını mainCategories'den dinamik al — yeni kategori ekleyince burayı değiştirmene gerek yok
    const categoryName =
        mainCategories.find((c) => c.slug === calc.category)?.name.tr
        ?? calc.category;

    // Related calculators (slug'dan tam config'e çözümleme)
    const relatedCalcs = (calc.relatedCalculators ?? [])
        .map((slug) => calculators.find((c) => c.slug === slug))
        .filter(Boolean);

    // JSON-LD
    const standardSchema = !isHealth
        ? generateCalculatorSchema(params.slug, "tr")
        : null;
    const healthSchemas = isHealth
        ? generateHealthSchema(params.slug, "tr")
        : null;

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
            {/* ── JSON-LD ──────────────────────────────────── */}
            {standardSchema && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(standardSchema),
                    }}
                />
            )}
            {isHealth && healthSchemas && (
                <>
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{
                            __html: JSON.stringify(
                                healthSchemas.webPageSchema
                            ),
                        }}
                    />
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{
                            __html: JSON.stringify(healthSchemas.webAppSchema),
                        }}
                    />
                    {healthSchemas.faqSchema && (
                        <script
                            type="application/ld+json"
                            dangerouslySetInnerHTML={{
                                __html: JSON.stringify(healthSchemas.faqSchema),
                            }}
                        />
                    )}
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{
                            __html: JSON.stringify(
                                healthSchemas.breadcrumbSchema
                            ),
                        }}
                    />
                </>
            )}

            {/* ── 1. BREADCRUMB + H1 ───────────────────────── */}
            <div className="mb-12">
                <nav
                    aria-label="Gezinti izi"
                    className="text-sm text-muted-foreground mb-6 flex items-center gap-2 flex-wrap"
                >
                    <Link href="/" className="hover:text-primary transition-colors">
                        Ana Sayfa
                    </Link>
                    <span aria-hidden="true">›</span>
                    <Link
                        href={`/kategori/${calc.category}`}
                        className="hover:text-primary transition-colors"
                    >
                        {categoryName}
                    </Link>
                    <span aria-hidden="true">›</span>
                    <span className="text-foreground">{calc.name.tr}</span>
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

                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
                    {calc.h1?.tr ?? calc.name.tr}
                </h1>
                <p className="text-xl text-muted-foreground max-w-3xl">
                    {calc.shortDescription?.tr ?? calc.description.tr}
                </p>
            </div>

            {/* ── 2. HESAP MAKİNESİ ────────────────────────── */}
            <CalculatorEngine slug={params.slug} lang="tr" />

            {/* ── 3. TIBBİ UYARI (yalnızca sağlık, hesap sonrası) ── */}
            {isHealth && (
                <div className="mt-6">
                    <MedicalDisclaimer />
                </div>
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
                                className="text-2xl font-bold mb-4 flex items-center gap-2"
                            >
                                {sectionBadge(1)}
                                Nasıl Çalışır?
                            </h2>
                            <p className="text-muted-foreground leading-relaxed">
                                {calc.seo.richContent.howItWorks.tr}
                            </p>
                        </section>

                        <section aria-labelledby="formula-heading">
                            <h2
                                id="formula-heading"
                                className="text-2xl font-bold mb-4 flex items-center gap-2"
                            >
                                {sectionBadge(2)}
                                Formül
                            </h2>
                            <div className="bg-muted/50 p-6 rounded-2xl border border-primary/10">
                                <code className="text-primary font-mono text-sm block mb-3">
                                    {calc.seo.richContent.formulaText.tr.split(
                                        "."
                                    )[0]}
                                </code>
                                <p className="text-sm text-muted-foreground">
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
                        className="bg-primary/5 rounded-3xl p-8 border border-primary/10"
                    >
                        <h2
                            id="example-heading"
                            className="text-2xl font-bold mb-6 flex items-center gap-2"
                        >
                            {sectionBadge(3)}
                            Örnek Hesaplama
                        </h2>
                        <div className="prose prose-slate dark:prose-invert max-w-none text-muted-foreground">
                            {calc.seo.richContent.exampleCalculation.tr}
                        </div>
                    </section>

                    {/* Mini Rehber */}
                    <section aria-labelledby="guide-heading">
                        <h2
                            id="guide-heading"
                            className="text-2xl font-bold mb-6 flex items-center gap-2"
                        >
                            {sectionBadge(4)}
                            {isHealth
                                ? "Sağlık Rehberi ve Önemli Notlar"
                                : "Kullanım Rehberi ve İpuçları"}
                        </h2>
                        <div
                            className="bg-card border rounded-3xl p-8 shadow-sm leading-relaxed text-muted-foreground space-y-4"
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
                className="mt-20 prose prose-slate dark:prose-invert max-w-none border-t pt-12"
            >
                <h2
                    id="seo-content-heading"
                    className="text-3xl font-bold mb-6"
                >
                    {calc.name.tr} Nedir?{" "}
                    {isHealth ? "Nasıl Yorumlanır?" : "Nasıl Hesaplanır?"}
                </h2>
                <div className="text-lg leading-relaxed text-muted-foreground whitespace-pre-line">
                    {calc.seo.content.tr}
                </div>

                {/* SSS */}
                {calc.seo.faq.length > 0 && (
                    <div className="mt-16 bg-muted/30 rounded-2xl p-8 not-prose">
                        <h3 className="text-2xl font-bold mb-8">
                            Sıkça Sorulan Sorular
                        </h3>
                        <div className="space-y-6">
                            {calc.seo.faq.map((item, idx) => (
                                <div
                                    key={idx}
                                    className="bg-background p-6 rounded-xl border"
                                >
                                    <h4 className="font-bold text-lg mb-2">
                                        {item.q.tr}
                                    </h4>
                                    <p className="text-muted-foreground">
                                        {item.a.tr}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </section>

            {/* ── 6. Sağlık sayfalarında 2. Disclaimer (footer öncesi) ── */}
            {isHealth && (
                <div className="mt-12">
                    <MedicalDisclaimer />
                </div>
            )}

            {/* ── 7. İLGİLİ HESAP MAKİNELERİ ─────────────── */}
            {relatedCalcs.length > 0 && (
                <section
                    aria-labelledby="related-heading"
                    className="mt-16 pt-12 border-t"
                >
                    <h2
                        id="related-heading"
                        className="text-2xl font-bold mb-8"
                    >
                        İlgili Hesap Makineleri
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {relatedCalcs.map((related) => (
                            <Link
                                key={related!.slug}
                                href={`/${related!.category}/${related!.slug}`}
                                className="group block bg-card border rounded-2xl p-5 hover:border-primary/50 hover:shadow-md transition-all duration-200"
                            >
                                {/* Sağlık badge'i */}
                                {related!.category === "saglik" && (
                                    <span className="inline-block text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 rounded-full px-2 py-0.5 mb-2">
                                        Sağlık
                                    </span>
                                )}
                                <p className="font-semibold text-base mb-1 group-hover:text-primary transition-colors">
                                    {related!.name.tr}
                                </p>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                    {related!.shortDescription?.tr ??
                                        related!.description.tr}
                                </p>
                            </Link>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}

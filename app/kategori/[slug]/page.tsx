import { CategoryIcon } from "@/components/category/CategoryIcon";
import { getArticlesByCategorySlug } from "@/lib/articles";
import { calculators } from "@/lib/calculators";
import {
    getCategoryBySlug,
    getCategoryPath,
    mainCategories,
    normalizeCategorySlug,
} from "@/lib/categories";
import { generateCategorySchema } from "@/lib/seo";
import { ArrowRight, Calculator, FileText } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

function formatDateLabel(date: string) {
    return new Date(date).toLocaleDateString("tr-TR", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

export async function generateStaticParams() {
    return mainCategories.map((cat) => ({ slug: cat.slug }));
}

export async function generateMetadata({
    params,
}: {
    params: { slug: string };
}): Promise<Metadata> {
    const cat = getCategoryBySlug(params.slug);
    if (!cat) return { title: "Bulunamadı" };

    const toolCount = calculators.filter((calculator) => calculator.category === cat.slug).length;
    const guideCount = getArticlesByCategorySlug(cat.slug).length;
    const categoryName = cat.name.tr.toLocaleLowerCase("tr-TR");
    const guideSnippet =
        guideCount > 0 ? ` Ayrıca ${guideCount} ilgili rehber içerik de bulunur.` : "";

    return {
        title: `${cat.name.tr} Hesaplama Araçları`,
        description: `${toolCount} adet ${categoryName} hesaplama aracı burada. ${cat.description.tr}${guideSnippet}`,
        alternates: { canonical: getCategoryPath(cat.slug) },
    };
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
    const normalizedSlug = normalizeCategorySlug(params.slug);
    if (normalizedSlug !== params.slug) {
        redirect(getCategoryPath(normalizedSlug));
    }

    const cat = getCategoryBySlug(normalizedSlug);
    if (!cat) notFound();

    const categoryCounts = new Map<string, number>();
    for (const calculator of calculators) {
        categoryCounts.set(
            calculator.category,
            (categoryCounts.get(calculator.category) ?? 0) + 1
        );
    }

    const catCalcs = calculators
        .filter((calculator) => calculator.category === cat.slug)
        .sort((a, b) => a.name.tr.localeCompare(b.name.tr, "tr"));
    const featuredCalcs = catCalcs.slice(0, 6);
    const relatedArticles = getArticlesByCategorySlug(cat.slug);
    const siblingCategories = mainCategories.filter((category) => category.slug !== cat.slug);
    const schemas = generateCategorySchema(cat.slug, "tr");

    return (
        <div className="container mx-auto px-4 py-16 max-w-6xl">
            {schemas && (
                <>
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{
                            __html: JSON.stringify(schemas.collectionSchema),
                        }}
                    />
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{
                            __html: JSON.stringify(schemas.breadcrumbSchema),
                        }}
                    />
                    {schemas.faqSchema && (
                        <script
                            type="application/ld+json"
                            dangerouslySetInnerHTML={{
                                __html: JSON.stringify(schemas.faqSchema),
                            }}
                        />
                    )}
                </>
            )}

            <nav className="mb-8 flex items-center gap-2 text-sm text-slate-500">
                <Link href="/" className="transition-colors hover:text-blue-600">
                    Ana Sayfa
                </Link>
                <ArrowRight size={14} />
                <span className="font-medium text-slate-900">{cat.name.tr}</span>
            </nav>

            <section className="mb-14 rounded-[2rem] border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-blue-50/50 p-8 shadow-sm md:p-10">
                <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
                    <div className="max-w-3xl">
                        <div className="mb-5 flex flex-wrap items-center gap-3">
                            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200">
                                <CategoryIcon icon={cat.icon} size={18} className="text-blue-600" />
                                {cat.name.tr}
                            </span>
                            <span className="rounded-full bg-blue-600 px-3 py-1 text-sm font-semibold text-white">
                                {catCalcs.length} araç
                            </span>
                            {relatedArticles.length > 0 && (
                                <span className="rounded-full bg-slate-900 px-3 py-1 text-sm font-semibold text-white">
                                    {relatedArticles.length} rehber
                                </span>
                            )}
                        </div>

                        <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
                            {cat.name.tr} Hesaplama Araçları
                        </h1>
                        <p className="max-w-2xl text-lg leading-relaxed text-slate-600">
                            {cat.description.tr}
                        </p>
                    </div>

                    {featuredCalcs.length > 0 && (
                        <div className="rounded-3xl border border-white/80 bg-white/80 p-5 shadow-sm backdrop-blur">
                            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                                Hızlı Başlangıç
                            </p>
                            <div className="flex max-w-md flex-wrap gap-2">
                                {featuredCalcs.map((calc) => (
                                    <Link
                                        key={calc.id}
                                        href={`/${calc.category}/${calc.slug}`}
                                        className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                                    >
                                        {calc.name.tr}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {catCalcs.length === 0 ? (
                <div className="py-24 text-center text-slate-400">
                    <Calculator size={48} className="mx-auto mb-4 opacity-30" />
                    <p className="text-lg">Bu kategoride henüz araç bulunmuyor.</p>
                </div>
            ) : (
                <section className="mb-20">
                    <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                                Kategorideki Araçlar
                            </h2>
                            <p className="mt-2 max-w-2xl text-slate-600">
                                Bu kategorideki araçlar hızlı karşılaştırma, ön kontrol ve hesaplama ihtiyacı için tek yerde toplanır.
                            </p>
                        </div>
                        <div className="text-sm font-medium text-slate-500">
                            Toplam {catCalcs.length} araç
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {catCalcs.map((calc) => (
                            <Link
                                key={calc.id}
                                href={`/${calc.category}/${calc.slug}`}
                                className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
                            >
                                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-50 transition-colors group-hover:bg-blue-50">
                                    <Calculator
                                        className="text-slate-500 transition-colors group-hover:text-blue-600"
                                        size={18}
                                    />
                                </div>
                                <h3 className="mb-2 text-lg font-bold text-slate-900 transition-colors group-hover:text-blue-600">
                                    {calc.name.tr}
                                </h3>
                                <p className="line-clamp-3 text-sm leading-relaxed text-slate-600">
                                    {(calc.shortDescription ?? calc.description).tr}
                                </p>
                                <div className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-blue-600 opacity-0 transition-opacity group-hover:opacity-100">
                                    Araca git <ArrowRight size={12} />
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {relatedArticles.length > 0 && (
                <section className="mb-20">
                    <div className="mb-8 flex items-end justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                                İlgili Rehberler
                            </h2>
                            <p className="mt-2 max-w-2xl text-slate-600">
                                Konuyu önce okuyup sonra ilgili hesaplama araçlarına geçmek için bu rehberleri kullanın.
                            </p>
                        </div>
                        <Link
                            href="/rehber"
                            className="hidden items-center gap-2 text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700 md:inline-flex"
                        >
                            Tüm rehberler <ArrowRight size={14} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {relatedArticles.map((article) => (
                            <Link
                                key={article.slug}
                                href={`/rehber/${article.slug}`}
                                className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
                            >
                                <div className="mb-4 flex items-center gap-3 text-sm text-slate-500">
                                    <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-700">
                                        <FileText size={14} />
                                        Rehber
                                    </span>
                                    <span>
                                        {formatDateLabel(article.updatedAt ?? article.publishedAt)}
                                    </span>
                                </div>
                                <h3 className="mb-2 text-xl font-bold leading-snug text-slate-900 transition-colors group-hover:text-blue-600">
                                    {article.title}
                                </h3>
                                <p className="line-clamp-3 text-sm leading-relaxed text-slate-600">
                                    {article.description}
                                </p>
                                <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-600">
                                    Rehberi aç <ArrowRight size={14} />
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {(cat.seoContent || (cat.faq && cat.faq.length > 0)) && (
                <section className="mt-20 border-t border-border/50 pt-16">
                    <div className="mx-auto max-w-4xl">
                        {cat.seoContent && (
                            <div className="prose prose-slate max-w-none mb-16">
                                <h2 className="mb-6 text-3xl font-bold text-slate-900">
                                    {cat.name.tr} Nedir?
                                </h2>
                                <p className="text-lg leading-relaxed text-slate-600">
                                    {cat.seoContent.tr}
                                </p>
                            </div>
                        )}

                        {cat.faq && cat.faq.length > 0 && (
                            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:p-10">
                                <h3 className="mb-8 text-2xl font-bold text-slate-900">
                                    Sıkça Sorulan Sorular
                                </h3>
                                <div className="space-y-6">
                                    {cat.faq.map((item, idx) => (
                                        <div
                                            key={idx}
                                            className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm transition-shadow hover:shadow-md"
                                        >
                                            <h4 className="mb-3 text-lg font-bold text-slate-900">
                                                {item.q.tr}
                                            </h4>
                                            <p className="leading-relaxed text-slate-600">
                                                {item.a.tr}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            )}

            <section className="mt-16 border-t border-slate-200 pt-10">
                <div className="mb-6 flex items-end justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                            Diğer Kategoriler
                        </h2>
                        <p className="mt-2 text-slate-600">
                            Farklı hesaplama başlıklarına da buradan geçebilirsiniz.
                        </p>
                    </div>
                    <Link
                        href="/tum-araclar"
                        className="hidden items-center gap-2 text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700 md:inline-flex"
                    >
                        Tüm araçları gör <ArrowRight size={14} />
                    </Link>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {siblingCategories.slice(0, 4).map((category) => (
                        <Link
                            key={category.id}
                            href={getCategoryPath(category.slug)}
                            className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
                        >
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 transition-colors group-hover:bg-blue-50 group-hover:text-blue-600">
                                <CategoryIcon icon={category.icon} size={22} />
                            </div>
                            <div className="mb-1 flex items-center justify-between gap-3">
                                <h3 className="font-semibold text-slate-900 transition-colors group-hover:text-blue-600">
                                    {category.name.tr}
                                </h3>
                                <span className="text-xs font-semibold text-slate-500">
                                    {categoryCounts.get(category.slug) ?? 0}
                                </span>
                            </div>
                            <p className="line-clamp-2 text-sm text-slate-600">
                                {category.description.tr}
                            </p>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
}

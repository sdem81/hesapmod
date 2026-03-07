import { articles } from "@/lib/articles";
import { calculators } from "@/lib/calculators";
import { getCategoryPath } from "@/lib/categories";
import { SITE_EDITOR_NAME, SITE_NAME, SITE_URL } from "@/lib/site";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Rehber & İpuçları",
    description:
        "Maaş, kıdem tazminatı, vergi ve sigorta konularında bilgilendirici rehberler. Hesaplama araçlarımızla desteklenmiş, güncel ve pratik makaleler.",
    alternates: { canonical: "/rehber" },
    openGraph: {
        title: `Rehber & İpuçları — ${SITE_NAME}`,
        description: "Türkiye'nin en kapsamlı hesaplama araçları platformundan güncel rehber makaleleri.",
        url: `${SITE_URL}/rehber`,
        type: "website",
    },
};

const categoryColors: Record<string, string> = {
    "Maaş & Vergi": "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
    "Finans": "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
    "Sağlık": "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300",
    "Matematik": "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
};

export default function RehberPage() {
    const latestArticleDate = articles.reduce((latest, article) => {
        const current = new Date(article.updatedAt ?? article.publishedAt).getTime();
        return current > latest ? current : latest;
    }, 0);

    const structuredData = [
        {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
                {
                    "@type": "ListItem",
                    position: 1,
                    name: "Ana Sayfa",
                    item: SITE_URL,
                },
                {
                    "@type": "ListItem",
                    position: 2,
                    name: "Rehber",
                    item: `${SITE_URL}/rehber`,
                },
            ],
        },
        {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: `${SITE_NAME} Rehber`,
            url: `${SITE_URL}/rehber`,
            description: "Maaş, tazminat, vergi ve sigorta konularında güncel rehberler.",
            inLanguage: "tr-TR",
            dateModified: latestArticleDate ? new Date(latestArticleDate).toISOString() : undefined,
            mainEntity: {
                "@type": "ItemList",
                numberOfItems: articles.length,
                itemListElement: articles.map((article, index) => ({
                    "@type": "ListItem",
                    position: index + 1,
                    url: `${SITE_URL}/rehber/${article.slug}`,
                    name: article.title,
                })),
            },
            publisher: {
                "@type": "Organization",
                name: SITE_NAME,
                url: SITE_URL,
            },
        },
        {
            "@context": "https://schema.org",
            "@type": "Blog",
            name: `${SITE_NAME} Rehber`,
            url: `${SITE_URL}/rehber`,
            description: "Maaş, tazminat, vergi ve sigorta konularında güncel rehberler.",
            inLanguage: "tr-TR",
            author: {
                "@type": "Organization",
                name: SITE_EDITOR_NAME,
                url: `${SITE_URL}/hakkimizda`,
            },
            publisher: {
                "@type": "Organization",
                name: SITE_NAME,
                url: SITE_URL,
            },
            blogPost: articles.map((article) => ({
                "@type": "BlogPosting",
                headline: article.title,
                description: article.description,
                url: `${SITE_URL}/rehber/${article.slug}`,
                datePublished: article.publishedAt,
                dateModified: article.updatedAt ?? article.publishedAt,
                articleSection: article.category,
            })),
        },
    ];

    return (
        <div className="container mx-auto px-4 py-16 max-w-5xl">
            {/* Hero */}
            <div className="mb-16 text-center">
                <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary bg-primary/10 rounded-full px-4 py-1.5 mb-4">
                    Rehber & İpuçları
                </span>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
                    Hesaplamalar Hakkında Her Şey
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Maaş, tazminat, vergi ve sigorta konularında anlaşılır rehberler. Konuyu öğrenin, ardından
                    hesaplayıcımızla sonucunuzu anında alın.
                </p>
                <p className="mt-4 text-sm text-slate-600 max-w-2xl mx-auto">
                    Tüm içerikler {SITE_EDITOR_NAME} tarafından düzenli olarak gözden geçirilir ve ilgili hesaplama sayfalarıyla birlikte güncellenir.
                </p>
            </div>

            {/* Makale Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {articles.map((article) => {
                    const related = (article.relatedCalculators ?? [])
                        .map((slug) => calculators.find((c) => c.slug === slug))
                        .filter(Boolean);

                    return (
                        <article
                            key={article.slug}
                            className="group bg-card border rounded-2xl p-6 hover:border-primary/50 hover:shadow-lg transition-all duration-200 flex flex-col"
                        >
                            {/* Üst Kısım */}
                            <div className="flex items-center justify-between mb-3">
                                <Link
                                    href={getCategoryPath(article.categorySlug)}
                                    className={`text-xs font-semibold rounded-full px-3 py-1 transition-opacity hover:opacity-80 ${categoryColors[article.category] ?? "bg-muted text-muted-foreground"
                                        }`}
                                >
                                    {article.category}
                                </Link>
                                <span className="text-xs text-muted-foreground">
                                    {article.readingTime} dk okuma
                                </span>
                            </div>

                            {/* Başlık & Açıklama */}
                            <Link href={`/rehber/${article.slug}`} className="flex-1">
                                <h2 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors leading-snug">
                                    {article.title}
                                </h2>
                                <p className="text-sm text-muted-foreground line-clamp-3">
                                    {article.description}
                                </p>
                                <p className="mt-3 text-xs text-slate-500">
                                    Güncelleme: {new Date(article.updatedAt ?? article.publishedAt).toLocaleDateString("tr-TR", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </p>
                            </Link>

                            {/* İlgili Araçlar */}
                            {related.length > 0 && (
                                <div className="mt-5 pt-4 border-t border-border/60">
                                    <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                                        İlgili Araçlar
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {related.map((calc) => (
                                            <Link
                                                key={calc!.slug}
                                                href={`/${calc!.category}/${calc!.slug}`}
                                                className="inline-flex items-center text-xs bg-primary/10 text-primary rounded-lg px-2.5 py-1 hover:bg-primary/20 transition-colors"
                                            >
                                                {calc!.name.tr}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </article>
                    );
                })}
            </div>

            {/* JSON-LD */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(structuredData),
                }}
            />
        </div>
    );
}

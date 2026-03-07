import { articles, getArticleBySlug, getAllArticleSlugs } from "@/lib/articles";
import { calculators } from "@/lib/calculators";
import { getCategoryPath } from "@/lib/categories";
import { SITE_EDITOR_NAME, SITE_NAME, SITE_PUBLISHER_LOGO_URL, SITE_URL } from "@/lib/site";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

function formatDateLabel(date: string) {
    return new Date(date).toLocaleDateString("tr-TR", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

function getWordCount(content: string) {
    const plainText = content
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim();

    return plainText.length > 0 ? plainText.split(" ").length : 0;
}

export async function generateStaticParams() {
    return getAllArticleSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
    params,
}: {
    params: { slug: string };
}): Promise<Metadata> {
    const article = getArticleBySlug(params.slug);
    if (!article) return {};
    return {
        title: article.title,
        description: article.description,
        keywords: article.keywords.join(", "),
        alternates: { canonical: `/rehber/${article.slug}` },
        openGraph: {
            title: article.title,
            description: article.description,
            url: `${SITE_URL}/rehber/${article.slug}`,
            type: "article",
            publishedTime: article.publishedAt,
            modifiedTime: article.updatedAt ?? article.publishedAt,
            authors: [SITE_EDITOR_NAME],
            siteName: SITE_NAME,
        },
    };
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
    const article = getArticleBySlug(params.slug);
    if (!article) notFound();

    const articleUrl = `${SITE_URL}/rehber/${article.slug}`;
    const modifiedAt = article.updatedAt ?? article.publishedAt;
    const wordCount = getWordCount(article.content);

    const relatedCalcs = (article.relatedCalculators ?? [])
        .map((slug) => calculators.find((c) => c.slug === slug))
        .filter(Boolean);

    // Diğer makaleler (sidebar için)
    const otherArticles = articles.filter((a) => a.slug !== article.slug).slice(0, 4);
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
                {
                    "@type": "ListItem",
                    position: 3,
                    name: article.title,
                    item: articleUrl,
                },
            ],
        },
        {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "@id": articleUrl,
            name: article.title,
            url: articleUrl,
            description: article.description,
            inLanguage: "tr-TR",
            isPartOf: {
                "@type": "WebSite",
                name: SITE_NAME,
                url: SITE_URL,
            },
            breadcrumb: {
                "@id": `${articleUrl}#breadcrumb`,
            },
            datePublished: article.publishedAt,
            dateModified: modifiedAt,
        },
        {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: article.title,
            description: article.description,
            datePublished: article.publishedAt,
            dateModified: modifiedAt,
            articleSection: article.category,
            keywords: article.keywords.join(", "),
            wordCount,
            inLanguage: "tr-TR",
            isAccessibleForFree: true,
            url: articleUrl,
            mainEntityOfPage: {
                "@type": "WebPage",
                "@id": articleUrl,
            },
            image: `${SITE_URL}/opengraph-image`,
            author: {
                "@type": "Organization",
                name: SITE_EDITOR_NAME,
                url: `${SITE_URL}/hakkimizda`,
            },
            editor: SITE_EDITOR_NAME,
            publisher: {
                "@type": "Organization",
                name: SITE_NAME,
                url: SITE_URL,
                logo: {
                    "@type": "ImageObject",
                    url: SITE_PUBLISHER_LOGO_URL,
                },
            },
            about: article.keywords.map((keyword) => ({
                "@type": "Thing",
                name: keyword,
            })),
        },
    ];

    return (
        <div className="container mx-auto px-4 py-12 max-w-5xl">
            {/* JSON-LD */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(structuredData),
                }}
            />

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12">
                {/* Ana İçerik */}
                <main>
                    {/* Breadcrumb */}
                    <nav aria-label="Gezinti izi" className="text-sm text-muted-foreground flex items-center gap-2 mb-8 flex-wrap">
                        <Link href="/" className="hover:text-primary transition-colors">Ana Sayfa</Link>
                        <span aria-hidden>›</span>
                        <Link href="/rehber" className="hover:text-primary transition-colors">Rehber</Link>
                        <span aria-hidden>›</span>
                        <span className="text-foreground">{article.title}</span>
                    </nav>

                    {/* Meta */}
                    <div className="flex items-center gap-3 mb-4">
                        <Link
                            href={getCategoryPath(article.categorySlug)}
                            className="text-xs font-semibold bg-primary/10 text-primary rounded-full px-3 py-1 transition-colors hover:bg-primary/15"
                        >
                            {article.category}
                        </Link>
                        <span className="text-xs text-muted-foreground">
                            Yayın: {formatDateLabel(article.publishedAt)}
                        </span>
                        <span className="text-xs text-muted-foreground">· Son güncelleme: {formatDateLabel(modifiedAt)}</span>
                        <span className="text-xs text-muted-foreground">· {article.readingTime} dk okuma</span>
                    </div>

                    {/* Başlık */}
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4 leading-tight">
                        {article.title}
                    </h1>
                    <p className="text-xl text-muted-foreground mb-10 leading-relaxed">{article.description}</p>

                    <div className="mb-8 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                        Bu içerik {formatDateLabel(modifiedAt)} tarihinde {SITE_EDITOR_NAME} tarafından gözden geçirilmiş ve ilgili hesaplama araçlarıyla uyumlu olacak şekilde güncellenmiştir.
                    </div>

                    {/* Makale İçeriği */}
                    <article
                        className="prose prose-slate dark:prose-invert max-w-none
                            prose-headings:font-bold prose-headings:tracking-tight
                            prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
                            prose-p:leading-relaxed prose-p:text-muted-foreground
                            prose-ul:text-muted-foreground prose-li:my-1
                            prose-table:text-sm prose-thead:bg-muted/50
                            prose-code:text-primary prose-code:bg-primary/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded"
                        dangerouslySetInnerHTML={{ __html: article.content }}
                    />

                    {/* İlgili Hesap Makineleri CTA */}
                    {relatedCalcs.length > 0 && (
                        <section className="mt-12 bg-primary/5 border border-primary/20 rounded-2xl p-6">
                            <h2 className="text-lg font-bold mb-4">Hemen Hesapla</h2>
                            <p className="text-sm text-muted-foreground mb-4">
                                Bu makalede bahsedilen hesaplamaları anında yapmak için ücretsiz araçlarımızı kullanın:
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {relatedCalcs.map((calc) => (
                                    <Link
                                        key={calc!.slug}
                                        href={`/${calc!.category}/${calc!.slug}`}
                                        className="flex items-center gap-2 bg-card border rounded-xl px-4 py-3 text-sm font-medium hover:border-primary/50 hover:text-primary hover:shadow-sm transition-all"
                                    >
                                        <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                                        {calc!.name.tr}
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}
                </main>

                {/* Sidebar */}
                <aside className="hidden lg:block">
                    <div className="sticky top-24 space-y-6">
                        {/* Diğer Rehberler */}
                        <div className="bg-card border rounded-2xl p-5">
                            <h3 className="font-bold mb-4 text-sm uppercase tracking-wide text-muted-foreground">
                                Diğer Rehberler
                            </h3>
                            <ul className="space-y-3">
                                {otherArticles.map((a) => (
                                    <li key={a.slug}>
                                        <Link
                                            href={`/rehber/${a.slug}`}
                                            className="text-sm font-medium hover:text-primary transition-colors leading-snug line-clamp-2 block"
                                        >
                                            {a.title}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                            <Link
                                href="/rehber"
                                className="mt-4 block text-xs text-primary hover:underline"
                            >
                                Tüm rehberleri gör →
                            </Link>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}

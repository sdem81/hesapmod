import { calculators } from "@/lib/calculators";
import { mainCategories } from "@/lib/categories";
import { generateCategorySchema } from "@/lib/seo";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { ArrowRight, Calculator } from "lucide-react";
import Link from "next/link";

export async function generateStaticParams() {
    return mainCategories.map((cat) => ({ slug: cat.slug }));
}

export async function generateMetadata({
    params,
}: {
    params: { slug: string };
}): Promise<Metadata> {
    const cat = mainCategories.find((c) => c.slug === params.slug);
    if (!cat) return { title: "Bulunamadı" };
    return {
        title: `${cat.name.tr} Hesaplama Araçları | HesapMod`,
        description: `${cat.description.tr} Tüm ${cat.name.tr.toLowerCase()} hesaplama araçları burada.`,
        alternates: { canonical: `/kategori/${cat.slug}` },
    };
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
    const cat = mainCategories.find((c) => c.slug === params.slug);
    if (!cat) notFound();

    const catCalcs = calculators.filter((c) => c.category === cat.slug);
    const schemas = generateCategorySchema(params.slug, "tr");

    return (
        <div className="container mx-auto px-4 py-16 max-w-6xl">
            {/* JSON-LD Schemas */}
            {schemas && (
                <>
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.collectionSchema) }}
                    />
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.breadcrumbSchema) }}
                    />
                    {schemas.faqSchema && (
                        <script
                            type="application/ld+json"
                            dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.faqSchema) }}
                        />
                    )}
                </>
            )}

            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-10">
                <Link href="/" className="hover:text-primary transition-colors">Ana Sayfa</Link>
                <ArrowRight size={14} />
                <span className="text-foreground font-medium">{cat.name.tr}</span>
            </nav>

            {/* Header */}
            <div className="mb-14">
                <div className="inline-flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <Calculator className="text-primary" size={22} />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                        {cat.name.tr} Araçları
                    </h1>
                </div>
                <p className="text-xl text-muted-foreground max-w-2xl">{cat.description.tr}</p>
            </div>

            {/* Calculator Grid */}
            {catCalcs.length === 0 ? (
                <div className="text-center py-24 text-muted-foreground">
                    <Calculator size={48} className="mx-auto mb-4 opacity-30" />
                    <p className="text-lg">Bu kategoride henüz araç bulunmuyor.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {catCalcs.map((calc) => (
                        <Link
                            key={calc.id}
                            href={`/${calc.category}/${calc.slug}`}
                            className="group p-6 rounded-2xl bg-card border hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all"
                        >
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Calculator className="text-primary" size={18} />
                            </div>
                            <h2 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                                {calc.name.tr}
                            </h2>
                            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                                {calc.description.tr}
                            </p>
                            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                Hesapla <ArrowRight size={12} />
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {/* SEO Content & FAQ Section */}
            {(cat.seoContent || (cat.faq && cat.faq.length > 0)) && (
                <section className="mt-20 pt-16 border-t border-border/50">
                    <div className="max-w-4xl mx-auto">
                        {cat.seoContent && (
                            <div className="prose prose-slate dark:prose-invert max-w-none mb-16">
                                <h2 className="text-3xl font-bold mb-6">
                                    {cat.name.tr} Nedir?
                                </h2>
                                <p className="text-lg leading-relaxed text-muted-foreground">
                                    {cat.seoContent.tr}
                                </p>
                            </div>
                        )}

                        {cat.faq && cat.faq.length > 0 && (
                            <div className="bg-muted/30 rounded-3xl p-8 md:p-10 border border-border/50">
                                <h3 className="text-2xl font-bold mb-8 flex items-center gap-2">
                                    Sıkça Sorulan Sorular
                                </h3>
                                <div className="space-y-6">
                                    {cat.faq.map((item, idx) => (
                                        <div
                                            key={idx}
                                            className="bg-background p-6 rounded-2xl border shadow-sm hover:shadow-md transition-shadow"
                                        >
                                            <h4 className="font-bold text-lg mb-3 text-foreground">
                                                {item.q.tr}
                                            </h4>
                                            <p className="text-muted-foreground leading-relaxed">
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

            {/* Back link */}
            <div className="mt-16 pt-8 border-t">
                <Link
                    href="/tum-araclar"
                    className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
                >
                    Tüm Araçları Gör <ArrowRight size={16} />
                </Link>
            </div>
        </div>
    );
}

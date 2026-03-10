// ✅ C-1 FIX: Server Component + metadata export (artık index edilebilir)
import { CategoryIcon } from "@/components/category/CategoryIcon";
import { mainCategories } from "@/lib/categories";
import { Metadata } from "next";
import Script from "next/script";
import {
    calculatorCount,
    calculatorSearchIndex,
    calculators,
} from "@/lib/calculators";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import AllToolsClient from "./AllToolsClient";
import Link from "next/link";
import { ArrowRight, Calculator } from "lucide-react";

export const metadata: Metadata = {
    title: "Tüm Hesaplama Araçları — Ücretsiz Online Hesap Makineleri",
    description: `${calculatorCount} ücretsiz hesaplama aracı tek sayfada. Finans, sağlık, matematik ve günlük yaşam kategorilerinde online hesaplama araçları.`,
    alternates: {
        canonical: "/tum-araclar",
    },
    openGraph: {
        title: "Tüm Hesaplama Araçları | HesapMod",
        description: "Finans, sağlık, matematik ve günlük yaşam için ücretsiz hesaplama araçları.",
        url: `${SITE_URL}/tum-araclar`,
    },
};

export default function AllToolsPage() {
    const categoryEntries = mainCategories
        .map((category) => ({
            category,
            items: calculators
                .filter((calculator) => calculator.category === category.slug)
                .sort((left, right) => left.name.tr.localeCompare(right.name.tr, "tr")),
        }))
        .filter(({ items }) => items.length > 0);

    const itemListSchema = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Tüm Hesaplama Araçları",
        url: `${SITE_URL}/tum-araclar`,
        description: `${calculatorCount} ücretsiz hesaplama aracı tek sayfada. Finans, sağlık, matematik ve günlük yaşam kategorilerinde online hesaplama araçları.`,
        isPartOf: {
            "@type": "WebSite",
            name: SITE_NAME,
            url: SITE_URL,
        },
        mainEntity: {
            "@type": "ItemList",
            numberOfItems: calculatorCount,
            itemListElement: calculators.map((calculator, index) => ({
                "@type": "ListItem",
                position: index + 1,
                name: calculator.name.tr,
                url: `${SITE_URL}/${calculator.category}/${calculator.slug}`,
            })),
        },
    };

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: SITE_URL },
            { "@type": "ListItem", position: 2, name: "Tüm Araçlar", item: `${SITE_URL}/tum-araclar` },
        ],
    };

    return (
        <div className="container mx-auto px-4 py-16 max-w-6xl">
            <Script id="all-tools-schema" type="application/ld+json" strategy="afterInteractive" dangerouslySetInnerHTML={{
                __html: JSON.stringify(itemListSchema),
            }} />
            <Script id="all-tools-breadcrumb" type="application/ld+json" strategy="afterInteractive" dangerouslySetInnerHTML={{
                __html: JSON.stringify(breadcrumbSchema),
            }} />

            {/* Header — sunucuda render edilir, SEO için ideal */}
            <div className="mb-12 text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
                    Tüm Hesaplama Araçları
                </h1>
                <p className="text-xl text-muted-foreground mb-8">
                    {calculatorCount} ücretsiz hesaplama aracı tek sayfada.
                </p>
            </div>

            <div className="mb-12 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <AllToolsClient entries={calculatorSearchIndex} />
            </div>

            <section className="mb-16 rounded-3xl border border-slate-200 bg-slate-50 p-6 md:p-8">
                <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                            Kategori Atlama
                        </h2>
                        <p className="mt-2 text-sm text-slate-600">
                            Google ve kullanıcılar için tüm ana kategori merkezlerine tek ekrandan ulaşın.
                        </p>
                    </div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        {categoryEntries.length} aktif kategori
                    </p>
                </div>
                <div className="flex flex-wrap gap-3">
                    {categoryEntries.map(({ category, items }) => (
                        <Link
                            key={category.id}
                            href={`/kategori/${category.slug}`}
                            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                        >
                            <CategoryIcon icon={category.icon} size={16} />
                            {category.name.tr}
                            <span className="text-xs text-slate-500">{items.length}</span>
                        </Link>
                    ))}
                </div>
            </section>

            <div className="space-y-16">
                {categoryEntries.map(({ category, items }) => (
                    <section key={category.id} aria-labelledby={`${category.slug}-heading`}>
                        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                            <div className="flex items-start gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                    <CategoryIcon icon={category.icon} size={22} />
                                </div>
                                <div>
                                    <div className="flex flex-wrap items-center gap-3">
                                        <h2
                                            id={`${category.slug}-heading`}
                                            className="text-2xl font-bold text-slate-900"
                                        >
                                            {category.name.tr}
                                        </h2>
                                        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                            {items.length} araç
                                        </span>
                                    </div>
                                    <p className="mt-2 max-w-2xl text-sm text-slate-600">
                                        {category.description.tr}
                                    </p>
                                </div>
                            </div>
                            <Link
                                href={`/kategori/${category.slug}`}
                                className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700"
                            >
                                Kategori merkezi <ArrowRight size={14} />
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                            {items.map((calculator) => (
                                <Link
                                    key={calculator.id}
                                    href={`/${calculator.category}/${calculator.slug}`}
                                    className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition-colors group-hover:bg-blue-50 group-hover:text-blue-600">
                                            <Calculator size={18} />
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="text-base font-bold text-slate-900 transition-colors group-hover:text-blue-600">
                                                {calculator.name.tr}
                                            </h3>
                                            <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">
                                                {(calculator.shortDescription ?? calculator.description).tr}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                ))}
            </div>
        </div>
    );
}

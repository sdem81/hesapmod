import type {
    CalculatorCatalogEntry,
    CalculatorFaqEntry,
    LanguageCode,
} from "@/lib/calculator-types";
import { getCategoryName, getCategoryPath } from "@/lib/categories";
import { getCalculatorLastModified } from "@/lib/content-last-modified";
import { SITE_NAME, SITE_URL } from "@/lib/site";

type SchemaScriptsProps = {
    calculator: Pick<
        CalculatorCatalogEntry,
        "slug" | "category" | "name" | "h1" | "description" | "shortDescription" | "seo"
    >;
    lang?: LanguageCode;
};

type JsonLd = Record<string, unknown>;

const APPLICATION_CATEGORY_MAP: Record<string, string> = {
    "astroloji": "LifestyleApplication",
    "finansal-hesaplamalar": "FinanceApplication",
    "maas-ve-vergi": "FinanceApplication",
    "matematik-hesaplama": "EducationalApplication",
    "sinav-hesaplamalari": "EducationalApplication",
    "tasit-ve-vergi": "FinanceApplication",
    "ticaret-ve-is": "FinanceApplication",
    "yasam-hesaplama": "HealthApplication",
    "zaman-hesaplama": "UtilityApplication",
};

function getApplicationCategory(category: string) {
    return APPLICATION_CATEGORY_MAP[category] ?? "UtilityApplication";
}

function serializeJsonLd(schema: JsonLd) {
    return JSON.stringify(schema)
        .replace(/</g, "\\u003c")
        .replace(/>/g, "\\u003e")
        .replace(/&/g, "\\u0026")
        .replace(/\u2028/g, "\\u2028")
        .replace(/\u2029/g, "\\u2029");
}

function buildFaqSchema(faqEntries: CalculatorFaqEntry[], lang: LanguageCode): JsonLd | null {
    if (faqEntries.length === 0) {
        return null;
    }

    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqEntries.map((entry) => ({
            "@type": "Question",
            name: entry.q[lang],
            acceptedAnswer: {
                "@type": "Answer",
                text: entry.a[lang],
            },
        })),
    };
}

export default function SchemaScripts({
    calculator,
    lang = "tr",
}: SchemaScriptsProps) {
    const pageTitle = calculator.h1?.[lang] ?? calculator.name[lang];
    const description = calculator.seo.metaDescription[lang]
        || calculator.shortDescription?.[lang]
        || calculator.description[lang];
    const pageUrl = `${SITE_URL}/${calculator.category}/${calculator.slug}`;
    const categoryName = getCategoryName(calculator.category, lang);
    const categoryUrl = `${SITE_URL}${getCategoryPath(calculator.category)}`;
    const modifiedDate = getCalculatorLastModified(calculator.slug).toISOString();

    const schemaEntries: Array<{ id: string; data: JsonLd }> = [
        {
            id: "software-application",
            data: {
                "@context": "https://schema.org",
                "@type": "SoftwareApplication",
                name: pageTitle,
                applicationCategory: getApplicationCategory(calculator.category),
                operatingSystem: "All",
                description,
                url: pageUrl,
                inLanguage: lang === "tr" ? "tr-TR" : "en-US",
                isAccessibleForFree: true,
                dateModified: modifiedDate,
                applicationSubCategory: categoryName,
                offers: {
                    "@type": "Offer",
                    price: "0",
                    priceCurrency: "TRY",
                },
                provider: {
                    "@type": "Organization",
                    name: SITE_NAME,
                    url: SITE_URL,
                },
            },
        },
        {
            id: "breadcrumb-list",
            data: {
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                itemListElement: [
                    {
                        "@type": "ListItem",
                        position: 1,
                        name: lang === "tr" ? "Ana Sayfa" : "Home",
                        item: SITE_URL,
                    },
                    {
                        "@type": "ListItem",
                        position: 2,
                        name: categoryName,
                        item: categoryUrl,
                    },
                    {
                        "@type": "ListItem",
                        position: 3,
                        name: calculator.name[lang],
                        item: pageUrl,
                    },
                ],
            },
        },
    ];

    const faqSchema = buildFaqSchema(calculator.seo.faq, lang);
    if (faqSchema) {
        schemaEntries.splice(1, 0, {
            id: "faq-page",
            data: faqSchema,
        });
    }

    return (
        <>
            {schemaEntries.map((schemaEntry) => (
                <script
                    key={`${calculator.slug}-${schemaEntry.id}`}
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: serializeJsonLd(schemaEntry.data),
                    }}
                />
            ))}
        </>
    );
}

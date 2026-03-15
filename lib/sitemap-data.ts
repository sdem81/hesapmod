import { articles } from "./articles";
import { calculators } from "./calculator-source";
import { isHealthCategory, mainCategories, normalizeCategorySlug } from "./categories";
import {
    ABOUT_PAGE_LAST_MODIFIED,
    ALL_TOOLS_PAGE_LAST_MODIFIED,
    CALCULATOR_CONTENT_LAST_MODIFIED,
    CATEGORY_CONTENT_LAST_MODIFIED,
    CONTACT_PAGE_LAST_MODIFIED,
    COOKIE_POLICY_LAST_MODIFIED,
    FAQ_PAGE_LAST_MODIFIED,
    getLatestDate,
    GUIDES_PAGE_LAST_MODIFIED,
    HOME_PAGE_LAST_MODIFIED,
    getCalculatorLastModified,
    KVKK_PAGE_LAST_MODIFIED,
    PRIVACY_PAGE_LAST_MODIFIED,
    TERMS_PAGE_LAST_MODIFIED,
} from "./content-last-modified";
import { SITE_URL } from "./site";

export type SitemapEntry = {
    url: string;
    lastModified: Date;
    changeFrequency:
        | "always"
        | "hourly"
        | "daily"
        | "weekly"
        | "monthly"
        | "yearly"
        | "never";
    priority: number;
};

function toDateOrFallback(value: string | Date | undefined, fallback: Date) {
    if (!value) {
        return fallback;
    }

    const parsed = value instanceof Date ? value : new Date(value);
    return Number.isNaN(parsed.getTime()) ? fallback : parsed;
}

function getCalculatorEntryLastModified(calculator: { slug: string; updatedAt?: string | Date }) {
    return toDateOrFallback(calculator.updatedAt, getCalculatorLastModified(calculator.slug));
}

export function buildSitemapEntries(): SitemapEntry[] {
    const latestArticleModified = articles.reduce((latest, article) => {
        const current = new Date(article.updatedAt ?? article.publishedAt);
        return current.getTime() > latest.getTime() ? current : latest;
    }, new Date(0));
    const latestCalculatorModified =
        calculators.length > 0
            ? getLatestDate(...calculators.map((calc) => getCalculatorEntryLastModified(calc)))
            : CALCULATOR_CONTENT_LAST_MODIFIED;
    const homePageLastModified = getLatestDate(
        HOME_PAGE_LAST_MODIFIED,
        CATEGORY_CONTENT_LAST_MODIFIED,
        latestCalculatorModified,
        latestArticleModified
    );
    const allToolsPageLastModified = getLatestDate(
        ALL_TOOLS_PAGE_LAST_MODIFIED,
        latestCalculatorModified
    );
    const guidesLandingLastModified = getLatestDate(GUIDES_PAGE_LAST_MODIFIED, latestArticleModified);

    const staticPages: SitemapEntry[] = [
        {
            url: SITE_URL,
            lastModified: homePageLastModified,
            changeFrequency: "weekly",
            priority: 1.0,
        },
        {
            url: `${SITE_URL}/tum-araclar`,
            lastModified: allToolsPageLastModified,
            changeFrequency: "weekly",
            priority: 0.8,
        },
        {
            url: `${SITE_URL}/hakkimizda`,
            lastModified: ABOUT_PAGE_LAST_MODIFIED,
            changeFrequency: "monthly",
            priority: 0.7,
        },
        {
            url: `${SITE_URL}/iletisim`,
            lastModified: CONTACT_PAGE_LAST_MODIFIED,
            changeFrequency: "monthly",
            priority: 0.7,
        },
        {
            url: `${SITE_URL}/sss`,
            lastModified: FAQ_PAGE_LAST_MODIFIED,
            changeFrequency: "monthly",
            priority: 0.7,
        },
        {
            url: `${SITE_URL}/gizlilik-politikasi`,
            lastModified: PRIVACY_PAGE_LAST_MODIFIED,
            changeFrequency: "yearly",
            priority: 0.4,
        },
        {
            url: `${SITE_URL}/cerez-politikasi`,
            lastModified: COOKIE_POLICY_LAST_MODIFIED,
            changeFrequency: "yearly",
            priority: 0.3,
        },
        {
            url: `${SITE_URL}/kvkk`,
            lastModified: KVKK_PAGE_LAST_MODIFIED,
            changeFrequency: "yearly",
            priority: 0.3,
        },
        {
            url: `${SITE_URL}/kullanim-kosullari`,
            lastModified: TERMS_PAGE_LAST_MODIFIED,
            changeFrequency: "yearly",
            priority: 0.3,
        },
    ];

    const categoryPages: SitemapEntry[] = mainCategories.map((cat) => {
        const categoryCalculators = calculators.filter((calculator) => calculator.category === cat.slug);
        const lastModified =
            categoryCalculators.length > 0
                ? getLatestDate(
                    CATEGORY_CONTENT_LAST_MODIFIED,
                    ...categoryCalculators.map((calculator) => getCalculatorLastModified(calculator.slug))
                )
                : CATEGORY_CONTENT_LAST_MODIFIED;

        return {
            url: `${SITE_URL}/kategori/${cat.slug}`,
            lastModified,
            changeFrequency: "weekly",
            priority: 0.8,
        };
    });

    const calcPages: SitemapEntry[] = calculators.map((calc) => {
        const canonicalCategory = normalizeCategorySlug(calc.category);
        return {
            url: `${SITE_URL}/${canonicalCategory}/${calc.slug}`,
            lastModified: getCalculatorEntryLastModified(calc),
            changeFrequency: "weekly",
            priority: 0.8,
        };
    });

    const rehberPage: SitemapEntry[] = [
        {
            url: `${SITE_URL}/rehber`,
            lastModified: guidesLandingLastModified,
            changeFrequency: "weekly",
            priority: 0.5,
        },
    ];

    const articlePages: SitemapEntry[] = articles.map((article) => ({
        url: `${SITE_URL}/rehber/${article.slug}`,
        lastModified: new Date(article.updatedAt ?? article.publishedAt),
        changeFrequency: "weekly",
        priority: 0.5,
    }));

    return [
        ...staticPages,
        ...categoryPages,
        ...rehberPage,
        ...articlePages,
        ...calcPages,
    ];
}

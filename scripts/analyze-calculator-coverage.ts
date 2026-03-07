import fs from "node:fs";
import path from "node:path";

import { calculators, normalizeCalculatorSlug } from "../lib/calculator-source";
import { mainCategories } from "../lib/categories";

type CoverageTarget = {
    categoryLabel: string;
    name: string;
    equivalentSlugs?: string[];
    note?: string;
};

type CoverageRow = {
    categoryLabel: string;
    requestedName: string;
    requestedSlug: string;
    status: "covered" | "missing";
    matchedUrl: string | null;
    matchedName: string | null;
    note: string | null;
};

const coverageTargets: CoverageTarget[] = [
    { categoryLabel: "KREDI", name: "Ihtiyac Kredisi Hesaplama" },
    {
        categoryLabel: "KREDI",
        name: "Is Yeri Kredisi Hesaplama",
        equivalentSlugs: ["is-yeri-ve-ticari-kredi-hesaplama"],
        note: "Projede is yeri ifadesi, is yeri ve ticari kredi olarak kapsaniyor.",
    },
    { categoryLabel: "KREDI", name: "Konut Kredisi Hesaplama" },
    {
        categoryLabel: "KREDI",
        name: "Kredi Hesaplama",
        note: "Genel kredi sorgusu mevcut yapida kredi taksit sayfasina normalize ediliyor.",
    },
    { categoryLabel: "KREDI", name: "Kredi Dosya Masrafi Hesaplama" },
    { categoryLabel: "KREDI", name: "Kredi Erken Kapatma Cezasi Hesaplama" },
    { categoryLabel: "KREDI", name: "Kredi Gecikme Faizi Hesaplama" },
    { categoryLabel: "KREDI", name: "Kredi Karti Asgari Odeme Tutari Hesaplama" },
    { categoryLabel: "KREDI", name: "Kredi Karti Ek Taksit Hesaplama" },
    { categoryLabel: "KREDI", name: "Kredi Karti Gecikme Faizi Hesaplama" },
    { categoryLabel: "KREDI", name: "Kredi Karti Islem Taksitlendirme Hesaplama" },
    { categoryLabel: "KREDI", name: "Kredi Karti Taksitli Nakit Avans Hesaplama" },
    { categoryLabel: "KREDI", name: "Kredi Yapilandirma Hesaplama" },
    { categoryLabel: "KREDI", name: "Kredi Yillik Maliyet Orani Hesaplama" },
    { categoryLabel: "KREDI", name: "Ne Kadar Kredi Alabilirim Hesaplama" },
    { categoryLabel: "KREDI", name: "Tasit Kredisi Hesaplama" },
    { categoryLabel: "KREDI", name: "Ticari Arac Kredisi Hesaplama" },
    { categoryLabel: "KREDI", name: "Ticari Ihtiyac Kredisi Hesaplama" },
    { categoryLabel: "KREDI", name: "Ticari Kredi Hesaplama" },
    { categoryLabel: "FINANS", name: "Altin Hesaplama" },
    { categoryLabel: "FINANS", name: "Bilesik Buyume Hesaplama" },
    { categoryLabel: "FINANS", name: "Birikim Hesaplama" },
    { categoryLabel: "FINANS", name: "Bono Hesaplama" },
    { categoryLabel: "FINANS", name: "Doviz Hesaplama" },
    { categoryLabel: "FINANS", name: "Enflasyon Hesaplama" },
    { categoryLabel: "FINANS", name: "Eurobond Hesaplama" },
    {
        categoryLabel: "FINANS",
        name: "Faiz Hesaplama",
        note: "Genel faiz sorgusu mevcut yapida basit faiz sayfasina normalize ediliyor.",
    },
    {
        categoryLabel: "FINANS",
        name: "Gecmis Altin Fiyatlari Hesaplama",
        equivalentSlugs: ["gecmis-altin-fiyatlari"],
        note: "Projede hesaplama eki olmadan gecmis altin fiyatlari slug'i kullaniliyor.",
    },
    {
        categoryLabel: "FINANS",
        name: "Gecmis Doviz Kurlari Hesaplama",
        equivalentSlugs: ["gecmis-doviz-kurlari"],
        note: "Projede hesaplama eki olmadan gecmis doviz kurlari slug'i kullaniliyor.",
    },
    { categoryLabel: "FINANS", name: "IBAN Dogrulama" },
    { categoryLabel: "FINANS", name: "Ic ve Dis Iskonto Hesaplama" },
    { categoryLabel: "FINANS", name: "Ic Verim Orani Hesaplama" },
    {
        categoryLabel: "FINANS",
        name: "Kira Artis Orani Hesaplama",
        equivalentSlugs: ["kira-artis-hesaplama"],
        note: "Projede oran ve tutar etkisini birlikte gosteren kira artis slug'i var.",
    },
    { categoryLabel: "FINANS", name: "Net Bugunku Deger Hesaplama" },
    { categoryLabel: "FINANS", name: "Ortalama Vade Hesaplama" },
    { categoryLabel: "FINANS", name: "Parasal Deger Hesaplama" },
    { categoryLabel: "FINANS", name: "Reel Getiri Hesaplama" },
    { categoryLabel: "FINANS", name: "Repo Hesaplama" },
    { categoryLabel: "FINANS", name: "Sermaye ve Temettu Hesaplama" },
    { categoryLabel: "FINANS", name: "Tahvil Hesaplama" },
    { categoryLabel: "FINANS", name: "Vadeli Islem Fiyati Hesaplama" },
    {
        categoryLabel: "FINANS",
        name: "Vadeli Mevduat Faizi Hesaplama",
        equivalentSlugs: ["mevduat-faiz-hesaplama"],
        note: "Projede vadeli mevduat icin mevduat faiz slug'i kullaniliyor.",
    },
];

function slugify(value: string) {
    return value
        .toLocaleLowerCase("en-US")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

function buildCoverageRows() {
    const calculatorBySlug = new Map(
        calculators.map((calculator) => [calculator.slug, calculator])
    );

    return coverageTargets.map((target) => {
        const requestedSlug = slugify(target.name);
        const slugCandidates = [
            requestedSlug,
            normalizeCalculatorSlug(requestedSlug),
            ...(target.equivalentSlugs ?? []),
        ];

        const matchedCalculator = slugCandidates
            .map((slug) => calculatorBySlug.get(slug))
            .find(Boolean);

        return {
            categoryLabel: target.categoryLabel,
            requestedName: target.name,
            requestedSlug,
            status: matchedCalculator ? "covered" : "missing",
            matchedUrl: matchedCalculator
                ? `/${matchedCalculator.category}/${matchedCalculator.slug}`
                : null,
            matchedName: matchedCalculator?.name.tr ?? null,
            note: target.note ?? null,
        } satisfies CoverageRow;
    });
}

function buildReport(rows: CoverageRow[]) {
    const categoryMap = new Map(
        mainCategories.map((category) => [category.slug, category.name.tr])
    );
    const groupedCalculators = calculators
        .slice()
        .sort((left, right) => {
            if (left.category !== right.category) {
                return left.category.localeCompare(right.category, "tr");
            }

            return left.name.tr.localeCompare(right.name.tr, "tr");
        })
        .reduce<Record<string, typeof calculators>>((acc, calculator) => {
            (acc[calculator.category] ??= []).push(calculator);
            return acc;
        }, {});

    const missingRows = rows.filter((row) => row.status === "missing");
    const coveredRows = rows.filter((row) => row.status === "covered");

    const lines: string[] = [
        "# Calculator Coverage Report",
        "",
        "## Route Structure",
        "",
        "- Canonical calculator route: `/{category}/{slug}`",
        "- Category hub route: `/kategori/{slug}`",
        "- Added compatibility route: `/hesaplama/{slug}`",
        "",
        "## Current Calculators",
        "",
    ];

    for (const [category, categoryCalculators] of Object.entries(groupedCalculators)) {
        lines.push(`### ${categoryMap.get(category) ?? category} (${categoryCalculators.length})`);
        lines.push("");
        for (const calculator of categoryCalculators) {
            lines.push(`- [${calculator.name.tr}](/${calculator.category}/${calculator.slug})`);
        }
        lines.push("");
    }

    lines.push("## Requested Coverage");
    lines.push("");
    lines.push(`- Covered: ${coveredRows.length}`);
    lines.push(`- Missing: ${missingRows.length}`);
    lines.push("");
    lines.push("| Category | Requested Tool | Status | Existing URL | Notes |");
    lines.push("| --- | --- | --- | --- | --- |");

    for (const row of rows) {
        lines.push(
            `| ${row.categoryLabel} | ${row.requestedName} | ${row.status} | ${row.matchedUrl ?? "-"} | ${row.note ?? "-"} |`
        );
    }

    lines.push("");
    lines.push("## Missing Tools");
    lines.push("");

    if (missingRows.length === 0) {
        lines.push("- None within the provided KREDI and FINANS lists.");
    } else {
        for (const row of missingRows) {
            lines.push(`- ${row.requestedName} -> /hesaplama/${row.requestedSlug}`);
        }
    }

    lines.push("");

    return lines.join("\n");
}

const rows = buildCoverageRows();
const report = buildReport(rows);
const reportsDirectory = path.resolve("reports");
const reportPath = path.join(reportsDirectory, "calculator-coverage-credit-finance.md");

fs.mkdirSync(reportsDirectory, { recursive: true });
fs.writeFileSync(reportPath, report, "utf8");

console.log(`Coverage report written to ${reportPath}`);
console.log(`Covered: ${rows.filter((row) => row.status === "covered").length}`);
console.log(`Missing: ${rows.filter((row) => row.status === "missing").length}`);

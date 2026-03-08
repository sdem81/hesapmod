import fs from "node:fs";
import path from "node:path";

import ts from "typescript";

import { normalizeCategorySlug } from "../lib/categories";

type SourceCalculatorEntry = {
    slug: string;
    category: string;
    formulaText: string;
};

const sourcePath = path.resolve("lib/calculator-source.ts");
const runtimeDirectory = path.resolve("lib/calculator-runtime");

const specialCalculatorSlugs = new Set([
    "yks-puan-hesaplama",
    "kira-mi-konut-kredisi-mi-hesaplama",
    "kredi-karsilastirma-hesaplama",
    "borc-kapatma-planlayici-hesaplama",
    "sermaye-ve-temettu-hesaplama",
]);

const calculatorSlugAliases: Record<string, string> = {
    "cc-minimum-payment": "kredi-karti-asgari-odeme",
    "kredi-karti-asgari-odeme-hesaplama": "kredi-karti-asgari-odeme",
    "kredi-hesaplama": "kredi-taksit-hesaplama",
    "is-yeri-kredisi-hesaplama": "is-yeri-ve-ticari-kredi-hesaplama",
    "kira-artis-orani-hesaplama": "kira-artis-hesaplama",
    "yillik-maliyet-orani-hesaplama": "kredi-yillik-maliyet-orani-hesaplama",
    "loan-allocation-fee": "kredi-dosya-masrafi-hesaplama",
    "kus-ak-hesaplama": "kusak-hesaplama",
    "kombinasyon-permitasyon-hesaplama": "kombinasyon-permutasyon-faktoriyel",
    "takdir-tessekur-hesaplama": "takdir-tesekkur-hesaplama",
    "faiz-hesaplama": "basit-faiz-hesaplama",
    "gecmis-altin-fiyatlari-hesaplama": "gecmis-altin-fiyatlari",
    "gecmis-doviz-kurlari-hesaplama": "gecmis-doviz-kurlari",
    "ic-ve-dis-iskonto-hesaplama": "iskonto-hesaplama",
    "parasal-deger-hesaplama": "parasal-deger-zaman-hesaplama",
    "vadeli-islem-fiyati-hesaplama": "vadeli-islem-fiyat-hesaplama",
    "vadeli-mevduat-faizi-hesaplama": "mevduat-faiz-hesaplama",
    "yaş-hesaplama": "yas-hesaplama-gun-ay-yil",
};

const categoryFiles: Record<string, string> = {
    "finansal-hesaplamalar": "finance.ts",
    "maas-ve-vergi": "salary-tax.ts",
    "yasam-hesaplama": "life.ts",
    "matematik-hesaplama": "math.ts",
    "zaman-hesaplama": "time.ts",
    "sinav-hesaplamalari": "exams.ts",
    "ticaret-ve-is": "trade.ts",
    "astroloji": "astrology.ts",
    "tasit-ve-vergi": "vehicle.ts",
};

const helperImports = [
    {
        name: "getInflationIndex",
        statement:
            'import { getInflationIndex, getTurkishInflationIndex } from "@/lib/data/inflationData";',
    },
    {
        name: "getTurkishInflationIndex",
        statement:
            'import { getInflationIndex, getTurkishInflationIndex } from "@/lib/data/inflationData";',
    },
    {
        name: "calculateDividendPortfolio",
        statement:
            'import { calculateDividendPortfolio } from "@/lib/dividendPortfolio";',
    },
    {
        name: "calculateDebtPayoff",
        statement: 'import { calculateDebtPayoff } from "@/lib/debtPayoff";',
    },
    {
        name: "calculateLoanComparison",
        statement:
            'import { calculateLoanComparison } from "@/lib/loanComparison";',
    },
    {
        name: "calculateRentVsBuy",
        statement: 'import { calculateRentVsBuy } from "@/lib/rentVsBuy";',
    },
    {
        name: "calculateYksScores",
        statement: 'import { calculateYksScores } from "@/lib/yks";',
    },
    {
        name: "calculateVatBreakdown",
        statement:
            'import { calculateBmi, calculateLoanPayment, calculateVatBreakdown, normalizeLoanType } from "@/mobile/src/sharedCalculations";',
    },
    {
        name: "calculateLoanPayment",
        statement:
            'import { calculateBmi, calculateLoanPayment, calculateVatBreakdown, normalizeLoanType } from "@/mobile/src/sharedCalculations";',
    },
    {
        name: "calculateBmi",
        statement:
            'import { calculateBmi, calculateLoanPayment, calculateVatBreakdown, normalizeLoanType } from "@/mobile/src/sharedCalculations";',
    },
    {
        name: "normalizeLoanType",
        statement:
            'import { calculateBmi, calculateLoanPayment, calculateVatBreakdown, normalizeLoanType } from "@/mobile/src/sharedCalculations";',
    },
];

const arrayOrder = [
    "investmentCalculatorsP5",
    "investmentCalculatorsP4",
    "investmentCalculatorsP3",
    "investmentCalculatorsP2",
    "investmentCalculatorsP1",
    "creditCalculatorsP3",
    "creditCalculatorsP1",
    "creditCalculatorsP2",
    "financeCalculators",
    "healthCalculators",
    "mathCalculators",
    "mathCalculatorsBatch2",
    "dailyCalculators",
    "phase1Calculators",
    "phase2Calculators",
    "phase3Calculators",
    "phase4Calculators",
    "timeCalculators",
    "schoolCalculators",
    "schoolCalculatorsBatch2",
    "schoolCalculatorsBatch3",
    "schoolCalculatorsBatch4",
    "educationCalculatorsBatch1",
    "astrologyCalculators",
    "taxCalculatorsBatch1",
    "taxCalculatorsBatch2",
    "tradeCalculatorsBatch1",
    "timeCalculatorsBatch1a",
    "timeCalculatorsBatch1b",
    "timeCalculatorsBatch1c",
    "timeCalculatorsBatch1d",
    "timeCalculatorsBatch2a",
    "timeCalculatorsBatch2b",
    "timeCalculatorsBatch2c",
];

function normalizeCalculatorSlug(slug: string) {
    return calculatorSlugAliases[slug] ?? slug;
}

function getStringProperty(
    objectLiteral: ts.ObjectLiteralExpression,
    propertyName: string
) {
    for (const property of objectLiteral.properties) {
        if (
            ts.isPropertyAssignment(property)
            && ts.isIdentifier(property.name)
            && property.name.text === propertyName
            && ts.isStringLiteralLike(property.initializer)
        ) {
            return property.initializer.text;
        }
    }

    return undefined;
}

function getFormulaText(
    objectLiteral: ts.ObjectLiteralExpression,
    sourceFile: ts.SourceFile
) {
    for (const property of objectLiteral.properties) {
        if (
            ts.isPropertyAssignment(property)
            && ts.isIdentifier(property.name)
            && property.name.text === "formula"
        ) {
            return property.initializer.getText(sourceFile);
        }
    }

    return undefined;
}

function collectArrayEntries() {
    const sourceText = fs.readFileSync(sourcePath, "utf8");
    const sourceFile = ts.createSourceFile(
        sourcePath,
        sourceText,
        ts.ScriptTarget.Latest,
        true,
        ts.ScriptKind.TS
    );
    const arrayEntries = new Map<string, SourceCalculatorEntry[]>();

    for (const statement of sourceFile.statements) {
        if (!ts.isVariableStatement(statement)) {
            continue;
        }

        for (const declaration of statement.declarationList.declarations) {
            if (
                !ts.isIdentifier(declaration.name)
                || !declaration.initializer
                || !ts.isArrayLiteralExpression(declaration.initializer)
            ) {
                continue;
            }

            const entries: SourceCalculatorEntry[] = [];
            for (const element of declaration.initializer.elements) {
                if (!ts.isObjectLiteralExpression(element)) {
                    continue;
                }

                const slug = getStringProperty(element, "slug");
                const category = getStringProperty(element, "category");
                const formulaText = getFormulaText(element, sourceFile);

                if (!slug || !category || !formulaText) {
                    continue;
                }

                entries.push({ slug, category, formulaText });
            }

            if (entries.length > 0) {
                arrayEntries.set(declaration.name.text, entries);
            }
        }
    }

    return arrayEntries;
}

type RuntimeModuleState = {
    calculators: Map<string, string>;
    imports: Set<string>;
};

const arrayEntries = collectArrayEntries();
const runtimeStates = new Map<string, RuntimeModuleState>();

for (const arrayName of arrayOrder) {
    const calculators = arrayEntries.get(arrayName) ?? [];

    for (const calculator of calculators) {
        const normalizedSlug = normalizeCalculatorSlug(calculator.slug);
        const normalizedCategory = normalizeCategorySlug(calculator.category);
        const targetFile = categoryFiles[normalizedCategory];

        if (!targetFile || specialCalculatorSlugs.has(normalizedSlug)) {
            continue;
        }

        let state = runtimeStates.get(targetFile);
        if (!state) {
            state = {
                calculators: new Map<string, string>(),
                imports: new Set<string>(),
            };
            runtimeStates.set(targetFile, state);
        }

        for (const helperImport of helperImports) {
            if (calculator.formulaText.includes(helperImport.name)) {
                state.imports.add(helperImport.statement);
            }
        }

        if (state.calculators.has(normalizedSlug)) {
            state.calculators.delete(normalizedSlug);
        }

        state.calculators.set(normalizedSlug, calculator.formulaText);
    }
}

for (const [fileName, state] of Array.from(runtimeStates.entries())) {
    const filePath = path.join(runtimeDirectory, fileName);
    const fileImports = [
        'import type { CalculatorRuntimeMap } from "@/lib/calculator-types";',
        ...Array.from(state.imports),
    ];
    const formulaEntries = Array.from(state.calculators.entries()).map(
        ([slug, formulaText]) => `    ${JSON.stringify(slug)}: ${formulaText},`
    );

    const fileContent = [
        ...fileImports,
        "",
        "export const formulas: CalculatorRuntimeMap = {",
        ...formulaEntries,
        "};",
        "",
    ].join("\n");

    fs.writeFileSync(filePath, fileContent, "utf8");
}

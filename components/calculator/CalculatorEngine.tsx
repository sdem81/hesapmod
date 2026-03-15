"use client";

import React, { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { loadCalculatorFormula } from "@/lib/calculator-runtime";
import type {
    CalculatorClientEntry,
    CalculatorFormula,
} from "@/lib/calculator-types";
import CalculatorForm from "./CalculatorForm";
import ResultBox from "./ResultBox";
import StickyResultBar from "./StickyResultBar";
import type { LanguageCode } from "@/lib/calculator-types";

const DebtPayoffPlannerCalculator = dynamic(
    () => import("./custom/DebtPayoffPlannerCalculator")
);
const LoanComparisonCalculator = dynamic(
    () => import("./custom/LoanComparisonCalculator")
);
const RentVsBuyCalculator = dynamic(
    () => import("./custom/RentVsBuyCalculator")
);
const DividendPortfolioCalculator = dynamic(
    () => import("./custom/DividendPortfolioCalculator")
);
const YksCalculator = dynamic(() => import("./custom/YksCalculator"));
const AltinHesaplamaCalculator = dynamic(() => import("./custom/AltinHesaplamaCalculator"));
const DovizHesaplamaCalculator = dynamic(() => import("./custom/DovizHesaplamaCalculator"));
const GecmisAltinFiyatlariCalculator = dynamic(() => import("./custom/GecmisAltinFiyatlariCalculator"));

interface Props {
    calculator: CalculatorClientEntry;
    lang: LanguageCode;
}

type SpecialCalculatorSlug =
    | "yks-puan-hesaplama"
    | "kira-mi-konut-kredisi-mi-hesaplama"
    | "kredi-karsilastirma-hesaplama"
    | "borc-kapatma-planlayici-hesaplama"
    | "sermaye-ve-temettu-hesaplama"
    | "altin-hesaplama"
    | "doviz-hesaplama"
    | "gecmis-altin-fiyatlari";

const specialCalculatorComponents = {
    "yks-puan-hesaplama": YksCalculator,
    "kira-mi-konut-kredisi-mi-hesaplama": RentVsBuyCalculator,
    "kredi-karsilastirma-hesaplama": LoanComparisonCalculator,
    "borc-kapatma-planlayici-hesaplama": DebtPayoffPlannerCalculator,
    "sermaye-ve-temettu-hesaplama": DividendPortfolioCalculator,
    "altin-hesaplama": AltinHesaplamaCalculator,
    "doviz-hesaplama": DovizHesaplamaCalculator,
    "gecmis-altin-fiyatlari": GecmisAltinFiyatlariCalculator,
} satisfies Record<SpecialCalculatorSlug, React.ComponentType<{ lang: LanguageCode }>>;

function isSpecialCalculatorSlug(slug: string): slug is SpecialCalculatorSlug {
    return slug in specialCalculatorComponents;
}

function buildInitialValues(calculator: CalculatorClientEntry) {
    const initial: Record<string, any> = {};
    calculator.inputs.forEach((input) => {
        initial[input.id] = input.defaultValue ?? "";
    });
    return initial;
}

function sanitizeCalculationResult(raw: Record<string, any>) {
    const sanitized: Record<string, any> = {};
    for (const [key, value] of Object.entries(raw)) {
        sanitized[key] = typeof value === "number" && Number.isNaN(value) ? 0 : value;
    }
    return sanitized;
}

export default function CalculatorEngine({ calculator, lang }: Props) {
    const [values, setValues] = useState<Record<string, any>>(() =>
        buildInitialValues(calculator)
    );
    const [formula, setFormula] = useState<CalculatorFormula | null>(null);
    const [isRuntimeLoading, setIsRuntimeLoading] = useState(
        !isSpecialCalculatorSlug(calculator.slug)
    );
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        setValues(buildInitialValues(calculator));
        setErrorMessage(null);
    }, [calculator]);

    useEffect(() => {
        if (isSpecialCalculatorSlug(calculator.slug)) {
            setFormula(null);
            setIsRuntimeLoading(false);
            setErrorMessage(null);
            return;
        }

        let isCancelled = false;
        setIsRuntimeLoading(true);
        setErrorMessage(null);

        void loadCalculatorFormula(calculator.category, calculator.slug)
            .then((loadedFormula) => {
                if (isCancelled) {
                    return;
                }
                setFormula(() => loadedFormula);
            })
            .catch((error) => {
                console.error("Calculator runtime load failed:", error);
                if (!isCancelled) {
                    setFormula(null);
                    setErrorMessage(
                        lang === "tr"
                            ? "Hesaplama motoru yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin veya daha sonra tekrar deneyin."
                            : "An error occurred while loading the calculator engine. Please refresh the page or try again later."
                    );
                }
            })
            .finally(() => {
                if (!isCancelled) {
                    setIsRuntimeLoading(false);
                }
            });

        return () => {
            isCancelled = true;
        };
    }, [calculator.category, calculator.slug, lang]);

    const results = useMemo(() => {
        if (!formula) return {};
        try {
            setErrorMessage(null);
            return sanitizeCalculationResult(formula(values));
        } catch (error) {
            console.error("Calculation Error:", error);
            setErrorMessage(
                lang === "tr"
                    ? "Hesaplama sırasında bir hata oluştu. Lütfen girdi değerlerinizi kontrol edin."
                    : "An error occurred during calculation. Please check your input values."
            );
            return {};
        }
    }, [formula, values, lang]);

    const handleInputChange = (id: string, value: any) => {
        setValues((prev) => ({ ...prev, [id]: value }));
        setErrorMessage(null);
    };

    // Extract primary result for mobile sticky bar
    const primaryConfig = calculator.results.find(
        (r) => results[r.id] !== undefined && results[r.id] !== null && typeof results[r.id] === "number"
    );
    const primaryLabel = primaryConfig?.label[lang] ?? calculator.results[0]?.label[lang] ?? "Sonuç";
    const primaryValue = primaryConfig
        ? `${primaryConfig.prefix ?? ""}${(results[primaryConfig.id] as number).toLocaleString(
              lang === "tr" ? "tr-TR" : "en-US",
              {
                  minimumFractionDigits: primaryConfig.decimalPlaces ?? 0,
                  maximumFractionDigits: primaryConfig.decimalPlaces ?? 2,
              }
          )} ${primaryConfig.suffix ?? ""}`.trim()
        : "—";
    const hasResults = Object.keys(results).length > 0;

    if (isSpecialCalculatorSlug(calculator.slug)) {
        const SpecialCalculator = specialCalculatorComponents[calculator.slug];
        return <SpecialCalculator lang={lang} />;
    }

    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <div className="bg-white p-6 shadow-sm border border-slate-200 rounded-xl animate-fade-in-up hover:border-blue-200 transition-colors">
                    <h2 className="text-xl font-bold mb-6 border-b border-slate-100 pb-4 text-slate-900">
                        {calculator.name[lang]}
                    </h2>
                    {errorMessage && (
                        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                            {errorMessage}
                        </div>
                    )}
                    <CalculatorForm
                        inputs={calculator.inputs}
                        values={values}
                        onChange={handleInputChange}
                        lang={lang}
                    />
                </div>
                <div className="lg:sticky lg:top-24">
                    {isRuntimeLoading ? (
                        <div className="bg-slate-100 border border-slate-200 shadow-sm rounded-xl p-8 space-y-6 animate-pulse">
                            <div className="h-5 w-28 rounded bg-slate-200" />
                            <div className="space-y-4">
                                <div className="h-16 rounded-2xl bg-white border border-slate-200" />
                                <div className="h-16 rounded-2xl bg-white border border-slate-200" />
                                <div className="h-16 rounded-2xl bg-white border border-slate-200" />
                            </div>
                        </div>
                    ) : (
                        <ResultBox
                            results={results}
                            config={calculator.results}
                            lang={lang}
                        />
                    )}
                </div>
            </div>

            {/* Mobile sticky result bar */}
            {!isRuntimeLoading && (
                <StickyResultBar
                    primaryLabel={primaryLabel}
                    primaryValue={primaryValue}
                    hasResults={hasResults}
                >
                    <ResultBox
                        results={results}
                        config={calculator.results}
                        lang={lang}
                    />
                </StickyResultBar>
            )}
        </>
    );
}

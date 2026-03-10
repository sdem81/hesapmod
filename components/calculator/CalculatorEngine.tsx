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

    useEffect(() => {
        setValues(buildInitialValues(calculator));
    }, [calculator]);

    useEffect(() => {
        if (isSpecialCalculatorSlug(calculator.slug)) {
            setFormula(null);
            setIsRuntimeLoading(false);
            return;
        }

        let isCancelled = false;
        setIsRuntimeLoading(true);

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
    }, [calculator.category, calculator.slug]);

    const results = useMemo(() => {
        if (!formula) return {};
        try {
            return sanitizeCalculationResult(formula(values));
        } catch (error) {
            console.error("Calculation Error:", error);
            return {};
        }
    }, [formula, values]);

    const handleInputChange = (id: string, value: any) => {
        setValues((prev) => ({ ...prev, [id]: value }));
    };

    if (isSpecialCalculatorSlug(calculator.slug)) {
        const SpecialCalculator = specialCalculatorComponents[calculator.slug];
        return <SpecialCalculator lang={lang} />;
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div className="bg-white p-6 shadow-sm border border-slate-200 rounded-xl animate-fade-in-up hover:border-blue-200 transition-colors">
                <h2 className="text-xl font-bold mb-6 border-b border-slate-100 pb-4 text-slate-900">
                    {calculator.name[lang]}
                </h2>
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
    );
}

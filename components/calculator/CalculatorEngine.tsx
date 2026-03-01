"use client";

import React, { useState, useMemo } from "react";
import { calculators } from "@/lib/calculators";
import CalculatorForm from "./CalculatorForm";
import ResultBox from "./ResultBox";

interface Props {
    slug: string;
    lang: "tr" | "en";
}

export default function CalculatorEngine({ slug, lang }: Props) {
    const config = useMemo(
        () => calculators.find((c) => c.slug === slug),
        [slug]
    );

    const [values, setValues] = useState<Record<string, any>>(() => {
        const initial: Record<string, any> = {};
        config?.inputs.forEach((input) => {
            initial[input.id] = input.defaultValue ?? "";
        });
        return initial;
    });

    const results = useMemo(() => {
        if (!config) return {};
        try {
            const raw = config.formula(values);
            const sanitized: Record<string, any> = {};
            for (const key in raw) {
                if (typeof raw[key] === "number" && isNaN(raw[key])) {
                    sanitized[key] = 0;
                } else {
                    sanitized[key] = raw[key];
                }
            }
            return sanitized;
        } catch (error) {
            console.error("Calculation Error:", error);
            return {};
        }
    }, [values, config]);

    const handleInputChange = (id: string, value: any) => {
        setValues((prev) => ({ ...prev, [id]: value }));
    };

    if (!config) return null;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div className="bg-card p-6 rounded-3xl shadow-lg shadow-black/5 border border-primary/10 animate-fade-in-up hover:border-primary/30 transition-colors">
                <h2 className="text-xl font-bold mb-6 border-b pb-4">
                    {config.name[lang]}
                </h2>
                <CalculatorForm
                    inputs={config.inputs}
                    values={values}
                    onChange={handleInputChange}
                    lang={lang}
                />
            </div>
            <div className="lg:sticky lg:top-24">
                <ResultBox
                    results={results}
                    config={config.results}
                    lang={lang}
                />
            </div>
        </div>
    );
}

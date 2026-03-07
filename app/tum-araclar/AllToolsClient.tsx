"use client";

import { CategoryIcon } from "@/components/category/CategoryIcon";
import { useDeferredValue, useState } from "react";
import { mainCategories } from "@/lib/categories";
import { Search, Calculator, ArrowRight } from "lucide-react";
import type { CalculatorSearchEntry } from "@/lib/calculator-types";
import Link from "next/link";

interface Props {
    entries: CalculatorSearchEntry[];
}

export default function AllToolsClient({ entries }: Props) {
    const [query, setQuery] = useState("");
    const deferredQuery = useDeferredValue(query);
    const categoryEntries = mainCategories
        .map((category) => ({
            category,
            items: entries.filter((entry) => entry.category === category.slug),
        }))
        .filter(({ items }) => items.length > 0);

    const filtered = deferredQuery.trim()
        ? entries.filter(
            (c) =>
                c.name.tr.toLowerCase().includes(deferredQuery.toLowerCase()) ||
                c.shortDescription.tr.toLowerCase().includes(deferredQuery.toLowerCase())
        )
        : null;

    return (
        <>
            {/* Search */}
            <div className="relative max-w-xl mx-auto mb-12">
                <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                    size={20}
                />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Araç ara... (KDV, faiz, VKİ...)"
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border bg-background text-base focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                />
            </div>

            {/* Search Results */}
            {filtered !== null ? (
                <div>
                    <p className="text-muted-foreground mb-6">
                        &ldquo;{query}&rdquo; için {filtered.length} sonuç
                        bulundu.
                    </p>
                    {filtered.length === 0 ? (
                        <div className="text-center py-16 text-muted-foreground">
                            <Calculator
                                size={48}
                                className="mx-auto mb-4 opacity-30"
                            />
                            <p>Sonuç bulunamadı. Farklı bir arama deneyin.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {filtered.map((calc) => (
                                <CalculatorCard key={calc.id} calc={calc} />
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                /* Category Sections */
                <div className="space-y-16">
                    {categoryEntries.map(({ category, items }) => {
                        return (
                            <section key={category.id}>
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                            <CategoryIcon icon={category.icon} size={22} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3">
                                                <h2 className="text-2xl font-bold">
                                                    {category.name.tr}
                                                </h2>
                                                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                                    {items.length} araç
                                                </span>
                                            </div>
                                            <p className="text-muted-foreground text-sm mt-1">
                                                {category.description.tr}
                                            </p>
                                        </div>
                                    </div>
                                    <Link
                                        href={`/kategori/${category.slug}`}
                                        className="flex items-center gap-1 text-sm text-primary font-semibold hover:gap-2 transition-all whitespace-nowrap"
                                    >
                                        Tümü <ArrowRight size={14} />
                                    </Link>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                    {items.map((calc) => (
                                        <CalculatorCard
                                            key={calc.id}
                                            calc={calc}
                                        />
                                    ))}
                                </div>
                            </section>
                        );
                    })}
                </div>
            )}
        </>
    );
}

function CalculatorCard({ calc }: { calc: CalculatorSearchEntry }) {
    return (
        <Link
            href={`/${calc.category}/${calc.slug}`}
            className="group p-5 rounded-2xl bg-card border hover:border-primary/50 hover-glow hover-lift transition-all animate-fade-in-up"
        >
            <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <Calculator className="text-primary" size={16} />
                </div>
                <div className="min-w-0">
                    <h3 className="font-bold text-base mb-1 group-hover:text-primary transition-colors truncate">
                        {calc.name.tr}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {calc.shortDescription.tr}
                    </p>
                </div>
            </div>
        </Link>
    );
}

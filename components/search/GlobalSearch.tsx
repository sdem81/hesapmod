"use client";

import React, { useDeferredValue, useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import Link from "next/link";
import type { CalculatorSearchEntry } from "@/lib/calculator-types";
import { getCategoryName } from "@/lib/categories";

interface Props {
    entries: CalculatorSearchEntry[];
}

export default function GlobalSearch({ entries }: Props) {
    const [query, setQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const resultsRef = useRef<HTMLDivElement>(null);
    const deferredQuery = useDeferredValue(query);

    const filtered = deferredQuery.length > 1
        ? entries.filter((c) =>
            c.name.tr.toLowerCase().includes(deferredQuery.toLowerCase()) ||
            c.category.toLowerCase().includes(deferredQuery.toLowerCase()) ||
            c.shortDescription.tr.toLowerCase().includes(deferredQuery.toLowerCase())
        )
        : [];

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (resultsRef.current && !resultsRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                inputRef.current?.focus();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    return (
        <div className="relative w-full max-w-2xl mx-auto" ref={resultsRef}>
            <div className="relative group flex items-center">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} aria-hidden="true" />
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => {
                        setIsOpen(true);
                    }}
                    placeholder="Hangi aracı arıyorsunuz? (KDV, Yaş...)"
                    className="w-full h-16 pl-14 pr-24 rounded-2xl border border-slate-300 bg-white shadow-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all text-[1.05rem] font-medium text-slate-800"
                    aria-label="Hesaplama Aracı Ara"
                />

                {/* Keyboard Shortcut Hint or Clear Button */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    {query ? (
                        <button onClick={() => setQuery("")} className="text-slate-400 hover:text-slate-900 p-1 rounded-md hover:bg-slate-100" aria-label="Aramayı Temizle">
                            <X size={18} aria-hidden="true" />
                        </button>
                    ) : (
                        <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded bg-slate-100 border border-slate-200 text-[0.65rem] font-medium text-slate-500 select-none pointer-events-none">
                            <kbd className="font-sans">⌘</kbd>
                            <kbd className="font-sans">K</kbd>
                        </div>
                    )}
                </div>
            </div>

            {isOpen && filtered.length > 0 && (
                <div className="absolute top-16 left-0 w-full bg-white border border-slate-200 rounded-2xl shadow-xl z-[100] max-h-96 overflow-y-auto p-2">
                    {filtered.map((calc) => (
                        <Link
                            key={calc.id}
                            href={`/${calc.category}/${calc.slug}`}
                            className="flex items-start justify-between gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors group"
                            onClick={() => setIsOpen(false)}
                        >
                            <div className="min-w-0">
                                <p className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">{calc.name.tr}</p>
                                <p className="mt-1 text-sm text-slate-600 line-clamp-2">
                                    {calc.shortDescription.tr}
                                </p>
                                <p className="mt-2 text-[11px] text-slate-500 uppercase tracking-wide truncate">
                                    {getCategoryName(calc.category, "tr")}
                                </p>
                            </div>
                            <span className="shrink-0 text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md font-medium">Hesapla</span>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}

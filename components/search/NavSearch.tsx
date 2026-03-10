"use client";

import { useCallback, useDeferredValue, useEffect, useRef, useState } from "react";
import { Search, X, Calculator } from "lucide-react";
import Link from "next/link";
import type { CalculatorSearchEntry } from "@/lib/calculator-types";
import { getCategoryName } from "@/lib/categories";

interface Props {
    entries: CalculatorSearchEntry[];
}

export default function NavSearch({ entries }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const deferredQuery = useDeferredValue(query);

    const openSearch = useCallback(() => {
        setIsOpen(true);
        setTimeout(() => inputRef.current?.focus(), 100);
        document.body.style.overflow = "hidden";
    }, []);

    const closeSearch = useCallback(() => {
        setIsOpen(false);
        setQuery("");
        document.body.style.overflow = "";
    }, []);

    // Close on escape & handle Cmd+K
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") closeSearch();
            if ((e.ctrlKey || e.metaKey) && e.key === "k") {
                e.preventDefault();
                openSearch();
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [closeSearch, openSearch]);

    const filtered = deferredQuery.length > 1
        ? entries.filter((c) =>
            c.name.tr.toLowerCase().includes(deferredQuery.toLowerCase()) ||
            c.category.toLowerCase().includes(deferredQuery.toLowerCase()) ||
            c.shortDescription.tr.toLowerCase().includes(deferredQuery.toLowerCase())
        )
        : [];

    return (
        <>
            <button
                onClick={openSearch}
                className="w-10 h-10 rounded-full flex items-center justify-center border border-slate-200 bg-transparent hover:bg-slate-100 text-slate-600 hover:text-blue-600 transition-colors mr-1"
                aria-label="Arama Yap (Cmd+K)"
                title="Arama Yap (Cmd+K)"
            >
                <Search size={18} />
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24 sm:pt-32 px-4 animate-fade-in">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-white/80 backdrop-blur-sm"
                        onClick={closeSearch}
                    />

                    {/* Modal */}
                    <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden animate-scale-in flex flex-col max-h-[70vh]">
                        <div className="flex items-center px-4 border-b border-slate-100 shadow-sm">
                            <Search className="text-slate-400 mr-2" size={20} aria-hidden="true" />
                            <input
                                ref={inputRef}
                                type="text"
                                className="w-full h-16 bg-transparent outline-none px-2 text-lg text-slate-900 placeholder:text-slate-400"
                                placeholder="Hesaplama aracı ara... (örn. KDV)"
                                aria-label="Arama Sorgusu"
                                value={query}
                                onChange={(e) => {
                                    setQuery(e.target.value);
                                }}
                            />
                            {query && (
                                <button onClick={() => setQuery("")} className="p-2 text-slate-400 hover:text-slate-900 mr-2 rounded hover:bg-slate-50 transition-colors" aria-label="Aramayı Temizle">
                                    <X size={18} aria-hidden="true" />
                                </button>
                            )}
                            <button onClick={closeSearch} className="px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 bg-slate-100 rounded border border-slate-200 hidden sm:block transition-colors" aria-label="Aramayı Kapat (Esc)">
                                ESC
                            </button>
                            <button onClick={closeSearch} className="p-2 text-slate-400 hover:text-slate-900 rounded hover:bg-slate-50 sm:hidden transition-colors" aria-label="Aramayı Kapat">
                                <X size={20} aria-hidden="true" />
                            </button>
                        </div>

                        {query.length > 1 && (
                            <div className="overflow-y-auto p-2">
                                {filtered.length > 0 ? (
                                    <div className="space-y-1">
                                        {filtered.map((calc) => (
                                            <Link
                                                key={calc.id}
                                                href={`/${calc.category}/${calc.slug}`}
                                                onClick={closeSearch}
                                                className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors group"
                                            >
                                                <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                                    <Calculator size={20} />
                                                </div>
                                                <div className="flex-1 text-left">
                                                    <p className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">{calc.name.tr}</p>
                                                    <p className="mt-1 text-sm text-slate-600 line-clamp-2">
                                                        {calc.shortDescription.tr}
                                                    </p>
                                                    <p className="text-[11px] text-slate-500 uppercase tracking-wide mt-2 truncate">
                                                        {getCategoryName(calc.category, "tr")}
                                                    </p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-8 text-center text-slate-500 min-h-[150px] flex flex-col items-center justify-center">
                                        <p>"{query}" için sonuç bulunamadı.</p>
                                    </div>
                                )}
                            </div>
                        )}
                        {query.length <= 1 && (
                            <div className="p-6 text-center text-slate-500 text-sm bg-slate-50">
                                Araç isimleri veya kategoriye göre hızlı arama yapabilirsiniz.<br />
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

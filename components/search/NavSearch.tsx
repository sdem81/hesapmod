"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, Calculator } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function NavSearch() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [calculators, setCalculators] = useState<any[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);

    const loadData = async () => {
        if (calculators.length === 0) {
            const mod = await import("@/lib/calculators");
            setCalculators(mod.calculators);
        }
    };

    const openSearch = () => {
        setIsOpen(true);
        loadData();
        setTimeout(() => inputRef.current?.focus(), 100);
        document.body.style.overflow = "hidden";
    };

    const closeSearch = () => {
        setIsOpen(false);
        setQuery("");
        document.body.style.overflow = "";
    };

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
    }, [calculators.length]);

    const filtered = query.length > 1
        ? calculators.filter(c =>
            c.name.tr.toLowerCase().includes(query.toLowerCase()) ||
            c.category.toLowerCase().includes(query.toLowerCase())
        )
        : [];

    return (
        <>
            <button
                onClick={openSearch}
                className="w-10 h-10 rounded-full flex items-center justify-center border hover:bg-muted transition-colors mr-1 opacity-80 hover:opacity-100"
                aria-label="Arama Yap (Cmd+K)"
                title="Arama Yap (Cmd+K)"
            >
                <Search size={18} />
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24 sm:pt-32 px-4 animate-fade-in">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-background/80 backdrop-blur-sm"
                        onClick={closeSearch}
                    />

                    {/* Modal */}
                    <div className="relative w-full max-w-2xl bg-card border rounded-2xl shadow-2xl overflow-hidden animate-scale-in flex flex-col max-h-[70vh]">
                        <div className="flex items-center px-4 border-b shadow-sm">
                            <Search className="text-muted-foreground mr-2" size={20} aria-hidden="true" />
                            <input
                                ref={inputRef}
                                type="text"
                                className="w-full h-16 bg-transparent outline-none px-2 text-lg"
                                placeholder="Hesaplama aracı ara... (örn. KDV)"
                                aria-label="Arama Sorgusu"
                                value={query}
                                onChange={(e) => {
                                    setQuery(e.target.value);
                                    loadData(); // Just in case
                                }}
                            />
                            {query && (
                                <button onClick={() => setQuery("")} className="p-2 text-muted-foreground hover:text-foreground mr-2" aria-label="Aramayı Temizle">
                                    <X size={18} aria-hidden="true" />
                                </button>
                            )}
                            <button onClick={closeSearch} className="px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground bg-muted/50 rounded border hidden sm:block" aria-label="Aramayı Kapat (Esc)">
                                ESC
                            </button>
                            <button onClick={closeSearch} className="p-2 text-muted-foreground sm:hidden" aria-label="Aramayı Kapat">
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
                                                className="flex items-center gap-4 p-4 rounded-xl hover:bg-muted transition-colors group"
                                            >
                                                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                                    <Calculator size={20} />
                                                </div>
                                                <div className="flex-1 text-left">
                                                    <p className="font-semibold text-foreground group-hover:text-primary transition-colors">{calc.name.tr}</p>
                                                    <p className="text-xs text-muted-foreground uppercase tracking-wide mt-0.5 truncate">{calc.category.replace(/-/g, " ")}</p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-8 text-center text-muted-foreground min-h-[150px] flex flex-col items-center justify-center">
                                        <p>"{query}" için sonuç bulunamadı.</p>
                                    </div>
                                )}
                            </div>
                        )}
                        {query.length <= 1 && (
                            <div className="p-6 text-center text-muted-foreground text-sm bg-muted/10">
                                Araç isimleri veya kategoriye göre hızlı arama yapabilirsiniz.<br />
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

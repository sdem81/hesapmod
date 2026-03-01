"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import Link from "next/link";

export default function GlobalSearch() {
    const [query, setQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [calculators, setCalculators] = useState<any[]>([]);
    const resultsRef = useRef<HTMLDivElement>(null);

    const loadData = async () => {
        if (calculators.length === 0) {
            const mod = await import("@/lib/calculators");
            setCalculators(mod.calculators);
        }
    };

    const filtered = query.length > 1
        ? calculators.filter(c =>
            c.name.tr.toLowerCase().includes(query.toLowerCase()) ||
            c.category.toLowerCase().includes(query.toLowerCase())
        )
        : [];

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (resultsRef.current && !resultsRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative w-full max-w-2xl mx-auto" ref={resultsRef}>
            <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground opacity-50 group-focus-within:text-primary transition-colors" size={20} aria-hidden="true" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setIsOpen(true);
                        loadData();
                    }}
                    onFocus={() => {
                        setIsOpen(true);
                        loadData();
                    }}
                    placeholder="Hangi aracı arıyorsunuz? (KDV, VKİ...)"
                    className="w-full h-14 pl-12 pr-10 rounded-2xl border bg-card shadow-lg shadow-primary/5 outline-none focus:ring-2 focus:ring-primary transition-all text-lg"
                    aria-label="Hesaplama Aracı Ara"
                />
                {query && (
                    <button onClick={() => setQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" aria-label="Aramayı Temizle">
                        <X size={18} aria-hidden="true" />
                    </button>
                )}
            </div>

            {isOpen && filtered.length > 0 && (
                <div className="absolute top-16 left-0 w-full bg-card border rounded-2xl shadow-2xl z-[100] max-h-96 overflow-y-auto p-2">
                    {filtered.map((calc) => (
                        <Link
                            key={calc.id}
                            href={`/${calc.category}/${calc.slug}`}
                            className="flex items-center justify-between p-4 rounded-xl hover:bg-muted transition-colors group"
                            onClick={() => setIsOpen(false)}
                        >
                            <div>
                                <p className="font-bold group-hover:text-primary transition-colors">{calc.name.tr}</p>
                                <p className="text-xs text-muted-foreground uppercase">{calc.category}</p>
                            </div>
                            <span className="text-xs bg-muted px-2 py-1 rounded-md">Hesapla</span>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}

"use client";

// ✅ C-3 FIX: Hydration mismatch önlendi.
// Sunucu her zaman "light" render eder; client mount oldukça gerçek temayı uygular.
// "mounted" kontrolü sayesinde server/client HTML farkı oluşmaz.
import { createContext, useContext, useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";

const ThemeContext = createContext<{
    theme: Theme;
    toggle: () => void;
}>({ theme: "light", toggle: () => { } });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>("light");
    // mount öncesi client-only kodun çalışmasını engelle
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem("hesapmod-theme") as Theme | null;
        const prefersDark = window.matchMedia(
            "(prefers-color-scheme: dark)"
        ).matches;
        const initial = stored ?? (prefersDark ? "dark" : "light");
        setTheme(initial);
        // classList değişimi useEffect'te → sunucu HTML'ini etkilemez
        document.documentElement.classList.toggle("dark", initial === "dark");
        setMounted(true);
    }, []);

    const toggle = () => {
        setTheme((prev) => {
            const next: Theme = prev === "light" ? "dark" : "light";
            document.documentElement.classList.toggle("dark", next === "dark");
            localStorage.setItem("hesapmod-theme", next);
            return next;
        });
    };

    return (
        <ThemeContext.Provider value={{ theme, toggle }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function DarkModeToggle() {
    const { theme, toggle } = useContext(ThemeContext);
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    return (
        <button
            onClick={toggle}
            aria-label="Tema değiştir"
            className="w-9 h-9 rounded-full flex items-center justify-center border hover:bg-muted transition-colors"
        // Tema ikonu mount öncesi sabit boyutta placeholder gösterir
        // → CLS'yi önler
        >
            {/* Mount öncesi sabit boyut → layout shift yok */}
            {mounted ? (
                theme === "dark" ? <Sun size={16} /> : <Moon size={16} />
            ) : (
                <span className="w-4 h-4 block" aria-hidden="true" />
            )}
        </button>
    );
}

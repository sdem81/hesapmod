"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Grid2X2, Clock } from "lucide-react";

const tabs = [
    { href: "/", label: "Ana Sayfa", icon: Home },
    { href: "/arama", label: "Ara", icon: Search },
    { href: "/tum-araclar", label: "Kategoriler", icon: Grid2X2 },
    { href: "/son-kullanilanlar", label: "Geçmiş", icon: Clock },
];

export default function BottomNav() {
    const pathname = usePathname();

    return (
        <nav
            aria-label="Mobil alt navigasyon"
            className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 flex items-stretch safe-area-inset-bottom"
            style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
            {tabs.map(({ href, label, icon: Icon }) => {
                const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
                return (
                    <Link
                        key={href}
                        href={href}
                        aria-label={label}
                        className="flex-1 flex flex-col items-center justify-center gap-1 py-2 min-h-[56px] transition-colors"
                    >
                        <Icon
                            size={20}
                            className={isActive ? "text-blue-600" : "text-slate-400"}
                            strokeWidth={isActive ? 2.5 : 1.8}
                        />
                        <span
                            className={`text-[10px] font-semibold leading-none ${
                                isActive ? "text-blue-600" : "text-slate-400"
                            }`}
                        >
                            {label}
                        </span>
                        {isActive && (
                            <span className="absolute bottom-1 w-1 h-1 rounded-full bg-blue-600" />
                        )}
                    </Link>
                );
            })}
        </nav>
    );
}

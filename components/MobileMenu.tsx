"use client";

import { useState, useEffect } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import Link from "next/link"; // Next.js link for better prefetching

interface NavLink {
    href: string;
    label: string;
}

export default function MobileMenu({ links }: { links: NavLink[] }) {
    const [open, setOpen] = useState(false);

    // Body scroll lock on mobile menu open
    useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [open]);

    return (
        <div className="md:hidden">
            <button
                onClick={() => setOpen((o) => !o)}
                aria-expanded={open}
                aria-label="Menüyü aç/kapat"
                className="w-10 h-10 rounded-full flex items-center justify-center border hover:bg-muted transition-colors relative z-[60]"
            >
                {open ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Arka plan overlay & menü öğeleri */}
            <div
                className={`fixed top-16 left-0 w-full h-[calc(100dvh-4rem)] z-40 bg-background/95 backdrop-blur-md flex flex-col overflow-y-auto transition-all duration-300 ease-in-out origin-top ${open ? "opacity-100 scale-y-100 visible" : "opacity-0 scale-y-95 invisible"
                    }`}
            >
                <nav className="flex flex-col p-6 gap-3 pb-20">
                    {links.map((link, idx) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setOpen(false)}
                            style={{ transitionDelay: open ? `${idx * 40}ms` : "0ms" }}
                            className={`flex items-center justify-between px-5 py-4 rounded-xl text-lg font-medium bg-muted/30 hover:bg-primary/10 hover:text-primary transition-all duration-300 ${open ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0"
                                }`}
                        >
                            <span className="truncate">{link.label}</span>
                            <ArrowRight size={18} className="text-muted-foreground" />
                        </Link>
                    ))}
                </nav>
            </div>
        </div>
    );
}

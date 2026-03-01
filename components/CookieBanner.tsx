"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Cookie, X, Check, Settings } from "lucide-react";

type ConsentState = "accepted" | "rejected" | null;

export default function CookieBanner() {
    const [consent, setConsent] = useState<ConsentState>(null);
    const [mounted, setMounted] = useState(false);
    const [showDetails, setShowDetails] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem("hesapmod-cookie-consent") as ConsentState | null;
        setConsent(stored);
        setMounted(true);
    }, []);

    const accept = () => {
        localStorage.setItem("hesapmod-cookie-consent", "accepted");
        setConsent("accepted");
    };

    const reject = () => {
        localStorage.setItem("hesapmod-cookie-consent", "rejected");
        setConsent("rejected");
    };

    // Mount olmadan veya zaten karar verildiyse gösterme
    if (!mounted || consent !== null) return null;

    return (
        <div
            role="dialog"
            aria-label="Çerez Tercihleri"
            aria-modal="false"
            className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up"
        >
            {/* Backdrop blur overlay */}
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm border-t border-border" />

            <div className="relative container mx-auto px-4 py-4 max-w-6xl">
                <div className="flex flex-col gap-4">
                    {/* Ana satır */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        {/* İkon + Metin */}
                        <div className="flex items-start gap-3 flex-1">
                            <div className="mt-0.5 w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <Cookie size={18} className="text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-foreground mb-0.5">
                                    Çerezleri Nasıl Kullandığımızı Öğrenin
                                </p>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    Sitenin düzgün çalışması için zorunlu çerezler, trafiği analiz etmek için
                                    Google Analytics kullanıyoruz. Tercihlerinizi{" "}
                                    <button
                                        onClick={() => setShowDetails(!showDetails)}
                                        className="text-primary hover:underline font-medium"
                                    >
                                        detayları görüntüle
                                    </button>
                                    {" "}veya{" "}
                                    <Link href="/cerez-politikasi" className="text-primary hover:underline font-medium">
                                        Çerez Politikası
                                    </Link>
                                    {" "}ile yönetebilirsiniz.
                                </p>
                            </div>
                        </div>

                        {/* Butonlar */}
                        <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto">
                            <button
                                onClick={reject}
                                id="cookie-reject-btn"
                                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-medium rounded-lg border border-border hover:bg-muted transition-colors text-muted-foreground"
                            >
                                <X size={13} />
                                Reddet
                            </button>
                            <button
                                onClick={accept}
                                id="cookie-accept-btn"
                                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                            >
                                <Check size={13} />
                                Tümünü Kabul Et
                            </button>
                        </div>
                    </div>

                    {/* Detay bölümü (toggle ile açılır) */}
                    {showDetails && (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-border/50">
                            {/* Zorunlu */}
                            <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50">
                                <div className="mt-0.5 w-4 h-4 rounded-full bg-green-500 flex-shrink-0 flex items-center justify-center">
                                    <Check size={10} className="text-white" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-foreground">Zorunlu Çerezler</p>
                                    <p className="text-[11px] text-muted-foreground mt-0.5">
                                        Tema tercihi gibi temel site işlevleri. Kapatılamaz.
                                    </p>
                                </div>
                            </div>
                            {/* Analitik */}
                            <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50">
                                <div className="mt-0.5 w-4 h-4 rounded-full bg-primary/20 flex-shrink-0 flex items-center justify-center">
                                    <Settings size={10} className="text-primary" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-foreground">Analitik Çerezler</p>
                                    <p className="text-[11px] text-muted-foreground mt-0.5">
                                        Google Analytics ile ziyaretçi trafiğini ölçüyoruz.
                                    </p>
                                </div>
                            </div>
                            {/* Reklam */}
                            <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50">
                                <div className="mt-0.5 w-4 h-4 rounded-full bg-gray-300 dark:bg-gray-600 flex-shrink-0" />
                                <div>
                                    <p className="text-xs font-semibold text-foreground">Pazarlama Çerezleri</p>
                                    <p className="text-[11px] text-muted-foreground mt-0.5">
                                        Şu an kullanılmıyor.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                @keyframes slide-up {
                    from { transform: translateY(100%); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .animate-slide-up {
                    animation: slide-up 0.35s cubic-bezier(0.16, 1, 0.3, 1) both;
                }
            `}</style>
        </div>
    );
}

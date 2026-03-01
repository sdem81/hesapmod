// ✅ C-1 FIX: Server Component + metadata export (artık index edilebilir)
import { Metadata } from "next";
import { calculators } from "@/lib/calculators";
import AllToolsClient from "./AllToolsClient";

export const metadata: Metadata = {
    title: "Tüm Hesaplama Araçları — Ücretsiz Online Hesap Makineleri | HesapMod",
    description: `${calculators.length} ücretsiz hesaplama aracı tek sayfada. Finans, sağlık, matematik ve günlük yaşam kategorilerinde online hesaplama araçları.`,
    alternates: {
        canonical: "/tum-araclar",
    },
    openGraph: {
        title: "Tüm Hesaplama Araçları | HesapMod",
        description: "Finans, sağlık, matematik ve günlük yaşam için ücretsiz hesaplama araçları.",
        url: "https://hesapmod.com/tum-araclar",
    },
};

export default function AllToolsPage() {
    return (
        <div className="container mx-auto px-4 py-16 max-w-6xl">
            {/* Header — sunucuda render edilir, SEO için ideal */}
            <div className="mb-12 text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
                    Tüm Hesaplama Araçları
                </h1>
                <p className="text-xl text-muted-foreground mb-8">
                    {calculators.length} ücretsiz hesaplama aracı tek sayfada.
                </p>
            </div>

            {/* Client bileşen: arama ve filtreleme */}
            <AllToolsClient />
        </div>
    );
}

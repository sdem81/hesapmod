import { mainCategories } from "@/lib/categories";
import { Metadata } from "next";
import GlobalSearch from "@/components/search/GlobalSearch";
import Link from "next/link";
import CategoryCard from "@/components/category/CategoryCard";

export const metadata: Metadata = {
    title: "HesapMod | Ücretsiz Online Hesaplama Araçları",
    description: "Finans, sağlık, matematik ve günlük yaşam için 300'den fazla ücretsiz, hızlı ve güvenilir hesaplama aracı. KDV, kredi, VKİ ve daha fazlası.",
    alternates: { canonical: "/" },
};

export default function Home() {
    return (
        <div className="flex flex-col items-center">
            {/* Hero Section */}
            <section className="w-full py-20 bg-gradient-to-b from-primary/5 to-background border-b relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
                <div className="container mx-auto px-4 text-center relative z-10">
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60 animate-fade-in-up">
                        Hızlı ve Ücretsiz <br className="hidden md:block" /> Hesaplama Araçları
                    </h1>
                    <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto animate-fade-in-up delay-100">
                        Finans, Sağlık, Matematik ve 300'den fazla kategori için profesyonel araçlar burada.
                    </p>

                    <div className="w-full max-w-2xl mx-auto animate-fade-in-up delay-200">
                        <GlobalSearch />
                    </div>
                </div>
            </section>

            {/* Category Grid */}
            <section className="container mx-auto px-4 py-24">
                <h2 className="text-3xl font-bold mb-12 flex items-center gap-3 animate-fade-in-up">
                    Kategoriler
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {mainCategories.map((cat, idx) => (
                        <CategoryCard key={cat.id} category={cat} index={idx} />
                    ))}
                </div>
            </section>

        </div>
    );
}

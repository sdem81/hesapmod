import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider, DarkModeToggle } from "@/components/ThemeProvider";
import MobileMenu from "@/components/MobileMenu";
import { mainCategories } from "@/lib/categories";
import Link from "next/link";
import Script from "next/script";
import { GoogleAnalytics } from "@next/third-parties/google";
import CookieBanner from "@/components/CookieBanner";
import NavSearch from "@/components/search/NavSearch";

const inter = Inter({ subsets: ["latin", "latin-ext"] });

export const viewport: Viewport = {
    themeColor: "#3b82f6",
    width: "device-width",
    initialScale: 1,
};

export const metadata: Metadata = {
    title: {
        default: "HesapMod | Profesyonel Hesaplama Araçları",
        template: "%s | HesapMod",
    },
    description: "Finans, sağlık, matematik ve günlük yaşam için 300'den fazla ücretsiz ve hızlı hesaplama aracı.",
    metadataBase: new URL("https://hesapmod.com"),
    alternates: {
        canonical: "/",
        languages: {
            "tr-TR": "/tr",
            "en-US": "/en",
        },
    },
    openGraph: {
        type: "website",
        locale: "tr_TR",
        url: "https://hesapmod.com",
        siteName: "HesapMod",
        images: [
            {
                url: "https://hesapmod.com/opengraph-image",
                width: 1200,
                height: 630,
                alt: "HesapMod — 300+ Ücretsiz Hesaplama Aracı",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "HesapMod | Profesyonel Hesaplama Araçları",
        description: "300+ hesaplama aracı ile hayatınızı kolaylaştırın.",
        images: ["https://hesapmod.com/opengraph-image"],
    },
    icons: {
        icon: [
            { url: "/favicon.ico" },
            { url: "/icon.svg", type: "image/svg+xml" }
        ],
        apple: "/apple-touch-icon.png",
    },
    robots: {
        index: true,
        follow: true,
    },
};

// Nav linkleri mainCategories'den otomatik üretiliyor
// Yeni kategori için sadece lib/categories.ts'e obje eklemek yeterli
const navLinks = [
    ...mainCategories.map((cat) => ({
        href: `/kategori/${cat.slug}`,
        label: cat.name.tr,
    })),
    { href: "/tum-araclar", label: "Tüm Araçlar" },
];

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="tr" className="scroll-smooth" suppressHydrationWarning>
            <body className={cn(inter.className, "min-h-screen flex flex-col")}>
                <ThemeProvider>
                    {/* Kurumsal SEO Şeması */}
                    <Script
                        id="organization-schema"
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{
                            __html: JSON.stringify({
                                "@context": "https://schema.org",
                                "@type": "Organization",
                                "name": "HesapMod",
                                "url": "https://hesapmod.com",
                                "logo": "https://hesapmod.com/icon.svg",
                                "sameAs": [],
                                "contactPoint": {
                                    "@type": "ContactPoint",
                                    "email": "hesapmodcom@gmail.com",
                                    "contactType": "customer service"
                                }
                            }),
                        }}
                    />

                    {/* Google Analytics 4 (Optimized) */}
                    <GoogleAnalytics gaId="G-NWXRPF7PC1" />

                    <header className="sticky top-0 z-50 w-full border-b glass">
                        <div className="container mx-auto flex h-16 items-center justify-between px-4">
                            <div className="flex items-center gap-2">
                                <Link href="/" className="text-2xl font-bold tracking-tighter text-primary hover:opacity-80 transition-opacity">
                                    Hesap<span className="text-foreground">Mod</span>
                                </Link>
                            </div>
                            <nav className="hidden md:flex items-center gap-6">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        title={link.label}
                                        className="text-sm font-medium hover:text-primary relative group transition-colors flex items-center"
                                    >
                                        <span className="truncate max-w-[120px] lg:max-w-[180px] xl:max-w-none">
                                            {link.label}
                                        </span>
                                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
                                    </Link>
                                ))}
                            </nav>
                            <div className="flex items-center gap-3">
                                <NavSearch />
                                <DarkModeToggle />
                                <MobileMenu links={navLinks} />
                            </div>
                        </div>
                    </header>
                    <main className="flex-1">{children}</main>
                    <footer className="border-t bg-muted/50">
                        <div className="container mx-auto py-12 px-4">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                <div>
                                    <h3 className="font-bold mb-4">HesapMod</h3>
                                    <p className="text-sm text-muted-foreground mb-3">En güvenilir hesaplama araçları platformu.</p>
                                    <a href="mailto:hesapmodcom@gmail.com" className="text-sm text-primary hover:underline break-all inline-block">hesapmodcom@gmail.com</a>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-4">Kategoriler</h4>
                                    <ul className="space-y-2 text-sm text-muted-foreground">
                                        {mainCategories.map((cat) => (
                                            <li key={cat.slug}>
                                                <Link href={`/kategori/${cat.slug}`} className="hover:text-primary">
                                                    {cat.name.tr}
                                                </Link>
                                            </li>
                                        ))}
                                        <li><Link href="/tum-araclar" className="hover:text-primary">Tüm Araçlar</Link></li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-4">Kurumsal</h4>
                                    <ul className="space-y-2 text-sm text-muted-foreground">
                                        <li><Link href="/hakkimizda" className="hover:text-primary">Hakkımızda</Link></li>
                                        <li><Link href="/iletisim" className="hover:text-primary">İletişim</Link></li>
                                        <li><Link href="/sss" className="hover:text-primary">SSS</Link></li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-4">Yasal</h4>
                                    <ul className="space-y-2 text-sm text-muted-foreground">
                                        <li><Link href="/gizlilik-politikasi" className="hover:text-primary">Gizlilik Politikası</Link></li>
                                        <li><Link href="/cerez-politikasi" className="hover:text-primary">Çerez Politikası</Link></li>
                                        <li><Link href="/kvkk" className="hover:text-primary">KVKK</Link></li>
                                        <li><Link href="/kullanim-kosullari" className="hover:text-primary">Kullanım Koşulları</Link></li>
                                    </ul>
                                </div>
                            </div>
                            <div className="mt-12 pt-8 border-t flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
                                <span>© {new Date().getFullYear()} HesapMod. Tüm hakları saklıdır.</span>
                                <span>Hesaplamalar bilgilendirme amaçlıdır · Tıbbi/finansal tavsiye değildir</span>
                            </div>
                        </div>
                    </footer>
                    <CookieBanner />
                </ThemeProvider>
            </body>
        </html>
    );
}

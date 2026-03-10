import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider, DarkModeToggle } from "@/components/ThemeProvider";
import MobileMenu from "@/components/MobileMenu";
import BottomNav from "@/components/BottomNav";
import { mainCategories } from "@/lib/categories";
import { calculatorSearchIndex } from "@/lib/calculators";
import Link from "next/link";
import Script from "next/script";
import AnalyticsLoader from "@/components/AnalyticsLoader";
import CookieBanner from "@/components/CookieBanner";
import NavSearch from "@/components/search/NavSearch";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { CONTACT_FORM_PATH } from "@/lib/contact";

const inter = Inter({ subsets: ["latin", "latin-ext"] });

export const viewport: Viewport = {
    themeColor: "#3b82f6",
    width: "device-width",
    initialScale: 1,
};

export const metadata: Metadata = {
    title: {
        default: `${SITE_NAME} | Profesyonel Hesaplama Araçları`,
        template: `%s | ${SITE_NAME}`,
    },
    description: "Finans, sağlık, matematik ve günlük yaşam için yüzlerce ücretsiz ve hızlı hesaplama aracı.",
    metadataBase: new URL(SITE_URL),
    alternates: {
        canonical: "/",
    },
    openGraph: {
        type: "website",
        locale: "tr_TR",
        url: SITE_URL,
        siteName: SITE_NAME,
        images: [
            {
                url: `${SITE_URL}/opengraph-image`,
                width: 1200,
                height: 630,
                alt: "HesapMod — Yüzlerce Ücretsiz Hesaplama Aracı",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: `${SITE_NAME} | Profesyonel Hesaplama Araçları`,
        description: "Yüzlerce hesaplama aracı ile hayatınızı kolaylaştırın.",
        images: [`${SITE_URL}/opengraph-image`],
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
            <body className={cn(inter.className, "bg-slate-50 text-slate-900 antialiased min-h-screen flex flex-col")}>
                <ThemeProvider>
                    {/* Kurumsal SEO Şeması */}
                    <Script
                        id="organization-schema"
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{
                            __html: JSON.stringify({
                                "@context": "https://schema.org",
                                "@type": "Organization",
                                "name": SITE_NAME,
                                "url": SITE_URL,
                                "logo": `${SITE_URL}/icon.svg`,
                                "sameAs": [],
                                "contactPoint": {
                                    "@type": "ContactPoint",
                                    "url": `${SITE_URL}${CONTACT_FORM_PATH}`,
                                    "contactType": "customer service",
                                    "availableLanguage": ["Turkish"]
                                }
                            }),
                        }}
                    />

                    {/* Google Analytics only after explicit consent */}
                    <AnalyticsLoader />

                    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200">
                        <div className="container mx-auto flex h-16 items-center justify-between px-4">
                            <div className="flex items-center gap-2">
                                <Link href="/" className="text-2xl font-bold tracking-tighter text-blue-600 hover:opacity-80 transition-opacity">
                                    Hesap<span className="text-slate-900">Mod</span>
                                </Link>
                            </div>
                            <nav className="hidden md:flex items-center gap-6">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        title={link.label}
                                        className="text-sm font-medium text-slate-700 hover:text-blue-600 relative group transition-colors flex items-center"
                                    >
                                        <span className="truncate max-w-[120px] lg:max-w-[180px] xl:max-w-none">
                                            {link.label}
                                        </span>
                                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300" />
                                    </Link>
                                ))}
                            </nav>
                            <div className="flex items-center gap-3">
                                <NavSearch entries={calculatorSearchIndex} />
                                <DarkModeToggle />
                                <MobileMenu links={navLinks} />
                            </div>
                        </div>
                    </header>
                    <main className="flex-1 pb-20 md:pb-0">{children}</main>
                    <footer className="border-t border-slate-200 bg-slate-100">
                        <div className="container mx-auto py-12 px-4">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                <div>
                                    <h3 className="font-bold mb-4 text-slate-900">HesapMod</h3>
                                    <p className="text-sm text-slate-600 mb-3">En güvenilir hesaplama araçları platformu.</p>
                                    <Link href={CONTACT_FORM_PATH} className="text-sm text-blue-600 hover:text-blue-700 hover:underline inline-block">İletişim formu ile ulaşın</Link>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-4 text-slate-900">Kategoriler</h4>
                                    <ul className="space-y-2 text-sm text-slate-600">
                                        {mainCategories.map((cat) => (
                                            <li key={cat.slug}>
                                                <Link href={`/kategori/${cat.slug}`} className="hover:text-blue-600">
                                                    {cat.name.tr}
                                                </Link>
                                            </li>
                                        ))}
                                        <li><Link href="/tum-araclar" className="hover:text-blue-600">Tüm Araçlar</Link></li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-4 text-slate-900">Kurumsal</h4>
                                    <ul className="space-y-2 text-sm text-slate-600">
                                        <li><Link href="/hakkimizda" className="hover:text-blue-600">Hakkımızda</Link></li>
                                        <li><Link href="/iletisim" className="hover:text-blue-600">İletişim</Link></li>
                                        <li><Link href="/sss" className="hover:text-blue-600">SSS</Link></li>
                                        <li><Link href="/rehber" className="hover:text-blue-600">Rehber &amp; İpuçları</Link></li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-4 text-slate-900">Yasal</h4>
                                    <ul className="space-y-2 text-sm text-slate-600">
                                        <li><Link href="/gizlilik-politikasi" className="hover:text-blue-600">Gizlilik Politikası</Link></li>
                                        <li><Link href="/cerez-politikasi" className="hover:text-blue-600">Çerez Politikası</Link></li>
                                        <li><Link href="/kvkk" className="hover:text-blue-600">KVKK</Link></li>
                                        <li><Link href="/kullanim-kosullari" className="hover:text-blue-600">Kullanım Koşulları</Link></li>
                                    </ul>
                                </div>
                            </div>
                            <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-slate-500">
                                <span>© {new Date().getFullYear()} HesapMod. Tüm hakları saklıdır.</span>
                                <span>Hesaplamalar bilgilendirme amaçlıdır · Tıbbi/finansal tavsiye değildir</span>
                            </div>
                        </div>
                    </footer>
                    <CookieBanner />
                    <BottomNav />
                </ThemeProvider>
            </body>
        </html>
    );
}

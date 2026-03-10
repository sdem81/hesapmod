import type { Metadata } from "next";
import Script from "next/script";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import IletisimForm from "@/components/IletisimForm";

export const metadata: Metadata = {
    title: "İletişim — HesapMod",
    description: "HesapMod ile iletişime geçin. Sorularınız, önerileriniz ve hata bildirimleriniz için iletişim formumuzu kullanın. 1-2 iş günü içinde yanıt veriyoruz.",
    alternates: { canonical: "/iletisim" },
    robots: { index: true, follow: true },
    openGraph: {
        title: "İletişim | HesapMod",
        description: "Sorularınız ve önerileriniz için bize yazın.",
        url: `${SITE_URL}/iletisim`,
        type: "website",
    },
};

const contactPageSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "İletişim — HesapMod",
    url: `${SITE_URL}/iletisim`,
    description: "HesapMod hesaplama araçları platformu için iletişim sayfası. Soru, öneri ve geri bildirimlerinizi iletebilirsiniz.",
    inLanguage: "tr-TR",
    isPartOf: {
        "@type": "WebSite",
        name: SITE_NAME,
        url: SITE_URL,
    },
    breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: [
            { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: SITE_URL },
            { "@type": "ListItem", position: 2, name: "İletişim", item: `${SITE_URL}/iletisim` },
        ],
    },
};

export default function IletisimPage() {
    return (
        <div className="container mx-auto px-4 py-16 max-w-5xl">
            <Script
                id="iletisim-schema"
                type="application/ld+json"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageSchema) }}
            />

            <div className="mb-12">
                <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">İletişim</span>
                <h1 className="text-4xl font-extrabold tracking-tight mt-4 mb-4">Bize Ulaşın</h1>
                <p className="text-xl text-muted-foreground">Sorularınız, önerileriniz veya hata bildirimleri için buradayız. En kısa sürede yanıt vereceğiz.</p>
            </div>

            <IletisimForm />
        </div>
    );
}
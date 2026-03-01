import { calculators } from "@/lib/calculators";
import { mainCategories } from "@/lib/categories";
import { MetadataRoute } from "next";

const BASE_URL = "https://hesapmod.com";

export default function sitemap(): MetadataRoute.Sitemap {
    const currentDate = new Date();

    // ── Ana sayfa ve Sabit Sayfalar
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: BASE_URL,
            lastModified: currentDate,
            changeFrequency: "weekly",
            priority: 1.0,
        },
        {
            url: `${BASE_URL}/tum-araclar`,
            lastModified: currentDate,
            changeFrequency: "daily",
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/hakkimizda`,
            lastModified: currentDate,
            changeFrequency: "monthly",
            priority: 0.7,
        },
        {
            url: `${BASE_URL}/iletisim`,
            lastModified: currentDate,
            changeFrequency: "monthly",
            priority: 0.7,
        },
        {
            url: `${BASE_URL}/sss`,
            lastModified: currentDate,
            changeFrequency: "monthly",
            priority: 0.7,
        },
        {
            url: `${BASE_URL}/gizlilik-politikasi`,
            lastModified: currentDate,
            changeFrequency: "yearly",
            priority: 0.4,
        },
        {
            url: `${BASE_URL}/cerez-politikasi`,
            lastModified: currentDate,
            changeFrequency: "yearly",
            priority: 0.3,
        },
        {
            url: `${BASE_URL}/kvkk`,
            lastModified: currentDate,
            changeFrequency: "yearly",
            priority: 0.3,
        },
        {
            url: `${BASE_URL}/kullanim-kosullari`,
            lastModified: currentDate,
            changeFrequency: "yearly",
            priority: 0.3,
        },
    ];


    // ── Kategori sayfaları
    const categoryPages: MetadataRoute.Sitemap = mainCategories.map((cat) => ({
        url: `${BASE_URL}/kategori/${cat.slug}`,
        lastModified: currentDate,
        changeFrequency: "weekly" as const,
        priority: 0.85,
    }));

    // ── Hesap makinesi sayfaları
    // Sağlık (YMYL) sayfalarına daha yüksek priority veriyoruz.
    // Her güncellendiğinde buradaki tarih sistem saatiyle güncel basılacak.
    const calcPages: MetadataRoute.Sitemap = calculators.map((calc) => ({
        url: `${BASE_URL}/${calc.category}/${calc.slug}`,
        lastModified: currentDate,
        changeFrequency: "daily" as const, // Indexlemeyi hızlandırmak için daily yaptık
        priority: calc.category === "saglik" ? 0.85 : 0.8,
    }));

    return [...staticPages, ...categoryPages, ...calcPages];
}

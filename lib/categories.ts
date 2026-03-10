export interface Category {
    id: string;
    name: {
        tr: string;
        en: string;
    };
    slug: string;
    icon: string;
    description: {
        tr: string;
        en: string;
    };
    seoContent?: {
        tr: string;
        en: string;
    };
    faq?: Array<{
        q: { tr: string; en: string };
        a: { tr: string; en: string };
    }>;
}

export const CATEGORY_ALIASES: Record<string, string> = {
    "finans-hesaplama": "finansal-hesaplamalar",
    "finans": "finansal-hesaplamalar",
    "matematik": "matematik-hesaplama",
    "saglik": "yasam-hesaplama",
    "gunluk": "yasam-hesaplama",
    "zaman-hesaplamalari": "zaman-hesaplama",
};

export const mainCategories: Category[] = [
    {
        id: "maas-ve-vergi",
        name: { tr: "Maaş & Vergi", en: "Salary & Tax" },
        slug: "maas-ve-vergi",
        icon: "Banknote",
        description: { tr: "Brüt-net maaş, gelir vergisi, SGK, kıdem ve ihbar tazminatı hesaplamaları.", en: "Gross-net salary, income tax, SGK, severance and notice pay calculations." },
        seoContent: {
            tr: "Maaş ve vergi hesaplama araçları, çalışanların ve işverenlerin finansal yükümlülüklerini kolayca hesaplamasını sağlayan online ve ücretsiz servislerdir. Asgari ücret hesaplamalarından kıdem tazminatına, gelir vergisi dilimlerinden SGK kesintilerine kadar iş hayatında karşılaşabileceğiniz tüm yasal hesaplamalar güncel mevzuata uygun olarak yapılır.",
            en: "Salary and tax calculators are online tools that allow employees and employers to easily calculate their financial obligations."
        },
        faq: [
            {
                q: { tr: "Maaş hesaplamaları güncel mi?", en: "Are salary calculations up to date?" },
                a: { tr: "Evet, tüm maaş ve vergi hesaplamalarımız ilgili yılın en güncel asgari ücret tutarları ve vergi dilimleri baz alınarak yapılır.", en: "Yes, all our salary and tax calculations are based on the most current minimum wage and tax brackets." }
            },
            {
                q: { tr: "Brütten nete maaş nasıl hesaplanır?", en: "How to calculate net salary from gross?" },
                a: { tr: "Brüt maaşınızdan SGK işçi payı, İşsizlik Sigortası işçi payı, Gelir Vergisi ve Damga Vergisi düşülerek net maaşınıza ulaşılır.", en: "Net salary is calculated by deducting SGK premiums, Income Tax, and Stamp Tax from your gross salary." }
            }
        ]
    },
    {
        id: "tasit-ve-vergi",
        name: { tr: "Taşıt & Vergi", en: "Vehicle & Tax" },
        slug: "tasit-ve-vergi",
        icon: "Car",
        description: { tr: "MTV, ÖTV, yakıt tüketimi, yol süresi ve araç maliyet planlama hesaplamaları.", en: "Motor vehicle tax, special consumption tax, fuel, travel time, and vehicle cost planning calculations." },
        seoContent: {
            tr: "Taşıt & Vergi kategorisi; araç sahiplerinin yıllık vergi yükünü, araç alımında oluşabilecek dolaylı vergi etkisini ve yol kullanım maliyetini daha görünür hale getirmek için hazırlanmıştır. MTV ve ÖTV araçları ilk bütçe planlaması için hızlı bir çerçeve sunarken, yakıt tüketimi ve hız-mesafe-süre araçları da günlük kullanım ve uzun yol senaryolarında daha gerçekçi maliyet ve zaman planı kurmanıza yardımcı olur. Vergi sayfalarını nihai ödeme ekranı gibi değil, resmi tarifeler ve bayi teklifleri öncesinde kullanılan karar destek araçları olarak okumak daha doğrudur.",
            en: "Calculations related to vehicles and fuel consumption."
        },
        faq: [
            {
                q: { tr: "Taşıt vergisi araçları kesin resmi tutarı mı verir?", en: "Do the vehicle tax tools provide the exact official amount?" },
                a: { tr: "Hayır. MTV ve ÖTV araçları ön planlama için hızlı bir simülasyon sunar. Nihai tutar araç tipi, vergi değeri, matrah kırılımı, istisna ve resmi tarife detaylarına göre değişebilir; ödeme veya satın alma öncesinde resmi kaynakla doğrulama yapılmalıdır.", en: "No. The MTV and ÖTV tools provide a quick planning simulation. Final amounts can vary by vehicle type, value band, tax base, exemptions, and official tariff details, so they should be confirmed before payment or purchase." }
            },
            {
                q: { tr: "Yakıt ve süre hesaplarında en doğru sonucu nasıl alırım?", en: "How can I get the most accurate result from fuel and time calculations?" },
                a: { tr: "Kendi sürüşünüzde gördüğünüz ortalama tüketim ve rota verisini kullanın. Trafik, mola, klima, yol eğimi, yük ve otoyol ücretleri gibi değişkenleri ayrıca düşünmek sonucu daha gerçekçi hale getirir.", en: "Use your own observed average consumption and route data. Considering traffic, breaks, AC, road slope, payload, and tolls separately makes the result more realistic." }
            }
        ]
    },
    {
        id: "finansal-hesaplamalar",
        name: { tr: "Finans", en: "Finance" },
        slug: "finansal-hesaplamalar",
        icon: "BadgeDollarSign",
        description: { tr: "Faiz, kredi, KDV, kâr-zarar, enflasyon ve yatırım hesaplamaları.", en: "Interest, loan, VAT, profit-loss, inflation and investment calculations." },
        seoContent: {
            tr: "Ticari işletmeler, esnaflar ve bireysel yatırımcılar için tasarlanmış finansal hesaplama araçlarımız sayesinde vakitten tasarruf edin. KDV dahil/hariç hesaplamalar, kredi geri ödeme planları, mevduat faiz getirileri ve kâr marjı hesaplamaları en hassas formüllerle anında yapılır.",
            en: "Financial calculation tools designed for commercial businesses, shopkeepers and individual investors."
        },
        faq: [
            {
                q: { tr: "Kredi oranları gerçek zamanlı mı?", en: "Are loan rates real-time?" },
                a: { tr: "Sistemimizde güncel banka oranları yerine, sizin girdiğiniz faiz oranına göre genel ve kesin bir matematiksel ödeme planı çıkarılmaktadır.", en: "We generate a mathematical repayment plan based on the interest rate you provide." }
            }
        ]
    },
    {
        id: "ticaret-ve-is",
        name: { tr: "Ticaret & İş", en: "Trade & Business" },
        slug: "ticaret-ve-is",
        icon: "BriefcaseBusiness",
        description: { tr: "Kâr-zarar, fiyatlama, stok maliyeti, kargo ve ticari alan planlama hesaplamaları.", en: "Profit-loss, pricing, inventory cost, cargo, and commercial planning calculations." },
        seoContent: {
            tr: "Ticaret & İş kategorisi; ürün fiyatlandırma, kampanya planlama, kârlılık takibi, stok maliyeti ve e-ticaret lojistiği gibi günlük operasyon kararlarını daha hızlı vermek için tasarlandı. İndirim, zam, kâr, zarar ve ortalama maliyet araçları aynı ürünün farklı ticari açılarını görünür hale getirirken; desi, kargo, inşaat alanı ve arsa payı araçları da lojistik ve gayrimenkul tarafındaki pratik hesap ihtiyaçlarını karşılar. Bu sayfalar nihai muhasebe kaydı yerine karar öncesi kontrol ve senaryo analizi için en verimli sonucu verir.",
            en: "Trade and business calculators help with product pricing, discounts, markups, average cost and e-commerce logistics."
        },
        faq: [
            {
                q: { tr: "Bu araçlar muhasebe kaydı yerine geçer mi?", en: "Do these tools replace accounting records?" },
                a: { tr: "Hayır. Bu kategori daha çok hızlı kontrol, senaryo analizi ve fiyatlama desteği içindir. Nihai muhasebe, fatura ve vergi kayıtları için şirketinizin belgeleri ve profesyonel süreçleri esas alınmalıdır.", en: "No. This category is mainly for fast checks, scenario analysis, and pricing support. Final accounting, invoice, and tax records should be based on your business documents and professional processes." }
            },
            {
                q: { tr: "Fiyatlama ve kârlılık araçlarını birlikte kullanmak neden önemli?", en: "Why is it important to use pricing and profitability tools together?" },
                a: { tr: "Çünkü tek bir sonuç çoğu zaman yeterli olmaz. İndirim, zam, maliyet ve kâr araçlarını birlikte kullanmak; fiyat değişikliğinin marjı, stok maliyetini ve net sonucu nasıl etkilediğini daha net gösterir.", en: "Because one isolated result is often not enough. Using discount, markup, cost, and profit tools together shows more clearly how a price change affects margin, inventory cost, and the net outcome." }
            }
        ]
    },
    {
        id: "sinav-hesaplamalari",
        name: { tr: "Sınav", en: "Exams" },
        slug: "sinav-hesaplamalari",
        icon: "GraduationCap",
        description: { tr: "YKS, LGS, KPSS, ALES ve mesleki sınavlar için net, puan ve tercih planlama araçları.", en: "Net, score, and planning calculators for YKS, LGS, KPSS, ALES, and professional exams." },
        seoContent: {
            tr: "Sınav kategorisi; merkezi sınavlar, mesleki yeterlilik süreçleri ve okul başarı planları için hızlı net ve puan simülasyonları sunar. Buradaki araçların bir bölümü resmi katsayı veya yerleştirme verilerine yaklaşan hesaplar üretirken, bir bölümü ise yalnızca net bazlı ön izleme sağlar. Bu nedenle sonuçları özellikle ÖSYM, MEB, Polis Akademisi ve ilgili kurumların yayımladığı güncel kılavuzlarla birlikte yorumlamak gerekir.",
            en: "This category offers quick net and score simulations for national exams, professional qualification processes, and school planning. Some tools approximate official coefficients or placement ranges, while others provide only a net-based preview. Always interpret results together with current official guides."
        },
        faq: [
            {
                q: { tr: "Buradaki sınav sonuçları resmi sonuç belgesi yerine geçer mi?", en: "Do these results replace official score reports?" },
                a: { tr: "Hayır. Bu kategori ön izleme ve çalışma planı içindir. Nihai puan, sıralama ve yerleştirme için ilgili kurumun açıkladığı resmi sonuç belgesi esas alınmalıdır.", en: "No. These tools are for preview and planning. Final scores, rankings, and placements should be based on the official results published by the relevant institution." }
            },
            {
                q: { tr: "Neden bazı araçlarda tam puan yerine tahmini skor gösteriliyor?", en: "Why do some tools show an estimated score instead of an exact score?" },
                a: { tr: "Çünkü bazı sınavlarda puan; aday dağılımı, standart sapma veya resmi katsayı tablolarına göre hesaplanır. Bu veriler sınav sonrası kesinleştiği için araç yalnızca net bazlı güvenli bir yaklaşık sonuç gösterebilir.", en: "Because some exams are scored using candidate distribution, standard deviation, or official coefficient tables. Since those values become final only after the exam, the tool can safely show only a net-based estimate." }
            }
        ]
    },
    {
        id: "matematik-hesaplama",
        name: { tr: "Matematik", en: "Math" },
        slug: "matematik-hesaplama",
        icon: "Calculator",
        description: { tr: "Yüzde, alan, hacim, kareköklü sayılar ve temel geometri hesapları.", en: "Percentage, area, volume, square root and statistics calculations." },
        seoContent: {
            tr: "Günlük hayatta ya da iş süreçlerinde her an karşınıza çıkabilecek matematik işlemlerini saniyeler içinde çözün. İndirim hesaplamaları, alan ve hacim bulma, kesir dönüştürme gibi araçlar tamamen ücretsiz olarak elinizin altında.",
            en: "Solve math operations that you may encounter in daily life or in business processes in seconds."
        }
    },
    {
        id: "zaman-hesaplama",
        name: { tr: "Zaman & Tarih", en: "Time & Date" },
        slug: "zaman-hesaplama",
        icon: "Clock",
        description: { tr: "Yaş hesaplama, gün sayısı, iki tarih arası süre ve tarih farkı araçları.", en: "Age calculator, day count, date difference and time tools." },
        seoContent: {
            tr: "Zaman boyutunda yapacağınız yolculuklar için gerekli hesaplama araçları. İki tarih arasındaki spesifik gün, ay ve yıl farkını, kalan süreyi, yaşınızı ve hatta saat hesaplamalarını bu modülümüz aracılığıyla gerçekleştirebilirsiniz.",
            en: "Calculation tools for time differences and dates."
        }
    },
    {
        id: "yasam-hesaplama",
        name: { tr: "Yaşam", en: "Life" },
        slug: "yasam-hesaplama",
        icon: "HeartPulse",
        description: { tr: "Sağlık, Vücut Kitle İndeksi, gebelik hesaplama ve yaşam araçları.", en: "Health, condition, pregnancy and personal life calculators." },
        seoContent: {
            tr: "Vücut kitle indeksinizden, hamilelik haftanıza; kişisel sağlığınızı ve günlük yaşam kalitenizi etkileyen verilerinizi hesaplayabileceğiniz hayat kolaylaştıran araçlarımız. Girdiğiniz tıbbi veriler cihazınızda işlenir ve saklanmaz.",
            en: "Life-facilitating tools where you can calculate your data affecting your personal health."
        }
    },
    {
        id: "astroloji",
        name: { tr: "Astroloji", en: "Astrology" },
        slug: "astroloji",
        icon: "Sparkles",
        description: { tr: "Yükselen burç, güneş burcu, ay burcu ve astrolojik harita hesaplamaları.", en: "Ascendant sign, sun sign, moon sign and astrological chart calculations." },
        seoContent: {
            tr: "Doğum tarihinize, saatinize ve konumunuza göre gökyüzü haritanızı ve doğru yükselen burcunuzu tespit eden astrolojik hesaplama araçları. Günlük yaşam kalitenizi artırmak için gökyüzü rehberiniz.",
            en: "Astrological calculation tools that determine your birth chart and ascendant sign based on your birth date, time and location."
        }
    }
];

export function normalizeCategorySlug(slug: string) {
    return CATEGORY_ALIASES[slug] ?? slug;
}

export function getCategoryBySlug(slug: string): Category | undefined {
    const normalizedSlug = normalizeCategorySlug(slug);
    return mainCategories.find((category) => category.slug === normalizedSlug);
}

export function getCategoryPath(slug: string) {
    return `/kategori/${normalizeCategorySlug(slug)}`;
}

export function getCategoryName(slug: string, lang: "tr" | "en" = "tr") {
    return getCategoryBySlug(slug)?.name[lang] ?? normalizeCategorySlug(slug).replace(/-/g, " ");
}

export function isHealthCategory(slug: string) {
    return normalizeCategorySlug(slug) === "yasam-hesaplama";
}

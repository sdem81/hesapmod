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
        description: { tr: "MTV, ÖTV, yakıt maliyeti, yol maliyeti ve araç km maliyet hesaplamaları.", en: "Motor vehicle tax, special consumption tax, fuel cost and vehicle cost calculations." },
        seoContent: {
            tr: "Taşıt, motorlu taşıtlar vergisi (MTV), yakıt tüketimi ve özel tüketim vergisi (ÖTV) gibi araç sahiplerini ve araç almayı planlayanları yakından ilgilendiren hesaplamaları bu kategoride bulabilirsiniz. Aracınızla çıkacağınız uzun yollarda yakıt masrafını önceden öngörmek, yıllık vergi giderlerinizi planlamak artık çok kolay.",
            en: "Calculations related to vehicles and fuel consumption."
        }
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
        id: "sinav-hesaplamalari",
        name: { tr: "Sınav", en: "Exams" },
        slug: "sinav-hesaplamalari",
        icon: "GraduationCap",
        description: { tr: "YKS, TYT, AYT, KPSS, LGS puan ve net hesaplama araçları.", en: "YKS, TYT, AYT, KPSS score and grade calculators." },
        seoContent: {
            tr: "Öğrencilerin eğitim süreçlerinde girdikleri ulusal ve akademik sınavlara yönelik tahmini puan oranlarını hesaplayın. ÖSYM sistemine paralel olan standart sapma formüllerine en yakın algoritmalarla netlerinizi puana ve yüzdelik dilimlere dönüştürebilirsiniz.",
            en: "Calculate the estimated score ratios for national and academic exams."
        }
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

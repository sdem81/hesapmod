// Keep these timestamps explicit. Deployment environments often rewrite file mtimes,
// which makes filesystem-based lastmod signals look fresher than the real content.
const CONTENT_LAST_MODIFIED_AT = {
    calculators: "2026-03-09T12:00:00+03:00",
    categories: "2026-03-09T12:00:00+03:00",
    home: "2026-03-09T12:00:00+03:00",
    allTools: "2026-03-09T12:00:00+03:00",
    about: "2026-03-09T12:00:00+03:00",
    contact: "2026-03-09T12:00:00+03:00",
    faq: "2026-03-09T12:00:00+03:00",
    privacy: "2026-03-09T12:00:00+03:00",
    cookiePolicy: "2026-03-09T12:00:00+03:00",
    kvkk: "2026-03-09T12:00:00+03:00",
    terms: "2026-03-09T12:00:00+03:00",
    guides: "2026-03-09T12:00:00+03:00",
} as const;

const CALCULATOR_LAST_MODIFIED_OVERRIDES = {
    // Previously updated
    "dgs-puan-hesaplama": "2026-03-09T12:00:00+03:00",
    "lgs-puan-hesaplama": "2026-03-09T12:00:00+03:00",
    "yks-puan-hesaplama": "2026-03-09T12:00:00+03:00",
    "kpss-puan-hesaplama": "2026-03-09T12:00:00+03:00",
    "tyt-puan-hesaplama": "2026-03-09T12:00:00+03:00",
    "ales-puan-hesaplama": "2026-03-09T12:00:00+03:00",
    "vucut-kitle-indeksi-hesaplama": "2026-03-09T12:00:00+03:00",
    "gunluk-kalori-ihtiyaci": "2026-03-09T12:00:00+03:00",
    "ideal-kilo-hesaplama": "2026-03-09T12:00:00+03:00",
    // Batch 2 — finansal-hesaplamalar
    "basit-faiz-hesaplama": "2026-03-09T12:00:00+03:00",
    "bilesik-faiz-hesaplama": "2026-03-09T12:00:00+03:00",
    "kar-zarar-marji": "2026-03-09T12:00:00+03:00",
    "kdv-hesaplama": "2026-03-09T12:00:00+03:00",
    "kira-artis-hesaplama": "2026-03-09T12:00:00+03:00",
    "kredi-taksit-hesaplama": "2026-03-09T12:00:00+03:00",
    "altin-hesaplama": "2026-03-09T12:00:00+03:00",
    "birikim-hesaplama": "2026-03-09T12:00:00+03:00",
    "bono-hesaplama": "2026-03-09T12:00:00+03:00",
    "doviz-hesaplama": "2026-03-09T12:00:00+03:00",
    // Batch 3 — finansal-hesaplamalar devam
    "eurobond-hesaplama": "2026-03-09T12:00:00+03:00",
    "eurobond-getiri-hesaplama": "2026-03-09T12:00:00+03:00",
    "iban-dogrulama": "2026-03-09T12:00:00+03:00",
    "ic-verim-orani-hesaplama": "2026-03-09T12:00:00+03:00",
    "ihtiyac-kredisi-hesaplama": "2026-03-09T12:00:00+03:00",
    "is-yeri-ve-ticari-kredi-hesaplama": "2026-03-09T12:00:00+03:00",
    "iskonto-hesaplama": "2026-03-09T12:00:00+03:00",
    "kira-mi-konut-kredisi-mi-hesaplama": "2026-03-09T12:00:00+03:00",
    "konut-kredisi-hesaplama": "2026-03-09T12:00:00+03:00",
    "kredi-dosya-masrafi-hesaplama": "2026-03-09T12:00:00+03:00",
    "kredi-erken-kapama-hesaplama": "2026-03-09T12:00:00+03:00",
    // Batch 4 — kredi kart + finans sonu
    "kredi-karsilastirma-hesaplama": "2026-03-09T12:00:00+03:00",
    "kredi-karti-asgari-odeme": "2026-03-09T12:00:00+03:00",
    "kredi-karti-asgari-odeme-tutari-hesaplama": "2026-03-09T12:00:00+03:00",
    "kredi-karti-ek-taksit-hesaplama": "2026-03-09T12:00:00+03:00",
    "kredi-karti-gecikme-faizi-hesaplama": "2026-03-09T12:00:00+03:00",
    "kredi-karti-islem-taksitlendirme-hesaplama": "2026-03-09T12:00:00+03:00",
    "kredi-yapilandirma-hesaplama": "2026-03-09T12:00:00+03:00",
    "kredi-yillik-maliyet-orani-hesaplama": "2026-03-09T12:00:00+03:00",
    "ne-kadar-kredi-alabilirim-hesaplama": "2026-03-09T12:00:00+03:00",
    "net-bugunku-deger-hesaplama": "2026-03-09T12:00:00+03:00",
    // Batch 5 — maas-ve-vergi
    "asgari-ucret-hesaplama": "2026-03-09T12:00:00+03:00",
    "damga-vergisi-hesaplama": "2026-03-09T12:00:00+03:00",
    "deger-artis-kazanci-vergisi": "2026-03-09T12:00:00+03:00",
    "degerli-konut-vergisi-hesaplama": "2026-03-09T12:00:00+03:00",
    "emlak-vergisi-hesaplama": "2026-03-09T12:00:00+03:00",
    "gelir-vergisi-hesaplama": "2026-03-09T12:00:00+03:00",
    "gumruk-vergisi-hesaplama": "2026-03-09T12:00:00+03:00",
    "harcirah-yolluk-hesaplama": "2026-03-09T12:00:00+03:00",
    "kambiyo-vergisi-hesaplama": "2026-03-09T12:00:00+03:00",
    "kdv-tevkifati-hesaplama": "2026-03-09T12:00:00+03:00",
    // Batch 6 — maas-ve-vergi devam + tasit-ve-vergi
    "kira-stopaj-hesaplama": "2026-03-09T12:00:00+03:00",
    "kira-vergisi-hesaplama": "2026-03-09T12:00:00+03:00",
    "konaklama-vergisi-hesaplama": "2026-03-09T12:00:00+03:00",
    "kurumlar-vergisi-hesaplama": "2026-03-09T12:00:00+03:00",
    "maas-hesaplama": "2026-03-09T12:00:00+03:00",
    "veraset-intikal-vergisi-hesaplama": "2026-03-09T12:00:00+03:00",
    "vergi-gecikme-faizi-hesaplama": "2026-03-09T12:00:00+03:00",
    "mtv-hesaplama": "2026-03-09T12:00:00+03:00",
    "otv-hesaplama": "2026-03-09T12:00:00+03:00",
    "yakit-tuketim-maliyet": "2026-03-09T12:00:00+03:00",
    // Batch 7 — yasam-hesaplama 1
    "asi-takvimi-hesaplama": "2026-03-09T12:00:00+03:00",
    "bazal-metabolizma-hizi-hesaplama": "2026-03-09T12:00:00+03:00",
    "bebek-boyu-hesaplama": "2026-03-09T12:00:00+03:00",
    "bebek-kilosu-hesaplama": "2026-03-09T12:00:00+03:00",
    "bel-kalca-orani-hesaplama": "2026-03-09T12:00:00+03:00",
    "dogum-izni-hesaplama": "2026-03-09T12:00:00+03:00",
    "dogum-tarihi-hesaplama": "2026-03-09T12:00:00+03:00",
    "ebced-hesaplama": "2026-03-09T12:00:00+03:00",
    "gebelik-hesaplama": "2026-03-09T12:00:00+03:00",
    // Batch 8 — yasam-hesaplama 2
    "gunluk-karbonhidrat-ihtiyaci-hesaplama": "2026-03-09T12:00:00+03:00",
    "gunluk-kreatin-dozu-hesaplama": "2026-03-09T12:00:00+03:00",
    "gunluk-makro-besin-ihtiyaci-hesaplama": "2026-03-09T12:00:00+03:00",
    "gunluk-protein-ihtiyaci-hesaplama": "2026-03-09T12:00:00+03:00",
    "gunluk-su-ihtiyaci-hesaplama": "2026-03-09T12:00:00+03:00",
    "gunluk-yag-ihtiyaci-hesaplama": "2026-03-09T12:00:00+03:00",
    "hamilelik-haftasi-hesaplama": "2026-03-09T12:00:00+03:00",
    "vucut-yag-orani-hesaplama": "2026-03-09T12:00:00+03:00",
    // Batch 9 — sinav-hesaplamalari
    "ags-puan-hesaplama": "2026-03-09T12:00:00+03:00",
    "aks-puan-hesaplama": "2026-03-09T12:00:00+03:00",
    "dib-mbsts-puan-hesaplama": "2026-03-09T12:00:00+03:00",
    "dus-puan-hesaplama": "2026-03-09T12:00:00+03:00",
    "ehliyet-sinav-puan-hesaplama": "2026-03-09T12:00:00+03:00",
    "ekpss-puan-hesaplama": "2026-03-09T12:00:00+03:00",
    "eus-puan-hesaplama": "2026-03-09T12:00:00+03:00",
    "hakim-savci-yrd-puan-hesaplama": "2026-03-09T12:00:00+03:00",
    "dgs-taban-puanlari": "2026-03-09T12:00:00+03:00",
    // Batch 10 — zaman, matematik, ticaret
    "birim-donusturucu": "2026-03-09T12:00:00+03:00",
    "iki-tarih-arasi-fark-gun-hesaplama": "2026-03-09T12:00:00+03:00",
    "daire-alan-cevre": "2026-03-09T12:00:00+03:00",
    "dikdortgen-alan-cevre": "2026-03-09T12:00:00+03:00",
    "ortalama-hesaplama": "2026-03-09T12:00:00+03:00",
    "kar-hesaplama": "2026-03-09T12:00:00+03:00",
    "indirim-hesaplama": "2026-03-09T12:00:00+03:00",
} as const;

export function getLatestDate(...dates: Date[]) {
    return new Date(Math.max(...dates.map((date) => date.getTime())));
}

export function formatDateLabel(date: Date | string, locale = "tr-TR") {
    return new Date(date).toLocaleDateString(locale, {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "Europe/Istanbul",
    });
}

export const CALCULATOR_CONTENT_LAST_MODIFIED = new Date(CONTENT_LAST_MODIFIED_AT.calculators);
export const CATEGORY_CONTENT_LAST_MODIFIED = new Date(CONTENT_LAST_MODIFIED_AT.categories);
export const HOME_PAGE_LAST_MODIFIED = new Date(CONTENT_LAST_MODIFIED_AT.home);
export const ALL_TOOLS_PAGE_LAST_MODIFIED = new Date(CONTENT_LAST_MODIFIED_AT.allTools);
export const ABOUT_PAGE_LAST_MODIFIED = new Date(CONTENT_LAST_MODIFIED_AT.about);
export const CONTACT_PAGE_LAST_MODIFIED = new Date(CONTENT_LAST_MODIFIED_AT.contact);
export const FAQ_PAGE_LAST_MODIFIED = new Date(CONTENT_LAST_MODIFIED_AT.faq);
export const PRIVACY_PAGE_LAST_MODIFIED = new Date(CONTENT_LAST_MODIFIED_AT.privacy);
export const COOKIE_POLICY_LAST_MODIFIED = new Date(CONTENT_LAST_MODIFIED_AT.cookiePolicy);
export const KVKK_PAGE_LAST_MODIFIED = new Date(CONTENT_LAST_MODIFIED_AT.kvkk);
export const TERMS_PAGE_LAST_MODIFIED = new Date(CONTENT_LAST_MODIFIED_AT.terms);
export const GUIDES_PAGE_LAST_MODIFIED = new Date(CONTENT_LAST_MODIFIED_AT.guides);

const calculatorLastModifiedBySlug = new Map<string, Date>(
    Object.entries(CALCULATOR_LAST_MODIFIED_OVERRIDES).map(([slug, date]) => [slug, new Date(date)])
);

export function getCalculatorLastModified(slug: string) {
    return calculatorLastModifiedBySlug.get(slug) ?? CALCULATOR_CONTENT_LAST_MODIFIED;
}

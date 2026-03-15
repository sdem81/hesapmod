import { CONTACT_FORM_PATH } from "./contact";
import { formatDateLabel, getCalculatorLastModified } from "./content-last-modified";
import { normalizeCategorySlug } from "./categories";
import { SITE_EDITOR_NAME } from "./site";

export type CalculatorTrustSource = {
    label: string;
    href?: string;
    note: string;
};

type CalculatorTrustEntry = {
    methodology: string;
    note?: string;
    sources: CalculatorTrustSource[];
};

const categoryTrustContent: Record<string, CalculatorTrustEntry> = {
    "maas-ve-vergi": {
        methodology:
            "Bu kategorideki araçlar, yürürlükteki vergi ve sosyal güvenlik kuralları esas alınarak editoryal olarak gözden geçirilir. Oran, istisna ve tavan gerektiren alanlarda resmi kurum duyuruları ile mevzuat değişiklikleri izlenir.",
        sources: [
            { label: "Gelir İdaresi Başkanlığı", href: "https://www.gib.gov.tr/", note: "vergi dilimleri, istisnalar ve tebliğler" },
            { label: "Sosyal Güvenlik Kurumu", href: "https://www.sgk.gov.tr/", note: "prim oranları ve sosyal güvenlik uygulamaları" },
            { label: "Resmi Gazete", href: "https://www.resmigazete.gov.tr/", note: "kanun, tebliğ ve resmi kararlar" },
            { label: "TÜİK", href: "https://www.tuik.gov.tr/", note: "endeks ve resmi istatistik verileri" },
        ],
    },
    "tasit-ve-vergi": {
        methodology:
            "Vergi ve maliyet odaklı taşıt araçlarında resmi vergi düzenlemeleri, yeniden değerleme mantığı ve kullanıcı girdileri birlikte kullanılır. Sonuçlar karar desteği içindir; resmi tahakkuk belgesinin yerine geçmez.",
        sources: [
            { label: "Gelir İdaresi Başkanlığı", href: "https://www.gib.gov.tr/", note: "vergisel uygulamalar ve beyan çerçevesi" },
            { label: "Resmi Gazete", href: "https://www.resmigazete.gov.tr/", note: "oran ve mevzuat değişiklikleri" },
            { label: "TÜİK", href: "https://www.tuik.gov.tr/", note: "endeks ve resmi veri referansları" },
        ],
    },
    "finansal-hesaplamalar": {
        methodology:
            "Finans araçlarında kullanılan hesaplar matematiksel formüller, kullanıcı girdileri ve gerektiğinde resmi ekonomik veri kaynakları üzerinden kurulmuştur. Kur, kıymetli maden, vergi ve enflasyon referansları editoryal olarak gözden geçirilir; sonuçlar banka teklifi, yatırım tavsiyesi veya resmi fiyat teyidi yerine geçmez.",
        sources: [
            { label: "TCMB", href: "https://www.tcmb.gov.tr/", note: "kur, para politikası ve ekonomik veri referansları" },
            { label: "Borsa İstanbul Kıymetli Madenler Piyasası", href: "https://www.borsaistanbul.com/", note: "altın ve kıymetli maden piyasası yapısı için referans çerçeve" },
            { label: "Gelir İdaresi Başkanlığı", href: "https://www.gib.gov.tr/", note: "vergi ve stopaj uygulamaları" },
            { label: "Resmi Gazete", href: "https://www.resmigazete.gov.tr/", note: "mevzuat ve oran değişiklikleri" },
            { label: "TÜİK", href: "https://www.tuik.gov.tr/", note: "enflasyon ve resmi istatistik verileri" },
        ],
    },
    "ticaret-ve-is": {
        methodology:
            "Ticaret ve iş araçları, fiyatlama ve maliyet mantığını pratik kullanım için sadeleştirir. Hesaplar işlem öncesi kontrol içindir; sözleşme, muhasebe veya mevzuat danışmanlığının yerini almaz.",
        sources: [
            { label: "Gelir İdaresi Başkanlığı", href: "https://www.gib.gov.tr/", note: "vergisel uygulama ve tanımlar" },
            { label: "Resmi Gazete", href: "https://www.resmigazete.gov.tr/", note: "yasal oran ve düzenlemeler" },
            { label: "Türk Standardları Enstitüsü", href: "https://www.tse.org.tr/", note: "ölçü, standart ve teknik referans yaklaşımı" },
        ],
    },
    "sinav-hesaplamalari": {
        methodology:
            "Sınav araçları, ilgili sınav sistemlerinin puanlama mantığını yaklaşık veya doğrulanmış katsayı setleriyle modellemeye çalışır. Nihai sonuç belgesi her zaman ilgili kurum tarafından yayımlanan resmi sonuçtur.",
        sources: [
            { label: "ÖSYM", href: "https://www.osym.gov.tr/", note: "kılavuz, katsayı ve sınav açıklamaları" },
            { label: "Milli Eğitim Bakanlığı", href: "https://www.meb.gov.tr/", note: "ortaöğretim ve okul yerleştirme referansları" },
            { label: "Resmi Gazete", href: "https://www.resmigazete.gov.tr/", note: "sınav sistemiyle ilişkili düzenlemeler" },
        ],
        note:
            "Bu kategoride bazı araçlar simülasyon üretir. Resmi katsayı veya yerleştirme kuralları değiştiğinde nihai otorite ilgili sınav kurumudur.",
    },
    "matematik-hesaplama": {
        methodology:
            "Matematik araçları yerleşik formüller, temel geometri ve cebir kuralları üzerinden çalışır. Bu kategori mevzuat değil, standart matematiksel doğruluk hedefler.",
        sources: [
            { label: "Milli Eğitim Bakanlığı", href: "https://www.meb.gov.tr/", note: "temel öğretim ve müfredat referans çerçevesi" },
            { label: "Yerleşik matematiksel formüller", note: "geometri, yüzde, oran ve temel cebir kuralları" },
        ],
    },
    "zaman-hesaplama": {
        methodology:
            "Zaman hesaplayıcıları takvim, tarih farkı, hafta ve gün mantığını algoritmik olarak hesaplar. Dini takvim veya resmi tarih içeren araçlarda ilgili kurumların yayımladığı referanslar takip edilir.",
        sources: [
            { label: "Resmi Gazete", href: "https://www.resmigazete.gov.tr/", note: "resmi tarih ve mevzuat düzenlemeleri" },
            { label: "Diyanet İşleri Başkanlığı", href: "https://www.diyanet.gov.tr/", note: "dini takvim ve vakit referansları" },
            { label: "Takvim ve tarih hesap kuralları", note: "gregoryen takvim, artık yıl ve gün farkı mantığı" },
        ],
    },
    "yasam-hesaplama": {
        methodology:
            "Yaşam ve sağlık araçları genel bilgilendirme amaçlıdır. Formüller uluslararası sağlık referansları, kullanıcı girdileri ve gerektiğinde resmi kurum yaklaşımıyla modellenir; tanı veya tedavi amacıyla kullanılmamalıdır.",
        sources: [
            { label: "T.C. Sağlık Bakanlığı", href: "https://www.saglik.gov.tr/", note: "ulusal sağlık rehberleri ve kamu bilgileri" },
            { label: "World Health Organization", href: "https://www.who.int/en/news-room/fact-sheets/detail/obesity-and-overweight", note: "özellikle BMI ve sağlık göstergeleri için referans yaklaşım" },
            { label: "Sosyal Güvenlik Kurumu", href: "https://www.sgk.gov.tr/", note: "sağlık uygulamalarıyla ilişkili kamu çerçevesi" },
        ],
        note:
            "Sağlık araçları tıbbi değerlendirme yerine geçmez. Belirti, tanı veya tedavi kararı için hekim görüşü gerekir.",
    },
    astroloji: {
        methodology:
            "Astroloji araçları doğum tarihi, saat ve konum girdileri üzerinden yorumlayıcı hesap üretir. Bu kategori bilimsel ölçüm veya sağlık/finans tavsiyesi sunmaz.",
        sources: [
            { label: "Doğum tarihi ve saat girdileri", note: "kullanıcının verdiği tarih, saat ve konum bilgileri" },
            { label: "Standart astrolojik hesap mantığı", note: "burç, yükselen ve zaman bazlı yorumlayıcı model" },
            { label: "Takvim ve zaman hesapları", note: "gün, ay, saat ve konum farkı hesapları" },
        ],
        note:
            "Astroloji sonuçları yorumlayıcıdır; bilimsel, tıbbi veya finansal karar dayanağı olarak kullanılmamalıdır.",
    },
};

export function getCalculatorTrustInfo(slug: string, category: string) {
    const normalizedCategory = normalizeCategorySlug(category);
    const trustContent = categoryTrustContent[normalizedCategory] ?? {
        methodology:
            "Bu sayfa, ilgili kategorinin hesaplama mantığı ve kullanıcı girdileri temel alınarak editoryal olarak gözden geçirilmiştir.",
        sources: [{ label: "Kategoriye uygun editoryal referanslar", note: "mevzuat, resmi veri veya yerleşik formüller" }],
    };
    const reviewedAt = getCalculatorLastModified(slug);

    return {
        editorName: SITE_EDITOR_NAME,
        editorHref: "/hakkimizda",
        feedbackHref: CONTACT_FORM_PATH,
        reviewedAt,
        reviewedLabel: formatDateLabel(reviewedAt),
        ...trustContent,
    };
}

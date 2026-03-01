import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sıkça Sorulan Sorular",
    description: "HesapMod hakkında sıkça sorulan sorular — hesap makineleri nasıl çalışır, veriler güvende mi, formüller nereden geliyor?",
    alternates: { canonical: "/sss" },
};

const faqs = [
    {
        category: "Genel",
        items: [
            {
                q: "HesapMod ücretsiz mi?",
                a: "Evet, HesapMod'daki tüm hesap makineleri tamamen ücretsizdir. Kayıt veya üyelik gerekmez.",
            },
            {
                q: "Mobil cihazlarda çalışıyor mu?",
                a: "Evet. HesapMod tüm mobil tarayıcılarda (Chrome, Safari, Firefox) ve ekran boyutlarında sorunsuz çalışır.",
            },
            {
                q: "Bir hesap makinesini nasıl önerebilirim?",
                a: "İletişim sayfamızdaki formu kullanarak yeni araç önerisi gönderebilirsiniz. En çok talep edilen araçlar önceliklendirilir.",
            },
        ],
    },
    {
        category: "Gizlilik ve Güvenlik",
        items: [
            {
                q: "Girdiğim veriler sunucularınıza gönderiliyor mu?",
                a: "Hayır. Tüm hesaplamalar yalnızca tarayıcınızda (istemci tarafında) gerçekleşir. Hesap makinelerine girdiğiniz hiçbir değer sunucularımıza iletilmez veya saklanmaz.",
            },
            {
                q: "Sağlık verilerim (boy, kilo, yaş) kaydediliyor mu?",
                a: "Kesinlikle hayır. VKİ, kalori ve ideal kilo gibi sağlık hesaplayıcılarına girilen tüm veriler yalnızca o an için tarayıcınızda işlenir; sayfa kapatıldığında silinir.",
            },
            {
                q: "Çerezleri kabul etmem zorunlu mu?",
                a: "Zorunlu çerezler (tema tercihi gibi) istemsiz olarak kullanılır. Analitik ve reklam çerezleri ise isteğe bağlıdır; banner üzerinden reddedebilirsiniz.",
            },
        ],
    },
    {
        category: "Hesaplama Doğruluğu",
        items: [
            {
                q: "Formüller ne kadar güvenilir?",
                a: "Tüm formüller; TC mevzuatı, WHO standartları ve akademik kaynaklar baz alınarak hazırlanmıştır. Her hesap makinesinde kullanılan formül ve kaynaklar sayfada açıkça gösterilmektedir.",
            },
            {
                q: "Sağlık hesaplayıcıları tıbbi tavsiye niteliği taşıyor mu?",
                a: "Hayır. VKİ, kalori ve ideal kilo gibi sağlık araçları yalnızca genel bilgi ve farkındalık amaçlıdır. Tıbbi karar için mutlaka bir sağlık uzmanına başvurun.",
            },
            {
                q: "Kira artış hesaplayıcısı en güncel TÜFE/ÜFE verilerini kullanıyor mu?",
                a: "Kira artış oranı girişi size bırakılmıştır; TÜİK'in açıkladığı güncel oranı siz girersiniz. Bu sayede veriler her zaman güncel kalır ve manuel güncelleme beklentisi oluşmaz.",
            },
        ],
    },
    {
        category: "Teknik",
        items: [
            {
                q: "Hangi tarayıcılar destekleniyor?",
                a: "Chrome 90+, Firefox 88+, Safari 14+, Edge 90+ ve bu tarayıcıların mobil sürümleriyle tam uyumludur.",
            },
            {
                q: "Çevrimdışı çalışıyor mu?",
                a: "Şu anda çevrimdışı (offline) mod desteklenmemektedir. Hesaplamalar için aktif internet bağlantısı gereklidir.",
            },
            {
                q: "API sunuyor musunuz?",
                a: "Henüz kamuya açık bir API sunulmamaktadır. Bu özellik yol haritamızda yer almaktadır. Bildirim almak için iletişim formunu kullanabilirsiniz.",
            },
        ],
    },
];

export default function SSSPage() {
    return (
        <div className="container mx-auto px-4 py-16 max-w-4xl">
            <div className="mb-12">
                <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">SSS</span>
                <h1 className="text-4xl font-extrabold tracking-tight mt-4 mb-4">Sıkça Sorulan Sorular</h1>
                <p className="text-xl text-muted-foreground">
                    Aklınızdaki sorunun cevabını bulamazsanız{" "}
                    <a href="/iletisim" className="text-primary hover:underline">bizimle iletişime geçin</a>.
                </p>
            </div>

            <div className="space-y-12">
                {faqs.map((section) => (
                    <section key={section.category}>
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">
                                {section.category[0]}
                            </span>
                            {section.category}
                        </h2>
                        <div className="space-y-4">
                            {section.items.map((item, idx) => (
                                <details
                                    key={idx}
                                    className="group bg-card border rounded-2xl overflow-hidden"
                                >
                                    <summary className="flex items-center justify-between p-6 cursor-pointer font-semibold hover:text-primary transition-colors list-none">
                                        <span>{item.q}</span>
                                        <span className="ml-4 text-muted-foreground group-open:rotate-180 transition-transform text-xl">⌄</span>
                                    </summary>
                                    <div className="px-6 pb-6 text-muted-foreground leading-relaxed border-t pt-4">
                                        {item.a}
                                    </div>
                                </details>
                            ))}
                        </div>
                    </section>
                ))}
            </div>

            <div className="mt-16 bg-primary/5 border border-primary/20 rounded-3xl p-8 text-center">
                <h2 className="text-xl font-bold mb-2">Sorunuzu bulamadınız mı?</h2>
                <p className="text-muted-foreground mb-6">1-2 iş günü içinde yanıt veriyoruz.</p>
                <a
                    href="/iletisim"
                    className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-bold px-8 py-3 rounded-2xl hover:opacity-90 transition-opacity"
                >
                    İletişime Geç →
                </a>
            </div>
        </div>
    );
}

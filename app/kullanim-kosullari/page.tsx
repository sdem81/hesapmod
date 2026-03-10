import { Metadata } from "next";
import Script from "next/script";
import { CONTACT_FORM_PATH } from "@/lib/contact";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
    title: "Kullanım Koşulları",
    description: "HesapMod kullanım koşulları — platformu kullanırken geçerli kurallar, sorumluluk sınırlamaları ve fikri mülkiyet hakları.",
    alternates: { canonical: "/kullanim-kosullari" },
    robots: { index: true, follow: true },
};

const pageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Kullanım Koşulları — HesapMod",
    url: `${SITE_URL}/kullanim-kosullari`,
    inLanguage: "tr-TR",
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
    breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: [
            { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: SITE_URL },
            { "@type": "ListItem", position: 2, name: "Kullanım Koşulları", item: `${SITE_URL}/kullanim-kosullari` },
        ],
    },
};

export default function KullanimKosullariPage() {
    return (
        <>
            <Script id="kullanim-schema" type="application/ld+json" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }} />
        <div className="container mx-auto px-4 py-16 max-w-4xl">
            <div className="mb-12">
                <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">Yasal Belgeler</span>
                <h1 className="text-4xl font-extrabold tracking-tight mt-4 mb-4">Kullanım Koşulları</h1>
                <p className="text-muted-foreground">Son güncelleme: Şubat 2026 · Siteyi kullanarak bu koşulları kabul etmiş sayılırsınız.</p>
            </div>

            <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">

                <section>
                    <h2>1. Hizmetin Tanımı</h2>
                    <p>
                        HesapMod (<strong>hesapmod.com</strong>), finans, sağlık, matematik ve günlük yaşam
                        kategorilerinde ücretsiz online hesaplama araçları sunan bir web platformudur.
                        Platform; kullanıcı kaydı, abonelik veya ödeme gerektirmeksizin erişilebilir.
                    </p>
                </section>

                <section>
                    <h2>2. Kabul Edilen Kullanım</h2>
                    <p>Platformu kullanırken aşağıdakileri kabul edersiniz:</p>
                    <ul>
                        <li>Sisteme zarar verecek, güvenliği tehlikeye atacak eylemlerden kaçınmak.</li>
                        <li>Otomatik araçlarla (bot, scraper) aşırı istek göndermemek.</li>
                        <li>İçerikleri kaynak göstermeksizin ticari amaçla kopyalamamak.</li>
                        <li>Yasal olmayan amaçlarla kullanmamak.</li>
                    </ul>
                </section>

                <section>
                    <h2>3. Sorumluluk Sınırlaması</h2>
                    <div className="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-900/40 rounded-2xl p-6 not-prose">
                        <p className="text-sm font-semibold mb-2">⚠️ Önemli Uyarı</p>
                        <p className="text-sm text-muted-foreground">
                            HesapMod'daki hesaplama araçları yalnızca <strong>bilgilendirme</strong> amaçlıdır.
                            Sağlık, finans veya yasal kararlarınızda yalnızca bu araçlara dayanmamanızı tavsiye ederiz.
                            Platformdan elde edilen hesaplama sonuçlarının kullanımından doğan doğrudan veya dolaylı
                            zararlardan HesapMod sorumlu tutulamaz.
                        </p>
                    </div>
                    <ul>
                        <li><strong>Sağlık hesaplayıcıları:</strong> Tıbbi tavsiye değildir; doktorunuza danışın.</li>
                        <li><strong>Finans hesaplayıcıları:</strong> Yatırım tavsiyesi değildir; profesyonel danışmanlık alın.</li>
                        <li><strong>Vergi ve hukuki hesaplamalar:</strong> Güncel mevzuatı kontrol edin; yetkiliye danışın.</li>
                    </ul>
                </section>

                <section>
                    <h2>4. Fikri Mülkiyet</h2>
                    <p>
                        Platform üzerindeki tüm yazı, grafik, kod ve tasarımlar HesapMod'a aittir ve Türk
                        Fikir ve Sanat Eserleri Kanunu ile uluslararası telif hukuku kapsamında korunmaktadır.
                        İzin alınmaksızın ticari amaçla çoğaltılamaz, dağıtılamaz veya türev eser oluşturulamaz.
                    </p>
                    <p>
                        Kaynak göstererek (hesapmod.com linki ile) kişisel blog veya eğitim amaçlı paylaşım serbesttir.
                    </p>
                </section>

                <section>
                    <h2>5. Üçüncü Taraf Bağlantıları</h2>
                    <p>
                        Platform bazı dış kaynak bağlantıları içerebilir. Bu bağlantıların içeriğinden
                        HesapMod sorumlu değildir.
                    </p>
                </section>

                <section>
                    <h2>6. Hizmet Değişiklikleri</h2>
                    <p>
                        HesapMod, önceden bildirimde bulunmaksızın hizmetin içeriğini, araçlarını veya
                        erişim koşullarını değiştirme hakkını saklı tutar.
                    </p>
                </section>

                <section>
                    <h2>7. Uygulanacak Hukuk</h2>
                    <p>
                        Bu koşullar Türkiye Cumhuriyeti hukukuna tabidir. Uyuşmazlıklarda İstanbul
                        Mahkemeleri ve İcra Daireleri yetkilidir.
                    </p>
                </section>

                <section>
                    <h2>8. İletişim</h2>
                    <p>
                        Kullanım koşullarıyla ilgili sorularınız için <a href={CONTACT_FORM_PATH}>İletişim</a> sayfamızdaki formu kullanabilirsiniz.
                    </p>
                </section>

            </div>

            <div className="mt-12 flex gap-4 flex-wrap">
                <a href="/gizlilik-politikasi" className="text-sm text-primary hover:underline">→ Gizlilik Politikası</a>
                <a href="/cerez-politikasi" className="text-sm text-primary hover:underline">→ Çerez Politikası</a>
                <a href="/kvkk" className="text-sm text-primary hover:underline">→ KVKK Aydınlatma Metni</a>
            </div>
        </div>
        </>
    );
}

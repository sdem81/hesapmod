import { Metadata } from "next";
import Script from "next/script";
import { CONTACT_FORM_PATH, CONTACT_RESPONSE_SLA } from "@/lib/contact";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
    title: "KVKK Aydınlatma Metni",
    description: "HesapMod KVKK aydınlatma metni — 6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında kişisel verilerinizin işlenmesi hakkında bilgi.",
    alternates: { canonical: "/kvkk" },
    robots: { index: true, follow: true },
};

const pageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "KVKK Aydınlatma Metni — HesapMod",
    url: `${SITE_URL}/kvkk`,
    inLanguage: "tr-TR",
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
    breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: [
            { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: SITE_URL },
            { "@type": "ListItem", position: 2, name: "KVKK Aydınlatma Metni", item: `${SITE_URL}/kvkk` },
        ],
    },
};

export default function KVKKPage() {
    return (
        <>
            <Script id="kvkk-schema" type="application/ld+json" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }} />
        <div className="container mx-auto px-4 py-16 max-w-4xl">
            <div className="mb-12">
                <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">Yasal Belgeler</span>
                <h1 className="text-4xl font-extrabold tracking-tight mt-4 mb-4">KVKK Aydınlatma Metni</h1>
                <p className="text-muted-foreground">
                    6698 Sayılı Kişisel Verilerin Korunması Kanunu'nun 10. maddesi gereğince hazırlanmıştır.
                    Son güncelleme: Şubat 2026
                </p>
            </div>

            <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">

                <section>
                    <h2>Veri Sorumlusu</h2>
                    <p>
                        <strong>HesapMod</strong> olarak, kişisel verileriniz 6698 sayılı Kişisel Verilerin Korunması
                        Kanunu ("<strong>KVKK</strong>") çerçevesinde, veri sorumlusu sıfatıyla aşağıda açıklanan
                        kapsamda işlenmektedir.
                    </p>
                </section>

                <section>
                    <h2>İşlenen Kişisel Veriler ve İşleme Amaçları</h2>
                    <table>
                        <thead>
                            <tr><th>Veri Kategorisi</th><th>Veriler</th><th>İşleme Amacı</th><th>Hukuki Sebep</th></tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>İletişim</td>
                                <td>Ad, soyad, e-posta</td>
                                <td>İletişim taleplerine yanıt verme</td>
                                <td>Sözleşmenin ifası (m.5/2-c)</td>
                            </tr>
                            <tr>
                                <td>Kullanım verileri</td>
                                <td>IP, tarayıcı, ziyaret süresi</td>
                                <td>Platform güvenliği, hizmet iyileştirme</td>
                                <td>Meşru menfaat (m.5/2-f)</td>
                            </tr>
                            <tr>
                                <td>Çerez verileri</td>
                                <td>Analitik ve reklam çerezleri</td>
                                <td>İstatistik, kişiselleştirme</td>
                                <td>Açık rıza (m.5/1)</td>
                            </tr>
                        </tbody>
                    </table>
                </section>

                <section>
                    <h2>Kişisel Verilerin Aktarılması</h2>
                    <p>
                        Kişisel verileriniz; yurt içinde hosting ve altyapı sağlayıcılarına, yurt dışında ise
                        Google LLC (analitik ve reklam hizmetleri) ile Vercel Inc. (hosting) gibi hizmet sağlayıcılara
                        KVKK'nın 8. ve 9. maddeleri kapsamında aktarılabilmektedir. Yurt dışı aktarımlar
                        Standart Sözleşme Maddeleri güvencesiyle gerçekleştirilmektedir.
                    </p>
                </section>

                <section>
                    <h2>Kişisel Verilerin Toplanma Yöntemi</h2>
                    <p>
                        Verileriniz; web sitemizi ziyaret etmeniz, iletişim formunu doldurmanız veya tarayıcınızın
                        çerezlere izin vermesi yoluyla otomatik ve elektronik ortamda toplanmaktadır.
                    </p>
                </section>

                <section>
                    <h2>KVKK Madde 11 Kapsamında Haklarınız</h2>
                    <p>Veri sahibi olarak aşağıdaki haklara sahipsiniz:</p>
                    <ul>
                        <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme,</li>
                        <li>İşlenmişse buna ilişkin bilgi talep etme,</li>
                        <li>İşlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme,</li>
                        <li>Yurt içinde veya yurt dışında kişisel verilerin aktarıldığı üçüncü kişileri bilme,</li>
                        <li>Eksik veya yanlış işlenmiş olması hâlinde bunların düzeltilmesini isteme,</li>
                        <li>Yasal şartlar dahilinde kişisel verilerin silinmesini veya yok edilmesini isteme,</li>
                        <li>İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme,</li>
                        <li>Kanuna aykırı işlenmesi sebebiyle zarara uğramanız hâlinde zararın giderilmesini talep etme.</li>
                    </ul>
                </section>

                <section>
                    <h2>Başvuru Yolu</h2>
                    <p>
                        Haklarınıza ilişkin taleplerinizi <a href={CONTACT_FORM_PATH}>İletişim</a> sayfamızdaki formu kullanarak iletebilirsiniz.
                        Talepler, KVKK'nın 13. maddesi uyarınca en geç <strong>30 (otuz) gün</strong> içinde yanıtlanacaktır. İlk geri dönüş hedefimiz <strong>{CONTACT_RESPONSE_SLA}</strong> düzeyindedir.
                    </p>
                </section>

            </div>

            <div className="mt-12 flex gap-4 flex-wrap">
                <a href="/gizlilik-politikasi" className="text-sm text-primary hover:underline">→ Gizlilik Politikası</a>
                <a href="/cerez-politikasi" className="text-sm text-primary hover:underline">→ Çerez Politikası</a>
            </div>
        </div>
        </>
    );
}

import { Metadata } from "next";
import Script from "next/script";
import { CONTACT_FORM_PATH } from "@/lib/contact";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
    title: "Çerez Politikası",
    description: "HesapMod çerez politikası — hangi çerezlerin kullanıldığı, amaçları ve nasıl yönetebileceğiniz hakkında bilgi.",
    alternates: { canonical: "/cerez-politikasi" },
    robots: { index: true, follow: true },
};

const pageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Çerez Politikası — HesapMod",
    url: `${SITE_URL}/cerez-politikasi`,
    inLanguage: "tr-TR",
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
    breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: [
            { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: SITE_URL },
            { "@type": "ListItem", position: 2, name: "Çerez Politikası", item: `${SITE_URL}/cerez-politikasi` },
        ],
    },
};

export default function CerezPolitikasi() {
    return (
        <div className="container mx-auto px-4 py-16 max-w-4xl">
            <Script id="cerez-schema" type="application/ld+json" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }} />
            <div className="mb-12">
                <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">Yasal Belgeler</span>
                <h1 className="text-4xl font-extrabold tracking-tight mt-4 mb-4">Çerez Politikası</h1>
                <p className="text-muted-foreground">Son güncelleme: Şubat 2026</p>
            </div>

            <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">

                <section>
                    <h2>1. Çerez Nedir?</h2>
                    <p>
                        Çerezler (cookies), web siteleri tarafından tarayıcınıza kaydedilen küçük metin dosyalarıdır.
                        Buna ek olarak bazı tercih verileri tarayıcıların yerel depolama alanında (localStorage) tutulabilir.
                        Oturum bilgisi, tercihler ve analitik veriler gibi bilgileri geçici veya kalıcı olarak saklamak için kullanılırlar.
                    </p>
                </section>

                <section>
                    <h2>2. Kullandığımız Çerez Türleri</h2>
                    <table>
                        <thead>
                            <tr><th>Çerez Türü</th><th>Amaç</th><th>Süre</th><th>Zorunlu?</th></tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><strong>Zorunlu Çerezler</strong></td>
                                <td>Sitenin temel işlevselliği (tema tercihi, oturum)</td>
                                <td>Oturum / 1 yıl</td>
                                <td>✅ Evet</td>
                            </tr>
                            <tr>
                                <td><strong>Analitik Çerezler</strong></td>
                                <td>Ziyaretçi sayısı, popüler sayfalar (Google Analytics)</td>
                                <td>26 ay</td>
                                <td>🔘 İsteğe bağlı</td>
                            </tr>
                            <tr>
                                <td><strong>Reklam Çerezleri</strong></td>
                                <td>Kişiselleştirilmiş reklam (Google AdSense)</td>
                                <td>13 ay</td>
                                <td>🔘 İsteğe bağlı</td>
                            </tr>
                        </tbody>
                    </table>
                </section>

                <section>
                    <h2>3. Zorunlu Tercih Saklama Detayları</h2>
                    <table>
                        <thead>
                            <tr><th>Anahtar</th><th>Tür</th><th>Sağlayıcı</th><th>Amaç</th><th>Süre</th></tr>
                        </thead>
                        <tbody>
                            <tr><td><code>hesapmod-theme</code></td><td>localStorage</td><td>HesapMod</td><td>Açık/koyu tema tercihi</td><td>Tarayıcı temizlenene kadar</td></tr>
                            <tr><td><code>hesapmod-cookie-consent</code></td><td>localStorage</td><td>HesapMod</td><td>Analitik izin tercihi</td><td>Tarayıcı temizlenene kadar</td></tr>
                        </tbody>
                    </table>
                </section>

                <section>
                    <h2>4. Üçüncü Taraf Çerezleri</h2>
                    <ul>
                        <li>
                            <strong>Google Analytics (GA4):</strong> Yalnızca açık rıza verdiğinizde yüklenir ve ziyaretçi trafiğini ölçmek için kullanılır.
                            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener" className="ml-1">Google Gizlilik Politikası →</a>
                        </li>
                        <li>
                            <strong>Google AdSense:</strong> İçerik odaklı reklamlar. Reklam kişiselleştirmesini Google hesabınızdan yönetebilirsiniz.
                            <a href="https://adssettings.google.com" target="_blank" rel="noopener" className="ml-1">Reklam Ayarları →</a>
                        </li>
                    </ul>
                </section>

                <section>
                    <h2>5. Çerezleri Nasıl Yönetebilirsiniz?</h2>
                    <ul>
                        <li><strong>Tarayıcı ayarları:</strong> Tüm çerezleri tarayıcınızın gizlilik/güvenlik ayarlarından silebilir veya engelleyebilirsiniz.</li>
                        <li><strong>Çerez bannerı:</strong> Sitemizi ilk ziyaretinizde çıkan banner üzerinden tercihlerinizi belirleyebilirsiniz.</li>
                        <li><strong>Google Analytics opt-out:</strong> <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener">Google Analytics Devre Dışı Bırakma →</a></li>
                    </ul>
                    <p className="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800/40 rounded-xl p-4 text-sm">
                        ⚠️ Zorunlu çerezleri devre dışı bırakmanız durumunda tema tercihiniz ve bazı platform özellikleri düzgün çalışmayabilir.
                    </p>
                </section>

                <section>
                    <h2>6. İletişim</h2>
                    <p>
                        Çerez politikamız hakkında sorularınız için <a href={CONTACT_FORM_PATH}>İletişim</a> sayfamızdaki formu kullanabilirsiniz.
                    </p>
                </section>

            </div>

            <div className="mt-12 flex gap-4 flex-wrap">
                <a href="/gizlilik-politikasi" className="text-sm text-primary hover:underline">→ Gizlilik Politikası</a>
                <a href="/kvkk" className="text-sm text-primary hover:underline">→ KVKK Aydınlatma Metni</a>
            </div>
        </div>
    );
}

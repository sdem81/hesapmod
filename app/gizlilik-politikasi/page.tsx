import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Gizlilik Politikası",
    description: "HesapMod gizlilik politikası — kişisel verilerinizin nasıl toplandığı, işlendiği ve korunduğu hakkında KVKK uyumlu aydınlatma metni.",
    alternates: { canonical: "/gizlilik-politikasi" },
    robots: { index: true, follow: true },
};

export default function GizlilikPolitikasi() {
    return (
        <div className="container mx-auto px-4 py-16 max-w-4xl">
            <div className="mb-12">
                <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">Yasal Belgeler</span>
                <h1 className="text-4xl font-extrabold tracking-tight mt-4 mb-4">Gizlilik Politikası</h1>
                <p className="text-muted-foreground">Son güncelleme: Şubat 2026 · 6698 sayılı KVKK kapsamında hazırlanmıştır.</p>
            </div>

            <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">

                <section>
                    <h2>1. Veri Sorumlusu</h2>
                    <p>
                        Bu gizlilik politikası, <strong>HesapMod</strong> ("<strong>Şirket</strong>", "<strong>Biz</strong>") tarafından
                        işletilen <strong>hesapmod.com</strong> web sitesine ("<strong>Platform</strong>") uygulanmaktadır.
                        6698 sayılı Kişisel Verilerin Korunması Kanunu ("<strong>KVKK</strong>") uyarınca veri sorumlusu sıfatıyla hareket etmekteyiz.
                    </p>
                    <div className="bg-muted/50 rounded-2xl p-6 not-prose">
                        <p className="text-sm font-semibold mb-1">İletişim Bilgileri</p>
                        <p className="text-sm text-muted-foreground">E-posta: <a href="mailto:hesapmodcom@gmail.com" className="text-primary hover:underline">hesapmodcom@gmail.com</a></p>
                    </div>
                </section>

                <section>
                    <h2>2. Hangi Verileri Topluyoruz?</h2>
                    <h3>2.1 Otomatik Toplanan Veriler</h3>
                    <ul>
                        <li><strong>Log verileri:</strong> IP adresi, tarayıcı türü, işletim sistemi, ziyaret edilen sayfalar, ziyaret tarihi ve süresi.</li>
                        <li><strong>Çerez verileri:</strong> Oturum çerezleri, tercih çerezleri ve analitik çerezler (detay için Çerez Politikamızı inceleyiniz).</li>
                        <li><strong>Cihaz bilgileri:</strong> Ekran çözünürlüğü, cihaz tipi (masaüstü/mobil).</li>
                    </ul>
                    <h3>2.2 Kullanıcı Tarafından Sağlanan Veriler</h3>
                    <ul>
                        <li><strong>İletişim formu:</strong> Ad-soyad, e-posta adresi, mesaj içeriği.</li>
                        <li><strong>Hesap makinesi girdileri:</strong> Hesap makinelerine girilen değerler yalnızca tarayıcınızda işlenir; sunucularımıza gönderilmez veya saklanmaz.</li>
                    </ul>
                </section>

                <section>
                    <h2>3. Verileri Neden İşliyoruz?</h2>
                    <table>
                        <thead>
                            <tr><th>Amaç</th><th>Hukuki Dayanak (KVKK m.5)</th></tr>
                        </thead>
                        <tbody>
                            <tr><td>Platform güvenliği ve doğrulama</td><td>Meşru menfaat</td></tr>
                            <tr><td>Kullanıcı deneyimi iyileştirme</td><td>Açık rıza (analitik çerezler)</td></tr>
                            <tr><td>İletişim taleplerine yanıt verme</td><td>Sözleşmenin ifası</td></tr>
                            <tr><td>Yasal yükümlülüklerin yerine getirilmesi</td><td>Kanuni zorunluluk</td></tr>
                        </tbody>
                    </table>
                </section>

                <section>
                    <h2>4. Verileri Kimlerle Paylaşıyoruz?</h2>
                    <p>Kişisel verileriniz aşağıdaki üçüncü taraflarla paylaşılabilir:</p>
                    <ul>
                        <li><strong>Google Analytics / Google Tag Manager:</strong> Anonim site trafiği analizi için. Veriler AB Standart Sözleşme Maddeleri kapsamında ABD&apos;ye aktarılabilir.</li>
                        <li><strong>Google AdSense:</strong> Sitemizde Google AdSense aracılığıyla reklamlar gösterilebilir. Google, reklam sunmak için çerezler ve web işaretçileri gibi teknolojiler kullanabilir. Google&apos;ın bu verileri nasıl kullandığına ilişkin bilgiye <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer">Google Reklam Politikası</a> sayfasından ulaşabilirsiniz. <a href="https://optout.aboutads.info/" target="_blank" rel="noopener noreferrer">Reklam tercihlerinizi buradan yönetebilirsiniz.</a></li>
                        <li><strong>Altyapı sağlayıcıları:</strong> Hosting ve CDN hizmetleri (Vercel Inc.). Veriler şifreli kanallar üzerinden iletilir.</li>
                        <li><strong>Yasal zorunluluklar:</strong> Mahkeme kararı veya yetkili makam talebi halinde.</li>
                    </ul>
                    <p>Verileriniz hiçbir koşulda satılmaz veya kişisel reklam profili oluşturmak amacıyla üçüncü taraflarla paylaşılmaz.</p>
                </section>

                <section>
                    <h2>5. Verilerin Saklanma Süresi</h2>
                    <ul>
                        <li>Log verileri: <strong>90 gün</strong></li>
                        <li>İletişim formu verileri: <strong>2 yıl</strong> (veya talep tamamlandıktan sonra 6 ay)</li>
                        <li>Analitik çerez verileri: <strong>26 ay</strong> (Google Analytics varsayılan süresi)</li>
                    </ul>
                </section>

                <section>
                    <h2>6. KVKK Kapsamında Haklarınız</h2>
                    <p>KVKK'nın 11. maddesi uyarınca aşağıdaki haklara sahipsiniz:</p>
                    <ul>
                        <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
                        <li>Verilerinize erişim talep etme</li>
                        <li>Hatalı verilerin düzeltilmesini isteme</li>
                        <li>Belirli koşullarda verilerin silinmesini talep etme</li>
                        <li>İşlemenin kısıtlanmasını isteme</li>
                        <li>Veri taşınabilirliği talep etme</li>
                        <li>Otomatik karar alma süreçlerine itiraz etme</li>
                    </ul>
                    <p>
                        Haklarınızı kullanmak için <a href="mailto:hesapmodcom@gmail.com">hesapmodcom@gmail.com</a> adresine yazabilir
                        ya da <a href="/iletisim">İletişim</a> sayfamızdaki formu kullanabilirsiniz. Talepler <strong>30 gün</strong> içinde yanıtlanır.
                    </p>
                </section>

                <section>
                    <h2>7. Çerezler</h2>
                    <p>
                        Çerezlerin kullanımı hakkında ayrıntılı bilgi için <a href="/cerez-politikasi">Çerez Politikamızı</a> inceleyiniz.
                    </p>
                </section>

                <section>
                    <h2>8. Güvenlik Önlemleri</h2>
                    <p>
                        Verilerinizi korumak için HTTPS şifreleme, erişim kontrolü ve düzenli güvenlik denetimleri uygulamaktayız.
                        Hesap makinesi girdileri sunucularımıza iletilmemekte; tüm hesaplamalar yalnızca tarayıcınızda gerçekleşmektedir.
                    </p>
                </section>

                <section>
                    <h2>9. Politika Değişiklikleri</h2>
                    <p>
                        Bu politika gerektiğinde güncellenebilir. Önemli değişiklikler sayfanın üst kısmındaki güncelleme tarihi ile belirtilir.
                        Platformu kullanmaya devam etmeniz, güncel politikayı kabul ettiğiniz anlamına gelir.
                    </p>
                </section>

            </div>

            <div className="mt-12 flex gap-4 flex-wrap">
                <a href="/cerez-politikasi" className="text-sm text-primary hover:underline">→ Çerez Politikası</a>
                <a href="/kvkk" className="text-sm text-primary hover:underline">→ KVKK Aydınlatma Metni</a>
                <a href="/iletisim" className="text-sm text-primary hover:underline">→ İletişim</a>
            </div>
        </div>
    );
}

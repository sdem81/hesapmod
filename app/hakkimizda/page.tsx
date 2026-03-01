import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Hakkımızda",
    description: "HesapMod hakkında bilgi edinin — misyonumuz, vizyonumuz ve 300'den fazla ücretsiz hesaplama aracı sunan platformumuzun hikayesi.",
    alternates: { canonical: "/hakkimizda" },
};

const stats = [
    { value: "300+", label: "Hesaplama Aracı" },
    { value: "4", label: "Kategori" },
    { value: "2026", label: "Kuruluş Yılı" },
    { value: "%100", label: "Ücretsiz" },
];

const values = [
    {
        icon: "🎯",
        title: "Doğruluk",
        desc: "Tüm hesaplama formülleri akademik kaynaklara ve güncel yasal düzenlemelere dayanmaktadır.",
    },
    {
        icon: "⚡",
        title: "Hız",
        desc: "Hesaplamalar bilgisayarınızda (tarayıcıda) çalışır; sunucuya veri gönderilmez, anlık sonuç alırsınız.",
    },
    {
        icon: "🔒",
        title: "Gizlilik",
        desc: "Girdiğiniz hiçbir veri sunucularımıza iletilmez. Mahrem hesaplamalarınız yalnızca sizin ekranınızda kalır.",
    },
    {
        icon: "📖",
        title: "Şeffaflık",
        desc: "Her hesap makinesinde kullanılan formüller, örnekler ve kaynaklar açıkça gösterilmektedir.",
    },
];

export default function HakkimizdaPage() {
    return (
        <div className="flex flex-col">
            {/* Hero */}
            <section className="w-full py-20 bg-gradient-to-b from-primary/5 to-background border-b">
                <div className="container mx-auto px-4 max-w-5xl">
                    <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">Hakkımızda</span>
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mt-4 mb-6">
                        Hesaplamayı Herkes İçin <br className="hidden md:block" />
                        <span className="text-primary">Erişilebilir</span> Kılıyoruz
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed">
                        HesapMod, 2024 yılında finans, sağlık, matematik ve günlük yaşam hesaplamalarını
                        herkes için ücretsiz, hızlı ve güvenilir hale getirme amacıyla kurulmuştur.
                        Karmaşık formülleri anlaşılır araçlara dönüştürüyoruz.
                    </p>
                </div>
            </section>

            {/* Stats */}
            <section className="w-full bg-muted/30 py-16 border-b">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {stats.map((s) => (
                            <div key={s.label}>
                                <p className="text-4xl font-extrabold text-primary">{s.value}</p>
                                <p className="text-muted-foreground text-sm mt-1">{s.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mission / Vision */}
            <section className="container mx-auto px-4 py-20 max-w-5xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="bg-card border rounded-3xl p-8 shadow-sm">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-2xl mb-4">🏹</div>
                        <h2 className="text-2xl font-bold mb-4">Misyonumuz</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Türkiye'deki bireyler ve işletmeler için finans, sağlık ve günlük yaşamın
                            hesaplama gereksinimlerini karşılayan, reklamsız, üyeliksiz ve tamamen ücretsiz
                            bir platform sunmak. Karmaşık formülleri herkesin anlayabileceği sade araçlara
                            dönüştürmek.
                        </p>
                    </div>
                    <div className="bg-card border rounded-3xl p-8 shadow-sm">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-2xl mb-4">🌟</div>
                        <h2 className="text-2xl font-bold mb-4">Vizyonumuz</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Türkiye'nin en güvenilir ve kapsamlı online hesaplama platformu olmak.
                            300'den fazla araçla başladığımız bu yolculukta, hesap makinelerini yalnızca
                            hesaplama değil bir öğrenme ve farkındalık aracına dönüştürmeyi hedefliyoruz.
                        </p>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="w-full bg-muted/30 py-20 border-t">
                <div className="container mx-auto px-4 max-w-5xl">
                    <h2 className="text-3xl font-bold mb-12 text-center">Değerlerimiz</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((v) => (
                            <div key={v.title} className="bg-card border rounded-3xl p-6 shadow-sm hover:shadow-md hover:border-primary/40 transition-all">
                                <div className="text-4xl mb-4">{v.icon}</div>
                                <h3 className="text-lg font-bold mb-2">{v.title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* E-E-A-T: Uzmanlık Kanıtı */}
            <section className="container mx-auto px-4 py-20 max-w-5xl">
                <h2 className="text-3xl font-bold mb-8">Güvenilirlik ve Uzmanlık</h2>
                <div className="bg-card border rounded-3xl p-8 shadow-sm space-y-6">
                    <div className="flex gap-4">
                        <span className="text-2xl">✅</span>
                        <div>
                            <h3 className="font-bold mb-1">Formül Kaynakları</h3>
                            <p className="text-muted-foreground text-sm">Her hesaplayıcıda kullanılan formüller; Türkiye Cumhuriyeti kanunları,
                                Türkiye İstatistik Kurumu (TÜİK) verileri, WHO standartları ve akademik kaynaklar
                                baz alınarak hazırlanmıştır.</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <span className="text-2xl">✅</span>
                        <div>
                            <h3 className="font-bold mb-1">Sağlık İçerikleri</h3>
                            <p className="text-muted-foreground text-sm">VKİ, kalori ve ideal kilo gibi sağlık hesaplayıcıları yalnızca
                                bilgilendirme amacıyla sunulmaktadır. Her sayfada tıbbi sorumluluk reddi
                                (Medical Disclaimer) yer almakta; doktor görüşünün önemi vurgulanmaktadır.</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <span className="text-2xl">✅</span>
                        <div>
                            <h3 className="font-bold mb-1">Verilen Mahrem</h3>
                            <p className="text-muted-foreground text-sm">Tüm hesaplamalar yalnızca tarayıcınızda (istemci tarafında)
                                gerçekleşmekte; girdiğiniz hiçbir veri sunucularımıza iletilmemektedir.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="w-full bg-primary/5 py-16 border-t">
                <div className="container mx-auto px-4 max-w-5xl text-center">
                    <h2 className="text-3xl font-bold mb-4">Sorularınız mı Var?</h2>
                    <p className="text-muted-foreground mb-8">Bizimle iletişime geçmekten çekinmeyin. En kısa sürede yanıt vereceğiz.</p>
                    <a
                        href="/iletisim"
                        className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-bold px-8 py-3 rounded-2xl hover:opacity-90 transition-opacity"
                    >
                        İletişime Geç →
                    </a>
                </div>
            </section>
        </div>
    );
}

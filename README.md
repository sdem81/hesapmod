<div align="center">
  <br />
    <a href="https://hesapmod.com" target="_blank">
      <img src="https://hesapmod.com/logo.png" alt="HesapMod Logo" width="200" height="auto" />
    </a>
  <br />

  <h1>HesapMod</h1>
  
  <p>
    Kullanıcıların günlük yaşantılarında veya profesyonel işlerinde ihtiyaç duyabilecekleri maaş, taşıt, finans, sınav, sağlık, zaman ve astroloji gibi çok çeşitli kategorilerde hizmet veren <strong>modern, hızlı ve SEO uyumlu</strong> çevrimiçi hesaplayıcı platformu.
  </p>

  <p>
    <a href="https://hesapmod.com"><strong>🌍 Canlı Siteyi Görüntüle (hesapmod.com)</strong></a>
  </p>
</div>

<br />

## 🚀 Teknolojik Altyapı & Dış Bağımlılıklar

Proje tamamen modern web standartlarına (Core Web Vitals) uygun, yüksek performanslı bileşenlerle inşa edilmiştir.

- **Çatı (Framework):** [Next.js 14](https://nextjs.org/) (App Router ile)
- **Ana Dil:** TypeScript (`Strict` mod)
- **Stil & Tasarım:** [Tailwind CSS](https://tailwindcss.com/)
- **İkonlar:** [Lucide React](https://lucide.dev/)
- **Animasyonlar:** CSS Keyframes & `tailwindcss-animate` (JS gecikmelerinden kaçınmak için)
- **Trafik & Metrikler:** `@next/third-parties/google` (TBT değerini etkilemeyen asenkron GA4 yüklemesi)
- **Dağıtım (Deployment):** [Vercel](https://vercel.com/) (Edge Network, CI/CD)

---

## 🎯 Temel Özellikler

- **Geniş Kategori Yelpazesi:** Finans (Kredi, KDV, Kâr Marjı, Maaş), Yaşam (İdeal Kilo, Gebelik), Zaman (Yaş Hesaplama), Eğitim (YKS, LGS Puan) ve Astroloji (Yükselen Burç).
- **Zengin "Sıfır" JS Görselleştirmeleri:** Kullanıcıyı ekranda tutmak için tasarlanmış, `recharts` veya MUI gibi aşırı ağır kütüphanelere dayanmadan **tamamen CSS** (`conic-gradient` vb.) ile oluşturulan pasta grafikler (Pie Charts) ve kredi amortisman (Ödeme Planı) tabloları.
- **Dinamik SEO Optimizasyonu:** `generateMetadata` fonksiyonları ile her hesaplayıcı için 100 üzerinden 100 SEO puanı alacak dinamik title, JSON-LD uyumlu description ve zengin içerikler (How To/FAQ Schema).
- **Mobil Öncelikli & Erişilebilir:** Tüm formlar (`type="range"` slider dahil), native HTML kontrollerinden esinlenerek en dar iPhone ekranından geniş masaüstü pencerelerine dek kusursuz şekilde ölçeklenir.

---

## ⚙️ Kurulum & Yerel Geliştirme (Prerequisites)

Projeyi kendi bilgisayarınızda çalıştırmadan önce sisteminizde aşağıdakilerin yüklü olduğundan emin olun:
- **Node.js** (v18.17 veya daha üstü)
- **npm** (veya `yarn`, `pnpm`, `bun`)

### 1. Repoyu Klonlayın ve Klasöre Girin

```bash
git clone https://github.com/kullanici-adiniz/hesapmod.git
cd hesapmod
```

### 2. Bağımlılıkları Yükleyin

```bash
npm install
```

### 3. Geliştirici Sunucusunu Başlatın

```bash
npm run dev
```

Tarayıcınız üzerinden [http://localhost:3000](http://localhost:3000) adresine giderek platformu yerel ağınızda anında test edebilirsiniz. (Tüm stil ve bileşen değişiklikleriniz `Hot Reload` sayesinde mili saniyeler içinde ekrana yansır).

---

## 📂 Dosya ve Klasör Yapısı (Mimari)

```text
├── app/
│   ├── (main)/               # Ana route grubudur. Kategori ve hesaplayıcı detay sayfaları (Dinamik [slug]) bulunur.
│   ├── legal/                # Kişisel Veriler, Gizlilik Politikası (KVKK/GDPR uyumlu static dokümanlar)
│   ├── globals.css           # Global Tailwind direktifleri ve özel CSS bileşenleri (range-slider fill vb.)
│   ├── layout.tsx            # Root layout (Header, Footer enjeksiyonu ve Google Analytics 4)
│   ├── page.tsx              # Ana sayfa (Kategori grid listeleri)
│   └── sitemap.ts            # Google Search Console için otomatik oluşturulan XML Sitemap
├── components/
│   ├── calculator/           # Kalp modülü: Form yöneticisi (CalculatorForm) ve Grafik/Tablo barındıran (ResultBox)
│   ├── CategoryCard.tsx      # Ana sayfada yer alan SEO uyumlu SVG ikonlu kategori butonları
│   ├── header.tsx            # Logo, Navigasyon ve Açık/Koyu Tema Geçişi (Dark Mode)
│   └── footer.tsx            # Telif hakkı ve Legal Linkler
├── lib/
│   ├── calculators.ts        # ⚠️ Tüm hesaplayıcı konfigürasyonlarını, formüllerini ve SEO Content'lerini içeren dev veritabanı.
│   └── categories.ts         # Kategorilerin meta bilgileri (İkonlar, Route isimleri vb.)
└── public/                   # Logolar, robots.txt, ikonlar ve görsel assetler
```

---

## ➕ Yeni Bir Hesaplayıcı Modülü Nasıl Eklenir?

HesapMod, **ölçeklenebilir config (ayarlar) mimarisi** üzerine kuruludur. Yeni bir araç eklemek için yeni bir sayfa (page.tsx) oluşturmanıza **gerek yoktur**.

1. **Kategori Seçimi:** `lib/categories.ts` dosyasından uygun kategori ID'sini bulun (veya yeni kategori ekleyin).
2. **Konfigürasyon (Zorunlu Adım):** `lib/calculators.ts` dosyasını açın ve uygun array (`financeCalculators`, `astrologyCalculators` vb.) içine yeni bir `CalculatorConfig` objesi tanımlayın.
3. **Parametreleri Belirleyin:**
   - Kimlik Alanları: `id`, `slug`, `category`, `name`.
   - Form Alanları (`inputs`): `number`, `select`, `range`, `section` tipleriyle kullanıcıdan ne alacağınızı belirleyin.
   - Sonuç Alanları (`results`): Hangi değerlerin (`text`, `number`, `pieChart`, `schedule`) UI'da kartlar halinde çizileceğini saptayın.
   - Motor (`formula`): Gelen değerleri işleyip geriye `results` dizisindeki `id` ile eşleşecek JSON objesini basan pure function'ı tasarlayın.
   - Arama Devleri İçin (`seo`): H1, Title, Description, Zengin İçerik (How It Works) ve FAQ array'ini kusursuz Türkçeyle işleyin.
4. **Bitti!** Tarayıcıda `https://localhost:3000/ilgili-kategori/yeni-slug`'a gittiğinizde harika görünümlü aracınızın (mobil UI ve SEO metinleriyle birlikte) sizi beklediğini göreceksiniz.

---

## 🤝 Katkıda Bulunma Kılavuzu (Contributing)

Platformu geliştirirken temiz ve öngörülebilir bir geçmiş (git history) bırakmayı önemsiyoruz. 

Lütfen commit mesajlarınızı [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) kurallarına göre oluşturun:
- `feat:` Yeni bir özellik (Örn: `feat: ekle takdir tesekkur hesaplayici`)
- `fix:` Hata çözümü (Örn: `fix: kdv matrah bolme hatasi`)
- `docs:` Yalnızca README veya yorum satırı güncellemesi
- `style:` Boşluklar, formattlama (UI değişimleri değil)
- `refactor:` Üretimde bug düzeltmeyen veya özellik eklemeyen ancak kodu toparlayan işlemler.
- `chore:` Paket güncellemeleri, config değiştirmeleri.

---

## 📜 Lisans & Yasal Metinler

Sitede yer alan kullanım koşulları, KVKK, Çerez Politikası ve diğer hukuki/kurumsal bilgilere `/legal` rotası altındaki dosyalardan ulaşabilirsiniz.

Tüm metinler SEO uyumlu ve güncel Türk mevzuatına (GDPR & KVKK) uygun olarak standardize edilmiştir.

*(Bu proje şablonu/kaynak kodu, aksi belirtilmediği sürece Proprietary/Tüm Hakları Saklıdır kapsamındadır.)*

# HesapMod

HesapMod, finans, vergi, sınav, sağlık, matematik, zaman ve günlük yaşam odaklı hesaplama araçlarını tek platformda sunan bir Next.js uygulamasıdır.

Canlı ortam: `https://www.hesapmod.com`

## Teknoloji

- Next.js 14 App Router
- TypeScript
- Tailwind CSS
- Lucide React
- Vercel

## Yerel Geliştirme

Gereksinimler:

- Node.js 18+
- npm

Kurulum:

```bash
npm install
npm run dev
```

Uygulama varsayılan olarak `http://localhost:3000` altında açılır.

## Ortam Değişkenleri

İletişim formu için aşağıdaki değişkenler kullanılabilir:

```bash
CONTACT_RECIPIENT_EMAIL=destek@hesapmod.com
RESEND_FROM_EMAIL=bildirim@hesapmod.com
RESEND_API_KEY=...
```

Notlar:

- Analytics yüklemesi kullanıcı çerez izni verene kadar başlamaz.
- Üretimde ana host stratejisi `https://www.hesapmod.com` üzerinedir.

## Ana Scriptler

```bash
npm run dev
npm run lint
npm run generate:runtimes
npm run analyze:coverage
npm run export:index-priority
npm run build
```

Script açıklamaları:

- `generate:runtimes`: `lib/calculator-source.ts` içindeki formülleri kategori bazlı runtime modüllerine ayırır.
- `analyze:coverage`: hedef liste ile mevcut hesaplayıcı kapsamını karşılaştırır.
- `export:index-priority`: Search Console öncelik CSV'sini üretir.
- `build`: önce runtime modüllerini üretir, sonra Next.js build alır.
- `postbuild`: Google Indexing API kullanmaz; sitemap kapsamını raporlar ve Search Console iş akışını hatırlatır.

## Mimari Özeti

Kaynak gerçekliği:

- `lib/calculator-source.ts`
  Tüm hesaplayıcı tanımlarının, SEO içeriklerinin ve formüllerin ana kaynağıdır.
- `scripts/generate-runtime-modules.ts`
  Formülleri kategori bazında `lib/calculator-runtime/*` dosyalarına böler.
- `lib/calculators.ts`
  Runtime ve katalog katmanını birleştirir; arama indeksi, katalog ve route çözümleme burada sunulur.

Sayfa katmanı:

- `app/[category]/[slug]/page.tsx`
  Hesaplayıcıların canonical sayfasıdır.
- `app/hesaplama/[slug]/page.tsx`
  Uyumluluk route'udur; kalıcı yönlendirme ile canonical sayfaya gider.
- `app/kategori/[slug]/page.tsx`
  Kategori merkezleri ve iç link dağıtımı burada yer alır.
- `app/tum-araclar/page.tsx`
  Tüm araçların SSR crawl hub sayfasıdır.
- `app/rehber/*`
  Editoryal rehber içerikleri ve hesaplayıcı kümeleri.

SEO ve site altyapısı:

- `lib/seo.ts`
  Metadata, canonical ve schema üretimi.
- `lib/sitemap-data.ts`
  Sitemap kaynak verisini üretir.
- `app/sitemap.ts`
  XML sitemap route'u.
- `app/robots.ts`
  Robots kuralları ve sitemap bildirimi.
- `components/AnalyticsLoader.tsx`
  Analytics'i çerez onayına bağlar.

## Dizin Yapısı

```text
app/
  [category]/[slug]/      canonical hesaplayıcı sayfaları
  hesaplama/[slug]/       alias redirect route
  kategori/[slug]/        kategori hub sayfaları
  rehber/                 editoryal içerikler
  tum-araclar/            SSR araç merkezi
lib/
  calculator-source.ts    ana kaynak
  calculator-runtime/     generate edilen formula modülleri
  calculators.ts          katalog + arama indeksi
  articles.ts             rehber içeriği
  sitemap-data.ts         sitemap girdileri
scripts/
  generate-runtime-modules.ts
  analyze-calculator-coverage.ts
  generate-index-priority.ts
reports/
  *.md
  search-console-index-priority.csv
```

## Yeni Hesaplayıcı Ekleme Akışı

1. `lib/calculator-source.ts` içinde yeni hesaplayıcı tanımını ekleyin.
2. Zorunlu alanları doldurun:
   - `slug`
   - `category`
   - `inputs`
   - `results`
   - `formula`
   - `seo.title`
   - `seo.metaDescription`
   - `seo.content`
   - `seo.faq`
   - `seo.richContent`
3. Gerekirse ilgili hesaplayıcı ve rehber ilişkilerini tanımlayın.
4. `npm run generate:runtimes` çalıştırın.
5. `npm run lint` ve `npm run build` ile doğrulayın.
6. İhtiyaç varsa kapsam ve index önceliği raporlarını yeniden üretin.

## SEO ve İndeksleme Kuralları

- Canonical URL formatı `/{category}/{slug}` şeklindedir.
- `/hesaplama/{slug}` sadece uyumluluk ve yönlendirme katmanıdır; Search Console'a canonical URL gönderilmelidir.
- Sitemap yalnızca canonical URL'leri içerir.
- `/tum-araclar` ve kategori sayfaları taranabilir HTML link hub olarak kullanılır.
- İlgili rehberler ve hesaplayıcılar hesap sayfalarında yukarı taşınmıştır; iç link ağı SEO akışının önemli parçasıdır.

## Düzenleme Notları

- `lib/calculator-runtime/*` dosyalarını elle düzenlemeyin; bunlar generate edilir.
- `reports/search-console-index-priority.csv` generate edilen bir çıktı dosyasıdır.
- Build almadan önce runtime üretimi çalıştırılmalıdır; `npm run build` bunu otomatik yapar.

## Katkı ve Commit Kuralı

Commit mesajlarında Conventional Commits kullanılır:

- `feat:`
- `fix:`
- `docs:`
- `refactor:`
- `chore:`

## Dağıtım

Üretim dağıtımı Vercel üzerindedir. Ana canlı alan adı:

- `https://www.hesapmod.com`

Dokümantasyon bu repo içindeki güncel mimariye göre hazırlanmıştır; eski monolitik `lib/calculators.ts` yaklaşımı artık kaynak gerçekliği değildir.

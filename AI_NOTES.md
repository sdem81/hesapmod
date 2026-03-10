# HesapMod - AI Notes

Son güncelleme: `2026-03-08`

## Güncel Durum

- Canlı ortam: `https://www.hesapmod.com`
- Canonical hesaplayıcı route'u: `/{category}/{slug}`
- Uyumluluk route'u: `/hesaplama/{slug}` -> kalıcı yönlendirme
- Mevcut durum: runtime-split mimarisi aktif, kategori hub'ları aktif, rehber kümeleri aktif
- Son SEO deploy'u: SSR `tum-araclar` hub + finans rehber kümeleri + üst konumda ilgili link modülleri

## Sayısal Özet

- Hesaplayıcı sayısı: `193`
- Sitemap URL sayısı: `222`
- Search Console öncelik çıktısı: `reports/search-console-index-priority.csv`

Bu sayılar son build/export akışına göre yazılmıştır; yeni araç veya rehber eklendiğinde yeniden üretmek gerekir.

## Mimari Kısa Yol

- `lib/calculator-source.ts`
  Tüm hesaplayıcıların source of truth dosyası.
- `scripts/generate-runtime-modules.ts`
  Formülleri `lib/calculator-runtime/*` altına böler.
- `lib/calculators.ts`
  Katalog, arama indeksi ve route çözümleme katmanı.
- `components/calculator/CalculatorEngine.tsx`
  İstemci tarafında gerekli runtime formülü yükleyip formu çalıştırır.
- `app/[category]/[slug]/page.tsx`
  Canonical hesaplayıcı sayfası.
- `app/kategori/[slug]/page.tsx`
  Kategori hub sayfası.
- `app/tum-araclar/page.tsx`
  Tam SSR crawl hub.
- `lib/articles.ts`
  Rehber içerikleri ve hesaplayıcı ilişkileri.
- `lib/seo.ts`
  Metadata + schema üretimi.
- `lib/sitemap-data.ts`
  Sitemap kaynağı.

## Operasyon Kuralları

- Yeni hesaplayıcı eklerken yalnızca `lib/calculator-source.ts` düzenlenir.
- `lib/calculator-runtime/*` dosyaları elle düzenlenmez.
- `reports/search-console-index-priority.csv` generate edilen çıktıdır.
- `npm run build` zaten `npm run generate:runtimes` çalıştırır.
- Search Console'a alias URL değil canonical URL gönderilir.
- Analytics, `components/AnalyticsLoader.tsx` üzerinden ancak cookie consent sonrasında yüklenir.

## Son Tamamlanan Büyük İşler

1. Monolitik hesaplayıcı çalışma zamanı kategori bazlı runtime modüllerine bölündü.
2. `/hesaplama/[slug]` uyumluluk route'u kalıcı yönlendirme ile eklendi.
3. Kategori merkezleri zenginleştirildi; `ItemList` schema ve iç link akışı güçlendirildi.
4. Ana sayfaya güncel hesaplayıcı bölümleri eklendi.
5. `/tum-araclar` gerçek SSR crawl hub haline getirildi.
6. Finans için ilk rehber kümeleri eklendi.
7. Hesap sayfalarında ilgili rehberler ve ilgili hesaplamalar form alanının yakınına taşındı.
8. Analytics, cookie onayı olmadan yüklenmeyecek hale getirildi.
9. Google Indexing API kullanımı kapatıldı; postbuild sadece yönlendirme amaçlı çıktı veriyor.

## Search Console ve İndeksleme Notları

- Ana sorun teknik blok değil, toplu yayın sonrası `Discovered - currently not indexed` davranışı.
- `robots.txt`, sitemap ve canonical akışı çalışır durumda.
- Manuel URL Inspection kotası dolabilir; bu normaldir.
- Öncelik dalgaları için ana dosya: `reports/search-console-index-priority.csv`
- Yeniden üretmek için:

```bash
npm run export:index-priority
```

## Kapsam Çalışması Notu

- Kredi ve finans listeleri tamamlandı.
- Tam liste coverage işi devam ediyor; eksik kalan araçlar coverage raporlarında takip ediliyor.
- Mevcut durumdaki eksikler için ana referans: `reports/calculator-coverage-full.md`

## Sonraki Mantıklı İşler

- Search Console kotası açıldığında `wave_1` canonical URL'leri tekrar sırayla istemek
- Finans ve yaşam kategorilerinde yeni rehber kümeleri açmak
- Kalan coverage boşluklarını batch halinde kapatmak
- Gerekirse priority export ve coverage raporlarını yeniden üretmek

Bu dosya, yeni oturumlarda projeyi hızlı yüklemek için kısa bağlam notudur; detay için README ve ilgili scriptlere bak.

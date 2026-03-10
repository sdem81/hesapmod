# HesapMod Teknik SEO ve İndeksleme Durum Notu

Durum tarihi: `2026-03-08`

Bu belge, projedeki güncel teknik durumu özetler. Önceki sürümlerde yer alan "robots erişilemiyor", "sitemap kapalı", "sayfalar açılamıyor" veya benzeri tarihsel tespitler artık bu repo ve canlı sürüm için geçerli kabul edilmemelidir.

## Güncel Teknik Durum

Doğrulanmış yapı:

- `app/robots.ts` tüm siteyi taramaya açık tutar.
- `app/sitemap.ts` sitemap çıktısını `lib/sitemap-data.ts` üzerinden üretir.
- Canonical hesaplayıcı URL yapısı `/{category}/{slug}` şeklindedir.
- `/hesaplama/{slug}` route'u kalıcı yönlendirme ile canonical sayfaya gider.
- Kategori sayfaları ve `/tum-araclar` sayfası taranabilir HTML link hub olarak çalışır.
- Hesaplayıcı sayfalarında schema, canonical, breadcrumb ve ilgili içerik bağlantıları bulunur.
- Analytics yüklemesi cookie consent sonrasına alınmıştır.

## Mevcut SEO İyileştirmeleri

Son dönemde uygulanan başlıca düzenlemeler:

1. Hesaplayıcı çalışma zamanı `lib/calculator-runtime/*` modüllerine ayrıldı.
2. Sitemap ve content last modified mantığı ayrı veri katmanlarına taşındı.
3. Kategori hub'ları zenginleştirildi ve `ItemList` schema eklendi.
4. `/tum-araclar` sayfası tam SSR crawl hub olarak düzenlendi.
5. Hesaplayıcı sayfalarında ilgili rehberler ve ilgili araçlar üst bölgeye taşındı.
6. Finans tarafında editoryal rehber kümeleri oluşturuldu.
7. Kalıcı yönlendirmeler ile alias ve normalize edilmiş URL sinyalleri netleştirildi.

## Search Console Yorumu

Projede gözlenen temel durum:

- Sorun ağırlıklı olarak `Discovered - currently not indexed`
- Bu durum genellikle:
  - kısa sürede çok sayıda benzer URL yayına alınması
  - crawl önceliğinin Google tarafından düşük verilmesi
  - iç link ve editoryal destek sinyalinin bazı kümelerde yeni güçleniyor olması
  - Search Console manuel URL isteme kotasının sınırlı olması
  nedenleriyle açıklanır.

Bu durum, tek başına şu anlamlara gelmez:

- `noindex` hatası
- `robots.txt` engeli
- canonical bozukluğu
- sitemap eksikliği

## Şu Anki Güçlü Sinyaller

- Canonical URL standardı net
- Alias route kalıcı yönlendirme ile daraltılmış durumda
- Sitemap yalnızca canonical URL'leri yayımlıyor
- Rehber kümeleri ile hesaplayıcılar arasında editoryal bağ kuruldu
- Ana sayfa, kategori sayfaları ve `/tum-araclar` üzerinden güçlü iç link akışı sağlandı

## Kısıtlar ve Riskler

- Hesaplayıcı sayfalarının büyük kısmı ortak şablon mantığına sahip; bu nedenle Google tüm kümeleri aynı hızda dizine eklemeyebilir.
- Manual URL Inspection kotası sınırlıdır; aynı gün içinde toplu istekler sınırı doldurabilir.
- Kalan coverage boşlukları kapatılırken batch yaklaşımı kullanılmazsa yeni URL dalgaları tekrar index baskısı yaratabilir.

## Önerilen Operasyon Sırası

1. Search Console'da yalnızca canonical URL'leri istemek
2. Öncelik dalgalarını `reports/search-console-index-priority.csv` üzerinden yürütmek
3. Yeni hesaplayıcıları kontrollü batch'lerle eklemek
4. Finans, yaşam ve diğer yüksek potansiyelli kategorilerde rehber kümelerini artırmak
5. Her büyük içerik turundan sonra:

```bash
npm run lint
npm run build
npm run export:index-priority
```

## İlgili Dosyalar

- `app/robots.ts`
- `app/sitemap.ts`
- `lib/sitemap-data.ts`
- `lib/seo.ts`
- `app/[category]/[slug]/page.tsx`
- `app/hesaplama/[slug]/page.tsx`
- `app/tum-araclar/page.tsx`
- `lib/articles.ts`
- `reports/search-console-index-priority.csv`

Bu dosya araştırma raporundan çok, ekip içi teknik durum notu olarak kullanılmalıdır.

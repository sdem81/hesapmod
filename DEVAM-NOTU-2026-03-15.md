# 15 Mart 2026 Devam Notu

Bu dosya, yarın oturumu hızlı açmak için kısa handoff notudur.

## Canlı Durum

- Production: `https://www.hesapmod.com`
- Son deploy: `https://hesapmod-ox2rgml5g-sdem81s-projects.vercel.app`
- Build: temiz
- IndexNow: başarılı, `228 URL`
- Sitemap: `228 URL`

## Bugün Tamamlananlar

- Navbar logo hizalaması root header üzerinden doğrulandı; ana sayfa ve alt sayfalarda aynı yatay eksene oturdu.
- Sınav batch güncellendi:
  - `msu-puan-hesaplama`
  - `oyp-puan-hesaplama`
  - `isg-puan-hesaplama`
  - `iyos-puan-hesaplama`
  - `pmyo-puan-hesaplama`
  - `pomem-puan-hesaplama`
  - `ogg-sinav-puan-hesaplama`
  - `ozel-guvenlik-sinav-hesaplama`
- Bu sayfalarda:
  - başlık ve meta dili güvenli "ön izleme" tonuna çekildi
  - `updatedAt` / `dateModified` `2026-03-14` oldu
  - canlı `200` kontrolü yapıldı

## Kritik Düzeltmeler

- `ÖYP` ağırlıkları düzeltildi:
  - `ALES %50`
  - `YDS %15`
  - `Lisans notu %35`
- `İSG` 50 soruluk test mantığına göre yeniden konumlandı.

## Stratejik Karar

İlk 90 gün odağı:

- `finansal-hesaplamalar`
- `sinav-hesaplamalari`
- `maas-ve-vergi`

Amaç:

- Tüm siteyi aynı anda büyütmek yerine ilk `25-30` yüksek niyetli URL'yi ilk sayfa seviyesine taşımak.

## Yarın İlk İş

1. İlk `25-30` URL'lik çekirdek listeyi çıkarmak
2. `dizine-eklenmeyenler.md` listesindeki kalan öncelikli URL'leri batch'lemek
3. `zaman-hesaplama` / `zaman-hesaplamalari` legacy yapısını temizleme planı hazırlamak

## Search Console Sorgu Notu

Kullanıcıdan gelen sorgu setine göre ilk fırsat kümeleri:

### Hızlı Kazanılabilirler

- `cagr hesaplama`
  - durum: `1 tıklama / 15 gösterim / ort. pozisyon 7,20`
  - not: mevcut sayfa adı `bilesik-buyume-hesaplama`; `CAGR` ifadesi title/H1 içinde daha görünür olmalı
- `eurobond vergi hesaplama`
  - durum: `1 tıklama / 1 gösterim / ort. pozisyon 2,00`
  - not: güçlü niyet sinyali var; ayrı vergi odaklı içerik veya sayfa düşünülmeli
- `iki tarih arası hafta hesaplama`
  - durum: `0 tıklama / 4 gösterim / ort. pozisyon 5,25`
  - not: sayfa zaten güçlü; örnek tablo ve kısa varyasyonlar (`15 kaç hafta`, `kaç hafta`) eklenebilir
- `mevduat faizi stopaj oranı 2026`
  - durum: `0 tıklama / 1 gösterim / ort. pozisyon 7,00`
  - not: mevcut mevduat sayfasındaki stopaj bölümü doğru yönde
- `geriye dönük enflasyon hesaplama`
  - durum: `0 tıklama / 3 gösterim / ort. pozisyon 11,00`
  - not: enflasyon sayfasında bu niyet daha belirgin işlenmeli

### Orta Vadeli Büyük Fırsatlar

- `mevduat faizi hesaplama`
  - durum: `0 tıklama / 41 gösterim / ort. pozisyon 75,02`
  - not: yüksek potansiyel ama çok rekabetçi; güçlü CTR ve otorite çalışması gerektiriyor
- `araç kredisi hesaplama`
  - durum: `0 tıklama / 19 gösterim / ort. pozisyon 62,42`
  - not: `tasit-kredisi-hesaplama` sayfası, `araç/araba/oto` diline göre yeniden konumlanmalı
- `enflasyon hesaplama`
  - durum: `0 tıklama / 18 gösterim / ort. pozisyon 27,89`
  - not: ana niyet var; otorite artıyor ama ilk sayfa için daha agresif güçlendirme gerekiyor
- `eurobond hesaplama`
  - durum: `0 tıklama / 12 gösterim / ort. pozisyon 65,00`
  - not: `eurobond-hesaplama` ve `eurobond-getiri-hesaplama` ayrımı netleştirilmeli
- `nakit avans` kümesi
  - not: geniş sorgu talebi var ama sitede yalnız `kredi-karti-taksitli-nakit-avans-hesaplama` bulunuyor; genel `nakit avans hesaplama` sayfası fırsat olabilir

### Düşük Öncelik Ama Değerli Long-Tail

- `adet günü hesaplama` ve türevleri
- `yükselen burç` / `doğum saati olmadan yükselen`
- `ay evresi hesaplama`
- `ALES ea / eşit ağırlık puan hesaplama`

### Uygulama Notu

- Yazım hataları için ayrı sayfa açılmayacak
- Önce yüksek niyetli doğru sorgu kümeleri güçlendirilecek
- İlk somut aksiyon listesi:
  1. `bilesik-buyume-hesaplama` -> `CAGR` odaklı başlık/H1/FAQ güçlendirmesi
  2. `eurobond` vergi niyeti için ayrı içerik veya yeni hesaplayıcı kararı
  3. `tasit-kredisi-hesaplama` sayfasını `araç/araba/oto` varyasyonlarına göre yeniden yazmak
  4. `nakit avans` için genel sayfa ihtiyacını doğrulamak

## Not

- Repo çalışma ağacı hâlâ kirli; bu normal. Production deploy'lar mevcut worktree'den alındığı için yeni işlerde her zaman mevcut diff'le uyumlu ilerlemek gerekiyor.

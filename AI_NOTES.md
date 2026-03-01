# HesapMod Projesi - AI Asistan Hafıza Dosyası (Context)

**Proje:** HesapMod (hesapmod.com)
**Amacı:** Finans, sağlık, matematik, eğitim ve günlük yaşam gibi birçok alanda 300'den fazla ücretsiz, hızlı ve kullanıcı dostu hesaplama aracını tek bir platformda toplamak.
**Hedef:** Yüksek organik arama motoru trafiği (SEO) elde etmek ve AdSense odaklı kaliteli, doyurucu içerik sağlamak (E-E-A-T uyumlu, "thin content" olmayan sayfalar).

## 🛠 Teknoloji Yığını (Tech Stack)
- **Framework:** Next.js 14.x (App Router - SSR/SSG mantığı)
- **Dil:** TypeScript (`.tsx`, `.ts`)
- **Stil:** Tailwind CSS
- **İkonlar:** Lucide React
- **Deployment:** Vercel

## 🏗 Mimari Yapı (Architecture)
1. **`lib/calculators.ts`:** Tüm araçların ana veritabanı. Her araç: ID, Slug, Name (TR/EN), Description, SEO, Inputs, Results, Formula içerir.
2. **`components/calculator/CalculatorEngine.tsx`:** Formülleri ve inputları dinamik React bileşenlerine aktaran render motoru.
3. **`app/[category]/[slug]/page.tsx`:** Araçların dinamik sayfaları.
4. **`lib/seo.ts`:** SEO metadataları, JSON-LD Schema ve canonical etiketlerin üretildiği servis.

## 📌 Kritik Proje Kuralları
- **SEO:** Her araçta `title`, `metaDescription`, `content`, `faq`, `richContent` (howItWorks, formulaText, exampleCalculation, miniGuide) zorunludur.
- **Dil:** Tüm metinler `{ tr: "...", en: "..." }` formatında; **TR içerik önceliklidir.**
- **TypeScript:** `CalculatorConfig` arayüzü bozulmadan, geriye dönük uyumlu ekleme yapılmalıdır.
- **Performans:** Yüksek Google PageSpeed (mobil) skoru hedeflenir.

## 📋 Aktif Array'ler (`lib/calculators.ts`)
| Array | İçerik |
|---|---|
| `investmentCalculatorsP1/P2/P3/P4/P5` | Finansal araçlar |
| `schoolCalculators` | Temel sınav araçları (AGS, DGS, KPSS, LGS, TYT, YKS, Özel Güvenlik) |
| `schoolCalculatorsBatch2` | Üniversite sınavları (AKS, ALES, MSÜ, OBP, YDS, YKS Taban) |
| `schoolCalculatorsBatch3` | Kamu sınavları (DGS Taban, EKPSS, Hâkim-Savcı, HMGS, ÖYP) |
| `schoolCalculatorsBatch4` | Mesleki sınavlar (DİB-MBSTS, DUS, EUS, İSG, TUS) |
| `schoolCalculatorsBatch5` (Batch4 array) | Özel sınavlar (Ehliyet, İYÖS, Lise Taban, PMYO, POMEM, PYBS) |
| `timeCalculators`, `dailyCalculators`, `astrologyCalculators` | Zaman, günlük, astroloji |
| `phase1/2/3/4Calculators` | Ek kategori araçları |

## 📝 En Son Yapılan Geliştirmeler (Mart 2026)

### Finansal Araçlar — 7 yeni (`investmentCalculatorsP5`):
- Enflasyon Hesaplama (`enflasyon-hesaplama`)
- Reel Getiri Hesaplama (`reel-getiri-hesaplama`)
- Birikim Hesaplama (`birikim-hesaplama`)
- Eurobond Hesaplama (`eurobond-hesaplama`)
- IBAN Doğrulama (`iban-dogrulama`)
- Geçmiş Altın Fiyatları (`gecmis-altin-fiyatlari`) — 2010–2025 statik veri
- Geçmiş Döviz Kurları (`gecmis-doviz-kurlari`) — 2010–2025 statik veri

### Sınav Araçları — 22 yeni araç (Mart 2026):
- **Batch2 (6):** AKS, ALES, MSÜ, OBP, YDS, Üniversite Taban Puanları
- **Batch3 (5):** DGS Taban, EKPSS, Hâkim-Savcı Yrd., HMGS, ÖYP
- **Batch4 (5):** DİB-MBSTS, DUS, EUS, İSG, TUS
- **Batch5 (6):** Ehliyet, İYÖS, Lise Taban, PMYO, POMEM, PYBS
- **Toplam:** 7 mevcut + 22 yeni = **29 sınav aracı**

### ⚠️ Puan Formülü Düzeltmeleri (Mart 2026 — Bu Oturum):
Puan hesaplamalarında yanlış/tahmini katsayılar yerine gerçek ÖSYM değerleri uygulandı.

#### ALES (`ales-puan-hesaplama`) — TAM DÜZELTME:
- **Yöntem:** ALES her dönem farklı sabit+katsayı kullanır. Dönem seçimi eklendi.
- **2025/3 katsayıları (doğrulandı):**
  - SAY = 47.48692 + (SayNet × 0.76542) + (SözNet × 0.31649)
  - SÖZ = 44.29160 + (SayNet × 0.25121) + (SözNet × 0.93482)
  - EA  = 46.78565 + (SayNet × 0.50146) + (SözNet × 0.62202)
- **Dönem seçenekleri:** 2025/3, 2025/2, 2025/1, 2024/2, 2024/1
- **Result decimalPlaces:** 5 (referans sitelerle birebir eşleşme)
- **Min 1 net barajı** kontrol eklendi

#### KPSS (`kpss-puan-hesaplama`) — DÜZELTME:
- **Eski (yanlış):** `P1 = 40 + GY*0.9 + GK*0.9`, `P2 = P1*1.05`, `P3 = P1*0.95`
- **Yeni:** `P1 ≈ (GY_Net × 1.17) + (GK_Net × 0.50) + 40` (GY %70, GK %30 ağırlığı)
- P3 kaldırıldı (alan testi input'u olmadan hesaplanamaz); uyarı metni eklendi

#### YKS (`yks-puan-hesaplama`) — DÜZELTME:
- **2024 gerçek TYT katsayıları:** Türkçe:2.91, Sos:2.94, Mat:2.93, Fen:2.53
- **2024 gerçek AYT-SAY:** Mat:3.19, Fiz:2.43, Kim:3.07, Biy:2.51
- **2024 gerçek AYT-SÖZ:** Edeb:3.01, Tar1:2.82, Coğ1:3.30, Tar2:2.89, Coğ2:2.89, Fel:3.01, Din:3.30
- **2024 gerçek AYT-EA:** Mat:3.19, Edeb:3.01, Tar1:2.82, Coğ1:3.30
- Sınav yılı seçimi eklendi (2024 / 2023)

#### TYT (`tyt-puan-hesaplama`) — DÜZELTME:
- **2024 gerçek katsayılar:** Türkçe:2.91, Sos:2.94, Mat:2.93, Fen:2.53
- Sınav yılı seçimi eklendi (2024 / 2023)

## 🚀 Deployment Durumu
- **Son deploy:** 1 Mart 2026 (22:47) — `npx vercel --prod` → hesapmod.com ✅
- Tüm build'ler exit code 0 ile başarılı.

## 🔜 Sonraki Oturum İçin Notlar
- Bu dosyayı (`AI_NOTES.md`) yeni sohbet başında okutun.
- **2025 YKS sınavı gerçekleştiğinde** YKS/TYT katsayıları güncellenmeli.
- **ALES** yeni dönem açıklandığında `donemKatsayilari` tablosuna yeni satır eklenebilir.
- KPSS için alan testi (Eğitim Bilimleri) inputları eklenirse P2/P3 hesabı genişletilebilir.
- AdSense ve Google Search Console üzerindeki indekslenme durumunu periyodik kontrol edin.

# HesapMod Mobile

Bu klasor, mevcut `Next.js` hesaplayici projesi icin hazirlanmis ilk mobil istemci iskeletidir.

## Amac

- Ayrı bir `Expo` uygulamasi ile mobil kanali hizla acmak
- Web mantigini mobilde test etmek
- Ortak hesaplama cekirdegi icin uygulanabilir bir baslangic vermek

## Bu MVP ne yapiyor?

- Tek ekranda secilebilir hesaplayici kartlari sunuyor
- `KDV Hesaplama`, `Kredi Taksit`, `VKI` araclarini mobil form ile calistiriyor
- Sonuclari cihaz icinde aninda guncelliyor

## Calistirma

Gereksinim:

- Node.js `>= 20.19.4`

```bash
cd mobile
npm install
npm run android
```

Bu komut Windows tarafinda asagidakileri otomatik yapar:

- Uyumlu Node yoksa `C:\Tools\node-v20.20.1-win-x64` altina portable Node indirir
- Android SDK icin `C:\Android\Sdk` ASCII alias'i olusturur
- Gerekirse `system-images;android-35;google_apis;x86_64` indirir
- `HesapModApi35` emulatorden bir AVD olusturur ve boot eder
- Expo'yu calisan mod olarak `--lan` ve `8082` portuyla acip emulatora gonderir

Kok dizinden de ayni akis tek komutla calisir:

```bash
npm run mobile:android
```

Cache temizlemeden daha hizli yeniden acmak istersen:

```bash
cd mobile
npm run android:no-clear
```

veya kok dizinden:

```bash
npm run mobile:android:no-clear
```

Ham Expo davranisini kullanmak istersen:

```bash
cd mobile
npm run android:raw
```

## Sonraki teknik adim

Su an bu klasorde secili araclar icin mobil odakli bir MVP var. Uretime yaklasmak icin en dogru bir sonraki hamle, web ve mobilin ayni formulleri kullandigi ortak bir `shared` hesaplama katmani cikarmak olur.

Play Store'a cikis icin proje bazli durum notu:

- `PLAY_STORE_READINESS.md`

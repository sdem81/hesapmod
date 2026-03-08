# Google Play Store Readiness

Tarih: 2026-03-08

Bu not, paylastigin 2026 checklist'i mevcut `mobile/` MVP klasoru ile eslestirir. Amaç teorik liste degil, proje bazli durum cikarmaktir.

## Mevcut Durum

- Mobil uygulama Expo tabanli MVP olarak hazir.
- Uygulama tip kontrolunden geciyor: `npm run typecheck`
- Gizlilik politikasi canli: `https://www.hesapmod.com/gizlilik-politikasi`
- Kullanim kosullari canli: `https://www.hesapmod.com/kullanim-kosullari`
- KVKK sayfasi canli: `https://www.hesapmod.com/kvkk`
- Iletisim sayfasi canli: `https://www.hesapmod.com/iletisim`
- Uygulama ikon kaynagi var: `mobile/assets/icon.png` ve mevcut boyutu `1024x1024`

## Checklist Eslesmesi

| Madde | Durum | Not |
| --- | --- | --- |
| App icon | Kismi | Kaynak ikon var, ancak store icin marka onayli final `512x512` export alinmali. |
| Feature graphic | Eksik | `1024x500` store gorseli henuz yok. |
| Screenshots | Eksik | Telefon/tablet ekran goruntuleri uretilmedi. |
| Short description | Eksik | Store listing metni yazilmadi. |
| Full description | Eksik | Store listing metni yazilmadi. |
| Privacy policy URL | Hazir | Webde canli sayfa mevcut. |
| Support email | Karar gerekli | README'de `destek@hesapmod.com` aday olarak geciyor, ancak gercekten izlenen adres oldugu dogrulanmali. |
| Signed `.aab` release build | Eksik | Henuz EAS/build/signing akisi kurulmadi. |
| Target SDK / Min SDK | Dogrulama gerekli | Expo build cikisinda kontrol edilmeli; configte acikca pinlenmis degil. |
| Bundle ID / applicationId | Eksik | `app.json` icinde Android package tanimli degil. |
| Play App Signing | Eksik | Play Console tarafinda kurulacak. |
| ProGuard / R8 | Dogrulama gerekli | Release build alindiginda Android cikis ayarlari kontrol edilmeli. |
| Crash / ANR monitoring | Eksik | Firebase Crashlytics, Sentry veya benzeri entegre degil. |
| Data Safety form | Eksik | Console'da doldurulacak; once final SDK listesi sabitlenmeli. |
| Content rating | Eksik | Console adimi. |
| COPPA / CSAE | N/A simdilik | Uygulama su an cocuklara yonelik olarak isaretlenmis degil; yon degisirse ek gereklilikler gelir. |
| Terms of Service | Hazir | Webde canli sayfa mevcut. |
| Ads / IAP | Su an yok | Kod tabaninda mobil reklam veya uygulama ici satin alma yok. |
| Developer verification | Dis bagimlilik | Play Console hesabinda tamamlanacak. |
| Closed test 12 tester / 14 gun | Dis bagimlilik | Yeni kisisel hesap ise repo disi zorunlu surec. |

## Teknik Yorum

- Mobil MVP su an cihaz ici hesaplama yapiyor; hesaplayici girdileri backend'e gonderilmiyor.
- Bu, Data Safety tarafini kolaylastirir; yine de yayinlanan final build'e giren tum SDK'lar beyan edilmelidir.
- Web sitesindeki analytics veya iletisim altyapisi mobil uygulamaya otomatik tasinmis sayilmaz. Mobil uygulamaya eklenen her SDK ayri degerlendirilmelidir.
- Bu makinede Expo web export denemesi Node surumu nedeniyle durdu. `mobile/package.json` icinde gerekli minimum Node surumu `>=20.19.4` olarak not edildi.

## Ilk Submission Oncesi Kritik Bloklar

1. Final `applicationId` sec ve `app.json` icine yaz.
2. EAS veya baska build hatti ile signed release `.aab` uret.
3. Store asset paketi hazirla: icon, feature graphic, telefon ekran goruntuleri.
4. Support email'i netlestir.
5. Crash raporlama ekle.
6. Play Console App Content, Data Safety ve closed testing sureclerini tamamla.

## Onerilen Siralama

1. Marka kararlarini kilitle: app adi, bundle ID, destek e-postasi.
2. Teknik release ayarlarini tamamla: build, signing, versioning, monitoring.
3. Store listing materyallerini hazirla.
4. Closed test surecini baslat.
5. Test tamamlaninca production submission yap.

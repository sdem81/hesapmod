
import React from "react";
import { Metadata } from "next";

const PAGE_URL = "https://www.hesapmod.com/finansal-hesaplamalar/gecmis-doviz-kurlari";
const DATE_MODIFIED = "2026-03-14";

export const metadata: Metadata = {
  title: "Geçmiş Döviz Kurları 2010–2026 — Dolar, Euro ve Sterlin Ortalama Kurları",
  description: "Geçmiş döviz kurları sayfasında 2010–2026 USD, EUR ve GBP/TL ortalamalarını inceleyin. Döviz yatırımının nominal ve reel etkisini tarihsel kur verisiyle karşılaştırın.",
  alternates: {
    canonical: PAGE_URL,
  },
};

const DATA: Record<string, [number, number, number]> = {
  "2026": [43.98, 46.50, 54.50],
  "2025": [36.50, 38.50, 45.50],
  "2024": [32.90, 35.60, 41.80],
  "2023": [23.75, 25.90, 30.10],
  "2022": [16.55, 17.40, 20.50],
  "2021": [8.85, 9.95, 11.80],
  "2020": [7.01, 8.00, 9.05],
  "2019": [5.68, 6.35, 7.30],
  "2018": [4.82, 5.70, 6.50],
  "2017": [3.65, 4.12, 4.80],
  "2016": [3.02, 3.34, 4.06],
  "2015": [2.72, 3.02, 4.18],
  "2014": [2.19, 2.91, 3.58],
  "2013": [1.90, 2.53, 3.01],
  "2012": [1.80, 2.31, 2.86],
  "2011": [1.67, 2.34, 2.68],
  "2010": [1.50, 2.00, 2.35],
};
const YEARS = Object.keys(DATA).sort((a, b) => b.localeCompare(a));

function calcYoY(year: string) {
  const idx = YEARS.indexOf(year);
  if (idx === -1 || idx === YEARS.length - 1) return [null, null, null];
  const cur = DATA[year];
  const prev = DATA[YEARS[idx + 1]];
  return [
    prev ? ((cur[0] - prev[0]) / prev[0]) * 100 : null,
    prev ? ((cur[1] - prev[1]) / prev[1]) * 100 : null,
    prev ? ((cur[2] - prev[2]) / prev[2]) * 100 : null,
  ];
}

export default function Page() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-slate-900">Geçmiş Döviz Kurları 2010–2026 — Dolar, Euro ve Sterlin Ortalama Kurları</h1>
      <section className="mb-8 text-slate-700 space-y-4 leading-relaxed">
        <p>
          Türkiye ekonomisinde döviz kurları ve yıllara göre dolar kuru, alım gücünü ve enflasyonist eğilimleri anlamak için en temel göstergelerden biridir. Türk Lirası, 2010 yılında yalnızca <strong>1.50 USD/TL</strong> seviyesinden işlem görürken, 2026 yılı projeksiyonlarında <strong>43.98 TL</strong> ortalamalarına yaklaşmıştır. Bu durum, aradan geçen yıllar içerisinde dolar karşısında muazzam bir tarihsel değer kaybını işaret etmektedir.
        </p>
        <p>
          Muhasebe, finans ve hukuki işlemlerde genellikle anlık kurlar yerine <strong>yıllık ortalama döviz kurları</strong> (TCMB verilerine dayanan ortalamalar) referans kabul edilir. Sözleşme güncellemeleri, geriye dönük hak edişlerin hesaplanması, kurumlar vergisi veya geçmişe dönük vergi/ceza matrahının enflasyon ve kur bazlı revize edilmesi gibi işlemlerde, doğrudan o yıla ait ortalama kurun alınması yasal ve finansal tutarlılık sağlar.
        </p>
        <p>
          Yalnızca kur farkını enflasyon ile kıyasladığınızda, dolarizasyonun yatırımcılar ve mülk sahipleri tarafından neden bu kadar yaygın bir riskten korunma (hedging) aracı olarak tercih edildiğini net bir şekilde görebilirsiniz. Bu sayfa sayesinde "10 yıl önce elime geçen parayla ne kadar dolar alabilirdim?" sorusunu tam değerleriyle hesaplayabilir, kurdaki yıllık değişim oranlarını görerek finansal projeksiyonlarınızı daha sağlam temellere oturtabilirsiniz.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-slate-900">Yıllık Ortalama Döviz Kurları Tablosu</h2>
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-slate-100 text-slate-700 whitespace-nowrap">
              <tr>
                <th className="px-5 py-4 font-semibold">Yıl</th>
                <th className="px-5 py-4 font-semibold">USD/TL</th>
                <th className="px-5 py-4 font-semibold">EUR/TL</th>
                <th className="px-5 py-4 font-semibold">GBP/TL</th>
                <th className="px-5 py-4 font-semibold">USD YoY (%)</th>
                <th className="px-5 py-4 font-semibold">EUR YoY (%)</th>
                <th className="px-5 py-4 font-semibold">GBP YoY (%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {YEARS.map((year) => {
                const [usd, eur, gbp] = DATA[year];
                const [usdYoY, eurYoY, gbpYoY] = calcYoY(year);
                return (
                  <tr key={year} className="bg-white hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3 font-bold text-slate-900">{year}</td>
                    <td className="px-5 py-3">{usd.toFixed(2)} ₺</td>
                    <td className="px-5 py-3">{eur.toFixed(2)} ₺</td>
                    <td className="px-5 py-3">{gbp.toFixed(2)} ₺</td>
                    <td className="px-5 py-3">
                      {usdYoY !== null ? (
                        <span className={usdYoY > 0 ? "text-red-600 font-medium" : "text-green-600 font-medium"}>
                          {usdYoY > 0 ? "+" : ""}{usdYoY.toFixed(1)}%
                        </span>
                      ) : "—"}
                    </td>
                    <td className="px-5 py-3">
                      {eurYoY !== null ? (
                        <span className={eurYoY > 0 ? "text-red-600 font-medium" : "text-green-600 font-medium"}>
                          {eurYoY > 0 ? "+" : ""}{eurYoY.toFixed(1)}%
                        </span>
                      ) : "—"}
                    </td>
                    <td className="px-5 py-3">
                      {gbpYoY !== null ? (
                        <span className={gbpYoY > 0 ? "text-red-600 font-medium" : "text-green-600 font-medium"}>
                          {gbpYoY > 0 ? "+" : ""}{gbpYoY.toFixed(1)}%
                        </span>
                      ) : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-10 text-slate-700">
        <h2 className="text-2xl font-semibold mb-4 text-slate-900">Kullanım Kılavuzu ve Hesaplama Mantığı</h2>
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-4">
          <div>
            <h3 className="font-bold text-slate-900 mb-1">Veriler Nasıl Hesaplanır?</h3>
            <p>Yıllık değişim (Değer Kaybı/Artışı) her yılın ortalama kurunun bir önceki yıla göre yüzdelik değişimidir. <strong>Formül:</strong> [(Seçilen Yıl Kur Ortalaması − Önceki Yıl Kur Ortalaması) / Önceki Yıl Kur Ortalaması] × 100.</p>
          </div>
          <div>
            <h3 className="font-bold text-slate-900 mb-1">Örnek Kur Değişim Analizi</h3>
            <p>Örneğin 2021 ve 2022 yıllarını ele alalım: 2021 yılında yıllık ortalama Dolar kuru 8.85 TL seviyesindeydi. 2022'de bu ortalama 16.55 TL'ye yükseldi. Araç ve tablo bunu hesaplayarak: <code>(16.55 - 8.85) / 8.85 * 100 = 87%</code>'lik devasa bir yılık artışı kolayca analiz etmenizi sağlar.</p>
          </div>
          <div>
            <h3 className="font-bold text-slate-900 mb-1">Kullanım Alanları</h3>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Sözleşme Revizyonları:</strong> Kira sözleşmesi veya geçmişe dönük şirket borçlandırmalarında spot/günlük kurlar yerine yıllık ortalama çok daha yasal bir dayanak sağlar.</li>
              <li><strong>Maliyet Muhasebesi:</strong> Yurtdışı ile iş yapan firmaların seneler önceki ithalat değerlerini günümüze uyarlaması adına bu oranlar birincil kaynaktır.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-6 text-slate-900">Sıkça Sorulan Sorular</h2>
        <div className="space-y-4">
          <details className="group bg-white border border-slate-200 rounded-xl overflow-hidden [&_summary::-webkit-details-marker]:hidden">
            <summary className="cursor-pointer font-bold px-6 py-4 bg-slate-50 hover:bg-slate-100 flex justify-between items-center transition-colors">
              10 yıl önce (2016'da) dolar ne kadardı?
              <span className="transition duration-300 group-open:-rotate-180 text-blue-600">
                <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
              </span>
            </summary>
            <div className="px-6 py-4 text-slate-700 bg-white">
              <p>2016 yılında dolar (USD/TL) yıllık ortalama olarak yaklaşık 3.02 TL seviyesindeydi. O dönemde 10.000 TL ile yaklaşık 3.310 Dolar alınabiliyorken, bugün aynı miktar TL ile alınabilen döviz tutarı çok daha düşüktür.</p>
            </div>
          </details>
          <details className="group bg-white border border-slate-200 rounded-xl overflow-hidden [&_summary::-webkit-details-marker]:hidden">
            <summary className="cursor-pointer font-bold px-6 py-4 bg-slate-50 hover:bg-slate-100 flex justify-between items-center transition-colors">
              Eski tarihli döviz kurları (geçmiş dolar kuru) nereden alınır?
              <span className="transition duration-300 group-open:-rotate-180 text-blue-600">
                <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
              </span>
            </summary>
            <div className="px-6 py-4 text-slate-700 bg-white">
              <p>Resmi finansal ve hukuki hesaplamalar için Türkiye Cumhuriyet Merkez Bankası (TCMB) tarafından saat 15:30'da açıklanan gösterge niteliğindeki döviz kurları kullanılır. Bu sayfada yansıttığımız değerler, TCMB verilerinin yıl içindeki işlem günleri üzerinden hesaplanan genel yıllık ortalamalarıdır.</p>
            </div>
          </details>
          <details className="group bg-white border border-slate-200 rounded-xl overflow-hidden [&_summary::-webkit-details-marker]:hidden">
            <summary className="cursor-pointer font-bold px-6 py-4 bg-slate-50 hover:bg-slate-100 flex justify-between items-center transition-colors">
              Neden günlük kur yerine yıllık ortalama kur tercih edilmeli?
              <span className="transition duration-300 group-open:-rotate-180 text-blue-600">
                <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
              </span>
            </summary>
            <div className="px-6 py-4 text-slate-700 bg-white">
              <p>Yıl içi oynaklığın çok yüksek olduğu Türkiye gibi piyasalarda (örneğin 2021'de kurun %100'e yakın dalgalanması), herhangi spesifik bir günün kuru tüm yıla ait bir finansal bilançoyu veya kararı ciddi anlamda saptırabilir. Yıllık ortalama, muhasebe dönemselliği ilkesine çok daha uygundur.</p>
            </div>
          </details>
          <details className="group bg-white border border-slate-200 rounded-xl overflow-hidden [&_summary::-webkit-details-marker]:hidden">
            <summary className="cursor-pointer font-bold px-6 py-4 bg-slate-50 hover:bg-slate-100 flex justify-between items-center transition-colors">
              Dolar kuru yatırım aracı mıdır?
              <span className="transition duration-300 group-open:-rotate-180 text-blue-600">
                <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
              </span>
            </summary>
            <div className="px-6 py-4 text-slate-700 bg-white">
              <p>Finansal teoride döviz bir yatırım aracından ziyade bir 'değişim ve değer saklama' aracıdır. Ancak TL'nin yüksek enflasyon karşısında değer kaybetmesi, dövizi pratikte bir korunma (hedging) ve tasarruf yöntemi haline getirmiştir.</p>
            </div>
          </details>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebPage",
              "name": "Geçmiş Döviz Kurları 2010–2026 — Dolar, Euro ve Sterlin Ortalama Kurları",
              "description": "Geçmiş döviz kurları sayfasında 2010–2026 USD, EUR ve GBP/TL ortalamalarını inceleyin. Döviz yatırımının nominal ve reel etkisini tarihsel kur verisiyle karşılaştırın.",
              "url": PAGE_URL,
              "dateModified": DATE_MODIFIED,
              "inLanguage": "tr-TR",
              "isPartOf": {
                "@type": "WebSite",
                "name": "HesapMod",
                "url": "https://www.hesapmod.com"
              }
            },
            {
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Ana Sayfa",
                  "item": "https://www.hesapmod.com"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Finansal Hesaplamalar",
                  "item": "https://www.hesapmod.com/finansal-hesaplamalar"
                },
                {
                  "@type": "ListItem",
                  "position": 3,
                  "name": "Geçmiş Döviz Kurları",
                  "item": PAGE_URL
                }
              ]
            }
          ]
        })
      }} />

      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "10 yıl önce (2016'da) dolar ne kadardı?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "2016 yılında dolar (USD/TL) yıllık ortalama olarak yaklaşık 3.02 TL seviyesindeydi. O dönemde 10.000 TL ile yaklaşık 3.310 Dolar alınabiliyorken, bugün aynı miktar TL ile alınabilen döviz tutarı çok daha düşüktür."
              }
            },
            {
              "@type": "Question",
              "name": "Eski tarihli döviz kurları nereden alınır?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Resmi finansal ve hukuki hesaplamalar için Türkiye Cumhuriyet Merkez Bankası (TCMB) tarafından saat 15:30'da açıklanan gösterge niteliğindeki döviz kurları kullanılır. Bu sayfada yansıttığımız değerler, TCMB verilerinin yıl içindeki işlem günleri üzerinden hesaplanan genel yıllık ortalamalarıdır."
              }
            },
            {
              "@type": "Question",
              "name": "Neden günlük kur yerine yıllık ortalama kur tercih edilmeli?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yıl içi oynaklığın çok yüksek olduğu Türkiye piyasalarında spesifik bir günün kuru tüm yıla ait bilançoyu ciddi saptırabilir. Yıllık ortalama, muhasebe dönemselliği ilkesine uygundur."
              }
            },
            {
              "@type": "Question",
              "name": "Dolar kuru yatırım aracı mıdır?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Finansal teoride değişim ve değer saklama aracıdır. Ancak TL'nin değer kaybetmesi, dövizi pratikte bir korunma ve tasarruf yöntemi haline getirmiştir."
              }
            }
          ]
        })
      }} />
    </main>
  );
}

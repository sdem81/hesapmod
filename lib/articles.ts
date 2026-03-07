export interface Article {
  slug: string;
  title: string;
  description: string;
  category: string;
  categorySlug: string;
  publishedAt: string;
  updatedAt?: string;
  readingTime: number; // dakika
  relatedCalculators: string[]; // calc slug'ları
  content: string; // HTML string
  keywords: string[];
}

export const articles: Article[] = [
  {
    slug: "kidem-tazminati-hesaplama-rehberi",
    title: "2026 Kıdem Tazminatı Hesaplama Rehberi: Tavan, Formül ve Örnekler",
    description:
      "Kıdem tazminatı nedir, kimler alabilir, 2026 tavanı ne kadar? Adım adım formül ve gerçek örneklerle kıdem tazminatınızı hesaplayın.",
    category: "Maaş & Vergi",
    categorySlug: "maas-ve-vergi",
    publishedAt: "2026-03-03",
    updatedAt: "2026-03-07",
    readingTime: 7,
    relatedCalculators: ["kidem-tazminati-hesaplama", "ihbar-tazminati-hesaplama", "maas-hesaplama"],
    keywords: ["kıdem tazminatı", "kıdem tazminatı hesaplama", "kıdem tazminatı tavanı 2026", "kıdem tazminatı nasıl hesaplanır"],
    content: `<h2>Kıdem Tazminatı Nedir?</h2>
<p>Kıdem tazminatı, en az <strong>1 yıl aynı işyerinde çalışmış</strong> ve iş sözleşmesi belirli şartlarla sona eren işçilerin hak kazandığı yasal bir tazminattır. Her tam çalışma yılı için işçinin <strong>30 günlük brüt maaşı</strong> tutarında ödeme yapılır.</p>
<h2>Kimler Kıdem Tazminatı Alabilir?</h2>
<ul>
  <li>İşveren tarafından haksız yere işten çıkarılanlar</li>
  <li>Askerlik, emeklilik veya evlilik nedeniyle istifa edenler (kadınlar için)</li>
  <li>En az 15 yıl sigorta, en az 3600 prim gününü dolduran ve emekliliğe hak kazananlar</li>
  <li>İşçinin ölümü halinde mirasçıları</li>
</ul>
<h2>2026 Kıdem Tazminatı Tavanı</h2>
<p>Kıdem tazminatı tavanı asgari ücrete bağlı olarak <strong>aylık bazda güncellenerek</strong> belirlenmektedir. Hesaplama için kullandığımız hesap makinesi güncel tavan rakamlarını otomatik olarak uygular.</p>
<h2>Kıdem Tazminatı Formülü</h2>
<p><code>Kıdem Tazminatı = (Brüt Maaş / 30) × 30 × Çalışma Yılı</code></p>
<p>Ancak hesaplamada <em>brüt maaşın yanı sıra</em> yemek, yol, ikramiye gibi sürekli yapılan ödemeler de dahil edilmelidir. Ayrıca sonuç, tavan rakamını aşamaz.</p>
<h2>Gerçek Hayat Örneği</h2>
<p>Ahmet Bey 5 yıl 6 ay çalışmış, brüt maaşı 45.000 TL'dir:</p>
<ul>
  <li>Çalışma süresi: 5,5 yıl (5 tam + 6 ay) → 5 + 6/12 = 5,5</li>
  <li>Kıdem Tazminatı: 45.000 × 5,5 = <strong>247.500 TL</strong></li>
</ul>
<p>Bu hesabı otomatik yapmak için aşağıdaki aracımızı kullanabilirsiniz.</p>`,
  },
  {
    slug: "brut-net-maas-farki",
    title: "Brüt Maaş ile Net Maaş Arasındaki Fark: SGK, Gelir Vergisi ve Damga Vergisi",
    description:
      "Brüt maaşınızdan ne kadar kesinti yapıldığını hiç merak ettiniz mi? SGK, işsizlik sigortası, gelir vergisi ve damga vergisi kalemlerini bu rehberle öğrenin.",
    category: "Maaş & Vergi",
    categorySlug: "maas-ve-vergi",
    publishedAt: "2026-03-03",
    updatedAt: "2026-03-07",
    readingTime: 6,
    relatedCalculators: ["bruten-nete-maas-hesaplama", "netten-brute-maas-hesaplama", "asgari-ucret-hesaplama"],
    keywords: ["brüt net maaş farkı", "maaş kesintileri", "SGK kesintisi", "gelir vergisi 2026", "net maaş hesaplama"],
    content: `<h2>Brüt Maaş Nedir?</h2>
<p>Brüt maaş, işverenin iş sözleşmesinde belirlediği <strong>toplam ücret</strong>tir. Vergi ve sigorta kesintileri yapılmadan önceki ham tutardır.</p>
<h2>Net Maaş Nedir?</h2>
<p>Net maaş ise brüt maaştan tüm yasal kesintiler düşüldükten sonra <strong>elinize geçen gerçek tutar</strong>dır.</p>
<h2>Hangi Kesintiler Yapılır?</h2>
<table>
  <thead><tr><th>Kesinti Türü</th><th>Oran</th><th>Kim Öder?</th></tr></thead>
  <tbody>
    <tr><td>SGK İşçi Payı</td><td>%14</td><td>İşçi</td></tr>
    <tr><td>İşsizlik Sigortası (İşçi)</td><td>%1</td><td>İşçi</td></tr>
    <tr><td>SGK İşveren Payı</td><td>%20,5</td><td>İşveren</td></tr>
    <tr><td>İşsizlik Sigortası (İşveren)</td><td>%2</td><td>İşveren</td></tr>
    <tr><td>Gelir Vergisi</td><td>%15–%40</td><td>İşçi (dilime göre)</td></tr>
    <tr><td>Damga Vergisi</td><td>%0,759</td><td>İşçi</td></tr>
  </tbody>
</table>
<h2>Örnek: 50.000 TL Brüt Maaş</h2>
<ul>
  <li>SGK: 50.000 × %14 = 7.000 TL</li>
  <li>İşsizlik Sigortası: 50.000 × %1 = 500 TL</li>
  <li>Vergi Matrahı: 42.500 TL</li>
  <li>Gelir Vergisi (kümülatif dilime göre): ~7.000 TL</li>
  <li>Damga Vergisi: ~323 TL</li>
  <li><strong>Net El Geliri: ~35.177 TL</strong></li>
</ul>
<p>Kesin rakamı hesaplamak için aşağıdaki araçlarımızı kullanın.</p>`,
  },
  {
    slug: "issizlik-maasi-ne-kadar-2026",
    title: "2026 İşsizlik Maaşı Ne Kadar? Başvuru Şartları ve Hesaplama",
    description:
      "İşsizlik ödeneği başvurusu için gerekli şartlar, ne kadar alırsınız ve kaç gün devam eder? 2026 güncel bilgileri ve hesaplama aracı.",
    category: "Maaş & Vergi",
    categorySlug: "maas-ve-vergi",
    publishedAt: "2026-03-03",
    updatedAt: "2026-03-07",
    readingTime: 5,
    relatedCalculators: ["issizlik-maasi-hesaplama", "kidem-tazminati-hesaplama"],
    keywords: ["işsizlik maaşı 2026", "işsizlik ödeneği ne kadar", "işsizlik maaşı başvurusu", "işkur başvuru şartları"],
    content: `<h2>İşsizlik Maaşına Kimler Başvurabilir?</h2>
<p>İşsizlik ödeneği alabilmek için aşağıdaki koşulları sağlamanız gerekir:</p>
<ul>
  <li>Son 120 gün kesintisiz sigortalı çalışmış olmak</li>
  <li>Son 3 yılda en az 600 gün işsizlik sigortası primi ödemiş olmak</li>
  <li><strong>Kendi isteğiyle istifa etmemiş</strong> olmak (zorunlu sebepler hariç)</li>
  <li>İşten çıkış tarihinden itibaren <strong>30 gün içinde</strong> İŞKUR'a başvurmak</li>
</ul>
<h2>İşsizlik Maaşı Miktarı Nasıl Hesaplanır?</h2>
<p>İşsizlik ödeneği, son 4 ay brüt maaşınızın ortalamasının <strong>%40</strong>'ı olarak hesaplanır. Ancak alt ve üst sınır mevcuttur.</p>
<ul>
  <li><strong>Alt Sınır:</strong> Asgari ücretin %80'i</li>
  <li><strong>Üst Sınır:</strong> Asgari ücretin 2 katı</li>
</ul>
<h2>İşsizlik Maaşı Kaç Ay Ödenir?</h2>
<table>
  <thead><tr><th>Prim Ödeme Gün Sayısı</th><th>Ödenek Süresi</th></tr></thead>
  <tbody>
    <tr><td>600 – 899 gün</td><td>6 ay</td></tr>
    <tr><td>900 – 1079 gün</td><td>8 ay</td></tr>
    <tr><td>1080 gün ve üzeri</td><td>10 ay</td></tr>
  </tbody>
</table>
<p>Hızlı ve doğru hesaplama için aşağıdaki İşsizlik Maaşı hesaplayıcımızı kullanabilirsiniz.</p>`,
  },
  {
    slug: "ihbar-tazminati-nedir-nasil-hesaplanir",
    title: "İhbar Tazminatı Nedir? 2026 Hesaplama Formülü ve Örnek",
    description:
      "İhbar süreleri kaç haftadır? İşçi mi öder, işveren mi? İhbar tazminatı hesaplama formülü ve 2026 güncel örnek tablosu.",
    category: "Maaş & Vergi",
    categorySlug: "maas-ve-vergi",
    publishedAt: "2026-03-03",
    updatedAt: "2026-03-07",
    readingTime: 5,
    relatedCalculators: ["ihbar-tazminati-hesaplama", "kidem-tazminati-hesaplama"],
    keywords: ["ihbar tazminatı", "ihbar tazminatı hesaplama 2026", "ihbar süresi kaç hafta", "ihbar tazminatı nasıl hesaplanır"],
    content: `<h2>İhbar Tazminatı Nedir?</h2>
<p>İhbar tazminatı, iş sözleşmesini haklı bir neden olmaksızın ve yasal ihbar sürelerine uymaksızın tek taraflı fesheden tarafın, diğer tarafa ödemek zorunda olduğu tazminattır. Hem işçi hem de işveren bu tazminatı ödemek durumunda kalabilir.</p>
<h2>İhbar Süreleri (2026)</h2>
<table>
  <thead><tr><th>Çalışma Süresi</th><th>İhbar Süresi</th></tr></thead>
  <tbody>
    <tr><td>6 aydan az</td><td>2 hafta</td></tr>
    <tr><td>6 ay – 1,5 yıl</td><td>4 hafta</td></tr>
    <tr><td>1,5 yıl – 3 yıl</td><td>6 hafta</td></tr>
    <tr><td>3 yıldan fazla</td><td>8 hafta</td></tr>
  </tbody>
</table>
<h2>İhbar Tazminatı Formülü</h2>
<p><code>İhbar Tazminatı = Günlük Brüt Maaş × İhbar Süresi (gün)</code></p>
<p>Yani 8 haftalık ihbar süresi için <strong>56 günlük brüt maaş</strong> tutarında ödeme yapılır.</p>
<h2>Örnek Hesaplama</h2>
<p>4 yıl çalışmış, brüt maaşı 40.000 TL olan bir işçi için:</p>
<ul>
  <li>İhbar Süresi: 8 hafta (56 gün)</li>
  <li>Günlük Maaş: 40.000 / 30 ≈ 1.333 TL</li>
  <li>İhbar Tazminatı: 1.333 × 56 = <strong>74.667 TL</strong></li>
</ul>`,
  },
  {
    slug: "yillik-izin-hakki-rehberi",
    title: "2026 Yıllık İzin Hakkı: Kaç Gün İzin Kullanırsınız? Hesaplama Rehberi",
    description:
      "Kaç yıl çalıştığınıza göre yıllık izin hakkınız kaç gün? Kullanılmayan izinler nasıl ücrete dönüşür? 2026 eksiksiz rehber.",
    category: "Maaş & Vergi",
    categorySlug: "maas-ve-vergi",
    publishedAt: "2026-03-03",
    updatedAt: "2026-03-07",
    readingTime: 5,
    relatedCalculators: ["yillik-izin-hesaplama", "yillik-izin-ucreti-hesaplama"],
    keywords: ["yıllık izin hakkı 2026", "yıllık izin kaç gün", "yıllık izin ücreti hesaplama", "izin paraya çevirme"],
    content: `<h2>Yıllık İzin Hakkı Nasıl Belirlenir?</h2>
<p>4857 sayılı İş Kanunu'na göre yıllık ücretli izin süresi, çalışma yılına göre değişir:</p>
<table>
  <thead><tr><th>Çalışma Süresi</th><th>Yıllık İzin Hakkı</th></tr></thead>
  <tbody>
    <tr><td>1 – 5 yıl (dahil)</td><td>14 iş günü</td></tr>
    <tr><td>5 – 15 yıl</td><td>20 iş günü</td></tr>
    <tr><td>15 yıl ve üzeri</td><td>26 iş günü</td></tr>
    <tr><td>18 yaş altı ve 50 yaş üstü</td><td>En az 20 iş günü</td></tr>
  </tbody>
</table>
<h2>Kullanılmayan İzin Paraya Çevrilir mi?</h2>
<p>Türk hukukunda çalışma devam ederken izin paraya çevrilemez. Ancak iş sözleşmesi sona erdiğinde kullanılmamış izin günleri <strong>son brüt günlük maaş üzerinden</strong> nakde dönüştürülür.</p>
<h2>Yıllık İzin Ücreti Formülü</h2>
<p><code>İzin Ücreti = Brüt Maaş / 30 × Kullanılmamış İzin Günü</code></p>
<h2>Örnek</h2>
<p>8 yıl çalışmış, brüt maaşı 35.000 TL olan ve 15 gün izni kalan bir çalışan için:</p>
<ul>
  <li>Günlük Brüt: 35.000 / 30 ≈ 1.167 TL</li>
  <li>İzin Ücreti: 1.167 × 15 = <strong>17.500 TL</strong></li>
</ul>
<p>Hesaplamak için aşağıdaki araçlarımızı kullanın.</p>`,
  },
];

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

export function getAllArticleSlugs(): string[] {
  return articles.map((a) => a.slug);
}

export function getArticlesByCategorySlug(categorySlug: string): Article[] {
  return articles.filter((article) => article.categorySlug === categorySlug);
}

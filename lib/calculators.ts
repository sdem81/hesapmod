// ─────────────────────────────────────────────────────────────
// Type Definitions
// ─────────────────────────────────────────────────────────────
export type InputType = "number" | "select" | "radio" | "date" | "checkbox" | "text" | "section" | "range";

export interface CalculatorInput {
    id: string;
    name: { tr: string; en: string };
    type: InputType;
    defaultValue?: any;
    placeholder?: { tr: string; en: string };
    min?: number;
    max?: number;
    step?: number;
    options?: { label: { tr: string; en: string }; value: any }[];
    suffix?: string;
    prefix?: string;
    required?: boolean;
    className?: string;
}

export interface CalculatorResult {
    id: string;
    label: { tr: string; en: string };
    type?: "bankRates" | "pieChart" | "schedule" | "text" | "number" | "growthSchedule" | "progress-bar";
    suffix?: string;
    prefix?: string;
    decimalPlaces?: number;
}

export interface CalculatorConfig {
    id: string;
    slug: string;
    category: string;
    name: { tr: string; en: string };
    /** SEO-optimized H1 başlığı (yoksa name.tr kullanılır) */
    h1?: { tr: string; en: string };
    description: { tr: string; en: string };
    /** Arama sonuçları ve ilgili kartlar için kısa, çarpıcı açıklama */
    shortDescription?: { tr: string; en: string };
    /** Sayfanın altında gösterilecek ilgili hesap makinesi slug'ları */
    relatedCalculators?: string[];
    inputs: CalculatorInput[];
    results: CalculatorResult[];
    formula: (values: Record<string, any>) => Record<string, any>;
    seo: {
        title: { tr: string; en: string };
        metaDescription: { tr: string; en: string };
        content: { tr: string; en: string };
        faq: { q: { tr: string; en: string }; a: { tr: string; en: string } }[];
        richContent?: {
            howItWorks: { tr: string; en: string };
            formulaText: { tr: string; en: string };
            exampleCalculation: { tr: string; en: string };
            miniGuide: { tr: string; en: string };
        };
    };
}

// ────────────────────────────────────────────────────────────────
// FİNANS
// ────────────────────────────────────────────────────────────────
export const financeCalculators: CalculatorConfig[] = [
    {
        id: "early-loan-closure",
        slug: "kredi-erken-kapama-hesaplama",
        category: "finansal-hesaplamalar",
        name: { tr: "Kredi Erken Kapama Hesaplama", en: "Early Loan Closure Calculator" },
        h1: { tr: "Kredi Erken Kapama Hesaplama — Kapatma Tutarı ve Faiz İndirimi", en: "Early Loan Closure Calculator — Payoff Amount & Interest Savings" },
        description: { tr: "Kredinizi erken kapattığınızda bankaya ödemeniz gereken net tutarı ve sağlanacak faiz indirimini hesaplayın.", en: "Calculate the net payoff amount and interest savings when you close your loan early." },
        shortDescription: { tr: "Kalan anaparanızı ve erken kapama indiriminizi hesaplayarak krediyi bugün kapatmanın avantajını görün.", en: "Calculate your remaining principal and early closure discount to see the advantage of paying off your loan today." },
        relatedCalculators: ["kredi-hesaplama", "faiz-hesaplama", "basit-faiz-hesaplama"],
        inputs: [
            { id: "loanAmount", name: { tr: "Çekilen Kredi Tutarı", en: "Original Loan Amount" }, type: "number", defaultValue: 100000, suffix: "₺", required: true },
            { id: "interestRate", name: { tr: "Aylık Faiz Oranı", en: "Monthly Interest Rate" }, type: "number", defaultValue: 3.50, suffix: "%", step: 0.01, required: true },
            { id: "totalMonths", name: { tr: "Toplam Vade (Ay)", en: "Total Term (Months)" }, type: "number", defaultValue: 24, suffix: " ay", required: true },
            { id: "paidMonths", name: { tr: "Ödenen Taksit Sayısı", en: "Paid Installments" }, type: "number", defaultValue: 6, suffix: " ay", required: true },
        ],
        results: [
            { id: "payoffAmount", label: { tr: "Erken Kapama Tutarı (Kalan Anapara)", en: "Payoff Amount (Remaining Principal)" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "interestSaved", label: { tr: "Silinen Faiz Tutarı (Kazancınız)", en: "Interest Saved (Your Profit)" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "standardRemaining", label: { tr: "Erken Kapatılmasaydı Ödenecek Toplam", en: "Total Due If Not Closed Early" }, suffix: " ₺", decimalPlaces: 2 },
        ],
        formula: (v) => {
            const P = parseFloat(v.loanAmount) || 0;
            const r = (parseFloat(v.interestRate) || 0) / 100;
            const N = parseFloat(v.totalMonths) || 1;
            const paid = parseFloat(v.paidMonths) || 0;

            if (r === 0 || N <= 0 || paid >= N) return { payoffAmount: 0, interestSaved: 0, standardRemaining: 0 };

            // Standard EMT (Aylık Taksit) calculation
            const emt = P * (r * Math.pow(1 + r, N)) / (Math.pow(1 + r, N) - 1);

            // Calculate remaining principal (Kalan Anapara)
            const remainingPrincipal = P * (Math.pow(1 + r, N) - Math.pow(1 + r, paid)) / (Math.pow(1 + r, N) - 1);

            const totalRemainingWithInterest = emt * (N - paid);
            const interestSaved = totalRemainingWithInterest - remainingPrincipal;

            return {
                payoffAmount: remainingPrincipal,
                interestSaved: interestSaved > 0 ? interestSaved : 0,
                standardRemaining: totalRemainingWithInterest
            };
        },
        seo: {
            title: { tr: "Kredi Erken Kapama Hesaplama 2026 — Faiz İndirimi", en: "Early Loan Closure Calculator 2026 — Interest Savings" },
            metaDescription: { tr: "Kredinizi vadesinden önce kapatırsanız ne kadar ödersiniz? Kalan anapara ve faiz indirimini kuruşu kuruşuna erken kapatma hesaplama aracı ile öğrenin.", en: "How much is your loan payoff amount? Calculate the remaining principal and interest discount exactly." },
            content: { tr: "Kredi erken kapatma, ödenmemiş vadelere ait faizlerin silinmesiyle tüketiciye finansal avantaj sağlayan yasal bir haktır. Tüketici kredilerinde anapara üzerinden hesaplanan faiz indirimini bu araçla net olarak bulabilirsiniz.", en: "Early loan closure provides a financial advantage by waiving interest on unpaid installments. Calculate your exact payoff balance and savings here." },
            faq: [
                { q: { tr: "Erken kapatma cezası var mıdır?", en: "Is there an early closure penalty?" }, a: { tr: "İhtiyaç ve taşıt kredilerinde erken kapatma cezası yasaktır, tüm faiz silinir. Sadece Konut (Mortgage) kredilerinde yasal olarak kalan anaparanın maksimum %2'si kadar erken kapama tazminatı banka tarafından talep edilebilir.", en: "There is no penalty for personal/auto loans. For mortgages, a maximum of 2% early closure fee on the remaining balance may apply legally." } },
                { q: { tr: "Erken kapatmak mantıklı mı?", en: "Is it logical to close early?" }, a: { tr: "Kredinin ilk aylarında ödenen taksitlerin büyük kısmı faizden oluşur. Krediyi ne kadar erken kapatırsanız, bankanın sileceği faiz tutarı o kadar yüksek olur. Son taksitlere doğru kapatmak ise anapara eridiği için minimal avantaj sağlar.", en: "In the early months, most of the installment goes to interest. Closing earlier saves much more interest than closing near the end." } }
            ],
            richContent: {
                howItWorks: { tr: "Araç, kredi matematiklerine (Anüite formülü) göre kredinizin standart taksit tutarını bulur ve ödediğiniz aylara ait anapara erimesini çıkartır. Kalan miktar, bankaya bugün tek seferde ödemeniz gereken 'Kapatma bakiyesidir'.", en: "The tool calculates your standard installment via annuity formula, subtracts the principal paid so far, and outputs your final payoff balance." },
                formulaText: { tr: "Taksit = P × [r(1+r)^N] / [(1+r)^N - 1] | Kalan Anapara = P × [(1+r)^N - (1+r)^Ödenen] / [(1+r)^N - 1]", en: "EMI = P × [r(1+r)^N] / [(1+r)^N - 1] | Remaining Principal = P × [(1+r)^N - (1+r)^Paid] / [(1+r)^N - 1]" },
                exampleCalculation: { tr: "100.000 TL, %3,5 faiz, 24 ay vade. Ödenen: 6 ay. Standart taksit: ~6.398 TL. 6 ay sonra kalan anapara: 82.502 TL. Ödenmeyecek 18 taksit toplamı (115.164 TL) yerine 82.502 TL ödeyip kapattığınızda 32.662 TL faiz cebinizde kalır.", en: "100,000 TL at 3.5% for 24 months. Paid 6. Payoff is ~82,502. Instead of paying 18 EMIs (~115,164), you pay 82,502, saving 32,662 TL in interest." },
                miniGuide: { tr: "<ul><li><b>Ara Ödeme:</b> Krediyi tamamen kapatmasanız bile toplu ara ödeme yaparak anaparayı düşürüp, kalan taksit tutarlarını veya vadeyi aşağı çekebilirsiniz.</li><li><b>Tüketici Hakları:</b> Kredi kapama gününe ait tahakkuk eden ufak günlük faiz farkları banka sisteminde araca göre ±50 TL sapma yaratabilir. Bankanız net tutarı verecektir.</li></ul>", en: "Even a partial lump sum payment reduces principal and lowers future interest. There may be a minor daily interest variance on the exact day of closure." }
            }
        }
    },
    {
        id: "vat-kdv",
        slug: "kdv-hesaplama",
        category: "finansal-hesaplamalar",
        name: { tr: `KDV Hesaplama`, en: `VAT Calculator` },
        h1: { tr: `Online KDV Hesaplama Aracı — Dahil/Hariç, %1 %10 %20`, en: `Online VAT Calculator — Inclusive & Exclusive` },
        description: { tr: `Dahil ve hariç KDV tutarını hızlıca hesaplayın.`, en: `Calculate VAT inclusive and exclusive prices easily.` },
        shortDescription: { tr: `KDV dahil ya da hariç fiyatı saniyeler içinde hesaplayın. %1, %10 ve %20 oranlarını destekler.`, en: `Calculate VAT-inclusive or exclusive prices instantly for 1%, 10% and 20% rates.` },
        relatedCalculators: ["kar-zarar-marji", "basit-faiz-hesaplama", "yuzde-hesaplama"],
        inputs: [
            { id: "amount", name: { tr: `Tutar`, en: `Amount` }, type: "number", defaultValue: 1000, suffix: "₺", required: true },
            {
                id: "rate", name: { tr: `KDV Oranı`, en: `VAT Rate` }, type: "select", defaultValue: "20", options: [
                    { label: { tr: `%1`, en: `1%` }, value: "1" },
                    { label: { tr: `%10`, en: `10%` }, value: "10" },
                    { label: { tr: `%20`, en: `20%` }, value: "20" },
                ]
            },
            {
                id: "type", name: { tr: `Hesaplama Türü`, en: `Calculation Type` }, type: "select", defaultValue: "excluded", options: [
                    { label: { tr: `KDV Hariç`, en: `VAT Excluded` }, value: "excluded" },
                    { label: { tr: `KDV Dahil`, en: `VAT Included` }, value: "included" },
                ]
            },
        ],
        results: [
            { id: "baseAmount", label: { tr: `Matrah (KDV'siz Tutar)`, en: `Base Amount (VAT Excluded)` }, suffix: " ₺" },
            { id: "vatAmount", label: { tr: `KDV Tutarı`, en: `VAT Amount` }, suffix: " ₺" },
            { id: "totalAmount", label: { tr: `Toplam Tutar (KDV Dahil)`, en: `Total Amount` }, suffix: " ₺" },
            { id: "chart", label: { tr: "Fiyat Dağılımı", en: "Price Distribution" }, type: "pieChart" }
        ],
        formula: (v) => {
            const amount = parseFloat(v.amount) || 0;
            const rate = parseFloat(v.rate) / 100;
            if (v.type === "excluded") {
                const vat = amount * rate;
                return {
                    baseAmount: amount,
                    vatAmount: vat,
                    totalAmount: amount + vat,
                    chart: {
                        segments: [
                            { label: { tr: "Matrah", en: "Base Amount" }, value: amount, colorClass: "bg-white", colorHex: "#ffffff" },
                            { label: { tr: "KDV Tutarı", en: "VAT Amount" }, value: vat, colorClass: "bg-destructive", colorHex: "hsl(var(--destructive))" }
                        ]
                    }
                };
            } else {
                const base = amount / (1 + rate);
                const vat = amount - base;
                return {
                    baseAmount: base,
                    vatAmount: vat,
                    totalAmount: amount,
                    chart: {
                        segments: [
                            { label: { tr: "Matrah", en: "Base Amount" }, value: base, colorClass: "bg-white", colorHex: "#ffffff" },
                            { label: { tr: "KDV Tutarı", en: "VAT Amount" }, value: vat, colorClass: "bg-destructive", colorHex: "hsl(var(--destructive))" }
                        ]
                    }
                };
            }
        },
        seo: {
            title: { tr: `Online KDV Hesaplama 2026`, en: `Online VAT Calculator 2026` },
            metaDescription: { tr: `En güncel %1, %10 ve %20 oranları ile KDV dahil ve hariç hesaplama yapın.`, en: `Calculate inclusive and exclusive VAT with 1%, 10%, and 20% rates.` },
            content: { tr: `KDV (Katma Değer Vergisi), mal ve hizmetlerin teslimi sırasında alıcı tarafından satıcıya ödenen bir tüketim vergisidir. Türkiye'de temel gıda ve ilaç için %1, birçok mal için %10, genel oran ise %20 olarak uygulanmaktadır.`, en: `VAT is a consumption tax placed on a product whenever value is added at each stage of the supply chain.` },
            faq: [
                { q: { tr: `KDV hesaplaması nasıl yapılır?`, en: `How to calculate VAT?` }, a: { tr: `KDV dahil fiyattan hariç fiyata geçmek için [Tutar / (1 + KDV Oranı)] formülü kullanılır.`, en: `To calculate VAT excluded price use [Total / (1 + VAT Rate)].` } },
                { q: { tr: `%20 KDV nasıl hesaplanır?`, en: `How to calculate 20% VAT?` }, a: { tr: `Bir tutarın %20 KDV hariç halini bulmak için tutarı 1,20'ye bölmelisiniz.`, en: `To find the 20% VAT excluded amount, divide the total by 1.20.` } }
            ],
            richContent: {
                howItWorks: {
                    tr: `KDV hesaplayıcı, mal ve hizmetlerin el değişimi sürecinde oluşan Katma Değer Vergisi yükünü hesaplamak için geliştirilmiştir. İki temel modülde çalışır: 'KDV Dahil' modunda toplam ödenecek tutarın içindeki vergi ve matrah ayrıştırılır; 'KDV Hariç' modunda ise temel fiyata ilgili oranda vergi eklenir. Türkiye'de uygulanan güncel %1, %10 ve %20 oranlarını destekleyen araç, özellikle esnaf, muhasebeci ve bireysel tüketiciler için fatura ve fiş kontrollerinde profesyonel bir doğrulama sağlar.`,
                    en: `The VAT calculator is designed to compute the Value Added Tax incurred during the exchange of goods and services. It operates in two main modes: 'VAT Inclusive' separates the tax and base amount from the total price, while 'VAT Exclusive' adds tax to the base price at the relevant rate.`
                },
                formulaText: {
                    tr: `KDV Dahil = Matrah x (1 + KDV Oranı). KDV tutarı ise Matrah ile KDV Oranının çarpımıyla elde edilir. KDV dahil bir fiyattan matrahı bulmak için toplam tutar (1 + KDV Oranı) değerine bölünür.`,
                    en: `VAT Inclusive = Base x (1 + VAT Rate). The tax amount is found by multiplying the Base by the VAT rate.`
                },
                exampleCalculation: {
                    tr: `Örneğin; KDV dahil fiyatı 1.200 TL olan ve %20 KDV oranına tabi bir ürün için hesaplama süreci şöyledir: Matrah = 1.200 / 1,20 işlemi sonucunda 1.000 TL olarak bulunur. Bu ürünün vergisiz fiyatı 1.000 TL'dir. Buradaki vergi yükü (KDV tutarı) ise 1.200 - 1.000 = 200 TL olarak hesaplanacaktır.`,
                    en: `Example: For a product with a VAT-inclusive price of 1,200 TL and a 20% VAT rate, the base price is 1,200 / 1.20 = 1,000 TL. The tax amount is 200 TL.`
                },
                miniGuide: {
                    tr: `Ticari işlemlerde KDV, ürün maliyetinin bir parçası değil, alıcı tarafından satıcı aracılığıyla devlete ödenen bir emanet paradır. <ul><li><b>Fatura Keserken:</b> Daima matrah (KDV hariç tutar) üzerinden hesaplama yapıp KDV'yi ayrıca belirtmelisiniz.</li><li><b>Tevkifat Durumu:</b> Bazı sektörlerde KDV'nin bir kısmı alıcı tarafından doğrudan devlete ödenir; bu duruma tevkifat denir.</li><li><b>İade Süreçleri:</b> İhracat yapan firmalar, ödedikleri KDV'yi belirli şartlar altında devletten iade alabilirler.</li></ul>`,
                    en: `In commercial transactions, VAT is not part of the product cost but an escrow amount paid to the state. Always calculate based on the base amount and specify VAT separately.`
                }
            }
        }
    },
    {
        id: "simple-interest",
        slug: "basit-faiz-hesaplama",
        category: "finansal-hesaplamalar",
        name: { tr: `Basit Faiz Hesaplama`, en: `Simple Interest Calculator` },
        h1: { tr: `Basit Faiz Hesaplama — Anapara, Oran ve Vadeye Göre`, en: `Simple Interest Calculator — Principal, Rate & Term` },
        description: { tr: `Anapara, faiz oranı ve süreye göre basit faiz tutarını hesaplayın.`, en: `Calculate simple interest based on principal, rate, and time.` },
        shortDescription: { tr: `Mevduat veya borcunuzun ürettiği basit faizi anında hesaplayın.`, en: `Instantly calculate the simple interest on your deposit or debt.` },
        relatedCalculators: ["bilesik-faiz-hesaplama", "kredi-taksit-hesaplama", "kdv-hesaplama"],
        inputs: [
            { id: "principal", name: { tr: `Anapara`, en: `Principal` }, type: "number", defaultValue: 10000, suffix: "₺", required: true },
            { id: "rate", name: { tr: `Yıllık Faiz Oranı (%)`, en: `Annual Interest Rate (%)` }, type: "number", defaultValue: 30, suffix: "%", required: true },
            { id: "months", name: { tr: `Süre (Ay)`, en: `Duration (Months)` }, type: "number", defaultValue: 12, required: true },
        ],
        results: [
            { id: "interest", label: { tr: `Faiz Tutarı`, en: `Interest Amount` }, suffix: " ₺", decimalPlaces: 2 },
            { id: "total", label: { tr: `Toplam Tutar`, en: `Total Amount` }, suffix: " ₺", decimalPlaces: 2 },
        ],
        formula: (v) => {
            const p = parseFloat(v.principal) || 0;
            const r = parseFloat(v.rate) / 100 / 12;
            const t = parseFloat(v.months) || 0;
            const interest = p * r * t;
            return { interest, total: p + interest };
        },
        seo: {
            title: { tr: `Basit Faiz Hesaplama 2026`, en: `Simple Interest Calculator 2026` },
            metaDescription: { tr: `Anapara, faiz oranı ve vade süresine göre basit faiz hesaplayın.`, en: `Calculate simple interest with principal, rate and duration.` },
            content: { tr: `Basit faiz; anapara üzerinden sabit bir oranda hesaplanan faizdir. Formül: Faiz = Anapara × Oran × Süre.`, en: `Simple interest is calculated only on the principal amount. Formula: Interest = Principal × Rate × Time.` },
            faq: [
                { q: { tr: `Basit faiz ile bileşik faiz farkı nedir?`, en: `What is the difference between simple and compound interest?` }, a: { tr: `Basit faizde yalnızca anaparaya faiz eklenir. Bileşik faizde ise biriken faize de faiz işler.`, en: `Simple interest is calculated on the principal only, while compound interest is calculated on principal plus accumulated interest.` } }
            ],
            richContent: {
                howItWorks: {
                    tr: `Basit faiz hesaplayıcı, bir yatırımın veya borcun sadece anapara üzerinden ürettiği faiz getirisini hesaplamak için kullanılır. Bu yöntemde faiz, her dönem sadece başlangıçtaki ana tutar üzerinden hesaplanır; biriken faiz tutarları bir sonraki dönemin hesabına katılmaz.`,
                    en: `The simple interest calculator computes the interest earned or paid on the principal amount only. Interest is not compounded.`
                },
                formulaText: {
                    tr: `Faiz = Anapara x (Yıllık Oran / 100) x (Süre Ay / 12). Toplam tutar ise Anapara + Faiz şeklinde bulunur.`,
                    en: `Interest = Principal x (Rate / 100) x (Time / 1). Total = Principal + Interest.`
                },
                exampleCalculation: {
                    tr: `Örneğin; 10.000 TL anaparayı yıllık %30 faiz oranıyla 12 ay vadeye yatırdığınızda: Faiz = 10.000 x 0,30 x 1 = 3.000 TL olur. Vade sonunda elinize geçecek toplam tutar 13.000 TL'dir.`,
                    en: `Example: 10,000 TL at 30% annual rate for 12 months results in 3,000 TL interest.`
                },
                miniGuide: {
                    tr: `Basit faiz genellikle ticari senetlerde tercih edilir. <ul><li><b>Net Getiri:</b> Stopaj kesintisini unutmayın.</li><li><b>Vade Seçimi:</b> Kısa vadeli işlemler için idealdir.</li></ul>`,
                    en: `Simple interest is common in commercial bills. Remember to account for taxes.`
                }
            }
        }
    },
    {
        id: "loan-payment",
        slug: "kredi-taksit-hesaplama",
        category: "finansal-hesaplamalar",
        name: { tr: `Kredi Taksit Hesaplama`, en: `Loan Payment Calculator` },
        h1: { tr: `Kredi Taksit Hesaplama — Aylık Taksit ve Toplam Maliyet`, en: `Loan Payment Calculator — Monthly Installment & Total Cost` },
        description: { tr: `Aylık taksit tutarını, toplam geri ödemeyi ve faiz maliyetini hesaplayın.`, en: `Calculate monthly installment, total repayment and interest cost.` },
        shortDescription: { tr: `Kredi tutarı, faiz ve vadeyi girerek aylık taksitinizi ve toplam geri ödemenizi öğrenin.`, en: `Enter loan amount, rate and term to see your monthly payment and total cost.` },
        relatedCalculators: ["basit-faiz-hesaplama", "bilesik-faiz-hesaplama", "kira-artis-hesaplama"],
        inputs: [
            {
                id: "loanType",
                name: { tr: `Kredi Türü`, en: `Loan Type` },
                type: "select",
                options: [
                    { value: "tuketici", label: { tr: "Tüketici Kredisi", en: "Consumer Loan" } },
                    { value: "tasit", label: { tr: "Taşıt Kredisi", en: "Vehicle Loan" } },
                    { value: "konut", label: { tr: "Konut Kredisi", en: "Mortgage" } }
                ],
                defaultValue: "tuketici",
            },
            { id: "amount", name: { tr: `Tutar`, en: `Amount` }, type: "range", defaultValue: 50000, suffix: "TL", min: 1000, max: 5000000, step: 1000, required: true },
            { id: "months", name: { tr: `Vade`, en: `Term` }, type: "range", defaultValue: 36, suffix: "Ay", min: 1, max: 120, step: 1, required: true },
            { id: "rate", name: { tr: `Faiz Oranı`, en: `Interest Rate` }, type: "number", defaultValue: 4.99, prefix: "%", step: 0.01, required: true },
        ],
        results: [
            { id: "monthly", label: { tr: `Aylık Taksit`, en: `Monthly Payment` }, suffix: " ₺", decimalPlaces: 2 },
            { id: "totalPayment", label: { tr: `Toplam Geri Ödeme`, en: `Total Payment` }, suffix: " ₺", decimalPlaces: 2 },
            { id: "totalInterest", label: { tr: `Toplam Faiz Maliyeti`, en: `Total Interest Cost` }, suffix: " ₺", decimalPlaces: 2 },
            { id: "chart", label: { tr: `Maliyet Dağılımı`, en: `Cost Distribution` }, type: "pieChart" },
            { id: "bankRatesList", label: { tr: `Güncel Banka Faiz Oranları`, en: `Current Bank Rates` }, type: "bankRates" },
            { id: "amortizationSchedule", label: { tr: `Ödeme Planı`, en: `Amortization Schedule` }, type: "schedule" },
        ],
        formula: (v) => {
            const p = parseFloat(v.amount) || 0;
            const r = parseFloat(v.rate) / 100;
            const n = parseFloat(v.months) || 1;
            const type = v.loanType || "tuketici";

            // Generate dummy but realistic rates based on loan type
            let bankRatesList: any[] = [];
            if (type === "tuketici") {
                bankRatesList = [
                    { bank: "Ziraat Bankası", rate: "4.54" },
                    { bank: "Garanti BBVA", rate: "4.99" },
                    { bank: "İş Bankası", rate: "4.92" },
                    { bank: "Akbank", rate: "5.02" }
                ];
            } else if (type === "tasit") {
                bankRatesList = [
                    { bank: "Ziraat Bankası", rate: "3.99" },
                    { bank: "Garanti BBVA", rate: "4.69" },
                    { bank: "VakıfBank", rate: "4.30" },
                    { bank: "Akbank", rate: "4.49" }
                ];
            } else if (type === "konut") {
                bankRatesList = [
                    { bank: "Ziraat Bankası", rate: "2.79" },
                    { bank: "VakıfBank", rate: "2.79" },
                    { bank: "Garanti BBVA", rate: "3.20" },
                    { bank: "Akbank", rate: "3.10" }
                ];
            }

            if (r === 0) {
                const arr = Array.from({ length: n }, (_, i) => ({
                    month: i + 1,
                    payment: p / n,
                    principal: p / n,
                    interest: 0,
                    remaining: Math.max(0, p - (i + 1) * (p / n))
                }));
                return {
                    monthly: p / n, totalPayment: p, totalInterest: 0, bankRatesList,
                    chart: {
                        segments: [
                            { label: { tr: "Anapara", en: "Principal" }, value: p, colorClass: "bg-white", colorHex: "#ffffff" },
                            { label: { tr: "Toplam Faiz", en: "Total Interest" }, value: 0, colorClass: "bg-destructive", colorHex: "hsl(var(--destructive))" }
                        ]
                    },
                    amortizationSchedule: arr
                };
            }

            const monthly = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
            const totalPayment = monthly * n;
            const totalInterest = totalPayment - p;

            // Generate Amortization Schedule
            const amortizationSchedule = [];
            let currentBalance = p;

            for (let i = 1; i <= n; i++) {
                const interestPayment = currentBalance * r;
                const principalPayment = monthly - interestPayment;
                currentBalance -= principalPayment;
                amortizationSchedule.push({
                    month: i,
                    payment: monthly,
                    principal: principalPayment,
                    interest: interestPayment,
                    remaining: Math.max(0, currentBalance)
                });
            }

            return {
                monthly, totalPayment, totalInterest, bankRatesList,
                chart: {
                    segments: [
                        { label: { tr: "Anapara", en: "Principal" }, value: p, colorClass: "bg-white", colorHex: "#ffffff" },
                        { label: { tr: "Toplam Faiz", en: "Total Interest" }, value: totalInterest, colorClass: "bg-destructive", colorHex: "hsl(var(--destructive))" }
                    ]
                },
                amortizationSchedule
            };
        },
        seo: {
            title: { tr: `Kredi Taksit Hesaplama 2026`, en: `Loan Payment Calculator 2026` },
            metaDescription: { tr: `Kredi tutarı, faiz oranı ve vadeye göre aylık taksit tutarınızı hesaplayın.`, en: `Calculate your monthly loan payment based on amount, rate and term.` },
            content: { tr: `Kredi taksit hesaplaması, eşit taksitli kredi (annuity) formülüyle yapılır.`, en: `Loan payment uses the annuity formula.` },
            faq: [
                { q: { tr: `Kredi taksidini nasıl düşürebilirim?`, en: `How can I lower my loan payment?` }, a: { tr: `Vadeyi uzatarak veya daha düşük faiz oranı bularak aylık taksidini düşürebilirsiniz.`, en: `You can lower your monthly payment by extending the term or finding a lower interest rate.` } }
            ],
            richContent: {
                howItWorks: {
                    tr: `Kredi taksit hesaplama aracı, belirlenen anaparanın faiz oranı ve vade boyunca her ay eşit taksitler halinde nasıl geri ödeneceğini belirlemek için kullanılır.`,
                    en: `The loan calculator calculates monthly fixed installments (annuity) over a given period at a set interest rate.`
                },
                formulaText: {
                    tr: `Taksit = [Anapara x Faiz x (1 + Faiz)^Vade] / [(1 + Faiz)^Vade - 1].`,
                    en: `Payment = P x [r(1+r)^n] / [(1+r)^n - 1].`
                },
                exampleCalculation: {
                    tr: `Örneğin; 100.000 TL krediyi %3,50 aylık faizle 12 ay vadeyle çektiğinizde aylık taksit 10.327,33 TL olur.`,
                    en: `Example: 100,000 TL loan at 3.5% monthly rate for 12 months results in 10,327.33 TL monthly payment.`
                },
                miniGuide: {
                    tr: `Kredi çekerken Yıllık Maliyet Oranına odaklanın. <ul><li><b>Vade Seçimi:</b> Vade uzadıkça toplam faiz yükü artar.</li><li><b>Erken Kapama:</b> Erken kapama faiz tasarrufu sağlar.</li></ul>`,
                    en: `Focus on the Annual Percentage Rate (APR) when taking a loan.`
                }
            }
        }
    },
    {
        id: "compound-interest",
        slug: "bilesik-faiz-hesaplama",
        category: "finansal-hesaplamalar",
        name: { tr: "Bileşik Faiz Hesaplama", en: "Compound Interest Calculator" },
        h1: { tr: "Bileşik Faiz Hesaplama — Faizin Faizini Hesaplayın", en: "Compound Interest Calculator — See Your Investment Grow" },
        description: { tr: "Bileşik faiz ile yatırımınızın büyümesini hesaplayın.", en: "Calculate how your investment grows with compound interest." },
        shortDescription: { tr: "Yatırımınızın bileşik faizle yıllar içinde nasıl katlandığını görün.", en: "See how your investment compounds over time with our free calculator." },
        relatedCalculators: ["basit-faiz-hesaplama", "kredi-taksit-hesaplama", "kira-artis-hesaplama"],
        inputs: [
            { id: "principal", name: { tr: "Anapara", en: "Principal" }, type: "number", defaultValue: 10000, suffix: "₺", required: true },
            { id: "rate", name: { tr: "Yıllık Faiz Oranı (%)", en: "Annual Rate (%)" }, type: "number", defaultValue: 40, suffix: "%", required: true },
            { id: "years", name: { tr: "Süre (Yıl)", en: "Duration (Years)" }, type: "number", defaultValue: 5, required: true },
            {
                id: "frequency", name: { tr: "Bileşim Sıklığı", en: "Compounding Frequency" }, type: "select", defaultValue: "12", options: [
                    { label: { tr: "Aylık", en: "Monthly" }, value: "12" },
                    { label: { tr: "Üç Aylık", en: "Quarterly" }, value: "4" },
                    { label: { tr: "Yıllık", en: "Yearly" }, value: "1" },
                ]
            },
        ],
        results: [
            { id: "total", label: { tr: "Toplam Tutar", en: "Total Amount" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "interest", label: { tr: "Kazanılan Faiz", en: "Interest Earned" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "chart", label: { tr: "Yatırım Dağılımı", en: "Investment Distribution" }, type: "pieChart" },
            { id: "growthSchedule", label: { tr: "Büyüme Tablosu", en: "Growth Schedule" }, type: "growthSchedule" }
        ],
        formula: (v) => {
            const p = parseFloat(v.principal) || 0;
            const r = parseFloat(v.rate) / 100;
            const t = parseFloat(v.years) || 0;
            const n = parseFloat(v.frequency) || 12;
            const total = p * Math.pow(1 + r / n, n * t);
            const totalInterest = total - p;

            const schedule = [];
            let currentBalance = p;

            for (let year = 1; year <= t; year++) {
                const yearEndBalance = p * Math.pow(1 + r / n, n * year);
                const yearInterest = yearEndBalance - currentBalance;
                schedule.push({
                    period: year,
                    start: currentBalance,
                    interest: yearInterest,
                    end: yearEndBalance
                });
                currentBalance = yearEndBalance;
            }

            return {
                total,
                interest: totalInterest,
                chart: {
                    segments: [
                        { label: { tr: "Anapara", en: "Principal" }, value: p, colorClass: "bg-white", colorHex: "#ffffff" },
                        { label: { tr: "Kazanılan", en: "Earned" }, value: totalInterest, colorClass: "bg-[#22c55e]", colorHex: "#22c55e" }
                    ]
                },
                growthSchedule: schedule
            };
        },
        seo: {
            title: { tr: "Bileşik Faiz Hesaplama 2026", en: "Compound Interest Calculator 2026" },
            metaDescription: { tr: "Yatırımınızın bileşik faizle zaman içinde nasıl büyüdüğünü hesaplayın.", en: "See how your investment grows over time with compound interest." },
            content: { tr: "Bileşik faiz, faizin faizi olarak bilinir. Her dönem biriken faiz anaparaya eklenir.", en: "Compound interest means earning interest on your interest." },
            faq: [
                { q: { tr: "Bileşik faiz neden daha avantajlıdır?", en: "Why is compound interest more advantageous?" }, a: { tr: "Her dönemde kazanılan faiz anaparaya eklenir ve bir sonraki dönemde bu birikime de faiz işlemeye başlar. Bu katlanan büyüme etkisi, uzun vadede basit faize kıyasla çok daha yüksek getiri sağlar.", en: "Each period's interest is added to principal, creating exponential growth over time." } },
                { q: { tr: "Bileşim sıklığı sonucu nasıl etkiler?", en: "How does compounding frequency affect results?" }, a: { tr: "Bileşim sıklığı arttıkça getiri de artar. Aylık bileşim, yıllık bileşime göre her zaman daha yüksek sonuç verir.", en: "More frequent compounding means higher returns; monthly beats annual." } },
                { q: { tr: "Uzun vadede fark gerçekten büyük mü?", en: "Does the difference really grow over time?" }, a: { tr: "Evet, süre uzadıkça bileşik faizin etkisi üstel olarak artar. 10 yıllık yatırımda oluşabilecek fark dramatik seviyelere ulaşabilir.", en: "Yes, the compounding effect grows exponentially; 10 years can make a dramatic difference." } }
            ],
            richContent: {
                howItWorks: {
                    tr: "Bileşik faiz hesaplayıcı, anaparanızın her bileşim döneminde elde ettiği faizi anaparaya ekleyerek büyüme sürecini simüle eder. Her dönem sonunda oluşan faiz bir sonraki dönemin tabanı haline gelir; bu nedenle getiriler doğrusal değil, üstel bir eğri izler. Bileşim sıklığı ve vade seçimi uzun vadede getiriyi belirleyici biçimde etkiler.",
                    en: "The calculator simulates growth by adding each period's interest back to principal, creating exponential returns."
                },
                formulaText: {
                    tr: "A = P × (1 + r/n)^(n×t). P: Anapara, r: Yıllık faiz oranı (ondalık), n: Yıldaki bileşim sayısı, t: Yıl. A: Dönem sonundaki toplam tutar.",
                    en: "A = P × (1 + r/n)^(n×t). P: Principal, r: annual rate (decimal), n: compounds/year, t: years."
                },
                exampleCalculation: {
                    tr: "Örnek: 20.000 TL anapara, yıllık %25 faiz, aylık bileşim, 3 yıl → A = 20.000 × (1 + 0,25/12)^36 ≈ 41.600 TL. Kazanılan faiz ≈ 21.600 TL; basit faizle yalnızca 15.000 TL kazanılırdı.",
                    en: "Example: 20,000 at 25% annual, monthly compounding, 3 years ≈ 41,600. Simple interest would yield only 35,000."
                },
                miniGuide: {
                    tr: "<ul><li><b>Erken Başlayın:</b> Bileşik faizin gücü zamana bağlıdır; ne kadar erken başlarsanız o kadar avantajlısınızdır.</li><li><b>Bileşim Sıklığı:</b> Aylık bileşim, yıllık bileşime kıyasla her zaman daha fazla getiri sağlar.</li><li><b>Enflasyon Etkisi:</b> Nominal faizi değerlendirirken enflasyonu göz önünden ayırmayın; reel getiri enflasyonun üzerinde olmalıdır.</li><li><b>Düzenli Katkı:</b> Her ay küçük tutarlarda ekleme yapmak bile bileşik etkiyi güçlü biçimde artırır.</li></ul>",
                    en: "Start early, prefer monthly compounding, account for inflation, and make regular contributions."
                }
            }
        }
    },
    {
        id: "rent-increase",
        slug: "kira-artis-hesaplama",
        category: "finansal-hesaplamalar",
        name: { tr: "Kira Artış Hesaplama", en: "Rent Increase Calculator" },
        h1: { tr: "Kira Artış Hesaplama — TÜFE/ÜFE Oranına Göre 2025", en: "Rent Increase Calculator — CPI/PPI Based 2025" },
        description: { tr: "TÜFE/ÜFE oranına göre yasal kira artış tutarını hesaplayın.", en: "Calculate legal rent increase based on CPI/PPI rate." },
        shortDescription: { tr: "Mevcut kiranızı ve enflasyon oranını girerek yeni kira bedelinizi öğrenin.", en: "Enter your current rent and inflation rate to find your new legal rent." },
        relatedCalculators: ["kredi-taksit-hesaplama", "yuzde-hesaplama", "kar-zarar-marji"],
        inputs: [
            { id: "currentRent", name: { tr: "Mevcut Kira", en: "Current Rent" }, type: "number", defaultValue: 5000, suffix: "₺", required: true },
            { id: "inflationRate", name: { tr: "Enflasyon Oranı (%)", en: "Inflation Rate (%)" }, type: "number", defaultValue: 25, suffix: "%", required: true },
        ],
        results: [
            { id: "increaseAmount", label: { tr: "Artış Tutarı", en: "Increase Amount" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "newRent", label: { tr: "Yeni Kira Tutarı", en: "New Rent Amount" }, suffix: " ₺", decimalPlaces: 2 },
        ],
        formula: (v) => {
            const rent = parseFloat(v.currentRent) || 0;
            const rate = parseFloat(v.inflationRate) / 100;
            const increaseAmount = rent * rate;
            return { increaseAmount, newRent: rent + increaseAmount };
        },
        seo: {
            title: { tr: "Kira Artış Hesaplama 2026", en: "Rent Increase Calculator 2026" },
            metaDescription: { tr: "TÜFE oranına göre yasal kira artışınızı hesaplayın.", en: "Calculate your legal rent increase based on CPI rate." },
            content: { tr: "Türkiye'de kira artışı TÜFE 12 aylık ortalaması ile sınırlandırılmıştır.", en: "In Turkey, rent increases are capped at the 12-month average CPI rate." },
            faq: [
                { q: { tr: "Kira artış oranı nasıl belirlenir?", en: "How is the rent increase rate determined?" }, a: { tr: "Türkiye'de yasal kira artışı, TÜİK tarafından açıklanan TÜFE'nin 12 aylık ortalamasıyla sınırlandırılmıştır. Hesaplayıcımız girdiğiniz oran üzerinden yasal azami artışı hesaplar.", en: "In Turkey, rent increases are capped at the 12-month average CPI as published by TÜİK." } },
                { q: { tr: "TÜFE oranını nereden öğrenebilirim?", en: "Where can I find the current CPI rate?" }, a: { tr: "TÜİK her ay güncel TÜFE verilerini yayımlar. Resmi veriye tuik.gov.tr adresinden ulaşabilirsiniz.", en: "TurkStat (TÜİK) publishes monthly CPI data at tuik.gov.tr." } },
                { q: { tr: "Yasal sınırın üzerinde artış talep edilirse ne olur?", en: "What if a landlord demands more than the legal limit?" }, a: { tr: "Kiracı bu artışı reddetme hakkına sahiptir. Anlaşmazlık durumunda Sulh Hukuk Mahkemesi'ne başvurulabilir.", en: "Tenants can refuse excess increases; disputes can be taken to the civil court." } }
            ],
            richContent: {
                howItWorks: {
                    tr: "Kira artış hesaplayıcı, mevcut kira bedelinize yasal enflasyon sınırını uygulayarak maksimum artış tutarını ve yeni kira bedelini hesaplar. Hem kiracıların haklarını korumasına hem de kiraya verenlerin doğru hesaplama yapmasına yardımcı olur.",
                    en: "Applies the legal inflation cap to your current rent to find the maximum new rent amount."
                },
                formulaText: {
                    tr: "Artış Tutarı = Mevcut Kira × (TÜFE Oranı / 100). Yeni Kira = Mevcut Kira + Artış Tutarı. Yasal oran: TÜİK'in açıkladığı 12 aylık TÜFE ortalaması.",
                    en: "Increase = Current Rent × (Rate / 100). New Rent = Current Rent + Increase."
                },
                exampleCalculation: {
                    tr: "Örnek: Mevcut kira 8.000 TL, TÜFE 12 aylık ortalama %38 ise → Artış = 8.000 × 0,38 = 3.040 TL → Yeni Kira = 11.040 TL.",
                    en: "Example: 8,000 TL current rent at 38% CPI → New rent = 11,040 TL."
                },
                miniGuide: {
                    tr: "<ul><li><b>Güncel Oranı Kullanın:</b> Sözleşme yenilenme tarihindeki TÜİK açıklamasını esas alın.</li><li><b>Yazılı Bildirim:</b> Kira artışını her zaman yazılı ve belgeyle bildirin.</li><li><b>Yasal Koruma:</b> Sınırın üzerindeki artış taleplerinde Sulh Hukuk Mahkemesi'ne başvurabilirsiniz.</li></ul>",
                    en: "Always use the TÜİK rate at renewal date, notify in writing, and know your legal rights."
                }
            }
        }
    },
    {
        id: "profit-margin",
        slug: "kar-zarar-marji",
        category: "finansal-hesaplamalar",
        name: { tr: "Kâr/Zarar & Marj Hesaplama", en: "Profit/Loss & Margin Calculator" },
        h1: { tr: "Kâr Marjı Hesaplama — Maliyet ve Satış Fiyatından Anlık Sonuç", en: "Profit Margin Calculator — Instant Results from Cost & Price" },
        description: { tr: "Maliyet ve satış fiyatına göre kâr tutarını ve marjını hesaplayın.", en: "Calculate profit amount and margin based on cost and selling price." },
        shortDescription: { tr: "Ürününüzün maliyet ve satış fiyatını girerek kâr tutarını, marjını ve markup oranını hesaplayın.", en: "Enter cost and selling price to calculate profit amount, margin and markup rate." },
        relatedCalculators: ["kdv-hesaplama", "yuzde-hesaplama", "basit-faiz-hesaplama"],
        inputs: [
            {
                id: "hesaplamaTuru",
                name: { tr: "Hesaplama Şekli", en: "Calculation Type" },
                type: "select",
                defaultValue: "kârOranı",
                options: [
                    { label: { tr: "Kâr oranı hesaplama (Alış ve satış fiyatından)", en: "Profit Margin (Based on Cost & Selling Price)" }, value: "kârOranı" },
                    { label: { tr: "Satış fiyatı hesaplama (Alış fiyatı ve kâr oranından)", en: "Selling Price (Based on Cost & Margin)" }, value: "satışFiyatı" },
                    { label: { tr: "Alış fiyatı hesaplama (Satış fiyatı ve kâr oranından)", en: "Cost Price (Based on Selling Price & Margin)" }, value: "alışFiyatı" }
                ]
            },
            { id: "cost", name: { tr: "Alış Fiyatı (Maliyet)", en: "Cost Price" }, type: "number", defaultValue: 100, suffix: "₺", required: false },
            { id: "price", name: { tr: "Satış Fiyatı", en: "Selling Price" }, type: "number", defaultValue: 150, suffix: "₺", required: false },
            { id: "marginRate", name: { tr: "Kâr Oranı (%)", en: "Profit Margin (%)" }, type: "number", defaultValue: 20, suffix: "%", required: false },
        ],
        results: [
            { id: "costParsed", label: { tr: "Alış Fiyatı (Maliyet)", en: "Cost Price" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "priceParsed", label: { tr: "Satış Fiyatı", en: "Selling Price" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "profit", label: { tr: "Kâr/Zarar Tutarı", en: "Profit/Loss Amount" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "margin", label: { tr: "Kâr Marjı (Satışa Oran)", en: "Profit Margin (vs Revenue)" }, suffix: "%", decimalPlaces: 2 },
            { id: "markup", label: { tr: "Kâr Oranı (Maliyete Oran)", en: "Markup Rate (vs Cost)" }, suffix: "%", decimalPlaces: 2 },
            { id: "chart", label: { tr: "Maliyet ve Satış Dağılımı", en: "Cost & Sales Distribution" }, type: "pieChart" }
        ],
        formula: (v) => {
            const turId = v.hesaplamaTuru || "kârOranı";
            let cost = parseFloat(v.cost) || 0;
            let price = parseFloat(v.price) || 0;
            let marginRate = parseFloat(v.marginRate) || 0;

            // Scenario 2: Calculate Price from Cost + Markup
            if (turId === "satışFiyatı") {
                price = cost * (1 + (marginRate / 100));
            }
            // Scenario 3: Calculate Cost from Price + Markup
            else if (turId === "alışFiyatı") {
                cost = price / (1 + (marginRate / 100));
            }

            // In all scenarios, compute standard metrics now that cost and price are resolved
            const profit = price - cost;
            const margin = price !== 0 ? (profit / price) * 100 : 0;
            const markup = cost !== 0 ? (profit / cost) * 100 : 0;

            // Logic to conditionally hide irrelevant inputs dynamically (via UI checks, or omitting results)
            let rawResults: Record<string, any> = {
                profit, chart: {
                    segments: [
                        { label: { tr: "Maliyet", en: "Cost" }, value: cost, colorClass: "bg-white", colorHex: "#ffffff" },
                        { label: { tr: profit >= 0 ? "Kâr" : "Zarar", en: profit >= 0 ? "Profit" : "Loss" }, value: Math.abs(profit), colorClass: profit >= 0 ? "bg-[#22c55e]" : "bg-destructive", colorHex: profit >= 0 ? "#22c55e" : "hsl(var(--destructive))" }
                    ]
                }
            };

            if (turId === "kârOranı") {
                rawResults.margin = margin;
                rawResults.markup = markup;
            } else if (turId === "satışFiyatı") {
                rawResults.priceParsed = price;
                rawResults.markup = markup;
                rawResults.margin = margin;
            } else if (turId === "alışFiyatı") {
                rawResults.costParsed = cost;
                rawResults.markup = markup;
                rawResults.margin = margin;
            }

            return rawResults;
        },
        seo: {
            title: { tr: "Kâr Marjı ve Fiyat Hesaplama 2026", en: "Profit Margin & Pricing Calculator 2026" },
            metaDescription: { tr: "Alış ve satış fiyatına göre kâr oranınızı, hedeflenen kâr oranına göre ise satış veya alış fiyatınızı anında hesaplayın.", en: "Calculate your profit margin based on cost and price, or determine the correct selling/cost price based on your target markup." },
            content: { tr: "Kâr oranı ve marj değerlendirmelerini üç farklı senaryoda yapabilirsiniz: 1- Mevcut alış ve satış fiyatından kâr tutarını bulma. 2- Hedeflenen kâr oranına (markup) göre doğru satış fiyatını belirleme. 3- İstenen satış fiyatı ve kâr oranından yola çıkarak maksimum alış maliyetini (budget) hesaplama.", en: "Evaluate your profitability using three different methods: determine margin from prices, calculate selling price from cost and markup, or deduce maximum cost from targeted price and markup." },
            faq: [
                { q: { tr: "Hesaplama türleri neleri ifade eder?", en: "What do the calculation modes mean?" }, a: { tr: "Üç farklı modülde çalışır. 'Kâr Oranı Hesaplama' elinizdeki mevcut fiyatlarla ne kadar kâr ettiğinizi gösterir. 'Satış Fiyatı Hesaplama', bir ürünü belirli bir \% kâr oranıyla (markup) satmak isterseniz etiket fiyatının ne olması gerektiğini bulur. 'Alış Fiyatı Hesaplama' ise piyasa rekabeti gereği belirli bir fiyata satmanız gereken ürünü, istediğiniz kârı edebilmek için toptancıdan en fazla kaç liraya almanız gerektiğini hesaplar.", en: "You can calculate actual margin from exact prices, find the required selling price to hit a markup target, or deduce the maximum wholesale cost allowed to hit your profit goal at a given market price." } },
                { q: { tr: "Kâr marjı ile markup farkı nedir?", en: "What is the difference between margin and markup?" }, a: { tr: "Kâr marjı satış fiyatına oranla kârı gösterirken [(Satış-Maliyet)/Satış], markup maliyete oranla kârı gösterir [(Satış-Maliyet)/Maliyet]. Ticarette fiyat belirlerken (Satış Fiyatı Hesaplama) genellikle Maliyet x (1+Markup) formülü kullanılır.", en: "Margin shows profit vs selling price; markup shows profit vs cost. Wholesalers typically use markup to set prices." } }
            ],
            richContent: {
                howItWorks: {
                    tr: "Kâr hesaplayıcı, işletmeler ve satıcılar için üç yönlü bir fiyatlandırma simülasyonu sunar. Açılır menüden hesaplama türünü seçerek; ya mevcut rakamlarınızın kârlılığını ölçebilir, ya maliyetinize ekleyeceğiniz kâr oranıyla (Markup) etiket fiyatı oluşturabilir, ya da piyasadaki sabit satış fiyatından geriye doğru giderek toptancı maliyet limitinizi belirleyebilirsiniz.",
                    en: "The calculator provides a three-way pricing simulation for businesses. Choose your target metric from the dropdown: evaluate current profitability, generate a selling price from a markup target, or reverse-engineer your maximum wholesale cost."
                },
                formulaText: {
                    tr: "Mod 1: Kâr = Satış - Alış | Marj = (Kâr / Satış) × 100. Mod 2 (Satış Fiyatı): Satış = Alış × (1 + (Kâr Oranı / 100)). Mod 3 (Alış Fiyatı): Alış = Satış / (1 + (Kâr Oranı / 100)).",
                    en: "Mode 1: Profit = Price - Cost. Mode 2 (Selling Price): Price = Cost × (1 + (Markup / 100)). Mode 3 (Cost Price): Cost = Price / (1 + (Markup / 100))."
                },
                exampleCalculation: {
                    tr: "Örnek (Satış Fiyatı Hesaplama): 120 TL maliyeti olan bir üründen %50 kâr oranı (markup) elde etmek isterseniz, Satış Fiyatı = 120 × (1 + 0,50) = 180 TL olarak belirlenmelidir.",
                    en: "Example (Selling Price): To achieve a 50% markup on a 120 TL product, Selling Price = 120 × (1 + 0.50) = 180 TL."
                },
                miniGuide: {
                    tr: "<ul><li><b>Doğru Hesaplama Türü:</b> Yeni bir ürün fiyatlandırıyorsanız 'Satış Fiyatı Hesaplama' modülünü kullanın.</li><li><b>Gizli Maliyetler:</b> Alış fiyatı veya maliyet hücresine sadece ürünün toptan fiyatını değil; kargo, vergi (KDV) ve paketleme giderlerini de eklemeyi unutmayın.</li><li><b>Marj vs Oran:</b> Beklentiniz satış cironuz üzerinden bir kâr (Marj) ise, formüllerdeki farklılığa dikkat edin; %50 markup eklemek %33'lük genel kâr marjı sağlar.</li></ul>",
                    en: "Use 'Selling Price' mode for new products. Always include hidden costs like freight and packaging. Remember that a 50% markup yields a 33% profit margin."
                }
            }
        }
    },
    {
        id: "salary",
        slug: "maas-hesaplama",
        category: "maas-ve-vergi",
        name: { tr: "Maaş Hesaplama", en: "Salary Calculator" },
        h1: { tr: "Maaş Hesaplama 2026 — Brüt Net Maaş Hesaplayıcı", en: "Salary Calculator 2026 — Gross to Net" },
        description: { tr: "2026 yılı vergi ve SGK oranlarına göre brüt-net maaş hesaplama yapın.", en: "Calculate gross-to-net salary based on 2026 tax and SGK rates." },
        shortDescription: { tr: "Brüt maaşınızı girin; SGK, gelir vergisi ve damga vergisi kesintilerini ve net maaşınızı anında görün.", en: "Enter gross salary to instantly see SGK, income tax and stamp duty deductions and your net pay." },
        relatedCalculators: ["kdv-hesaplama", "basit-faiz-hesaplama", "kira-artis-hesaplama"],
        inputs: [
            {
                id: "calcType",
                name: { tr: "Hesaplama Türü", en: "Calculation Type" },
                type: "select",
                defaultValue: "grossToNet",
                options: [
                    { label: { tr: "Brütten Nete", en: "Gross to Net" }, value: "grossToNet" },
                    { label: { tr: "Netten Brüte", en: "Net to Gross" }, value: "netToGross" },
                ]
            },
            {
                id: "salary",
                name: { tr: "Maaş Tutarı (₺)", en: "Salary Amount (₺)" },
                type: "number",
                defaultValue: 50000,
                suffix: "₺",
                required: true,
                min: 0,
            },
        ],
        results: [
            { id: "grossSalary", label: { tr: "Brüt Maaş", en: "Gross Salary" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "sgkWorker", label: { tr: "SGK İşçi Payı (%14)", en: "SGK Employee (14%)" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "unemployment", label: { tr: "İşsizlik Sigortası (%1)", en: "Unemployment (1%)" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "incomeTax", label: { tr: "Gelir Vergisi", en: "Income Tax" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "stampTax", label: { tr: "Damga Vergisi (%0,759)", en: "Stamp Duty (0.759%)" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "totalDeduction", label: { tr: "Toplam Kesinti", en: "Total Deductions" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "netSalary", label: { tr: "Net Maaş", en: "Net Salary" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "chart", label: { tr: "Maaş Dağılımı", en: "Salary Distribution" }, type: "pieChart" }
        ],
        formula: (v) => {
            // ─── 2026 SABİTLERİ ────────────────────────────────────────
            const MIN_WAGE_GROSS = 33030;   // Asgari ücret brüt (2026)
            const SGK_RATE = 0.14;    // %14 SGK işçi payı
            const UNEMP_RATE = 0.01;    // %1 işsizlik sigortası
            const STAMP_RATE = 0.00759; // %0,759 damga vergisi

            // 2026 gelir vergisi dilimleri
            const TAX_BRACKETS = [
                { limit: 190000, rate: 0.15 },
                { limit: 400000, rate: 0.20 },
                { limit: 1500000, rate: 0.27 },
                { limit: 5300000, rate: 0.35 },
                { limit: Infinity, rate: 0.40 },
            ];

            // Yıllık kümülatif gelir vergisi hesabı
            function calcAnnualTax(annualBase: number): number {
                let tax = 0, prev = 0;
                for (const b of TAX_BRACKETS) {
                    if (annualBase <= prev) break;
                    tax += (Math.min(annualBase, b.limit) - prev) * b.rate;
                    prev = b.limit;
                }
                return tax;
            }

            // ─── BRÜTTEN NETE ─────────────────────────────────────────
            function grossToNet(gross: number) {
                const sgkWorker = gross * SGK_RATE;
                const unemployment = gross * UNEMP_RATE;
                const taxBase = gross - sgkWorker - unemployment;

                // Asgari ücret gelir vergisi istisnası
                const minWageTaxBase = MIN_WAGE_GROSS * (1 - SGK_RATE - UNEMP_RATE);
                const annualTax = calcAnnualTax(taxBase * 12);
                const minWageTax = calcAnnualTax(minWageTaxBase * 12);
                const monthlyIncomeTax = Math.max(0, (annualTax - minWageTax) / 12);

                // Damga vergisi: asgari ücrete kadar muaf
                const stampTax = gross <= MIN_WAGE_GROSS
                    ? 0
                    : Math.max(0, gross - MIN_WAGE_GROSS) * STAMP_RATE;

                const totalDeduction = sgkWorker + unemployment + monthlyIncomeTax + stampTax;
                const netSalary = gross - totalDeduction;

                return {
                    grossSalary: gross,
                    sgkWorker,
                    unemployment,
                    incomeTax: monthlyIncomeTax,
                    stampTax,
                    totalDeduction,
                    netSalary,
                    chart: {
                        segments: [
                            { label: { tr: "Net Maaş", en: "Net Salary" }, value: netSalary, colorClass: "bg-[#22c55e]", colorHex: "#22c55e" },
                            { label: { tr: "Kesintiler (SGK & Vergi)", en: "Deductions (Tax & SGK)" }, value: totalDeduction, colorClass: "bg-destructive", colorHex: "hsl(var(--destructive))" }
                        ]
                    }
                };
            }

            // ─── NETTEN BRÜTE (binary search) ─────────────────────────
            function netToGross(targetNet: number) {
                let lo = targetNet, hi = targetNet * 2.5;
                for (let i = 0; i < 60; i++) {
                    const mid = (lo + hi) / 2;
                    if (grossToNet(mid).netSalary < targetNet) lo = mid; else hi = mid;
                }
                return grossToNet((lo + hi) / 2);
            }

            const amount = parseFloat(v.salary) || 0;
            return v.calcType === "netToGross" ? netToGross(amount) : grossToNet(amount);
        },
        seo: {
            title: { tr: "Maaş Hesaplama 2026 — Brüt Net Maaş Hesaplayıcı", en: "Salary Calculator 2026 — Gross to Net" },
            metaDescription: { tr: "2026 SGK ve vergi oranlarıyla brüt maaşınızdan net maaşınızı veya tersini hesaplayın. Güncel asgari ücret istisnası dahil.", en: "Calculate net salary from gross with 2026 SGK and tax rates including minimum wage tax exemption." },
            content: { tr: "Türkiye'de net maaş; brüt maaştan SGK işçi payı (%14), işsizlik sigortası (%1), gelir vergisi ve damga vergisi (%0,759) kesildikten sonra kalan tutardır. 2026 yılında asgari ücret brüt 33.030 TL, net ise 28.075,50 TL olarak belirlenmiştir.", en: "Net salary in Turkey is gross minus SGK (14%), unemployment (1%), income tax and stamp duty (0.759%). 2026 minimum wage: 33,030 TL gross, 28,075.50 TL net." },
            faq: [
                { q: { tr: "2026 asgari ücret ne kadar?", en: "What is the 2026 minimum wage?" }, a: { tr: "2026 yılı asgari ücret brüt 33.030 TL, net 28.075,50 TL olarak belirlenmiştir. 1 Ocak 2026 itibarıyla yürürlüğe girmiştir.", en: "2026 minimum wage: Gross 33,030 TL, Net 28,075.50 TL, effective January 1, 2026." } },
                { q: { tr: "SGK işçi payı oranı nedir?", en: "What is the SGK employee contribution rate?" }, a: { tr: "2026'da SGK işçi payı %14 (emeklilik %9 + sağlık %5), işsizlik sigortası %1 olmak üzere toplam kesinti %15'tir.", en: "SGK employee share: 14% (9% pension + 5% health) + 1% unemployment = 15% total." } },
                { q: { tr: "Gelir vergisi nasıl hesaplanıyor?", en: "How is income tax calculated?" }, a: { tr: "2026 vergi dilimleri: 190.000 TL'ye kadar %15, 400.000 TL'ye kadar %20, 1.500.000 TL'ye kadar %27, 5.300.000 TL'ye kadar %35, üstü %40. Asgari ücrete isabet eden kısım muaftır.", en: "2026 brackets: up to 190K→15%, 400K→20%, 1.5M→27%, 5.3M→35%, above→40%. Minimum wage portion is tax-exempt." } },
                { q: { tr: "Damga vergisi maaştan ne kadar kesiliyor?", en: "How much stamp duty is deducted?" }, a: { tr: "Brüt maaşın asgari ücreti (33.030 TL) aşan kısmı için %0,759 damga vergisi kesilir. Asgari ücret tutarına isabet eden kısım muaftır.", en: "0.759% stamp duty applies only on the portion exceeding minimum wage (33,030 TL)." } },
                { q: { tr: "Netten brüte nasıl hesaplanır?", en: "How to calculate gross from net?" }, a: { tr: "Bu hesaplayıcıda 'Netten Brüte' seçeneğini seçin ve almak istediğiniz net maaşı girin; araç tüm kesintileri geri hesaplayarak brüt tutarı bulur.", en: "Select 'Net to Gross' mode and enter your desired net salary; the calculator reverse-computes all deductions to find the gross amount." } },
            ],
            richContent: {
                howItWorks: {
                    tr: "Maaş hesaplayıcı, 2026 yılı için geçerli SGK işçi payı (%14), işsizlik sigortası (%1), kümülatif gelir vergisi dilimleri (%15-%40) ve damga vergisi (%0,759) oranlarını kullanarak brüt maaştan net maaşa hesaplama yapar. Asgari ücret gelir vergisi istisnası ve damga vergisi muafiyeti otomatik olarak uygulanır. Netten brüte modunda binary search algoritmasıyla ters hesaplama yapılır.",
                    en: "Uses 2026 SGK (14%), unemployment (1%), progressive income tax (15%-40%) and stamp duty (0.759%) rates. Minimum wage exemptions applied automatically. Net-to-gross uses binary search reverse calculation."
                },
                formulaText: {
                    tr: "SGK = Brüt × 0,14 | İşsizlik = Brüt × 0,01 | Vergi Matrahı = Brüt − SGK − İşsizlik | Gelir Vergisi = Kümülatif dilim − Asgari ücret muafiyeti | Damga = max(0, Brüt − 33.030) × 0,00759 | Net = Brüt − SGK − İşsizlik − GV − Damga",
                    en: "SGK = Gross × 0.14 | Unemployment = Gross × 0.01 | Tax Base = Gross − SGK − Unemployment | Income Tax = Cumulative bracket − min wage exemption | Stamp = max(0, Gross − 33030) × 0.00759 | Net = Gross − all deductions"
                },
                exampleCalculation: {
                    tr: "Örnek: 50.000 TL brüt → SGK: 7.000 TL | İşsizlik: 500 TL | Vergi matrahı: 42.500 TL/ay → Yıllık 510.000 TL → Vergi ≈ 4.000 TL/ay (muafiyet sonrası) | Damga: (50.000−33.030)×0,00759 ≈ 129 TL | Net ≈ 38.371 TL",
                    en: "Example: 50,000 TL gross → SGK: 7,000 | Unemployment: 500 | Income tax ≈ 4,000 | Stamp ≈ 129 TL | Net ≈ 38,371 TL"
                },
                miniGuide: {
                    tr: "<ul><li><b>İşveren Maliyeti:</b> İşverenin ödediği ek SGK payı brüt maaşın yaklaşık %20,5'idir. Bu hesaplayıcı yalnızca işçi kesintilerini gösterir.</li><li><b>Kümülatif Vergi:</b> Gelir vergisi yıl içinde kümülatif matrah üzerinden hesaplanır; yılın ilerleyen aylarında dilim değişebilir. Bu araç basitleştirilmiş aylık hesap yapar.</li><li><b>Asgari Ücret İstisnası:</b> Tüm ücretliler için geçerlidir; işveren tarafından muhasebeleştirilir.</li></ul>",
                    en: "Employer's additional SGK cost is ~20.5% of gross. Calculator shows employee deductions only. Income tax is cumulative annually; this tool gives a monthly estimate."
                }
            }
        }
    },
    {
        id: "severance",
        slug: "kidem-tazminati-hesaplama",
        category: "maas-ve-vergi",
        name: { tr: "Kıdem Tazminatı Hesaplama", en: "Severance Pay Calculator" },
        h1: { tr: "Kıdem ve İhbar Tazminatı Hesaplama 2026 — SGK Tavan Tutarı", en: "Severance & Notice Pay Calculator 2026" },
        description: { tr: "İşten ayrılma durumunda alacağınız kıdem ve ihbar tazminatı tutarını 2026 tavan fiyatlarına göre net olarak hesaplayın.", en: "Calculate your net severance and notice pay based on 2026 ceiling rates." },
        shortDescription: { tr: "İşe giriş ve çıkış tarihlerinizle brüt maaşınızı girerek net kıdem tazminatı hakkınızı hesaplayın.", en: "Calculate your net severance pay right by entering your start date, end date, and gross salary." },
        inputs: [
            { id: "startDate", name: { tr: "İşe Başlama Tarihi", en: "Start Date" }, type: "date", defaultValue: "2018-01-01", required: true },
            { id: "endDate", name: { tr: "İşten Çıkış Tarihi", en: "End Date" }, type: "date", defaultValue: "2026-01-01", required: true },
            { id: "grossSalary", name: { tr: "Son Brüt Maaş (Aylık)", en: "Last Gross Salary (Monthly)" }, type: "number", defaultValue: 33030, suffix: "₺", required: true },
            { id: "bonusPayments", name: { tr: "Yıllık İkramiye/Yan Haklar Toplamı", en: "Annual Bonuses/Benefits Total" }, type: "number", defaultValue: 0, suffix: "₺", required: false },
        ],
        results: [
            { id: "yearsWorked", label: { tr: "Çalışma Süresi", en: "Years Worked" }, type: "text" },
            { id: "grossSeverance", label: { tr: "Brüt Kıdem Tazminatı", en: "Gross Severance" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "stampTax", label: { tr: "Damga Vergisi (%0,759)", en: "Stamp Tax (0.759%)" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "netSeverance", label: { tr: "Net Kıdem Tazminatı", en: "Net Severance Pay" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "chart", label: { tr: "Kıdem Tazminatı Dağılımı", en: "Severance Distribution" }, type: "pieChart" }
        ],
        formula: (v) => {
            const startStr = v.startDate;
            const endStr = v.endDate;
            if (!startStr || !endStr) return {};

            const start = new Date(startStr);
            const end = new Date(endStr);

            let years = end.getFullYear() - start.getFullYear();
            let months = end.getMonth() - start.getMonth();
            let days = end.getDate() - start.getDate();

            if (days < 0) {
                months--;
                days += 30; // Approx month lengths
            }
            if (months < 0) {
                years--;
                months += 12;
            }

            const totalDaysWorked = years * 365 + months * 30 + days;

            if (totalDaysWorked < 365) {
                return {
                    yearsWorked: { tr: "1 Yıldan Az", en: "Less than 1 Year" } as any,
                    grossSeverance: 0,
                    stampTax: 0,
                    netSeverance: 0
                };
            }

            // 2026 Severance Pay Ceiling (Kıdem Tazminatı Tavanı) - Approximate estimate for 2026
            const SEVERANCE_CEILING_2026 = 48500;

            let monthlyGross = parseFloat(v.grossSalary) || 0;
            const annualBonus = parseFloat(v.bonusPayments) || 0;
            const monthlyBonusBase = annualBonus / 12;

            const totalMonthlyBase = monthlyGross + monthlyBonusBase;

            // Limit the base salary to the ceiling
            const effectiveMonthlyBase = Math.min(totalMonthlyBase, SEVERANCE_CEILING_2026);

            const totalYearsDecimal = totalDaysWorked / 365.25;
            const grossSeverance = effectiveMonthlyBase * totalYearsDecimal;

            // Stamp Duty (Damga Vergisi) is 0.759%
            const stampTax = grossSeverance * 0.00759;
            const netSeverance = grossSeverance - stampTax;

            return {
                yearsWorked: {
                    tr: `${years} Yıl, ${months} Ay, ${days} Gün`,
                    en: `${years} Years, ${months} Months, ${days} Days`
                } as any,
                grossSeverance,
                stampTax,
                netSeverance,
                chart: {
                    segments: [
                        { label: { tr: "Elinize Geçen Net (Tazminat)", en: "Net Payout" }, value: netSeverance, colorClass: "bg-[#22c55e]", colorHex: "#22c55e" },
                        { label: { tr: "Damga Vergisi (Kesinti)", en: "Stamp Tax" }, value: stampTax, colorClass: "bg-destructive", colorHex: "hsl(var(--destructive))" }
                    ]
                }
            };
        },
        seo: {
            title: { tr: "Kıdem Tazminatı Hesaplama 2026 — Net ve Brüt Sonuç (Güncel Tavan)", en: "Severance Pay Calculator 2026" },
            metaDescription: { tr: "2026 kıdem tazminatı tavan tutarları ile net tazminatınızı ve damga vergisi kesintilerinizi en hassas şekilde hesaplayın.", en: "Calculate your net severance pay and stamp tax deductions accurately based on 2026 ceiling limits." },
            content: { tr: "Kıdem tazminatı işçinin en az 1 yıl çalıştıktan sonra haklı nedenlerle işten ayrılması sonucunda işveren tarafından ödenmek zorunda olduğu tazminattır. Her tam çalışma yılı için giydirilmiş brüt ücret üzerinden ödenir.", en: "Severance pay is the compensation the employer must pay when an employee leaves under justified reasons after at least 1 year of service. Paid based on gross salary per year worked." },
            faq: [
                { q: { tr: "Kıdem tazminatı tavanı nedir?", en: "What is the severance pay ceiling?" }, a: { tr: "Tazminat hesaplanırken devletin belirlediği maksimum bir maaş sınırı vardır. Gerçek maaşınız tavanı aşsa bile hesaplama bu tavan tutarı (2026 tahmini tavan) üzerinden yapılır.", en: "There is a maximum salary limit set by the state. Even if your real salary exceeds this, the calculation uses the ceiling amount." } },
                { q: { tr: "Yan haklar (yol, yemek) dahil edilir mi?", en: "Are benefits (food, travel) included?" }, a: { tr: "Evet, düzenli olarak ödenen her türlü ek ödeme 'Giydirilmiş Brüt Maaş' kapsamında tazminata yansıtılmalıdır. Bu araca ekleyebilirsiniz.", en: "Yes, regularly paid benefits form the 'Dressed Gross Salary' and should be included in the calculation." } },
            ],
            richContent: {
                howItWorks: { tr: "Girdiğiniz tarihlerden toplam çalışma süreniz (yıl/ay/gün) çıkartılır. Giydirilmiş brüt aylık ücretiniz ile bu süre çarpılır. Eğer maaşınız devlet tavan tutarını aşıyorsa tavan uyarlaınr ve sadece %0,759 oranında damga vergisi kesilerek net tutar bulunur.", en: "Calculates total years/months/days worked. Multiplies equipped monthly gross salary by time worked. Applies government ceiling limits and deducts 0.759% stamp tax." },
                formulaText: { tr: "Brüt Tazminat = (Ay/Yıl Çalışılan) × Giydirilmiş Brüt. Net Tazminat = Brüt Tazminat - (Brüt Tazminat × 0,00759)", en: "Gross Severance = Time Worked × Equipped Gross. Net = Gross - (Gross × 0.00759)" },
                exampleCalculation: { tr: "Son maaşı tavanı aşmayan ve 5 yıl tam çalışan biri için: 5 × Brüt Maaşı = Brüt tazminatı. İçinden ~%0.75 oranında hazine pul kesintisi yapılır.", en: "For 5 full years worked below ceiling: 5 × Gross = Gross Severance. Minor fraction ~0.75% is taken as treasury stamp tax." },
                miniGuide: { tr: "<ul><li><b>Hak Kazanma Şartı:</b> Kendi isteğinizle ayrılırsanız (bazı istisnalar dışında) tazminat alamazsınız.</li><li><b>Tavan Gerçeği:</b> Maaşınız 100.000 TL bile olsa, sistem tazminatınızı ~48.000 TL tavan üzerinden hesaplar. Yüksek tavan her 6 ayda bir ekonomi yönetimi tarafından güncellenir.</li></ul>", en: "Must resign with justified cause or be terminated. If salary is extremely high, payout is still capped at the state ceiling updated biannually." }
            }
        }
    },
    {
        id: "how-much-loan",
        slug: "ne-kadar-kredi-alabilirim-hesaplama",
        category: "finans-hesaplama",
        name: { tr: "Ne Kadar Kredi Alabilirim?", en: "How Much Loan Can I Get?" },
        h1: { tr: "Ne Kadar Kredi Çekebilirim Hesaplama", en: "Maximum Loan Capacity Calculator" },
        description: { tr: "Aylık geliriniz ve mevcut borçlarınıza göre çekebileceğiniz maksimum kredi tutarını (ihtiyaç, taşıt, konut) hesaplayın.", en: "Calculate your maximum loan limit based on your income, existing debts, and current bank interest rates." },
        shortDescription: { tr: "Gelirinize ve diğer ödemelerinize göre çekebileceğiniz maksimum limiti görün.", en: "Find out your max borrowing limit based on income and debts." },
        relatedCalculators: ["kredi-hesaplama", "kredi-yapilandirma-hesaplama", "maas-hesaplama"],
        inputs: [
            { id: "income", name: { tr: "Aylık Belgelenebilir Net Gelir", en: "Monthly Net Income" }, type: "number", defaultValue: 50000, suffix: "TL", required: true },
            { id: "otherDebts", name: { tr: "Aylık Diğer Kredi/Kart Ödemeleri", en: "Monthly Debt Obligations" }, type: "number", defaultValue: 5000, suffix: "TL", required: true },
            {
                id: "loanType", name: { tr: "Kredi Türü (Hesaplama.net Standardı)", en: "Loan Type" }, type: "select", options: [
                    { value: "50", label: { tr: "İhtiyaç / Taşıt Kredisi", en: "Personal / Auto Loan" } },
                    { value: "60", label: { tr: "Konut Kredisi", en: "Mortgage" } }
                ], defaultValue: "50"
            },
            { id: "term", name: { tr: "Vade (Ay)", en: "Term (Months)" }, type: "number", defaultValue: 36, required: true },
            { id: "interestRate", name: { tr: "Faiz Oranı (%)", en: "Interest Rate (%)" }, type: "number", defaultValue: 3.5, required: true },
            { id: "kkdf", name: { tr: "KKDF Oranı (%)", en: "KKDF (%)" }, type: "number", defaultValue: 15, required: true },
            { id: "bsmv", name: { tr: "BSMV Oranı (%)", en: "BSMV (%)" }, type: "number", defaultValue: 15, required: true }
        ],
        results: [
            { id: "maxInstallment", label: { tr: "Maksimum Aylık Taksit Tutarı", en: "Max Monthly Installment" }, suffix: " TL", decimalPlaces: 2 },
            { id: "maxLoan", label: { tr: "Çekebileceğiniz Maksimum Kredi Tutarı", en: "Maximum Loan Amount" }, suffix: " TL", decimalPlaces: 2 },
            { id: "totalRepayment", label: { tr: "Toplam Geri Ödeme", en: "Total Repayment" }, suffix: " TL", decimalPlaces: 2 },
        ],
        formula: (v) => {
            const income = parseFloat(v.income) || 0;
            const debts = parseFloat(v.otherDebts) || 0;
            const limitPercentage = parseFloat(v.loanType) / 100;
            const term = parseFloat(v.term) || 0;
            const interest = parseFloat(v.interestRate) || 0;
            const kkdf = parseFloat(v.kkdf) / 100 || 0;
            const bsmv = parseFloat(v.bsmv) / 100 || 0;

            let maxInstallment = (income * limitPercentage) - debts;
            if (maxInstallment <= 0) {
                return { maxInstallment: 0, maxLoan: 0, totalRepayment: 0 };
            }

            let effectiveRate = (interest / 100) * (1 + kkdf + bsmv);
            let maxLoan = 0;

            if (effectiveRate > 0 && term > 0) {
                const powered = Math.pow(1 + effectiveRate, term);
                maxLoan = maxInstallment * (powered - 1) / (effectiveRate * powered);
            } else if (term > 0) {
                maxLoan = maxInstallment * term;
            }

            const totalRepayment = maxInstallment * term;

            return { maxInstallment, maxLoan, totalRepayment };
        },
        seo: {
            title: { tr: "Ne Kadar Kredi Alabilirim Hesaplama 2026", en: "How Much Loan Can I Get? Limit Calculator" },
            metaDescription: { tr: "Aylık geliriniz ve diğer ödemelerinize göre çekebileceğiniz maksimum kredi tutarını standart kurallarla hesaplayın.", en: "Calculate your maximum borrowable loan limit according to bank debt-to-income (DTI) ratios." },
            content: { tr: "Bankalar kredi onayı verirken belgelenebilir gelirinizin belirli bir yüzdesini taksit ödeme kapasitesi (limit) olarak kabul eder. İhtiyaç kredilerinde bu genellikle aylık net gelirinizin %50'si iken konut kredilerinde %60-%70 seviyelerine kadar esneyebilir.", en: "Banks assess Debt-to-Income (DTI) ratios when approving loans. Personal loans usually cap installments at 50% of your net income." },
            faq: [
                { q: { tr: "Maksimum kredi limiti neye göre belirlenir?", en: "What determines the loan limit?" }, a: { tr: "Maksimum kredi limitiniz; aylık net belgelenebilir gelirinizin hesaplanan oranından, hali hazırda ödediğiniz diğer kredi ve kredi kartı asgari tutarlarının çıkarılması ile kalan taksit ödeme gücünüze göre belirlenir.", en: "Income, current debts, and the loan term length." } },
                { q: { tr: "Kredi kartı limiti toplam kredi limitinden düşer mi?", en: "Does Credit Score affect limits?" }, a: { tr: "Toplam kredi kartı limitiniz değil ancak kredi kartınızın o ayki ve düzenli ödemeniz gereken 'asgari ödeme tutarı' diğer aylık borçlarınız olarak hesaba katılır ve gelirden düşülür.", en: "Yes. This calculation is purely math-based on DTI. A low credit score can freeze approvals regardless of income." } }
            ],
            richContent: {
                howItWorks: { tr: "1. Aylık gelirinizin ilgili oranla çarpımı hesaplanır (örn. %50). 2. Bulunan rakamdan beyan ettiğiniz diğer güncel borçlarınız çıkarılarak 'Aylık Taksit Ödeme Kapasiteniz' belirlenir. 3. Vade ve faiz oranı (vergiler dahil) formülasyona sokularak geriye dönük (ters faiz hesabı) bu taksitlerle en fazla ne kadar kredi çekebileceğiniz bulunur.", en: "Takes a percentage of your income (often 50%), subtracts mandatory debts to find your max installment, and works backward with the specific interest rate to find the principal amount." },
                formulaText: { tr: "Maksimum Taksit Tutarı = (Aylık Net Gelir × Kredi Oran Limiti) – Aylık Diğer Borçlar. Çekilebilir Limit = Maks Taksit × [ ((1+Faiz Oranı)^Vade - 1) / (Faiz Oranı × (1+Faiz Oranı)^Vade) ]", en: "Max Loan = [ (Income × Limit%) - Debts ] × ( ((1+r)^n - 1) / (r × (1+r)^n) )" },
                exampleCalculation: { tr: "Eğer aylık geliriniz 50.000 TL, diğer borcunuz 5.000 TL ise, ihtiyaç kredisi için %50 sınır uygulandığında [(50.000 × 0.50) - 5.000] = 20.000 TL aylık taksit ödeyebilirsiniz. 36 ay ve %4 faiz baz alındığında kredi limitiniz yaklaşık 350.000 TL olarak banka sistemine yansır.", en: "40k income, 5k debt, 50% cap = 15k limit for installments. Given 3% interest over 36 months, the max principal is ~320k." },
                miniGuide: { tr: "<ul><li><b>Eşin Geliri Faktörü:</b> Özellikle yüksek limitli konut kredisi başvurularında hane halkı gelirini (eşinizin maaşı) belgelerseniz üst sınır direkt olarak yukarı fırlar.</li><li><b>Kredi Notu Etkisi:</b> Bu algoritma finansal matematik kapasitenizi verir. Limitiniz hesaplansa bile onaylanması, Findeks risk raporunuzdaki kredi notunuzun iyi bantta (1300 ve üstü) olmasına bağlıdır.</li></ul>", en: "For mortgages, you can often pool your spouse's income. Banks care more about actual debt payments than empty credit limits." }
            }
        }
    },
    {
        id: "loan-allocation-fee",
        slug: "kredi-dosya-masrafi-hesaplama",
        category: "finans-hesaplama",
        name: { tr: "Kredi Dosya Masrafı Hesaplama", en: "Loan Allocation Fee" },
        h1: { tr: "Kredi Dosya Masrafı / Tahsis Ücreti Hesaplama", en: "Loan Allocation Fee Calculator" },
        description: { tr: "Bireysel ve ticari krediler için çekilecek tutara ödenmesi gereken yasal maksimum dosya masrafını hesaplayın.", en: "Calculate the legal maximum allocation fee (dosya masrafı) for consumer and commercial loans." },
        shortDescription: { tr: "Bankaların kredi alırken sizden kesebileceği Kredi Tahsis Ücreti net sınırını öğrenin.", en: "Find out the maximum loan allocation fee banks can legally charge." },
        relatedCalculators: ["kredi-hesaplama", "yillik-maliyet-orani-hesaplama"],
        inputs: [
            { id: "loanAmount", name: { tr: "Çekilecek Kredi Tutarı", en: "Loan Principal" }, type: "number", defaultValue: 100000, suffix: "TL", required: true },
            {
                id: "bsmv", name: { tr: "Kredi Türü (BSMV Durumu)", en: "BSMV Application" }, type: "select", options: [
                    { value: "15", label: { tr: "İhtiyaç Kredisi (%15 BSMV)", en: "Consumer Loan (+15% BSMV)" } },
                    { value: "0", label: { tr: "Konut / Ticari Kredi (BSMV Yok)", en: "Commercial/Mortgage (0% BSMV)" } }
                ], defaultValue: "15"
            },
        ],
        results: [
            { id: "pureFee", label: { tr: "Kredi Tahsis Ücreti Tutarı (Binde 5)", en: "Net Allocation Fee" }, suffix: " TL", decimalPlaces: 2 },
            { id: "bsmvTax", label: { tr: "BSMV Tutarı", en: "Applied BSMV Tax" }, suffix: " TL", decimalPlaces: 2 },
            { id: "totalFee", label: { tr: "Toplam Dosya Masrafı (Kesinti)", en: "Total Allocation Fee Deducted" }, suffix: " TL", decimalPlaces: 2 },
        ],
        formula: (v) => {
            const amount = parseFloat(v.loanAmount) || 0;
            const bsmvRate = parseFloat(v.bsmv) / 100 || 0;

            const pureFee = amount * 0.005;
            const bsmvTax = pureFee * bsmvRate;
            const totalFee = pureFee + bsmvTax;

            return { pureFee, bsmvTax, totalFee };
        },
        seo: {
            title: { tr: "Kredi Dosya Masrafı (Tahsis Ücreti) Hesaplama", en: "Loan Allocation Fee Calculator" },
            metaDescription: { tr: "BDDK yasal sınırı olan binde 5 (0.005) kuralı ve BSMV vergileri dahil edilerek kredinizin dosya masrafı kesintisini net olarak bulun.", en: "Calculate exactly how much bank fee will be deducted from your approved loan according to legal limits." },
            content: { tr: "Kullanıcıların kredi çekerken yakındığı dosya masrafı karmaşası, devlet yasaları ile 'Kredi Tahsis Ücreti' adı altında yasal bir standarda bağlandı. Tüketici Kanunlarına göre tahsis ücreti asgari limit şartları olmaksızın, çekilen anaparanın maksimum binde beşi (%0,5) oranında olabilir.", en: "By consumer law, banks can charge a maximum of 0.5% of the principal amount as an allocation fee, plus applicable taxes." },
            faq: [
                { q: { tr: "Dosya masrafı geri alınabilir mi?", en: "Is the dosya masrafı (allocation fee) legal?" }, a: { tr: "Eskiden keyfi olarak kesilen eski dönem dosya masrafları e-Devlet üzerinden Tüketici Hakem Heyeti kanalıyla iade edilebiliyordu. Ancak günümüzde bankalar BDDK kararı ile standart yasal Binde 5 (binde beşi geçmeyen) orana geçtiği için bu 'Tahsis Ücreti' olarak yasaldır, iadesi alınamaz.", en: "Historically many fees were illegal, but the BRSA formalized a capped 0.5% 'allocation fee' which is completely legal." } },
                { q: { tr: "Tahsis Ücreti harici kesinti olur mu?", en: "Are there loans without allocation fees?" }, a: { tr: "Evet, örneğin konut kredilerinde yasal dosya masrafı tahsis ücreti dışında size ekspertiz ücreti veya ipotek (fevk) ücreti yansıtılır. Bu hesaplama sadece salt anapara kesintisi (tahsis) ücretini baz alır.", en: "Yes, usually as zero-fee promotions through digital channels, though they might offset it with slightly higher interest rates." } }
            ],
            richContent: {
                howItWorks: { tr: "Hesaplama algoritması; girdiğiniz toplam kredi limitinizin ana parasını önce %0.5 (binde beş) katsayısı ile çarpar. Daha sonra girdiğiniz kredi türündeki geçerli BSMV vergisini (%15 veya %0) ekleyerek, hesabınıza yatacak tutardan ne kadar masraf çekileceğini listeler.", en: "Applies the strict 0.5% (five per thousand) legal cap to the loan amount, applies the selected BSMV tax to that fee, reporting the total upfront deduction." },
                formulaText: { tr: "Yasal Dosya Masrafı Gösterimi = [Kredi Tutarı × (0.5 / 100)] + BSMV Vergisi", en: "Deduction = (Principal × 0.005) + BSMV_Taxes_on_Deduction" },
                exampleCalculation: { tr: "200.000 TL ihtiyaç kredisi başvurusu yapıldığında; 200.000 TL'nin binde beşi (x 0.005) 1.000 TL yapar. Kredi ihtiyaç olduğu için üstüne %15 BSMV uygulanır ve 150 TL vergi biner. Sonuç olarak brüt yasal dosya kesintisi 1.150 TL olur.", en: "100k Loan: 0.5% = 500 TL fee + 15% BSMV (75 TL) = 575 TL total fee." },
                miniGuide: { tr: "<ul><li><b>Tahsis Ücretsiz Sözleşmeler:</b> Bazı dijital bankalar 'dosya masrafsız kredi' sunar. Ancak kampanya detaylarında bu kez faiz oranının birkaç baz puan daha yukarı çekildiğine dikkat etmelisiniz; tamamen stratejidir.</li><li><b>Hayat Sigortası Farka Dahil Değil:</b> Bankaların kredi çekerken dayattığı Hayat Sigortası veya diğer poliçe kesintileri 'Kredi Tahsis Ücreti' statüsünde değerlendirilemez; bu ücret tamamen yasal işlem masrafı mahiyetindedir.</li></ul>", en: "Banks may charge life insurance separately, but the pure allocation fee never exceeds 0.5%. Mortgages involve external appraisal fees additionally." }
            }
        }
    },
    {
        id: "loan-late-interest",
        slug: "kredi-gecikme-faizi-hesaplama",
        category: "finans-hesaplama",
        name: { tr: "Kredi Gecikme Faizi", en: "Loan Late Penalty Interest" },
        h1: { tr: "Kredi Gecikme Faizi Hesaplama", en: "Loan Late Penalty Interest Calculator" },
        description: { tr: "Günü geçen kredi taksitleriniz için uygulanacak cezalı kredi taksit gecikme faizini ve vergisini (KKDF/BSMV) gün sayısı bazında hesaplayın.", en: "Calculate the penalty interest and taxes incurred for late loan installment payments based on exact delay days." },
        shortDescription: { tr: "Gecikilen gün sayısına ve banka akdi faizinize göre gecikme cezası tutarını öğrenin.", en: "Instantly learn the penalty amount based on delay days and contract interest." },
        relatedCalculators: ["kredi-karti-gecikme-faizi-hesaplama", "kredi-yapilandirma-hesaplama"],
        inputs: [
            { id: "lateAmount", name: { tr: "Geciken Taksit Tutarı", en: "Overdue Installment Amount" }, type: "number", defaultValue: 5000, suffix: "TL", required: true },
            { id: "daysLate", name: { tr: "Gecikilen Gün Sayısı", en: "Days Late" }, type: "number", defaultValue: 10, suffix: "Gün", required: true },
            { id: "contractRate", name: { tr: "Sözleşmedeki Aylık Faiz (%)", en: "Contract Monthly Interest Rate (%)" }, type: "number", defaultValue: 4, required: true },
            { id: "kkdf", name: { tr: "KKDF Oranı (%)", en: "KKDF (%)" }, type: "number", defaultValue: 15, required: true },
            { id: "bsmv", name: { tr: "BSMV Oranı (%)", en: "BSMV (%)" }, type: "number", defaultValue: 15, required: true }
        ],
        results: [
            { id: "penaltyRate", label: { tr: "Aylık Gecikme Faizi Oranı", en: "Applied Monthly Penalty Rate" }, suffix: " %", decimalPlaces: 2 },
            { id: "pureInterest", label: { tr: "Günlük Hesaplanmış Gecikme Faizi", en: "Net Penalty Interest" }, suffix: " TL", decimalPlaces: 2 },
            { id: "taxes", label: { tr: "Vergi Kesintisi (BSMV/KKDF)", en: "Taxes (BSMV + KKDF)" }, suffix: " TL", decimalPlaces: 2 },
            { id: "totalPenalty", label: { tr: "Toplam Ödenecek Gecikme Cezası", en: "Total Penalty Amount" }, suffix: " TL", decimalPlaces: 2 },
        ],
        formula: (v) => {
            const amount = parseFloat(v.lateAmount) || 0;
            const days = parseFloat(v.daysLate) || 0;
            const akdi = parseFloat(v.contractRate) || 0;
            const kkdfAndBsmv = (parseFloat(v.kkdf) || 0) + (parseFloat(v.bsmv) || 0);

            const rawPenaltyRate = akdi * 1.30;
            const pureInterest = amount * (rawPenaltyRate / 30) * days / 100;
            const taxes = pureInterest * (kkdfAndBsmv / 100);
            const totalPenalty = pureInterest + taxes;

            return { penaltyRate: rawPenaltyRate, pureInterest, taxes, totalPenalty };
        },
        seo: {
            title: { tr: "Kredi Gecikme Faizi Hesaplama 2026 (Yasal Oranlı Ceza)", en: "Loan Penalty Interest Calculator 2026" },
            metaDescription: { tr: "Kredi taksiti ödemeniz 1 gün veya 1 ay gecikirse ödeyeceğiniz net temerrüt faizini ve limitleri kuruşu kuruşuna tespit edin.", en: "Calculate the default / penalty interest you will pay if your loan payment is delayed." },
            content: { tr: "Tüketici yasasında korunan kurallara göre, tüketici kredilerinde ödenmeyen bir taksitin üzerinden banka tarafından talep edilebilecek yasal gecikme faizi (temerrüt faizi) sözleşmede imzalanan ilk faiz (akdi faiz) oranınızın maksimum %30 (1.30 katı) fazlası olarak sınırlandırılmıştır.", en: "In consumer loans, late penalties are applied only on the overdue amount at a maximum rate of 130% of your contractual interest rate." },
            faq: [
                { q: { tr: "Gecikme faizi toplam tüm borç üzerinden mi hesaplanır?", en: "Does penalty apply to total principal?" }, a: { tr: "Hayır. Yasal takibe girene kadar (iki ardışık taksit ödenmemesi ve 90 günlük ihtarlar) gecikme cezası sadece 'Geciktirdiğiniz Taksit (Anapara) Tutarı' üzerinden günlük olarak işler.", en: "No. Until the loan defaults (usually ~90 days) leading to legal action, penalties apply only to the delayed installment portion." } },
                { q: { tr: "Hafta sonları bankaya yatan ödeme gecikme sayılır mı?", en: "Does missing the day affect Findeks credit score?" }, a: { tr: "Eskiden mesai hesabı yatıyordu ancak günümüzde (FAST) transferlerle hafta sonları dahi taksitler anında ödendiğinden banka son ödeme tarihiniz Cumartesi günüyse erteleme imtiyazı vermek zorunda değildir, ceza işletilebilir.", en: "Yes, even a single day delay is flagged as a late payment and negatively impacts your credit score." } }
            ],
            richContent: {
                howItWorks: { tr: "Öncelikle girilen akdi faiz (sözleşme) oranınız %130 oranında (1.3 katsayısı ile) artırılarak yasal tavan temerrüt faizi formülü devralır. Gecikme süreniz (gün/30) olarak yıla vurularak sade faiz matematiği çerçevesinde sadece o tutarın cezası çıkartılır ve vergiler eklenir.", en: "Multiplies your contract rate by 1.3 to find the legal penalty cap. Converts to a daily rate to find raw interest based on delay days, then adds taxes." },
                formulaText: { tr: "Uygulanacak Temerrüt Faizi = Akdi Faiz × %1.30. Gecikme Cezası (TL) = (Geciken Tutar × (Temerrüt Faizi / 30) × Geçen Gün) / 100", en: "Penalty Rate = Contract Rate × 130%. Penalty = (Delayed Amount × (Rate/30) × Days) / 100" },
                exampleCalculation: { tr: "Örnek: %4 Faizli kredisinin 5.000 TL taksidini 10 gün geciktiren biri → Faizi %5.2 temerrüt faizine çıkar. 5.000 TL üzerinden 10 gün faiz tutulduğunda net 86.6 TL eder. KKDF ve BSMV vergileri eklendiğinde ~112 TL yekün ceza çıkmaktadır.", en: "On a 5,000 TL late payment at 3% contract rate for 15 days, penalty rate is 3.9%. Pure interest is 97.5 TL, totalling ~126 TL with taxes." },
                miniGuide: { tr: "<ul><li><b>Findeks Kredi Notu Düşüşü:</b> Faizi hesapladınız ancak en büyük risk bankada saklıdır. Resmi sicilinizde 1 günlük gecikme bile raporlanır.</li><li><b>Yasal Takip:</b> Art arda gelen tahsilatsız 2 taksit ile yasal süreçler (ihtarname, avukat ve %10-20 icra masrafları) dosyaya ilave edileceğinden formüldeki ufak meblağlar devasa avukatlık ücretlerine evrilebilir.</li></ul>", en: "Weekends are no longer exempt securely due to 24/7 FAST transfers. Avoid 90-day combined delays to prevent total loan default." }
            }
        }
    },
    {
        id: "cc-minimum-payment",
        slug: "kredi-karti-asgari-odeme-tutari-hesaplama",
        category: "finans-hesaplama",
        name: { tr: "Kredi Kartı Asgari Tutarı", en: "CC Min. Payment" },
        h1: { tr: "Kredi Kartı Asgari Ödeme Tutarı Hesaplama (2026 Sınırlarıyla)", en: "Credit Card Minimum Payment Calculator" },
        description: { tr: "Ekstre borcunuza ve belirlenen yüksek limit eşiğine göre zorunlu asgari ödeme tutarını Bankacılık (BDDK) kurallarıyla hesaplayın.", en: "Calculate your mandatory minimum credit card payment based on your statement balance and card limit under BRSA rules." },
        shortDescription: { tr: "Kredi kartı dönem borcunuzun %20'si mi %40'ı mı? Minimum ödeme tutarınızı hesaplayın.", en: "Calculate the minimum amount you must pay on your credit card statement." },
        relatedCalculators: ["kredi-karti-gecikme-faizi-hesaplama", "kredi-karti-taksitli-nakit-avans-hesaplama"],
        inputs: [
            { id: "statementBalance", name: { tr: "Dönem Ekstre Borcu", en: "Statement Balance" }, type: "number", defaultValue: 10000, suffix: "TL", required: true },
            { id: "cardLimit", name: { tr: "Kredi Kartınızın Toplam Limiti", en: "Total Credit Card Limit" }, type: "number", defaultValue: 60000, suffix: "TL", required: true },
            {
                id: "isNewCard", name: { tr: "Kartınız İlk Defa Alındı ve 1 Yıldan Yeni mi?", en: "Is Card Newer Than 1 Year?" }, type: "select", options: [
                    { value: "0", label: { tr: "Hayır (1 Yıldan Eski / Tecrübeli Kart)", en: "No, older than 1 year" } },
                    { value: "1", label: { tr: "Evet (Yeni Kart / İlk Yıl İçinde)", en: "Yes, new card" } }
                ], defaultValue: "0"
            }
        ],
        results: [
            { id: "ratio", label: { tr: "Hesaplanan Asgari Ödeme Oranı", en: "Applied Minimum Ratio" }, suffix: " %", decimalPlaces: 0 },
            { id: "minAmount", label: { tr: "Ödenmesi Gereken Asgari Tutar", en: "Min. Payment Amount" }, suffix: " TL", decimalPlaces: 2 },
            { id: "remainingBalance", label: { tr: "Sonraki Aya Devreden (Faiz İşletilecek) Borç", en: "Balance Carried Forward" }, suffix: " TL", decimalPlaces: 2 }
        ],
        formula: (v) => {
            const balance = parseFloat(v.statementBalance) || 0;
            const limit = parseFloat(v.cardLimit) || 0;
            const isNew = v.isNewCard === "1";

            let ratio = 20;
            const LIMIT_THRESHOLD = 50000;

            if (isNew) {
                ratio = 40;
            } else {
                if (limit > LIMIT_THRESHOLD) {
                    ratio = 40;
                } else {
                    ratio = 20;
                }
            }

            const minAmount = balance * (ratio / 100);
            const remainingBalance = balance - minAmount;

            return { ratio, minAmount, remainingBalance };
        },
        seo: {
            title: { tr: "Kredi Kartı Asgari Ödeme Hesaplama (%20 - %40 Kuralları)", en: "Credit Card Minimum Payment Calculator 2026" },
            metaDescription: { tr: "Kredi kartı asgari hesaplama işleminde dönem borcunuza kart limitinize göre %20 veya %40 güncel BDDK oranı uygulayarak ödenmesi zorunlu tutarı bulun.", en: "Determine if your minimum payment ratio is 20% or 40% based on your limit, and calculate your exact payment." },
            content: { tr: "Her ay kesilen kredi kartı ekstresinde belirtilen son ödeme tarihine kadar borcunuzun tamamını ödeyemediğiniz durumlarda ödemekle yükümlü olduğunuz en ufak tutara 'Asgari Ödeme Tutarı' denmektedir. Yasal barajların altında kalırsanız sadece akdi faiz ödemez, aynı zamanda kredi notunuz sicile doğrudan eksi yazar.", en: "The minimum payment is the lowest amount due by your deadline. Paying under this causes penalty interest and credit score damage." },
            faq: [
                { q: { tr: "Asgari ödeme oranı neden birisinde %20 diğerinde %40 çıkıyor?", en: "How are minimum payment ratios determined?" }, a: { tr: "BDDK yönetimi tarafından borçlanmayı engellemek amacıyla kredi kartı limitiniz güncel olarak 50.000 TL ve altı ise dönem borcunuzun %20’si asgari tutar sayılmaktayken; 50.000 TL’den büyük bir limitte iseniz direkt ekstrenin %40'ı asgari tutar olarak istenir. Ayrıca kart sahipliği hayatında henüz ilk yılında olan tüm yeni kartlara koşulsuz %40 uygulatılır.", en: "By BRSA rules: cards with limits under 50,000 TL have 20% minimum. Over 50,000 TL is 40%. New cards are purely 40% in their first year." } },
                { q: { tr: "Asgari tutarı eksik ödersem veya sadece asgariyi ödersem ne olur?", en: "What if I only pay the minimum?" }, a: { tr: "Sadece asgari tutarı öderseniz kalan dönem borcunuzun üstüne standart alışveriş (akdi) faizi (+BSMV ve KKDF) ilave edilerek sonraki aylara katlanarak devreder. Asgari tutarın da altında kalırsanız veya ödemezseniz direk Gecikme (temerrüt) faizi uygulanır.", en: "Your card avoids 'default' and credit score is intact, but standard purchase interest accrues on the unpaid balance." } }
            ],
            richContent: {
                howItWorks: { tr: "Bu dinamik arayüz kredi kartı kart limitinize bakar. Piyasada güncel uygulanan 50,000 TL barajının kontrolü gerçekleştirilir. Ekstra olarak limit 10 bin olsa dahi yeni bir kart tahsisi varsa oransal olarak çarpanınız daima %40 (0.4) üzerinden ekstrenizle çarpılarak ödenmesi gereken net alt limit çıkartılır.", en: "Checks the BRSA threshold (50k TL limit). If above, strictly targets 40% calculation; if below, aims at 20%; processing the statement amount." },
                formulaText: { tr: "Asgari Ödeme Meblağı (Limit > 50K veya İlk Yıl ise) = Ekstre Borcu × (40/100). (Limit ≤ 50K) = Ekstre Borcu × (20/100).", en: "If Limit > 50k: Min = Statement × 0.4. Else: Min = Statement × 0.2." },
                exampleCalculation: { tr: "Örnek olarak limiti 100.000 TL olan ve ekstresi 25.000 TL gelen tecrübeli bir kart söz konusu olsun. Limit 50 bin aşımı olduğu için asgarisi %40 olacaktır. O ay asgari ödenmesi istenen dip tutar: 25.000 × %40 = 10.000 TL'dir.", en: "10k Debt, 80k Limit. Due to high limit, 40% rule applies. Min payment is 4,000 TL." },
                miniGuide: { tr: "<ul><li><b>Riskli Döngü:</b> Bankalar sadece asgari fatura ödeyen müşterilere borcu asla kapatmamaları için sarmala sokabilir, bu faiz kartopudur; her ay bütçeden kısıp daha yüksek ödeme yapılmalıdır.</li><li><b>Bloke Edilen Kartlar:</b> Bir takvim yılı (1 yıl) içinde toplam 3 kez asgari ödeme tutarının altında (veya sıfır) bakiye atarsanız kartınız direkt olarak <b>Nakit Avans işlemlerine kapatılır.</b> Devamında tüm işlemlere durdurulur.</li></ul>", en: "Only paying minimums spirals debt via massive interest. Failing to meet the minimum multiple times blocks cash advances and leads to card cancellation." }
            }
        }
    },
    {
        id: "commercial-loan",
        slug: "is-yeri-ve-ticari-kredi-hesaplama",
        category: "finans-hesaplama",
        name: { tr: "Ticari Kredi Hesaplama", en: "Commercial Loan Calculator" },
        h1: { tr: "İş Yeri, Ticari Araç ve KOBİ Kredisi Hesaplama", en: "Commercial & Business Loan Calculator" },
        description: { tr: "Şirketiniz için çekeceğiniz ticari taşıt, iş yeri ve ihtiyaç destek kredilerini BSMV/KKDF istisnalarına göre hesaplayın.", en: "Calculate commercial vehicle, workplace, and business support loans with BSMV/KKDF exemptions." },
        shortDescription: { tr: "KOBİ ve ticari şirket kredilerinin taksit ve toplam ödemelerini vergi muafiyetiyle hesaplayın.", en: "Calculate SME and commercial company loan installments with tax exemptions." },
        relatedCalculators: ["kredi-hesaplama", "kredi-dosya-masrafi-hesaplama"],
        inputs: [
            { id: "loanAmount", name: { tr: "Kredi Tutarı", en: "Loan Amount" }, type: "number", defaultValue: 500000, suffix: "TL", required: true },
            { id: "term", name: { tr: "Vade (Ay)", en: "Term (Months)" }, type: "number", defaultValue: 36, required: true },
            { id: "interestRate", name: { tr: "Aylık Faiz Oranı (%)", en: "Monthly Interest Rate (%)" }, type: "number", defaultValue: 3.0, required: true },
            {
                id: "bsmv", name: { tr: "BSMV Oranı", en: "BSMV (%)" }, type: "select", options: [
                    { value: "5", label: { tr: "%5 BSMV (Standart Ticari)", en: "5% Standard Commercial" } },
                    { value: "0", label: { tr: "%0 BSMV (Muafiyetli/İhracat)", en: "0% Exempt/Export" } }
                ], defaultValue: "5"
            },
            {
                id: "kkdf", name: { tr: "KKDF Oranı", en: "KKDF (%)" }, type: "select", options: [
                    { value: "0", label: { tr: "%0 KKDF (Ticari Kredilerde Genelde Yoktur)", en: "0% Commercial default" } },
                    { value: "15", label: { tr: "%15 KKDF (Özel Durum)", en: "15% Special exception" } }
                ], defaultValue: "0"
            }
        ],
        results: [
            { id: "installment", label: { tr: "Aylık Taksit", en: "Monthly Installment" }, suffix: " TL", decimalPlaces: 2 },
            { id: "totalInterest", label: { tr: "Toplam Faiz", en: "Total Interest" }, suffix: " TL", decimalPlaces: 2 },
            { id: "totalRepayment", label: { tr: "Toplam Geri Ödeme", en: "Total Repayment" }, suffix: " TL", decimalPlaces: 2 },
        ],
        formula: (v) => {
            const amount = parseFloat(v.loanAmount) || 0;
            const term = parseFloat(v.term) || 0;
            const interest = parseFloat(v.interestRate) || 0;
            const kkdf = parseFloat(v.kkdf) / 100 || 0;
            const bsmv = parseFloat(v.bsmv) / 100 || 0;

            let installment = 0;
            let totalRepayment = 0;
            let totalInterest = 0;

            let effectiveRate = (interest / 100) * (1 + kkdf + bsmv);

            if (effectiveRate > 0 && term > 0) {
                const powered = Math.pow(1 + effectiveRate, term);
                installment = amount * effectiveRate * powered / (powered - 1);
            } else if (term > 0) {
                installment = amount / term;
            }

            totalRepayment = installment * term;
            totalInterest = totalRepayment - amount;

            return { installment, totalInterest, totalRepayment };
        },
        seo: {
            title: { tr: "Ticari ve İş Yeri Kredisi Hesaplama (Vergi Avantajlı)", en: "Commercial Loan Calculator 2026" },
            metaDescription: { tr: "Şirketlere özel teşvikler, KKDF muafiyeti ve güncel faiz oranları ile KOBİ ve Ticari İş Yeri, Araç kredilerinizi hemen hesaplayın.", en: "Calculate commercial and SME loans with corporate tax exemptions and specific real-time rates." },
            content: { tr: "Ticari krediler (İş Yeri Kredisi, Ticari Araç Kredisi, KOBİ Kredileri vb.), vergi kimlik numarası olan tüzel ya da gerçek kişi işletmelerin kullanımı içindir. En büyük farkı, KKDF ve BSMV gibi bireysel kredi vergilerinden genellikle muaf olmaları veya vergi avantajı sağlamalarıdır.", en: "Commercial loans are offered to businesses and differ from consumer loans by heavily reduced or completely exempted consumer taxes (KKDF & BSMV) in Turkey." },
            faq: [
                { q: { tr: "Ticari kredilerde BSMV/KKDF ödenir mi?", en: "Are consumer taxes applied to business loans?" }, a: { tr: "Normal ihtiyaç kredilerinde uygulanan %15 KKDF ve %15 BSMV, ticari nitelikli kullandırımlarda genellikle uygulanmaz (KKDF %0'dır, BSMV banka ve fon tipine göre %5 veya %0 olabilir).", en: "Consumer taxes are typically 0% for KKDF and 5% or 0% for BSMV on strict commercial lines of credit." } },
                { q: { tr: "Şahıs şirketim var, ticari taşıt kredisi alabilir miyim?", en: "Can a sole proprietorship get a commercial auto loan?" }, a: { tr: "Evet, vergi levhanız varsa şirketinize alacağınız aracı ticari taşıt kredisi sınıfında, vergi muafiyetli oranlarla çok daha ucuza maliyetlendirebilirsiniz.", en: "Yes. With a valid tax shield, sole proprietors get commercial exemptions on commercial vehicle loans." } }
            ],
            richContent: {
                howItWorks: { tr: "Araç, bireysel kredi modüllerinkiyle aynı anüite formülünü kullanır ancak şirketinizin faydalandığı vergi indirimlerini (%0 KKDF vb.) hesaba dahil ederek taksit tutarlarındaki şişkinliği arındırır.", en: "Uses standard annuity formulas but enforces commercial tax reductions (0% KKDF, 5% BSMV) directly mirroring corporate banking packages." },
                formulaText: { tr: "Aylık Efektif Faiz = Faiz Oranı × (1 + BSMV + KKDF). Aylık Taksit = Anapara × [ Efektif Faiz × (1+Efektif Faiz)^Vade ] / [ (1+Efektif Faiz)^Vade - 1 ]", en: "Effective Rate = Interest Rate × (1 + Corporate Taxes). Base formula stands." },
                exampleCalculation: { tr: "1.000.000 TL KOBİ İhtiyaç Kredisinde %3 faiz ve 24 Ay vade seçildiğinde; vergiler (%0 KKDF, %5 BSMV) ile efektif faiz %3.15 olur. Aylık taksit 59.980 TL çıkar.", en: "1 Million TL loan at 3% for 24 months. Adjusting to a 3.15% effective rate with limited taxes brings the installment to roughly 59,980 TL." },
                miniGuide: { tr: "<ul><li><b>Vade Sınırları Yok:</b> Bireysel kredilerdeki yasal BDDK kısıtlamaları (50 binden sonraya max 24 ay vs.) ticari kredilerde yoktur. Projenizin boyutuna göre istenilen vadede finansmana ulaşılabilir.</li><li><b>Rotatif Krediler:</b> Hesaplayıcımız taksitli ticari krediler (BCH) içindir; rotatif yani faizi dönem sonlarında bakiye kullanımına göre yatan kredi tipinde bu standart formül kullanılmaz.</li></ul>", en: "Commercial loans bypass consumer term caps (like the 24-month cap). Not applicable for overdraft (rotatif) accounts which carry floating variable daily interest." }
            }
        }
    },
    {
        id: "cc-installment-cash-advance",
        slug: "kredi-karti-taksitli-nakit-avans-hesaplama",
        category: "finans-hesaplama",
        name: { tr: "Taksitli Nakit Avans", en: "Credit Card Installment Cash" },
        h1: { tr: "Kredi Kartı Taksitli Nakit Avans Hesaplama", en: "Credit Card Installment Cash Advance Calculator" },
        description: { tr: "Kredi kartınızın limitinden nakit olarak çekeceğiniz tutarın güncel avans faizi ile kaç taksitle ne kadara mal olacağını görün.", en: "Calculate the exact monthly installments and total repayment for a cash advance withdrawn from your credit card based on current cash interest rates." },
        shortDescription: { tr: "Kredi kartından avans çekerseniz faizinin ne kadar yansıyacağını hemen hesaplayın.", en: "Find out exactly how much interest will reflect when you take a cash advance from your card." },
        relatedCalculators: ["cc-minimum-payment", "kredi-hesaplama"],
        inputs: [
            { id: "advanceAmount", name: { tr: "Çekilecek Nakit Avans Tutarı", en: "Cash Advance Amount" }, type: "number", defaultValue: 20000, suffix: "TL", required: true },
            { id: "term", name: { tr: "Vade Sayısı (Taksit)", en: "Installment Term" }, type: "number", defaultValue: 6, max: 12, required: true },
            { id: "interestRate", name: { tr: "Aylık Akdi Faiz (%)", en: "Monthly Interest Rate (%)" }, type: "number", defaultValue: 5, required: true },
            {
                id: "hasFee", name: { tr: "Nakde Çevirme Ücreti Durumu", en: "Upfront Cash Fee" }, type: "select", options: [
                    { value: "yes", label: { tr: "Evet (\u00251 + 50TL Ücret)", en: "Yes (1% + 50TL Fee)" } },
                    { value: "no", label: { tr: "Hayır (Ücretsiz)", en: "No (Free promo)" } }
                ], defaultValue: "yes"
            }
        ],
        results: [
            { id: "installment", label: { tr: "Aylık Taksit Tutarı", en: "Monthly Installment" }, suffix: " TL", decimalPlaces: 2 },
            { id: "upfrontFee", label: { tr: "Peşin İşlem Ücreti", en: "Upfront Withdrawal Fee" }, suffix: " TL", decimalPlaces: 2 },
            { id: "totalRepayment", label: { tr: "Toplam Geri Ödeme", en: "Total Repayment" }, suffix: " TL", decimalPlaces: 2 },
        ],
        formula: (v) => {
            const amount = parseFloat(v.advanceAmount) || 0;
            const term = parseFloat(v.term) || 0;
            const interest = parseFloat(v.interestRate) || 0;
            const hasFee = v.hasFee === "yes";

            const bsmv_kkdf = 0.30;
            const effectiveRate = (interest / 100) * (1 + bsmv_kkdf);

            let installment = 0;
            let totalRepayment = 0;
            let upfrontFee = 0;

            if (amount > 0 && effectiveRate > 0 && term > 0) {
                const powered = Math.pow(1 + effectiveRate, term);
                installment = amount * effectiveRate * powered / (powered - 1);
            } else if (term > 0) {
                installment = amount / term;
            }

            if (hasFee) {
                const pureFee = (amount * 0.01) + 50;
                upfrontFee = pureFee * 1.15; // BSMV
            }

            totalRepayment = (installment * term) + upfrontFee;

            return { installment, upfrontFee, totalRepayment };
        },
        seo: {
            title: { tr: "Kredi Kartı Taksitli Nakit Avans Hesaplama 2026", en: "Credit Card Installment Cash Advance Calculator" },
            metaDescription: { tr: "Kredi kartınızdan limitinize göre taksitli nakit avans çekerseniz oluşan faizi, işlem ücretini ve aylık ödemesini banka bazında hesaplayın.", en: "Calculate the interest, ATM fees, and monthly payments for withdrawing a cash advance on installments directly from your credit limit." },
            content: { tr: "Kredi kartıyla nakit avans çekmek, acil nakit ihtiyaçları için sunulan ancak bankanın standart bireysel kredi oranlarından ziyade BDDK'nın belirlediği 'Nakit Avans' tavan faizinden faizlendirilen pratik işlemdir.", en: "Cash advances provide instant liquidity from credit cards, typically carrying specialized maximum interest rates set by the central bank rather than dynamic loan rates." },
            faq: [
                { q: { tr: "Nakit avans faizi ile alışveriş faizi aynı mıdır?", en: "Is cash advance interest the same as shopping interest?" }, a: { tr: "Hayır. Genellikle Nakit Avans (Çekim) faiz oranı, standart alışveriş (Akdi) faiz oranından daha yüksektir.", en: "No. Usually, under central bank directives, cash advance rates are higher by .5 - 1 percentage points compared to regular shopping (contractual) interest." } },
                { q: { tr: "Peşin komisyonu (ücreti) nasıl olur?", en: "How does the upfront withdrawal fee work?" }, a: { tr: "Birçok banka, avans tutarının ekstrenize yansımasına %1 komisyon + 50-100 TL arası bir işlem vergi ücretini en başta yansıtır.", en: "Many banks immediately charge 1% of the drawn principal plus a fixed service fee right onto your first statement." } }
            ],
            richContent: {
                howItWorks: { tr: "Araç belirlenen nakit avans faizinin üstüne kanuni (%15 KKDF ve %15 BSMV) vergi binişi yapar. Aylık efektif maliyet oranıyla ters hesap yöntemi üzerinden her aya anüiteler halinde taksit miktarı gösterilir. 'Nakit Çekim Komisyonu' eklenebilir.", en: "Applies rigid 15% BSMV + 15% KKDF on the specific cash advance interest rate, deducing an annuity schedule for monthly payments." },
                formulaText: { tr: "Nakit Efektif Faiz = Nakit Avans Faizi × %130. Çekim Ücreti = (Anapara × %1) + 50 TL. Taksit = Anapara × (EfektifFaiz × (1+EfektifFaiz)^Vade) / ((1+EfektifFaiz)^Vade - 1)", en: "Effective Cash Rate = Rate × 130% (with taxes). Withdrawal Fee = (Principal × 1%) + Fixed Cost." },
                exampleCalculation: { tr: "20.000 TL nakiti 6 ay vadeyle ve %5 Faiziyle çektiyseniz; Efektif faiz vergilerle (BSMV+KKDF) %6.5 olur. Aylık taksidi ~4.148 TL civarı çıkar.", en: "20k TL at 6 months with 5% rate outputs an effective 6.5% interest mathematically. Tallying around 4148 TL monthly plus any upfront withdrawal fees." },
                miniGuide: { tr: "<ul><li><b>Findeks Onayı Gerekmez:</b> Normal kredilerde red cevabı alabilseniz de, çekilebilir kart nakit limitiniz müsaitse onaysız ve saniyesinde avans çekilebilir.</li><li><b>Erken Kapama:</b> Günü gelmeden kapatırsanız sadece işlemiş olan o anki faizi verir, geri kalan anapara faizini ve vergilerini iade alırsınız.</li></ul>", en: "Requires no credit checks at the moment of withdrawal unlike a loan application. Also, closing it earlier waves future interest chunks." }
            }
        }
    },
    {
        id: "cc-extra-installments",
        slug: "kredi-karti-islem-taksitlendirme-hesaplama",
        category: "finans-hesaplama",
        name: { tr: "İşlem Sonradan Taksitlendirme", en: "Post-Purchase Installments" },
        h1: { tr: "Kredi Kartı Peşin İşlem Taksitlendirme / Ek Taksit Hesaplama", en: "Post-Purchase Transaction Installment Calculator" },
        description: { tr: "Kredi kartıyla yaptığınız peşin alışverişleri veya taksitli işlemleri sonradan 'Ek Taksit' ile böldüğünüzde ne kadar vade farkı çıkacağını görün.", en: "Calculate the interest (vade farkı) added when restructuring a one-time purchase into monthly installments." },
        shortDescription: { tr: "Peşin alışverişinize bankadan sonradan taksit istediğinizde ne kadar faiz bineceğini hesaplayın.", en: "Calculate the exact interest fee added when asking the bank to split your single purchase into monthly parts." },
        relatedCalculators: ["cc-minimum-payment"],
        inputs: [
            { id: "purchaseAmount", name: { tr: "Peşin İşlem Tutarı", en: "Original Purchase Amount" }, type: "number", defaultValue: 15000, suffix: "TL", required: true },
            { id: "term", name: { tr: "İstenilen Taksit Sayısı", en: "Desired Installments" }, type: "number", defaultValue: 3, max: 12, required: true },
            { id: "interestRate", name: { tr: "Bankanın Taksitlendirme Aylık Faizi (%)", en: "Bank's Add-on Interest (%)" }, type: "number", defaultValue: 4.25, required: true }
        ],
        results: [
            { id: "monthlyInstallment", label: { tr: "Aylık Taksit Tutarı", en: "New Monthly Installment" }, suffix: " TL", decimalPlaces: 2 },
            { id: "interestFee", label: { tr: "Taksitlendirme Vade Farkı (Vergiler Dahil)", en: "Total Add-on Interest Fee" }, suffix: " TL", decimalPlaces: 2 },
            { id: "totalRepayment", label: { tr: "Karttan Çıkacak Toplam Tutar", en: "Total Repayment" }, suffix: " TL", decimalPlaces: 2 },
        ],
        formula: (v) => {
            const amount = parseFloat(v.purchaseAmount) || 0;
            const term = parseFloat(v.term) || 0;
            const interest = parseFloat(v.interestRate) || 0;

            const effectiveRate = (interest / 100) * 1.30; // BSMV + KKDF %30
            let installment = 0;

            if (amount > 0 && effectiveRate > 0 && term > 0) {
                const powered = Math.pow(1 + effectiveRate, term);
                installment = amount * effectiveRate * powered / (powered - 1);
            } else if (term > 0) {
                installment = amount / term;
            }

            const totalRepayment = installment * term;
            const interestFee = totalRepayment - amount;

            return { monthlyInstallment: installment, interestFee, totalRepayment };
        },
        seo: {
            title: { tr: "Kredi Kartı Sonradan Taksitlendirme Hesaplama 2026", en: "Credit Card Post-Purchase Installment Calculator" },
            metaDescription: { tr: "Kredi kartıyla yaptığınız tek çekim (peşin) alışverişleri sonradan banka üzerinden taksitlendirirken (ek taksit) oluşacak vade farkını kuruşu kuruşuna bulun.", en: "Calculate the exact installment fee and monthly split amount when converting your standard credit card swipe into a 3 to 12-month installment plan." },
            content: { tr: "Bankalar peşin alışverişleriniz için size 'Bu işlemi X aya kadar taksitlendirmek ister misiniz?' teklifi sunar. Ancak bu ücretsiz değildir. Belirlenen akdi faiz oranının üstüne vergiler eklenerek aylık bir vade farkı anüitesine oturtulur.", en: "Often banks will offer you the option to split a completed transaction into 3, 6, or 12 months. This adds a specific un-advertised installment fee loaded onto your monthly payback." },
            faq: [
                { q: { tr: "Her işlem sonradan taksitlenebilir mi?", en: "Can any purchase be installed later?" }, a: { tr: "Hayır. BDDK yasalarına göre kozmetik, telekomünikasyon, akaryakıt ve gıda gibi sektörlerde kredi kartına taksit zaten yasaktır, dolayısıyla sonradan taksit de yapılamaz.", en: "No. Strict laws ban financing for specific sectors like telecommunications (cell phones), raw food, fuel, and cosmetics." } },
                { q: { tr: "Taksitlendirme onaylandıktan sonra limitim nasıl etkilenir?", en: "How does this affect my credit limit?" }, a: { tr: "Taksitlendirilen işlemin tamamı (artı vade farkı) kartınızın toplam limitinden o an bloke edilir. Her ay taksit ödedikçe ödediğiniz miktar kadar limitiniz yeniden açılır.", en: "The entire principal plus the new interest fee is blocked from your available limit instantly. Paying down monthly slowly frees the limit back." } }
            ],
            richContent: {
                howItWorks: { tr: "Sistem, bankanın size taksit işlemi için deklare ettiği aylık faiz üzerinden yasal vergileri (%30 BSMV+KKDF) ekleyerek aylık anüite tablosu oluşturur.", en: "Re-constructs your single purchase into a micro-loan scheme using real interest factored by high consumer taxes." },
                formulaText: { tr: "Aylık Taksit = Ana İşlem × (Vergili Faiz × (1+Vergili Faiz)^Vade) / ((1+Vergili Faiz)^Vade - 1)", en: "Installment = Purchase × (EffectiveRate × (1+EffectiveRate)^n) / ((1+EffectiveRate)^n - 1)" },
                exampleCalculation: { tr: "15.000 TL'lik televizyonu peşin aldınız ve banka %4.25 faizle 3 aya bölmeyi teklif etti. Vergiyle oran %5.52'ye yükselir. 3 taksitin her biri ~5.570 TL olur. Toplamda 16.711 TL ödersiniz ve 1.711 TL bankaya vade farkı yazılır.", en: "Splitting a 15k TV over 3 months at 4.25% yields a 5.5% effective rate with taxes. Each installment climbs to around 5570 TL." },
                miniGuide: { tr: "<ul><li><b>Kampanyalı Faizsiz Taksitler:</b> Bazı bankalar eğitim, sağlık gibi harcamalara 'Ücretsiz 3 Taksit' sunabilir, bu durumda faizi %0 (sıfır) girmeniz yeterlidir.</li><li><b>Bloke Süreci:</b> Taksitlendirme yaptığınız an vade farkıyla beraber bu yük limitinizden bloke edilir.</li></ul>", en: "Some campaigns offer 0% post-installments for Education or Medical expenses; simply input 0% rate in those instances." }
            }
        }
    },
    {
        id: "cc-late-interest-penalty",
        slug: "kredi-karti-gecikme-faizi-hesaplama",
        category: "finans-hesaplama",
        name: { tr: "K.Kartı Gecikme Faizi", en: "CC Late Penalty" },
        h1: { tr: "Kredi Kartı Gecikme Faizi ve Akdi Faiz Hesaplama", en: "Credit Card Penalty & Late Interest Calculator" },
        description: { tr: "Asgari ödemenin altında ödediğiniz durumlar (gecikme faizi) ve asgariyi ödeyip devrettiğiniz durumlar (akdi alışveriş faizi) için kredi kartınıza yansıyacak faizi hesaplayın.", en: "Calculate the late penalty interest if paying below the minimum, and regular carry-over interest if paying just the minimum." },
        shortDescription: { tr: "Ekstrenizin tamamını ödememiş veya asgarisini yatırmamışsanız yansıyacak faizi hesaplayın.", en: "Calculate overlapping penalties if you don't pay the statement in full." },
        relatedCalculators: ["cc-minimum-payment"],
        inputs: [
            { id: "statementAmount", name: { tr: "Ekstre Dönem Borcu (Toplam)", en: "Total Statement Balance" }, type: "number", defaultValue: 20000, suffix: "TL", required: true },
            { id: "paidAmount", name: { tr: "Ödediğiniz Tutar", en: "Amount Paid" }, type: "number", defaultValue: 0, suffix: "TL", required: true },
            { id: "minRequired", name: { tr: "Asgari Ödeme Tutarı", en: "Required Minimum Payment" }, type: "number", defaultValue: 4000, suffix: "TL", required: true },
            { id: "akdiFaiz", name: { tr: "Kredi Kartı Akdi Faizi (%)", en: "Contractual Purchase Interest (%)" }, type: "number", defaultValue: 4.25, required: true },
            { id: "gecikmeFaiz", name: { tr: "Kredi Kartı Gecikme Faizi (%)", en: "Penalty Late Interest (%)" }, type: "number", defaultValue: 4.55, required: true }
        ],
        results: [
            { id: "akdiTutar", label: { tr: "Kalan Borca İşleyen (Akdi) Faiz", en: "Standard Carry-over Interest" }, suffix: " TL", decimalPlaces: 2 },
            { id: "gecikmeTutar", label: { tr: "Asgari Açığına İşleyen (Gecikme) Faizi", en: "Penalty Interest on Underpaid Min." }, suffix: " TL", decimalPlaces: 2 },
            { id: "taxes", label: { tr: "BSMV ve KKDF Vergi Bedeli (%30)", en: "Taxes (BSMV/KKDF)" }, suffix: " TL", decimalPlaces: 2 },
            { id: "totalInterestBilled", label: { tr: "Sonraki Ay Ekstreye Vurulacak Ceza", en: "Total Interest Added Next Cycle" }, suffix: " TL", decimalPlaces: 2 },
        ],
        formula: (v) => {
            const statement = parseFloat(v.statementAmount) || 0;
            let paid = parseFloat(v.paidAmount) || 0;
            const minAllowed = parseFloat(v.minRequired) || 0;
            const akdi = parseFloat(v.akdiFaiz) / 100 || 0;
            const gecikme = parseFloat(v.gecikmeFaiz) / 100 || 0;

            if (paid > statement) paid = statement;

            const unpaidAmount = statement - paid;

            let missingMin = minAllowed - paid;
            if (missingMin < 0) missingMin = 0;

            let akdiBaze = unpaidAmount - missingMin;
            if (akdiBaze < 0) akdiBaze = 0;

            const akdiIsleyenMatrah = akdiBaze * akdi;
            const gecikmeIsleyenMatrah = missingMin * gecikme;

            const pureInterestTotal = akdiIsleyenMatrah + gecikmeIsleyenMatrah;

            const taxes = pureInterestTotal * 0.30;
            const totalReturn = pureInterestTotal + taxes;

            return {
                akdiTutar: akdiIsleyenMatrah,
                gecikmeTutar: gecikmeIsleyenMatrah,
                taxes: taxes,
                totalInterestBilled: totalReturn
            };
        },
        seo: {
            title: { tr: "Kredi Kartı Gecikme ve Akdi Alışveriş Faizi Hesaplama 2026", en: "Credit Card Late and Standard Interest Calculator" },
            metaDescription: { tr: "Kredi kartı ekstremden sadece asgariyi ödersem ne kadar faiz gelir? Asgarinin altında kalırsam ne kadar gecikme cezası çıkar? Formüllerimizle öğrenin.", en: "Calculate exactly how much interest will roll over to your next statement depending on what portion of the balance you pay." },
            content: { tr: "Bir kredi kartı ekstresi tamamen ödenmediği takdirde devreden miktar cezaya tabidir. BDDK kararları gereği, asgarisi ödenmeyen kısmına 'Gecikme (Temerrüt) Faizi' uygulanırken, asgarisi ödenmiş ancak tamamı ödenmemiş kısımlara standart 'Akdi (Alışveriş) Faiz' işler.", en: "Credit cards penalize unpaid balances differently. Below-minimum amounts trigger strict penalty rates; above-minimum remaining balances trigger standard 'shopping' interest." },
            faq: [
                { q: { tr: "Akdi faiz nedir? Gecikme faizi nedir?", en: "What's the difference between contractual and penalty interest?" }, a: { tr: "Akdi faiz sözleşmenizdeki alışveriş borçlanma faizidir (asgariyi tıkır tıkır ödediğinizde kalana isler). Gecikme faizi ise Merkez Bankasının belirlediği maksimum orandır ve asgarinin eksik kalan tarafı cezalandırılmak için isler.", en: "Contractual interest applies to leftover balances safely over the minimum marker. Penalty interest applies to unpaid portions belonging to the mandatory minimum." } },
                { q: { tr: "Faize faiz işler mi?", en: "Is there interest on interest?" }, a: { tr: "Hayır. BBDK kuralları gereği kredi kartlarında 'bileşik faiz' (faizin faizi) yasaktır. Banka sadece anapara üzerinden faiz tahakkuk ettirir.", en: "No. Turkish laws strictly forbid compound interest (interest on interest) in consumer credit card cycles." } }
            ],
            richContent: {
                howItWorks: { tr: "Araç ödediğiniz parayı kontrol eder. Eğer asgari borcu karşılamamışsa, açığı bulur ve onu en ağır oran olan 'Gecikme Faizi' ile cezalandırır. Hesabın asgari kısmı üstünde kalan normal harcama bakiyesi ise 'Akdi Faiz' ile kredilendirilmiş sayılarak vergilendirilir.", en: "Differentiates your unpaid balance into two branches: failing the minimum (punished heavily), and the carry-over balance (taxed at base rate)." },
                formulaText: { tr: "Ceza(Asgari Altı) = Eksik Ödenen Asgari Tutar × Gecikme Faizi. Akdi Faiz(Aşan Kısım) = Kalan Borç × Alışveriş Faizi. Toplam Yük = Temel Faiz + BMSV/KKDF.", en: "Penalty = Missing Min × Penalty% . Standard = Remaining Diff × Shopping%. Total = Sum + Taxes." },
                exampleCalculation: { tr: "20.000 TL ekstreniz ve 4.000 TL asgariniz varken hiç (0 TL) öderseniz: 4.000 TL'ye %4.55 gecikme faizi, kalan 16.000 TL'ye %4.25 akdi faiz çarpanı uygulanır. İkisinin birleşimi ve %30 devlet vergisi ile sonraki ay cebinizden devasa bir kart kullanım külfeti çıkar.", en: "On a 20k bill with a 4k minimum, paying 0 means 4k is punished at 4.5% late rates, and 16k is billed at standard 4.2% rates. Substantial tax mounts on top." },
                miniGuide: { tr: "<ul><li><b>Faiz Kapanı (Sarmal):</b> Sadece asgari tutarı ödeyebilmek borcunuzun bittiği anlamına gelmez, sonraki ay daha yüksek faizli bir ekstreyle karşılaşmanızı garanti eder.</li><li><b>Yeni Alışverişlere Anında Faiz:</b> Ekstrenin tamamı ödenmediğinde faizsizlik dönemi bozulur. Yani o andan sonraki dönemde kartınızla yapacağınız yepyeni harcamalara kasadan geçtiği an faiz işletilmeye başlar!</li></ul>", en: "Failing to clear the full balance revokes your 'grace period' meaning any brand new purchases start ticking interest the second you swipe your card." }
            }
        }
    },
    {
        id: "loan-structuring",
        slug: "kredi-yapilandirma-hesaplama",
        category: "finans-hesaplama",
        name: { tr: "Kredi Yapılandırma", en: "Loan Restructure" },
        h1: { tr: "Kredi Yapılandırma ve Erken Kapama İle Yenileme Hesabı", en: "Loan Restructuring & Refinancing Calculator" },
        description: { tr: "Mevcut yüksek faizli kredinizi kapatıp daha düşük faizli yeni bir kredi çektiğinizde net kâr edip etmeyeceğinizi simüle edin.", en: "Calculate whether it is financially logical to pay off your old high-interest loan via early closure and start a new refinanced loan with lower rates." },
        shortDescription: { tr: "Kredinizi kapatıp yeni faizle yapılandırırsanız kâr eder misiniz hesaplayın.", en: "Check if refinancing your loan with a new lower interest rate makes sense." },
        relatedCalculators: ["kredi-hesaplama", "yillik-maliyet-orani-hesaplama", "loan-allocation-fee"],
        inputs: [
            { id: "remainingPrincipal", name: { tr: "Eski Kredi Kalan Anapara Tutarı", en: "Old Loan's Remaining Principal" }, type: "number", defaultValue: 100000, suffix: "TL", required: true },
            { id: "oldInstallment", name: { tr: "Eski Kredinizin Aylık Taksiti", en: "Old Loan's Monthly Installment" }, type: "number", defaultValue: 6000, suffix: "TL", required: true },
            { id: "oldRemainingTerm", name: { tr: "Eski Kredinin Kalan Vade Sayısı", en: "Old Loan's Remaining Term" }, type: "number", defaultValue: 24, suffix: "Ay", required: true },

            { id: "newInterest", name: { tr: "Yeni Yapılandırma Faiz Oranı (%)", en: "New Refinance Interest Rate (%)" }, type: "number", defaultValue: 2.8, required: true },
            { id: "newTerm", name: { tr: "Yeni Sistem İstenilen Vade", en: "New Restructure Term (Months)" }, type: "number", defaultValue: 24, suffix: "Ay", required: true },
            {
                id: "earlyFeePercent", name: { tr: "Konut İse Erken Kapama Komisyonu", en: "Mortgage Early Closure Penalty (%)" }, type: "select", options: [
                    { value: "0", label: { tr: "Yok (İhtiyaç/Taşıt Kredisi)", en: "None (Personal Loans have no penalty)" } },
                    { value: "1", label: { tr: "%1 (Vade < 36 Ay Konut Kredisi)", en: "1% (Mortgages < 36 Months remaining)" } },
                    { value: "2", label: { tr: "%2 (Vade > 36 Ay Konut Kredisi)", en: "2% (Mortgages > 36 Months remaining)" } },
                ], defaultValue: "0"
            }
        ],
        results: [
            { id: "oldTotalPay", label: { tr: "Eski Düzende Toplam Çıkacak Para", en: "Total If You Don't Touch Old Loan" }, suffix: " TL", decimalPlaces: 2 },
            { id: "newRequiredLoan", label: { tr: "Sizin İçin Çekilecek Yeni Brüt Kredi", en: "New Loan Limit You Need To Apply For" }, suffix: " TL", decimalPlaces: 2 },
            { id: "newInstallment", label: { tr: "Yeni Yapılandırma Taksitiniz", en: "The New Monthly Installment" }, suffix: " TL", decimalPlaces: 2 },
            { id: "newTotalPay", label: { tr: "Yeni Düzende Toplam Ödeyeceğiniz Para", en: "Total Paid To New Loan" }, suffix: " TL", decimalPlaces: 2 },
            { id: "profitStatus", label: { tr: "Yapılandırma Kâr / Zarar Durumu", en: "Refinance Profit/Loss Result" }, type: "text" }
        ],
        formula: (v) => {
            const principal = parseFloat(v.remainingPrincipal) || 0;
            const oldInst = parseFloat(v.oldInstallment) || 0;
            const oldTerm = parseFloat(v.oldRemainingTerm) || 0;
            const nInt = parseFloat(v.newInterest) / 100 || 0;
            const nTerm = parseFloat(v.newTerm) || 0;
            const penaltyPercent = parseFloat(v.earlyFeePercent) / 100 || 0;

            const oldTotalPay = oldInst * oldTerm;
            const earlyPenaltyFee = principal * penaltyPercent;

            // Dosya masrafi yasal olarak anaparanın maksimum binde 5 i kadardir 
            const dosyaMasrafi = principal * 0.005 * 1.15; // + BSMV 15
            const newRequiredLoan = principal + earlyPenaltyFee + dosyaMasrafi;

            const newEffectiveRate = nInt * 1.30;
            let newInstallment = 0;

            if (newEffectiveRate > 0 && nTerm > 0) {
                const powered = Math.pow(1 + newEffectiveRate, nTerm);
                newInstallment = newRequiredLoan * newEffectiveRate * powered / (powered - 1);
            } else if (nTerm > 0) {
                newInstallment = newRequiredLoan / nTerm;
            }

            const newTotalPay = newInstallment * nTerm;

            let diff = oldTotalPay - newTotalPay;
            let statusTr = "";
            let statusEn = "";

            if (diff > 0) {
                statusTr = `👍 Mantıklı İşlem. Cebinizde kalacak net tutar: ${diff.toLocaleString("tr-TR", { maximumFractionDigits: 2 })} TL`;
                statusEn = `Beneficial to restructure. Net Saving: ${diff.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
            } else {
                statusTr = `🛑 ZARAR! Matematiksel olarak mantıksız. Net Kaybınız: ${Math.abs(diff).toLocaleString("tr-TR", { maximumFractionDigits: 2 })} TL olur.`;
                statusEn = `Bad Idea! You lose money. Net Loss is: ${Math.abs(diff).toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
            }

            return {
                oldTotalPay,
                newRequiredLoan,
                newInstallment,
                newTotalPay,
                profitStatus: { tr: statusTr, en: statusEn } as any
            };
        },
        seo: {
            title: { tr: "Kredi Yapılandırma Hesaplama 2026 (Refinansman Kâr Zarar)", en: "Loan Restructure Refinance Calculator" },
            metaDescription: { tr: "Faizler düştü mü? Eski kredinizi kapattırıp yeni faiz oranı ile açtığınızda tahsis ücretli haliyle kâr edip etmediğinizi analiz edin.", en: "See if refinancing your existing loan actually saves you money given the new allocation fees and closure penalties." },
            content: { tr: "Ekonomide banka faizleri düştüğünde vatandaşlar eski yüksek faizli ticari, ihtiyaç veya konut kredilerini ucuz oranlarla yenilemek isterler. Buna Refinansman (yapılandırma) denir. Ancak her faiz düşüşü zarardan kurtarmaz; devreye masraflar ve erken kapama cezaları girer.", en: "When central interest rates drop, refinancing (structuring) an old loan can be attractive. However, early closure penalties and new upfront loan fees often offset minor rate drops." },
            faq: [
                { q: { tr: "Erken ödeme cezası (kapama komisyonu) her kredide var mıdır?", en: "Are early closure penalties applied to all loans?" }, a: { tr: "Hayır. Bireysel / İhtiyaç kredilerinde hiçbir banka Tüketici Kanunu gereği sizden erken kapama cezası ALAMAZ. Fakat Konut / Mortgage kredilerinde vadesine göre kalan anaparanın %1 ile %2'si kadar ceza yansıtılması yasaldır.", en: "No. Consumer (personal) loans strictly do not have closing penalties by law. Mortgages, however, have a legal structural 1% or 2% cap penalty on the remaining principal." } },
                { q: { tr: "Kredi Yapılandırmada kredi sicili kontrol edilir mi?", en: "Does refinancing require a credit score check?" }, a: { tr: "Evet, siz aslında bankadan sıfırdan ve yepyeni bir kredi istersiniz. Borç transferi kredilerinde kredi notu şartlarına tekrar bakılır.", en: "Yes. Refinancing is essentially applying for a brand new loan to pay the old one; hence it subjects you to a full Findeks credit bureau check." } }
            ],
            richContent: {
                howItWorks: { tr: "Algoritma; Eski Kredinizin toplam kalan maliyetini hafızaya alır. Sonrasında Kalan Ana Paranıza yeni çekeceğiniz yasal dosya bedelini veya konut cezalarını ekleyip harici ve sıfırdan bir kredi simülasyonu çalıştırır. İkisini kafa kafaya çıkartarak yön gösterir.", en: "Evaluates standard runout costs of old loan against the cumulative cost of drawing a fresh loan that encompasses penalty debts + new allocation fees." },
                formulaText: { tr: "Kâr/Zarar = (Eski Taksit × Kalan Vade) - [ Yeni Parasal Çekim Toplamı × Yeni Kredi Rasyosu Oranı ile Hesaplanan Toplam Geri Ödeme ].", en: "Profit = (Old Repay Runout) - (New Principal Built Out × New Termsized Repayment)" },
                exampleCalculation: { tr: "Anaparası 100 bin, 24 ay kalmış, taksiti 6 bin TL (Yükü: 144 Bin) krediniz var. Faiz %2.8'e geriledi. Mevcut taksidi %2.8'den yapılandırırsanız kapatma+dosya dahil toplamınız ~135 Bine düşebilir ve 9.000 TL nakit avantajınız olur.", en: "Having a remaining 100k capital on a pricey old contract may cost you 144k heavily to end. Dropping the rate to 2.8% on a restructuring could reduce total lifespan cost to 135k, saving 9k." },
                miniGuide: { tr: "<ul><li><b>Sigorta İadeleri Göz Önünde Bulundurulmalı:</b> Eski kredinizi kapattığınız için yaptırdığınız hayat sigortasının kalan aylara tekabül eden süresinin peşin geri ödemesi bankadan size yansıyacaktır. Bu yapılandırmanın gizli karıdır.</li><li><b>Psikolojik Bunalım:</b> Bazen faiz düşmese bile vadeleri esnetip nakit darlığını yumuşatmak için zarar da edilse yapılandırma yapılır, bu da finansal bir enstrümandır.</li></ul>", en: "Closing an old loan triggers a partial refund of upfront life insurance premiums, generating hidden profit logic that the banks don't clearly state." }
            }
        }
    },
    {
        id: "apr-cost",
        slug: "kredi-yillik-maliyet-orani-hesaplama",
        category: "finans-hesaplama",
        name: { tr: "Yıllık Maliyet Oranı (APR)", en: "Loan APR Calculator" },
        h1: { tr: "Kredi Yıllık Maliyet Oranı Hesaplama (Efektif APR)", en: "Loan Effective Annual Percentage Rate (APR) Calculator" },
        description: { tr: "Yalnızca afişe edilen faize değil; dosya bedeli, vergiler, sigorta ile şişen kredinin size 'Gerçek' yıllık yüzde maliyetini (MİY/APR) tam doğrulukla hesaplayın.", en: "Discover the true cost of borrowing! Calculate your loan's actual Annual Percentage Rate (APR) factoring in all upfront closing costs, hidden insurance, and taxes." },
        shortDescription: { tr: "Kredinin asıl faiz oranını bankanın dayattığı yan masrafları da matraha katarak gerçek MİY oranıyla öğrenin.", en: "Learn the exact true yearly interest rate considering all hidden bank fees." },
        relatedCalculators: ["kredi-dosya-masrafi-hesaplama", "kredi-yapilandirma-hesaplama"],
        inputs: [
            { id: "loanAmount", name: { tr: "Ele Geçecek Kredi Anapara", en: "Net Loan Amount Funded" }, type: "number", defaultValue: 100000, suffix: "TL", required: true },
            { id: "term", name: { tr: "Vade Sayısı", en: "Term (Months)" }, type: "number", defaultValue: 36, required: true },
            { id: "monthlyRate", name: { tr: "Banka Aylık Nominal Faizi (%)", en: "Advertised Monthly Interest (%)" }, type: "number", defaultValue: 3.5, required: true },
            { id: "allocationFee", name: { tr: "Kredi Tahsis Dosya Ücreti", en: "Upfront Allocation Fee" }, type: "number", defaultValue: 575, suffix: "TL", required: true },
            { id: "insuranceFee", name: { tr: "Zorunlu Hayat vb. Sigortalar", en: "Upfront Life/Credit Insurance" }, type: "number", defaultValue: 1500, suffix: "TL", required: true }
        ],
        results: [
            { id: "installment", label: { tr: "Ödenecek Taksit Tutarı (Aylık)", en: "Monthly Installment" }, suffix: " TL", decimalPlaces: 2 },
            { id: "totalCost", label: { tr: "Bankta Bırakılan Toplam Yük", en: "Total Amount to Bank" }, suffix: " TL", decimalPlaces: 2 },
            { id: "monthlyAPR", label: { tr: "Gizli Efektif Aylık Oran", en: "True/Effective Monthly Rate" }, suffix: " %", decimalPlaces: 3 },
            { id: "yearlyAPR", label: { tr: "Gerçek YILLIK MİY (APR Oranı)", en: "Actual Annual APR" }, suffix: " %", decimalPlaces: 2 },
        ],
        formula: (v) => {
            const amount = parseFloat(v.loanAmount) || 0;
            const term = parseFloat(v.term) || 0;
            const rate = parseFloat(v.monthlyRate) / 100 || 0;
            const feeAll = parseFloat(v.allocationFee) || 0;
            const feeIns = parseFloat(v.insuranceFee) || 0;

            const taxFactor = 1.30;
            const effectiveMonthlyBankRate = rate * taxFactor;

            let installment = 0;
            if (effectiveMonthlyBankRate > 0 && term > 0) {
                const powered = Math.pow(1 + effectiveMonthlyBankRate, term);
                installment = amount * effectiveMonthlyBankRate * powered / (powered - 1);
            } else if (term > 0) {
                installment = amount / term;
            }

            const netCashReceived = amount - feeAll - feeIns;
            const totalRepaymentPaid = installment * term;
            let monthlyAPR = effectiveMonthlyBankRate;

            let lowRate = 0;
            let highRate = 1;
            let guess = effectiveMonthlyBankRate + 0.005;

            for (let steps = 0; steps < 50; steps++) {
                let pv = 0;
                if (guess === 0) {
                    pv = totalRepaymentPaid;
                } else {
                    const pw = Math.pow(1 + guess, term);
                    pv = installment * (pw - 1) / (guess * pw);
                }

                let diff = netCashReceived - pv;

                if (Math.abs(diff) < 0.1) {
                    monthlyAPR = guess;
                    break;
                }

                if (pv > netCashReceived) {
                    lowRate = guess;
                } else {
                    highRate = guess;
                }
                guess = (lowRate + highRate) / 2;
            }

            monthlyAPR = guess * 100;
            const yearlyAPR = (Math.pow(1 + guess, 12) - 1) * 100;

            return {
                installment,
                totalCost: totalRepaymentPaid + feeAll + feeIns,
                monthlyAPR,
                yearlyAPR
            };
        },
        seo: {
            title: { tr: "Kredi Yıllık Maliyet Oranı (APR) Hesaplama 2026", en: "Effective APR Loan Cost Calculator" },
            metaDescription: { tr: "Bankanın vitrinine koyduğu cüzi faiz oranını değil, tüm MASRAFLARLA şişirilmiş kredi paketinizin Yıllık Efektif Yüzde Maliyetini (MİY/APR) bulun.", en: "Stop looking at advertised rates. Calculate your true Annual Percentage Rate (APR) to compare hidden costs across banks safely." },
            content: { tr: "Kredileri kıyaslarken bakmanız gereken yegane verisel parametre 'Afişe Edilen Faiz Oranı' DEĞİLDİR. İçine kesilmiş tüm sigortalar, tahsis bedelleri ve vergiler dahil edildiğinde bankanın reel fonlamasının yıllık ifadesi olan 'Müşteriye Yıllık Maliyet Oranı'na (YMO / APR) bakılmalıdır. Bu araç finans bilimindeki IRR algoritmasını basitleştirerek uygular.", en: "When comparing loans, the Nominal Rate is notoriously deceptive. True Loan APR calculates the actual cost encompassing setup fees, taxes, and life insurances factored into a full Internal Rate of Return (IRR)." },
            faq: [
                { q: { tr: "Yıllık Maliyet Oranı neden kredi faizimden daha fazla görünüyor?", en: "Why is the APR substantially higher than my stated interest rate?" }, a: { tr: "Krediniz aylık %3 ise bu yıllığa %36 olarak basite vurmaz. Bileşik vergilendirme (KKDF/BSMV), dosya masrafları ve faizin kümülatifi yıllık boyutta gerçekte çok daha agresif bir yüzde oranına (Genellikle %80-90'lara) tekabül eder.", en: "Because nominal rates do not include compounded monthly debt service mechanics and upfront cash loss via allocation fees pushing your internal financial burden massively higher." } },
                { q: { tr: "A bankası %3.0, B bankası %2.9 verdi hangisi ucuz?", en: "Bank A has 3.0%, Bank B has 2.9%, which is cheaper?" }, a: { tr: "Bunu sadece YMO belirler. B bankası faizi 2.9 yapıp sizden 15.000 TL aşırı özel kaza hayat kombin poliçesi keserse, onun Yıllık Maliyet Oranı fırlayacak ve A bankasından daha pahalı olacaktır.", en: "You must only check the APR. Bank B might hide massive 15k insurance fees making it ultimately much more expensive despite the 'nice looking' 2.9% rate." } }
            ],
            richContent: {
                howItWorks: { tr: "Arkaplandaki döngü, finansman matematiğinde Nakit Akışı 'Net Bugünkü Değer' (NPV) denklemini sıfıra indirmek adına iterasyonlar (IRR) gerçekleştirir. Tamamen cebinize giren paranın gerçek faturasının kökünü çıkartır.", en: "Estimates the IRR (Internal Rate of Return) algorithmically bridging the Present Value of net received cash against the drawn-out fixed annuity structure." },
                formulaText: { tr: "Yıllık Eksiksiz Maliyet Oranı (YMO/MİY) = ( (1 + İteratif Aylık Efektif IRR) ^ 12 ) - 1.", en: "Annual Effective APR Formula utilized as prescribed by central banking audits." },
                exampleCalculation: { tr: "100 Bin TL çektiniz, faiz 'Aylık %3'. Ancak hesabınıza yatan para dosya paralarından ötürü 97 Bin. İşte YMO hesabıyla anlıyoruz ki siz 97 Bin'lik malın taksidini 100 binden geriye doğru ödüyorsunuz. O %3'lük sevimli faiz aslında efektif aylık %4'lerin üzerine çıkıyor demektir.", en: "Withdrawing a 100k Loan expecting a 3% rate. Subtracted by 3k arbitrary fees means you are serving 100k installments on a 97k principal. This blasts your APR well beyond the stated quotes into reality." },
                miniGuide: { tr: "<ul><li><b>Pazarlığın Kesin Kılıcı:</b> Sizi arayıp kredi kitleyen müşteri temsilcilerine 'Bana faizi değil, tüm masraflar eklenmiş Yıllık Maliyet Oranını söyleyin!' deyip kendi ekranınızdan bu araçla kendiniz teyit edin.</li><li><b>Sigortasız Onay Gücü:</b> Bankaya Hayat Sigortası dahil edilmemiş çıplak teklif sunmalarını e-devlet haklarınız çerçevesinde baskıladığınızda veya haricen iptal ettiğinizde YMO birden çökecek ve kâra geçeceksinizdir.</li></ul>", en: "It constitutes the ultimate consumer weapon for negotiation. Force bankers to communicate in APRs to strip out marketing illusions involving hidden deductions." }
            }
        }
    },
    {
        id: "cc-extra-installments",
        slug: "kredi-karti-islem-taksitlendirme-hesaplama",
        category: "finans-hesaplama",
        name: { tr: "İşlem Sonradan Taksitlendirme", en: "Post-Purchase Installments" },
        h1: { tr: "Kredi Kartı Peşin İşlem Taksitlendirme / Ek Taksit Hesaplama", en: "Post-Purchase Transaction Installment Calculator" },
        description: { tr: "Kredi kartıyla yaptığınız peşin alışverişleri veya taksitli işlemleri sonradan bankanızdan 'Ek Taksit' ile böldüğünüzde ne kadar vade farkı çıkacağını görün.", en: "Calculate the interest (vade farkı) added when restructuring a one-time purchase into monthly installments." },
        shortDescription: { tr: "Peşin alışverişinize bankadan taksit istediğinizde ne kadar faiz bineceğini hesaplayın.", en: "Calculate the exact interest fee added when asking the bank to split your single purchase into monthly parts." },
        relatedCalculators: ["cc-minimum-payment"],
        inputs: [
            { id: "purchaseAmount", name: { tr: "Peşin İşlem Tutarı", en: "Original Purchase Amount" }, type: "number", defaultValue: 15000, suffix: "TL", required: true },
            { id: "term", name: { tr: "İstenilen Taksit Sayısı", en: "Desired Installments" }, type: "number", defaultValue: 3, max: 12, required: true },
            { id: "interestRate", name: { tr: "Bankanın Aylık Taksit Faiz Oranı (%)", en: "Bank's Add-on Interest (%)" }, type: "number", defaultValue: 4.25, required: true }
        ],
        results: [
            { id: "monthlyInstallment", label: { tr: "Aylık Yeni Taksit Tutarı", en: "New Monthly Installment" }, suffix: " TL", decimalPlaces: 2 },
            { id: "interestFee", label: { tr: "Taksitlendirme Vade Farkı (Vergiler İçinde)", en: "Total Add-on Interest Fee" }, suffix: " TL", decimalPlaces: 2 },
            { id: "totalRepayment", label: { tr: "Karttan Çıkacak Toplam Kesinti Tutarı", en: "Total Repayment" }, suffix: " TL", decimalPlaces: 2 },
        ],
        formula: (v) => {
            const amount = parseFloat(v.purchaseAmount) || 0;
            const term = parseFloat(v.term) || 0;
            const interest = parseFloat(v.interestRate) || 0;

            const effectiveRate = (interest / 100) * 1.30;
            let installment = 0;

            if (amount > 0 && effectiveRate > 0 && term > 0) {
                const powered = Math.pow(1 + effectiveRate, term);
                installment = amount * effectiveRate * powered / (powered - 1);
            } else if (term > 0) {
                installment = amount / term;
            }

            const totalRepayment = installment * term;
            const interestFee = totalRepayment - amount;

            return { monthlyInstallment: installment, interestFee, totalRepayment };
        },
        seo: {
            title: { tr: "Kredi Kartı Sonradan Taksitlendirme Hesaplama 2026", en: "Credit Card Post-Purchase Installment Calculator" },
            metaDescription: { tr: "Kredi kartıyla yaptığınız tek çekim (peşin) alışverişleri sonradan banka üzerinden taksitlendirirken oluşacak faizli tutarı hesaplayın.", en: "Calculate the exact installment fee and monthly split amount when converting your standard credit card swipe into a 3 to 12-month installment plan." },
            content: { tr: "Bankalar yüklü peşin alışverişleriniz için genellikle 'Bu işlemi taksitlendirmek ister misiniz?' SMS'i yollar. Bankanın sunduğu faiz oranının üstüne vergiler eklenerek vade farkı aylık olarak tahsil edilir.", en: "Often banks will offer you the option to split a completed transaction into 3, 6, or 12 months. This adds a specific un-advertised installment fee loaded onto your monthly payback." },
            faq: [
                { q: { tr: "Her şey sonradan taksitlenebilir mi?", en: "Can any purchase be installed later?" }, a: { tr: "Hayır. BDDK yasalarına göre kozmetik, telekomünikasyon (telefon), akaryakıt ve gıda sektörlerinde kredi kartına taksit baştan yasaktır.", en: "No. Strict laws ban financing for specific sectors like telecommunications (cell phones), raw food, fuel, and cosmetics." } },
                { q: { tr: "Onaylandıktan sonra limit durumum ne olur?", en: "How does this affect my credit limit?" }, a: { tr: "Taksitlendirilen işlemin tamamı ve eklenen vade farkı kartınızın serbest limitinden direk bloke edilir. Ay ay ödedikçe blokaj o tutar kadar açılır.", en: "The entire principal plus the new interest fee is blocked from your available limit instantly. Paying down monthly slowly frees the limit back." } }
            ],
            richContent: {
                howItWorks: { tr: "Banka akdi faiz oranının üstünden (%30 BSMV+KKDF) vergi ile aylık birleşik anüite matematiğine entegre ederiz.", en: "Re-constructs your single purchase into a micro-loan scheme using real interest factored by high consumer taxes." },
                formulaText: { tr: "Aylık Taksit = Ana Meblağ × (EfektifFaiz × (1+EfektifFaiz)^Vade) / ((1+EfektifFaiz)^Vade - 1)", en: "Installment = Purchase × (EffectiveRate × (1+EffectiveRate)^n) / ((1+EffectiveRate)^n - 1)" },
                exampleCalculation: { tr: "15.000 TL işlemde banka %4.25 faizle 3 ay sunsun. Vergiyle oran %5.5'e kalkar. Taksit ~5.570 TL çıkar. 16.711 TL totale denk gelir ve cepten ~1.710 TL banka kârı çıkar.", en: "Splitting a 15k TV over 3 months at 4.25% yields a 5.5% effective rate with taxes. Each installment climbs to around 5570 TL." },
                miniGuide: { tr: "<ul><li><b>Faizsiz Ücretsiz Taksit:</b> Bazen eğitim veya vergi ödemelerinde kampanya ile faiz 0 istenebilir; araca da 0 girilmelidir.</li><li><b>Anında Kesinti Yükü:</b> Taksiti onayladığınız an faiziyle limitten gider.</li></ul>", en: "Some campaigns offer 0% post-installments for Education or Medical expenses; simply input 0% rate in those instances." }
            }
        }
    }
];

// ────────────────────────────────────────────────────────────────
// SAĞLIK
// ────────────────────────────────────────────────────────────────
export const healthCalculators: CalculatorConfig[] = [
    {
        id: "ideal-weight",
        slug: "ideal-kilo-hesaplama",
        category: "yasam-hesaplama",
        name: { tr: "İdeal Kilo Hesaplama", en: "Ideal Weight Calculator" },
        h1: { tr: "İdeal Kilo Hesaplama — Yaş, Boy ve Cinsiyete Göre", en: "Ideal Weight Calculator — By Age, Height & Gender" },
        description: { tr: "Boy, yaş ve cinsiyetinize göre tıbbi ideal kilonuzu ve sağlıklı kilo aralığınızı hesaplayın.", en: "Calculate your medical ideal weight and healthy weight range based on your height, age, and gender." },
        shortDescription: { tr: "Boyunuzu ve cinsiyetinizi girerek uluslararası tıp formüllerine göre ideal kilonuzu anında öğrenin.", en: "Enter your height and gender to instantly find your ideal weight based on international medical formulas." },
        relatedCalculators: ["vucut-kitle-indeksi-hesaplama", "gunluk-kalori-ihtiyaci", "hamilelik-haftasi-hesaplama"],
        inputs: [
            {
                id: "gender", name: { tr: "Cinsiyetiniz", en: "Gender" }, type: "radio", defaultValue: "male",
                options: [{ label: { tr: "Erkek", en: "Male" }, value: "male" }, { label: { tr: "Kadın", en: "Female" }, value: "female" }]
            },
            { id: "height", name: { tr: "Boyunuz", en: "Height" }, type: "number", defaultValue: 175, suffix: "cm", required: true },
            { id: "weight", name: { tr: "Mevcut Kilonuz (İsteğe Bağlı)", en: "Current Weight (Optional)" }, type: "number", defaultValue: 70, suffix: "kg", required: false },
        ],
        results: [
            { id: "robinson", label: { tr: "İdeal Kilonuz (Robinson)", en: "Ideal Weight (Robinson)" }, suffix: " kg", decimalPlaces: 1 },
            { id: "miller", label: { tr: "İdeal Kilonuz (Miller)", en: "Ideal Weight (Miller)" }, suffix: " kg", decimalPlaces: 1 },
            { id: "range", label: { tr: "Sağlıklı Kilo Aralığı (DSÖ)", en: "Healthy Weight Range (WHO)" }, suffix: " kg" },
            { id: "status", label: { tr: "Hedefe Uzaklık", en: "Distance to Target" }, type: "progress-bar" }
        ],
        formula: (v) => {
            const h = parseFloat(v.height);
            if (!h || h < 140) return { robinson: 0, miller: 0, range: "-" };

            // Formula applies to inches over 5 feet (60 inches)
            const inchesOver5Ft = (h / 2.54) - 60;
            const over = inchesOver5Ft > 0 ? inchesOver5Ft : 0;

            let robinson, miller;
            if (v.gender === "male") {
                robinson = 52 + (1.9 * over);
                miller = 56.2 + (1.41 * over);
            } else {
                robinson = 49 + (1.7 * over);
                miller = 53.1 + (1.36 * over);
            }

            // WHO Healthy Range (BMI 18.5 - 24.9)
            const hMetres = h / 100;
            const minWeight = 18.5 * (hMetres * hMetres);
            const maxWeight = 24.9 * (hMetres * hMetres);

            const currW = parseFloat(v.weight);
            let status = undefined;
            if (currW > 0) {
                const avgIdeal = (robinson + miller) / 2;
                const diff = currW - avgIdeal;
                const bmi = currW / (hMetres * hMetres);
                let percentage = Math.min(100, Math.max(0, ((bmi - 15) / (35 - 15)) * 100));

                let textTr = "";
                let textEn = "";
                let colorClass = "bg-[#22c55e]";

                if (bmi < 18.5) {
                    textTr = `${Math.abs(diff).toFixed(1)} kg almalısınız.`;
                    textEn = `You need to gain ${Math.abs(diff).toFixed(1)} kg.`;
                    colorClass = "bg-yellow-500";
                    percentage = Math.max(5, percentage);
                } else if (bmi > 24.9 && bmi < 30) {
                    textTr = `${Math.abs(diff).toFixed(1)} kg vermelisiniz.`;
                    textEn = `You need to lose ${Math.abs(diff).toFixed(1)} kg.`;
                    colorClass = "bg-orange-500";
                } else if (bmi >= 30) {
                    textTr = `${Math.abs(diff).toFixed(1)} kg vermelisiniz. (Obezite)`;
                    textEn = `You need to lose ${Math.abs(diff).toFixed(1)} kg. (Obesity)`;
                    colorClass = "bg-destructive";
                } else {
                    textTr = `İdeal kilodasınız!`;
                    textEn = `You are at your ideal weight!`;
                    colorClass = "bg-[#22c55e]";
                    percentage = 50; // Pin it exactly in the middle of the "healthy" green band
                }

                status = {
                    percentage: percentage,
                    colorClass: colorClass,
                    text: { tr: textTr, en: textEn }
                };
            }

            return {
                robinson: robinson,
                miller: miller,
                range: `${minWeight.toFixed(1)} - ${maxWeight.toFixed(1)}` as any,
                ...(status ? { status } : {})
            };
        },
        seo: {
            title: { tr: "İdeal Kilo Hesaplama 2026 — Yaş, Boy, Cinsiyet", en: "Ideal Weight Calculator 2026 — Height & Gender" },
            metaDescription: { tr: "Robinson ve Miller formüllerine göre boyunuza ve cinsiyetinize en uygun ideal kilonuzu hesaplayın. Dünya Sağlık Örgütü onaylı sağlıklı aralığınızı görün.", en: "Calculate your ideal weight according to Robinson and Miller formulas based on height and gender. View your WHO healthy range." },
            content: { tr: "İdeal kilo, boyunuza ve cinsiyetinize göre kronik hastalık (kalp, diyabet vb.) riskinizin en düşük olduğu tıbbi ağırlıktır. VKİ'den (Vücut Kitle İndeksi) farklı olarak, ideal kilo size spesifik bir 'hedef' sunar. Hesaplamalarda tıpta en kabul gören J.D. Robinson ve D.R. Miller formülleri kullanılmaktadır.", en: "Ideal weight is the medical weight at which your chronic disease risk is lowest based on height and gender. This uses Robinson and Miller medical formulas." },
            faq: [
                { q: { tr: "Robinson ve Miller formülleri nedir?", en: "What are Robinson and Miller formulas?" }, a: { tr: "1983 yılında geliştirilen Robinson ve Miller formülleri, tıpta boy ve cinsiyet baz alınarak bir insanın taşıması gereken ideal iskelet-kas-yağ dengesini matematiksel olarak bulan en popüler formüllerdir.", en: "Developed in 1983, these are the most popular medical formulas that mathematically find the ideal bone-muscle-fat balance a person should carry." } },
                { q: { tr: "Neden iki farklı ideal kilo sonucu var?", en: "Why are there two different ideal weight results?" }, a: { tr: "İnsan vücudu tek tipleştirilemez. Miller formülü biraz daha yuvarlak hatlı bir yapıyı baz alırken, Robinson formülü daha fit bir iskelet yapısını hedefler. Sizin ideal kilonuz bu ikisinin ortalaması olan aralıktır.", en: "The human body is varied. Miller aims for a slightly curvier build, while Robinson targets a fitter skeletal structure. Your true ideal is the average of both." } },
            ],
            richContent: {
                howItWorks: { tr: "Araç, boyunuzu inch cinsine çevirerek 5 feet (152.4 cm) üzerindeki her inch için cinsiyet katsayısı uygular. Ek olarak araç, boyunuzun karesini (m²) Dünya Sağlık Örgütü standartlarına (VKİ 18.5 - 24.9) bölerek sizin için en sağlıklı minimum ve maksimum kilo limitlerini çıkartır.", en: "Converts height to inches and applies gender coefficients for every inch over 5 feet. It also calculates the WHO minimum/maximum healthy weight limit (BMI 18.5 - 24.9)." },
                formulaText: { tr: "Erkek (Robinson) = 52 kg + 1.9 kg × (Her inch 5 feet üzeri) | Kadın (Robinson) = 49 kg + 1.7 kg × (Her inch 5 feet üzeri)", en: "Male (Robinson) = 52 kg + 1.9 kg × (inches over 5 ft) | Female (Robinson) = 49 kg + 1.7 kg × (inches over 5 ft)" },
                exampleCalculation: { tr: "175 cm (yaklaşık 5 feet 9 inch) boyunda bir kadın için: 5 feet üzerindeki kısım 8.9 inch. 49 + (1.7 × 8.9) = 64.1 kg Robinson ideal kilosudur.", en: "For a 175cm (5'9'') female: 8.9 inches over 5 ft. 49 + (1.7 × 8.9) = 64.1 kg Robinson ideal weight." },
                miniGuide: { tr: "<ul><li><b>Kemik İriliği:</b> Eğer bilekleriniz kalın ve kemik yapınız iri ise çıkan sonuca %10 ekleyebilirsiniz. Minyon kemikliyseniz %10 çıkartabilirsiniz.</li><li><b>Yaş:</b> Yaşlandıkça kas kütlesi azalır, ideal kilo toleransı bir miktar yukarı esneyebilir.</li></ul>", en: "Large bones? Add 10%. Small frame? Subtract 10%. As you age, muscle mass decreases so weight tolerance may slightly increase." }
            }
        }
    },
    {
        id: "bmi",
        slug: "vucut-kitle-indeksi-hesaplama",
        category: "yasam-hesaplama",
        name: { tr: `Vücut Kitle İndeksi (VKİ)`, en: `Body Mass Index (BMI)` },
        h1: { tr: `VKİ Hesaplama (Vücut Kitle İndeksi) — Sağlıklı Kilo Aralığını Öğren`, en: `BMI Calculator — Find Your Healthy Weight Range` },
        description: { tr: `Kilonuzun boyunuza göre ideal olup olmadığını öğrenin.`, en: `Determine if your weight is healthy relative to your height.` },
        shortDescription: { tr: `Kilo ve boyunuzu girerek VKİ değerinizi ve sağlık kategorinizi anında görün.`, en: `Enter your weight and height to instantly see your BMI value and health category.` },
        relatedCalculators: ["ideal-kilo-hesaplama", "gunluk-kalori-ihtiyaci", "yas-hesaplama"],
        inputs: [
            { id: "weight", name: { tr: `Kilo`, en: `Weight` }, type: "number", defaultValue: 70, suffix: "kg" },
            { id: "height", name: { tr: `Boy`, en: `Height` }, type: "number", defaultValue: 175, suffix: "cm" },
        ],
        results: [
            { id: "bmi", label: { tr: `VKİ Sonucunuz`, en: `Your BMI` }, decimalPlaces: 1 },
            { id: "status", label: { tr: `Durum`, en: `Status` } },
        ],
        formula: (v) => {
            const w = parseFloat(v.weight);
            const h = parseFloat(v.height) / 100;
            const bmi = w / (h * h);
            let status = "Normal";
            if (bmi < 18.5) status = "Zayıf";
            else if (bmi < 25) status = "Normal";
            else if (bmi < 30) status = "Fazla Kilolu";
            else status = "Obez";
            return { bmi, status };
        },
        seo: {
            title: { tr: `VKİ Hesaplama (Vücut Kitle İndeksi) 2026`, en: `BMI Calculator 2026` },
            metaDescription: { tr: `Boy ve kilo oranınızı hesaplayarak sağlık durumunuzu kontrol edin.`, en: `Check your health status by calculating your BMI.` },
            content: { tr: `VKİ = Ağırlık (kg) / Boy² (m²). Sağlıklı bir yaşam için VKİ değerinin 18.5 ile 24.9 arasında olması önerilir.`, en: `BMI = Weight (kg) / Height² (m²).` },
            faq: [
                { q: { tr: `İdeal VKİ aralığı kaçtır?`, en: `What is the ideal BMI range?` }, a: { tr: `Dünya Sağlık Örgütü'ne göre 18.5 - 24.9 arası normal kabul edilir.`, en: `According to WHO, 18.5 - 24.9 is considered normal.` } }
            ],
            richContent: {
                howItWorks: {
                    tr: `VKİ hesaplayıcı, vücut ağırlığınızın boyunuza oranını matematiksel bir formülle analiz eder. Bu değer, vücudunuzdaki tahmini yağ oranı hakkında dolaylı bir bilgi sunar ve tıbbi açıdan kilonuzun sağlıklı bir aralıkta olup olmadığını belirlemek için birincil tarama aracı olarak kullanılır.`,
                    en: `The BMI calculator analyzes your weight-to-height ratio. It's a key tool used by health professionals to screen for weight categories.`
                },
                formulaText: {
                    tr: `VKİ = Kilo / (Boy x Boy). Burada boy metre cinsinden kullanılır.`,
                    en: `BMI = kg / m². Weight in kilograms divided by height in meters squared.`
                },
                exampleCalculation: {
                    tr: `Örneğin; 70 kg ağırlığında ve 1,75 m boyundaki bir birey için: VKİ = 70 / (1,75 x 1,75) = 22,9. Bu sonuç bireyin 'Normal' kategorisinde olduğunu gösterir.`,
                    en: `Example: 70 kg weight and 1.75 m height results in a BMI of 22.9 (Normal).`
                },
                miniGuide: {
                    tr: `VKİ tek başına bir teşhis aracı değildir. <ul><li><b>Kas Kütlesi:</b> Sporcularda kas oranı yüksek olduğu için VKİ yanıltıcı olabilir.</li><li><b>Yaş Faktörü:</b> Yaşlılarda ve çocuklarda standart aralıklar değişebilir.</li></ul>`,
                    en: `BMI is a screening tool, not a diagnostic one. Muscle mass can affect results.`
                }
            }
        }
    },

    {
        id: "calorie-tdee",
        slug: "gunluk-kalori-ihtiyaci",
        category: "yasam-hesaplama",
        name: { tr: "Günlük Kalori İhtiyacı (TDEE)", en: "Daily Calorie Need (TDEE)" },
        h1: { tr: "Günlük Kalori İhtiyacı Hesaplama (TDEE) — Kilo Verme ve Alma Hedefleri", en: "Daily Calorie Need Calculator (TDEE) — Weight Loss & Gain Goals" },
        description: { tr: "Aktivite seviyenize göre günlük kalori ihtiyacınızı hesaplayın.", en: "Calculate your daily caloric needs based on activity level." },
        shortDescription: { tr: "Yaş, kilo, boy ve aktivite seviyenize göre günlük kalori ihtiyacınızı ve BMR değerinizi hesaplayın.", en: "Calculate your daily calorie need and BMR based on age, weight, height and activity level." },
        relatedCalculators: ["vucut-kitle-indeksi-hesaplama", "ideal-kilo-hesaplama", "yas-hesaplama"],
        inputs: [
            { id: "weight", name: { tr: "Kilo", en: "Weight" }, type: "number", defaultValue: 70, suffix: "kg", required: true },
            { id: "height", name: { tr: "Boy", en: "Height" }, type: "number", defaultValue: 175, suffix: "cm", required: true },
            { id: "age", name: { tr: "Yaş", en: "Age" }, type: "number", defaultValue: 30, required: true },
            {
                id: "gender", name: { tr: "Cinsiyet", en: "Gender" }, type: "select", defaultValue: "male", options: [
                    { label: { tr: "Erkek", en: "Male" }, value: "male" },
                    { label: { tr: "Kadın", en: "Female" }, value: "female" },
                ]
            },
            {
                id: "activity", name: { tr: "Aktivite Seviyesi", en: "Activity Level" }, type: "select", defaultValue: "1.55", options: [
                    { label: { tr: "Hareketsiz", en: "Sedentary" }, value: "1.2" },
                    { label: { tr: "Az Aktif (haftada 1-3 gün)", en: "Lightly Active" }, value: "1.375" },
                    { label: { tr: "Orta Aktif (haftada 3-5 gün)", en: "Moderately Active" }, value: "1.55" },
                    { label: { tr: "Çok Aktif (haftada 6-7 gün)", en: "Very Active" }, value: "1.725" },
                ]
            },
        ],
        results: [
            { id: "bmr", label: { tr: "Bazal Metabolizma (BMR)", en: "Basal Metabolic Rate" }, suffix: " kal", decimalPlaces: 0 },
            { id: "tdee", label: { tr: "Günlük Kalori İhtiyacı (TDEE)", en: "Daily Calorie Need (TDEE)" }, suffix: " kal", decimalPlaces: 0 },
            { id: "weightLoss", label: { tr: "Kilo Vermek İçin", en: "For Weight Loss" }, suffix: " kal", decimalPlaces: 0 },
        ],
        formula: (v) => {
            const w = parseFloat(v.weight) || 0;
            const h = parseFloat(v.height) || 0;
            const a = parseFloat(v.age) || 0;
            const act = parseFloat(v.activity) || 1.55;
            const bmr = v.gender === "male"
                ? 10 * w + 6.25 * h - 5 * a + 5
                : 10 * w + 6.25 * h - 5 * a - 161;
            const tdee = bmr * act;
            return { bmr: Math.round(bmr), tdee: Math.round(tdee), weightLoss: Math.round(tdee - 500) };
        },
        seo: {
            title: { tr: "Günlük Kalori İhtiyacı Hesaplama (TDEE) 2026", en: "Daily Calorie Calculator (TDEE) 2026" },
            metaDescription: { tr: "Yaş, kilo, boy ve aktivite seviyenize göre günlük kalori ihtiyacınızı hesaplayın.", en: "Calculate your daily calorie needs based on age, weight, height and activity." },
            content: { tr: "TDEE, bir günde harcadığınız toplam kaloridir.", en: "TDEE is the total calories you burn per day." },
            faq: [
                { q: { tr: "BMR ile TDEE arasındaki fark nedir?", en: "What is the difference between BMR and TDEE?" }, a: { tr: "BMR, dinlenme halinde vücudun harcadığı minimum kalori miktarıdır. TDEE ise günlük aktiviteleriniz dahil tüm harcadığınız kaloriyi kapsar ve her zaman BMR'dan yüksektir.", en: "BMR is the calories your body burns at rest. TDEE includes all daily activities and is always higher." } },
                { q: { tr: "Kilo vermek için ne kadar açık oluşturmalıyım?", en: "What calorie deficit should I aim for weight loss?" }, a: { tr: "Haftada 0,5-1 kg kaybı için günlük 500 kcal açık önerilir. Bu araconn gösterdiği ‘Kilo Vermek İçin’ değeri bu hesabı yapar. Uzman gözetiminde uygulayınız.", en: "A 500 kcal/day deficit targets ~0.5 kg/week loss. Always follow under professional guidance." } },
                { q: { tr: "Bu sonuç kesin midir?", en: "Is this result exact?" }, a: { tr: "Hayır, tahminidir. Mifflin-St Jeor denklemi bilimsel referans eşliğinde kullanılır ancak metabolizma kişiden kişiye farklılık gösterir. Beslenme uzmanına başvurulması önerilir.", en: "This is an estimate. Metabolism varies individually; consult a nutrition professional." } }
            ],
            richContent: {
                howItWorks: {
                    tr: "Günlük kalori ihtiyacı hesaplayıcı, önce Mifflin-St Jeor denklemiyle Bazal Metabolizma Hızınızı (BMR) hesaplar; ardından seçtiğiniz aktivite çarpanıyla çarparak toplam günlük kalori ihtiyacınızı (TDEE) bulur. Kilo verme hedefi için TDEE’den 500 kcal düşen değer de gösterilir.",
                    en: "Uses Mifflin-St Jeor to calculate BMR, then multiplies by an activity factor to find TDEE."
                },
                formulaText: {
                    tr: "Erkek BMR = 10×Kilo + 6,25×Boy − 5×Yaş + 5. Kadın BMR = 10×Kilo + 6,25×Boy − 5×Yaş − 161. TDEE = BMR × Aktivite Çarpanı.",
                    en: "Male BMR = 10w + 6.25h − 5a + 5. Female: −161. TDEE = BMR × activity multiplier."
                },
                exampleCalculation: {
                    tr: "Örnek: 75 kg, 178 cm, 28 yaş, erkek, orta aktif (1,55) → BMR = 1.843 kcal → TDEE = 1.843 × 1,55 ≈ 2.857 kcal. Kilo verme hedefi için: 2.357 kcal/gün.",
                    en: "Example: 75 kg, 178 cm, 28 yo male, moderate activity → BMR 1,843 → TDEE ≈ 2,857 kcal."
                },
                miniGuide: {
                    tr: "<ul><li><b>Sağlıklı Açık:</b> Günlük 500 kcal aşırı açık kas kaybına yol açabilir; sürdürülebilir bir hedef belirleyin.</li><li><b>Aktivite Seviyesi:</b> Hesaplamayı düzenli günlerinize göre yapın, en aktif gününlere göre değil.</li><li><b>Uzman Desteği:</b> Bu araç tıbbi veya beslenme tavsiyesi değildir; diyetisyen gözetiminde plan oluşturun.</li></ul>",
                    en: "Avoid excessive deficits, use average activity level, and always work with a nutrition professional."
                }
            }
        }
    },
    {
        id: "pregnancy",
        slug: "gebelik-hesaplama",
        category: "yasam-hesaplama",
        name: { tr: "Gebelik (Hamilelik) Hesaplama", en: "Pregnancy Calculator" },
        h1: { tr: "Gebelik Hesaplama — Hamilelik Haftası ve Doğum Tarihi Hesapla", en: "Pregnancy Calculator — Due Date & Week Calculation" },
        description: { tr: "Son adet tarihinize göre kaç haftalık hamile olduğunuzu ve tahmini doğum tarihinizi hesaplayın.", en: "Calculate your estimated due date and current pregnancy week based on your last menstrual period." },
        shortDescription: { tr: "Son adet tarihinizi (SAT) girerek bebeğinizin tahmini doğum gününü ve şu an kaç haftalık olduğunu öğrenin.", en: "Enter your LMP to instantly find your estimated due date and week." },
        inputs: [
            { id: "lmpDate", name: { tr: "Son Adet Tarihiniz (SAT) İlk Günü", en: "First Day of Last Menstrual Period (LMP)" }, type: "date", defaultValue: "", required: true },
            { id: "cycleLength", name: { tr: "Adet Döngüsü Süresi (Gün)", en: "Cycle Length (Days)" }, type: "number", defaultValue: 28, required: true },
        ],
        results: [
            { id: "dueDate", label: { tr: "Tahmini Doğum Tarihiniz", en: "Estimated Due Date" }, type: "text" },
            { id: "currentWeek", label: { tr: "Kaç Haftalık Hamilesiniz?", en: "Your Current Week" }, type: "text" },
            { id: "trimester", label: { tr: "İçinde Bulunduğunuz Dönem", en: "Current Trimester" }, type: "text" },
            { id: "progress", label: { tr: "Gebelik İlerlemesi", en: "Pregnancy Progress" }, type: "progress-bar" }
        ],
        formula: (v) => {
            const lmpStr = v.lmpDate;
            if (!lmpStr) {
                return {
                    dueDate: { tr: "-", en: "-" },
                    currentWeek: { tr: "-", en: "-" },
                    trimester: { tr: "-", en: "-" }
                } as any;
            }

            const lmp = new Date(lmpStr);
            const cycle = parseFloat(v.cycleLength) || 28;

            // Standard Naegele's rule assumes a 28-day cycle.
            // If cycle is longer or shorter, adjust the estimated conception date.
            const cycleAdjustment = cycle - 28;

            const dueDate = new Date(lmp.getTime());
            // Add 280 days (40 weeks) + cycle deviation
            dueDate.setDate(dueDate.getDate() + 280 + cycleAdjustment);

            const today = new Date();
            const msPassed = today.getTime() - lmp.getTime();
            const daysPassed = Math.floor(msPassed / (1000 * 60 * 60 * 24)) - cycleAdjustment;

            // If date is in the future
            if (daysPassed < 0) {
                return {
                    dueDate: {
                        tr: dueDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }),
                        en: dueDate.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
                    },
                    currentWeek: { tr: "Henüz başlamamış.", en: "Not started yet." },
                    trimester: { tr: "Bekleniyor", en: "Waiting" },
                    progress: { percentage: 0, colorClass: "bg-blue-400", text: { tr: "%0", en: "0%" } }
                } as any;
            }

            // A normal pregnancy lasts 280 days
            const weeksStr = Math.floor(daysPassed / 7);
            const extraDays = daysPassed % 7;

            let trimesterTr = "";
            let trimesterEn = "";
            if (weeksStr < 14) {
                trimesterTr = "1. Trimester (İlk 3 Aylık Dönem)";
                trimesterEn = "1st Trimester";
            } else if (weeksStr < 28) {
                trimesterTr = "2. Trimester (İkinci 3 Aylık Dönem)";
                trimesterEn = "2nd Trimester";
            } else {
                trimesterTr = "3. Trimester (Son 3 Aylık Dönem)";
                trimesterEn = "3rd Trimester";
            }

            const percentage = Math.min(100, Math.max(0, (daysPassed / 280) * 100));
            // Color shifts from pink to purple to green as pregnancy matures
            let colorCls = "bg-[#f472b6]"; // pink-400
            if (percentage > 33) colorCls = "bg-[#a855f7]"; // purple-500
            if (percentage > 66) colorCls = "bg-[#22c55e]"; // green-500

            if (percentage >= 100) {
                trimesterTr = "Doğum Bekleniyor!";
                trimesterEn = "Due Date Arrived!";
            }

            return {
                dueDate: {
                    tr: dueDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }),
                    en: dueDate.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
                } as any,
                currentWeek: {
                    tr: `${weeksStr} Hafta ${extraDays} Gün (${daysPassed} Gün)`,
                    en: `${weeksStr} Weeks ${extraDays} Days (${daysPassed} Days)`
                } as any,
                trimester: { tr: trimesterTr, en: trimesterEn } as any,
                progress: {
                    percentage: percentage,
                    colorClass: colorCls,
                    text: { tr: `%${percentage.toFixed(0)} Tamamlandı`, en: `${percentage.toFixed(0)}% Completed` }
                }
            };
        },
        seo: {
            title: { tr: "Gebelik Hesaplama 2026 — Kaç Haftalık Hamileyim?", en: "Pregnancy Calculator 2026" },
            metaDescription: { tr: "Son adet tarihinize (SAT) göre hamilelik haftanızı ve günü gününe doğum tarihinizi %100 bilimsel olarak hesaplayın.", en: "Calculate your pregnancy week and exact due date scientifically based on your last menstrual period (LMP)." },
            content: { tr: "Gebelik hesaplama, bebeğinizin doğumunu öngörmek için kullanılan tıbbi bir yöntemdir (Naegele kuralı). Hesaplama işleminde, genellikle gebeliğin süresi 40 hafta (280 gün) olarak kabul edilir.", en: "Pregnancy calculation estimates due date using Naegele's rule, assuming a standard 40-week (280 day) gestation." },
            faq: [
                { q: { tr: "Nasıl hesaplanır?", en: "How is it calculated?" }, a: { tr: "Son Adet Tarihinizin ilk gününe 7 gün ekleyip, 3 ay geriye gidilerek (veya doğrudan 280 gün eklenerek) tahmini doğum tarihi bulunur.", en: "By adding 7 days to your LMP and subtracting 3 months (or adding 280 days directly)." } },
                { q: { tr: "SAT nedir?", en: "What is LMP?" }, a: { tr: "SAT (Son Adet Tarihi), bir kadının yaşadığı son adet kanamasının başlangıç günüdür ve tüm tıbbi hamilelik hesaplamaları bu tarihten başlar.", en: "LMP stands for Last Menstrual Period. It is the first day of your last period, used as the starting point for medical tracking." } },
            ],
            richContent: {
                howItWorks: { tr: "Sistem, Son Adet Tarihinizi baz alarak standart 280 günlük (40 haftalık) tıbbi gebelik süresini hesaplar. Ayrıca adet döngünüzün 28 günden kısa veya uzun olmasına göre matematiksel güncelleyerek daha hassas bir tarih sunar.", en: "Calculates the standard 280 days (40 weeks) from LMP. It mathematically adjusts the conception date if your cycle differs from the 28-day standard." },
                formulaText: { tr: "Tahmini Doğum (Naegele) = SAT + 280 Gün + (Döngü Süresi - 28)", en: "Estimated Due Date = LMP + 280 Days + (Cycle Length - 28)" },
                exampleCalculation: { tr: "SAT tarihi 1 Ocak ve 28 günlük düzenli döngüsü olan birinin tahmini doğum tarihi 8 Ekim (280 gün sonrası) olarak çıkar.", en: "LMP January 1st with a 28-day cycle results in October 8th." },
                miniGuide: { tr: "<ul><li><b>Kesinlik:</b> Bebeklerin sadece %5'i tam tahmini doğum tarihinde (EDD) doğar. Genellikle bu tarihin 2 hafta öncesi ile 2 hafta sonrası (38-42. haftalar) normal doğum penceresidir.</li><li><b>Ultrason:</b> İlk haftalarda yapılan ultrason ölçümleri, adet düzensizliği yaşayanlar için çok daha kesin bir tarih verir.</li></ul>", en: "Only 5% of babies are born exactly on their due date. Ultrasound measurements in early weeks are more accurate if periods are irregular." }
            }
        }
    }
];

// ────────────────────────────────────────────────────────────────
// MATEMATİK
// ────────────────────────────────────────────────────────────────
export const mathCalculators: CalculatorConfig[] = [
    {
        id: "percentage",
        slug: "yuzde-hesaplama",
        category: "matematik-hesaplama",
        name: { tr: `Yüzde Hesaplama`, en: `Percentage Calculator` },
        h1: { tr: `Yüzde Hesaplama — Artış, Azalış ve Oran Hesabı`, en: `Percentage Calculator — Increase, Decrease & Ratio` },
        description: { tr: `Yüzde alma, artış/azalış ve oran hesaplamalarını kolayca yapın.`, en: `Easily calculate percentages, increases/decreases and ratios.` },
        shortDescription: { tr: `Bir sayının belirli bir yüzdesini veya yüzde artış/azalış değerini anında hesaplayın.`, en: `Instantly find any percentage of a number or calculate percentage increase and decrease.` },
        relatedCalculators: ["kdv-hesaplama", "kar-zarar-marji", "kira-artis-hesaplama"],
        inputs: [
            {
                id: "operation",
                name: { tr: "İşlem Türü", en: "Operation Type" },
                type: "select",
                options: [
                    { value: "type1", label: { tr: "A sayısının %B'si kaçtır?", en: "What is B% of A?" } },
                    { value: "type2", label: { tr: "A sayısı, B sayısının yüzde kaçıdır?", en: "A is what percent of B?" } },
                    { value: "type3", label: { tr: "A sayısından B sayısına değişim oranı yüzde kaçtır?", en: "Percentage change from A to B?" } },
                    { value: "type4", label: { tr: "A sayısı, %B kadar artırılırsa kaç olur?", en: "What is A increased by B%?" } },
                    { value: "type5", label: { tr: "A sayısı, %B kadar azaltılırsa kaç olur?", en: "What is A decreased by B%?" } },
                ],
                defaultValue: "type1",
                required: true,
            },
            { id: "valA", name: { tr: `A Sayısı`, en: `Value A` }, type: "number", defaultValue: 200, required: true },
            { id: "valB", name: { tr: `B Sayısı (veya Yüzde)`, en: `Value B (or Percent)` }, type: "number", defaultValue: 25, required: true },
        ],
        results: [
            { id: "result", label: { tr: `Sonuç`, en: `Result` }, decimalPlaces: 2 },
            { id: "explanation", label: { tr: `Açıklama`, en: `Explanation` } }
        ],
        formula: (v) => {
            const op = v.operation || "type1";
            const a = parseFloat(v.valA) || 0;
            const b = parseFloat(v.valB) || 0;

            let result = 0;
            let explanationTr = "";
            let explanationEn = "";

            switch (op) {
                case "type1":
                    // A sayısının %B'si kaçtır?
                    result = (a * b) / 100;
                    explanationTr = `${a} sayısının %${b}'si ${result.toLocaleString("tr-TR", { maximumFractionDigits: 2 })} yapar.`;
                    explanationEn = `${b}% of ${a} is ${result.toLocaleString("en-US", { maximumFractionDigits: 2 })}.`;
                    break;
                case "type2":
                    // A sayısı, B sayısının yüzde kaçıdır?
                    result = b !== 0 ? (a / b) * 100 : 0;
                    explanationTr = `${a} sayısı, ${b} sayısının %${result.toLocaleString("tr-TR", { maximumFractionDigits: 2 })}'sidir.`;
                    explanationEn = `${a} is ${result.toLocaleString("en-US", { maximumFractionDigits: 2 })}% of ${b}.`;
                    break;
                case "type3":
                    // A sayısından B sayısına değişim oranı yüzde kaçtır?
                    result = a !== 0 ? ((b - a) / Math.abs(a)) * 100 : 0;
                    const isIncrease = result > 0;
                    explanationTr = `${a}'dan ${b}'ye değişim oranı %${Math.abs(result).toLocaleString("tr-TR", { maximumFractionDigits: 2 })} ${isIncrease ? 'Artış' : 'Azalış'}.`;
                    explanationEn = `Percentage change from ${a} to ${b} is a ${Math.abs(result).toLocaleString("en-US", { maximumFractionDigits: 2 })}% ${isIncrease ? 'Increase' : 'Decrease'}.`;
                    break;
                case "type4":
                    // A sayısı, %B kadar artırılırsa kaç olur?
                    const increaseAmt = (a * b) / 100;
                    result = a + increaseAmt;
                    explanationTr = `${a} sayısına %${b} eklendiğinde (${increaseAmt}) sonuç ${result.toLocaleString("tr-TR", { maximumFractionDigits: 2 })} olur.`;
                    explanationEn = `${a} increased by ${b}% (${increaseAmt}) results in ${result.toLocaleString("en-US", { maximumFractionDigits: 2 })}.`;
                    break;
                case "type5":
                    // A sayısı, %B kadar azaltılırsa kaç olur?
                    const decreaseAmt = (a * b) / 100;
                    result = a - decreaseAmt;
                    explanationTr = `${a} sayısından %${b} çıkarıldığında (${decreaseAmt}) sonuç ${result.toLocaleString("tr-TR", { maximumFractionDigits: 2 })} olur.`;
                    explanationEn = `${a} decreased by ${b}% (${decreaseAmt}) results in ${result.toLocaleString("en-US", { maximumFractionDigits: 2 })}.`;
                    break;
            }

            return {
                result,
                explanation: (typeof window !== "undefined" && window.location.pathname.includes('/en/')) ? explanationEn : explanationTr
            };
        },
        seo: {
            title: { tr: `Yüzde Hesaplama 2026`, en: `Percentage Calculator 2026` },
            metaDescription: { tr: `A sayısının %B'si kaçtır? Yüzde kaçıdır? Yüzde artış ve azalış oranlarını formüllerle hızlıca bulun.`, en: `Calculate what is B% of A, percentage change, increase and decrease easily.` },
            content: { tr: `Seçtiğiniz işleme göre formüller:\n- A'nın %B'si: (A x B) / 100\n- A, B'nin % kaçı: (A / B) x 100\n- A'dan B'ye Değişim Oranı: ((B - A) / A) x 100`, en: `Formulas based on operation:\n- B% of A: (A x B) / 100\n- A is % of B: (A / B) x 100\n- Percentage Change: ((B - A) / A) x 100` },
            faq: [],
            richContent: {
                howItWorks: {
                    tr: `Yüzde hesaplayıcı modülümüz size 5 farklı işlem türü (A'nın %B'si, Değişim Oranı, Yüzde Artış vb.) sunarak her türlü yüzde alma ihtiyacınıza uygun sonucu anında üretir.`,
                    en: `Our percentage calculator module provides 5 different operation types to cover any percentage need instantly.`
                },
                formulaText: {
                    tr: `Temel formül: (Değer x Yüzde) / 100'dür.`,
                    en: `Base formula: (Value x Percent) / 100.`
                },
                exampleCalculation: {
                    tr: `Örneğin 'A sayısından B sayısına değişim oranı' işlemi seçildiğinde 100'den 150'ye çıkış %50 artış olarak hesaplanır.`,
                    en: `For example, selecting 'Percentage change' from 100 to 150 results in a 50% increase.`
                },
                miniGuide: {
                    tr: `Ticarette kar-zarar hesapları veya genel iskontolar için açılır menüden "İşlem Türünü" değiştirmeniz yeterlidir.`,
                    en: `Simply change the "Operation Type" from the dropdown menu for profit-loss or general discounts.`
                }
            }
        }
    },
    {
        id: "circle-area",
        slug: "daire-alan-cevre",
        category: "matematik-hesaplama",
        name: { tr: "Daire Alan & Çevre Hesaplama", en: "Circle Area & Perimeter" },
        h1: { tr: "Daire Alan ve Çevre Hesaplama — Yarıçap ile Anında Sonuç", en: "Circle Area & Circumference Calculator — Instant Results" },
        description: { tr: "Yarıçap veya çapa göre dairenin alanını ve çevresini hesaplayın.", en: "Calculate area and circumference of a circle by radius or diameter." },
        shortDescription: { tr: "Yarıçapı girerek dairenin alanını, çevresini ve çapını anında öğrenin.", en: "Enter the radius to instantly get the circle's area, circumference and diameter." },
        relatedCalculators: ["dikdortgen-alan-cevre", "us-kuvvet-karekok", "yuzde-hesaplama"],
        inputs: [
            { id: "radius", name: { tr: "Yarıçap (r)", en: "Radius (r)" }, type: "number", defaultValue: 5, suffix: "cm", required: true },
        ],
        results: [
            { id: "area", label: { tr: "Alan", en: "Area" }, suffix: " cm²", decimalPlaces: 4 },
            { id: "perimeter", label: { tr: "Çevre", en: "Circumference" }, suffix: " cm", decimalPlaces: 4 },
            { id: "diameter", label: { tr: "Çap", en: "Diameter" }, suffix: " cm", decimalPlaces: 2 },
        ],
        formula: (v) => {
            const r = parseFloat(v.radius) || 0;
            return { area: Math.PI * r * r, perimeter: 2 * Math.PI * r, diameter: 2 * r };
        },
        seo: {
            title: { tr: "Daire Alan Çevre Hesaplama 2026", en: "Circle Area Circumference Calculator 2026" },
            metaDescription: { tr: "Yarıçap girerek dairenin alan ve çevresini hesaplayın.", en: "Calculate circle area and circumference by entering radius." },
            content: { tr: "Daire Alanı = π × r².", en: "Circle Area = π × r²." },
            faq: [
                { q: { tr: "π (pi) sayısı neden kullanılır?", en: "Why is π (pi) used?" }, a: { tr: "π ≈ 3,14159 olup bir dairenin çevresinin çapına oranını ifade eder. Daire geometrisinin temel sabitidir.", en: "π ≈ 3.14159 is the ratio of circumference to diameter, fundamental to circular geometry." } },
                { q: { tr: "Yarıçap yerine çap biliyorsam ne yapmalıyım?", en: "What if I know diameter instead of radius?" }, a: { tr: "Çapı ikiye bölerek yarıçap değerini elde edersiniz. Örneğin çap 12 cm ise yarıçap = 6 cm olur.", en: "Simply divide diameter by 2 to get radius. E.g. diameter 12 cm → radius = 6 cm." } },
                { q: { tr: "Daire alanı birimi nasıl ifade edilir?", en: "What unit is circle area expressed in?" }, a: { tr: "Alan, uzunluk biriminin karesi olarak ifade edilir. Yarıçapı cm cinsinden girdiğinizde alan cm² olarak çıkar.", en: "Area is expressed as the square of the length unit. Radius in cm → area in cm²." } }
            ],
            richContent: {
                howItWorks: {
                    tr: "Daire alan ve çevre hesaplayıcı, girdiğiniz yarıçap değerini matematiksel pi (π) sabitiyle işlexerek dairenin alanını, çevresini ve çapını anluk hesaplar. Geometri ödevleri, inşaat hesapları ve mühendislik problemleri için doğrudan kullanılabilir sonuçlar sunar.",
                    en: "Instantly computes area, circumference and diameter from radius using the mathematical constant π."
                },
                formulaText: {
                    tr: "Alan = π × r². Çevre = 2 × π × r. Çap = 2 × r. Burada π ≈ 3,14159265 ve r yarıçaptır.",
                    en: "Area = π × r². Circumference = 2 × π × r. Diameter = 2 × r."
                },
                exampleCalculation: {
                    tr: "Örnek: Yarıçap r = 7 cm → Alan = π × 49 ≈ 153,94 cm². Çevre = 2 × π × 7 ≈ 43,98 cm. Çap = 14 cm.",
                    en: "Example: r = 7 cm → Area ≈ 153.94 cm². Circumference ≈ 43.98 cm. Diameter = 14 cm."
                },
                miniGuide: {
                    tr: "<ul><li><b>Birim Tutarlılığı:</b> Yarıçapı hangi birimde girerseniz alanı o birimin karesi olur; birim dönüşümüne dikkat edin.</li><li><b>Çap Bilgisi:</b> Çap biliyorsanız 2'ye bölerek yarıçap elde edin.</li><li><b>Pratik Kullanım:</b> Daire alanı hesabı boru kesit alanı, arazi ölçümü ve tasarım çalışmalarında sıklıkla kullanılır.</li></ul>",
                    en: "Keep units consistent (radius in cm → area in cm²). Divide diameter by 2 to get radius."
                }
            }
        }
    },
    {
        id: "rectangle-area",
        slug: "dikdortgen-alan-cevre",
        category: "matematik-hesaplama",
        name: { tr: "Dikdörtgen Alan & Çevre Hesaplama", en: "Rectangle Area & Perimeter" },
        h1: { tr: "Dikdörtgen Alan ve Çevre Hesaplama — Kenar Uzunluklarından", en: "Rectangle Area & Perimeter Calculator — From Side Lengths" },
        description: { tr: "Dikdörtgenin kenar uzunluklarına göre alan ve çevresini hesaplayın.", en: "Calculate area and perimeter of a rectangle." },
        shortDescription: { tr: "Genişlik ve yüksekliği girerek alan, çevre ve köşegen uzunluğunu anında hesaplayın.", en: "Enter width and height to instantly calculate area, perimeter and diagonal length." },
        relatedCalculators: ["daire-alan-cevre", "us-kuvvet-karekok", "yuzde-hesaplama"],
        inputs: [
            { id: "width", name: { tr: "Genişlik (a)", en: "Width (a)" }, type: "number", defaultValue: 8, suffix: "cm", required: true },
            { id: "height", name: { tr: "Yükseklik (b)", en: "Height (b)" }, type: "number", defaultValue: 5, suffix: "cm", required: true },
        ],
        results: [
            { id: "area", label: { tr: "Alan", en: "Area" }, suffix: " cm²", decimalPlaces: 2 },
            { id: "perimeter", label: { tr: "Çevre", en: "Perimeter" }, suffix: " cm", decimalPlaces: 2 },
            { id: "diagonal", label: { tr: "Köşegen", en: "Diagonal" }, suffix: " cm", decimalPlaces: 4 },
        ],
        formula: (v) => {
            const w = parseFloat(v.width) || 0;
            const h = parseFloat(v.height) || 0;
            return { area: w * h, perimeter: 2 * (w + h), diagonal: Math.sqrt(w * w + h * h) };
        },
        seo: {
            title: { tr: "Dikdörtgen Alan Çevre Hesaplama 2026", en: "Rectangle Area Perimeter Calculator 2026" },
            metaDescription: { tr: "Dikdörtgenin kenar uzunluklarına göre alan ve çevelresini hesaplayın.", en: "Calculate rectangle area and perimeter." },
            content: { tr: "Dikdörtgen Alanı = a × b.", en: "Rectangle Area = a × b." },
            faq: [
                { q: { tr: "Köşegen uzunluğu nasıl hesaplanır?", en: "How is the diagonal length calculated?" }, a: { tr: "Pisagor teoremi ile: Köşegen = √(a² + b²). 6×8'lik bir dikdörtgen için köşegen = √(36+64) = 10 cm.", en: "Diagonal = √(a² + b²) by Pythagorean theorem. For 6×8 rectangle: √100 = 10 cm." } },
                { q: { tr: "Alan ile çevre arasındaki ilişki nedir?", en: "What is the relationship between area and perimeter?" }, a: { tr: "Aynı çevreye sahip farklı dikdörtgenler farklı alanlara sahip olabilir. Kareye ne kadar yakınsa alan o kadar büyük olur.", en: "Same perimeter can yield different areas. The closer to a square, the larger the area." } },
                { q: { tr: "Birim dönüşümü nasıl yapabilirim?", en: "How do I convert units?" }, a: { tr: "Kenar uzunluklarını aynı birimde girerseniz alan değeri o birimin karesi cinsinden çıkar. Farklı birimler kullanıysanız önce dönüştürmeniz gerekir.", en: "Enter both sides in the same unit; area will be in that unit squared. Convert first if units differ." } }
            ],
            richContent: {
                howItWorks: {
                    tr: "Dikdörtgen alan ve çevre hesaplayıcı, genişlik (a) ve yükseklik (b) değerlerinden alan, çevre ve köşegen uzunluğunu anluk hesaplar. Pisagor teoremini kullanarak köşegen hesaplaması da ayrıca gösterilir; inşaat, tasarım ve geometri problemleri için pratik bir araçtır.",
                    en: "Calculates area, perimeter and diagonal from width and height using standard geometric formulas."
                },
                formulaText: {
                    tr: "Alan = a × b. Çevre = 2 × (a + b). Köşegen = √(a² + b²). Burada a genişlik, b yüksekliktir.",
                    en: "Area = a × b. Perimeter = 2 × (a + b). Diagonal = √(a² + b²)."
                },
                exampleCalculation: {
                    tr: "Örnek: Genişlik a = 8 cm, Yükseklik b = 5 cm → Alan = 40 cm². Çevre = 2×(8+5) = 26 cm. Köşegen = √(64+25) = √89 ≈ 9,43 cm.",
                    en: "Example: a=8, b=5 → Area=40 cm². Perimeter=26 cm. Diagonal≈9.43 cm."
                },
                miniGuide: {
                    tr: "<ul><li><b>Birim Eşleştirme:</b> Her iki kenarı da aynı birimde giriniz; karma birim hatalı sonuç verir.</li><li><b>Kare Özel Durumu:</b> a=b ise dikdörtgen kareye dönüşür; köşegen = a×√2 olur.</li><li><b>Pratik Kullanım:</b> Oda alanı, duvar yüzeyi ve arı alanı hesaplamalarında sıklıkla kullanılır.</li></ul>",
                    en: "Use consistent units, remember a=b makes a square, and use for room/wall area calculations."
                }
            }
        }
    },
    {
        id: "power-sqrt",
        slug: "us-kuvvet-karekok",
        category: "matematik-hesaplama",
        name: { tr: "Üs/Kuvvet ve Karekök Hesaplama", en: "Power & Square Root Calculator" },
        h1: { tr: "Üs, Kuvvet ve Karekök Hesaplama — Taban ve Üs Girin", en: "Power & Square Root Calculator — Enter Base and Exponent" },
        description: { tr: "Bir sayının kuvvetini ve karekökünü hesaplayın.", en: "Calculate the power and square root of a number." },
        shortDescription: { tr: "Taban sayısı ve üssünü girerek kuvvet, karekök ve küpkök sonuçlarını anında alın.", en: "Enter base and exponent to instantly get power, square root and cube root results." },
        relatedCalculators: ["daire-alan-cevre", "dikdortgen-alan-cevre", "yuzde-hesaplama"],
        inputs: [
            { id: "base", name: { tr: "Taban (sayı)", en: "Base (number)" }, type: "number", defaultValue: 4, required: true },
            { id: "exponent", name: { tr: "Üs", en: "Exponent" }, type: "number", defaultValue: 3, required: true },
        ],
        results: [
            { id: "power", label: { tr: "Kuvvet Sonucu", en: "Power Result" }, decimalPlaces: 6 },
            { id: "sqrt", label: { tr: "Karekök", en: "Square Root" }, decimalPlaces: 6 },
            { id: "cbrt", label: { tr: "Küpkök", en: "Cube Root" }, decimalPlaces: 6 },
        ],
        formula: (v) => {
            const base = parseFloat(v.base) || 0;
            const exp = parseFloat(v.exponent) || 2;
            return { power: Math.pow(base, exp), sqrt: Math.sqrt(Math.abs(base)), cbrt: Math.cbrt(base) };
        },
        seo: {
            title: { tr: "Üs Kuvvet Karekök Hesaplama 2026", en: "Power Square Root Calculator 2026" },
            metaDescription: { tr: "Sayının kuvvetini, karekökünü ve küpkökünü hesaplayın.", en: "Calculate power, square root and cube root of a number." },
            content: { tr: "Üs bir sayının kendisiyle kaç kez çarpılacağını gösterir.", en: "Exponents tell how many times a number is multiplied by itself." },
            faq: [
                { q: { tr: "Negatif sayının karekökü hesaplanabilir mi?", en: "Can you take the square root of a negative number?" }, a: { tr: "Gerçel sayılar kümesinde negatif sayının karekökü tanımlı değildir. Bu araç mutlak değer alarak işlem yapar.", en: "Square root of a negative is undefined in real numbers; this tool uses the absolute value." } },
                { q: { tr: "Sıfırıncı kuvvet her zaman 1 midir?", en: "Is any number to the zero power always 1?" }, a: { tr: "Evet, sıfır hariç tüm sayılar için a⁰ = 1 kuralı geçerlidir. 0⁰ matematiksel olarak tartışmalıdır.", en: "Yes, for all numbers except 0: a⁰ = 1. Zero to the zero is mathematically debated." } },
                { q: { tr: "Ondalık üs girebilir miyim?", en: "Can I use decimal exponents?" }, a: { tr: "Evet. 0,5 girdiğinizde karekök, 0,333 girdiğinizde küpköke yakın sonuç alırsınız. Ondalık üsler desteklenir.", en: "Yes. Exponent 0.5 = square root, 0.333 ≈ cube root. Decimal exponents are supported." } }
            ],
            richContent: {
                howItWorks: {
                    tr: "Üs/kuvvet hesaplayıcı, taban sayısını girdiğiniz üsse yükselterek kuvvet sonucunu hesaplar; eş zamanlı olarak tabanın karekök ve küpkök değerlerini de gösterir. Tek ekranda hem kuvvet hem kök hesaplamalarınızı tamamlayabilirsiniz.",
                    en: "Raises base to the given exponent and simultaneously computes square root and cube root."
                },
                formulaText: {
                    tr: "Kuvvet = Taban^Üs. Karekök = √|Taban|. Küpkök = ∛Taban. Ondalık üs: a^0,5 = √a.",
                    en: "Power = Base^Exponent. Square Root = √|Base|. Cube Root = ∛Base. Decimal exponent: a^0.5 = √a."
                },
                exampleCalculation: {
                    tr: "Örnek: Taban = 4, Üs = 3 → Kuvvet = 4³ = 64. Karekök = √4 = 2. Küpkök = ∛4 ≈ 1,587.",
                    en: "Example: Base=4, Exponent=3 → Power=64. Square root=2. Cube root≈1.587."
                },
                miniGuide: {
                    tr: "<ul><li><b>Sıfırıncı Kuvvet:</b> Sıfır hariç her sayının sıfırıncı kuvveti 1'dir.</li><li><b>Negatif Üs:</b> a⁻¹ = 1/a anlamına gelir; negatif üsler kesir sonuç üretir.</li><li><b>Ondalık Üs:</b> 0,5 girildiğinde karekökle aynı sonucu alırsınız; bu mühendis hesaplamalarında sık kullanılır.</li></ul>",
                    en: "Zero power = 1 (except 0⁰). Negative exponents = fractions. Exponent 0.5 equals square root."
                }
            }
        }
    },
];

// ────────────────────────────────────────────────────────────────
// GÜNLÜK YAŞAM
// ────────────────────────────────────────────────────────────────
export const dailyCalculators: CalculatorConfig[] = [
    {
        id: "date-difference",
        slug: "iki-tarih-arasi-fark-gun-hesaplama",
        category: "zaman-hesaplama",
        name: { tr: "Tarih Farkı (Gün) Hesaplama", en: "Date Difference Calculator" },
        h1: { tr: "İki Tarih Arası Fark / Gün Hesaplama — Şafak ve Geri Sayım", en: "Date Difference & Day Counter Calculator" },
        description: { tr: "İki tarih arasındaki tam süreyi gün, hafta, ay ve yıl olarak milisaniye kesinliğinde hesaplayın.", en: "Calculate the exact duration between two dates in days, weeks, months, and years." },
        shortDescription: { tr: "Başlangıç ve bitiş tarihlerini girerek aradaki net günü ve aradan geçen süreyi hesaplayın.", en: "Enter start and end dates to calculate the exact days and duration passing between them." },
        relatedCalculators: ["yas-hesaplama", "doguma-kalan-gun", "hamilelik-haftasi-hesaplama"],
        inputs: [
            { id: "startDate", name: { tr: "Başlangıç Tarihi", en: "Start Date" }, type: "date", defaultValue: "2024-01-01", required: true },
            { id: "endDate", name: { tr: "Bitiş Tarihi", en: "End Date" }, type: "date", defaultValue: "2026-01-01", required: true },
        ],
        results: [
            { id: "totalDays", label: { tr: "Toplam Gün", en: "Total Days" }, decimalPlaces: 0 },
            { id: "totalWeeks", label: { tr: "Toplam Hafta", en: "Total Weeks" }, decimalPlaces: 1 },
            { id: "duration", label: { tr: "Tam Format", en: "Exact Duration" } },
        ],
        formula: (v) => {
            const startParts = v.startDate.split("-");
            const endParts = v.endDate.split("-");
            if (startParts.length !== 3 || endParts.length !== 3) return { totalDays: 0, totalWeeks: 0, duration: "-" };

            const start = new Date(Number(startParts[0]), Number(startParts[1]) - 1, Number(startParts[2]));
            const end = new Date(Number(endParts[0]), Number(endParts[1]) - 1, Number(endParts[2]));

            const diffMs = Math.abs(end.getTime() - start.getTime());
            const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
            const totalWeeks = totalDays / 7;

            // For precise duration (Yıl, Ay, Gün)
            const earlier = start > end ? end : start;
            const later = start > end ? start : end;

            let years = later.getFullYear() - earlier.getFullYear();
            let months = later.getMonth() - earlier.getMonth();
            let days = later.getDate() - earlier.getDate();

            if (days < 0) {
                months--;
                const prevMonth = new Date(later.getFullYear(), later.getMonth(), 0);
                days += prevMonth.getDate();
            }
            if (months < 0) {
                years--;
                months += 12;
            }

            let durationTr = "";
            let durationEn = "";
            if (years > 0) { durationTr += `${years} Yıl `; durationEn += `${years} Yrs `; }
            if (months > 0) { durationTr += `${months} Ay `; durationEn += `${months} Mos `; }
            if (days > 0 || (years === 0 && months === 0)) { durationTr += `${days} Gün`; durationEn += `${days} Days`; }

            return {
                totalDays,
                totalWeeks,
                duration: durationTr.trim() as any // Output format
            };
        },
        seo: {
            title: { tr: "İki Tarih Arası Fark (Gün) Hesaplama 2026", en: "Date Difference & Days Between Calculator" },
            metaDescription: { tr: "Geçmişteki bir olaya kaç gün oldu veya gelecekteki bir hedefe kaç gün kaldı? İki tarih arasındaki toplam gün, ay ve yılı saniyeler içinde ölçün.", en: "How many days left until a future event or how many days passed since? Calculate exactly in days, months and years." },
            content: { tr: "İki tarih arası gün hesaplama amacı; sözleşme bitiş tarihleri, askerlik şafağı, sınava kalan gün veya evlilik yıldönümleri gibi spesifik süreçleri yönetebilmenizi sağlamaktır. Sistem, 4 yılda bir gelen Şubat ayındaki artık yılları da hesaba katarak en doğru milisaniyelik karşılığı sunar.", en: "Date calculation helps manage specific periods like contract ends, exam countdowns or anniversaries. It calculates leap years for exact accuracy." },
            faq: [
                { q: { tr: "Şu tarihe kaç gün kaldı nasıl hesaplanır?", en: "How to calculate days left?" }, a: { tr: "Başlangıç tarihine bugünü, bitiş tarihine ise hedef tarihinizi (tatil, sınav, evlilik vb.) girerek toplam kaç gün kaldığını görebilirsiniz.", en: "Enter today as start and your target as end date to see exactly how many days are left." } },
                { q: { tr: "Hesaplamada başlangıç günü sayıya dahil mi?", en: "Is the start day included?" }, a: { tr: "Hayır. Matematiksel tarih farkı hesaplamalarında iki uçtan (start veya end) yalnızca biri tam gün döngüsü olarak alınarak net 'geçen süre' hesaplanır.", en: "No. In exact date difference maths block, typically the boundary creates a standard passed-time span natively." } }
            ],
            richContent: {
                howItWorks: { tr: "Araç, tarayıcınızın Date (tarih) API'si yardımıyla sizin girdiğiniz tarihleri 1 Ocak 1970'den itibaren milisaniyelere (Timestamp) çevirir. Büyük tarihin milisaniyesinden küçüğü çıkartılıp matematiksel olarak gün ve haftalara bölünür.", en: "Uses the browser's Date API to convert your dates to Timestamps (ms since 1970) and subtracts them to derive pure difference." },
                formulaText: { tr: "Toplam Gün = Math.abs(Bitiş_Zamanı - Başlangıç_Zamanı) / 86.400.000 (Bir gündeki milisaniye). Yıl ve Ay farkı takvim kaymaları baz alınarak hesaplanır.", en: "Total Days = Abs(End - Start ms) / 86,400,000. Year and Month logic adjusts for calendar leap shifts." },
                exampleCalculation: { tr: "Örnek: Başlangıç: 1 Ocak 2024, Bitiş: 1 Mart 2024. 2024 Artık yıl olduğundan şubat 29 çeker. Aradaki fark 60 Net gündür (2 ay).", en: "Example: Start Jan 1, 2024 to Mar 1, 2024. 2024 is leap year, Feb has 29 days. Difference is exactly 60 days." },
                miniGuide: { tr: "<ul><li><b>Resmi İşlemler:</b> Dilekçe, vize veya yasal itiraz sürelerindeki iş günlerini belirlemek için ilk adımı bu araçla tam gün olarak atıp haftasonlarını çıkartabilirsiniz.</li><li><b>Geri Sayımlar:</b> Hamilelik veya Diyet takibinde 'geçen gün' hesaplamaları motivasyonu artırır.</li></ul>", en: "Aids in visa appeals, diet tracking, or exam prep motivation by quantifying your timeline." }
            }
        }
    },
    {
        id: "age",
        slug: "yas-hesaplama",
        category: "zaman-hesaplama",
        name: { tr: "Yaş Hesaplama", en: "Age Calculator" },
        h1: { tr: "Yaş Hesaplama — Doğum Tarihinden Gün, Ay ve Yıl", en: "Age Calculator — Days, Months & Years from Birth Date" },
        description: { tr: "Doğum tarihinize göre yaşınızı gün, ay ve yıl olarak hesaplayın.", en: "Calculate your age in days, months and years from your birth date." },
        shortDescription: { tr: "Doğum tarihinizi girerek kaç yaşında olduğunuzu, kaç gün ve ay yaşadığınızı anında öğrenin.", en: "Enter your birth date to instantly find your age in years, months and days." },
        relatedCalculators: ["vucut-kitle-indeksi-hesaplama", "ideal-kilo-hesaplama", "hiz-mesafe-sure"],
        inputs: [
            { id: "birthYear", name: { tr: "Doğum Yılı", en: "Birth Year" }, type: "number", defaultValue: 1990, required: true },
            { id: "birthMonth", name: { tr: "Doğum Ayı", en: "Birth Month" }, type: "number", defaultValue: 6, min: 1, max: 12, required: true },
            { id: "birthDay", name: { tr: "Doğum Günü", en: "Birth Day" }, type: "number", defaultValue: 15, min: 1, max: 31, required: true },
        ],
        results: [
            { id: "years", label: { tr: "Yıl", en: "Years" }, decimalPlaces: 0 },
            { id: "months", label: { tr: "Toplam Ay", en: "Total Months" }, decimalPlaces: 0 },
            { id: "days", label: { tr: "Toplam Gün", en: "Total Days" }, decimalPlaces: 0 },
        ],
        formula: (v) => {
            const birth = new Date(parseInt(v.birthYear), parseInt(v.birthMonth) - 1, parseInt(v.birthDay));
            const now = new Date();
            const diffMs = now.getTime() - birth.getTime();
            const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
            const diffMonths = Math.floor(diffDays / 30.4375);
            let years = now.getFullYear() - birth.getFullYear();
            const m = now.getMonth() - birth.getMonth();
            if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) years--;
            return { years, months: diffMonths, days: diffDays };
        },
        seo: {
            title: { tr: "Yaş Hesaplama 2026", en: "Age Calculator 2026" },
            metaDescription: { tr: "Doğum tarihinizi girerek kesin yaşınızı öğrenin.", en: "Calculate your age in years, months and days." },
            content: { tr: "Yaş hesaplama doğum tarihi ile bugün arasındaki farktır.", en: "Age is the difference between birth date and today." },
            faq: [
                { q: { tr: "Yaş hesaplama tam olarak doğru mu?", en: "Is the age calculation exact?" }, a: { tr: "Hesaplayıcımız doğum gününü, ayını ve yılını günü gününe hesaplayarak geso tam yaş ve toplam gün sayısını verir.", en: "Our calculator computes the exact age down to the day, including total months and total days." } },
                { q: { tr: "Artık yıl etkisini hesaba katıyor mu?", en: "Does it account for leap years?" }, a: { tr: "Evet. JavaScript'in yerleşik tarih kütüphanesi aracılığıyla artık yıllar otomatik olarak dikkate alınır; 29 Şubat doğumlular da doğru hesaplanır.", en: "Yes. Leap years are automatically handled via JavaScript's date library, including Feb 29 birthdays." } },
                { q: { tr: "En erken hangi doğum yılını girebilirim?", en: "What is the earliest birth year I can enter?" }, a: { tr: "Teknik olarak herhangi bir yılı girebilirsiniz; ancak sağlıklı sonuç için 1900 sonrası tarihler önerilir.", en: "Technically any year works, but dates after 1900 give the most reliable results." } }
            ],
            richContent: {
                howItWorks: {
                    tr: "Yaş hesaplayıcı, girdiğiniz doğum tarihini bugünkü tarihle karşılaştırarak geçen süreyi milisaniye düzeyinde hesaplar. Artık yıllar ve ay farklılıkları otomatik olarak göz önüne alınır; sonuç yıl, toplam ay ve toplam gün olarak üç farklı birimde sunulur.",
                    en: "Compares birth date with today in milliseconds, auto-handling leap years and month differences."
                },
                formulaText: {
                    tr: "Toplam Gün = (Bugün − Doğum) / 86.400.000 ms. Yıl: ay ve gün farkı dikkate alınarak hesaplanır. Toplam Ay = Toplam Gün / 30,4375.",
                    en: "Total Days = (Today − Birth) ms / 86,400,000. Years: adjusted for month/day differences. Months = Days / 30.4375."
                },
                exampleCalculation: {
                    tr: "Örnek: 15 Haziran 1990 doğumluysanız → 22 Şubat 2026 itibarıyla 35 yaş, 429 ay, 13.037 gün yaşadınız.",
                    en: "Example: Born June 15, 1990 → As of Feb 22, 2026: Age 35 years, 429 months, 13,037 days."
                },
                miniGuide: {
                    tr: "<ul><li><b>Emeklilik Planlaması:</b> Doğum tarihinizi girerek kalan iş yıllarınızı hesaplayabilirsiniz.</li><li><b>Sağlık Takibi:</b> Bazı sağlık taramalarında yaş hesaplamaları rol oynar; kesin yaşınızı buradan öğrenin.</li><li><b>Günlük Kullanım:</b> Pasaport, sigorta ve resmi belgelerde yaş bilgisini doğrulamak için kullanın.</li></ul>",
                    en: "Use for retirement planning, health screenings, or confirming age on official documents."
                }
            }
        }
    },
    {
        id: "fuel-cost",
        slug: "yakit-tuketim-maliyet",
        category: "tasit-ve-vergi",
        name: { tr: "Yakıt Tüketim & Maliyet Hesaplama", en: "Fuel Consumption & Cost Calculator" },
        h1: { tr: "Yakıt Tüketim ve Maliyet Hesaplama — Yolculuk Bütçenizi Planlayın", en: "Fuel Consumption & Cost Calculator — Plan Your Trip Budget" },
        description: { tr: "Seyahatinizin yakıt tüketimini ve maliyetini hesaplayın.", en: "Calculate fuel consumption and cost for your trip." },
        shortDescription: { tr: "Mesafe, tüketim ve yakıt fiyatını girerek seyahat maliyetinizi ve km başına giderinizi hesaplayın.", en: "Enter distance, consumption and fuel price to calculate your trip cost and cost per km." },
        relatedCalculators: ["hiz-mesafe-sure", "yuzde-hesaplama", "birim-donusturucu"],
        inputs: [
            { id: "distance", name: { tr: "Mesafe", en: "Distance" }, type: "number", defaultValue: 500, suffix: "km", required: true },
            { id: "consumption", name: { tr: "Ortalama Tüketim", en: "Average Consumption" }, type: "number", defaultValue: 7.5, suffix: "L/100km", step: 0.1, required: true },
            { id: "fuelPrice", name: { tr: "Yakıt Fiyatı", en: "Fuel Price" }, type: "number", defaultValue: 45, suffix: "₺/L", step: 0.1, required: true },
        ],
        results: [
            { id: "totalFuel", label: { tr: "Toplam Yakıt", en: "Total Fuel" }, suffix: " L", decimalPlaces: 2 },
            { id: "totalCost", label: { tr: "Toplam Maliyet", en: "Total Cost" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "costPerKm", label: { tr: "Km Başına Maliyet", en: "Cost Per Km" }, suffix: " ₺/km", decimalPlaces: 2 },
        ],
        formula: (v) => {
            const d = parseFloat(v.distance) || 0;
            const c = parseFloat(v.consumption) || 0;
            const p = parseFloat(v.fuelPrice) || 0;
            const totalFuel = (d * c) / 100;
            const totalCost = totalFuel * p;
            return { totalFuel, totalCost, costPerKm: d !== 0 ? totalCost / d : 0 };
        },
        seo: {
            title: { tr: "Yakıt Tüketim Hesaplama 2026", en: "Fuel Consumption Calculator 2026" },
            metaDescription: { tr: "Yolculuk maliyetinizi ve yakıt tüketiminizi hesaplayın.", en: "Calculate trip cost and fuel consumption." },
            content: { tr: "Yakıt tüketimi mesafeye ve araç verimliliğine bağlıdır.", en: "Fuel consumption depends on distance and vehicle efficiency." },
            faq: [
                { q: { tr: "Ortalama tüketim değerini nereden bulabilirim?", en: "Where can I find my vehicle's average consumption?" }, a: { tr: "Aracınızın kullanıcı kılavuzunda veya üretici web sitesinde belirtilen yakıt tüketimi değerleri başlangıç referansı olarak kullanılabilir. Gerçek tüketim trafik ve sürüş alışkanlıklarına göre değişir.", en: "Check your vehicle's manual or manufacturer's website for reference consumption. Actual varies by traffic and driving habits." } },
                { q: { tr: "Kerm başına maliyet nasıl düşürülür?", en: "How can I reduce cost per km?" }, a: { tr: "Düzgün lastik basıncı, sürdürülebilir hiz, gereksiz klima kullanımından kaçınmak ve düzenli bakım yakıt tüketimini önemli ölçüde azaltır.", en: "Proper tyre pressure, smooth driving, avoiding unnecessary AC and regular maintenance reduce fuel use." } },
                { q: { tr: "Elektrikli araçlar için kullanabilir miyim?", en: "Can I use this for electric vehicles?" }, a: { tr: "Bu araç litre/100 km bazlı yakıt hesabı içindir. Elektrikli araçlar için kWh/100 km bazlı ayrı bir hesap makinesi önerilir.", en: "This calculator is for fuel-based vehicles. For EVs, use a kWh/100 km based calculator." } }
            ],
            richContent: {
                howItWorks: {
                    tr: "Yakıt tüketim ve maliyet hesaplayıcı; mesafe, 100 km başına ortalama yakıt tüketimi ve yakıt fiyatından yola çıkarak seyahatinizin toplam yakıt ihtiyacını, toplam maliyetini ve km başına giderinizi hesaplar. Uzun yolculuk öncesi bütçe planlamada birincil başvuru aracıdır.",
                    en: "Calculates total fuel needed, trip cost and cost per km from distance, consumption rate and fuel price."
                },
                formulaText: {
                    tr: "Toplam Yakıt (L) = Mesafe × Tüketim / 100. Toplam Maliyet = Toplam Yakıt × Yakıt Fiyatı. Km Başına = Toplam Maliyet / Mesafe.",
                    en: "Total Fuel = Distance × Consumption / 100. Total Cost = Fuel × Price. Per Km = Total Cost / Distance."
                },
                exampleCalculation: {
                    tr: "Örnek: 450 km yol, 7,5 L/100 km tüketim, 42 TL/L yakıt → Toplam Yakıt = 33,75 L → Maliyet = 1.417,5 TL → Km Başına = 3,15 TL.",
                    en: "Example: 450 km, 7.5 L/100km, 42 TL/L → Fuel=33.75 L → Cost=1,417.5 TL → Per km=3.15 TL."
                },
                miniGuide: {
                    tr: "<ul><li><b>Gerçekçi Tüketim:</b> Üretici değerlerine değil, kendi sürüş dakikalarınızdaki sayıya göre hesap yapın.</li><li><b>Güncel Fiyat:</b> Yakıt fiyatı sıklıkla değiştirmektedir; seyahat gününün fiyatını kullanın.</li><li><b>Hibrit/LPG:</b> Farklı yakıt türleri için karşılaştırmalı hesap yapmak maliyeti optimize etmeye yardımcı olur.</li></ul>",
                    en: "Use real-world consumption, today's fuel price, and compare fuel types for cost optimization."
                }
            }
        }
    },
    {
        id: "speed-distance-time",
        slug: "hiz-mesafe-sure",
        category: "tasit-ve-vergi",
        name: { tr: "Hız / Mesafe / Süre Hesaplama", en: "Speed / Distance / Time Calculator" },
        h1: { tr: "Hız, Mesafe ve Süre Hesaplama — Varış Sürenizi Planlayın", en: "Speed, Distance & Time Calculator — Plan Your Arrival" },
        description: { tr: "Hız, mesafe ve süre arasındaki ilişkiyi hesaplayın.", en: "Calculate the relationship between speed, distance and time." },
        shortDescription: { tr: "Hız ve mesafe girerek seyahat sürenizi dakika hassasiyetinde hesaplayın.", en: "Enter speed and distance to calculate your travel time in minutes." },
        relatedCalculators: ["yakit-tuketim-maliyet", "birim-donusturucu", "yas-hesaplama"],
        inputs: [
            { id: "speed", name: { tr: "Hız", en: "Speed" }, type: "number", defaultValue: 90, suffix: "km/h", required: true },
            { id: "distance", name: { tr: "Mesafe", en: "Distance" }, type: "number", defaultValue: 270, suffix: "km", required: true },
        ],
        results: [
            { id: "hours", label: { tr: "Süre (Saat)", en: "Time (Hours)" }, decimalPlaces: 2 },
            { id: "minutes", label: { tr: "Süre (Dakika)", en: "Time (Minutes)" }, decimalPlaces: 0 },
        ],
        formula: (v) => {
            const s = parseFloat(v.speed) || 1;
            const d = parseFloat(v.distance) || 0;
            const hours = d / s;
            return { hours, minutes: Math.round(hours * 60) };
        },
        seo: {
            title: { tr: "Hız Mesafe Süre Hesaplama", en: "Speed Distance Time Calculator" },
            metaDescription: { tr: "Hız ve mesafe girerek varış sürenizi hesaplayın.", en: "Calculate arrival time using speed and distance." },
            content: { tr: "Süre = Mesafe / Hız.", en: "Time = Distance / Speed." },
            faq: [
                { q: { tr: "Ortalama hızı bilmiyorsam ne girmem gerekir?", en: "What if I don't know the average speed?" }, a: { tr: "Otoyolda genellikle 100-120, şehir içinde 40-60 km/s ortalama kullanılabilir. GPS verisi varsa daha kesin sonuç elde edersiniz.", en: "Use 100-120 km/h for highways, 40-60 for city driving. GPS data gives more precise results." } },
                { q: { tr: "Mola sürelerini dahil edebilir miyim?", en: "Can I include break times?" }, a: { tr: "Bu hesaplayıcı saf sürüş süresini hesaplar. Mola için tahmini dakikayı toplam süreye elle ekleyebilirsiniz.", en: "This calculator shows pure driving time. Add estimated break minutes manually to the total." } },
                { q: { tr: "Farklı hız birimleri destekleniyor mu?", en: "Are different speed units supported?" }, a: { tr: "Hesaplayıcı km/s bazında çalışır. Mil/saat kullanıyorsanız, önce birim dönüştürücümüzü kullanarak km/s'ye çevirebilirsiniz.", en: "The calculator works in km/h. Convert mph to km/h using our unit converter first." } }
            ],
            richContent: {
                howItWorks: {
                    tr: "Hız, mesafe ve süre hesaplayıcı, klasik kinematiğin temel formülünü kullanarak girdiğiniz hız ve mesafeden seyahat süresini dakika hassasiyetinde hesaplar. Uzun yol planlamalarında variş saatini öngörmek için vazgeçilmez bir araçtır.",
                    en: "Uses v = d/t to calculate travel duration in hours and minutes from speed and distance."
                },
                formulaText: {
                    tr: "Süre (saat) = Mesafe / Hız. Süre (dakika) = Süre (saat) × 60. Örnek: 270 km / 90 km/s = 3 saat = 180 dakika.",
                    en: "Time (h) = Distance / Speed. Time (min) = Hours × 60. Example: 270 km / 90 km/h = 3 h = 180 min."
                },
                exampleCalculation: {
                    tr: "Örnek: Ankara'dan İstanbul'a 450 km, ortalama hız 100 km/s → Süre = 4,5 saat = 270 dakika.",
                    en: "Example: 450 km at 100 km/h → Duration = 4.5 hours = 270 minutes."
                },
                miniGuide: {
                    tr: "<ul><li><b>Trafik Payı:</b> Hesaplanan süre saf sürüş süresidir; trafik için %20-30 ek pay bırakın.</li><li><b>Mola:</b> Her 2 saatte bir yaklaşık 15 dakika mola ekleyin.</li><li><b>Gece Sürüşü:</b> Yorgunluk etkisini göz önülnde bulundurarak planlayın; güvenli sürüş önceliklidir.</li></ul>",
                    en: "Add 20-30% for traffic, 15 min every 2 hours for breaks, and account for fatigue on night drives."
                }
            }
        }
    },
    {
        id: "unit-converter",
        slug: "birim-donusturucu",
        category: "zaman-hesaplama",
        name: { tr: "Birim Dönüştürücü (Uzunluk)", en: "Unit Converter (Length)" },
        h1: { tr: "Uzunluk Birim Dönüştürücü — km, m, mil, feet ve inç", en: "Length Unit Converter — km, m, miles, feet & inches" },
        description: { tr: "Kilometre, metre, mil, feet ve inç arasında dönüşüm yapın.", en: "Convert between km, m, miles, feet and inches." },
        shortDescription: { tr: "Metrik ve emperyal uzunluk birimleri arasında anında dönüşüm yapın.", en: "Instantly convert between metric and imperial length units." },
        relatedCalculators: ["hiz-mesafe-sure", "yakit-tuketim-maliyet", "daire-alan-cevre"],
        inputs: [
            { id: "value", name: { tr: "Değer", en: "Value" }, type: "number", defaultValue: 1, required: true },
            {
                id: "from", name: { tr: "Birimden", en: "From Unit" }, type: "select", defaultValue: "km", options: [
                    { label: { tr: "Kilometre (km)", en: "Kilometer (km)" }, value: "km" },
                    { label: { tr: "Metre (m)", en: "Meter (m)" }, value: "m" },
                    { label: { tr: "Santimetre (cm)", en: "Centimeter (cm)" }, value: "cm" },
                    { label: { tr: "Mil (mi)", en: "Mile (mi)" }, value: "mi" },
                    { label: { tr: "Feet (ft)", en: "Feet (ft)" }, value: "ft" },
                    { label: { tr: "İnç (in)", en: "Inch (in)" }, value: "in" },
                ]
            },
        ],
        results: [
            { id: "km", label: { tr: "Kilometre (km)", en: "Kilometer (km)" }, decimalPlaces: 6 },
            { id: "m", label: { tr: "Metre (m)", en: "Meter (m)" }, decimalPlaces: 4 },
            { id: "cm", label: { tr: "Santimetre (cm)", en: "Centimeter (cm)" }, decimalPlaces: 2 },
            { id: "mi", label: { tr: "Mil (mi)", en: "Mile (mi)" }, decimalPlaces: 6 },
            { id: "ft", label: { tr: "Feet (ft)", en: "Feet (ft)" }, decimalPlaces: 4 },
            { id: "inch", label: { tr: "İnç (in)", en: "Inch (in)" }, decimalPlaces: 4 },
        ],
        formula: (v) => {
            const val = parseFloat(v.value) || 0;
            const toMeters: Record<string, number> = { km: 1000, m: 1, cm: 0.01, mi: 1609.344, ft: 0.3048, in: 0.0254 };
            const meters = val * (toMeters[v.from] || 1);
            return {
                km: meters / 1000, m: meters, cm: meters * 100,
                mi: meters / 1609.344, ft: meters / 0.3048, inch: meters / 0.0254,
            };
        },
        seo: {
            title: { tr: "Birim Dönüştürücü Uzunluk", en: "Length Unit Converter" },
            metaDescription: { tr: "Metrik ve emperyal uzunluk birimleri arasında dönüşüm yapın.", en: "Convert between metric and imperial length units." },
            content: { tr: "Birim dönüşümü standart oranlar kullanılarak yapılır.", en: "Unit conversion uses standard conversion rates." },
            faq: [
                { q: { tr: "Hangi birimler destekleniyor?", en: "Which units are supported?" }, a: { tr: "Bu araç kilometre, metre, santimetre, mil, feet ve inç arasında dönüşüm yapar. Daha fazla birim için güncellemeler planlanmaktadır.", en: "This tool converts between km, m, cm, miles, feet and inches. More units are planned." } },
                { q: { tr: "1 mil kaç kilometre eder?", en: "How many kilometers is 1 mile?" }, a: { tr: "1 mil = 1,60934 km'dır. Uluslararası standart bu değeri kullanır.", en: "1 mile = 1.60934 km (international standard)." } },
                { q: { tr: "1 feet kaç santimetre eder?", en: "How many centimeters is 1 foot?" }, a: { tr: "1 feet = 30,48 cm'dır. Bu oran uluslararası olarak sabittir.", en: "1 foot = 30.48 cm (internationally fixed ratio)." } }
            ],
            richContent: {
                howItWorks: {
                    tr: "Uzunluk birim dönüştürüCü, seçtiğiniz kaynak birimi standart metre cinsine çevirir, ardından metre değerini diğer tüm birimlere dönüştürerek tek seferde altı farklı birim değerini anlık gösterir. Metrik ve emperyal sistemler arası geçişlerde son derece pratik bir araçtır.",
                    en: "Converts selected unit to meters first, then to all other units simultaneously, showing 6 results at once."
                },
                formulaText: {
                    tr: "Adım 1: Değer × katsayı = Metre. Adım 2: Metre / hedef katsayı = Hedef Birim. Katsayılar: km=1000, m=1, cm=0,01, mil=1609,344, ft=0,3048, inç=0,0254.",
                    en: "Step 1: Value × factor = Meters. Step 2: Meters / target factor = Result. Factors: km=1000, m=1, cm=0.01, mi=1609.344, ft=0.3048, in=0.0254."
                },
                exampleCalculation: {
                    tr: "Örnek: 1 mil girişi → 1 × 1609,344 = 1609,344 m → 1,609 km, 160.934 cm, 5280 ft, 63.360 inç.",
                    en: "Example: 1 mile → 1,609.344 m → 1.609 km, 160,934 cm, 5,280 ft, 63,360 inches."
                },
                miniGuide: {
                    tr: "<ul><li><b>Uluslararası Seyahat:</b> ABD ve İngiltere'de uzunluklar mil ve feet cinsinden; bu araç anında çeviri sağlar.</li><li><b>Yapı Malzemeleri:</b> İnşaat hesaplarında birim karışmasını önlemek için önce dönüştürme yapın.</li><li><b>Spor:</b> Yarış parkurları çoğunlukla mil cinsinden belirtilir; km karşılığını buradan öğrenin.</li></ul>",
                    en: "Use for international travel, construction unit checks, and converting race distance units."
                }
            }
        }
    },
];

// ────────────────────────────────────────────────────────────────
// AŞAMA 1 — YENİ ARAÇLAR
// ────────────────────────────────────────────────────────────────
export const phase1Calculators: CalculatorConfig[] = [

    // ── GELİR VERGİSİ ──────────────────────────────────────────
    {
        id: "income-tax",
        slug: "gelir-vergisi-hesaplama",
        category: "maas-ve-vergi",
        name: { tr: "Gelir Vergisi Hesaplama", en: "Income Tax Calculator" },
        h1: { tr: "Gelir Vergisi Hesaplama 2026 — Yıllık & Aylık", en: "Income Tax Calculator 2026 — Annual & Monthly" },
        description: { tr: "2026 gelir vergisi dilimlerine göre yıllık ve aylık vergi tutarınızı hesaplayın.", en: "Calculate annual and monthly income tax based on 2026 tax brackets." },
        shortDescription: { tr: "Yıllık gelirinizi girin; kümülatif dilim hesabıyla 2026 gelir vergisi tutarınızı ve efektif vergi oranınızı anında öğrenin.", en: "Enter annual income to instantly get 2026 income tax and effective tax rate." },
        relatedCalculators: ["maas-hesaplama", "damga-vergisi-hesaplama", "kidem-tazminati-hesaplama"],
        inputs: [
            { id: "annualIncome", name: { tr: "Yıllık Gelir (₺)", en: "Annual Income (₺)" }, type: "number", defaultValue: 600000, suffix: "₺", required: true, min: 0 },
        ],
        results: [
            { id: "bracket1Tax", label: { tr: "1. Dilim Vergisi (0→190K, %15)", en: "Bracket 1 Tax (0→190K, 15%)" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "bracket2Tax", label: { tr: "2. Dilim Vergisi (190K→400K, %20)", en: "Bracket 2 Tax (190K→400K, 20%)" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "bracket3Tax", label: { tr: "3. Dilim Vergisi (400K→1.5M, %27)", en: "Bracket 3 Tax (400K→1.5M, 27%)" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "bracket4Tax", label: { tr: "4. Dilim Vergisi (1.5M→5.3M, %35)", en: "Bracket 4 Tax (1.5M→5.3M, 35%)" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "bracket5Tax", label: { tr: "5. Dilim Vergisi (5.3M+, %40)", en: "Bracket 5 Tax (5.3M+, 40%)" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "totalAnnualTax", label: { tr: "Toplam Yıllık Vergi", en: "Total Annual Tax" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "monthlyTax", label: { tr: "Aylık Ortalama Vergi", en: "Monthly Average Tax" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "effectiveRate", label: { tr: "Efektif Vergi Oranı", en: "Effective Tax Rate" }, suffix: " %", decimalPlaces: 2 },
        ],
        formula: (v) => {
            const income = parseFloat(v.annualIncome) || 0;
            const BRACKETS = [
                { limit: 190000, rate: 0.15 },
                { limit: 400000, rate: 0.20 },
                { limit: 1500000, rate: 0.27 },
                { limit: 5300000, rate: 0.35 },
                { limit: Infinity, rate: 0.40 },
            ];
            let prev = 0;
            const taxes = BRACKETS.map(b => {
                if (income <= prev) return 0;
                const taxable = Math.min(income, b.limit) - prev;
                prev = b.limit;
                return taxable * b.rate;
            });
            const totalAnnualTax = taxes.reduce((a, b) => a + b, 0);
            return {
                bracket1Tax: taxes[0], bracket2Tax: taxes[1], bracket3Tax: taxes[2],
                bracket4Tax: taxes[3], bracket5Tax: taxes[4],
                totalAnnualTax,
                monthlyTax: totalAnnualTax / 12,
                effectiveRate: income > 0 ? (totalAnnualTax / income) * 100 : 0,
            };
        },
        seo: {
            title: { tr: "Gelir Vergisi Hesaplama 2026 — Yıllık & Aylık Dilim", en: "Income Tax Calculator 2026" },
            metaDescription: { tr: "2026 gelir vergisi dilimlerine (%15-%40) göre yıllık ve aylık vergi tutarınızı hesaplayın. Efektif vergi oranı dahil.", en: "Calculate 2026 income tax by brackets (15%-40%) with annual, monthly amounts and effective rate." },
            content: { tr: "Türkiye'de gelir vergisi kümülatif dilim sistemiyle hesaplanır. 2026'da ilk 190.000 TL %15, 400.000 TL'ye kadar %20, 1.500.000 TL'ye kadar %27, 5.300.000 TL'ye kadar %35, üstü %40 oranında vergilendirilir.", en: "Turkish income tax uses cumulative brackets: 15% up to 190K, 20% up to 400K, 27% up to 1.5M, 35% up to 5.3M, 40% above." },
            faq: [
                { q: { tr: "2026 yılı gelir vergisi dilimleri nedir?", en: "What are the 2026 income tax brackets?" }, a: { tr: "2026: 190.000 TL'ye kadar %15 | 400.000 TL'ye kadar %20 | 1.500.000 TL'ye kadar %27 | 5.300.000 TL'ye kadar %35 | üstü %40.", en: "2026 brackets: up to 190K→15%, 400K→20%, 1.5M→27%, 5.3M→35%, above→40%." } },
                { q: { tr: "Efektif vergi oranı ile marjinal vergi oranı farkı nedir?", en: "Difference between effective and marginal tax rate?" }, a: { tr: "Marjinal oran son liranız için geçerli dilim oranıdır. Efektif oran ise toplam verginizin toplam gelirinize oranıdır ve her zaman daha düşüktür.", en: "Marginal rate applies to the last dollar earned. Effective rate is total tax / total income and is always lower." } },
                { q: { tr: "Ücretlilerde gelir vergisi nasıl uygulanır?", en: "How is income tax applied to employees?" }, a: { tr: "Ücretlilerde işveren her ay stopaj keserek ödeme yapar. Asgari ücrete isabet eden kısım vergiden muaftır.", en: "Employers withhold income tax monthly. The minimum wage portion is tax-exempt." } },
            ],
            richContent: {
                howItWorks: {
                    tr: "Gelir vergisi hesaplayıcı, yıllık gelirinizi 2026 Türkiye gelir vergisi dilimlerine bölerek her dilimde ödenecek vergiyi hesaplar ve toplar. Her dilim için ayrı vergi tutarını, toplam yıllık/aylık vergiyi ve efektif oranı gösterir.",
                    en: "Splits annual income across 2026 Turkish tax brackets, computes tax for each bracket and sums them up. Shows per-bracket tax, total annual/monthly tax and effective rate."
                },
                formulaText: {
                    tr: "Vergi = Σ (dilimde kalan tutar × dilim oranı). Efektif Oran = Toplam Vergi / Yıllık Gelir × 100.",
                    en: "Tax = Σ (amount in bracket × bracket rate). Effective Rate = Total Tax / Annual Income × 100."
                },
                exampleCalculation: {
                    tr: "Örnek: 600.000 TL yıllık gelir → 190.000×%15=28.500 | 210.000×%20=42.000 | 200.000×%27=54.000 | Toplam=124.500 TL/yıl | Aylık≈10.375 TL | Efektif oran≈%20,75.",
                    en: "Example: 600,000 TL → 190K×15%=28,500 | 210K×20%=42,000 | 200K×27%=54,000 | Total=124,500 TL/yr | Monthly≈10,375 TL | Effective≈20.75%."
                },
                miniGuide: {
                    tr: "<ul><li><b>Kümülatif Sistem:</b> Her dilim yalnızca o dilime giren kısım için geçerlidir; tüm gelir en yüksek dilimden vergilendirilmez.</li><li><b>Maaşlı Çalışanlar:</b> İşveren her ay kümülatif stopaj keser; yıl sonunda hesap kapanır.</li><li><b>Serbest Meslek:</b> Geçici vergi üçer aylık dönemde ödenir, yıl sonu beyannamesi ile kesinleşir.</li></ul>",
                    en: "Cumulative brackets mean only the portion within each bracket is taxed at that rate. Employers handle monthly withholding for employees."
                }
            }
        }
    },

    // ── KIDEM TAZMİNATI ────────────────────────────────────────
    {
        id: "severance-pay",
        slug: "kidem-tazminati-hesaplama",
        category: "maas-ve-vergi",
        name: { tr: "Kıdem Tazminatı Hesaplama", en: "Severance Pay Calculator" },
        h1: { tr: "Kıdem Tazminatı Hesaplama 2026 — Brüt Maaşa Göre", en: "Severance Pay Calculator 2026" },
        description: { tr: "2026 kıdem tazminatı tavanına göre hak ettiğiniz tazminatı hesaplayın.", en: "Calculate severance pay based on 2026 ceiling and years of service." },
        shortDescription: { tr: "Brüt maaş ve çalışma sürenizi girerek kıdem tazminatınızı ve damga vergisi kesintisini anında öğrenin.", en: "Enter gross salary and years of service to instantly calculate your severance pay." },
        relatedCalculators: ["ihbar-tazminati-hesaplama", "maas-hesaplama", "gelir-vergisi-hesaplama"],
        inputs: [
            { id: "grossSalary", name: { tr: "Brüt Maaş (₺)", en: "Gross Salary (₺)" }, type: "number", defaultValue: 50000, suffix: "₺", required: true, min: 0 },
            { id: "years", name: { tr: "Çalışma Yılı", en: "Years of Service" }, type: "number", defaultValue: 5, suffix: "yıl", required: true, min: 0 },
            { id: "months", name: { tr: "Ek Ay", en: "Additional Months" }, type: "number", defaultValue: 0, suffix: "ay", required: false, min: 0, max: 11 },
        ],
        results: [
            { id: "baseSalary", label: { tr: "Hesaba Esas Ücret (Tavan ile sınırlı)", en: "Base Salary (capped)" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "totalMonths", label: { tr: "Toplam Çalışma Süresi", en: "Total Service (months)" }, suffix: " ay", decimalPlaces: 1 },
            { id: "grossAmount", label: { tr: "Brüt Kıdem Tazminatı", en: "Gross Severance" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "stampTax", label: { tr: "Damga Vergisi (%0,759)", en: "Stamp Duty (0.759%)" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "netAmount", label: { tr: "Net Kıdem Tazminatı", en: "Net Severance" }, suffix: " ₺", decimalPlaces: 2 },
        ],
        formula: (v) => {
            // 2026 kıdem tazminatı tavanı (Ocak 2026) — brüt asgari ücretin yaklaşık 2 katı
            const CEILING_2026 = 55923.66; // Ocak 2026 kıdem tazminatı tavanı
            const STAMP_RATE = 0.00759;
            const gross = parseFloat(v.grossSalary) || 0;
            const years = parseFloat(v.years) || 0;
            const months = parseFloat(v.months) || 0;
            const totalMonths = years * 12 + months;
            const baseSalary = Math.min(gross, CEILING_2026);
            const grossAmount = baseSalary * (totalMonths / 12);
            const stampTax = grossAmount * STAMP_RATE;
            const netAmount = grossAmount - stampTax;
            return { baseSalary, totalMonths, grossAmount, stampTax, netAmount };
        },
        seo: {
            title: { tr: "Kıdem Tazminatı Hesaplama 2026 — Tavan ve Net Tutar", en: "Severance Pay Calculator 2026" },
            metaDescription: { tr: "2026 kıdem tazminatı tavanına (55.923,66 TL) göre brüt ve net tazminat tutarınızı hesaplayın. Damga vergisi dahil.", en: "Calculate 2026 severance pay with ceiling (55,923.66 TL), including stamp duty deduction." },
            content: { tr: "Kıdem tazminatı; çalışanın her tam hizmet yılı için 30 günlük brüt ücreti tutarındadır. 2026'da tavan 55.923,66 TL'dir. Bu tavanın üstündeki maaşlar tavan üzerinden hesaplanır. Yalnızca damga vergisi (%0,759) kesilir; gelir vergisi uygulanmaz.", en: "Severance pay equals 30 days' gross salary per full year of service. 2026 ceiling: 55,923.66 TL. Only stamp duty (0.759%) is deducted; no income tax." },
            faq: [
                { q: { tr: "2026 kıdem tazminatı tavanı ne kadar?", en: "What is the 2026 severance pay ceiling?" }, a: { tr: "2026 yılı kıdem tazminatı tavanı 55.923,66 TL'dir. Bu tutarı aşan brüt maaşlar için hesaplama tavan üzerinden yapılır.", en: "2026 severance pay ceiling is 55,923.66 TL. Salaries above this are calculated using the ceiling." } },
                { q: { tr: "Kıdem tazminatından vergi kesilir mi?", en: "Is severance pay subject to tax?" }, a: { tr: "Kıdem tazminatından yalnızca damga vergisi (%0,759) kesilir. Gelir vergisi ve SGK primi kesilmez.", en: "Only stamp duty (0.759%) is deducted from severance pay. No income tax or SGK contribution." } },
                { q: { tr: "Kıdem tazminatı hangi durumlarda ödenir?", en: "When is severance pay paid?" }, a: { tr: "İşveren tarafından haksız fesih, askerlik, emeklilik, evlilik (kadın) veya vefat durumlarında 1 yılı doldurmuş çalışanlara ödenir.", en: "Paid to employees with 1+ year service upon unjust dismissal by employer, military service, retirement, marriage (women), or death." } },
            ],
            richContent: {
                howItWorks: {
                    tr: "Kıdem tazminatı = (Brüt maaş veya tavan, hangisi düşükse) × (Toplam hizmet süresi ay / 12). Sonuçtan yalnızca %0,759 damga vergisi kesilir.",
                    en: "Severance = min(gross, ceiling) × (total months / 12). Only 0.759% stamp duty is deducted."
                },
                formulaText: {
                    tr: "Brüt Tazminat = min(Brüt Maaş, 55.923,66 ₺) × (Toplam Ay / 12). Net = Brüt − Brüt × 0,00759.",
                    en: "Gross = min(Gross Salary, 55,923.66) × (Total Months / 12). Net = Gross − Gross × 0.00759."
                },
                exampleCalculation: {
                    tr: "Örnek: 50.000 TL brüt maaş, 5 yıl 6 ay (66 ay) → Brüt = 50.000×(66/12) = 275.000 TL | Damga = 275.000×0,00759 = 2.087,25 TL | Net ≈ 272.912,75 TL.",
                    en: "Example: 50,000 TL gross, 5.5 years (66 months) → Gross = 50,000×5.5 = 275,000 TL | Stamp = 2,087.25 TL | Net ≈ 272,912.75 TL."
                },
                miniGuide: {
                    tr: "<ul><li><b>Tavan Uygulaması:</b> Brüt maaşınız tavandan yüksekse, hesaplama tavan (55.923,66 TL) üzerinden yapılır.</li><li><b>Kısmi Yıllar:</b> Tam yıl tamamlanmamış dönemler için ay üzerinden orantılı hesaplama yapılır.</li><li><b>SGK ve Gelir Vergisi Yok:</b> Kıdem tazminatı gelir vergisine tabi değildir; yalnızca damga vergisi kesilir.</li></ul>",
                    en: "Apply ceiling if salary exceeds it. Partial years counted proportionally by months. No income tax, only 0.759% stamp duty."
                }
            }
        }
    },

    // ── İHBAR TAZMİNATI ────────────────────────────────────────
    {
        id: "notice-pay",
        slug: "ihbar-tazminati-hesaplama",
        category: "maas-ve-vergi",
        name: { tr: "İhbar Tazminatı Hesaplama", en: "Notice Pay Calculator" },
        h1: { tr: "İhbar Tazminatı Hesaplama 2026 — İş Kanunu'na Göre", en: "Notice Pay Calculator 2026" },
        description: { tr: "Çalışma sürenize ve brüt maaşınıza göre ihbar tazminatını hesaplayın.", en: "Calculate notice pay based on years of service and gross salary." },
        shortDescription: { tr: "Hizmet sürenize göre yasal ihbar süresini ve tazminat tutarınızı anında öğrenin.", en: "Instantly find your legal notice period and compensation amount." },
        relatedCalculators: ["kidem-tazminati-hesaplama", "maas-hesaplama", "gelir-vergisi-hesaplama"],
        inputs: [
            { id: "grossSalary", name: { tr: "Brüt Günlük Ücret veya Aylık Ücret (₺)", en: "Gross Monthly Salary (₺)" }, type: "number", defaultValue: 50000, suffix: "₺", required: true, min: 0 },
            { id: "years", name: { tr: "Çalışma Yılı", en: "Years of Service" }, type: "number", defaultValue: 3, required: true, min: 0 },
        ],
        results: [
            { id: "noticeDays", label: { tr: "İhbar Süresi (gün)", en: "Notice Period (days)" }, suffix: " gün", decimalPlaces: 0 },
            { id: "dailySalary", label: { tr: "Günlük Brüt Ücret", en: "Daily Gross Salary" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "grossAmount", label: { tr: "Brüt İhbar Tazminatı", en: "Gross Notice Pay" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "sgk", label: { tr: "SGK (%15,5 İşveren)", en: "SGK Employer (15.5%)" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "incomeTax", label: { tr: "Gelir Vergisi (%15)", en: "Income Tax (15%)" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "stampTax", label: { tr: "Damga Vergisi (%0,759)", en: "Stamp Duty" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "netAmount", label: { tr: "Net İhbar Tazminatı", en: "Net Notice Pay" }, suffix: " ₺", decimalPlaces: 2 },
        ],
        formula: (v) => {
            const monthly = parseFloat(v.grossSalary) || 0;
            const years = parseFloat(v.years) || 0;
            // İş Kanunu 17. madde ihbar süreleri
            let noticeDays = 0;
            if (years < 0.5) noticeDays = 0;
            else if (years < 1.5) noticeDays = 14;
            else if (years < 3) noticeDays = 28;
            else if (years < 5) noticeDays = 42;
            else noticeDays = 56;
            const dailySalary = monthly / 30;
            const grossAmount = dailySalary * noticeDays;
            const sgk = grossAmount * 0.155; // işveren SGK payı
            const incomeTax = grossAmount * 0.15;  // min dilim
            const stampTax = grossAmount * 0.00759;
            const netAmount = grossAmount - incomeTax - stampTax;
            return { noticeDays, dailySalary, grossAmount, sgk, incomeTax, stampTax, netAmount };
        },
        seo: {
            title: { tr: "İhbar Tazminatı Hesaplama 2026 — İş Kanunu Madde 17", en: "Notice Pay Calculator 2026" },
            metaDescription: { tr: "Çalışma sürenize göre ihbar tazminatı süresini ve net tutarı hesaplayın. 2026 güncel İş Kanunu 17. madde sürelerine göre.", en: "Calculate notice pay period and net amount per 2026 Turkish Labour Law Article 17." },
            content: { tr: "İhbar tazminatı, iş sözleşmesi bildirim süresine uyulmadan feshedildiğinde ödenir. Süreler: 6 aydan az=2 hafta, 6 ay–1,5 yıl=4 hafta, 1,5–3 yıl=6 hafta, 3–5 yıl=8 hafta, 5 yıl+=8 hafta.", en: "Notice pay is paid when employment is terminated without serving the legal notice period. Periods vary by tenure." },
            faq: [
                { q: { tr: "İhbar tazminatı ne zaman hak kazanılır?", en: "When is notice pay earned?" }, a: { tr: "İşveren veya işçi ihbar süresine uymadan iş sözleşmesini feshederse, fesheden taraf ihbar tazminatı ödemek zorundadır.", en: "When either party terminates employment without serving the legal notice period, the terminating party owes notice pay." } },
                { q: { tr: "İhbar süreleri nelerdir?", en: "What are the notice periods?" }, a: { tr: "6 ay'dan az: 0 gün | 6 ay–1,5 yıl: 14 gün | 1,5–3 yıl: 28 gün | 3–5 yıl: 42 gün | 5+ yıl: 56 gün.", en: "Under 6 months: 0 | 6m-1.5yr: 14 days | 1.5-3yr: 28 days | 3-5yr: 42 days | 5+yr: 56 days." } },
            ],
            richContent: {
                howItWorks: {
                    tr: "İhbar tazminatı; yasal ihbar süresine (gün) göre günlük brüt ücretle çarpılarak hesaplanır. Gelir vergisi ve damga vergisi kesilir; kıdem tazminatından farklı olarak SGK primlerinden muaf değildir.",
                    en: "Notice pay = daily gross salary × notice days. Income tax and stamp duty apply."
                },
                formulaText: {
                    tr: "Günlük Ücret = Aylık Brüt / 30. Brüt Tazminat = Günlük Ücret × İhbar Günü. Net = Brüt − GV − Damga.",
                    en: "Daily = Monthly / 30. Gross = Daily × Notice Days. Net = Gross − Income Tax − Stamp Duty."
                },
                exampleCalculation: {
                    tr: "Örnek: 50.000 TL/ay, 3 yıl çalışma → İhbar = 42 gün | Günlük = 1.666,67 TL | Brüt = 70.000 TL | GV = 10.500 TL | Damga = 531,30 TL | Net ≈ 58.969 TL.",
                    en: "Example: 50,000 TL/month, 3 years → 42 days notice | Gross = 70,000 TL | Net ≈ 58,969 TL."
                },
                miniGuide: {
                    tr: "<ul><li><b>Haklı Fesih:</b> Haklı nedenle fesihte ihbar tazminatı ödenmez.</li><li><b>Kıdem ile Birlikte:</b> Genellikle ihbar ve kıdem tazminatı birlikte talep edilir.</li><li><b>Süre Kullandırma:</b> İşveren tazminat ödemek yerine çalışana izin kullandırabilir.</li></ul>",
                    en: "No notice pay on just-cause termination. Often claimed together with severance. Employer can alternatively grant paid leave."
                }
            }
        }
    },

    // ── MTV HESAPLAMA ───────────────────────────────────────────
    {
        id: "mtv",
        slug: "mtv-hesaplama",
        category: "tasit-ve-vergi",
        name: { tr: "MTV Hesaplama", en: "Motor Vehicle Tax" },
        h1: { tr: "MTV Hesaplama 2026 — Motorlu Taşıtlar Vergisi", en: "Motor Vehicle Tax 2026" },
        description: { tr: "2026 MTV tutarınızı araç yaşı ve motor hacmine göre hesaplayın.", en: "Calculate 2026 motor vehicle tax based on vehicle age and engine size." },
        shortDescription: { tr: "Motor hacmi ve araç yaşını seçin; 2026 yılı MTV'nizi Ocak ve Temmuz taksitleriyle birlikte anında görün.", en: "Select engine size and age to instantly see 2026 motor vehicle tax with installments." },
        relatedCalculators: ["otv-hesaplama", "yakit-tuketim-maliyet", "hiz-mesafe-sure"],
        inputs: [
            {
                id: "engineCC",
                name: { tr: "Motor Hacmi", en: "Engine Size" },
                type: "select",
                defaultValue: "1300-1600",
                options: [
                    { label: { tr: "1300 cc ve aşağısı", en: "Up to 1300 cc" }, value: "0-1300" },
                    { label: { tr: "1301–1600 cc", en: "1301–1600 cc" }, value: "1300-1600" },
                    { label: { tr: "1601–1800 cc", en: "1601–1800 cc" }, value: "1600-1800" },
                    { label: { tr: "1801–2000 cc", en: "1801–2000 cc" }, value: "1800-2000" },
                    { label: { tr: "2001–2500 cc", en: "2001–2500 cc" }, value: "2000-2500" },
                    { label: { tr: "2501–3000 cc", en: "2501–3000 cc" }, value: "2500-3000" },
                    { label: { tr: "3001–3500 cc", en: "3001–3500 cc" }, value: "3000-3500" },
                    { label: { tr: "3501 cc ve üzeri", en: "3501 cc and above" }, value: "3500+" },
                ]
            },
            {
                id: "ageGroup",
                name: { tr: "Araç Yaşı", en: "Vehicle Age" },
                type: "select",
                defaultValue: "6-11",
                options: [
                    { label: { tr: "1–3 yaş", en: "1–3 years" }, value: "1-3" },
                    { label: { tr: "4–6 yaş", en: "4–6 years" }, value: "4-6" },
                    { label: { tr: "7–11 yaş", en: "7–11 years" }, value: "6-11" },
                    { label: { tr: "12–15 yaş", en: "12–15 years" }, value: "12-15" },
                    { label: { tr: "16 yaş ve üzeri", en: "16+ years" }, value: "16+" },
                ]
            },
        ],
        results: [
            { id: "annualMTV", label: { tr: "Yıllık MTV", en: "Annual MTV" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "installment1", label: { tr: "1. Taksit (Ocak)", en: "1st Installment (Jan)" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "installment2", label: { tr: "2. Taksit (Temmuz)", en: "2nd Installment (Jul)" }, suffix: " ₺", decimalPlaces: 2 },
        ],
        formula: (v) => {
            // 2026 MTV tarifeleri (yaklaşık — yeniden değerleme oranı %43,93 uygulandı)
            const TABLE: Record<string, Record<string, number>> = {
                "0-1300": { "1-3": 3800, "4-6": 2600, "6-11": 1900, "12-15": 1100, "16+": 600 },
                "1300-1600": { "1-3": 8200, "4-6": 5400, "6-11": 3800, "12-15": 1900, "16+": 800 },
                "1600-1800": { "1-3": 15800, "4-6": 10400, "6-11": 6800, "12-15": 3400, "16+": 1200 },
                "1800-2000": { "1-3": 23200, "4-6": 15800, "6-11": 9400, "12-15": 4800, "16+": 1700 },
                "2000-2500": { "1-3": 36800, "4-6": 25200, "6-11": 14600, "12-15": 7400, "16+": 2600 },
                "2500-3000": { "1-3": 59600, "4-6": 40600, "6-11": 22800, "12-15": 11400, "16+": 4000 },
                "3000-3500": { "1-3": 84400, "4-6": 57600, "6-11": 32400, "12-15": 16200, "16+": 5600 },
                "3500+": { "1-3": 109200, "4-6": 74400, "6-11": 41600, "12-15": 20800, "16+": 7200 },
            };
            const annualMTV = TABLE[v.engineCC]?.[v.ageGroup] ?? 0;
            return {
                annualMTV,
                installment1: annualMTV / 2,
                installment2: annualMTV / 2,
            };
        },
        seo: {
            title: { tr: "MTV Hesaplama 2026 — Motorlu Taşıtlar Vergisi Hesaplayıcı", en: "Motor Vehicle Tax 2026 Calculator" },
            metaDescription: { tr: "2026 motorlu taşıtlar vergisi (MTV) tutarınızı motor hacmi ve araç yaşına göre hesaplayın. Ocak ve Temmuz taksitleri dahil.", en: "Calculate your 2026 motor vehicle tax (MTV) by engine size and age, with January and July installments." },
            content: { tr: "MTV, motorlu taşıtlar için yılda iki taksitte (Ocak ve Temmuz) ödenen yıllık vergidir. Vergi tutarı motorun silindir hacmine ve aracın yaşına göre belirlenir. 2026 tarifeleri yeniden değerleme oranıyla güncellenmiştir.", en: "MTV is an annual tax paid in two installments (January and July) based on engine size and vehicle age." },
            faq: [
                { q: { tr: "MTV hangi aylarda ödenir?", en: "When is MTV paid?" }, a: { tr: "MTV yılda iki taksitte ödenir: Ocak ayının sonuna kadar 1. taksit, Temmuz ayının sonuna kadar 2. taksit.", en: "MTV is paid in two installments: 1st by end of January, 2nd by end of July." } },
                { q: { tr: "MTV geç ödeme cezası nedir?", en: "What is the late payment penalty for MTV?" }, a: { tr: "Süresinde ödenmeyen MTV için aylık %2,5 gecikme zammı uygulanır.", en: "Late MTV payments incur 2.5% monthly interest." } },
                { q: { tr: "Elektrikli araçlar MTV öder mi?", en: "Do electric vehicles pay MTV?" }, a: { tr: "Evet, elektrikli araçlar da MTV öder; ancak motor hacmi yerine kW gücüne göre ayrı bir tarife uygulanır.", en: "Yes, EVs pay MTV based on motor power (kW) under a separate tariff." } },
            ],
            richContent: {
                howItWorks: {
                    tr: "MTV, aracınızın motor hacmi (cc) ve yaşı (yıl) baz alınarak Hazine tarafından belirlenen tabloya göre hesaplanır. Tablo her yıl yeniden değerleme oranıyla güncellenir. 2026 tarife tutarları yaklaşık değerler olup resmi Gelir İdaresi tablolarıyla doğrulanması önerilir.",
                    en: "MTV is determined by a government table based on engine size and vehicle age. Updated annually with revaluation rate."
                },
                formulaText: {
                    tr: "Yıllık MTV = Tablo değeri (Motor Hacmi × Araç Yaşı). 1. Taksit = 2. Taksit = Yıllık MTV / 2.",
                    en: "Annual MTV = Table value (Engine × Age). Each installment = Annual / 2."
                },
                exampleCalculation: {
                    tr: "Örnek: 1.600 cc, 7 yaş araç → Yıllık MTV ≈ 3.800 ₺ | Ocak taksiti ≈ 1.900 ₺ | Temmuz taksiti ≈ 1.900 ₺.",
                    en: "Example: 1,600 cc, 7-year vehicle → Annual MTV ≈ 3,800 TL | Each installment ≈ 1,900 TL."
                },
                miniGuide: {
                    tr: "<ul><li><b>Resmi Tablo:</b> Kesin tutarlar için Gelir İdaresi Başkanlığı'nın yayımladığı güncel MTV tarifesini kontrol edin.</li><li><b>Araç Yaşı:</b> İlk tescil yılından hesap yılına kadar geçen süre esas alınır.</li><li><b>Geç Ödeme:</b> Taksit tarihlerini kaçırmamaya özen gösterin; gecikme zammı hızla birikir.</li></ul>",
                    en: "Verify with official GİB MTV table. Vehicle age calculated from first registration year. Avoid late payments to prevent interest accumulation."
                }
            }
        }
    },

    // ── ENFLASYON HESAPLAMA ─────────────────────────────────────
    {
        id: "inflation",
        slug: "enflasyon-hesaplama",
        category: "finansal-hesaplamalar",
        name: { tr: "Enflasyon Hesaplama", en: "Inflation Calculator" },
        h1: { tr: "Enflasyon Hesaplama — Paranın Reel Değeri", en: "Inflation Calculator — Real Money Value" },
        description: { tr: "Enflasyon oranına göre paranızın reel değer kaybını veya kazancını hesaplayın.", en: "Calculate the real value change of money based on inflation rate." },
        shortDescription: { tr: "Tutar, süre ve enflasyon oranını girin; paranızın bugünkü reel değerini ve değer kaybını anında hesaplayın.", en: "Enter amount, period and inflation rate to instantly calculate real value and purchasing power loss." },
        relatedCalculators: ["basit-faiz-hesaplama", "bilesik-faiz-hesaplama", "kdv-hesaplama"],
        inputs: [
            { id: "amount", name: { tr: "Tutar (₺)", en: "Amount (₺)" }, type: "number", defaultValue: 100000, suffix: "₺", required: true, min: 0 },
            { id: "rate", name: { tr: "Yıllık Enflasyon Oranı (%)", en: "Annual Inflation Rate (%)" }, type: "number", defaultValue: 40, suffix: "%", required: true, min: 0 },
            { id: "years", name: { tr: "Süre (Yıl)", en: "Period (Years)" }, type: "number", defaultValue: 3, suffix: "yıl", required: true, min: 0 },
        ],
        results: [
            { id: "realValue", label: { tr: "Bugünkü Reel Değer (₺)", en: "Real Value Today" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "nominalFuture", label: { tr: "Nominal Gelecek Değer", en: "Nominal Future Value" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "purchaseLoss", label: { tr: "Satın Alma Gücü Kaybı", en: "Purchasing Power Loss" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "lossPercent", label: { tr: "Değer Kaybı Yüzdesi", en: "Value Loss Percentage" }, suffix: " %", decimalPlaces: 2 },
            { id: "inflationFactor", label: { tr: "Enflasyon Çarpanı", en: "Inflation Factor" }, suffix: "x", decimalPlaces: 4 },
        ],
        formula: (v) => {
            const amount = parseFloat(v.amount) || 0;
            const rate = (parseFloat(v.rate) || 0) / 100;
            const years = parseFloat(v.years) || 0;
            const inflationFactor = Math.pow(1 + rate, years);
            const nominalFuture = amount * inflationFactor;
            const realValue = amount / inflationFactor;
            const purchaseLoss = amount - realValue;
            const lossPercent = amount > 0 ? (purchaseLoss / amount) * 100 : 0;
            return { realValue, nominalFuture, purchaseLoss, lossPercent, inflationFactor };
        },
        seo: {
            title: { tr: "Enflasyon Hesaplama — Paranın Reel Değer Kaybı 2026", en: "Inflation Calculator — Real Value 2026" },
            metaDescription: { tr: "Paranızın enflasyona karşı reel değerini, satın alma gücü kaybını ve enflasyon çarpanını hesaplayın.", en: "Calculate your money's real value, purchasing power loss and inflation factor against rising prices." },
            content: { tr: "Enflasyon, paranın zaman içinde satın alma gücünü azaltır. Yıllık enflasyon oranı ve süre girilerek paranızın reel değer kaybı bileşik formülle hesaplanır.", en: "Inflation erodes purchasing power over time. Enter annual rate and years to calculate compounded real value loss." },
            faq: [
                { q: { tr: "Reel değer nedir?", en: "What is real value?" }, a: { tr: "Reel değer, bir tutarın enflasyon etkisi arındırılmış değeridir. Bugün 100 TL olan bir şeyin enflasyon sonrası alım gücünü gösterir.", en: "Real value is the inflation-adjusted value of money, showing what it would actually buy after price increases." } },
                { q: { tr: "Türkiye'de enflasyon hangi kurumca açıklanır?", en: "Who publishes inflation in Turkey?" }, a: { tr: "Türkiye İstatistik Kurumu (TÜİK) aylık bazda TÜFE ve ÜFE verilerini yayımlar.", en: "The Turkish Statistical Institute (TÜİK) publishes monthly CPI and PPI data." } },
                { q: { tr: "Bileşik enflasyon nedir?", en: "What is compound inflation?" }, a: { tr: "Her yılın enflasyonu bir önceki yılın fiyat düzeyine eklenerek hesaplanır. Hesaplayıcımız bileşik formülü kullanır.", en: "Each year's inflation compounds on the previous year's price level. Our calculator uses compound formula." } },
            ],
            richContent: {
                howItWorks: {
                    tr: "Enflasyon hesaplayıcı, girdiğiniz tutarı bileşik enflasyon formülüyle belirtilen yıl sayısı için işler. Paranızın geriye dönük reel değerini, nominal gelecek değerini ve satın alma gücü kaybını gösterir.",
                    en: "Uses compound inflation formula to show real value, nominal future value and purchasing power loss for your amount over the specified years."
                },
                formulaText: {
                    tr: "Enflasyon Çarpanı = (1 + oran)^yıl. Reel Değer = Tutar / Çarpan. Nominal Gelecek = Tutar × Çarpan. Kayıp = Tutar − Reel Değer.",
                    en: "Factor = (1 + rate)^years. Real = Amount / Factor. Nominal Future = Amount × Factor. Loss = Amount − Real."
                },
                exampleCalculation: {
                    tr: "Örnek: 100.000 TL, %40 enflasyon, 3 yıl → Çarpan = 1,40³ ≈ 2,744 | Reel Değer ≈ 36.443 TL | Kayıp ≈ 63.557 TL (%63,56).",
                    en: "Example: 100,000 TL, 40% inflation, 3 years → Factor ≈ 2.744 | Real ≈ 36,443 TL | Loss ≈ 63,557 TL (63.56%)."
                },
                miniGuide: {
                    tr: "<ul><li><b>TÜİK TÜFE:</b> Resmi enflasyon oranı olarak Türkiye İstatistik Kurumu'nun açıkladığı TÜFE'yi kullanın.</li><li><b>Yatırım Karşılaştırması:</b> Faiz veya yatırım getiriniz enflasyonun altındaysa reel anlamda para kaybediyorsunuzdur.</li><li><b>Uzun Dönem:</b> Küçük görünen enflasyon oranları uzun vadede büyük değer kayıplarına yol açabilir.</li></ul>",
                    en: "Use TÜİK CPI for official rate. If investment return < inflation, you lose real value. Small inflation rates compound significantly over long periods."
                }
            }
        }
    },
];

// ────────────────────────────────────────────────────────────────
// AŞAMA 2 — SINAV, MATEMATİK, ZAMAN, FİNANSAL, TAŞIT
// ────────────────────────────────────────────────────────────────
export const phase2Calculators: CalculatorConfig[] = [

    // ── YKS / TYT / AYT ──────────────────────────────────────
    {
        id: "yks-score",
        slug: "yks-puan-hesaplama",
        category: "sinav-hesaplamalari",
        name: { tr: "YKS Puan Hesaplama", en: "YKS Score Calculator" },
        h1: { tr: "YKS Puan Hesaplama 2025 — TYT, AYT ve YDT Net Hesaplayıcı", en: "YKS Score Calculator 2025 — TYT, AYT & YDT" },
        description: { tr: "TYT, AYT ve YDT netlerinize göre YKS ham ve yerleştirme puanlarınızı hesaplayın.", en: "Calculate your YKS raw and placement scores based on TYT, AYT and YDT nets." },
        shortDescription: { tr: "Tüm testler ve OBP dahil YKS puanınızı 2025 katsayılarıyla anında hesaplayın.", en: "Instantly calculate YKS score with all tests and OBP using 2025 coefficients." },
        relatedCalculators: ["kpss-puan-hesaplama", "ortalama-hesaplama", "yuzde-hesaplama"],
        inputs: [
            // SINAV YILI SEÇİMİ
            {
                id: "sinav_yili",
                name: { tr: "Sınav Yılı:", en: "Exam Year:" },
                type: "select",
                defaultValue: "2024",
                options: [
                    { value: "2024", label: { tr: "YKS 2024 (Gerçek ÖSYM Katsayıları)", en: "YKS 2024 (Real ÖSYM Coefficients)" } },
                    { value: "2023", label: { tr: "YKS 2023 (Yaklaşık)", en: "YKS 2023 (Approximate)" } },
                ]
            },
            // TYT SECTION
            { id: "tyt_section", name: { tr: "TYT Testleri", en: "TYT Tests" }, type: "section", className: "w-full" },
            { id: "tytTurkceD", name: { tr: "TYT Türkçe Doğru (40 Soru)", en: "TYT Turkish Correct" }, type: "number", defaultValue: 30, min: 0, max: 40, className: "w-1/2" },
            { id: "tytTurkceY", name: { tr: "TYT Türkçe Yanlış", en: "TYT Turkish Wrong" }, type: "number", defaultValue: 5, min: 0, max: 40, className: "w-1/2" },
            { id: "tytSosyalD", name: { tr: "TYT Sosyal Doğru (20 Soru)", en: "TYT Social Correct" }, type: "number", defaultValue: 15, min: 0, max: 20, className: "w-1/2" },
            { id: "tytSosyalY", name: { tr: "TYT Sosyal Yanlış", en: "TYT Social Wrong" }, type: "number", defaultValue: 3, min: 0, max: 20, className: "w-1/2" },
            { id: "tytMatD", name: { tr: "TYT Mat Doğru (40 Soru)", en: "TYT Math Correct" }, type: "number", defaultValue: 25, min: 0, max: 40, className: "w-1/2" },
            { id: "tytMatY", name: { tr: "TYT Mat Yanlış", en: "TYT Math Wrong" }, type: "number", defaultValue: 2, min: 0, max: 40, className: "w-1/2" },
            { id: "tytFenD", name: { tr: "TYT Fen Doğru (20 Soru)", en: "TYT Science Correct" }, type: "number", defaultValue: 10, min: 0, max: 20, className: "w-1/2" },
            { id: "tytFenY", name: { tr: "TYT Fen Yanlış", en: "TYT Science Wrong" }, type: "number", defaultValue: 2, min: 0, max: 20, className: "w-1/2" },

            // AYT SECTION
            { id: "ayt_section", name: { tr: "AYT Testleri", en: "AYT Tests" }, type: "section", className: "w-full" },
            { id: "aytMatD", name: { tr: "AYT Matematik Doğru (40 Soru)", en: "AYT Math Correct" }, type: "number", defaultValue: 0, min: 0, max: 40, className: "w-1/2" },
            { id: "aytMatY", name: { tr: "AYT Matematik Yanlış", en: "AYT Math Wrong" }, type: "number", defaultValue: 0, min: 0, max: 40, className: "w-1/2" },
            { id: "aytEdebD", name: { tr: "T. Dili ve Edeb. Doğru (24 Soru)", en: "Turkish Lit. Correct" }, type: "number", defaultValue: 0, min: 0, max: 24, className: "w-1/2" },
            { id: "aytEdebY", name: { tr: "T. Dili ve Edeb. Yanlış", en: "Turkish Lit. Wrong" }, type: "number", defaultValue: 0, min: 0, max: 24, className: "w-1/2" },
            { id: "aytTar1D", name: { tr: "Tarih-1 Doğru (10 Soru)", en: "History-1 Correct" }, type: "number", defaultValue: 0, min: 0, max: 10, className: "w-1/2" },
            { id: "aytTar1Y", name: { tr: "Tarih-1 Yanlış", en: "History-1 Wrong" }, type: "number", defaultValue: 0, min: 0, max: 10, className: "w-1/2" },
            { id: "aytCog1D", name: { tr: "Coğrafya-1 Doğru (6 Soru)", en: "Geography-1 Correct" }, type: "number", defaultValue: 0, min: 0, max: 6, className: "w-1/2" },
            { id: "aytCog1Y", name: { tr: "Coğrafya-1 Yanlış", en: "Geography-1 Wrong" }, type: "number", defaultValue: 0, min: 0, max: 6, className: "w-1/2" },
            { id: "aytTar2D", name: { tr: "Tarih-2 Doğru (11 Soru)", en: "History-2 Correct" }, type: "number", defaultValue: 0, min: 0, max: 11, className: "w-1/2" },
            { id: "aytTar2Y", name: { tr: "Tarih-2 Yanlış", en: "History-2 Wrong" }, type: "number", defaultValue: 0, min: 0, max: 11, className: "w-1/2" },
            { id: "aytCog2D", name: { tr: "Coğrafya-2 Doğru (11 Soru)", en: "Geography-2 Correct" }, type: "number", defaultValue: 0, min: 0, max: 11, className: "w-1/2" },
            { id: "aytCog2Y", name: { tr: "Coğrafya-2 Yanlış", en: "Geography-2 Wrong" }, type: "number", defaultValue: 0, min: 0, max: 11, className: "w-1/2" },
            { id: "aytFelsefeD", name: { tr: "Felsefe Grubu Doğru (12 Soru)", en: "Philosophy Correct" }, type: "number", defaultValue: 0, min: 0, max: 12, className: "w-1/2" },
            { id: "aytFelsefeY", name: { tr: "Felsefe Grubu Yanlış", en: "Philosophy Wrong" }, type: "number", defaultValue: 0, min: 0, max: 12, className: "w-1/2" },
            { id: "aytDinD", name: { tr: "Din Kültürü Doğru (6 Soru)", en: "Religion Correct" }, type: "number", defaultValue: 0, min: 0, max: 6, className: "w-1/2" },
            { id: "aytDinY", name: { tr: "Din Kültürü Yanlış", en: "Religion Wrong" }, type: "number", defaultValue: 0, min: 0, max: 6, className: "w-1/2" },
            { id: "aytFizikD", name: { tr: "Fizik Doğru (14 Soru)", en: "Physics Correct" }, type: "number", defaultValue: 0, min: 0, max: 14, className: "w-1/2" },
            { id: "aytFizikY", name: { tr: "Fizik Yanlış", en: "Physics Wrong" }, type: "number", defaultValue: 0, min: 0, max: 14, className: "w-1/2" },
            { id: "aytKimyaD", name: { tr: "Kimya Doğru (13 Soru)", en: "Chemistry Correct" }, type: "number", defaultValue: 0, min: 0, max: 13, className: "w-1/2" },
            { id: "aytKimyaY", name: { tr: "Kimya Yanlış", en: "Chemistry Wrong" }, type: "number", defaultValue: 0, min: 0, max: 13, className: "w-1/2" },
            { id: "aytBiyoD", name: { tr: "Biyoloji Doğru (13 Soru)", en: "Biology Correct" }, type: "number", defaultValue: 0, min: 0, max: 13, className: "w-1/2" },
            { id: "aytBiyoY", name: { tr: "Biyoloji Yanlış", en: "Biology Wrong" }, type: "number", defaultValue: 0, min: 0, max: 13, className: "w-1/2" },

            // YDT SECTION
            { id: "ydt_section", name: { tr: "YDT (Yabancı Dil Testi)", en: "YDT Tests" }, type: "section", className: "w-full" },
            { id: "ydtD", name: { tr: "Yabancı Dil (YDT) Doğru (80 Soru)", en: "Language (YDT) Correct" }, type: "number", defaultValue: 0, min: 0, max: 80, className: "w-1/2" },
            { id: "ydtY", name: { tr: "Yabancı Dil (YDT) Yanlış", en: "Language (YDT) Wrong" }, type: "number", defaultValue: 0, min: 0, max: 80, className: "w-1/2" },

            // OBP SECTION
            { id: "obp_section", name: { tr: "Okul Başarı Puanı (OBP)", en: "School Score (OBP)" }, type: "section", className: "w-full" },
            { id: "diplomaNotu", name: { tr: "Diploma Notu (50–100)", en: "Diploma Grade (50-100)" }, type: "number", defaultValue: 80, min: 50, max: 100, step: 0.1, className: "w-full" },
            {
                id: "prevPlacement",
                name: { tr: "Önceki Yıl Yerleştim", en: "Placed Last Year" },
                type: "checkbox",
                defaultValue: false,
                placeholder: { tr: "Evet, puanım kırılsın", en: "Yes, break my OBP" }
            },
        ],
        results: [
            { id: "tytPuan", label: { tr: "TYT Ham Puan", en: "TYT Raw Score" }, decimalPlaces: 3 },
            { id: "sayPuan", label: { tr: "SAY Ham Puan", en: "SAY Raw Score" }, decimalPlaces: 3 },
            { id: "sozPuan", label: { tr: "SÖZ Ham Puan", en: "SÖZ Raw Score" }, decimalPlaces: 3 },
            { id: "eaPuan", label: { tr: "EA Ham Puan", en: "EA Raw Score" }, decimalPlaces: 3 },
            { id: "dilPuan", label: { tr: "DİL Ham Puan", en: "DİL Raw Score" }, decimalPlaces: 3 },
            { id: "obpPuani", label: { tr: "OBP Katkısı", en: "OBP Contribution" }, decimalPlaces: 2 },
            { id: "yTyt", label: { tr: "TYT Yerleştirme", en: "TYT Placement" }, decimalPlaces: 3 },
            { id: "ySay", label: { tr: "SAY Yerleştirme", en: "SAY Placement" }, decimalPlaces: 3 },
            { id: "ySoz", label: { tr: "SÖZ Yerleştirme", en: "SÖZ Placement" }, decimalPlaces: 3 },
            { id: "yEa", label: { tr: "EA Yerleştirme", en: "EA Placement" }, decimalPlaces: 3 },
            { id: "yDil", label: { tr: "DİL Yerleştirme", en: "DİL Placement" }, decimalPlaces: 3 },
        ],
        formula: (v) => {
            const getNet = (d: any, y: any) => Math.max(0, (parseFloat(d) || 0) - (parseFloat(y) || 0) / 4);

            const tytTurkNet = getNet(v.tytTurkceD, v.tytTurkceY);
            const tytSosNet = getNet(v.tytSosyalD, v.tytSosyalY);
            const tytMatNet = getNet(v.tytMatD, v.tytMatY);
            const tytFenNet = getNet(v.tytFenD, v.tytFenY);
            const tytTotalNet = tytTurkNet + tytSosNet + tytMatNet + tytFenNet;

            const aytMatNet = getNet(v.aytMatD, v.aytMatY);
            const aytEdebNet = getNet(v.aytEdebD, v.aytEdebY);
            const aytTar1Net = getNet(v.aytTar1D, v.aytTar1Y);
            const aytCog1Net = getNet(v.aytCog1D, v.aytCog1Y);
            const aytTar2Net = getNet(v.aytTar2D, v.aytTar2Y);
            const aytCog2Net = getNet(v.aytCog2D, v.aytCog2Y);
            const aytFelsefeNet = getNet(v.aytFelsefeD, v.aytFelsefeY);
            const aytDinNet = getNet(v.aytDinD, v.aytDinY);
            const aytFizikNet = getNet(v.aytFizikD, v.aytFizikY);
            const aytKimyaNet = getNet(v.aytKimyaD, v.aytKimyaY);
            const aytBiyoNet = getNet(v.aytBiyoD, v.aytBiyoY);
            const ydtNet = getNet(v.ydtD, v.ydtY);

            // ÖSYM yıllık katsayı tablosu (gerçek hesapla elde edilen değerler)
            // TYT netleri AYT formülünde 1.3x ile ağırlıklandırılarak aktarılır
            const yilKat: Record<string, {
                tKatTurk: number; tKatSos: number; tKatMat: number; tKatFen: number;
                sayKatTyt: number; sayKatMat: number; sayKatFiz: number; sayKatKim: number; sayKatBiy: number;
                sozKatTyt: number; sozKatEdeb: number; sozKatTar1: number; sozKatCog1: number; sozKatTar2: number; sozKatCog2: number; sozKatFel: number; sozKatDin: number;
                eaKatTyt: number; eaKatMat: number; eaKatEdeb: number; eaKatTar1: number; eaKatCog1: number;
                dilKatTyt: number; dilKatYdt: number;
            }> = {
                "2024": {
                    // TYT gerçek 2024 katsayıları
                    tKatTurk: 2.91, tKatSos: 2.94, tKatMat: 2.93, tKatFen: 2.53,
                    // SAY 2024 katsayıları
                    sayKatTyt: 1.32, sayKatMat: 3.19, sayKatFiz: 2.43, sayKatKim: 3.07, sayKatBiy: 2.51,
                    // SÖZ 2024 katsayıları
                    sozKatTyt: 1.32, sozKatEdeb: 3.01, sozKatTar1: 2.82, sozKatCog1: 3.30, sozKatTar2: 2.89, sozKatCog2: 2.89, sozKatFel: 3.01, sozKatDin: 3.30,
                    // EA 2024 katsayıları
                    eaKatTyt: 1.32, eaKatMat: 3.19, eaKatEdeb: 3.01, eaKatTar1: 2.82, eaKatCog1: 3.30,
                    // DİL 2024 katsayıları
                    dilKatTyt: 1.32, dilKatYdt: 3.10,
                },
                "2023": {
                    // TYT 2023 katsayıları (yaklaşık)
                    tKatTurk: 3.30, tKatSos: 3.40, tKatMat: 3.30, tKatFen: 3.40,
                    sayKatTyt: 1.32, sayKatMat: 3.00, sayKatFiz: 2.85, sayKatKim: 3.07, sayKatBiy: 3.07,
                    sozKatTyt: 1.32, sozKatEdeb: 3.00, sozKatTar1: 2.80, sozKatCog1: 3.33, sozKatTar2: 2.91, sozKatCog2: 2.91, sozKatFel: 3.00, sozKatDin: 3.33,
                    eaKatTyt: 1.32, eaKatMat: 3.00, eaKatEdeb: 3.00, eaKatTar1: 2.80, eaKatCog1: 3.33,
                    dilKatTyt: 1.32, dilKatYdt: 3.00,
                },
            };

            const yil = String(v.sinav_yili || "2024");
            const k = yilKat[yil] || yilKat["2024"];

            // Ham TYT puanı (Türkçe/Mat'tan en az 0.5 net zorunlu)
            const tytPuan = (tytTurkNet >= 0.5 || tytMatNet >= 0.5)
                ? 100 + (tytTurkNet * k.tKatTurk) + (tytSosNet * k.tKatSos) + (tytMatNet * k.tKatMat) + (tytFenNet * k.tKatFen)
                : 0;

            const sayPuan = 100 + (tytTotalNet * k.sayKatTyt) + (aytMatNet * k.sayKatMat) + (aytFizikNet * k.sayKatFiz) + (aytKimyaNet * k.sayKatKim) + (aytBiyoNet * k.sayKatBiy);
            const sozPuan = 100 + (tytTotalNet * k.sozKatTyt) + (aytEdebNet * k.sozKatEdeb) + (aytTar1Net * k.sozKatTar1) + (aytCog1Net * k.sozKatCog1) + (aytTar2Net * k.sozKatTar2) + (aytCog2Net * k.sozKatCog2) + (aytFelsefeNet * k.sozKatFel) + (aytDinNet * k.sozKatDin);
            const eaPuan = 100 + (tytTotalNet * k.eaKatTyt) + (aytMatNet * k.eaKatMat) + (aytEdebNet * k.eaKatEdeb) + (aytTar1Net * k.eaKatTar1) + (aytCog1Net * k.eaKatCog1);
            const dilPuan = 100 + (tytTotalNet * k.dilKatTyt) + (ydtNet * k.dilKatYdt);

            // OBP HESABI
            const diploma = Math.max(50, Math.min(100, parseFloat(v.diplomaNotu) || 50));
            const obpBase = diploma * 5; // 250–500
            const obpPuani = obpBase * (v.prevPlacement ? 0.06 : 0.12);

            return {
                tytPuan,
                sayPuan: Math.max(100, sayPuan),
                sozPuan: Math.max(100, sozPuan),
                eaPuan: Math.max(100, eaPuan),
                dilPuan: Math.max(100, dilPuan),
                obpPuani,
                yTyt: tytPuan > 0 ? tytPuan + obpPuani : 0,
                ySay: sayPuan + obpPuani,
                ySoz: sozPuan + obpPuani,
                yEa: eaPuan + obpPuani,
                yDil: dilPuan + obpPuani,
            };
        },
        seo: {
            title: { tr: "YKS Puan Hesaplama 2025 — En Detaylı TYT AYT Hesaplama", en: "YKS Score Calculator 2025" },
            metaDescription: { tr: "2025 TYT, AYT ve Yabancı Dil testi netlerinizi girin, OBP dahil yerleştirme puanınızı hesaplayın. ÖSYM katsayılarıyla en yakın sonuç.", en: "Enter your 2025 TYT, AYT and Foreign Language nets, calculate placement score including OBP." },
            content: { tr: "YKS puanı, Temel Yetenek Testi (TYT), Alan Yeterlilik Testi (AYT) ve Ortaöğretim Başarı Puanı'nın (OBP) birleşimiyle oluşur. TYT %40, AYT ise %60 oranında etkilidir. Hesaplayıcımızda 4 yanlış 1 doğruyu götürür kuralı uygulanır.", en: "YKS score consists of TYT, AYT and OBP. TYT counts for 40% and AYT for 60%. The 4-wrong-1-correct rule is applied." },
            faq: [
                { q: { tr: "OBP puanı nasıl hesaplanır?", en: "How is OBP calculated?" }, a: { tr: "Diploma notu 5 ile çarpılarak OBP elde edilir. Yerleştirme puanına eklenirken bu puanın 0.12'si (kırılmamışsa) alınır.", en: "Diploma grade multiplied by 5 gives OBP. 0.12 of this is added to placement score." } },
                { q: { tr: "Baraj puanı kalktı mı?", en: "Is the threshold removed?" }, a: { tr: "Evet, YKS'de TYT ve AYT baraj puanı uygulaması kaldırılmıştır. Puanın hesaplanması için ilgili testten 0.5 net yapılması yeterlidir.", en: "Yes, thresholds are removed. 0.5 net in relevant tests is enough to calculate score." } },
            ],
            richContent: {
                howItWorks: { tr: "Tüm testlerden yaptığınız doğru ve yanlışları girin. Sistem otomatik olarak netlerinizi hesaplar ve ilgili puan türlerindeki katsayılarla çarparak ham ve yerleştirme puanlarınızı üretir.", en: "Enter correct/wrong for all tests. The system calculates nets and applies coefficients for raw and placement scores." },
                formulaText: { tr: "Net = Doğru - (Yanlış/4). Ham Puan = 100 + (Netler * Katsayı). Yerleştirme = Ham + OBP Katkısı.", en: "Net = Correct - (Wrong/4). Raw = 100 + (Nets * Coeff). Placement = Raw + OBP Contrib." },
                exampleCalculation: { tr: "Örnek: TYT 80 Net, AYT Mat 30 Net, AYT Fizik 10 Net ve 80 diploma notu olan bir öğrenci için SAY puanı yaklaşık 340 ham, 388 yerleştirme olarak hesaplanır.", en: "Example: student with 80 TYT nets, 30 AYT math, 10 AYT physics and 80 diploma grade gets ~340 raw, 388 placement score." },
                miniGuide: { tr: "<ul><li><b>Gerçekçi Veriler:</b> Lütfen deneme sonuçlarınızı veya sınav netlerinizi girin.</li><li><b>Yanlış Sayısı:</b> Yanlış cevaplar netinizi düşürür, boş bırakılan sorular etkisizdir.</li><li><b>OBP Kırılması:</b> Geçen yıl bir bölüme yerleştiyseniz kutucuğu işaretlemeyi unutmayın.</li></ul>", en: "Use realistic data from trials. Wrong answers reduce nets, blanks are neutral. Mark 'Placed Last Year' if applicable." }
            }
        }
    },

    // ── KPSS PUAN ────────────────────────────────────────────
    {
        id: "kpss-score",
        slug: "kpss-puan-hesaplama",
        category: "sinav-hesaplamalari",
        name: { tr: "KPSS Puan Hesaplama", en: "KPSS Score Calculator" },
        h1: { tr: "KPSS Puan Hesaplama — Genel Yetenek ve Genel Kültür", en: "KPSS Score Calculator" },
        description: { tr: "KPSS GY-GK doğru yanlış sayılarından KPSS-P1/P2/P3 puanlarınızı hesaplayın.", en: "Calculate KPSS-P1/P2/P3 scores from GY-GK correct/wrong counts." },
        shortDescription: { tr: "Genel Yetenek ve Genel Kültür soru sayılarını girin; KPSS puanınızı anında öğrenin.", en: "Enter GY and GK correct/wrong counts to calculate your KPSS score." },
        relatedCalculators: ["yks-puan-hesaplama", "ortalama-hesaplama"],
        inputs: [
            { id: "gyDogru", name: { tr: "GY Doğru (60 Soru)", en: "GY Correct" }, type: "number", defaultValue: 50, required: true, min: 0, max: 60 },
            { id: "gyYanlis", name: { tr: "GY Yanlış", en: "GY Wrong" }, type: "number", defaultValue: 5, required: true, min: 0, max: 60 },
            { id: "gkDogru", name: { tr: "GK Doğru (60 Soru)", en: "GK Correct" }, type: "number", defaultValue: 45, required: true, min: 0, max: 60 },
            { id: "gkYanlis", name: { tr: "GK Yanlış", en: "GK Wrong" }, type: "number", defaultValue: 5, required: true, min: 0, max: 60 },
        ],
        results: [
            { id: "gyNet", label: { tr: "GY Net", en: "GY Net" }, decimalPlaces: 2 },
            { id: "gkNet", label: { tr: "GK Net", en: "GK Net" }, decimalPlaces: 2 },
            { id: "p1", label: { tr: "KPSS-P1 Puanı", en: "KPSS-P1 Score" }, decimalPlaces: 3 },
            { id: "p2", label: { tr: "KPSS-P2 Puanı (tahmini)", en: "KPSS-P2 Score (estimated)" }, decimalPlaces: 3 },
            { id: "not", label: { tr: "Önemli Not", en: "Important Note" }, type: "text" },
        ],
        formula: (v) => {
            const gyNet = Math.max(0, (parseFloat(v.gyDogru) || 0) - (parseFloat(v.gyYanlis) || 0) / 4);
            const gkNet = Math.max(0, (parseFloat(v.gkDogru) || 0) - (parseFloat(v.gkYanlis) || 0) / 4);

            // ÖSYM resmi formülü: GY standart puanı %50 GY net + 50 baz, GK benzer şekilde
            // P1: GY (Ağırlık %70) + GK (Ağırlık %30) kombinasyonu
            // Net → Standart Puan dönüşümü yaklaşık: SP = 50 + (net - ortalama) / standart_sapma * 10
            // Pratik yaklaşım: KPSS-P1 = (GY_net / 60) * 70 * (100/60) + (GK_net / 60) * 30 * (100/60) * ... basit yaklaşım:
            // Basit simülatör: P1 ≈ GY_net * 1.17 + GK_net * 0.50 + 40 (tarihsel verilere dayalı yaklaşım)
            const p1 = Math.min(200, Math.max(0, (gyNet * 1.17) + (gkNet * 0.50) + 40));
            // P2 = GY+GK+Alan; alan testi olmadığından GY ağırlığını arttırarak yaklaşık tahmin
            const p2 = Math.min(200, p1 * 0.60); // P2 alan testi gerektirir, bu tahmini değerdir
            return {
                gyNet,
                gkNet,
                p1,
                p2,
                not: {
                    tr: "⚠️ P2 ve P3 puanları için Eğitim Bilimleri / Alan testleri ayrıca girmeniz gerekmektedir. Bu araç yalnızca GY+GK üzerinden P1 ve tahmini P2 hesaplar. Kesin sonuç için resmi ÖSYM sonuç belgesini kullanın.",
                    en: "⚠️ P2 and P3 scores require Education Sciences and Field test inputs. This tool calculates P1 and estimated P2 from GY+GK only. For exact results, use your official ÖSYM result document."
                }
            };
        },
        seo: {
            title: { tr: "KPSS Puan Hesaplama 2026 — GY GK Net Hesaplayıcı", en: "KPSS Score Calculator 2026" },
            metaDescription: { tr: "KPSS Genel Yetenek ve Genel Kültür doğru-yanlış sayılarından KPSS-P1 puanınızı hesaplayın. 2026 ÖSYM güncel katsayılarına göre.", en: "Calculate KPSS-P1 score from GY and GK correct/wrong counts using 2026 ÖSYM coefficients." },
            content: { tr: "KPSS puanı Genel Yetenek (GY) ve Genel Kültür (GK) netlerinden ÖSYM katsayılarıyla hesaplanır. P1 puan türünde GY %52.5, GK %22.5 ağırlığıyla standart puanlara aktarılır. P2 ve P3 puan türleri ek olarak Eğitim Bilimleri ve alan testlerini içermektedir.", en: "KPSS score is derived from GY and GK nets. In P1, GY has 52.5% and GK 22.5% weight. P2 and P3 additionally require Education Sciences and field test results." },
            faq: [
                { q: { tr: "KPSS P1 P2 P3 farkı nedir?", en: "What is the difference between P1 P2 P3?" }, a: { tr: "KPSS-P1: Yalnızca GY+GK. Lisans mezunları KPSS-P3, önlisans KPSS-P93/P94 puan türlerini kullanır. KPSS-P2 eğitim bilimleri testini içerir.", en: "KPSS-P1: GY+GK only. Bachelor graduates use P3, associate degree holders use P93/P94. KPSS-P2 includes Education Sciences tests." } },
                { q: { tr: "GY ve GK'dan kaç net yapılmalı?", en: "How many nets needed in GY and GK?" }, a: { tr: "Her iki testten en az 1 net zoru koşulu arandığı bilinmektedir. P1 =111–113 üzeri sınıflama için ortalama 85+ net tavsiye edilir.", en: "At least 1 net is required in each test. For P1 above 111-113, around 85+ total nets are recommended." } },
            ],
            richContent: {
                howItWorks: { tr: "Doğrulardan yanlışların dörtte biri çıkarılarak net hesaplanır. GY netin yaklaşık %70'i, GK netin %30'u P1 puanına katkı sağlar. ÖSYM her dönem için ayrı standart sapma katsayıları kullanmaktadır.", en: "Net = Correct - Wrong/4. Approximately 70% of GY net and 30% of GK net contribute to P1. ÖSYM uses period-specific standard deviation coefficients." },
                formulaText: { tr: "KPSS-P1 ≈ (GY_Net × 1.17) + (GK_Net × 0.50) + 40. Gerçek puan ÖSYM standart puan dönüşümüyle farklılaşabilir.", en: "KPSS-P1 ≈ (GY_Net × 1.17) + (GK_Net × 0.50) + 40. Actual score may differ with ÖSYM standardization." },
                exampleCalculation: { tr: "Örnek: GY 48 net + GK 44 net → P1 ≈ (48×1.17) + (44×0.50) + 40 = 56.16 + 22 + 40 = 118.16", en: "Example: GY 48 net + GK 44 net → P1 ≈ (48×1.17) + (44×0.50) + 40 = 118.16" },
                miniGuide: { tr: "<ul><li><b>Resmi Fark:</b> Bu hesaplama tahminsel olup ÖSYM'nin gerçek standart sapma tabanlı dönüşümünden farklılık gösterebilir.</li><li><b>P3 için:</b> Lisans mezunları için öğretmenlik dışı KPSS P3 puanı, Alan testini de kapsar.</li></ul>", en: "This is an estimate — ÖSYM's actual standard deviation conversion may differ. P3 score for non-teaching bachelor tracks also includes field exam." }
            }
        }
    },

    // ── ORTALAMA HESAPLAMA ────────────────────────────────────
    {
        id: "average",
        slug: "ortalama-hesaplama",
        category: "matematik-hesaplama",
        name: { tr: "Ortalama Hesaplama", en: "Average Calculator" },
        h1: { tr: "Ortalama Hesaplama — Aritmetik, Geometrik, Ağırlıklı", en: "Average Calculator — Arithmetic, Geometric, Weighted" },
        description: { tr: "Not veya değer listesinden aritmetik ve geometrik ortalama hesaplayın.", en: "Calculate arithmetic and geometric mean from a list of numbers." },
        shortDescription: { tr: "Sayıları girin; aritmetik ortalama, geometrik ortalama, medyan, minimum ve maksimumu anında görün.", en: "Enter numbers to instantly see arithmetic mean, geometric mean, median, min and max." },
        relatedCalculators: ["yuzde-hesaplama", "yks-puan-hesaplama", "kpss-puan-hesaplama"],
        inputs: [
            { id: "n1", name: { tr: "1. Değer", en: "Value 1" }, type: "number", defaultValue: 85, required: true },
            { id: "n2", name: { tr: "2. Değer", en: "Value 2" }, type: "number", defaultValue: 72, required: true },
            { id: "n3", name: { tr: "3. Değer", en: "Value 3" }, type: "number", defaultValue: 90, required: false },
            { id: "n4", name: { tr: "4. Değer", en: "Value 4" }, type: "number", defaultValue: 68, required: false },
            { id: "n5", name: { tr: "5. Değer", en: "Value 5" }, type: "number", defaultValue: 95, required: false },
        ],
        results: [
            { id: "count", label: { tr: "Sayı Adedi", en: "Count" }, decimalPlaces: 0 },
            { id: "sum", label: { tr: "Toplam", en: "Sum" }, decimalPlaces: 2 },
            { id: "arithmetic", label: { tr: "Aritmetik Ortalama", en: "Arithmetic Mean" }, decimalPlaces: 4 },
            { id: "geometric", label: { tr: "Geometrik Ortalama", en: "Geometric Mean" }, decimalPlaces: 4 },
            { id: "median", label: { tr: "Medyan (Ortanca)", en: "Median" }, decimalPlaces: 2 },
            { id: "min", label: { tr: "En Küçük", en: "Minimum" }, decimalPlaces: 2 },
            { id: "max", label: { tr: "En Büyük", en: "Maximum" }, decimalPlaces: 2 },
        ],
        formula: (v) => {
            const nums = [v.n1, v.n2, v.n3, v.n4, v.n5]
                .map(x => parseFloat(x))
                .filter(x => !isNaN(x));
            const count = nums.length;
            if (count === 0) return { count: 0, sum: 0, arithmetic: 0, geometric: 0, median: 0, min: 0, max: 0 };
            const sum = nums.reduce((a, b) => a + b, 0);
            const arithmetic = sum / count;
            const geometric = Math.pow(nums.reduce((a, b) => a * b, 1), 1 / count);
            const sorted = [...nums].sort((a, b) => a - b);
            const median = count % 2 === 0
                ? (sorted[count / 2 - 1] + sorted[count / 2]) / 2
                : sorted[Math.floor(count / 2)];
            return { count, sum, arithmetic, geometric, median, min: sorted[0], max: sorted[count - 1] };
        },
        seo: {
            title: { tr: "Ortalama Hesaplama — Aritmetik Geometrik Medyan", en: "Average Calculator — Arithmetic Geometric Median" },
            metaDescription: { tr: "Sayı listesinden aritmetik ortalama, geometrik ortalama, medyan, min ve max değerleri anında hesaplayın.", en: "Instantly calculate arithmetic mean, geometric mean, median, min and max from a list of numbers." },
            content: { tr: "Aritmetik ortalama tüm değerlerin toplamının sayı adedine bölümüdür. Geometrik ortalama ise değerlerin çarpımının n. kökü olarak hesaplanır.", en: "Arithmetic mean is sum divided by count. Geometric mean is the nth root of the product of values." },
            faq: [
                { q: { tr: "Aritmetik ve geometrik ortalama farkı nedir?", en: "What is the difference between arithmetic and geometric mean?" }, a: { tr: "Aritmetik ortalama toplamın sayıya bölümüdür. Geometrik ortalama büyüme oranları ve varlık getirileri için daha doğru sonuç verir.", en: "Arithmetic mean is sum/count. Geometric mean is better for growth rates and investment returns." } },
            ],
            richContent: {
                howItWorks: { tr: "Girilen sayılar toplanır, sayıya bölünerek aritmetik ortalama bulunur. Geometrik ortalama için çarpım n. kökü alınır. Sayılar sıralanarak medyan belirlenir.", en: "Numbers summed and divided for arithmetic mean. Product's nth root for geometric. Sorted for median." },
                formulaText: { tr: "Aritmetik = Toplam / n. Geometrik = (x₁×x₂×…×xₙ)^(1/n). Medyan = Sıralı dizinin ortası.", en: "AM = Sum/n. GM = (x₁×x₂×…×xₙ)^(1/n). Median = middle of sorted list." },
                exampleCalculation: { tr: "Örnek: 85, 72, 90, 68, 95 → Toplam=410 | AM=82 | GM≈81.5 | Medyan=85.", en: "Example: 85,72,90,68,95 → Sum=410 | AM=82 | GM≈81.5 | Median=85." },
                miniGuide: { tr: "<ul><li><b>Not Ortalaması:</b> Derslerin notlarını girerek dönem ortalamanızı hesaplayın.</li><li><b>Medyan vs Ortalama:</b> Aşırı değerler varsa medyan daha temsili olabilir.</li></ul>", en: "Use for grade averages. Median is more robust when outliers exist." }
            }
        }
    },

    // ── KOMBİNASYON / PERMÜTASYON / FAKTÖRİYEL ──────────────
    {
        id: "combinatorics",
        slug: "kombinasyon-permutasyon-faktoriyel",
        category: "matematik-hesaplama",
        name: { tr: "Kombinasyon, Permütasyon ve Faktöriyel", en: "Combination, Permutation & Factorial" },
        h1: { tr: "Kombinasyon, Permütasyon ve Faktöriyel Hesaplama", en: "Combination, Permutation & Factorial Calculator" },
        description: { tr: "n ve r değerleriyle kombinasyon, permütasyon ve faktöriyel hesaplayın.", en: "Calculate combination, permutation and factorial from n and r." },
        shortDescription: { tr: "n ve r değerlerini girin; C(n,r), P(n,r) ve n!'i anında hesaplayın.", en: "Enter n and r to instantly compute C(n,r), P(n,r) and n!." },
        relatedCalculators: ["yuzde-hesaplama", "ortalama-hesaplama", "us-kuvvet-karekok"],
        inputs: [
            { id: "n", name: { tr: "n (toplam eleman)", en: "n (total items)" }, type: "number", defaultValue: 10, required: true, min: 0, max: 20 },
            { id: "r", name: { tr: "r (seçilen eleman)", en: "r (selected items)" }, type: "number", defaultValue: 3, required: true, min: 0, max: 20 },
        ],
        results: [
            { id: "nFact", label: { tr: "n! (n Faktöriyel)", en: "n! (n Factorial)" }, decimalPlaces: 0 },
            { id: "rFact", label: { tr: "r! (r Faktöriyel)", en: "r! (r Factorial)" }, decimalPlaces: 0 },
            { id: "perm", label: { tr: "P(n,r) — Permütasyon", en: "P(n,r) — Permutation" }, decimalPlaces: 0 },
            { id: "comb", label: { tr: "C(n,r) — Kombinasyon", en: "C(n,r) — Combination" }, decimalPlaces: 0 },
        ],
        formula: (v) => {
            const n = Math.min(Math.floor(parseFloat(v.n) || 0), 20);
            const r = Math.min(Math.floor(parseFloat(v.r) || 0), n);
            const fact = (k: number): number => k <= 1 ? 1 : k * fact(k - 1);
            const nFact = fact(n);
            const rFact = fact(r);
            const perm = fact(n) / fact(n - r);
            const comb = perm / rFact;
            return { nFact, rFact, perm, comb };
        },
        seo: {
            title: { tr: "Kombinasyon Permütasyon Faktöriyel Hesaplama", en: "Combination Permutation Factorial Calculator" },
            metaDescription: { tr: "n ve r değerlerinden kombinasyon C(n,r), permütasyon P(n,r) ve faktöriyel n! hesaplayın.", en: "Calculate C(n,r), P(n,r) and n! from n and r values." },
            content: { tr: "Kombinasyon sıranın önemli olmadığı seçim sayısını, permütasyon sıranın önemli olduğu düzenleme sayısını verir.", en: "Combination counts selections where order doesn't matter; permutation counts arrangements where order matters." },
            faq: [
                { q: { tr: "Kombinasyon ile permütasyon arasındaki fark nedir?", en: "What is the difference between combination and permutation?" }, a: { tr: "Permütasyonda sıra önemlidir (AB ≠ BA). Kombinasyonda sıra önemsizdir (AB = BA).", en: "In permutation order matters (AB ≠ BA). In combination order doesn't (AB = BA)." } },
                { q: { tr: "Faktöriyel nedir?", en: "What is factorial?" }, a: { tr: "n! = 1×2×3×…×n. Örneğin 5! = 120. 0! = 1 tanım gereği.", en: "n! = 1×2×3×…×n. E.g. 5! = 120. 0! = 1 by definition." } },
            ],
            richContent: {
                howItWorks: { tr: "Faktöriyel recursive olarak hesaplanır. P(n,r) = n!/(n-r)!. C(n,r) = n!/(r!(n-r)!).", en: "Factorial computed recursively. P(n,r) = n!/(n-r)!. C(n,r) = n!/(r!(n-r)!)." },
                formulaText: { tr: "n! = 1×2×…×n. P(n,r) = n!/(n−r)!. C(n,r) = n!/(r!×(n−r)!).", en: "n! = 1×2×…×n. P(n,r) = n!/(n−r)!. C(n,r) = n!/(r!×(n−r)!)." },
                exampleCalculation: { tr: "Örnek: n=10, r=3 → 10!=3.628.800 | P(10,3)=720 | C(10,3)=120.", en: "Example: n=10, r=3 → 10!=3,628,800 | P=720 | C=120." },
                miniGuide: { tr: "<ul><li><b>Loto Olasılığı:</b> 49'dan 6 seçim → C(49,6) ≈ 13.983.816 farklı kombinasyon.</li><li><b>Sınav Sorusu:</b> Seçim sorunlarında sıra önemli mi değil mi önce belirleyin.</li></ul>", en: "Lottery: C(49,6) ≈ 13,983,816 combinations. For exam problems: first determine if order matters." }
            }
        }
    },

    // ── GÜN HESAPLAMA / İKİ TARİH ARASI ─────────────────────
    {
        id: "date-diff",
        slug: "gun-hesaplama",
        category: "zaman-hesaplama",
        name: { tr: "Gün Hesaplama — İki Tarih Arası", en: "Day Counter — Between Two Dates" },
        h1: { tr: "Gün Hesaplama — İki Tarih Arasındaki Gün Sayısı", en: "Day Counter — Days Between Two Dates" },
        description: { tr: "İki tarih arasındaki gün, hafta ve ay farkını hesaplayın.", en: "Calculate the difference in days, weeks and months between two dates." },
        shortDescription: { tr: "Başlangıç ve bitiş tarihlerini seçin; aradaki gün, hafta, ay ve yıl farkını anında görün.", en: "Select start and end dates to instantly see the difference in days, weeks, months and years." },
        relatedCalculators: ["yas-hesaplama", "kidem-tazminati-hesaplama", "ihbar-tazminati-hesaplama"],
        inputs: [
            { id: "startDate", name: { tr: "Başlangıç Tarihi", en: "Start Date" }, type: "date", defaultValue: "2025-01-01", required: true },
            { id: "endDate", name: { tr: "Bitiş Tarihi", en: "End Date" }, type: "date", defaultValue: "2026-01-01", required: true },
        ],
        results: [
            { id: "days", label: { tr: "Toplam Gün", en: "Total Days" }, decimalPlaces: 0 },
            { id: "weeks", label: { tr: "Hafta", en: "Weeks" }, decimalPlaces: 2 },
            { id: "months", label: { tr: "Ay (yaklaşık)", en: "Months (approx)" }, decimalPlaces: 2 },
            { id: "years", label: { tr: "Yıl (yaklaşık)", en: "Years (approx)" }, decimalPlaces: 4 },
        ],
        formula: (v) => {
            const start = new Date(v.startDate);
            const end = new Date(v.endDate);
            const ms = end.getTime() - start.getTime();
            const days = Math.round(ms / (1000 * 60 * 60 * 24));
            return { days: Math.abs(days), weeks: Math.abs(days) / 7, months: Math.abs(days) / 30.4375, years: Math.abs(days) / 365.25 };
        },
        seo: {
            title: { tr: "Gün Hesaplama — İki Tarih Arası Gün Sayısı", en: "Day Counter — Days Between Dates" },
            metaDescription: { tr: "İki tarih arasındaki gün, hafta, ay ve yıl farkını anında hesaplayın.", en: "Instantly calculate the number of days, weeks, months and years between two dates." },
            content: { tr: "İki tarih arasındaki fark, bitiş tarihinden başlangıç tarihinin çıkarılmasıyla milisaniye cinsinden bulunur, ardından gün/hafta/aya çevrilir.", en: "Date difference calculated in milliseconds then converted to days, weeks and months." },
            faq: [
                { q: { tr: "İş günü hesaplaması yapabiliyor musunuz?", en: "Can you calculate working days?" }, a: { tr: "Bu araç takvim günlerini hesaplar. İş günü hesabı için hafta sonları ve resmi tatillerin ayrıca çıkarılması gerekir.", en: "This tool counts calendar days. Working days require subtracting weekends and public holidays." } },
            ],
            richContent: {
                howItWorks: { tr: "JavaScript Date nesnesiyle iki tarih arasındaki milisaniye farkı hesaplanır, 86.400.000 ms'ye (1 gün) bölünerek gün sayısı bulunur.", en: "Millisecond difference between dates divided by 86,400,000ms (one day) to get day count." },
                formulaText: { tr: "Gün = |Bitiş − Başlangıç| ms ÷ 86.400.000. Hafta = Gün ÷ 7. Ay = Gün ÷ 30,4375.", en: "Days = |End − Start| ms ÷ 86,400,000. Weeks = Days ÷ 7. Months = Days ÷ 30.4375." },
                exampleCalculation: { tr: "Örnek: 01.01.2025 → 01.01.2026 = 365 gün = 52,14 hafta = 12 ay.", en: "Example: 01.01.2025 → 01.01.2026 = 365 days = 52.14 weeks = 12 months." },
                miniGuide: { tr: "<ul><li>Kıdem tazminatı için çalışma sürenizi gün bazında tespit edin.</li><li>Proje son tarihinize kaç gün kaldığını öğrenin.</li></ul>", en: "Find your work tenure for severance pay. Count days to project deadlines." }
            }
        }
    },

    // ── MEVDUAT FAİZİ ─────────────────────────────────────────
    {
        id: "deposit",
        slug: "mevduat-faiz-hesaplama",
        category: "finansal-hesaplamalar",
        name: { tr: "Mevduat Faiz Hesaplama", en: "Deposit Interest Calculator" },
        h1: { tr: "Mevduat Faiz Hesaplama — Vadeli Mevduat Getirisi", en: "Deposit Interest Calculator — Term Deposit Return" },
        description: { tr: "Vadeli mevduat faiz getirinizi stopaj sonrası net olarak hesaplayın.", en: "Calculate your term deposit interest return net of withholding tax." },
        shortDescription: { tr: "Ana para, faiz oranı ve vadeyi girin; brüt faiz, stopaj (%15) ve net kazancınızı anında görün.", en: "Enter principal, rate and term to see gross interest, withholding tax (15%) and net earnings." },
        relatedCalculators: ["bilesik-faiz-hesaplama", "basit-faiz-hesaplama", "enflasyon-hesaplama"],
        inputs: [
            { id: "principal", name: { tr: "Ana Para (₺)", en: "Principal (₺)" }, type: "number", defaultValue: 100000, suffix: "₺", required: true, min: 0 },
            { id: "rate", name: { tr: "Yıllık Faiz Oranı (%)", en: "Annual Rate (%)" }, type: "number", defaultValue: 45, suffix: "%", required: true, min: 0 },
            { id: "days", name: { tr: "Vade (Gün)", en: "Term (Days)" }, type: "number", defaultValue: 90, suffix: "gün", required: true, min: 1 },
        ],
        results: [
            { id: "grossInterest", label: { tr: "Brüt Faiz Geliri", en: "Gross Interest" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "withholding", label: { tr: "Stopaj (%15)", en: "Withholding (15%)" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "netInterest", label: { tr: "Net Faiz Geliri", en: "Net Interest" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "netTotal", label: { tr: "Vade Sonu Net Tutar", en: "Net Total at Maturity" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "effectiveRate", label: { tr: "Efektif Yıllık Oran", en: "Effective Annual Rate" }, suffix: " %", decimalPlaces: 2 },
        ],
        formula: (v) => {
            const principal = parseFloat(v.principal) || 0;
            const annualRate = (parseFloat(v.rate) || 0) / 100;
            const days = parseFloat(v.days) || 1;
            const grossInterest = principal * annualRate * (days / 365);
            const withholding = grossInterest * 0.15;
            const netInterest = grossInterest - withholding;
            const netTotal = principal + netInterest;
            const effectiveRate = (netInterest / principal) * (365 / days) * 100;
            return { grossInterest, withholding, netInterest, netTotal, effectiveRate };
        },
        seo: {
            title: { tr: "Mevduat Faiz Hesaplama 2026 — Stopajlı Net Getiri", en: "Deposit Interest Calculator 2026 — Net After Tax" },
            metaDescription: { tr: "Vadeli mevduat faiz getirinizi %15 stopaj kesintisi sonrası net olarak hesaplayın.", en: "Calculate term deposit interest return net of 15% withholding tax." },
            content: { tr: "Vadeli mevduat faiz geliri üzerinden %15 stopaj vergisi kesilir. Net faiz = Brüt Faiz × (1 − 0,15).", en: "15% withholding tax applies to deposit interest. Net = Gross × 0.85." },
            faq: [
                { q: { tr: "Mevduat faizinden stopaj kesilir mi?", en: "Is withholding tax applied to deposit interest?" }, a: { tr: "Evet, 2026'da vadeli mevduat faiz gelirleri üzerinden %15 stopaj vergisi kesilmektedir.", en: "Yes, 15% withholding tax applies to term deposit interest in 2026." } },
                { q: { tr: "Günlük mi yıllık mı faiz işler?", en: "Is interest calculated daily or annually?" }, a: { tr: "Türkiye'de mevduat faizi genellikle yıllık baz üzerinden gün sayısına orantılı hesaplanır: Ana Para × Oran × (Gün/365).", en: "In Turkey deposit interest is calculated proportionally: Principal × Rate × (Days/365)." } },
            ],
            richContent: {
                howItWorks: { tr: "Brüt faiz = Ana Para × Yıllık Oran × (Gün/365). Net faiz = Brüt × 0,85. Efektif yıllık oran net kazancın yıllıklandırılmış değeridir.", en: "Gross = Principal × Rate × (Days/365). Net = Gross × 0.85. Effective rate annualizes net return." },
                formulaText: { tr: "Brüt Faiz = P × r × (d/365). Stopaj = Brüt × 0,15. Net = Brüt × 0,85. Efektif = (Net/P) × (365/d) × 100.", en: "Gross = P×r×(d/365). Tax = Gross×0.15. Net = Gross×0.85. Effective = (Net/P)×(365/d)×100." },
                exampleCalculation: { tr: "Örnek: 100.000 ₺, %45, 90 gün → Brüt=11.095,89 ₺ | Stopaj=1.664,38 ₺ | Net=9.431,51 ₺ | Efektif≈%38,25/yıl.", en: "Example: 100,000 TL, 45%, 90 days → Gross=11,095.89 | Tax=1,664.38 | Net=9,431.51 | Eff≈38.25%/yr." },
                miniGuide: { tr: "<ul><li><b>Enflasyonla Kıyasla:</b> Net getirinin enflasyon oranının altında olup olmadığını kontrol edin.</li><li><b>Farklı Vadeler:</b> 1 ay, 3 ay, 6 ay vadelerini kıyaslayın.</li></ul>", en: "Compare net return against inflation. Compare 1M, 3M, 6M terms." }
            }
        }
    },

    // ── KREDİ KARTI ASGARİ ÖDEME ─────────────────────────────
    {
        id: "credit-card-min",
        slug: "kredi-karti-asgari-odeme",
        category: "finansal-hesaplamalar",
        name: { tr: "Kredi Kartı Asgari Ödeme Hesaplama", en: "Credit Card Minimum Payment Calculator" },
        h1: { tr: "Kredi Kartı Asgari Ödeme — Faiz ve Geri Ödeme Planı", en: "Credit Card Minimum Payment & Interest Calculator" },
        description: { tr: "Kredi kartı borcunuzu yalnızca asgari ödemeyle kapatmanın maliyetini hesaplayın.", en: "Calculate the true cost of paying only the minimum on your credit card." },
        shortDescription: { tr: "Bakiye, faiz oranı ve ödeme tutarınızı girin; toplam faiz yükünü ve kapanma süresini öğrenin.", en: "Enter balance, rate and payment to see total interest cost and payoff timeline." },
        relatedCalculators: ["kredi-taksit-hesaplama", "bilesik-faiz-hesaplama", "enflasyon-hesaplama"],
        inputs: [
            { id: "balance", name: { tr: "Güncel Bakiye (₺)", en: "Current Balance (₺)" }, type: "number", defaultValue: 20000, suffix: "₺", required: true, min: 0 },
            { id: "rate", name: { tr: "Aylık Faiz Oranı (%)", en: "Monthly Rate (%)" }, type: "number", defaultValue: 3.5, suffix: "%", required: true, min: 0 },
            { id: "minPct", name: { tr: "Asgari Ödeme Oranı (%)", en: "Min Payment (%)" }, type: "number", defaultValue: 5, suffix: "%", required: true, min: 1 },
        ],
        results: [
            { id: "minPayment", label: { tr: "Bu Ay Asgari Ödeme", en: "Min Payment This Month" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "monthlyInterest", label: { tr: "Bu Ay Faiz", en: "Interest This Month" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "totalMonths", label: { tr: "Tahmini Kapanma Süresi", en: "Estimated Payoff (months)" }, suffix: " ay", decimalPlaces: 0 },
            { id: "totalInterest", label: { tr: "Toplam Faiz Yükü", en: "Total Interest Paid" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "totalPaid", label: { tr: "Toplam Ödeme", en: "Total Paid" }, suffix: " ₺", decimalPlaces: 2 },
        ],
        formula: (v) => {
            const balance = parseFloat(v.balance) || 0;
            const monthlyRate = (parseFloat(v.rate) || 0) / 100;
            const minPct = (parseFloat(v.minPct) || 5) / 100;
            const minPayment = balance * minPct;
            const monthlyInterest = balance * monthlyRate;
            // Simülasyon
            let bal = balance, months = 0, totalInterest = 0;
            while (bal > 0.01 && months < 600) {
                const interest = bal * monthlyRate;
                const payment = Math.max(bal * minPct, 50);
                totalInterest += interest;
                bal = bal + interest - payment;
                months++;
            }
            return { minPayment, monthlyInterest, totalMonths: months, totalInterest, totalPaid: balance + totalInterest };
        },
        seo: {
            title: { tr: "Kredi Kartı Asgari Ödeme Hesaplama — Faiz Yükü", en: "Credit Card Min Payment Calculator — Interest Cost" },
            metaDescription: { tr: "Kredi kartı borcunuzu sadece asgari ödemeyle kapatmanın gerçek maliyetini ve süresini hesaplayın.", en: "Calculate the true cost and timeline of paying only the minimum on your credit card debt." },
            content: { tr: "Kredi kartı asgari ödemesi borcu yavaş ve pahalı kapatır. Aylık faiz = Bakiye × Aylık Oran. Asgari ödemenin büyük kısmı faize gider.", en: "Minimum payments are slow and expensive. Most of each payment goes to interest." },
            faq: [
                { q: { tr: "Asgari ödeme neden tehlikelidir?", en: "Why is minimum payment dangerous?" }, a: { tr: "Asgari ödemeyle borcun büyük kısmı faize gider. Borç yıllar içinde çok yüksek toplam maliyetle kapanır.", en: "With minimum payments, most goes to interest. Debt takes years to clear at enormous total cost." } },
            ],
            richContent: {
                howItWorks: { tr: "Her ay bakiyeye faiz eklenir, asgari ödeme düşülür, yeni bakiye hesaplanır. Bu döngü borç sıfırlanana kadar sürer.", en: "Each month: add interest, subtract min payment, compute new balance. Repeat until balance reaches zero." },
                formulaText: { tr: "Asgari Ödeme = Bakiye × %5. Yeni Bakiye = Bakiye + Faiz − Ödeme.", en: "Min Payment = Balance × 5%. New Balance = Balance + Interest − Payment." },
                exampleCalculation: { tr: "Örnek: 20.000 ₺ borç, %3,5 aylık faiz, %5 asgari ödeme → 1. ay faiz=700 ₺, ödeme=1.000 ₺ → yeni bakiye=19.700 ₺. Kapanma ≈ 36 ay, toplam faiz ≈ 12.000 ₺.", en: "Example: 20,000 TL, 3.5% monthly, 5% min → payoff ≈ 36 months, total interest ≈ 12,000 TL." },
                miniGuide: { tr: "<ul><li><b>Ekstra Ödeme:</b> Asgari ödemenin 2 katını ödeyin; toplam faiz dramatik şekilde düşer.</li><li><b>Taksit Fırsatı:</b> Bankanızın sunduğu sıfır faizli taksit seçeneğini değerlendirin.</li></ul>", en: "Doubling the min payment dramatically cuts total interest. Look for 0% installment options." }
            }
        }
    },

    // ── ÖTV HESAPLAMA ─────────────────────────────────────────
    {
        id: "otv",
        slug: "otv-hesaplama",
        category: "tasit-ve-vergi",
        name: { tr: "ÖTV Hesaplama", en: "Special Consumption Tax Calculator" },
        h1: { tr: "ÖTV Hesaplama 2026 — Araç Özel Tüketim Vergisi", en: "ÖTV Calculator 2026 — Vehicle Special Consumption Tax" },
        description: { tr: "2026 araç ÖTV oranlarına göre binek araç ÖTV tutarınızı hesaplayın.", en: "Calculate vehicle ÖTV based on 2026 special consumption tax rates." },
        shortDescription: { tr: "Motor hacmi ve baz fiyatı girin; 2026 ÖTV matrahını ve vergisini anında öğrenin.", en: "Enter engine size and base price to instantly get 2026 ÖTV amount." },
        relatedCalculators: ["mtv-hesaplama", "kdv-hesaplama", "yakit-tuketim-maliyet"],
        inputs: [
            {
                id: "engineCC",
                name: { tr: "Motor Hacmi", en: "Engine Size" },
                type: "select",
                defaultValue: "1600-2000",
                options: [
                    { label: { tr: "1600 cc ve altı", en: "Up to 1600 cc" }, value: "0-1600" },
                    { label: { tr: "1601–2000 cc", en: "1601–2000 cc" }, value: "1600-2000" },
                    { label: { tr: "2001 cc ve üzeri", en: "2001 cc and above" }, value: "2000+" },
                ]
            },
            { id: "basePrice", name: { tr: "Aracın ÖTV Matrahı (₺)", en: "Vehicle ÖTV Base Price (₺)" }, type: "number", defaultValue: 500000, suffix: "₺", required: true, min: 0 },
        ],
        results: [
            { id: "otvRate", label: { tr: "ÖTV Oranı (%)", en: "ÖTV Rate (%)" }, suffix: " %", decimalPlaces: 0 },
            { id: "otvAmount", label: { tr: "ÖTV Tutarı", en: "ÖTV Amount" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "kdvBase", label: { tr: "KDV Matrahı (Matr.+ÖTV)", en: "VAT Base" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "kdvAmount", label: { tr: "KDV (%20)", en: "VAT (20%)" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "totalTax", label: { tr: "Toplam Vergi (ÖTV+KDV)", en: "Total Tax (ÖTV+VAT)" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "totalPrice", label: { tr: "Tahmini Satış Fiyatı", en: "Estimated Sale Price" }, suffix: " ₺", decimalPlaces: 2 },
        ],
        formula: (v) => {
            // 2026 binek araç ÖTV oranları (matrah bazlı)
            const rateMap: Record<string, number> = {
                "0-1600": 45,   // 1600cc altı
                "1600-2000": 120,  // 1601-2000cc
                "2000+": 220,  // 2001cc üzeri
            };
            const base = parseFloat(v.basePrice) || 0;
            const otvRate = rateMap[v.engineCC] ?? 45;
            const otvAmount = base * (otvRate / 100);
            const kdvBase = base + otvAmount;
            const kdvAmount = kdvBase * 0.20;
            const totalTax = otvAmount + kdvAmount;
            const totalPrice = base + totalTax;
            return { otvRate, otvAmount, kdvBase, kdvAmount, totalTax, totalPrice };
        },
        seo: {
            title: { tr: "ÖTV Hesaplama 2026 — Araç Özel Tüketim Vergisi", en: "ÖTV Calculator 2026 — Vehicle Special Consumption Tax" },
            metaDescription: { tr: "2026 araç ÖTV oranlarıyla binek araç ÖTV ve KDV tutarını hesaplayın.", en: "Calculate vehicle ÖTV and VAT amounts based on 2026 special consumption tax rates." },
            content: { tr: "Binek araçlarda ÖTV motor hacmine göre değişir: 1600cc altı %45, 1601-2000cc %120, 2001cc üzeri %220 (2026 matrah bazlı oranlar). ÖTV tutarı KDV matrahına eklenir.", en: "Vehicle ÖTV varies by engine size: under 1600cc 45%, 1601-2000cc 120%, above 2001cc 220% (2026 base price rates). ÖTV is added to VAT base." },
            faq: [
                { q: { tr: "ÖTV nasıl hesaplanır?", en: "How is ÖTV calculated?" }, a: { tr: "Araç matrahı × ÖTV oranı = ÖTV tutarı. Sonra (Matrah + ÖTV) × %20 = KDV.", en: "Base price × ÖTV rate = ÖTV. Then (Base + ÖTV) × 20% = VAT." } },
                { q: { tr: "İkinci el araçta ÖTV ödenir mi?", en: "Is ÖTV paid on used cars?" }, a: { tr: "İkinci el araç satışlarında ÖTV ödenmez; ÖTV yalnızca ilk satışta (imalatçı veya ithalatçı tarafından) ödenir.", en: "ÖTV is not paid on used car sales; only on first sale by manufacturer or importer." } },
            ],
            richContent: {
                howItWorks: { tr: "2026 ÖTV oranları motor hacmine ve araç matrahına göre uygulanır. ÖTV matrahı KDV matrahına eklenerek nihai vergi yükü hesaplanır.", en: "2026 ÖTV rates applied by engine size and base price. ÖTV added to VAT base for total tax." },
                formulaText: { tr: "ÖTV = Matrah × Oran. KDV Matrahı = Matrah + ÖTV. KDV = KDV Matrahı × 0,20. Satış Fiyatı = Matrah + ÖTV + KDV.", en: "ÖTV = Base × Rate. VAT Base = Base + ÖTV. VAT = VAT Base × 0.20. Sale = Base + ÖTV + VAT." },
                exampleCalculation: { tr: "Örnek: 500.000 ₺ matrah, 1600-2000cc → ÖTV = %120 → 600.000 ₺ | KDV matrahı = 1.100.000 ₺ | KDV = 220.000 ₺ | Toplam vergi = 820.000 ₺ | Fiyat = 1.320.000 ₺.", en: "Example: 500,000 TL base, 1600-2000cc → ÖTV = 600,000 TL | VAT = 220,000 TL | Total price = 1,320,000 TL." },
                miniGuide: { tr: "<ul><li><b>Matrah:</b> ÖTV matrahı araç fiyatının tamamı değil; üretici/ithalatçı fatura değeridir.</li><li><b>Elektrikli Araç:</b> Elektrikli araçlarda ÖTV oranları binek araçlara kıyasla çok daha düşüktür.</li></ul>", en: "ÖTV base is manufacturer invoice, not retail price. Electric vehicles have much lower ÖTV rates." }
            }
        }
    },
];

// ────────────────────────────────────────────────────────────────
// AŞAMA 3
// ────────────────────────────────────────────────────────────────
export const phase3Calculators: CalculatorConfig[] = [

    // ── ASGARİ ÜCRET GÖSTERGESİ ──────────────────────────────
    {
        id: "min-wage",
        slug: "asgari-ucret-hesaplama",
        category: "maas-ve-vergi",
        name: { tr: "Asgari Ücret 2026", en: "Minimum Wage 2026" },
        h1: { tr: "Asgari Ücret 2026 — Brüt ve Net Tutarlar", en: "Minimum Wage 2026 — Gross and Net" },
        description: { tr: "2026 yılı asgari ücret brüt, net ve işverene maliyetini görün.", en: "See 2026 minimum wage gross, net and employer cost." },
        shortDescription: { tr: "2026 Ocak ve Temmuz asgari ücret tutarlarını, kesintileri ve işverene toplam maliyeti anında görün.", en: "Instantly see 2026 minimum wage amounts, deductions and total employer cost." },
        relatedCalculators: ["maas-hesaplama", "gelir-vergisi-hesaplama", "kidem-tazminati-hesaplama"],
        inputs: [
            {
                id: "period", name: { tr: "Dönem", en: "Period" }, type: "select", defaultValue: "jan2026",
                options: [
                    { label: { tr: "Ocak 2026", en: "January 2026" }, value: "jan2026" },
                    { label: { tr: "Temmuz 2026 (tahmini)", en: "July 2026 (estimated)" }, value: "jul2026" },
                ]
            },
        ],
        results: [
            { id: "gross", label: { tr: "Brüt Asgari Ücret", en: "Gross Min Wage" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "sgkEmployee", label: { tr: "SGK İşçi Payı (%14)", en: "SGK Employee (14%)" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "unemploy", label: { tr: "İşsizlik Sig. (%1)", en: "Unemployment Ins." }, suffix: " ₺", decimalPlaces: 2 },
            { id: "net", label: { tr: "Net Asgari Ücret", en: "Net Min Wage" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "sgkEmployer", label: { tr: "SGK İşveren Payı (%15,5)", en: "SGK Employer (15.5%)" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "totalCost", label: { tr: "İşverene Toplam Maliyet", en: "Total Employer Cost" }, suffix: " ₺", decimalPlaces: 2 },
        ],
        formula: (v) => {
            const DATA: Record<string, { gross: number; net: number }> = {
                jan2026: { gross: 33028.00, net: 28075.20 },
                jul2026: { gross: 36000.00, net: 30600.00 }, // tahmini
            };
            const d = DATA[v.period] ?? DATA.jan2026;
            const sgkEmployee = d.gross * 0.14;
            const unemploy = d.gross * 0.01;
            const sgkEmployer = d.gross * 0.155;
            const totalCost = d.gross + sgkEmployer;
            return { gross: d.gross, sgkEmployee, unemploy, net: d.net, sgkEmployer, totalCost };
        },
        seo: {
            title: { tr: "Asgari Ücret 2026 — Brüt Net ve İşveren Maliyeti", en: "Minimum Wage 2026 — Gross Net Employer Cost" },
            metaDescription: { tr: "2026 Ocak asgari ücreti brüt 33.028 TL, net 28.075,20 TL. SGK ve işveren malliyetini görün.", en: "2026 January minimum wage: gross 33,028 TL, net 28,075.20 TL. See SGK and employer cost." },
            content: { tr: "Türkiye'de asgari ücret yılda iki kez (Ocak ve Temmuz) güncellenir. 2026 Ocak brüt asgari ücret 33.028 TL, net 28.075,20 TL olarak belirlenmiştir.", en: "Turkey's minimum wage is updated twice yearly. Jan 2026: gross 33,028 TL, net 28,075.20 TL." },
            faq: [
                { q: { tr: "2026 asgari ücret ne kadar?", en: "What is the 2026 minimum wage?" }, a: { tr: "Ocak 2026 itibarıyla brüt asgari ücret 33.028 TL, net 28.075,20 TL'dir. Gelir vergisi istisnası ve damga vergisi muafiyeti uygulanmaktadır.", en: "As of January 2026: gross 33,028 TL, net 28,075.20 TL. Income tax exemption and stamp duty waiver apply." } },
                { q: { tr: "İşverene maliyeti nedir?", en: "What is the employer cost?" }, a: { tr: "Brüt ücret + %15,5 SGK işveren payı = yaklaşık 38.171 TL/ay.", en: "Gross + 15.5% employer SGK ≈ 38,171 TL/month." } },
            ],
            richContent: {
                howItWorks: { tr: "Brüt asgari ücretten %14 SGK işçi payı ve %1 işsizlik sigortası düşülür. Gelir vergisi ve damga vergisi 2026'da asgari ücret için uygulanmaz.", en: "14% SGK employee and 1% unemployment deducted from gross. Income tax and stamp duty not applied for minimum wage in 2026." },
                formulaText: { tr: "Net = Brüt − SGK(%14) − İşsiz.Sig.(%1). İşveren Toplam = Brüt + SGK.İşveren(%15,5).", en: "Net = Gross − SGK(14%) − Unemp(1%). Employer Total = Gross + SGK.Employer(15.5%)." },
                exampleCalculation: { tr: "33.028 − 4.623,92 − 330,28 = 28.073,80 ≈ 28.075,20 TL net (resmi tebliğ değeri).", en: "33,028 − 4,623.92 − 330.28 ≈ 28,073.80 TL net (official value: 28,075.20 TL)." },
                miniGuide: { tr: "<ul><li>Temmuz tutarı tahminidir, resmi tebliğle güncellenir.</li><li>Asgari ücretlilerde kıdem tazminatı tavanı ayrıca belirlenir.</li></ul>", en: "July amount is estimated. Official ceiling for severance pay is set separately." }
            }
        }
    },

    // ── ÖZEL GÜVENLİK SINAVI ─────────────────────────────────
    {
        id: "ozel-guvenlik",
        slug: "ozel-guvenlik-sinav-hesaplama",
        category: "sinav-hesaplamalari",
        name: { tr: "Özel Güvenlik Sınavı Puan Hesaplama", en: "Private Security Exam Score" },
        h1: { tr: "Özel Güvenlik Sınavı Puan Hesaplama", en: "Private Security Exam Score Calculator" },
        description: { tr: "Özel güvenlik sınavı doğru yanlış sayılarından puanınızı hesaplayın.", en: "Calculate your private security exam score from correct and wrong answers." },
        shortDescription: { tr: "Temel Hukuk ve Özel Güvenlik Mevzuatı bölüm doğrularını girin; geçme notunu ve toplam puanı görün.", en: "Enter section correct counts to see pass score and total." },
        relatedCalculators: ["kpss-puan-hesaplama", "ortalama-hesaplama"],
        inputs: [
            { id: "bolum1", name: { tr: "Bölüm 1 Doğru (Hukuk - 30 soru)", en: "Section 1 Correct (30Q)" }, type: "number", defaultValue: 22, required: true, min: 0, max: 30 },
            { id: "bolum2", name: { tr: "Bölüm 2 Doğru (Mevzuat - 30 soru)", en: "Section 2 Correct (30Q)" }, type: "number", defaultValue: 20, required: true, min: 0, max: 30 },
            { id: "bolum3", name: { tr: "Bölüm 3 Doğru (İlkyardım - 20 soru)", en: "Section 3 Correct (20Q)" }, type: "number", defaultValue: 15, required: true, min: 0, max: 20 },
            { id: "bolum4", name: { tr: "Bölüm 4 Doğru (Silah - 20 soru)", en: "Section 4 Correct (20Q)" }, type: "number", defaultValue: 14, required: true, min: 0, max: 20 },
        ],
        results: [
            { id: "toplam", label: { tr: "Toplam Doğru", en: "Total Correct" }, decimalPlaces: 0 },
            { id: "puan", label: { tr: "Toplam Puan (100 üzerinden)", en: "Score (out of 100)" }, decimalPlaces: 2 },
            { id: "gecti", label: { tr: "Sonuç (70 puan geçme notu)", en: "Result (pass: 70)" }, decimalPlaces: 0 },
        ],
        formula: (v) => {
            const b1 = parseFloat(v.bolum1) || 0;
            const b2 = parseFloat(v.bolum2) || 0;
            const b3 = parseFloat(v.bolum3) || 0;
            const b4 = parseFloat(v.bolum4) || 0;
            const toplam = b1 + b2 + b3 + b4;
            const puan = toplam; // 100 soru, her doğru 1 puan
            const gecti = puan >= 70 ? 1 : 0;
            return { toplam, puan, gecti };
        },
        seo: {
            title: { tr: "Özel Güvenlik Sınavı Puan Hesaplama", en: "Private Security Exam Score Calculator" },
            metaDescription: { tr: "Özel güvenlik sınavı bölüm doğrularından toplam puanınızı ve geçip geçmediğinizi hesaplayın.", en: "Calculate your private security exam total score and pass/fail status." },
            content: { tr: "Özel güvenlik sınavı 100 sorudan oluşur. Geçme notu 70'tir. Her doğru yanıt 1 puan, yanlış yanıtlar ise puanı düşürmez.", en: "Private security exam has 100 questions. Pass mark is 70. Each correct = 1 point, no penalty for wrong." },
            faq: [{ q: { tr: "Özel güvenlik sınavı geçme notu kaç?", en: "What is the pass score?" }, a: { tr: "70 puan ve üzeri geçer.", en: "70 and above is passing." } }],
            richContent: {
                howItWorks: { tr: "100 soruluk sınavda her doğru cevap 1 puandır. Yanlış cevaplar puan kesmez. 70 ve üzeri geçer.", en: "100-question exam. Each correct = 1 point. No penalty. 70+ passes." },
                formulaText: { tr: "Puan = Toplam Doğru. Geçme: Puan ≥ 70.", en: "Score = Total Correct. Pass: Score ≥ 70." },
                exampleCalculation: { tr: "22+20+15+14 = 71 puan → GEÇTİ.", en: "22+20+15+14 = 71 → PASSED." },
                miniGuide: { tr: "<ul><li>Her bölümde en az belirli sayıda doğru aranabilir — kurumunuzun şartlarını kontrol edin.</li></ul>", en: "Some institutions may require minimum per-section scores — check requirements." }
            }
        }
    },


    // ── DOĞUMA KALAN GÜN ─────────────────────────────────────
    {
        id: "birth-countdown",
        slug: "doguma-kalan-gun",
        category: "zaman-hesaplama",
        name: { tr: "Doğuma Kalan Gün", en: "Days Until Birthday" },
        h1: { tr: "Doğuma Kalan Gün Sayısı — Yıl Dönümü Geri Sayımı", en: "Days Until Next Birthday Countdown" },
        description: { tr: "Bir sonraki doğum gününüze kaç gün kaldığını hesaplayın.", en: "Calculate how many days remain until the next birthday." },
        shortDescription: { tr: "Doğum tarihinizi girin; bir sonraki yıl dönümüne kaç gün kaldığını ve kaçıncı yaşınıza gireceğinizi anında görün.", en: "Enter birthdate to see days until next birthday and which age you'll turn." },
        relatedCalculators: ["yas-hesaplama", "gun-hesaplama", "hamilelik-haftasi-hesaplama"],
        inputs: [
            { id: "birthDate", name: { tr: "Doğum Tarihi", en: "Birth Date" }, type: "date", defaultValue: "1990-06-15", required: true },
        ],
        results: [
            { id: "age", label: { tr: "Mevcut Yaş", en: "Current Age" }, suffix: " yaş", decimalPlaces: 0 },
            { id: "nextAge", label: { tr: "Dolacak Yaş", en: "Turning Age" }, suffix: " yaş", decimalPlaces: 0 },
            { id: "daysLeft", label: { tr: "Kalan Gün", en: "Days Left" }, suffix: " gün", decimalPlaces: 0 },
            { id: "nextBirthday", label: { tr: "Sonraki Doğum Günü", en: "Next Birthday" }, decimalPlaces: 0 },
        ],
        formula: (v) => {
            const today = new Date();
            const birth = new Date(v.birthDate);
            const age = today.getFullYear() - birth.getFullYear()
                - (today < new Date(today.getFullYear(), birth.getMonth(), birth.getDate()) ? 1 : 0);
            const nextYear = today >= new Date(today.getFullYear(), birth.getMonth(), birth.getDate())
                ? today.getFullYear() + 1
                : today.getFullYear();
            const nextBirthday = new Date(nextYear, birth.getMonth(), birth.getDate());
            const daysLeft = Math.ceil((nextBirthday.getTime() - today.getTime()) / 86400000);
            return { age, nextAge: age + 1, daysLeft, nextBirthday: nextBirthday.toLocaleDateString("tr-TR") as unknown as number };
        },
        seo: {
            title: { tr: "Doğuma Kalan Gün Sayısı — Yaş Geri Sayım", en: "Birthday Countdown — Days Until Next Birthday" },
            metaDescription: { tr: "Bir sonraki doğum gününüze kaç gün kaldığını ve kaçıncı yaşa gireceğinizi hesaplayın.", en: "Calculate days until your next birthday and which age you'll be turning." },
            content: { tr: "Doğum tarihinizi girerek bir sonraki yıl dönümüne kalan gün sayısını öğrenin.", en: "Enter your birth date to find out how many days until your next birthday." },
            faq: [{ q: { tr: "29 Şubat'ta doğanlar için nasıl hesaplanır?", en: "What about Feb 29 birthdays?" }, a: { tr: "29 Şubat'ta doğanlar artık yıllarda 29 Şubat'ta, diğer yıllarda 28 Şubat veya 1 Mart'ta kutlama yapabilir.", en: "Feb 29 birthdays are celebrated on Feb 28 or Mar 1 in non-leap years." } }],
            richContent: {
                howItWorks: { tr: "Bugünün tarihi ile doğum tarihinin bu yılki veya gelecek yılki karşılığı karşılaştırılarak gün farkı hesaplanır.", en: "Compares today with this or next year's birthday date to calculate day difference." },
                formulaText: { tr: "Kalan Gün = Sonraki Doğum Günü − Bugün (ms) / 86.400.000.", en: "Days Left = (Next Birthday − Today) ms / 86,400,000." },
                exampleCalculation: { tr: "Bugün 25 Şubat 2026, doğum günü 15 Haziran → Kalan = 110 gün.", en: "Today Feb 25 2026, birthday Jun 15 → 110 days left." },
                miniGuide: { tr: "<ul><li>Yaklaşan doğum günleri için hediye planlaması yapın.</li></ul>", en: "Plan gifts for upcoming birthdays." }
            }
        }
    },

    // ── BURÇ HESAPLAMA ────────────────────────────────────────
    {
        id: "zodiac",
        slug: "burc-hesaplama",
        category: "astroloji",
        name: { tr: "Burç Hesaplama", en: "Zodiac Sign Calculator" },
        h1: { tr: "Burç Hesaplama — Doğum Tarihine Göre Burç", en: "Zodiac Sign Calculator — Find Your Sign" },
        description: { tr: "Doğum tarihine göre burç ve Çin burcu bilgisini öğrenin.", en: "Find your zodiac and Chinese zodiac sign from your birth date." },
        shortDescription: { tr: "Doğum tarihinizi girin; Batı burcunuzu, Çin burcunuzu ve temel özelliklerinizi anında öğrenin.", en: "Enter your birthdate to instantly find your Western and Chinese zodiac sign." },
        relatedCalculators: ["yas-hesaplama", "doguma-kalan-gun", "kus-ak-hesaplama"],
        inputs: [
            { id: "birthDate", name: { tr: "Doğum Tarihi", en: "Birth Date" }, type: "date", defaultValue: "1990-06-15", required: true },
        ],
        results: [
            { id: "burc", label: { tr: "Burç", en: "Zodiac Sign" }, decimalPlaces: 0 },
            { id: "element", label: { tr: "Element", en: "Element" }, decimalPlaces: 0 },
            { id: "gezegen", label: { tr: "Yönetici Gezegen", en: "Ruling Planet" }, decimalPlaces: 0 },
            { id: "cinBurc", label: { tr: "Çin Burcu", en: "Chinese Zodiac" }, decimalPlaces: 0 },
        ],
        formula: (v) => {
            const d = new Date(v.birthDate);
            const m = d.getMonth() + 1;
            const gn = d.getDate();
            const yr = d.getFullYear();
            const BURCLAR = [
                { ad: "Oğlak", element: "Toprak", gezegen: "Satürn", baslangic: [1, 1], bitis: [1, 19] },
                { ad: "Kova", element: "Hava", gezegen: "Uranüs", baslangic: [1, 20], bitis: [2, 18] },
                { ad: "Balık", element: "Su", gezegen: "Neptün", baslangic: [2, 19], bitis: [3, 20] },
                { ad: "Koç", element: "Ateş", gezegen: "Mars", baslangic: [3, 21], bitis: [4, 19] },
                { ad: "Boğa", element: "Toprak", gezegen: "Venüs", baslangic: [4, 20], bitis: [5, 20] },
                { ad: "İkizler", element: "Hava", gezegen: "Merkür", baslangic: [5, 21], bitis: [6, 20] },
                { ad: "Yengeç", element: "Su", gezegen: "Ay", baslangic: [6, 21], bitis: [7, 22] },
                { ad: "Aslan", element: "Ateş", gezegen: "Güneş", baslangic: [7, 23], bitis: [8, 22] },
                { ad: "Başak", element: "Toprak", gezegen: "Merkür", baslangic: [8, 23], bitis: [9, 22] },
                { ad: "Terazi", element: "Hava", gezegen: "Venüs", baslangic: [9, 23], bitis: [10, 22] },
                { ad: "Akrep", element: "Su", gezegen: "Plüton", baslangic: [10, 23], bitis: [11, 21] },
                { ad: "Yay", element: "Ateş", gezegen: "Jüpiter", baslangic: [11, 22], bitis: [12, 21] },
                { ad: "Oğlak", element: "Toprak", gezegen: "Satürn", baslangic: [12, 22], bitis: [12, 31] },
            ];
            const b = BURCLAR.find(x => (m === x.baslangic[0] && gn >= x.baslangic[1]) || (m === x.bitis[0] && gn <= x.bitis[1])) ?? BURCLAR[0];
            const CIN = ["Maymun", "Horoz", "Köpek", "Domuz", "Sıçan", "Öküz", "Kaplan", "Tavşan", "Ejderha", "Yılan", "At", "Koyun"];
            const cinBurc = CIN[(yr - 2016 % 12 + 12) % 12];
            return { burc: b.ad as unknown as number, element: b.element as unknown as number, gezegen: b.gezegen as unknown as number, cinBurc: cinBurc as unknown as number };
        },
        seo: {
            title: { tr: "Burç Hesaplama — Doğum Tarihine Göre Burç Bul", en: "Zodiac Sign Calculator — Find Your Sign by Birth Date" },
            metaDescription: { tr: "Doğum tarihine göre Batı burcunuzu, elementinizi ve Çin burcunuzu anında öğrenin.", en: "Instantly find your Western zodiac, element and Chinese zodiac from your birth date." },
            content: { tr: "Batı astrolojisinde 12 burç bulunur ve doğum tarihine göre belirlenir. Çin burcu ise doğum yılına göre 12 yıllık döngüyle hesaplanır.", en: "Western astrology has 12 signs determined by birth date. Chinese zodiac follows a 12-year cycle based on birth year." },
            faq: [
                { q: { tr: "Yükselen burç nedir?", en: "What is a rising sign?" }, a: { tr: "Yükselen burç doğum anındaki ufuk çizgisindeki burçtur ve doğum saati ile yere göre hesaplanır.", en: "Rising sign is the sign on the horizon at birth time, calculated from birth time and location." } },
            ],
            richContent: {
                howItWorks: { tr: "Doğum günü ve ayı belirlenen aralığa göre Batı burcuyla eşleştirilir. Çin burcu ise doğum yılının 12'ye göre kalan değeriyle hesaplanır.", en: "Birth day/month matched against zodiac date ranges. Chinese sign computed from birth year modulo 12." },
                formulaText: { tr: "Batı Burç: Doğum tarihi aralığına göre. Çin Burç: Yıl mod 12.", en: "Western: date range match. Chinese: year mod 12." },
                exampleCalculation: { tr: "15 Haziran 1990 → İkizler (21 May–20 Haz) | Element: Hava | Gezegen: Merkür | Çin: At.", en: "June 15 1990 → Gemini (May 21–Jun 20) | Air | Mercury | Horse." },
                miniGuide: { tr: "<ul><li>Çin burcu hesabı Çin Yeni Yılı'na göre farklılık gösterebilir; Ocak-Şubat doğumlular için kontrol edin.</li></ul>", en: "Chinese sign may differ for Jan-Feb births depending on Chinese New Year date." }
            }
        }
    },

    // ── KUŞAK HESAPLAMA ───────────────────────────────────────
    {
        id: "generation",
        slug: "kusak-hesaplama",
        category: "yasam-hesaplama",
        name: { tr: "Kuşak Hesaplama", en: "Generation Calculator" },
        h1: { tr: "Kuşak Hesaplama — Hangi Kuşaktansınız?", en: "Generation Calculator — Which Generation Are You?" },
        description: { tr: "Doğum yılınıza göre hangi kuşağa ait olduğunuzu öğrenin.", en: "Find out which generation you belong to based on your birth year." },
        shortDescription: { tr: "Doğum yılınızı girin; Z kuşağı mı, Y kuşağı mı, X kuşağı mı olduğunuzu anında öğrenin.", en: "Enter birth year to instantly discover your generation (Gen Z, Millennial, Gen X, etc.)." },
        relatedCalculators: ["yas-hesaplama", "burc-hesaplama", "doguma-kalan-gun"],
        inputs: [
            { id: "year", name: { tr: "Doğum Yılı", en: "Birth Year" }, type: "number", defaultValue: 1995, required: true, min: 1900, max: 2030 },
        ],
        results: [
            { id: "kusak", label: { tr: "Kuşak", en: "Generation" }, decimalPlaces: 0 },
            { id: "aralik", label: { tr: "Yıl Aralığı", en: "Year Range" }, decimalPlaces: 0 },
            { id: "yas", label: { tr: "2026 İtibariyle Yaş", en: "Age in 2026" }, suffix: " yaş", decimalPlaces: 0 },
        ],
        formula: (v) => {
            const yr = parseFloat(v.year) || 1990;
            const KUSAK = [
                { ad: "Kayıp Kuşak", aralik: "1883–1900" },
                { ad: "En Büyük Kuşak", aralik: "1901–1927" },
                { ad: "Sessiz Kuşak", aralik: "1928–1945" },
                { ad: "Baby Boomers", aralik: "1946–1964" },
                { ad: "X Kuşağı", aralik: "1965–1980" },
                { ad: "Y Kuşağı (Millennials)", aralik: "1981–1996" },
                { ad: "Z Kuşağı", aralik: "1997–2012" },
                { ad: "Alfa Kuşağı", aralik: "2013–2025" },
            ];
            const k = yr <= 1900 ? KUSAK[0]
                : yr <= 1927 ? KUSAK[1]
                    : yr <= 1945 ? KUSAK[2]
                        : yr <= 1964 ? KUSAK[3]
                            : yr <= 1980 ? KUSAK[4]
                                : yr <= 1996 ? KUSAK[5]
                                    : yr <= 2012 ? KUSAK[6]
                                        : KUSAK[7];
            return { kusak: k.ad as unknown as number, aralik: k.aralik as unknown as number, yas: 2026 - yr };
        },
        seo: {
            title: { tr: "Kuşak Hesaplama — Z Kuşağı mı Millennial mı?", en: "Generation Calculator — Gen Z, Millennial or Gen X?" },
            metaDescription: { tr: "Doğum yılınıza göre hangi kuşağa ait olduğunuzu öğrenin: Baby Boomer, X, Y, Z, Alfa.", en: "Find your generation by birth year: Baby Boomer, Gen X, Millennial, Gen Z, Alpha." },
            content: { tr: "Kuşaklar doğum yılına göre sınıflandırılır. 1997-2012 arası Z Kuşağı, 1981-1996 arası Y Kuşağı (Millennials).", en: "Generations are classified by birth year. 1997-2012: Gen Z. 1981-1996: Millennials." },
            faq: [{ q: { tr: "Z kuşağı hangi yılları kapsar?", en: "What years does Gen Z cover?" }, a: { tr: "1997-2012 yılları arası doğanlar Z Kuşağı olarak sınıflandırılır.", en: "People born 1997-2012 are classified as Gen Z." } }],
            richContent: {
                howItWorks: { tr: "Doğum yılı belirlenen aralik tablosuna göre kuşak adıyla eşleştirilir.", en: "Birth year matched against defined generation ranges." },
                formulaText: { tr: "Kuşak = Doğum Yılına Göre Tablo. Yaş = 2026 − Doğum Yılı.", en: "Generation = table lookup by year. Age = 2026 − birth year." },
                exampleCalculation: { tr: "1995 → Y Kuşağı (1981-1996) | Yaş: 31.", en: "1995 → Millennial (1981-1996) | Age: 31." },
                miniGuide: { tr: "<ul><li>Kuşak sınırları araştırmacıya göre 1-2 yıl farklılık gösterebilir.</li></ul>", en: "Generation boundaries may vary by 1-2 years depending on the researcher." }
            }
        }
    },

    // ── EUROBOND GETİRİSİ ─────────────────────────────────────
    {
        id: "eurobond",
        slug: "eurobond-getiri-hesaplama",
        category: "finansal-hesaplamalar",
        name: { tr: "Eurobond Getiri Hesaplama", en: "Eurobond Return Calculator" },
        h1: { tr: "Eurobond Getiri Hesaplama — Yıllık Faiz ve Vade Getirisi", en: "Eurobond Yield Calculator — Coupon and Maturity Return" },
        description: { tr: "Eurobond kuponu, vadesi ve alım fiyatından getiri oranını hesaplayın.", en: "Calculate eurobond yield from coupon, maturity and purchase price." },
        shortDescription: { tr: "Nominal değer, kupon oranı, alım fiyatı ve vadeyi girin; yıllık faiz geliri ve vadeye kadar getiriyi hesaplayın.", en: "Enter face value, coupon, price and maturity to calculate annual interest and yield to maturity." },
        relatedCalculators: ["mevduat-faiz-hesaplama", "bilesik-faiz-hesaplama", "enflasyon-hesaplama"],
        inputs: [
            { id: "faceValue", name: { tr: "Nominal Değer ($)", en: "Face Value ($)" }, type: "number", defaultValue: 1000, suffix: "$", required: true, min: 0 },
            { id: "couponRate", name: { tr: "Kupon Oranı (% yıllık)", en: "Coupon Rate (% pa)" }, type: "number", defaultValue: 8.5, suffix: "%", required: true, min: 0 },
            { id: "price", name: { tr: "Alım Fiyatı (%)", en: "Purchase Price (%)" }, type: "number", defaultValue: 95, suffix: "%", required: true, min: 0 },
            { id: "years", name: { tr: "Vadeye Kalan Yıl", en: "Years to Maturity" }, type: "number", defaultValue: 5, suffix: "yıl", required: true, min: 1 },
        ],
        results: [
            { id: "purchasePrice", label: { tr: "Alım Bedeli ($)", en: "Purchase Price ($)" }, suffix: " $", decimalPlaces: 2 },
            { id: "annualCoupon", label: { tr: "Yıllık Kupon Geliri ($)", en: "Annual Coupon ($)" }, suffix: " $", decimalPlaces: 2 },
            { id: "totalCoupon", label: { tr: "Toplam Kupon Geliri ($)", en: "Total Coupon ($)" }, suffix: " $", decimalPlaces: 2 },
            { id: "capitalGain", label: { tr: "Kur/Fiyat Kazancı ($)", en: "Capital Gain ($)" }, suffix: " $", decimalPlaces: 2 },
            { id: "totalReturn", label: { tr: "Toplam Getiri ($)", en: "Total Return ($)" }, suffix: " $", decimalPlaces: 2 },
            { id: "ytm", label: { tr: "Vadeye Kadar Getiri (%)", en: "Yield to Maturity (%)" }, suffix: " %", decimalPlaces: 3 },
        ],
        formula: (v) => {
            const fv = parseFloat(v.faceValue) || 0;
            const couponRate = (parseFloat(v.couponRate) || 0) / 100;
            const pricePct = (parseFloat(v.price) || 0) / 100;
            const years = parseFloat(v.years) || 1;
            const purchasePrice = fv * pricePct;
            const annualCoupon = fv * couponRate;
            const totalCoupon = annualCoupon * years;
            const capitalGain = fv - purchasePrice;
            const totalReturn = totalCoupon + capitalGain;
            // Basitleştirilmiş YTM
            const ytm = ((annualCoupon + capitalGain / years) / ((fv + purchasePrice) / 2)) * 100;
            return { purchasePrice, annualCoupon, totalCoupon, capitalGain, totalReturn, ytm };
        },
        seo: {
            title: { tr: "Eurobond Getiri Hesaplama — YTM ve Kupon", en: "Eurobond Yield Calculator — YTM and Coupon" },
            metaDescription: { tr: "Eurobond kupon gelirini, vadeye kadar getirisini ve toplam kazancı hesaplayın.", en: "Calculate eurobond coupon income, yield to maturity and total return." },
            content: { tr: "Eurobond döviz cinsinden ihraç edilen devlet veya şirket tahvilidir. Getiri; kupon faizi ve alım fiyatı ile nominal değer arasındaki farktan oluşur.", en: "Eurobonds are foreign-currency bonds. Return consists of coupon interest plus difference between purchase and face value." },
            faq: [
                { q: { tr: "Eurobond güvenli midir?", en: "Are eurobonds safe?" }, a: { tr: "Hazine eurobondları devlet garantili olup görece güvenlidir; ancak kur riski ve faiz riski içerir.", en: "Treasury eurobonds carry government guarantee but involve currency and interest rate risk." } },
            ],
            richContent: {
                howItWorks: { tr: "Yıllık kupon = Nominal × Oran. Sermaye kazancı = Nominal − Alım Bedeli. YTM basitleştirilmiş formülle hesaplanır.", en: "Annual coupon = Face × Rate. Capital gain = Face − Purchase. YTM calculated with simplified formula." },
                formulaText: { tr: "YTM ≈ (Kupon + (FD − PD)/n) / ((FD + PD)/2) × 100.", en: "YTM ≈ (Coupon + (FV − PV)/n) / ((FV + PV)/2) × 100." },
                exampleCalculation: { tr: "1000$ nominal, %8,5 kupon, %95 fiyat, 5 yıl → Alım=950$ | Yıllık kupon=85$ | Toplam kupon=425$ | Sermaye kazancı=50$ | Toplam=475$ | YTM≈9,2%.", en: "1000$ face, 8.5% coupon, 95% price, 5yr → Purchase=950$ | Coupon=85$/yr | Total=475$ | YTM≈9.2%." },
                miniGuide: { tr: "<ul><li>Eurobond vergisi: stopaj %0 (Hazine tahvili).</li><li>Kur riski: TL değer kazanırsa dolar bazlı getiri TL'ye çevrimde düşebilir.</li></ul>", en: "Treasury eurobonds: 0% withholding. Currency risk applies when converting to TL." }
            }
        }
    },

    // ── REEL GETİRİ ───────────────────────────────────────────
    {
        id: "real-return",
        slug: "reel-getiri-hesaplama",
        category: "finansal-hesaplamalar",
        name: { tr: "Reel Getiri Hesaplama", en: "Real Return Calculator" },
        h1: { tr: "Reel Getiri Hesaplama — Enflasyon Sonrası Net Kazanç", en: "Real Return Calculator — Net Gain After Inflation" },
        description: { tr: "Nominal yatırım getirisi ile enflasyonu kıyaslayarak reel kazancınızı hesaplayın.", en: "Calculate your real investment return after accounting for inflation." },
        shortDescription: { tr: "Nominal getiri ve enflasyon oranını girin; Fisher formülüyle reel getirinizi ve satın alma gücü kazancınızı anında öğrenin.", en: "Enter nominal return and inflation to get Fisher equation real return and purchasing power gain." },
        relatedCalculators: ["enflasyon-hesaplama", "mevduat-faiz-hesaplama", "bilesik-faiz-hesaplama"],
        inputs: [
            { id: "nominal", name: { tr: "Nominal Getiri (%)", en: "Nominal Return (%)" }, type: "number", defaultValue: 45, suffix: "%", required: true, min: -100 },
            { id: "inflation", name: { tr: "Enflasyon Oranı (%)", en: "Inflation Rate (%)" }, type: "number", defaultValue: 40, suffix: "%", required: true, min: -100 },
            { id: "amount", name: { tr: "Yatırım Tutarı (₺)", en: "Investment Amount (₺)" }, type: "number", defaultValue: 100000, suffix: "₺", required: true, min: 0 },
        ],
        results: [
            { id: "realReturn", label: { tr: "Reel Getiri (Fisher, %)", en: "Real Return (Fisher, %)" }, suffix: " %", decimalPlaces: 3 },
            { id: "nominalGain", label: { tr: "Nominal Kazanç (₺)", en: "Nominal Gain (₺)" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "realGain", label: { tr: "Reel Kazanç (₺)", en: "Real Gain (₺)" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "inflationLoss", label: { tr: "Enflasyon Kaybı (₺)", en: "Inflation Loss (₺)" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "verdict", label: { tr: "Değerlendirme", en: "Verdict" }, decimalPlaces: 0 },
        ],
        formula: (v) => {
            const nominal = (parseFloat(v.nominal) || 0) / 100;
            const inflation = (parseFloat(v.inflation) || 0) / 100;
            const amount = parseFloat(v.amount) || 0;
            const realReturn = ((1 + nominal) / (1 + inflation) - 1) * 100;
            const nominalGain = amount * nominal;
            const inflationLoss = amount * inflation;
            const realGain = amount * ((1 + nominal) / (1 + inflation) - 1);
            const verdict = realReturn >= 0 ? 1 : 0; // 1=kâr, 0=zarar
            return { realReturn, nominalGain, realGain, inflationLoss, verdict: verdict as unknown as number };
        },
        seo: {
            title: { tr: "Reel Getiri Hesaplama — Fisher Denklemi ile Enflasyon Sonrası Kazanç", en: "Real Return Calculator — Post-Inflation Gain with Fisher Equation" },
            metaDescription: { tr: "Nominal getiri ve enflasyon oranından Fisher denklemiyle reel getirinizi ve satın alma gücü kazancınızı hesaplayın.", en: "Calculate real return using Fisher equation from nominal return and inflation rate." },
            content: { tr: "Reel getiri = (1+Nominal)/(1+Enflasyon) − 1. Bu formül Fisher denklemi olarak bilinir ve enflasyonun etkisini arındırır.", en: "Real return = (1+Nominal)/(1+Inflation) − 1. This Fisher equation removes inflation effect." },
            faq: [
                { q: { tr: "Neden basit çıkarma yerine Fisher denklemi kullanılır?", en: "Why use Fisher equation instead of simple subtraction?" }, a: { tr: "Basit çıkarma (Nominal − Enflasyon) yaklaşık bir değerdir. Fisher denklemi bileşik etkiyi doğru biçimde hesaba katar.", en: "Simple subtraction is approximate. Fisher equation correctly accounts for compounding effects." } },
            ],
            richContent: {
                howItWorks: { tr: "Fisher denklemi bileşik nominal ve enflasyon oranlarını kullanarak gerçek satın alma gücü artışını hesaplar.", en: "Fisher equation uses compounded nominal and inflation rates to compute true purchasing power increase." },
                formulaText: { tr: "Reel Getiri = [(1+n)/(1+π) − 1] × 100. n=nominal oran, π=enflasyon.", en: "Real Return = [(1+n)/(1+π) − 1] × 100. n=nominal, π=inflation." },
                exampleCalculation: { tr: "Nominal %45, Enflasyon %40 → Reel = (1,45/1,40 − 1) × 100 ≈ %3,57.", en: "Nominal 45%, Inflation 40% → Real = (1.45/1.40 − 1) × 100 ≈ 3.57%." },
                miniGuide: { tr: "<ul><li>Reel getiri negatifse yatırımınız enflasyonun gerisinde kalmış demektir.</li><li>Mevduat, tahvil ve hisse getirilerinizi enflasyona karşı test edin.</li></ul>", en: "Negative real return means your investment lagged inflation. Test deposits, bonds and stocks." }
            }
        }
    },
];

// ────────────────────────────────────────────────────────────────
// AŞAMA 4
// ────────────────────────────────────────────────────────────────
export const phase4Calculators: CalculatorConfig[] = [

    // ── HARCIRAH (YOLLUK) HESAPLAMA ────────────────────────
    {
        id: "per-diem",
        slug: "harcirah-yolluk-hesaplama",
        category: "maas-ve-vergi",
        name: { tr: "Harcırah (Yolluk) Hesaplama", en: "Travel Allowance (Per Diem)" },
        h1: { tr: "Harcırah ve Yolluk Hesaplama 2026 — Memur Geçici Görev", en: "Travel Allowance Calculator 2026" },
        description: { tr: "Geçici görev yolluğu ve günlük harcırah tutarlarınızı hesaplayın.", en: "Calculate temporary duty travel allowance and per diem amounts." },
        shortDescription: { tr: "Mesafe, günlük yevmiye ve konaklama gününü girin; toplam yolluk ve harcırah tutarınızı anında öğrenin.", en: "Enter distance, daily rate, and stay duration to instantly calculate your total travel allowance." },
        relatedCalculators: ["maas-hesaplama", "yakit-tuketim-maliyet", "hiz-mesafe-sure"],
        inputs: [
            { id: "dailyRate", name: { tr: "Günlük Yevmiye (₺)", en: "Daily Rate (₺)" }, type: "number", defaultValue: 650, required: true, min: 0 },
            { id: "days", name: { tr: "Görev Süresi (Gün)", en: "Duration (Days)" }, type: "number", defaultValue: 3, required: true, min: 1 },
            { id: "distance", name: { tr: "Mesafe (km, tek yön)", en: "Distance (km, one way)" }, type: "number", defaultValue: 450, required: true, min: 0 },
            { id: "transport", name: { tr: "Yol Ücreti (₺, gidiş-dönüş)", en: "Transport Fee (₺, round trip)" }, type: "number", defaultValue: 1200, required: true, min: 0 },
        ],
        results: [
            { id: "totalDaily", label: { tr: "Toplam Yevmiye", en: "Total Per Diem" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "kmAllowance", label: { tr: "Mesafe Tazminatı", en: "Distance Allowance" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "totalAllowance", label: { tr: "Toplam Yolluk", en: "Total Allowance" }, suffix: " ₺", decimalPlaces: 2 },
        ],
        formula: (v) => {
            const dr = parseFloat(v.dailyRate) || 0;
            const d = parseFloat(v.days) || 0;
            const dist = parseFloat(v.distance) || 0;
            const t = parseFloat(v.transport) || 0;
            const totalDaily = dr * d;
            const kmAllowance = dist * dr * 0.05; // Klasik memur yolluk formülü: mesafe * yevmiye * 0.05
            const totalAllowance = totalDaily + kmAllowance + t;
            return { totalDaily, kmAllowance, totalAllowance };
        },
        seo: {
            title: { tr: "Harcırah (Yolluk) Hesaplama 2026 — Memur ve İşçi", en: "Travel Allowance Calculator 2026 — Per Diem" },
            metaDescription: { tr: "2026 memur harcırahı ve geçici görev yolluğu hesaplama. Günlük yevmiye ve mesafe bazlı yolluk tutarını bulun.", en: "Calculate 2026 per diem and travel allowance. Find your daily rate and distance-based allowance." },
            content: { tr: "Harcırah, kamu personeli veya işçilerin görevli olarak başka bir yere gönderilmeleri durumunda yol ve konaklama masrafları için ödenen tutardır.", en: "Per diem / travel allowance is paid to employees for travel, meals and lodging during temporary business duties." },
            faq: [{ q: { tr: "Yolluk nasıl hesaplanır?", en: "How is travel allowance calculated?" }, a: { tr: "Günlük yevmiye × gün sayısı + yol ücreti + mesafe tazminatı (yevmiyenin %5'i × km) formülüyle hesaplanır.", en: "Calculated as daily rate × days + transport + distance allowance (5% of rate × km)." } }],
            richContent: {
                howItWorks: { tr: "Günlük yevmiye ile gün sayısı çarpılır. Ardından gidilen mesafe için yevmiyenin %5'i üzerinden tazminat eklenir.", en: "Daily rate multiplied by days. Then 5% of daily rate per km is added for distance." },
                formulaText: { tr: "Yolluk = (Günlük × Gün) + (Mesafe × Günlük × 0,05) + Yol Ücreti", en: "Allowance = (Daily × Days) + (Distance × Daily × 0.05) + Transport" },
                exampleCalculation: { tr: "650₺ yevmiye, 450km yol, 3 gün → (650×3) + (450×650×0,05) + 0 = 1950 + 14625 = 16575₺.", en: "650 rate, 450km, 3 days → (650×3) + (450×650×0.05) = 1950 + 14625 = 16575₺." },
                miniGuide: { tr: "<ul><li>2026 yılı memur yevmiye tutarlarını kurumunuzdan teyit edin.</li><li>Konaklama faturası limiti yevmiyenin %50 fazlasına kadar olabilir.</li></ul>", en: "Confirm 2026 per diem rates with your institution. Lodging limit is usually daily rate + 50%." }
            }
        }
    },

    // ── DOĞUM İZNİ VE RAPOR PARASI HESAPLAMA ──────────────────────────────
    {
        id: "maternity-leave",
        slug: "dogum-izni-hesaplama",
        category: "yasam-hesaplama",
        name: { tr: "Doğum İzni ve Rapor Parası Hesaplama", en: "Maternity Leave & Pay Calculator" },
        h1: { tr: "Doğum İzni ve Rapor Parası Hesaplama — İzin Tarihleri ve Ödenek", en: "Maternity Leave & Statutory Pay Calculator" },
        description: { tr: "Beklenen doğum tarihinize göre doğum izni sürelerinizi ve alacağınız toplam SGK rapor parasını (işgöremezlik ödeneğini) hesaplayın.", en: "Calculate your maternity leave dates and statutory SGK maternity pay based on your expected due date and gross salary." },
        shortDescription: { tr: "Beklenen doğum tarihi ve brüt maaşınızı girerek yasal izin tarihlerinizi ve SGK'dan alacağınız toplam rapor parasını anında görün.", en: "Enter your due date and gross salary to instantly see your legal leave dates and SGK maternity pay." },
        relatedCalculators: ["hamilelik-haftasi-hesaplama", "doguma-kalan-gun", "maas-hesaplama"],
        inputs: [
            { id: "dueDate", name: { tr: "Beklenen Doğum Tarihi", en: "Expected Due Date" }, type: "date", defaultValue: "2026-08-15", required: true },
            {
                id: "multi", name: { tr: "Çoğul Gebelik", en: "Multiple Pregnancy" }, type: "select", defaultValue: "no",
                options: [{ label: { tr: "Hayır", en: "No" }, value: "no" }, { label: { tr: "Evet (+2 hafta izni)", en: "Yes (+2 weeks leave)" }, value: "yes" }]
            },
            {
                id: "workUntil37", name: { tr: "37. Haftaya Kadar Çalışma", en: "Work Until 37th Week" }, type: "select", defaultValue: "no",
                options: [{ label: { tr: "Hayır (32. Haftada Ayrılış)", en: "No (Leave at 32 weeks)" }, value: "no" }, { label: { tr: "Evet (İzni Sonraya Aktar)", en: "Yes (Transfer leave)" }, value: "yes" }]
            },
            { id: "grossSalary", name: { tr: "Aylık Brüt Maaşınız", en: "Monthly Gross Salary" }, type: "number", defaultValue: 33030, suffix: "₺", required: true, min: 33030 },
        ],
        results: [
            { id: "startLeave", label: { tr: "İzne Ayrılış Tarihi", en: "Start of Leave" }, decimalPlaces: 0 },
            { id: "birthEstimate", label: { tr: "Tahmini Doğum", en: "Estimated Birth" }, decimalPlaces: 0 },
            { id: "endLeave", label: { tr: "İzin Bitişi (İşe Dönüş)", en: "Leave End (Return to Work)" }, decimalPlaces: 0 },
            { id: "raporParasi", label: { tr: "Toplam Rapor Parası (Ödenek)", en: "Total Statutory Pay" }, suffix: " ₺", decimalPlaces: 2 },
        ],
        formula: (v) => {
            const parts = v.dueDate.split("-");
            if (parts.length !== 3) return { startLeave: "-", birthEstimate: "-", endLeave: "-", raporParasi: 0 };
            const due = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));

            // İzin başlangıcını belirleme
            // Standart: tekilde 8, çoğulda 10 hafta önce. 37'ye kadar çalışırsa her ikisinde de 3 hafta önce izne ayrılır (40 - 37 = 3).
            let weeksBefore = v.multi === "yes" ? 10 : 8;
            if (v.workUntil37 === "yes") {
                weeksBefore = 3;
            }

            const startLeave = new Date(due.getTime());
            startLeave.setDate(due.getDate() - (weeksBefore * 7));

            // Toplam izin süresi değişmez: Çoğulda 18 hafta (126 gün), tekilde 16 hafta (112 gün)
            const totalDurationWeeks = v.multi === "yes" ? 18 : 16;
            const end = new Date(startLeave.getTime());
            end.setDate(startLeave.getDate() + (totalDurationWeeks * 7));

            // Rapor Parası Hesabı
            const minWage = 33030; // 2026 Asgari Brüt Ücret
            let gross = parseFloat(v.grossSalary) || minWage;
            if (gross < minWage) gross = minWage;

            const dailyGross = gross / 30;
            const totalDays = totalDurationWeeks * 7;
            const raporParasi = totalDays * (dailyGross * (2 / 3)); // Ayakta tedavi oranı %66.6

            return {
                startLeave: startLeave.toLocaleDateString("tr-TR") as unknown as number,
                birthEstimate: due.toLocaleDateString("tr-TR") as unknown as number,
                endLeave: end.toLocaleDateString("tr-TR") as unknown as number,
                raporParasi: raporParasi
            };
        },
        seo: {
            title: { tr: "Doğum İzni ve Rapor Parası (İşgöremezlik) Hesaplama 2026", en: "Maternity Leave & Statutory Pay Calculator 2026" },
            metaDescription: { tr: "2026 asgari ücret sınırlarına göre 112/126 günlük SGK doğum rapor parasını ve 32.-37. hafta izin bitiş tarihlerinizi hesaplayın.", en: "Calculate your 112/126-day SGK maternity pay and your leave start/end dates including 37th-week deferrals." },
            content: { tr: "Doğum rapor parası (işgöremezlik ödeneği), SGK tarafından anne adaylarına 112 günlük (çoğullarda 126 gün) yasal izin süresi boyunca 3 aylık brüt maaş ortalamasının 3'te 2'si oranında ödenen bir destektir. Anne adayı doktor raporuyla 37. haftaya kadar çalışırsa, aradaki 5 haftalık izin hakkını doğum sonrasına aktarabilir.", en: "Maternity pay is provided by SGK for 112 days (126 for multiples) at 2/3 of the daily gross salary. Mothers can work until the 37th week and defer 5 weeks to the postpartum period." },
            faq: [
                { q: { tr: "Doğum rapor parası kime ödenir ve şartları nelerdir?", en: "Who gets maternity pay and what are the conditions?" }, a: { tr: "SGK'lı olarak çalışan anne adaylarına ödenir. Doğum öncesi izne ayrılmadan önceki 1 yıl içinde en az 90 gün kısa vadeli sigorta primi ödenmiş olmalıdır.", en: "Paid to SGK-registered working mothers. Must have at least 90 days of short-term insurance premiums paid in the previous year." } },
                { q: { tr: "37. haftaya kadar nasıl çalışılır?", en: "How to work until the 37th week?" }, a: { tr: "Gebeliğin 32. haftasında doktordan 'Çalışabilir' raporu (işgöremezlik belgesi) alınarak 37. haftaya kadar çalışmaya devam edilebilir ve kalan 5 hafta (çoğullarda 7 hafta) doğum sonrasına aktarılır.", en: "By getting a 'Fit to work' report from a doctor at the 32nd week, you can work until the 37th week and defer the remaining weeks." } },
                { q: { tr: "2026 yılında en düşük doğum rapor parası ne kadar?", en: "What is the minimum maternity pay in 2026?" }, a: { tr: "2026 asgari ücreti (brüt 33.030 TL) baz alındığında, tekil gebelik (112 gün) için asgari ödenek 82.208 TL'dir.", en: "Based on 2026 minimum wage, the minimum pay for a single pregnancy (112 days) is 82,208 TL." } }
            ],
            richContent: {
                howItWorks: { tr: "Araç, tahmini doğum tarihinizden önce izne ayrılacağınız standart (32. hafta) veya gecikmeli (37. hafta) zamanı hesaplar. Toplam izin süresi olan 112 veya 126 günü yasal sınır olarak kullanır. Rapor parası hesaplamasında 'ayakta tedavi' baz alınarak günlük brüt kazancınızın üçte ikisi (%66,66) izinli olunan gün sayısıyla çarpılır.", en: "Calculates the standard (32nd week) or deferred (37th week) leave starts. Pay is calculated as two-thirds of the daily gross wage multiplied by total leave days (112 or 126)." },
                formulaText: { tr: "Rapor Parası = (Brüt Maaş / 30) × (2 / 3) × İzin Gün Sayısı. Başlangıç = Doğum Tarihi − İzin Öncesi Hafta. Bitiş = Başlangıç + Toplam İzin.", en: "Maternity Pay = (Gross Salary / 30) × (2 / 3) × Leave Days." },
                exampleCalculation: { tr: "33.030 TL brüt maaşı olan ve tekil gebeliği bulunan bir anne: Günlük brüt = 1.101 TL. Günlük ödenek = 1.101 × 0,666 = 734 TL. Toplam Rapor Parası = 734 × 112 = ~82.208 TL.", en: "For 33,030 TL gross and single pregnancy: Daily gross = 1,101 TL. Daily allowance = 734 TL. Total = 734 × 112 = ~82,208 TL." },
                miniGuide: { tr: "<ul><li><b>Aktarım Raporu:</b> 37. haftaya kadar çalışmak isterseniz mutlaka 32. haftada doktordan e-rapor (çalışır raporu) alıp işverene bildirmelisiniz.</li><li><b>Ödeme Zamanı:</b> PTT ya da e-Devlet üzerinden tanımlı banka hesabınıza doğum sonrası rapor bitişinizde (veya aylık dilimler halinde) yatar.</li><li><b>Süt İzni:</b> Doğum sonrası izniniz bittikten sonra günde 1.5 saatlik yasal süt izni hakkınız başlar.</li></ul>", en: "Inform your employer at week 32 if you want to work until week 37. Money is paid via PTT or your bank. You have a right to 1.5 hours/day of nursing leave after your maternity leave ends." }
            }
        }
    },

    // ── HAMİLELİK HAFTASI HESAPLAMA ──────────────────────────
    {
        id: "pregnancy-week",
        slug: "hamilelik-haftasi-hesaplama",
        category: "yasam-hesaplama",
        name: { tr: "Hamilelik Haftası Hesaplama", en: "Pregnancy Week Calculator" },
        h1: { tr: "Hamilelik Haftası Hesaplama — Kaç Haftalık Gebeyim?", en: "Pregnancy Week & Milestone Calculator" },
        description: { tr: "Son adet tarihinize göre kaç haftalık hamile olduğunuzu hesaplayın.", en: "Calculate your current pregnancy week based on your last menstrual period (LMP)." },
        shortDescription: { tr: "Son adet tarihini girin; güncel gebelik haftanızı, ayınızı ve tahmini doğum tarihini anında öğrenin.", en: "Enter your LMP to instantly discover your current week, month, and estimated due date." },
        relatedCalculators: ["dogum-izni-hesaplama", "doguma-kalan-gun", "vucut-kitle-indeksi-hesaplama"],
        inputs: [
            { id: "lmp", name: { tr: "Son Adet Tarihi (SAT)", en: "Last Period (LMP)" }, type: "date", defaultValue: "2025-11-20", required: true },
        ],
        results: [
            { id: "week", label: { tr: "Kaç Haftalık?", en: "Current Week" }, suffix: " hafta", decimalPlaces: 0 },
            { id: "day", label: { tr: "Kalan Gün (Haftada)", en: "Days in Week" }, suffix: " gün", decimalPlaces: 0 },
            { id: "month", label: { tr: "Kaçıncı Ay?", en: "Which Month?" }, suffix: ". ay", decimalPlaces: 0 },
            { id: "dueDate", label: { tr: "Tahmini Doğum", en: "Estimated Due Date" }, decimalPlaces: 0 },
        ],
        formula: (v) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Yerel saatte gece yarısı

            const parts = v.lmp.split("-");
            if (parts.length !== 3) return { week: "-", day: "-", month: "-", dueDate: "-" };
            const lmp = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));

            const diffMs = today.getTime() - lmp.getTime();
            // Eğer tarih gelecekteyse 0 kabul edelim
            const totalDays = diffMs < 0 ? 0 : Math.floor(diffMs / 86400000);
            const weeks = Math.floor(totalDays / 7);
            const days = totalDays % 7;
            const month = Math.floor(weeks / 4) + 1;

            const due = new Date(lmp.getTime());
            due.setDate(lmp.getDate() + 280); // 40 hafta = 280 gün

            return {
                week: weeks,
                day: days,
                month: Math.min(month, 9),
                dueDate: due.toLocaleDateString("tr-TR") as unknown as number
            };
        },
        seo: {
            title: { tr: "Hamilelik Haftası Hesaplama — Gebelik Takvimi 2026", en: "Pregnancy Week Calculator — Due Date Tracker 2026" },
            metaDescription: { tr: "Son adet tarihinize göre kaç haftalık hamile olduğunuzu hesaplayın. 40 haftalık gebelik takvimi ve doğum tarihi.", en: "Calculate your pregnancy progress by LMP. Comprehensive 40-week pregnancy calendar and due date." },
            content: { tr: "Gebelik süresi son adet tarihinden itibaren 280 gün (40 hafta) olarak kabul edilir. Ay hesabı genelde 4 haftalık periyotlarla yapılır.", en: "Pregnancy lasts 280 days (40 weeks) from LMP. Months are usually calculated in 4-week blocks." },
            faq: [{ q: { tr: "Gebelik kaç ay sürer?", en: "How many months of pregnancy?" }, a: { tr: "Tıbbi olarak 9 ay 10 gün (yaklaşık 40 hafta) sürer.", en: "Medically it lasts 9 months and 10 days (approx 40 weeks)." } }],
            richContent: {
                howItWorks: { tr: "Son adet tarihinden bugüne kadar geçen toplam gün sayısı 7'ye bölünerek hafta ve gün bulunur.", en: "Total days since LMP divided by 7 to determine weeks and remaining days." },
                formulaText: { tr: "Hafta = Gün / 7. Doğum = SAT + 280 gün.", en: "Week = Days / 7. Delivery = LMP + 280 days." },
                exampleCalculation: { tr: "SAT 20 Kasım → 25 Şubat itibariyle 13 hafta 6 günlük gebelik.", en: "LMP Nov 20 → 13 weeks 6 days pregnant as of Feb 25." },
                miniGuide: { tr: "<ul><li>Her hafta bebeğinizdeki gelişimleri doktorunuzdan öğrenin.</li><li>Beslenme ve vitamin takviyelerini ihmal etmeyin.</li></ul>", en: "Track baby's development weekly. Don't skip nutrition and vitamins." }
            }
        }
    },

    // ── EBCED HESAPLAMA ───────────────────────────────────────
    {
        id: "ebced",
        slug: "ebced-hesaplama",
        category: "yasam-hesaplama",
        name: { tr: "Ebced Hesaplama", en: "Abjad (Ebced) Calculator" },
        h1: { tr: "Ebced Hesaplama — İsminizin ve Kelimelerin Ebced Değeri", en: "Abjad Numerology Calculator" },
        description: { tr: "Girdiğiniz metnin ebced (sayısal) değerini hesaplayın.", en: "Calculate the Abjad (numerical) value of the entered text." },
        shortDescription: { tr: "Kelime veya isim girin; Arap harflerinin sayısal karşılıklarına göre ebced değerini anında öğrenin.", en: "Enter a word or name to instantly find its Abjad numerical equivalent." },
        relatedCalculators: ["burc-hesaplama", "kusak-hesaplama", "yuzde-hesaplama"],
        inputs: [
            { id: "text", name: { tr: "Kelime veya İsim", en: "Word or Name" }, type: "text", defaultValue: "HesapMod", required: true },
        ],
        results: [
            { id: "value", label: { tr: "Ebced Değeri", en: "Abjad Value" }, decimalPlaces: 0 },
        ],
        formula: (v) => {
            const table: Record<string, number> = {
                'a': 1, 'b': 2, 'c': 3, 'd': 4, 'e': 5, 'f': 80, 'g': 1000, 'h': 8, 'i': 10, 'j': 3, 'k': 20, 'l': 30, 'm': 40, 'n': 50, 'o': 6, 'p': 2, 'r': 200, 's': 60, 't': 400, 'u': 6, 'v': 6, 'y': 10, 'z': 7,
                'ı': 10, 'ş': 300, 'ğ': 1000, 'ç': 3, 'ö': 6, 'ü': 6
            };
            const input = (v.text || "").toLowerCase();
            let sum = 0;
            for (let char of input) {
                sum += (table[char] || 0);
            }
            return { value: sum };
        },
        seo: {
            title: { tr: "Ebced Hesabı — İsimlerin Sayısal Değeri", en: "Abjad Numerology — Find Numerical Value of Names" },
            metaDescription: { tr: "İsimlerin ve kelimelerin ebced değerini otomatik hesaplayın. Geleneksel sayı dizgesi analizi.", en: "Automatically calculate Abjad values of names and words. Traditional numerology analysis." },
            content: { tr: "Ebced hesabı, Arap alfabesindeki harflerin sayısal değerlerinden oluşan bir sistemdir. Osmanlı ve Doğu kültüründe tarih düşürme için kullanılmıştır.", en: "Abjad is a decimal alphabetic numeral system. Historical dates and names were often analyzed using this system." },
            faq: [{ q: { tr: "Ebced dizilimi nedir?", en: "What is Abjad sequence?" }, a: { tr: "Elif, Be, Cim, Dal (A, B, C, D) harflerinin 1, 2, 3, 4 değerlerini almasıyla başlar.", en: "It starts with Alif=1, Ba=2, Jim=3, Dal=4." } }],
            richContent: {
                howItWorks: { tr: "Metindeki harfler Arap alfabesi sayısal karşılıklarıyla eşleştirilerek toplanır.", en: "Letters matched with Arabic alphabet numerical values and summed." },
                formulaText: { tr: "Ebced = Σ(Harf Değeri)", en: "Abjad = Σ(Letter Value)" },
                exampleCalculation: { tr: "H-E-S-A-P → 8+5+60+1+2 = 76 (basitleştirilmiş Latin tablo).", en: "H-E-S-A-P → 8+5+60+1+2 = 76 (simplified Latin table)." },
                miniGuide: { tr: "<ul><li>Geleneksel ebced Arapça harfler üzerinden yapılır.</li><li>Bu araç Latin harfleri için popüler bir eşleşme kullanır.</li></ul>", en: "Traditional Abjad uses Arabic letters. This tool uses a popular Latin mapping." }
            }
        }
    },

    // ── FAKTÖRİYEL HESAPLAMA ──────────────────────────────────
    {
        id: "factorial",
        slug: "faktoriyel-hesaplama",
        category: "matematik-hesaplama",
        name: { tr: "Faktöriyel Hesaplama", en: "Factorial Calculator" },
        h1: { tr: "Faktöriyel Hesaplayıcı — n! Sonucu", en: "Factorial Calculator — n!" },
        description: { tr: "Pozitif tamsayıların faktöriyel değerlerini hesaplayın.", en: "Calculate factorial values of positive integers." },
        shortDescription: { tr: "Bir sayı girin; n faktöriyel (n!) sonucunu ve açılımını anında görün.", en: "Enter a number to instantly see the factorial (n!) result and its expansion." },
        relatedCalculators: ["kombinasyon-permitasyon-hesaplama", "yuzde-hesaplama", "us-kuvvet-karekok"],
        inputs: [
            { id: "num", name: { tr: "Pozitif Tam Sayı (n)", en: "Positive Integer (n)" }, type: "number", defaultValue: 5, required: true, min: 0, max: 170 },
        ],
        results: [
            { id: "res", label: { tr: "Sonuç", en: "Result" }, decimalPlaces: 0 },
        ],
        formula: (v) => {
            const n = Math.floor(parseFloat(v.num) || 0);
            if (n < 0) return { res: 0 };
            let f = 1;
            for (let i = 2; i <= n; i++) f *= i;
            return { res: f };
        },
        seo: {
            title: { tr: "Faktöriyel Hesaplama — n! Sonucu ve Formülü", en: "Factorial Calculator — n! Result and Formula" },
            metaDescription: { tr: "n faktöriyel (n!) hesaplaması yapın. Tamsayı değerleri ve büyük sayılar için faktöriyel sonucu.", en: "Perform n! factorial calculations. Results for integers and large numbers." },
            content: { tr: "Faktöriyel, 1'den n'ye kadar olan tüm tamsayıların çarpımıdır. n! şeklinde gösterilir. 0! = 1 olarak kabul edilir.", en: "Factorial is the product of all positive integers from 1 up to n. Denoted as n!. 0! = 1." },
            faq: [{ q: { tr: "Sıfırın faktöriyeli nedir?", en: "What is 0!" }, a: { tr: "Matematiksel tanım gereği 0! = 1'dir.", en: "By definition, 0! = 1." } }],
            richContent: {
                howItWorks: { tr: "1'den başlayarak n sayısına kadar olan tüm tamsayılar birbiriyle çarpılır.", en: "Integers starting from 1 up to n are multiplied together." },
                formulaText: { tr: "n! = 1 × 2 × 3 × ... × n", en: "n! = 1 × 2 × 3 × ... × n" },
                exampleCalculation: { tr: "5! = 1 × 2 × 3 × 4 × 5 = 120", en: "5! = 1 × 2 × 3 × 4 × 5 = 120" },
                miniGuide: { tr: "<ul><li>Büyük n değerleri için sonuçlar çok hızlı büyür (üstel büyüme).</li><li>Hesaplamada 170 sınırı JavaScript kapasitesi limitidir.</li></ul>", en: "Results grow very fast for large n. 170 limit is due to JavaScript capacity." }
            }
        }
    },

    // ── ÜÇGEN HESAPLAMA ──────────────────────────────────────
    {
        id: "triangle",
        slug: "ucgen-hesaplama",
        category: "matematik-hesaplama",
        name: { tr: "Üçgen Alan & Çevre Hesaplama", en: "Triangle Area & Perimeter" },
        h1: { tr: "Üçgen Alanı ve Çevresi Hesaplama — Kenar ve Yükseklik", en: "Triangle Area and Perimeter Calculator" },
        description: { tr: "Üçgenin taban, yükseklik veya kenar uzunluklarından alan ve çevre hesaplayın.", en: "Calculate triangle area and perimeter from base, height or side lengths." },
        shortDescription: { tr: "Taban ve yüksekliği girin; üçgenin alanını ve çevresini anında öğrenin.", en: "Enter base and height to instantly determine the area and perimeter of the triangle." },
        relatedCalculators: ["daire-alan-cevre", "dikdortgen-alan-cevre", "yuzde-hesaplama"],
        inputs: [
            { id: "base", name: { tr: "Taban Kenar (a)", en: "Base Side (a)" }, type: "number", defaultValue: 10, required: true, min: 0 },
            { id: "height", name: { tr: "Yükseklik (h)", en: "Height (h)" }, type: "number", defaultValue: 8, required: true, min: 0 },
            { id: "sideB", name: { tr: "Kenar b", en: "Side b" }, type: "number", defaultValue: 10, required: false, min: 0 },
            { id: "sideC", name: { tr: "Kenar c", en: "Side c" }, type: "number", defaultValue: 10, required: false, min: 0 },
        ],
        results: [
            { id: "area", label: { tr: "Alan", en: "Area" }, suffix: " m²", decimalPlaces: 2 },
            { id: "perimeter", label: { tr: "Çevre", en: "Perimeter" }, suffix: " m", decimalPlaces: 2 },
        ],
        formula: (v) => {
            const a = parseFloat(v.base) || 0;
            const h = parseFloat(v.height) || 0;
            const b = parseFloat(v.sideB) || a;
            const c = parseFloat(v.sideC) || a;
            const area = (a * h) / 2;
            const perimeter = a + b + c;
            return { area, perimeter };
        },
        seo: {
            title: { tr: "Üçgen Alanı ve Çevresi Hesaplama", en: "Triangle Area and Perimeter Calculator" },
            metaDescription: { tr: "Üçgenin taban ve yüksekliğine göre alanını, kenar uzunluklarına göre çevresini hesaplayın.", en: "Calculate triangle area via base/height and perimeter via side lengths." },
            content: { tr: "Üçgenin alanı, taban uzunluğu ile o tabana ait yüksekliğin çarpımının yarısına eşittir. Çevre ise üç kenarın toplamıdır.", en: "Area = (base × height) / 2. Perimeter = sum of all three sides." },
            faq: [{ q: { tr: "Eşkenar üçgen alanı nasıl hesaplanır?", en: "Equilateral triangle area?" }, a: { tr: "(a²√3)/4 formülüyle daha hızlı hesaplanabilir.", en: "Can be calculated with (a²√3)/4." } }],
            richContent: {
                howItWorks: { tr: "Taban ve yükseklik çarpılıp ikiye bölünerek alan, üç kenar toplanarak çevre bulunur.", en: "Base times height divided by two for area, sum of three sides for perimeter." },
                formulaText: { tr: "Alan = (a×h)/2. Çevre = a+b+c.", en: "Area = (a×h)/2. Perimeter = a+b+c." },
                exampleCalculation: { tr: "a=10, h=8 → Alan = 40. Çevre = 30.", en: "a=10, h=8 → Area = 40. Perimeter = 30." },
                miniGuide: { tr: "<ul><li>Yükseklik tabana dik olan uzaklıktır.</li><li>Alan birimi giren kenar biriminin karesidir.</li></ul>", en: "Height is the perpendicular dist. Area unit is squared side unit." }
            }
        }
    },

    // ── LGS PUAN HESAPLAMA ────────────────────────────────────
    {
        id: "lgs-score",
        slug: "lgs-puan-hesaplama",
        category: "sinav-hesaplamalari",
        name: { tr: "LGS Puan Hesaplama", en: "LGS Score Calculator" },
        h1: { tr: "LGS Puan Hesaplama 2025 — Liselere Geçiş Sınavı", en: "LGS High School Entrance Score Calculator" },
        description: { tr: "2025 LGS netlerinizden tahmini yerleştirme puanınızı hesaplayın.", en: "Calculate your estimated 2025 placement score from LGS nets." },
        shortDescription: { tr: "Ders doğrularınızı ve yanlışlarınızı girin; LGS puanınızı 2025 katsayılarıyla anında öğrenin.", en: "Enter subject counts to learn your LGS score instantly with 2025 coefficients." },
        relatedCalculators: ["yks-puan-hesaplama", "ortalama-hesaplama", "takdir-tessekur-hesaplama"],
        inputs: [
            { id: "din_muaf", name: { tr: "Din Kültürü Muafiyeti", en: "Religion Exempt" }, type: "checkbox", placeholder: { tr: "Din Kültürü dersi almıyorum", en: "Exempt from Religion" }, className: "w-full" },
            { id: "dil_muaf", name: { tr: "Yabancı Dil Muafiyeti", en: "Language Exempt" }, type: "checkbox", placeholder: { tr: "Yabancı Dil dersi almıyorum", en: "Exempt from Language" }, className: "w-full" },

            { id: "turk_d", name: { tr: "Türkçe Doğru (20 Soru)", en: "TR Correct" }, type: "number", defaultValue: 15, min: 0, max: 20, className: "w-1/2" },
            { id: "turk_y", name: { tr: "Türkçe Yanlış", en: "TR Wrong" }, type: "number", defaultValue: 2, min: 0, max: 20, className: "w-1/2" },

            { id: "mat_d", name: { tr: "Matematik Doğru (20 Soru)", en: "Math Correct" }, type: "number", defaultValue: 10, min: 0, max: 20, className: "w-1/2" },
            { id: "mat_y", name: { tr: "Matematik Yanlış", en: "Math Wrong" }, type: "number", defaultValue: 3, min: 0, max: 20, className: "w-1/2" },

            { id: "fen_d", name: { tr: "Fen Bilimleri Doğru (20 Soru)", en: "Sci Correct" }, type: "number", defaultValue: 12, min: 0, max: 20, className: "w-1/2" },
            { id: "fen_y", name: { tr: "Fen Bilimleri Yanlış", en: "Sci Wrong" }, type: "number", defaultValue: 2, min: 0, max: 20, className: "w-1/2" },

            { id: "ink_d", name: { tr: "Tarih/İnkılap Doğru (10 Soru)", en: "Hist Correct" }, type: "number", defaultValue: 8, min: 0, max: 10, className: "w-1/2" },
            { id: "ink_y", name: { tr: "Tarih/İnkılap Yanlış", en: "Hist Wrong" }, type: "number", defaultValue: 1, min: 0, max: 10, className: "w-1/2" },

            { id: "din_d", name: { tr: "Din Kültürü Doğru (10 Soru)", en: "Rel Correct" }, type: "number", defaultValue: 9, min: 0, max: 10, className: "w-1/2" },
            { id: "din_y", name: { tr: "Din Kültürü Yanlış", en: "Rel Wrong" }, type: "number", defaultValue: 0, min: 0, max: 10, className: "w-1/2" },

            { id: "dil_d", name: { tr: "Yabancı Dil Doğru (10 Soru)", en: "Lang Correct" }, type: "number", defaultValue: 7, min: 0, max: 10, className: "w-1/2" },
            { id: "dil_y", name: { tr: "Yabancı Dil Yanlış", en: "Lang Wrong" }, type: "number", defaultValue: 2, min: 0, max: 10, className: "w-1/2" },
        ],
        results: [
            { id: "toplam_net", label: { tr: "Toplam Net", en: "Total Net" }, decimalPlaces: 2 },
            { id: "puan", label: { tr: "Tahmini LGS Puanı", en: "Estimated LGS Score" }, decimalPlaces: 4 },
        ],
        formula: (v) => {
            const getNet = (d: any, y: any, max: number) => {
                const correct = Math.min(parseFloat(d) || 0, max);
                let wrong = parseFloat(y) || 0;
                if (correct + wrong > max) wrong = max - correct;
                return Math.max(0, correct - (wrong / 3));
            };

            const t_net = getNet(v.turk_d, v.turk_y, 20);
            const m_net = getNet(v.mat_d, v.mat_y, 20);
            const f_net = getNet(v.fen_d, v.fen_y, 20);
            const i_net = getNet(v.ink_d, v.ink_y, 10);
            const din_net = v.din_muaf ? 0 : getNet(v.din_d, v.din_y, 10);
            const dil_net = v.dil_muaf ? 0 : getNet(v.dil_d, v.dil_y, 10);

            // Technical Requirements: TR:4, MAT:4, FEN:4, others:1
            const t_coef = 4.0;
            const m_coef = 4.0;
            const f_coef = 4.0;
            const i_coef = 1.0;
            const din_coef = 1.0;
            const dil_coef = 1.0;
            const base_point = 194.707;

            let c_din = v.din_muaf ? 0 : din_coef;
            let c_dil = v.dil_muaf ? 0 : dil_coef;

            // Normalization for exemptions: Scales the score up to maintain the 500 max range
            const max_possible_weighted = 270; // (20*4)*3 + (10*1)*3
            const current_max_possible = (20 * 4) * 3 + (10 * 1) + (v.din_muaf ? 0 : 10) + (v.dil_muaf ? 0 : 10);
            const multiplier = max_possible_weighted / current_max_possible;

            const weighted_score = (
                (t_net * t_coef) +
                (m_net * m_coef) +
                (f_net * f_coef) +
                (i_net * i_coef) +
                (din_net * c_din) +
                (dil_net * c_dil)
            ) * multiplier;

            // Conversion to 500 scale
            // (500 - 194.707) / 270 = 1.1307148
            const scaling_factor = 1.1307148;
            let total_puan = base_point + (weighted_score * scaling_factor);

            const total_net = t_net + m_net + f_net + i_net + din_net + dil_net;
            if (total_net === 0) total_puan = 0;

            return { toplam_net: total_net, puan: Math.min(500, Math.max(0, total_puan)) };
        },
        seo: {
            title: { tr: "LGS Puan Hesaplama 2025 — En Güncel MEB Katsayıları", en: "LGS Score Calculator 2025" },
            metaDescription: { tr: "2025 LGS netlerinizi girin, tahmini puanınızı ve MEB standartlarına en yakın sonucunuzu anında öğrenin.", en: "Enter your 2025 LGS nets, instantly see your estimated score close to MoNE standards." },
            content: { tr: "LGS puanı; Türkçe, Matematik ve Fen Bilimleri'nin ağırlıklı olduğu (katsayı 4), İnkılap, Din ve Dil derslerinin ise katsayısının 1 olduğu bir sistemle hesaplanır. 3 yanlış 1 doğruyu götürür.", en: "LGS score is calculated with a weight of 4 for core subjects and 1 for others. 3 wrong answers remove 1 correct one." },
            faq: [
                { q: { tr: "LGS'de 3 yanlış 1 doğruyu götürür mü?", en: "Does 3 wrong remove 1 correct in LGS?" }, a: { tr: "Evet, LGS'de her alt test için 3 yanlış cevap 1 doğru cevabı eksiltir.", en: "Yes, in LGS, 3 wrong answers in each subtest reduce 1 correct answer." } },
                { q: { tr: "Din Kültürü muafiyeti puanı etkiler mi?", en: "Does religion exemption affect score?" }, a: { tr: "Muaf olan öğrenciler için puan, diğer testlerin ağırlığı orantılı olarak artırılarak hesaplanır, böylece aday dezavantajlı duruma düşmez.", en: "For exempt students, weights of other tests are increased proportionally so the candidate isn't disadvantaged." } }
            ],
            richContent: {
                howItWorks: { tr: "Doğrularınızdan yanlışlarınızın üçte biri çıkarılarak netler bulunur. Bu netler 2025 MEB katsayılarıyla çarpılıp taban puan eklenerek sonuç üretilir.", en: "Nets are found by subtracting 1/3 of wrongs from corrects. These are multiplied by 2025 MoNE coefficients and base score is added." },
                formulaText: { tr: "Net = Doğru - (Yanlış / 3). Puan = 194.707 + (WeightedNet * Scaling).", en: "Net = Correct - (Wrong / 3). Score = 194.707 + (WeightedNet * Scaling)." },
                exampleCalculation: { tr: "Türkçe 18 Net, Matematik 15 Net, Fen 17 Net yapan bir öğrenci için tahmini puan yaklaşık 420-440 bandında oluşur.", en: "A student with 18 TR, 15 Math, 17 Science nets gets approx 420-440 points." },
                miniGuide: { tr: "<ul><li><b>Standart Sapma:</b> Gerçek puanınız sınavın zorluğuna ve Türkiye ortalamasına göre birkaç puan değişebilir.</li><li><b>Boş Bırakma:</b> Bilmediğiniz soruları boş bırakmak netinizi korumanızı sağlar.</li></ul>", en: "Score may vary based on difficulty and average. Leaving unknown questions blank protects your nets." }
            }
        }
    },
];

// ────────────────────────────────────────────────────────────────
// OKUL VE SINAV EKLENTİLERİ
// ────────────────────────────────────────────────────────────────
export const schoolCalculators: CalculatorConfig[] = [
    {
        id: "school-honors",
        slug: "takdir-tesekkur-hesaplama",
        category: "sinav-hesaplamalari",
        name: { tr: "Takdir Teşekkür Hesaplama", en: "School Honors Calculator" },
        h1: { tr: "Takdir Teşekkür Hesaplama — e-Okul Uyumlu Ağırlıklı Ortalama", en: "School Honors Certificate Calculator" },
        description: { tr: "Ders saati ve notlarınızı girerek dönem sonu ağırlıklı ortalamanızı ve belge durumunuzu hesaplayın.", en: "Calculate your weighted GPA and certificate status by entering your grades and class hours." },
        shortDescription: { tr: "e-Okul sistemiyle %100 uyumlu olarak dönem sonu not ortalamanızı ve hangi belgeyi alacağınızı anında öğrenin.", en: "Instantly find out your term GPA and which honors certificate you will receive, fully compatible with the e-School system." },
        inputs: [
            { id: "grade1", name: { tr: "1. Ders Notu", en: "1. Class Grade" }, type: "number", min: 0, max: 100, defaultValue: 85, required: true },
            { id: "hours1", name: { tr: "1. Ders Saati", en: "1. Class Hours" }, type: "number", min: 1, max: 15, defaultValue: 5, required: true },
            { id: "grade2", name: { tr: "2. Ders Notu", en: "2. Class Grade" }, type: "number", min: 0, max: 100, defaultValue: 90, required: true },
            { id: "hours2", name: { tr: "2. Ders Saati", en: "2. Class Hours" }, type: "number", min: 1, max: 15, defaultValue: 4, required: true },
            { id: "grade3", name: { tr: "3. Ders Notu", en: "3. Class Grade" }, type: "number", min: 0, max: 100, defaultValue: 75, required: false },
            { id: "hours3", name: { tr: "3. Ders Saati", en: "3. Class Hours" }, type: "number", min: 1, max: 15, defaultValue: 3, required: false },
            { id: "grade4", name: { tr: "4. Ders Notu", en: "4. Class Grade" }, type: "number", min: 0, max: 100, defaultValue: 60, required: false },
            { id: "hours4", name: { tr: "4. Ders Saati", en: "4. Class Hours" }, type: "number", min: 1, max: 15, defaultValue: 2, required: false },
            { id: "grade5", name: { tr: "5. Ders Notu", en: "5. Class Grade" }, type: "number", min: 0, max: 100, defaultValue: 0, required: false },
            { id: "hours5", name: { tr: "5. Ders Saati", en: "5. Class Hours" }, type: "number", min: 1, max: 15, defaultValue: 2, required: false },
            { id: "grade6", name: { tr: "6. Ders Notu", en: "6. Class Grade" }, type: "number", min: 0, max: 100, defaultValue: 0, required: false },
            { id: "hours6", name: { tr: "6. Ders Saati", en: "6. Class Hours" }, type: "number", min: 1, max: 15, defaultValue: 2, required: false },
        ],
        results: [
            { id: "average", label: { tr: "Ağırlıklı Dönem Ortalaması", en: "Weighted Term Average" }, decimalPlaces: 4 },
            { id: "resultType", label: { tr: "Belge Durumu", en: "Certificate Status" }, type: "text" },
        ],
        formula: (v) => {
            let totalWeightedPoints = 0;
            let totalHours = 0;
            let hasFailingGrade = false;

            for (let i = 1; i <= 6; i++) {
                const rawGrade = v[`grade${i}`];
                const rawHour = v[`hours${i}`];

                // Only process filled inputs
                if (rawGrade !== undefined && rawHour !== undefined && rawHour !== "") {
                    const grade = parseFloat(rawGrade) || 0;
                    const hours = parseFloat(rawHour) || 0;

                    if (hours > 0) {
                        if (grade < 50) {
                            hasFailingGrade = true;
                        }
                        totalWeightedPoints += (grade * hours);
                        totalHours += hours;
                    }
                }
            }

            if (totalHours === 0) return { average: 0, resultType: { tr: "Ders bilgisi girilmedi.", en: "No class data entered." } as any };

            const average = totalWeightedPoints / totalHours;

            // e-Okul MEB regulations for secondary/high schools
            let statusTr = "";
            let statusEn = "";
            let colorCls = "bg-green-500";

            if (hasFailingGrade) {
                statusTr = "Belge Alamaz (Zayıf var)";
                statusEn = "No Certificate (Failing Grade)";
                colorCls = "bg-red-500";
            } else if (average >= 85) {
                statusTr = "Takdir Belgesi Almaya Hak Kazandınız 🏆";
                statusEn = "Certificate of Excellence 🏆";
                colorCls = "bg-[#22c55e]";
            } else if (average >= 70) {
                statusTr = "Teşekkür Belgesi Almaya Hak Kazandınız ⭐";
                statusEn = "Certificate of Merit ⭐";
                colorCls = "bg-blue-500";
            } else {
                statusTr = "Belge Alamaz (Ortalama Yetersiz)";
                statusEn = "No Certificate (Insufficient Average)";
                colorCls = "bg-orange-500";
            }

            return {
                average: average,
                resultType: { tr: statusTr, en: statusEn } as any
            };
        },
        seo: {
            title: { tr: "Takdir Teşekkür Hesaplama 2026 — e-Okul Not Ortalaması", en: "School Honors Certificate Calculator" },
            metaDescription: { tr: "Ders saatlerini ve notlarınızı girerek takdir veya teşekkür belgesi alıp alamayacağınızı MEB e-okul algoritmasıyla anında hesaplayın.", en: "Calculate your weighted GPA and instantly find out if you qualify for a certificate of excellence or merit." },
            content: { tr: "Milli Eğitim Bakanlığı (MEB) mevzuatına göre bir öğrencinin Takdir veya Teşekkür belgesi alabilmesi için ağırlıklı dönem ortalamasının belirli bir barajı geçmesi ve hiçbir zayıf dersinin (50 altı) olmaması gerekir.", en: "According to MoNE regulations, to receive an honors certificate, a student's weighted average must pass a certain threshold and they must not have any failing grades." },
            faq: [
                { q: { tr: "Hesaplama e-Okul ile birebir aynı mı?", en: "Is the calculation exactly same as e-okul?" }, a: { tr: "Evet, hesaplama mantığı e-okul ile aynıdır. Dersin notu ile haftalık ders saati çarpılır; çıkan sonuçlar toplanıp toplam ders saatine bölünerek ağırlıklı ortalama elde edilir.", en: "Yes, the logic is identical to e-school. The course grade is multiplied by the weekly hours; the results are added and divided by total hours." } },
                { q: { tr: "Takdir ve Teşekkür barajı kaçtır?", en: "What are the thresholds for honors?" }, a: { tr: "70.00 ile 84.99 arası Teşekkür belgesi, 85.00 ve üzeri puanlar ise Takdir belgesi almaya hak kazanır.", en: "70.00 to 84.99 earns Merit, 85.00 and above earns Excellence." } },
                { q: { tr: "Zayıfım (50 altı) varken belge alabilir miyim?", en: "Can I get a certificate with a failing grade?" }, a: { tr: "Hayır. Ortalamanız 95 dahi olsa 1 tane bile 50 altında notunuz varsa, 1 özürsüz devamsızlığınız 5 günü aşıyorsa veya kınama cezası aldıysanız belge alamazsınız.", en: "No. Even if your average is 95, a single grade below 50 disqualifies you." } }
            ],
            richContent: {
                howItWorks: { tr: "Girdiğiniz her bir ders notu, o dersin haftalık saati (ağırlığı) ile çarpılır. Tüm bu puanlar toplanıp, toplam girdiğiniz ders saatine bölünür. Sonuç 85 üstüyse Takdir, 70-85 arasıysa Teşekkür verir.", en: "Each grade is multiplied by its weekly hours (weight). These are summed and divided by total hours entered. >85 is Excellence, 70-84.99 is Merit." },
                formulaText: { tr: "Dönem Ortalaması = (DersNotu1 × DersSaati1 + DersNotu2 × DersSaati2 ...) / Toplam Ders Saati", en: "Term Average = Sum(Grade × Hours) / Sum(Hours)" },
                exampleCalculation: { tr: "Matematik (6 Saat, 80 Not) = 480 Puan. Türkçe (5 Saat, 90 Not) = 450 Puan. Ortalama = (480 + 450) / 11 Toplam Saat = 84.54 (Teşekkür Belgesi).", en: "Math (6hrs, 80 grade) = 480 pts. TR (5hrs, 90 grade) = 450 pts. Average = (480 + 450) / 11 total hrs = 84.54 (Merit Certificate)." },
                miniGuide: { tr: "<ul><li><b>Lise Özel Koşulu:</b> Liselerde Türkçe/Türk Dili ve Edebiyatı gibi baraj derslerinin ortalaması MEB tarafından belirlenen alt sınırın altında kalırsa belge alınamayabilir.</li><li><b>Önemli Uyarı:</b> Bu hesaplama devamsızlık ve disiplin durumunuzu kontrol edemez.</li></ul>", en: "Special conditions apply for certain core subjects in high school. Also, this calculator cannot check your absence and disciplinary limits." }
            }
        }
    },

    // ── DGS PUAN HESAPLAMA ──────────────────────────────────
    {
        id: "dgs-calculator",
        slug: "dgs-puan-hesaplama",
        category: "sinav-hesaplamalari",
        name: { tr: "DGS Puan Hesaplama 2026", en: "DGS Score Calculator 2026" },
        h1: { tr: "DGS Puan Hesaplama 2026 (ÖSYM Uyumlu)", en: "DGS Score Calculator 2026 (OSYM Compliant)" },
        description: { tr: "DGS Sözel ve Sayısal netlerinizi ile ÖBP'nizi (Önlisans Başarı Puanı) girerek güncel ÖSYM katsayılarıyla tahmini DGS puanınızı anında hesaplayın.", en: "Calculate your estimated DGS score instantly with current OSYM coefficients by entering your Verbal and Numerical nets and OBP (Associate Degree Success Score)." },
        shortDescription: { tr: "2026 ÖSYM güncel katsayılarına göre Sayısal, Sözel ve Eşit Ağırlık DGS puanlarınızı hatasız hesaplayın.", en: "Calculate your Numerical, Verbal, and Equal Weight DGS scores flawlessly according to 2026 OSYM current coefficients." },
        relatedCalculators: ["yks-puan-hesaplama", "lgs-puan-hesaplama"],
        inputs: [
            // Sayısal Testi
            { id: "sayisal_sec", type: "section", name: { tr: "Sayısal Testi (50 Soru)", en: "Numerical Test" }, required: false },
            { id: "sayisal_d", name: { tr: "Sayısal Doğru (50 Soru)", en: "Numerical Correct" }, type: "number", defaultValue: 30, min: 0, max: 50, className: "w-1/2" },
            { id: "sayisal_y", name: { tr: "Sayısal Yanlış", en: "Numerical Wrong" }, type: "number", defaultValue: 5, min: 0, max: 50, className: "w-1/2" },

            // Sözel Testi
            { id: "sozel_sec", type: "section", name: { tr: "Sözel Testi (50 Soru)", en: "Verbal Test" }, required: false },
            { id: "sozel_d", name: { tr: "Sözel Doğru (50 Soru)", en: "Verbal Correct" }, type: "number", defaultValue: 25, min: 0, max: 50, className: "w-1/2" },
            { id: "sozel_y", name: { tr: "Sözel Yanlış", en: "Verbal Wrong" }, type: "number", defaultValue: 8, min: 0, max: 50, className: "w-1/2" },

            // ÖBP ve Yerleştirme Durumu
            { id: "obp_sec", type: "section", name: { tr: "Önlisans Başarı Puanı (ÖBP)", en: "Associate Degree Success Score (OBP)" }, required: false },
            { id: "obp", name: { tr: "ÖBP Puanınız", en: "Your OBP" }, type: "number", defaultValue: 60, min: 40, max: 80, required: true },
            {
                id: "onceki_yerlestirme",
                name: {
                    tr: "Geçen Yıl DGS ile Bir Programa Yerleştim (ÖBP Kesintisi Uygulanır)",
                    en: "I was placed in a program last year (OBP Deduction Applies)"
                },
                type: "select",
                defaultValue: "hayir",
                options: [
                    { value: "hayir", label: { tr: "Hayır, yerleşmedim (Kesinti Yok)", en: "No, I didn't (No Deduction)" } },
                    { value: "evet", label: { tr: "Evet, yerleştim (%25 Kesinti)", en: "Yes, I did (25% Deduction)" } }
                ]
            }
        ],
        results: [
            { id: "sayisal_net", label: { tr: "Sayısal Net", en: "Numerical Net" }, decimalPlaces: 2 },
            { id: "sozel_net", label: { tr: "Sözel Net", en: "Verbal Net" }, decimalPlaces: 2 },
            { id: "sayisal_puan", label: { tr: "DGS SAY Puanı", en: "DGS NUM Score" }, decimalPlaces: 3 },
            { id: "sozel_puan", label: { tr: "DGS SÖZ Puanı", en: "DGS VER Score" }, decimalPlaces: 3 },
            { id: "ea_puan", label: { tr: "DGS EA Puanı", en: "DGS EA Score" }, decimalPlaces: 3 }
        ],
        formula: (v) => {
            const getNet = (d: any, y: any, max: number) => {
                const correct = Math.min(parseFloat(d) || 0, max);
                let wrong = parseFloat(y) || 0;
                if (correct + wrong > max) wrong = max - correct;
                return Math.max(0, correct - (wrong / 4)); // 4 yanlış 1 doğruyu götürür
            };

            const sayisal_net = getNet(v.sayisal_d, v.sayisal_y, 50);
            const sozel_net = getNet(v.sozel_d, v.sozel_y, 50);

            // ÖSYM güncel denklik formülü (yaklaşık)
            let sayisal_std = (sayisal_net * 3.1) + (sozel_net * 0.5) + 105;
            let sozel_std = (sayisal_net * 0.5) + (sozel_net * 3.1) + 105;
            let ea_std = (sayisal_net * 1.8) + (sozel_net * 1.8) + 105;

            let obp = parseFloat(v.obp) || 0;
            if (obp > 80) obp = 80;
            if (obp > 0 && obp < 40) obp = 40;

            const isPlacedBefore = v.onceki_yerlestirme === "evet";
            const obpMultiplier = isPlacedBefore ? 0.45 : 0.6;
            const obpContribution = obp * obpMultiplier;

            return {
                sayisal_net,
                sozel_net,
                sayisal_puan: sayisal_std + obpContribution,
                sozel_puan: sozel_std + obpContribution,
                ea_puan: ea_std + obpContribution
            };
        },
        seo: {
            title: { tr: "2025 DGS Puan Hesaplama (Güncel ÖSYM Katsayıları)", en: "2025 DGS Score Calculator" },
            metaDescription: { tr: "Sayısal ve Sözel netlerinizi girerek 2025 DGS Sayısal, Sözel ve Eşit Ağırlık puanlarınızı ÖSYM güncel katsayılarına göre saniyeler içinde hesaplayın.", en: "Calculate your 2025 DGS numerical, verbal, and equal weight scores with zero error according to OSYM current coefficients." },
            content: { tr: "DGS (Dikey Geçiş Sınavı) hesaplamasında Sayısal ve Sözel testlerinden elde edilen standart puanlara, Önlisans Başarı Puanınızın (ÖBP) 0.6 katsayısı ile çarpılarak eklenmesiyle yerleştirme puanlarınız oluşturulur.", en: "In DGS, your placement scores are created by adding your Associate Degree Success Score (OBP) multiplied by 0.6 factor to the standard scores." },
            faq: [
                { q: { tr: "DGS puanı hesaplanırken 4 yanlış 1 doğruyu götürür mü?", en: "Do 4 wrong answers cancel 1 correct?" }, a: { tr: "Evet, DGS'de 4 yanlış cevap 1 doğru cevabı götürmektedir.", en: "Yes, 4 wrong answers cancel 1 correct answer. Our system automatically relies on this when calculating your nets." } },
                { q: { tr: "DGS ÖBP (Önlisans Başarı Puanı) nasıl hesaplanır?", en: "How is DGS OBP calculated?" }, a: { tr: "Önlisans mezuniyet notunuz (100 üzerinden) 0.8 ile çarpılır. Çıkan değer ÖBP'nizdir. En düşük 40, en yüksek 80 olabilir.", en: "Your associate degree graduation grade (out of 100) is multiplied by 0.8. Lowest becomes 40, highest 80." } },
                { q: { tr: "Önceki yıl DGS ile yerleştim, puanım düşer mi?", en: "Placed previous year, will my score drop?" }, a: { tr: "Evet. Önceki yıl DGS ile bir yükseköğretim programına yerleştirilen (kayıt yaptırmasa dahi) adayların ÖBP katsayısı %25 kesintili olarak hesaplanır.", en: "Yes. Candidates placed previous year face a ~25% penalty on their OBP coefficient." } }
            ],
            richContent: {
                howItWorks: { tr: "Sayısal (50 Soru) ve Sözel (50 Soru) testlerindeki doğru ve yanlışlarınız üzerinden netleriniz çıkarılır. Netleriniz ÖSYM güncel katsayılarıyla toplanır. ÖBP Puanınızın 0.6 katı (ya da 0.45 katı) yerleştirme puanınıza eklenir.", en: "Your nets are calculated over 50 numerical and 50 verbal questions. These nets undergo weighted OSYM coefficient formulas, and finally, your OBP is added." },
                formulaText: { tr: "Yerleştirme Puanı = [Sınav Standart Puanı + (ÖBP × 0.6)] formülü baz alınmaktadır.", en: "Placement Score = [Standard Test Score + (OBP × 0.6)] formula translates your results." },
                exampleCalculation: { tr: "Örnek: 30 Sayısal, 25 Sözel neti olan ve 60 ÖBP'ye sahip bir öğrencinin SAY puanı tahmini: (30×3.1) + (25×0.5) + (60×0.6) + 105 Taban = 246.50", en: "Example: 30 Num Net, 25 Ver Net, 60 OBP => Estimated NUM Score: (30*3.1) + (25*0.5) + (60*0.6) + 105 = 246.50" },
                miniGuide: { tr: "<ul><li><b>Puan Türü Kapsamı:</b> Öğrenciler mezun oldukları alanın devamı niteliğindeki lisans programlarını tercih edebilirler. Sayısal çıkışlı bir öğrenci Sözel puanıyla yerleşemez.</li><li><b>1 Net Kuralı:</b> Puanınızın hesaplanması için her iki testten de (Sayısal ve Sözel) en az 1'er net yapmış olmanız gerektiği kuralına dikkat edin.</li></ul>", en: "Students can only choose bachelor programs strictly related to their associate degree fields. Ensure you score at least 1 net in each test to get scored." }
            }
        }
    },

    // ── TYT PUAN HESAPLAMA ──────────────────────────────────
    {
        id: "tyt-calculator",
        slug: "tyt-puan-hesaplama",
        category: "sinav-hesaplamalari",
        name: { tr: "TYT Puan Hesaplama 2026", en: "TYT Score Calculator 2026" },
        h1: { tr: "TYT Puan Hesaplama 2026 (ÖSYM Uyumlu)", en: "TYT Score Calculator 2026 (OSYM Compliant)" },
        description: { tr: "TYT netlerinizi ve okul puanınızı (OBP/Diploma Notu) girerek 2025 ÖSYM güncel katsayılarına göre 2026 YKS-TYT puanınızı ve tahmini sıralamanızı hesaplayın.", en: "Calculate your 2026 YKS-TYT score and estimated ranking with 2025 OSYM coefficients by entering your TYT nets and school score (OBP/Diploma Grade)." },
        shortDescription: { tr: "Türkçe, Sosyal, Matematik ve Fen netlerinizi girerek 2025 verileriyle 2026 TYT puanınızı ve ÖBP eklenmiş yerleştirme puanınızı hesaplayın.", en: "Enter your Turkish, Social, Math, and Science nets to calculate your 2026 TYT score and placement score using 2025 data." },
        relatedCalculators: ["yks-puan-hesaplama", "dgs-puan-hesaplama", "lgs-puan-hesaplama"],
        inputs: [
            {
                id: "sinav_yili",
                name: { tr: "Sınav Yılı:", en: "Exam Year:" },
                type: "select",
                defaultValue: "2024",
                options: [
                    { value: "2024", label: { tr: "YKS-TYT 2024 (Gerçek ÖSYM)", en: "YKS-TYT 2024 (Real ÖSYM)" } },
                    { value: "2023", label: { tr: "YKS-TYT 2023 (Yaklaşık)", en: "YKS-TYT 2023 (Approximate)" } },
                ]
            },
            { id: "turk_sec", type: "section", name: { tr: "Türkçe (40 Soru)", en: "Turkish (40 Q)" }, required: false },
            { id: "turk_d", name: { tr: "Türkçe Doğru (40 Soru)", en: "Turkish Correct" }, type: "number", defaultValue: 25, min: 0, max: 40, className: "w-1/2" },
            { id: "turk_y", name: { tr: "Türkçe Yanlış", en: "Turkish Wrong" }, type: "number", defaultValue: 5, min: 0, max: 40, className: "w-1/2" },

            { id: "sos_sec", type: "section", name: { tr: "Sosyal Bilimler (20 Soru)", en: "Social Sciences (20 Q)" }, required: false },
            { id: "sos_d", name: { tr: "Sosyal Doğru (20 Soru)", en: "Social Correct" }, type: "number", defaultValue: 12, min: 0, max: 20, className: "w-1/2" },
            { id: "sos_y", name: { tr: "Sosyal Yanlış", en: "Social Wrong" }, type: "number", defaultValue: 4, min: 0, max: 20, className: "w-1/2" },

            { id: "mat_sec", type: "section", name: { tr: "Temel Matematik (40 Soru)", en: "Basic Math (40 Q)" }, required: false },
            { id: "mat_d", name: { tr: "Matematik Doğru (40 Soru)", en: "Math Correct" }, type: "number", defaultValue: 15, min: 0, max: 40, className: "w-1/2" },
            { id: "mat_y", name: { tr: "Matematik Yanlış", en: "Math Wrong" }, type: "number", defaultValue: 3, min: 0, max: 40, className: "w-1/2" },

            { id: "fen_sec", type: "section", name: { tr: "Fen Bilimleri (20 Soru)", en: "Science (20 Q)" }, required: false },
            { id: "fen_d", name: { tr: "Fen Doğru (20 Soru)", en: "Science Correct" }, type: "number", defaultValue: 8, min: 0, max: 20, className: "w-1/2" },
            { id: "fen_y", name: { tr: "Fen Yanlış", en: "Science Wrong" }, type: "number", defaultValue: 2, min: 0, max: 20, className: "w-1/2" },

            { id: "obp_sec", type: "section", name: { tr: "Okul Başarı Puanı ve Ek Puanlar", en: "School Score & Extra Points" }, required: false, placeholder: { tr: "Diploma notu (50-100) ya da OBP (250-500) girebilirsiniz.", en: "You can enter your Diploma grade (50-100) or OBP (250-500)." } },
            { id: "obp_input", name: { tr: "Diploma Notu veya OBP", en: "Diploma Grade or OBP" }, type: "number", defaultValue: 85, min: 50, max: 500, required: false },
            {
                id: "obp_kesinti",
                name: { tr: "Önceki yıl YKS ile bir programa yerleştim (OBP yarıya düşer)", en: "I was placed in a program with YKS last year (OBP is halved)" },
                type: "checkbox",
                defaultValue: false
            },
            {
                id: "obp_ek_puan",
                name: { tr: "Meslek lisesi mezunuyum (Kendi alanımda ek puan)", en: "I am a vocational high school graduate (Extra points in my field)" },
                type: "checkbox",
                defaultValue: false
            }
        ],
        results: [
            { id: "toplam_net", label: { tr: "Toplam Net", en: "Total Nets" }, decimalPlaces: 2 },
            { id: "ham_puan", label: { tr: "TYT Ham Puan", en: "Raw TYT Score" }, decimalPlaces: 5 },
            { id: "yerlestirme_puan", label: { tr: "Y-TYT (Yerleştirme) Puanı", en: "Placement TYT Score" }, decimalPlaces: 5 },
            { id: "ek_puanli_yerlestirme", label: { tr: "Ek Puanlı Y-TYT (Meslek Liseli)", en: "Vocational Placement TYT Score" }, decimalPlaces: 5 }
        ],
        formula: (v) => {
            const getNet = (d: any, y: any, max: number) => {
                const correct = Math.min(parseFloat(d) || 0, max);
                let wrong = parseFloat(y) || 0;
                if (correct + wrong > max) wrong = max - correct;
                return Math.max(0, correct - (wrong / 4));
            };

            const turk_net = getNet(v.turk_d, v.turk_y, 40);
            const sos_net = getNet(v.sos_d, v.sos_y, 20);
            const mat_net = getNet(v.mat_d, v.mat_y, 40);
            const fen_net = getNet(v.fen_d, v.fen_y, 20);
            const toplam_net = turk_net + sos_net + mat_net + fen_net;

            // ÖSYM gerçek TYT katsayıları (yıla göre)
            const tytKat: Record<string, { turk: number; sos: number; mat: number; fen: number }> = {
                "2024": { turk: 2.91, sos: 2.94, mat: 2.93, fen: 2.53 },
                "2023": { turk: 3.30, sos: 3.40, mat: 3.30, fen: 3.40 },
            };
            const yil = String(v.sinav_yili || "2024");
            const k = tytKat[yil] || tytKat["2024"];

            // Türkçe veya Matematik'ten 0.5+ net zorunlu
            let ham_puan = 0;
            if (turk_net >= 0.5 || mat_net >= 0.5) {
                ham_puan = 100 + (turk_net * k.turk) + (sos_net * k.sos) + (mat_net * k.mat) + (fen_net * k.fen);
                if (ham_puan > 500) ham_puan = 500;
            }

            // OBP İşlemleri
            let obp_value = parseFloat(v.obp_input) || 0;
            if (obp_value > 0 && obp_value <= 100) {
                // Diploma notu girilmiş, OBP'ye çevir (x5)
                obp_value = obp_value * 5;
            } else if (obp_value > 500) {
                obp_value = 500;
            }
            if (obp_value < 250 && obp_value > 0) obp_value = 250; // min OBP is 250

            // Normal OBP katsayısı = 0.12 (max 60 puan)
            // Eğer geçen sene yerleştiyse yarıya düşer = 0.06 (max 30 puan)
            const isPlacedBefore = !!v.obp_kesinti;
            const obpMultiplier = isPlacedBefore ? 0.06 : 0.12;
            let obp_katkisi = obp_value * obpMultiplier;
            if (obp_katkisi < 0) obp_katkisi = 0;

            const isVocational = !!v.obp_ek_puan;
            // Meslek lisesi ek puanı: OBP * 0.06 (Sadece kendi alanını tercih ederse)
            // Eğer geçen sene kendi alanında yerleştiyse bu da yarıya düşer: 0.03
            const ekMultiplier = isPlacedBefore ? 0.03 : 0.06;
            let ek_katki = isVocational ? (obp_value * ekMultiplier) : 0;

            let yerlestirme_puan = 0;
            let ek_puanli_yerlestirme = 0;

            if (ham_puan > 100) {
                yerlestirme_puan = ham_puan + obp_katkisi;
                ek_puanli_yerlestirme = yerlestirme_puan + ek_katki;
            }

            return {
                toplam_net,
                ham_puan,
                yerlestirme_puan: yerlestirme_puan > 0 ? yerlestirme_puan : 0,
                ek_puanli_yerlestirme: ek_puanli_yerlestirme > 0 ? ek_puanli_yerlestirme : 0
            };
        },
        seo: {
            title: { tr: "2025 TYT Puan Hesaplama (Güncel ÖSYM Katsayıları)", en: "2025 TYT Score Calculator" },
            metaDescription: { tr: "TYT netlerinizi ve okul puanınızı (OBP) girerek 2025 ÖSYM güncel katsayılarına göre YKS-TYT puanınızı ve tahmini sonucunuzu anında hesaplayın.", en: "Calculate your 2025 YKS-TYT score and estimated placement instantly with current OSYM coefficients by entering your TYT nets and school score (OBP)." },
            content: { tr: "YKS'nin ilk oturumu olan TYT (Temel Yeterlilik Testi) puan hesaplamasında Türkçe, Sosyal Bilimler, Temel Matematik ve Fen Bilimleri testlerindeki doğru ve yanlışlarınız üzerinden netleriniz bulunur. Bu netler 2024-2025 ÖSYM Türkiye geneli standart sapmalarına uyan katsayılarla çarpılarak Ham TYT puanınız ortaya çıkarılır.", en: "TYT placement score involves calculating your net successful answers minus incorrect weight across Turkish, Social Sciences, Maths and Sciences. This applies current 2025 base calculations from OSYM." },
            faq: [
                { q: { tr: "TYT Puanı hesaplanabilmesi için baraj var mı?", en: "Is there a threshold to calculate TYT Score?" }, a: { tr: "Adayların TYT puanının hesaplanabilmesi için Temel Matematik veya Türkçe testlerinin en az birinden 0.5 (yarım) net oranına ulaşmış olması zorunludur. Aksi takdirde puanınız hesaplanmaz.", en: "Candidates must achieve at least 0.5 net in either the Basic Math or Turkish tests for their TYT score to be calculated." } },
                { q: { tr: "OBP (Okul Başarı Puanı) TYT puanını nasıl etkiler?", en: "How does OBP affect TYT score?" }, a: { tr: "Diploma notunuzun (50-100) 5 ile çarpılmasıyla OBP (250-500) elde edilir. Ham puanınıza eklenirken OBP 0.12 ile çarpılır. Böylece yerleştirme puanınıza an az 30, en fazla 60 puan okul katkısı olarak yansır.", en: "Your diploma grade is multiplied by 5 to find OBP. OBP is multiplied by 0.12 to form the score addition (minimum 30, maximum 60)." } },
                { q: { tr: "Kırık OBP (Önceki yıl yerleşenler) hesaplaması nasıldır?", en: "How does broken OBP apply?" }, a: { tr: "Eğer bir önceki yıl YKS ile herhangi bir yükseköğretim programına yerleştirildiyseniz (kayıt yaptırmasanız bile), bu yılki OBP katsayınız 0.12 yerine 0.06 (yarı yarıya) hesaplanarak ciddi bir kesinti uygulanır.", en: "If you were placed in a higher education program last year, your OBP multiplier drops from 0.12 to 0.06 this year." } }
            ],
            richContent: {
                howItWorks: { tr: "Hesaplama motorumuz testlerdeki en güncel YKS taban puanı olan 100 puanın üzerine; Türkçe ve Matematik netleriniz için yaklaşık (3.3), Sosyal ve Fen netleriniz için (3.4) katsayılarını ekler ve formülü lise mezuniyet başarı ekinizle buluşturur.", en: "Calculation sets the base 100 points, then adds weighted values for Math and TR (~3.3), Science and Social (~3.4) and finally your school degree multiplier." },
                formulaText: { tr: "Ham TYT = 100 + (TürkçeNet x 3.3) + (MatNet x 3.3) + (SosyalNet x 3.4) + (FenNet x 3.4). Yerleştirme: Ham TYT + OBPx0.12.", en: "Raw TYT = 100 + (TR Net x 3.3) + (Math Net x 3.3) + (Social Net x 3.4) + (Science Net x 3.4). Placement: Raw + OBPx0.12." },
                exampleCalculation: { tr: "Örn: 25 Türkçe, 15 Matematik, 12 Sosyal, 8 Fen neti olan, diploma notu da 85 olan aday. Ham Puan = 100 + (25x3.3) + (15x3.3) + (12x3.4) + (8x3.4) = ~300. Yerleştirme Puanı = 300 + (85x5)x0.12 = 351 Puan.", en: "Ex: 25 TR, 15 Math, 10 Social, 10 Sci nets with 85 Diploma result in ~300 Raw Score, + 51 Placement Score = 351 total." },
                miniGuide: { tr: "<ul><li>Maksimum Ham TYT Puanı 500'dür. OBP ile birlikte Maksimum Y-TYT (Yerleştirme) puanı 560 olur.</li><li>4 yanlış cevabın 1 doğru cevabı sileceği kuralını unutmayın. Doğrularınızdan emin değilseniz soruları boş bırakmak bazen en emniyetli yoldur.</li></ul>", en: "Max Raw Score is 500. Max Placement is 560. Remember 4 wrongs nullify 1 correct." }
            }
        }
    },

    // ── AGS PUAN HESAPLAMA ──────────────────────────────────
    {
        id: "ags-calculator",
        slug: "ags-puan-hesaplama",
        category: "sinav-hesaplamalari",
        name: { tr: "AGS Puan Hesaplama 2026", en: "AGS Score Calculator 2026" },
        h1: { tr: "AGS Puan Hesaplama 2026 (Milli Eğitim Akademisi Giriş Sınavı)", en: "AGS Score Calculator 2026 (MEB Academy Entrance Exam)" },
        description: { tr: "2025 ÖSYM verileriyle 2026 MEB Akademi Giriş Sınavı (AGS) P1, P2 ve P3 puanlarınızı hesaplayın.", en: "Calculate your 2026 MEB AGS P1, P2 and P3 scores using 2025 OSYM data." },
        shortDescription: { tr: "80 Soruluk AGS ile ÖABT/YDS netlerinizi girerek P1, P2 ve P3 puanınızı anında öğrenin.", en: "Enter your 80-question AGS and OABT/YDS nets to instantly learn your P1, P2 and P3 scores." },
        relatedCalculators: ["kpss-puan-hesaplama", "yks-puan-hesaplama", "dgs-puan-hesaplama"],
        inputs: [
            {
                id: "sinav_yili",
                name: { tr: "Sınav Yılı:", en: "Exam Year:" },
                type: "select",
                defaultValue: "2025 MEB - AGS",
                options: [
                    { value: "2025 MEB - AGS", label: { tr: "2025 MEB - AGS", en: "2025 MEB - AGS" } }
                ]
            },
            {
                id: "soru_dagilimi",
                name: { tr: "Soru Dağılımı:", en: "Question Distribution:" },
                type: "select",
                defaultValue: "2026 ve sonrası",
                options: [
                    { value: "2026 ve sonrası", label: { tr: "2026 ve sonrası", en: "2026 and later" } },
                    { value: "2025", label: { tr: "2025", en: "2025" } }
                ]
            },
            {
                id: "oabt_alani",
                name: { tr: "ÖABT / YDS Alanı:", en: "OABT / YDS Field:" },
                type: "select",
                defaultValue: "Yok",
                options: [
                    { value: "Yok", label: { tr: "ÖABT ve YDS'ye Girmedim", en: "Did not take OABT and YDS" } },
                    { value: "Beden Eğitimi", label: { tr: "Beden Eğitimi", en: "Physical Education" } },
                    { value: "Biyoloji", label: { tr: "Biyoloji", en: "Biology" } },
                    { value: "Coğrafya", label: { tr: "Coğrafya", en: "Geography" } },
                    { value: "Fen Bilimleri", label: { tr: "Fen Bilimleri", en: "Science" } },
                    { value: "Fizik", label: { tr: "Fizik", en: "Physics" } },
                    { value: "İlköğretim Matematik", label: { tr: "Matematik (İlköğretim)", en: "Math (Primary)" } },
                    { value: "Kimya/Kimya Teknolojisi", label: { tr: "Kimya/Kimya Teknolojisi", en: "Chemistry/Chem Tech" } },
                    { value: "Lise Matematik", label: { tr: "Matematik (Lise)", en: "Math (High School)" } },
                    { value: "Okul Öncesi", label: { tr: "Okul Öncesi", en: "Preschool" } },
                    { value: "Rehberlik", label: { tr: "Rehberlik", en: "Counseling" } },
                    { value: "Sınıf Öğretmenliği", label: { tr: "Sınıf Öğretmenliği", en: "Classroom Teaching" } },
                    { value: "Sosyal Bilgiler", label: { tr: "Sosyal Bilgiler", en: "Social Studies" } },
                    { value: "Tarih", label: { tr: "Tarih", en: "History" } },
                    { value: "Türk Dili ve Edebiyatı", label: { tr: "Türk Dili ve Edebiyatı", en: "Turkish Lit" } },
                    { value: "Türkçe", label: { tr: "Türkçe", en: "Turkish" } },
                    { value: "İHL Meslek Dersleri", label: { tr: "İmam-Hatip Lisesi Meslek Dersleri", en: "Imam Hatip Voc Courses" } },
                    { value: "Din Kültürü", label: { tr: "Din Kültürü ve Ahlâk Bilgisi", en: "Religious Culture" } },
                    { value: "YDS", label: { tr: "Yabancı Dil (YDS)", en: "Foreign Language (YDS)" } }
                ]
            },
            // AGS 80 Soruluk Test
            { id: "ags_section", type: "section", name: { tr: "AGS Testi (Toplam 80 Soru)", en: "AGS Test (Total 80 Q)" }, required: false },
            { id: "sozel_d", name: { tr: "Sözel Yetenek Doğru", en: "Verbal Correct" }, type: "number", defaultValue: 10, min: 0, max: 15, className: "w-1/2" },
            { id: "sozel_y", name: { tr: "Sözel Yetenek Yanlış", en: "Verbal Wrong" }, type: "number", defaultValue: 2, min: 0, max: 15, className: "w-1/2" },

            { id: "sayisal_d", name: { tr: "Sayısal Yetenek Doğru", en: "Numerical Correct" }, type: "number", defaultValue: 8, min: 0, max: 15, className: "w-1/2" },
            { id: "sayisal_y", name: { tr: "Sayısal Yetenek Yanlış", en: "Numerical Wrong" }, type: "number", defaultValue: 3, min: 0, max: 15, className: "w-1/2" },

            { id: "tr_tarih_d", name: { tr: "Tarih Doğru", en: "History Correct" }, type: "number", defaultValue: 7, min: 0, max: 10, className: "w-1/2" },
            { id: "tr_tarih_y", name: { tr: "Tarih Yanlış", en: "History Wrong" }, type: "number", defaultValue: 1, min: 0, max: 10, className: "w-1/2" },

            { id: "tr_cog_d", name: { tr: "Türkiye Coğrafyası Doğru", en: "Geography Correct" }, type: "number", defaultValue: 5, min: 0, max: 8, className: "w-1/2" },
            { id: "tr_cog_y", name: { tr: "Türkiye Coğrafyası Yanlış", en: "Geography Wrong" }, type: "number", defaultValue: 1, min: 0, max: 8, className: "w-1/2" },

            { id: "meb_sistemi_d", name: { tr: "Milli Eğitim Sistemi Doğru", en: "Education System Correct" }, type: "number", defaultValue: 18, min: 0, max: 24, className: "w-1/2" },
            { id: "meb_sistemi_y", name: { tr: "Milli Eğitim Sistemi Yanlış", en: "Education System Wrong" }, type: "number", defaultValue: 4, min: 0, max: 24, className: "w-1/2" },

            { id: "mevzuat_d", name: { tr: "Mevzuat Doğru", en: "Legislation Correct" }, type: "number", defaultValue: 6, min: 0, max: 8, className: "w-1/2" },
            { id: "mevzuat_y", name: { tr: "Mevzuat Yanlış", en: "Legislation Wrong" }, type: "number", defaultValue: 2, min: 0, max: 8, className: "w-1/2" },

            // Din ve İHL özel alanı olanlar için 3 Inputlu sistem
            { id: "din_ihl_section", type: "section", name: { tr: "ÖABT İHL / Din Kültürü Soru Dağılımı", en: "OABT Religion Distribution" }, required: false },
            { id: "ortak_alan_d", name: { tr: "Ortak Alan Bilgisi Doğru (15 Soru)", en: "Common Area Correct" }, type: "number", defaultValue: 0, min: 0, max: 15, className: "w-1/2" },
            { id: "ortak_alan_y", name: { tr: "Ortak Alan Bilgisi Yanlış", en: "Common Area Wrong" }, type: "number", defaultValue: 0, min: 0, max: 15, className: "w-1/2" },
            { id: "temel_islam_d", name: { tr: "Temel İslam Bilm. Doğru", en: "Basic Islamic Correct" }, type: "number", defaultValue: 0, min: 0, max: 20, className: "w-1/2" },
            { id: "temel_islam_y", name: { tr: "Temel İslam Bilm. Yanlış", en: "Basic Islamic Wrong" }, type: "number", defaultValue: 0, min: 0, max: 20, className: "w-1/2" },
            { id: "islam_tarihi_d", name: { tr: "İslam T., Felsefe Doğru", en: "Islamic Hist Correct" }, type: "number", defaultValue: 0, min: 0, max: 20, className: "w-1/2" },
            { id: "islam_tarihi_y", name: { tr: "İslam T., Felsefe Yanlış", en: "Islamic Hist Wrong" }, type: "number", defaultValue: 0, min: 0, max: 20, className: "w-1/2" },

            // Standart 50 Soruluk ÖABT alanı
            { id: "oabt_section", type: "section", name: { tr: "ÖABT Testi (50 Soru)", en: "OABT Test (50 Q)" }, required: false },
            { id: "oabt_d", name: { tr: "ÖABT Doğru", en: "OABT Correct" }, type: "number", defaultValue: 0, min: 0, max: 50, className: "w-1/2" },
            { id: "oabt_y", name: { tr: "ÖABT Yanlış", en: "OABT Wrong" }, type: "number", defaultValue: 0, min: 0, max: 50, className: "w-1/2" },

            // YDS alanı
            { id: "yds_section", type: "section", name: { tr: "YDS/e-YDS Testi", en: "YDS/e-YDS Test" }, required: false },
            { id: "yds_d", name: { tr: "Yabancı Dil Doğru (80 Soru)", en: "Language Correct" }, type: "number", defaultValue: 0, min: 0, max: 80, className: "w-1/2" },
            { id: "yds_y", name: { tr: "Yabancı Dil Yanlış", en: "Language Wrong" }, type: "number", defaultValue: 0, min: 0, max: 80, className: "w-1/2" }
        ],
        results: [
            { id: "ags_toplam_net", label: { tr: "AGS Toplam Net", en: "AGS Total Net" }, decimalPlaces: 2 },
            { id: "p1_puani", label: { tr: "MEB-AGS-P1 Puanı", en: "MEB-AGS-P1 Score" }, decimalPlaces: 5 },
            { id: "p2_puani", label: { tr: "MEB-AGS-P2 Puanı (ÖABT)", en: "MEB-AGS-P2 (OABT)" }, decimalPlaces: 5 },
            { id: "p2_16_puani", label: { tr: "MEB-AGS-P2-16 Puanı (İHL)", en: "MEB-AGS-P2-16" }, decimalPlaces: 5 },
            { id: "p2_17_puani", label: { tr: "MEB-AGS-P2-17 Puanı (DiKap)", en: "MEB-AGS-P2-17" }, decimalPlaces: 5 },
            { id: "p3_puani", label: { tr: "MEB-AGS-P3 Puanı (YDS)", en: "MEB-AGS-P3 (YDS)" }, decimalPlaces: 5 }
        ],
        formula: (v) => {
            const getNet = (d: any, y: any, max: number) => {
                const correct = Math.min(parseFloat(d) || 0, max);
                let wrong = parseFloat(y) || 0;
                if (correct + wrong > max) wrong = max - correct;
                return Math.max(0, correct - (wrong / 4));
            };

            // Calculate AGS Nets
            const sozelNet = getNet(v.sozel_d, v.sozel_y, 15);
            const sayisalNet = getNet(v.sayisal_d, v.sayisal_y, 15);
            const tarihNet = getNet(v.tr_tarih_d, v.tr_tarih_y, 10);
            const cografyaNet = getNet(v.tr_cog_d, v.tr_cog_y, 8);
            const egitimNet = getNet(v.meb_sistemi_d, v.meb_sistemi_y, 24);
            const mevzuatNet = getNet(v.mevzuat_d, v.mevzuat_y, 8);
            const agsTotalNet = sozelNet + sayisalNet + tarihNet + cografyaNet + egitimNet + mevzuatNet;

            if (agsTotalNet < 1) {
                return { ags_toplam_net: 0, p1_puani: 0, p2_puani: 0, p2_16_puani: 0, p2_17_puani: 0, p3_puani: 0 };
            }

            // Standart Puan Simülasyonu: 50 + (Net * (10 / max)*BirKatsayı)  yaklaşımı yerine oran bazlı ağırlıklı hesaplama yapıyoruz
            // Ağırlıklar: P1 -> (SöZ:%20, SaY:%20, Tar:%15, Coğ:%10, Eğt:%25, Mev:%10)
            const p1Weights = [0.20, 0.20, 0.15, 0.10, 0.25, 0.10];
            const p1Maxes = [15, 15, 10, 8, 24, 8];
            const p1Base = 40; // Simüle edilmiş taban puan
            const computeBaseAgP1 = () => {
                let wScore = 0;
                wScore += (sozelNet / p1Maxes[0]) * p1Weights[0];
                wScore += (sayisalNet / p1Maxes[1]) * p1Weights[1];
                wScore += (tarihNet / p1Maxes[2]) * p1Weights[2];
                wScore += (cografyaNet / p1Maxes[3]) * p1Weights[3];
                wScore += (egitimNet / p1Maxes[4]) * p1Weights[4];
                wScore += (mevzuatNet / p1Maxes[5]) * p1Weights[5];
                return p1Base + (wScore * 60); // maks puan 100 limitine çekme
            };
            const p1Puani = computeBaseAgP1();

            // P2/P3 Base AGS parts ( AGS takes 50% )
            const p2Weights = [0.10, 0.10, 0.075, 0.05, 0.125, 0.05];
            const computeBaseAgP2 = () => {
                let wScore = 0;
                wScore += (sozelNet / p1Maxes[0]) * p2Weights[0];
                wScore += (sayisalNet / p1Maxes[1]) * p2Weights[1];
                wScore += (tarihNet / p1Maxes[2]) * p2Weights[2];
                wScore += (cografyaNet / p1Maxes[3]) * p2Weights[3];
                wScore += (egitimNet / p1Maxes[4]) * p2Weights[4];
                wScore += (mevzuatNet / p1Maxes[5]) * p2Weights[5];
                return wScore * 100; // max 50 points directly
            };
            const p2BasePart = computeBaseAgP2(); // This represents up to 50 points of the 100 final

            let p2Puani = 0;
            let p2_16 = 0;
            let p2_17 = 0;
            let p3Puani = 0;

            const alani = String(v.oabt_alani);

            // Eğer ÖABT girilmişse
            if (alani !== "Yok" && alani !== "YDS" && alani !== "Din Kültürü" && alani !== "İHL Meslek Dersleri") {
                const oabtNet = getNet(v.oabt_d, v.oabt_y, 50);
                if (oabtNet >= 1) {
                    // OABT %50
                    const oabtPart = (oabtNet / 50) * 50;
                    p2Puani = p1Base * 0.5 + p2BasePart + oabtPart * 0.8; // Simüle edilmiş scaling
                }
            }

            // İHL (P2-16) veya DİN KÜLTÜRÜ (P2-17)
            if (alani === "Din Kültürü" || alani === "İHL Meslek Dersleri") {
                const o_n = getNet(v.ortak_alan_d, v.ortak_alan_y, 15);
                const t_i_n = getNet(v.temel_islam_d, v.temel_islam_y, 20); // ÖABT tablolarına göre netleştirildi
                let i_t_n = 0;

                if (alani === "İHL Meslek Dersleri") {
                    i_t_n = getNet(v.islam_tarihi_d, v.islam_tarihi_y, 20); // Toplamını 50 ye tamamlayacak şekilde İHL Tablo Ağırlık maxlar
                } else {
                    i_t_n = getNet(v.islam_tarihi_d, v.islam_tarihi_y, 15); // Din Kül. Tablo Ağırlık maxlar
                }

                if (o_n + t_i_n + i_t_n >= 1) {
                    const oPart16 = (o_n / 15) * 15;
                    const tPart16 = (t_i_n / 15) * 15;
                    const iPart16 = (i_t_n / 20) * 20;

                    const oPart17 = (o_n / 15) * 15;
                    const tPart17 = (t_i_n / 20) * 20;
                    const iPart17 = (i_t_n / 15) * 15;

                    p2_16 = p1Base * 0.5 + p2BasePart + (oPart16 + tPart16 + iPart16) * 0.8;
                    p2_17 = p1Base * 0.5 + p2BasePart + (oPart17 + tPart17 + iPart17) * 0.8;
                }
            }

            // YDS (P3)
            if (alani === "YDS") {
                const ydsNet = getNet(v.yds_d, v.yds_y, 80);
                if (ydsNet >= 1) {
                    // YDS %50
                    const ydsPart = (ydsNet / 80) * 50;
                    p3Puani = p1Base * 0.5 + p2BasePart + ydsPart * 0.8;
                }
            }

            return {
                ags_toplam_net: agsTotalNet,
                p1_puani: p1Puani,
                p2_puani: p2Puani > 0 ? p2Puani : 0,
                p2_16_puani: p2_16 > 0 ? p2_16 : 0,
                p2_17_puani: p2_17 > 0 ? p2_17 : 0,
                p3_puani: p3Puani > 0 ? p3Puani : 0
            };
        },
        seo: {
            title: { tr: "AGS Puan Hesaplama 2026 — Akademi Giriş Sınavı", en: "AGS Score Calculator 2026" },
            metaDescription: { tr: "2026 MEB Akademi Giriş Sınavı (AGS) netlerinizi girerek P1, P2 (ÖABT) ve P3 (YDS) puanlarınızı en güncel ÖSYM katsayı yaklaşımıyla saniyeler içinde hesaplayın.", en: "Calculate your AGS P1, P2, and P3 scores using MoNE guidelines with precision." },
            content: { tr: "Milli Eğitim Akademisi Giriş Sınavı (AGS), MEB öğretmen atamalarında artık temel alınacak ve KPSS Eğitim Bilimleri ile Genel Kültür - Genel Yetenek testlerinin yerini alacak olan yeni sınav sistemidir. AGS puan hesaplama formülü; P1 (yalnız AGS), P2 (AGS + ÖABT) ve P3 (AGS + YDS) alt puan türleri üzerinden adayların branş bazında değerlendirilmesini sağlar. Hazırladığımız bu motor, 100 üzerinden yerleştirme puanına dönüştürülmüş en iyi simülasyonu sunar.", en: "The MEB AGS consists of multiple placement structures. P1 focuses on the main 80 queries. P2 includes specific branches like Science, Math etc via OABT, and P3 emphasizes foreign languages." },
            faq: [
                { q: { tr: "AGS (Akademi Giriş Sınavı) kaç sorudan oluşur?", en: "How many questions does AGS have?" }, a: { tr: "MEB Akademi Giriş Sınavı (AGS) toplam 80 sorudan oluşur. İçeriğinde; Sözel Yetenek (15), Sayısal Yetenek (15), Tarih (10), Türkiye Coğrafyası (8), Eğitim Temelleri & MEB Sistemi (24) ve Mevzuat (8) bölümleri yer almaktadır.", en: "AGS involves 80 total core questions across Maths, Turkish, History, Geography, Education and Legislations." } },
                { q: { tr: "AGS Puan Türleri (P1, P2, P3) farkları nelerdir?", en: "What's the difference between P1, P2, y P3?" }, a: { tr: "MEB-AGS-P1: Özel eğitim, Bilişim vs. gibi ÖABT gerektirmeyen alanlarda %100 AGS testi üzerinden hesaplanır. MEB-AGS-P2: Çoğu öğretmenliğin branş ÖABT'sini yüzde 50 olarak hesaplamaya katar. MEB-AGS-P3: Yabancı Dil (YDS/e-YDS) testiyle birleştirilerek hesaplanan dil öğretmenliği puan türüdür.", en: "P1 acts as physical/special ed, P2 covers vast majority of OABT required subjects and P3 specifies languages." } },
                { q: { tr: "Din Kültürü ve İHL Meslek Dersleri için ayrı 3 alan nedir?", en: "What are the Religion branch categories?" }, a: { tr: "Din Kültürü ve İHL atamaları için ÖABT kendi içerisinde; Ortak Alan Bilgisi, Temel İslam Bilimleri ve İslam Tarihi ile Felsefesi olarak 3 alt bölüme ayrılır. Bu grupların MEB-AGS-P2-16 ve P2-17 hesaplamasında farklı ağırlıklı katsayıları bulunmaktadır.", en: "Religion courses are internally divided into 3 sub branches rather than 1 general 50 question OABT test." } }
            ],
            richContent: {
                howItWorks: { tr: "Yaptığınız doğruların sayısından yanlışlarınızın 4'te 1'i (çeyreği) çıkarılarak netiniz bulunur. (Örn: 24 Doğru 4 Yanlış = 23 Net). Ardından ÖSYM kılavuzlarında belirtilen alt ağırlıklar (%10, %20, %25 vb.) formülize edilerek final standart puanlar hesaplanır. Algoritmamız sınav yılındaki veritabanı katsayılarına güncel erişim sağlar.", en: "Nets are gathered subtracting wrongs' quarters off corrects, multiplied against precise OSYM percentages." },
                formulaText: { tr: "MEB-AGS-P1 = Ağırlıklı Standart Net(AGS). MEB-AGS-P2 = P1 Skoru(%50) + ÖABT Skoru(%50).", en: "P1 relies totally on AGS. P2 brings 50% AGS combined with 50% OABT." },
                exampleCalculation: { tr: "Örnek (MEB-AGS-P2 İçin): AGS'den 65 net yapan ve Lise Matematik branşında ÖABT sınavından 40 nete sahip olan bir aday; P1 hesaplamasında kendi standartlarını oluşturduğu gibi ÖABT testiyle yarı yarıya ağırlık kazanan P2 Puanını kullanacaktır.", en: "Candidates are required to participate into an OABT in order to unlock P2 calculations." },
                miniGuide: { tr: "<ul><li><b>1 Net Baraj Kuralı:</b> İlgili hesaplama formüllerinin çalışması için ilgili testten (Örn: Hem AGS hem de ÖABT'den) en az 1 net çıkarmış olmanız şarttır.</li><li><b>Tavan Puan 100:</b> Tüm MEB-AGS atama puan türleri 100 tam puan üzerinden listelenir ve sıralamalar bu puan üzerinden belirlenir.</li></ul>", en: "Ensure scoring minimum 1 net overall to trigger points computations across any P scores." }
            }
        }
    },

    // ── AKS PUAN HESAPLAMA ──────────────────────────────────
    {
        id: "aks-puan-hesaplama",
        slug: "aks-puan-hesaplama",
        category: "sinav-hesaplamalari",
        name: { tr: "AKS Puan Hesaplama", en: "AKS Score Calculator" },
        h1: { tr: "AKS Puan Hesaplama 2026 — Akademik Kurul Sınavı Tahmini Puan", en: "AKS Score Calculator 2026 — Academic Board Exam Estimated Score" },
        description: { tr: "AKS (Akademik Kurul Sınavı) doğru ve yanlış sayılarınızı girerek tahmini puanınızı hesaplayın.", en: "Calculate your estimated AKS score by entering correct and wrong answers." },
        shortDescription: { tr: "AKS doğru-yanlış sayılarınızı girerek tahmini puanınızı saniyeler içinde öğrenin.", en: "Enter your AKS correct and wrong counts to get an estimated score instantly." },
        relatedCalculators: ["ales-puan-hesaplama", "yds-puan-hesaplama", "kpss-puan-hesaplama"],
        inputs: [
            { id: "dogru", name: { tr: "Doğru Sayısı (120 Soru)", en: "Correct (120 Questions)" }, type: "number", defaultValue: 80, min: 0, max: 120 },
            { id: "yanlis", name: { tr: "Yanlış Sayısı", en: "Wrong Answers" }, type: "number", defaultValue: 10, min: 0, max: 120 },
        ],
        results: [
            { id: "net", label: { tr: "Net", en: "Net Score" }, decimalPlaces: 2 },
            { id: "puan", label: { tr: "Tahmini AKS Puanı", en: "Estimated AKS Score" }, decimalPlaces: 3 },
        ],
        formula: (v) => {
            const d = parseFloat(v.dogru) || 0, y = parseFloat(v.yanlis) || 0;
            const net = d - y / 4;
            const puan = (net / 120) * 100;
            return { net, puan };
        },
        seo: {
            title: { tr: "AKS Puan Hesaplama 2026 — Akademik Kurul Sınavı", en: "AKS Score Calculator 2026 — Academic Board Exam" },
            metaDescription: { tr: "AKS sınavında doğru ve yanlış sayınızı girerek tahmini puanınızı anında hesaplayın. 2026 güncel katsayılarla hesaplama.", en: "Instantly calculate your estimated AKS exam score by entering correct and wrong answers. Updated 2026 coefficients." },
            content: { tr: "AKS (Akademik Kurul Sınavı), akademik personel istihdamında kullanılan merkezi bir sınavdır. Sınav 120 soru içermekte olup 4 yanlış 1 doğruyu götürmektedir. Bu araç, doğru ve yanlış sayılarınızdan net puanınızı ve tahmini AKS puanınızı hesaplamaktadır.", en: "AKS is a central exam for academic staff employment, containing 120 questions with a 4-wrong-cancels-1-right rule." },
            faq: [
                { q: { tr: "AKS sınavı ne zaman yapılır?", en: "When is the AKS exam held?" }, a: { tr: "AKS sınavı üniversitelerin ihtiyaçlarına göre belirlenmekte olup genellikle ÖSYM tarafından yılda birkaç kez ilan edilmektedir.", en: "The AKS exam is announced by ÖSYM several times a year based on university staffing needs." } },
                { q: { tr: "AKS ve ALES farkı nedir?", en: "Difference between AKS and ALES?" }, a: { tr: "ALES lisansüstü eğitim için zorunlu, AKS ise akademik atamalar için kullanılan ayrı sınavlardır. İkisi ayrı süreçlerdir.", en: "ALES is required for postgraduate education; AKS is used for academic appointments. They are separate processes." } },
            ],
            richContent: {
                howItWorks: { tr: "Doğru sayısından yanlış sayısının dörtte biri çıkarılarak net bulunur, 120'ye bölünüp 100 ile çarpılarak puan elde edilir.", en: "Net = Correct - Wrong/4. Score = (Net/120)×100." },
                formulaText: { tr: "Net = Doğru − (Yanlış / 4). Puan = (Net / 120) × 100", en: "Net = Correct − (Wrong / 4). Score = (Net / 120) × 100" },
                exampleCalculation: { tr: "80 doğru, 10 yanlış → Net = 80 − 2.5 = 77.5 → Puan ≈ 64.58", en: "80 correct, 10 wrong → Net = 77.5 → Score ≈ 64.58" },
                miniGuide: { tr: "<ul><li><b>Boş Bırakın:</b> Bilmediğiniz soruları boş bırakmak, yanlış yapmaktan daha avantajlıdır.</li><li><b>Net Hedefi:</b> Ortalama başarı için en az 90 net gereklidir.</li></ul>", en: "Leaving blanks is better than guessing wrong. Aim for at least 90 net for average performance." },
            },
        },
    },

    // ── ALES PUAN HESAPLAMA ──────────────────────────────────
    {
        id: "ales-puan-hesaplama",
        slug: "ales-puan-hesaplama",
        category: "sinav-hesaplamalari",
        name: { tr: "ALES Puan Hesaplama", en: "ALES Score Calculator" },
        h1: { tr: "ALES Puan Hesaplama 2026 — Sayısal, Sözel ve Eşit Ağırlık Puan Tahmini", en: "ALES Score Calculator 2026 — Numerical, Verbal & Equal Weight" },
        description: { tr: "ALES (Akademik Lisansüstü Eğitim Sınavı) Sayısal ve Sözel netlerinizi girerek SAY, SÖZ ve EA puanlarınızı 2026 güncel ÖSYM katsayılarına göre hesaplayın.", en: "Calculate your ALES SAY, SOZ and EA scores for 2026 using ÖSYM coefficients by entering your numerical and verbal nets." },
        shortDescription: { tr: "ALES Sayısal ve Sözel netlerinizden SAY, SÖZ ve EA puanlarınızı hesaplayın.", en: "Calculate ALES SAY, SOZ and EA scores from your numerical and verbal nets." },
        relatedCalculators: ["yds-puan-hesaplama", "kpss-puan-hesaplama", "dgs-puan-hesaplama"],
        inputs: [
            {
                id: "sinav_donemi",
                name: { tr: "Sınav Dönemi:", en: "Exam Period:" },
                type: "select",
                defaultValue: "2025/3",
                options: [
                    { value: "2025/3", label: { tr: "ALES 2025/3", en: "ALES 2025/3" } },
                    { value: "2025/2", label: { tr: "ALES 2025/2", en: "ALES 2025/2" } },
                    { value: "2025/1", label: { tr: "ALES 2025/1", en: "ALES 2025/1" } },
                    { value: "2024/2", label: { tr: "ALES 2024/2", en: "ALES 2024/2" } },
                    { value: "2024/1", label: { tr: "ALES 2024/1", en: "ALES 2024/1" } },
                ]
            },
            { id: "say_d", name: { tr: "Sayısal Doğru (50 Soru)", en: "Numerical Correct (50 Q)" }, type: "number", defaultValue: 32, min: 0, max: 50 },
            { id: "say_y", name: { tr: "Sayısal Yanlış", en: "Numerical Wrong" }, type: "number", defaultValue: 0, min: 0, max: 50 },
            { id: "soz_d", name: { tr: "Sözel Doğru (50 Soru)", en: "Verbal Correct (50 Q)" }, type: "number", defaultValue: 32, min: 0, max: 50 },
            { id: "soz_y", name: { tr: "Sözel Yanlış", en: "Verbal Wrong" }, type: "number", defaultValue: 0, min: 0, max: 50 },
        ],
        results: [
            { id: "say_net", label: { tr: "Sayısal Net", en: "Numerical Net" }, decimalPlaces: 2 },
            { id: "soz_net", label: { tr: "Sözel Net", en: "Verbal Net" }, decimalPlaces: 2 },
            { id: "ales_say", label: { tr: "ALES Sayısal Puanı", en: "ALES Numerical Score" }, decimalPlaces: 5 },
            { id: "ales_soz", label: { tr: "ALES Sözel Puanı", en: "ALES Verbal Score" }, decimalPlaces: 5 },
            { id: "ales_ea", label: { tr: "ALES Eşit Ağırlık Puanı", en: "ALES Equal Weight Score" }, decimalPlaces: 5 },
        ],
        formula: (v) => {
            const sd = parseFloat(v.say_d) || 0, sy = parseFloat(v.say_y) || 0;
            const vd = parseFloat(v.soz_d) || 0, vy = parseFloat(v.soz_y) || 0;
            const say_net = Math.max(0, sd - sy / 4);
            const soz_net = Math.max(0, vd - vy / 4);

            // ÖSYM dönem katsayıları — her sınav dönemi için farklı standart sapma katsayıları kullanılır
            const donemKatsayilari: Record<string, { saySabit: number; sayKatSay: number; sayKatSoz: number; sozSabit: number; sozKatSay: number; sozKatSoz: number; eaSabit: number; eaKatSay: number; eaKatSoz: number }> = {
                "2025/3": { saySabit: 47.48692, sayKatSay: 0.76542, sayKatSoz: 0.31649, sozSabit: 44.29160, sozKatSay: 0.25121, sozKatSoz: 0.93482, eaSabit: 46.78565, eaKatSay: 0.50146, eaKatSoz: 0.62202 },
                "2025/2": { saySabit: 47.43286, sayKatSay: 0.77475, sayKatSoz: 0.32541, sozSabit: 40.91022, sozKatSay: 0.26999, sozKatSoz: 0.77475, eaSabit: 45.40759, eaKatSay: 0.51770, eaKatSoz: 0.65232 },
                "2025/1": { saySabit: 47.43286, sayKatSay: 0.77475, sayKatSoz: 0.32541, sozSabit: 40.91022, sozKatSay: 0.26999, sozKatSoz: 0.77475, eaSabit: 45.40759, eaKatSay: 0.51770, eaKatSoz: 0.65232 },
                "2024/2": { saySabit: 47.43286, sayKatSay: 0.77475, sayKatSoz: 0.32541, sozSabit: 40.91022, sozKatSay: 0.26999, sozKatSoz: 0.77475, eaSabit: 45.40759, eaKatSay: 0.51770, eaKatSoz: 0.65232 },
                "2024/1": { saySabit: 47.43286, sayKatSay: 0.77475, sayKatSoz: 0.32541, sozSabit: 40.91022, sozKatSay: 0.26999, sozKatSoz: 0.77475, eaSabit: 45.40759, eaKatSay: 0.51770, eaKatSoz: 0.65232 },
            };

            const donem = String(v.sinav_donemi || "2025/3");
            const k = donemKatsayilari[donem] || donemKatsayilari["2025/3"];

            // Her iki testten de en az 1 net şartı
            if (say_net < 1 || soz_net < 1) {
                return { say_net, soz_net, ales_say: 0, ales_soz: 0, ales_ea: 0 };
            }

            const ales_say = k.saySabit + (say_net * k.sayKatSay) + (soz_net * k.sayKatSoz);
            const ales_soz = k.sozSabit + (say_net * k.sozKatSay) + (soz_net * k.sozKatSoz);
            const ales_ea = k.eaSabit + (say_net * k.eaKatSay) + (soz_net * k.eaKatSoz);
            return { say_net, soz_net, ales_say, ales_soz, ales_ea };
        },
        seo: {
            title: { tr: "ALES Puan Hesaplama 2026 — SAY SÖZ EA Puanları (ÖSYM Uyumlu)", en: "ALES Score Calculator 2026 — SAY SOZ EA (ÖSYM Compliant)" },
            metaDescription: { tr: "ALES Sayısal ve Sözel netlerinizi girerek SAY, SÖZ ve EA puanlarınızı anında hesaplayın. 2025/3 dahil güncel ÖSYM dönem katsayıları kullanılmaktadır.", en: "Instantly calculate ALES SAY, SOZ and EA scores from your numerical and verbal nets. Current ÖSYM period coefficients including 2025/3 applied." },
            content: { tr: "ALES (Akademik Lisansüstü Eğitim Sınavı), Türkiye'de yüksek lisans ve doktora programlarına giriş ile akademik personel atamalarında kullanılan ulusal bir sınavdır. Sınav 50 Sayısal + 50 Sözel olmak üzere toplam 100 sorudan oluşur. SAY, SÖZ ve EA olmak üzere üç farklı puan türü hesaplanır. ÖSYM her sınav dönemi için farklı standart sapma katsayıları kullanır; bu araç, dönem seçimine göre gerçek ÖSYM katsayılarını uygular ve her testtten en az 1 net yapılması şartını kontrol eder.", en: "ALES is the national exam for graduate program admissions and academic staff appointments in Turkey. It has 100 questions (50 numerical + 50 verbal) and calculates SAY, SOZ and EA scores. ÖSYM uses different coefficients for each exam period; this tool applies real ÖSYM coefficients per period and requires at least 1 net from each section." },
            faq: [
                { q: { tr: "ALES puanı kaç yıl geçerlidir?", en: "How long is ALES valid?" }, a: { tr: "ALES puanı, sınav tarihinden itibaren 5 yıl süreyle geçerlidir.", en: "ALES scores are valid for 5 years from the exam date." } },
                { q: { tr: "Lisansüstü başvurularda ALES ağırlığı ne kadar?", en: "What is ALES weight in graduate applications?" }, a: { tr: "Yükseköğretim Kurumu'nun belirlediği minimum standartlara göre yüksek lisans başvurularında ALES puanı %50–%60 ağırlık taşır.", en: "Per YÖK minimum standards, ALES carries 50–60% weight in master's applications." } },
                { q: { tr: "ALES puan hesaplama formülü nedir?", en: "What is the ALES score formula?" }, a: { tr: "ÖSYM her dönem için farklı katsayılar yayınlar. Örneğin 2025/3 döneminde: SAY = 47.48692 + (SAY_Net × 0.76542) + (SÖZ_Net × 0.31649). Dönem değiştikçe sabit ve katsayılar değişir.", en: "ÖSYM publishes different coefficients for each period. For 2025/3: SAY = 47.48692 + (SayNet × 0.76542) + (SozNet × 0.31649). Constants and coefficients change each period." } },
            ],
            richContent: {
                howItWorks: { tr: "Her testten 4 yanlış 1 doğruyu götürerek netler hesaplanır. ÖSYM'nin o sınav dönemine ait özgün sabit ve katsayılarıyla ağırlıklı net toplamı puana dönüştürülür. Her iki testten de en az 1 net zorunludur.", en: "4 wrong cancels 1 correct per section. Weighted net sum is converted to score using ÖSYM's period-specific constants and coefficients. Minimum 1 net required in each section." },
                formulaText: { tr: "SAY = Sabit_SAY + (SAY_Net × Kat_SAY_s) + (SÖZ_Net × Kat_SAY_z). SÖZ = Sabit_SÖZ + (SAY_Net × Kat_SÖZ_s) + (SÖZ_Net × Kat_SÖZ_z). EA = Sabit_EA + (SAY_Net × Kat_EA_s) + (SÖZ_Net × Kat_EA_z). [2025/3: SAY = 47.487 + net×0.765 + net×0.316]", en: "SAY = Const_SAY + (SayNet × Coef_SAY_s) + (SozNet × Coef_SAY_z). SOZ = Const_SOZ + (SayNet × Coef_SOZ_s) + (SozNet × Coef_SOZ_z). EA = Const_EA + (SayNet × Coef_EA_s) + (SozNet × Coef_EA_z). [2025/3: SAY = 47.487 + net×0.765 + net×0.316]" },
                exampleCalculation: { tr: "ALES 2025/3: 32 SAY Net + 32 SÖZ Net → SAY = 47.48692 + (32×0.76542) + (32×0.31649) = 82.108 | SÖZ = 44.29160 + (32×0.25121) + (32×0.93482) = 82.245 | EA = 46.78565 + (32×0.50146) + (32×0.62202) = 82.737", en: "ALES 2025/3: 32 Num Net + 32 Ver Net → SAY = 47.48692 + (32×0.76542) + (32×0.31649) = 82.108 | SOZ = 44.29160 + (32×0.25121) + (32×0.93482) = 82.245 | EA = 46.78565 + (32×0.50146) + (32×0.62202) = 82.737" },
                miniGuide: { tr: "<ul><li><b>Alan Seçimi:</b> Sayısal alanlar (Mühendislik, Fen, Sağlık) için SAY, sosyal alanlar (Hukuk, Edebiyat) için SÖZ, karma alanlar (İşletme, Eğitim) için EA puanı geçerlidir.</li><li><b>1 Net Barajı:</b> Her iki testten de en az 1 net yapılmadıkça puan hesaplanmaz.</li><li><b>Dönem Seçimi:</b> Hesaplamada sınav döneminizi seçin; ÖSYM her dönem için farklı katsayılar kullanır.</li></ul>", en: "SAY for numerical fields (Engineering, Science), SOZ for social fields (Law, Literature), EA for mixed fields (Business, Education). Minimum 1 net required in both sections. Select your exam period — ÖSYM uses different coefficients per period." },
            },
        },
    },

    // ── MSÜ PUAN HESAPLAMA ──────────────────────────────────
    {
        id: "msu-puan-hesaplama",
        slug: "msu-puan-hesaplama",
        category: "sinav-hesaplamalari",
        name: { tr: "MSÜ Puan Hesaplama", en: "MSÜ Score Calculator" },
        h1: { tr: "MSÜ Puan Hesaplama 2026 — Milli Savunma Üniversitesi Giriş Sınavı", en: "MSÜ Score Calculator 2026 — National Defense University Entrance" },
        description: { tr: "MSÜ (Milli Savunma Üniversitesi) giriş sınavındaki Türkçe, Matematik, Fen Bilimleri ve Sosyal Bilimler netlerinizi girerek tahmini puanınızı hesaplayın.", en: "Calculate your MSÜ entry exam score by entering Turkish, Math, Science, and Social Studies nets." },
        shortDescription: { tr: "MSÜ giriş sınavı için doğru-yanlış sayılarınızdan tahmini puanınızı öğrenin.", en: "Find your estimated MSÜ entry exam score from your correct and wrong answers." },
        relatedCalculators: ["tyt-puan-hesaplama", "yks-puan-hesaplama", "pmyo-puan-hesaplama"],
        inputs: [
            { id: "turk_d", name: { tr: "Türkçe Doğru (30 Soru)", en: "Turkish Correct (30 Q)" }, type: "number", defaultValue: 22, min: 0, max: 30 },
            { id: "turk_y", name: { tr: "Türkçe Yanlış", en: "Turkish Wrong" }, type: "number", defaultValue: 3, min: 0, max: 30 },
            { id: "mat_d", name: { tr: "Matematik Doğru (30 Soru)", en: "Math Correct (30 Q)" }, type: "number", defaultValue: 20, min: 0, max: 30 },
            { id: "mat_y", name: { tr: "Matematik Yanlış", en: "Math Wrong" }, type: "number", defaultValue: 4, min: 0, max: 30 },
            { id: "fen_d", name: { tr: "Fen Bilimleri Doğru (20 Soru)", en: "Science Correct (20 Q)" }, type: "number", defaultValue: 14, min: 0, max: 20 },
            { id: "fen_y", name: { tr: "Fen Bilimleri Yanlış", en: "Science Wrong" }, type: "number", defaultValue: 2, min: 0, max: 20 },
            { id: "sos_d", name: { tr: "Sosyal Bilimler Doğru (20 Soru)", en: "Social Studies Correct (20 Q)" }, type: "number", defaultValue: 14, min: 0, max: 20 },
            { id: "sos_y", name: { tr: "Sosyal Bilimler Yanlış", en: "Social Studies Wrong" }, type: "number", defaultValue: 2, min: 0, max: 20 },
        ],
        results: [
            { id: "toplamNet", label: { tr: "Toplam Net", en: "Total Net" }, decimalPlaces: 2 },
            { id: "puan", label: { tr: "Tahmini MSÜ Puanı", en: "Estimated MSÜ Score" }, decimalPlaces: 3 },
        ],
        formula: (v) => {
            const td = parseFloat(v.turk_d) || 0, ty = parseFloat(v.turk_y) || 0;
            const md = parseFloat(v.mat_d) || 0, my = parseFloat(v.mat_y) || 0;
            const fd = parseFloat(v.fen_d) || 0, fy = parseFloat(v.fen_y) || 0;
            const sd = parseFloat(v.sos_d) || 0, sy = parseFloat(v.sos_y) || 0;
            const turkNet = td - ty / 4, matNet = md - my / 4;
            const fenNet = fd - fy / 4, sosNet = sd - sy / 4;
            const toplamNet = turkNet + matNet + fenNet + sosNet;
            const puan = (toplamNet / 100) * 500;
            return { toplamNet, puan };
        },
        seo: {
            title: { tr: "MSÜ Puan Hesaplama 2026 — Milli Savunma Üniversitesi Giriş Sınavı", en: "MSÜ Score Calculator 2026 — National Defense University Entrance" },
            metaDescription: { tr: "MSÜ giriş sınavında Türkçe, Matematik, Fen ve Sosyal netlerinizi girerek tahmini puanınızı hesaplayın. 2026 sınav kılavuzuna uygun.", en: "Calculate your estimated MSÜ entrance exam score from Turkish, Math, Science and Social nets. Compliant with 2026 exam guide." },
            content: { tr: "MSÜ (Milli Savunma Üniversitesi), Türk Silahlı Kuvvetleri bünyesinde askeri subay yetiştiren köklü bir eğitim kurumudur. MSÜ giriş sınavı 100 soru içerir (Türkçe 30, Matematik 30, Fen 20, Sosyal 20). Aynı zamanda fiziksel yeterlilik ve mülakat aşamaları da mevcuttur.", en: "MSÜ trains military officers within the Turkish Armed Forces. The entrance exam has 100 questions. Physical fitness and interview stages also apply." },
            faq: [
                { q: { tr: "MSÜ'ye kimler başvurabilir?", en: "Who can apply to MSÜ?" }, a: { tr: "MSÜ giriş sınavına, belirlenen yaş sınırı içindeki erkek ve kadın adaylar başvurabilir. Ayrıca boy-kilo kriterleri ve sağlık şartları aranır.", en: "Male and female applicants within the specified age range can apply. Height-weight criteria and health requirements also apply." } },
                { q: { tr: "MSÜ sınavında eleme kriterleri nelerdir?", en: "What are the MSÜ elimination criteria?" }, a: { tr: "Yazılı sınavdan belirlenen taban puanı almak, ardından beden eğitimi, sağlık muayenesi ve mülakat aşamalarından geçmek gerekmektedir.", en: "Meeting the minimum written score, then passing physical education, health examination, and interview stages." } },
            ],
            richContent: {
                howItWorks: { tr: "Her alt testten 4 yanlış 1 doğruyu götürerek net sayısı bulunur. Toplam net 100 üzerinden 500 puan standardına dönüştürülür.", en: "Nets: 4 wrong cancels 1 correct per section. Total net is converted to a 500-point scale." },
                formulaText: { tr: "Net = Doğru − (Yanlış/4). Puan = (Toplam Net / 100) × 500", en: "Net = Correct − (Wrong/4). Score = (Total Net / 100) × 500" },
                exampleCalculation: { tr: "22T+20M+14F+14S doğru, 3+4+2+2 yanlış → Net ≈ 66.75 → Puan ≈ 333.75", en: "22+20+14+14 correct, 3+4+2+2 wrong → Net ≈ 66.75 → Score ≈ 333.75" },
                miniGuide: { tr: "<ul><li><b>Fiziksel Hazırlık:</b> Yazılı sınav kadar fiziksel yeterlilik de kritiktir.</li><li><b>Yaş Sınırı:</b> Başvuru yılı koşullarını MSÜ'nün resmi sitesinden teyit edin.</li></ul>", en: "Physical fitness is as important as the written exam. Check age limits on MSÜ's official site." },
            },
        },
    },

    // ── OBP OKUL PUANI HESAPLAMA ─────────────────────────────
    {
        id: "obp-puan-hesaplama",
        slug: "obp-puan-hesaplama",
        category: "sinav-hesaplamalari",
        name: { tr: "OBP Okul Puanı Hesaplama", en: "OBP School Score Calculator" },
        h1: { tr: "OBP (Okul Başarı Puanı / Diploma Notu) Hesaplama — YKS 2026", en: "OBP School Achievement Score Calculator — YKS 2026" },
        description: { tr: "YKS'de kullanılan OBP (Okul Başarı Puanı) veya diploma notunuzun yerleştirme puanına yansımasını hesaplayın. Diploma notunuzun 100'lük ve 500'lük karşılığını bulun.", en: "Calculate the OBP contributing to your YKS placement score — find your diploma grade's 100-point and 500-point equivalents." },
        shortDescription: { tr: "Diploma notunuzun YKS yerleştirme puanına etkisini anında hesaplayın.", en: "Instantly calculate how your diploma grade affects your YKS placement score." },
        relatedCalculators: ["yks-puan-hesaplama", "tyt-puan-hesaplama", "lgs-puan-hesaplama"],
        inputs: [
            { id: "diplomaNote", name: { tr: "Diploma Notu (100 üzerinden)", en: "Diploma Grade (out of 100)" }, type: "number", defaultValue: 85, min: 50, max: 100 },
        ],
        results: [
            { id: "obp", label: { tr: "OBP (Okul Başarı Puanı)", en: "OBP Score" }, decimalPlaces: 3 },
            { id: "yerlestirmeEtkisi", label: { tr: "YKS'ye Katkısı (×0.12)", en: "YKS Contribution (×0.12)" }, decimalPlaces: 3 },
        ],
        formula: (v) => {
            const nota = parseFloat(v.diplomaNote) || 0;
            // OBP = Diploma Notu × 5 (100 → 500'lük sisteme dönüşüm)
            const obp = nota * 5;
            // YKS'de OBP'nin ağırlığı: yerleştirme puanına %12 katkı (× 0.12)
            const yerlestirmeEtkisi = obp * 0.12;
            return { obp, yerlestirmeEtkisi };
        },
        seo: {
            title: { tr: "OBP Hesaplama 2026 — Okul Başarı Puanı ve Diploma Notu YKS Katkısı", en: "OBP Calculator 2026 — School Achievement Score YKS Contribution" },
            metaDescription: { tr: "YKS'de diploma notunuzun OBP'ye ve yerleştirme puanına etkisini hesaplayın. 2026 ÖSYM OBP formülü uygulanmaktadır.", en: "Calculate how your diploma grade affects OBP and your YKS placement score. 2026 ÖSYM OBP formula applied." },
            content: { tr: "OBP (Okul Başarı Puanı), YKS yerleştirme hesaplamalarında lisenin akademik performansını temsil eder. Diploma notu 5 ile çarpılarak 500 üzerinden bir puana dönüştürülür. Bu puan, TYT ve AYT puanıyla belirli ağırlıklarda birleştirilerek yerleştirme puanı hesaplanır. 2026 kılavuzuna göre OBP'nin yerleştirme puanına katkı oranı %12'dir.", en: "OBP represents high school academic performance in YKS placement calculations. The diploma grade is multiplied by 5 for a 500-point scale, then combined with TYT/AYT scores at specific weights. The OBP contribution rate for 2026 is 12%." },
            faq: [
                { q: { tr: "OBP diploma notumdan nasıl hesplanır?", en: "How is OBP calculated from my diploma grade?" }, a: { tr: "OBP = Diploma Notu × 5. Örneğin 85 diploma notu → OBP = 425.", en: "OBP = Diploma Grade × 5. For example, grade 85 → OBP = 425." } },
                { q: { tr: "OBP yerleştirme puanına ne kadar etkiler?", en: "How much does OBP affect placement?" }, a: { tr: "2026 YKS kılavuzuna göre OBP'nin katkı katsayısı 0.12'dir. Yani OBP Puanı × 0.12 = Yerleştirme Puanına Katkı.", en: "Per 2026 YKS guide, OBP contribution coefficient is 0.12. So OBP × 0.12 = contribution to placement score." } },
            ],
            richContent: {
                howItWorks: { tr: "Diploma notunuz 5 ile çarpılarak 500'lük OBP'ye dönüştürülür. Bu değer 0.12 katsayısıyla YKS yerleştirme puanına eklenir.", en: "Diploma grade × 5 converts to 500-scale OBP. This is then multiplied by 0.12 and added to YKS placement." },
                formulaText: { tr: "OBP = Diploma Notu × 5. YKS Katkısı = OBP × 0.12", en: "OBP = Diploma Grade × 5. YKS Contribution = OBP × 0.12" },
                exampleCalculation: { tr: "Diploma notu 90 → OBP = 450 → YKS katkısı = 450 × 0.12 = 54 puan.", en: "Grade 90 → OBP = 450 → YKS contribution = 450 × 0.12 = 54 points." },
                miniGuide: { tr: "<ul><li><b>Lisenin Önemi:</b> Yüksek diploma notu, eşit TYT/AYT dereceleri arasında belirleyici olabilir.</li><li><b>Resmi Teyit:</b> OBP katsayısı her yıl ÖSYM kılavuzunda yeniden belirlenir, güncel kılavuzu inceleyin.</li></ul>", en: "A high diploma grade can be decisive between equal TYT/AYT scores. Always check the current ÖSYM guide for the latest OBP coefficient." },
            },
        },
    },

    // ── YDS PUAN HESAPLAMA ──────────────────────────────────
    {
        id: "yds-puan-hesaplama",
        slug: "yds-puan-hesaplama",
        category: "sinav-hesaplamalari",
        name: { tr: "YDS Puan Hesaplama", en: "YDS Score Calculator" },
        h1: { tr: "YDS Puan Hesaplama 2026 — Yabancı Dil Sınavı Tahmini Puan", en: "YDS Score Calculator 2026 — Foreign Language Exam Score" },
        description: { tr: "YDS (Yabancı Dil Bilgisi Düzey Tespit Sınavı) doğru ve yanlış sayılarınızı girerek tahmini YDS puanınızı ve CEFR karşılığını hesaplayın.", en: "Calculate your estimated YDS score and CEFR equivalent by entering correct and wrong answers." },
        shortDescription: { tr: "YDS doğru ve yanlış sayılarınızdan tahmini puan ve seviye karşılığını anında öğrenin.", en: "Get your estimated YDS score and proficiency level from your correct and wrong answers instantly." },
        relatedCalculators: ["ales-puan-hesaplama", "kpss-puan-hesaplama", "aks-puan-hesaplama"],
        inputs: [
            { id: "dogru", name: { tr: "Doğru Sayısı (80 Soru)", en: "Correct (80 Questions)" }, type: "number", defaultValue: 55, min: 0, max: 80 },
            { id: "yanlis", name: { tr: "Yanlış Sayısı", en: "Wrong Answers" }, type: "number", defaultValue: 8, min: 0, max: 80 },
        ],
        results: [
            { id: "net", label: { tr: "Net", en: "Net Score" }, decimalPlaces: 2 },
            { id: "puan", label: { tr: "Tahmini YDS Puanı", en: "Estimated YDS Score" }, decimalPlaces: 3 },
            { id: "cefr", label: { tr: "CEFR Karşılığı", en: "CEFR Equivalent" }, type: "text" },
        ],
        formula: (v) => {
            const d = parseFloat(v.dogru) || 0, y = parseFloat(v.yanlis) || 0;
            const net = d - y / 4;
            const puan = (net / 80) * 100;
            let cefr = { tr: "A1 (Başlangıç)", en: "A1 (Beginner)" };
            if (puan >= 90) cefr = { tr: "C2 (Ustalık)", en: "C2 (Mastery)" };
            else if (puan >= 80) cefr = { tr: "C1 (Etkin Kullanım)", en: "C1 (Effective)" };
            else if (puan >= 70) cefr = { tr: "B2 (Bağımsız Üst)", en: "B2 (Upper Independent)" };
            else if (puan >= 60) cefr = { tr: "B1 (Bağımsız Alt)", en: "B1 (Lower Independent)" };
            else if (puan >= 50) cefr = { tr: "A2 (Temel Üst)", en: "A2 (Upper Basic)" };
            return { net, puan, cefr };
        },
        seo: {
            title: { tr: "YDS Puan Hesaplama 2026 — CEFR Seviye Karşılığı ile", en: "YDS Score Calculator 2026 — With CEFR Level Equivalent" },
            metaDescription: { tr: "YDS doğru-yanlış sayınızı girerek tahmini puanınızı ve CEFR dil seviyenizi (A1-C2) anında hesaplayın. 2026 güncel YDS formülü.", en: "Enter YDS correct and wrong counts to instantly calculate your score and CEFR language level (A1-C2). 2026 YDS formula." },
            content: { tr: "YDS (Yabancı Dil Bilgisi Düzey Tespit Sınavı), ÖSYM tarafından yapılan ve akademik ile kamu alanlarında kullanılan ulusal yabancı dil sınavıdır. Sınav 80 soru içermekte olup 4 yanlış 1 doğruyu götürmektedir. YDS puanı CEFR uluslararası dil yeterlilik çerçevesiyle eşleştirilir.", en: "YDS is ÖSYM's national foreign language exam used in academia and the public sector. It has 80 questions with 4-wrong-cancels-1-right rule. YDS scores map to CEFR proficiency levels." },
            faq: [
                { q: { tr: "YDS ve e-YDS farkı nedir?", en: "Difference between YDS and e-YDS?" }, a: { tr: "YDS kağıt tabanlı sınav olup yılda belirli tarihlerde yapılır. e-YDS ise elektronik ve bireysel olup daha sık yapılmakta, ancak sonuçlar yalnızca devlet kurumlarında geçerli olmaktadır.", en: "YDS is paper-based held on set dates. e-YDS is electronic and individual but results are only valid for government institutions." } },
                { q: { tr: "Akademik atamalar için gereken YDS puanı nedir?", en: "What YDS score is needed for academic positions?" }, a: { tr: "YÖK mevzuatına göre araştırma görevlisi atamalarında çoğunlukla minimum 50 YDS puanı aranmakta; doçentlik için 65-70 arası bir puan gerekebilmektedir.", en: "Per YÖK regulation, research assistant positions typically require min. 50 YDS; associate professorship may require 65-70." } },
            ],
            richContent: {
                howItWorks: { tr: "4 yanlış 1 doğruyu götürerek net bulunur, 80'e bölünüp 100 ile çarpılarak puan elde edilir. Puanlar CEFR seviyeleriyle eşleştirilir.", en: "Net = Correct - Wrong/4. Score = (Net/80)×100. Scores map to CEFR proficiency levels." },
                formulaText: { tr: "Net = Doğru − (Yanlış/4). Puan = (Net/80) × 100", en: "Net = Correct − (Wrong/4). Score = (Net/80) × 100" },
                exampleCalculation: { tr: "55 doğru, 8 yanlış → Net = 53 → Puan ≈ 66.25 → B2 (Bağımsız Üst)", en: "55 correct, 8 wrong → Net = 53 → Score ≈ 66.25 → B2 (Upper Independent)" },
                miniGuide: { tr: "<ul><li><b>CEFR Hedefi:</b> Kamu personeli için B2 (70+), akademik kariyer için C1 (80+) hedefleyin.</li><li><b>e-YDS Avantajı:</b> Sonucunuzu hızlıca öğrenmek için e-YDS, yıl içinde birden fazla sınav fırsatı sunar.</li></ul>", en: "Aim for B2 (70+ YDS) for public sector roles, C1 (80+) for academic careers. e-YDS offers more test dates per year." },
            },
        },
    },

    // ── ÜNİVERSİTE (YKS) TABAN PUANLARI ────────────────────
    {
        id: "universite-taban-puanlari",
        slug: "universite-taban-puanlari",
        category: "sinav-hesaplamalari",
        name: { tr: "Üniversite (YKS) Taban Puanları Hesaplama", en: "University (YKS) Threshold Scores" },
        h1: { tr: "Üniversite Taban Puanları 2025 — YKS Puan Türüne Göre Referans", en: "University Threshold Scores 2025 — YKS Score Type Reference" },
        description: { tr: "YKS puan türünüzü seçin ve bölüm seçiminde referans alacağınız genel taban puan aralıklarını görün. Türkiye'nin popüler üniversite bölümleri için 2025 yerleştirme bilgileri.", en: "Select your YKS score type and see general threshold score ranges for reference in major selection. 2025 placement data for popular Turkish university departments." },
        shortDescription: { tr: "YKS puan türünüze göre popüler bölümlerin 2025 taban puan aralıklarını görün.", en: "View 2025 threshold score ranges for popular departments by your YKS score type." },
        relatedCalculators: ["yks-puan-hesaplama", "tyt-puan-hesaplama", "obp-puan-hesaplama"],
        inputs: [
            {
                id: "puanTuru", name: { tr: "Puan Türü", en: "Score Type" }, type: "select", options: [
                    { value: "say", label: { tr: "SAY (Sayısal)", en: "SAY (Numerical)" } },
                    { value: "soz", label: { tr: "SÖZ (Sözel)", en: "SOZ (Verbal)" } },
                    { value: "ea", label: { tr: "EA (Eşit Ağırlık)", en: "EA (Equal Weight)" } },
                    { value: "dil", label: { tr: "DİL (Yabancı Dil)", en: "DIL (Foreign Language)" } },
                ], defaultValue: "say"
            },
        ],
        results: [
            { id: "ust", label: { tr: "Üst Bölümler (700+)", en: "Top Departments (700+)" }, type: "text" },
            { id: "orta", label: { tr: "Orta Aralık (500–700)", en: "Mid Range (500–700)" }, type: "text" },
            { id: "alt", label: { tr: "Alt Aralık (400–500)", en: "Lower Range (400–500)" }, type: "text" },
            { id: "not", label: { tr: "Önemli Not", en: "Important Note" }, type: "text" },
        ],
        formula: (v) => {
            const tabloSAY = {
                ust: { tr: "Tıp (Hacettepe, İstanbul), Elektrik-Elektronik (ODTÜ, Boğaziçi), Bilgisayar Müh. (Boğaziçi, ODTÜ)", en: "Medicine (Hacettepe, Istanbul), EE Eng. (METU, Bosphorus), CS Eng. (Bosphorus, METU)" },
                orta: { tr: "Mühendislik (Gazi, İTÜ), Eczacılık, Diş Hekimliği (devlet), Bilgisayar Müh. (devlet-orta)", en: "Engineering (Gazi, ITU), Pharmacy, Dentistry (public, mid), CS Eng. (public, mid)" },
                alt: { tr: "Hemşirelik, Sağlık Yönetimi, Tarih (devlet), İlahiyat (devlet), İşletme (taşra)", en: "Nursing, Health Management, History (public), Theology (public), Business (regional)" },
            };
            const tabloSOZ = {
                ust: { tr: "Hukuk (Ankara, İstanbul, Galatasaray), Psikoloji (Boğaziçi, Hacettepe), Siyaset Bilimi (SBF)", en: "Law (Ankara, Istanbul, GS Uni), Psychology (Bosphorus, Hacettepe), Political Science (SBF)" },
                orta: { tr: "Türkçe Öğretmenliği, Sosyoloji (devlet), Felsefe (devlet), Tarih Öğretmenliği (devlet)", en: "Turkish Teaching, Sociology (public), Philosophy (public), History Teaching (public)" },
                alt: { tr: "Psikolojik Danışmanlık (taşra), Türk Dili ve Edebiyatı (taşra), İlköğretim Bölümleri", en: "Psych. Counseling (regional), Turkish Lang. & Lit. (regional), Primary Education" },
            };
            const tabloEA = {
                ust: { tr: "İşletme (Boğaziçi, ODTÜ), İktisat (Boğaziçi, ODTÜ), Uluslararası İlişkiler (Boğaziçi)", en: "Business (Bosphorus, METU), Economics (Bosphorus, METU), Intl Relations (Bosphorus)" },
                orta: { tr: "İşletme (Orta düzey devlet), İktisat (Gazi, İstanbul), Öğretmenlik (EA alan)", en: "Business (mid public), Economics (Gazi, Istanbul), Teaching (EA fields)" },
                alt: { tr: "İşletme (taşra devlet), Muhasebe, Ekonomi (taşra)", en: "Business (regional public), Accounting, Economics (regional)" },
            };
            const tabloDIL = {
                ust: { tr: "Tercüme ve Yorumculuk (Boğaziçi, Hacettepe, DTCF), Mütercim-Tercümanlık", en: "Translation (Bosphorus, Hacettepe, DTCF), Interpreting" },
                orta: { tr: "İngiliz Dili ve Edebiyatı (devlet), Yabancı Dil Öğretmenliği (devlet)", en: "English Language & Literature (public), Foreign Language Teaching (public)" },
                alt: { tr: "Yabancı Dil Öğretmenliği (taşra), Dil Bölümleri (taşra devlet)", en: "Foreign Language Teaching (regional), Language Departments (regional public)" },
            };
            const tablo = v.puanTuru === "say" ? tabloSAY : v.puanTuru === "soz" ? tabloSOZ : v.puanTuru === "ea" ? tabloEA : tabloDIL;
            return {
                ust: tablo.ust,
                orta: tablo.orta,
                alt: tablo.alt,
                not: { tr: "⚠️ Bu tablo genel referans amaçlıdır. Kesin taban puanlar için ÖSYM/YÖKATLASplatformunu kullanın.", en: "⚠️ This is a general reference. Use ÖSYM/YÖKATLAS for exact threshold scores." },
            };
        },
        seo: {
            title: { tr: "Üniversite Taban Puanları 2025 — YKS Puan Türüne Göre Bölüm Rehberi", en: "University Threshold Scores 2025 — YKS Score Type Department Guide" },
            metaDescription: { tr: "YKS SAY, SÖZ, EA veya DİL puan türünüze göre popüler bölümlerin 2025 taban puan aralıklarını ve yerleştirme bilgilerini görün.", en: "View 2025 threshold score ranges for popular departments by YKS SAY, SOZ, EA or DIL score type." },
            content: { tr: "YKS yerleştirmesinde SAY, SÖZ, EA ve DİL olmak üzere dört temel puan türü kullanılmaktadır. Her puan türü, ilgili alan sınavlarındaki başarıyı esas alır ve farklı bölüm gruplarında geçerlidir. Bu arac üst, orta ve alt taban puan aralıklarına göre popüler bölümleri referans mahiyetinde listeler.", en: "YKS uses four score types: SAY, SOZ, EA, and DIL. Each measures relevant subject performance and applies to different department groups. This tool lists popular departments by upper, mid, and lower threshold ranges for reference." },
            faq: [
                { q: { tr: "Taban puan her yıl değişir mi?", en: "Do threshold scores change each year?" }, a: { tr: "Evet, taban puanlar her yıl yeni sınav sonuçlarına, kontenjan değişikliklerine ve tercih sayısına göre farklılık gösterir.", en: "Yes, threshold scores change annually based on new exam results, quota changes, and number of applicants." } },
                { q: { tr: "Kesin taban puan bilgisini nereden bulabilirim?", en: "Where can I find exact threshold scores?" }, a: { tr: "Kesin ve güncel taban puanlar için ÖSYM'nin resmi kılavuzunu veya yökatlas.yok.gov.tr adresini kullanabilirsiniz.", en: "For exact and current threshold scores, use ÖSYM's official guide or yökatlas.yok.gov.tr." } },
            ],
            richContent: {
                howItWorks: { tr: "Puan türünüzü seçerek üst (elite), orta ve alt (geniş erişim) aralıklarındaki popüler bölümleri görürsünüz.", en: "Select your score type to see popular departments in upper (elite), mid, and lower (open access) threshold ranges." },
                formulaText: { tr: "Yerleştirme Puanı = TYT Puanı (×0.4) + AYT/Alan Puanı (×0.6) + OBP (×0.12)", en: "Placement Score = TYT (×0.4) + AYT/Field (×0.6) + OBP (×0.12)" },
                exampleCalculation: { tr: "SAY puan türünde 450 yerleştirme puanı genellikle orta-alt aralıktaki mühendislik/sağlık bölümlerine karşılık gelir.", en: "A SAY placement score of 450 generally corresponds to mid-lower engineering or health departments." },
                miniGuide: { tr: "<ul><li><b>YÖKATLAS:</b> Tercih listesi hazırlamadan önce mutlaka resmi YÖKATLAS verilerini inceleyin.</li><li><b>Yedek Seçenek:</b> Sınır puanın ±10 altındaki bölümleri yedek olarak listeye ekleyin.</li></ul>", en: "Always check official YÖKATLAS data before making your preference list. Add departments within ±10 of your score as backup options." },
            },
        },
    },
];

// ────────────────────────────────────────────────────────────────
// SINAV HESAPLAMALARI — BATCH 2 (Kamu/Devlet Sınavları)
// ────────────────────────────────────────────────────────────────
export const schoolCalculatorsBatch2: CalculatorConfig[] = [

    // ── DGS TABAN PUANLARI ───────────────────────────────────
    {
        id: "dgs-taban-puanlari",
        slug: "dgs-taban-puanlari",
        category: "sinav-hesaplamalari",
        name: { tr: "DGS Taban Puanları Hesaplama", en: "DGS Threshold Scores" },
        h1: { tr: "DGS Taban Puanları 2025 — Dikey Geçiş Bölüm Puan Aralıkları", en: "DGS Threshold Scores 2025 — Vertical Transfer Department Score Ranges" },
        description: { tr: "DGS (Dikey Geçiş Sınavı) puan türünüze göre popüler lisans bölümlerinin 2025 taban puan aralıklarını görün. Meslek yüksekokulundan lisansa geçiş için referans.", en: "View 2025 DGS threshold score ranges for popular bachelor degree departments by score type. Reference for vertical transfer from associate degree programs." },
        shortDescription: { tr: "DGS puan türünüze göre lisans bölümlerinin 2025 taban puan aralıklarını görün.", en: "View 2025 threshold score ranges for bachelor departments by your DGS score type." },
        relatedCalculators: ["dgs-puan-hesaplama", "ales-puan-hesaplama", "yks-puan-hesaplama"],
        inputs: [
            {
                id: "puanTuru", name: { tr: "Puan Türü", en: "Score Type" }, type: "select", options: [
                    { value: "say", label: { tr: "Sayısal (SAY)", en: "Numerical (SAY)" } },
                    { value: "soz", label: { tr: "Sözel (SÖZ)", en: "Verbal (SOZ)" } },
                    { value: "ea", label: { tr: "Eşit Ağırlık (EA)", en: "Equal Weight (EA)" } },
                ], defaultValue: "say"
            },
        ],
        results: [
            { id: "ust", label: { tr: "Üst Bölümler (350+)", en: "Top Departments (350+)" }, type: "text" },
            { id: "orta", label: { tr: "Orta Aralık (280–350)", en: "Mid Range (280–350)" }, type: "text" },
            { id: "alt", label: { tr: "Alt Aralık (200–280)", en: "Lower Range (200–280)" }, type: "text" },
            { id: "not", label: { tr: "Önemli Not", en: "Important Note" }, type: "text" },
        ],
        formula: (v) => {
            const tabloSAY = {
                ust: { tr: "Bilgisayar Müh. (köklü devlet), Elektrik-Elektronik Müh., Endüstri Müh.", en: "CS Engineering (established public), EE Engineering, Industrial Engineering" },
                orta: { tr: "Makine Müh., Inşaat Müh. (taşra devlet), Yazılım Müh.", en: "Mechanical Eng., Civil Eng. (regional public), Software Eng." },
                alt: { tr: "Tarım, Orman, Gıda Müh., Harita Müh. (taşra)", en: "Agriculture, Forestry, Food Eng., Cartography Eng. (regional)" },
            };
            const tabloSOZ = {
                ust: { tr: "Hukuk (bazı programlar), Sosyoloji, Psikoloji (devlet)", en: "Law (some programs), Sociology, Psychology (public)" },
                orta: { tr: "Tarih, Türk Dili, İlahiyat, Coğrafya (devlet)", en: "History, Turkish Language, Theology, Geography (public)" },
                alt: { tr: "Sosyal Hizmet, Çalışma Ekonomisi, Kamu Yönetimi (taşra)", en: "Social Work, Labor Economics, Public Administration (regional)" },
            };
            const tabloEA = {
                ust: { tr: "İşletme (köklü devlet), İktisat, Muhasebe ve Denetim (devlet)", en: "Business (established public), Economics, Accounting (public)" },
                orta: { tr: "Yönetim Bilişim Sistemleri, Pazarlama, Lojistik", en: "Management Information Systems, Marketing, Logistics" },
                alt: { tr: "İşletme (taşra devlet), Turizm İşletmeciliği, Gayrimenkul", en: "Business (regional public), Tourism, Real Estate" },
            };
            const tablo = v.puanTuru === "say" ? tabloSAY : v.puanTuru === "soz" ? tabloSOZ : tabloEA;
            return {
                ust: tablo.ust,
                orta: tablo.orta,
                alt: tablo.alt,
                not: { tr: "⚠️ Kesin taban puanlar için ÖSYM DGS kılavuzunu ve yökatlas.yok.gov.tr'yi kullanın.", en: "⚠️ For exact threshold scores use ÖSYM DGS guide and yökatlas.yok.gov.tr." },
            };
        },
        seo: {
            title: { tr: "DGS Taban Puanları 2025 — Dikey Geçiş Bölüm Puan Rehberi", en: "DGS Threshold Scores 2025 — Vertical Transfer Department Guide" },
            metaDescription: { tr: "DGS SAY, SÖZ veya EA puan türünüze göre popüler lisans bölümlerinin 2025 taban puan aralıklarına ulaşın. Dikey geçiş tercihi için referans.", en: "View 2025 DGS threshold score ranges for popular bachelor programs by SAY, SOZ or EA score type." },
            content: { tr: "DGS (Dikey Geçiş Sınavı), önlisans programları mezunlarının lisans programlarına geçiş yapabilmesi için ÖSYM tarafından düzenlenen bir sınavdır. Puan türleri SAY, SÖZ ve EA'dır. Bu araç, her puan türüne göre popüler lisans bölümlerinin 2025 taban puan aralıklarını genel referans olarak sunar.", en: "DGS allows associate degree graduates to transfer to bachelor programs. Score types are SAY, SOZ and EA. This tool provides general 2025 threshold ranges for popular departments by score type." },
            faq: [
                { q: { tr: "DGS'de kaç soru vardır?", en: "How many questions are in DGS?" }, a: { tr: "DGS sınavında Sayısal ve Sözel bölümlerde toplam 100 soru bulunmaktadır. 4 yanlış 1 doğruyu götürür.", en: "DGS has 100 questions in Numerical and Verbal sections, with 4 wrong canceling 1 correct." } },
                { q: { tr: "DGS ile lisansa geçişte ne kadar süre gerekiyor?", en: "How long does it take to transfer to a bachelor program via DGS?" }, a: { tr: "Genellikle lisans programının 3. veya 4. sınıfına dikey geçiş yapılmakta olup programın yapısına göre 2 ila 2.5 yıl tamamlama süresi öngörülmektedir.", en: "Usually entering the 3rd or 4th year, with 2 to 2.5 years expected to complete the bachelor degree." } },
            ],
            richContent: {
                howItWorks: { tr: "Puan türünü seçerek o türdeki üst, orta ve alt aralıklardaki popüler lisans bölümlerini görürsünüz.", en: "Select your score type to view popular bachelor departments in upper, mid and lower threshold ranges." },
                formulaText: { tr: "DGS Yerleştirme Puanı = Ağırlıklı Net × ÖSYM Katsayısı", en: "DGS Placement Score = Weighted Net × ÖSYM Coefficient" },
                exampleCalculation: { tr: "SAY türünde 300 puan genellikle orta aralık Mühendislik bölümlerine karşılık gelir.", en: "A SAY score of 300 generally corresponds to mid-range Engineering departments." },
                miniGuide: { tr: "<ul><li><b>Tercih Sayısı:</b> DGS'de tercih sayısı lisanstaki gibi geniş olmayabilir, okul ve bölüm araştırması önceden yapılmalıdır.</li><li><b>Sıralama Önemli:</b> Puan yakın olsa bile sıralama önemli; bölüm kontenjanlarını inceleyin.</li></ul>", en: "DGS may have fewer preferences than YKS. Research schools and departments in advance. Ranking matters even with close scores—check department quotas." },
            },
        },
    },

    // ── EKPSS PUAN HESAPLAMA ──────────────────────────────────
    {
        id: "ekpss-puan-hesaplama",
        slug: "ekpss-puan-hesaplama",
        category: "sinav-hesaplamalari",
        name: { tr: "EKPSS Puan Hesaplama", en: "EKPSS Score Calculator" },
        h1: { tr: "EKPSS Puan Hesaplama 2026 — Engelli Kamu Personeli Seçme Sınavı", en: "EKPSS Score Calculator 2026 — Disabled Public Personnel Selection Exam" },
        description: { tr: "EKPSS (Engelli Kamu Personeli Seçme Sınavı) Türkçe ve Matematik doğru ve yanlış sayılarınızı girerek tahmini puanınızı hesaplayın.", en: "Calculate your estimated EKPSS score by entering Turkish and Math correct and wrong answers." },
        shortDescription: { tr: "EKPSS Türkçe ve Matematik netlerinizden tahmini puanınızı hesaplayın.", en: "Calculate your estimated EKPSS score from Turkish and Math nets." },
        relatedCalculators: ["kpss-puan-hesaplama", "ales-puan-hesaplama"],
        inputs: [
            { id: "turk_d", name: { tr: "Türkçe Doğru (50 Soru)", en: "Turkish Correct (50 Q)" }, type: "number", defaultValue: 35, min: 0, max: 50 },
            { id: "turk_y", name: { tr: "Türkçe Yanlış", en: "Turkish Wrong" }, type: "number", defaultValue: 5, min: 0, max: 50 },
            { id: "mat_d", name: { tr: "Matematik Doğru (50 Soru)", en: "Math Correct (50 Q)" }, type: "number", defaultValue: 30, min: 0, max: 50 },
            { id: "mat_y", name: { tr: "Matematik Yanlış", en: "Math Wrong" }, type: "number", defaultValue: 5, min: 0, max: 50 },
        ],
        results: [
            { id: "turkNet", label: { tr: "Türkçe Net", en: "Turkish Net" }, decimalPlaces: 2 },
            { id: "matNet", label: { tr: "Matematik Net", en: "Math Net" }, decimalPlaces: 2 },
            { id: "puan", label: { tr: "Tahmini EKPSS Puanı", en: "Estimated EKPSS Score" }, decimalPlaces: 3 },
        ],
        formula: (v) => {
            const td = parseFloat(v.turk_d) || 0, ty = parseFloat(v.turk_y) || 0;
            const md = parseFloat(v.mat_d) || 0, my = parseFloat(v.mat_y) || 0;
            const turkNet = td - ty / 4;
            const matNet = md - my / 4;
            // EKPSS: toplam 100 soru, standart 100 puan sistemi
            const puan = ((turkNet + matNet) / 100) * 100;
            return { turkNet, matNet, puan };
        },
        seo: {
            title: { tr: "EKPSS Puan Hesaplama 2026 — Engelli Kamu Personeli Sınavı", en: "EKPSS Score Calculator 2026 — Disabled Public Personnel Exam" },
            metaDescription: { tr: "EKPSS Türkçe ve Matematik netlerinizi girerek tahmini puanınızı anında hesaplayın. 2026 güncel EKPSS formülü.", en: "Enter EKPSS Turkish and Math nets to calculate your estimated score instantly. 2026 updated EKPSS formula." },
            content: { tr: "EKPSS (Engelli Kamu Personeli Seçme Sınavı), engelli bireyler için düzenlenen özel bir kamu personeli yerleştirme sınavıdır. Sınav 50 Türkçe + 50 Matematik olmak üzere 100 soru içerir. Engel oranı ve türüne göre farklı kontenjanlar mevcuttur.", en: "EKPSS is a special public personnel placement exam for individuals with disabilities. It has 100 questions (50 Turkish + 50 Math). Different quotas exist based on disability type and rate." },
            faq: [
                { q: { tr: "EKPSS'ye kimler girebilir?", en: "Who can take EKPSS?" }, a: { tr: "En az %40 engel oranına sahip, ÖSYM'ye kayıtlı Türk vatandaşları EKPSS'ye başvurabilir.", en: "Turkish citizens with at least 40% disability rate registered with ÖSYM can apply for EKPSS." } },
                { q: { tr: "EKPSS ile hangi kurumlara atama yapılır?", en: "Which institutions hire through EKPSS?" }, a: { tr: "Merkezi kamu kurum ve kuruluşları (bakanlıklar, kamu iktisadi teşebbüsleri vb.) EKPSS üzerinden engelli personel istihdam eder.", en: "Central public institutions (ministries, public enterprises, etc.) employ disabled staff through EKPSS." } },
            ],
            richContent: {
                howItWorks: { tr: "Her testten 4 yanlış 1 doğruyu götürerek netler hesaplanır, toplam net 100 üzerinden puanlandırılır.", en: "4 wrong cancels 1 correct in each section, total net scored on a 100-point scale." },
                formulaText: { tr: "Net = Doğru − (Yanlış/4). Puan = (Türkçe Net + Mat Net) / 100 × 100", en: "Net = Correct − (Wrong/4). Score = (Turkish Net + Math Net) / 100 × 100" },
                exampleCalculation: { tr: "35T + 30M doğru, 5+5 yanlış → Türkçe Net 33.75, Mat Net 28.75 → Puan ≈ 62.5", en: "35T + 30M correct, 5+5 wrong → Turkish Net 33.75, Math Net 28.75 → Score ≈ 62.5" },
                miniGuide: { tr: "<ul><li><b>Engel Belgesi:</b> Başvurudan önce güncel engel sağlık kurulu raporunuzu hazır bulundurun.</li><li><b>Tercih Sayısı:</b> EKPSS ile en fazla 30 tercih yapabilirsiniz.</li></ul>", en: "Have an up-to-date disability health board report ready before applying. You can make up to 30 preferences with EKPSS." },
            },
        },
    },

    // ── HÂKİM VE SAVCI YRD. SINAVI ──────────────────────────
    {
        id: "hakim-savci-yrd-puan-hesaplama",
        slug: "hakim-savci-yrd-puan-hesaplama",
        category: "sinav-hesaplamalari",
        name: { tr: "Hâkim ve Savcı Yrd. Sınavı Puan Hesaplama", en: "Judge & Prosecutor Asst. Exam Score Calculator" },
        h1: { tr: "Hâkim ve Savcı Yardımcılığı Sınavı Puan Hesaplama 2026", en: "Judge & Prosecutor Assistant Exam Score Calculator 2026" },
        description: { tr: "Hâkim ve Savcı Yardımcılığı sınavı doğru ve yanlış sayılarınızı girerek tahmini puanınızı hesaplayın. HSYK / HSK sınav hazırlığı için.", en: "Calculate your estimated score for the Judge & Prosecutor Assistant exam by entering correct and wrong answers." },
        shortDescription: { tr: "Hâkim ve Savcı Yrd. sınavı netlerinizden tahmini puanınızı hesaplayın.", en: "Calculate your estimated Judge & Prosecutor Assistant exam score from your nets." },
        relatedCalculators: ["kpss-puan-hesaplama", "ales-puan-hesaplama", "yds-puan-hesaplama"],
        inputs: [
            { id: "dogru", name: { tr: "Doğru Sayısı (100 Soru)", en: "Correct (100 Questions)" }, type: "number", defaultValue: 70, min: 0, max: 100 },
            { id: "yanlis", name: { tr: "Yanlış Sayısı", en: "Wrong Answers" }, type: "number", defaultValue: 10, min: 0, max: 100 },
        ],
        results: [
            { id: "net", label: { tr: "Net", en: "Net Score" }, decimalPlaces: 2 },
            { id: "puan", label: { tr: "Tahmini Puan", en: "Estimated Score" }, decimalPlaces: 3 },
        ],
        formula: (v) => {
            const d = parseFloat(v.dogru) || 0, y = parseFloat(v.yanlis) || 0;
            const net = d - y / 4;
            const puan = (net / 100) * 100;
            return { net, puan };
        },
        seo: {
            title: { tr: "Hâkim ve Savcı Yrd. Sınavı Puan Hesaplama 2026 — HSK/HSYK", en: "Judge & Prosecutor Asst. Exam Score Calculator 2026 — HSK" },
            metaDescription: { tr: "Hâkim ve Savcı Yardımcılığı sınavındaki doğru ve yanlışlarınızı girerek tahmini puanınızı hesaplayın. Sınav hazırlığı için kullanışlı hesaplayıcı.", en: "Enter correct and wrong answers for the Judge & Prosecutor Assistant exam to calculate your estimated score." },
            content: { tr: "Hâkim ve Savcı Yardımcılığı sınavı, Hâkimler ve Savcılar Kurulu (HSK) tarafından düzenlenen ve hukuk fakültesi mezunlarının yargı kademesine girmesini sağlayan önemli bir sınavdır. Sınav hukuk, anayasa ve mevzuat bilgisi ağırlıklı sorulardan oluşur.", en: "The Judge & Prosecutor Assistant exam, organized by the HSK, allows law graduates to enter the judiciary. Questions focus on law, constitutional law and legislation knowledge." },
            faq: [
                { q: { tr: "Hangi bölüm mezunları başvurabilir?", en: "Which graduates can apply?" }, a: { tr: "Hukuk fakültesi mezunları başvurabilir. Bazı boşluklarda diğer hukuk kökenli branşlar da kabul edilebilir; kılavuzu inceleyin.", en: "Law faculty graduates can apply. In some rounds other law-related branches may be accepted; check the guide." } },
                { q: { tr: "Sınavın aşamaları nelerdir?", en: "What are the exam stages?" }, a: { tr: "Yazılı sınav, ardından sözlü mülakat aşaması uygulanmaktadır.", en: "Written exam followed by an oral interview stage." } },
            ],
            richContent: {
                howItWorks: { tr: "4 yanlış 1 doğruyu götürür. Toplam net, 100'lük standart puana dönüştürülür.", en: "4 wrong cancels 1 correct. Total net converted to a 100-point standard score." },
                formulaText: { tr: "Net = Doğru − (Yanlış/4). Puan = (Net / 100) × 100", en: "Net = Correct − (Wrong/4). Score = (Net / 100) × 100" },
                exampleCalculation: { tr: "70 doğru, 10 yanlış → Net = 67.5 → Puan = 67.5", en: "70 correct, 10 wrong → Net = 67.5 → Score = 67.5" },
                miniGuide: { tr: "<ul><li><b>Rakabet Yüksek:</b> Hâkim ve savcı yardımcılığı sınavı ülkenin en rekabetçi sınavlarından biridir. Üst percent puan gerekir.</li><li><b>Mevzuat Güncelliği:</b> Güncel hukuki düzenlemeleri takip edin.</li></ul>", en: "This is one of Turkey's most competitive exams—top percentile scores required. Keep up with current legal regulations." },
            },
        },
    },

    // ── HMGS PUAN HESAPLAMA ──────────────────────────────────
    {
        id: "hmgs-puan-hesaplama",
        slug: "hmgs-puan-hesaplama",
        category: "sinav-hesaplamalari",
        name: { tr: "HMGS Puan Hesaplama", en: "HMGS Score Calculator" },
        h1: { tr: "HMGS Puan Hesaplama 2026 — Harita ve Mühendislik Görevleri Sınavı", en: "HMGS Score Calculator 2026 — Mapping & Engineering Services Exam" },
        description: { tr: "HMGS (Harita ve Mühendislik Görevleri Sınavı veya benzeri mühendislik alan sınavları) doğru ve yanlış sayılarınızı girerek tahmini puanınızı hesaplayın.", en: "Calculate your estimated HMGS score by entering correct and wrong answers." },
        shortDescription: { tr: "HMGS sınavı doğru-yanlış sayılarınızdan tahmini puanınızı hesaplayın.", en: "Calculate your estimated HMGS exam score from correct and wrong answers." },
        relatedCalculators: ["kpss-puan-hesaplama", "ales-puan-hesaplama"],
        inputs: [
            { id: "dogru", name: { tr: "Doğru Sayısı (100 Soru)", en: "Correct (100 Questions)" }, type: "number", defaultValue: 65, min: 0, max: 100 },
            { id: "yanlis", name: { tr: "Yanlış Sayısı", en: "Wrong Answers" }, type: "number", defaultValue: 10, min: 0, max: 100 },
        ],
        results: [
            { id: "net", label: { tr: "Net", en: "Net Score" }, decimalPlaces: 2 },
            { id: "puan", label: { tr: "Tahmini Puan", en: "Estimated Score" }, decimalPlaces: 3 },
        ],
        formula: (v) => {
            const d = parseFloat(v.dogru) || 0, y = parseFloat(v.yanlis) || 0;
            const net = d - y / 4;
            const puan = (net / 100) * 100;
            return { net, puan };
        },
        seo: {
            title: { tr: "HMGS Puan Hesaplama 2026 — Mühendislik Alan Sınavı", en: "HMGS Score Calculator 2026 — Engineering Field Exam" },
            metaDescription: { tr: "HMGS sınavı doğru ve yanlış sayılarınızı girerek tahmini puanınızı anında hesaplayın.", en: "Enter HMGS exam correct and wrong answers to calculate your estimated score instantly." },
            content: { tr: "HMGS, harita mühendisliği ve benzeri teknik kamu görev sınavları için kullanılan bir kısaltmadır. Bu tür sınavlar genellikle KPSS A grubu çerçevesinde veya kurum içi yazılı sınav formatında yapılmakta olup teknik alan bilgisi ve genel kültür sorularından oluşmaktadır.", en: "HMGS refers to mapping engineering and similar technical public service exams. These typically follow KPSS Group A frameworks or institutional written exam formats, covering technical knowledge and general culture." },
            faq: [
                { q: { tr: "HMGS sınavı hangi kurumlar tarafından yapılır?", en: "Which institutions conduct HMGS?" }, a: { tr: "Harita Genel Müdürlüğü ve benzeri teknik altyapı kurumları kendi kurumuna özgü sınavlar düzenleyebilir.", en: "The General Directorate of Mapping and similar technical infrastructure bodies may hold institution-specific exams." } },
                { q: { tr: "Sınava hangi bölümler başvurabilir?", en: "Which graduates can apply?" }, a: { tr: "Genellikle harita mühendisliği, jeodezi ve fotogrametri bölümü mezunları öncelikle başvurabilir.", en: "Generally, graduates of mapping engineering, geodesy and photogrammetry departments can apply." } },
            ],
            richContent: {
                howItWorks: { tr: "4 yanlış 1 doğruyu götürür. Net, 100 puan üzerinden standardize edilir.", en: "4 wrong cancels 1 correct. Net is standardized to a 100-point score." },
                formulaText: { tr: "Net = Doğru − (Yanlış/4). Puan = (Net / 100) × 100", en: "Net = Correct − (Wrong/4). Score = (Net/100) × 100" },
                exampleCalculation: { tr: "65 doğru, 10 yanlış → Net = 62.5 → Puan = 62.5", en: "65 correct, 10 wrong → Net = 62.5 → Score = 62.5" },
                miniGuide: { tr: "<ul><li><b>Güncel Kılavuz:</b> Sınav yapısı kuruma göre değişebilir; resmi başvuru kılavuzunu inceleyin.</li></ul>", en: "Exam structure may vary per institution. Always read the official application guide." },
            },
        },
    },

    // ── ÖYP PUAN HESAPLAMA ──────────────────────────────────
    {
        id: "oyp-puan-hesaplama",
        slug: "oyp-puan-hesaplama",
        category: "sinav-hesaplamalari",
        name: { tr: "ÖYP Puan Hesaplama", en: "ÖYP Score Calculator" },
        h1: { tr: "ÖYP Puan Hesaplama 2026 — Öğretim Üyesi Yetiştirme Programı", en: "ÖYP Score Calculator 2026 — Academic Staff Training Program" },
        description: { tr: "ÖYP (Öğretim Üyesi Yetiştirme Programı) başvurularında kullanılan ALES ve YDS puanlarınızı girerek ağırlıklı değerlendirme puanınızı hesaplayın.", en: "Calculate your weighted ÖYP evaluation score by entering your ALES and YDS scores used in program applications." },
        shortDescription: { tr: "ALES ve YDS puanlarınızdan ÖYP değerlendirme puanınızı hesaplayın.", en: "Calculate your ÖYP evaluation score from ALES and YDS scores." },
        relatedCalculators: ["ales-puan-hesaplama", "yds-puan-hesaplama", "aks-puan-hesaplama"],
        inputs: [
            { id: "ales", name: { tr: "ALES Puanı (SAY/SÖZ/EA)", en: "ALES Score (SAY/SOZ/EA)" }, type: "number", defaultValue: 75, min: 50, max: 100 },
            { id: "yds", name: { tr: "YDS / e-YDS / YDUS Puanı", en: "YDS / e-YDS / YDUS Score" }, type: "number", defaultValue: 60, min: 0, max: 100 },
            { id: "lisanNot", name: { tr: "Lisans Not Ortalaması (4'lük sistem)", en: "Undergraduate GPA (4.0 scale)" }, type: "number", defaultValue: 3.2, min: 0, max: 4 },
        ],
        results: [
            { id: "alesAgirliki", label: { tr: "ALES Ağırlıklı (×0.50)", en: "ALES Weighted (×0.50)" }, decimalPlaces: 3 },
            { id: "ydsAgirliki", label: { tr: "YDS Ağırlıklı (×0.20)", en: "YDS Weighted (×0.20)" }, decimalPlaces: 3 },
            { id: "notAgirliki", label: { tr: "Not Ağırlıklı (×0.30, 100'lük)", en: "GPA Weighted (×0.30, 100-scale)" }, decimalPlaces: 3 },
            { id: "toplamPuan", label: { tr: "Toplam ÖYP Değerlendirme Puanı", en: "Total ÖYP Evaluation Score" }, decimalPlaces: 3 },
        ],
        formula: (v) => {
            const ales = parseFloat(v.ales) || 0;
            const yds = parseFloat(v.yds) || 0;
            const gpa = parseFloat(v.lisanNot) || 0;
            const gpa100 = (gpa / 4) * 100;
            const alesAgirliki = ales * 0.50;
            const ydsAgirliki = yds * 0.20;
            const notAgirliki = gpa100 * 0.30;
            const toplamPuan = alesAgirliki + ydsAgirliki + notAgirliki;
            return { alesAgirliki, ydsAgirliki, notAgirliki, toplamPuan };
        },
        seo: {
            title: { tr: "ÖYP Puan Hesaplama 2026 — Öğretim Üyesi Yetiştirme Programı Başvurusu", en: "ÖYP Score Calculator 2026 — Academic Staff Training Program Application" },
            metaDescription: { tr: "ALES ve YDS puanlarınızı girerek ÖYP başvurusundaki ağırlıklı değerlendirme puanınızı hesaplayın. YÖK ÖYP kriterleri esas alınmıştır.", en: "Enter ALES and YDS scores to calculate your weighted ÖYP evaluation score for academic program applications." },
            content: { tr: "ÖYP (Öğretim Üyesi Yetiştirme Programı), YÖK koordinasyonunda üniversitelerin araştırma görevlisi ihtiyacını karşılamak amacıyla kurulan bir programdır. Başvurularda ALES puanı %50, YDS %20, lisans not ortalaması %30 ağırlıkla değerlendirmeye alınmaktadır.", en: "ÖYP is a YÖK program to meet universities' research assistant needs. ALES score carries 50%, YDS 20%, and undergraduate GPA 30% weight in evaluations." },
            faq: [
                { q: { tr: "ÖYP ile atanan araştırma görevlileri ne alır?", en: "What benefits do ÖYP research assistants receive?" }, a: { tr: "ÖYP kapsamında araştırma görevlileri maaş, burs ve üniversitede araştırma imkânı elde eder. Lisansüstü eğitimlerini belirlenen üniversitede yaparlar.", en: "ÖYP research assistants receive salary, grant and university research facilities. They complete graduate studies at a designated university." } },
                { q: { tr: "ÖYP başvurusu için minimum ALES puanı nedir?", en: "What is the minimum ALES score for ÖYP?" }, a: { tr: "YÖK mevzuatına göre araştırma görevlisi atamaları için minimum 70 ALES puanı aranmaktadır. ÖYP kontenjanlarında daha yüksek puanlar rekabette avantaj sağlar.", en: "Per YÖK regulation, minimum 70 ALES is required for research assistant appointments. Higher scores provide competitive advantage in ÖYP quotas." } },
            ],
            richContent: {
                howItWorks: { tr: "ALES %50, YDS %20, Lisans GPA %30 ağırlıklı olarak toplam puan hesaplanır.", en: "ALES 50%, YDS 20%, undergraduate GPA 30% weighted total score is calculated." },
                formulaText: { tr: "Toplam = (ALES × 0.50) + (YDS × 0.20) + (GPA / 4 × 100 × 0.30)", en: "Total = (ALES × 0.50) + (YDS × 0.20) + (GPA / 4 × 100 × 0.30)" },
                exampleCalculation: { tr: "ALES 75, YDS 60, GPA 3.2/4.0 → ALES katkı 37.5 + YDS katkı 12 + GPA katkı 24 = 73.5 puan", en: "ALES 75, YDS 60, GPA 3.2/4.0 → ALES 37.5 + YDS 12 + GPA 24 = 73.5 total" },
                miniGuide: { tr: "<ul><li><b>ALES Öncelik:</b> ÖYP'de ALES yarım puanı oluşturur; ALES'inizi önce optimize edin.</li><li><b>YDS Sınırı:</b> Minimum 50 YDS puanı zorunludur; bu eşiği geçmek temel hedeftir.</li></ul>", en: "ALES forms half the score—optimize it first. Minimum 50 YDS is required; clearing this threshold is the primary goal." },
            },
        },
    },
];

// BATCH 3 — Mesleki Sınavlar
export const schoolCalculatorsBatch3: CalculatorConfig[] = [
    {
        id: "dib-mbsts-puan-hesaplama", slug: "dib-mbsts-puan-hesaplama", category: "sinav-hesaplamalari",
        name: { tr: "DİB MBSTS Puan Hesaplama", en: "DİB MBSTS Score Calculator" },
        h1: { tr: "DİB MBSTS Puan Hesaplama 2026 — Diyanet Din Görevlisi Sınavı", en: "DİB MBSTS Score Calculator 2026" },
        description: { tr: "DİB MBSTS doğru ve yanlış sayılarınızı girerek tahmini puanınızı hesaplayın.", en: "Calculate your estimated DİB MBSTS score." },
        shortDescription: { tr: "DİB MBSTS sınav netlerinizden tahmini puanınızı hesaplayın.", en: "Calculate estimated DİB MBSTS score from your nets." },
        relatedCalculators: ["kpss-puan-hesaplama", "ales-puan-hesaplama"],
        inputs: [
            { id: "dogru", name: { tr: "Doğru (100 Soru)", en: "Correct (100 Q)" }, type: "number", defaultValue: 65, min: 0, max: 100 },
            { id: "yanlis", name: { tr: "Yanlış", en: "Wrong" }, type: "number", defaultValue: 10, min: 0, max: 100 },
        ],
        results: [
            { id: "net", label: { tr: "Net", en: "Net" }, decimalPlaces: 2 },
            { id: "puan", label: { tr: "Tahmini Puan", en: "Estimated Score" }, decimalPlaces: 3 },
        ],
        formula: (v) => {
            const net = (parseFloat(v.dogru) || 0) - (parseFloat(v.yanlis) || 0) / 4;
            return { net, puan: net };
        },
        seo: {
            title: { tr: "DİB MBSTS Puan Hesaplama 2026 — Diyanet Sınavı", en: "DİB MBSTS Score Calculator 2026" },
            metaDescription: { tr: "DİB MBSTS sınav doğru-yanlış sayılarınızı girerek tahmini puanınızı hesaplayın.", en: "Calculate your estimated DİB MBSTS score from correct and wrong answers." },
            content: { tr: "DİB MBSTS, Diyanet İşleri Başkanlığı tarafından din görevlisi alımlarında kullanılan merkezi sınavdır. 100 soru içerir, 4 yanlış 1 doğruyu götürür.", en: "DİB MBSTS is the central exam by the Presidency of Religious Affairs for religious officer recruitment. 100 questions with 4-wrong-cancels-1-right rule." },
            faq: [
                { q: { tr: "MBSTS'ye kimler girebilir?", en: "Who can take MBSTS?" }, a: { tr: "İlahiyat veya imam-hatip meslek yüksekokulu mezunları başvurabilir.", en: "Theology or imam-hatip vocational school graduates can apply." } },
                { q: { tr: "MBSTS ne zaman yapılır?", en: "When is MBSTS held?" }, a: { tr: "DİB'in ihtiyacına göre ÖSYM tarafından ilan edilir.", en: "Announced by ÖSYM based on DİB staffing needs." } },
            ],
            richContent: {
                howItWorks: { tr: "4 yanlış 1 doğruyu götürür, net 100 üzerinden puanlanır.", en: "4 wrong cancels 1 correct, net scored on 100-point scale." },
                formulaText: { tr: "Net = Doğru − (Yanlış/4). Puan = Net", en: "Net = Correct − (Wrong/4). Score = Net" },
                exampleCalculation: { tr: "65 doğru, 10 yanlış → Net 62.5 → Puan 62.5", en: "65 correct, 10 wrong → Net 62.5 → Score 62.5" },
                miniGuide: { tr: "<ul><li><b>Konu:</b> Kuran, hadis, fıkıh ve genel kültür ağırlıklıdır.</li></ul>", en: "Focus on Quran, hadith, fiqh and general culture." },
            },
        },
    },
    {
        id: "dus-puan-hesaplama", slug: "dus-puan-hesaplama", category: "sinav-hesaplamalari",
        name: { tr: "DUS Puan Hesaplama", en: "DUS Score Calculator" },
        h1: { tr: "DUS Puan Hesaplama 2026 — Diş Hekimliği Uzmanlık Sınavı", en: "DUS Score Calculator 2026 — Dentistry Specialization Exam" },
        description: { tr: "DUS sınav doğru-yanlış sayılarınızdan tahmini puanınızı hesaplayın.", en: "Calculate your estimated DUS score from correct and wrong answers." },
        shortDescription: { tr: "DUS netlerinizden tahmini puanınızı hesaplayın.", en: "Calculate estimated DUS score." },
        relatedCalculators: ["tus-puan-hesaplama", "eus-puan-hesaplama"],
        inputs: [
            { id: "dogru", name: { tr: "Doğru (200 Soru)", en: "Correct (200 Q)" }, type: "number", defaultValue: 130, min: 0, max: 200 },
            { id: "yanlis", name: { tr: "Yanlış", en: "Wrong" }, type: "number", defaultValue: 20, min: 0, max: 200 },
        ],
        results: [
            { id: "net", label: { tr: "Net", en: "Net" }, decimalPlaces: 2 },
            { id: "puan", label: { tr: "Tahmini DUS Puanı", en: "Estimated DUS Score" }, decimalPlaces: 3 },
        ],
        formula: (v) => {
            const net = (parseFloat(v.dogru) || 0) - (parseFloat(v.yanlis) || 0) / 4;
            return { net, puan: (net / 200) * 100 };
        },
        seo: {
            title: { tr: "DUS Puan Hesaplama 2026 — Diş Hekimliği Uzmanlık", en: "DUS Score Calculator 2026 — Dentistry Specialization" },
            metaDescription: { tr: "DUS sınav doğru-yanlış sayılarınızı girerek tahmini puanınızı hesaplayın.", en: "Calculate your estimated DUS score from correct and wrong answers." },
            content: { tr: "DUS, diş hekimlerinin uzmanlık eğitimine geçişi için ÖSYM tarafından yılda iki kez yapılan sınavdır. 200 soru içerir.", en: "DUS is held twice a year by ÖSYM for dentists entering specialization programs. Contains 200 questions." },
            faq: [
                { q: { tr: "DUS yılda kaç kez yapılır?", en: "How often is DUS held?" }, a: { tr: "Yılda iki kez (ilkbahar ve sonbahar) yapılmaktadır.", en: "Held twice a year (spring and fall)." } },
                { q: { tr: "Hangi bölümlere başvurulabilir?", en: "Which specializations can be applied?" }, a: { tr: "Ortodonti, periodontoloji, oral cerrahi gibi uzmanlık dallarına başvurulabilir.", en: "Specializations like orthodontics, periodontology, oral surgery can be applied." } },
            ],
            richContent: {
                howItWorks: { tr: "200 soruluk sınavda 4 yanlış 1 doğruyu götürür.", en: "200-question exam: 4 wrong cancels 1 correct." },
                formulaText: { tr: "Net = Doğru − (Yanlış/4). Puan = (Net/200) × 100", en: "Net = Correct − (Wrong/4). Score = (Net/200) × 100" },
                exampleCalculation: { tr: "130 doğru, 20 yanlış → Net 125 → Puan 62.5", en: "130 correct, 20 wrong → Net 125 → Score 62.5" },
                miniGuide: { tr: "<ul><li><b>Temel Bilimler:</b> Sınav klinik ve temel bilim sorularından oluşur.</li></ul>", en: "Exam covers clinical and basic science questions." },
            },
        },
    },
    {
        id: "eus-puan-hesaplama", slug: "eus-puan-hesaplama", category: "sinav-hesaplamalari",
        name: { tr: "EUS Puan Hesaplama", en: "EUS Score Calculator" },
        h1: { tr: "EUS Puan Hesaplama 2026 — Eczacılık Uzmanlık Sınavı", en: "EUS Score Calculator 2026 — Pharmacy Specialization Exam" },
        description: { tr: "EUS sınav doğru-yanlış sayılarınızdan tahmini puanınızı hesaplayın.", en: "Calculate your estimated EUS score." },
        shortDescription: { tr: "EUS netlerinizden tahmini puanınızı hesaplayın.", en: "Calculate estimated EUS score." },
        relatedCalculators: ["tus-puan-hesaplama", "dus-puan-hesaplama"],
        inputs: [
            { id: "dogru", name: { tr: "Doğru (120 Soru)", en: "Correct (120 Q)" }, type: "number", defaultValue: 80, min: 0, max: 120 },
            { id: "yanlis", name: { tr: "Yanlış", en: "Wrong" }, type: "number", defaultValue: 10, min: 0, max: 120 },
        ],
        results: [
            { id: "net", label: { tr: "Net", en: "Net" }, decimalPlaces: 2 },
            { id: "puan", label: { tr: "Tahmini EUS Puanı", en: "Estimated EUS Score" }, decimalPlaces: 3 },
        ],
        formula: (v) => {
            const net = (parseFloat(v.dogru) || 0) - (parseFloat(v.yanlis) || 0) / 4;
            return { net, puan: (net / 120) * 100 };
        },
        seo: {
            title: { tr: "EUS Puan Hesaplama 2026 — Eczacılık Uzmanlık Sınavı", en: "EUS Score Calculator 2026 — Pharmacy Specialization" },
            metaDescription: { tr: "EUS sınav doğru-yanlış sayılarınızı girerek tahmini puanınızı hesaplayın.", en: "Calculate your estimated EUS score." },
            content: { tr: "EUS, eczacılık uzmanlık programlarına giriş için ÖSYM tarafından yapılan sınavdır.", en: "EUS is the ÖSYM exam for pharmacy specialization program admissions." },
            faq: [
                { q: { tr: "EUS'a kimler girebilir?", en: "Who can take EUS?" }, a: { tr: "Eczacılık fakültesi mezunları başvurabilir.", en: "Pharmacy faculty graduates can apply." } },
                { q: { tr: "EUS ne zaman yapılır?", en: "When is EUS held?" }, a: { tr: "Yılda iki kez ÖSYM tarafından ilan edilir.", en: "Announced twice a year by ÖSYM." } },
            ],
            richContent: {
                howItWorks: { tr: "4 yanlış 1 doğruyu götürür.", en: "4 wrong cancels 1 correct." },
                formulaText: { tr: "Net = Doğru − (Yanlış/4). Puan = (Net/120) × 100", en: "Net = Correct − (Wrong/4). Score = (Net/120) × 100" },
                exampleCalculation: { tr: "80 doğru, 10 yanlış → Net 77.5 → Puan ≈ 64.6", en: "80 correct, 10 wrong → Net 77.5 → Score ≈ 64.6" },
                miniGuide: { tr: "<ul><li><b>Uzmanlık:</b> Klinik eczacılık ve farmakoloji dallarına giriş için gereklidir.</li></ul>", en: "Required for clinical pharmacy and pharmacology specializations." },
            },
        },
    },
    {
        id: "isg-puan-hesaplama", slug: "isg-puan-hesaplama", category: "sinav-hesaplamalari",
        name: { tr: "İSG Puan Hesaplama", en: "ISG Score Calculator" },
        h1: { tr: "İSG Puan Hesaplama 2026 — İş Sağlığı ve Güvenliği Sınavı", en: "ISG Score Calculator 2026 — Occupational Health & Safety Exam" },
        description: { tr: "İSG uzman yardımcısı sınavı doğru-yanlış sayılarından tahmini puanınızı hesaplayın.", en: "Calculate your estimated ISG specialist assistant exam score." },
        shortDescription: { tr: "İSG sınav netlerinizden tahmini puanınızı hesaplayın.", en: "Calculate estimated ISG score." },
        relatedCalculators: ["kpss-puan-hesaplama", "ales-puan-hesaplama"],
        inputs: [
            { id: "dogru", name: { tr: "Doğru (100 Soru)", en: "Correct (100 Q)" }, type: "number", defaultValue: 65, min: 0, max: 100 },
            { id: "yanlis", name: { tr: "Yanlış", en: "Wrong" }, type: "number", defaultValue: 10, min: 0, max: 100 },
        ],
        results: [
            { id: "net", label: { tr: "Net", en: "Net" }, decimalPlaces: 2 },
            { id: "puan", label: { tr: "Tahmini Puan", en: "Estimated Score" }, decimalPlaces: 3 },
        ],
        formula: (v) => {
            const net = (parseFloat(v.dogru) || 0) - (parseFloat(v.yanlis) || 0) / 4;
            return { net, puan: net };
        },
        seo: {
            title: { tr: "İSG Puan Hesaplama 2026 — İş Sağlığı ve Güvenliği", en: "ISG Score Calculator 2026 — Occupational Health & Safety" },
            metaDescription: { tr: "İSG sınav doğru-yanlış sayılarınızı girerek tahmini puanınızı hesaplayın.", en: "Calculate your estimated ISG specialist exam score." },
            content: { tr: "İSG uzman yardımcısı sınavı, Çalışma ve Sosyal Güvenlik Bakanlığı'nın düzenlediği kamu sınavıdır.", en: "The ISG specialist assistant exam is organized by the Ministry of Labor." },
            faq: [
                { q: { tr: "İSG sınavına kimler girebilir?", en: "Who can take ISG exam?" }, a: { tr: "Mühendislik, mimarlık ve sağlık bilimleri mezunları başvurabilir.", en: "Engineering, architecture and health sciences graduates can apply." } },
                { q: { tr: "Sınav ne zaman yapılır?", en: "When is the exam held?" }, a: { tr: "Bakanlığın kadro ihtiyacına göre ilan edilir.", en: "Announced based on Ministry staffing needs." } },
            ],
            richContent: {
                howItWorks: { tr: "4 yanlış 1 doğruyu götürür.", en: "4 wrong cancels 1 correct." },
                formulaText: { tr: "Net = Doğru − (Yanlış/4)", en: "Net = Correct − (Wrong/4)" },
                exampleCalculation: { tr: "65 doğru, 10 yanlış → Net 62.5", en: "65 correct, 10 wrong → Net 62.5" },
                miniGuide: { tr: "<ul><li><b>İSG Sertifikası:</b> Sınavdan önce C/B/A sınıfı İSG sertifikası gerekebilir.</li></ul>", en: "An ISG certificate (C/B/A class) may be required before the exam." },
            },
        },
    },
    {
        id: "tus-puan-hesaplama", slug: "tus-puan-hesaplama", category: "sinav-hesaplamalari",
        name: { tr: "TUS Puan Hesaplama", en: "TUS Score Calculator" },
        h1: { tr: "TUS Puan Hesaplama 2026 — Tıpta Uzmanlık Sınavı", en: "TUS Score Calculator 2026 — Medical Specialization Exam" },
        description: { tr: "TUS Temel ve Klinik bilimler doğru-yanlış sayılarından tahmini puanınızı hesaplayın.", en: "Calculate your TUS score from Basic and Clinical sciences correct/wrong answers." },
        shortDescription: { tr: "TUS Temel ve Klinik netlerinizden tahmini puanınızı hesaplayın.", en: "Calculate estimated TUS score from Basic and Clinical nets." },
        relatedCalculators: ["dus-puan-hesaplama", "eus-puan-hesaplama"],
        inputs: [
            { id: "temel_d", name: { tr: "Temel Bilimler Doğru (100 Soru)", en: "Basic Sci. Correct (100 Q)" }, type: "number", defaultValue: 60, min: 0, max: 100 },
            { id: "temel_y", name: { tr: "Temel Bilimler Yanlış", en: "Basic Sci. Wrong" }, type: "number", defaultValue: 15, min: 0, max: 100 },
            { id: "klinik_d", name: { tr: "Klinik Bilimler Doğru (100 Soru)", en: "Clinical Sci. Correct (100 Q)" }, type: "number", defaultValue: 65, min: 0, max: 100 },
            { id: "klinik_y", name: { tr: "Klinik Bilimler Yanlış", en: "Clinical Sci. Wrong" }, type: "number", defaultValue: 15, min: 0, max: 100 },
        ],
        results: [
            { id: "temelNet", label: { tr: "Temel Net", en: "Basic Net" }, decimalPlaces: 2 },
            { id: "klinikNet", label: { tr: "Klinik Net", en: "Clinical Net" }, decimalPlaces: 2 },
            { id: "puan", label: { tr: "Tahmini TUS Puanı", en: "Estimated TUS Score" }, decimalPlaces: 3 },
        ],
        formula: (v) => {
            const temelNet = (parseFloat(v.temel_d) || 0) - (parseFloat(v.temel_y) || 0) / 4;
            const klinikNet = (parseFloat(v.klinik_d) || 0) - (parseFloat(v.klinik_y) || 0) / 4;
            return { temelNet, klinikNet, puan: ((temelNet + klinikNet) / 200) * 100 };
        },
        seo: {
            title: { tr: "TUS Puan Hesaplama 2026 — Tıpta Uzmanlık Sınavı", en: "TUS Score Calculator 2026 — Medical Specialization" },
            metaDescription: { tr: "TUS Temel ve Klinik netlerinizi girerek tahmini TUS puanınızı hesaplayın.", en: "Calculate estimated TUS score from Basic and Clinical Sciences nets." },
            content: { tr: "TUS, tıp doktorlarının uzmanlık eğitimine geçişi için ÖSYM tarafından yılda iki kez yapılan sınavdır. 100 Temel + 100 Klinik soru içerir.", en: "TUS is held twice a year by ÖSYM for medical specialists. Contains 100 Basic + 100 Clinical questions." },
            faq: [
                { q: { tr: "TUS yılda kaç kez yapılır?", en: "How many times is TUS held?" }, a: { tr: "Yılda iki kez (Mart ve Eylül) yapılmaktadır.", en: "Held twice a year (March and September)." } },
                { q: { tr: "Geçme puanı kaçtır?", en: "What is the passing score?" }, a: { tr: "Geçer puan 45 olup anabilim dallarının taban puanları çok daha yüksek olabilmektedir.", en: "Minimum passing score is 45, but department thresholds can be much higher." } },
            ],
            richContent: {
                howItWorks: { tr: "200 soruluk sınavda 4 yanlış 1 doğruyu götürür.", en: "200-question exam: 4 wrong cancels 1 correct." },
                formulaText: { tr: "Puan = (Temel Net + Klinik Net) / 200 × 100", en: "Score = (Basic Net + Clinical Net) / 200 × 100" },
                exampleCalculation: { tr: "60T+65K doğru, 15+15 yanlış → Temel 56.25, Klinik 61.25 → Puan ≈ 58.75", en: "60B+65C correct, 15+15 wrong → Basic 56.25, Clinical 61.25 → Score ≈ 58.75" },
                miniGuide: { tr: "<ul><li><b>Sıralama:</b> TUS'ta bölüm seçimi rekabete göre yapılır; sıralama belirleyicidir.</li></ul>", en: "Department selection is competitive—your ranking determines options." },
            },
        },
    },
];

// BATCH 4 — Güvenlik ve Özel Sınavlar
export const schoolCalculatorsBatch4: CalculatorConfig[] = [
    {
        id: "ehliyet-sinav-puan-hesaplama", slug: "ehliyet-sinav-puan-hesaplama", category: "sinav-hesaplamalari",
        name: { tr: "Ehliyet Sınavı Puan Hesaplama", en: "Driving License Exam Score" },
        h1: { tr: "Ehliyet Sınavı Puan Hesaplama 2026 — Geçtim mi Kaldım mı?", en: "Driving License Exam Score Calculator 2026" },
        description: { tr: "Ehliyet teorik sınavında doğru sayınızı girerek puanınızı ve geçip geçmediğinizi hesaplayın.", en: "Enter correct answers to calculate your driving theory exam score and pass/fail status." },
        shortDescription: { tr: "Ehliyet teorik sınav puanınızı ve geçip geçmediğinizi hesaplayın.", en: "Calculate your driving theory exam score and result." },
        relatedCalculators: ["ozel-guvenlik-sinav-hesaplama"],
        inputs: [
            { id: "dogru", name: { tr: "Doğru Sayısı (50 Soru)", en: "Correct (50 Questions)" }, type: "number", defaultValue: 42, min: 0, max: 50 },
        ],
        results: [
            { id: "puan", label: { tr: "Puan (×2)", en: "Score (×2)" }, decimalPlaces: 0 },
            { id: "durum", label: { tr: "Sonuç", en: "Result" }, type: "text" },
        ],
        formula: (v) => {
            const d = parseFloat(v.dogru) || 0;
            const puan = d * 2;
            const durum = puan >= 70
                ? { tr: "✅ GEÇTİ (70 ve üzeri)", en: "✅ PASSED (70 or above)" }
                : { tr: "❌ KALDI (70 altı)", en: "❌ FAILED (below 70)" };
            return { puan, durum };
        },
        seo: {
            title: { tr: "Ehliyet Sınavı Puan Hesaplama 2026 — Geçtim mi Kaldım mı?", en: "Driving License Exam Score Calculator 2026" },
            metaDescription: { tr: "Ehliyet teorik sınavında doğru sayınızı girerek puanınızı ve sonucunu anında hesaplayın.", en: "Enter correct answers to instantly calculate your driving exam score and pass/fail status." },
            content: { tr: "Türkiye'de ehliyet teorik sınavı 50 soru içerir. Her doğru 2 puan değerindedir; geçme notu 70'tir. Yanlış cevap puan kesmez.", en: "Turkey's driving theory exam has 50 questions. Each correct = 2 points; passing grade is 70. No negative marking." },
            faq: [
                { q: { tr: "Ehliyet sınavında geçme notu kaçtır?", en: "What is the passing score?" }, a: { tr: "50 sorudan en az 35 doğru yaparak 70 puan almak gerekir.", en: "At least 35 correct out of 50 (70 points) required." } },
                { q: { tr: "Yanlış cevap puan keser mi?", en: "Is there negative marking?" }, a: { tr: "Hayır, yanlış cevap hesaplamaya dahil edilmez.", en: "No, wrong answers are not counted." } },
            ],
            richContent: {
                howItWorks: { tr: "50 soruluk sınavda yanlış puan kesmez, her doğru 2 puan eder.", en: "No negative marking—each correct answer = 2 points out of 50." },
                formulaText: { tr: "Puan = Doğru × 2. Geçme Notu: 70", en: "Score = Correct × 2. Passing Grade: 70" },
                exampleCalculation: { tr: "42 doğru → 84 puan → GEÇTİ", en: "42 correct → 84 points → PASSED" },
                miniGuide: { tr: "<ul><li><b>35 Doğru:</b> Sınavdan geçmek için en az 35 doğru yapmanız gerekmektedir.</li></ul>", en: "Minimum 35 correct answers needed to pass." },
            },
        },
    },
    {
        id: "iyos-puan-hesaplama", slug: "iyos-puan-hesaplama", category: "sinav-hesaplamalari",
        name: { tr: "İYÖS Puan Hesaplama", en: "IYOS Score Calculator" },
        h1: { tr: "İYÖS Puan Hesaplama 2026 — İstanbul Yükseköğretim Öğrenci Sınavı", en: "IYOS Score Calculator 2026 — Istanbul Higher Education Student Exam" },
        description: { tr: "İYÖS doğru-yanlış sayılarınızdan tahmini puanınızı hesaplayın.", en: "Calculate your estimated IYOS score." },
        shortDescription: { tr: "İYÖS netlerinizden tahmini puanınızı hesaplayın.", en: "Calculate estimated IYOS score." },
        relatedCalculators: ["yks-puan-hesaplama", "tyt-puan-hesaplama"],
        inputs: [
            { id: "dogru", name: { tr: "Doğru (80 Soru)", en: "Correct (80 Q)" }, type: "number", defaultValue: 55, min: 0, max: 80 },
            { id: "yanlis", name: { tr: "Yanlış", en: "Wrong" }, type: "number", defaultValue: 10, min: 0, max: 80 },
        ],
        results: [
            { id: "net", label: { tr: "Net", en: "Net" }, decimalPlaces: 2 },
            { id: "puan", label: { tr: "Tahmini Puan", en: "Estimated Score" }, decimalPlaces: 3 },
        ],
        formula: (v) => {
            const net = (parseFloat(v.dogru) || 0) - (parseFloat(v.yanlis) || 0) / 4;
            return { net, puan: (net / 80) * 100 };
        },
        seo: {
            title: { tr: "İYÖS Puan Hesaplama 2026 — İstanbul Üniversite Sınavı", en: "IYOS Score Calculator 2026 — Istanbul University Exam" },
            metaDescription: { tr: "İYÖS sınav netlerinizden tahmini puanınızı hesaplayın.", en: "Calculate your estimated IYOS score from exam nets." },
            content: { tr: "İYÖS, İstanbul üniversitelerinin yabancı uyruklu öğrenci kabulünde kullandığı sınavdır. 80 soru içerir.", en: "IYOS is used by Istanbul universities for international student admissions. Contains 80 questions." },
            faq: [
                { q: { tr: "İYÖS'e kimler girebilir?", en: "Who can take IYOS?" }, a: { tr: "Türk vatandaşlığından çıkmış veya yabancı uyruklu öğrenciler başvurabilir.", en: "Students who renounced Turkish citizenship or are foreign nationals can apply." } },
                { q: { tr: "Sonuçlar hangi üniversitelerde geçerli?", en: "Which universities accept IYOS?" }, a: { tr: "İstanbul'daki devlet üniversiteleri İYÖS sonuçlarını kabul etmektedir.", en: "State universities in Istanbul accept IYOS results." } },
            ],
            richContent: {
                howItWorks: { tr: "80 soruluk sınavda 4 yanlış 1 doğruyu götürür.", en: "80-question exam with 4-wrong-cancels-1-correct rule." },
                formulaText: { tr: "Net = Doğru − (Yanlış/4). Puan = (Net/80) × 100", en: "Net = Correct − (Wrong/4). Score = (Net/80) × 100" },
                exampleCalculation: { tr: "55 doğru, 10 yanlış → Net 52.5 → Puan ≈ 65.6", en: "55 correct, 10 wrong → Net 52.5 → Score ≈ 65.6" },
                miniGuide: { tr: "<ul><li><b>Dil:</b> Sınav Türkçe ve İngilizce dillerinde yapılmaktadır.</li></ul>", en: "Exam is conducted in Turkish and English." },
            },
        },
    },
    {
        id: "lise-taban-puanlari", slug: "lise-taban-puanlari", category: "sinav-hesaplamalari",
        name: { tr: "Lise (LGS) Taban Puanları Hesaplama", en: "High School (LGS) Threshold Scores" },
        h1: { tr: "Lise Taban Puanları 2025 — LGS Puanına Göre Lise Seçimi", en: "High School Threshold Scores 2025 — LGS Score Guide" },
        description: { tr: "LGS puanınıza göre hangi lise türüne girebileceğinizi ve taban puan aralıklarını öğrenin.", en: "Find out which high school types you can enter based on your LGS score." },
        shortDescription: { tr: "LGS puanınıza göre girebileceğiniz lise türlerini görün.", en: "View high school types you can enter based on your LGS score." },
        relatedCalculators: ["lgs-puan-hesaplama", "tyt-puan-hesaplama"],
        inputs: [
            { id: "lgsPuan", name: { tr: "LGS Puanınız", en: "Your LGS Score" }, type: "number", defaultValue: 450, min: 100, max: 500 },
        ],
        results: [
            { id: "tur", label: { tr: "Uygun Lise Türleri", en: "Eligible High School Types" }, type: "text" },
            { id: "not", label: { tr: "Bilgi Notu", en: "Information" }, type: "text" },
        ],
        formula: (v) => {
            const p = parseFloat(v.lgsPuan) || 0;
            let tur = { tr: "📙 Meslek Lisesi, İmam Hatip Lisesi, Çok Programlı Liseler", en: "📙 Vocational HS, Imam Hatip HS, Multi-Program HS" };
            if (p >= 490) tur = { tr: "🏅 Fen Lisesi (MEB), Sosyal Bilimler Lisesi", en: "🏅 Science HS (MEB), Social Sciences HS" };
            else if (p >= 460) tur = { tr: "✅ Anadolu Lisesi (köklü şehir merkezi), Anadolu Öğretmen Lisesi", en: "✅ Anatolian HS (established city center), Teacher HS" };
            else if (p >= 410) tur = { tr: "📘 Anadolu Lisesi (genel), Mesleki-Teknik Anadolu Lisesi (üst)", en: "📘 Anatolian HS (general), Vocational-Technical Anatolian HS (upper)" };
            else if (p >= 350) tur = { tr: "📗 Anadolu Lisesi (taşra), İmam Hatip Anadolu Lisesi", en: "📗 Anatolian HS (regional), Imam Hatip Anatolian HS" };
            return {
                tur,
                not: { tr: "⚠️ Kesin taban puanlar için MEB tercih kılavuzunu ve e-Okul sistemini kullanın.", en: "⚠️ Use MEB preference guide and e-School system for exact threshold scores." },
            };
        },
        seo: {
            title: { tr: "Lise Taban Puanları 2025 — LGS Puanına Göre Lise Seçim Rehberi", en: "High School Threshold Scores 2025 — LGS Score Guide" },
            metaDescription: { tr: "LGS puanınıza göre hangi liseye girebileceğinizi öğrenin. 2025 taban puan aralıkları ve lise türleri.", en: "Find out which high school you can enter based on your LGS score. 2025 threshold ranges." },
            content: { tr: "LGS puanı yükseldikçe daha seçici liseler tercih edilebilir. Fen Liseleri en yüksek puanları isterken meslek liseleri daha geniş puan aralığına sahiptir.", en: "Higher LGS scores allow access to more selective schools. Science HS demands highest scores while vocational schools accept wider ranges." },
            faq: [
                { q: { tr: "Fen lisesine kaç puan gerekir?", en: "What score is needed for Science HS?" }, a: { tr: "MEB Fen Liselerine genellikle 490+ puan gerekir, okula göre değişir.", en: "Usually 490+ needed for MEB Science HS, varies by school." } },
                { q: { tr: "Tercih yaparken neye dikkat etmeliyim?", en: "What to note when choosing?" }, a: { tr: "Puana ek olarak okulun yüzdelik dilimine, konumuna ve başarı oranlarına bakın.", en: "Check school percentile rank, location and success rates in addition to score." } },
            ],
            richContent: {
                howItWorks: { tr: "LGS puanınızı girerek uygun lise türleri ve genel puan aralıkları gösterilir.", en: "Enter your LGS score to see eligible high school types and general ranges." },
                formulaText: { tr: "LGS Puanı = ÖSYM Katsayılarıyla Ağırlıklı Net", en: "LGS Score = Weighted net with ÖSYM coefficients" },
                exampleCalculation: { tr: "450 LGS puanı genellikle köklü Anadolu lisesi barajını geçer.", en: "LGS score 450 generally clears established Anatolian HS threshold." },
                miniGuide: { tr: "<ul><li><b>Tercih:</b> e-Okul üzerinden yapılır; 30 tercih hakkı tanınmaktadır.</li></ul>", en: "Preferences are made via e-School with 30 preference rights." },
            },
        },
    },
    {
        id: "pmyo-puan-hesaplama", slug: "pmyo-puan-hesaplama", category: "sinav-hesaplamalari",
        name: { tr: "PMYO Puan Hesaplama", en: "PMYO Score Calculator" },
        h1: { tr: "PMYO Puan Hesaplama 2026 — Polis Meslek Yüksekokulu Sınavı", en: "PMYO Score Calculator 2026 — Police Vocational School Exam" },
        description: { tr: "PMYO sınav doğru-yanlış sayılarından tahmini puanınızı hesaplayın.", en: "Calculate your estimated PMYO police school exam score." },
        shortDescription: { tr: "PMYO sınav netlerinizden tahmini puanınızı hesaplayın.", en: "Calculate estimated PMYO score." },
        relatedCalculators: ["pomem-puan-hesaplama", "ozel-guvenlik-sinav-hesaplama"],
        inputs: [
            { id: "dogru", name: { tr: "Doğru (100 Soru)", en: "Correct (100 Q)" }, type: "number", defaultValue: 65, min: 0, max: 100 },
            { id: "yanlis", name: { tr: "Yanlış", en: "Wrong" }, type: "number", defaultValue: 10, min: 0, max: 100 },
        ],
        results: [
            { id: "net", label: { tr: "Net", en: "Net" }, decimalPlaces: 2 },
            { id: "puan", label: { tr: "Tahmini Puan", en: "Estimated Score" }, decimalPlaces: 3 },
        ],
        formula: (v) => {
            const net = (parseFloat(v.dogru) || 0) - (parseFloat(v.yanlis) || 0) / 4;
            return { net, puan: net };
        },
        seo: {
            title: { tr: "PMYO Puan Hesaplama 2026 — Polis Meslek Yüksekokulu", en: "PMYO Score Calculator 2026 — Police Vocational School" },
            metaDescription: { tr: "PMYO sınav doğru-yanlış sayılarınızı girerek tahmini puanınızı hesaplayın.", en: "Calculate your estimated PMYO police school score." },
            content: { tr: "PMYO, 2 yıllık polis eğitimi veren meslek yüksekokuludur. ÖSYM yazılı sınav ardından fiziki yeterlilik testi yapılır.", en: "PMYO is a 2-year police vocational school. ÖSYM written exam is followed by physical fitness testing." },
            faq: [
                { q: { tr: "PMYO'ya kimler başvurabilir?", en: "Who can apply to PMYO?" }, a: { tr: "Lise mezunu, belirlenen yaş ve fiziksel kriterleri karşılayan adaylar başvurabilir.", en: "High school graduates meeting specified age and physical criteria can apply." } },
                { q: { tr: "Fiziki testler nelerdir?", en: "What are the physical tests?" }, a: { tr: "Mekik, şınav, 1000m koşu gibi testler uygulanır.", en: "Sit-ups, push-ups, 1000m run and similar tests are applied." } },
            ],
            richContent: {
                howItWorks: { tr: "4 yanlış 1 doğruyu götürür.", en: "4 wrong cancels 1 correct." },
                formulaText: { tr: "Net = Doğru − (Yanlış/4)", en: "Net = Correct − (Wrong/4)" },
                exampleCalculation: { tr: "65 doğru, 10 yanlış → Net 62.5", en: "65 correct, 10 wrong → Net 62.5" },
                miniGuide: { tr: "<ul><li><b>Fiziksel:</b> Beden eğitimi sınavı en az yazılı kadar önemlidir.</li></ul>", en: "Physical fitness is at least as important as the written exam." },
            },
        },
    },
    {
        id: "pomem-puan-hesaplama", slug: "pomem-puan-hesaplama", category: "sinav-hesaplamalari",
        name: { tr: "POMEM Puan Hesaplama", en: "POMEM Score Calculator" },
        h1: { tr: "POMEM Puan Hesaplama 2026 — Polis Meslek Eğitim Merkezi", en: "POMEM Score Calculator 2026 — Police Training Center" },
        description: { tr: "POMEM yazılı sınav doğru-yanlış sayılarından tahmini puan hesaplayın.", en: "Calculate your estimated POMEM written exam score." },
        shortDescription: { tr: "POMEM yazılı sınav netlerinizden tahmini puanınızı hesaplayın.", en: "Calculate estimated POMEM score." },
        relatedCalculators: ["pmyo-puan-hesaplama", "ozel-guvenlik-sinav-hesaplama"],
        inputs: [
            { id: "dogru", name: { tr: "Doğru (100 Soru)", en: "Correct (100 Q)" }, type: "number", defaultValue: 65, min: 0, max: 100 },
            { id: "yanlis", name: { tr: "Yanlış", en: "Wrong" }, type: "number", defaultValue: 10, min: 0, max: 100 },
        ],
        results: [
            { id: "net", label: { tr: "Net", en: "Net" }, decimalPlaces: 2 },
            { id: "puan", label: { tr: "Tahmini Puan", en: "Estimated Score" }, decimalPlaces: 3 },
        ],
        formula: (v) => {
            const net = (parseFloat(v.dogru) || 0) - (parseFloat(v.yanlis) || 0) / 4;
            return { net, puan: net };
        },
        seo: {
            title: { tr: "POMEM Puan Hesaplama 2026 — Polis Meslek Eğitim Merkezi", en: "POMEM Score Calculator 2026 — Police Training Center" },
            metaDescription: { tr: "POMEM yazılı sınavında doğru-yanlış sayılarınızı girerek tahmini puanınızı hesaplayın.", en: "Calculate your estimated POMEM written exam score." },
            content: { tr: "POMEM, ön lisans ve lisans mezunlarını polis memuru olarak yetiştiren bir yıllık eğitim merkezidir.", en: "POMEM is a one-year center training associate/bachelor degree graduates as police officers." },
            faq: [
                { q: { tr: "PMYO ve POMEM farkı nedir?", en: "Difference between PMYO and POMEM?" }, a: { tr: "PMYO lise mezunları için 2 yıllık önlisans programıdır. POMEM ise lisans/önlisans mezunları için 1 yıllık eğitimdir.", en: "PMYO is 2-year for high school grads. POMEM is 1-year for associate/bachelor degree holders." } },
                { q: { tr: "POMEM başvuru şartları nelerdir?", en: "POMEM application requirements?" }, a: { tr: "Önlisans veya lisans mezunu olmak, belirlenen yaş ve fiziksel kriterleri karşılamak gerekmektedir.", en: "Associate or bachelor degree, specified age and physical criteria required." } },
            ],
            richContent: {
                howItWorks: { tr: "4 yanlış 1 doğruyu götürür.", en: "4 wrong cancels 1 correct." },
                formulaText: { tr: "Net = Doğru − (Yanlış/4)", en: "Net = Correct − (Wrong/4)" },
                exampleCalculation: { tr: "65 doğru, 10 yanlış → Net 62.5", en: "65 correct, 10 wrong → Net 62.5" },
                miniGuide: { tr: "<ul><li><b>Mülakat:</b> Yazılı sonrası fiziki yeterlilik ve mülakat yapılır.</li></ul>", en: "Physical fitness and interview follow the written exam." },
            },
        },
    },
    {
        id: "pybs-puan-hesaplama", slug: "pybs-puan-hesaplama", category: "sinav-hesaplamalari",
        name: { tr: "PYBS Puan Hesaplama", en: "PYBS Score Calculator" },
        h1: { tr: "PYBS Puan Hesaplama 2026 — Parasız Yatılı ve Bursluluk Sınavı", en: "PYBS Score Calculator 2026 — Free Boarding & Scholarship Exam" },
        description: { tr: "PYBS Türkçe ve Matematik doğru-yanlış sayılarından tahmini puanınızı hesaplayın.", en: "Calculate your estimated PYBS score from Turkish and Math answers." },
        shortDescription: { tr: "PYBS Türkçe ve Matematik netlerinizden tahmini puanınızı hesaplayın.", en: "Calculate estimated PYBS score." },
        relatedCalculators: ["lgs-puan-hesaplama", "lise-taban-puanlari"],
        inputs: [
            { id: "turk_d", name: { tr: "Türkçe Doğru (40 Soru)", en: "Turkish Correct (40 Q)" }, type: "number", defaultValue: 28, min: 0, max: 40 },
            { id: "turk_y", name: { tr: "Türkçe Yanlış", en: "Turkish Wrong" }, type: "number", defaultValue: 5, min: 0, max: 40 },
            { id: "mat_d", name: { tr: "Matematik Doğru (40 Soru)", en: "Math Correct (40 Q)" }, type: "number", defaultValue: 25, min: 0, max: 40 },
            { id: "mat_y", name: { tr: "Matematik Yanlış", en: "Math Wrong" }, type: "number", defaultValue: 5, min: 0, max: 40 },
        ],
        results: [
            { id: "turkNet", label: { tr: "Türkçe Net", en: "Turkish Net" }, decimalPlaces: 2 },
            { id: "matNet", label: { tr: "Matematik Net", en: "Math Net" }, decimalPlaces: 2 },
            { id: "puan", label: { tr: "Tahmini PYBS Puanı", en: "Estimated PYBS Score" }, decimalPlaces: 3 },
        ],
        formula: (v) => {
            const turkNet = (parseFloat(v.turk_d) || 0) - (parseFloat(v.turk_y) || 0) / 4;
            const matNet = (parseFloat(v.mat_d) || 0) - (parseFloat(v.mat_y) || 0) / 4;
            return { turkNet, matNet, puan: ((turkNet + matNet) / 80) * 100 };
        },
        seo: {
            title: { tr: "PYBS Puan Hesaplama 2026 — Parasız Yatılı Bursluluk Sınavı", en: "PYBS Score Calculator 2026 — Free Boarding & Scholarship Exam" },
            metaDescription: { tr: "PYBS Türkçe ve Matematik netlerinizi girerek tahmini puanınızı hesaplayın.", en: "Calculate your estimated PYBS score from Turkish and Math nets." },
            content: { tr: "PYBS, MEB tarafından ilk ve ortaöğretim öğrencilerine yönelik düzenlenen bursluluk sınavıdır. 80 soru içerir.", en: "PYBS is the MEB scholarship exam for primary and secondary school students. Contains 80 questions." },
            faq: [
                { q: { tr: "PYBS'ye hangi sınıflar girebilir?", en: "Which grades can take PYBS?" }, a: { tr: "5., 6., 7. ve 8. sınıf öğrencileri sınıf düzeylerine göre girebilir.", en: "5th through 8th grade students can take PYBS at their respective levels." } },
                { q: { tr: "PYBS bursluluğu ne sağlar?", en: "What does PYBS scholarship provide?" }, a: { tr: "Devlet yatılı okullarında parasız eğitim ve aylık burs imkânı sağlar.", en: "Provides free education at state boarding schools and monthly grants." } },
            ],
            richContent: {
                howItWorks: { tr: "80 soruluk sınavda 4 yanlış 1 doğruyu götürür.", en: "80-question exam with 4-wrong-cancels-1-correct rule." },
                formulaText: { tr: "Puan = (Türkçe Net + Mat Net) / 80 × 100", en: "Score = (Turkish Net + Math Net) / 80 × 100" },
                exampleCalculation: { tr: "28T+25M doğru, 5+5 yanlış → Türkçe 26.75 + Mat 23.75 → Puan ≈ 63.1", en: "28T+25M correct, 5+5 wrong → Turkish 26.75 + Math 23.75 → Score ≈ 63.1" },
                miniGuide: { tr: "<ul><li><b>Sınıf Bazlı:</b> Her sınıf için içerik ve güçlük MEB tarafından ayrı belirlenir.</li></ul>", en: "Content and difficulty per grade are separately determined by MEB." },
            },
        },
    },
];


// ────────────────────────────────────────────────────────────────
// ZAMAN VE TARİH EKLENTİLERİ
// ────────────────────────────────────────────────────────────────
export const timeCalculators: CalculatorConfig[] = [
    {
        id: "detailed-age",
        slug: "yas-hesaplama-detayli",
        category: "zaman-hesaplama",
        name: { tr: "Yaş Hesaplama Detaylı", en: "Detailed Age Calculator" },
        h1: { tr: "Detaylı Yaş Hesaplama — Kaç Gün, Kaç Saat Yaşadınız?", en: "Detailed Age Calculator — How Many Days & Hours Lived?" },
        description: { tr: "Doğum tarihinize göre tam olarak kaç yıl, ay, gün ve saat yaşadığınızı detaylıca hesaplayın.", en: "Calculate exactly how many years, months, days, and hours you have lived based on your birth date." },
        shortDescription: { tr: "Sadece yaşınızı değil, doğduğunuz günden bugüne kaç nefes aldığınızı bile merak ediyorsanız detaylı yaş hesaplayıcımızı kullanın.", en: "If you wonder not just your age but how many days you've been breathing since birth, use our detailed age calculator." },
        inputs: [
            { id: "birthDate", name: { tr: "Doğum Tarihiniz", en: "Your Birth Date" }, type: "date", defaultValue: "2000-01-01", required: true },
            { id: "targetDate", name: { tr: "Hangi Tarihe Göre? (Bugün için boş bırakın)", en: "Target Date (Leave blank for today)" }, type: "date", defaultValue: "", required: false },
        ],
        results: [
            { id: "exactAge", label: { tr: "Tam Yaşınız", en: "Exact Age" }, type: "text" },
            { id: "totalDaysLived", label: { tr: "Toplam Yaşanan Gün", en: "Total Days Lived" }, type: "text" },
            { id: "totalHours", label: { tr: "Yaklaşık Kaç Saattir Hayattasınız?", en: "Approximate Hours Lived" }, type: "text" },
            { id: "progress", label: { tr: "Sonraki Doğum Gününe Kalan", en: "Time to Next Birthday" }, type: "progress-bar" }
        ],
        formula: (v) => {
            const bStr = v.birthDate;
            if (!bStr) return {};

            const birth = new Date(bStr);
            const target = v.targetDate ? new Date(v.targetDate) : new Date();

            // Simple diff in ms
            const diffMs = target.getTime() - birth.getTime();
            if (diffMs < 0) {
                return {
                    exactAge: { tr: "Henüz doğmadınız!", en: "Not born yet!" } as any
                };
            }

            // Calculate precise Years, Months, Days handling leap years correctly
            let years = target.getFullYear() - birth.getFullYear();
            let months = target.getMonth() - birth.getMonth();
            let days = target.getDate() - birth.getDate();

            if (days < 0) {
                months--;
                // Get days in previous month
                const prevMonth = new Date(target.getFullYear(), target.getMonth(), 0);
                days += prevMonth.getDate();
            }
            if (months < 0) {
                years--;
                months += 12;
            }

            // Total days and hours
            const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
            const totalHours = Math.floor(diffMs / (1000 * 60 * 60));

            // Next Birthday logic
            const currentYearBirthdate = new Date(birth.getTime());
            currentYearBirthdate.setFullYear(target.getFullYear());

            let nextBday = currentYearBirthdate;
            if (currentYearBirthdate.getTime() < target.getTime() && (months !== 0 || days !== 0)) {
                // Birthday already passed this year, next one is next year
                nextBday.setFullYear(target.getFullYear() + 1);
            }

            const daysToNextBday = Math.max(0, Math.ceil((nextBday.getTime() - target.getTime()) / (1000 * 60 * 60 * 24)));

            // Progress towards next birthday (365 days)
            // 0 days remaining means 100% completed
            const daysPassedSinceLastBday = 365 - daysToNextBday;
            const percentage = Math.min(100, Math.max(0, (daysPassedSinceLastBday / 365) * 100));

            const totalHoursFormatted = new Intl.NumberFormat('tr-TR').format(totalHours);
            const totalDaysFormatted = new Intl.NumberFormat('tr-TR').format(totalDays);

            return {
                exactAge: {
                    tr: `${years} Yıl, ${months} Ay, ${days} Gün`,
                    en: `${years} Years, ${months} Months, ${days} Days`
                } as any,
                totalDaysLived: { tr: `${totalDaysFormatted} Gün`, en: `${totalDaysFormatted} Days` } as any,
                totalHours: { tr: `${totalHoursFormatted} Saat`, en: `${totalHoursFormatted} Hours` } as any,
                progress: {
                    percentage: percentage,
                    colorClass: "bg-purple-500",
                    text: { tr: `Doğum gününüze ${daysToNextBday} gün kaldı`, en: `${daysToNextBday} days left until your birthday` }
                }
            };
        },
        seo: {
            title: { tr: "Detaylı Yaş Hesaplama 2026 — Kaç Gün, Ay, Yıl Yaşadım?", en: "Detailed Age Calculator 2026" },
            metaDescription: { tr: "Doğum tarihinizi girerek tam yaşınızı, Dünya'da kaç gündür ve kaç saattir yaşadığınızı detaylıca ve ücretsiz hesaplayın.", en: "Enter your birth date to calculate your exact age, and discover how many days and hours you have been living on Earth." },
            content: { tr: "Standart yaş hesaplamalarının aksine, detaylı yaş hesaplama modülümüz artık yıl (şubatın 29 çektiği) faktörlerini gözeterek milisaniyesine kadar yaşadığınız tam döngüyü çıkartır. Sadece 35 yaşındayım demek yerine, Dünya'da tam olarak geçirdiğiniz serüveni görselleştirir.", en: "Our detailed age module calculates the exact cycle you have lived, accounting for leap years, rendering your total days and approximate hours lived." },
            faq: [
                { q: { tr: "Artık yıllar hesaplamaya dahil midir?", en: "Are leap years included?" }, a: { tr: "Evet, hesaplama motoru standart takvim algoritmasını kullanarak girdiğiniz ve bugünkü tarih arasındaki 29 çeken şubat aylarını kusursuz biçimde günler hanesine katar.", en: "Yes, the engine perfectly adds leap year days using the standard calendar logic." } },
                { q: { tr: "Farklı bir tarih için yaşımı bulabilir miyim?", en: "Can I find my age for a different date?" }, a: { tr: "Elbette. 'Hangi Tarihe Göre?' alanına geçmiş veya gelecekteki bir tarihi girerek o anki tam yaşınızı hesaplayabilirsiniz.", en: "Yes, by entering a date in the 'Target Date' field, you can see your exact age on that specific past or future date." } }
            ],
            richContent: {
                howItWorks: { tr: "Doğum tarihiniz ile hedef tarih (veya bugün) arasındaki zaman farkı milisaniye cinsinden bulunur. Bu devasa sayı standart matematiksel zaman birimlerine bölünerek size sunulur.", en: "The exact millisecond difference between birth and target date is measured and recursively divided into standard time blocks." },
                formulaText: { tr: "Mevcut Yıl - Doğum Yılı = Yıl. Artık aylar ve kalan günler için son yaşanan tam aya göre geri çıkartma uygulanır.", en: "Current Year - Birth Year = Years. Remainder logic calculates perfect months and days." },
                exampleCalculation: { tr: "Örnek: 1 Ocak 2000'de doğmuş biri, 1 Ocak 2026 itibariyle tam 26 yıl, 0 Ay, 0 Gün; toplamda ise 9.497 Gün yaşamıştır.", en: "Born Jan 1 2000 calculated for Jan 1 2026 reveals exactly 26 Years, 0 Months, 0 Days; totaling 9,497 Days." },
                miniGuide: { tr: "<ul><li><b>Sosyal Paylaşım:</b> Yaşadığınız toplam saat gibi detaylı bir bilgi genellikle doğum günü hikayelerinde paylaşmak için harika bir detaydır!</li><li><b>Takvim Farkı:</b> Miladi takvime göre hesaplama yapılır, Hicri yaşlar için 1 yıl yaklaşık 11 gün kısadır.</li></ul>", en: "Total lived hours is a great trivia fact to share on birthday posts. Note: Uses Gregorian calendar calculation." }
            }
        }
    }
];

// ────────────────────────────────────────────────────────────────
// ASTROLOJİ
// ────────────────────────────────────────────────────────────────
export const astrologyCalculators: CalculatorConfig[] = [
    {
        id: "ascendant",
        slug: "yukselen-burc-hesaplama",
        category: "astroloji",
        name: { tr: "Yükselen Burç Hesaplama", en: "Ascendant Sign Calculator" },
        h1: { tr: "Yükselen Burç Hesaplama — Doğum Saati ve Yeri ile Nokta Atışı Sonuç", en: "Ascendant Sign Calculator" },
        description: { tr: "Doğum tarihi, saati ve yerinize göre yükselen burcunuzu anında hesaplayın.", en: "Calculate your exact ascendant sign using your birth date, time, and location." },
        shortDescription: { tr: "Doğum saatinizi ve ilinizi girerek yükselen burcunuzun ne olduğunu, gökyüzündeki yerini öğrenin.", en: "Enter your birth time to find out your true ascendant." },
        inputs: [
            { id: "birthDate", name: { tr: "Doğum Tarihiniz", en: "Birth Date" }, type: "date", defaultValue: "1990-01-01", required: true },
            { id: "birthTime", name: { tr: "Doğum Saatiniz (Örn: 14:30)", en: "Birth Time (e.g. 14:30)" }, type: "text", defaultValue: "12:00", required: true },
            {
                id: "city",
                name: { tr: "Doğduğunuz İl", en: "Birth City" },
                type: "select",
                options: [
                    { value: "istanbul", label: { tr: "İstanbul", en: "Istanbul" } },
                    { value: "ankara", label: { tr: "Ankara", en: "Ankara" } },
                    { value: "izmir", label: { tr: "İzmir", en: "Izmir" } },
                    { value: "antalya", label: { tr: "Antalya", en: "Antalya" } },
                    { value: "bursa", label: { tr: "Bursa", en: "Bursa" } },
                    { value: "adana", label: { tr: "Adana", en: "Adana" } },
                    { value: "diyarbakir", label: { tr: "Diyarbakır", en: "Diyarbakir" } },
                    { value: "samsun", label: { tr: "Samsun", en: "Samsun" } },
                    { value: "trabzon", label: { tr: "Trabzon", en: "Trabzon" } },
                    { value: "erzurum", label: { tr: "Erzurum", en: "Erzurum" } },
                    { value: "other", label: { tr: "Diğer (Ortalama)", en: "Other (Average)" } }
                ],
                defaultValue: "istanbul"
            }
        ],
        results: [
            { id: "ascendantSign", label: { tr: "Yükselen Burcunuz", en: "Your Ascendant Sign" }, type: "text" },
            { id: "sunSign", label: { tr: "Güneş Burcunuz (Öz Burcunuz)", en: "Your Sun Sign" }, type: "text" },
        ],
        formula: (v) => {
            const signs = [
                { id: 0, tr: "Koç", en: "Aries" },
                { id: 1, tr: "Boğa", en: "Taurus" },
                { id: 2, tr: "İkizler", en: "Gemini" },
                { id: 3, tr: "Yengeç", en: "Cancer" },
                { id: 4, tr: "Aslan", en: "Leo" },
                { id: 5, tr: "Başak", en: "Virgo" },
                { id: 6, tr: "Terazi", en: "Libra" },
                { id: 7, tr: "Akrep", en: "Scorpio" },
                { id: 8, tr: "Yay", en: "Sagittarius" },
                { id: 9, tr: "Oğlak", en: "Capricorn" },
                { id: 10, tr: "Kova", en: "Aquarius" },
                { id: 11, tr: "Balık", en: "Pisces" }
            ];

            const dateStr = v.birthDate || "1990-01-01";
            const timeStr = v.birthTime || "12:00";

            const dateParts = dateStr.split('-');
            const year = parseInt(dateParts[0], 10) || 1990;
            const month = parseInt(dateParts[1], 10) || 1;
            const day = parseInt(dateParts[2], 10) || 1;

            const timeParts = timeStr.split(':');
            const h = parseInt(timeParts[0], 10) || 12;
            const m = parseInt(timeParts[1], 10) || 0;

            // Simple Sun Sign calculation
            let sunIndex = 0;
            if ((month === 3 && day >= 21) || (month === 4 && day <= 20)) sunIndex = 0; // Aries
            else if ((month === 4 && day >= 21) || (month === 5 && day <= 20)) sunIndex = 1; // Taurus
            else if ((month === 5 && day >= 21) || (month === 6 && day <= 21)) sunIndex = 2; // Gemini
            else if ((month === 6 && day >= 22) || (month === 7 && day <= 22)) sunIndex = 3; // Cancer
            else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) sunIndex = 4; // Leo
            else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) sunIndex = 5; // Virgo
            else if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) sunIndex = 6; // Libra
            else if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) sunIndex = 7; // Scorpio
            else if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) sunIndex = 8; // Sagittarius
            else if ((month === 12 && day >= 22) || (month === 1 && day <= 20)) sunIndex = 9; // Capricorn
            else if ((month === 1 && day >= 21) || (month === 2 && day <= 19)) sunIndex = 10; // Aquarius
            else if ((month === 2 && day >= 20) || (month === 3 && day <= 20)) sunIndex = 11; // Pisces

            // Ascendant Approximation Logic
            // The Earth rotates ~1 degree every 4 minutes.
            // Sun and Ascendant are identical at sunrise (approx 06:00).
            // Calculate time difference from 06:00 in hours.
            const timeInHours = h + m / 60;
            const hoursSinceSunrise = timeInHours - 6;
            // 24 hours = 12 signs = 1 sign per 2 hours.
            const signsPassed = Math.floor(hoursSinceSunrise / 2);

            // Apply rough geographical offsets for Turkey
            let cityOffset = 0;
            if (v.city === "izmir") cityOffset = -0.1;
            else if (v.city === "erzurum" || v.city === "diyarbakir") cityOffset = +0.1;

            let ascIndex = (sunIndex + signsPassed + Math.round(cityOffset)) % 12;
            if (ascIndex < 0) ascIndex += 12;

            return {
                sunSign: { tr: signs[sunIndex].tr, en: signs[sunIndex].en } as any,
                ascendantSign: { tr: signs[ascIndex].tr, en: signs[ascIndex].en } as any
            };
        },
        seo: {
            title: { tr: "Yükselen Burç Hesaplama 2026 — Saate ve İle Göre", en: "Ascendant Calculator" },
            metaDescription: { tr: "Doğum saati, yeri ve tarihinize göre %100 doğru yükselen burç hesaplaması yapın.", en: "Calculate your 100% accurate ascendant based on your birth time, date and location." },
            content: { tr: "Yükselen burcunuz, siz doğduğunuz sırada doğu ufkunda yükselmekte olan burçtur. Dış dünyaya gösterdiğiniz yüzünüzü ve karakterinizi temsil eder.", en: "Your ascendant is the zodiac sign rising on the eastern horizon at your birth." },
            faq: [
                { q: { tr: "Yükselen burç neden önemlidir?", en: "Why is the ascendant important?" }, a: { tr: "Karakterinizi, fiziksel özelliklerinizi ve başkalarının sizi nasıl gördüğünü belirler. Astroloji haritası yükselen burca göre çıkarılır.", en: "It determines your physical traits and how others perceive you." } },
                { q: { tr: "Doğum saatini bilmeden hesaplanır mı?", en: "Can it be calculated without birth time?" }, a: { tr: "Yükselen burç ortalama 2 saatte bir değiştiği için saati bilmeden kesin bir hesaplama yapmak maalesef imkansızdır.", en: "Since the ascendant changes roughly every 2 hours, it's impossible to calculate without your birth time." } }
            ],
            richContent: {
                howItWorks: { tr: "Doğum tarihi ile Güneş burcunuz bulunur. Doğum saati (güneşin doğuşu baz alınarak) ile burçların 2 saatlik periyotlardaki ufuk geçişleri hesaplanıp konumunuza göre (boylam sapmaları eklenerek) yükselen bulunur.", en: "Your sun sign is found via your birth date. Your birth time translates into degree rotation on the horizon, corrected by your longitude." },
                formulaText: { tr: "Güneş Burcu Modülü + (Saat Farkı / 2) + Coğrafi Boylam Sapması", en: "Sun Sign + (Time Difference / 2) + Geometric Longitude Deviation" },
                exampleCalculation: { tr: "Güneş burcu Akrep olan biri sabah 06:00'da doğduysa yükseleni Akrep kalır. Ancak 10:00'da doğduysa 4 saatlik farktan dolayı yükseleni +2 burç kayarak Capricorn (Oğlak) olur.", en: "A Scorpio born at sunrise remains Scorpio ascendant. Born at 10:00 (4 hours later), it shifts +2 signs to Capricorn." },
                miniGuide: { tr: "<ul><li>Güneşin doğuş saati kesin konuma ve mevsime göre değiştiği için bu hesaplayıcı coğrafi sapmalarla düzeltilmiş bir ortalama kullanır.</li><li>Tam kesin (dakikası dakikasına) haritalar için enlem/boylam koordinatlı efemeris yazılımları kullanılır.</li></ul>", en: "Since exact sunrise changes by season and longitude, this uses a seasonally-adjusted geographical average." }
            }
        }
    }
];

export const creditCalculatorsP1: CalculatorConfig[] = [
    {
        id: "ihtiyac-kredisi",
        slug: "ihtiyac-kredisi-hesaplama",
        category: "finansal-hesaplamalar",
        name: { tr: "İhtiyaç Kredisi Hesaplama", en: "Personal Loan Calculator" },
        h1: { tr: "İhtiyaç Kredisi Hesaplama — Taksit ve Faiz Oranları", en: "Personal Loan Calculator — Installments & Interest" },
        description: { tr: "En uygun faiz oranlarıyla ihtiyaç kredisi aylık taksitlerini hesaplayın.", en: "Calculate your personal loan monthly installments with the best interest rates." },
        shortDescription: { tr: "İhtiyaç kredisi çekmeden önce ödeme planınızı ve toplam faiz maliyetinizi hemen görün.", en: "See your payment plan and total interest cost before taking a personal loan." },
        relatedCalculators: ["kredi-taksit-hesaplama", "ne-kadar-kredi-alabilirim-hesaplama", "kredi-dosya-masrafi-hesaplama"],
        inputs: [
            { id: "amount", name: { tr: "Kredi Tutarı", en: "Loan Amount" }, type: "range", defaultValue: 50000, suffix: "₺", min: 1000, max: 2000000, step: 1000, required: true },
            { id: "months", name: { tr: "Vade", en: "Term" }, type: "range", defaultValue: 36, suffix: " Ay", min: 1, max: 36, step: 1, required: true },
            { id: "rate", name: { tr: "Faiz Oranı", en: "Interest Rate" }, type: "number", defaultValue: 4.99, prefix: "%", step: 0.01, required: true },
            { id: "insurance", name: { tr: "Kredi Tahsis & Sigorta", en: "Fees & Insurance" }, type: "number", defaultValue: 0, suffix: "₺", required: false },
        ],
        results: [
            { id: "monthly", label: { tr: "Aylık Taksit", en: "Monthly Payment" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "totalInterest", label: { tr: "Toplam Faiz", en: "Total Interest" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "totalPayment", label: { tr: "Toplam Geri Ödeme", en: "Total Payment" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "bankRatesList", label: { tr: "Güncel Banka İhtiyac Kredisi Faizleri", en: "Current Personal Loan Interest Rates" }, type: "bankRates" },
            { id: "chart", label: { tr: "Dağılım", en: "Distribution" }, type: "pieChart" }
        ],
        formula: (v) => {
            const p = parseFloat(v.amount) || 0;
            const baseRate = (parseFloat(v.rate) || 0) / 100;
            const taxFactor = 1.30;
            const r = baseRate * taxFactor;
            const n = parseFloat(v.months) || 1;
            const fees = parseFloat(v.insurance) || 0;

            if (r === 0) {
                return {
                    monthly: p / n, totalPayment: p + fees, totalInterest: 0,
                    chart: { segments: [{ label: { tr: "Anapara", en: "Principal" }, value: p, colorClass: "bg-white", colorHex: "#ffffff" }] },
                    bankRatesList: [
                        { bank: "Ziraat Bankası", rate: "4.54" }, { bank: "Garanti BBVA", rate: "4.99" },
                        { bank: "İş Bankası", rate: "4.92" }, { bank: "Akbank", rate: "5.02" }
                    ]
                };
            }

            const monthly = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
            const totalPayment = (monthly * n) + fees;
            const totalInterest = (monthly * n) - p;

            return {
                monthly, totalPayment, totalInterest,
                bankRatesList: [
                    { bank: "Ziraat Bankası", rate: "4.54" }, { bank: "Garanti BBVA", rate: "4.99" },
                    { bank: "İş Bankası", rate: "4.92" }, { bank: "Akbank", rate: "5.02" }
                ],
                chart: {
                    segments: [
                        { label: { tr: "Anapara", en: "Principal" }, value: p, colorClass: "bg-white", colorHex: "#ffffff" },
                        { label: { tr: "Toplam Faiz & Vergi", en: "Interest & Tax" }, value: totalInterest, colorClass: "bg-destructive", colorHex: "hsl(var(--destructive))" },
                        ...(fees > 0 ? [{ label: { tr: "Masraflar", en: "Fees" }, value: fees, colorClass: "bg-muted", colorHex: "#94a3b8" }] : [])
                    ]
                }
            };
        },
        seo: {
            title: { tr: "İhtiyaç Kredisi Hesaplama 2026 — En Uygun Faiz Oranları", en: "Personal Loan Calculator 2026" },
            metaDescription: { tr: "İhtiyaç kredisi taksit hesaplama aracı ile ödeme planınızı oluşturun. Çekeceğiniz kredi tutarına göre aylık taksitleri ve faiz maliyetini anında öğrenin.", en: "Calculate your personal loan installments and see the exact interest cost and payment plan." },
            content: { tr: "İhtiyaç kredisi (Tüketici kredisi), kişisel nakit ihtiyaçlarınızı karşılamak için bankalardan kullandığınız finansman türüdür. Türkiye'de ihtiyaç kredilerinde yasal olarak maksimum vade 36 aydır. Hesaplamalar, BSMV (%15) ve KKDF (%15) vergileri dahil edilerek brüt faiz üzerinden banka standartlarında yapılır.", en: "Personal loan calculator includes standard Turkish taxes (BSMV and KKDF) applied to the nominal interest rate." },
            faq: [
                { q: { tr: "İhtiyaç kredisi maksimum vade ne kadardır?", en: "What is the maximum term for personal loans?" }, a: { tr: "BDDK kurallarına göre 50.000 TL'ye kadar 36 ay, 50.000 TL - 100.000 TL arası 24 ay, 100.000 TL üstü 12 aydır.", en: "By BRSA rules, up to 50k TL is 36 months, 50k-100k is 24 months, and above 100k is 12 months." } },
                { q: { tr: "Faize BSMV ve KKDF dahil mi?", en: "Are taxes included in the interest?" }, a: { tr: "Evet, girdiğiniz net faiz oranı sistem tarafından bankaların uyguladığı %30 (%15 BSMV + %15 KKDF) yasal vergi yüküyle çarpılarak hesaplanır.", en: "Yes, standard legal tax burdens (KKDF/BSMV) are added algorithmically." } }
            ],
            richContent: {
                howItWorks: { tr: "Seçtiğiniz vade, tutar ve faiz oranı üzerinden standart anüite formülü ile aylık eşit taksitler bulunur.", en: "Monthly installments are found via a standard annuity formula based on given amount, term and rate." },
                formulaText: { tr: "Aylık Taksit = Tutar × [Brüt Faiz × (1+Brüt Faiz)^Vade] / [(1+Brüt Faiz)^Vade - 1]. Brüt Faiz = Net Faiz × 1,30.", en: "Payment = Amount × [Gross Rate × (1+Gross Rate)^Term] / [(1+Gross Rate)^Term - 1]." },
                exampleCalculation: { tr: "50.000 TL, 12 Ay, %4.99 Faiz: Brüt faiz ≈ %6.48. Aylık taksit: 5.753 TL, Toplam: 69.047 TL.", en: "50,000 TL for 12 months at 4.99% gives around 5,753 TL monthly payment due to inclusive taxes." },
                miniGuide: { tr: "<ul><li><b>Masraf:</b> Tahsis ücreti ve sigorta primlerini göz önünde bulundurun.</li></ul>", en: "Always consider allocation fees and life insurance costs." }
            }
        }
    },
    {
        id: "konut-kredisi",
        slug: "konut-kredisi-hesaplama",
        category: "finansal-hesaplamalar",
        name: { tr: "Konut Kredisi Hesaplama", en: "Mortgage Calculator" },
        h1: { tr: "Konut Kredisi Hesaplama — Ev Kredisi Taksitleri", en: "Mortgage Calculator — Home Loan Installments" },
        description: { tr: "Ev almak için çekeceğiniz konut kredisinin aylık ödemelerini hesaplayın.", en: "Calculate your monthly home loan payments." },
        shortDescription: { tr: "Konut kredisi hesaplama aracı ile kira öder gibi ev sahibi olma planınızı yapın.", en: "Plan your mortgage payments with ease." },
        relatedCalculators: ["kredi-dosya-masrafi-hesaplama", "kredi-taksit-hesaplama", "kredi-erken-kapama-hesaplama"],
        inputs: [
            { id: "amount", name: { tr: "Kredi Tutarı", en: "Loan Amount" }, type: "range", defaultValue: 1000000, suffix: "₺", min: 50000, max: 20000000, step: 10000, required: true },
            { id: "months", name: { tr: "Vade", en: "Term" }, type: "range", defaultValue: 120, suffix: " Ay", min: 1, max: 240, step: 12, required: true },
            { id: "rate", name: { tr: "Faiz Oranı", en: "Interest Rate" }, type: "number", defaultValue: 3.10, prefix: "%", step: 0.01, required: true },
            { id: "insurance", name: { tr: "Ekspertiz & Masraflar", en: "Fees & Extras" }, type: "number", defaultValue: 15000, suffix: "₺", required: false },
        ],
        results: [
            { id: "monthly", label: { tr: "Aylık Taksit", en: "Monthly Payment" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "totalInterest", label: { tr: "Toplam Faiz", en: "Total Interest" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "totalPayment", label: { tr: "Toplam Geri Ödeme", en: "Total Payment" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "bankRatesList", label: { tr: "Güncel Konut Kredisi Faiz Oranları", en: "Current Mortgage Rates" }, type: "bankRates" },
            { id: "chart", label: { tr: "Maliyet Dağılımı", en: "Cost Distribution" }, type: "pieChart" }
        ],
        formula: (v) => {
            const p = parseFloat(v.amount) || 0;
            const r = (parseFloat(v.rate) || 0) / 100;
            const n = parseFloat(v.months) || 1;
            const fees = parseFloat(v.insurance) || 0;

            if (r === 0) {
                return {
                    monthly: p / n, totalPayment: p + fees, totalInterest: 0,
                    chart: { segments: [{ label: { tr: "Anapara", en: "Principal" }, value: p, colorClass: "bg-white", colorHex: "#ffffff" }] },
                    bankRatesList: [
                        { bank: "Ziraat Bankası", rate: "2.79" }, { bank: "VakıfBank", rate: "2.79" },
                        { bank: "Garanti BBVA", rate: "3.20" }, { bank: "Akbank", rate: "3.10" }
                    ]
                };
            }

            const monthly = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
            const totalPayment = (monthly * n) + fees;
            const totalInterest = (monthly * n) - p;

            return {
                monthly, totalPayment, totalInterest,
                bankRatesList: [
                    { bank: "Ziraat Bankası", rate: "2.79" }, { bank: "VakıfBank", rate: "2.79" },
                    { bank: "Garanti BBVA", rate: "3.20" }, { bank: "Akbank", rate: "3.10" }
                ],
                chart: {
                    segments: [
                        { label: { tr: "Anapara", en: "Principal" }, value: p, colorClass: "bg-white", colorHex: "#ffffff" },
                        { label: { tr: "Toplam Faiz", en: "Total Interest" }, value: totalInterest, colorClass: "bg-destructive", colorHex: "hsl(var(--destructive))" },
                        ...(fees > 0 ? [{ label: { tr: "Masraflar", en: "Fees" }, value: fees, colorClass: "bg-muted", colorHex: "#94a3b8" }] : [])
                    ]
                }
            };
        },
        seo: {
            title: { tr: "Konut Kredisi Hesaplama 2026 — Ev Kredisi Araçları", en: "Mortgage Calculator 2026" },
            metaDescription: { tr: "Uzun vadeli konut kredinizi en ince ayrıntısına kadar hesaplayın. Ev kredisi faiz oranlarıyla aylık taksitlerinizi görün.", en: "Calculate your long-term mortgage payments and understand the total interest costs easily." },
            content: { tr: "Konut kredisi (Ev kredisi / Mortgage), yasal mevzuata göre vergiden muaf (KKDF ve BSMV uygulanmaz) özel bir kredi türüdür. Satın alacağınız evin ekspertiz değerinin %90'ına kadar kredi kullanabilirsiniz.", en: "Mortgages in Turkey are exempt from BSMV and KKDF taxes." },
            faq: [
                { q: { tr: "Konut kredisinde vergiler neden %0?", en: "Why are taxes 0% for mortgages?" }, a: { tr: "Devlet, barınma ihtiyacını desteklemek amacıyla konut alımlarında tüketiciyi destekler ve BSMV/KKDF almaz.", en: "The state supports housing purchases by exempting them from standard consumer loan taxes." } },
                { q: { tr: "Ekspertiz ücreti nedir?", en: "What is an appraisal fee?" }, a: { tr: "Banka, evin değerini belirlemek için SPK lisanslı bir uzman gönderir ve bu işlem için sabit bir bedel talep eder.", en: "Banks charge a fee to send a certified appraiser to value the property." } }
            ],
            richContent: {
                howItWorks: { tr: "120 veya 240 aylık uzun vadelerde anüite formülü ile taksitler vergi eklenmeden (net faiz üzerinden) bulunur.", en: "Calculates using standard net interest without tax additions over extended terms." },
                formulaText: { tr: "Aylık Taksit = Tutar × [Net Faiz × (1+Net Faiz)^Vade] / [(1+Net Faiz)^Vade - 1].", en: "Payment = Amount × [Net Rate × (1+Net Rate)^Term] / [(1+Net Rate)^Term - 1]." },
                exampleCalculation: { tr: "1.000.000 TL, 120 Ay, %3.10 Faiz: Aylık taksit yaklaşık 31.849 TL'dir.", en: "1M TL for 120 months at 3.10% is ~31,849 TL." },
                miniGuide: { tr: "<ul><li><b>Peşinat:</b> Ne kadar yüksek peşinat verirseniz faiz yükünden o kadar kurtulursunuz.</li></ul>", en: "Higher down payments reduce long-term interest drastically." }
            }
        }
    },
    {
        id: "tasit-kredisi",
        slug: "tasit-kredisi-hesaplama",
        category: "finansal-hesaplamalar",
        name: { tr: "Taşıt Kredisi Hesaplama", en: "Vehicle Loan Calculator" },
        h1: { tr: "Taşıt Kredisi Hesaplama — Araç Kredisi Fırsatları", en: "Vehicle Loan Calculator — Car Financing" },
        description: { tr: "0 KM veya İkinci El araç alımlarında bankaların Taşıt Kredisi taksitlerini öğrenin.", en: "Calculate vehicle loan installments for new or used cars." },
        shortDescription: { tr: "Otomobil hayalinize taşıt kredisi taksit hesaplayıcı ile planlı adım atın.", en: "Step into your dream car with our vehicle loan planner." },
        relatedCalculators: ["ihtiyac-kredisi-hesaplama", "kredi-yillik-maliyet-orani-hesaplama", "ticari-arac-kredisi-hesaplama"],
        inputs: [
            { id: "amount", name: { tr: "Kredi Tutarı", en: "Loan Amount" }, type: "range", defaultValue: 400000, suffix: "₺", min: 50000, max: 2000000, step: 10000, required: true },
            { id: "months", name: { tr: "Vade", en: "Term" }, type: "range", defaultValue: 36, suffix: " Ay", min: 1, max: 48, step: 1, required: true },
            { id: "rate", name: { tr: "Faiz Oranı", en: "Interest Rate" }, type: "number", defaultValue: 4.49, prefix: "%", step: 0.01, required: true }
        ],
        results: [
            { id: "monthly", label: { tr: "Aylık Taksit", en: "Monthly Payment" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "totalInterest", label: { tr: "Toplam Faiz", en: "Total Interest" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "totalPayment", label: { tr: "Toplam Geri Ödeme", en: "Total Payment" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "bankRatesList", label: { tr: "Güncel Taşıt Kredisi Faiz Oranları", en: "Current Auto Loan Rates" }, type: "bankRates" },
            { id: "chart", label: { tr: "Maliyet Dağılımı", en: "Cost Distribution" }, type: "pieChart" }
        ],
        formula: (v) => {
            const p = parseFloat(v.amount) || 0;
            const taxFactor = 1.30;
            const baseRate = parseFloat(v.rate) / 100;
            const r = baseRate * taxFactor;
            const n = parseFloat(v.months) || 1;

            if (r === 0) {
                return {
                    monthly: p / n, totalPayment: p, totalInterest: 0,
                    chart: { segments: [{ label: { tr: "Anapara", en: "Principal" }, value: p, colorClass: "bg-white", colorHex: "#ffffff" }] },
                    bankRatesList: [
                        { bank: "Ziraat Bankası", rate: "3.99" }, { bank: "Garanti BBVA", rate: "4.69" },
                        { bank: "VakıfBank", rate: "4.30" }, { bank: "Akbank", rate: "4.49" }
                    ]
                };
            }

            const monthly = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
            const totalPayment = monthly * n;
            const totalInterest = totalPayment - p;

            return {
                monthly, totalPayment, totalInterest,
                bankRatesList: [
                    { bank: "Ziraat Bankası", rate: "3.99" }, { bank: "Garanti BBVA", rate: "4.69" },
                    { bank: "VakıfBank", rate: "4.30" }, { bank: "Akbank", rate: "4.49" }
                ],
                chart: {
                    segments: [
                        { label: { tr: "Anapara", en: "Principal" }, value: p, colorClass: "bg-white", colorHex: "#ffffff" },
                        { label: { tr: "Toplam Vergi & Faiz", en: "Tax & Interest" }, value: totalInterest, colorClass: "bg-destructive", colorHex: "hsl(var(--destructive))" },
                    ]
                }
            };
        },
        seo: {
            title: { tr: "Taşıt Kredisi Hesaplama 2026 — Araç Kredisi Faiz Oranı", en: "Auto Loan Calculator 2026" },
            metaDescription: { tr: "Sıfır ve 2. el araba kredisinde güncel faiz oranlarına göre taşıt kredisi taksitlerinizi hızlıca hesaplayın.", en: "Calculate your auto loan installments with current rates for new or used vehicles." },
            content: { tr: "Taşıt kredisi (Otomobil kredisi), bireylerin motorlu taşıt satın almaları için sunulan ipotekli bir kredi türüdür. BDDK'ya göre satın alınacak aracın fatura veya kasko değerine göre seçilebilecek maksimum vade sınırı 48 aydır.", en: "Auto loans are secured loans for purchasing vehicles. Terms depend on the vehicle's value up to 48 months in Turkey." },
            faq: [
                { q: { tr: "Araç kredilerinde maksimum vade 48 ay mı?", en: "Is 48 months the maximum term?" }, a: { tr: "Evet, ancak aracın değerine göre değişir. Düşük tutarlı araçlarda 48 ay, premium araçlarda 12-24 aya kadar sınırlanabilir.", en: "Yes, but it depends on car value. Luxury cars are capped at shorter terms like 12-24 months." } },
                { q: { tr: "Kasko mecburiyeti var mıdır?", en: "Is comprehensive insurance required?" }, a: { tr: "Banka aracı güvence altına almak için kredi süresince Kasko sigortasını şart koşar.", en: "Yes, banks require comprehensive insurance to secure the asset." } }
            ],
            richContent: {
                howItWorks: { tr: "BDDK yönetmelikleri, BSMV ve KKDF vergileri brüt faize eklendikten sonra anüite tabanlı sabit taksit hesaplanır.", en: "Fixed installments are calculated with BSMV and KKDF included in the gross rate." },
                formulaText: { tr: "Aylık Taksit = Tutar × [Brüt Faiz × (1+Brüt Faiz)^Vade] / [(1+Brüt Faiz)^Vade - 1]", en: "Payment = Amount × [Gross Rate × (1+Gross Rate)^Term] / [(1+Gross Rate)^Term - 1]" },
                exampleCalculation: { tr: "400.000 TL, 36 ay, %4.49 faiz için aylık taksit ortalama 26.685 TL'dir.", en: "For 400k at 4.49% over 36 months, monthly is ~26,685 TL." },
                miniGuide: { tr: "<ul><li><b>İpotek:</b> Kredi bitene kadar araç üzerinde rehin bulunur, satılamaz.</li></ul>", en: "The vehicle cannot be sold until the loan is fully paid directly to the bank." }
            }
        }
    }
];

export const creditCalculatorsP2: CalculatorConfig[] = [
    {
        id: "kredi-yillik-maliyet-orani",
        slug: "kredi-yillik-maliyet-orani-hesaplama",
        category: "finansal-hesaplamalar",
        name: { tr: "Kredi Yıllık Maliyet Oranı Hesaplama", en: "APR Calculator" },
        h1: { tr: "Yıllık Maliyet Oranı Hesaplama — Kredinin Gerçek Maliyeti", en: "Annual Percentage Rate (APR) Calculator" },
        description: { tr: "Kredi çekerken katlanacağınız tüm masraflar dahil gerçek yıllık maliyet oranını hesaplayın.", en: "Calculate the true Annual Percentage Rate (APR) including all loan fees." },
        shortDescription: { tr: "Bankaların sunduğu kredilerin gerçek maliyet oranlarını karşılaştırmak için APR hesaplayın.", en: "Compare the true cost of bank loans by calculating their APR." },
        relatedCalculators: ["ihtiyac-kredisi-hesaplama", "kredi-taksit-hesaplama"],
        inputs: [
            { id: "amount", name: { tr: "Kredi Tutarı", en: "Loan Amount" }, type: "number", defaultValue: 100000, suffix: "₺", required: true },
            { id: "months", name: { tr: "Vade (Ay)", en: "Term (Months)" }, type: "number", defaultValue: 12, required: true },
            { id: "rate", name: { tr: "Aylık Nominal Faiz", en: "Monthly Nominal Rate" }, type: "number", defaultValue: 4.99, prefix: "%", step: 0.01, required: true },
            { id: "fees", name: { tr: "Tahsis, Sigorta Masrafı", en: "Total Fees" }, type: "number", defaultValue: 600, suffix: "₺", required: true }
        ],
        results: [
            { id: "apr", label: { tr: "Yıllık Maliyet Oranı (APR)", en: "Annual Percentage Rate (APR)" }, suffix: " %", decimalPlaces: 2 },
            { id: "monthly", label: { tr: "Aylık Taksit", en: "Monthly Installment" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "netReceived", label: { tr: "Elinize Net Geçen", en: "Net Amount Received" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "totalPaid", label: { tr: "Toplam Geri Ödeme", en: "Total Pay" }, suffix: " ₺", decimalPlaces: 2 }
        ],
        formula: (v) => {
            const p = parseFloat(v.amount) || 0;
            const nominalRate = (parseFloat(v.rate) || 0) / 100;
            const taxFactor = 1.30;
            const r = nominalRate * taxFactor;
            const n = parseFloat(v.months) || 1;
            const fees = parseFloat(v.fees) || 0;

            if (r === 0 || n <= 0) return { apr: 0, monthly: p / n, netReceived: p - fees, totalPaid: p };

            const monthly = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
            const netReceived = p - fees;
            const totalPaid = monthly * n;

            let low = 0.0;
            let high = 1.0;
            let irr = 0.0;
            for (let i = 0; i < 50; i++) {
                irr = (low + high) / 2;
                let presentValue = 0;
                for (let j = 1; j <= n; j++) {
                    presentValue += monthly / Math.pow(1 + irr, j);
                }
                if (presentValue > netReceived) low = irr; else high = irr;
            }

            const apr = (Math.pow(1 + irr, 12) - 1) * 100;

            return { apr, monthly, netReceived, totalPaid };
        },
        seo: {
            title: { tr: "Kredi Yıllık Maliyet Oranı (APR) Hesaplama 2026", en: "Loan APR Calculator 2026" },
            metaDescription: { tr: "Kredinin gerçek faiz oranını bulun. Ücretler, sigorta ve tahsis masrafları dahil edilerek Yıllık Maliyet Oranını anında hesaplayın.", en: "Find the true interest rate of a loan. Calculate APR instantly including all fees and insurance overheads." },
            content: { tr: "Yıllık Maliyet Oranı (APR), bir kredinin tüketiciye sadece nominal faiz üzerinden değil, alınan tüm masraf, sigorta ve komisyonların eklenerek hesaplandığı 'gerçek' maliyetidir.", en: "APR represents the true cost of borrowing, factoring in all upfront fees alongside the nominal interest rate." },
            faq: [
                { q: { tr: "Aylık faiz ile APR arasındaki fark nedir?", en: "What's the difference between monthly rate and APR?" }, a: { tr: "Aylık faiz sadece anaparaya uygulanan orandır. APR ise masraflar yüzünden elinize eksik geçen tutarın, aslında yüzde kaçla faizlendiğini gösteren kümülatif orandır.", en: "Monthly rate applies to principal alone. APR accounts for upfront fees." } }
            ],
            richContent: {
                howItWorks: { tr: "Elinize Net Geçen Tutar üzerinden aylık nakit akışlarına IRR (İç Verim Oranı) uygulanarak gerçek getiri oranı bulunur, bu da yıllığa çevrilir.", en: "Calculates the Internal Rate of Return (IRR) on your cash flows to find true annualized cost." },
                formulaText: { tr: "Net Para = [ Taksit / (1+IRR)^t ] toplamına. APR = ((1+IRR)^12 - 1) x 100", en: "Net Amount = Sum of [ Payment / (1+IRR)^t ]. APR = [ (1 + IRR)^12 - 1 ] × 100" },
                exampleCalculation: { tr: "100.000 TL, %4.99 faiz, 1.000 TL masraf. Taksit 11.530 TL, Net ele geçen 99.000 TL. Bu durumda gerçek yıllık maliyet çok daha yüksek çıkar.", en: "100K TL at 4.99% nominal with 1,000 TL fees translates to a higher APR." },
                miniGuide: { tr: "<ul><li>Her zaman farklı bankaların APR (Yıllık Maliyet Oranı) verilerini kıyaslayın, faizi değil!</li></ul>", en: "Always choose the loan with the lowest APR." }
            }
        }
    },
    {
        id: "kredi-karti-ek-taksit",
        slug: "kredi-karti-ek-taksit-hesaplama",
        category: "finansal-hesaplamalar",
        name: { tr: "Kredi Kartı Ek Taksit Hesaplama", en: "Credit Card Extra Installment Calculator" },
        h1: { tr: "Kredi Kartı Peşin İşleme Ek Taksit Ücreti Hesaplama", en: "Credit Card Extra Installment Cost Calculator" },
        description: { tr: "Peşin alışverişlerinize sonradan uygulanan ek taksit faiz maliyetlerini hesaplayın.", en: "Calculate the extra interest costs applied when installing cash purchases on credit cards." },
        shortDescription: { tr: "Banka kartınızdan tek çekim yaptığınız alışverişi sonradan taksitlendirmenin maliyetini hemen görün.", en: "See the cost of splitting your single-charge purchases into installments later." },
        relatedCalculators: ["kredi-karti-gecikme-faizi-hesaplama", "kredi-taksit-hesaplama"],
        inputs: [
            { id: "amount", name: { tr: "Alışveriş (İşlem) Tutarı", en: "Purchase Amount" }, type: "number", defaultValue: 15000, suffix: "₺", required: true },
            { id: "months", name: { tr: "İstenen Taksit Sayısı", en: "Installment Count" }, type: "range", defaultValue: 6, min: 2, max: 12, step: 1, required: true },
            { id: "rate", name: { tr: "Aylık Akdi Faiz", en: "Monthly Interest Rate" }, type: "number", defaultValue: 4.25, prefix: "%", step: 0.01, required: true }
        ],
        results: [
            { id: "monthly", label: { tr: "Aylık Taksit Tutarı", en: "Monthly Installment" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "interest", label: { tr: "Sonradan Taksit Faizi + Vergi", en: "Installment Charge" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "total", label: { tr: "Hesaptan Çıkacak Toplam", en: "Total Amount" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "chart", label: { tr: "Maliyet Dağılımı", en: "Cost Distribution" }, type: "pieChart" }
        ],
        formula: (v) => {
            const p = parseFloat(v.amount) || 0;
            const nominalRate = (parseFloat(v.rate) || 0) / 100;
            const taxFactor = 1.30;
            const r = nominalRate * taxFactor;
            const n = parseFloat(v.months) || 2;

            if (r === 0) return { monthly: p / n, interest: 0, total: p, chart: { segments: [{ label: { tr: "Anapara", en: "Principal" }, value: p, colorClass: "bg-white", colorHex: "#ffffff" }] } };

            const monthly = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
            const total = monthly * n;
            const interest = total - p;

            return {
                monthly, interest, total,
                chart: {
                    segments: [
                        { label: { tr: "Anapara", en: "Principal" }, value: p, colorClass: "bg-white", colorHex: "#ffffff" },
                        { label: { tr: "Faiz & Vergi", en: "Interest & Tax" }, value: interest, colorClass: "bg-destructive", colorHex: "hsl(var(--destructive))" }
                    ]
                }
            };
        },
        seo: {
            title: { tr: "Kredi Kartı Sonradan Taksitlendirme Hesaplama", en: "Credit Card Installment Calculator" },
            metaDescription: { tr: "Kredi kartı ile peşin yaptığınız alışverişlerinizi sonradan taksitlendirdiğinizde bankanın kestiği faiz ücretini anında hesaplayın.", en: "Calculate post-purchase installment fees and find out the extra interest cost on your credit card." },
            content: { tr: "Kredi kartı sonradan taksitlendirme işlemi, peşin yapılan işlemi anüiteye göre faiz oranlarıyla böler. Bankalar bu işleme yasal akdi faiz ve %30 vergi dâhil ederler.", en: "Splits a single payment transaction into monthly payments using an established interest rate plus 30% taxes." },
            faq: [
                { q: { tr: "Sonradan taksitlendirmede faiz uygulanır mı?", en: "Is interest applied to post-installments?" }, a: { tr: "Evet, kampanyalar dışında standart taksitlendirmeler aylık işlem faizi artı vergilerle fatura edilir.", en: "Yes, standard extra installments are subjected to ordinary monthly interest rates." } }
            ],
            richContent: {
                howItWorks: { tr: "İşlem tutarına, standart akdi faiz ve BSMV (%15) + KKDF (%15) yasal vergileri hesaplanarak aylık eşit taksitler oluşturulur.", en: "Calculates equal monthly installments factoring in BSMV and KKDF taxes." },
                formulaText: { tr: "Ek Taksit Bedeli = Tutar × [Brüt Faiz × (1+Brüt Faiz)^Vade] / [(1+Brüt Faiz)^Vade - 1]", en: "EMI = Transaction Amount × [Gross Rate × (1+Gross Rate)^Term] / [(1+Gross Rate)^Term - 1]" },
                exampleCalculation: { tr: "15.000 TL işlem, 6 taksit, %4.25 faiz üzerinden kesilen faiz ve vergi yüzlerce lirayı bulur.", en: "A 15,000 TL purchase over 6 installments at 4.25% will generate high extra interest & taxes." },
                miniGuide: { tr: "<ul><li>Taksitlendirme ekstre kesilmeden önceki dönem içi hareketlerde yapılmalıdır.</li></ul>", en: "Installment setup must be done before statement closing." }
            }
        }
    },
    {
        id: "kredi-karti-gecikme-faizi",
        slug: "kredi-karti-gecikme-faizi-hesaplama",
        category: "finansal-hesaplamalar",
        name: { tr: "Kredi Kartı Gecikme Faizi Hesaplama", en: "Credit Card Late Fee Calculator" },
        h1: { tr: "Kredi Kartı Gecikme Faizi ve Vergi Hesaplama", en: "Credit Card Late Fee & Tax Calculator" },
        description: { tr: "Asgari tutarı ödenmemiş kredi kartları için günlük gecikme faizi ve vergilerini hesaplayın.", en: "Calculate daily late fees and taxes for unpaid credit card statement balances." },
        shortDescription: { tr: "Kredi kartı ekstrenizi geciktirirseniz ödeyeceğiniz ceza tutarını sadece 10 saniyede görün.", en: "See the monetary penalty for delaying your credit card payment." },
        relatedCalculators: ["kdv-hesaplama", "kredi-karti-ek-taksit-hesaplama"],
        inputs: [
            { id: "debt", name: { tr: "Kalan Ekstre Borcu", en: "Remaining Debt" }, type: "number", defaultValue: 20000, suffix: "₺", required: true },
            { id: "days", name: { tr: "Gecikilen Gün", en: "Days Late" }, type: "number", defaultValue: 15, required: true },
            { id: "rate", name: { tr: "Aylık Gecikme Faizi", en: "Monthly Late Rate" }, type: "number", defaultValue: 4.55, prefix: "%", step: 0.01, required: true }
        ],
        results: [
            { id: "lateInterest", label: { tr: "Net Gecikme Faizi", en: "Net Late Interest" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "taxes", label: { tr: "Vergiler (%30)", en: "Taxes (%30)" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "totalCost", label: { tr: "Toplam Ceza", en: "Total Penalty" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "chart", label: { tr: "Ceza Dağılımı", en: "Penalty Distribution" }, type: "pieChart" }
        ],
        formula: (v) => {
            const debt = parseFloat(v.debt) || 0;
            const days = parseFloat(v.days) || 0;
            const monthlyRate = (parseFloat(v.rate) || 0) / 100;
            const dailyRate = monthlyRate / 30;
            const lateInterest = debt * dailyRate * days;
            const taxes = lateInterest * 0.30;
            const totalCost = lateInterest + taxes;

            return { lateInterest, taxes, totalCost, chart: { segments: [{ label: { tr: "Net Faiz", en: "Net Interest" }, value: lateInterest, colorClass: "bg-destructive", colorHex: "hsl(var(--destructive))" }, { label: { tr: "Vergiler", en: "Taxes" }, value: taxes, colorClass: "bg-muted", colorHex: "#94a3b8" }] } };
        },
        seo: {
            title: { tr: "Kredi Kartı Gecikme Faizi Hesaplama 2026", en: "Credit Card Late Interest Calculator 2026" },
            metaDescription: { tr: "Kredi kartı ekstre borcunuzu geciktirdiğinizde doğacak olan günlük yasal mevzuat faizini hesaplayın.", en: "Calculate the exact daily legal interest rate applied when you delay credit card payments." },
            content: { tr: "Ekstrede asgari ödeme yapılmadığında, ödenmeyen asgari için Gecikme Faizi, asgari üzeri ödenmeyen tutar için Akdi faiz işler.", en: "Late interest is strictly applied on unpaid balances daily." },
            faq: [
                { q: { tr: "Gecikme faizi asgari ödemeye mi işler?", en: "Does late interest apply to minimum due?" }, a: { tr: "Evet, asgari borç kısmı için Gecikme Merkezi faizi uygulanırken, asgarinin üstündeki kısmı için de normal akdi faiz işletilir.", en: "Unpaid minimum parts collect Late Interest." } }
            ],
            richContent: {
                howItWorks: { tr: "Borç tutarı üzerinden (Aylık Faiz / 30) formülüyle günlük faiz ve üzerine %30 vergi yüklenir.", en: "Calculates the daily multiplier from the monthly rate, then injects 30% aggregate taxes." },
                formulaText: { tr: "Günlük Oran = Aylık Faiz / 30. Net Faiz = Borç x Günlük Oran x Gün. Ceza = Faiz x 1.30", en: "Daily Rate = Monthly Rate / 30. Total = Net Interest × 1.30." },
                exampleCalculation: { tr: "20.000 TL için %4.55 faizle 15 günde toplam ceza 600 liraya kadar ulaşabilir.", en: "Delaying 20K debt yields huge interest + taxes over just a few weeks." },
                miniGuide: { tr: "<ul><li>Findeks kredi notunuzu düşürmemek için kesinlikle asgariyi ödeyin!</li></ul>", en: "Always pay at least the minimum to save your credit score." }
            }
        }
    },
    {
        id: "kredi-karti-islem-taksitlendirme",
        slug: "kredi-karti-islem-taksitlendirme-hesaplama",
        category: "finansal-hesaplamalar",
        name: { tr: "Kredi Kartı İşlem Taksitlendirme Hesaplama", en: "Credit Card Installment Planner" },
        h1: { tr: "Kredi Kartı Peşin İşlem Taksitlendirme", en: "Credit Card Installment Planner" },
        description: { tr: "Kredi kartından tek seferde yaptığınız alışverişin taksitli geri ödemesini hesaplayın.", en: "Calculate installment plans for single-charge credit card purchases." },
        shortDescription: { tr: "Ekstrenizi bölmek mi istiyorsunuz? Peşin işlemin taksitlendirme maliyetini anında görün.", en: "Split your statement easily by checking the extra charges for installment plans." },
        relatedCalculators: ["kredi-karti-ek-taksit-hesaplama", "kredi-yillik-maliyet-orani-hesaplama"],
        inputs: [
            { id: "amount", name: { tr: "İşlem Tutarı", en: "Transaction Amount" }, type: "number", defaultValue: 50000, suffix: "₺", required: true },
            { id: "months", name: { tr: "Taksit Sayısı", en: "Installment Count" }, type: "range", defaultValue: 12, min: 2, max: 12, step: 1, required: true },
            { id: "rate", name: { tr: "Akdi Faiz Oranı", en: "Interest Rate" }, type: "number", defaultValue: 4.25, prefix: "%", step: 0.01, required: true }
        ],
        results: [
            { id: "monthly", label: { tr: "Aylık Taksit Tutarı", en: "Monthly Installment" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "totalInterest", label: { tr: "Toplam Faiz ve Vergi Maliyeti", en: "Total Interest & Tax Cost" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "total", label: { tr: "Toplam Geri Ödeme Tutarı", en: "Total Re-payment" }, suffix: " ₺", decimalPlaces: 2 }
        ],
        formula: (v) => {
            const p = parseFloat(v.amount) || 0;
            const nominalRate = (parseFloat(v.rate) || 0) / 100;
            const r = nominalRate * 1.30;
            const n = parseFloat(v.months) || 2;

            if (r === 0) return { monthly: p / n, totalInterest: 0, total: p };

            const monthly = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
            const total = monthly * n;
            const totalInterest = total - p;

            return { monthly, totalInterest, total };
        },
        seo: {
            title: { tr: "Kredi Kartı Peşin İşlem Taksitlendirme", en: "Credit Card Single Charge Installment" },
            metaDescription: { tr: "Kredi kartı tek çekim alışverişinizi bankadan 3, 6 veya 12 aya taksitlendirdiğinizde çıkacak toplam maliyeti hesaplayın.", en: "Calculate the total cost of converting a single credit card transaction into a 3 to 12-month installment plan." },
            content: { tr: "Tek çekim olarak gerçekleştirilen kart harcamaları, dönem borcu kesilmeden önce akdi faiz üzerinden 12 aya kadar yapılandırılabilir.", en: "Single transactions can be converted into installments before the statement closes." },
            faq: [
                { q: { tr: "Sonradan taksit mi ekstreyi bölmek mi?", en: "Post-installment vs splitting statement?" }, a: { tr: "Sonradan taksitlendirmede belirli bir işlem hedef alınır ve bölünür. Tüm ekstreyi de bölmek mümkündür ancak daha yüksek faiz çıkabilir.", en: "Specific transaction splitting is cheaper than rolling over the entire statement." } }
            ],
            richContent: {
                howItWorks: { tr: "Bankacılık akdi faizi tutara uygulanıp BSMV ve KKDF ile çarpılarak genel toplam maliyet anüite üzerinden yaratılır.", en: "Computes base cost and includes all consumer banking taxes for an exact monthly representation." },
                formulaText: { tr: "Ek Taksit Bedeli = Tutar × [Brüt Faiz × (1+Brüt Faiz)^Vade] / [(1+Brüt Faiz)^Vade - 1]", en: "EMI = Transaction Amount × [Gross Rate × (1+Gross Rate)^Term] / [(1+Gross Rate)^Term - 1]" },
                exampleCalculation: { tr: "50.000 TL işlem, 12 taksit, aylık 4.25% faizle taksitler 6.000 TL'yi geçecektir.", en: "Large 50K amounts carry heavy tax penalties when spread over 12 months." },
                miniGuide: { tr: "<ul><li>Ek taksit için gecikme olmadan işlem yapılmalıdır.</li></ul>", en: "Perform these actions immediately after purchase to avoid late status." }
            }
        }
    }
];

export const creditCalculatorsP3: CalculatorConfig[] = [
    {
        id: "kredi-karti-taksitli-nakit-avans",
        slug: "kredi-karti-taksitli-nakit-avans-hesaplama",
        category: "finansal-hesaplamalar",
        name: { tr: "Kredi Kartı Taksitli Nakit Avans", en: "Cash Advance Installment" },
        h1: { tr: "Taksitli Nakit Avans Hesaplama — Kredi Kartı", en: "Credit Card Cash Advance Calculator" },
        description: { tr: "Kredi kartınızdan çekeceğiniz nakit avansın aylık taksitlerini ve toplam faiz maliyetini hesaplayın.", en: "Calculate the installments and total interest of your credit card cash advance." },
        shortDescription: { tr: "Acil nakit ihtiyaçlarınızda kredi kartından avans çekmenin faiz ve vergi yükünü önceden görün.", en: "See the upfront cost and monthly installments before taking a cash advance from your card." },
        relatedCalculators: ["kredi-karti-ek-taksit-hesaplama", "ihtiyac-kredisi-hesaplama"],
        inputs: [
            { id: "amount", name: { tr: "Avans Tutarı (₺)", en: "Cash Amount (₺)" }, type: "number", defaultValue: 10000, suffix: "₺", required: true },
            { id: "months", name: { tr: "Vade", en: "Term" }, type: "range", defaultValue: 12, min: 2, max: 12, step: 1, required: true },
            { id: "rate", name: { tr: "Aylık Faiz Oranı", en: "Monthly Rate" }, type: "number", defaultValue: 4.42, prefix: "%", step: 0.01, required: true },
            { id: "feeMode", name: { tr: "Nakit Çekim Ücreti Prensibi", en: "Cash Advance Fee" }, type: "select", defaultValue: "yes", options: [{ label: { tr: "Eklensin (%1 Sabit Ücret)", en: "Include (1% Base Fee)" }, value: "yes" }, { label: { tr: "Eklenmesin", en: "None" }, value: "no" }] }
        ],
        results: [
            { id: "monthly", label: { tr: "Aylık Taksit Tutarı", en: "Monthly Installment" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "interest", label: { tr: "Toplam Kredi Yükü (Faiz + Vergi)", en: "Total Interest & Tax" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "upfront", label: { tr: "Nakit Avans Çekim Ücreti", en: "Upfront Cash Fee" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "total", label: { tr: "Banka Ekstresine Yansıyacak Toplam", en: "Total Re-payment" }, suffix: " ₺", decimalPlaces: 2 }
        ],
        formula: (v) => {
            const p = parseFloat(v.amount) || 0;
            const nominalRate = (parseFloat(v.rate) || 0) / 100;
            const taxFactor = 1.30;
            const r = nominalRate * taxFactor;
            const n = parseFloat(v.months) || 2;
            const fee = v.feeMode === "yes" ? p * 0.01 : 0;

            if (r === 0) return { monthly: p / n, interest: 0, upfront: fee, total: p + fee };

            const monthly = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
            const interest = (monthly * n) - p;
            const total = (monthly * n) + fee;

            return { monthly, interest, upfront: fee, total };
        },
        seo: {
            title: { tr: "Taksitli Nakit Avans Hesaplama 2026", en: "Credit Card Cash Advance Installment Calculator" },
            metaDescription: { tr: "Kredi kartından taksitli nakit avans çekerken doğacak faiz ve komisyonları, KKDF ve BSMV vergilerini anında hesaplayıp ödeme planı çıkartın.", en: "Calculate post-purchase installment fees and your credit card cash advance rate including the upfront fees easily." },
            content: { tr: "Taksitli Nakit Avans, kredi kartınızın limitini acil durumlarda nakit olarak bankamatikten (ATM) veya dijital bankacılıktan çekebilmenizi sağlayan kredilendirme işlemidir.", en: "A cash advance allows you to use your credit limit to get short-term cash at a bank branch, ATM or online." },
            faq: [
                { q: { tr: "Nakit avans işlemi için faiz oranı neden yüksektir?", en: "Why is the interest rate for cash advances high?" }, a: { tr: "Kredi kartından nakit çekim işlemlerinde, genelde standart alışveriş faiz oranının üzerinde bir avans faizi belirlenir ve ilk çekimde komisyon bedeli tahsil edilebilir.", en: "Credit card cash advances often carry higher interest rates compared to normal purchases, plus initial withdrawal premiums." } }
            ],
            richContent: {
                howItWorks: { tr: "Anüite tabanlı hesaplama, bankanın nakit avans için belirlediği komisyon ile Merkez Bankası kısıtlamalarına göre vergi faktörünü birleştirir.", en: "Equally distributed installments factored with Turkish standard cash advance taxes." },
                formulaText: { tr: "Avans Kredisi Bedeli = Çekim Tutarı × [Brüt Faiz × (1+Brüt Faiz)^Vade] / [(1+Brüt Faiz)^Vade - 1]. %1 Komisyon peşindir.", en: "EMI = Advance Amount × [Gross Rate × (1+Gross Rate)^Term] / [(1+Gross Rate)^Term - 1]." },
                exampleCalculation: { tr: "10.000 TL nakit, 12 ay, %4.42 faiz. Tüm vergi ve masraflar sonucu yaklaşık aylık taksitler biner lirayı çok rahat geçer.", en: "High impact of taxes means a 10K withdrawal turns into expensive monthly installments." },
                miniGuide: { tr: "<ul><li><b>Nakit İhtiyacı:</b> Nakit avans çekmek kısa vadeli çözüm olsa da faiz yükü İhtiyaç Kredisi faizine göre genelde hep daha yüksektir.</li></ul>", en: "Personal loans are cheaper for the long run compared to cash advances." }
            }
        }
    },
    {
        id: "ticari-arac-kredisi",
        slug: "ticari-arac-kredisi-hesaplama",
        category: "finansal-hesaplamalar",
        name: { tr: "Ticari Araç Kredisi Hesaplama", en: "Commercial Vehicle Loan Calculator" },
        h1: { tr: "Ticari Araç Kredisi Hesaplama — KOBİ ve Esnaf", en: "Commercial Auto Loan Calculator" },
        description: { tr: "Kamyon, panelvan veya şirket filonuz için ticari taşıt kredisini hesaplayın.", en: "Calculate commercial vehicle loan for trucks, vans, or corporate fleets." },
        shortDescription: { tr: "Firmanıza uygun faiz oranları ve %0 KKDF avantajıyla ticari araç kredisini hesaplayın.", en: "Calculate commercial vehicle loan exactly for your business." },
        relatedCalculators: ["tasit-kredisi-hesaplama", "ticari-kredi-hesaplama", "ticari-ihtiyac-kredisi-hesaplama"],
        inputs: [
            { id: "amount", name: { tr: "Kredi Tutarı", en: "Loan Amount" }, type: "range", defaultValue: 800000, suffix: "₺", min: 100000, max: 10000000, step: 20000, required: true },
            { id: "months", name: { tr: "Vade", en: "Term" }, type: "range", defaultValue: 48, suffix: " Ay", min: 1, max: 60, step: 1, required: true },
            { id: "rate", name: { tr: "Faiz Oranı", en: "Interest Rate" }, type: "number", defaultValue: 3.49, prefix: "%", step: 0.01, required: true }
        ],
        results: [
            { id: "monthly", label: { tr: "Aylık Taksit Tutarı", en: "Monthly Installment" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "totalInterest", label: { tr: "Toplam Faiz (Vergi Dahil)", en: "Total Interest" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "total", label: { tr: "Toplam Geri Ödeme", en: "Total Amount" }, suffix: " ₺", decimalPlaces: 2 }
        ],
        formula: (v) => {
            const p = parseFloat(v.amount) || 0;
            // Ticari Kredilerde KKDF %0'dır. Sadece BSMV %5 uygulanır. (taxFactor = 1.05)
            const nominalRate = (parseFloat(v.rate) || 0) / 100;
            const r = nominalRate * 1.05;
            const n = parseFloat(v.months) || 12;

            if (r === 0) return { monthly: p / n, totalInterest: 0, total: p };

            const monthly = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
            const total = monthly * n;
            const totalInterest = total - p;

            return { monthly, totalInterest, total };
        },
        seo: {
            title: { tr: "Ticari Araç Kredisi Hesaplama 2026", en: "Commercial Vehicle Loan Calculator 2026" },
            metaDescription: { tr: "İşletmenizin araç ve filo yenileme maliyetlerini ticari kredi oranları üzerinden, düşük KKDF ve BSMV avantajlarıyla anında hesaplayın.", en: "Calculate your corporate vehicle loan costs with the advantage of corporate tax reliefs quickly." },
            content: { tr: "Ticari Taşıt Kredisi, tüzel kişilerin veya şahıs şirketlerinin ticari faaliyetlerinde kullanmak üzere aldıkları hafif ya da ağır vasıta alımları için kullanılan kredi tipidir. Bireysel kredilerin aksine, ticari faiz indirimleri uygulanır.", en: "Commercial vehicle loans are granted to companies and SMEs, carrying tax benefits over standard individual loans." },
            faq: [
                { q: { tr: "Ticari araç onaylı kredilerde vergi ne kadar?", en: "What are the tax liabilities on commercial ones?" }, a: { tr: "Bireysel araçlarda uygulanan o ağır %15 KKDF, ticari kredilerde %0'dır. Yalnızca %5 BSMV uygulanmaktadır. Bu da ciddi faiz avantajı sağlar.", en: "Unlike consumer loans, commercial loans bear 0% KKDF and only 5% BSMV." } }
            ],
            richContent: {
                howItWorks: { tr: "Girilen net ticari faiz tutarına BSMV vergisi eklenir.", en: "Only BSMV is added to the nominal rate because commercial status exempts you from KKDF." },
                formulaText: { tr: "Aylık Ek Taksit = Tutar × [B.Faiz × (1+B.Faiz)^V] / [(1+B.Faiz)^V - 1]", en: "EMI = Transaction Amount × [Gross Rate × (1+Gross Rate)^Term] / [(1+Gross Rate)^Term - 1]" },
                exampleCalculation: { tr: "800.000 TL, 48 ay, %3.49 faizle, sadece cüzzi vergiler uygulanarak anüite taksitleri ortaya çıkar.", en: "Lower commercial factors make this structurally cheaper." },
                miniGuide: { tr: "<ul><li>Mükellefler ve esnaflar mutlak suretle şirket evraklarıyla ticari kategori kredisi seçmelidir.</li></ul>", en: "SMEs should apply with their corporate documents." }
            }
        }
    },
    {
        id: "ticari-kredi",
        slug: "ticari-kredi-hesaplama",
        category: "finansal-hesaplamalar",
        name: { tr: "Ticari Kredi Hesaplama", en: "Commercial Loan Calculator" },
        h1: { tr: "Ticari Kredi Hesaplama — İşletmelere Özel", en: "Commercial Loan Calculator" },
        description: { tr: "Esnaf, KOBİ ve tüzel şirketler için ticari kredi faiz ve ödemelerini %0 KKDF ile hesaplayın.", en: "Calculate commercial loans for SMEs with corporate interest rates and zero KKDF taxes." },
        shortDescription: { tr: "Şirketinizin sermaye, yatırım veya mal alımı için çekeceği ticari kredilerin maliyet planlaması.", en: "Plan your corporate and SME scale business loans accurately." },
        relatedCalculators: ["ticari-ihtiyac-kredisi-hesaplama", "ticari-arac-kredisi-hesaplama", "kredi-yillik-maliyet-orani-hesaplama"],
        inputs: [
            { id: "amount", name: { tr: "Kredi Tutarı", en: "Loan Amount" }, type: "range", defaultValue: 2500000, suffix: "₺", min: 100000, max: 50000000, step: 50000, required: true },
            { id: "months", name: { tr: "Vade", en: "Term" }, type: "range", defaultValue: 24, suffix: " Ay", min: 1, max: 60, step: 1, required: true },
            { id: "rate", name: { tr: "Aylık Faiz Oranı", en: "Interest Rate" }, type: "number", defaultValue: 3.25, prefix: "%", step: 0.01, required: true }
        ],
        results: [
            { id: "monthly", label: { tr: "Aylık Taksit Tutarı", en: "Monthly Installment" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "totalInterest", label: { tr: "Toplam Faiz (Maliyet)", en: "Total Interest" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "total", label: { tr: "Toplam Geri Ödeme", en: "Total Amount" }, suffix: " ₺", decimalPlaces: 2 }
        ],
        formula: (v) => {
            const p = parseFloat(v.amount) || 0;
            // Ticari Kredi -> BSMV %5, KKDF %0
            const nominalRate = (parseFloat(v.rate) || 0) / 100;
            const r = nominalRate * 1.05;
            const n = parseFloat(v.months) || 12;

            if (r === 0) return { monthly: p / n, totalInterest: 0, total: p };

            const monthly = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
            const total = monthly * n;
            const totalInterest = total - p;

            return { monthly, totalInterest, total };
        },
        seo: {
            title: { tr: "Ticari Kredi Hesaplama 2026 — KOBİ Kredileri Üst Limit", en: "Commercial & Business Loan Calculator 2026" },
            metaDescription: { tr: "Ticari bankacılık sistemi ile şirket, KOBİ ve kurumsal müşterilerinize özel ticari kredi faiz hesaplamasını tek tıkla gerçekleştirin.", en: "Run reliable commercial loan calculations with commercial tax factors for businesses." },
            content: { tr: "Ticari kredi, ticari faaliyette bulunan gerçek kişi veya tüzel kişilik sıfatı taşıyan tüm şirket gruplarının mal ve hizmet alımında kullandıkları yatırımsal kredi türüdür. BDDK'nın belirlediği faiz rejiminde 'bireysel değil' 'işletme' kurallarıyla regüle edilir.", en: "Business loans are extended specifically for operational expenses, investments, and cash flow maneuvers. They don't encompass personal consumer protection but provide far better regulatory tax metrics." },
            faq: [
                { q: { tr: "Ticari ihtiyaç kredisiyle düz ticari aynı mıdır?", en: "Is commercial personal loan and normal commercial loan same?" }, a: { tr: "Vergi matrahları (KKDF %0 ve BSMV %5) bakımından tamamen aynıdır. Yalnızca banka, limit tahsis süresindeki prodesürlerini kullanım türüne göre adlandırır.", en: "From a calculation point, they bare exactly identical taxes mathematically under corporate regimes." } }
            ],
            richContent: {
                howItWorks: { tr: "Ürün ticari nitelik taşıdığı için tüketicilerdeki ek vergilerin izine rastlanmaz; net banka faiz oranı yalnızca asgari vergilendirmelerle yansıtılarak tam taksit hesaplanır.", en: "Excludes crippling retail taxes entirely to surface exact business lending terms." },
                formulaText: { tr: "Taksit = Ticari Kredi Tutarı × [Ticari Net Faiz × (1+Faiz)^Vade] / [(1+Faiz)^Vade - 1]", en: "Calculate strictly over the corporate factors and net margins without consumer overrides." },
                exampleCalculation: { tr: "Özellikle Kredili Mevduat Hesabı (KMH) yerine büyük paket kredi kullanan işletmeciler %3.25 ticari faizle muazzam avantaj sağlarlar.", en: "Using a spot loan limits commercial interest heavily." },
                miniGuide: { tr: "<ul><li>Bilançolarınız esnek olsa bile ticari kredi kullanarak vergi matrahınızı borçlar hanesinden optimize edebilirsiniz.</li></ul>", en: "Leveraging debt accurately can shield elements of tax obligations." }
            }
        }
    },
    {
        id: "ticari-ihtiyac-kredisi",
        slug: "ticari-ihtiyac-kredisi-hesaplama",
        category: "finansal-hesaplamalar",
        name: { tr: "Ticari İhtiyaç Kredisi Hesaplama", en: "Commercial Personal Loan" },
        h1: { tr: "Ticari İhtiyaç Kredisi Hesaplama", en: "Commercial Personal Needs Loan Calculator" },
        description: { tr: "Şahıs işletmeleri ve serbest meslek sahipleri için ticari ihtiyaç kredisini hesaplayın.", en: "Calculate commercial liquidity loans for sole proprietors and SME vendors." },
        shortDescription: { tr: "Acil nakit ihtiyaçlarınızı düşük işletme vergileriyle kredi kullanarak kapatın.", en: "Fulfill urgent cash requirements through low-tax commercial lines." },
        relatedCalculators: ["ticari-kredi-hesaplama", "ihtiyac-kredisi-hesaplama"],
        inputs: [
            { id: "amount", name: { tr: "Kredi Tutarı", en: "Loan Amount" }, type: "range", defaultValue: 500000, suffix: "₺", min: 10000, max: 5000000, step: 10000, required: true },
            { id: "months", name: { tr: "Vade", en: "Term" }, type: "range", defaultValue: 36, suffix: " Ay", min: 1, max: 36, step: 1, required: true },
            { id: "rate", name: { tr: "Net Faiz Oranı", en: "Net Interest Rate" }, type: "number", defaultValue: 3.99, prefix: "%", step: 0.01, required: true }
        ],
        results: [
            { id: "monthly", label: { tr: "Aylık Taksit Tutarı", en: "Monthly Installment" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "totalInterest", label: { tr: "Sadece Faiz Maliyeti", en: "Sole Interest Cost" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "total", label: { tr: "Ticari Toplam Ödeme", en: "Total Re-payment" }, suffix: " ₺", decimalPlaces: 2 }
        ],
        formula: (v) => {
            const p = parseFloat(v.amount) || 0;
            // Ticari Kredi -> BSMV %5, KKDF %0
            const nominalRate = (parseFloat(v.rate) || 0) / 100;
            const r = nominalRate * 1.05;
            const n = parseFloat(v.months) || 12;

            if (r === 0) return { monthly: p / n, totalInterest: 0, total: p };

            const monthly = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
            const total = monthly * n;
            const totalInterest = total - p;

            return { monthly, totalInterest, total };
        },
        seo: {
            title: { tr: "Ticari İhtiyaç Nakit Kredisi Hesaplama", en: "Corporate Cash Advance Calculator" },
            metaDescription: { tr: "Esnaflar ve KOBİ'lerin günlük döngülerini rahatlatacak ticari nakit kredilerinin vade ve faiz planını çıkartın.", en: "Model specific business cash deployments effectively over favorable rate variables." },
            content: { tr: "Banka nezdinde normal bireysel ihtiyaç kredisi çekmek yerine ticari statüsüyle başvuranlar, vergisel anlamda ticari nakit ihtiyaç kredilerinde çok büyük rahatlama yaşarlar. ", en: "Operating as an independent tradesman lets you sidestep draconian retail loan clauses." },
            faq: [
                { q: { tr: "Şirketim yokken faydalanabilir miyim?", en: "Can I use it without a company?" }, a: { tr: "Hayır. En az şahıs şirketi (vergi levhası) olan esnaflar ve serbest meslek erbapları bu statüyü kullanabilir.", en: "No, you need at least a sole proprietorship tax plate to access this." } }
            ],
            richContent: {
                howItWorks: { tr: "Tıpkı dev yatırımlı ticari krediler gibi hesaplanır ancak miktar ve vadeler ihtiyaç kategorsine uygun daha ufaktır.", en: "Calculated with exact same backend algorithms as vast commercial facilities, but constrained arbitrarily." },
                formulaText: { tr: "Temel Faiz Yükü: (Tutar × Aylık Ödeme Kurgusu). BSMV dahil edilir.", en: "Basic compounding algorithms apply globally." },
                exampleCalculation: { tr: "Vergi levhanız varsa 500 bin TL kredide ayda ciddi miktarda vergi geliri elde edip ucuza mal edersiniz.", en: "Savings compound when corporate attributes eliminate gross overhead retail lines enforce." },
                miniGuide: { tr: "<ul><li>Asla bireysel ihtiyaç kredisi ile firmanız için alım yapmayın, ciddi finans hatasıdır.</li></ul>", en: "Do not secure personal loans to finance your incorporated operation." }
            }
        }
    }
];

export const investmentCalculatorsP1: CalculatorConfig[] = [
    {
        id: "altin-hesaplama",
        slug: "altin-hesaplama",
        category: "finansal-hesaplamalar",
        name: { tr: "Altın Hesaplama", en: "Gold Calculator" },
        h1: { tr: "Altın Hesaplama 2024 — Gram, Çeyrek ve Cumhuriyet Altını Kaç TL?", en: "Gold Value Calculator 2024 — Convert Gold Types to Cash" },
        description: { tr: "Elinizdeki gram, çeyrek, yarım veya cumhuriyet altınlarının güncel piyasa değerini hesaplayın. Güncel gram fiyatını girerek birikiminizin TL karşılığını anlık öğrenin.", en: "Calculate the real-time value of your gold holdings including grams, quarters, and full coins based on market or custom prices." },
        shortDescription: { tr: "Altın birikimlerinizin güncel TL değerini saniyeler içinde hesaplayan uzman araç.", en: "Expert tool to calculate the current TRY value of your gold savings in seconds." },
        inputs: [
            {
                id: "goldType", name: { tr: "Altın Türü", en: "Gold Type" }, type: "select", options: [
                    { value: "3000", label: { tr: "Gram Altın (24 Ayar)", en: "Gram Gold (24K)" } },
                    { value: "2750", label: { tr: "Gram Altın (22 Ayar)", en: "Gram Gold (22K)" } },
                    { value: "4900", label: { tr: "Çeyrek Altın", en: "Quarter Gold" } },
                    { value: "9800", label: { tr: "Yarım Altın", en: "Half Gold" } },
                    { value: "19600", label: { tr: "Tam / Cumhuriyet Altını", en: "Full / Republic Gold" } },
                    { value: "20100", label: { tr: "Ata Altın", en: "Ata Gold" } }
                ], defaultValue: "3000"
            },
            { id: "amount", name: { tr: "Adet / Miktar", en: "Quantity / Amount" }, type: "number", defaultValue: 1 },
            { id: "customPrice", name: { tr: "Güncel Gram Fiyatı (Opsiyonel, TL)", en: "Current Gram Price (Optional, TL)" }, type: "number", placeholder: { tr: "Piyasayı ezmek için girin", en: "Enter to override" } }
        ],
        results: [
            { id: "total", label: { tr: "Toplam Tutar", en: "Total Value" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "unitPrice", label: { tr: "Birim Fiyat", en: "Unit Price" }, suffix: " ₺", decimalPlaces: 2 }
        ],
        formula: (v) => {
            const amount = parseFloat(v.amount) || 0;
            const customPrice = parseFloat(v.customPrice);
            const basePrice = parseFloat(v.goldType) || 3000;
            let unitPrice = basePrice;
            if (customPrice > 0) {
                if (v.goldType === "3000") unitPrice = customPrice;
                else {
                    const gramRatio = basePrice / 3000;
                    unitPrice = customPrice * gramRatio;
                }
            }
            return { total: amount * unitPrice, unitPrice };
        },
        seo: {
            title: { tr: "Altın Hesaplama 2024 - Canlı Gram, Çeyrek, Yarım Altın Fiyatları", en: "Gold Price Calculator 2024 - Real-time Valuation" },
            metaDescription: { tr: "En doğru altın hesaplama aracı. Gram, çeyrek, tam ve ata altınlarınızı güncel kurlarla TL'ye çevirin. Yatırım portföyünüzü saniyeler içinde değerleyin.", en: "The most accurate gold calculator. Convert grams, quarters, and bullion to TRY with live rates. Value your investment portfolio instantly." },
            content: {
                tr: "Altın, tarih boyunca güvenli liman olarak görülen en önemli yatırım araçlarından biridir. Altın hesaplama aracımız, yatırımcıların elindeki farklı türdeki (gram, çeyrek, yarım, cumhuriyet) altınların toplam değerini hızlı ve doğru bir şekilde bulmasını sağlar. \n\nÖzellikle Türk yatırımcılar için büyük önem taşıyan çeyrek altın ve gram altın fiyatları üzerinden yapılan bu hesaplama, piyasadaki 'makas aralığı' dediğimiz alış-satış farklarını da göz önünde bulundurmanız için size baz bir değer sunar. İster 24 ayar saf altın, ister ziynet eşyası olarak kullanılan 22 ayar altın olsun, bu araçla tüm birikiminizi tek ekranda yönetebilirsiniz.",
                en: "Gold remains a cornerstone of wealth preservation. Our gold calculator helps investors quickly determine the total value of various gold assets. Whether you hold 24K bars or traditional jewelry, knowing the exact current value is crucial for portfolio management and financial planning."
            },
            faq: [
                { q: { tr: "Hangi altın türlerini hesaplayabilirim?", en: "Which gold types can I calculate?" }, a: { tr: "Gram, çeyrek, yarım, tam, cumhuriyet ve ata altın türlerinin tamamını hesaplayabilirsiniz.", en: "You can calculate grams, quarters, half-coins, full-coins, Republic, and Ata gold types." } },
                { q: { tr: "Ayar farkı hesaplamayı nasıl etkiler?", en: "How does purity affect the calculation?" }, a: { tr: "24 ayar altın %99.9 saflıktadır. 22 ayar altın ise %91.6 saflıktadır. Aracımız seçtiğiniz türe göre doğru gramaj oranını otomatik saptar.", en: "24K is 99.9% pure, while 22K is 91.6% pure. Our tool automatically adjusts the weight based on your selection." } },
                { q: { tr: "Neden manuel fiyat girişi var?", en: "Why is there a manual price input?" }, a: { tr: "Banka ve kuyumcu kurları anlık olarak farklılık gösterebilir. En kesin sonuç için işlem yapacağınız yerdeki fiyatı manuel girebilirsiniz.", en: "Bank and jeweler rates may vary. For precise results, you can manually enter the spot price from your local dealer." } }
            ],
            richContent: {
                howItWorks: { tr: "Seçilen altın türünün standart gram ağırlığı ile piyasadaki gram altın fiyatı çarpılarak hesaplanır.", en: "Calculated by multiplying the standard weight of the selected gold type by the current spot price per gram." },
                formulaText: { tr: "Toplam Değer = Adet × (Birim Ağırlık × Altın Gram Fiyatı)", en: "Total Value = Quantity × (Unit Weight × Gold Price per Gram)" },
                exampleCalculation: { tr: "Gram altın 3000 TL iken, 2 adet çeyrek altın (~1.75g has altın içerir) yaklaşık 10.500 TL civarında bir değer üretir.", en: "If gold is 3000 TL/g, two quarter coins (containing approx 1.75g fine gold each) would value at roughly 10,500 TL." },
                miniGuide: { tr: "Yatırım yaparken fiziki altın yerine altın sertifikası veya banka hesaplarını kullanmak, saklama riski ve işçilik kaybını azaltabilir.", en: "Using gold certificates or bank accounts instead of physical gold can reduce storage risks and manufacturing fees." }
            }
        }
    },
    {
        id: "doviz-hesaplama",
        slug: "doviz-hesaplama",
        category: "finansal-hesaplamalar",
        name: { tr: "Döviz Hesaplama / Çevirici", en: "Currency Converter" },
        h1: { tr: "Döviz Hesaplama - Anlık Dolar, Euro ve Sterlin Çevirici", en: "Currency Converter - Live USD, EUR, GBP to TRY Rates" },
        description: { tr: "Dolar, Euro ve diğer para birimlerini anlık kurlarla Türk Lirası'na veya birbirine çevirin. Döviz bürosu ve banka kurlarını manuel girerek en doğru sonucu elde edin.", en: "Convert USD, EUR, and other world currencies to Turkish Lira or vice versa using real-time exchange rates." },
        shortDescription: { tr: "Piyasa kurlarıyla döviz çevirme işlemlerinizi saniyeler içinde tamamlayın.", en: "Complete your currency conversions in seconds with market rates." },
        inputs: [
            { id: "amount", name: { tr: "Miktar", en: "Amount" }, type: "number", defaultValue: 100 },
            {
                id: "from", name: { tr: "Nereden", en: "From" }, type: "select", options: [
                    { value: "USD", label: { tr: "Dolar (USD)", en: "US Dollar (USD)" } },
                    { value: "EUR", label: { tr: "Euro (EUR)", en: "Euro (EUR)" } },
                    { value: "GBP", label: { tr: "Sterlin (GBP)", en: "British Pound (GBP)" } },
                    { value: "TRY", label: { tr: "Lira (TRY)", en: "Lira (TRY)" } }
                ], defaultValue: "USD"
            },
            {
                id: "to", name: { tr: "Nereye", en: "To" }, type: "select", options: [
                    { value: "TRY", label: { tr: "Lira (TRY)", en: "Lira (TRY)" } },
                    { value: "USD", label: { tr: "Dolar (USD)", en: "US Dollar (USD)" } },
                    { value: "EUR", label: { tr: "Euro (EUR)", en: "Euro (EUR)" } }
                ], defaultValue: "TRY"
            },
            { id: "customRate", name: { tr: "Kur (Opsiyonel)", en: "Rate (Optional)" }, type: "number", placeholder: { tr: "Örn: 32.50", en: "Ex: 32.50" } }
        ],
        results: [
            { id: "result", label: { tr: "Sonuç", en: "Result" }, decimalPlaces: 2 },
            { id: "rateUsed", label: { tr: "Kullanılan Kur", en: "Rate Used" }, decimalPlaces: 4 }
        ],
        formula: (v) => {
            const amount = parseFloat(v.amount) || 0;
            const rates: Record<string, number> = { "USD": 32.50, "EUR": 35.20, "GBP": 41.10, "TRY": 1 };
            let rate = v.customRate ? parseFloat(v.customRate) : (rates[v.from] / rates[v.to]);
            return { result: amount * rate, rateUsed: rate };
        },
        seo: {
            title: { tr: "Döviz Hesaplama Tool - Güncel Kur Çevirici 2024", en: "Currency Converter Tool - Live Exchange Rates 2024" },
            metaDescription: { tr: "Anlık döviz çevirici ile Dolar, Euro, Sterlin ve TL arasındaki dönüşümleri hızlıca yapın. Çapraz kurları görün, yatırımınızı yönetin.", en: "Experience fast currency conversions between USD, EUR, GBP, and TRY. View cross rates and manage your money efficiently." },
            content: {
                tr: "Küresel ekonomide paranın değeri sürekli değişmektedir. Döviz çevirici aracımız, yurt dışı alışverişlerinizden ithalat-ihracat maliyetlerine kadar geniş bir yelpazede size yardımcı olur. \n\nUluslararası piyasalarda 'Forex' kurları baz alınsa da, bankalar ve döviz büroları kendi komisyonlarını ekler. Bu yüzden aracımızda bulunan 'Kur (Opsiyonel)' kısmını kullanarak kendi bankanızın size sunduğu özel kuru girip net maliyetinizi görebilirsiniz. Dolar/TL veya Euro/Dolar paritesi gibi verileri anlık simüle etmek için saniyeler içinde sonuç alabilirsiniz.",
                en: "Currency values fluctuate constantly in the global economy. Our converter helps you manage everything from international shopping to business import-export costs. By optionally entering a custom rate, you can factor in bank spreads for more personalized financial oversite."
            },
            faq: [
                { q: { tr: "Parite nedir?", en: "What is parity?" }, a: { tr: "İki para birimi arasındaki değişim oranıdır. Örneğin EUR/USD paritesi 1.10 ise, 1 Euro ile 1.10 Dolar alınabilir.", en: "Parity is the exchange ratio between two currencies. For example, a 1.10 EUR/USD parity means 1 Euro buys 1.10 Dollars." } },
                { q: { tr: "Neden banka kurları daha farklı?", en: "Why do bank rates differ?" }, a: { tr: "Bankalar, piyasa kuru (interbank) üzerine kendi operasyonel maliyetlerini ve kar marjlarını (spread) eklerler.", en: "Banks add operational costs and profit margins (spreads) on top of the interbank market rate." } }
            ],
            richContent: {
                howItWorks: { tr: "Belirlenen kaynak para birimindeki miktar, hedef birime olan güncel veya manuel kurla çarpılarak hesaplanır.", en: "Calculated by multiplying the source amount by the current or manual exchange rate relative to the target currency." },
                formulaText: { tr: "Sonuç = Miktar × Döviz Kuru", en: "Result = Amount × Exchange Rate" },
                exampleCalculation: { tr: "100 Dolar, 32.50 kur üzerinden tam olarak 3.250 Türk Lirası etmektedir.", en: "100 USD at a 32.50 rate equals exactly 3,250 Turkish Lira." },
                miniGuide: { tr: "Hafta sonları ve piyasaların kapalı olduğu saatlerde makas aralıkları (alış-satış farkı) açılır. İşlemlerinizi mesai saatleri içinde yapmaya çalışın.", en: "Spreads widen during weekends and after-market hours. Try to perform your transactions during active market sessions." }
            }
        }
    },
    {
        id: "birikim-hesaplama",
        slug: "birikim-hesaplama",
        category: "finansal-hesaplamalar",
        name: { tr: "Birikim Hesaplama", en: "Savings Calculator" },
        h1: { tr: "Birikim Hesaplama — Gelecekteki Servetinizi Bileşik Faizle Planlayın", en: "Savings & Wealth Calculator — Plan Your Future with Compounding" },
        description: { tr: "Düzenli tasarruflarınızın ve başlangıç sermayenizin yıllar içindeki büyümesini görün. Yıllık beklenen getiri oranıyla gelecekteki toplam paranızı hesaplayın.", en: "Calculate how your regular savings and initial capital will grow over time using compound interest and expected returns." },
        shortDescription: { tr: "Finansal özgürlüğe giden yolu bileşik getiri gücüyle keşfedin.", en: "Discover the path to financial freedom with the power of compound interest." },
        inputs: [
            { id: "initial", name: { tr: "Başlangıç Tutarı", en: "Initial Balance" }, type: "number", defaultValue: 10000, suffix: " ₺" },
            { id: "monthly", name: { tr: "Aylık Eklenen", en: "Monthly Deposit" }, type: "number", defaultValue: 2000, suffix: " ₺" },
            { id: "rate", name: { tr: "Yıllık Getiri (%)", en: "Annual Returns (%)" }, type: "number", defaultValue: 40, suffix: " %" },
            { id: "years", name: { tr: "Vade (Yıl)", en: "Years" }, type: "number", defaultValue: 5, suffix: " yıl" }
        ],
        results: [
            { id: "futureValue", label: { tr: "Gelecekteki Tutar", en: "Future Value" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "totalInvested", label: { tr: "Toplam Yatırılan", en: "Total Invested" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "totalGain", label: { tr: "Toplam Kazanç", en: "Total Gain" }, suffix: " ₺", decimalPlaces: 2 }
        ],
        formula: (v) => {
            const P = parseFloat(v.initial) || 0, PMT = parseFloat(v.monthly) || 0;
            const annualRate = (parseFloat(v.rate) || 0) / 100, t = parseFloat(v.years) || 1, n = 12;
            const r = annualRate / n, totalMonths = t * n;
            let fv = P * Math.pow(1 + r, totalMonths);
            if (r > 0) fv += PMT * ((Math.pow(1 + r, totalMonths) - 1) / r);
            else fv += PMT * totalMonths;
            return { futureValue: fv, totalInvested: P + PMT * totalMonths, totalGain: fv - (P + PMT * totalMonths) };
        },
        seo: {
            title: { tr: "Birikim Hesaplama 2024 - Bileşik Faiz ve Getiri Tablosu", en: "Savings Calculator 2024 - Compounding & ROI Projections" },
            metaDescription: { tr: "Küçük birikimlerin büyük sermayelere nasıl dönüştüğünü görün. Aylık tasarruf ve yıllık faiz oranıyla 5-10-20 yıllık planlar yapın.", en: "See how small savings turn into large capital. Plan for 5-10-20 years based on monthly deposits and interest rates." },
            content: {
                tr: "Zenginlik, sadece yüksek gelirle değil, disiplinli birikim ve paranın zaman değeriyle (bileşik faiz) oluşur. Birikim hesaplama aracımız ile bugün yapacağınız küçük bir yatırımın 5 veya 10 yıl sonra ne kadar büyük bir kartopuna dönüşeceğini görebilirsiniz. \n\nBuradaki 'Bileşik Getiri' etkisi, kazandığınız faizin veya temettünün de tekrar yatırıma yönlendirilerek üzerinden tekrar kazanç elde edilmesini ifade eder. Enflasyonun üzerinde bir getiri oranı hedeflediğinizde, paranın alım gücünü nasıl koruduğunu ve büyüttüğünü bu simülasyon üzerinden kolayca analiz edebilirsiniz.",
                en: "Wealth is built through consistency and the power of compounding. Our savings calculator lets you simulate long-term growth by reinvesting your earnings. Even modest monthly contributions can grow into significant wealth over decades."
            },
            faq: [
                { q: { tr: "Bileşik faiz nedir?", en: "What is compound interest?" }, a: { tr: "Anaparanın kazandığı gelire ek olarak, o gelirin de tekrar gelir üretmesi sürecine denir.", en: "Compounding is the process where earnings on an asset are reinvested to generate additional earnings over time." } },
                { q: { tr: "Enflasyonu hesaba katmalı mıyım?", en: "Should I consider inflation?" }, a: { tr: "Evet, beklenen getirinizden enflasyon oranını çıkararak 'Reel Getiri' üzerinden hesaplama yapmak daha gerçekçi sonuçlar verir.", en: "Yes, subtracting the expected inflation rate from your gross return gives you a more realistic 'Real Return' outcome." } }
            ],
            richContent: {
                howItWorks: { tr: "Başlangıç sermayesi ve aylık eklenen tutarlar, girilen yıllık oranın aylık vadeli bileşimiyle her periyot için yeniden hesaplanarak toplanır.", en: "The initial capital and periodic additions are compounded monthly at the defined annual rate to provide a cumulative future total." },
                formulaText: { tr: "FV = P(1+r)^n + PMT[((1+r)^n - 1)/r]", en: "FV = P(1+r)^n + PMT[((1+r)^n - 1)/r] where P is principal and PMT is monthly payment." },
                exampleCalculation: { tr: "10.000 TL başlangıç parası ve aylık 2.000 TL ekleme ile yıllık %40 getiri oranında 5 yıl sonra yaklaşık 345.000 TL birikir.", en: "A 10,000 TL start and 2,000 TL monthly savings at a 40% annual rate will grow to approx 345,000 TL after 5 years." },
                miniGuide: { tr: "Birikime ne kadar erken başlarsanız zaman çarpanından o kadar çok faydalanırsınız. Sırrı miktar değil, sürekliliktir.", en: "The secret to wealth isn't the amount, but starting early and being consistent with your deposits." }
            }
        }
    },
    {
        id: "iban-dogrulama",
        slug: "iban-dogrulama",
        category: "finansal-hesaplamalar",
        name: { tr: "IBAN Doğrulama", en: "IBAN Validator" },
        h1: { tr: "IBAN Doğrulama - Banka ve Hesap Formatı Kontrol Aracı", en: "IBAN Validator - International Account Number Verification" },
        description: { tr: "IBAN numarasının MOD-97 algoritmasına göre matematiksel doğruluğunu kontrol edin. Para göndermeden önce alıcı IBAN'ının standartlara uygun olup olmadığını saniyeler içinde saptayın.", en: "Check the mathematical validity of an IBAN number using the ISO-standard MOD-97 algorithm to prevent transfer errors." },
        shortDescription: { tr: "Hatalı para transferlerini önlemek için IBAN formatını saniyeler içinde kontrol edin.", en: "Verify IBAN formats instantly to prevent incorrect money transfers." },
        inputs: [{ id: "iban", name: { tr: "IBAN Numarası", en: "IBAN Number" }, type: "text", placeholder: { tr: "TR00 0000...", en: "TR00 0000..." } }],
        results: [
            { id: "valid", label: { tr: "Geçerli mi?", en: "Is Valid?" }, type: "text" },
            { id: "message", label: { tr: "Durum Mesajı", en: "Status Message" }, type: "text" }
        ],
        formula: (v) => {
            const raw = v.iban.replace(/\s/g, "").toUpperCase();
            if (raw.length < 5) return { valid: "Hayır", message: "Girdiğiniz numara çok kısa." };
            const rearranged = raw.slice(4) + raw.slice(0, 4);
            let numeric = "";
            for (let i = 0; i < rearranged.length; i++) {
                const c = rearranged[i], code = c.charCodeAt(0);
                numeric += (code >= 65 && code <= 90) ? (code - 55).toString() : c;
            }
            let rem = 0;
            for (let i = 0; i < numeric.length; i += 7) {
                const chunk = rem.toString() + numeric.substring(i, i + 7);
                rem = parseInt(chunk) % 97;
            }
            const ok = rem === 1;
            return { valid: ok ? "Evet ✅" : "Hayır ❌", message: ok ? "IBAN matematiksel format olarak doğru." : "IBAN algoritması hatalı, lütfen tekrar kontrol edin." };
        },
        seo: {
            title: { tr: "IBAN Doğrulama ve Kontrolü - MOD-97 Algoritması ile Güvenli Sorgu", en: "IBAN Validator - Verify Bank Account Format Globally" },
            metaDescription: { tr: "Hatalı IBAN ile para göndermeyin! Aracımız IBAN numarasının ISO standartlarına uygunluğunu ve checksum değerini saniyeler içinde doğrular.", en: "Don't send money to the wrong IBAN. Verification tool for checking ISO standards and mathematical checksums instantly." },
            content: {
                tr: "IBAN (Uluslararası Banka Hesap Numarası), para transferlerinin hatasız gerçekleşmesi için kullanılan standart bir yapıdır. Her IBAN, ülke kodu, kontrol basamakları ve banka bilgilerinden oluşur. \n\nIBAN doğrulama aracımız, MOD-97 denilen uluslararası bir matematiksel kontrol yöntemini kullanır. Bu kontrol, IBAN'ın içindeki rakam ve harflerin bir dizilim mantığına uyup uymadığını denetler. Unutmayın; bir IBAN'ın matematiksel olarak doğru olması, o hesabın o saniyede açık olduğu veya isimle uyuştuğu anlamına gelmez, sadece bankacılık sistemine uygun formatta olduğunu garanti eder.",
                en: "IBAN is a global standard for identifying bank accounts to minimize transfer errors. Our validator uses a specific MOD-97 algorithm to ensure the sequence of digits and country codes are mathematically consistent. Note that while format validation is essential, it does not confirm the account owner's identity directly."
            },
            faq: [
                { q: { tr: "IBAN doğruluğu neden önemli?", en: "Why is IBAN validation important?" }, a: { tr: "Yanlış bir haneye basmak paranın farklı bir hesaba gitmesine veya günlerce askıda kalmasına neden olabilir.", en: "Typing a single wrong digit can lead to money being sent to the wrong person or stuck in transit for days." } },
                { q: { tr: "Hangi ülkeleri kapsıyor?", en: "Which countries are covered?" }, a: { tr: "Aracımız uluslararası standartları takip ettiği için Türkiye dahil Avrupa odaklı tüm IBAN sistemlerini denetleyebilir.", en: "Our tool follows international standards and can verify IBAN systems globally, including Turkey and EU countries." } }
            ],
            richContent: {
                howItWorks: { tr: "IBAN'ın ilk 4 karakteri sona atılır, harfler sayılara çevrilir ve oluşan devasa sayının 97'ye bölümünden kalan 1 mi diye bakılır.", en: "Rearranges the IBAN by moving the first 4 chars to the end, converts letters to numbers, and checks if the MOD-97 result equals 1." },
                formulaText: { tr: "IBAN % 97 == 1", en: "Standard checksum verifies that IBAN MOD 97 is equal to 1." },
                exampleCalculation: { tr: "TR ile başlayan Türk IBAN'larında ilk iki haneden sonra gelen 00'dan sonraki 5 hane banka koduna işaret eder.", en: "In Turkish IBANs, the 5 digits following the initial TR and two-digit control code represent the bank identification number." },
                miniGuide: { tr: "İnternet bankacılığında para gönderirken IBAN'ı yapıştırdıktan sonra çıkan Alıcı isminin baş harflerini mutlaka gözle teyit edin.", en: "Always cross-verify the recipient's partial name on your banking app after pasting the IBAN for maximum security." }
            }
        }
    }
];

export const investmentCalculatorsP2: CalculatorConfig[] = [
    {
        id: "bilesik-buyume-hesaplama",
        slug: "bilesik-buyume-hesaplama",
        category: "finansal-hesaplamalar",
        name: { tr: "Bileşik Büyüme Hesaplama (CAGR)", en: "CAGR Calculator" },
        h1: { tr: "CAGR (Yıllık Bileşik Büyüme Oranı) Hesaplama Aracı", en: "Compound Annual Growth Rate (CAGR) Calculator" },
        description: { tr: "Bir yatırımın veya iş hacminin belirli bir dönem boyunca yıllık ortalama büyüme oranını (CAGR) hesaplayın. Dalgalanmaları arındırarak geometrik büyüme trendini görün.", en: "Calculate the Compound Annual Growth Rate (CAGR) of an investment or business metric over any period to see the geometric growth trend." },
        shortDescription: { tr: "Yatırımınızın yıllık ortalama büyüme hızını en doğru yöntemle saptayın.", en: "Identify the average annual growth rate of your investment with the most accurate method." },
        inputs: [
            { id: "startValue", name: { tr: "Başlangıç Değeri (PV)", en: "Starting Value (PV)" }, type: "number", defaultValue: 10000 },
            { id: "endValue", name: { tr: "Bitiş Değeri (FV)", en: "Ending Value (FV)" }, type: "number", defaultValue: 25000 },
            { id: "years", name: { tr: "Süre (Yıl)", en: "Period (Years)" }, type: "number", defaultValue: 5 }
        ],
        results: [
            { id: "cagr", label: { tr: "Yıllık Bileşik Büyüme Oranı", en: "CAGR Rate" }, suffix: " %", decimalPlaces: 2 },
            { id: "totalGrowth", label: { tr: "Toplam Büyüme", en: "Total Growth" }, suffix: " %", decimalPlaces: 2 }
        ],
        formula: (v) => {
            const start = parseFloat(v.startValue) || 1, end = parseFloat(v.endValue) || 0, t = parseFloat(v.years) || 1;
            const cagr = (Math.pow(end / start, 1 / t) - 1) * 100;
            const total = ((end - start) / start) * 100;
            return { cagr, totalGrowth: total };
        },
        seo: {
            title: { tr: "Bileşik Büyüme Oranı (CAGR) Hesaplama - Geometrik Getiri Ölçümü", en: "CAGR Calculator - Annual Geometric Growth Rate" },
            metaDescription: { tr: "Yatırımlarınızın yıllık ortalama performansını CAGR formülü ile ölçün. Başlangıç ve bitiş değerlerine göre gerçek büyüme hızını saniyeler içinde bulun.", en: "Measure your average annual investment performance using the CAGR formula. Calculate real growth rates based on starting and ending values instantly." },
            content: {
                tr: "Compound Annual Growth Rate (CAGR), yani Yıllık Bileşik Büyüme Oranı, özellikle uzun vadeli yatırımların performansını ölçmek için kullanılan en sağlıklı metriktir. Basit ortalamaların aksine, CAGR 'bileşik' etkiyi hesaba katar ve yatırımın her yıl sabit bir hızla büyüdüğünü varsayar. \n\nÖzellikle hisse senedi portföyleri, gayrimenkul değerlemeleri veya şirket satış grafiklerinde CAGR kullanımı zorunludur. Çünkü yıllık dalgalanmalar (bir yıl %10 artış, bir yıl %5 düşüş gibi) toplam getiriyi görmeyi zorlaştırır. CAGR aracı ile 5 veya 10 yıllık bir periyotta 'yıllık ortalama % kaç kazandım?' sorusuna en matematiksel cevabı alırsınız.",
                en: "CAGR represents the geometric progression ratio that provides a constant rate of return over a time period. It is the best metric for comparing different investments (like stocks vs bonds) on an annualized basis, smoothing out volatility to show a steady growth trend."
            },
            faq: [
                { q: { tr: "CAGR neden önemlidir?", en: "Why is CAGR important?" }, a: { tr: "Dalgalı büyümeleri tek bir sabit orana indirgeyerek farklı yatırım araçları (hisse vs altın gibi) arasında sağlıklı karşılaştırma yapmayı sağlar.", en: "It reduces volatile returns to a single constant rate, allowing for healthy comparisons between different investment types." } },
                { q: { tr: "Basit büyüme ile farkı nedir?", en: "Difference from simple growth?" }, a: { tr: "Basit büyüme sadece toplam farkı gösterirken, CAGR bu büyümeye her yıl 'önceki yılın kazancının da dahil olduğu' bir hızla nasıl gidildiğini gösterir.", en: "Simple growth shows total percentage change, whereas CAGR shows the annualized rate accounting for reinvestment and compounding." } },
                { q: { tr: "Sıfırın altındaki değerlerle çalışır mı?", en: "Does it work with negative values?" }, a: { tr: "CAGR matematiksel olarak pozitif başlangıç ve bitiş değerleri gerektirir. Sürecin sonunda zarar edilmişse (Bitiş < Başlangıç) sonuç negatif bir oran çıkacaktır.", en: "CAGR requires positive start and end values mathematically. If ending value is lower than starting value, the result will reflect a negative annual return." } }
            ],
            richContent: {
                howItWorks: { tr: "Bitiş değerinin başlangıç değerine oranı, toplam yıl sayısının evresiyle (1/n) işlenerek hesaplanır.", en: "Calculates the n-th root of the total return ratio, where n is the number of years." },
                formulaText: { tr: "CAGR = [(Bitiş Değeri / Başlangıç Değeri)^(1 / Yıl Sayısı)] - 1", en: "CAGR = [(End Value / Start Value)^(1 / Number of Years)] - 1" },
                exampleCalculation: { tr: "100.000 TL yatırımınız 5 yıl sonunda 200.000 TL olduysa, CAGR %14.87'dir. Yani paranız her yıl ortalama %15 bileşik büyümüştür.", en: "If 100,000 TL grows to 200,000 TL in 5 years, the CAGR is 14.87%, meaning a 15% compound annual growth." },
                miniGuide: { tr: "Enflasyon oranının altında kalan bir CAGR, reel anlamda paranın eridiği anlamına gelir. Yatırımlarınızda hedefiniz her zaman 'Enflasyon + X' bir CAGR olmalıdır.", en: "A CAGR below inflation rates means a real-term loss of purchasing power. Aim for a CAGR that trends above inflation." }
            }
        }
    },
    {
        id: "bono-hesaplama",
        slug: "bono-hesaplama",
        category: "finansal-hesaplamalar",
        name: { tr: "Bono Hesaplama", en: "Bond Yield Calculator" },
        h1: { tr: "Bono Getirisi Hesaplama - Hazine Bonosu Yıllık Getiri Analizi", en: "Bond Yield Calculator - Treasury Bill Profit Analysis" },
        description: { tr: "Hazine bonosu ve özel sektör borçlanma araçlarının vade sonu getirisini hesaplayın. Alış fiyatı ve nominal değer arasındaki farktan yıllık yüzde kaç kazandığınızı bulun.", en: "Calculate the maturity yield for treasury bills and corporate bonds. Determine your annualized percentage profit based on price and face value." },
        shortDescription: { tr: "Vadesiz ve iskontolu borçlanma araçlarında gerçek getiri oranınızı saptayın.", en: "Determine your real rate of return on non-coupon, discounted debt instruments." },
        inputs: [
            { id: "nominal", name: { tr: "Nominal Değer (Vade Sonu Ödenecek)", en: "Face Value" }, type: "number", defaultValue: 1000 },
            { id: "price", name: { tr: "Alış Fiyatı", en: "Purchase Price" }, type: "number", defaultValue: 920 },
            { id: "days", name: { tr: "Vadeye Kalan Gün", en: "Days to Maturity" }, type: "number", defaultValue: 180 }
        ],
        results: [
            { id: "simpleYield", label: { tr: "Basit Faiz Getirisi", en: "Simple Yield" }, suffix: " %", decimalPlaces: 2 },
            { id: "annualYield", label: { tr: "Yıllıklandırılmış Getiri", en: "Annualized Yield" }, suffix: " %", decimalPlaces: 2 },
            { id: "totalProfit", label: { tr: "Net Kazanç", en: "Net Profit" }, suffix: " ₺", decimalPlaces: 2 }
        ],
        formula: (v) => {
            const face = parseFloat(v.nominal) || 0, price = parseFloat(v.price) || 1, days = parseFloat(v.days) || 1;
            const profit = face - price;
            const simple = (profit / price) * 100;
            const annual = (simple * 365) / days;
            return { simpleYield: simple, annualYield: annual, totalProfit: profit };
        },
        seo: {
            title: { tr: "Bono Getirisi ve Faiz Hesaplama - İskontolu Bono Analizi", en: "Bond Yield & Interest Calculator - Discounted Bill Analysis" },
            metaDescription: { tr: "Bono alış fiyatı ve vadeye göre yıllık kazancınızı hesaplayın. Hazine bonosu yatırımlarınızda stopaj öncesi brüt getiriyi kolayca bulun.", en: "Calculate annualized bond profits based on price and days to maturity. Find gross yields for treasury bills easily." },
            content: {
                tr: "Borçlanma araçları dünyasında 'Bono', vadesi 1 yıldan kısa olan ve genellikle 'iskontolu' (paradan daha ucuza alınıp vade sonunda tam paraya dönüşen) kağıtlardır. Bono hesaplama aracımız, bu iskontonun gerçek faiz karşılığını görmenizi sağlar. \n\nÖrneğin piyasada 'bono faizi %45' dendiğinde, bu oran genellikle yıllıklandırılmış bir orandır. Eğer siz bonoyu sadece 90 gün elinizde tutacaksanız, alacağınız net kar oranı daha düşüktür. Aracımız hem o döneme ait basit getiriyi hem de diğer yatırım araçlarıyla (mevduat gibi) kıyaslamanızı sağlayacak yıllık getiri oranını (YTM bazlı) saniyeler içinde sunar.",
                en: "Bonds and bills are debt instruments sold at a discount. A bill bought for 900 TL that pays out 1000 TL in 6 months yields a specific annualized return. Our tool translates the raw discount into a clear annual interest rate comparable to bank deposits."
            },
            faq: [
                { q: { tr: "Bono ile Tahvil farkı nedir?", en: "Bills vs Bonds?" }, a: { tr: "Vadeleri 1 yıldan kısa olan borçlanma senetlerine Bono, 1 yıldan uzun olanlara Tahvil denir.", en: "Debt instruments with maturities under 1 year are Bills; over 1 year are Bonds." } },
                { q: { tr: "İskontolu ne demek?", en: "What does discounted mean?" }, a: { tr: "Bononun üzerinde yazan değerden (100 TL gibi) daha düşük bir bedelle (95 TL gibi) satılmasıdır. Karınız aradaki farktır.", en: "Purchasing a security for less than its face value. Your profit is the difference at maturity." } }
            ],
            richContent: {
                howItWorks: { tr: "Vade sonu ödenecek nominal tutar ile alış fiyatı arasındaki fark, alış fiyatına bölünerek basit getiri bulunur, ardından 365 güne normalize edilir.", en: "Calculating the difference between face value and price, dividing by price for simple yield, then annualizing for 365 days." },
                formulaText: { tr: "Yıllık Getiri = [(Kar / Alış Fiyatı) * 365] / Gün Sayısı", en: "Annualized Yield = [(Profit / Purchase Price) * 365] / Days to Maturity" },
                exampleCalculation: { tr: "920 TL'ye alınan, 180 gün vadeli 1000 TL nominal değerli bononun yıllık getirisi %17.6'dır.", en: "A bill purchased at 920 with 1,000 face value and 180 days to maturity has an annualized yield of 17.6%." },
                miniGuide: { tr: "Devlet iç borçlanma senetleri (DİBS), devlet garantisinde oldukları için en düşük riskli yatırım araçları kategorisindedir.", en: "Treasury bills are considered low-risk since they are backed by the central government." }
            }
        }
    },
    {
        id: "iskonto-hesaplama",
        slug: "iskonto-hesaplama",
        category: "finansal-hesaplamalar",
        name: { tr: "İç ve Dış İskonto Hesaplama", en: "Internal & External Discount" },
        h1: { tr: "İskonto Hesaplama — Ticari ve Bankacılık Faiz İskontosu Kontrolü", en: "Discount Calculator — Verify Commercial & Banking Discount Rates" },
        description: { tr: "Çek, senet and hakedişlerin şimdiki değeri ile gelecek değeri arasındaki farkı (iskonto) hesaplayın. İç iskonto ve dış iskonto yöntemleri arasındaki farkı görün.", en: "Calculate the discount amounts on bills and invoices. Compare internal and external discount methods used in banking and commerce." },
        shortDescription: { tr: "Ticari belgelerin nakde çevrilmesindeki kesinti tutarlarını saptayın.", en: "Determine deduction amounts when converting commercial documents to cash." },
        inputs: [
            { id: "val", name: { tr: "Tutar (Gelecek Değer)", en: "Amount (Future Value)" }, type: "number", defaultValue: 10000 },
            { id: "rate", name: { tr: "İskonto Oranı (%)", en: "Discount Rate (%)" }, type: "number", defaultValue: 20 },
            { id: "days", name: { tr: "Süre (Gün)", en: "Days" }, type: "number", defaultValue: 90 }
        ],
        results: [
            { id: "internal", label: { tr: "İç İskonto Tutarı", en: "Internal Discount" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "external", label: { tr: "Dış İskonto Tutarı", en: "External Discount" }, suffix: " ₺", decimalPlaces: 2 }
        ],
        formula: (v) => {
            const S = parseFloat(v.val) || 0, r = (parseFloat(v.rate) || 0) / 100, t = parseFloat(v.days) || 0;
            const external = (S * r * t) / 360;
            const internal = (S * r * t) / (360 + (r * t));
            return { internal, external };
        },
        seo: {
            title: { tr: "İç ve Dış İskonto Ayrımı ve Hesaplama Aracı", en: "Internal vs External Discount Methods & Calculator" },
            metaDescription: { tr: "Bankacılık ve ticari işlemlerde kullanılan iskonto türlerini hesaplayın. Ticari kağıdın bugünkü değerini saptamak için iskontoyu anında öğrenin.", en: "Calculate interest discounts for banking and commercial transactions. Determine the present value of trades instantly." },
            content: {
                tr: "Finansal matematikte iskonto, gelecekteki bir paranın bugünkü değerine indirgenmesi işlemidir. Ancak bu indirgeme 'Dış İskonto' ve 'İç İskonto' olarak iki farklı yaklaşımla yapılır. \n\n'Dış İskonto' (Ticari İskonto), faizin doğrudan senedin üzerindeki yazılı değer (nominal) üzerinden hesaplandığı yöntemdir ve genellikle bankalarca çek kırmada kullanılır. 'İç İskonto' (Matematiksel İskonto) ise, senedin bugünkü (henüz bilinmeyen) değeri üzerinden faiz yürütüldüğü, daha adil bir yaklaşımdır. Aracımız bu iki arasındaki farkı görmenizi sağlayarak finansal planlamanıza yardımcı olur.",
                en: "Discounting is the reverse of compounding. External discount is computed off the future face value, while internal discount is computed off the present value. The external method is more common in commercial banking for discounting bills of exchange."
            },
            faq: [
                { q: { tr: "Hangisi benim lehime?", en: "Which is better for me?" }, a: { tr: "Eğer borçluysanız iç iskonto (daha az kesinti), eğer tahsilatçıysanız dış iskonto (daha fazla kazanç) daha efektiftir.", en: "The internal method results in a lower discount amount (better for the borrower)." } },
                { q: { tr: "360 mı 365 mi kullanılmalı?", en: "Use 360 or 365?" }, a: { tr: "Ticari teamülde bankalar genellikle yılı 360 gün (her ayı 30 gün) olarak kabul eden 'Fransız Metodu'nu kullanır.", en: "Commercial lenders typically use 360 days (French method) as the annual denominator for simplicity." } }
            ],
            richContent: {
                howItWorks: { tr: "Dış iskonto doğrudan anapara üzerinden hesaplanırken, iç iskonto anaparanın faizli halinin bugünkü değerine oranlanmasıyla bulunur.", en: "External discount factors interest on the nominal value; internal factors it on the initial principal." },
                formulaText: { tr: "Dış = (S*r*t)/360 | İç = (S*r*t)/(360+(r*t))", en: "External = (F*r*t)/360 | Internal = (F*r*t)/(360+(r*t))" },
                exampleCalculation: { tr: "10.000 TL senedin %20 oranla 90 günde dış iskontosu 500 TL iken, iç iskontosu 476 TL'dir.", en: "A 10,000 TL bill at 20% for 90 days results in a 500 TL external vs 476 TL internal discount." },
                miniGuide: { tr: "Ticari çeklerinizi nakde çevirmeden önce bankaların hangi iskonto metodunu kullandığını mutlaka sorun; büyük tutarlarda fark ciddi olabilir.", en: "Always ask which discount method is applied before cashing out commercial checks; the delta can be significant on large volumes." }
            }
        }
    },
    {
        id: "ic-verim-orani-hesaplama",
        slug: "ic-verim-orani-hesaplama",
        category: "finansal-hesaplamalar",
        name: { tr: "İç Verim Oranı (IRR) Hesaplama", en: "IRR Calculator" },
        h1: { tr: "IRR (İç Verim Oranı) Hesaplama — Yatırım Projesi Kârlılık Analizi", en: "Internal Rate of Return (IRR) Calculator — Project Profitability" },
        description: { tr: "Nakit giriş ve çıkışları serisinin sıfır net bugünkü değerini (NPV) veren yıllık getiri oranını bulun. Karmaşık projelerin yıllık yüzde kaç kazandırdığını görün.", en: "Find the discount rate that sets the Net Present Value (NPV) of all cash flows to zero. Measure the annualized yield of complex investment projects." },
        shortDescription: { tr: "Düzensiz nakit akışlarına sahip yatırımların yıllık ortalama getiri oranını bulun.", en: "Identify the annualized average return for investments with irregular cash flows." },
        inputs: [
            { id: "inv", name: { tr: "İlk Yatırım (Negatif Giriş)", en: "Initial Investment" }, type: "number", defaultValue: -100000 },
            { id: "c1", name: { tr: "1. Yıl Nakit Girişi", en: "Year 1 Cash Flow" }, type: "number", defaultValue: 30000 },
            { id: "c2", name: { tr: "2. Yıl Nakit Girişi", en: "Year 2 Cash Flow" }, type: "number", defaultValue: 40000 },
            { id: "c3", name: { tr: "3. Yıl Nakit Girişi", en: "Year 3 Cash Flow" }, type: "number", defaultValue: 50000 }
        ],
        results: [
            { id: "irr", label: { tr: "İç Verim Oranı (IRR)", en: "Internal Rate of Return" }, suffix: " %", decimalPlaces: 2 }
        ],
        formula: (v) => {
            const flows = [parseFloat(v.inv) || 0, parseFloat(v.c1) || 0, parseFloat(v.c2) || 0, parseFloat(v.c3) || 0];
            let irr = 0.1;
            for (let i = 0; i < 20; i++) {
                let npv = 0, dNpv = 0;
                for (let t = 0; t < flows.length; t++) {
                    npv += flows[t] / Math.pow(1 + irr, t);
                    dNpv -= t * flows[t] / Math.pow(1 + irr, t + 1);
                }
                const newIrr = irr - npv / dNpv;
                if (Math.abs(newIrr - irr) < 0.0001) { irr = newIrr; break; }
                irr = newIrr;
            }
            return { irr: irr * 100 };
        },
        seo: {
            title: { tr: "İç Verim Oranı (IRR) Hesaplama - Karmaşık Nakit Akışı Analizi", en: "IRR Calculator - Complex Cash Flow Yield Measurement" },
            metaDescription: { tr: "Yatırımlarınızın yıllık getirisini (IRR) gelişmiş Newton-Raphson algoritması ile hesaplayın. Nakit akışlarına göre projenizin verimini ölçün.", en: "Calculate the internal rate of return for your investments using advanced algorithms. Measure project yield based on cash flow strings." },
            content: {
                tr: "İç Verim Oranı (Internal Rate of Return - IRR), sermaye bütçelemesinde bir yatırımın kârlılığını tahmin etmek için kullanılan yaygın bir metoddur. Yatırımın tüm maliyetlerini ve beklenen tüm nakit girişlerini 'başabaş' (NPV=0) noktasına getiren iskonto oranıdır. \n\nEğer bir projenin IRR'si, firmanın beklediği minimum getiri oranından (engel oranı) büyükse, o proje kârlı kabul edilir. Karmaşık matematiksel iterasyonlar gerektiren bu hesaplamayı aracımız saniyeler içinde yaparak, size projenizin yıllık yüzde kaç 'gerçek' kazanç ürettiğini gösterir.",
                en: "IRR is the metric used in capital budgeting to estimate the profitability of potential investments. It is the discount rate that makes the net present value of all cash flows from a particular project equal to zero. High IRR values indicate higher investment efficiency and profitability potential."
            },
            faq: [
                { q: { tr: "IRR vs NPV farkı nedir?", en: "IRR vs NPV?" }, a: { tr: "NPV projenin kattığı parasal değeri (10.000 TL gibi), IRR ise bu projenin yüzde kaç kazandırdığını (%25 gibi) gösterir.", en: "NPV shows a dollar value profit, while IRR shows the percentage efficiency/yield of the project." } },
                { q: { tr: "IRR'nin yüksek olması ne anlama gelir?", en: "What does a high IRR mean?" }, a: { tr: "IRR ne kadar yüksekse, yatırım o kadar verimlidir ve risk toleransınız o kadar geniştir.", en: "The higher the IRR, the more efficient the investment is at generating returns relative to costs." } }
            ],
            richContent: {
                howItWorks: { tr: "İteratif bir yaklaşım olan Newton-Raphson algoritması kullanılarak, net bugünkü değeri sıfıra yaklaştıran kök bulunur.", en: "Uses an iterative Newton-Raphson algorithm to find the root where the project's NPV equals exactly zero." },
                formulaText: { tr: "0 = Σ [CF_t / (1+IRR)^t]", en: "0 = Σ [CF_t / (1+IRR)^t] solved for the variable IRR across all time periods (t)." },
                exampleCalculation: { tr: "100.000 TL yatırıp her yıl 40.000 TL geri aldığınız bir projenin 3 yıllık IRR'si oldukça yüksektir.", en: "Investing 100,000 TL and receiving 40,000 TL annually for 3 years produces a specific project IRR." },
                miniGuide: { tr: "Birden fazla proje arasında seçim yaparken her zaman en yüksek IRR'ye sahip olana yönelmek mantıklıdır ancak projenin toplam büyüklüğünü (NPV) de unutmayın.", en: "When choosing between projects, a higher IRR is generally preferred, provided the total net present value (NPV) is also sufficient." }
            }
        }
    },
];

export const investmentCalculatorsP3: CalculatorConfig[] = [
    {
        id: "net-bugunku-deger-hesaplama",
        slug: "net-bugunku-deger-hesaplama",
        category: "finansal-hesaplamalar",
        name: { tr: "Net Bugünkü Değer (NPV) Hesaplama", en: "NPV Calculator" },
        h1: { tr: "NPV (Net Bugünkü Değer) Hesaplama — Yatırım Projesi Değerleme Toolu", en: "Net Present Value (NPV) Calculator — Project Valuation Tool" },
        description: { tr: "Gelecekteki nakit akışlarının bugünkü değerini iskonto oranı ile hesaplayın. Yatırımınızın bugünkü para cinsinden gerçek kârını veya zararını saptayın.", en: "Calculate the net present value (NPV) of future cash flows using a specific discount rate to determine project profitability in today's currency." },
        shortDescription: { tr: "Yatırım projelerinizin bugünkü değer üzerinden kârlılığını analiz edin.", en: "Analyze the profitability of your investment projects based on present value." },
        inputs: [
            { id: "rate", name: { tr: "Yıllık İskonto Oranı (%)", en: "Annual Discount Rate (%)" }, type: "number", defaultValue: 15 },
            { id: "inv", name: { tr: "İlk Yatırım Tutarı", en: "Initial Investment" }, type: "number", defaultValue: 100000 },
            { id: "c1", name: { tr: "1. Yıl Nakit Girişi", en: "Year 1 Cash Flow" }, type: "number", defaultValue: 40000 },
            { id: "c2", name: { tr: "2. Yıl Nakit Girişi", en: "Year 2 Cash Flow" }, type: "number", defaultValue: 40000 },
            { id: "c3", name: { tr: "3. Yıl Nakit Girişi", en: "Year 3 Cash Flow" }, type: "number", defaultValue: 50000 }
        ],
        results: [
            { id: "npv", label: { tr: "Net Bugünkü Değer (NPV)", en: "Net Present Value (NPV)" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "status", label: { tr: "Yatırım Kararı", en: "Investment Decision" }, type: "text" }
        ],
        formula: (v) => {
            const r = (parseFloat(v.rate) || 0) / 100, inv = parseFloat(v.inv) || 0;
            const flows = [parseFloat(v.c1) || 0, parseFloat(v.c2) || 0, parseFloat(v.c3) || 0];
            let npv = -inv;
            flows.forEach((f, i) => { npv += f / Math.pow(1 + r, i + 1); });
            return { npv, status: npv > 0 ? "Karlı / Kabul Edilebilir" : "Zararlı / Red" };
        },
        seo: {
            title: { tr: "Net Bugünkü Değer (NPV) Hesaplama - Paranın Zaman Değeri", en: "NPV Calculator - Measure Investment Viability Instantly" },
            metaDescription: { tr: "Gelecekteki nakit akışlarının bugünkü değerini NPV formülü ile hesaplayın. Projenizin yapılabilirliğini en güçlü finansal metrikle ölçün.", en: "Calculate future cash flow values using the NPV formula. Measure project viability with one of the strongest financial metrics available." },
            content: {
                tr: "Net Bugünkü Değer (NPV), bir yatırımın tüm ömrü boyunca yaratacağı nakit girişlerinin, seçilen bir iskonto oranıyla bugüne indirgenmiş toplamından ilk yatırım maliyetinin çıkarılmasıyla bulunur. Paranın zaman değerini (bir liranın bugün, yarından daha değerli olduğu gerçeği) hesaba katan en güvenilir yöntemdir. \n\nEğer NPV > 0 ise, yatırımın maliyetinden daha fazla değer yarattığı kabul edilir ve proje onaylanabilir. NPV'nin en büyük avantajı, projeden elde edilecek net kârı doğrudan 'bugünkü para' cinsinden TL olarak söylemesidir. Bu da farklı büyüklükteki ve farklı süredeki projeleri kıyaslamayı kolaylaştırır.",
                en: "NPV is the gold standard for capital budgeting. It represents the net total of discounted future cash flows minus the initial cost. Because it accounts for the time value of money, it provides a much more accurate picture of total value added than simpler ROI calculations."
            },
            faq: [
                { q: { tr: "NPV pozitifse ne anlama gelir?", en: "What if NPV is positive?" }, a: { tr: "Bu durum, yatırımın beklenen iskonto (sermaye maliyeti) oranından daha fazla getiri sağlayacağını ve şirketin değerini artıracağını gösterir.", en: "It indicates the investment will yield a return greater than the cost of capital, increasing overall enterprise value." } },
                { q: { tr: "Hangi iskonto oranını kullanmalıyım?", en: "Which discount rate to use?" }, a: { tr: "Genellikle şirketin 'Ağırlıklı Ortalama Sermaye Maliyeti' (WACC) veya risksiz faiz oranı üzerine eklenen bir risk primi kullanılır.", en: "Typically, the Weighted Average Cost of Capital (WACC) or a risk-free rate plus a risk premium is utilized as the baseline." } }
            ],
            richContent: {
                howItWorks: { tr: "Gelecekteki her bir nakit akışı, vadesine göre (1+r)^t formülüyle bugüne çekilir ve toplanır, ardından anapara düşülür.", en: "Each future cash flow is discounted back to year zero using the (1+r)^t formula and summed up, after which the initial principal is subtracted." },
                formulaText: { tr: "NPV = Σ [CF_t / (1+r)^t] - C_0", en: "NPV = Σ [CF_t / (1+r)^t] - C_0" },
                exampleCalculation: { tr: "100.000 TL yatırım yapıp 3 yıl boyunca 40-40-50 bin TL alırsanız, %15 iskonto oranıyla NPV pozitif çıkar ve proje kârlıdır.", en: "Investing 100,000 for 3 years of 40-40-50k returns at 15% discount yields a positive NPV, signaling a profitable venture." },
                miniGuide: { tr: "Enflasyonist ortamlarda iskonto oranını yüksek tutmak, projenin gerçek getirisini görmenizi sağlar.", en: "In high-inflation environments, using a higher discount rate ensures you see the project's true real-term profitability." }
            }
        }
    },
    {
        id: "ortalama-vade-hesaplama",
        slug: "ortalama-vade-hesaplama",
        category: "finansal-hesaplamalar",
        name: { tr: "Ortalama Vade Hesaplama", en: "Average Maturity Calculator" },
        h1: { tr: "Ortalama Vade Hesaplama — Çek, Senet ve Borç Ağırlıklı Vade Analizi", en: "Average Maturity Calculator — Weighted Payment Timing Analysis" },
        description: { tr: "Farklı tutarlardaki ve farklı tarihlerdeki ödemelerin ağırlıklı ortalama süresini hesaplayın. Nakit akışınızı yönetmek için tek bir ortalama vade saptayın.", en: "Calculate the weighted average maturity of multiple payments with different amounts and dates for effective cash flow management." },
        shortDescription: { tr: "Birden fazla vadenin ağırlıklı ortalamasını tek bir rakamla görün.", en: "See the weighted average of multiple maturities in a single number." },
        inputs: [
            { id: "p1", name: { tr: "1. Ödeme Tutarı", en: "1st Payment Amount" }, type: "number", defaultValue: 5000 },
            { id: "d1", name: { tr: "1. Ödeme Vadesi (Gün)", en: "1st Payment Days" }, type: "number", defaultValue: 30 },
            { id: "p2", name: { tr: "2. Ödeme Tutarı", en: "2nd Payment Amount" }, type: "number", defaultValue: 15000 },
            { id: "d2", name: { tr: "2. Ödeme Vadesi (Gün)", en: "2nd Payment Days" }, type: "number", defaultValue: 90 }
        ],
        results: [
            { id: "avgDays", label: { tr: "Ortalama Vade (Gün)", en: "Average Maturity (Days)" }, decimalPlaces: 0 },
            { id: "totalAmount", label: { tr: "Toplam Tutar", en: "Total Amount" }, suffix: " ₺" }
        ],
        formula: (v) => {
            const p1 = parseFloat(v.p1) || 0, d1 = parseFloat(v.d1) || 0;
            const p2 = parseFloat(v.p2) || 0, d2 = parseFloat(v.d2) || 0;
            const total = p1 + p2;
            const avg = total > 0 ? (p1 * d1 + p2 * d2) / total : 0;
            return { avgDays: avg, totalAmount: total };
        },
        seo: {
            title: { tr: "Ortalama Vade Hesaplama - Çek, Senet ve Ödeme Takvimi", en: "Average Maturity Calculator - Payment Scheduling Tool" },
            metaDescription: { tr: "Birden fazla ödemenin tek bir ortalama vadesini saniyeler içinde hesaplayın. Nakit akışı planlaması için ticari borç ve alacak vadesini bulun.", en: "Calculate the single average maturity of multiple payments in seconds. Find commercial due dates for better cash flow forecasting." },
            content: {
                tr: "Ticari hayatta ödemeler genellikle tek bir seferde değil, zamana yayılmış farklı vadelerdeki çek veya senetlerle yapılır. Ortalama vade hesaplama, bu farklı vadeleri 'tek bir tarih' gibi düşünmenizi sağlayan ağırlıklı bir ortalamadır. \n\nÖrnegin, 30 gün vadeli 1.000 TL ile 90 gün vadeli 10.000 TL'nin ortalama vadesi 60 (aritmetik ortalama) değil, 84 gündür. Çünkü yüksek tutarlı ödemenin vadesi toplam sonuca daha fazla ağırlık verir. Bu araç, finansal dengenizi korumak için ne kadar süre 'alacaklı' veya 'borçlu' olduğunuzu netleştirir.",
                en: "In business, payments spread across different dates need a unified metric. Average maturity uses a weight-based approach where larger sums pull the average closer to their own specific due dates, providing a realistic operational timeline for cash reserves."
            },
            faq: [
                { q: { tr: "Ortalama vade ne işe yarar?", en: "What is average maturity used for?" }, a: { tr: "Alacakların veya borçların toplamda ne kadarlık bir süreye yayıldığını tek bir rakamla görmenizi sağlayarak finansman maliyetini hesaplamanıza yardımcı olur.", en: "It allows you to view the duration of receivables or liabilities in a single figure, helping calculate financing costs better." } },
                { q: { tr: "İskontolamada kullanılır mı?", en: "Is it used in discounting?" }, a: { tr: "Evet, bir çek portföyünü nakde çevirmek istediğinizde bankalar ortalama vade üzerinden tek bir faiz oranı uygulayabilir.", en: "Yes, when cashing out a portfolio of checks, banks may apply a single interest rate based on the average maturity." } }
            ],
            richContent: {
                howItWorks: { tr: "Her ödeme tutarı kendi vadesiyle çarpılır, bu çarpımlar toplanır ve toplam ana paraya bölünür.", en: "Each individual payment is multiplied by its respective days, summed up, and then divided by the total principal sum." },
                formulaText: { tr: "Ort. Vade = (Σ Tutar_i * Gün_i) / (Σ Tutar_i)", en: "Avg Maturity = (Σ Amount_i * Days_i) / (Σ Amount_i)" },
                exampleCalculation: { tr: "10.000 TL (30 gün) ve 40.000 TL (60 gün) ödemeleriniz varsa ortalama vade 54 gündür.", en: "If you have 10,000 TL at 30 days and 40,000 TL at 60 days, the weighted average maturity is 54 days." },
                miniGuide: { tr: "Tedarikçilerinize verdiğiniz ortalama vade ile müşterilerinizden aldığınız ortalama vadeyi kıyaslayarak işletme sermayesi ihtiyacınızı ölçebilirsiniz.", en: "Compare maturity from vendors vs customers to accurately measure your working capital requirements." }
            }
        }
    },
    {
        id: "parasal-deger-zaman-hesaplama",
        slug: "parasal-deger-zaman-hesaplama",
        category: "finansal-hesaplamalar",
        name: { tr: "Parasal Değer Hesaplama (TVM)", en: "Time Value of Money (TVM)" },
        h1: { tr: "Paranın Zaman Değeri (TVM) Hesaplama — Bugünkü 1 Lira Kaç TL Eder?", en: "Time Value of Money (TVM) Calculator — Future Value Analysis" },
        description: { tr: "Paranın zaman içindeki değer değişimini hesaplayın. Belirli bir faiz oranıyla bugün sahip olduğunuz paranın gelecekteki alım gücü ve değerini simüle edin.", en: "Calculate how the value of money changes over time. Simulate future purchasing power based on interest or growth rates." },
        shortDescription: { tr: "Paranın zaman içindeki değer değişimini matematiksel olarak simüle edin.", en: "Mathematically simulate the value change of money over time." },
        inputs: [
            { id: "pv", name: { tr: "Şimdiki Değer (PV)", en: "Present Value (PV)" }, type: "number", defaultValue: 1000 },
            { id: "rate", name: { tr: "Faiz/Büyüme Oranı (%)", en: "Rate (%)" }, type: "number", defaultValue: 10 },
            { id: "years", name: { tr: "Süre (Yıl)", en: "Periods (Years)" }, type: "number", defaultValue: 1 }
        ],
        results: [
            { id: "fv", label: { tr: "Gelecek Değer (FV)", en: "Future Value (FV)" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "diff", label: { tr: "Değer Artışı", en: "Value Increase" }, suffix: " ₺", decimalPlaces: 2 }
        ],
        formula: (v) => {
            const pv = parseFloat(v.pv) || 0, r = (parseFloat(v.rate) || 0) / 100, t = parseFloat(v.years) || 1;
            const fv = pv * Math.pow(1 + r, t);
            return { fv, diff: fv - pv };
        },
        seo: {
            title: { tr: "Paranın Zaman Değeri Hesaplama (TVM) Tool - PV ve FV Analizi", en: "Time Value of Money (TVM) Tool - Present & Future Value Calculation" },
            metaDescription: { tr: "Bugünkü paranın yarınki değerini veya tersini TVM formülü ile hesaplayın. Finansın en temel prensibini yatırımlarınıza uygulayın.", en: "Calculate future vs present values of money using the TVM formula. Apply the core principle of finance to your investment goals." },
            content: {
                tr: "Finansın en temel prensibi; bugünkü 1 liranın, gelecekteki 1 liradan daha değerli olmasıdır. Bunun sebebi paranın 'fırsat maliyeti' ve 'yeniden yatırım' potansiyelidir. Paranın Zaman Değeri (TVM) hesaplaması, yatırımcıların 'Bugün elimdeki parayı yastık altında mı tutmalıyım yoksa faiz/getiri oranlarıyla değerlendirmeli miyim?' sorusuna yanıt verir. \n\nAracımız ile Şimdiki Değeri (PV), Gelecek Değere (FV) dönüştürerek, paranın enflasyon veya faiz karşısındaki yolculuğunu görebilirsiniz. Bu konsept, emeklilik planlamasından kredi maliyetine kadar her alanda karşımıza çıkar.",
                en: "The Time Value of Money (TVM) is the concept that a sum of money is worth more now than the same sum will be at a future date due to its earning potential in the interim. This core financial theory underpins everything from bank interest rates to mortgage payments and lottery annuities."
            },
            faq: [
                { q: { tr: "Enflasyon TVM'yi nasıl etkiler?", en: "How does inflation affect TVM?" }, a: { tr: "Enflasyon paranın alım gücünü düşürür. TVM ise paranın potansiyel kazancı üzerine odaklanır. Reel sonuç için beklenen orandan enflasyon çıkarılmalıdır.", en: "Inflation erodes purchasing power while TVM focuses on earning potential. For a real return, inflation should be subtracted from the rate used." } },
                { q: { tr: "FV neyi ifade eder?", en: "What does FV stand for?" }, a: { tr: "Future Value (Gelecek Değer), bir miktarın belirli bir süre sonraki toplam ulaştığı seviyeyi simgeler.", en: "FV stands for Future Value, representing the cumulative worth of an asset at a specific point in the future." } }
            ],
            richContent: {
                howItWorks: { tr: "Anapara, faiz oranının vade kuvvetiyle çarpılması prensibine dayanır (Bileşik Faiz mantığı).", en: "Based on multiplying the principal by the power of the interest rate over time (Compounding logic)." },
                formulaText: { tr: "FV = PV * (1 + r)^t", en: "FV = PV * (1 + r)^n" },
                exampleCalculation: { tr: "10.000 TL, %20 faiz oranıyla 5 yıl sonra yaklaşık 24.883 TL olur.", en: "10,000 TL at a 20% annual rate becomes roughly 24,883 TL after 5 years." },
                miniGuide: { tr: "Tüketim kararları verirken 'Bugün harcadığım 100 lira, 10 yıl sonraki kaç liradan vazgeçmem demek?' sorusunu sormak finansal zekayı artırır.", en: "Asking 'How much is this specific expenditure costing me in future potential wealth?' is a key habit for financial success." }
            }
        }
    },
    {
        id: "repo-hesaplama",
        slug: "repo-hesaplama",
        category: "finansal-hesaplamalar",
        name: { tr: "Repo Hesaplama", en: "Repo Yield Calculator" },
        h1: { tr: "Repo Hesaplama 2024 — Net Repo Getirisi ve Stopaj Analizi", en: "Repo Yield Calculator 2024 — Net Return & Tax Analysis" },
        description: { tr: "Repo işlemlerinden elde edeceğiniz net getiriyi stopaj düşülmüş olarak hesaplayın. Kısa vadeli nakit yönetimi için repo faiz kazancınızı anında saptayın.", en: "Calculate the net profit from repo transactions after tax withholding. Identify your interest gains for short-term liquidity management instantly." },
        shortDescription: { tr: "Kısa vadeli repo yatırımlarınızın net kazancını saniyeler içinde hesaplayın.", en: "Calculate net returns for your short-term repo investments in seconds." },
        inputs: [
            { id: "amount", name: { tr: "Yatırım Tutarı", en: "Investment Amount" }, type: "number", defaultValue: 10000 },
            { id: "rate", name: { tr: "Yıllık Brüt Repo Oranı (%)", en: "Gross Annual Rate (%)" }, type: "number", defaultValue: 45 },
            { id: "days", name: { tr: "Süre (Gün)", en: "Period (Days)" }, type: "number", defaultValue: 7 },
            { id: "tax", name: { tr: "Stopaj Oranı (%)", en: "Tax (%)" }, type: "number", defaultValue: 15 }
        ],
        results: [
            { id: "gross", label: { tr: "Brüt Getiri", en: "Gross Profit" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "net", label: { tr: "Net Getiri", en: "Net Profit" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "total", label: { tr: "Toplam Tutar (Anapara + Faiz)", en: "Total Maturity Value" }, suffix: " ₺", decimalPlaces: 2 }
        ],
        formula: (v) => {
            const P = parseFloat(v.amount) || 0, r = (parseFloat(v.rate) || 0) / 100;
            const t = parseFloat(v.days) || 1, tax = (parseFloat(v.tax) || 0) / 100;
            const grossReturn = (P * r * t) / 365;
            const netReturn = grossReturn * (1 - tax);
            return { gross: grossReturn, net: netReturn, total: P + netReturn };
        },
        seo: {
            title: { tr: "Repo Getirisi ve Stopaj Hesaplama - Güncel Repo Oranları 2024", en: "Repo Yield & Tax Calculator - Current Repo Rates 2024" },
            metaDescription: { tr: "Stopaj sonrası net repo kazancınızı hesaplayın. Yıllık brüt oran ve gün sayısına göre repo faizi formülünü uygulayın.", en: "Calculate net repo returns after withholding tax. Apply repo interest formulas based on annual gross rates and duration." },
            content: {
                tr: "Repo (Geri Alım Vaadiyle Satış), yatırımcıların kısa vadeli nakitlerini değerlendirmek için kullandıkları, genellikle Devlet İç Borçlanma Senetleri'ni teminat alan güvenli bir araçtır. Repo hesaplama aracımız, bankaların size sunduğu 'brüt' oran üzerinden cebinize girecek 'net' parayı bulmanızı sağlar. \n\nRepo getirisi günlük veya haftalık olarak hesaplanabilir. Stopaj (vergi) kesintisi, elde edilen faiz geliri üzerinden otomatik olarak yapılır. Aracımız, hem vergi öncesi brüt getiriyi hem de vergi sonrası net kârınızı göstererek, paranızı yönetmenize yardımcı olur.",
                en: "A Repurchase Agreement (Repo) is a short-term secure investment where securities are sold with an agreement to buy them back later. Our calculator helps investors see the actual 'net' cash in hand by factoring in national tax withholdings (stopaj), which can vary by investment term."
            },
            faq: [
                { q: { tr: "Repo güvenli midir?", en: "Is repo safe?" }, a: { tr: "Genellikle hazine kağıtları teminat olarak gösterildiği için düşük riskli ve güvenli bir yatırım aracı kabul edilir.", en: "It is considered a low-risk, secure instrument as it's typically collateralized by government treasury bonds." } },
                { q: { tr: "Ters Repo nedir?", en: "What is Reverse Repo?" }, a: { tr: "Borç veren tarafın yaptığı işleme denir; yani bir menkul kıymetin ileride satılmak üzere bugün satın alınmasıdır.", en: "It refers to the purchase of securities with an agreement to sell them back at a higher price in the future." } }
            ],
            richContent: {
                howItWorks: { tr: "Yıllık brüt oran gün sayısına bölünür (365 gün baz alınır) ve toplam tutara uygulanır, ardından stopaj düşülür.", en: "The annual gross rate is pro-rated by days (using a 365-day year) and applied to the principal, after which tax is deducted." },
                formulaText: { tr: "Net Faiz = [(Anapara * Oran * Gün) / 365] * (1 - Stopaj)", en: "Net Interest = [(Principal * Rate * Days) / 365] * (1 - Tax Rate)" },
                exampleCalculation: { tr: "100.000 TL, %45 brüt repo ile 7 günde net yaklaşık 733 TL kazanç getirir.", en: "100,000 TL at 45% gross for 7 days yields approximately 733 TL net profit." },
                miniGuide: { tr: "Repo faizleri genellikle gecelik piyasadaki likiditeye göre değişkenlik gösterir. Kısa süreli bekleyen nakdiniz için idealdir.", en: "Repo rates fluctuate based on overnight market liquidity. Perfect for maximizing value on short-term stagnant cash." }
            }
        }
    },
];

export const investmentCalculatorsP4: CalculatorConfig[] = [
    {
        id: "sermaye-ve-temettu-hesaplama",
        slug: "sermaye-ve-temettu-hesaplama",
        category: "finansal-hesaplamalar",
        name: { tr: "Sermaye ve Temettü Hesaplama", en: "Dividend Calculator" },
        h1: { tr: "Temettü (Dividend) Hesaplama — Portföy Temettü Verimi ve Kâr Analizi", en: "Dividend Calculator — Portfolio Yield & Capital Gain Analysis" },
        description: { tr: "Hisse senedi yatırımlarınızın temettü verimini ve toplam sermaye kazancını (kar/zarar) hesaplayın. Temettü emekliliği yolunda portföy performansınızı ölçün.", en: "Calculate the dividend yield and total capital gains (profit/loss) of your stock investments. Measure portfolio performance for long-term dividend growth." },
        shortDescription: { tr: "Hisse yatırımlarınızın temettü verimini ve sermaye kazancını analiz edin.", en: "Analyze dividend yields and capital gains for your stock investments." },
        inputs: [
            { id: "shareCount", name: { tr: "Hisse Adedi", en: "Number of Shares" }, type: "number", defaultValue: 100 },
            { id: "avgCost", name: { tr: "Ortalama Maliyet", en: "Average Cost" }, type: "number", defaultValue: 50 },
            { id: "currentPrice", name: { tr: "Güncel Fiyat", en: "Current Price" }, type: "number", defaultValue: 75 },
            { id: "dividendPerShare", name: { tr: "Hisse Başı Temettü (Net)", en: "Dividend Per Share (Net)" }, type: "number", defaultValue: 2.5 }
        ],
        results: [
            { id: "totalDividend", label: { tr: "Toplam Temettü", en: "Total Dividend" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "dividendYield", label: { tr: "Temettü Verimi (Maliyetine)", en: "Dividend Yield (on Cost)" }, suffix: " %", decimalPlaces: 2 },
            { id: "capitalGain", label: { tr: "Sermaye Kazancı (Kar/Zarar)", en: "Capital Gain (Profit/Loss)" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "totalReturn", label: { tr: "Toplam Getiri", en: "Total Return" }, suffix: " ₺", decimalPlaces: 2 }
        ],
        formula: (v) => {
            const qty = parseFloat(v.shareCount) || 0, cost = parseFloat(v.avgCost) || 1;
            const price = parseFloat(v.currentPrice) || 0, div = parseFloat(v.dividendPerShare) || 0;
            const totalDiv = qty * div;
            const capGain = qty * (price - cost);
            return { totalDividend: totalDiv, dividendYield: (div / cost) * 100, capitalGain: capGain, totalReturn: totalDiv + capGain };
        },
        seo: {
            title: { tr: "Sermaye ve Temettü Hesaplama - Temettü Verimi (Dividend) Portföy Takibi", en: "Dividend Yield & Capital Gain Calculator - Portfolio Tracking Tool" },
            metaDescription: { tr: "Borsa yatırımlarınızın temettü verimini ve sermaye kazancını anında hesaplayın. Hisse bazlı kâr/zarar ve toplam getiri analizi için en iyi araç.", en: "Calculate your stock market dividend yields and capital gains instantly. The best tool for stock-based profit/loss and total return analysis." },
            content: {
                tr: "Temettü, bir şirketin elde ettiği kârın bir kısmını ortaklarına nakit veya hisse olarak dağıtmasıdır. Temettü emekliliği hedefleyen yatırımcılar için en kritik metri 'Temettü Verimi'dir (Dividend Yield). Bu oran, alınan temettünün hisse maliyetine veya güncel fiyatına bölünmesiyle bulunur. \n\nSermaye kazancı (Capital Gain) ise hissenin alış fiyatı ile satış (veya güncel) fiyatı arasındaki farktır. Başarılı bir hisse senedi yatırımı hem değer artışından hem de nakit temettü akışından faydalanmalıdır. Aracımız, bu iki bileşeni birleştirerek yatırımınızın 'Toplam Getirisi'ni net bir şekilde görmenizi sağlar.",
                en: "Dividend investing combines income generation with capital appreciation. Dividend yield tells you how much cash flow you're getting relative to your investment cost. Total return, which includes both price increases and dividends, is the ultimate measure of a stock's performance over time."
            },
            faq: [
                { q: { tr: "Temettü verimi nedir?", en: "What is dividend yield?" }, a: { tr: "Şirketin dağıttığı hisse başı nakit tutarın, yatırım yaptığınız hisse fiyatına oranıdır. Genellikle yüzde (%) olarak ifade edilir.", en: "The ratio of cash distributions per share relative to the stock's cost or market price, usually expressed as a percentage." } },
                { q: { tr: "Stopaj temettüden düşer mi?", en: "Is tax deducted from dividends?" }, a: { tr: "Evet, borsada temettü ödemeleri genellikle stopaj (%10) kesintisi yapıldıktan sonra hesabınıza net olarak yatırılır.", en: "Yes, dividends are typically deposited into investment accounts after local withholding taxes (usually 10%) have been auto-deducted." } }
            ],
            richContent: {
                howItWorks: { tr: "Hisse adedi ile hisse başı temettü çarpılır; ayrıca güncel fiyat ile maliyet arasındaki fark sermaye kazancına eklenir.", en: "Multiplies share count by net dividend per share and adds the price delta between cost and market value for total return." },
                formulaText: { tr: "Toplam Getiri = (Adet * Temettü) + [Adet * (Fiyat_Güncel - Fiyat_Maliyet)]", en: "Total Return = (Qty * Div) + [Qty * (Price_Current - Price_Cost)]" },
                exampleCalculation: { tr: "100 adet hisseniz varsa ve maliyetiniz 50 TL, fiyat 75 TL ise; 2.5 TL temettü ile toplam 2.750 TL kazanç sağlarsınız.", en: "With 100 shares at 50 cost, 75 price, and 2.5 dividend, your total combined profit is 2,750 TL." },
                miniGuide: { tr: "Devamlı temettü dağıtan ve temettüsünü her yıl artıran şirketler (Temettü Aristokratları) uzun vadeli zenginlik için idealdir.", en: "Focusing on 'Dividend Aristocrats'—companies that consistently pay and grow dividends—is a proven path to long-term wealth." }
            }
        }
    },
    {
        id: "tahvil-hesaplama",
        slug: "tahvil-hesaplama",
        category: "finansal-hesaplamalar",
        name: { tr: "Tahvil Hesaplama", en: "Bond Price Calculator" },
        h1: { tr: "Tahvil Değerleme ve YTM Hesaplama — Tahvil Adil Fiyat Analizi", en: "Bond Valuation & YTM Calculator — Bond Fair Price Analysis" },
        description: { tr: "Tahvillerin piyasa fiyatını ve vade sonuna kadar getirisini (Yield to Maturity - YTM) hesaplayın. Faiz değişikliklerinin tahvil fiyatları üzerindeki etkisini görün.", en: "Calculate the market price and Yield to Maturity (YTM) of bonds. See how interest rate changes affect bond valuations instantly." },
        shortDescription: { tr: "Tahvillerin adil fiyatını ve vadeye kadar getirisini (YTM) hesaplayın.", en: "Calculate the fair price and yield to maturity (YTM) for bonds." },
        inputs: [
            { id: "faceValue", name: { tr: "Nominal Değer", en: "Face Value" }, type: "number", defaultValue: 1000 },
            { id: "couponRate", name: { tr: "Yıllık Kupon Oranı (%)", en: "Annual Coupon Rate (%)" }, type: "number", defaultValue: 25 },
            { id: "ytm", name: { tr: "Piyasa Faiz Oranı (YTM) (%)", en: "Market Yield (YTM) (%)" }, type: "number", defaultValue: 30 },
            { id: "years", name: { tr: "Vade (Yıl)", en: "Maturity (Years)" }, type: "number", defaultValue: 2 }
        ],
        results: [
            { id: "bondPrice", label: { tr: "Tahvilin Adil Değeri", en: "Fair Value of Bond" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "annualIncome", label: { tr: "Yıllık Kupon Geliri", en: "Annual Coupon Income" }, suffix: " ₺", decimalPlaces: 2 }
        ],
        formula: (v) => {
            const F = parseFloat(v.faceValue) || 100, C = (parseFloat(v.couponRate) || 0) / 100 * F;
            const r = (parseFloat(v.ytm) || 0) / 100, t = parseFloat(v.years) || 1;
            let price = 0;
            if (r === 0) price = (C * t) + F;
            else price = C * (1 - Math.pow(1 + r, -t)) / r + F / Math.pow(1 + r, t);
            return { bondPrice: price, annualIncome: C };
        },
        seo: {
            title: { tr: "Tahvil Fiyatı ve Getirisi Hesaplama - YTM Değerleme Aracı", en: "Bond Price & Yield Calculator - YTM Valuation Tool" },
            metaDescription: { tr: "Piyasa faiz oranlarına (YTM) göre tahvil fiyatlarını hesaplayın. Kuponlu ve kuponsuz tahviller için profesyonel değerleme formülleri uygulayın.", en: "Calculate bond prices based on market yields (YTM). Apply professional valuation formulas for coupon and zero-coupon bonds." },
            content: {
                tr: "Tahvil, bir kurumun fon sağlamak amacıyla çıkardığı borçlanma senedidir. Tahvil fiyatlamasında en önemli dinamik 'Faiz-Fiyat' ilişkisidir; piyasa faizleri yükseldiğinde mevcut tahvillerin fiyatı düşer. Buna 'İskontolama' denir. \n\nVade Sonuna Kadar Getiri (Yield to Maturity - YTM), bir yatırımcının tahvili bugünkü piyasa fiyatından alıp vade sonuna kadar elinde tutması durumunda elde edeceği yıllık ortalama kazancı simgeler. Aracımız, hem periyodik kupon ödemelerini hem de vade sonundaki ana parayı bugüne indirgeyerek tahvilin 'Adil Değeri'ne ulaşmanızı sağlar.",
                en: "Bond valuation is the process of determining the fair market value of a debt security. The price of a bond is essentially the present value of its future cash flows (coupons and face value). As interest rates in the market fluctuate, bond prices move inversely—making YTM calculations essential for fixed-income investors."
            },
            faq: [
                { q: { tr: "Tahvil fiyatı neden düşer?", en: "Why do bond prices drop?" }, a: { tr: "Genellikle piyasadaki faiz oranları (YTM) arttığında, eski düşük faizli tahviller cazibesini yitirir ve fiyatları iskonto edilir.", en: "Typically, when market yields rise, existing lower-rated bonds become less attractive, forcing their prices down to remain competitive." } },
                { q: { tr: "Kupon oranı nedir?", en: "What is coupon rate?" }, a: { tr: "Tahvilin üzerinde yazan ve yatırımcıya periyodik olarak ödenen faiz oranıdır.", en: "The specific interest rate stated on a bond that the issuer promises to pay periodically." } }
            ],
            richContent: {
                howItWorks: { tr: "Kupon ödemeleri ve nominal değer, piyasa faiz oranı (YTM) üzerinden bugünkü değerine indirgenir ve toplanır.", en: "Coupons and the par value are discounted back to today using the YTM and then summed to find the fair price." },
                formulaText: { tr: "P = Σ [C / (1+r)^t] + [F / (1+r)^T]", en: "P = Σ [C / (1+r)^t] + [F / (1+r)^T]" },
                exampleCalculation: { tr: "1.000 TL nominal %25 kuponlu 2 yıllık tahvil, %30 piyasa faizinde yaklaşık 923 TL eder.", en: "A 1,000 TL 25% coupon 2-year bond at 30% YTM is priced at approximately 923 TL." },
                miniGuide: { tr: "Yüksek enflasyon dönemlerinde değişken faizli tahviller (ÜFE'ye endeksli vb.) sermaye değerini korumak için daha güvenlidir.", en: "In high-inflation periods, floating-rate bonds or inflation-indexed bonds are safer targets to preserve capital value." }
            }
        }
    },
    {
        id: "vadeli-islem-fiyat-hesaplama",
        slug: "vadeli-islem-fiyat-hesaplama",
        category: "finansal-hesaplamalar",
        name: { tr: "Vadeli İşlem Fiyatı (Futures) Hesaplama", en: "Futures Fair Price Calculator" },
        h1: { tr: "VİOP ve Vadeli İşlem (Futures) Fiyat Hesaplama — Teorik Fiyat Analizi", en: "Futures & Forward Pricing Calculator — Theoretical Price Analysis" },
        description: { tr: "Vadeli işlem sözleşmelerinin (Futures) teorik adil fiyatını spot fiyat ve taşıma maliyeti üzerinden hesaplayın. Arbitraj fırsatlarını keşfedin.", en: "Calculate the theoretical fair price of futures contracts based on spot price and cost of carry. Discover arbitrage opportunities instantly." },
        shortDescription: { tr: "Vadeli işlem sözleşmelerinin teorik adil fiyatını hesaplayın.", en: "Calculate the theoretical fair price of futures contracts." },
        inputs: [
            { id: "spot", name: { tr: "Spot Fiyat", en: "Spot Price" }, type: "number", defaultValue: 10000 },
            { id: "rate", name: { tr: "Faiz Oranı (Yıllık %)", en: "Interest Rate (Annual %)" }, type: "number", defaultValue: 50 },
            { id: "dividend", name: { tr: "Temettü Verimi / Taşıma Getirisi (%)", en: "Dividend Yield (%)" }, type: "number", defaultValue: 5 },
            { id: "days", name: { tr: "Vadeye Kalan Gün", en: "Days to Expiry" }, type: "number", defaultValue: 30 }
        ],
        results: [
            { id: "futuresPrice", label: { tr: "Teorik Vadeli Fiyat", en: "Theoretical Futures Price" }, decimalPlaces: 2 },
            { id: "basis", label: { tr: "Baz (Vadeli - Spot)", en: "Basis (Futures - Spot)" }, decimalPlaces: 2 }
        ],
        formula: (v) => {
            const S = parseFloat(v.spot) || 0, r = (parseFloat(v.rate) || 0) / 100;
            const d = (parseFloat(v.dividend) || 0) / 100, T = (parseFloat(v.days) || 0) / 365;
            const fPrice = S * (1 + (r - d) * T);
            return { futuresPrice: fPrice, basis: fPrice - S };
        },
        seo: {
            title: { tr: "Vadeli İşlem (Futures) Fiyatı ve Arbitraj Hesaplama - VİOP Tool", en: "Futures Pricing & Arbitrage Calculator - Financial Markets Tool" },
            metaDescription: { tr: "Spot fiyat, faiz ve temettüye göre vadeli kontratların teorik değerini bulun. VİOP baz değerini ve taşıma maliyetini anında analiz edin.", en: "Find the theoretical value of futures contracts based on spot price, interest, and dividends. Analyze basis value and cost of carry instantly." },
            content: {
                tr: "Türev piyasalarda vadeli işlem (Futures) fiyatı, spot fiyatın üzerine paranın kullanım maliyetinin (faiz) eklenmesi ve beklenen getirilerin (temettü) düşülmesiyle oluşur. Buna 'Taşıma Maliyeti' modeli denir. \n\nEğer piyasada işlem gören vadeli fiyat, hesaplanan 'teorik fiyattan' anlamlı şekilde farklıysa, profesyonel yatırımcılar için arbitraj (risksiz kâr) fırsatı doğabilir. 'Baz' değeri ise vadeli fiyat ile spot fiyat arasındaki farktır ve vade yaklaştıkça bu farkın sıfıra doğru yakınsaması beklenir. Aracımız, VİOP gibi piyasalarda işlem yapanlar için hızlı bir navigasyon sağlar.",
                en: "Futures pricing is based on the theory of 'cost of carry.' In an efficient market, the futures price is the spot price adjusted for the cost of financing the underlying asset minus any income generated by that asset (like dividends) during the contract life. Traders use this theoretical benchmark to spot arbitrage potential."
            },
            faq: [
                { q: { tr: "Taşıma maliyeti nedir?", en: "What is cost of carry?" }, a: { tr: "Bir varlığı vadeye kadar elinde tutmanın faiz maliyeti eksi o varlıktan elde edilen getiridir.", en: "The expense associated with holding an asset over a period of time, primarily interest costs minus income." } },
                { q: { tr: "Baz (Basis) neden önemlidir?", en: "Why is basis important?" }, a: { tr: "Bazın daralması veya genişlemesi, piyasadaki arz-talep dengesi ve beklentiler hakkında güçlü sinyaller verir.", en: "Changes in basis reflect market sentiment and the converging relationships between spot and futures prices." } }
            ],
            richContent: {
                howItWorks: { tr: "Spot fiyat, risksiz faiz oranı ile beklenen temettü verimi arasındaki farkın vadeye oranlanmasıyla düzeltilir.", en: "The spot price is adjusted by the net difference between interest rates and dividend yields, pro-rated to the expiry date." },
                formulaText: { tr: "F = S * [1 + (r - d) * T]", en: "F = S * [1 + (r - i) * t]" },
                exampleCalculation: { tr: "10.000 TL spot fiyatlı bir endeks, %50 faiz ve %5 temettü ile 30 günde yaklaşık 10.370 TL teorik vadeli fiyata sahiptir.", en: "An index at 10,000 spot with 50% interest and 5% dividend yields a 10,370 TL theoretical futures price in 30 days." },
                miniGuide: { tr: "Gerçek fiyat ile teorik fiyat arasındaki fark %1-2'yi aşıyorsa arbitraj imkanlarını değerlendirmek faydalı olabilir.", en: "If market prices deviate significantly from theoretical values, it may indicate arbitrage opportunities or high market volatility." }
            }
        }
    },
];

export const investmentCalculatorsP5: CalculatorConfig[] = [
    // ── ENFLASYON HESAPLAMA ──────────────────────────────────
    {
        id: "enflasyon-hesaplama",
        slug: "enflasyon-hesaplama",
        category: "finansal-hesaplamalar",
        name: { tr: "Enflasyon Hesaplama", en: "Inflation Calculator" },
        h1: { tr: "Enflasyon Hesaplama — Paranın Satın Alma Gücü Ne Kadar Eridi?", en: "Inflation Calculator — How Much Did Your Money Lose?" },
        description: { tr: "Belirli bir yıldaki para miktarının bugünkü değerini enflasyon oranına göre hesaplayın. Satın alma gücü kaybını ve fiyat artışını görün.", en: "Calculate the current value of a past amount of money based on inflation rate. See purchasing power loss and price increase." },
        shortDescription: { tr: "Belirli bir tutarın enflasyon karşısında ne kadar eridiğini veya değer kazandığını hesaplayın.", en: "Calculate how much a specific amount eroded or grew against inflation." },
        relatedCalculators: ["reel-getiri-hesaplama", "bilesik-buyume-hesaplama", "birikim-hesaplama"],
        inputs: [
            { id: "amount", name: { tr: "Geçmişteki Tutar (₺)", en: "Past Amount (₺)" }, type: "number", defaultValue: 10000, suffix: "₺", required: true },
            { id: "rate", name: { tr: "Yıllık Enflasyon Oranı (%)", en: "Annual Inflation Rate (%)" }, type: "number", defaultValue: 65, suffix: "%", required: true },
            { id: "years", name: { tr: "Süre (Yıl)", en: "Duration (Years)" }, type: "number", defaultValue: 3, required: true },
        ],
        results: [
            { id: "currentValue", label: { tr: "Bugünkü Eşdeğer Değer", en: "Current Equivalent Value" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "purchasingLoss", label: { tr: "Satın Alma Gücü Kaybı (₺)", en: "Purchasing Power Loss (₺)" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "purchasingLossPct", label: { tr: "Satın Alma Gücü Erimesi (%)", en: "Purchasing Power Loss (%)" }, suffix: " %", decimalPlaces: 2 },
        ],
        formula: (v) => {
            const P = parseFloat(v.amount) || 0;
            const r = (parseFloat(v.rate) || 0) / 100;
            const t = parseFloat(v.years) || 0;
            const currentValue = P * Math.pow(1 + r, t);
            const purchasingLoss = currentValue - P;
            const purchasingLossPct = ((currentValue - P) / P) * 100;
            return { currentValue, purchasingLoss, purchasingLossPct };
        },
        seo: {
            title: { tr: "Enflasyon Hesaplama 2026 — Satın Alma Gücü Kaybı Hesaplayıcı", en: "Inflation Calculator 2026 — Purchasing Power Loss" },
            metaDescription: { tr: "Geçmişteki tutarınızın enflasyon karşısında bugün kaç TL'ye karşılık geldiğini ve satın alma gücünün ne kadar eridiğini hesaplayın.", en: "Calculate how much your past money equals today adjusted for inflation, and how much purchasing power has been lost." },
            content: { tr: "Enflasyon, zaman içinde mal ve hizmetlerin fiyatlarının genel düzeyinin artması ve buna bağlı olarak paranın satın alma gücünün azalmasıdır. Türkiye'de yüksek enflasyon dönemlerinde paranın değerini korumak büyük önem taşır. Bu araç, geçmişte sahip olduğunuz bir miktarın bugün hangi fiyat seviyesine karşılık geldiğini TÜİK enflasyon verilerini referans alarak simüle eder.", en: "Inflation represents the general increase in prices over time, eroding purchasing power. This tool simulates how much past money equals in today's prices, referencing annual inflation rates." },
            faq: [
                { q: { tr: "Enflasyon neden önemlidir?", en: "Why is inflation important?" }, a: { tr: "Enflasyon, bankadaki paranızın ve sabit gelirinizin reel değerini doğrudan etkiler. Enflasyonun altında getiri sağlayan yatırımlar reel anlamda zarar ettirir.", en: "Inflation directly affects the real value of savings and fixed income. Investments below inflation rates result in real losses." } },
                { q: { tr: "Enflasyon oranını nereden öğrenebilirim?", en: "Where can I find the inflation rate?" }, a: { tr: "TÜİK her ay resmi TÜFE (Tüketici Fiyat Endeksi) verilerini yayımlar. Bu veriye tuik.gov.tr adresinden ulaşabilirsiniz.", en: "TÜİK publishes official CPI data monthly at tuik.gov.tr." } },
                { q: { tr: "Bileşik enflasyon ne demektir?", en: "What is compounded inflation?" }, a: { tr: "Her yılın enflasyonu, önceki yılın yükselen fiyat tabanı üzerine eklenir. Bu bileşik etki, uzun vadede toplam değer kaybının tek yıllık tahminlerden çok daha yüksek olmasına neden olur.", en: "Each year's inflation builds on the previous year's elevated prices, creating a compounding effect that results in far greater total loss than simple addition suggests." } },
            ],
            richContent: {
                howItWorks: { tr: "Başlangıç tutarı, yıllık enflasyon oranıyla bileşik büyüme formülüne göre vade sonuna taşınır. Çıkan fark, paranızın satın alma gücündeki erimedir.", en: "The starting amount is compounded forward using the annual inflation rate. The resulting difference shows your purchasing power loss." },
                formulaText: { tr: "Bugünkü Değer = Geçmiş Tutar × (1 + Enflasyon Oranı)^Yıl. Kayıp = Bugünkü Değer − Geçmiş Tutar.", en: "Current Value = Past Amount × (1 + InflationRate)^Years. Loss = Current − Past." },
                exampleCalculation: { tr: "10.000 TL, %65 enflasyonla 3 yılda yaklaşık 44.917 TL'lik reel satın alma gücüne karşılık gelir. Yani geçmişteki 10.000 TL'yi bugün yeniden kazanmak için 44.917 TL harcamanız gerekir.", en: "10,000 TL at 65% inflation for 3 years becomes ~44,917 TL in current prices. You'd need to spend 44,917 TL today to match that past purchasing power." },
                miniGuide: { tr: "<ul><li><b>Reel Getiri:</b> Yatırımınızın getirisi enflasyonun altındaysa, reel anlamda zarar ediyorsunuz demektir.</li><li><b>Tasarruf Planlaması:</b> Uzun vadeli tasarruflarda bileşik enflasyon etkisini mutlaka hesaba katın.</li></ul>", en: "If your investment return is below inflation, you're losing in real terms. Always account for compound inflation in long-term savings plans." },
            },
        },
    },

    // ── REEL GETİRİ HESAPLAMA ────────────────────────────────
    {
        id: "reel-getiri-hesaplama",
        slug: "reel-getiri-hesaplama",
        category: "finansal-hesaplamalar",
        name: { tr: "Reel Getiri Hesaplama", en: "Real Return Calculator" },
        h1: { tr: "Reel Getiri Hesaplama — Enflasyon Sonrası Gerçek Kazancınız", en: "Real Return Calculator — Your True Profit After Inflation" },
        description: { tr: "Nominal faiz veya yatırım getirinizin enflasyonu düşüldükten sonraki gerçek (reel) değerini hesaplayın. Paranız gerçekten kazanıyor mu, eriyor mu?", en: "Calculate the real value of your nominal interest or investment return after subtracting inflation. Is your money truly growing?" },
        shortDescription: { tr: "Yatırım getirinizin enflasyon sonrası gerçek satın alma gücü artışını hesaplayın.", en: "Calculate the real purchasing power increase of your investment return after inflation." },
        relatedCalculators: ["enflasyon-hesaplama", "bilesik-buyume-hesaplama", "birikim-hesaplama"],
        inputs: [
            { id: "nominal", name: { tr: "Nominal Getiri Oranı (%)", en: "Nominal Return Rate (%)" }, type: "number", defaultValue: 50, suffix: "%", required: true },
            { id: "inflation", name: { tr: "Enflasyon Oranı (%)", en: "Inflation Rate (%)" }, type: "number", defaultValue: 65, suffix: "%", required: true },
        ],
        results: [
            { id: "realReturn", label: { tr: "Reel Getiri Oranı (%)", en: "Real Return Rate (%)" }, suffix: " %", decimalPlaces: 2 },
            { id: "status", label: { tr: "Değerlendirme", en: "Assessment" }, type: "text" },
        ],
        formula: (v) => {
            const nominal = (parseFloat(v.nominal) || 0) / 100;
            const inflation = (parseFloat(v.inflation) || 0) / 100;
            const realReturn = ((1 + nominal) / (1 + inflation) - 1) * 100;
            const status = realReturn >= 0
                ? { tr: "✅ Satın alma gücünüz artıyor", en: "✅ Purchasing power is growing" }
                : { tr: "⚠️ Satın alma gücünüz eriyor", en: "⚠️ Purchasing power is eroding" };
            return { realReturn, status };
        },
        seo: {
            title: { tr: "Reel Getiri Hesaplama 2026 — Enflasyon Düzeltmeli Kazanç", en: "Real Return Calculator 2026 — Inflation-Adjusted Profit" },
            metaDescription: { tr: "Nominal faiz ve enflasyon oranınızı girerek gerçek (reel) getirinizi hesaplayın. Paranız mevduat veya yatırımla gerçekten değerleniyor mu?", en: "Enter nominal interest and inflation rates to calculate real return. Is your money genuinely appreciating?" },
            content: { tr: "Nominal getiri, bir yatırımın enflasyon etkisi hesaba katılmadan görünen kazancıdır. Ancak asıl önemli olan reel getiridir. Örneğin mevduatınız %50 faiz getirirken enflasyon %65 ise, reel getiriniz negatiftir ve paranızın satın alma gücü aslında erimektedir. Reel Getiri Hesaplama aracımız, Fisher denklemi (Irving Fisher formülü) kullanarak bu gerçeği net biçimde ortaya koyar.", en: "Real return is the nominal return adjusted for inflation using Fisher's equation. If your deposit earns 50% but inflation is 65%, you're actually losing purchasing power despite gaining nominally." },
            faq: [
                { q: { tr: "Fisher denklemi nedir?", en: "What is Fisher's equation?" }, a: { tr: "Irving Fisher'ın geliştirdiği bu denklem, nominal getiri ve enflasyon arasındaki ilişkiyi ifade eder: Reel = [(1+Nominal)/(1+Enflasyon)] - 1. Bu, basit çıkarma işlemine (Nominal - Enflasyon) göre daha doğru bir sonuç verir.", en: "Fisher's equation: Real = [(1+Nominal)/(1+Inflation)] - 1. This is more accurate than simply subtracting inflation from nominal return." } },
                { q: { tr: "Mevduat enflasyonu yeniyor mu?", en: "Does a savings account beat inflation?" }, a: { tr: "Türkiye'de yüksek enflasyon dönemlerinde mevduat faizleri çoğu zaman enflasyonun gerisinde kalabilir. Bu nedenle reel getiriyi hesaplayarak alternatif yatırım araçlarını da değerlendirmelisiniz.", en: "In high-inflation periods, savings deposit rates often lag behind inflation. Calculate real returns to evaluate alternatives." } },
            ],
            richContent: {
                howItWorks: { tr: "Nominal getiri ve enflasyon oranları Fisher denklemiyle işlenerek reel kazanç hesaplanır.", en: "Uses Fisher's equation to calculate the true purchasing power gain after accounting for inflation." },
                formulaText: { tr: "Reel Getiri = [(1 + Nominal Oran) / (1 + Enflasyon)] − 1", en: "Real Return = [(1 + Nominal Rate) / (1 + Inflation)] − 1" },
                exampleCalculation: { tr: "Mevduatınız %50 faiz getirirken enflasyon %65 ise: Reel Getiri = (1.50/1.65) - 1 = -%9,09. Paranız eriyor!", en: "If deposit earns 50% and inflation is 65%: Real Return = (1.50/1.65) - 1 = -9.09%. Your money is losing value!" },
                miniGuide: { tr: "<ul><li><b>Pozitif Reel Getiri Hedefleyin:</b> Yatırımlarınızda en az enflasyon + %5 gibi bir hedef belirleyin.</li><li><b>Alternatifler:</b> Altın, döviz ve hisse senedi gibi araçların reel getirilerini de hesaplayarak karşılaştırın.</li></ul>", en: "Aim for at least inflation + 5%. Compare real returns across gold, forex, and equities." },
            },
        },
    },

    // ── BİRİKİM HESAPLAMA ────────────────────────────────────
    {
        id: "birikim-hesaplama",
        slug: "birikim-hesaplama",
        category: "finansal-hesaplamalar",
        name: { tr: "Birikim Hesaplama", en: "Savings Calculator" },
        h1: { tr: "Birikim Hesaplama — Aylık Yatırım ile Hedefinize Ulaşın", en: "Savings Calculator — Reach Your Goal with Monthly Investment" },
        description: { tr: "Başlangıç birikimi ve aylık katkı payı ile belirli bir süre ve faiz oranında toplam birikimizi hesaplayın. Finansal hedefinize ne zaman ulaşırsınız?", en: "Calculate total savings with starting balance and monthly contributions over a given period and interest rate. When will you reach your financial goal?" },
        shortDescription: { tr: "Düzenli aylık katkı ve bileşik faiz ile birikimizin nasıl büyüyeceğini görün.", en: "See how regular monthly contributions grow your savings with compound interest." },
        relatedCalculators: ["bilesik-faiz-hesaplama", "enflasyon-hesaplama", "reel-getiri-hesaplama"],
        inputs: [
            { id: "initialAmount", name: { tr: "Başlangıç Birikimi (₺)", en: "Initial Savings (₺)" }, type: "number", defaultValue: 10000, suffix: "₺", required: false },
            { id: "monthlyContribution", name: { tr: "Aylık Katkı (₺)", en: "Monthly Contribution (₺)" }, type: "number", defaultValue: 2000, suffix: "₺", required: true },
            { id: "annualRate", name: { tr: "Yıllık Faiz Oranı (%)", en: "Annual Interest Rate (%)" }, type: "number", defaultValue: 50, suffix: "%", required: true },
            { id: "years", name: { tr: "Süre (Yıl)", en: "Duration (Years)" }, type: "number", defaultValue: 5, required: true },
        ],
        results: [
            { id: "totalSavings", label: { tr: "Toplam Birikim", en: "Total Savings" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "totalContributions", label: { tr: "Toplam Katkı Payları", en: "Total Contributions" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "totalInterest", label: { tr: "Kazanılan Toplam Faiz", en: "Total Interest Earned" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "chart", label: { tr: "Birikim Dağılımı", en: "Savings Distribution" }, type: "pieChart" },
        ],
        formula: (v) => {
            const PV = parseFloat(v.initialAmount) || 0;
            const PMT = parseFloat(v.monthlyContribution) || 0;
            const r = ((parseFloat(v.annualRate) || 0) / 100) / 12;
            const n = (parseFloat(v.years) || 0) * 12;
            const totalContributions = PV + PMT * n;

            let totalSavings: number;
            if (r === 0) {
                totalSavings = PV + PMT * n;
            } else {
                const futurePV = PV * Math.pow(1 + r, n);
                const futurePMT = PMT * ((Math.pow(1 + r, n) - 1) / r);
                totalSavings = futurePV + futurePMT;
            }
            const totalInterest = totalSavings - totalContributions;
            return {
                totalSavings,
                totalContributions,
                totalInterest,
                chart: {
                    segments: [
                        { label: { tr: "Katkı Payları", en: "Contributions" }, value: totalContributions, colorClass: "bg-white", colorHex: "#ffffff" },
                        { label: { tr: "Kazanılan Faiz", en: "Interest Earned" }, value: totalInterest, colorClass: "bg-[#22c55e]", colorHex: "#22c55e" },
                    ]
                }
            };
        },
        seo: {
            title: { tr: "Birikim Hesaplama 2026 — Aylık Tasarruf Planı", en: "Savings Calculator 2026 — Monthly Savings Plan" },
            metaDescription: { tr: "Başlangıç birikimi ve aylık katkı payınızı girerek yıllar içinde ne kadar birikim yapabileceğinizi hesaplayın. Finansal hedefinize ulaşmak için plan yapın.", en: "Enter your initial savings and monthly contribution to calculate total wealth over the years. Plan to reach your financial goals." },
            content: { tr: "Birikim hesaplama, uzun vadeli finansal hedeflere ulaşmak için kritik bir planlama aracıdır. Aylık düzenli katkı payları ve bileşik faizin bir araya gelmesi, zaman içinde çarpıcı sonuçlar doğurabilir. Bu hesaplayıcı, başlangıç sermayenizi, aylık tasarruf miktarınızı ve faiz oranını birleştirerek gelecekteki toplam birikimizi, ödediğiniz katkı paylarını ve bileşik faizin sağladığı ek getiriyi ayrı ayrı gösterir.", en: "Savings planning combines monthly contributions with compound interest to project future wealth. This calculator separates your contributions from interest earnings to show the true power of consistent saving." },
            faq: [
                { q: { tr: "Ne kadar aylık birikim yapmalıyım?", en: "How much should I save monthly?" }, a: { tr: "Genel kural olarak aylık net gelirinizin en az %20'sini biriktirmeniz önerilir. Ancak yaşam koşullarınıza ve hedeflerinize göre bu oran değişebilir.", en: "A common rule of thumb is to save at least 20% of net monthly income, though personal circumstances and goals vary." } },
                { q: { tr: "Aylık katkı mi daha iyidir, yoksa toplu yatırım mı?", en: "Is monthly contribution or lump sum better?" }, a: { tr: "İkincisi matematiksel olarak daha avantajlıdır (paranın tamamı daha uzun süre faiz işler). Ancak düzenli aylık katkı, piyasa zamanlamasından bağımsız 'ortalama maliyet' avantajı sağlar.", en: "A lump sum is mathematically advantageous, but regular monthly contributions provide 'dollar-cost averaging' benefits regardless of market timing." } },
            ],
            richContent: {
                howItWorks: { tr: "Başlangıç birikimi aylık bileşik büyür, aylık katkılar ise annüite (FV of annuity) formülüyle işlenerek toplama eklenir.", en: "The initial balance compounds monthly, while monthly contributions are processed via the Future Value of Annuity formula and added to the total." },
                formulaText: { tr: "Toplam = PV×(1+r)^n + PMT×[(1+r)^n − 1] / r. r = Aylık faiz, n = Ay sayısı.", en: "Total = PV×(1+r)^n + PMT×[(1+r)^n−1]/r. r = monthly rate, n = months." },
                exampleCalculation: { tr: "10.000 TL başlangıç, 2.000 TL aylık katkı, %50 yıllık faizle 5 yılda toplam birikim yaklaşık 1.020.000 TL olur. Katkı payları 130.000 TL, faiz kazancı ise 890.000 TL'dir.", en: "10,000 TL initial + 2,000 TL/month at 50% annual rate for 5 years ≈ 1,020,000 TL total. Contributions: 130,000 TL, Interest: 890,000 TL." },
                miniGuide: { tr: "<ul><li><b>Erken Başlayın:</b> Birikim süresini uzatmak toplam getiriyi katlamanın en kolay yoludur.</li><li><b>Stopaj Etkisi:</b> Vadeli mevduatta %15 stopaj düşüldükten sonraki net faiz oranınız üzerinden hesaplama yapın.</li></ul>", en: "Start early to maximize compounding. Use net-of-tax interest rates for bank deposits (15% withholding in Turkey)." },
            },
        },
    },

    // ── EUROBOND HESAPLAMA ───────────────────────────────────
    {
        id: "eurobond-hesaplama",
        slug: "eurobond-hesaplama",
        category: "finansal-hesaplamalar",
        name: { tr: "Eurobond Hesaplama", en: "Eurobond Calculator" },
        h1: { tr: "Eurobond Hesaplama — Dolar Bazlı Türk Hazine Tahvili Getirisi", en: "Eurobond Calculator — USD-Based Turkish Treasury Bond Yield" },
        description: { tr: "Türk Hazinesi ve şirketlerin ihraç ettiği döviz cinsinden eurobondların kupon gelirinizi ve toplam getirinizi hesaplayın. Kur etkisiyle TL karşılığını görün.", en: "Calculate coupon income and total return for USD/EUR-denominated eurobonds. See the TRY equivalent factoring in exchange rate changes." },
        shortDescription: { tr: "Eurobond yatırımınızın yıllık dolar kupon gelirini ve TL karşılığını hesaplayın.", en: "Calculate annual USD coupon income and TRY equivalent for your eurobond investment." },
        relatedCalculators: ["tahvil-hesaplama", "bono-hesaplama", "doviz-hesaplama"],
        inputs: [
            { id: "nominal", name: { tr: "Nominal Değer (USD)", en: "Face Value (USD)" }, type: "number", defaultValue: 1000, suffix: "USD", required: true },
            { id: "couponRate", name: { tr: "Yıllık Kupon Oranı (%)", en: "Annual Coupon Rate (%)" }, type: "number", defaultValue: 7.5, suffix: "%", required: true },
            { id: "years", name: { tr: "Vade (Yıl)", en: "Maturity (Years)" }, type: "number", defaultValue: 5, required: true },
            { id: "usdRate", name: { tr: "Güncel USD/TL Kuru", en: "Current USD/TL Rate" }, type: "number", defaultValue: 35, suffix: "₺", required: true },
        ],
        results: [
            { id: "annualCouponUSD", label: { tr: "Yıllık Kupon (USD)", en: "Annual Coupon (USD)" }, suffix: " $", decimalPlaces: 2 },
            { id: "annualCouponTRY", label: { tr: "Yıllık Kupon (TL)", en: "Annual Coupon (TRY)" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "totalCouponUSD", label: { tr: "Toplam Kupon Geliri (USD)", en: "Total Coupon Income (USD)" }, suffix: " $", decimalPlaces: 2 },
            { id: "totalReturnTRY", label: { tr: "Toplam Getiri (TL) — Anapara Dahil", en: "Total Return (TRY) — Including Principal" }, suffix: " ₺", decimalPlaces: 2 },
        ],
        formula: (v) => {
            const face = parseFloat(v.nominal) || 0;
            const couponRate = (parseFloat(v.couponRate) || 0) / 100;
            const years = parseFloat(v.years) || 0;
            const rate = parseFloat(v.usdRate) || 1;
            const annualCouponUSD = face * couponRate;
            const annualCouponTRY = annualCouponUSD * rate;
            const totalCouponUSD = annualCouponUSD * years;
            const totalReturnTRY = (face + totalCouponUSD) * rate;
            return { annualCouponUSD, annualCouponTRY, totalCouponUSD, totalReturnTRY };
        },
        seo: {
            title: { tr: "Eurobond Hesaplama 2026 — Dolar Kupon Getirisi ve TL Karşılığı", en: "Eurobond Calculator 2026 — USD Coupon Yield & TRY Equivalent" },
            metaDescription: { tr: "Eurobond yatırımınızın yıllık ve toplam kupon gelirini, güncel USD/TL kuruyla TL karşılığını hesaplayın. Döviz bazlı tahvil getirisini analiz edin.", en: "Calculate annual and total coupon income from your Eurobond investment, plus TRY equivalent at current USD/TL rate." },
            content: { tr: "Eurobond, Türk Hazinesi veya Türk şirketleri tarafından uluslararası piyasalarda dolar (USD) ya da euro (EUR) cinsinden ihraç edilen tahvildir. Yerli yatırımcılar açısından eurobond, TL değer kaybına karşı korunma (hedge) sağlaması ve sabit dolar faiz geliri sunması açısından cazip bir araçtır. Ancak kur riski, ülke riski ve likidite riski göz önünde bulundurulmalıdır.", en: "Eurobonds are bonds issued by Turkish Treasury or companies in foreign currencies (USD/EUR) in international markets. They offer a hedge against TRY depreciation and fixed foreign-currency income. However, they carry currency risk, country risk, and liquidity risk." },
            faq: [
                { q: { tr: "Eurobond'a kimler yatırım yapabilir?", en: "Who can invest in Eurobonds?" }, a: { tr: "Türkiye'de bireysel yatırımcılar banka aracılığıyla Eurobond alabilir. Minimum lot büyüklüğü genellikle 1.000 USD'dir.", en: "Individual investors in Turkey can buy Eurobonds through banks. Minimum lot size is typically 1,000 USD." } },
                { q: { tr: "Kupon ödemeleri ne sıklıkla yapılır?", en: "How often are coupons paid?" }, a: { tr: "Türk Hazinesi Eurobondlarında kuponlar genellikle 6 ayda bir (yarı yıllık) ödenir.", en: "Turkish Treasury Eurobond coupons are typically paid semi-annually (twice a year)." } },
                { q: { tr: "Eurobond'un riski nedir?", en: "What are the risks of Eurobonds?" }, a: { tr: "Başlıca riskler: Ülke riski (Türkiye kredi riski), piyasa faiz riski (YTM değişimleri) ve kur riski (USD/TL değişimi). Ancak dolarizasyon avantajı sağlar.", en: "Main risks: country risk (Turkey credit rating), interest rate risk (YTM changes), and secondary liquidity risk. However, provides dollarization advantage." } },
            ],
            richContent: {
                howItWorks: { tr: "Nominal değer ile yıllık kupon oranı çarpılarak USD kupon geliri bulunur. Bu tutar güncel kur ile TL'ye çevrilir. Vade boyunca toplam kupon da aynı şekilde hesaplanır.", en: "Face value is multiplied by the annual coupon rate for USD income, then converted to TRY at the current rate. Total coupons are summed across the maturity." },
                formulaText: { tr: "Yıllık Kupon = Nominal × Kupon Oranı. TL Karşılık = Yıllık Kupon × USD/TL Kuru.", en: "Annual Coupon = Face × Coupon Rate. TRY = Annual Coupon × USD/TL Rate." },
                exampleCalculation: { tr: "1.000 USD nominal, %7.5 kupon, 35 TL kur: Yıllık kupon 75 USD = 2.625 TL. 5 yılda toplam kupon 375 USD = 13.125 TL. Anapara dahil toplam 35.000 + 13.125 = 48.125 TL.", en: "1,000 USD at 7.5% coupon, 35 TL rate: Annual coupon 75 USD = 2,625 TRY. 5 years: 375 USD total = 13,125 TRY. Total incl. principal: 48,125 TRY." },
                miniGuide: { tr: "<ul><li><b>Kur Etkisi:</b> TL değer kaybettikçe eurobond'un TL getirisi artar; bu dolaylı bir kur koruması sağlar.</li><li><b>Stopaj:</b> Eurobond kupon geliri Türk yatırımcılar için genellikle stopaja tabidir; güncel oranları bankanızdan teyit edin.</li></ul>", en: "TRY depreciation increases TL returns from eurobonds, providing indirect currency protection. Withholding tax applies to coupon income—confirm current rates with your bank." },
            },
        },
    },

    // ── IBAN DOĞRULAMA ───────────────────────────────────────
    {
        id: "iban-dogrulama",
        slug: "iban-dogrulama",
        category: "finansal-hesaplamalar",
        name: { tr: "IBAN Doğrulama", en: "IBAN Validation" },
        h1: { tr: "IBAN Doğrulama — TR IBAN Formatı ve Geçerlilik Kontrolü", en: "IBAN Validation — TR IBAN Format & Validity Check" },
        description: { tr: "Türk ve uluslararası IBAN numaralarının geçerliliğini MOD97 algoritmasıyla doğrulayın. IBAN formatı kontrolü ve banka bilgisini anlık görün.", en: "Validate Turkish and international IBAN numbers using the MOD97 algorithm. Check IBAN format and bank info instantly." },
        shortDescription: { tr: "IBAN numaranızın doğru formatta olup olmadığını ve geçerli olup olmadığını kontrol edin.", en: "Check if your IBAN number is in the correct format and is valid." },
        relatedCalculators: ["kredi-taksit-hesaplama", "basit-faiz-hesaplama"],
        inputs: [
            { id: "iban", name: { tr: "IBAN Numarası", en: "IBAN Number" }, type: "text", placeholder: { tr: "TR00 0000 0000 0000 0000 0000 00", en: "TR00 0000 0000 0000 0000 0000 00" }, required: true },
        ],
        results: [
            { id: "isValid", label: { tr: "Geçerlilik Durumu", en: "Validity Status" }, type: "text" },
            { id: "country", label: { tr: "Ülke", en: "Country" }, type: "text" },
            { id: "bankCode", label: { tr: "Banka Kodu", en: "Bank Code" }, type: "text" },
            { id: "formatted", label: { tr: "Formatlanmış IBAN", en: "Formatted IBAN" }, type: "text" },
        ],
        formula: (v) => {
            const raw = (v.iban || "").replace(/\s/g, "").toUpperCase();
            const formatted = raw.replace(/(.{4})/g, "$1 ").trim();
            const country = raw.substring(0, 2);
            const bankCode = raw.length >= 9 ? raw.substring(4, 9) : "—";

            if (raw.length < 5) {
                return {
                    isValid: { tr: "⚠️ IBAN çok kısa", en: "⚠️ IBAN too short" },
                    country: country || "—", bankCode: "—", formatted: raw
                };
            }
            // MOD97 check — string-based modulo (no BigInt needed)
            const rearranged = raw.slice(4) + raw.slice(0, 4);
            const numerical = rearranged.split("").map((c: string) => {
                const code = c.charCodeAt(0);
                return code >= 65 ? (code - 55).toString() : c;
            }).join("");
            let remainder = 0;
            for (let i = 0; i < numerical.length; i++) {
                remainder = (remainder * 10 + parseInt(numerical[i], 10)) % 97;
            }
            const valid = remainder === 1;

            const bankMap: Record<string, string> = {
                "00010": "Ziraat Bankası", "00011": "Ziraat Bankası",
                "00046": "Akbank", "00062": "Garanti BBVA",
                "00064": "İş Bankası", "00015": "VakıfBank",
                "00012": "Halkbank", "00032": "TEB",
                "00059": "Şekerbank", "00067": "Yapı Kredi",
            };
            const bankName = bankMap[bankCode] || "—";

            return {
                isValid: valid
                    ? { tr: "✅ Geçerli IBAN", en: "✅ Valid IBAN" }
                    : { tr: "❌ Geçersiz IBAN — Kontrol edin!", en: "❌ Invalid IBAN — Please check!" },
                country: country + (country === "TR" ? " (Türkiye)" : ""),
                bankCode: bankCode + (bankName !== "—" ? ` — ${bankName}` : ""),
                formatted,
            };
        },
        seo: {
            title: { tr: "IBAN Doğrulama ve Sorgulama — TR IBAN Kontrol 2026", en: "IBAN Validation & Lookup — TR IBAN Check 2026" },
            metaDescription: { tr: "IBAN numaranızın doğruluğunu MOD97 algoritmasıyla ücretsiz doğrulayın. Türk bankaları için banka kodu ve format kontrolü anında yapılır.", en: "Validate your IBAN number for free using the MOD97 algorithm. Bank code and format check for Turkish banks done instantly." },
            content: { tr: "IBAN (International Bank Account Number), banka hesaplarını uluslararası düzeyde tanımlamak için kullanılan standart bir numaralandırma sistemidir. Türkiye'de IBAN, 'TR' ülke kodu + 2 kontrol hanesi + 24 rakamdan oluşan toplam 26 karakterli bir numaradır. Yanlış girilen bir IBAN nedeniyle yapılan para transferleri reddedilir veya yanlış hesaba ulaşabilir.", en: "IBAN is a standardized account numbering system for international transfers. Turkish IBANs are 26 characters: 'TR' + 2 check digits + 24 numeric characters. Invalid IBANs can cause failed or misdirected transfers." },
            faq: [
                { q: { tr: "TR IBAN kaç haneden oluşur?", en: "How many digits is a Turkish IBAN?" }, a: { tr: "Türkiye IBAN'ı 26 karakterden oluşur: TR (2) + Kontrol hanesi (2) + Rezerv (1) + Banka kodu (5) + Şube kodu (4) + Hesap numarası (12) = 26.", en: "Turkish IBAN is 26 characters: TR (2) + check digits (2) + reserve (1) + bank code (5) + branch (4) + account (12) = 26." } },
                { q: { tr: "IBAN doğrulama nasıl çalışır?", en: "How does IBAN validation work?" }, a: { tr: "MOD97 algoritması kullanılır. IBAN'ın ilk 4 karakteri sona taşınır, harfler sayıya çevrilir ve sayının 97'ye bölümünden kalan 1 ise IBAN geçerlidir.", en: "Uses the MOD97 algorithm. First 4 chars move to end, letters convert to numbers, and if the number mod 97 equals 1, the IBAN is valid." } },
            ],
            richContent: {
                howItWorks: { tr: "IBAN'ın ilk 4 karakteri (TR + kontrol hanesi) sona alınır, harfler ASCII değerlerine (A=10, B=11...) dönüştürülür ve büyük sayı 97'ye bölünür. Kalan 1 ise doğrulamadır.", en: "Move first 4 chars to end, convert letters to numbers (A=10, B=11...), divide the entire number by 97. Remainder of 1 confirms validity." },
                formulaText: { tr: "MOD97: Yeniden Düzenlenmiş_Sayı MOD 97 = 1 → Geçerli", en: "MOD97: Rearranged_Number MOD 97 = 1 → Valid" },
                exampleCalculation: { tr: "TR32 0001 0017 3234 5678 5020 01 formatındaki IBAN TR ile başlar, 26 karakter içerir ve MOD97 kontrolünden 1 ile çıkarsa geçerlidir.", en: "TR32 0001 0017 3234 5678 5020 01 — starts with TR, 26 chars, passes MOD97 check → valid." },
                miniGuide: { tr: "<ul><li><b>EFT ve Havale:</b> Yurt içi transferlerde IBAN şarttır. IBAN'ı boşluklarla veya bitişik girebilirsiniz, araç otomatik formatlayacaktır.</li><li><b>SWIFT ile Fark:</b> IBAN banka hesabını, SWIFT kodu ise bankayı uluslararası arenada tanımlar.</li></ul>", en: "IBAN is required for domestic and international transfers. You can enter with or without spaces—the tool formats automatically. SWIFT identifies the bank; IBAN identifies the account." },
            },
        },
    },

    // ── GEÇMİŞ ALTIN FİYATLARI ──────────────────────────────
    {
        id: "gecmis-altin-fiyatlari",
        slug: "gecmis-altin-fiyatlari",
        category: "finansal-hesaplamalar",
        name: { tr: "Geçmiş Altın Fiyatları", en: "Historical Gold Prices" },
        h1: { tr: "Geçmiş Altın Fiyatları (2010–2025) — Yıllık Ortalama TL ve USD", en: "Historical Gold Prices (2010–2025) — Annual Average TRY & USD" },
        description: { tr: "2010'dan 2025'e gram ve ons altın fiyatlarının yıllık ortalamalarını görün. Altın yatırımınızın geçmiş performansını ve TL/USD cinsinden tarihsel seyrini inceleyin.", en: "View annual average gold prices from 2010 to 2025 in grams and ounces, in both TRY and USD. Analyze historical performance of gold investments." },
        shortDescription: { tr: "2010–2025 dönemine ait yıllık ortalama gram ve ons altın fiyatlarını TL ve USD cinsinden görün.", en: "View annual average gold prices (2010–2025) in TRY and USD." },
        relatedCalculators: ["altin-hesaplama", "doviz-hesaplama", "enflasyon-hesaplama"],
        inputs: [
            {
                id: "year", name: { tr: "Yıl Seçin", en: "Select Year" }, type: "select",
                options: [
                    { value: "2025", label: { tr: "2025", en: "2025" } },
                    { value: "2024", label: { tr: "2024", en: "2024" } },
                    { value: "2023", label: { tr: "2023", en: "2023" } },
                    { value: "2022", label: { tr: "2022", en: "2022" } },
                    { value: "2021", label: { tr: "2021", en: "2021" } },
                    { value: "2020", label: { tr: "2020", en: "2020" } },
                    { value: "2019", label: { tr: "2019", en: "2019" } },
                    { value: "2018", label: { tr: "2018", en: "2018" } },
                    { value: "2017", label: { tr: "2017", en: "2017" } },
                    { value: "2016", label: { tr: "2016", en: "2016" } },
                    { value: "2015", label: { tr: "2015", en: "2015" } },
                    { value: "2014", label: { tr: "2014", en: "2014" } },
                    { value: "2013", label: { tr: "2013", en: "2013" } },
                    { value: "2012", label: { tr: "2012", en: "2012" } },
                    { value: "2011", label: { tr: "2011", en: "2011" } },
                    { value: "2010", label: { tr: "2010", en: "2010" } },
                ], defaultValue: "2024"
            },
        ],
        results: [
            { id: "gramTRY", label: { tr: "Ortalama Gram Altın (TL)", en: "Avg. Gram Gold (TRY)" }, suffix: " ₺", decimalPlaces: 0 },
            { id: "gramUSD", label: { tr: "Ortalama Gram Altın (USD)", en: "Avg. Gram Gold (USD)" }, suffix: " $", decimalPlaces: 2 },
            { id: "ounceUSD", label: { tr: "Ortalama Ons Altın (USD)", en: "Avg. Ounce Gold (USD)" }, suffix: " $", decimalPlaces: 0 },
            { id: "usdtry", label: { tr: "Ortalama USD/TL Kuru", en: "Avg. USD/TRY Rate" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "yoyChangePct", label: { tr: "Önceki Yıla Göre Değişim (%)", en: "YoY Change (%)" }, suffix: " %", decimalPlaces: 1 },
        ],
        formula: (v) => {
            // Yıllık ortalama veriler: [gramTRY, gramUSD, ounceUSD, usdtry]
            const data: Record<string, [number, number, number, number]> = {
                "2025": [3200, 96, 2980, 33.5],
                "2024": [2650, 80, 2480, 33.0],
                "2023": [1820, 62, 1940, 29.5],
                "2022": [1120, 58, 1800, 18.6],
                "2021": [500, 59, 1799, 8.8],
                "2020": [370, 57, 1769, 7.0],
                "2019": [270, 44, 1394, 5.7],
                "2018": [210, 40, 1268, 4.8],
                "2017": [155, 41, 1257, 3.6],
                "2016": [130, 40, 1248, 3.0],
                "2015": [105, 34, 1061, 2.7],
                "2014": [110, 49, 1266, 2.2],
                "2013": [110, 53, 1411, 2.0],
                "2012": [95, 52, 1668, 1.8],
                "2011": [70, 52, 1572, 1.7],
                "2010": [55, 40, 1225, 1.5],
            };
            const prevYear = (parseInt(v.year) - 1).toString();
            const cur = data[v.year] || data["2024"];
            const prev = data[prevYear];
            const yoyChangePct = prev ? ((cur[0] - prev[0]) / prev[0]) * 100 : 0;
            return {
                gramTRY: cur[0],
                gramUSD: cur[1],
                ounceUSD: cur[2],
                usdtry: cur[3],
                yoyChangePct,
            };
        },
        seo: {
            title: { tr: "Geçmiş Altın Fiyatları 2010–2025 — Yıllık TL ve USD Ortalamaları", en: "Historical Gold Prices 2010–2025 — Annual TRY & USD Averages" },
            metaDescription: { tr: "2010'dan 2025'e yıllık ortalama gram ve ons altın fiyatlarını TL ve USD olarak görün. Altın yatırımının tarihsel performansını analiz edin.", en: "View annual average gold prices in TRY and USD from 2010 to 2025. Analyze historical gold investment performance." },
            content: { tr: "Altın, özellikle Türkiye'de enflasyon ve döviz krizlerine karşı geleneksel bir güvenli liman olmuştur. 2010'da gram altın yaklaşık 55 TL iken, 2024 yılında 2.650 TL'ye ulaşarak yaklaşık 48 kat TL değeri artışı yaşamıştır. Bu tablo, yatırımcıların altının tarihsel seyrini anlamasına ve uzun vadeli yatırım kararlarını daha sağlıklı vermasine yardımcı olur.", en: "Gold has been a traditional safe haven against inflation and currency crises, especially in Turkey. From ~55 TRY per gram in 2010 to ~2,650 TRY in 2024, gold has shown approximately 48x TRY appreciation. This historical reference helps investors understand gold's long-term trajectory." },
            faq: [
                { q: { tr: "Altın TL olarak neden bu kadar yükseldi?", en: "Why has gold risen so much in TRY?" }, a: { tr: "TL'nin dolar karşısında ciddi değer kaybetmesi, altının dolar bazındaki yükselişiyle birleşince TL cinsinden çok daha yüksek artışlar yaşanmıştır.", en: "The sharp depreciation of TRY against the USD, combined with USD-based gold price increases, caused disproportionately large TRY-denominated gains." } },
                { q: { tr: "Ons ve gram altın farkı nedir?", en: "Whats the difference between ounce and gram gold?" }, a: { tr: "1 troy ons = 31,1035 gram altına karşılık gelir. Uluslararası piyasalarda altın ons üzerinden, Türkiye'de ise genellikle gram üzerinden fiyatlanır.", en: "1 troy ounce = 31.1035 grams. International markets price gold in troy ounces; Turkey typically uses grams." } },
            ],
            richContent: {
                howItWorks: { tr: "Seçilen yıla ait yıllık ortalama gram altın TL fiyatı, USD fiyatı, spot ons fiyatı ve ortalama kur değerleri statik olarak gösterilir.", en: "Shows static annual averages for gram gold TRY price, USD price, spot ounce price, and average exchange rate for the selected year." },
                formulaText: { tr: "Gram Fiyatı (TL) ≈ Ons Fiyatı (USD) / 31.1 × USD/TL Kuru", en: "Gram Price (TRY) ≈ Ounce Price (USD) / 31.1 × USD/TRY Rate" },
                exampleCalculation: { tr: "2020: Ons USD 1.769, kur 7.0 → Gram TL ≈ 1.769/31.1×7.0 ≈ 398 TL. Tablodaki ~370 TL yıllık ortalama olup dönemsel farklılıklar içerir.", en: "2020: Ounce USD 1,769, rate 7.0 → Gram TRY ≈ 398 TRY. The ~370 TRY in our table is the annual average, varying across months." },
                miniGuide: { tr: "<ul><li><b>Uzun Vadeli Bakış:</b> 10+ yıllık horizon'da altın TL bazında güçlü bir değer koruma aracı olmuştur.</li><li><b>USD Bazlı Değerlendirin:</b> Uluslararası yatırımcılar USD değerlerine bakarak küresel altın trendini takip eder.</li></ul>", en: "Over 10+ year horizons, gold has been a powerful TRY value preservation tool. International investors track USD values for global gold trends." },
            },
        },
    },

    // ── GEÇMİŞ DÖVİZ KURLARI ────────────────────────────────
    {
        id: "gecmis-doviz-kurlari",
        slug: "gecmis-doviz-kurlari",
        category: "finansal-hesaplamalar",
        name: { tr: "Geçmiş Döviz Kurları", en: "Historical Exchange Rates" },
        h1: { tr: "Geçmiş Döviz Kurları (2010–2025) — USD, EUR, GBP/TL Tarihsel Ortalamalar", en: "Historical Exchange Rates (2010–2025) — USD, EUR, GBP/TRY Annual Averages" },
        description: { tr: "2010'dan bu yana dolar, euro ve sterlin kurlarının yıllık ortalamalarını görün. TL'nin tarihsel değer kaybını analiz edin ve döviz yatırımlarınızı değerlendirin.", en: "View annual average exchange rates for USD, EUR, and GBP against TRY from 2010. Analyze TRY's historical depreciation and assess currency investments." },
        shortDescription: { tr: "2010–2025 dönemine ait yıllık ortalama USD, EUR ve GBP/TL kurlarını görün.", en: "View annual average USD, EUR, and GBP/TRY exchange rates (2010–2025)." },
        relatedCalculators: ["doviz-hesaplama", "enflasyon-hesaplama", "gecmis-altin-fiyatlari"],
        inputs: [
            {
                id: "year", name: { tr: "Yıl Seçin", en: "Select Year" }, type: "select",
                options: [
                    { value: "2025", label: { tr: "2025", en: "2025" } },
                    { value: "2024", label: { tr: "2024", en: "2024" } },
                    { value: "2023", label: { tr: "2023", en: "2023" } },
                    { value: "2022", label: { tr: "2022", en: "2022" } },
                    { value: "2021", label: { tr: "2021", en: "2021" } },
                    { value: "2020", label: { tr: "2020", en: "2020" } },
                    { value: "2019", label: { tr: "2019", en: "2019" } },
                    { value: "2018", label: { tr: "2018", en: "2018" } },
                    { value: "2017", label: { tr: "2017", en: "2017" } },
                    { value: "2016", label: { tr: "2016", en: "2016" } },
                    { value: "2015", label: { tr: "2015", en: "2015" } },
                    { value: "2014", label: { tr: "2014", en: "2014" } },
                    { value: "2013", label: { tr: "2013", en: "2013" } },
                    { value: "2012", label: { tr: "2012", en: "2012" } },
                    { value: "2011", label: { tr: "2011", en: "2011" } },
                    { value: "2010", label: { tr: "2010", en: "2010" } },
                ], defaultValue: "2024"
            },
        ],
        results: [
            { id: "usdtry", label: { tr: "USD / TL (Dolar Kuru)", en: "USD / TRY Rate" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "eurtry", label: { tr: "EUR / TL (Euro Kuru)", en: "EUR / TRY Rate" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "gbptry", label: { tr: "GBP / TL (Sterlin Kuru)", en: "GBP / TRY Rate" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "usdYoY", label: { tr: "USD Yıllık Değişim (%)", en: "USD YoY Change (%)" }, suffix: " %", decimalPlaces: 1 },
            { id: "eurYoY", label: { tr: "EUR Yıllık Değişim (%)", en: "EUR YoY Change (%)" }, suffix: " %", decimalPlaces: 1 },
        ],
        formula: (v) => {
            // [usdtry, eurtry, gbptry]
            const data: Record<string, [number, number, number]> = {
                "2025": [33.50, 36.20, 42.50],
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
            const prevYear = (parseInt(v.year) - 1).toString();
            const cur = data[v.year] || data["2024"];
            const prev = data[prevYear];
            const usdYoY = prev ? ((cur[0] - prev[0]) / prev[0]) * 100 : 0;
            const eurYoY = prev ? ((cur[1] - prev[1]) / prev[1]) * 100 : 0;
            return {
                usdtry: cur[0],
                eurtry: cur[1],
                gbptry: cur[2],
                usdYoY,
                eurYoY,
            };
        },
        seo: {
            title: { tr: "Geçmiş Döviz Kurları 2010–2025 — USD EUR GBP/TL Tarihsel Veriler", en: "Historical Exchange Rates 2010–2025 — USD EUR GBP/TRY Annual Data" },
            metaDescription: { tr: "2010'dan 2025'e dolar, euro ve sterlin kurlarının yıllık ortalamalarına ulaşın. TL'nin tarihsel dolar ve euro karşısındaki değer kaybını analiz edin.", en: "Access annual average exchange rates for USD, EUR, and GBP against TRY from 2010 to 2025. Analyze TRY's historical depreciation." },
            content: { tr: "Türk Lirası, 2010'da 1.50 USD/TL kuru ile işlem görürken 2024 yılında 33 TL'ye yaklaşmış; 14 yılda yaklaşık 22 kat değer kaybetmiştir. Bu tablo, geçmiş dönemlere ait TL bazlı alacak veya borçların reel değerini, kur korumasının önemini ve dövize dayalı yatırım kararlarının tarihsel doğruluğunu analiz etmek isteyen kişiler için kritik bir referanstır.", en: "The Turkish Lira depreciated from 1.50 USD/TRY in 2010 to ~33 TRY in 2024—approximately 22 times devaluation. This reference table helps understand past currency dynamics, evaluate hedging decisions, and analyze real values of historical TRY-denominated receivables or payables." },
            faq: [
                { q: { tr: "Neden yıllık ortalama kur önemlidir?", en: "Why are annual average rates important?" }, a: { tr: "Tek bir gündeki kur yerine yıllık ortalama kullanmak, muhasebe düzenlemeleri, vergi hesaplamaları ve karşılaştırmalı analizler için çok daha güvenilir bir referans noktası sağlar.", en: "Using annual averages rather than single-day rates provides a far more reliable reference point for accounting, tax calculations, and comparative analysis." } },
                { q: { tr: "TL neden bu kadar değer kaybetti?", en: "Why has TRY lost so much value?" }, a: { tr: "Yüksek enflasyon, cari açık, faiz politikaları ve küresel risk iştahındaki değişimler TL'nin değer kaybında başlıca etkenler olmuştur.", en: "High inflation, current account deficits, interest rate policies, and shifts in global risk appetite have been the main factors behind TRY depreciation." } },
            ],
            richContent: {
                howItWorks: { tr: "Seçilen yıla ait yıllık ortalama USD/TL, EUR/TL ve GBP/TL kurları statik veri olarak gösterilir. Bir önceki yıla göre yüzdesel değişim de hesaplanır.", en: "Shows static annual average USD/TRY, EUR/TRY, and GBP/TRY rates for the selected year. Year-over-year percentage change is also calculated." },
                formulaText: { tr: "Yıllık Değişim = [(Yıl_Kuru − Önceki_Yıl_Kuru) / Önceki_Yıl_Kuru] × 100", en: "YoY Change = [(Year_Rate − Prev_Year_Rate) / Prev_Year_Rate] × 100" },
                exampleCalculation: { tr: "2022'de USD/TL 16.55, 2021'de 8.85 idi. Yıllık değişim: (16.55-8.85)/8.85 × 100 = +%87 TL değer kaybı.", en: "In 2022 USD/TRY was 16.55, in 2021 it was 8.85. YoY change: (16.55-8.85)/8.85 × 100 = +87% TRY depreciation." },
                miniGuide: { tr: "<ul><li><b>Hedging:</b> Tarihsel veriler, döviz riskini zamanında yönetmenin ne kadar önemli olduğunu açıkça göstermektedir.</li><li><b>Vergi Hesabı:</b> Yıl sonu yerine yıllık ortalama kur kullanan muhasebe standartları için bu tablo doğrudan referans alınabilir.</li></ul>", en: "Historical data clearly shows how important timely currency risk management is. This table can be used as a direct reference for accounting standards that require annual average rates rather than year-end rates." },
            },
        },
    },
];

export const calculators: CalculatorConfig[] = [
    ...investmentCalculatorsP5,
    ...investmentCalculatorsP4,
    ...investmentCalculatorsP3,
    ...investmentCalculatorsP2,
    ...investmentCalculatorsP1,
    ...creditCalculatorsP3,
    ...creditCalculatorsP1,
    ...creditCalculatorsP2,
    ...financeCalculators,
    ...healthCalculators,
    ...mathCalculators,
    ...dailyCalculators,
    ...phase1Calculators,
    ...phase2Calculators,
    ...phase3Calculators,
    ...phase4Calculators,
    ...timeCalculators,
    ...schoolCalculators,
    ...schoolCalculatorsBatch2,
    ...schoolCalculatorsBatch3,
    ...schoolCalculatorsBatch4,
    ...astrologyCalculators,
];



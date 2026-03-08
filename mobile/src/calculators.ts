import {
  calculateBmi,
  calculateLoanPayment,
  calculateVatBreakdown,
  normalizeLoanType,
  type BmiCategory,
  type LoanType,
} from "./sharedCalculations";

export type CalculatorField =
  | {
      id: string;
      label: string;
      type: "number";
      defaultValue: string;
      placeholder?: string;
      suffix?: string;
      hint?: string;
    }
  | {
      id: string;
      label: string;
      type: "select";
      defaultValue: string;
      hint?: string;
      options: Array<{
        label: string;
        value: string;
      }>;
    };

type ResultDefinition = {
  id: string;
  label: string;
  kind: "currency" | "number" | "text";
  decimals?: number;
};

export type CalculatorDefinition = {
  id: string;
  title: string;
  category: string;
  summary: string;
  accentColor: string;
  inputs: CalculatorField[];
  results: ResultDefinition[];
  calculate: (values: Record<string, string>) => Record<string, number | string>;
};

const loanRateGuides: Record<LoanType, string> = {
  tuketici: "Tuketici kredilerinde aylik oranlar genelde daha yuksek seyreder.",
  tasit: "Tasit kredilerinde arac kampanyalariyla oranlar degisebilir.",
  konut: "Konut tarafinda uzun vade avantajli olsa da toplam faiz hizla buyur.",
};

const bmiStatusLabels: Record<BmiCategory, string> = {
  missing: "Boy bilgisi girildiginde sonuc burada gorunur.",
  underweight: "Zayif",
  normal: "Normal",
  overweight: "Fazla Kilolu",
  obese: "Obez",
};

export const calculatorCatalog: CalculatorDefinition[] = [
  {
    id: "vat",
    title: "KDV Hesaplama",
    category: "Finans",
    summary:
      "KDV dahil ya da haric tutari girip matrah, vergi ve toplam rakami aninda gor.",
    accentColor: "#ee6c4d",
    inputs: [
      {
        id: "amount",
        label: "Tutar",
        type: "number",
        defaultValue: "1000",
        placeholder: "1000",
        suffix: "TL",
      },
      {
        id: "rate",
        label: "KDV Orani",
        type: "select",
        defaultValue: "20",
        options: [
          { label: "%1", value: "1" },
          { label: "%10", value: "10" },
          { label: "%20", value: "20" },
        ],
      },
      {
        id: "type",
        label: "Hesaplama Turu",
        type: "select",
        defaultValue: "excluded",
        options: [
          { label: "KDV Haric", value: "excluded" },
          { label: "KDV Dahil", value: "included" },
        ],
      },
    ],
    results: [
      {
        id: "baseAmount",
        label: "Matrah",
        kind: "currency",
        decimals: 2,
      },
      {
        id: "vatAmount",
        label: "KDV Tutari",
        kind: "currency",
        decimals: 2,
      },
      {
        id: "totalAmount",
        label: "Toplam Tutar",
        kind: "currency",
        decimals: 2,
      },
    ],
    calculate(values) {
      const { baseAmount, vatAmount, totalAmount } = calculateVatBreakdown({
        amount: values.amount,
        ratePercent: values.rate,
        type: values.type,
      });

      return {
        baseAmount,
        vatAmount,
        totalAmount,
      };
    },
  },
  {
    id: "loan",
    title: "Kredi Taksit",
    category: "Finans",
    summary:
      "Aylik taksit, toplam geri odeme ve faiz maliyetini mobil deneyimde test et.",
    accentColor: "#3d5a80",
    inputs: [
      {
        id: "loanType",
        label: "Kredi Turu",
        type: "select",
        defaultValue: "tuketici",
        options: [
          { label: "Tuketici", value: "tuketici" },
          { label: "Tasit", value: "tasit" },
          { label: "Konut", value: "konut" },
        ],
      },
      {
        id: "amount",
        label: "Kredi Tutari",
        type: "number",
        defaultValue: "50000",
        placeholder: "50000",
        suffix: "TL",
        hint: "Webdeki range alanini mobil MVP icin sayisal girise indirdim.",
      },
      {
        id: "months",
        label: "Vade",
        type: "number",
        defaultValue: "36",
        placeholder: "36",
        suffix: "ay",
      },
      {
        id: "rate",
        label: "Aylik Faiz Orani",
        type: "number",
        defaultValue: "4.99",
        placeholder: "4.99",
        suffix: "%",
      },
    ],
    results: [
      {
        id: "monthly",
        label: "Aylik Taksit",
        kind: "currency",
        decimals: 2,
      },
      {
        id: "totalPayment",
        label: "Toplam Geri Odeme",
        kind: "currency",
        decimals: 2,
      },
      {
        id: "totalInterest",
        label: "Toplam Faiz",
        kind: "currency",
        decimals: 2,
      },
      {
        id: "guidance",
        label: "Kisa Not",
        kind: "text",
      },
    ],
    calculate(values) {
      const loanType = normalizeLoanType(values.loanType);
      const { monthlyPayment, totalPayment, totalInterest } =
        calculateLoanPayment({
          principal: values.amount,
          monthlyRatePercent: values.rate,
          termMonths: values.months,
        });
      const rateValue = Number(values.rate?.replace(",", "."));
      const hasZeroRate = Number.isFinite(rateValue) && rateValue === 0;

      return {
        monthly: monthlyPayment,
        totalPayment,
        totalInterest,
        guidance: hasZeroRate
          ? "Faiz sifir oldugu icin toplam geri odeme sadece anapara uzerinden hesaplandi."
          : loanRateGuides[loanType],
      };
    },
  },
  {
    id: "bmi",
    title: "VKI",
    category: "Saglik",
    summary:
      "Kilo ve boydan beden kitle endeksini hesapla; mobilde temel saglik aracini hizli test et.",
    accentColor: "#2a9d8f",
    inputs: [
      {
        id: "weight",
        label: "Kilo",
        type: "number",
        defaultValue: "70",
        placeholder: "70",
        suffix: "kg",
      },
      {
        id: "height",
        label: "Boy",
        type: "number",
        defaultValue: "175",
        placeholder: "175",
        suffix: "cm",
      },
    ],
    results: [
      {
        id: "bmi",
        label: "VKI Sonucu",
        kind: "number",
        decimals: 1,
      },
      {
        id: "status",
        label: "Durum",
        kind: "text",
      },
    ],
    calculate(values) {
      const { bmi, category } = calculateBmi({
        weightKg: values.weight,
        heightCm: values.height,
      });

      return {
        bmi,
        status: bmiStatusLabels[category],
      };
    },
  },
];

export function createInitialFormState() {
  return calculatorCatalog.reduce<Record<string, Record<string, string>>>(
    (state, calculator) => {
      state[calculator.id] = calculator.inputs.reduce<Record<string, string>>(
        (values, input) => {
          values[input.id] = input.defaultValue;
          return values;
        },
        {}
      );

      return state;
    },
    {}
  );
}

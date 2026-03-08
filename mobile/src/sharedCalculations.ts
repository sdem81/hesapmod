export type VatCalculationType = "excluded" | "included";
export type LoanType = "tuketici" | "tasit" | "konut";
export type BmiCategory =
  | "missing"
  | "underweight"
  | "normal"
  | "overweight"
  | "obese";

export type VatBreakdown = {
  baseAmount: number;
  vatAmount: number;
  totalAmount: number;
};

export type LoanAmortizationRow = {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  remaining: number;
};

export type LoanPaymentSummary = {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  amortizationSchedule: LoanAmortizationRow[];
};

export type BmiCalculationResult = {
  bmi: number;
  category: BmiCategory;
};

export function parseNumericInput(value: unknown, fallback = 0) {
  const normalized = String(value ?? "")
    .trim()
    .replace(",", ".")
    .replace(/[^\d.-]/g, "");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function normalizeVatCalculationType(
  value: unknown
): VatCalculationType {
  return value === "included" ? "included" : "excluded";
}

export function normalizeLoanType(value: unknown): LoanType {
  const normalized = String(value ?? "").trim();

  if (normalized === "tasit" || normalized === "konut") {
    return normalized;
  }

  return "tuketici";
}

export function calculateVatBreakdown(params: {
  amount: unknown;
  ratePercent: unknown;
  type: unknown;
}): VatBreakdown {
  const amount = Math.max(0, parseNumericInput(params.amount));
  const rate = Math.max(0, parseNumericInput(params.ratePercent)) / 100;
  const type = normalizeVatCalculationType(params.type);

  if (type === "included") {
    const baseAmount = rate > 0 ? amount / (1 + rate) : amount;
    const vatAmount = amount - baseAmount;

    return {
      baseAmount,
      vatAmount,
      totalAmount: amount,
    };
  }

  const vatAmount = amount * rate;

  return {
    baseAmount: amount,
    vatAmount,
    totalAmount: amount + vatAmount,
  };
}

export function calculateLoanPayment(params: {
  principal: unknown;
  monthlyRatePercent: unknown;
  termMonths: unknown;
}): LoanPaymentSummary {
  const principal = Math.max(0, parseNumericInput(params.principal));
  const monthlyRate =
    Math.max(0, parseNumericInput(params.monthlyRatePercent)) / 100;
  const termMonths = Math.max(
    1,
    Math.round(parseNumericInput(params.termMonths, 1))
  );

  if (monthlyRate === 0) {
    const monthlyPayment = principal / termMonths;
    const amortizationSchedule = Array.from(
      { length: termMonths },
      (_, index) => {
        const month = index + 1;
        const remaining = Math.max(0, principal - month * monthlyPayment);

        return {
          month,
          payment: monthlyPayment,
          principal: monthlyPayment,
          interest: 0,
          remaining,
        };
      }
    );

    return {
      monthlyPayment,
      totalPayment: principal,
      totalInterest: 0,
      amortizationSchedule,
    };
  }

  const growthFactor = Math.pow(1 + monthlyRate, termMonths);
  const monthlyPayment =
    (principal * monthlyRate * growthFactor) / (growthFactor - 1);
  const totalPayment = monthlyPayment * termMonths;
  const totalInterest = totalPayment - principal;

  const amortizationSchedule: LoanAmortizationRow[] = [];
  let remainingBalance = principal;

  for (let month = 1; month <= termMonths; month += 1) {
    const interest = remainingBalance * monthlyRate;
    const principalPayment = monthlyPayment - interest;
    remainingBalance = Math.max(0, remainingBalance - principalPayment);

    amortizationSchedule.push({
      month,
      payment: monthlyPayment,
      principal: principalPayment,
      interest,
      remaining: remainingBalance,
    });
  }

  return {
    monthlyPayment,
    totalPayment,
    totalInterest,
    amortizationSchedule,
  };
}

export function calculateBmi(params: {
  weightKg: unknown;
  heightCm: unknown;
}): BmiCalculationResult {
  const weightKg = Math.max(0, parseNumericInput(params.weightKg));
  const heightMeters = Math.max(0, parseNumericInput(params.heightCm)) / 100;

  if (!heightMeters) {
    return {
      bmi: 0,
      category: "missing",
    };
  }

  const bmi = weightKg / (heightMeters * heightMeters);

  if (bmi < 18.5) {
    return { bmi, category: "underweight" };
  }

  if (bmi < 25) {
    return { bmi, category: "normal" };
  }

  if (bmi < 30) {
    return { bmi, category: "overweight" };
  }

  return { bmi, category: "obese" };
}

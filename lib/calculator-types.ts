export type LanguageCode = "tr" | "en";

export type LocalizedText = {
    tr: string;
    en: string;
};

export type InputType =
    | "number"
    | "select"
    | "radio"
    | "date"
    | "checkbox"
    | "text"
    | "section"
    | "range";

export interface CalculatorInputOption {
    label: LocalizedText;
    value: any;
}

export interface CalculatorInput {
    id: string;
    name: LocalizedText;
    type: InputType;
    defaultValue?: any;
    placeholder?: LocalizedText;
    min?: number;
    max?: number;
    step?: number;
    options?: CalculatorInputOption[];
    suffix?: string;
    prefix?: string;
    required?: boolean;
    className?: string;
    showWhen?: {
        field: string;
        value: any | any[];
    };
}

export interface CalculatorResult {
    id: string;
    label: LocalizedText;
    type?:
        | "bankRates"
        | "pieChart"
        | "schedule"
        | "text"
        | "number"
        | "growthSchedule"
        | "progress-bar";
    suffix?: string;
    prefix?: string;
    decimalPlaces?: number;
}

export interface CalculatorFaqEntry {
    q: LocalizedText;
    a: LocalizedText;
}

export interface CalculatorSeoRichContent {
    howItWorks: LocalizedText;
    formulaText: LocalizedText;
    exampleCalculation: LocalizedText;
    miniGuide: LocalizedText;
}

export interface CalculatorSeo {
    title: LocalizedText;
    metaDescription: LocalizedText;
    content: LocalizedText;
    faq: CalculatorFaqEntry[];
    richContent?: CalculatorSeoRichContent;
}

export interface CalculatorCatalogEntry {
    id: string;
    slug: string;
    category: string;
    updatedAt?: string;
    name: LocalizedText;
    h1?: LocalizedText;
    description: LocalizedText;
    shortDescription?: LocalizedText;
    relatedCalculators?: string[];
    inputs: CalculatorInput[];
    results: CalculatorResult[];
    seo: CalculatorSeo;
}

export interface CalculatorClientEntry {
    slug: string;
    category: string;
    name: LocalizedText;
    inputs: CalculatorInput[];
    results: CalculatorResult[];
}

export interface CalculatorSearchEntry {
    id: string;
    slug: string;
    category: string;
    name: LocalizedText;
    shortDescription: LocalizedText;
}

export type CalculatorFormula = (values: Record<string, any>) => Record<string, any>;

export interface CalculatorConfig extends CalculatorCatalogEntry {
    formula: CalculatorFormula;
}

export type CalculatorRuntimeMap = Record<string, CalculatorFormula>;

export interface CalculatorRuntimeModule {
    formulas: CalculatorRuntimeMap;
}

export type CalculatorRuntimeLoader = () => Promise<CalculatorRuntimeModule>;

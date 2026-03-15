"use client";

import React, { useMemo, useState } from "react";
import { BookOpenCheck, Calculator, CheckCircle2, GraduationCap, Languages, Sigma, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import { calculateYksScores, yksScoreTypeMeta, yksYearConfigs, type YksScoreType } from "@/lib/yks";
import CollapsibleSection from "./CollapsibleSection";

type PairField = {
    label: string;
    questionCount: number;
    correctId: string;
    wrongId: string;
};

const initialValues = {
    sinav_yili: "2025",
    tytTurkceD: 30,
    tytTurkceY: 5,
    tytSosyalD: 15,
    tytSosyalY: 3,
    tytMatD: 25,
    tytMatY: 2,
    tytFenD: 10,
    tytFenY: 2,
    aytMatD: 0,
    aytMatY: 0,
    aytEdebD: 0,
    aytEdebY: 0,
    aytTar1D: 0,
    aytTar1Y: 0,
    aytCog1D: 0,
    aytCog1Y: 0,
    aytTar2D: 0,
    aytTar2Y: 0,
    aytCog2D: 0,
    aytCog2Y: 0,
    aytFelsefeD: 0,
    aytFelsefeY: 0,
    aytDinD: 0,
    aytDinY: 0,
    aytFizikD: 0,
    aytFizikY: 0,
    aytKimyaD: 0,
    aytKimyaY: 0,
    aytBiyoD: 0,
    aytBiyoY: 0,
    ydtD: 0,
    ydtY: 0,
    diplomaNotu: 80,
    prevPlacement: false,
};

const tytFields: PairField[] = [
    { label: "Türkçe", questionCount: 40, correctId: "tytTurkceD", wrongId: "tytTurkceY" },
    { label: "Sosyal Bilimler", questionCount: 20, correctId: "tytSosyalD", wrongId: "tytSosyalY" },
    { label: "Matematik", questionCount: 40, correctId: "tytMatD", wrongId: "tytMatY" },
    { label: "Fen Bilimleri", questionCount: 20, correctId: "tytFenD", wrongId: "tytFenY" },
];

const scoreTypeSections: Record<Exclude<YksScoreType, "tyt">, { title: string; description: string; fields: PairField[] }[]> = {
    say: [
        {
            title: "AYT Matematik ve Fen",
            description: "SAY puanı için en kritik testleri doldurun.",
            fields: [
                { label: "AYT Matematik", questionCount: 40, correctId: "aytMatD", wrongId: "aytMatY" },
                { label: "Fizik", questionCount: 14, correctId: "aytFizikD", wrongId: "aytFizikY" },
                { label: "Kimya", questionCount: 13, correctId: "aytKimyaD", wrongId: "aytKimyaY" },
                { label: "Biyoloji", questionCount: 13, correctId: "aytBiyoD", wrongId: "aytBiyoY" },
            ],
        },
    ],
    ea: [
        {
            title: "AYT Eşit Ağırlık",
            description: "EA puanı için matematik ve sosyal-1 kombinasyonunu girin.",
            fields: [
                { label: "AYT Matematik", questionCount: 40, correctId: "aytMatD", wrongId: "aytMatY" },
                { label: "Türk Dili ve Edebiyatı", questionCount: 24, correctId: "aytEdebD", wrongId: "aytEdebY" },
                { label: "Tarih-1", questionCount: 10, correctId: "aytTar1D", wrongId: "aytTar1Y" },
                { label: "Coğrafya-1", questionCount: 6, correctId: "aytCog1D", wrongId: "aytCog1Y" },
            ],
        },
    ],
    soz: [
        {
            title: "AYT Sözel Blok",
            description: "SÖZ puanı için edebiyat ve sosyal bilimler testlerini doldurun.",
            fields: [
                { label: "Türk Dili ve Edebiyatı", questionCount: 24, correctId: "aytEdebD", wrongId: "aytEdebY" },
                { label: "Tarih-1", questionCount: 10, correctId: "aytTar1D", wrongId: "aytTar1Y" },
                { label: "Coğrafya-1", questionCount: 6, correctId: "aytCog1D", wrongId: "aytCog1Y" },
                { label: "Tarih-2", questionCount: 11, correctId: "aytTar2D", wrongId: "aytTar2Y" },
                { label: "Coğrafya-2", questionCount: 11, correctId: "aytCog2D", wrongId: "aytCog2Y" },
                { label: "Felsefe Grubu", questionCount: 12, correctId: "aytFelsefeD", wrongId: "aytFelsefeY" },
                { label: "Din Kültürü", questionCount: 6, correctId: "aytDinD", wrongId: "aytDinY" },
            ],
        },
    ],
    dil: [
        {
            title: "YDT Alanı",
            description: "Dil puanı için yalnızca YDT netlerinizi girmeniz yeterlidir.",
            fields: [
                { label: "Yabancı Dil Testi", questionCount: 80, correctId: "ydtD", wrongId: "ydtY" },
            ],
        },
    ],
};

function formatScore(value: number) {
    if (!value) return "—";
    return value.toLocaleString("tr-TR", { minimumFractionDigits: 3, maximumFractionDigits: 3 });
}

function formatNet(value: number) {
    return value.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function NumericField({
    id,
    value,
    onChange,
    max,
    label,
}: {
    id: string;
    value: number;
    onChange: (id: string, value: number) => void;
    max: number;
    label: string;
}) {
    return (
        <label className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
            <input
                id={id}
                type="number"
                inputMode="numeric"
                min={0}
                max={max}
                value={value}
                onChange={(event) => onChange(id, Math.max(0, Math.min(max, Number.parseFloat(event.target.value) || 0)))}
                className="h-11 rounded-xl border border-slate-300 px-3 text-base font-semibold text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15"
            />
        </label>
    );
}

function CompactPairRow({
    field,
    values,
    onChange,
}: {
    field: PairField;
    values: typeof initialValues;
    onChange: (id: string, value: number | boolean | string) => void;
}) {
    const d = values[field.correctId as keyof typeof initialValues] as number;
    const y = values[field.wrongId as keyof typeof initialValues] as number;
    const net = d - y / 4;

    return (
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 px-3 py-2.5 sm:px-4">
            {/* Label */}
            <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-900 leading-tight truncate">{field.label}</p>
                <p className="text-[10px] text-slate-400">{field.questionCount} soru</p>
            </div>

            {/* D / Y inputs */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
                <div className="flex flex-col items-center">
                    <span className="text-[9px] font-semibold uppercase text-emerald-600 mb-0.5">D</span>
                    <input
                        id={field.correctId}
                        type="number"
                        inputMode="numeric"
                        min={0}
                        max={field.questionCount}
                        value={d}
                        onChange={(e) => onChange(field.correctId, Math.max(0, Math.min(field.questionCount, Number.parseFloat(e.target.value) || 0)))}
                        className="w-[60px] h-[44px] rounded-xl border border-slate-300 bg-white text-center text-sm font-semibold text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 sm:w-[70px]"
                    />
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-[9px] font-semibold uppercase text-red-500 mb-0.5">Y</span>
                    <input
                        id={field.wrongId}
                        type="number"
                        inputMode="numeric"
                        min={0}
                        max={field.questionCount}
                        value={y}
                        onChange={(e) => onChange(field.wrongId, Math.max(0, Math.min(field.questionCount, Number.parseFloat(e.target.value) || 0)))}
                        className="w-[60px] h-[44px] rounded-xl border border-slate-300 bg-white text-center text-sm font-semibold text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 sm:w-[70px]"
                    />
                </div>
            </div>

            {/* Auto-net */}
            <div className="flex-shrink-0 text-right min-w-[52px]">
                <p className="text-[10px] text-slate-400 font-medium">Net</p>
                <p className={cn("text-sm font-bold tabular-nums", net > 0 ? "text-blue-700" : "text-slate-400")}>
                    {net > 0 ? formatNet(net) : "—"}
                </p>
            </div>
        </div>
    );
}

export default function YksCalculator({ lang }: { lang: "tr" | "en" }) {
    const [values, setValues] = useState(initialValues);
    const [scoreType, setScoreType] = useState<YksScoreType>("tyt");

    const results = useMemo(() => calculateYksScores(values), [values]);

    const handleChange = (id: string, value: number | boolean | string) => {
        setValues((current) => ({ ...current, [id]: value }));
    };

    const primaryScore = useMemo(() => {
        const map = {
            tyt: {
                title: "TYT yerleştirme puanı",
                raw: results.tytPuan,
                placement: results.yTyt,
                eligible: results.tytEligible,
            },
            say: {
                title: "SAY yerleştirme puanı",
                raw: results.sayPuan,
                placement: results.ySay,
                eligible: results.sayEligible,
            },
            ea: {
                title: "EA yerleştirme puanı",
                raw: results.eaPuan,
                placement: results.yEa,
                eligible: results.eaEligible,
            },
            soz: {
                title: "SÖZ yerleştirme puanı",
                raw: results.sozPuan,
                placement: results.ySoz,
                eligible: results.sozEligible,
            },
            dil: {
                title: "DİL yerleştirme puanı",
                raw: results.dilPuan,
                placement: results.yDil,
                eligible: results.dilEligible,
            },
        } satisfies Record<YksScoreType, { title: string; raw: number; placement: number; eligible: boolean }>;

        return map[scoreType];
    }, [results, scoreType]);

    const secondaryScores = [
        { key: "tyt", label: "TYT", value: results.yTyt, eligible: results.tytEligible },
        { key: "say", label: "SAY", value: results.ySay, eligible: results.sayEligible },
        { key: "ea", label: "EA", value: results.yEa, eligible: results.eaEligible },
        { key: "soz", label: "SÖZ", value: results.ySoz, eligible: results.sozEligible },
        { key: "dil", label: "DİL", value: results.yDil, eligible: results.dilEligible },
    ] satisfies { key: YksScoreType; label: string; value: number; eligible: boolean }[];

    const netHighlights = [
        { label: "TYT toplam net", value: results.tytTotalNet },
        {
            label: scoreType === "say" ? "SAY alan neti" : scoreType === "ea" ? "EA alan neti" : scoreType === "soz" ? "SÖZ alan neti" : scoreType === "dil" ? "YDT neti" : "TYT uygunluğu",
            value: scoreType === "say" ? results.sayAytNet : scoreType === "ea" ? results.eaAytNet : scoreType === "soz" ? results.sozAytNet : scoreType === "dil" ? results.ydtNet : results.tytTotalNet,
        },
        { label: "OBP katkısı", value: results.obpPuani },
    ];

    return (
        <div className="space-y-6">
            <section className="overflow-hidden rounded-[32px] border border-blue-100 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.18),_transparent_42%),linear-gradient(135deg,#eff6ff_0%,#ffffff_45%,#f8fafc_100%)] p-5 shadow-sm sm:p-7">
                <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(260px,0.85fr)] lg:items-end">
                    <div>
                        <h2 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">YKS puanını 2026 için hızlı, şeffaf ve okunabilir biçimde simüle et</h2>
                        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                            20-21 Haziran 2026 YKS öncesinde TYT, AYT, YDT ve OBP etkisini ayrı ayrı gör. Hedeflediğin puan türüne ait alanları doldurarak daha kısa bir akışla ilerle ve kullanılan katsayı setini net biçimde takip et.
                        </p>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                        <div className="rounded-2xl border border-white/80 bg-white/80 p-4 backdrop-blur">
                            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900"><Calculator size={16} className="text-blue-600" /> 4 yanlış 1 doğru</div>
                            <p className="mt-2 text-xs leading-6 text-slate-500">Netler otomatik hesaplanır, manuel dönüştürme gerekmez.</p>
                        </div>
                        <div className="rounded-2xl border border-white/80 bg-white/80 p-4 backdrop-blur">
                            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900"><Target size={16} className="text-blue-600" /> Alan odaklı form</div>
                            <p className="mt-2 text-xs leading-6 text-slate-500">SAY, EA, SÖZ veya DİL seçip gereksiz blokları gizleyebilirsin.</p>
                        </div>
                        <div className="rounded-2xl border border-white/80 bg-white/80 p-4 backdrop-blur">
                            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900"><BookOpenCheck size={16} className="text-blue-600" /> Katsayı seti seçimi</div>
                            <p className="mt-2 text-xs leading-6 text-slate-500">2026 ön izlemede 2025 güncel set, 2024 doğrulanmış set ve 2023 karşılaştırması birlikte sunulur.</p>
                        </div>
                    </div>
                </div>
            </section>

            <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
                <div className="space-y-6">
                    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                        <div className="grid gap-5 lg:grid-cols-[minmax(0,240px)_minmax(0,1fr)]">
                            <div>
                                <label htmlFor="sinav_yili" className="mb-2 block text-sm font-semibold text-slate-700">Simülasyon seti</label>
                                <select
                                    id="sinav_yili"
                                    value={values.sinav_yili}
                                    onChange={(event) => handleChange("sinav_yili", event.target.value)}
                                    className="h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 text-sm font-medium text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15"
                                >
                                    {Object.entries(yksYearConfigs).map(([year, config]) => (
                                        <option key={year} value={year}>{config.label[lang]}</option>
                                    ))}
                                </select>
                                <p className="mt-2 text-xs leading-6 text-slate-500">{results.yearHelperText[lang]}</p>
                            </div>

                            <div>
                                <p className="mb-2 text-sm font-semibold text-slate-700">Hedef puan türü</p>
                                <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                                    {(["tyt", "say", "ea", "soz", "dil"] as YksScoreType[]).map((item) => (
                                        <button
                                            key={item}
                                            type="button"
                                            onClick={() => setScoreType(item)}
                                            className={cn(
                                                "flex h-12 items-center justify-center rounded-2xl border text-sm font-semibold transition",
                                                scoreType === item
                                                    ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                                                    : "border-slate-200 bg-slate-50 text-slate-700 hover:border-blue-200 hover:bg-blue-50"
                                            )}
                                        >
                                            {yksScoreTypeMeta[item][lang]}
                                        </button>
                                    ))}
                                </div>
                                <p className="mt-2 text-xs leading-6 text-slate-500">Seçtiğin puan türüne göre aşağıdaki alanlar sadeleşir. Diğer puan türleri sağdaki özet bölümünde görünmeye devam eder.</p>
                            </div>
                        </div>
                    </section>

                    <CollapsibleSection
                        title="TYT Testleri"
                        description="Tüm puan türlerinin temelini oluşturan TYT netlerinizi girin."
                        isFilled={values.tytTurkceD > 0 || values.tytMatD > 0 || values.tytSosyalD > 0 || values.tytFenD > 0}
                        defaultOpen={true}
                    >
                        {tytFields.map((field) => (
                            <CompactPairRow key={field.correctId} field={field} values={values} onChange={handleChange} />
                        ))}
                    </CollapsibleSection>

                    {scoreType !== "tyt" && scoreTypeSections[scoreType].map((section) => {
                        const sectionFilled = section.fields.some(
                            (f) => (values[f.correctId as keyof typeof initialValues] as number) > 0
                        );
                        return (
                            <CollapsibleSection
                                key={section.title}
                                title={section.title}
                                description={section.description}
                                isFilled={sectionFilled}
                                defaultOpen={false}
                            >
                                {section.fields.map((field) => (
                                    <CompactPairRow key={field.correctId} field={field} values={values} onChange={handleChange} />
                                ))}
                            </CollapsibleSection>
                        );
                    })}

                    <CollapsibleSection
                        title="OBP / Diploma Notu"
                        description="OBP katkısı yerleştirme puanınıza doğrudan eklenir."
                        isFilled={values.diplomaNotu !== 80 || values.prevPlacement}
                        defaultOpen={false}
                    >
                        <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                            <label className="flex flex-col gap-2">
                                <span className="text-sm font-semibold text-slate-700">Diploma notu</span>
                                <input
                                    id="diplomaNotu"
                                    type="number"
                                    min={50}
                                    max={100}
                                    step={0.1}
                                    value={values.diplomaNotu}
                                    onChange={(event) => handleChange("diplomaNotu", Math.max(50, Math.min(100, Number.parseFloat(event.target.value) || 50)))}
                                    className="h-12 rounded-2xl border border-slate-300 px-4 text-base font-semibold text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15"
                                />
                            </label>
                            <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
                                <input
                                    id="prevPlacement"
                                    type="checkbox"
                                    checked={values.prevPlacement}
                                    onChange={(event) => handleChange("prevPlacement", event.target.checked)}
                                    className="mt-1 h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span>
                                    Önceki yıl bir programa yerleştim
                                    <span className="mt-1 block text-xs font-normal leading-6 text-slate-500">İşaretlersen OBP katkısı kırılmış olarak hesaplanır.</span>
                                </span>
                            </label>
                        </div>
                    </CollapsibleSection>
                </div>

                <aside className="space-y-5 lg:sticky lg:top-24">
                    <section className="overflow-hidden rounded-[28px] border border-slate-900 bg-slate-950 text-white shadow-xl">
                        <div className="border-b border-white/10 px-5 py-4">
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-200">Canlı sonuç</p>
                                    <h3 className="mt-2 text-xl font-black tracking-tight">{primaryScore.title}</h3>
                                </div>
                                <div className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/80">
                                    {results.yearLabel[lang]}
                                </div>
                            </div>
                        </div>
                        <div className="space-y-5 px-5 py-5">
                            <div className="rounded-3xl bg-white/5 p-4">
                                <p className="text-xs uppercase tracking-[0.18em] text-white/60">Yerleştirme puanı</p>
                                <p className="mt-2 text-4xl font-black tracking-tight text-white">{formatScore(primaryScore.placement)}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="rounded-2xl bg-white/5 p-4">
                                    <p className="text-xs uppercase tracking-[0.14em] text-white/60">Ham puan</p>
                                    <p className="mt-2 text-2xl font-bold">{formatScore(primaryScore.raw)}</p>
                                </div>
                                <div className="rounded-2xl bg-white/5 p-4">
                                    <p className="text-xs uppercase tracking-[0.14em] text-white/60">OBP katkısı</p>
                                    <p className="mt-2 text-2xl font-bold">{results.obpPuani.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                </div>
                            </div>
                            <div className={cn("rounded-2xl border px-4 py-3 text-sm leading-6", primaryScore.eligible ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-100" : "border-amber-300/30 bg-amber-300/10 text-amber-50")}>
                                <div className="flex items-start gap-2">
                                    {primaryScore.eligible ? <CheckCircle2 size={18} className="mt-0.5 shrink-0" /> : <Target size={18} className="mt-0.5 shrink-0" />}
                                    <p>
                                        {primaryScore.eligible
                                            ? "Bu puan türü için yeterli veri var. Ham ve yerleştirme puanını güvenli şekilde karşılaştırabilirsin."
                                            : "Bu puan türünde sonuç görebilmek için ilgili AYT veya YDT alanlarında en az 0,5 net üretmelisin."}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
                        <h3 className="text-lg font-bold tracking-tight text-slate-900">Net özeti</h3>
                        <div className="mt-4 grid gap-3">
                            {netHighlights.map((item) => (
                                <div key={item.label} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                                    <span className="text-sm font-medium text-slate-600">{item.label}</span>
                                    <span className="text-lg font-bold tracking-tight text-slate-900">{formatNet(item.value)}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
                        <h3 className="text-lg font-bold tracking-tight text-slate-900">Diğer puan türleri</h3>
                        <div className="mt-4 grid grid-cols-2 gap-3">
                            {secondaryScores.map((item) => (
                                <div key={item.key} className={cn("rounded-2xl border px-4 py-3", scoreType === item.key ? "border-blue-200 bg-blue-50" : "border-slate-200 bg-slate-50")}>
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="text-sm font-semibold text-slate-700">{item.label}</span>
                                        <span className={cn("h-2.5 w-2.5 rounded-full", item.eligible ? "bg-emerald-500" : "bg-slate-300")} />
                                    </div>
                                    <p className="mt-2 text-xl font-black tracking-tight text-slate-900">{formatScore(item.value)}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
                        <h3 className="text-lg font-bold tracking-tight text-slate-900">Hızlı notlar</h3>
                        <div className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                            <div className="flex items-start gap-3 rounded-2xl bg-slate-50 px-4 py-3">
                                <GraduationCap size={18} className="mt-0.5 shrink-0 text-blue-600" />
                                <p>TYT puanının oluşması için Türkçe veya Matematik testinden en az 0,5 net gerekir.</p>
                            </div>
                            <div className="flex items-start gap-3 rounded-2xl bg-slate-50 px-4 py-3">
                                <Sigma size={18} className="mt-0.5 shrink-0 text-blue-600" />
                                <p>Ham puan ile yerleştirme puanı aynı şey değildir; OBP yalnızca yerleştirme puanına eklenir.</p>
                            </div>
                            <div className="flex items-start gap-3 rounded-2xl bg-slate-50 px-4 py-3">
                                <Languages size={18} className="mt-0.5 shrink-0 text-blue-600" />
                                <p>DİL puanında YDT netleri kritik olduğu için YDT bölümü boşsa sonuç 0 görünmesi normaldir.</p>
                            </div>
                        </div>
                    </section>
                </aside>
            </div>
        </div>
    );
}

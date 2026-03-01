import React from "react";
import { CalculatorInput } from "@/lib/calculators";
import { cn } from "@/lib/utils";

interface Props {
    inputs: CalculatorInput[];
    values: Record<string, any>;
    onChange: (id: string, value: any) => void;
    lang: "tr" | "en";
}

export default function CalculatorForm({ inputs, values, onChange, lang }: Props) {
    return (
        <div className="animate-scale-in flex flex-wrap -mx-2 gap-y-6">
            {inputs.map((input, idx) => (
                <div
                    key={input.id}
                    className={cn("w-full px-2 flex flex-col gap-2", input.className)}
                >
                    {input.type === "section" ? (
                        <div className="w-full pt-4 pb-1 border-b border-border/50">
                            <h3 className="text-lg sm:text-xl font-bold text-foreground/90 tracking-tight">
                                {input.name[lang]}
                            </h3>
                            {input.placeholder?.[lang] && (
                                <p className="text-sm text-muted-foreground mt-1">{input.placeholder[lang]}</p>
                            )}
                        </div>
                    ) : (
                        <>
                            <label
                                htmlFor={input.id}
                                className="text-sm font-semibold text-muted-foreground flex justify-between"
                            >
                                {input.name[lang]}
                                {input.required && <span className="text-destructive">*</span>}
                            </label>

                            <div className="relative group/input">
                                {input.type === "number" && (
                                    <div className="relative">
                                        {Boolean(input.prefix) && (
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground bg-background pr-2 pointer-events-none z-10">
                                                {input.prefix}
                                            </div>
                                        )}
                                        <input
                                            id={input.id}
                                            type="number"
                                            inputMode="decimal"
                                            value={values[input.id] || ""}
                                            onChange={(e) => onChange(input.id, parseFloat(e.target.value) || 0)}
                                            placeholder={input.placeholder?.[lang]}
                                            min={input.min}
                                            max={input.max}
                                            step={input.step}
                                            className={cn(
                                                "w-full h-12 px-4 rounded-xl border bg-background focus:ring-2 focus:ring-primary/50 outline-none transition-all group-hover/input:border-primary/40 shadow-sm",
                                                input.suffix ? "pr-12" : "",
                                                input.prefix ? "pl-10" : ""
                                            )}
                                        />
                                    </div>
                                )}

                                {input.type === "range" && (
                                    <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
                                        <div className="flex-1 min-w-[200px] h-12 bg-background border rounded-xl px-4 flex items-center shadow-sm group-hover/input:border-primary/40 transition-all cursor-ew-resize">
                                            <input
                                                id={`${input.id}-slider`}
                                                type="range"
                                                min={input.min || 0}
                                                max={input.max || 100}
                                                step={input.step || 1}
                                                value={values[input.id] || input.min || 0}
                                                onChange={(e) => onChange(input.id, parseFloat(e.target.value))}
                                                className="w-full accent-primary h-2 bg-muted rounded-lg appearance-none cursor-ew-resize"
                                            />
                                        </div>
                                        <div className="w-full sm:w-40 md:w-48 flex-shrink-0 relative">
                                            {Boolean(input.prefix) && (
                                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground bg-background pr-1 pointer-events-none z-10">
                                                    {input.prefix}
                                                </div>
                                            )}
                                            <input
                                                id={input.id}
                                                type="number"
                                                min={input.min}
                                                max={input.max}
                                                step={input.step}
                                                value={values[input.id] || ""}
                                                onChange={(e) => onChange(input.id, parseFloat(e.target.value) || 0)}
                                                className={cn(
                                                    "w-full h-12 px-3 text-right font-medium rounded-xl border bg-background focus:ring-2 focus:ring-primary/50 outline-none transition-all shadow-sm",
                                                    input.suffix ? "pr-10" : "",
                                                    input.prefix ? "pl-8 text-left" : "text-right"
                                                )}
                                            />
                                            {Boolean(input.suffix) && (
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground bg-background pl-1 pointer-events-none z-10">
                                                    {input.suffix}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {input.type === "text" && (
                                    <input
                                        id={input.id}
                                        type="text"
                                        value={values[input.id] || ""}
                                        onChange={(e) => onChange(input.id, e.target.value)}
                                        placeholder={input.placeholder?.[lang]}
                                        className={cn(
                                            "w-full h-12 px-4 rounded-xl border bg-background focus:ring-2 focus:ring-primary/50 outline-none transition-all group-hover/input:border-primary/40 shadow-sm",
                                            input.suffix ? "pr-12" : ""
                                        )}
                                    />
                                )}

                                {input.type === "select" && (
                                    <select
                                        id={input.id}
                                        value={values[input.id]}
                                        onChange={(e) => onChange(input.id, e.target.value)}
                                        className="w-full h-12 px-4 rounded-xl border bg-background focus:ring-2 focus:ring-primary/50 outline-none transition-all appearance-none cursor-pointer group-hover/input:border-primary/40 shadow-sm"
                                    >
                                        {input.options?.map((opt) => (
                                            <option key={opt.value} value={opt.value}>
                                                {opt.label[lang]}
                                            </option>
                                        ))}
                                    </select>
                                )}

                                {input.type === "radio" && (
                                    <div className="flex gap-4 items-center h-12">
                                        {input.options?.map((opt) => (
                                            <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name={input.id}
                                                    value={opt.value}
                                                    checked={values[input.id] === opt.value}
                                                    onChange={(e) => onChange(input.id, e.target.value)}
                                                    className="w-4 h-4 text-primary focus:ring-primary/50"
                                                />
                                                <span className="text-sm font-medium">{opt.label[lang]}</span>
                                            </label>
                                        ))}
                                    </div>
                                )}

                                {input.type === "checkbox" && (
                                    <div className="flex items-center gap-3 h-12">
                                        <input
                                            id={input.id}
                                            type="checkbox"
                                            checked={!!values[input.id]}
                                            onChange={(e) => onChange(input.id, e.target.checked)}
                                            className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary/50 shadow-sm"
                                        />
                                        <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                            {input.placeholder?.[lang] || "Aktif"}
                                        </span>
                                    </div>
                                )}

                                {input.type === "date" && (
                                    <input
                                        id={input.id}
                                        type="date"
                                        value={values[input.id] || ""}
                                        onChange={(e) => onChange(input.id, e.target.value)}
                                        min={input.min ? String(input.min) : undefined}
                                        max={input.max ? String(input.max) : undefined}
                                        className="w-full h-12 px-4 rounded-xl border bg-background focus:ring-2 focus:ring-primary/50 outline-none transition-all group-hover/input:border-primary/40 shadow-sm"
                                    />
                                )}

                                {input.suffix && input.type !== "checkbox" && input.type !== "range" && (
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground bg-background pl-2 pointer-events-none">
                                        {input.suffix}
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            ))}
        </div>
    );
}

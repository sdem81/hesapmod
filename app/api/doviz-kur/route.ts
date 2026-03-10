import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// fawazahmed0/currency-api — jsDelivr CDN, CORS açık, günlük güncelleme
// { date: "2026-03-09", usd: { eur: 0.918, try: 38.5, gbp: 0.79, ... } }

export async function GET() {
    try {
        const [primary, fallback] = await Promise.allSettled([
            fetch("https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json", {
                next: { revalidate: 900 },
                headers: { "Accept": "application/json" },
            }).then((r) => r.ok ? r.json() : null),
            fetch("https://latest.currency-api.pages.dev/v1/currencies/usd.json", {
                next: { revalidate: 900 },
                headers: { "Accept": "application/json" },
            }).then((r) => r.ok ? r.json() : null),
        ]);

        const data =
            (primary.status === "fulfilled" && primary.value?.usd) ? primary.value :
            (fallback.status === "fulfilled" && fallback.value?.usd) ? fallback.value :
            null;

        if (!data?.usd) throw new Error("Döviz verisi alınamadı");

        const usdRates: Record<string, number> = data.usd;

        // Sadece desteklenen kurları döndür
        const SUPPORTED = ["try", "eur", "gbp", "chf", "jpy", "cad", "aud", "cny",
                           "sar", "aed", "kwd", "rub", "sek", "nok", "dkk",
                           "inr", "egp", "qar", "bhd", "dzd", "nzd", "huf",
                           "czk", "pln", "ron", "bgn", "hrk", "sek", "mxn", "brl"];

        const rates: Record<string, number> = { usd: 1 };
        for (const code of SUPPORTED) {
            if (usdRates[code] !== undefined) rates[code] = usdRates[code];
        }

        return NextResponse.json(
            { date: data.date, rates, source: "currency-api" },
            {
                headers: {
                    "Cache-Control": "public, s-maxage=900, stale-while-revalidate=1800",
                },
            }
        );
    } catch (err) {
        console.error("[doviz-kur]", err);
        return NextResponse.json(
            { error: "Kur verisi alınamadı" },
            { status: 503, headers: { "Cache-Control": "no-store" } }
        );
    }
}

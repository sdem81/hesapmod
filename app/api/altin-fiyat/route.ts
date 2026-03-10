import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function parsePrice(s: string): number {
    // Turkce sayi formati: "7.349,99" -> 7349.99
    return parseFloat(s.replace(/\./g, "").replace(",", "."));
}

interface ParsedPrices {
    hasAltinAlis: number;
    hasAltinSatis: number;
    ceyrekAlis: number | null;
    ceyrekSatis: number | null;
    ons: number | null;
}

function parseHtml(html: string): ParsedPrices | null {
    // Satir formati: "Has Altin  -0,81  7.349,99  7.427,34"
    // Degisim (group1), Alis (group2), Satis (group3)
    const hasMatch = html.match(/Has\s+Alt[^\d-]*([-\d,]+)\s+([\d.,]+)\s+([\d.,]+)/);
    const ceyrekMatch = html.match(/eyrek\s+Alt[^\d-]*([-\d,]+)\s+([\d.,]+)\s+([\d.,]+)/);
    const onsMatch = html.match(/ONS\s*:?\s*([\d.,]+)/);

    if (!hasMatch) return null;

    const hasAltinAlis = parsePrice(hasMatch[2]);
    const hasAltinSatis = parsePrice(hasMatch[3]);
    if (!hasAltinAlis || hasAltinAlis <= 0) return null;

    return {
        hasAltinAlis,
        hasAltinSatis,
        ceyrekAlis: ceyrekMatch ? parsePrice(ceyrekMatch[2]) : null,
        ceyrekSatis: ceyrekMatch ? parsePrice(ceyrekMatch[3]) : null,
        ons: onsMatch ? parsePrice(onsMatch[1]) : null,
    };
}

export async function GET() {
    try {
        const res = await fetch("https://www.altinkaynak.com/Altin/Fiyat", {
            next: { revalidate: 900 },
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
                Accept: "text/html,application/xhtml+xml",
                "Accept-Language": "tr-TR,tr;q=0.9",
                Referer: "https://www.altinkaynak.com/",
            },
        });

        if (!res.ok) throw new Error(`altinkaynak: ${res.status}`);
        const html = await res.text();
        const prices = parseHtml(html);
        if (!prices) throw new Error("parse failed");

        const mid = Math.round((prices.hasAltinAlis + prices.hasAltinSatis) / 2);

        return NextResponse.json(
            {
                gramPrice24k: prices.hasAltinAlis,
                hasAltinAlis: prices.hasAltinAlis,
                hasAltinSatis: prices.hasAltinSatis,
                ceyrekAlis: prices.ceyrekAlis,
                ceyrekSatis: prices.ceyrekSatis,
                ons: prices.ons,
                tryPerOz: prices.ons ?? Math.round(mid * 31.1034768),
                updatedAt: new Date().toISOString(),
                source: "altinkaynak.com",
            },
            {
                headers: {
                    "Cache-Control": "public, s-maxage=900, stale-while-revalidate=1800",
                },
            }
        );
    } catch (err) {
        console.error("[altin-fiyat] altinkaynak hatasi:", err);
        return NextResponse.json(
            { error: "Canli fiyat alinamadi" },
            { status: 503, headers: { "Cache-Control": "no-store" } }
        );
    }
}
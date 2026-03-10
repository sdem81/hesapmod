import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const PRIMARY_HOST = "www.hesapmod.com";
const BARE_HOST = "hesapmod.com";

// Exact-path redirects (checked first, highest specificity)
const PATH_REDIRECTS: Record<string, string> = {
    "/gunluk/yakit-tuketim-maliyet": "/tasit-ve-vergi/yakit-tuketim-maliyet",
    "/sinav-hesaplamalari/takdir-tessekur-hesaplama": "/sinav-hesaplamalari/takdir-tesekkur-hesaplama",
    // Specific /gunluk/* paths that map to non-yasam categories
    "/gunluk/birim-donusturucu": "/zaman-hesaplama/birim-donusturucu",
    "/gunluk/hiz-mesafe-sure": "/tasit-ve-vergi/hiz-mesafe-sure",
    "/gunluk/yas-hesaplama": "/zaman-hesaplama/yas-hesaplama",
    // Old /kategori/* aliases (handled as exact-path to avoid prefix collisions)
    "/kategori/finans": "/kategori/finansal-hesaplamalar",
    "/kategori/finans-hesaplama": "/kategori/finansal-hesaplamalar",
    "/kategori/matematik": "/kategori/matematik-hesaplama",
    "/kategori/saglik": "/kategori/yasam-hesaplama",
    "/kategori/gunluk": "/kategori/yasam-hesaplama",
};

// Prefix-based redirects (old category slugs → canonical ones)
// Checked in order; first match wins.
const PREFIX_REDIRECTS: Array<[string, string]> = [
    ["/finans/", "/finansal-hesaplamalar/"],
    ["/matematik/", "/matematik-hesaplama/"],
    ["/saglik/", "/yasam-hesaplama/"],
    ["/gunluk/", "/yasam-hesaplama/"],
    ["/zaman-hesaplamalari/", "/zaman-hesaplama/"],
];

export function middleware(request: NextRequest) {
    const hostname = request.nextUrl.hostname;

    // Localhost veya Vercel preview ortamlarında yönlendirmeyi atlamak için
    if (hostname.includes("localhost") || hostname.includes("vercel.app")) {
        return NextResponse.next();
    }

    const redirectUrl = request.nextUrl.clone();
    let shouldRedirect = false;

    // BARE_HOST kontrolü (www yoksa)
    if (hostname === BARE_HOST) {
        redirectUrl.protocol = "https:";
        redirectUrl.hostname = PRIMARY_HOST;
        shouldRedirect = true;
    }

    // Exact-path redirects
    const redirectedPath = PATH_REDIRECTS[redirectUrl.pathname];
    if (redirectedPath) {
        redirectUrl.pathname = redirectedPath;
        shouldRedirect = true;
    }

    // Prefix-based redirects (only when no exact match already applied)
    if (!redirectedPath) {
        for (const [prefix, replacement] of PREFIX_REDIRECTS) {
            if (redirectUrl.pathname === prefix.replace(/\/$/, "") || redirectUrl.pathname.startsWith(prefix)) {
                redirectUrl.pathname = redirectUrl.pathname.replace(prefix.replace(/\/$/, ""), replacement.replace(/\/$/, ""));
                shouldRedirect = true;
                break;
            }
        }
    }

    if (shouldRedirect) {
        return NextResponse.redirect(redirectUrl, 308);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
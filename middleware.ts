import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const PRIMARY_HOST = "www.hesapmod.com";
const BARE_HOST = "hesapmod.com";

// Highest-specificity legacy redirects.
const PATH_REDIRECTS: Record<string, string> = {
    "/gunluk/yakit-tuketim-maliyet": "/tasit-ve-vergi/yakit-tuketim-maliyet",
    "/sinav-hesaplamalari/takdir-tessekur-hesaplama": "/sinav-hesaplamalari/takdir-tesekkur-hesaplama",
    "/gunluk/birim-donusturucu": "/zaman-hesaplama/birim-donusturucu",
    "/gunluk/hiz-mesafe-sure": "/tasit-ve-vergi/hiz-mesafe-sure",
    "/gunluk/yas-hesaplama": "/zaman-hesaplama/yas-hesaplama",
    "/kategori/finans": "/kategori/finansal-hesaplamalar",
    "/kategori/finans-hesaplama": "/kategori/finansal-hesaplamalar",
    "/kategori/matematik": "/kategori/matematik-hesaplama",
    "/kategori/saglik": "/kategori/yasam-hesaplama",
    "/kategori/gunluk": "/kategori/yasam-hesaplama",
};

const PREFIX_REDIRECTS: Array<[string, string]> = [
    ["/finans/", "/finansal-hesaplamalar/"],
    ["/matematik/", "/matematik-hesaplama/"],
    ["/saglik/", "/yasam-hesaplama/"],
    ["/gunluk/", "/tasit-ve-vergi/"],
    ["/zaman-hesaplamalari/", "/zaman-hesaplama/"],
];

export function middleware(request: NextRequest) {
    const host = request.headers.get("host") || request.nextUrl.hostname;
    const hostname = request.nextUrl.hostname;

    if (hostname.includes("localhost") || hostname.includes("vercel.app")) {
        return NextResponse.next();
    }

    const redirectUrl = request.nextUrl.clone();
    let shouldRedirect = false;

    if (host === BARE_HOST || host === `${BARE_HOST}:80` || host === `${BARE_HOST}:443`) {
        redirectUrl.protocol = "https:";
        redirectUrl.hostname = PRIMARY_HOST;
        shouldRedirect = true;
    }

    const exactRedirect = PATH_REDIRECTS[redirectUrl.pathname];
    if (exactRedirect) {
        redirectUrl.pathname = exactRedirect;
        shouldRedirect = true;
    }

    if (!exactRedirect) {
        for (const [prefix, replacement] of PREFIX_REDIRECTS) {
            const barePrefix = prefix.replace(/\/$/, "");
            const bareReplacement = replacement.replace(/\/$/, "");

            if (redirectUrl.pathname === barePrefix || redirectUrl.pathname.startsWith(prefix)) {
                redirectUrl.pathname = redirectUrl.pathname.replace(barePrefix, bareReplacement);
                shouldRedirect = true;
                break;
            }
        }
    }

    if (shouldRedirect) {
        return NextResponse.redirect(redirectUrl, 301);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

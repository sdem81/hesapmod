import type { SitemapEntry } from "./sitemap-data";
import { SITE_URL } from "./site";

export const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";
const INDEXNOW_KEY_PATTERN = /^[A-Za-z0-9-]{8,128}$/;
const INDEXNOW_BATCH_SIZE = 10_000;

export const PRIORITY_INDEXNOW_PATHS = [
    "/sinav-hesaplamalari/yks-puan-hesaplama",
    "/sinav-hesaplamalari/lgs-puan-hesaplama",
    "/maas-ve-vergi/asgari-ucret-hesaplama",
    "/yasam-hesaplama/gebelik-hesaplama",
    "/finansal-hesaplamalar/kredi-karti-asgari-odeme",
    "/matematik-hesaplama/yuzde-hesaplama",
    "/finansal-hesaplamalar/altin-hesaplama",
    "/ticaret-ve-is/tapu-harci-hesaplama",
    "/maas-ve-vergi/gelir-vergisi-hesaplama",
    "/zaman-hesaplama/yas-hesaplama",
] as const;

type Logger = Pick<Console, "log" | "warn" | "error">;

export type IndexNowSubmissionResult = {
    submittedUrlCount: number;
    batches: number;
    success: boolean;
};

function chunk<T>(items: T[], size: number) {
    const chunks: T[][] = [];

    for (let index = 0; index < items.length; index += size) {
        chunks.push(items.slice(index, index + size));
    }

    return chunks;
}

export function getIndexNowKeyFromEnv(env: NodeJS.ProcessEnv = process.env) {
    const rawKey = env.INDEXNOW_KEY?.trim();

    if (!rawKey) {
        return null;
    }

    if (!INDEXNOW_KEY_PATTERN.test(rawKey)) {
        throw new Error(
            "INDEXNOW_KEY gecersiz gorunuyor. Anahtar 8-128 karakter uzunlugunda olmali ve yalnizca harf, rakam veya '-' icermelidir."
        );
    }

    return rawKey;
}

export function getIndexNowKeyFileName(key: string) {
    return `${key}.txt`;
}

export function getIndexNowKeyLocation(key: string) {
    return `${SITE_URL}/${getIndexNowKeyFileName(key)}`;
}

export function getPriorityIndexNowUrls() {
    return PRIORITY_INDEXNOW_PATHS.map((path) => `${SITE_URL}${path}`);
}

export function buildIndexNowUrlList(entries: Pick<SitemapEntry, "url">[]) {
    return Array.from(
        new Set([
            ...getPriorityIndexNowUrls(),
            ...entries.map((entry) => entry.url).filter((url) => url.startsWith(SITE_URL)),
        ])
    );
}

export async function submitIndexNowUrls(
    urls: string[],
    {
        key,
        endpoint = INDEXNOW_ENDPOINT,
        logger = console,
        fetchImpl = fetch,
    }: {
        key: string;
        endpoint?: string;
        logger?: Logger;
        fetchImpl?: typeof fetch;
    }
): Promise<IndexNowSubmissionResult> {
    if (urls.length === 0) {
        logger.log("IndexNow: gonderilecek URL bulunamadi.");
        return { submittedUrlCount: 0, batches: 0, success: true };
    }

    const batches = chunk(urls, INDEXNOW_BATCH_SIZE);
    const host = new URL(SITE_URL).host;
    const keyLocation = getIndexNowKeyLocation(key);
    let success = true;

    for (let batchIndex = 0; batchIndex < batches.length; batchIndex += 1) {
        const batchUrls = batches[batchIndex];
        try {
            const response = await fetchImpl(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                },
                body: JSON.stringify({
                    host,
                    key,
                    keyLocation,
                    urlList: batchUrls,
                }),
            });

            if (!response.ok) {
                success = false;
                const responseText = await response.text();
                logger.error(
                    `IndexNow istegi basarisiz oldu (batch ${batchIndex + 1}/${batches.length}, status ${response.status}).`
                );
                logger.error(responseText);
                continue;
            }

            logger.log(
                `IndexNow batch ${batchIndex + 1}/${batches.length} basarili: ${batchUrls.length} URL bildirildi.`
            );
        } catch (error) {
            success = false;
            logger.error(`IndexNow istegi sirasinda hata olustu (batch ${batchIndex + 1}/${batches.length}).`);
            logger.error(error);
        }
    }

    return {
        submittedUrlCount: urls.length,
        batches: batches.length,
        success,
    };
}

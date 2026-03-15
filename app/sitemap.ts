import type { MetadataRoute } from "next";
import { buildSitemapEntries } from "@/lib/sitemap-data";

export const revalidate = 86400;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const entries = buildSitemapEntries();

    return entries.map((entry) => ({
        url: entry.url,
        lastModified: entry.lastModified,
        changeFrequency: entry.changeFrequency,
        priority: entry.priority,
    }));
}

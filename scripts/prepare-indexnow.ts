import { loadEnvConfig } from "@next/env";
import { promises as fs } from "node:fs";
import path from "node:path";
import { getIndexNowKeyFileName, getIndexNowKeyFromEnv } from "../lib/indexnow";

const rootDir = process.cwd();
const publicDir = path.join(rootDir, "public");
const tmpDir = path.join(rootDir, "tmp");
const manifestPath = path.join(tmpDir, "indexnow-generated-key.json");

async function removeFileIfExists(filePath: string) {
    try {
        await fs.unlink(filePath);
    } catch (error) {
        const nodeError = error as NodeJS.ErrnoException;
        if (nodeError.code !== "ENOENT") {
            throw error;
        }
    }
}

async function readPreviousKey() {
    try {
        const raw = await fs.readFile(manifestPath, "utf8");
        const parsed = JSON.parse(raw) as { key?: string };
        return parsed.key?.trim() || null;
    } catch (error) {
        const nodeError = error as NodeJS.ErrnoException;
        if (nodeError.code === "ENOENT") {
            return null;
        }

        throw error;
    }
}

async function writeManifest(key: string | null) {
    await fs.mkdir(tmpDir, { recursive: true });

    if (!key) {
        await removeFileIfExists(manifestPath);
        return;
    }

    await fs.writeFile(manifestPath, JSON.stringify({ key }, null, 2), "utf8");
}

async function main() {
    loadEnvConfig(rootDir);

    const previousKey = await readPreviousKey();
    const currentKey = getIndexNowKeyFromEnv(process.env);

    await fs.mkdir(publicDir, { recursive: true });

    if (previousKey && previousKey !== currentKey) {
        await removeFileIfExists(path.join(publicDir, getIndexNowKeyFileName(previousKey)));
    }

    if (!currentKey) {
        console.log("IndexNow hazirlik: INDEXNOW_KEY tanimli degil, dogrulama dosyasi olusturulmadi.");
        await writeManifest(null);
        return;
    }

    const targetPath = path.join(publicDir, getIndexNowKeyFileName(currentKey));
    await fs.writeFile(targetPath, currentKey, "utf8");
    await writeManifest(currentKey);

    console.log(`IndexNow hazirlik: ${path.basename(targetPath)} dogrulama dosyasi guncellendi.`);
}

void main().catch((error) => {
    console.error("IndexNow hazirlik adimi basarisiz oldu.");
    console.error(error);
    process.exitCode = 1;
});

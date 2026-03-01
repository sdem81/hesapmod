import { NextResponse } from "next/server";
import { google } from "googleapis";

export async function POST(request: Request) {
    try {
        const url = new URL(request.url);
        const secret = url.searchParams.get("secret");
        const slug = url.searchParams.get("slug");
        const category = url.searchParams.get("category");

        // Basic security check (Optional but highly recommended)
        if (secret !== process.env.INDEXING_API_SECRET) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (!slug || !category) {
            return NextResponse.json({ error: "Missing slug or category parameter" }, { status: 400 });
        }


        const targetUrl = `https://hesapmod.com/${category}/${slug}`;

        // Get Service Account Credentials from .env
        const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
        const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

        if (!clientEmail || !privateKey) {
            return NextResponse.json({ error: "Google credentials not configured" }, { status: 500 });
        }

        // Initialize JWT Auth client
        const jwtClient = new google.auth.JWT({
            email: clientEmail,
            key: privateKey,
            scopes: ["https://www.googleapis.com/auth/indexing"],
        });

        // Authorize
        await jwtClient.authorize();

        // Initialize Indexing API
        const indexing = google.indexing({
            version: "v3",
            auth: jwtClient,
        });

        // Prepare request body
        const res = await indexing.urlNotifications.publish({
            requestBody: {
                url: targetUrl,
                type: "URL_UPDATED", // Use "URL_DELETED" if you are removing a page
            },
        });

        return NextResponse.json({
            success: true,
            message: `Successfully requested indexing for ${targetUrl}`,
            googleResponse: res.data
        });

    } catch (error: any) {
        console.error("Indexing API Error:", error);
        return NextResponse.json({
            success: false,
            error: "Failed to request indexing",
            details: error.message
        }, { status: 500 });
    }
}

// Kolay tarayıcı testi için GET isteğini de POST'a yönlendiriyoruz
export async function GET(request: Request) {
    return POST(request);
}

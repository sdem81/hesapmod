import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "HesapMod — 300+ Ücretsiz Hesaplama Aracı";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: 1200,
                    height: 630,
                    display: "flex",
                    flexDirection: "column",
                    background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)",
                    padding: "80px",
                    fontFamily: "system-ui",
                    position: "relative",
                }}
            >
                {/* Decorative circle */}
                <div
                    style={{
                        position: "absolute",
                        right: 80,
                        top: 60,
                        width: 400,
                        height: 400,
                        borderRadius: "50%",
                        background: "#3b82f6",
                        opacity: 0.08,
                    }}
                />
                {/* Math symbols */}
                <div
                    style={{
                        position: "absolute",
                        right: 160,
                        top: 120,
                        fontSize: 140,
                        color: "#3b82f6",
                        opacity: 0.2,
                    }}
                >
                    ∑
                </div>
                <div
                    style={{
                        position: "absolute",
                        right: 80,
                        bottom: 140,
                        fontSize: 110,
                        color: "#60a5fa",
                        opacity: 0.18,
                    }}
                >
                    √%
                </div>

                {/* Logo */}
                <div style={{ display: "flex", alignItems: "baseline", marginBottom: 16 }}>
                    <span style={{ fontSize: 100, fontWeight: 800, color: "#60a5fa" }}>Hesap</span>
                    <span style={{ fontSize: 100, fontWeight: 800, color: "#ffffff" }}>Mod</span>
                </div>

                {/* Subtitle */}
                <p style={{ fontSize: 30, color: "#94a3b8", margin: 0, fontWeight: 400 }}>
                    300+ Ücretsiz Online Hesaplama Aracı
                </p>
                <p style={{ fontSize: 22, color: "#64748b", marginTop: 12, fontWeight: 300 }}>
                    Finans · Sağlık · Matematik · Günlük Yaşam
                </p>

                {/* Accent bar */}
                <div
                    style={{
                        position: "absolute",
                        bottom: 80,
                        left: 80,
                        width: 160,
                        height: 6,
                        borderRadius: 3,
                        background: "#3b82f6",
                    }}
                />
                <div
                    style={{
                        position: "absolute",
                        bottom: 52,
                        left: 80,
                        fontSize: 20,
                        color: "#475569",
                    }}
                >
                    hesapmod.com
                </div>
            </div>
        ),
        { ...size }
    );
}

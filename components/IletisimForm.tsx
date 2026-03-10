"use client";
import { useState } from "react";
import { CONTACT_RESPONSE_SLA } from "@/lib/contact";

export default function IletisimForm() {
    const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "Bir hata oluştu");

            setSent(true);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Mesaj gönderilemedi. Lütfen sonra tekrar deneyin.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Form */}
            <div className="lg:col-span-3">
                {sent ? (
                    <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 rounded-3xl p-10 text-center animate-in fade-in zoom-in duration-500">
                        <div className="text-5xl mb-4">✅</div>
                        <h2 className="text-2xl font-bold mb-2">Mesajınız Alındı</h2>
                        <p className="text-muted-foreground">Teşekkürler! Mesajınız başarıyla gönderildi. 1-2 iş günü içinde yanıt vereceğiz.</p>
                        <button
                            onClick={() => setSent(false)}
                            className="mt-6 text-sm text-primary font-medium hover:underline"
                        >
                            Yeni mesaj gönder
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6 bg-card border rounded-3xl p-8 shadow-sm">
                        {error && (
                            <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-4 rounded-xl animate-in fade-in slide-in-from-top-2">
                                {error}
                            </div>
                        )}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="contact-name" className="block text-sm font-medium mb-2">Ad Soyad <span className="text-red-500">*</span></label>
                                <input
                                    id="contact-name"
                                    type="text"
                                    required
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    className="w-full h-11 px-4 rounded-xl border bg-background outline-none focus:ring-2 focus:ring-primary transition-all text-sm"
                                    placeholder="Adınız Soyadınız"
                                />
                            </div>
                            <div>
                                <label htmlFor="contact-email" className="block text-sm font-medium mb-2">E-posta <span className="text-red-500">*</span></label>
                                <input
                                    id="contact-email"
                                    type="email"
                                    required
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    className="w-full h-11 px-4 rounded-xl border bg-background outline-none focus:ring-2 focus:ring-primary transition-all text-sm"
                                    placeholder="ornek@mail.com"
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="contact-subject" className="block text-sm font-medium mb-2">Konu</label>
                            <input
                                id="contact-subject"
                                type="text"
                                value={form.subject}
                                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                                className="w-full h-11 px-4 rounded-xl border bg-background outline-none focus:ring-2 focus:ring-primary transition-all text-sm"
                                placeholder="Mesajınızın konusu"
                            />
                        </div>
                        <div>
                            <label htmlFor="contact-message" className="block text-sm font-medium mb-2">Mesaj <span className="text-red-500">*</span></label>
                            <textarea
                                id="contact-message"
                                required
                                rows={6}
                                value={form.message}
                                onChange={(e) => setForm({ ...form, message: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border bg-background outline-none focus:ring-2 focus:ring-primary transition-all text-sm resize-none"
                                placeholder="Mesajınızı buraya yazın..."
                            />
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Bu formu göndererek{" "}
                            <a href="/gizlilik-politikasi" className="text-primary hover:underline">Gizlilik Politikamızı</a>{" "}
                            okuduğunuzu ve kabul ettiğinizi onaylıyorsunuz. (<a href="/kvkk" className="text-primary hover:underline">KVKK Aydınlatma Metni</a>)
                        </p>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></span>
                                    Gönderiliyor...
                                </>
                            ) : "Mesaj Gönder →"}
                        </button>
                    </form>
                )}
            </div>

            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-6">
                <div className="bg-card border rounded-3xl p-6 shadow-sm space-y-5">
                    <h2 className="text-lg font-bold">İletişim Bilgileri</h2>
                    <div className="flex items-start gap-3">
                        <span className="text-xl mt-0.5">📝</span>
                        <div>
                            <p className="text-sm font-medium">İletişim Formu</p>
                            <p className="text-sm text-muted-foreground">Sorularınız, önerileriniz ve hata bildirimleriniz bu form üzerinden doğrudan ekibimize iletilir.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <span className="text-xl mt-0.5">🔒</span>
                        <div>
                            <p className="text-sm font-medium">KVKK / Gizlilik</p>
                            <p className="text-sm text-muted-foreground">Veri ve gizlilik taleplerinizi aynı form üzerinden iletebilirsiniz. Mesajınızı konu alanında belirtmeniz yeterlidir.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <span className="text-xl mt-0.5">⏰</span>
                        <div>
                            <p className="text-sm font-medium">Yanıt Süresi</p>
                            <p className="text-sm text-muted-foreground">{CONTACT_RESPONSE_SLA}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-card border rounded-3xl p-6 shadow-sm space-y-3">
                    <h3 className="text-sm font-bold">Güven ve Kapsam</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        Finansal ve sağlık araçlarımız bilgilendirme amaçlıdır. Hesaplamalar tarayıcı tarafında çalışır; iletişim formu dışında kişisel hesap girdi verileri sunucuya gönderilmez.
                    </p>
                </div>

                <div className="bg-muted/50 border rounded-3xl p-6 space-y-3">
                    <h3 className="text-sm font-bold">Sık Sorulan Konular</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        <li><a href="/sss" className="hover:text-primary transition-colors">→ Hesap makineleri nasıl çalışır?</a></li>
                        <li><a href="/sss" className="hover:text-primary transition-colors">→ Verilerim güvende mi?</a></li>
                        <li><a href="/gizlilik-politikasi" className="hover:text-primary transition-colors">→ Gizlilik Politikası</a></li>
                        <li><a href="/kvkk" className="hover:text-primary transition-colors">→ KVKK Hakları</a></li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

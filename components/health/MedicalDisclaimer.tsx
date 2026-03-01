/**
 * MedicalDisclaimer
 *
 * YMYL (Your Money or Your Life) sayfaları için zorunlu tıbbi sorumluluk reddi.
 * Google E-E-A-T yönergelerine uymak için bu bileşen sağlık kategorisindeki
 * her hesap makinesi sayfasında hesaplama sonucunun hemen altında yer almalıdır.
 *
 * ⚠️  Disclaimer metni yasal gereklilik nedeniyle DEĞİŞTİRİLMEMELİDİR.
 */
export default function MedicalDisclaimer() {
    return (
        <aside
            role="note"
            aria-label="Tıbbi Sorumluluk Reddi"
            className="flex gap-4 rounded-2xl border border-amber-200 bg-amber-50 px-6 py-5 dark:border-amber-800/40 dark:bg-amber-950/30"
        >
            {/* İkon */}
            <div className="mt-0.5 flex-shrink-0 text-amber-600 dark:text-amber-400">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                >
                    <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
            </div>

            {/* İçerik */}
            <div>
                <p className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-1">
                    Tıbbi Sorumluluk Reddi
                </p>
                {/* ⚠️ Bu metin YMYL zorunluluğu gereği sabit tutulmalıdır */}
                <p className="text-sm leading-relaxed text-amber-700 dark:text-amber-400">
                    Bu hesaplama aracı yalnızca{" "}
                    <strong>bilgilendirme amaçlıdır</strong> ve tıbbi tanı
                    yerine geçmez. Sonuçlar{" "}
                    <strong>tahmini</strong> nitelik taşımakta olup kesin
                    değerlendirme için bir{" "}
                    <strong>sağlık profesyoneline</strong> başvurunuz.
                </p>
            </div>
        </aside>
    );
}

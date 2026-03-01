import { Resend } from 'resend';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    try {
        const { name, email, subject, message } = await request.json();

        if (!name || !email || !message) {
            return NextResponse.json({ error: 'Lütfen gerekli alanları doldurun.' }, { status: 400 });
        }

        const { data, error } = await resend.emails.send({
            from: 'HesapMod İletişim <onboarding@resend.dev>',
            to: ['hesapmodcom@gmail.com'],
            subject: subject || 'HesapMod İletişim Formu Mesajı',
            replyTo: email,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #333;">Yeni İletişim Formu Mesajı</h2>
                    <p><strong>Gönderen:</strong> ${name}</p>
                    <p><strong>E-posta:</strong> ${email}</p>
                    <p><strong>Konu:</strong> ${subject || 'Yok'}</p>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                    <p><strong>Mesaj:</strong></p>
                    <p style="white-space: pre-wrap; background: #f9f9f9; padding: 15px; border-radius: 5px;">${message}</p>
                </div>
            `,
        });

        if (error) {
            console.error('Resend Error:', error);
            return NextResponse.json({ error: 'Mesaj gönderilirken bir hata oluştu.' }, { status: 500 });
        }

        return NextResponse.json({ success: true, id: data?.id });

    } catch (error) {
        console.error('Contact API Error:', error);
        return NextResponse.json({ error: 'Sunucu hatası oluştu.' }, { status: 500 });
    }
}

/**
 * Envoi d'emails (réinitialisation mot de passe, alertes newsletter, etc.).
 * Si SMTP n'est pas configuré, l'email est loggé en console (développement).
 */
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const SMTP_FROM = process.env.SMTP_FROM || process.env.SMTP_USER || 'noreply@ong.org';

export async function sendPasswordResetEmail(
  to: string,
  name: string,
  resetUrl: string
): Promise<void> {
  const subject = 'Réinitialisation de votre mot de passe - ONG Impact';
  const html = `
    <p>Bonjour ${name},</p>
    <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
    <p><a href="${resetUrl}" style="display:inline-block;padding:12px 24px;background:#4f46e5;color:#fff;text-decoration:none;border-radius:8px;font-weight:bold;">Réinitialiser mon mot de passe</a></p>
    <p>Ce lien expire dans 1 heure. Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.</p>
    <p>— L'équipe ONG Impact</p>
  `;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    console.log('[Email] SMTP non configuré. Lien de réinitialisation (à copier):');
    console.log(resetUrl);
    return;
  }

  try {
    const nodemailer = await import('nodemailer');
    const transporter = nodemailer.default.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
      tls: { rejectUnauthorized: false } // Souvent nécessaire sur les hébergeurs mutualisés
    });
    await transporter.sendMail({
      from: SMTP_FROM,
      to,
      subject,
      html,
    });
  } catch (err) {
    console.error('[Email] Erreur envoi reset password:', err);
    throw err;
  }
}

export async function sendNewsNotificationEmail(
  to: string,
  postTitle: string,
  postExcerpt: string,
  postUrl: string
): Promise<void> {
  const subject = `Nouveau sur l'ONG Bien Vivre Ici : ${postTitle}`;
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #111827;">
      <h2 style="color: #007D37;">Un nouveau récit d'impact est disponible</h2>
      <p style="font-size: 16px; font-weight: bold;">${postTitle}</p>
      <p style="color: #4b5563; font-style: italic;">"${postExcerpt}"</p>
      <div style="margin-top: 30px;">
        <a href="${postUrl}" style="display:inline-block;padding:14px 28px;background:#007D37;color:#fff;text-decoration:none;border-radius:12px;font-weight:bold;">Lire l'article complet</a>
      </div>
      <hr style="margin-top: 40px; border: 0; border-top: 1px solid #e2e8f0;" />
      <p style="font-size: 12px; color: #9ca3af;">Vous recevez cet email car vous êtes abonné à la newsletter de l'ONG Bien Vivre Ici.</p>
    </div>
  `;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    console.log(`[Email Newsletter] SMTP non configuré. Notification pour: ${postTitle}`);
    return;
  }

  try {
    const nodemailer = await import('nodemailer');
    const transporter = nodemailer.default.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
      tls: { rejectUnauthorized: false }
    });
    await transporter.sendMail({
      from: SMTP_FROM,
      to,
      subject,
      html,
    });
  } catch (err) {
    console.error('[Email Newsletter] Erreur envoi:', err);
  }
}

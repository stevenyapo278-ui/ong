/**
 * Envoi d'emails (réinitialisation mot de passe, etc.).
 * Si SMTP n'est pas configuré, le lien est loggé en console (développement).
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
    });
    await transporter.sendMail({
      from: SMTP_FROM,
      to,
      subject,
      html,
    });
  } catch (err) {
    console.error('[Email] Erreur envoi:', err);
    throw err;
  }
}

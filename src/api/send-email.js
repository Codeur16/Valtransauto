import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.VITE_SENDGRID_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { type, data } = req.body;

  try {
    let msg = {};

    if (type === 'reservation') {
      msg = {
        to: data.email,
        from: 'contact@valtransauto.com',
        subject: 'Confirmation de votre réservation',
        html: `
          <h2>Confirmation de réservation</h2>
          <p>Bonjour ${data.name},</p>
          <p>Votre réservation pour ${data.service} a bien été enregistrée.</p>
          <p><strong>Date :</strong> ${data.date} à ${data.time}</p>
          <p>Nous vous contacterons bientôt pour confirmer votre rendez-vous.</p>
          <p>Cordialement,<br>L'équipe Valtransauto</p>
        `,
      };
    } else if (type === 'contact') {
      msg = {
        to: 'contact@valtransauto.com',
        from: 'noreply@valtransauto.com',
        subject: `Nouveau message de contact: ${data.subject}`,
        html: `
          <h2>Nouveau message de ${data.name}</h2>
          <p><strong>Email :</strong> ${data.email}</p>
          <p><strong>Sujet :</strong> ${data.subject}</p>
          <p><strong>Message :</strong></p>
          <p>${data.message}</p>
        `,
      };
    }

    await sgMail.send(msg);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
}
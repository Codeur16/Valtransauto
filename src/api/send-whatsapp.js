// Ceci est un exemple avec Twilio, à adapter selon votre fournisseur
import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { phone, message } = req.body;

  try {
    // Envoyer le message WhatsApp
    await client.messages.create({
      body: message,
      from: 'whatsapp:+1234567890', // Votre numéro WhatsApp Business
      to: `whatsapp:${phone}`
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    res.status(500).json({ error: 'Failed to send WhatsApp message' });
  }
}
import twilio from 'twilio';

// Configuration de Twilio
const accountSid = process.env.VITE_TWILIO_ACCOUNT_SID;
const authToken = process.env.VITE_TWILIO_AUTH_TOKEN;
const twilioClient = twilio(accountSid, authToken);

export const notificationService = {
  async sendEmailNotification(type, data) {
    let msg = {};

    if (type === 'reservation') {
      msg = {
        to: data.to,
        from: 'contact@valtransauto.com', // Remplacez par votre email vérifié
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
    }
    // Ajoutez d'autres types d'emails ici

    try {
      await sgMail.send(msg);
      console.log('Email envoyé avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email:', error);
      throw error;
    }
  },

  async sendWhatsAppNotification(phone, message) {
    try {
      await twilioClient.messages.create({
        body: message,
        from: process.env.VITE_TWILIO_WHATSAPP_NUMBER,
        to: `whatsapp:${phone}`
      });
      console.log(`Notification WhatsApp envoyée à ${phone}: ${message}`);
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la notification WhatsApp:', error);
      throw error;
    }
  }
};

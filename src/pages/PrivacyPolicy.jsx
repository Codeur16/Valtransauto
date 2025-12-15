import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Home } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PrivacyPolicy() {
  useEffect(() => {
    document.title = 'Politique de confidentialité - VALTRANSAUTO';
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <div className="mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
          >
            <Home className="h-4 w-4 mr-2" />
            Retour à l'accueil
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Politique de confidentialité</h1>
          <p className="text-gray-600">Dernière mise à jour : 10 décembre 2024</p>
        </div>

        <div className="space-y-6 text-gray-700">
          <section>
            <h2 className="text-xl font-semibold mb-3">1. Introduction</h2>
            <p className="mb-4">
              Chez VALTRANSAUTO, nous nous engageons à protéger votre vie privée. Cette politique de confidentialité 
              explique comment nous collectons, utilisons, partageons et protégeons vos informations personnelles.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">2. Données que nous collectons</h2>
            <p className="mb-2">Nous pouvons collecter les types d'informations suivants :</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Informations d'identification (nom, prénom, adresse e-mail, numéro de téléphone)</li>
              <li>Informations sur votre véhicule</li>
              <li>Données de localisation</li>
              <li>Données de navigation et d'utilisation</li>
              <li>Autres informations que vous nous fournissez volontairement</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">3. Comment nous utilisons vos données</h2>
            <p className="mb-2">Vos données sont utilisées pour :</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Fournir et maintenir nos services</li>
              <li>Vous contacter concernant votre compte ou vos demandes</li>
              <li>Améliorer notre site web et nos services</li>
              <li>Vous envoyer des communications marketing (avec votre consentement)</li>
              <li>Respecter nos obligations légales</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">4. Partage de vos données</h2>
            <p className="mb-4">
              Nous ne vendons pas vos données personnelles. Nous pouvons les partager avec :
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Fournisseurs de services qui travaillent en notre nom</li>
              <li>Autorités légales si requis par la loi</li>
              <li>Successeurs éventuels en cas de fusion ou acquisition</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">5. Vos droits</h2>
            <p className="mb-2">Conformément au RGPD, vous avez le droit de :</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Accéder à vos données personnelles</li>
              <li>Demander la rectification de vos données</li>
              <li>Demander l'effacement de vos données</li>
              <li>Vous opposer au traitement de vos données</li>
              <li>Demander la limitation du traitement</li>
              <li>Demander la portabilité de vos données</li>
              <li>Retirer votre consentement à tout moment</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">6. Sécurité des données</h2>
            <p className="mb-4">
              Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles appropriées pour protéger 
              vos données contre tout accès non autorisé, altération, divulgation ou destruction.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">7. Conservation des données</h2>
            <p className="mb-4">
              Nous conservons vos données personnelles aussi longtemps que nécessaire pour les finalités pour lesquelles 
              elles ont été collectées, conformément à nos obligations légales et à notre politique de conservation.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">8. Cookies et technologies similaires</h2>
            <p className="mb-4">
              Notre site utilise des cookies pour améliorer votre expérience. Vous pouvez gérer vos préférences 
              en matière de cookies via les paramètres de votre navigateur.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">9. Modifications de cette politique</h2>
            <p className="mb-4">
              Nous pouvons mettre à jour cette politique de confidentialité de temps à autre. Nous vous conseillons 
              de consulter cette page régulièrement pour prendre connaissance des éventuelles modifications.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">10. Nous contacter</h2>
            <p className="mb-2">Pour toute question concernant cette politique de confidentialité, veuillez nous contacter à :</p>
            <address className="not-italic">
              VALTRANSAUTO<br />
              Adresse: [Votre adresse]<br />
              Email: [votre@email.com]<br />
              Téléphone: [Votre numéro]
            </address>
          </section>
        </div>
      </div>
    </motion.div>
  );
}

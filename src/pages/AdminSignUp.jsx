import { useState, useEffect } from 'react';
import { useUserAuth } from '@/hooks/useUserAuth';
import { useNavigate, Link , Navigate} from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, User, ArrowLeft, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from '@/components/ui/use-toast';

export default function RegisterPage() {
    const { user, logout } = useUserAuth();
  //   if (!user) {
  //   // Rediriger vers la page de connexion avec l'URL de redirection
  //   return <Navigate to="/unauthorized"  />;
  // }
  // useEffect(()=>{
  //   if(!user){
  //     return <Navigate to="/unauthorized"  />;
  //   }
  // })
  const { register } = useUserAuth();
  const navigate = useNavigate();
const [formData, setFormData] = useState({
  email: '',
  password: '',
  confirmPassword: '',
  fullName: '',
  role: 'admin', // par défaut
});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // const handleRegister = async (e) => {
  //   e.preventDefault();
  //   setError('');
    
  //   if (formData.password !== formData.confirmPassword) {
  //     setError('Les mots de passe ne correspondent pas');
  //     return;
  //   }

  //   setLoading(true);

  //   try {
  //     await register(formData.email, formData.password);
  //     toast({
  //       title: 'Inscription réussie !',
  //       description: 'Veuillez vérifier votre email pour confirmer votre compte.',
  //       variant: 'default',
  //     });
  //     navigate('/admin/login');
  //   } catch (err) {
  //     setError(err.message || 'Une erreur est survenue lors de l\'inscription');
  //   } finally {
  //     setLoading(false);
  //   }
  // };
const { createAdmin } = useUserAuth(); // attention à utiliser la fonction complète qui insert dans admin_users

const handleRegister = async (e) => {
  e.preventDefault();
  setError('');

  if (formData.password !== formData.confirmPassword) {
    setError('Les mots de passe ne correspondent pas');
    return;
  }

  setLoading(true);

  try {
    await createAdmin({
      email: formData.email,
      password: formData.password,
      full_name: formData.fullName,
      role: formData.role
    });

    toast({
      title: 'Inscription réussie !',
      description: 'Veuillez vérifier votre email pour confirmer votre compte.',
      variant: 'default',
    });

    navigate('/admin/login');
  } catch (err) {
    // setError(err.message || 'Une erreur est survenue lors de l\'inscription');
    if(err.message === "Invalid login credentials" ){
        setError("Email ou mot de passe incorrect!")
      }
      else if(err.message === "Email not confirmed"){
        setError("Le compte n'est pas confirmé. Veuillez vérifier votre email.")
      }
          else if(err.message.includes("insert or update on table")){
            setError("Cet email existe déja!")
          }
      else{
      setError(err.message)
    }
  } finally {
    setLoading(false);
  }
};

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut'
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: 'easeOut'
      }
    })
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
   
      
      <motion.div 
        initial="hidden"
        animate={isMounted ? "visible" : "hidden"}
        variants={containerVariants}
        className="w-full max-w-md"
      >
        <motion.div 
          className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden"
          whileHover={{ scale: 1.01 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <div className="p-8 ">
            <motion.div variants={itemVariants} custom={0}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="mb-2 -ml-2"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour à l'accueil
              </Button>
              <div className="text-center mb-8">
                <div className="mx-auto w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
                  <User className="h-10 w-10 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">Créer un compte</h1>
                <p className="text-gray-600 mt-2">Rejoignez notre plateforme d'administration</p>
              </div>
            </motion.div>

            {error && (
              <motion.div 
                variants={itemVariants}
                custom={0.2}
                className="mb-6 p-3 bg-red-50 text-red-700 text-sm rounded-md border border-red-100"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleRegister} className="space-y-5">

                 {/* Full Name */}
<motion.div variants={itemVariants} custom={0.2}>
  <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
    Nom complet
  </Label>
  <div className="relative mt-1">
    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
    <Input
      id="fullName"
      name="fullName"
      type="text"
      required
      className="pl-10 h-11 text-base"
      placeholder="Votre nom complet"
      value={formData.fullName}
      onChange={handleChange}
    />
  </div>
</motion.div>

{/* Role */}
<motion.div variants={itemVariants} custom={0.25}>
  <Label htmlFor="role" className="text-sm font-medium text-gray-700">
    Rôle
  </Label>
  <select
    id="role"
    name="role"
    className="mt-1 block w-full h-11 pl-3 pr-10 text-base border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
    value={formData.role}
    onChange={handleChange}
  >
    <option value="admin">Admin</option>
    <option value="SuperAdmin">Super Admin</option>
  </select>
</motion.div>

              <motion.div variants={itemVariants} custom={0.3}>
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Adresse email
                </Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="pl-10 h-11 text-base"
                    placeholder="votre@email.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants} custom={0.4}>
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Mot de passe
                  </Label>
                </div>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    minLength={8}
                    className="pl-10 h-11 text-base"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants} custom={0.5}>
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                  Confirmer le mot de passe
                </Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    minLength={8}
                    className="pl-10 h-11 text-base"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants} custom={0.7} className="pt-2">
                <Button
                  type="submit"
                  className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-base font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Création en cours...
                    </>
                  ) : (
                    'Créer mon compte'
                  )}
                </Button>
              </motion.div>
            </form>

            <motion.div 
              variants={itemVariants}
              custom={0.8}
              className="mt-6 text-center text-sm text-gray-500"
            >
              Vous avez déjà un compte ?{' '}
              <Link 
                to="/admin/login" 
                className="font-medium text-blue-600 hover:text-blue-500 hover:underline"
              >
                Se connecter
              </Link>
            </motion.div>
          </div>
          
          <div className="bg-gray-50 px-8 py-4 text-center border-t border-gray-100">
            <p className="text-xs text-gray-500">
              {new Date().getFullYear()} Valtransauto. Tous droits réservés.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}




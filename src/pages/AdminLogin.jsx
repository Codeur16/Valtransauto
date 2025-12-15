

// import { useState, useEffect } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Mail, Lock, ArrowLeft, Loader2 } from 'lucide-react';
// import { motion } from 'framer-motion';
// import { useUserAuth } from '@/hooks/useUserAuth';
// import { toast } from '@/components/ui/use-toast';

// export default function AdminLogin() {
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//   });
//   const [error, setError] = useState('');
//   const [loading2, setLoading] = useState(false);
//   const { loading, login } = useUserAuth();
//   const [isMounted, setIsMounted] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     setIsMounted(true);
//     return () => setIsMounted(false);
//   }, []);

//   const handleSubmit = async (e) => {
//     setLoading(true)
//     e.preventDefault();
//     setError('');
    
//     try {
//       await login(formData.email, formData.password);
//       toast({
//         title: 'Connexion réussie !',
//         description: 'Redirection en cours...',
//         variant: 'default',
//       });
//       navigate('/admin');
//     } catch (err) {
//       console.error('Login error:', err);
//       // setError('Identifiants invalides. Veuillez réessayer.');
//       if(err.message === "Invalid login credentials" ){
//         setError("Email ou mot de passe incorrect!")
//       }
//       else if(err.message === "Email not confirmed"){
//         setError("Le compte n'est pas confirmé. Veuillez vérifier votre email.")
//       }
//           else if(err.message === `insert or update on table "admin_users" violates foreign key constraint "admin_users_id_fkey`){
//             setError("Cet email existe déja!")
//           }
//       else{
//       setError(err.message)
//     }
//   }finally{
//     setLoading(false)
//   }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const containerVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: {
//         duration: 0.6,
//         ease: 'easeOut'
//       }
//     }
//   };

//   const itemVariants = {
//     hidden: { opacity: 0, y: 10 },
//     visible: (i) => ({
//       opacity: 1,
//       y: 0,
//       transition: {
//         delay: i * 0.1,
//         duration: 0.5,
//         ease: 'easeOut'
//       }
//     })
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
//       <motion.div 
//         initial="hidden"
//         animate={isMounted ? "visible" : "hidden"}
//         variants={containerVariants}
//         className="w-full max-w-md"
//       >
//         <motion.div 
//           className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden"
//           whileHover={{ scale: 1.01 }}
//           transition={{ type: 'spring', stiffness: 300 }}
//         >
//           <div className="p-8">
//             <motion.div variants={itemVariants} custom={0}>
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 onClick={() => navigate('/')}
//                 className="mb-2 -ml-2"
//               >
//                 <ArrowLeft className="h-4 w-4 mr-2" />
//                 Retour à l'accueil
//               </Button>
//               <div className="text-center mb-8">
//                 <div className="mx-auto w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
//                   <Lock className="h-10 w-10 text-white" />
//                 </div>
//                 <h1 className="text-3xl font-bold text-gray-900">Connexion</h1>
//                 <p className="text-gray-600 mt-2">Accédez à votre espace d'administration</p>
//               </div>
//             </motion.div>

//             {error && (
//               <motion.div 
//                 variants={itemVariants}
//                 custom={0.2}
//                 className="mb-6 p-3 bg-red-50 text-red-700 text-sm rounded-md border border-red-100"
//               >
//                 {error}
//               </motion.div>
//             )}

//             <form onSubmit={handleSubmit} className="space-y-5">
//               <motion.div variants={itemVariants} custom={0.3}>
//                 <Label htmlFor="email" className="text-sm font-medium text-gray-700">
//                   Adresse email
//                 </Label>
//                 <div className="relative mt-1">
//                   <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
//                   <Input
//                     id="email"
//                     name="email"
//                     type="email"
//                     autoComplete="email"
//                     required
//                     className="pl-10 h-11 text-base"
//                     placeholder="votre@email.com"
//                     value={formData.email}
//                     onChange={handleChange}
//                   />
//                 </div>
//               </motion.div>

//               <motion.div variants={itemVariants} custom={0.4}>
//                 <div className="flex items-center justify-between">
//                   <Label htmlFor="password" className="text-sm font-medium text-gray-700">
//                     Mot de passe
//                   </Label>
//                   {/* <Link 
//                     to="/forgot-password" 
//                     className="text-xs text-blue-600 hover:text-blue-500 hover:underline"
//                   >
//                     Mot de passe oublié ?
//                   </Link> */}
//                 </div>
//                 <div className="relative mt-1">
//                   <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
//                   <Input
//                     id="password"
//                     name="password"
//                     type="password"
//                     autoComplete="current-password"
//                     required
//                     className="pl-10 h-11 text-base"
//                     placeholder="••••••••"
//                     value={formData.password}
//                     onChange={handleChange}
//                   />
//                 </div>
//               </motion.div>

//               <motion.div variants={itemVariants} custom={0.5} className="flex items-center">
//                 <input
//                   id="remember-me"
//                   name="remember-me"
//                   type="checkbox"
//                   className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                 />
//                 <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
//                   Se souvenir de moi
//                 </label>
//               </motion.div>

//               <motion.div variants={itemVariants} custom={0.6} className="pt-2">
//                 <Button
//                   type="submit"
//                   className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-base font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
//                   disabled={loading2}
//                 >
//                   {loading2 ? (
//                     <>
//                       <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                       Connexion...
//                     </>
//                   ) : (
//                     'Se connecter'
//                   )}
//                 </Button>
//               </motion.div>
//             </form>

//             {/* <motion.div 
//               variants={itemVariants}
//               custom={0.7}
//               className="mt-6 text-center text-sm text-gray-500"
//             >
//               Vous n'avez pas de compte ?{' '}
//               <Link 
//                 to="/admin/signup" 
//                 className="font-medium text-blue-600 hover:text-blue-500 hover:underline"
//               >
//                 S'inscrire
//               </Link>
//             </motion.div> */}
//           </div>
          
//           <div className="bg-gray-50 px-8 py-4 text-center border-t border-gray-100">
//             <p className="text-xs text-gray-500">
//               {new Date().getFullYear()} Valtransauto. Tous droits réservés.
//             </p>
//           </div>
//         </motion.div>
//       </motion.div>
//     </div>
//   );
// }

import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, ArrowLeft, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useUserAuth } from '@/hooks/useUserAuth';
import { toast } from '@/components/ui/use-toast';

export default function AdminLogin() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useUserAuth();
  const [isMounted, setIsMounted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validation basique
    if (!formData.email || !formData.password) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    setIsLoading(true);
    
    try {
      await login(formData.email, formData.password);
      toast({
        title: 'Connexion réussie !',
        description: 'Redirection en cours...',
        variant: 'default',
      });
      navigate('/admin');
       setIsLoading(false);
    } catch (err) {
      console.error('Login error:', err);
      if (err.message === "Invalid login credentials") {
        setError("Email ou mot de passe incorrect!");
      } else if (err.message === "Email not confirmed") {
        setError("Le compte n'est pas confirmé. Veuillez vérifier votre email.");
      } else if (err.message.includes("admin_users_id_fkey")) {
        setError("Cet email existe déjà!");
      } else {
        setError(err.message || "Une erreur est survenue lors de la connexion.");
      }
    } finally {
      setIsLoading(false);
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

  if (!isMounted) return null;

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
          <div className="p-8">
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
                  <Lock className="h-10 w-10 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">Connexion</h1>
                <p className="text-gray-600 mt-2">Accédez à votre espace d'administration</p>
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

            <form onSubmit={handleSubmit} className="space-y-5">
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
                    autoComplete="current-password"
                    required
                    className="pl-10 h-11 text-base"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants} custom={0.5} className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Se souvenir de moi
                </label>
              </motion.div>

              <motion.div variants={itemVariants} custom={0.6} className="pt-2">
                <Button
                  type="submit"
                  className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-base font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Connexion...
                    </>
                  ) : (
                    'Se connecter'
                  )}
                </Button>
              </motion.div>
            </form>
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
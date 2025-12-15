import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [isValidLink, setIsValidLink] = useState(false);
  const [loading, setLoading] = useState(true);
  const { updatePassword, resetPassword } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Vérifier si c'est un lien de réinitialisation valide
    const accessToken = searchParams.get('access_token');
    const type = searchParams.get('type');
    
    if (accessToken && type === 'recovery') {
      setIsValidLink(true);
    }
    setLoading(false);
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }

    const { success } = await updatePassword(formData.password);
    if (success) {
      navigate('/admin/login');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    const email = prompt('Veuillez entrer votre adresse email:');
    if (email) {
      await resetPassword(email);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isValidLink) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold text-red-600">Lien invalide</h2>
          <p className="mt-2 text-gray-600">
            Le lien de réinitialisation est invalide ou a expiré.
          </p>
          <Button
            onClick={handleForgotPassword}
            className="mt-4"
          >
            Demander un nouveau lien
          </Button>
          <div className="mt-4">
            <Button
              variant="outline"
              onClick={() => navigate('/admin/login')}
            >
              Retour à la connexion
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/admin/login')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à la connexion
          </Button>
          <h2 className="mt-2 text-center text-2xl font-bold text-gray-900">
            Réinitialiser votre mot de passe
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Veuillez entrer votre nouveau mot de passe
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <Label htmlFor="password" className="sr-only">
                Nouveau mot de passe
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="pl-10"
                  placeholder="Nouveau mot de passe"
                  value={formData.password}
                  onChange={handleChange}
                  minLength={8}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="confirmPassword" className="sr-only">
                Confirmer le mot de passe
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  className="pl-10"
                  placeholder="Confirmer le mot de passe"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  minLength={8}
                />
              </div>
            </div>
          </div>

          <div>
            <Button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={loading}
            >
              {loading ? 'Réinitialisation en cours...' : 'Réinitialiser le mot de passe'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// import { Navigate } from 'react-router-dom';
// // depuis src/components/ProtectedRoute.jsx
// import { useUserAuth } from '@/hooks/useUserAuth';


// export default function ProtectedRoute({ children }) {
//   const { user, loading } = useUserAuth();

//   if (loading) return <p>Chargement...</p>;

//   if (!user) return <Navigate to="/admin/login" replace />;
//   // if (!user) return <Navigate to="/admin" replace />;
//   // if (!user) return <Navigate to="/admin/signup" replace />;

//   return children;
// }


// src/components/ProtectedRoute.jsx
import { Navigate, useLocation } from 'react-router-dom';
import { useUserAuth } from '@/hooks/useUserAuth';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useUserAuth();
  const location = useLocation();

  if (loading) {
    return <div>Chargement...</div>; // ou un composant de chargement
  }

  if (!user) {
    // Rediriger vers la page de connexion avec l'URL de redirection
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }
  if(user) {
    return <Navigate to="/admin" state={{ from: location }} replace />;
  }

  // if (adminOnly && !user.isAdmin) {
  //   return <Navigate to="/unauthorized" replace />;
  // }

  return children;
}
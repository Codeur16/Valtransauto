import { createContext } from 'react';
import useProvideAuth from '@/hooks/useProvideAuth';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const auth = useProvideAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

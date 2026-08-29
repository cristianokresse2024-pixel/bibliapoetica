import { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentSession, loginUser, registerUser, logoutUser } from '../lib/authService.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' | 'register'
  const [authModalMessage, setAuthModalMessage] = useState('');

  useEffect(() => {
    const session = getCurrentSession();
    setUser(session);
    setLoading(false);
  }, []);

  const openAuthModal = (mode = 'login', message = '') => {
    setAuthModalMode(mode);
    setAuthModalMessage(message);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setAuthModalMessage('');
  };

  const handleLogin = async (credentials) => {
    const loggedUser = await loginUser(credentials);
    setUser(loggedUser);
    closeAuthModal();
    return loggedUser;
  };

  const handleRegister = async (data) => {
    const newUser = await registerUser(data);
    setUser(newUser);
    closeAuthModal();
    return newUser;
  };

  const handleLogout = () => {
    logoutUser();
    setUser(null);
  };

  const isSubscriber = Boolean(
    user && (user.plan === 'subscriber' || user.plan === 'vip_lifetime')
  );

  const isVip = Boolean(user && user.plan === 'vip_lifetime');

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isLoggedIn: Boolean(user),
        isSubscriber,
        isVip,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
        isAuthModalOpen,
        authModalMode,
        authModalMessage,
        openAuthModal,
        closeAuthModal,
        setAuthModalMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider');
  }
  return context;
}

export default AuthContext;

import React, { createContext, useContext, useState } from 'react';
import SignInModal from '@/components/Auth/SignInModal';

type Mode = 'signin' | 'register';

interface AuthModalContextType {
  open: (mode?: Mode) => void;
  close: () => void;
  isOpen: boolean;
  mode: Mode;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined);

export const AuthModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<Mode>('signin');

  const open = (m: Mode = 'signin') => {
    setMode(m);
    setIsOpen(true);
  };

  const close = () => setIsOpen(false);

  return (
    <AuthModalContext.Provider value={{ open, close, isOpen, mode }}>
      {children}
      <SignInModal isOpen={isOpen} mode={mode} onClose={close} />
    </AuthModalContext.Provider>
  );
};

export const useAuthModal = () => {
  const ctx = useContext(AuthModalContext);
  if (!ctx) throw new Error('useAuthModal must be used within AuthModalProvider');
  return ctx;
};

export default AuthModalContext;


import React from 'react';
import AppLayout from '@/components/AppLayout';
import { AppProvider } from '@/contexts/AppContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { AuthModalProvider } from '@/contexts/AuthModalContext';

const Index: React.FC = () => {
  return (
    <AuthProvider>
      <AuthModalProvider>
        <AppProvider>
          <AppLayout />
        </AppProvider>
      </AuthModalProvider>
    </AuthProvider>
  );
};

export default Index;

import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

// Tipo para os dados do usuário autenticado
type AuthUser = {
  id: string;
  name: string;
  email: string;
};

// Interface para o contexto de autenticação
interface AuthContextData {
  user: AuthUser | null;
  isLoading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

// Criamos um simples emissor de eventos em vez de usar EventTarget
class EventEmitter {
  private listeners: { [eventName: string]: Function[] } = {};

  addEventListener(eventName: string, callback: Function) {
    if (!this.listeners[eventName]) {
      this.listeners[eventName] = [];
    }
    this.listeners[eventName].push(callback);
  }

  removeEventListener(eventName: string, callback: Function) {
    if (!this.listeners[eventName]) return;
    this.listeners[eventName] = this.listeners[eventName].filter(
      listener => listener !== callback
    );
  }

  dispatchEvent(eventName: string) {
    if (!this.listeners[eventName]) return;
    this.listeners[eventName].forEach(callback => callback());
  }
}

// Constante para o nome do evento de logout
export const LOGOUT_EVENT_NAME = 'logout';

// Criação do emissor de eventos para logout
export const logoutEvent = new EventEmitter();

// Criação do contexto de autenticação
const AuthContext = createContext<AuthContextData>({} as AuthContextData);

// Provider para envolver a aplicação com o contexto de autenticação
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Verificar autenticação ao montar o componente
  useEffect(() => {
    checkAuthState();
  }, []);

  // Função para verificar o estado de autenticação
  const checkAuthState = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        // Aqui você pode decodificar o token JWT para obter as informações do usuário
        // Ou fazer uma chamada de API para obter dados do usuário
        // Para simplificar, vamos apenas definir o usuário como autenticado
        setUser({ id: '1', name: 'Usuário Autenticado', email: 'user@example.com' });
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Função de login
  const login = async (token: string) => {
    try {
      await AsyncStorage.setItem('authToken', token);
      // Aqui você pode decodificar o token ou fazer uma chamada para obter dados do usuário
      setUser({ id: '1', name: 'Usuário Autenticado', email: 'user@example.com' });
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw error;
    }
  };

  // Função de logout
  const logout = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      setUser(null);
      // Disparar o evento de logout para outros componentes ouvirem
      logoutEvent.dispatchEvent(LOGOUT_EVENT_NAME);
      // Redirecionar para a tela de login
      router.replace('/auth');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      login,
      logout,
      isAuthenticated: !!user,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para acessar o contexto
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}

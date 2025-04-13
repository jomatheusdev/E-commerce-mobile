import React, { createContext, useContext, useState, useRef, ReactNode } from 'react';
import {
  View,
  Text,
  Animated,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Tipos para as propriedades do toast
type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastOptions {
  type?: ToastType;
  position?: 'top' | 'bottom';
  duration?: number;
}

interface ShowToastFunction {
  (message: string, options?: ToastOptions): void;
}

interface ToastContextType {
  showToast: ShowToastFunction;
}

// Criação do contexto
const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Componente Provider
const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState<ToastType>('info');
  const [position, setPosition] = useState<'top' | 'bottom'>('top');
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const offsetAnim = useRef(new Animated.Value(-100)).current;
  const timeoutRef = useRef<NodeJS.Timeout>();

  const showToast: ShowToastFunction = (
    message,
    { type = 'info', position = 'top', duration = 3000 } = {}
  ) => {
    setMessage(message);
    setType(type);
    setPosition(position);
    setVisible(true);

    // Limpa timeout anterior se existir
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Configura animações
    offsetAnim.setValue(position === 'top' ? -100 : 100);
    
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(offsetAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Define timeout para esconder o toast
    timeoutRef.current = setTimeout(() => {
      hideToast();
    }, duration);
  };

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(offsetAnim, {
        toValue: position === 'top' ? -100 : 100,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setVisible(false);
    });
  };

  // Função para obter ícone com base no tipo
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <Ionicons name="checkmark-circle" size={24} color="#fff" />;
      case 'error':
        return <Ionicons name="close-circle" size={24} color="#fff" />;
      case 'warning':
        return <Ionicons name="warning" size={24} color="#fff" />;
      case 'info':
      default:
        return <Ionicons name="information-circle" size={24} color="#fff" />;
    }
  };

  // Função para obter a cor de fundo com base no tipo
  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return '#28a745';
      case 'error':
        return '#dc3545';
      case 'warning':
        return '#ffc107';
      case 'info':
      default:
        return '#17a2b8';
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {visible && (
        <SafeAreaView 
          style={[
            styles.toastContainer, 
            position === 'top' ? styles.topPosition : styles.bottomPosition
          ]} 
          pointerEvents="box-none"
        >
          <Animated.View
            style={[
              styles.toast,
              { backgroundColor: getBackgroundColor() },
              {
                opacity: fadeAnim,
                transform: [{ translateY: offsetAnim }],
              },
            ]}
          >
            <View style={styles.toastContent}>
              {getIcon()}
              <Text style={styles.toastMessage}>{message}</Text>
            </View>
            <TouchableOpacity onPress={hideToast} style={styles.closeButton}>
              <Ionicons name="close" size={20} color="#fff" />
            </TouchableOpacity>
          </Animated.View>
        </SafeAreaView>
      )}
    </ToastContext.Provider>
  );
};

// Hook personalizado
export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast deve ser usado dentro de um ToastProvider');
  }
  return context;
};

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 9999,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  topPosition: {
    top: Platform.OS === 'ios' ? 50 : 10,
  },
  bottomPosition: {
    bottom: Platform.OS === 'ios' ? 50 : 10,
  },
  toast: {
    minWidth: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  toastContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  toastMessage: {
    color: 'white',
    fontSize: 16,
    marginLeft: 10,
    flex: 1,
  },
  closeButton: {
    marginLeft: 10,
    padding: 5,
  },
});

export default ToastProvider;

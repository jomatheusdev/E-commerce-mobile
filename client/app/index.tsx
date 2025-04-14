import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    checkAuthAndRedirect();
  }, []);

  const checkAuthAndRedirect = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      
      if (token) {
        // Usuário autenticado, redirecionar para a página principal
        router.replace('/(tabs)');
      } else {
        // Usuário não autenticado, redirecionar para login
        router.replace('/auth');
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      router.replace('/auth');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#007bff" />
    </View>
  );
}

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import httpService from '../services/httpService';
import { API_ENDPOINTS } from '../../config/api';

export default function LoginScreen() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localLoading, setLocalLoading] = useState(false);

  const validarEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Redirecionar se já estiver autenticado
  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, router]);

  const handleLogin = async () => {
    if (!validarEmail(email)) {
      Alert.alert('Erro', 'Formato de email inválido.');
      return;
    }

    setLocalLoading(true);
    try {
      const response = await httpService.post(API_ENDPOINTS.login, { email, password });
      const { token } = response.data;

      // Usar a função login do contexto para gerenciar a autenticação
      await login(token);
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Erro', 'Credenciais inválidas ou erro no servidor.');
    } finally {
      setLocalLoading(false);
    }
  };

  // Mostrar indicador de carregamento enquanto verifica autenticação
  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={{ marginTop: 10 }}>Verificando autenticação...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
      />
      {localLoading ? (
        <ActivityIndicator size="small" color="#007bff" style={{ marginTop: 20 }} />
      ) : (
        <Button title="Entrar" onPress={handleLogin} />
      )}
      <TouchableOpacity onPress={() => router.push('/auth/register')}>
        <Text style={styles.registrar}>Não tem login? Registre-se</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  registrar: {
    marginTop: 20,
    color: 'blue',
    textAlign: 'center',
  },
});
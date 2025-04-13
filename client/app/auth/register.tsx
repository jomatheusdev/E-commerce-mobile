import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import httpService from '../services/httpService';
import { API_ENDPOINTS } from '../../config/api';

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const sendForm = async () => {
    const json = {
      name,cpf,email,password,confirmPassword,
    }
    console.log('json',json)
    try {
      const result = await httpService.post(API_ENDPOINTS.register, json)

    }catch (error) {
      //  mostrar um tooltip de erro 
    }
  }

  const validarEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validarCpf = (cpf: string) => {
    const regex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    return regex.test(cpf);
  };

  const handleRegister = () => {
    if (!validarEmail(email)) {
      Alert.alert('Erro', 'Formato de email inválido.');
      return;
    }

    if (!validarCpf(cpf)) {
      Alert.alert('Erro', 'Formato de CPF inválido.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não estao iguais.');
      return;
    }

    console.log('chamando o sendForm')
    sendForm();

    router.push('/auth');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Registro</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome Completo"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="CPF (XXX.XXX.XXX-XX)"
        value={cpf}
        onChangeText={setCpf}
      />
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
      <TextInput
        style={styles.input}
        placeholder="Confirmar Senha"
        value={confirmPassword}
        secureTextEntry
        onChangeText={setConfirmPassword}
      />
      <Button title="Registrar" onPress={handleRegister} />
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
});

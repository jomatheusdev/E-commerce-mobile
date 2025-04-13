import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';

// Define e exporta o componente Layout como default
export default function RootLayout() {
  return (
    <AuthProvider>
      <CartProvider>
        <StatusBar style="auto" />
        <Stack screenOptions={{ headerShown: false }} />
      </CartProvider>
    </AuthProvider>
  );
}
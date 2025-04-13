import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  total?: number; // Tornando o campo total opcional
}

interface Order {
  id: string;
  orderDate: string;
  status: string;
  total: number;
  paymentMethod: string;
  items: OrderItem[];
}

// Função auxiliar para formatar valores monetários com segurança
const formatCurrency = (value: any): string => {
  // Verifica se o valor é nulo, indefinido ou não é um número
  if (value === null || value === undefined || isNaN(Number(value))) {
    return "0.00";
  }
  return Number(value).toFixed(2);
};

const formatDate = (dateString: string) => {
  try {
    // Verificar se a data é válida
    let date;
    
    // Tenta interpretar a string em diferentes formatos
    if (dateString) {
      // Remove qualquer caractere 'T' ou 'Z' para aumentar compatibilidade
      dateString = dateString.replace('T', ' ').replace('Z', '');
      
      // Tenta criar uma data diretamente
      date = new Date(dateString);
      
      // Se a data for inválida, tenta outros formatos comuns
      if (isNaN(date.getTime())) {
        // Tenta formato DD/MM/YYYY
        const parts = dateString.match(/(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})/);
        if (parts) {
          date = new Date(Number(parts[3]), Number(parts[2]) - 1, Number(parts[1]));
        }
      }
      
      // Se a data ainda for inválida, desiste
      if (isNaN(date.getTime())) {
        console.log('Data inválida recebida:', dateString);
        throw new Error('Data inválida');
      }
    } else {
      throw new Error('String de data vazia');
    }
    
    return {
      fullDate: date.toLocaleDateString('pt-BR', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
      }),
      time: date.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      weekday: date.toLocaleDateString('pt-BR', { weekday: 'long' })
    };
  } catch (error) {
    // Fallback quando não consegue interpretar a data
    return {
      fullDate: new Date().toLocaleDateString('pt-BR'),
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      weekday: new Date().toLocaleDateString('pt-BR', { weekday: 'long' })
    };
  }
};

export default function MyOrdersScreen() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        setError('Você precisa estar logado para ver seus pedidos');
        setLoading(false);
        return;
      }

      const response = await axios.get(API_ENDPOINTS.orders, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setOrders(response.data);
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error);
      setError('Não foi possível carregar seus pedidos');
    } finally {
      setLoading(false);
    }
  };

  const getPaymentMethodName = (method: string) => {
    switch (method) {
      case 'credit':
        return 'Cartão de Crédito';
      case 'pix':
        return 'Pix';
      case 'cash':
        return 'Dinheiro na Entrega';
      default:
        return method;
    }
  };

  const getStatusName = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendente';
      case 'processing':
        return 'Em processamento';
      case 'shipped':
        return 'Enviado';
      case 'delivered':
        return 'Entregue';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#FFA500';  // Orange
      case 'processing':
        return '#007bff';  // Blue
      case 'shipped':
        return '#9370DB';  // Purple
      case 'delivered':
        return '#28a745';  // Green
      case 'cancelled':
        return '#dc3545';  // Red
      default:
        return '#6c757d';  // Grey
    }
  };

  const toggleOrderExpansion = (orderId: string) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
    }
  };

  const renderOrderItem = ({ item }: { item: Order }) => {
    const isExpanded = expandedOrder === item.id;
    const formattedDate = formatDate(item.orderDate);
    
    return (
      <View style={styles.orderCard}>
        <TouchableOpacity 
          style={styles.orderHeader} 
          onPress={() => toggleOrderExpansion(item.id)}
        >
          <View>
            <Text style={styles.orderId}>Pedido #{item.id}</Text>
            <View style={styles.dateContainer}>
              <Ionicons name="calendar-outline" size={14} color="#666" style={styles.dateIcon} />
              <Text style={styles.orderDate}>
                {formattedDate.fullDate}
                {formattedDate.weekday ? ` (${formattedDate.weekday})` : ''} 
                {formattedDate.time ? ` às ${formattedDate.time}` : ''}
              </Text>
            </View>
          </View>
          
          <View style={styles.orderHeaderRight}>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
              <Text style={styles.statusText}>{getStatusName(item.status)}</Text>
            </View>
            <Ionicons 
              name={isExpanded ? 'chevron-up' : 'chevron-down'} 
              size={20} 
              color="#555" 
            />
          </View>
        </TouchableOpacity>
        
        {isExpanded && (
          <View style={styles.orderDetails}>
            <View style={styles.orderInfo}>
              <Text style={styles.infoLabel}>Total:</Text>
              <Text style={styles.infoValue}>R$ {formatCurrency(item.total)}</Text>
            </View>
            
            <View style={styles.orderInfo}>
              <Text style={styles.infoLabel}>Pagamento:</Text>
              <Text style={styles.infoValue}>{getPaymentMethodName(item.paymentMethod)}</Text>
            </View>
            
            <Text style={styles.itemsTitle}>Itens do pedido:</Text>
            {item.items.map((orderItem, index) => (
              <View key={orderItem.id} style={styles.orderItem}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemIndex}>{index + 1}.</Text>
                  <View style={styles.itemDetails}>
                    <Text style={styles.itemName} numberOfLines={2} ellipsizeMode="tail">
                      {orderItem.name || 
                       orderItem.productName || 
                       (orderItem.Product && orderItem.Product.name) || 
                       `Produto ${index + 1}`}
                    </Text>
                    <View style={styles.itemMeta}>
                      <Text style={styles.itemQuantity}>
                        <Text style={styles.itemQuantityLabel}>Quantidade: </Text>
                        {orderItem.quantity}
                      </Text>
                      <Text style={styles.itemUnitPrice}>
                        <Text style={styles.itemPriceLabel}>Preço unitário: </Text>
                        R$ {formatCurrency(orderItem.price || orderItem.unitPrice)}
                      </Text>
                    </View>
                  </View>
                </View>
                <Text style={styles.itemPrice}>
                  R$ {formatCurrency(
                    orderItem.total !== undefined
                      ? orderItem.total
                      : (orderItem.price || orderItem.unitPrice || 0) * (orderItem.quantity || 1)
                  )}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Carregando seus pedidos...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={48} color="#dc3545" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchOrders}>
          <Text style={styles.retryButtonText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ 
        title: 'Meus Pedidos',
        headerShown: true
      }} />
      
      <View style={styles.container}>
        {orders.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="basket-outline" size={64} color="#999" />
            <Text style={styles.emptyText}>Você ainda não possui pedidos</Text>
            <TouchableOpacity 
              style={styles.shopButton}
              onPress={() => router.replace('/(tabs)')}
            >
              <Text style={styles.shopButtonText}>Ir às compras</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={orders}
            renderItem={renderOrderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.ordersList}
          />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#dc3545',
    textAlign: 'center',
    marginVertical: 16,
  },
  retryButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#555',
    marginTop: 16,
    marginBottom: 24,
  },
  shopButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  shopButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  ordersList: {
    padding: 16,
  },
  orderCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  orderHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  dateIcon: {
    marginRight: 4,
  },
  orderDate: {
    fontSize: 13,
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  orderDetails: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  orderInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  itemsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 8,
    color: '#333',
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemInfo: {
    flex: 1,
    flexDirection: 'row',
  },
  itemIndex: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555',
    marginRight: 8,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 8, // Adicionado para garantir espaço adequado
    flexShrink: 1,  // Permite que o texto seja reduzido se necessário
  },
  itemMeta: {
    flexDirection: 'row',
    marginTop: 4,
    flexWrap: 'wrap',
  },
  itemQuantityLabel: {
    fontSize: 12,
    color: '#555',
    fontWeight: 'normal',
  },
  itemPriceLabel: {
    fontSize: 12,
    color: '#555',
    fontWeight: 'normal',
  },
  itemUnitPrice: {
    fontSize: 12,
    color: '#666',
    marginLeft: 10,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#007bff',
  },
});

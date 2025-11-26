import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import ApiService from '../services/api';
import { generateReservationPDF, sharePDF } from '../services/pdfService';
import { useAuth } from '../contexts/AuthContext';
import { Reservation } from '../types';

export default function ReservationsScreen({ navigation }: any) {
  const { user } = useAuth();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [generatingPDF, setGeneratingPDF] = useState<number | null>(null);

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = async () => {
    try {
      const data = await ApiService.getMyReservations();
      console.log('Reservas recibidas:', data);
      setReservations(data);
    } catch (error: any) {
      console.error('Error cargando reservas:', error);
      console.error('Error response:', error.response?.data);
      Alert.alert('Error', error.response?.data?.detail || 'No se pudieron cargar las reservas');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadReservations();
  };

  const handleGeneratePDF = async (reservation: Reservation) => {
    if (!user) return;

    setGeneratingPDF(reservation.id);
    try {
      const pdfUri = await generateReservationPDF({
        reservation,
        userName: user.full_name,
      });
      
      await sharePDF(pdfUri);
    } catch (error) {
      console.error('Error generando PDF:', error);
      Alert.alert('Error', 'No se pudo generar el comprobante PDF');
    } finally {
      setGeneratingPDF(null);
    }
  };

  const handleCancelReservation = (reservation: Reservation) => {
    Alert.alert(
      'Cancelar Reserva',
      `¿Estás seguro de cancelar la reserva para ${reservation.court?.name}?`,
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Sí, cancelar',
          style: 'destructive',
          onPress: async () => {
            try {
              await ApiService.cancelReservation(reservation.id);
              Alert.alert('Éxito', 'Reserva cancelada correctamente');
              loadReservations();
            } catch (error) {
              Alert.alert('Error', 'No se pudo cancelar la reserva');
            }
          },
        },
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return '#28a745';
      case 'pending':
        return '#ffc107';
      case 'cancelled':
        return '#dc3545';
      default:
        return '#666';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmada';
      case 'pending':
        return 'Pendiente';
      case 'cancelled':
        return 'Cancelada';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CL', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const renderReservation = ({ item }: { item: Reservation }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.courtInfo}>
          <Text style={styles.courtName}>{item.court?.name}</Text>
          <Text style={styles.sport}>{item.court?.sport}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </View>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.infoRow}>
          <Text style={styles.infoIcon}>📅</Text>
          <Text style={styles.infoText}>{formatDate(item.date)}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoIcon}>⏰</Text>
          <Text style={styles.infoText}>
            {item.time ? item.time.substring(0, 5) : 'N/A'}
            {item.duration ? ` (${item.duration} hr)` : ''}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoIcon}>💰</Text>
          <Text style={styles.infoText}>${item.total_price.toLocaleString()}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoIcon}>🔖</Text>
          <Text style={styles.infoText}>Código: #{item.id}</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.pdfButton}
          onPress={() => handleGeneratePDF(item)}
          disabled={generatingPDF === item.id}
        >
          {generatingPDF === item.id ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <Text style={styles.pdfButtonIcon}>📄</Text>
              <Text style={styles.pdfButtonText}>Descargar Comprobante</Text>
            </>
          )}
        </TouchableOpacity>
        
        {item.status !== 'cancelled' && (
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => handleCancelReservation(item)}
          >
            <Text style={styles.cancelButtonText}>Cancelar Reserva</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Cargando reservas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mis Reservas</Text>
      </View>

      <FlatList
        data={reservations}
        renderItem={renderReservation}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No tienes reservas aún</Text>
            <TouchableOpacity
              style={styles.exploreButton}
              onPress={() => navigation.navigate('Home')}
            >
              <Text style={styles.exploreButtonText}>Explorar Canchas</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  courtInfo: {
    flex: 1,
  },
  courtName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  sport: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  cardBody: {
    gap: 12,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  infoText: {
    fontSize: 16,
    color: '#666',
  },
  actions: {
    gap: 10,
  },
  pdfButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pdfButtonIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  pdfButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: '#dc3545',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#dc3545',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  exploreButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  exploreButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

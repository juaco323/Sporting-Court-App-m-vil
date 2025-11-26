import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  ActivityIndicator,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import ApiService from '../services/api';
import { generateReservationPDF, downloadPDF } from '../services/pdfService';
import { useAuth } from '../contexts/AuthContext';
import { Court, Reservation } from '../types';

export default function BookingScreen({ route, navigation }: any) {
  const { court }: { court: Court } = route.params;
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lastReservation, setLastReservation] = useState<Reservation | null>(null);

  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00',
    '12:00', '13:00', '14:00', '15:00',
    '16:00', '17:00', '18:00', '19:00',
    '20:00', '21:00', '22:00',
  ];

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-CL', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleDateChange = (event: any, date?: Date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
    }
  };

  const calculateEndTime = (startTime: string) => {
    const [hours] = startTime.split(':');
    const endHour = (parseInt(hours) + 1).toString().padStart(2, '0');
    return `${endHour}:00`;
  };

  const handleGeneratePDF = async () => {
    if (!lastReservation || !user) return;

    try {
      const pdfUri = await generateReservationPDF({
        reservation: lastReservation,
        userName: user.full_name,
      });

      const fileName = `reserva_${lastReservation.id}.pdf`;
      await downloadPDF(pdfUri, fileName);
    } catch (error) {
      console.error('Error generando PDF:', error);
      Alert.alert('Error', 'No se pudo generar el comprobante PDF');
    }
  };

  const handleReserve = async () => {
    if (!selectedTime) {
      Alert.alert('Error', 'Por favor selecciona un horario');
      return;
    }

    setLoading(true);
    try {
      const dateStr = selectedDate.toISOString().split('T')[0];
      const endTime = calculateEndTime(selectedTime);

      // Formatear las horas con segundos
      const startTimeFormatted = `${selectedTime}:00`;
      const endTimeFormatted = `${endTime}:00`;

      const reservation = await ApiService.createReservation({
        court_id: court.id,
        date: dateStr,
        start_time: startTimeFormatted,
        end_time: endTimeFormatted,
      });

      // Guardar la reserva para poder generar el PDF
      setLastReservation({
        ...reservation,
        court: court,
        user: user,
      });

      Alert.alert(
        '¡Reserva Exitosa!',
        `Tu reserva para ${court.name} el ${formatDate(selectedDate)} a las ${selectedTime} ha sido confirmada.\n\nCódigo de confirmación: #${reservation.id}\n\nRecuerda ir a la sección de Mis reservas para poder descargar el comprobante de reserva`,
        [
          {
            text: 'Ver mis reservas',
            onPress: () => {
              navigation.navigate('MainTabs', { screen: 'Reservations' });
            },
          },
          {
            text: 'Volver al inicio',
            onPress: () => {
              navigation.navigate('MainTabs', { screen: 'Home' });
            },
          },
        ]
      );
    } catch (error: any) {
      let errorMessage = 'No se pudo crear la reserva';

      if (error.response?.data?.detail) {
        const detail = error.response.data.detail;
        if (Array.isArray(detail)) {
          errorMessage = detail.map(err => err.msg || err).join('\n');
        } else if (typeof detail === 'string') {
          errorMessage = detail;
          // Si el backend dice que está reservada, agregar info de la cancha
          if (detail.includes('ya está reservada')) {
            errorMessage = `${court.name} (ID: ${court.id})\n\n${detail}\n\nNota: Verifica que estés reservando la cancha correcta.`;
          }
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      Alert.alert('Error al Reservar', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Reservar Cancha</Text>
          <Text style={styles.courtName}>{court.name}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fecha</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateButtonText}>{formatDate(selectedDate)}</Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleDateChange}
              minimumDate={new Date()}
            />
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Horario (1 hora)</Text>
          <View style={styles.timeSlotsGrid}>
            {timeSlots.map((time) => (
              <TouchableOpacity
                key={time}
                style={[
                  styles.timeSlot,
                  selectedTime === time && styles.timeSlotSelected,
                ]}
                onPress={() => setSelectedTime(time)}
              >
                <Text
                  style={[
                    styles.timeSlotText,
                    selectedTime === time && styles.timeSlotTextSelected,
                  ]}
                >
                  {time}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {selectedTime && (
          <View style={styles.summarySection}>
            <Text style={styles.sectionTitle}>Resumen</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Cancha:</Text>
              <Text style={styles.summaryValue}>{court.name}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Fecha:</Text>
              <Text style={styles.summaryValue}>{formatDate(selectedDate)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Horario:</Text>
              <Text style={styles.summaryValue}>
                {selectedTime} - {calculateEndTime(selectedTime)}
              </Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalValue}>
                ${court.price_per_hour.toLocaleString()}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.reserveButton, loading && styles.reserveButtonDisabled]}
          onPress={handleReserve}
          disabled={loading}
        >
          <Text style={styles.reserveButtonText}>
            {loading ? 'Reservando...' : 'Confirmar Reserva'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
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
    marginBottom: 8,
  },
  courtName: {
    fontSize: 18,
    color: '#007AFF',
    fontWeight: '600',
  },
  section: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  dateButtonText: {
    fontSize: 16,
    color: '#1a1a1a',
    textTransform: 'capitalize',
  },
  timeSlotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeSlot: {
    width: '30%',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  timeSlotSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  timeSlotText: {
    fontSize: 16,
    color: '#666',
  },
  timeSlotTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  summarySection: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 16,
    marginBottom: 100,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  summaryLabel: {
    fontSize: 16,
    color: '#666',
  },
  summaryValue: {
    fontSize: 16,
    color: '#1a1a1a',
    fontWeight: '600',
  },
  totalRow: {
    marginTop: 12,
    paddingTop: 20,
    borderTopWidth: 2,
    borderTopColor: '#007AFF',
    borderBottomWidth: 0,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  totalValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    padding: 16,
  },
  reserveButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  reserveButtonDisabled: {
    opacity: 0.6,
  },
  reserveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

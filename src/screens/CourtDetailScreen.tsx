import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import ApiService from '../services/api';
import { Court } from '../types';

export default function CourtDetailScreen({ route, navigation }: any) {
  const { courtId } = route.params;
  const [court, setCourt] = useState<Court | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCourt();
  }, []);

  const loadCourt = async () => {
    try {
      const data = await ApiService.getCourtById(courtId);
      setCourt(data);
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar la información de la cancha');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleReserve = () => {
    if (court) {
      navigation.navigate('Booking', { court });
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!court) return null;

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>{court.name}</Text>
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingText}>⭐ {court.rating.toFixed(1)}</Text>
          </View>
        </View>

        <View style={styles.sportBadge}>
          <Text style={styles.sportText}>{court.sport}</Text>
        </View>

        <Text style={styles.description}>{court.description}</Text>

        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Capacidad:</Text>
            <Text style={styles.infoValue}>{court.capacity} personas</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Precio por hora:</Text>
            <Text style={styles.priceValue}>
              ${court.price_per_hour.toLocaleString()}
            </Text>
          </View>
        </View>

        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Características</Text>
          <View style={styles.featuresList}>
            {court.features.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <Text style={styles.featureIcon}>✓</Text>
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Precio por hora</Text>
          <Text style={styles.footerPrice}>
            ${court.price_per_hour.toLocaleString()}
          </Text>
        </View>
        <TouchableOpacity style={styles.reserveButton} onPress={handleReserve}>
          <Text style={styles.reserveButtonText}>Reservar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    flex: 1,
    marginRight: 12,
  },
  ratingBadge: {
    backgroundColor: '#FFF3CD',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#856404',
  },
  sportBadge: {
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: '#007AFF',
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  sportText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  infoSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  priceValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  featuresSection: {
    paddingHorizontal: 20,
    marginBottom: 100,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  featuresList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureIcon: {
    fontSize: 18,
    color: '#28a745',
    marginRight: 12,
  },
  featureText: {
    fontSize: 16,
    color: '#666',
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceContainer: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 12,
    color: '#666',
  },
  footerPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  reserveButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  reserveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

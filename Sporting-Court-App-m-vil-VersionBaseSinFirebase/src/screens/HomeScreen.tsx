import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import ApiService from '../services/api';
import { Court } from '../types';

export default function HomeScreen({ navigation }: any) {
  const [courts, setCourts] = useState<Court[]>([]);
  const [filteredCourts, setFilteredCourts] = useState<Court[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSport, setSelectedSport] = useState<string | null>(null);

  const sports = ['Todos', 'Fútbol', 'Tenis', 'Pádel'];

  useEffect(() => {
    loadCourts();
  }, []);

  useEffect(() => {
    filterCourts();
  }, [searchQuery, selectedSport, courts]);

  const loadCourts = async () => {
    try {
      const data = await ApiService.getCourts();
      setCourts(data);
      setFilteredCourts(data);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar las canchas');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filterCourts = () => {
    let filtered = courts;

    if (selectedSport && selectedSport !== 'Todos') {
      filtered = filtered.filter((court) => court.sport === selectedSport);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (court) =>
          court.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          court.sport.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredCourts(filtered);
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadCourts();
  };

  const renderCourtCard = ({ item }: { item: Court }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('CourtDetail', { courtId: item.id })}
    >
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.courtName}>{item.name}</Text>
          <Text style={styles.courtSport}>{item.sport}</Text>
        </View>
        <View style={styles.ratingBadge}>
          <Text style={styles.ratingText}>⭐ {item.rating.toFixed(1)}</Text>
        </View>
      </View>
      
      <Text style={styles.courtDescription} numberOfLines={2}>
        {item.description}
      </Text>
      
      <View style={styles.cardFooter}>
        <Text style={styles.capacity}>👥 {item.capacity} personas</Text>
        <Text style={styles.price}>${item.price_per_hour.toLocaleString()}/hora</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Cargando canchas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Canchas Deportivas</Text>
        
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar canchas..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <View style={styles.filterContainer}>
          {sports.map((sport) => (
            <TouchableOpacity
              key={sport}
              style={[
                styles.filterButton,
                selectedSport === sport && styles.filterButtonActive,
              ]}
              onPress={() => setSelectedSport(sport === 'Todos' ? null : sport)}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  selectedSport === sport && styles.filterButtonTextActive,
                ]}
              >
                {sport}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <FlatList
        data={filteredCourts}
        renderItem={renderCourtCard}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No se encontraron canchas</Text>
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
    padding: 16,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  filterButtonActive: {
    backgroundColor: '#007AFF',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  filterButtonTextActive: {
    color: '#fff',
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
    marginBottom: 12,
  },
  courtName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  courtSport: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  ratingBadge: {
    backgroundColor: '#FFF3CD',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#856404',
  },
  courtDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  capacity: {
    fontSize: 14,
    color: '#666',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
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
  },
});

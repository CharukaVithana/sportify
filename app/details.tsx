import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useApp } from '@/contexts/AppContext';
import { mockSportsData } from '@/services/sportsApi';

export default function DetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { isFavourite, addFavourite, removeFavourite } = useApp();

  const item = mockSportsData.find((sport) => sport.id === id);

  if (!item) {
    return (
      <View style={styles.errorContainer}>
        <Feather name="alert-circle" size={60} color={Colors.light.error} />
        <Text style={styles.errorText}>Item not found</Text>
        <TouchableOpacity style={styles.button} onPress={() => router.back()}>
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isItemFavourite = isFavourite(item.id);

  const toggleFavourite = () => {
    if (isItemFavourite) {
      removeFavourite(item.id);
    } else {
      addFavourite(item);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.imageContainer}>
        <Text style={styles.largeEmoji}>{item.image}</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{item.title}</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
              <Text style={styles.statusText}>{item.status}</Text>
            </View>
          </View>

          <View style={styles.badges}>
            <View style={styles.categoryBadge}>
              <Feather name={getCategoryIcon(item.category)} size={16} color={Colors.light.primary} />
              <Text style={styles.categoryText}>{item.category}</Text>
            </View>
            {item.date && (
              <View style={styles.dateBadge}>
                <Feather name="calendar" size={14} color={Colors.light.icon} />
                <Text style={styles.dateText}>{new Date(item.date).toLocaleDateString()}</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Details</Text>
          <View style={styles.detailRow}>
            <Feather name="tag" size={20} color={Colors.light.icon} />
            <Text style={styles.detailLabel}>Category:</Text>
            <Text style={styles.detailValue}>{item.category}</Text>
          </View>
          <View style={styles.detailRow}>
            <Feather name="info" size={20} color={Colors.light.icon} />
            <Text style={styles.detailLabel}>Status:</Text>
            <Text style={styles.detailValue}>{item.status}</Text>
          </View>
          {item.date && (
            <View style={styles.detailRow}>
              <Feather name="calendar" size={20} color={Colors.light.icon} />
              <Text style={styles.detailLabel}>Date:</Text>
              <Text style={styles.detailValue}>{new Date(item.date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={[styles.favouriteButton, isItemFavourite && styles.favouriteButtonActive]}
          onPress={toggleFavourite}
        >
          <Feather
            name="heart"
            size={24}
            color={isItemFavourite ? '#fff' : Colors.light.error}
            fill={isItemFavourite ? '#fff' : 'transparent'}
          />
          <Text style={[styles.favouriteButtonText, isItemFavourite && styles.favouriteButtonTextActive]}>
            {isItemFavourite ? 'Remove from Favourites' : 'Add to Favourites'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'Active':
      return Colors.light.success;
    case 'Upcoming':
      return Colors.light.primary;
    case 'Completed':
      return Colors.light.icon;
    default:
      return Colors.light.accent;
  }
}

function getCategoryIcon(category: string): any {
  switch (category) {
    case 'Match':
      return 'calendar';
    case 'Player':
      return 'user';
    case 'Team':
      return 'users';
    default:
      return 'activity';
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
    padding: 24,
  },
  errorText: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.light.text,
    marginTop: 16,
    marginBottom: 24,
  },
  imageContainer: {
    backgroundColor: Colors.light.cardBackground,
    paddingVertical: 60,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  largeEmoji: {
    fontSize: 120,
  },
  content: {
    padding: 24,
  },
  header: {
    marginBottom: 24,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  title: {
    flex: 1,
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  badges: {
    flexDirection: 'row',
    gap: 12,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.cardBackground,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 6,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  categoryText: {
    fontSize: 14,
    color: Colors.light.primary,
    fontWeight: '600',
  },
  dateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.cardBackground,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 6,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  dateText: {
    fontSize: 13,
    color: Colors.light.icon,
    fontWeight: '500',
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: Colors.light.icon,
    lineHeight: 24,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
    gap: 12,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    width: 80,
  },
  detailValue: {
    flex: 1,
    fontSize: 16,
    color: Colors.light.icon,
  },
  favouriteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.cardBackground,
    borderWidth: 2,
    borderColor: Colors.light.error,
    borderRadius: 16,
    paddingVertical: 16,
    marginTop: 12,
    gap: 10,
  },
  favouriteButtonActive: {
    backgroundColor: Colors.light.error,
    borderColor: Colors.light.error,
  },
  favouriteButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.error,
  },
  favouriteButtonTextActive: {
    color: '#fff',
  },
  button: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

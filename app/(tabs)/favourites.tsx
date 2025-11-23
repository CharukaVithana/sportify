import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useApp, SportItem } from '@/contexts/AppContext';

export default function FavouritesScreen() {
  const router = useRouter();
  const { favourites, removeFavourite } = useApp();

  const renderCard = ({ item }: { item: SportItem }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/details?id=${item.id}` as any)}
      activeOpacity={0.7}
    >
      <View style={styles.cardContent}>
        <View style={styles.emoji}>
          <Text style={styles.emojiText}>{item.image}</Text>
        </View>
        <View style={styles.cardInfo}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle} numberOfLines={1}>
              {item.title}
            </Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
              <Text style={styles.statusText}>{item.status}</Text>
            </View>
          </View>
          <Text style={styles.cardDescription} numberOfLines={2}>
            {item.description}
          </Text>
          <View style={styles.cardFooter}>
            <View style={styles.categoryBadge}>
              <Feather name={getCategoryIcon(item.category)} size={12} color={Colors.light.primary} />
              <Text style={styles.categoryText}>{item.category}</Text>
            </View>
            <TouchableOpacity
              onPress={() => removeFavourite(item.id)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Feather name="heart" size={20} color={Colors.light.error} fill={Colors.light.error} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Feather name="heart" size={80} color={Colors.light.border} />
      <Text style={styles.emptyTitle}>No Favourites Yet!</Text>
      <Text style={styles.emptyText}>
        Start adding your favorite sports events, players, and teams from the Home screen.
      </Text>
      <TouchableOpacity style={styles.exploreButton} onPress={() => router.push('/(tabs)')}>
        <Text style={styles.exploreButtonText}>Explore Sports</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Feather name="heart" size={24} color={Colors.light.error} />
        <Text style={styles.headerTitle}>My Favourites</Text>
        {favourites.length > 0 && (
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{favourites.length}</Text>
          </View>
        )}
      </View>

      <FlatList
        data={favourites}
        renderItem={renderCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={favourites.length === 0 ? styles.emptyListContent : styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmpty}
      />
    </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    gap: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  countBadge: {
    backgroundColor: Colors.light.error,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 28,
    alignItems: 'center',
  },
  countText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  listContent: {
    padding: 16,
  },
  emptyListContent: {
    flexGrow: 1,
  },
  card: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardContent: {
    flexDirection: 'row',
    padding: 16,
  },
  emoji: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: Colors.light.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  emojiText: {
    fontSize: 32,
  },
  cardInfo: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  cardTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.text,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  cardDescription: {
    fontSize: 14,
    color: Colors.light.icon,
    lineHeight: 20,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  categoryText: {
    fontSize: 12,
    color: Colors.light.primary,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginTop: 24,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.light.icon,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  exploreButton: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  exploreButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

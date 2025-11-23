import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/hooks/use-theme';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { removeFavouriteAsync, SportItem } from '@/store/slices/favouritesSlice';

export default function FavouritesScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { colors } = useTheme();
  const favourites = useAppSelector((state) => state.favourites.items);

  const handleRemoveFavourite = (id: string) => {
    dispatch(removeFavouriteAsync(id) as any);
  };

  const renderCard = ({ item }: { item: SportItem }) => {
    // Check if image is a URL or emoji
    const isImageUrl = item.image.startsWith('http');
    
    return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
      onPress={() => router.push(`/details?id=${item.id}` as any)}
      activeOpacity={0.7}
    >
      <View style={styles.cardContent}>
        <View style={[styles.imageContainer, { backgroundColor: isImageUrl ? 'transparent' : colors.border }]}>
          {isImageUrl ? (
            <Image 
              source={{ uri: item.image }} 
              style={styles.cardImage}
              resizeMode="cover"
            />
          ) : (
            <Text style={styles.emojiText}>{item.image}</Text>
          )}
        </View>
        <View style={styles.cardInfo}>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, { color: colors.text }]} numberOfLines={1}>
              {item.title}
            </Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
              <Text style={styles.statusText}>{item.status}</Text>
            </View>
          </View>
          <Text style={[styles.cardDescription, { color: colors.icon }]} numberOfLines={2}>
            {item.description}
          </Text>
          <View style={styles.cardFooter}>
            <View style={styles.categoryBadge}>
              <Feather name={getCategoryIcon(item.category)} size={12} color={colors.primary} />
              <Text style={[styles.categoryText, { color: colors.primary }]}>{item.category}</Text>
            </View>
            <TouchableOpacity
              onPress={() => handleRemoveFavourite(item.id)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Feather name="heart" size={20} color={colors.error} fill={colors.error} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Feather name="heart" size={80} color={colors.border} />
      <Text style={[styles.emptyTitle, { color: colors.text }]}>No Favourites Yet!</Text>
      <Text style={[styles.emptyText, { color: colors.icon }]}>
        Start adding your favorite sports events, players, and teams from the Home screen.
      </Text>
      <TouchableOpacity style={[styles.exploreButton, { backgroundColor: colors.error }]} onPress={() => router.push('/(tabs)')}>
        <Text style={styles.exploreButtonText}>Explore Sports</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <Feather name="heart" size={24} color={colors.error} />
        <Text style={[styles.headerTitle, { color: colors.text }]}>My Favourites</Text>
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
      return '#10b981';
    case 'Upcoming':
      return '#6366f1';
    case 'Completed':
      return '#9ca3af';
    default:
      return '#f59e0b';
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
  },
  countBadge: {
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
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
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
  imageContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    overflow: 'hidden',
  },
  cardImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
  },
  emoji: {
    width: 60,
    height: 60,
    borderRadius: 12,
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
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  categoryText: {
    fontSize: 12,
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
    marginTop: 24,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  exploreButton: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
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

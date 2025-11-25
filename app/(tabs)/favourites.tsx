import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, TextInput, ScrollView } from 'react-native';
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
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Basketball', 'Football', 'Tennis', 'Cricket'];

  const handleRemoveFavourite = (id: string) => {
    dispatch(removeFavouriteAsync(id));
  };

  // Filter favourites based on search and category
  const filteredFavourites = favourites.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Category filter based on sport type in description or title
    let matchesCategory = selectedCategory === 'All';
    if (!matchesCategory) {
      const lowerCategory = selectedCategory.toLowerCase();
      const lowerTitle = item.title.toLowerCase();
      const lowerDesc = item.description.toLowerCase();
      
      // Check if the category appears in title or description
      matchesCategory = lowerTitle.includes(lowerCategory) || lowerDesc.includes(lowerCategory);
    }
    
    return matchesSearch && matchesCategory;
  });

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

  const renderPromoCard = () => (
    <View style={[styles.promoCard, { backgroundColor: colors.primary }]}>
      <View style={styles.promoContent}>
        <Feather name="heart" size={32} color="#fff" />
        <View style={styles.promoTextContainer}>
          <Text style={styles.promoTitle}>Love More Teams & Players!</Text>
          <Text style={styles.promoDescription}>
            Add more favorites to keep track of your favorite teams and players
          </Text>
        </View>
      </View>
      <TouchableOpacity 
        style={styles.promoButton}
        onPress={() => router.push('/(tabs)')}
        activeOpacity={0.8}
      >
        <Text style={styles.promoButtonText}>Add More Favourites</Text>
        <Feather name="plus" size={16} color="#000" />
      </TouchableOpacity>
    </View>
  );

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

      {favourites.length > 0 && (
        <>
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <View style={[styles.searchBar, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
              <Feather name="search" size={20} color={colors.icon} />
              <TextInput
                style={[styles.searchInput, { color: colors.text }]}
                placeholder="Search teams, players..."
                placeholderTextColor={colors.icon}
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoCapitalize="none"
                autoCorrect={false}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <Feather name="x-circle" size={18} color={colors.icon} />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Category Filters */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterContainer}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.filterButton,
                  selectedCategory === category && { backgroundColor: '#CDFF00' },
                  selectedCategory !== category && { backgroundColor: colors.cardBackground, borderColor: colors.border }
                ]}
                onPress={() => setSelectedCategory(category)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.filterText,
                    selectedCategory === category ? { color: '#000' } : { color: colors.text }
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </>
      )}

      <FlatList
        data={filteredFavourites}
        renderItem={renderCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={filteredFavourites.length === 0 ? styles.emptyListContent : styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={filteredFavourites.length > 0 ? renderPromoCard : null}
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
  searchContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 4,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  filterContainer: {
    paddingHorizontal: 20,
    paddingVertical: 18,
    gap: 10,
  },
  filterButton: {
    paddingHorizontal: 20,
    height: 44,
    justifyContent: 'center',
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
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
  promoCard: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  promoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 16,
  },
  promoTextContainer: {
    flex: 1,
  },
  promoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 6,
  },
  promoDescription: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    lineHeight: 20,
  },
  promoButton: {
    backgroundColor: '#CDFF00',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  promoButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
});

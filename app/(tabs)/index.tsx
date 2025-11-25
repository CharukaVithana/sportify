import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl, Image, TextInput, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { useTheme } from '@/hooks/use-theme';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchSports } from '@/store/slices/sportsSlice';
import { addFavouriteAsync, removeFavouriteAsync, SportItem } from '@/store/slices/favouritesSlice';

export default function HomeScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { colors } = useTheme();
  const { items: sportsData, loading } = useAppSelector((state) => state.sports);
  const { items: favourites } = useAppSelector((state) => state.favourites);
  const user = useAppSelector((state) => state.auth.user);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Basketball', 'Football', 'Tennis', 'Cricket'];

  useEffect(() => {
    dispatch(fetchSports());
  }, [dispatch]);

  const onRefresh = () => {
    dispatch(fetchSports());
  };

  const isFavourite = (id: string) => {
    return favourites.some((fav) => fav.id === id);
  };

  const toggleFavourite = (item: SportItem) => {
    if (isFavourite(item.id)) {
      dispatch(removeFavouriteAsync(item.id));
      Toast.show({
        type: 'info',
        text1: 'Removed from Favourites',
        text2: `${item.title} has been removed`,
        position: 'bottom',
        visibilityTime: 2000,
      });
    } else {
      dispatch(addFavouriteAsync(item));
      Toast.show({
        type: 'success',
        text1: '❤️ Added to Favourites',
        text2: `${item.title} has been added!`,
        position: 'bottom',
        visibilityTime: 2000,
      });
    }
  };

  // Filter data based on search and category
  const filteredData = sportsData.filter((item) => {
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
              onPress={() => toggleFavourite(item)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Feather
                name="heart"
                size={20}
                color={isFavourite(item.id) ? colors.error : colors.icon}
                fill={isFavourite(item.id) ? colors.error : 'transparent'}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.text }]}>Loading sports data...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <View>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Sportify</Text>
          <Text style={[styles.headerSubtitle, { color: colors.icon }]}>Discover sports events</Text>
        </View>
        <TouchableOpacity 
          style={[styles.userCard, { backgroundColor: '#000000', borderColor: '#4CAF50' }]}
          onPress={() => router.push('/(tabs)/profile')}
          activeOpacity={0.8}
        >
          <View style={[styles.userAvatar, { backgroundColor: user?.avatar?.startsWith('data:image') ? 'transparent' : '#fff' }]}>
            {user?.avatar?.startsWith('data:image') ? (
              <Image source={{ uri: user.avatar }} style={styles.avatarImage} />
            ) : user?.avatar ? (
              <Text style={styles.avatarEmoji}>{user.avatar}</Text>
            ) : (
              <Text style={[styles.avatarText, { color: colors.primary }]}>{user?.name?.charAt(0).toUpperCase() || 'G'}</Text>
            )}
          </View>
          <Text style={styles.userName} numberOfLines={1}>{user?.name || 'Guest'}</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredData}
        renderItem={renderCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={onRefresh} colors={[colors.primary]} />
        }
        ListHeaderComponent={
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

            {/* Section Header */}
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Live & Upcoming</Text>
            </View>
          </>
        }
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 2,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  userAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  avatarEmoji: {
    fontSize: 18,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    maxWidth: 80,
  },
  userEmail: {
    fontSize: 11,
    maxWidth: 100,
  },
  userBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
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
});

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/hooks/use-theme';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addFavouriteAsync, removeFavouriteAsync } from '@/store/slices/favouritesSlice';

export default function DetailsScreen() {
  const { colors } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const sportsData = useAppSelector((state) => state.sports.items);
  const favourites = useAppSelector((state) => state.favourites.items);

  const item = sportsData.find((sport) => sport.id === id);

  if (!item) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: colors.background }]}>
        <Feather name="alert-circle" size={60} color={colors.error} />
        <Text style={[styles.errorText, { color: colors.text }]}>Item not found</Text>
        <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={() => router.back()}>
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isItemFavourite = favourites.some((fav) => fav.id === item.id);

  const toggleFavourite = () => {
    if (isItemFavourite) {
      dispatch(removeFavouriteAsync(item.id) as any);
      Alert.alert(
        'Removed from Favourites',
        `${item.title} has been removed from your favourites.`,
        [{ text: 'OK' }]
      );
    } else {
      dispatch(addFavouriteAsync(item) as any);
      Alert.alert(
        '❤️ Added to Favourites',
        `${item.title} has been added to your favourites!`,
        [{ text: 'OK' }]
      );
    }
  };

  // Check if image is a URL or emoji
  const isImageUrl = item.image.startsWith('http');

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
      <View style={[styles.imageContainer, { backgroundColor: isImageUrl ? colors.background : colors.cardBackground }]}>
        {isImageUrl ? (
          <Image 
            source={{ uri: item.image }} 
            style={styles.detailImage}
            resizeMode="contain"
          />
        ) : (
          <Text style={styles.largeEmoji}>{item.image}</Text>
        )}
      </View>

      <View style={styles.content}>
        <View style={[styles.header, { backgroundColor: colors.cardBackground, borderBottomColor: colors.border }]}>
          <View style={styles.titleContainer}>
            <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
              <Text style={styles.statusText}>{item.status}</Text>
            </View>
          </View>

          <View style={styles.badges}>
            <View style={[styles.categoryBadge, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
              <Feather name={getCategoryIcon(item.category)} size={16} color={colors.primary} />
              <Text style={[styles.categoryText, { color: colors.primary }]}>{item.category}</Text>
            </View>
            {item.date && (
              <View style={styles.dateBadge}>
                <Feather name="calendar" size={14} color={colors.icon} />
                <Text style={[styles.dateText, { color: colors.text }]}>{new Date(item.date).toLocaleDateString()}</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Description</Text>
          <Text style={[styles.description, { color: colors.text }]}>{item.description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Details</Text>
          <View style={styles.detailRow}>
            <Feather name="tag" size={20} color={colors.icon} />
            <Text style={[styles.detailLabel, { color: colors.icon }]}>Category:</Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>{item.category}</Text>
          </View>
          <View style={styles.detailRow}>
            <Feather name="info" size={20} color={colors.icon} />
            <Text style={[styles.detailLabel, { color: colors.icon }]}>Status:</Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>{item.status}</Text>
          </View>
          {item.date && (
            <View style={styles.detailRow}>
              <Feather name="calendar" size={20} color={colors.icon} />
              <Text style={[styles.detailLabel, { color: colors.icon }]}>Date:</Text>
              <Text style={[styles.detailValue, { color: colors.text }]}>{new Date(item.date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={[styles.favouriteButton, { backgroundColor: colors.cardBackground, borderColor: colors.border }, isItemFavourite && { backgroundColor: colors.error }]}
          onPress={toggleFavourite}
        >
          <Feather
            name="heart"
            size={24}
            color={isItemFavourite ? '#fff' : colors.error}
            fill={isItemFavourite ? '#fff' : 'transparent'}
          />
          <Text style={[styles.favouriteButtonText, { color: isItemFavourite ? '#fff' : colors.text }]}>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 24,
  },
  imageContainer: {
    paddingVertical: 60,
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  detailImage: {
    width: '100%',
    height: 250,
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
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 6,
    borderWidth: 1,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
  },
  dateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 6,
    borderWidth: 1,
  },
  dateText: {
    fontSize: 13,
    fontWeight: '500',
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    gap: 12,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: '600',
    width: 80,
  },
  detailValue: {
    flex: 1,
    fontSize: 16,
  },
  favouriteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderRadius: 16,
    paddingVertical: 16,
    marginTop: 12,
    gap: 10,
  },
  favouriteButtonActive: {
  },
  favouriteButtonText: {
    fontSize: 18,
    fontWeight: '700',
  },
  favouriteButtonTextActive: {
  },
  button: {
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

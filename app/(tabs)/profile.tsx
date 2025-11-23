import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Switch, ScrollView, Image } from 'react-native';
import { router, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '@/contexts/AppContext';
import { useTheme } from '@/hooks/use-theme';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logoutUser } from '@/store/slices/authSlice';

export default function ProfileScreen() {
  const dispatch = useAppDispatch();
  const routerHook = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const favourites = useAppSelector((state) => state.favourites.items);
  const sportsData = useAppSelector((state) => state.sports.items);
  const { theme, toggleTheme } = useApp();
  const { colors } = useTheme();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            dispatch(logoutUser() as any);
            // Navigate to login
            routerHook.push('/login');
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={theme === 'dark' ? ['#4CAF50', '#2E7D32', '#1B5E20'] : ['#81C784', '#4CAF50', '#388E3C']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientHeader}
      >
        <View style={styles.profileRow}>
          <View style={styles.avatarContainer}>
            <View style={[styles.avatar, { backgroundColor: user?.avatar?.startsWith('data:image') ? 'transparent' : '#fff' }]}>
              {user?.avatar?.startsWith('data:image') ? (
                <Image source={{ uri: user.avatar }} style={styles.avatarImage} />
              ) : user?.avatar ? (
                <Text style={styles.avatarEmoji}>{user.avatar}</Text>
              ) : (
                <Text style={[styles.avatarText, { color: colors.primary }]}>{user?.name?.charAt(0).toUpperCase() || 'G'}</Text>
              )}
            </View>
            <TouchableOpacity 
              style={styles.cameraButton}
              onPress={() => routerHook.push('/edit-profile')}
            >
              <Feather name="camera" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.name || 'Guest User'}</Text>
            <Text style={styles.userEmail}>{user?.email || 'guest@sportify.com'}</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={[styles.statsContainer, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
        <View style={styles.statBox}>
          <Feather name="heart" size={24} color={colors.error} />
          <Text style={[styles.statNumber, { color: colors.primary }]}>{favourites.length}</Text>
          <Text style={[styles.statLabel, { color: colors.icon }]}>Favourites</Text>
        </View>
        <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
        <View style={styles.statBox}>
          <Feather name="activity" size={24} color={colors.primary} />
          <Text style={[styles.statNumber, { color: colors.primary }]}>{sportsData.length}</Text>
          <Text style={[styles.statLabel, { color: colors.icon }]}>Events</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Preferences</Text>

        <View style={[styles.settingItem, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
          <View style={styles.settingLeft}>
            <View style={[styles.iconContainer, { backgroundColor: theme === 'dark' ? '#FFD700' : '#1f1f1f' }]}>
              <Feather name={theme === 'dark' ? 'sun' : 'moon'} size={20} color="#fff" />
            </View>
            <View>
              <Text style={[styles.settingLabel, { color: colors.text }]}>Dark Mode</Text>
              <Text style={[styles.settingDescription, { color: colors.icon }]}>Enable dark theme</Text>
            </View>
          </View>
          <Switch
            value={theme === 'dark'}
            onValueChange={toggleTheme}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor="#fff"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Account</Text>

        <TouchableOpacity 
          style={[styles.menuItem, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
          onPress={() => router.push('/edit-profile')}
        >
          <View style={styles.menuItemLeft}>
            <Feather name="user" size={20} color={colors.primary} />
            <Text style={[styles.menuItemText, { color: colors.text }]}>Edit Profile</Text>
          </View>
          <Feather name="chevron-right" size={20} color={colors.icon} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.menuItem, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
          onPress={handleLogout}
        >
          <View style={styles.menuItemLeft}>
            <Feather name="log-out" size={20} color={colors.error} />
            <Text style={[styles.menuItemText, { color: colors.error }]}>Logout</Text>
          </View>
          <Feather name="chevron-right" size={20} color={colors.icon} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientHeader: {
    paddingTop: 40,
    paddingBottom: 30,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 20,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 30,
  },
  header: {
    padding: 24,
    paddingTop: 16,
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#fff',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: -5,
    backgroundColor: '#4CAF50',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  avatarText: {
    fontSize: 42,
    fontWeight: 'bold',
  },
  avatarEmoji: {
    fontSize: 55,
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  userInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#fff',
  },
  userEmail: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 24,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    marginHorizontal: 20,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 13,
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  settingDescription: {
    fontSize: 13,
    marginTop: 2,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginTop: 40,
    marginBottom: 40,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

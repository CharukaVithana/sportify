import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Switch, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useApp } from '@/contexts/AppContext';
import { useTheme } from '@/hooks/use-theme';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, setUser, favourites, theme, toggleTheme } = useApp();
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
            setUser(null);
            router.replace('/login');
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
      <View style={[styles.header, { backgroundColor: colors.cardBackground, borderBottomColor: colors.border }]}>
        <View style={styles.avatarContainer}>
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <Text style={styles.avatarText}>{user?.name?.charAt(0).toUpperCase() || 'G'}</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={[styles.userName, { color: colors.text }]}>{user?.name || 'Guest User'}</Text>
            <Text style={[styles.userEmail, { color: colors.icon }]}>{user?.email || 'guest@sportify.com'}</Text>
          </View>
        </View>
        <TouchableOpacity 
          style={[styles.editButton, { backgroundColor: colors.primary }]}
          onPress={() => router.push('/edit-profile' as any)}
        >
          <Feather name="edit-2" size={16} color="#fff" />
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.statsContainer, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
        <View style={styles.statBox}>
          <Feather name="heart" size={24} color={colors.error} />
          <Text style={[styles.statNumber, { color: colors.primary }]}>{favourites.length}</Text>
          <Text style={[styles.statLabel, { color: colors.icon }]}>Favourites</Text>
        </View>
        <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
        <View style={styles.statBox}>
          <Feather name="activity" size={24} color={colors.primary} />
          <Text style={[styles.statNumber, { color: colors.primary }]}>10</Text>
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

        <TouchableOpacity style={[styles.menuItem, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
          <View style={styles.menuItemLeft}>
            <Feather name="bell" size={20} color={colors.icon} />
            <Text style={[styles.menuItemText, { color: colors.text }]}>Notifications</Text>
          </View>
          <Feather name="chevron-right" size={20} color={colors.icon} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.menuItem, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
          <View style={styles.menuItemLeft}>
            <Feather name="lock" size={20} color={colors.icon} />
            <Text style={[styles.menuItemText, { color: colors.text }]}>Privacy & Security</Text>
          </View>
          <Feather name="chevron-right" size={20} color={colors.icon} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.menuItem, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
          <View style={styles.menuItemLeft}>
            <Feather name="help-circle" size={20} color={colors.icon} />
            <Text style={[styles.menuItemText, { color: colors.text }]}>Help & Support</Text>
          </View>
          <Feather name="chevron-right" size={20} color={colors.icon} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={[styles.logoutButton, { borderColor: colors.error }]} onPress={handleLogout}>
        <Feather name="log-out" size={20} color={colors.error} />
        <Text style={[styles.logoutText, { color: colors.error }]}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 24,
    paddingTop: 16,
    borderBottomWidth: 1,
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
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
    marginTop: 10,
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

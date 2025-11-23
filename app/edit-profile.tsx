import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Modal, FlatList, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { useTheme } from '@/hooks/use-theme';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setUser } from '@/store/slices/authSlice';
import { editProfileSchema } from '@/schemas/validationSchemas';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

export default function EditProfileScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const { colors } = useTheme();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  const avatarEmojis = ['😀', '😎', '🤓', '🥳', '🤩', '😇', '🙂', '😊', '🤗', '🥰', '😍', '🤠', '👨‍💼', '👩‍💼', '👨‍🎓', '👩‍🎓', '⚽', '🏀', '🎾', '🏈'];

  const handleChangeAvatar = () => {
    setShowAvatarModal(true);
  };

  const pickImageFromGallery = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true, // Get base64 encoded string
    });

    if (!result.canceled && result.assets[0]) {
      // Store as base64 data URI for cross-platform compatibility
      const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
      setAvatar(base64Image);
      setShowAvatarModal(false);
    }
  };

  const selectAvatar = (emoji: string) => {
    setAvatar(emoji);
    setShowAvatarModal(false);
  };

  const handleSave = async () => {
    try {
      await editProfileSchema.validate({ name, email }, { abortEarly: false });
      setErrors({});

      const updatedUser = {
        ...user,
        name: name.trim(),
        email: email.trim(),
        avatar: avatar,
        token: user?.token || 'dummy-token',
      };

      // Update registered users list in AsyncStorage
      const registeredUsersStr = await AsyncStorage.getItem('registeredUsers');
      if (registeredUsersStr) {
        const registeredUsers = JSON.parse(registeredUsersStr);
        const userIndex = registeredUsers.findIndex((u: any) => u.email === user?.email);
        if (userIndex !== -1) {
          registeredUsers[userIndex] = {
            ...registeredUsers[userIndex],
            name: name.trim(),
            email: email.trim(),
            avatar: avatar,
          };
          await AsyncStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
        }
      }

      // Update current user in AsyncStorage
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Update Redux state
      dispatch(setUser(updatedUser));
      
      // Navigate back to profile immediately
      router.back();
      
      // Show success message after navigation
      setTimeout(() => {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Profile updated successfully!',
          position: 'top',
          visibilityTime: 2000,
        });
      }, 300);
    } catch (error: any) {
      if (error.name === 'ValidationError') {
        const validationErrors: any = {};
        error.inner.forEach((err: any) => {
          validationErrors[err.path] = err.message;
        });
        setErrors(validationErrors);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to update profile',
          position: 'top',
          visibilityTime: 3000,
        });
      }
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.avatarSection, { backgroundColor: colors.cardBackground, borderBottomColor: colors.border }]}>
          <View style={[styles.avatar, { backgroundColor: avatar?.startsWith('data:image') ? 'transparent' : colors.primary }]}>
            {avatar?.startsWith('data:image') ? (
              <Image source={{ uri: avatar }} style={styles.avatarImage} />
            ) : avatar ? (
              <Text style={styles.avatarEmoji}>{avatar}</Text>
            ) : (
              <Text style={styles.avatarText}>{name.charAt(0).toUpperCase() || 'G'}</Text>
            )}
          </View>
          <TouchableOpacity style={styles.changePhotoButton} onPress={handleChangeAvatar}>
            <Feather name="camera" size={20} color={colors.primary} />
            <Text style={[styles.changePhotoText, { color: colors.primary }]}>Change Photo</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Full Name</Text>
            <View style={[styles.inputContainer, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
              <Feather name="user" size={20} color={colors.icon} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Enter your name"
                placeholderTextColor={colors.icon}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Email</Text>
            <View style={[styles.inputContainer, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
              <Feather name="mail" size={20} color={colors.icon} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Enter your email"
                placeholderTextColor={colors.icon}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          </View>

          <TouchableOpacity 
            style={[styles.saveButton, { backgroundColor: colors.primary }]}
            onPress={handleSave}
          >
            <Feather name="check" size={20} color="#fff" />
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.cancelButton, { borderColor: colors.border }]}
            onPress={() => router.back()}
          >
            <Text style={[styles.cancelButtonText, { color: colors.text }]}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Avatar Selection Modal */}
      <Modal
        visible={showAvatarModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAvatarModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.cardBackground }]}>
            <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Choose Your Avatar</Text>
              <TouchableOpacity onPress={() => setShowAvatarModal(false)}>
                <Feather name="x" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity 
              style={[styles.galleryButton, { backgroundColor: colors.primary }]}
              onPress={pickImageFromGallery}
            >
              <Feather name="image" size={24} color="#fff" />
              <Text style={styles.galleryButtonText}>Choose from Gallery</Text>
            </TouchableOpacity>

            <Text style={[styles.orText, { color: colors.icon }]}>Or select an emoji</Text>

            <FlatList
              data={avatarEmojis}
              keyExtractor={(item) => item}
              numColumns={5}
              contentContainerStyle={styles.emojiGrid}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.emojiButton, { backgroundColor: colors.background }]}
                  onPress={() => selectAvatar(item)}
                >
                  <Text style={styles.emoji}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 32,
    borderBottomWidth: 1,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#fff',
  },
  avatarEmoji: {
    fontSize: 50,
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  changePhotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  changePhotoText: {
    fontSize: 15,
    fontWeight: '600',
  },
  form: {
    padding: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    gap: 12,
  },
  input: {
    flex: 1,
    height: 56,
    fontSize: 16,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 12,
    gap: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  cancelButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 12,
    borderWidth: 2,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  galleryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    margin: 20,
    marginBottom: 10,
    borderRadius: 12,
    gap: 10,
  },
  galleryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  orText: {
    textAlign: 'center',
    fontSize: 14,
    marginBottom: 10,
  },
  emojiGrid: {
    padding: 20,
  },
  emojiButton: {
    width: 60,
    height: 60,
    margin: 5,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 32,
  },
});


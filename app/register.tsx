import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useAppDispatch } from '@/store/hooks';
import { registerUser } from '@/store/slices/authSlice';
import { registerSchema } from '@/schemas/validationSchemas';

export default function RegisterScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<{ username?: string; email?: string; password?: string; confirmPassword?: string }>({});

  async function handleRegister() {
    try {
      await registerSchema.validate({ username, email, password, confirmPassword }, { abortEarly: false });
      setErrors({});

      // Register the user
      const newUser = {
        name: username.trim(),
        email: email.trim(),
        password: password, // Store password for validation
      };

      await dispatch(registerUser(newUser) as any);
      
      Alert.alert('Success', 'Account created successfully! Please login.', [
        { text: 'OK', onPress: () => router.replace('/login') }
      ]);
    } catch (error: any) {
      if (error.name === 'ValidationError') {
        const validationErrors: any = {};
        error.inner.forEach((err: any) => {
          validationErrors[err.path] = err.message;
        });
        setErrors(validationErrors);
      } else if (error.message === 'Email already registered') {
        Alert.alert('Registration Failed', 'This email is already registered. Please use a different email or login.');
      } else {
        Alert.alert('Error', 'An error occurred during registration');
      }
    }
  }

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800' }}
      style={styles.container}
      resizeMode="cover"
      blurRadius={8}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.card}>
            <Text style={styles.title}>Register</Text>

            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <Feather name="user" size={18} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Username"
                  placeholderTextColor="#999"
                  value={username}
                  autoCapitalize="words"
                  onChangeText={setUsername}
                />
              </View>
              {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}

              <View style={styles.inputContainer}>
                <Feather name="mail" size={18} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor="#999"
                  value={email}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  onChangeText={setEmail}
                />
              </View>
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

              <View style={styles.inputContainer}>
                <Feather name="lock" size={18} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="#999"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
              </View>
              {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

              <View style={styles.inputContainer}>
                <Feather name="lock" size={18} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Confirm Password"
                  placeholderTextColor="#999"
                  secureTextEntry={!showConfirm}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
              </View>
              {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}

              <TouchableOpacity style={styles.button} onPress={handleRegister}>
                <Text style={styles.buttonText}>Register</Text>
              </TouchableOpacity>

              <View style={styles.footer}>
                <Text style={styles.footerText}>Already have an account? </Text>
                <TouchableOpacity onPress={() => router.push('/login')}>
                  <Text style={styles.link}>Login</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 25,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 50,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#1a1a1a',
  },
  button: {
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#666',
  },
  link: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: -12,
    marginBottom: 12,
    marginLeft: 4,
  },
});

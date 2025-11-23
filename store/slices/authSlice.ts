import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id?: number;
  name: string;
  email: string;
  username?: string;
  token?: string;
  password?: string;
  avatar?: string;
  image?: string;
}

interface RegisteredUser {
  name: string;
  email: string;
  password: string;
  username?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setUser, logout, setLoading } = authSlice.actions;

// Helper function to get all registered users
const getRegisteredUsers = async (): Promise<RegisteredUser[]> => {
  try {
    const usersStr = await AsyncStorage.getItem('registeredUsers');
    return usersStr ? JSON.parse(usersStr) : [];
  } catch (error) {
    console.error('Error getting registered users:', error);
    return [];
  }
};

// Helper function to save registered user
const saveRegisteredUser = async (user: RegisteredUser): Promise<void> => {
  try {
    const users = await getRegisteredUsers();
    users.push(user);
    await AsyncStorage.setItem('registeredUsers', JSON.stringify(users));
  } catch (error) {
    console.error('Error saving registered user:', error);
    throw error;
  }
};

// Register new user - using DummyJSON API
export const registerUser = (user: RegisteredUser) => async (dispatch: any) => {
  try {
    // Check if email already exists
    const existingUsers = await getRegisteredUsers();
    const emailExists = existingUsers.some(
      (existingUser) => existingUser.email.toLowerCase() === user.email.toLowerCase()
    );
    
    if (emailExists) {
      throw new Error('This email is already registered. Please use a different email or login.');
    }

    // DummyJSON add user endpoint (Note: This is simulated, data won't persist on server)
    const response = await fetch('https://dummyjson.com/users/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: user.name.split(' ')[0] || user.name,
        lastName: user.name.split(' ')[1] || '',
        email: user.email,
        username: user.email.split('@')[0], // Create username from email
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }

    // Save locally for offline access - only save user data, don't auto-login
    const userToSave: RegisteredUser = {
      name: user.name,
      email: user.email,
      password: user.password,
      username: data.username || user.email.split('@')[0],
    };
    await saveRegisteredUser(userToSave);

    return { success: true, username: userToSave.username };
  } catch (error: any) {
    console.error('Register error:', error);
    throw error;
  }
};

// Login user - using DummyJSON API
export const loginUser = (username: string, password: string) => async (dispatch: any) => {
  try {
    // First, try DummyJSON API login
    const response = await fetch('https://dummyjson.com/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username,
        password,
        expiresInMins: 30,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      // DummyJSON returns: id, username, email, firstName, lastName, gender, image, token
      const loggedInUser: User = {
        id: data.id,
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        username: data.username,
        token: data.token,
        avatar: data.image, // Profile image from API
      };

      await AsyncStorage.setItem('user', JSON.stringify(loggedInUser));
      await AsyncStorage.setItem('authToken', data.token);
      dispatch(setUser(loggedInUser));

      return { success: true };
    }

    // If API login fails, try local registered users
    const users = await getRegisteredUsers();
    const localUser = users.find(
      u => (u.username?.toLowerCase() === username.toLowerCase() || 
            u.email.toLowerCase() === username.toLowerCase()) && 
           u.password === password
    );

    if (localUser) {
      const token = 'token-' + Date.now();
      const loggedInUser: User = {
        name: localUser.name,
        email: localUser.email,
        username: localUser.username || localUser.email.split('@')[0],
        token,
      };

      await AsyncStorage.setItem('user', JSON.stringify(loggedInUser));
      await AsyncStorage.setItem('authToken', token);
      dispatch(setUser(loggedInUser));

      return { success: true };
    }

    throw new Error('Invalid credentials');
  } catch (error: any) {
    console.error('Login error:', error);
    throw error;
  }
};

export const logoutUser = () => async (dispatch: any) => {
  try {
    await AsyncStorage.removeItem('user');
    await AsyncStorage.removeItem('authToken');
    dispatch(logout());
  } catch (error) {
    console.error('Logout error:', error);
  }
};

export const loadUser = () => async (dispatch: any) => {
  try {
    dispatch(setLoading(true));
    const userStr = await AsyncStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      dispatch(setUser(user));
    } else {
      dispatch(setLoading(false));
    }
  } catch (error) {
    console.error('Load user error:', error);
    dispatch(setLoading(false));
  }
};

export default authSlice.reducer;

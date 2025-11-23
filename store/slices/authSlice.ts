import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  name: string;
  email: string;
  token?: string;
  password?: string; // For validation only, not stored in state
  avatar?: string; // Emoji avatar
}

interface RegisteredUser {
  name: string;
  email: string;
  password: string;
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

// Register new user
export const registerUser = (user: RegisteredUser) => async (dispatch: any) => {
  try {
    // Check if email already exists
    const users = await getRegisteredUsers();
    const existingUser = users.find(u => u.email.toLowerCase() === user.email.toLowerCase());
    
    if (existingUser) {
      throw new Error('Email already registered');
    }

    // Save to registered users
    await saveRegisteredUser(user);

    // Log in the user
    const token = 'token-' + Date.now();
    const loggedInUser: User = {
      name: user.name,
      email: user.email,
      token,
    };

    await AsyncStorage.setItem('user', JSON.stringify(loggedInUser));
    await AsyncStorage.setItem('authToken', token);
    dispatch(setUser(loggedInUser));

    return { success: true };
  } catch (error: any) {
    console.error('Register error:', error);
    throw error;
  }
};

// Login user - validate against registered users
export const loginUser = (email: string, password: string) => async (dispatch: any) => {
  try {
    const users = await getRegisteredUsers();
    const user = users.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!user) {
      throw new Error('Invalid email or password');
    }

    const token = 'token-' + Date.now();
    const loggedInUser: User = {
      name: user.name,
      email: user.email,
      avatar: (user as any).avatar, // Include avatar from registered user
      token,
    };

    await AsyncStorage.setItem('user', JSON.stringify(loggedInUser));
    await AsyncStorage.setItem('authToken', token);
    dispatch(setUser(loggedInUser));

    return { success: true };
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

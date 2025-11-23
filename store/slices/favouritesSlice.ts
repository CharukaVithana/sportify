import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface SportItem {
  id: string;
  title: string;
  description: string;
  image: string;
  status: 'Active' | 'Upcoming' | 'Completed';
  category: 'Match' | 'Player' | 'Team';
  date?: string;
}

interface FavouritesState {
  items: SportItem[];
  loading: boolean;
}

const initialState: FavouritesState = {
  items: [],
  loading: true,
};

const favouritesSlice = createSlice({
  name: 'favourites',
  initialState,
  reducers: {
    setFavourites: (state, action: PayloadAction<SportItem[]>) => {
      state.items = action.payload;
      state.loading = false;
    },
    addFavourite: (state, action: PayloadAction<SportItem>) => {
      const exists = state.items.find((item) => item.id === action.payload.id);
      if (!exists) {
        state.items.push(action.payload);
      }
    },
    removeFavourite: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setFavourites, addFavourite, removeFavourite, setLoading } = favouritesSlice.actions;

// Async actions with AsyncStorage - User-specific favorites
export const loadFavourites = () => async (dispatch: any, getState: any) => {
  try {
    dispatch(setLoading(true));
    const { auth } = getState();
    const userId = auth.user?.email || auth.user?.username || 'guest';
    const favouritesStr = await AsyncStorage.getItem(`favourites_${userId}`);
    if (favouritesStr) {
      const favourites = JSON.parse(favouritesStr);
      dispatch(setFavourites(favourites));
    } else {
      dispatch(setFavourites([]));
      dispatch(setLoading(false));
    }
  } catch (error) {
    console.error('Load favourites error:', error);
    dispatch(setLoading(false));
  }
};

export const addFavouriteAsync = (item: SportItem) => async (dispatch: any, getState: any) => {
  try {
    const { favourites, auth } = getState();
    const userId = auth.user?.email || auth.user?.username || 'guest';
    
    // Check if already exists
    const exists = favourites.items.find((fav: SportItem) => fav.id === item.id);
    if (exists) {
      return; // Already in favorites, don't add again
    }
    
    // Add to Redux state
    dispatch(addFavourite(item));
    
    // Get updated state after dispatch
    const updatedState = getState();
    await AsyncStorage.setItem(`favourites_${userId}`, JSON.stringify(updatedState.favourites.items));
  } catch (error) {
    console.error('Add favourite error:', error);
  }
};

export const removeFavouriteAsync = (id: string) => async (dispatch: any, getState: any) => {
  try {
    const { auth } = getState();
    const userId = auth.user?.email || auth.user?.username || 'guest';
    
    // Remove from Redux state
    dispatch(removeFavourite(id));
    
    // Get updated state after dispatch
    const updatedState = getState();
    await AsyncStorage.setItem(`favourites_${userId}`, JSON.stringify(updatedState.favourites.items));
  } catch (error) {
    console.error('Remove favourite error:', error);
  }
};

// Clear favorites on logout
export const clearFavourites = () => async (dispatch: any) => {
  dispatch(setFavourites([]));
};

export default favouritesSlice.reducer;

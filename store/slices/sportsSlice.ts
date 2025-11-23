import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchSportsData } from '@/services/sportsApi';
import { SportItem } from './favouritesSlice';

interface SportsState {
  items: SportItem[];
  loading: boolean;
  error: string | null;
}

const initialState: SportsState = {
  items: [],
  loading: false,
  error: null,
};

// Async thunk for fetching sports data
export const fetchSports = createAsyncThunk('sports/fetchSports', async () => {
  const data = await fetchSportsData();
  return data;
});

const sportsSlice = createSlice({
  name: 'sports',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSports.fulfilled, (state, action: PayloadAction<SportItem[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchSports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch sports data';
      });
  },
});

export default sportsSlice.reducer;

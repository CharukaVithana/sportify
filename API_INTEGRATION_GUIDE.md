# API Integration Guide - TheSportsDB.com

## 🎯 Objective
Replace mock data with real sports data from TheSportsDB API to meet the 15 marks "API Integration & Data Display" criterion.

## 📝 Step 1: Get API Key

1. Visit: https://www.thesportsdb.com/api.php
2. Sign up for a free API key
3. Free tier provides: 30 requests per minute

## 🔧 Step 2: Create API Service

**File:** `services/theSportsDB.ts`

```typescript
const API_KEY = '3'; // Free test key, replace with your own
const BASE_URL = 'https://www.thesportsdb.com/api/v1/json';

export interface SportsDBEvent {
  idEvent: string;
  strEvent: string;
  strEventAlternate: string;
  strDescriptionEN: string;
  strSport: string;
  strLeague: string;
  dateEvent: string;
  strStatus: string;
  strThumb?: string;
}

export async function fetchLiveEvents(): Promise<SportsDBEvent[]> {
  try {
    const response = await fetch(`${BASE_URL}/${API_KEY}/eventsday.php`);
    if (!response.ok) throw new Error('Failed to fetch events');
    const data = await response.json();
    return data.events || [];
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

export async function fetchEventsByLeague(leagueId: string): Promise<SportsDBEvent[]> {
  try {
    const response = await fetch(`${BASE_URL}/${API_KEY}/eventsseason.php?id=${leagueId}&s=2024-2025`);
    if (!response.ok) throw new Error('Failed to fetch league events');
    const data = await response.json();
    return data.events || [];
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

export async function searchEvents(query: string): Promise<SportsDBEvent[]> {
  try {
    const response = await fetch(`${BASE_URL}/${API_KEY}/searchevents.php?e=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error('Failed to search events');
    const data = await response.json();
    return data.event || [];
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}
```

## 🔄 Step 3: Update Data Mapper

**File:** `services/dataMapper.ts`

```typescript
import { SportItem } from '@/store/slices/favouritesSlice';
import { SportsDBEvent } from './theSportsDB';

export function mapEventToSportItem(event: SportsDBEvent): SportItem {
  // Determine status based on event data
  let status: 'Active' | 'Upcoming' | 'Completed' = 'Upcoming';
  if (event.strStatus === 'Match Finished') status = 'Completed';
  else if (event.strStatus === 'In Progress') status = 'Active';

  // Map sport to emoji
  const sportEmojis: Record<string, string> = {
    'Soccer': '⚽',
    'Basketball': '🏀',
    'Tennis': '🎾',
    'American Football': '🏈',
    'Baseball': '⚾',
    'Rugby': '🏉',
    'Cricket': '🏏',
    'Hockey': '🏒',
  };

  return {
    id: event.idEvent,
    title: event.strEvent || event.strEventAlternate || 'Untitled Event',
    description: event.strDescriptionEN || `${event.strSport} event in ${event.strLeague}`,
    image: sportEmojis[event.strSport] || '🏆',
    status,
    category: 'Match', // Most events are matches
    date: event.dateEvent,
  };
}
```

## 🔧 Step 4: Update Redux Slice

**File:** `store/slices/sportsSlice.ts`

```typescript
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchLiveEvents } from '@/services/theSportsDB';
import { mapEventToSportItem } from '@/services/dataMapper';
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

// Async thunk for fetching sports data from real API
export const fetchSports = createAsyncThunk('sports/fetchSports', async () => {
  const events = await fetchLiveEvents();
  return events.map(mapEventToSportItem).slice(0, 20); // Limit to 20 items
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
```

## 📱 Step 5: Update Home Screen (Optional Enhancement)

**File:** `app/(tabs)/index.tsx`

Add search functionality:

```typescript
const [searchQuery, setSearchQuery] = useState('');

const filteredData = sportsData.filter(item =>
  item.title.toLowerCase().includes(searchQuery.toLowerCase())
);

// In render:
<TextInput
  style={styles.searchInput}
  placeholder="Search events..."
  value={searchQuery}
  onChangeText={setSearchQuery}
/>
```

## 🎨 Step 6: Update Details Screen

**File:** `app/details.tsx`

Add more event details:

```tsx
{item.date && (
  <View style={styles.detailRow}>
    <Feather name="calendar" size={20} color={colors.icon} />
    <Text style={[styles.detailText, { color: colors.text }]}>
      {new Date(item.date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })}
    </Text>
  </View>
)}
```

## 🧪 Testing Checklist

- [ ] API key configured correctly
- [ ] Data fetches on app load
- [ ] Loading indicator shows while fetching
- [ ] Error message displays if API fails
- [ ] Events display with correct data
- [ ] Pull-to-refresh refetches data
- [ ] Favourites work with API data
- [ ] Details screen shows API event data
- [ ] No data scenario handled gracefully

## 🚨 Error Handling Best Practices

```typescript
// Add retry logic
export const fetchSportsWithRetry = createAsyncThunk(
  'sports/fetchWithRetry',
  async (_, { rejectWithValue }) => {
    let retries = 3;
    while (retries > 0) {
      try {
        const events = await fetchLiveEvents();
        return events.map(mapEventToSportItem);
      } catch (error) {
        retries--;
        if (retries === 0) return rejectWithValue('Failed after 3 attempts');
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1s
      }
    }
  }
);
```

## 📊 API Endpoints Available

| Endpoint | Description | Example |
|----------|-------------|---------|
| `/eventsday.php` | Today's events | All sports today |
| `/eventsseason.php?id={leagueId}&s={season}` | Season events | Premier League 2024-2025 |
| `/searchevents.php?e={query}` | Search events | "Manchester vs Liverpool" |
| `/lookupevent.php?id={eventId}` | Event details | Full event info |
| `/eventsnextleague.php?id={leagueId}` | Upcoming events | Next 15 events |

## 🎓 Popular League IDs

- **4328** - English Premier League
- **4391** - NBA
- **4424** - NFL
- **4380** - La Liga (Spain)
- **4387** - Serie A (Italy)

## 🔐 Environment Variables (Optional)

For production, use environment variables:

```bash
# .env
EXPO_PUBLIC_SPORTSDB_API_KEY=your_api_key_here
```

```typescript
// In code
const API_KEY = process.env.EXPO_PUBLIC_SPORTSDB_API_KEY || '3';
```

## 🎯 Expected Result

After implementation:
- Real sports events displayed on home screen
- Live updates when pull-to-refresh
- Actual event descriptions and dates
- Proper status indicators (Active, Upcoming, Completed)
- **+15 marks** for API Integration criterion

## 📝 Documentation to Submit

Include in your assignment report:
1. API endpoints used
2. Data mapping strategy
3. Error handling approach
4. Screenshots of real data
5. Code snippets showing API integration

---

**Note:** The free API key (3) has rate limits. For production, register for a personal key at thesportsdb.com.

# Sportify Quick Reference Guide

## 🚀 Run the App

```bash
# Start development server
npx expo start

# Run on physical device
# Scan QR code with Expo Go app

# Run on iOS simulator
npx expo start --ios

# Run on Android emulator
npx expo start --android

# Run on web
npx expo start --web
```

## 📂 Project Structure

```
sportify/
├── app/                        # Screens (Expo Router)
│   ├── _layout.tsx            # Root layout with Redux Provider
│   ├── index.tsx              # Redirect to splash
│   ├── splash.tsx             # Splash screen
│   ├── login.tsx              # Login with Yup validation
│   ├── register.tsx           # Register with Yup validation
│   ├── details.tsx            # Item details
│   ├── edit-profile.tsx       # Edit profile with validation
│   └── (tabs)/                # Tab navigator
│       ├── _layout.tsx        # Tab configuration
│       ├── index.tsx          # Home (sports list)
│       ├── favourites.tsx     # Favourites list
│       ├── profile.tsx        # Profile & settings
│       └── explore.tsx        # Explore (template)
├── store/                      # Redux Toolkit
│   ├── index.ts               # Store configuration
│   ├── hooks.ts               # Typed Redux hooks
│   └── slices/
│       ├── authSlice.ts       # Auth state & actions
│       ├── favouritesSlice.ts # Favourites with AsyncStorage
│       └── sportsSlice.ts     # Sports data with thunks
├── schemas/                    # Validation
│   └── validationSchemas.ts   # Yup schemas
├── services/                   # API & Data
│   └── sportsApi.ts           # Mock data (replace with real API)
├── contexts/                   # Context API (theme only)
│   └── AppContext.tsx         # Theme provider
├── constants/                  # Constants
│   └── theme.ts               # Color schemes
└── hooks/                      # Custom hooks
    └── use-theme.ts           # Theme hook
```

## 🔑 Key Commands

### Redux State Access
```typescript
import { useAppDispatch, useAppSelector } from '@/store/hooks';

// Get state
const user = useAppSelector((state) => state.auth.user);
const favourites = useAppSelector((state) => state.favourites.items);

// Dispatch actions
const dispatch = useAppDispatch();
dispatch(loginUser(userData) as any);
```

### Form Validation
```typescript
import { loginSchema } from '@/schemas/validationSchemas';

// Validate
await loginSchema.validate({ email, password }, { abortEarly: false });

// Handle errors
catch (error: any) {
  if (error.name === 'ValidationError') {
    error.inner.forEach((err: any) => {
      console.log(err.path, err.message);
    });
  }
}
```

### AsyncStorage
```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

// Save
await AsyncStorage.setItem('key', JSON.stringify(data));

// Load
const data = await AsyncStorage.getItem('key');
const parsed = data ? JSON.parse(data) : null;

// Remove
await AsyncStorage.removeItem('key');
```

## 🎨 Color Scheme

```typescript
// Primary colors
primary: '#6366f1'      // Indigo
primaryLight: '#818cf8'
primaryDark: '#4f46e5'

// Status colors
success: '#10b981'      // Green
error: '#ef4444'        // Red
warning: '#f59e0b'      // Amber

// UI colors
background: '#ffffff'
text: '#111827'
icon: '#6b7280'
border: '#e5e7eb'
```

## 📱 Navigation

```typescript
import { useRouter } from 'expo-router';

const router = useRouter();

// Navigate
router.push('/login');
router.push('/details?id=123');
router.push('/(tabs)');

// Replace (no back button)
router.replace('/login');

// Go back
router.back();
```

## 🔐 Authentication Flow

```
Splash (2s) → Login → Tabs (Home, Favourites, Explore, Profile)
                ↓
            Register → Tabs
```

## 📊 Redux Store State

```typescript
{
  auth: {
    user: {
      name: string,
      email: string,
      token?: string
    } | null,
    isAuthenticated: boolean,
    loading: boolean
  },
  favourites: {
    items: SportItem[],
    loading: boolean
  },
  sports: {
    items: SportItem[],
    loading: boolean,
    error: string | null
  }
}
```

## 🧩 SportItem Interface

```typescript
interface SportItem {
  id: string;
  title: string;
  description: string;
  image: string;              // Emoji
  status: 'Active' | 'Upcoming' | 'Completed';
  category: 'Match' | 'Player' | 'Team';
  date?: string;
}
```

## ✅ Validation Schemas

### Login
- Email: Required, valid email format
- Password: Required, min 6 characters

### Register
- Username: Required, 3-20 characters
- Email: Required, valid email format
- Password: Required, min 6 chars, must have uppercase, lowercase, number
- Confirm Password: Required, must match password

### Edit Profile
- Name: Required, 3-50 characters
- Email: Required, valid email format

## 🎯 Assignment Checklist

- [✅] Redux Toolkit state management
- [✅] AsyncStorage data persistence
- [✅] Yup form validation
- [✅] Authentication (login/register/logout)
- [✅] Navigation (Expo Router with tabs)
- [✅] Favourites functionality
- [✅] Dark mode toggle
- [⚠️] Real API integration (pending)
- [✅] Clean UI/UX design
- [✅] TypeScript implementation

## 🐛 Common Issues & Fixes

### Issue: "Cannot find module '@/store'"
**Fix:** Check `tsconfig.json` has path mapping:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### Issue: Redux dispatch type error
**Fix:** Use typed hooks from `@/store/hooks`:
```typescript
import { useAppDispatch } from '@/store/hooks';
```

### Issue: AsyncStorage not persisting
**Fix:** Ensure data is stringified:
```typescript
await AsyncStorage.setItem('key', JSON.stringify(data));
```

### Issue: Validation not showing errors
**Fix:** Set `abortEarly: false` in validate options:
```typescript
await schema.validate(data, { abortEarly: false });
```

## 📚 Documentation Links

- **Expo Router:** https://docs.expo.dev/router/introduction/
- **Redux Toolkit:** https://redux-toolkit.js.org/
- **Yup Validation:** https://github.com/jquense/yup
- **AsyncStorage:** https://react-native-async-storage.github.io/async-storage/
- **TheSportsDB API:** https://www.thesportsdb.com/api.php

## 🎓 Assignment Tips

1. **Screenshots:** Take screenshots showing:
   - Login/Register with validation errors
   - Home screen with data
   - Favourites with items
   - Profile with dark mode
   - Details screen

2. **Code Comments:** Add comments explaining:
   - Redux actions and reducers
   - Validation schemas
   - AsyncStorage usage
   - API integration

3. **README:** Include:
   - Installation instructions
   - Features implemented
   - Technologies used
   - Screenshots
   - Known limitations

4. **Testing:** Test these scenarios:
   - Invalid login credentials
   - Password mismatch on register
   - Add/remove favourites
   - App restart (persistence)
   - Dark mode toggle
   - Pull-to-refresh

## 🔧 Development Tools

```bash
# Install dependencies
npm install

# Clear cache if issues
npx expo start --clear

# Check for TypeScript errors
npx tsc --noEmit

# Format code
npx prettier --write .

# Lint code
npx eslint .
```

## 📞 Quick Support

**Metro bundler error?**
- Stop server (Ctrl+C)
- Clear cache: `npx expo start --clear`
- Restart server

**Module not found?**
- Check import paths use `@/` prefix
- Restart TypeScript server in VS Code

**Redux state not updating?**
- Check if action is dispatched
- Verify reducer handles action
- Use Redux DevTools

---

**Last Updated:** 2024
**Status:** Production-ready (pending real API)
**Assignment:** IN3210 Mobile Applications Development - Assignment 2

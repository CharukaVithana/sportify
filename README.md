# 🏆 Sportify - Your Sports Hub

A beautiful, user-friendly React Native mobile app built with Expo for discovering and tracking sports events, players, and teams.

## ✨ Features

### 📱 Screens Implemented

1. **Splash Screen** - Welcoming animation with app logo
2. **Login Screen** - Clean authentication with email/password
3. **Register Screen** - User registration with validation
4. **Home Screen** - Browse sports items with API integration
5. **Details Screen** - Full information about selected items
6. **Favourites Screen** - Manage your favorite sports items
7. **Profile Screen** - User settings and preferences
8. **Explore Screen** - Additional content discovery

### 🎨 UI/UX Features

- **Clean, Modern Design** with indigo/purple color scheme
- **Smooth Animations** and transitions
- **Responsive Cards** with emoji icons
- **Pull-to-Refresh** on home screen
- **Dark Mode Toggle** (UI implemented)
- **Status Badges** (Active/Upcoming/Completed)
- **Category Icons** (Match/Player/Team)
- **Heart Icon** for favourites
- **Professional Tab Navigation**

### 🛠️ Technical Features

- **Expo Router** for file-based routing
- **React Context API** for state management
- **TypeScript** for type safety
- **Mock API** with sports data
- **Feather Icons** throughout
- **Form Validation** on login/register
- **KeyboardAvoidingView** for better UX

## 📂 Project Structure

```
sportify/
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx          # Home screen
│   │   ├── favourites.tsx     # Favourites screen
│   │   ├── profile.tsx        # Profile screen  
│   │   ├── explore.tsx        # Explore screen
│   │   └── _layout.tsx        # Tab navigator
│   ├── details.tsx            # Details screen
│   ├── login.tsx              # Login screen
│   ├── register.tsx           # Register screen
│   ├── splash.tsx             # Splash screen
│   ├── index.tsx              # Root redirect
│   └── _layout.tsx            # Root layout with providers
├── contexts/
│   └── AppContext.tsx         # Global app state
├── services/
│   └── sportsApi.ts           # Mock API data
├── constants/
│   └── theme.ts               # Colors and styles
└── components/                # Reusable components
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Expo Go app on your phone
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start the development server
npx expo start

# Or with cleared cache
npx expo start -c
```

### Running the App

1. **On Mobile Device:**
   - Open Expo Go app
   - Scan the QR code from terminal
   - App will load automatically

2. **On Web:**
   - Press `w` in the terminal
   - Opens in browser at localhost:8081

## 📱 App Flow

1. **App Opens** → Splash Screen (2 seconds)
2. **Splash** → Login Screen
3. **Login** → Home Screen (Tabs)
4. **Tap Card** → Details Screen
5. **Heart Icon** → Add/Remove Favourites
6. **Profile** → Settings & Logout

## 🎯 Mock Data

The app includes 10 mock sports items:
- NBA matches (Lakers vs Warriors)
- Tennis events (Wimbledon Finals)
- Football players (Messi, Ronaldo)
- Formula 1 races (Monaco GP)
- Teams (Manchester United, Warriors)
- And more!

## 🎨 Color Scheme

- **Primary:** #6366f1 (Indigo)
- **Success:** #10b981 (Green)
- **Error:** #ef4444 (Red)
- **Background:** #fff (White)
- **Card Background:** #f9fafb (Light Gray)

## 📝 TODO / Next Steps

- [ ] Connect to real sports API (SportRadar, ESPN, etc.)
- [ ] Implement actual authentication
- [ ] Add search functionality
- [ ] Enable dark mode properly
- [ ] Add notifications
- [ ] Implement user profile editing
- [ ] Add social features (share, comment)
- [ ] Cache data with AsyncStorage
- [ ] Add loading skeletons
- [ ] Implement error boundaries

## 🐛 Known Issues

- Routes use `as any` for TypeScript - will be fixed in Expo Router update
- Dark mode is UI only (not functional yet)
- User data is not persisted

## 📄 License

This project is for educational purposes.

## 👨‍💻 Developer

Built with ❤️ using Expo, React Native, and TypeScript

---

**Note:** This is a demo app with mock data. Replace mock API calls with real sports API for production use.
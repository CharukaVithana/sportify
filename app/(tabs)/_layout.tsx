import { Tabs } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@/hooks/use-theme";

export default function TabLayout() {
  const { colors } = useTheme();
  
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.icon,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 85,
          paddingBottom: 15,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginTop: 5,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Feather name="home" size={20} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="favourites"
        options={{
          title: "Favourites",
          tabBarIcon: ({ color, size }) => (
            <Feather name="heart" size={20} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="explore"
        options={{
          href: null, // Hide from tab bar
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Feather name="user" size={20} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

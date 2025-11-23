/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

export const Colors = {
  light: {
    background: '#FFFFFF',
    cardBackground: '#FFFFFF',
    text: '#1a1a1a',
    icon: '#666666',
    border: '#E0E0E0',
    primary: '#4CAF50',
    success: '#4CAF50',
    error: '#ef4444',
    inputBackground: '#F5F5F5',
    placeholderText: '#999999',
    tint: '#4CAF50',
    tabIconDefault: '#666666',
    tabIconSelected: '#4CAF50',
    secondary: '#ffffff',
    accent: '#e5e7eb',
  },
  dark: {
    background: '#121212',
    cardBackground: '#1E1E1E',
    text: '#FFFFFF',
    icon: '#B0B0B0',
    border: '#2C2C2C',
    primary: '#4CAF50',
    success: '#4CAF50',
    error: '#ef4444',
    inputBackground: '#2C2C2C',
    placeholderText: '#666666',
    tint: '#4CAF50',
    tabIconDefault: '#B0B0B0',
    tabIconSelected: '#4CAF50',
    secondary: '#1e293b',
    accent: '#334155',
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

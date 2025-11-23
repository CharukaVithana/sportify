import { Colors } from '@/constants/theme';
import { useApp } from '@/contexts/AppContext';

export function useTheme() {
  const { theme } = useApp();
  const colors = theme === 'dark' ? Colors.dark : Colors.light;
  
  return { colors, theme };
}

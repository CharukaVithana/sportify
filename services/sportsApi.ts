import { SportItem } from '@/contexts/AppContext';

// Mock sports data - Replace this with actual API calls
export const mockSportsData: SportItem[] = [
  {
    id: '1',
    title: 'Lakers vs Warriors',
    description: 'NBA Finals - Game 7. An epic showdown between two legendary teams.',
    image: '🏀',
    status: 'Upcoming',
    category: 'Match',
    date: '2025-12-15',
  },
  {
    id: '2',
    title: 'Lionel Messi',
    description: 'Football legend. 8-time Ballon d\'Or winner and World Cup champion.',
    image: '⚽',
    status: 'Active',
    category: 'Player',
  },
  {
    id: '3',
    title: 'Manchester United',
    description: 'One of the most successful football clubs in English football history.',
    image: '🔴',
    status: 'Active',
    category: 'Team',
  },
  {
    id: '4',
    title: 'Wimbledon Finals',
    description: 'Tennis Grand Slam Championship. The oldest tennis tournament in the world.',
    image: '🎾',
    status: 'Upcoming',
    category: 'Match',
    date: '2025-07-14',
  },
  {
    id: '5',
    title: 'Serena Williams',
    description: 'Tennis icon with 23 Grand Slam singles titles.',
    image: '🎾',
    status: 'Active',
    category: 'Player',
  },
  {
    id: '6',
    title: 'Super Bowl LVIII',
    description: 'NFL Championship Game. The biggest sporting event in America.',
    image: '🏈',
    status: 'Upcoming',
    category: 'Match',
    date: '2026-02-09',
  },
  {
    id: '7',
    title: 'Cristiano Ronaldo',
    description: 'Portuguese football superstar. All-time top scorer in Champions League.',
    image: '⚽',
    status: 'Active',
    category: 'Player',
  },
  {
    id: '8',
    title: 'Golden State Warriors',
    description: 'NBA Champions with a dynasty of success in recent years.',
    image: '🏀',
    status: 'Active',
    category: 'Team',
  },
  {
    id: '9',
    title: 'Formula 1 - Monaco GP',
    description: 'The most prestigious race in Formula 1 calendar.',
    image: '🏎️',
    status: 'Upcoming',
    category: 'Match',
    date: '2025-05-25',
  },
  {
    id: '10',
    title: 'Lewis Hamilton',
    description: '7-time Formula 1 World Champion. One of the greatest drivers ever.',
    image: '🏎️',
    status: 'Active',
    category: 'Player',
  },
];

// Simulate API call
export const fetchSportsData = async (): Promise<SportItem[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockSportsData);
    }, 1000);
  });
};

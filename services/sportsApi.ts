import { SportItem } from '@/store/slices/favouritesSlice';

// TheSportsDB API Configuration
const API_BASE_URL = 'https://www.thesportsdb.com/api/v1/json';
const API_KEY = '3'; // Free API key (use '3' for testing, upgrade for more features)

// Sport emoji mapping
const sportEmojis: { [key: string]: string } = {
  'Soccer': '⚽',
  'Basketball': '🏀',
  'American Football': '🏈',
  'Tennis': '🎾',
  'Baseball': '⚾',
  'Rugby': '🏉',
  'Cricket': '🏏',
  'Ice Hockey': '🏒',
  'Volleyball': '🏐',
  'Golf': '⛳',
  'Motorsport': '🏎️',
  'Fighting': '🥊',
  'Cycling': '🚴',
  'Swimming': '🏊',
};

// Fetch teams from popular leagues
const fetchTeams = async (): Promise<SportItem[]> => {
  try {
    const leagues = [
      { id: '4328', name: 'English Premier League' }, // Soccer
      { id: '4387', name: 'NBA' }, // Basketball
      { id: '4391', name: 'NFL' }, // American Football
    ];

    const allTeams: SportItem[] = [];

    for (const league of leagues) {
      const response = await fetch(
        `${API_BASE_URL}/${API_KEY}/lookup_all_teams.php?id=${league.id}`
      );
      const data = await response.json();

      if (data.teams) {
        const teams = data.teams.slice(0, 5).map((team: any) => ({
          id: team.idTeam,
          title: team.strTeam,
          description: team.strDescriptionEN?.substring(0, 100) || `${team.strTeam} - ${league.name}`,
          image: team.strBadge || team.strLogo || sportEmojis[team.strSport] || '🏆',
          status: 'Active',
          category: 'Team',
        }));
        allTeams.push(...teams);
      }
    }

    return allTeams;
  } catch (error) {
    console.error('Error fetching teams:', error);
    return [];
  }
};

// Fetch popular players
const fetchPlayers = async (): Promise<SportItem[]> => {
  try {
    const teams = [
      '133604', // Arsenal
      '133739', // Lakers
      '134920', // Real Madrid
    ];

    const allPlayers: SportItem[] = [];

    for (const teamId of teams) {
      const response = await fetch(
        `${API_BASE_URL}/${API_KEY}/lookup_all_players.php?id=${teamId}`
      );
      const data = await response.json();

      if (data.player) {
        const players = data.player.slice(0, 3).map((player: any) => ({
          id: player.idPlayer,
          title: player.strPlayer,
          description: player.strDescriptionEN?.substring(0, 100) || `${player.strPosition || 'Player'} - ${player.strNationality || 'Professional'}`,
          image: player.strThumb || player.strCutout || player.strFanart1 || sportEmojis[player.strSport] || '👤',
          status: 'Active',
          category: 'Player',
        }));
        allPlayers.push(...players);
      }
    }

    return allPlayers;
  } catch (error) {
    console.error('Error fetching players:', error);
    return [];
  }
};

// Fetch upcoming events
const fetchUpcomingEvents = async (): Promise<SportItem[]> => {
  try {
    const leagues = [
      '4328', // Premier League
      '4387', // NBA
      '4391', // NFL
    ];

    const allEvents: SportItem[] = [];

    for (const leagueId of leagues) {
      const response = await fetch(
        `${API_BASE_URL}/${API_KEY}/eventsnextleague.php?id=${leagueId}`
      );
      const data = await response.json();

      if (data.events) {
        const events = data.events.slice(0, 3).map((event: any) => ({
          id: event.idEvent,
          title: `${event.strHomeTeam} vs ${event.strAwayTeam}`,
          description: event.strLeague || 'Upcoming match',
          image: event.strThumb || event.strSquare || event.strBanner || sportEmojis[event.strSport] || '🏟️',
          status: 'Upcoming',
          category: 'Match',
          date: event.dateEvent,
        }));
        allEvents.push(...events);
      }
    }

    return allEvents;
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
};

// Main function to fetch all sports data
export const fetchSportsData = async (): Promise<SportItem[]> => {
  try {
    console.log('Fetching sports data from TheSportsDB API...');
    
    // Fetch all data in parallel
    const [teams, players, events] = await Promise.all([
      fetchTeams(),
      fetchPlayers(),
      fetchUpcomingEvents(),
    ]);

    // Combine all data
    const allData = [...teams, ...players, ...events];
    
    // Remove duplicates based on ID
    const uniqueData = Array.from(
      new Map(allData.map(item => [item.id, item])).values()
    );
    
    console.log(`Fetched ${uniqueData.length} unique items from TheSportsDB`);
    
    return uniqueData;
  } catch (error) {
    console.error('Error in fetchSportsData:', error);
    // Return empty array on error
    return [];
  }
};

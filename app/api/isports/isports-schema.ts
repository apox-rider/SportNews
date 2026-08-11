export interface FootballMatch {
  matchId: string;
  leagueId: string;
  leagueName: string;
  leagueShortName: string;
  leagueColor: string;
  matchTime: number;
  status: number;
  homeId: string;
  homeName: string;
  awayId: string;
  awayName: string;
  homeScore: number;
  awayScore: number;
  homeHalfScore: number;
  awayHalfScore: number;
  homeRed: number;
  awayRed: number;
  homeYellow: number;
  awayYellow: number;
  homeCorner: number;
  awayCorner: number;
  homeRank: string;
  awayRank: string;
  round: string;
  season: string;
  location: string | null;
  weather: string | null;
  temperature: string | null;
  injuryTime: number | null;
}

export interface FootballStat {
  type: number;
  home: string;
  away: string;
}

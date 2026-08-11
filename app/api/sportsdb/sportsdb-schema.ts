import type { ContinentId } from "~/utils/continents";

export interface LeagueSummary {
  idLeague: string;
  strLeague: string;
  strSport: string;
  strLeagueAlternate?: string | null;
  strCountry?: string | null;
  strGender?: string | null;
  intFormedYear?: string | null;
  intDivision?: string | null;
  idCup?: string | null;
  strCurrentSeason?: string | null;
  strWebsite?: string | null;
  strFacebook?: string | null;
  strTwitter?: string | null;
  strInstagram?: string | null;
  strYoutube?: string | null;
  strTvRights?: string | null;
  strDescriptionEN?: string | null;
  dateFirstEvent?: string | null;
  strFanart1?: string | null;
  strBanner?: string | null;
  strBadge?: string | null;
  strLogo?: string | null;
  strPoster?: string | null;
  strTrophy?: string | null;
  continent?: ContinentId;
}

export interface League extends LeagueSummary {
  strLeagueAlternate?: string | null;
  strCountry?: string | null;
  strGender?: string | null;
  intFormedYear?: string | null;
  strWebsite?: string | null;
  strFacebook?: string | null;
  strTwitter?: string | null;
  strInstagram?: string | null;
  strYoutube?: string | null;
  strRSS?: string | null;
  strDescriptionEN?: string | null;
  strDescriptionFR?: string | null;
  strDescriptionDE?: string | null;
  strCurrentSeason?: string | null;
  intDivision?: string | null;
  idCup?: string | null;
  dateFirstEvent?: string | null;
  strFanart1?: string | null;
  strFanart2?: string | null;
  strFanart3?: string | null;
  strBanner?: string | null;
  strBadge?: string | null;
  strLogo?: string | null;
  strPoster?: string | null;
  strTrophy?: string | null;
  strNaming?: string | null;
  strComplete?: string | null;
}

export interface Team {
  idTeam: string;
  strTeam: string;
  strTeamAlternate?: string | null;
  strTeamShort?: string | null;
  intFormedYear?: string | null;
  strSport?: string | null;
  strLeague?: string | null;
  idLeague?: string | null;
  idLeague2?: string | null;
  idLeague3?: string | null;
  idLeague4?: string | null;
  idLeague5?: string | null;
  strDivision?: string | null;
  idVenue?: string | null;
  strStadium?: string | null;
  strKeywords?: string | null;
  strRSS?: string | null;
  strLocation?: string | null;
  intStadiumCapacity?: string | null;
  strWebsite?: string | null;
  strFacebook?: string | null;
  strTwitter?: string | null;
  strInstagram?: string | null;
  strDescriptionEN?: string | null;
  strGender?: string | null;
  strCountry?: string | null;
  strBadge?: string | null;
  strLogo?: string | null;
  strFanart1?: string | null;
  strFanart2?: string | null;
  strFanart3?: string | null;
  strBanner?: string | null;
  strYoutube?: string | null;
}

export interface Player {
  idPlayer: string;
  idTeam?: string | null;
  idTeam2?: string | null;
  strPlayer: string;
  strPlayerAlternate?: string | null;
  strTeam?: string | null;
  strTeam2?: string | null;
  strSport?: string | null;
  dateBorn?: string | null;
  strNumber?: string | null;
  dateSigned?: string | null;
  strSigning?: string | null;
  strWage?: string | null;
  strOutfitter?: string | null;
  strAgent?: string | null;
  strBirthLocation?: string | null;
  strStatus?: string | null;
  strDescriptionEN?: string | null;
  strGender?: string | null;
  strSide?: string | null;
  strPosition?: string | null;
  strCollege?: string | null;
  strFacebook?: string | null;
  strWebsite?: string | null;
  strTwitter?: string | null;
  strInstagram?: string | null;
  strYoutube?: string | null;
  strHeight?: string | null;
  strWeight?: string | null;
  intLoved?: string | null;
  strThumb?: string | null;
  strCutout?: string | null;
  strRender?: string | null;
  strBanner?: string | null;
  strNationality?: string | null;
  relevance?: string | null;
}

export interface SportEvent {
  idEvent: string;
  idAPIfootball?: string | null;
  strTimestamp?: string | null;
  strEvent: string;
  strEventAlternate?: string | null;
  strFilename?: string | null;
  strSport?: string | null;
  idLeague?: string | null;
  strLeague?: string | null;
  strLeagueBadge?: string | null;
  strSeason?: string | null;
  strDescriptionEN?: string | null;
  strHomeTeam?: string | null;
  strAwayTeam?: string | null;
  intHomeScore?: string | null;
  intHomeScoreExtra?: string | null;
  intAwayScore?: string | null;
  intAwayScoreExtra?: string | null;
  intRound?: string | null;
  intSpectators?: string | null;
  strOfficial?: string | null;
  strWeather?: string | null;
  dateEvent?: string | null;
  dateEventLocal?: string | null;
  strTime?: string | null;
  strTimeLocal?: string | null;
  strGroup?: string | null;
  idHomeTeam?: string | null;
  strHomeTeamBadge?: string | null;
  idAwayTeam?: string | null;
  strAwayTeamBadge?: string | null;
  intScore?: string | null;
  intScoreVotes?: string | null;
  strResult?: string | null;
  idVenue?: string | null;
  strVenue?: string | null;
  strCountry?: string | null;
  strCity?: string | null;
  strPoster?: string | null;
  strSquare?: string | null;
  strFanart?: string | null;
  strThumb?: string | null;
  strBanner?: string | null;
  strMap?: string | null;
  strTweet1?: string | null;
  strVideo?: string | null;
  strStatus?: string | null;
  strPostponed?: string | null;
  strLocked?: string | null;
}

export interface StandingRow {
  idStanding?: string | null;
  intRank?: string | null;
  idTeam?: string | null;
  strTeam?: string | null;
  strBadge?: string | null;
  idLeague?: string | null;
  strLeague?: string | null;
  strSeason?: string | null;
  strGroup?: string | null;
  strForm?: string | null;
  strDescription?: string | null;
  intPlayed?: string | null;
  intWin?: string | null;
  intLoss?: string | null;
  intDraw?: string | null;
  intGoalsFor?: string | null;
  intGoalsAgainst?: string | null;
  intGoalDifference?: string | null;
  intPoints?: string | null;
  dateUpdated?: string | null;
}

export interface Season {
  idSeason?: string | null;
  strSeason?: string | null;
}

export type ApiResponse<T> = {
  [key: string]: T[] | null;
};

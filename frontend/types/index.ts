export interface OverviewKPIs {
  total_matches: number;
  total_deliveries: number;
  total_seasons: number;
  total_teams: number;
  total_venues: number;
  total_runs: number;
  total_wickets: number;
  total_sixes: number;
  total_fours: number;
  average_run_rate: number;
  earliest_season: string;
  latest_season: string;
}

export interface OverviewData {
  title: string;
  description: string;
  kpis: OverviewKPIs;
  top_teams: any[];
  top_batters: any[];
  top_bowlers: any[];
  recent_seasons: any[];
}

export interface TeamRecord {
  team: string;
  matches_played: number;
  wins: number;
  losses: number;
  no_results?: number;
  bat_first_wins?: number;
  chase_wins?: number;
  win_pct?: number;
  bat_first_win_pct?: number;
  chase_win_pct?: number;
  season_history?: any[];
  h2h_rivalries?: any[];
}

export interface BatterRecord {
  batter: string;
  innings: number;
  total_runs: number;
  balls_faced: number;
  fours: number;
  sixes: number;
  strike_rate: number;
  batting_average?: number;
  all_time_rank?: number;
}

export interface BowlerRecord {
  bowler: string;
  matches: number;
  legal_balls: number;
  runs_conceded: number;
  wickets: number;
  dot_balls: number;
  overs: number;
  economy_rate: number;
  bowling_strike_rate?: number;
  all_time_rank?: number;
}

export interface TossData {
  overall_distribution: {
    toss_decision: string;
    decision_count: number;
    toss_and_match_wins: number;
    decision_share_pct: number;
    decision_win_pct: number;
  }[];
  season_trends: {
    season: number | string;
    season_matches: number;
    field_first_decisions: number;
    bat_first_decisions: number;
    toss_winner_wins: number;
    toss_advantage_pct: number;
    field_first_pct: number;
  }[];
  venue_impact: {
    venue: string;
    venue_matches: number;
    toss_winner_wins: number;
    field_and_won: number;
    bat_and_won: number;
    toss_win_pct: number;
  }[];
}

export interface VenueRecord {
  venue: string;
  total_matches: number;
  city?: string;
  bat_first_wins: number;
  chase_wins: number;
  bat_first_win_pct: number;
  chase_win_pct: number;
  avg_1st_innings_score: number;
  avg_2nd_innings_score: number;
  highest_score: number;
  lowest_score: number;
}

export interface SeasonTimelineRecord {
  season: number | string;
  season_matches: number;
  total_runs: number;
  legal_balls: number;
  fours: number;
  sixes: number;
  total_wickets: number;
  run_rate: number;
  avg_match_runs: number;
  avg_match_wickets: number;
  boundary_runs: number;
  boundary_run_pct: number;
  chasing_win_pct: number;
  toss_win_pct: number;
}

export interface MatchRecord {
  match_id: number;
  season: number | string;
  date?: string;
  team1: string;
  team2: string;
  city?: string;
  venue: string;
  toss_winner: string;
  toss_decision: string;
  winner?: string;
  win_type?: string;
  win_margin?: number;
  result?: string;
  player_of_match?: string;
}

export interface PipelineComponent {
  name: string;
  status: string;
  message: string;
  details?: Record<string, any>;
}

export interface PipelineStatusData {
  status: string;
  timestamp: string;
  components: Record<string, PipelineComponent>;
  architecture: Record<string, string>;
}

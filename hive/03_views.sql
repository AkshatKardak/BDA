-- =============================================================================
-- hive/03_views.sql
-- Analytical Data Mart Views for Reporting and Dashboard Integration
-- =============================================================================

USE ipl_analytics;

-- 1. View: Player Batting Aggregates
CREATE OR REPLACE VIEW v_player_batting_summary AS
SELECT 
    batter,
    COUNT(DISTINCT match_id) AS matches_played,
    COUNT(DISTINCT season) AS seasons_active,
    SUM(batter_runs) AS total_runs,
    COUNT(CASE WHEN wides = 0 THEN 1 END) AS balls_faced,
    ROUND((SUM(batter_runs) * 100.0) / COUNT(CASE WHEN wides = 0 THEN 1 END), 2) AS strike_rate,
    SUM(CASE WHEN batter_runs = 4 THEN 1 ELSE 0 END) AS fours,
    SUM(CASE WHEN batter_runs = 6 THEN 1 ELSE 0 END) AS sixes,
    MAX(batter_runs) AS highest_single_ball_score
FROM ipl_deliveries
GROUP BY batter;


-- 2. View: Player Bowling Aggregates
CREATE OR REPLACE VIEW v_player_bowling_summary AS
SELECT 
    bowler,
    COUNT(DISTINCT match_id) AS matches_played,
    COUNT(CASE WHEN wides = 0 AND noballs = 0 THEN 1 END) AS legal_deliveries,
    ROUND(COUNT(CASE WHEN wides = 0 AND noballs = 0 THEN 1 END) / 6.0, 1) AS overs_bowled,
    SUM(total_runs) AS runs_conceded,
    SUM(CASE 
        WHEN dismissal_kind IS NOT NULL 
         AND dismissal_kind NOT IN ('run out', 'retired hurt', 'retired out', 'obstructing the field') 
        THEN 1 ELSE 0 
    END) AS wickets_taken,
    COUNT(CASE WHEN total_runs = 0 AND wides = 0 AND noballs = 0 THEN 1 END) AS dot_balls,
    ROUND((SUM(total_runs) * 6.0) / COUNT(CASE WHEN wides = 0 AND noballs = 0 THEN 1 END), 2) AS economy_rate
FROM ipl_deliveries
GROUP BY bowler;


-- 3. View: Franchise Tournament Records
CREATE OR REPLACE VIEW v_team_performance_summary AS
WITH match_teams AS (
    SELECT match_id, season, team1 AS team, winner, win_type, 'bat_first' AS toss_role FROM ipl_matches
    UNION ALL
    SELECT match_id, season, team2 AS team, winner, win_type, 'field_first' AS toss_role FROM ipl_matches
)
SELECT 
    team,
    COUNT(DISTINCT match_id) AS matches_played,
    SUM(CASE WHEN winner = team THEN 1 ELSE 0 END) AS matches_won,
    SUM(CASE WHEN winner != team AND winner IS NOT NULL THEN 1 ELSE 0 END) AS matches_lost,
    SUM(CASE WHEN winner IS NULL THEN 1 ELSE 0 END) AS no_results,
    ROUND(SUM(CASE WHEN winner = team THEN 1.0 ELSE 0.0 END) * 100.0 / COUNT(DISTINCT match_id), 2) AS win_pct,
    SUM(CASE WHEN winner = team AND win_type = 'runs' THEN 1 ELSE 0 END) AS bat_first_wins,
    SUM(CASE WHEN winner = team AND win_type = 'wickets' THEN 1 ELSE 0 END) AS chasing_wins
FROM match_teams
WHERE team IS NOT NULL AND team != ''
GROUP BY team;


-- 4. View: Toss Advantage & Decision Dynamics
CREATE OR REPLACE VIEW v_toss_impact_summary AS
SELECT 
    season,
    toss_decision,
    COUNT(*) AS total_matches,
    SUM(CASE WHEN toss_winner = winner THEN 1 ELSE 0 END) AS toss_winner_match_won,
    ROUND(SUM(CASE WHEN toss_winner = winner THEN 1.0 ELSE 0.0 END) * 100.0 / COUNT(*), 2) AS toss_win_rate_pct
FROM ipl_matches
WHERE winner IS NOT NULL AND winner != ''
GROUP BY season, toss_decision;


-- 5. View: Stadium Dynamics and Pitch Characteristics
CREATE OR REPLACE VIEW v_venue_insights AS
SELECT 
    venue,
    COALESCE(MAX(city), 'Unknown') AS city,
    COUNT(*) AS total_matches,
    SUM(CASE WHEN win_type = 'runs' THEN 1 ELSE 0 END) AS bat_first_wins,
    SUM(CASE WHEN win_type = 'wickets' THEN 1 ELSE 0 END) AS chase_wins,
    ROUND(SUM(CASE WHEN win_type = 'runs' THEN 1.0 ELSE 0.0 END) * 100.0 / COUNT(*), 2) AS bat_first_win_pct,
    ROUND(SUM(CASE WHEN win_type = 'wickets' THEN 1.0 ELSE 0.0 END) * 100.0 / COUNT(*), 2) AS chase_win_pct
FROM ipl_matches
WHERE win_type IN ('runs', 'wickets')
GROUP BY venue;

SHOW VIEWS;

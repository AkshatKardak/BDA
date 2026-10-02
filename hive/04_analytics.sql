-- =============================================================================
-- hive/04_analytics.sql
-- Analytical SQL Queries for IPL Big Data Analytics
-- Answers all 13 core academic analytical questions using Hive SQL
-- =============================================================================

USE ipl_analytics;

-- -----------------------------------------------------------------------------
-- Query 1: Total Historical Matches
-- -----------------------------------------------------------------------------
SELECT 
    COUNT(*) AS total_historical_matches,
    COUNT(DISTINCT season) AS total_seasons,
    MIN(season) AS earliest_season,
    MAX(season) AS latest_season
FROM ipl_matches;


-- -----------------------------------------------------------------------------
-- Query 2: Matches Hosted per Tournament Season
-- -----------------------------------------------------------------------------
SELECT 
    season,
    COUNT(*) AS matches_count,
    COUNT(DISTINCT venue) AS venues_utilized
FROM ipl_matches
GROUP BY season
ORDER BY season ASC;


-- -----------------------------------------------------------------------------
-- Query 3: Franchise Victories (All-Time Leaderboard)
-- -----------------------------------------------------------------------------
SELECT 
    winner AS team_name,
    COUNT(*) AS total_wins
FROM ipl_matches
WHERE winner IS NOT NULL AND winner != ''
GROUP BY winner
ORDER BY total_wins DESC;


-- -----------------------------------------------------------------------------
-- Query 4: Franchise Win Percentage (Matches Played vs Wins)
-- -----------------------------------------------------------------------------
WITH team_matches AS (
    SELECT team, COUNT(DISTINCT match_id) AS matches_played
    FROM (
        SELECT match_id, team1 AS team FROM ipl_matches
        UNION ALL
        SELECT match_id, team2 AS team FROM ipl_matches
    ) all_teams
    WHERE team IS NOT NULL
    GROUP BY team
),
team_wins AS (
    SELECT winner AS team, COUNT(*) AS wins
    FROM ipl_matches
    WHERE winner IS NOT NULL
    GROUP BY winner
)
SELECT 
    m.team AS franchise,
    m.matches_played,
    COALESCE(w.wins, 0) AS matches_won,
    ROUND((COALESCE(w.wins, 0) * 100.0) / m.matches_played, 2) AS win_percentage
FROM team_matches m
LEFT JOIN team_wins w ON m.team = w.team
WHERE m.matches_played >= 20
ORDER BY win_percentage DESC;


-- -----------------------------------------------------------------------------
-- Query 5: Top 10 All-Time Highest Run Scorers
-- -----------------------------------------------------------------------------
SELECT 
    batter,
    COUNT(DISTINCT match_id) AS innings_batted,
    SUM(batter_runs) AS total_runs,
    COUNT(CASE WHEN batter_runs = 4 THEN 1 END) AS total_fours,
    COUNT(CASE WHEN batter_runs = 6 THEN 1 END) AS total_sixes,
    ROUND((SUM(batter_runs) * 100.0) / COUNT(CASE WHEN wides = 0 THEN 1 END), 2) AS strike_rate
FROM ipl_deliveries
GROUP BY batter
HAVING SUM(batter_runs) >= 2000
ORDER BY total_runs DESC
LIMIT 10;


-- -----------------------------------------------------------------------------
-- Query 6: Top 10 All-Time Highest Wicket Takers
-- -----------------------------------------------------------------------------
SELECT 
    bowler,
    COUNT(DISTINCT match_id) AS matches_bowled,
    SUM(is_wicket) AS total_wickets,
    COUNT(CASE WHEN total_runs = 0 AND wides = 0 AND noballs = 0 THEN 1 END) AS dot_balls,
    ROUND((SUM(total_runs) * 6.0) / COUNT(CASE WHEN wides = 0 AND noballs = 0 THEN 1 END), 2) AS economy_rate
FROM ipl_deliveries
WHERE dismissal_kind IS NOT NULL 
  AND dismissal_kind NOT IN ('run out', 'retired hurt', 'retired out', 'obstructing the field')
GROUP BY bowler
ORDER BY total_wickets DESC
LIMIT 10;


-- -----------------------------------------------------------------------------
-- Query 7: Toss Decision Distribution Across Seasons
-- -----------------------------------------------------------------------------
SELECT 
    toss_decision,
    COUNT(*) AS decision_count,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM ipl_matches), 2) AS decision_percentage
FROM ipl_matches
GROUP BY toss_decision;


-- -----------------------------------------------------------------------------
-- Query 8: Toss Winner vs Match Winner Correlation
-- -----------------------------------------------------------------------------
SELECT 
    COUNT(*) AS total_valid_matches,
    SUM(CASE WHEN toss_winner = winner THEN 1 ELSE 0 END) AS toss_and_match_wins,
    ROUND(SUM(CASE WHEN toss_winner = winner THEN 1.0 ELSE 0.0 END) * 100.0 / COUNT(*), 2) AS toss_win_match_win_pct
FROM ipl_matches
WHERE winner IS NOT NULL AND winner != '';


-- -----------------------------------------------------------------------------
-- Query 9 & 10: Batting-First vs Chasing Success Rates
-- -----------------------------------------------------------------------------
SELECT 
    COUNT(*) AS total_decisive_matches,
    SUM(CASE WHEN win_type = 'runs' THEN 1 ELSE 0 END) AS bat_first_wins,
    ROUND(SUM(CASE WHEN win_type = 'runs' THEN 1.0 ELSE 0.0 END) * 100.0 / COUNT(*), 2) AS bat_first_win_pct,
    SUM(CASE WHEN win_type = 'wickets' THEN 1 ELSE 0 END) AS chasing_wins,
    ROUND(SUM(CASE WHEN win_type = 'wickets' THEN 1.0 ELSE 0.0 END) * 100.0 / COUNT(*), 2) AS chasing_win_pct
FROM ipl_matches
WHERE win_type IN ('runs', 'wickets');


-- -----------------------------------------------------------------------------
-- Query 11: Venue Analysis (Matches, Bat-first vs Chasing, and Win Ratios)
-- -----------------------------------------------------------------------------
SELECT 
    venue,
    COUNT(*) AS matches_hosted,
    SUM(CASE WHEN win_type = 'runs' THEN 1 ELSE 0 END) AS bat_first_wins,
    SUM(CASE WHEN win_type = 'wickets' THEN 1 ELSE 0 END) AS chase_wins,
    ROUND(SUM(CASE WHEN win_type = 'wickets' THEN 1.0 ELSE 0.0 END) * 100.0 / COUNT(*), 2) AS chase_win_pct
FROM ipl_matches
WHERE win_type IN ('runs', 'wickets')
GROUP BY venue
HAVING COUNT(*) >= 15
ORDER BY matches_hosted DESC;


-- -----------------------------------------------------------------------------
-- Query 12: Tournament Season Scoring Trends (Runs, Boundaries, Run Rates)
-- -----------------------------------------------------------------------------
SELECT 
    season,
    COUNT(DISTINCT match_id) AS season_matches,
    SUM(total_runs) AS total_season_runs,
    ROUND(AVG(total_runs), 2) AS avg_runs_per_ball,
    SUM(CASE WHEN batter_runs = 6 THEN 1 ELSE 0 END) AS total_sixes,
    SUM(CASE WHEN batter_runs = 4 THEN 1 ELSE 0 END) AS total_fours,
    ROUND(SUM(total_runs) * 1.0 / (COUNT(DISTINCT match_id) * 2), 2) AS avg_innings_score
FROM ipl_deliveries
GROUP BY season
ORDER BY season ASC;


-- -----------------------------------------------------------------------------
-- Query 13: Top 10 All-Time Player of the Match Winners
-- -----------------------------------------------------------------------------
SELECT 
    player_of_match AS player_name,
    COUNT(*) AS awards_count
FROM ipl_matches
WHERE player_of_match IS NOT NULL AND player_of_match != ''
GROUP BY player_of_match
ORDER BY awards_count DESC
LIMIT 10;

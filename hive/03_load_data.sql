-- =============================================================================
-- hive/03_load_data.sql
-- ETL pipeline: Transform raw staging records into partitioned ORC lake tables
-- =============================================================================

USE ipl_analytics;

SET hive.exec.dynamic.partition = true;
SET hive.exec.dynamic.partition.mode = nonstrict;
SET hive.optimize.sort.dynamic.partition = true;

-- 1. Insert into Partitioned Matches Table
INSERT OVERWRITE TABLE ipl_matches PARTITION (season)
SELECT
    match_id,
    date,
    team1,
    team2,
    city,
    venue,
    toss_winner,
    toss_decision,
    winner,
    win_type,
    win_margin,
    result,
    player_of_match,
    season
FROM ipl_matches_raw
WHERE match_id IS NOT NULL;


-- 2. Insert into Partitioned Deliveries Table
INSERT OVERWRITE TABLE ipl_deliveries PARTITION (season)
SELECT
    match_id,
    date,
    venue,
    city,
    innings,
    over,
    ball,
    batting_team,
    bowling_team,
    batter,
    bowler,
    non_striker,
    batter_runs,
    extras_total,
    total_runs,
    wides,
    noballs,
    byes,
    legbyes,
    penalty,
    is_wicket,
    player_out,
    dismissal_kind,
    fielder,
    season
FROM ipl_deliveries_raw
WHERE match_id IS NOT NULL;


-- 3. Populate Dimensional Teams Table
INSERT OVERWRITE TABLE dim_teams
SELECT
    team AS team_name,
    COUNT(DISTINCT match_id) AS matches_played,
    MIN(season) AS first_season,
    MAX(season) AS latest_season
FROM (
    SELECT match_id, season, team1 AS team FROM ipl_matches
    UNION ALL
    SELECT match_id, season, team2 AS team FROM ipl_matches
) t
WHERE team IS NOT NULL AND team != ''
GROUP BY team;


-- 4. Populate Dimensional Venues Table
INSERT OVERWRITE TABLE dim_venues
SELECT
    venue AS venue_name,
    COALESCE(MAX(city), 'Unknown') AS city,
    COUNT(DISTINCT match_id) AS matches_hosted
FROM ipl_matches
WHERE venue IS NOT NULL
GROUP BY venue;

-- 5. Audit Counts
SELECT 'ipl_matches' AS table_name, COUNT(*) AS total_rows FROM ipl_matches
UNION ALL
SELECT 'ipl_deliveries' AS table_name, COUNT(*) AS total_rows FROM ipl_deliveries
UNION ALL
SELECT 'dim_teams' AS table_name, COUNT(*) AS total_rows FROM dim_teams
UNION ALL
SELECT 'dim_venues' AS table_name, COUNT(*) AS total_rows FROM dim_venues;

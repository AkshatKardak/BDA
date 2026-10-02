-- =============================================================================
-- hive/02_tables.sql
-- Define external and managed Hive tables with genuine schema specification
-- =============================================================================

USE ipl_analytics;

-- 1. External Staging Table: Matches Raw Ingestion
DROP TABLE IF EXISTS ipl_matches_raw;
CREATE EXTERNAL TABLE IF NOT EXISTS ipl_matches_raw (
    match_id        BIGINT,
    season          STRING,
    date            STRING,
    team1           STRING,
    team2           STRING,
    city            STRING,
    venue           STRING,
    toss_winner     STRING,
    toss_decision   STRING,
    winner          STRING,
    win_type        STRING,
    win_margin      DOUBLE,
    result          STRING,
    player_of_match STRING
)
ROW FORMAT SERDE 'org.apache.hadoop.hive.serde2.OpenCSVSerde'
WITH SERDEPROPERTIES (
    "separatorChar" = ",",
    "quoteChar"     = "\"",
    "escapeChar"    = "\\"
)
STORED AS TEXTFILE
LOCATION '/ipl/raw/matches'
TBLPROPERTIES ("skip.header.line.count"="1");


-- 2. External Staging Table: Deliveries Raw Ingestion (Flume destination)
DROP TABLE IF EXISTS ipl_deliveries_raw;
CREATE EXTERNAL TABLE IF NOT EXISTS ipl_deliveries_raw (
    match_id        BIGINT,
    season          STRING,
    date            STRING,
    venue           STRING,
    city            STRING,
    innings         INT,
    over            INT,
    ball            INT,
    batting_team    STRING,
    bowling_team    STRING,
    batter          STRING,
    bowler          STRING,
    non_striker     STRING,
    batter_runs     INT,
    extras_total    INT,
    total_runs      INT,
    wides           INT,
    noballs         INT,
    byes            INT,
    legbyes         INT,
    penalty         INT,
    is_wicket       INT,
    player_out      STRING,
    dismissal_kind  STRING,
    fielder         STRING
)
ROW FORMAT DELIMITED
FIELDS TERMINATED BY '\t'
STORED AS TEXTFILE
LOCATION '/ipl/raw/deliveries';


-- 3. Managed Columnar Table: Processed Matches (ORC Format)
DROP TABLE IF EXISTS ipl_matches;
CREATE TABLE IF NOT EXISTS ipl_matches (
    match_id        BIGINT,
    date            STRING,
    team1           STRING,
    team2           STRING,
    city            STRING,
    venue           STRING,
    toss_winner     STRING,
    toss_decision   STRING,
    winner          STRING,
    win_type        STRING,
    win_margin      DOUBLE,
    result          STRING,
    player_of_match STRING
)
PARTITIONED BY (season STRING)
STORED AS ORC
TBLPROPERTIES ("orc.compress"="SNAPPY");


-- 4. Managed Columnar Table: Processed Deliveries (ORC Format)
DROP TABLE IF EXISTS ipl_deliveries;
CREATE TABLE IF NOT EXISTS ipl_deliveries (
    match_id        BIGINT,
    date            STRING,
    venue           STRING,
    city            STRING,
    innings         INT,
    over            INT,
    ball            INT,
    batting_team    STRING,
    bowling_team    STRING,
    batter          STRING,
    bowler          STRING,
    non_striker     STRING,
    batter_runs     INT,
    extras_total    INT,
    total_runs      INT,
    wides           INT,
    noballs         INT,
    byes            INT,
    legbyes         INT,
    penalty         INT,
    is_wicket       INT,
    player_out      STRING,
    dismissal_kind  STRING,
    fielder         STRING
)
PARTITIONED BY (season STRING)
STORED AS ORC
TBLPROPERTIES ("orc.compress"="SNAPPY");


-- 5. Dimensional Table: Franchises / Teams
DROP TABLE IF EXISTS dim_teams;
CREATE TABLE IF NOT EXISTS dim_teams (
    team_name       STRING,
    matches_played  INT,
    first_season    STRING,
    latest_season   STRING
)
STORED AS ORC;


-- 6. Dimensional Table: Venues
DROP TABLE IF EXISTS dim_venues;
CREATE TABLE IF NOT EXISTS dim_venues (
    venue_name      STRING,
    city            STRING,
    matches_hosted  INT
)
STORED AS ORC;

SHOW TABLES;

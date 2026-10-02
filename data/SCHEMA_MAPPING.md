# IPL Big Data Analytics: Schema Mapping Document

## 1. Dataset Overview & Provenance
- **Primary Source**: [aadi-jn/indian-premier-league](https://github.com/aadi-jn/indian-premier-league)
- **Data Heritage**: Cricsheet (Licensed under CC BY-SA 4.0)
- **Timeframe**: IPL Seasons 2008 through 2026
- **Total Historical Matches**: 1,243 matches
- **Total Historical Deliveries**: 295,732 ball-by-ball events
- **Academic Rule**: 100% genuine historical records. Zero synthetic or fake records.

---

## 2. Normalized Match Schema (`data/normalized/matches.csv`)

| Column Name | Data Type | Description | Source / Derivation |
|:---|:---|:---|:---|
| `match_id` | `BIGINT` | Unique identifier for each IPL match | Extracted from raw filename (e.g., `335982.yaml` -> `335982`) |
| `season` | `VARCHAR(16)` | IPL tournament edition / year | Standardized 4-digit year (e.g., `2007/08` -> `2008`) |
| `date` | `VARCHAR(16)` | Date the match was contested (YYYY-MM-DD) | Raw match metadata |
| `team1` | `VARCHAR(64)` | First listed team (Canonical franchise name) | Standardized using franchise alias dictionary |
| `team2` | `VARCHAR(64)` | Second listed team (Canonical franchise name) | Standardized using franchise alias dictionary |
| `city` | `VARCHAR(64)` | Host city of the venue | Standardized using venue alias dictionary |
| `venue` | `VARCHAR(128)`| Official stadium / ground name | Raw match metadata |
| `toss_winner` | `VARCHAR(64)` | Team that won the coin toss | Standardized using franchise alias dictionary |
| `toss_decision` | `VARCHAR(16)` | Decision taken by toss winner (`bat` / `field`) | Raw match metadata |
| `winner` | `VARCHAR(64)` | Match winning franchise (or null if No Result) | Standardized using franchise alias dictionary |
| `win_type` | `VARCHAR(16)` | Victory mode (`runs`, `wickets`, `tie`, `no result`)| Raw match metadata |
| `win_margin` | `FLOAT` | Victory margin in runs or wickets | Raw match metadata |
| `result` | `VARCHAR(32)` | Special match outcome status (e.g. tie, no result)| Raw match metadata |
| `player_of_match` | `VARCHAR(64)`| Man of the Match recipient | Raw match metadata |

---

## 3. Normalized Deliveries Schema (`data/normalized/deliveries.csv`)

| Column Name | Data Type | Description | Source / Derivation |
|:---|:---|:---|:---|
| `match_id` | `BIGINT` | Foreign key referencing `matches.match_id` | Derived from match identifier |
| `season` | `VARCHAR(16)` | IPL tournament edition | Standardized season string |
| `date` | `VARCHAR(16)` | Date of delivery (YYYY-MM-DD) | Raw delivery record |
| `venue` | `VARCHAR(128)`| Stadium / ground where ball was bowled | Raw delivery record |
| `city` | `VARCHAR(64)` | City location of the venue | Normalized city name |
| `innings` | `INT` | Innings number (1, 2, 3 = Super Over) | Raw delivery record |
| `over` | `INT` | Over number (0 to 19) | Ball-by-ball sequence |
| `ball` | `INT` | Legal ball index within the over (1 to 6+) | Ball-by-ball sequence |
| `batting_team` | `VARCHAR(64)` | Team batting for this ball | Standardized franchise name |
| `bowling_team` | `VARCHAR(64)` | Team fielding/bowling for this ball | Standardized franchise name |
| `batter` | `VARCHAR(64)` | Striking batter facing the delivery | Official player name |
| `bowler` | `VARCHAR(64)` | Bowler executing the delivery | Official player name |
| `non_striker` | `VARCHAR(64)` | Non-striking batter | Official player name |
| `batter_runs` | `INT` | Runs scored off the bat | Non-negative integer (0, 1, 2, 3, 4, 6) |
| `extras_total` | `INT` | Total extra runs conceded (wides + noballs + byes + legbyes) | Non-negative integer |
| `total_runs` | `INT` | Cumulative runs scored on the delivery (`batter_runs + extras_total`)| Non-negative integer |
| `wides` | `INT` | Runs awarded from wide delivery | Non-negative integer |
| `noballs` | `INT` | Runs awarded from no-ball | Non-negative integer |
| `byes` | `INT` | Runs scored as byes | Non-negative integer |
| `legbyes` | `INT` | Runs scored as leg-byes | Non-negative integer |
| `penalty` | `INT` | Penalty runs awarded to batting side | Non-negative integer |
| `is_wicket` | `INT` | Indicator if a dismissal occurred (`1` or `0`) | Binary flag |
| `player_out` | `VARCHAR(64)` | Name of dismissed player | Null if no dismissal occurred |
| `dismissal_kind`| `VARCHAR(32)`| Dismissal category (`caught`, `bowled`, `lbw`, `run out`, etc.) | Null if no dismissal occurred |
| `fielder` | `VARCHAR(64)` | Fielder involved in dismissal | Null if no fielder involved |

---

## 4. Franchise Standardizations Applied

| Raw Franchise Alias | Canonical Franchise Name | Justification |
|:---|:---|:---|
| Delhi Daredevils | Delhi Capitals | Franchise rebranded in December 2018 |
| Kings XI Punjab | Punjab Kings | Franchise rebranded in February 2021 |
| Royal Challengers Bangalore | Royal Challengers Bengaluru | Franchise rebranded in March 2024 |
| Rising Pune Supergiants | Rising Pune Supergiant | Official singular naming convention |

---

## 5. HDFS Destination Target
- `/ipl/raw/matches/matches.csv` -> Hive external table `ipl_matches_raw`
- `/ipl/raw/deliveries/deliveries.csv` -> Hive external table `ipl_deliveries_raw`
- `/ipl/processed/matches/` -> PySpark cleaned Parquet / Hive managed table
- `/ipl/processed/deliveries/` -> PySpark cleaned Parquet / Hive managed table
- `/ipl/analytics/...` -> PySpark analytical aggregations and Hive data mart views

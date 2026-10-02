# System Architecture Specification
## IPL Large-Scale Cricket Data Analytics using Apache Flume, Hadoop HDFS, Hive, and PySpark

---

## 1. Overview & Academic Mandate

This application was engineered to fulfill the college mini-project requirement:
> **"Mini Project: One real life large data application to be implemented (Use standard Datasets available on the web). Streaming data analysis: use Flume for data capture and HIVE/PySpark for analysis."**

### Core Architectural Principle
The system does not simulate random or synthetic cricket games. All analytical figures originate from **genuine historical records covering the 2008–2026 IPL editions** (1,243 matches and 295,732 ball-by-ball deliveries). The timing of events is streamed through an event emitter to faithfully model streaming ingestion into Apache Flume and Hadoop HDFS.

---

## 2. End-to-End Pipeline Architecture Diagram

```
+-------------------------------------------------------------------------------+
|                        GENUINE HISTORICAL DATA LAKE                            |
|             Cricsheet IPL Ball-by-Ball Records (2008 - 2026)                  |
|                   1,243 Matches  |  295,732 Deliveries                        |
+-------------------------------------------------------------------------------+
                                      |
                                      v
+-------------------------------------------------------------------------------+
|                    HISTORICAL STREAMING REPLAY ENGINE                         |
|                       `streaming/replay_ipl.py`                               |
|        - Emits ball-by-ball deliveries with configurable delay & batching     |
|        - Output options: Socket (Port 44444), Spooling directory, or STDOUT  |
+-------------------------------------------------------------------------------+
                                      |
                                      v
+-------------------------------------------------------------------------------+
|                     STREAMING INGESTION: APACHE FLUME                         |
|                         `flume/ipl-flume.conf`                                |
|        - Source:   Netcat / SpoolDir / Exec (continuous delivery stream)       |
|        - Channel:  Memory Channel (capacity 10,000, tx 1,000)                 |
|        - Sink:     HDFS Sink (`/ipl/raw/deliveries/%Y/%m/`)                    |
|        - Rolling:  Roll by size (64MB) and count (5,000 events)               |
+-------------------------------------------------------------------------------+
                                      |
                                      v
+-------------------------------------------------------------------------------+
|                   DISTRIBUTED STORAGE: HADOOP HDFS                            |
|       `/ipl/raw/`        - Raw JSONL / CSV streaming delivery dumps           |
|       `/ipl/warehouse/`  - Partitioned ORC tables & curated data marts        |
|       Winutils 3.3.6     - Native Windows filesystem translation              |
+-------------------------------------------------------------------------------+
                                      |
                                      v
+-------------------------------------------------------------------------------+
|                     DATA WAREHOUSING: APACHE HIVE                             |
|                           `ipl_analytics`                                     |
|        - External Tables: `ipl_deliveries_raw`, `ipl_matches_raw`             |
|        - Managed Tables:  `ipl_deliveries` (ORC, Snappy, partitioned)         |
|        - Analytics Views: `v_player_batting_summary`, `v_venue_insights`, etc. |
+-------------------------------------------------------------------------------+
                                      |
                                      v
+-------------------------------------------------------------------------------+
|                   DISTRIBUTED PROCESSING: APACHE PYSPARK                      |
|                  8 Automated Analytics & Modeling Stages                      |
|        01_ingestion.py        - Type-safe schema loading                      |
|        02_cleaning.py         - Boundary, phase & dot-ball tagging            |
|        03_player_analysis.py  - Orange/Purple cap metrics, strike rates       |
|        04_team_analysis.py    - Win rates, defending vs chasing records       |
|        05_toss_analysis.py    - Toss advantage correlation                    |
|        06_venue_analysis.py   - Pitch profiles, 1st vs 2nd innings par scores |
|        07_season_analysis.py  - Multi-year scoring evolution (RPO, sixes)     |
|        08_match_prediction.py - Pre-match Logistic Regression & Random Forest |
+-------------------------------------------------------------------------------+
                                      |
                                      v
+-------------------------------------------------------------------------------+
|                     SERVING LAYER: FASTAPI REST API                           |
|                            `backend/main.py`                                  |
|        - 16 High-Performance Asynchronous Endpoints                           |
|        - Type-Safe Pydantic v2 Serialization                                  |
|        - Real-Time Big Data Pipeline Health & Diagnostic Telemetry            |
+-------------------------------------------------------------------------------+
                                      |
                                      v
+-------------------------------------------------------------------------------+
|                    USER INTERFACE: NEXT.JS 14 DASHBOARD                       |
|                       TypeScript + Tailwind CSS + Recharts                    |
|        - Overview Dashboard: Global KPIs, top franchises, trend graphs        |
|        - Franchises: Win % table, head-to-head rivalries matrix               |
|        - Players: Searchable roster, career cards, Orange/Purple Cap history  |
|        - Toss: Field first vs bat first correlation & venue impacts           |
|        - Venues: Stadium profiles, scoring averages, ground biases            |
|        - Seasons: Scoring explosion (8.31 -> 9.88 RPO), sixes escalation      |
|        - Matches: 1,243 fixture explorer with pagination and deep search      |
|        - Pipeline: Real-time component health checks & diagnostic logs        |
+-------------------------------------------------------------------------------+
```

---

## 3. Technology Tier Breakdown

### 3.1 Data Acquisition & Provenance
- **Primary Source**: `aadi-jn/indian-premier-league` (Cricsheet ball-by-ball source).
- **Match Count**: 1,243 official IPL matches (2008–2026).
- **Delivery Count**: 295,732 legal and extra deliveries.
- **Normalization**: Franchise names unified across historical rebrandings (e.g., Delhi Daredevils -> Delhi Capitals, Royal Challengers Bangalore -> Royal Challengers Bengaluru, Kings XI Punjab -> Punjab Kings).

### 3.2 Ingestion Tier (Apache Flume)
- Configured in `flume/ipl-flume.conf`.
- **Source**: `r1` configured to accept TCP events via Netcat on port `44444` or monitor a spooling directory.
- **Channel**: In-memory FIFO queue (`c1`) with capacity of 10,000 events and transaction capacity of 1,000 events.
- **Sink**: HDFS sink (`k1`) targeting `/ipl/raw/deliveries/%Y/%m/` writing JSON Lines files prefixed with `events-` and suffixed with `.jsonl`.

### 3.3 Storage Tier (Hadoop HDFS)
- Standard Hadoop 3.3.6 XML configurations in `hadoop/core-site.xml` and `hadoop/hdfs-site.xml`.
- Lake hierarchy:
  - `/ipl/raw/deliveries/`: Ingestion landing zone from Flume.
  - `/ipl/processed/`: Normalized CSV and Parquet files.
  - `/ipl/warehouse/`: Managed Hive ORC tables.
  - `/ipl/analytics/`: Pre-aggregated analytical cubes and metric summaries.
- Windows native execution supported via `hadoop/bin/winutils.exe` and `hadoop/bin/hadoop.dll`.

### 3.4 Data Warehousing Tier (Apache Hive)
- Database: `ipl_analytics`.
- Managed tables stored in **Optimized Row Columnar (ORC)** format with Snappy compression for columnar projection performance.
- Partitioning strategy: partitioned by `season` and `team` for optimal partition pruning.
- Analytical Views:
  - `v_player_batting_summary`
  - `v_player_bowling_summary`
  - `v_team_performance_summary`
  - `v_toss_impact_summary`
  - `v_venue_insights`

### 3.5 Distributed Processing Tier (Apache PySpark)
- PySpark 4.2.0 executing over Java 22 with `--add-opens` flags for JVM memory reflection.
- Production tuning:
  - `spark.driver.host="127.0.0.1"` (avoids Windows NetBIOS resolution delays).
  - Explicit `StructType` schemas to avoid expensive type inference overhead.
  - Execution caching and unified pipeline execution runner (`pyspark/run_all_analytics.py`) completing 8 stages in under 90 seconds.

### 3.6 Match Outcome Prediction (Machine Learning)
- Strictly enforces **Zero Data Leakage**: Evaluates match outcomes purely from pre-match features:
  - Team 1 & Team 2 historical win rates
  - Head-to-Head win ratios
  - Venue batting first vs chasing bias
  - Toss winner and decision
- Algorithms evaluated: Logistic Regression and Random Forest via `pyspark.ml`.

### 3.7 Web Serving Tier (FastAPI & Next.js)
- **FastAPI**: Asynchronous, OpenAPI 3.0 documented REST API running on port 8000.
- **Next.js 14**: Server-rendered and client-hydrated TypeScript UI on port 3000 styled with Tailwind CSS and visual analytics via Recharts.

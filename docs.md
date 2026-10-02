# IPL Large-Scale Cricket Data Analytics: System Architecture & Technical Manual

**Academic Mini-Project Specification**: Streaming Data Analysis using Apache Flume, Hadoop HDFS, Apache Hive, and PySpark.  
**Domain**: Indian Premier League (IPL) Men's T20 Tournament (2008 – 2026).  
**Data Integrity Standard**: 100% Genuine Historical Ball-by-Ball Records (Derived from Cricsheet). Zero synthetic or fake records.

---

## 1. Executive Summary & Academic Problem Definition

In contemporary distributed systems engineering, large-scale event processing architectures must balance high-throughput sequential ingestion with scalable batch analytical capabilities. This project implements an enterprise-grade Big Data pipeline analyzing the complete historical corpus of the Indian Premier League (IPL), encompassing **1,243 matches** and **295,732 ball-by-ball deliveries** across **18 tournament editions (2008–2026)**.

### The Streaming Replay Paradigm
In college environments and reproducible evaluations, live sports event feeds are subject to commercial API paywalls, rate limitations, and unpredictable scheduling. To satisfy the academic requirement for **Apache Flume ingestion**, this project adopts the **Historical Stream Replay Paradigm**:
- **Genuine Historical Records**: Every delivery bowled in IPL history is preserved in its authentic, canonical form.
- **Controlled Ingestion Simulation**: A dedicated event emitter simulates real-time match progression by releasing historical delivery records sequentially with configurable micro-delays (e.g., 10 milliseconds).
- **Physical Ingestion Architecture**: The simulated events are consumed by Apache Flume (via an Exec or Netcat source), buffered through an in-memory channel, and durably written into the Hadoop Distributed File System (HDFS).

---

## 2. End-to-End System Architecture

```
 +---------------------------------------------------------------------------------------------------+
 |                                   1. DATA ACQUISITION & LAKE INGESTION                            |
 |                                                                                                   |
 |  [Genuine Historical Cricsheet Data]                                                              |
 |             |                                                                                     |
 |             v                                                                                     |
 |  [scripts/normalize_data.py] ===> [data/normalized/matches.csv & deliveries.csv]                  |
 |             |                                                                                     |
 |             v                                                                                     |
 |  [streaming/replay_ipl.py] (Configurable delay: 0.01s - 0.1s / JSON or Delimited)                 |
 |             |                                                                                     |
 |             v (Exec / Netcat TCP Port 44444)                                                      |
 |  [Apache Flume Agent]                                                                             |
 |     +-- Source:  ExecSource / NetcatSource                                                        |
 |     +-- Channel: MemoryChannel (100,000 capacity, 1,000 tx capacity)                              |
 |     +-- Sink:    HDFSEventSink (Roll: 30s / 10MB / 5,000 events)                                  |
 +---------------------------------------------+-----------------------------------------------------+
                                               |
                                               v
 +---------------------------------------------------------------------------------------------------+
 |                                   2. DISTRIBUTED STORAGE LAYER (HDFS)                             |
 |                                                                                                   |
 |  hdfs://localhost:9000/ipl/                                                                       |
 |  ├── raw/               <-- Raw ingested stream partitions (/deliveries/YYYY-MM-DD/)              |
 |  ├── processed/         <-- Cleaned, standardized Parquet datasets                                |
 |  ├── analytics/         <-- Hive warehouse database & intermediate aggregations                   |
 |  └── output/            <-- Final analytical result sets and model outputs                        |
 +---------------------------------------------+-----------------------------------------------------+
                                               |
                       +-----------------------+-----------------------+
                       |                                               |
                       v                                               v
 +---------------------------------------------+ +---------------------------------------------------+
 |            3. APACHE HIVE LAYER             | |              4. APACHE PYSPARK LAYER              |
 |                                             | |                                                   |
 | - Database: ipl_analytics                   | | - Explicit StructType Schema Enforcement          |
 | - External Staging:                         | | - PySpark DataFrame & Spark SQL Transformations   |
 |     ipl_matches_raw, ipl_deliveries_raw     | | - Window Ranking Functions:                       |
 | - Managed ORC / Snappy Tables:              | |     dense_rank(), row_number(), partitionBy()     |
 |     ipl_matches (partitioned by season)     | | - Multi-stage Pipeline Modules:                  |
 |     ipl_deliveries (partitioned by season)  | |     01_ingestion.py -> 02_cleaning.py ->          |
 | - Dimension Tables:                         | |     03_player_analysis.py -> 04_team_analysis.py  |
 |     dim_teams, dim_venues                   | |     05_toss_analysis.py   -> 06_venue_analysis.py |
 | - 13 Core Analytical SQL Queries            | |     07_season_analysis.py -> 08_match_prediction  |
 | - 5 Business Mart Views                     | | - Output: Partitioned Parquet & Consolidated CSV  |
 +---------------------------------------------+ +---------------------------------------------------+
                                               |
                                               v
 +---------------------------------------------------------------------------------------------------+
 |                                 5. PRESENTATION & INFERENCE LAYER                                 |
 |                                                                                                   |
 | - Streamlit Interactive Web Application (dashboard/app.py)                                        |
 | - Plotly High-Resolution Interactive Charts                                                       |
 | - Pre-Match Machine Learning Forecasting (Zero Data Leakage)                                      |
 +---------------------------------------------------------------------------------------------------+
```

---

## 3. Technology Stack & Component Justification

| Technology | Architectural Tier | Justification & Role |
|:---|:---|:---|
| **Apache Flume** | Ingestion / Data Capture | Captures streaming event flows, decouples producers from consumers using transactional memory channels, and writes directly to HDFS with rolling policies. |
| **Hadoop HDFS** | Distributed Storage | Provides high fault-tolerance, high aggregate bandwidth, rack awareness, and persistent lake partitioning across commodity compute clusters. |
| **Apache Hive** | Data Warehouse / SQL | Enables declarative SQL-based queries over massive HDFS datasets, partition pruning, and columnar compression using Optimized Row Columnar (ORC) files. |
| **Apache Spark / PySpark** | Distributed Computation | In-memory distributed computing engine leveraging Resilient Distributed Datasets (RDDs), Catalyst query optimization, Tungsten execution engine, and Spark SQL window functions. |
| **Python 3.11** | Orchestration & Replay | Drives the sequential streaming replay engine, pipeline verification, data normalization, and ML inference. |
| **Scikit-learn** | Machine Learning | Evaluates pre-match outcome classification models (Logistic Regression, Random Forest) strictly adhering to pre-match causality (Zero Data Leakage). |
| **Streamlit & Plotly** | Presentation Layer | Renders executive dashboards, KPIs, scatter plots, and correlation charts directly from computed analytical outputs without client-side recalculation. |

---

## 4. Ingestion Tier: Apache Flume Configuration Deep Dive

The Flume agent is configured in `flume/ipl-flume.conf`:
- **Source (`agent.sources.r1`)**: An `exec` source invoking `python3 streaming/replay_ipl.py --file data/normalized/deliveries.csv --delay 0.01`. As the replay script emits genuine delivery records to stdout, Flume encapsulates each line into a Flume Event. Alternatively, a `netcat` source binds to port 44444 to accept TCP streaming sockets.
- **Channel (`agent.channels.c1`)**: An in-memory channel configured with `capacity = 100000` events and `transactionCapacity = 1000` events. This absorbs velocity spikes while ensuring atomic batches.
- **Sink (`agent.sinks.k1`)**: An `hdfs` sink configured with:
  - Path: `hdfs://localhost:9000/ipl/raw/deliveries/%Y-%m-%d`
  - Format: `DataStream` (plain text event payload)
  - Rolling Triggers:
    - Time-based: `hdfs.rollInterval = 30` (flushes every 30 seconds)
    - Size-based: `hdfs.rollSize = 10485760` (flushes at 10 MB)
    - Count-based: `hdfs.rollCount = 5000` (flushes every 5,000 deliveries)
    - Inactivity: `hdfs.idleTimeout = 60` (closes open handles if stream ceases)

---

## 5. Storage Tier: HDFS Directory Hierarchy

The HDFS file system follows the **Medallion / Data Lakehouse architecture**:

```
/ipl/
├── raw/                               # Bronze Zone: Immutable, unprocessed source data
│   ├── matches/
│   │   └── matches.csv
│   └── deliveries/
│       └── YYYY-MM-DD/
│           ├── ipl-deliveries.1712000000000.csv
│           └── ipl-deliveries.1712000030000.csv
│
├── processed/                         # Silver Zone: Cleaned, partitioned Parquet datasets
│   ├── matches.parquet/
│   └── deliveries.parquet/
│
├── analytics/                         # Gold Zone: Hive warehouse & multi-table joins
│   └── hive_warehouse/
│       └── ipl_analytics.db/
│           ├── ipl_matches/
│           │   ├── season=2008/
│           │   └── season=2024/
│           └── ipl_deliveries/
│               ├── season=2008/
│               └── season=2024/
│
└── output/                            # Consumption Zone: Aggregated analytical datasets
    ├── player_performance/
    │   ├── top_batsmen.csv
    │   ├── top_bowlers.csv
    │   └── season_player_stats.csv
    ├── team_performance/
    │   ├── franchise_overall_records.csv
    │   ├── season_team_records.csv
    │   └── head_to_head_records.csv
    ├── toss_analysis/
    │   ├── toss_overall_impact.csv
    │   ├── toss_season_trends.csv
    │   └── toss_venue_impact.csv
    ├── venue_analysis/
    │   └── venue_profile.csv
    └── season_analysis/
        └── season_scoring_trends.csv
```

---

## 6. Analytical Tier: Mathematical Formulations

### 1. Batting Metrics
- **Batting Strike Rate**:
  $$\text{Strike Rate (SR)} = \left( \frac{\sum \text{batter\_runs}}{\text{Legal Deliveries Faced}} \right) \times 100$$
  where $\text{Legal Deliveries Faced} = \sum [\text{wides} = 0]$.
- **Batting Average**:
  $$\text{Batting Average} = \frac{\sum \text{batter\_runs}}{\max(1, \sum \text{Dismissals})}$$

### 2. Bowling Metrics
- **Bowling Economy Rate**:
  $$\text{Economy Rate (ER)} = \frac{\sum \text{total\_runs conceded}}{\left( \frac{\text{Legal Balls Bowled}}{6.0} \right)}$$
  where $\text{Legal Balls Bowled} = \sum [\text{wides} = 0 \land \text{noballs} = 0]$.
- **Bowling Strike Rate**:
  $$\text{Bowling SR} = \frac{\text{Legal Balls Bowled}}{\max(1, \text{Wickets Taken})}$$

### 3. Match Dynamics & Macro-Trends
- **Tournament Run Rate (RPO)**:
  $$\text{RPO} = \frac{\sum \text{total\_runs}}{\left( \frac{\sum \text{Legal Balls}}{6.0} \right)}$$
- **Boundary Contribution Percentage**:
  $$\text{Boundary Run \%} = \left( \frac{(\text{Fours} \times 4) + (\text{Sixes} \times 6)}{\sum \text{total\_runs}} \right) \times 100$$
- **Toss Conversion Efficiency**:
  $$\text{Toss Conversion Rate} = \frac{\sum [\text{toss\_winner} = \text{winner}]}{\text{Total Decisive Matches}} \times 100$$

---

## 7. Machine Learning: Zero Data Leakage Discipline

### The Threat of Data Leakage
A critical flaw in naive cricket prediction models is the inclusion of post-match attributes (e.g., first innings score, wickets lost, overs required to chase, Player of the Match). Such models yield artificially inflated accuracy (>95%) while being fundamentally invalid for pre-match forecasting.

### Strict Pre-Match Feature Set
Our module (`pyspark/08_match_prediction.py`) strictly ingests variables available prior to the opening ball:
1. `team1`: Listed Home Franchise (Categorical)
2. `team2`: Listed Away Franchise (Categorical)
3. `venue`: Stadium / Ground (Categorical)
4. `city`: Geographical location (Categorical)
5. `toss_decision`: Tactical choice to `bat` or `field` (Categorical)
6. `toss_winner_is_team1`: Binary flag indicating if team1 won the coin toss (Integer)

Target variable: `team1_win` ($1$ if `winner == team1`, $0$ if `winner == team2`).

---

## 8. College Viva Voce Defense Guide (Frequently Asked Questions)

### Q1: Why is this categorized as a Big Data project rather than a standard Python project?
**Answer**:  
The project addresses the three primary dimensions of Big Data:
1. **Volume**: Captures every ball bowled across 19 years (295,732 deliveries, 1,243 matches).
2. **Velocity**: Implements real-time continuous event capture via Apache Flume with in-memory transaction channels and rolling HDFS sinks.
3. **Variety & Architecture**: Unifies streaming event logs, distributed columnar Parquet files, ORC Hive data warehouse tables, and distributed PySpark DataFrames. Processing is partitioned and executed via distributed Directed Acyclic Graphs (DAGs) rather than in-memory single-threaded Pandas.

### Q2: Is the IPL feed a live streaming API?
**Answer**:  
No. We state clearly and honestly that this uses **historical data replay**. The records are 100% authentic historical deliveries from Cricsheet. Timing is simulated by replaying events sequentially into Apache Flume. This makes the streaming ingestion pipeline completely reproducible without relying on volatile or commercial live APIs.

### Q3: Why Apache Flume instead of Apache Kafka?
**Answer**:  
The academic mini-project syllabus explicitly prescribes Apache Flume for streaming data capture. Flume was engineered specifically for continuous, high-volume event ingestion directly into Hadoop HDFS, utilizing built-in HDFS sinks, whereas Kafka requires dedicated Kafka Connect sinks and consumer daemon processes.

### Q4: Why are Hive tables partitioned by `season`?
**Answer**:  
Partitioning by `season` creates separate subdirectories in HDFS (e.g. `/season=2024/`). When analytical queries filter by tournament year (`WHERE season = '2024'`), Hive performs **partition pruning**, skipping entire directories and avoiding costly full-table scans across hundreds of thousands of files.

### Q5: How does PySpark handle fault tolerance during distributed transformations?
**Answer**:  
PySpark relies on RDD lineage graphs. If a partition fails during execution across an executor node, PySpark uses the deterministic DAG lineage to recompute only the lost partition rather than restarting the entire computation.

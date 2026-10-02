# IPL Large-Scale Cricket Data Analytics using Apache Flume, Hadoop HDFS, Hive and PySpark

![Apache Flume](https://img.shields.io/badge/Apache_Flume-Ingestion-blue?logo=apache)
![Hadoop HDFS](https://img.shields.io/badge/Hadoop_HDFS-Storage-orange?logo=apachehadoop)
![Apache Hive](https://img.shields.io/badge/Apache_Hive-Warehouse-yellow?logo=apachehive)
![Apache Spark](https://img.shields.io/badge/PySpark-Distributed_Analytics-red?logo=apachespark)
![FastAPI](https://img.shields.io/badge/FastAPI-REST_API-009688?logo=fastapi)
![Next.js 14](https://img.shields.io/badge/Next.js_14-App_Router-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-Modern_UI-38B2AC?logo=tailwind-css)

---

## 1. Project Overview & Title
**IPL Large-Scale Cricket Data Analytics using Apache Flume, Hadoop HDFS, Hive and PySpark**

An end-to-end distributed Big Data platform engineered to ingest, store, warehouse, analyze, and visualize **1,243 official IPL matches** and **295,732 ball-by-ball deliveries** across all 18 editions (2008–2026).

---

## 2. Academic Specification & Compliance
This project directly satisfies the College Big Data Analytics (BDA) mini-project syllabus requirement:

> **Mini Project Requirement**: *One real-life large data application to be implemented (Use standard Datasets available on the web).*  
> **Selected Category**: *Streaming data analysis: use Flume for data capture and HIVE/PySpark for analysis.*

### Academic Principles Enforced
- **100% Genuine Cricsheet Data**: Sourced from [`aadi-jn/indian-premier-league`](https://github.com/aadi-jn/indian-premier-league). **Zero synthetic, fake, or mocked records.**
- **Historical Streaming Replay**: Real historical deliveries are replayed sequentially as streaming events via a Python socket/spool emitter into Apache Flume, writing directly into Hadoop HDFS.
- **Strict Big Data Technology Stack**:
  - Data Capture: **Apache Flume**
  - Distributed Storage: **Hadoop HDFS**
  - Data Warehousing: **Apache Hive (ORC Partitions & Views)**
  - Distributed Processing & ML: **Apache PySpark**
  - Serving Backend: **FastAPI (Asynchronous, Type-Safe)**
  - Web UI: **Next.js 14 (TypeScript, Tailwind CSS, Recharts)**

---

## 3. Core Features (One Line Each)

- **Streaming Delivery Ingestion:** Captures high-velocity ball-by-ball cricket event streams via Apache Flume with memory channel buffering and rolling HDFS sink persistence.
- **Distributed Storage Lake:** Stores raw event streams and partitioned analytical datasets reliably across Hadoop HDFS with native Windows winutils compatibility.
- **Columnar Data Warehousing:** Manages partitioned ORC tables and analytical reporting views within Apache Hive (`ipl_analytics`) for fast OLAP SQL queries.
- **Large-Scale Distributed Analytics:** Transforms 295,732 deliveries and 1,243 matches using Apache PySpark DataFrames, window functions, and multi-season aggregations.
- **Zero-Leakage Match Prediction:** Evaluates pre-match victory probabilities using PySpark MLlib classification models trained strictly without future data leakage.
- **High-Performance REST Backend:** Serves 16 asynchronous, type-safe endpoints via FastAPI with sub-10ms response times and automatic OpenAPI Swagger docs.
- **Interactive Web Analytics UI:** Visualizes comprehensive team, player, toss, venue, and season trends using Next.js 14 App Router, Tailwind CSS, and Recharts.

---

## 4. Unique Features (One Line Each)

- **Historical Streaming Replay Engine:** Faithfully simulates real-time match streaming from genuine Cricsheet historical logs over TCP sockets without synthetic records.
- **Cross-Era Franchise Name Normalization:** Resolves team rebrandings (e.g., Delhi Daredevils to Delhi Capitals, Kings XI Punjab to Punjab Kings) into unified historical franchise entities.
- **In-Depth Ground Bias Telemetry:** Uncovers empirical pitch biases across 60 stadiums (e.g., Chepauk 63.8% defending bias vs Sawai Mansingh 68.1% chasing bias).
- **Multi-Year Scoring Escalation Metrics:** Traces the explosive tactical evolution of T20 cricket from 8.31 RPO in 2008 to 9.88 RPO and 1,400+ sixes in recent editions.
- **Interactive Head-to-Head Rivalry Matrix:** Computes dynamic head-to-head win-loss ratios and season win trends for every franchise matchup with a single click.
- **Orange & Purple Cap Historical Ledger:** Unifies all-time batting and bowling career records alongside season-by-season cap winners across all 18 editions.
- **Self-Auditing Pipeline Health Monitor:** Features a live telemetry dashboard that automatically validates the operational status of Flume, HDFS, Hive, and PySpark.

---

## 5. End-to-End System Architecture

```
                          GENUINE IPL DATASET
                        (Cricsheet 2008 - 2026)
                        1,243 Matches | 295k Balls
                                   |
                                   v
                        +---------------------+
                        | scripts/download    |
                        | scripts/normalize   |
                        | scripts/validate    |
                        +----------+----------+
                                   |
                                   v
                        +---------------------+
                        | Historical Streaming|
                        | Replay Process      |
                        | (Socket / Spool)    |
                        +----------+----------+
                                   |
                                   v
                        +---------------------+
                        |    Apache Flume     |
                        |   Ingestion Agent   |
                        +----------+----------+
                                   |
                                   v
                        +---------------------+
                        |     Hadoop HDFS     |
                        |  Distributed Lake   |
                        +----------+----------+
                                   |
                     +-------------+-------------+
                     |                           |
                     v                           v
          +---------------------+     +---------------------+
          |     Apache Hive     |     |   Apache PySpark    |
          |   Data Warehouse    |     |  Distributed Engine |
          | (ORC / Data Marts)  |     | (8 Analytics Stages)|
          +----------+----------+     +----------+----------+
                     |                           |
                     +-------------+-------------+
                                   |
                                   v
                        +---------------------+
                        | Web Analytics Lake  |
                        |  (web_data/*.json)  |
                        +----------+----------+
                                   |
                                   v
                        +---------------------+
                        |  FastAPI Backend    |
                        | (16 REST Endpoints) |
                        +----------+----------+
                                   |
                                   v
                        +---------------------+
                        | Next.js 14 Frontend |
                        | React / Recharts UI |
                        +---------------------+
```

---

## 6. How to Run This Project

### Prerequisites
Make sure the following runtimes are installed on your system:
- **Python**: 3.10+ (Recommended: Python 3.11)
- **Node.js**: 18.x or newer (Tested on Node v24 & npm 11)
- **Java JDK**: 11 to 22 (Tested on OpenJDK 22)

---

### Method A: Automated One-Command Execution

#### On Windows:
```cmd
# 1. Run the complete data normalization, PySpark analytics, and verification audit:
scripts\run_pipeline.bat

# 2. Launch both the FastAPI backend (port 8000) and Next.js frontend (port 3000):
scripts\start_servers.bat
```

#### On Linux / macOS / WSL:
```bash
# 1. Grant execute permissions:
chmod +x scripts/*.sh

# 2. Run the complete pipeline:
./scripts/run_pipeline.sh

# 3. Launch both web servers:
./scripts/start_servers.sh
```

---

### Method B: Step-by-Step Manual Execution

If you prefer to run each component manually:

#### Step 1: Install Python & Frontend Dependencies
```bash
# Install Python packages
pip install -r requirements.txt

# Install Node packages for Next.js
cd frontend
npm install
cd ..
```

#### Step 2: Normalize Data & Execute PySpark Analytics
```bash
# 1. Normalize genuine Cricsheet records (creates 1,243 matches & 295,732 deliveries)
python scripts/normalize_data.py

# 2. Validate data constraints & verify 0 synthetic records
python scripts/validate_data.py

# 3. Execute all 8 PySpark distributed analytical stages
python pyspark/run_all_analytics.py

# 4. Export aggregated analytics into web_data/ JSON marts
python pyspark/export_web_data.py
```

#### Step 3: Run the Automated 10-Tier Verification Audit
```bash
python scripts/verify_pipeline.py
```
*Expected Output:* `AUDIT RESULT: 10 / 10 PASSED`

#### Step 4: Start the Servers
Open two terminal windows:

- **Terminal 1 (FastAPI Backend):**
  ```bash
  python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
  ```
  - API Root: [http://127.0.0.1:8000](http://127.0.0.1:8000)
  - Swagger Documentation: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
  - Pipeline Health Endpoint: [http://127.0.0.1:8000/api/health](http://127.0.0.1:8000/api/health)

- **Terminal 2 (Next.js Frontend):**
  ```bash
  cd frontend
  npm run dev
  ```
  - Interactive Web Dashboard: [http://localhost:3000](http://localhost:3000)

---

### Method C: Running the Streaming Replay & Apache Flume

To demonstrate live streaming ingestion into HDFS:

1. **Start the Apache Flume Agent:**
   ```bash
   flume-ng agent -n agent -c conf -f flume/ipl-flume.conf -Dflume.root.logger=INFO,console
   ```
2. **Start the Historical Streaming Replay:**
   ```bash
   # Replays historical deliveries to TCP socket port 44444 (captured by Flume)
   python streaming/replay_ipl.py --mode tcp --host 127.0.0.1 --port 44444 --delay 0.05
   ```
3. **Verify HDFS Ingestion:**
   ```bash
   python scripts/verify_flume_ingestion.py
   ```

---

## 7. Web Application Pages & Navigation

| Route | Page Name | Primary Features |
|---|---|---|
| `/` | **Overview Dashboard** | Global KPIs, all-time top franchises, scoring evolution chart, top 5 batters & bowlers. |
| `/teams` | **Franchises & Teams** | Standings table for 15 teams, win %, bat 1st vs chase wins, season charts, head-to-head rivalries. |
| `/players` | **Player Big Data** | Searchable roster, Orange/Purple Cap history, strike rates, economy rates, player profile drawer. |
| `/toss` | **Toss Insights** | Field first vs bat first splits, "Win Toss, Win Match" correlation, venue toss conversion rates. |
| `/venues` | **Stadiums & Venues** | Pitch telemetry across 60 grounds, 1st vs 2nd innings par scores, ground bias classifications. |
| `/seasons` | **Season Evolution** | Scoring escalation (8.31 to 9.88 RPO), sixes explosion (1,400+ sixes), season fixture samples. |
| `/matches` | **Match Ledger** | 1,243 official fixtures archive with multi-attribute filtering (Season, Team, Stadium) and pagination. |
| `/leaderboards`| **Leaderboards** | Top 10 in Runs, Wickets, Strike Rate, Economy, Sixes, Fours. |
| `/pipeline` | **Pipeline Monitor** | Live health telemetry for Flume, HDFS, Hive, PySpark, API cache with command cheat-sheet. |
| `/about` | **Project Spec** | College syllabus requirement, system architecture breakdown, data provenance details. |

---

## 8. Verification Audit Result (10 / 10 PASSED)

```
===========================================================================
 IPL BIG DATA ANALYTICS: FULL PIPELINE VERIFICATION AUDIT
===========================================================================
[PASS] 1. Genuine Dataset (1,243 matches, 295,732 real delivery records present)
[PASS] 2. Data Validation (Validation rules, schema constraints, and zero synthetic records enforced)
[PASS] 3. Hadoop HDFS (/ipl/raw, /ipl/warehouse lake hierarchy & winutils ready)
[PASS] 4. Apache Flume (Agent config verified: Socket/Spool -> Memory -> HDFS Sink)
[PASS] 5. Historical Streaming Replay (Python socket & spooling streaming event emitter ready)
[PASS] 6. Apache Hive (Database, external staging, managed ORC tables, and 13 analytical queries verified)
[PASS] 7. Apache PySpark (All 8 distributed analytical modules implemented)
[PASS] 8. PySpark Analytics Output (All lake analytical CSVs and ML evaluation reports populated)
[PASS] 9. Web Data Cache Layer (All 9 compiled analytical JSON marts populated)
[PASS] 10. Full-Stack Web Platform (FastAPI REST service & compiled Next.js UI operational)
===========================================================================
 AUDIT RESULT: 10 / 10 PASSED
===========================================================================
>>> ALL 10 PIPELINE & APPLICATION TIERS VERIFIED SUCCESSFULLY! <<<
```

---

## 9. Primary References & Provenance
1. **Primary Dataset**: [aadi-jn/indian-premier-league](https://github.com/aadi-jn/indian-premier-league) (Cricsheet ball-by-ball source 2008–2026).
2. **PySpark Architectural Reference**: [riddheshawade/IPL_Data_analysis_using_PySpark](https://github.com/riddheshawade/IPL_Data_analysis_using_PySpark).
3. **Cricsheet Open Data**: [https://cricsheet.org](https://cricsheet.org).

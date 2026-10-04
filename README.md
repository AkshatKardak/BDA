# IPL Large-Scale Cricket Data Analytics using Apache Flume, Hadoop HDFS, Hive and PySpark

![Apache Flume](https://img.shields.io/badge/Apache_Flume-Ingestion-blue?logo=apache)
![Hadoop HDFS](https://img.shields.io/badge/Hadoop_HDFS-Storage-orange?logo=apachehadoop)
![Apache Hive](https://img.shields.io/badge/Apache_Hive-Warehouse-yellow?logo=apachehive)
![Apache Spark](https://img.shields.io/badge/PySpark-Distributed_Analytics-red?logo=apachespark)
![FastAPI](https://img.shields.io/badge/FastAPI-REST_API-009688?logo=fastapi)
![Next.js 14](https://img.shields.io/badge/Next.js_14-App_Router-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-Modern_UI-38B2AC?logo=tailwind-css)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

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

## 3. Core Features

- **Streaming Delivery Ingestion:** Captures high-velocity ball-by-ball cricket event streams via Apache Flume with memory channel buffering and rolling HDFS sink persistence.
- **Distributed Storage Lake:** Stores raw event streams and partitioned analytical datasets reliably across Hadoop HDFS with native Windows winutils compatibility.
- **Columnar Data Warehousing:** Manages partitioned ORC tables and analytical reporting views within Apache Hive (`ipl_analytics`) for fast OLAP SQL queries.
- **Large-Scale Distributed Analytics:** Transforms 295,732 deliveries and 1,243 matches using Apache PySpark DataFrames, window functions, and multi-season aggregations.
- **Zero-Leakage Match Prediction:** Evaluates pre-match victory probabilities using PySpark MLlib classification models trained strictly without future data leakage.
- **High-Performance REST Backend:** Serves 16 asynchronous, type-safe endpoints via FastAPI with sub-10ms response times and automatic OpenAPI Swagger docs.
- **Interactive Web Analytics UI:** Visualizes comprehensive team, player, toss, venue, and season trends using Next.js 14 App Router, Tailwind CSS, and Recharts.

---

## 4. Unique Features

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
- **Node.js**: 18.x or newer (Tested on Node v20/v24 & npm)
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

> **Live Match Integration (API Key Added):**  
> A valid `CRICKET_API_KEY` has been integrated in `backend/.env` to power real-time match and live score queries through our FastAPI backend. When no match is currently active, the system cleanly reports tournament status while preserving 100% genuine Cricsheet data across historical analytics.

- **Terminal 2 (Next.js Frontend):**
  ```bash
  cd frontend
  npm run build
  npm run start
  ```
  - Interactive Web Dashboard: [http://localhost:3000](http://localhost:3000)

> [!IMPORTANT]
> ### 🛑 Crucial: OneDrive File-Locking & Cache Hygiene
> If this repository resides inside a **Microsoft OneDrive** synchronized folder (e.g. `C:\Users\...\OneDrive\Desktop\BDA`), OneDrive's background sync will actively lock files inside `.next/` while Webpack compiles, causing `Cannot find module './NNN.js'` or `404` errors.
>
> **Best Practices:**
> 1. **Preferred:** Move the project out of OneDrive to a non-synced directory (e.g., `C:\dev\BDA`).
> 2. **Otherwise:** Pause OneDrive sync while developing, or exclude `frontend\.next` and `frontend\node_modules` from OneDrive syncing.
> 3. **Never run `next dev` while OneDrive is actively syncing.**
> 4. **One-Command Recovery:** If you ever encounter `Cannot find module './NNN.js'` or stale chunks:
>    ```bash
>    cd frontend
>    npm run clean
>    npm run build
>    npm start
>    ```
>    The `npm run clean` script immediately wipes the stale `.next` directory from a clean slate. Nothing else is needed.

---

### Production Cloud Deployment (Netlify + Render)

This repository is pre-configured with infrastructure-as-code for one-click production deployment:

#### 1. Frontend on Netlify (`netlify.toml` included)
- **Base directory:** `frontend`
- **Build command:** `npm run build`
- **Publish directory:** `frontend/.next`
- **Node version:** `20` (pinned via `.nvmrc` and `engines`)
- **Plugin:** `@netlify/plugin-nextjs` (installed)
- **Environment Variables (Netlify Dashboard → Build & deploy → Environment):**
  - `NEXT_PUBLIC_API_URL` = `https://<your-render-backend-url>.onrender.com/api`

#### 2. Backend on Render (`render.yaml` included)
- **Service Type:** Web Service
- **Runtime:** Python 3.11
- **Build command:** `pip install fastapi uvicorn pydantic`
- **Start command:** `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
- **Runtime footprint:** Minimal and fast. The backend reads committed analytical JSON/CSV marts from `web_data/` and `output/`. No heavy PySpark/JVM memory overhead is required in production.
- **CORS:** Configured in `backend/config.py` with support for `https://*.netlify.app` and custom origins via `ALLOWED_ORIGINS`.

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

## 7. Repository Structure

```
BDA/
├── backend/
│   ├── config.py                 # Backend environment configuration
│   ├── main.py                   # FastAPI REST server with 16 analytical endpoints
│   └── __init__.py               # Python package initialization
├── data/
│   ├── cleaned/                  # Cleaned parquet & CSV datasets
│   ├── normalized/               # Standardized matches.csv & deliveries.csv
│   ├── raw/                      # Raw Cricsheet match & delivery dumps
│   ├── sample/                   # Historical sample data for streaming
│   └── SCHEMA_MAPPING.md         # Schema definitions & column dictionary
├── docs/
│   ├── architecture.md           # Deep-dive architecture design document
│   ├── installation.md           # Step-by-step setup and environment guide
│   └── troubleshooting.md        # Big Data troubleshooting FAQ
├── flume/
│   ├── ipl-flume.conf            # Apache Flume Netcat/Spool -> Memory -> HDFS agent
│   └── README.md                 # Flume ingestion documentation
├── frontend/
│   ├── app/                      # Next.js 14 App Router pages
│   │   ├── about/                # Academic project specification & architecture
│   │   ├── leaderboards/         # All-time batting & bowling records
│   │   ├── matches/              # Searchable ledger of 1,243 IPL matches
│   │   ├── pipeline/             # Live pipeline health & telemetry monitor
│   │   ├── players/              # Player stats, Orange/Purple Caps & drawer
│   │   ├── seasons/              # Historical scoring & boundary trends
│   │   ├── teams/                # Franchise standings, telemetry & head-to-head
│   │   ├── toss/                 # Toss impact, decisions & venue win rates
│   │   ├── venues/               # Pitch profiles & par scores across 60 grounds
│   │   ├── globals.css           # IPL navy/blue/gold design system
│   │   ├── layout.tsx            # Global layout with sports navigation & footer
│   │   └── page.tsx              # Executive tournament dashboard
│   ├── components/               # Modular sports analytics UI components
│   │   ├── ArchitectureFlow.tsx  # Interactive pipeline architecture visualization
│   │   ├── Footer.tsx            # Academic attribution & repository links
│   │   ├── Navbar.tsx            # Sports broadcast navigation bar
│   │   └── StatCard.tsx          # Consistent KPI metric card with gold accents
│   ├── lib/
│   │   └── api.ts                # Type-safe API client for FastAPI backend
│   ├── types/
│   │   └── index.ts              # TypeScript interfaces for all IPL data models
│   ├── package.json              # Frontend dependencies (Next.js 14, Tailwind, Recharts)
│   └── tailwind.config.ts        # Custom IPL color palette & styling tokens
├── hadoop/
│   ├── bin/                      # winutils.exe and hadoop.dll for Windows
│   ├── core-site.xml             # Hadoop core configuration (HDFS default FS)
│   ├── hdfs-site.xml             # Replication and namenode/datanode paths
│   ├── mapred-site.xml           # MapReduce framework configuration
│   ├── yarn-site.xml             # YARN resource manager configuration
│   └── *.sh                      # Hadoop cluster management scripts
├── hive/
│   ├── 01_create_database.sql    # Hive database creation script
│   ├── 02_create_tables.sql      # External staging & managed ORC tables
│   ├── 03_load_data.sql          # Ingestion queries from HDFS to Hive ORC
│   ├── 04_analytics.sql          # 13 analytical OLAP queries
│   └── 05_views.sql              # Analytical reporting views
├── output/
│   ├── player_performance/       # PySpark player metrics (CSV/Parquet)
│   ├── season_analysis/          # PySpark season escalation metrics
│   ├── team_performance/        # PySpark team win rates & head-to-head metrics
│   ├── toss_analysis/            # PySpark toss decision & venue conversion metrics
│   ├── venue_analysis/           # PySpark stadium profiles & par scores
│   └── prediction_metrics.txt    # PySpark MLlib match prediction evaluation
├── pyspark/
│   ├── 01_ingestion.py           # PySpark data ingestion from HDFS/local
│   ├── 02_cleaning.py            # Data cleaning & type normalization
│   ├── 03_player_analysis.py     # Batting/bowling stats & cap leaderboards
│   ├── 04_team_analysis.py       # Franchise performance & rivalry matrices
│   ├── 05_toss_analysis.py       # Toss decision & outcome correlation
│   ├── 06_venue_analysis.py      # Stadium par score & bias analysis
│   ├── 07_season_analysis.py     # Tournament scoring rate progression
│   ├── 08_match_prediction.py    # PySpark MLlib match winner classifier
│   ├── export_web_data.py        # Compiles PySpark outputs into JSON marts
│   ├── run_all_analytics.py      # Orchestrator for all 8 PySpark stages
│   └── spark_utils.py            # SparkSession factory & shared helpers
├── scripts/
│   ├── download_data.py          # Downloads genuine Cricsheet dataset
│   ├── normalize_data.py         # Standardizes raw CSVs to uniform schema
│   ├── validate_data.py          # Data validation & zero-synthetic audit
│   ├── run_pipeline.bat/.sh      # Automated full-pipeline execution script
│   ├── start_servers.bat/.sh     # One-click startup for FastAPI and Next.js
│   └── verify_pipeline.py        # 10-tier automated pipeline health audit
├── streaming/
│   ├── event_formatter.py        # Formats ball-by-ball events for streaming
│   └── replay_ipl.py             # Historical delivery stream emitter (TCP/Spool)
├── web_data/                     # Pre-aggregated analytical JSON data marts
├── requirements.txt              # Python runtime dependencies
└── spark_common.py               # Shared SparkSession configuration
```

---

## 8. Primary References & Provenance
1. **Primary Dataset**: [aadi-jn/indian-premier-league](https://github.com/aadi-jn/indian-premier-league) (Cricsheet ball-by-ball source 2008–2026).
2. **PySpark Architectural Reference**: [riddheshawade/IPL_Data_analysis_using_PySpark](https://github.com/riddheshawade/IPL_Data_analysis_using_PySpark).
3. **Cricsheet Open Data**: [https://cricsheet.org](https://cricsheet.org).

---

## 9. License
This project is open-source and licensed under the [MIT License](LICENSE).

---

## Author
Built with pride for Big Data Analytics by **[Akshat Kardak](https://github.com/AkshatKardak)**.

# IPL Large-Scale Cricket Data Analytics using Apache Flume, Hadoop HDFS, Hive and PySpark

![Apache Flume](https://img.shields.io/badge/Apache_Flume-Ingestion-blue?logo=apache)
![Hadoop HDFS](https://img.shields.io/badge/Hadoop_HDFS-Storage-orange?logo=apachehadoop)
![Apache Hive](https://img.shields.io/badge/Apache_Hive-Warehouse-yellow?logo=apachehive)
![Apache Spark](https://img.shields.io/badge/PySpark-Distributed_Analytics-red?logo=apachespark)
![Python](https://img.shields.io/badge/Python-3.11+-brightgreen?logo=python)
![Streamlit](https://img.shields.io/badge/Streamlit-Dashboard-red?logo=streamlit)

---

## 1. Project Title
**IPL Large-Scale Cricket Data Analytics using Apache Flume, Hadoop HDFS, Hive and PySpark**

---

## 2. Problem Statement
The Indian Premier League (IPL) is among the most intensely followed sports spectacles in the world, generating massive streams of ball-by-ball event data, player career trajectories, and situational team dynamics across 1,200+ matches and nearly 300,000 deliveries over 18 years.

Traditional monolithic relational database management systems (RDBMS) struggle with:
1. Ingesting continuous high-velocity delivery event streams without dropping packets or degrading query performance.
2. Managing multi-gigabyte historical event logs in scalable, fault-tolerant distributed storage.
3. Performing complex multi-dimensional aggregations (e.g., career strike rates, economy rates, venue chase biases) across distributed data partitions.

This project designs and implements an end-to-end Big Data Lake and Analytics architecture using **Apache Flume**, **Hadoop HDFS**, **Apache Hive**, and **PySpark** to ingest, store, clean, analyze, and visualize genuine IPL cricket data.

---

## 3. Academic Requirement
This project satisfies the following requirement from the College Big Data Analytics (BDA) mini-project specification:

> **Mini Project Requirement**: *One real-life large data application to be implemented (Use standard Datasets available on the web).*  
> **Selected Category**: *Streaming data analysis: use Flume for data capture and HIVE/PySpark for analysis.*

### Academic Integrity & Real Data Rule
- **No Fake Data**: The project uses **100% genuine, publicly verifiable historical IPL records** (2008 – 2026) derived from Cricsheet.
- **Historical Stream Replay**: To make the Flume ingestion demonstration fully reproducible without depending on commercial live APIs, real historical deliveries are replayed sequentially as streaming events into Apache Flume.

---

## 4. Why IPL Cricket?
- **High Event Density**: Every match produces ~240 discrete ball events with 30+ dimensions (batter, bowler, pitch location, runs, extras, dismissals, match phase).
- **Rivalry & Tactical Nuances**: The dataset permits deep tactical analyses including toss advantage, boundary run share, par score drift across 60 stadiums, and franchise head-to-head dominance.
- **Real-World Streaming Suitability**: Ball-by-ball cricket events mirror financial tick data or IoT sensor streams, making it a canonical candidate for Flume-to-HDFS ingestion.

---

## 5. System Architecture

```
                          REAL IPL DATASET
                       (Cricsheet 2008 - 2026)
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
                       | Streaming Replay    |
                       | (replay_ipl.py)     |
                       | Configurable Delay  |
                       +----------+----------+
                                  |
                                  v
                       +---------------------+
                       | Apache Flume Agent  |
                       | Exec / Netcat Src   |
                       | Memory Channel      |
                       | HDFS Rolling Sink   |
                       +----------+----------+
                                  |
                                  v
                       +---------------------+
                       | Hadoop HDFS Lake    |
                       | /ipl/raw/           |
                       | /ipl/processed/     |
                       +----------+----------+
                                  |
                 +----------------+----------------+
                 |                                 |
                 v                                 v
        +------------------+             +------------------+
        |   Apache Hive    |             |     PySpark      |
        |  SQL Analytics   |             | Distributed DAGs |
        |  ORC Partitions  |             | Window Functions |
        +--------+---------+             +--------+---------+
                 |                                |
                 +----------------+---------------+
                                  |
                                  v
                       +---------------------+
                       | Analytical Outputs  |
                       |  - Player Ranks     |
                       |  - Team Win %       |
                       |  - Toss Advantage   |
                       |  - Venue Profiles   |
                       |  - Season Evolution |
                       |  - ML Predictions   |
                       +----------+----------+
                                  |
                                  v
                       +---------------------+
                       | Streamlit Dashboard |
                       | (dashboard/app.py)  |
                       +---------------------+
```

---

## 6. Technology Stack & Software Compatibility Matrix

| Component | Software Version | Role / Responsibility |
|:---|:---|:---|
| **Operating System** | Ubuntu 22.04 LTS (Native or WSL2) / Windows 10/11 | Host operating system |
| **Java Development Kit** | OpenJDK 11 (Recommended) or JDK 8 / 17 | Core runtime for Hadoop, Hive, Spark, and Flume |
| **Hadoop HDFS** | Apache Hadoop 3.3.6 | Distributed data lake storage and replication |
| **Apache Flume** | Apache Flume 1.9.0 / 1.11.0 | Streaming event capture and rolling HDFS sink |
| **Apache Hive** | Apache Hive 3.1.3 / 4.0.0 | SQL warehousing, ORC partitioned lake tables |
| **Apache Spark** | Apache Spark 3.5.3 / 4.x (PySpark) | Distributed DataFrame and Spark SQL processing |
| **Python** | Python 3.10 or 3.11 | Replay script, validation, orchestration, ML |
| **Machine Learning** | Scikit-learn 1.3+ | Pre-match outcome classification (Zero leakage) |
| **Dashboard** | Streamlit 1.30+ & Plotly | Interactive presentation layer |

### Environmental Compatibility Note for Windows Users
Big Data distributed frameworks (Hadoop, Hive, Flume) were architected natively for Linux environments.
- On Windows, a **WSL2 (Windows Subsystem for Linux)** Ubuntu environment is strongly recommended for running the complete multi-daemon cluster (`namenode`, `datanode`, `resourcemanager`, `hive-server2`, `flume-ng`).
- For standalone local validation on Windows native, our project includes `winutils.exe` and `hadoop.dll` under `hadoop/bin/` and provides cross-platform Python orchestrators (`run_pipeline.py`).

---

## 7. Dataset Sources & Attribution
- **Primary Repository**: [aadi-jn/indian-premier-league](https://github.com/aadi-jn/indian-premier-league)
- **Data Heritage**: [Cricsheet](https://cricsheet.org) (Licensed under Creative Commons Attribution-ShareAlike 4.0 International - CC BY-SA 4.0)
- **Backup Repository**: [ritesh-ojha/IPL-DATASET](https://github.com/ritesh-ojha/IPL-DATASET)
- **Coverage**: 1,243 IPL matches, 295,732 deliveries spanning 18 tournament editions (2008 – 2026).

---

## 8. Installation & Setup Instructions

### Step 1: Clone Repository
```bash
git clone https://github.com/AkshatKardak/Error.git ipl-big-data-analytics
cd ipl-big-data-analytics
```

### Step 2: Set up Python Virtual Environment
```bash
# On Linux / WSL:
python3 -m venv .venv
source .venv/bin/activate

# On Windows PowerShell:
python -m venv .venv
.venv\Scripts\Activate.ps1
```

### Step 3: Install Required Dependencies
```bash
pip install -r requirements.txt
```

---

## 9. Data Acquisition & Validation

### Step 4: Download Real IPL Data
```bash
python scripts/download_data.py
```
*Downloads genuine match and ball-by-ball delivery Parquet files and franchise seed aliases.*

### Step 5: Normalize Data
```bash
python scripts/normalize_data.py
```
*Standardizes franchise aliases (e.g. Delhi Daredevils -> Delhi Capitals), normalizes seasons, and generates clean CSV files in `data/normalized/`.*

### Step 6: Validate Data Integrity
```bash
python scripts/validate_data.py
```
*Performs schema auditing, duplicate key checks, null rate verification, and prints a statistical profile.*

---

## 10. Hadoop HDFS Setup & Initialization

### Step 7: Start Hadoop Daemons (Linux / WSL)
```bash
bash hadoop/start_hadoop.sh
```
Verify active daemons with `jps`:
- `NameNode`
- `DataNode`
- `SecondaryNameNode`
- `ResourceManager`
- `NodeManager`

### Step 8: Initialize HDFS Lake Hierarchy
```bash
bash hadoop/create_ipl_dirs.sh
bash hadoop/setup_hdfs.sh
```

### Step 9: Audit HDFS Lake Storage
```bash
bash hadoop/verify_hdfs.sh
```

---

## 11. Apache Flume Streaming Ingestion

### Step 10: Start Flume Ingestion Agent
```bash
flume-ng agent \
  --conf ./flume \
  --conf-file ./flume/ipl-flume.conf \
  --name agent \
  -Dflume.root.logger=INFO,console
```

### Step 11: Launch Historical Streaming Replay
In a separate terminal:
```bash
# Continuous replay with 10ms delay between balls:
python streaming/replay_ipl.py --file data/normalized/deliveries.csv --delay 0.01

# Or test replaying a specific season (e.g. 2024):
python streaming/replay_ipl.py --season 2024 --delay 0.005
```

### Step 12: Verify Ingested Records in HDFS
```bash
hdfs dfs -ls /ipl/raw/deliveries/
hdfs dfs -cat /ipl/raw/deliveries/*/*.csv | head -n 20
```

---

## 12. Apache Hive SQL Analytics

Execute the modular Hive scripts:
```bash
# 1. Create ipl_analytics database
hive -f hive/01_create_database.sql

# 2. Create external staging and partitioned managed ORC tables
hive -f hive/02_create_tables.sql

# 3. Perform dynamic partition ETL into ORC tables
hive -f hive/03_load_data.sql

# 4. Execute 13 core analytical queries
hive -f hive/04_analytics.sql

# 5. Build analytical views for dashboard mart
hive -f hive/05_views.sql
```

---

## 13. PySpark Distributed Analytics Pipeline

Execute the 8 distributed processing stages:
```bash
# Stage 1: Explicit StructType Ingestion & Lake Persistence
python pyspark/01_ingestion.py

# Stage 2: Feature Engineering & Phase Partitioning
python pyspark/02_cleaning.py

# Stage 3: Player Career Leaderboards & Window Rankings
python pyspark/03_player_analysis.py

# Stage 4: Franchise Performance & Head-to-Head Rivalries
python pyspark/04_team_analysis.py

# Stage 5: Toss Advantage & Tactical Decision Dynamics
python pyspark/05_toss_analysis.py

# Stage 6: Stadium Behavior & Pitch Characteristics
python pyspark/06_venue_analysis.py

# Stage 7: Macro-Temporal Tournament Evolution (2008 - 2026)
python pyspark/07_season_analysis.py

# Stage 8: Optional ML Pre-Match Outcome Forecasting (Zero Leakage)
python pyspark/08_match_prediction.py
```

---

## 14. Interactive Presentation Dashboard

Launch the Streamlit executive dashboard:
```bash
streamlit run dashboard/app.py
```
Access at `http://localhost:8501`.

---

## 15. Master End-to-End Orchestrator

To execute all acquisition, validation, replay, and analytical stages in a single command:
```bash
# Cross-platform master runner:
python run_pipeline.py

# Or on Linux / WSL:
bash scripts/start_pipeline.sh
```

To verify all components across the pipeline:
```bash
bash scripts/verify_pipeline.sh
```

---

## 16. Troubleshooting & Common Pitfalls

1. **`Did not find winutils.exe` on Windows**:
   - Solution: Our project includes pre-compiled Hadoop 3.3.6 `winutils.exe` and `hadoop.dll` under `hadoop/bin/`. `spark_common.py` automatically binds `HADOOP_HOME` to this folder.
2. **`ModuleNotFoundError: No module named 'pyspark.spark_utils'`**:
   - Solution: Renamed to `spark_common.py` in project root to prevent module shadowing with installed PySpark package.
3. **Flume `ConnectionRefused` on Netcat Source**:
   - Solution: Ensure the Flume agent is started *before* launching `replay_ipl.py --mode tcp`.
4. **Hive Table Partitioning Issues**:
   - Solution: Enable dynamic partitioning before inserts:
     ```sql
     SET hive.exec.dynamic.partition = true;
     SET hive.exec.dynamic.partition.mode = nonstrict;
     ```

---

## 17. Limitations & Future Roadmap
- **Historical Replay vs Live WebSocket**: Uses authenticated historical records. Future iterations can integrate Apache Kafka with a real-time web scraper.
- **Ball Trajectory & Hawkeye Coordinates**: Current public datasets record score outcomes but lack Hawkeye 3D ball coordinates.
- **Distributed Hyperparameter Tuning**: ML forecasting currently uses local cross-validation; future versions can scale across Spark MLlib `CrossValidator` across worker nodes.
"# BDA" 

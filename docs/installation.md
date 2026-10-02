# Installation and Deployment Guide
## IPL Large-Scale Cricket Data Analytics (Flume · HDFS · Hive · PySpark)

---

## 1. System Requirements

Before running the platform, ensure the following core runtimes are installed on your machine:

| Component | Minimum Version | Recommended Version | Purpose |
|-----------|-----------------|---------------------|---------|
| **Python** | 3.10+ | 3.11.x | Data normalization, PySpark driver, FastAPI backend |
| **Node.js** | 18.x+ | 20.x or 24.x | Next.js 14 Web Frontend |
| **Java JDK** | 11+ | OpenJDK 17 or 22 | Apache Spark / PySpark execution |
| **Hadoop Winutils** | 3.0+ | 3.3.6 (included in `hadoop/bin/`) | Windows filesystem translation |

---

## 2. Quick-Start (One-Command Setup)

### On Windows:
```cmd
# 1. Clone or navigate to the project directory
cd "C:\Users\AJIT KARDAK\OneDrive\Desktop\BDA"

# 2. Run the full data and analytics pipeline
scripts\run_pipeline.bat

# 3. Start the FastAPI backend and Next.js frontend
scripts\start_servers.bat
```

### On Linux / macOS / WSL:
```bash
# 1. Clone or navigate to the project directory
cd /path/to/BDA

# 2. Run the full data and analytics pipeline
chmod +x scripts/*.sh
./scripts/run_pipeline.sh

# 3. Start both web servers
./scripts/start_servers.sh
```

---

## 3. Step-by-Step Manual Setup

### Step 1: Install Python Dependencies
```bash
pip install -r requirements.txt
```
Key packages include:
- `pyspark>=3.5.0`
- `pandas>=2.0.0`
- `pyarrow>=14.0.0`
- `fastapi>=0.110.0`
- `uvicorn>=0.28.0`
- `pydantic>=2.6.0`

### Step 2: Install Frontend Dependencies
```bash
cd frontend
npm install
cd ..
```

### Step 3: Run the PySpark Analytics Suite
```bash
# Normalize genuine Cricsheet records
python scripts/normalize_data.py

# Validate schema constraints & verify 0 synthetic records
python scripts/validate_data.py

# Execute all 8 PySpark distributed stages
python pyspark/run_all_analytics.py

# Export aggregated analytics to web_data/ JSON marts
python pyspark/export_web_data.py
```

### Step 4: Run Integrity Verification Audit
```bash
python scripts/verify_pipeline.py
```
Expected output:
```
===========================================================================
 AUDIT RESULT: 10 / 10 PASSED
===========================================================================
>>> ALL 10 PIPELINE & APPLICATION TIERS VERIFIED SUCCESSFULLY! <<<
```

### Step 5: Start the Servers
In Terminal 1 (FastAPI Backend):
```bash
python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```
- API Base: `http://127.0.0.1:8000`
- Interactive Swagger UI: `http://127.0.0.1:8000/docs`

In Terminal 2 (Next.js Frontend):
```bash
cd frontend
npm run dev
```
- Dashboard UI: `http://localhost:3000`

---

## 4. Running the Historical Streaming Replay with Apache Flume

To demonstrate the real-time event capture requirement:

1. **Start the Flume Agent**:
   ```bash
   flume-ng agent -n agent -c conf -f flume/ipl-flume.conf -Dflume.root.logger=INFO,console
   ```
2. **Launch the Historical Replay**:
   ```bash
   # Replays real historical deliveries to TCP port 44444
   python streaming/replay_ipl.py --mode tcp --host 127.0.0.1 --port 44444 --delay 0.05
   ```
3. **Inspect Events in HDFS**:
   ```bash
   hdfs dfs -ls /ipl/raw/deliveries/
   ```

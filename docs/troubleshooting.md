# Troubleshooting and Optimization Guide
## IPL Large-Scale Cricket Data Analytics

---

## 1. Java 17 / 22 Compatibility with Apache Spark

### Symptom:
```
java.lang.reflect.InaccessibleObjectException: Unable to make protected java.io.InputStream(java.io.FileDescriptor) accessible
```

### Root Cause:
Java 9+ strongly encapsulates JDK internals. Apache Spark requires access to internal sun/java memory packages for off-heap buffer operations.

### Solution:
The project automatically injects the required flags in `spark_common.py` via `JAVA_TOOL_OPTIONS`:
```python
java_opts = [
    "--add-opens=java.base/java.lang=ALL-UNNAMED",
    "--add-opens=java.base/java.lang.invoke=ALL-UNNAMED",
    "--add-opens=java.base/java.lang.reflect=ALL-UNNAMED",
    "--add-opens=java.base/java.io=ALL-UNNAMED",
    "--add-opens=java.base/java.net=ALL-UNNAMED",
    "--add-opens=java.base/java.nio=ALL-UNNAMED",
    "--add-opens=java.base/java.util=ALL-UNNAMED",
    "--add-opens=java.base/java.util.concurrent=ALL-UNNAMED",
    "--add-opens=java.base/sun.nio.ch=ALL-UNNAMED"
]
os.environ["JAVA_TOOL_OPTIONS"] = " ".join(java_opts)
```

---

## 2. Windows NetBIOS Resolution Delays

### Symptom:
PySpark session initialization hangs for 30–60 seconds before executing tasks.

### Root Cause:
On Windows machines, Spark defaults to looking up the local NetBIOS machine name via DNS/WINS, which triggers a Windows timeout.

### Solution:
Explicitly bind the driver host and listen address to localhost in the SparkSession configuration:
```python
builder = (
    SparkSession.builder
    .config("spark.driver.host", "127.0.0.1")
    .config("spark.driver.bindAddress", "127.0.0.1")
)
```
This reduces initialization latency to under 3 seconds.

---

## 3. Windows Native Hadoop (`winutils.exe`)

### Symptom:
```
Could not locate executable null\bin\winutils.exe in the Hadoop binaries.
Failed to locate a WINUTILS.EXE in the PATH.
```

### Root Cause:
Hadoop relies on native POSIX filesystem permissions (`chmod`, `chown`) which do not exist natively on Windows.

### Solution:
The repository includes pre-built Windows binaries in `hadoop/bin/winutils.exe` and `hadoop/bin/hadoop.dll`.
`spark_common.py` dynamically sets `HADOOP_HOME`:
```python
hadoop_home = os.path.join(BASE_DIR, "hadoop")
os.environ["HADOOP_HOME"] = hadoop_home
os.environ["PATH"] = os.path.join(hadoop_home, "bin") + os.path.pathsep + os.environ.get("PATH", "")
```

---

## 4. Port Conflicts (8000 or 3000 Already in Use)

### Symptom:
`[Errno 10048] error while attempting to bind on address ('0.0.0.0', 8000)`

### Solution:
1. Identify which process is holding port 8000:
   ```powershell
   Get-NetTCPConnection -LocalPort 8000
   ```
2. Kill the conflicting PID:
   ```powershell
   Stop-Process -Id <PID> -Force
   ```
3. Alternatively, launch FastAPI on a different port:
   ```bash
   uvicorn backend.main:app --port 8080
   ```
   And set `NEXT_PUBLIC_API_URL=http://127.0.0.1:8080/api` in `frontend/.env.local`.

---

## 5. Apache Flume Streaming Socket Connection Timeout

### Symptom:
`ConnectionRefusedError: [WinError 10061] No connection could be made because the target machine actively refused it`

### Solution:
When running `streaming/replay_ipl.py --mode tcp`, start the Flume agent **before** launching the replay script, so port 44444 is actively listening:
```bash
# Terminal 1: Start Flume
flume-ng agent -n agent -c conf -f flume/ipl-flume.conf

# Terminal 2: Start Replay
python streaming/replay_ipl.py --mode tcp --port 44444
```
For standalone local testing without Flume running, use:
```bash
python streaming/replay_ipl.py --mode stdout --limit 20
```

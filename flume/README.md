# Apache Flume: Real IPL Streaming Ingestion

## 1. Architecture Overview

```
 +---------------------------------------------+
 | Genuine IPL Ball-by-Ball Dataset            |
 | (data/normalized/deliveries.csv)           |
 +----------------------+----------------------+
                        |
                        v
 +---------------------------------------------+
 | Python Streaming Replay Script              |
 | (streaming/replay_ipl.py --delay 0.01)      |
 +----------------------+----------------------+
                        |
                        v
 +---------------------------------------------+
 | Apache Flume Agent ('agent')                |
 |                                             |
 |  [Exec / Netcat Source: r1]                 |
 |            |                                |
 |            v                                |
 |  [Memory Channel: c1] (100,000 capacity)    |
 |            |                                |
 |            v                                |
 |  [HDFS Sink: k1]                            |
 +----------------------+----------------------+
                        |
                        v
 +---------------------------------------------+
 | Hadoop Distributed File System (HDFS)       |
 | hdfs://localhost:9000/ipl/raw/deliveries/   |
 +---------------------------------------------+
```

---

## 2. Prerequisites
1. **Hadoop NameNode & DataNode** running (`jps` should show `NameNode`, `DataNode`, `SecondaryNameNode`).
2. **Java 8 or 11** installed and configured in `JAVA_HOME`.
3. **Apache Flume 1.9.0 / 1.11.0** installed.
   - On Ubuntu / WSL:
     ```bash
     wget https://archive.apache.org/dist/flume/1.9.0/apache-flume-1.9.0-bin.tar.gz
     tar -xzvf apache-flume-1.9.0-bin.tar.gz -C /opt/
     export FLUME_HOME=/opt/apache-flume-1.9.0-bin
     export PATH=$PATH:$FLUME_HOME/bin
     ```
   - Ensure `$FLUME_HOME/conf/flume-env.sh` points to Hadoop classpath:
     ```bash
     export HADOOP_HOME=/usr/local/hadoop
     export FLUME_CLASSPATH=$($HADOOP_HOME/bin/hadoop classpath)
     ```

---

## 3. Starting the Flume Ingestion Agent

### Option A: Exec Source Mode (Automatic continuous replay)
Run from the project root:
```bash
flume-ng agent \
  --conf ./flume \
  --conf-file ./flume/ipl-flume.conf \
  --name agent \
  -Dflume.root.logger=INFO,console
```

### Option B: Netcat Source Mode (Socket streaming)
1. In `flume/ipl-flume.conf`, uncomment the Netcat source lines.
2. Launch the Flume agent:
   ```bash
   flume-ng agent \
     --conf ./flume \
     --conf-file ./flume/ipl-flume.conf \
     --name agent \
     -Dflume.root.logger=INFO,console
   ```
3. In a separate terminal, launch the replay utility:
   ```bash
   python3 streaming/replay_ipl.py \
     --file data/normalized/deliveries.csv \
     --mode tcp \
     --host 127.0.0.1 \
     --port 44444 \
     --delay 0.01
   ```

---

## 4. Verifying Ingestion in HDFS

### 1. Verify Directory Creation
```bash
hdfs dfs -ls /ipl/raw/deliveries/
```

### 2. Verify File Creation & Sizes
```bash
hdfs dfs -ls -R /ipl/raw/deliveries/
hdfs dfs -du -h /ipl/raw/deliveries/
```

### 3. Inspect Captured Records
```bash
hdfs dfs -cat /ipl/raw/deliveries/*/* | head -n 20
```

### 4. Flume Log Analysis
Logs are output directly to the console or written to `flume/logs/flume.log`.
Expected log entries:
```
INFO hdfs.HDFSEventSink: Writer opened for .../ipl-deliveries.1712000000000.csv
INFO hdfs.HDFSEventSink: Closing .../ipl-deliveries.1712000000000.csv
```

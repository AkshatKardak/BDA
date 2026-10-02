#!/usr/bin/env python3
"""
streaming/replay_ipl.py
=======================
Streams genuine historical IPL ball-by-ball delivery records sequentially to Apache Flume.

Academic Rule:
  100% genuine data replay. Every emitted event matches an actual historical delivery.
  Timing is simulated by controlled inter-event delay.

Supported Input Formats:
  - CSV (data/normalized/deliveries.csv)
  - JSON Lines (data/normalized/deliveries.jsonl)

Supported Ingestion Modes:
  - stdout: Emits records to stdout (for Apache Flume Exec Source)
  - tcp:    Streams over TCP socket (for Apache Flume Netcat Source)
  - file:   Appends to a log file (for Apache Flume Spooling/Tail Source)

Usage Examples:
  python streaming/replay_ipl.py --file data/normalized/deliveries.jsonl --delay 0.05
  python streaming/replay_ipl.py --limit 1000 --delay 0.02
  python streaming/replay_ipl.py --season 2024 --delay 0.01
"""

import os
import sys
import time
import socket
import signal
import argparse
import csv
import json

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, BASE_DIR)

from streaming.event_formatter import format_delivery_to_json, format_delivery_to_delimited

DEFAULT_JSONL = os.path.join(BASE_DIR, "data", "normalized", "deliveries.jsonl")
DEFAULT_CSV = os.path.join(BASE_DIR, "data", "normalized", "deliveries.csv")
SAMPLE_JSONL = os.path.join(BASE_DIR, "data", "sample", "deliveries_sample.jsonl")

RUNNING = True


def signal_handler(sig, frame):
    global RUNNING
    sys.stderr.write("\n[INFO] Interrupt received. Shutting down streaming replay gracefully...\n")
    RUNNING = False


signal.signal(signal.SIGINT, signal_handler)
signal.signal(signal.SIGTERM, signal_handler)


def main():
    parser = argparse.ArgumentParser(description="Real Historical IPL Ball-by-Ball Streaming Replay Engine")
    parser.add_argument("--file", type=str, default=None, help="Path to normalized deliveries CSV or JSONL")
    parser.add_argument("--delay", type=float, default=0.01, help="Delay in seconds between emitted deliveries (default: 0.01)")
    parser.add_argument("--limit", "--max-records", dest="limit", type=int, default=None, help="Maximum records to replay")
    parser.add_argument("--season", type=str, default=None, help="Filter deliveries by tournament season (e.g. 2024)")
    parser.add_argument("--match-id", type=int, default=None, help="Filter deliveries for a specific match_id")
    parser.add_argument("--format", choices=["json", "delimited"], default="json", help="Event serialization format")
    parser.add_argument("--mode", choices=["stdout", "tcp", "file"], default="stdout", help="Target ingestion mode")
    parser.add_argument("--host", type=str, default="127.0.0.1", help="TCP Host for Flume Netcat source")
    parser.add_argument("--port", type=int, default=44444, help="TCP Port for Flume Netcat source")
    parser.add_argument("--output-file", type=str, default=os.path.join(BASE_DIR, "flume", "logs", "stream.log"), help="Log file path for file mode")

    args = parser.parse_args()

    input_file = args.file
    if not input_file:
        if os.path.exists(DEFAULT_JSONL):
            input_file = DEFAULT_JSONL
        elif os.path.exists(DEFAULT_CSV):
            input_file = DEFAULT_CSV
        elif os.path.exists(SAMPLE_JSONL):
            input_file = SAMPLE_JSONL

    if not input_file or not os.path.exists(input_file):
        sys.stderr.write(f"[ERROR] Deliveries file not found: {input_file}. Run scripts/download_data.py and pipeline/normalize_data.py first.\n")
        sys.exit(1)

    is_jsonl = input_file.endswith(".jsonl")

    sys.stderr.write("=" * 65 + "\n")
    sys.stderr.write(" IPL BIG DATA ANALYTICS: STREAMING REPLAY ENGINE\n")
    sys.stderr.write("=" * 65 + "\n")
    sys.stderr.write(f" Input File:   {input_file}\n")
    sys.stderr.write(f" Input Type:   {'JSON Lines' if is_jsonl else 'CSV'}\n")
    sys.stderr.write(f" Mode:         {args.mode}\n")
    sys.stderr.write(f" Format:       {args.format}\n")
    sys.stderr.write(f" Delay:        {args.delay} s/event\n")
    if args.season:
        sys.stderr.write(f" Season:       {args.season}\n")
    if args.match_id:
        sys.stderr.write(f" Match ID:     {args.match_id}\n")
    if args.limit:
        sys.stderr.write(f" Limit:        {args.limit:,} records\n")
    sys.stderr.write("=" * 65 + "\n")

    # Setup mode-specific transport
    sock = None
    file_handle = None
    if args.mode == "tcp":
        sys.stderr.write(f"[INFO] Connecting to Flume Netcat Source at {args.host}:{args.port}...\n")
        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.connect((args.host, args.port))
            sys.stderr.write("[SUCCESS] Connected to Flume TCP socket.\n")
        except Exception as e:
            sys.stderr.write(f"[ERROR] Could not connect to Flume Netcat source: {e}\n")
            sys.stderr.write("        Ensure Apache Flume is running with Netcat source on port 44444.\n")
            sys.exit(1)
    elif args.mode == "file":
        os.makedirs(os.path.dirname(args.output_file), exist_ok=True)
        file_handle = open(args.output_file, "a", encoding="utf-8")
        sys.stderr.write(f"[INFO] Streaming to append log: {args.output_file}\n")

    emitted_count = 0
    start_time = time.time()

    try:
        with open(input_file, mode="r", encoding="utf-8") as f:
            if is_jsonl:
                iterator = (json.loads(line) for line in f if line.strip())
            else:
                iterator = csv.DictReader(f)

            for row in iterator:
                if not RUNNING:
                    break

                # Apply filters
                if args.season and str(row.get("season", "")).strip() != args.season:
                    continue
                if args.match_id and int(row.get("match_id", 0)) != args.match_id:
                    continue

                # Format payload
                if is_jsonl:
                    if args.format == "json":
                        payload = json.dumps(row)
                    else:
                        payload = format_delivery_to_delimited(row)
                else:
                    if args.format == "json":
                        payload = format_delivery_to_json(row)
                    else:
                        payload = format_delivery_to_delimited(row)

                # Send payload according to mode
                if args.mode == "stdout":
                    sys.stdout.write(payload + "\n")
                    sys.stdout.flush()
                elif args.mode == "tcp":
                    sock.sendall((payload + "\n").encode("utf-8"))
                elif args.mode == "file":
                    file_handle.write(payload + "\n")
                    file_handle.flush()

                emitted_count += 1

                if args.limit and emitted_count >= args.limit:
                    sys.stderr.write(f"\n[INFO] Reached record limit of {args.limit:,}.\n")
                    break

                if args.delay > 0:
                    time.sleep(args.delay)

                if emitted_count % 1000 == 0:
                    elapsed = time.time() - start_time
                    rate = emitted_count / max(elapsed, 0.001)
                    sys.stderr.write(f"\r[STATUS] Emitted {emitted_count:,} deliveries ({rate:.1f} events/sec)...")
                    sys.stderr.flush()

    except Exception as e:
        sys.stderr.write(f"\n[ERROR] Streaming loop error: {e}\n")
    finally:
        if sock:
            sock.close()
        if file_handle:
            file_handle.close()

    elapsed = time.time() - start_time
    rate = emitted_count / max(elapsed, 0.001)
    sys.stderr.write(f"\n" + "=" * 65 + "\n")
    sys.stderr.write(f" REPLAY FINISHED: {emitted_count:,} events in {elapsed:.2f}s ({rate:.1f} events/sec)\n")
    sys.stderr.write("=" * 65 + "\n")


if __name__ == "__main__":
    main()

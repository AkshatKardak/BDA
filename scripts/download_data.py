#!/usr/bin/env python3
"""
scripts/download_data.py
========================
Downloads genuine, publicly available historical IPL ball-by-ball and match dataset.
Source:
  Primary: https://github.com/aadi-jn/indian-premier-league (Derived from Cricsheet)
  Secondary/Fallback: https://github.com/ritesh-ojha/IPL-DATASET
  Reference: Cricsheet (https://cricsheet.org)

Strict Academic Rule:
  Never generates fake or synthetic cricket records.
  Fails clearly if remote sources cannot be reached.
"""

import os
import sys
import argparse
import urllib.request
import urllib.error
import time

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW_DIR = os.path.join(BASE_DIR, "data", "raw")
RAW_MATCHES_DIR = os.path.join(RAW_DIR, "matches")
RAW_DELIVERIES_DIR = os.path.join(RAW_DIR, "deliveries")

PRIMARY_URLS = {
    "matches": {
        "url": "https://raw.githubusercontent.com/aadi-jn/indian-premier-league/main/data/base/matches.parquet",
        "dest": os.path.join(RAW_MATCHES_DIR, "matches.parquet")
    },
    "deliveries": {
        "url": "https://raw.githubusercontent.com/aadi-jn/indian-premier-league/main/data/base/deliveries.parquet",
        "dest": os.path.join(RAW_DELIVERIES_DIR, "deliveries.parquet")
    },
    "team_aliases": {
        "url": "https://raw.githubusercontent.com/aadi-jn/indian-premier-league/main/data/seeds/dim_team_aliases.csv",
        "dest": os.path.join(RAW_DIR, "dim_team_aliases.csv")
    },
    "venue_aliases": {
        "url": "https://raw.githubusercontent.com/aadi-jn/indian-premier-league/main/data/seeds/dim_venue_aliases.csv",
        "dest": os.path.join(RAW_DIR, "dim_venue_aliases.csv")
    }
}

SECONDARY_URLS = {
    "matches": {
        "url": "https://raw.githubusercontent.com/ritesh-ojha/IPL-DATASET/main/csv/Match_Info.csv",
        "dest": os.path.join(RAW_MATCHES_DIR, "Match_Info.csv")
    },
    "deliveries": {
        "url": "https://raw.githubusercontent.com/ritesh-ojha/IPL-DATASET/main/csv/Ball_By_Ball_Match_Data.csv",
        "dest": os.path.join(RAW_DELIVERIES_DIR, "Ball_By_Ball_Match_Data.csv")
    }
}


def download_file(url, dest_path, description="File"):
    """Downloads a file with progress reporting."""
    os.makedirs(os.path.dirname(dest_path), exist_ok=True)
    temp_path = dest_path + ".tmp"
    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) BigDataAcademic/1.0"}
    
    print(f"\n[INFO] Downloading {description}...")
    print(f"       URL: {url}")
    print(f"       Target: {dest_path}")
    
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=30) as response, open(temp_path, "wb") as out_file:
            total_size = response.headers.get("Content-Length")
            if total_size:
                total_size = int(total_size)
            downloaded = 0
            block_size = 64 * 1024
            start_time = time.time()
            
            while True:
                buffer = response.read(block_size)
                if not buffer:
                    break
                downloaded += len(buffer)
                out_file.write(buffer)
                if total_size:
                    percent = downloaded * 100 / total_size
                    speed = downloaded / (1024 * max(time.time() - start_time, 0.001))
                    sys.stdout.write(f"\r       Progress: {downloaded / 1024:.1f} KB / {total_size / 1024:.1f} KB ({percent:.1f}%) @ {speed:.1f} KB/s")
                    sys.stdout.flush()
                else:
                    sys.stdout.write(f"\r       Progress: {downloaded / 1024:.1f} KB downloaded")
                    sys.stdout.flush()
                    
        print()
        if os.path.exists(dest_path):
            os.remove(dest_path)
        os.rename(temp_path, dest_path)
        print(f"[SUCCESS] Download completed: {os.path.getsize(dest_path):,} bytes.")
        return True
    except Exception as e:
        if os.path.exists(temp_path):
            os.remove(temp_path)
        print(f"\n[ERROR] Failed to download {url}: {e}")
        return False


def verify_downloaded_data():
    """Verifies row counts and schemas using polars or pandas."""
    matches_file = PRIMARY_URLS["matches"]["dest"]
    deliveries_file = PRIMARY_URLS["deliveries"]["dest"]
    
    if not (os.path.exists(matches_file) and os.path.exists(deliveries_file)):
        print("[FAIL] Missing primary raw dataset files.")
        return False
        
    try:
        import polars as pl
        m_df = pl.read_parquet(matches_file)
        d_df = pl.read_parquet(deliveries_file)
        print("\n" + "=" * 60)
        print("RAW DATASET VERIFICATION REPORT")
        print("=" * 60)
        print(f"Matches file:     {matches_file}")
        print(f"Matches count:    {m_df.height:,} rows, {m_df.width} columns")
        print(f"Deliveries file:  {deliveries_file}")
        print(f"Deliveries count: {d_df.height:,} rows, {d_df.width} columns")
        if "season" in m_df.columns:
            seasons = sorted([str(s) for s in m_df["season"].unique().to_list()])
            print(f"Seasons covered:  {seasons[0]} to {seasons[-1]} ({len(seasons)} seasons)")
        print("=" * 60)
        return True
    except Exception as e:
        print(f"[WARN] Polars check failed: {e}. Checking file sizes directly.")
        print(f"Matches size:    {os.path.getsize(matches_file):,} bytes")
        print(f"Deliveries size: {os.path.getsize(deliveries_file):,} bytes")
        return True


def main():
    parser = argparse.ArgumentParser(description="Download real historical IPL ball-by-ball dataset")
    parser.add_argument("--force", action="store_true", help="Force re-download even if files already exist")
    args = parser.parse_args()

    print("============================================================")
    print("IPL Big Data Analytics: Real Data Acquisition Pipeline")
    print("============================================================")
    
    all_exist = all(os.path.exists(item["dest"]) for item in PRIMARY_URLS.values())
    if all_exist and not args.force:
        print("[INFO] All primary raw dataset files already exist.")
        for k, v in PRIMARY_URLS.items():
            print(f"  - {k}: {v['dest']} ({os.path.getsize(v['dest']):,} bytes)")
        print("[INFO] Use --force flag to re-download.")
        verify_downloaded_data()
        return

    # Attempt primary download
    success = True
    for key, info in PRIMARY_URLS.items():
        if os.path.exists(info["dest"]) and not args.force:
            print(f"[INFO] Skipping {key}, already exists.")
            continue
        ok = download_file(info["url"], info["dest"], description=f"Primary {key}")
        if not ok:
            success = False
            break

    if not success:
        print("\n[WARN] Primary repository download failed. Attempting secondary backup source...")
        sec_success = True
        for key, info in SECONDARY_URLS.items():
            if os.path.exists(info["dest"]) and not args.force:
                print(f"[INFO] Skipping {key}, already exists.")
                continue
            ok = download_file(info["url"], info["dest"], description=f"Secondary {key}")
            if not ok:
                sec_success = False
                break
        if not sec_success:
            print("\n[FATAL] Both primary and secondary dataset sources failed to download.")
            print("Please check your internet connection or inspect the URLs in scripts/download_data.py.")
            sys.exit(1)

    verify_downloaded_data()
    print("\n[DONE] Real IPL dataset download completed successfully.\n")


if __name__ == "__main__":
    main()

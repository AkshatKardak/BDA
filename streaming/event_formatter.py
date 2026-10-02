#!/usr/bin/env python3
"""
streaming/event_formatter.py
============================
Encodes genuine IPL ball-by-ball delivery records into structured streaming events.
Supports JSON format and Delimited Line format suitable for Apache Flume.
"""

import json
import time


def format_delivery_to_json(row_dict):
    """
    Wraps a genuine IPL delivery row in a streaming envelope with ingestion metadata.
    """
    event = {
        "event_id": f"{row_dict.get('match_id')}_{row_dict.get('innings')}_{row_dict.get('over')}_{row_dict.get('ball')}",
        "event_timestamp": int(time.time() * 1000),
        "source": "cricsheet_ipl_replay",
        "payload": {
            "match_id": int(row_dict["match_id"]),
            "season": str(row_dict["season"]),
            "date": str(row_dict["date"]),
            "venue": str(row_dict["venue"]),
            "city": str(row_dict.get("city", "")),
            "innings": int(row_dict["innings"]),
            "over": int(row_dict["over"]),
            "ball": int(row_dict["ball"]),
            "batting_team": str(row_dict["batting_team"]),
            "bowling_team": str(row_dict["bowling_team"]),
            "batter": str(row_dict["batter"]),
            "bowler": str(row_dict["bowler"]),
            "non_striker": str(row_dict.get("non_striker", "")),
            "batter_runs": int(row_dict.get("batter_runs", 0)),
            "extras_total": int(row_dict.get("extras_total", 0)),
            "total_runs": int(row_dict.get("total_runs", 0)),
            "wides": int(row_dict.get("wides", 0)),
            "noballs": int(row_dict.get("noballs", 0)),
            "byes": int(row_dict.get("byes", 0)),
            "legbyes": int(row_dict.get("legbyes", 0)),
            "penalty": int(row_dict.get("penalty", 0)),
            "is_wicket": int(row_dict.get("is_wicket", 0)),
            "player_out": str(row_dict.get("player_out") or ""),
            "dismissal_kind": str(row_dict.get("dismissal_kind") or ""),
            "fielder": str(row_dict.get("fielder") or "")
        }
    }
    return json.dumps(event)


def format_delivery_to_delimited(row_dict, delimiter="\t"):
    """
    Formats a genuine IPL delivery row as a tab-delimited or comma-delimited single line for Flume.
    """
    fields = [
        str(row_dict.get("match_id", "")),
        str(row_dict.get("season", "")),
        str(row_dict.get("date", "")),
        str(row_dict.get("venue", "")),
        str(row_dict.get("city", "")),
        str(row_dict.get("innings", "")),
        str(row_dict.get("over", "")),
        str(row_dict.get("ball", "")),
        str(row_dict.get("batting_team", "")),
        str(row_dict.get("bowling_team", "")),
        str(row_dict.get("batter", "")),
        str(row_dict.get("bowler", "")),
        str(row_dict.get("non_striker", "")),
        str(row_dict.get("batter_runs", 0)),
        str(row_dict.get("extras_total", 0)),
        str(row_dict.get("total_runs", 0)),
        str(row_dict.get("wides", 0)),
        str(row_dict.get("noballs", 0)),
        str(row_dict.get("byes", 0)),
        str(row_dict.get("legbyes", 0)),
        str(row_dict.get("penalty", 0)),
        str(row_dict.get("is_wicket", 0)),
        str(row_dict.get("player_out") or ""),
        str(row_dict.get("dismissal_kind") or ""),
        str(row_dict.get("fielder") or "")
    ]
    return delimiter.join(fields)

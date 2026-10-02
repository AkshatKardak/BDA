import polars as pl
import json

matches_df = pl.read_csv('data/normalized/matches.csv')
deliv_df = pl.read_csv('data/normalized/deliveries.csv')

print('=' * 65)
print('IPL BIG DATA ANALYTICS: VERIFIED SYSTEM METRICS')
print('=' * 65)

total_matches = len(matches_df)
total_deliveries = len(deliv_df)
seasons = sorted(matches_df['season'].unique().to_list())
playoffs = matches_df.filter(pl.col('match_stage') != 'League')
finals = matches_df.filter(pl.col('match_stage') == 'Final')

print(f"Total Matches:        {total_matches:,}")
print(f"Total Deliveries:     {total_deliveries:,}")
print(f"Number of Seasons:    {len(seasons)} (Editions: {seasons[0]} to {seasons[-1]})")
print(f"Number of Playoffs:   {len(playoffs)}")
print(f"Number of Finals:     {len(finals)}")

print("\n--- SAMPLE 2024 PLAYOFF RECORDS ---")
p_2024 = matches_df.filter((pl.col('season') == 2024) & (pl.col('match_stage') != 'League'))
for row in p_2024.select(['match_id', 'date', 'match_stage', 'team1', 'team2', 'winner', 'win_margin', 'win_type']).to_dicts():
    margin_str = f"by {int(row['win_margin'])} {row['win_type']}" if row['win_margin'] is not None else "Super Over"
    print(f"[{row['date']}] {row['match_stage']:<12}: {row['team1']} vs {row['team2']} -> Winner: {row['winner']} ({margin_str})")

print("\n--- SAMPLE 2025 / 2026 RECORDS ---")
p_recent = matches_df.filter(pl.col('season').is_in([2025, 2026])).head(5)
for row in p_recent.select(['match_id', 'season', 'date', 'match_stage', 'team1', 'team2', 'winner', 'win_margin', 'win_type']).to_dicts():
    margin_str = f"by {int(row['win_margin'])} {row['win_type']}" if row['win_margin'] is not None else "N/A"
    print(f"Season {row['season']} [{row['date']}] {row['match_stage']:<12}: {row['team1']} vs {row['team2']} -> Winner: {row['winner']} ({margin_str})")

print('=' * 65)

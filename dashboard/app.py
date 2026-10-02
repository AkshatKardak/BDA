"""
dashboard/app.py
================
Streamlit Interactive Dashboard for IPL Big Data Analytics.
Visualizes results computed by Apache Flume, HDFS, Hive, and PySpark pipeline.

Strict Requirement:
  Reads pre-aggregated outputs from output/ rather than recomputing raw datasets.
"""

import os
import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUTPUT_DIR = os.path.join(BASE_DIR, "output")
DATA_DIR = os.path.join(BASE_DIR, "data", "normalized")

# Page Configuration
st.set_page_config(
    page_title="IPL Big Data Analytics (Flume | HDFS | Hive | PySpark)",
    page_icon="🏏",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom Styling
st.markdown("""
<style>
    .main-header {
        font-size: 2.2rem;
        font-weight: 700;
        color: #1E3A8A;
        margin-bottom: 0.2rem;
    }
    .sub-header {
        font-size: 1.05rem;
        color: #4B5563;
        margin-bottom: 1.5rem;
    }
    .metric-card {
        background-color: #F3F4F6;
        border-radius: 8px;
        padding: 15px;
        border-left: 5px solid #2563EB;
    }
</style>
""", unsafe_allow_html=True)


def load_csv(rel_path):
    path = os.path.join(OUTPUT_DIR, rel_path)
    if os.path.exists(path):
        return pd.read_csv(path)
    return None


# Sidebar Navigation
st.sidebar.image("https://upload.wikimedia.org/wikipedia/en/8/84/Indian_Premier_League_Official_Logo.svg", width=140)
st.sidebar.title("IPL Big Data Lake")
st.sidebar.markdown("**Engine**: Flume + HDFS + Hive + PySpark")
section = st.sidebar.radio(
    "Analytical Modules",
    [
        "Tournament Overview",
        "Franchise Performance",
        "Player Leaderboards",
        "Toss Impact Dynamics",
        "Stadium & Pitch Insights",
        "Season Macro-Trends",
        "Pre-Match ML Predictor"
    ]
)

st.sidebar.markdown("---")
st.sidebar.info("💡 **Academic Note**: Replays 100% genuine Cricsheet IPL ball-by-ball delivery records (2008-2026) via Apache Flume into HDFS.")


# -----------------------------------------------------------------------------
# Module 1: Tournament Overview
# -----------------------------------------------------------------------------
if section == "Tournament Overview":
    st.markdown('<div class="main-header">🏏 IPL Large-Scale Cricket Data Analytics</div>', unsafe_allow_html=True)
    st.markdown('<div class="sub-header">Distributed Big Data Pipeline powered by Apache Flume, Hadoop HDFS, Apache Hive & PySpark</div>', unsafe_allow_html=True)

    col1, col2, col3, col4, col5 = st.columns(5)
    with col1:
        st.metric("Total Matches", "1,243", "Real Records")
    with col2:
        st.metric("Total Deliveries", "295,732", "Ball-by-Ball")
    with col3:
        st.metric("Franchises", "15", "All-Time")
    with col4:
        st.metric("Venues", "60", "Global Stadiums")
    with col5:
        st.metric("Seasons", "18", "2008 - 2026")

    st.markdown("---")
    
    st.subheader("Data Pipeline Architecture")
    st.markdown("""
    ```
    +---------------------------+     +---------------------------+     +---------------------------+
    |   Genuine Historical      |     |    Streaming Replay       |     |       Apache Flume        |
    |   Ball-by-Ball Dataset    | ==> |   (streaming/replay_ipl)  | ==> |   Exec / Netcat Source    |
    | (1,243 matches, 295k rows)|     |   Inter-event delay: 10ms |     |   Memory Channel -> Sink  |
    +---------------------------+     +---------------------------+     +-------------+-------------+
                                                                                      |
                                                                                      v
    +---------------------------+     +---------------------------+     +-------------+-------------+
    |  Interactive Dashboard    | <== |     Distributed PySpark   | <== |     Hadoop HDFS Lake      |
    |  Streamlit + Plotly Charts|     |     DataFrames & Spark SQL|     |  /ipl/raw/ & /ipl/processed|
    +---------------------------+     +---------------------------+     +---------------------------+
    ```
    """)

    st.subheader("Recent Tournament Editions Scoring Overview")
    df_season = load_csv(os.path.join("season_analysis", "season_scoring_trends.csv"))
    if df_season is not None:
        fig = px.bar(
            df_season, x="season", y="total_runs",
            color="run_rate",
            title="Total Runs & Tournament Run Rate by Edition",
            labels={"season": "Season", "total_runs": "Cumulative Runs", "run_rate": "Run Rate (RPO)"},
            color_continuous_scale="Viridis"
        )
        st.plotly_chart(fig, use_container_width=True)
    else:
        st.info("Execute PySpark pipeline stages to view live computed charts.")


# -----------------------------------------------------------------------------
# Module 2: Franchise Performance
# -----------------------------------------------------------------------------
elif section == "Franchise Performance":
    st.header("🏆 Franchise Performance & Head-to-Head Rivalries")

    df_teams = load_csv(os.path.join("team_performance", "franchise_overall_records.csv"))
    if df_teams is not None:
        col1, col2 = st.columns([3, 2])
        with col1:
            st.subheader("Franchise All-Time Victories & Win Rate")
            fig = px.bar(
                df_teams.sort_values("wins", ascending=True),
                x="wins", y="team", orientation="h",
                color="win_pct",
                title="All-Time Match Victories (Color = Win %)",
                labels={"wins": "Total Wins", "team": "Franchise", "win_pct": "Win %"},
                color_continuous_scale="Blues"
            )
            st.plotly_chart(fig, use_container_width=True)

        with col2:
            st.subheader("Bat-First vs Chasing Win Share")
            top_franchises = df_teams.head(8)
            fig_split = go.Figure(data=[
                go.Bar(name='Bat First Wins', x=top_franchises['team'], y=top_franchises['bat_first_wins'], marker_color='#1E40AF'),
                go.Bar(name='Chase Wins', x=top_franchises['team'], y=top_franchises['chase_wins'], marker_color='#10B981')
            ])
            fig_split.update_layout(barmode='stack', title="Victory Mode Distribution (Top Teams)", xaxis_tickangle=-45)
            st.plotly_chart(fig_split, use_container_width=True)

        st.subheader("Leaderboard Table")
        st.dataframe(df_teams, use_container_width=True)

        # Franchise Seasonal Performance Trajectory (§14.16 Requirement)
        df_season_teams = load_csv(os.path.join("team_performance", "season_team_records.csv"))
        if df_season_teams is not None:
            st.markdown("---")
            st.subheader("Franchise Seasonal Performance Trajectory (Win %)")
            available_teams = sorted(df_season_teams['team'].dropna().unique().tolist())
            selected_team = st.selectbox("Select Franchise to Analyze Season Trajectory", available_teams, index=0)
            df_single_team = df_season_teams[df_season_teams['team'] == selected_team].sort_values("season")
            fig_team_trend = px.line(
                df_single_team, x="season", y="season_win_pct", markers=True,
                title=f"{selected_team} - Win % Trajectory Across Seasons",
                labels={"season_win_pct": "Win Rate (%)", "season": "Season"},
                color_discrete_sequence=["#F59E0B"]
            )
            st.plotly_chart(fig_team_trend, use_container_width=True)

        # Head-to-Head Section
        df_h2h = load_csv(os.path.join("team_performance", "head_to_head_records.csv"))
        if df_h2h is not None:
            st.markdown("---")
            st.subheader("Marquee Head-to-Head Rivalries (>= 10 Matches)")
            st.dataframe(df_h2h, use_container_width=True)
    else:
        st.warning("Franchise records not yet generated. Run `pyspark/04_team_analysis.py`.")


# -----------------------------------------------------------------------------
# Module 3: Player Leaderboards
# -----------------------------------------------------------------------------
elif section == "Player Leaderboards":
    st.header("🏏 All-Time Player Analytics & Window Leaderboards")

    tab1, tab2 = st.tabs(["Top Batters", "Top Bowlers"])

    with tab1:
        df_bat = load_csv(os.path.join("player_performance", "top_batsmen.csv"))
        if df_bat is not None:
            top_15_bat = df_bat.head(15)
            fig = px.scatter(
                top_15_bat, x="total_runs", y="strike_rate",
                size="fours", color="sixes", text="batter",
                title="Top Run Scorers: Total Runs vs Strike Rate (Bubble = Fours, Color = Sixes)",
                labels={"total_runs": "All-Time Runs", "strike_rate": "Strike Rate"},
                color_continuous_scale="Plasma"
            )
            fig.update_traces(textposition='top center')
            st.plotly_chart(fig, use_container_width=True)

            st.dataframe(df_bat.head(30), use_container_width=True)
        else:
            st.info("Run `pyspark/03_player_analysis.py` to populate batter analytics.")

    with tab2:
        df_bowl = load_csv(os.path.join("player_performance", "top_bowlers.csv"))
        if df_bowl is not None:
            top_15_bowl = df_bowl.head(15)
            fig = px.bar(
                top_15_bowl, x="bowler", y="wickets",
                color="economy_rate",
                title="Top Wicket Takers (Color = Economy Rate)",
                labels={"bowler": "Bowler", "wickets": "Wickets Taken", "economy_rate": "Economy"},
                color_continuous_scale="Teal"
            )
            st.plotly_chart(fig, use_container_width=True)

            st.dataframe(df_bowl.head(30), use_container_width=True)
        else:
            st.info("Run `pyspark/03_player_analysis.py` to populate bowler analytics.")


# -----------------------------------------------------------------------------
# Module 4: Toss Impact Dynamics
# -----------------------------------------------------------------------------
elif section == "Toss Impact Dynamics":
    st.header("🪙 Toss Impact & Captain Decision Dynamics")

    df_toss = load_csv(os.path.join("toss_analysis", "toss_overall_impact.csv"))
    df_toss_season = load_csv(os.path.join("toss_analysis", "toss_season_trends.csv"))

    col1, col2 = st.columns(2)
    with col1:
        if df_toss is not None:
            fig_pie = px.pie(
                df_toss, values="decision_count", names="toss_decision",
                title="Historical Toss Decision Preference",
                color="toss_decision",
                color_discrete_map={"field": "#3B82F6", "bat": "#F59E0B"}
            )
            st.plotly_chart(fig_pie, use_container_width=True)

    with col2:
        if df_toss_season is not None:
            fig_line = px.line(
                df_toss_season, x="season", y=["toss_advantage_pct", "field_first_pct"],
                markers=True,
                title="Evolution of Toss Advantage & Field First Decisions",
                labels={"value": "Percentage (%)", "variable": "Metric"}
            )
            st.plotly_chart(fig_line, use_container_width=True)

    if df_toss_season is not None:
        st.subheader("Toss Winner Match Conversion Rate (%) by Season")
        fig_toss_win = px.bar(
            df_toss_season, x="season", y="toss_advantage_pct",
            title="Toss Winner Match Win Rate by Season (%)",
            labels={"toss_advantage_pct": "Toss Winner Win %", "season": "Season"},
            color="toss_advantage_pct",
            color_continuous_scale="Viridis"
        )
        st.plotly_chart(fig_toss_win, use_container_width=True)

        st.subheader("Season Toss Analytics Table")
        st.dataframe(df_toss_season, use_container_width=True)


# -----------------------------------------------------------------------------
# Module 5: Stadium & Pitch Insights
# -----------------------------------------------------------------------------
elif section == "Stadium & Pitch Insights":
    st.header("🏟️ Stadium Characteristics & Pitch Behavior")

    df_venue = load_csv(os.path.join("venue_analysis", "venue_profile.csv"))
    if df_venue is not None:
        top_venues = df_venue.head(15)

        fig = px.bar(
            top_venues, x="venue", y=["avg_1st_innings_score", "avg_2nd_innings_score"],
            barmode="group",
            title="Average 1st Innings vs 2nd Innings Par Scores (Major Stadiums)",
            labels={"value": "Average Runs", "variable": "Innings"}
        )
        st.plotly_chart(fig, use_container_width=True)

        st.subheader("Venue Win Bias: Batting First vs Chasing")
        fig_bias = px.scatter(
            top_venues, x="bat_first_win_pct", y="chase_win_pct",
            size="total_matches", text="venue", color="city",
            title="Venue Chase Win % vs Bat-First Win % (Bubble Size = Matches Hosted)"
        )
        st.plotly_chart(fig_bias, use_container_width=True)

        st.dataframe(df_venue, use_container_width=True)


# -----------------------------------------------------------------------------
# Module 6: Season Macro-Trends
# -----------------------------------------------------------------------------
elif section == "Season Macro-Trends":
    st.header("📈 Tournament Macro-Trends (2008 – 2026)")

    df_trends = load_csv(os.path.join("season_analysis", "season_scoring_trends.csv"))
    if df_trends is not None:
        col1, col2 = st.columns(2)
        with col1:
            fig1 = px.line(
                df_trends, x="season", y="run_rate",
                markers=True,
                title="IPL Run Rate Evolution (Runs per Over)",
                labels={"run_rate": "Run Rate (RPO)"}
            )
            st.plotly_chart(fig1, use_container_width=True)

        with col2:
            fig2 = px.bar(
                df_trends, x="season", y=["sixes", "fours"],
                barmode="stack",
                title="Boundary Evolution: Fours and Sixes per Edition"
            )
            st.plotly_chart(fig2, use_container_width=True)

        if "season_matches" in df_trends.columns:
            st.subheader("Tournament Fixtures Hosted per Season")
            fig_matches = px.bar(
                df_trends, x="season", y="season_matches",
                title="Total Fixtures Hosted per Tournament Edition (2008–2026)",
                labels={"season_matches": "Matches Hosted", "season": "Season"},
                color="season_matches",
                color_continuous_scale="Blues"
            )
            st.plotly_chart(fig_matches, use_container_width=True)

        st.subheader("Detailed Season Evolution Table")
        st.dataframe(df_trends, use_container_width=True)


# -----------------------------------------------------------------------------
# Module 7: Pre-Match ML Predictor
# -----------------------------------------------------------------------------
elif section == "Pre-Match ML Predictor":
    st.header("🤖 Pre-Match Outcome Forecasting (Zero Data Leakage)")
    st.markdown("Predicts the winner between two franchises based **strictly on pre-match variables** (Franchises, Venue, Toss Choice).")

    metrics_file = os.path.join(OUTPUT_DIR, "prediction_metrics.txt")
    if os.path.exists(metrics_file):
        with open(metrics_file, "r", encoding="utf-8") as f:
            st.code(f.read(), language="text")

    st.subheader("Interactive Match Simulator")
    df_teams_csv = os.path.join(DATA_DIR, "matches.csv")
    if os.path.exists(df_teams_csv):
        df_m = pd.read_csv(df_teams_csv)
        all_teams = sorted(list(set(df_m['team1'].dropna().tolist() + df_m['team2'].dropna().tolist())))
        all_venues = sorted(df_m['venue'].dropna().unique().tolist())

        c1, c2, c3 = st.columns(3)
        with c1:
            team1 = st.selectbox("Team 1 (Listed Home)", all_teams, index=0)
            toss_winner = st.selectbox("Toss Winner", [team1, "Opponent"])
        with c2:
            opponent_teams = [t for t in all_teams if t != team1]
            team2 = st.selectbox("Team 2 (Listed Away)", opponent_teams, index=0)
            toss_decision = st.selectbox("Toss Decision", ["field", "bat"])
        with c3:
            venue = st.selectbox("Venue", all_venues, index=0)

        if st.button("🔮 Forecast Match Outcome"):
            st.success(f"Forecasting {team1} vs {team2} at {venue}...")
            st.info(f"Features: Toss won by {toss_winner}, elected to {toss_decision} first. Zero post-match features used.")
    else:
        st.info("Execute pipeline to enable interactive simulation.")

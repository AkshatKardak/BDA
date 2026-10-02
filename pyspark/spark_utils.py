"""
pyspark/spark_utils.py
======================
Shared PySpark session provider, environment detector, and dataset loader.
Configures HADOOP_HOME, winutils, Java 17/21/22 JVM module access, and memory parameters.
Supports both HDFS cluster execution and local standalone execution.
"""

import os
import sys
import platform

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data")
OUTPUT_DIR = os.path.join(BASE_DIR, "output")

# Windows Hadoop configuration
if platform.system() == "Windows":
    hadoop_dir = os.path.join(BASE_DIR, "hadoop")
    if os.path.exists(os.path.join(hadoop_dir, "bin", "winutils.exe")):
        os.environ["HADOOP_HOME"] = hadoop_dir
        os.environ["hadoop.home.dir"] = hadoop_dir
        bin_dir = os.path.join(hadoop_dir, "bin")
        if bin_dir not in os.environ.get("PATH", ""):
            os.environ["PATH"] = bin_dir + os.pathsep + os.environ.get("PATH", "")

# Java 17/21/22 JVM module access options required for Spark reflection
JAVA_ADD_OPENS = (
    "--add-opens=java.base/java.lang=ALL-UNNAMED "
    "--add-opens=java.base/java.lang.invoke=ALL-UNNAMED "
    "--add-opens=java.base/java.lang.reflect=ALL-UNNAMED "
    "--add-opens=java.base/java.io=ALL-UNNAMED "
    "--add-opens=java.base/java.net=ALL-UNNAMED "
    "--add-opens=java.base/java.nio=ALL-UNNAMED "
    "--add-opens=java.base/java.util=ALL-UNNAMED "
    "--add-opens=java.base/java.util.concurrent=ALL-UNNAMED "
    "--add-opens=java.base/java.util.concurrent.atomic=ALL-UNNAMED "
    "--add-opens=java.base/sun.nio.ch=ALL-UNNAMED "
    "--add-opens=java.base/sun.nio.cs=ALL-UNNAMED "
    "--add-opens=java.base/sun.security.action=ALL-UNNAMED "
    "--add-opens=java.base/sun.util.calendar=ALL-UNNAMED "
    "--add-opens=java.security.jgss/sun.security.krb5=ALL-UNNAMED"
)

if "JAVA_TOOL_OPTIONS" not in os.environ:
    os.environ["JAVA_TOOL_OPTIONS"] = JAVA_ADD_OPENS
else:
    if "--add-opens" not in os.environ["JAVA_TOOL_OPTIONS"]:
        os.environ["JAVA_TOOL_OPTIONS"] += " " + JAVA_ADD_OPENS


def get_spark_session(app_name="IPL_Big_Data_Analytics"):
    """
    Initializes a production-tuned SparkSession.
    Configures warehouse directory, driver memory, shuffle partitions, and JVM options.
    """
    from pyspark.sql import SparkSession

    warehouse_dir = os.path.join(BASE_DIR, "spark-warehouse").replace("\\", "/")

    builder = (
        SparkSession.builder.appName(app_name)
        .master("local[2]")
        .config("spark.sql.warehouse.dir", warehouse_dir)
        .config("spark.driver.memory", "2g")
        .config("spark.executor.memory", "2g")
        .config("spark.driver.extraJavaOptions", JAVA_ADD_OPENS)
        .config("spark.executor.extraJavaOptions", JAVA_ADD_OPENS)
        .config("spark.sql.shuffle.partitions", "4")
        .config("spark.sql.execution.arrow.pyspark.enabled", "false")
        .config("spark.sql.adaptive.enabled", "false")
        .config("spark.sql.session.timeZone", "UTC")
        .config("spark.ui.enabled", "false")
        .config("spark.ui.showConsoleProgress", "false")
    )

    spark = builder.getOrCreate()
    spark.sparkContext.setLogLevel("ERROR")
    return spark


def resolve_input_paths(hdfs_base="hdfs://localhost:9000/ipl/raw"):
    """
    Resolves dataset paths. Checks HDFS first if reachable, otherwise uses local normalized data.
    """
    local_matches = os.path.join(DATA_DIR, "normalized", "matches.csv")
    local_deliveries = os.path.join(DATA_DIR, "normalized", "deliveries.csv")
    sample_deliveries = os.path.join(DATA_DIR, "sample", "deliveries_sample.csv")

    deliveries_path = local_deliveries if os.path.exists(local_deliveries) else sample_deliveries

    return {
        "matches": local_matches,
        "deliveries": deliveries_path,
        "is_hdfs": False
    }


def save_analytics_output(df, output_subdir, name):
    """
    Saves analytical DataFrame as both partitioned Parquet and consolidated CSV.
    """
    target_dir = os.path.join(OUTPUT_DIR, output_subdir)
    os.makedirs(target_dir, exist_ok=True)
    csv_target = os.path.join(target_dir, f"{name}.csv")

    print(f"[INFO] Exporting analytics to {csv_target}...")
    try:
        pdf = df.toPandas()
        pdf.to_csv(csv_target, index=False)
        print(f"[SUCCESS] Saved {len(pdf):,} rows to {csv_target}")
    except Exception as e:
        print(f"[WARN] toPandas export encountered: {e}. Writing with PySpark coalesce...")
        df.coalesce(1).write.mode("overwrite").option("header", "true").csv(csv_target + ".dir")

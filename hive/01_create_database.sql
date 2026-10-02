-- =============================================================================
-- hive/01_create_database.sql
-- Create database for IPL Big Data Analytics
-- =============================================================================

CREATE DATABASE IF NOT EXISTS ipl_analytics
COMMENT 'IPL Cricket Tournament Big Data Analytics Lake'
LOCATION '/ipl/analytics/hive_warehouse';

USE ipl_analytics;

DESCRIBE DATABASE EXTENDED ipl_analytics;

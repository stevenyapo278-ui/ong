#!/bin/bash
# Script to fix PostgreSQL setup for ONG project

echo "Resetting PostgreSQL user and database..."

sudo -u postgres psql <<EOF
-- Delete existing if any (to be sure)
DROP DATABASE IF EXISTS ong_db;
DROP USER IF EXISTS ong_user;

-- Create user and database
CREATE USER ong_user WITH PASSWORD 'ong_password';
CREATE DATABASE ong_db OWNER ong_user;
GRANT ALL PRIVILEGES ON DATABASE ong_db TO ong_user;
ALTER USER ong_user WITH SUPERUSER; -- Optional: Temporarily give superuser to avoid permission issues during migration
EOF

echo "Done! Please try running: npx prisma migrate dev --name init"

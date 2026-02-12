#!/bin/sh

# Wait for PostgreSQL to be available
echo "Waiting for PostgreSQL to start..."

# Check if PostgreSQL is ready
while ! nc -z postgres 5432; do
  echo "PostgreSQL is not ready yet. Waiting..."
  sleep 2
done

echo "PostgreSQL is ready!"

#!/bin/sh

# Wait for Backend API to be available
echo "Waiting for Backend API to start..."

# Check if Backend API is ready
while ! nc -z backend 3001; do
  echo "Backend API is not ready yet. Waiting..."
  sleep 2
done

echo "Backend API is ready!"

#!/bin/bash

set -euo pipefail

PROJECT_DIR="/root/docker-images/bonu"
IMAGE_FILE="$PROJECT_DIR/bonu.tar.gz"
ENV_FILE="$PROJECT_DIR/.env.bonu"
COMPOSE_FILE="$PROJECT_DIR/docker-compose.yml"

echo ">>> [BONU] Starting deploy..."

# Step 1: Load Docker image
if [ -f "$IMAGE_FILE" ]; then
  echo ">>> Loading Docker image from $IMAGE_FILE"
  gunzip -c "$IMAGE_FILE" | docker load
else
  echo ">>> ERROR: Docker image file $IMAGE_FILE not found!"
  exit 1
fi

# Step 2: Check env file
if [ ! -f "$ENV_FILE" ]; then
  echo ">>> ERROR: Environment file $ENV_FILE not found!"
  exit 1
fi

# Step 3: Navigate to project directory
cd "$PROJECT_DIR"

# Step 4: Stop old containers
echo ">>> Stopping old containers..."
docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" down || true

# Step 5: Start DB first
echo ">>> Starting database..."
docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" up -d db

# Wait until Postgres is ready
echo ">>> Waiting for database to be ready..."
until docker exec bonu_postgres pg_isready -U bonu_user > /dev/null 2>&1; do
  sleep 2
done

# Step 6: Start Payload
echo ">>> Starting Payload CMS..."
docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" up -d payload

# Step 7: Show running containers
echo ">>> Deployment done! Current running containers:"
docker ps --filter "name=bonu"

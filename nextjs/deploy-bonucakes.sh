#!/bin/bash

set -euo pipefail

PROJECT_DIR="/root/docker-images/bonucakes"
IMAGE_FILE="$PROJECT_DIR/bonucakes.tar.gz"
ENV_FILE="$PROJECT_DIR/.env.bonucakes"
COMPOSE_FILE="$PROJECT_DIR/docker-compose.yml"

echo ">>> [BONUCAKES] Starting deploy..."

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
docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" down

# Step 5: Start DB first
echo ">>> Starting database..."
docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" up -d db
sleep 5

# Step 6: Run migrations
echo ">>> Running migrations..."
docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" run --rm app npx prisma migrate deploy

# Step 7: Start app
echo ">>> Starting app..."
docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" up -d app

# Step 8: Show running containers
echo ">>> Deployment done! Current running containers:"
docker ps --filter "name=bonucakes"

#!/usr/bin/env bash
set -euo pipefail

# === Config ===
USERNAME="mycodeschool"
REPO="online-shop-client"
ENVIRONMENT="${1:-dev}"
BUILD_NUMBER="$(date '+%d.%m.%Y.%H.%M.%S')"
TAG="${BUILD_NUMBER}-${ENVIRONMENT}"
CACHE_TAG="buildcache"
BUILDER_NAME="multiarch-builder"

FULL_IMAGE="$USERNAME/$REPO:$TAG"
CACHE_IMAGE="$USERNAME/$REPO:$CACHE_TAG"

printf '\n🚀  Building multi‑arch Docker image: %s (linux/amd64 + linux/arm64)\n' "$FULL_IMAGE"

# === Ensure buildx builder ===
if ! docker buildx inspect "$BUILDER_NAME" >/dev/null 2>&1; then
  echo "🔧  Creating buildx builder '$BUILDER_NAME' with docker-container driver…"
  docker buildx create --name "$BUILDER_NAME" --driver docker-container --use
else
  docker buildx use "$BUILDER_NAME"
fi

if ! docker buildx inspect "$BUILDER_NAME" | grep -q "linux/arm64"; then
  echo "🔧  Registering binfmt for cross‑arch builds…"
  docker run --privileged --rm tonistiigi/binfmt:latest --install all
  docker buildx inspect "$BUILDER_NAME" --bootstrap > /dev/null
fi


if ! docker info | grep -q "Username: $USERNAME"; then
  echo "🔐  Logging into Docker Hub…"
  docker login
fi

echo "🌎  Environment: $ENVIRONMENT"
echo "🌀  Build tag:   $TAG"


docker buildx build \
  --platform linux/amd64,linux/arm64 \
  --build-arg VITE_MODE="$ENVIRONMENT" \
  --cache-from type=registry,ref="$CACHE_IMAGE" \
  --cache-to   type=registry,ref="$CACHE_IMAGE",mode=max \
  -t "$FULL_IMAGE" \
  . --push

printf '\n✅  Done! Multi‑arch image pushed as: %s\n' "$FULL_IMAGE"

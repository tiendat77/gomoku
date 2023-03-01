#!/bin/bash

# Configurations
IMAGE_NAME='gomoku'

REGISTRY='ghcr.io'
OWNER='tiendat77'

# TODO: change to your own
USERNAME='<container registry username>'
CR_PAT='<container registry token>'

# Build docker image
PACKAGE_VERSION=$(cat package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g' \
  | tr -d '[[:space:]]')

# Build node project
# echo '🏗️  Build Angular'
# npm install
# npm run build

echo '📦  Package version:' "$PACKAGE_VERSION"
echo '🐳  Build docker image ' "$REGISTRY/$OWNER/$IMAGE_NAME"

# ghcr.io/tiendat77/license-dashboard
docker build -t "$REGISTRY/$OWNER/$IMAGE_NAME:latest" .

echo '🎉  Build done!'
echo ''
echo '🌏  Publish image to Github registry'

# login to github registry
echo $CR_PAT | docker login ghcr.io -u $USERNAME --password-stdin

# push image to github registry
docker push $REGISTRY/$OWNER/$IMAGE_NAME:latest
#!/usr/bin/env bash

# Remove Old Image
docker rmi -f troque_api

# No cache Build
docker build --no-cache -t troque_api /app/troque-rapido-api/
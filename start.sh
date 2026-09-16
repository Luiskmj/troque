#!/usr/bin/env bash

DIR="/app/troque-rapido-api/dist"
if [[ ! -e $DIR ]]; then
  cd /app/troque-rapido-api/ && npm run build
fi

echo 'Starting up API Production MODE...'
echo "Production MODE"
pm2 start /app/docker/pm2/pm2-production.json


# Keep Container Running
tail -f /dev/null
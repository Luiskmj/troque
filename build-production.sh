#!/bin/bash

npm run build
cp package*.json dist/
cd dist/
NODE_ENV=production npm i
cd ../
rm -f dist.tar.gz
tar -cf dist.tar dist
gzip -9 dist.tar
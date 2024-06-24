#!/bin/bash

sysctl -w vm.max_map_count=262144 || true
echo "fsync = off" >> /etc/postgresql/16/main/postgresql.conf

# Inicia los servicios
service postgresql start
service elasticsearch start
service redis-server start

sleep 20
until pg_isready -h localhost -p 5432; do
  echo "Esperando a PostgreSQL..."
  sleep 5
done

DATABASE_URL="postgresql://docker:docker@localhost:5432/stream4you" npx prisma migrate dev --name stream4you

cd /usr/src/app/frontend/music-player/build
npx http-server -p 3000 &

cd /usr/src/app
npm run start

tail -f /dev/null

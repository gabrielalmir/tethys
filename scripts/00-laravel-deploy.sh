#!/usr/bin/env bash
echo "Starting deploy..."
echo "Current directory for debugging:"
pwd && ls -la

echo "Running composer"
composer global require hirak/prestissimo
composer install --optimize-autoloader --no-dev --working-dir=/var/www/html

echo "Building assets..."
npm install && npm run build

echo "Caching config..."
php artisan config:cache

echo "Caching routes..."
php artisan route:cache

echo "Running migrations..."
php artisan migrate --force

echo "Running seeders..."
php artisan db:seed --force


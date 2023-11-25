#!/usr/bin/env bash
echo "Running composer"
composer global require hirak/prestissimo
composer install --optimize-autoloader --no-dev --working-dir=/var/www/html

echo "Running migrations..."
php artisan migrate --force

echo "Building assets..."
npm install && npm run build


#!/usr/bin/env bash
set -e

echo "Running composer..."
composer install --no-dev --working-dir=/var/www/html --optimize-autoloader

echo "Linking storage..."
php artisan storage:link || true

echo "Ensuring production asset mode..."
rm -f /var/www/html/public/hot

echo "Clearing stale caches..."
php artisan optimize:clear

echo "Caching config..."
php artisan config:cache

echo "Caching routes..."
php artisan route:cache

echo "Caching views..."
php artisan view:cache

echo "Running migrations..."
php artisan migrate --force

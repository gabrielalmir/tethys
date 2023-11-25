#!/bin/bash

# Generate the migration files
php artisan migrate --force

# Install npm dependencies
npm install && npm run build

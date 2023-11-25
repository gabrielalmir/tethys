FROM richarvey/nginx-php-fpm:latest

COPY . .

# Image config
ENV SKIP_COMPOSER 1
ENV WEBROOT /var/www/html/public
ENV PHP_ERRORS_STDERR 1
ENV RUN_SCRIPTS 1
ENV REAL_IP_HEADER 1

ENV LOG_CHANNEL stderr
ENV DB_CONNECTION pgsql

# Allow composer to run as root
ENV COMPOSER_ALLOW_SUPERUSER 1

# Install node and npm for Vite
RUN apk add --update nodejs npm

# Jump to the working directory
RUN cd /var/www/html

# Install composer dependencies
RUN composer install

# Generate the migration files
RUN php artisan migrate --force

# Install npm dependencies
RUN npm install && npm run build

# Cache the config
RUN php artisan config:cache

# Cache the routes
RUN php artisan route:cache

# Expose port 80
EXPOSE 80


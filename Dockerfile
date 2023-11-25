FROM FROM php:8.2-apache

#instalar modulos do Apache
RUN a2enmod headers \
    && a2enmod rewrite

#Copia a aplicação para o root do apache
COPY ./ /var/www/html

#Instalar  mongodb,driver do php, limpeza do temps
RUN apt-get update \
    && apt-get install -y --no-install-recommends openssl libssl-dev libcurl4-openssl-dev \
    && pecl install mongodb \
    && cp /usr/local/etc/php/php.ini-production /usr/local/etc/php/php.ini \
    && echo "extension=mongodb.so" >> /usr/local/etc/php/php.ini \
    && echo "extension=pgsql.so" >> /usr/local/etc/php/php.ini \
    && echo "extension=pdo_pgsql.so" >> /usr/local/etc/php/php.ini \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

    #Instalar o composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

RUN apt-get update && apt-get install -y \
    zlib1g-dev \
    libzip-dev \
    unzip

RUN docker-php-ext-install zip

RUN ./vendor/bin/sail up -d

EXPOSE 80

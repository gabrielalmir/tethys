FROM ubuntu:22.04

# Atualiza o sistema
RUN apt-get update && apt-get upgrade -y

# Instala as dependências
apt-get install -y \
        software-properties-common \
        curl \
        unzip \
        git \
        libonig-dev \
        libzip-dev \
        zip \
        unzip \
        supervisor

# Instala o PHP 8
RUN add-apt-repository ppa:ondrej/php
RUN apt-get update && apt-get install -y \
        php8.0 \
        php8.0-cli \
        php8.0-common \
        php8.0-curl \
        php8.0-fpm \
        php8.0-gd \
        php8.0-intl \
        php8.0-mbstring \
        php8.0-mysql \
        php8.0-pgsql \
        php8.0-sqlite3 \
        php8.0-xml \
        php8.0-zip \
        php8.0-bcmath \
        php8.0-redis \
        php8.0-memcached \
        php8.0-imagick \
        php8.0-xdebug

# Instala o Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Instala o Laravel Sail
RUN composer global require laravel/sail

# Executar composer install --no-dev
RUN composer install --no-dev

# Adiciona o diretório do composer no PATH
ENV PATH="${PATH}:/root/.composer/vendor/bin"

# Expor porta 80 para o servidor web
EXPOSE 80

# CMD para iniciar o Laravel Sail
CMD ["sail", "up"]

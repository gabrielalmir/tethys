FROM ubuntu:22.04

# Install php
RUN apt-get update && apt-get install -y php

# Install composer
RUN apt-get install -y curl

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

EXPOSE 80

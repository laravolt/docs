---
title: Installation
description: Getting started with Laravolt in your Laravel project
---

This guide will walk you through installing Laravolt in your Laravel project.

---

## Prerequisites

Before installing Laravolt, ensure you have:

1. **Laravel Application**: Laravolt is a package for Laravel. You need an existing Laravel ≥ 11.0 project
2. **PHP ≥ 8.2** with [required extensions](#php-requirements)
3. **Database**: SQLite, MySQL, MariaDB, or PostgreSQL

> **New to Laravel?** Follow the [official Laravel installation guide](https://laravel.com/docs/master#installing-laravel) first.

---

## Installing Laravolt

### Step 1: Install the Package

```bash
composer require laravolt/laravolt
```

### Step 2: Set Up Laravolt

Several files need to be generated and customized for Laravolt to run properly:

```bash
php artisan laravolt:install
```

### Step 3: Migrate the Database

Run the database migrations:

```bash
php artisan migrate:fresh
```

### Step 4: Create Admin User

Add a user with admin role:

```bash
# Interactive command
php artisan laravolt:admin

# Or specify details directly
php artisan laravolt:admin Administrator admin@laravolt.dev secret
```

### Step 5: Start Development Server

Choose your preferred development environment:

#### Option A: Laravel Built-in Server (Simple)

```bash
php artisan serve
```

Access your app at: http://localhost:8000/auth/login

#### Option B: Docker Environment (Recommended)

For a complete development environment with Redis and email testing, use our [Docker setup](#docker-development-environment).

#### Option C: Other Development Tools

See [alternative development tools](#alternative-development-tools) for more options.

---

## Verification & Login

1. **Visit your application** at the URL from your chosen development server
2. **Navigate to login**: `/auth/login`
3. **Use your admin credentials**:
   - Email: admin@laravolt.dev (or what you specified)
   - Password: secret (or what you specified)

**Success!** 🎉 You should see the Laravolt dashboard.

---

## Docker Development Environment

For a comprehensive development setup with Redis caching and email testing:

### Quick Start

Create a `compose.yaml` file in your project root:

```yaml
# docker-compose.yaml
services:
  php:
    image: laravoltdev/image:php8.2-base
    restart: always
    ports:
      - 8080:8080
    volumes:
      - .:/var/www/html
    #  environment:
    #    PHP_OPCACHE_ENABLE: 1 # optional, enables OPcache for better performance
    #    AUTORUN_ENABLED: true # optional, auto-runs Laravel setup tasks

  redis:
    image: valkey/valkey:9.0-alpine
    restart: always
    ports:
      - 6379:6379
    volumes:
      - ./storage/redis-data:/data
    environment:
      REDIS_PASSWORD: null

  mailserver:
    image: axllent/mailpit
    restart: always
    ports:
      - 8025:8025
```

### Usage

```bash
# Start the development environment
docker compose up -d

# Install Laravolt (if not already installed)
docker compose exec php composer require laravolt/laravolt
docker compose exec php php artisan laravolt:install
docker compose exec php php artisan migrate:fresh
docker compose exec php php artisan laravolt:admin
```

### Access Points

- **Main application**: http://localhost:8080
- **Email testing (Mailpit)**: http://localhost:8025

# Run migrations

```bash
php artisan migrate:fresh
```

# Create admin user

```bash
php artisan laravolt:admin
```

### Environment Configuration

When using Docker, update your `.env` file for Redis and email testing:

```env
# Redis Configuration
REDIS_HOST=redis
REDIS_PASSWORD=null
REDIS_PORT=6379

# Optional: Use Redis for caching and sessions
CACHE_DRIVER=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis

# Mailpit Configuration (Email Testing)
MAIL_MAILER=smtp
MAIL_HOST=mailserver
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS="hello@example.com"
MAIL_FROM_NAME="${APP_NAME}"
```

### Container Overview

| Container      | Image                           | Purpose                 | Port |
| -------------- | ------------------------------- | ----------------------- | ---- |
| **php**        | `laravoltdev/image:php8.2-base` | Main application server | 8080 |
| **redis**      | `valkey/valkey:9.0-alpine`      | Caching & sessions      | 6379 |
| **mailserver** | `axllent/mailpit`               | Email testing           | 8025 |

### Development Commands

```bash
# Start/stop containers
docker compose up -d
docker compose down

# Run commands in container
docker compose exec php composer install
docker compose exec php php artisan migrate
docker compose exec php npm install

# View logs
docker compose logs php
docker compose logs redis
docker compose logs mailserver

# Rebuild containers (after updates)
docker compose pull && docker compose up -d --force-recreate
```

### Troubleshooting Docker

**Port conflicts**: Change ports in `compose.yaml`:

```yaml
ports:
  - 3000:8080 # Use port 3000 instead of 8080
```

**Permission issues** (Linux/macOS):

```bash
sudo chown -R 33:33 .
```

---

# Rebuild containers (after updates)

```bash
docker compose pull && docker compose up -d --force-recreate
```

### Troubleshooting

**Port conflicts**: Change ports in `compose.yaml`:

```yaml
ports:
  - 3000:8080 # Use port 3000 instead of 8080
```

**Permission issues** (Linux/macOS):

```bash
sudo chown -R 33:33 .
```

---

## PHP Requirements

### Required Extensions

Laravolt requires these PHP extensions:

| Extension    | Purpose                    |
| ------------ | -------------------------- |
| **BCMath**   | High-precision mathematics |
| **cURL**     | HTTP requests              |
| **DOM**      | XML/HTML manipulation      |
| **GD**       | Image processing           |
| **JSON**     | JSON data processing       |
| **Mbstring** | Multibyte strings          |
| **OpenSSL**  | Encryption & security      |
| **PDO**      | Database connections       |
| **Zip**      | File compression           |

### Checking Extensions

```bash
# List all extensions
php -m

# Check specific extension
php -m | grep gd

# Check platform requirements
composer check-platform-reqs
```

### Installing Extensions

#### Ubuntu/Debian

```bash
sudo apt-get update
sudo apt-get install php8.2-bcmath php8.2-curl php8.2-xml php8.2-gd php8.2-mbstring php8.2-zip
```

#### CentOS/RHEL

```bash
sudo yum install php-bcmath php-curl php-xml php-gd php-mbstring php-zip
```

#### macOS (Homebrew)

```bash
brew install php
# Most extensions included by default
```

#### Windows (XAMPP/WAMP)

1. Open `php.ini` file
2. Find extension line (e.g., `;extension=gd`)
3. Remove semicolon to enable
4. Restart web server

---

## Alternative Development Tools

## Server Requirements

Before installing Laravolt, make sure your environment meets the following requirements:

1. PHP >= 8.2
2. Laravel >= 11.0
3. SQLite, MySQL, MariaDB, or PostgreSQL database
4. Essential PHP Extensions:
   - BCMath - For high-precision mathematics
   - Ctype - For character type validation
   - cURL - For HTTP requests to external services
   - DOM - For XML/HTML document manipulation
   - Exif - For reading metadata from image files
   - Fileinfo - For MIME type detection
   - Filter - For data sanitization and validation
   - GD - For image manipulation (required for media and avatar features)
   - Hash - For hashing and encryption
   - Iconv - For character encoding conversion
   - JSON - For JSON data processing
   - Libxml - Required for DOM and XML extensions
   - Mbstring - For multibyte string handling
   - OpenSSL - For encryption and security features
   - PCRE - For regular expressions
   - PDO - For database connections
   - Session - For user session management
   - Tokenizer - For PHP code processing
   - XML - For XML data processing and API responses
   - XMLWriter - For generating XML files
   - Zip - For file compression and decompression
   - Zlib - For data compression

### Checking PHP Extensions

There are several ways to check which PHP extensions are installed on your system:

1. **Using Terminal/Command Line**:

   ```bash
   php -m
   ```

   This command displays a list of all installed PHP extensions.

2. **Using a PHP Script**:
   Create a file named `phpinfo.php` with the following content:

   ```php
   <?php phpinfo(); ?>
   ```

   Place this file in your web server directory and access it via browser.

3. **Using Composer in a Laravolt Project**:
   ```bash
   composer check-platform-reqs
   ```
   This command checks whether your system meets all platform requirements from installed packages.

### Installing PHP Extensions

Here's how to install commonly used PHP extensions on various operating systems:

#### On Ubuntu/Debian:

```bash
sudo apt-get update
sudo apt-get install php8.2-bcmath php8.2-curl php8.2-xml php8.2-gd php8.2-mbstring php8.2-zip
# Replace 8.2 with your PHP version
```

#### On CentOS/RHEL:

```bash
sudo yum install php-bcmath php-curl php-xml php-gd php-mbstring php-zip
```

#### On macOS (using Homebrew):

```bash
brew install php
# PHP from Homebrew usually includes most required extensions
```

#### On Windows (XAMPP/WAMP):

Most extensions are enabled by default. To enable additional extensions:

1. Open the `php.ini` file (usually located in the PHP installation folder)
2. Find the line containing the extension name (e.g., `;extension=gd`)
3. Remove the semicolon (`;`) at the beginning of the line to enable the extension
4. Restart the web server

### Common Troubleshooting

1. **"Call to undefined function" error**:
   This error message typically indicates that a required PHP extension is not installed or enabled.

2. **Error during Composer installation**:

   ```bash
   Problem 1
       - laravolt/laravolt requires ext-gd * -> the requested PHP extension gd is missing from your system.
   ```

   Solution: Install the requested extension using the instructions above.

3. **Image or avatar errors**:
   If image manipulation features aren't working, make sure the GD extension is properly installed:

   ```bash
   php -m | grep gd
   ```

   If there's no output, the GD extension is not installed.

4. **Checking PHP version**:
   ```bash
   php --version
   ```
   Make sure you're using PHP 8.2 or higher for Laravolt.

## Alternative Development Tools

If you need more comprehensive development environments:

| Tool                                                   | Platform       | Best For              |
| ------------------------------------------------------ | -------------- | --------------------- |
| [Laravel Herd](https://herd.laravel.com/)              | macOS/Windows  | Official Laravel tool |
| [Laragon](https://laragon.org/)                        | Windows        | All-in-one solution   |
| [Laravel Valet](https://laravel.com/docs/master/valet) | macOS          | Lightweight proxy     |
| [XAMPP](https://www.apachefriends.org/)                | Cross-platform | Beginners             |
| [Laradock](https://laradock.io/)                       | Cross-platform | Advanced Docker setup |

---

## Need Help?

- **Issues?** Check our [GitHub Issues](https://github.com/laravolt/laravolt)
- **Questions?** Join our community discussions
- **Commercial Support?** Contact the Laravolt team

Happy coding with Laravolt! 🚀

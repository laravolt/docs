---
title: Installation
description: Getting started with Laravolt in your Laravel project
---

This guide will walk you through installing Laravolt in your Laravel project.

---

## Option 1: Install Laravel with Custom Starter Kit

The easiest way to get started with Laravolt is using our custom starter kit, which includes Laravel with Laravolt pre-configured:

```bash
composer create-project laravolt/laravel-starter-kit --prefer-dist example-app
cd example-app
```

After installation, set up your database and create an admin user:

```bash
php artisan migrate:fresh
php artisan laravolt:admin Administrator admin@laravolt.dev secret
```

---

## Option 2: Quick Package Installation (7.x Branch)

If you already have a Laravel project, you can quickly add Laravolt 7.x:

```bash
composer require laravolt/laravolt:7.x-dev
php artisan laravolt:install
```

Then set up your database and create an admin user:

```bash
php artisan migrate:fresh
php artisan laravolt:admin Administrator admin@laravolt.dev secret
```

---

## Local Development Setup

### Using Laravel Herd (Recommended)

[Laravel Herd](https://herd.laravel.com/) is the official Laravel development environment for macOS and Windows:

1. Download and install [Laravel Herd](https://herd.laravel.com/)
2. Add your project directory to Herd
3. Access your application at: `http://example-app.test/auth/login`

### Using Docker Compose (Alternative)

For a complete development environment with Redis and email testing, create a `docker-compose.yml` file in your project root:

```yaml
services:
  php:
    image: laravoltdev/image:php8.2-base
    restart: always
    ports:
      - 8080:8080
    volumes:
      - .:/var/www/html

  redis:
    image: valkey/valkey:9.0-alpine
    restart: always
    ports:
      - 6379:6379
    volumes:
      - ./storage/redis-data:/data

  mailserver:
    image: axllent/mailpit
    restart: always
    ports:
      - 8025:8025
```

Start the development environment:

```bash
docker compose up -d
```

Access points:
- **Main application**: http://localhost:8080
- **Email testing (Mailpit)**: http://localhost:8025

---

## Login to Your Application

After installation, you can login with your admin credentials:

1. Navigate to `/auth/login`
2. Use your admin credentials:
   - Email: `admin@laravolt.dev` (or what you specified)
   - Password: `secret` (or what you specified)

**Success!** 🎉 You should see the Laravolt dashboard.

---

## Need Help?

- **Issues?** Check our [GitHub Issues](https://github.com/laravolt/laravolt)
- **Questions?** Join our community discussions
- **Commercial Support?** Contact the Laravolt team

Happy coding with Laravolt! 🚀

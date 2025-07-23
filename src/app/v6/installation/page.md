---
title: Installation
description: Getting started with Laravolt in your Laravel project
---

This guide will walk you through the process of installing Laravolt in your Laravel project.

---

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

## Installing Laravolt

**Laravolt** is a package, so you must already have a Laravel application set up before installation. For Laravel installation, refer to the [official documentation](https://laravel.com/docs/master#installing-laravel).
Ensure your configuration is correct and the default Laravel page is accessible in your browser.

Once your Laravel application is ready, follow these steps:

### 1. Install the Package

```bash
composer require laravolt/laravolt
```

### 2. Set Up Laravolt

Several files need to be generated and customized for Laravolt to run properly. Simply run the following command:

```bash
php artisan laravolt:install
```

### 3. Migrate the Database

Next, don't forget to run the migrations (fresh, because Laravel installation auto migrate itself):

```bash
php artisan migrate:fresh
```

### 4. Add an Admin User

To add a user with admin role, run the interactive command:

```bash
php artisan laravolt:admin
```

Or, for a quicker method without answering questions one by one:

```bash
php artisan laravolt:admin Administrator admin@laravolt.dev secret
```

### 5. Local Development

As known, running a PHP application requires a **_web server_**. Here are several ways to run Laravolt in a local development environment:

#### Using Laravel's PHP Built-in Server

The simplest way to run a Laravel application is with the development server via PHP's built-in server. Run the following command:

```bash
php artisan serve
```

The application will be accessible at http://localhost:8000.

#### Using Composer Scripts

Since Laravel 11, there's a `dev` script that can be used to run multiple services simultaneously. If you're using Laravel 11.28 or above, simply run:

```bash
composer dev
```

This script will run multiple services (Vite, queue worker, logs, web server) in a single terminal.

#### Alternative Local Development Tools

If you need a more comprehensive development server, try these alternatives:

1. [Laravel Herd](https://herd.laravel.com/) - Official development server from Laravel
2. [Laragon](https://laragon.org/) - Recommended for Windows, all needs are integrated
3. [XAMPP](https://www.apachefriends.org/index.html) - Popular for beginners
4. [WampServer](http://www.wampserver.com/en) - Alternative for Windows
5. [Laravel Valet](https://laravel.com/docs/master/valet) - Specifically for macOS
6. [Laradock](https://laradock.io/) - Complete Docker solution for the Laravel ecosystem

### 6. Log in to the Application

After the server is running, access the application through your browser and log in using the admin credentials you created earlier:

- URL: http://localhost:8000/auth/login
- Email: the email you entered when running the `laravolt:admin` command (default: admin@laravolt.dev)
- Password: the password you entered when running the `laravolt:admin` command (default: secret)

Congratulations, you've successfully installed and launched Laravolt!

## What's Next?

Now that you have Laravolt installed, you might want to explore:

1. [UI Components](/docs/form) - Learn about Laravolt's form, table, and other UI components
2. [Workflow](/docs/workflow) - Integrate complex business processes with Camunda
3. [Access Control](/docs/acl) - Set up roles and permissions for your application

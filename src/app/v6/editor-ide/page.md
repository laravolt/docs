---
title: Editor & IDE Setup
description: The right tools for efficient Laravel development
nextjs:
  metadata:
    title: Editor & IDE Setup for Laravel Development
    description: Recommended editors, IDEs, and extensions to supercharge your Laravel and Laravolt development workflow.
---

Choosing the right development environment significantly impacts your productivity and code quality. This guide provides recommendations for setting up your editor or IDE for efficient Laravel and Laravolt development.

---

## Overview

A well-configured development environment makes coding more efficient, helps catch errors early, and provides features like autocompletion, debugging, and code navigation. While personal preference plays a significant role in choosing your tools, we recommend several options that work particularly well for Laravel and PHP development.

## Recommended Editors

### PHPStorm

[PHPStorm](https://www.jetbrains.com/phpstorm/) is a professional, full-featured IDE designed specifically for PHP development.

#### Strengths

- Comprehensive out-of-box PHP support
- Deep Laravel integration
- Advanced debugging capabilities
- Powerful refactoring tools
- Database tools and SQL support
- Git integration with visual merge tool

#### Considerations

- Paid license (free for students through the GitHub Student Developer Pack)
- Requires more system resources (especially RAM)
- Steeper learning curve for new users

### Visual Studio Code

[Visual Studio Code](https://code.visualstudio.com/) (VS Code) is a lightweight, highly extensible editor that can be customized to provide excellent PHP and Laravel support.

#### Strengths

- Free and open-source
- Lightweight with fast startup
- Highly customizable through extensions
- Strong community support
- Works well across multiple programming languages

#### Considerations

- Requires additional configuration and extensions to match PHPStorm's PHP capabilities
- May require more manual setup for advanced features

## Setting Up Visual Studio Code for Laravel

Visual Studio Code is an excellent choice for Laravel development when configured with the right extensions. Follow these steps to set up an optimal Laravel development environment.

### Essential Extensions

#### 1. Settings Sync

Synchronize your VS Code settings, snippets, themes, and extensions across multiple machines.

- [Settings Sync](https://marketplace.visualstudio.com/items?itemName=Shan.code-settings-sync)

**Quick Setup:**

1. Install the Settings Sync extension
2. Press `SHIFT + ALT + D` to open the GUI
3. Click "Download Public Gist"
4. Enter Gist ID: `25cef208ec0fa79cebfeb0a653370b91` (Laravolt recommended settings)
5. Wait for the installation and download process to complete

#### 2. PHP Intelephense

A high-performance PHP code intelligence extension providing features like autocompletion, signature help, and go-to definition.

- [PHP Intelephense](https://marketplace.visualstudio.com/items?itemName=bmewburn.vscode-intelephense-client)

**Key Features:**

- Fast autocompletion and intellisense
- Code navigation (go to definition, find all references)
- Code linting and error detection
- PHPDoc support
- Lower resource usage than some alternatives

#### 3. Laravel Extension Pack

A collection of extensions for Laravel development, including:

- [Laravel Extension Pack](https://marketplace.visualstudio.com/items?itemName=onecentlin.laravel-extension-pack)

This pack includes:

- Laravel Blade Snippets - Syntax highlighting and snippets for Blade
- Laravel Snippets - Laravel snippets for common patterns
- Laravel Artisan - Run Artisan commands from VS Code
- Laravel Extra Intellisense - Advanced autocompletion for Laravel
- Laravel Goto View - Jump to view files from controllers
- Laravel Goto Controller - Navigate between routes and controllers
- DotENV - .env file syntax highlighting

#### 4. SonarLint

Code quality and security analysis tool that helps detect and fix issues before committing your code.

- [SonarLint](https://marketplace.visualstudio.com/items?itemName=SonarSource.sonarlint-vscode)

**Benefits:**

- Real-time feedback on code quality
- Detection of bugs and security vulnerabilities
- Clean code recommendations
- Consistent coding standards

#### 5. GitLens

Enhance Git capabilities within VS Code for better repository visualization and history tracking.

- [GitLens](https://gitlens.amod.io/)

**Key Features:**

- Inline Git blame annotations
- File and line history exploration
- Branch and tag visualization
- Commit search and comparison

### Additional Recommended Extensions

#### PHP DocBlocker

Provides automatic PHP docblock generation for functions and classes.

```bash
ext install neilbrayfield.php-docblocker
```

#### Tailwind CSS IntelliSense

If you're using Tailwind CSS with Laravel, this extension provides autocompletion and linting for Tailwind classes.

```bash
ext install bradlc.vscode-tailwindcss
```

#### Laravel Blade Formatter

Format your Blade templates with this specialized formatter.

```bash
ext install shufo.vscode-blade-formatter
```

#### Better PHPUnit

Run PHPUnit tests directly from VS Code.

```bash
ext install calebporzio.better-phpunit
```

## Setting Up PHPStorm for Laravel

PHPStorm comes with excellent PHP support out of the box, but adding a few plugins can enhance your Laravel development experience.

### Recommended Plugins

To add these plugins, go to **Preferences** > **Plugins** > **Marketplace**.

#### 1. Laravel

Official Laravel plugin providing enhanced support for Laravel-specific features.

**Features:**

- Advanced completion for facade methods
- Route, config, view, and translation references
- Blade template support
- Artisan command integration

#### 2. SonarLint

Integrates SonarLint code quality tools directly into PHPStorm.

**Benefits:**

- Real-time code quality analysis
- Security vulnerability detection
- Customizable rules

#### 3. PHP Inspection (EA Extended)

Extends PHPStorm's code inspection capabilities with additional checks.

**Features:**

- Advanced code analysis
- Additional inspections not covered by PHPStorm's defaults
- Performance optimization suggestions

#### 4. Additional Optional Plugins

- **WakaTime**: Track your coding time and habits
- **Code With Me**: Collaborative coding sessions with team members

### PHPStorm Configuration Tips

#### Enable Laravel Plugin

1. Go to **Preferences** > **PHP** > **Laravel**
2. Check "Enable plugin for this project"
3. Make sure the Laravel paths are correctly set

#### Configure Composer

1. Go to **Preferences** > **PHP** > **Composer**
2. Set path to composer.phar or composer executable
3. Enable "Synchronize IDE settings with composer.json"

#### PHP CS Fixer Integration

1. Install PHP CS Fixer via Composer
2. Go to **Preferences** > **Tools** > **External Tools**
3. Add PHP CS Fixer as an external tool
4. Configure keyboard shortcut for easy formatting

## Development Workflow Enhancements

### Terminal Integration

Both VS Code and PHPStorm offer integrated terminals. Configure yours to:

- Set the default shell (e.g., Bash, Zsh)
- Configure split terminal views for running multiple commands
- Add aliases for common Laravel commands

### Database Connection

Connect your IDE directly to your project's database:

**VS Code**:

- Install the "SQLTools" extension
- Configure your database connection

**PHPStorm**:

- Go to **Database** in the right sidebar
- Click "+" to add a data source
- Configure connection to your database

### Xdebug Configuration

Configure Xdebug for step-through debugging:

1. Install Xdebug PHP extension
2. Configure your editor to connect to Xdebug
3. Set breakpoints and start debugging sessions

## Best Practices

### Consistent Formatting

Use tools like PHP CS Fixer or Laravel Pint to maintain consistent code formatting:

```bash
# Using Laravel Pint
./vendor/bin/pint

# Using PHP CS Fixer
php-cs-fixer fix --config=.php-cs-fixer.php
```

### Regular Updates

Keep your editor and extensions updated for the latest features and security fixes.

### Keyboard Shortcuts

Learn keyboard shortcuts to speed up your workflow. Both VS Code and PHPStorm offer shortcut cheat sheets:

- [VS Code Keyboard Shortcuts](https://code.visualstudio.com/docs/getstarted/keybindings)
- [PHPStorm Keyboard Shortcuts](https://www.jetbrains.com/help/phpstorm/mastering-keyboard-shortcuts.html)

## Troubleshooting

### Extension Conflicts

If you experience performance issues or conflicts:

1. Try disabling extensions one by one to identify the culprit
2. Make sure extensions are compatible with your editor version
3. Check for duplicate functionality across multiple extensions

### Performance Issues

If your editor becomes slow:

**VS Code**:

- Disable unnecessary extensions
- Use the "workbench.editor.enablePreview" setting to reduce memory usage
- Increase available memory with the "--max-memory" flag

**PHPStorm**:

- Increase memory allocation in Help > Edit Custom VM Options
- Disable plugins you don't use
- Exclude large directories from indexing

## Related Documentation

- [Laravel Development Environment](/v6/installation)
- [Coding Standards](/v6/code-quality)
- [Git Workflow](/v6/git-guidelines)

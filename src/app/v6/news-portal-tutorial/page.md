---
title: News Portal Tutorial
description: Build a complete news portal application with Laravolt
nextjs:
  metadata:
    title: News Portal Tutorial
    description: A comprehensive step-by-step tutorial for building a full-featured news portal application using Laravolt, from design to deployment.
---

This tutorial guides you through building a complete news portal application similar to popular news sites but with a simplified architecture. You'll implement features such as content management, user roles, comments, and analytics.

---

## Project Overview

In this tutorial, we'll build a news portal application with both an admin panel and a public-facing website. The project will use Laravolt's built-in features to accelerate development while still providing a comprehensive learning experience.

## Application Specifications

### Actors (User Roles)

The application will involve four distinct user roles:

1. **Admin** - Manages the platform and has access to all features
2. **Writer** - Creates and manages news content
3. **Member** - Registered users who can interact with content
4. **Guest** - Anonymous visitors with limited permissions

### User Stories

#### Admin Capabilities

- Moderate comments (approve, reject, delete)
- Manage member and writer accounts
- Access dashboard with application statistics and summaries
- (Advanced) Export news and comments to Excel
- (Advanced) Configure website settings like name, logo, and analytics
- (Advanced) Switch between multiple themes

#### Writer Capabilities

- Create, read, update, and delete news articles
- Access a personal dashboard with content statistics
- (Advanced) Receive email notifications for comments on their articles

#### Member Capabilities

- Edit personal profile information
- Add, edit, and delete their own comments
- Read news articles and browse content

#### Guest Capabilities

- Browse and read news articles
- Search for articles by keywords
- Filter articles by topic
- View comments
- Register for a member account with email verification
- Authenticate (login/logout)
- Recover forgotten passwords

## Technical Concepts

### Data Models

The application will use four primary models:

1. **User** - Stores account information for all user types
2. **Post** - Represents news articles
3. **Topic** - Categorizes news articles
4. **Comment** - Stores user comments on articles

### Relationships

The application will implement these relationships:

- Member is-a User
- Writer is-a Member
- Writer has many Posts
- Member has many Comments
- Post belongs to Topic
- Post belongs to Writer
- Comment belongs to Member

### Technical Requirements

- Admin panel built with Laravolt
- Public-facing website built with TailwindCSS
- CRUD operations for Post and Topic using AutoCRUD
- Dashboard charts created with Laravolt Chart

## Development Roadmap

We'll approach this project in progressive levels of complexity:

### Level 1: Core Application

The first level focuses on building the essential features to get the application running:

1. Set up the project with Laravolt
2. Create database migrations and models
3. Implement authentication and authorization
4. Build CRUD operations for news management
5. Create the public-facing website
6. Add comment functionality
7. Implement user profile management
8. Create a seeder for test data
9. Deploy to Heroku

### Level 2: Enhanced Features

The second level adds more sophisticated features:

1. Export functionality for news and comments
2. Dashboard filtering by date range
3. Writer-specific content management
4. Email notifications for new comments

### Level 3: Advanced Capabilities

The third level adds administrative controls and better user experience:

1. Website settings management
2. Multi-theme support
3. Google Analytics integration

### Level 4: Production Optimization

The final level focuses on performance and quality:

1. PHPStan level 9 compliance
2. Integration testing
3. PageSpeed Insight optimization

## Implementation Guide

Let's begin implementing our news portal application, starting with the essential features in Level 1.

### Project Setup

#### 1. Create a New Laravel Project

```bash
composer create-project laravel/laravel news-portal
cd news-portal
```

#### 2. Install Laravolt

```bash
composer require laravolt/laravolt
php artisan laravolt:install
```

#### 3. Set Up the Environment

Configure your `.env` file with the appropriate database settings:

```env
DB_CONNECTION=sqlite
```

### Database Structure

#### 1. Create Migrations

First, let's create the necessary migrations for our models:

```bash
php artisan make:migration create_topics_table
php artisan make:migration create_posts_table
php artisan make:migration create_comments_table
```

#### 2. Define the Topic Schema

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    // database/migrations/xxxx_xx_xx_create_topics_table.php
    public function up()
    {
        Schema::create('topics', function (Blueprint $table) {
            $table->ulid()->primary();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('topics');
    }
};

```

#### 3. Define the Post Schema

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    // database/migrations/xxxx_xx_xx_create_posts_table.php
    public function up()
    {
        Schema::create('posts', function (Blueprint $table) {
            $table->ulid()->primary();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('topic_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('summary')->nullable();
            $table->longText('content');
            $table->string('featured_image')->nullable();
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('posts');
    }
};

```

#### 4. Define the Comment Schema

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    // database/migrations/xxxx_xx_xx_create_comments_table.php
    public function up()
    {
        Schema::create('comments', function (Blueprint $table) {
            $table->ulid()->primary();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('post_id')->constrained()->onDelete('cascade');
            $table->text('content');
            $table->boolean('is_approved')->default(false);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('comments');
    }
};

```

### Model Implementation

#### 1. Create Models

```bash
php artisan make:model Topic
php artisan make:model Post
php artisan make:model Comment
```

#### 2. Implement the Topic Model

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Topic extends Model
{
    use \Illuminate\Database\Eloquent\Concerns\HasUlids;

    protected $fillable = ['name', 'slug', 'description'];

    public function posts()
    {
        return $this->hasMany(Post::class);
    }

    public function getRouteKeyName()
    {
        return 'slug';
    }
}

```

#### 3. Implement the Post Model

```php
<?php

namespace App\Models;

class Post extends \Illuminate\Database\Eloquent\Model
{
    use \Illuminate\Database\Eloquent\Concerns\HasUlids;

    use \Illuminate\Database\Eloquent\SoftDeletes;

    protected $fillable = [
        'user_id', 'topic_id', 'title', 'slug', 'summary',
        'content', 'featured_image', 'published_at'
    ];

    protected $dates = ['published_at'];

    public function topic()
    {
        return $this->belongsTo(Topic::class);
    }

    public function author()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    public function scopePublished($query)
    {
        return $query->whereNotNull('published_at')
            ->where('published_at', '<=', now());
    }

    public function getRouteKeyName()
    {
        return 'slug';
    }
}

```

#### 4. Implement the Comment Model

```php
<?php

namespace App\Models;

class Comment extends \Illuminate\Database\Eloquent\Model
{
    use \Illuminate\Database\Eloquent\Concerns\HasUlids;

    use \Illuminate\Database\Eloquent\SoftDeletes;

    protected $fillable = [
        'user_id', 'post_id', 'content', 'is_approved'
    ];

    protected $casts = [
        'is_approved' => 'boolean',
    ];

    public function author()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function post()
    {
        return $this->belongsTo(Post::class);
    }
}

```

#### 5. Update the User Model

```php
<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;
use Laravolt\Platform\Models\User as BaseUser;
use Laravolt\Suitable\AutoFilter;
use Laravolt\Suitable\AutoSearch;
use Laravolt\Suitable\AutoSort;

class User extends BaseUser
{
    use AutoFilter, AutoSearch, AutoSort;
    use HasFactory, Notifiable;
    // use \Laravel\Sanctum\HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = ['name', 'email', 'username', 'password', 'status', 'timezone'];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = ['password', 'remember_token'];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];
}

```

### Authorization Setup

#### 1. Create Policies

```bash
php artisan make:policy PostPolicy --model=Post
php artisan make:policy CommentPolicy --model=Comment
```

#### 2. Implement Post Policy

```php
// app/Policies/PostPolicy.php
namespace App\Policies;

use App\Models\Post;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class PostPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user)
    {
        return $user->isAdmin() || $user->isWriter();
    }

    public function view(User $user, Post $post)
    {
        return true; // Anyone can view published posts
    }

    public function create(User $user)
    {
        return $user->isAdmin() || $user->isWriter();
    }

    public function update(User $user, Post $post)
    {
        return $user->isAdmin() || $user->id === $post->user_id;
    }

    public function delete(User $user, Post $post)
    {
        return $user->isAdmin() || $user->id === $post->user_id;
    }
}
```

#### 3. Implement Comment Policy

```php
// app/Policies/CommentPolicy.php
namespace App\Policies;

use App\Models\Comment;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class CommentPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user)
    {
        return true;
    }

    public function view(User $user, Comment $comment)
    {
        return true;
    }

    public function create(User $user)
    {
        return $user->isMember() || $user->isWriter() || $user->isAdmin();
    }

    public function update(User $user, Comment $comment)
    {
        return $user->isAdmin() || $user->id === $comment->user_id;
    }

    public function delete(User $user, Comment $comment)
    {
        return $user->isAdmin() || $user->id === $comment->user_id;
    }

    public function moderate(User $user, Comment $comment)
    {
        return $user->isAdmin();
    }
}
```

## Next Steps

The implementation guide above covers the initial setup of the database structure, models, and authorization policies for our news portal. In the next parts of this tutorial (which will be added soon), we'll cover:

1. Setting up AutoCRUD for the admin panel
2. Building the public-facing website with TailwindCSS
3. Implementing the comment system
4. Creating dashboard charts with Laravolt Chart
5. Developing more advanced features like exporting and filtering
6. Adding email notifications
7. Implementing website settings and theme switching
8. Optimizing for performance and quality

## Resources

- [Laravolt Documentation](/v6/overview)
- [AutoCRUD Guide](/v6/auto-crud)
- [Laravolt Chart](/v6/charts)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)

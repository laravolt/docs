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

We'll approach this project in progressive levels, each designed to be demonstrated in a 7-minute YouTube screencast:

### Level 1: Project Setup (Screencast 1)

The first screencast covers setting up the initial project:

1. Create a new Laravel project
2. Install and configure Laravolt
3. Set up the development environment (database, config)
4. Overview of the project structure

### Level 2: Data Structure (Screencast 2)

This screencast focuses on building the data foundation:

1. Create database migrations with proper relationships
2. Implement models with appropriate traits (HasUlids, SoftDeletes)
3. Define model relationships
4. Run migrations and verify database structure

### Level 3: Authentication & Authorization (Screencast 3)

This screencast covers user management:

1. Configure authentication using Laravolt
2. Set up the ACL system with roles (Admin, Writer, Member)
3. Create permission enums for access control
4. Implement policies for Post and Comment models
5. Create seeders for roles and permissions

### Level 4: Admin Panel - Topic Management (Screencast 4)

This screencast demonstrates building admin functionality:

1. Implement AutoCRUD for topic management
2. Create topic listing with sorting and filtering
3. Build topic creation and edit forms
4. Add validation rules for topic data
5. Implement topic deletion with confirmation

### Level 5: Admin Panel - Post Management (Screencast 5)

This screencast continues admin functionality:

1. Build post management with rich text editor
2. Create post listing with topic filters
3. Implement featured image uploads
4. Add post publishing workflow
5. Set up post status management

### Level 6: Admin Panel - Dashboard & Comments (Screencast 6)

This screencast completes the admin features:

1. Create admin dashboard with statistics
2. Build comment moderation system
3. Implement user management interface
4. Add simple analytics charts
5. Create activity logs

### Level 7: Public Website - Frontend (Screencast 7)

This screencast starts building the public site:

1. Set up TailwindCSS for the public site
2. Create responsive layouts
3. Build homepage with featured posts
4. Implement topic browsing pages
5. Create article detail pages

### Level 8: Public Website - Interactive Features (Screencast 8)

This screencast adds interactivity to the public site:

1. Implement comment submission system
2. Create user registration and profile pages
3. Build search functionality
4. Add topic filtering
5. Implement pagination

### Level 9: Testing & Quality Assurance (Screencast 9)

The final screencast focuses on ensuring quality:

1. Configure PHPStan for code quality
2. Create integration tests for core features
3. Write unit tests for critical components
4. Set up CI/CD pipeline configurations
5. Add performance optimizations

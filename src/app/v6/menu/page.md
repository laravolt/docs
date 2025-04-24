---
title: Menu
description: Configure and customize sidebar menus
---

Laravolt uses a config-file approach to display menus in the sidebar, with the following goals:

1. Creating a single source of truth for developers
2. Tracking menu changes through version control since config files are tracked by Git
3. Separating content from presentation - config files only contain essential menu information like labels, URLs, and icons, while Laravolt handles the HTML and CSS

---

## Introduction

Laravolt automatically reads the `config/laravolt/menu` directory to look for menu configuration files. You can organize your menus by creating multiple config files in this directory.

In brief, the anatomy of a menu is:

- Group 1
  - Menu 1
  - Menu 2
    - Sub menu 2.1
    - Sub menu 2.2
  - Menu 3
- Group 2

## Registering Menus

Create a new file `config/laravolt/menu/app.php`:

```php
<?php

return [
    'App' => [
        'order' => 1,
        'menu' => [
            'Dashboard' => [
                'route' => ['dashboard'],
                'active' => 'dashboard/*',
                'icon'  => 'chart-bar'
            ],
            'Manage Posts' => [
                'route' => ['posts.index'],
                'active' => 'posts/*',
                'icon'  => 'newspaper'
            ],
        ],
    ],
];
```

Config files help you group menus. You can create as many config files as needed for your application, for example:

- `config/laravolt/menu/app.php`
- `config/laravolt/menu/master-data.php`
- `config/laravolt/menu/settings.php`

## Nested Menus

Laravolt supports up to 2 levels of menus (menu and submenu). To create nested menus, just add a `'menu'` entry with the same array schema:

```php
<?php

return [
    'App' => [
        'order' => 1,
        'menu' => [
            'Dashboard' => [
                'route' => ['dashboard'],
                'active' => 'dashboard/*',
                'icon' => 'chart-bar',
            ],
            'Posts' => [
                'icon' => 'newspaper',
                'menu' => [
                    'Published' => [
                        'route' => ['posts.index', ['type' => 'published']],
                        'active' => 'posts?type=published',
                    ],
                    'Draft' => [
                        'route' => ['posts.index', ['type' => 'draft']],
                        'active' => 'posts?type=draft',
                    ],
                ],
            ],
        ],
    ],
];
```

## Available Options

### order

Only available at the group level. Used to determine the order of menus.

```php
<?php

return [
    'Main Menu' => [
        'order' => 2,
        'menu' => [
            // ...
        ],
    ],
];
```

### route

```php
'route' => ['route.name', ['param1' => 'value']],
```

Don't call the `route()` helper directly from the config file as it may cause errors in production.

### url

If you're not accustomed to using named routes, you can simply write the hardcoded URL.

```php
'url' => 'posts/create',
```

### active

Determines which menu entry needs to be set as active and expanded. Can use wildcards.

```php
'active' => 'posts/*',
```

### icon

Sets the icon to display. Icons can be viewed at [Font Awesome](https://fontawesome.com/v5/search?s=duotone). Laravolt has an official license for Font Awesome 5 Pro.

```php
'icon' => 'users',
```

Currently, only first-level menus can display icons, while category labels (menu groups) and submenus cannot.

### permissions

Determines whether a menu should be displayed or not, based on the Permissions that the User has.

```php
'permissions' => [\App\Enum\Permissions::MANAGE_POST],
```

## Dynamic Menus

To add menus dynamically, add the following code to the `boot()` method in your `AppServiceProvider`:

```php
public function boot()
{
    app('laravolt.menu.sidebar')->register(function (\Lavary\Menu\Builder $menu) {
        // Add menu to existing group
        $group1 = $menu->get('system');
        $group1->add('My Menu', 'my-menu')
            ->data('icon', 'list')
            ->data('order', 10)
            ->data('permission', 'foo')
            ->active("my-menu/*");

        // Add new group and menu
        $group2 = $menu->add('New Group');
        $group2->add('My Menu 2', 'my-menu-2')
            ->data('icon', 'list')
            ->data('order', 10)
            ->data('permission', 'foo')
            ->active("my-menu-2/*");

        // Add group, menu, and submenu
        $group3 = $menu->add('Nested Menu');
        $menu3 = $group3->add('My Menu 3')
            ->data('icon', 'list')
            ->data('order', 10)
            ->data('permission', 'foo');
        $menu3->add('Sub Menu A', '#');
    });
}
```

## Menu with Authorization

Menus can be conditionally displayed based on user permissions. There are two ways to implement this:

### Using Permission Strings

```php
<?php

return [
    'App' => [
        'order' => 1,
        'menu' => [
            'Dashboard' => [
                'route' => ['dashboard'],
                'active' => 'dashboard/*',
                'icon'  => 'chart-bar'
            ],
            'Manage Posts' => [
                'route' => ['posts.index'],
                'active' => 'posts/*',
                'icon'  => 'newspaper',
                'permissions' => ['manage-posts']
            ],
        ],
    ],
];
```

In this example, the "Manage Posts" menu will only be visible to users who have the 'manage-posts' permission.

### Using Role-Based Authorization

You can also restrict menu visibility based on user roles:

```php
<?php

return [
    'Admin Area' => [
        'order' => 99,
        'menu' => [
            'User Management' => [
                'route' => ['users.index'],
                'active' => 'users/*',
                'icon'  => 'users',
                'roles' => ['admin', 'super-admin']
            ],
            'System Settings' => [
                'route' => ['settings.index'],
                'active' => 'settings/*',
                'icon'  => 'cogs',
                'roles' => ['super-admin']
            ],
        ],
    ],
];
```

The "User Management" menu will only be visible to users with 'admin' or 'super-admin' roles, while "System Settings" will only be visible to 'super-admin'.

## Menu with Badges

You can add badges to menu items to display counts or status indicators:

```php
<?php

return [
    'App' => [
        'order' => 1,
        'menu' => [
            'Dashboard' => [
                'route' => ['dashboard'],
                'active' => 'dashboard/*',
                'icon'  => 'chart-bar'
            ],
            'Notifications' => [
                'route' => ['notifications.index'],
                'active' => 'notifications/*',
                'icon'  => 'bell',
                'badge' => function() {
                    return auth()->user()->unreadNotifications()->count();
                }
            ],
        ],
    ],
];
```

The badge can be a static value or a callback function that returns a value:

```php
'badge' => 5 // Static badge with value 5
```

```php
'badge' => function() {
    return auth()->user()->unreadNotifications()->count();
}
```

You can also customize the badge appearance:

```php
'badge' => [
    'value' => function() {
        return auth()->user()->unreadNotifications()->count();
    },
    'class' => 'red' // Use any Fomantic UI color class
]
```

## Menu Ordering

Menu groups and menu items can be ordered using the 'order' key:

### Group Ordering

```php
<?php

return [
    'Main Menu' => [
        'order' => 1,
        'menu' => [
            // ...
        ],
    ],
    'Secondary Menu' => [
        'order' => 2,
        'menu' => [
            // ...
        ],
    ],
];
```

### Menu Item Ordering

```php
<?php

return [
    'Main Menu' => [
        'order' => 1,
        'menu' => [
            'Dashboard' => [
                'route' => ['dashboard'],
                'active' => 'dashboard/*',
                'icon'  => 'chart-bar',
                'order' => 1
            ],
            'Reports' => [
                'route' => ['reports.index'],
                'active' => 'reports/*',
                'icon'  => 'chart-line',
                'order' => 2
            ],
        ],
    ],
];
```

Lower numbers appear first in the menu.

## Menu Customization

### Menu Theme

You can customize the sidebar theme by editing the `config/laravolt/ui.php` file:

```php
return [
    'sidebar' => [
        'theme' => 'light', // Options: 'light', 'dark', 'primary'
    ],
    // ...
];
```

### Sidebar Collapsed State

You can set the default state of the sidebar (expanded or collapsed) in the same config file:

```php
return [
    'sidebar' => [
        'collapsed' => false, // Set to true to have the sidebar collapsed by default
    ],
    // ...
];
```

Users can toggle the sidebar state by clicking the collapse/expand button at the bottom of the sidebar.

## Best Practices

1. **Organize Logically**: Group related menu items together in meaningful categories
2. **Keep It Simple**: Aim for a maximum of 7-8 main menu groups to prevent overwhelming users
3. **Use Consistent Icons**: Choose icons that clearly represent the destination or action
4. **Clear Labels**: Use short, descriptive menu labels
5. **Proper Authorization**: Always implement proper authorization to ensure users only see menus relevant to their roles and permissions

## Troubleshooting

### Menus Not Displaying

1. Check that your config files are in the correct location: `config/laravolt/menu/`
2. Verify that all required configuration keys are present and formatted correctly
3. Run `php artisan config:clear` to clear cached configurations
4. Ensure the user has the necessary permissions if the menu is permission-restricted

### Active State Not Working

1. Check your 'active' patterns to ensure they match the correct URL patterns
2. Remember that 'active' patterns support wildcards, e.g., `posts/*`
3. For query parameter-dependent active states, include the query string in your pattern: `posts?type=draft`

### Icon Not Displaying

1. Verify the icon name in [Font Awesome](https://fontawesome.com/v5/search?s=duotone)
2. Ensure you're using the correct icon style (solid, regular, light, or duotone)
3. Check for any typos in the icon name

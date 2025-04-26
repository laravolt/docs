---
title: Blade Components
description: Reusable UI elements built with Laravel Blade Components
nextjs:
  metadata:
    title: Blade Components
    description: A comprehensive guide to Laravolt's Blade Components for building consistent, accessible user interfaces.
---

Laravolt provides a comprehensive set of Blade Components that help you build consistent, accessible, and beautiful user interfaces with minimal effort.

---

## Overview

Blade Components are a powerful feature in Laravel that allows you to create reusable, encapsulated UI elements. Laravolt extends this functionality with a set of pre-designed components that follow best practices for web design and accessibility.

These components help you:

- Maintain design consistency across your application
- Reduce duplication of HTML and CSS code
- Implement complex UI patterns with minimal effort
- Create accessible interfaces that work for all users

## Basic Usage

Laravolt Blade Components use Laravel's component syntax. Here's a basic example:

```blade
<x-volt-button>Click Me</x-volt-button>
```

Most components accept attributes that modify their appearance or behavior:

```blade
<x-volt-button color="primary" size="large" icon="save">
    Save Changes
</x-volt-button>
```

## Component Prefixing

All Laravolt components use the `volt-` prefix to avoid conflicts with your own components or those from other packages. For example:

- `<x-volt-button>` for buttons
- `<x-volt-card>` for cards
- `<x-volt-icon>` for icons

## Available Components

### Button

The Button component provides a consistent way to trigger actions across your application.

```blade
<x-volt-button
    icon="plus"
    class="pink"
>
    Export
</x-volt-button>
```

#### Button Properties

| Property   | Type    | Default   | Description                                                                     |
| ---------- | ------- | --------- | ------------------------------------------------------------------------------- |
| `icon`     | string  | null      | Name of the icon to display with the button                                     |
| `class`    | string  | null      | Additional CSS classes                                                          |
| `color`    | string  | 'default' | Button color: 'default', 'primary', 'secondary', 'success', 'warning', 'danger' |
| `size`     | string  | 'medium'  | Button size: 'small', 'medium', 'large'                                         |
| `type`     | string  | 'button'  | HTML button type: 'button', 'submit', 'reset'                                   |
| `disabled` | boolean | false     | Whether the button is disabled                                                  |

### Card

The Card component is used to group related content in a flexible container.

```blade
<x-volt-card
    title="Card Title"
    cover="https://via.placeholder.com/300"
    meta.before="foo"
    content="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat"
    meta.after="foo"
/>
```

#### Card Properties

| Property      | Type   | Default | Description                            |
| ------------- | ------ | ------- | -------------------------------------- |
| `title`       | string | null    | Card title                             |
| `cover`       | string | null    | URL to the cover image                 |
| `content`     | string | null    | Main content for the card              |
| `meta.before` | string | null    | Metadata to display before the content |
| `meta.after`  | string | null    | Metadata to display after the content  |

#### Card with Slots

For more complex cards, you can use slots:

```blade
<x-volt-card>
    <x-slot name="header">Card Header</x-slot>

    <p>This is the main content of the card.</p>
    <p>You can include any HTML here.</p>

    <x-slot name="footer">Card Footer</x-slot>
</x-volt-card>
```

### Brand Image

The Brand Image component helps maintain consistent branding across your application.

```blade
<x-volt-brand-image
    src="/path/to/logo.png"
    alt="Company Name"
/>
```

#### Brand Image Properties

| Property | Type           | Default      | Description                        |
| -------- | -------------- | ------------ | ---------------------------------- |
| `src`    | string         | null         | Image source URL                   |
| `alt`    | string         | 'Brand logo' | Alternative text for accessibility |
| `width`  | string/integer | null         | Image width                        |
| `height` | string/integer | null         | Image height                       |
| `class`  | string         | null         | Additional CSS classes             |

### Breadcrumb

The Breadcrumb component shows the hierarchical path to the current page.

```blade
<x-volt-breadcrumb>
    <x-volt-breadcrumb-item label="Home" link="/" />
    <x-volt-breadcrumb-item label="Products" link="/products" />
    <x-volt-breadcrumb-item label="Current Product" />
</x-volt-breadcrumb>
```

#### Breadcrumb Item Properties

| Property | Type   | Default  | Description                                         |
| -------- | ------ | -------- | --------------------------------------------------- |
| `label`  | string | required | Text label for the breadcrumb item                  |
| `link`   | string | null     | URL for the breadcrumb item (omit for current page) |
| `icon`   | string | null     | Optional icon to display with the item              |

### Icon

The Icon component provides an easy way to include SVG icons in your interface.

```blade
<x-volt-icon name="user" class="large" />
```

#### Icon Properties

| Property | Type   | Default  | Description                           |
| -------- | ------ | -------- | ------------------------------------- |
| `name`   | string | required | Name of the icon to display           |
| `class`  | string | null     | Additional CSS classes                |
| `size`   | string | 'medium' | Icon size: 'small', 'medium', 'large' |
| `color`  | string | null     | Icon color class                      |

### Link

The Link component provides consistent styling for text links.

```blade
<x-volt-link href="/dashboard" icon="home">
    Go to Dashboard
</x-volt-link>
```

#### Link Properties

| Property | Type   | Default  | Description                                    |
| -------- | ------ | -------- | ---------------------------------------------- |
| `href`   | string | required | URL for the link                               |
| `icon`   | string | null     | Optional icon to display with the link         |
| `class`  | string | null     | Additional CSS classes                         |
| `target` | string | '\_self' | Target for the link: '\_self', '\_blank', etc. |

### Link Button

The Link Button component creates links that are styled as buttons.

```blade
<x-volt-link-button href="/dashboard" icon="home" color="primary">
    Dashboard
</x-volt-link-button>
```

#### Link Button Properties

| Property | Type   | Default   | Description                                           |
| -------- | ------ | --------- | ----------------------------------------------------- |
| `href`   | string | required  | URL for the link                                      |
| `icon`   | string | null      | Optional icon to display                              |
| `color`  | string | 'default' | Button color: 'default', 'primary', 'secondary', etc. |
| `size`   | string | 'medium'  | Button size: 'small', 'medium', 'large'               |
| `class`  | string | null      | Additional CSS classes                                |
| `target` | string | '\_self'  | Target for the link: '\_self', '\_blank', etc.        |

### Form

The Form component provides a standardized way to create forms.

```blade
<x-volt-form action="/users" method="POST">
    <!-- Form fields go here -->
    <x-volt-button type="submit">Save</x-volt-button>
</x-volt-form>
```

#### Form Properties

| Property | Type    | Default | Description                                          |
| -------- | ------- | ------- | ---------------------------------------------------- |
| `action` | string  | null    | Form submission URL                                  |
| `method` | string  | 'POST'  | HTTP method: 'GET', 'POST', 'PUT', 'PATCH', 'DELETE' |
| `files`  | boolean | false   | Whether the form allows file uploads                 |
| `class`  | string  | null    | Additional CSS classes                               |
| `id`     | string  | null    | Form ID                                              |

### Media Library

The Media Library component helps manage and display media content.

```blade
<x-volt-media-library
    name="attachments"
    :collection="$mediaLibrary"
    multiple
    accept="image/*"
/>
```

#### Media Library Properties

| Property     | Type    | Default  | Description                                                |
| ------------ | ------- | -------- | ---------------------------------------------------------- |
| `name`       | string  | required | Input name for the files                                   |
| `collection` | array   | []       | Existing media items to display                            |
| `multiple`   | boolean | false    | Whether multiple files can be selected                     |
| `accept`     | string  | null     | MIME types to accept (e.g., 'image/\*', 'application/pdf') |
| `max`        | integer | null     | Maximum number of files                                    |

### Panel

The Panel component groups content in collapsible sections.

```blade
<x-volt-panel title="Settings">
    <p>Panel content goes here.</p>
</x-volt-panel>
```

#### Panel Properties

| Property    | Type    | Default | Description                              |
| ----------- | ------- | ------- | ---------------------------------------- |
| `title`     | string  | null    | Panel title                              |
| `collapsed` | boolean | false   | Whether the panel is initially collapsed |
| `class`     | string  | null    | Additional CSS classes                   |
| `icon`      | string  | null    | Optional icon for the panel header       |

### Tab

The Tab component organizes content into tabbed interfaces.

```blade
<x-volt-tab>
    <x-volt-tab-panel title="First Tab" active>
        Content for the first tab
    </x-volt-tab-panel>
    <x-volt-tab-panel title="Second Tab">
        Content for the second tab
    </x-volt-tab-panel>
</x-volt-tab>
```

#### Tab Panel Properties

| Property | Type    | Default  | Description                         |
| -------- | ------- | -------- | ----------------------------------- |
| `title`  | string  | required | Tab title                           |
| `active` | boolean | false    | Whether the tab is initially active |
| `icon`   | string  | null     | Optional icon for the tab           |

## Customization

### Styling

Most components accept styling attributes like `class`, `color`, and `size`:

```blade
<x-volt-button class="my-custom-class" color="red">
    Custom Button
</x-volt-button>
```

### Slots

Components that wrap content use Laravel's slot system:

```blade
<x-volt-card>
    <x-slot name="header">Card Title</x-slot>

    <p>Card content goes here</p>

    <x-slot name="footer">Card Footer</x-slot>
</x-volt-card>
```

### Attributes

Additional HTML attributes are passed through to the root element:

```blade
<x-volt-button id="submit-btn" data-action="save">
    Save
</x-volt-button>
```

## Best Practices

### Consistency

Use components consistently throughout your application to maintain a uniform look and feel.

### Accessibility

Laravolt components are designed with accessibility in mind, but you should ensure that your implementation follows accessibility best practices:

- Provide descriptive labels for buttons and links
- Use appropriate heading levels in cards and panels
- Ensure sufficient color contrast for text and background colors

### Performance

While components make development easier, excessive nesting of complex components can impact performance. Monitor your page load times and optimize where necessary.

## Related Documentation

- [Form Components](/v6/form) - Advanced form handling capabilities
- [Menu Components](/v6/menu) - Navigation menu components
- [Table Components](/v6/table) - Data table components

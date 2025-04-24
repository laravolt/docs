---
title: Action Button
description: Page-level action buttons for consistent UI
---

Action buttons are essential UI elements that allow users to perform primary actions on a page, such as creating new resources, editing content, or triggering workflows.

---

## Introduction

In Laravolt, Action Buttons are designed to provide consistent UI elements for primary actions across your application. They are typically placed in the header of pages and offer a standardized way to present actions to users.

## Basic Usage

The most common use case is adding action buttons to page headers. You can do this by using the `actions` slot in the `volt-app` component:

```html
<x-volt-app title="Posts">
  <x-slot name="actions">
    <x-volt-link-button
      url="{{ route('posts.create') }}"
      icon="plus"
      label="New Post"
    />
  </x-slot>
</x-volt-app>
```

This will render a "New Post" button with a plus icon in the header of your page, aligned to the right side.

## Button Types

Laravolt provides several button types to accommodate different kinds of actions:

### Link Button

Used for navigation to other pages:

```html
<x-volt-link-button
  url="{{ route('posts.create') }}"
  icon="plus"
  label="New Post"
/>
```

### Submit Button

Used for form submissions:

```html
<x-volt-submit-button icon="save" label="Save Post" />
```

### Button

A general-purpose button that can be used for various actions:

```html
<x-volt-button icon="refresh" label="Refresh Data" onclick="refreshData()" />
```

## Button Properties

All button types support the following properties:

### Icon

You can add icons to your buttons using Fomantic UI icon names:

```html
<x-volt-link-button
  url="{{ route('posts.create') }}"
  icon="plus"
  label="New Post"
/>
```

Laravolt supports all icons from the [Fomantic UI icon set](https://fomantic-ui.com/elements/icon.html).

### Label

The text to display on the button:

```html
<x-volt-link-button url="{{ route('posts.create') }}" label="New Post" />
```

You can also use the button without a label, displaying only the icon:

```html
<x-volt-link-button url="{{ route('posts.create') }}" icon="plus" />
```

### Color

You can change the color of the button using Fomantic UI color classes:

```html
<x-volt-link-button
  url="{{ route('posts.create') }}"
  icon="plus"
  label="New Post"
  class="blue"
/>
```

Available color options include: `primary`, `secondary`, `red`, `orange`, `yellow`, `olive`, `green`, `teal`, `blue`, `violet`, `purple`, `pink`, `brown`, `grey`, and `black`.

### Size

Control the size of the button:

```html
<x-volt-link-button
  url="{{ route('posts.create') }}"
  icon="plus"
  label="New Post"
  class="tiny"
/>
```

Available size options include: `mini`, `tiny`, `small`, `medium`, `large`, `big`, `huge`, and `massive`.

## Button Groups

You can group multiple buttons together for related actions:

```html
<x-volt-app title="Posts">
  <x-slot name="actions">
    <div class="ui buttons">
      <x-volt-link-button
        url="{{ route('posts.create') }}"
        icon="plus"
        label="New Post"
      />
      <x-volt-link-button
        url="{{ route('posts.import') }}"
        icon="upload"
        label="Import"
      />
      <x-volt-link-button
        url="{{ route('posts.export') }}"
        icon="download"
        label="Export"
      />
    </div>
  </x-slot>
</x-volt-app>
```

## Dropdown Action Button

For cases where you need to conserve space or group related actions, you can use a dropdown button:

```html
<x-volt-dropdown-button label="Actions" icon="settings">
  <a href="{{ route('posts.create') }}" class="item">
    <i class="plus icon"></i> New Post
  </a>
  <a href="{{ route('posts.import') }}" class="item">
    <i class="upload icon"></i> Import
  </a>
  <a href="{{ route('posts.export') }}" class="item">
    <i class="download icon"></i> Export
  </a>
</x-volt-dropdown-button>
```

## Confirmation Dialogs

For actions that need confirmation (like delete operations), you can add a confirmation dialog:

```html
<x-volt-link-button
  url="{{ route('posts.destroy', $post) }}"
  icon="trash"
  label="Delete"
  class="red"
  data-confirm="Are you sure you want to delete this post?"
/>
```

The `data-confirm` attribute will trigger a confirmation dialog when the button is clicked, asking the user to confirm before proceeding with the action.

## Disabled State

You can disable buttons when needed:

```html
<x-volt-link-button
  url="{{ route('posts.create') }}"
  icon="plus"
  label="New Post"
  class="disabled"
/>
```

## Responsive Considerations

On smaller screens, buttons with both icons and labels might take up too much space. You can use the `mobile-text` class to show only the icon on mobile devices:

```html
<x-volt-link-button
  url="{{ route('posts.create') }}"
  icon="plus"
  label="New Post"
  class="mobile-text"
/>
```

## Best Practices

1. **Consistent Placement**: Always place primary actions in the page header using the `actions` slot.
2. **Clear Labels**: Use clear, action-oriented labels for buttons (e.g., "Create Post" rather than "New").
3. **Meaningful Icons**: Choose icons that clearly represent the action being performed.
4. **Color Coding**: Use colors consistently across your application (e.g., red for destructive actions, green for confirming).
5. **Priority**: Order buttons by their importance, with the most important action first.

## Examples

### Basic Page with Create Action

```html
<x-volt-app title="Users">
  <x-slot name="actions">
    <x-volt-link-button
      url="{{ route('users.create') }}"
      icon="plus"
      label="Create User"
    />
  </x-slot>

  <!-- Page content here -->
</x-volt-app>
```

### Resource Detail Page with Edit and Delete Actions

```html
<x-volt-app title="User Details: {{ $user->name }}">
  <x-slot name="actions">
    <x-volt-link-button
      url="{{ route('users.edit', $user) }}"
      icon="edit"
      label="Edit"
    />

    <x-volt-link-button
      url="{{ route('users.destroy', $user) }}"
      icon="trash"
      label="Delete"
      class="red"
      data-confirm="Are you sure you want to delete this user? This action cannot be undone."
    />
  </x-slot>

  <!-- User details here -->
</x-volt-app>
```

### Form Page with Submit and Cancel Actions

```html
<x-volt-app title="Create New User">
  {!! form()->open()->route('users.store') !!}

  <!-- Form fields here -->

  <x-slot name="actions">
    <x-volt-submit-button icon="save" label="Save User" />

    <x-volt-link-button url="{{ route('users.index') }}" label="Cancel" />
  </x-slot>

  {!! form()->close() !!}
</x-volt-app>
```

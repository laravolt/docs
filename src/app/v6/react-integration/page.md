---
title: React Integration
description: Integrating React components within Laravolt applications
nextjs:
  metadata:
    title: React Integration with Laravolt
    description: Learn how to seamlessly integrate React components and applications within your Laravolt projects.
---

Modern web applications often benefit from the interactive UI capabilities of React. Laravolt makes it easy to integrate React components while maintaining the benefits of Laravel's server-side architecture.

---

## Overview

React is a popular JavaScript library for building interactive user interfaces, particularly for applications that require complex state management and dynamic content updates without page refreshes. Integrating React with Laravolt allows you to:

- Use React for specific interactive components while keeping the rest of your application in Laravel
- Gradually introduce React into existing Laravolt projects
- Leverage both React's frontend capabilities and Laravel's backend strengths

## Installation & Setup

Before integrating React with your Laravolt application, you need to install and configure the necessary dependencies.

### 1. Install Required Dependencies

Begin by installing React and related dependencies:

```bash
npm install react react-dom react-router-dom @babel/preset-react
```

### 2. Configure Babel for React

Update your `.babelrc` file or create one in your project root if it doesn't exist:

```json
{
  "presets": ["@babel/preset-env", "@babel/preset-react"]
}
```

### 3. Create React Entry Point

Create a new file `resources/js/react.js` to serve as the entry point for your React application:

```javascript
import ReactDOM from 'react-dom'
import React from 'react'
import ReactIndex from './react/ReactIndex'

ReactDOM.render(
  <React.StrictMode>
    <ReactIndex />
  </React.StrictMode>,
  document.getElementById('reactContainer'),
)
```

### 4. Configure Laravel Mix

Update your `webpack.mix.js` file to include React compilation:

```javascript
const mix = require('laravel-mix')

// Existing mix configuration
mix.js('resources/js/app.js', 'public/js')

// Add React configuration
mix.js('resources/js/react.js', 'public/js').react() // This ensures React components are properly compiled
```

## Folder Structure

Organize your React components using the following recommended structure:

```txt
resources/
├── js/
│   ├── react/
│   │   ├── components/
│   │   │   ├── Dashboard.js
│   │   │   ├── UserProfile.js
│   │   │   └── ...
│   │   ├── contexts/
│   │   │   ├── AuthContext.js
│   │   │   └── ...
│   │   ├── hooks/
│   │   │   ├── useData.js
│   │   │   └── ...
│   │   └── ReactIndex.js
│   └── react.js
```

This structure separates concerns and makes your React codebase easier to maintain as it grows.

## Creating React Components

Let's build a simple component that fetches and displays a quote of the day.

### Create a Component

Create a new file at `resources/js/react/components/QuoteOfTheDay.js`:

```jsx
import React, { useState, useEffect } from 'react'
import axios from 'axios'

const QuoteOfTheDay = () => {
  const [quote, setQuote] = useState('')
  const [author, setAuthor] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setIsLoading(true)
    axios
      .get('https://quotes.rest/qod')
      .then((response) => {
        const quoteData = response.data.contents.quotes[0]
        setQuote(quoteData.quote)
        setAuthor(quoteData.author)
        setIsLoading(false)
      })
      .catch((err) => {
        setError('Failed to load quote')
        setIsLoading(false)
        console.error(err)
      })
  }, [])

  if (isLoading) {
    return <div className="ui segment loading">Loading...</div>
  }

  if (error) {
    return <div className="ui negative message">{error}</div>
  }

  return (
    <div className="ui segment">
      <div className="ui large header">Quote of the Day</div>
      <blockquote>
        <p>{quote}</p>
        <footer>
          — <cite>{author}</cite>
        </footer>
      </blockquote>
    </div>
  )
}

export default QuoteOfTheDay
```

### Set Up Routing

Create `resources/js/react/ReactIndex.js` to handle React-side routing:

```jsx
import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import QuoteOfTheDay from './components/QuoteOfTheDay'

// Import other components
// import Dashboard from './components/Dashboard';
// import UserProfile from './components/UserProfile';

const ReactIndex = () => {
  return (
    <Router>
      <Routes>
        <Route path="/integration/react" element={<QuoteOfTheDay />} />
        {/* Add more routes as needed */}
        {/* <Route path="/dashboard/react" element={<Dashboard />} /> */}
        {/* <Route path="/profile/react" element={<UserProfile />} /> */}
      </Routes>
    </Router>
  )
}

export default ReactIndex
```

## Integrating with Laravolt Views

Create a Blade view to render your React component:

```blade
<x-volt-app title="React Integration Example">
    <div id="reactContainer"></div>

    @push('script')
        <script src="{{ asset('js/react.js') }}" defer></script>
    @endpush
</x-volt-app>
```

## Laravel Routes

Define a route in your `routes/web.php` file:

```php
Route::get('/integration/react', function () {
    return view('integration.react');
})->name('integration.react');
```

Make sure to create the view at `resources/views/integration/react.blade.php`.

## Compiling Assets

Compile your assets using Laravel Mix:

```bash
# For development
npm run dev

# For production
npm run production
```

## Advanced Integration Techniques

### API Endpoints for React

Create dedicated API endpoints for your React components:

```php
// routes/api.php
Route::get('/quotes', [QuoteController::class, 'index']);
Route::get('/quotes/{id}', [QuoteController::class, 'show']);
```

Then consume these endpoints in your React components:

```jsx
// In your React component
useEffect(() => {
  axios.get('/api/quotes').then((response) => {
    setQuotes(response.data)
  })
}, [])
```

### Sharing Authentication

To share authentication between Laravel and React:

1. Create an endpoint to check authentication status:

```php
// routes/api.php
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
```

2. Configure Sanctum in your React setup:

```jsx
// resources/js/react.js
import axios from 'axios'

// Set CSRF token for all requests
axios.defaults.headers.common['X-CSRF-TOKEN'] = document
  .querySelector('meta[name="csrf-token"]')
  .getAttribute('content')
axios.defaults.withCredentials = true
```

### Passing Data from Laravel to React

You can pass initial data from Laravel to React using a global window object:

```blade
<x-volt-app title="React Integration Example">
    <div id="reactContainer"></div>

    <script>
        window.laravoltData = {
            user: @json(auth()->user()),
            permissions: @json($permissions),
            // Other data...
        };
    </script>

    @push('script')
        <script src="{{ asset('js/react.js') }}" defer></script>
    @endpush
</x-volt-app>
```

Then access this data in your React components:

```jsx
const { user, permissions } = window.laravoltData || {}
```

## Best Practices

### 1. Component Granularity

Break down your UI into small, reusable React components rather than creating large monolithic components.

### 2. State Management

For simple applications, React's built-in state and context API are sufficient. For complex applications, consider:

- Redux for global state management
- React Query for data fetching and caching

### 3. Error Boundaries

Implement error boundaries to prevent a single component's failure from breaking your entire application:

```jsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>
    }

    return this.props.children
  }
}
```

## Troubleshooting

### React Components Not Rendering

**Issue**: The React container appears empty with no errors in the browser console.

**Solutions**:

- Ensure your React container ID matches between the Blade view and JS code
- Check browser console for JavaScript errors
- Verify the React script is loaded after the container element

### Routing Issues

**Issue**: React Router doesn't recognize routes or shows 404 errors.

**Solutions**:

- Make sure Laravel routes don't conflict with React routes
- Consider using a prefix for all React routes (e.g., `/react/*`)
- Use HashRouter instead of BrowserRouter if you're experiencing issues with direct URL access

### API Communication Problems

**Issue**: React components can't fetch data from Laravel API endpoints.

**Solutions**:

- Check for CORS issues if API is on a different domain
- Verify CSRF token is properly included in requests
- Confirm authentication is properly set up (if endpoints require authentication)

## Related Documentation

- [Laravel Mix Configuration](/v6/frontend-assets)
- [API Development](/v6/api-development)
- [Authentication Guide](/v6/authentication)

# React Router Crash Course Project

A beginner-friendly React application built to practice routing, layout composition, nested routes, dynamic URL parameters, and data loading with React Router. The project uses Vite and Tailwind CSS to create a simple multi-page experience with reusable navigation and footer sections.

## Overview

This demonstrates core React Router concepts in a small, easy-to-follow app:

- Route setup with `createBrowserRouter` and `createRoutesFromElements`
- Shared layout using `Header`, `Outlet`, and `Footer`
- Static pages such as Home and About
- Dynamic routing using `:userid`
- Data fetching with a route loader and `useLoaderData`
- Active navigation styling with `NavLink`
- Fallback route for missing pages

The app is designed as a learning project for understanding how routing works in React.

## Tech Stack

- React 19
- React Router DOM 7
- Vite
- Tailwind CSS
- ESLint


### Shared layout
`Layout.jsx` renders the app shell and keeps the header and footer visible across route changes:

```jsx
<Header />
<Outlet />
<Footer />
```

This pattern makes the app feel like a consistent single-page experience while still using actual route-based page rendering.


### User page and dynamic routes
The `User` component reads the route parameter with `useParams()`:

```jsx
const { userid } = useParams()
```

This allows dynamic URLs such as:

- `/user`
- `/user/123`
- `/user/jane`

The route is defined in `main.jsx` with:


### GitHub profile loader
The `Github` page demonstrates route loaders in React Router.

The loader in `Github.jsx` fetches public GitHub profile data

Then the component uses `useLoaderData()` to access the data:

This is a practical example of loading remote data before the route renders.

### Not found page
The router includes a catch-all fallback:

```jsx
<Route path='*' element={<div>Not Found</div>} />
```

This handles unknown paths gracefully.

## Learning Outcomes

- how to set up React Router in a Vite app
- how to create reusable layouts
- how `Outlet` works for nested route rendering
- how dynamic segments work in route paths
- how data loaders fetch API data before component render
- how `NavLink` creates a better navigation experience

## Notes

This is a course-style project and is intentionally simple. It focuses more on learning the fundamentals of routing than on production-grade app architecture. Some nav items are placeholder-like and may not map to fully implemented pages, which is common in beginner exercises.

## License

This project is for educational purposes and is not configured with a formal package license.

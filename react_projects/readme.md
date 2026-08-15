# React Projects Collection

This folder contains a set of small React learning projects built with Vite. Each app focuses on a different concept in React and frontend development, making it a good practice space for learning state, routing, APIs, styling, and component patterns.

## Included Projects

### 1. Counter
A beginner-level app demonstrating React state management.
- Increments and decrements a counter value
- Uses `useState` to update UI
- Simple introduction to event handlers and React re-rendering

### 2. Custom React
A lightweight experiment showing how a React-like render process works behind the scenes.
- Creates a custom `customRender` function
- Renders a simple DOM element from a React element object
- Good for understanding how virtual elements map to actual DOM nodes

### 3. Currency Converter
A practical app that converts values from one currency to another.
- Input amount selection
- Source and target currency dropdowns
- Swap button to reverse conversion direction
- Uses live currency exchange data from a public API
- Built with reusable form components and custom hook logic

### 4. Password Generator
A utility app for generating secure passwords.
- Adjustable password length
- Optional numeric characters
- Optional special characters
- Copy-to-clipboard feature
- Re-renders based on settings using `useMemo`-style patterns and effects

### 5. React Router
A routing-focused app using `react-router-dom`.
- Navigation with `NavLink` and `Link`
- Layout with shared header/footer
- Nested and dynamic routes
- Loader-based data fetching for GitHub profile info
- Example of route-driven UI architecture

### 6. React Tailwind Props
A small styling exercise showing how Tailwind classes and state can be used together.
- Background color switching buttons
- Reusable button styling patterns
- Example of dynamic inline styling with Tailwind-based layout

## Tech Stack

- React
- Vite
- JavaScript
- Tailwind CSS (in some apps)
- React Router DOM
- Fetch API for live data

## How to Run a Project

Each project is a separate Vite app with its own `package.json` and dependencies.

1. Open any project directory, for example:
   ```bash
   cd react_projects/currency_converter
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the app:
   ```bash
   npm run dev
   ```
4. Open the local URL shown in the terminal.

## Learning Focus

This collection is a great introduction to:
- React fundamentals
- state and props
- hooks such as `useState`, `useEffect`, and custom hooks
- component reuse
- form handling
- API fetching
- routing
- styling with Tailwind CSS


## Notes

These are learning-focused apps, not production-ready systems. They are designed to demonstrate core React patterns in a simple and approachable way.


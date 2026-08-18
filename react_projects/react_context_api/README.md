# React Context API 

This project is a simple learning app built to demonstrate how React Context works. It focuses on sharing state between components without passing props manually through every level of the component tree.

This app is intentionally small and educational, designed to show the core idea behind the Context API in a clear, beginner-friendly way.

## What This App Demonstrates

The app contains a login form and a profile section:
- the login form collects a username and password,
- the entered user data is stored in a shared context,
- the profile component reads that shared data and displays it,
- if no user is available, the profile shows a prompt to log in.

This demonstrates the main benefit of Context API:
- data can be accessed by components anywhere within the provider tree,
- child components do not need prop drilling.

## Core Concept Used

The app uses:
- `React.createContext()` to create a shared context object,
- a `UserContextProvider` to hold the state,
- `useContext()` to access that state from components.


## How It Works

### 1. Creating the context
In `src/context/UserContext.js`:

This creates a context object that can hold shared data for all components inside its provider.

### 2. Providing the state
In `src/context/UserContextProvider.jsx`:

The provider wraps the application section that needs access to the user state. It stores the current user and exposes a setter function.

### 3. Updating the user from the login form
In `src/components/Login.jsx`:

When the user submits the form, the shared state is updated.

### 4. Reading the user in the profile component
In `src/components/Profile.jsx`:

The profile component reads the current user and renders the username if available.

## App Flow

1. The app renders `Login` and `Profile` inside `UserContextProvider`.
2. The login form captures values for username and password.
3. The submit handler updates the shared user state.
4. The profile component automatically re-renders with the latest context value.
5. If no user is set, the app shows a login prompt.


## Learning Purpose

This project is designed to help understand:
- how Context API works in React,
- when to use global state sharing,
- how to avoid repeated prop drilling,
- how providers and consumers interact,
- how state updates can flow across unrelated components.

## Notes

This is not a production-authentication app. It is only a basic example of context-based state sharing for learning and demonstration.

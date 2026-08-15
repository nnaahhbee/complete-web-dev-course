# Password Generator

React + Vite app that generates strong, random passwords based on user-selected length and character preferences. The project is designed as a simple, interactive front-end utility for quickly creating secure passwords without a backend or database.

## Features

- Adjustable password length with a range slider
- Optional inclusion of numbers
- Optional inclusion of special characters
- Live password generation as settings change
- One-click copy to clipboard
- Client-side generation only, making it fast and easy to run locally

## Tech Stack

- React 19
- Vite
- Tailwind CSS
- JavaScript (ES modules)

## Project Overview

The main password generation logic is handled in [src/App.jsx](src/App.jsx). The app maintains state for:

- password length
- whether numbers are allowed
- whether special characters are allowed
- the current generated password

It then rebuilds the password whenever these settings change.

## How the App Works

The app starts by defining a base character pool of uppercase and lowercase letters:

- A-Z
- a-z

If the "Numbers" option is enabled, numeric characters are appended to the pool.
If the "Characters" option is enabled, a set of special symbols are appended as well.

A random character is selected repeatedly until the desired password length is reached. The generated value is stored in React state and displayed in a read-only input field.

The copy button uses the browser clipboard API to copy the password text to the user’s clipboard.

### State and logic

- `useState` stores the selected length, toggles, and generated password
- `useCallback` memoizes the password generation function so it can be reused efficiently
- `useEffect` triggers password regeneration whenever user settings change
- `useRef` keeps a reference to the input field, which allows text selection when copying


### Clipboard behavior

The app calls:

- `window.navigator.clipboard.writeText(password)`

This lets users copy the generated password in one click without extra dependencies or backend code.


### Prerequisites

- Node.js 18+ recommended
- npm or another package manager

### Install dependencies

```bash
npm install
```

### Run the app in development mode

```bash
npm run dev
```

Then open the local Vite URL shown in the terminal.

### Build for production

```bash
npm run build
```

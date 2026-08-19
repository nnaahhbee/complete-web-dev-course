# Theme Switcher

A React + Vite project that demonstrates how to build a light/dark theme toggle using React state, context, and Tailwind CSS dark mode utilities.

This project is intended for learning purposes only. It is designed to help beginners understand:

- React component structure
- Context API for shared app state
- Theme toggling with state updates
- Tailwind CSS dark mode classes
- DOM class manipulation with `useEffect`

## Project Purpose

The app displays a product card and a toggle switch that lets the user switch between light and dark themes. The selected theme is stored in React state and applied to the root HTML element so that all dark-mode styles update globally.

## Tech Stack

- React
- Vite
- Tailwind CSS
- JavaScript


## How It Works

### 1. Theme state is managed in `App.jsx`

The app stores the current theme value in a React state variable:

```jsx
const [themeMode, setThemeMode] = useState("light")
```

Two helper functions update the theme:

```jsx
const darkTheme = () => setThemeMode("dark")
const lightTheme = () => setThemeMode("light")
```

### 2. The HTML element receives a theme class

A `useEffect` runs whenever `themeMode` changes:

```jsx
useEffect(() => {
  document.querySelector('html').classList.remove("light", "dark")
  document.querySelector('html').classList.add(themeMode)
}, [themeMode])
```

This means the root element toggles between classes such as:

- `light`
- `dark`

### 3. Theme data is shared through context

The project uses a custom context object defined in `src/context/Theme.js`:

```js
export const ThemeContext = createContext({
  themeMode: "light",
  darkTheme: () => {},
  lightTheme: () => {},
})
```

This allows components like `ThemeBtn` to access theme-related functions without prop drilling.

### 4. Toggle button updates theme state

The theme toggle component checks whether the checkbox is selected:

```jsx
const onChangeBtn = (e) => {
  const darkModeStatus = e.currentTarget.checked
  if (darkModeStatus) {
    darkTheme()
  } else {
    lightTheme()
  }
}
```

### 5. Tailwind dark variants respond to the class

Tailwind classes such as `dark:bg-gray-800` and `dark:text-white` react when the parent/root element includes the `dark` class.


## Notes

This app is intentionally small and focused. It is a learning project meant to demonstrate how theme switching can be implemented in a React app using simple patterns that are easy to understand.


## Educational Use Only

This project is created solely for educational purposes. It is not intended for production deployment, commercial use, or as a finalized product template.


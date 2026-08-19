import {createContext, useContext} from 'react';

// Step 1: Create a context - Create a custom hook to use the ThemeContext
export const ThemeContext = createContext({
    themeMode: "light",
    darkTheme: () => {},
    lightTheme: () => {},
});


//Step 2: Make sure every components is aware of the context - Create a ThemeProvider component to wrap the application and provide the theme context. Making everyone aware of the theme context and its values.
export const ThemeProvider = ThemeContext.Provider;


//If any component want to use the state, use the useTheme custom hook to access the ThemeContext. Every components can directly use this store.
export default function useTheme() {
    return useContext(ThemeContext);
}
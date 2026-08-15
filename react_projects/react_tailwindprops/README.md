# React Tailwind Background Changer (Learning Project)

A minimal learning project that demonstrates how to build a small React app with Tailwind CSS and Vite. The app provides a simple UI to change the page background color using React state and Tailwind utility classes.

> This project is for learning purposes only.

## Features

- Interactive background color changer controlled by React state (useState).

## Tech stack

- React (functional components + hooks)
- Vite (dev server + build tool)
- Tailwind CSS (utility-first styling)

## Extending & exercises (for learners)

Try the following exercises to learn more:

1. Add more color buttons and label them with custom hex values.
2. Replace inline style usage with CSS custom properties (set a --bg CSS variable on the root and update it from React).
3. Persist the selected color in localStorage so the choice remains after a refresh.
4. Make the control bar keyboard-accessible: allow changing colors with left/right arrow keys and Enter to apply.
5. Animate background transitions with CSS transitions or by integrating Tailwind's transition utilities.
6. Extract the control bar into a reusable component that accepts a list of colors via props, e.g., <ColorBar colors={[...]} onChange={...} />.
7. Add accessibility: add aria-labels to buttons and ensure sufficient contrast for button text.

## Possible improvements

- Use a color picker input to allow arbitrary colors rather than a fixed set of buttons.
- Add light/dark mode toggling that updates the page semantics and accessible contrast.
- Use a CSS-in-JS library or Tailwind plugin to style dynamic colors if needed for a larger project.

# Currency Converter

A React currency converter built for learning purposes. This app demonstrates how to combine React state management, reusable UI components, custom hooks, and API-backed data fetching to build a practical frontend feature.

It allows a user to:
- enter an amount in one currency,
- choose a source and target currency,
- convert the value instantly,
- swap the currencies with a single click,

## Features

- Currency selection for both source and target currencies
- Numeric input for the amount to convert
- Real-time conversion using live exchange-rate data
- Swap button to reverse the conversion direction

## Tech Stack

- React 19
- Vite
- JavaScript
- Tailwind CSS
- Fetch API for currency data
- JSDelivr currency API

## How It Works

The app uses a custom hook, `useCurrencyInfo`, to fetch exchange-rate data for the selected source currency from the public currency API:

https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${currency}.json


## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open the local URL shown by Vite in the terminal (usually `http://localhost:5173`).


## Notes

- This app fetches currency conversion information from a public API and is suitable for demos and learning.
- It does not include advanced production features such as:
  - error handling for failed API requests,
  - loading indicators,
  - rate caching,
  - historical exchange data,
  - robust validation,
  - user authentication or payment features.

## Learning Goals

This project is useful for understanding:
- React state and event handling,
- custom hooks,
- reusable component design,
- API integration in frontend apps,
- form-driven UI development,
- prop passing and controlled inputs,
- styling with Tailwind CSS.

## License

This project is intended for educational use and is not configured as a production application or commercial package.

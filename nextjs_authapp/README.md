# Next.js Authentication Learning Project

This project is a small learning app built with Next.js to practice the fundamentals of authentication, API routes, cookies, JWT, MongoDB, and email verification.

Important note:
- This project is created for learning purposes only.
- The main goal is to understand how Next.js works in practice, not to build a polished production UI.
- The user interface is intentionally simple and minimal because the focus is on backend logic and app flow.

## Project purpose

The app demonstrates a basic authentication flow:
- user signup
- email verification
- login
- JWT token creation and storage in cookies
- fetching user data from a protected route
- logout

This is a good beginner project for learning:
- Next.js App Router
- Route handlers under app/api
- client-side forms with React state
- server-side authentication logic
- MongoDB with Mongoose
- password hashing with bcryptjs
- JSON Web Tokens (JWT)
- sending emails with Nodemailer and Mailtrap

## Tech stack

- Next.js
- React
- TypeScript
- MongoDB + Mongoose
- JWT (jsonwebtoken)
- bcryptjs
- Nodemailer
- Axios
- React Hot Toast

## Current features

- Signup page
- Login page
- Profile page
- Logout route
- Email verification flow
- Token-based auth using cookies
- User model with mongoose schema


## Environment variables

Create a `.env` file in the project root with values like this:

```env
MONGO_URI=mongodb://localhost:27017/nextjs_authapp
TOKEN_SECRET=your_super_secret_key
NODEMAILER_USER=your_mailtrap_username
NODEMAILER_PASS=your_mailtrap_password
DOMAIN=http://localhost:3000
```

Notes:
- `MONGO_URI` connects the app to your MongoDB database.
- `TOKEN_SECRET` is used to sign and verify JWTs.
- `NODEMAILER_USER` and `NODEMAILER_PASS` are for Mailtrap in development.
- `DOMAIN` is used in verification/reset email links.

## Installation

```bash
npm install
```

## Run the project

```bash
npm run dev
```

Then open:

```bash
http://localhost:3000
```

## Notes

- This app is intentionally simple and not designed as a polished SaaS UI.
- Some code may be written in a beginner-friendly way rather than in a production-optimized way.
- The goal is understanding the flow, not perfect styling or enterprise architecture.
- Features like forgot password, password reset pages, and advanced UX improvements can be added later as practice.

## License

This project is for learning and experimentation only."# nextjs_authapp" 

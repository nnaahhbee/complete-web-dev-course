# RiverFlow Q&A

RiverFlow is a learning project for building a developer question-and-answer
site inspired by Stack Overflow. Users can ask questions, attach images, browse
questions, and participate through answers, comments, and votes.

This project was built to practice the technologies listed below. It is not a
finished product, has not been hardened for production.

## What the project includes

- A homepage with an animated hero, latest questions, and a contributor panel.
- Question browsing with search, tags, and pagination.
- A question form with a title, Markdown content, tags, and an image attachment
  (the current create flow requires an image).
- Question detail pages with answers, comments, and voting.
- User profile pages with question, answer, and vote sections.
- Appwrite-backed account, database, and file-storage integrations.

Some pages and behaviors may still be incomplete or changing as part of the
learning process.

## Technology stack

- **Next.js 16 App Router** and **React 19** for routes and UI.
- **TypeScript** for static type checking.
- **Tailwind CSS 4** for styling.
- **Appwrite** for account authentication, database documents, and image storage.
- **Zustand** for client-side authentication state.
- **MagicUI** and other UI libraries for animations and icons.

## How the app is structured

- `src/app/` contains App Router pages, layouts, and API route handlers.
- `src/components/` contains reusable forms, question cards, and interactive UI.
- `src/models/` contains Appwrite client/server configuration, collection setup,
  and resource names.
- `src/store/Auth.ts` contains the shared authentication state and actions.
- `src/proxy.ts` checks or initializes the Appwrite database and image bucket
  for matched page requests.

The question form uses the Appwrite client SDK to upload an attachment and save
a question document. Server-rendered pages use the Appwrite server SDK to load
data. The answer and vote interactions also have route handlers under
`src/app/api/`.

### Data model

The application uses an Appwrite database named `main-stackoverflow` and these
collections:

| Collection or bucket | Purpose |
| --- | --- |
| `questions` | Question title, content, author ID, tags, and attachment ID |
| `answers` | Answer content, question ID, and author ID |
| `comments` | Comment content and the ID/type of the question or answer it belongs to |
| `votes` | Vote type, target ID, upvote/downvote status, and voter ID |
| `question-attachment` bucket | Uploaded question images |

The question form stores the uploaded image in the storage bucket and saves its
file ID in the question document. Answers and comments refer to related records
using IDs rather than embedding the full records.

## Getting started

### Prerequisites

- Node.js compatible with the installed Next.js version.
- npm.
- An Appwrite project.

### 1. Install dependencies

From this project's directory:

```bash
npm install
```

### 2. Configure Appwrite

Create or select an Appwrite project and note its API endpoint and project ID.
Add your local development URL (usually `http://localhost:3000`) to the
project's allowed web platforms so the browser SDK can connect.

Create a server API key with only the permissions the project needs for account
lookup, database/collection management, and storage management. Keep this key
private; do not put it in client-side code or commit it.

### 3. Add local environment variables

Create a `.env.local` file in the project root (the same directory as
`package.json`):

```dotenv
NEXT_PUBLIC_APPWRITE_HOST_URL=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your-appwrite-project-id
APPWRITE_API_KEY=your-server-api-key
```

Use the endpoint shown for your Appwrite installation if it differs from the
Cloud endpoint above. The `NEXT_PUBLIC_` variables are intentionally available
to the browser; `APPWRITE_API_KEY` must remain server-only. Do not commit
`.env.local` or share its values.

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. Stop the
server with `Ctrl+C`.

On matched page requests, `src/proxy.ts` calls the setup helpers. The first
successful initialization creates the database, collections, and attachment
bucket; subsequent requests check that they exist. The Appwrite API key must
have sufficient permissions for this setup to succeed. If setup fails, check
the server terminal and your Appwrite project configuration.

## Available scripts

```bash
npm run dev     # Start the local development server
npm run lint    # Run ESLint
npm run build   # Create a production build
npm run start   # Serve a previously built app
```

## System-design-style guide to building a similar project

Use this sequence as a learning roadmap. It starts with system behavior and
data boundaries before moving into implementation.

### 1. Define the requirements

Write down the core user journeys before choosing components:

- A visitor browses and searches questions.
- A signed-in user asks a question and includes the image required by the current form.
- Users answer questions, comment, and vote.
- Users can view their own activity and reputation.

Separate functional requirements (what users can do) from non-functional
requirements (security, reliability, performance, accessibility, and mobile
support). For a real service, decide requirements such as moderation, abuse
prevention, rate limits, backups, and expected traffic early.

### 2. Identify the main entities and relationships

Start with a small data model:

- A user authors many questions, answers, and comments.
- A question has many answers and comments.
- An answer belongs to one question and can have comments.
- A vote belongs to one user and targets either a question or an answer.
- A question can refer to an uploaded attachment.

Choose which data belongs in each record and which relationships should be
stored as IDs. Define required fields, allowed values, ownership, and deletion
behavior before creating collections.

### 3. Decide the authorization rules

Make a permission table before writing the UI. For example:

| Action | Visitor | Signed-in user | Resource owner |
| --- | --- | --- | --- |
| Read public questions | Yes | Yes | Yes |
| Create a question or answer | No | Yes | Yes |
| Edit or delete a question | No | No | Yes |
| Vote or comment | No | Yes | Yes |

Enforce authorization on the server or in Appwrite permissions. Hiding a button
in React is not a security boundary.

### 4. Choose the app architecture

Assign responsibilities to each layer:

- App Router pages compose routes and render server-loaded data.
- Client components handle browser interactions such as forms and voting.
- API routes perform operations that need trusted server-side logic.
- Appwrite stores accounts, records, and uploaded files.
- A shared client store can hold session state, but must not be treated as the
  authority for permissions.

Keep secret API keys on the server. Avoid importing server configuration into
client components.

### 5. Define the Appwrite schema and indexes

Create the database, collections, attributes, and permissions from the data
model. Add indexes for fields used in filters, sorting, and search—for example,
question author, creation time, question ID, voter ID, and vote target. Confirm
Appwrite's index and full-text search requirements for your chosen queries.

For production, prefer explicit, repeatable migrations over creating or
modifying schema as a side effect of ordinary page requests.

### 6. Build the vertical slices in dependency order

Implement one complete user journey at a time:

1. Connect to Appwrite and verify configuration.
2. Add account registration, login, logout, and session restoration.
3. Create and browse questions.
4. Add question detail pages and image upload.
5. Add answers, then comments.
6. Add voting and reputation updates.
7. Add user profiles and activity views.
8. Add search, filters, pagination, and visual polish.

For each slice, build the data operation, validation, permission checks,
loading/error states, and UI together.

### 7. Plan for correctness and failure

Validate inputs on the server, prevent duplicate votes, handle missing or
deleted related records, and make multi-step operations consistent. For example,
uploading an image and creating a question are two separate operations; decide
how to clean up an uploaded file if saving the question fails.

Return useful error messages without exposing secrets or internal stack traces.
Add tests for authorization, invalid input, and important database operations.

### 8. Verify before deployment

Run linting, type checks, and tests; manually try each journey as a visitor and
as a signed-in user. Check responsive layouts and failure states. Before a real
deployment, review secret handling, Appwrite permissions, rate limiting,
moderation, observability, backups, and data-retention requirements.

## Learning-project limitations

- This is a course/practice project, not a production-ready Stack Overflow
  replacement.
- The data model and permissions are intentionally small and may need changes
  for stronger authorization, moderation, or scale.
- Appwrite initialization currently happens through the request proxy, which is
  convenient for learning but is not a substitute for a controlled migration
  process.
- Review authentication, authorization, error handling, validation, and secret
  management before exposing a deployment to the public.


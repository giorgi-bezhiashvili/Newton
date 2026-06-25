# Newton

An interactive physics learning platform — frontend built with **React**, **TypeScript**, and **Vite**. Newton turns physics topics (from classical mechanics to modern theory) into clear, organized lessons, browsable by topic and grade level. Fully localized in Georgian.

> 🚧 **Frontend only.** This repo contains the client application. It expects a REST API (see [Backend Integration](#backend-integration) below) to serve lesson/formula data.

---

## Features

- **Dynamic resource pages** — a single route (`/:param`) fetches and renders cards for any topic (e.g. `/formulas`) from the backend API
- **Client-side routing** with React Router, including a 404 fallback
- **Code-split routes** — pages are lazy-loaded with `React.lazy` and `Suspense` for faster initial load
- **Responsive navigation** with an animated hamburger menu
- **Landing page** with hero section, embedded video, and informational content about the platform
- **Georgian-language UI** throughout

---

## Tech Stack

| Layer | Technology |
|---|---|
| Library | React 19 |
| Language | TypeScript |
| Build tool | Vite |
| Routing | React Router DOM 7 |
| Linting | ESLint + typescript-eslint |
| CI | [React Doctor](https://www.react.doctor/) (GitHub Action — scans PRs and `main` for security, performance, and architecture issues) |

---

## Project Structure

```
newton/
├── src/
│   ├── main.tsx              # App entry point (StrictMode + root render)
│   ├── App.tsx                # Router setup, lazy-loaded routes, 404 handling
│   ├── mainPage.tsx           # Landing page composition (Header + Middle + Footer)
│   ├── spage.tsx               # Dynamic resource page — fetches cards by :param from the API
│   ├── types.ts                # Shared TypeScript types (CardData)
│   ├── index.css               # Global styles
│   ├── assets/                 # Static assets (logo, images)
│   └── components/
│       ├── header.tsx          # Site header with responsive nav menu
│       ├── middle.tsx          # Landing page hero + content sections
│       └── footer.tsx          # Site footer
├── .github/workflows/
│   └── react-doctor.yml        # CI: automated codebase health scan
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- A running instance of the Newton backend API (or any API matching the contract below)

### Installation

```bash
git clone https://github.com/giorgi-bezhiashvili/Newton.git
cd Newton
npm install
```

### Run in development

```bash
npm run dev
```

The app starts on `http://localhost:5173` by default (Vite's default port).

### Build for production

```bash
npm run build
npm run preview
```

### Lint

```bash
npm run lint
```

---

## Backend Integration

Resource pages (`/:param`, e.g. `/formulas`) call the API directly at `http://localhost:3000/api/:param` and expect a JSON array of cards shaped like:

```ts
interface CardData {
  _id?: string;
  topic: string;
  equation: string | string[];
  grade: number;
}
```

> **Note:** the API base URL is currently hardcoded for local development. A Vite dev proxy for `/api` → `http://localhost:3000` is already configured in `vite.config.ts` if you'd rather route requests through it — update the `fetch` call in `spage.tsx` to use a relative `/api/:param` path to take advantage of it (and to make the build environment-portable).

---

## Roadmap

- [ ] Move the hardcoded API URL to an environment variable
- [ ] Add loading and error states to resource pages
- [ ] Expand routing beyond the single dynamic `/:param` pattern
- [ ] Add tests

---

## License

ISC

---

Developer: [Giorgi Bezhiashvili](https://linktr.ee/giorgibezhiashvili)

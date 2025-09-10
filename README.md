# React + Vite SSR (Express + React Router v7)

<div align="start">

Production-ready Server-Side Rendering setup for React using Vite, Express, and React Router v7

[ Quick Start](#quick-start)  
[ Documentation](#documentation)  
[ Features](#what-you-get)  
[ Deploy](#vercel-deployment)

</div>

---

## What You Get

| Feature | Description |
|---------|-------------|
| React 19 + Router v7 | Latest React with React Router v7 for client + server rendering |
| Vite Dev Server | Lightning-fast development with HMR in middleware mode |
| Express SSR | Production-ready Express server for dev and production |
| Optimized Build | Separate client (`dist/client`) and server (`dist/server`) bundles |
| Vercel Ready | Serverless deployment with proper routing configuration |
| Fast Setup | Copy-paste templates to add SSR to any React + Vite project |

---

## Quick Start

### Prerequisites
- **Node.js** 20.x or newer (React Router v7 requirement)
- **npm** 9+ (or pnpm/yarn equivalent)

### Installation & Development
```bash
# Clone and install
git clone <your-repo-url>
cd react-vite-ssr
npm install

# Start development server
npm run dev

# Open http://localhost:5173
```

### Production Build
```bash
# Build for production
npm run build

# Run production server locally
NODE_ENV=production node server
```

---

## Project Structure

```
├── index.html              # HTML shell (dev template)
├── server.js               # Express app with SSR
├── vite.config.js          # Vite configuration
├── vercel.json             # Vercel deployment config
├── src/
│   ├── App.jsx             # React app and routes
│   ├── entry-client.tsx    # Client hydration entry
│   └── entry-server.tsx    # Server rendering entry
├── api/
│   └── index.js            # Vercel serverless function
└── dist/                   # Build output (generated)
    ├── client/             # Static assets
    └── server/             # SSR bundle
```

---

## How SSR Works

```mermaid
graph TD
    A[Request hits Express] --> B{Environment?}
    B -->|Development| C[Vite transforms index.html<br/>Loads entry-server.tsx via SSR]
    B -->|Production| D[Read index.html from dist/client<br/>Import SSR bundle from dist/server]
    C --> E[render(url) returns { html }]
    D --> E
    E --> F[Inject HTML into template<br/>Send to browser]
    F --> G[Client hydrates using hydrateRoot]
```

---

## Configuration Files

<details>
<summary><strong>package.json</strong></summary>

```json
{
  "name": "react-vite-ssr",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "node server",
    "build": "npm run build:client && npm run build:server",
    "build:client": "vite build --outDir dist/client",
    "build:server": "vite build --ssr src/entry-server.tsx --outDir dist/server",
    "preview": "vite preview"
  },
  "dependencies": {
    "compression": "^1.7.4",
    "express": "^5.1.0",
    "react": "^19.1.1",
    "react-dom": "^19.1.1",
    "react-router": "^7.8.2",
    "react-router-dom": "^7.8.2",
    "sirv": "^2.0.4"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^5.0.2",
    "vite": "^7.1.5"
  }
}
```
</details>

<details>
<summary><strong>vite.config.js</strong></summary>

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  ssr: {
    // Bundle these so the SSR output is self-contained
    noExternal: ["react", "react-dom", "react-router", "react-router-dom"]
  }
});
```
</details>

<details>
<summary><strong>index.html</strong></summary>

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite + React SSR</title>
  </head>
  <body>
    <div id="root"><!--app-html--></div>
    <script type="module" src="/src/entry-client.tsx"></script>
  </body>
</html>
```
</details>

---

## Entry Points

### Client Entry (`src/entry-client.tsx`)
```tsx
import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./App";

hydrateRoot(
  document.getElementById("root")!,
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
```

### Server Entry (`src/entry-server.tsx`)
```tsx
import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router";
import App from "./App";

export function render(url: string) {
  const html = renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </StrictMode>
  );
  return { html };
}
```

---

## Vercel Deployment

### Setup Files

<details>
<summary><strong>vercel.json</strong></summary>

```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "routes": [
    { "src": "/(.*)", "dest": "/api/index" }
  ],
  "functions": {
    "api/**/*.js": { "includeFiles": "dist/**" }
  }
}
```
</details>

<details>
<summary><strong>api/index.js</strong></summary>

```js
export { default } from "../server.js";
```
</details>

### Deployment Steps
1. Connect Repository to Vercel
2. Set Node Version to 20.x in Project Settings → Functions
3. Deploy - Vercel will run `npm run build` automatically

---

## Important Notes

> React Router v7 Changes
> - Server imports: Use `react-router` (not `react-router-dom/server`)
> - `StaticRouter` and `BrowserRouter` come from different packages

> Express v5 Compatibility  
> - Use pathless middleware `app.use((req, res) => {...})` instead of `app.get('*', ...)`

> Vite SSR Bundling
> - Add all React packages to `ssr.noExternal` for self-contained server bundle

---

## Adding SSR to Existing Project

1. Install Dependencies
   ```bash
   npm install express compression sirv react-router react-router-dom
   ```

2. Create Entry Files
   - `src/entry-client.tsx` (hydration)
   - `src/entry-server.tsx` (SSR rendering)

3. Update Configuration
   - `vite.config.js` with SSR settings
   - `package.json` with build scripts

4. Add Express Server
   - `server.js` with dev/prod modes

5. Optional: Vercel Setup
   - `vercel.json` + `api/index.js`

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `react-router-dom/server` error | Import from `react-router` on server |
| `module is not defined` | Remove server imports from `react-router-dom` |
| Express `Missing parameter name` | Use pathless middleware, not `'*'` route |
| Vercel 500 errors | Ensure `dist/**` included in function files |
| `Cannot find package 'react'` | Add React packages to `ssr.noExternal` |

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with HMR + SSR |
| `npm run build` | Build client and server bundles |
| `npm run build:client` | Build client assets only |
| `npm run build:server` | Build SSR bundle only |

---

## Documentation

- [React Router v7 Docs](https://reactrouter.com/)
- [Vite SSR Guide](https://vitejs.dev/guide/ssr.html)
- [Express.js Documentation](https://expressjs.com/)
- [Vercel Deployment](https://vercel.com/docs)

---

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Made for the React community

[ Star this repo](.) • [🐛 Report Bug](.) • [💡 Request Feature](.)

</div>
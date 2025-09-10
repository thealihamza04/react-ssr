import fs from 'node:fs/promises'
import express from 'express'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

// Constants
const isProduction = process.env.NODE_ENV === 'production'
const port = process.env.PORT || 5173
const base = process.env.BASE || '/'
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const resolve = (...p) => path.resolve(__dirname, ...p)
const clientDist = resolve('dist', 'client')
const serverDist = resolve('dist', 'server')

// Cached production assets
const templateHtml = isProduction
    ? await fs.readFile(path.join(clientDist, 'index.html'), 'utf-8')
    : ''

// Create http server
const app = express()

// Add Vite or respective production middlewares
/** @type {import('vite').ViteDevServer | undefined} */
let vite
if (!isProduction) {
    const { createServer } = await import('vite')
    vite = await createServer({
        server: { middlewareMode: true },
        appType: 'custom',
        base,
    })
    app.use(vite.middlewares)
} else {
    const compression = (await import('compression')).default
    const sirv = (await import('sirv')).default
    app.use(compression())
    app.use(base, sirv(clientDist, { extensions: [] }))
}

// Serve HTML for all routes (Express v5: no '*' path)
app.use(async (req, res) => {
    try {
        const url = req.originalUrl.replace(base, '')

        /** @type {string} */
        let template
        /** @type {import('./src/entry-server.js').render} */
        let render
        if (!isProduction) {
            // Always read fresh template in development
            template = await fs.readFile('./index.html', 'utf-8')
            template = await vite.transformIndexHtml(url, template)
            render = (await vite.ssrLoadModule('/src/entry-server.tsx')).render
        } else {
            template = templateHtml
            // Vite outputs a JS bundle for SSR build; import via file URL
            const entryUrl = pathToFileURL(path.join(serverDist, 'entry-server.js')).href
            render = (await import(entryUrl)).render
        }

        const rendered = await render(url)

        const html = template
            .replace(`<!--app-head-->`, rendered.head ?? '')
            .replace(`<!--app-html-->`, rendered.html ?? '')

        res.status(200).set({ 'Content-Type': 'text/html' }).send(html)
    } catch (e) {
        vite?.ssrFixStacktrace(e)
        console.log(e.stack)
        res.status(500).end(e.stack)
    }
})

// Start http server locally; on Vercel we export the app
if (!process.env.VERCEL) {
    app.listen(port, () => {
        console.log(`Server started at http://localhost:${port}`)
    })
}

export default app

// Runs after `vite build` and the SSR build: writes one static HTML file per route (plus 404.html).
import {mkdir, readFile, rm, writeFile} from 'node:fs/promises'
import path from 'node:path'
import {pathToFileURL} from 'node:url'

const root = path.resolve(import.meta.dirname, '..')
const dist = path.join(root, 'dist')
const ssrDir = path.join(root, 'dist-ssr')

const template = await readFile(path.join(dist, 'index.html'), 'utf8')
const {render, routes} = await import(pathToFileURL(path.join(ssrDir, 'entry-server.js')).href)

const escapeHtml = text => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

// Replacer functions keep `$` in page text from being read as replacement patterns.
// `data-route` tells the browser which URL the HTML was rendered for; 404.html has none, so it is never hydrated.
function pageHtml(url, {hydrate = true} = {}) {
  const {html, title, description} = render(url)
  const route = hydrate ? ` data-route="${escapeHtml(url)}"` : ''
  return template
    .replace(/<title>[\s\S]*?<\/title>/, () => `<title>${escapeHtml(title)}</title>`)
    .replace(/(<meta property="og:title" content=")[^"]*"/, (_, start) => `${start}${escapeHtml(title)}"`)
    .replace(/(<meta (?:name="description"|property="og:description") content=")[^"]*"/g, (_, start) => `${start}${escapeHtml(description)}"`)
    .replace('<div id="root"></div>', () => `<div id="root"${route}>${html}</div>`)
}

const urls = routes()
for (const url of urls) {
  const file = path.join(dist, url === '/' ? '' : url, 'index.html')
  await mkdir(path.dirname(file), {recursive: true})
  await writeFile(file, pageHtml(url))
}
await writeFile(path.join(dist, '404.html'), pageHtml('/404', {hydrate: false}))
await rm(ssrDir, {recursive: true, force: true})

console.log(`Prerendered ${urls.length} pages and 404.html`)

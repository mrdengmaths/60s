/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import {StrictMode} from 'react'
import {createRoot, hydrateRoot} from 'react-dom/client'
import {BrowserRouter} from 'react-router'
import App from './src/App.jsx'
import {basename} from './src/lib/paths.js'

const container = document.getElementById('root')!
const app = (
  <StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </StrictMode>
)

function safeDecode(text: string) {
  try {
    return decodeURIComponent(text)
  } catch {
    return text
  }
}

function currentRoute() {
  const path = safeDecode(location.pathname)
  return (basename === '/' ? path : path.slice(basename.length)).replace(/\/+$/, '') || '/'
}

// Reuse prerendered HTML only when it was built for this URL; some hosts answer other paths with another page's HTML.
if (container.dataset.route === currentRoute()) hydrateRoot(container, app)
else createRoot(container).render(app)

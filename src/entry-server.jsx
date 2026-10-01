import {renderToString} from 'react-dom/server'
import {StaticRouter} from 'react-router'
import App from './App.jsx'
import {allRoutes} from './content.js'
import {MetaContext} from './lib/meta.js'
import {basename} from './lib/paths.js'

export const routes = allRoutes

// Renders one page to an HTML string plus the title and description the prerender step puts in <head>.
export function render(url) {
  const meta = {title: '', description: ''}
  const location = (basename === '/' ? '' : basename) + url
  const html = renderToString(
    <MetaContext.Provider value={meta}>
      <StaticRouter basename={basename} location={location}>
        <App />
      </StaticRouter>
    </MetaContext.Provider>
  )
  return {html, ...meta}
}

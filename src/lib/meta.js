import {createContext, useContext, useEffect} from 'react'
import {site} from '../content.js'

// Prerendering collects the page title and description here; in the browser they update the document.
export const MetaContext = createContext(null)

export function useMeta(title, description) {
  const sink = useContext(MetaContext)
  const fullTitle = title ? `${title} · ${site.name}` : site.name
  if (sink) Object.assign(sink, {title: fullTitle, description})

  useEffect(() => {
    document.title = fullTitle
    document.querySelector('meta[name="description"]')?.setAttribute('content', description)
  }, [fullTitle, description])
}

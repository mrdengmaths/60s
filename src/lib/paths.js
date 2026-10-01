// Router basename and asset URLs for sites served from a sub-path (e.g. GitHub project pages).
export const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/'

export function asset(path) {
  if (!path || /^([a-z][a-z0-9+.-]*:|\/\/)/i.test(path)) return path
  return import.meta.env.BASE_URL + path.replace(/^\//, '')
}

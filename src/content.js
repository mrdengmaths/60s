import site from '../content/site.json'
import aboutSource from '../content/about.md?raw'
import appData from '../content/apps.json'
import pickData from '../content/picks.json'
import musicData from '../content/music.json'
import topicData from '../content/thoughts/topics.json'
import {excerpt, parseFrontmatter} from './lib/text.js'

// Drafts show up in `npm run dev` and are left out of production builds.
const isPublished = entry => import.meta.env.DEV || !entry.draft

const compare = (a, b) => (a < b ? -1 : a > b ? 1 : 0)
const newestFirst = (a, b) => compare(b.date ?? '', a.date ?? '') || compare(a.slug, b.slug)

function loadMarkdown(files) {
  return Object.entries(files)
    .map(([path, source]) => {
      const {data, body} = parseFrontmatter(source)
      const slug = path.split('/').pop().replace(/\.md$/, '')
      return {...data, slug, summary: data.summary || excerpt(body), body}
    })
    .filter(isPublished)
    .sort(newestFirst)
}

export {aboutSource, site}
export const sections = site.sections
export const contact = site.contact
export const friends = site.friends.filter(isPublished)

export const appKinds = appData.kinds
export const apps = appData.items.filter(isPublished)

export const picks = pickData.items.filter(isPublished)
export const pickCategories = pickData.categories.filter(category => picks.some(pick => pick.category === category.id))

export const thoughts = loadMarkdown(import.meta.glob('../content/thoughts/*.md', {query: '?raw', import: 'default', eager: true}))
export const thoughtTopics = topicData.filter(topic => thoughts.some(thought => thought.topic === topic.id))

export const reviews = loadMarkdown(import.meta.glob('../content/reviews/*.md', {query: '?raw', import: 'default', eager: true}))

export const music = {
  intro: musicData.intro,
  pages: musicData.pages,
  playlist: musicData.playlist,
  songs: musicData.songs.filter(isPublished),
  nowPlaying: musicData.nowPlaying?.title && isPublished(musicData.nowPlaying) ? musicData.nowPlaying : null
}

// A section only exists once it has published content; empty ones are left out of pages and navigation.
export const live = {
  apps: apps.length > 0,
  picks: picks.length > 0,
  favorites: music.songs.length > 0,
  reviews: reviews.length > 0,
  music: music.songs.length > 0 || reviews.length > 0 || Boolean(music.playlist.url),
  thoughts: thoughts.length > 0
}

export const navigation = ['home', 'apps', 'picks', 'music', 'thoughts', 'about']
  .filter(id => live[id] ?? true)
  .map(id => ({id, path: id === 'home' ? '/' : `/${id}`, label: sections[id].label}))

export function latestUpdates(limit = 3) {
  return [
    ...apps.map(app => ({section: 'apps', title: app.title, date: app.date, to: `/apps/${app.slug}`})),
    ...picks.map(pick => ({section: 'picks', title: pick.title, date: pick.date, to: `/picks/${pick.category}`})),
    ...reviews.map(review => ({section: 'music', title: review.title, date: review.date, to: `/music/reviews/${review.slug}`})),
    ...thoughts.map(thought => ({section: 'thoughts', title: thought.title, date: thought.date, to: `/thoughts/${thought.slug}`}))
  ]
    .filter(update => update.date)
    .sort((a, b) => compare(b.date, a.date))
    .slice(0, limit)
}

// Every URL that exists for the current content; the prerender step writes one HTML file for each.
export function allRoutes() {
  const routes = ['/', '/about']
  if (live.apps) routes.push('/apps', ...apps.map(app => `/apps/${app.slug}`))
  if (live.picks) routes.push('/picks', ...pickCategories.map(category => `/picks/${category.id}`))
  if (live.music) routes.push('/music')
  if (live.favorites) routes.push('/music/favorites')
  if (live.reviews) routes.push('/music/reviews', ...reviews.map(review => `/music/reviews/${review.slug}`))
  if (live.thoughts) {
    routes.push('/thoughts', ...thoughtTopics.map(topic => `/thoughts/${topic.id}`), ...thoughts.map(thought => `/thoughts/${thought.slug}`))
  }
  return routes
}

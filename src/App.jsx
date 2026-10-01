import {useEffect} from 'react'
import {Route, Routes, useLocation, useNavigationType} from 'react-router'
import About from './pages/About.jsx'
import {AppDetail, Apps} from './pages/Apps.jsx'
import Home from './pages/Home.jsx'
import {Favorites, Music, ReviewDetail, Reviews} from './pages/Music.jsx'
import NotFound from './pages/NotFound.jsx'
import {Picks, PicksCategory} from './pages/Picks.jsx'
import {ThoughtRoute, Thoughts} from './pages/Thoughts.jsx'

// After in-app navigation, return to the top and move focus to the page so keyboard and screen-reader users follow along.
function PageChange() {
  const {pathname} = useLocation()
  const type = useNavigationType()

  useEffect(() => {
    if (type === 'POP') return
    window.scrollTo({top: 0, behavior: 'instant'})
    document.getElementById('main')?.focus({preventScroll: true})
  }, [pathname, type])

  return null
}

export default function App() {
  return (
    <>
      <PageChange />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/apps" element={<Apps />} />
        <Route path="/apps/:slug" element={<AppDetail />} />
        <Route path="/picks" element={<Picks />} />
        <Route path="/picks/:category" element={<PicksCategory />} />
        <Route path="/music" element={<Music />} />
        <Route path="/music/favorites" element={<Favorites />} />
        <Route path="/music/reviews" element={<Reviews />} />
        <Route path="/music/reviews/:slug" element={<ReviewDetail />} />
        <Route path="/thoughts" element={<Thoughts />} />
        <Route path="/thoughts/:slug" element={<ThoughtRoute />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

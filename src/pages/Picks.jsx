import {Link, useParams} from 'react-router'
import {Layout} from '../components/Layout.jsx'
import {DraftTag, ExternalMark, Filters, Rating} from '../components/parts.jsx'
import {live, pickCategories, picks, sections} from '../content.js'
import {useMeta} from '../lib/meta.js'
import {asset} from '../lib/paths.js'
import NotFound from './NotFound.jsx'

export function Picks() {
  return live.picks ? <PicksPage /> : <NotFound />
}

export function PicksCategory() {
  const {category: id} = useParams()
  const category = pickCategories.find(item => item.id === id)
  return category ? <PicksPage category={category} /> : <NotFound />
}

function PicksPage({category}) {
  const blurb = category ? category.blurb : sections.picks.blurb
  useMeta(category ? `${category.label} · ${sections.picks.label}` : sections.picks.label, blurb)
  const filters = [
    {to: '/picks', label: '全部'},
    ...pickCategories.map(item => ({to: `/picks/${item.id}`, label: item.label}))
  ]

  return (
    <Layout section="picks">
      <h1>{sections.picks.label}</h1>
      <Filters label="推荐分类" items={filters} />
      <p className="lead">{blurb}</p>

      {category
        ? picks.filter(pick => pick.category === category.id).map(pick => <Pick key={pick.title} pick={pick} level={2} />)
        : pickCategories.map(item => (
            <section className="category" key={item.id}>
              <h2 className="category-title"><Link to={`/picks/${item.id}`}>{item.label} →</Link></h2>
              {picks.filter(pick => pick.category === item.id).map(pick => <Pick key={pick.title} pick={pick} level={3} />)}
            </section>
          ))}
    </Layout>
  )
}

// A pick is a short personal write-up, so it is shown in full rather than linking to a page of its own.
function Pick({pick, level}) {
  const Heading = `h${level}`
  return (
    <article className="pick">
      {pick.cover && <img className="pick-cover" src={asset(pick.cover)} alt="" loading="lazy" />}
      <div className="pick-body">
        <Heading className="pick-title">{pick.title}{pick.draft && <DraftTag />}</Heading>
        {(pick.rating || pick.for) && (
          <p className="pick-meta">
            {pick.rating ? <Rating value={pick.rating} /> : null}
            {pick.for && <span>适合：{pick.for}</span>}
          </p>
        )}
        <p>{pick.story}</p>
        {pick.link && (
          <p><a className="ext-link" href={pick.link.url} target="_blank" rel="noopener noreferrer">{pick.link.label}<ExternalMark /></a></p>
        )}
      </div>
    </article>
  )
}

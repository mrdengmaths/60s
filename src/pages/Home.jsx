import {Link} from 'react-router'
import {Layout} from '../components/Layout.jsx'
import {Dot, Item, NowPlaying, SectionTitle} from '../components/parts.jsx'
import {apps, latestUpdates, live, music, picks, sections, site, thoughts} from '../content.js'
import {useMeta} from '../lib/meta.js'
import {excerpt, formatDate} from '../lib/text.js'

const blocks = [
  {
    id: 'apps',
    items: () => apps.slice(0, 2).map(app => ({
      key: app.slug,
      to: `/apps/${app.slug}`,
      title: app.title,
      desc: app.summary,
      draft: app.draft
    }))
  },
  {
    id: 'picks',
    items: () => picks.slice(0, 2).map(pick => ({
      key: pick.title,
      to: `/picks/${pick.category}`,
      title: pick.title,
      desc: excerpt(pick.story, 24),
      draft: pick.draft
    }))
  },
  {
    id: 'music',
    items: () => music.songs.slice(0, 2).map(song => ({
      key: `${song.title}-${song.artist}`,
      to: '/music',
      title: song.title,
      desc: [song.artist, song.note].filter(Boolean).join(' · '),
      draft: song.draft
    }))
  },
  {
    id: 'thoughts',
    items: () => thoughts.slice(0, 2).map(thought => ({
      key: thought.slug,
      to: `/thoughts/${thought.slug}`,
      title: thought.title,
      desc: thought.summary,
      draft: thought.draft
    }))
  }
]

export default function Home() {
  useMeta('', site.description)
  const updates = latestUpdates()

  return (
    <Layout section="home" homepage>
      <div className="intro">
        <p>
          {site.tagline.zh}{' '}
          <Link className="more" to="/about">更多 →</Link>
        </p>
        <p className="intro-en" lang="en">{site.tagline.en}</p>
      </div>

      {updates.length > 0 && (
        <section className="updates">
          <h2 className="section-title">
            <Dot section="home" />
            最新动态
            <span className="en" lang="en">Latest</span>
          </h2>
          <ul className="update-list">
            {updates.map(update => (
              <li key={`${update.section}-${update.title}`} data-section={update.section}>
                <time dateTime={update.date}>{formatDate(update.date)}</time>
                <Link to={update.to}>
                  <span className="update-kind">
                    {sections[update.section].label}
                  </span>{' '}
                  {update.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="home-grid">
        {blocks.filter(block => live[block.id]).map(block => (
          <section key={block.id} data-section={block.id}>
            <SectionTitle id={block.id} to={`/${block.id}`} />
            <p className="section-blurb">{sections[block.id].blurb}</p>
            {block.items().map(({key, ...item}) => (
              <Item key={key} {...item} />
            ))}
          </section>
        ))}
      </div>

      {music.nowPlaying && <NowPlaying />}
    </Layout>
  )
}
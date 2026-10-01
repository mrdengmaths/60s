import {Link, useParams} from 'react-router'
import {Layout} from '../components/Layout.jsx'
import {BackLink, DraftTag, Filters, Item, Markdown, Tag} from '../components/parts.jsx'
import {live, sections, thoughtTopics, thoughts} from '../content.js'
import {useMeta} from '../lib/meta.js'
import {formatDate, readingMinutes} from '../lib/text.js'
import NotFound from './NotFound.jsx'

export function Thoughts() {
  return live.thoughts ? <ThoughtList /> : <NotFound />
}

// /thoughts/:slug is either a topic page (love, meaning, daily) or a single article.
export function ThoughtRoute() {
  const {slug} = useParams()
  const topic = thoughtTopics.find(item => item.id === slug)
  if (topic) return <ThoughtList topic={topic} />

  const thought = thoughts.find(item => item.slug === slug)
  return thought ? <ThoughtPage thought={thought} /> : <NotFound />
}

const topicLabel = id => thoughtTopics.find(topic => topic.id === id)?.label

function ThoughtList({topic}) {
  const blurb = topic ? topic.blurb : sections.thoughts.blurb
  useMeta(topic ? `${topic.label} · ${sections.thoughts.label}` : sections.thoughts.label, blurb)
  const filters = [
    {to: '/thoughts', label: '全部'},
    ...thoughtTopics.map(item => ({to: `/thoughts/${item.id}`, label: item.label}))
  ]
  const list = topic ? thoughts.filter(thought => thought.topic === topic.id) : thoughts

  return (
    <Layout section="thoughts">
      <h1>{sections.thoughts.label}</h1>
      <Filters label="随想主题" items={filters} />
      <p className="lead">{blurb}</p>
      {list.map(thought => <ThoughtItem key={thought.slug} thought={thought} />)}
    </Layout>
  )
}

function ThoughtItem({thought}) {
  const meta = [thought.date && formatDate(thought.date), topicLabel(thought.topic)].filter(Boolean).join(' · ')
  return (
    <Item
      to={`/thoughts/${thought.slug}`}
      title={thought.title}
      desc={thought.summary}
      meta={meta}
      tag={thought.status}
      draft={thought.draft}
    />
  )
}

function ThoughtPage({thought}) {
  useMeta(thought.title, thought.summary)
  const related = thoughts.filter(item => item.topic === thought.topic && item.slug !== thought.slug).slice(0, 3)

  return (
    <Layout section="thoughts">
      <BackLink to="/thoughts">{sections.thoughts.label}</BackLink>
      <article>
        <header className="article-head">
          <h1>{thought.title}</h1>
          <p className="article-meta">
            {thought.date && <time dateTime={thought.date}>{formatDate(thought.date)}</time>}
            <span>约 {readingMinutes(thought.body)} 分钟读完</span>
            {topicLabel(thought.topic) && <Link to={`/thoughts/${thought.topic}`}>{topicLabel(thought.topic)}</Link>}
            {thought.status && <Tag>{thought.status}</Tag>}
            {thought.draft && <DraftTag />}
          </p>
        </header>
        <Markdown>{thought.body}</Markdown>
      </article>

      {related.length > 0 && (
        <section className="category related">
          <h2 className="category-title">同主题的文章</h2>
          {related.map(item => <Item key={item.slug} to={`/thoughts/${item.slug}`} title={item.title} desc={item.summary} />)}
        </section>
      )}
    </Layout>
  )
}

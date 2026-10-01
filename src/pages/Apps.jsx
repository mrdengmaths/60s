import {useParams} from 'react-router'
import {Layout} from '../components/Layout.jsx'
import {BackLink, ExternalMark, Item, Tag} from '../components/parts.jsx'
import {appKinds, apps, live, sections} from '../content.js'
import {useMeta} from '../lib/meta.js'
import NotFound from './NotFound.jsx'

export function Apps() {
  return live.apps ? <AppList /> : <NotFound />
}

export function AppDetail() {
  const {slug} = useParams()
  const app = apps.find(item => item.slug === slug)
  return app ? <AppPage app={app} /> : <NotFound />
}

function AppList() {
  useMeta(sections.apps.label, sections.apps.blurb)
  const groups = appKinds
    .map(kind => ({...kind, items: apps.filter(app => app.kind === kind.id)}))
    .filter(group => group.items.length > 0)

  return (
    <Layout section="apps">
      <h1>{sections.apps.label}</h1>
      <p className="lead">{sections.apps.blurb}</p>
      {groups.map(group => (
        <section className="category" key={group.id}>
          <h2 className="category-title">{group.label}</h2>
          {group.items.map(app => (
            <Item
              key={app.slug}
              to={`/apps/${app.slug}`}
              title={app.title}
              desc={app.summary}
              cover={app.cover}
              draft={app.draft}
              meta={app.tags?.map(tag => <Tag key={tag}>{tag}</Tag>)}
            />
          ))}
        </section>
      ))}
    </Layout>
  )
}

function AppPage({app}) {
  useMeta(app.title, app.summary)

  return (
    <Layout section="apps">
      <BackLink to="/apps">{sections.apps.label}</BackLink>
      <h1>{app.title}</h1>
      <p className="lead">{app.summary}</p>
      {app.tags?.length > 0 && <p className="tags">{app.tags.map(tag => <Tag key={tag}>{tag}</Tag>)}</p>}

      {app.story && (
        <section className="category">
          <h2 className="category-title">为什么做这个</h2>
          <p className="body-text">{app.story}</p>
        </section>
      )}
      {app.audience && (
        <section className="category">
          <h2 className="category-title">适合谁 · 怎么用</h2>
          <p className="body-text">{app.audience}</p>
        </section>
      )}

      {app.url && (
        <section className="category">
          <h2 className="category-title">试试看</h2>
          {app.embed !== false && (
            <div className="embed">
              <iframe
                src={app.url}
                title={`${app.title} 运行区域`}
                loading="lazy"
                allow="fullscreen"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              />
            </div>
          )}
          <p className="links">
            <a href={app.url} target="_blank" rel="noopener noreferrer">在新窗口打开<ExternalMark /></a>
            {app.source && <a href={app.source} target="_blank" rel="noopener noreferrer">查看源码<ExternalMark /></a>}
          </p>
        </section>
      )}
    </Layout>
  )
}

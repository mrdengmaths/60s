import {Layout} from '../components/Layout.jsx'
import {ExternalMark, Item, Markdown} from '../components/parts.jsx'
import {aboutSource, contact, friends, sections, site} from '../content.js'
import {useMeta} from '../lib/meta.js'
import {asset} from '../lib/paths.js'

export default function About() {
  useMeta(sections.about.label, site.description)

  return (
    <Layout section="about">
      <h1>{sections.about.label}</h1>
      {site.photo && <img className="portrait" src={asset(site.photo)} alt={site.name} width="112" height="112" />}
      <Markdown>{aboutSource}</Markdown>

      {contact.length > 0 && (
        <section className="category">
          <h2 className="category-title">联系方式</h2>
          <ul className="contact-list">
            {contact.map(link => (
              <li key={link.url}>
                {/^https?:/.test(link.url)
                  ? <a href={link.url} target="_blank" rel="noopener noreferrer">{link.label}<ExternalMark /></a>
                  : <a href={link.url}>{link.label}</a>}
              </li>
            ))}
          </ul>
        </section>
      )}

      {friends.length > 0 && (
        <section className="category">
          <h2 className="category-title">友情链接</h2>
          {friends.map(friend => (
            <Item key={friend.url} href={friend.url} title={friend.name} desc={friend.note} draft={friend.draft} />
          ))}
        </section>
      )}
    </Layout>
  )
}

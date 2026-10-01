import {Link, NavLink} from 'react-router'
import ReactMarkdown from 'react-markdown'
import {live, music, sections} from '../content.js'
import {asset} from '../lib/paths.js'
import {formatDate} from '../lib/text.js'

// Section colors come from CSS variables; without `section` the dot follows the page's accent.
export function Dot({section}) {
  return <span className="dot" style={section ? {background: `var(--${section})`} : undefined} aria-hidden="true" />
}

export function SectionTitle({id, to}) {
  const {label, en} = sections[id]
  const content = (
    <>
      <Dot section={id} />
      {label}
      <span className="en" lang="en">{en}</span>
      {to && <span className="arrow" aria-hidden="true">→</span>}
    </>
  )
  return <h2 className="section-title">{to ? <Link to={to}>{content}</Link> : content}</h2>
}

export function Tag({children, variant}) {
  return <span className={variant ? `tag tag-${variant}` : 'tag'}>{children}</span>
}

export function DraftTag() {
  return <Tag variant="draft">草稿</Tag>
}

// List entry: `to` links inside the site, `href` opens elsewhere, neither renders plain text.
export function Item({to, href, title, desc, note, meta, cover, tag, draft}) {
  const content = (
    <>
      {cover && <img className="item-cover" src={asset(cover)} alt="" loading="lazy" />}
      <div className="item-body">
        <div className="item-title">
          {title}
          {href && <ExternalMark />}
          {tag && <Tag>{tag}</Tag>}
          {draft && <DraftTag />}
        </div>
        {desc && <div className="item-desc">{desc}</div>}
        {note && <div className="item-note">{note}</div>}
        {meta && <div className="item-meta">{meta}</div>}
      </div>
    </>
  )

  return (
    <div className="item">
      {href ? (
        <a href={href} target="_blank" rel="noopener noreferrer">{content}</a>
      ) : to ? (
        <Link to={to}>{content}</Link>
      ) : (
        <div className="item-static">{content}</div>
      )}
    </div>
  )
}

export function ExternalMark() {
  return (
    <>
      <span className="ext" aria-hidden="true">↗</span>
      <span className="sr-only">（在新窗口打开）</span>
    </>
  )
}

export function Rating({value, max = 5}) {
  const filled = Math.min(max, Math.max(0, Math.round(value)))
  return (
    <span className="rating" role="img" aria-label={`个人评分 ${filled} / ${max}`}>
      {'★'.repeat(filled)}{'☆'.repeat(max - filled)}
    </span>
  )
}

export function BackLink({to, children}) {
  return <Link className="back" to={to}>← {children}</Link>
}

export function Filters({label, items}) {
  return (
    <nav className="filters" aria-label={label}>
      {items.map(item => <NavLink key={item.to} to={item.to} end>{item.label}</NavLink>)}
    </nav>
  )
}

const markdownComponents = {
  a({href, children}) {
    const external = /^https?:\/\//.test(href ?? '')
    return <a href={href} {...(external && {target: '_blank', rel: 'noopener noreferrer'})}>{children}</a>
  },
  img({src, alt}) {
    return <img src={asset(src)} alt={alt ?? ''} loading="lazy" />
  }
}

export function Markdown({children}) {
  return (
    <div className="prose">
      <ReactMarkdown components={markdownComponents}>{children}</ReactMarkdown>
    </div>
  )
}

export function NowPlaying({linked = true}) {
  const track = music.nowPlaying
  const title = (
    <>
      <Dot section="music" />
      正在听
      <span className="en" lang="en">Now playing</span>
      {linked && <span className="arrow" aria-hidden="true">→</span>}
    </>
  )
  const body = (
    <>
      {track.cover ? <img className="now-cover" src={asset(track.cover)} alt="" /> : <span className="now-glyph" aria-hidden="true">♪</span>}
      <span className="now-text">
        <strong>{track.title}</strong>
        {track.artist && <span>{track.artist}</span>}
      </span>
    </>
  )

  return (
    <section className="now-playing" data-section="music">
      <h2 className="section-title">{linked && live.music ? <Link to="/music">{title}</Link> : title}</h2>
      {track.url ? (
        <a className="now-card" href={track.url} target="_blank" rel="noopener noreferrer">
          {body}
          <span className="now-source">QQ 音乐<ExternalMark /></span>
        </a>
      ) : (
        <div className="now-card">{body}</div>
      )}
      {track.updated && <p className="now-updated">更新于 {formatDate(track.updated)}</p>}
    </section>
  )
}

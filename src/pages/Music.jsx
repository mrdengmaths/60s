import {useState} from 'react'
import {useParams} from 'react-router'
import {Layout} from '../components/Layout.jsx'
import {BackLink, DraftTag, ExternalMark, Markdown, NowPlaying} from '../components/parts.jsx'
import {live, music, reviews, sections} from '../content.js'
import {useMeta} from '../lib/meta.js'
import {asset} from '../lib/paths.js'
import {formatDate} from '../lib/text.js'
import NotFound from './NotFound.jsx'

export function Music() {
  return live.music ? <MusicPage /> : <NotFound />
}

// Keep these exports so the existing router does not break.
export function Favorites() {
  return <NotFound />
}

export function Reviews() {
  return live.reviews ? <ReviewList /> : <NotFound />
}

export function ReviewDetail() {
  const {slug} = useParams()
  const review = reviews.find(item => item.slug === slug)
  return review ? <ReviewPage review={review} /> : <NotFound />
}

function MusicPage() {
  useMeta(sections.music.label, music.intro)

  const allTags = [...new Set(music.songs.flatMap(song => song.tags || []))]
  const [activeTag, setActiveTag] = useState(null)
  const filteredSongs = activeTag
    ? music.songs.filter(song => (song.tags || []).includes(activeTag))
    : music.songs

  return (
    <Layout section="music">
      <h1>{sections.music.label}</h1>
      <p className="lead">{music.intro}</p>

      {allTags.length > 0 && (
        <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap', margin: '16px 0 24px'}}>
          <TagButton
            label="全部"
            active={activeTag === null}
            onClick={() => setActiveTag(null)}
          />
          {allTags.map(tag => (
            <TagButton
              key={tag}
              label={tag}
              active={activeTag === tag}
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
            />
          ))}
        </div>
      )}

      <section className="category">
        {filteredSongs.map(song => (
          <SongCard key={`${song.title}-${song.artist}`} song={song} />
        ))}
      </section>

      {music.playlist.url && (
        <p className="links" style={{marginTop: '24px'}}>
          <a href={music.playlist.url} target="_blank" rel="noopener noreferrer">
            在 QQ 音乐查看完整歌单<ExternalMark />
          </a>
        </p>
      )}

      {music.nowPlaying && <NowPlaying linked={false} />}
    </Layout>
  )
}

function TagButton({label, active, onClick}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: '4px 14px',
        borderRadius: '999px',
        border: '1.5px solid',
        borderColor: active ? '#7c3aed' : '#ddd',
        background: active ? '#7c3aed' : 'transparent',
        color: active ? '#fff' : '#555',
        cursor: 'pointer',
        fontSize: '0.82em',
        transition: 'all 0.15s'
      }}
    >
      {label}
    </button>
  )
}

function SongCard({song}) {
  if (song.embed) {
    return (
      <div style={{marginBottom: '22px'}}>
        <iframe
          src={song.embed}
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          width="100%"
          height="80"
          title={`${song.title} · ${song.artist}`}
          style={{display: 'block', borderRadius: '10px', border: 'none'}}
        />
        {song.note && (
          <p style={{margin: '7px 2px 0', fontSize: '0.88em', color: '#666', lineHeight: 1.5}}>
            {song.note}
          </p>
        )}
      </div>
    )
  }

  return (
    <div style={{marginBottom: '18px'}}>
      <a href={song.url} target="_blank" rel="noopener noreferrer" style={{fontWeight: 600}}>
        {song.title}
      </a>
      <span style={{color: '#888', fontSize: '0.88em', marginLeft: '8px'}}>
        {song.artist}
      </span>
      {song.note && (
        <p style={{margin: '6px 0 0', fontSize: '0.88em', color: '#666', lineHeight: 1.5}}>
          {song.note}
        </p>
      )}
    </div>
  )
}

const reviewMeta = review =>
  [review.artist, review.type, review.date && formatDate(review.date)]
    .filter(Boolean)
    .join(' · ')

function ReviewList() {
  useMeta('乐评', '')

  return (
    <Layout section="music">
      <BackLink to="/music">{sections.music.label}</BackLink>
      <section className="category">
        {reviews.map(review => (
          <a
            key={review.slug}
            href={`/music/reviews/${review.slug}`}
            style={{display: 'block', marginBottom: '12px'}}
          >
            <strong>{review.title}</strong>
            <span style={{color: '#888', fontSize: '0.88em', marginLeft: '8px'}}>
              {reviewMeta(review)}
            </span>
          </a>
        ))}
      </section>
    </Layout>
  )
}

function ReviewPage({review}) {
  useMeta(review.title, review.summary)

  return (
    <Layout section="music">
      <BackLink to="/music">{sections.music.label}</BackLink>
      <article>
        <header className="article-head">
          {review.cover && <img className="review-cover" src={asset(review.cover)} alt="" />}
          <h1>{review.title}</h1>
          <p className="article-meta">
            <span>{reviewMeta(review)}</span>
            {review.draft && <DraftTag />}
          </p>
          {review.mood && <p className="note">适合这样的心情听：{review.mood}</p>}
          {review.url && (
            <p className="links">
              <a href={review.url} target="_blank" rel="noopener noreferrer">
                在 QQ 音乐打开<ExternalMark />
              </a>
            </p>
          )}
          {review.embed && (
            <iframe
              src={review.embed}
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              width="100%"
              height="80"
              title={review.title}
              style={{display: 'block', marginTop: '12px', borderRadius: '10px', border: 'none'}}
            />
          )}
        </header>
        <Markdown>{review.body}</Markdown>
      </article>
    </Layout>
  )
}

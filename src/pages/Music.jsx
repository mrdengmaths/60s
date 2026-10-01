import {useParams} from 'react-router'
import {Layout} from '../components/Layout.jsx'
import {BackLink, DraftTag, ExternalMark, Item, Markdown, NowPlaying} from '../components/parts.jsx'
import {live, music, reviews, sections} from '../content.js'
import {useMeta} from '../lib/meta.js'
import {asset} from '../lib/paths.js'
import {formatDate} from '../lib/text.js'
import NotFound from './NotFound.jsx'

export function Music() {
  return live.music ? <MusicHome /> : <NotFound />
}

export function Favorites() {
  return live.favorites ? <FavoritesPage /> : <NotFound />
}

export function Reviews() {
  return live.reviews ? <ReviewList /> : <NotFound />
}

export function ReviewDetail() {
  const {slug} = useParams()
  const review = reviews.find(item => item.slug === slug)
  return review ? <ReviewPage review={review} /> : <NotFound />
}

const reviewMeta = review => [review.artist, review.type, review.date && formatDate(review.date)].filter(Boolean).join(' · ')

function MusicHome() {
  useMeta(sections.music.label, music.intro)

  return (
    <Layout section="music">
      <h1>{sections.music.label}</h1>
      <p className="lead">{music.intro}</p>
      <section className="category">
        {live.favorites && <Item to="/music/favorites" title={music.pages.favorites.title} desc={music.pages.favorites.blurb} />}
        {live.reviews && <Item to="/music/reviews" title={music.pages.reviews.title} desc={music.pages.reviews.blurb} />}
        {music.playlist.url && <Item href={music.playlist.url} title={`在 QQ 音乐打开「${music.playlist.title}」`} />}
      </section>
      {music.nowPlaying && <NowPlaying linked={false} />}
    </Layout>
  )
}

function FavoritesPage() {
  useMeta(music.pages.favorites.title, music.pages.favorites.blurb)

  return (
    <Layout section="music">
      <BackLink to="/music">{sections.music.label}</BackLink>
      <h1>{music.playlist.title}</h1>
      <p className="lead">{music.pages.favorites.blurb}</p>
      <section className="category">
        {music.songs.map(song => (
          <Item
            key={`${song.title}-${song.artist}`}
            href={song.url || undefined}
            title={song.title}
            desc={song.artist}
            note={song.note}
            cover={song.cover}
            draft={song.draft}
          />
        ))}
      </section>
      <p className="note">点击歌曲会跳转到 QQ 音乐（手机 App 或网页）。</p>
      {music.playlist.url && (
        <p className="links"><a href={music.playlist.url} target="_blank" rel="noopener noreferrer">在 QQ 音乐打开完整歌单<ExternalMark /></a></p>
      )}
    </Layout>
  )
}

function ReviewList() {
  useMeta(music.pages.reviews.title, music.pages.reviews.blurb)

  return (
    <Layout section="music">
      <BackLink to="/music">{sections.music.label}</BackLink>
      <h1>{music.pages.reviews.title}</h1>
      <p className="lead">{music.pages.reviews.blurb}</p>
      <section className="category">
        {reviews.map(review => (
          <Item
            key={review.slug}
            to={`/music/reviews/${review.slug}`}
            title={review.title}
            desc={review.summary}
            meta={reviewMeta(review)}
            cover={review.cover}
            draft={review.draft}
          />
        ))}
      </section>
    </Layout>
  )
}

function ReviewPage({review}) {
  useMeta(review.title, review.summary)

  return (
    <Layout section="music">
      <BackLink to="/music/reviews">{music.pages.reviews.title}</BackLink>
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
            <p className="links"><a href={review.url} target="_blank" rel="noopener noreferrer">在 QQ 音乐打开<ExternalMark /></a></p>
          )}
        </header>
        <Markdown>{review.body}</Markdown>
      </article>
    </Layout>
  )
}

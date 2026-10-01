import {useState} from 'react'
import {
  identity,
  projects,
  recommendationTopics,
  reflections,
  music
} from '../content'

const navigation = [
  {id: 'projects', number: '01', label: '小程序'},
  {id: 'recommendations', number: '02', label: '推荐'},
  {id: 'music', number: '03', label: '音乐'},
  {id: 'thoughts', number: '04', label: '想法'}
]

function Arrow() {
  return <span className="arrow" aria-hidden="true">↗</span>
}

export default function PersonalSite() {
  const [selectedTopic, setSelectedTopic] = useState(recommendationTopics[0].id)
  const activeTopic = recommendationTopics.find(topic => topic.id === selectedTopic)

  return (
    <div className="site-shell">
      <header className="masthead">
        <a className="wordmark" href="#home" aria-label={`${identity.name}，回到首页`}>
          <span className="wordmark-mark">D.</span>
          <span>{identity.name}<small>个人记录 · 自 2026</small></span>
        </a>
        <nav className="top-nav" aria-label="主导航">
          {navigation.map(item => <a key={item.id} href={`#${item.id}`}>{item.label}</a>)}
          <a className="about-link" href="#about">关于我 <Arrow /></a>
        </nav>
      </header>

      <main className="page-main" id="home">
        <section className="intro" id="about" aria-labelledby="intro-title">
          <div className="intro-main">
            <p className="overline"><span className="live-dot" /> 一份持续更新的个人网站</p>
            <h1 id="intro-title">你好，我是<br /><em>{identity.name}。</em></h1>
            <p className="intro-copy">{identity.introduction}</p>
            <a className="text-link" href="#projects">看看我最近在做什么 <Arrow /></a>
          </div>
          <aside className="margin-note" aria-label="个人简介">
            <span className="note-mark" aria-hidden="true">✳</span>
            <p>{identity.shortBio}</p>
            <span className="note-caption">常驻：{identity.location}</span>
          </aside>
        </section>

        <section className="content-section projects-section" id="projects" aria-labelledby="projects-title">
          <div className="section-heading">
            <span className="section-number">{navigation[0].number}</span>
            <h2 id="projects-title">我做的小东西</h2>
            <span className="section-aside">学习 · 玩耍 · 反复打磨</span>
          </div>
          <div className="project-list">
            {projects.map((project, index) => (
              <a className="project-row" href={project.url} key={project.title}>
                <span className="row-index">0{index + 1}</span>
                <span className="project-copy"><strong>{project.title}</strong><small>{project.description}</small></span>
                <span className="project-kind">{project.kind}</span>
                <Arrow />
              </a>
            ))}
          </div>
        </section>

        <section className="content-section recommendations-section" id="recommendations" aria-labelledby="recommendations-title">
          <div className="section-heading">
            <span className="section-number">{navigation[1].number}</span>
            <h2 id="recommendations-title">真心推荐</h2>
            <span className="section-aside">不求多，只写我真喜欢的</span>
          </div>
          <div className="recommendation-layout">
            <div className="topic-list" role="tablist" aria-label="推荐分类">
              {recommendationTopics.map((topic, index) => (
                <button
                  aria-selected={selectedTopic === topic.id}
                  className={selectedTopic === topic.id ? 'topic-tab is-active' : 'topic-tab'}
                  id={`tab-${topic.id}`}
                  key={topic.id}
                  onClick={() => setSelectedTopic(topic.id)}
                  role="tab"
                  type="button"
                >
                  <span>0{index + 1}</span>{topic.label}<Arrow />
                </button>
              ))}
            </div>
            <div className="recommendation-note" role="tabpanel" aria-labelledby={`tab-${activeTopic.id}`}>
              <p className="note-category">{activeTopic.label} / 还在收集</p>
              <p>{activeTopic.prompt}</p>
              <span className="small-rule" />
              <small>下一条，等我遇到真正想分享的再写。</small>
            </div>
          </div>
        </section>

        <section className="music-band" id="music" aria-labelledby="music-title">
          <div className="music-heading">
            <span className="section-number">{navigation[2].number}</span>
            <div>
              <p className="overline">RECENTLY, ON REPEAT</p>
              <h2 id="music-title">最近常听</h2>
            </div>
            <span className="music-glyph" aria-hidden="true">♫</span>
          </div>
          <div className="music-content">
            <div>
              <p className="playlist-label">QQ 音乐 · 红心收藏</p>
              <h3>{music.playlistTitle}</h3>
              <p className="music-description">{music.description}</p>
            </div>
            {music.playlistUrl ? (
              <a className="music-link" href={music.playlistUrl} target="_blank" rel="noreferrer">打开我的歌单 <Arrow /></a>
            ) : (
              <span className="music-pending">歌单链接待添加 <span aria-hidden="true">↗</span></span>
            )}
          </div>
          {music.tracks.length > 0 ? (
            <ol className="track-list">
              {music.tracks.map((track, index) => (
                <li key={`${track.title}-${track.artist}`}>
                  <span className="track-index">0{index + 1}</span>
                  <span className="track-title">{track.title}<small>{track.artist}</small></span>
                  <span className="track-thought">{track.note}</span>
                  <a href={track.url} target="_blank" rel="noreferrer" aria-label={`在 QQ 音乐打开《${track.title}》`}>QQ 音乐 <Arrow /></a>
                </li>
              ))}
            </ol>
          ) : (
            <p className="track-empty">歌、专辑和我自己的短评，会从这里慢慢长出来。</p>
          )}
        </section>

        <section className="content-section thoughts-section" id="thoughts" aria-labelledby="thoughts-title">
          <div className="section-heading">
            <span className="section-number">{navigation[3].number}</span>
            <h2 id="thoughts-title">还没想明白</h2>
            <span className="section-aside">一些开放中的问题</span>
          </div>
          <div className="thought-list">
            {reflections.map((reflection, index) => (
              <details className="thought-entry" key={reflection.title}>
                <summary>
                  <span className="row-index">0{index + 1}</span>
                  <span>{reflection.title}</span>
                  <span className="thought-status">{reflection.status}</span>
                  <span className="plus-mark" aria-hidden="true">+</span>
                </summary>
                <p>{reflection.prompt}</p>
              </details>
            ))}
          </div>
        </section>

        <footer className="site-footer">
          <span>{identity.name} · 个人网站</span>
          <span>认真生活，也允许答案改变。</span>
          <a href="#home">回到顶部 ↑</a>
        </footer>
      </main>
    </div>
  )
}
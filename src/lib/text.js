// Minimal `---` frontmatter: `key: value` lines with strings, booleans and [a, b] lists.
export function parseFrontmatter(source) {
  const text = source.replace(/^\uFEFF/, '')
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(text)
  if (!match) return {data: {}, body: text.trim()}

  const data = {}
  for (const line of match[1].split(/\r?\n/)) {
    const pair = /^([\w-]+):\s*(.*)$/.exec(line)
    if (pair) data[pair[1]] = parseValue(pair[2].trim())
  }
  return {data, body: match[2].trim()}
}

function parseValue(value) {
  if (value === 'true') return true
  if (value === 'false') return false
  if (value.startsWith('[') && value.endsWith(']')) {
    return value.slice(1, -1).split(',').map(item => unquote(item.trim())).filter(Boolean)
  }
  return unquote(value)
}

const unquote = value => value.replace(/^(["'])(.*)\1$/, '$2')

export function formatDate(iso) {
  const [year, month, day] = iso.split('-').map(Number)
  return `${year}年${month ? `${month}月` : ''}${day ? `${day}日` : ''}`
}

// About 400 Chinese characters or 200 words per minute.
export function readingMinutes(markdown) {
  const cjk = markdown.match(/[\u4e00-\u9fff]/g)?.length ?? 0
  const words = markdown.replace(/[\u4e00-\u9fff]/g, ' ').match(/[A-Za-z0-9]+/g)?.length ?? 0
  return Math.max(1, Math.round(cjk / 400 + words / 200))
}

export function excerpt(markdown, length = 100) {
  const text = markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/^\s{0,3}(#{1,6}|>|[-*+]|\d+\.)\s+/gm, '')
    .replace(/[*_`~]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
  return text.length > length ? `${text.slice(0, length).trimEnd()}…` : text
}

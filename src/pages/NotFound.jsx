import {Link} from 'react-router'
import {Layout} from '../components/Layout.jsx'
import {useMeta} from '../lib/meta.js'

export default function NotFound() {
  useMeta('找不到页面', '这个页面不存在。')
  return (
    <Layout section="home">
      <h1>找不到这个页面</h1>
      <p className="lead">链接可能已经变了，或者这里还没有内容。</p>
      <p><Link className="more" to="/">回到首页 →</Link></p>
    </Layout>
  )
}

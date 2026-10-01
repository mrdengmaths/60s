import {Link, NavLink} from 'react-router'
import {navigation, site} from '../content.js'
import {Dot} from './parts.jsx'

// `section` picks the page's accent color (see [data-section] in site.css); the home page uses the name as its h1.
export function Layout({section, homepage, children}) {
  const Name = homepage ? 'h1' : 'div'
  return (
    <div className="site" data-section={section}>
      <a className="skip-link" href="#main">跳到正文</a>
      <header className="header">
        <Name className="name">
          <Link to="/"><Dot />{site.name}</Link>
        </Name>
      </header>
      <main id="main" tabIndex={-1}>{children}</main>
      <footer className="footer">
        <nav className="footer-links" aria-label="站内导航">
          {navigation.map(item => (
            <NavLink key={item.id} to={item.path} end={item.path === '/'}>{item.label}</NavLink>
          ))}
        </nav>
        <p className="copyright">© {site.startYear} {site.name}. All rights reserved.</p>
      </footer>
    </div>
  )
}

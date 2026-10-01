# Frederick Deng 的个人网站

中文个人网站（React + Vite）。信息架构来自 `ia_website.html`（首页 / 小程序 / 推荐 / 音乐 / 随想 / 关于我），版式参考 [anniehu.com](https://anniehu.com/)：白底、系统字体、每个板块一种颜色的小圆点。

## 本地运行

需要 Node.js 22.22 或更高版本。

```sh
npm install
npm run dev      # http://localhost:3000，会显示草稿条目
npm run build    # 输出到 dist/：每个页面预渲染为静态 HTML，并生成 404.html
npm run preview  # 预览 dist/
```

## 更新内容

内容都在 `content/` 里，不需要改代码。

| 文件 | 内容 |
| --- | --- |
| `site.json` | 名字、一句话介绍（中英）、联系方式、友情链接、各板块的标题与简介 |
| `about.md` | 「关于我」正文（Markdown） |
| `apps.json` | 小程序：`kind`（分类）、`title`、`summary`、`tags`、`story`（为什么做）、`audience`（适合谁）、`url`（运行链接，默认 iframe 嵌入；不想嵌入就加 `"embed": false`）、`source`（源码链接） |
| `picks.json` | 推荐：`categories` 是分类，`items` 是条目（`category` 对应分类 `id`，另有 `story`、`for`、`rating` 1–5、`link`） |
| `music.json` | `nowPlaying`（正在听）、`playlist`（红心歌单链接）、`songs`（歌曲，点击跳转 QQ 音乐） |
| `reviews/*.md` | 乐评，文件名就是网址；frontmatter 写 `title`、`artist`、`type`、`date`（如 `2026-09-30`）、`mood`、`url`、`summary` |
| `thoughts/*.md` | 随想，frontmatter 写 `title`、`date`（如 `2026-09-30`）、`topic`（`love` / `meaning` / `daily`）、`summary`；正文支持 Markdown |
| `thoughts/topics.json` | 随想的主题 |

- **草稿**：带 `"draft": true`（Markdown 里写 `draft: true`）的条目只在 `npm run dev` 中显示并标注「草稿」，构建时自动隐藏。示例条目都是草稿：改成自己的内容，再删掉这一行即可发布。
- **先有内容，再有页面**：没有已发布内容的板块（目前是「推荐」和「音乐」）不会出现在导航和首页，也不会生成页面；发布第一条内容后自动出现。
- 随想的文件名不要和主题 id（`love`、`meaning`、`daily`）重名。
- 图片放进 `public/`（例如 `public/images/me.jpg`），内容里写 `images/me.jpg`。
- QQ 音乐没有公开 API，歌曲只是跳转到 QQ 音乐的分享链接，站内不播放。

## 发布

把 `npm run build` 生成的 `dist/` 部署到 GitHub Pages 等静态托管。如果站点不在域名根目录（例如 `https://用户名.github.io/仓库名/`），构建时设置 `BASE_PATH`：

```powershell
$env:BASE_PATH = '/仓库名/'; npm run build
```

import rss from '@astrojs/rss'
import sanitizeHtml from 'sanitize-html'
const postImportResult = import.meta.glob('./blog/*.md', { eager: true })
const posts = Object.values(postImportResult)

export const get = () =>
  rss({
    title: 'Fran Moreno | Blog',
    description: 'El Blog de Fran Moreno',
    site: 'https://franmoreno.com',
    items: posts.map((post) => ({
      link: post.url,
      title: post.frontmatter.title,
      pubDate: post.frontmatter.pubDate,
      content: sanitizeHtml(post.compiledContent())
    })),
    customData: `<language>es-es</language>`
  })

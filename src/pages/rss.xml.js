import rss from '@astrojs/rss'
import sanitizeHtml from 'sanitize-html'
import MarkdownIt from 'markdown-it'
const parser = new MarkdownIt()

import { getCollection } from 'astro:content'

const posts = await getCollection('blog')

posts.sort((a, b) => Date.parse(b.data.pubDate) - Date.parse(a.data.pubDate))

export const GET = () =>
  rss({
    title: 'Fran Moreno | Blog',
    description: 'El Blog de Fran Moreno',
    site: 'https://franmoreno.com',
    items: posts.map((post) => ({
      link: '/blog/' + post.id.replace(/\.md$/, ''),
      title: post.data.title,
      pubDate: post.data.pubDate,
      content: sanitizeHtml(parser.render(post.body ?? ''), {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img'])
      })
    })),
    customData: `<language>es-es</language>`
  })

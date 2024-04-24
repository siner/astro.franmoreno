import rss from '@astrojs/rss'
import sanitizeHtml from 'sanitize-html'
import MarkdownIt from 'markdown-it'
const parser = new MarkdownIt()

import { getCollection } from 'astro:content'

const posts = await getCollection('blog')

posts.sort((a, b) => Date.parse(b.data.date) - Date.parse(a.data.date))

export const get = () =>
  rss({
    title: 'Fran Moreno | Blog',
    description: 'El Blog de Fran Moreno',
    site: 'https://franmoreno.com',
    items: posts.map((post) => ({
      link: '/blog/' + post.slug,
      title: post.data.title,
      pubDate: post.data.pubDate,
      content: sanitizeHtml(parser.render(post.body), {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img'])
      })
    })),
    customData: `<language>es-es</language>`
  })

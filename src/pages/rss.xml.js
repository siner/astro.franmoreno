import rss from '@astrojs/rss'

export const get = () =>
  rss({
    title: 'Fran Moreno | Blog',
    description: 'El Blog de Fran Moreno',
    site: 'https://franmoreno.com',
    items: import.meta.glob('./blog/*.mdx'),
    customData: `<language>es-es</language>`
  })

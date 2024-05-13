// 1. Import utilities from `astro:content`
import { defineCollection, z } from 'astro:content'

const blogCollection = defineCollection({
  type: 'content', // v2.5.0 and later
  schema: z.object({
    layout: z.string(),
    title: z.string(),
    description: z.string().optional(),
    author: z.string(),
    pubDate: z.date(),
    date: z.date(),
    image: z.string().optional()
  })
})

export const collections = {
  blog: blogCollection
}

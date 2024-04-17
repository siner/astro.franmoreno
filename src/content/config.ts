// 1. Import utilities from `astro:content`
import { defineCollection, z } from 'astro:content'

const blogCollection = defineCollection({
  type: 'content', // v2.5.0 and later
  schema: z.object({
    layout: z.string(),
    title: z.string(),
    description: z.string().optional(),
    author: z.string(),
    pubDate: z.string(),
    date: z.string(),
    image: z.string().optional()
  })
})

export const collections = {
  blog: blogCollection
}

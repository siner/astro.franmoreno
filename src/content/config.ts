// 1. Import utilities from `astro:content`
import { defineCollection, z } from 'astro:content'

const blogCollection = defineCollection({
  type: 'content', // v2.5.0 and later
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      author: z.string().default('Fran Moreno'),
      pubDate: z
        .string()
        .or(z.date())
        .transform((val) => new Date(val)),
      modDate: z
        .string()
        .or(z.date())
        .optional()
        .transform((val) => (val ? new Date(val) : undefined)),
      heroImage: z.string(),
      altImage: z.string().optional(),
      tags: z.array(z.string()).default(['otros']),
      featured: z.boolean().optional(),
      draft: z.boolean().optional()
    })
})

export const collections = {
  blog: blogCollection
}

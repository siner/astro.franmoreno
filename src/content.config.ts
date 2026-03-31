import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'

const blogCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
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

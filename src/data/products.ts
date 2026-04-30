export interface Product {
  id: string
  title: string
  description: string
  price: string
  originalPrice?: string | null
  image: string
  features: string[]
  tags: string[]
  downloadSize: string
  gumroadUrl: string
  featured?: boolean
  category?: string
  launchDate?: Date
}

export const products: Product[] = [
  {
    id: 'nextjs-cloudflare-starter',
    title: 'Next.js + Cloudflare Pages Starter Kit',
    description:
      'Starter kit full-stack para lanzar aplicaciones Next.js 15 en el edge de Cloudflare con autenticación, base de datos y CI/CD listos para producción.',
    price: '€59',
    originalPrice: null,
    image: '/productos/nextjs-cloudflare-starter.jpg',
    features: [
      'Next.js 15 con App Router y Server Actions',
      'Deploy en Cloudflare Pages con @opennextjs/cloudflare',
      'Better Auth: email/password, Google OAuth y reset',
      'Drizzle ORM + Supabase (PostgreSQL) con esquema listo',
      'UI lista: dashboard, sidebar, formularios y toasts (Tailwind)',
      'CI/CD con GitHub Actions (push a main → deploy)',
      'Security headers preconfigurados',
      'README paso a paso: de cero a desplegado en ~30 minutos'
    ],
    tags: ['Next.js', 'Cloudflare', 'Auth', 'Drizzle'],
    downloadSize: 'ZIP + repo',
    gumroadUrl:
      'https://fransiner.gumroad.com/l/nextjs-cloudflare-starter-auth-database-edge-deploy',
    featured: true,
    category: 'Desarrollo',
    launchDate: new Date('2026-04-30')
  },
  {
    id: 'revision-pro-gtd-kit',
    title: 'Revision Pro GTD Kit',
    description:
      'Kit completo para implementar GTD de forma profesional con guía PDF, template de Notion, script de automatización y filtros optimizados.',
    price: '€19',
    originalPrice: null,
    image: '/productos/revision-pro-gtd-kit.jpg',
    features: [
      'Guía PDF "Revision Pro GTD" completa',
      'Template de Notion Premium prediseñado',
      'Script de automatización para Todoist',
      'Filtros y etiquetas GTD optimizados',
      'Dashboards visuales de productividad',
      'Reportes semanales automáticos',
      'Casos de uso reales documentados',
      'Soporte por email incluido'
    ],
    tags: ['Productividad', 'GTD', 'Notion', 'Todoist'],
    downloadSize: '13 MB',
    gumroadUrl: 'https://fransiner.gumroad.com/l/revision-pro-gtd-kit',
    featured: false,
    category: 'Productividad',
    launchDate: new Date('2024-12-01')
  }
]

// Funciones de utilidad para trabajar con productos
export const getFeaturedProducts = (): Product[] => {
  return products.filter((product) => product.featured)
}

export const getProductsByCategory = (category: string): Product[] => {
  return products.filter((product) => product.category === category)
}

export const getProductById = (id: string): Product | undefined => {
  return products.find((product) => product.id === id)
}

export const getAllCategories = (): string[] => {
  const categories = products
    .map((product) => product.category)
    .filter((category): category is string => category !== undefined)

  return [...new Set(categories)]
}

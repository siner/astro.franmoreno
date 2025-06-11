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
    featured: true,
    category: 'Productividad',
    launchDate: new Date('2024-12-01')
  }
  // Aquí se pueden añadir más productos en el futuro
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

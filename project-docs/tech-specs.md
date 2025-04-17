# Especificaciones Técnicas

## Stack Tecnológico

### Core

- **Framework**: [Astro v5.1.9](https://astro.build)
  - Framework web moderno enfocado en rendimiento y contenido estático
  - Integración con React para componentes interactivos
  - Soporte para MDX para contenido enriquecido

### Estilos y UI

- **CSS Framework**: Tailwind CSS (via @astrojs/tailwind v5.1.5)
  - Plugin de tipografía (@tailwindcss/typography v0.5.8)
  - Diseño responsive y mobile-first
  - Modo oscuro implementado
  - Sistema de diseño consistente con variables CSS

### Contenido y Data

- **Formato de Contenido**: MDX (@astrojs/mdx v4.0.7)
  - Markdown mejorado con componentes React
  - Procesamiento de contenido con markdown-it v14.1.0
  - Sanitización HTML (sanitize-html v2.8.0)
- **RSS Feed**: @astrojs/rss v4.0.11

### Desarrollo

- **Lenguaje**: TypeScript v5.2.2
- **Herramientas de Desarrollo**:
  - Prettier con soporte Astro (prettier-plugin-astro v0.14.0)
  - ESLint con soporte para React Hooks
  - Wrangler v3.0.0 para desarrollo con Cloudflare

### Despliegue

- **Plataforma**: Cloudflare Pages (@astrojs/cloudflare v12.2.1)
  - Despliegue automático
  - Edge Functions
  - Caché global

## Estándares de Codificación

### Generales

- Nombres de archivos en kebab-case
- Tipado estricto con TypeScript
- Comentarios descriptivos en español
- Código y variables en inglés

### Componentes

- Componentes Astro para UI estática
- Componentes React para interactividad cuando sea necesario
- Props tipadas y documentadas
- Estilos con Tailwind, organizados por layout, componentes y utilidades

### Contenido

- Markdown/MDX para contenido de blog
- Frontmatter para metadata
- Imágenes optimizadas para web
- Rutas de archivos consistentes

## Estructura de Directorios

```
src/
  ├── content/
  │   └── blog/          # Posts del blog en MDX
  ├── components/        # Componentes de Astro y React
  │   ├── ui/           # Componentes de interfaz reutilizables
  │   └── blog/         # Componentes específicos del blog
  ├── layouts/          # Plantillas de página
  ├── pages/            # Rutas y páginas
  └── styles/           # Estilos globales y configuración Tailwind
public/
  ├── blog/             # Imágenes y assets de los posts
  └── assets/           # Assets globales
```

## Convenciones de Nombrado

### Archivos

- Posts: `tema-descriptivo-YYYY.mdx`
- Imágenes: `nombre-descriptivo.{webp|jpg}`
- Componentes Astro: `ComponentName.astro`
- Componentes React: `ComponentName.tsx`

### Código

- Componentes: PascalCase
- Funciones y variables: camelCase
- Constantes: UPPER_SNAKE_CASE
- Tipos TypeScript: PascalCase con prefijo T o I (interfaces)

## Optimizaciones

- Imágenes servidas en formato WebP cuando sea posible
- Lazy loading de imágenes y componentes pesados
- Prefetch de rutas comunes
- Minificación de assets en producción
- Cache-Control headers optimizados

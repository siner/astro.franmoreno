# Requisitos y Características del Blog

## Estructura de Posts

Cada post del blog debe seguir esta estructura en el frontmatter:

```markdown
---
title: 'Título del Post'
pubDate: YYYY-MM-DDT00:00:00.000Z
date: YYYY-MM-DD
author: Fran Moreno
type: default
heroImage: /blog/imagen-destacada.jpg
image: /blog/imagen-destacada.jpg
description: 'Descripción breve del post'
---
```

### Requisitos de Posts

- Los archivos deben estar en formato Markdown
- Ubicación: `src/content/blog/`
- Nombre de archivo: kebab-case descriptivo
- Imágenes destacadas: almacenadas en `/public/blog/`

## Características del Blog

- Listado de posts ordenados por fecha
- Páginas individuales para cada post
- Soporte para imágenes y código resaltado
- Optimización SEO
- Diseño responsive

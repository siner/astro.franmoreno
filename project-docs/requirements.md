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
- Se permite la publicación de artículos personales y de bienestar, como el nuevo post sobre jardinería y crecimiento personal

## Características del Blog

- Listado de posts ordenados por fecha
- Páginas individuales para cada post
- Soporte para imágenes y código resaltado
- Optimización SEO
- Diseño responsive

## Características de Productos

- Página dedicada de productos digitales (`/productos`)
- Componente reutilizable `ProductCard` para mostrar productos
- Integración con Gumroad para procesamiento de pagos
- Sección de productos destacados en la página principal
- Navegación actualizada con enlace a productos
- Diseño responsive y consistente con el resto del sitio

### Estructura de Productos

Cada producto debe incluir:

- ID único
- Título y descripción
- Precio (y precio original si hay descuento)
- Imagen representativa
- Lista de características/beneficios
- Tags para categorización
- Tamaño de descarga
- URL de Gumroad para la compra
- Flag de producto destacado (opcional)

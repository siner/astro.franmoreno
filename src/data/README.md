# Gestión de Productos Digitales

Este directorio contiene la configuración y datos de los productos digitales del sitio web.

## Estructura

- `products.ts` - Configuración centralizada de todos los productos
- `README.md` - Esta documentación

## Cómo añadir un nuevo producto

1. **Añadir el producto al array `products` en `products.ts`:**

```typescript
{
  id: 'mi-nuevo-producto',
  title: 'Mi Nuevo Producto',
  description: 'Descripción breve y atractiva del producto',
  price: '€29',
  originalPrice: '€39', // Opcional, para mostrar descuentos
  image: '/productos/mi-nuevo-producto.jpg',
  features: [
    'Característica 1',
    'Característica 2',
    'Característica 3'
  ],
  tags: ['Tag1', 'Tag2'],
  downloadSize: '25 MB',
  gumroadUrl: 'https://fransiner.gumroad.com/l/mi-nuevo-producto',
  featured: true, // Opcional, para destacar en la home
  category: 'Productividad', // Opcional, para categorización
  launchDate: new Date('2024-12-15') // Opcional
}
```

2. **Añadir la imagen del producto:**

   - Subir la imagen a `/public/productos/`
   - Usar formato WebP para mejor rendimiento
   - Tamaño recomendado: 800x600px (ratio 4:3)

3. **Crear la página de Gumroad:**
   - Configurar el producto en Gumroad
   - Obtener la URL de compra
   - Añadir la URL al campo `gumroadUrl`

## Campos del producto

### Obligatorios

- `id`: Identificador único (kebab-case)
- `title`: Título del producto
- `description`: Descripción breve
- `price`: Precio con símbolo de moneda
- `image`: Ruta a la imagen del producto
- `features`: Array de características principales
- `tags`: Array de etiquetas para categorización
- `downloadSize`: Tamaño del archivo descargable
- `gumroadUrl`: URL de compra en Gumroad

### Opcionales

- `originalPrice`: Precio original (para mostrar descuentos)
- `featured`: Si debe aparecer destacado en la home
- `category`: Categoría del producto
- `launchDate`: Fecha de lanzamiento

## Funciones de utilidad

El archivo `products.ts` incluye funciones de utilidad:

- `getFeaturedProducts()`: Obtiene productos destacados
- `getProductsByCategory(category)`: Filtra por categoría
- `getProductById(id)`: Busca un producto específico
- `getAllCategories()`: Lista todas las categorías

## Buenas prácticas

1. **Imágenes**: Usar formato WebP y optimizar para web
2. **Descripciones**: Mantener entre 100-150 caracteres
3. **Características**: Listar máximo 8 características principales
4. **Tags**: Usar máximo 4 tags por producto
5. **IDs**: Usar kebab-case y ser descriptivos
6. **Precios**: Incluir siempre el símbolo de moneda

## Integración con Gumroad

Los productos se integran automáticamente con Gumroad para el procesamiento de pagos. Asegúrate de:

1. Configurar correctamente el producto en Gumroad
2. Usar la URL correcta en el campo `gumroadUrl`
3. Mantener sincronizados los precios entre ambas plataformas

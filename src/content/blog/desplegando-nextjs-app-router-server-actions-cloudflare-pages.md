---
title: 'Desplegando una App Next.js (App Router) con Server Actions en Cloudflare Pages (Funciones Incluidas)'
description: 'Tutorial completo para desplegar aplicaciones Next.js con App Router y Server Actions en Cloudflare Pages, aprovechando las funciones serverless.'
author: 'Fran Moreno'
heroImage: '/blog/nextjs-cloudflare-deployment.jpg'
heroAlt: 'Next.js + Cloudflare Pages Deployment'
pubDate: '2025-10-03'
tags:
  [
    'Next.js',
    'Cloudflare',
    'Despliegue',
    'App Router',
    'Server Actions',
    'Serverless',
    'Hosting'
  ]
draft: false
---

Si has seguido la evolución de [Next.js](https://nextjs.org/) y has experimentado con el nuevo [App Router](https://nextjs.org/docs/app), seguramente te has topado con las [Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations). Son una característica potente que permite ejecutar código del servidor directamente desde componentes cliente, simplificando enormemente el manejo de formularios y mutaciones de datos.

Hasta hace poco, desplegar aplicaciones Next.js con estas características modernas en [Cloudflare Pages](https://pages.cloudflare.com/) era complicado o directamente imposible. Sin embargo, con las últimas mejoras en el soporte de Cloudflare para Next.js y las funciones serverless, ahora es posible y sorprendentemente sencillo.

En este tutorial te muestro paso a paso cómo desplegar una aplicación Next.js completa con App Router y Server Actions en Cloudflare Pages, aprovechando al máximo la infraestructura global de Cloudflare.

## ¿Por qué Cloudflare Pages para Next.js?

Antes de saltar al tutorial, déjame explicarte por qué considero que Cloudflare Pages es una excelente opción para alojar aplicaciones Next.js en 2025:

### Ventajas de Cloudflare Pages

1. **Red Global**: Más de 275+ ubicaciones en todo el mundo significa que tu aplicación estará cerca de tus usuarios.
2. **Funciones Serverless Incluidas**: Soporte nativo para Server Actions y API Routes sin configuración adicional.
3. **Precios Competitivos**: Plan gratuito muy generoso, ideal para proyectos personales y startups.
4. **Rendimiento Excelente**: CDN integrado y optimizaciones automáticas.
5. **Facilidad de Despliegue**: Integración directa con GitHub y GitLab.

Como mencioné en mi [experiencia moviendo proyectos a Cloudflare](/blog/moviendo-mis-side-projects-a-cloudflare/), he tenido muy buenas experiencias con su plataforma, especialmente en términos de rendimiento y costos.

## Requisitos Previos

Para seguir este tutorial, necesitarás:

- Node.js 18+ instalado
- Una cuenta en [Cloudflare](https://cloudflare.com)
- Una cuenta en GitHub (para el despliegue automático)
- Conocimientos básicos de React y Next.js
- Familiaridad con el App Router de Next.js

## Paso 1: Creando la Aplicación Next.js de Ejemplo

Vamos a crear una aplicación Next.js desde cero que incluya tanto el App Router como Server Actions. Esta será nuestra aplicación de prueba.

```bash
npx create-next-app@latest nextjs-cloudflare-demo
cd nextjs-cloudflare-demo
```

Durante la instalación, asegúrate de seleccionar:

- ✅ TypeScript
- ✅ ESLint
- ✅ Tailwind CSS
- ✅ `src/` directory
- ✅ App Router
- ❌ Turbopack (opcional, pero recomendado para desarrollo)

## Paso 2: Configurando la Estructura del Proyecto

Vamos a crear una aplicación simple con un formulario que utilice Server Actions. Esta demostración incluirá:

1. Una página principal con un formulario
2. Server Actions para manejar el envío del formulario
3. Gestión de estado para mostrar mensajes de éxito/error

### Creando la Página Principal

Primero, vamos a modificar `src/app/page.tsx`:

```tsx
import { ContactForm } from '@/components/ContactForm'
import { Suspense } from 'react'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Next.js + Cloudflare Pages
          </h1>
          <p className="text-xl text-gray-600">
            Demo de App Router con Server Actions desplegado en Cloudflare Pages
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Formulario de Contacto
          </h2>
          <Suspense fallback={<div>Cargando formulario...</div>}>
            <ContactForm />
          </Suspense>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-500">
            Este formulario utiliza Server Actions para procesar los datos
          </p>
        </div>
      </div>
    </main>
  )
}
```

### Creando las Server Actions

Ahora vamos a crear nuestras Server Actions. Crea el archivo `src/app/actions.ts`:

```tsx
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export type FormState = {
  message: string
  type: 'success' | 'error' | null
}

export async function submitContactForm(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  // Extraer datos del formulario
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const message = formData.get('message') as string

  // Validación básica
  if (!name || !email || !message) {
    return {
      message: 'Todos los campos son obligatorios',
      type: 'error'
    }
  }

  // Validación de email básica
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return {
      message: 'Por favor, introduce un email válido',
      type: 'error'
    }
  }

  try {
    // Simular procesamiento (aquí conectarías con tu base de datos, API externa, etc.)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // En un caso real, aquí guardarías en base de datos, enviarías email, etc.
    console.log('Datos del formulario:', { name, email, message })

    // Revalidar la página para mostrar los cambios
    revalidatePath('/')

    return {
      message: `¡Gracias ${name}! Tu mensaje ha sido enviado correctamente.`,
      type: 'success'
    }
  } catch (error) {
    console.error('Error procesando formulario:', error)
    return {
      message: 'Error interno del servidor. Inténtalo de nuevo.',
      type: 'error'
    }
  }
}

// Server Action alternativa que muestra redirect
export async function submitAndRedirect(formData: FormData) {
  const name = formData.get('name') as string

  if (!name) {
    throw new Error('Nombre es requerido')
  }

  // Procesar datos...
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Redirigir a página de éxito
  redirect(`/success?name=${encodeURIComponent(name)}`)
}
```

### Creando el Componente del Formulario

Crea `src/components/ContactForm.tsx`:

```tsx
'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { submitContactForm, type FormState } from '@/app/actions'

const initialState: FormState = {
  message: '',
  type: null
}

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
    >
      {pending ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Enviando...
        </>
      ) : (
        'Enviar Mensaje'
      )}
    </button>
  )
}

export function ContactForm() {
  const [state, formAction] = useFormState(submitContactForm, initialState)

  return (
    <form action={formAction} className="space-y-6">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Nombre completo
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Tu nombre"
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="tu@email.com"
        />
      </div>

      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Mensaje
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          placeholder="Escribe tu mensaje aquí..."
        />
      </div>

      <SubmitButton />

      {state.message && (
        <div
          className={`p-4 rounded-lg ${
            state.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          <p className="text-sm font-medium">{state.message}</p>
        </div>
      )}
    </form>
  )
}
```

### Creando la Página de Éxito (Opcional)

Crea `src/app/success/page.tsx`:

```tsx
import Link from 'next/link'
import { Suspense } from 'react'

function SuccessContent({ searchParams }: { searchParams: { name?: string } }) {
  const name = searchParams.name || 'Usuario'

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-12 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              ¡Mensaje Enviado!
            </h1>
            <p className="text-xl text-gray-600">
              Gracias {decodeURIComponent(name)}, tu mensaje ha sido procesado
              correctamente.
            </p>
          </div>

          <Link
            href="/"
            className="inline-block bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Volver al Inicio
          </Link>
        </div>
      </div>
    </main>
  )
}

export default function SuccessPage({
  searchParams
}: {
  searchParams: { name?: string }
}) {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <SuccessContent searchParams={searchParams} />
    </Suspense>
  )
}
```

## Paso 3: Configuración para Cloudflare Pages

Ahora viene la parte crucial: configurar Next.js para que funcione correctamente en Cloudflare Pages.

### Instalando el Adaptador de Cloudflare

```bash
npm install @opennextjs/cloudflare
```

> **Nota**: `@opennextjs/cloudflare` es la herramienta oficial actualizada para desplegar Next.js en Cloudflare Pages. Reemplaza al anterior `@cloudflare/next-on-pages` y ofrece mejor soporte para las características modernas de Next.js como Server Actions y el App Router.

### Configurando next.config.js

Crea o modifica `next.config.js` en la raíz del proyecto:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración para Cloudflare Pages
  experimental: {
    runtime: 'nodejs'
  },

  // Optimizaciones para Cloudflare
  images: {
    unoptimized: true // Cloudflare optimiza las imágenes por defecto
  },

  // Configuración adicional para mejor compatibilidad
  swcMinify: true,

  // Headers de seguridad (opcional pero recomendado)
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          }
        ]
      }
    ]
  }
}

module.exports = nextConfig
```

### Configuración de Package.json

Actualiza los scripts en tu `package.json`:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "pages:build": "opennextjs-cloudflare build",
    "preview": "npm run pages:build && opennextjs-cloudflare preview",
    "deploy": "npm run pages:build && opennextjs-cloudflare deploy",
    "cf-typegen": "wrangler types --env-interface CloudflareEnv cloudflare-env.d.ts"
  }
}
```

### Configuración de OpenNext

Crea un archivo `open-next.config.ts` en la raíz del proyecto:

```typescript
import { defineCloudflareConfig } from '@opennextjs/cloudflare'

export default defineCloudflareConfig({
  // Configuraciones específicas para tu proyecto
  experimental: {
    // Habilitar características experimentales si es necesario
  }
})
```

## Paso 4: Preparando el Repositorio

### Estructura Final del Proyecto

Tu proyecto debería tener esta estructura:

```bash
nextjs-cloudflare-demo/
├── src/
│   ├── app/
│   │   ├── actions.ts
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── success/
│   │       └── page.tsx
│   └── components/
│       └── ContactForm.tsx
├── next.config.js
├── open-next.config.ts
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

### Archivo .gitignore

Asegúrate de que tu `.gitignore` incluya:

```bash
# Dependencies
node_modules/

# Next.js
.next/
out/

# OpenNext y Cloudflare
.open-next/
.wrangler/

# Environment variables
.env*.local

# Logs
*.log

# Runtime data
pids
*.pid
*.seed
*.pid.lock
```

### Commiteando el Código

```bash
git add .
git commit -m "feat: Aplicación Next.js con App Router y Server Actions para Cloudflare Pages"
git push origin main
```

## Desarrollo y Previsualización Local

Antes de desplegar, es importante probar localmente con el runtime de Cloudflare:

### Desarrollo Regular

Para desarrollo regular, usa el servidor de Next.js:

```bash
npm run dev
```

### Previsualización con Runtime de Cloudflare

Para probar cómo funcionará en producción:

```bash
npm run preview
```

Este comando:

1. Construye tu aplicación con el adaptador de OpenNext
2. La sirve localmente usando el runtime de `workerd` (mismo que usa Cloudflare)
3. Te permite probar Server Actions y otras características específicas de Cloudflare

## Paso 5: Configurando Cloudflare Pages

### Creando el Proyecto en Cloudflare Pages

1. Ve a [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navega a **Pages** en el menú lateral
3. Haz clic en **"Crear Proyecto"**
4. Selecciona **"Conectar a Git"**
5. Autoriza a Cloudflare a acceder a tu repositorio de GitHub
6. Selecciona tu repositorio `nextjs-cloudflare-demo`

### Configuración de Build

En la pantalla de configuración de build, usa estos ajustes:

- **Framework preset**: Next.js
- **Build command**: `npm run pages:build`
- **Build output directory**: `.open-next/static` (o `.open-next` según la configuración)
- **Root directory**: `/` (raíz del proyecto)

### Variables de Entorno (Opcional)

Si tu aplicación necesita variables de entorno, puedes agregarlas en la sección **"Variables de Entorno"**:

```bash
NODE_VERSION=18
NEXT_TELEMETRY_DISABLED=1
```

### Configuración Avanzada

En **"Configuración Avanzada"**, puedes ajustar:

- **Compatibility flags**: `nodejs_compat` (para Server Actions)
- **Node.js compatibility**: Habilitado

## Paso 6: Despliegue y Verificación

### Iniciando el Despliegue

Haz clic en **"Guardar y Desplegar"**. Cloudflare comenzará a:

1. Clonar tu repositorio
2. Instalar dependencias (`npm install`)
3. Ejecutar el build (`npm run pages:build`)
4. Desplegar a la red global de Cloudflare

### Monitoreando el Progreso

Puedes seguir el progreso del despliegue en tiempo real. El proceso típicamente toma 2-5 minutos.

### Verificando la Funcionalidad

Una vez completado el despliegue:

1. **Visita tu sitio**: Cloudflare te proporcionará una URL (ej: `https://nextjs-cloudflare-demo.pages.dev`)
2. **Prueba el formulario**: Completa y envía el formulario de contacto
3. **Verifica las Server Actions**: El formulario debería procesarse correctamente en el servidor
4. **Revisa las funciones**: En el dashboard de Cloudflare, ve a **Pages > Tu Proyecto > Funciones** para ver las estadísticas de uso

## Paso 7: Configuración de Dominio Personalizado (Opcional)

### Agregando tu Dominio

Si tienes un dominio personalizado:

1. Ve a **Pages > Tu Proyecto > Configuración**
2. Haz clic en **"Dominios Personalizados"**
3. Haz clic en **"Configurar dominio personalizado"**
4. Introduce tu dominio (ej: `mi-app.midominio.com`)
5. Sigue las instrucciones para configurar los registros DNS

### Configurando SSL

Cloudflare proporciona SSL automáticamente. Para dominios personalizados:

1. Asegúrate de que tu dominio esté gestionado por Cloudflare
2. Habilita **"SSL/TLS Encryption Mode: Full"**
3. Activa **"Always Use HTTPS"**

## Optimizaciones y Mejores Prácticas

### Performance

1. **Caching**: Cloudflare cachea automáticamente assets estáticos
2. **Minification**: Habilitada por defecto para CSS, JS y HTML
3. **Brotli Compression**: Automática para mejor compresión

### Seguridad

```js
// next.config.js - Headers de seguridad adicionales
async headers() {
  return [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=31536000; includeSubDomains'
        },
        {
          key: 'Content-Security-Policy',
          value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'"
        }
      ]
    }
  ]
}
```

### Monitoreo

1. **Analytics**: Habilita Cloudflare Web Analytics
2. **Real User Monitoring**: Para métricas de rendimiento real
3. **Logs**: Revisa logs de funciones para debugging

## Troubleshooting Común

### Problemas con Server Actions

**Error**: "Server Actions not working"
**Solución**:

- Verifica que `nodejs_compat` esté habilitado
- Asegúrate de usar `'use server'` al inicio de tus actions
- Revisa los logs de funciones en Cloudflare

### Build Failures

**Error**: "Build failed"
**Solución**:

- Verifica que `@opennextjs/cloudflare` esté instalado
- Usa Node.js 18+
- Revisa la configuración de `next.config.js`

### Runtime Errors

**Error**: "Runtime errors in production"
**Solución**:

- Revisa los logs de Pages Functions
- Verifica compatibilidad de dependencias con Workers Runtime
- Considera usar polyfills si es necesario

## Limitaciones a Considerar

### Compatibilidad del Adaptador OpenNext

1. **Compatibilidad con Windows**: Actualmente, `@opennextjs/cloudflare` no es totalmente compatible con Windows. Se espera compatibilidad completa en la versión 1.0.

2. **Runtime de Edge**: El adaptador actualmente solo soporta el runtime de Node.js de Next.js. El soporte para Edge Runtime está planificado para la próxima versión principal.

3. **Características Experimentales**: Algunas características experimentales de Next.js como `use cache` aún no están soportadas pero se añadirán en futuras versiones.

### Workers Runtime Limitations

1. **CPU Time**: Límite de 30 segundos por request en plan gratuito
2. **Memory**: Límite de memoria más restrictivo que Node.js tradicional
3. **APIs**: Algunas APIs de Node.js no están disponibles en el runtime de Workers

### Next.js Features

1. **Middleware**: Soporte limitado, usa Workers en su lugar
2. **Custom Server**: No soportado, usa funciones en su lugar
3. **Incremental Static Regeneration**: Funcionalidad limitada

## Conclusión

Desplegar Next.js con App Router y Server Actions en Cloudflare Pages usando `@opennextjs/cloudflare` es ahora más accesible y robusto que nunca. Este adaptador oficial, desarrollado por OpenNext, ofrece mejor compatibilidad y soporte para las características modernas de Next.js.

La combinación de la red global de Cloudflare, las funciones serverless integradas y el soporte mejorado para Next.js hace de esta una opción muy atractiva para aplicaciones modernas, especialmente considerando que OpenNext se ha convertido en el estándar para desplegar Next.js en entornos serverless fuera de Vercel.

### Ventajas Clave

1. **Rendimiento Global**: Tu aplicación estará disponible desde +275 ubicaciones
2. **Costo Efectivo**: Plan gratuito muy generoso
3. **Escalabilidad Automática**: Sin configuración de infraestructura
4. **Simplicidad**: Despliegue automático desde Git
5. **Funciones Incluidas**: Server Actions funcionan out-of-the-box

### Próximos Pasos

- Conecta una base de datos (considera [Supabase](https://supabase.com/) o [PlanetScale](https://planetscale.com/))
- Implementa autenticación con [Better Auth](https://better-auth.com/)
- Agrega análisis con [Cloudflare Analytics](https://www.cloudflare.com/web-analytics/)
- Explora [Cloudflare Workers](https://workers.cloudflare.com/) para lógica adicional

¿Has probado Next.js en Cloudflare Pages? ¿Qué tal ha sido tu experiencia? ¡Me encantaría conocer tus casos de uso y cualquier truco adicional que hayas descubierto!

_Si quieres explorar otras opciones de hosting o comparar con otros stacks, puedes revisar mi [análisis de herramientas de desarrollo fullstack](/blog/3-herramientas-desarrollo-fullstack-2025/) o mi [experiencia personal con Next.js vs Astro](/blog/experiencia-nextjs-vs-astro-proyectos-personales/)._

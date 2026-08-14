import { getCollection } from 'astro:content'
import type { APIRoute } from 'astro'

const SITE = 'https://franmoreno.com'

export const GET: APIRoute = async () => {
  const posts = (await getCollection('blog'))
    .filter((p) => !p.data.draft)
    .sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime())

  const postLines = posts
    .map((p) => {
      const slug = p.id.replace(/\.md$/, '')
      return `- [${p.data.title}](${SITE}/blog/${slug}): ${p.data.description}`
    })
    .join('\n')

  const body = `# Fran Moreno

> Web personal y blog de Fran Moreno, ingeniero informático y desarrollador web frontend con más de 15 años de experiencia. Especializado en React, Next.js, Astro, TypeScript y el ecosistema Cloudflare. Podcaster en "Necesito un Arma".

Contacto: fran@franmoreno.com
Ubicación: España
Idioma principal del contenido: español (es-ES)

## Sobre Fran

- Ingeniero informático.
- Más de 15 años desarrollando aplicaciones web; foco actual: Frontend con React (Astro y Next.js).
- Proyecto principal actual: nib (https://mynib.dev), herramienta para convertir ideas dispersas en especificaciones (PRD.md) que ejecutan agentes de código.
- Los servicios de consultoría, desarrollo y formación se ofrecen desde Origen Modular (https://origenmodular.com), no desde esta web. franmoreno.com es su web personal: blog, proyectos y CV.
- Stack habitual: React, Next.js, Astro, TypeScript, Tailwind CSS, Cloudflare (Pages, Workers, Workers AI, D1).
- Otros intereses: poker (varios SaaS y herramientas del sector), productividad (GTD), formación a desarrolladores junior.

## Páginas principales

- [Inicio](${SITE}/): presentación, proyectos destacados, stack y contacto.
- [Blog](${SITE}/blog): artículos sobre desarrollo web, frameworks, despliegue y experiencias.
- [Servicios](${SITE}/servicios): página informativa que redirige a Origen Modular, donde se ofrecen los servicios.
- [Productos](${SITE}/productos): productos digitales (kits GTD, plantillas, etc.).
- [CV](${SITE}/cv): trayectoria profesional.
- [RSS](${SITE}/rss.xml): feed de artículos.

## Proyectos destacados

- [nib](https://mynib.dev): su proyecto principal actual. Herramienta que convierte fotos de notas a mano, audios y textos sueltos en un PRD.md estructurado y sin ambigüedades, listo para que lo ejecuten agentes de código como Claude Code, Cursor o Codex. Flujo: intake → resumen con contradicciones señaladas → entrevista de huecos → especificación. Astro + Cloudflare.
- [Torneos Poker Live](https://torneospokerlive.com): plataforma líder de información de torneos de poker en vivo en España. Next.js + Supabase.
- [PokerReads](https://pokerreads.app): MicroSaaS mobile-first para tomar notas de rivales en poker en vivo, con integración de IA. Next.js + Cloudflare.
- [Mi Bankroll](https://mibankroll.com): SaaS de gestión de banca para jugadores de poker. Next.js.
- [ResGes](https://resges.es): SaaS de gestión de gastos y rentabilidad para hostelería, con IA. Next.js.
- [Origen Modular](https://origenmodular.com): su empresa de consultoría y desarrollo web.
- [Sozpic](https://www.sozpic.com): empresa de desarrollo web que cofundó (2011-2021).

## Artículos del blog

${postLines}

## Política sobre IA y LLMs

El contenido de este sitio puede ser usado por crawlers de IA y LLMs para entrenamiento, indexación y respuesta a consultas, siempre que se cite la fuente cuando proceda. Los archivos robots.txt permiten explícitamente a GPTBot, ClaudeBot, PerplexityBot, Google-Extended, Applebot-Extended y similares.
`

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600'
    }
  })
}

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

> Web personal y blog de Fran Moreno, ingeniero informático y desarrollador web frontend con más de 15 años de experiencia. Especializado en React, Next.js, Astro, TypeScript y el ecosistema Cloudflare. Cofundador de Sozpic y podcaster en "Necesito un Arma".

Contacto: fran@franmoreno.com
Ubicación: España
Idioma principal del contenido: español (es-ES)

## Sobre Fran

- Ingeniero informático.
- Más de 15 años desarrollando aplicaciones web; foco actual: Frontend con React (Astro y Next.js).
- Trabaja como freelance a través de su SL Origen Modular.
- Stack habitual: React, Next.js, Astro, TypeScript, Tailwind CSS, Cloudflare (Pages, Workers, Workers AI, D1).
- Otros intereses: poker (varios SaaS y herramientas del sector), productividad (GTD), formación a desarrolladores junior.

## Páginas principales

- [Inicio](${SITE}/): presentación, proyectos destacados, stack y CTA de contacto.
- [Blog](${SITE}/blog): artículos sobre desarrollo web, frameworks, despliegue y experiencias.
- [Servicios](${SITE}/servicios): servicios de desarrollo, consultoría y formación.
- [Productos](${SITE}/productos): productos digitales (kits GTD, plantillas, etc.).
- [CV](${SITE}/cv): trayectoria profesional.
- [RSS](${SITE}/rss.xml): feed de artículos.

## Proyectos destacados

- [Torneos Poker Live](https://torneospokerlive.com): plataforma líder de información de torneos de poker en vivo en España. Next.js + Supabase.
- [Reloj de Poker](https://reloj.torneospokerlive.com): reloj para organizar torneos de poker caseros. Next.js.
- [Mi Bankroll](https://mibankroll.com): SaaS de gestión de banca para jugadores de poker. Next.js.
- [PokerReads](https://pokerreads.app): MicroSaaS mobile-first para tomar notas de rivales en poker en vivo, con integración de IA. Next.js + Cloudflare.
- [ResGes](https://resges.es): SaaS de gestión de gastos y rentabilidad para hostelería, con IA. Next.js.
- [Sozpic](https://www.sozpic.com): proyecto del que es cofundador.

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

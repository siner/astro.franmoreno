---
title: 'OpenNext en Cloudflare: los límites reales que me he encontrado (Parte 1)'
description: 'Cloudflare ya recomienda Workers en lugar de Pages para Next.js. Te cuento el giro de plataforma y los límites reales de OpenNext que ningún tutorial menciona.'
author: 'Fran Moreno'
heroImage: '/blog/opennext-cloudflare-limites.jpg'
heroAlt: 'OpenNext y Next.js en Cloudflare Workers'
pubDate: '2026-07-10'
tags:
  [
    'Next.js',
    'Cloudflare',
    'OpenNext',
    'Workers',
    'Serverless',
    'Despliegue',
    'Edge'
  ]
draft: false
---

Hace unos meses publiqué un [tutorial paso a paso para desplegar Next.js con App Router y Server Actions en Cloudflare Pages](/blog/desplegando-nextjs-app-router-server-actions-cloudflare-pages/). Funcionaba, y como referencia conceptual sigue siendo válido, pero si lo abres hoy verás una nota mía al principio avisando de algo importante: **el terreno se ha movido, y bastante.**

Desde entonces he seguido desplegando proyectos reales sobre esta infraestructura (el SaaS de gestión para hostelería en el que ando metido y [PokerReads](https://pokerreads.com), mi proyecto de notas de póker), y me he ido chocando con una serie de límites que ningún tutorial de "despliega Next.js en Cloudflare en 5 minutos" te cuenta. Ni el mío, para ser justos.

Así que este artículo es el complemento honesto de aquel tutorial: **lo que aprendes cuando pasas de la demo a producción.** Es la Parte 1 de dos, porque hay tela que cortar. Empezamos por lo estructural: el cambio de plataforma, el runtime, el tamaño del bundle y el famoso (y malentendido) límite de CPU. En la Parte 2 iré a la caché, el ISR, los bugs concretos que te comen una tarde y mi veredicto sobre cuándo NO merece la pena.

¡Vamos al lío!

## Lo primero: Cloudflare ya no te lleva a Pages, te lleva a Workers

Este es el cambio que invalida parte de mi tutorial anterior y por el que le he tenido que poner una nota de aviso.

Cuando escribí aquello, el flujo natural para Next.js era Cloudflare **Pages**. Hoy, [la propia documentación de Cloudflare](https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/) te scaffoldea el proyecto directamente sobre **Workers** con Static Assets, y el adaptador de [OpenNext](https://opennext.js.org/cloudflare) (`@opennextjs/cloudflare`) es ya la forma recomendada de desplegar Next en Cloudflare, en lugar del antiguo `@cloudflare/next-on-pages`.

El comando de partida ahora es:

```bash
npm create cloudflare@latest -- my-next-app --framework=next
```

Y la configuración ya no vive en la UI de Pages, sino en tu `wrangler.jsonc` (o `.toml`), apuntando al worker que genera OpenNext:

```jsonc
{
  "main": ".open-next/worker.js",
  "name": "mi-app",
  "compatibility_date": "2024-09-23", // o posterior; ponla a la fecha de hoy
  "compatibility_flags": ["nodejs_compat"],
  "assets": {
    "directory": ".open-next/assets",
    "binding": "ASSETS"
  }
}
```

¿Por qué el cambio? Porque `next-on-pages` solo soportaba el runtime **Edge** de Next.js, que es una versión recortada que no te deja usar muchas features del framework. OpenNext, en cambio, corre tu app sobre el runtime **Node.js** que expone el propio Workers, mucho más completo. Es un cambio de filosofía: en vez de adaptar tu app a las limitaciones del Edge, Cloudflare ha acercado su runtime a lo que Next.js espera.

La consecuencia práctica para ti: si vienes de un proyecto en Pages con `next-on-pages`, **la migración a Workers + OpenNext no es opcional a medio plazo.** Y si empiezas de cero hoy, ignora los tutoriales (el mío incluido) que te lleven por Pages. Es el punto de partida de todo lo demás.

## El runtime: Node.js sí, Edge no (y por qué es buena noticia)

Aquí está el primer gotcha con el que la gente se pega, porque es contraintuitivo viniendo del mundo Cloudflare.

Durante años, "Cloudflare = Edge". Y sin embargo, con OpenNext **el runtime Edge de Next.js no está soportado.** Si tienes esto en algún archivo, lo tienes que quitar antes de desplegar:

```ts
export const runtime = 'edge' // ❌ fuera con OpenNext
```

Tu app corre sobre el runtime Node.js, con acceso a las APIs de Node que Workers va exponiendo (por eso el flag `nodejs_compat` es obligatorio, junto con una `compatibility_date` igual o posterior a `2024-09-23`).

Lo llamo buena noticia porque, en la práctica, el runtime Node.js te quita más problemas de los que te da: puedes usar librerías que asumen APIs de Node sin pelearte con polyfills, y evitas esa clase de errores de "esto funciona en local pero peta en el Edge" que tanto dolor de cabeza daban. El coste es mental: tienes que desaprender el reflejo de marcar todo como Edge. En mis proyectos, dejar de pensar en Edge y asumir Node.js simplificó bastante las cosas.

## El límite que más me ha dolido: el tamaño del bundle

Este no sale en ningún tutorial y es el que más quebraderos de cabeza me ha dado en el SaaS.

Los Workers tienen un **límite de tamaño de script**: [3 MB en el plan gratuito y 10 MB en el de pago](https://developers.cloudflare.com/workers/platform/limits/), comprimido (gzip). Y una app Next.js de tamaño medio, con sus dependencias, se acerca a ese techo antes de lo que imaginas.

El problema es que no siempre es tu código el culpable, sino dependencias transitivas que ni sabías que estaban ahí. Un ejemplo real que dio mucha guerra en la comunidad: la librería `@vercel/og` (la de generar imágenes Open Graph) podía colarse en el bundle aunque no la usaras explícitamente y meter unos ~800 KiB de más, empujando a muchos Workers por encima del límite de 3 MB del free tier. El adaptador ha ido mejorando esto para no arrastrar lo que no usas, pero el patrón se repite: **una dependencia gorda y te quedas fuera del límite sin avisar de forma obvia.**

¿Qué hago yo cuando me pasa?

- **Auditar el bundle.** Antes de asumir nada, mirar qué está pesando de verdad. Muchas veces es una librería de fechas, un SDK entero importado para usar una función, o un icono-pack completo.
- **Importaciones granulares.** En vez de `import _ from 'lodash'`, importar solo lo que uso. Parece una tontería hasta que te ahorra cientos de KB.
- **Sacar lo pesado fuera del Worker.** Si algo es realmente grande y no necesita ejecutarse en cada request, quizá no debería vivir en el Worker.

Mi consejo directo: **si vas en serio con Next.js sobre Cloudflare, plantéate el plan de pago desde el principio.** No solo por los 10 MB en vez de 3, sino por el resto de límites (ahora vamos con uno). El free tier es genial para una demo o un proyecto de contenido; para una app con chicha, se te queda corto rápido.

## CPU time: el "límite de 30 segundos" que en realidad no es así

En mi tutorial anterior escribí que el límite era de "30 segundos por request en plan gratuito". Era, siendo sincero, **incorrecto**, y merece una corrección detallada porque es donde más malentendidos hay.

Lo primero, el número real: el CPU time del plan gratuito es de [**10 ms por request HTTP**](https://developers.cloudflare.com/workers/platform/limits/), no 30 segundos. En el plan de pago, el valor por defecto son 30 segundos, ampliables hasta 5 minutos si lo configuras. Los 30s eran, como mucho, el default del plan de pago, no un regalo del free tier.

Y 10 ms suena aterrador para renderizar SSR, ¿verdad? Aquí está el matiz que lo cambia todo: **CPU time no es lo mismo que tiempo total de la request.** El CPU time solo cuenta el tiempo que la CPU está ejecutando tu código. Todo lo que sea **esperar** (una llamada `fetch`, una lectura de KV, una consulta a tu base de datos, una petición a una API externa) **no cuenta.**

Esto es enorme, y lo veo claro en el SaaS de hostelería. Ahí proceso documentos (facturas, cartas de menú) llamando a la [API de Anthropic](https://www.anthropic.com/). Esas llamadas tardan segundos... pero son segundos de espera de red, no de CPU. Desde el punto de vista del límite de Workers, mi Worker está prácticamente sin hacer nada mientras espera la respuesta. El CPU time consumido es mínimo.

Según la propia documentación de Cloudflare, el Worker medio consume unos 2,2 ms de CPU por request, y cargas más pesadas (autenticación, SSR, parsear payloads grandes) rondan los 10-20 ms. O sea: **el SSR normal cabe de sobra, y donde de verdad te acercas al límite del free tier es en operaciones de cómputo intensivo puro** (procesar imágenes en el propio Worker, criptografía pesada, parseos enormes). Para eso, o pasas al plan de pago (30s por defecto, hasta 5 min con `limits.cpu_ms`) o mueves ese trabajo a otro sitio.

La conclusión que me llevo: no te obsesiones con el CPU time para una app web normal. Preocúpate por él solo si haces cómputo pesado *síncrono*. Y si tu app depende mucho de APIs externas lentas, respira tranquilo: esa espera no te penaliza.

## Lo que viene en la Parte 2

Con esto ya tienes lo estructural: por qué ahora es Workers y no Pages, por qué Node.js y no Edge, y los dos límites (bundle y CPU) que más te van a condicionar en producción.

En la **Parte 2** entro en el terreno operativo, que es donde más sangre he dejado:

- **Caché e ISR**: cómo funciona de verdad el caching con OpenNext, R2 como backend y qué esperar del recién estrenado Workers Cache.
- **Los bugs que te comen una tarde**: el clásico `FinalizationRegistry is not defined` por una `compatibility_date` antigua, problemas con el instrumentation hook, resolución de exports con esbuild/Wrangler y compañía.
- **Cuándo NO usar OpenNext**: porque a veces la respuesta honesta es Astro, o Workers a pelo, y te ahorras el adaptador entero.

---

Y ahora te toca a ti: ¿has migrado ya algún proyecto de Pages a Workers con OpenNext? ¿Con qué límite te has topado tú primero? Me interesa especialmente saber si alguien está peleándose con el tamaño del bundle en apps grandes, que es donde creo que está el verdadero punto de fricción. Nos leemos en los comentarios.

_Si aún no lo has visto, en su día conté [por qué moví mis side projects a Cloudflare](/blog/moviendo-mis-side-projects-a-cloudflare/) y escribí [una introducción a Cloudflare Workers](/blog/introduccion-a-cloudflare-workers/) que sigue siendo un buen punto de partida si vienes de cero._
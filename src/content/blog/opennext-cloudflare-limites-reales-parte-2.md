---
title: 'OpenNext en Cloudflare: los límites reales que me he encontrado (Parte 2)'
description: 'Segunda parte: cómo funciona de verdad la caché e ISR de OpenNext con R2, los bugs que te comen una tarde y cuándo es mejor no usar el adaptador.'
author: 'Fran Moreno'
heroImage: '/blog/opennext-cloudflare-limites-2.jpg'
heroAlt: 'Caché e ISR con OpenNext en Cloudflare Workers'
pubDate: '2026-07-13'
tags:
  [
    'Next.js',
    'Cloudflare',
    'OpenNext',
    'Workers',
    'Serverless',
    'ISR',
    'Cache'
  ]
draft: false
---

En la [Parte 1](/blog/opennext-cloudflare-limites-reales-parte-1/) repasé lo estructural: por qué ahora despliegas Next.js en Cloudflare **Workers** y no en Pages, por qué el runtime es Node.js y no Edge, y los dos límites (tamaño de bundle y CPU time) que más te van a condicionar. Si no la has leído, empieza por ahí, porque esta segunda parte da por hecho ese contexto.

Aquí voy al terreno operativo, que es donde de verdad se aprende: la caché y el ISR (potentes, pero te toca montarlos a ti), los bugs concretos que me han hecho perder una tarde, y lo más importante y lo que menos se dice: **cuándo la respuesta honesta es no usar OpenNext.**

## Caché e ISR: potente, pero la configuras tú

Aquí está la diferencia mental más grande respecto a Vercel. En Vercel, el ISR "simplemente funciona". En Cloudflare con OpenNext, funciona igual de bien... pero **eres tú quien decide y cablea dónde vive la caché.** No es plug-and-play, es plug-and-configure.

El adaptador te deja elegir el backend de la caché incremental (la capa que hay detrás del ISR y del cacheo de rutas completas): **KV o R2.** Y encima puedes envolverlo en una caché regional que se apoya en la Cache API para que los hits calientes no toquen el almacenamiento. La configuración vive en `open-next.config.ts` y, para un caso con ISR, se parece a esto:

```ts
import { defineCloudflareConfig } from '@opennextjs/cloudflare'
import r2IncrementalCache from '@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache'
import { withRegionalCache } from '@opennextjs/cloudflare/overrides/incremental-cache/regional-cache'
import doQueue from '@opennextjs/cloudflare/overrides/queue/do-queue'

export default defineCloudflareConfig({
  incrementalCache: withRegionalCache(r2IncrementalCache, { mode: 'long-lived' }),
  queue: doQueue // solo necesario si usas revalidación por tiempo
})
```

Un par de cosas que conviene que sepas antes de tocar esto:

- **El ISR por tiempo necesita una cola.** OpenNext usa un Durable Object Queue para mandar las peticiones de revalidación en segundo plano y deduplicarlas. Por defecto hay un máximo de 10 instancias de la cola procesando 5 peticiones en paralelo cada una, es decir, **50 revalidaciones ISR concurrentes.** Si tienes un pico de revalidaciones, ese es tu techo por defecto.
- **La invalidación por tags** (`revalidateTag`, `revalidatePath`) usa D1 o Durable Objects con almacenamiento *sharded* para no crear un cuello de botella en un único objeto. De nuevo: potente, pero es una pieza más que decides y configuras.
- **El comportamiento del ISR es equivalente al de Vercel**: tras expirar la ventana de _stale_, la siguiente petición dispara una revalidación en segundo plano que reescribe la página en la caché. Nada raro aquí, solo que la propagación global va con el modelo de consistencia eventual de Cloudflare.

En el SaaS de hostelería lo uso para páginas que cambian de vez en cuando (por ejemplo, contenido semi-estático que no quiero regenerar en cada request). Montar la cola y el bucket de R2 fue trabajo extra respecto a "subir y ya", pero a cambio tienes un control muy fino sobre dónde y cómo se cachea.

## El pitfall de costes que nadie te avisa

Este merece sección propia porque es silencioso y te puede sorprender en la factura.

Por defecto muchas guías (y versiones anteriores) usan **KV** como backend de la caché incremental. El problema: KV cobra almacenamiento por GB-mes, y la caché puede ir **acumulando claves obsoletas de builds antiguos** sin que te des cuenta. He visto casos documentados de un sitio de contenido casi estático pasando de unas 276.000 claves acumuladas a lo largo de decenas de builds, a ~7.600 tras limpiar: una reducción del ~97% y una factura de KV que caía de medio dólar diario a unos céntimos.

Hay dos salidas, y yo tiro por la segunda:

1. **Podar la caché KV** en cada despliegue con un script que borre el prefijo del build anterior una vez el nuevo está sirviendo.
2. **Usar R2 en lugar de KV** para el almacenamiento de la caché. El almacenamiento en R2 es del orden de **33 veces más barato** que en KV (grosso modo, $0,015 frente a $0,50 por GB-mes), y la caché regional se pone delante igual, así que el rendimiento en el _hot path_ no cambia. La presión de coste prácticamente desaparece.

Moraleja: si vas a usar ISR o cacheo de rutas en serio, **plantéate R2 como backend desde el principio** y ahórrate el susto.

## Los bugs y fricciones que te comen una tarde

Ninguno de estos es dramático, pero cada uno me ha costado su rato de "¿por qué no funciona esto?". Te los dejo para que tú no los pierdas:

- **Desarrolla en Linux o WSL, no en Windows nativo.** OpenNext y Wrangler funcionan de forma bastante más fiable en entornos Linux. En Windows nativo hay fricción (dependencias que hay que recompilar, rarezas varias). Si estás en Windows, WSL te ahorra dolores.
- **Pon la `compatibility_date` reciente.** Muchos errores oscuros vienen de una fecha de compatibilidad antigua. El clásico es `FinalizationRegistry is not defined`, que se arregla poniendo la fecha en `2025-05-05` o posterior. Mi recomendación directa: ponla a la fecha de hoy al crear el proyecto y olvídate.
- **Un solo gestor de paquetes.** No mezcles npm, pnpm y yarn en el mismo proyecto: quédate con uno y su lockfile. Mezclarlos da problemas de resolución al bundlear.
- **Acuérdate de quitar `export const runtime = 'edge'`** (lo vimos en la Parte 1, pero es el error número uno en el primer despliegue).
- **Revisa los flags de compatibilidad.** Además de `nodejs_compat`, la configuración recomendada actual incluye `global_fetch_strictly_public` para el comportamiento de `fetch`. Copiar el `wrangler` de un tutorial viejo y saltarte esto te puede dar sorpresas.

El patrón común de casi todos estos: **no son bugs de tu código, son fricciones del adaptador.** Cuando algo peta de forma rara, mi primer reflejo ya no es mirar mi lógica, sino la `compatibility_date`, los flags y el bundle.

## Features que (todavía) no están

Este es el punto que hay que mirar **antes** de comprometerte, no después. OpenNext soporta ya la gran mayoría de Next.js (App Router, Route Handlers, SSG, SSR, ISR, middleware, optimización de imágenes vía Cloudflare Images...), pero hay huecos que pueden ser deal-breakers según tu app:

- **Node Middleware** (el que se introdujo en Next.js 15.2) **todavía no está soportado.**
- Features muy recientes del ecosistema de caché de Next (como el cacheo componible con `'use cache'`) y el estado de Partial Prerendering conviene **verificarlos en la matriz oficial de features soportadas** antes de asumir nada, porque es justo la parte que más se mueve versión a versión.

Mi consejo: si tu app depende de una feature muy nueva de Next.js, no te fíes de un tutorial de hace seis meses. Abre [la documentación de OpenNext para Cloudflare](https://opennext.js.org/cloudflare) y confirma que está en verde. Es literalmente el primer sitio donde miro cuando evalúo si un proyecto encaja.

## Cuándo NO usar OpenNext

Y aquí va la parte que ningún tutorial de despliegue te da, porque a nadie le gusta terminar un tutorial diciendo "quizá no lo necesitas". Pero es la más útil.

**No uses OpenNext si tu sitio es puramente estático.** Si tu Next.js va con `output: "export"` y no tienes API routes, Server Components dinámicos ni middleware en tiempo de request, no necesitas el adaptador para nada: subes los assets estáticos y listo. Y llegados a ese punto, siendo sincero, quizá ni siquiera necesitas Next.js. Para sitios centrados en contenido yo tiro de Astro, como cuento en mi [comparativa Next.js vs Astro](/blog/experiencia-nextjs-vs-astro-proyectos-personales/): menos JavaScript, más simple, y despliegue estático sin capas intermedias.

**No uses OpenNext si eres Edge-first de verdad.** Si tu arquitectura depende del runtime Edge de Next.js (por diseño, no por inercia), OpenNext te obliga a Node.js. En ese caso quizá te interese más escribir Workers a pelo para la lógica crítica y dejar Next.js fuera de esa ruta.

**No uses OpenNext (todavía) si dependes de una feature no soportada.** Si tu app necesita Node Middleware o algo que esté en rojo en la matriz, fuérzate a comprobarlo antes de invertir días. Es mucho más barato descubrirlo en la fase de evaluación que a mitad de migración.

Para todo lo demás (y es la mayoría de las apps full-stack con las que trabajo), OpenNext sobre Workers es hoy una opción sólida y, con R2 detrás, muy competitiva en coste.

## Mi veredicto

Después de un tiempo largo con esto en producción, mi resumen es simple: **OpenNext ha pasado de "experimento prometedor" a "opción de producción seria".** Alcanzó su 1.0 a principios de 2026 y hoy soporta Next.js 16 y las últimas versiones de la 15. Los límites que he descrito en estas dos partes no son motivos para huir, son cosas que hay que **conocer de antemano** para no llevarte sorpresas: el tamaño del bundle, el matiz del CPU time, la caché que configuras tú, R2 para no arruinarte, y la matriz de features como primera parada.

Lo que más me gusta del combo es que, una vez pasas la curva de configuración, tienes una app Next.js completa corriendo sobre la red de Cloudflare, con R2, D1, Durable Objects y compañía a un binding de distancia. Para el tipo de productos que construyo (un SaaS con procesamiento de documentos, [PokerReads](https://pokerreads.com) con IA para estructurar notas), esa cercanía entre cómputo y datos compensa de sobra el trabajo inicial.

Precisamente porque la parte tediosa es la configuración inicial (auth, base de datos, caché con R2, CI/CD, los flags correctos), estoy empaquetando todo ese _setup_ resuelto en un kit listo para arrancar, para no repetir el mismo trabajo en cada proyecto nuevo. Si te interesa que te avise cuando esté, o si quieres que escriba un tutorial dedicado de la parte de caché con R2 paso a paso, dímelo en los comentarios.

---

Y como siempre, te leo: ¿qué límite de OpenNext te ha dado más guerra a ti? ¿Has migrado ya de KV a R2 para la caché, o sigues peleándote con la factura? Me interesan especialmente los casos de apps grandes, que es donde creo que están los retos de verdad.

_Si te has perdido la primera parte, aquí tienes [la Parte 1 con el giro Pages → Workers y los límites de arquitectura](/blog/opennext-cloudflare-limites-reales-parte-1/). Y si vienes de cero con Cloudflare, mi [introducción a Workers](/blog/introduccion-a-cloudflare-workers/) sigue siendo un buen punto de partida._
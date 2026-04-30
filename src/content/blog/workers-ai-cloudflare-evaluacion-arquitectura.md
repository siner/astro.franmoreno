---
title: 'Workers AI no compite con OpenAI: compite por un sitio en tu arquitectura'
description: 'Evaluación a fondo de Cloudflare Workers AI en 2026: catálogo, ecosistema, pricing y cuándo encaja en tu stack frente a OpenAI o Anthropic. Con casos reales de mis proyectos.'
author: 'Fran Moreno'
heroImage: '/blog/workers-ai-cloudflare-evaluacion-arquitectura.jpg'
heroAlt: 'Cloudflare Workers AI'
pubDate: '2026-04-29'
tags:
  [
    'Cloudflare',
    'Workers AI',
    'IA',
    'Anthropic',
    'OpenAI',
    'Arquitectura',
    'Serverless'
  ]
draft: false
---

Cada vez que aparece una comparativa de "Cloudflare Workers AI vs OpenAI" en mi feed, la abro con curiosidad y la cierro a los dos minutos. Casi todas cometen el mismo error de marco: tratar a Workers AI como si fuera un sustituto del último modelo frontier de turno. Comparan Llama 3.1 8B con GPT-4 o Claude Opus, concluyen que pierde por goleada, y dan por zanjada la decisión.

Llevo un tiempo construyendo aplicaciones que combinan Workers AI con APIs de Anthropic y OpenAI, mi conclusión: **Workers AI no viene a ocupar el sitio de Claude o GPT en tu arquitectura. Viene a ocupar uno distinto.** Este post es el resultado de pelearme con esa pregunta en proyectos reales y entender qué hace bien, qué hace mal, y dónde tiene sentido meterlo.

## Qué es Workers AI arquitectónicamente

Antes de entrar en modelos y precios, conviene fijar el modelo mental, porque es lo que hace que toda la decisión cuadre.

Workers AI es **inferencia serverless sobre GPUs distribuidas en la red global de Cloudflare**. No es un endpoint REST que vive en un único datacenter de Virginia al que tú llamas desde la otra punta del mundo. Es el mismo principio que ya describí cuando hablé de [Cloudflare Workers](/blog/introduccion-a-cloudflare-workers/): tu código se ejecuta cerca del usuario. Solo que aquí lo que ejecutas es un modelo de IA.

Desde dentro de un Worker, llamar al modelo es literalmente esto:

```ts
const respuesta = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
  prompt: 'Tu prompt aquí'
})
```

Ni claves de terceros, ni gestión de endpoints, ni SDKs externos, ni preocupación por desde qué región sale la petición. Está integrado en el runtime que ya estás usando.

La unidad de facturación tiene su propia jerga: **Neurons**. Workers AI cuesta 0,011 dólares por cada 1.000 Neurons, con una asignación gratuita de 10.000 Neurons al día. Cada modelo consume Neurons a una tasa distinta según su coste computacional, y Cloudflare publica equivalencias por modelo en tokens y en imágenes, así que en la práctica puedes razonar en las unidades a las que estás acostumbrado y el sistema hace la conversión por detrás.

Lo importante: el coste se mide en GPU compute, no en tokens directamente. Esto es coherente con el hecho de que están hospedando los modelos en su infraestructura, no revendiendo tokens de un proveedor externo.

## El catálogo es más amplio de lo que parece

Otro malentendido frecuente es asumir que Workers AI son "tres Llamas y poco más". El catálogo lleva tiempo creciendo y conviene mirarlo por tipo de tarea, no por proveedor:

- **LLMs generalistas**: Llama 3.1, Mistral, Qwen 1.5, Hermes 2 Pro, Starling. Y un detalle interesante: están los modelos open-weight de OpenAI (`gpt-oss-20b`) y Kimi K2.5 con 256k de contexto, multi-turn tool calling y vision. Los catálogos open-weight ya no son lo que eran hace un año.
- **Embeddings y reranking**: la familia `bge` (incluyendo `bge-reranker-base`). Aquí Workers AI es brutalmente competitivo en precio.
- **Audio**: Whisper para STT, Aura para TTS context-aware.
- **Imagen**: FLUX.2 (klein y dev) de Black Forest Labs, Lucid Origin y Phoenix de Leonardo.
- **Guardrails**: Llama Guard 3 8B, integrado además directamente con AI Gateway.
- **Especializados**: traducción multilingüe (m2m100, IndicTrans2), clasificación con DistilBERT, captioning visual con UForm-Gen.

El mensaje aquí es importante: el catálogo está pensado para **componer aplicaciones de IA**, no solo para hacer chat. Esto cambia bastante la conversación.

## El ecosistema es la verdadera ventaja

Si Workers AI fuera solo un endpoint donde llamar a Llama, el caso de uso sería estrecho. Lo que lo hace interesante es lo que tiene alrededor.

**AI Gateway** es la pieza central. Te permite poner un proxy delante de cualquier proveedor de IA (Workers AI, OpenAI, Anthropic, Mistral, Google) con caching, rate limiting, observabilidad, retries, fallback entre proveedores y métricas unificadas. La novedad de 2026 es la **facturación unificada**: puedes pagar el consumo de OpenAI o Anthropic dentro de tu factura de Cloudflare, sumándole una pequeña comisión. No es un cambio enorme, pero simplifica la vida del que tiene varios proveedores facturando por separado.

**Vectorize** es la base de datos vectorial nativa de Cloudflare. Si vas a generar embeddings con Workers AI, mantenerlos en Vectorize evita salir del ecosistema.

**AI Search** apareció en 2026 como una capa nueva con storage, índice vectorial y crawling integrados. Está en open beta, así que su madurez es limitada todavía.

Y todo esto se compone con **Workers, Durable Objects y Queues** para construir agentes con estado y pipelines asíncronos. Suena obvio cuando lo escribes, pero en la práctica significa que puedes llevarte el 100% de una aplicación de IA a Cloudflare sin dependencias externas. Yo ya conté en su momento por qué he ido [moviendo mis side projects a Cloudflare](/blog/moviendo-mis-side-projects-a-cloudflare/) y este punto pesa cada vez más.

## Cuándo Workers AI es la respuesta correcta

Vamos al grano con las decisiones reales. Para mí, Workers AI gana cuando se cumplen varios de estos requisitos a la vez:

- La tarea es **acotada**: clasificar, extraer tags, generar texto corto, hacer embeddings, moderar, traducir. Cosas donde un Llama 3.1 8B o un Mistral basta y sobra.
- El **volumen** es alto y el coste por operación importa.
- La **latencia** importa de verdad: estás sirviendo a usuarios en tiempo real y el round trip a `api.openai.com` se nota.
- La **tolerancia a un fallo puntual** es razonable: si la salida no es perfecta, el usuario corrige o el sistema reintenta.
- Quieres que **los datos no salgan de Cloudflare** por privacidad o por reducir vendor sprawl.

Un ejemplo concreto que tengo en producción: en **PokerReads**, uno de mis side projects, hay una funcionalidad de notas sobre jugadores. La idea es que durante una partida puedas escribir desde el móvil una observación rápida sobre alguien ("muy loose en early position", "no defiende blinds", "siempre 3betea con AK suited") y el sistema te devuelva una versión estructurada y un conjunto de tags para categorizar a ese jugador.

Es exactamente el caso de uso que Workers AI resuelve mejor que cualquier API frontier:

- **Latencia**: estoy en mitad de una mano, no quiero esperar segundos. Workers AI ejecutándose en el edge me da respuestas rapidísimas.
- **Tarea cerrada**: el vocabulario de tags es relativamente acotado, la estructura de la nota también. No necesito el razonamiento de Claude Opus para esto.
- **Volumen**: una nota por mano interesante, varias por sesión, multiplicado por usuarios. Mandarlo todo a Anthropic sería tirar dinero.
- **Privacidad**: las notas son observaciones privadas sobre otros jugadores, prefiero que vivan dentro de Cloudflare.
- **Coste de error bajo**: si un tag no acaba de encajar, el usuario lo corrige en dos toques.

Llamar a Claude o GPT para esto sería sobrecualificación pura. Un Llama 3.1 8B con un prompt bien afinado hace exactamente lo que necesito y a un coste residual.

## Cuándo Workers AI no es la respuesta

Ahora el contrapunto, que es donde la mayoría de posts se quedan cortos.

Workers AI pierde claramente cuando:

- La tarea requiere **razonamiento complejo, multi-paso o tool use sofisticado**. Aquí Claude y GPT siguen estando varias categorías por encima.
- Necesitas **vision capabilities** serias sobre layouts variables o documentos complejos.
- Trabajas con **contexto realmente largo y necesitas buen recall** dentro de él. Aunque Kimi K2.5 trae 256k de contexto, los frontier models siguen ganando en cómo aprovechan ese contexto.
- El **coste de un mal output es alto**. Si un fallo en la extracción llega al cliente final, ahorrar unos céntimos no compensa.
- Quieres **lo último**. Workers AI suele ir por detrás del estado del arte, lógicamente.

Aquí entra mi otro proyecto, el **SaaS de gestión para hostelería** del que ya he hablado en [otros posts](/blog/3-herramientas-desarrollo-fullstack-2025/). Una de las funcionalidades clave es la extracción de datos desde documentos: facturas de proveedores, menús, listas de precios. El usuario sube un PDF o una foto y el sistema tiene que extraer items, precios, IVA, alérgenos, lo que aplique según el documento.

Aquí elegí **la API de Anthropic con Claude** sin pensármelo dos veces:

- **Vision capabilities**: Claude lee documentos con layouts variables (cada proveedor factura distinto) con una precisión que los modelos disponibles en Workers AI no alcanzan.
- **Razonamiento sobre estructura**: identificar qué es una línea de producto, qué es un total, qué es un descuento, requiere razonar sobre el documento, no solo extraer texto.
- **Coste de error alto**: estos datos van a la contabilidad del cliente. Un campo mal extraído es una incidencia, una llamada de soporte y, potencialmente, un cliente perdido.
- **Volumen moderado**: una factura no se procesa en cada interacción del usuario. El coste por operación pesa menos que la fiabilidad.

Si intentara hacer esto con Workers AI, me ahorraría dinero por documento procesado, pero me lo gastaría con creces en horas de soporte y en pérdida de confianza. La cuenta sale al revés.

## El patrón ganador es híbrido

La conclusión práctica de todo esto es que la pregunta correcta no es "¿Workers AI o Anthropic?". Es "¿qué pieza de mi arquitectura hace cada cosa?".

El patrón que estoy viendo funcionar en proyectos reales es híbrido:

- **Workers AI** para preprocesamiento, embeddings, clasificación, moderación, primera línea, tareas auxiliares de alto volumen.
- **Frontier models (Anthropic, OpenAI)** para el razonamiento donde la calidad importa de verdad: extracción compleja, agentes, generación con altos estándares de calidad.
- **AI Gateway** como capa unificada por delante de todo: caching, observabilidad, fallback, control de costes.

Resumido en mis dos proyectos:

|                         | **PokerReads**                  | **SaaS hostelería**                  |
| ----------------------- | ------------------------------- | ------------------------------------ |
| **Tarea**               | Estructurar notas y tagging     | Extracción de datos de documentos    |
| **Modelo elegido**      | Workers AI (Llama 3.1)          | Anthropic (Claude)                   |
| **Razón principal**     | Latencia + volumen + coste      | Precisión + razonamiento + vision    |
| **Coste de error**      | Bajo (el usuario corrige)       | Alto (datos del cliente)             |
| **Contexto de uso**     | Móvil, en vivo                  | Backend, asíncrono                   |

Esta tabla es más útil que cualquier benchmark, porque reproduce el tipo de decisión que tomas tú cuando arrancas un proyecto.

En un próximo post quiero entrar al detalle del patrón híbrido con código: cómo enrutar peticiones entre Workers AI y Anthropic con AI Gateway, cómo aplicar fallback cuando una llamada falla, y cómo medir si la decisión inicial era correcta o conviene cambiarla. Aviso aquí cuando esté.

## Limitaciones que hay que reconocer

Para no cerrar con un tono comercial, lo que conviene tener presente antes de meterse de cabeza:

- Los modelos en Workers AI **van por detrás del estado del arte**. No esperes encontrar Claude Opus o el último GPT aquí. Esto no va a cambiar.
- Hay **rate limits por modelo** que pueden sorprenderte en producción. Conviene revisarlos antes de diseñar pipelines de alto volumen.
- Algunos modelos están **en beta** y la calidad varía entre versiones. Los más nuevos pueden tener comportamientos inesperados con prompts que ya tenías afinados.
- **El catálogo cambia rápido**. Lo que escribo hoy puede haber envejecido en seis meses. Es algo a chequear de tanto en tanto.
- AI Search y otras piezas del ecosistema están **todavía evolucionando**. Para producción crítica, conviene tomarlas con prudencia.

## Cierre

La conclusión la he ido repitiendo a propósito porque es el mensaje que quería que se llevara el lector: **Workers AI no compite con Anthropic ni OpenAI**. Resuelve un problema distinto: hacer inferencia barata, rápida y cerca del usuario para tareas donde no necesitas el último frontier model.

Si te lo planteas como un sustituto, sales decepcionado. Si te lo planteas como una pieza más de tu arquitectura, lo combinas con frontier models a través de AI Gateway, y eliges qué tarea va a cada sitio según latencia, coste, calidad requerida y privacidad, descubres que el stack es bastante más potente que cualquiera de las piezas por separado.

En mi caso, llevar tareas auxiliares a Workers AI y reservar Anthropic para lo que de verdad lo necesita ha bajado el coste de mis side projects significativamente sin sacrificar calidad donde importa. Y, para mantener todo el stack en un mismo proveedor, encaja con la dirección que llevo tiempo siguiendo de [moverlo todo a Cloudflare](/blog/moviendo-mis-side-projects-a-cloudflare/).

> **🚀 ¿Empezando un proyecto en Cloudflare?** Si quieres saltarte la parte de fontanería (auth, base de datos, CI/CD) y centrarte en construir tu producto sobre Workers/Pages, el [**Next.js + Cloudflare Pages Starter Kit**](https://fransiner.gumroad.com/l/nextjs-cloudflare-starter-auth-database-edge-deploy) trae Better Auth, Drizzle + Supabase y deploy automático listos. La base perfecta para sumarle Workers AI por encima.

¿Estás usando Workers AI en algún proyecto? ¿Lo combinas con OpenAI o Anthropic? Me interesa especialmente cómo estás enrutando entre proveedores y si has dado con algún patrón que te esté funcionando. Cuéntame.

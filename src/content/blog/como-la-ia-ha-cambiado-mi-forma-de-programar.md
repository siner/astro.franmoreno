---
title: 'Cómo la IA ha cambiado mi forma de programar (y las cosas que ya no hago como antes)'
description: 'Después de más de 15 años programando, la IA ha cambiado mi día a día como desarrollador más que ninguna otra tecnología. Te cuento qué he dejado de hacer, qué hago distinto y qué sigo haciendo igual a propósito.'
author: 'Fran Moreno'
heroImage: '/blog/como-la-ia-ha-cambiado-mi-forma-de-programar.jpg'
heroAlt: 'Desarrollador trabajando con asistentes de IA'
pubDate: '2026-07-30'
tags:
  [
    'IA',
    'Productividad',
    'Desarrollo Web',
    'Experiencia Personal',
    'Cursor',
    'Herramientas'
  ]
draft: false
---

Llevo más de 15 años programando. He vivido unas cuantas revoluciones anunciadas: los frameworks JavaScript que iban a matar a todos los demás frameworks JavaScript, el NoSQL que iba a enterrar a las bases de datos relacionales, el low-code que iba a dejarnos sin trabajo a todos... La mayoría se quedaron en cambios incrementales o en herramientas útiles para casos concretos.

Con la IA generativa pensé al principio que sería algo parecido: un autocompletado con esteroides, útil pero anecdótico. Dos años después, mi día a día como desarrollador no se parece al de antes. No es que programe "un poco más rápido", es que **el trabajo en sí ha cambiado de forma**.

En este artículo no vengo a venderte nada ni a decirte que la IA lo hace todo (spoiler: no lo hace, y cuando lo intenta a veces la lía pero bien). Quiero contar, con ejemplos reales, qué cosas he dejado de hacer, qué hago de forma distinta y —esto es importante— qué sigo haciendo exactamente igual que antes, a propósito.

## Cosas que ya no hago

### Escribir boilerplate a mano

Esta es la más obvia y probablemente la que más tiempo me ahorra. CRUDs, configuraciones de proyecto, definiciones de tipos, esquemas de validación, migraciones de base de datos... Todo ese código que es necesario pero que no aporta ninguna decisión interesante, ya no lo escribo.

Ccada nueva entidad implica lo de siempre: esquema en Drizzle, validación con Zod, Server Actions, componentes de formulario. Antes eso era una tarde de trabajo mecánico. Ahora describo la entidad, reviso lo que genera Claude Code, ajusto un par de cosas y sigo con lo que de verdad importa. La estructura del proyecto ya existe, la IA la replica con una consistencia que, siendo sinceros, es mejor que la mía un viernes por la tarde.

### Ir a Stack Overflow como primer reflejo

Durante años, mi flujo ante cualquier error era automático: copiar el mensaje, pegarlo en Google, abrir tres pestañas de Stack Overflow, descartar la respuesta aceptada de 2014 y buscar el comentario con 40 votos que decía "en versiones nuevas esto se hace así".

Ese flujo ha muerto. Ahora pego el error directamente en el editor con el contexto del proyecto y en la mayoría de casos obtengo una explicación aplicada a **mi** código, no a un caso genérico de hace una década. Stack Overflow sigue teniendo valor como fuente, pero como primer reflejo ha desaparecido de mi flujo de trabajo.

### Leerme la documentación entera antes de probar una librería

Antes, integrar una librería nueva significaba una sesión de lectura de documentación para entender la API antes de escribir la primera línea. Ahora invierto el orden: pido un ejemplo de integración concreto para mi caso, lo pruebo, y **después** voy a la documentación a profundizar en lo que necesito entender de verdad.

Ojo, esto tiene trampa y lo cuento más abajo en los peligros: la IA a veces te da la API de hace dos versiones con una seguridad pasmosa. Pero como forma de arrancar y evaluar si una librería encaja, el cambio de orden me ahorra muchísimo tiempo.

### Escribir tests desde cero

Los tests son el ejemplo perfecto de tarea con estructura repetitiva y alto valor. Ahora escribo los casos que me preocupan —los límites, los errores, el caso raro que sé por experiencia que va a explotar— y dejo que la IA genere el andamiaje y los casos evidentes.

El resultado práctico: escribo **más tests que antes**. No porque me haya vuelto más disciplinado, sino porque el coste de escribirlos ha bajado tanto que ya no hay excusa. En algunos de los nuevos proyectos que estoy desarrollando, tengo una cobertura de tests que jamás habría tenido en un side project hace tres años. Simplemente porque antes no me compensaba el esfuerzo y ahora sí.

### Regex a mano

Poco que explicar aquí. Nadie va a echar de menos escribir expresiones regulares a mano. Nadie. Descanse en paz.

## Cosas que hago distinto

### Reviso más de lo que escribo

Este es el cambio de fondo, el que engloba a todos los demás. Mi ratio de tiempo escribiendo código versus tiempo revisando código se ha invertido. Antes era 80/20, ahora es más bien al revés.

Y esto tiene una consecuencia que no se cuenta lo suficiente: **revisar bien es más difícil que escribir**. Cuando escribes código, entiendes cada decisión porque la has tomado tú. Cuando revisas código generado, tienes que reconstruir el razonamiento y detectar dónde falla. Es un músculo distinto, más parecido al de hacer code review de un compañero que al de programar. Si llevas años haciendo revisiones de código en equipo, tienes medio camino andado. Si no, es la habilidad que te toca entrenar ya.

### Los prompts son mis nuevas specs

Me he dado cuenta de que la calidad de lo que obtengo depende directamente de la calidad de lo que pido. Un "hazme un formulario de contacto" da un resultado genérico. Explicar el contexto, las restricciones, el patrón que sigue el resto del proyecto y los casos límite da un resultado que casi puedo mergear directamente.

En la práctica, escribir buenos prompts se parece sospechosamente a escribir buenas especificaciones técnicas. Toda la vida dirigiendo proyectos y escribiendo documentos de requisitos, y resulta que era el entrenamiento perfecto para 2026. Quién me lo iba a decir (con la pereza que me ha dado siempre hacer eso...)

### Pienso más en arquitectura y menos en sintaxis

Al liberarme del código mecánico, el tiempo se me va a las preguntas de verdad: ¿esta lógica va en el edge o en el servidor? ¿Este procesamiento lo hago con [Workers AI o con una API externa](/blog/introduccion-a-cloudflare-workers/)? ¿Cómo estructuro esto para que dentro de un año no me odie a mí mismo?

Es curioso: la IA no me ha quitado trabajo de ingeniería, me ha quitado trabajo de **mecanografía avanzada**. Lo que queda es precisamente la parte de ingeniería. Ahora me arrepiento de no haber prestado toda la atención a esas asignaturas en la carrera, tendría mucho más interiorizados algunos procesos y decisiones que ahora tengo que tomar.

### Construyo cosas que antes descartaba

Este cambio es más sutil pero para mí es el más importante. Hay proyectos que antes ni empezaba porque el coste de arranque no compensaba: demasiado boilerplate, demasiada integración aburrida antes de llegar a la parte interesante.

Ese umbral ha bajado drásticamente. Algunos de mis sideprojects (por complejos que sean) existen porque el coste de construirlos se ha reducido lo suficiente como para que un "estaría bien tener..." se convirtiera en un proyecto real. La IA no solo acelera lo que ya hacías: **cambia qué proyectos son viables**.

## Cosas que sigo haciendo igual (a propósito)

Y aquí viene la parte que diferencia usar la IA con criterio de usarla con los ojos cerrados. Hay cosas que no delego, y no por nostalgia.

### Las decisiones de arquitectura

La IA puede darme opciones, comparar trade-offs y hasta detectar problemas en mi planteamiento. Pero la decisión final sobre cómo se estructura un sistema la tomo yo, porque soy yo quien conoce el contexto completo: el presupuesto, el plan a dos años, las limitaciones del cliente, lo que pasó la última vez que elegí la opción "elegante" sobre la "aburrida".

Le pregunto, la uso como sparring, pero no le pido que decida. La diferencia es importante.

### El código crítico: auth, pagos, datos

Todo lo que toca autenticación, pagos o datos sensibles lo escribo o lo reviso línea por línea, con el mismo nivel de paranoia de siempre. Aquí un fallo no es un bug, es un incidente. Y la IA es especialmente peligrosa en este terreno porque genera código que **parece** correcto: sigue los patrones, tiene buena pinta, compila... y tiene un agujero sutil que solo ves si sabes exactamente qué buscar.


## Donde me ha quemado (los peligros reales)

No todo es productividad y felicidad. Algunas cicatrices:

**El código plausible pero incorrecto.** El fallo más peligroso de la IA no es el error evidente, es el error convincente. Me ha pasado con código para el runtime de Workers: soluciones que funcionaban perfectamente en local con Node.js y explotaban en producción porque usaban APIs que no existen en el runtime de Cloudflare. El código era impecable... para otro entorno. Desde entonces, todo lo que va a Workers pasa por `wrangler dev` antes de nada.

**Las APIs de hace dos versiones.** Relacionado con lo anterior: la IA tiene una memoria congelada en el tiempo y una confianza absoluta en ella. Me ha generado configuraciones de librerías con sintaxis deprecada muchas veces. Con el ecosistema de Next.js y OpenNext, que cambia cada pocos meses, esto es casi garantizado si no le pasas la documentación actualizada como contexto.

**La atrofia silenciosa.** Esta es más incómoda de contar. Hace unos meses me tocó resolver un problema sin asistencia —un entorno restringido, sin herramientas— y noté óxido en cosas que antes hacía con los ojos cerrados. Nada grave, pero fue un aviso: las habilidades que no ejercitas se degradan, y la IA hace muy fácil no ejercitarlas. Ahora, de vez en cuando, resuelvo cosas "a mano" a propósito. Como quien va al gimnasio: no porque necesite levantar ese peso hoy, sino para poder levantarlo cuando toque.

**El riesgo para los que empiezan.** No es mi caso, pero lo veo venir: si la IA te da la solución antes de que hayas sufrido el problema, ¿cuándo desarrollas el criterio para evaluar esa solución? Mi generación aprendió depurando a ciegas y leyendo código ajeno horas y horas. No idealizo aquel sufrimiento, pero construyó el criterio que hoy me permite revisar con solvencia lo que genera la IA. Cómo se construye ese criterio empezando en 2026 es una pregunta que me parece muy seria y para la que no tengo respuesta.

## Conclusión: de escribir código a dirigir el trabajo

Si tengo que resumir el cambio en una frase: **he pasado de escribir código a dirigir trabajo**. Defino qué hay que hacer, establezco las restricciones, reviso el resultado, corrijo el rumbo. Cualquiera que haya liderado equipos reconocerá el patrón, porque es exactamente eso, con la diferencia de que el "equipo" responde en segundos y no se ofende cuando le rechazas el código.

Y como cuando diriges un equipo, tu valor ya no está en teclear más rápido que nadie: está en el criterio. En saber qué pedir, qué aceptar, qué rechazar y qué no delegar jamás. La experiencia, lejos de devaluarse, se ha convertido en el multiplicador. La IA amplifica lo que ya eres: si tienes criterio, te hace mucho mejor; si no lo tienes, te ayuda a equivocarte a una velocidad récord.

¿Y tú? ¿Qué has dejado de hacer desde que programas con IA? ¿Hay algo que te niegues a delegar? Me encantaría leer tu experiencia en los comentarios.

_Si quieres ver qué herramientas concretas uso en mi día a día, puedes leer [mi post sobre las 3 herramientas que me hacen más productivo](/blog/3-herramientas-desarrollo-fullstack-2025/). Y si el tema de organizarse bien te interesa tanto como a mí, échale un ojo a [mi flujo GTD semanal como desarrollador](/blog/flujo-gtd-semanal-desarrollador/)._
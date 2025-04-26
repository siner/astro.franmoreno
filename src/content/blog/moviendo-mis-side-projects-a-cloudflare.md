---
title: Moviendo mis side projects a Cloudflare
pubDate: '2024-05-13T09:24:48.463Z'
author: 'Fran Moreno'
description: Moviendo los proyectos en los que estoy trabajando de Vercel a Cloudflare Pages
heroImage: '/blog/Screenshot_2022-01-27_at_10.png'
heroAlt: 'Cloudflare Pages'
tags:
  [
    'Cloudflare',
    'Hosting',
    'Despliegue',
    'Vercel',
    'Rendimiento',
    'Side Projects'
  ]
draft: false
---

Desde hace tiempo vengo usando Vercel para el despliegue de mis proyectos frontend (sigo usándolo) pero últimamente estoy migrando algunos de los proyectos en los que estoy trabajando al entorno Cloudflare, usando tanto Cloudflare Pages como [Cloudflare Workers](https://workers.cloudflare.com/) (sobre los que puedes leer [una introducción aquí](/blog/introduccion-a-cloudflare-workers/)) y estoy muy contento.

En este artículo, exploraremos las ventajas de Cloudflare Pages respecto a Vercel.

## Mayor rendimiento y velocidad

Una de las principales ventajas de Cloudflare Pages es su red de distribución de contenido (CDN) global. Al aprovechar esta red, nuestros proyectos se beneficiarán de una mayor velocidad de carga y rendimiento, ya que los archivos se servirán desde el servidor más cercano al usuario.

## Escalabilidad y disponibilidad

Cloudflare Pages ofrece una infraestructura escalable y altamente disponible. Esto significa que nuestros proyectos podrán manejar un mayor volumen de tráfico sin comprometer la estabilidad o la experiencia del usuario. Además, Cloudflare cuenta con una arquitectura distribuida que garantiza la disponibilidad de nuestros proyectos en caso de fallos en un servidor o región específica.

Además de la escalabilidad y disponibilidad, Cloudflare Pages también ofrece otras características que pueden mejorar aún más nuestros proyectos. Por ejemplo, podemos aprovechar la capacidad de caché de Cloudflare para almacenar en caché el contenido estático de nuestros sitios web, lo que reduce la carga en nuestros servidores y mejora la velocidad de carga para los usuarios.

Cloudflare Pages también nos permite personalizar la configuración de DNS para nuestros proyectos, lo que nos brinda un mayor control sobre la gestión de los nombres de dominio y la resolución de DNS. Esto puede ser especialmente útil si necesitamos configurar redirecciones, subdominios o registros DNS específicos.

## Integración con otros servicios de Cloudflare

Otra ventaja de migrar a Cloudflare Pages es la integración con otros servicios de Cloudflare. Podremos aprovechar características como la protección contra ataques DDoS, el firewall de aplicaciones web (WAF) y la optimización de imágenes, entre otros. Esto nos permitirá mejorar la seguridad y el rendimiento de nuestros proyectos sin tener que implementar soluciones adicionales.

## Costes reducidos

Cloudflare Pages ofrece un plan gratuito generoso que incluye un alto límite de ancho de banda y almacenamiento. Esto puede resultar en costos reducidos en comparación con Vercel u otras plataformas de alojamiento. Además, Cloudflare ofrece planes de precios flexibles que se adaptan a las necesidades de nuestros proyectos a medida que crecen.

## Desventajas

Obviamente, no todo puede ser perfecto, sobre todo si trabajamos con [NextJS](https://nextjs.org/), Vercel ofrece mucho mejor soporte para este Framework (lo han desarrollado ellos...) por lo que algunas de las ventajas y novedades que ofrecen no estarán disponibles cuando despliegas un proyecto con Cloudflare Pages, pero para la mayoría de proyectos es una solución más que interesante.

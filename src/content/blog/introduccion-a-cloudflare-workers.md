---
title: Introducción a Cloudflare Workers
pubDate: '2024-05-15T14:12:53.895Z'
author: 'Fran Moreno'
heroImage: '/blog/cloudflare_workers.jpg'
heroAlt: 'Cloudflare Workers'
description: Descubre cómo empezar a usar Cloudflare Workers. Aprende sobre sus beneficios, casos de uso y cómo mejorar el rendimiento de tus proyectos
tags: ['Cloudflare', 'Serverless', 'JavaScript', 'Rendimiento']
draft: false
---

## ¿Qué son los Cloudflare Workers?

Cloudflare Workers es una plataforma de computación serverless que permite a los desarrolladores ejecutar código JavaScript en los servidores de Cloudflare distribuidos globalmente. Esto significa que puedes ejecutar tu lógica de aplicación más cerca de tus usuarios finales, reduciendo significativamente la latencia y mejorando el rendimiento general de tu sitio web o aplicación.

## ¿Cómo Funcionan los Cloudflare Workers?

Los Cloudflare Workers se basan en el estándar de la WebAssembly (WASM), lo que les permite ejecutar código con gran eficiencia y seguridad. Aquí tienes un desglose de cómo funcionan:

1. **Distribución Global**: Cloudflare tiene una red global con más de 200 centros de datos. Cuando despliegas un Worker, tu código se replica en todos estos centros de datos.
2. **Ejecución en el Borde**: En lugar de enviar todas las solicitudes a un servidor central, los Workers procesan las solicitudes en el servidor más cercano al usuario, mejorando la velocidad de respuesta.
3. **Escalabilidad Automática**: Los Workers escalan automáticamente para manejar cualquier cantidad de tráfico sin necesidad de que te preocupes por la infraestructura.

## Beneficios de Usar Cloudflare Workers

1. **Rendimiento Mejorado**: Al ejecutar código en el borde, los tiempos de respuesta se reducen drásticamente.
2. **Seguridad**: Los Workers permiten implementar lógica de seguridad como controles de acceso y validación de datos directamente en el borde.
3. **Escalabilidad y Flexibilidad**: Cloudflare se encarga de la escalabilidad, permitiéndote concentrarte en el desarrollo de tu aplicación.
4. **Coste Reducido**: Al ser una solución serverless, solo pagas por las invocaciones de tu código, eliminando los costos asociados con servidores siempre activos.

## Casos de Uso Comunes

- **Redirección de Tráfico**: Redirige a los usuarios a diferentes versiones de tu sitio web según su ubicación geográfica.
- **Optimización de Imágenes**: Procesa y optimiza imágenes en el borde para mejorar los tiempos de carga.
- **Autenticación y Autorización**: Implementa mecanismos de autenticación y autorización directamente en el borde para mejorar la seguridad.

## Primeros Pasos con Cloudflare Workers

A continuación, los pasos que tienes que dar para empezar con Cloudflare Workers directamente desde el panel de Cloudflare:

1. **Registro y Configuración**: Regístrate en Cloudflare (si es que no lo has hecho ya...) y añade tu dominio. En el panel de control, navega hasta la sección de Workers.
2. **Crear un Worker**: Haz clic en "Crear un Worker". Cloudflare te proporcionará una interfaz para escribir y probar tu código.
3. **Escribir Código**: Utiliza JavaScript para escribir tu lógica. Por ejemplo, un Worker sencillo para responder con un mensaje "Hello World" se vería así:

```js
addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  return new Response('Hello World', {
    headers: { 'content-type': 'text/plain' }
  })
}
```

4. **Desplegar**: Una vez que estés satisfecho con tu código, puedes desplegar el Worker y comenzará a ejecutarse en la red global de Cloudflare.

## Usando Wrangler para crear y desplegar workers

### Paso 1: Instalación de Wrangler

Primero, necesitas instalar Wrangler. Asegúrate de tener Node.js y npm instalados en tu sistema. Luego, ejecuta el siguiente comando en tu terminal para instalar Wrangler globalmente:

```bash
npm install -g @cloudflare/wrangler
```

### Paso 2: Configuración de Wrangler

Una vez instalado, debes configurar Wrangler con tus credenciales de Cloudflare. Ejecuta el siguiente comando para iniciar sesión:

```bash
wrangler login
```

Esto abrirá una ventana del navegador donde podrás iniciar sesión en tu cuenta de Cloudflare y autorizar a Wrangler.

### Paso 3: Crear un Proyecto de Worker

Con Wrangler configurado, puedes crear un nuevo proyecto de Worker. Usa el siguiente comando para generar un proyecto básico:

```bash
wrangler generate my-first-worker
```

Este comando creará un directorio llamado my-first-worker con una plantilla básica de Worker.

### Paso 4: Modificar el Código del Worker

Navega al directorio del proyecto recién creado y abre el archivo index.js en tu editor de texto favorito. Aquí es donde puedes escribir la lógica de tu Worker. Por ejemplo, para responder con un mensaje "Hello World" podemos usar el mismo código del principio del artículo.

### Paso 5: Prueba Local

Wrangler permite probar tu Worker localmente antes de desplegarlo. Usa el siguiente comando para iniciar el entorno de desarrollo local:

Esto iniciará un servidor local y te proporcionará una URL donde puedes probar tu Worker en tu navegador.

### Paso 6: Desplegar el Worker

Una vez que estés satisfecho con tu Worker, puedes desplegarlo a la red global de Cloudflare. Ejecuta el siguiente comando para desplegar tu Worker:

```bash
wrangler publish
```

Wrangler subirá tu código a Cloudflare y lo desplegará en todos sus centros de datos. Recibirás una URL donde tu Worker estará disponible.

### Paso 7: Configuración Adicional

Puedes configurar más aspectos de tu Worker, como el nombre, el dominio y las variables de entorno, editando el archivo wrangler.toml generado en tu proyecto. Este archivo permite personalizar la configuración y el comportamiento de tu Worker.

---
layout: ../../layouts/PostLayout.astro
title: 'Comenzando con los Custom Post Types en WordPress'
description: 'Comenzando con los Custom Post Types en WordPress'
author: 'Fran Moreno'
pubDate: '15 Feb, 2019'
date: '2019-02-15'
image: 'wordpress.jpg'
slug: 'comenzando-custom-post-types-wordpress'
---

Un aspecto importante en **WordPress** son los [Custom Post Types](http://codex.wordpress.org/Function_Reference/register_post_type) , una característica que se incluyó a partir de la versión 3 de este CMS. Como la mayoría sabe, en WordPress hay varios tipos de posts nativos, los posts normales, como este artículo, una página estática, los archivos adjuntos (imágenes y demás) y las barras de navegación. Cada una de estas cosas tiene un tipo de post concreto en la tabla `wp_posts`.

Desde la versión 3 se pueden definir Custom posts propios, lo que quiere decir que tenemos un montón de posibilidades de crear casi cualquier cosa que se nos ocurra. Para crear este tipo de posts se hace uso de la función `register_post_type`, que paso a describir a continuación, creando un _Custom Post Type_ llamado **Trabajo**:

```php
    add_action('init', 'franmoreno_trabajos_register');

    function franmoreno_trabajos_register() {

        $labels = array(
    	    'name' => __( 'Trabajos' ),
    	    'singular_name' => __( 'Trabajo' ),
    	    'add_new' => __( 'Añadir Nuevo' ),
    	    'add_new_item' => __( 'Añadir nuevo Trabajo' ),
    	    'edit_item' => __( 'Editar Trabajo' ),
    	    'new_item' => __( 'Nuevo Trabajo'),
    	    'view_item' => __( 'Ver Trabajo'),
    	    'search_items' => __( 'Buscar Trabajo'),
    	    'not_found' =>  __('No se encontró nada'),
    	    'not_found_in_trash' => __('No se encontró nada en la papelera'),
    	    'parent_item_colon' => ''
        );

        $args = array(
    	    'labels' => $labels,
    	    'public' => true,
    	    'rewrite' => true,
    	    'capability_type' => 'post',
    	    'hierarchical' => false,
    	    'menu_position' => null,
    	    'supports' => array('title','thumbnail','editor')
          );

        register_post_type( 'trabajos' , $args );
    }
```

Esta función recibe primero el nombre del _Custom Post_, y segundo un array con los distintos argumentos para crearlo. Este array contiene los siguientes campos:

- **labels**: Otro array con los distintos textos que se mostrarán en el panel de administración para gestionar nuestro _Custom Post Type_.
- **public**: Define si este _Custom Post_ es de acceso público o va a ser de uso interno.
- **rewrite**: Define si se va a hacer uso de los _rewrites_ para generar _permalinks_ con este tipo de datos.
- **capability_type**: Define la forma en la que se accederá a el internamente, en este caso, decimos que igual que un _post_.
- **hierarchical**: Permitimos que se asocien unos a otros como padres e hijos, _false_ es que no, comportándose como un post. Si decimos _true_, se comportarán como páginas, pudiendo asignarles un padre.
- **menu_position**: Definimos la posición que tendrá este _Custom Post_ en el menú de administración de WordPress.
- **supports**: Un array con los distintos campos que queremos que este _Custom Post_ tenga en el panel de creación y edición, en este caso decimos que queremos que tenga título, imagen predeterminada y el campo de edición del post.

Añadimos el código anterior a nuestro fichero _functions.php_ y al guardar y refrescar tendremos disponible nuestro _Custom Post_. Recomiendo, que para no tener dependencia entre el _Custom Post_ y el _Theme_, separemos ambas cosas, creándolo como un plugin, en este caso, podemos crear un fichero en el directorio plugins al que llamaremos como queramos y cuyo contenido será algo así:

```php
    <?php

    /*
    Plugin Name: Custom Post Trabajos
    Description: Custom posts de trabajos.
    Version: ...
    Author: ...
    Author Uri: ...
    License: ...
    */

    /* Aquí añadimos el código anterior que define el custom post */

    ...
```

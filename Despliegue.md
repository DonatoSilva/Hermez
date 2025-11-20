# Guía de Despliegue del Proyecto Hermez

## 1. Introducción

Este documento detalla los pasos necesarios para desplegar el proyecto Hermez, una aplicación web construida con Astro, React, y TailwindCSS, utilizando Clerk para la autenticación.

- **Framework Principal:** Astro 5.15.3
- **Librería de UI:** React 19.2.0
- **Autenticación:** Clerk
- **Estilos:** TailwindCSS 4.1.16
- **Gestor de Paquetes:** Bun

## 2. Requisitos Previos

Asegúrate de tener instalado el siguiente software:

- **Node.js:** Versión 20.x o superior.
- **Bun:** Versión 1.x o superior. Puedes instalarlo desde [la web oficial de Bun](https://bun.sh/).

## 3. Instalación

Sigue estos pasos para configurar el proyecto en tu entorno local o en un servidor:

1.  **Clona el repositorio:**
    ```bash
    git clone "\u003cURL_DEL_REPOSITORIO\u003e"
    cd Hermez
    ```

2.  **Instala las dependencias:**
    ```bash
    bun install
    ```

## 4. Configuración de Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto y añade las siguientes variables. Puedes usar el archivo `.env.example` como referencia.

```env
# Claves de Clerk (obtenidas desde el dashboard de Clerk)
PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...

# IDs de Organización de Clerk
ID_ORG_DOMICILIARY=org_...
ID_ORG_CLIENT=org_...

# Endpoints de la API del Backend
URL_LOCAL_BACKEND=http://localhost:3000
API_USERS=http://localhost:3000/api/users
API_ADDRESSES=http://localhost:3000/api/addresses
```

## 5. Construcción del Proyecto

Para compilar la aplicación para producción, ejecuta el siguiente comando:

```bash
bun run build
```

Este comando generará una carpeta `.vercel/output` con los artefactos de construcción listos para ser desplegados.

## 6. Despliegue

Astro es un framework versátil que permite desplegar tu proyecto en una variedad de plataformas, gracias a su arquitectura de islas y la capacidad de usar adaptadores para diferentes entornos de ejecución (SSR - Server-Side Rendering). Esto significa que, aunque este proyecto está configurado para Vercel, puedes adaptarlo fácilmente a otros servicios.

Para más información sobre los adaptadores de SSR y las opciones de despliegue en Astro, consulta la documentación oficial: [Astro Deployment](https://docs.astro.build/es/guides/deploy/)

### Opción Recomendada: Vercel

El proyecto está preconfigurado para un despliegue sencillo en Vercel, aprovechando el adaptador `@astrojs/vercel`.

1.  **Conecta tu repositorio a Vercel:** Importa tu proyecto de Git en el dashboard de Vercel.
2.  **Configura las variables de entorno:** Añade las variables de entorno listadas en la sección 4 en la configuración de tu proyecto en Vercel.
3.  **Despliega:** Vercel detectará automáticamente la configuración de Astro y desplegará el proyecto.

### Opción Genérica (Otros Proveedores)

Si deseas desplegar en otra plataforma que soporte Node.js (como Netlify, Render, o un VPS), el proceso general implica cambiar el adaptador de Astro:

1.  **Ajusta el adaptador de Astro:** Cambia el adaptador de Vercel en `astro.config.mjs` por el correspondiente a tu proveedor (ej. `@astrojs/netlify`, `@astrojs/node`). La elección del adaptador es crucial porque le indica a Astro cómo debe empaquetar y ejecutar tu aplicación en el entorno de tu proveedor.
    ```javascript
    // astro.config.mjs
    import { defineConfig } from 'astro/config';
    import node from '@astrojs/node'; // Ejemplo para despliegue en Node.js

    export default defineConfig({
      output: 'server', // Asegúrate de que el output sea 'server' para SSR
      adapter: node({ // Usa el adaptador adecuado para tu proveedor
        mode: 'standalone'
      }),
      // ... resto de la configuración
    });
    ```
2.  **Instala el nuevo adaptador:**
    ```bash
    bun add @astrojs/node
    ```
3.  **Configura el comando de inicio:** El comando para iniciar la aplicación en producción dependerá del adaptador y del proveedor. Por ejemplo, con el adaptador `@astrojs/node`, el comando podría ser `node ./dist/server/entry.mjs` o similar. Consulta la documentación específica del adaptador y de tu proveedor de hosting para obtener las instrucciones precisas.

## 7. Scripts Útiles

El archivo `package.json` incluye los siguientes scripts:

-   `bun run dev`: Inicia el servidor de desarrollo en `http://localhost:4321`.
-   `bun run build`: Compila el proyecto para producción.
-   `bun run preview`: Inicia un servidor local para previsualizar la versión de producción.
-   `bun run lint`: Ejecuta ESLint para revisar y corregir el estilo del código.
# Brief: Landing page para caverco-partners.cl

## Contexto
- Dominio: **caverco-partners.cl**, registrado en NIC Chile (o registrador equivalente, a confirmar).
- Ya existe un ERP interno (Caverco ERP: RRHH, contratos, liquidaciones, obras) corriendo en:
  - Backend: Render (FastAPI + PostgreSQL)
  - Frontend: Cloudflare Workers (React + Vite)
- El ERP va a vivir en el subdominio **app.caverco-partners.cl** (proyecto y repo aparte, ya en curso — no tocar).
- Esta sesión/repo es solo para la **landing page pública**, que debe vivir en la **raíz del dominio** (`caverco-partners.cl` y `www.caverco-partners.cl`).

## Objetivo
Construir una landing page institucional/de marketing para Caverco, simple y de bajo mantenimiento, publicada en `caverco-partners.cl`.

## Reparto del dominio (importante)
| Host | Destino | Quién lo administra |
|---|---|---|
| `caverco-partners.cl` (raíz) | Landing page | Este proyecto |
| `www.caverco-partners.cl` | Redirect a la raíz o mismo sitio | Este proyecto |
| `app.caverco-partners.cl` | ERP (Caverco ERP) | Proyecto aparte — **no crear ni modificar este registro DNS** |

Al configurar DNS, tocar solo los registros de `@` y `www`. El registro de `app` lo maneja el otro proyecto.

## Stack recomendado
- Sitio estático simple (HTML/CSS/JS, o un framework liviano tipo Astro/Vite si se quiere algo más estructurado). No hace falta backend.
- Deploy en **Cloudflare Pages** (gratis, rápido, y mantiene todo el dominio bajo el mismo proveedor que ya usa el ERP para su frontend — facilita administrar DNS desde un solo lugar más adelante).

## DNS a configurar (una vez lista la landing)
1. Si el dominio sigue con los nameservers de NIC Chile / registrador original:
   - Opción simple: crear un registro `CNAME` (o `A`/`ALIAS` según lo que pida el hosting) apuntando `@` y `www` al target que entregue Cloudflare Pages (u otro hosting elegido).
   - Alternativa recomendada a futuro: migrar los nameservers del dominio a Cloudflare, para administrar TODO el DNS (landing + `app.`) en un solo panel. Esto se decide en conjunto con el proyecto del ERP, no aquí.
2. Verificar que el certificado SSL quede activo (Cloudflare Pages y la mayoría de hosts modernos lo emiten automático).

## Contenido / secciones (a definir con el usuario al iniciar el proyecto)
Pendiente de confirmar con el usuario en la sesión de la landing:
- Rubro/servicios exactos de Caverco (el ERP interno sugiere: gestión de RRHH, contratos, obras/construcción — confirmar si la landing debe hablar de esto o es otro enfoque de negocio).
- Logo y paleta de colores (existe un logo `caverco-logo.png` usado en el ERP; confirmar si es el mismo a usar públicamente).
- Secciones típicas a considerar: Inicio/Hero, Quiénes somos, Servicios, Contacto (formulario o datos), Footer con RUT/dirección si aplica.
- Datos de contacto reales (email, teléfono, dirección) para el footer/formulario.
- Si necesita SEO básico (meta tags, sitemap, favicon).

## Qué NO incluir aquí
- Ningún código ni dependencia del ERP (backend FastAPI, modelos de RRHH, etc.). Proyecto y repo completamente independientes.
- No crear ni editar el registro DNS de `app.caverco-partners.cl`.

## Siguiente paso al abrir la sesión de la landing
1. Confirmar con el usuario: rubro/mensaje, contenido de cada sección, contacto real, y si ya tiene branding definido (colores, logo en alta resolución).
2. Elegir stack final (HTML estático vs Astro/Vite) según complejidad deseada.
3. Construir y desplegar en Cloudflare Pages (o el hosting elegido).
4. Configurar DNS de `@` y `www` según las instrucciones de arriba.

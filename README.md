# Landing Page — Caverco Partners SpA

Sitio estático institucional para `caverco-partners.cl` (raíz del dominio). El ERP interno vive aparte, en `app.caverco-partners.cl`, y no se toca desde este proyecto.

## Estructura

```
index.html            Inicio
quienes-somos.html    Quiénes somos, misión, visión, valores
servicios.html        Detalle de servicios
contacto.html         Formulario de contacto + datos
css/styles.css        Estilos (paleta y tipografía)
js/main.js            Menú móvil, formulario, año dinámico del footer
assets/logo-full.png  Logo completo (isotipo + wordmark), fondo transparente
assets/logo-mark.png  Solo el isotipo, usado en el header/footer
assets/favicon.png    Favicon generado a partir del isotipo
Logo.png              Archivo original del logo (mockup) tal como fue provisto
functions/api/contact.js   Cloudflare Pages Function: recibe el formulario y lo guarda en D1
schema.sql             Esquema de la tabla `contacts` (se ejecuta desde la consola de D1, ver abajo)
wrangler.toml           Config de Cloudflare Pages (el binding de D1 se agrega desde el dashboard, no aquí)
robots.txt, sitemap.xml SEO básico
_headers                Cabeceras de seguridad para Cloudflare Pages
```

## Logo

El logo original (`Logo.png`) es un mockup (fondo papel + sombra). Se generaron a partir de él dos versiones limpias con fondo transparente:
- `assets/logo-mark.png`: solo el isotipo (círculo + balanza + barras), usado como ícono junto al nombre en el header/footer.
- `assets/logo-full.png`: isotipo + wordmark completo, disponible por si se necesita en algún lugar como pieza única.
- `assets/favicon.png`: favicon generado a partir del isotipo.

El isotipo es gris oscuro neutro (aprox. `#515455`), sin azul. Si más adelante se dispone de un archivo vectorial (SVG/AI) del logo, reemplazar estos PNG por esa versión dará mejor nitidez a cualquier tamaño.

## Paleta de colores

Definida en `css/styles.css` (`:root`). Alineada a la identidad visual real del ERP (visible en su pantalla de login): negro/carbón (`--ink`) como color principal y dorado (`--gold`) como acento en textos, íconos y botones, sobre neutros cálidos (`--gray-*`) — no azul. Ajusta las variables si el branding del ERP cambia.

## Deploy en Cloudflare Pages

1. Conecta este repositorio en el dashboard de Cloudflare Pages (Workers & Pages → Create → Pages → conectar a Git).
2. Build settings: sin framework, **sin comando de build**, directorio de salida: `/` (raíz).
3. Cloudflare detecta automáticamente la carpeta `functions/` y despliega `functions/api/contact.js` como Pages Function.

## Configurar la base de datos (Cloudflare D1)

La base de datos `caverco_contacts` ya está creada y su binding declarado en `wrangler.toml` (`database_id`). Como el proyecto tiene `wrangler.toml`, Cloudflare Pages **bloquea la edición de bindings desde el dashboard** ("Bindings for this project are being managed through wrangler.toml") — cualquier cambio futuro al binding de D1 se hace editando ese archivo y desplegando, no desde Settings → Functions.

Pasos ya realizados (documentados por si hay que rehacerlos, ej. en otro entorno):

1. **Workers & Pages → D1 SQL Database → Create database**, nombre `caverco_contacts`.
2. En la base → pestaña **Console** → pegar el contenido de `schema.sql` → **Execute** (crea la tabla `contacts`).
3. Copiar el **Database ID** de la base y pegarlo en `wrangler.toml` bajo `[[d1_databases]]`.
4. Desplegar (push a `main` o **Retry deployment**) para que la Function tome el binding.

### Consultar los contactos guardados

En el dashboard: abre la base `caverco_contacts` → pestaña **Console** → ejecuta:

```sql
SELECT * FROM contacts ORDER BY created_at DESC;
```

## DNS (según brief original)

Configurar solo los registros `@` y `www` apuntando al target que entrega Cloudflare Pages. **No tocar** el registro `app`, que pertenece al proyecto del ERP.

1. Agregar dominios personalizados en el proyecto de Pages: `caverco-partners.cl` y `www.caverco-partners.cl`.
2. Verificar que el certificado SSL quede activo (Cloudflare lo emite automático).

## Pendientes / a confirmar con el cliente

- **Segundo correo de contacto**: cuando esté disponible, agregarlo junto al actual (`caverco.ad@gmail.com`) en el header, footer y página de contacto.
- **RUT de la empresa**: no incluido en el footer por no haber sido proporcionado; agregar si se requiere mostrarlo.
- **Ajuste fino de tonos**: la paleta negro+dorado se estimó visualmente a partir de una captura del login del ERP; si se dispone de los hex exactos, ajustar `--ink` y `--gold` en `css/styles.css`.

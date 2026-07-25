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

Definida en `css/styles.css` (`:root`). El logo es gris neutro, así que el sitio usa un esquema mayormente blanco/gris con azul corporativo sobrio (`--navy`, `--blue-accent`) solo como acento en textos, íconos y botones — no como fondo de secciones completas. Ajusta las variables CSS si el ERP usa tonos distintos.

## Deploy en Cloudflare Pages

1. Conecta este repositorio en el dashboard de Cloudflare Pages (Workers & Pages → Create → Pages → conectar a Git).
2. Build settings: sin framework, **sin comando de build**, directorio de salida: `/` (raíz).
3. Cloudflare detecta automáticamente la carpeta `functions/` y despliega `functions/api/contact.js` como Pages Function.

## Configurar la base de datos (Cloudflare D1) — solo desde el dashboard

No hace falta instalar `wrangler` ni usar la terminal, todo se hace desde dash.cloudflare.com:

1. **Workers & Pages → D1 SQL Database → Create database**. Nómbrala `caverco_contacts` y créala.
2. Entra a la base recién creada → pestaña **Console** → pega el contenido de `schema.sql` (crea la tabla `contacts`) → **Execute**.
3. Ve al proyecto de Pages (`landinpagecaverco`) → **Settings → Functions → D1 database bindings → Add binding**:
   - Variable name: `DB`
   - D1 database: `caverco_contacts`
4. Guarda y vuelve a la pestaña **Deployments** → en el último deployment, **Retry deployment** (o simplemente espera al próximo push) para que la Function tome el binding nuevo.

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
- **Colores exactos del ERP**: aún no confirmados con capturas/hex reales; la paleta actual (gris neutro + acento azul) es una aproximación profesional basada en el logo.

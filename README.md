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
assets/favicon.svg    Favicon (monograma "CP")
functions/api/contact.js   Cloudflare Pages Function: recibe el formulario y lo guarda en D1
schema.sql             Esquema de la tabla `contacts`
wrangler.toml           Config de Cloudflare Pages + binding de D1
robots.txt, sitemap.xml SEO básico
_headers                Cabeceras de seguridad para Cloudflare Pages
```

## Paleta de colores

Definida en `css/styles.css` (`:root`). Azul corporativo sobrio (`--navy`, `--blue-accent`) sobre fondos blancos/grises. Como aún no se confirmaron los colores exactos del ERP, esta paleta es un punto de partida — ajústala en las variables CSS cuando tengas los valores definitivos.

## Deploy en Cloudflare Pages

1. Conecta este repositorio en el dashboard de Cloudflare Pages (Workers & Pages → Create → Pages → conectar a Git).
2. Build settings: sin framework, **sin comando de build**, directorio de salida: `/` (raíz).
3. Cloudflare detecta automáticamente la carpeta `functions/` y despliega `functions/api/contact.js` como Pages Function.

## Configurar la base de datos (Cloudflare D1)

```bash
# 1. Crear la base de datos
wrangler d1 create caverco_contacts

# 2. Copiar el "database_id" que entrega el comando anterior dentro de wrangler.toml

# 3. Crear la tabla
wrangler d1 execute caverco_contacts --file=./schema.sql --remote
```

4. En el dashboard del proyecto de Pages: **Settings → Functions → D1 database bindings** → agregar binding `DB` apuntando a `caverco_contacts` (necesario si el deploy se hace vía integración con Git; si usas `wrangler pages deploy` directo, el binding de `wrangler.toml` ya es suficiente).

### Consultar los contactos guardados

```bash
wrangler d1 execute caverco_contacts --remote --command "SELECT * FROM contacts ORDER BY created_at DESC;"
```

## DNS (según brief original)

Configurar solo los registros `@` y `www` apuntando al target que entrega Cloudflare Pages. **No tocar** el registro `app`, que pertenece al proyecto del ERP.

1. Agregar dominios personalizados en el proyecto de Pages: `caverco-partners.cl` y `www.caverco-partners.cl`.
2. Verificar que el certificado SSL quede activo (Cloudflare lo emite automático).

## Pendientes / a confirmar con el cliente

- **Colores y logo definitivos**: se usó una paleta provisional (azul corporativo). Ajustar cuando se confirmen los valores exactos usados en el ERP.
- **Número de WhatsApp**: se configuró `+56 9 9235 1976` como número de contacto por WhatsApp (botón flotante + íconos). Confirmar si corresponde o si debe ser el otro número (`+56 9 9444 0557`).
- **Handle de Instagram**: se usó `asesorias_caverco_partnesr_spa` tal como fue indicado. Verificar que no tenga un error de tipeo, ya que de ser así el enlace quedaría roto.
- **Segundo correo de contacto**: cuando esté disponible, agregarlo junto al actual (`caverco.ad@gmail.com`) en el header, footer y página de contacto.
- **RUT de la empresa**: no incluido en el footer por no haber sido proporcionado; agregar si se requiere mostrarlo.

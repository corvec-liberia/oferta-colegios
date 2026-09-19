# Portal CORVEC Nahuatl Chorotega — versión 2

Sitio estático para presentar la oferta técnica y facilitar la vinculación empresarial.

## Contenido
- 9 centros, 109 ofertas por centro y jornada; 35 denominaciones conservadas (no equivalen necesariamente a 35 planes oficiales distintos).
- 10 insumos: 5 PowerPoint y 5 Word. Ver listado exacto en data/catalogo.json.
- Búsqueda sin distinción de tildes; filtros por centro, área y jornada; fichas institucionales y contactos.
- 8 modalidades de vinculación. El formulario prepara un correo local; no envía ni almacena datos.
- Fotografías ilustrativas y fuentes locales: puede abrir index.html sin conexión.

## Abrir
Abrir index.html en un navegador. También puede usar `python -m http.server 8765` dentro de esta carpeta.

## Publicar
Subir el contenido completo de esta carpeta a un hosting estático (ShipStatic, GitHub Pages u otro). index.html debe quedar en la raíz.

## Actualizar
La fuente editable es data/catalogo.json. Después de editarla, actualizar data/catalogo.js con `window.CORVEC_DATA = <JSON>;` para mantener la apertura directa sin servidor.

## Criterios y pendientes
- Liberia: oferta general del Word; el detalle incluye la selección 2027 del PowerPoint, sin confundirla con la oferta consolidada.
- Cañas: el correo diurno incluye una tilde en el original y no se publica como enlace. Se ofrece teléfono. Nombre nocturno Zamara y correo Zamora se mantienen según fuente, pendientes de confirmación.
- Liberia y CINDEA La Palma no incluyen correo/teléfono en sus insumos; no se inventaron contactos.
- Los escudos de CORVEC, Tronadora y el archivo independiente de CINDEA Tilarán quedan pendientes. Se usa marca tipográfica provisional, no un escudo inventado.
- No se publican los documentos originales.
- Fotografías de Pexels de carácter ilustrativo; autores y referencias en data/imagenes.json y en el pie de página. No representan estudiantes ni instalaciones de los centros.
- Áreas son agrupaciones de navegación, no clasificación oficial MEP.

## Verificación
Sintaxis JavaScript; búsquedas y filtros combinados (cocina + Abangares + Nocturna = 1); estado sin resultados; fichas; destinatarios de correo; ausencia de desbordamiento horizontal a 390 y 1440 px.

## Continuidad
El proyecto es independiente de una sesión de chat o una vista previa. Conservar el ZIP y el commit de GitHub. Una URL anónima de ShipStatic puede caducar: reclamarla con la cuenta del propietario si la herramienta proporciona un enlace para ello.


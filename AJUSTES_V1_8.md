# Ajustes funcionales v1.8 · Catálogo y Estudios de Mercado

Esta versión actualiza el prototipo HTML/CSS/JS adjunto sin cambiar el módulo de Proveedores ni incorporar servicios externos. Para abrirlo, utilice `index.html` en Chrome o Edge. La identidad, firma, carga documental y publicación del Catálogo continúan siendo simulaciones del navegador.

## Cambios incorporados

1. **Dictamen presupuestal por solicitud.** El Oficio de Dictamen de Suficiencia Presupuestal se solicita una vez en el encabezado de la solicitud, con un solo documento, estado, archivo e historial. No se ofrece «No aplica». El Área Requirente no puede enviar a CA sin un archivo PDF/PNG/JPG válido; CA puede consultar el mismo archivo y no puede remitir el expediente a Oficialía Mayor si falta. Cada bien/servicio mantiene sus anexos y validaciones propios. En una subsanación, el Dictamen se actualiza y versiona de manera independiente.
2. **Alineación documental.** Las filas del detalle y expediente reservan columnas fijas para nombre, estado y acción. Las tarjetas de carga nivelan sus controles y emplean `subgrid` cuando el navegador lo admite. No se modificó la operación de carga ni previsualización.
3. **Confirmación de firmas.** Al registrar cada firma se presenta inmediatamente el destino siguiente: investigador → Titular del Departamento → Subdirección → Dirección. La Dirección indica si el Estudio quedó autorizado o no autorizado. El botón de confirmación regresa al detalle del Estudio.
4. **Leyenda del Titular.** En «Documentos derivados y firmas» se usa «Firma del Titular del Departamento».
5. **Comprobación temporal del Catálogo.** En «Alta / actualización» aparece una tabla de incorporaciones y actualizaciones realizadas en la pestaña actual, con clave, solicitud, precio anterior/nuevo y acceso a la ficha. La tabla en memoria desaparece al recargar; los registros del Catálogo siguen el mecanismo `localStorage` preexistente.
6. **Artículo 28.** El Área Requirente y la Coordinación Administrativa pueden seleccionar y justificar «No aplica» por bien/servicio en la creación, revisión y subsanación. Los otros roles no reciben controles de edición. Siguen vigentes las reglas condicionales para ficha, especificaciones y demás documentos.

## Compatibilidad y validación

La clave de `localStorage` se mantiene. Al iniciar, los anexos de versiones anteriores se normalizan: si había copias del Dictamen en bienes individuales, se selecciona preferentemente una copia con archivo válido, se ubica en la solicitud y se eliminan las duplicaciones en memoria. **No se fusionan archivos diferentes:** cuando existan varias copias históricas distintas, conviene revisar manualmente cuál fue elegida antes de usarla como expediente real. Los datos DEMO precargados sin binario siguen considerándose «Pendientes».

Pruebas ejecutadas sobre Chromium: solicitud de dos elementos y bloqueo por Dictamen faltante; configuración de Art. 28 por Área Requirente y CA; consulta del archivo por CA y envío a Oficialía Mayor; cuatro confirmaciones de firmas; alta y actualización visibles temporalmente. También se verificó la sintaxis de los tres archivos JavaScript con `node --check`. Estos controles no sustituyen autenticación, autorización ni almacenamiento de producción en servidor.

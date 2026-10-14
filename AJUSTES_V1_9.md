# COMPRAMEX integrado · actualización de proveedores 2026

## Alcance

Se actualizó **Alta y Renovación** del módulo de proveedores a partir del PDF de requisitos 2026. La fuente única del catálogo es `js/provider-requirements-2026.js`; `js/app.js` lo reutiliza en el expediente del proveedor, los conteos, la validación previa al envío y la vista de la autoridad. Se conservan los movimientos Modificación, Duplicado y Reposición y los dos archivos JavaScript del módulo de Catálogo y Estudios de Mercado sin cambios.

La lista de documentos muestra los **numerales 1–23**, con requisitos según persona física o jurídico-colectiva. Son condicionales el oficio por domicilio fiscal en otra entidad, las alternativas fiscales y del IMSS, y los documentos particulares de renovación. El Certificado de Empresa Mexiquense es opcional. Original y copia se muestran como indicación de presentación física, no como dos cargas digitales. La información de derechos se mantiene en una etapa posterior a la validación: **$983.00 MXN** para Alta/Renovación y **$492.00 MXN** para los otros movimientos, cifras de referencia del documento entregado.

## Decisiones de la interfaz

- El formulario ya proporciona trámite, persona y domicilios. En el expediente se selecciona el supuesto fiscal, si cuenta con IMSS y, en renovación, si dispone de cédula anterior y si hubo cambios. Si falta la entidad fiscal, se solicita además confirmar si el domicilio está fuera del Estado de México.
- La declaración anual se desglosa en declaración, acuse y estados financieros; la alternativa dictaminada, nueva creación o persona física en RIF solicita únicamente la opción aplicable. Los estados del mes anterior requieren dos estados y dos anexos del contador. Fotografías y domicilios admiten archivos separados; cuando los domicilios difieren se identifican ambos.
- Los apartados permiten seleccionar, reemplazar o quitar archivos. Solo los apartados con modificaciones del acta constitutiva o soportes de cambios permiten agregar varios al mismo campo; otros documentos compuestos tienen campos separados. Se admiten PDF para documentos e imágenes JPG/PNG para fotografías, con el límite demostrativo existente de **12 MB por archivo**. Los faltantes se muestran en cada fila y al revisar el envío.
- Los archivos **no se guardan en servidor ni sobreviven a una recarga**: los metadatos históricos pueden permanecer en `localStorage` para indicar qué se había elegido, pero nunca cuentan como archivo disponible después de recargar, incluso en los otros movimientos. La vista de autoridad solo abre archivos que siguen disponibles en la sesión actual y no puede validar un expediente sin archivos obligatorios. Tampoco se verifica automáticamente la autenticidad, firma, vigencia o contenido.
- Las fichas y capturas del ejemplo de proveedor no precargan archivos del catálogo nuevo. El ejemplo sirve para probar la selección y envío sin simular que un expediente documental previo fue validado.

El flujo preexistente para **reportar un comprobante de pago** se conserva exclusivamente después de la notificación de la autoridad; no forma parte del catálogo documental ni bloquea el envío inicial. Si se recarga antes de expedir la cédula, la validación y el comprobante demostrativos se reinician porque sus bytes ya no están disponibles; se requiere volver a integrar el expediente y completar la revisión. No existe cobro real.

## Comprobación

| Verificación | Resultado |
| --- | --- |
| Sintaxis de `js/app.js` y `js/provider-requirements-2026.js` con `node --check` | Correcta |
| Aplicabilidad por persona, Alta/Renovación, domicilio, RIF/nueva creación, IMSS, extravío, cambios y certificado opcional con `node --test tests/provider-requirements.test.cjs` | Correcta |
| Recorrido de Chromium: controles condicionales, selección, agregado, reemplazo, retiro, pérdida de bytes tras recarga, bloqueo por expediente incompleto y regresión de Modificación | Correcto |
| Envío de un expediente de Renovación completo sin certificado opcional ni comprobante de pago previo; bloqueo de aprobación sin archivos disponibles y reinicio de comprobante tras recarga | Correcto |
| Archivos `js/catalog-market.js` y `js/market-documents.js` comparados mediante SHA-256 con el ZIP original | Sin cambios |

Para usarlo sin infraestructura, abra `index.html` en Chrome o Edge. También puede servir la carpeta con `python3 -m http.server 3000` y abrir la URL local. Esta versión **no sustituye revisión administrativa ni un repositorio documental institucional**.

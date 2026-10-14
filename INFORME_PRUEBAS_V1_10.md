# CompraMex v1.10 — informe de cambios y pruebas

**Fecha:** 5 de octubre de 2026.  
**Base:** `prototipo-compramex-integrado-v1.9-proveedores-2026.zip`.  
**Resultado:** ajustes implementados directamente sobre el prototipo existente en HTML, CSS y JavaScript. No se reconstruyó la aplicación.

## 1. Alcance y conservación

Se comparó la entrega con los archivos del ZIP original:

- **4 archivos originales modificados:** `index.html`, `js/app.js`, `js/catalog-market.js` y `js/market-documents.js`.
- **17 archivos originales conservados sin cambios**, incluyendo `css/styles.css`, el catálogo documental de proveedores 2026, las pruebas originales, la marca y la documentación histórica.
- **0 archivos originales eliminados.**

Los módulos siguen usando su arquitectura estática y almacenamiento local original. Se agregaron componentes de mapa y estilos complementarios, sin sustituir formularios, campos de domicilio, navegación ni roles.

## 2. Cambios entregados

| Área | Resultado |
| --- | --- |
| Domicilio fiscal | Búsqueda por dirección, mapa interactivo, pin arrastrable, confirmación explícita, coordenadas no editables y fecha persistente. |
| Domicilio comercial igual al fiscal | Selección Sí copia y vincula todos los campos y la georreferenciación. No exige otro mapa ni otra confirmación. |
| Domicilio comercial diferente | Selección No o Editar domicilio comercial habilita captura y ubicación independientes, sin modificar el fiscal. |
| Confirmación | Buscar no confirma. Arrastrar, seleccionar otro punto o cambiar la dirección invalida el estado y requiere reconfirmación. |
| Validación | Alta/Renovación no pueden avanzar después del paso de domicilios ni enviar sin ambas ubicaciones válidas y confirmadas. Guardar borrador sigue permitido. |
| Consulta posterior | Se restauran coordenadas, fecha, estado, centro del mapa y marcador al volver a editar. |
| Dictamen presupuestal | Archivo siempre obligatorio para Área Requirente y CA; validación de existencia/contenido, nueva leyenda y retiro de pregunta/radios del Dictamen. |
| Anexos distintos del Dictamen | Se conservan sus controles condicionales originales. La leyenda retirada fue sustituida en todas las tarjetas de la interfaz. |
| Remisiones | Mensajes exactos con título Solicitud remitida para Área→CA y CA→Oficialía Mayor, después de persistir la operación. Trazabilidad conservada por separado. |
| Fuentes | Agregar fuente deshabilitado sin técnicas, más guardias de apertura y guardado. |
| Fichas | Botones con jerarquía visual vino/dorado y espaciado; numeración, autorizaciones y generación original conservadas. |
| Bitácora impresa | Una sección Técnicas de mercado a nivel estudio/solicitud, fuera del ciclo de bienes/servicios, consolidando técnicas de elementos, fuentes y estudio. |

### Mensajes de remisión verificados

**Área Requirente → Coordinación Administrativa**

> La solicitud ha sido remitida a la Coordinación Administrativa para su revisión y, en su caso, envío a la Oficialía Mayor.

**Coordinación Administrativa → Oficialía Mayor**

> La solicitud ha sido remitida a la Oficialía Mayor para su atención y continuidad del proceso.

Los mensajes no sustituyen los eventos de trazabilidad y no se presentan ante validación fallida o fallo de almacenamiento en la remisión.

## 3. Evidencia de validación

### Resumen

| Ejecución | Resultado |
| --- | --- |
| Sintaxis de todos los JavaScript de aplicación (`node --check`) | Correcta. |
| Suite Node original y adicional (`node --test tests/*.test.cjs`) | **11/11 pruebas o archivos de prueba correctos**; los archivos de mercado y catálogo documental incluyen múltiples aserciones. |
| Flujo integral de proveedores en Chromium/Playwright | **16 comprobaciones correctas**, sin errores JavaScript de aplicación. |
| Flujo integral de mercado en Chromium/Playwright | **22 comprobaciones correctas**, sin errores JavaScript de aplicación. |
| Total de comprobaciones de flujo en navegador | **38 correctas.** |
| Geocodificación real | Photon devolvió coordenadas para Palacio Municipal, Toluca; la búsqueda no confirmó automáticamente. |
| Cartografía real | Se verificó visualmente mapa OpenStreetMap con marcador y controles integrados. |
| Revisión móvil | Vista de 390 px; documento de 390 px, sin desbordamiento horizontal en el formulario revisado. |
| Bitácora de un bien | PDF generado e inspeccionado por extracción: **1** aparición del encabezado Técnicas de mercado. |
| Bitácora de varios bienes | PDF generado e inspeccionado por extracción: **1** aparición del encabezado Técnicas de mercado. |

Los PDF usados para validar la impresión se generaron desde la vista real de documentos del prototipo mediante Chromium con medios de impresión. No son expedientes oficiales.

### Proveedores — comprobaciones en navegador

1. Conservación de campos previos y mapas de ambos domicilios.
2. Bloqueo de Siguiente sin ubicaciones confirmadas.
3. Bloqueo de accesos directos a pasos posteriores para no evadir la validación.
4. Búsqueda real y posicionamiento sin confirmación automática.
5. Confirmación fiscal, coordenadas y fecha.
6. Arrastre real del pin mediante mouse e invalidación de confirmación.
7. Copia de datos, coordenadas, estado y fecha al elegir Sí; un único mapa.
8. Propagación de cambios fiscales al comercial vinculado e invalidación.
9. Edición comercial independiente sin afectar datos ni coordenadas fiscales.
10. Guardado y recarga con coordenadas, fecha, estado y marcadores restaurados.
11. Continuación después de confirmar ambos domicilios.
12. Conservación de compuertas documentales anteriores en revisión y envío.
13. Conservación de datos de proveedores al acceder a Estudio de Mercado.
14. Bloqueo de reenvío desde Seguimiento después de editar una dirección y dejarla pendiente.
15. Continuación del reenvío existente después de reconfirmar.
16. Ausencia de errores JavaScript en el flujo.

Las pruebas Node complementan estos casos con rangos de coordenadas, valores nulos/no numéricos, confirmación explícita, independencia de objetos, desvinculación y serialización JSON.

### Mercado — comprobaciones en navegador

1. Texto de acceso, nueva leyenda del Dictamen y ausencia de sus radios; leyenda retirada de la interfaz.
2. Bloqueo de Área sin Dictamen real, sin mensaje falso de éxito.
3. Rechazo de archivo con extensión PDF y contenido incompatible.
4. Envío Área→CA con archivo válido, mensaje exacto y trazabilidad.
5. Bloqueo del envío CA sin completar la revisión.
6. Envío CA→Oficialía Mayor, mensaje exacto y eventos anteriores conservados.
7. Obligación de Dictamen en inicio directo de CA.
8. Continuación del inicio directo de CA con archivo válido.
9. Asignación y revisión documental original; estudio con dos bienes.
10. Agregar fuente deshabilitado y bloqueo lógico al intentar evadirlo.
11. Habilitación del botón al guardar técnicas.
12. Cuatro fuentes vinculadas a técnicas y elementos, con validaciones previas conservadas.
13. Cálculo de precio y cadena Elaboró→Titular→Subdirección→Dirección.
14. Numeración y generación independiente de dos fichas con los nuevos botones.
15. Apertura correcta de las dos fichas generadas.
16. Bitácora impresa de varios bienes con una sola sección de técnicas.
17. Bitácora impresa de un bien con una sola sección de técnicas.
18. Subsanación con archivo anterior válido, aun cuando exista una antigua selección No almacenada.
19. Reemplazo de Dictamen en subsanación con conservación del historial de versiones.
20. Bloqueo de subsanación cuando sólo existen nombre/metadatos y no hay archivo válido.
21. Fallo de almacenamiento simulado en remisión sin mostrar Solicitud remitida.
22. Ausencia de errores JavaScript durante los flujos anteriores.

Las pruebas de documentos verifican además las marcas X realmente consolidadas de las técnicas: no se limitan a comprobar que los nombres estén impresos.

## 4. Revisión independiente y correcciones

Se realizó una revisión adicional de sólo lectura frente a los requisitos y la versión original. Se mantuvo el alcance solicitado:

- El retiro de pregunta/radios se aplica al Dictamen de Suficiencia; los demás anexos conservan sus reglas de captura originales.
- Los mensajes nuevos de remisión comprueban la persistencia. No se rediseñó el manejo general de cuota de almacenamiento de operaciones ajenas a estos ajustes.
- La consolidación de técnicas se restringe a la Bitácora; no se cambió el formato ni la lógica de las fichas.

Durante las pruebas se corrigieron manejadores de carga que todavía intentaban acceder a radios eliminados del Dictamen. Se incorporó también la guardia geográfica en el reenvío desde Seguimiento. Se volvió a ejecutar el flujo integral ampliado: **sin errores JavaScript**.

## 5. Uso y límites

- Consulte `LEEME_V1_10.md` para abrir el prototipo y reproducir las pruebas.
- Leaflet 1.9.4 se incluye localmente; **cartografía y geocodificación requieren internet**.
- Photon y OpenStreetMap son servicios externos para demostración. La búsqueda es manual y moderada; para producción institucional deben configurarse endpoints apropiados en `js/provider-map-config.js`.
- Las coordenadas y confirmaciones persisten en `localStorage` del navegador/origen utilizado. No hay almacenamiento central ni sincronización entre equipos.
- Los archivos de proveedores siguen disponibles sólo durante la sesión, como en la versión original; esta limitación no se extendió a las coordenadas.
- Se conservan accesos, firmas e integraciones simuladas; no se agregó conexión real al SAT, Contraloría, correo o sistemas presupuestales.
- La vista previa es una herramienta de revisión temporal. El ZIP contiene el prototipo completo para conservarlo y ejecutarlo independientemente.

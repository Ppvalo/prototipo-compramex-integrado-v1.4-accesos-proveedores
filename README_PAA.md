# Programa Anual de Adquisiciones · CompraMex

## Qué se agregó

El prototipo integrado ahora incluye un módulo funcional de **Programa Anual de Adquisiciones (PAA)**. El módulo vive en `js/paa.js` y `css/paa.css`, se carga desde `index.html` y conserva separados los estados de Proveedores y Catálogo/Estudios de Mercado.

La demostración mantiene los datos en `localStorage` bajo la clave `compramexPaaDemoV1`. La separación está preparada para sustituirse por servicios API y una base de datos sin tener que mezclar el estado del resto del portal.

## Acceso de demostración

Desde la tarjeta pública **Programa Anual de Adquisiciones**, seleccione:

| Perfil | Alcance | Capacidades principales |
|---|---|---|
| Área Requirente | Sus registros y su dependencia | Capturar, editar borradores/observados, carga masiva, guardar, enviar, corregir y declarar “Sin requerimientos”. |
| Coordinación Administrativa | Todas las áreas de una dependencia | Revisar, observar, devolver, validar, consultar avances, consolidar, validar previamente, crear versiones y enviar. |
| Dirección General de Recursos Materiales de la Oficialía Mayor | PAA institucionales recibidos | Filtrar dependencias, revisar por área/partida, recibir, observar/devolver, validar, cerrar, descargar e inspeccionar historial. |

La contraseña visible `demo1234` sólo representa el acceso en el prototipo; no se realiza autenticación real.

## Flujo que puede probarse

1. **Área Requirente:** registrar una necesidad o cargar un archivo. El formulario muestra el importe calculado automáticamente como cantidad por precio unitario; el importe está bloqueado para edición.
2. **Selección de área:** cada dependencia tiene áreas demo seleccionables; las dependencias sin catálogo específico reciben automáticamente un área requirente demostrativa. La selección se conserva al ingresar y se vincula al PAA de la dependencia activa.
3. **Validación local:** guardar como borrador no envía. Enviar valida datos obligatorios, partida presupuestaria, programación y coherencia del importe; si falta un dato, el aviso identifica el campo exacto.
4. **Coordinación Administrativa:** revisar registros, observar con motivo obligatorio o validar. La consola muestra el avance por área y el porcentaje de integración.
5. **Consolidación:** abrir la pantalla de consolidación. El botón de envío queda bloqueado mientras existan áreas pendientes, observaciones, registros sin validar o datos incompletos.
6. **Recursos Materiales:** usar el PAA semilla de Secretaría de Seguridad, marcarlo como recibido, devolverlo con observación o validarlo. Un PAA validado puede cerrarse.
7. **Trazabilidad:** revisar Notificaciones y Bitácora desde cualquier rol. Los eventos conservan usuario, rol, fecha/hora, acción, PAA, registro, versión y detalle.

## Carga masiva

La plantilla se descarga desde el dashboard del Área Requirente. Se entrega en CSV compatible con Excel y el cargador también lee `.xlsx` modernos. La carga produce una vista previa y no incorpora filas automáticamente.

Se validan encabezados, campos obligatorios, partida presupuestaria, cantidad, precio, programación, justificación y duplicados. Las filas válidas y con error se separan; sólo las válidas se importan como **Borrador** después de la acción explícita de importar. El formato XLS binario antiguo no se procesa en esta versión; debe guardarse como XLSX o CSV.

## Datos y escenario semilla

El escenario incluye la Secretaría General de Gobierno con cuatro áreas (incluye un caso “Sin requerimientos”) y la Secretaría de Seguridad con un PAA enviado a Recursos Materiales. También hay registros en Borrador, Enviado, Observado y Validado para hacer visible el ciclo sin depender de una API.

Para regresar el estado de la demostración al escenario inicial use **Restablecer demo** en la barra superior. Esto reinicia el estado del PAA de este navegador; no cambia los datos de Proveedores ni Catálogo.

## Límites intencionales de la demostración

No se implementan identidad real, permisos de servidor, firma electrónica, suficiencia presupuestaria, catálogo oficial conectado, envío institucional real, correo, almacenamiento de archivos binarios ni expediente jurídico. Los archivos soporte sólo conservan metadatos durante la demostración.

## Validación ejecutada

- `node --check js/paa.js`
- `node --check js/app.js`
- `node --check js/catalog-market.js`
- `node --test tests/*.test.cjs`
- Comprobación HTTP local y pública.
- Recorrido en navegador de acceso Área Requirente, formulario con importe de sólo lectura, dashboard CA, consolidación, bandeja transversal RM y detalle de PAA recibido.

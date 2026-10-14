# TODO · Programa Anual de Adquisiciones

## Entregado en esta versión

- [x] Agregar al menú del prototipo el acceso **Programa Anual de Adquisiciones** y mostrar dashboards diferentes para Área Requirente, Coordinación Administrativa y Dirección General de Recursos Materiales de la Oficialía Mayor.
- [x] Respetar los ámbitos: Área Requirente sólo ve sus propios registros; Coordinación ve su dependencia; Recursos Materiales consulta PAA institucionales recibidos.
- [x] Registrar necesidades con ejercicio, dependencia, unidad, área, responsable, tipo, capítulo, concepto, partida, clasificador, descripción, características, unidad, cantidad, precio, fuente, calendarización, justificación, observaciones y soporte.
- [x] Calcular automáticamente **Importe estimado = Cantidad × Precio unitario estimado** y bloquear el importe manual.
- [x] Separar capturar/cargar, guardar, validar y enviar; la carga no envía automáticamente.
- [x] Descargar una plantilla oficial compatible con Excel y cargar CSV/TSV/XLSX con encabezados definidos.
- [x] Validar encabezados, tipos, obligatorios, partidas, cantidades, importes, programación y duplicados antes de incorporar filas válidas.
- [x] Implementar los estados de registros requeridos, además de estados de integración y cierre del PAA institucional.
- [x] Permitir a la Coordinación revisar, observar con motivo obligatorio, devolver, validar, consultar pendientes, ver avance, declarar áreas sin requerimientos, consolidar y enviar.
- [x] Implementar la validación previa al envío: áreas integradas o “Sin requerimientos”, sin pendientes/observados, información presupuestaria y programación completas.
- [x] Mostrar confirmación antes de **Enviar PAA a Dirección General de Recursos Materiales** y registrar dependencia, ejercicio, versión, registros, monto, usuario y fecha/hora.
- [x] Mostrar tabla transversal de PAA con filtros por ejercicio, dependencia, estatus, tipo, capítulo y partida.
- [x] Permitir a Recursos Materiales recibir, revisar por área/partida, observar/devolver con motivo obligatorio, validar, cerrar, descargar e inspeccionar historial.
- [x] Conservar versiones enviadas sin eliminación física y registrar motivo, usuario, fecha, montos y cambios.
- [x] Mantener bitácora de sólo lectura con creación, modificación, carga masiva, envíos, devoluciones, observaciones, correcciones, validaciones, consolidación, versiones y notificaciones.
- [x] Mostrar avisos internos para los tres roles.
- [x] Mantener Proveedores y Catálogo/Estudios de Mercado sin regresiones en la suite existente.
- [x] Ejecutar validación de sintaxis, suite original y comprobación HTTP/navegador.

## Siguiente fase sugerida para una integración real

- [ ] Sustituir `localStorage` por API autenticada y base de datos institucional.
- [ ] Integrar identidad institucional, permisos de servidor, firma electrónica y sello de tiempo confiable.
- [ ] Conectar catálogo oficial de partidas, suficiencia presupuestaria y reglas de negocio normativas.
- [ ] Guardar archivos soporte en repositorio institucional y asociar hash, expediente, clasificación y retención.
- [ ] Habilitar correo/notificaciones institucionales y bitácora inmutable de servidor.
- [ ] Añadir importación del XLS binario antiguo sólo si se requiere compatibilidad histórica.

# Plan de implementación · Programa Anual de Adquisiciones

## Alcance aprobado

Agregar el módulo **Programa Anual de Adquisiciones (PAA)** al prototipo CompraMex v1.10 sin modificar ni eliminar Proveedores, Catálogo y Estudios de Mercado. La primera versión será demostrativa Front-End, con estructuras JavaScript separadas y `localStorage`, preparada para sustituirse posteriormente por API/base de datos.

## Enfoque técnico

- Incorporar `js/paa.js` como módulo IIFE independiente, con clave de almacenamiento `compramexPaaDemoV1`.
- Reutilizar el shell existente (`publicView`, `accessView`, `workspace`, `mainNav`, tarjetas, tablas, badges, modales y notificaciones) y añadir sólo `css/paa.css`.
- Exponer un acceso público al módulo y un menú institucional por rol.
- Modelar por separado dependencias, áreas requirentes, usuarios, PAA, registros, partidas, versiones, observaciones, bitácora y notificaciones.
- Mantener el alcance de demostración: no hay autenticación real, API, base de datos, firma electrónica, validación presupuestaria oficial ni correo institucional.

## Roles y permisos

- **Área Requirente:** sólo registros de su área/dependencia; alta, edición de borradores u observados, carga masiva, envío, corrección/reenvío, declaración “Sin requerimientos”, consulta de estatus y notificaciones.
- **Coordinación Administrativa:** todos los registros de su dependencia; revisión, observación, devolución, validación, consolidación, validación previa, nueva versión y envío a Recursos Materiales.
- **Dirección General de Recursos Materiales:** consulta transversal de dependencias; recepción, revisión por partida/área, observaciones, devolución, validación, cierre, descarga e historial.

## Flujo implementado

Captura/carga → borrador → envío a Coordinación → revisión/observación/validación → integración institucional → validación previa → envío a Recursos Materiales → recibido/revisión → devolución o validación → cerrado.

Cada transición agrega usuario, rol, fecha/hora, versión, observación y evento de bitácora. El importe es sólo de lectura y se calcula como cantidad × precio unitario.

## Estructura del proyecto

- `index.html`: punto de entrada, tarjeta pública PAA y carga de estilos/scripts.
- `css/styles.css`: estilos base existentes, sin sustitución.
- `css/paa.css`: componentes visuales específicos del dashboard, tablas, gráficas, flujo y carga masiva.
- `js/app.js`: módulo de Proveedores, sin cambios funcionales.
- `js/catalog-market.js`: Catálogo/Estudios de Mercado, sin cambios funcionales.
- `js/paa.js`: estado, permisos, dashboards, formularios, carga Excel/CSV, consolidación, versiones, notificaciones y auditoría.
- `tests/`: pruebas originales preservadas; se ejecutarán sintaxis, suite existente y comprobaciones de humo del nuevo archivo.

## Decisiones de diseño

Se reutiliza el lenguaje visual institucional existente de **panel administrativo sobrio**: vino/granate para acciones primarias, dorado para hitos, tarjetas blancas, tablas de datos y badges semánticos. La interacción prioriza evidencia y trazabilidad sobre decoración: las etapas se muestran en una línea de proceso, los bloqueos se explican con checklist y las acciones sensibles usan el modal institucional.

Principios: claridad jerárquica, visibilidad del alcance por rol, cálculos transparentes y prevención de envíos incompletos.

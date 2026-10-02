# Trazabilidad funcional · COMPRAMEX integrado v1

## Criterio de construcción

Jerarquía utilizada para el prototipo:

1. Procedimiento institucional **Actualización del Catálogo de Bienes y Servicios a través de Estudios de Mercado**, Primera Edición, enero de 2025.
2. **Especificación funcional para instrumentación digital – Actualización del Catálogo de Bienes y Servicios mediante Estudios de Mercado**, versión 1.1, 2 de septiembre de 2026.
3. Patrones UX/UI y arquitectura Front-End del prototipo existente del Módulo de Proveedores.

El prototipo es demostrativo. No sustituye el procedimiento institucional ni ejecuta servicios productivos.

## Mapeo de pantallas de la especificación

| ID | Pantalla / componente | Representación en el prototipo |
|---|---|---|
| UI-01 | Consulta de Catálogo | `Consulta de catálogo` + consulta pública DEMO |
| UI-02 | Solicitud de alta/actualización | `Nueva solicitud` |
| UI-03 | Bandeja CA | `Solicitudes` filtrables |
| UI-04 | Bandeja IME | `Solicitudes` filtrables por estado/responsable |
| UI-05 | Revisión Art. 28 | Modal `Revisión Art. 28` |
| UI-06 | Estudio de Mercado - Resumen | Detalle del estudio |
| UI-07 | Fuentes | Tabla y alta de fuente |
| UI-08 | Solicitudes de cotización | Representadas mediante estado/historial del estudio |
| UI-09 | Cotizaciones | Tabla de fuentes/cotizaciones |
| UI-10 | Validación de fuente | Cumplimiento técnico, comparabilidad, RFC y Contraloría DEMO |
| UI-11 | Cuadro Comparativo | Mínimo, máximo, promedio y elegibilidad |
| UI-12 | Excepción Art. 18 | Modal de excepción documentada |
| UI-13 | Documento final del Estudio de Mercado | Contenido consolidado en `Generar Bitácora` tras Dirección |
| UI-14 | Bitácora de Estudios de Mercado | Generación por Titular después de la cadena Elaboró → Titular → Subdirección → Dirección |
| UI-15 | Expediente electrónico | Árbol documental + bitácora |
| UI-16 | Alta/actualización del Catálogo | Pantalla `Alta / actualización` |
| UI-17 | Historial/bitácora | Pantalla `Bitácora` |
| UI-18 | Reportes/Tablero | `Dashboard` + `Reportes` |

## Roles representados

- Área requirente / usuaria.
- Coordinación Administrativa.
- Titular del Departamento de Investigación de Mercado Estatal.
- Persona Investigadora de Mercado Estatal.
- Titular de la Subdirección de Investigación de Mercado Estatal.
- Titular de la Dirección de Investigación de Mercado.
- Responsable del Catálogo de Bienes y Servicios.
- Auditor / consulta.

## Reglas funcionales principales representadas

- Consulta previa obligatoria antes de alta.
- Suficiencia de información y documentos antes de avanzar.
- Alta vs. actualización.
- Vinculación del movimiento con Estudio de Mercado.
- Cotizaciones homogéneas y comparables.
- Fuente elegible sólo cuando supera controles técnicos/administrativos representados.
- Fuentes excluidas conservadas en expediente y fuera del cálculo.
- Regla general de dos cotizaciones elegibles.
- Promedio del precio de referencia.
- Excepción Art. 18 documentada cuando N < 2.
- Versionado / no sobrescritura conceptual.
- Expediente único y bitácora.
- Cadena de firmas: Elaboró -> Autorizó -> Revisó -> Dirección.
- Registro posterior y actualización de catálogo después de autorización.

## Integraciones representadas como puntos futuros o simulados

- PMCP / COMPRAMEX productivo.
- Contraloría / Empresas Objetadas.
- Validación fiscal de RFC.
- Correo institucional.
- Identidad institucional / SSO.
- Firma electrónica o institucional.
- Presupuesto.
- Procedimiento adquisitivo.
- Gestor documental.
- Reutilización futura del Catálogo de Proveedores.

## Archivos principales

- `index.html`: portal COMPRAMEX y Módulo de Proveedores existente.
- `css/styles.css`: identidad visual existente + estilos del portal y nuevo módulo.
- `js/app.js`: funcionalidad original del Módulo de Proveedores, conservada.
- `js/catalog-market.js`: nuevo módulo de Catálogo y Estudios de Mercado.
- `README.txt`: instrucciones y alcance.


## Ajustes funcionales v1.1

- **Canal de origen vigente:** Área usuaria/requirente o Coordinación Administrativa → validación de la Coordinación Administrativa → Oficialía Mayor → Investigación de Mercado.
- **Responsabilidad de envío:** únicamente la Coordinación Administrativa envía solicitudes de alta de bienes o servicios a la Oficialía Mayor.
- **UI-02:** carga de documentos con indicador Sí/No y archivo seleccionado; leyenda “Art. 28 del Reglamento de la Ley”.
- **UI-05:** checklist de suficiencia con controles visibles y legibles.
- **UI-06:** catálogo completo de técnicas de investigación y selección múltiple.
- **UI-07:** fuente seleccionada de un Padrón de Proveedores DEMO y controles de elegibilidad visibles.

## Ajuste funcional v1.2 · Bandeja de Coordinación Administrativa

La representación de **UI-03 Bandeja CA** distingue la etapa operativa previa al envío a la Oficialía Mayor:

| Bandeja CA | Uso en el prototipo |
|---|---|
| Recibidas del área requirente | Solicitudes que ingresaron desde el Área usuaria/requirente y aún no han sido tomadas para revisión. |
| Para validar | Solicitudes que la Coordinación Administrativa ya tomó para revisar integración y documentos. |
| Devueltas | Solicitudes con observaciones o insuficiencias que requieren gestión con el Área usuaria/requirente. |
| Enviadas a Oficialía Mayor | Solicitudes que superaron la validación y fueron enviadas exclusivamente por la Coordinación Administrativa. |

Flujo representado: **Área usuaria/requirente o inicio directo de la CA → En validación CA → Oficialía Mayor → Investigación de Mercado**. Si existe devolución por insuficiencia, la solicitud queda visible en **Devueltas** y, después de la subsanación, regresa a **Recibidas del área requirente** como una nueva versión.

## Ajuste funcional v1.5 · Inicio directo y envío exclusivo

- La Coordinación Administrativa puede iniciar una alta de bien o servicio sin solicitud previa de un Área Requirente.
- Las altas iniciadas directamente se incorporan a **Para validar**.
- El Área Requirente conserva la creación y subsanación de sus solicitudes, pero no dispone de una acción de envío a la Oficialía Mayor.
- La acción **Validar y enviar a Oficialía Mayor** está disponible únicamente para la Coordinación Administrativa.
- Los perfiles especializados de la Oficialía Mayor sólo visualizan solicitudes después del envío de la Coordinación Administrativa.

## Ajuste v1.4 · Accesos del Módulo de Proveedores

El portal abierto del Módulo de Proveedores consolida la entrada en dos accesos de nivel superior:

- **Proveedor**: `Nuevo proveedor · Registrarme` e `Ingresar / continuar trámite`.
- **Oficialía Mayor**: `Responsable de asignación` y `Acceso de autoridad`.

La función **Verificar cédula** queda separada debajo de ambos accesos como consulta pública independiente, sin requerir autenticación.

## Ajuste funcional v1.6 · Estudio de Mercado por bien o servicio

| Hito | Responsable | Evidencia y transición |
| --- | --- | --- |
| Solicitud de uno o varios elementos del mismo giro | Área Requirente o Coordinación Administrativa | Folio CAT, alta/actualización/uso vigente inferido por clave; partidas y unidades catalogadas. |
| Primer filtro y remisión | Coordinación Administrativa | Revisión de anexos, presupuesto, POBALIN 059 condicionado y regla Art. 28 configurable; devolución motivada o envío exclusivo a Oficialía Mayor. |
| Asignación y revisión | Titular e investigador asignado | Titular asigna/reasigna con motivo; checklist documental vacío al inicio; correcciones preservan versiones y regresan al analista original. |
| Investigación | Investigador asignado | Técnicas, cotizaciones por elemento, validación única de fuentes, precio y vigencia por elemento; excepciones Art. 18 motivadas cuando corresponda. |
| Documentos derivados | Investigador y expediente | Bitácora consolidada y Ficha de Estudio de Mercado imprimible por elemento; documentos originarios visibles y versionados. |
| Autorizaciones | Titular → Subdirección → Dirección | Se bloquean firmas duplicadas y saltos de etapas; no existe un segundo acto independiente de “Elaboró”. |
| Resultado y comunicación | Dirección → Coordinación Administrativa | Dictamen / Oficio de Resultado **DMR** único ligado al folio CAT y estudio EM; contiene todos los elementos, resultado AUTORIZADA/NO AUTORIZADA. Distinto del Dictamen Técnico POBALIN 059. |
| Publicación | Responsable del Catálogo | Alta o actualización de todos los elementos autorizados, con versión e historial anterior/nuevo; sólo después se concluye el expediente. Uso vigente se traza sin duplicar registro. |

**Limitación de demostración:** identidad y firma son simuladas; adjuntos de hasta 1.5 MB y formatos HTML imprimibles a PDF mediante el navegador. No hay firma electrónica ni validación externa de autenticidad.

## Ajuste funcional v1.7 · Documentos posteriores a Dirección y requisitos por elemento
- Cada elemento conserva anexos y controles propios. Presupuesto es obligatorio al remitir el Área Requirente a CA y al remitir CA a Oficialía Mayor; POBALIN 059 No aplica se muestra como tal y se excluye de faltantes.
- La revisión de CA puede configurar Art. 28 por elemento; la subsanación por elemento conserva historial y versiones.
- La secuencia Elaboró → Titular → Subdirección → Dirección no depende de documentos generados. Las cuatro autorizaciones, únicas y auditables, habilitan Bitácora consolidada y Ficha de Estudio de Mercado.
- Formatos basados en Bitacora.pdf (34 conceptos y tabla de eventos anexa) y Estudio.pdf (seis campos); Bitácora sustituye al Estudio final independiente.

## Ajuste funcional v1.8 · Dictamen único y permisos Art. 28

- Se sustituye la regla histórica de v1.7 que solicitaba presupuesto por elemento: el **Oficio de Dictamen de Suficiencia Presupuestal** se exige una sola vez a nivel solicitud al enviar desde Área Requirente y antes del envío de CA a Oficialía Mayor. No existe «No aplica» para este documento. CA y los demás perfiles con acceso al expediente pueden consultarlo.
- Las fichas, especificaciones, soportes y POBALIN 059 conservan sus controles individuales por bien/servicio.
- Área Requirente y Coordinación Administrativa pueden configurar y justificar Art. 28 «No aplica» por elemento; el resto de perfiles sólo consulta su estado. Los archivos condicionados y demás validaciones mantienen las reglas del prototipo.
- La subsanación versiona el Dictamen por solicitud separadamente de los anexos por elemento. Los registros locales antiguos con Dictamen por elemento se migran al campo único, dando preferencia a un archivo válido.
- Cada firma muestra la confirmación y el siguiente responsable; «Firma del Titular del Departamento» reemplaza la leyenda anterior. El registro del Catálogo ofrece una tabla temporal de altas y actualizaciones completadas en la pestaña actual.

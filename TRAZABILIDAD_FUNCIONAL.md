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
| UI-13 | Documento final del Estudio de Mercado | Acción `Generar Estudio final` |
| UI-14 | Bitácora de Estudios de Mercado | Acción `Generar Bitácora` + cadena de firmas |
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

- **Canal de origen:** Área usuaria/requirente → Coordinación Administrativa → Recursos Materiales → Investigación de Mercado.
- **UI-02:** carga de documentos con indicador Sí/No y archivo seleccionado; leyenda “Art. 28 del Reglamento de la Ley”.
- **UI-05:** checklist de suficiencia con controles visibles y legibles.
- **UI-06:** catálogo completo de técnicas de investigación y selección múltiple.
- **UI-07:** fuente seleccionada de un Padrón de Proveedores DEMO y controles de elegibilidad visibles.

## Ajuste funcional v1.2 · Bandeja de Coordinación Administrativa

La representación de **UI-03 Bandeja CA** se amplía para distinguir la etapa operativa previa a Recursos Materiales:

| Bandeja CA | Uso en el prototipo |
|---|---|
| Recibidas del área requirente | Solicitudes que ingresaron desde el Área usuaria/requirente y aún no han sido tomadas para revisión. |
| Para validar | Solicitudes que la Coordinación Administrativa ya tomó para revisar integración y documentos. |
| Devueltas | Solicitudes con observaciones o insuficiencias que requieren gestión con el Área usuaria/requirente. |
| Enviadas a Recursos Materiales | Solicitudes que superaron la validación de la Coordinación Administrativa y fueron remitidas al siguiente nivel institucional. |

Flujo representado: **Área usuaria/requirente → Recibida en CA → En validación CA → Recursos Materiales → Investigación de Mercado**. Si existe devolución por insuficiencia, la solicitud queda visible en **Devueltas** y, después de la subsanación, regresa a **Recibidas del área requirente** como una nueva versión.

## Ajuste v1.4 · Accesos del Módulo de Proveedores

El portal abierto del Módulo de Proveedores consolida la entrada en dos accesos de nivel superior:

- **Proveedor**: `Nuevo proveedor · Registrarme` e `Ingresar / continuar trámite`.
- **Oficialía Mayor**: `Responsable de asignación` y `Acceso de autoridad`.

La función **Verificar cédula** queda separada debajo de ambos accesos como consulta pública independiente, sin requerir autenticación.

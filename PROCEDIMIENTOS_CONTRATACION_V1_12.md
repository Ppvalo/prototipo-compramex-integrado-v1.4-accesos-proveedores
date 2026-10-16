# Procedimientos de Contratación · COMPRAMEX v1.12

## Alcance

Esta versión modifica el módulo existente de **Procedimientos de Contratación** dentro del prototipo integrado. No se reconstruyeron los módulos de Proveedores, Catálogo/Estudios de Mercado ni Programa Anual de Adquisiciones.

El módulo sigue siendo un prototipo Front-End demostrativo. La sesión, los metadatos documentales y los expedientes de demostración se guardan en `localStorage`; esto no equivale a autenticación, autorización ni almacenamiento institucional de producción.

## Cambios principales

- Se conservó el shell visual, el `accessView`, el `workspace`, la navegación lateral y el modal compartido del prototipo.
- Se sustituyó el catálogo anterior de siete perfiles DEMO por los nueve perfiles funcionales `OM-PC-00` a `OM-PC-08`.
- Se conservaron `Área Requirente` y `Coordinación Administrativa` como perfiles operativos de dependencias, fuera del catálogo de Oficialía Mayor.
- Se separó el catálogo de Procedimientos de los roles exclusivos de Estudios de Mercado.
- Se incorporaron solicitudes con origen `DEPENDENCIA` y `OFICIALIA_MAYOR` en una sola bandeja central.
- Se implementaron adscripciones `OM_CPA`, `OM_DPA_A`, `OM_DPA_B` y `OM_DPA_SA`.
- Se centralizaron permisos, creación configurable, alcance por expediente y transiciones en `js/procedures-rules.js`.
- Se conservan los documentos, asignaciones, actuaciones y bitácora dentro del mismo expediente; una reasignación no crea otro folio.

## Catálogo definitivo de roles

| Clave | Perfil | Adscripción | Alcance principal |
|---|---|---|---|
| `OM-PC-00` | Coordinador de Asignación de Procedimientos Adquisitivos | `OM_CPA` · Coordinación de Procedimientos Adquisitivos | Recepción, revisión inicial, clasificación, asignación, reasignación autorizada, reportes y bitácora |
| `OM-PC-01` | Director de Procedimientos Adquisitivos | `OM_DPA_A`, `OM_DPA_B` o `OM_DPA_SA` | Supervisión y validación de expedientes de su Dirección |
| `OM-PC-02` | Subdirector de Bases e Invitaciones | Dirección A, B o Sector Auxiliar | Coordinación y revisión de bases, convocatorias e invitaciones |
| `OM-PC-03` | Responsable de Bases de Licitaciones Públicas | Dirección A, B o Sector Auxiliar | Elaboración de bases LPN y versiones autorizadas |
| `OM-PC-04` | Responsable de Bases para Invitaciones Restringidas y Adjudicaciones Directas | Dirección A, B o Sector Auxiliar | Preparación de documentación IR/AD |
| `OM-PC-05` | Subdirector de Adquisiciones | Dirección A, B o Sector Auxiliar | Supervisión de ejecución, Comité y gestión contractual en su ámbito |
| `OM-PC-06` | Responsable de Ejecución de Concursos | Dirección A, B o Sector Auxiliar | Registro de actos, etapas operativas y trazabilidad |
| `OM-PC-07` | Responsable de Apoyo a Comité | Dirección A, B o Sector Auxiliar | Integración de sesiones, acuerdos y seguimiento |
| `OM-PC-08` | Responsable de Contratos | Dirección A, B o Sector Auxiliar | Proyectos, versiones y cierre documental contractual |
| `DEP-AR` | Área Requirente | Dependencia y área propia | Crear, guardar, remitir al CA, atender devoluciones y consultar sus solicitudes |
| `DEP-CA` | Coordinación Administrativa | Dependencia propia | Revisar solicitudes de su dependencia, solicitar aclaraciones y remitir a OM |

Los perfiles de Estudios de Mercado —por ejemplo, persona investigadora, titular de investigación, dirección de investigación y responsable del catálogo— no aparecen en el catálogo de Procedimientos de Contratación. El módulo de Estudios de Mercado conserva su propia implementación y catálogo.

## Adscripciones técnicas

- `OM_CPA`: Coordinación de Procedimientos Adquisitivos; corresponde a `OM-PC-00`.
- `OM_DPA_A`: Dirección de Procedimientos Adquisitivos A; admite `OM-PC-01` a `OM-PC-08`.
- `OM_DPA_B`: Dirección de Procedimientos Adquisitivos B; admite `OM-PC-01` a `OM-PC-08`.
- `OM_DPA_SA`: Dirección de Procedimientos Adquisitivos del Sector Auxiliar y Apoyo Intersectorial; admite `OM-PC-01` a `OM-PC-08`.

La misma definición técnica de rol se reutiliza en las tres Direcciones; cambia únicamente la adscripción y, por tanto, el conjunto de expedientes visible.

## Matriz resumida de permisos

| Funcionalidad | OM-PC-00 | OM-PC-01 | OM-PC-02 | OM-PC-03 | OM-PC-04 | OM-PC-05 | OM-PC-06 | OM-PC-07 | OM-PC-08 | DEP-AR | DEP-CA |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Consultar expedientes del alcance | C | C/S | C | C | C | C/S | C | C | C | C | C |
| Recepción y revisión inicial | V | C | — | — | — | C | — | — | — | — | — |
| Clasificar y asignar Dirección | A | — | — | — | — | — | — | — | — | — | — |
| Reasignar con motivo | A* | — | — | — | — | — | — | — | — | — | — |
| Crear solicitud | Sí | Configurable | Configurable | No por defecto | No por defecto | Configurable | No por defecto | No por defecto | No por defecto | Sí | No por defecto |
| Preparar bases LPN | — | S | V | E | — | C | C | C | — | — | — |
| Preparar bases IR/AD | — | S | V | — | E | C | C | C | — | — | — |
| Registrar actuaciones | — | S | C | C | C | S | E | E/C | — | — | — |
| Apoyo y acuerdos de Comité | — | S | C | C | C | S | C | E | — | — | — |
| Gestión contractual | — | S | — | — | — | V/S | C | C | E | — | — |
| Bitácora y reportes | C | S | C | C | C | S | C | C | C | C propia | C ámbito |

`C` = consultar; `E` = elaborar/ejecutar; `V` = revisar/validar; `S` = supervisar; `A` = asignar. El asterisco indica que el motivo, usuario, fecha y hora se conservan en el historial. La matriz es funcional y no constituye autorización jurídica para firmar, fallar o contratar.

## Permiso independiente de creación

La creación no se deduce automáticamente de la consulta ni del nombre del rol. La configuración inicial es:

- Autorizados por defecto: `OM-PC-00` y `DEP-AR`.
- Configurables y no autorizados por defecto: `OM-PC-01`, `OM-PC-02` y `OM-PC-05`.
- No autorizados por defecto: `OM-PC-03`, `OM-PC-04`, `OM-PC-06`, `OM-PC-07`, `OM-PC-08` y `DEP-CA`.

`OM-PC-00` puede guardar la configuración DEMO central de creación desde **Catálogo y permisos**. La configuración no edita las definiciones de rol ni concede asignación, autorización de fallo o firma contractual.

## Flujo de solicitudes de dependencias

1. `DEP-AR` crea la solicitud y puede guardarla como **Borrador**.
2. `DEP-AR` integra objeto, descripción, justificación, tipo, monto, presupuesto y documentos mínimos.
3. `DEP-AR` remite a **Coordinación Administrativa**; el estado pasa a **Enviada a revisión**.
4. `DEP-CA` inicia la revisión; el estado pasa a **Pendiente de revisión inicial**.
5. `DEP-CA` puede devolver a **Devuelta para aclaración**, con motivo obligatorio, o remitir a la Oficialía Mayor.
6. La remisión de `DEP-CA` cambia el estado a **Pendiente de asignación** y conserva el origen `DEPENDENCIA` y las actuaciones previas.
7. `OM-PC-00` recibe la solicitud en la bandeja central, registra la revisión inicial y puede devolverla con motivo.
8. `OM-PC-00` clasifica y asigna a `OM_DPA_A`, `OM_DPA_B` o `OM_DPA_SA`.
9. La Dirección receptora continúa con las actuaciones de su perfil y adscripción.
10. Las aclaraciones, documentos, asignaciones, actuaciones y estados quedan en el mismo folio.

El Área Requirente no tiene acciones de asignación a Dirección.

## Flujo de solicitudes originadas en Oficialía Mayor

1. Un perfil con el permiso de creación selecciona **Nueva solicitud de contratación**.
2. El formulario registra el origen como `OFICIALIA_MAYOR` y la institución como Oficialía Mayor.
3. La solicitud puede guardarse como **Borrador**.
4. El usuario autorizado integra datos, documentos, presupuesto y justificación; el control documental no se omite por el origen.
5. `OM-PC-00` remite la solicitud a **Pendiente de asignación**.
6. La solicitud aparece en la misma bandeja central que las solicitudes de dependencias.
7. `OM-PC-00` realiza la revisión inicial, clasificación y asignación a la Dirección competente.
8. La Dirección receptora continúa las actuaciones de su ámbito.

Crear directamente desde Oficialía Mayor no concede automáticamente facultades de asignación, evaluación, fallo o formalización.

## Estados controlados

- **Borrador**
- **Enviada a revisión**
- **Pendiente de revisión inicial**
- **Pendiente de asignación**
- **Asignada a Dirección**
- **En atención**
- **Devuelta para aclaración**
- **Pendiente de validación**
- **En procedimiento de contratación**
- **Concluida**
- **Cancelada**

El prototipo mantiene por separado `status`, `procedureStatus` y `contractStatus`. Las transiciones se validan en `js/procedures-rules.js`; no existe un salto directo de Borrador a Concluida.

## Datos y trazabilidad

Cada solicitud conserva, entre otros:

- Folio único, origen, institución, unidad, área, creador y fecha.
- Tipo, clasificación, objeto, descripción, justificación, monto sin IVA, moneda, presupuesto y fuente.
- PAA, estudio de mercado y documentos con nombre, usuario y fecha de integración.
- Dirección asignada, perfil responsable, usuario receptor, fecha y motivo de reasignación.
- Estado de solicitud, procedimiento y contrato.
- Bitácora con usuario, perfil, fecha/hora, acción, estado anterior, estado nuevo, detalle, motivo y documento.

## Ejecución local

```bash
cd prototipo-compramex-integrado-v1.10-georreferenciacion-mercado-2026
python3 -m http.server 8000
```

Abrir `http://127.0.0.1:8000/` en un navegador moderno. No se requiere compilación ni instalación de React.

Para probar el módulo:

1. Abra **Procedimientos de Contratación**.
2. En el acceso institucional DEMO seleccione un perfil y su adscripción.
3. Use `OM-PC-00` para revisar la bandeja central, asignar expedientes y abrir **Catálogo y permisos**.
4. Use `DEP-CA` para revisar y remitir una solicitud de una dependencia.
5. Use `DEP-AR` para crear, guardar y remitir una solicitud.
6. Use `OM-PC-01` a `OM-PC-08` con distintas Direcciones para comprobar el aislamiento por adscripción.

## Pruebas incluidas

```bash
node --test tests/*.test.cjs
NODE_PATH=/ruta/a/playwright/node_modules TEST_URL=http://127.0.0.1:8000/ node tests/procedures-flow.e2e.cjs
```

El flujo E2E requiere Chromium y Playwright. Los archivos usados para la prueba son fixtures de demostración; no representan documentos oficiales.

## Despliegue en Vercel

El prototipo es estático. Puede desplegarse la carpeta raíz mediante Vercel CLI o conectando el repositorio:

```bash
npm i -g vercel
vercel --prod
```

No se agregó `vercel.json` porque no se requiere una configuración especial: `index.html` es la entrada y las carpetas `css`, `js` y `assets` deben conservarse junto a ella. El despliegue no convierte `localStorage` en persistencia multiusuario ni crea autenticación real.

## Limitaciones técnicas pendientes

- Login, perfiles, permisos y operaciones siguen simulados en Front-End; para producción se requiere backend, SSO/identidad institucional y autorización en servidor.
- `localStorage` no es una base de datos compartida, no ofrece control de concurrencia ni seguridad de expediente.
- Los archivos se conservan como nombre y metadatos; no se implementó gestor documental, firma electrónica, cifrado ni sellado de tiempo.
- No se conectó el prototipo con presupuesto, PAA productivo, gestor documental, correo, comités, proveedores, Contraloría u otros sistemas institucionales.
- La recomendación AD/IR/LPN es un apoyo configurable de demostración y debe validarse normativamente antes de usarla en producción.
- El botón de cierre documental registra una actuación demostrativa; la firma contractual permanece reservada a la persona legalmente facultada.

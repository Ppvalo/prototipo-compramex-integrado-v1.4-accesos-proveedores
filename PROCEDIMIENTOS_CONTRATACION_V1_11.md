# Procedimientos de Contratación · COMPRAMEX · Documento histórico v1.11

> Esta nota conserva la documentación de la demostración anterior. La especificación vigente, el catálogo definitivo de perfiles y los resultados de pruebas de la actualización se encuentran en `PROCEDIMIENTOS_CONTRATACION_V1_12.md` e `INFORME_PRUEBAS_V1_12.md`.

## Alcance de esta versión

Se incorporó al prototipo integrado un módulo de **Procedimientos de Contratación** con acceso institucional de demostración y navegación propia dentro del mismo shell visual. El módulo es Front-End y persiste la demostración en `localStorage`.

### Flujo funcional

1. **Registro de la necesidad** por Área Requirente o Coordinación Administrativa.
2. **Integración y revisión** del expediente con devolución por observaciones.
3. **Determinación de modalidad por monto** con reglas centralizadas del ejercicio 2026.
4. **Confirmación de modalidad definitiva** por perfil autorizado, con justificación obligatoria si difiere de la sugerencia.
5. **Preparación, publicación o emisión de invitaciones**.
6. **Recepción y apertura** de propuestas.
7. **Evaluación técnica y económica** sin inventar ponderaciones o criterios no proporcionados.
8. **Fallo o resultado**, incluyendo `Sin adjudicación`.
9. **Formalización y cierre** del expediente.

## Datos y controles

El expediente contempla:

- Folio, dependencia o entidad, unidad administrativa, área requirente y Coordinación Administrativa.
- Ejercicio fiscal, tipo de contratación, clasificación, objeto, conceptos/partidas, fuente de financiamiento y responsable.
- Monto estimado **sin IVA**.
- Presupuesto autorizado para adquisiciones, arrendamientos y servicios.
- Referencia al PAA y al estudio de mercado.
- Certificación de disponibilidad presupuestaria como control separado.
- Documentos por etapa, metadatos de archivos, propuestas, eventos, evaluaciones y resultado.
- Bitácora con fecha/hora, usuario, perfil, acción, estado anterior, estado nuevo, observaciones y documentos.
- Filtros por dependencia, unidad administrativa, modalidad, ejercicio y estatus.
- Detección heurística de objetos o partidas similares como alerta de revisión; no determina fraccionamiento ni consecuencias jurídicas.

## Regla normativa configurada

`js/procedures-rules.js` concentra la configuración de 2026 basada en el PDF proporcionado:

- Decreto número 241.
- Presupuesto de Egresos del Gobierno del Estado de México para el ejercicio fiscal 2026.
- Artículo 62, Tabla 19.
- Publicación: 17 de diciembre de 2025.
- Fuente en miles de pesos, convertida a pesos en el prototipo.
- Límites de presupuesto: `$0–$6,500,000`, `>$6,500,000–$13,000,000`, `>$13,000,000–$19,500,000`, `>$19,500,000–$26,000,000` y `>$26,000,000`.
- El presupuesto autorizado selecciona el intervalo; el monto estimado sin IVA se compara contra el límite AD/IR del intervalo para sugerir `AD`, `IR` o `LPN`.
- Los extremos se tratan según la redacción “Mayor de / Hasta”: `$6,500,000` pertenece al primer intervalo y `$26,000,000` al cuarto.
- La disponibilidad presupuestaria se exige antes de validar integración/publicar; el monto autorizado no sustituye la certificación.

> La interfaz muestra la recomendación como apoyo, no como autorización jurídica. La fuente menciona concurso e invitación restringida en el texto introductorio, mientras que la Tabla 19 transcrita presenta columnas AD e IR; se deja una alerta explícita para validar esa relación con la autoridad antes de producción.

## Perfiles DEMO

- Área Requirente
- Coordinación Administrativa
- Personal responsable de la contratación
- Perfil revisor / supervisor
- Perfil autorizado para confirmar modalidad
- Perfil evaluador
- Perfil de consulta / auditoría

Los permisos de Front-End sólo sirven para recorrer el prototipo. La versión productiva requiere autorización, segregación de funciones, autenticación, firma, controles de expediente, validaciones de proveedor y persistencia institucional en backend.

## Archivos incorporados

- `css/procedures.css`: estilos aislados del módulo.
- `js/procedures-rules.js`: configuración y funciones puras para la determinación normativa.
- `js/procedures.js`: estado, vistas, permisos DEMO, formularios, expediente, eventos y bitácora.
- `tests/procedures-rules.test.cjs`: casos de límites, extremos y datos incompletos.

## Validación ejecutada

- `node --check js/procedures-rules.js`
- `node --check js/procedures.js`
- `node tests/procedures-rules.test.cjs`
- Servidor HTTP local y URL pública temporal del Sandbox.
- Navegador Sandbox: acceso al módulo, selección de perfil, dashboard, apertura de expediente, recomendación, control de certificación, publicación y transición a recepción.
- Consola del navegador sin errores después de la prueba interactiva.

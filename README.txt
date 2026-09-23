COMPRAMEX integrado v1.3 · Dependencias y roles

PROTOTIPO MÓDULO DE PROVEEDORES EDOMÉX · V8

Versión demostrativa sin conexión a servicios institucionales ni base de datos.

AJUSTES PRINCIPALES V8
- Se incorpora el documento de requisitos como fuente del expediente documental.
- El portal público y el panel del proveedor contemplan cinco movimientos:
  1) Alta
  2) Renovación
  3) Modificación
  4) Duplicado
  5) Reposición
- Alta y Renovación conservan la captura de la Cédula de Registro e Identificación de Proveedores.
- Modificación, Duplicado y Reposición utilizan una solicitud simplificada y un expediente documental específico.
- El listado de documentos cambia automáticamente según:
  - tipo de trámite;
  - Persona Jurídico Colectiva / Persona Física.
- Los documentos se identifican como obligatorios o condicionales/opcionales.
- Para Renovación se incorporan la Cédula anterior y la carta bajo protesta respecto de cambios fiscales o comerciales.
- Para Modificación se incorporan solicitud por escrito, documento que acredita el cambio, fotografías y Cédula anterior.
- Para Duplicado se incorporan solicitud por escrito, poder notarial y fotografías.
- Para Reposición se incorporan solicitud por escrito, poder notarial, denuncia ante la Fiscalía General de Justicia y fotografías.
- La autoridad puede consultar la información capturada y abrir los documentos digitales del expediente.
- La revisión previa incorpora referencias a vigencia de identificaciones, constancia fiscal, estados financieros y parámetros financieros.
- El control demostrativo del Registro de Empresas Objetadas y Sancionadas se exige antes de autorizar el Alta; para otros movimientos se muestra como control parametrizable.
- Después de la validación favorable se notifica el pago y, una vez validado, se expide la Cédula demostrativa.
- Montos de referencia tomados del documento 2025:
  - Alta / Renovación: $944.00
  - Modificación / Duplicado / Reposición: $472.00
  Estos importes deben parametrizarse en producción conforme a la disposición vigente.

REGLAS DOCUMENTALES REPRESENTADAS
- El documento aportado indica registro en COMPRAMEX y carga de documentos en formato PDF.
- Si la información es correcta se notifica al proveedor para agendar cita.
- Para cotejo se presentan originales o copias certificadas y copias simples.
- Las firmas autógrafas señaladas en los requisitos deben realizarse en tinta azul.
- El prototipo conserva la posibilidad de retroalimentación en línea antes de la cita de cotejo.

FLUJO DEMOSTRATIVO
Portal abierto -> Registro / acceso -> Selección de trámite -> Captura de solicitud/Cédula -> Expediente documental por tipo de persona -> Validación de autoridad -> Retroalimentación -> Cotejo cuando proceda -> Control previo aplicable -> Validación favorable -> Notificación de pago -> Validación del pago -> Expedición de Cédula -> Consulta pública.

IMPORTANTE
La consulta al Registro de Empresas Objetadas y Sancionadas NO es real. En producción deberá realizarse mediante el mecanismo institucional autorizado, con trazabilidad y evidencia de la consulta.

Los archivos seleccionados se conservan sólo durante la sesión del navegador mediante URLs locales. El prototipo guarda únicamente metadatos en almacenamiento local. En producción los documentos deben almacenarse en un repositorio de expediente electrónico con controles de integridad, acceso, auditoría y conservación.

Abrir index.html en Chrome o Edge. No requiere servidor, Node.js ni base de datos.

AMPLIACIÓN FUNCIONAL · RESPONSABLE DE ASIGNACIÓN
- Se incorpora el perfil "Responsable de Asignación del Padrón de Proveedores".
- El perfil recibe solicitudes, consulta datos generales, asigna y reasigna expedientes a analistas/revisores.
- Incluye dashboard con indicadores, bandeja con filtros, carga de trabajo e historial de asignaciones.
- Las asignaciones y reasignaciones se simulan únicamente en Front-End y se conservan en localStorage durante la demostración.
- La solicitud real generada desde el portal pasa a "Pendiente de asignación" antes de aparecer en la bandeja del personal revisor.
- El flujo documental, cotejo, validación, pago y expedición de cédula existente se conserva sin cambios estructurales.

============================================================
AMPLIACIÓN · COMPRAMEX INTEGRADO v1 · SEPTIEMBRE 2026
============================================================

OBJETIVO DE ESTA VERSIÓN
- Conservar el Módulo de Proveedores existente y utilizarlo como uno de los módulos del Portal COMPRAMEX.
- Incorporar un punto de entrada común para Proveedores, Catálogo de Bienes y Servicios, Estudios de Mercado y futuros módulos del ciclo de adquisiciones.
- Incorporar un nuevo prototipo funcional Front-End para la actualización del Catálogo de Bienes y Servicios mediante Estudios de Mercado.

FUENTES FUNCIONALES UTILIZADAS
1) Especificación funcional para instrumentación digital "Actualización del Catálogo de Bienes y Servicios mediante Estudios de Mercado", versión 1.1, 2 de septiembre de 2026.
2) Procedimiento institucional "Actualización del Catálogo de Bienes y Servicios a través de Estudios de Mercado", Primera Edición, enero de 2025, publicado en el Periódico Oficial del Gobierno del Estado de México el 23 de mayo de 2025.
3) El prototipo de Proveedores entregado como base tecnológica y visual.

JERARQUÍA DE INTERPRETACIÓN
Procedimiento institucional fuente -> Especificación funcional -> decisiones UX/UI del prototipo.

NUEVO PORTAL COMPRAMEX
- Inicio común con tarjetas de módulos.
- Módulo de Proveedores: conserva el flujo existente.
- Catálogo y Estudios de Mercado: nuevo acceso institucional con perfiles demostrativos.
- Programa Anual de Adquisiciones y Procedimiento de Compra: aparecen como puntos de integración futura, sin funcionalidad productiva.
- Consulta pública demostrativa del Catálogo.

PERFILES DEMOSTRATIVOS DEL NUEVO MÓDULO
- Área requirente / usuaria.
- Coordinación Administrativa.
- Titular del Departamento de Investigación de Mercado Estatal.
- Persona Investigadora de Mercado Estatal.
- Titular de la Subdirección de Investigación de Mercado Estatal.
- Titular de la Dirección de Investigación de Mercado.
- Responsable del Catálogo de Bienes y Servicios.
- Auditor / consulta.

FUNCIONALIDAD REPRESENTADA · CATÁLOGO
- Consulta previa obligatoria.
- Búsqueda por clave, descripción, familia, partida y tipo.
- Visualización de ficha vigente y precio de referencia demostrativo.
- Solicitud de alta o actualización.
- Validación mínima de información y documentos.
- Advertencia de posibles coincidencias / duplicados.
- Bandeja institucional de solicitudes.
- Asignación a persona investigadora.
- Revisión de suficiencia conforme al artículo 28.
- Devolución para complemento / subsanación con versión.
- Vinculación con un Estudio de Mercado.
- Alta o actualización del registro una vez autorizado el estudio.

FUNCIONALIDAD REPRESENTADA · ESTUDIO DE MERCADO
- Expediente transaccional vinculado a la solicitud origen.
- Técnicas de investigación.
- Fuentes de mercado.
- Cotizaciones y condiciones de comparabilidad.
- Validación técnica, fiscal y de Contraloría en modalidad DEMO.
- Conservación de fuentes excluidas.
- Cuadro comparativo.
- Cálculo del promedio con al menos dos cotizaciones elegibles.
- Flujo de excepción Art. 18 cuando no existen al menos dos cotizaciones elegibles.
- Generación secuencial demostrativa de Estudio de Mercado final y Bitácora.
- Cadena de firmas: Elaboró -> Autorizó -> Revisó -> Dirección.
- Expediente electrónico, bitácora de eventos y reportes.

IMPORTANTE
Este prototipo NO implementa servicios reales ni sustituye el procedimiento institucional.
Las siguientes integraciones están representadas únicamente como puntos funcionales o validaciones simuladas:
- PMCP / COMPRAMEX institucional productivo.
- Secretaría de la Contraloría / empresas objetadas.
- Validación fiscal de RFC.
- Correo institucional.
- SSO / identidad institucional.
- Firma electrónica o certificados.
- Sistema presupuestal.
- Gestor documental.

Los datos, claves, dependencias, personas, RFC, montos y fuentes identificados como DEMO son ficticios y se utilizan exclusivamente para recorrer la lógica de la interfaz.

EJECUCIÓN
Abrir index.html en Chrome o Edge.
No requiere servidor, Node.js ni base de datos.
El estado del nuevo módulo se guarda temporalmente en localStorage del navegador bajo una clave separada del módulo de Proveedores.


AJUSTES v1.1 · 22/09/2026

- La solicitud de alta/actualización del Catálogo se origina exclusivamente en el Área usuaria/requirente.
- El Área usuaria/requirente envía primero a su Coordinación Administrativa; la Coordinación valida y remite a Recursos Materiales. No existe envío directo del Área usuaria a la Oficialía Mayor.
- La sección “Documentos y suficiencia · Art. 28 del Reglamento de la Ley” permite indicar Sí/No por documento y seleccionar un archivo para simular su carga al expediente.
- Se corrigió la visualización de los checkbox del checklist de suficiencia y del formulario de fuentes.
- El Estudio de Mercado incorpora seis técnicas de investigación seleccionables.
- La pantalla “Agregar fuente de mercado” indica y simula selección desde el Padrón de Proveedores de COMPRAMEX.
- Los archivos seleccionados se simulan en Front-End: el prototipo guarda nombre/metadatos, no el binario del documento en servidor.


AJUSTES v1.2 · BANDEJA DE COORDINACIÓN ADMINISTRATIVA
- La Bandeja de la Coordinación Administrativa se divide visualmente en cuatro grupos operativos:
  1) Recibidas del área requirente.
  2) Para validar.
  3) Devueltas.
  4) Enviadas a Recursos Materiales.
- Las solicitudes nuevas llegan primero a “Recibidas del área requirente”.
- La Coordinación Administrativa debe tomar la solicitud mediante “Iniciar validación” antes de poder remitirla.
- Una vez validada, la acción “Validar y remitir a Recursos Materiales” mueve la solicitud a “Enviadas a Recursos Materiales”.
- Las solicitudes devueltas por insuficiencia del Art. 28 aparecen en “Devueltas”.
- Cuando el Área usuaria/requirente subsana, la nueva versión vuelve a “Recibidas del área requirente” para una nueva validación de la Coordinación Administrativa.
- Se incorporan contadores por bandeja, filtros, búsqueda por área requirente y una etiqueta visual de la etapa en Coordinación Administrativa.

/* Catálogo de Alta y Renovación. Reglas digitales demostrativas derivadas del PDF 2026. */
(function (root) {
  'use strict';
  const item = (number, title, hint, physical, extra = {}) => ({
    key: `r${String(number).padStart(2, '0')}`, number, title, hint, physical,
    applies: 'Ambas', optional: false, ...extra
  });
  const catalog = [
    item(1, 'Oficio de solicitud de inscripción o renovación', 'En hoja membretada, dirigido al titular de la Dirección General de Recursos Materiales y firmado. Indicar hasta seis rubros acordes a la actividad económica ante el SAT; fechar el día de la cita.', 'Original'),
    item(2, 'Cédula de registro e identificación de proveedores', 'Requisitada y firmada en tinta azul por el representante legal, tamaño oficio; no se acepta tamaño carta. Fechar el día de la cita.', 'Original'),
    item(3, 'Acta constitutiva y modificaciones', 'Inscritas en el registro público correspondiente. Puede agregar más archivos si existen modificaciones.', 'Original y copia', {applies:'Persona jurídico-colectiva'}),
    item(4, 'Acta de nacimiento', 'Acta de nacimiento del solicitante.', 'Copia', {applies:'Persona física'}),
    item(5, 'Carta Compromiso de Verificación y Actualización de Datos y Documentos', 'En hoja membretada, firmada en tinta azul por el representante legal, con fundamento en los artículos 158 al 162 y fecha de la cita.', 'Original'),
    item(6, 'Poder notarial para actos de administración o dominio', 'Señalar vigencia. Si no se indica, el PDF refiere presunción de tres años conforme al artículo 7.768 del Código Civil del Estado de México.', 'Original y copia', {applies:'Persona jurídico-colectiva'}),
    item(7, 'Identificación oficial vigente', 'INE o pasaporte de la persona física o del representante legal.', 'Original y copia'),
    item(8, 'CURP actualizada', 'Del solicitante o del representante legal.', 'Copia'),
    item(9, 'Dos fotografías tamaño infantil', 'Recientes, a color, fondo blanco, del representante legal o propietario; emitidas por fotoestudio. Adjunte ambas imágenes.', 'Original', {kind:'image'}),
    item(10, 'Constancia de Situación Fiscal del SAT', 'Con cadena digital o sello electrónico, antigüedad no mayor a un mes, domicilio fiscal vigente y actividad preponderante.', 'Copia'),
    item(11, 'Comprobantes de domicilio fiscal y comercial', 'Antigüedad no mayor a tres meses (teléfono, luz, televisión de paga, internet o agua). Distinga ambos domicilios si son diferentes.', 'Copia'),
    item(12, 'Oficio de domicilio en el Estado de México para notificaciones', 'Solo si el domicilio fiscal se encuentra en otra entidad federativa.', 'Original', {condition:'outside'}),
    item(13, 'Manifestación relativa al artículo 69-B del CFF', 'Bajo protesta de decir verdad, de no encontrarse en la lista prevista en dicho artículo. Fechar el día de la cita.', 'Original'),
    item(14, 'Declaración fiscal e información financiera del ejercicio anterior', 'Elegir el supuesto aplicable: declaración anual con acuse y estados financieros, estados financieros dictaminados; para nueva creación, estado de cuenta completo del mes anterior; para persona física en RIF, declaración bimestral más reciente.', 'Copia'),
    item(15, 'Estados financieros del mes inmediato anterior y anexos del contador', 'Estado de Posición Financiera y Estado de Resultados en hoja membretada, firmados en tinta azul por representante legal y contador. Adjuntar además copia de la cédula profesional y de la INE del contador. Verificar periodo aceptable según fecha de cita.', 'Original; copias de los anexos'),
    item(16, 'Opinión positiva de cumplimiento fiscal del SAT', 'En sentido positivo, antigüedad no mayor a 30 días naturales.', 'Copia'),
    item(17, 'Opinión de cumplimiento de seguridad social del IMSS', 'Antigüedad no mayor a 30 días naturales; si no cuenta con IMSS, adjunte un escrito de exposición de motivos dirigido al titular de la Dirección General de Recursos Materiales, firmado por el representante legal o titular.', 'Copia para opinión; alternativa no precisada'),
    item(18, 'Currículum vitae o empresarial', 'Firmado por solicitante o representante legal; incluir listado de productos, bienes muebles y/o servicios ofertados y experiencia comercial, profesional o de servicios. Fechar el día de la cita.', 'Original'),
    item(19, 'Fotografías del interior y exterior de los domicilios', 'Dos imágenes a color del interior y dos del exterior del domicilio fiscal y comercial. Si son domicilios distintos, adjunte las imágenes de cada uno.', 'Copia', {kind:'image'}),
    item(20, 'Ubicación geográfica de los domicilios', 'Del domicilio fiscal y del comercial; identifique cada uno si son diferentes.', 'Copia'),
    item(21, 'Cédula anterior o constancia de extravío', 'Solo renovación. Cédula anterior en original; si se extravió, constancia de la Fiscalía General de Justicia del Estado de México con número de cédula y razón social.', 'Original de la cédula anterior', {onlyRenew:true}),
    item(22, 'Carta sobre cambios fiscales o comerciales', 'Solo renovación. Bajo protesta de decir verdad, indicar si hubo cambios; si los hubo, mencionarlos y anexar documentación que los avale y formatos anexos. Fechar el día de la cita.', 'Original', {onlyRenew:true}),
    item(23, 'Certificado de Empresa Mexiquense', 'Emitido por la Dirección General de Comercio. Carga voluntaria.', 'Copia', {optional:true})
  ];
  const normalize = value => String(value || '').trim().toLocaleLowerCase('es-MX').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  function outsideMexico(form) {
    const value = normalize(form.fiscalEntidad);
    if (!value) return null;
    return !['estado de mexico', 'edo. de mexico', 'edomex', 'estado de mex.', 'mexico'].includes(value);
  }
  function differentAddresses(form) {
    return ['Calle', 'Cp', 'Municipio', 'Entidad'].some(field =>
      normalize(form[`fiscal${field}`]) !== normalize(form[`comercial${field}`]));
  }
  function applicable(form) {
    const physical = form.tipoPersona === 'Persona física';
    return catalog.filter(row =>
      (!row.onlyRenew || form.tipoSolicitud === 'Renovación') &&
      (row.applies === 'Ambas' || row.applies === (physical ? 'Persona física' : 'Persona jurídico-colectiva')) &&
      (row.condition !== 'outside' || outsideMexico(form) !== false));
  }
  function choices(form, context) {
    const physical = form.tipoPersona === 'Persona física';
    const fiscal = ['annual', 'dictaminados', 'new', ...(physical ? ['rif'] : [])];
    return [
      {id:'fiscalCase', label:'Supuesto de la información fiscal (requisito 14)', value:fiscal.includes(context.fiscalCase) ? context.fiscalCase : '', options:[['annual','Declaración anual + acuse + estados financieros'],['dictaminados','Estados financieros dictaminados'],['new','Empresa de nueva creación: estado de cuenta completo'],...(physical ? [['rif','Persona física en RIF: declaración bimestral']] : [])]},
      {id:'imss', label:'¿Cuenta con IMSS? (requisito 17)', value:context.imss || '', options:[['yes','Sí: opinión de cumplimiento del IMSS'],['no','No: escrito de exposición de motivos']]},
      ...(form.tipoSolicitud === 'Renovación' ? [
        {id:'previousCedula', label:'Cédula anterior (requisito 21)', value:context.previousCedula || '', options:[['available','La tengo'],['lost','Se extravió: presentar constancia']]},
        {id:'changes', label:'Cambios fiscales o comerciales (requisito 22)', value:context.changes || '', options:[['no','No hubo cambios'],['yes','Sí hubo cambios y tengo soportes']]}
      ] : []),
      ...(outsideMexico(form) === null ? [{id:'fiscalOutside', label:'Domicilio fiscal fuera del Estado de México (requisito 12)', value:context.fiscalOutside || '', options:[['no','No'],['yes','Sí']]}] : [])
    ];
  }
  function visible(form, context) {
    return applicable(form).filter(row => row.condition !== 'outside' ||
      outsideMexico(form) === true || (outsideMexico(form) === null && context.fiscalOutside === 'yes'));
  }
  function pendingChoices(form, context) {
    return choices(form, context).filter(choice => !choice.value).map(choice => choice.label);
  }
  const slot = (id, label, kind = 'pdf', required = true) => ({id, label, kind, required});
  function slots(row, form, context) {
    const different = differentAddresses(form);
    if (row.number === 9) return [slot('foto1','Fotografía infantil 1','image'),slot('foto2','Fotografía infantil 2','image')];
    if (row.number === 11 || row.number === 20) return [slot('fiscal','Domicilio fiscal'),...(different ? [slot('comercial','Domicilio comercial')] : [])];
    if (row.number === 14) {
      if (context.fiscalCase === 'annual') return [slot('declaracion','Declaración anual'),slot('acuse','Acuse de recibo'),slot('estados','Estados financieros del ejercicio')];
      if (context.fiscalCase === 'dictaminados') return [slot('dictamen','Estados financieros dictaminados')];
      if (context.fiscalCase === 'new') return [slot('cuenta','Estado de cuenta bancario completo del mes anterior')];
      if (context.fiscalCase === 'rif' && form.tipoPersona === 'Persona física') return [slot('bimestral','Declaración bimestral más reciente')];
      return [];
    }
    if (row.number === 15) return [slot('posicion','Estado de Posición Financiera'),slot('resultados','Estado de Resultados'),slot('cedulaContador','Cédula profesional del contador'),slot('ineContador','INE del contador')];
    if (row.number === 17) return context.imss === 'yes' ? [slot('opinion','Opinión del IMSS')] : context.imss === 'no' ? [slot('escrito','Escrito de exposición de motivos')] : [];
    if (row.number === 19) {
      const addresses = different ? [['fiscal','fiscal'],['comercial','comercial']] : [['ambos','fiscal y comercial']];
      return addresses.flatMap(([key, label]) => [1,2].flatMap(number => [slot(`${key}Interior${number}`,`Interior ${label} · foto ${number}`,'image'),slot(`${key}Exterior${number}`,`Exterior ${label} · foto ${number}`,'image')]));
    }
    if (row.number === 21) return context.previousCedula === 'lost' ? [slot('extravío','Constancia de extravío')] : context.previousCedula === 'available' ? [slot('anterior','Cédula anterior')] : [];
    if (row.number === 22) return [slot('carta','Carta bajo protesta'),...(context.changes === 'yes' ? [slot('soportes','Documentación de los cambios y formatos anexos')] : [])];
    return [slot('principal',row.title,row.kind || 'pdf',!row.optional)];
  }
  const api = {catalog, outsideMexico, differentAddresses, applicable, visible, choices, pendingChoices, slots};
  root.ProviderRequirements2026 = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(globalThis);
